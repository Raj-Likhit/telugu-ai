import { createClient } from "@deepgram/sdk";
import { env } from "../src/config/env";

/**
 * Transcribes audio buffer using Deepgram Nova-2 (Telugu).
 */
export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    const deepgram = createClient(env.DEEPGRAM_API_KEY);
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: "nova-2",
        language: "te",
        smart_format: true,
      }
    );

    if (error) throw error;

    const transcript = result?.results?.channels[0]?.alternatives[0]?.transcript;
    return transcript || "";
  } catch (error: any) {
    throw new Error(`Deepgram Transcription Error: ${error.message}`);
  }
}
