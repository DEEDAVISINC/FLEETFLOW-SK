'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Demo user data - in real app this would come from your auth system
const demoUser = {
  id: 'DD-MGR-20240101-1',
  name: 'David Davis',
  email: 'ddavis@freight1stdirect.com',
  phone: '(555) 987-6543',
  department: 'Executive Management',
  departmentCode: 'MGR',
  position: 'President & Owner',
  hiredDate: '2024-01-01',
  role: 'Owner',
  status: 'active',
  lastActive: '2024-12-19T16:45:00Z',
  companyName: 'Freight 1st Direct Brokerage LLC',
  systemAccess: {
    level: 'Executive Portal',
    accessCode: 'ACC-DD-MGR',
    securityLevel: 'Level 5 - Executive',
    allowedSystems: [
      'Executive Dashboard',
      'Regulatory Compliance',
      'Financial Management',
      'Strategic Analytics',
      'Brokerage Operations',
      'Risk Management',
    ],
  },
  trainingProgress: {
    completed: [
      { name: 'Executive Leadership', completedDate: '2024-01-15', score: 98 },
      { name: 'Regulatory Compliance', completedDate: '2024-02-01', score: 96 },
      { name: 'Risk Management', completedDate: '2024-02-15', score: 94 },
    ],
    inProgress: [
      { name: 'Strategic Planning', progress: 75 },
      { name: 'Advanced Analytics', progress: 45 },
    ],
  },
};

