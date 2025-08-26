'use client';

/**
 * Twilio Call Status Webhook Handler
 * Receives call status updates and tracks call metrics per tenant
 */

import { NextRequest, NextResponse } from 'next/server';
import { CallDatabaseService } from '../../../services/CallDatabaseService';

interface TwilioStatusWebhook {
  CallSid: string;
  CallStatus: string;
  CallDuration?: string;
  From?: string;
  To?: string;
  RecordingUrl?: string;
  Direction?: string;
  Timestamp?: string;
}

export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.formData();

    // Convert FormData to plain object
    const data: Record<string, string> = {};
    webhookData.forEach((value, key) => {
      data[key] = value.toString();
    });

    // Parse as TwilioStatusWebhook
    const statusData: TwilioStatusWebhook = {
      CallSid: data.CallSid,
      CallStatus: data.CallStatus,
      CallDuration: data.CallDuration,
      From: data.From,
      To: data.To,
      RecordingUrl: data.RecordingUrl,
      Direction: data.Direction,
      Timestamp: data.Timestamp || new Date().toISOString(),
    };

    // Save the call status
    await CallDatabaseService.saveCallStatus(
      statusData.CallSid,
      statusData.CallStatus
    );

    return NextResponse.json(
      { success: true, message: 'Call status processed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing Twilio call status webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process call status' },
      { status: 500 }
    );
  }
}
