import { NextRequest, NextResponse } from 'next/server';

// Email Confirmation API Route
// Integrates with Twilio SendGrid (already configured in FleetFlow)

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  text: string;
  customerName: string;
  submissionId: string;
}

export async function POST(request: NextRequest) {
  try {
    const emailData: EmailRequest = await request.json();

    // Validate required fields
    const requiredFields = ['to', 'subject', 'html', 'text', 'customerName'];
    const missingFields = requiredFields.filter(
      (field) => !emailData[field as keyof EmailRequest]
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailData.to)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email address format',
        },
        { status: 400 }
      );
    }

    // Use Twilio SendGrid (already configured in FleetFlow)
    const sendGridApiKey = process.env.SENDGRID_API_KEY;
    const fromEmail =
      process.env.SENDGRID_FROM_EMAIL || 'insurance@fleetflowapp.com';

    if (!sendGridApiKey) {
      // Fallback to console logging for development
      console.info('📧 Email Confirmation (Dev Mode):', {
        to: emailData.to,
        from: fromEmail,
        subject: emailData.subject,
        customerName: emailData.customerName,
        submissionId: emailData.submissionId,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        messageId: `dev-${Date.now()}`,
        message: 'Email logged (development mode)',
        devMode: true,
      });
    }

    // Send via SendGrid
    const sendGridPayload = {
      personalizations: [
        {
          to: [{ email: emailData.to, name: emailData.customerName }],
          subject: emailData.subject,
          custom_args: {
            submission_id: emailData.submissionId,
            email_type: 'insurance_confirmation',
            customer_name: emailData.customerName,
          },
        },
      ],
      from: {
        email: fromEmail,
        name: 'FleetFlow Insurance Team',
      },
      content: [
        {
          type: 'text/plain',
          value: emailData.text,
        },
        {
          type: 'text/html',
          value: emailData.html,
        },
      ],
      categories: ['insurance', 'confirmation', 'fleetflow'],
      tracking_settings: {
        click_tracking: { enable: true },
        open_tracking: { enable: true },
      },
      reply_to: {
        email: 'insurance@fleetflowapp.com',
        name: 'FleetFlow Insurance Support',
      },
    };

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sendGridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendGridPayload),
    });

    if (response.ok) {
      const messageId =
        response.headers.get('X-Message-Id') || `sg-${Date.now()}`;

      // Log successful send for tracking
      console.info('✅ Insurance confirmation email sent:', {
        to: emailData.to,
        messageId,
        submissionId: emailData.submissionId,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        messageId,
        message: 'Insurance confirmation email sent successfully',
      });
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `SendGrid API error: ${response.status} - ${errorData.message || response.statusText}`
      );
    }
  } catch (error) {
    console.error('Email confirmation error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send confirmation email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Get email delivery status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');

    if (!messageId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message ID required',
        },
        { status: 400 }
      );
    }

    const sendGridApiKey = process.env.SENDGRID_API_KEY;

    if (!sendGridApiKey) {
      return NextResponse.json({
        success: true,
        status: 'development_mode',
        message: 'Email tracking not available in development mode',
      });
    }

    // Check email status via SendGrid API
    const response = await fetch(
      `https://api.sendgrid.com/v3/messages/${messageId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${sendGridApiKey}`,
        },
      }
    );

    if (response.ok) {
      const statusData = await response.json();

      return NextResponse.json({
        success: true,
        messageId,
        status: statusData.status || 'sent',
        deliveredAt: statusData.delivered_at,
        openedAt: statusData.opened_at,
        clickedAt: statusData.clicked_at,
        events: statusData.events || [],
      });
    } else if (response.status === 404) {
      return NextResponse.json({
        success: true,
        messageId,
        status: 'not_found',
        message: 'Message not found or too old',
      });
    } else {
      throw new Error(`SendGrid API error: ${response.status}`);
    }
  } catch (error) {
    console.error('Email status check error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check email status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
