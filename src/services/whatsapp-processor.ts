import { put } from "@vercel/blob";
import { 
  validateTwilioRequest, 
  generateVoicePlayResponse 
} from "../../lib/twilio";
import { transcribeAudio } from "../../lib/deepgram";
import { 
  generateSarvamResponse, 
  generateSarvamSpeech 
} from "../../lib/sarvam";

export interface WhatsAppParams {
  From: string;
  Body?: string;
  MediaUrl0?: string;
  MessageSid?: string;
}

export class WhatsAppProcessor {
  /**
   * Processes an incoming WhatsApp message (voice or text).
   * Returns a TwiML response string.
   */
  static async process(params: WhatsAppParams): Promise<string> {
    const mediaUrl = params.MediaUrl0;

    if (mediaUrl) {
      return this.handleVoiceMessage(params, mediaUrl);
    } else {
      return this.handleTextMessage(params);
    }
  }

  private static async handleVoiceMessage(params: WhatsAppParams, mediaUrl: string): Promise<string> {
    console.log(`Processing voice message from ${params.From}`);

    // 1. Download Voice Note
    const audioResponse = await fetch(mediaUrl);
    if (!audioResponse.ok) throw new Error("Failed to download Twilio media");
    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

    // 2. STT: Deepgram
    const transcription = await transcribeAudio(audioBuffer);
    if (!transcription) {
      console.log("No transcription obtained.");
      return generateVoicePlayResponse(""); 
    }
    console.log(`User: ${transcription}`);

    // 3. AI Pipeline: LLM -> TTS
    const aiText = await generateSarvamResponse(transcription);
    console.log(`AI: ${aiText}`);
    const replyAudioBuffer = await generateSarvamSpeech(aiText);

    // 4. Storage & Response
    const audioUrl = await this.storageAudio(replyAudioBuffer, params.MessageSid);
    return generateVoicePlayResponse(audioUrl);
  }

  private static async handleTextMessage(params: WhatsAppParams): Promise<string> {
    const userText = params.Body || "";
    if (!userText) return "<Response />";

    console.log(`Processing text message from ${params.From}: ${userText}`);

    // AI Pipeline: LLM -> TTS
    const aiText = await generateSarvamResponse(userText);
    const replyAudioBuffer = await generateSarvamSpeech(aiText);

    // Storage & Response
    const audioUrl = await this.storageAudio(replyAudioBuffer, params.MessageSid);
    return generateVoicePlayResponse(audioUrl);
  }

  private static async storageAudio(buffer: Buffer, messageSid?: string): Promise<string> {
    const fileName = `replies/${messageSid || Date.now()}.mp3`;
    const { url } = await put(fileName, buffer, {
      access: "public",
      contentType: "audio/mpeg",
    });
    return url;
  }
}
