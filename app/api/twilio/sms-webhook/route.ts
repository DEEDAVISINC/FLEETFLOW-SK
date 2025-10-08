import { NextRequest, NextResponse } from 'next/server';
import { smsConsentService } from '../../../services/SMSConsentService';

/**
 * TWILIO SMS WEBHOOK HANDLER
 *
 * Handles incoming SMS messages from Twilio, including:
 * - STOP/UNSUBSCRIBE: Opt-out of SMS messages
 * - HELP: Get help information
 * - START/SUBSCRIBE: Re-subscribe to SMS messages
 *
 * Required for TCPA and Twilio toll-free verification compliance
 */

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract Twilio webhook parameters
    const from = formData.get('From') as string; // User's phone number
    const body = formData.get('Body') as string; // Message content
    const messageSid = formData.get('MessageSid') as string;
    const accountSid = formData.get('AccountSid') as string;

    console.log('📨 Received SMS webhook:', {
      from: from?.slice(-4),
      body,
      messageSid,
    });

    if (!from || !body) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Normalize the message body
    const keyword = body.trim().toUpperCase();

    let responseMessage = '';

    // Handle STOP keywords (opt-out)
    if (['STOP', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'].includes(keyword)) {
      const result = await smsConsentService.processOptOutKeyword({
        phoneNumber: from,
        keyword,
      });

      if (result.success) {
        responseMessage = result.message;
        console.log('⛔ User opted out:', from.slice(-4));
      } else {
        responseMessage =
          'Sorry, we could not process your opt-out request. Please contact support@fleetflowapp.com';
      }
    }
    // Handle HELP keyword
    else if (['HELP', 'INFO', 'SUPPORT'].includes(keyword)) {
      responseMessage = smsConsentService.processHelpKeyword();
      console.log('ℹ️ Help requested:', from.slice(-4));
    }
    // Handle START keywords (opt-in)
    else if (['START', 'SUBSCRIBE', 'YES', 'UNSTOP'].includes(keyword)) {
      const result = await smsConsentService.processOptInKeyword({
        phoneNumber: from,
        keyword,
      });

      if (result.success) {
        responseMessage = result.message;
        console.log('✅ User opted back in:', from.slice(-4));
      } else {
        responseMessage =
          'Sorry, we could not process your subscription request. Please contact support@fleetflowapp.com';
      }
    }
    // Unknown keyword
    else {
      // Don't respond to regular messages (they might be replies to notifications)
      console.log('💬 Regular SMS message received (no keyword)');

      // Optionally, you could log this for customer service follow-up
      // or integrate with a support ticketing system

      return new NextResponse(
        '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
        {
          status: 200,
          headers: {
            'Content-Type': 'text/xml',
          },
        }
      );
    }

    // Return TwiML response
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${responseMessage}</Message>
</Response>`;

    return new NextResponse(twiml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('❌ SMS webhook error:', error);

    // Return empty TwiML response on error (don't send error message to user)
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      {
        status: 200,
        headers: {
          'Content-Type': 'text/xml',
        },
      }
    );
  }
}

// GET endpoint for webhook verification
export async function GET() {
  return NextResponse.json({
    service: 'FleetFlow SMS Webhook',
    status: 'active',
    supportedKeywords: {
      optOut: ['STOP', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'],
      help: ['HELP', 'INFO', 'SUPPORT'],
      optIn: ['START', 'SUBSCRIBE', 'YES', 'UNSTOP'],
    },
  });
}
