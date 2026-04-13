import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

let elevenLabsClient: ElevenLabsClient | null = null;

function getElevenLabsClient() {
  if (!elevenLabsClient) {
    elevenLabsClient = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY || "dummy",
    });
  }
  return elevenLabsClient;
}

/**
 * Generates audio file from Telugu text using ElevenLabs Multilingual v2.
 * Returns the audio as a Buffer.
 */
export async function generateSpeech(text: string): Promise<Buffer> {
  try {
    const client = getElevenLabsClient();
    const audioStream = await client.textToSpeech.convert(
      process.env.ELEVENLABS_VOICE_ID || "21m00T84X9ccid9uR70t", // Default voice (Rachel)
      {
        model_id: "eleven_multilingual_v2",
        text: text,
      }
    );

    // Convert stream to Buffer
    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  } catch (error) {
    console.error("ElevenLabs Error:", error);
    throw new Error("Failed to generate speech");
  }
}
