import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge', // Using edge for faster response if possible, but regular node is fine too. 
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { word } = await req.json();
    if (!word) {
      return new Response(JSON.stringify({ error: 'Word is required' }), { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is missing' }), { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = ai.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `Generate an expressive color palette inspired by the word: "${word}". 
    The palette should have exactly 5 colors. 
    The colors should accurately reflect the mood, temperature, and semantic meaning associated with the word. Use appropriate saturation and brightness that best represent the concept.
    Provide a theme name, a brief explanation of why these colors match the word, and for each color, provide its hex code, a descriptive name, and a short reason for its inclusion.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theme: { type: Type.STRING },
            explanation: { type: Type.STRING },
            colors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  hex: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["hex", "name", "description"],
              },
            },
          },
          required: ["theme", "explanation", "colors"],
        },
      }
    });

    const data = JSON.parse(result.response.text());
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Vercel Edge Function Error:", error);
    return new Response(JSON.stringify({ error: 'Failed to generate palette' }), { status: 500 });
  }
}
