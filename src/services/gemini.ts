import { GoogleGenAI, Type } from "@google/genai";

// Ensure API key is present, otherwise provide a meaningful error at runtime
function getAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Please set it in your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
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
  const response = await fetch("/api/palette", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ word }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to generate palette");
  }

  return response.json();
}
