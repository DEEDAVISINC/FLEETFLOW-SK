/**
 * API Route for AI Communication Setup
 * Handles activation of AI staff communication capabilities for ddavis@freight1stdirect.com
 */

import { NextRequest, NextResponse } from 'next/server';
import { aiCommunicationService } from '../../../services/AICommunicationIntegrationService';

export async function POST(request: NextRequest) {
  try {
    const { action, staffId, taskType, priority, instructions } =
      await request.json();

    switch (action) {
      case 'setup_alexis':
        const alexisResult =
          await aiCommunicationService.setupAlexisExecutiveAssistant();
        return NextResponse.json({
          success: alexisResult,
          message: alexisResult
            ? 'Alexis Best activated as AI Executive Assistant for ddavis@freight1stdirect.com'
            : 'Failed to activate Alexis Best',
          staffId: 'alexis-executive-023',
          emailAddress: 'ddavis@freight1stdirect.com',
        });

      case 'activate_email':
        const emailResult =
          await aiCommunicationService.activateEmailMonitoring(staffId);
        return NextResponse.json({
          success: emailResult,
          message: emailResult
            ? 'Email monitoring activated for ddavis@freight1stdirect.com'
            : 'Failed to activate email monitoring',
          staffId,
          emailAddress: 'ddavis@freight1stdirect.com',
        });

      case 'test_email':
        const testResult = await aiCommunicationService.testEmailConnection();
        return NextResponse.json({
          success: testResult,
          message: testResult
            ? 'Email connection test successful'
            : 'Email connection test failed',
          emailAddress: 'ddavis@freight1stdirect.com',
        });

      case 'assign_task':
        const taskId = await aiCommunicationService.assignCommunicationTask(
          staffId,
          taskType,
          priority,
          instructions
        );
        return NextResponse.json({
          success: true,
          message: 'Task assigned successfully',
          taskId,
          staffId,
        });

      default:
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid action specified',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AI Communication setup error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');

    if (staffId) {
      const status = await aiCommunicationService.getStaffStatus(staffId);
      return NextResponse.json({
        success: true,
        data: status,
      });
    } else {
      const allStatus = await aiCommunicationService.getAllStaffStatus();
      return NextResponse.json({
        success: true,
        data: allStatus,
      });
    }
  } catch (error) {
    console.error('AI Communication status error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
