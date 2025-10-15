/**
 * API Route: Initialize BPA Follow-Up System
 * Sets up automated follow-up for NAWCAD BPA submission
 */

import {
  getBPAFollowUpStatus,
  initializeNAWCADBPAFollowUp,
  isBPAFollowUpInitialized,
} from '@/app/services/initializeBPAFollowUp';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check if already initialized
    if (isBPAFollowUpInitialized()) {
      const status = getBPAFollowUpStatus();
      return NextResponse.json({
        success: true,
        alreadyInitialized: true,
        message: 'BPA follow-up system is already active',
        status,
      });
    }

    // Initialize the system
    const result = initializeNAWCADBPAFollowUp();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'BPA follow-up system initialized successfully by Alexis Best',
        data: result,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to initialize BPA follow-up system',
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error initializing BPA follow-up:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Server error initializing BPA follow-up system',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const status = getBPAFollowUpStatus();

    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error('Error getting BPA follow-up status:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get BPA follow-up status',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
