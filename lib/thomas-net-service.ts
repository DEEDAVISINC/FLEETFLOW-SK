import puppeteer, { Browser, Page } from 'puppeteer';

interface ThomasNetCredentials {
  username: string;
  password: string;
}

interface ManufacturerInfo {
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  website?: string;
  email?: string;
  contactPerson?: string;

  // Manufacturing specific
  industryType?: string;
  products?: string[];
  services?: string[];
  yearsInBusiness?: string;
  employeeCount?: string;
  annualRevenue?: string;

  // Shipping potential indicators
  facilitySize?: string;
  shippingMethods?: string[];
  freightVolume?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  // Lead scoring data
  lastUpdated?: string;
  leadScore?: number;
  freightPotential?: string;
  contactQuality?: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface WholesalerInfo {
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  website?: string;
  email?: string;
  contactPerson?: string;

  // Wholesaler specific
  distributionType?: string;
  productCategories?: string[];
  serviceArea?: string;
  warehouseLocations?: string[];

  // Shipping indicators
  distributionVolume?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  shippingFrequency?: string;
  avgShipmentSize?: string;

  // Lead data
  lastUpdated?: string;
  leadScore?: number;
  freightPotential?: string;
}

interface ThomasNetSearchFilters {
  industry?: string;
  location?: string;
  state?: string;
  companySize?: 'SMALL' | 'MEDIUM' | 'LARGE';
  productKeywords?: string[];
  serviceKeywords?: string[];
}

class ThomasNetService {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private credentials: ThomasNetCredentials;
  private isLoggedIn: boolean = false;

  constructor(credentials: ThomasNetCredentials) {
    this.credentials = credentials;
  }

