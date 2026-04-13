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

