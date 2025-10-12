import { NextRequest, NextResponse } from 'next/server';

// POST /api/rfx-bids/[id]/send - Send bid response via email
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    console.log('📧 Sending RFX bid response via email:', {
      bidId: id,
      recipient: body.recipient,
    });

    // For now, work with the provided data directly
    // When database is connected, fetch from DB instead
    const bidResponse = body.bidResponse;

    if (!bidResponse) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bid response data is required',
        },
        { status: 400 }
      );
    }

    // Send email via Universal Email API
    const emailPayload = {
      type: 'custom',
      recipient: {
        email: bidResponse.contactEmail || body.recipient,
        name: bidResponse.contactName || 'Procurement Team',
      },
      customTemplate: {
        subject:
          bidResponse.responseSubject ||
          `Response to ${bidResponse.solicitationType} - ${bidResponse.solicitationId}`,
        html: bidResponse.responseHtml,
        text: bidResponse.responseText,
      },
      attachments: body.attachments || [],
    };

    console.log('📤 Sending to Universal Email API:', {
      recipient: emailPayload.recipient.email,
      subject: emailPayload.customTemplate.subject,
    });

    const emailResult = await fetch(
      new URL('/api/email/universal', request.url),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload),
      }
    );

    const emailResponse = await emailResult.json();

    if (!emailResult.ok || !emailResponse.success) {
      throw new Error(emailResponse.error || 'Email sending failed');
    }

    // Update bid response status to 'sent'
    const updateResult = await fetch(
      new URL(`/api/rfx-bids?id=${id}`, request.url),
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'sent',
          email_sent_at: new Date().toISOString(),
          email_message_id: emailResponse.messageId,
        }),
      }
    );

    const updateResponse = await updateResult.json();

    console.log('✅ Email sent and bid status updated:', {
      bidId: id,
      messageId: emailResponse.messageId,
      timestamp: emailResponse.timestamp,
    });

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      data: {
        bidId: id,
        status: 'sent',
        sentAt: emailResponse.timestamp,
        messageId: emailResponse.messageId,
        recipient: emailPayload.recipient.email,
      },
    });
  } catch (error) {
    console.error('Error sending RFX bid email:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
