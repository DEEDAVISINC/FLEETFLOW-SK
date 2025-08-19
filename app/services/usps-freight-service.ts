/**
 * USPS Freight API Service
 *
 * Provides functionality to interact with the USPS Freight API for shipping rates,
 * package tracking, service availability, and shipment scheduling.
 */

import axios from 'axios';

interface USPSFreightCredentials {
  username: string;
  password: string;
  apiKey: string;
  accountNumber: string;
  apiUrl: string;
}

interface USPSRateRequest {
  originZip: string;
  destinationZip: string;
  weight: number; // in pounds
  length?: number; // in inches
  width?: number; // in inches
  height?: number; // in inches
  packageType?: string; // e.g., 'PALLET', 'PACKAGE', 'BOX'
  serviceType?: string; // e.g., 'STANDARD', 'EXPEDITED', 'PRIORITY'
}

interface USPSTrackingRequest {
  trackingNumber: string;
}

interface USPSPickupRequest {
  pickupDate: string; // YYYY-MM-DD
  pickupTimeWindow: string; // e.g., '09:00-17:00'
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  address: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zip: string;
  };
  packageCount: number;
  totalWeight: number; // in pounds
  specialInstructions?: string;
}

export class USPSFreightService {
  private credentials: USPSFreightCredentials;
  private isInitialized: boolean = false;

  constructor() {
    // Default initialization with empty credentials
    this.credentials = {
      username: '',
      password: '',
      apiKey: '',
      accountNumber: '',
      apiUrl: '',
    };
  }

  /**
   * Initialize the service with environment variables
   */
  public initialize(): boolean {
    // Get credentials from environment variables
    const username = process.env.USPS_FREIGHT_USERNAME;
    const password = process.env.USPS_FREIGHT_PASSWORD;
    const apiKey = process.env.USPS_FREIGHT_API_KEY;
    const accountNumber = process.env.USPS_FREIGHT_ACCOUNT_NUMBER;
    const apiUrl = process.env.USPS_FREIGHT_API_URL;

    // Check if all required credentials are present
    if (!username || !password || !apiKey || !accountNumber || !apiUrl) {
      console.error('USPS Freight API credentials not fully configured');
      return false;
    }

    // Set credentials
    this.credentials = {
      username,
      password,
      apiKey,
      accountNumber,
      apiUrl,
    };

    this.isInitialized = true;
    return true;
  }

  /**
   * Get shipping rates for a freight package
   */
  public async getFreightRates(request: USPSRateRequest): Promise<any> {
    this.ensureInitialized();

    try {
      const response = await axios.post(
        `${this.credentials.apiUrl}/rates`,
        {
          ...request,
          accountNumber: this.credentials.accountNumber,
        },
        this.getRequestConfig()
      );

      return response.data;
    } catch (error) {
      this.handleApiError('getFreightRates', error);
      throw error;
    }
  }

  /**
   * Track a freight shipment by tracking number
   */
  public async trackFreightShipment(
    request: USPSTrackingRequest
  ): Promise<any> {
    this.ensureInitialized();

    try {
      const response = await axios.get(
        `${this.credentials.apiUrl}/track/${request.trackingNumber}`,
        this.getRequestConfig()
      );

      return response.data;
    } catch (error) {
      this.handleApiError('trackFreightShipment', error);
      throw error;
    }
  }

  /**
   * Schedule a freight pickup
   */
  public async scheduleFreightPickup(request: USPSPickupRequest): Promise<any> {
    this.ensureInitialized();

    try {
      const response = await axios.post(
        `${this.credentials.apiUrl}/pickups`,
        {
          ...request,
          accountNumber: this.credentials.accountNumber,
        },
        this.getRequestConfig()
      );

      return response.data;
    } catch (error) {
      this.handleApiError('scheduleFreightPickup', error);
      throw error;
    }
  }

  /**
   * Get service availability by zip code
   */
  public async getServiceAvailability(
    originZip: string,
    destinationZip: string
  ): Promise<any> {
    this.ensureInitialized();

    try {
      const response = await axios.get(
        `${this.credentials.apiUrl}/availability`,
        {
          ...this.getRequestConfig(),
          params: {
            originZip,
            destinationZip,
            accountNumber: this.credentials.accountNumber,
          },
        }
      );

      return response.data;
    } catch (error) {
      this.handleApiError('getServiceAvailability', error);
      throw error;
    }
  }

  /**
   * Validate a freight address
   */
  public async validateFreightAddress(address: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zip: string;
  }): Promise<any> {
    this.ensureInitialized();

    try {
      const response = await axios.post(
        `${this.credentials.apiUrl}/validate-address`,
        {
          ...address,
          accountNumber: this.credentials.accountNumber,
        },
        this.getRequestConfig()
      );

      return response.data;
    } catch (error) {
      this.handleApiError('validateFreightAddress', error);
      throw error;
    }
  }

  /**
   * Get freight transit times between origin and destination
   */
  public async getTransitTimes(
    originZip: string,
    destinationZip: string
  ): Promise<any> {
    this.ensureInitialized();

    try {
      const response = await axios.get(
        `${this.credentials.apiUrl}/transit-times`,
        {
          ...this.getRequestConfig(),
          params: {
            originZip,
            destinationZip,
            accountNumber: this.credentials.accountNumber,
          },
        }
      );

      return response.data;
    } catch (error) {
      this.handleApiError('getTransitTimes', error);
      throw error;
    }
  }

  /**
   * Get request configuration with authentication headers
   */
  private getRequestConfig() {
    return {
      headers: {
        Authorization: `Bearer ${this.credentials.apiKey}`,
        'X-USPS-Account': this.credentials.accountNumber,
        'Content-Type': 'application/json',
      },
    };
  }

  /**
   * Ensure the service is initialized before making API calls
   */
  private ensureInitialized() {
    if (!this.isInitialized) {
      const initialized = this.initialize();
      if (!initialized) {
        throw new Error('USPS Freight API service not properly initialized');
      }
    }
  }

  /**
   * Handle API errors with proper logging
   */
  private handleApiError(method: string, error: any) {
    console.error(
      `USPS Freight API error in ${method}:`,
      error.response
        ? {
            status: error.response.status,
            data: error.response.data,
          }
        : error.message
    );
  }
}

// Export singleton instance
export const uspsFreightService = new USPSFreightService();
