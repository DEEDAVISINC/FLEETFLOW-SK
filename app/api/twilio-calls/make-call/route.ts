/**
 * Twilio Voice Call API with Multi-Tenant Support
 * Handles outbound voice calls using tenant-specific phone numbers
 */

import { NextRequest, NextResponse } from 'next/server';
import { tenantPhoneService } from '../../../services/TenantPhoneService';

interface CallRequest {
  to: string;
  message?: string;
  tenantId?: string;
  recordCall?: boolean;
  maxDuration?: number; // seconds
}

interface CallResponse {
  success: boolean;
  callSid?: string;
  status?: string;
  error?: string;
  callerNumber?: string;
  tenantName?: string;
  duration?: number;
  cost?: number;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<CallResponse>> {
  try {
    const body: CallRequest = await request.json();
    const {
      to,
      message,
      tenantId,
      recordCall = false,
      maxDuration = 300,
    } = body;

    // Validate phone number
    if (!to || !isValidPhoneNumber(to)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid phone number provided',
        },
        { status: 400 }
      );
    }

    // Get tenant phone configuration
    const phoneConfig = tenantId
      ? tenantPhoneService.getTenantPhoneConfig(tenantId)
      : tenantPhoneService.getCurrentTenantPhoneConfig();

    if (!phoneConfig) {
      return NextResponse.json(
        {
          success: false,
          error: 'No phone configuration found for tenant',
        },
        { status: 400 }
      );
    }

    if (!phoneConfig.voiceEnabled) {
      return NextResponse.json(
        {
          success: false,
          error: 'Voice calls not enabled for this tenant',
        },
        { status: 403 }
      );
    }

    // Check if Twilio is configured
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Twilio credentials not configured',
        },
        { status: 500 }
      );
    }

    // Import Twilio
    const twilio = require('twilio');
    const client = twilio(accountSid, authToken);

    // Prepare call options
    const callOptions: any = {
      to: formatPhoneNumber(to),
      from: phoneConfig.primaryPhone,
      url: `${getBaseUrl(request)}/api/twilio-calls/twiml`, // TwiML for call handling
      statusCallback: `${getBaseUrl(request)}/api/twilio-calls/status`,
      statusCallbackMethod: 'POST',
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      timeout: 30, // Ring for 30 seconds
      record: recordCall,
    };

    // Add custom parameters for tenant tracking
    if (phoneConfig.tenantId) {
      callOptions.statusCallbackStatusCallbackEvent = [
        'initiated',
        'ringing',
        'answered',
        'completed',
      ];
    }

    // Set caller ID name if available
    if (phoneConfig.callerIdName) {
      callOptions.callerIdName = phoneConfig.callerIdName;
    }

    // Set maximum call duration
    if (maxDuration) {
      callOptions.timeLimit = maxDuration;
    }

    // Store message in call parameters if provided
    if (message) {
      callOptions.url = `${getBaseUrl(request)}/api/twilio-calls/twiml?message=${encodeURIComponent(message)}`;
    }

    console.log(`📞 Making call for ${phoneConfig.tenantName}:`);
    console.log(
      `From: ${phoneConfig.primaryPhone} (${phoneConfig.callerIdName})`
    );
    console.log(`To: ${to}`);
    console.log(`Message: ${message || 'Default greeting'}`);

    // Make the call
    const call = await client.calls.create(callOptions);

    // Log call for tenant
    await logTenantCall({
      tenantId: phoneConfig.tenantId,
      callSid: call.sid,
      fromNumber: phoneConfig.primaryPhone,
      toNumber: to,
      status: call.status,
      message: message || 'Default greeting',
    });

    return NextResponse.json({
      success: true,
      callSid: call.sid,
      status: call.status,
      callerNumber: phoneConfig.primaryPhone,
      tenantName: phoneConfig.tenantName,
      duration: 0, // Will be updated via webhook
      cost: 0, // Will be updated via webhook
    });
  } catch (error) {
    console.error('Twilio call failed:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// TwiML endpoint for handling calls
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const message = searchParams.get('message');

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">${message || 'Hello from FleetFlow! A representative will be with you shortly. Please hold while we connect you.'}</Say>
    <Pause length="2"/>
    <Say voice="alice">If this is an emergency, please hang up and dial 911. Otherwise, please stay on the line.</Say>
    <Pause length="30"/>
    <Say voice="alice">Thank you for holding. We apologize, but all representatives are currently busy. Please try calling again or send us an email.</Say>
</Response>`;

  return new NextResponse(twiml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

/**
 * Helper Functions
 */

function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?1?[2-9]\d{9}$/;
  const cleanPhone = phone.replace(/\D/g, '');
  return phoneRegex.test(cleanPhone);
}

function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');

  if (cleanPhone.length === 10) {
    return `+1${cleanPhone}`;
  } else if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
    return `+${cleanPhone}`;
  }

  return phone;
}

function getBaseUrl(request: NextRequest): string {
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  const host = request.headers.get('host') || 'localhost:3000';
  return `${protocol}://${host}`;
}

async function logTenantCall(callData: {
  tenantId: string;
  callSid: string;
  fromNumber: string;
  toNumber: string;
  status: string;
  message: string;
}): Promise<void> {
  // In production, this would save to database
  console.log(`📝 Call Log for Tenant ${callData.tenantId}:`, {
    callSid: callData.callSid,
    from: callData.fromNumber,
    to: callData.toNumber,
    status: callData.status,
    timestamp: new Date().toISOString(),
  });
}
