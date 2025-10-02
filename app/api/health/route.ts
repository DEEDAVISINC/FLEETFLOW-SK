import { NextResponse } from 'next/server';

/**
 * Health check endpoint for Chrome extension
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'FleetFlow DDP Lead Generation',
    timestamp: new Date().toISOString(),
  });
}
