import { DeepgramClient } from "@deepgram/sdk";

let deepgram: DeepgramClient | null = null;

function getDeepgram() {
  if (!deepgram) {
    deepgram = new DeepgramClient({ apiKey: process.env.DEEPGRAM_API_KEY || "" });
  }
  return deepgram;
}

/**
 * Transcribes audio buffer using Deepgram Nova-2 (Telugu).
 */
export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    const client = getDeepgram();
    const response = await client.listen.v1.media.transcribeFile(
      audioBuffer,
      {
        model: "nova-2",
        language: "te", // Telugu
        smart_format: true,
      }
    );

    // Check for results in the response (SyncResponse)
    const syncResponse = response as any;
    if (syncResponse.results && syncResponse.results.channels) {
      const transcript = syncResponse.results.channels[0]?.alternatives[0]?.transcript;
      return transcript || "";
    }

    return "";
  } catch (error) {
    console.error("Deepgram Error:", error);
    throw new Error("Failed to transcribe audio");
  }
}
