const { ElevenLabsClient } = require("@elevenlabs/elevenlabs-js");

async function testTTS() {
  const client = new ElevenLabsClient({
    apiKey: "sk_543253c375104ca9db211053d9ced845a614f9373923e4dc",
  });

  console.log("Starting TTS convert...");
  try {
    const response = await client.textToSpeech.convert(
      "21m00Tcm4TlvDq8ikWAM", // New 2026 Rachel ID
      {
        model_id: "eleven_multilingual_v2",
        text: "Namaste! Telugu AI ikkada.",
      }
    );
    console.log("TTS Success! Response type:", typeof response);
    // If it didn't throw, the 404 is likely gone.
  } catch (error) {
    console.error("TTS Error:", error);
  }
}

testTTS();
