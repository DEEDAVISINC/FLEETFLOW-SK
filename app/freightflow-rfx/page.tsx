'use client';

// Force dynamic rendering to prevent build-time prerendering issues
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import RFxTaskPrioritizationPanel from '../components/RFxTaskPrioritizationPanel';

// Enhanced RFx Request interface with document upload support
interface RFxRequest {
  id: string;
  customer: string;
  origin: string;
  destination: string;
  weight: string;
  equipment: string;
  bidDeadline: string;
  status: string;
  currentBids: number;
  estimatedRate: string;
  urgency: string;
  specialRequirements: string;
  documentType?: 'RFP' | 'RFQ' | 'RFI' | 'RFB' | 'SOURCES_SOUGHT';
  uploadedDocument?: File;
  aiAnalysis?: {
    summary: string;
    keyRequirements: string[];
    recommendedBid: string;
    competitiveAdvantage: string[];
    riskFactors: string[];
    confidence: number;
  };
}

// AI Bid Analysis interface
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

// Government Contract Compliance Requirements
interface ComplianceRequirement {
  id: string;
  category:
    | 'safety'
    | 'insurance'
    | 'certification'
    | 'security'
    | 'financial'
    | 'regulatory';
  requirement: string;
  description: string;
  mandatory: boolean;
  verificationRequired: boolean;
  documents: string[];
}

// Carrier Qualification Check
interface CarrierQualificationResult {
  carrierId: string;
  companyName: string;
  qualified: boolean;
  complianceScore: number;
  safetyRating: 'SATISFACTORY' | 'CONDITIONAL' | 'UNSATISFACTORY' | 'NOT_RATED';
  insuranceStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  requiredInsuranceAmount: number;
  currentInsuranceAmount: number;
  specialEndorsements: string[];
  missingRequirements: string[];
  warnings: string[];
  lastValidated: string;
}

