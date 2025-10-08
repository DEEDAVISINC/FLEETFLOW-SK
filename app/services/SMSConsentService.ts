/**
 * FLEETFLOW SMS CONSENT SERVICE
 *
 * Manages SMS opt-in consent for Twilio compliance
 * Tracks user consent, opt-out requests, and consent history
 *
 * Required for TCPA and Twilio toll-free verification compliance
 */

export interface SMSConsent {
  userId: string;
  phoneNumber: string;
  granted: boolean;
  grantedAt?: Date;
  revokedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  consentMethod: 'registration' | 'account_settings' | 'api' | 'sms_reply';
  consentText?: string; // The exact opt-in text the user saw/agreed to
}

export interface SMSConsentHistory {
  userId: string;
  phoneNumber: string;
  action: 'opt_in' | 'opt_out';
  timestamp: Date;
  method: string;
  ipAddress?: string;
  userAgent?: string;
}

class SMSConsentService {
  private static instance: SMSConsentService;

  // In production, this would be stored in a database
  private consents: Map<string, SMSConsent> = new Map();
  private consentHistory: SMSConsentHistory[] = [];

  // The opt-in text that users see during registration
  public readonly OPT_IN_TEXT = `I agree to receive SMS text messages from FleetFlow regarding load alerts, shipment updates, dispatch notifications, payment reminders, and service updates. Message frequency varies based on your activity and preferences. Message and data rates may apply. You can opt-out at any time by replying STOP to any message. Reply HELP for assistance.`;

  private constructor() {}

  public static getInstance(): SMSConsentService {
    if (!SMSConsentService.instance) {
      SMSConsentService.instance = new SMSConsentService();
    }
    return SMSConsentService.instance;
  }

  /**
   * Record user SMS consent
   */
  public async recordConsent(params: {
    userId: string;
    phoneNumber: string;
    consentMethod: SMSConsent['consentMethod'];
    ipAddress?: string;
    userAgent?: string;
  }): Promise<SMSConsent> {
    const consent: SMSConsent = {
      userId: params.userId,
      phoneNumber: params.phoneNumber,
      granted: true,
      grantedAt: new Date(),
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      consentMethod: params.consentMethod,
      consentText: this.OPT_IN_TEXT,
    };

    // Store consent
    this.consents.set(params.userId, consent);

    // Record in history
    this.consentHistory.push({
      userId: params.userId,
      phoneNumber: params.phoneNumber,
      action: 'opt_in',
      timestamp: new Date(),
      method: params.consentMethod,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });

    console.log('✅ SMS consent recorded:', {
      userId: params.userId,
      phone: this.maskPhoneNumber(params.phoneNumber),
      method: params.consentMethod,
    });

    return consent;
  }

