import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const agents = [
      {
        id: 'agent_001',
        name: 'Sarah Johnson',
        status: 'available',
        skills: ['government_contracts', 'freight_brokerage'],
        performance: { calls: 47, conversions: 12, avgTime: 9.2 },
        queue: 'sales'
      },
      {
        id: 'agent_002',
        name: 'Mike Chen',
        status: 'on_call',
        skills: ['dispatch', 'carrier_relations'],
        performance: { calls: 38, conversions: 8, avgTime: 7.8 },
        queue: 'dispatch'
      },
      {
        id: 'agent_003',
        name: 'Jessica Rodriguez',
        status: 'available',
        skills: ['customer_service', 'billing'],
        performance: { calls: 52, conversions: 15, avgTime: 6.4 },
        queue: 'support'
      }
    ];
    
    return NextResponse.json({
      success: true,
      data: agents
    });
  } catch (error) {
    console.error('FreeSWITCH agents error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get FreeSWITCH agents'
    }, { status: 500 });
  }
} 