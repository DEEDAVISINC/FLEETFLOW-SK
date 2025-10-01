/**
 * FREIGHT FORWARDER INVOICING AUTOMATION
 *
 * Example integration showing multi-currency automation
 * for invoicing, quoting, and payment processing
 */

import { currencyService } from './CurrencyConversionService';

// ============================================
// EXAMPLE 1: AUTO-GENERATE MULTI-CURRENCY INVOICE
// ============================================

export async function createFreightInvoice(params: {
  customerId: string;
  shipmentId: string;
  services: Array<{
    description: string;
    amount: number;
  }>;
  baseCurrency: string;
}) {
  // Calculate total
  const totalAmount = params.services.reduce((sum, s) => sum + s.amount, 0);

  // Auto-convert to customer's preferred currency
  const invoice = await currencyService.createMultiCurrencyInvoice(
    totalAmount,
    params.baseCurrency,
    params.customerId,
    true // Lock exchange rate
  );

  console.log('📄 Invoice Generated:');
  console.log(`   Invoice ID: ${invoice.invoiceId}`);
  console.log(
    `   Customer sees: ${currencyService.formatCurrency(invoice.customerAmount, invoice.customerCurrency)}`
  );
  console.log(
    `   Your records: ${currencyService.formatCurrency(invoice.baseAmount, invoice.baseCurrency)}`
  );
  console.log(`   Exchange Rate: ${invoice.exchangeRate} (locked)`);

  return {
    invoiceId: invoice.invoiceId,
    shipmentId: params.shipmentId,
    customerId: params.customerId,

    // Line items
    lineItems: params.services,

    // Customer view (in their currency)
    customerView: {
      currency: invoice.customerCurrency,
      total: invoice.customerAmount,
      formatted: currencyService.formatCurrency(
        invoice.customerAmount,
        invoice.customerCurrency
      ),
    },

    // Internal accounting (your base currency)
    accounting: {
      currency: invoice.baseCurrency,
      total: invoice.baseAmount,
      formatted: currencyService.formatCurrency(
        invoice.baseAmount,
        invoice.baseCurrency
      ),
    },

    // Exchange rate info
    exchangeRate: {
      rate: invoice.exchangeRate,
      locked: invoice.locked,
      date: invoice.conversionDate,
    },

    // Payment instructions
    paymentInstructions: {
      acceptedCurrencies: [
        invoice.customerCurrency,
        invoice.baseCurrency,
        'USD',
      ],
      preferredCurrency: invoice.customerCurrency,
    },
  };
}

// ============================================
// EXAMPLE 2: MULTI-CURRENCY QUOTE GENERATION
// ============================================

