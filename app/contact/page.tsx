import { Metadata } from 'next';
import Script from 'next/script';
import Breadcrumb from '../components/Breadcrumb';
import { generateBreadcrumbStructuredData } from '../lib/seo';

export const metadata: Metadata = {
  title: 'Contact FleetFlow - Get in Touch with Transportation Experts',
  description:
    'Contact FleetFlow for transportation management solutions, freight brokerage services, and TMS platform support. Connect with our team of logistics experts.',
  keywords: [
    'contact FleetFlow',
    'TMS support',
    'freight brokerage contact',
    'transportation management support',
    'logistics platform help',
    'customer service',
    'sales contact',
    'technical support',
    'freight software support',
    'logistics consultation',
    'transportation experts',
  ],
  openGraph: {
    title: 'Contact FleetFlow - Get in Touch with Transportation Experts',
    description:
      'Contact FleetFlow for transportation management solutions, freight brokerage services, and TMS platform support.',
    url: 'https://fleetflowapp.com/contact',
    siteName: 'FleetFlow™',
    type: 'website',
    images: [
      {
        url: '/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact FleetFlow Support Team',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact FleetFlow - Transportation Management Support',
    description:
      'Contact FleetFlow for TMS platform support and logistics consultation.',
    images: ['/og-contact.jpg'],
  },
  alternates: {
    canonical: '/contact',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const contactMethods = [
  {
    title: 'Sales Inquiries',
    description: 'Ready to transform your transportation operations?',
    email: 'sales@fleetflowapp.com',
    phone: '+1-555-FLEETFLOW',
    icon: '📈',
  },
  {
    title: 'Technical Support',
    description: 'Need help with our TMS platform?',
    email: 'support@fleetflowapp.com',
    phone: '+1-555-FLEETFLOW',
    icon: '🛠️',
  },
  {
    title: 'Partnership Opportunities',
    description: 'Interested in partnering with FleetFlow?',
    email: 'partnerships@fleetflowapp.com',
    phone: '+1-555-FLEETFLOW',
    icon: '🤝',
  },
  {
    title: 'General Inquiries',
    description: 'Questions about our services?',
    email: 'info@fleetflowapp.com',
    phone: '+1-555-FLEETFLOW',
    icon: '💬',
  },
];

const locations = [
  {
    city: 'Corporate Headquarters',
    address: '123 Transportation Way',
    cityState: 'Dallas, TX 75201',
    phone: '+1-555-FLEETFLOW',
    email: 'info@fleetflowapp.com',
  },
  {
    city: 'West Coast Office',
    address: '456 Logistics Blvd',
    cityState: 'Los Angeles, CA 90210',
    phone: '+1-555-FLEETFLOW',
    email: 'west@fleetflowapp.com',
  },
  {
    city: 'East Coast Office',
    address: '789 Freight Street',
    cityState: 'Atlanta, GA 30301',
    phone: '+1-555-FLEETFLOW',
    email: 'east@fleetflowapp.com',
  },
];

export default function ContactPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Contact', current: true },
  ];

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact' },
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

      {/* Contact Page Structured Data */}
      <Script
        id='contact-structured-data'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'FleetFlow Contact Page',
            description:
              'Contact information for FleetFlow Transportation Management System',
            url: 'https://fleetflowapp.com/contact',
            mainEntity: {
              '@type': 'Organization',
              name: 'FleetFlow LLC',
              contactPoint: [
                {
                  '@type': 'ContactPoint',
                  telephone: '+1-555-FLEETFLOW',
                  contactType: 'sales',
                  email: 'sales@fleetflowapp.com',
                },
                {
                  '@type': 'ContactPoint',
                  telephone: '+1-555-FLEETFLOW',
                  contactType: 'technical support',
                  email: 'support@fleetflowapp.com',
                },
              ],
            },
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
              Contact Our
              <span className='block bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent'>
                Transportation Experts
              </span>
            </h1>
            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-300'>
              Ready to optimize your transportation operations? Get in touch
              with our team of logistics experts. We're here to help you succeed
              in the competitive freight industry.
            </p>
          </div>

          {/* Contact Methods */}
          <div className='mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className='rounded-xl border border-slate-700 bg-slate-800/50 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:bg-slate-800/70'
              >
                <div className='mb-4 text-3xl'>{method.icon}</div>
                <h3 className='mb-2 text-lg font-semibold text-white'>
                  {method.title}
                </h3>
                <p className='mb-4 text-sm text-gray-400'>
                  {method.description}
                </p>
                <div className='space-y-2'>
                  <a
                    href={`mailto:${method.email}`}
                    className='block text-sm text-blue-400 transition-colors hover:text-blue-300'
                  >
                    {method.email}
                  </a>
                  <a
                    href={`tel:${method.phone}`}
                    className='block text-sm text-blue-400 transition-colors hover:text-blue-300'
                  >
                    {method.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Office Locations */}
          <div className='mb-16 rounded-2xl border border-slate-700 bg-slate-800/30 p-8 backdrop-blur-sm'>
            <h2 className='mb-8 text-center text-2xl font-bold text-white'>
              Our Locations
            </h2>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              {locations.map((location, index) => (
                <div key={index} className='text-center'>
                  <h3 className='mb-3 text-lg font-semibold text-white'>
                    {location.city}
                  </h3>
                  <div className='space-y-1 text-sm text-gray-400'>
                    <p>{location.address}</p>
                    <p>{location.cityState}</p>
                    <p>
                      <a
                        href={`tel:${location.phone}`}
                        className='text-blue-400 hover:text-blue-300'
                      >
                        {location.phone}
                      </a>
                    </p>
                    <p>
                      <a
                        href={`mailto:${location.email}`}
                        className='text-blue-400 hover:text-blue-300'
                      >
                        {location.email}
                      </a>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Contact Form */}
          <div className='mx-auto max-w-2xl rounded-2xl border border-slate-700 bg-slate-800/50 p-8 backdrop-blur-sm'>
            <h2 className='mb-6 text-center text-2xl font-bold text-white'>
              Send Us a Message
            </h2>
            <form className='space-y-6'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-300'>
                    First Name
                  </label>
                  <input
                    type='text'
                    className='w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    placeholder='Your first name'
                  />
                </div>
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-300'>
                    Last Name
                  </label>
                  <input
                    type='text'
                    className='w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    placeholder='Your last name'
                  />
                </div>
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-300'>
                  Email
                </label>
                <input
                  type='email'
                  className='w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  placeholder='your.email@company.com'
                />
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-300'>
                  Company
                </label>
                <input
                  type='text'
                  className='w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  placeholder='Your company name'
                />
              </div>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-300'>
                  Message
                </label>
                <textarea
                  rows={4}
                  className='w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  placeholder='Tell us about your transportation needs...'
                />
              </div>
              <button
                type='submit'
                className='w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl'
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}
