import { NextRequest, NextResponse } from 'next/server';
import BPAResponseGenerator from '@/app/services/BPAResponseGenerator';

export async function POST(request: NextRequest) {
  try {
    const { solicitationText, solicitationNumber, title, agency, deadline, contactEmail } =
      await request.json();

    const generator = new BPAResponseGenerator();

    // Parse requirements from solicitation text if provided
    let requirements;
    if (solicitationText) {
      requirements = generator.parseBPARequirements(solicitationText);
    } else {
      // Use provided values
      requirements = {
        solicitationNumber: solicitationNumber || 'N/A',
        title: title || 'General Freight and Trucking',
        agency: agency || 'DEPT OF DEFENSE',
        deadline: deadline || 'See solicitation',
        contactEmail: contactEmail || 'See solicitation',
        requirements: {
          cageCode: true,
          ueid: true,
          capabilitiesStatement: true,
          ddForm2345: true,
          samRegistration: true,
          smallBusiness: true,
        },
        deliveryLocation: 'Lakehurst, NJ',
        submissionMethod: 'email' as const,
      };
    }

    // Generate comprehensive BPA response
    const bpaResponse = await generator.generateBPAResponse(requirements);

    // Generate submission email
    const submissionEmail = generator.generateSubmissionEmail(requirements);

    return NextResponse.json({
      success: true,
      bpaResponse,
      submissionEmail,
      requirements,
    });
  } catch (error) {
    console.error('Error generating BPA response:', error);
    return NextResponse.json(
      { error: 'Failed to generate BPA response' },
      { status: 500 }
    );
  }
}

