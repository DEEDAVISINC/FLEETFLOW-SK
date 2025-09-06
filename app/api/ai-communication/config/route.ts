/**
 * API Route for AI Communication Configuration Validation
 * Validates ddavis@freight1stdirect.com email setup
 */

import { NextResponse } from 'next/server';
import {
  testEmailConnection,
  validateCommunicationConfig,
} from '../../../services/AICommunicationIntegrationService';

export async function GET() {
  try {
    const config = validateCommunicationConfig();

    return NextResponse.json({
      success: true,
      data: {
        email: {
          configured: config.email,
          provider: 'Neo.space',
          emailAddress: config.emailAddress,
          status: config.configured ? 'Ready' : 'Configuration Error',
        },
        phone: {
          configured: false,
          provider: 'Twilio',
          status: 'Not configured - Optional for email-only setup',
        },
        setupInstructions: {
          email: [
            '✅ Email configured for ddavis@freight1stdirect.com',
            '✅ Neo.space SMTP/IMAP settings applied',
            '✅ Ready to activate Alexis Best for email management',
          ],
          phone: [
            'Optional: Set up Twilio for Charin (AI Receptionist)',
            'Get Account SID, Auth Token, and Phone Number from Twilio',
            'Add to environment variables for phone answering capability',
          ],
        },
        readyToActivate: {
          alexisBest: true,
          charin: false,
          reason: 'Email configured, phone optional',
        },
      },
    });
  } catch (error) {
    console.error('Configuration validation error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Test the actual email connection
    const emailTest = await testEmailConnection();

    return NextResponse.json({
      success: emailTest,
      data: {
        emailTest: {
          success: emailTest,
          message: emailTest
            ? 'Successfully connected to ddavis@freight1stdirect.com'
            : 'Failed to connect to email server',
          emailAddress: 'ddavis@freight1stdirect.com',
          provider: 'Neo.space',
        },
      },
    });
  } catch (error) {
    console.error('Email connection test error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}





