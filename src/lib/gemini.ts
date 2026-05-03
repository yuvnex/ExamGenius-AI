import { GoogleGenAI } from "@google/genai";

// Standard initialization for AI Studio environment
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const MODELS = {
  flash: "gemini-3-flash-preview",
  pro: "gemini-3.1-pro-preview",
};
