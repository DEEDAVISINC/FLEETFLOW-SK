import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import Breadcrumb from '../../components/Breadcrumb';
import { generateBreadcrumbStructuredData } from '../../lib/seo';

export const metadata: Metadata = {
  title: 'High Paying Loads - Premium Freight Opportunities for Carriers',
  description:
    'Find high paying freight loads with premium rates and excellent profit margins. Access exclusive high-value loads, OTR opportunities, and maximum earning potential through FleetFlow.',
  keywords: [
    'high paying loads',
    'premium freight loads',
    'high value loads',
    'OTR good pay',
    'high paying freight',
    'premium loads',
    'lucrative loads',
    'high profit loads',
    'best paying loads',
    'high rate loads',
    'premium freight',
    'high paying OTR',
    'lucrative trucking loads',
  ],
  openGraph: {
    title: 'High Paying Loads - Premium Freight Opportunities for Carriers',
    description:
      'Find high paying freight loads with premium rates and excellent profit margins. Access exclusive high-value loads and OTR opportunities.',
    url: 'https://fleetflowapp.com/carriers/high-paying-loads',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-high-paying-loads.jpg',
        width: 1200,
        height: 630,
        alt: 'High Paying Freight Loads - Premium Opportunities',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'High Paying Loads - Premium Freight Opportunities',
    description:
      'Find high paying freight loads with premium rates and excellent profit margins.',
    images: ['/og-high-paying-loads.jpg'],
  },
  alternates: {
    canonical: '/carriers/high-paying-loads',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const loadCategories = [
  {
    title: 'Expedited & Rush Loads',
    description: 'Time-critical shipments with premium pricing',
    avgRate: '$4.50 - $7.50/mile',
    features: [
      'Guaranteed delivery times',
      'Premium rates',
      'Priority dispatch',
      'Bonus incentives',
    ],
    icon: '⚡',
  },
  {
    title: 'Specialized Equipment',
    description: 'Unique equipment requirements with specialized pricing',
    avgRate: '$4.00 - $6.50/mile',
    features: [
      'Equipment specialization',
      'Expert handling',
      'Premium cargo',
      'Technical expertise',
    ],
    icon: '🚛',
  },
  {
    title: 'High-Value Cargo',
    description: 'Valuable shipments requiring secure transport',
    avgRate: '$3.80 - $6.00/mile',
    features: [
      'Security requirements',
      'Insurance coverage',
      'GPS tracking',
      'Secure handling',
    ],
    icon: '💎',
  },
  {
    title: 'Long-Haul Premium',
    description: 'Extended routes with excellent compensation',
    avgRate: '$3.50 - $5.50/mile',
    features: [
      'Extended routes',
      'Fuel surcharges',
      'Performance bonuses',
      'Consistent income',
    ],
    icon: '🗺️',
  },
];

const successFactors = [
  'Carrier rating above 4.8 stars',
  'Clean safety record (CSA score <1.0)',
  'Equipment availability and maintenance',
  'Reliable communication and updates',
  'On-time delivery history',
  'Professional presentation',
  'GPS tracking compliance',
  'Insurance coverage verification',
];

export default function HighPayingLoadsPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Carriers', href: '/carriers' },
    { label: 'High Paying Loads', current: true },
  ];

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Carriers', url: '/carriers' },
    { name: 'High Paying Loads', url: '/carriers/high-paying-loads' },
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
              High Paying
              <span className='block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent'>
                Freight Loads
              </span>
            </h1>
            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-300'>
              Access premium freight opportunities with exceptional rates and
              maximum profit potential. Find the highest paying loads in the
              industry with guaranteed income.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/carriers'
                className='rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-yellow-700 hover:to-orange-700 hover:shadow-xl'
              >
                Find High Paying Loads
              </Link>
              <Link
                href='/auth/signup'
                className='rounded-lg border-2 border-yellow-400 bg-transparent px-8 py-4 text-lg font-semibold text-yellow-400 transition-all duration-300 hover:bg-yellow-400 hover:text-black'
              >
                Join Premium Network
              </Link>
            </div>
          </div>

          {/* Key Stats */}
          <div className='mb-16 grid grid-cols-2 gap-8 md:grid-cols-4'>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-yellow-400'>
                $5.20
              </div>
              <div className='text-gray-400'>Average Premium Rate</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-green-400'>
                $8,400
              </div>
              <div className='text-gray-400'>Avg Weekly Revenue</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-purple-400'>
                TOP 5%
              </div>
              <div className='text-gray-400'>Carrier Performance</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-blue-400'>24/7</div>
              <div className='text-gray-400'>Load Availability</div>
            </div>
          </div>
        </section>

        {/* Load Categories */}
        <section className='container mx-auto px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Premium Load Categories
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Access exclusive high-paying load opportunities across multiple
              categories
            </p>
          </div>

          <div className='mb-16 grid grid-cols-1 gap-8 md:grid-cols-2'>
            {loadCategories.map((category, index) => (
              <div
                key={index}
                className='rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/70'
              >
                <div className='mb-4 flex items-center justify-between'>
                  <div className='text-3xl'>{category.icon}</div>
                  <div className='text-right'>
                    <div className='text-lg font-bold text-yellow-400'>
                      {category.avgRate}
                    </div>
                    <div className='text-sm text-gray-400'>per mile</div>
                  </div>
                </div>
                <h3 className='mb-3 text-xl font-bold text-white'>
                  {category.title}
                </h3>
                <p className='mb-4 text-gray-300'>{category.description}</p>
                <ul className='space-y-2'>
                  {category.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className='flex items-center text-sm text-gray-400'
                    >
                      <span className='mr-2 text-green-400'>💰</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Success Factors */}
          <div className='rounded-2xl border border-slate-700 bg-slate-800/30 p-8 backdrop-blur-sm'>
            <h3 className='mb-6 text-center text-2xl font-bold text-white'>
              What Gets You High Paying Loads?
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {successFactors.map((factor, index) => (
                <div
                  key={index}
                  className='flex items-center space-x-3 rounded-lg border border-yellow-600/20 bg-yellow-600/10 p-4'
                >
                  <span className='text-xl text-yellow-400'>⭐</span>
                  <span className='font-medium text-yellow-400'>{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Real Examples */}
        <section className='container mx-auto bg-slate-900/50 px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Real High Paying Load Examples
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Actual premium loads currently available in our network
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {[
              {
                origin: 'Los Angeles, CA',
                destination: 'New York, NY',
                distance: '2,790 miles',
                rate: '$4.85/mile',
                total: '$13,520',
                equipment: 'Dry Van',
                urgency: 'Rush - 3 days',
              },
              {
                origin: 'Dallas, TX',
                destination: 'Chicago, IL',
                distance: '950 miles',
                rate: '$4.20/mile',
                total: '$3,990',
                equipment: 'Reefer',
                urgency: 'Priority',
              },
              {
                origin: 'Seattle, WA',
                destination: 'Atlanta, GA',
                distance: '2,735 miles',
                rate: '$4.65/mile',
                total: '$12,720',
                equipment: 'Flatbed',
                urgency: 'Expedited',
              },
            ].map((load, index) => (
              <div
                key={index}
                className='rounded-lg border border-slate-700 bg-slate-800/50 p-6'
              >
                <div className='mb-3 flex items-start justify-between'>
                  <div>
                    <h3 className='mb-1 text-lg font-semibold text-white'>
                      {load.origin} → {load.destination}
                    </h3>
                    <span className='rounded bg-yellow-600/20 px-2 py-1 text-sm font-medium text-yellow-400'>
                      {load.urgency}
                    </span>
                  </div>
                  <span className='text-sm font-medium text-blue-400'>
                    {load.equipment}
                  </span>
                </div>
                <div className='mb-4 space-y-2 text-sm text-gray-400'>
                  <p>Distance: {load.distance}</p>
                  <p>Rate: {load.rate}</p>
                  <p className='font-semibold text-green-400'>
                    Total: {load.total}
                  </p>
                </div>
                <button className='w-full rounded-lg bg-yellow-600 px-4 py-2 font-medium text-white transition-colors hover:bg-yellow-700'>
                  Claim This Load
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className='container mx-auto px-4 py-16'>
          <div className='rounded-2xl bg-gradient-to-r from-yellow-600 to-orange-600 p-8 text-center md:p-12'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Maximize Your Earnings Today
            </h2>
            <p className='mx-auto mb-8 max-w-2xl text-lg text-yellow-100'>
              Join elite carriers earning premium rates on high-value loads.
              Access exclusive opportunities that other carriers never see.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/auth/signup'
                className='rounded-lg bg-white px-8 py-4 text-lg font-semibold text-yellow-600 shadow-lg transition-all duration-300 hover:bg-gray-100'
              >
                Access Premium Loads
              </Link>
              <Link
                href='/carriers'
                className='rounded-lg border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-yellow-600'
              >
                Carrier Requirements
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
