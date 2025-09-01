import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request: NextRequest) {
  try {
    const { to, message, transferId, urgency } = await request.json();

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

    // Send SMS notification
    const smsResult = await client.messages.create({
      body: `🔄 FleetFlow Transfer Alert\n\n${message}\n\nTransfer ID: ${transferId}`,
      from: fromNumber,
      to: to,
    });

    console.info(`📱 Transfer SMS sent to ${to}: ${smsResult.sid}`);

    // For urgent transfers, also attempt a voice call
    if (urgency === 'immediate') {
      try {
        const callResult = await client.calls.create({
          to: to,
          from: fromNumber,
          url: `${process.env.NEXT_PUBLIC_APP_URL}/api/crm/transfer-twiml?message=${encodeURIComponent('You have an immediate transfer notification. Please check your FleetFlow dashboard.')}`,
          timeout: 20,
        });
        console.info(`📞 Urgent transfer call initiated: ${callResult.sid}`);
      } catch (callError) {
        console.error('Voice call failed:', callError);
        // SMS was successful, so don't fail the whole request
      }
    }

    return NextResponse.json({
      success: true,
      smsId: smsResult.sid,
      transferId,
      urgency,
    });

  } catch (error) {
    console.error('Transfer notification failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to send transfer notification',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
