import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { extractCompanyProfileFromDocument } from '../ai/rfx-analysis/company-profile-extractor';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('document') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No document provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            'Unsupported file type. Please upload PDF, DOC, DOCX, or TXT files.',
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Mock user profile - in production, get from database
    const userProfile = {
      companyName: 'DEE DAVIS INC dba DEPOINTE',
      companyType: 'freight_broker' as const,
      mcNumber: 'MC 1647572',
      dotNumber: 'DOT 4250594',
      ein: '84-4114181',
      dunsNumber: '002636755',
      ueiNumber: 'HJB4KNYJVGZ1',
      cageCode: '8UMX3',
      scacCode: 'DFCL',
      certifications: ['WOSB', 'WBE', 'MBE'],
      serviceAreas: ['Midwest US', 'Michigan', 'Ohio', 'Indiana', 'Illinois'],
      yearsInBusiness: 5,
    };

    // Extract profile information
    const extractedProfile = await extractCompanyProfileFromDocument(
      buffer,
      file.name,
      userProfile
    );

    return NextResponse.json({
      success: true,
      extractedProfile,
      summary: {
        pastPerformanceItems: extractedProfile.pastPerformance?.length || 0,
        certificationsFound: extractedProfile.certifications?.length || 0,
        referencesExtracted: extractedProfile.references?.length || 0,
        hasCompanyDescription: !!extractedProfile.companyDescription,
        hasExperience: !!extractedProfile.experience,
        rawTextLength: extractedProfile.rawText.length,
      },
    });
  } catch (error) {
    console.error('Company profile extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract company profile from document' },
      { status: 500 }
    );
  }
}
