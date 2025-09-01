'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { FleetFlowAppVideo } from './FleetFlowAppVideo';
import Logo from './Logo';

interface DemoBookingForm {
  name: string;
  email: string;
  company: string;
  phone: string;
  fleetSize: string;
  message: string;
}

export default function FleetFlowLandingPageMobile() {
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoForm, setDemoForm] = useState<DemoBookingForm>({
    name: '',
    email: '',
    company: '',
    phone: '',
    fleetSize: '',
    message: '',
  });

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.info('Demo booking submitted:', demoForm);
    alert(
      'Thank you! We will contact you within 24 hours to schedule your enterprise demo.'
    );
    setShowDemoForm(false);
    setDemoForm({
      name: '',
      email: '',
      company: '',
      phone: '',
      fleetSize: '',
      message: '',
    });
  };

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white'>
      {/* Mobile-Optimized Header */}
      <div className='fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-slate-50/95 backdrop-blur-lg'>
        <div className='px-4 py-3 sm:px-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <div className='hidden items-center gap-3 md:flex'>
              <Link href='/go-with-the-flow'>
                <button className='rounded-lg border-2 border-amber-500 bg-gradient-to-r from-blue-800 to-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:shadow-amber-500/50'>
                  🌊 GO WITH THE FLOW
                </button>
              </Link>
              <Link href='/fleetflowdash'>
                <button className='rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-blue-900'>
                  FLEETFLOWDASH
                </button>
              </Link>
              <Link href='/settings'>
                <button className='rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-green-700 hover:to-green-800'>
                  Settings
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='rounded-lg bg-white/20 p-2 md:hidden'
            >
              <svg
                className='h-6 w-6 text-gray-800'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                ) : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          <div
            className={`transition-all duration-300 md:hidden ${mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 overflow-hidden opacity-0'}`}
          >
            <div className='mt-3 space-y-3 rounded-lg bg-white/10 p-4 backdrop-blur-md'>
              <Link href='/go-with-the-flow'>
                <button className='w-full rounded-lg border border-amber-500 bg-gradient-to-r from-blue-800 to-blue-900 py-3 text-sm font-semibold text-white'>
                  🌊 GO WITH THE FLOW
                </button>
              </Link>
              <Link href='/fleetflowdash'>
                <button className='w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 py-3 text-sm font-semibold text-white'>
                  FLEETFLOWDASH
                </button>
              </Link>
              <Link href='/settings'>
                <button className='w-full rounded-lg bg-gradient-to-r from-green-600 to-green-700 py-3 text-sm font-semibold text-white'>
                  Settings
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='px-4 pt-20 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl'>
          {/* Hero Section - Mobile Optimized */}
          <div className='mb-12 text-center sm:mb-16'>
            <h1 className='mb-4 bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-3xl leading-tight font-bold text-transparent sm:text-4xl lg:text-5xl'>
              The Salesforce of Transportation
            </h1>

            <p className='mx-auto mb-8 max-w-4xl text-lg leading-relaxed text-white/80 sm:text-xl'>
              Complete AI-powered transportation management platform serving
              everyone from individual drivers to Fortune 500 enterprises.
            </p>

            {/* Mobile-Friendly CTA Buttons */}
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <button
                onClick={() => setShowDemoForm(true)}
                className='transform rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:scale-105 hover:from-blue-700 hover:to-blue-900'
              >
                Book Enterprise Demo
              </button>
              <Link href='/settings'>
                <button className='rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20'>
                  Platform Access
                </button>
              </Link>
            </div>
          </div>

          {/* App Video Section - Mobile Responsive */}
          <div className='mb-12 sm:mb-16'>
            <FleetFlowAppVideo />
          </div>

          {/* Go With the Flow Section - Mobile Optimized */}
          <div className='mb-12 sm:mb-16'>
            <div className='rounded-3xl border-2 border-amber-500 bg-white/10 p-6 shadow-2xl shadow-amber-500/20 backdrop-blur-xl sm:p-8'>
              <div className='mb-8 text-center'>
                <h2 className='mb-4 text-3xl font-bold text-amber-400 drop-shadow-lg sm:text-4xl'>
                  🌊 Go With the Flow
                </h2>
                <p className='mx-auto max-w-4xl text-lg leading-relaxed text-white sm:text-xl'>
                  An advanced{' '}
                  <span className='font-bold text-amber-400'>
                    instant marketplace
                  </span>{' '}
                  - connecting shippers and drivers in real-time with AI-powered
                  matching and dynamic pricing.
                </p>
              </div>

              {/* Mobile-Friendly Feature Cards */}
              <div className='mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2'>
                {/* For Shippers Card */}
                <div className='rounded-2xl border border-blue-500/40 bg-blue-500/20 p-6 backdrop-blur-md'>
                  <div className='mb-6 text-center'>
                    <div className='mb-3 text-4xl'>📦</div>
                    <h3 className='mb-4 text-xl font-bold text-blue-400'>
                      For Shippers
                    </h3>
                  </div>
                  <ul className='space-y-3 text-white'>
                    <li className='flex items-center'>
                      <span className='mr-3 text-green-400'>✓</span>
                      Request trucks instantly - no waiting
                    </li>
                    <li className='flex items-center'>
                      <span className='mr-3 text-green-400'>✓</span>
                      AI-powered fair pricing
                    </li>
                    <li className='flex items-center'>
                      <span className='mr-3 text-green-400'>✓</span>
                      Real-time driver matching
                    </li>
                    <li className='flex items-center'>
                      <span className='mr-3 text-green-400'>✓</span>
                      Live GPS tracking & updates
                    </li>
                    <li className='flex items-center'>
                      <span className='mr-3 text-green-400'>✓</span>
                      No long-term contracts required
                    </li>
                  </ul>
                </div>

                {/* For Drivers Card */}
                <div className='rounded-2xl border border-amber-500/40 bg-amber-500/20 p-6 backdrop-blur-md'>
                  <div className='mb-6 text-center'>
                    <div className='mb-3 text-4xl'>🚛</div>
                    <h3 className='mb-4 text-xl font-bold text-amber-400'>
                      For Drivers
                    </h3>
                  </div>
                  <ul className='space-y-3 text-white'>
                    <li className='flex items-center'>
                      <span className='mr-3 text-green-400'>✓</span>
                      Go online/offline instantly
                    </li>
                    <li className='flex items-center'>
                      <span className='mr-3 text-green-400'>✓</span>
                      Find high-paying loads nearby
                    </li>
                    <li className='flex items-center'>
                      <span className='mr-3 text-green-400'>✓</span>
                      Competitive market rates
                    </li>
                    <li className='flex items-center'>
                      <span className='mr-3 text-green-400'>✓</span>
                      Fast payment processing
                    </li>
                    <li className='flex items-center'>
                      <span className='mr-3 text-green-400'>✓</span>
                      Build your reputation & earnings
                    </li>
                  </ul>
                </div>
              </div>

              {/* AI Powered Section */}
              <div className='mb-8 rounded-2xl border border-green-500/40 bg-green-500/20 p-6 text-center backdrop-blur-md'>
                <h3 className='mb-3 text-xl font-bold text-green-400'>
                  🤖 Powered by Advanced AI
                </h3>
                <p className='leading-relaxed text-white'>
                  Our intelligent system analyzes market conditions, traffic
                  patterns, fuel costs, and demand in real-time to provide
                  optimal pricing and instant matching.
                </p>
              </div>

              {/* CTA Button */}
              <div className='text-center'>
                <Link href='/go-with-the-flow'>
                  <button className='transform rounded-xl border-2 border-amber-500 bg-gradient-to-r from-blue-800 to-blue-900 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-amber-500/30 transition-all hover:scale-105 hover:shadow-amber-500/50'>
                    🚀 Start Using Go With the Flow
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Professional Subscription Section - Mobile Optimized */}
          <div className='mb-12 sm:mb-16'>
            <div className='rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8'>
              <div className='mb-8 text-center sm:mb-12'>
                <h2 className='mb-6 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl'>
                  FleetFlow Business Intelligence
                </h2>
                <p className='mx-auto max-w-4xl text-lg leading-relaxed text-white/80 sm:text-xl'>
                  Individual subscriptions for transportation professionals.
                  <br className='hidden sm:block' />
                  <span className='font-bold text-amber-400'>
                    Start your 14-day free trial
                  </span>{' '}
                  - no credit card required.
                </p>
              </div>

              {/* Mobile-Responsive Pricing Cards */}
              <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
                {/* FleetFlow University Card */}
                <div className='rounded-2xl border-2 border-amber-500/30 bg-amber-500/10 p-6 text-center backdrop-blur-md'>
                  <div className='mb-4 text-4xl'>🎓</div>
                  <h3 className='mb-3 text-xl font-bold text-amber-400'>
                    FleetFlow University℠
                  </h3>
                  <div className='mb-4 text-3xl font-bold text-white'>
                    $49<span className='text-lg font-medium'>/month</span>
                  </div>
                  <ul className='space-y-2 text-sm text-white/90'>
                    <li>✓ Complete training curriculum</li>
                    <li>✓ BOL/MBL/HBL documentation</li>
                    <li>✓ Warehouse operations training</li>
                    <li>✓ Certification programs</li>
                    <li>✓ Industry best practices</li>
                  </ul>
                </div>

                {/* Professional Dispatcher Card */}
                <div className='rounded-2xl border-2 border-blue-500/30 bg-blue-500/10 p-6 text-center backdrop-blur-md'>
                  <div className='mb-4 text-4xl'>📋</div>
                  <h3 className='mb-3 text-xl font-bold text-blue-400'>
                    Professional Dispatcher
                  </h3>
                  <div className='mb-2 text-sm text-white/70'>Starting at</div>
                  <div className='mb-4 text-2xl font-bold text-white'>
                    $79<span className='text-lg font-medium'>/month</span>
                  </div>
                  <ul className='space-y-2 text-sm text-white/90'>
                    <li>✓ Complete dispatch management</li>
                    <li>✓ Driver assignment & tracking</li>
                    <li>✓ Route optimization</li>
                    <li>✓ CRM integration</li>
                    <li>✓ Basic AI automation</li>
                    <li className='font-semibold text-green-400'>
                      ✓ 50 phone minutes included
                    </li>
                    <li className='font-semibold text-green-400'>
                      ✓ 25 SMS messages included
                    </li>
                  </ul>
                </div>

                {/* Professional Brokerage Card - Most Popular */}
                <div className='relative rounded-2xl border-2 border-orange-500 bg-orange-500/10 p-6 text-center backdrop-blur-md md:col-span-2 xl:col-span-1'>
                  <div className='absolute -top-3 left-1/2 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-1 text-xs font-bold text-white'>
                    ⭐ Most Popular
                  </div>
                  <div className='mt-2 mb-4 text-4xl'>🏢</div>
                  <h3 className='mb-3 text-xl font-bold text-orange-400'>
                    Professional Brokerage
                  </h3>
                  <div className='mb-2 text-sm text-white/70'>Starting at</div>
                  <div className='mb-4 text-2xl font-bold text-white'>
                    $289<span className='text-lg font-medium'>/month</span>
                  </div>
                  <ul className='space-y-2 text-sm text-white/90'>
                    <li>✓ Advanced brokerage operations</li>
                    <li>✓ FreightFlow RFx platform</li>
                    <li>✓ Load & customer management</li>
                    <li>✓ Revenue analytics dashboard</li>
                    <li>✓ AI-powered optimization</li>
                    <li className='font-semibold text-green-400'>
                      ✓ 500 phone minutes included
                    </li>
                    <li className='font-semibold text-green-400'>
                      ✓ 200 SMS messages included
                    </li>
                    <li className='font-semibold text-green-400'>
                      ✓ Advanced call monitoring
                    </li>
                  </ul>
                </div>

                {/* Enterprise Professional Card */}
                <div className='rounded-2xl border-2 border-purple-500/30 bg-purple-500/10 p-6 text-center backdrop-blur-md'>
                  <div className='mb-4 text-4xl'>🌟</div>
                  <h3 className='mb-3 text-xl font-bold text-purple-400'>
                    Enterprise Professional
                  </h3>
                  <div className='mb-2 text-sm text-white/70'>Starting at</div>
                  <div className='mb-4 text-xl font-bold text-white'>
                    $2,698<span className='text-base font-medium'>/month</span>
                  </div>
                  <ul className='space-y-2 text-sm text-white/90'>
                    <li>✓ Complete platform access</li>
                    <li>✓ All premium features</li>
                    <li>✓ Advanced AI automation</li>
                    <li>✓ Priority support & training</li>
                    <li>✓ Custom integrations</li>
                    <li className='font-semibold text-green-400'>
                      ✓ Unlimited phone minutes
                    </li>
                    <li className='font-semibold text-green-400'>
                      ✓ Unlimited SMS messages
                    </li>
                    <li className='font-semibold text-green-400'>
                      ✓ Enterprise call center features
                    </li>
                  </ul>
                </div>
              </div>

              {/* À La Carte Section - Mobile Optimized */}
              <div className='mb-6 rounded-2xl border border-teal-500/30 bg-teal-500/10 p-6 text-center backdrop-blur-md'>
                <h3 className='mb-4 text-xl font-bold text-teal-400'>
                  🎯 À La Carte Professional
                </h3>
                <p className='mb-6 text-white/80'>
                  <span className='font-bold'>Starting at $59/month</span> for
                  Base Platform + Add only the modules you need
                </p>
                <div className='flex flex-wrap justify-center gap-2'>
                  {[
                    'Dispatch Management +$99',
                    'CRM Suite +$79',
                    'RFx Discovery +$149',
                    'AI Flow Basic +$99',
                    'Broker Operations +$199',
                    'Training +$49',
                    'Analytics +$89',
                    'Real-Time Tracking +$69',
                    'API Access +$149',
                  ].map((module, index) => (
                    <div
                      key={index}
                      className='rounded-full bg-teal-500/20 px-3 py-1 text-xs font-medium text-teal-400'
                    >
                      {module}
                    </div>
                  ))}
                </div>
              </div>

              {/* Enterprise Solutions */}
              <div className='mb-8 rounded-2xl border border-purple-500/30 bg-purple-500/10 p-6 text-center backdrop-blur-md'>
                <h3 className='mb-4 text-xl font-bold text-purple-400'>
                  🏢 Enterprise Solutions
                </h3>
                <p className='mb-4 text-white/80'>
                  <span className='font-bold'>$4,999 - $9,999+/month</span> -
                  Custom enterprise deployments
                </p>
                <ul className='mx-auto max-w-md space-y-2 text-sm text-white/90'>
                  <li>✓ Dedicated account management</li>
                  <li>✓ Custom integrations & workflows</li>
                  <li>✓ White-label branding options</li>
                  <li>✓ 24/7 priority support</li>
                  <li>✓ On-premise deployment available</li>
                  <li>✓ Multi-location & fleet management</li>
                  <li>✓ Advanced compliance automation</li>
                  <li>✓ Custom training programs</li>
                </ul>
              </div>

              {/* Mobile-Friendly CTA Buttons */}
              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                <Link href='/auth/signup'>
                  <button className='transform rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all hover:scale-105 hover:from-blue-700 hover:to-blue-900'>
                    🚀 Start Free Trial
                  </button>
                </Link>
                <Link href='/plans'>
                  <button className='rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20'>
                    💰 View All Plans
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Who It's For Section - Mobile Optimized */}
          <div className='mb-12 text-center sm:mb-16'>
            <h2 className='mb-6 text-2xl font-bold text-white sm:text-3xl'>
              Every Role, One Platform
            </h2>
            <p className='mx-auto mb-8 max-w-4xl text-lg leading-relaxed text-white/80'>
              One intelligent platform connecting every piece of your
              transportation operations - from solo drivers managing their first
              load to Fortune 500 enterprises orchestrating global supply
              chains.
            </p>

            <div className='flex flex-wrap justify-center gap-3'>
              {[
                {
                  role: '👤 Individual Drivers',
                  color: 'from-amber-500 to-amber-600',
                },
                {
                  role: '🚛 Owner Operators',
                  color: 'from-blue-800 to-blue-900',
                },
                { role: '📋 Dispatchers', color: 'from-blue-600 to-blue-700' },
                {
                  role: '🏢 Brokerages',
                  color: 'from-orange-500 to-orange-600',
                },
                {
                  role: '🏭 3PL Companies',
                  color: 'from-purple-500 to-purple-600',
                },
                {
                  role: '🌟 Enterprise Fleets',
                  color: 'from-teal-500 to-teal-600',
                },
              ].map((item, index) => (
                <button
                  key={index}
                  className={`bg-gradient-to-r ${item.color} transform rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl`}
                >
                  {item.role}
                </button>
              ))}
            </div>
          </div>

          {/* Platform Reliability & Trust - Mobile Grid */}
          <div className='mb-12 text-center sm:mb-16'>
            <h2 className='mb-8 bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl'>
              Platform Reliability & Trust
            </h2>

            <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6'>
              {[
                {
                  icon: '🚀',
                  value: '99.9%',
                  label: 'System Uptime',
                  color: 'from-blue-500 to-blue-600',
                },
                {
                  icon: '🏢',
                  value: '2,847+',
                  label: 'Active Companies',
                  color: 'from-green-500 to-green-600',
                },
                {
                  icon: '⚡',
                  value: '<50ms',
                  label: 'Response Time',
                  color: 'from-purple-500 to-purple-600',
                },
                {
                  icon: '🛟',
                  value: '24/7',
                  label: 'Support Coverage',
                  color: 'from-red-500 to-red-600',
                },
                {
                  icon: '🌍',
                  value: '150+',
                  label: 'Countries Served',
                  color: 'from-teal-500 to-teal-600',
                },
                {
                  icon: '📊',
                  value: '25%+',
                  label: 'Efficiency Gain',
                  color: 'from-green-500 to-green-600',
                },
              ].map((kpi, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${kpi.color}/10 transform rounded-xl border border-white/10 p-4 backdrop-blur-md transition-all hover:scale-105 hover:border-white/30`}
                >
                  <div className='mb-2 text-2xl'>{kpi.icon}</div>
                  <div className='mb-1 text-lg font-bold text-white sm:text-xl'>
                    {kpi.value}
                  </div>
                  <div className='text-xs text-white/70 sm:text-sm'>
                    {kpi.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Demo Booking Modal */}
      {showDemoForm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm'>
          <div className='max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl sm:p-8'>
            <h3 className='mb-6 text-center text-2xl font-bold text-white'>
              Book Your Enterprise Demo
            </h3>

            <form onSubmit={handleDemoSubmit} className='space-y-4'>
              {[
                { key: 'name', label: 'Full Name', type: 'text' },
                { key: 'email', label: 'Business Email', type: 'email' },
                { key: 'company', label: 'Company Name', type: 'text' },
                { key: 'phone', label: 'Phone Number', type: 'tel' },
                { key: 'fleetSize', label: 'Fleet Size', type: 'text' },
              ].map((field) => (
                <div key={field.key}>
                  <label className='mb-2 block font-medium text-white/90'>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    required
                    value={demoForm[field.key as keyof DemoBookingForm]}
                    onChange={(e) =>
                      setDemoForm({
                        ...demoForm,
                        [field.key]: e.target.value,
                      })
                    }
                    className='w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
                  />
                </div>
              ))}

              <div>
                <label className='mb-2 block font-medium text-white/90'>
                  Additional Requirements
                </label>
                <textarea
                  value={demoForm.message}
                  onChange={(e) =>
                    setDemoForm({ ...demoForm, message: e.target.value })
                  }
                  rows={3}
                  className='w-full resize-none rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
                />
              </div>

              <div className='flex flex-col gap-3 pt-4 sm:flex-row'>
                <button
                  type='button'
                  onClick={() => setShowDemoForm(false)}
                  className='flex-1 rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white transition-all hover:bg-white/20'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 transform rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-3 font-bold text-white transition-all hover:scale-105 hover:from-blue-700 hover:to-blue-900'
                >
                  Schedule Demo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
