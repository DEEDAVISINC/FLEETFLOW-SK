/**
 * FleetFlow EDI Workflow Integration Service
 * Seamlessly integrates EDI logic into all freight workflows
 * Handles automatic EDI identifier generation, validation, and transaction management
 * Invisible to end users - all EDI complexity is managed internally
 */

import EDIService from './EDIService';

export interface WorkflowContext {
  type: 'load_posting' | 'quote_generation' | 'rfx_response' | 'shipment_tracking' | 'invoice_processing';
  data: any;
  userId?: string;
  timestamp?: Date;
}

export interface EDIWorkflowResult {
  success: boolean;
  enrichedData: any;
  ediValidation?: {
    isValid: boolean;
    missingRequired: string[];
    invalidIdentifiers: string[];
  };
  transactionCode?: string;
  generatedIdentifiers?: Record<string, string>;
}

export class EDIWorkflowService {
  
  /**
   * Process any freight workflow and automatically handle EDI requirements
   */
  static async processWorkflow(context: WorkflowContext): Promise<EDIWorkflowResult> {
    try {
      // Determine appropriate EDI transaction type based on workflow context
      const transactionCode = this.getTransactionCodeForWorkflow(context.type, context.data);
      
      // Enrich data with EDI identifiers and validation
      const enrichedData = EDIService.enrichLoadWithEDI(context.data, transactionCode);
      
      // Validate for specific transaction requirements
      const validation = EDIService.validateLoadForTransaction(enrichedData, transactionCode);
      
      // Generate any missing required identifiers
      const generatedIds = EDIService.generateIdentifiers(enrichedData);
      
      return {
        success: validation.isValid,
        enrichedData: { ...enrichedData, ...generatedIds },
        ediValidation: validation,
        transactionCode,
        generatedIdentifiers: generatedIds
      };
    } catch (error) {
      console.error('EDI Workflow processing error:', error);
      return {
        success: false,
        enrichedData: context.data,
        ediValidation: {
          isValid: false,
          missingRequired: [],
          invalidIdentifiers: ['Processing error']
        }
      };
    }
  }

  /**
   * Get appropriate EDI transaction code based on workflow type
   */
  private static getTransactionCodeForWorkflow(workflowType: string, data: any): string {
    switch (workflowType) {
      case 'load_posting':
        return '204'; // Motor Carrier Load Tender
      
      case 'quote_generation':
        return '204'; // Load Tender (for quotes)
      
      case 'rfx_response':
        return '990'; // Response to Load Tender
      
      case 'shipment_tracking':
        return '214'; // Transportation Carrier Shipment Status Message
      
      case 'invoice_processing':
        // Choose invoice type based on load characteristics
        return data.type === 'Ocean' ? '310' : '210';
      
      default:
        return '214'; // Default to status message
    }
  }

  /**
   * Prepare load data for EDI transmission to trading partners
   */
  static prepareForEDITransmission(loadData: any, transactionCode: string): Record<string, any> {
    // Format all EDI identifiers for transmission
    const formattedIdentifiers = EDIService.formatForTransmission(loadData, transactionCode);
    
    // Get transaction-specific required fields
    const requiredIds = EDIService.getRequiredIdentifiers(transactionCode);
    const optionalIds = EDIService.getOptionalIdentifiers(transactionCode);
    
    return {
      transactionCode,
      requiredIdentifiers: requiredIds.reduce((acc, id) => {
        if (formattedIdentifiers[id]) {
          acc[id] = formattedIdentifiers[id];
        }
        return acc;
      }, {} as Record<string, string>),
      optionalIdentifiers: optionalIds.reduce((acc, id) => {
        if (formattedIdentifiers[id]) {
          acc[id] = formattedIdentifiers[id];
        }
        return acc;
      }, {} as Record<string, string>),
      loadData,
      timestamp: new Date(),
      readyForTransmission: requiredIds.every(id => formattedIdentifiers[id])
    };
  }

