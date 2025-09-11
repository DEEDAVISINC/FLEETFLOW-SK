import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import Breadcrumb from '../../components/Breadcrumb';
import { generateBreadcrumbStructuredData } from '../../lib/seo';

export const metadata: Metadata = {
  title:
    'Route Optimization Software - GPS Route Planning for Efficient Delivery',
  description:
    'Advanced route optimization software with GPS tracking, real-time route planning, and delivery optimization. Reduce fuel costs, improve delivery times, and increase driver productivity with AI-powered routing.',
  keywords: [
    'route optimization software',
    'GPS route planning',
    'delivery route optimization',
    'route optimization GPS',
    'efficient delivery routing',
    'route planning software',
    'GPS tracking route optimization',
    'delivery route planner',
    'route optimization tool',
    'GPS route optimization',
    'delivery optimization software',
    'route planning GPS',
    'efficient routing software',
    'route optimization system',
  ],
  openGraph: {
    title:
      'Route Optimization Software - GPS Route Planning for Efficient Delivery',
    description:
      'Advanced route optimization software with GPS tracking, real-time route planning, and delivery optimization. Reduce fuel costs and improve delivery times.',
    url: 'https://fleetflowapp.com/services/route-optimization',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-route-optimization.jpg',
        width: 1200,
        height: 630,
        alt: 'Route Optimization Software - GPS Route Planning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Route Optimization Software - GPS Route Planning',
    description:
      'Advanced route optimization software with GPS tracking and real-time route planning.',
    images: ['/og-route-optimization.jpg'],
  },
  alternates: {
    canonical: '/services/route-optimization',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const optimizationFeatures = [
  {
    title: 'Real-Time GPS Tracking',
    description:
      'Live GPS tracking for all vehicles with real-time location updates',
    benefits: [
      'Live vehicle location',
      'Route deviation alerts',
      'Geofencing capabilities',
      'Historical route data',
    ],
    icon: '📍',
  },
  {
    title: 'Multi-Stop Route Optimization',
    description: 'Optimize routes with multiple stops for maximum efficiency',
    benefits: [
      'Automatic route calculation',
      'Time window optimization',
      'Priority stop sequencing',
      'Delivery time estimation',
    ],
    icon: '🗺️',
  },
  {
    title: 'Traffic & Weather Integration',
    description:
      'Real-time traffic and weather data integration for route adjustments',
    benefits: [
      'Live traffic updates',
      'Weather impact analysis',
      'Alternative route suggestions',
      'Delay prediction',
    ],
    icon: '🌦️',
  },
  {
    title: 'Fuel Cost Optimization',
    description: 'Minimize fuel consumption with optimal routing algorithms',
    benefits: [
      'Fuel-efficient routes',
      'Idling reduction',
      'Speed optimization',
      'Fuel cost savings',
    ],
    icon: '⛽',
  },
];

const savingsMetrics = [
  {
    metric: 'Fuel Savings',
    value: '15-25%',
    description: 'Reduced fuel consumption through optimal routing',
  },
  {
    metric: 'Time Efficiency',
    value: '20-30%',
    description: 'Faster delivery times with optimized routes',
  },
  {
    metric: 'Driver Productivity',
    value: '25-35%',
    description: 'Increased deliveries per driver per day',
  },
  {
    metric: 'Customer Satisfaction',
    value: '40%',
    description: 'Improved on-time delivery rates',
  },
];

export default function RouteOptimizationPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Route Optimization', current: true },
  ];

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Route Optimization', url: '/services/route-optimization' },
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
              Route
              <span className='block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'>
                Optimization Software
              </span>
            </h1>
            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-300'>
              Advanced GPS route planning and optimization software that reduces
              fuel costs, improves delivery times, and maximizes driver
              productivity with AI-powered routing algorithms.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/auth/signup'
                className='rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl'
              >
                Start Route Optimization
              </Link>
              <Link
                href='#features'
                className='rounded-lg border-2 border-blue-400 bg-transparent px-8 py-4 text-lg font-semibold text-blue-400 transition-all duration-300 hover:bg-blue-400 hover:text-white'
              >
                View Features
              </Link>
            </div>
          </div>

          {/* Key Savings Metrics */}
          <div className='mb-16 grid grid-cols-2 gap-8 md:grid-cols-4'>
            {savingsMetrics.map((metric, index) => (
              <div key={index} className='text-center'>
                <div className='mb-2 text-3xl font-bold text-cyan-400'>
                  {metric.value}
                </div>
                <div className='mb-1 font-semibold text-white'>
                  {metric.metric}
                </div>
                <div className='text-sm text-gray-400'>
                  {metric.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id='features' className='container mx-auto px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Advanced Route Optimization Features
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Powerful GPS route planning tools designed to maximize efficiency
              and reduce costs
            </p>
          </div>

          <div className='mb-16 grid grid-cols-1 gap-8 md:grid-cols-2'>
            {optimizationFeatures.map((feature, index) => (
              <div
                key={index}
                className='rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/70'
              >
                <div className='mb-4 text-4xl'>{feature.icon}</div>
                <h3 className='mb-3 text-xl font-bold text-white'>
                  {feature.title}
                </h3>
                <p className='mb-4 text-gray-300'>{feature.description}</p>
                <ul className='space-y-2'>
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li
                      key={benefitIndex}
                      className='flex items-center text-sm text-gray-400'
                    >
                      <span className='mr-2 text-cyan-400'>✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Route Planning Demo */}
          <div className='mb-16 rounded-2xl border border-slate-700 bg-slate-800/30 p-8 backdrop-blur-sm'>
            <div className='mb-8 text-center'>
              <h3 className='mb-4 text-2xl font-bold text-white'>
                Real-Time Route Optimization Demo
              </h3>
              <p className='text-gray-300'>
                See how our AI optimizes routes in real-time
              </p>
            </div>
            <div className='rounded-lg bg-slate-900/50 p-6 text-center'>
              <div className='mb-4 text-6xl'>🗺️</div>
              <p className='mb-4 text-gray-400'>
                Interactive route optimization visualization
              </p>
              <button className='rounded-lg bg-cyan-600 px-6 py-3 font-medium text-white transition-colors hover:bg-cyan-700'>
                Start Route Demo
              </button>
            </div>
          </div>

          {/* Integration Section */}
          <div className='mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2'>
            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-6'>
              <h3 className='mb-4 text-xl font-bold text-white'>
                Mobile Integration
              </h3>
              <p className='mb-4 text-gray-300'>
                Full mobile app for drivers with turn-by-turn GPS navigation and
                real-time updates
              </p>
              <ul className='space-y-2'>
                <li className='flex items-center text-sm text-gray-400'>
                  <span className='mr-2 text-green-400'>📱</span>
                  iOS and Android apps
                </li>
                <li className='flex items-center text-sm text-gray-400'>
                  <span className='mr-2 text-green-400'>🧭</span>
                  Turn-by-turn navigation
                </li>
                <li className='flex items-center text-sm text-gray-400'>
                  <span className='mr-2 text-green-400'>🔄</span>
                  Real-time route updates
                </li>
              </ul>
            </div>

            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-6'>
              <h3 className='mb-4 text-xl font-bold text-white'>
                API Integration
              </h3>
              <p className='mb-4 text-gray-300'>
                Seamless integration with existing TMS, ERP, and GPS systems
              </p>
              <ul className='space-y-2'>
                <li className='flex items-center text-sm text-gray-400'>
                  <span className='mr-2 text-green-400'>🔗</span>
                  RESTful API
                </li>
                <li className='flex items-center text-sm text-gray-400'>
                  <span className='mr-2 text-green-400'>📊</span>
                  Real-time data sync
                </li>
                <li className='flex items-center text-sm text-gray-400'>
                  <span className='mr-2 text-green-400'>⚙️</span>
                  Custom integrations
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Industry Applications */}
        <section className='container mx-auto bg-slate-900/50 px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Route Optimization for Every Industry
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Specialized routing solutions tailored for different business
              types
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {[
              {
                industry: 'E-commerce Delivery',
                features: [
                  'Last-mile optimization',
                  'Same-day delivery',
                  'Customer time windows',
                ],
                icon: '📦',
              },
              {
                industry: 'Food Service',
                features: [
                  'Temperature monitoring',
                  'Time-critical delivery',
                  'Multi-stop routes',
                ],
                icon: '🍕',
              },
              {
                industry: 'Construction',
                features: [
                  'Heavy equipment routing',
                  'Material delivery',
                  'Project timelines',
                ],
                icon: '🏗️',
              },
            ].map((item, index) => (
              <div
                key={index}
                className='rounded-lg border border-slate-700 bg-slate-800/50 p-6'
              >
                <div className='mb-3 text-3xl'>{item.icon}</div>
                <h3 className='mb-3 text-lg font-semibold text-white'>
                  {item.industry}
                </h3>
                <ul className='space-y-1'>
                  {item.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className='flex items-center text-sm text-gray-400'
                    >
                      <span className='mr-2 text-cyan-400'>•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className='container mx-auto px-4 py-16'>
          <div className='rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-center md:p-12'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Optimize Your Routes Today
            </h2>
            <p className='mx-auto mb-8 max-w-2xl text-lg text-blue-100'>
              Start saving fuel costs and improving delivery efficiency with our
              advanced route optimization software. Join thousands of businesses
              already optimizing their routes.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/auth/signup'
                className='rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg transition-all duration-300 hover:bg-gray-100'
              >
                Start Free Trial
              </Link>
              <Link
                href='/contact'
                className='rounded-lg border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-blue-600'
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
