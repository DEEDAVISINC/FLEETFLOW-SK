// Enhanced Carrier Verification Service with FMCSA and BrokerSnapshot Integration
import { brokersnapshot } from '../lib/brokersnapshot-service';

export interface CarrierData {
  mcNumber: string;
  dotNumber: string;
  companyName: string;
  dbaName?: string;
  physicalAddress: string;
  mailingAddress?: string;
  phone: string;
  email?: string;
  safetyRating: 'SATISFACTORY' | 'CONDITIONAL' | 'UNSATISFACTORY' | 'NOT_RATED';
  insuranceStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  operatingStatus: 'ACTIVE' | 'OUT_OF_SERVICE' | 'NOT_AUTHORIZED';
  powerUnits: number;
  drivers: number;
  mileage: number;
  lastUpdate: string;
  source: 'FMCSA' | 'BROKERSNAPSHOT' | 'MANUAL';
  
  // BrokerSnapshot specific fields
  creditScore?: string;
  paymentHistory?: string;
  averagePaymentDays?: number;
  references?: Array<{
    company: string;
    contact: string;
    phone: string;
    rating: number;
  }>;
  
  // Real-time tracking capability
  trackingEnabled?: boolean;
  lastKnownLocation?: {
    lat: number;
    lng: number;
    timestamp: string;
    accuracy: number;
  };
}

export class EnhancedCarrierService {
  private fmcsaApiKey: string;
  private brokersnaphotApiKey: string;

  constructor() {
    this.fmcsaApiKey = process.env.FMCSA_API_KEY || '';
    this.brokersnaphotApiKey = process.env.BROKERSNAPSHOT_API_KEY || '';
  }

  // Verify carrier from FMCSA database
  async verifyCarrierFMCSA(mcNumber: string): Promise<CarrierData | null> {
    try {
      const response = await fetch(`https://mobile.fmcsa.dot.gov/qc/services/carriers/${mcNumber}?webKey=${this.fmcsaApiKey}`);
      const data = await response.json();
      
      if (data && data.content) {
        const carrier = data.content[0];
        return {
          mcNumber: carrier.docketNumber,
          dotNumber: carrier.dotNumber,
          companyName: carrier.legalName,
          dbaName: carrier.dbaName,
          physicalAddress: `${carrier.phyStreet}, ${carrier.phyCity}, ${carrier.phyState} ${carrier.phyZipcode}`,
          mailingAddress: `${carrier.mailStreet}, ${carrier.mailCity}, ${carrier.mailState} ${carrier.mailZipcode}`,
          phone: carrier.telephone,
          safetyRating: carrier.safetyRating || 'NOT_RATED',
          insuranceStatus: carrier.bipdInsuranceOnFile ? 'ACTIVE' : 'INACTIVE',
          operatingStatus: carrier.operatingStatus,
          powerUnits: carrier.totalPowerUnits || 0,
          drivers: carrier.totalDrivers || 0,
          mileage: carrier.totalMileage || 0,
          lastUpdate: new Date().toISOString(),
          source: 'FMCSA'
        };
      }
      return null;
    } catch (error) {
      console.error('FMCSA verification failed:', error);
      return null;
    }
  }

  // Get carrier information from BrokerSnapshot
  async getCarrierBrokerSnapshot(mcNumber: string): Promise<Partial<CarrierData> | null> {
    try {
      // Use our existing BrokerSnapshot service
      const result = await brokersnapshot.getCarrierInfo(mcNumber);
      
      if (result.success && result.data) {
        return {
          mcNumber,
          creditScore: result.data.creditScore,
          paymentHistory: result.data.paymentHistory,
          averagePaymentDays: result.data.averagePaymentDays,
          references: result.data.references,
          trackingEnabled: result.data.trackingEnabled,
          lastKnownLocation: result.data.lastKnownLocation,
          source: 'BROKERSNAPSHOT'
        };
      }
      return null;
    } catch (error) {
      console.error('BrokerSnapshot lookup failed:', error);
      return null;
    }
  }

  // Combined carrier verification using both sources
  async verifyCarrierComprehensive(mcNumber: string): Promise<CarrierData | null> {
    try {
      // Get data from both sources
      const [fmcsaData, bsData] = await Promise.all([
        this.verifyCarrierFMCSA(mcNumber),
        this.getCarrierBrokerSnapshot(mcNumber)
      ]);

      if (!fmcsaData && !bsData) {
        return null;
      }

      // Merge data with FMCSA as primary source
      const combinedData: CarrierData = {
        ...fmcsaData,
        ...bsData,
        mcNumber,
        lastUpdate: new Date().toISOString(),
        source: fmcsaData ? 'FMCSA' : 'BROKERSNAPSHOT'
      } as CarrierData;

      return combinedData;
    } catch (error) {
      console.error('Comprehensive carrier verification failed:', error);
      return null;
    }
  }

  // Enable real-time tracking for a carrier (BrokerSnapshot feature)
  async enableCarrierTracking(mcNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      const result = await brokersnapshot.enableTracking(mcNumber);
      return result;
    } catch (error) {
      console.error('Failed to enable carrier tracking:', error);
      return { success: false, message: 'Failed to enable tracking' };
    }
  }

  // Get real-time location updates for tracked carriers
  async getCarrierLocation(mcNumber: string): Promise<{
    success: boolean;
    location?: {
      lat: number;
      lng: number;
      timestamp: string;
      accuracy: number;
      speed?: number;
      heading?: number;
    };
    message?: string;
  }> {
    try {
      const result = await brokersnapshot.getTrackingUpdate(mcNumber);
      return result;
    } catch (error) {
      console.error('Failed to get carrier location:', error);
      return { success: false, message: 'Failed to get location' };
    }
  }

  // Generate comprehensive carrier report
  async generateCarrierReport(mcNumber: string): Promise<{
    carrier: CarrierData;
    safetyScore: number;
    financialScore: number;
    trackingCapable: boolean;
    recommendations: string[];
  } | null> {
    try {
      const carrier = await this.verifyCarrierComprehensive(mcNumber);
      if (!carrier) return null;

      // Calculate safety score
      let safetyScore = 50;
      switch (carrier.safetyRating) {
        case 'SATISFACTORY': safetyScore = 85; break;
        case 'CONDITIONAL': safetyScore = 60; break;
        case 'UNSATISFACTORY': safetyScore = 25; break;
        default: safetyScore = 50;
      }

      // Calculate financial score
      let financialScore = 50;
      if (carrier.creditScore) {
        financialScore = parseInt(carrier.creditScore) || 50;
      }
      if (carrier.averagePaymentDays) {
        if (carrier.averagePaymentDays <= 30) financialScore += 20;
        else if (carrier.averagePaymentDays <= 45) financialScore += 10;
        else financialScore -= 10;
      }

      // Generate recommendations
      const recommendations: string[] = [];
      if (safetyScore < 70) recommendations.push('Safety rating requires attention');
      if (financialScore < 60) recommendations.push('Financial verification recommended');
      if (carrier.trackingEnabled) recommendations.push('Real-time tracking available');
      if (carrier.insuranceStatus !== 'ACTIVE') recommendations.push('Verify insurance status');

      return {
        carrier,
        safetyScore: Math.min(100, Math.max(0, safetyScore)),
        financialScore: Math.min(100, Math.max(0, financialScore)),
        trackingCapable: carrier.trackingEnabled || false,
        recommendations
      };
    } catch (error) {
      console.error('Failed to generate carrier report:', error);
      return null;
    }
  }
}

// Export singleton instance
export const carrierService = new EnhancedCarrierService();

// Export types for use in other files
export type { CarrierData };
