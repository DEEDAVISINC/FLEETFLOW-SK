import { NextRequest, NextResponse } from 'next/server';

// Insurance Quote Submission API Route
// Handles form submissions and distributes leads to insurance partners

interface QuoteSubmission {
  // Business Information
  companyName: string;
  mcNumber?: string;
  dotNumber?: string;
  yearsInBusiness?: string;
  vehicleCount: number;
  driverCount: number;

  // Contact Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Coverage Types
  coverageTypes: string[];

  // Optional fields
  annualRevenue?: string;
  businessType?: string;
  operatingRadius?: string;
}

// Tivly Affiliate API Integration
async function submitToTivly(submission: QuoteSubmission) {
  const tivlyEndpoint =
    process.env.TIVLY_API_ENDPOINT || 'https://api.tivly.com/affiliate/leads';
  const tivlyApiKey = process.env.TIVLY_API_KEY;
  const tivlyPartnerId = process.env.TIVLY_PARTNER_ID;

  if (!tivlyApiKey || !tivlyPartnerId) {
    console.warn('Tivly API credentials not configured');
    return {
      success: false,
      partner: 'tivly',
      error: 'API credentials not configured',
    };
  }

  try {
    const payload = {
      partner_id: tivlyPartnerId,
      lead: {
        business: {
          company_name: submission.companyName,
          mc_number: submission.mcNumber,
          dot_number: submission.dotNumber,
          years_in_business: submission.yearsInBusiness,
          fleet_size: submission.vehicleCount,
          driver_count: submission.driverCount,
          business_type: 'trucking',
        },
        contact: {
          first_name: submission.firstName,
          last_name: submission.lastName,
          email: submission.email,
          phone: submission.phone,
        },
        coverage_requested: submission.coverageTypes,
        lead_source: 'fleetflow_referral',
        submitted_at: new Date().toISOString(),
      },
    };

    const response = await fetch(tivlyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tivlyApiKey}`,
        'X-Partner-ID': tivlyPartnerId,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        partner: 'tivly',
        leadId: result.lead_id || `TIVLY-${Date.now()}`,
        referenceNumber: result.reference_number,
        estimatedContact: '24-48 hours',
        commissionPotential: '$300-$2,000+',
      };
    } else {
      throw new Error(result.message || 'API request failed');
    }
  } catch (error) {
    console.error('Tivly submission error:', error);
    return {
      success: false,
      partner: 'tivly',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Covered Embedded Insurance API Integration
async function submitToCovered(submission: QuoteSubmission) {
  const coveredEndpoint =
    process.env.COVERED_API_ENDPOINT ||
    'https://api.covered.com/partners/referrals';
  const coveredApiKey = process.env.COVERED_API_KEY;
  const coveredPartnerCode = process.env.COVERED_PARTNER_CODE;

  if (!coveredApiKey || !coveredPartnerCode) {
    console.warn('Covered API credentials not configured');
    return {
      success: false,
      partner: 'covered',
      error: 'API credentials not configured',
    };
  }

  try {
    const payload = {
      partner_code: coveredPartnerCode,
      referral: {
        business_info: {
          name: submission.companyName,
          mc_number: submission.mcNumber,
          dot_number: submission.dotNumber,
          fleet_size: submission.vehicleCount,
          driver_count: submission.driverCount,
          years_in_business: parseInt(submission.yearsInBusiness || '1'),
          industry: 'transportation',
        },
        contact_info: {
          primary_contact: `${submission.firstName} ${submission.lastName}`,
          email: submission.email,
          phone: submission.phone,
        },
        insurance_needs: submission.coverageTypes,
        referral_source: 'fleetflow_platform',
        submitted_at: new Date().toISOString(),
      },
    };

    const response = await fetch(coveredEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${coveredApiKey}`,
        'X-Partner-Code': coveredPartnerCode,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        partner: 'covered',
        leadId: result.referral_id || `COVERED-${Date.now()}`,
        trackingNumber: result.tracking_number,
        estimatedContact: '12-24 hours',
        revenueShare: '15-20%',
      };
    } else {
      throw new Error(result.message || 'API request failed');
    }
  } catch (error) {
    console.error('Covered submission error:', error);
    return {
      success: false,
      partner: 'covered',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Insurify Partnership API Integration
async function submitToInsurify(submission: QuoteSubmission) {
  const insurifyEndpoint =
    process.env.INSURIFY_API_ENDPOINT ||
    'https://partners.insurify.com/api/leads';
  const insurifyApiKey = process.env.INSURIFY_API_KEY;
  const insurifyPartnerId = process.env.INSURIFY_PARTNER_ID;

  if (!insurifyApiKey || !insurifyPartnerId) {
    console.warn('Insurify API credentials not configured');
    return {
      success: false,
      partner: 'insurify',
      error: 'API credentials not configured',
    };
  }

  try {
    const payload = {
      partner_id: insurifyPartnerId,
      lead: {
        business: {
          company_name: submission.companyName,
          dot_number: submission.dotNumber,
          mc_number: submission.mcNumber,
          vehicle_count: submission.vehicleCount,
          driver_count: submission.driverCount,
          industry: 'transportation',
          years_in_business: submission.yearsInBusiness,
        },
        contact: {
          name: `${submission.firstName} ${submission.lastName}`,
          email: submission.email,
          phone: submission.phone,
          role: 'owner',
        },
        insurance_types: submission.coverageTypes.map((type) => {
          const typeMap: { [key: string]: string } = {
            commercial_auto: 'commercial_vehicle',
            general_liability: 'general_liability',
            workers_comp: 'workers_compensation',
            cargo: 'cargo_insurance',
            garage_liability: 'garage_keepers',
            cyber_liability: 'cyber_liability',
          };
          return typeMap[type] || type;
        }),
        source: 'fleetflow_referral',
        submitted_at: new Date().toISOString(),
      },
    };

    const response = await fetch(insurifyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${insurifyApiKey}`,
        'X-Partner-ID': insurifyPartnerId,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      return {
        success: true,
        partner: 'insurify',
        leadId: result.lead_id || `INSURIFY-${Date.now()}`,
        caseNumber: result.case_number,
        estimatedContact: '24-48 hours',
        carrierCount: '120+ carriers',
      };
    } else {
      throw new Error(result.message || 'API request failed');
    }
  } catch (error) {
    console.error('Insurify submission error:', error);
    return {
      success: false,
      partner: 'insurify',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// FMCSA Verification (already implemented in FleetFlow)
async function verifyFMCSA(dotNumber?: string) {
  if (!dotNumber) return { verified: false, reason: 'No DOT number provided' };

  const fmcsaApiKey =
    process.env.FMCSA_API_KEY || '7de24c4a0eade12f34685829289e0446daf7880e';
  const fmcsaEndpoint = `https://mobile.fmcsa.dot.gov/qc/id/${dotNumber}?webKey=${fmcsaApiKey}`;

  try {
    const response = await fetch(fmcsaEndpoint);
    const result = await response.json();

    if (response.ok && result.content && result.content.length > 0) {
      const carrier = result.content[0];
      return {
        verified: true,
        carrierName: carrier.legalName,
        safetyRating: carrier.safetyRating,
        mcNumber: carrier.docketNumbers?.[0]?.docketNumber,
        isActive: carrier.carrierOperationCode === 'A',
      };
    }

    return { verified: false, reason: 'Carrier not found in FMCSA database' };
  } catch (error) {
    console.error('FMCSA verification error:', error);
    return { verified: false, reason: 'FMCSA verification failed' };
  }
}

// Send confirmation email
async function sendConfirmationEmail(
  submission: QuoteSubmission,
  results: any[]
) {
  const successfulSubmissions = results.filter((r) => r.success);
  const partnerNames = successfulSubmissions.map((r) => {
    const nameMap: { [key: string]: string } = {
      tivly: 'Tivly Affiliate Program',
      covered: 'Covered Embedded Insurance',
      insurify: 'Insurify Partnership',
    };
    return nameMap[r.partner] || r.partner;
  });

  try {
    // Send customer confirmation email
    const emailResponse = await fetch('/api/email/send-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: submission.email,
        subject: `✅ Your Insurance Quote Request Confirmed - FF-INS-${Date.now()}`,
        html: generateConfirmationHTML(
          submission,
          successfulSubmissions,
          partnerNames
        ),
        text: generateConfirmationText(
          submission,
          successfulSubmissions,
          partnerNames
        ),
        customerName: `${submission.firstName} ${submission.lastName}`,
        submissionId: `FF-INS-${Date.now()}`,
      }),
    });

    const emailResult = await emailResponse.json();

    console.info(`Insurance quote confirmation for ${submission.email}:`);
    console.info(`Company: ${submission.companyName}`);
    console.info(`Successful submissions: ${successfulSubmissions.length}`);
    console.info('Partners contacted:', partnerNames.join(', '));
    console.info('Email sent:', emailResult.success ? 'Yes' : 'Failed');

    return {
      sent: emailResult.success,
      messageId: emailResult.messageId,
      partnersContacted: successfulSubmissions.length,
      estimatedResponse: '12-48 hours',
      error: emailResult.error,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      sent: false,
      partnersContacted: successfulSubmissions.length,
      estimatedResponse: '12-48 hours',
      error: 'Failed to send confirmation email',
    };
  }
}

// Generate HTML email content
function generateConfirmationHTML(
  submission: QuoteSubmission,
  results: any[],
  partnerNames: string[]
): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Insurance Quote Confirmation</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981, #059669); padding: 30px 20px; text-align: center; color: white; }
        .content { padding: 30px 20px; }
        .highlight-box { background: #f0fdf4; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .partner-list { background: #f8fafc; border-radius: 8px; padding: 15px; margin: 15px 0; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ Quote Request Confirmed!</h1>
            <p>Your insurance partners are working on your quotes</p>
        </div>

        <div class="content">
            <p>Dear ${submission.firstName} ${submission.lastName},</p>

            <p>Great news! We've successfully submitted your insurance quote request to ${results.length} A-rated carriers.</p>

            <div class="highlight-box">
                <h3 style="margin-top: 0; color: #10b981;">📋 Submission Summary</h3>
                <p><strong>Company:</strong> ${submission.companyName}</p>
                <p><strong>Fleet Size:</strong> ${submission.vehicleCount} vehicles</p>
                <p><strong>Partners Contacted:</strong> ${results.length}</p>
                <p><strong>Expected Response:</strong> 12-48 hours</p>
            </div>

            <h3>🏢 Insurance Partners Contacted</h3>
            <div class="partner-list">
                ${partnerNames.map((partner) => `<div style="margin: 8px 0;"><span style="color: #10b981;">✅</span> <strong>${partner}</strong></div>`).join('')}
            </div>

            <h3>📞 What Happens Next?</h3>
            <ol>
                <li>Insurance partners will review your submission within 2-4 hours</li>
                <li>Licensed agents will contact you within 12-48 hours</li>
                <li>You'll receive competitive quotes from multiple carriers</li>
                <li>Compare coverage options and pricing</li>
                <li>Choose your preferred policy and start saving!</li>
            </ol>

            <p><strong>Need assistance?</strong><br>
            Call us at <a href="tel:+18333863509">(833) 386-3509</a> or email <a href="mailto:insurance@fleetflow.com">insurance@fleetflow.com</a></p>
        </div>

        <div class="footer">
            <p><strong>FleetFlow™ Insurance Marketplace</strong><br>
            © 2025 FleetFlow. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `;
}

// Generate text email content
function generateConfirmationText(
  submission: QuoteSubmission,
  results: any[],
  partnerNames: string[]
): string {
  return `
Insurance Quote Confirmation

Dear ${submission.firstName} ${submission.lastName},

Your insurance quote request has been successfully submitted to ${results.length} insurance partners.

Company: ${submission.companyName}
Fleet Size: ${submission.vehicleCount} vehicles
Partners Contacted: ${partnerNames.join(', ')}
Expected Response: 12-48 hours

What happens next:
1. Insurance partners will review your submission within 2-4 hours
2. Licensed agents will contact you within 12-48 hours
3. You'll receive competitive quotes from multiple carriers
4. Compare coverage and pricing to find the best fit
5. Choose your preferred policy and start saving!

Need help? Call (833) 386-3509 or email insurance@fleetflow.com

Best regards,
FleetFlow Insurance Team
  `;
}

export async function POST(request: NextRequest) {
  try {
    const submission: QuoteSubmission = await request.json();

    // Validate required fields
    const requiredFields = [
      'companyName',
      'firstName',
      'lastName',
      'email',
      'phone',
      'vehicleCount',
      'coverageTypes',
    ];
    const missingFields = requiredFields.filter(
      (field) => !submission[field as keyof QuoteSubmission]
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Verify FMCSA if DOT number provided
    let fmcsaVerification = null;
    if (submission.dotNumber) {
      fmcsaVerification = await verifyFMCSA(submission.dotNumber);
    }

    // Submit to all insurance partners
    const partnerSubmissions = await Promise.allSettled([
      submitToTivly(submission),
      submitToCovered(submission),
      submitToInsurify(submission),
    ]);

    const results = partnerSubmissions.map((result, index) => {
      const partners = ['tivly', 'covered', 'insurify'];
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          success: false,
          partner: partners[index],
          error: result.reason?.message || 'Submission failed',
        };
      }
    });

    const successfulSubmissions = results.filter((r) => r.success);
    const failedSubmissions = results.filter((r) => !r.success);

    // Send confirmation email
    const emailConfirmation = await sendConfirmationEmail(submission, results);

    // Calculate potential earnings
    const potentialEarnings = calculatePotentialEarnings(
      submission.vehicleCount,
      submission.coverageTypes
    );

    return NextResponse.json({
      success: successfulSubmissions.length > 0,
      message:
        successfulSubmissions.length > 0
          ? `Quote request submitted to ${successfulSubmissions.length} insurance partners`
          : 'Failed to submit to any insurance partners',

      // Submission results
      submissions: {
        successful: successfulSubmissions.length,
        failed: failedSubmissions.length,
        total: results.length,
      },

      // Partner details
      partners: results,

      // FMCSA verification
      fmcsaVerification,

      // Email confirmation
      emailConfirmation,

      // Potential earnings
      potentialEarnings,

      // Next steps
      nextSteps: [
        'Insurance partners will contact you within 12-48 hours',
        'You will receive quotes from multiple A-rated carriers',
        'Compare coverage options and pricing',
        'Choose the best policy for your business',
      ],

      // Tracking information
      tracking: {
        submissionId: `FF-INS-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        estimatedResponse: '12-48 hours',
      },
    });
  } catch (error) {
    console.error('Insurance quote submission error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process insurance quote request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate potential earnings
function calculatePotentialEarnings(
  vehicleCount: number,
  coverageTypes: string[]
) {
  const baseRates = {
    commercial_auto: { min: 50, max: 200 },
    general_liability: { min: 30, max: 100 },
    workers_comp: { min: 25, max: 150 },
    cargo: { min: 20, max: 80 },
    garage_liability: { min: 15, max: 60 },
    cyber_liability: { min: 10, max: 50 },
  };

  let totalMin = 0;
  let totalMax = 0;

  coverageTypes.forEach((type) => {
    const rates = baseRates[type as keyof typeof baseRates];
    if (rates) {
      totalMin += rates.min * Math.min(vehicleCount, 10);
      totalMax += rates.max * Math.min(vehicleCount, 10);
    }
  });

  return {
    perPartner: {
      tivly: {
        min: Math.round(totalMin * 0.8),
        max: Math.round(totalMax * 1.2),
      },
      covered: {
        min: Math.round(totalMin * 0.6),
        max: Math.round(totalMax * 0.9),
      },
      insurify: {
        min: Math.round(totalMin * 0.7),
        max: Math.round(totalMax * 1.1),
      },
    },
    total: {
      min: Math.round(totalMin * 2.1),
      max: Math.round(totalMax * 3.2),
    },
  };
}
