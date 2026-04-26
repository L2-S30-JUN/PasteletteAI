import { GoogleGenAI, Type } from "@google/genai";

let genAI: GoogleGenAI | null = null;

function getGenAI() {
  if (!genAI) {
    // In AI Studio, process.env.GEMINI_API_KEY is automatically provided.
    // For external deployments like Vercel, we can also check for VITE_ prefix.
    const apiKey = ((import.meta as any).env.VITE_GEMINI_API_KEY as string) || (process.env.GEMINI_API_KEY as string);
    
    if (!apiKey || apiKey === "undefined") {
      throw new Error("GEMINI_API_KEY is missing. If you're on Vercel, please add VITE_GEMINI_API_KEY to your environment variables.");
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
    model: "gemini-1.5-flash", // Using stable 1.5-flash for reliability
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
