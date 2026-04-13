import { NextRequest, NextResponse } from "next/server";
import { env } from "../../../config/env";
import { validateTwilioRequest } from "../../../../lib/twilio";
import { WhatsAppProcessor, WhatsAppParams } from "../../../services/whatsapp-processor";

export async function POST(req: NextRequest) {
  console.log("--- Incoming WhatsApp Webhook Request ---");
  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    console.log("Request Params:", params);

    const signature = req.headers.get("x-twilio-signature") || "";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const host = req.headers.get("host");
    const publicUrl = `${protocol}://${host}/api/whatsapp`;
    
    console.log("Constructed Public URL:", publicUrl);
    console.log("Twilio Signature Header:", signature);

    // 1. Signature Validation
    const isValid = validateTwilioRequest(publicUrl, params, signature);
    console.log("Signature Validation Result:", isValid);

    if (!isValid && process.env.NODE_ENV === "production") {
      console.error("Invalid Twilio signature. Access Denied.");
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // 2. Process Message
    console.log("Starting WhatsAppProcessor...");
    const twiml = await WhatsAppProcessor.process(params as unknown as WhatsAppParams);
    console.log("Processor Finished. TwiML Generated.");

    // 3. Return Response
    return new NextResponse(twiml, {
      headers: { "Content-Type": "text/xml" },
    });

  } catch (error: any) {
    console.error("CRITICAL WEBHOOK ERROR:", error.message);
    if (error.stack) console.error(error.stack);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
