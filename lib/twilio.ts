import { validateRequest } from "twilio";
import { env } from "../src/config/env";

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
 * Generates a TwiML response to play an audio file.
 */
export function generateVoicePlayResponse(audioUrl: string): string {
  // IMPORTANT: For WhatsApp Messaging, we use <Message> and <Media> verbs.
  // <Play> is exclusively for Voice calls.
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>
        ${audioUrl ? `<Media>${audioUrl}</Media>` : '<Body>క్షమించండి, ఆడియో లోడ్ అవ్వలేదు.</Body>'}
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
