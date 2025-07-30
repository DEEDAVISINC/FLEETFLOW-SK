/**
 * RFx Document Processing Service
 * Handles file uploads, text extraction, and document analysis for RFP, RFQ, RFI, RFB documents
 */

export interface DocumentProcessingResult {
  success: boolean;
  extractedText: string;
  metadata: {
    fileName: string;
    fileSize: number;
    fileType: string;
    documentType: 'RFP' | 'RFQ' | 'RFI' | 'RFB';
    pageCount?: number;
    wordCount: number;
  };
  error?: string;
}

export class RFxDocumentProcessor {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly SUPPORTED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/rtf'
  ];

  /**
   * Process uploaded document and extract text content
   */
  static async processDocument(
    file: File, 
    documentType: 'RFP' | 'RFQ' | 'RFI' | 'RFB'
  ): Promise<DocumentProcessingResult> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return {
          success: false,
          extractedText: '',
          metadata: {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            documentType,
            wordCount: 0
          },
          error: validation.error
        };
      }

      // Extract text based on file type
      let extractedText = '';
      
      if (file.type === 'text/plain') {
        extractedText = await this.extractTextFromPlainText(file);
      } else if (file.type === 'application/pdf') {
        extractedText = await this.extractTextFromPDF(file);
      } else if (
        file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        extractedText = await this.extractTextFromWord(file);
      } else {
        // Fallback to text extraction
        extractedText = await this.extractTextFromPlainText(file);
      }

      // Clean and process text
      const cleanedText = this.cleanExtractedText(extractedText);
      const wordCount = this.countWords(cleanedText);

      return {
        success: true,
        extractedText: cleanedText,
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          documentType,
          wordCount
        }
      };

    } catch (error) {
      console.error('Document processing error:', error);
      return {
        success: false,
        extractedText: '',
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          documentType,
          wordCount: 0
        },
        error: 'Failed to process document. Please ensure the file is not corrupted and try again.'
      };
    }
  }

  /**
   * Validate uploaded file
   */
  private static validateFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { 
        valid: false, 
        error: `File size exceeds maximum limit of ${this.MAX_FILE_SIZE / 1024 / 1024}MB` 
      };
    }

    if (!this.SUPPORTED_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Unsupported file type. Please upload PDF, Word document, or text file.' 
      };
    }

    return { valid: true };
  }

  /**
   * Extract text from plain text file
   */
  private static async extractTextFromPlainText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text || '');
      };
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
    });
  }

  /**
   * Extract text from PDF (simulated - in production, use PDF.js or similar)
   */
  private static async extractTextFromPDF(file: File): Promise<string> {
    // In a real implementation, you would use PDF.js or a server-side PDF parser
    // For now, we'll simulate PDF text extraction
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`
          REQUEST FOR QUOTE - TRANSPORTATION SERVICES
          
          SOLICITATION DETAILS:
          - Origin: Los Angeles, CA
          - Destination: Phoenix, AZ
          - Equipment: Dry Van, 53ft
          - Weight: 42,000 lbs
          - Commodity: General Freight
          - Pickup Date: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toDateString()}
          - Delivery Date: ${new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toDateString()}
          
          REQUIREMENTS:
          - DOT compliant carrier with active operating authority
          - Minimum $1M liability insurance, $100K cargo insurance
          - Temperature controlled capability preferred
          - Liftgate delivery required
          - Real-time tracking and communication
          - On-time delivery guarantee
          
          SUBMISSION REQUIREMENTS:
          - Submit quote by ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString()}
          - Include all fees and surcharges
          - Provide insurance certificates
          - Include safety rating documentation
          - Specify equipment availability
          
          EVALUATION CRITERIA:
          - Price (40%)
          - Safety record (25%)
          - On-time performance (20%)
          - Equipment capability (15%)
          
          Contact: procurement@company.com
          Phone: (555) 987-6543
        `);
      }, 1500);
    });
  }

  /**
   * Extract text from Word document (simulated - in production, use mammoth.js or similar)
   */
  private static async extractTextFromWord(file: File): Promise<string> {
    // In a real implementation, you would use mammoth.js or similar library
    // For now, we'll simulate Word document text extraction
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`
          REQUEST FOR PROPOSAL - FREIGHT TRANSPORTATION SERVICES
          
          1. PROJECT OVERVIEW
          We are seeking qualified transportation providers for ongoing freight services
          from our distribution centers to retail locations across the Southwest region.
          
          2. SCOPE OF WORK
          - Full truckload (FTL) transportation services
          - Routes: Los Angeles, CA to Phoenix, AZ corridor
          - Frequency: 5-7 loads per week
          - Equipment: 53ft dry vans, some temperature controlled
          - Average weight: 35,000 - 45,000 lbs per load
          
          3. REQUIREMENTS
          - Valid DOT operating authority and MC number
          - Satisfactory or better safety rating
          - Insurance: $1M liability, $100K cargo minimum
          - Real-time tracking capability
          - 24/7 dispatch and customer service
          - Liftgate capability for select deliveries
          
          4. PROPOSAL REQUIREMENTS
          - Company profile and capabilities
          - Safety record and certifications
          - Equipment specifications and availability
          - Pricing structure (per mile or per load)
          - References from similar clients
          - Implementation timeline
          
          5. EVALUATION CRITERIA
          - Technical capability (30%)
          - Safety and compliance record (25%)
          - Pricing competitiveness (25%)
          - Service quality and references (20%)
          
          6. SUBMISSION DEADLINE
          All proposals must be received by ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toDateString()}
          
          Contact Information:
          Jane Smith, Procurement Manager
          Email: jane.smith@company.com
          Phone: (555) 123-4567
        `);
      }, 2000);
    });
  }

  /**
   * Clean extracted text
   */
  private static cleanExtractedText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n\s*\n/g, '\n\n')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Count words in text
   */
  private static countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Analyze document type based on content
   */
  static analyzeDocumentType(text: string): 'RFP' | 'RFQ' | 'RFI' | 'RFB' {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('request for proposal') || lowerText.includes('rfp')) {
      return 'RFP';
    } else if (lowerText.includes('request for quote') || lowerText.includes('rfq')) {
      return 'RFQ';
    } else if (lowerText.includes('request for bid') || lowerText.includes('rfb')) {
      return 'RFB';
    } else if (lowerText.includes('request for information') || lowerText.includes('rfi')) {
      return 'RFI';
    }
    
    // Default to RFQ if type cannot be determined
    return 'RFQ';
  }

  /**
   * Extract key information from document
   */
  static extractKeyInformation(text: string): {
    origin?: string;
    destination?: string;
    equipment?: string;
    weight?: string;
    deadline?: string;
    contact?: string;
  } {
    const info: any = {};
    
    // Extract origin/destination (basic pattern matching)
    const originMatch = text.match(/origin[:\s]*([^,\n]+)/i);
    if (originMatch) info.origin = originMatch[1].trim();
    
    const destinationMatch = text.match(/destination[:\s]*([^,\n]+)/i);
    if (destinationMatch) info.destination = destinationMatch[1].trim();
    
    // Extract equipment type
    const equipmentMatch = text.match(/(dry van|reefer|flatbed|step deck|lowboy)/i);
    if (equipmentMatch) info.equipment = equipmentMatch[1];
    
    // Extract weight
    const weightMatch = text.match(/(\d{1,3},?\d{3})\s*(lbs?|pounds?)/i);
    if (weightMatch) info.weight = `${weightMatch[1]} ${weightMatch[2]}`;
    
    // Extract deadline
    const deadlineMatch = text.match(/deadline[:\s]*([^\n]+)/i);
    if (deadlineMatch) info.deadline = deadlineMatch[1].trim();
    
    // Extract contact
    const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    if (emailMatch) info.contact = emailMatch[1];
    
    return info;
  }
}

export default RFxDocumentProcessor;
