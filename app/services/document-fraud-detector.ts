import { ClaudeAIService } from '../../lib/claude-ai-service';

export interface UploadedDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  documentType: string;
  content?: string; // OCR extracted text
  metadata?: any;
}

export interface AuthenticityResult {
  authenticityScore: number; // 0-100
  riskFactors: string[];
  confidence: number;
  recommendations: string[];
  analysis: {
    digitalManipulation: boolean;
    formatConsistency: boolean;
    dataAccuracy: boolean;
    documentQuality: string;
    suspiciousPatterns: string[];
  };
}

export interface CrossReferenceResult {
  consistencyScore: number; // 0-100
  contradictions: string[];
  overallRisk: 'low' | 'medium' | 'high';
  recommendations: string[];
  analysis: {
    companyNameConsistency: boolean;
    addressConsistency: boolean;
    contactConsistency: boolean;
    dateConsistency: boolean;
    formatConsistency: boolean;
  };
}

export interface DocumentAnalysisResult {
  documentType: string;
  extractedData: any;
  validationResults: {
    requiredFields: string[];
    missingFields: string[];
    invalidFields: string[];
    fieldAccuracy: number;
  };
  fraudIndicators: string[];
  overallRisk: 'low' | 'medium' | 'high';
}

export class DocumentFraudDetector {
  private claudeAI: ClaudeAIService;

  constructor() {
    // Use existing Claude AI - NO NEW COSTS
    this.claudeAI = new ClaudeAIService();
  }

  // FREE: Use existing Claude AI service
  async analyzeDocumentAuthenticity(
    document: UploadedDocument
  ): Promise<AuthenticityResult> {
    try {
      // FREE: Use existing Claude AI service
      const analysis = await this.claudeAI.analyzeDocument(
        document,
        `
        Analyze this document for potential fraud indicators:

        1. Check for digital manipulation or editing
        2. Verify format consistency with official documents
        3. Identify suspicious patterns or inconsistencies
        4. Validate data accuracy and completeness
        5. Assess overall document quality and legitimacy

        Document Information:
        - File Name: ${document.fileName}
        - File Type: ${document.fileType}
        - File Size: ${document.fileSize} bytes
        - Document Type: ${document.documentType}
        - Upload Date: ${document.uploadDate}
        - Content: ${document.content || 'No content available'}

        Return JSON with:
        - authenticityScore (0-100)
        - riskFactors (array of concerns)
        - confidence (0-100)
        - recommendations (next steps)
        - analysis: {
            digitalManipulation: boolean,
            formatConsistency: boolean,
            dataAccuracy: boolean,
            documentQuality: string,
            suspiciousPatterns: array
          }
      `
      );

      return JSON.parse(analysis);
    } catch (error) {
      console.error('Document authenticity analysis error:', error);
      return this.getDefaultAuthenticityResult();
    }
  }

  async crossReferenceDocuments(
    documents: UploadedDocument[]
  ): Promise<CrossReferenceResult> {
    try {
      if (documents.length < 2) {
        return {
          consistencyScore: 100,
          contradictions: [],
          overallRisk: 'low',
          recommendations: ['Single document - no cross-reference possible'],
          analysis: {
            companyNameConsistency: true,
            addressConsistency: true,
            contactConsistency: true,
            dateConsistency: true,
            formatConsistency: true,
          },
        };
      }

      // FREE: Use Claude AI to compare multiple documents
      const analysis = await this.claudeAI.analyzeDocumentSet(
        documents,
        `
        Cross-reference these documents for consistency:

        Documents to analyze:
        ${documents
          .map(
            (doc, index) => `
          Document ${index + 1}:
          - File Name: ${doc.fileName}
          - Document Type: ${doc.documentType}
          - Content: ${doc.content || 'No content available'}
        `
          )
          .join('\n')}

        Check for:
        1. Company name consistency across all documents
        2. Address consistency
        3. Phone/email consistency
        4. Date consistency
        5. Format consistency
        6. Any contradictions or red flags

        Return JSON with:
        - consistencyScore (0-100)
        - contradictions (array of mismatches)
        - overallRisk (low/medium/high)
        - recommendations (next steps)
        - analysis: {
            companyNameConsistency: boolean,
            addressConsistency: boolean,
            contactConsistency: boolean,
            dateConsistency: boolean,
            formatConsistency: boolean
          }
      `
      );

      return JSON.parse(analysis);
    } catch (error) {
      console.error('Document cross-reference analysis error:', error);
      return this.getDefaultCrossReferenceResult();
    }
  }

