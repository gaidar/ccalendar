import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { config } from './index.js';
import { oauthService, type OAuthProfile } from '../services/oauthService.js';

/**
 * Configure Passport strategies for OAuth providers
 * Only configures strategies that have valid credentials
 */
export function configurePassport(): void {
  // Google OAuth Strategy
  if (config.oauth.google.isConfigured) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: config.oauth.google.clientId!,
          clientSecret: config.oauth.google.clientSecret!,
          callbackURL: `${config.frontend.url}/api/auth/google/callback`,
          scope: ['email', 'profile'],
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            if (!email) {
              return done(new Error('Email not provided by Google'));
            }

            const oauthProfile: OAuthProfile = {
              provider: 'google',
              providerId: profile.id,
              email,
              name: profile.displayName || email.split('@')[0],
              emailVerified: profile.emails?.[0]?.verified ?? true,
            };

            const result = await oauthService.findOrCreateOAuthUser(oauthProfile);
            // Type assertion needed: Passport expects User type but we pass LoginResult
            // This is intentional - OAuth routes handle the LoginResult structure
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            done(null, result as any);
          } catch (error) {
            done(error as Error);
          }
        }
      )
    );
  }

  // Facebook OAuth Strategy
  if (config.oauth.facebook.isConfigured) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: config.oauth.facebook.appId!,
          clientSecret: config.oauth.facebook.appSecret!,
          callbackURL: `${config.frontend.url}/api/auth/facebook/callback`,
          profileFields: ['id', 'emails', 'name', 'displayName'],
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            if (!email) {
              return done(new Error('Email permission required'));
            }

            const oauthProfile: OAuthProfile = {
              provider: 'facebook',
              providerId: profile.id,
              email,
              name: profile.displayName || `${profile.name?.givenName} ${profile.name?.familyName}`.trim() || email.split('@')[0],
            };

            const result = await oauthService.findOrCreateOAuthUser(oauthProfile);
            // Type assertion needed: Passport expects User type but we pass LoginResult
            // This is intentional - OAuth routes handle the LoginResult structure
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            done(null, result as any);
          } catch (error) {
            done(error as Error);
          }
        }
      )
    );
  }

  // Note: Apple Sign In is handled differently (POST callback with JWT)
  // and is implemented directly in the route handler
}

export { passport };
