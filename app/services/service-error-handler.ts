'use client';

import { NextResponse } from 'next/server';

export class ServiceErrorHandler {
  static handleError(
    error: any,
    serviceName: string
  ): { message: string; status: number } {
    console.error(`Error in ${serviceName}:`, error);

    // Default error response
    const defaultError = {
      message: `An unexpected error occurred in ${serviceName}`,
      status: 500,
    };

    // Check if it's a response with status code
    if (error.response && error.response.status) {
      return {
        message: error.response.data?.message || defaultError.message,
        status: error.response.status,
      };
    }

    // Network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return {
        message: `Connection failed to ${serviceName} service`,
        status: 503,
      };
    }

    // Timeout errors
    if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
      return {
        message: `Request to ${serviceName} service timed out`,
        status: 504,
      };
    }

    return defaultError;
  }

  static formatErrorResponse(error: any): Response {
    const errorDetails = this.handleError(error, 'API');
    return new Response(JSON.stringify({ error: errorDetails.message }), {
      status: errorDetails.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  static async handleAsyncOperation<T>(
    operation: () => Promise<T>,
    serviceName = 'API'
  ): Promise<NextResponse<T | { error: string }>> {
    try {
      const result = await operation();
      return NextResponse.json(result);
    } catch (error: any) {
      console.error(`Error in ${serviceName}:`, error);
      const errorDetails = this.handleError(error, serviceName);
      return NextResponse.json(
        { error: errorDetails.message },
        { status: errorDetails.status }
      );
    }
  }
}
