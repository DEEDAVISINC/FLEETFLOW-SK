// 🚛⚡ GO WITH THE FLOW - CONTACT API ROUTES
// Contact form handling for Go with the Flow service

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, message, phone } = body;

    // Validate required fields
    if (!name || !email || !company || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name, email, company, and message are required',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide a valid email address',
        },
        { status: 400 }
      );
    }

    // Log the contact submission for now (in production, you'd save to database or send email)
    console.log('📧 Go with the Flow Contact Form Submission:', {
      timestamp: new Date().toISOString(),
      name,
      email,
      company,
      phone: phone || 'Not provided',
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
    });

    // In production, you would:
    // 1. Save to database
    // 2. Send notification email to sales team
    // 3. Add to CRM system
    // 4. Send auto-response to customer

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message:
        'Thank you for your inquiry! Our team will respond within 24 hours.',
      contactId: `contact-${Date.now()}`, // Generate a reference ID
      estimatedResponse: '24 hours',
    });
  } catch (error) {
    console.error('Go With the Flow Contact API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error. Please try again later.',
      },
      { status: 500 }
    );
  }
}

// Optional: Handle GET requests for contact information or form data
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    contactInfo: {
      email: 'support@fleetflowapp.com',
      phone: '1-800-FLEETFLOW',
      hours: '24/7 Support Available',
      responseTime: 'Within 24 hours',
    },
  });
}