  async analyzeDocumentType(
    document: UploadedDocument
  ): Promise<DocumentAnalysisResult> {
    try {
      // FREE: Use Claude AI to analyze document type and content
      const analysis = await this.claudeAI.analyzeDocument(
        document,
        `
        Analyze this document for type identification and fraud detection:

        Document Information:
        - File Name: ${document.fileName}
        - File Type: ${document.fileType}
        - File Size: ${document.fileSize} bytes
        - Content: ${document.content || 'No content available'}

        Tasks:
        1. Identify the document type (insurance certificate, W-9, authority letter, etc.)
        2. Extract key data fields
        3. Validate required fields for this document type
        4. Check for fraud indicators
        5. Assess overall risk level

        Return JSON with:
        - documentType: string
        - extractedData: object with key fields
        - validationResults: {
            requiredFields: array,
            missingFields: array,
            invalidFields: array,
            fieldAccuracy: number
          }
        - fraudIndicators: array
        - overallRisk: low/medium/high
      `
      );

      return JSON.parse(analysis);
    } catch (error) {
      console.error('Document type analysis error:', error);
      return this.getDefaultDocumentAnalysisResult();
    }
  }

  async validateDocumentFormat(
    document: UploadedDocument,
    expectedType: string
  ): Promise<boolean> {
    try {
      // FREE: Use Claude AI to validate document format
      const validation = await this.claudeAI.analyzeDocument(
        document,
        `
        Validate that this document matches the expected format for: ${expectedType}

        Document Information:
        - File Name: ${document.fileName}
        - File Type: ${document.fileType}
        - File Size: ${document.fileSize} bytes
        - Content: ${document.content || 'No content available'}

        Expected Document Type: ${expectedType}

        Check if this document:
        1. Has the correct format for ${expectedType}
        2. Contains all required sections
        3. Follows proper formatting standards
        4. Appears to be authentic

        Return JSON with:
        - isValid: boolean
        - confidence: number (0-100)
        - issues: array of problems found
        - recommendations: array of fixes needed
      `
      );

      const result = JSON.parse(validation);
      return result.isValid && result.confidence > 70;
    } catch (error) {
      console.error('Document format validation error:', error);
      return false;
    }
  }

  async detectDocumentTampering(document: UploadedDocument): Promise<{
    isTampered: boolean;
    confidence: number;
    indicators: string[];
    recommendations: string[];
  }> {
    try {
      // FREE: Use Claude AI to detect potential tampering
      const analysis = await this.claudeAI.analyzeDocument(
        document,
        `
        Detect potential document tampering or manipulation:

        Document Information:
        - File Name: ${document.fileName}
        - File Type: ${document.fileType}
        - File Size: ${document.fileSize} bytes
        - Content: ${document.content || 'No content available'}

        Look for signs of:
        1. Digital editing or manipulation
        2. Inconsistent formatting
        3. Suspicious text patterns
        4. Metadata inconsistencies
        5. Quality degradation

        Return JSON with:
        - isTampered: boolean
        - confidence: number (0-100)
        - indicators: array of tampering signs
        - recommendations: array of next steps
      `
      );

      return JSON.parse(analysis);
    } catch (error) {
      console.error('Document tampering detection error:', error);
      return {
        isTampered: false,
        confidence: 0,
        indicators: ['Analysis failed'],
        recommendations: ['Manual review required'],
      };
    }
  }

  // Helper methods for document analysis
  private extractTextFromDocument(document: UploadedDocument): string {
    // This would integrate with OCR service if available
    // For now, return the content if available
    return document.content || '';
  }

  private validateFileSize(document: UploadedDocument): boolean {
    // Check if file size is reasonable for the document type
    const maxSizes = {
      insurance_certificate: 5 * 1024 * 1024, // 5MB
      w9_form: 2 * 1024 * 1024, // 2MB
      authority_letter: 3 * 1024 * 1024, // 3MB
      default: 10 * 1024 * 1024, // 10MB
    };

    const maxSize =
      maxSizes[document.documentType as keyof typeof maxSizes] ||
      maxSizes.default;
    return document.fileSize <= maxSize;
  }

  private validateFileType(document: UploadedDocument): boolean {
    // Check if file type is appropriate for documents
    const allowedTypes = ['pdf', 'jpg', 'jpeg', 'png', 'tiff', 'bmp'];
    const fileExtension = document.fileType.toLowerCase();

    return allowedTypes.includes(fileExtension);
  }

  // Default results for error handling
  private getDefaultAuthenticityResult(): AuthenticityResult {
    return {
      authenticityScore: 50,
      riskFactors: ['Analysis failed'],
      confidence: 0,
      recommendations: ['Manual review required'],
      analysis: {
        digitalManipulation: false,
        formatConsistency: false,
        dataAccuracy: false,
        documentQuality: 'unknown',
        suspiciousPatterns: ['Analysis failed'],
      },
    };
  }

  private getDefaultCrossReferenceResult(): CrossReferenceResult {
    return {
      consistencyScore: 50,
      contradictions: ['Analysis failed'],
      overallRisk: 'medium',
      recommendations: ['Manual review required'],
      analysis: {
        companyNameConsistency: false,
        addressConsistency: false,
        contactConsistency: false,
        dateConsistency: false,
        formatConsistency: false,
      },
    };
  }

  private getDefaultDocumentAnalysisResult(): DocumentAnalysisResult {
    return {
      documentType: 'unknown',
      extractedData: {},
      validationResults: {
        requiredFields: [],
        missingFields: [],
        invalidFields: [],
        fieldAccuracy: 0,
      },
      fraudIndicators: ['Analysis failed'],
      overallRisk: 'medium',
    };
  }
}

