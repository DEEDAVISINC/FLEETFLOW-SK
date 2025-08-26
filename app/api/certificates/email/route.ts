import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

interface EmailCertificateRequest {
  recipientEmail: string;
  recipientName: string;
  moduleTitle: string;
  certificateId: string;
  score: number;
  dateEarned: string;
  pdfBuffer: Buffer;
}

// Create reusable transporter object using SMTP transport
const createTransport = () => {
  // For development, you can use services like Gmail, Outlook, or testing services like Ethereal
  // For production, use services like SendGrid, AWS SES, or Mailgun

  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
      },
    });
  }

  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  }

  // Default to Ethereal Email for testing (creates a test account)
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: process.env.ETHEREAL_USER || 'ethereal.user@ethereal.email',
      pass: process.env.ETHEREAL_PASS || 'ethereal.pass',
    },
  });
};

export async function POST(request: NextRequest) {
  try {
    const body: EmailCertificateRequest = await request.json();

    const {
      recipientEmail,
      recipientName,
      moduleTitle,
      certificateId,
      score,
      dateEarned,
      pdfBuffer,
    } = body;

    // Validate required fields
    if (!recipientEmail || !recipientName || !moduleTitle || !pdfBuffer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = createTransport();

    // Email content
    const mailOptions = {
      from: {
        name: 'FleetFlow University',
        address:
          process.env.SENDGRID_FROM_EMAIL || 'university@fleetflowapp.com',
      },
      to: recipientEmail,
      subject: `🎓 Certificate of Completion - ${moduleTitle}`,
      html: generateEmailHTML(
        recipientName,
        moduleTitle,
        score,
        dateEarned,
        certificateId
      ),
      attachments: [
        {
          filename: `FleetFlow_Certificate_${certificateId}.pdf`,
          content: Buffer.from(pdfBuffer),
          contentType: 'application/pdf',
        },
      ],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Certificate email sent:', info.messageId);

    // For Ethereal Email, provide preview URL
    if (process.env.NODE_ENV === 'development') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      previewUrl:
        process.env.NODE_ENV === 'development'
          ? nodemailer.getTestMessageUrl(info)
          : null,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to send certificate email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function generateEmailHTML(
  recipientName: string,
  moduleTitle: string,
  score: number,
  dateEarned: string,
  certificateId: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>FleetFlow University Certificate</title>
    </head>
    <body style="
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin: 0;
      padding: 40px 20px;
    ">
      <div style="
        max-width: 600px;
        margin: 0 auto;
        background: white;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      ">
        <!-- Header -->
        <div style="
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          padding: 40px 30px;
          text-align: center;
        ">
          <div style="
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 10px;
          ">🚛 FleetFlow University</div>
          <div style="
            font-size: 18px;
            opacity: 0.9;
            letter-spacing: 1px;
          ">CERTIFICATE OF COMPLETION</div>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <div style="
            text-align: center;
            margin-bottom: 30px;
          ">
            <div style="
              font-size: 48px;
              margin-bottom: 20px;
            ">🎓</div>
            <h1 style="
              font-size: 24px;
              color: #1f2937;
              margin-bottom: 10px;
            ">Congratulations, ${recipientName}!</h1>
            <p style="
              font-size: 16px;
              color: #6b7280;
              line-height: 1.6;
              margin-bottom: 0;
            ">
              You have successfully completed the training program and earned your certificate.
            </p>
          </div>

          <!-- Certificate Details -->
          <div style="
            background: rgba(59, 130, 246, 0.1);
            border: 2px solid rgba(59, 130, 246, 0.2);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 30px;
          ">
            <h2 style="
              font-size: 20px;
              color: #1d4ed8;
              margin-bottom: 15px;
              text-align: center;
            ">${moduleTitle}</h2>

            <div style="
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-top: 20px;
            ">
              <div>
                <div style="
                  font-size: 14px;
                  color: #6b7280;
                  margin-bottom: 5px;
                ">Score Achieved:</div>
                <div style="
                  font-size: 18px;
                  font-weight: bold;
                  color: #10b981;
                ">${score}%</div>
              </div>
              <div>
                <div style="
                  font-size: 14px;
                  color: #6b7280;
                  margin-bottom: 5px;
                ">Date Earned:</div>
                <div style="
                  font-size: 18px;
                  font-weight: bold;
                  color: #1f2937;
                ">${dateEarned}</div>
              </div>
            </div>
          </div>

          <!-- Certificate ID -->
          <div style="
            background: rgba(249, 250, 251, 0.8);
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: center;
          ">
            <div style="
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 8px;
            ">Certificate ID:</div>
            <div style="
              font-size: 16px;
              font-weight: bold;
              color: #1f2937;
              font-family: monospace;
              background: white;
              padding: 10px;
              border-radius: 6px;
              border: 1px solid #e5e7eb;
            ">${certificateId}</div>
          </div>

          <!-- Attachment Info -->
          <div style="
            background: rgba(34, 197, 94, 0.1);
            border: 2px solid rgba(34, 197, 94, 0.2);
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: center;
          ">
            <div style="
              font-size: 20px;
              margin-bottom: 10px;
            ">📎</div>
            <div style="
              font-size: 16px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 5px;
            ">Your Certificate is Attached</div>
            <div style="
              font-size: 14px;
              color: #6b7280;
            ">Download and save your official PDF certificate for your records.</div>
          </div>

          <!-- Call to Action -->
          <div style="text-align: center;">
            <a href="http://localhost:3000/training" style="
              display: inline-block;
              background: linear-gradient(135deg, #3b82f6, #1d4ed8);
              color: white;
              padding: 15px 30px;
              border-radius: 10px;
              text-decoration: none;
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 20px;
            ">Continue Learning at FleetFlow University</a>
          </div>

          <div style="
            text-align: center;
            font-size: 14px;
            color: #6b7280;
            line-height: 1.6;
          ">
            <p>Keep advancing your transportation and logistics expertise!</p>
            <p>Visit our training portal to explore additional certification programs.</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="
          background: #f9fafb;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        ">
          <div style="
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
          ">🚛 FleetFlow University</div>
          <div style="
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 15px;
          ">Transportation Excellence Institute</div>
          <div style="
            font-size: 12px;
            color: #9ca3af;
          ">
            This certificate is digitally signed and verified by FleetFlow University.<br>
            Certificate ID: ${certificateId}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}
