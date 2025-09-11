import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import Breadcrumb from '../../components/Breadcrumb';
import { generateBreadcrumbStructuredData } from '../../lib/seo';

export const metadata: Metadata = {
  title:
    'Freight Factoring Services - Invoice Factoring for Carriers and Brokers',
  description:
    'Fast freight factoring services with quick funding, competitive rates, and flexible terms. Get paid immediately on your freight invoices with our freight factoring company.',
  keywords: [
    'freight factoring',
    'invoice factoring',
    'freight factoring company',
    'freight bill factoring',
    'freight invoice factoring',
    'carrier factoring',
    'freight factoring services',
    'truck factoring',
    'factoring for carriers',
    'freight factoring rates',
    'quick freight factoring',
    'freight factoring online',
  ],
  openGraph: {
    title:
      'Freight Factoring Services - Invoice Factoring for Carriers and Brokers',
    description:
      'Fast freight factoring services with quick funding, competitive rates, and flexible terms. Get paid immediately on your freight invoices.',
    url: 'https://fleetflowapp.com/services/factoring',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-factoring.jpg',
        width: 1200,
        height: 630,
        alt: 'Freight Factoring Services - Invoice Factoring',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freight Factoring Services - Invoice Factoring',
    description:
      'Fast freight factoring services with quick funding and competitive rates.',
    images: ['/og-factoring.jpg'],
  },
  alternates: {
    canonical: '/services/factoring',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const factoringBenefits = [
  {
    title: 'Fast Funding',
    description: 'Get paid within 24-48 hours of invoice submission',
    details: [
      'Same-day funding available',
      'No waiting for customer payment',
      'Immediate cash flow',
      'Flexible payment terms',
    ],
    icon: '⚡',
  },
  {
    title: 'Competitive Rates',
    description: 'Industry-leading factoring rates with transparent pricing',
    details: [
      'Starting at 1.5% per week',
      'No hidden fees',
      'Volume discounts',
      'Loyalty rewards',
    ],
    icon: '💰',
  },
  {
    title: 'Credit Protection',
    description: 'We handle customer non-payment and credit risk',
    details: [
      '100% credit protection',
      'Recourse and non-recourse options',
      'Credit insurance included',
      'Bad debt recovery',
    ],
    icon: '🛡️',
  },
  {
    title: 'Dedicated Support',
    description: 'Personal account manager and 24/7 customer service',
    details: [
      'Dedicated account manager',
      '24/7 phone support',
      'Online portal access',
      'Monthly reporting',
    ],
    icon: '👥',
  },
];

const fundingTimeline = [
  {
    step: '1',
    action: 'Submit Invoice',
    time: 'Immediate',
    description: 'Upload invoice through online portal',
  },
  {
    step: '2',
    action: 'Quick Review',
    time: '1-2 hours',
    description: 'Automated verification and approval',
  },
  {
    step: '3',
    action: 'Funds Transfer',
    time: '24-48 hours',
    description: 'Money deposited to your account',
  },
  {
    step: '4',
    action: 'Customer Payment',
    time: '15-45 days',
    description: 'Customer pays according to terms',
  },
];

export default function FactoringPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Factoring', current: true },
  ];

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Services', url: '/services' },
    { name: 'Factoring', url: '/services/factoring' },
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
              Freight
              <span className='block bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent'>
                Factoring Services
              </span>
            </h1>
            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-300'>
              Get paid immediately on your freight invoices with our fast,
              reliable factoring services. Improve cash flow, reduce wait times,
              and grow your business with competitive rates.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/auth/signup'
                className='rounded-lg bg-gradient-to-r from-orange-600 to-red-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-orange-700 hover:to-red-700 hover:shadow-xl'
              >
                Get Factoring Quote
              </Link>
              <Link
                href='#benefits'
                className='rounded-lg border-2 border-orange-400 bg-transparent px-8 py-4 text-lg font-semibold text-orange-400 transition-all duration-300 hover:bg-orange-400 hover:text-white'
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Key Stats */}
          <div className='mb-16 grid grid-cols-2 gap-8 md:grid-cols-4'>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-orange-400'>
                24-48hrs
              </div>
              <div className='text-gray-400'>Average Funding Time</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-red-400'>1.5%</div>
              <div className='text-gray-400'>Starting Weekly Rate</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-yellow-400'>
                $10M+
              </div>
              <div className='text-gray-400'>Monthly Volume</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-green-400'>
                99.5%
              </div>
              <div className='text-gray-400'>Customer Satisfaction</div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id='benefits' className='container mx-auto px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Why Choose Our Freight Factoring?
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Fast funding, competitive rates, and comprehensive support for
              your factoring needs
            </p>
          </div>

          <div className='mb-16 grid grid-cols-1 gap-8 md:grid-cols-2'>
            {factoringBenefits.map((benefit, index) => (
              <div
                key={index}
                className='rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/70'
              >
                <div className='mb-4 text-4xl'>{benefit.icon}</div>
                <h3 className='mb-3 text-xl font-bold text-white'>
                  {benefit.title}
                </h3>
                <p className='mb-4 text-gray-300'>{benefit.description}</p>
                <ul className='space-y-2'>
                  {benefit.details.map((detail, detailIndex) => (
                    <li
                      key={detailIndex}
                      className='flex items-center text-sm text-gray-400'
                    >
                      <span className='mr-2 text-orange-400'>✓</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Funding Timeline */}
          <div className='mb-16 rounded-2xl border border-slate-700 bg-slate-800/30 p-8 backdrop-blur-sm'>
            <div className='mb-8 text-center'>
              <h3 className='mb-4 text-2xl font-bold text-white'>
                Fast Funding Timeline
              </h3>
              <p className='text-gray-300'>
                From invoice submission to cash in your account
              </p>
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-4'>
              {fundingTimeline.map((step, index) => (
                <div key={index} className='text-center'>
                  <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 font-bold text-white'>
                    {step.step}
                  </div>
                  <h4 className='mb-1 font-semibold text-white'>
                    {step.action}
                  </h4>
                  <p className='mb-2 font-medium text-orange-400'>
                    {step.time}
                  </p>
                  <p className='text-sm text-gray-400'>{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rate Calculator */}
          <div className='mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2'>
            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-6'>
              <h3 className='mb-4 text-xl font-bold text-white'>
                Factoring Rate Calculator
              </h3>
              <p className='mb-4 text-gray-300'>
                Estimate your factoring costs with our transparent pricing
                calculator
              </p>
              <div className='space-y-4'>
                <div>
                  <label className='mb-1 block text-sm text-gray-400'>
                    Invoice Amount
                  </label>
                  <input
                    type='number'
                    placeholder='$10,000'
                    className='w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white'
                  />
                </div>
                <div>
                  <label className='mb-1 block text-sm text-gray-400'>
                    Payment Terms (days)
                  </label>
                  <select className='w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white'>
                    <option>15 days</option>
                    <option>30 days</option>
                    <option>45 days</option>
                    <option>60 days</option>
                  </select>
                </div>
                <button className='w-full rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700'>
                  Calculate Cost
                </button>
              </div>
            </div>

            <div className='rounded-xl border border-slate-700 bg-slate-800/50 p-6'>
              <h3 className='mb-4 text-xl font-bold text-white'>
                Rate Comparison
              </h3>
              <p className='mb-4 text-gray-300'>
                Our competitive rates compared to traditional bank financing
              </p>
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-400'>Bank Loan (prime + 2%)</span>
                  <span className='font-semibold text-red-400'>8-12% APR</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-400'>Business Credit Card</span>
                  <span className='font-semibold text-red-400'>15-25% APR</span>
                </div>
                <div className='flex items-center justify-between border-t border-slate-600 pt-3'>
                  <span className='font-medium text-white'>
                    FleetFlow Factoring
                  </span>
                  <span className='font-bold text-green-400'>
                    1.5-3% per week
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Testimonials */}
        <section className='container mx-auto bg-slate-900/50 px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              What Our Customers Say
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Real results from carriers using our freight factoring services
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {[
              {
                quote:
                  'FleetFlow factoring saved our business. We went from 45-day waits to getting paid immediately.',
                author: 'Mike Johnson',
                company: 'Johnson Trucking',
                result: '$50K immediate funding',
              },
              {
                quote:
                  "The rates are fair and the service is outstanding. Best factoring company we've worked with.",
                author: 'Sarah Martinez',
                company: 'Martinez Logistics',
                result: '15% cost reduction',
              },
              {
                quote:
                  'Reliable funding when we need it most. Their support team is always there to help.',
                author: 'David Chen',
                company: 'Chen Transport',
                result: '99% on-time funding',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className='rounded-lg border border-slate-700 bg-slate-800/50 p-6'
              >
                <div className='mb-3 text-4xl text-orange-400'>"</div>
                <p className='mb-4 text-gray-300 italic'>{testimonial.quote}</p>
                <div className='border-t border-slate-600 pt-3'>
                  <p className='font-semibold text-white'>
                    {testimonial.author}
                  </p>
                  <p className='text-sm text-gray-400'>{testimonial.company}</p>
                  <p className='mt-1 text-sm font-medium text-green-400'>
                    {testimonial.result}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className='container mx-auto px-4 py-16'>
          <div className='rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 p-8 text-center md:p-12'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Get Paid Immediately on Your Freight Invoices
            </h2>
            <p className='mx-auto mb-8 max-w-2xl text-lg text-orange-100'>
              Stop waiting 30-60 days for payment. Get funded within 24-48 hours
              with our competitive freight factoring services. Join thousands of
              satisfied carriers.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/auth/signup'
                className='rounded-lg bg-white px-8 py-4 text-lg font-semibold text-orange-600 shadow-lg transition-all duration-300 hover:bg-gray-100'
              >
                Start Factoring Today
              </Link>
              <Link
                href='/contact'
                className='rounded-lg border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-orange-600'
              >
                Get Factoring Quote
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
