import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import Breadcrumb from '../components/Breadcrumb';
import { generateBreadcrumbStructuredData } from '../lib/seo';

export const metadata: Metadata = {
  title: 'Transportation Management Services - FleetFlow TMS Platform',
  description:
    'Comprehensive transportation management services including freight brokerage, dispatch management, carrier networks, compliance automation, and AI-powered optimization. Trusted by 2,847+ companies worldwide.',
  keywords: [
    'transportation management services',
    'freight brokerage services',
    'dispatch management',
    'carrier management',
    'compliance automation',
    'logistics services',
    'supply chain management',
    'TMS services',
    'freight forwarding',
    'load board services',
  ],
  openGraph: {
    title: 'Transportation Management Services - FleetFlow TMS Platform',
    description:
      'Comprehensive transportation management services including freight brokerage, dispatch management, carrier networks, compliance automation, and AI-powered optimization.',
    url: 'https://fleetflowapp.com/services',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-services.jpg',
        width: 1200,
        height: 630,
        alt: 'FleetFlow Transportation Management Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Transportation Management Services - FleetFlow TMS Platform',
    description:
      'Comprehensive transportation management services with AI-powered optimization.',
    images: ['/og-services.jpg'],
  },
  alternates: {
    canonical: '/services',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const services = [
  {
    name: 'Transportation Management System (TMS)',
    description:
      'Complete platform for managing all aspects of transportation operations, from load booking to delivery tracking.',
    features: [
      'Real-time load tracking and GPS monitoring',
      'Automated carrier matching and bidding',
      'Dynamic pricing optimization',
      'Comprehensive reporting and analytics',
      'Mobile app for drivers and dispatchers',
      'Integration with major load boards',
    ],
    icon: '🚛',
    slug: 'tms',
  },
  {
    name: 'Freight Brokerage Platform',
    description:
      'Advanced brokerage tools for connecting shippers with reliable carriers, managing contracts, and optimizing margins.',
    features: [
      'Carrier database with 10,000+ vetted carriers',
      'Automated rate shopping and negotiation',
      'Contract management and compliance tracking',
      'Revenue analytics and margin optimization',
      'Customer relationship management (CRM)',
      'Insurance and claims management',
    ],
    icon: '🏢',
    slug: 'brokerage',
  },
  {
    name: 'Dispatch Management',
    description:
      'Streamlined dispatch operations with AI-powered route optimization and real-time communication tools.',
    features: [
      'AI-powered route optimization',
      'Real-time driver communication',
      'Load assignment and tracking',
      'Performance monitoring and reporting',
      'Emergency response coordination',
      'Fuel card and expense management',
    ],
    icon: '📋',
    slug: 'dispatch',
  },
  {
    name: 'Compliance & Safety Management',
    description:
      'Automated compliance monitoring and safety management to ensure regulatory adherence and reduce risk.',
    features: [
      'FMCSA and DOT compliance automation',
      'ELD (Electronic Logging Device) integration',
      'Drug and alcohol testing coordination',
      'Vehicle maintenance tracking',
      'Accident reporting and investigation',
      'Safety training and certification tracking',
    ],
    icon: '🛡️',
    slug: 'compliance',
  },
  {
    name: 'Carrier Network Management',
    description:
      'Comprehensive carrier onboarding, qualification, and relationship management platform.',
    features: [
      'Automated carrier onboarding process',
      'Insurance and safety qualification',
      'Performance scoring and rating system',
      'Capacity planning and forecasting',
      'Payment processing and reconciliation',
      'Contract negotiation support',
    ],
    icon: '🤝',
    slug: 'carrier-network',
  },
  {
    name: 'AI-Powered Optimization',
    description:
      'Machine learning algorithms that optimize every aspect of transportation operations for maximum efficiency.',
    features: [
      'Predictive load matching',
      'Dynamic pricing recommendations',
      'Route optimization with traffic data',
      'Demand forecasting and capacity planning',
      'Risk assessment and mitigation',
      'Performance prediction and alerting',
    ],
    icon: '🤖',
    slug: 'ai-optimization',
  },
];

const industries = [
  {
    name: 'Food & Beverage',
    description:
      'Temperature-controlled transportation with real-time monitoring and compliance tracking.',
    icon: '🥤',
  },
  {
    name: 'Manufacturing',
    description:
      'Just-in-time delivery coordination and supply chain visibility for manufacturing operations.',
    icon: '🏭',
  },
  {
    name: 'Retail & E-commerce',
    description:
      'Last-mile delivery optimization and inventory management for retail distribution.',
    icon: '🛒',
  },
  {
    name: 'Healthcare & Pharmaceuticals',
    description:
      'Regulatory compliance and temperature monitoring for sensitive medical shipments.',
    icon: '🏥',
  },
  {
    name: 'Construction',
    description:
      'Heavy equipment and materials transportation with specialized routing and scheduling.',
    icon: '🏗️',
  },
  {
    name: 'Energy & Oil & Gas',
    description:
      'Hazardous materials transportation with specialized compliance and safety requirements.',
    icon: '⚡',
  },
];

export default function ServicesPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', current: true },
  ];

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
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
              Transportation Management
              <span className='block bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent'>
                Services
              </span>
            </h1>
            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-300'>
              Comprehensive transportation management services powered by AI and
              trusted by 2,847+ companies worldwide. From freight brokerage to
              compliance automation, we optimize every aspect of your logistics
              operations.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/auth/signup'
                className='rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl'
              >
                Start Free Trial
              </Link>
              <Link
                href='/plans'
                className='rounded-lg border-2 border-blue-400 bg-transparent px-8 py-4 text-lg font-semibold text-blue-400 transition-all duration-300 hover:bg-blue-400 hover:text-white'
              >
                View Pricing
              </Link>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className='mb-16 grid grid-cols-2 gap-8 md:grid-cols-4'>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-blue-400'>
                2,847+
              </div>
              <div className='text-gray-400'>Active Companies</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-green-400'>150+</div>
              <div className='text-gray-400'>Countries Served</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-purple-400'>
                99.9%
              </div>
              <div className='text-gray-400'>Uptime</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-orange-400'>
                25%+
              </div>
              <div className='text-gray-400'>Efficiency Gain</div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className='container mx-auto px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Our Core Services
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Comprehensive solutions designed to optimize every aspect of your
              transportation operations
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {services.map((service, index) => (
              <article
                key={index}
                className='rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/70'
              >
                <div className='mb-4 text-4xl'>{service.icon}</div>
                <h3 className='mb-3 text-xl font-bold text-white'>
                  {service.name}
                </h3>
                <p className='mb-4 text-gray-300'>{service.description}</p>
                <ul className='mb-6 space-y-2'>
                  {service.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className='flex items-start text-sm text-gray-400'
                    >
                      <span className='mt-1 mr-2 text-green-400'>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services/${service.slug}`}
                  className='font-medium text-blue-400 transition-colors hover:text-blue-300'
                >
                  Learn More →
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* Industries Section */}
        <section className='container mx-auto bg-slate-900/50 px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Industry Solutions
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Specialized transportation solutions tailored for specific
              industry requirements and regulatory standards
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {industries.map((industry, index) => (
              <div
                key={index}
                className='rounded-lg border border-slate-700 bg-slate-800/30 p-6 text-center transition-all duration-300 hover:bg-slate-800/50'
              >
                <div className='mb-3 text-3xl'>{industry.icon}</div>
                <h3 className='mb-2 text-lg font-semibold text-white'>
                  {industry.name}
                </h3>
                <p className='text-sm text-gray-400'>{industry.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className='container mx-auto px-4 py-16'>
          <div className='rounded-2xl bg-gradient-to-r from-blue-600 to-teal-600 p-8 text-center md:p-12'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Ready to Transform Your Transportation Operations?
            </h2>
            <p className='mx-auto mb-8 max-w-2xl text-lg text-blue-100'>
              Join thousands of companies already using FleetFlow to optimize
              their logistics operations. Start your free trial today and
              experience the difference AI-powered transportation management can
              make.
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
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
