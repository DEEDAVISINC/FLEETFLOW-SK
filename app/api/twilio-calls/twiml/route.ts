/**
 * TwiML Generator for Twilio Voice Calls
 * Handles call flow and messaging for tenant calls
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const message = searchParams.get('message');
  const action = searchParams.get('action') || 'greeting';

  let twimlContent = '';

  switch (action) {
    case 'greeting':
      twimlContent = generateGreetingTwiML(message);
      break;
    case 'voicemail':
      twimlContent = generateVoicemailTwiML();
      break;
    case 'transfer':
      twimlContent = generateTransferTwiML();
      break;
    default:
      twimlContent = generateGreetingTwiML(message);
  }

  return new NextResponse(twimlContent, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Handle user input during call (like keypress responses)
  const formData = await request.formData();
  const digits = formData.get('Digits') as string;
  const callSid = formData.get('CallSid') as string;

  console.log(
    `📞 Call input received - CallSid: ${callSid}, Digits: ${digits}`
  );

  let twimlContent = '';

  switch (digits) {
    case '1':
      twimlContent = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Thank you for choosing option 1. Please hold while we connect you to our dispatch team.</Say>
    <Pause length="1"/>
    <Say voice="alice">All dispatch representatives are currently busy. Please leave a message after the beep.</Say>
    <Record maxLength="120" transcribe="true" transcribeCallback="/api/twilio-calls/transcribe"/>
</Response>`;
      break;
    case '2':
      twimlContent = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Thank you for choosing option 2. Please hold while we connect you to our customer service team.</Say>
    <Pause length="1"/>
    <Say voice="alice">For immediate assistance, please visit our website or send us an email. Thank you for calling!</Say>
    <Hangup/>
</Response>`;
      break;
    case '0':
      twimlContent = generateTransferTwiML();
      break;
    default:
      twimlContent = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">I'm sorry, I didn't understand that selection. Let me repeat the menu.</Say>
    ${generateGreetingTwiML()}
</Response>`;
  }

  return new NextResponse(twimlContent, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

function generateGreetingTwiML(customMessage?: string | null): string {
  const message = customMessage || 'Hello! Thank you for calling FleetFlow.';

  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">${message}</Say>
    <Pause length="1"/>
    <Gather input="dtmf" timeout="10" numDigits="1" action="/api/twilio-calls/twiml" method="POST">
        <Say voice="alice">Please press 1 to speak with our dispatch team, press 2 for customer service, or press 0 to speak with an operator.</Say>
    </Gather>
    <Say voice="alice">I didn't receive a selection. Please try calling again. Thank you!</Say>
    <Hangup/>
</Response>`;
}

function generateVoicemailTwiML(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Please leave your message after the beep. When you're finished, simply hang up or press the star key.</Say>
    <Record maxLength="180" transcribe="true" transcribeCallback="/api/twilio-calls/transcribe" finishOnKey="*"/>
    <Say voice="alice">Thank you for your message. We'll get back to you as soon as possible. Goodbye!</Say>
    <Hangup/>
</Response>`;
}

function generateTransferTwiML(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="alice">Please hold while we transfer you to an available representative.</Say>
    <Pause length="2"/>
    <Say voice="alice">We apologize, but all representatives are currently busy. Please leave a message and we'll call you back.</Say>
    ${generateVoicemailTwiML()}
</Response>`;
}
