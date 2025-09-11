import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import Breadcrumb from '../../components/Breadcrumb';
import { generateBreadcrumbStructuredData } from '../../lib/seo';

export const metadata: Metadata = {
  title: 'How to Become a Dispatcher - Complete Guide to Dispatcher Career',
  description:
    'Learn how to become a dispatcher with our complete guide. Dispatcher training, certification requirements, job responsibilities, and career advancement in transportation dispatching.',
  keywords: [
    'how to become a dispatcher',
    'dispatcher training',
    'dispatcher certification',
    'transportation dispatcher',
    'freight dispatcher',
    'dispatcher career',
    'dispatcher job requirements',
    'dispatcher training program',
    'become freight dispatcher',
    'dispatcher certification course',
    'dispatcher skills training',
    'dispatcher career path',
  ],
  openGraph: {
    title: 'How to Become a Dispatcher - Complete Guide to Dispatcher Career',
    description:
      'Learn how to become a dispatcher with our complete guide. Dispatcher training, certification requirements, and career advancement.',
    url: 'https://fleetflowapp.com/dispatchers/become-dispatcher',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-become-dispatcher.jpg',
        width: 1200,
        height: 630,
        alt: 'How to Become a Dispatcher - Complete Career Guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Become a Dispatcher - Complete Career Guide',
    description:
      'Learn how to become a dispatcher with training and certification requirements.',
    images: ['/og-become-dispatcher.jpg'],
  },
  alternates: {
    canonical: '/dispatchers/become-dispatcher',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const careerSteps = [
  {
    step: '1',
    title: 'Education & Basic Requirements',
    description: 'High school diploma or equivalent, basic computer skills',
    details: [
      'High school diploma/GED',
      'Basic computer literacy',
      'Strong communication skills',
      'Problem-solving ability',
    ],
    time: 'Immediate',
    icon: '🎓',
  },
  {
    step: '2',
    title: 'Gain Transportation Experience',
    description: 'Entry-level position in transportation or logistics',
    details: [
      'Customer service experience',
      'Administrative assistant',
      'Warehouse associate',
      'Office coordinator',
    ],
    time: '3-6 months',
    icon: '🚚',
  },
  {
    step: '3',
    title: 'Complete Dispatcher Training',
    description: 'Formal training program or on-the-job training',
    details: [
      'TMS software training',
      'Industry regulations',
      'Communication protocols',
      'Safety procedures',
    ],
    time: '1-3 months',
    icon: '📚',
  },
  {
    step: '4',
    title: 'Get Certified',
    description: 'Industry certifications to advance your career',
    details: [
      'CDL knowledge',
      'Hazardous materials',
      'Safety certifications',
      'Industry-specific credentials',
    ],
    time: '2-6 months',
    icon: '📜',
  },
  {
    step: '5',
    title: 'Advance Your Career',
    description: 'Specialize and move up in dispatcher roles',
    details: [
      'Senior dispatcher',
      'Dispatch supervisor',
      'Operations manager',
      'Logistics coordinator',
    ],
    time: '1-3 years',
    icon: '📈',
  },
];

const requiredSkills = [
  'Excellent communication skills',
  'Problem-solving abilities',
  'Multi-tasking capabilities',
  'Customer service orientation',
  'Basic computer skills',
  'Time management',
  'Stress management',
  'Attention to detail',
  'Team collaboration',
  'Decision making under pressure',
];

const salaryRanges = [
  {
    level: 'Entry Level Dispatcher',
    salary: '$35,000 - $45,000',
    experience: '0-2 years',
  },
  {
    level: 'Experienced Dispatcher',
    salary: '$45,000 - $60,000',
    experience: '2-5 years',
  },
  {
    level: 'Senior Dispatcher',
    salary: '$60,000 - $75,000',
    experience: '5+ years',
  },
  {
    level: 'Dispatch Supervisor',
    salary: '$70,000 - $90,000',
    experience: '7+ years',
  },
];

export default function BecomeDispatcherPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Dispatchers', href: '/dispatch' },
    { label: 'Become Dispatcher', current: true },
  ];

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Dispatchers', url: '/dispatch' },
    { name: 'Become Dispatcher', url: '/dispatchers/become-dispatcher' },
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

      {/* FAQ Schema for "How to become a dispatcher" */}
      <Script
        id='dispatcher-faq-schema'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How do I become a freight dispatcher?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'To become a freight dispatcher, start with a high school diploma, gain transportation experience, complete dispatcher training, get certified, and advance your career through experience and specialization.',
                },
              },
              {
                '@type': 'Question',
                name: 'What education do I need to become a dispatcher?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'A high school diploma or equivalent is typically required. Some positions may prefer associate degrees in logistics, transportation, or business administration.',
                },
              },
              {
                '@type': 'Question',
                name: 'How much do dispatchers make?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Entry-level dispatchers earn $35,000-$45,000 annually. Experienced dispatchers can earn $45,000-$75,000, and senior positions can reach $90,000+ with experience.',
                },
              },
              {
                '@type': 'Question',
                name: 'What skills do I need to be a dispatcher?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Key skills include communication, problem-solving, multi-tasking, customer service, computer skills, time management, and the ability to work under pressure.',
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
              How to Become a
              <span className='block bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent'>
                Freight Dispatcher
              </span>
            </h1>
            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-300'>
              Complete guide to starting your career as a freight dispatcher.
              Learn the requirements, training, certification, and career
              advancement opportunities.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/university'
                className='rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-teal-700 hover:to-cyan-700 hover:shadow-xl'
              >
                Start Dispatcher Training
              </Link>
              <Link
                href='#steps'
                className='rounded-lg border-2 border-teal-400 bg-transparent px-8 py-4 text-lg font-semibold text-teal-400 transition-all duration-300 hover:bg-teal-400 hover:text-white'
              >
                View Career Path
              </Link>
            </div>
          </div>

          {/* Career Overview Stats */}
          <div className='mb-16 grid grid-cols-2 gap-8 md:grid-cols-4'>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-teal-400'>$55K</div>
              <div className='text-gray-400'>Average Salary</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-cyan-400'>3-6</div>
              <div className='text-gray-400'>Months Training</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-blue-400'>15%</div>
              <div className='text-gray-400'>Job Growth Rate</div>
            </div>
            <div className='text-center'>
              <div className='mb-2 text-3xl font-bold text-green-400'>24/7</div>
              <div className='text-gray-400'>Operations</div>
            </div>
          </div>
        </section>

        {/* Career Steps */}
        <section id='steps' className='container mx-auto px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              5 Steps to Become a Freight Dispatcher
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Your complete roadmap from entry-level to professional dispatcher
            </p>
          </div>

          <div className='mb-16 grid grid-cols-1 gap-6 lg:grid-cols-5'>
            {careerSteps.map((step, index) => (
              <div
                key={index}
                className='rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/70'
              >
                <div className='mb-3 text-2xl'>{step.icon}</div>
                <div className='mb-2 text-lg font-bold text-teal-400'>
                  Step {step.step}
                </div>
                <h3 className='mb-2 font-semibold text-white'>{step.title}</h3>
                <p className='mb-3 text-sm text-gray-300'>{step.description}</p>
                <div className='mb-3 text-xs font-medium text-cyan-400'>
                  {step.time}
                </div>
                <ul className='space-y-1'>
                  {step.details.map((detail, detailIndex) => (
                    <li
                      key={detailIndex}
                      className='flex items-center text-xs text-gray-400'
                    >
                      <span className='mr-1 text-teal-400'>•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Required Skills */}
          <div className='mb-16 rounded-2xl border border-slate-700 bg-slate-800/30 p-8 backdrop-blur-sm'>
            <h3 className='mb-6 text-center text-2xl font-bold text-white'>
              Essential Dispatcher Skills
            </h3>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-5'>
              {requiredSkills.map((skill, index) => (
                <div
                  key={index}
                  className='rounded-lg border border-teal-600/30 bg-teal-600/20 p-4 text-center'
                >
                  <div className='text-sm font-semibold text-teal-400'>
                    {skill}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Salary Information */}
          <div className='mb-16 rounded-xl border border-slate-700 bg-slate-800/50 p-6'>
            <h3 className='mb-6 text-center text-xl font-bold text-white'>
              Dispatcher Salary Ranges
            </h3>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-slate-600'>
                    <th className='px-4 py-3 text-left text-white'>
                      Position Level
                    </th>
                    <th className='px-4 py-3 text-center text-white'>
                      Annual Salary
                    </th>
                    <th className='px-4 py-3 text-center text-white'>
                      Experience Required
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salaryRanges.map((range, index) => (
                    <tr key={index} className='border-b border-slate-700'>
                      <td className='px-4 py-3 text-gray-300'>{range.level}</td>
                      <td className='px-4 py-3 text-center font-semibold text-teal-400'>
                        {range.salary}
                      </td>
                      <td className='px-4 py-3 text-center text-gray-400'>
                        {range.experience}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Training Programs */}
        <section className='container mx-auto bg-slate-900/50 px-4 py-16'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Dispatcher Training Programs
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-300'>
              Professional training to accelerate your dispatcher career
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {[
              {
                title: 'FleetFlow University',
                duration: '3 months',
                features: [
                  'Complete TMS training',
                  'Industry certification',
                  'Job placement assistance',
                  'Ongoing support',
                ],
                price: '$2,500',
                icon: '🎓',
              },
              {
                title: 'Professional Dispatcher Course',
                duration: '6 weeks',
                features: [
                  'Core dispatching skills',
                  'Software proficiency',
                  'Regulatory compliance',
                  'Practical exercises',
                ],
                price: '$1,200',
                icon: '📋',
              },
              {
                title: 'Advanced Dispatcher Program',
                duration: '2 months',
                features: [
                  'Senior dispatcher skills',
                  'Team management',
                  'Complex load optimization',
                  'Leadership training',
                ],
                price: '$3,800',
                icon: '⭐',
              },
            ].map((program, index) => (
              <div
                key={index}
                className='rounded-lg border border-slate-700 bg-slate-800/50 p-6'
              >
                <div className='mb-3 text-3xl'>{program.icon}</div>
                <h3 className='mb-2 text-lg font-semibold text-white'>
                  {program.title}
                </h3>
                <div className='mb-3 text-sm font-medium text-teal-400'>
                  {program.duration}
                </div>
                <div className='mb-4 font-bold text-cyan-400'>
                  {program.price}
                </div>
                <ul className='mb-4 space-y-1'>
                  {program.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className='flex items-center text-sm text-gray-400'
                    >
                      <span className='mr-2 text-teal-400'>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className='w-full rounded-lg bg-teal-600 px-4 py-2 font-medium text-white transition-colors hover:bg-teal-700'>
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Job Responsibilities */}
        <section className='container mx-auto px-4 py-16'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
            <div>
              <h2 className='mb-6 text-3xl font-bold text-white'>
                Dispatcher Job Responsibilities
              </h2>
              <ul className='space-y-3'>
                {[
                  'Coordinate load assignments and driver schedules',
                  'Communicate with carriers, shippers, and drivers',
                  'Track shipments and provide real-time updates',
                  'Resolve issues and handle customer complaints',
                  'Optimize routes and improve efficiency',
                  'Maintain accurate records and documentation',
                  'Ensure compliance with regulations and safety standards',
                  'Process invoices and manage billing',
                ].map((responsibility, index) => (
                  <li key={index} className='flex items-start text-gray-300'>
                    <span className='mt-1 mr-3 text-teal-400'>•</span>
                    {responsibility}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className='mb-6 text-3xl font-bold text-white'>
                Work Environment
              </h2>
              <div className='space-y-4'>
                <div className='rounded-lg border border-slate-700 bg-slate-800/50 p-4'>
                  <h3 className='mb-2 font-semibold text-white'>Schedule</h3>
                  <p className='text-sm text-gray-400'>
                    Most dispatchers work 24/7 shifts including nights,
                    weekends, and holidays. Shift work is common in the
                    transportation industry.
                  </p>
                </div>
                <div className='rounded-lg border border-slate-700 bg-slate-800/50 p-4'>
                  <h3 className='mb-2 font-semibold text-white'>
                    Work Setting
                  </h3>
                  <p className='text-sm text-gray-400'>
                    Office environment with computer systems, multiple phone
                    lines, and constant communication with drivers and
                    customers.
                  </p>
                </div>
                <div className='rounded-lg border border-slate-700 bg-slate-800/50 p-4'>
                  <h3 className='mb-2 font-semibold text-white'>
                    Stress Level
                  </h3>
                  <p className='text-sm text-gray-400'>
                    High-stress role requiring quick decision-making,
                    multi-tasking, and handling urgent situations calmly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='container mx-auto px-4 py-16'>
          <div className='rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 p-8 text-center md:p-12'>
            <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
              Start Your Dispatcher Career Today
            </h2>
            <p className='mx-auto mb-8 max-w-2xl text-lg text-teal-100'>
              Join the growing field of freight dispatching with our
              comprehensive training programs. Get certified, gain experience,
              and advance your career in transportation logistics.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/university'
                className='rounded-lg bg-white px-8 py-4 text-lg font-semibold text-teal-600 shadow-lg transition-all duration-300 hover:bg-gray-100'
              >
                Enroll in Training
              </Link>
              <Link
                href='/contact'
                className='rounded-lg border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-teal-600'
              >
                Get Career Advice
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
