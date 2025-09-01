'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Operations' | 'Compliance' | 'Technology' | 'Safety' | 'Business';
  certification: boolean;
  enrolledCount: number;
  rating: number;
  thumbnail: string;
}

export default function UniversityPageMobile() {
  const [activeTab, setActiveTab] = useState<
    'hub' | 'courses' | 'certifications' | 'ai-training'
  >('hub');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'hub', label: 'Hub', icon: '🏠' },
    { id: 'courses', label: 'Courses', icon: '📚' },
    { id: 'certifications', label: 'Certificates', icon: '🏆' },
    { id: 'ai-training', label: 'AI Training', icon: '🤖' },
  ];

  const categories = [
    { id: 'all', name: 'All Courses', color: 'from-purple-500 to-purple-600' },
    {
      id: 'Operations',
      name: 'Operations',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'Business',
      name: 'Business',
      color: 'from-orange-500 to-orange-600',
    },
    { id: 'Compliance', name: 'Compliance', color: 'from-red-500 to-red-600' },
    { id: 'Safety', name: 'Safety', color: 'from-green-500 to-green-600' },
    {
      id: 'Technology',
      name: 'Technology',
      color: 'from-teal-500 to-teal-600',
    },
  ];

  const featuredCourses: Course[] = [
    {
      id: 'go-with-the-flow-occupational',
      title: 'Go with the Flow Occupational Training',
      description:
        'Foundational FleetFlow operations training covering workflow optimization, system navigation, cross-departmental coordination.',
      duration: '240 minutes',
      difficulty: 'Beginner',
      category: 'Operations',
      certification: true,
      enrolledCount: 2847,
      rating: 4.9,
      thumbnail: '🌊',
    },
    {
      id: 'broker-operations-relationship',
      title: 'Broker Operations - Relationship Building',
      description:
        'Advanced broker operations focusing on strategic relationship building with shippers and manufacturers.',
      duration: '200 minutes',
      difficulty: 'Advanced',
      category: 'Business',
      certification: true,
      enrolledCount: 1847,
      rating: 4.8,
      thumbnail: '🤝',
    },
    {
      id: 'dispatcher-operations-mastery',
      title: 'Dispatcher Operations Mastery',
      description:
        'Complete dispatcher training including load matching strategies, carrier coordination, route optimization.',
      duration: '180 minutes',
      difficulty: 'Advanced',
      category: 'Operations',
      certification: true,
      enrolledCount: 856,
      rating: 4.8,
      thumbnail: '📋',
    },
    {
      id: 'safety-compliance-fundamentals',
      title: 'Safety & Compliance Fundamentals',
      description:
        'Essential safety protocols, DOT compliance requirements, and regulatory best practices for transportation.',
      duration: '150 minutes',
      difficulty: 'Beginner',
      category: 'Safety',
      certification: true,
      enrolledCount: 1234,
      rating: 4.7,
      thumbnail: '🛡️',
    },
    {
      id: 'ai-flow-system-training',
      title: 'AI Flow System Mastery',
      description:
        ""Comprehensive training on FleetFlow's AI-powered automation systems and intelligent workflow optimization."",
      duration: '120 minutes',
      difficulty: 'Intermediate',
      category: 'Technology',
      certification: true,
      enrolledCount: 945,
      rating: 4.9,
      thumbnail: '🤖',
    },
    {
      id: 'customer-service-excellence',
      title: 'Customer Service Excellence',
      description:
        'Master customer communication, conflict resolution, and relationship management in transportation logistics.',
      duration: '90 minutes',
      difficulty: 'Beginner',
      category: 'Business',
      certification: false,
      enrolledCount: 678,
      rating: 4.6,
      thumbnail: '💬',
    },
  ];

  const filteredCourses = featuredCourses.filter((course) => {
    const matchesCategory =
      selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500';
      case 'Intermediate':
        return 'bg-yellow-500';
      case 'Advanced':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-800'>
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
                <h1 className='flex items-center text-lg font-bold text-white sm:text-xl'>
                  🎓 FleetFlow University
                </h1>
                <p className='text-xs text-white/70 sm:text-sm'>
                  Knowledge on & off the Road
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
        <div className='mx-auto max-w-7xl'>
          {/* University Hub - Mobile Optimized */}
          {activeTab === 'hub' && (
            <div className='space-y-8'>
              {/* Welcome Section */}
              <div className='mb-8 text-center'>
                <div className='mb-4 text-6xl sm:text-8xl'>🎓</div>
                <h2 className='mb-4 text-3xl font-bold text-white sm:text-4xl'>
                  Welcome to FleetFlow University℠
                </h2>
                <p className='mx-auto max-w-3xl text-lg leading-relaxed text-white/80 sm:text-xl'>
                  <span className='font-bold text-amber-400'>
                    Dispatch Smart, Drive Safe, Deal Right
                  </span>
                  <br />
                  Professional training and certification for transportation
                  excellence
                </p>
              </div>

              {/* Quick Stats - Mobile Grid */}
              <div className='mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4'>
                <div className='rounded-xl border border-white/40 bg-white/20 p-4 text-center backdrop-blur-lg'>
                  <div className='text-2xl font-bold text-white'>50+</div>
                  <div className='text-sm text-white/80'>Courses</div>
                </div>
                <div className='rounded-xl border border-white/40 bg-white/20 p-4 text-center backdrop-blur-lg'>
                  <div className='text-2xl font-bold text-white'>8,500+</div>
                  <div className='text-sm text-white/80'>Students</div>
                </div>
                <div className='rounded-xl border border-white/40 bg-white/20 p-4 text-center backdrop-blur-lg'>
                  <div className='text-2xl font-bold text-white'>95%</div>
                  <div className='text-sm text-white/80'>Pass Rate</div>
                </div>
                <div className='rounded-xl border border-white/40 bg-white/20 p-4 text-center backdrop-blur-lg'>
                  <div className='text-2xl font-bold text-white'>4.8★</div>
                  <div className='text-sm text-white/80'>Avg Rating</div>
                </div>
              </div>

              {/* Featured Course - Mobile Optimized */}
              <div className='rounded-2xl border-2 border-amber-500 bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-6 backdrop-blur-xl sm:p-8'>
                <div className='flex flex-col items-center text-center'>
                  <div className='mb-4 text-5xl'>🌊</div>
                  <h3 className='mb-3 text-2xl font-bold text-white'>
                    Featured Course
                  </h3>
                  <h4 className='mb-4 text-xl font-semibold text-amber-400'>
                    Go with the Flow Occupational Training
                  </h4>
                  <p className='mb-6 max-w-2xl leading-relaxed text-white/80'>
                    Master FleetFlow's foundational operations including
                    workflow optimization, system navigation, cross-departmental
                    coordination, and productivity enhancement within the
                    transportation ecosystem.
                  </p>
                  <div className='mb-6 flex flex-col items-center gap-4 sm:flex-row'>
                    <div className='flex items-center gap-4 text-sm text-white/80'>
                      <span className='rounded bg-green-500 px-2 py-1 font-medium text-white'>
                        Beginner
                      </span>
                      <span>240 minutes</span>
                      <span>⭐ 4.9/5</span>
                    </div>
                    <div className='text-sm text-white/60'>2,847+ enrolled</div>
                  </div>
                  <button className='transform rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:scale-105 hover:from-amber-600 hover:to-orange-600'>
                    🚀 Start Learning Now
                  </button>
                </div>
              </div>

              {/* Learning Paths - Mobile Cards */}
              <div>
                <h3 className='mb-6 text-center text-xl font-bold text-white'>
                  Choose Your Learning Path
                </h3>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  {[
                    {
                      title: '👤 Individual Driver',
                      desc: 'Master solo operations and safety',
                      color: 'from-blue-500 to-blue-600',
                    },
                    {
                      title: '📋 Dispatcher Pro',
                      desc: 'Advanced coordination and management',
                      color: 'from-purple-500 to-purple-600',
                    },
                    {
                      title: '🏢 Broker Expert',
                      desc: 'Business development and relationships',
                      color: 'from-green-500 to-green-600',
                    },
                    {
                      title: '🏭 Fleet Manager',
                      desc: 'Large-scale operations management',
                      color: 'from-orange-500 to-orange-600',
                    },
                    {
                      title: '⚖️ Compliance Officer',
                      desc: 'Regulatory and safety expertise',
                      color: 'from-red-500 to-red-600',
                    },
                    {
                      title: '🤖 AI Specialist',
                      desc: 'Technology and automation mastery',
                      color: 'from-teal-500 to-teal-600',
                    },
                  ].map((path, index) => (
                    <div
                      key={index}
                      className={`rounded-xl bg-gradient-to-br ${path.color}/20 cursor-pointer border border-white/30 p-6 text-center backdrop-blur-md transition-all hover:scale-105`}
                    >
                      <h4 className='mb-2 font-bold text-white'>
                        {path.title}
                      </h4>
                      <p className='text-sm text-white/80'>{path.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab - Mobile Optimized */}
          {activeTab === 'courses' && (
            <div className='space-y-6'>
              {/* Search and Filter - Mobile Friendly */}
              <div className='space-y-4'>
                <input
                  type='text'
                  placeholder='Search courses...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full rounded-xl border border-white/50 bg-white/20 px-4 py-3 text-white placeholder-white/60 backdrop-blur-md focus:border-white focus:ring-2 focus:ring-blue-500 focus:outline-none'
                />

                <div className='flex flex-wrap gap-2'>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        selectedCategory === category.id
                          ? 'bg-white text-gray-900'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Course Grid - Mobile Responsive */}
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className='group overflow-hidden rounded-xl border border-white/40 bg-white/20 backdrop-blur-lg transition-all hover:bg-white/30'
                  >
                    {/* Course Header */}
                    <div className='p-6'>
                      <div className='mb-4 flex items-start justify-between'>
                        <div className='text-3xl'>{course.thumbnail}</div>
                        {course.certification && (
                          <span className='rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-1 text-xs font-bold text-white'>
                            🏆 CERT
                          </span>
                        )}
                      </div>

                      <h3 className='mb-2 line-clamp-2 font-bold text-white'>
                        {course.title}
                      </h3>
                      <p className='mb-4 line-clamp-3 text-sm text-white/80'>
                        {course.description}
                      </p>

                      {/* Course Meta */}
                      <div className='space-y-3'>
                        <div className='flex items-center justify-between text-sm'>
                          <span
                            className={`${getDifficultyColor(course.difficulty)} rounded px-2 py-1 text-xs font-medium text-white`}
                          >
                            {course.difficulty}
                          </span>
                          <span className='text-white/60'>
                            {course.duration}
                          </span>
                        </div>

                        <div className='flex items-center justify-between text-sm text-white/80'>
                          <div className='flex items-center gap-1'>
                            <span>⭐</span>
                            <span>{course.rating}</span>
                          </div>
                          <span>
                            {course.enrolledCount.toLocaleString()} enrolled
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Course Actions */}
                    <div className='border-t border-white/20 p-4'>
                      <button className='w-full transform rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white transition-all group-hover:scale-105 hover:from-purple-700 hover:to-pink-700'>
                        Start Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className='text-center'>
                <button className='rounded-xl bg-white/20 px-8 py-3 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/30'>
                  Load More Courses
                </button>
              </div>
            </div>
          )}

          {/* Certifications Tab - Mobile Optimized */}
          {activeTab === 'certifications' && (
            <div className='space-y-8'>
              <div className='text-center'>
                <div className='mb-4 text-5xl'>🏆</div>
                <h2 className='mb-4 text-2xl font-bold text-white sm:text-3xl'>
                  Your Certifications
                </h2>
                <p className='mx-auto max-w-2xl text-white/80'>
                  Track your progress and showcase your professional
                  achievements
                </p>
              </div>

              {/* Certification Progress */}
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* Completed Certifications */}
                <div className='rounded-xl border border-green-500/40 bg-green-500/20 p-6 backdrop-blur-lg'>
                  <div className='mb-4 flex items-center'>
                    <div className='mr-3 text-2xl'>✅</div>
                    <h3 className='font-bold text-white'>
                      Completed Certifications
                    </h3>
                  </div>

                  <div className='space-y-3'>
                    {[
                      {
                        name: 'FleetFlow Fundamentals',
                        date: '2024-01-15',
                        score: '98%',
                      },
                      {
                        name: 'Safety & Compliance',
                        date: '2024-02-20',
                        score: '95%',
                      },
                      {
                        name: 'Customer Service Excellence',
                        date: '2024-03-10',
                        score: '92%',
                      },
                    ].map((cert, index) => (
                      <div key={index} className='rounded-lg bg-white/10 p-3'>
                        <div className='font-medium text-white'>
                          {cert.name}
                        </div>
                        <div className='flex justify-between text-sm text-white/70'>
                          <span>Completed: {cert.date}</span>
                          <span>Score: {cert.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* In Progress */}
                <div className='rounded-xl border border-yellow-500/40 bg-yellow-500/20 p-6 backdrop-blur-lg'>
                  <div className='mb-4 flex items-center'>
                    <div className='mr-3 text-2xl'>📚</div>
                    <h3 className='font-bold text-white'>In Progress</h3>
                  </div>

                  <div className='space-y-3'>
                    {[
                      { name: 'Advanced Dispatcher Training', progress: 75 },
                      { name: 'AI Flow System Mastery', progress: 45 },
                      { name: 'Broker Operations Excellence', progress: 30 },
                    ].map((course, index) => (
                      <div key={index} className='rounded-lg bg-white/10 p-3'>
                        <div className='mb-2 font-medium text-white'>
                          {course.name}
                        </div>
                        <div className='h-2 w-full rounded-full bg-white/20'>
                          <div
                            className='h-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all'
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <div className='mt-1 text-xs text-white/70'>
                          {course.progress}% Complete
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Available Certifications */}
              <div>
                <h3 className='mb-4 text-xl font-bold text-white'>
                  Available Certifications
                </h3>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  {[
                    'Dispatcher Operations Mastery',
                    'Broker Business Excellence',
                    'Fleet Management Professional',
                    'DOT Compliance Specialist',
                    'Transportation Safety Expert',
                    'AI Automation Specialist',
                  ].map((cert, index) => (
                    <div
                      key={index}
                      className='rounded-xl border border-white/30 bg-white/10 p-4 text-center backdrop-blur-lg transition-all hover:bg-white/20'
                    >
                      <div className='mb-2 text-2xl'>🎯</div>
                      <h4 className='mb-2 font-medium text-white'>{cert}</h4>
                      <button className='rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white transition-all hover:from-purple-600 hover:to-pink-600'>
                        Start Path
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Training Tab - Mobile Optimized */}
          {activeTab === 'ai-training' && (
            <div className='space-y-8'>
              <div className='text-center'>
                <div className='mb-4 text-5xl'>🤖</div>
                <h2 className='mb-4 text-2xl font-bold text-white sm:text-3xl'>
                  AI Training Center
                </h2>
                <p className='mx-auto max-w-2xl text-white/80'>
                  Master FleetFlow's AI-powered automation and intelligent
                  workflow systems
                </p>
              </div>

              {/* AI Training Modules */}
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {[
                  {
                    title: 'AI Fundamentals',
                    description:
                      'Introduction to AI in transportation management',
                    duration: '45 min',
                    difficulty: 'Beginner',
                    completed: true,
                  },
                  {
                    title: 'Workflow Automation',
                    description:
                      'Automated load assignment and carrier matching',
                    duration: '60 min',
                    difficulty: 'Intermediate',
                    completed: true,
                  },
                  {
                    title: 'Predictive Analytics',
                    description: 'Route optimization and demand forecasting',
                    duration: '75 min',
                    difficulty: 'Advanced',
                    completed: false,
                  },
                  {
                    title: 'Smart Dispatching',
                    description: 'AI-powered dispatch optimization strategies',
                    duration: '90 min',
                    difficulty: 'Advanced',
                    completed: false,
                  },
                ].map((module, index) => (
                  <div
                    key={index}
                    className={`rounded-xl border p-6 backdrop-blur-lg ${
                      module.completed
                        ? 'border-green-500/40 bg-green-500/20'
                        : 'border-blue-500/40 bg-blue-500/20'
                    }`}
                  >
                    <div className='mb-4 flex items-start justify-between'>
                      <div className='text-2xl'>
                        {module.completed ? '✅' : '🎯'}
                      </div>
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          module.difficulty === 'Beginner'
                            ? 'bg-green-500 text-white'
                            : module.difficulty === 'Intermediate'
                              ? 'bg-yellow-500 text-white'
                              : 'bg-red-500 text-white'
                        }`}
                      >
                        {module.difficulty}
                      </span>
                    </div>

                    <h3 className='mb-2 font-bold text-white'>
                      {module.title}
                    </h3>
                    <p className='mb-4 text-sm text-white/80'>
                      {module.description}
                    </p>

                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-white/60'>
                        {module.duration}
                      </span>
                      <button
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                          module.completed
                            ? 'cursor-default bg-white/20 text-white'
                            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                        }`}
                      >
                        {module.completed ? 'Completed' : 'Start Module'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Achievement Badges */}
              <div>
                <h3 className='mb-4 text-xl font-bold text-white'>
                  AI Mastery Badges
                </h3>
                <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
                  {[
                    { badge: '🤖', name: 'AI Novice', earned: true },
                    { badge: '🎯', name: 'Automation Pro', earned: true },
                    { badge: '📊', name: 'Analytics Expert', earned: false },
                    { badge: '🏆', name: 'AI Master', earned: false },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`rounded-xl border p-4 text-center backdrop-blur-lg ${
                        item.earned
                          ? 'border-yellow-500/40 bg-yellow-500/20'
                          : 'border-white/20 bg-white/10'
                      }`}
                    >
                      <div
                        className={`mb-2 text-3xl ${!item.earned && 'grayscale'}`}
                      >
                        {item.badge}
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          item.earned ? 'text-white' : 'text-white/50'
                        }`}
                      >
                        {item.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile-Friendly Footer */}
      <div className='mt-8 border-t border-white/20 bg-white/10 p-6 text-center backdrop-blur-md'>
        <div className='mb-2 text-2xl'>🎓</div>
        <p className='mb-1 font-bold text-white'>FleetFlow University℠</p>
        <p className='mb-2 text-sm text-white/60'>
          Knowledge on & off the Road
        </p>
        <p className='text-xs text-white/40'>
          Dispatch Smart, Drive Safe, Deal Right
        </p>
      </div>
    </div>
  );
}
