/**
 * Centralized environment variable configuration and validation.
 */

interface Config {
  SARVAM_API_KEY: string;
  DEEPGRAM_API_KEY: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  BLOB_READ_WRITE_TOKEN: string;
}

const requiredEnvVars: (keyof Config)[] = [
  "SARVAM_API_KEY",
  "DEEPGRAM_API_KEY",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "BLOB_READ_WRITE_TOKEN",
];

function validateEnv(): Config {
  const config = {} as Config;
  const missing: string[] = [];

  for (const key of requiredEnvVars) {
    const value = process.env[key];
    if (!value) {
      missing.push(key);
    } else {
      config[key] = value;
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return config;
}

export const env = validateEnv();
