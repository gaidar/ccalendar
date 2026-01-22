import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from root directory
const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : '.env.development';

// Try loading from root directory (for local dev), then fallback to default
dotenv.config({ path: path.resolve(__dirname, '../../../../', envFile) });
dotenv.config(); // Also load local .env if present

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3001'),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  // Email configuration
  MAILGUN_API_KEY: z.string().optional(),
  MAILGUN_DOMAIN: z.string().optional(),
  FROM_EMAIL: z.string().email().default('noreply@countrycalendar.app'),
  REPLY_TO_EMAIL: z.string().email().default('support@countrycalendar.app'),
  ADMIN_EMAIL: z.string().email().optional(),
  // OAuth - optional in development, only enabled if configured
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_APP_ID: z.string().optional(),
  FACEBOOK_APP_SECRET: z.string().optional(),
  APPLE_CLIENT_ID: z.string().optional(),
  APPLE_TEAM_ID: z.string().optional(),
  APPLE_KEY_ID: z.string().optional(),
  APPLE_PRIVATE_KEY: z.string().optional(),
  // Sentry configuration
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ENVIRONMENT: z.string().optional(),
  APP_VERSION: z.string().optional().default('1.0.0'),
});

function validateEnv(): z.infer<typeof envSchema> {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    // Use console.error here since logger may not be initialized yet
    // This is during startup before the app is fully configured
    console.error('Environment validation failed:');
    result.error.issues.forEach(issue => {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    });
    process.exit(1);
  }

  return result.data;
}

const env = validateEnv();

export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  database: {
    url: env.DATABASE_URL,
  },
  redis: {
    url: env.REDIS_URL,
  },
  jwt: {
    secret: env.JWT_SECRET,
    accessExpiry: env.JWT_ACCESS_EXPIRY,
    refreshExpiry: env.JWT_REFRESH_EXPIRY,
  },
  frontend: {
    url: env.FRONTEND_URL,
  },
  email: {
    mailgunApiKey: env.MAILGUN_API_KEY,
    mailgunDomain: env.MAILGUN_DOMAIN,
    from: env.FROM_EMAIL,
    replyTo: env.REPLY_TO_EMAIL,
    adminEmail: env.ADMIN_EMAIL,
    get isConfigured() {
      return !!(env.MAILGUN_API_KEY && env.MAILGUN_DOMAIN);
    },
  },
  oauth: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      get isConfigured() {
        return !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
      },
    },
    facebook: {
      appId: env.FACEBOOK_APP_ID,
      appSecret: env.FACEBOOK_APP_SECRET,
      get isConfigured() {
        return !!(env.FACEBOOK_APP_ID && env.FACEBOOK_APP_SECRET);
      },
    },
    apple: {
      clientId: env.APPLE_CLIENT_ID,
      teamId: env.APPLE_TEAM_ID,
      keyId: env.APPLE_KEY_ID,
      privateKey: env.APPLE_PRIVATE_KEY,
      get isConfigured() {
        return !!(env.APPLE_CLIENT_ID && env.APPLE_TEAM_ID && env.APPLE_KEY_ID && env.APPLE_PRIVATE_KEY);
      },
    },
    // OAuth is only enabled in production when at least one provider is configured
    get isEnabled() {
      return env.NODE_ENV === 'production' && (
        this.google.isConfigured || this.facebook.isConfigured || this.apple.isConfigured
      );
    },
  },
  sentry: {
    dsn: env.SENTRY_DSN,
    environment: env.SENTRY_ENVIRONMENT || env.NODE_ENV,
    release: env.APP_VERSION,
    get isConfigured() {
      return !!env.SENTRY_DSN;
    },
  },
} as const;

export type Config = typeof config;
