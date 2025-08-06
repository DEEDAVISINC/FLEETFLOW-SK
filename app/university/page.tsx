'use client';

import Link from 'next/link';
import React, { useState } from 'react';

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

interface AITrainingModule {
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
  };
}

export default function UniversityPage() {
  const [activeTab, setActiveTab] = useState<
    | 'hub'
    | 'courses'
    | 'certifications'
    | 'ai-training'
    | 'occupational-training'
  >('hub');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAIModule, setActiveAIModule] =
    useState<string>('ai-fundamentals');
  const [activeOccupationalModule, setActiveOccupationalModule] =
    useState<string>('');
  const [aiProgress, setAIProgress] = useState<{ [key: string]: boolean }>({
    'ai-fundamentals': false,
    'ai-flow-system': false,
    'dispatcher-ai': false,
    'broker-ai': false,
    'system-ai': false,
    'performance-analytics': false,
    troubleshooting: false,
  });

  const [occupationalProgress, setOccupationalProgress] = useState<{
    [key: string]: boolean;
  }>({
    'carrier-onboarding-center': false,
    'dispatch-central': false,
    'broker-operations': false,
    'maintenance-management': false,
    'accounting-system': false,
    'safety-compliance': false,
    'live-tracking': false,
    'university-portal': false,
    'freightflow-rfx': false,
    'ai-dispatcher': false,
    'document-management': false,
  });

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    // Check URL parameters to set active tab
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (
      tab &&
      [
        'hub',
        'courses',
        'ai-training',
        'certifications',
        'occupational-training',
      ].includes(tab)
    ) {
      setActiveTab(tab as any);
    }
  }, []);

  const occupationalTrainingModules = [
    {
      id: 'carrier-onboarding-center',
      title: 'Carrier Onboarding Center',
      description:
        'Master the comprehensive carrier onboarding workflow including FMCSA verification, documentation, and portal setup.',
      duration: '60 min',
      difficulty: 'Intermediate',
      category: 'Operations',
      certification: true,
      quizQuestions: 15,
      practicalExercises: 3,
      thumbnail: '🚛',
      modules: [
        'FMCSA Verification Process',
        'Document Management System',
        'Factoring Company Setup',
        'Agreement Generation',
        'Portal Configuration',
        'Onboarding Workflow Optimization',
      ],
    },
    {
      id: 'dispatch-central',
      title: 'Dispatch Central Operations',
      description:
        'Complete training on dispatch operations, load management, and carrier coordination.',
      duration: '50 min',
      difficulty: 'Intermediate',
      category: 'Operations',
      certification: true,
      quizQuestions: 12,
      practicalExercises: 4,
      thumbnail: '📋',
      modules: [
        'Load Board Management',
        'Carrier Assignment',
        'Route Optimization',
        'Real-time Tracking',
        'Communication Protocols',
        'Emergency Procedures',
      ],
    },
    {
      id: 'broker-operations',
      title: 'Broker Operations Management',
      description:
        'Advanced broker operations including load posting, carrier sourcing, and rate negotiations.',
      duration: '55 min',
      difficulty: 'Advanced',
      category: 'Business',
      certification: true,
      quizQuestions: 18,
      practicalExercises: 5,
      thumbnail: '🏢',
      modules: [
        'Load Posting Strategies',
        'Carrier Sourcing',
        'Rate Negotiations',
        'Market Analysis',
        'Risk Management',
        'Performance Metrics',
      ],
    },
    {
      id: 'maintenance-management',
      title: 'Maintenance Management Center',
      description:
        'Fleet maintenance scheduling, work order management, and compliance tracking.',
      duration: '45 min',
      difficulty: 'Intermediate',
      category: 'Operations',
      certification: true,
      quizQuestions: 10,
      practicalExercises: 3,
      thumbnail: '🔧',
      modules: [
        'Preventive Maintenance',
        'Work Order System',
        'Compliance Tracking',
        'Vendor Management',
        'Cost Analysis',
        'Fleet Optimization',
      ],
    },
    {
      id: 'accounting-system',
      title: 'Accounting System Mastery',
      description:
        'Complete accounting system training including invoicing, payments, and financial reporting.',
      duration: '70 min',
      difficulty: 'Advanced',
      category: 'Business',
      certification: true,
      quizQuestions: 20,
      practicalExercises: 6,
      thumbnail: '💰',
      modules: [
        'Invoice Processing',
        'Payment Management',
        'Financial Reporting',
        'Tax Preparation',
        'Audit Trails',
        'Integration Systems',
      ],
    },
    {
      id: 'safety-compliance',
      title: 'Safety & Compliance Operations',
      description:
        'DOT compliance, safety protocols, and regulatory requirements management.',
      duration: '65 min',
      difficulty: 'Advanced',
      category: 'Compliance',
      certification: true,
      quizQuestions: 16,
      practicalExercises: 4,
      thumbnail: '🛡️',
      modules: [
        'DOT Regulations',
        'Safety Protocols',
        'Compliance Audits',
        'Driver Monitoring',
        'Incident Management',
        'Regulatory Updates',
      ],
    },
    {
      id: 'live-tracking',
      title: 'Live Load Tracking System',
      description:
        'Real-time tracking, route monitoring, and delivery management system.',
      duration: '40 min',
      difficulty: 'Beginner',
      category: 'Technology',
      certification: true,
      quizQuestions: 8,
      practicalExercises: 2,
      thumbnail: '📍',
      modules: [
        'GPS Tracking',
        'Route Monitoring',
        'Delivery Updates',
        'Alert Systems',
        'Customer Communications',
        'Performance Analytics',
      ],
    },
    {
      id: 'university-portal',
      title: 'FleetFlow University℠ Portal',
      description:
        'Training management, course creation, and certification tracking.',
      duration: '35 min',
      difficulty: 'Beginner',
      category: 'Technology',
      certification: true,
      quizQuestions: 6,
      practicalExercises: 2,
      thumbnail: '🎓',
      modules: [
        'Course Management',
        'User Progress Tracking',
        'Certification System',
        'Content Creation',
        'Assessment Tools',
        'Reporting Dashboard',
      ],
    },
    {
      id: 'freightflow-rfx',
      title: 'FreightFlow RFx System',
      description:
        'Request for proposal system, bid management, and vendor selection.',
      duration: '55 min',
      difficulty: 'Intermediate',
      category: 'Business',
      certification: true,
      quizQuestions: 14,
      practicalExercises: 4,
      thumbnail: '📊',
      modules: [
        'RFP Creation',
        'Bid Management',
        'Vendor Evaluation',
        'Contract Negotiation',
        'Performance Monitoring',
        'Renewal Process',
      ],
    },
    {
      id: 'ai-dispatcher',
      title: 'AI Dispatcher Integration',
      description:
        'Advanced AI-powered dispatch automation and optimization systems.',
      duration: '60 min',
      difficulty: 'Advanced',
      category: 'Technology',
      certification: true,
      quizQuestions: 12,
      practicalExercises: 3,
      thumbnail: '🤖',
      modules: [
        'AI Algorithm Understanding',
        'Automation Setup',
        'Machine Learning Models',
        'Performance Optimization',
        'Integration Management',
        'Troubleshooting AI Systems',
      ],
    },
    {
      id: 'document-management',
      title: 'Document Management Center',
      description:
        'Master document upload, categorization, approval workflows, and compliance tracking.',
      duration: '40 min',
      difficulty: 'Intermediate',
      category: 'Operations',
      certification: true,
      quizQuestions: 10,
      practicalExercises: 4,
      thumbnail: '📄',
      modules: [
        'Document Upload & Organization',
        'Categorization Systems',
        'Approval Workflows',
        'Compliance Tracking',
        'Search & Filtering',
        'Bulk Operations & Export',
      ],
    },
  ];

  // ROLE-BASED COMPREHENSIVE COURSES (Featured)
  const integratedCourses: Course[] = [
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
      thumbnail: '📋',
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

  const courses: Course[] = [
    {
      id: 'carrier-onboard-workflow',
      title: 'Carrier Onboard Workflow',
      description:
        'Master the automated 24-hour carrier onboarding process with document verification.',
      duration: '45 min',
      difficulty: 'Intermediate',
      category: 'Operations',
      certification: true,
      enrolledCount: 847,
      rating: 4.8,
      thumbnail: '🚚',
    },
    {
      id: 'workflow-ecosystem',
      title: 'Workflow Ecosystem',
      description:
        'Complete workflow management system integration and optimization.',
      duration: '60 min',
      difficulty: 'Intermediate',
      category: 'Operations',
      certification: true,
      enrolledCount: 623,
      rating: 4.9,
      thumbnail: '⚙️',
    },
    {
      id: 'customer-service',
      title: 'Customer Service Excellence',
      description:
        'Professional customer service standards and communication protocols.',
      duration: '40 min',
      difficulty: 'Beginner',
      category: 'Business',
      certification: true,
      enrolledCount: 592,
      rating: 4.7,
      thumbnail: '📞',
    },
    {
      id: 'freight-broker-agent',
      title: 'Freight Broker Agent',
      description:
        'Essential knowledge for freight broker agents including regulations and best practices.',
      duration: '90 min',
      difficulty: 'Beginner',
      category: 'Business',
      certification: true,
      enrolledCount: 294,
      rating: 4.5,
      thumbnail: '🏢',
    },
    {
      id: 'fmcsa-compliance-2025',
      title: 'FMCSA Compliance 2025',
      description:
        'Current FMCSA regulations, safety requirements, and compliance standards.',
      duration: '55 min',
      difficulty: 'Advanced',
      category: 'Compliance',
      certification: true,
      enrolledCount: 478,
      rating: 4.9,
      thumbnail: '⚖️',
    },
    {
      id: 'dispatch-optimization',
      title: 'Dispatch Optimization',
      description:
        'Advanced load matching, route optimization, and carrier performance management.',
      duration: '50 min',
      difficulty: 'Advanced',
      category: 'Operations',
      certification: true,
      enrolledCount: 456,
      rating: 4.7,
      thumbnail: '📊',
    },
    {
      id: 'dot-compliance-training',
      title: 'DOT Compliance Training',
      description:
        'Department of Transportation regulations and compliance requirements.',
      duration: '65 min',
      difficulty: 'Intermediate',
      category: 'Compliance',
      certification: true,
      enrolledCount: 389,
      rating: 4.8,
      thumbnail: '🛡️',
    },
    {
      id: 'eld-technology-training',
      title: 'ELD Technology & Integration',
      description:
        'Electronic Logging Devices, integration requirements, and compliance monitoring.',
      duration: '30 min',
      difficulty: 'Beginner',
      category: 'Technology',
      certification: false,
      enrolledCount: 1024,
      rating: 4.6,
      thumbnail: '📱',
    },
    {
      id: 'safety-management-systems',
      title: 'Safety Management Systems',
      description:
        'Comprehensive safety programs for transportation operations.',
      duration: '45 min',
      difficulty: 'Intermediate',
      category: 'Safety',
      certification: true,
      enrolledCount: 367,
      rating: 4.8,
      thumbnail: '🦺',
    },
    {
      id: 'route-optimization',
      title: 'Route Optimization & Planning',
      description:
        'Advanced route planning, fuel efficiency, and delivery optimization.',
      duration: '40 min',
      difficulty: 'Intermediate',
      category: 'Operations',
      certification: true,
      enrolledCount: 512,
      rating: 4.6,
      thumbnail: '🗺️',
    },
    {
      id: 'load-matching',
      title: 'Load Matching Strategies',
      description:
        'Effective load matching techniques and carrier selection criteria.',
      duration: '35 min',
      difficulty: 'Beginner',
      category: 'Operations',
      certification: false,
      enrolledCount: 678,
      rating: 4.5,
      thumbnail: '🎯',
    },
    {
      id: 'financial-management',
      title: 'Transportation Finance',
      description:
        'Financial management, invoicing, and payment processing systems.',
      duration: '50 min',
      difficulty: 'Intermediate',
      category: 'Business',
      certification: true,
      enrolledCount: 298,
      rating: 4.7,
      thumbnail: '💰',
    },
    {
      id: 'ai-fundamentals',
      title: 'AI Fundamentals for Transportation',
      description:
        'Introduction to artificial intelligence in transportation management and fleet operations.',
      duration: '45 min',
      difficulty: 'Beginner',
      category: 'Technology',
      certification: true,
      enrolledCount: 1247,
      rating: 4.9,
      thumbnail: '🤖',
    },
    {
      id: 'ai-flow-system-training',
      title: 'AI Flow System Mastery',
      description:
        "Complete guide to using FleetFlow's AI workflow system for dispatchers, brokers, and administrators.",
      duration: '60 min',
      difficulty: 'Intermediate',
      category: 'Technology',
      certification: true,
      enrolledCount: 892,
      rating: 4.8,
      thumbnail: '🔄',
    },
    {
      id: 'dispatcher-ai-workflow',
      title: 'Dispatcher AI Workflow Training',
      description:
        'Master AI-powered load matching, route optimization, and capacity forecasting for dispatchers.',
      duration: '55 min',
      difficulty: 'Intermediate',
      category: 'Operations',
      certification: true,
      enrolledCount: 634,
      rating: 4.7,
      thumbnail: '🚛',
    },
    {
      id: 'broker-ai-workflow',
      title: 'Broker AI Workflow Training',
      description:
        'AI-powered lead scoring, pricing optimization, and customer relationship management for brokers.',
      duration: '50 min',
      difficulty: 'Intermediate',
      category: 'Business',
      certification: true,
      enrolledCount: 567,
      rating: 4.8,
      thumbnail: '🏢',
    },
    {
      id: 'system-ai-workflow',
      title: 'System AI Administration',
      description:
        'Predictive maintenance, compliance monitoring, and performance analytics for system administrators.',
      duration: '65 min',
      difficulty: 'Advanced',
      category: 'Technology',
      certification: true,
      enrolledCount: 423,
      rating: 4.9,
      thumbnail: '⚙️',
    },
    {
      id: 'ai-performance-analytics',
      title: 'AI Performance Analytics',
      description:
        'Understanding AI metrics, interpreting performance data, and optimizing system effectiveness.',
      duration: '40 min',
      difficulty: 'Intermediate',
      category: 'Technology',
      certification: true,
      enrolledCount: 745,
      rating: 4.6,
      thumbnail: '📊',
    },
    {
      id: 'ai-system-configuration',
      title: 'AI System Configuration',
      description:
        'Configure and customize AI workflows, set preferences, and optimize system performance.',
      duration: '50 min',
      difficulty: 'Advanced',
      category: 'Technology',
      certification: true,
      enrolledCount: 389,
      rating: 4.7,
      thumbnail: '🔧',
    },
    {
      id: 'ai-troubleshooting',
      title: 'AI System Troubleshooting',
      description:
        'Identify and resolve common AI system issues, optimize performance, and maintain system health.',
      duration: '35 min',
      difficulty: 'Advanced',
      category: 'Technology',
      certification: false,
      enrolledCount: 312,
      rating: 4.5,
      thumbnail: '🔍',
    },
    // New Dispatcher Training Resources
    {
      id: 'dispatch-scheduling-fundamentals',
      title: 'Dispatch Scheduling Fundamentals',
      description:
        "Master shift management, driver scheduling, and workload distribution using FleetFlow's existing tools.",
      duration: '45 min',
      difficulty: 'Beginner',
      category: 'Operations',
      certification: true,
      enrolledCount: 0,
      rating: 5.0,
      thumbnail: '📅',
    },
    {
      id: 'fleet-capacity-planning-free',
      title: 'Fleet Capacity Planning (Free Course)',
      description:
        "FREE: Learn to optimize fleet utilization and forecast capacity needs using FleetFlow's analytics.",
      duration: '35 min',
      difficulty: 'Beginner',
      category: 'Operations',
      certification: false,
      enrolledCount: 0,
      rating: 5.0,
      thumbnail: '📊',
    },
    {
      id: 'workflow-automation-training',
      title: 'Workflow Automation Training',
      description:
        "Maximize FleetFlow's automated workflows for load assignment, tracking, and communication.",
      duration: '50 min',
      difficulty: 'Intermediate',
      category: 'Operations',
      certification: true,
      enrolledCount: 0,
      rating: 5.0,
      thumbnail: '⚙️',
    },
    {
      id: 'load-assignment-strategy',
      title: 'Load Assignment Strategy',
      description:
        "Advanced techniques for efficient load-to-driver matching using FleetFlow's assignment system.",
      duration: '40 min',
      difficulty: 'Intermediate',
      category: 'Operations',
      certification: true,
      enrolledCount: 0,
      rating: 5.0,
      thumbnail: '🎯',
    },
    {
      id: 'maximizing-fleetflow-features',
      title: 'Maximizing FleetFlow Features',
      description:
        'Comprehensive guide to using all FleetFlow dispatch features for maximum efficiency.',
      duration: '55 min',
      difficulty: 'Intermediate',
      category: 'Operations',
      certification: true,
      enrolledCount: 0,
      rating: 5.0,
      thumbnail: '🚀',
    },
    {
      id: 'dispatcher-communication-excellence',
      title: 'Dispatcher Communication Excellence',
      description:
        "Professional communication protocols for dispatchers using FleetFlow's communication tools.",
      duration: '30 min',
      difficulty: 'Beginner',
      category: 'Operations',
      certification: false,
      enrolledCount: 0,
      rating: 5.0,
      thumbnail: '📞',
    },
    {
      id: 'fleet-utilization-optimization',
      title: 'Fleet Utilization Optimization',
      description:
        'Strategies to maximize fleet efficiency and reduce deadhead miles using FleetFlow analytics.',
      duration: '45 min',
      difficulty: 'Advanced',
      category: 'Operations',
      certification: true,
      enrolledCount: 0,
      rating: 5.0,
      thumbnail: '⚡',
    },
    {
      id: 'emergency-response-protocols',
      title: 'Emergency Response Protocols',
      description:
        'Crisis management and emergency response procedures for dispatchers.',
      duration: '40 min',
      difficulty: 'Intermediate',
      category: 'Safety',
      certification: true,
      enrolledCount: 0,
      rating: 5.0,
      thumbnail: '🚨',
    },
    {
      id: 'dispatch-central-mastery',
      title: 'Dispatch Central Mastery',
      description:
        "Complete guide to FleetFlow's Dispatch Central dashboard and all its features.",
      duration: '60 min',
      difficulty: 'Intermediate',
      category: 'Operations',
      certification: true,
      enrolledCount: 0,
      rating: 5.0,
      thumbnail: '🏢',
    },
    {
      id: 'live-tracking-integration',
      title: 'Live Tracking Integration',
      description:
        'Master the live load tracking system integration with dispatch operations.',
      duration: '35 min',
      difficulty: 'Beginner',
      category: 'Technology',
      certification: false,
      enrolledCount: 0,
      rating: 5.0,
      thumbnail: '🗺️',
    },
    {
      id: 'performance-metrics-analysis',
      title: 'Performance Metrics Analysis',
      description:
        'Understanding and acting on dispatcher performance metrics and KPIs.',
      duration: '40 min',
      difficulty: 'Intermediate',
      category: 'Operations',
      certification: true,
      enrolledCount: 0,
      rating: 5.0,
      thumbnail: '📈',
    },
    {
      id: 'dispatcher-efficiency-free',
      title: 'Dispatcher Efficiency Tips (Free Course)',
      description:
        'FREE: Quick tips and tricks to improve daily dispatcher productivity and efficiency.',
      duration: '25 min',
      difficulty: 'Beginner',
      category: 'Operations',
      certification: false,
      enrolledCount: 0,
      rating: 5.0,
      thumbnail: '💡',
    },
    // Driver Management Training Modules
    {
      id: 'driver-retention-excellence',
      title: 'Driver Retention Excellence Training',
      description:
        'Comprehensive strategies and best practices for retaining quality drivers and reducing turnover.',
      duration: '50 min',
      difficulty: 'Intermediate',
      category: 'Business',
      certification: true,
      enrolledCount: 0,
      rating: 5.0,
      thumbnail: '🤝',
    },
    {
      id: 'performance-management-fundamentals',
      title: 'Performance Management Fundamentals',
      description:
        'Essential skills for tracking, measuring, and improving driver performance through data-driven approaches.',
      duration: '45 min',
      difficulty: 'Intermediate',
      category: 'Operations',
      certification: true,
      enrolledCount: 0,
      rating: 5.0,
      thumbnail: '📊',
    },
    {
      id: 'communication-protocol-mastery',
      title: 'Communication Protocol Mastery',
      description:
        'Master professional communication protocols between dispatchers, drivers, and fleet management.',
      duration: '40 min',
      difficulty: 'Beginner',
      category: 'Operations',
      certification: true,
      enrolledCount: 0,
      rating: 5.0,
      thumbnail: '📢',
    },
    {
      id: 'incentive-program-management',
      title: 'Incentive Program Management',
      description:
        'Design and implement effective driver incentive programs and bonus management systems.',
      duration: '55 min',
      difficulty: 'Advanced',
      category: 'Business',
      certification: true,
      enrolledCount: 0,
      rating: 5.0,
      thumbnail: '🎯',
    },
    {
      id: 'driver-relations-excellence-free',
      title: 'Driver Relations Excellence (Free Course)',
      description:
        'FREE: Building positive relationships with drivers to improve retention and job satisfaction.',
      duration: '30 min',
      difficulty: 'Beginner',
      category: 'Business',
      certification: false,
      enrolledCount: 0,
      rating: 5.0,
      thumbnail: '👥',
    },
    {
      id: 'hr-fleet-management',
      title: 'HR Best Practices for Fleet Management',
      description:
        'Human resources management specifically tailored for transportation and fleet operations.',
      duration: '60 min',
      difficulty: 'Advanced',
      category: 'Business',
      certification: true,
      enrolledCount: 0,
      rating: 5.0,
      thumbnail: '👔',
    },
  ];

  const aiTrainingModules: AITrainingModule[] = [
    {
      id: 'ai-fundamentals',
      title: '🤖 AI Fundamentals',
      description: 'Introduction to artificial intelligence in transportation',
      duration: '45 min',
      difficulty: 'Beginner',
      completed: aiProgress['ai-fundamentals'],
      locked: false,
      content: {
        overview:
          "This module introduces the fundamental concepts of artificial intelligence as applied to transportation and logistics. You'll learn how AI systems work, their benefits, and how FleetFlow integrates AI throughout the platform.",
        learningObjectives: [
          'Understand basic AI concepts and terminology',
          'Identify AI applications in transportation',
          'Recognize the benefits of AI-powered systems',
          "Navigate FleetFlow's AI interfaces",
          'Interpret AI recommendations and outputs',
        ],
        keyTopics: [
          'What is Artificial Intelligence?',
          'Machine Learning vs Traditional Programming',
          'AI in Transportation Industry',
          'FleetFlow AI Architecture Overview',
          'Data-Driven Decision Making',
          'Understanding AI Confidence Scores',
          'Human-AI Collaboration Best Practices',
        ],
      },
    },
    {
      id: 'ai-flow-system',
      title: '🔄 AI Flow System',
      description: 'Master the AI workflow monitoring and management system',
      duration: '60 min',
      difficulty: 'Intermediate',
      completed: aiProgress['ai-flow-system'],
      locked: !aiProgress['ai-fundamentals'],
      content: {
        overview:
          "Deep dive into FleetFlow's AI Flow system, learning to monitor, understand, and optimize AI workflows across dispatcher, broker, and system operations.",
        learningObjectives: [
          'Navigate the AI Flow dashboard effectively',
          'Monitor AI workflow performance',
          'Understand role-based AI systems',
          'Interpret workflow metrics and indicators',
          'Optimize AI system performance',
        ],
        keyTopics: [
          'AI Flow Dashboard Navigation',
          'Role-Based AI Systems Overview',
          'Workflow Status Indicators',
          'Performance Metrics Interpretation',
          'Real-Time Monitoring Techniques',
          'AI System Health Assessment',
          'Workflow Optimization Strategies',
        ],
      },
    },
    {
      id: 'dispatcher-ai',
      title: '🚛 Dispatcher AI Workflow',
      description:
        'AI-powered load matching and route optimization for dispatchers',
      duration: '55 min',
      difficulty: 'Intermediate',
      completed: aiProgress['dispatcher-ai'],
      locked: !aiProgress['ai-flow-system'],
      content: {
        overview:
          'Specialized training for dispatchers on using AI for load analysis, carrier matching, route optimization, and capacity forecasting.',
        learningObjectives: [
          'Master AI-powered load matching processes',
          'Utilize dynamic route optimization',
          'Implement capacity forecasting strategies',
          'Optimize dispatcher workflows with AI',
          'Provide effective AI feedback',
        ],
        keyTopics: [
          'Intelligent Load Analysis Process',
          'Carrier Database Scanning Techniques',
          'Route Optimization Algorithms',
          'Capacity Forecasting Methods',
          'Performance Metrics for Dispatchers',
          'AI Recommendation Evaluation',
          'Feedback and Continuous Improvement',
        ],
      },
    },
    {
      id: 'broker-ai',
      title: '🏢 Broker AI Workflow',
      description:
        'AI-driven sales optimization and customer relationship management',
      duration: '50 min',
      difficulty: 'Intermediate',
      completed: aiProgress['broker-ai'],
      locked: !aiProgress['ai-flow-system'],
      content: {
        overview:
          'Comprehensive training for brokers on leveraging AI for lead scoring, pricing optimization, and customer relationship management.',
        learningObjectives: [
          'Implement intelligent lead scoring systems',
          'Utilize dynamic pricing strategies',
          'Enhance customer relationships with AI',
          'Optimize sales processes and outcomes',
          'Maximize revenue through AI insights',
        ],
        keyTopics: [
          'Lead Scoring Algorithms and Process',
          'Dynamic Pricing Engine Operation',
          'Customer Relationship AI Tools',
          'Market Analysis and Competitive Intelligence',
          'Sales Performance Optimization',
          'Revenue Maximization Strategies',
          'Customer Retention AI Techniques',
        ],
      },
    },
    {
      id: 'system-ai',
      title: '⚙️ System AI Administration',
      description: 'Advanced AI system management and optimization',
      duration: '65 min',
      difficulty: 'Advanced',
      completed: aiProgress['system-ai'],
      locked: !aiProgress['ai-flow-system'],
      content: {
        overview:
          'Advanced training for system administrators on predictive maintenance, compliance monitoring, and business intelligence systems.',
        learningObjectives: [
          'Implement predictive maintenance strategies',
          'Monitor compliance automatically',
          'Generate business intelligence insights',
          'Optimize system performance',
          'Manage AI system health and maintenance',
        ],
        keyTopics: [
          'Predictive Maintenance AI Systems',
          'Automated Compliance Monitoring',
          'Business Intelligence Engine Operation',
          'System Performance Optimization',
          'AI Health Monitoring and Diagnostics',
          'Data Quality Management',
          'Advanced Analytics and Reporting',
        ],
      },
    },
    {
      id: 'performance-analytics',
      title: '📊 AI Performance Analytics',
      description: 'Understanding and optimizing AI system performance',
      duration: '40 min',
      difficulty: 'Intermediate',
      completed: aiProgress['performance-analytics'],
      locked: !aiProgress['ai-fundamentals'],
      content: {
        overview:
          'Learn to interpret AI performance metrics, identify optimization opportunities, and continuously improve AI system effectiveness.',
        learningObjectives: [
          'Interpret AI performance metrics accurately',
          'Identify system optimization opportunities',
          'Implement performance improvement strategies',
          'Monitor long-term AI effectiveness',
          'Create performance reports and insights',
        ],
        keyTopics: [
          'Key Performance Indicators (KPIs)',
          'Metric Interpretation and Analysis',
          'Performance Benchmarking',
          'Optimization Strategy Development',
          'Continuous Improvement Processes',
          'Performance Reporting Techniques',
          'ROI Measurement and Analysis',
        ],
      },
    },
    {
      id: 'troubleshooting',
      title: '🔍 AI System Troubleshooting',
      description: 'Diagnose and resolve AI system issues',
      duration: '35 min',
      difficulty: 'Advanced',
      completed: aiProgress['troubleshooting'],
      locked: !aiProgress['performance-analytics'],
      content: {
        overview:
          'Advanced troubleshooting techniques for AI systems, including common issues, diagnostic procedures, and resolution strategies.',
        learningObjectives: [
          'Diagnose common AI system issues',
          'Implement effective troubleshooting procedures',
          'Resolve performance and accuracy problems',
          'Maintain optimal AI system health',
          'Prevent future system issues',
        ],
        keyTopics: [
          'Common AI System Issues',
          'Diagnostic Procedures and Tools',
          'Performance Troubleshooting',
          'Accuracy and Recommendation Issues',
          'System Health Monitoring',
          'Preventive Maintenance Strategies',
          'Escalation Procedures',
        ],
      },
    },
  ];

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

  const handleCourseSelect = (courseId: string) => {
    // Handle Role-Based Comprehensive Courses
    if (courseId === 'dispatcher-operations-mastery') {
      alert(
        '🚛 Starting Dispatcher Operations Mastery Course!\n\n📋 Course Content:\n• FleetFlow™ Dispatch Central Interface\n• Enhanced Load Board Navigation\n• Live Load Tracking Dashboard\n• Driver Management & Performance Analytics\n• Load Identification System\n• SMS Communication & Notifications\n• Route Planning & Optimization\n• Emergency Response Procedures\n\n⏱️ Duration: 180 minutes\n🎓 Certification: Professional Dispatcher'
      );
    } else if (courseId === 'broker-business-mastery') {
      alert(
        '💼 Starting Broker Business Mastery Course!\n\n📋 Course Content:\n• FreightFlow RFx℠ System Navigation\n• Customer Relationship Management\n• Freight Pricing & Negotiations\n• Carrier Network Development\n• Load Matching Strategies\n• Financial Management & Invoicing\n• Market Intelligence & Analytics\n• Business Development\n\n⏱️ Duration: 180 minutes\n🎓 Certification: Professional Freight Broker'
      );
    } else if (courseId === 'fleet-operations-excellence') {
      alert(
        '🚛 Starting Fleet Operations Excellence Course!\n\n📋 Course Content:\n• Fleet Management Dashboard\n• Vehicle Maintenance Scheduling\n• Driver Performance Analytics\n• Route Optimization\n• Fuel Management\n• Safety & Compliance Monitoring\n• Equipment Utilization\n• Operational Cost Analysis\n\n⏱️ Duration: 150 minutes\n🎓 Certification: Fleet Operations Professional'
      );
    } else if (courseId === 'compliance-safety-excellence') {
      alert(
        '⚖️ Starting Compliance & Safety Excellence Course!\n\n📋 Course Content:\n• DOT Regulations & Requirements\n• Hours of Service (HOS) Management\n• Vehicle Inspection Procedures\n• Driver Qualification Standards\n• Safety Management Systems\n• Accident Investigation\n• Regulatory Reporting\n• Risk Management\n\n⏱️ Duration: 120 minutes\n🎓 Certification: Safety & Compliance Specialist'
      );
    } else if (courseId === 'freight-broker-agent') {
      window.location.href = '/training/broker-agent-resources';
    } else if (courseId.startsWith('ai-') || courseId.includes('ai')) {
      setActiveTab('ai-training');
      // Find the matching AI module and set it as active
      const matchingModule = aiTrainingModules.find((module) =>
        courseId.includes(module.id.replace('ai-', '').replace('-', ''))
      );
      if (matchingModule) {
        setActiveAIModule(matchingModule.id);
      }
    } else {
      alert(`Opening ${courseId} training...`);
    }
  };

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

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)
      `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        paddingTop: '80px',
      }}
    >
      {/* Back Button */}
      <div style={{ padding: '16px 24px' }}>
        <Link href='/'>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Container */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 32px',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '32px' }}>🎓</span>
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 8px 0',
                    textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  FleetFlow University℠
                </h1>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '18px',
                    margin: '0 0 16px 0',
                  }}
                >
                  Professional training hub for transportation excellence
                </p>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '24px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        background: '#10b981',
                        borderRadius: '50%',
                        boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)',
                        animation: 'pulse 2s infinite',
                      }}
                     />
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                      }}
                    >
                      Training Hub Active
                    </span>
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                    }}
                  >
                    {courses.length} courses available
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                📊 Progress Report
              </button>
              <button
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #059669, #047857)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #10b981, #059669)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                + New Course
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {[
            { id: 'hub', label: 'Hub', icon: '🎓' },
            { id: 'courses', label: 'Courses', icon: '📚' },
            { id: 'ai-training', label: 'AI Training', icon: '🤖' },
            { id: 'certifications', label: 'Certifications', icon: '🏆' },
            {
              id: 'occupational-training',
              label: 'Occupational Training',
              icon: '👔',
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '16px 24px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background:
                  activeTab === tab.id
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(255, 255, 255, 0.15)',
                color: activeTab === tab.id ? '#1e40af' : 'white',
                backdropFilter: 'blur(10px)',
                border:
                  activeTab === tab.id
                    ? '1px solid rgba(255, 255, 255, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                transform:
                  activeTab === tab.id ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow:
                  activeTab === tab.id
                    ? '0 8px 25px rgba(0, 0, 0, 0.2)'
                    : 'none',
              }}
            >
              <span style={{ marginRight: '8px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'hub' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            {/* Stats Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px',
                marginBottom: '32px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📚</div>
                <h3
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#3b82f6',
                    margin: '0 0 4px 0',
                  }}
                >
                  {courses.length}
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                    margin: 0,
                  }}
                >
                  Available Courses
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏆</div>
                <h3
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#10b981',
                    margin: '0 0 4px 0',
                  }}
                >
                  {courses.filter((c) => c.certification).length}
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                    margin: 0,
                  }}
                >
                  Certifications
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👥</div>
                <h3
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#f59e0b',
                    margin: '0 0 4px 0',
                  }}
                >
                  {Math.round(
                    courses.reduce(
                      (sum, course) => sum + course.enrolledCount,
                      0
                    ) / 1000
                  )}
                  K
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                    margin: 0,
                  }}
                >
                  Students
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⭐</div>
                <h3
                  style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#a855f7',
                    margin: '0 0 4px 0',
                  }}
                >
                  {(
                    courses.reduce((sum, course) => sum + course.rating, 0) /
                    courses.length
                  ).toFixed(1)}
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                    margin: 0,
                  }}
                >
                  Avg Rating
                </p>
              </div>
            </div>

            {/* Role Training Section */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginBottom: '24px',
                  textAlign: 'center',
                }}
              >
                🎯 Training Hub - Choose Your Role
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '24px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
                    📋
                  </div>
                  <h3
                    style={{
                      color: '#3b82f6',
                      fontSize: '20px',
                      marginBottom: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    Dispatcher Training
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.8)',
                      marginBottom: '20px',
                      fontSize: '14px',
                      lineHeight: '1.6',
                    }}
                  >
                    Load coordination, carrier management, and dispatch
                    operations
                  </p>
                  <button
                    onClick={() =>
                      (window.location.href = '/training?role=dispatcher')
                    }
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 25px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Start Training
                  </button>
                </div>

                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
                    🏢
                  </div>
                  <h3
                    style={{
                      color: '#10b981',
                      fontSize: '20px',
                      marginBottom: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    Broker Agent Training
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.8)',
                      marginBottom: '20px',
                      fontSize: '14px',
                      lineHeight: '1.6',
                    }}
                  >
                    Sales scripts, client management, and broker operations
                  </p>
                  <button
                    onClick={() =>
                      (window.location.href =
                        '/training/broker-agent-resources')
                    }
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 25px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Start Training
                  </button>
                </div>

                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
                    🚛
                  </div>
                  <h3
                    style={{
                      color: '#f59e0b',
                      fontSize: '20px',
                      marginBottom: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    Driver Training
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.8)',
                      marginBottom: '20px',
                      fontSize: '14px',
                      lineHeight: '1.6',
                    }}
                  >
                    Safety protocols, vehicle operation, and compliance training
                  </p>
                  <button
                    onClick={() =>
                      (window.location.href = '/training?role=driver')
                    }
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 25px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Start Training
                  </button>
                </div>

                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
                    ⚙️
                  </div>
                  <h3
                    style={{
                      color: '#8b5cf6',
                      fontSize: '20px',
                      marginBottom: '12px',
                      fontWeight: 'bold',
                    }}
                  >
                    System Training
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.8)',
                      marginBottom: '20px',
                      fontSize: '14px',
                      lineHeight: '1.6',
                    }}
                  >
                    FleetFlow platform mastery and system optimization
                  </p>
                  <button
                    onClick={() =>
                      (window.location.href = '/training?role=system')
                    }
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 25px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Start Training
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div>
            {/* ROLE-BASED COMPREHENSIVE COURSES SECTION */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
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
                  🎯 Role-Based Comprehensive Courses
                </h2>
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: '#10b981',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                  }}
                >
                  ✨ Featured Training
                </div>
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
                    onClick={() => handleCourseSelect(course.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow =
                        '0 12px 40px rgba(16, 185, 129, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 32px rgba(16, 185, 129, 0.2)';
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
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 'bold',
                            }}
                          >
                            {course.difficulty}
                          </span>
                          <span
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '0.9rem',
                            }}
                          >
                            ⏱️ {course.duration}
                          </span>
                          {course.certification && (
                            <span
                              style={{
                                color: '#f59e0b',
                                fontSize: '0.9rem',
                              }}
                            >
                              🏆
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        marginBottom: '16px',
                      }}
                    >
                      {course.description}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      <span>👥 {course.enrolledCount} students</span>
                      <span>⭐ {course.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* INDIVIDUAL COURSES SECTION */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  margin: '0 0 24px 0',
                }}
              >
                📚 Individual Specialized Courses
              </h2>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '24px',
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
                    flex: 1,
                    minWidth: '250px',
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

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '16px',
                }}
              >
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => handleCourseSelect(course.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 16px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '2rem',
                          marginRight: '12px',
                        }}
                      >
                        {course.thumbnail}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            marginBottom: '6px',
                          }}
                        >
                          {course.title}
                        </h3>
                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span
                            style={{
                              background: getDifficultyColor(course.difficulty),
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: 'bold',
                            }}
                          >
                            {course.difficulty}
                          </span>
                          <span
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '0.8rem',
                            }}
                          >
                            {course.duration}
                          </span>
                          {course.certification && (
                            <span
                              style={{
                                color: '#f59e0b',
                                fontSize: '0.8rem',
                              }}
                            >
                              🏆
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.85rem',
                        lineHeight: '1.4',
                        marginBottom: '12px',
                      }}
                    >
                      {course.description}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      <span>👥 {course.enrolledCount}</span>
                      <span>⭐ {course.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai-training' && (
          <div>
            {/* AI Training Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '24px',
                textAlign: 'center',
                color: 'white',
              }}
            >
              <h2
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  margin: '0 0 16px 0',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                🤖 AI Training Academy
              </h2>
              <p
                style={{
                  fontSize: '1.2rem',
                  margin: '0 0 24px 0',
                  opacity: 0.9,
                }}
              >
                Master FleetFlow's AI systems with comprehensive, hands-on
                training
              </p>

              {/* Progress Overview */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '16px',
                  marginTop: '24px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                    📚
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {Object.values(aiProgress).filter(Boolean).length}/
                    {aiTrainingModules.length}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Modules Complete
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                    ⏱️
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    6.5 hrs
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Total Training
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                    🏆
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {
                      aiTrainingModules.filter(
                        (m) => m.content && aiProgress[m.id]
                      ).length
                    }
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Certifications
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '300px 1fr',
                gap: '24px',
              }}
            >
              {/* Module List */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  height: 'fit-content',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    margin: '0 0 20px 0',
                    color: 'white',
                  }}
                >
                  Training Modules
                </h3>

                {aiTrainingModules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() =>
                      !module.locked && setActiveAIModule(module.id)
                    }
                    disabled={module.locked}
                    style={{
                      width: '100%',
                      background:
                        activeAIModule === module.id
                          ? 'rgba(255, 255, 255, 0.2)'
                          : module.locked
                            ? 'rgba(0, 0, 0, 0.2)'
                            : 'rgba(255, 255, 255, 0.1)',
                      border: `2px solid ${activeAIModule === module.id ? '#fbbf24' : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '12px',
                      cursor: module.locked ? 'not-allowed' : 'pointer',
                      textAlign: 'left',
                      color: module.locked
                        ? 'rgba(255, 255, 255, 0.5)'
                        : 'white',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          margin: 0,
                        }}
                      >
                        {module.title}
                      </h4>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        {module.completed && (
                          <span style={{ color: '#10b981' }}>✓</span>
                        )}
                        {module.locked && (
                          <span style={{ color: '#6b7280' }}>🔒</span>
                        )}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        opacity: 0.8,
                        marginBottom: '8px',
                      }}
                    >
                      {module.description}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.7rem',
                          background: getDifficultyColor(module.difficulty),
                          padding: '2px 6px',
                          borderRadius: '6px',
                          color: 'white',
                        }}
                      >
                        {module.difficulty}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          opacity: 0.8,
                        }}
                      >
                        {module.duration}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Module Content */}
              {(() => {
                const activeModuleData = aiTrainingModules.find(
                  (m) => m.id === activeAIModule
                );
                return (
                  activeModuleData && (
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        padding: '32px',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                      }}
                    >
                      {/* Module Header */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '24px',
                        }}
                      >
                        <h2
                          style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            margin: 0,
                          }}
                        >
                          {activeModuleData.title}
                        </h2>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                          }}
                        >
                          <span
                            style={{
                              background: getDifficultyColor(
                                activeModuleData.difficulty
                              ),
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              fontWeight: 'bold',
                            }}
                          >
                            {activeModuleData.difficulty}
                          </span>
                          <span
                            style={{
                              background: 'rgba(255, 255, 255, 0.2)',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                            }}
                          >
                            {activeModuleData.duration}
                          </span>
                        </div>
                      </div>

                      {/* Overview */}
                      <div style={{ marginBottom: '32px' }}>
                        <h3
                          style={{
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                            margin: '0 0 12px 0',
                            color: '#fbbf24',
                          }}
                        >
                          📋 Module Overview
                        </h3>
                        <p
                          style={{
                            fontSize: '1rem',
                            lineHeight: 1.6,
                            margin: 0,
                            opacity: 0.9,
                          }}
                        >
                          {activeModuleData.content.overview}
                        </p>
                      </div>

                      {/* Learning Objectives */}
                      <div style={{ marginBottom: '32px' }}>
                        <h3
                          style={{
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                            margin: '0 0 12px 0',
                            color: '#fbbf24',
                          }}
                        >
                          🎯 Learning Objectives
                        </h3>
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: '20px',
                          }}
                        >
                          {activeModuleData.content.learningObjectives.map(
                            (objective, index) => (
                              <li
                                key={index}
                                style={{
                                  fontSize: '1rem',
                                  marginBottom: '8px',
                                  opacity: 0.9,
                                }}
                              >
                                {objective}
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      {/* Key Topics */}
                      <div style={{ marginBottom: '32px' }}>
                        <h3
                          style={{
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                            margin: '0 0 12px 0',
                            color: '#fbbf24',
                          }}
                        >
                          📚 Key Topics Covered
                        </h3>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '12px',
                          }}
                        >
                          {activeModuleData.content.keyTopics.map(
                            (topic, index) => (
                              <div
                                key={index}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.1)',
                                  padding: '12px',
                                  borderRadius: '8px',
                                  fontSize: '0.9rem',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                }}
                              >
                                {topic}
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div
                        style={{
                          display: 'flex',
                          gap: '16px',
                          justifyContent: 'center',
                        }}
                      >
                        <button
                          onClick={() => alert('Starting training module...')}
                          style={{
                            background:
                              'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            padding: '16px 32px',
                            borderRadius: '12px',
                            border: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          }}
                        >
                          🚀 Start Training
                        </button>

                        <button
                          onClick={() => (window.location.href = '/ai')}
                          style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            padding: '16px 32px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                          }}
                        >
                          🔄 Go to AI Flow
                        </button>

                        {activeModuleData.completed && (
                          <button
                            style={{
                              background:
                                'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                              color: 'white',
                              padding: '16px 32px',
                              borderRadius: '12px',
                              border: 'none',
                              fontSize: '1.1rem',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                            }}
                          >
                            🏆 View Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  )
                );
              })()}
            </div>
          </div>
        )}

        {activeTab === 'certifications' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '48px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🏆</div>
            <h2
              style={{
                color: 'white',
                fontSize: '2rem',
                marginBottom: '16px',
              }}
            >
              Your Certifications
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '1.1rem',
                marginBottom: '32px',
              }}
            >
              Complete courses to earn professional certifications
            </p>
            <button
              onClick={() => setActiveTab('courses')}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              Browse Courses
            </button>
          </div>
        )}

        {/* Occupational Training Tab */}
        {activeTab === 'occupational-training' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '32px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                marginBottom: '32px',
              }}
            >
              <h2
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                👔 "Go with the Flow" Occupational Training
              </h2>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1.2rem',
                  marginBottom: '24px',
                }}
              >
                Master every aspect of FleetFlow with comprehensive
                page-specific training
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '32px',
                  flexWrap: 'wrap',
                  marginBottom: '32px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                    📚
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {occupationalTrainingModules.length}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Training Modules
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                    ❓
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {occupationalTrainingModules.reduce(
                      (sum, module) => sum + module.quizQuestions,
                      0
                    )}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Quiz Questions
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                    🎯
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {occupationalTrainingModules.reduce(
                      (sum, module) => sum + module.practicalExercises,
                      0
                    )}
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Practical Exercises
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                    🏆
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {
                      occupationalTrainingModules.filter(
                        (module) => module.certification
                      ).length
                    }
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    Certifications
                  </div>
                </div>
              </div>
            </div>

            {/* Training Modules Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '24px',
                marginBottom: '32px',
              }}
            >
              {occupationalTrainingModules.map((module, index) => {
                const isCompleted = occupationalProgress[module.id];
                const difficultyColor =
                  module.difficulty === 'Beginner'
                    ? '#10b981'
                    : module.difficulty === 'Intermediate'
                      ? '#f59e0b'
                      : '#ef4444';

                return (
                  <div
                    key={module.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow =
                        '0 12px 40px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 32px rgba(0, 0, 0, 0.1)';
                    }}
                    onClick={() => setActiveOccupationalModule(module.id)}
                  >
                    {/* Module Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '16px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '3rem',
                            marginBottom: '8px',
                          }}
                        >
                          {module.thumbnail}
                        </div>
                        <h3
                          style={{
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            color: 'white',
                          }}
                        >
                          {module.title}
                        </h3>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          gap: '8px',
                        }}
                      >
                        <div
                          style={{
                            background: difficultyColor,
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {module.difficulty}
                        </div>
                        {isCompleted && (
                          <div
                            style={{
                              background: '#10b981',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '0.8rem',
                              fontWeight: 'bold',
                            }}
                          >
                            ✅ Completed
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Module Description */}
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        marginBottom: '16px',
                      }}
                    >
                      {module.description}
                    </p>

                    {/* Module Stats */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '12px',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                          Duration
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                          {module.duration}
                        </div>
                      </div>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                          Quiz Questions
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                          {module.quizQuestions}
                        </div>
                      </div>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                          Exercises
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                          {module.practicalExercises}
                        </div>
                      </div>
                    </div>

                    {/* Module Topics */}
                    <div
                      style={{
                        marginBottom: '16px',
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          marginBottom: '8px',
                          color: 'rgba(255, 255, 255, 0.9)',
                        }}
                      >
                        Learning Modules:
                      </h4>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '4px',
                        }}
                      >
                        {module.modules.slice(0, 4).map((topic, topicIndex) => (
                          <div
                            key={topicIndex}
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            • {topic}
                          </div>
                        ))}
                        {module.modules.length > 4 && (
                          <div
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                              textAlign: 'center',
                            }}
                          >
                            +{module.modules.length - 4} more
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                      }}
                    >
                      <button
                        style={{
                          background: isCompleted
                            ? 'rgba(16, 185, 129, 0.8)'
                            : 'linear-gradient(135deg, #667eea, #764ba2)',
                          color: 'white',
                          padding: '12px 20px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          flex: 1,
                          transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => {
                          if (!isCompleted) {
                            (e.target as HTMLElement).style.transform =
                              'translateY(-2px)';
                          }
                        }}
                        onMouseOut={(e) => {
                          (e.target as HTMLElement).style.transform =
                            'translateY(0)';
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isCompleted) {
                            setOccupationalProgress((prev) => ({
                              ...prev,
                              [module.id]: true,
                            }));
                            alert(
                              `🎉 Congratulations! You've completed the ${module.title} training module and earned your certification!`
                            );
                          }
                        }}
                      >
                        {isCompleted ? '✅ Completed' : '🚀 Start Training'}
                      </button>
                      <button
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(
                            `📋 ${module.title} Preview:\n\n${module.description}\n\nModules: ${module.modules.join(', ')}\n\nThis training includes ${module.quizQuestions} quiz questions and ${module.practicalExercises} practical exercises.`
                          );
                        }}
                      >
                        👁️ Preview
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Quiz Modal */}
            {activeOccupationalModule && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                  padding: '20px',
                }}
                onClick={() => setActiveOccupationalModule('')}
              >
                <div
                  style={{
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '16px',
                    padding: '32px',
                    maxWidth: '600px',
                    width: '100%',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    position: 'relative',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={() => setActiveOccupationalModule('')}
                  >
                    ×
                  </button>

                  {(() => {
                    const selectedModule = occupationalTrainingModules.find(
                      (m) => m.id === activeOccupationalModule
                    );
                    if (!selectedModule) return null;

                    return (
                      <div>
                        <div
                          style={{
                            textAlign: 'center',
                            marginBottom: '24px',
                          }}
                        >
                          <div
                            style={{ fontSize: '4rem', marginBottom: '16px' }}
                          >
                            {selectedModule.thumbnail}
                          </div>
                          <h3
                            style={{
                              fontSize: '1.8rem',
                              fontWeight: 'bold',
                              color: 'white',
                              marginBottom: '8px',
                            }}
                          >
                            {selectedModule.title}
                          </h3>
                          <p
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '1.1rem',
                              marginBottom: '16px',
                            }}
                          >
                            {selectedModule.description}
                          </p>
                        </div>

                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '24px',
                          }}
                        >
                          <h4
                            style={{
                              color: 'white',
                              fontSize: '1.2rem',
                              fontWeight: 'bold',
                              marginBottom: '16px',
                            }}
                          >
                            📚 Learning Modules:
                          </h4>
                          <div
                            style={{
                              display: 'grid',
                              gap: '8px',
                            }}
                          >
                            {selectedModule.modules.map((topic, index) => (
                              <div
                                key={index}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.1)',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  color: 'rgba(255, 255, 255, 0.9)',
                                  fontSize: '0.9rem',
                                }}
                              >
                                {index + 1}. {topic}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '16px',
                            marginBottom: '24px',
                          }}
                        >
                          <div
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              padding: '16px',
                              borderRadius: '8px',
                              textAlign: 'center',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '1.5rem',
                                marginBottom: '8px',
                              }}
                            >
                              ⏱️
                            </div>
                            <div
                              style={{
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color: 'white',
                              }}
                            >
                              {selectedModule.duration}
                            </div>
                            <div
                              style={{
                                fontSize: '0.9rem',
                                color: 'rgba(255, 255, 255, 0.7)',
                              }}
                            >
                              Duration
                            </div>
                          </div>
                          <div
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              padding: '16px',
                              borderRadius: '8px',
                              textAlign: 'center',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '1.5rem',
                                marginBottom: '8px',
                              }}
                            >
                              📈
                            </div>
                            <div
                              style={{
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color: 'white',
                              }}
                            >
                              {selectedModule.difficulty}
                            </div>
                            <div
                              style={{
                                fontSize: '0.9rem',
                                color: 'rgba(255, 255, 255, 0.7)',
                              }}
                            >
                              Difficulty
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'center',
                          }}
                        >
                          <button
                            style={{
                              background:
                                'linear-gradient(135deg, #10b981, #059669)',
                              color: 'white',
                              padding: '12px 24px',
                              borderRadius: '8px',
                              border: 'none',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '1rem',
                            }}
                            onClick={() => {
                              setOccupationalProgress((prev) => ({
                                ...prev,
                                [selectedModule.id]: true,
                              }));
                              setActiveOccupationalModule('');
                              alert(
                                `🎉 Congratulations! You've completed the ${selectedModule.title} training and earned your certification!`
                              );
                            }}
                          >
                            🚀 Start Training
                          </button>
                          <button
                            style={{
                              background: 'rgba(255, 255, 255, 0.2)',
                              color: 'white',
                              padding: '12px 24px',
                              borderRadius: '8px',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '1rem',
                            }}
                            onClick={() => {
                              const questions = [
                                'What is the first step in the carrier onboarding process?',
                                'How many documents are required for compliance?',
                                'What is the typical onboarding timeframe?',
                              ];
                              alert(
                                `📝 Sample Quiz Questions:\n\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n')}\n\nThis training includes ${selectedModule.quizQuestions} total quiz questions and ${selectedModule.practicalExercises} practical exercises.`
                              );
                            }}
                          >
                            📝 Preview Quiz
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Certifications Tab */}
        {activeTab === 'certifications' && (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 32px',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🏆</div>
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '16px',
              }}
            >
              Professional Certifications
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '1.1rem',
                marginBottom: '32px',
              }}
            >
              Complete courses to earn professional certifications
            </p>
            <button
              onClick={() => setActiveTab('courses')}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
              }}
            >
              Browse Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
