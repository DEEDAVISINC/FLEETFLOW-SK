import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Import the user database functions from the register route
// In production, this would be a shared database service

const verifySchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

// Mock user database - matches the one in register route
// In production, this would be a shared database service
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  companyName: string;
  position: string;
  department?: string;
  selectedPlan: string;
  role: 'user' | 'admin' | 'dispatcher' | 'broker';
  status: 'pending_verification' | 'active' | 'inactive';
  createdAt: string;
  emailVerified: boolean;
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

// This should be shared with the register route - in production use a database
const users: User[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = verifySchema.parse(body);

    // Decode the verification token
    const { userId, timestamp } = decodeVerificationToken(token);

    if (!userId) {
      return NextResponse.json(
        { message: 'Invalid verification token' },
        { status: 400 }
      );
    }

    // Check if token is expired (24 hours)
    const tokenAge = Date.now() - timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (tokenAge > maxAge) {
      return NextResponse.json(
        {
          message: 'Verification token has expired. Please request a new one.',
        },
        { status: 400 }
      );
    }

    // Find user by ID
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Email is already verified' },
        { status: 200 }
      );
    }

    // Update user verification status
    user.emailVerified = true;
    user.status = 'active';

    // Log successful verification
    console.info('✅ Email verified successfully:', {
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    // Activate the trial subscription
    await activateTrialSubscription(user.id, user.selectedPlan);

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! Your account is now active.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: true,
      },
    });
  } catch (error) {
    console.error('Email verification error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid verification data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Helper function to decode verification token
function decodeVerificationToken(token: string): {
  userId: string;
  timestamp: number;
} {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId, timestampStr] = decoded.split(':');
    const timestamp = parseInt(timestampStr);

    return { userId, timestamp };
  } catch (error) {
    return { userId: '', timestamp: 0 };
  }
}

// Mock subscription activation
async function activateTrialSubscription(
  userId: string,
  planId: string
): Promise<void> {
  console.info('🚀 Activating trial subscription:', {
    userId,
    planId,
    trialDays: 14,
    status: 'active_trial',
    activatedAt: new Date().toISOString(),
  });

  // In production, this would:
  // 1. Create subscription record in database
  // 2. Set trial end date (14 days from now)
  // 3. Grant access to plan features
  // 4. Send welcome email with account details
  // 5. Create initial usage records
}
