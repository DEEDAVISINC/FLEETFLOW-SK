/**
 * FLEETFLOW MULTI-CURRENCY CONVERSION SERVICE
 *
 * Core service for all currency operations across:
 * - Invoicing (multi-currency invoices)
 * - Quoting (quotes in customer's currency)
 * - Payments (process in any currency)
 * - Financial reporting (consolidated reporting)
 * - Automation (auto-detect and convert)
 *
 * Production: Integrate with live exchange rate APIs
 * - exchangerate-api.com (free tier: 1,500 requests/month)
 * - xe.com API
 * - openexchangerates.org
 */

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  region: string;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: Date;
  source: 'cache' | 'api' | 'manual';
}

export interface ConversionResult {
  originalAmount: number;
  originalCurrency: string;
  convertedAmount: number;
  convertedCurrency: string;
  exchangeRate: number;
  timestamp: Date;
  fees?: number;
  netAmount?: number;
}

export interface MultiCurrencyInvoice {
  invoiceId: string;
  baseCurrency: string;
  baseAmount: number;
  customerCurrency: string;
  customerAmount: number;
  exchangeRate: number;
  conversionDate: Date;
  locked: boolean; // Lock rate at time of invoice
}

export interface CurrencyPreference {
  entityId: string; // Customer, vendor, or contract ID
  entityType: 'customer' | 'vendor' | 'contract' | 'carrier';
  preferredCurrency: string;
  autoConvert: boolean;
  paymentCurrency?: string; // Different from invoice currency if needed
}

class CurrencyConversionService {
  private static instance: CurrencyConversionService;
  private exchangeRates: Map<string, Map<string, ExchangeRate>> = new Map();
  private rateCache: Map<string, { rate: number; expiresAt: number }> =
    new Map();
  private CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours

