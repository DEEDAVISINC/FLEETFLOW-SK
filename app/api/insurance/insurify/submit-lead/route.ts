import { NextRequest, NextResponse } from 'next/server';

// Insurify Partnership API Integration
// Handles lead submission to Insurify's 120+ carrier network

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    const insurifyApiKey = process.env.INSURIFY_API_KEY;
    const insurifyPartnerId = process.env.INSURIFY_PARTNER_ID;
    const insurifyEndpoint = process.env.INSURIFY_API_ENDPOINT || 'https://partners.insurify.com/api/leads';

    if (!insurifyApiKey || !insurifyPartnerId) {
      return NextResponse.json({
        success: false,
        error: 'Insurify API credentials not configured'
      }, { status: 500 });
    }

    // Transform payload for Insurify API
    const insurifyPayload = {
      partner_id: insurifyPartnerId,
      lead: {
        business: {
          company_name: payload.lead.business.company_name,
          legal_name: payload.lead.business.company_name,
          dot_number: payload.lead.business.dot_number,
          mc_number: payload.lead.business.mc_number,
          vehicle_count: payload.lead.business.vehicle_count,
          driver_count: payload.lead.business.driver_count,
          years_in_business: payload.lead.business.years_in_business || '1-2',
          industry: 'transportation',
          business_type: 'trucking_company',
          operating_radius: 'interstate',
          annual_revenue: estimateRevenue(payload.lead.business.vehicle_count),
          headquarters_state: 'multi_state',
          equipment_types: ['dry_van', 'refrigerated', 'flatbed'],
          cargo_types: ['general_freight', 'food_products', 'manufactured_goods']
        },
        contact: {
          name: payload.lead.contact.name,
          first_name: payload.lead.contact.name.split(' ')[0],
          last_name: payload.lead.contact.name.split(' ').slice(1).join(' '),
          email: payload.lead.contact.email,
          phone: payload.lead.contact.phone,
          role: payload.lead.contact.role || 'owner',
          title: 'Owner/Operator',
          preferred_contact_method: 'phone',
          best_time_to_call: 'business_hours'
        },
        insurance_types: payload.lead.insurance_types,
        coverage_requirements: {
          commercial_auto: {
            liability_limit: '$1,000,000',
            physical_damage: 'comprehensive_collision',
            uninsured_motorist: true
          },
          general_liability: {
            occurrence_limit: '$1,000,000',
            aggregate_limit: '$2,000,000'
          },
          cargo: {
            limit: '$100,000',
            deductible: '$1,000'
          }
        },
        current_situation: {
          has_current_coverage: true,
          renewal_approaching: true,
          shopping_reason: 'better_rates',
          decision_timeframe: '30_days'
        },
        lead_metadata: {
          source: 'fleetflow_referral',
          source_detail: 'FleetFlow Insurance Marketplace',
          partner_name: 'FleetFlow',
          lead_quality: 'high',
          lead_score: 90,
          conversion_likelihood: 'high',
          submitted_at: new Date().toISOString(),
          urgency: 'medium',
          notes: `Premium lead from FleetFlow marketplace. Fleet size: ${payload.lead.business.vehicle_count} vehicles, ${payload.lead.business.driver_count} drivers. Actively shopping for better rates.`
        }
      }
    };

    // Submit to Insurify API
    const response = await fetch(insurifyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${insurifyApiKey}`,
        'X-Partner-ID': insurifyPartnerId,
        'X-API-Version': '2024-01',
        'User-Agent': 'FleetFlow/1.0'
      },
      body: JSON.stringify(insurifyPayload)
    });

    const result = await response.json();

    if (response.ok) {
      // Log successful submission for commission tracking
      console.info('Insurify lead submitted successfully:', {
        leadId: result.lead_id,
        caseNumber: result.case_number,
        companyName: payload.lead.business.company_name,
        submittedAt: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        leadId: result.lead_id || `INSURIFY-${Date.now()}`,
        caseNumber: result.case_number,
        trackingUrl: result.tracking_url,
        estimatedContact: '24-48 hours',
        carrierCount: '120+ carriers',
        commissionStructure: 'Per conversion',
        partnerInfo: {
          name: 'Insurify Partnership',
          website: 'https://insurify.com',
          description: 'Leading insurance technology platform with 120+ A-rated carriers',
          specialties: ['Commercial Auto', 'General Liability', 'Workers Comp', 'Cargo', 'Cyber'],
          carrier_network: 120,
          avg_quotes_per_lead: 8,
          conversion_rate: '25-35%'
        }
      });
    } else {
      throw new Error(result.message || `HTTP ${response.status}: ${response.statusText}`);
    }

  } catch (error) {
    console.error('Insurify API submission error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to submit lead to Insurify',
      details: error instanceof Error ? error.message : 'Unknown error',
      retryable: true
    }, { status: 500 });
  }
}

// Get commission status from Insurify
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json({
        success: false,
        error: 'Lead ID required'
      }, { status: 400 });
    }

    const insurifyApiKey = process.env.INSURIFY_API_KEY;
    const insurifyPartnerId = process.env.INSURIFY_PARTNER_ID;
    const insurifyEndpoint = process.env.INSURIFY_API_ENDPOINT || 'https://partners.insurify.com/api';

    if (!insurifyApiKey || !insurifyPartnerId) {
      return NextResponse.json({
        success: false,
        error: 'Insurify API credentials not configured'
      }, { status: 500 });
    }

    // Get lead status from Insurify
    const response = await fetch(`${insurifyEndpoint}/leads/${leadId}/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${insurifyApiKey}`,
        'X-Partner-ID': insurifyPartnerId,
        'X-API-Version': '2024-01'
      }
    });

    const result = await response.json();

    if (response.ok) {
      return NextResponse.json({
        success: true,
        leadStatus: {
          leadId: result.lead_id,
          caseNumber: result.case_number,
          status: result.status, // 'submitted', 'processing', 'quoted', 'converted', 'closed'
          lastUpdated: result.last_updated,
          contactAttempts: result.contact_attempts || 0,
          carriersMatched: result.carriers_matched || 0,
          quotesGenerated: result.quotes_generated || 0,
          policyBound: result.policy_bound || false,
          commissionEarned: result.commission_earned || 0,
          commissionStatus: result.commission_status || 'pending',
          bestQuote: result.best_quote,
          carrierDetails: result.carrier_details || [],
          nextSteps: result.next_steps || [],
          notes: result.notes
        }
      });
    } else {
      throw new Error(result.message || 'Failed to get lead status');
    }

  } catch (error) {
    console.error('Insurify status check error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to check lead status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper function to estimate annual revenue based on fleet size
function estimateRevenue(vehicleCount: number): string {
  if (vehicleCount <= 5) return '$250K-$500K';
  if (vehicleCount <= 15) return '$500K-$1.5M';
  if (vehicleCount <= 50) return '$1.5M-$5M';
  if (vehicleCount <= 100) return '$5M-$15M';
  return '$15M+';
}