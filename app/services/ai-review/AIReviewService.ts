// AI Review Service for FleetFlow
// Comprehensive validation and cross-reference system for all processes
// Centralized in AI Flow platform

import { ClaudeService } from '../claude/ClaudeService';

export interface ReviewContext {
  processType:
    | 'dispatch_invoice'
    | 'load_assignment'
    | 'carrier_onboarding'
    | 'payment_processing'
    | 'document_verification'
    | 'compliance_check';
  data: any;
  userId: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ReviewResult {
  isValid: boolean;
  confidence: number; // 0-100
  errors: string[];
  warnings: string[];
  suggestions: string[];
  crossReferences: CrossReference[];
  recommendations: string[];
  requiresHumanReview: boolean;
  autoApproved: boolean;
}

export interface CrossReference {
  field: string;
  expectedValue: any;
  actualValue: any;
  source: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  processType: string;
  field: string;
  ruleType:
    | 'exact_match'
    | 'range'
    | 'format'
    | 'business_logic'
    | 'cross_reference';
  expectedValue?: any;
  minValue?: number;
  maxValue?: number;
  format?: string;
  businessLogic?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  enabled: boolean;
}

export interface AIReviewMetrics {
  totalReviews: number;
  autoApproved: number;
  humanReviewRequired: number;
  averageConfidence: number;
  errorRate: number;
  processingTime: number;
  accuracyRate: number;
}

export class AIReviewService {
  private claudeService: ClaudeService;
  private validationRules: Map<string, ValidationRule[]>;

  constructor() {
    this.claudeService = new ClaudeService();
    this.validationRules = new Map();
    this.initializeValidationRules();
  }

  // ========================================
  // CORE REVIEW FUNCTIONALITY
  // ========================================

