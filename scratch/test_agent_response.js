require("dotenv").config({ path: ".env.local" });
const { generateAgentResponse } = require("../lib/elevenlabs-agent");
const fs = require("fs");
const path = require("path");

async function testAgent() {
  console.log("Testing ElevenLabs Agent interaction...");
  try {
    const { audio, text } = await generateAgentResponse("Namaste! Meeru ela unnaru?");
    console.log("Agent Thought/Text:", text);
    console.log("Audio Buffer size:", audio.length);

    const outPath = path.join(__dirname, "agent_test_output.mp3");
    fs.writeFileSync(outPath, audio);
    console.log("Audio saved to:", outPath);
  } catch (err) {
    console.error("Agent Test Error:", err);
  }
}

testAgent();
