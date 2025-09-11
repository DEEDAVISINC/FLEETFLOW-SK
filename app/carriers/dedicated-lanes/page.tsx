import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import Breadcrumb from '../../components/Breadcrumb';
import { generateBreadcrumbStructuredData } from '../../lib/seo';

export const metadata: Metadata = {
  title: 'Dedicated Lanes - Guaranteed Freight Routes for Carriers',
  description:
    'Find dedicated freight lanes with guaranteed loads and consistent routes. Secure dedicated lanes for your trucks with reliable shippers and steady income through FleetFlow.',
  keywords: [
    'dedicated lanes',
    'dedicated freight lanes',
    'guaranteed freight routes',
    'dedicated truck lanes',
    'consistent freight routes',
    'dedicated carrier lanes',
    'regular freight routes',
    'guaranteed loads',
    'steady truck routes',
    'dedicated shipping lanes',
    'freight lanes guaranteed',
    'truck dedicated routes',
  ],
  openGraph: {
    title: 'Dedicated Lanes - Guaranteed Freight Routes for Carriers',
    description:
      'Find dedicated freight lanes with guaranteed loads and consistent routes. Secure dedicated lanes for your trucks with reliable shippers.',
    url: 'https://fleetflowapp.com/carriers/dedicated-lanes',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-dedicated-lanes.jpg',
        width: 1200,
        height: 630,
        alt: 'Dedicated Freight Lanes - Guaranteed Routes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dedicated Lanes - Guaranteed Freight Routes',
    description:
      'Find dedicated freight lanes with guaranteed loads and consistent routes.',
    images: ['/og-dedicated-lanes.jpg'],
  },
  alternates: {
    canonical: '/carriers/dedicated-lanes',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const laneTypes = [
  {
    title: 'Regional Dedicated Lanes',
    description: 'Weekly or bi-weekly routes between major metro areas',
    features: [
      'Consistent schedule',
      'Predictable miles',
      'Familiar routes',
      'Regular customers',
    ],
    icon: '🏙️',
  },
  {
    title: 'Long-Haul Dedicated Lanes',
    description: 'Cross-country routes with guaranteed backhauls',
    features: [
      'High revenue potential',
      'Efficient routing',
      'Fuel optimization',
      'Premium rates',
    ],
    icon: '🚚',
  },
  {
    title: 'Industry-Specific Lanes',
    description: 'Specialized routes for specific cargo types',
    features: [
      'Equipment specialization',
      'Industry expertise',
      'Premium pricing',
      'Niche markets',
    ],
    icon: '🏭',
  },
];

const benefits = [
  'Guaranteed weekly income',
  'Eliminate empty miles',
  'Predictable scheduling',
  'Better fuel efficiency',
  'Strong carrier relationships',
  'Consistent equipment utilization',
  'Reduced marketing costs',
  'Priority load assignments',
];

export default function DedicatedLanesPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Carriers', href: '/carriers' },
    { label: 'Dedicated Lanes', current: true },
  ];

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Carriers', url: '/carriers' },
    { name: 'Dedicated Lanes', url: '/carriers/dedicated-lanes' },
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
              Dedicated
              <span className='block bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent'>
                Freight Lanes
              </span>
            </h1>
            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-300'>
              Secure guaranteed freight routes with consistent loads and
              predictable income. Eliminate empty miles and maximize your
              truck's earning potential with dedicated lanes.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/carriers'
                className='rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl'
              >
                Find Dedicated Lanes
              </Link>
              <Link
                href='/auth/signup'
                className='rounded-lg border-2 border-blue-400 bg-transparent px-8 py-4 text-lg font-semibold text-blue-400 transition-all duration-300 hover:bg-blue-400 hover:text-white'
              >
                Join Carrier Network
              </Link>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className='mb-16 grid grid-cols-2 gap-8 md:grid-cols-4'>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-blue-400'>500+</div>
              <div className='text-gray-400'>Active Lanes</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-green-400'>
                $2.8M
              </div>
              <div className='text-gray-400'>Monthly Volume</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-purple-400'>98%</div>
              <div className='text-gray-400'>On-Time Delivery</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-orange-400'>15+</div>
              <div className='text-gray-400'>Years Experience</div>
            </div>
          </div>
        </section>

        {/* Lane Types */}
        <section className='container mx-auto px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Types of Dedicated Lanes
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Choose from various dedicated lane options based on your equipment
              type and preferred routes
            </p>
          </div>

          <div className='mb-16 grid grid-cols-1 gap-8 md:grid-cols-3'>
            {laneTypes.map((lane, index) => (
              <div
                key={index}
                className='rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/70'
              >
                <div className='mb-4 text-4xl'>{lane.icon}</div>
                <h3 className='mb-3 text-xl font-bold text-white'>
                  {lane.title}
                </h3>
                <p className='mb-4 text-gray-300'>{lane.description}</p>
                <ul className='space-y-2'>
                  {lane.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className='flex items-center text-sm text-gray-400'
                    >
                      <span className='mr-2 text-green-400'>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className='rounded-2xl border border-slate-700 bg-slate-800/30 p-8 backdrop-blur-sm'>
            <h3 className='mb-6 text-center text-2xl font-bold text-white'>
              Why Choose Dedicated Lanes?
            </h3>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className='rounded-lg border border-blue-600/30 bg-blue-600/20 p-4 text-center'
                >
                  <div className='text-sm font-semibold text-blue-400'>
                    {benefit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Routes */}
        <section className='container mx-auto bg-slate-900/50 px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Popular Dedicated Routes
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              High-demand routes with guaranteed loads and competitive rates
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {[
              {
                route: 'Los Angeles ↔ Dallas',
                distance: '1,400 miles',
                avgRate: '$3.50/mile',
                equipment: 'Dry Van',
              },
              {
                route: 'Chicago ↔ Atlanta',
                distance: '700 miles',
                avgRate: '$3.20/mile',
                equipment: 'Reefer',
              },
              {
                route: 'New York ↔ Miami',
                distance: '1,280 miles',
                avgRate: '$3.80/mile',
                equipment: 'Flatbed',
              },
              {
                route: 'Seattle ↔ Portland',
                distance: '175 miles',
                avgRate: '$2.80/mile',
                equipment: 'Dry Van',
              },
              {
                route: 'Denver ↔ Salt Lake City',
                distance: '350 miles',
                avgRate: '$3.00/mile',
                equipment: 'Reefer',
              },
              {
                route: 'Houston ↔ New Orleans',
                distance: '320 miles',
                avgRate: '$2.90/mile',
                equipment: 'Dry Van',
              },
            ].map((route, index) => (
              <div
                key={index}
                className='rounded-lg border border-slate-700 bg-slate-800/50 p-6'
              >
                <div className='mb-3 flex items-start justify-between'>
                  <h3 className='text-lg font-semibold text-white'>
                    {route.route}
                  </h3>
                  <span className='text-sm font-medium text-blue-400'>
                    {route.equipment}
                  </span>
                </div>
                <div className='space-y-2 text-sm text-gray-400'>
                  <p>Distance: {route.distance}</p>
                  <p>Avg Rate: {route.avgRate}</p>
                </div>
                <button className='mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700'>
                  View Lane Details
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className='container mx-auto px-4 py-16'>
          <div className='rounded-2xl bg-gradient-to-r from-blue-600 to-green-600 p-8 text-center md:p-12'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Ready for Guaranteed Income?
            </h2>
            <p className='mx-auto mb-8 max-w-2xl text-lg text-blue-100'>
              Join hundreds of carriers already earning consistent income
              through dedicated lanes. No more empty miles, no more inconsistent
              loads.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/auth/signup'
                className='rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition-all duration-300 hover:bg-gray-100'
              >
                Get Dedicated Lanes
              </Link>
              <Link
                href='/carriers'
                className='rounded-lg border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-blue-600'
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
