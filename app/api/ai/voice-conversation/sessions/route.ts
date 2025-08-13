import { NextRequest, NextResponse } from 'next/server';

// Mock active sessions for demo
const mockActiveSessions = [
  {
    callId: 'CALL-001',
    carrierPhone: '+1-555-0123',
    startTime: new Date(Date.now() - 8 * 60000).toISOString(), // 8 minutes ago
    conversationStage: 'rate_negotiation',
    aiConfidence: 0.87,
    carrierInfo: {
      companyName: 'ABC Trucking',
      mcNumber: 'MC-123456',
      equipmentTypes: ['Dry Van', 'Flatbed'],
    },
    transferRequired: false,
    conversationTurns: 8,
  },
  {
    callId: 'CALL-002',
    carrierPhone: '+1-555-0456',
    startTime: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
    conversationStage: 'qualification',
    aiConfidence: 0.92,
    carrierInfo: {
      companyName: 'XYZ Logistics',
      mcNumber: 'MC-789012',
      equipmentTypes: ['Reefer'],
    },
    transferRequired: false,
    conversationTurns: 4,
  },
  {
    callId: 'CALL-003',
    carrierPhone: '+1-555-0789',
    startTime: new Date(Date.now() - 12 * 60000).toISOString(), // 12 minutes ago
    conversationStage: 'load_discussion',
    aiConfidence: 0.65,
    carrierInfo: {
      companyName: 'Global Transport',
    },
    transferRequired: true,
    conversationTurns: 12,
  },
];

export async function GET(request: NextRequest) {
  try {
    // In production, this would fetch from your call center system
    // For now, return mock data with some randomization

    const sessions = mockActiveSessions.map((session) => ({
      ...session,
      // Add some realistic variation
      aiConfidence: Math.max(
        0.5,
        Math.min(1.0, session.aiConfidence + (Math.random() - 0.5) * 0.1)
      ),
      conversationTurns:
        session.conversationTurns + Math.floor(Math.random() * 3),
    }));

    return NextResponse.json({
      success: true,
      sessions,
      totalActiveCalls: sessions.length,
      aiHandledCalls: sessions.filter((s) => !s.transferRequired).length,
    });
  } catch (error) {
    console.error('Failed to fetch active sessions:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch active sessions',
        sessions: [],
      },
      { status: 500 }
    );
  }
}