  /**
   * Main AI review function for any FleetFlow process
   */
  async reviewProcess(context: ReviewContext): Promise<ReviewResult> {
    const startTime = Date.now();

    try {
      // Get validation rules for this process type
      const rules = this.getValidationRules(context.processType);

      // Perform data validation
      const validationResult = await this.validateData(context.data, rules);

      // Perform cross-reference checks
      const crossReferenceResult = await this.crossReferenceData(context);

      // Perform business logic validation
      const businessLogicResult = await this.validateBusinessLogic(context);

      // Generate AI analysis
      const aiAnalysis = await this.generateAIAnalysis(
        context,
        validationResult,
        crossReferenceResult,
        businessLogicResult
      );

      // Determine if human review is required
      const requiresHumanReview = this.determineHumanReviewRequired(aiAnalysis);

      // Calculate confidence score
      const confidence = this.calculateConfidence(aiAnalysis);

      // Determine if auto-approved
      const autoApproved = this.determineAutoApproval(aiAnalysis, confidence);

      const processingTime = Date.now() - startTime;

      return {
        isValid: aiAnalysis.isValid,
        confidence,
        errors: aiAnalysis.errors,
        warnings: aiAnalysis.warnings,
        suggestions: aiAnalysis.suggestions,
        crossReferences: crossReferenceResult,
        recommendations: aiAnalysis.recommendations,
        requiresHumanReview,
        autoApproved,
      };
    } catch (error) {
      return {
        isValid: false,
        confidence: 0,
        errors: [
          `AI Review failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ],
        warnings: [],
        suggestions: [],
        crossReferences: [],
        recommendations: ['Review system error occurred'],
        requiresHumanReview: true,
        autoApproved: false,
      };
    }
  }

  // ========================================
  // DISPATCH INVOICE REVIEW
  // ========================================

  /**
   * Specialized review for dispatch invoices
   */
  async reviewDispatchInvoice(invoiceData: any): Promise<ReviewResult> {
    const context: ReviewContext = {
      processType: 'dispatch_invoice',
      data: invoiceData,
      userId: invoiceData.dispatcherUserIdentifier || 'unknown',
      timestamp: new Date(),
      priority: 'high',
    };

    return this.reviewProcess(context);
  }

  /**
   * Validate dispatch invoice specific data
   */
  private async validateDispatchInvoiceData(invoiceData: any): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate required fields
    if (!invoiceData.loadId) errors.push('Load ID is required');
    if (!invoiceData.carrierName) errors.push('Carrier name is required');
    if (!invoiceData.loadAmount || invoiceData.loadAmount <= 0)
      errors.push('Valid load amount is required');
    if (!invoiceData.dispatchFee || invoiceData.dispatchFee <= 0)
      errors.push('Valid dispatch fee is required');

    // Validate fee calculation
    const expectedFee = (invoiceData.loadAmount * 10) / 100; // 10% default
    const feeDifference = Math.abs(invoiceData.dispatchFee - expectedFee);
    if (feeDifference > 0.01) {
      warnings.push(
        `Dispatch fee calculation may be incorrect. Expected: $${expectedFee.toFixed(2)}, Actual: $${invoiceData.dispatchFee.toFixed(2)}`
      );
    }

    // Validate percentage
    const calculatedPercentage =
      (invoiceData.dispatchFee / invoiceData.loadAmount) * 100;
    if (calculatedPercentage < 5 || calculatedPercentage > 15) {
      warnings.push(
        `Dispatch fee percentage (${calculatedPercentage.toFixed(1)}%) is outside normal range (5-15%)`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // ========================================
  // LOAD ASSIGNMENT REVIEW
  // ========================================

  /**
   * Review load assignment data
   */
  async reviewLoadAssignment(assignmentData: any): Promise<ReviewResult> {
    const context: ReviewContext = {
      processType: 'load_assignment',
      data: assignmentData,
      userId: assignmentData.dispatcherId || 'unknown',
      timestamp: new Date(),
      priority: 'high',
    };

    return this.reviewProcess(context);
  }

  // ========================================
  // CARRIER ONBOARDING REVIEW
  // ========================================

  /**
   * Review carrier onboarding data
   */
  async reviewCarrierOnboarding(onboardingData: any): Promise<ReviewResult> {
    const context: ReviewContext = {
      processType: 'carrier_onboarding',
      data: onboardingData,
      userId: onboardingData.createdBy || 'unknown',
      timestamp: new Date(),
      priority: 'critical',
    };

    return this.reviewProcess(context);
  }

  // ========================================
  // PAYMENT PROCESSING REVIEW
  // ========================================

  /**
   * Review payment processing data
   */
  async reviewPaymentProcessing(paymentData: any): Promise<ReviewResult> {
    const context: ReviewContext = {
      processType: 'payment_processing',
      data: paymentData,
      userId: paymentData.processedBy || 'unknown',
      timestamp: new Date(),
      priority: 'critical',
    };

    return this.reviewProcess(context);
  }

  // ========================================
  // DOCUMENT VERIFICATION REVIEW
  // ========================================

  /**
   * Review document verification data
   */
  async reviewDocumentVerification(documentData: any): Promise<ReviewResult> {
    const context: ReviewContext = {
      processType: 'document_verification',
      data: documentData,
      userId: documentData.verifiedBy || 'unknown',
      timestamp: new Date(),
      priority: 'high',
    };

    return this.reviewProcess(context);
  }

  // ========================================
  // COMPLIANCE CHECK REVIEW
  // ========================================

  /**
   * Review compliance check data
   */
  async reviewComplianceCheck(complianceData: any): Promise<ReviewResult> {
    const context: ReviewContext = {
      processType: 'compliance_check',
      data: complianceData,
      userId: complianceData.checkedBy || 'unknown',
      timestamp: new Date(),
      priority: 'critical',
    };

    return this.reviewProcess(context);
  }

  // ========================================
  // VALIDATION METHODS
  // ========================================

  private async validateData(
    data: any,
    rules: ValidationRule[]
  ): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const rule of rules) {
      if (!rule.enabled) continue;

      const fieldValue = this.getFieldValue(data, rule.field);

      switch (rule.ruleType) {
        case 'exact_match':
          if (fieldValue !== rule.expectedValue) {
            const message = `Field ${rule.field} does not match expected value`;
            if (rule.severity === 'error' || rule.severity === 'critical') {
              errors.push(message);
            } else {
              warnings.push(message);
            }
          }
          break;

        case 'range':
          if (typeof fieldValue === 'number') {
            if (rule.minValue !== undefined && fieldValue < rule.minValue) {
              const message = `Field ${rule.field} value ${fieldValue} is below minimum ${rule.minValue}`;
              if (rule.severity === 'error' || rule.severity === 'critical') {
                errors.push(message);
              } else {
                warnings.push(message);
              }
            }
            if (rule.maxValue !== undefined && fieldValue > rule.maxValue) {
              const message = `Field ${rule.field} value ${fieldValue} is above maximum ${rule.maxValue}`;
              if (rule.severity === 'error' || rule.severity === 'critical') {
                errors.push(message);
              } else {
                warnings.push(message);
              }
            }
          }
          break;

        case 'format':
          if (rule.format && !this.validateFormat(fieldValue, rule.format)) {
            const message = `Field ${rule.field} does not match required format`;
            if (rule.severity === 'error' || rule.severity === 'critical') {
              errors.push(message);
            } else {
              warnings.push(message);
            }
          }
          break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private async crossReferenceData(
    context: ReviewContext
  ): Promise<CrossReference[]> {
    const crossReferences: CrossReference[] = [];

    // Cross-reference with existing system data
    switch (context.processType) {
      case 'dispatch_invoice':
        crossReferences.push(
          ...(await this.crossReferenceDispatchInvoice(context.data))
        );
        break;
      case 'load_assignment':
        crossReferences.push(
          ...(await this.crossReferenceLoadAssignment(context.data))
        );
        break;
      case 'carrier_onboarding':
        crossReferences.push(
          ...(await this.crossReferenceCarrierOnboarding(context.data))
        );
        break;
      case 'payment_processing':
        crossReferences.push(
          ...(await this.crossReferencePaymentProcessing(context.data))
        );
        break;
    }

    return crossReferences;
  }

  private async validateBusinessLogic(context: ReviewContext): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Business logic validation based on process type
    switch (context.processType) {
      case 'dispatch_invoice':
        const invoiceValidation = await this.validateDispatchInvoiceData(
          context.data
        );
        errors.push(...invoiceValidation.errors);
        warnings.push(...invoiceValidation.warnings);
        break;
      // Add other process type validations
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private async generateAIAnalysis(
    context: ReviewContext,
    validationResult: any,
    crossReferenceResult: CrossReference[],
    businessLogicResult: any
  ): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
    recommendations: string[];
  }> {
    const prompt = `
      Analyze the following FleetFlow process data for accuracy and consistency:

      Process Type: ${context.processType}
      Data: ${JSON.stringify(context.data, null, 2)}

      Validation Results:
      - Errors: ${validationResult.errors.join(', ')}
      - Warnings: ${validationResult.warnings.join(', ')}

      Cross-Reference Results:
      ${crossReferenceResult.map((cr) => `- ${cr.field}: Expected ${cr.expectedValue}, Actual ${cr.actualValue} (${cr.severity})`).join('\n')}

      Business Logic Results:
      - Errors: ${businessLogicResult.errors.join(', ')}
      - Warnings: ${businessLogicResult.warnings.join(', ')}

      Please provide:
      1. Overall validity assessment
      2. Additional errors or warnings
      3. Suggestions for improvement
      4. Recommendations for next steps
    `;

    try {
      const aiResponse = await this.claudeService.analyze(prompt);

      // Parse AI response and extract structured data
      return this.parseAIResponse(aiResponse);
    } catch (error) {
      return {
        isValid: validationResult.isValid && businessLogicResult.isValid,
        errors: [...validationResult.errors, ...businessLogicResult.errors],
        warnings: [
          ...validationResult.warnings,
          ...businessLogicResult.warnings,
        ],
        suggestions: ['AI analysis unavailable'],
        recommendations: ['Proceed with caution'],
      };
    }
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  private getFieldValue(data: any, field: string): any {
    const fieldParts = field.split('.');
    let value = data;

    for (const part of fieldParts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return undefined;
      }
    }

    return value;
  }

  private validateFormat(value: any, format: string): boolean {
    // Basic format validation
    switch (format) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
      case 'phone':
        return /^[\+]?[1-9][\d]{0,15}$/.test(
          String(value).replace(/[\s\-\(\)]/g, '')
        );
      case 'date':
        return !isNaN(Date.parse(String(value)));
      case 'currency':
        return /^\d+(\.\d{1,2})?$/.test(String(value));
      default:
        return true;
    }
  }

  private determineHumanReviewRequired(aiAnalysis: any): boolean {
    // Determine if human review is required based on analysis
    return (
      aiAnalysis.errors.length > 0 ||
      aiAnalysis.warnings.length > 3 ||
      aiAnalysis.confidence < 80
    );
  }

  private calculateConfidence(aiAnalysis: any): number {
    // Calculate confidence score based on various factors
    let confidence = 100;

    // Reduce confidence for each error
    confidence -= aiAnalysis.errors.length * 20;

    // Reduce confidence for each warning
    confidence -= aiAnalysis.warnings.length * 5;

    // Ensure confidence is between 0 and 100
    return Math.max(0, Math.min(100, confidence));
  }

  private determineAutoApproval(aiAnalysis: any, confidence: number): boolean {
    // Determine if process can be auto-approved
    return (
      aiAnalysis.isValid &&
      confidence >= 90 &&
      aiAnalysis.errors.length === 0 &&
      aiAnalysis.warnings.length <= 1
    );
  }

  private parseAIResponse(response: string): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
    recommendations: string[];
  } {
    // Parse AI response and extract structured data
    // This is a simplified parser - in production, you'd want more sophisticated parsing
    const lines = response.split('\n');
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    const recommendations: string[] = [];

    let isValid = true;

    for (const line of lines) {
      if (
        line.toLowerCase().includes('error') ||
        line.toLowerCase().includes('invalid')
      ) {
        errors.push(line.trim());
        isValid = false;
      } else if (line.toLowerCase().includes('warning')) {
        warnings.push(line.trim());
      } else if (line.toLowerCase().includes('suggestion')) {
        suggestions.push(line.trim());
      } else if (line.toLowerCase().includes('recommend')) {
        recommendations.push(line.trim());
      }
    }

    return {
      isValid,
      errors,
      warnings,
      suggestions,
      recommendations,
    };
  }

  // ========================================
  // CROSS-REFERENCE METHODS
  // ========================================

  private async crossReferenceDispatchInvoice(
    invoiceData: any
  ): Promise<CrossReference[]> {
    const crossReferences: CrossReference[] = [];

    // Cross-reference with load data
    if (invoiceData.loadId) {
      // In production, you'd fetch actual load data
      const expectedLoadAmount = 5000; // Mock data
      if (invoiceData.loadAmount !== expectedLoadAmount) {
        crossReferences.push({
          field: 'loadAmount',
          expectedValue: expectedLoadAmount,
          actualValue: invoiceData.loadAmount,
          source: 'load_data',
          severity: 'warning',
        });
      }
    }

    // Cross-reference with carrier data
    if (invoiceData.carrierName) {
      // In production, you'd fetch actual carrier data
      const expectedCarrierName = 'Sample Carrier'; // Mock data
      if (invoiceData.carrierName !== expectedCarrierName) {
        crossReferences.push({
          field: 'carrierName',
          expectedValue: expectedCarrierName,
          actualValue: invoiceData.carrierName,
          source: 'carrier_data',
          severity: 'info',
        });
      }
    }

    return crossReferences;
  }

  private async crossReferenceLoadAssignment(
    assignmentData: any
  ): Promise<CrossReference[]> {
    const crossReferences: CrossReference[] = [];
    // Add load assignment cross-reference logic
    return crossReferences;
  }

  private async crossReferenceCarrierOnboarding(
    onboardingData: any
  ): Promise<CrossReference[]> {
    const crossReferences: CrossReference[] = [];
    // Add carrier onboarding cross-reference logic
    return crossReferences;
  }

  private async crossReferencePaymentProcessing(
    paymentData: any
  ): Promise<CrossReference[]> {
    const crossReferences: CrossReference[] = [];
    // Add payment processing cross-reference logic
    return crossReferences;
  }

  // ========================================
  // VALIDATION RULES MANAGEMENT
  // ========================================

  private initializeValidationRules(): void {
    // Initialize validation rules for each process type
    this.validationRules.set('dispatch_invoice', [
      {
        id: 'invoice_load_id_required',
        name: 'Load ID Required',
        description: 'Dispatch invoice must have a valid load ID',
        processType: 'dispatch_invoice',
        field: 'loadId',
        ruleType: 'exact_match',
        severity: 'error',
        enabled: true,
      },
      {
        id: 'invoice_carrier_required',
        name: 'Carrier Name Required',
        description: 'Dispatch invoice must have a valid carrier name',
        processType: 'dispatch_invoice',
        field: 'carrierName',
        ruleType: 'exact_match',
        severity: 'error',
        enabled: true,
      },
      {
        id: 'invoice_amount_range',
        name: 'Load Amount Range',
        description: 'Load amount must be within valid range',
        processType: 'dispatch_invoice',
        field: 'loadAmount',
        ruleType: 'range',
        minValue: 100,
        maxValue: 50000,
        severity: 'warning',
        enabled: true,
      },
    ]);

    // Add rules for other process types...
  }

  private getValidationRules(processType: string): ValidationRule[] {
    return this.validationRules.get(processType) || [];
  }

  // ========================================
  // METRICS AND REPORTING
  // ========================================

  async getReviewMetrics(): Promise<AIReviewMetrics> {
    // In production, this would fetch from database
    return {
      totalReviews: 0,
      autoApproved: 0,
      humanReviewRequired: 0,
      averageConfidence: 0,
      errorRate: 0,
      processingTime: 0,
      accuracyRate: 0,
    };
  }
}