  async initialize(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless: true, // Set to false for debugging
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled',
          '--disable-web-security',
        ],
      });
      this.page = await this.browser.newPage();

      // Set user agent to appear more like a real browser
      await this.page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      // Set additional headers
      await this.page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      });

      console.log('ThomasNet service initialized');
    } catch (error) {
      console.error('Failed to initialize ThomasNet service:', error);
      throw error;
    }
  }

  async login(): Promise<boolean> {
    if (!this.page) {
      throw new Error('Service not initialized. Call initialize() first.');
    }

    try {
      console.log(
        '🔐 Attempting ThomasNet login for:',
        this.credentials.username
      );

      // Step 1: Navigate to homepage first (more reliable)
      console.log('📍 Navigating to ThomasNet homepage...');
      await this.page.goto('https://www.thomasnet.com', {
        waitUntil: 'domcontentloaded',
        timeout: 45000,
      });

      // Small delay to let page settle
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Step 2: Look for login link and click it
      console.log('🔍 Looking for login link...');
      try {
        await this.page.waitForSelector('a[href*="login"], .login, .sign-in', {
          timeout: 10000,
        });
        const loginLink = await this.page.$(
          'a[href*="login"], .login, .sign-in'
        );
        if (loginLink) {
          console.log('🖱️ Clicking login link...');
          await loginLink.click();
          await this.page.waitForNavigation({
            waitUntil: 'domcontentloaded',
            timeout: 30000,
          });
        }
      } catch (linkError) {
        console.log('⚠️ Login link not found, trying direct navigation...');
        await this.page.goto('https://www.thomasnet.com/account/login', {
          waitUntil: 'domcontentloaded',
          timeout: 45000,
        });
      }

      // Step 3: Wait for and identify login form elements
      console.log('📝 Looking for login form...');

      // Try multiple common selectors
      const possibleUserSelectors = [
        'input[type="email"]',
        'input[name="username"]',
        'input[name="email"]',
        'input[id*="email"]',
        'input[id*="username"]',
        '#email',
        '#username',
      ];

      const possiblePassSelectors = [
        'input[type="password"]',
        'input[name="password"]',
        'input[id*="password"]',
        '#password',
      ];

      let usernameField = null;
      let passwordField = null;

      // Find working selectors
      for (const selector of possibleUserSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 3000 });
          usernameField = selector;
          console.log('✅ Found username field:', selector);
          break;
        } catch {} // Continue to next selector
      }

      for (const selector of possiblePassSelectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 3000 });
          passwordField = selector;
          console.log('✅ Found password field:', selector);
          break;
        } catch {} // Continue to next selector
      }

      if (!usernameField || !passwordField) {
        console.error('❌ Could not find login form fields');
        // Take screenshot for debugging
        await this.page.screenshot({
          path: 'thomas-net-debug.png',
          fullPage: true,
        });
        return false;
      }

      // Step 4: Clear fields and enter credentials
      console.log('⌨️ Entering credentials...');
      await this.page.click(usernameField, { clickCount: 3 }); // Select all
      await this.page.type(usernameField, this.credentials.username, {
        delay: 100,
      });

      await this.page.click(passwordField, { clickCount: 3 }); // Select all
      await this.page.type(passwordField, this.credentials.password, {
        delay: 100,
      });

      // Step 5: Submit form
      console.log('🚀 Submitting login form...');

      // Try different submit methods
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        '.login-btn',
        '.btn-login',
        '.sign-in-btn',
        'button:contains("Sign In")',
        'button:contains("Login")',
      ];

      let submitted = false;
      for (const selector of submitSelectors) {
        try {
          const button = await this.page.$(selector);
          if (button) {
            await button.click();
            submitted = true;
            console.log('✅ Clicked submit button:', selector);
            break;
          }
        } catch {} // Continue to next selector
      }

      if (!submitted) {
        console.log('⌨️ No submit button found, trying Enter key...');
        await this.page.keyboard.press('Enter');
      }

      // Step 6: Wait for login to complete (with multiple fallbacks)
      console.log('⏳ Waiting for login to complete...');

      try {
        // Wait for either navigation OR success indicators
        await Promise.race([
          this.page.waitForNavigation({
            waitUntil: 'domcontentloaded',
            timeout: 20000,
          }),
          this.page.waitForSelector(
            '.user-menu, .account-menu, .logout, .my-account, .dashboard',
            { timeout: 20000 }
          ),
          this.page.waitForFunction(
            () =>
              window.location.href !==
              'https://www.thomasnet.com/account/login',
            { timeout: 20000 }
          ),
        ]);
      } catch (waitError) {
        console.log('⚠️ Navigation timeout, checking current state...');
      }

      // Step 7: Verify login success
      const currentUrl = this.page.url();
      console.log('🌐 Current URL after login attempt:', currentUrl);

      // Check for success indicators
      const successIndicators = [
        '.user-menu',
        '.account-menu',
        '.logout',
        '.my-account',
        '.dashboard',
        '[data-user]',
        '.signed-in',
      ];

      let loginSuccess = false;

      // Check if we're no longer on login page
      if (!currentUrl.includes('/login')) {
        loginSuccess = true;
        console.log('✅ Login successful - redirected from login page');
      }

      // Check for user elements
      for (const indicator of successIndicators) {
        try {
          const element = await this.page.$(indicator);
          if (element) {
            loginSuccess = true;
            console.log('✅ Login successful - found user element:', indicator);
            break;
          }
        } catch {}
      }

      // Check for error messages
      const errorSelectors = [
        '.error',
        '.alert-danger',
        '.login-error',
        '[class*="error"]',
        '[class*="invalid"]',
      ];

      for (const errorSelector of errorSelectors) {
        try {
          const errorElement = await this.page.$(errorSelector);
          if (errorElement) {
            const errorText = await errorElement.textContent();
            console.error('❌ Login error found:', errorText);
            return false;
          }
        } catch {}
      }

      if (loginSuccess) {
        this.isLoggedIn = true;
        console.log('🎉 ThomasNet login successful!');
        return true;
      } else {
        console.error('❌ Login failed - no success indicators found');
        // Take debug screenshot
        await this.page.screenshot({
          path: 'thomas-net-login-failed.png',
          fullPage: true,
        });
        return false;
      }
    } catch (error) {
      console.error('❌ ThomasNet login error:', error);
      // Take debug screenshot
      try {
        await this.page.screenshot({
          path: 'thomas-net-error.png',
          fullPage: true,
        });
      } catch {}
      return false;
    }
  }

  async searchManufacturers(
    filters: ThomasNetSearchFilters
  ): Promise<ManufacturerInfo[]> {
    if (!this.isLoggedIn) {
      const loginSuccess = await this.login();
      if (!loginSuccess) {
        throw new Error('Failed to log in to ThomasNet');
      }
    }

    if (!this.page) {
      throw new Error('Service not initialized');
    }

    try {
      console.log('Searching for manufacturers with filters:', filters);

      // Navigate to supplier search page
      await this.page.goto('https://www.thomasnet.com/suppliers', {
        waitUntil: 'networkidle2',
      });

      // Wait for search form
      await this.page.waitForSelector(
        '.search-input, input[name="what"], #what',
        { timeout: 10000 }
      );

      // Build search query
      let searchQuery = '';
      if (filters.productKeywords && filters.productKeywords.length > 0) {
        searchQuery = filters.productKeywords.join(' ');
      }
      if (filters.industry) {
        searchQuery += ` ${filters.industry}`;
      }

      // Enter search terms
      const searchInput = '.search-input, input[name="what"], #what';
      await this.page.type(searchInput, searchQuery);

      // Set location if provided
      if (filters.location) {
        const locationInput = 'input[name="where"], #where, .location-input';
        const locationElement = await this.page.$(locationInput);
        if (locationElement) {
          await this.page.type(locationInput, filters.location);
        }
      }

      // Submit search
      const searchButton = await this.page.$(
        '.search-btn, button[type="submit"], .btn-search, .find-suppliers-btn'
      );
      if (searchButton) {
        await searchButton.click();
      } else {
        await this.page.keyboard.press('Enter');
      }

      // Wait for results
      await this.page.waitForSelector(
        '.supplier-result, .company-listing, .search-result',
        { timeout: 15000 }
      );

      // Extract manufacturer information from search results
      const manufacturers: ManufacturerInfo[] = await this.page.evaluate(() => {
        const results: ManufacturerInfo[] = [];
        const listingElements = document.querySelectorAll(
          '.supplier-result, .company-listing, .search-result, .supplier-item'
        );

        listingElements.forEach((listing, index) => {
          if (index >= 20) return; // Limit to first 20 results

          const getTextContent = (selector: string): string => {
            const element = listing.querySelector(selector);
            return element ? element.textContent?.trim() || '' : '';
          };

          const getAttribute = (
            selector: string,
            attribute: string
          ): string => {
            const element = listing.querySelector(selector);
            return element ? element.getAttribute(attribute) || '' : '';
          };

          // Calculate freight potential based on business indicators
          const calculateFreightPotential = ():
            | 'LOW'
            | 'MEDIUM'
            | 'HIGH'
            | 'CRITICAL' => {
            const companyName = getTextContent(
              '.company-name, .supplier-name, h2, h3'
            ).toLowerCase();
            const description = getTextContent(
              '.description, .company-description'
            ).toLowerCase();

            // High freight potential indicators
            if (
              description.includes('heavy machinery') ||
              description.includes('construction equipment') ||
              description.includes('automotive') ||
              description.includes('steel') ||
              description.includes('chemical') ||
              companyName.includes('manufacturing') ||
              companyName.includes('industrial')
            ) {
              return 'HIGH';
            }

            // Medium freight potential
            if (
              description.includes('equipment') ||
              description.includes('machinery') ||
              description.includes('distribution') ||
              description.includes('warehouse')
            ) {
              return 'MEDIUM';
            }

            return 'LOW';
          };

          const manufacturer: ManufacturerInfo = {
            companyName: getTextContent(
              '.company-name, .supplier-name, h2, h3'
            ),
            address: getTextContent('.address, .supplier-address, .location'),
            phone: getTextContent('.phone, .telephone, .contact-phone'),
            website: getAttribute('a[href*="http"]', 'href'),

            // Extract additional details
            industryType: getTextContent(
              '.industry, .category, .business-type'
            ),
            products: getTextContent('.products, .services, .description')
              .split(',')
              .map((p) => p.trim())
              .filter((p) => p),

            // Calculate shipping indicators
            freightVolume: calculateFreightPotential(),
            freightPotential: `Manufacturing company with ${calculateFreightPotential().toLowerCase()} freight volume potential`,

            lastUpdated: new Date().toISOString(),
            leadScore: Math.floor(Math.random() * 40) + 60, // Base score 60-100 for manufacturers
            contactQuality: 'MEDIUM', // Will be enhanced by FMCSA cross-reference
          };

          results.push(manufacturer);
        });

        return results;
      });

      console.log(`Found ${manufacturers.length} manufacturers`);
      return manufacturers;
    } catch (error) {
      console.error('Failed to search manufacturers:', error);
      return [];
    }
  }

  async searchWholesalers(
    filters: ThomasNetSearchFilters
  ): Promise<WholesalerInfo[]> {
    if (!this.isLoggedIn) {
      const loginSuccess = await this.login();
      if (!loginSuccess) {
        throw new Error('Failed to log in to ThomasNet');
      }
    }

    if (!this.page) {
      throw new Error('Service not initialized');
    }

    try {
      console.log(
        'Searching for wholesalers/distributors with filters:',
        filters
      );

      // Navigate to distributor search
      await this.page.goto('https://www.thomasnet.com/suppliers', {
        waitUntil: 'networkidle2',
      });

      // Build wholesaler-focused search query
      let searchQuery = 'wholesaler distributor';
      if (filters.productKeywords && filters.productKeywords.length > 0) {
        searchQuery += ` ${filters.productKeywords.join(' ')}`;
      }

      await this.page.waitForSelector(
        '.search-input, input[name="what"], #what',
        { timeout: 10000 }
      );
      const searchInput = '.search-input, input[name="what"], #what';
      await this.page.type(searchInput, searchQuery);

      // Set location
      if (filters.location) {
        const locationInput = 'input[name="where"], #where, .location-input';
        const locationElement = await this.page.$(locationInput);
        if (locationElement) {
          await this.page.type(locationInput, filters.location);
        }
      }

      // Submit search
      const searchButton = await this.page.$(
        '.search-btn, button[type="submit"], .btn-search'
      );
      if (searchButton) {
        await searchButton.click();
      } else {
        await this.page.keyboard.press('Enter');
      }

      await this.page.waitForSelector(
        '.supplier-result, .company-listing, .search-result',
        { timeout: 15000 }
      );

      // Extract wholesaler information
      const wholesalers: WholesalerInfo[] = await this.page.evaluate(() => {
        const results: WholesalerInfo[] = [];
        const listingElements = document.querySelectorAll(
          '.supplier-result, .company-listing, .search-result, .supplier-item'
        );

        listingElements.forEach((listing, index) => {
          if (index >= 15) return; // Limit to first 15 results

          const getTextContent = (selector: string): string => {
            const element = listing.querySelector(selector);
            return element ? element.textContent?.trim() || '' : '';
          };

          const getAttribute = (
            selector: string,
            attribute: string
          ): string => {
            const element = listing.querySelector(selector);
            return element ? element.getAttribute(attribute) || '' : '';
          };

          // Calculate distribution volume potential
          const calculateDistributionVolume = ():
            | 'LOW'
            | 'MEDIUM'
            | 'HIGH'
            | 'CRITICAL' => {
            const companyName = getTextContent(
              '.company-name, .supplier-name, h2, h3'
            ).toLowerCase();
            const description = getTextContent(
              '.description, .company-description'
            ).toLowerCase();

            if (
              description.includes('national distribution') ||
              description.includes('supply chain') ||
              description.includes('logistics') ||
              companyName.includes('supply') ||
              companyName.includes('logistics')
            ) {
              return 'HIGH';
            }

            if (
              description.includes('regional') ||
              description.includes('wholesale') ||
              description.includes('distribution')
            ) {
              return 'MEDIUM';
            }

            return 'LOW';
          };

          const wholesaler: WholesalerInfo = {
            companyName: getTextContent(
              '.company-name, .supplier-name, h2, h3'
            ),
            address: getTextContent('.address, .supplier-address, .location'),
            phone: getTextContent('.phone, .telephone, .contact-phone'),
            website: getAttribute('a[href*="http"]', 'href'),

            distributionType: 'Wholesale Distribution',
            productCategories: getTextContent(
              '.products, .services, .description'
            )
              .split(',')
              .map((p) => p.trim())
              .filter((p) => p),

            distributionVolume: calculateDistributionVolume(),
            freightPotential: `Distribution company with ${calculateDistributionVolume().toLowerCase()} shipping volume`,

            lastUpdated: new Date().toISOString(),
            leadScore: Math.floor(Math.random() * 30) + 70, // Base score 70-100 for distributors
          };

          results.push(wholesaler);
        });

        return results;
      });

      console.log(`Found ${wholesalers.length} wholesalers/distributors`);
      return wholesalers;
    } catch (error) {
      console.error('Failed to search wholesalers:', error);
      return [];
    }
  }

  async getCompanyDetails(
    companyUrl: string
  ): Promise<ManufacturerInfo | null> {
    if (!this.page) {
      throw new Error('Service not initialized');
    }

    try {
      console.log(`Getting detailed company information from: ${companyUrl}`);

      await this.page.goto(companyUrl, { waitUntil: 'networkidle2' });

      // Wait for company profile page to load
      await this.page.waitForSelector(
        '.company-profile, .supplier-profile, .company-details',
        { timeout: 10000 }
      );

      // Extract detailed company information
      const companyDetails: ManufacturerInfo = await this.page.evaluate(() => {
        const getTextContent = (selector: string): string => {
          const element = document.querySelector(selector);
          return element ? element.textContent?.trim() || '' : '';
        };

        return {
          companyName: getTextContent('.company-name, h1'),
          address: getTextContent('.address, .company-address'),
          city: getTextContent('.city'),
          state: getTextContent('.state'),
          zipCode: getTextContent('.zip, .postal-code'),
          phone: getTextContent('.phone, .telephone'),
          website: getTextContent('.website, .company-website'),
          email: getTextContent('.email, .contact-email'),
          contactPerson: getTextContent('.contact-person, .primary-contact'),

          industryType: getTextContent('.industry, .business-type'),
          products: getTextContent('.products-services, .capabilities')
            .split('\n')
            .map((p) => p.trim())
            .filter((p) => p),
          yearsInBusiness: getTextContent('.years-in-business, .established'),
          employeeCount: getTextContent('.employee-count, .company-size'),

          facilitySize: getTextContent('.facility-size, .square-footage'),

          lastUpdated: new Date().toISOString(),
          leadScore: Math.floor(Math.random() * 40) + 60,
          contactQuality: 'HIGH', // Detailed profile indicates high quality lead
        };
      });

      return companyDetails;
    } catch (error) {
      console.error('Failed to get company details:', error);
      return null;
    }
  }

  async bulkManufacturerSearch(
    searchTerms: string[],
    location?: string
  ): Promise<ManufacturerInfo[]> {
    const allResults: ManufacturerInfo[] = [];

    for (const term of searchTerms) {
      try {
        const filters: ThomasNetSearchFilters = {
          productKeywords: [term],
          location: location,
        };

        const results = await this.searchManufacturers(filters);
        allResults.push(...results);

        // Add delay between searches to avoid being blocked
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } catch (error) {
        console.error(`Failed to search for term "${term}":`, error);
      }
    }

    // Remove duplicates based on company name
    const uniqueResults = allResults.filter(
      (company, index, self) =>
        index === self.findIndex((c) => c.companyName === company.companyName)
    );

    return uniqueResults;
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
      this.isLoggedIn = false;
      console.log('ThomasNet service closed');
    }
  }
}

export default ThomasNetService;
export type {
  ManufacturerInfo,
  ThomasNetCredentials,
  ThomasNetSearchFilters,
  WholesalerInfo,
};
