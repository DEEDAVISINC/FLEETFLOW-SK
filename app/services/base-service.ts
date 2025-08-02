// Base Service Class for all new services
// Ensures consistent patterns and error handling

import { FleetFlowAI } from './ai';

export abstract class BaseService {
  protected ai: FleetFlowAI;
  protected serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
    this.ai = new FleetFlowAI();
  }

  // Standard error handling
  protected handleError(error: any, operation: string): never {
    console.error(`[${this.serviceName}] Error in ${operation}:`, error);
    throw new Error(
      `${this.serviceName} ${operation} failed: ${error.message}`
    );
  }

  // Standard success response
  protected createSuccessResponse<T>(data: T, message?: string) {
    return {
      success: true,
      data,
      message:
        message || `${this.serviceName} operation completed successfully`,
      timestamp: new Date().toISOString(),
    };
  }

  // Standard error response
  protected createErrorResponse(error: any, operation: string) {
    return {
      success: false,
      error: error.message,
      operation,
      service: this.serviceName,
      timestamp: new Date().toISOString(),
    };
  }

  // AI integration helper
  protected async callAI(prompt: string, context: any): Promise<any> {
    try {
      return await this.ai.analyzeData({
        type: `${this.serviceName.toLowerCase()}_analysis`,
        data: context,
        prompt,
      });
    } catch (error) {
      this.handleError(error, 'AI analysis');
    }
  }

  // Data validation helper
  protected validateRequiredFields(data: any, requiredFields: string[]): void {
    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
  }

  // Logging helper
  protected log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    const logEntry = {
      level,
      service: this.serviceName,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    switch (level) {
      case 'info':
        console.log(`[${this.serviceName}] ${message}`, data || '');
        break;
      case 'warn':
        console.warn(`[${this.serviceName}] ${message}`, data || '');
        break;
      case 'error':
        console.error(`[${this.serviceName}] ${message}`, data || '');
        break;
    }
  }
}

// Service response interfaces
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  operation?: string;
  service?: string;
}

export interface AnalysisResult<T = any> {
  result: T;
  confidence: number;
  reasoning: string;
  recommendations: string[];
  riskFactors: string[];
}
