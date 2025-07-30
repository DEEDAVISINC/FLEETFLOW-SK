'use client';

import React, { useState } from 'react';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
  locked: boolean;
  content: {
    overview: string;
    learningObjectives: string[];
    keyTopics: string[];
    practicalExercises: string[];
    assessmentCriteria: string[];
  };
}

export default function AITrainingPage() {
  const [activeModule, setActiveModule] = useState<string>('ai-fundamentals');
  const [userProgress, setUserProgress] = useState<{[key: string]: boolean}>({
    'ai-fundamentals': false,
    'ai-flow-system': false,
    'dispatcher-ai': false,
    'broker-ai': false,
    'system-ai': false,
    'performance-analytics': false,
    'troubleshooting': false
  });

  const trainingModules: TrainingModule[] = [
    {
      id: 'ai-fundamentals',
      title: '🤖 AI Fundamentals',
      description: 'Introduction to artificial intelligence in transportation',
      duration: '45 min',
      difficulty: 'Beginner',
      completed: userProgress['ai-fundamentals'],
      locked: false,
      content: {
        overview: 'This module introduces the fundamental concepts of artificial intelligence as applied to transportation and logistics. You\'ll learn how AI systems work, their benefits, and how FleetFlow integrates AI throughout the platform.',
        learningObjectives: [
          'Understand basic AI concepts and terminology',
          'Identify AI applications in transportation',
          'Recognize the benefits of AI-powered systems',
          'Navigate FleetFlow\'s AI interfaces',
          'Interpret AI recommendations and outputs'
        ],
        keyTopics: [
          'What is Artificial Intelligence?',
          'Machine Learning vs Traditional Programming',
          'AI in Transportation Industry',
          'FleetFlow AI Architecture Overview',
          'Data-Driven Decision Making',
          'Understanding AI Confidence Scores',
          'Human-AI Collaboration Best Practices'
        ],
        practicalExercises: [
          'Navigate the AI Flow dashboard',
          'Interpret AI recommendation scores',
          'Practice reading AI workflow steps',
          'Complete AI terminology quiz',
          'Review real AI decision examples'
        ],
        assessmentCriteria: [
          'Define key AI terms accurately (20%)',
          'Identify AI features in FleetFlow (25%)',
          'Explain benefits of AI automation (20%)',
          'Navigate AI interfaces successfully (20%)',
          'Interpret AI recommendations correctly (15%)'
        ]
      }
    },
    {
      id: 'ai-flow-system',
      title: '🔄 AI Flow System',
      description: 'Master the AI workflow monitoring and management system',
      duration: '60 min',
      difficulty: 'Intermediate',
      completed: userProgress['ai-flow-system'],
      locked: !userProgress['ai-fundamentals'],
      content: {
        overview: 'Deep dive into FleetFlow\'s AI Flow system, learning to monitor, understand, and optimize AI workflows across dispatcher, broker, and system operations.',
        learningObjectives: [
          'Navigate the AI Flow dashboard effectively',
          'Monitor AI workflow performance',
          'Understand role-based AI systems',
          'Interpret workflow metrics and indicators',
          'Optimize AI system performance'
        ],
        keyTopics: [
          'AI Flow Dashboard Navigation',
          'Role-Based AI Systems Overview',
          'Workflow Status Indicators',
          'Performance Metrics Interpretation',
          'Real-Time Monitoring Techniques',
          'AI System Health Assessment',
          'Workflow Optimization Strategies'
        ],
        practicalExercises: [
          'Complete AI Flow dashboard tour',
          'Monitor live AI workflows',
          'Analyze performance metrics',
          'Practice role switching',
          'Identify optimization opportunities'
        ],
        assessmentCriteria: [
          'Navigate AI Flow dashboard (25%)',
          'Interpret workflow metrics (25%)',
          'Monitor system performance (20%)',
          'Understand role-based systems (20%)',
          'Identify optimization needs (10%)'
        ]
      }
    },
    {
      id: 'dispatcher-ai',
      title: '🚛 Dispatcher AI Workflow',
      description: 'AI-powered load matching and route optimization for dispatchers',
      duration: '55 min',
      difficulty: 'Intermediate',
      completed: userProgress['dispatcher-ai'],
      locked: !userProgress['ai-flow-system'],
      content: {
        overview: 'Specialized training for dispatchers on using AI for load analysis, carrier matching, route optimization, and capacity forecasting.',
        learningObjectives: [
          'Master AI-powered load matching processes',
          'Utilize dynamic route optimization',
          'Implement capacity forecasting strategies',
          'Optimize dispatcher workflows with AI',
          'Provide effective AI feedback'
        ],
        keyTopics: [
          'Intelligent Load Analysis Process',
          'Carrier Database Scanning Techniques',
          'Route Optimization Algorithms',
          'Capacity Forecasting Methods',
          'Performance Metrics for Dispatchers',
          'AI Recommendation Evaluation',
          'Feedback and Continuous Improvement'
        ],
        practicalExercises: [
          'Process load requests with AI assistance',
          'Evaluate carrier match recommendations',
          'Optimize routes using AI suggestions',
          'Practice capacity planning scenarios',
          'Rate AI recommendations for improvement'
        ],
        assessmentCriteria: [
          'Execute load matching process (30%)',
          'Evaluate AI recommendations (25%)',
          'Optimize routes effectively (25%)',
          'Forecast capacity accurately (15%)',
          'Provide quality feedback (5%)'
        ]
      }
    },
    {
      id: 'broker-ai',
      title: '🏢 Broker AI Workflow',
      description: 'AI-driven sales optimization and customer relationship management',
      duration: '50 min',
      difficulty: 'Intermediate',
      completed: userProgress['broker-ai'],
      locked: !userProgress['ai-flow-system'],
      content: {
        overview: 'Comprehensive training for brokers on leveraging AI for lead scoring, pricing optimization, and customer relationship management.',
        learningObjectives: [
          'Implement intelligent lead scoring systems',
          'Utilize dynamic pricing strategies',
          'Enhance customer relationships with AI',
          'Optimize sales processes and outcomes',
          'Maximize revenue through AI insights'
        ],
        keyTopics: [
          'Lead Scoring Algorithms and Process',
          'Dynamic Pricing Engine Operation',
          'Customer Relationship AI Tools',
          'Market Analysis and Competitive Intelligence',
          'Sales Performance Optimization',
          'Revenue Maximization Strategies',
          'Customer Retention AI Techniques'
        ],
        practicalExercises: [
          'Score and prioritize lead prospects',
          'Generate optimized pricing quotes',
          'Develop customer engagement strategies',
          'Analyze market positioning data',
          'Practice relationship management scenarios'
        ],
        assessmentCriteria: [
          'Score leads accurately (25%)',
          'Generate optimal pricing (30%)',
          'Manage customer relationships (25%)',
          'Analyze market data (15%)',
          'Optimize sales performance (5%)'
        ]
      }
    },
    {
      id: 'system-ai',
      title: '⚙️ System AI Administration',
      description: 'Advanced AI system management and optimization',
      duration: '65 min',
      difficulty: 'Advanced',
      completed: userProgress['system-ai'],
      locked: !userProgress['ai-flow-system'],
      content: {
        overview: 'Advanced training for system administrators on predictive maintenance, compliance monitoring, and business intelligence systems.',
        learningObjectives: [
          'Implement predictive maintenance strategies',
          'Monitor compliance automatically',
          'Generate business intelligence insights',
          'Optimize system performance',
          'Manage AI system health and maintenance'
        ],
        keyTopics: [
          'Predictive Maintenance AI Systems',
          'Automated Compliance Monitoring',
          'Business Intelligence Engine Operation',
          'System Performance Optimization',
          'AI Health Monitoring and Diagnostics',
          'Data Quality Management',
          'Advanced Analytics and Reporting'
        ],
        practicalExercises: [
          'Configure predictive maintenance alerts',
          'Set up compliance monitoring rules',
          'Generate business intelligence reports',
          'Optimize system performance parameters',
          'Troubleshoot AI system issues'
        ],
        assessmentCriteria: [
          'Configure maintenance systems (25%)',
          'Implement compliance monitoring (25%)',
          'Generate BI insights (20%)',
          'Optimize system performance (20%)',
          'Troubleshoot effectively (10%)'
        ]
      }
    },
    {
      id: 'performance-analytics',
      title: '📊 AI Performance Analytics',
      description: 'Understanding and optimizing AI system performance',
      duration: '40 min',
      difficulty: 'Intermediate',
      completed: userProgress['performance-analytics'],
      locked: !userProgress['ai-fundamentals'],
      content: {
        overview: 'Learn to interpret AI performance metrics, identify optimization opportunities, and continuously improve AI system effectiveness.',
        learningObjectives: [
          'Interpret AI performance metrics accurately',
          'Identify system optimization opportunities',
          'Implement performance improvement strategies',
          'Monitor long-term AI effectiveness',
          'Create performance reports and insights'
        ],
        keyTopics: [
          'Key Performance Indicators (KPIs)',
          'Metric Interpretation and Analysis',
          'Performance Benchmarking',
          'Optimization Strategy Development',
          'Continuous Improvement Processes',
          'Performance Reporting Techniques',
          'ROI Measurement and Analysis'
        ],
        practicalExercises: [
          'Analyze current AI performance metrics',
          'Identify improvement opportunities',
          'Create performance dashboards',
          'Develop optimization strategies',
          'Generate performance reports'
        ],
        assessmentCriteria: [
          'Interpret metrics correctly (30%)',
          'Identify optimization opportunities (25%)',
          'Develop improvement strategies (25%)',
          'Create effective reports (15%)',
          'Measure ROI accurately (5%)'
        ]
      }
    },
    {
      id: 'troubleshooting',
      title: '🔍 AI System Troubleshooting',
      description: 'Diagnose and resolve AI system issues',
      duration: '35 min',
      difficulty: 'Advanced',
      completed: userProgress['troubleshooting'],
      locked: !userProgress['performance-analytics'],
      content: {
        overview: 'Advanced troubleshooting techniques for AI systems, including common issues, diagnostic procedures, and resolution strategies.',
        learningObjectives: [
          'Diagnose common AI system issues',
          'Implement effective troubleshooting procedures',
          'Resolve performance and accuracy problems',
          'Maintain optimal AI system health',
          'Prevent future system issues'
        ],
        keyTopics: [
          'Common AI System Issues',
          'Diagnostic Procedures and Tools',
          'Performance Troubleshooting',
          'Accuracy and Recommendation Issues',
          'System Health Monitoring',
          'Preventive Maintenance Strategies',
          'Escalation Procedures'
        ],
        practicalExercises: [
          'Diagnose system performance issues',
          'Troubleshoot recommendation accuracy',
          'Resolve data quality problems',
          'Implement preventive measures',
          'Practice escalation procedures'
        ],
        assessmentCriteria: [
          'Diagnose issues accurately (30%)',
          'Implement solutions effectively (30%)',
          'Resolve problems independently (25%)',
          'Prevent future issues (10%)',
          'Follow escalation procedures (5%)'
        ]
      }
    }
  ];

  const completeModule = (moduleId: string) => {
    setUserProgress(prev => ({ ...prev, [moduleId]: true }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const activeModuleData = trainingModules.find(m => m.id === activeModule);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white',
      paddingTop: '80px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '32px',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            margin: '0 0 16px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>🎓 AI Training Academy</h1>
          <p style={{
            fontSize: '1.2rem',
            margin: '0 0 24px 0',
            opacity: 0.9
          }}>Master FleetFlow's AI systems with comprehensive, hands-on training</p>
          
          {/* Progress Overview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
            marginTop: '24px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📚</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {Object.values(userProgress).filter(Boolean).length}/{trainingModules.length}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Modules Complete</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⏱️</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>6.5 hrs</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Total Training</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏆</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {trainingModules.filter(m => m.content && userProgress[m.id]).length}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Certifications</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
          {/* Module List */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            height: 'fit-content'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              margin: '0 0 20px 0'
            }}>Training Modules</h2>
            
            {trainingModules.map(module => (
              <button
                key={module.id}
                onClick={() => !module.locked && setActiveModule(module.id)}
                disabled={module.locked}
                style={{
                  width: '100%',
                  background: activeModule === module.id 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : module.locked 
                      ? 'rgba(0, 0, 0, 0.2)'
                      : 'rgba(255, 255, 255, 0.1)',
                  border: `2px solid ${activeModule === module.id ? '#fbbf24' : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  cursor: module.locked ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  color: module.locked ? 'rgba(255, 255, 255, 0.5)' : 'white',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    margin: 0
                  }}>
                    {module.title}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {module.completed && <span style={{ color: '#10b981' }}>✓</span>}
                    {module.locked && <span style={{ color: '#6b7280' }}>🔒</span>}
                  </div>
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  opacity: 0.8,
                  marginBottom: '8px'
                }}>
                  {module.description}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '0.7rem',
                    background: getDifficultyColor(module.difficulty),
                    padding: '2px 6px',
                    borderRadius: '6px',
                    color: 'white'
                  }}>
                    {module.difficulty}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    opacity: 0.8
                  }}>
                    {module.duration}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Module Content */}
          {activeModuleData && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '32px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              {/* Module Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  margin: 0
                }}>
                  {activeModuleData.title}
                </h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{
                    background: getDifficultyColor(activeModuleData.difficulty),
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {activeModuleData.difficulty}
                  </span>
                  <span style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}>
                    {activeModuleData.duration}
                  </span>
                </div>
              </div>

              {/* Overview */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  margin: '0 0 12px 0',
                  color: '#fbbf24'
                }}>
                  📋 Module Overview
                </h3>
                <p style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  margin: 0,
                  opacity: 0.9
                }}>
                  {activeModuleData.content.overview}
                </p>
              </div>

              {/* Learning Objectives */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  margin: '0 0 12px 0',
                  color: '#fbbf24'
                }}>
                  🎯 Learning Objectives
                </h3>
                <ul style={{
                  margin: 0,
                  paddingLeft: '20px'
                }}>
                  {activeModuleData.content.learningObjectives.map((objective, index) => (
                    <li key={index} style={{
                      fontSize: '1rem',
                      marginBottom: '8px',
                      opacity: 0.9
                    }}>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Topics */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  margin: '0 0 12px 0',
                  color: '#fbbf24'
                }}>
                  📚 Key Topics Covered
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '12px'
                }}>
                  {activeModuleData.content.keyTopics.map((topic, index) => (
                    <div key={index} style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      {topic}
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Exercises */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  margin: '0 0 12px 0',
                  color: '#fbbf24'
                }}>
                  🔧 Practical Exercises
                </h3>
                <ul style={{
                  margin: 0,
                  paddingLeft: '20px'
                }}>
                  {activeModuleData.content.practicalExercises.map((exercise, index) => (
                    <li key={index} style={{
                      fontSize: '1rem',
                      marginBottom: '8px',
                      opacity: 0.9
                    }}>
                      {exercise}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Assessment Criteria */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  margin: '0 0 12px 0',
                  color: '#fbbf24'
                }}>
                  ✅ Assessment Criteria
                </h3>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  {activeModuleData.content.assessmentCriteria.map((criteria, index) => (
                    <div key={index} style={{
                      fontSize: '0.9rem',
                      marginBottom: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>{criteria}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={() => alert('Starting training module...')}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}
                >
                  🚀 Start Training
                </button>
                
                <button
                  onClick={() => window.location.href = '/ai'}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  🔄 Go to AI Flow
                </button>

                {activeModuleData.completed && (
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                      color: 'white',
                      padding: '16px 32px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    🏆 View Certificate
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
