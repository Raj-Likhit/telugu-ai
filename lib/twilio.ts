import { validateRequest, Twilio } from "twilio";
import { env } from "../src/config/env";

// Initialize the Twilio REST Client
const twilioClient = new Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

/**
 * Validates the Twilio request signature.
 */
export function validateTwilioRequest(
  url: string,
  params: Record<string, string>,
  signature: string
): boolean {
  return validateRequest(
    env.TWILIO_AUTH_TOKEN,
    signature,
    url,
    params
  );
}

/**
 * Sends a WhatsApp message via the Twilio REST API.
 * This is used for async responses to bypass webhook timeouts.
 */
export async function sendWhatsAppMessage(
  to: string,
  body: string,
  mediaUrl?: string
): Promise<void> {
  console.log(`[Twilio] Sending REST message to ${to}...`);
  await twilioClient.messages.create({
    from: env.TWILIO_WHATSAPP_NUMBER,
    to: to,
    body: body,
    mediaUrl: mediaUrl ? [mediaUrl] : undefined,
  });
  console.log(`[Twilio] Message delivered to API for ${to}`);
}

/**
 * Generates an empty TwiML response for immediate webhook acknowledgement.
 */
export function generateEmptyResponse(): string {
  return `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;
}

/**
 * Generates a TwiML response to play an audio file (Legacy / Sync fallback).
 */
export function generateVoicePlayResponse(audioUrl: string, bodyText?: string): string {
  // IMPORTANT: For WhatsApp Messaging, we use <Message> and <Media> verbs.
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>
        ${bodyText ? `<Body>${bodyText}</Body>` : ""}
        ${audioUrl ? `<Media>${audioUrl}</Media>` : ""}
    </Message>
</Response>`;
}

/**
 * Generates a TwiML response to send a text message (optional fallback).
 */
export function generateMessageResponse(message: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${message}</Message>
</Response>`;
}
