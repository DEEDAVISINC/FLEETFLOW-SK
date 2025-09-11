import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import Breadcrumb from '../../components/Breadcrumb';
import { generateBreadcrumbStructuredData } from '../../lib/seo';

export const metadata: Metadata = {
  title: 'Fair Freight Rates - Transparent Pricing for Shippers',
  description:
    'Get fair freight rates with transparent pricing and no hidden fees. Compare carrier rates, negotiate better pricing, and optimize your shipping costs with real-time freight market data.',
  keywords: [
    'fair freight rates',
    'transparent freight pricing',
    'freight rate comparison',
    'shipping cost optimization',
    'carrier rate negotiation',
    'freight pricing transparency',
    'shipping rate calculator',
    'freight cost analysis',
    'competitive freight rates',
    'shipping price comparison',
    'freight rate negotiation',
    'transparent shipping costs',
  ],
  openGraph: {
    title: 'Fair Freight Rates - Transparent Pricing for Shippers',
    description:
      'Get fair freight rates with transparent pricing and no hidden fees. Compare carrier rates and optimize shipping costs.',
    url: 'https://fleetflowapp.com/shippers/fair-rates',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-fair-rates.jpg',
        width: 1200,
        height: 630,
        alt: 'Fair Freight Rates - Transparent Pricing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fair Freight Rates - Transparent Pricing for Shippers',
    description:
      'Get fair freight rates with transparent pricing and no hidden fees.',
    images: ['/og-fair-rates.jpg'],
  },
  alternates: {
    canonical: '/shippers/fair-rates',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const pricingFactors = [
  {
    factor: 'Distance & Route',
    description: 'Longer distances and complex routes increase costs',
    impact: 'High',
    examples: [
      'Cross-country vs local',
      'Urban vs rural delivery',
      'Peak vs off-peak seasons',
    ],
  },
  {
    factor: 'Cargo Type & Weight',
    description: 'Heavy, hazardous, or specialized cargo costs more',
    impact: 'High',
    examples: [
      'Standard freight vs hazmat',
      'Light vs heavy loads',
      'Temperature-controlled',
    ],
  },
  {
    factor: 'Equipment Requirements',
    description: 'Specialized equipment adds to transportation costs',
    impact: 'Medium',
    examples: [
      'Flatbed vs dry van',
      'Refrigerated trailers',
      'Oversized loads',
    ],
  },
  {
    factor: 'Fuel Surcharges',
    description: 'Fuel price fluctuations affect shipping rates',
    impact: 'Variable',
    examples: [
      'Diesel price changes',
      'Regional fuel costs',
      'Fuel efficiency factors',
    ],
  },
];

const rateComparison = [
  {
    service: 'Traditional Broker',
    rate: '$2.85/mile',
    fees: '$150-300/load',
    transparency: 'Low',
  },
  {
    service: 'Direct Carrier',
    rate: '$2.65/mile',
    fees: '$50-100/load',
    transparency: 'Medium',
  },
  {
    service: 'FleetFlow Platform',
    rate: '$2.45/mile',
    fees: '$25/load',
    transparency: 'High',
  },
];

const costSavings = [
  {
    category: 'Rate Negotiation',
    potential: '15-25%',
    description: 'Better carrier rates through competition',
  },
  {
    category: 'Route Optimization',
    potential: '10-20%',
    description: 'More efficient shipping routes',
  },
  {
    category: 'Load Consolidation',
    potential: '5-15%',
    description: 'Combining shipments for better rates',
  },
  {
    category: 'Fuel Optimization',
    potential: '5-10%',
    description: 'Reduced fuel costs through planning',
  },
];

export default function FairRatesPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Shippers', href: '/shippers' },
    { label: 'Fair Rates', current: true },
  ];

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Shippers', url: '/shippers' },
    { name: 'Fair Rates', url: '/shippers/fair-rates' },
  ]);

  return (
    <>
      <Script
        id='breadcrumb-structured-data'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
        {/* Breadcrumb Navigation */}
        <div className='container mx-auto px-4 py-4'>
          <Breadcrumb items={breadcrumbs} />
        </div>

        {/* Hero Section */}
        <section className='container mx-auto px-4 py-16'>
          <div className='mb-16 text-center'>
            <h1 className='mb-6 text-4xl font-bold text-white md:text-6xl'>
              Fair Freight
              <span className='block bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent'>
                Rates & Pricing
              </span>
            </h1>
            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-300'>
              Transparent pricing with no hidden fees. Compare rates, negotiate
              better pricing, and optimize your shipping costs with real-time
              freight market data.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/auth/signup'
                className='rounded-lg bg-gradient-to-r from-lime-600 to-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-lime-700 hover:to-green-700 hover:shadow-xl'
              >
                Get Rate Quote
              </Link>
              <Link
                href='#calculator'
                className='rounded-lg border-2 border-lime-400 bg-transparent px-8 py-4 text-lg font-semibold text-lime-400 transition-all duration-300 hover:bg-lime-400 hover:text-black'
              >
                Rate Calculator
              </Link>
            </div>
          </div>

          {/* Key Benefits */}
          <div className='mb-16 grid grid-cols-2 gap-8 md:grid-cols-4'>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-lime-400'>25%</div>
              <div className='text-gray-400'>Average Savings</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-green-400'>100%</div>
              <div className='text-gray-400'>Price Transparency</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-emerald-400'>
                24/7
              </div>
              <div className='text-gray-400'>Rate Monitoring</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-teal-400'>
                Instant
              </div>
              <div className='text-gray-400'>Quote Generation</div>
            </div>
          </div>
        </section>

        {/* Pricing Factors */}
        <section className='container mx-auto px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              What Affects Freight Rates?
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Understanding the factors that influence shipping costs
            </p>
          </div>

          <div className='mb-16 grid grid-cols-1 gap-8 md:grid-cols-2'>
            {pricingFactors.map((factor, index) => (
              <div
                key={index}
                className='rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/70'
              >
                <h3 className='mb-3 text-xl font-bold text-white'>
                  {factor.factor}
                </h3>
                <p className='mb-4 text-gray-300'>{factor.description}</p>
                <div className='mb-4'>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      factor.impact === 'High'
                        ? 'bg-red-600/20 text-red-400'
                        : factor.impact === 'Medium'
                          ? 'bg-yellow-600/20 text-yellow-400'
                          : 'bg-blue-600/20 text-blue-400'
                    }`}
                  >
                    {factor.impact} Impact
                  </span>
                </div>
                <ul className='space-y-2'>
                  {factor.examples.map((example, exampleIndex) => (
                    <li
                      key={exampleIndex}
                      className='flex items-center text-sm text-gray-400'
                    >
                      <span className='mr-2 text-lime-400'>•</span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Rate Comparison */}
          <div className='mb-16 rounded-2xl border border-slate-700 bg-slate-800/30 p-8 backdrop-blur-sm'>
            <h3 className='mb-6 text-center text-2xl font-bold text-white'>
              Rate Comparison: Traditional vs FleetFlow
            </h3>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-slate-600'>
                    <th className='px-4 py-3 text-left text-white'>
                      Service Type
                    </th>
                    <th className='px-4 py-3 text-center text-white'>
                      Base Rate
                    </th>
                    <th className='px-4 py-3 text-center text-white'>
                      Additional Fees
                    </th>
                    <th className='px-4 py-3 text-center text-white'>
                      Transparency
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rateComparison.map((service, index) => (
                    <tr key={index} className='border-b border-slate-700'>
                      <td className='px-4 py-3 text-gray-300'>
                        {service.service}
                      </td>
                      <td className='px-4 py-3 text-center font-semibold text-lime-400'>
                        {service.rate}
                      </td>
                      <td className='px-4 py-3 text-center text-gray-400'>
                        {service.fees}
                      </td>
                      <td className='px-4 py-3 text-center'>
                        <span
                          className={`rounded px-2 py-1 text-xs font-medium ${
                            service.transparency === 'High'
                              ? 'bg-green-600/20 text-green-400'
                              : service.transparency === 'Medium'
                                ? 'bg-yellow-600/20 text-yellow-400'
                                : 'bg-red-600/20 text-red-400'
                          }`}
                        >
                          {service.transparency}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cost Savings */}
          <div className='mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2'>
            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-6'>
              <h3 className='mb-4 text-xl font-bold text-white'>
                Potential Cost Savings
              </h3>
              <div className='space-y-4'>
                {costSavings.map((saving, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between'
                  >
                    <div>
                      <div className='font-medium text-white'>
                        {saving.category}
                      </div>
                      <div className='text-sm text-gray-400'>
                        {saving.description}
                      </div>
                    </div>
                    <div className='text-lg font-bold text-lime-400'>
                      {saving.potential}
                    </div>
                  </div>
                ))}
              </div>
              <div className='mt-6 rounded-lg border border-lime-600/30 bg-lime-600/20 p-4'>
                <div className='text-lg font-bold text-lime-400'>
                  Total Potential Savings: 35-70%
                </div>
                <div className='text-sm text-lime-300'>
                  Compared to traditional shipping methods
                </div>
              </div>
            </div>

            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-6'>
              <h3 className='mb-4 text-xl font-bold text-white'>
                Rate Calculator
              </h3>
              <p className='mb-4 text-gray-300'>
                Get an instant estimate for your shipping needs
              </p>
              <div className='space-y-4'>
                <div>
                  <label className='mb-1 block text-sm text-gray-400'>
                    Distance (miles)
                  </label>
                  <input
                    type='number'
                    placeholder='500'
                    className='w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white'
                  />
                </div>
                <div>
                  <label className='mb-1 block text-sm text-gray-400'>
                    Weight (lbs)
                  </label>
                  <input
                    type='number'
                    placeholder='2500'
                    className='w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white'
                  />
                </div>
                <div>
                  <label className='mb-1 block text-sm text-gray-400'>
                    Equipment Type
                  </label>
                  <select className='w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white'>
                    <option>Dry Van</option>
                    <option>Reefer</option>
                    <option>Flatbed</option>
                    <option>Specialized</option>
                  </select>
                </div>
                <button className='w-full rounded-lg bg-lime-600 px-4 py-2 font-medium text-white transition-colors hover:bg-lime-700'>
                  Calculate Rate
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Market Intelligence */}
        <section className='container mx-auto bg-slate-900/50 px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Real-Time Market Intelligence
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Stay informed with live freight market data and pricing trends
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {[
              {
                title: 'Live Rate Monitoring',
                description:
                  'Track rate fluctuations across all lanes in real-time',
                icon: '📊',
              },
              {
                title: 'Market Trend Analysis',
                description:
                  'Understand seasonal and regional pricing patterns',
                icon: '📈',
              },
              {
                title: 'Competitive Intelligence',
                description: 'Compare your rates against market averages',
                icon: '🎯',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className='rounded-lg border border-slate-700 bg-slate-800/50 p-6 text-center'
              >
                <div className='mb-3 text-4xl'>{feature.icon}</div>
                <h3 className='mb-2 text-lg font-semibold text-white'>
                  {feature.title}
                </h3>
                <p className='text-sm text-gray-400'>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Negotiation Tools */}
        <section className='container mx-auto px-4 py-16'>
          <div className='rounded-2xl border border-slate-700 bg-slate-800/30 p-8 backdrop-blur-sm'>
            <div className='mb-8 text-center'>
              <h2 className='mb-4 text-2xl font-bold text-white'>
                Advanced Negotiation Tools
              </h2>
              <p className='text-gray-300'>
                Get better rates through data-driven negotiations
              </p>
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
              {[
                {
                  title: 'Rate History',
                  desc: 'Historical pricing data',
                  icon: '📚',
                },
                {
                  title: 'Market Benchmarks',
                  desc: 'Industry standard rates',
                  icon: '📏',
                },
                {
                  title: 'Carrier Performance',
                  desc: 'Rating and reliability data',
                  icon: '⭐',
                },
                {
                  title: 'Negotiation Scripts',
                  desc: 'Proven negotiation tactics',
                  icon: '💬',
                },
              ].map((tool, index) => (
                <div key={index} className='text-center'>
                  <div className='mb-2 text-3xl'>{tool.icon}</div>
                  <h3 className='mb-1 font-semibold text-white'>
                    {tool.title}
                  </h3>
                  <p className='text-sm text-gray-400'>{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='container mx-auto px-4 py-16'>
          <div className='rounded-2xl bg-gradient-to-r from-lime-600 to-green-600 p-8 text-center md:p-12'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Get Fair Rates on Every Shipment
            </h2>
            <p className='mx-auto mb-8 max-w-2xl text-lg text-lime-100'>
              Stop overpaying for freight. Access transparent pricing, negotiate
              better rates, and optimize your shipping costs with our
              comprehensive rate management platform.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/auth/signup'
                className='rounded-lg bg-white px-8 py-4 text-lg font-semibold text-lime-600 shadow-lg transition-all duration-300 hover:bg-gray-100'
              >
                Start Saving Today
              </Link>
              <Link
                href='/contact'
                className='rounded-lg border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-lime-600'
              >
                Get Rate Analysis
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
