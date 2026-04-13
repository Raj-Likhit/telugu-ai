require("dotenv").config({ path: ".env.local" });
const { generateSarvamResponse, generateSarvamSpeech } = require("../lib/sarvam");
const fs = require("fs");
const path = require("path");

async function testSarvam() {
  const testText = "నమస్కారం! తెలుగు ఏఐ కి స్వాగతం. మీరు ఎలా ఉన్నారు?";
  
  console.log("--- Testing Sarvam LLM ---");
  try {
    const aiText = await generateSarvamResponse(testText);
    console.log("Sarvam AI Text Response:", aiText || "(Empty response)");

    console.log("\n--- Testing Sarvam TTS (Direct) ---");
    const directText = "నమస్కారం! ఇది సర్వం ఏఐ ద్వారా వస్తున్న ఆడియో.";
    const audioBuffer = await generateSarvamSpeech(directText);
    console.log("Audio Buffer size:", audioBuffer.length);

    const outPath = path.join(__dirname, "sarvam_test_output.mp3");
    fs.writeFileSync(outPath, audioBuffer);
    console.log("Audio saved to:", outPath);
  } catch (err) {
    console.error("Sarvam Test Error:", err);
  }
}

testSarvam();
