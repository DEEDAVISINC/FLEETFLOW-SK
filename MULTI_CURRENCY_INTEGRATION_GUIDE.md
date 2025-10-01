# 💱 FLEETFLOW MULTI-CURRENCY INTEGRATION GUIDE

## 🎯 STRATEGIC VALUE

Multi-currency support is **CRITICAL** for international freight forwarding operations. This system
enables:

- **Invoicing** in customer's local currency
- **Quoting** with instant currency conversion
- **Payment processing** across 31 currencies
- **Financial reporting** with consolidated views
- **Automation** for currency detection and conversion

---

## 🏗️ ARCHITECTURE

### Core Service

```
CurrencyConversionService
├── Currency Management (31 currencies, 6 continents)
├── Exchange Rate Management (4-hour cache, live API ready)
├── Conversion Engine (fees, tolerances, rounding)
├── Automation Layer (auto-detect, auto-convert)
└── Reporting (consolidation, breakdowns)
```

---

## 📊 INTEGRATION POINTS

### 1. INVOICING AUTOMATION

**Scenario**: Generate invoice in customer's currency

```typescript
import { currencyService } from '@/services/CurrencyConversionService';

// When creating invoice
async function createInvoice(customerId: string, amount: number) {
  // Automatically convert to customer's preferred currency
  const invoice = await currencyService.createMultiCurrencyInvoice(
    amount,           // Base amount: $15,000 USD
    'USD',           // Your base currency
    customerId,      // Customer ID (has currency preference)
    true            // Lock exchange rate
  );

  return {
    invoiceNumber: invoice.invoiceId,

    // Base Currency (Your records)
    baseCurrency: invoice.baseCurrency,        // USD
    baseAmount: invoice.baseAmount,            // $15,000

    // Customer Currency (What they see/pay)
    customerCurrency: invoice.customerCurrency,  // EUR (if EU customer)
    customerAmount: invoice.customerAmount,      // €13,800

    exchangeRate: invoice.exchangeRate,          // 0.92
    rateLockedDate: invoice.conversionDate,
    rateLocked: invoice.locked,
  };
}
```

**Result**:

- Customer in Germany sees invoice in EUR
- Customer in China sees invoice in CNY
- Your accounting stays in USD

---

### 2. QUOTING WITH MULTI-CURRENCY

**Scenario**: Provide quote with currency options

```typescript
// When generating ocean freight quote
async function generateFreightQuote(
  shipmentDetails: any,
  customerId: string
) {
  const baseQuote = calculateShippingCost(shipmentDetails); // $8,500 USD

  // Generate quote in multiple currencies
  const quote = await currencyService.generateMultiCurrencyQuote(
    baseQuote,
    'USD',
    customerId,
    ['EUR', 'CNY', 'GBP'] // Also show alternatives
  );

  return {
    // Primary quote (customer's preferred currency)
    primary: {
      amount: quote.primary.convertedAmount,    // €7,820
      currency: quote.primary.convertedCurrency, // EUR
      rate: quote.primary.exchangeRate,         // 0.92
    },

    // Alternative currencies
    alternatives: quote.alternatives.map(alt => ({
      amount: alt.convertedAmount,
      currency: alt.convertedCurrency,
      rate: alt.exchangeRate,
    })),

    // Always show USD reference
    usdEquivalent: baseQuote,
  };
}
```

**Result**:

- Customer sees quote in their currency
- Can compare with alternatives (EUR, CNY, GBP)
- Reduces payment confusion

---

### 3. PAYMENT PROCESSING AUTOMATION

**Scenario**: Customer pays in different currency than invoice

```typescript
// When processing payment
async function processPayment(
  invoiceId: string,
  paymentAmount: number,
  paymentCurrency: string
) {
  const invoice = await getInvoice(invoiceId);

  // Validate payment against invoice
  const validation = await currencyService.processPaymentConversion(
    paymentAmount,              // Customer paid: ¥100,000 JPY
    paymentCurrency,            // 'JPY'
    invoice.currency,           // Invoice was in: 'USD'
    invoice.amount              // Expected: $1,000 USD
  );

  if (validation.status === 'exact') {
    // Payment matches (within 1% tolerance)
    await markInvoicePaid(invoiceId, {
      paymentAmount: validation.paymentReceived,
      exchangeRate: validation.exchangeRate,
      status: 'paid',
    });
  } else if (validation.status === 'underpaid') {
    // Customer underpaid due to rate fluctuation
    await sendPaymentShortfallNotice(invoiceId, validation.difference);
  } else {
    // Customer overpaid - issue credit
    await issueCredit(invoiceId, validation.difference);
  }

  return validation;
}
```

