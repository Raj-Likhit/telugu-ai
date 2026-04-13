import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { validateTwilioRequest, generateEmptyResponse } from "../../../../lib/twilio";
import { WhatsAppProcessor, WhatsAppParams } from "../../../services/whatsapp-processor";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    const signature = req.headers.get("x-twilio-signature") || "";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const host = req.headers.get("host");
    const publicUrl = `${protocol}://${host}/api/whatsapp`;
    
    // 1. Signature Validation
    const isValid = validateTwilioRequest(publicUrl, params, signature);
    if (!isValid && process.env.NODE_ENV === "production") {
      console.error("Invalid Twilio signature. Access Denied.");
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // 2. Background Processing (Firestore & AI)
    // We use Vercel's waitUntil to keep the function alive after responding
    waitUntil(WhatsAppProcessor.process(params as unknown as WhatsAppParams));

    // 3. Immediate Acknowledgment
    // Return empty TwiML to satisfy Twilio's webhook requirement instantly
    return new NextResponse(generateEmptyResponse(), {
      headers: { "Content-Type": "text/xml" },
    });

  } catch (error: any) {
    console.error("CRITICAL WEBHOOK ERROR:", error.message);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
