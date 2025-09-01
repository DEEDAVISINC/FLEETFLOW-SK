/**
 * Healthcare & Pharmaceutical RFx Service for FleetFlow
 * Specialized service for medical courier and pharmaceutical logistics opportunities
 * Extends base RFxResponseService with healthcare-specific functionality
 */

import { RFxRequest, RFxResponseService } from './RFxResponseService';

export interface MedicalRFxOpportunity extends RFxRequest {
  medicalCategory:
    | 'courier'
    | 'pharmaceutical'
    | 'clinical_trial'
    | 'medical_equipment';
  temperatureRequirement?: '2-8C' | '-20C' | '-80C' | 'ambient' | 'room_temp';
  complianceRequired: ('HIPAA' | 'FDA' | 'DEA' | 'GMP' | 'GDP' | 'GCP')[];
  urgencyLevel: 'critical' | 'stat' | 'urgent' | 'routine';
  specialHandling: (
    | 'biohazard'
    | 'controlled_substance'
    | 'investigational'
    | 'sterile'
  )[];
  certificationRequired: string[];
  chainOfCustody: boolean;
  temperatureMonitoring: boolean;
  emergencyResponse: boolean;
}

export interface HealthcareProvider {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'distributor' | 'cro' | 'biotech';
  network?: 'vizient' | 'premier' | 'healthtrust' | 'gpo';
  locations: string[];
  specializations: string[];
  volumeLevel: 'low' | 'medium' | 'high' | 'enterprise';
}

export interface ClinicalTrialOpportunity extends MedicalRFxOpportunity {
  studyPhase: 'I' | 'II' | 'III' | 'IV';
  therapeuticArea: string;
  patientCount: number;
  studySites: string[];
  drugType: 'small_molecule' | 'biologic' | 'cell_therapy' | 'gene_therapy';
  comparatorRequired: boolean;
  blindingRequired: boolean;
}

export class HealthcareRFxService extends RFxResponseService {
  private readonly healthcareApiEndpoints = {
    medspeed: 'https://api.medspeed.com/v1/opportunities',
    cardinalHealth: 'https://partners.cardinalhealth.com/api/logistics/rfx',
    mckesson: 'https://connect.mckesson.com/api/distribution/rfx',
    amerisourcebergen: 'https://gnp.amerisourcebergen.com/api/logistics',
    marken: 'https://partners.marken.com/api/clinical-logistics',
    worldCourier: 'https://partners.worldcourier.com/api/opportunities',
    quest: 'https://partners.questdiagnostics.com/api/transport',
    labcorp: 'https://logistics.labcorp.com/api/partnerships',
    vizient: 'https://members.vizientinc.com/api/transportation',
    premier: 'https://partners.premierinc.com/api/logistics',
  };

