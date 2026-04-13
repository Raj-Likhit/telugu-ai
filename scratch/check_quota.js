const { ElevenLabsClient } = require("@elevenlabs/elevenlabs-js");

async function checkQuota() {
  const client = new ElevenLabsClient({
    apiKey: "sk_543253c375104ca9db211053d9ced845a614f9373923e4dc",
  });

  try {
    const user = await client.user.getSubscription();
    console.log("Quota Info:");
    console.log(`- Character Count: ${user.character_count}`);
    console.log(`- Character Limit: ${user.character_limit}`);
    console.log(`- Remaining: ${user.character_limit - user.character_count}`);
    console.log(`- Reset Date: ${new Date(user.next_character_count_reset_unix * 1000).toLocaleDateString()}`);
  } catch (error) {
    console.error("Error checking quota:", error);
  }
}

checkQuota();
