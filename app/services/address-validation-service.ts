export interface AddressValidationResult {
  isValid: boolean;
  riskFactors: string[];
  confidence: number;
  businessType: string;
  locationDetails: {
    lat: number;
    lng: number;
    formattedAddress: string;
    placeId: string;
    types: string[];
  };
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  confidence: number;
  types: string[];
  formattedAddress: string;
  placeId: string;
}

export class AddressValidationService {
  private googleMapsApiKey: string;

  constructor() {
    this.googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  }

  // Use existing Google Maps API - NO NEW COSTS
  async validateBusinessAddress(
    address: string
  ): Promise<AddressValidationResult> {
    try {
      // FREE: Google Maps Geocoding API (already configured)
      const geocode = await this.geocodeAddress(address);

      if (!geocode) {
        return {
          isValid: false,
          riskFactors: ['Address not found'],
          confidence: 0,
          businessType: 'unknown',
          locationDetails: {
            lat: 0,
            lng: 0,
            formattedAddress: '',
            placeId: '',
            types: [],
          },
          riskLevel: 'critical',
        };
      }

      // FREE: Reverse geocoding to verify business location
      const reverseGeocode = await this.reverseGeocode(
        geocode.lat,
        geocode.lng
      );

      return {
        isValid: this.isValidBusinessAddress(geocode, reverseGeocode),
        riskFactors: this.identifyAddressRisks(geocode, reverseGeocode),
        confidence: geocode.confidence,
        businessType: this.detectBusinessType(reverseGeocode),
        locationDetails: {
          lat: geocode.lat,
          lng: geocode.lng,
          formattedAddress: geocode.formattedAddress,
          placeId: geocode.placeId,
          types: geocode.types,
        },
        riskLevel: this.calculateRiskLevel(geocode, reverseGeocode),
      };
    } catch (error) {
      console.error('Address validation error:', error);
      return {
        isValid: false,
        riskFactors: ['Address validation failed'],
        confidence: 0,
        businessType: 'unknown',
        locationDetails: {
          lat: 0,
          lng: 0,
          formattedAddress: '',
          placeId: '',
          types: [],
        },
        riskLevel: 'critical',
      };
    }
  }