export async function generateFreightQuote(params: {
  customerId: string;
  origin: string;
  destination: string;
  containerType: string;
  baseCurrency: string;
}) {
  // Calculate base quote
  const baseQuote = calculateFreightCost(params);

  // Generate quote in customer's currency + alternatives
  const multiCurrencyQuote = await currencyService.generateMultiCurrencyQuote(
    baseQuote,
    params.baseCurrency,
    params.customerId,
    ['USD', 'EUR', 'CNY'] // Show alternatives
  );

  console.log('💰 Quote Generated:');
  console.log(
    `   Primary: ${currencyService.formatCurrency(multiCurrencyQuote.primary.convertedAmount, multiCurrencyQuote.primary.convertedCurrency)}`
  );
  console.log(`   Alternatives:`);
  multiCurrencyQuote.alternatives.forEach((alt) => {
    console.log(
      `      ${currencyService.formatCurrency(alt.convertedAmount, alt.convertedCurrency)}`
    );
  });

  return {
    quoteId: `QT-${Date.now()}`,
    route: `${params.origin} → ${params.destination}`,

    // Primary quote (customer's currency)
    primaryQuote: {
      amount: multiCurrencyQuote.primary.convertedAmount,
      currency: multiCurrencyQuote.primary.convertedCurrency,
      formatted: currencyService.formatCurrency(
        multiCurrencyQuote.primary.convertedAmount,
        multiCurrencyQuote.primary.convertedCurrency
      ),
    },

    // Alternative currencies
    alternativeQuotes: multiCurrencyQuote.alternatives.map((alt) => ({
      amount: alt.convertedAmount,
      currency: alt.convertedCurrency,
      formatted: currencyService.formatCurrency(
        alt.convertedAmount,
        alt.convertedCurrency
      ),
    })),

    // Valid for 7 days
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
}

// ============================================
// EXAMPLE 3: PAYMENT PROCESSING AUTOMATION
// ============================================

export async function processInvoicePayment(params: {
  invoiceId: string;
  paymentAmount: number;
  paymentCurrency: string;
  expectedAmount: number;
  expectedCurrency: string;
}) {
  // Validate payment
  const validation = await currencyService.processPaymentConversion(
    params.paymentAmount,
    params.paymentCurrency,
    params.expectedCurrency,
    params.expectedAmount
  );

  console.log('💳 Payment Processed:');
  console.log(
    `   Received: ${currencyService.formatCurrency(params.paymentAmount, params.paymentCurrency)}`
  );
  console.log(
    `   Expected: ${currencyService.formatCurrency(params.expectedAmount, params.expectedCurrency)}`
  );
  console.log(`   Status: ${validation.status}`);

  // Handle different scenarios
  if (validation.status === 'exact') {
    // Payment matches - mark as paid
    return {
      status: 'paid',
      invoiceId: params.invoiceId,
      message: 'Payment received in full',
      details: {
        amountReceived: validation.paymentReceived,
        currency: params.expectedCurrency,
        exchangeRate: validation.exchangeRate,
      },
    };
  } else if (validation.status === 'underpaid') {
    // Underpayment - send reminder
    return {
      status: 'partial',
      invoiceId: params.invoiceId,
      message: `Payment short by ${currencyService.formatCurrency(Math.abs(validation.difference), params.expectedCurrency)}`,
      action: 'send_payment_reminder',
      outstandingBalance: Math.abs(validation.difference),
    };
  } else {
    // Overpayment - issue credit
    return {
      status: 'overpaid',
      invoiceId: params.invoiceId,
      message: `Overpayment of ${currencyService.formatCurrency(validation.difference, params.expectedCurrency)}`,
      action: 'issue_credit_note',
      creditAmount: validation.difference,
    };
  }
}

// ============================================
// EXAMPLE 4: MONTHLY REVENUE REPORT
// ============================================

export async function generateMonthlyRevenueReport(month: string) {
  // Fetch transactions (mock data)
  const transactions = [
    {
      customerId: 'C001',
      amount: 15000,
      currency: 'USD',
      type: 'ocean_freight',
    },
    { customerId: 'C002', amount: 12500, currency: 'EUR', type: 'air_freight' },
    {
      customerId: 'C003',
      amount: 85000,
      currency: 'CNY',
      type: 'ocean_freight',
    },
    {
      customerId: 'C004',
      amount: 1200000,
      currency: 'JPY',
      type: 'customs_clearance',
    },
    { customerId: 'C005', amount: 8500, currency: 'USD', type: 'warehousing' },
    { customerId: 'C006', amount: 6200, currency: 'GBP', type: 'air_freight' },
  ];

  // Consolidate to USD
  const report = await currencyService.consolidateFinancials(
    transactions,
    'USD'
  );

  console.log('📊 Monthly Revenue Report:');
  console.log(
    `   Total Revenue: ${currencyService.formatCurrency(report.totalInBaseCurrency, 'USD')}`
  );
  console.log(`   Breakdown:`);
  report.breakdown.forEach((item) => {
    console.log(
      `      ${item.currency}: ${currencyService.formatCurrency(item.originalTotal, item.currency)} → ${currencyService.formatCurrency(item.convertedTotal, 'USD')} (${item.count} transactions)`
    );
  });

  return {
    month,
    totalRevenue: report.totalInBaseCurrency,
    totalRevenueFormatted: currencyService.formatCurrency(
      report.totalInBaseCurrency,
      'USD'
    ),
    breakdown: report.breakdown.map((item) => ({
      currency: item.currency,
      originalTotal: item.originalTotal,
      originalTotalFormatted: currencyService.formatCurrency(
        item.originalTotal,
        item.currency
      ),
      convertedTotal: item.convertedTotal,
      convertedTotalFormatted: currencyService.formatCurrency(
        item.convertedTotal,
        'USD'
      ),
      transactionCount: item.count,
    })),
  };
}

// ============================================
// EXAMPLE 5: AUTO-DETECT CUSTOMER CURRENCY
// ============================================

export async function onboardNewCustomer(customerData: {
  customerId: string;
  companyName: string;
  countryCode: string;
  email: string;
}) {
  // Auto-detect currency from country
  const currency = currencyService.getCurrencyByCountry(
    customerData.countryCode
  );

  if (currency) {
    // Save preference
    await currencyService.saveCurrencyPreference({
      entityId: customerData.customerId,
      entityType: 'customer',
      preferredCurrency: currency.code,
      autoConvert: true,
      paymentCurrency: currency.code,
    });

    console.log(`✅ Customer Onboarded: ${customerData.companyName}`);
    console.log(
      `   Country: ${customerData.countryCode} → Currency: ${currency.flag} ${currency.code}`
    );
    console.log(`   All future invoices will be in ${currency.code}`);

    return {
      customerId: customerData.customerId,
      preferredCurrency: currency,
      autoConvertEnabled: true,
      message: `Currency preference set to ${currency.name}`,
    };
  }

  return {
    customerId: customerData.customerId,
    preferredCurrency: null,
    autoConvertEnabled: false,
    message: 'No currency preference detected, defaulting to USD',
  };
}

// ============================================
// HELPER: CALCULATE FREIGHT COST (Mock)
// ============================================

function calculateFreightCost(params: {
  origin: string;
  destination: string;
  containerType: string;
}): number {
  // Mock calculation
  const baseCosts: { [key: string]: number } = {
    '20FT': 2500,
    '40FT': 4500,
    '40HC': 4800,
  };
  return baseCosts[params.containerType] || 3000;
}

// ============================================
// USAGE EXAMPLES
// ============================================

/*

// Example 1: Create Invoice
const invoice = await createFreightInvoice({
  customerId: 'CUST-001',
  shipmentId: 'SHIP-12345',
  services: [
    { description: 'Ocean Freight (40HC Shanghai → LA)', amount: 4800 },
    { description: 'Customs Clearance', amount: 350 },
    { description: 'Trucking (Port → Warehouse)', amount: 450 },
  ],
  baseCurrency: 'USD',
});

// Example 2: Generate Quote
const quote = await generateFreightQuote({
  customerId: 'CUST-002',
  origin: 'Shanghai, China',
  destination: 'Los Angeles, USA',
  containerType: '40HC',
  baseCurrency: 'USD',
});

// Example 3: Process Payment
const payment = await processInvoicePayment({
  invoiceId: 'INV-001',
  paymentAmount: 100000,
  paymentCurrency: 'JPY',
  expectedAmount: 670,
  expectedCurrency: 'USD',
});

// Example 4: Monthly Report
const report = await generateMonthlyRevenueReport('2025-01');

// Example 5: Onboard Customer
const customer = await onboardNewCustomer({
  customerId: 'CUST-003',
  companyName: 'Shenzhen Electronics Co.',
  countryCode: 'CN',
  email: 'procurement@shenzhen-elec.com',
});

*/