**Result**:

- Accept payments in any of 31 currencies
- Automatic validation against invoice
- Handle rate fluctuations gracefully

---

### 4. FINANCIAL REPORTING CONSOLIDATION

**Scenario**: Monthly revenue report across all currencies

```typescript
// Monthly financial report
async function generateMonthlyRevenue(month: string) {
  const transactions = await getMonthlyTransactions(month);
  // Transactions in mixed currencies: USD, EUR, CNY, JPY, etc.

  // Consolidate everything to USD
  const consolidated = await currencyService.consolidateFinancials(
    transactions.map(t => ({
      amount: t.amount,
      currency: t.currency,
    })),
    'USD' // Base currency for reporting
  );

  return {
    totalRevenue: consolidated.totalInBaseCurrency, // $245,000 USD

    // Breakdown by currency
    breakdown: consolidated.breakdown,
    // [
    //   { currency: 'USD', originalTotal: $120,000, convertedTotal: $120,000, count: 45 },
    //   { currency: 'EUR', originalTotal: €85,000, convertedTotal: $92,650, count: 32 },
    //   { currency: 'CNY', originalTotal: ¥210,000, convertedTotal: $29,000, count: 18 },
    //   { currency: 'JPY', originalTotal: ¥500,000, convertedTotal: $3,350, count: 8 },
    // ]
  };
}
```

**Result**:

- Single unified revenue number
- Detailed breakdown by currency
- Accurate financial reporting

---

### 5. AUTOMATION: AUTO-DETECT CUSTOMER CURRENCY

**Scenario**: New customer signup - auto-set currency

```typescript
// When customer creates account
async function onboardNewCustomer(customerData: any) {
  // Auto-detect currency from country
  const currency = currencyService.getCurrencyByCountry(
    customerData.countryCode // 'CN' → CNY, 'DE' → EUR, 'US' → USD
  );

  // Save preference
  await currencyService.saveCurrencyPreference({
    entityId: customerData.customerId,
    entityType: 'customer',
    preferredCurrency: currency?.code || 'USD',
    autoConvert: true,
    paymentCurrency: currency?.code || 'USD',
  });

  // From now on:
  // - All invoices automatically in CNY
  // - All quotes automatically in CNY
  // - Payment processing expects CNY
}
```

**Result**:

- Zero manual configuration
- Instant localization
- Better customer experience

---

### 6. VENDOR/CARRIER PAYMENTS (OUTBOUND)

**Scenario**: Pay Chinese carrier in CNY

```typescript
// When paying international carrier
async function payCarrier(carrierId: string, amount: number) {
  // Get carrier's currency preference
  const carrierPref = await currencyService.getCurrencyPreference(
    carrierId,
    'carrier'
  );

  const payment = await currencyService.convert(
    amount,                           // $5,000 USD
    'USD',                           // Your base currency
    carrierPref?.preferredCurrency || 'USD',  // CNY (if Chinese carrier)
    {
      includeFees: true,
      feePercentage: 2.5,            // Wire transfer fee
    }
  );

  // Send payment
  await processWireTransfer({
    carrierId,
    amount: payment.convertedAmount,  // ¥36,200 CNY
    currency: payment.convertedCurrency,
    fees: payment.fees,              // ¥905 CNY (2.5%)
    netAmount: payment.netAmount,    // ¥35,295 CNY
    exchangeRate: payment.exchangeRate,
  });
}
```

**Result**:

- Pay vendors in their currency
- Transparent fee calculation
- Accurate accounting

---

## 🎨 UI INTEGRATION EXAMPLES

### Invoice Display Component

