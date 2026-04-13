import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: '.env.local' });

async function checkAgent() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;

  console.log("Checking Agent:", agentId);
  try {
    const response = await axios.get(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
      headers: { 'xi-api-key': apiKey }
    });
    console.log("Agent Config:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.error("Error Status:", error.response.status);
      console.error("Error Data:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
  }
}

checkAgent();
