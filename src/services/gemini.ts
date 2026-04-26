import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate an expressive color palette inspired by the word: "${word}". 
    The palette should have exactly 5 colors. 
    The colors should accurately reflect the mood, temperature, and semantic meaning associated with the word. Use appropriate saturation and brightness that best represent the concept (e.g., vibrant for "energy", deep for "midnight", but still allow soft tones if the word suggests them).
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
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Failed to parse palette response:", error);
    throw new Error("Failed to generate a valid palette. Please try again.");
  }
}
