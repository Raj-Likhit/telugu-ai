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
    try {
      console.log(`[Processor] Processing voice message from ${params.From}`);

      // 1. Download Voice Note
      const audioResponse = await fetch(mediaUrl);
      if (!audioResponse.ok) throw new Error("Failed to download Twilio media");
      const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
      console.log(`[Processor] Voice note downloaded: ${audioBuffer.length} bytes`);

      // 2. STT: Deepgram
      const transcription = await transcribeAudio(audioBuffer);
      if (!transcription) {
        console.log("[Processor] No transcription obtained.");
        return generateVoicePlayResponse(""); 
      }
      console.log(`[Processor] Transcription: ${transcription}`);

      // 3. AI Pipeline: LLM -> TTS
      const aiText = await generateSarvamResponse(transcription);
      console.log(`[Processor] AI Response: ${aiText}`);
      const replyAudioBuffer = await generateSarvamSpeech(aiText);
      console.log(`[Processor] Audio generated: ${replyAudioBuffer.length} bytes`);

      // 4. Storage & Response
      const audioUrl = await this.storageAudio(replyAudioBuffer, params.MessageSid);
      console.log(`[Processor] Storage success: ${audioUrl}`);
      return generateVoicePlayResponse(audioUrl);
    } catch (error: any) {
      console.error("[Processor] Error in handleVoiceMessage:", error.message);
      throw error;
    }
  }

  private static async handleTextMessage(params: WhatsAppParams): Promise<string> {
    try {
      const userText = params.Body || "";
      if (!userText) return "<Response />";

      console.log(`[Processor] Processing text message from ${params.From}: ${userText}`);

      // AI Pipeline: LLM -> TTS
      const aiText = await generateSarvamResponse(userText);
      console.log(`[Processor] AI Response: ${aiText}`);
      const replyAudioBuffer = await generateSarvamSpeech(aiText);
      console.log(`[Processor] Audio generated: ${replyAudioBuffer.length} bytes`);

      // Storage & Response
      const audioUrl = await this.storageAudio(replyAudioBuffer, params.MessageSid);
      console.log(`[Processor] Storage success: ${audioUrl}`);
      return generateVoicePlayResponse(audioUrl);
    } catch (error: any) {
      console.error("[Processor] Error in handleTextMessage:", error.message);
      throw error;
    }
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
