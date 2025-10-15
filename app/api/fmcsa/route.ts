import { NextRequest, NextResponse } from 'next/server';

const FMCSA_API_KEY = '7de24c4a0eade12f34685829289e0446daf7880e';
const FMCSA_BASE_URL = 'https://mobile.fmcsa.dot.gov/qc';

// GET /api/fmcsa?name=carrier_name - Search carriers by name
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const carrierName = searchParams.get('name');

    if (!carrierName) {
      return NextResponse.json(
        { success: false, error: 'Carrier name is required' },
        { status: 400 }
      );
    }

    const encodedName = encodeURIComponent(carrierName.trim());
    const url = `${FMCSA_BASE_URL}/name/${encodedName}?webKey=${FMCSA_API_KEY}`;

    console.log('📡 FMCSA API Request:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({
          success: false,
          error: 'Carrier not found',
          data: null,
        });
      }

      const errorText = await response.text();
      console.error('FMCSA API Error:', response.status, errorText);

      return NextResponse.json(
        {
          success: false,
          error: `FMCSA API error: ${response.status}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error('FMCSA API route error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch from FMCSA API',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}



