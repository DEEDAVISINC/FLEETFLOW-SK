'use client';

import { sendGridService } from './sendgrid-service';

// Types for 2FA
export interface TwoFactorCode {
  code: string;
  userId: string;
  email: string;
  method: 'sms' | 'email';
  expiresAt: Date;
  attempts: number;
  verified: boolean;
}

export interface TwoFactorResult {
  success: boolean;
  message: string;
  requiresSetup?: boolean;
  availableMethods?: ('sms' | 'email')[];
}

export interface UserContact {
  email: string;
  phone?: string;
  name: string;
  role: string;
}

/**
 * Two-Factor Authentication Service for FleetFlow
 * Handles SMS and Email verification codes for all internal roles
 */
export class TwoFactorAuthService {
  private activeCodes: Map<string, TwoFactorCode> = new Map();
  private readonly codeLength = 6;
  private readonly codeExpiry = 10 * 60 * 1000; // 10 minutes
  private readonly maxAttempts = 3;

  // Demo user contact information (in production, store in database)
  private userContacts: Map<string, UserContact> = new Map([
    [
      'admin@fleetflow.com',
      {
        email: 'admin@fleetflow.com',
        phone: '+1234567890',
        name: 'FleetFlow Admin',
        role: 'admin',
      },
    ],
    [
      'dispatch@fleetflow.com',
      {
        email: 'dispatch@fleetflow.com',
        phone: '+1234567891',
        name: 'Dispatch Manager',
        role: 'dispatcher',
      },
    ],
    [
      'driver@fleetflow.com',
      {
        email: 'driver@fleetflow.com',
        phone: '+1234567892',
        name: 'John Smith',
        role: 'driver',
      },
    ],
    [
      'broker@fleetflow.com',
      {
        email: 'broker@fleetflow.com',
        phone: '+1234567893',
        name: 'Sarah Wilson',
        role: 'broker',
      },
    ],
    // VENDOR ACCOUNTS - Unified into main FleetFlow system
    [
      'vendor@abcmanufacturing.com',
      {
        email: 'vendor@abcmanufacturing.com',
        phone: '+1234567894',
        name: 'ABC Manufacturing Corp',
        role: 'vendor',
      },
    ],
    [
      'vendor@retaildist.com',
      {
        email: 'vendor@retaildist.com',
        phone: '+1234567895',
        name: 'Retail Distribution Inc',
        role: 'vendor',
      },
    ],
    [
      'vendor@techsolutions.com',
      {
        email: 'vendor@techsolutions.com',
        phone: '+1234567896',
        name: 'Tech Solutions LLC',
        role: 'vendor',
      },
    ],
  ]);

