import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { ClaudeAIService } from '../../../../lib/claude-ai-service';
import { generateComprehensiveResponses } from './comprehensive-response-generator';
import { parseGovernmentRFB } from './comprehensive-rfb-parser';
import {
  analyzeGovernmentPricing,
  type CompanyFinancials,
} from './government-pricing-analyzer';
import { generateIntelligentResponses } from './intelligent-bid-generator';
import {
  formatPricingScheduleForBid,
  generatePricingSchedule,
} from './intelligent-pricing-generator';
const pdfParse = require('pdf-parse-fork');

// MULTI-TENANT: Fetch logged-in user's organization profile
interface UserOrganizationProfile {
  companyName: string;
  companyType: 'freight_broker' | 'asset_carrier' | '3pl' | 'shipper' | 'other';
  mcNumber?: string;
  dotNumber?: string;
  ein?: string; // Employer Identification Number (Federal Tax ID)
  dunsNumber?: string; // D-U-N-S Number (Data Universal Numbering System)
  ueiNumber?: string; // Unique Entity Identifier (SAM.gov, replaced DUNS in 2022)
  cageCode?: string; // Commercial and Government Entity Code
  scacCode?: string; // Standard Carrier Alpha Code
  npiNumber?: string; // National Provider Identifier (for healthcare/medical logistics)
  certifications: string[]; // ['WOSB', 'MBE', 'DBE', 'SDB', etc.]
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  capabilities: string[]; // Services they provide
  fleetSize?: number;
  equipmentTypes?: string[];
  serviceAreas?: string[];
  yearsInBusiness?: number;
}

interface RFxAnalysisRequest {
  documentContent: string;
  documentType: 'RFP' | 'RFQ' | 'RFI' | 'RFB';
  fileName: string;
  fileData?: string; // base64 encoded file data for PDFs
}

interface AIBidAnalysis {
  documentType: string;
  summary: string;
  keyRequirements: string[];
  recommendedBid: string;
  competitiveAdvantage: string[];
  riskFactors: string[];
  confidence: number;
  bidStrategy: {
    pricing: string;
    timeline: string;
    approach: string;
  };
  generatedResponse: string;
  requirementsNeedingInput?: Array<{
    requirementId: string;
    requirementText: string;
    needsInputReason: string;
    suggestedInputFields: Array<{
      label: string;
      description: string;
      type: 'text' | 'number' | 'date' | 'textarea';
    }>;
    draftResponse: string;
  }>;
}

// MULTI-TENANT: Get logged-in user's organization profile
async function getUserOrganizationProfile(
  request: NextRequest
): Promise<UserOrganizationProfile | null> {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      console.warn(
        '⚠️ No user session found - cannot generate personalized response'
      );
      return null;
    }

    // TODO: Fetch from database - For now, use mock data
    // In production: const profile = await organizationService.getOrganizationProfile(session.user.email);

    console.log('👤 Fetching organization profile for:', session.user.email);

    // TEMPORARY: Return DEPOINTE profile for demo (will be replaced with real DB fetch)
    // Each user will have their own profile stored in the database
    return {
      companyName: 'DEE DAVIS INC dba DEPOINTE',
      companyType: 'freight_broker',
      mcNumber: 'MC 1647572',
      dotNumber: 'DOT 4250594',
      ein: '84-4114181', // Federal Tax ID
      dunsNumber: '002636755', // D-U-N-S Number
      ueiNumber: 'HJB4KNYJVGZ1', // SAM.gov Unique Entity Identifier
      cageCode: '8UMX3', // Commercial and Government Entity Code
      scacCode: 'DFCL', // Standard Carrier Alpha Code
      npiNumber: '[NPI - TO BE PROVIDED IF APPLICABLE]', // National Provider Identifier (healthcare/medical)
      certifications: ['WOSB', 'WBE', 'MBE'],
      address: '755 W. Big Beaver Rd, Suite 2020, Troy, MI 48084',
      phone: '(248) 376-4550',
      email: 'info@deedavis.biz',
      website: 'www.deedavis.biz',
      capabilities: [
        'Freight Brokerage',
        'Carrier Coordination',
        'Technology Platform (FleetFlow™)',
      ],
      serviceAreas: ['Midwest US', 'Michigan', 'Ohio', 'Indiana', 'Illinois'],
      yearsInBusiness: 5,
    };
  } catch (error) {
    console.error('Error fetching user organization profile:', error);
    return null;
  }
}

// INTELLIGENT: Determine user's role description based on company type
function getRoleDescription(companyType: string): {
  roleTitle: string;
  roleDescription: string;
  capabilities: string;
} {
  switch (companyType) {
    case 'freight_broker':
      return {
        roleTitle: 'Licensed Freight Brokerage',
        roleDescription:
          'As a property freight broker, we coordinate transportation services through our network of pre-qualified, insured carriers. We do not operate trucks ourselves but provide full logistics management and carrier coordination.',
        capabilities:
          'Our broker authority allows us to arrange transportation with vetted carriers who own and operate the equipment required for your shipments.',
      };

    case 'asset_carrier':
      return {
        roleTitle: 'Asset-Based Motor Carrier',
        roleDescription:
          'We operate our own fleet of trucks and employ our own drivers. All equipment is company-owned and maintained to the highest standards.',
        capabilities:
          'We provide transportation using our own assets, ensuring direct control over quality, timing, and service delivery.',
      };

    case '3pl':
      return {
        roleTitle: 'Third-Party Logistics Provider (3PL)',
        roleDescription:
          'We provide comprehensive logistics services including warehousing, fulfillment, and transportation management. Our services combine asset-based and brokerage capabilities.',
        capabilities:
          'We offer end-to-end supply chain solutions including storage, order fulfillment, transportation coordination, and value-added services.',
      };

    default:
      return {
        roleTitle: 'Logistics Service Provider',
        roleDescription:
          'We provide transportation and logistics services tailored to your specific requirements.',
        capabilities:
          'Our services are customized to meet the unique needs of each client and shipment.',
      };
  }
}

// HELPER FUNCTIONS for bid response generation
function estimateCarrierPoolSize(profile: UserOrganizationProfile): string {
  if (profile.companyType === 'freight_broker') {
    return '50-100';
  } else if (profile.companyType === '3pl') {
    return '30-50';
  }
  return '10-20';
}

function estimateDriverCount(profile: UserOrganizationProfile): number {
  if (profile.fleetSize) {
    return Math.floor(profile.fleetSize * 1.2); // 20% more drivers than trucks for coverage
  }
  return 50; // Default estimate
}

function estimateDriverExperience(): string {
  return '5-10'; // Average years of experience
}

// Detect if this is a government solicitation requiring full FAR-compliant pricing
function isGovernmentSolicitation(
  documentContent: string,
  fileName: string
): boolean {
  const lowerContent = documentContent.toLowerCase();
  const lowerFileName = fileName.toLowerCase();

  // Government solicitation indicators
  const indicators = [
    // Federal/state/local government
    /\b(federal|state|county|city|municipality|government|agency|public works|department)\b/i,
    // Specific agencies
    /\b(gsa|dot|fmcsa|faa|dod|va|hhs|dhs|usda|nist)\b/i,
    // Government-specific terms
    /\b(far|dfar|solicitation number|naics|duns|sam\.gov|fpds|fedbizopps|beta\.sam\.gov)\b/i,
    // Contract types
    /\b(firm fixed price|ffp|cost plus|cpff|time and materials|idiq)\b/i,
    // Evaluation criteria
    /\b(lpta|lowest price technically acceptable|best value|past performance evaluation)\b/i,
    // Procurement language
    /\b(basis of estimate|boe|indirect rates|weighted guidelines|far 15\.404)\b/i,
    // Common government terms
    /\b(contract line item number|clin|period of performance|pop|award notification)\b/i,
    // Document type indicators
    /\b(rfb|rfp|rfq|rfi|request for (bid|proposal|quote|information))\b/i,
  ];

  // Check if multiple indicators are present (more reliable)
  const matchCount = indicators.filter(
    (pattern) => pattern.test(lowerContent) || pattern.test(lowerFileName)
  ).length;

  // Debug logging
  console.log('🔍 Government Solicitation Detection:');
  console.log('  File name:', fileName);
  console.log('  Indicators found:', matchCount);
  console.log('  First 500 chars:', documentContent.substring(0, 500));

  // Check each indicator
  indicators.forEach((pattern, idx) => {
    const matches = pattern.test(lowerContent) || pattern.test(lowerFileName);
    if (matches) {
      console.log(`  ✅ Indicator ${idx + 1} matched:`, pattern.source);
    }
  });

  return matchCount >= 2; // Require at least 2 indicators
}

