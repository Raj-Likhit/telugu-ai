import { NextRequest, NextResponse } from "next/server";
import { env } from "../../../config/env";
import { validateTwilioRequest } from "../../../../lib/twilio";
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
      console.error("Invalid Twilio signature for URL:", publicUrl);
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // 2. Process Message
    const twiml = await WhatsAppProcessor.process(params as unknown as WhatsAppParams);

    // 3. Return Response
    return new NextResponse(twiml, {
      headers: { "Content-Type": "text/xml" },
    });

  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
