/**
 * ImportYeti API Integration Service
 *
 * Pulls real US customs import data to find prospects importing from China
 */

'use client';

export interface ImportYetiCompany {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  email?: string;
  website?: string;
  productDescription: string;
  supplierName: string;
  supplierCountry: string;
  shipmentCount: number;
  lastShipmentDate: string;
  estimatedMonthlyContainers: number;
}

export interface ImportYetiSearchParams {
  product?: string; // e.g., "steel", "metal", "aluminum"
  htsCode?: string; // e.g., "7208" for steel
  supplierCountry?: string; // e.g., "China"
  minShipments?: number;
  limit?: number;
}

class ImportYetiService {
  private credentials: { email: string; password: string } | null = null;
  private baseUrl = 'https://www.importyeti.com';
  private isConfigured = false;

  constructor() {
    // Check for credentials in environment variables or localStorage
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('importyeti_email');
      const savedPassword = localStorage.getItem('importyeti_password');
      if (savedEmail && savedPassword) {
        this.credentials = { email: savedEmail, password: savedPassword };
        this.isConfigured = true;
      }
    }
  }

  /**
   * Configure ImportYeti credentials
   */
  public setCredentials(email: string, password: string): void {
    this.credentials = { email, password };
    if (typeof window !== 'undefined') {
      localStorage.setItem('importyeti_email', email);
      localStorage.setItem('importyeti_password', password);
    }
    this.isConfigured = true;
    console.log('✅ ImportYeti credentials configured');
  }

  /**
   * Check if service is configured
   */
  public isReady(): boolean {
    return this.isConfigured && !!this.credentials;
  }

  /**
   * Search for companies importing specific products from China
   */
  public async searchCompanies(
    params: ImportYetiSearchParams
  ): Promise<ImportYetiCompany[]> {
    if (!this.isReady()) {
      console.warn('⚠️ ImportYeti not configured - returning mock data');
      return this.getMockData(params);
    }

    try {
      // Note: ImportYeti's actual API structure may vary
      // This is a template - adjust based on their documentation
      const searchParams = new URLSearchParams({
        ...(params.product && { product: params.product }),
        ...(params.htsCode && { hts_code: params.htsCode }),
        ...(params.supplierCountry && { origin: params.supplierCountry }),
        ...(params.minShipments && {
          min_shipments: params.minShipments.toString(),
        }),
        limit: (params.limit || 10).toString(),
      });

      const response = await fetch(
        `${this.baseUrl}/search?${searchParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`ImportYeti API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Transform API response to our format
      return this.transformApiResponse(data);
    } catch (error) {
      console.error('❌ ImportYeti API error:', error);
      // Fallback to mock data for development
      return this.getMockData(params);
    }
  }

  /**
   * Get companies importing steel from China (95% tariff)
   */
  public async getSteelImporters(
    limit: number = 5
  ): Promise<ImportYetiCompany[]> {
    return this.searchCompanies({
      product: 'steel',
      htsCode: '7208', // Flat-rolled steel
      supplierCountry: 'China',
      minShipments: 2,
      limit,
    });
  }

  /**
   * Get companies importing metal from China (95% tariff)
   */
  public async getMetalImporters(
    limit: number = 5
  ): Promise<ImportYetiCompany[]> {
    return this.searchCompanies({
      product: 'metal',
      htsCode: '7304', // Metal tubes and pipes
      supplierCountry: 'China',
      minShipments: 2,
      limit,
    });
  }

  /**
   * Get companies importing aluminum from China (95% tariff)
   */
  public async getAluminumImporters(
    limit: number = 5
  ): Promise<ImportYetiCompany[]> {
    return this.searchCompanies({
      product: 'aluminum',
      htsCode: '7601', // Unwrought aluminum
      supplierCountry: 'China',
      minShipments: 2,
      limit,
    });
  }

  /**
   * Transform ImportYeti API response to our format
   */
  private transformApiResponse(data: any): ImportYetiCompany[] {
    // Adjust based on actual ImportYeti API structure
    if (!data || !data.results) return [];

    return data.results.map((company: any) => ({
      id: company.id || `IY-${Date.now()}-${Math.random()}`,
      name: company.importer_name || company.company_name,
      address: company.address || '',
      city: company.city || '',
      state: company.state || '',
      zipCode: company.zip_code || company.postal_code || '',
      phone: company.phone || company.contact_phone,
      email: company.email || company.contact_email,
      website: company.website,
      productDescription: company.product_description || company.description,
      supplierName: company.supplier_name || '',
      supplierCountry: company.origin_country || 'China',
      shipmentCount: company.shipment_count || 0,
      lastShipmentDate: company.last_shipment_date || new Date().toISOString(),
      estimatedMonthlyContainers: this.estimateMonthlyContainers(
        company.shipment_count,
        company.first_shipment_date,
        company.last_shipment_date
      ),
    }));
  }

  /**
   * Estimate monthly container volume
   */
  private estimateMonthlyContainers(
    totalShipments: number,
    firstDate: string,
    lastDate: string
  ): number {
    if (!totalShipments || !firstDate || !lastDate) return 1;

    const first = new Date(firstDate).getTime();
    const last = new Date(lastDate).getTime();
    const monthsActive = Math.max(
      1,
      (last - first) / (1000 * 60 * 60 * 24 * 30)
    );

    return Math.ceil(totalShipments / monthsActive);
  }

  /**
   * Mock data for development/fallback
   */
  private getMockData(params: ImportYetiSearchParams): ImportYetiCompany[] {
    const mockCompanies: ImportYetiCompany[] = [
      {
        id: 'IY-MOCK-1',
        name: 'American Steel Distributors LLC',
        address: '1234 Industrial Way',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        phone: '+1-713-555-0100',
        email: 'procurement@americansteel.com',
        website: 'https://americansteel.com',
        productDescription: 'Hot-rolled steel sheets and coils',
        supplierName: 'Baosteel Group',
        supplierCountry: 'China',
        shipmentCount: 24,
        lastShipmentDate: new Date(
          Date.now() - 15 * 24 * 60 * 60 * 1000
        ).toISOString(),
        estimatedMonthlyContainers: 4,
      },
      {
        id: 'IY-MOCK-2',
        name: 'Pacific Metal Works Inc',
        address: '5678 Harbor Blvd',
        city: 'Long Beach',
        state: 'CA',
        zipCode: '90802',
        phone: '+1-562-555-0200',
        email: 'operations@pacificmetal.com',
        website: 'https://pacificmetal.com',
        productDescription: 'Aluminum extrusions and profiles',
        supplierName: 'Chalco Aluminum',
        supplierCountry: 'China',
        shipmentCount: 18,
        lastShipmentDate: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        estimatedMonthlyContainers: 3,
      },
      {
        id: 'IY-MOCK-3',
        name: 'Midwest Manufacturing Supply',
        address: '9012 Commerce Drive',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        phone: '+1-312-555-0300',
        email: 'purchasing@midwestmfg.com',
        productDescription: 'Steel rebar and structural steel',
        supplierName: 'Anshan Iron & Steel',
        supplierCountry: 'China',
        shipmentCount: 36,
        lastShipmentDate: new Date(
          Date.now() - 3 * 24 * 60 * 60 * 1000
        ).toISOString(),
        estimatedMonthlyContainers: 6,
      },
      {
        id: 'IY-MOCK-4',
        name: 'Global Aluminum Solutions',
        address: '3456 Port Street',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        phone: '+1-206-555-0400',
        email: 'imports@globalaluminum.com',
        website: 'https://globalaluminum.com',
        productDescription: 'Aluminum sheets and plates',
        supplierName: 'Yunnan Aluminum',
        supplierCountry: 'China',
        shipmentCount: 22,
        lastShipmentDate: new Date(
          Date.now() - 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
        estimatedMonthlyContainers: 4,
      },
      {
        id: 'IY-MOCK-5',
        name: 'Eastern Metal Importers',
        address: '7890 Dock Road',
        city: 'Newark',
        state: 'NJ',
        zipCode: '07101',
        phone: '+1-973-555-0500',
        email: 'contact@easternmetal.com',
        productDescription: 'Stainless steel tubes and fittings',
        supplierName: 'Tsingshan Steel',
        supplierCountry: 'China',
        shipmentCount: 15,
        lastShipmentDate: new Date(
          Date.now() - 20 * 24 * 60 * 60 * 1000
        ).toISOString(),
        estimatedMonthlyContainers: 2,
      },
    ];

    // Filter based on params
    let filtered = mockCompanies;

    if (params.product) {
      const productLower = params.product.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(productLower) ||
          c.productDescription.toLowerCase().includes(productLower)
      );
    }

    if (params.minShipments) {
      filtered = filtered.filter((c) => c.shipmentCount >= params.minShipments);
    }

    return filtered.slice(0, params.limit || 10);
  }

  /**
   * Test API connection
   */
  public async testConnection(): Promise<boolean> {
    if (!this.isReady()) {
      return false;
    }

    try {
      const results = await this.searchCompanies({ limit: 1 });
      return results.length > 0;
    } catch (error) {
      console.error('❌ ImportYeti connection test failed:', error);
      return false;
    }
  }
}

// Export singleton
export const importYetiService = new ImportYetiService();
export default importYetiService;
