import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { 
  validateTwilioRequest, 
  generateVoicePlayResponse 
} from "../../../../lib/twilio";
import { transcribeAudio } from "../../../../lib/deepgram";
import { generateSarvamResponse, generateSarvamSpeech } from "../../../../lib/sarvam";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    console.log("Incoming WhatsApp Message from:", params["From"]);

    // 1. Validate Twilio Request (Optional for initial sandbox testing)
    const signature = req.headers.get("x-twilio-signature") || "";
    // Reconstruct public URL for validation if needed
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const host = req.headers.get("host");
    const publicUrl = `${protocol}://${host}/api/whatsapp`;
    
    // Check signature validation
    const isValid = validateTwilioRequest(publicUrl, params, signature);
    if (!isValid && process.env.NODE_ENV === "production") {
      console.error("Invalid Twilio signature for URL:", publicUrl);
      // For strict security, you should return 403 here:
      // return new NextResponse("Unauthorized", { status: 403 });
    }

    const mediaUrl = params["MediaUrl0"];
    
    // Check if it's a voice message
    if (!mediaUrl) {
      console.log("No media found. User likely sent text.");
      const userText = params["Body"] || "";
      if (userText) {
          console.log("Processing text message with ElevenLabs Agent");
          const { audio: replyAudio, text: aiText } = await generateAgentResponse(userText);
          console.log("Agent Text Response:", aiText);
          
          const { url: audioUrl } = await put(`replies/${Date.now()}.mp3`, replyAudio, {
            access: "public",
            contentType: "audio/mpeg",
          });
          return new NextResponse(generateVoicePlayResponse(audioUrl), {
            headers: { "Content-Type": "text/xml" },
          });
      }
      return new NextResponse("<Response />", { headers: { "Content-Type": "text/xml" } });
    }

    // --- Voice-to-Voice Pipeline ---

    // 2. Download Voice Note from Twilio
    const audioResponse = await fetch(mediaUrl);
    if (!audioResponse.ok) throw new Error("Failed to download Twilio media");
    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

    // 3. STT: Deepgram (Telugu)
    const transcription = await transcribeAudio(audioBuffer);
    console.log("User Transcribed Text:", transcription);

    if (!transcription) {
       return new NextResponse(generateVoicePlayResponse(""), { 
        headers: { "Content-Type": "text/xml" } 
      });
    }

    // 4. Sarvam AI: Intelligence then Voice (Two-step pipeline)
    console.log("Generating response with Sarvam AI LLM...");
    const aiText = await generateSarvamResponse(transcription);
    console.log("Sarvam AI Text Response:", aiText);

    console.log("Converting text to speech with Sarvam AI TTS...");
    const replyAudioBuffer = await generateSarvamSpeech(aiText);

    // 5. Storage: Vercel Blob (Twilio needs a public URL to play)
    const fileName = `replies/${params["MessageSid"] || Date.now()}.mp3`;
    const { url: finalAudioUrl } = await put(fileName, replyAudioBuffer, {
      access: "public",
      contentType: "audio/mpeg",
    });

    console.log("Generated Final Audio URL:", finalAudioUrl);

    // 6. TwiML: Instruct Twilio to Play the Audio
    return new NextResponse(generateVoicePlayResponse(finalAudioUrl), {
      headers: { "Content-Type": "text/xml" },
    });

  } catch (error) {
    console.error("WhatsApp Webhook Error:", error);
    // Generic fallback or error message can be returned as TwiML if needed
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
