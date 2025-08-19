/**
 * API Route for handling compliance verification during carrier onboarding
 */

import { NextResponse } from 'next/server';
import { dotComplianceMonitor } from '../../../services/DOTComplianceMonitor';
import { onboardingComplianceService } from '../../../services/OnboardingComplianceService';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.carrierId || !data.dotNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: carrierId, dotNumber' },
        { status: 400 }
      );
    }

    // Process onboarding compliance verification
    const verification = await onboardingComplianceService.processOnboarding({
      carrierId: data.carrierId,
      dotNumber: data.dotNumber,
      companyName: data.companyName || '',
      documents: data.documents || [],
    });

    // If any documents have expiration dates, send to monitoring service
    if (
      verification.requiredDocuments.length > 0 ||
      verification.optionalDocuments.length > 0
    ) {
      const allDocuments = [
        ...verification.requiredDocuments,
        ...verification.optionalDocuments,
      ].filter((doc) => doc.expirationDate);

      if (allDocuments.length > 0) {
        await dotComplianceMonitor.checkDocumentExpirations(
          data.carrierId,
          data.dotNumber,
          allDocuments
        );
      }
    }

    // Return verification results
    return NextResponse.json({
      success: true,
      verification,
    });
  } catch (error) {
    console.error('Error during compliance verification:', error);
    return NextResponse.json(
      { error: 'Failed to process compliance verification' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.carrierId || !data.dotNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: carrierId, dotNumber' },
        { status: 400 }
      );
    }

    // Update compliance status
    const verification =
      await onboardingComplianceService.updateComplianceStatus(
        data.carrierId,
        data.dotNumber,
        data.updates || {}
      );

    // Return updated verification results
    return NextResponse.json({
      success: true,
      verification,
    });
  } catch (error) {
    console.error('Error updating compliance status:', error);
    return NextResponse.json(
      { error: 'Failed to update compliance status' },
      { status: 500 }
    );
  }
}
