import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import Breadcrumb from '../../components/Breadcrumb';
import { generateBreadcrumbStructuredData } from '../../lib/seo';

export const metadata: Metadata = {
  title:
    'Warehouse Management Software - Inventory Control and Fulfillment System',
  description:
    'Complete warehouse management software with inventory control, order fulfillment, WMS integration, and real-time tracking. Streamline warehouse operations with advanced automation and analytics.',
  keywords: [
    'warehouse management software',
    'inventory control software',
    'warehouse management system',
    'WMS software',
    'order fulfillment software',
    'warehouse automation',
    'inventory management software',
    'fulfillment center software',
    'warehouse tracking software',
    'warehouse operations software',
    'inventory control system',
    'warehouse management platform',
    'fulfillment software',
  ],
  openGraph: {
    title:
      'Warehouse Management Software - Inventory Control and Fulfillment System',
    description:
      'Complete warehouse management software with inventory control, order fulfillment, WMS integration, and real-time tracking.',
    url: 'https://fleetflowapp.com/services/warehousing',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-warehousing.jpg',
        width: 1200,
        height: 630,
        alt: 'Warehouse Management Software - Inventory Control',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Warehouse Management Software - Inventory Control',
    description:
      'Complete warehouse management software with inventory control and fulfillment.',
    images: ['/og-warehousing.jpg'],
  },
  alternates: {
    canonical: '/services/warehousing',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const warehouseFeatures = [
  {
    title: 'Real-Time Inventory Tracking',
    description:
      'Live inventory visibility with automated stock level monitoring',
    benefits: [
      'Real-time stock levels',
      'Low stock alerts',
      'Automated reordering',
      'Inventory accuracy 99.9%',
    ],
    icon: '📦',
  },
  {
    title: 'Order Fulfillment Automation',
    description: 'Streamlined picking, packing, and shipping processes',
    benefits: [
      'Automated picking lists',
      'Optimized packing',
      'Shipping integration',
      'Order tracking',
    ],
    icon: '🚚',
  },
  {
    title: 'Multi-Location Management',
    description: 'Manage inventory across multiple warehouse locations',
    benefits: [
      'Centralized control',
      'Cross-location transfers',
      'Location optimization',
      'Unified reporting',
    ],
    icon: '🏭',
  },
  {
    title: 'Barcode & RFID Integration',
    description:
      'Advanced scanning technology for accurate inventory management',
    benefits: [
      'Barcode scanning',
      'RFID tracking',
      'Automated data capture',
      'Error reduction',
    ],
    icon: '📱',
  },
];

const efficiencyGains = [
  {
    process: 'Order Processing Time',
    improvement: '60% faster',
    description: 'Automated fulfillment workflows',
  },
  {
    process: 'Inventory Accuracy',
    improvement: '99.9% accurate',
    description: 'Real-time tracking and automation',
  },
  {
    process: 'Labor Productivity',
    improvement: '40% increase',
    description: 'Optimized picking and packing',
  },
  {
    process: 'Order Fulfillment',
    improvement: '75% faster',
    description: 'Streamlined processes',
  },
];

export default function WarehousingPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Warehousing', current: true },
  ];

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Warehousing', url: '/services/warehousing' },
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
              Warehouse
              <span className='block bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent'>
                Management Software
              </span>
            </h1>
            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-300'>
              Complete warehouse management system with inventory control, order
              fulfillment, and real-time tracking. Automate your warehouse
              operations and maximize efficiency.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/auth/signup'
                className='rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl'
              >
                Start Warehouse Management
              </Link>
              <Link
                href='#features'
                className='rounded-lg border-2 border-purple-400 bg-transparent px-8 py-4 text-lg font-semibold text-purple-400 transition-all duration-300 hover:bg-purple-400 hover:text-white'
              >
                Explore Features
              </Link>
            </div>
          </div>

          {/* Efficiency Gains */}
          <div className='mb-16 grid grid-cols-2 gap-8 md:grid-cols-4'>
            {efficiencyGains.map((gain, index) => (
              <div key={index} className='text-center'>
                <div className='mb-1 text-2xl font-bold text-indigo-400'>
                  {gain.improvement}
                </div>
                <div className='mb-1 font-semibold text-white'>
                  {gain.process}
                </div>
                <div className='text-sm text-gray-400'>{gain.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id='features' className='container mx-auto px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Warehouse Management Features
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Comprehensive tools to optimize every aspect of your warehouse
              operations
            </p>
          </div>

          <div className='mb-16 grid grid-cols-1 gap-8 md:grid-cols-2'>
            {warehouseFeatures.map((feature, index) => (
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
                      <span className='mr-2 text-indigo-400'>✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Warehouse Operations Dashboard */}
          <div className='mb-16 rounded-2xl border border-slate-700 bg-slate-800/30 p-8 backdrop-blur-sm'>
            <div className='mb-8 text-center'>
              <h3 className='mb-4 text-2xl font-bold text-white'>
                Warehouse Operations Dashboard
              </h3>
              <p className='text-gray-300'>
                Real-time visibility into all warehouse activities
              </p>
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
              {[
                { title: 'Inventory Levels', value: 'Real-time', icon: '📊' },
                { title: 'Order Status', value: 'Live Updates', icon: '📋' },
                {
                  title: 'Staff Productivity',
                  value: 'Performance',
                  icon: '👥',
                },
                { title: 'Equipment Status', value: 'Monitoring', icon: '🔧' },
              ].map((metric, index) => (
                <div
                  key={index}
                  className='rounded-lg bg-slate-900/50 p-4 text-center'
                >
                  <div className='mb-2 text-2xl'>{metric.icon}</div>
                  <h4 className='mb-1 font-semibold text-white'>
                    {metric.title}
                  </h4>
                  <p className='text-sm text-indigo-400'>{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Capabilities */}
          <div className='mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2'>
            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-6'>
              <h3 className='mb-4 text-xl font-bold text-white'>
                E-commerce Integration
              </h3>
              <p className='mb-4 text-gray-300'>
                Seamless integration with major e-commerce platforms for
                automated order fulfillment
              </p>
              <ul className='space-y-2'>
                <li className='flex items-center text-sm text-gray-400'>
                  <span className='mr-2 text-green-400'>🛒</span>
                  Shopify, WooCommerce
                </li>
                <li className='flex items-center text-sm text-gray-400'>
                  <span className='mr-2 text-green-400'>📦</span>
                  Amazon FBA ready
                </li>
                <li className='flex items-center text-sm text-gray-400'>
                  <span className='mr-2 text-green-400'>🔄</span>
                  Real-time sync
                </li>
              </ul>
            </div>

            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-6'>
              <h3 className='mb-4 text-xl font-bold text-white'>
                Shipping Carrier Integration
              </h3>
              <p className='mb-4 text-gray-300'>
                Direct integration with major carriers for automated shipping
                and tracking
              </p>
              <ul className='space-y-2'>
                <li className='flex items-center text-sm text-gray-400'>
                  <span className='mr-2 text-green-400'>🚚</span>
                  UPS, FedEx, DHL
                </li>
                <li className='flex items-center text-sm text-gray-400'>
                  <span className='mr-2 text-green-400'>📋</span>
                  Automated labeling
                </li>
                <li className='flex items-center text-sm text-gray-400'>
                  <span className='mr-2 text-green-400'>📍</span>
                  Real-time tracking
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Warehouse Types */}
        <section className='container mx-auto bg-slate-900/50 px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Solutions for Every Warehouse Type
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Specialized warehouse management solutions for different business
              models
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {[
              {
                type: 'Fulfillment Centers',
                features: [
                  'High-volume processing',
                  'Multi-channel orders',
                  'Cross-docking',
                  'Returns management',
                ],
                icon: '📦',
              },
              {
                type: 'Distribution Centers',
                features: [
                  'Bulk inventory',
                  'Route optimization',
                  'Load planning',
                  'Multi-location sync',
                ],
                icon: '🏭',
              },
              {
                type: 'Cold Storage',
                features: [
                  'Temperature monitoring',
                  'Compliance tracking',
                  'Specialized equipment',
                  'Quality control',
                ],
                icon: '❄️',
              },
            ].map((warehouse, index) => (
              <div
                key={index}
                className='rounded-lg border border-slate-700 bg-slate-800/50 p-6'
              >
                <div className='mb-3 text-3xl'>{warehouse.icon}</div>
                <h3 className='mb-3 text-lg font-semibold text-white'>
                  {warehouse.type}
                </h3>
                <ul className='space-y-1'>
                  {warehouse.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className='flex items-center text-sm text-gray-400'
                    >
                      <span className='mr-2 text-indigo-400'>•</span>
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
          <div className='rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-center md:p-12'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Transform Your Warehouse Operations
            </h2>
            <p className='mx-auto mb-8 max-w-2xl text-lg text-purple-100'>
              Automate your warehouse operations, eliminate errors, and increase
              efficiency. Join thousands of warehouses already using our
              warehouse management software.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/auth/signup'
                className='rounded-lg bg-white px-8 py-4 text-lg font-semibold text-purple-600 shadow-lg transition-all duration-300 hover:bg-gray-100'
              >
                Start Warehouse Management
              </Link>
              <Link
                href='/contact'
                className='rounded-lg border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-purple-600'
              >
                Schedule Warehouse Demo
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
