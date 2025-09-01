import { NextRequest, NextResponse } from 'next/server';

// Tivly Affiliate API Integration
// Handles lead submission to Tivly's affiliate program

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const tivlyApiKey = process.env.TIVLY_API_KEY;
    const tivlyPartnerId = process.env.TIVLY_PARTNER_ID;
    const tivlyEndpoint =
      process.env.TIVLY_API_ENDPOINT || 'https://api.tivly.com/affiliate/leads';

    if (!tivlyApiKey || !tivlyPartnerId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tivly API credentials not configured',
        },
        { status: 500 }
      );
    }

    // Transform payload for Tivly API
    const tivlyPayload = {
      partner_id: tivlyPartnerId,
      lead: {
        business: {
          company_name: payload.business.company_name,
          mc_number: payload.business.mc_number,
          dot_number: payload.business.dot_number,
          years_in_business: payload.business.years_in_business,
          fleet_size: payload.business.fleet_size,
          driver_count: payload.business.driver_count,
          business_type: 'trucking',
          annual_miles: payload.business.fleet_size * 100000, // Estimate
          operating_radius: 'interstate',
          cargo_types: ['general_freight', 'refrigerated', 'dry_van'],
        },
        contact: {
          first_name: payload.contact.first_name,
          last_name: payload.contact.last_name,
          email: payload.contact.email,
          phone: payload.contact.phone,
          title: 'owner',
          preferred_contact_method: 'phone',
        },
        coverage_requested: payload.coverage_requested,
        lead_source: 'fleetflow_referral',
        referral_partner: 'FleetFlow',
        submitted_at: new Date().toISOString(),
        priority: 'high',
        notes: `Lead generated through FleetFlow insurance marketplace. Fleet size: ${payload.business.fleet_size}, Driver count: ${payload.business.driver_count}`,
      },
    };

    // Submit to Tivly API
    const response = await fetch(tivlyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tivlyApiKey}`,
        'X-Partner-ID': tivlyPartnerId,
        'X-API-Version': '2024-01',
        'User-Agent': 'FleetFlow/1.0',
      },
      body: JSON.stringify(tivlyPayload),
    });

    const result = await response.json();

    if (response.ok) {
      // Log successful submission for commission tracking
      console.info('Tivly lead submitted successfully:', {
        leadId: result.lead_id,
        referenceNumber: result.reference_number,
        companyName: payload.business.company_name,
        submittedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        leadId: result.lead_id || `TIVLY-${Date.now()}`,
        referenceNumber: result.reference_number,
        trackingUrl: result.tracking_url,
        estimatedContact: '24-48 hours',
        commissionPotential: '$300-$2,000+',
        renewalCommission: 'Yes - recurring',
        partnerInfo: {
          name: 'Tivly Affiliate Program',
          website: 'https://tivly.com',
          description:
            'Leading trucking insurance marketplace with 45+ A-rated carriers',
          specialties: [
            'Commercial Auto',
            'General Liability',
            'Workers Comp',
            'Cargo',
          ],
        },
      });
    } else {
      throw new Error(
        result.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error('Tivly API submission error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit lead to Tivly',
        details: error instanceof Error ? error.message : 'Unknown error',
        retryable: true,
      },
      { status: 500 }
    );
  }
}

// Get commission status from Tivly
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');
    const partnerId = searchParams.get('partnerId');

    if (!leadId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Lead ID required',
        },
        { status: 400 }
      );
    }

    const tivlyApiKey = process.env.TIVLY_API_KEY;
    const tivlyPartnerId = process.env.TIVLY_PARTNER_ID;
    const tivlyEndpoint =
      process.env.TIVLY_API_ENDPOINT || 'https://api.tivly.com/affiliate';

    if (!tivlyApiKey || !tivlyPartnerId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tivly API credentials not configured',
        },
        { status: 500 }
      );
    }

    // Get lead status from Tivly
    const response = await fetch(`${tivlyEndpoint}/leads/${leadId}/status`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tivlyApiKey}`,
        'X-Partner-ID': tivlyPartnerId,
        'X-API-Version': '2024-01',
      },
    });

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        leadStatus: {
          leadId: result.lead_id,
          status: result.status, // 'submitted', 'contacted', 'quoted', 'converted', 'declined'
          lastUpdated: result.last_updated,
          contactAttempts: result.contact_attempts || 0,
          quotesProvided: result.quotes_provided || 0,
          conversionStatus: result.conversion_status,
          commissionEarned: result.commission_earned || 0,
          commissionStatus: result.commission_status || 'pending',
          notes: result.notes,
        },
      });
    } else {
      throw new Error(result.message || 'Failed to get lead status');
    }
  } catch (error) {
    console.error('Tivly status check error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check lead status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
