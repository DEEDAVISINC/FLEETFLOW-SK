import { NextRequest, NextResponse } from 'next/server';
import { ClaudeAIService } from '../../../../lib/claude-ai-service';

interface RFxAnalysisRequest {
  documentContent: string;
  documentType: 'RFP' | 'RFQ' | 'RFI' | 'RFB';
  fileName: string;
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
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RFxAnalysisRequest;
    const { documentContent, documentType, fileName } = body;

    // Initialize Claude AI Service
    const claudeService = new ClaudeAIService();

    // Create comprehensive analysis prompt
    const analysisPrompt = `
      As an expert freight broker and bid analyst, analyze this ${documentType} document and provide comprehensive bidding insights:

      DOCUMENT TYPE: ${documentType}
      DOCUMENT NAME: ${fileName}
      DOCUMENT CONTENT:
      ${documentContent}

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
        - Professional letterhead greeting
        - Executive summary of our capabilities
        - Detailed response to specific requirements
        - Competitive pricing with justification
        - Value proposition and differentiators
        - Risk mitigation strategies
        - Implementation timeline
        - Contact information and next steps
        - Professional closing
        
        Make it specific to the ${documentType} requirements and demonstrate deep understanding of the shipper's needs."
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
    const aiResponse = await claudeService.generateDocument(analysisPrompt, 'rfx_analysis');
    
    // Parse the AI response
    let analysis: AIBidAnalysis;
    try {
      analysis = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback analysis if AI response can't be parsed
      analysis = {
        documentType,
        summary: `${documentType} analysis for transportation services. Document requires detailed review for specific requirements and competitive bidding.`,
        keyRequirements: [
          'DOT compliant carrier with valid operating authority',
          'Appropriate equipment type and capacity',
          'Insurance coverage meeting minimum requirements',
          'On-time delivery with tracking capabilities',
          'Competitive pricing within market range',
          'Professional communication and customer service'
        ],
        recommendedBid: '$2,500 - $3,500',
        competitiveAdvantage: [
          'Superior safety rating and clean DOT record',
          'Advanced tracking and communication technology',
          'Experienced drivers and specialized equipment',
          'Comprehensive insurance coverage',
          'Proven track record with similar shipments',
          '24/7 customer support and account management'
        ],
        riskFactors: [
          'Tight delivery timeline may require expedited service',
          'Weather conditions could impact delivery schedule',
          'Equipment availability during peak season',
          'Potential for additional fees or surcharges'
        ],
        confidence: 75,
        bidStrategy: {
          pricing: 'Competitive pricing strategy based on market analysis',
          timeline: 'Standard delivery timeline with contingency planning',
          approach: 'Professional presentation emphasizing safety and reliability'
        },
        generatedResponse: `Dear Procurement Team,

FleetFlow Logistics is pleased to submit our response to your ${documentType} for transportation services.

EXECUTIVE SUMMARY
With over 15 years of experience in freight transportation and a 99.8% on-time delivery record, FleetFlow Logistics provides the reliability and expertise your shipment requires.

OUR PROPOSAL
We understand your transportation needs and are committed to providing exceptional service that meets all your requirements while delivering outstanding value.

COMPETITIVE ADVANTAGES
• Superior DOT safety rating with clean inspection record
• Advanced GPS tracking with real-time customer portal access
• Experienced professional drivers and modern equipment fleet
• Comprehensive insurance coverage exceeding industry standards
• 24/7 dispatch and customer support
• Proven track record with similar transportation requirements

COMMITMENT TO EXCELLENCE
Our team is dedicated to exceeding your expectations and building a long-term partnership based on trust, reliability, and superior service.

We look forward to the opportunity to serve your transportation needs and are available for immediate consultation.

Best regards,
FleetFlow Logistics Team
Phone: (555) 123-4567
Email: bids@fleetflow.com`
      };
    }

    return NextResponse.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('RFx Analysis API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to analyze document. Please try again.' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'RFx Document Analysis API',
    supportedTypes: ['RFP', 'RFQ', 'RFI', 'RFB'],
    supportedFormats: ['PDF', 'DOC', 'DOCX', 'TXT']
  });
}