  /**
   * Search for medical courier opportunities across specialized platforms
   */
  async searchMedicalCourierOpportunities(searchParams: {
    serviceType?: 'STAT' | 'routine' | 'equipment' | 'specimens';
    region?: string;
    temperatureRequired?: boolean;
    urgencyLevel?: 'critical' | 'high' | 'medium';
    provider?: 'quest' | 'labcorp' | 'hospital' | 'clinic';
    biohazardHandling?: boolean;
  }): Promise<MedicalRFxOpportunity[]> {
    const opportunities: MedicalRFxOpportunity[] = [];

    try {
      // Search across medical courier platforms in parallel
      const searchPromises = [
        this.searchMedSpeedNetwork(searchParams),
        this.searchCardinalHealthNetwork(searchParams),
        this.searchQuestDiagnostics(searchParams),
        this.searchLabCorpNetwork(searchParams),
        this.searchHospitalGPOs(searchParams),
      ];

      const results = await Promise.allSettled(searchPromises);

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          opportunities.push(...result.value);
        } else {
          console.warn(
            `Healthcare platform ${index} search failed:`,
            result.reason
          );
        }
      });

      return this.prioritizeMedicalOpportunities(opportunities);
    } catch (error) {
      console.error('Medical courier search error:', error);
      return this.getMockMedicalCourierOpportunities(searchParams);
    }
  }

  /**
   * Search for pharmaceutical distribution opportunities
   */
  async searchPharmaceuticalOpportunities(searchParams: {
    distributionType?: 'retail' | 'hospital' | 'clinical_trial' | 'specialty';
    temperatureRange?: '2-8C' | '-20C' | '-80C' | 'ambient';
    complianceRequired?: ('FDA' | 'DEA' | 'GMP' | 'GDP')[];
    volume?: 'low' | 'medium' | 'high';
    therapeutic?: 'oncology' | 'rare_disease' | 'biologics' | 'vaccines';
    region?: string;
  }): Promise<MedicalRFxOpportunity[]> {
    const opportunities: MedicalRFxOpportunity[] = [];

    try {
      // Search across pharmaceutical distribution platforms
      const searchPromises = [
        this.searchMcKessonNetwork(searchParams),
        this.searchAmerisourceBergenNetwork(searchParams),
        this.searchWorldCourierNetwork(searchParams),
        this.searchSpecialtyPharmacyNetworks(searchParams),
      ];

      const results = await Promise.allSettled(searchPromises);

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          opportunities.push(...result.value);
        } else {
          console.warn(
            `Pharmaceutical platform ${index} search failed:`,
            result.reason
          );
        }
      });

      return this.prioritizePharmaceuticalOpportunities(opportunities);
    } catch (error) {
      console.error('Pharmaceutical search error:', error);
      return this.getMockPharmaceuticalOpportunities(searchParams);
    }
  }

  /**
   * Search for clinical trial logistics opportunities
   */
  async searchClinicalTrialOpportunities(searchParams: {
    studyPhase?: ('I' | 'II' | 'III' | 'IV')[];
    therapeuticArea?: string;
    region?: 'global' | 'north_america' | 'europe' | 'asia_pacific';
    sponsor?: 'big_pharma' | 'biotech' | 'academic' | 'cro';
    complexity?: 'low' | 'medium' | 'high';
  }): Promise<ClinicalTrialOpportunity[]> {
    const opportunities: ClinicalTrialOpportunity[] = [];

    try {
      // Search across clinical trial logistics platforms
      const searchPromises = [
        this.searchMarkenNetwork(searchParams),
        this.searchPCIPharmaServices(searchParams),
        this.searchClinicalTrialCROs(searchParams),
      ];

      const results = await Promise.allSettled(searchPromises);

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          opportunities.push(...(result.value as ClinicalTrialOpportunity[]));
        } else {
          console.warn(
            `Clinical trial platform ${index} search failed:`,
            result.reason
          );
        }
      });

      return this.prioritizeClinicalTrialOpportunities(opportunities);
    } catch (error) {
      console.error('Clinical trial search error:', error);
      return this.getMockClinicalTrialOpportunities(searchParams);
    }
  }

  // Platform-specific search methods
  private async searchMedSpeedNetwork(
    params: any
  ): Promise<MedicalRFxOpportunity[]> {
    if (!process.env.MEDSPEED_API_KEY) {
      console.warn('MedSpeed API key not configured');
      return [];
    }

    try {
      const response = await fetch(
        `${this.healthcareApiEndpoints.medspeed}/search`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.MEDSPEED_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_type: params.serviceType,
            region: params.region,
            urgency: params.urgencyLevel,
            temperature_controlled: params.temperatureRequired,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`MedSpeed API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformMedSpeedOpportunities(data.opportunities || []);
    } catch (error) {
      console.error('MedSpeed search error:', error);
      return [];
    }
  }

  private async searchCardinalHealthNetwork(
    params: any
  ): Promise<MedicalRFxOpportunity[]> {
    if (!process.env.CARDINAL_HEALTH_API_KEY) {
      console.warn('Cardinal Health API key not configured');
      return [];
    }

    try {
      const response = await fetch(
        `${this.healthcareApiEndpoints.cardinalHealth}/opportunities`,
        {
          method: 'POST',
          headers: {
            'X-API-Key': process.env.CARDINAL_HEALTH_API_KEY!,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transportation_type: 'medical_equipment',
            regions: params.region ? [params.region] : [],
            service_level: params.urgencyLevel,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Cardinal Health API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformCardinalHealthOpportunities(
        data.logistics_opportunities || []
      );
    } catch (error) {
      console.error('Cardinal Health search error:', error);
      return [];
    }
  }

  private async searchMcKessonNetwork(
    params: any
  ): Promise<MedicalRFxOpportunity[]> {
    if (!process.env.MCKESSON_API_KEY) {
      console.warn('McKesson API key not configured');
      return [];
    }

    try {
      const response = await fetch(
        `${this.healthcareApiEndpoints.mckesson}/rfx/search`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.MCKESSON_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            distribution_type: params.distributionType,
            temperature_range: params.temperatureRange,
            compliance_requirements: params.complianceRequired,
            volume_tier: params.volume,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`McKesson API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformMcKessonOpportunities(data.distribution_rfx || []);
    } catch (error) {
      console.error('McKesson search error:', error);
      return [];
    }
  }

  private async searchMarkenNetwork(
    params: any
  ): Promise<ClinicalTrialOpportunity[]> {
    if (!process.env.MARKEN_API_KEY) {
      console.warn('Marken API key not configured');
      return [];
    }

    try {
      const response = await fetch(
        `${this.healthcareApiEndpoints.marken}/studies/logistics`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.MARKEN_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            study_phases: params.studyPhase,
            therapeutic_areas: params.therapeuticArea
              ? [params.therapeuticArea]
              : [],
            geographic_scope: params.region,
            sponsor_type: params.sponsor,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Marken API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformMarkenOpportunities(data.clinical_studies || []);
    } catch (error) {
      console.error('Marken search error:', error);
      return [];
    }
  }

  // Data transformation methods
  private transformMedSpeedOpportunities(
    opportunities: any[]
  ): MedicalRFxOpportunity[] {
    return opportunities.map((opp) => ({
      id: `medspeed-${opp.id}`,
      type: 'RFQ' as const,
      shipperId: opp.client_id,
      shipperName: opp.client_name,
      title: `Medical Courier: ${opp.service_description}`,
      description: opp.detailed_requirements,
      origin: opp.pickup_location,
      destination: opp.delivery_location,
      equipment: this.mapMedicalEquipmentType(opp.transport_type),
      commodity: 'Medical Materials',
      weight: opp.estimated_weight || 0,
      distance: opp.estimated_miles || 0,
      pickupDate: new Date(opp.pickup_date),
      deliveryDate: new Date(opp.delivery_date),
      requirements: opp.special_requirements || [],
      deadline: new Date(opp.bid_deadline),
      status: 'OPEN' as const,
      estimatedValue: opp.contract_value,
      priority: this.mapUrgencyToPriority(opp.urgency_level),
      contactInfo: {
        name: opp.contact_name,
        email: opp.contact_email,
        phone: opp.contact_phone,
      },
      // Healthcare-specific fields
      medicalCategory: 'courier',
      temperatureRequirement: opp.temperature_range,
      complianceRequired: ['HIPAA'],
      urgencyLevel: opp.urgency_level,
      specialHandling: opp.biohazard_required ? ['biohazard'] : [],
      certificationRequired: opp.required_certifications || [],
      chainOfCustody: opp.chain_of_custody_required || false,
      temperatureMonitoring: opp.temperature_monitoring_required || false,
      emergencyResponse: opp.urgency_level === 'critical',
      source: 'MedSpeed Network',
    }));
  }

  private transformMcKessonOpportunities(
    opportunities: any[]
  ): MedicalRFxOpportunity[] {
    return opportunities.map((opp) => ({
      id: `mckesson-${opp.rfx_id}`,
      type: 'RFP' as const,
      shipperId: opp.distribution_center_id,
      shipperName: `McKesson Distribution Center - ${opp.location_name}`,
      title: `Pharmaceutical Distribution: ${opp.service_category}`,
      description: opp.scope_of_work,
      origin: opp.origin_facility,
      destination: opp.destination_type,
      equipment: 'Temperature Controlled',
      commodity: 'Pharmaceuticals',
      weight: opp.average_shipment_weight || 0,
      distance: opp.route_distance || 0,
      pickupDate: new Date(opp.service_start_date),
      deliveryDate: new Date(opp.service_end_date),
      requirements: opp.compliance_requirements || [],
      deadline: new Date(opp.proposal_deadline),
      status: 'OPEN' as const,
      estimatedValue: opp.annual_contract_value,
      priority: 'HIGH' as const,
      contactInfo: {
        name: opp.procurement_manager,
        email: opp.contact_email,
        phone: opp.contact_phone,
      },
      // Healthcare-specific fields
      medicalCategory: 'pharmaceutical',
      temperatureRequirement: opp.temperature_requirements,
      complianceRequired: ['FDA', 'DEA', 'GDP'],
      urgencyLevel: 'routine',
      specialHandling: opp.controlled_substances
        ? ['controlled_substance']
        : [],
      certificationRequired: ['FDA_LICENSE', 'DEA_REGISTRATION'],
      chainOfCustody: true,
      temperatureMonitoring: true,
      emergencyResponse: false,
      source: 'McKesson Distribution',
    }));
  }

  private transformMarkenOpportunities(
    opportunities: any[]
  ): ClinicalTrialOpportunity[] {
    return opportunities.map((opp) => ({
      id: `marken-${opp.study_id}`,
      type: 'RFP' as const,
      shipperId: opp.sponsor_id,
      shipperName: opp.sponsor_company,
      title: `Clinical Trial Logistics: ${opp.study_title}`,
      description: opp.logistics_requirements,
      origin: 'Manufacturing Site',
      destination: 'Clinical Sites',
      equipment: 'Clinical Trial Specialized',
      commodity: 'Investigational Products',
      weight: 0,
      distance: 0,
      pickupDate: new Date(opp.study_start_date),
      deliveryDate: new Date(opp.study_end_date),
      requirements: opp.regulatory_requirements || [],
      deadline: new Date(opp.vendor_selection_deadline),
      status: 'OPEN' as const,
      estimatedValue: opp.logistics_budget,
      priority: 'HIGH' as const,
      contactInfo: {
        name: opp.study_manager,
        email: opp.contact_email,
        phone: opp.contact_phone,
      },
      // Healthcare-specific fields
      medicalCategory: 'clinical_trial',
      temperatureRequirement: opp.storage_temperature,
      complianceRequired: ['GCP', 'FDA'],
      urgencyLevel: 'routine',
      specialHandling: ['investigational'],
      certificationRequired: ['GCP_CERTIFICATION'],
      chainOfCustody: true,
      temperatureMonitoring: true,
      emergencyResponse: false,
      source: 'Marken Clinical Network',
      // Clinical trial specific fields
      studyPhase: opp.phase,
      therapeuticArea: opp.therapeutic_area,
      patientCount: opp.planned_enrollment,
      studySites: opp.site_locations || [],
      drugType: opp.drug_classification,
      comparatorRequired: opp.comparator_required || false,
      blindingRequired: opp.blinding_required || false,
    }));
  }

  // Prioritization and filtering methods
  private prioritizeMedicalOpportunities(
    opportunities: MedicalRFxOpportunity[]
  ): MedicalRFxOpportunity[] {
    return opportunities.sort((a, b) => {
      // Prioritize by urgency level
      const urgencyOrder = { critical: 4, stat: 3, urgent: 2, routine: 1 };
      const urgencyDiff =
        urgencyOrder[b.urgencyLevel] - urgencyOrder[a.urgencyLevel];
      if (urgencyDiff !== 0) return urgencyDiff;

      // Then by contract value
      return (b.estimatedValue || 0) - (a.estimatedValue || 0);
    });
  }

  private prioritizePharmaceuticalOpportunities(
    opportunities: MedicalRFxOpportunity[]
  ): MedicalRFxOpportunity[] {
    return opportunities.sort((a, b) => {
      // Prioritize by contract value for pharmaceutical
      const valueDiff = (b.estimatedValue || 0) - (a.estimatedValue || 0);
      if (valueDiff !== 0) return valueDiff;

      // Then by compliance complexity (more compliance = higher priority/margins)
      return b.complianceRequired.length - a.complianceRequired.length;
    });
  }

  private prioritizeClinicalTrialOpportunities(
    opportunities: ClinicalTrialOpportunity[]
  ): ClinicalTrialOpportunity[] {
    return opportunities.sort((a, b) => {
      // Prioritize by study phase (later phases = higher value)
      const phaseOrder = { I: 1, II: 2, III: 3, IV: 4 };
      const phaseDiff = phaseOrder[b.studyPhase] - phaseOrder[a.studyPhase];
      if (phaseDiff !== 0) return phaseDiff;

      // Then by contract value
      return (b.estimatedValue || 0) - (a.estimatedValue || 0);
    });
  }

  // Utility methods
  private mapMedicalEquipmentType(transportType: string): string {
    const equipmentMap: Record<string, string> = {
      temperature_controlled: 'Temperature Controlled',
      ambient: 'Dry Van',
      frozen: 'Freezer Truck',
      refrigerated: 'Refrigerated',
      specialized_medical: 'Medical Transport Vehicle',
    };
    return equipmentMap[transportType] || 'Medical Transport';
  }

  private mapUrgencyToPriority(
    urgency: string
  ): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const priorityMap: Record<string, 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'> =
      {
        routine: 'MEDIUM',
        urgent: 'HIGH',
        stat: 'CRITICAL',
        critical: 'CRITICAL',
      };
    return priorityMap[urgency] || 'MEDIUM';
  }

  // Mock data methods for development
  private getMockMedicalCourierOpportunities(
    params: any
  ): MedicalRFxOpportunity[] {
    // Return empty for production - no mock data
    return [];
  }

  private getMockPharmaceuticalOpportunities(
    params: any
  ): MedicalRFxOpportunity[] {
    // Return empty for production - no mock data
    return [];
  }

  private getMockClinicalTrialOpportunities(
    params: any
  ): ClinicalTrialOpportunity[] {
    // Return empty for production - no mock data
    return [];
  }

  // Placeholder methods for additional platforms
  private async searchQuestDiagnostics(
    params: any
  ): Promise<MedicalRFxOpportunity[]> {
    return [];
  }
  private async searchLabCorpNetwork(
    params: any
  ): Promise<MedicalRFxOpportunity[]> {
    return [];
  }
  private async searchHospitalGPOs(
    params: any
  ): Promise<MedicalRFxOpportunity[]> {
    return [];
  }
  private async searchAmerisourceBergenNetwork(
    params: any
  ): Promise<MedicalRFxOpportunity[]> {
    return [];
  }
  private async searchWorldCourierNetwork(
    params: any
  ): Promise<MedicalRFxOpportunity[]> {
    return [];
  }
  private async searchSpecialtyPharmacyNetworks(
    params: any
  ): Promise<MedicalRFxOpportunity[]> {
    return [];
  }
  private async searchPCIPharmaServices(
    params: any
  ): Promise<ClinicalTrialOpportunity[]> {
    return [];
  }
  private async searchClinicalTrialCROs(
    params: any
  ): Promise<ClinicalTrialOpportunity[]> {
    return [];
  }
}

// Export singleton instance
export const healthcareRFxService = new HealthcareRFxService();


