import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import Breadcrumb from '../../components/Breadcrumb';
import { generateBreadcrumbStructuredData } from '../../lib/seo';

export const metadata: Metadata = {
  title: 'Software for Dispatchers - Professional Dispatch Management Platform',
  description:
    'Advanced software for dispatchers with load optimization, carrier management, real-time tracking, and automated workflows. Make dispatching easy with FleetFlow dispatch software.',
  keywords: [
    'software for dispatchers',
    'dispatcher software',
    'dispatch management software',
    'load dispatch software',
    'truck dispatcher tools',
    'dispatching made easy',
    'dispatcher platform',
    'load optimization software',
    'carrier management software',
    'dispatch automation',
    'truck dispatch software',
    'dispatcher workflow tools',
  ],
  openGraph: {
    title:
      'Software for Dispatchers - Professional Dispatch Management Platform',
    description:
      'Advanced software for dispatchers with load optimization, carrier management, real-time tracking, and automated workflows.',
    url: 'https://fleetflowapp.com/dispatchers/software',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-dispatcher-software.jpg',
        width: 1200,
        height: 630,
        alt: 'Software for Dispatchers - Professional Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Software for Dispatchers - Professional Platform',
    description:
      'Advanced software for dispatchers with load optimization and automation.',
    images: ['/og-dispatcher-software.jpg'],
  },
  alternates: {
    canonical: '/dispatchers/software',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const features = [
  {
    title: 'Load Optimization Engine',
    description: 'AI-powered load matching and route optimization',
    benefits: [
      'Automatic load-carrier matching',
      'Route efficiency maximization',
      'Cost reduction',
      'Time savings',
    ],
    icon: '🧠',
  },
  {
    title: 'Real-Time Tracking',
    description: 'Live GPS tracking and shipment visibility',
    benefits: [
      'Real-time location updates',
      'ETA calculations',
      'Customer notifications',
      'Exception alerts',
    ],
    icon: '📍',
  },
  {
    title: 'Automated Workflows',
    description: 'Streamline dispatch processes with automation',
    benefits: [
      'Automated carrier notifications',
      'Document generation',
      'Rate calculations',
      'Invoice creation',
    ],
    icon: '⚙️',
  },
  {
    title: 'Carrier Management',
    description: 'Comprehensive carrier database and performance tracking',
    benefits: [
      'Carrier rating system',
      'Performance analytics',
      'Contract management',
      'Communication tools',
    ],
    icon: '🚛',
  },
];

const timeSavings = [
  {
    task: 'Load-Carrier Matching',
    traditional: '2-3 hours',
    automated: '5 minutes',
    savings: '95%',
  },
  {
    task: 'Route Optimization',
    traditional: '1 hour',
    automated: '2 minutes',
    savings: '97%',
  },
  {
    task: 'Document Processing',
    traditional: '30 minutes',
    automated: '3 minutes',
    savings: '90%',
  },
  {
    task: 'Customer Updates',
    traditional: '15 minutes',
    automated: '1 minute',
    savings: '93%',
  },
];

export default function DispatcherSoftwarePage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Dispatchers', href: '/dispatch' },
    { label: 'Software', current: true },
  ];

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Dispatchers', url: '/dispatch' },
    { name: 'Software', url: '/dispatchers/software' },
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
              Software for
              <span className='block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                Dispatchers
              </span>
            </h1>
            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-300'>
              Professional dispatch management software that makes dispatching
              easy. Automate workflows, optimize loads, and manage carriers with
              powerful AI-driven tools.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/auth/signup'
                className='rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl'
              >
                Start Free Trial
              </Link>
              <Link
                href='/dispatch'
                className='rounded-lg border-2 border-purple-400 bg-transparent px-8 py-4 text-lg font-semibold text-purple-400 transition-all duration-300 hover:bg-purple-400 hover:text-white'
              >
                View Demo
              </Link>
            </div>
          </div>

          {/* Key Benefits */}
          <div className='mb-16 grid grid-cols-2 gap-8 md:grid-cols-4'>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-purple-400'>95%</div>
              <div className='text-gray-400'>Time Saved</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-pink-400'>10x</div>
              <div className='text-gray-400'>Faster Processing</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-blue-400'>24/7</div>
              <div className='text-gray-400'>Automated Monitoring</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-green-400'>
                99.9%
              </div>
              <div className='text-gray-400'>Accuracy Rate</div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className='container mx-auto px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Powerful Dispatcher Tools
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Everything you need to manage loads, carriers, and customers
              efficiently
            </p>
          </div>

          <div className='mb-16 grid grid-cols-1 gap-8 md:grid-cols-2'>
            {features.map((feature, index) => (
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
                      <span className='mr-2 text-green-400'>✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Time Savings Comparison */}
          <div className='rounded-2xl border border-slate-700 bg-slate-800/30 p-8 backdrop-blur-sm'>
            <h3 className='mb-6 text-center text-2xl font-bold text-white'>
              Time Savings Comparison
            </h3>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-slate-600'>
                    <th className='px-4 py-3 text-left text-white'>Task</th>
                    <th className='px-4 py-3 text-center text-white'>
                      Traditional Method
                    </th>
                    <th className='px-4 py-3 text-center text-white'>
                      FleetFlow Software
                    </th>
                    <th className='px-4 py-3 text-center text-white'>
                      Time Saved
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {timeSavings.map((item, index) => (
                    <tr key={index} className='border-b border-slate-700'>
                      <td className='px-4 py-3 text-gray-300'>{item.task}</td>
                      <td className='px-4 py-3 text-center text-red-400'>
                        {item.traditional}
                      </td>
                      <td className='px-4 py-3 text-center text-green-400'>
                        {item.automated}
                      </td>
                      <td className='px-4 py-3 text-center font-bold text-purple-400'>
                        {item.savings}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Integration Features */}
        <section className='container mx-auto bg-slate-900/50 px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Seamless Integrations
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Connect with your existing tools and systems for maximum
              efficiency
            </p>
          </div>

          <div className='grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6'>
            {[
              'TMS Systems',
              'ERP Software',
              'ELD Providers',
              'GPS Systems',
              'Accounting Software',
              'Communication Tools',
              'Load Boards',
              'Carrier Networks',
            ].map((integration, index) => (
              <div
                key={index}
                className='rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center transition-all duration-300 hover:bg-slate-800/70'
              >
                <div className='mb-2 text-2xl'>🔗</div>
                <div className='text-sm font-medium text-gray-300'>
                  {integration}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mobile Access */}
        <section className='container mx-auto px-4 py-16'>
          <div className='rounded-2xl border border-slate-700 bg-slate-800/30 p-8 backdrop-blur-sm'>
            <div className='grid grid-cols-1 items-center gap-8 lg:grid-cols-2'>
              <div>
                <h3 className='mb-4 text-2xl font-bold text-white'>
                  Mobile Dispatcher Access
                </h3>
                <p className='mb-6 text-gray-300'>
                  Manage loads, track shipments, and communicate with carriers
                  from anywhere. Full-featured mobile app with real-time updates
                  and push notifications.
                </p>
                <ul className='space-y-2'>
                  <li className='flex items-center text-gray-400'>
                    <span className='mr-2 text-green-400'>📱</span>
                    iOS and Android apps
                  </li>
                  <li className='flex items-center text-gray-400'>
                    <span className='mr-2 text-green-400'>🔔</span>
                    Real-time notifications
                  </li>
                  <li className='flex items-center text-gray-400'>
                    <span className='mr-2 text-green-400'>📊</span>
                    Live dashboard access
                  </li>
                  <li className='flex items-center text-gray-400'>
                    <span className='mr-2 text-green-400'>💬</span>
                    In-app messaging
                  </li>
                </ul>
              </div>
              <div className='text-center'>
                <div className='mb-4 text-6xl'>📱</div>
                <p className='text-gray-400'>Available on all devices</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='container mx-auto px-4 py-16'>
          <div className='rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center md:p-12'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Transform Your Dispatch Operations
            </h2>
            <p className='mx-auto mb-8 max-w-2xl text-lg text-purple-100'>
              Join thousands of dispatchers who have made dispatching easy with
              FleetFlow. Start your free trial and experience the difference
              professional software makes.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/auth/signup'
                className='rounded-lg bg-white px-8 py-4 text-lg font-semibold text-purple-600 shadow-lg transition-all duration-300 hover:bg-gray-100'
              >
                Start Free Trial
              </Link>
              <Link
                href='/dispatch'
                className='rounded-lg border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-purple-600'
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
