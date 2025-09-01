import { NextRequest, NextResponse } from 'next/server';
import { VinVerificationService } from '../../services/vin-verification-service';

/**
 * FREE VIN Verification API using NHTSA
 * NO API KEY REQUIRED - Completely free government service
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vin, insuranceCertificate, fmcsaData, licensePlate, state } = body;

    if (!vin) {
      return NextResponse.json({ error: 'VIN is required' }, { status: 400 });
    }

    console.info(`🔍 API: Starting VIN verification for: ${vin}`);

    // If we have all data for comprehensive verification
    if (licensePlate && state) {
      const comprehensiveResult =
        await VinVerificationService.comprehensiveVehicleVerification(
          vin,
          licensePlate,
          state,
          insuranceCertificate,
          fmcsaData
        );

      return NextResponse.json({
        success: true,
        comprehensive: true,
        ...comprehensiveResult,
        timestamp: new Date().toISOString(),
      });
    }

    // Basic VIN verification only
    const vinData = await VinVerificationService.verifyVinWithNHTSA(vin);
    const recalls = await VinVerificationService.checkVinRecalls(vin);

    // Insurance verification if certificate provided
    let insuranceVerification = null;
    if (insuranceCertificate) {
      insuranceVerification = VinVerificationService.verifyVehicleOnInsurance(
        vinData,
        insuranceCertificate
      );
    }

    return NextResponse.json({
      success: true,
      comprehensive: false,
      approved:
        vinData.valid &&
        (!insuranceVerification || insuranceVerification.onInsurance),
      vinData,
      recalls,
      insuranceVerification,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('VIN verification API error:', error);
    return NextResponse.json(
      {
        error: 'VIN verification failed',
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Get VIN information for a previously verified VIN
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vin = searchParams.get('vin');

    if (!vin) {
      return NextResponse.json(
        { error: 'VIN parameter is required' },
        { status: 400 }
      );
    }

    // Basic VIN lookup
    const vinData = await VinVerificationService.verifyVinWithNHTSA(vin);
    const recalls = await VinVerificationService.checkVinRecalls(vin);

    return NextResponse.json({
      success: true,
      vin,
      vinData,
      recalls,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('VIN lookup API error:', error);
    return NextResponse.json(
      {
        error: 'VIN lookup failed',
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
