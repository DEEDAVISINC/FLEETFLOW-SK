import puppeteer from 'puppeteer';
import { Browser, Page } from 'puppeteer';

interface BrokerSnapshotCredentials {
  username: string;
  password: string;
}

interface CarrierInfo {
  mcNumber?: string;
  dotNumber?: string;
  companyName?: string;
  address?: string;
  phone?: string;
  email?: string;
  status?: string;
  insuranceStatus?: string;
  safetyRating?: string;
  trucks?: number;
  drivers?: number;
  lastUpdated?: string;
}

interface DriverInfo {
  name?: string;
  licenseNumber?: string;
  licenseState?: string;
  violations?: any[];
  endorsements?: string[];
  medicalCertStatus?: string;
  hazmatEndorsement?: boolean;
}

interface ShipperInfo {
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  businessType?: string;
  yearEstablished?: string;
  creditRating?: string;
  paymentTerms?: string;
  averageLoadValue?: number;
  totalLoads?: number;
  recentActivity?: string;
  lastUpdated?: string;
}

class BrokerSnapshotService {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private credentials: BrokerSnapshotCredentials;
  private isLoggedIn: boolean = false;

  constructor(credentials: BrokerSnapshotCredentials) {
    this.credentials = credentials;
  }

  async initialize(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless: true, // Set to false for debugging
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.page = await this.browser.newPage();
      
      // Set user agent to appear more like a real browser
      await this.page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      );
      
