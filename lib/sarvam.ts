import axios from 'axios';
import { env } from '../src/config/env';

export interface SarvamChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

export interface SarvamTTSResponse {
  audios: string[];
}

/**
 * Generates a Telugu response from Sarvam AI's LLM.
 */
export async function generateSarvamResponse(text: string): Promise<string> {
  try {
    const response = await axios.post<SarvamChatCompletionResponse>(
      "https://api.sarvam.ai/v1/chat/completions",
      {
        model: "sarvam-30b",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant talking to the user in Telugu. Respond naturally and briefly. Always respond in Telugu."
          },
          {
            role: "user",
            content: text
          }
        ]
      },
      {
        headers: {
          "api-subscription-key": env.SARVAM_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0]?.message?.content || "";
  } catch (error: any) {
    const details = error.response?.data?.error?.message || error.message;
    throw new Error(`Sarvam LLM Error: ${details}`);
  }
}

/**
 * Converts Telugu text to speech using Sarvam AI's Bulbul v3 model.
 */
export async function generateSarvamSpeech(text: string): Promise<Buffer> {
  try {
    const response = await axios.post<SarvamTTSResponse>(
      "https://api.sarvam.ai/text-to-speech",
      {
        text: text,
        target_language_code: "te-IN",
        speaker: "priya", 
        model: "bulbul:v3"
      },
      {
        headers: {
          "api-subscription-key": env.SARVAM_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data?.audios?.length > 0) {
      return Buffer.from(response.data.audios[0], 'base64');
    }

    throw new Error("No audio data returned");
  } catch (error: any) {
    const details = error.response?.data?.error?.message || error.message;
    throw new Error(`Sarvam TTS Error: ${details}`);
  }
}

export interface SarvamResponse {
  text: string;
}

/**
 * Generates a Telugu response from Sarvam AI's LLM (Sarvam-105b).
 */
export async function generateSarvamResponse(text: string): Promise<string> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) throw new Error("Missing SARVAM_API_KEY");

  try {
    const response = await axios.post(
      "https://api.sarvam.ai/v1/chat/completions",
      {
        model: "sarvam-30b",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant talking to the user in Telugu. Respond naturally and briefly. Always respond in Telugu."
          },
          {
            role: "user",
            content: text
          }
        ]
      },
      {
        headers: {
          "api-subscription-key": apiKey,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0]?.message?.content || "";
  } catch (error: any) {
    console.error("Sarvam LLM Error:", error.response?.data || error.message);
    throw new Error("Failed to generate response from Sarvam AI");
  }
}

/**
 * Converts Telugu text to speech using Sarvam AI's Bulbul v3 model.
 * Returns the audio as a Buffer.
 */
export async function generateSarvamSpeech(text: string): Promise<Buffer> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) throw new Error("Missing SARVAM_API_KEY");

  try {
    const response = await axios.post(
      "https://api.sarvam.ai/text-to-speech",
      {
        text: text,
        target_language_code: "te-IN",
        speaker: "priya", // High quality female voice for Telugu
        model: "bulbul:v3"
      },
      {
        headers: {
          "api-subscription-key": apiKey,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data && response.data.audios && response.data.audios.length > 0) {
      // Sarvam returns an array of base64 strings
      const base64Audio = response.data.audios[0];
      return Buffer.from(base64Audio, 'base64');
    }

    throw new Error("Sarvam TTS returned no audio data");
  } catch (error: any) {
    console.error("Sarvam TTS Error:", error.response?.data || error.message);
    throw new Error("Failed to generate speech from Sarvam AI");
  }
}
