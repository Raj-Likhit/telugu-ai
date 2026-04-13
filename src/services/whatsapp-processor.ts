import { put } from "@vercel/blob";
import { 
  validateTwilioRequest, 
  generateVoicePlayResponse,
  sendWhatsAppMessage
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
   * Delivers the response asynchronously via REST API.
   */
  static async process(params: WhatsAppParams): Promise<void> {
    try {
      const mediaUrl = params.MediaUrl0;
      const userPhone = params.From;

      if (mediaUrl) {
        await this.handleVoiceMessage(params, mediaUrl);
      } else {
        await this.handleTextMessage(params);
      }
    } catch (error: any) {
      console.error("[Processor] Fatal error in background process:", error.message);
      // Fallback: Notify user of error via text
      await sendWhatsAppMessage(
        params.From, 
        "క్షమించండి, మీ సందేశాన్ని ప్రాసెస్ చేయడంలో ఒక సమస్య తలెత్తింది. దయచేసి మళ్ళీ ప్రయత్నించండి. (Sorry, there was an issue processing your message.)"
      ).catch(e => console.error("[Processor] Failed to send error fallback:", e.message));
    }
  }

  private static async handleVoiceMessage(params: WhatsAppParams, mediaUrl: string): Promise<void> {
    console.log(`[Processor] Background: Processing voice message from ${params.From}`);

    // 1. Download Voice Note
    const audioResponse = await fetch(mediaUrl);
    if (!audioResponse.ok) throw new Error("Failed to download Twilio media");
    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
    console.log(`[Processor] Voice note downloaded: ${audioBuffer.length} bytes`);

    // 2. STT: Deepgram
    const transcription = await transcribeAudio(audioBuffer);
    if (!transcription) {
      console.log("[Processor] No transcription obtained.");
      await sendWhatsAppMessage(params.From, "క్షమించండి, నాకు మీ వాయిస్ సందేశం అర్థం కాలేదు. (Sorry, I couldn't understand your voice message.)");
      return;
    }
    console.log(`[Processor] Transcription: ${transcription}`);

    // 3. AI Pipeline: LLM -> TTS
    const aiText = await generateSarvamResponse(transcription);
    console.log(`[Processor] AI Response: ${aiText}`);
    const replyAudioBuffer = await generateSarvamSpeech(aiText);
    console.log(`[Processor] Audio generated: ${replyAudioBuffer.length} bytes`);

    // 4. Storage
    const audioUrl = await this.storageAudio(replyAudioBuffer, params.MessageSid);
    console.log(`[Processor] Storage success: ${audioUrl}`);

    // 5. Build and Send Response via REST
    await sendWhatsAppMessage(params.From, aiText, audioUrl);
    console.log("[Processor] Async response delivered.");
  }

  private static async handleTextMessage(params: WhatsAppParams): Promise<void> {
    const userText = params.Body || "";
    if (!userText) return;

    console.log(`[Processor] Background: Processing text message from ${params.From}: ${userText}`);

    // AI Pipeline: LLM -> TTS
    const aiText = await generateSarvamResponse(userText);
    console.log(`[Processor] AI Response: ${aiText}`);
    const replyAudioBuffer = await generateSarvamSpeech(aiText);
    console.log(`[Processor] Audio generated: ${replyAudioBuffer.length} bytes`);

    // Storage
    const audioUrl = await this.storageAudio(replyAudioBuffer, params.MessageSid);
    console.log(`[Processor] Storage success: ${audioUrl}`);

    // Build and Send Response via REST
    await sendWhatsAppMessage(params.From, aiText, audioUrl);
    console.log("[Processor] Async response delivered.");
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
