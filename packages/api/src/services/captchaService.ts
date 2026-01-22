import { config } from '../config/index.js';

interface RecaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

export const captchaService = {
  /**
   * Check if CAPTCHA validation is required
   */
  isRequired(): boolean {
    return config.recaptcha.isRequired;
  },

  /**
   * Validate a reCAPTCHA token
   * @param token - The reCAPTCHA token from the client
   * @returns true if valid, false otherwise
   */
  async validateToken(token: string): Promise<boolean> {
    if (!config.recaptcha.privateKey) {
      return false;
    }

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: config.recaptcha.privateKey,
        response: token,
      }),
    });

    const data: RecaptchaResponse = await response.json();
    return data.success;
  },
};
