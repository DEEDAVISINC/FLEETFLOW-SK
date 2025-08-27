import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Complete user registration schema
const CompleteRegistrationSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),

  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  department: z.string().min(1, 'Department is required'),

  // Plan & Preferences
  selectedPlan: z.string().min(1, 'Plan selection is required'),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, 'Must agree to terms'),
  agreeToMarketing: z.boolean().optional(),

  // Payment Information
  paymentMethodId: z.string().min(1, 'Payment method is required'),

  // Profile Information
  emergencyContactName: z.string().min(1, 'Emergency contact name is required'),
  emergencyContactRelation: z
    .string()
    .min(1, 'Emergency contact relation is required'),
  emergencyContactPhone: z
    .string()
    .min(1, 'Emergency contact phone is required'),
  emergencyContactAltPhone: z.string().optional(),
  workLocation: z.string().min(1, 'Work location is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  theme: z.enum(['light', 'dark']),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  loadAlerts: z.boolean(),
  bio: z.string().optional(),
});

// Generate FleetFlow user ID
function generateUserId(
  firstName: string,
  lastName: string,
  departmentCode: string
): string {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  const today = new Date();
  const hireDateCode = today.toISOString().split('T')[0].replace(/-/g, '');

  // For demo purposes, use a simple sequence number
  const sequenceNumber = Math.floor(Math.random() * 999) + 1;

  return `${firstInitial}${lastInitial}-${departmentCode}-${hireDateCode}-${sequenceNumber}`;
}

// Generate department code from department name
function getDepartmentCode(department: string): string {
  const codeMap: Record<string, string> = {
    Dispatch: 'DC',
    Brokerage: 'BB',
    'Driver Management': 'DM',
    'Executive Management': 'MGR',
    'Safety & Compliance': 'SC',
    Operations: 'OPS',
    'Customer Service': 'CS',
    'Sales & Marketing': 'SM',
    Other: 'OTH',
  };
  return codeMap[department] || 'USR';
}

// Generate system access based on role
function generateSystemAccess(position: string, department: string) {
  const accessLevels: Record<string, any> = {
    Manager: {
      level: 'Management Access',
      securityLevel: 'Level 4 - Management',
      allowedSystems: ['User Management', 'Reports', 'System Configuration'],
    },
    Director: {
      level: 'Executive Access',
      securityLevel: 'Level 5 - Executive',
      allowedSystems: [
        'Full System Access',
        'Financial Reports',
        'User Management',
      ],
    },
    Owner: {
      level: 'Full Administrative',
      securityLevel: 'Level 5 - Executive',
      allowedSystems: ['Full System Access'],
    },
  };

  // Check if position contains management keywords
  const positionLower = position.toLowerCase();
  if (
    positionLower.includes('manager') ||
    positionLower.includes('director') ||
    positionLower.includes('owner')
  ) {
    const key = positionLower.includes('director')
      ? 'Director'
      : positionLower.includes('owner')
        ? 'Owner'
        : 'Manager';
    return {
      ...accessLevels[key],
      accessCode: `ACC-${generateUserId('', '', getDepartmentCode(department)).split('-')[1]}`,
    };
  }

  // Default access for regular users
  return {
    level: `${department} Operations`,
    accessCode: `ACC-${getDepartmentCode(department)}`,
    securityLevel: 'Level 3 - Operations',
    allowedSystems: [`${department} Portal`, 'Basic Reports'],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the complete registration data
    const validationResult = CompleteRegistrationSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors
        .map((err) => err.message)
        .join(', ');
      return NextResponse.json(
        { success: false, message: `Validation failed: ${errors}` },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if user already exists
    // In a real app, this would check a database
    // For now, we'll simulate the check
    const existingUsers = []; // This would be a database query
    const userExists = existingUsers.some(
      (user: any) => user.email === data.email
    );

    if (userExists) {
      return NextResponse.json(
        {
          success: false,
          message: 'An account with this email already exists',
        },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Generate user profile data
    const departmentCode = getDepartmentCode(data.department);
    const userId = generateUserId(
      data.firstName,
      data.lastName,
      departmentCode
    );
    const systemAccess = generateSystemAccess(data.position, data.department);

    // Create complete user profile
    const userProfile = {
      // Basic Identity
      id: userId,
      name: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || '',

      // Employment Information
      department: data.department,
      departmentCode,
      position: data.position,
      role: data.position, // Simplified mapping
      hiredDate: new Date().toISOString().split('T')[0],
      location: data.workLocation,

      // Account Status
      status: 'active' as const,
      lastLogin: 'Never',
      createdDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString(),

      // Profile Information
      bio: data.bio || '',
      profilePhoto: '',

      // System Access
      systemAccess,

      // Emergency Contact
      emergencyContact: {
        name: data.emergencyContactName,
        relation: data.emergencyContactRelation,
        phone: data.emergencyContactPhone,
        altPhone: data.emergencyContactAltPhone || '',
      },

      // User Preferences
      preferences: {
        theme: data.theme,
        language: 'en',
        timezone: data.timezone,
        dashboardLayout: 'standard',
        notifications: {
          email: data.emailNotifications,
          sms: data.smsNotifications,
          push: true,
          loadAlerts: data.loadAlerts,
          maintenanceReminders: true,
          systemUpdates: false,
        },
      },

      // Subscription Information
      subscription: {
        planId: data.selectedPlan,
        status: 'trial',
        trialStartDate: new Date().toISOString(),
        trialEndDate: new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000
        ).toISOString(), // 14 days
        paymentMethodId: data.paymentMethodId,
        marketingConsent: data.agreeToMarketing || false,
      },

      // Security
      passwordHash: hashedPassword,
      emailVerified: false,

      // Activity Log
      recentActivity: [
        {
          date: new Date().toLocaleString(),
          action: 'Account created and trial started',
          type: 'registration',
          icon: '🎉',
        },
      ],
    };

    // In a real application, save to database
    console.log('Creating user profile:', {
      id: userProfile.id,
      email: userProfile.email,
      plan: data.selectedPlan,
    });

    // Send verification email (mock implementation)
    const verificationToken = Buffer.from(
      `${userProfile.email}-${Date.now()}`
    ).toString('base64');

    console.log('Sending verification email:', {
      to: userProfile.email,
      token: verificationToken,
      trialEndDate: userProfile.subscription.trialEndDate,
    });

    return NextResponse.json({
      success: true,
      message:
        'Account created successfully! Please check your email to verify your account.',
      user: {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        plan: data.selectedPlan,
        trialEndDate: userProfile.subscription.trialEndDate,
      },
      verificationRequired: true,
    });
  } catch (error) {
    console.error('Complete registration error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Account creation failed. Please try again.',
      },
      { status: 500 }
    );
  }
}
