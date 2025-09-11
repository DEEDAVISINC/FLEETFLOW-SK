import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import Breadcrumb from '../../components/Breadcrumb';
import { generateBreadcrumbStructuredData } from '../../lib/seo';

export const metadata: Metadata = {
  title: 'Load Optimization Software - Maximize Truck Capacity and Efficiency',
  description:
    'Advanced load optimization software that maximizes truck capacity, reduces empty miles, and improves fleet utilization. AI-powered load matching and capacity planning for maximum efficiency.',
  keywords: [
    'load optimization software',
    'maximize truck capacity',
    'load optimization',
    'truck capacity optimization',
    'load matching software',
    'fleet utilization optimization',
    'truck load optimization',
    'capacity planning software',
    'load optimization tool',
    'truck efficiency software',
    'load planning optimization',
    'capacity optimization',
    'truck utilization software',
  ],
  openGraph: {
    title:
      'Load Optimization Software - Maximize Truck Capacity and Efficiency',
    description:
      'Advanced load optimization software that maximizes truck capacity, reduces empty miles, and improves fleet utilization with AI-powered load matching.',
    url: 'https://fleetflowapp.com/services/load-optimization',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-load-optimization.jpg',
        width: 1200,
        height: 630,
        alt: 'Load Optimization Software - Maximize Truck Capacity',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Load Optimization Software - Maximize Truck Capacity',
    description:
      'Advanced load optimization software that maximizes truck capacity and efficiency.',
    images: ['/og-load-optimization.jpg'],
  },
  alternates: {
    canonical: '/services/load-optimization',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const optimizationStrategies = [
  {
    title: 'Multi-Stop Load Consolidation',
    description: 'Combine multiple smaller shipments into efficient routes',
    benefits: [
      'Reduced empty miles',
      'Higher revenue per trip',
      'Lower fuel costs',
      'Better capacity utilization',
    ],
    icon: '📦',
  },
  {
    title: 'Backhaul Optimization',
    description: 'Find return loads to eliminate deadhead miles',
    benefits: [
      'Zero empty return trips',
      'Additional revenue streams',
      'Improved fleet efficiency',
      'Better profitability',
    ],
    icon: '🔄',
  },
  {
    title: 'Capacity Matching',
    description: 'Match load requirements with available truck capacity',
    benefits: [
      'Perfect load-truck fit',
      'Reduced damage risk',
      'Optimal weight distribution',
      'Maximum cargo safety',
    ],
    icon: '⚖️',
  },
  {
    title: 'Route Density Analysis',
    description: 'Analyze high-density shipping corridors for optimal routing',
    benefits: [
      'High-volume corridors',
      'Predictable demand',
      'Competitive pricing',
      'Consistent business',
    ],
    icon: '📊',
  },
];

const efficiencyMetrics = [
  {
    metric: 'Capacity Utilization',
    before: '65%',
    after: '95%',
    improvement: '+46%',
  },
  { metric: 'Empty Miles', before: '25%', after: '8%', improvement: '-68%' },
  {
    metric: 'Revenue per Mile',
    before: '$2.50',
    after: '$3.75',
    improvement: '+50%',
  },
  {
    metric: 'Fuel Efficiency',
    before: '6.2 MPG',
    after: '7.8 MPG',
    improvement: '+26%',
  },
];

export default function LoadOptimizationPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Load Optimization', current: true },
  ];

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Load Optimization', url: '/services/load-optimization' },
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
              Load
              <span className='block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent'>
                Optimization Software
              </span>
            </h1>
            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-300'>
              Maximize truck capacity and fleet utilization with AI-powered load
              optimization. Reduce empty miles, increase revenue, and optimize
              every aspect of your load planning.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/auth/signup'
                className='rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl'
              >
                Optimize Your Loads
              </Link>
              <Link
                href='#strategies'
                className='rounded-lg border-2 border-green-400 bg-transparent px-8 py-4 text-lg font-semibold text-green-400 transition-all duration-300 hover:bg-green-400 hover:text-white'
              >
                View Strategies
              </Link>
            </div>
          </div>

          {/* Efficiency Metrics */}
          <div className='mb-16 grid grid-cols-2 gap-8 md:grid-cols-4'>
            {efficiencyMetrics.map((metric, index) => (
              <div key={index} className='text-center'>
                <div className='mb-1 text-2xl font-bold text-emerald-400'>
                  {metric.improvement}
                </div>
                <div className='mb-1 font-semibold text-white'>
                  {metric.metric}
                </div>
                <div className='text-sm text-gray-400'>
                  {metric.before} → {metric.after}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Optimization Strategies */}
        <section id='strategies' className='container mx-auto px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Load Optimization Strategies
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Advanced techniques to maximize truck capacity and minimize empty
              miles
            </p>
          </div>

          <div className='mb-16 grid grid-cols-1 gap-8 md:grid-cols-2'>
            {optimizationStrategies.map((strategy, index) => (
              <div
                key={index}
                className='rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/70'
              >
                <div className='mb-4 text-4xl'>{strategy.icon}</div>
                <h3 className='mb-3 text-xl font-bold text-white'>
                  {strategy.title}
                </h3>
                <p className='mb-4 text-gray-300'>{strategy.description}</p>
                <ul className='space-y-2'>
                  {strategy.benefits.map((benefit, benefitIndex) => (
                    <li
                      key={benefitIndex}
                      className='flex items-center text-sm text-gray-400'
                    >
                      <span className='mr-2 text-emerald-400'>✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Load Matching Demo */}
          <div className='mb-16 rounded-2xl border border-slate-700 bg-slate-800/30 p-8 backdrop-blur-sm'>
            <div className='mb-8 text-center'>
              <h3 className='mb-4 text-2xl font-bold text-white'>
                AI Load Matching Engine
              </h3>
              <p className='text-gray-300'>
                See how our AI matches loads with available capacity
              </p>
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <div className='rounded-lg bg-slate-900/50 p-6 text-center'>
                <div className='mb-3 text-3xl'>📦</div>
                <h4 className='mb-2 font-semibold text-white'>
                  Available Load
                </h4>
                <p className='text-sm text-gray-400'>
                  2,500 lbs • Los Angeles to Dallas
                </p>
              </div>
              <div className='rounded-lg border-2 border-emerald-600 bg-emerald-600/20 p-6 text-center'>
                <div className='mb-3 text-3xl'>🤖</div>
                <h4 className='mb-2 font-semibold text-white'>AI Matching</h4>
                <p className='text-sm text-emerald-400'>
                  Perfect capacity match found
                </p>
              </div>
              <div className='rounded-lg bg-slate-900/50 p-6 text-center'>
                <div className='mb-3 text-3xl'>🚛</div>
                <h4 className='mb-2 font-semibold text-white'>
                  Available Truck
                </h4>
                <p className='text-sm text-gray-400'>
                  3,000 lbs capacity • Same route
                </p>
              </div>
            </div>
          </div>

          {/* Capacity Analysis Tools */}
          <div className='mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2'>
            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-6'>
              <h3 className='mb-4 text-xl font-bold text-white'>
                Capacity Analysis Dashboard
              </h3>
              <p className='mb-4 text-gray-300'>
                Real-time visibility into fleet capacity utilization and
                optimization opportunities
              </p>
              <ul className='space-y-2'>
                <li className='flex items-center text-sm text-gray-400'>
                  <span className='mr-2 text-green-400'>📊</span>
                  Utilization metrics
                </li>
                <li className='flex items-center text-sm text-gray-400'>
                  <span className='mr-2 text-green-400'>🎯</span>
                  Optimization recommendations
                </li>
                <li className='flex items-center text-sm text-gray-400'>
                  <span className='mr-2 text-green-400'>📈</span>
                  Performance trends
                </li>
              </ul>
            </div>

            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-6'>
              <h3 className='mb-4 text-xl font-bold text-white'>
                Predictive Load Planning
              </h3>
              <p className='mb-4 text-gray-300'>
                AI-powered forecasting for optimal load planning and capacity
                allocation
              </p>
              <ul className='space-y-2'>
                <li className='flex items-center text-sm text-gray-400'>
                  <span className='mr-2 text-green-400'>🔮</span>
                  Demand forecasting
                </li>
                <li className='flex items-center text-sm text-gray-400'>
                  <span className='mr-2 text-green-400'>📅</span>
                  Capacity planning
                </li>
                <li className='flex items-center text-sm text-gray-400'>
                  <span className='mr-2 text-green-400'>💡</span>
                  Smart recommendations
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Industry Applications */}
        <section className='container mx-auto bg-slate-900/50 px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Load Optimization by Industry
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Specialized load optimization strategies for different cargo types
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {[
              {
                industry: 'LTL Shipping',
                optimization: 'Consolidate less-than-truckload shipments',
                benefits: [
                  'Higher utilization',
                  'Reduced costs',
                  'Better margins',
                ],
                icon: '📦',
              },
              {
                industry: 'Refrigerated Goods',
                optimization: 'Temperature-controlled load matching',
                benefits: [
                  'Chain compliance',
                  'Reduced spoilage',
                  'Premium pricing',
                ],
                icon: '❄️',
              },
              {
                industry: 'Heavy Equipment',
                optimization: 'Specialized equipment routing',
                benefits: [
                  'Proper equipment match',
                  'Safety compliance',
                  'Equipment protection',
                ],
                icon: '🏗️',
              },
            ].map((item, index) => (
              <div
                key={index}
                className='rounded-lg border border-slate-700 bg-slate-800/50 p-6'
              >
                <div className='mb-3 text-3xl'>{item.icon}</div>
                <h3 className='mb-2 text-lg font-semibold text-white'>
                  {item.industry}
                </h3>
                <p className='mb-3 text-sm font-medium text-emerald-400'>
                  {item.optimization}
                </p>
                <ul className='space-y-1'>
                  {item.benefits.map((benefit, benefitIndex) => (
                    <li
                      key={benefitIndex}
                      className='flex items-center text-sm text-gray-400'
                    >
                      <span className='mr-2 text-emerald-400'>•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className='container mx-auto px-4 py-16'>
          <div className='rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-center md:p-12'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Maximize Your Fleet Efficiency
            </h2>
            <p className='mx-auto mb-8 max-w-2xl text-lg text-green-100'>
              Stop wasting capacity and start optimizing every load. Join the
              thousands of carriers already maximizing their revenue with our
              load optimization software.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/auth/signup'
                className='rounded-lg bg-white px-8 py-4 text-lg font-semibold text-green-600 shadow-lg transition-all duration-300 hover:bg-gray-100'
              >
                Start Load Optimization
              </Link>
              <Link
                href='/contact'
                className='rounded-lg border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-green-600'
              >
                Get Optimization Analysis
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
