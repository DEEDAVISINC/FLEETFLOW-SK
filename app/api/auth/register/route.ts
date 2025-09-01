import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for registration
const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  companyName: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  department: z.string().optional(),
  selectedPlan: z.string().min(1, 'Plan selection is required'),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, 'You must agree to terms'),
  agreeToMarketing: z.boolean().optional(),
  name: z.string().min(1, 'Name is required'), // Computed field
});

// In-memory user storage for demo purposes
// In production, this would use a real database like Supabase/PostgreSQL
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

// Mock user database - in production, use Supabase or similar
const users: User[] = [];

// Get user by email
export function getUserByEmail(email: string): User | null {
  return (
    users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ||
    null
  );
}

// Create user
export function createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
  const newUser: User = {
    ...userData,
    id: `US-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  return newUser;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = getUserByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Determine user role based on department/position
    const role = determineUserRole(
      validatedData.position,
      validatedData.department
    );

    // Create user
    const newUser = createUser({
      name: validatedData.name,
      email: validatedData.email.toLowerCase(),
      password: hashedPassword,
      phone: validatedData.phone,
      companyName: validatedData.companyName,
      position: validatedData.position,
      department: validatedData.department,
      selectedPlan: validatedData.selectedPlan,
      role,
      status: 'pending_verification',
      emailVerified: false,
      agreeToTerms: validatedData.agreeToTerms,
      agreeToMarketing: validatedData.agreeToMarketing || false,
    });

    // Send verification email (mock for now)
    await sendVerificationEmail(newUser.email, newUser.id);

    // Create subscription record
    await createInitialSubscription(newUser.id, validatedData.selectedPlan);

    // Log successful registration
    console.info('✅ New user registered:', {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      company: newUser.companyName,
      plan: newUser.selectedPlan,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          'Account created successfully! Please check your email to verify your account.',
        userId: newUser.id,
        redirectTo: '/auth/verify-email',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: 'Invalid input data',
          errors: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Helper function to determine user role
function determineUserRole(
  position: string,
  department?: string
): User['role'] {
  const positionLower = position.toLowerCase();
  const departmentLower = department?.toLowerCase() || '';

  if (
    positionLower.includes('admin') ||
    positionLower.includes('owner') ||
    positionLower.includes('president')
  ) {
    return 'admin';
  }

  if (
    positionLower.includes('dispatch') ||
    departmentLower.includes('dispatch')
  ) {
    return 'dispatcher';
  }

  if (positionLower.includes('broker') || departmentLower.includes('broker')) {
    return 'broker';
  }

  return 'user';
}

// Mock email verification service
async function sendVerificationEmail(
  email: string,
  userId: string
): Promise<void> {
  // In production, integrate with email service like SendGrid, Mailgun, or Resend
  console.info('📧 Verification email sent to:', email);
  console.info(
    '🔗 Verification link: /api/auth/verify-email?token=' +
      generateVerificationToken(userId)
  );

  // Simulate email sending delay
  await new Promise((resolve) => setTimeout(resolve, 100));
}

// Generate verification token (in production, use JWT or secure token)
function generateVerificationToken(userId: string): string {
  return Buffer.from(userId + ':' + Date.now()).toString('base64');
}

// Mock subscription creation
async function createInitialSubscription(
  userId: string,
  planId: string
): Promise<void> {
  console.info('💼 Creating trial subscription:', {
    userId,
    planId,
    trialDays: 14,
    status: 'trial',
  });

  // In production, integrate with subscription management service
  // This would create records in your subscription database table
}

// Export helper functions for use in other API routes
// Note: These are already exported as individual functions above