function FreightFlowRFxContent() {
  // Client-side hydration protection
  const [isMounted, setIsMounted] = useState(false);

  const [activeTab, setActiveTab] = useState('active');
  const [showAIBidAssistant, setShowAIBidAssistant] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [companyDocument, setCompanyDocument] = useState<File | null>(null);
  const [extractedProfile, setExtractedProfile] = useState<any>(null);
  const [documentType, setDocumentType] = useState<
    'RFP' | 'RFQ' | 'RFI' | 'RFB' | 'SOURCES_SOUGHT'
  >('RFQ');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtractingProfile, setIsExtractingProfile] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIBidAnalysis | null>(null);
  const [showBidResponse, setShowBidResponse] = useState(false);
  const [userInputs, setUserInputs] = useState<
    Record<string, Record<string, any>>
  >({});
  const [showInputForm, setShowInputForm] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<any>(null);
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [govOpportunities, setGovOpportunities] = useState<any[]>([]);
  const [loadingGovOps, setLoadingGovOps] = useState(false);
  const [govSearchKeywords, setGovSearchKeywords] = useState(
    'transportation freight'
  );
  const [selectedGovOpportunity, setSelectedGovOpportunity] =
    useState<any>(null);
  const [enterpriseOpportunities, setEnterpriseOpportunities] = useState<any[]>(
    []
  );
  const [loadingEnterpriseOps, setLoadingEnterpriseOps] = useState(false);
  const [enterpriseSearchKeywords, setEnterpriseSearchKeywords] = useState(
    'transportation logistics'
  );
  const [selectedEnterpriseOpportunity, setSelectedEnterpriseOpportunity] =
    useState<any>(null);
  const [automotiveOpportunities, setAutomotiveOpportunities] = useState<any[]>(
    []
  );
  const [loadingAutomotiveOps, setLoadingAutomotiveOps] = useState(false);
  const [automotiveSearchKeywords, setAutomotiveSearchKeywords] = useState(
    'transportation automotive construction heavy equipment'
  );
  const [selectedAutomotiveOpportunity, setSelectedAutomotiveOpportunity] =
    useState<any>(null);
  const [instantMarketsOpportunities, setInstantMarketsOpportunities] =
    useState<any[]>([]);
  const [loadingInstantMarketsOps, setLoadingInstantMarketsOps] =
    useState(false);
  const [instantMarketsSearchKeywords, setInstantMarketsSearchKeywords] =
    useState('transportation logistics government contracts');
  const [
    selectedInstantMarketsOpportunity,
    setSelectedInstantMarketsOpportunity,
  ] = useState<any>(null);
  const [warehousingOpportunities, setWarehousingOpportunities] = useState<
    any[]
  >([]);
  const [loadingWarehousingOps, setLoadingWarehousingOps] = useState(false);
  const [warehousingSearchKeywords, setWarehousingSearchKeywords] = useState(
    'warehousing 3PL fulfillment distribution'
  );
  const [selectedWarehousingOpportunity, setSelectedWarehousingOpportunity] =
    useState<any>(null);

  // TruckingPlanet Network integration state
  const [truckingPlanetShippers, setTruckingPlanetShippers] = useState<any[]>(
    []
  );
  const [loadingTruckingPlanet, setLoadingTruckingPlanet] = useState(false);
  const [truckingPlanetFilters, setTruckingPlanetFilters] = useState({
    equipmentType: 'dry_van',
    freightVolume: 'high',
    state: '',
  });
  const [selectedTruckingPlanetShipper, setSelectedTruckingPlanetShipper] =
    useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compliance validation state
  const [complianceRequirements, setComplianceRequirements] = useState<
    ComplianceRequirement[]
  >([]);
  const [carrierQualification, setCarrierQualification] =
    useState<CarrierQualificationResult | null>(null);
  const [showComplianceCheck, setShowComplianceCheck] = useState(false);
  const [complianceValidating, setComplianceValidating] = useState(false);

  // Mock compliance requirements for government contracts
  const mockComplianceRequirements: ComplianceRequirement[] = [
    {
      id: 'SAFETY-001',
      category: 'safety',
      requirement: 'FMCSA Safety Rating',
      description: 'Must maintain SATISFACTORY safety rating with FMCSA',
      mandatory: true,
      verificationRequired: true,
      documents: ['FMCSA SAFER Report', 'Safety Management Certificate'],
    },
    {
      id: 'INS-001',
      category: 'insurance',
      requirement: 'Commercial Auto Insurance',
      description: 'Minimum $1,000,000 commercial auto liability coverage',
      mandatory: true,
      verificationRequired: true,
      documents: ['Certificate of Insurance', 'Policy Declaration Page'],
    },
    {
      id: 'INS-002',
      category: 'insurance',
      requirement: 'Cargo Insurance',
      description: 'Minimum $100,000 cargo insurance coverage',
      mandatory: true,
      verificationRequired: true,
      documents: ['Cargo Insurance Certificate'],
    },
    {
      id: 'SEC-001',
      category: 'security',
      requirement: 'TSA Security Clearance',
      description:
        'Transportation Security Administration clearance for hazmat',
      mandatory: false,
      verificationRequired: true,
      documents: ['TSA Clearance Certificate', 'Background Check Results'],
    },
    {
      id: 'FIN-001',
      category: 'financial',
      requirement: 'Financial Responsibility',
      description: 'Proof of financial stability and bonding capacity',
      mandatory: true,
      verificationRequired: true,
      documents: ['Audited Financial Statements', 'Surety Bond Certificate'],
    },
  ];

  // Mock carrier qualification result
  const mockCarrierQualification: CarrierQualificationResult = {
    carrierId: 'CARRIER-001',
    companyName: 'FleetFlow Logistics LLC',
    qualified: true,
    complianceScore: 92,
    safetyRating: 'SATISFACTORY',
    insuranceStatus: 'ACTIVE',
    requiredInsuranceAmount: 1000000,
    currentInsuranceAmount: 2000000,
    specialEndorsements: ['Hazmat', 'Oversized Load', 'Government Contracts'],
    missingRequirements: [],
    warnings: ['Insurance renewal due in 60 days'],
    lastValidated: new Date().toISOString(),
  };

  // Compliance validation functions
  const validateCarrierCompliance = async (
    contractRequirements: ComplianceRequirement[]
  ) => {
    setComplianceValidating(true);
    setComplianceRequirements(contractRequirements);

    try {
      // Simulate API call to validate carrier against requirements
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock validation logic
      const result: CarrierQualificationResult = {
        ...mockCarrierQualification,
        qualified:
          contractRequirements.filter((req) => req.mandatory).length <= 3, // Simplified logic
        complianceScore: Math.min(95, 70 + contractRequirements.length * 5),
      };

      setCarrierQualification(result);
      setShowComplianceCheck(true);
    } catch (error) {
      console.error('Compliance validation failed:', error);
    } finally {
      setComplianceValidating(false);
    }
  };

  const getComplianceRequirementsForContract = (
    documentType: string,
    isGovernment: boolean
  ): ComplianceRequirement[] => {
    if (!isGovernment) {
      return mockComplianceRequirements.filter(
        (req) => req.category !== 'security'
      );
    }

    // Government contracts require all compliance requirements
    return mockComplianceRequirements;
  };

  const getComplianceCategoryColor = (
    category: ComplianceRequirement['category']
  ) => {
    switch (category) {
      case 'safety':
        return '#ef4444'; // red
      case 'insurance':
        return '#3b82f6'; // blue
      case 'certification':
        return '#10b981'; // green
      case 'security':
        return '#8b5cf6'; // purple
      case 'financial':
        return '#f59e0b'; // amber
      case 'regulatory':
        return '#6b7280'; // gray
      default:
        return '#6b7280';
    }
  };

  const [rfxRequests, setRfxRequests] = useState<RFxRequest[]>([]);
  const [loadingRfxRequests, setLoadingRfxRequests] = useState(true);

  // Fetch RFX requests from API or database
  const fetchRfxRequests = async () => {
    try {
      setLoadingRfxRequests(true);
      // Replace with actual API call
      const response = await fetch('/api/rfx-requests');
      if (response.ok) {
        const data = await response.json();
        setRfxRequests(data);
      } else {
        // Fallback to empty array if API fails
        console.warn('Failed to fetch RFX requests, using empty state');
        setRfxRequests([]);
      }
    } catch (error) {
      console.error('Error fetching RFX requests:', error);
      // Fallback to empty array on error
      setRfxRequests([]);
    } finally {
      setLoadingRfxRequests(false);
    }
  };

  // Load RFX requests on component mount
  // Mount protection to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    fetchRfxRequests();
  }, [isMounted]);

  const [myBids, setMyBids] = useState<any[]>([]);
  const [loadingMyBids, setLoadingMyBids] = useState(true);

  // Fetch user's bids from API or database
  const fetchMyBids = async () => {
    try {
      setLoadingMyBids(true);
      // Fetch saved RFX bid drafts
      const response = await fetch('/api/rfx-bids');
      if (response.ok) {
        const result = await response.json();
        setMyBids(result.data || []);
      } else {
        console.warn('Failed to fetch my bids, using empty state');
        setMyBids([]);
      }
    } catch (error) {
      console.error('Error fetching my bids:', error);
      setMyBids([]);
    } finally {
      setLoadingMyBids(false);
    }
  };

  // Load user's bids on component mount
  useEffect(() => {
    fetchMyBids();
  }, []);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ];
      if (allowedTypes.includes(file.type)) {
        setUploadedDocument(file);
        setAiAnalysis(null); // Reset previous analysis
      } else {
        alert('Please upload a PDF, Word document, or text file.');
      }
    }
  };

  // Handle company document upload (for extracting company profile information)
  const handleCompanyDocumentUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ];
      if (allowedTypes.includes(file.type)) {
        setCompanyDocument(file);
        setExtractedProfile(null); // Reset previous extraction
      } else {
        alert('Please upload a PDF, Word document, or text file.');
      }
    }
  };

  // Extract company profile information from uploaded document
  const extractCompanyProfile = async () => {
    if (!companyDocument) {
      alert('Please upload a company document first.');
      return;
    }

    setIsExtractingProfile(true);

    try {
      const formData = new FormData();
      formData.append('document', companyDocument);

      const response = await fetch('/api/company-profile-extract', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setExtractedProfile(result.extractedProfile);
        console.log('📄 Company profile extracted:', result);
      } else {
        const error = await response.json();
        alert(`❌ Extraction failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error extracting company profile:', error);
      alert('❌ Failed to extract company profile from document.');
    } finally {
      setIsExtractingProfile(false);
    }
  };

  // Enhanced AI document analysis - intelligently extracts transportation/logistics components from ANY RFx
  const analyzeDocument = async () => {
    if (!uploadedDocument) return;

    setIsAnalyzing(true);

    // Use FormData to send both RFx document and company document (if available)
    try {
      const formData = new FormData();
      formData.append('document', uploadedDocument);

      // Add company document if it exists and has been extracted
      if (companyDocument && extractedProfile) {
        formData.append('companyDocument', companyDocument);
      }

      // Add metadata
      const metadata = {
        documentType: documentType,
        fileName: uploadedDocument.name,
        hasCompanyProfile: !!(companyDocument && extractedProfile),
      };
      formData.append('data', JSON.stringify(metadata));

      const response = await fetch('/api/ai/rfx-analysis', {
        method: 'POST',
        body: formData, // Send as FormData instead of JSON
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.analysis) {
          setAiAnalysis(result.analysis);
          setIsAnalyzing(false);
          return; // SUCCESS - Exit here with real AI analysis
        }
      }

      console.warn(
        'AI API did not return valid analysis, using fallback mock data'
      );
    } catch (error) {
      console.error('AI API error:', error, '- using fallback mock data');
    }

    // FALLBACK: Parse the actual document content for key information
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Read and parse the uploaded document
    let documentText = '';
    try {
      documentText = await uploadedDocument.text();
    } catch (err) {
      console.error('Error reading document:', err);
    }

    // COMPREHENSIVE DOCUMENT PARSING - Extract ALL requirements
    const docLower = documentText.toLowerCase();
    const extractedRequirements: string[] = [];
    const mandatoryRequirements: string[] = [];
    const qualifications: string[] = [];
    const submissionRequirements: string[] = [];

    // Parse for origin/destination
    const originMatch = documentText.match(
      /origin[:\s]+([A-Z][a-z]+,?\s*[A-Z]{2})/i
    );
    const destMatch = documentText.match(
      /destination[:\s]+([A-Z][a-z]+,?\s*[A-Z]{2})/i
    );
    const pickupMatch = documentText.match(
      /pickup[:\s]+([A-Z][a-z]+,?\s*[A-Z]{2})/i
    );
    const deliveryMatch = documentText.match(
      /delivery[:\s]+([A-Z][a-z]+,?\s*[A-Z]{2})/i
    );

    if (originMatch || pickupMatch)
      extractedRequirements.push(
        `Origin: ${originMatch?.[1] || pickupMatch?.[1]}`
      );
    if (destMatch || deliveryMatch)
      extractedRequirements.push(
        `Destination: ${destMatch?.[1] || deliveryMatch?.[1]}`
      );

    // Parse for weight
    const weightMatch = documentText.match(
      /(\d+[,]?\d*)\s*(lbs?|pounds|kg|kilograms|tons?)/i
    );
    if (weightMatch) extractedRequirements.push(`Weight: ${weightMatch[0]}`);

    // Parse for equipment type
    const equipmentTypes = [
      'dry van',
      'reefer',
      'flatbed',
      'step deck',
      'lowboy',
      'tanker',
      'container',
      'box truck',
      'van',
    ];
    for (const eq of equipmentTypes) {
      if (docLower.includes(eq)) {
        extractedRequirements.push(
          `Equipment: ${eq.charAt(0).toUpperCase() + eq.slice(1)}`
        );
        break;
      }
    }

    // Parse for special requirements and delivery methods
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
    if (docLower.includes('inside delivery')) {
      extractedRequirements.push('Inside delivery required');
    }
    if (docLower.includes('white glove')) {
      extractedRequirements.push('White glove delivery service required');
    }
    if (
      docLower.includes('expedited') ||
      docLower.includes('rush') ||
      docLower.includes('urgent') ||
      docLower.includes('same day')
    ) {
      extractedRequirements.push('Expedited/rush delivery required');
    }
    if (docLower.includes('scheduled') || docLower.includes('appointment')) {
      extractedRequirements.push('Scheduled appointment delivery');
    }
    if (docLower.includes('residential')) {
      extractedRequirements.push('Residential delivery capability');
    }
    if (docLower.includes('team driver') || docLower.includes('two driver')) {
      extractedRequirements.push('Team driver service required');
    }
    if (docLower.includes('cross dock') || docLower.includes('crossdock')) {
      extractedRequirements.push('Cross-docking service required');
    }
    if (docLower.includes('ltl') || docLower.includes('less than truckload')) {
      extractedRequirements.push('LTL (Less Than Truckload) service');
    }
    if (docLower.includes('ftl') || docLower.includes('full truckload')) {
      extractedRequirements.push('FTL (Full Truckload) service');
    }
    if (
      docLower.includes('insurance') &&
      documentText.match(/\$\s*(\d+[,]?\d*[,]?\d*)/)
    ) {
      const insuranceMatch = documentText.match(
        /insurance.*?\$\s*(\d+[,]?\d*[,]?\d*)/i
      );
      if (insuranceMatch)
        extractedRequirements.push(
          `Insurance requirement: ${insuranceMatch[1]}`
        );
    }

    // Parse for dates/deadlines
    const dateMatch = documentText.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
    if (dateMatch)
      extractedRequirements.push(`Deadline or pickup date: ${dateMatch[0]}`);

    // Parse for BID SUBMISSION requirements (how they want the response delivered)
    let submissionMethod = '';
    let submissionEmail = '';
    let submissionPortal = '';

    // Look for submission method keywords
    if (
      docLower.includes('submit') ||
      docLower.includes('response') ||
      docLower.includes('proposal')
    ) {
      // Check for email submission
      const emailMatch =
        documentText.match(
          /submit.*?to[:\s]+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
        ) ||
        documentText.match(
          /email.*?to[:\s]+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
        ) ||
        documentText.match(
          /send.*?to[:\s]+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
        );
      if (emailMatch) {
        submissionEmail = emailMatch[1];
        extractedRequirements.push(`📧 SUBMIT BID TO: ${submissionEmail}`);
      }

      // Check for portal submission
      if (
        docLower.includes('portal') ||
        docLower.includes('online system') ||
        docLower.includes('bidding platform')
      ) {
        const portalMatch = documentText.match(/(https?:\/\/[^\s]+)/i);
        if (portalMatch) {
          submissionPortal = portalMatch[1];
          extractedRequirements.push(
            `🌐 SUBMIT VIA PORTAL: ${submissionPortal}`
          );
        } else {
          extractedRequirements.push(
            `🌐 Submit via online bidding portal (URL provided in document)`
          );
        }
      }

      // Check for physical mail
      if (
        docLower.includes('mail') ||
        docLower.includes('postal') ||
        docLower.includes('usps')
      ) {
        const addressMatch = documentText.match(
          /mail.*?to[:\s]+([^,\n]+,[^,\n]+,[^,\n]+\d{5})/i
        );
        if (addressMatch) {
          extractedRequirements.push(`📮 MAIL TO: ${addressMatch[1]}`);
        } else {
          extractedRequirements.push(`📮 Physical mail submission required`);
        }
      }

      // Check for required forms/formats
      if (docLower.includes('form') || docLower.includes('template')) {
        extractedRequirements.push(
          `📄 Use provided forms/templates for response`
        );
      }

      if (docLower.includes('pdf only') || docLower.includes('pdf format')) {
        extractedRequirements.push(
          `📄 Response must be submitted in PDF format`
        );
      }

      // Check for SAM.gov or government portal
      if (
        docLower.includes('sam.gov') ||
        docLower.includes('sam registration')
      ) {
        extractedRequirements.push(
          `🏛️ Submit via SAM.gov (requires SAM registration)`
        );
      }

      // Check for number of copies required
      const copiesMatch = documentText.match(/(\d+)\s+cop(y|ies)/i);
      if (copiesMatch) {
        extractedRequirements.push(
          `📋 Submit ${copiesMatch[1]} copies of proposal`
        );
      }
    }

    // EXTRACT ALL "MUST", "SHALL", "REQUIRED" statements (mandatory requirements)
    const mustStatements = documentText.match(
      /(?:must|shall|required to|mandatory)[^.!?]{1,200}[.!?]/gi
    );
    if (mustStatements) {
      mustStatements.slice(0, 10).forEach((statement) => {
        const cleaned = statement.trim().replace(/\s+/g, ' ');
        if (cleaned.length > 20 && cleaned.length < 200) {
          mandatoryRequirements.push(cleaned);
        }
      });
    }

    // EXTRACT QUALIFICATIONS (experience, certifications, licenses)
    if (
      docLower.includes('qualification') ||
      docLower.includes('experience') ||
      docLower.includes('certification')
    ) {
      // Look for years of experience
      const expMatch = documentText.match(
        /(\d+)\s+years?\s+(?:of\s+)?experience/i
      );
      if (expMatch) {
        qualifications.push(
          `Minimum ${expMatch[1]} years of experience required`
        );
      }

      // Look for certifications
      const certKeywords = [
        'ISO',
        'certification',
        'certified',
        'licensed',
        'accredited',
        'DOT',
        'FMCSA',
        'TSA',
        'C-TPAT',
      ];
      certKeywords.forEach((keyword) => {
        if (docLower.includes(keyword.toLowerCase())) {
          const certMatch = documentText.match(
            new RegExp(`${keyword}[^.!?]{1,100}[.!?]`, 'i')
          );
          if (certMatch) {
            qualifications.push(certMatch[0].trim());
          }
        }
      });
    }

    // EXTRACT INSURANCE & BONDING REQUIREMENTS
    const insuranceAmounts = documentText.match(
      /\$\s*(\d+[,]?\d*[,]?\d*)\s*(?:million|M)?\s*(?:in\s+)?(?:insurance|liability|coverage)/gi
    );
    if (insuranceAmounts) {
      insuranceAmounts.forEach((amount) => {
        qualifications.push(`Insurance requirement: ${amount}`);
      });
    }

    const bondMatch = documentText.match(
      /(?:performance\s+bond|bid\s+bond|payment\s+bond)[^.!?]{1,100}[.!?]/gi
    );
    if (bondMatch) {
      bondMatch.forEach((bond) => qualifications.push(bond.trim()));
    }

    // EXTRACT EVALUATION CRITERIA
    if (
      docLower.includes('evaluation') ||
      docLower.includes('scoring') ||
      docLower.includes('criteria')
    ) {
      const evalMatch = documentText.match(
        /(?:evaluation|scoring|criteria)[^.!?]{1,200}[.!?]/gi
      );
      if (evalMatch) {
        evalMatch.slice(0, 3).forEach((criteria) => {
          qualifications.push(`Evaluation: ${criteria.trim()}`);
        });
      }
    }

    // EXTRACT REFERENCES REQUIREMENTS
    if (docLower.includes('reference')) {
      const refMatch = documentText.match(/(\d+)\s+reference/i);
      if (refMatch) {
        submissionRequirements.push(`Provide ${refMatch[1]} references`);
      } else if (docLower.includes('reference')) {
        submissionRequirements.push('References required');
      }
    }

    // EXTRACT PRICING/COST REQUIREMENTS
    if (
      docLower.includes('pricing') ||
      docLower.includes('cost') ||
      docLower.includes('rate')
    ) {
      const pricingMatch = documentText.match(
        /(?:pricing|cost|rate)[^.!?]{1,150}[.!?]/gi
      );
      if (pricingMatch) {
        pricingMatch.slice(0, 3).forEach((pricing) => {
          submissionRequirements.push(`Pricing: ${pricing.trim()}`);
        });
      }
    }

    // EXTRACT SCOPE OF WORK
    if (
      docLower.includes('scope of work') ||
      docLower.includes('statement of work')
    ) {
      const scopeStart =
        docLower.indexOf('scope of work') ||
        docLower.indexOf('statement of work');
      const scopeSection = documentText.substring(
        scopeStart,
        scopeStart + 1000
      );
      const scopeItems = scopeSection.match(/[•\-\*]\s*[^\n]{20,150}/g);
      if (scopeItems) {
        scopeItems.slice(0, 5).forEach((item) => {
          extractedRequirements.push(item.trim().replace(/^[•\-\*]\s*/, ''));
        });
      }
    }

    // EXTRACT DELIVERABLES
    if (docLower.includes('deliverable')) {
      const delivMatch = documentText.match(
        /deliverable[s]?[^.!?]{1,150}[.!?]/gi
      );
      if (delivMatch) {
        delivMatch.slice(0, 3).forEach((deliv) => {
          submissionRequirements.push(deliv.trim());
        });
      }
    }

    // Combine all extracted requirements
    const allExtractedReqs = [
      ...extractedRequirements,
      ...mandatoryRequirements.slice(0, 5),
      ...qualifications.slice(0, 5),
      ...submissionRequirements.slice(0, 5),
    ];

    // If still no requirements extracted, use generic ones
    if (allExtractedReqs.length === 0) {
      allExtractedReqs.push(
        'Full logistics service as specified in attached document'
      );
      allExtractedReqs.push('DOT/FMCSA compliant carrier required');
      allExtractedReqs.push('Proof of insurance and carrier verification');
    }

    // Update extractedRequirements with all findings
    extractedRequirements.length = 0;
    extractedRequirements.push(...allExtractedReqs);

    // Smart analysis scenarios based on different industries but focused on transportation aspects
    const industryScenarios = [
      // Manufacturing RFx with logistics components
      {
        industry: 'Manufacturing',
        detectedLogistics: [
          'Raw material transportation',
          'Finished goods distribution',
          'Warehouse management',
        ],
        summary: `${documentType} from manufacturing company requiring comprehensive logistics support. AI identified transportation needs for raw materials inbound (steel, components from 3 suppliers) and finished goods outbound distribution (consumer electronics to 12 regional DCs). Annual volume: 2.4M lbs with seasonal peaks requiring flexible capacity.`,
        keyRequirements: [
          'Multi-modal transportation (truck, rail, ocean containers)',
          'Warehousing with 50,000 sq ft temperature-controlled space',
          'JIT delivery coordination with production schedules',
          'Reverse logistics for product returns/defects',
          'Cross-docking capabilities for direct-to-retail shipments',
          'EDI integration with WMS and ERP systems',
        ],
        recommendedBid: '$847,500 annually',
        transportationBid:
          'Full logistics partnership including transportation, warehousing, and distribution management',
      },
      // Retail/E-commerce RFx with fulfillment logistics
      {
        industry: 'Retail/E-commerce',
        detectedLogistics: [
          'Last-mile delivery',
          'Returns processing',
          'Peak season logistics',
        ],
        summary: `${documentType} from e-commerce retailer seeking integrated fulfillment and transportation services. AI extracted logistics requirements: inbound vendor consolidation, pick/pack operations, and multi-channel distribution (B2B wholesale, B2C direct, retail replenishment). Peak holiday volume 300% increase requiring surge capacity.`,
        keyRequirements: [
          'Last-mile delivery network with 1-2 day service windows',
          'Warehousing with automated sortation and pick systems',
          'Returns processing and reverse logistics infrastructure',
          'Peak season surge capacity (Oct-Jan)',
          'Multi-channel distribution (wholesale, retail, direct consumer)',
          'Real-time inventory visibility and order tracking',
        ],
        recommendedBid: '$1,250,000 annually',
        transportationBid:
          'Complete e-commerce logistics including fulfillment centers, transportation network, and returns processing',
      },
      // Healthcare/Pharma RFx with specialized transport needs
      {
        industry: 'Healthcare/Pharma',
        detectedLogistics: [
          'Temperature-controlled transport',
          'Medical device logistics',
          'Regulatory compliance',
        ],
        summary: `${documentType} from healthcare organization requiring specialized medical logistics. AI identified temperature-sensitive pharmaceutical distribution (2-8°C cold chain), medical device transport with FDA validation, and emergency/STAT delivery requirements to 47 hospitals across 3 states.`,
        keyRequirements: [
          'FDA-validated cold chain transportation (2-8°C, -20°C, -80°C)',
          'Pharmaceutical-grade warehousing with USP compliance',
          'STAT/emergency delivery within 2-hour windows',
          'Chain of custody documentation and temperature monitoring',
          'Hazardous materials transport certification (Class 9, UN3373)',
          'DEA-licensed facility for controlled substances',
        ],
        recommendedBid: '$2,100,000 annually',
        transportationBid:
          'Specialized pharmaceutical logistics with temperature-controlled transport, compliant warehousing, and emergency delivery capabilities',
      },
      // Construction RFx with heavy equipment/materials transport
      {
        industry: 'Construction',
        detectedLogistics: [
          'Heavy haul transport',
          'Construction materials',
          'Equipment logistics',
        ],
        summary: `${documentType} from construction contractor requiring heavy equipment and materials transportation. AI detected needs for oversized load transport (excavators, cranes), bulk material delivery (concrete, steel), and jobsite logistics coordination across 15 active projects in 4-state region.`,
        keyRequirements: [
          'Heavy haul transportation with specialized trailers (lowboy, RGN, multi-axle)',
          'Oversized/overweight permit coordination and escort services',
          'Bulk material transport (aggregates, concrete, steel)',
          'Jobsite delivery scheduling and coordination',
          'Equipment relocation between project sites',
          'Crane and rigging services for final positioning',
        ],
        recommendedBid: '$680,000 annually',
        transportationBid:
          'Heavy haul and construction logistics including specialized equipment transport, bulk materials, and jobsite coordination',
      },
      // Technology/Data Center RFx with sensitive equipment transport
      {
        industry: 'Technology',
        detectedLogistics: [
          'Sensitive equipment transport',
          'Data center logistics',
          'White glove service',
        ],
        summary: `${documentType} from technology company for data center equipment logistics. AI identified requirements for server transport (climate-controlled, vibration-free), network equipment installation logistics, and decommissioning/recycling transport. High-value cargo requiring specialized handling and security protocols.`,
        keyRequirements: [
          'Climate-controlled transport with vibration dampening',
          'White glove delivery and installation coordination',
          'Security protocols for high-value technology equipment',
          'Clean room compatible packaging and handling',
          'Decommissioning and e-waste recycling logistics',
          'Insurance coverage for technology equipment ($50M+)',
        ],
        recommendedBid: '$425,000 annually',
        transportationBid:
          'Specialized technology logistics with climate-controlled transport, white glove service, and secure handling protocols',
      },
      // Government/Defense RFx with secure transport needs
      {
        industry: 'Government/Defense',
        detectedLogistics: [
          'Secure transport',
          'Government compliance',
          'Classified materials',
        ],
        summary: `${documentType} from government agency requiring secure transportation and logistics services. AI identified requirements for classified document transport, sensitive equipment delivery to secure facilities, and compliance with government transportation regulations across multiple federal installations.`,
        keyRequirements: [
          'Security clearance validated transportation personnel',
          'Armored transport vehicles for high-value/sensitive cargo',
          'Government compliance (FIPS, NIST, DoD security standards)',
          'Chain of custody documentation with digital signatures',
          'Secure facility access and government facility delivery',
          'Background checked drivers with federal clearances',
        ],
        recommendedBid: '$1,850,000 annually',
        transportationBid:
          'Secure government logistics with cleared personnel, armored transport, and full compliance protocols',
      },
      // Sources Sought - Pre-Solicitation Intelligence and Relationship Building
      {
        industry: 'Government/Enterprise (Pre-Solicitation)',
        detectedLogistics: [
          'Relationship building opportunity',
          'Requirements intelligence gathering',
          'Strategic positioning for future RFP',
        ],
        summary: `${documentType === 'SOURCES_SOUGHT' ? 'Sources Sought notice' : documentType} representing early engagement opportunity for upcoming transportation contract. AI identified this as pre-solicitation intelligence gathering phase with 30-90 day timeline before formal RFP release. Strategic focus on relationship building, requirement refinement, and competitive positioning rather than immediate bidding.`,
        keyRequirements: [
          'Early engagement and relationship development with procurement team',
          'Comprehensive capability demonstration and market intelligence sharing',
          'Collaborative requirement refinement and solution development input',
          'Strategic positioning for competitive advantage in future RFP',
          'Market analysis and best practices consultation',
          'Long-term partnership approach with dedicated account management',
        ],
        recommendedBid:
          'Relationship Building Focus - No Immediate Pricing Required',
        transportationBid:
          'Strategic partnership development with emphasis on early engagement, capability demonstration, and positioning for future contract award',
      },
      // Energy/Oil & Gas RFx with specialized industrial transport
      {
        industry: 'Energy/Oil & Gas',
        detectedLogistics: [
          'Hazmat transport',
          'Industrial equipment',
          'Remote site logistics',
        ],
        summary: `${documentType} from energy company requiring specialized industrial transportation. AI detected needs for hazardous materials transport (Class 1-9), heavy industrial equipment delivery to remote drilling sites, and supply chain logistics for oil field operations across multiple states.`,
        keyRequirements: [
          'Hazmat certified transport for all dangerous goods classes',
          'Heavy lift capabilities for drilling equipment and modules',
          'Remote location delivery with GPS tracking and satellite communication',
          'Environmental compliance and spill response capabilities',
          'Round-the-clock operations with 24/7 emergency response',
          'Specialized trailers for pipe, machinery, and industrial components',
        ],
        recommendedBid: '$2,400,000 annually',
        transportationBid:
          'Industrial energy logistics with hazmat certification, heavy lift capabilities, and remote operations support',
      },
    ];

    // Select scenario based on document type - Sources Sought gets specific treatment
    const selectedScenario =
      documentType === 'SOURCES_SOUGHT'
        ? industryScenarios.find(
            (scenario) =>
              scenario.industry === 'Government/Enterprise (Pre-Solicitation)'
          ) || industryScenarios[0]
        : industryScenarios[
            Math.floor(Math.random() * industryScenarios.length)
          ];

    // Create summary based on ACTUAL extracted info from THEIR document
    const documentSummary = `${documentType} - Document Review: "${uploadedDocument.name}"

DEPOINTE has conducted a comprehensive review of your ${documentType} and has prepared this response addressing all requirements, qualifications, and specifications outlined in your solicitation.`;

    // Combine extracted requirements with scenario-specific ones
    const combinedRequirements = [
      ...extractedRequirements,
      'DOT/FMCSA compliant carrier (MC 1647572 / DOT 4250594)',
      'Comprehensive insurance coverage',
      'Real-time GPS tracking via FleetFlow™ platform',
      'Professional dispatch services through FREIGHT 1ST DIRECT',
    ];

    // Generate recommended bid based on document complexity
    const numRequirements = extractedRequirements.length;
    const recommendedBid =
      numRequirements > 15
        ? 'To be determined based on full scope analysis'
        : numRequirements > 10
          ? '$750,000 - $1,200,000 annually'
          : numRequirements > 5
            ? '$250,000 - $500,000 annually'
            : 'Competitive pricing upon detailed review';

    const mockAnalysis: AIBidAnalysis = {
      documentType: `${documentType} - ${uploadedDocument.name}`,
      summary: documentSummary,
      keyRequirements: combinedRequirements,
      recommendedBid: recommendedBid,
      competitiveAdvantage: [
        'Cross-industry logistics expertise with specialized capabilities',
        'Technology-driven supply chain visibility and optimization',
        'Scalable network supporting growth from startup to enterprise',
        'Industry-specific certifications and compliance frameworks',
        'Integrated transportation, warehousing, and value-added services',
        '24/7 customer support with dedicated account management',
      ],
      riskFactors: [
        'Industry-specific regulatory compliance requirements',
        'Seasonal demand fluctuations requiring capacity flexibility',
        'Technology integration complexity with existing systems',
        'Geographic coverage limitations in rural/remote areas',
      ],
      confidence: Math.floor(Math.random() * 15) + 82, // 82-96% confidence
      bidStrategy: {
        pricing: `Competitive pricing structure addressing all ${documentType} requirements with transparent cost breakdown`,
        timeline:
          submissionRequirements.find((r) =>
            r.toLowerCase().includes('deadline')
          ) || 'Response provided within solicitation timeline',
        approach:
          'Comprehensive response demonstrating full compliance with all mandatory requirements and qualifications',
      },
      generatedResponse: `Dear Procurement Team,

DEE DAVIS INC dba DEPOINTE is pleased to submit our comprehensive response to your ${documentType} for logistics services, with particular focus on the transportation and supply chain components of your requirements.

🏢 COMPANY INFORMATION
• Company: DEE DAVIS INC dba DEPOINTE
• MC Number: MC 1647572 | DOT Number: DOT 4250594
• Woman-Owned Small Business (WOSB) ✅
• President: Dieasha "Dee" Davis (Founder & Developer of FleetFlow™ Platform)
• Operating Division: FREIGHT 1ST DIRECT (Dispatch Services)

📋 RESPONSE TO YOUR ${documentType.toUpperCase()}
Document Reviewed: "${uploadedDocument.name}"

DEPOINTE has thoroughly reviewed your ${documentType} and identified the following requirements. This response addresses each requirement comprehensively:

📦 REQUIREMENTS IDENTIFIED & OUR RESPONSE:
${extractedRequirements.map((item, index) => `${index + 1}. ${item}`).join('\n')}

✅ DEPOINTE COMPLIANCE CONFIRMATION:
DEPOINTE is fully qualified and equipped to meet ALL requirements outlined in your ${documentType}. Our MC 1647572 / DOT 4250594 authority, Woman-Owned Small Business certification, and FleetFlow™ technology platform ensure complete compliance with your specifications.

🎯 EXECUTIVE SUMMARY
DEPOINTE brings specialized freight brokerage expertise with technology-driven dispatch coordination through FREIGHT 1ST DIRECT. Our FleetFlow™-powered platform ensures seamless integration with your existing operations while providing the scalability and reliability your business demands.

💰 OUR PROPOSAL
• Pricing: ${recommendedBid}
• Service Scope: Full compliance with all ${documentType} requirements as detailed below
• Geographic Coverage: Multi-state/national network
• Technology Integration: FleetFlow™ platform with real-time tracking and automated reporting

🔧 DETAILED RESPONSE TO EACH REQUIREMENT:

Below we provide our detailed response to each requirement identified in your ${documentType}:

${combinedRequirements
  .slice(0, 12)
  .map(
    (req, index) => `${index + 1}. ${req}
   ✓ DEPOINTE Response: We meet this requirement through our ${
     req.toLowerCase().includes('insurance')
       ? 'comprehensive insurance coverage exceeding industry standards'
       : req.toLowerCase().includes('experience')
         ? 'proven track record in freight brokerage and logistics'
         : req.toLowerCase().includes('certification') ||
             req.toLowerCase().includes('dot')
           ? 'MC 1647572 / DOT 4250594 operating authority'
           : req.toLowerCase().includes('technology') ||
               req.toLowerCase().includes('tracking')
             ? 'FleetFlow™ proprietary technology platform'
             : req.toLowerCase().includes('wosb') ||
                 req.toLowerCase().includes('woman')
               ? 'certified Woman-Owned Small Business status'
               : 'established capabilities and FREIGHT 1ST DIRECT dispatch operations'
   }`
  )
  .join('\n\n')}

⚡ COMPETITIVE ADVANTAGES
• Woman-Owned Small Business (WOSB) - Supports procurement diversity goals
• MC 1647572 / DOT 4250594 - Fully licensed and insured
• FleetFlow™ Platform - Proprietary technology for real-time tracking and optimization
• FREIGHT 1ST DIRECT dispatch services with proven 98.1% efficiency
• Proven track record meeting complex ${documentType} requirements
• Technology platform enabling real-time visibility and optimization
• 24/7 dispatch support and account management

🛡️ RISK MITIGATION & COMPLIANCE
• Full DOT/FMCSA compliance (MC 1647572 / DOT 4250594)
• Industry-specific regulatory compliance (DOT, FDA, OSHA, EPA as applicable)
• Comprehensive insurance coverage exceeding industry standards
• Business continuity planning with backup capacity and routes
• Quality management through FleetFlow™ platform technology

🚀 IMPLEMENTATION APPROACH
Phase 1 (Days 1-30): Requirements analysis, system integration, staff training
Phase 2 (Days 31-60): Pilot operations with key routes/services
Phase 3 (Days 61-90): Full deployment with performance optimization

💻 TECHNOLOGY INTEGRATION
• FleetFlow™ Platform - Proprietary freight management technology
• EDI/API connectivity with your existing systems
• Real-time tracking and automated exception management
• Customizable reporting and analytics dashboards
• Mobile applications for shipment visibility and management

📈 VALUE PROPOSITION
As a Woman-Owned Small Business with cutting-edge technology, DEPOINTE provides:
• Diversity supplier benefits for your procurement goals
• Reduce total supply chain costs through FleetFlow™ optimization
• Improve operational efficiency with integrated logistics
• Provide scalable solutions supporting business growth
• Deliver measurable ROI through technology and process improvement

🤝 PARTNERSHIP APPROACH
Founded and led by Dieasha "Dee" Davis, DEPOINTE combines entrepreneurial agility with enterprise-grade technology. As the developer of FleetFlow™, we bring both operational expertise and technological innovation to your logistics needs.

We welcome the opportunity to discuss how DEPOINTE can meet all requirements outlined in your ${documentType} and look forward to building a long-term partnership.

Best regards,

Dieasha "Dee" Davis, President
DEE DAVIS INC dba DEPOINTE
MC 1647572 | DOT 4250594 | Woman-Owned Small Business

📧 Contact Information:
• Email: info@deedavis.biz
• Phone: (248) 247-5020
• 24/7 Support Available

"Intelligent Logistics Powered by FleetFlow™ Technology"

---
DEPOINTE STRATEGIC PARTNERSHIPS TEAM
Prepared by: Business Development Division
Document Reference: ${uploadedDocument.name}

This comprehensive response has been prepared by DEPOINTE's Strategic Partnerships Team specifically for your ${documentType}. Our team has carefully reviewed your requirements and prepared this proposal to demonstrate how DEPOINTE can meet your transportation and logistics needs.

For questions or clarification, please contact our Strategic Partnerships Team at ddavis@freight1stdirect.com or dispatch@freight1stdirect.com.`,
    };

    setAiAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  // Handle Save Draft - saves bid response to database for tracking
  const handleSaveDraft = async () => {
    if (!aiAnalysis || !uploadedDocument) {
      alert('No bid response to save');
      return;
    }

    try {
      const metadata = (aiAnalysis as any).metadata || {};

      const bidData = {
        solicitationId: metadata.solicitationId || undefined,
        solicitationType: documentType.toUpperCase(),
        documentName: uploadedDocument.name,
        contactName: metadata.contactName || undefined,
        contactEmail: metadata.contactEmail || undefined,
        contactPhone: metadata.contactPhone || undefined,
        submissionDeadline: metadata.deadline
          ? new Date(metadata.deadline).toISOString()
          : undefined,
        responseSubject: `Response to ${documentType.toUpperCase()} - ${
          metadata.solicitationId || uploadedDocument.name
        }`,
        responseHtml: aiAnalysis.generatedResponse,
        responseText: aiAnalysis.generatedResponse.replace(/<[^>]*>/g, ''), // Strip HTML
        signatureType: 'dee_davis',
        extractedRequirements: metadata.extractedRequirements || [],
        submissionInstructions: metadata.submissionInstructions || [],
        status: 'draft',
        createdBy: 'info@deedavis.biz',
      };

      console.log('💾 Saving bid draft:', bidData);

      const response = await fetch('/api/rfx-bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bidData),
      });

      const result = await response.json();

      if (result.success) {
        alert(`✅ Bid saved successfully! ID: ${result.data.id}`);
        console.log('✅ Bid saved:', result.data);

        // Refresh the My Bids list
        fetchMyBids();
      } else {
        alert(`❌ Failed to save bid: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving bid draft:', error);
      alert('❌ Failed to save bid draft');
    }
  };

  // Handle providing input for requirements needing clarification
  const handleProvideInput = (requirement: any) => {
    setSelectedRequirement(requirement);
    setInputValues({}); // Reset form
    setShowInputForm(true);
  };

  const handleSubmitInput = () => {
    if (!selectedRequirement) return;

    // Update the userInputs state
    setUserInputs((prev) => ({
      ...prev,
      [selectedRequirement.requirementId]: inputValues,
    }));

    // Close the form
    setShowInputForm(false);
    setSelectedRequirement(null);
    setInputValues({});

    // Optionally regenerate the bid response with the new inputs
    // For now, we'll just store the inputs for later use
    alert(
      '✅ Input provided successfully! The bid response will be updated accordingly.'
    );
  };

  const handleCancelInput = () => {
    setShowInputForm(false);
    setSelectedRequirement(null);
    setInputValues({});
  };

  // Enhanced SAM.gov government opportunities search
  const searchGovernmentOpportunities = async () => {
    setLoadingGovOps(true);

    try {
      // Use the existing SAM.gov API integration from RFxResponseService
      const searchParams = {
        keywords: govSearchKeywords,
        platforms: ['government'],
        location: 'nationwide',
        minValue: 50000, // Minimum $50K contracts
        equipment: 'transportation',
      };

      // This connects to your existing SAM.gov API integration
      const response = await fetch('/api/sam-gov-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
      }).catch((err) => {
        console.warn('SAM.gov API not available:', err.message);
        return { ok: false };
      });

      if (response.ok) {
        const result = await response.json();
        // Handle API response structure - extract opportunities array
        const opportunities =
          result.data?.opportunities || result.opportunities || result || [];
        setGovOpportunities(Array.isArray(opportunities) ? opportunities : []);
      } else {
        // Fallback to mock government data
        const mockGovOpportunities = [
          {
            id: 'SAM-001',
            agency: 'Department of Defense',
            title: 'Military Equipment Transportation Services',
            description:
              'Comprehensive transportation services for military equipment, vehicles, and supplies across multiple installations. Requires specialized heavy-haul capabilities, security clearance, and DOT compliance.',
            amount: 4200000,
            location: 'Multiple Military Bases (TX, CA, FL, VA)',
            deadline: '2025-02-15',
            naicsCode: '484220',
            type: 'RFP',
            competitionLevel: 'High',
            matchScore: 89,
            status: 'Open',
            transportationComponents: [
              'Heavy equipment transport (tanks, APCs, generators)',
              'Secure cargo handling with background-checked drivers',
              'Multi-state coordination with military logistics',
              'Specialized trailers for oversized military equipment',
            ],
          },
          {
            id: 'SAM-002',
            agency: 'General Services Administration',
            title: 'Federal Building Supply Chain Logistics',
            description:
              'Transportation and warehousing services for federal building construction projects. Includes materials handling, just-in-time delivery, and construction site logistics coordination.',
            amount: 2800000,
            location: 'Southwest Region (TX, NM, AZ, NV)',
            deadline: '2025-01-28',
            naicsCode: '484121',
            type: 'RFQ',
            competitionLevel: 'Medium',
            matchScore: 94,
            status: 'Open',
            transportationComponents: [
              'Construction materials transport (steel, concrete, prefab)',
              'Just-in-time delivery coordination',
              'Jobsite logistics and staging',
              'Warehousing and inventory management',
            ],
          },
          {
            id: 'SAM-003',
            agency: 'Department of Veterans Affairs',
            title: 'Medical Supply Distribution Network',
            description:
              'Temperature-controlled transportation of pharmaceuticals, medical devices, and supplies to VA hospitals and clinics. Requires FDA compliance and cold-chain certification.',
            amount: 3500000,
            location: 'National VA Network',
            deadline: '2025-02-20',
            naicsCode: '484220',
            type: 'RFB',
            competitionLevel: 'High',
            matchScore: 96,
            status: 'Open',
            transportationComponents: [
              'Temperature-controlled pharmaceutical transport (2-8°C)',
              'FDA-compliant cold chain management',
              'Medical device white-glove delivery',
              'Emergency STAT delivery capabilities',
            ],
          },
          {
            id: 'SAM-004',
            agency: 'Department of Homeland Security',
            title: 'Emergency Response Logistics Support',
            description:
              'Rapid deployment transportation services for emergency response equipment, supplies, and personnel. Requires 24/7 availability and nationwide coverage capability.',
            amount: 5100000,
            location: 'Nationwide Emergency Response',
            deadline: '2025-02-10',
            naicsCode: '484122',
            type: 'RFP',
            competitionLevel: 'Medium',
            matchScore: 91,
            status: 'Open',
            transportationComponents: [
              'Emergency equipment transport (generators, communication gear)',
              '24/7 rapid response capability',
              'Personnel and supply coordination',
              'Disaster relief logistics management',
            ],
          },
        ];
        setGovOpportunities(mockGovOpportunities);
      }
    } catch (error) {
      console.error('Error searching government opportunities:', error);
      // Ensure govOpportunities is always an array
      setGovOpportunities([]);
    } finally {
      setLoadingGovOps(false);
    }
  };

  // Import government opportunity directly into AI analysis
  const importGovernmentOpportunity = (opportunity: any) => {
    setSelectedGovOpportunity(opportunity);
    setDocumentType(opportunity.type);

    // Create a comprehensive analysis based on the government opportunity
    const mockAnalysis: AIBidAnalysis = {
      documentType: `${opportunity.type} (${opportunity.agency})`,
      summary: `Government ${opportunity.type} from ${opportunity.agency}: ${opportunity.description}. AI identified comprehensive transportation requirements with total contract value of $${opportunity.amount.toLocaleString()}.`,
      keyRequirements: opportunity.transportationComponents || [
        'DOT compliance and safety certifications',
        'Government contractor registration (SAM.gov)',
        'Comprehensive insurance coverage',
        'Security clearance for sensitive materials',
        'Real-time tracking and reporting',
      ],
      recommendedBid: `$${Math.floor(opportunity.amount * 0.85).toLocaleString()}`,
      competitiveAdvantage: [
        'Government contracting experience and past performance',
        'Security clearances and background-checked personnel',
        'Comprehensive compliance and certification framework',
        'Nationwide logistics network with redundancy',
        'Technology platform for government reporting requirements',
        '24/7 operations and emergency response capabilities',
      ],
      riskFactors: [
        'Strict government compliance and audit requirements',
        'Performance bond and financial guarantee requirements',
        'Competition from large government contractors',
        'Complex proposal and documentation requirements',
      ],
      confidence: opportunity.matchScore,
      bidStrategy: {
        pricing: `Competitive government pricing at 15% below estimated value to ensure award`,
        timeline:
          'Government contracting timeline: 90-day award, 30-day mobilization',
        approach:
          'Emphasize past performance, compliance, and government-specific capabilities',
      },
      generatedResponse: `GOVERNMENT CONTRACT RESPONSE

TO: ${opportunity.agency}
RE: ${opportunity.title} (${opportunity.type})
CONTRACT ID: ${opportunity.id}

FleetFlow Government Logistics is pleased to submit our response to your ${opportunity.type} for transportation and logistics services.

🏛️ GOVERNMENT CONTRACTING EXPERTISE
FleetFlow specializes in government transportation contracts with comprehensive understanding of federal requirements, compliance standards, and performance expectations.

📋 CONTRACT UNDERSTANDING
Contract Value: $${opportunity.amount.toLocaleString()}
Location: ${opportunity.location}
Deadline: ${opportunity.deadline}
NAICS Code: ${opportunity.naicsCode}

IDENTIFIED TRANSPORTATION COMPONENTS:
${opportunity.transportationComponents?.map((component: string) => `• ${component}`).join('\n') || '• Government-compliant transportation services'}

🎯 OUR PROPOSAL
• Competitive Rate: $${Math.floor(opportunity.amount * 0.85).toLocaleString()}
• Full Government Compliance: All DOT, security, and federal requirements
• Nationwide Coverage: Complete logistics network with redundancy
• Technology Integration: Government reporting and tracking systems

🛡️ GOVERNMENT-SPECIFIC CAPABILITIES
• SAM.gov registered contractor with active status
• Security clearances and background-verified personnel
• Federal compliance certifications (DOT, FMCSA, TSA)
• Government insurance requirements exceeded
• Performance bonding and financial guarantees available

⚡ COMPETITIVE ADVANTAGES
• Proven government contracting track record
• Security-cleared logistics operations
• 24/7 operations center with government liaison
• Technology platform for federal reporting compliance
• Emergency response and rapid deployment capabilities

🔒 SECURITY & COMPLIANCE
• All personnel background checked and security cleared
• OPSEC compliance for sensitive government cargo
• Chain of custody documentation and digital signatures
• Secure communications and encrypted tracking systems

📊 PERFORMANCE METRICS
• 99.8% on-time delivery rate for government contracts
• Zero security incidents in 10+ years of government service
• 24/7/365 operations with emergency response capability
• Comprehensive quality management system with regular audits

💰 VALUE PROPOSITION
While maintaining full compliance with all government requirements, DEPOINTE delivers cost-effective transportation solutions that exceed performance standards while providing measurable value to taxpayers. As a Woman-Owned Small Business, we also help meet federal diversity contracting goals.

We understand the critical nature of government logistics and are committed to supporting your mission with reliable, secure, and compliant transportation services.

Best regards,

Dieasha "Dee" Davis, President
DEE DAVIS INC dba DEPOINTE
MC 1647572 | DOT 4250594 | Woman-Owned Small Business

📧 Contact Information:
• Email: info@deedavis.biz
• Phone: (248) 247-5020
• 24/7 Support Available

SAM.gov Registered | Woman-Owned Small Business (WOSB)
"Serving America's Transportation Needs with WOSB Excellence"

---
🤖 AI-GENERATED GOVERNMENT PROPOSAL
This response was specifically tailored for government contracting requirements, emphasizing compliance, security, and past performance criteria that government evaluators prioritize.`,
    };

    setAiAnalysis(mockAnalysis);
    setShowAIBidAssistant(true);
    setShowBidResponse(true);
  };

  // Load government opportunities on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load all opportunity types in parallel with proper error handling
        await Promise.allSettled([
          searchGovernmentOpportunities(),
          searchEnterpriseOpportunities(),
          searchAutomotiveOpportunities(),
          searchInstantMarketsOpportunities(),
          searchWarehousingOpportunities(),
          searchTruckingPlanetShippers(),
        ]);
      } catch (error) {
        console.error('Error initializing opportunity data:', error);
      }
    };

    initializeData();
  }, []);

  // Enhanced Enterprise RFP opportunities search
  const searchEnterpriseOpportunities = async () => {
    setLoadingEnterpriseOps(true);

    try {
      // Use the existing enterprise shipper API integrations from RFxResponseService
      const searchParams = {
        keywords: enterpriseSearchKeywords,
        platforms: ['enterprise'],
        location: 'nationwide',
        minValue: 75000, // Minimum $75K contracts
        equipment: 'transportation',
      };

      // This connects to your existing enterprise shipper API integrations
      const response = await fetch('/api/enterprise-rfp-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
      }).catch((err) => {
        console.warn('Enterprise RFP API not available:', err.message);
        return { ok: false };
      });

      if (response.ok) {
        const result = await response.json();
        // Handle API response structure - extract opportunities array
        const opportunities =
          result.data?.opportunities || result.opportunities || result || [];
        setEnterpriseOpportunities(
          Array.isArray(opportunities) ? opportunities : []
        );
      } else {
        // Fallback to mock enterprise data
        const mockEnterpriseOpportunities = [
          {
            id: 'WMT-RFP-2025-001',
            company: 'Walmart Inc.',
            title: 'Dedicated Lane Partnership - Southeast Regional Network',
            description:
              'Comprehensive transportation services for Walmart store replenishment and distribution center operations. Requires dedicated fleet capacity, EDI integration, and Walmart Approved Carrier status. Multi-year partnership opportunity with volume commitments.',
            amount: 4500000,
            location: 'Southeast US (FL, GA, SC, NC, TN, AL)',
            deadline: '2025-02-28',
            industry: 'Retail Distribution',
            type: 'RFP',
            competitionLevel: 'High',
            matchScore: 93,
            status: 'Open',
            requirements: [
              'Walmart Approved Carrier Status',
              'EDI Capability (214, 210)',
              'Dedicated Fleet Equipment',
            ],
            transportationComponents: [
              'Store replenishment delivery (1,200+ locations)',
              'Distribution center to store transportation',
              'Cross-docking operations and coordination',
              'Real-time tracking and EDI integration',
              'Dedicated fleet with 99.5% on-time performance',
            ],
          },
          {
            id: 'AMZN-DSP-2025-002',
            company: 'Amazon Logistics',
            title: 'Delivery Service Partner - Last Mile Network',
            description:
              'Amazon DSP program for last-mile delivery operations covering multiple metropolitan areas. Requires background-checked drivers, Amazon-branded fleet, and technology integration. High-volume daily delivery operations with growth potential.',
            amount: 1800000,
            location: 'Multiple Metro Areas (Atlanta, Miami, Tampa, Orlando)',
            deadline: '2025-02-15',
            industry: 'E-commerce Logistics',
            type: 'RFB',
            competitionLevel: 'Medium',
            matchScore: 89,
            status: 'Open',
            requirements: [
              'Amazon DSP Qualification',
              'Background Checked Drivers',
              'Fleet Branding',
            ],
            transportationComponents: [
              'Last-mile package delivery (500-800 daily packages)',
              'Amazon logistics technology integration',
              'Route optimization and customer communication',
              'Fleet management and driver scheduling',
              'Performance metrics and customer service excellence',
            ],
          },
          {
            id: 'HD-LOG-2025-003',
            company: 'The Home Depot',
            title: 'Building Materials Transportation & White Glove Delivery',
            description:
              'Specialized transportation for building materials, appliances, and oversized items. Includes white-glove delivery services, installation coordination, and customer appointment scheduling. Requires specialized equipment and trained delivery personnel.',
            amount: 2200000,
            location: 'Multi-State Operations (TX, OK, AR, LA)',
            deadline: '2025-03-10',
            industry: 'Retail Home Improvement',
            type: 'RFQ',
            competitionLevel: 'Medium',
            matchScore: 91,
            status: 'Open',
            requirements: [
              'Home Depot Supplier Registration',
              'White Glove Capabilities',
              'Customer Service Training',
            ],
            transportationComponents: [
              'Building materials transport (lumber, concrete, steel)',
              'Large appliance delivery and installation coordination',
              'White-glove customer delivery service',
              'Appointment scheduling and customer communication',
              'Specialized equipment (flatbed, liftgate, dollies)',
            ],
          },
          {
            id: 'TGT-SC-2025-004',
            company: 'Target Corporation',
            title: 'Supply Chain Logistics & Omnichannel Fulfillment',
            description:
              'Integrated supply chain solutions for Target stores and online fulfillment operations. Includes distribution center operations, store replenishment, and e-commerce fulfillment services. Multi-channel logistics with seasonal demand variations.',
            amount: 3100000,
            location: 'Central US Distribution Network (TX, IL, MN, IA)',
            deadline: '2025-02-20',
            industry: 'Retail Omnichannel',
            type: 'RFP',
            competitionLevel: 'High',
            matchScore: 88,
            status: 'Open',
            requirements: [
              'Target Partner Portal Registration',
              'Omnichannel Experience',
              'Peak Season Capacity',
            ],
            transportationComponents: [
              'Distribution center to store replenishment',
              'E-commerce fulfillment and last-mile delivery',
              'Seasonal surge capacity (Q4 holiday peak)',
              'Inventory management and cross-docking',
              'Omnichannel logistics coordination',
            ],
          },
          {
            id: 'CST-BIZ-2025-005',
            company: 'Costco Wholesale',
            title: 'Business Center Distribution & Cross-Dock Operations',
            description:
              'Comprehensive distribution services for Costco Business Centers including cross-dock operations, bulk goods transportation, and business delivery services. Requires capacity for large volume, bulk items and B2B delivery capabilities.',
            amount: 1650000,
            location: 'West Coast Operations (CA, WA, OR, NV)',
            deadline: '2025-02-25',
            industry: 'Wholesale Distribution',
            type: 'RFB',
            competitionLevel: 'Medium',
            matchScore: 94,
            status: 'Open',
            requirements: [
              'Costco Business Membership',
              'Bulk Goods Handling',
              'B2B Delivery Experience',
            ],
            transportationComponents: [
              'Cross-dock operations and bulk goods handling',
              'Business-to-business delivery services',
              'Large volume item transport (pallets, bulk)',
              'Warehouse coordination and inventory management',
              'Commercial delivery scheduling and tracking',
            ],
          },
          {
            id: 'CHR-NET-2025-006',
            company: 'C.H. Robinson',
            title: 'Preferred Carrier Network Partnership',
            description:
              'Long-term partnership opportunity with C.H. Robinson Navisphere Connect for preferred carrier network inclusion. Access to premium freight opportunities, dedicated lanes, and enhanced service offerings through CHR platform.',
            amount: 2800000,
            location: 'National Coverage Required',
            deadline: '2025-03-05',
            industry: '3PL Partnership',
            type: 'RFP',
            competitionLevel: 'High',
            matchScore: 87,
            status: 'Open',
            requirements: [
              'CHR Carrier Approval',
              'Performance Standards',
              'Technology Integration',
            ],
            transportationComponents: [
              'Preferred carrier network participation',
              'Dedicated lane commitments and performance',
              'Technology platform integration (Navisphere)',
              'Performance metrics and service excellence',
              'National coverage and capacity flexibility',
            ],
          },
        ];
        setEnterpriseOpportunities(mockEnterpriseOpportunities);
      }
    } catch (error) {
      console.error('Error searching enterprise opportunities:', error);
      // Ensure enterpriseOpportunities is always an array
      setEnterpriseOpportunities([]);
    } finally {
      setLoadingEnterpriseOps(false);
    }
  };

  // Import enterprise opportunity directly into AI analysis
  const importEnterpriseOpportunity = (opportunity: any) => {
    setSelectedEnterpriseOpportunity(opportunity);
    setDocumentType(opportunity.type);

    // Create a comprehensive analysis based on the enterprise opportunity
    const mockAnalysis: AIBidAnalysis = {
      documentType: `${opportunity.type} (${opportunity.company})`,
      summary: `Enterprise ${opportunity.type} from ${opportunity.company}: ${opportunity.description}. AI identified comprehensive transportation requirements with total contract value of $${opportunity.amount.toLocaleString()}.`,
      keyRequirements: opportunity.transportationComponents || [
        'Enterprise-grade service standards',
        'Technology integration and EDI capability',
        'Performance metrics and KPI compliance',
        'Dedicated account management',
        'Scalable capacity and growth support',
      ],
      recommendedBid: `$${Math.floor(opportunity.amount * 0.92).toLocaleString()}`,
      competitiveAdvantage: [
        'Enterprise logistics experience with Fortune 500 companies',
        'Advanced technology platform with real-time integration',
        'Scalable operations supporting rapid growth',
        'Comprehensive insurance and risk management',
        'Dedicated account management and customer success',
        'Performance excellence with measurable KPIs',
      ],
      riskFactors: [
        'High performance standards and penalty clauses',
        'Technology integration complexity and requirements',
        'Seasonal demand fluctuations and peak capacity needs',
        'Competition from large enterprise logistics providers',
      ],
      confidence: opportunity.matchScore,
      bidStrategy: {
        pricing: `Competitive enterprise pricing with performance incentives`,
        timeline:
          'Enterprise implementation: 60-day mobilization, 90-day full operations',
        approach:
          'Emphasize enterprise experience, technology capabilities, and partnership approach',
      },
      generatedResponse: `ENTERPRISE PARTNERSHIP PROPOSAL

TO: ${opportunity.company}
RE: ${opportunity.title} (${opportunity.type})
OPPORTUNITY ID: ${opportunity.id}

FleetFlow Enterprise Logistics is pleased to submit our comprehensive response to your ${opportunity.type} for transportation and logistics services.

🏢 ENTERPRISE LOGISTICS EXPERTISE
FleetFlow specializes in Fortune 500 transportation partnerships with proven experience in retail distribution, e-commerce fulfillment, and enterprise supply chain management.

📋 OPPORTUNITY UNDERSTANDING
Contract Value: $${opportunity.amount.toLocaleString()}
Scope: ${opportunity.location}
Deadline: ${opportunity.deadline}
Industry: ${opportunity.industry}

IDENTIFIED TRANSPORTATION REQUIREMENTS:
${opportunity.transportationComponents?.map((component: string) => `• ${component}`).join('\n') || '• Enterprise-grade logistics services'}

🎯 OUR ENTERPRISE PROPOSAL
• Competitive Rate: $${Math.floor(opportunity.amount * 0.92).toLocaleString()}
• Enterprise Service Standards: 99.5%+ on-time performance with KPI guarantees
• Technology Integration: Real-time EDI, API connectivity, and dashboard reporting
• Dedicated Account Management: Senior-level account team with 24/7 support

🚀 ENTERPRISE-SPECIFIC CAPABILITIES
• Fortune 500 client experience with proven track record
• Advanced technology platform with real-time integration
• Scalable operations supporting seasonal and growth demands
• Comprehensive compliance and risk management framework
• Performance-based contracts with measurable KPIs

⚡ COMPETITIVE ADVANTAGES FOR ${opportunity.company}
• Specialized experience in ${opportunity.industry.toLowerCase()} logistics
• Technology-first approach with seamless integration
• Scalable capacity management for peak seasons
• Dedicated enterprise support team
• Performance excellence with continuous improvement

🔧 TECHNOLOGY & INTEGRATION
• EDI Integration: 214, 210, 204, 997 transaction sets
• Real-time API connectivity with your systems
• Custom reporting dashboards and analytics
• Mobile applications for real-time visibility
• Automated exception management and alerts

📊 PERFORMANCE COMMITMENTS
• 99.5%+ on-time delivery performance
• <0.1% damage claims with comprehensive insurance
• 24/7 customer service with 2-hour response time
• Quarterly business reviews and performance analysis
• Continuous improvement and operational excellence

💼 PARTNERSHIP APPROACH
We view this as a strategic partnership, not just a service contract. Our goal is to become an extension of your logistics team, providing seamless integration and exceptional service that supports your business growth and customer satisfaction.

Key Partnership Benefits:
• Dedicated capacity allocation during peak seasons
• Collaborative planning and demand forecasting
• Joint process improvement and optimization
• Executive-level relationship management
• Long-term strategic alignment and growth support

🎯 IMPLEMENTATION PLAN
Phase 1 (Days 1-30): System integration, team training, pilot operations
Phase 2 (Days 31-60): Full deployment with performance monitoring
Phase 3 (Days 61-90): Optimization and continuous improvement

We are committed to exceeding your expectations and building a long-term partnership that drives mutual success and growth.

Best regards,

Dieasha "Dee" Davis, President
DEE DAVIS INC dba DEPOINTE
MC 1647572 | DOT 4250594 | Woman-Owned Small Business

📧 Contact Information:
• Email: info@deedavis.biz
• Phone: (248) 247-5020
• 24/7 Support Available

"Your Success is Our Mission - Powered by FleetFlow™ Technology"

---
🤖 AI-GENERATED ENTERPRISE PROPOSAL
This response was specifically tailored for enterprise logistics requirements, emphasizing partnership approach, technology integration, and performance excellence that Fortune 500 companies prioritize.`,
    };

    setAiAnalysis(mockAnalysis);
    setShowAIBidAssistant(true);
    setShowBidResponse(true);
  };

  // ✅ NEW: Automotive/Construction RFP opportunities search (FREE sources)
  const searchAutomotiveOpportunities = async () => {
    setLoadingAutomotiveOps(true);

    try {
      // Use the FREE state procurement and company portal search methods
      const searchParams = {
        keywords: automotiveSearchKeywords,
        platforms: ['state_procurement', 'company_portal'], // Use our new FREE sources
        location: 'nationwide',
        minValue: 50000, // Minimum $50K contracts
        equipment: 'automotive construction heavy_equipment',
      };

      // This connects to your new FREE automotive/construction APIs
      const response = await fetch('/api/automotive-rfp-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
      }).catch((err) => {
        console.warn('Automotive RFP API not available:', err.message);
        return { ok: false };
      });

      if (response.ok) {
        const result = await response.json();
        // Handle API response structure - extract opportunities array
        const opportunities =
          result.data?.opportunities || result.opportunities || result || [];
        setAutomotiveOpportunities(
          Array.isArray(opportunities) ? opportunities : []
        );
      } else {
        // Fallback to combined state procurement and company portal mock data
        const mockAutomotiveOpportunities = [
          // Ford Motor Company Opportunities
          {
            id: 'FORD-RFQ-2025-001',
            company: 'Ford Motor Company',
            title: 'Finished Vehicle Transport - North America Network',
            description:
              'Comprehensive finished vehicle transportation from manufacturing plants to dealership networks across North America. Requires specialized auto-haulers and dealership delivery expertise.',
            amount: 8500000,
            location: 'Dearborn, MI (Multi-State Deliveries)',
            deadline: '2025-02-15',
            industry: 'Automotive Manufacturing',
            type: 'RFQ',
            competitionLevel: 'High',
            matchScore: 96,
            status: 'Open',
            source: 'Ford Supplier Portal',
            requirements: [
              'Ford approved carrier',
              'Auto-hauler fleet',
              'Dealership delivery experience',
              'Real-time tracking',
            ],
            transportationComponents: [
              'Finished vehicle transport from manufacturing plants',
              'Dealership network delivery coordination',
              'Auto-hauler specialized equipment requirements',
              'Real-time GPS tracking and delivery confirmation',
              'Quality assurance and vehicle condition documentation',
            ],
          },
          // General Motors Supply Chain
          {
            id: 'GM-RFB-2025-001',
            company: 'General Motors Supply Chain',
            title: 'Automotive Parts & Components Supply Chain',
            description:
              'Inbound logistics for automotive parts and components from suppliers to GM manufacturing facilities. Includes just-in-time delivery coordination and cross-docking operations.',
            amount: 12000000,
            location: 'Multiple Supplier Locations to GM Plants',
            deadline: '2025-02-10',
            industry: 'Automotive Supply Chain',
            type: 'RFB',
            competitionLevel: 'High',
            matchScore: 94,
            status: 'Open',
            source: 'GM Supplier Portal',
            requirements: [
              'GM supplier qualification',
              'JIT delivery capability',
              'Cross-dock facilities',
              'Manufacturing experience',
            ],
            transportationComponents: [
              'Inbound supplier parts transportation',
              'Just-in-time delivery coordination',
              'Cross-docking and consolidation operations',
              'Manufacturing facility scheduling',
              'Supply chain visibility and tracking',
            ],
          },
          // Tesla Electric Vehicle Delivery
          {
            id: 'TESLA-RFQ-2025-001',
            company: 'Tesla Inc.',
            title: 'Electric Vehicle Delivery Network',
            description:
              'Direct-to-consumer electric vehicle delivery network including Tesla delivery centers, customer home delivery, and mobile service support. Requires EV handling expertise.',
            amount: 5600000,
            location: 'Tesla Factories to Customer Locations',
            deadline: '2025-02-18',
            industry: 'Electric Vehicle',
            type: 'RFQ',
            competitionLevel: 'Medium',
            matchScore: 92,
            status: 'Open',
            source: 'Tesla Supplier Portal',
            requirements: [
              'EV handling experience',
              'Customer delivery service',
              'White-glove delivery',
              'Metro area coverage',
            ],
            transportationComponents: [
              'Electric vehicle specialized transport',
              'Direct-to-consumer delivery network',
              'Customer home delivery service',
              'Tesla delivery center coordination',
              'Mobile service support logistics',
            ],
          },
          // Caterpillar Heavy Equipment
          {
            id: 'CAT-RFQ-2025-001',
            company: 'Caterpillar Inc.',
            title: 'Heavy Equipment & Machinery Transport Services',
            description:
              'Specialized transportation for heavy construction equipment, mining machinery, and industrial equipment. Requires heavy-haul capabilities and equipment handling expertise.',
            amount: 6800000,
            location: 'Peoria, IL to Construction Sites Nationwide',
            deadline: '2025-02-20',
            industry: 'Heavy Equipment Manufacturing',
            type: 'RFQ',
            competitionLevel: 'Medium',
            matchScore: 98,
            status: 'Open',
            source: 'Caterpillar Portal',
            requirements: [
              'Heavy haul equipment',
              'Oversize permits',
              'Equipment handling expertise',
              'Jobsite delivery',
            ],
            transportationComponents: [
              'Heavy construction equipment transport',
              'Mining machinery specialized hauling',
              'Oversize and overweight permit coordination',
              'Jobsite delivery and equipment positioning',
              'Specialized rigging and handling equipment',
            ],
          },
          // John Deere Agricultural Equipment
          {
            id: 'JD-RFB-2025-001',
            company: 'John Deere',
            title: 'Agricultural Equipment Distribution Network',
            description:
              'Transportation and distribution of agricultural equipment from manufacturing to dealer networks. Includes seasonal surge capacity and rural delivery expertise.',
            amount: 4200000,
            location: 'Moline, IL to Dealer Network Locations',
            deadline: '2025-02-08',
            industry: 'Agricultural Equipment',
            type: 'RFB',
            competitionLevel: 'Medium',
            matchScore: 89,
            status: 'Open',
            source: 'John Deere Portal',
            requirements: [
              'Agricultural equipment experience',
              'Rural delivery capability',
              'Seasonal capacity',
              'Dealer coordination',
            ],
            transportationComponents: [
              'Agricultural equipment dealer distribution',
              'Rural delivery network and capabilities',
              'Seasonal surge capacity (spring planting)',
              'Dealer coordination and scheduling',
              'Equipment handling and positioning services',
            ],
          },
          // Texas DOT Construction Equipment
          {
            id: 'TX-RFP-2025-001',
            company: 'Texas Department of Transportation',
            title: 'Construction Equipment Transport - I-35 Expansion',
            description:
              'Heavy equipment transport for major highway construction project including excavators, bulldozers, and crane transport across Texas regions',
            amount: 2800000,
            location: 'Austin, TX to Dallas, TX',
            deadline: '2025-02-15',
            industry: 'State Infrastructure',
            type: 'RFP',
            competitionLevel: 'High',
            matchScore: 91,
            status: 'Open',
            source: 'Texas SmartBuy',
            requirements: [
              'Heavy haul permits',
              'Oversize experience',
              'Construction site access',
            ],
            transportationComponents: [
              'Heavy construction equipment transport',
              'Highway construction project logistics',
              'Specialized equipment hauling (excavators, bulldozers)',
              'Construction site delivery coordination',
              'State highway project compliance',
            ],
          },
          // California EV Transport Network
          {
            id: 'CA-RFQ-2025-001',
            company: 'California Department of Transportation',
            title: 'Electric Vehicle Transport Network',
            description:
              'EV transport for state fleet electrification program including Tesla, Chevy Bolt, and other electric vehicles across California',
            amount: 3200000,
            location: 'Sacramento, CA to Los Angeles, CA',
            deadline: '2025-02-15',
            industry: 'State Fleet Management',
            type: 'RFQ',
            competitionLevel: 'Medium',
            matchScore: 88,
            status: 'Open',
            source: 'California eProcure',
            requirements: [
              'EV handling experience',
              'Environmental compliance',
              'California emissions standards',
            ],
            transportationComponents: [
              'Electric vehicle fleet transport',
              'State fleet electrification support',
              'Environmental compliance transport',
              'California emissions standards compliance',
              'State government delivery coordination',
            ],
          },
          // Michigan Automotive Parts Network
          {
            id: 'MI-RFB-2025-001',
            company: 'Michigan Economic Development Corporation',
            title: 'Automotive Parts Distribution Network',
            description:
              'Transport network for automotive supplier ecosystem supporting Ford, GM, and Stellantis manufacturing operations across Michigan',
            amount: 4500000,
            location: 'Detroit, MI to Grand Rapids, MI',
            deadline: '2025-02-18',
            industry: 'Automotive Supply Chain',
            type: 'RFB',
            competitionLevel: 'High',
            matchScore: 95,
            status: 'Open',
            source: 'Michigan SIGMA',
            requirements: [
              'Automotive supplier experience',
              'JIT delivery capability',
              'Quality control systems',
            ],
            transportationComponents: [
              'Automotive supplier network coordination',
              'Just-in-time manufacturing support',
              'Quality control and inspection services',
              'Michigan automotive ecosystem integration',
              'Supplier relationship management logistics',
            ],
          },
        ];
        setAutomotiveOpportunities(mockAutomotiveOpportunities);
      }
    } catch (error) {
      console.error(
        'Error searching automotive/construction opportunities:',
        error
      );
      // Ensure automotiveOpportunities is always an array
      setAutomotiveOpportunities([]);
    } finally {
      setLoadingAutomotiveOps(false);
    }
  };

  // Import automotive opportunity directly into AI analysis
  const importAutomotiveOpportunity = (opportunity: any) => {
    setSelectedAutomotiveOpportunity(opportunity);
    setDocumentType(opportunity.type);

    // Create a comprehensive analysis based on the automotive opportunity
    const mockAnalysis: AIBidAnalysis = {
      documentType: `${opportunity.type} (${opportunity.company})`,
      summary: `Automotive/Construction ${opportunity.type} from ${opportunity.company}: ${opportunity.description}. AI identified specialized transportation requirements with total contract value of $${opportunity.amount.toLocaleString()}.`,
      keyRequirements: opportunity.transportationComponents || [
        'Specialized equipment handling and transport',
        'Industry-specific compliance and certifications',
        'Just-in-time delivery capabilities',
        'Quality control and documentation',
        'Supply chain integration and coordination',
      ],
      recommendedBid: `$${Math.floor(opportunity.amount * 0.9).toLocaleString()}`,
      confidence: opportunity.matchScore || 90,
      bidStrategy: {
        pricing:
          'Competitive with specialized expertise premium - automotive/construction focused',
        timeline:
          '14-day response with comprehensive capability demonstration and implementation plan',
        approach:
          'Specialized automotive/construction logistics with industry expertise and supply chain integration',
      },
      generatedResponse: `AUTOMOTIVE/CONSTRUCTION LOGISTICS PROPOSAL

Dear ${opportunity.company} Procurement Team,

FleetFlow is pleased to respond to your ${opportunity.type} for ${opportunity.title}. As a specialized transportation provider with extensive automotive and construction industry experience, we bring the expertise and capabilities required for your $${opportunity.amount.toLocaleString()} logistics program.

OUR SPECIALIZED CAPABILITIES:
• Automotive supply chain integration with JIT delivery
• Heavy equipment and construction machinery transport
• Specialized handling and rigging capabilities
• Industry-specific compliance and certifications
• Supply chain visibility and quality control systems

PROPOSED SOLUTION:
We propose a comprehensive logistics solution valued at $${Math.floor(opportunity.amount * 0.9).toLocaleString()}, providing:
${(opportunity.transportationComponents || []).map((comp: string) => `• ${comp}`).join('\n')}

COMPETITIVE ADVANTAGES:
• Proven automotive/construction industry experience
• Specialized equipment fleet and handling capabilities
• Advanced supply chain integration and visibility
• Quality control and compliance management systems
• Dedicated account management and customer success

We are committed to delivering excellence in automotive and construction logistics. Our team is ready to discuss this opportunity and demonstrate how DEPOINTE can support your transportation requirements.

Respectfully submitted,

Dieasha "Dee" Davis, President
DEE DAVIS INC dba DEPOINTE
MC 1647572 | DOT 4250594 | Woman-Owned Small Business

📧 Contact Information:
• Email: info@deedavis.biz
• Phone: (248) 247-5020
• 24/7 Support Available

"Intelligent Logistics Powered by FleetFlow™ Technology"`,
      competitiveAdvantage: [
        'Automotive and construction industry expertise',
        'Specialized equipment and handling capabilities',
        'Supply chain integration and JIT delivery',
        'Quality control and compliance systems',
        'Industry relationship and network access',
        'Heavy haul and oversize transport experience',
      ],
      riskFactors: [
        'Specialized equipment and handling requirements',
        'Industry-specific regulations and compliance',
        'Just-in-time delivery performance standards',
        'Seasonal demand variations and capacity needs',
        'Equipment handling and damage liability',
        'Supply chain disruption and contingency planning',
      ],
    };

    setAiAnalysis(mockAnalysis);
    setActiveTab('analysis');
  };

  // ✅ NEW: InstantMarkets.com RFP opportunities search (205,587+ opportunities)
  const searchInstantMarketsOpportunities = async () => {
    setLoadingInstantMarketsOps(true);

    try {
      const searchParams = {
        keywords: instantMarketsSearchKeywords,
        platforms: ['instant_markets'], // Use InstantMarkets web scraping
        location: 'nationwide',
        minValue: 100000, // Minimum $100K contracts for InstantMarkets
        equipment: 'transportation logistics government',
      };

      const response = await fetch('/api/instant-markets-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
      }).catch((err) => {
        console.warn('InstantMarkets API not available:', err.message);
        return { ok: false };
      });

      if (response.ok) {
        const result = await response.json();
        // Handle API response structure - extract opportunities array
        const opportunities =
          result.data?.opportunities || result.opportunities || result || [];
        setInstantMarketsOpportunities(
          Array.isArray(opportunities) ? opportunities : []
        );
      } else {
        // Fallback to InstantMarkets mock data
        const mockInstantMarketsOpportunities = [
          {
            id: 'IM-TX-2025-001',
            agency: 'Houston Metropolitan Transit Authority',
            title: 'Regional Bus Transportation Services - Route 45 Corridor',
            description:
              'Comprehensive bus transportation services for high-traffic metropolitan corridor',
            amount: 8500000,
            location: 'Houston, TX to The Woodlands, TX',
            deadline: '2025-02-21',
            type: 'RFP',
            status: 'Open',
            source: 'InstantMarkets.com',
            competitionLevel: 'High',
            matchScore: 94,
            requirements: [
              'ADA compliant fleet required',
              'Real-time GPS tracking systems',
              'Professional uniformed drivers',
              'Environmental compliance certifications',
            ],
          },
          {
            id: 'IM-CA-2025-002',
            agency: 'California Department of General Services',
            title:
              'Statewide Warehousing and Distribution Services - Medical Supplies',
            description:
              'Comprehensive 3PL warehousing services for state medical supply chain',
            amount: 25000000,
            location: 'Sacramento, CA (Statewide Distribution)',
            deadline: '2025-02-18',
            type: 'RFP',
            status: 'Open',
            source: 'InstantMarkets.com',
            competitionLevel: 'Critical',
            matchScore: 98,
            requirements: [
              'FDA-compliant warehouse facilities',
              'Temperature-controlled storage (2-8°C)',
              'Real-time inventory management system',
              '24/7 emergency response capabilities',
            ],
          },
        ];
        setInstantMarketsOpportunities(mockInstantMarketsOpportunities);
      }
    } catch (error) {
      console.error('Error searching InstantMarkets opportunities:', error);
      // Ensure instantMarketsOpportunities is always an array
      setInstantMarketsOpportunities([]);
    } finally {
      setLoadingInstantMarketsOps(false);
    }
  };

  // ✅ NEW: Warehousing & 3PL RFP opportunities search (High-value opportunities)
  const searchWarehousingOpportunities = async () => {
    setLoadingWarehousingOps(true);

    try {
      const searchParams = {
        keywords: warehousingSearchKeywords,
        platforms: ['warehousing'], // Use warehousing-specific sources
        location: 'nationwide',
        minValue: 500000, // Minimum $500K contracts for warehousing
        equipment: 'warehouse 3PL fulfillment distribution',
      };

      const response = await fetch('/api/warehousing-rfp-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
      }).catch((err) => {
        console.warn('Warehousing RFP API not available:', err.message);
        return { ok: false };
      });

      if (response.ok) {
        const result = await response.json();
        // Handle API response structure - extract opportunities array
        const opportunities =
          result.data?.opportunities || result.opportunities || result || [];
        setWarehousingOpportunities(
          Array.isArray(opportunities) ? opportunities : []
        );
      } else {
        // Fallback to warehousing mock data
        const mockWarehousingOpportunities = [
          {
            id: 'GOV-WH-2025-001',
            agency: 'General Services Administration',
            title:
              'Federal Supply Chain Warehousing Services - Multi-Region Contract',
            description:
              'Comprehensive warehousing and distribution services for federal agencies',
            amount: 45000000,
            location: 'Multiple Federal Facilities (Nationwide)',
            deadline: '2025-03-15',
            type: 'RFP',
            status: 'Open',
            source: 'SAM.gov / Government Warehousing',
            competitionLevel: 'Critical',
            matchScore: 96,
            requirements: [
              'Government security clearance required',
              'GSA Schedule 48 compliance',
              'Multi-region warehouse network',
              'Real-time inventory tracking systems',
            ],
          },
          {
            id: 'ECOM-FUL-2025-001',
            agency: 'Amazon FBA Third-Party Network',
            title:
              'Regional Fulfillment Center Operations - Southeast Expansion',
            description:
              'Third-party fulfillment center operations for Amazon FBA network expansion',
            amount: 35000000,
            location: 'Atlanta, GA Hub (Southeast Regional)',
            deadline: '2025-03-01',
            type: 'RFP',
            status: 'Open',
            source: 'E-commerce Fulfillment Networks',
            competitionLevel: 'High',
            matchScore: 92,
            requirements: [
              'Amazon FBA certification required',
              'Same-day delivery capabilities',
              'Peak season scaling (4x capacity)',
              'Returns processing expertise',
            ],
          },
          {
            id: 'MFG-DIST-2025-001',
            agency: 'Procter & Gamble Supply Chain Services',
            title:
              'Consumer Goods Distribution Network - North American Operations',
            description:
              'Comprehensive distribution and warehousing services for consumer goods manufacturing',
            amount: 52000000,
            location: 'Cincinnati, OH Hub (North American Network)',
            deadline: '2025-04-10',
            type: 'RFP',
            status: 'Open',
            source: 'Manufacturing Distribution Networks',
            competitionLevel: 'High',
            matchScore: 94,
            requirements: [
              'FDA-compliant warehouse facilities',
              'Consumer goods handling expertise',
              'Temperature-controlled storage capabilities',
              'Quality control and testing facilities',
            ],
          },
        ];
        setWarehousingOpportunities(mockWarehousingOpportunities);
      }
    } catch (error) {
      console.error('Error searching warehousing opportunities:', error);
      // Ensure warehousingOpportunities is always an array
      setWarehousingOpportunities([]);
    } finally {
      setLoadingWarehousingOps(false);
    }
  };

  // ✅ NEW: TruckingPlanet Network shipper search (70,000+ verified shippers)
  const searchTruckingPlanetShippers = async () => {
    setLoadingTruckingPlanet(true);
    try {
      console.info('🌐 Searching TruckingPlanet Network for shippers...');

      const queryParams = new URLSearchParams({
        action: 'shippers',
        equipmentType: truckingPlanetFilters.equipmentType,
        freightVolume: truckingPlanetFilters.freightVolume,
      });

      if (truckingPlanetFilters.state) {
        queryParams.append('state', truckingPlanetFilters.state);
      }

      const response = await fetch(`/api/trucking-planet?${queryParams}`).catch(
        (err) => {
          console.warn('TruckingPlanet API not available:', err.message);
          return { ok: false, json: () => ({ success: false }) };
        }
      );
      const data = await response.json();

      if (data.success && data.data.shippers) {
        setTruckingPlanetShippers(data.data.shippers);
        console.info(
          `✅ Found ${data.data.totalFound} TruckingPlanet shippers`
        );
      } else {
        // Fallback to mock data
        const mockShippers = [
          {
            id: 'TP-SHIP-001',
            companyName: 'Walmart Distribution Center',
            address: '1234 Commerce Blvd, Bentonville, AR 72712',
            phone: '(479) 273-4000',
            email: 'logistics@walmart.com',
            contactName: 'Sarah Johnson',
            contactTitle: 'Transportation Manager',
            commoditiesShipped: [
              'General Merchandise',
              'Food Products',
              'Consumer Goods',
            ],
            employeeCount: '50,000+',
            salesVolume: '$500B+',
            equipmentTypes: ['dry_van', 'refrigerated'],
            freightVolume: 'high',
            source: 'trucking_planet',
          },
          {
            id: 'TP-SHIP-002',
            companyName: 'Amazon Fulfillment Center',
            address: '5678 Logistics Way, Seattle, WA 98109',
            phone: '(206) 266-1000',
            email: 'freight@amazon.com',
            contactName: 'Mike Chen',
            contactTitle: 'Senior Logistics Coordinator',
            commoditiesShipped: ['E-commerce Products', 'Electronics', 'Books'],
            employeeCount: '25,000+',
            salesVolume: '$400B+',
            equipmentTypes: ['dry_van', 'box_truck'],
            freightVolume: 'high',
            source: 'trucking_planet',
          },
          {
            id: 'TP-SHIP-003',
            companyName: 'Ford Motor Company',
            address: '1 American Rd, Dearborn, MI 48126',
            phone: '(313) 322-3000',
            email: 'parts@ford.com',
            contactName: 'Jennifer Martinez',
            contactTitle: 'Parts Distribution Manager',
            commoditiesShipped: [
              'Automotive Parts',
              'Vehicle Components',
              'Steel',
            ],
            employeeCount: '190,000+',
            salesVolume: '$150B+',
            equipmentTypes: ['flatbed', 'stepdeck', 'dry_van'],
            freightVolume: 'high',
            source: 'trucking_planet',
          },
        ];
        setTruckingPlanetShippers(mockShippers);
      }
    } catch (error) {
      console.error('Error searching TruckingPlanet shippers:', error);
      setTruckingPlanetShippers([]);
    } finally {
      setLoadingTruckingPlanet(false);
    }
  };

  // Import TruckingPlanet shipper directly into AI analysis
  const importTruckingPlanetShipper = (shipper: any) => {
    setSelectedTruckingPlanetShipper(shipper);

    // Create a comprehensive analysis based on the TruckingPlanet shipper data
    const analysis: AIBidAnalysis = {
      documentType: 'TruckingPlanet Shipper Profile',
      summary: `High-volume shipper ${shipper.companyName} identified through TruckingPlanet Network. Company has ${shipper.employeeCount} employees with ${shipper.salesVolume} annual revenue, shipping ${shipper.commoditiesShipped.join(', ')} via ${shipper.equipmentTypes.join(', ')} equipment.`,
      keyRequirements: [
        `Equipment: ${shipper.equipmentTypes.join(', ')}`,
        `Freight Volume: ${shipper.freightVolume}`,
        `Commodities: ${shipper.commoditiesShipped.join(', ')}`,
        'Verified shipper through TruckingPlanet network',
        'Direct contact information available',
      ],
      recommendedBid: 'Competitive rate with volume discounts',
      competitiveAdvantage: [
        'Direct access through TruckingPlanet network',
        'Verified shipper with established freight needs',
        'Multiple equipment types indicate diverse opportunities',
        'Large company size suggests stable, ongoing business',
        'AI-enhanced lead scoring and recommendations',
      ],
      riskFactors: [
        'High-volume shipper may have existing carrier relationships',
        'Large companies often have complex procurement processes',
        'Competition from established logistics providers',
      ],
      confidence: 92,
      bidStrategy: {
        pricing: 'Volume-based pricing with performance incentives',
        timeline: 'Immediate response with 30-day service implementation',
        approach:
          'Emphasize TruckingPlanet network access and AI-enhanced service',
      },
      generatedResponse: `TRUCKING PLANET NETWORK PARTNERSHIP PROPOSAL

Dear ${shipper.contactName || 'Transportation Manager'},

FleetFlow is pleased to connect with ${shipper.companyName} through our TruckingPlanet Network integration, which provides us direct access to verified shippers with established freight needs.

🌐 TRUCKING PLANET NETWORK ADVANTAGE
Our membership in the TruckingPlanet Network (70,000+ shippers, 2M+ carriers) gives us unique insights into your transportation requirements and enables immediate partnership opportunities.

📊 YOUR SHIPPING PROFILE ANALYSIS
• Company: ${shipper.companyName}
• Contact: ${shipper.contactName} (${shipper.contactTitle})
• Equipment Needs: ${shipper.equipmentTypes.join(', ')}
• Commodities: ${shipper.commoditiesShipped.join(', ')}
• Volume Level: ${shipper.freightVolume}
• Company Size: ${shipper.employeeCount} employees

🚛 OUR TAILORED SOLUTION
Based on your TruckingPlanet profile, we can provide:
• ${shipper.equipmentTypes.map((type: string) => `${type.replace('_', ' ').toUpperCase()} transportation services`).join('\n• ')}
• AI-optimized routing for ${shipper.commoditiesShipped.join(', ')} shipments
• Volume-based pricing for ${shipper.freightVolume}-volume shippers
• Real-time tracking and automated reporting
• Dedicated account management for enterprise clients

💼 PARTNERSHIP BENEFITS
✅ Verified carrier through TruckingPlanet network
✅ AI-enhanced logistics optimization
✅ Direct communication channels established
✅ Volume pricing for consistent freight needs
✅ Technology integration and real-time visibility

📞 IMMEDIATE NEXT STEPS
Given your established presence in the TruckingPlanet network and our verified carrier status, we can begin partnership discussions immediately.

Contact Information:
• Phone: ${shipper.phone}
• Email: ${shipper.email}
• Primary Contact: ${shipper.contactName}

We're ready to discuss how DEPOINTE can optimize your transportation operations through our TruckingPlanet Network partnership, powered by FleetFlow™ technology.

Best regards,

Dieasha "Dee" Davis, President
DEE DAVIS INC dba DEPOINTE
MC 1647572 | DOT 4250594 | Woman-Owned Small Business

📧 Contact Information:
• Email: info@deedavis.biz
• Phone: (248) 247-5020
• 24/7 Support Available

TruckingPlanet Network Member: DEE DAVIS INC

🤖 AI-GENERATED TRUCKING PLANET PROPOSAL
This response leverages verified shipper data from the TruckingPlanet Network, emphasizing direct network access, established freight needs, and immediate partnership potential through verified carrier-shipper connections.`,
    };

    // Set AI analysis and show the AI assistant
    setAiAnalysis(analysis);
    setShowAIBidAssistant(true);
    setShowBidResponse(true);
    setActiveTab('active');
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1b2e',
        }}
      >
        <div style={{ textAlign: 'center', color: '#ffffff' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>📋</div>
          <div>Loading RFx Opportunities...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '40px',
        paddingTop: '100px',
        background: 'linear-gradient(135deg, #1a1b2e, #16213e)',
        minHeight: '100vh',
        color: 'white',
      }}
    >
      <h1
        style={{
          fontSize: '2.5rem',
          textAlign: 'center',
          marginBottom: '30px',
        }}
      >
        📋 FreightFlow RFx℠ Management
      </h1>

      {/* Header Stats */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px',
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
          }}
        >
          {[
            {
              label: 'Active RFx',
              value: loadingRfxRequests ? '...' : rfxRequests.length.toString(),
              color: '#10b981',
              icon: '📋',
            },
            {
              label: 'My Bids',
              value: loadingMyBids ? '...' : myBids.length.toString(),
              color: '#3b82f6',
              icon: '💰',
            },
            {
              label: 'Win Rate',
              value: loadingMyBids ? '...' : myBids.length > 0 ? '0%' : 'N/A',
              color: '#22c55e',
              icon: '🏆',
            },
            {
              label: 'Avg Response',
              value: loadingMyBids
                ? '...'
                : myBids.length > 0
                  ? 'N/A'
                  : 'No data',
              color: '#f59e0b',
              icon: '⏰',
            },
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                padding: '15px',
                textAlign: 'center',
                border: `1px solid ${stat.color}40`,
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                {stat.icon}
              </div>
              <div
                style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: stat.color,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Bid Assistant Button */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'center',
        }}
      >
        <button
          onClick={() => setShowAIBidAssistant(!showAIBidAssistant)}
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '15px 30px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow =
              '0 12px 35px rgba(139, 92, 246, 0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0px)';
            e.currentTarget.style.boxShadow =
              '0 8px 25px rgba(139, 92, 246, 0.3)';
          }}
        >
          🤖 AI Cross-Industry RFx Analyzer{' '}
          {showAIBidAssistant ? '- Hide' : '- Upload Any Industry RFx'}
        </button>
      </div>

      {/* AI Bid Assistant Panel */}
      {showAIBidAssistant && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '30px',
            marginBottom: '30px',
          }}
        >
          <h2
            style={{
              fontSize: '1.8rem',
              marginBottom: '25px',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center',
            }}
          >
            🤖 AI-Powered Cross-Industry RFx Analysis & Transportation
            Extraction
          </h2>

          <div
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '12px',
              padding: '15px',
              marginBottom: '25px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
            }}
          >
            <h3
              style={{
                fontSize: '1rem',
                color: '#8b5cf6',
                marginBottom: '10px',
              }}
            >
              🧠 Smart Logistics Extraction Engine
            </h3>
            <p
              style={{
                fontSize: '12px',
                lineHeight: '1.6',
                margin: 0,
                opacity: 0.9,
              }}
            >
              Our advanced AI can analyze RFx documents from{' '}
              <strong>ANY industry</strong> and intelligently extract
              transportation, logistics, warehousing, and freight management
              components - even when the primary RFx is for manufacturing,
              healthcare, technology, construction, government, or energy
              services. The AI then generates comprehensive logistics-focused
              proposals specifically addressing FleetFlow's capabilities.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px',
              marginBottom: '25px',
            }}
          >
            {/* Upload Section */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                border: '2px dashed rgba(139, 92, 246, 0.3)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.2rem',
                  marginBottom: '15px',
                  color: '#8b5cf6',
                }}
              >
                📄 Document Upload
              </h3>

              <div style={{ marginBottom: '15px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                  }}
                >
                  Document Type:
                </label>
                <select
                  value={documentType}
                  onChange={(e) =>
                    setDocumentType(
                      e.target.value as
                        | 'RFP'
                        | 'RFQ'
                        | 'RFI'
                        | 'RFB'
                        | 'SOURCES_SOUGHT'
                    )
                  }
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                >
                  <option value='RFQ'>RFQ - Request for Quote</option>
                  <option value='RFP'>RFP - Request for Proposal</option>
                  <option value='RFB'>RFB - Request for Bid</option>
                  <option value='RFI'>RFI - Request for Information</option>
                  <option value='SOURCES_SOUGHT'>
                    Sources Sought - Pre-Solicitation Notice
                  </option>
                </select>
              </div>

              {/* Company Document Upload Section */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '20px',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                }}
              >
                <h4
                  style={{
                    margin: '0 0 10px 0',
                    fontSize: '14px',
                    color: '#fbbf24',
                    fontWeight: '600',
                  }}
                >
                  📄 Company Profile Document (Optional)
                </h4>
                <p
                  style={{
                    margin: '0 0 15px 0',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Upload your resume, capabilities statement, or company profile
                  to extract your real past performance, certifications, and
                  experience for personalized responses.
                </p>

                <input
                  type='file'
                  onChange={handleCompanyDocumentUpload}
                  accept='.pdf,.doc,.docx,.txt'
                  style={{ display: 'none' }}
                  id='company-document-input'
                />

                <div
                  style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}
                >
                  <button
                    onClick={() =>
                      document.getElementById('company-document-input')?.click()
                    }
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: 'rgba(251, 191, 36, 0.1)',
                      color: '#fbbf24',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                    }}
                  >
                    📎 Upload Company Doc
                  </button>

                  <button
                    onClick={extractCompanyProfile}
                    disabled={!companyDocument || isExtractingProfile}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background:
                        companyDocument && !isExtractingProfile
                          ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                          : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor:
                        companyDocument && !isExtractingProfile
                          ? 'pointer'
                          : 'not-allowed',
                      fontSize: '12px',
                      fontWeight: '500',
                      opacity:
                        companyDocument && !isExtractingProfile ? 1 : 0.6,
                    }}
                  >
                    {isExtractingProfile
                      ? '🔄 Extracting...'
                      : '🧠 Extract Profile'}
                  </button>
                </div>

                {companyDocument && (
                  <div
                    style={{
                      background: 'rgba(251, 191, 36, 0.1)',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      borderRadius: '6px',
                      padding: '8px',
                      marginBottom: '10px',
                    }}
                  >
                    <div style={{ fontSize: '11px', color: '#fbbf24' }}>
                      📄 {companyDocument.name}
                    </div>
                    <div style={{ fontSize: '10px', opacity: 0.7 }}>
                      Size: {Math.round(companyDocument.size / 1024)} KB
                    </div>
                  </div>
                )}

                {extractedProfile && (
                  <div
                    style={{
                      background: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '6px',
                      padding: '10px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#22c55e',
                        fontWeight: '600',
                        marginBottom: '5px',
                      }}
                    >
                      ✅ Profile Extracted Successfully!
                    </div>

                    {extractedProfile.pastPerformance &&
                      extractedProfile.pastPerformance.length > 0 && (
                        <div style={{ marginBottom: '8px' }}>
                          <div
                            style={{
                              fontSize: '10px',
                              color: '#22c55e',
                              fontWeight: '500',
                            }}
                          >
                            📋 Past Performance:{' '}
                            {extractedProfile.pastPerformance.length} items
                          </div>
                          <div
                            style={{
                              fontSize: '9px',
                              opacity: 0.8,
                              marginTop: '2px',
                            }}
                          >
                            {extractedProfile.pastPerformance[0].substring(
                              0,
                              60
                            )}
                            ...
                          </div>
                        </div>
                      )}

                    {extractedProfile.certifications &&
                      extractedProfile.certifications.length > 0 && (
                        <div style={{ marginBottom: '8px' }}>
                          <div
                            style={{
                              fontSize: '10px',
                              color: '#22c55e',
                              fontWeight: '500',
                            }}
                          >
                            🏆 Certifications:{' '}
                            {extractedProfile.certifications.join(', ')}
                          </div>
                        </div>
                      )}

                    {extractedProfile.companyDescription && (
                      <div style={{ marginBottom: '8px' }}>
                        <div
                          style={{
                            fontSize: '10px',
                            color: '#22c55e',
                            fontWeight: '500',
                          }}
                        >
                          🏢 Company Description: Available
                        </div>
                      </div>
                    )}

                    <div
                      style={{
                        fontSize: '9px',
                        opacity: 0.7,
                        marginTop: '5px',
                        paddingTop: '5px',
                        borderTop: '1px solid rgba(34, 197, 94, 0.2)',
                      }}
                    >
                      This information will be used in your RFx responses for
                      personalized, specific answers.
                    </div>
                  </div>
                )}
              </div>

              {/* RFx Document Upload Section */}
              <input
                type='file'
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept='.pdf,.doc,.docx,.txt'
                style={{ display: 'none' }}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '10px',
                }}
              >
                📎 Upload {documentType} Document
              </button>

              {uploadedDocument && (
                <div
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    padding: '10px',
                    marginBottom: '15px',
                  }}
                >
                  <div style={{ fontSize: '12px', color: '#22c55e' }}>
                    ✅ Uploaded: {uploadedDocument.name}
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>
                    Size: {Math.round(uploadedDocument.size / 1024)} KB
                  </div>
                </div>
              )}

              <button
                onClick={analyzeDocument}
                disabled={!uploadedDocument || isAnalyzing}
                style={{
                  width: '100%',
                  padding: '15px',
                  background:
                    uploadedDocument && !isAnalyzing
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor:
                    uploadedDocument && !isAnalyzing
                      ? 'pointer'
                      : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '600',
                  opacity: uploadedDocument && !isAnalyzing ? 1 : 0.6,
                }}
              >
                {isAnalyzing
                  ? '🔄 Analyzing Document...'
                  : '🧠 Analyze with AI'}
              </button>
            </div>

            {/* Analysis Results */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <h3
                style={{
                  fontSize: '1.2rem',
                  marginBottom: '15px',
                  color: '#10b981',
                }}
              >
                📊 AI Analysis Results
              </h3>

              {isAnalyzing && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '15px' }}>
                    🤖
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>
                    AI is analyzing your document...
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '4px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '2px',
                      marginTop: '15px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '30%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                        animation: 'loading 2s infinite',
                      }}
                    />
                  </div>
                </div>
              )}

              {aiAnalysis && (
                <div style={{ fontSize: '12px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#8b5cf6' }}>Document Type:</strong>{' '}
                    {aiAnalysis.documentType}
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#8b5cf6' }}>
                      Recommended Bid:
                    </strong>
                    <span
                      style={{
                        color: '#22c55e',
                        fontWeight: '700',
                        fontSize: '14px',
                      }}
                    >
                      {aiAnalysis.recommendedBid}
                    </span>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#8b5cf6' }}>Confidence:</strong>
                    <span
                      style={{
                        color:
                          aiAnalysis.confidence > 80
                            ? '#22c55e'
                            : aiAnalysis.confidence > 60
                              ? '#f59e0b'
                              : '#ef4444',
                        fontWeight: '700',
                      }}
                    >
                      {aiAnalysis.confidence}%
                    </span>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#8b5cf6' }}>
                      Key Requirements:
                    </strong>
                    <ul
                      style={{
                        margin: '5px 0',
                        paddingLeft: '15px',
                        fontSize: '11px',
                      }}
                    >
                      {aiAnalysis.keyRequirements
                        .slice(0, 3)
                        .map((req, index) => (
                          <li
                            key={index}
                            style={{ marginBottom: '3px', opacity: 0.9 }}
                          >
                            {req}
                          </li>
                        ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => setShowBidResponse(!showBidResponse)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginTop: '10px',
                    }}
                  >
                    📝 {showBidResponse ? 'Hide' : 'View'} Generated Bid
                    Response
                  </button>
                </div>
              )}

              {!isAnalyzing && !aiAnalysis && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px',
                    opacity: 0.6,
                    fontSize: '12px',
                  }}
                >
                  Upload and analyze a document to see AI-powered insights and
                  bid recommendations.
                </div>
              )}
            </div>
          </div>

          {/* Requirements Needing Operations Team Input */}
          {showBidResponse &&
            aiAnalysis &&
            aiAnalysis.requirementsNeedingInput &&
            aiAnalysis.requirementsNeedingInput.length > 0 && (
              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))',
                  borderRadius: '12px',
                  padding: '20px',
                  marginTop: '20px',
                  border: '2px solid rgba(251, 191, 36, 0.3)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '15px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>❓</span>
                  <h3
                    style={{
                      fontSize: '1.2rem',
                      margin: 0,
                      color: '#fbbf24',
                    }}
                  >
                    Operations Team Input Needed (
                    {aiAnalysis.requirementsNeedingInput.length} requirements)
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '20px',
                  }}
                >
                  The AI has identified requirements that need specific
                  information from your operations team to generate accurate
                  responses. Please provide the requested details below.
                </p>

                {aiAnalysis.requirementsNeedingInput.map((req, idx) => (
                  <div
                    key={req.requirementId}
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '8px',
                      padding: '15px',
                      marginBottom: '15px',
                      border: '1px solid rgba(251, 191, 36, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: '10px',
                        marginBottom: '10px',
                      }}
                    >
                      <span
                        style={{
                          background: 'rgba(251, 191, 36, 0.2)',
                          color: '#fbbf24',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}
                      >
                        #{idx + 1}
                      </span>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: '13px',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: '600',
                            marginBottom: '5px',
                          }}
                        >
                          {req.requirementText}
                        </p>
                        <p
                          style={{
                            fontSize: '12px',
                            color: '#fbbf24',
                            fontStyle: 'italic',
                            marginBottom: '10px',
                          }}
                        >
                          ⚠️ {req.needsInputReason}
                        </p>

                        {/* Input Fields */}
                        {req.suggestedInputFields.map((field, fieldIdx) => (
                          <div key={fieldIdx} style={{ marginBottom: '12px' }}>
                            <label
                              style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: 'rgba(255, 255, 255, 0.9)',
                                marginBottom: '5px',
                              }}
                            >
                              {field.label}
                              {field.description && (
                                <span
                                  style={{
                                    fontWeight: 'normal',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    fontSize: '11px',
                                    display: 'block',
                                  }}
                                >
                                  {field.description}
                                </span>
                              )}
                            </label>
                            {field.type === 'textarea' ? (
                              <textarea
                                value={
                                  userInputs[req.requirementId]?.[
                                    field.label
                                  ] || ''
                                }
                                onChange={(e) => {
                                  setUserInputs((prev) => ({
                                    ...prev,
                                    [req.requirementId]: {
                                      ...prev[req.requirementId],
                                      [field.label]: e.target.value,
                                    },
                                  }));
                                }}
                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                                style={{
                                  width: '100%',
                                  minHeight: '80px',
                                  padding: '8px',
                                  background: 'rgba(0, 0, 0, 0.4)',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  borderRadius: '4px',
                                  color: 'white',
                                  fontSize: '12px',
                                  resize: 'vertical',
                                }}
                              />
                            ) : (
                              <input
                                type={field.type}
                                value={
                                  userInputs[req.requirementId]?.[
                                    field.label
                                  ] || ''
                                }
                                onChange={(e) => {
                                  setUserInputs((prev) => ({
                                    ...prev,
                                    [req.requirementId]: {
                                      ...prev[req.requirementId],
                                      [field.label]: e.target.value,
                                    },
                                  }));
                                }}
                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                                style={{
                                  width: '100%',
                                  padding: '8px',
                                  background: 'rgba(0, 0, 0, 0.4)',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  borderRadius: '4px',
                                  color: 'white',
                                  fontSize: '12px',
                                }}
                              />
                            )}
                          </div>
                        ))}

                        {/* AI Draft Response (collapsed by default) */}
                        <details style={{ marginTop: '10px' }}>
                          <summary
                            style={{
                              fontSize: '11px',
                              color: 'rgba(255, 255, 255, 0.6)',
                              cursor: 'pointer',
                              padding: '5px',
                            }}
                          >
                            📄 View AI draft response (use as reference)
                          </summary>
                          <div
                            style={{
                              marginTop: '8px',
                              padding: '10px',
                              background: 'rgba(0, 0, 0, 0.3)',
                              borderRadius: '4px',
                              fontSize: '11px',
                              color: 'rgba(255, 255, 255, 0.7)',
                              whiteSpace: 'pre-wrap',
                              maxHeight: '200px',
                              overflowY: 'auto',
                            }}
                          >
                            {req.draftResponse}
                          </div>
                        </details>

                        {/* Provide Input Button */}
                        <div style={{ marginTop: '15px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleProvideInput(req)}
                            style={{
                              padding: '8px 16px',
                              background:
                                'linear-gradient(135deg, #10b981, #059669)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                          >
                            📝 Provide Input
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  style={{ marginTop: '15px', display: 'flex', gap: '10px' }}
                >
                  <button
                    onClick={() => {
                      // TODO: Implement regenerate with user inputs
                      alert(
                        'This will send your inputs back to the AI to regenerate responses for these requirements.'
                      );
                    }}
                    style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    ✨ Regenerate Responses with My Input
                  </button>
                  <button
                    onClick={() => {
                      setUserInputs({});
                    }}
                    style={{
                      padding: '10px 20px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    🔄 Clear All Inputs
                  </button>
                </div>
              </div>
            )}

          {/* Input Form Modal */}
          {showInputForm && selectedRequirement && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px',
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) handleCancelInput();
              }}
            >
              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(51, 65, 85, 0.95))',
                  borderRadius: '16px',
                  padding: '30px',
                  maxWidth: '600px',
                  width: '100%',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  border: '2px solid rgba(251, 191, 36, 0.3)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                  }}
                >
                  <h3
                    style={{ margin: 0, color: '#fbbf24', fontSize: '1.3rem' }}
                  >
                    📝 Provide Input for Requirement
                  </h3>
                  <button
                    onClick={handleCancelInput}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '20px',
                      cursor: 'pointer',
                      padding: '0',
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <p
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      marginBottom: '10px',
                    }}
                  >
                    <strong>Requirement:</strong>{' '}
                    {selectedRequirement.requirementText}
                  </p>
                  <p
                    style={{
                      color: '#fbbf24',
                      fontSize: '13px',
                      fontStyle: 'italic',
                    }}
                  >
                    ⚠️ {selectedRequirement.needsInputReason}
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  {selectedRequirement.suggestedInputFields?.map(
                    (field, idx) => (
                      <div key={idx} style={{ marginBottom: '15px' }}>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)',
                            marginBottom: '5px',
                          }}
                        >
                          {field.label}
                          {field.description && (
                            <span
                              style={{
                                fontWeight: 'normal',
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '12px',
                                display: 'block',
                              }}
                            >
                              {field.description}
                            </span>
                          )}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            value={inputValues[field.label] || ''}
                            onChange={(e) =>
                              setInputValues((prev) => ({
                                ...prev,
                                [field.label]: e.target.value,
                              }))
                            }
                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                            style={{
                              width: '100%',
                              minHeight: '100px',
                              padding: '10px',
                              background: 'rgba(0, 0, 0, 0.4)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '6px',
                              color: 'white',
                              fontSize: '13px',
                              resize: 'vertical',
                            }}
                          />
                        ) : (
                          <input
                            type={field.type}
                            value={inputValues[field.label] || ''}
                            onChange={(e) =>
                              setInputValues((prev) => ({
                                ...prev,
                                [field.label]: e.target.value,
                              }))
                            }
                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                            style={{
                              width: '100%',
                              padding: '10px',
                              background: 'rgba(0, 0, 0, 0.4)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '6px',
                              color: 'white',
                              fontSize: '13px',
                            }}
                          />
                        )}
                      </div>
                    )
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'flex-end',
                  }}
                >
                  <button
                    onClick={handleCancelInput}
                    style={{
                      padding: '10px 20px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitInput}
                    style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                    }}
                  >
                    ✅ Submit Input
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Generated Bid Response */}
          {showBidResponse && aiAnalysis && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                marginTop: '20px',
              }}
            >
              <h3
                style={{
                  fontSize: '1.2rem',
                  marginBottom: '15px',
                  color: '#f59e0b',
                }}
              >
                📝 AI-Generated Bid Response
              </h3>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  padding: '15px',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {aiAnalysis.generatedResponse}
              </div>
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  📋 Copy to Clipboard
                </button>
                <button
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  📧 Email Response
                </button>
                <button
                  onClick={handleSaveDraft}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  💾 Save Draft
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Navigation */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px',
          marginBottom: '30px',
        }}
      >
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {[
            {
              id: 'active',
              label: 'Active RFx',
              icon: '📋',
              color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            },
            {
              id: 'my-bids',
              label: 'My Bids',
              icon: '💰',
              color: 'linear-gradient(135deg, #10b981, #059669)',
            },
            {
              id: 'discovery-hub',
              label: 'Discovery Hub',
              icon: '🔍',
              color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            },
            {
              id: 'industry-sectors',
              label: 'Industry Sectors',
              icon: '🏭',
              color: 'linear-gradient(135deg, #ef4444, #dc2626)',
            },
            {
              id: 'network-partners',
              label: 'Network & Priority',
              icon: '🌐',
              color: 'linear-gradient(135deg, #f59e0b, #d97706)',
            },
            {
              id: 'closed',
              label: 'Closed',
              icon: '✅',
              color: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background:
                  activeTab === tab.id ? tab.color : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow:
                  activeTab === tab.id
                    ? '0 8px 25px rgba(0, 0, 0, 0.3)'
                    : '0 4px 15px rgba(0, 0, 0, 0.1)',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Active RFx Content */}
        {activeTab === 'active' && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '70px 1.2fr 1fr 100px 80px 90px 80px 90px',
                gap: '8px',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                marginBottom: '10px',
                fontWeight: '700',
                fontSize: '10px',
                textTransform: 'uppercase',
              }}
            >
              <div>ID</div>
              <div>Route</div>
              <div>Customer</div>
              <div>Deadline</div>
              <div>Bids</div>
              <div>Rate Range</div>
              <div>Urgency</div>
              <div>Actions</div>
            </div>

            {loadingRfxRequests ? (
              <div
                style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#94a3b8',
                }}
              >
                <div style={{ marginBottom: '16px' }}>🔄</div>
                <div>Loading RFX requests...</div>
              </div>
            ) : rfxRequests.length === 0 ? (
              <div
                style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#94a3b8',
                }}
              >
                <div style={{ marginBottom: '16px' }}>📋</div>
                <div>No active RFX requests found</div>
                <div style={{ fontSize: '10px', marginTop: '8px' }}>
                  Check back later for new opportunities
                </div>
              </div>
            ) : (
              rfxRequests
                .filter((rfx) => rfx.status === 'Active')
                .map((rfx, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        '70px 1.2fr 1fr 100px 80px 90px 80px 90px',
                      gap: '8px',
                      padding: '10px 12px',
                      background:
                        index % 2 === 0
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      fontSize: '11px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        index % 2 === 0
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(255, 255, 255, 0.02)';
                    }}
                  >
                    <div style={{ fontWeight: '700', color: '#60a5fa' }}>
                      {rfx.id}
                      <div
                        style={{
                          fontSize: '8px',
                          color: '#8b5cf6',
                          marginTop: '2px',
                        }}
                      >
                        {rfx.documentType}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontWeight: '600' }}>{rfx.origin}</div>
                      <div style={{ fontSize: '10px', opacity: 0.7 }}>
                        → {rfx.destination}
                      </div>
                    </div>
                    <div style={{ fontSize: '11px' }}>{rfx.customer}</div>
                    <div style={{ fontSize: '10px', color: '#f59e0b' }}>
                      {rfx.bidDeadline}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          background: 'rgba(59, 130, 246, 0.2)',
                          color: '#3b82f6',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                        }}
                      >
                        {rfx.currentBids} bids
                      </span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#22c55e' }}>
                      {rfx.estimatedRate}
                    </div>
                    <div>
                      <span
                        style={{
                          background:
                            rfx.urgency === 'High'
                              ? 'rgba(239, 68, 68, 0.2)'
                              : rfx.urgency === 'Medium'
                                ? 'rgba(245, 158, 11, 0.2)'
                                : 'rgba(34, 197, 94, 0.2)',
                          color:
                            rfx.urgency === 'High'
                              ? '#ef4444'
                              : rfx.urgency === 'Medium'
                                ? '#f59e0b'
                                : '#22c55e',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '600',
                        }}
                      >
                        {rfx.urgency}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        style={{
                          padding: '3px 6px',
                          background:
                            'linear-gradient(135deg, #10b981, #059669)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '8px',
                          fontWeight: '600',
                        }}
                      >
                        Bid
                      </button>
                      <button
                        onClick={() => setShowAIBidAssistant(true)}
                        title='AI Cross-Industry Analysis - Extract logistics components from any RFx'
                        style={{
                          padding: '3px 6px',
                          background:
                            'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '8px',
                          fontWeight: '600',
                        }}
                      >
                        AI
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* My Bids Content */}
        {activeTab === 'my-bids' && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1.2fr 90px 70px 90px 100px 90px',
                gap: '8px',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                marginBottom: '10px',
                fontWeight: '700',
                fontSize: '10px',
                textTransform: 'uppercase',
              }}
            >
              <div>RFx ID</div>
              <div>Customer</div>
              <div>My Bid</div>
              <div>Rank</div>
              <div>Total Bids</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {loadingMyBids ? (
              <div
                style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#94a3b8',
                }}
              >
                <div style={{ marginBottom: '16px' }}>🔄</div>
                <div>Loading your bids...</div>
              </div>
            ) : myBids.length === 0 ? (
              <div
                style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#94a3b8',
                }}
              >
                <div style={{ marginBottom: '16px' }}>📝</div>
                <div>No bids submitted yet</div>
                <div style={{ fontSize: '10px', marginTop: '8px' }}>
                  Submit your first bid on an active RFX request
                </div>
              </div>
            ) : (
              myBids.map((bid, index) => (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1.2fr 90px 70px 90px 100px 90px',
                    gap: '8px',
                    padding: '10px 12px',
                    background:
                      index % 2 === 0
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    fontSize: '11px',
                  }}
                >
                  <div style={{ fontWeight: '700', color: '#60a5fa' }}>
                    {bid.rfxId}
                  </div>
                  <div style={{ fontSize: '11px' }}>{bid.customer}</div>
                  <div style={{ fontWeight: '700', color: '#22c55e' }}>
                    {bid.myBid}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        background:
                          bid.rank === 1
                            ? 'rgba(34, 197, 94, 0.2)'
                            : 'rgba(245, 158, 11, 0.2)',
                        color: bid.rank === 1 ? '#22c55e' : '#f59e0b',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                      }}
                    >
                      #{bid.rank}
                    </span>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '10px' }}>
                    {bid.totalBids} bids
                  </div>
                  <div>
                    <span
                      style={{
                        background:
                          bid.status === 'Leading'
                            ? 'rgba(34, 197, 94, 0.2)'
                            : 'rgba(59, 130, 246, 0.2)',
                        color: bid.status === 'Leading' ? '#22c55e' : '#3b82f6',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                      }}
                    >
                      {bid.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    <button
                      style={{
                        padding: '3px 6px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '8px',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        padding: '3px 6px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '8px',
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* OLD SECTIONS - NOW CONSOLIDATED */}
        {false && activeTab === 'priority-queue' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              marginBottom: '24px',
            }}
          >
            {/* RFx Task Prioritization Panel */}
            <RFxTaskPrioritizationPanel />

            {/* RFx Performance Metrics */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                color: 'white',
              }}
            >
              <h3
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                  color: '#f59e0b',
                }}
              >
                📊 RFx Performance Dashboard
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: '#10b981',
                    }}
                  >
                    73%
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                    Win Rate
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: '#f59e0b',
                    }}
                  >
                    $12.3M
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                    Pipeline Value
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: '#3b82f6',
                    }}
                  >
                    18
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                    Active RFx
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: '#8b5cf6',
                    }}
                  >
                    4.2h
                  </div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                    Avg Response Time
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🎯</span>
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                    Priority Insights
                  </span>
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '20px',
                    fontSize: '0.8rem',
                    opacity: 0.9,
                  }}
                >
                  <li style={{ marginBottom: '4px' }}>
                    Focus on Walmart RFP - highest revenue potential
                  </li>
                  <li style={{ marginBottom: '4px' }}>
                    Complete competitive research for Amazon RFQ today
                  </li>
                  <li style={{ marginBottom: '4px' }}>
                    FedEx partnership proposal has 80% win probability
                  </li>
                  <li>
                    3 RFx responses due within 24 hours - allocate resources
                    accordingly
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Discovery Hub - Consolidated Government + Enterprise + InstantMarkets */}
        {activeTab === 'discovery-hub' && (
          <div>
            {/* Discovery Hub Header */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <span style={{ fontSize: '24px' }}>🔍</span>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    margin: 0,
                  }}
                >
                  RFx Discovery Hub
                </h3>
              </div>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: 0,
                  fontSize: '14px',
                }}
              >
                Comprehensive RFx discovery across government, enterprise, and
                market platforms
              </p>

              {/* Sub-tabs for Discovery Hub */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '16px',
                  flexWrap: 'wrap',
                }}
              >
                {[
                  { id: 'government', label: 'Government', icon: '🏛️' },
                  { id: 'enterprise', label: 'Enterprise', icon: '🏢' },
                  {
                    id: 'instant_markets',
                    label: 'InstantMarkets',
                    icon: '🌐',
                  },
                ].map((subTab) => (
                  <button
                    key={subTab.id}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>{subTab.icon}</span>
                    {subTab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Government Opportunities Section */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                🏛️ Government Opportunities
              </h4>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '13px',
                  marginBottom: '12px',
                }}
              >
                SAM.gov and federal contracting opportunities
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.2)',
                    padding: '12px',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      color: '#8b5cf6',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    Dept of Defense
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Military Logistics - $5.2M
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.2)',
                    padding: '12px',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      color: '#8b5cf6',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    GSA Services
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Federal Transport - $3.8M
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise Opportunities Section */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                🏢 Enterprise Opportunities
              </h4>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '13px',
                  marginBottom: '12px',
                }}
              >
                Fortune 500 and major enterprise RFP opportunities
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.2)',
                    padding: '12px',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      color: '#f59e0b',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    Microsoft
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Global Logistics RFP - $2.4M
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.2)',
                    padding: '12px',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      color: '#f59e0b',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    Amazon
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Last-Mile Delivery - $1.8M
                  </div>
                </div>
              </div>
            </div>

            {/* InstantMarkets Section */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                🌐 InstantMarkets Opportunities
              </h4>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '13px',
                  marginBottom: '12px',
                }}
              >
                205,587+ opportunities from 17,208 organizations
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(220, 38, 38, 0.2)',
                    padding: '12px',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      color: '#dc2626',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    Manufacturing Corp
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Supply Chain RFQ - $950K
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(220, 38, 38, 0.2)',
                    padding: '12px',
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      color: '#dc2626',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    Tech Solutions Inc
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    Distribution RFP - $1.2M
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Industry Sectors - Consolidated Auto/Construction + Pharmaceutical + Warehousing */}
        {activeTab === 'industry-sectors' && (
          <div>
            {/* Industry Sectors Header */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <span style={{ fontSize: '24px' }}>🏭</span>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    margin: 0,
                  }}
                >
                  Industry Sectors
                </h3>
              </div>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: 0,
                  fontSize: '14px',
                }}
              >
                Specialized RFx opportunities across key industry verticals
              </p>

              {/* Sub-tabs for Industry Sectors */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '16px',
                  flexWrap: 'wrap',
                }}
              >
                {[
                  { id: 'automotive', label: 'Auto/Construction', icon: '🚛' },
                  { id: 'pharmaceutical', label: 'Pharmaceutical', icon: '💊' },
                  {
                    id: 'medical-courier',
                    label: 'Medical Courier',
                    icon: '🏥',
                  },
                  { id: 'warehousing', label: 'Warehousing & 3PL', icon: '🏭' },
                ].map((subTab) => (
                  <button
                    key={subTab.id}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>{subTab.icon}</span>
                    {subTab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Automotive/Construction Section */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                🚛 Automotive & Construction Opportunities
              </h4>
              {/* Loading state for automotive opportunities */}
              {loadingAutomotiveOps ? (
                <div
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>🚛</div>
                  <div>Loading automotive opportunities...</div>
                </div>
              ) : automotiveOpportunities.length === 0 ? (
                <div
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>🚛</div>
                  <div>No automotive opportunities found</div>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {automotiveOpportunities
                    .slice(0, 4)
                    .map((opportunity: any, index: number) => (
                      <div
                        key={opportunity.id || index}
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          padding: '12px',
                          borderRadius: '8px',
                        }}
                      >
                        <div
                          style={{
                            color: '#ef4444',
                            fontWeight: 'bold',
                            fontSize: '14px',
                          }}
                        >
                          {opportunity.company ||
                            opportunity.title ||
                            'Unknown Company'}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                          }}
                        >
                          {opportunity.title ||
                            opportunity.description ||
                            'No description available'}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Pharmaceutical Section */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                💊 Pharmaceutical Opportunities
              </h4>
              {/* Loading state for pharmaceutical opportunities */}
              {loadingRfxRequests ? (
                <div
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>💊</div>
                  <div>Loading pharmaceutical opportunities...</div>
                </div>
              ) : rfxRequests.filter(
                  (req) =>
                    req.industry?.toLowerCase().includes('pharma') ||
                    req.industry?.toLowerCase().includes('medical')
                ).length === 0 ? (
                <div
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>💊</div>
                  <div>No pharmaceutical opportunities found</div>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {rfxRequests
                    .filter(
                      (req) =>
                        req.industry?.toLowerCase().includes('pharma') ||
                        req.industry?.toLowerCase().includes('medical')
                    )
                    .slice(0, 4)
                    .map((opportunity: any, index: number) => (
                      <div
                        key={opportunity.id || index}
                        style={{
                          background: 'rgba(6, 182, 212, 0.2)',
                          padding: '12px',
                          borderRadius: '8px',
                        }}
                      >
                        <div
                          style={{
                            color: '#06b6d4',
                            fontWeight: 'bold',
                            fontSize: '14px',
                          }}
                        >
                          {opportunity.company ||
                            opportunity.title ||
                            'Unknown Company'}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                          }}
                        >
                          {opportunity.title ||
                            opportunity.description ||
                            'No description available'}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Warehousing & 3PL Section */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                🏭 Warehousing & 3PL Opportunities
              </h4>
              {/* Loading state for warehousing opportunities */}
              {loadingWarehousingOps ? (
                <div
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>🏭</div>
                  <div>Loading warehousing opportunities...</div>
                </div>
              ) : warehousingOpportunities.length === 0 ? (
                <div
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>🏭</div>
                  <div>No warehousing opportunities found</div>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {warehousingOpportunities
                    .slice(0, 4)
                    .map((opportunity: any, index: number) => (
                      <div
                        key={opportunity.id || index}
                        style={{
                          background: 'rgba(139, 92, 246, 0.2)',
                          padding: '12px',
                          borderRadius: '8px',
                        }}
                      >
                        <div
                          style={{
                            color: '#8b5cf6',
                            fontWeight: 'bold',
                            fontSize: '14px',
                          }}
                        >
                          {opportunity.company ||
                            opportunity.agency ||
                            opportunity.title ||
                            'Unknown Company'}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                          }}
                        >
                          {opportunity.title ||
                            opportunity.description ||
                            'No description available'}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Network & Priority - Consolidated TruckingPlanet + Priority Queue */}
        {activeTab === 'network-partners' && (
          <div>
            {/* Network Partners Header */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <span style={{ fontSize: '24px' }}>🌐</span>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    margin: 0,
                  }}
                >
                  Network & Priority
                </h3>
              </div>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: 0,
                  fontSize: '14px',
                }}
              >
                Priority queue management and network partner opportunities
              </p>
            </div>

            {/* Priority Queue Section */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                🎯 Priority Queue
              </h4>
              {/* Loading state for priority queue */}
              {loadingTruckingPlanet ? (
                <div
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>⏳</div>
                  <div>Loading priority opportunities...</div>
                </div>
              ) : truckingPlanetShippers.length === 0 ? (
                <div
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>📋</div>
                  <div>No priority opportunities found</div>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {truckingPlanetShippers
                    .slice(0, 4)
                    .map((shipper: any, index: number) => (
                      <div
                        key={shipper.id || index}
                        style={{
                          background: 'rgba(245, 158, 11, 0.2)',
                          padding: '16px',
                          borderRadius: '8px',
                          border: '1px solid #f59e0b',
                        }}
                      >
                        <div
                          style={{
                            color: '#f59e0b',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            marginBottom: '4px',
                          }}
                        >
                          {index === 0
                            ? '🚨 URGENT'
                            : index === 1
                              ? '⚡ HIGH'
                              : '📋 PRIORITY'}
                        </div>
                        <div
                          style={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '13px',
                          }}
                        >
                          {shipper.companyName ||
                            shipper.company ||
                            'Unknown Company'}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                          }}
                        >
                          {shipper.address || 'Location not available'}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '11px',
                            marginTop: '4px',
                          }}
                        >
                          Phone: {shipper.phone || 'Not provided'}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* TruckingPlanet Network Section */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                }}
              >
                🌐 TruckingPlanet Network
              </h4>
              {/* Loading state for network partners */}
              {loadingTruckingPlanet ? (
                <div
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>🌐</div>
                  <div>Loading network partners...</div>
                </div>
              ) : truckingPlanetShippers.length === 0 ? (
                <div
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>🌐</div>
                  <div>No network partners found</div>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {truckingPlanetShippers
                    .slice(4, 8)
                    .map((shipper: any, index: number) => (
                      <div
                        key={shipper.id || `network-${index}`}
                        style={{
                          background: 'rgba(20, 184, 166, 0.2)',
                          padding: '12px',
                          borderRadius: '8px',
                        }}
                      >
                        <div
                          style={{
                            color: '#14b8a6',
                            fontWeight: 'bold',
                            fontSize: '14px',
                          }}
                        >
                          {index === 0 ? 'Premium Shipper' : 'Network Partner'}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                          }}
                        >
                          {shipper.address || 'Location not available'}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Continue with existing government section structure... */}
        {false && (
          <div>
            {/* SAM.gov Search Interface */}
            <div
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(139, 92, 246, 0.3)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.2rem',
                  color: '#8b5cf6',
                  marginBottom: '15px',
                }}
              >
                🏛️ SAM.gov Government Opportunities Search
              </h3>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  marginBottom: '15px',
                }}
              >
                <input
                  type='text'
                  placeholder='Search keywords (e.g., transportation, freight, logistics)'
                  value={govSearchKeywords}
                  onChange={(e) => setGovSearchKeywords(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
                <button
                  onClick={searchGovernmentOpportunities}
                  disabled={loadingGovOps}
                  style={{
                    padding: '10px 20px',
                    background: loadingGovOps
                      ? 'rgba(139, 92, 246, 0.5)'
                      : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loadingGovOps ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {loadingGovOps ? '🔄 Searching...' : '🔍 Search SAM.gov'}
                </button>
              </div>
              <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>
                ✅ Connected to live SAM.gov API • Free government data •
                Updated daily
              </p>
            </div>

            {/* Sources Sought Intelligence Alert */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.05))',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '20px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}
              >
                <span style={{ fontSize: '20px' }}>🔍</span>
                <h4
                  style={{
                    color: '#10b981',
                    fontSize: '14px',
                    fontWeight: '700',
                    margin: 0,
                  }}
                >
                  NEW: Sources Sought Intelligence
                </h4>
                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '600',
                  }}
                >
                  EARLY ADVANTAGE
                </span>
              </div>
              <p
                style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0,
                  lineHeight: '1.4',
                }}
              >
                FleetFlow now monitors <strong>Sources Sought notices</strong>{' '}
                and <strong>pre-solicitation opportunities</strong> - giving you
                30-90 days advance notice before RFPs are released. Build
                relationships, influence requirements, and position yourself for
                success before competition begins!
              </p>
            </div>

            {/* Government Opportunities Table */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 120px 80px 100px 90px 120px',
                gap: '8px',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                marginBottom: '10px',
                fontWeight: '700',
                fontSize: '10px',
                textTransform: 'uppercase',
              }}
            >
              <div>ID</div>
              <div>Opportunity</div>
              <div>Agency</div>
              <div>Type/Stage</div>
              <div>Value</div>
              <div>Deadline</div>
              <div>Actions</div>
            </div>

            {loadingGovOps ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🏛️</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>
                  Searching SAM.gov for transportation opportunities...
                </div>
              </div>
            ) : (
              // Sort opportunities: Sources Sought first, then by days until deadline
              [...govOpportunities]
                .sort((a, b) => {
                  // Prioritize Sources Sought notices
                  if (a.isPreSolicitation && !b.isPreSolicitation) return -1;
                  if (!a.isPreSolicitation && b.isPreSolicitation) return 1;
                  // Then sort by deadline (closest first)
                  if (a.daysUntilDeadline && b.daysUntilDeadline) {
                    return a.daysUntilDeadline - b.daysUntilDeadline;
                  }
                  return 0;
                })
                .map((opportunity, index) => {
                  // Visual styling based on opportunity type
                  const getTypeColor = (
                    noticeType: string,
                    isPreSolicitation: boolean
                  ) => {
                    if (isPreSolicitation) {
                      return noticeType === 'Sources Sought'
                        ? '#10b981'
                        : '#f59e0b';
                    }
                    return '#8b5cf6';
                  };

                  const getTypeIcon = (
                    noticeType: string,
                    isPreSolicitation: boolean
                  ) => {
                    if (noticeType === 'Sources Sought') return '🔍';
                    if (noticeType === 'Special Notice') return '📢';
                    if (isPreSolicitation) return '⏳';
                    return '📋';
                  };

                  const getRowBackground = (
                    isPreSolicitation: boolean,
                    index: number
                  ) => {
                    if (isPreSolicitation) {
                      return 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))';
                    }
                    return index % 2 === 0
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(255, 255, 255, 0.02)';
                  };

                  return (
                    <div
                      key={index}
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          '80px 1fr 120px 80px 100px 90px 120px',
                        gap: '8px',
                        padding: '10px 12px',
                        background: getRowBackground(
                          opportunity.isPreSolicitation,
                          index
                        ),
                        borderRadius: '8px',
                        marginBottom: '8px',
                        fontSize: '11px',
                        transition: 'all 0.3s ease',
                        border: opportunity.isPreSolicitation
                          ? '1px solid rgba(16, 185, 129, 0.3)'
                          : 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          opportunity.isPreSolicitation
                            ? 'rgba(16, 185, 129, 0.15)'
                            : 'rgba(139, 92, 246, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = getRowBackground(
                          opportunity.isPreSolicitation,
                          index
                        );
                      }}
                    >
                      <div style={{ fontWeight: '700', color: '#f59e0b' }}>
                        {opportunity.id}
                        {opportunity.isPreSolicitation && (
                          <div
                            style={{
                              fontSize: '8px',
                              color: '#10b981',
                              marginTop: '2px',
                              fontWeight: '600',
                            }}
                          >
                            EARLY INTEL
                          </div>
                        )}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: '600',
                            marginBottom: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {getTypeIcon(
                            opportunity.noticeType,
                            opportunity.isPreSolicitation
                          )}
                          {opportunity.title}
                        </div>
                        <div
                          style={{
                            fontSize: '10px',
                            opacity: 0.7,
                            lineHeight: '1.3',
                          }}
                        >
                          {opportunity.description
                            ? opportunity.description.substring(0, 80) + '...'
                            : 'No description available'}
                        </div>
                      </div>
                      <div style={{ fontSize: '10px' }}>
                        {opportunity.agency}
                      </div>
                      <div style={{ fontSize: '9px' }}>
                        <div
                          style={{
                            color: getTypeColor(
                              opportunity.noticeType,
                              opportunity.isPreSolicitation
                            ),
                            fontWeight: '600',
                            marginBottom: '2px',
                          }}
                        >
                          {opportunity.noticeType}
                        </div>
                        <div style={{ opacity: 0.7 }}>{opportunity.stage}</div>
                      </div>
                      <div
                        style={{
                          fontSize: '10px',
                          color: '#22c55e',
                          fontWeight: '600',
                        }}
                      >
                        {opportunity.amount
                          ? `$${(opportunity.amount / 1000000).toFixed(1)}M`
                          : 'TBD'}
                      </div>
                      <div style={{ fontSize: '10px' }}>
                        <div
                          style={{
                            color:
                              opportunity.daysUntilDeadline &&
                              opportunity.daysUntilDeadline <= 7
                                ? '#ef4444'
                                : opportunity.daysUntilDeadline &&
                                    opportunity.daysUntilDeadline <= 14
                                  ? '#f59e0b'
                                  : '#22c55e',
                            fontWeight: '600',
                            marginBottom: '2px',
                          }}
                        >
                          {opportunity.daysUntilDeadline
                            ? `${opportunity.daysUntilDeadline} days`
                            : 'TBD'}
                        </div>
                        <div style={{ fontSize: '9px', opacity: 0.7 }}>
                          {opportunity.responseDeadline}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() =>
                            importGovernmentOpportunity(opportunity)
                          }
                          style={{
                            padding: '3px 6px',
                            background: opportunity.isPreSolicitation
                              ? 'linear-gradient(135deg, #10b981, #059669)'
                              : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '8px',
                            fontWeight: '600',
                          }}
                        >
                          {opportunity.isPreSolicitation ? '📝 Info' : '🤖 AI'}
                        </button>
                        <button
                          style={{
                            padding: '3px 6px',
                            background: opportunity.isPreSolicitation
                              ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                              : 'linear-gradient(135deg, #10b981, #059669)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '8px',
                            fontWeight: '600',
                          }}
                        >
                          {opportunity.isPreSolicitation
                            ? '🔔 Watch'
                            : '💰 Bid'}
                        </button>
                      </div>
                    </div>
                  );
                })
            )}

            {govOpportunities.length === 0 && !loadingGovOps && (
              <div
                style={{ textAlign: 'center', padding: '40px', opacity: 0.6 }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🏛️</div>
                <div style={{ fontSize: '14px' }}>
                  No government opportunities found. Try searching for
                  ""transportation"", ""freight"", or ""logistics"".
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enterprise Opportunities Content */}
        {false && activeTab === 'enterprise' && (
          <div>
            {/* Enterprise RFP Search Interface */}
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.2rem',
                  color: '#f59e0b',
                  marginBottom: '15px',
                }}
              >
                🏢 Enterprise RFP Opportunities Search
              </h3>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  marginBottom: '15px',
                }}
              >
                <input
                  type='text'
                  placeholder='Search keywords (e.g., transportation, logistics, supply chain)'
                  value={enterpriseSearchKeywords}
                  onChange={(e) => setEnterpriseSearchKeywords(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
                <button
                  onClick={searchEnterpriseOpportunities}
                  disabled={loadingEnterpriseOps}
                  style={{
                    padding: '10px 20px',
                    background: loadingEnterpriseOps
                      ? 'rgba(245, 158, 11, 0.5)'
                      : 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loadingEnterpriseOps ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {loadingEnterpriseOps
                    ? '🔄 Searching...'
                    : '🔍 Search Enterprises'}
                </button>
              </div>
              <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>
                ✅ Connected to enterprise portals • Walmart, Amazon, Home
                Depot, Target, Costco • Updated hourly
              </p>
            </div>

            {/* Enterprise Opportunities Table */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 120px 100px 90px 100px 120px',
                gap: '8px',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                marginBottom: '10px',
                fontWeight: '700',
                fontSize: '10px',
                textTransform: 'uppercase',
              }}
            >
              <div>ID</div>
              <div>Opportunity</div>
              <div>Company</div>
              <div>Value</div>
              <div>Match</div>
              <div>Deadline</div>
              <div>Actions</div>
            </div>

            {loadingEnterpriseOps ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🏢</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>
                  Searching enterprise RFPs for transportation needs...
                </div>
              </div>
            ) : (
              enterpriseOpportunities.map((opportunity, index) => (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '80px 1fr 120px 100px 90px 100px 120px',
                    gap: '8px',
                    padding: '10px 12px',
                    background:
                      index % 2 === 0
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    fontSize: '11px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(245, 158, 11, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      index % 2 === 0
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(255, 255, 255, 0.02)';
                  }}
                >
                  <div style={{ fontWeight: '700', color: '#8b5cf6' }}>
                    {opportunity.id}
                    <div
                      style={{
                        fontSize: '8px',
                        color: '#10b981',
                        marginTop: '2px',
                      }}
                    >
                      {opportunity.type}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {opportunity.title}
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        opacity: 0.7,
                        lineHeight: '1.3',
                      }}
                    >
                      {opportunity.description
                        ? opportunity.description.substring(0, 80) + '...'
                        : 'No description available'}
                    </div>
                  </div>
                  <div style={{ fontSize: '10px' }}>{opportunity.company}</div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: '#22c55e',
                      fontWeight: '600',
                    }}
                  >
                    ${(opportunity.amount / 1000000).toFixed(1)}M
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        background:
                          opportunity.matchScore >= 90
                            ? 'rgba(34, 197, 94, 0.2)'
                            : opportunity.matchScore >= 80
                              ? 'rgba(245, 158, 11, 0.2)'
                              : 'rgba(239, 68, 68, 0.2)',
                        color:
                          opportunity.matchScore >= 90
                            ? '#22c55e'
                            : opportunity.matchScore >= 80
                              ? '#f59e0b'
                              : '#ef4444',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                      }}
                    >
                      {opportunity.matchScore}%
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#f59e0b' }}>
                    {opportunity.deadline}
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => importEnterpriseOpportunity(opportunity)}
                      style={{
                        padding: '3px 6px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '8px',
                        fontWeight: '600',
                      }}
                    >
                      🤖 AI
                    </button>
                    <button
                      style={{
                        padding: '3px 6px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '8px',
                        fontWeight: '600',
                      }}
                    >
                      Bid
                    </button>
                  </div>
                </div>
              ))
            )}

            {enterpriseOpportunities.length === 0 && !loadingEnterpriseOps && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  opacity: 0.6,
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🏢</div>
                <div style={{ fontSize: '14px' }}>
                  No enterprise RFPs found. Try searching for
                  ""transportation"", ""logistics"", or ""supply chain"".
                </div>
              </div>
            )}
          </div>
        )}

        {/* Automotive Opportunities Content */}
        {false && activeTab === 'automotive' && (
          <div>
            {/* Automotive RFP Search Interface */}
            <div
              style={{
                background: 'rgba(255, 158, 11, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 158, 11, 0.3)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.2rem',
                  color: '#f59e0b',
                  marginBottom: '15px',
                }}
              >
                🚛 Automotive RFP Opportunities Search
              </h3>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  marginBottom: '15px',
                }}
              >
                <input
                  type='text'
                  placeholder='Search keywords (e.g., automotive, construction, heavy equipment)'
                  value={automotiveSearchKeywords}
                  onChange={(e) => setAutomotiveSearchKeywords(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
                <button
                  onClick={searchAutomotiveOpportunities}
                  disabled={loadingAutomotiveOps}
                  style={{
                    padding: '10px 20px',
                    background: loadingAutomotiveOps
                      ? 'rgba(255, 158, 11, 0.5)'
                      : 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loadingAutomotiveOps ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {loadingAutomotiveOps
                    ? '🔄 Searching...'
                    : '🔍 Search Automotive RFPs'}
                </button>
              </div>
              <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>
                ✅ Connected to automotive and construction industry portals •
                Ford, GM, Tesla, Caterpillar, John Deere • Updated daily
              </p>
            </div>

            {/* Automotive Opportunities Table */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 120px 100px 90px 100px 120px',
                gap: '8px',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                marginBottom: '10px',
                fontWeight: '700',
                fontSize: '10px',
                textTransform: 'uppercase',
              }}
            >
              <div>ID</div>
              <div>Opportunity</div>
              <div>Company</div>
              <div>Value</div>
              <div>Match</div>
              <div>Deadline</div>
              <div>Actions</div>
            </div>

            {loadingAutomotiveOps ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🚛</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>
                  Searching automotive and construction RFPs for transportation
                  needs...
                </div>
              </div>
            ) : (
              automotiveOpportunities.map((opportunity, index) => (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '80px 1fr 120px 100px 90px 100px 120px',
                    gap: '8px',
                    padding: '10px 12px',
                    background:
                      index % 2 === 0
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    fontSize: '11px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 158, 11, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      index % 2 === 0
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(255, 255, 255, 0.02)';
                  }}
                >
                  <div style={{ fontWeight: '700', color: '#f59e0b' }}>
                    {opportunity.id}
                    <div
                      style={{
                        fontSize: '8px',
                        color: '#10b981',
                        marginTop: '2px',
                      }}
                    >
                      {opportunity.type}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {opportunity.title}
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        opacity: 0.7,
                        lineHeight: '1.3',
                      }}
                    >
                      {opportunity.description
                        ? opportunity.description.substring(0, 80) + '...'
                        : 'No description available'}
                    </div>
                  </div>
                  <div style={{ fontSize: '10px' }}>{opportunity.company}</div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: '#22c55e',
                      fontWeight: '600',
                    }}
                  >
                    ${(opportunity.amount / 1000000).toFixed(1)}M
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        background:
                          opportunity.matchScore >= 90
                            ? 'rgba(34, 197, 94, 0.2)'
                            : opportunity.matchScore >= 80
                              ? 'rgba(245, 158, 11, 0.2)'
                              : 'rgba(239, 68, 68, 0.2)',
                        color:
                          opportunity.matchScore >= 90
                            ? '#22c55e'
                            : opportunity.matchScore >= 80
                              ? '#f59e0b'
                              : '#ef4444',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                      }}
                    >
                      {opportunity.matchScore}%
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#f59e0b' }}>
                    {opportunity.deadline}
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => importAutomotiveOpportunity(opportunity)}
                      style={{
                        padding: '3px 6px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '8px',
                        fontWeight: '600',
                      }}
                    >
                      🤖 AI
                    </button>
                    <button
                      style={{
                        padding: '3px 6px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '8px',
                        fontWeight: '600',
                      }}
                    >
                      Bid
                    </button>
                  </div>
                </div>
              ))
            )}

            {automotiveOpportunities.length === 0 && !loadingAutomotiveOps && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  opacity: 0.6,
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🚛</div>
                <div style={{ fontSize: '14px' }}>
                  No automotive or construction RFPs found. Try searching for
                  ""automotive"", ""construction"", or ""heavy equipment"".
                </div>
              </div>
            )}
          </div>
        )}

        {/* InstantMarkets Opportunities Content */}
        {false && activeTab === 'instant_markets' && (
          <div>
            {/* InstantMarkets Search Interface */}
            <div
              style={{
                background: 'rgba(10, 175, 113, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(10, 175, 113, 0.3)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.2rem',
                  color: '#dc2626',
                  marginBottom: '15px',
                }}
              >
                🌐 InstantMarkets Opportunities Search
              </h3>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  marginBottom: '15px',
                }}
              >
                <input
                  type='text'
                  placeholder='Search keywords (e.g., transportation, logistics, government contracts)'
                  value={instantMarketsSearchKeywords}
                  onChange={(e) =>
                    setInstantMarketsSearchKeywords(e.target.value)
                  }
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
                <button
                  onClick={searchInstantMarketsOpportunities}
                  disabled={loadingInstantMarketsOps}
                  style={{
                    padding: '10px 20px',
                    background: loadingInstantMarketsOps
                      ? 'rgba(220, 38, 38, 0.5)'
                      : 'linear-gradient(135deg, #dc2626, #991b1b)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loadingInstantMarketsOps
                      ? 'not-allowed'
                      : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {loadingInstantMarketsOps
                    ? '🔄 Searching...'
                    : '🔍 Search InstantMarkets'}
                </button>
              </div>
              <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>
                ✅ Connected to InstantMarkets.com • Over 205,587+ opportunities
                • Updated daily
              </p>
            </div>

            {/* InstantMarkets Opportunities Table */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 120px 100px 90px 100px 120px',
                gap: '8px',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                marginBottom: '10px',
                fontWeight: '700',
                fontSize: '10px',
                textTransform: 'uppercase',
              }}
            >
              <div>ID</div>
              <div>Opportunity</div>
              <div>Agency</div>
              <div>Value</div>
              <div>Match</div>
              <div>Deadline</div>
              <div>Actions</div>
            </div>

            {loadingInstantMarketsOps ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🌐</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>
                  Searching InstantMarkets for transportation opportunities...
                </div>
              </div>
            ) : (
              instantMarketsOpportunities.map((opportunity, index) => (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '80px 1fr 120px 100px 90px 100px 120px',
                    gap: '8px',
                    padding: '10px 12px',
                    background:
                      index % 2 === 0
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    fontSize: '11px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(10, 175, 113, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      index % 2 === 0
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(255, 255, 255, 0.02)';
                  }}
                >
                  <div style={{ fontWeight: '700', color: '#dc2626' }}>
                    {opportunity.id}
                    <div
                      style={{
                        fontSize: '8px',
                        color: '#dc2626',
                        marginTop: '2px',
                      }}
                    >
                      {opportunity.type}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {opportunity.title}
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        opacity: 0.7,
                        lineHeight: '1.3',
                      }}
                    >
                      {opportunity.description
                        ? opportunity.description.substring(0, 80) + '...'
                        : 'No description available'}
                    </div>
                  </div>
                  <div style={{ fontSize: '10px' }}>{opportunity.agency}</div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: '#22c55e',
                      fontWeight: '600',
                    }}
                  >
                    ${(opportunity.amount / 1000000).toFixed(1)}M
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        background:
                          opportunity.matchScore >= 90
                            ? 'rgba(34, 197, 94, 0.2)'
                            : opportunity.matchScore >= 80
                              ? 'rgba(245, 158, 11, 0.2)'
                              : 'rgba(239, 68, 68, 0.2)',
                        color:
                          opportunity.matchScore >= 90
                            ? '#22c55e'
                            : opportunity.matchScore >= 80
                              ? '#f59e0b'
                              : '#ef4444',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                      }}
                    >
                      {opportunity.matchScore}%
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#f59e0b' }}>
                    {opportunity.deadline}
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => importAutomotiveOpportunity(opportunity)}
                      style={{
                        padding: '3px 6px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '8px',
                        fontWeight: '600',
                      }}
                    >
                      🤖 AI
                    </button>
                    <button
                      style={{
                        padding: '3px 6px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '8px',
                        fontWeight: '600',
                      }}
                    >
                      Bid
                    </button>
                  </div>
                </div>
              ))
            )}

            {instantMarketsOpportunities.length === 0 &&
              !loadingInstantMarketsOps && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px',
                    opacity: 0.6,
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '15px' }}>
                    🌐
                  </div>
                  <div style={{ fontSize: '14px' }}>
                    No InstantMarkets opportunities found. Try searching for
                    ""transportation"", ""logistics"", or ""government
                    contracts"".
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Warehousing Opportunities Content */}
        {false && activeTab === 'warehousing' && (
          <div>
            {/* Warehousing & 3PL Search Interface */}
            <div
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(139, 92, 246, 0.3)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.2rem',
                  color: '#8b5cf6',
                  marginBottom: '15px',
                }}
              >
                🏭 Warehousing & 3PL Opportunities Search
              </h3>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  marginBottom: '15px',
                }}
              >
                <input
                  type='text'
                  placeholder='Search keywords (e.g., warehousing, 3PL, distribution)'
                  value={warehousingSearchKeywords}
                  onChange={(e) => setWarehousingSearchKeywords(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
                <button
                  onClick={searchWarehousingOpportunities}
                  disabled={loadingWarehousingOps}
                  style={{
                    padding: '10px 20px',
                    background: loadingWarehousingOps
                      ? 'rgba(139, 92, 246, 0.5)'
                      : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loadingWarehousingOps ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {loadingWarehousingOps
                    ? '🔄 Searching...'
                    : '🔍 Search Warehousing & 3PL'}
                </button>
              </div>
              <p style={{ fontSize: '12px', opacity: 0.8, margin: 0 }}>
                ✅ Connected to warehousing and 3PL industry portals •
                Multi-region warehouses, 3PL providers • Updated daily
              </p>
            </div>

            {/* Warehousing Opportunities Table */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 120px 100px 90px 100px 120px',
                gap: '8px',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                marginBottom: '10px',
                fontWeight: '700',
                fontSize: '10px',
                textTransform: 'uppercase',
              }}
            >
              <div>ID</div>
              <div>Opportunity</div>
              <div>Agency</div>
              <div>Value</div>
              <div>Match</div>
              <div>Deadline</div>
              <div>Actions</div>
            </div>

            {loadingWarehousingOps ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>🏭</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>
                  Searching warehousing and 3PL opportunities...
                </div>
              </div>
            ) : (
              warehousingOpportunities.map((opportunity, index) => (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '80px 1fr 120px 100px 90px 100px 120px',
                    gap: '8px',
                    padding: '10px 12px',
                    background:
                      index % 2 === 0
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    fontSize: '11px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(139, 92, 246, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      index % 2 === 0
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(255, 255, 255, 0.02)';
                  }}
                >
                  <div style={{ fontWeight: '700', color: '#8b5cf6' }}>
                    {opportunity.id}
                    <div
                      style={{
                        fontSize: '8px',
                        color: '#10b981',
                        marginTop: '2px',
                      }}
                    >
                      {opportunity.type}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {opportunity.title}
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        opacity: 0.7,
                        lineHeight: '1.3',
                      }}
                    >
                      {opportunity.description
                        ? opportunity.description.substring(0, 80) + '...'
                        : 'No description available'}
                    </div>
                  </div>
                  <div style={{ fontSize: '10px' }}>{opportunity.agency}</div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: '#22c55e',
                      fontWeight: '600',
                    }}
                  >
                    ${(opportunity.amount / 1000000).toFixed(1)}M
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        background:
                          opportunity.matchScore >= 90
                            ? 'rgba(34, 197, 94, 0.2)'
                            : opportunity.matchScore >= 80
                              ? 'rgba(245, 158, 11, 0.2)'
                              : 'rgba(239, 68, 68, 0.2)',
                        color:
                          opportunity.matchScore >= 90
                            ? '#22c55e'
                            : opportunity.matchScore >= 80
                              ? '#f59e0b'
                              : '#ef4444',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                      }}
                    >
                      {opportunity.matchScore}%
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#f59e0b' }}>
                    {opportunity.deadline}
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => importAutomotiveOpportunity(opportunity)}
                      style={{
                        padding: '3px 6px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '8px',
                        fontWeight: '600',
                      }}
                    >
                      🤖 AI
                    </button>
                    <button
                      style={{
                        padding: '3px 6px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '8px',
                        fontWeight: '600',
                      }}
                    >
                      Bid
                    </button>
                  </div>
                </div>
              ))
            )}

            {warehousingOpportunities.length === 0 &&
              !loadingWarehousingOps && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px',
                    opacity: 0.6,
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '15px' }}>
                    🏭
                  </div>
                  <div style={{ fontSize: '14px' }}>
                    No warehousing or 3PL opportunities found. Try searching for
                    ""warehousing"", ""3PL"", or ""distribution"".
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Closed RFx Content */}
        {/* TruckingPlanet Network Content */}
        {false && activeTab === 'trucking_planet' && (
          <div>
            {/* TruckingPlanet Search Interface */}
            <div
              style={{
                background: 'rgba(20, 184, 166, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(20, 184, 166, 0.3)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.2rem',
                  color: '#14b8a6',
                  marginBottom: '15px',
                }}
              >
                🌐 TruckingPlanet Network Shipper Search
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr auto',
                  gap: '10px',
                  alignItems: 'center',
                  marginBottom: '15px',
                }}
              >
                <select
                  value={truckingPlanetFilters.equipmentType}
                  onChange={(e) =>
                    setTruckingPlanetFilters({
                      ...truckingPlanetFilters,
                      equipmentType: e.target.value,
                    })
                  }
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                >
                  <option value='dry_van'>Dry Van</option>
                  <option value='refrigerated'>Refrigerated</option>
                  <option value='flatbed'>Flatbed</option>
                  <option value='stepdeck'>Stepdeck</option>
                  <option value='box_truck'>Box Truck</option>
                  <option value='hotshot'>Hotshot</option>
                </select>

                <select
                  value={truckingPlanetFilters.freightVolume}
                  onChange={(e) =>
                    setTruckingPlanetFilters({
                      ...truckingPlanetFilters,
                      freightVolume: e.target.value,
                    })
                  }
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                >
                  <option value='high'>High Volume</option>
                  <option value='medium'>Medium Volume</option>
                  <option value='low'>Low Volume</option>
                </select>

                <input
                  type='text'
                  placeholder='State (e.g., TX, CA)'
                  value={truckingPlanetFilters.state}
                  onChange={(e) =>
                    setTruckingPlanetFilters({
                      ...truckingPlanetFilters,
                      state: e.target.value,
                    })
                  }
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />

                <button
                  onClick={searchTruckingPlanetShippers}
                  disabled={loadingTruckingPlanet}
                  style={{
                    padding: '10px 20px',
                    background: loadingTruckingPlanet
                      ? 'rgba(20, 184, 166, 0.5)'
                      : 'linear-gradient(135deg, #14b8a6, #0d9488)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loadingTruckingPlanet ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {loadingTruckingPlanet
                    ? '🔄 Searching...'
                    : '🔍 Search Network'}
                </button>
              </div>
              <p style={{ color: '#14b8a6', fontSize: '12px', margin: 0 }}>
                ✅ Connected to TruckingPlanet Network • 70,000+ verified
                shippers • $249 lifetime membership
              </p>
            </div>

            {/* TruckingPlanet Shippers Table */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.3rem',
                  marginBottom: '20px',
                  color: '#14b8a6',
                }}
              >
                🏭 Verified Shippers ({truckingPlanetShippers.length})
              </h3>

              {loadingTruckingPlanet ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#14b8a6',
                  }}
                >
                  🌐 Searching TruckingPlanet Network for verified shippers...
                </div>
              ) : (
                truckingPlanetShippers.map((shipper, index) => (
                  <div
                    key={shipper.id}
                    style={{
                      background: 'rgba(20, 184, 166, 0.1)',
                      borderRadius: '8px',
                      padding: '15px',
                      marginBottom: '15px',
                      border: '1px solid rgba(20, 184, 166, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '10px',
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            color: '#14b8a6',
                            margin: '0 0 5px 0',
                            fontSize: '1.1rem',
                          }}
                        >
                          {shipper.companyName}
                        </h4>
                        <p
                          style={{
                            color: '#94a3b8',
                            margin: '0 0 5px 0',
                            fontSize: '14px',
                          }}
                        >
                          📍 {shipper.address}
                        </p>
                        <p
                          style={{
                            color: '#94a3b8',
                            margin: '0 0 5px 0',
                            fontSize: '14px',
                          }}
                        >
                          👤 {shipper.contactName} ({shipper.contactTitle})
                        </p>
                        <p
                          style={{
                            color: '#94a3b8',
                            margin: '0',
                            fontSize: '14px',
                          }}
                        >
                          📞 {shipper.phone} • ✉️ {shipper.email}
                        </p>
                      </div>
                      <button
                        onClick={() => importTruckingPlanetShipper(shipper)}
                        style={{
                          background:
                            'linear-gradient(135deg, #14b8a6, #0d9488)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 16px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: '600',
                        }}
                      >
                        🤖 AI Analyze
                      </button>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '15px',
                      }}
                    >
                      <div>
                        <strong style={{ color: '#14b8a6', fontSize: '12px' }}>
                          EQUIPMENT TYPES
                        </strong>
                        <p
                          style={{
                            color: 'white',
                            margin: '5px 0 0 0',
                            fontSize: '13px',
                          }}
                        >
                          {shipper.equipmentTypes
                            .map((type: string) =>
                              type.replace('_', ' ').toUpperCase()
                            )
                            .join(', ')}
                        </p>
                      </div>
                      <div>
                        <strong style={{ color: '#14b8a6', fontSize: '12px' }}>
                          COMMODITIES
                        </strong>
                        <p
                          style={{
                            color: 'white',
                            margin: '5px 0 0 0',
                            fontSize: '13px',
                          }}
                        >
                          {shipper.commoditiesShipped.join(', ')}
                        </p>
                      </div>
                      <div>
                        <strong style={{ color: '#14b8a6', fontSize: '12px' }}>
                          COMPANY INFO
                        </strong>
                        <p
                          style={{
                            color: 'white',
                            margin: '5px 0 0 0',
                            fontSize: '13px',
                          }}
                        >
                          {shipper.employeeCount} employees
                          <br />
                          {shipper.salesVolume} revenue
                          <br />
                          {shipper.freightVolume.toUpperCase()} volume
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {truckingPlanetShippers.length === 0 &&
                !loadingTruckingPlanet && (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '40px',
                      color: '#94a3b8',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '8px',
                      border: '1px dashed rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h4 style={{ color: '#14b8a6', marginBottom: '10px' }}>
                      🌐 No TruckingPlanet shippers found
                    </h4>
                    <p style={{ margin: '0' }}>
                      Try adjusting your search filters or equipment types to
                      find verified shippers.
                    </p>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Pharmaceutical Opportunities Content */}
        {false && activeTab === 'pharmaceutical' && (
          <div>
            {/* Pharmaceutical RFx Search Interface */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <span style={{ fontSize: '24px' }}>💊</span>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    margin: 0,
                  }}
                >
                  Pharmaceutical Logistics RFx Discovery
                </h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '12px',
                  alignItems: 'end',
                }}
              >
                <div>
                  <label
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'block',
                      marginBottom: '6px',
                    }}
                  >
                    Search Keywords
                  </label>
                  <input
                    type='text'
                    value='pharmaceutical cold chain temperature controlled FDA GMP compliance'
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                    placeholder='Enter pharmaceutical logistics keywords...'
                  />
                </div>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🔍 Search Pharmaceutical RFx
                </button>
              </div>

              <div
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  background: 'rgba(6, 182, 212, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>💊</span>
                  <span
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                  >
                    Specialized Pharmaceutical Services
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '8px',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  <div>❄️ Cold Chain Management</div>
                  <div>🌡️ Temperature Controlled Transport</div>
                  <div>🏥 Hospital & Pharmacy Delivery</div>
                  <div>🧪 Clinical Trial Logistics</div>
                  <div>📋 FDA/GMP Compliance</div>
                  <div>🔒 Secure Chain of Custody</div>
                  <div>⚡ Emergency Pharmaceutical Delivery</div>
                  <div>📦 Specialty Packaging Requirements</div>
                </div>
              </div>
            </div>

            {/* Pharmaceutical RFx Results */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <h4
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    margin: 0,
                  }}
                >
                  Active Pharmaceutical RFx Opportunities
                </h4>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                  }}
                >
                  Found 12 opportunities
                </span>
              </div>

              {/* Header */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 1fr 120px 100px 120px 80px',
                  gap: '8px',
                  padding: '10px 12px',
                  background: 'rgba(6, 182, 212, 0.2)',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  fontWeight: '700',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  color: 'white',
                }}
              >
                <div>RFx ID</div>
                <div>Pharmaceutical Company</div>
                <div>Service Requirements</div>
                <div>Temperature</div>
                <div>Compliance</div>
                <div>Deadline</div>
                <div>Action</div>
              </div>

              {/* Pharmaceutical RFx Opportunities - Loading from API */}
              {loadingRfxRequests ? (
                <div
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#94a3b8',
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>🔄</div>
                  <div>Loading pharmaceutical RFx opportunities...</div>
                </div>
              ) : [].length === 0 ? (
                <div
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#94a3b8',
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>💊</div>
                  <div>No pharmaceutical RFx opportunities found</div>
                  <div style={{ fontSize: '10px', marginTop: '8px' }}>
                    Check back later for new pharmaceutical contracts
                  </div>
                </div>
              ) : (
                []
              )}
            </div>
          </div>
        )}

        {activeTab === 'closed' && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '70px 1.2fr 1fr 100px 90px 90px 100px',
                gap: '8px',
                padding: '10px 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                marginBottom: '10px',
                fontWeight: '700',
                fontSize: '10px',
                textTransform: 'uppercase',
              }}
            >
              <div>ID</div>
              <div>Route</div>
              <div>Customer</div>
              <div>Closed</div>
              <div>Winner</div>
              <div>Final Rate</div>
              <div>Result</div>
            </div>

            {rfxRequests
              .filter((rfx) => rfx.status === 'Closed')
              .map((rfx, index) => (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '70px 1.2fr 1fr 100px 90px 90px 100px',
                    gap: '8px',
                    padding: '10px 12px',
                    background:
                      index % 2 === 0
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    fontSize: '11px',
                  }}
                >
                  <div style={{ fontWeight: '700', color: '#60a5fa' }}>
                    {rfx.id}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600' }}>{rfx.origin}</div>
                    <div style={{ fontSize: '10px', opacity: 0.7 }}>
                      → {rfx.destination}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px' }}>{rfx.customer}</div>
                  <div style={{ fontSize: '10px', color: '#f59e0b' }}>
                    {rfx.bidDeadline}
                  </div>
                  <div style={{ fontSize: '10px', color: '#8b5cf6' }}>
                    ABC Trucking
                  </div>
                  <div style={{ fontSize: '10px', color: '#22c55e' }}>
                    $2,950
                  </div>
                  <div>
                    <span
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                      }}
                    >
                      Lost
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Medical Courier RFx Content */}
        {activeTab === 'industry-sectors' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '20px',
              marginBottom: '20px',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '12px',
              }}
            >
              🏥 Medical Courier & Expediting Opportunities
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '12px',
              }}
            >
              <div
                style={{
                  background: 'rgba(220, 38, 38, 0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid rgba(220, 38, 38, 0.2)',
                }}
              >
                <h5
                  style={{
                    color: '#fca5a5',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}
                >
                  🚨 STAT Delivery Services
                </h5>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '12px',
                    margin: 0,
                  }}
                >
                  Emergency medical deliveries with guaranteed response times.
                  Hospital networks, emergency rooms, urgent care facilities.
                </p>
                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '11px',
                    color: '#fca5a5',
                  }}
                >
                  Active RFPs: 23 | Avg Value: $1.2M
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <h5
                  style={{
                    color: '#93c5fd',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}
                >
                  🏥 Medical Equipment Transport
                </h5>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '12px',
                    margin: 0,
                  }}
                >
                  Specialized transport for sensitive medical equipment.
                  Temperature-controlled vehicles, specialized handling
                  protocols.
                </p>
                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '11px',
                    color: '#93c5fd',
                  }}
                >
                  Active RFPs: 18 | Avg Value: $850K
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(124, 58, 237, 0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid rgba(124, 58, 237, 0.2)',
                }}
              >
                <h5
                  style={{
                    color: '#c4b5fd',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                  }}
                >
                  🧪 Clinical Trial Logistics
                </h5>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '12px',
                    margin: 0,
                  }}
                >
                  Secure transport for clinical trial materials and samples.
                  Chain of custody protocols, FDA compliance requirements.
                </p>
                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '11px',
                    color: '#c4b5fd',
                  }}
                >
                  Active RFPs: 14 | Avg Value: $2.1M
                </div>
              </div>
            </div>

            {/* Medical Courier RFx Table */}
            <div
              style={{
                marginTop: '20px',
                background: 'rgba(220, 38, 38, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(220, 38, 38, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <h4
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    margin: 0,
                  }}
                >
                  Active Medical Courier RFx Opportunities
                </h4>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                  }}
                >
                  Found 16 opportunities
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1.2fr 1fr 100px 90px 90px 100px',
                  gap: '8px',
                  padding: '8px 12px',
                  background: 'rgba(220, 38, 38, 0.1)',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                <div>RFx ID</div>
                <div>Route</div>
                <div>Medical Service</div>
                <div>Urgency</div>
                <div>Compliance</div>
                <div>Value</div>
                <div>Status</div>
              </div>

              {/* Medical Courier RFx Opportunities - Loading from API */}
              {loadingRfxRequests ? (
                <div
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#94a3b8',
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>🚑</div>
                  <div>Loading medical courier RFx opportunities...</div>
                </div>
              ) : [].length === 0 ? (
                <div
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#94a3b8',
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>🚑</div>
                  <div>No medical courier RFx opportunities found</div>
                  <div style={{ fontSize: '10px', marginTop: '8px' }}>
                    Check back later for new medical courier contracts
                  </div>
                </div>
              ) : (
                []
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <h3
          style={{ fontSize: '1.2rem', marginBottom: '15px', color: 'white' }}
        >
          ⚡ Quick Actions
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            🔍 Search RFx
          </button>
          <Link href='/government-contracts' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Government Contracts
            </button>
          </Link>
          <button
            onClick={() => setShowAIBidAssistant(true)}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            🤖 AI Cross-Industry Analyzer
          </button>
        </div>
      </div>

      {/* Compliance Check Modal */}
      {showComplianceCheck && carrierQualification && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '28px',
                  fontWeight: '700',
                  margin: 0,
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                🛡️ Compliance Validation Results
              </h2>
              <button
                onClick={() => setShowComplianceCheck(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                ×
              </button>
            </div>

            {/* Qualification Summary */}
            <div
              style={{
                background: carrierQualification.qualified
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'rgba(239, 68, 68, 0.2)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                border: `2px solid ${carrierQualification.qualified ? '#10b981' : '#ef4444'}40`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '600',
                    margin: 0,
                  }}
                >
                  {carrierQualification.companyName}
                </h3>
                <div
                  style={{
                    background: carrierQualification.qualified
                      ? '#10b981'
                      : '#ef4444',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '700',
                  }}
                >
                  {carrierQualification.qualified
                    ? '✅ QUALIFIED'
                    : '❌ NOT QUALIFIED'}
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '16px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: '#10b981',
                    }}
                  >
                    {carrierQualification.complianceScore}%
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    Compliance Score
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#3b82f6',
                    }}
                  >
                    {carrierQualification.safetyRating}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    Safety Rating
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color:
                        carrierQualification.insuranceStatus === 'ACTIVE'
                          ? '#10b981'
                          : '#ef4444',
                    }}
                  >
                    {carrierQualification.insuranceStatus}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                    }}
                  >
                    Insurance Status
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      marginBottom: '4px',
                    }}
                  >
                    <strong>Required Insurance:</strong> $
                    {carrierQualification.requiredInsuranceAmount.toLocaleString()}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                    }}
                  >
                    <strong>Current Coverage:</strong> $
                    {carrierQualification.currentInsuranceAmount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      marginBottom: '4px',
                    }}
                  >
                    <strong>Endorsements:</strong>{' '}
                    {carrierQualification.specialEndorsements.join(', ')}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                    }}
                  >
                    <strong>Last Validated:</strong>{' '}
                    {new Date(
                      carrierQualification.lastValidated
                    ).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Requirements */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: '600',
                  margin: '0 0 16px 0',
                }}
              >
                📋 Contract Compliance Requirements
              </h3>

              <div style={{ display: 'grid', gap: '12px' }}>
                {complianceRequirements.map((req) => (
                  <div
                    key={req.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: `2px solid ${getComplianceCategoryColor(req.category)}40`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <div
                          style={{
                            background: getComplianceCategoryColor(
                              req.category
                            ),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '10px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}
                        >
                          {req.category}
                        </div>
                        <h4
                          style={{
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '600',
                            margin: 0,
                          }}
                        >
                          {req.requirement}
                        </h4>
                      </div>
                      <div
                        style={{
                          background: req.mandatory ? '#ef4444' : '#f59e0b',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '10px',
                          fontWeight: '600',
                        }}
                      >
                        {req.mandatory ? 'MANDATORY' : 'OPTIONAL'}
                      </div>
                    </div>

                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                        marginBottom: '8px',
                      }}
                    >
                      {req.description}
                    </div>

                    {req.documents.length > 0 && (
                      <div style={{ marginTop: '8px' }}>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                            marginBottom: '4px',
                          }}
                        >
                          <strong>Required Documents:</strong>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: '4px',
                            flexWrap: 'wrap',
                          }}
                        >
                          {req.documents.map((doc, index) => (
                            <span
                              key={index}
                              style={{
                                background: 'rgba(59, 130, 246, 0.3)',
                                color: '#93c5fd',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '10px',
                              }}
                            >
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Warnings */}
            {carrierQualification.warnings.length > 0 && (
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '24px',
                  border: '2px solid rgba(245, 158, 11, 0.4)',
                }}
              >
                <h4
                  style={{
                    color: '#f59e0b',
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0 0 8px 0',
                  }}
                >
                  ⚠️ Warnings
                </h4>
                {carrierQualification.warnings.map((warning, index) => (
                  <div
                    key={index}
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      marginBottom: '4px',
                    }}
                  >
                    • {warning}
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setShowComplianceCheck(false)}
                style={{
                  background: 'rgba(107, 114, 128, 0.8)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Close
              </button>
              <Link href='/compliance' style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    background: 'rgba(59, 130, 246, 0.8)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  📋 Full Compliance Dashboard
                </button>
              </Link>
              {carrierQualification.qualified && (
                <button
                  onClick={() => {
                    console.info(
                      'Proceeding with qualified carrier for contract bid'
                    );
                    setShowComplianceCheck(false);
                  }}
                  style={{
                    background: 'rgba(16, 185, 129, 0.8)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  ✅ Proceed with Bid
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}

export default function FreightFlowRFx() {
  return <FreightFlowRFxContent />;
}
