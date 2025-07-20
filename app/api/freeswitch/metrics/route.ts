import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const metrics = {
      totalCalls: 2847,
      connectedCalls: 2178,
      averageCallTime: 8.5,
      conversionRate: 18.3,
      leadQuality: 82,
      revenue: 2654200,
      queueWaitTime: 2.3,
      abandonRate: 5.2,
      answerRate: 76.5,
      activeAgents: 12,
      totalAgents: 15
    };
    
    return NextResponse.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('FreeSWITCH metrics error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get FreeSWITCH metrics'
    }, { status: 500 });
  }
} 