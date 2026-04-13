import { GoogleGenerativeAI } from "@google/generative-ai";

let geminiModel: any = null;

function getGeminiModel() {
  if (!geminiModel) {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "dummy");
    geminiModel = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      systemInstruction: "You are a helpful assistant for Telugu speakers. Respond concisely and naturally in Telugu script. Avoid transliteration unless requested.",
    });
  }
  return geminiModel;
}

/**
 * Generates a Telugu response for the given user text.
 */
export async function generateTeluguResponse(userText: string): Promise<string> {
  try {
    const model = getGeminiModel();
    const result = await model.generateContent(userText);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate AI response");
  }
}
