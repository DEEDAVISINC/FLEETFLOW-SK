/**
 * Sales Copilot API - Process Conversation
 * Handles real-time conversation processing for live calls
 */

import { NextRequest, NextResponse } from 'next/server';
import { salesCopilotAI } from '../../../services/SalesCopilotAI';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { callId, agentMessage, prospectResponse, prospectInfo, action } =
      body;

    if (!callId) {
      return NextResponse.json(
        { error: 'callId is required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'start_call':
        result = await salesCopilotAI.startCallGuidance(
          callId,
          'api_agent', // Default agent ID for API calls
          prospectInfo
        );
        break;

      case 'process_conversation':
        if (!agentMessage || !prospectResponse) {
          return NextResponse.json(
            {
              error:
                'agentMessage and prospectResponse are required for conversation processing',
            },
            { status: 400 }
          );
        }
        result = await salesCopilotAI.processConversationInput(
          callId,
          agentMessage,
          prospectResponse
        );
        break;

      case 'update_prospect':
        if (!prospectInfo) {
          return NextResponse.json(
            { error: 'prospectInfo is required for prospect updates' },
            { status: 400 }
          );
        }
        salesCopilotAI.updateProspectInfo(callId, prospectInfo);
        result = { success: true, message: 'Prospect info updated' };
        break;

      case 'end_call':
        const outcome = body.outcome || 'follow_up';
        await salesCopilotAI.endCallGuidance(callId, outcome);
        result = { success: true, message: 'Call guidance ended' };
        break;

      case 'get_context':
        result = salesCopilotAI.getActiveCallContext(callId);
        break;

      default:
        return NextResponse.json(
          {
            error:
              'Invalid action. Supported actions: start_call, process_conversation, update_prospect, end_call, get_context',
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      callId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Sales Copilot API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const callId = searchParams.get('callId');
    const action = searchParams.get('action') || 'get_context';

    if (action === 'get_context' && callId) {
      const context = salesCopilotAI.getActiveCallContext(callId);
      return NextResponse.json({
        success: true,
        data: context,
        callId,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === 'active_calls') {
      const activeCalls = salesCopilotAI.getAllActiveCalls();
      return NextResponse.json({
        success: true,
        data: activeCalls,
        count: activeCalls.length,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: 'Invalid action or missing callId' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Sales Copilot API GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