  private async geocodeAddress(address: string): Promise<GeocodeResult | null> {
    try {
      if (!this.googleMapsApiKey) {
        // Fallback to mock data if no API key
        return this.mockGeocodeResult(address);
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.googleMapsApiKey}`
      );

      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        return {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          confidence: this.calculateConfidence(result.geometry.location_type),
          types: result.types,
          formattedAddress: result.formatted_address,
          placeId: result.place_id,
        };
      }

      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  private async reverseGeocode(lat: number, lng: number): Promise<any> {
    try {
      if (!this.googleMapsApiKey) {
        return this.mockReverseGeocodeResult();
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.googleMapsApiKey}`
      );

      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0];
      }

      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  private isValidBusinessAddress(
    geocode: GeocodeResult,
    reverseGeocode: any
  ): boolean {
    // Check if address is valid for business
    if (!geocode || !reverseGeocode) return false;

    // Check for business-appropriate location types
    const businessTypes = [
      'establishment',
      'business',
      'point_of_interest',
      'premise',
      'subpremise',
    ];

    const hasBusinessType = businessTypes.some((type) =>
      reverseGeocode.types.includes(type)
    );

    // Check for residential types (inappropriate for business)
    const residentialTypes = [
      'residential',
      'home',
      'house',
      'apartment',
      'room',
    ];

    const hasResidentialType = residentialTypes.some((type) =>
      reverseGeocode.types.includes(type)
    );

    return hasBusinessType && !hasResidentialType;
  }

  private identifyAddressRisks(
    geocode: GeocodeResult,
    reverseGeocode: any
  ): string[] {
    const risks = [];

    // FREE: Detect virtual office addresses
    if (this.isVirtualOffice(geocode, reverseGeocode)) {
      risks.push('Virtual office address detected');
    }

    // FREE: Check for residential addresses
    if (this.isResidentialAddress(reverseGeocode)) {
      risks.push('Residential address for business');
    }

    // FREE: Validate business hours availability
    if (!this.hasBusinessHours(reverseGeocode)) {
      risks.push('No business hours available');
    }

    // Check geocoding confidence
    if (geocode.confidence < 0.7) {
      risks.push('Low geocoding confidence');
    }

    // Check for PO Box addresses
    if (this.isPOBox(geocode, reverseGeocode)) {
      risks.push('PO Box address detected');
    }

    // Check for mail forwarding services
    if (this.isMailForwarding(geocode, reverseGeocode)) {
      risks.push('Mail forwarding service detected');
    }

    return risks;
  }

  private isVirtualOffice(
    geocode: GeocodeResult,
    reverseGeocode: any
  ): boolean {
    if (!geocode || !reverseGeocode) return false;

    const virtualOfficeTypes = [
      'virtual_office',
      'mailing_address',
      'post_office',
      'mailbox',
      'postal_code',
    ];

    // Check geocoding types
    const hasVirtualType = virtualOfficeTypes.some((type) =>
      geocode.types.includes(type)
    );

    // Check reverse geocoding types
    const hasVirtualReverseType = virtualOfficeTypes.some((type) =>
      reverseGeocode.types.includes(type)
    );

    // Check address text for virtual office indicators
    const addressText = reverseGeocode.formatted_address?.toLowerCase() || '';
    const virtualIndicators = [
      'suite',
      'unit',
      'mailbox',
      'p.o. box',
      'post office box',
      'virtual',
      'mailing',
    ];

    const hasVirtualIndicator = virtualIndicators.some((indicator) =>
      addressText.includes(indicator)
    );

    return hasVirtualType || hasVirtualReverseType || hasVirtualIndicator;
  }

  private isResidentialAddress(reverseGeocode: any): boolean {
    if (!reverseGeocode || !reverseGeocode.types) return false;

    const residentialTypes = [
      'residential',
      'home',
      'house',
      'apartment',
      'room',
      'subpremise',
    ];

    return residentialTypes.some((type) => reverseGeocode.types.includes(type));
  }

  private isPOBox(geocode: GeocodeResult, reverseGeocode: any): boolean {
    if (!geocode || !reverseGeocode) return false;

    const addressText = reverseGeocode.formatted_address?.toLowerCase() || '';
    const poBoxIndicators = [
      'p.o. box',
      'post office box',
      'po box',
      'pobox',
      'box',
    ];

    return poBoxIndicators.some((indicator) => addressText.includes(indicator));
  }

  private isMailForwarding(
    geocode: GeocodeResult,
    reverseGeocode: any
  ): boolean {
    if (!geocode || !reverseGeocode) return false;

    const addressText = reverseGeocode.formatted_address?.toLowerCase() || '';
    const mailForwardingIndicators = [
      'mail forwarding',
      'forwarding service',
      'mail service',
      'package receiving',
    ];

    return mailForwardingIndicators.some((indicator) =>
      addressText.includes(indicator)
    );
  }

  private hasBusinessHours(reverseGeocode: any): boolean {
    // This would require additional API calls to get business hours
    // For now, return true as placeholder - can be enhanced later
    return true;
  }

  private detectBusinessType(reverseGeocode: any): string {
    if (!reverseGeocode || !reverseGeocode.types) return 'unknown';

    const businessTypes = [
      'establishment',
      'business',
      'point_of_interest',
      'premise',
    ];

    const foundType = businessTypes.find((type) =>
      reverseGeocode.types.includes(type)
    );

    return foundType || 'unknown';
  }

  private calculateRiskLevel(
    geocode: GeocodeResult,
    reverseGeocode: any
  ): 'low' | 'medium' | 'high' | 'critical' {
    const risks = this.identifyAddressRisks(geocode, reverseGeocode);
    const riskCount = risks.length;

    if (riskCount === 0) return 'low';
    if (riskCount === 1) return 'medium';
    if (riskCount === 2) return 'high';
    return 'critical';
  }

  private calculateConfidence(locationType: string): number {
    switch (locationType) {
      case 'ROOFTOP':
        return 0.95;
      case 'RANGE_INTERPOLATED':
        return 0.85;
      case 'GEOMETRIC_CENTER':
        return 0.75;
      case 'APPROXIMATE':
        return 0.65;
      default:
        return 0.5;
    }
  }

  // Mock data for development/testing
  private mockGeocodeResult(address: string): GeocodeResult {
    return {
      lat: 40.7128,
      lng: -74.006,
      confidence: 0.9,
      types: ['establishment', 'business'],
      formattedAddress: address,
      placeId: 'mock_place_id',
    };
  }

  private mockReverseGeocodeResult(): any {
    return {
      types: ['establishment', 'business'],
      formatted_address: '123 Business St, New York, NY 10001',
    };
  }
}