export default function UserProfilePageMobile() {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'settings' | 'training' | 'security'
  >('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'training', label: 'Training', icon: '🎓' },
    { id: 'security', label: 'Security', icon: '🔐' },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'inactive':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'>
      {/* Mobile-Optimized Header */}
      <div className='sticky top-0 z-50 border-b border-white/30 bg-white/20 backdrop-blur-lg'>
        <div className='px-4 py-3 sm:px-6'>
          <div className='flex items-center justify-between'>
            {/* Back Button & Title */}
            <div className='flex items-center space-x-3'>
              <Link href='/'>
                <button className='rounded-lg border border-white/30 bg-white/20 p-2 backdrop-blur-md transition-colors hover:bg-white/30'>
                  <svg
                    className='h-5 w-5 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 19l-7-7 7-7'
                    />
                  </svg>
                </button>
              </Link>
              <div>
                <h1 className='text-lg font-bold text-white sm:text-xl'>
                  User Profile
                </h1>
                <p className='text-xs text-white/70 sm:text-sm'>
                  Account & Settings
                </p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='rounded-lg border border-white/30 bg-white/20 p-2 md:hidden'
            >
              <svg
                className='h-6 w-6 text-white'
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
        </div>
      </div>

      {/* Mobile-Responsive Navigation */}
      <div className='border-b border-white/20 bg-white/10 backdrop-blur-md'>
        {/* Desktop Tabs */}
        <div className='hidden overflow-x-auto px-4 md:flex'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-white bg-white/20 text-white'
                  : 'border-transparent text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className='mr-2'>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`transition-all duration-300 md:hidden ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 overflow-hidden opacity-0'}`}
        >
          <div className='bg-white/20 backdrop-blur-md'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as typeof activeTab);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white/30 text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className='mr-3 text-lg'>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Active Tab Display */}
        <div className='bg-white/10 px-4 py-2 md:hidden'>
          <div className='flex items-center'>
            <span className='mr-2 text-lg'>
              {tabs.find((tab) => tab.id === activeTab)?.icon}
            </span>
            <span className='font-medium text-white'>
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className='px-4 py-6 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl'>
          {/* Profile Tab - Mobile Optimized */}
          {activeTab === 'profile' && (
            <div className='space-y-6'>
              {/* Profile Header Card */}
              <div className='rounded-2xl border border-white/40 bg-white/20 p-6 backdrop-blur-lg'>
                <div className='flex flex-col items-center text-center sm:flex-row sm:text-left'>
                  {/* Profile Avatar */}
                  <div className='mb-4 sm:mr-6 sm:mb-0'>
                    <div className='flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white shadow-xl sm:h-24 sm:w-24 sm:text-3xl'>
                      {demoUser.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div
                      className={`h-4 w-4 ${getStatusColor(demoUser.status)} -mt-2 mr-auto ml-auto rounded-full border-2 border-white shadow-lg sm:ml-16`}
                    ></div>
                  </div>

                  {/* Profile Info */}
                  <div className='flex-1'>
                    <h2 className='mb-1 text-2xl font-bold text-white'>
                      {demoUser.name}
                    </h2>
                    <p className='mb-2 font-semibold text-blue-300'>
                      {demoUser.position}
                    </p>
                    <p className='mb-3 text-white/80'>{demoUser.companyName}</p>

                    <div className='flex flex-col gap-3 sm:flex-row'>
                      <div className='flex items-center text-white/70'>
                        <span className='mr-2'>📧</span>
                        <span className='text-sm'>{demoUser.email}</span>
                      </div>
                      <div className='flex items-center text-white/70'>
                        <span className='mr-2'>📱</span>
                        <span className='text-sm'>{demoUser.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Cards - Mobile Grid */}
                <div className='mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-6 sm:grid-cols-4'>
                  <div className='text-center'>
                    <div className='text-lg font-bold text-white'>Active</div>
                    <div className='text-sm text-white/70'>Status</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-lg font-bold text-white'>Level 5</div>
                    <div className='text-sm text-white/70'>Access</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-lg font-bold text-white'>Jan 2024</div>
                    <div className='text-sm text-white/70'>Joined</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-lg font-bold text-white'>Owner</div>
                    <div className='text-sm text-white/70'>Role</div>
                  </div>
                </div>
              </div>

              {/* System Access Card */}
              <div className='rounded-xl border border-white/40 bg-white/20 p-6 backdrop-blur-lg'>
                <h3 className='mb-4 flex items-center text-lg font-semibold text-white'>
                  <span className='mr-2'>🔑</span>
                  System Access
                </h3>

                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  {demoUser.systemAccess.allowedSystems.map((system, index) => (
                    <div
                      key={index}
                      className='flex items-center rounded-lg bg-white/10 p-3'
                    >
                      <div className='mr-3 h-2 w-2 rounded-full bg-green-500'></div>
                      <span className='text-sm text-white'>{system}</span>
                    </div>
                  ))}
                </div>

                <div className='mt-4 rounded-lg border border-blue-500/40 bg-blue-500/20 p-3'>
                  <div className='font-medium text-blue-300'>
                    Security Level: {demoUser.systemAccess.securityLevel}
                  </div>
                  <div className='text-sm text-white/70'>
                    Access Code: {demoUser.systemAccess.accessCode}
                  </div>
                </div>
              </div>

              {/* Quick Actions - Mobile Grid */}
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
                <button className='transform rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-center text-white transition-all hover:scale-105 hover:from-blue-600 hover:to-blue-700'>
                  <div className='mb-2 text-2xl'>📊</div>
                  <div className='text-sm font-medium'>Analytics</div>
                </button>
                <button className='transform rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-4 text-center text-white transition-all hover:scale-105 hover:from-green-600 hover:to-green-700'>
                  <div className='mb-2 text-2xl'>📋</div>
                  <div className='text-sm font-medium'>Reports</div>
                </button>
                <button className='transform rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-center text-white transition-all hover:scale-105 hover:from-purple-600 hover:to-purple-700'>
                  <div className='mb-2 text-2xl'>🎓</div>
                  <div className='text-sm font-medium'>Training</div>
                </button>
                <button className='transform rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-center text-white transition-all hover:scale-105 hover:from-orange-600 hover:to-orange-700'>
                  <div className='mb-2 text-2xl'>⚙️</div>
                  <div className='text-sm font-medium'>Settings</div>
                </button>
              </div>
            </div>
          )}

          {/* Settings Tab - Mobile Optimized */}
          {activeTab === 'settings' && (
            <div className='space-y-6'>
              {/* Account Settings */}
              <div className='rounded-xl border border-white/40 bg-white/20 p-6 backdrop-blur-lg'>
                <h3 className='mb-6 flex items-center text-lg font-semibold text-white'>
                  <span className='mr-2'>👤</span>
                  Account Settings
                </h3>

                <div className='space-y-4'>
                  <div>
                    <label className='mb-2 block font-medium text-white/90'>
                      Full Name
                    </label>
                    <input
                      type='text'
                      defaultValue={demoUser.name}
                      className='w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    />
                  </div>

                  <div>
                    <label className='mb-2 block font-medium text-white/90'>
                      Email Address
                    </label>
                    <input
                      type='email'
                      defaultValue={demoUser.email}
                      className='w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    />
                  </div>

                  <div>
                    <label className='mb-2 block font-medium text-white/90'>
                      Phone Number
                    </label>
                    <input
                      type='tel'
                      defaultValue={demoUser.phone}
                      className='w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    />
                  </div>

                  <div>
                    <label className='mb-2 block font-medium text-white/90'>
                      Position
                    </label>
                    <input
                      type='text'
                      defaultValue={demoUser.position}
                      className='w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className='rounded-xl border border-white/40 bg-white/20 p-6 backdrop-blur-lg'>
                <h3 className='mb-6 flex items-center text-lg font-semibold text-white'>
                  <span className='mr-2'>🔔</span>
                  Notification Settings
                </h3>

                <div className='space-y-4'>
                  {[
                    {
                      name: 'Email Notifications',
                      desc: 'Receive updates via email',
                      enabled: true,
                    },
                    {
                      name: 'SMS Alerts',
                      desc: 'Critical alerts via text message',
                      enabled: true,
                    },
                    {
                      name: 'Push Notifications',
                      desc: 'Browser and mobile app notifications',
                      enabled: false,
                    },
                    {
                      name: 'Weekly Reports',
                      desc: 'Automated weekly performance reports',
                      enabled: true,
                    },
                    {
                      name: 'System Maintenance',
                      desc: 'Notifications about system updates',
                      enabled: true,
                    },
                  ].map((setting, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between rounded-lg bg-white/10 p-3'
                    >
                      <div className='flex-1'>
                        <div className='font-medium text-white'>
                          {setting.name}
                        </div>
                        <div className='text-sm text-white/70'>
                          {setting.desc}
                        </div>
                      </div>
                      <div
                        className={`h-6 w-12 rounded-full transition-colors ${
                          setting.enabled ? 'bg-blue-500' : 'bg-white/20'
                        } relative cursor-pointer`}
                      >
                        <div
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                            setting.enabled
                              ? 'translate-x-6'
                              : 'translate-x-0.5'
                          }`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <button className='w-full transform rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 py-4 text-lg font-semibold text-white transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-blue-900'>
                Save Changes
              </button>
            </div>
          )}

          {/* Training Tab - Mobile Optimized */}
          {activeTab === 'training' && (
            <div className='space-y-6'>
              {/* Training Overview */}
              <div className='rounded-xl border border-white/40 bg-white/20 p-6 text-center backdrop-blur-lg'>
                <div className='mb-4 text-4xl'>🎓</div>
                <h3 className='mb-2 text-xl font-bold text-white'>
                  Training Progress
                </h3>
                <p className='text-white/80'>
                  Track your professional development journey
                </p>
              </div>

              {/* Completed Training */}
              <div className='rounded-xl border border-green-500/40 bg-green-500/20 p-6 backdrop-blur-lg'>
                <h3 className='mb-4 flex items-center text-lg font-semibold text-white'>
                  <span className='mr-2'>✅</span>
                  Completed Training
                </h3>

                <div className='space-y-3'>
                  {demoUser.trainingProgress.completed.map(
                    (training, index) => (
                      <div key={index} className='rounded-lg bg-white/10 p-4'>
                        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                          <div className='flex-1'>
                            <h4 className='font-medium text-white'>
                              {training.name}
                            </h4>
                            <p className='text-sm text-white/70'>
                              Completed: {training.completedDate}
                            </p>
                          </div>
                          <div className='text-right'>
                            <div className='text-2xl font-bold text-green-400'>
                              {training.score}%
                            </div>
                            <div className='text-xs text-white/70'>Score</div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* In Progress Training */}
              <div className='rounded-xl border border-yellow-500/40 bg-yellow-500/20 p-6 backdrop-blur-lg'>
                <h3 className='mb-4 flex items-center text-lg font-semibold text-white'>
                  <span className='mr-2'>📚</span>
                  In Progress
                </h3>

                <div className='space-y-4'>
                  {demoUser.trainingProgress.inProgress.map(
                    (training, index) => (
                      <div key={index} className='rounded-lg bg-white/10 p-4'>
                        <h4 className='mb-3 font-medium text-white'>
                          {training.name}
                        </h4>
                        <div className='h-3 w-full rounded-full bg-white/20'>
                          <div
                            className='h-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all'
                            style={{ width: `${training.progress}%` }}
                          ></div>
                        </div>
                        <div className='mt-2 flex items-center justify-between'>
                          <span className='text-sm text-white/70'>
                            {training.progress}% Complete
                          </span>
                          <button className='rounded-lg bg-blue-500 px-4 py-1 text-sm font-medium text-white transition-colors hover:bg-blue-600'>
                            Continue
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Training Actions */}
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <Link href='/university'>
                  <button className='w-full rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 py-4 font-semibold text-white transition-all hover:from-purple-700 hover:to-purple-900'>
                    Browse Courses
                  </button>
                </Link>
                <button className='w-full rounded-xl bg-gradient-to-r from-green-600 to-green-800 py-4 font-semibold text-white transition-all hover:from-green-700 hover:to-green-900'>
                  View Certificates
                </button>
              </div>
            </div>
          )}

          {/* Security Tab - Mobile Optimized */}
          {activeTab === 'security' && (
            <div className='space-y-6'>
              {/* Security Overview */}
              <div className='rounded-xl border border-white/40 bg-white/20 p-6 text-center backdrop-blur-lg'>
                <div className='mb-4 text-4xl'>🔐</div>
                <h3 className='mb-2 text-xl font-bold text-white'>
                  Account Security
                </h3>
                <p className='text-white/80'>
                  Manage your account security settings
                </p>
              </div>

              {/* Password Security */}
              <div className='rounded-xl border border-white/40 bg-white/20 p-6 backdrop-blur-lg'>
                <h3 className='mb-4 flex items-center text-lg font-semibold text-white'>
                  <span className='mr-2'>🔑</span>
                  Password & Authentication
                </h3>

                <div className='space-y-4'>
                  <div>
                    <label className='mb-2 block font-medium text-white/90'>
                      Current Password
                    </label>
                    <input
                      type='password'
                      placeholder='Enter current password'
                      className='w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    />
                  </div>

                  <div>
                    <label className='mb-2 block font-medium text-white/90'>
                      New Password
                    </label>
                    <input
                      type='password'
                      placeholder='Enter new password'
                      className='w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    />
                  </div>

                  <div>
                    <label className='mb-2 block font-medium text-white/90'>
                      Confirm New Password
                    </label>
                    <input
                      type='password'
                      placeholder='Confirm new password'
                      className='w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    />
                  </div>

                  <button className='w-full rounded-xl bg-gradient-to-r from-red-600 to-red-800 py-3 font-semibold text-white transition-all hover:from-red-700 hover:to-red-900'>
                    Update Password
                  </button>
                </div>
              </div>

              {/* Security Features */}
              <div className='rounded-xl border border-white/40 bg-white/20 p-6 backdrop-blur-lg'>
                <h3 className='mb-4 flex items-center text-lg font-semibold text-white'>
                  <span className='mr-2'>🛡️</span>
                  Security Features
                </h3>

                <div className='space-y-4'>
                  {[
                    {
                      name: 'Two-Factor Authentication',
                      desc: 'Add an extra layer of security',
                      enabled: false,
                    },
                    {
                      name: 'Login Alerts',
                      desc: 'Get notified of new login attempts',
                      enabled: true,
                    },
                    {
                      name: 'Session Timeout',
                      desc: 'Auto-logout after inactivity',
                      enabled: true,
                    },
                    {
                      name: 'IP Address Restrictions',
                      desc: 'Limit access to specific locations',
                      enabled: false,
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between rounded-lg bg-white/10 p-4'
                    >
                      <div className='flex-1'>
                        <div className='font-medium text-white'>
                          {feature.name}
                        </div>
                        <div className='text-sm text-white/70'>
                          {feature.desc}
                        </div>
                      </div>
                      <div className='flex items-center gap-3'>
                        <span
                          className={`rounded px-2 py-1 text-xs font-medium ${
                            feature.enabled
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {feature.enabled ? 'ON' : 'OFF'}
                        </span>
                        <button className='rounded bg-blue-500 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-600'>
                          {feature.enabled ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session Info */}
              <div className='rounded-xl border border-blue-500/40 bg-blue-500/20 p-6 backdrop-blur-lg'>
                <h3 className='mb-4 flex items-center text-lg font-semibold text-white'>
                  <span className='mr-2'>⏰</span>
                  Current Session
                </h3>

                <div className='grid grid-cols-1 gap-4 text-sm sm:grid-cols-2'>
                  <div className='rounded-lg bg-white/10 p-3'>
                    <div className='text-white/70'>Last Login</div>
                    <div className='font-medium text-white'>
                      {new Date(demoUser.lastActive).toLocaleDateString()} at{' '}
                      {new Date(demoUser.lastActive).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className='rounded-lg bg-white/10 p-3'>
                    <div className='text-white/70'>Current Time</div>
                    <div className='font-medium text-white'>
                      {currentTime.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className='rounded-lg bg-white/10 p-3'>
                    <div className='text-white/70'>Session Length</div>
                    <div className='font-medium text-white'>2h 34m</div>
                  </div>
                  <div className='rounded-lg bg-white/10 p-3'>
                    <div className='text-white/70'>IP Address</div>
                    <div className='font-medium text-white'>192.168.1.100</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile-Friendly Footer */}
      <div className='mt-8 border-t border-white/20 bg-white/10 p-4 text-center backdrop-blur-md'>
        <p className='text-sm text-white/60'>
          User Profile - Mobile Optimized v1.0
        </p>
        <p className='mt-1 text-xs text-white/40'>
          Secure account management on any device
        </p>
      </div>
    </div>
  );
}
