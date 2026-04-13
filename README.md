# 🇮🇳 Telugu AI - WhatsApp Voice Assistant

Telugu AI is a high-fidelity voice and text assistant built exclusively for the Telugu language. It uses state-of-the-art Indian language models from **Sarvam AI** and **Deepgram** to provide natural, human-like voice interactions over WhatsApp.

---

## 🚀 Step-by-Step Setup Guide

### 1. Get Your API Keys
You will need accounts and API keys from the following services:

*   **[Sarvam AI](https://www.sarvam.ai/)**: Used for the LLM (Sarvam-30b) and TTS (Bulbul v3).
*   **[Deepgram](https://console.deepgram.com/)**: Used for Telugu Speech-to-Text (STT).
*   **[Twilio](https://www.twilio.com/console)**: For the WhatsApp Sandbox and messaging.
*   **[Vercel Blob](https://vercel.com/storage/blob)**: To store and serve generated audio replies.

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory and add the following keys:

```env
# Twilio Credentials
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Deepgram (STT)
DEEPGRAM_API_KEY=your_key

# Sarvam AI (LLM & TTS)
SARVAM_API_KEY=your_key

# Vercel Blob (Storage)
BLOB_READ_WRITE_TOKEN=your_token

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app-url.vercel.app
```

> [!IMPORTANT]
> The application performs a startup validation. If any of the critical keys (Sarvam, Deepgram, Twilio) are missing, the server will throw an error immediately.

### 3. Set Up Twilio WhatsApp Sandbox
1.  Go to the [Twilio Console > Messaging > Try it Out > WhatsApp Sandbox](https://www.twilio.com/console/sms/whatsapp/learn).
2.  Connect your phone by sending the join code (e.g., `join word-word`).
3.  In the **Sandbox Settings**, set the **"When a message comes in"** URL to:
    `https://your-app-url.vercel.app/api/whatsapp`
4.  Ensure the method is set to **HTTP POST**.

### 4. Local Development & Testing
If you are testing locally, use a tool like **ngrok** to expose your local server:

1.  Start the dev server: `npm run dev`
2.  Run ngrok: `ngrok http 3000`
3.  Copy the `https` URL from ngrok and paste it into the Twilio Sandbox settings as explained in Step 3.

### 5. Interaction
*   **Text Message**: Send a message in Telugu to the sandbox number. You will receive an audio reply in Telugu.
*   **Voice Message**: Send a voice note. The assistant will transcribe it, reason in Telugu, and send back a high-quality voice response.

---

## 🛠 Architecture Overview

The project is designed with a modular, service-oriented architecture:

- **`src/app/api/whatsapp/route.ts`**: The entry point that validates signatures and handles the HTTP request.
- **`src/services/whatsapp-processor.ts`**: The core orchestrator that manages the STT -> LLM -> TTS pipeline.
- **`lib/`**: Contains specialized wrappers for [Sarvam AI](file:///lib/sarvam.ts), [Deepgram](file:///lib/deepgram.ts), and [Twilio](file:///lib/twilio.ts).

---

## 🚢 Deployment (Vercel)

1.  Connect your GitHub repository to Vercel.
2.  Add all the variables from your `.env.local` to the **Environment Variables** section in the Vercel dashboard.
3.  Deploy! Vercel will automatically configure the Blob storage if you follow the setup wizard in the "Storage" tab.

---

> [!TIP]
> **Performance Optimization**: We use Deepgram's `nova-2` model for lightning-fast Telugu transcription and Sarvam's `bulbul:v3` for premium audio quality.
