/**
 * Centralized environment variable configuration and validation.
 */

interface Config {
  SARVAM_API_KEY: string;
  DEEPGRAM_API_KEY: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_WHATSAPP_NUMBER: string;
  BLOB_READ_WRITE_TOKEN: string;
}

const requiredEnvVars: (keyof Config)[] = [
  "SARVAM_API_KEY",
  "DEEPGRAM_API_KEY",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_WHATSAPP_NUMBER",
  "BLOB_READ_WRITE_TOKEN",
];

function validateEnv(): Config {
  const config = {} as Config;
  const missing: string[] = [];
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

  for (const key of requiredEnvVars) {
    const value = process.env[key];
    if (!value) {
      missing.push(key);
    } else {
      config[key] = value;
    }
  }

  if (missing.length > 0) {
    const errorMsg = `Missing required environment variables: ${missing.join(", ")}`;
    if (isBuildPhase) {
      console.warn(`[Build Warning] ${errorMsg}. This is expected if build-time secrets are not provided.`);
      // Fill with placeholders to prevent crashes during page data collection
      missing.forEach(key => (config[key as keyof Config] = "place-holder-for-build"));
    } else {
      throw new Error(errorMsg);
    }
  }

  return config;
}

export const env = validateEnv();
