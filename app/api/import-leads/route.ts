import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint to receive leads from Chrome extension or CSV upload
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log(
      `📥 Received ${data.companies?.length || 0} leads from ${data.source}`
    );

    // In a real app, you'd save to database here
    // For now, we'll just return success and the frontend will handle it

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${data.companies?.length || 0} leads`,
      count: data.companies?.length || 0,
    });
  } catch (error) {
    console.error('Error importing leads:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to import leads' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Import Leads API is running',
  });
}