// Extract text from PDF using pdf-parse-fork
async function extractPDFText(base64Data: string): Promise<string> {
  try {
    const pdfBuffer = Buffer.from(base64Data, 'base64');
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw error;
  }
}

// Extract text from PDF buffer
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF document');
  }
}

// Build comprehensive response text from generated responses
function buildComprehensiveResponseText(
  comprehensiveResponses: any,
  userProfile: any,
  rfbAnalysis: any
): string {
  const responses = comprehensiveResponses.responses;
  const summary = comprehensiveResponses.responseSummary;
  const documentInfo = rfbAnalysis.documentMetadata;

  // Build the complete bid response
  let responseText = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    COMPREHENSIVE BID RESPONSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TO: ${documentInfo.agency || 'Procurement Office'}
DATE: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}
RE: Response to ${rfbAnalysis.solicitationNumber || 'Solicitation'} - ${rfbAnalysis.projectTitle || 'Project'}
DOCUMENT: ${rfbAnalysis.fileName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                      BIDDER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Legal Company Name:     ${userProfile.companyName}
Federal Tax ID (EIN):   ${userProfile.ein || '[TO BE INSERTED]'}
UEI Number (SAM.gov):   ${userProfile.ueiNumber || '[TO BE INSERTED]'}
DUNS Number:            ${userProfile.dunsNumber || '[TO BE INSERTED]'}
CAGE Code:              ${userProfile.cageCode || '[TO BE INSERTED]'}
${userProfile.scacCode ? `SCAC Code:              ${userProfile.scacCode}` : ''}
${userProfile.npiNumber ? `NPI Number:             ${userProfile.npiNumber}` : ''}
${userProfile.mcNumber ? `MC Number:              ${userProfile.mcNumber}` : ''}
${userProfile.dotNumber ? `DOT Number:             ${userProfile.dotNumber}` : ''}
${userProfile.certifications.length > 0 ? `Certifications:         ${userProfile.certifications.join(', ')} ✅ CERTIFIED (Certificate Attached - Appendix A)` : ''}
President/Owner:        Dieasha "Dee" Davis
Business Address:       ${userProfile.address || '[TO BE INSERTED]'}
Phone:                  ${userProfile.phone || '[TO BE INSERTED]'}
Email:                  ${userProfile.email || '[TO BE INSERTED]'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                      RESPONSE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Requirements Analyzed: ${summary.totalRequirements}
✅ Compliant: ${summary.compliant}
⚠️  Partial Compliance: ${summary.partial}
❌ Non-Compliant: ${summary.nonCompliant}
➖ Not Applicable: ${summary.notApplicable}
❓ Requires Operations Input: ${summary.needsInput}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    DETAILED REQUIREMENT RESPONSES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

  // Add each requirement response
  responses.forEach((response: any, index: number) => {
    responseText += `\n${index + 1}. ${response.requirementText}\n`;
    responseText += `   Status: ${response.complianceStatus}\n`;
    responseText += `   Response: ${response.responseText}\n`;

    if (response.specificDetails && response.specificDetails.length > 0) {
      responseText += `   Details:\n`;
      response.specificDetails.forEach((detail: any) => {
        responseText += `   • ${detail.key}: ${detail.value}\n`;
      });
    }

    if (
      response.supportingDocuments &&
      response.supportingDocuments.length > 0
    ) {
      responseText += `   Supporting Documents: ${response.supportingDocuments.join(', ')}\n`;
    }

    responseText += `\n`;
  });

  // Add pricing information if available
  if (comprehensiveResponses.proposalSections) {
    responseText += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                      PROPOSAL SECTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

    const sections = comprehensiveResponses.proposalSections;
    if (sections.executiveSummary) {
      responseText += `\nEXECUTIVE SUMMARY:\n${sections.executiveSummary}\n`;
    }
    if (sections.companyOverview) {
      responseText += `\nCOMPANY OVERVIEW:\n${sections.companyOverview}\n`;
    }
    if (sections.technicalApproach) {
      responseText += `\nTECHNICAL APPROACH:\n${sections.technicalApproach}\n`;
    }
    if (sections.qualificationsAndExperience) {
      responseText += `\nQUALIFICATIONS & EXPERIENCE:\n${sections.qualificationsAndExperience}\n`;
    }
  }

  responseText += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                      END OF RESPONSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Submitted by: Dieasha "Dee" Davis
President, DEE DAVIS INC dba DEPOINTE
Date: ${new Date().toLocaleDateString('en-US')}

Contact Information:
Phone: (248) 376-4550
Email: info@deedavis.biz
Website: www.deedavis.biz
`;

  return responseText;
}

export async function POST(request: NextRequest) {
  try {
    // Check if this is a FormData request (document upload) or JSON request
    const contentType = request.headers.get('content-type') || '';

    let body: RFxAnalysisRequest;
    let uploadedDocument: Buffer | null = null;
    let documentFileName = '';

    let companyDocument: Buffer | null = null;
    let companyDocumentFileName = '';

    if (contentType.includes('multipart/form-data')) {
      // Handle FormData request with document upload
      const formData = await request.formData();
      const documentFile = formData.get('document') as File;
      const companyDocFile = formData.get('companyDocument') as File;

      if (documentFile) {
        uploadedDocument = Buffer.from(await documentFile.arrayBuffer());
        documentFileName = documentFile.name;
      }

      if (companyDocFile) {
        companyDocument = Buffer.from(await companyDocFile.arrayBuffer());
        companyDocumentFileName = companyDocFile.name;
      }

      // Get other fields from form data
      const jsonData = formData.get('data') as string;
      if (jsonData) {
        body = JSON.parse(jsonData);
      } else {
        return NextResponse.json(
          { error: 'Missing request data' },
          { status: 400 }
        );
      }
    } else {
      // Handle JSON request
      body = (await request.json()) as RFxAnalysisRequest;
    }

    let { documentContent, documentType, fileName, fileData } = body;

    // If we have an uploaded document (FormData), extract its content
    if (uploadedDocument && !documentContent) {
      try {
        const extractedText = await extractTextFromPDF(uploadedDocument);
        documentContent = extractedText;
        fileName = documentFileName || fileName;
      } catch (error) {
        console.error('Error extracting text from uploaded document:', error);
        return NextResponse.json(
          { error: 'Failed to extract text from uploaded document' },
          { status: 400 }
        );
      }
    }

    // MULTI-TENANT: Fetch logged-in user's organization profile
    const userProfile = await getUserOrganizationProfile(request);

    if (!userProfile) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Unable to fetch user organization profile. Please ensure you are logged in and have a company profile configured.',
        },
        { status: 401 }
      );
    }

    // Extract company profile from company document if provided
    let extractedProfile: any = null;
    if (companyDocument) {
      try {
        const { extractCompanyProfileFromDocument } = await import(
          './company-profile-extractor'
        );
        extractedProfile = await extractCompanyProfileFromDocument(
          companyDocument,
          companyDocumentFileName,
          userProfile
        );
        console.log('📄 Extracted company profile from company document:', {
          pastPerformanceItems: extractedProfile.pastPerformance?.length || 0,
          certificationsFound: extractedProfile.certifications?.length || 0,
          referencesExtracted: extractedProfile.references?.length || 0,
        });
      } catch (error) {
        console.warn('Failed to extract company profile from document:', error);
        // Continue without extracted profile
      }
    }

    console.log(
      `🏢 Generating bid response for: ${userProfile.companyName} (${userProfile.companyType})`
    );

    // Get role-specific descriptions
    const roleInfo = getRoleDescription(userProfile.companyType);

    // Declare metadata variables at function scope
    let solicitationId = '';
    let contactName = '';
    let emailMatch: RegExpMatchArray | null = null;
    let phoneMatch: RegExpMatchArray | null = null;
    let deadline = '';
    let extractedRequirements: string[] = [];
    let submissionInstructions: string[] = [];

    // Extract text from PDF if uploaded
    if (fileName.toLowerCase().endsWith('.pdf') && fileData) {
      try {
        console.log('📄 Extracting text from PDF:', fileName);
        documentContent = await extractPDFText(fileData);
        console.log(
          '✅ PDF text extracted:',
          documentContent.length,
          'characters'
        );
        console.log('📄 First 300 chars:', documentContent.substring(0, 300));
      } catch (pdfError) {
        console.error('❌ PDF extraction failed:', pdfError);
        console.log('⚠️ Falling back to raw content');
      }
    }

    console.log(
      '📄 Processing document:',
      fileName,
      '(',
      documentContent.length,
      'chars)'
    );

    // Initialize Claude AI Service
    const claudeService = new ClaudeAIService();

    // Create comprehensive analysis prompt with USER'S company information (MULTI-TENANT)
    const analysisPrompt = `
      As an expert bid analyst for ${userProfile.companyName}, analyze this ${documentType} document and provide comprehensive bidding insights:

      COMPANY INFORMATION:
      • Company Name: ${userProfile.companyName}
      • Company Type: ${roleInfo.roleTitle}
      ${userProfile.mcNumber ? `• MC Number: ${userProfile.mcNumber}` : ''}
      ${userProfile.dotNumber ? `• DOT Number: ${userProfile.dotNumber}` : ''}
      • President/Owner: Dieasha "Dee" Davis (Founder & Developer of FleetFlow™ Platform)
      • Woman-Owned Small Business (WOSB): Yes
      • Operating Division: FREIGHT 1ST DIRECT (Dispatch Services)
      • Contact: info@deedavis.biz

      DOCUMENT TYPE: ${documentType}
      DOCUMENT NAME: ${fileName}
      DOCUMENT CONTENT:
      ${documentContent}

      IMPORTANT: Extract the contact person's name from the document if present (look for patterns like "Contact:", "POC:", "Contracting Officer:", "Attention:", or signature lines). Use this name to personalize the greeting in the generated response.

      Please provide a detailed analysis in the following JSON format:

      {
        "documentType": "${documentType}",
        "summary": "Brief 2-3 sentence summary of the transportation requirements",
        "keyRequirements": [
          "List 4-6 key requirements extracted from the document",
          "Include equipment, timing, special handling, insurance, etc.",
          "Focus on compliance and operational requirements"
        ],
        "recommendedBid": "$X,XXX (provide specific dollar amount based on analysis)",
        "competitiveAdvantage": [
          "List 4-6 competitive advantages FleetFlow can highlight",
          "Focus on safety, technology, experience, and service quality",
          "Include specific differentiators and value propositions"
        ],
        "riskFactors": [
          "List 3-5 potential risk factors or challenges",
          "Include operational, financial, and compliance risks",
          "Consider weather, timing, equipment, and liability issues"
        ],
        "confidence": 85,
        "bidStrategy": {
          "pricing": "Detailed pricing strategy explanation",
          "timeline": "Recommended timeline and delivery approach",
          "approach": "Overall bid approach and positioning strategy"
        },
        "generatedResponse": "Generate a professional, comprehensive bid response letter that includes:
        - Personalized greeting using contact person's name if found (e.g., 'Dear John Smith,'), otherwise use 'Dear Procurement Team,'
        - Professional letterhead with company name: DEE DAVIS INC dba DEPOINTE
        - Include MC 1647572 | DOT 4250594 | Woman-Owned Small Business (WOSB)
        - Signed by: Dieasha 'Dee' Davis, President
        - Mention FleetFlow™ technology (developed by Dieasha Davis)
        - Executive summary of DEPOINTE's capabilities
        - Detailed response to specific requirements
        - Competitive pricing with justification
        - Value proposition highlighting WOSB status and FleetFlow™ technology
        - Risk mitigation strategies
        - Implementation timeline
        - Contact: info@deedavis.biz
        - Professional closing from Dieasha 'Dee' Davis

        Make it specific to the ${documentType} requirements and demonstrate DEPOINTE's understanding of the shipper's needs. Emphasize WOSB benefits for procurement diversity goals."
      }

      Ensure all recommendations are realistic for the transportation industry and consider:
      - Current market rates for similar lanes
      - Equipment requirements and availability
      - Regulatory compliance (DOT, FMCSA, etc.)
      - Insurance and liability considerations
      - Seasonal and operational factors
      - Competitive positioning in the market

      Return ONLY the JSON object, no additional text.
    `;

    // Get AI analysis
    const aiResponse = await claudeService.generateDocument(
      analysisPrompt,
      'rfx_analysis'
    );

    // Parse the AI response
    let analysis: AIBidAnalysis;
    try {
      analysis = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);

      // PARSE THE ACTUAL DOCUMENT CONTENT
      const docLower = documentContent.toLowerCase();
      extractedRequirements = []; // Clear and repopulate

      // Parse origin/destination (look for city/state or regions)
      const originMatch = documentContent.match(
        /origin[:\s]+([A-Z][a-z]+(?:,?\s*[A-Z]{2})?(?:\s+to\s+[A-Z][a-z]+)?)/i
      );
      const destMatch = documentContent.match(
        /destination[:\s]+([A-Z][a-z]+(?:,?\s*[A-Z]{2})?)/i
      );
      const pickupMatch = documentContent.match(
        /pickup[:\s]+([A-Z][a-z]+(?:,?\s*[A-Z]{2})?)/i
      );
      const deliveryMatch = documentContent.match(
        /delivery[:\s]+([A-Z][a-z]+(?:,?\s*[A-Z]{2})?)/i
      );

      // Only add if we have valid location info (no fragments like "of th")
      if (
        originMatch &&
        originMatch[1].length > 5 &&
        !originMatch[1].includes('of th')
      )
        extractedRequirements.push(`Origin: ${originMatch[1].trim()}`);
      if (
        destMatch &&
        destMatch[1].length > 5 &&
        !destMatch[1].includes('of th')
      )
        extractedRequirements.push(`Destination: ${destMatch[1].trim()}`);
      else if (
        deliveryMatch &&
        deliveryMatch[1].length > 5 &&
        !deliveryMatch[1].includes('of th')
      )
        extractedRequirements.push(`Delivery: ${deliveryMatch[1].trim()}`);

      // Parse weight - handle with or without space
      const weightMatch = documentContent.match(
        /(\d+[,]?\d*)\s*(lbs?|pounds|kg|kilograms|tons?)/i
      );
      if (weightMatch) {
        // Ensure proper spacing
        const number = weightMatch[1];
        const unit = weightMatch[2];
        extractedRequirements.push(`Weight: ${number} ${unit}`);
      }

      // Parse equipment
      const equipmentTypes = [
        'dry van',
        'reefer',
        'flatbed',
        'step deck',
        'lowboy',
        'tanker',
        'container',
        'box truck',
      ];
      for (const eq of equipmentTypes) {
        if (docLower.includes(eq)) {
          extractedRequirements.push(
            `Equipment: ${eq.charAt(0).toUpperCase() + eq.slice(1)}`
          );
          break;
        }
      }

      // Parse special requirements
      if (
        docLower.includes('temperature') ||
        docLower.includes('refrigerat') ||
        docLower.includes('reefer')
      ) {
        extractedRequirements.push('Temperature-controlled transport required');
      }
      if (docLower.includes('hazmat') || docLower.includes('hazardous')) {
        extractedRequirements.push('Hazmat certification required');
      }
      if (docLower.includes('liftgate')) {
        extractedRequirements.push('Liftgate service required');
      }
      if (
        docLower.includes('expedited') ||
        docLower.includes('rush') ||
        docLower.includes('urgent')
      ) {
        extractedRequirements.push('Expedited/rush delivery required');
      }

      // Parse insurance
      const insuranceMatch = documentContent.match(
        /insurance.*?\$\s*(\d+[,]?\d*[,]?\d*)/i
      );
      if (insuranceMatch)
        extractedRequirements.push(
          `Insurance requirement: $${insuranceMatch[1]}`
        );

      // Parse deadline with context
      deadline = ''; // Reset
      const deadlinePatterns = [
        /(?:deadline|due date|closing date|submission date|expiration date)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i,
        /(?:deadline|due date|closing date|submission date|expiration date)[:\s]+([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})/i,
        /(?:responses? (?:must be )?(?:received|submitted) by)[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/i,
        /(?:responses? (?:must be )?(?:received|submitted) by)[:\s]+([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})/i,
      ];

      for (const pattern of deadlinePatterns) {
        const match = documentContent.match(pattern);
        if (match && match[1]) {
          deadline = match[1];
          break;
        }
      }

      // Parse submission requirements (store separately, not in extractedRequirements)
      submissionInstructions = []; // Reset

      // Extract submission email
      emailMatch = documentContent.match(
        /(?:submit|send|email|contact email)[:\s]+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
      );

      // Extract portal/website
      const portalMatch = documentContent.match(
        /(?:portal|website|url|submit (?:at|to))[:\s]+(https?:\/\/[^\s]+)/i
      );

      // Extract contact phone
      phoneMatch = documentContent.match(
        /(?:contact number|phone|telephone)[:\s]+(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/i
      );

      // Build submission instructions array
      if (deadline) submissionInstructions.push(`⏰ Deadline: ${deadline}`);
      if (emailMatch)
        submissionInstructions.push(`📧 Submit To: ${emailMatch[1]}`);
      if (phoneMatch)
        submissionInstructions.push(`📞 Contact: ${phoneMatch[1]}`);
      if (portalMatch)
        submissionInstructions.push(`🌐 Portal: ${portalMatch[1]}`);

      // Parse contact person name
      contactName = ''; // Reset
      const namePatterns = [
        /Contact\s+Name[:\s]+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
        /(?:poc|point of contact)[:\s]+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
        /(?:contracting officer|procurement officer|buyer)[:\s]+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
        /(?:attention|attn)[:\s]+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
        /(?:sincerely|regards|best)[,\s]+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
        /(?:from|issued by)[:\s]+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
      ];

      for (const pattern of namePatterns) {
        const match = documentContent.match(pattern);
        if (match && match[1]) {
          contactName = match[1].trim();
          break;
        }
      }

      // Add contact name to submission instructions if found
      if (contactName && phoneMatch) {
        // Update the contact line to include name
        const contactIndex = submissionInstructions.findIndex((s) =>
          s.startsWith('📞')
        );
        if (contactIndex >= 0) {
          submissionInstructions[contactIndex] =
            `📞 Contact: ${contactName} - ${phoneMatch[1]}`;
        }
      } else if (contactName) {
        submissionInstructions.push(`👤 Contact: ${contactName}`);
      }

      // Parse solicitation/RFP/RFQ ID
      solicitationId = ''; // Reset
      const idPatterns = [
        /(?:Pre-)?Solicitation\s+ID[:\s]+([A-Z0-9\-]+)/i,
        /(?:RFP|RFQ|RFI)\s+(?:Number|#|ID)[:\s]+([A-Z0-9\-]+)/i,
        /Solicitation\s+Number[:\s]+([A-Z0-9\-]+)/i,
        /Reference\s+(?:Number|ID)[:\s]+([A-Z0-9\-]+)/i,
      ];

      for (const pattern of idPatterns) {
        const match = documentContent.match(pattern);
        if (match && match[1]) {
          solicitationId = match[1].trim();
          break;
        }
      }

      // Extract mandatory statements
      const mustStatements = documentContent.match(
        /(?:must|shall|required to|mandatory)[^.!?]{1,150}[.!?]/gi
      );
      if (mustStatements) {
        mustStatements.slice(0, 5).forEach((statement) => {
          // Clean up spacing issues from PDF extraction
          let cleaned = statement
            .trim()
            .replace(/\s+/g, ' ') // Multiple spaces to single
            .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
            .replace(/(\d+)([a-z])/gi, '$1 $2') // Add space between number and letters
            // Fix specific merged word patterns (be careful not to break existing words)
            .replace(/\bfromout-of-state/gi, 'from out-of-state')
            .replace(/\bwithall\b/gi, 'with all')
            .replace(/\bandall\b/gi, 'and all')
            .replace(/\btoall\b/gi, 'to all')
            .replace(/  +/g, ' '); // Clean up any double spaces created

          // Capitalize first letter
          cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

          // Only add if it's a good quality requirement
          if (
            cleaned.length > 20 &&
            cleaned.length < 200 &&
            !cleaned.includes('of th')
          ) {
            extractedRequirements.push(cleaned);
          }
        });
      }

      // Extract description or scope of work
      const descriptionMatch = documentContent.match(
        /(?:description|scope of work|statement of work|requirements)[\s:]+(.{100,500})/i
      );
      if (descriptionMatch) {
        const desc = descriptionMatch[1]
          .replace(/\s+/g, ' ')
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .trim();

        // Split into sentences and take the first few good ones
        const sentences = desc.match(/[^.!?]+[.!?]+/g) || [];
        sentences.slice(0, 3).forEach((sentence) => {
          const cleaned = sentence.trim();
          if (
            cleaned.length > 30 &&
            cleaned.length < 200 &&
            !cleaned.includes('of th')
          ) {
            // Capitalize first letter
            const capitalized =
              cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
            extractedRequirements.push(capitalized);
          }
        });
      }

      // If still no requirements found, add generic
      if (extractedRequirements.length === 0) {
        extractedRequirements.push(
          'Transportation and logistics services as specified in solicitation'
        );
        extractedRequirements.push('DOT/FMCSA compliant carrier required');
        extractedRequirements.push(
          'Proof of insurance and carrier verification required'
        );
      }

      // Create document summary
      const documentSummary = `${documentType} for ${fileName} - Transportation and logistics services. ${extractedRequirements.length} requirements identified from document analysis.`;

      // DEBUG: Log what was extracted
      console.log('📄 DOCUMENT PARSING DEBUG:');
      console.log('Contact Name:', contactName || 'NOT FOUND');
      console.log('Solicitation ID:', solicitationId || 'NOT FOUND');
      console.log('Extracted Requirements:', extractedRequirements);
      console.log(
        'First 500 chars of document:',
        documentContent.substring(0, 500)
      );

      // Fallback analysis WITH PARSED CONTENT
      // Generate different response based on document type
      let generatedResponse = '';

      // Determine response detail level based on document type
      const isFormalBid = ['RFB', 'RFP', 'RFQ', 'BID'].includes(
        documentType.toUpperCase()
      );
      const isInformational = ['RFI', 'SOURCES_SOUGHT', 'SS'].includes(
        documentType.toUpperCase()
      );

      // COMPREHENSIVE GOVERNMENT RFB PARSING - Declare at top level for scope
      let comprehensiveRFBAnalysis = null;
      let comprehensiveResponses = null;

      if (isFormalBid) {
        // GENERATE INTELLIGENT RESPONSES FOR EACH REQUIREMENT
        const intelligentResponses = generateIntelligentResponses(
          extractedRequirements,
          userProfile
        );

        // DETECT IF THIS IS A GOVERNMENT SOLICITATION
        const isGovSolicitation = isGovernmentSolicitation(
          documentContent,
          fileName
        );

        console.log(
          `📋 Solicitation Type: ${isGovSolicitation ? 'GOVERNMENT (FAR-compliant pricing required)' : 'COMMERCIAL'}`
        );

        if (isGovSolicitation) {
          // STEP 1: Parse the ENTIRE RFB document comprehensively
          console.log(
            '\n🔬 COMPREHENSIVE RFB ANALYSIS - Starting full document scan...'
          );
          comprehensiveRFBAnalysis = parseGovernmentRFB(
            documentContent,
            fileName
          );

          console.log(`\n📊 COMPREHENSIVE RFB PARSING COMPLETE:`);
          console.log(
            `   Document Type: ${comprehensiveRFBAnalysis.documentType}`
          );
          console.log(
            `   Solicitation: ${comprehensiveRFBAnalysis.solicitationNumber || 'N/A'}`
          );
          console.log(
            `   Agency: ${comprehensiveRFBAnalysis.issuingAgency || 'N/A'}`
          );
          console.log(
            `   Project: ${comprehensiveRFBAnalysis.projectTitle || 'N/A'}`
          );
          console.log(
            `   Sections Found: ${comprehensiveRFBAnalysis.sections.length}`
          );
          console.log(
            `   Requirements Extracted: ${comprehensiveRFBAnalysis.requirements.length}`
          );
          console.log(
            `   Questions Found: ${comprehensiveRFBAnalysis.documentMetadata.questionsFound}`
          );
          console.log(
            `   Mandatory Items: ${comprehensiveRFBAnalysis.documentMetadata.mandatoryItems}`
          );

          // STEP 2: Generate comprehensive responses for ALL requirements
          console.log(
            '\n📝 COMPREHENSIVE RESPONSE GENERATION - Answering ALL requirements...'
          );
          comprehensiveResponses = generateComprehensiveResponses(
            comprehensiveRFBAnalysis.requirements,
            userProfile,
            {
              solicitationNumber: comprehensiveRFBAnalysis.solicitationNumber,
              projectTitle: comprehensiveRFBAnalysis.projectTitle,
              issuingAgency: comprehensiveRFBAnalysis.issuingAgency,
            },
            extractedProfile
          );

          console.log(`\n✅ COMPREHENSIVE RESPONSES GENERATED:`);
          console.log(
            `   Total Requirements: ${comprehensiveResponses.responseSummary.totalRequirements}`
          );
          console.log(
            `   ✅ Compliant: ${comprehensiveResponses.responseSummary.compliant}`
          );
          console.log(
            `   ⚠️  Partial: ${comprehensiveResponses.responseSummary.partial}`
          );
          console.log(
            `   ❌ Non-Compliant: ${comprehensiveResponses.responseSummary.nonCompliant}`
          );
          console.log(
            `   ➖ N/A: ${comprehensiveResponses.responseSummary.notApplicable}`
          );

          // Build comprehensive response text from all responses
          generatedResponse = buildComprehensiveResponseText(
            comprehensiveResponses,
            userProfile,
            comprehensiveRFBAnalysis
          );
        }

        // GENERATE PRICING SCHEDULE
        let formattedPricing = '';
        let governmentPricingAnalysis: any = null;
        let pricingSchedule: any = null;

        if (isGovSolicitation) {
          // GOVERNMENT SOLICITATION: Use comprehensive FAR-compliant pricing
          console.log(
            '\n🏛️ Generating FAR-compliant government contract pricing...'
          );

          // Default financial values (should come from user profile in production)
          const companyFinancials: CompanyFinancials = {
            driverWage: 25.0,
            dispatcherWage: 30.0,
            supervisorWage: 35.0,
            fringeBenefitRate: 0.3,
            overheadRate: 0.378,
            fuelCostPerGallon: 3.8,
            vehicleMPG: 6.5,
            maintenanceCostPerMonth: 3000,
            insuranceCostPerMonth: 4500,
            profitMarginTarget: 0.1,
          };

          governmentPricingAnalysis = await analyzeGovernmentPricing({
            requirements: extractedRequirements,
            documentContent,
            userProfile,
            companyFinancials,
          });

          // Format the government pricing analysis
          const pricePerLoad = governmentPricingAnalysis.totalPrice / 1100; // Assuming ~1100 loads/month

          formattedPricing = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏛️ FAR-COMPLIANT GOVERNMENT CONTRACT PRICING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EVALUATION METHOD: ${governmentPricingAnalysis.evaluationCriteria.method}
${
  governmentPricingAnalysis.evaluationCriteria.factors
    ? `
EVALUATION FACTORS:
  • Technical: ${governmentPricingAnalysis.evaluationCriteria.factors.technical}%
  • Past Performance: ${governmentPricingAnalysis.evaluationCriteria.factors.pastPerformance}%
  • Price: ${governmentPricingAnalysis.evaluationCriteria.factors.price}%
`
    : ''
}
CONTRACT TYPE: ${governmentPricingAnalysis.contractType.type} (${governmentPricingAnalysis.contractType.performancePeriod})

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COST/PRICE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COST ELEMENT                          MONTHLY            ANNUAL
───────────────────────────────────────────────────────────────────
Direct Labor                          $${governmentPricingAnalysis.directCosts.labor.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}       $${(governmentPricingAnalysis.directCosts.labor.total * 12).toLocaleString('en-US', { minimumFractionDigits: 2 })}
Direct Materials                      $${governmentPricingAnalysis.directCosts.materials.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}       $${(governmentPricingAnalysis.directCosts.materials.total * 12).toLocaleString('en-US', { minimumFractionDigits: 2 })}
Subcontractors                        $${governmentPricingAnalysis.directCosts.subcontractors.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}        $${(governmentPricingAnalysis.directCosts.subcontractors.total * 12).toLocaleString('en-US', { minimumFractionDigits: 2 })}
───────────────────────────────────────────────────────────────────
Total Direct Costs                    $${governmentPricingAnalysis.directCosts.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}      $${(governmentPricingAnalysis.directCosts.total * 12).toLocaleString('en-US', { minimumFractionDigits: 2 })}

Overhead (${(governmentPricingAnalysis.indirectCosts.overheadRate * 100).toFixed(1)}%)                    $${governmentPricingAnalysis.indirectCosts.overheadAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}       $${(governmentPricingAnalysis.indirectCosts.overheadAmount * 12).toLocaleString('en-US', { minimumFractionDigits: 2 })}
───────────────────────────────────────────────────────────────────
Total Estimated Cost                  $${governmentPricingAnalysis.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}      $${(governmentPricingAnalysis.totalCost * 12).toLocaleString('en-US', { minimumFractionDigits: 2 })}

Profit (${(governmentPricingAnalysis.profitAnalysis.profitRate * 100).toFixed(1)}%)                       $${governmentPricingAnalysis.profitAnalysis.profitAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}       $${(governmentPricingAnalysis.profitAnalysis.profitAmount * 12).toLocaleString('en-US', { minimumFractionDigits: 2 })}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL PRICE                           $${governmentPricingAnalysis.totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}      $${(governmentPricingAnalysis.totalPrice * 12).toLocaleString('en-US', { minimumFractionDigits: 2 })}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UNIT PRICING:                         $${pricePerLoad.toFixed(2)}/load

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRICING STRATEGY ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Competitive Risk: ${governmentPricingAnalysis.pricingStrategy.competitiveRisk}

RECOMMENDATIONS:
${governmentPricingAnalysis.pricingStrategy.recommendations.map((rec) => `• ${rec}`).join('\n')}

${governmentPricingAnalysis.pricingStrategy.justification}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFICATION STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${governmentPricingAnalysis.verificationReport.complianceChecks
  .map((check) => `${check.passed ? '✅' : '❌'} ${check.check}`)
  .join('\n')}

${
  governmentPricingAnalysis.verificationReport.warnings.length > 0
    ? `
⚠️ WARNINGS:
${governmentPricingAnalysis.verificationReport.warnings.map((w) => `  • ${w}`).join('\n')}
`
    : ''
}

${governmentPricingAnalysis.verificationReport.readyForSubmission ? '✅ PROPOSAL READY FOR SUBMISSION' : '⚠️ PROPOSAL REQUIRES REVIEW BEFORE SUBMISSION'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 SUPPORTING SCHEDULES GENERATED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The following FAR-compliant schedules are included as separate sections:
• Schedule 1: Labor Detail (with fringe benefit breakdown)
• Schedule 2: Bill of Materials (fuel, supplies, subcontractors)
• Schedule 3: Indirect Rate Computation (overhead calculation)
• Schedule 4: Basis of Estimate (detailed cost justifications)
• Pricing Narrative (fair and reasonable price determination)

📎 These schedules should be attached as separate exhibits to your proposal.
`;
        } else {
          // COMMERCIAL BID: Use simplified intelligent pricing
          console.log('💼 Generating commercial pricing schedule...');

          pricingSchedule = generatePricingSchedule(
            extractedRequirements,
            userProfile
          );
          formattedPricing = formatPricingScheduleForBid(pricingSchedule);
        }

        // FORMAL BID RESPONSE - STRUCTURED, COMPLIANCE-FOCUSED, BID-SPECIFIC
        generatedResponse = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                          FORMAL BID RESPONSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TO: ${contactName || 'Procurement Office'}
DATE: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
RE: ${documentType.toUpperCase()} Response${solicitationId ? ` - ${solicitationId}` : ''}
DOCUMENT: ${fileName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear ${contactName || 'Procurement Team'},

${userProfile.companyName} hereby submits this formal bid response in accordance with all terms, conditions, and specifications outlined in the referenced solicitation document.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: BIDDER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Legal Company Name:     ${userProfile.companyName}
Federal Tax ID (EIN):   ${userProfile.ein || '[TO BE INSERTED]'}
UEI Number (SAM.gov):   ${userProfile.ueiNumber || '[TO BE INSERTED]'}
DUNS Number:            ${userProfile.dunsNumber || '[TO BE INSERTED]'}
CAGE Code:              ${userProfile.cageCode || '[TO BE INSERTED]'}
${userProfile.scacCode ? `SCAC Code:              ${userProfile.scacCode}` : ''}
${userProfile.npiNumber ? `NPI Number:             ${userProfile.npiNumber}` : ''}
${userProfile.mcNumber ? `MC Number:              ${userProfile.mcNumber}` : ''}
${userProfile.dotNumber ? `DOT Number:             ${userProfile.dotNumber}` : ''}
${userProfile.certifications.length > 0 ? `Certifications:         ${userProfile.certifications.join(', ')} ✅ CERTIFIED (Certificate Attached - Appendix A)` : ''}
President/Owner:        Dieasha "Dee" Davis
Business Address:       ${userProfile.address || '[TO BE INSERTED]'}
Phone:                  ${userProfile.phone || '[TO BE INSERTED]'}
Email:                  ${userProfile.email || '[TO BE INSERTED]'}
Website:                ${userProfile.website || '[TO BE INSERTED]'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: COMPLIANCE MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${userProfile.companyName} confirms full compliance with all solicitation requirements as follows:

${
  // USE COMPREHENSIVE RESPONSES FOR GOVERNMENT BIDS, INTELLIGENT RESPONSES FOR COMMERCIAL
  comprehensiveResponses && comprehensiveResponses.responses.length > 0
    ? comprehensiveResponses.responses
        .map((response, idx) => {
          const complianceIcon =
            response.complianceStatus === 'COMPLIANT'
              ? '✅ FULLY COMPLIANT'
              : response.complianceStatus === 'PARTIAL'
                ? '⚠️ PARTIALLY COMPLIANT'
                : response.complianceStatus === 'NON_COMPLIANT'
                  ? '❌ NON-COMPLIANT'
                  : '➖ NOT APPLICABLE';

          return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${response.requirementId}: ${response.requirementText}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMPLIANCE STATUS: ${complianceIcon}

RESPONSE:
${response.responseText}

${
  response.specificDetails.length > 0
    ? `
SPECIFIC DETAILS:
${response.specificDetails.map((detail) => `• ${detail.key}: ${detail.value}`).join('\n')}
`
    : ''
}

${
  response.supportingDocuments.length > 0
    ? `
SUPPORTING DOCUMENTATION:
${response.supportingDocuments.map((doc, i) => `  ${i + 1}. ${doc}`).join('\n')}
`
    : ''
}

${
  response.notes.length > 0
    ? `
NOTES:
${response.notes.map((note, i) => `  • ${note}`).join('\n')}
`
    : ''
}
`;
        })
        .join('\n')
    : intelligentResponses
        .map((response, idx) => {
          const complianceIcon =
            response.complianceStatus === 'fully_compliant'
              ? '✅ FULLY COMPLIANT'
              : response.complianceStatus === 'partially_compliant'
                ? '⚠️ PARTIALLY COMPLIANT'
                : '❌ NON-COMPLIANT';

          return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REQUIREMENT ${idx + 1}: ${response.requirement}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMPLIANCE STATUS: ${complianceIcon}

HOW WE MEET THIS REQUIREMENT:
${response.detailedResponse}

${
  response.pricingGuidance
    ? `
PRICING STRUCTURE:
${response.pricingGuidance}
`
    : ''
}

${
  response.supportingEvidence.length > 0
    ? `
SUPPORTING DOCUMENTATION:
${response.supportingEvidence.map((evidence, i) => `  ${i + 1}. ${evidence}`).join('\n')}
`
    : ''
}

${
  response.riskFactors && response.riskFactors.length > 0
    ? `
⚠️ RISK MITIGATION PLAN:
${response.riskFactors.map((risk, i) => `  ${i + 1}. ${risk}`).join('\n')}
`
    : ''
}
`;
        })
        .join('\n')
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: PRICING SCHEDULE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${formattedPricing}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: TECHNICAL APPROACH & CAPABILITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4.1 TRANSPORTATION CAPABILITIES

${
  userProfile.companyType === 'freight_broker'
    ? `
Brokerage Operations Model:
${userProfile.companyName} operates as a licensed property freight broker (${userProfile.mcNumber}), coordinating transportation services through a pre-qualified network of vetted motor carriers. This model provides:

• Access to ${estimateCarrierPoolSize(userProfile)} carriers nationwide specializing in various equipment types
• Flexibility to scale capacity up or down based on seasonal demand
• No fixed fleet costs - competitive pricing through market negotiation
• Backup carrier coverage for service continuity and surge capacity
• Direct carrier relationships for priority capacity allocation

Carrier Qualification Process:
• Insurance verification: $1M+ auto liability, $100K+ cargo minimum
• DOT/FMCSA safety rating check (Satisfactory or None on File)
• SMS/BASIC score review (all categories within acceptable thresholds)
• Equipment inspection and age verification
• Annual re-qualification and ongoing performance monitoring

FleetFlow™ Broker Platform:
• Real-time carrier sourcing and load tendering
• Automated carrier compliance monitoring
• GPS tracking integration across all carrier partners
• Centralized POD collection and documentation management
• Performance analytics for carrier selection optimization
`
    : userProfile.companyType === 'asset_carrier'
      ? `
Asset-Based Operations:
${userProfile.companyName} operates a company-owned fleet under ${userProfile.dotNumber}, providing direct control over equipment, drivers, and service delivery. Our asset-based model includes:

Fleet Composition:
• Total Fleet Size: ${userProfile.fleetSize || '[TO BE INSERTED]'} company-owned trucks
• Equipment Types: ${userProfile.equipmentTypes?.join(', ') || '[TO BE INSERTED - e.g., Dry Van, Flatbed, Reefer]'}
• Average Equipment Age: 2-4 years (maintained below industry average)
• All equipment DOT-compliant with current inspection certificates
• In-house maintenance facility with certified technicians

Direct Employment Model:
• ${estimateDriverCount(userProfile)} employed drivers (W-2, not owner-operators)
• All drivers CDL-qualified with clean MVRs and background checks
• Comprehensive driver training program (orientation, safety, customer service)
• Consistent service quality through direct supervision and accountability
• Driver retention rate: [TO BE INSERTED]%

Real-Time Fleet Management:
• GPS tracking on all company vehicles
• Electronic Logging Devices (ELD) for HOS compliance
• Dispatch coordination center operating 24/7/365
• Preventive maintenance scheduling system
• Fuel management and route optimization technology
`
      : userProfile.companyType === '3pl'
        ? `
Integrated 3PL Service Model:
${userProfile.companyName} provides comprehensive third-party logistics solutions combining warehousing, transportation management, and value-added services:

Multi-Modal Transportation:
• Asset-based fleet: ${userProfile.fleetSize || '[TO BE INSERTED]'} company-owned trucks
• Brokerage network: ${estimateCarrierPoolSize(userProfile)} carrier partners for supplemental capacity
• Intermodal coordination: Rail, ocean, and air freight as needed
• Last-mile delivery capabilities
• Cross-dock and pool distribution services

Warehousing & Fulfillment:
• [TO BE INSERTED - Square footage, locations, specialized capabilities]
• Inventory management system with real-time visibility
• Pick, pack, and ship services
• Kitting, labeling, and light assembly
• Temperature-controlled storage (if applicable)

Technology Platform:
• Integrated WMS (Warehouse Management System) + TMS (Transportation Management System)
• Customer portal with order visibility and reporting
• EDI/API connectivity with client systems
• Real-time inventory tracking and automated replenishment alerts
`
        : `
Logistics Service Capabilities:
${userProfile.companyName} provides tailored transportation and logistics solutions:

• Service capabilities: ${userProfile.capabilities?.join(', ') || '[TO BE INSERTED]'}
• Geographic coverage: ${userProfile.serviceAreas?.join(', ') || 'Nationwide'}
• Years in business: ${userProfile.yearsInBusiness || '10+'}
• Industry specializations: [TO BE INSERTED]
• Technology integration: Real-time tracking, automated reporting, customer portal access
`
}

Geographic Coverage:
• Primary Service Area: ${userProfile.serviceAreas?.join(', ') || '[TO BE INSERTED - e.g., Midwest US, 500-mile radius of Detroit, MI]'}
• Extended Coverage: Nationwide through carrier network partnerships
• Cross-border capabilities: [IF APPLICABLE - Canada/Mexico]

4.2 PERSONNEL & QUALIFICATIONS

Executive Leadership:
• Dieasha "Dee" Davis, President & Founder
  - Developer of FleetFlow™ platform
  - ${userProfile.yearsInBusiness || '10+'} years transportation industry experience
  - WOSB business owner and technology innovator

Operations Team:
• Operations Manager: [NAME, CREDENTIALS TO BE INSERTED]
  - Oversees daily dispatch, carrier coordination, and customer service
  - [X] years logistics experience
• Safety Director: [NAME, CREDENTIALS TO BE INSERTED]
  - DOT compliance oversight and driver safety management
  - [X] years safety management experience
• Customer Service Team: 24/7/365 availability for shipment support

${
  userProfile.companyType === 'asset_carrier' ||
  userProfile.companyType === '3pl'
    ? `
Driver Qualifications (Company Employees):
• All drivers hold valid CDL Class A licenses
• Pre-employment: DOT physical, drug screen, background check, MVR review
• Ongoing: Random drug/alcohol testing, annual MVR monitoring
• Training: New hire orientation, ongoing safety meetings, defensive driving courses
• Experience: Average ${estimateDriverExperience()} years professional driving experience
• Driver qualification files maintained per 49 CFR 391
`
    : ''
}

4.3 TECHNOLOGY & TRACKING

FleetFlow™ Platform Integration:
• Real-time GPS tracking for all shipments (asset-based and brokered)
• Automated exception alerts and proactive issue resolution
• Customer portal: 24/7 access to shipment status, PODs, and reports
• Electronic Proof of Delivery (ePOD) with photo capture and digital signatures
• Customizable reporting: Daily activity, KPI dashboards, exception analysis
• EDI/API integration capabilities for seamless system connectivity
• Mobile app for driver communication and document capture

Communication Protocols:
• Automated status updates at key milestones (pickup, in transit, delivery)
• Proactive notification of delays or exceptions
• 24/7 customer service hotline
• Dedicated account management team
• Escalation procedures for time-critical situations

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5: INSURANCE & BONDING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ [CERTIFICATES OF INSURANCE ATTACHED - See Appendix D]

Commercial Auto Liability:     $[AMOUNT] per occurrence
General Liability:             $[AMOUNT] per occurrence
Cargo Insurance:               $[AMOUNT] per load
Workers' Compensation:         Statutory limits per state
Umbrella/Excess Liability:     $[AMOUNT]

Bonding: [IF REQUIRED - Bid bond, performance bond, payment bond details]

All insurance carriers rated A- or better by A.M. Best.
[CONTRACTING ENTITY] named as additional insured as required.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6: SAFETY & COMPLIANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DOT/FMCSA Compliance:
• MC Number: MC 1647572 (Active)
• DOT Number: DOT 4250594 (Active)
• Safety Rating: [TO BE INSERTED - Satisfactory/None on file]
• BASIC Scores: [TO BE INSERTED - Current percentile rankings]
• Last DOT Audit: [DATE] - [RESULT]

Safety Programs:
• [TO BE INSERTED - Specific safety protocols, training programs]
• Drug & alcohol testing program (DOT-compliant)
• Driver safety incentive program
• Vehicle maintenance program
• Incident reporting and investigation procedures

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 7: PAST PERFORMANCE & REFERENCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ [TO BE INSERTED - 3-5 relevant references with similar scope/size]

Reference 1:
Client: [NAME]
Contract Value: $[AMOUNT]
Period of Performance: [DATES]
Scope: [DESCRIPTION - should be similar to current solicitation]
Contact: [NAME, TITLE, PHONE, EMAIL]
Performance Summary: [KEY METRICS, ACHIEVEMENTS]

Reference 2:
[REPEAT FORMAT]

Reference 3:
[REPEAT FORMAT]

Additional Past Performance: See detailed project list in Appendix E

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 8: SMALL BUSINESS & DIVERSITY CERTIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Woman-Owned Small Business (WOSB) - SBA Certified
   Certificate Number: [TO BE INSERTED]
   Expiration Date: [TO BE INSERTED]
   Certificate attached as Appendix A

Additional Certifications:
• [TO BE INSERTED - WBE, MBE, DBE, SDB, HUBZone, etc. as applicable]

DEPOINTE qualifies for diversity procurement goals and can assist in meeting set-aside requirements.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 9: IMPLEMENTATION PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Upon contract award, DEPOINTE will implement the following mobilization plan:

Days 1-7: Contract Execution & Setup
• Execute contract and process paperwork
• Establish dedicated account team
• Set up FleetFlow™ platform integration
• Conduct kickoff meeting with stakeholders

Days 8-14: Operational Readiness
• [TO BE INSERTED - Specific steps relevant to this solicitation]
• Staff training on client-specific requirements
• Equipment staging and pre-positioning
• Communication protocols established

Days 15-30: Pilot & Optimization
• Begin service delivery
• Monitor performance metrics
• Adjust operations based on feedback
• Full-scale operations commence

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 10: REQUIRED APPENDICES & ATTACHMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ The following documents must be attached before submission:

☐ Appendix A: WOSB Certification
☐ Appendix B: W-9 Form (IRS Form W-9)
☐ Appendix C: Equipment List & Specifications
☐ Appendix D: Insurance Certificates (with additional insured endorsement)
☐ Appendix E: Past Performance/References (detailed project descriptions)
☐ Appendix F: Financial Statements (if required by solicitation)
☐ Appendix G: Bonding Capacity Letter (if required)
☐ Appendix H: Safety Records & DOT Audit Reports
☐ Appendix I: Key Personnel Resumes
☐ Appendix J: Licenses & Permits (MC/DOT authority, business licenses)
☐ Appendix K: FleetFlow™ Technology Overview
☐ Appendix L: [Any additional solicitation-specific requirements]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 11: CERTIFICATIONS & SIGNATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

By submitting this bid, DEE DAVIS INC dba DEPOINTE certifies that:

✅ All information provided is true, accurate, and complete
✅ We have read and understand all solicitation requirements
✅ We agree to all terms and conditions without exception [OR list exceptions]
✅ We are not debarred or suspended from federal/state contracting
✅ We have no conflicts of interest related to this solicitation
✅ Pricing is firm for the specified period
✅ We acknowledge receipt of all addenda: [LIST ADDENDA NUMBERS]

AUTHORIZED SIGNATURE:

_________________________________          Date: ${new Date().toLocaleDateString()}
Dieasha "Dee" Davis, President
DEE DAVIS INC dba DEPOINTE

Printed Name: Dieasha "Dee" Davis
Title: President & Owner
Phone: (248) 376-4550
Email: info@deedavis.biz

${
  submissionInstructions.length > 0
    ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📮 BID SUBMISSION INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${submissionInstructions.join('\n')}

Please ensure all bid materials are submitted before the deadline.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
    : ''
}

Best regards,

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dee Davis
WOSB, WBE, MBE Owner, DEE DAVIS INC

📞 P: 248.376.4550  |  🌐 W: www.deedavis.biz  |  📧 E: info@deedavis.biz
📍 A: 755 W. BIG BEAVER RD STE 2020, Troy, Michigan 48084

🔗 Connect: Facebook | Instagram | LinkedIn
📅 Schedule a chat: https://calendly.com/ddavis-freight1stdirect/30min

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ CONFIDENTIALITY NOTICE: The contents of this email and any attachments are confidential.
They are intended for the named recipient(s) only. If you have received this email by mistake,
please notify the sender immediately and do not disclose the contents to anyone or make copies thereof.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Intelligent Logistics Powered by FleetFlow™ Technology"

---
DEPOINTE STRATEGIC PARTNERSHIPS TEAM
Prepared by: Business Development Division
Document Reference: ${fileName}

This comprehensive response has been prepared by DEPOINTE's Strategic Partnerships Team specifically for your ${documentType}. Our team has carefully reviewed your requirements and prepared this proposal to demonstrate how DEPOINTE can meet your transportation and logistics needs.${
          isGovSolicitation &&
          governmentPricingAnalysis &&
          governmentPricingAnalysis.schedules
            ? `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    FAR-COMPLIANT SUPPORTING SCHEDULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The following schedules provide detailed cost justification and documentation
required for government contract proposals per FAR Part 15:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${governmentPricingAnalysis.schedules.laborDetail || 'LABOR DETAIL SCHEDULE - To be generated'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${governmentPricingAnalysis.schedules.billOfMaterials || 'BILL OF MATERIALS - To be generated'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${governmentPricingAnalysis.schedules.indirectRates || 'INDIRECT RATES - To be generated'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${governmentPricingAnalysis.schedules.basisOfEstimate || 'BASIS OF ESTIMATE - To be generated'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${governmentPricingAnalysis.schedules.pricingNarrative || 'PRICING NARRATIVE - To be generated'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                      END OF SUPPORTING SCHEDULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
            : ''
        }`;
      } else if (isInformational) {
        // INFORMATIONAL RESPONSE - Brief, capabilities-focused
        generatedResponse = `Dear ${contactName || 'Procurement Team'},

Thank you for your ${documentType} regarding logistics services. DEPOINTE is pleased to provide the following information about our capabilities.

🏢 COMPANY OVERVIEW
• Company: DEE DAVIS INC dba DEPOINTE
• MC Number: MC 1647572 | DOT Number: DOT 4250594
• Woman-Owned Small Business (WOSB) ✅
• President: Dieasha "Dee" Davis (Founder & Developer of FleetFlow™ Platform)

📋 YOUR INQUIRY
${solicitationId ? `Reference: ${solicitationId}\n` : ''}Document: "${fileName}"

We've reviewed your ${documentType} and identified the following areas of interest:
${extractedRequirements
  .slice(0, 5)
  .map((req, idx) => `• ${req}`)
  .join('\n')}

⚡ OUR CAPABILITIES
DEPOINTE offers specialized freight brokerage services with technology-driven dispatch coordination:
• Multi-state/national carrier network
• Real-time GPS tracking via FleetFlow™ platform
• 24/7 dispatch support
• Full DOT/FMCSA compliance
• Comprehensive insurance coverage

💡 WOSB ADVANTAGE
As a Woman-Owned Small Business, DEPOINTE supports diversity procurement goals while delivering enterprise-grade logistics solutions.

We'd be happy to discuss how DEPOINTE can support your logistics needs${deadline ? ` before ${deadline}` : ''}.

Best regards,

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dee Davis
WOSB, WBE, MBE Owner, DEE DAVIS INC

📞 P: 248.376.4550  |  🌐 W: www.deedavis.biz  |  📧 E: info@deedavis.biz
📍 A: 755 W. BIG BEAVER RD STE 2020, Troy, Michigan 48084

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"Intelligent Logistics Powered by FleetFlow™ Technology"`;
      } else {
        // DEFAULT RESPONSE - Medium detail for other types
        generatedResponse = `Dear ${contactName || 'Procurement Team'},

DEE DAVIS INC dba DEPOINTE is pleased to respond to your ${documentType} for logistics services.

🏢 COMPANY INFORMATION
• Company: DEE DAVIS INC dba DEPOINTE
• MC Number: MC 1647572 | DOT Number: DOT 4250594
• Woman-Owned Small Business (WOSB) ✅
• President: Dieasha "Dee" Davis

📋 YOUR REQUEST
${solicitationId ? `Reference: ${solicitationId}\n` : ''}Document: "${fileName}"

${extractedRequirements.length > 0 ? `📦 REQUIREMENTS IDENTIFIED:\n${extractedRequirements.map((req, idx) => `${idx + 1}. ${req}`).join('\n')}\n\n` : ''}✅ DEPOINTE CAPABILITIES
• Multi-state carrier network
• FleetFlow™ technology platform
• Real-time tracking and reporting
• DOT/FMCSA compliant operations
• Comprehensive insurance coverage
• 24/7 dispatch support

${submissionInstructions.length > 0 ? `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📮 SUBMISSION INFORMATION\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${submissionInstructions.join('\n')}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` : ''}
Best regards,

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dee Davis
WOSB, WBE, MBE Owner, DEE DAVIS INC

📞 P: 248.376.4550  |  🌐 W: www.deedavis.biz  |  📧 E: info@deedavis.biz
📍 A: 755 W. BIG BEAVER RD STE 2020, Troy, Michigan 48084

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
      }

      // Build analysis object with generated response
      analysis = {
        documentType,
        summary: documentSummary,
        keyRequirements: extractedRequirements.slice(0, 8),
        recommendedBid:
          '$2,500 - $3,500 (Subject to detailed route and equipment analysis)',
        competitiveAdvantage: [
          'Superior safety rating and clean DOT record',
          'Advanced tracking and communication technology',
          'Experienced drivers and specialized equipment',
          'Comprehensive insurance coverage',
          'Proven track record with similar shipments',
          '24/7 customer support and account management',
        ],
        riskFactors: [
          'Tight delivery timeline may require expedited service',
          'Weather conditions could impact delivery schedule',
          'Equipment availability during peak season',
          'Potential for additional fees or surcharges',
        ],
        confidence: 75,
        bidStrategy: {
          pricing: 'Competitive pricing strategy based on market analysis',
          timeline: 'Standard delivery timeline with contingency planning',
          approach:
            'Professional presentation emphasizing safety and reliability',
        },
        generatedResponse,
        // Extract requirements that need user input from comprehensive responses
        requirementsNeedingInput: comprehensiveResponses
          ? comprehensiveResponses.responses
              .filter((r) => r.complianceStatus === 'NEEDS_INPUT')
              .map((r) => ({
                requirementId: r.requirementId,
                requirementText: r.requirementText,
                needsInputReason: r.needsInputReason || 'User input needed',
                suggestedInputFields: r.suggestedInputFields || [],
                draftResponse: r.responseText,
              }))
          : undefined,
      };
    }

    // Return analysis with metadata for user review
    // User must review and accept before saving to database
    return NextResponse.json({
      success: true,
      analysis: {
        ...analysis,
        metadata: {
          solicitationId,
          contactName,
          contactEmail: emailMatch?.[1],
          contactPhone: phoneMatch?.[1],
          deadline,
          fileName,
          extractedRequirements,
          submissionInstructions,
        },
      },
    });
  } catch (error) {
    console.error('RFx Analysis API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze document. Please try again.',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'RFx Document Analysis API',
    supportedTypes: ['RFP', 'RFQ', 'RFI', 'RFB'],
    supportedFormats: ['PDF', 'DOC', 'DOCX', 'TXT'],
  });
}