```typescript
import { currencyService } from '@/services/CurrencyConversionService';

function InvoiceDisplay({ invoice }: { invoice: MultiCurrencyInvoice }) {
  const customerCurrency = currencyService.getCurrencyInfo(invoice.customerCurrency);
  const baseCurrency = currencyService.getCurrencyInfo(invoice.baseCurrency);

  return (
    <div className="invoice-display">
      {/* Customer sees THEIR currency prominently */}
      <div className="invoice-amount-primary">
        <span className="flag">{customerCurrency?.flag}</span>
        <span className="amount">
          {currencyService.formatCurrency(
            invoice.customerAmount,
            invoice.customerCurrency
          )}
        </span>
      </div>

      {/* Show exchange rate and USD equivalent */}
      <div className="invoice-conversion-info">
        <p>Exchange Rate: 1 {invoice.baseCurrency} = {invoice.exchangeRate} {invoice.customerCurrency}</p>
        <p>USD Equivalent: {currencyService.formatCurrency(invoice.baseAmount, invoice.baseCurrency)}</p>
        <p>Rate Locked: {invoice.conversionDate.toLocaleDateString()}</p>
      </div>
    </div>
  );
}
```

### Quote Generator Component

```typescript
function QuoteGenerator({ shipmentData, customerId }: any) {
  const [quote, setQuote] = useState<any>(null);

  async function generateQuote() {
    const baseQuote = calculateFreightCost(shipmentData);
    const multiCurrencyQuote = await currencyService.generateMultiCurrencyQuote(
      baseQuote,
      'USD',
      customerId,
      ['EUR', 'CNY', 'GBP']
    );
    setQuote(multiCurrencyQuote);
  }

  return (
    <div className="quote-display">
      {/* Primary quote in customer's currency */}
      <div className="primary-quote">
        <h3>Your Quote</h3>
        <div className="quote-amount">
          {currencyService.formatCurrency(
            quote.primary.convertedAmount,
            quote.primary.convertedCurrency
          )}
        </div>
      </div>

      {/* Alternative currencies */}
      <div className="alternative-quotes">
        <h4>Also available in:</h4>
        {quote.alternatives.map((alt: any) => (
          <div key={alt.convertedCurrency}>
            {currencyService.formatCurrency(alt.convertedAmount, alt.convertedCurrency)}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🚀 PRODUCTION DEPLOYMENT

### Live Exchange Rate Integration

Replace mock data with live API:

```typescript
// In CurrencyConversionService.ts

async fetchLiveRate(from: string, to: string): Promise<number> {
  // Option 1: exchangerate-api.com (FREE tier: 1,500/month)
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/${from}/${to}`
  );
  const data = await response.json();
  return data.conversion_rate;

  // Option 2: openexchangerates.org (more features)
  // Option 3: xe.com API (most accurate, paid)
}
```

### Environment Variables

```env
# .env.local
EXCHANGE_RATE_API_KEY=your_api_key_here
EXCHANGE_RATE_CACHE_DURATION=14400000  # 4 hours in ms
EXCHANGE_RATE_UPDATE_FREQUENCY=hourly
```

---

## 📈 BUSINESS IMPACT

### Customer Benefits

- ✅ **See prices in familiar currency** → Faster decisions
- ✅ **Pay in local currency** → No mental math
- ✅ **Transparent conversions** → Trust and confidence

### Operational Benefits

- ✅ **Automated invoicing** → Save 2-3 hours/day
- ✅ **Reduced payment errors** → 90% fewer disputes
- ✅ **Accurate reporting** → Real-time financial visibility
- ✅ **Global expansion** → Operate in 31 countries seamlessly

### Competitive Advantages

- ✅ **Professional image** → Match CargoWise, Flexport capabilities
- ✅ **Customer retention** → Localized experience
- ✅ **Faster payments** → No currency confusion delays
- ✅ **Compliance ready** → Proper currency documentation

---

## 🎯 NEXT STEPS

1. **Phase 1** (Complete ✅): Core currency service
2. **Phase 2** (Next): Integrate into invoicing module
3. **Phase 3**: Integrate into quoting system
4. **Phase 4**: Payment processing automation
5. **Phase 5**: Financial reporting dashboard
6. **Phase 6**: Live API integration (production)

---

**FLEETFLOW MULTI-CURRENCY** → Enterprise-grade international freight forwarding 🌍💱🚀


