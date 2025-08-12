'use client';

// Insurance Partner API Integration Service
// Handles lead submission to insurance partners for referral/affiliate program

export interface InsuranceQuoteRequest {
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

  // Additional Info
  annualRevenue?: string;
  businessType?: string;
  operatingRadius?: string;
}

export interface InsurancePartnerResponse {
  partnerId: string;
  partnerName: string;
  leadId: string;
  status: 'submitted' | 'accepted' | 'rejected' | 'converted';
  submittedAt: Date;
  estimatedContactTime?: string;
  referenceNumber?: string;
}

export interface CommissionInfo {
  partnerId: string;
  partnerName: string;
  leadId: string;
  policyNumber?: string;
  commissionAmount: number;
  commissionRate: string;
  status: 'pending' | 'paid' | 'processing';
  earnedDate: Date;
  paidDate?: Date;
}

class InsuranceAPIService {
  private baseUrl = '/api/insurance';

  // Tivly Affiliate API Integration
  async submitToTivly(
    quoteRequest: InsuranceQuoteRequest
  ): Promise<InsurancePartnerResponse> {
    try {
      const tivlyPayload = {
        business: {
          company_name: quoteRequest.companyName,
          mc_number: quoteRequest.mcNumber,
          dot_number: quoteRequest.dotNumber,
          years_in_business: quoteRequest.yearsInBusiness,
          fleet_size: quoteRequest.vehicleCount,
          driver_count: quoteRequest.driverCount,
          business_type: 'trucking',
        },
        contact: {
          first_name: quoteRequest.firstName,
          last_name: quoteRequest.lastName,
          email: quoteRequest.email,
          phone: quoteRequest.phone,
        },
        coverage_requested: quoteRequest.coverageTypes,
        lead_source: 'fleetflow_referral',
        partner_id: process.env.NEXT_PUBLIC_TIVLY_PARTNER_ID,
      };

      const response = await fetch(`${this.baseUrl}/tivly/submit-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tivlyPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit to Tivly');
      }

      return {
        partnerId: 'tivly',
        partnerName: 'Tivly Affiliate Program',
        leadId: result.leadId || `TIVLY-${Date.now()}`,
        status: 'submitted',
        submittedAt: new Date(),
        estimatedContactTime: '24-48 hours',
        referenceNumber: result.referenceNumber,
      };
    } catch (error) {
      console.error('Tivly API Error:', error);
      throw new Error('Failed to submit lead to Tivly');
    }
  }

  // Covered Embedded Insurance API Integration
  async submitToCovered(
    quoteRequest: InsuranceQuoteRequest
  ): Promise<InsurancePartnerResponse> {
    try {
      const coveredPayload = {
        referral: {
          business_info: {
            name: quoteRequest.companyName,
            mc_number: quoteRequest.mcNumber,
            dot_number: quoteRequest.dotNumber,
            fleet_size: quoteRequest.vehicleCount,
            annual_mileage: quoteRequest.vehicleCount * 100000, // Estimate
            business_years: parseInt(quoteRequest.yearsInBusiness || '1'),
          },
          contact_info: {
            primary_contact: `${quoteRequest.firstName} ${quoteRequest.lastName}`,
            email: quoteRequest.email,
            phone: quoteRequest.phone,
          },
          insurance_needs: quoteRequest.coverageTypes,
          referral_source: 'fleetflow_platform',
          partner_code: process.env.NEXT_PUBLIC_COVERED_PARTNER_CODE,
        },
      };

      const response = await fetch(`${this.baseUrl}/covered/submit-referral`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(coveredPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit to Covered');
      }

      return {
        partnerId: 'covered',
        partnerName: 'Covered Embedded Insurance',
        leadId: result.referralId || `COVERED-${Date.now()}`,
        status: 'submitted',
        submittedAt: new Date(),
        estimatedContactTime: '12-24 hours',
        referenceNumber: result.trackingNumber,
      };
    } catch (error) {
      console.error('Covered API Error:', error);
      throw new Error('Failed to submit referral to Covered');
    }
  }

  // Insurify Partnership API Integration
  async submitToInsurify(
    quoteRequest: InsuranceQuoteRequest
  ): Promise<InsurancePartnerResponse> {
    try {
      const insurifyPayload = {
        lead: {
          business: {
            company_name: quoteRequest.companyName,
            dot_number: quoteRequest.dotNumber,
            mc_number: quoteRequest.mcNumber,
            vehicle_count: quoteRequest.vehicleCount,
            driver_count: quoteRequest.driverCount,
            industry: 'transportation',
          },
          contact: {
            name: `${quoteRequest.firstName} ${quoteRequest.lastName}`,
            email: quoteRequest.email,
            phone: quoteRequest.phone,
            role: 'owner',
          },
          insurance_types: quoteRequest.coverageTypes.map((type) => {
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
          partner_id: process.env.NEXT_PUBLIC_INSURIFY_PARTNER_ID,
          source: 'fleetflow_referral',
        },
      };

      const response = await fetch(`${this.baseUrl}/insurify/submit-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(insurifyPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit to Insurify');
      }

      return {
        partnerId: 'insurify',
        partnerName: 'Insurify Partnership',
        leadId: result.leadId || `INSURIFY-${Date.now()}`,
        status: 'submitted',
        submittedAt: new Date(),
        estimatedContactTime: '24-48 hours',
        referenceNumber: result.caseNumber,
      };
    } catch (error) {
      console.error('Insurify API Error:', error);
      throw new Error('Failed to submit lead to Insurify');
    }
  }

  // Submit to all insurance partners
  async submitToAllPartners(
    quoteRequest: InsuranceQuoteRequest
  ): Promise<InsurancePartnerResponse[]> {
    const submissions = await Promise.allSettled([
      this.submitToTivly(quoteRequest),
      this.submitToCovered(quoteRequest),
      this.submitToInsurify(quoteRequest),
    ]);

    const results: InsurancePartnerResponse[] = [];
    const errors: string[] = [];

    submissions.forEach((submission, index) => {
      const partnerNames = ['Tivly', 'Covered', 'Insurify'];

      if (submission.status === 'fulfilled') {
        results.push(submission.value);
      } else {
        errors.push(`${partnerNames[index]}: ${submission.reason.message}`);
      }
    });

    // Log errors but don't fail if at least one succeeded
    if (errors.length > 0) {
      console.warn('Some partner submissions failed:', errors);
    }

    if (results.length === 0) {
      throw new Error('All partner submissions failed');
    }

    return results;
  }

  // Get commission information
  async getCommissions(): Promise<CommissionInfo[]> {
    try {
      const response = await fetch(`${this.baseUrl}/commissions`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch commissions');
      }

      return result.commissions || [];
    } catch (error) {
      console.error('Commission fetch error:', error);
      return [];
    }
  }

  // Get lead status from partners
  async getLeadStatus(
    leadId: string,
    partnerId: string
  ): Promise<InsurancePartnerResponse | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/lead-status?leadId=${leadId}&partnerId=${partnerId}`
      );
      const result = await response.json();

      if (!response.ok) {
        return null;
      }

      return result.leadStatus;
    } catch (error) {
      console.error('Lead status fetch error:', error);
      return null;
    }
  }

  // Calculate potential earnings
  calculatePotentialEarnings(
    vehicleCount: number,
    coverageTypes: string[]
  ): {
    tivly: { min: number; max: number };
    covered: { min: number; max: number };
    insurify: { min: number; max: number };
    total: { min: number; max: number };
  } {
    // Base commission estimates per vehicle
    const basePerVehicle = {
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
      const rates = basePerVehicle[type as keyof typeof basePerVehicle];
      if (rates) {
        totalMin += rates.min * Math.min(vehicleCount, 10); // Cap at 10 for calculation
        totalMax += rates.max * Math.min(vehicleCount, 10);
      }
    });

    return {
      tivly: { min: totalMin * 0.8, max: totalMax * 1.2 },
      covered: { min: totalMin * 0.6, max: totalMax * 0.9 },
      insurify: { min: totalMin * 0.7, max: totalMax * 1.1 },
      total: { min: totalMin * 2.1, max: totalMax * 3.2 },
    };
  }
}

export const insuranceAPIService = new InsuranceAPIService();
