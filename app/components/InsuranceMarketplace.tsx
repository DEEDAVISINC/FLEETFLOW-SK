'use client';

import {
  Building2,
  DollarSign,
  FileText,
  Phone,
  Shield,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  InsuranceQuote,
  InsuranceQuoteRequest,
  PartnershipRevenue,
  insurancePartnershipService,
} from '../services/insurance-partnership-service';

interface InsuranceMarketplaceProps {
  tenantId: string;
}

export default function InsuranceMarketplace({
  tenantId,
}: InsuranceMarketplaceProps) {
  const [activeTab, setActiveTab] = useState<
    'marketplace' | 'quotes' | 'analytics'
  >('marketplace');
  const [quotes, setQuotes] = useState<InsuranceQuote[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string>('');

  // Form state for insurance quote request
  const [formData, setFormData] = useState({
    businessName: '',
    mcNumber: '',
    dotNumber: '',
    businessType: 'trucking' as const,
    yearsInBusiness: 1,
    annualRevenue: 500000,
    employeeCount: 5,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: 'Owner',
    vehicleCount: 1,
    driversCount: 1,
    operatingRadius: 'regional' as const,
    annualMileage: 100000,
    hasExistingCoverage: false,
    currentCarrier: '',
    insuranceTypes: ['commercial_auto', 'general_liability'] as string[],
    autoLiability: '$1,000,000',
    generalLiability: '$1,000,000',
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const analyticsData =
        insurancePartnershipService.getPartnershipAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const handleSubmitQuoteRequest = async () => {
    if (!formData.businessName || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

      const quoteRequest: InsuranceQuoteRequest = {
        id: requestId,
        tenantId,
        companyInfo: {
          businessName: formData.businessName,
          mcNumber: formData.mcNumber || undefined,
          dotNumber: formData.dotNumber || undefined,
          businessType: formData.businessType,
          yearsInBusiness: formData.yearsInBusiness,
          annualRevenue: formData.annualRevenue,
          employeeCount: formData.employeeCount,
          businessAddress: {
            street: '123 Main St', // In production, collect full address
            city: 'Atlanta',
            state: 'GA',
            zipCode: '30309',
          },
        },
        contactInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          title: formData.title,
        },
        insuranceTypes: formData.insuranceTypes.map((type) => ({
          type: type as any,
          required: true,
        })),
        fleetInfo: {
          vehicleCount: formData.vehicleCount,
          vehicleTypes: ['Truck', 'Trailer'],
          driversCount: formData.driversCount,
          operatingRadius: formData.operatingRadius,
          cargoTypes: ['General Freight'],
          annualMileage: formData.annualMileage,
        },
        currentInsurance: {
          hasExistingCoverage: formData.hasExistingCoverage,
          currentCarrier: formData.currentCarrier || undefined,
          claimsHistory: [],
        },
        requestedCoverage: {
          commercialAuto: {
            liability: formData.autoLiability,
            physicalDamage: true,
            uninsuredMotorist: true,
            medicalPayments: '$5,000',
          },
          generalLiability: {
            perOccurrence: formData.generalLiability,
            aggregate: '$2,000,000',
            products: true,
            professional: false,
          },
        },
        created: new Date(),
        status: 'pending',
      };

      const result =
        await insurancePartnershipService.submitQuoteRequest(quoteRequest);

      setCurrentRequestId(requestId);
      setRequestSubmitted(true);

      // Load quotes after a short delay to simulate processing
      setTimeout(async () => {
        const newQuotes =
          await insurancePartnershipService.getQuotesForRequest(requestId);
        setQuotes(newQuotes);
        setActiveTab('quotes');
      }, 2000);
    } catch (error) {
      console.error('Failed to submit quote request:', error);
      alert('Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderMarketplace = () => (
    <div className='space-y-8'>
      {/* Header */}
      <div className='text-center'>
        <h2 className='mb-4 text-3xl font-bold text-white'>
          Commercial Insurance Marketplace
        </h2>
        <p className='mx-auto max-w-3xl text-lg text-gray-300'>
          Get competitive quotes from top insurance providers. FleetFlow
          partners with licensed carriers to bring you the best commercial
          insurance rates for trucking, logistics, and transportation
          businesses.
        </p>
      </div>

      {/* Partner Showcase */}
      <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {[
          {
            name: 'Covered Embedded',
            logo: '🛡️',
            features: ['White-label', 'SOC 2 Certified', '45+ Carriers'],
          },
          {
            name: 'Coverdash',
            logo: '⚡',
            features: [
              'Single-line NPM',
              'Quick Integration',
              'Real-time Quotes',
            ],
          },
          {
            name: 'Tivly Affiliate',
            logo: '💼',
            features: ['$2.7M+ Paid', 'API Integration', 'High Commissions'],
          },
          {
            name: 'Insurify',
            logo: '🌟',
            features: ['120+ Carriers', 'Technology Focus', 'Best Rates'],
          },
        ].map((partner, index) => (
          <div
            key={index}
            className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'
          >
            <div className='mb-4 text-center text-4xl'>{partner.logo}</div>
            <h3 className='mb-3 text-center text-lg font-semibold text-white'>
              {partner.name}
            </h3>
            <ul className='space-y-2'>
              {partner.features.map((feature, idx) => (
                <li
                  key={idx}
                  className='flex items-center text-sm text-gray-300'
                >
                  <Shield className='mr-2 h-4 w-4 text-green-400' />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Quote Request Form */}
      <div className='rounded-xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm'>
        <h3 className='mb-6 text-2xl font-bold text-white'>
          Request Insurance Quotes
        </h3>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Business Information */}
          <div className='space-y-4'>
            <h4 className='mb-4 text-lg font-semibold text-white'>
              Business Information
            </h4>

            <div>
              <label className='mb-2 block text-gray-300'>
                Business Name *
              </label>
              <input
                type='text'
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                className='w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-gray-400'
                placeholder='Your Company Name'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='mb-2 block text-gray-300'>MC Number</label>
                <input
                  type='text'
                  value={formData.mcNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, mcNumber: e.target.value })
                  }
                  className='w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-gray-400'
                  placeholder='MC-123456'
                />
              </div>
              <div>
                <label className='mb-2 block text-gray-300'>DOT Number</label>
                <input
                  type='text'
                  value={formData.dotNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, dotNumber: e.target.value })
                  }
                  className='w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-gray-400'
                  placeholder='DOT-123456'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='mb-2 block text-gray-300'>
                  Years in Business
                </label>
                <input
                  type='number'
                  value={formData.yearsInBusiness}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      yearsInBusiness: parseInt(e.target.value) || 1,
                    })
                  }
                  className='w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white'
                  min='1'
                />
              </div>
              <div>
                <label className='mb-2 block text-gray-300'>
                  Annual Revenue
                </label>
                <select
                  value={formData.annualRevenue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      annualRevenue: parseInt(e.target.value),
                    })
                  }
                  className='w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white'
                >
                  <option value={250000}>Under $250K</option>
                  <option value={500000}>$250K - $500K</option>
                  <option value={1000000}>$500K - $1M</option>
                  <option value={2000000}>$1M - $2M</option>
                  <option value={5000000}>$2M+</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className='space-y-4'>
            <h4 className='mb-4 text-lg font-semibold text-white'>
              Contact Information
            </h4>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='mb-2 block text-gray-300'>First Name *</label>
                <input
                  type='text'
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className='w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-gray-400'
                  placeholder='John'
                />
              </div>
              <div>
                <label className='mb-2 block text-gray-300'>Last Name *</label>
                <input
                  type='text'
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className='w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-gray-400'
                  placeholder='Smith'
                />
              </div>
            </div>

            <div>
              <label className='mb-2 block text-gray-300'>Email *</label>
              <input
                type='email'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className='w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-gray-400'
                placeholder='john@company.com'
              />
            </div>

            <div>
              <label className='mb-2 block text-gray-300'>Phone *</label>
              <input
                type='tel'
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className='w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-gray-400'
                placeholder='(555) 123-4567'
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='mb-2 block text-gray-300'>
                  Vehicle Count
                </label>
                <input
                  type='number'
                  value={formData.vehicleCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vehicleCount: parseInt(e.target.value) || 1,
                    })
                  }
                  className='w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white'
                  min='1'
                />
              </div>
              <div>
                <label className='mb-2 block text-gray-300'>Driver Count</label>
                <input
                  type='number'
                  value={formData.driversCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      driversCount: parseInt(e.target.value) || 1,
                    })
                  }
                  className='w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white'
                  min='1'
                />
              </div>
            </div>
          </div>
        </div>

        {/* Insurance Types */}
        <div className='mt-6'>
          <h4 className='mb-4 text-lg font-semibold text-white'>
            Coverage Needed
          </h4>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
            {[
              { id: 'commercial_auto', label: 'Commercial Auto', icon: '🚛' },
              {
                id: 'general_liability',
                label: 'General Liability',
                icon: '🛡️',
              },
              { id: 'workers_comp', label: 'Workers Comp', icon: '👥' },
              { id: 'cargo', label: 'Cargo Insurance', icon: '📦' },
              { id: 'garage_liability', label: 'Garage Liability', icon: '🏢' },
              { id: 'cyber_liability', label: 'Cyber Liability', icon: '💻' },
            ].map((type) => (
              <label
                key={type.id}
                className='flex cursor-pointer items-center space-x-3'
              >
                <input
                  type='checkbox'
                  checked={formData.insuranceTypes.includes(type.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        insuranceTypes: [...formData.insuranceTypes, type.id],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        insuranceTypes: formData.insuranceTypes.filter(
                          (t) => t !== type.id
                        ),
                      });
                    }
                  }}
                  className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500'
                />
                <span className='flex items-center text-white'>
                  <span className='mr-2'>{type.icon}</span>
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className='mt-8 text-center'>
          <button
            onClick={handleSubmitQuoteRequest}
            disabled={isSubmitting || requestSubmitted}
            className='rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-lg font-semibold text-white transition-all duration-200 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50'
          >
            {isSubmitting
              ? 'Submitting...'
              : requestSubmitted
                ? 'Request Submitted ✓'
                : 'Get Insurance Quotes'}
          </button>

          {requestSubmitted && (
            <p className='mt-4 text-green-400'>
              Your request has been submitted to our insurance partners. You'll
              receive quotes within 24-48 hours.
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderQuotes = () => (
    <div className='space-y-6'>
      <div className='text-center'>
        <h2 className='mb-4 text-3xl font-bold text-white'>Insurance Quotes</h2>
        <p className='text-gray-300'>
          Compare quotes from our trusted insurance partners
        </p>
      </div>

      {quotes.length === 0 ? (
        <div className='rounded-xl border border-white/20 bg-white/10 p-8 text-center backdrop-blur-sm'>
          <FileText className='mx-auto mb-4 h-16 w-16 text-gray-400' />
          <h3 className='mb-2 text-xl font-semibold text-white'>
            No Quotes Available
          </h3>
          <p className='text-gray-300'>
            Submit a quote request to see available insurance options.
          </p>
        </div>
      ) : (
        <div className='grid gap-6'>
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'
            >
              <div className='mb-4 flex items-start justify-between'>
                <div>
                  <h3 className='text-xl font-bold text-white'>
                    {quote.partnerName}
                  </h3>
                  <p className='text-gray-300'>{quote.coverageType}</p>
                  <p className='text-sm text-gray-400'>
                    Quote #{quote.quoteNumber}
                  </p>
                </div>
                <div className='text-right'>
                  <div className='text-2xl font-bold text-green-400'>
                    {formatCurrency(quote.premium.annual)}/year
                  </div>
                  <div className='text-gray-300'>
                    {formatCurrency(quote.premium.monthly)}/month
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div>
                  <h4 className='mb-2 font-semibold text-white'>
                    Coverage Limits
                  </h4>
                  <ul className='space-y-1'>
                    {Object.entries(quote.coverage.limits).map(
                      ([key, value]) => (
                        <li key={key} className='text-sm text-gray-300'>
                          <span className='font-medium'>{key}:</span> {value}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className='mb-2 font-semibold text-white'>
                    Carrier Information
                  </h4>
                  <p className='text-sm text-gray-300'>
                    <span className='font-medium'>Carrier:</span>{' '}
                    {quote.carrier.name}
                  </p>
                  <p className='text-sm text-gray-300'>
                    <span className='font-medium'>Rating:</span>{' '}
                    {quote.carrier.rating}
                  </p>
                  <p className='text-sm text-gray-300'>
                    <span className='font-medium'>A.M. Best:</span>{' '}
                    {quote.carrier.amBestRating}
                  </p>
                </div>
              </div>

              <div className='mt-4 rounded-lg bg-white/5 p-4'>
                <h4 className='mb-2 font-semibold text-white'>
                  Commission Information
                </h4>
                <div className='grid grid-cols-3 gap-4 text-sm'>
                  <div>
                    <span className='text-gray-300'>Base Commission:</span>
                    <div className='font-semibold text-green-400'>
                      {formatCurrency(quote.commissionInfo.baseCommission)}
                    </div>
                  </div>
                  <div>
                    <span className='text-gray-300'>Renewal Commission:</span>
                    <div className='font-semibold text-green-400'>
                      {formatCurrency(quote.commissionInfo.renewalCommission)}
                      /year
                    </div>
                  </div>
                  <div>
                    <span className='text-gray-300'>Est. Annual Value:</span>
                    <div className='font-semibold text-green-400'>
                      {formatCurrency(
                        quote.commissionInfo.estimatedAnnualValue
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-4 flex items-center justify-between'>
                <div className='flex items-center space-x-4 text-sm text-gray-300'>
                  <span>
                    Valid until:{' '}
                    {new Date(quote.validUntil).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>Policy Term: {quote.terms.policyTerm}</span>
                </div>
                <div className='flex space-x-3'>
                  <button className='rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700'>
                    <Phone className='mr-2 inline h-4 w-4' />
                    Call Agent
                  </button>
                  <button className='rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700'>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className='space-y-6'>
      <div className='text-center'>
        <h2 className='mb-4 text-3xl font-bold text-white'>
          Partnership Analytics
        </h2>
        <p className='text-gray-300'>
          Track your insurance partnership revenue and performance
        </p>
      </div>

      {analytics && (
        <>
          {/* Key Metrics */}
          <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
            <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-300'>Total Revenue</p>
                  <p className='text-2xl font-bold text-green-400'>
                    {formatCurrency(analytics.totalRevenue)}
                  </p>
                </div>
                <DollarSign className='h-8 w-8 text-green-400' />
              </div>
            </div>

            <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-300'>Active Policies</p>
                  <p className='text-2xl font-bold text-blue-400'>
                    {analytics.totalPolicies}
                  </p>
                </div>
                <Shield className='h-8 w-8 text-blue-400' />
              </div>
            </div>

            <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-300'>Avg Commission</p>
                  <p className='text-2xl font-bold text-purple-400'>
                    {formatCurrency(analytics.averageCommission)}
                  </p>
                </div>
                <TrendingUp className='h-8 w-8 text-purple-400' />
              </div>
            </div>

            <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-300'>Monthly Recurring</p>
                  <p className='text-2xl font-bold text-orange-400'>
                    {formatCurrency(analytics.monthlyRecurring)}
                  </p>
                </div>
                <Building2 className='h-8 w-8 text-orange-400' />
              </div>
            </div>
          </div>

          {/* Partner Performance */}
          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
            <h3 className='mb-6 text-xl font-bold text-white'>
              Partner Performance
            </h3>
            <div className='overflow-x-auto'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-white/20'>
                    <th className='py-3 text-left text-gray-300'>Partner</th>
                    <th className='py-3 text-left text-gray-300'>
                      Total Revenue
                    </th>
                    <th className='py-3 text-left text-gray-300'>
                      Active Policies
                    </th>
                    <th className='py-3 text-left text-gray-300'>
                      Conversion Rate
                    </th>
                    <th className='py-3 text-left text-gray-300'>
                      Avg Commission
                    </th>
                    <th className='py-3 text-left text-gray-300'>
                      Monthly Recurring
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.partnerships.map(
                    (partnership: PartnershipRevenue) => (
                      <tr
                        key={partnership.partnerId}
                        className='border-b border-white/10'
                      >
                        <td className='py-4'>
                          <div className='font-semibold text-white'>
                            {partnership.partnerName}
                          </div>
                        </td>
                        <td className='py-4 font-semibold text-green-400'>
                          {formatCurrency(partnership.totalCommissions)}
                        </td>
                        <td className='py-4 text-white'>
                          {partnership.activePolices}
                        </td>
                        <td className='py-4 text-white'>
                          {(partnership.conversionRate * 100).toFixed(1)}%
                        </td>
                        <td className='py-4 text-white'>
                          {formatCurrency(partnership.averageCommission)}
                        </td>
                        <td className='py-4 text-white'>
                          {formatCurrency(partnership.monthlyRevenue)}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Projected Revenue */}
          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm'>
            <h3 className='mb-4 text-xl font-bold text-white'>
              Revenue Projection
            </h3>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div>
                <p className='mb-2 text-gray-300'>Projected Annual Revenue</p>
                <p className='text-3xl font-bold text-green-400'>
                  {formatCurrency(analytics.projectedAnnual)}
                </p>
                <p className='mt-1 text-sm text-gray-400'>
                  Based on current monthly recurring revenue
                </p>
              </div>
              <div>
                <p className='mb-2 text-gray-300'>
                  Upcoming Renewals (30 days)
                </p>
                <p className='text-3xl font-bold text-blue-400'>
                  {analytics.partnerships.reduce(
                    (sum: number, p: PartnershipRevenue) =>
                      sum + p.upcomingRenewals,
                    0
                  )}
                </p>
                <p className='mt-1 text-sm text-gray-400'>
                  Policies eligible for renewal commission
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div
      className='min-h-screen'
      style={{
        background: `
        linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.12) 25%, rgba(79, 70, 229, 0.10) 50%, rgba(99, 102, 241, 0.08) 100%),
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%),
        radial-gradient(circle at 20% 20%, rgba(30, 41, 59, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(51, 65, 85, 0.06) 0%, transparent 50%)
      `,
        backgroundSize: '100% 100%, 100% 100%, 800px 800px, 600px 600px',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className='mx-auto max-w-7xl px-6 py-8'>
        {/* Navigation Tabs */}
        <div className='mb-8 flex justify-center'>
          <div className='rounded-xl border border-white/20 bg-white/10 p-2 backdrop-blur-sm'>
            {[
              {
                id: 'marketplace',
                label: 'Insurance Marketplace',
                icon: Shield,
              },
              { id: 'quotes', label: 'My Quotes', icon: FileText },
              {
                id: 'analytics',
                label: 'Partnership Analytics',
                icon: TrendingUp,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 rounded-lg px-6 py-3 font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <tab.icon className='h-5 w-5' />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'marketplace' && renderMarketplace()}
        {activeTab === 'quotes' && renderQuotes()}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
}
