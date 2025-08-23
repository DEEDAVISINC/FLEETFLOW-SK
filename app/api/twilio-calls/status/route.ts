/**
 * Twilio Call Status Webhook Handler
 * Receives call status updates and tracks call metrics per tenant
 */

import { NextRequest, NextResponse } from 'next/server';

interface TwilioStatusWebhook {
  CallSid: string;
  CallStatus: string;
  CallDuration?: string;
  From: string;
  To: string;
  Direction: string;
  Price?: string;
  PriceUnit?: string;
  EndTime?: string;
  StartTime?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse Twilio webhook data (form-encoded)
    const formData = await request.formData();
    const webhookData: TwilioStatusWebhook = {
      CallSid: formData.get('CallSid') as string,
      CallStatus: formData.get('CallStatus') as string,
      CallDuration: formData.get('CallDuration') as string,
      From: formData.get('From') as string,
      To: formData.get('To') as string,
      Direction: formData.get('Direction') as string,
      Price: formData.get('Price') as string,
      PriceUnit: formData.get('PriceUnit') as string,
      EndTime: formData.get('EndTime') as string,
      StartTime: formData.get('StartTime') as string,
    };

    console.log(`📞 Call Status Update:`, {
      callSid: webhookData.CallSid,
      status: webhookData.CallStatus,
      duration: webhookData.CallDuration,
      from: webhookData.From,
      to: webhookData.To,
      price: webhookData.Price,
    });

    // Update call record with final status
    await updateCallRecord(webhookData);

    // Send real-time updates to connected clients if needed
    await broadcastCallUpdate(webhookData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Call status webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function updateCallRecord(
  webhookData: TwilioStatusWebhook
): Promise<void> {
  // In production, this would update database records

  const callRecord = {
    callSid: webhookData.CallSid,
    status: webhookData.CallStatus,
    duration: parseInt(webhookData.CallDuration || '0'),
    cost: parseFloat(webhookData.Price || '0'),
    currency: webhookData.PriceUnit || 'USD',
    endTime: webhookData.EndTime,
    startTime: webhookData.StartTime,
    updatedAt: new Date().toISOString(),
  };

  console.log(`💾 Call Record Updated:`, callRecord);

  // TODO: Save to database
  // await database.calls.update(webhookData.CallSid, callRecord);
}

async function broadcastCallUpdate(
  webhookData: TwilioStatusWebhook
): Promise<void> {
  // In production, this would use WebSockets or Server-Sent Events
  // to notify the phone dialer UI of call status changes

  const update = {
    type: 'call_status_update',
    callSid: webhookData.CallSid,
    status: webhookData.CallStatus,
    duration: webhookData.CallDuration,
    timestamp: new Date().toISOString(),
  };

  console.log(`📡 Broadcasting call update:`, update);

  // TODO: Implement WebSocket broadcast
  // await websocketService.broadcast('call_updates', update);
}
