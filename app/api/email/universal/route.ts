import { sendGridService } from '@/app/services/sendgrid-service';
import { NextRequest, NextResponse } from 'next/server';

// Universal Email API Route for FleetFlow
// Handles all email types: insurance, certificates, accounting, onboarding, etc.

interface UniversalEmailRequest {
  type:
    | 'insurance_confirmation'
    | 'certificate_delivery'
    | 'invoice_reminder'
    | 'onboarding'
    | 'custom';
  recipient: {
    email: string;
    name: string;
  };
  data: any; // Type-specific data
  customTemplate?: {
    subject: string;
    html: string;
    text: string;
  };
  attachments?: Array<{
    filename: string;
    content: string; // Base64 encoded
    contentType: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const emailRequest: UniversalEmailRequest = await request.json();

    // Validate required fields
    if (
      !emailRequest.type ||
      !emailRequest.recipient?.email ||
      !emailRequest.recipient?.name
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing required fields: type, recipient.email, recipient.name',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailRequest.recipient.email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email address format',
        },
        { status: 400 }
      );
    }

    let result;

    // Route to appropriate email service based on type
    switch (emailRequest.type) {
      case 'insurance_confirmation':
        result = await sendGridService.sendInsuranceConfirmation(
          emailRequest.recipient.email,
          emailRequest.recipient.name,
          emailRequest.data
        );
        break;

      case 'certificate_delivery':
        // Convert base64 attachment back to Buffer
        const pdfBuffer = Buffer.from(emailRequest.data.pdfBuffer, 'base64');
        result = await sendGridService.sendCertificateEmail(
          emailRequest.recipient.email,
          emailRequest.recipient.name,
          {
            ...emailRequest.data,
            pdfBuffer,
          }
        );
        break;

      case 'invoice_reminder':
        result = await sendGridService.sendInvoiceReminder(
          emailRequest.recipient.email,
          emailRequest.recipient.name,
          emailRequest.data
        );
        break;

      case 'onboarding':
        result = await sendGridService.sendOnboardingEmail(
          emailRequest.recipient.email,
          emailRequest.recipient.name,
          emailRequest.data
        );
        break;

      case 'custom':
        if (!emailRequest.customTemplate) {
          return NextResponse.json(
            {
              success: false,
              error: 'Custom template required for custom email type',
            },
            { status: 400 }
          );
        }

        // Process attachments if provided
        const attachments = emailRequest.attachments?.map((att) => ({
          filename: att.filename,
          content: Buffer.from(att.content, 'base64'),
          contentType: att.contentType,
        }));

        result = await sendGridService.sendEmail({
          to: emailRequest.recipient,
          template: emailRequest.customTemplate,
          category: 'custom',
          customArgs: emailRequest.data,
          attachments,
        });
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unsupported email type: ${emailRequest.type}`,
          },
          { status: 400 }
        );
    }

    if (result.success) {
      console.log('✅ Universal email sent:', {
        type: emailRequest.type,
        recipient: emailRequest.recipient.email,
        messageId: result.messageId,
        timestamp: result.timestamp,
      });

      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        timestamp: result.timestamp,
        type: emailRequest.type,
      });
    } else {
      throw new Error(result.error || 'Email sending failed');
    }
  } catch (error) {
    console.error('Universal email API error:', error);

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

// Bulk email endpoint
export async function PUT(request: NextRequest) {
  try {
    const { emails }: { emails: UniversalEmailRequest[] } =
      await request.json();

    if (!Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'emails array is required and must not be empty',
        },
        { status: 400 }
      );
    }

    if (emails.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error: 'Maximum 100 emails per bulk request',
        },
        { status: 400 }
      );
    }

    const results = [];
    let successCount = 0;
    let failureCount = 0;

    for (const emailRequest of emails) {
      try {
        // Use the same logic as POST but for each email
        const response = await fetch(
          new URL('/api/email/universal', request.url),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailRequest),
          }
        );

        const result = await response.json();

        if (result.success) {
          successCount++;
        } else {
          failureCount++;
        }

        results.push({
          recipient: emailRequest.recipient.email,
          type: emailRequest.type,
          success: result.success,
          messageId: result.messageId,
          error: result.error,
        });

        // Small delay to avoid overwhelming SendGrid
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        failureCount++;
        results.push({
          recipient: emailRequest.recipient.email,
          type: emailRequest.type,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    console.log('📧 Bulk email operation completed:', {
      total: emails.length,
      successful: successCount,
      failed: failureCount,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      summary: {
        total: emails.length,
        successful: successCount,
        failed: failureCount,
      },
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Bulk email API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process bulk emails',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Email status check
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');

    if (!messageId) {
      return NextResponse.json(
        {
          success: false,
          error: 'messageId parameter is required',
        },
        { status: 400 }
      );
    }

    // For now, return basic status
    // In production, this could integrate with SendGrid's Event API
    return NextResponse.json({
      success: true,
      messageId,
      status: 'delivered', // This would be actual status from SendGrid
      timestamp: new Date().toISOString(),
      note: 'Email status tracking available with SendGrid Event API integration',
    });
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




































































































