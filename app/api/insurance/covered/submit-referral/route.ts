import { NextRequest, NextResponse } from 'next/server';

// Covered Embedded Insurance API Integration
// Handles referral submissions to Covered's partner program

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const coveredApiKey = process.env.COVERED_API_KEY;
    const coveredPartnerCode = process.env.COVERED_PARTNER_CODE;
    const coveredEndpoint =
      process.env.COVERED_API_ENDPOINT ||
      'https://api.covered.com/partners/referrals';

    if (!coveredApiKey || !coveredPartnerCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Covered API credentials not configured',
        },
        { status: 500 }
      );
    }

    // Transform payload for Covered API
    const coveredPayload = {
      partner_code: coveredPartnerCode,
      referral: {
        business_info: {
          name: payload.referral.business_info.name,
          legal_name: payload.referral.business_info.name,
          mc_number: payload.referral.business_info.mc_number,
          dot_number: payload.referral.business_info.dot_number,
          fleet_size: payload.referral.business_info.fleet_size,
          driver_count: payload.referral.business_info.driver_count,
          years_in_business: payload.referral.business_info.business_years || 1,
          annual_mileage:
            payload.referral.business_info.annual_mileage ||
            payload.referral.business_info.fleet_size * 100000,
          industry_code: 'transportation',
          business_type: 'for_hire_trucking',
          operating_authority: 'interstate',
          cargo_types: ['general_freight', 'dry_van', 'refrigerated'],
          primary_routes: ['interstate', 'regional'],
        },
        contact_info: {
          primary_contact: payload.referral.contact_info.primary_contact,
          email: payload.referral.contact_info.email,
          phone: payload.referral.contact_info.phone,
          title: 'owner',
          preferred_contact_time: 'business_hours',
          timezone: 'America/New_York',
        },
        insurance_needs: payload.referral.insurance_needs,
        current_coverage: {
          has_existing_coverage: true,
          renewal_date: new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000
          ).toISOString(), // 90 days from now
          current_premium: null,
          satisfaction_level: 'neutral',
        },
        referral_source: 'fleetflow_platform',
        lead_quality: 'high',
        urgency: 'medium',
        submitted_at: new Date().toISOString(),
        notes: `High-quality lead from FleetFlow marketplace. Company: ${payload.referral.business_info.name}, Fleet: ${payload.referral.business_info.fleet_size} vehicles, Drivers: ${payload.referral.business_info.driver_count}`,
        custom_fields: {
          lead_source_detail: 'FleetFlow Insurance Marketplace',
          referral_partner: 'FleetFlow',
          lead_score: 85,
          conversion_probability: 'high',
        },
      },
    };

    // Submit to Covered API
    const response = await fetch(coveredEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${coveredApiKey}`,
        'X-Partner-Code': coveredPartnerCode,
        'X-API-Version': '2024-01',
        'User-Agent': 'FleetFlow/1.0',
      },
      body: JSON.stringify(coveredPayload),
    });

    const result = await response.json();

    if (response.ok) {
      // Log successful submission for revenue tracking
      console.log('Covered referral submitted successfully:', {
        referralId: result.referral_id,
        trackingNumber: result.tracking_number,
        companyName: payload.referral.business_info.name,
        submittedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        referralId: result.referral_id || `COVERED-${Date.now()}`,
        trackingNumber: result.tracking_number,
        portalUrl: result.portal_url,
        estimatedContact: '12-24 hours',
        revenueShare: '15-20%',
        carrierNetwork: '45+ A-rated carriers',
        partnerInfo: {
          name: 'Covered Embedded Insurance',
          website: 'https://covered.com',
          description:
            'SOC 2 certified embedded insurance platform with white-label solutions',
          specialties: [
            'Commercial Auto',
            'General Liability',
            'Workers Comp',
            'Cyber Liability',
          ],
          certifications: ['SOC 2 Type II', 'ISO 27001'],
          carrier_count: 45,
        },
      });
    } else {
      throw new Error(
        result.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error('Covered API submission error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit referral to Covered',
        details: error instanceof Error ? error.message : 'Unknown error',
        retryable: true,
      },
      { status: 500 }
    );
  }
}

// Get revenue share status from Covered
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const referralId = searchParams.get('referralId');

    if (!referralId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Referral ID required',
        },
        { status: 400 }
      );
    }

    const coveredApiKey = process.env.COVERED_API_KEY;
    const coveredPartnerCode = process.env.COVERED_PARTNER_CODE;
    const coveredEndpoint =
      process.env.COVERED_API_ENDPOINT || 'https://api.covered.com/partners';

    if (!coveredApiKey || !coveredPartnerCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Covered API credentials not configured',
        },
        { status: 500 }
      );
    }

    // Get referral status from Covered
    const response = await fetch(
      `${coveredEndpoint}/referrals/${referralId}/status`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${coveredApiKey}`,
          'X-Partner-Code': coveredPartnerCode,
          'X-API-Version': '2024-01',
        },
      }
    );

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        referralStatus: {
          referralId: result.referral_id,
          status: result.status, // 'submitted', 'contacted', 'quoted', 'bound', 'declined'
          lastUpdated: result.last_updated,
          contactAttempts: result.contact_attempts || 0,
          quotesGenerated: result.quotes_generated || 0,
          policyBound: result.policy_bound || false,
          revenueEarned: result.revenue_earned || 0,
          revenueStatus: result.revenue_status || 'pending',
          revenueShare: result.revenue_share_percentage || '15-20%',
          carrierMatches: result.carrier_matches || [],
          nextSteps: result.next_steps || [],
          notes: result.notes,
        },
      });
    } else {
      throw new Error(result.message || 'Failed to get referral status');
    }
  } catch (error) {
    console.error('Covered status check error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check referral status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