      console.log('BrokerSnapshot service initialized');
    } catch (error) {
      console.error('Failed to initialize BrokerSnapshot service:', error);
      throw error;
    }
  }

  async login(): Promise<boolean> {
    if (!this.page) {
      throw new Error('Service not initialized. Call initialize() first.');
    }

    try {
      console.log('Navigating to BrokerSnapshot login page...');
      await this.page.goto('https://brokersnapshot.com/login', { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Wait for login form to be available
      await this.page.waitForSelector('input[type="email"], input[name="username"], input[name="email"]', { timeout: 10000 });

      // Fill in credentials (adjust selectors based on actual form)
      const usernameSelector = 'input[type="email"], input[name="username"], input[name="email"]';
      const passwordSelector = 'input[type="password"], input[name="password"]';

      await this.page.type(usernameSelector, this.credentials.username);
      await this.page.type(passwordSelector, this.credentials.password);

      // Submit the form
      const loginButton = await this.page.$('button[type="submit"], input[type="submit"], .login-btn, .btn-login');
      if (loginButton) {
        await loginButton.click();
      } else {
        // Try pressing Enter if no submit button found
        await this.page.keyboard.press('Enter');
      }

      // Wait for navigation after login
      await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });

      // Check if login was successful by looking for dashboard elements
      const isDashboard = await this.page.$('.dashboard, .main-content, .user-menu, .logout') !== null;
      
      if (isDashboard) {
        this.isLoggedIn = true;
        console.log('Successfully logged into BrokerSnapshot');
        return true;
      } else {
        console.error('Login failed - not redirected to dashboard');
        return false;
      }

    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  async searchCarrier(mcNumber: string): Promise<CarrierInfo | null> {
    if (!this.isLoggedIn) {
      const loginSuccess = await this.login();
      if (!loginSuccess) {
        throw new Error('Failed to log in to BrokerSnapshot');
      }
    }

    if (!this.page) {
      throw new Error('Service not initialized');
    }

    try {
      console.log(`Searching for carrier MC-${mcNumber}...`);

      // Navigate to carrier search page (adjust URL based on actual site structure)
      await this.page.goto(`https://brokersnapshot.com/carrier-search`, { 
        waitUntil: 'networkidle2' 
      });

      // Wait for search form
      await this.page.waitForSelector('input[name="mc"], input[name="mcNumber"], .search-input', { timeout: 10000 });

      // Enter MC number
      const searchInput = 'input[name="mc"], input[name="mcNumber"], .search-input';
      await this.page.type(searchInput, mcNumber);

      // Submit search
      const searchButton = await this.page.$('.search-btn, button[type="submit"], .btn-search');
      if (searchButton) {
        await searchButton.click();
      } else {
        await this.page.keyboard.press('Enter');
      }

      // Wait for results
      await this.page.waitForSelector('.carrier-info, .search-results, .carrier-details', { timeout: 15000 });

      // Extract carrier information (adjust selectors based on actual page structure)
      const carrierInfo: CarrierInfo = await this.page.evaluate(() => {
        const getTextContent = (selector: string): string => {
          const element = document.querySelector(selector);
          return element ? element.textContent?.trim() || '' : '';
        };

        return {
          mcNumber: getTextContent('.mc-number, .carrier-mc'),
          dotNumber: getTextContent('.dot-number, .carrier-dot'),
          companyName: getTextContent('.company-name, .carrier-name, h1, h2'),
          address: getTextContent('.address, .carrier-address'),
          phone: getTextContent('.phone, .carrier-phone'),
          email: getTextContent('.email, .carrier-email'),
          status: getTextContent('.status, .carrier-status'),
          insuranceStatus: getTextContent('.insurance, .insurance-status'),
          safetyRating: getTextContent('.safety-rating, .rating'),
          trucks: parseInt(getTextContent('.trucks, .vehicle-count')) || 0,
          drivers: parseInt(getTextContent('.drivers, .driver-count')) || 0,
          lastUpdated: new Date().toISOString()
        };
      });

      console.log('Carrier information retrieved:', carrierInfo);
      return carrierInfo;

    } catch (error) {
      console.error('Failed to search carrier:', error);
      return null;
    }
  }

  async searchDriver(licenseNumber: string, state: string): Promise<DriverInfo | null> {
    if (!this.isLoggedIn) {
      const loginSuccess = await this.login();
      if (!loginSuccess) {
        throw new Error('Failed to log in to BrokerSnapshot');
      }
    }

    if (!this.page) {
      throw new Error('Service not initialized');
    }

    try {
      console.log(`Searching for driver license ${licenseNumber} in ${state}...`);

      // Navigate to driver search page
      await this.page.goto(`https://brokersnapshot.com/driver-search`, { 
        waitUntil: 'networkidle2' 
      });

      // Wait for search form
      await this.page.waitForSelector('input[name="license"], input[name="licenseNumber"]', { timeout: 10000 });

      // Enter license information
      await this.page.type('input[name="license"], input[name="licenseNumber"]', licenseNumber);
      
      // Select state if there's a dropdown
      const stateSelector = 'select[name="state"], select[name="licenseState"]';
      const stateElement = await this.page.$(stateSelector);
      if (stateElement) {
        await this.page.select(stateSelector, state);
      }

      // Submit search
      const searchButton = await this.page.$('.search-btn, button[type="submit"]');
      if (searchButton) {
        await searchButton.click();
      } else {
        await this.page.keyboard.press('Enter');
      }

      // Wait for results
      await this.page.waitForSelector('.driver-info, .search-results, .driver-details', { timeout: 15000 });

      // Extract driver information
      const driverInfo: DriverInfo = await this.page.evaluate(() => {
        const getTextContent = (selector: string): string => {
          const element = document.querySelector(selector);
          return element ? element.textContent?.trim() || '' : '';
        };

        const getViolations = (): any[] => {
          const violations: any[] = [];
          const violationElements = document.querySelectorAll('.violation, .violation-item');
          violationElements.forEach(el => {
            violations.push({
              date: getTextContent('.violation-date'),
              type: getTextContent('.violation-type'),
              description: getTextContent('.violation-description')
            });
          });
          return violations;
        };

        return {
          name: getTextContent('.driver-name, .name'),
          licenseNumber: getTextContent('.license-number, .license'),
          licenseState: getTextContent('.license-state, .state'),
          violations: getViolations(),
          endorsements: getTextContent('.endorsements').split(',').map(e => e.trim()).filter(e => e),
          medicalCertStatus: getTextContent('.medical-cert, .medical-status'),
          hazmatEndorsement: getTextContent('.hazmat, .endorsements').toLowerCase().includes('hazmat')
        };
      });

      console.log('Driver information retrieved:', driverInfo);
      return driverInfo;

    } catch (error) {
      console.error('Failed to search driver:', error);
      return null;
    }
  }

  async searchShipper(companyName: string, state?: string): Promise<ShipperInfo | null> {
    if (!this.isLoggedIn) {
      const loginSuccess = await this.login();
      if (!loginSuccess) {
        throw new Error('Failed to log in to BrokerSnapshot');
      }
    }

    if (!this.page) {
      throw new Error('Service not initialized');
    }

    try {
      console.log(`Searching for shipper: ${companyName}${state ? ' in ' + state : ''}...`);

      // Navigate to shipper search page (adjust URL based on actual site structure)
      await this.page.goto(`https://brokersnapshot.com/shipper-search`, { 
        waitUntil: 'networkidle2' 
      });

      // Wait for search form
      await this.page.waitForSelector('input[name="company"], input[name="companyName"], .shipper-search-input', { timeout: 10000 });

      // Enter company name
      const companyInput = 'input[name="company"], input[name="companyName"], .shipper-search-input';
      await this.page.type(companyInput, companyName);
      
      // Select state if provided and there's a dropdown
      if (state) {
        const stateSelector = 'select[name="state"], select[name="shipperState"]';
        const stateElement = await this.page.$(stateSelector);
        if (stateElement) {
          await this.page.select(stateSelector, state);
        }
      }

      // Submit search
      const searchButton = await this.page.$('.search-btn, button[type="submit"], .btn-search');
      if (searchButton) {
        await searchButton.click();
      } else {
        await this.page.keyboard.press('Enter');
      }

      // Wait for results
      await this.page.waitForSelector('.shipper-info, .search-results, .shipper-details, .company-info', { timeout: 15000 });

      // Extract shipper information (adjust selectors based on actual page structure)
      const shipperInfo: ShipperInfo = await this.page.evaluate(() => {
        const getTextContent = (selector: string): string => {
          const element = document.querySelector(selector);
          return element ? element.textContent?.trim() || '' : '';
        };

        const parseNumber = (text: string): number => {
          const number = parseInt(text.replace(/[^\d]/g, ''));
          return isNaN(number) ? 0 : number;
        };

        return {
          companyName: getTextContent('.company-name, .shipper-name, h1, h2, .business-name'),
          address: getTextContent('.address, .shipper-address, .street-address'),
          city: getTextContent('.city, .shipper-city'),
          state: getTextContent('.state, .shipper-state'),
          zipCode: getTextContent('.zip, .postal-code, .zip-code'),
          phone: getTextContent('.phone, .shipper-phone, .contact-phone'),
          email: getTextContent('.email, .shipper-email, .contact-email'),
          contactPerson: getTextContent('.contact-person, .contact-name, .primary-contact'),
          businessType: getTextContent('.business-type, .industry, .category'),
          yearEstablished: getTextContent('.established, .year-established, .founded'),
          creditRating: getTextContent('.credit-rating, .rating, .credit-score'),
          paymentTerms: getTextContent('.payment-terms, .terms'),
          averageLoadValue: parseNumber(getTextContent('.avg-load-value, .average-value')),
          totalLoads: parseNumber(getTextContent('.total-loads, .load-count')),
          recentActivity: getTextContent('.recent-activity, .last-activity'),
          lastUpdated: new Date().toISOString()
        };
      });

      console.log('Shipper information retrieved:', shipperInfo);
      return shipperInfo;

    } catch (error) {
      console.error('Failed to search shipper:', error);
      return null;
    }
  }

  async monitorCarriers(mcNumbers: string[]): Promise<CarrierInfo[]> {
    const results: CarrierInfo[] = [];
    
    for (const mcNumber of mcNumbers) {
      try {
        const carrierInfo = await this.searchCarrier(mcNumber);
        if (carrierInfo) {
          results.push(carrierInfo);
        }
        
        // Add delay between requests to avoid being blocked
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`Failed to monitor carrier MC-${mcNumber}:`, error);
      }
    }
    
    return results;
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
      this.isLoggedIn = false;
      console.log('BrokerSnapshot service closed');
    }
  }
}

export default BrokerSnapshotService;
export type { CarrierInfo, DriverInfo, ShipperInfo, BrokerSnapshotCredentials };