  /**
   * Process shipment status updates with appropriate EDI handling
   */
  static async processStatusUpdate(loadId: string, status: string, location?: string): Promise<EDIWorkflowResult> {
    const statusData = {
      loadId,
      status,
      location,
      timestamp: new Date(),
      // Status update requires these for EDI 214
      statusCode: this.getEDIStatusCode(status)
    };

    return this.processWorkflow({
      type: 'shipment_tracking',
      data: statusData
    });
  }

  /**
   * Map internal status to EDI status codes
   */
  private static getEDIStatusCode(status: string): string {
    const statusMapping: Record<string, string> = {
      'posted': 'AF', // Pickup scheduled
      'assigned': 'X3', // Pickup assigned to carrier
      'picked_up': 'X1', // Shipment picked up
      'in_transit': 'X4', // In transit
      'delivered': 'X6', // Delivered
      'exception': 'X7', // Exception/problem
      'cancelled': 'X8'  // Cancelled
    };

    return statusMapping[status] || 'X4'; // Default to in transit
  }

  /**
   * Generate tracking number that follows EDI standards
   */
  static generateTrackingNumber(loadType: string = 'FTL'): string {
    const prefix = loadType === 'Ocean' ? 'OCN' : 'FTL';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  /**
   * Validate carrier information for EDI compliance
   */
  static validateCarrierForEDI(carrierData: any): {
    isValid: boolean;
    missingFields: string[];
    recommendations: string[];
  } {
    const requiredFields = ['scac', 'mcNumber', 'dotNumber', 'companyName'];
    const missingFields = requiredFields.filter(field => !carrierData[field]);
    
    const recommendations: string[] = [];
    
    if (carrierData.scac && !EDIService.validateIdentifier('SCAC', carrierData.scac)) {
      recommendations.push('SCAC code format is invalid - should be 2-4 uppercase letters');
    }
    
    if (!carrierData.insuranceInfo) {
      recommendations.push('Insurance information recommended for EDI transmission');
    }
    
    if (!carrierData.safetyRating) {
      recommendations.push('FMCSA safety rating recommended for compliance');
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
      recommendations
    };
  }

  /**
   * Auto-populate EDI identifiers for new loads based on patterns and defaults
   */
  static autoPopulateEDIFields(loadData: any): any {
    const enhanced = { ...loadData };
    
    // Generate load number if missing
    if (!enhanced.loadNumber) {
      enhanced.loadNumber = EDIService.generateIdentifiers({}).LoadNumber;
    }
    
    // Auto-generate appointment numbers for time-sensitive deliveries
    if (enhanced.deliveryAppointment && !enhanced.appointmentNumber) {
      enhanced.appointmentNumber = `APT${Date.now().toString().slice(-6)}`;
    }
    
    // Generate container number for international shipments
    if (enhanced.isInternational && !enhanced.containerNumber) {
      enhanced.containerNumber = `FLFW${Math.random().toString().slice(-7).padStart(7, '0')}`;
    }
    
    return enhanced;
  }

  /**
   * Check if load is ready for specific EDI transaction
   */
  static isReadyForEDITransaction(loadData: any, transactionCode: string): {
    ready: boolean;
    blockers: string[];
    warnings: string[];
  } {
    const validation = EDIService.validateLoadForTransaction(loadData, transactionCode);
    
    const blockers: string[] = [];
    const warnings: string[] = [];
    
    if (validation.missingRequired.length > 0) {
      blockers.push(`Missing required identifiers: ${validation.missingRequired.join(', ')}`);
    }
    
    if (validation.invalidIdentifiers.length > 0) {
      blockers.push(`Invalid identifiers: ${validation.invalidIdentifiers.join(', ')}`);
    }
    
    // Check for common warnings
    if (!loadData.carrierInfo?.scac) {
      warnings.push('Carrier SCAC not assigned - may delay EDI transmission');
    }
    
    if (!loadData.customerReference) {
      warnings.push('Customer reference number recommended for tracking');
    }

    return {
      ready: validation.isValid && blockers.length === 0,
      blockers,
      warnings
    };
  }
}

export default EDIWorkflowService;
