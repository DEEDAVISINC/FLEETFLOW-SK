import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request: NextRequest) {
  try {
    const { to, from, message } = await request.json();

    // Use your existing Twilio credentials
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json(
        { error: 'Twilio credentials not configured' },
        { status: 500 }
      );
    }

    const client = twilio(accountSid, authToken);

    // Create TwiML for the call
    const twimlUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/twilio-calls/twiml?message=${encodeURIComponent(message || 'Hello from FleetFlow')}`;

    const call = await client.calls.create({
      to: to,
      from: fromNumber,
      url: twimlUrl,
      statusCallback: `${process.env.NEXT_PUBLIC_APP_URL}/api/twilio-calls/status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
      timeout: 30,
      record: true, // Record calls for quality assurance
    });

    return NextResponse.json({
      success: true,
      callSid: call.sid,
      status: call.status,
      to: call.to,
      from: call.from,
    });
  } catch (error) {
    console.error('Twilio call error:', error);
    return NextResponse.json(
      {
        error: 'Failed to make call',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
