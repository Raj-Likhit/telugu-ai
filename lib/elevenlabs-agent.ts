import { v4 as uuidv4 } from 'uuid';
import WebSocket from 'ws';

export interface AgentResponse {
  audio: Buffer;
  text: string;
}

/**
 * Single-turn interaction with an ElevenLabs Conversational AI Agent.
 * Connects via WebSocket using a Signed URL, sends text, and captures the audio response.
 */
export async function generateAgentResponse(text: string): Promise<AgentResponse> {
  const agentId = process.env.ELEVENLABS_AGENT_ID;
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!agentId || !apiKey) {
    throw new Error("Missing ElevenLabs Agent ID or API Key");
  }

  // 1. Get Signed URL for secure WebSocket connection
  let signedUrl: string;
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      {
        headers: {
          "xi-api-key": apiKey,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to get signed URL: ${response.status} ${JSON.stringify(errorData)}`);
    }
    const data = await response.json();
    signedUrl = data.signed_url;
    console.log("DEBUG: Successfully obtained signed URL");
  } catch (error) {
    console.error("Error obtaining signed URL:", error);
    throw error;
  }

  return new Promise((resolve, reject) => {
    // 2. Connect to the WebSocket using the Signed URL
    const ws = new WebSocket(signedUrl);
    
    let audioChunks: Buffer[] = [];
    let agentText = "";

    // Set a timeout to prevent hanging
    const timeout = setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.terminate();
        reject(new Error("ElevenLabs Agent response timed out (60s)"));
      }
    }, 60000);

    ws.on('open', () => {
      console.log("WebSocket connected to ElevenLabs Agent");
      
      // 3. Send Initiation Data to override config for Telugu
      const initiationMessage = {
        type: "conversation_initiation_client_data",
        conversation_config_override: {
          agent: {
            language: "te", 
            prompt: {
              prompt: "You are a helpful assistant talking to the user in Telugu. Respond naturally and briefly. Always respond in Telugu."
            }
          }
        }
      };
      ws.send(JSON.stringify(initiationMessage));
    });

    ws.on('message', (data: WebSocket.Data) => {
      try {
        const message = JSON.parse(data.toString());

        // Handle Ping/Pong
        if (message.type === 'ping' && message.ping_event?.event_id) {
           ws.send(JSON.stringify({
            type: "pong",
            event_id: message.ping_event.event_id
          }));
          return;
        }

        // Send User Message once metadata is received (meaning handshake is ready)
        if (message.type === 'conversation_initiation_metadata') {
          console.log("DEBUG: Handshake complete. Sending user text:", text);
          ws.send(JSON.stringify({
            type: "user_message",
            text: text
          }));
        }

        // Capture Agent Text Response
        if (message.type === 'agent_response' && message.agent_response_event?.agent_response) {
          agentText += message.agent_response_event.agent_response;
        }

        // Capture Audio Data (base64 encoded)
        if (message.type === 'audio' && message.audio_event?.audio_base_64) {
          const chunk = Buffer.from(message.audio_event.audio_base_64, 'base64');
          audioChunks.push(chunk);
        }

        // Detect end of agent's turn or conversation closure
        if (message.type === 'agent_response_end' || message.type === 'conversation_end') {
          console.log("DEBUG: Agent turn finished. Closing connection.");
          ws.close();
        }
      } catch (err) {
        // Skip malformed JSON
      }
    });

    ws.on('close', () => {
      clearTimeout(timeout);
      if (audioChunks.length > 0) {
        resolve({
          audio: Buffer.concat(audioChunks),
          text: agentText
        });
      } else {
        reject(new Error("Agent closed connection abruptly without sending any audio chunks. Check your API key permissions or Agent ID."));
      }
    });

    ws.on('error', (err) => {
      clearTimeout(timeout);
      ws.terminate();
      console.error("WebSocket Error:", err);
      reject(err);
    });
  });
}