  /**
   * Revoke user SMS consent (opt-out)
   */
  public async revokeConsent(params: {
    userId: string;
    phoneNumber: string;
    method: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    const existingConsent = this.consents.get(params.userId);

    if (existingConsent) {
      existingConsent.granted = false;
      existingConsent.revokedAt = new Date();
      this.consents.set(params.userId, existingConsent);
    }

    // Record in history
    this.consentHistory.push({
      userId: params.userId,
      phoneNumber: params.phoneNumber,
      action: 'opt_out',
      timestamp: new Date(),
      method: params.method,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });

    console.log('⛔ SMS consent revoked:', {
      userId: params.userId,
      phone: this.maskPhoneNumber(params.phoneNumber),
      method: params.method,
    });
  }

  /**
   * Check if user has granted SMS consent
   */
  public async hasConsent(userId: string): Promise<boolean> {
    const consent = this.consents.get(userId);
    return consent ? consent.granted : false;
  }

  /**
   * Check if phone number has granted SMS consent
   */
  public async hasConsentByPhone(phoneNumber: string): Promise<boolean> {
    for (const consent of this.consents.values()) {
      if (consent.phoneNumber === phoneNumber && consent.granted) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get consent details for a user
   */
  public async getConsent(userId: string): Promise<SMSConsent | null> {
    return this.consents.get(userId) || null;
  }

  /**
   * Get consent history for a user
   */
  public async getConsentHistory(userId: string): Promise<SMSConsentHistory[]> {
    return this.consentHistory.filter((h) => h.userId === userId);
  }

  /**
   * Process STOP keyword from SMS reply
   */
  public async processOptOutKeyword(params: {
    phoneNumber: string;
    keyword: string;
  }): Promise<{ success: boolean; message: string }> {
    const optOutKeywords = ['STOP', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'];

    if (!optOutKeywords.includes(params.keyword.toUpperCase())) {
      return {
        success: false,
        message: 'Invalid keyword',
      };
    }

    // Find user by phone number
    const userId = await this.findUserIdByPhone(params.phoneNumber);

    if (!userId) {
      return {
        success: false,
        message: 'Phone number not found',
      };
    }

    // Revoke consent
    await this.revokeConsent({
      userId,
      phoneNumber: params.phoneNumber,
      method: 'sms_reply',
    });

    return {
      success: true,
      message:
        'You have been unsubscribed from FleetFlow SMS messages. You will no longer receive text messages from us. Reply START to re-subscribe.',
    };
  }

  /**
   * Process HELP keyword from SMS reply
   */
  public processHelpKeyword(): string {
    return 'FleetFlow SMS Help: You are receiving logistics notifications. Reply STOP to unsubscribe. Msg&data rates may apply. Support: support@fleetflowapp.com or 1-800-FLEETFLOW';
  }

  /**
   * Process START keyword to re-subscribe
   */
  public async processOptInKeyword(params: {
    phoneNumber: string;
    keyword: string;
  }): Promise<{ success: boolean; message: string }> {
    const optInKeywords = ['START', 'SUBSCRIBE', 'YES'];

    if (!optInKeywords.includes(params.keyword.toUpperCase())) {
      return {
        success: false,
        message: 'Invalid keyword',
      };
    }

    // Find user by phone number
    const userId = await this.findUserIdByPhone(params.phoneNumber);

    if (!userId) {
      return {
        success: false,
        message: 'Phone number not found',
      };
    }

    // Grant consent
    await this.recordConsent({
      userId,
      phoneNumber: params.phoneNumber,
      consentMethod: 'sms_reply',
    });

    return {
      success: true,
      message:
        'You have been re-subscribed to FleetFlow SMS messages. Reply HELP for help or STOP to unsubscribe.',
    };
  }

  /**
   * Validate phone number can receive SMS
   */
  public async canSendSMS(params: {
    userId?: string;
    phoneNumber?: string;
  }): Promise<{ allowed: boolean; reason?: string }> {
    if (params.userId) {
      const hasConsent = await this.hasConsent(params.userId);
      if (!hasConsent) {
        return {
          allowed: false,
          reason: 'User has not granted SMS consent',
        };
      }
      return { allowed: true };
    }

    if (params.phoneNumber) {
      const hasConsent = await this.hasConsentByPhone(params.phoneNumber);
      if (!hasConsent) {
        return {
          allowed: false,
          reason: 'Phone number has not granted SMS consent',
        };
      }
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: 'No user ID or phone number provided',
    };
  }

  /**
   * Get consent statistics
   */
  public getConsentStats(): {
    totalConsents: number;
    activeConsents: number;
    revokedConsents: number;
    optInRate: number;
  } {
    const total = this.consents.size;
    const active = Array.from(this.consents.values()).filter(
      (c) => c.granted
    ).length;
    const revoked = total - active;
    const optInRate = total > 0 ? (active / total) * 100 : 0;

    return {
      totalConsents: total,
      activeConsents: active,
      revokedConsents: revoked,
      optInRate: Math.round(optInRate * 100) / 100,
    };
  }

  /**
   * Export consent data for compliance audits
   */
  public exportConsentData(userId: string): {
    consent: SMSConsent | null;
    history: SMSConsentHistory[];
  } {
    return {
      consent: this.consents.get(userId) || null,
      history: this.consentHistory.filter((h) => h.userId === userId),
    };
  }

  // PRIVATE HELPER METHODS

  private maskPhoneNumber(phone: string): string {
    if (phone.length < 4) return '****';
    return '*'.repeat(phone.length - 4) + phone.slice(-4);
  }

  private async findUserIdByPhone(phoneNumber: string): Promise<string | null> {
    // In production, this would query the database
    for (const consent of this.consents.values()) {
      if (consent.phoneNumber === phoneNumber) {
        return consent.userId;
      }
    }
    return null;
  }
}

// Export singleton instance
export const smsConsentService = SMSConsentService.getInstance();
export default smsConsentService;