  // 31 Major Trading Currencies
  public readonly SUPPORTED_CURRENCIES: Currency[] = [
    // North America
    {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      flag: '🇺🇸',
      region: 'North America',
    },
    {
      code: 'CAD',
      name: 'Canadian Dollar',
      symbol: 'C$',
      flag: '🇨🇦',
      region: 'North America',
    },
    {
      code: 'MXN',
      name: 'Mexican Peso',
      symbol: 'MX$',
      flag: '🇲🇽',
      region: 'North America',
    },

    // Europe
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', region: 'Europe' },
    {
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      flag: '🇬🇧',
      region: 'Europe',
    },
    {
      code: 'CHF',
      name: 'Swiss Franc',
      symbol: 'CHF',
      flag: '🇨🇭',
      region: 'Europe',
    },
    {
      code: 'SEK',
      name: 'Swedish Krona',
      symbol: 'kr',
      flag: '🇸🇪',
      region: 'Europe',
    },
    {
      code: 'NOK',
      name: 'Norwegian Krone',
      symbol: 'kr',
      flag: '🇳🇴',
      region: 'Europe',
    },
    {
      code: 'DKK',
      name: 'Danish Krone',
      symbol: 'kr',
      flag: '🇩🇰',
      region: 'Europe',
    },
    {
      code: 'PLN',
      name: 'Polish Zloty',
      symbol: 'zł',
      flag: '🇵🇱',
      region: 'Europe',
    },
    {
      code: 'TRY',
      name: 'Turkish Lira',
      symbol: '₺',
      flag: '🇹🇷',
      region: 'Europe',
    },

    // Asia-Pacific
    {
      code: 'CNY',
      name: 'Chinese Yuan',
      symbol: '¥',
      flag: '🇨🇳',
      region: 'Asia',
    },
    {
      code: 'JPY',
      name: 'Japanese Yen',
      symbol: '¥',
      flag: '🇯🇵',
      region: 'Asia',
    },
    {
      code: 'INR',
      name: 'Indian Rupee',
      symbol: '₹',
      flag: '🇮🇳',
      region: 'Asia',
    },
    {
      code: 'KRW',
      name: 'South Korean Won',
      symbol: '₩',
      flag: '🇰🇷',
      region: 'Asia',
    },
    {
      code: 'SGD',
      name: 'Singapore Dollar',
      symbol: 'S$',
      flag: '🇸🇬',
      region: 'Asia',
    },
    {
      code: 'HKD',
      name: 'Hong Kong Dollar',
      symbol: 'HK$',
      flag: '🇭🇰',
      region: 'Asia',
    },
    { code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', region: 'Asia' },
    {
      code: 'VND',
      name: 'Vietnamese Dong',
      symbol: '₫',
      flag: '🇻🇳',
      region: 'Asia',
    },
    {
      code: 'PHP',
      name: 'Philippine Peso',
      symbol: '₱',
      flag: '🇵🇭',
      region: 'Asia',
    },
    {
      code: 'IDR',
      name: 'Indonesian Rupiah',
      symbol: 'Rp',
      flag: '🇮🇩',
      region: 'Asia',
    },
    {
      code: 'AUD',
      name: 'Australian Dollar',
      symbol: 'A$',
      flag: '🇦🇺',
      region: 'Asia-Pacific',
    },
    {
      code: 'NZD',
      name: 'New Zealand Dollar',
      symbol: 'NZ$',
      flag: '🇳🇿',
      region: 'Asia-Pacific',
    },

    // Middle East
    {
      code: 'AED',
      name: 'UAE Dirham',
      symbol: 'د.إ',
      flag: '🇦🇪',
      region: 'Middle East',
    },
    {
      code: 'SAR',
      name: 'Saudi Riyal',
      symbol: '﷼',
      flag: '🇸🇦',
      region: 'Middle East',
    },
    {
      code: 'ILS',
      name: 'Israeli Shekel',
      symbol: '₪',
      flag: '🇮🇱',
      region: 'Middle East',
    },

    // South America
    {
      code: 'BRL',
      name: 'Brazilian Real',
      symbol: 'R$',
      flag: '🇧🇷',
      region: 'South America',
    },
    {
      code: 'ARS',
      name: 'Argentine Peso',
      symbol: '$',
      flag: '🇦🇷',
      region: 'South America',
    },
    {
      code: 'CLP',
      name: 'Chilean Peso',
      symbol: '$',
      flag: '🇨🇱',
      region: 'South America',
    },
    {
      code: 'COP',
      name: 'Colombian Peso',
      symbol: '$',
      flag: '🇨🇴',
      region: 'South America',
    },

    // Africa
    {
      code: 'ZAR',
      name: 'South African Rand',
      symbol: 'R',
      flag: '🇿🇦',
      region: 'Africa',
    },
  ];

  private constructor() {
    this.loadExchangeRates();
  }

  public static getInstance(): CurrencyConversionService {
    if (!CurrencyConversionService.instance) {
      CurrencyConversionService.instance = new CurrencyConversionService();
    }
    return CurrencyConversionService.instance;
  }

  /**
   * CORE CONVERSION METHOD
   * Used by all financial operations
   */
  public async convert(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    options: {
      date?: Date;
      includeFees?: boolean;
      feePercentage?: number;
    } = {}
  ): Promise<ConversionResult> {
    if (fromCurrency === toCurrency) {
      return {
        originalAmount: amount,
        originalCurrency: fromCurrency,
        convertedAmount: amount,
        convertedCurrency: toCurrency,
        exchangeRate: 1,
        timestamp: new Date(),
      };
    }

    const rate = await this.getExchangeRate(
      fromCurrency,
      toCurrency,
      options.date
    );
    const convertedAmount = amount * rate;

    let fees = 0;
    let netAmount = convertedAmount;

    if (options.includeFees && options.feePercentage) {
      fees = convertedAmount * (options.feePercentage / 100);
      netAmount = convertedAmount - fees;
    }

    return {
      originalAmount: amount,
      originalCurrency: fromCurrency,
      convertedAmount,
      convertedCurrency: toCurrency,
      exchangeRate: rate,
      timestamp: new Date(),
      fees: options.includeFees ? fees : undefined,
      netAmount: options.includeFees ? netAmount : undefined,
    };
  }

  /**
   * AUTOMATED INVOICE CURRENCY CONVERSION
   * Automatically converts invoice to customer's preferred currency
   */
  public async createMultiCurrencyInvoice(
    invoiceAmount: number,
    baseCurrency: string,
    customerId: string,
    lockRate: boolean = true
  ): Promise<MultiCurrencyInvoice> {
    const customerPreference = await this.getCurrencyPreference(
      customerId,
      'customer'
    );
    const targetCurrency =
      customerPreference?.preferredCurrency || baseCurrency;

    const conversion = await this.convert(
      invoiceAmount,
      baseCurrency,
      targetCurrency
    );

    return {
      invoiceId: `INV-${Date.now()}`,
      baseCurrency,
      baseAmount: invoiceAmount,
      customerCurrency: targetCurrency,
      customerAmount: conversion.convertedAmount,
      exchangeRate: conversion.exchangeRate,
      conversionDate: new Date(),
      locked: lockRate, // Lock rate to prevent fluctuation
    };
  }

  /**
   * AUTOMATED QUOTE GENERATION
   * Generate quote in customer's currency
   */
  public async generateMultiCurrencyQuote(
    quoteAmount: number,
    baseCurrency: string,
    customerId: string,
    additionalCurrencies: string[] = []
  ): Promise<{
    primary: ConversionResult;
    alternatives: ConversionResult[];
  }> {
    const customerPreference = await this.getCurrencyPreference(
      customerId,
      'customer'
    );
    const targetCurrency = customerPreference?.preferredCurrency || 'USD';

    const primary = await this.convert(
      quoteAmount,
      baseCurrency,
      targetCurrency
    );

    const alternatives = await Promise.all(
      additionalCurrencies.map((currency) =>
        this.convert(quoteAmount, baseCurrency, currency)
      )
    );

    return { primary, alternatives };
  }

  /**
   * PAYMENT PROCESSING WITH CURRENCY CONVERSION
   * Handle payments in different currencies
   */
  public async processPaymentConversion(
    paymentAmount: number,
    paymentCurrency: string,
    expectedCurrency: string,
    invoiceAmount: number
  ): Promise<{
    paymentReceived: number;
    expectedAmount: number;
    difference: number;
    exchangeRate: number;
    status: 'exact' | 'overpaid' | 'underpaid';
  }> {
    const conversion = await this.convert(
      paymentAmount,
      paymentCurrency,
      expectedCurrency
    );

    const difference = conversion.convertedAmount - invoiceAmount;
    const tolerance = invoiceAmount * 0.01; // 1% tolerance for rate fluctuation

    let status: 'exact' | 'overpaid' | 'underpaid';
    if (Math.abs(difference) <= tolerance) {
      status = 'exact';
    } else if (difference > 0) {
      status = 'overpaid';
    } else {
      status = 'underpaid';
    }

    return {
      paymentReceived: conversion.convertedAmount,
      expectedAmount: invoiceAmount,
      difference,
      exchangeRate: conversion.exchangeRate,
      status,
    };
  }

  /**
   * FINANCIAL REPORTING - CONSOLIDATE MULTI-CURRENCY
   * Convert all amounts to base currency for reporting
   */
  public async consolidateFinancials(
    transactions: Array<{ amount: number; currency: string }>,
    baseCurrency: string = 'USD'
  ): Promise<{
    totalInBaseCurrency: number;
    breakdown: Array<{
      currency: string;
      originalTotal: number;
      convertedTotal: number;
      count: number;
    }>;
  }> {
    const breakdown = new Map<
      string,
      { originalTotal: number; convertedTotal: number; count: number }
    >();

    for (const txn of transactions) {
      if (!breakdown.has(txn.currency)) {
        breakdown.set(txn.currency, {
          originalTotal: 0,
          convertedTotal: 0,
          count: 0,
        });
      }

      const entry = breakdown.get(txn.currency)!;
      entry.originalTotal += txn.amount;
      entry.count += 1;

      const conversion = await this.convert(
        txn.amount,
        txn.currency,
        baseCurrency
      );
      entry.convertedTotal += conversion.convertedAmount;
    }

    const totalInBaseCurrency = Array.from(breakdown.values()).reduce(
      (sum, entry) => sum + entry.convertedTotal,
      0
    );

    return {
      totalInBaseCurrency,
      breakdown: Array.from(breakdown.entries()).map(([currency, data]) => ({
        currency,
        ...data,
      })),
    };
  }

  /**
   * AUTO-DETECT CURRENCY FROM LOCATION
   * Automation: detect customer location and suggest currency
   */
  public getCurrencyByCountry(countryCode: string): Currency | null {
    const countryToCurrency: { [key: string]: string } = {
      US: 'USD',
      CA: 'CAD',
      MX: 'MXN',
      GB: 'GBP',
      FR: 'EUR',
      DE: 'EUR',
      IT: 'EUR',
      ES: 'EUR',
      NL: 'EUR',
      BE: 'EUR',
      AT: 'EUR',
      PT: 'EUR',
      CH: 'CHF',
      SE: 'SEK',
      NO: 'NOK',
      DK: 'DKK',
      PL: 'PLN',
      TR: 'TRY',
      CN: 'CNY',
      JP: 'JPY',
      IN: 'INR',
      KR: 'KRW',
      SG: 'SGD',
      HK: 'HKD',
      TH: 'THB',
      VN: 'VND',
      PH: 'PHP',
      ID: 'IDR',
      AU: 'AUD',
      NZ: 'NZD',
      AE: 'AED',
      SA: 'SAR',
      IL: 'ILS',
      BR: 'BRL',
      AR: 'ARS',
      CL: 'CLP',
      CO: 'COP',
      ZA: 'ZAR',
    };

    const currencyCode = countryToCurrency[countryCode.toUpperCase()];
    return currencyCode ? this.getCurrencyInfo(currencyCode) : null;
  }

  /**
   * CURRENCY PREFERENCE MANAGEMENT
   * Store and retrieve customer/vendor currency preferences
   */
  public async saveCurrencyPreference(
    preference: CurrencyPreference
  ): Promise<void> {
    // In production: Save to database
    // await db.currencyPreferences.upsert(preference);
    console.log('💾 Currency preference saved:', preference);
  }

  public async getCurrencyPreference(
    entityId: string,
    entityType: CurrencyPreference['entityType']
  ): Promise<CurrencyPreference | null> {
    // In production: Fetch from database
    // return await db.currencyPreferences.findOne({ entityId, entityType });
    return null; // Mock for now
  }

  /**
   * GET EXCHANGE RATE
   * Fetch from cache or API
   */
  private async getExchangeRate(
    from: string,
    to: string,
    date?: Date
  ): Promise<number> {
    const cacheKey = `${from}_${to}`;
    const cached = this.rateCache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.rate;
    }

    // In production: Fetch from live API
    // const rate = await this.fetchLiveRate(from, to);

    // For now, use mock rates
    const rate = this.getMockRate(from, to);

    this.rateCache.set(cacheKey, {
      rate,
      expiresAt: Date.now() + this.CACHE_DURATION,
    });

    return rate;
  }

