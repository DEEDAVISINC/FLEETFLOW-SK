import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const callData = {
      callSid: formData.get('CallSid'),
      status: formData.get('CallStatus'),
      from: formData.get('From'),
      to: formData.get('To'),
      duration: formData.get('CallDuration'),
      timestamp: new Date().toISOString(),
    };

    // Log call data (you can save to database here)
    console.log('📞 Call Status Update:', callData);

    // You can integrate with your CRM here
    // await logCallToCRM(callData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Call status webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
