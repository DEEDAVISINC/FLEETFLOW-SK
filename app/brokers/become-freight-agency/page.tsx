import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import Breadcrumb from '../../components/Breadcrumb';
import { generateBreadcrumbStructuredData } from '../../lib/seo';

export const metadata: Metadata = {
  title: 'Become a Freight Agency - Start Your Own Freight Brokerage Business',
  description:
    'Learn how to become a freight agency and start your own freight brokerage. Complete guide to freight broker licensing, bonding, training, and business setup with FleetFlow LaunchPad.',
  keywords: [
    'become a freight agency',
    'start your own freight brokerage',
    'freight broker licensing',
    'freight brokerage business',
    'start freight brokerage',
    'become freight broker',
    'freight agency startup',
    'brokerage business guide',
    'freight broker training',
    'freight brokerage license',
    'start brokerage company',
    'freight broker requirements',
  ],
  openGraph: {
    title:
      'Become a Freight Agency - Start Your Own Freight Brokerage Business',
    description:
      'Learn how to become a freight agency and start your own freight brokerage. Complete guide to licensing, bonding, and business setup.',
    url: 'https://fleetflowapp.com/brokers/become-freight-agency',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-become-freight-agency.jpg',
        width: 1200,
        height: 630,
        alt: 'Become a Freight Agency - Start Your Own Brokerage',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Become a Freight Agency - Start Freight Brokerage',
    description:
      'Learn how to become a freight agency and start your own freight brokerage business.',
    images: ['/og-become-freight-agency.jpg'],
  },
  alternates: {
    canonical: '/brokers/become-freight-agency',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const steps = [
  {
    step: '1',
    title: 'Get Your Freight Broker License',
    description: 'Obtain your Broker Carrier (BMC-84) license from the FMCSA',
    time: '2-4 weeks',
    cost: '$300-500',
    icon: '📋',
  },
  {
    step: '2',
    title: 'Secure Your Bond',
    description: 'Purchase the required surety bond ($75,000 minimum)',
    time: '1-2 weeks',
    cost: '$1,500-3,000',
    icon: '🔒',
  },
  {
    step: '3',
    title: 'Business Formation',
    description: 'Register your business entity and obtain EIN',
    time: '1 week',
    cost: '$500-1,000',
    icon: '🏢',
  },
  {
    step: '4',
    title: 'Insurance & Banking',
    description: 'Set up business insurance and dedicated bank account',
    time: '1-2 weeks',
    cost: '$2,000-5,000',
    icon: '💼',
  },
  {
    step: '5',
    title: 'Technology Setup',
    description: 'Choose and implement your TMS and brokerage software',
    time: '1 week',
    cost: '$500-2,000/month',
    icon: '💻',
  },
  {
    step: '6',
    title: 'Build Carrier Network',
    description: 'Establish relationships with reliable carriers',
    time: 'Ongoing',
    cost: 'Variable',
    icon: '🤝',
  },
];

const requirements = [
  'Minimum 2 years experience in transportation',
  'Clean criminal background check',
  'Financial stability proof',
  'Business plan submission',
  'FMCSA knowledge test',
  'Surety bond application',
  'Business registration',
  'Insurance coverage',
];

const profitMargins = [
  {
    revenue: '$250,000',
    expenses: '$180,000',
    profit: '$70,000',
    margin: '28%',
  },
  {
    revenue: '$500,000',
    expenses: '$350,000',
    profit: '$150,000',
    margin: '30%',
  },
  {
    revenue: '$1,000,000',
    expenses: '$680,000',
    profit: '$320,000',
    margin: '32%',
  },
  {
    revenue: '$2,500,000',
    expenses: '$1,625,000',
    profit: '$875,000',
    margin: '35%',
  },
];

export default function BecomeFreightAgencyPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Brokers', href: '/broker' },
    { label: 'Become Freight Agency', current: true },
  ];

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Brokers', url: '/broker' },
    { name: 'Become Freight Agency', url: '/brokers/become-freight-agency' },
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

      {/* FAQ Schema */}
      <Script
        id='faq-structured-data'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How do I become a freight broker?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'To become a freight broker, you need to obtain a Broker Carrier license from FMCSA, secure a surety bond, register your business, and complete the required training and insurance.',
                },
              },
              {
                '@type': 'Question',
                name: 'How much does it cost to start a freight brokerage?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Startup costs typically range from $5,000 to $15,000, including licensing fees, bonding, insurance, software, and initial marketing.',
                },
              },
              {
                '@type': 'Question',
                name: 'What experience do I need to become a freight broker?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'You need at least 2 years of experience in transportation, logistics, or related fields, plus a clean background check and financial stability.',
                },
              },
            ],
          }),
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
              Become a
              <span className='block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent'>
                Freight Agency
              </span>
            </h1>
            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-300'>
              Start your own freight brokerage business with our complete guide
              to licensing, bonding, training, and technology setup. Join the
              growing network of successful freight brokers.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/launchpad'
                className='rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl'
              >
                Get Broker License
              </Link>
              <Link
                href='/brokers/become-freight-agency#steps'
                className='rounded-lg border-2 border-emerald-400 bg-transparent px-8 py-4 text-lg font-semibold text-emerald-400 transition-all duration-300 hover:bg-emerald-400 hover:text-white'
              >
                View Requirements
              </Link>
            </div>
          </div>

          {/* Key Stats */}
          <div className='mb-16 grid grid-cols-2 gap-8 md:grid-cols-4'>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-emerald-400'>
                $150K
              </div>
              <div className='text-gray-400'>Average First Year</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-teal-400'>30%</div>
              <div className='text-gray-400'>Profit Margin</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-blue-400'>6-8</div>
              <div className='text-gray-400'>Weeks to Launch</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-purple-400'>
                $5K-15K
              </div>
              <div className='text-gray-400'>Startup Costs</div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Guide */}
        <section id='steps' className='container mx-auto px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              6 Steps to Become a Freight Broker
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Follow our proven process to start your freight brokerage business
            </p>
          </div>

          <div className='mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {steps.map((step, index) => (
              <div
                key={index}
                className='rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/70'
              >
                <div className='mb-4 flex items-center justify-between'>
                  <div className='text-2xl'>{step.icon}</div>
                  <span className='text-lg font-bold text-emerald-400'>
                    Step {step.step}
                  </span>
                </div>
                <h3 className='mb-2 text-lg font-bold text-white'>
                  {step.title}
                </h3>
                <p className='mb-3 text-sm text-gray-300'>{step.description}</p>
                <div className='flex justify-between text-xs text-gray-400'>
                  <span>Time: {step.time}</span>
                  <span>Cost: {step.cost}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Requirements Checklist */}
          <div className='rounded-2xl border border-slate-700 bg-slate-800/30 p-8 backdrop-blur-sm'>
            <h3 className='mb-6 text-center text-2xl font-bold text-white'>
              Licensing Requirements
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {requirements.map((requirement, index) => (
                <div
                  key={index}
                  className='flex items-center space-x-3 rounded-lg border border-emerald-600/20 bg-emerald-600/10 p-4'
                >
                  <span className='text-emerald-400'>✓</span>
                  <span className='text-sm text-gray-300'>{requirement}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Profit Potential */}
        <section className='container mx-auto bg-slate-900/50 px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Profit Potential by Revenue Level
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Realistic profit projections for freight brokerage businesses
            </p>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50'>
              <thead className='bg-slate-700'>
                <tr>
                  <th className='px-6 py-4 text-left text-white'>
                    Annual Revenue
                  </th>
                  <th className='px-6 py-4 text-center text-white'>
                    Operating Expenses
                  </th>
                  <th className='px-6 py-4 text-center text-white'>
                    Net Profit
                  </th>
                  <th className='px-6 py-4 text-center text-white'>
                    Profit Margin
                  </th>
                </tr>
              </thead>
              <tbody>
                {profitMargins.map((row, index) => (
                  <tr key={index} className='border-t border-slate-600'>
                    <td className='px-6 py-4 font-semibold text-emerald-400'>
                      {row.revenue}
                    </td>
                    <td className='px-6 py-4 text-center text-gray-300'>
                      {row.expenses}
                    </td>
                    <td className='px-6 py-4 text-center font-bold text-green-400'>
                      {row.profit}
                    </td>
                    <td className='px-6 py-4 text-center font-bold text-blue-400'>
                      {row.margin}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* LaunchPad Services */}
        <section className='container mx-auto px-4 py-16'>
          <div className='rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 md:p-12'>
            <div className='mb-8 text-center'>
              <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
                Fast-Track Your Success with LaunchPad℠
              </h2>
              <p className='mx-auto max-w-2xl text-lg text-emerald-100'>
                Our comprehensive business launch service handles everything
                from licensing to technology setup, so you can focus on growing
                your brokerage business.
              </p>
            </div>

            <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
              <div className='text-center'>
                <div className='mb-2 text-3xl'>📋</div>
                <h3 className='mb-2 font-bold text-white'>
                  Complete Licensing
                </h3>
                <p className='text-sm text-emerald-100'>
                  We handle all FMCSA paperwork and bonding
                </p>
              </div>
              <div className='text-center'>
                <div className='mb-2 text-3xl'>🎓</div>
                <h3 className='mb-2 font-bold text-white'>
                  Professional Training
                </h3>
                <p className='text-sm text-emerald-100'>
                  60 days of expert coaching and mentorship
                </p>
              </div>
              <div className='text-center'>
                <div className='mb-2 text-3xl'>🚀</div>
                <h3 className='mb-2 font-bold text-white'>Technology Setup</h3>
                <p className='text-sm text-emerald-100'>
                  Complete TMS platform and carrier network
                </p>
              </div>
            </div>

            <div className='text-center'>
              <Link
                href='/launchpad/broker'
                className='inline-block rounded-lg bg-white px-8 py-4 text-lg font-semibold text-emerald-600 shadow-lg transition-all duration-300 hover:bg-gray-100'
              >
                Start Your Brokerage - $999
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className='container mx-auto px-4 py-16'>
          <div className='mx-auto max-w-3xl'>
            <h2 className='mb-8 text-center text-3xl font-bold text-white'>
              Frequently Asked Questions
            </h2>
            <div className='space-y-6'>
              <div className='rounded-lg border border-slate-700 bg-slate-800/50 p-6'>
                <h3 className='mb-2 text-lg font-semibold text-white'>
                  How long does it take to become a licensed freight broker?
                </h3>
                <p className='text-gray-300'>
                  Typically 6-8 weeks from start to finish, including licensing,
                  bonding, and business setup. With our LaunchPad service, we
                  can accelerate this to 4-6 weeks.
                </p>
              </div>
              <div className='rounded-lg border border-slate-700 bg-slate-800/50 p-6'>
                <h3 className='mb-2 text-lg font-semibold text-white'>
                  What are the ongoing costs of running a freight brokerage?
                </h3>
                <p className='text-gray-300'>
                  Monthly costs include TMS software ($500-2,000), insurance
                  ($500-1,000), bonding renewal ($500-1,000), and marketing
                  ($500-2,000).
                </p>
              </div>
              <div className='rounded-lg border border-slate-700 bg-slate-800/50 p-6'>
                <h3 className='mb-2 text-lg font-semibold text-white'>
                  Do I need prior transportation experience?
                </h3>
                <p className='text-gray-300'>
                  Yes, FMCSA requires at least 2 years of experience in
                  transportation or logistics. This can include sales,
                  operations, or related business experience.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
