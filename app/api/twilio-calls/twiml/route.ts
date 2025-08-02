import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const message = searchParams.get('message') || 'Hello from FleetFlow';

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${message}</Say>
  <Pause length="2"/>
  <Say voice="alice">Please hold while we connect you to a FleetFlow representative.</Say>
  <Play>http://com.twilio.music.classical.s3.amazonaws.com/BusyStrings.mp3</Play>
</Response>`;

  return new NextResponse(twiml, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}
