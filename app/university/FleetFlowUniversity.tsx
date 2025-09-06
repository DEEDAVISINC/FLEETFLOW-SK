'use client';

import React, { useState } from 'react';
import { CarrierOnboardWorkflowTraining } from '../training/CarrierOnboardWorkflowTraining';
import { CarrierOnboardWorkflowTrainingDashboard } from '../training/CarrierOnboardWorkflowTrainingDashboard';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Operations' | 'Compliance' | 'Technology' | 'Safety' | 'Business';
  prerequisite?: string[];
  certification: boolean;
  enrolledCount: number;
  rating: number;
  thumbnail: string;
}

interface FleetFlowUniversityProps {
  userRole: 'dispatcher' | 'broker' | 'admin' | 'carrier' | 'driver';
  userName: string;
  tenantId?: string;
  tenantCourses?: Course[];
  tenantProgress?: { [key: string]: boolean };
  onProgressUpdate?: (progress: { [key: string]: boolean }) => void;
  isEnrolled?: boolean;
}

export const FleetFlowUniversity: React.FC<FleetFlowUniversityProps> = ({
  userRole,
  userName,
  tenantId,
  tenantCourses,
  tenantProgress,
  onProgressUpdate,
  isEnrolled = false,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'courses' | 'dashboard' | 'certifications'
  >('courses');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showIndividualCourses, setShowIndividualCourses] = useState(false);

  // INTEGRATED ROLE-BASED COURSES (Main Section) - Default courses
  const integratedCourses: Course[] = [
    {
      id: 'go-with-the-flow-occupational',
      title: 'Go with the Flow Occupational Training',
      description:
        'Foundational FleetFlow operations training covering workflow optimization, system navigation, cross-departmental coordination, productivity enhancement, and professional development within the transportation ecosystem.',
      duration: '240 minutes',
      difficulty: 'Beginner',
      category: 'Operations',
      certification: true,
      enrolledCount: 2847,
      rating: 4.9,
      thumbnail: '🌊',
    },
    {
      id: 'broker-operations-relationship-building',
      title: 'Broker Operations Management - Relationship Building',
      description:
        'Advanced broker operations focusing on strategic relationship building with shippers and manufacturers. Covers trust development, long-term partnership strategies, communication excellence, account management, and revenue growth through relationship optimization.',
      duration: '200 minutes',
      difficulty: 'Advanced',
      category: 'Business',
      certification: true,
      enrolledCount: 1847,
      rating: 4.8,
      thumbnail: '🤝',
    },
    {
      id: 'manufacturer-shipper-partnerships',
      title: 'Manufacturer & Shipper Partnership Excellence',
      description:
        'Specialized training for building and maintaining strategic partnerships with manufacturers and shippers. Includes supply chain understanding, manufacturing logistics, shipper needs analysis, contract negotiations, and long-term partnership development.',
      duration: '180 minutes',
      difficulty: 'Advanced',
      category: 'Business',
      certification: true,
      enrolledCount: 1456,
      rating: 4.7,
      thumbnail: '🏭',
    },
    {
      id: 'dispatch-relationship-mastery',
      title: 'Dispatch Central Relationship Mastery',
      description:
        'Comprehensive dispatcher relationship training covering carrier acquisition, loadboard expertise (DAT, Truckstop, 123LoadBoard), broker networking, carrier onboarding documentation, and becoming the go-to dispatcher for various brokers and clients.',
      duration: '305 minutes',
      difficulty: 'Advanced',
      category: 'Operations',
      certification: true,
      enrolledCount: 1247,
      rating: 4.9,
      thumbnail: '📋',
    },
    {
      id: 'dispatch-central-operations',
      title: 'Dispatch Central Operations',
      description:
        'Complete training on dispatch operations including load board management, carrier assignment, route optimization, real-time tracking, communication protocols, and emergency procedures.',
      duration: '195 minutes',
      difficulty: 'Intermediate',
      category: 'Operations',
      certification: true,
      enrolledCount: 1247,
      rating: 4.7,
      thumbnail: '📋',
    },
    {
      id: 'dispatcher-operations-mastery',
      title: 'Dispatcher Operations Mastery',
      description:
        'Complete dispatcher training including load matching strategies, carrier coordination, route optimization, real-time tracking, emergency procedures, and performance management.',
      duration: '180 minutes',
      difficulty: 'Advanced',
      category: 'Operations',
      certification: true,
      enrolledCount: 856,
      rating: 4.8,
      thumbnail: '📊',
    },
    {
      id: 'broker-operations-management',
      title: 'Broker Operations Management',
      description:
        'Advanced broker operations including load posting strategies, carrier sourcing, rate negotiations, market analysis, risk management, and performance metrics.',
      duration: '225 minutes',
      difficulty: 'Advanced',
      category: 'Business',
      certification: true,
      enrolledCount: 1534,
      rating: 4.8,
      thumbnail: '🏢',
    },
    {
      id: 'broker-business-mastery',
      title: 'Broker Business Mastery',
      description:
        'Comprehensive broker training covering rate negotiations, customer acquisition, market analysis, sales pipeline management, and professional communication for revenue optimization.',
      duration: '180 minutes',
      difficulty: 'Advanced',
      category: 'Business',
      certification: true,
      enrolledCount: 1534,
      rating: 4.7,
      thumbnail: '💼',
    },
    {
      id: 'fleet-operations-excellence',
      title: 'Fleet Operations Excellence',
      description:
        'Strategic fleet management including fleet capacity management, utilization optimization, cross-department coordination, performance metrics, and resource allocation.',
      duration: '150 minutes',
      difficulty: 'Advanced',
      category: 'Operations',
      certification: true,
      enrolledCount: 1247,
      rating: 4.9,
      thumbnail: '🚛',
    },
    {
      id: 'compliance-safety-excellence',
      title: 'Compliance & Safety Excellence',
      description:
        'Complete regulatory excellence covering FMCSA 2025 compliance, safety management systems, risk assessment, audit preparation, and comprehensive safety program implementation.',
      duration: '120 minutes',
      difficulty: 'Advanced',
      category: 'Compliance',
      certification: true,
      enrolledCount: 1012,
      rating: 4.9,
      thumbnail: '⚖️',
    },
  ];

  // Use tenant-specific courses or fallback to defaults
  const coursesToUse = tenantCourses || integratedCourses;

  // INDIVIDUAL SPECIALIZED COURSES (Locked Section)
  const courses: Course[] = [
    {
      id: 'go-with-flow-foundations',
      title: 'Go with the Flow - Foundations',
      description:
        'Essential FleetFlow workflow training covering system fundamentals, navigation mastery, productivity optimization, cross-departmental communication, and professional development within the transportation industry.',
      duration: '120 minutes',
      difficulty: 'Beginner',
      category: 'Operations',
      certification: true,
      enrolledCount: 3247,
      rating: 4.9,
      thumbnail: '🌊',
    },
    {
      id: 'broker-relationship-mastery',
      title: 'Broker Relationship Building Mastery',
      description:
        'Advanced relationship building strategies for brokers working with shippers and manufacturers. Covers trust development, communication excellence, account management, partnership strategies, and long-term revenue optimization through relationship management.',
      duration: '150 minutes',
      difficulty: 'Advanced',
      category: 'Business',
      prerequisite: ['business-operations-excellence'],
      certification: true,
      enrolledCount: 1847,
      rating: 4.8,
      thumbnail: '🤝',
    },
    {
      id: 'manufacturer-logistics-partnerships',
      title: 'Manufacturer & Logistics Partnerships',
      description:
        'Specialized training for developing strategic partnerships with manufacturers and logistics providers. Includes supply chain analysis, manufacturing logistics understanding, shipper relationship development, contract optimization, and partnership growth strategies.',
      duration: '135 minutes',
      difficulty: 'Advanced',
      category: 'Business',
      prerequisite: ['broker-relationship-mastery'],
      certification: true,
      enrolledCount: 1456,
      rating: 4.7,
      thumbnail: '🏭',
    },
    {
      id: 'carrier-management-complete',
      title: 'Complete Carrier Management',
      description:
        'Comprehensive carrier management from onboarding to ongoing relationships. Includes automated 24-hour onboarding, FMCSA verification, document management, portal setup, and carrier performance optimization.',
      duration: '90 minutes',
      difficulty: 'Intermediate',
      category: 'Operations',
      certification: true,
      enrolledCount: 1247,
      rating: 4.9,
      thumbnail: '🚛',
    },
    {
      id: 'compliance-safety-mastery',
      title: 'Transportation Compliance & Safety Mastery',
      description:
        'Complete regulatory excellence covering FMCSA 2025 compliance, safety management systems, risk assessment, audit preparation, and comprehensive safety program implementation.',
      duration: '120 minutes',
      difficulty: 'Advanced',
      category: 'Compliance',
      prerequisite: ['carrier-management-complete'],
      certification: true,
      enrolledCount: 1012,
      rating: 4.9,
      thumbnail: '⚖️',
    },
    {
      id: 'dispatch-relationship-professional',
      title: 'Professional Dispatch Relationship Building',
      description:
        'Master carrier acquisition strategies, loadboard navigation (DAT, Truckstop, 123LoadBoard), broker communication techniques, carrier onboarding documentation management, and relationship management to become the preferred dispatcher for brokers and carriers.',
      duration: '220 minutes',
      difficulty: 'Advanced',
      category: 'Operations',
      prerequisite: ['carrier-management-complete'],
      certification: true,
      enrolledCount: 1247,
      rating: 4.9,
      thumbnail: '📋',
    },
    {
      id: 'dispatch-central-detailed',
      title: 'Dispatch Central Operations - Detailed',
      description:
        'Comprehensive dispatch operations training covering load board management, carrier assignment, route optimization, real-time tracking, communication protocols, and emergency procedures.',
      duration: '195 minutes',
      difficulty: 'Intermediate',
      category: 'Operations',
      prerequisite: ['carrier-management-complete'],
      certification: true,
      enrolledCount: 1247,
      rating: 4.7,
      thumbnail: '📋',
    },
    {
      id: 'dispatch-operations-mastery',
      title: 'Complete Dispatch Mastery',
      description:
        'Advanced dispatch operations combining load optimization, carrier coordination, route planning, real-time tracking, emergency procedures, and performance management for maximum efficiency.',
      duration: '120 minutes',
      difficulty: 'Advanced',
      category: 'Operations',
      certification: true,
      enrolledCount: 856,
      rating: 4.8,
      thumbnail: '📊',
    },
    {
      id: 'broker-operations-detailed',
      title: 'Advanced Broker Operations',
      description:
        'Detailed broker operations training covering load posting strategies, carrier sourcing techniques, rate negotiation mastery, market analysis, risk management protocols, and performance metrics tracking.',
      duration: '225 minutes',
      difficulty: 'Advanced',
      category: 'Business',
      prerequisite: ['business-operations-excellence'],
      certification: true,
      enrolledCount: 856,
      rating: 4.8,
      thumbnail: '🏢',
    },
    {
      id: 'business-operations-excellence',
      title: 'Business Operations Excellence',
      description:
        'Comprehensive business operations including customer service excellence, broker operations, rate negotiations, relationship management, and professional communication for revenue optimization.',
      duration: '90 minutes',
      difficulty: 'Intermediate',
      category: 'Business',
      certification: true,
      enrolledCount: 1534,
      rating: 4.7,
      thumbnail: '💼',
    },
    {
      id: 'freightflow-quoting-engine-mastery',
      title: 'FreightFlow Quoting Engine Mastery',
      description:
        'Comprehensive training on the unified AI-powered quoting system. Master all four pricing engines: Emergency Load Pricing, Spot Rate Optimization, Volume Discounts, and Warehousing Services. Includes workflow management, broker integration, and professional quote generation.',
      duration: '90 minutes',
      difficulty: 'Intermediate',
      category: 'Business',
      certification: true,
      enrolledCount: 1456,
      rating: 4.9,
      thumbnail: '💰',
    },
    {
      id: 'technology-integration-mastery',
      title: 'FleetFlow Technology Mastery',
      description:
        'Complete technology integration covering ELD systems, AI dispatcher tools, live tracking, document management, automation workflows, and platform optimization for maximum efficiency.',
      duration: '75 minutes',
      difficulty: 'Beginner',
      category: 'Technology',
      certification: true,
      enrolledCount: 1789,
      rating: 4.8,
      thumbnail: '🔧',
    },
  ];

  const filteredIntegratedCourses = integratedCourses.filter((course) => {
    const matchesCategory =
      selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredCourses = courses.filter((course) => {
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
        return '#10b981';
      case 'Intermediate':
        return '#f59e0b';
      case 'Advanced':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Operations':
        return '#3b82f6';
      case 'Compliance':
        return '#8b5cf6';
      case 'Technology':
        return '#06b6d4';
      case 'Safety':
        return '#ef4444';
      case 'Business':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const handleStartTraining = (
    courseName: string,
    role: 'dispatcher' | 'broker'
  ) => {
    if (courseName === 'Carrier Onboard Workflow') {
      setSelectedCourse('carrier-onboard-workflow');
      setActiveTab('courses');
    }
  };

  const handleCertificationComplete = (certification: any) => {
    console.info('Certification completed:', certification);
    setActiveTab('certifications');
    setSelectedCourse(null);
  };

  if (selectedCourse === 'carrier-onboard-workflow') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          padding: '20px',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setSelectedCourse(null)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            ← Back to FleetFlow University℠
          </button>
        </div>

        <CarrierOnboardWorkflowTraining
          userRole={userRole as 'dispatcher' | 'broker'}
          userName={userName}
          onTrainingComplete={handleCertificationComplete}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        padding: '20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          marginBottom: '32px',
        }}
      >
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          🎓 FleetFlow University℠
        </h1>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.3rem',
            marginBottom: '24px',
          }}
        >
          Professional training and certification for transportation excellence
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '20px',
            marginTop: '24px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📚</div>
            <div
              style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}
            >
              {courses.length}
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Courses Available
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🏆</div>
            <div
              style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}
            >
              {courses.filter((c) => c.certification).length}
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Certifications
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>👥</div>
            <div
              style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}
            >
              {courses
                .reduce((sum, course) => sum + course.enrolledCount, 0)
                .toLocaleString()}
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Students Enrolled
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>⭐</div>
            <div
              style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}
            >
              {(
                courses.reduce((sum, course) => sum + course.rating, 0) /
                courses.length
              ).toFixed(1)}
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Average Rating
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '8px',
          marginBottom: '32px',
          display: 'flex',
          gap: '8px',
        }}
      >
        {[
          {
            id: 'courses',
            label: '📚 Courses',
            desc: 'Browse training courses',
          },
          { id: 'dashboard', label: '📊 Dashboard', desc: 'Training progress' },
          {
            id: 'certifications',
            label: '🏆 Certifications',
            desc: 'Your achievements',
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background:
                activeTab === tab.id
                  ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                  : 'transparent',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              flex: 1,
              textAlign: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontSize: '1.1rem', marginBottom: '4px' }}>
              {tab.label}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{tab.desc}</div>
          </button>
        ))}
      </div>

      {/* Content Area */}
      {activeTab === 'courses' && (
        <div>
          {/* Search and Filters */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <input
                type='text'
                placeholder='Search courses...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: 'white',
                  fontSize: '1rem',
                  minWidth: '250px',
                  flex: 1,
                }}
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: 'white',
                  fontSize: '1rem',
                }}
              >
                <option value='all'>All Categories</option>
                <option value='Operations'>Operations</option>
                <option value='Compliance'>Compliance</option>
                <option value='Technology'>Technology</option>
                <option value='Safety'>Safety</option>
                <option value='Business'>Business</option>
              </select>
            </div>
          </div>

          {/* Featured Course - Carrier Onboard Workflow */}
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))',
              border: '2px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '32px',
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              <div style={{ fontSize: '3rem' }}>🚚</div>
              <div>
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.3)',
                    color: '#10b981',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    marginBottom: '8px',
                  }}
                >
                  ⭐ FEATURED COURSE
                </div>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    margin: 0,
                  }}
                >
                  Carrier Onboard Workflow
                </h2>
              </div>
            </div>

            <p
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1.1rem',
                marginBottom: '24px',
                lineHeight: '1.6',
              }}
            >
              Master FleetFlow's revolutionary automated carrier onboarding
              system. Learn to manage 24-hour onboarding workflows, document
              verification, W-9 forms, and electronic agreements with 95%
              automation.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '24px',
                marginBottom: '24px',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#10b981' }}>⏱️</span>
                <span style={{ color: 'white' }}>45 minutes</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#10b981' }}>🎯</span>
                <span style={{ color: 'white' }}>Intermediate</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#10b981' }}>🏆</span>
                <span style={{ color: 'white' }}>Certification Available</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#10b981' }}>👥</span>
                <span style={{ color: 'white' }}>847 enrolled</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#10b981' }}>⭐</span>
                <span style={{ color: 'white' }}>4.8/5 rating</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedCourse('carrier-onboard-workflow')}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              🚀 Start Training Now
            </button>
          </div>

          {/* INTEGRATED ROLE-BASED COURSES */}
          <div style={{ marginBottom: '48px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
              }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  margin: '0',
                }}
              >
                🎯 Role-Based Training Courses
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '24px',
                marginBottom: '24px',
              }}
            >
              {filteredIntegratedCourses.map((course) => (
                <div
                  key={course.id}
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '2px solid rgba(16, 185, 129, 0.3)',
                    boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedCourse(course.id)}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ fontSize: '2.5rem' }}>{course.thumbnail}</div>
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          color: 'white',
                          fontSize: '1.3rem',
                          fontWeight: 'bold',
                          margin: '0 0 8px 0',
                        }}
                      >
                        {course.title}
                      </h3>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '0.9rem',
                        }}
                      >
                        <span
                          style={{
                            background: getDifficultyColor(course.difficulty),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {course.difficulty}
                        </span>
                        <span style={{ color: '#94a3b8' }}>
                          {course.duration}
                        </span>
                        <span style={{ color: '#10b981' }}>
                          ⭐ {course.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p
                    style={{
                      color: '#94a3b8',
                      fontSize: '0.95rem',
                      lineHeight: '1.5',
                      margin: '0 0 16px 0',
                    }}
                  >
                    {course.description}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '16px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        👥 {course.enrolledCount} enrolled
                      </span>
                      {course.certification && (
                        <span style={{ color: '#10b981', fontSize: '0.9rem' }}>
                          🏆 Certified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INDIVIDUAL SPECIALIZED COURSES (Locked Section) */}
          <div style={{ marginBottom: '48px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
              }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  margin: '0',
                }}
              >
                🔒 Individual Specialized Courses
              </h2>
              <button
                onClick={() => setShowIndividualCourses(!showIndividualCourses)}
                style={{
                  background: showIndividualCourses
                    ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                    : 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.2s ease',
                }}
              >
                {showIndividualCourses
                  ? '🔒 Lock Courses'
                  : '🔓 Unlock Courses'}
              </button>
            </div>

            {showIndividualCourses && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '24px',
                }}
              >
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      if (course.id === 'carrier-onboard-workflow') {
                        setSelectedCourse(course.id);
                      }
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      <div style={{ fontSize: '2.5rem' }}>
                        {course.thumbnail}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            color: 'white',
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                            margin: '0 0 8px 0',
                          }}
                        >
                          {course.title}
                        </h3>
                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span
                            style={{
                              background:
                                getCategoryColor(course.category) + '30',
                              color: getCategoryColor(course.category),
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              fontWeight: 'bold',
                            }}
                          >
                            {course.category}
                          </span>
                          <span
                            style={{
                              background:
                                getDifficultyColor(course.difficulty) + '30',
                              color: getDifficultyColor(course.difficulty),
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              fontWeight: 'bold',
                            }}
                          >
                            {course.difficulty}
                          </span>
                          {course.certification && (
                            <span
                              style={{
                                background: 'rgba(251, 191, 36, 0.3)',
                                color: '#fbbf24',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                              }}
                            >
                              🏆 Certification
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '16px',
                        lineHeight: '1.5',
                      }}
                    >
                      {course.description}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.9rem',
                          }}
                        >
                          ⏱️ {course.duration}
                        </span>
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.9rem',
                          }}
                        >
                          👥 {course.enrolledCount.toLocaleString()}
                        </span>
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.9rem',
                          }}
                        >
                          ⭐ {course.rating}
                        </span>
                      </div>
                    </div>

                    {course.prerequisite && (
                      <div
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          marginBottom: '16px',
                        }}
                      >
                        <span
                          style={{
                            color: '#ef4444',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                          }}
                        >
                          📋 Prerequisites: {course.prerequisite.join(', ')}
                        </span>
                      </div>
                    )}

                    <button
                      style={{
                        background:
                          course.id === 'carrier-onboard-workflow'
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        width: '100%',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {course.id === 'carrier-onboard-workflow'
                        ? '🚀 Start Now'
                        : '📚 View Course'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'dashboard' && (
        <CarrierOnboardWorkflowTrainingDashboard
          onStartTraining={handleStartTraining}
        />
      )}

      {activeTab === 'certifications' && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '16px',
            }}
          >
            🏆 Your Certifications
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1.1rem',
              marginBottom: '32px',
            }}
          >
            Manage and view all your FleetFlow University℠ certifications
          </p>

          <div
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
            <h3 style={{ color: 'white', marginBottom: '12px' }}>
              Complete Training to Earn Certifications
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Start with the Carrier Onboard Workflow training to earn your
              first certification!
            </p>
            <button
              onClick={() => setActiveTab('courses')}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '16px',
              }}
            >
              Browse Courses
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
