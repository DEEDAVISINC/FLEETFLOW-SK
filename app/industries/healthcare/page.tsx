import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import Breadcrumb from '../../components/Breadcrumb';
import { generateBreadcrumbStructuredData } from '../../lib/seo';

export const metadata: Metadata = {
  title: 'Healthcare Logistics - FleetFlow TMS for Medical Transportation',
  description:
    'Specialized transportation management system for healthcare logistics. Temperature-controlled shipping, pharmaceutical transport, medical equipment delivery, and regulatory compliance for healthcare providers.',
  keywords: [
    'healthcare logistics',
    'medical transportation',
    'pharmaceutical shipping',
    'medical equipment transport',
    'healthcare TMS',
    'temperature controlled logistics',
    'pharma transportation',
    'medical supply chain',
    'healthcare compliance',
    'HIPAA compliant logistics',
    'medical courier services',
  ],
  openGraph: {
    title: 'Healthcare Logistics - FleetFlow TMS for Medical Transportation',
    description:
      'Specialized transportation management system for healthcare logistics, pharmaceutical transport, and medical equipment delivery.',
    url: 'https://fleetflowapp.com/industries/healthcare',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-healthcare.jpg',
        width: 1200,
        height: 630,
        alt: 'Healthcare Logistics with FleetFlow TMS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Healthcare Logistics - Medical Transportation TMS',
    description:
      'Specialized TMS for healthcare logistics and pharmaceutical transport.',
    images: ['/og-healthcare.jpg'],
  },
  alternates: {
    canonical: '/industries/healthcare',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const healthcareFeatures = [
  {
    title: 'Temperature-Controlled Shipping',
    description:
      'Real-time temperature monitoring and reporting for sensitive medical supplies and pharmaceuticals.',
    icon: '🌡️',
    benefits: [
      'Continuous temperature tracking',
      'Automated alerts',
      'Compliance reporting',
      'Cold chain validation',
    ],
  },
  {
    title: 'HIPAA Compliance',
    description:
      'Secure handling of protected health information with encrypted communications and audit trails.',
    icon: '🔒',
    benefits: [
      'PHI encryption',
      'Access controls',
      'Audit logging',
      'Security compliance',
    ],
  },
  {
    title: 'Medical Equipment Transport',
    description:
      'Specialized handling for medical devices, imaging equipment, and sensitive laboratory instruments.',
    icon: '🏥',
    benefits: [
      'Equipment protection',
      'Installation coordination',
      'Warranty compliance',
      'Specialized carriers',
    ],
  },
  {
    title: 'Pharmaceutical Distribution',
    description:
      'End-to-end visibility for pharmaceutical supply chains with batch tracking and expiration monitoring.',
    icon: '💊',
    benefits: [
      'Batch traceability',
      'Expiration tracking',
      'Recall management',
      'Regulatory compliance',
    ],
  },
];

const complianceStandards = [
  'HIPAA Compliance',
  'GDP (Good Distribution Practice)',
  'Temperature Monitoring',
  'Chain of Custody',
  'Batch Tracking',
  'Expiration Management',
  'Recall Procedures',
  'Quality Assurance',
];

export default function HealthcareIndustryPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Industries', href: '/industries' },
    { label: 'Healthcare', current: true },
  ];

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Industries', url: '/industries' },
    { name: 'Healthcare', url: '/industries/healthcare' },
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
              Healthcare
              <span className='block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent'>
                Logistics Solutions
              </span>
            </h1>
            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-300'>
              Specialized transportation management for healthcare providers,
              pharmaceutical companies, and medical device manufacturers. Ensure
              compliance, maintain quality, and deliver critical supplies with
              confidence.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/auth/signup'
                className='rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-700 hover:to-green-800 hover:shadow-xl'
              >
                Start Healthcare Trial
              </Link>
              <Link
                href='/contact'
                className='rounded-lg border-2 border-green-400 bg-transparent px-8 py-4 text-lg font-semibold text-green-400 transition-all duration-300 hover:bg-green-400 hover:text-white'
              >
                Contact Healthcare Team
              </Link>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className='mb-16 grid grid-cols-2 gap-8 md:grid-cols-4'>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-green-400'>
                HIPAA
              </div>
              <div className='text-gray-400'>Compliant</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-blue-400'>24/7</div>
              <div className='text-gray-400'>Monitoring</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-purple-400'>
                99.9%
              </div>
              <div className='text-gray-400'>Uptime</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-orange-400'>FDA</div>
              <div className='text-gray-400'>Approved</div>
            </div>
          </div>
        </section>

        {/* Healthcare Features */}
        <section className='container mx-auto px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Healthcare-Specific Features
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Specialized capabilities designed specifically for healthcare
              logistics and compliance requirements
            </p>
          </div>

          <div className='mb-16 grid grid-cols-1 gap-8 md:grid-cols-2'>
            {healthcareFeatures.map((feature, index) => (
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

          {/* Compliance Standards */}
          <div className='rounded-2xl border border-slate-700 bg-slate-800/30 p-8 backdrop-blur-sm'>
            <h3 className='mb-6 text-center text-2xl font-bold text-white'>
              Regulatory Compliance Standards
            </h3>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
              {complianceStandards.map((standard, index) => (
                <div
                  key={index}
                  className='rounded-lg border border-green-600/30 bg-green-600/20 p-4 text-center'
                >
                  <div className='text-sm font-semibold text-green-400'>
                    {standard}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className='container mx-auto bg-slate-900/50 px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Healthcare Success Stories
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Real results from healthcare organizations using FleetFlow for
              critical logistics operations
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-6'>
              <div className='mb-4 text-4xl'>🏥</div>
              <h3 className='mb-2 text-lg font-bold text-white'>
                Major Hospital Network
              </h3>
              <p className='mb-4 text-sm text-gray-400'>
                "Reduced pharmaceutical delivery times by 40% while maintaining
                perfect temperature compliance."
              </p>
              <div className='font-semibold text-green-400'>
                40% Faster Delivery
              </div>
            </div>

            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-6'>
              <div className='mb-4 text-4xl'>💊</div>
              <h3 className='mb-2 text-lg font-bold text-white'>
                Pharmaceutical Distributor
              </h3>
              <p className='mb-4 text-sm text-gray-400'>
                "Achieved 100% compliance with GDP regulations and eliminated
                temperature excursions."
              </p>
              <div className='font-semibold text-green-400'>
                100% Compliance
              </div>
            </div>

            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-6'>
              <div className='mb-4 text-4xl'>🩺</div>
              <h3 className='mb-2 text-lg font-bold text-white'>
                Medical Device Company
              </h3>
              <p className='mb-4 text-sm text-gray-400'>
                "Improved equipment delivery coordination and reduced
                installation delays by 60%."
              </p>
              <div className='font-semibold text-green-400'>
                60% Fewer Delays
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='container mx-auto px-4 py-16'>
          <div className='rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 p-8 text-center md:p-12'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Ready to Transform Healthcare Logistics?
            </h2>
            <p className='mx-auto mb-8 max-w-2xl text-lg text-green-100'>
              Join leading healthcare organizations already using FleetFlow to
              ensure compliance, maintain quality, and deliver critical supplies
              with confidence.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/auth/signup'
                className='rounded-lg bg-white px-8 py-4 text-lg font-semibold text-green-600 shadow-lg transition-all duration-300 hover:bg-gray-100'
              >
                Start Healthcare Trial
              </Link>
              <Link
                href='/contact'
                className='rounded-lg border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-green-600'
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
