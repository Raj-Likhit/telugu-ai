import { DeepgramClient } from "@deepgram/sdk";
import { env } from "../src/config/env";

/**
 * Transcribes audio buffer using Deepgram Nova-2 (Telugu).
 */
export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    const deepgram = new DeepgramClient({ apiKey: env.DEEPGRAM_API_KEY });
    const response = await deepgram.listen.v1.media.transcribeFile(
      audioBuffer,
      {
        model: "nova-2",
        language: "te",
        smart_format: true,
      }
    );

    const transcript = (response as any).results?.channels[0]?.alternatives[0]?.transcript;
    return transcript || "";
  } catch (error: any) {
    throw new Error(`Deepgram Transcription Error: ${error.message}`);
  }
}
