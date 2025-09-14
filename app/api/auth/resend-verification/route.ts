import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Import the user database functions
import { getUserByEmail } from '../register/route';

const resendSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = resendSchema.parse(body);

    // Find user by email
    const user = getUserByEmail(email);

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message:
          "If an account with that email exists, we've sent a verification link.",
      });
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message:
          'This email is already verified. You can sign in to your account.',
      });
    }

    // Send verification email
    await sendVerificationEmail(user.email, user.id);

    // Log resend attempt
    console.info('📧 Verification email resent:', {
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json({
      success: true,
      message:
        'Verification email sent! Please check your inbox and spam folder.',
    });
  } catch (error) {
    console.error('Resend verification error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to send verification email. Please try again.' },
      { status: 500 }
    );
  }
}

// Mock email verification service (same as in register route)
async function sendVerificationEmail(
  email: string,
  userId: string
): Promise<void> {
  const verificationToken = generateVerificationToken(userId);
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/auth/verify-email?token=${verificationToken}`;

  // In production, integrate with email service like SendGrid, Mailgun, or Resend
  console.info('📧 Verification email sent to:', email);
  console.info('🔗 Verification link:', verificationUrl);

  // Mock email content
  const emailContent = `
    Welcome to FleetFlow!

    Please verify your email address by clicking the link below:
    ${verificationUrl}

    This link will expire in 24 hours.

    If you didn't create an account with FleetFlow, you can safely ignore this email.

    Thanks,
    The FleetFlow Team
  `;

  console.info('📝 Email content:', emailContent);

  // Simulate email sending delay
  await new Promise((resolve) => setTimeout(resolve, 100));
}

// Generate verification token (same as in register route)
function generateVerificationToken(userId: string): string {
  return Buffer.from(userId + ':' + Date.now()).toString('base64');
}
