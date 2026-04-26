import { GoogleGenAI, Type } from "@google/genai";

let genAI: GoogleGenAI | null = null;

function getGenAI() {
  if (!genAI) {
    // According to gemini-api skill, we should use process.env.GEMINI_API_KEY directly for React (Vite)
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please ensure it is set in the environment.");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
}

export interface ColorInfo {
  hex: string;
  name: string;
  description: string;
}

export interface PaletteResponse {
  theme: string;
  explanation: string;
  colors: ColorInfo[];
}

export async function generatePalette(word: string): Promise<PaletteResponse> {
  const ai = getGenAI();
  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate an expressive color palette inspired by the word: "${word}". 
    The palette should have exactly 5 colors. 
    The colors should accurately reflect the mood, temperature, and semantic meaning associated with the word. Use appropriate saturation and brightness that best represent the concept.
    Provide a theme name, a brief explanation of why these colors match the word, and for each color, provide its hex code, a descriptive name, and a short reason for its inclusion.`,
    config: {
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
    },
  });

  try {
    const text = result.text;
    if (!text) {
      throw new Error("Empty response from AI");
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse palette response:", error);
    throw new Error("Failed to generate a valid palette. Please try again.");
  }
}
