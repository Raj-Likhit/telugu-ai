import { validateRequest } from "twilio";

/**
 * Validates the Twilio request signature.
 */
export function validateTwilioRequest(
  url: string,
  params: Record<string, string>,
  signature: string
): boolean {
  return validateRequest(
    process.env.TWILIO_AUTH_TOKEN!,
    signature,
    url,
    params
  );
}

/**
 * Generates a TwiML response to play an audio file.
 */
export function generateVoicePlayResponse(audioUrl: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Play>${audioUrl}</Play>
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