  /**
   * LOAD EXCHANGE RATES (Mock Data)
   * In production: Replace with live API
   */
  private loadExchangeRates(): void {
    // Mock data - same as in the UI
    // In production: Fetch from exchangerate-api.com or similar
  }

  private getMockRate(from: string, to: string): number {
    // Simplified mock rates (use the same data structure from the UI)
    const rates: { [key: string]: { [key: string]: number } } = {
      USD: { EUR: 0.92, GBP: 0.79, CNY: 7.24, JPY: 149.5, CAD: 1.36 },
      EUR: { USD: 1.09, GBP: 0.86, CNY: 7.87, JPY: 162.5, CAD: 1.48 },
      GBP: { USD: 1.27, EUR: 1.16, CNY: 9.18, JPY: 189.5, CAD: 1.72 },
      CNY: { USD: 0.138, EUR: 0.127, GBP: 0.109, JPY: 20.65, CAD: 0.188 },
      // Add more as needed...
    };

    return rates[from]?.[to] || 1;
  }

  /**
   * FORMAT CURRENCY
   * Display currency with proper symbol and formatting
   */
  public formatCurrency(amount: number, currencyCode: string): string {
    const currency = this.getCurrencyInfo(currencyCode);
    if (!currency) return `${amount} ${currencyCode}`;

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  public getCurrencyInfo(code: string): Currency | undefined {
    return this.SUPPORTED_CURRENCIES.find((c) => c.code === code);
  }

  /**
   * BATCH CONVERSION
   * Convert multiple amounts at once (for reports, dashboards)
   */
  public async batchConvert(
    conversions: Array<{ amount: number; from: string; to: string }>
  ): Promise<ConversionResult[]> {
    return Promise.all(
      conversions.map((c) => this.convert(c.amount, c.from, c.to))
    );
  }
}

// Export singleton instance
export const currencyService = CurrencyConversionService.getInstance();
export default currencyService;
