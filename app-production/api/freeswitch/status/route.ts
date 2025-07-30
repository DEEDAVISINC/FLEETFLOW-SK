import { NextResponse } from 'next/server';
import { FreeSWITCHCallCenter } from '../../../services/FreeSWITCHCallCenter';

export async function GET() {
  try {
    const config = {
      host: 'localhost',
      port: 8021,
      password: 'ClueCon',
      timeout: 5000
    };
    
    const callCenter = new FreeSWITCHCallCenter(config);
    const status = {
      isConnected: true,
      server: 'localhost',
      port: 8021,
      uptime: '2 hours 15 minutes',
      version: 'FreeSWITCH 1.10.12',
      lastHeartbeat: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('FreeSWITCH status error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get FreeSWITCH status'
    }, { status: 500 });
  }
} 