'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function GovernmentContractsPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const governmentServices = [
    {
      id: 'federal-transportation',
      title: '🏛️ Federal Transportation Services',
      description:
        'Comprehensive transportation solutions for federal agencies',
      capabilities: [
        'Inter-agency freight coordination',
        'Secure cargo transportation',
        'Emergency logistics support',
        'Multi-modal transportation planning',
        'Government compliance management',
      ],
      naicsCodes: ['484', '485', '486', '487', '488'],
      certifications: ['WOSB', 'Small Business', 'Diverse Supplier'],
    },
    {
      id: 'defense-logistics',
      title: '🛡️ Defense & Military Logistics',
      description: 'Specialized logistics support for defense operations',
      capabilities: [
        'Military equipment transportation',
        'Base-to-base logistics coordination',
        'Expedited defense shipping',
        'Classified cargo handling protocols',
        'Defense contractor support',
      ],
      naicsCodes: ['484110', '484220', '484230'],
      certifications: ['WOSB', 'Security Clearance Ready'],
    },
    {
      id: 'emergency-response',
      title: '🚨 Emergency Response Transportation',
      description: 'Rapid response transportation for government emergencies',
      capabilities: [
        'Disaster relief logistics',
        'Emergency supply distribution',
        '24/7 rapid response capability',
        'Crisis coordination support',
        'FEMA partnership ready',
      ],
      naicsCodes: ['492110', '493110'],
      certifications: ['WOSB', 'Emergency Response Certified'],
    },
    {
      id: 'healthcare-logistics',
      title: '🏥 Government Healthcare Logistics',
      description: 'Medical transportation and healthcare logistics',
      capabilities: [
        'Medical equipment transportation',
        'Pharmaceutical logistics',
        'VA hospital supply chain',
        'Temperature-controlled transport',
        'Medical waste transportation',
      ],
      naicsCodes: ['484122', '493190'],
      certifications: ['WOSB', 'Healthcare Compliance'],
    },
  ];

  const wosbAdvantages = [
    {
      icon: '⚡',
      title: 'Set-Aside Contract Eligibility',
      description:
        'Access to WOSB set-aside contracts with reduced competition',
    },
    {
      icon: '🎯',
      title: 'Direct Government Access',
      description: 'Direct relationship building with contracting officers',
    },
    {
      icon: '📊',
      title: 'Streamlined Procurement',
      description:
        'Simplified procurement processes for small business contracts',
    },
    {
      icon: '🤝',
      title: 'Partnership Opportunities',
      description: 'Subcontracting opportunities with large prime contractors',
    },
  ];

  const contractTypes = [
    {
      type: 'Sources Sought Responses',
      description: 'Strategic responses to government market research',
      timeline: '30-60 days',
      value: 'Up to $250K',
    },
    {
      type: 'Small Business Set-Asides',
      description: 'Contracts reserved exclusively for small businesses',
      timeline: '60-120 days',
      value: '$250K - $7M',
    },
    {
      type: 'WOSB Set-Asides',
      description: 'Contracts specifically for women-owned businesses',
      timeline: '45-90 days',
      value: '$250K - $5M',
    },
    {
      type: 'Subcontracting',
      description: 'Partnership opportunities with prime contractors',
      timeline: '30-90 days',
      value: 'Varies',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
      {/* Header Section */}
      <div className='bg-gradient-to-r from-blue-900 to-blue-700 py-16 text-white'>
        <div className='mx-auto max-w-7xl px-6 text-center'>
          <div className='mb-4'>
            <span className='inline-block rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white'>
              ✅ WOSB CERTIFIED
            </span>
          </div>
          <h1 className='mb-6 text-4xl font-bold md:text-6xl'>
            Government Contracting Services
          </h1>
          <p className='mx-auto mb-8 max-w-4xl text-xl text-blue-100 md:text-2xl'>
            FleetFlow LLC - Women Owned Small Business providing specialized
            transportation management solutions for federal agencies and
            government contracts
          </p>
          <div className='flex flex-wrap justify-center gap-4 text-sm'>
            <div className='rounded-lg bg-blue-800 px-4 py-2'>
              🏛️ Federal Agencies
            </div>
            <div className='rounded-lg bg-blue-800 px-4 py-2'>
              🛡️ Defense Contractors
            </div>
            <div className='rounded-lg bg-blue-800 px-4 py-2'>
              🚨 Emergency Response
            </div>
            <div className='rounded-lg bg-blue-800 px-4 py-2'>
              🏥 Healthcare Systems
            </div>
          </div>
        </div>
      </div>

      {/* WOSB Certification Section */}
      <div className='bg-green-50 py-16'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-gray-900 md:text-4xl'>
              Women Owned Small Business Certified
            </h2>
            <p className='mx-auto max-w-3xl text-xl text-gray-600'>
              FleetFlow LLC is officially certified as a Women Owned Small
              Business (WOSB) by the Small Business Administration, providing
              unique advantages in government contracting opportunities.
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
            {wosbAdvantages.map((advantage, index) => (
              <div key={index} className='rounded-lg bg-white p-6 shadow-md'>
                <div className='mb-4 text-3xl'>{advantage.icon}</div>
                <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                  {advantage.title}
                </h3>
                <p className='text-gray-600'>{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Government Services Section */}
      <div className='py-16'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-gray-900 md:text-4xl'>
              Government Transportation Services
            </h2>
            <p className='mx-auto max-w-3xl text-xl text-gray-600'>
              Comprehensive transportation solutions designed specifically for
              government agencies and federal contractors
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2'>
            {governmentServices.map((service) => (
              <div
                key={service.id}
                className={`cursor-pointer rounded-lg bg-white p-8 shadow-md transition-all duration-300 hover:shadow-lg ${
                  selectedService === service.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() =>
                  setSelectedService(
                    selectedService === service.id ? null : service.id
                  )
                }
              >
                <h3 className='mb-3 text-xl font-bold text-gray-900'>
                  {service.title}
                </h3>
                <p className='mb-4 text-gray-600'>{service.description}</p>

                <div className='mb-4'>
                  <h4 className='mb-2 font-semibold text-gray-800'>
                    Core Capabilities:
                  </h4>
                  <ul className='space-y-1 text-sm text-gray-600'>
                    {service.capabilities.map((capability, index) => (
                      <li key={index} className='flex items-start'>
                        <span className='mr-2 text-green-500'>✓</span>
                        {capability}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className='mb-4 flex flex-wrap gap-2'>
                  {service.naicsCodes.map((code) => (
                    <span
                      key={code}
                      className='rounded bg-blue-100 px-2 py-1 text-xs text-blue-800'
                    >
                      NAICS {code}
                    </span>
                  ))}
                </div>

                <div className='flex flex-wrap gap-2'>
                  {service.certifications.map((cert) => (
                    <span
                      key={cert}
                      className='rounded bg-green-100 px-2 py-1 text-xs text-green-800'
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contract Types Section */}
      <div className='bg-gray-50 py-16'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-gray-900 md:text-4xl'>
              Contract Opportunities
            </h2>
            <p className='mx-auto max-w-3xl text-xl text-gray-600'>
              WOSB certification provides access to various government
              contracting opportunities
            </p>
          </div>

          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {contractTypes.map((contract, index) => (
              <div key={index} className='rounded-lg bg-white p-6 shadow-md'>
                <h3 className='mb-3 text-lg font-semibold text-gray-900'>
                  {contract.type}
                </h3>
                <p className='mb-4 text-sm text-gray-600'>
                  {contract.description}
                </p>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Timeline:</span>
                    <span className='font-medium'>{contract.timeline}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Value:</span>
                    <span className='font-medium'>{contract.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SAM.gov Integration Section */}
      <div className='py-16'>
        <div className='mx-auto max-w-7xl px-6'>
          <div className='rounded-lg bg-blue-900 p-8 text-white'>
            <div className='text-center'>
              <h2 className='mb-4 text-3xl font-bold'>
                Active SAM.gov Integration
              </h2>
              <p className='mx-auto mb-8 max-w-3xl text-xl text-blue-100'>
                FleetFlow actively monitors government contracting opportunities
                through SAM.gov integration, ensuring we never miss relevant
                transportation contracts.
              </p>

              <div className='mb-8 grid gap-8 md:grid-cols-3'>
                <div className='text-center'>
                  <div className='mb-2 text-4xl'>📊</div>
                  <h3 className='mb-2 text-lg font-semibold'>200+ POCs</h3>
                  <p className='text-sm text-blue-100'>
                    Government contracting officers contacted monthly
                  </p>
                </div>
                <div className='text-center'>
                  <div className='mb-2 text-4xl'>📝</div>
                  <h3 className='mb-2 text-lg font-semibold'>100+ Responses</h3>
                  <p className='text-sm text-blue-100'>
                    Sources Sought responses submitted annually
                  </p>
                </div>
                <div className='text-center'>
                  <div className='mb-2 text-4xl'>🎯</div>
                  <h3 className='mb-2 text-lg font-semibold'>$525K Pipeline</h3>
                  <p className='text-sm text-blue-100'>
                    Active government contract opportunities
                  </p>
                </div>
              </div>

              <Link
                href='/contact?ref=government-contracts'
                className='inline-block rounded-lg bg-white px-8 py-3 font-semibold text-blue-900 transition-colors hover:bg-blue-50'
              >
                Schedule Government Contracting Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className='bg-gradient-to-r from-green-600 to-blue-600 py-16 text-white'>
        <div className='mx-auto max-w-4xl px-6 text-center'>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
            Ready to Work with Government Agencies?
          </h2>
          <p className='mb-8 text-xl text-green-100'>
            Partner with a certified WOSB for your transportation management
            needs. Access exclusive government contracting opportunities and
            streamlined procurement processes.
          </p>
          <div className='flex flex-col justify-center gap-4 md:flex-row'>
            <Link
              href='/contact?ref=government-rfi'
              className='rounded-lg bg-white px-8 py-3 font-semibold text-blue-900 transition-colors hover:bg-blue-50'
            >
              Request Information
            </Link>
            <Link
              href='/plans?ref=government-pricing'
              className='rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-blue-900'
            >
              View Government Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
