const { ElevenLabsClient } = require("elevenlabs");

async function listVoices() {
  const client = new ElevenLabsClient({
    apiKey: "sk_543253c375104ca9db211053d9ced845a614f9373923e4dc",
  });
  try {
    const voices = await client.voices.getAll();
    console.log("Available Voices:");
    voices.voices.forEach(v => {
      console.log(`${v.name}: ${v.voice_id}`);
    });
  } catch (error) {
    console.error("Error listing voices:", error);
  }
}

listVoices();