  /**
   * Generate secure 6-digit verification code
   */
  private generateCode(): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.info(`🔢 Generated 6-digit verification code: ${code}`);
    return code;
  }

  /**
   * Get available 2FA methods for user
   */
  getAvailableMethods(email: string): ('sms' | 'email')[] {
    const contact = this.userContacts.get(email);
    if (!contact) return [];

    const methods: ('sms' | 'email')[] = ['email']; // Email always available
    if (contact.phone) {
      methods.push('sms');
    }
    return methods;
  }

  /**
   * Send 2FA code via specified method
   */
  async sendVerificationCode(
    email: string,
    method: 'sms' | 'email' = 'email'
  ): Promise<TwoFactorResult> {
    try {
      const contact = this.userContacts.get(email);
      if (!contact) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Generate new verification code
      const code = this.generateCode();
      const codeId = `${email}_${method}`;

      const verificationCode: TwoFactorCode = {
        code,
        userId: email,
        email,
        method,
        expiresAt: new Date(Date.now() + this.codeExpiry),
        attempts: 0,
        verified: false,
      };

      // Store code
      this.activeCodes.set(codeId, verificationCode);

      // Send code based on method
      if (method === 'email') {
        await this.sendEmailCode(contact, code);
      } else if (method === 'sms' && contact.phone) {
        await this.sendSMSCode(contact, code);
      } else {
        return {
          success: false,
          message: 'SMS not available for this user',
        };
      }

      // Auto-cleanup expired codes
      setTimeout(() => {
        this.activeCodes.delete(codeId);
      }, this.codeExpiry);

      return {
        success: true,
        message: `Verification code sent via ${method}`,
      };
    } catch (error) {
      console.error('Error sending verification code:', error);
      return {
        success: false,
        message: 'Failed to send verification code',
      };
    }
  }

  /**
   * Send verification code via email
   */
  private async sendEmailCode(
    contact: UserContact,
    code: string
  ): Promise<void> {
    // 🚨 DEVELOPMENT MODE: Log verification code for testing
    console.info(`🔐 FLEETFLOW 2FA CODE for ${contact.email}: ${code}`);
    console.info(`📧 Code expires in 10 minutes. Use this for testing!`);

    const subject = '🔐 FleetFlow - Your Verification Code';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🚛 FleetFlow</h1>
          <p style="color: #e0e7ff; margin: 5px 0 0 0;">The Salesforce of Transportation</p>
        </div>

        <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border-left: 4px solid #3b82f6;">
          <h2 style="color: #1e3a8a; margin: 0 0 20px 0;">Security Verification Required</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">
            Hello <strong>${contact.name}</strong>,
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 1.5;">
            A login attempt was made to your FleetFlow ${contact.role} account. To complete your sign in, please use the verification code below:
          </p>

          <div style="background: white; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #1e3a8a; letter-spacing: 4px; font-family: monospace;">
              ${code}
            </span>
          </div>

          <p style="color: #ef4444; font-size: 14px; margin: 20px 0 0 0;">
            ⚠️ This code expires in 10 minutes. If you didn't request this code, please contact your FleetFlow administrator immediately.
          </p>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #94a3b8; font-size: 12px;">
            © ${new Date().getFullYear()} FleetFlow. All rights reserved.
          </p>
        </div>
      </div>
    `;

    await sendGridService.sendEmail({
      to: { email: contact.email, name: contact.name },
      template: {
        subject,
        html: htmlContent,
        text: `FleetFlow Security Code: ${code}\n\nYour verification code is: ${code}\n\nThis code expires in 10 minutes.\n\n- FleetFlow Security Team`
      },
      category: '2fa_verification'
    });
  }

  /**
   * Send verification code via SMS (using existing Twilio service)
   */
  private async sendSMSCode(contact: UserContact, code: string): Promise<void> {
    // 🚨 DEVELOPMENT MODE: Log SMS verification code for testing
    console.info(`📱 FLEETFLOW SMS 2FA CODE for ${contact.email}: ${code}`);
    console.info(`📞 Code expires in 10 minutes. Use this for testing!`);

    // Note: This would use your existing Twilio service
    // For now, we'll log it (in production, integrate with TwilioService)
    const message = `FleetFlow Security Code: ${code}\n\nDo not share this code. Expires in 10 minutes.\n\n- FleetFlow Security Team`;

    // TODO: Integrate with existing TwilioService:
    // await twilioService.sendSMS(contact.phone, message);
  }

  /**
   * Verify 2FA code
   */
  verifyCode(
    email: string,
    inputCode: string,
    method: 'sms' | 'email' = 'email'
  ): TwoFactorResult {
    const codeId = `${email}_${method}`;
    const storedCode = this.activeCodes.get(codeId);

    if (!storedCode) {
      return {
        success: false,
        message: 'Verification code not found or expired',
      };
    }

    // Check if code is expired
    if (new Date() > storedCode.expiresAt) {
      this.activeCodes.delete(codeId);
      return {
        success: false,
        message: 'Verification code has expired',
      };
    }

    // Check attempt limits
    if (storedCode.attempts >= this.maxAttempts) {
      this.activeCodes.delete(codeId);
      return {
        success: false,
        message: 'Too many failed attempts. Please request a new code.',
      };
    }

    // Increment attempt counter
    storedCode.attempts++;

    // Verify code
    if (storedCode.code === inputCode.trim()) {
      storedCode.verified = true;
      this.activeCodes.delete(codeId); // Clean up after successful verification

      return {
        success: true,
        message: '2FA verification successful',
      };
    } else {
      const remainingAttempts = this.maxAttempts - storedCode.attempts;
      return {
        success: false,
        message: `Invalid code. ${remainingAttempts} attempts remaining.`,
      };
    }
  }

  /**
   * Check if user needs 2FA setup
   */
  requiresTwoFactorSetup(email: string): boolean {
    const contact = this.userContacts.get(email);
    return !contact; // In production, check if user has 2FA configured
  }

  /**
   * Clean up expired codes (maintenance function)
   */
  cleanupExpiredCodes(): void {
    const now = new Date();
    for (const [key, code] of this.activeCodes.entries()) {
      if (now > code.expiresAt) {
        this.activeCodes.delete(key);
      }
    }
  }

  /**
   * Start automatic cleanup interval (client-side only)
   */
  startCleanupInterval(): void {
    // Only run on client side to avoid hydration issues
    if (typeof window !== 'undefined' && !this.cleanupInterval) {
      this.cleanupInterval = setInterval(
        () => {
          this.cleanupExpiredCodes();
        },
        5 * 60 * 1000
      ); // 5 minutes
    }
  }

  /**
   * Stop automatic cleanup interval
   */
  stopCleanupInterval(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  private cleanupInterval: NodeJS.Timeout | null = null;
}

// Singleton instance
export const twoFactorAuthService = new TwoFactorAuthService();
