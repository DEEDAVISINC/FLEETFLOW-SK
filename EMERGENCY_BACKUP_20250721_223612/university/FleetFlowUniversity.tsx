'use client';

import React, { useState } from 'react';
import { CarrierOnboardWorkflowTraining } from '../training/CarrierOnboardWorkflowTraining';
import { CarrierOnboardWorkflowTrainingDashboard } from '../training/CarrierOnboardWorkflowTrainingDashboard';
import { CarrierOnboardWorkflowCertification } from '../training/CarrierOnboardWorkflowCertification';

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
  isEnrolled?: boolean;
}

export const FleetFlowUniversity: React.FC<FleetFlowUniversityProps> = ({
  userRole,
  userName,
  isEnrolled = false
}) => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'dashboard' | 'certifications'>('courses');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const courses: Course[] = [
    {
      id: 'carrier-onboard-workflow',
      title: 'Carrier Onboard Workflow',
      description: 'Master the automated 24-hour carrier onboarding process with document verification, W-9 forms, and electronic agreements.',
      duration: '45 minutes',
      difficulty: 'Intermediate',
      category: 'Operations',
      certification: true,
      enrolledCount: 847,
      rating: 4.8,
      thumbnail: '🚚'
    },
    {
      id: 'fmcsa-compliance-2025',
      title: 'FMCSA Compliance 2025',
      description: 'Stay current with the latest FMCSA regulations, safety requirements, and compliance standards for 2025.',
      duration: '60 minutes',
      difficulty: 'Advanced',
      category: 'Compliance',
      prerequisite: ['carrier-onboard-workflow'],
      certification: true,
      enrolledCount: 623,
      rating: 4.9,
      thumbnail: '⚖️'
    },
    {
      id: 'dispatch-optimization',
      title: 'Advanced Dispatch Optimization',
      description: 'Learn advanced techniques for load matching, route optimization, and carrier performance management.',
      duration: '90 minutes',
      difficulty: 'Advanced',
      category: 'Operations',
      certification: true,
      enrolledCount: 456,
      rating: 4.7,
      thumbnail: '📊'
    },
    {
      id: 'eld-technology-training',
      title: 'ELD Technology & Integration',
      description: 'Comprehensive training on Electronic Logging Devices, integration requirements, and compliance monitoring.',
      duration: '30 minutes',
      difficulty: 'Beginner',
      category: 'Technology',
      certification: false,
      enrolledCount: 1024,
      rating: 4.6,
      thumbnail: '📱'
    },
    {
      id: 'safety-management-systems',
      title: 'Safety Management Systems',
      description: 'Implement and manage comprehensive safety programs for transportation operations.',
      duration: '75 minutes',
      difficulty: 'Intermediate',
      category: 'Safety',
      certification: true,
      enrolledCount: 389,
      rating: 4.8,
      thumbnail: '🛡️'
    },
    {
      id: 'customer-service-excellence',
      title: 'Customer Service Excellence',
      description: 'Develop professional communication skills and customer relationship management techniques.',
      duration: '40 minutes',
      difficulty: 'Beginner',
      category: 'Business',
      certification: false,
      enrolledCount: 712,
      rating: 4.5,
      thumbnail: '🤝'
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Operations': return '#3b82f6';
      case 'Compliance': return '#8b5cf6';
      case 'Technology': return '#06b6d4';
      case 'Safety': return '#ef4444';
      case 'Business': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleStartTraining = (courseName: string, role: 'dispatcher' | 'broker') => {
    if (courseName === 'Carrier Onboard Workflow') {
      setSelectedCourse('carrier-onboard-workflow');
      setActiveTab('courses');
    }
  };

  const handleCertificationComplete = (certification: any) => {
    console.log('Certification completed:', certification);
    setActiveTab('certifications');
    setSelectedCourse(null);
  };

  if (selectedCourse === 'carrier-onboard-workflow') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '20px' }}>
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
              fontWeight: 'bold'
            }}
          >
            ← Back to FleetFlow University
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b, #0f172a)',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '32px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          color: 'white', 
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px'
        }}>
          🎓 FleetFlow University
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.3rem', marginBottom: '24px' }}>
          Professional training and certification for transportation excellence
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '20px',
          marginTop: '24px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📚</div>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>{courses.length}</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Courses Available</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🏆</div>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>
              {courses.filter(c => c.certification).length}
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Certifications</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>👥</div>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>
              {courses.reduce((sum, course) => sum + course.enrolledCount, 0).toLocaleString()}
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Students Enrolled</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>⭐</div>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>
              {(courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)}
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Average Rating</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '8px',
        marginBottom: '32px',
        display: 'flex',
        gap: '8px'
      }}>
        {[
          { id: 'courses', label: '📚 Courses', desc: 'Browse training courses' },
          { id: 'dashboard', label: '📊 Dashboard', desc: 'Training progress' },
          { id: 'certifications', label: '🏆 Certifications', desc: 'Your achievements' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background: activeTab === tab.id 
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
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{tab.label}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{tab.desc}</div>
          </button>
        ))}
      </div>

      {/* Content Area */}
      {activeTab === 'courses' && (
        <div>
          {/* Search and Filters */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search courses..."
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
                  flex: 1
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
                  fontSize: '1rem'
                }}
              >
                <option value="all">All Categories</option>
                <option value="Operations">Operations</option>
                <option value="Compliance">Compliance</option>
                <option value="Technology">Technology</option>
                <option value="Safety">Safety</option>
                <option value="Business">Business</option>
              </select>
            </div>
          </div>

          {/* Featured Course - Carrier Onboard Workflow */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))',
            border: '2px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '3rem' }}>🚚</div>
              <div>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  display: 'inline-block',
                  marginBottom: '8px'
                }}>
                  ⭐ FEATURED COURSE
                </div>
                <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                  Carrier Onboard Workflow
                </h2>
              </div>
            </div>
            
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem', marginBottom: '24px', lineHeight: '1.6' }}>
              Master FleetFlow's revolutionary automated carrier onboarding system. Learn to manage 24-hour onboarding 
              workflows, document verification, W-9 forms, and electronic agreements with 95% automation.
            </p>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#10b981' }}>⏱️</span>
                <span style={{ color: 'white' }}>45 minutes</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#10b981' }}>🎯</span>
                <span style={{ color: 'white' }}>Intermediate</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#10b981' }}>🏆</span>
                <span style={{ color: 'white' }}>Certification Available</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#10b981' }}>👥</span>
                <span style={{ color: 'white' }}>847 enrolled</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                transition: 'all 0.2s ease'
              }}
            >
              🚀 Start Training Now
            </button>
          </div>

          {/* Course Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px'
          }}>
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
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (course.id === 'carrier-onboard-workflow') {
                    setSelectedCourse(course.id);
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '2.5rem' }}>{course.thumbnail}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                      {course.title}
                    </h3>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{
                        background: getCategoryColor(course.category) + '30',
                        color: getCategoryColor(course.category),
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {course.category}
                      </span>
                      <span style={{
                        background: getDifficultyColor(course.difficulty) + '30',
                        color: getDifficultyColor(course.difficulty),
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {course.difficulty}
                      </span>
                      {course.certification && (
                        <span style={{
                          background: 'rgba(251, 191, 36, 0.3)',
                          color: '#fbbf24',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}>
                          🏆 Certification
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px', lineHeight: '1.5' }}>
                  {course.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                      ⏱️ {course.duration}
                    </span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                      👥 {course.enrolledCount.toLocaleString()}
                    </span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                      ⭐ {course.rating}
                    </span>
                  </div>
                </div>

                {course.prerequisite && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    marginBottom: '16px'
                  }}>
                    <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      📋 Prerequisites: {course.prerequisite.join(', ')}
                    </span>
                  </div>
                )}

                <button
                  style={{
                    background: course.id === 'carrier-onboard-workflow' 
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {course.id === 'carrier-onboard-workflow' ? '🚀 Start Now' : '📚 View Course'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'dashboard' && (
        <CarrierOnboardWorkflowTrainingDashboard
          onStartTraining={handleStartTraining}
        />
      )}

      {activeTab === 'certifications' && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px' }}>
            🏆 Your Certifications
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', marginBottom: '32px' }}>
            Manage and view all your FleetFlow University certifications
          </p>
          
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📚</div>
            <h3 style={{ color: 'white', marginBottom: '12px' }}>Complete Training to Earn Certifications</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Start with the Carrier Onboard Workflow training to earn your first certification!
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
                marginTop: '16px'
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
