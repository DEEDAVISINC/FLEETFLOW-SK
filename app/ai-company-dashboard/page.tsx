'use client';

import { useEffect, useState } from 'react';
// ADD REAL DATA INTEGRATION - KEEP SAME LOOK
import { getLoadStats, getMainDashboardLoads } from '../services/loadService';
import { calculateFinancialMetrics } from '../services/settlementService';
// ADD SQUARE & BILL.COM FINANCIAL INTEGRATION (Single-user configuration)
// import AISupportDashboard from '../components/AISupportDashboard';
// ✅ ADD: Platform AI monitoring integration
import { PlatformAIMonitor } from '../components/PlatformAIMonitor';

// Enhanced interfaces for comprehensive AI management
interface PerformanceMetrics {
  hourlyRevenue: number[];
  dailyTasks: number[];
  weeklyEfficiency: number[];
  monthlyGrowth: number[];
}

interface AITask {
  id: string;
  title: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  estimatedCompletion: string;
  actualRevenue?: number;
}

interface SystemAlert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  department: string;
}

interface FleetFlowIntegration {
  loadBoardConnections: number;
  activeDispatches: number;
  revenueGenerated: number;
  customerInteractions: number;
  apiCalls: number;
}

interface AIStaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'active' | 'busy' | 'idle' | 'offline';
  currentTask: string;
  tasksCompleted: number;
  revenue: number;
  efficiency: number;
  lastActivity: string;
  avatar: string;
}

interface Department {
  id: string;
  name: string;
  color: string;
  icon: string;
  totalStaff: number;
  activeStaff: number;
  dailyRevenue: number;
  tasksCompleted: number;
  efficiency: number;
}

// Financial Management Interfaces
interface FinancialSummary {
  totalReceivables: number;
  totalPayables: number;
  pendingInvoices: number;
  paidInvoices: number;
  overdueAmount: number;
  cashFlow: number;
}

interface PaymentProvider {
  name: 'Square' | 'Bill.com';
  capabilities: string[];
  status: 'active' | 'inactive';
  monthlyVolume: number;
  fees: number;
}

export default function AICompanyDashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [realTimeUpdate, setRealTimeUpdate] = useState(0);
  const [selectedView, setSelectedView] = useState<string>('overview');
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [showTaskManager, setShowTaskManager] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [alertFilter, setAlertFilter] = useState<string>('all');
  const [showStaffDetails, setShowStaffDetails] = useState(false);
  const [showTaskAssignment, setShowTaskAssignment] = useState(false);
  const [showStaffConfig, setShowStaffConfig] = useState(false);
  const [showStaffReports, setShowStaffReports] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');

  const departments: Department[] = [
    {
      id: 'executive',
      name: 'Executive Team',
      color: '#3b82f6',
      icon: '🏢',
      totalStaff: 5,
      activeStaff: 5,
      dailyRevenue: 15000,
      tasksCompleted: 47,
      efficiency: 98.5,
    },
    {
      id: 'sales',
      name: 'Sales & Revenue',
      color: '#ec4899',
      icon: '💰',
      totalStaff: 19,
      activeStaff: 19,
      dailyRevenue: 319500,
      tasksCompleted: 1077,
      efficiency: 98.2,
    },
    {
      id: 'logistics',
      name: 'Logistics Operations',
      color: '#f59e0b',
      icon: '🚛',
      totalStaff: 15,
      activeStaff: 15,
      dailyRevenue: 38000,
      tasksCompleted: 234,
      efficiency: 96.8,
    },
    {
      id: 'loadbooking',
      name: 'AI Load Booking',
      color: '#14b8a6',
      icon: '🎯',
      totalStaff: 8,
      activeStaff: 8,
      dailyRevenue: 45750,
      tasksCompleted: 156,
      efficiency: 89.2,
    },
    {
      id: 'support',
      name: 'Support Teams',
      color: '#8b5cf6',
      icon: '❤️',
      totalStaff: 8,
      activeStaff: 8,
      dailyRevenue: 12000,
      tasksCompleted: 89,
      efficiency: 95.4,
    },
    {
      id: 'government',
      name: 'Government Contracts',
      color: '#dc2626',
      icon: '🏛️',
      totalStaff: 4,
      activeStaff: 4,
      dailyRevenue: 25000,
      tasksCompleted: 34,
      efficiency: 98.9,
    },
    {
      id: 'legal',
      name: 'Legal & Compliance',
      color: '#059669',
      icon: '⚖️',
      totalStaff: 3,
      activeStaff: 3,
      dailyRevenue: 8500,
      tasksCompleted: 23,
      efficiency: 97.6,
    },
    {
      id: 'marketing',
      name: 'Marketing & Growth',
      color: '#ec4899',
      icon: '💖',
      totalStaff: 8,
      activeStaff: 8,
      dailyRevenue: 278900,
      tasksCompleted: 1687,
      efficiency: 96.2,
    },
    {
      id: 'hr',
      name: 'Human Resources',
      color: '#06b6d4',
      icon: '👥',
      totalStaff: 4,
      activeStaff: 4,
      dailyRevenue: 5500,
      tasksCompleted: 38,
      efficiency: 96.4,
    },
    {
      id: 'it',
      name: 'IT & Cybersecurity',
      color: '#6366f1',
      icon: '🔒',
      totalStaff: 5,
      activeStaff: 5,
      dailyRevenue: 7200,
      tasksCompleted: 67,
      efficiency: 99.1,
    },
    {
      id: 'procurement',
      name: 'Procurement & Supply',
      color: '#84cc16',
      icon: '📦',
      totalStaff: 3,
      activeStaff: 3,
      dailyRevenue: 12800,
      tasksCompleted: 45,
      efficiency: 97.8,
    },
    {
      id: 'research',
      name: 'Research & Development',
      color: '#a855f7',
      icon: '🔬',
      totalStaff: 4,
      activeStaff: 4,
      dailyRevenue: 9500,
      tasksCompleted: 29,
      efficiency: 98.6,
    },
    {
      id: 'training',
      name: 'Training & Education',
      color: '#0ea5e9',
      icon: '🎓',
      totalStaff: 3,
      activeStaff: 3,
      dailyRevenue: 6200,
      tasksCompleted: 56,
      efficiency: 96.9,
    },
    {
      id: 'maintenance',
      name: 'Fleet Maintenance',
      color: '#f59e0b',
      icon: '🔧',
      totalStaff: 4,
      activeStaff: 4,
      dailyRevenue: 8900,
      tasksCompleted: 78,
      efficiency: 97.6,
    },
    {
      id: 'customer_service',
      name: 'Customer Service',
      color: '#22c55e',
      icon: '📞',
      totalStaff: 12, // Was 6, now 12 (added 6 AI support staff)
      activeStaff: 12,
      dailyRevenue: 278900, // Added ~$274K from new AI support staff
      tasksCompleted: 914, // Added ~769 tasks from new AI support staff
      efficiency: 88.9, // Weighted average efficiency with new AI staff
    },
  ];

  const aiStaff: AIStaffMember[] = [
    // Executive Team
    {
      id: 'exec-001',
      name: 'AI Chief Executive',
      role: 'Strategic Operations Director',
      department: 'executive',
      status: 'active',
      currentTask:
        'Analyzing Q1 performance metrics and strategic planning for Q2 expansion',
      tasksCompleted: 23,
      revenue: 8500,
      efficiency: 98.5,
      lastActivity: '2 min ago',
      avatar: '🧠',
    },
    {
      id: 'exec-002',
      name: 'AI Chief Financial Officer',
      role: 'Financial Strategy Lead',
      department: 'executive',
      status: 'busy',
      currentTask:
        'Reviewing $2.3M government contract financials and budget allocation',
      tasksCompleted: 18,
      revenue: 4200,
      efficiency: 97.8,
      lastActivity: '5 min ago',
      avatar: '💼',
    },
    {
      id: 'exec-003',
      name: 'AI Operations Director',
      role: 'Operational Excellence Manager',
      department: 'executive',
      status: 'active',
      currentTask:
        'Coordinating cross-department efficiency improvements and KPI optimization',
      tasksCompleted: 15,
      revenue: 2300,
      efficiency: 98.2,
      lastActivity: '8 min ago',
      avatar: '⚙️',
    },

    // Sales & Revenue Team
    {
      id: 'sales-001',
      name: 'DEPOINTE AI Freight Broker',
      role: 'Senior Freight Broker | MC 1647572 | DOT 4250594',
      department: 'sales',
      status: 'busy',
      currentTask:
        'FreightFlow RFx: Negotiating $45K Amazon RFP contract + bidding on 8 government freight opportunities',
      tasksCompleted: 67,
      revenue: 15600,
      efficiency: 97.8,
      lastActivity: '1 min ago',
      avatar: '🚛',
    },
    {
      id: 'sales-002',
      name: 'AI Sales Director',
      role: 'Enterprise Sales Lead',
      department: 'sales',
      status: 'active',
      currentTask: 'Developing Fortune 500 client acquisition strategy for Q2',
      tasksCompleted: 45,
      revenue: 12300,
      efficiency: 96.5,
      lastActivity: '3 min ago',
      avatar: '💼',
    },
    {
      id: 'sales-003',
      name: 'AI Account Manager',
      role: 'Client Relationship Specialist',
      department: 'sales',
      status: 'active',
      currentTask:
        'Managing 23 active client accounts and renewal negotiations',
      tasksCompleted: 89,
      revenue: 8900,
      efficiency: 95.2,
      lastActivity: '6 min ago',
      avatar: '🤝',
    },
    // TruckingPlanet AI Staff
    {
      id: 'sales-004',
      name: 'AI TruckingPlanet Researcher',
      role: 'Database Mining Specialist',
      department: 'sales',
      status: 'busy',
      currentTask:
        'Processing 1,247 shipper records from TruckingPlanet CSV export - identified 89 high-value prospects',
      tasksCompleted: 234,
      revenue: 18900,
      efficiency: 98.7,
      lastActivity: '45 sec ago',
      avatar: '🔍',
    },
    {
      id: 'sales-005',
      name: 'AI Data Classification Bot',
      role: 'Shipper Categorization Expert',
      department: 'sales',
      status: 'active',
      currentTask:
        'Categorizing 43K FMCSA shippers by equipment type and service area',
      tasksCompleted: 567,
      revenue: 16800,
      efficiency: 97.3,
      lastActivity: '2 min ago',
      avatar: '📊',
    },
    {
      id: 'sales-006',
      name: 'AI Manual Research Coordinator',
      role: 'Research Workflow Manager',
      department: 'sales',
      status: 'active',
      currentTask:
        'Coordinating manual research on 156 pharmaceutical shippers - 23 ready for outreach',
      tasksCompleted: 123,
      revenue: 22100,
      efficiency: 96.8,
      lastActivity: '1 min ago',
      avatar: '🎯',
    },
    {
      id: 'sales-007',
      name: 'AI Contact Enrichment Specialist',
      role: 'Lead Intelligence Enhancer',
      department: 'sales',
      status: 'busy',
      currentTask:
        'Cross-referencing TruckingPlanet data with LinkedIn - found 67 decision makers',
      tasksCompleted: 89,
      revenue: 14500,
      efficiency: 95.4,
      lastActivity: '30 sec ago',
      avatar: '🔗',
    },
    {
      id: 'sales-008',
      name: 'AI Pharmaceutical Specialist',
      role: 'Medical Logistics Expert',
      department: 'sales',
      status: 'active',
      currentTask:
        'Analyzing 2,800+ hospital equipment suppliers for cold-chain opportunities',
      tasksCompleted: 67,
      revenue: 25600,
      efficiency: 97.9,
      lastActivity: '3 min ago',
      avatar: '💊',
    },
    {
      id: 'sales-009',
      name: 'AI Manufacturing Specialist',
      role: 'Industrial Logistics Expert',
      department: 'sales',
      status: 'busy',
      currentTask:
        'Processing 27K distributors/wholesalers database - 156 automotive prospects identified',
      tasksCompleted: 145,
      revenue: 19300,
      efficiency: 96.1,
      lastActivity: '1 min ago',
      avatar: '🏭',
    },
    {
      id: 'sales-010',
      name: 'DEPOINTE Email Response AI',
      role: 'Automated Email Communications | dispatch@freight1stdirect.com',
      department: 'sales',
      status: 'active',
      currentTask:
        'Processing 47 carrier emails - 94.2% response rate, 23 voice calls scheduled',
      tasksCompleted: 1247,
      revenue: 28900,
      efficiency: 98.9,
      lastActivity: '15 sec ago',
      avatar: '📧',
    },

    // NEW: SalesAI Integration - Live Call AI & Follow-up Automation
    {
      id: 'sales-ai-001',
      name: 'AI Live Call Assistant',
      role: 'Real-Time Call Support Specialist',
      department: 'sales',
      status: 'busy',
      currentTask:
        'Providing real-time AI suggestions during 3 active freight sales calls - 94.2% recommendation acceptance rate',
      tasksCompleted: 89,
      revenue: 45200,
      efficiency: 94.8,
      lastActivity: '12 sec ago',
      avatar: '🤖',
    },
    {
      id: 'sales-ai-002',
      name: 'AI Follow-Up Coordinator',
      role: 'Automated Follow-Up Manager',
      department: 'sales',
      status: 'active',
      currentTask:
        'Managing 156 scheduled follow-ups across 6 intelligent rule types - 78% response rate achieved',
      tasksCompleted: 234,
      revenue: 28900,
      efficiency: 92.3,
      lastActivity: '8 sec ago',
      avatar: '🔄',
    },
    {
      id: 'sales-ai-003',
      name: 'AI Call Analytics Specialist',
      role: 'Conversation Intelligence Analyst',
      department: 'sales',
      status: 'active',
      currentTask:
        'Analyzing 23 completed calls today - 78% positive sentiment, 34.5% conversion rate detected',
      tasksCompleted: 67,
      revenue: 31500,
      efficiency: 96.7,
      lastActivity: '4 sec ago',
      avatar: '📊',
    },

    // Logistics Operations Team
    {
      id: 'logistics-001',
      name: 'FREIGHT 1ST DIRECT AI Dispatcher',
      role: 'Master Dispatch Coordinator | FleetFlow Platform',
      department: 'logistics',
      status: 'busy',
      currentTask:
        'Dispatch coordination via FleetFlow: Go With Flow load assignment, Schedule Management, Live Tracking, route optimization for 23 active loads',
      tasksCompleted: 156,
      revenue: 18500,
      efficiency: 98.1,
      lastActivity: '30 sec ago',
      avatar: '📡',
    },
    {
      id: 'logistics-002',
      name: 'FREIGHT 1ST DIRECT Route AI',
      role: 'Intelligent Route Planning | FleetFlow Platform',
      department: 'logistics',
      status: 'active',
      currentTask:
        'Optimizing 34 routes via FleetFlow System Orchestrator: AI routing + Schedule Management + HOS compliance + real-time tracking',
      tasksCompleted: 78,
      revenue: 12400,
      efficiency: 97.5,
      lastActivity: '2 min ago',
      avatar: '🗺️',
    },
    {
      id: 'logistics-003',
      name: 'AI Freight Forwarder Ocean',
      role: 'Maritime Logistics Specialist',
      department: 'logistics',
      status: 'active',
      currentTask: 'Managing 12 ocean freight shipments through major US ports',
      tasksCompleted: 34,
      revenue: 7800,
      efficiency: 96.8,
      lastActivity: '4 min ago',
      avatar: '🚢',
    },

    // AI Load Booking Team
    {
      id: 'loadbook-001',
      name: 'LoadBot Alpha',
      role: 'DAT Load Booking Specialist',
      department: 'loadbooking',
      status: 'busy',
      currentTask:
        'Auto-booking 12 high-RPM loads from DAT One - 3.48/mile average rate',
      tasksCompleted: 89,
      revenue: 18900,
      efficiency: 92.4,
      lastActivity: '30 sec ago',
      avatar: '🎯',
    },
    {
      id: 'loadbook-002',
      name: 'TruckStop AI',
      role: 'TruckStop Automation Expert',
      department: 'loadbooking',
      status: 'active',
      currentTask:
        'Analyzing 247 TruckStop opportunities - found 23 auto-book eligible loads',
      tasksCompleted: 67,
      revenue: 15200,
      efficiency: 88.7,
      lastActivity: '1 min ago',
      avatar: '🚚',
    },
    {
      id: 'loadbook-003',
      name: 'Booking Analytics AI',
      role: 'Performance Tracking Specialist',
      department: 'loadbooking',
      status: 'active',
      currentTask:
        'Generating RPM analysis reports - 78.5% success rate across all platforms',
      tasksCompleted: 45,
      revenue: 11650,
      efficiency: 94.1,
      lastActivity: '3 min ago',
      avatar: '📊',
    },
    {
      id: 'loadbook-004',
      name: 'Uber Freight Bot',
      role: 'Digital Marketplace Specialist',
      department: 'loadbooking',
      status: 'busy',
      currentTask:
        'Processing Uber Freight opportunities - 3.37/mile average, 89% recommendation score',
      tasksCompleted: 34,
      revenue: 8900,
      efficiency: 91.3,
      lastActivity: '45 sec ago',
      avatar: '📱',
    },
    {
      id: 'loadbook-005',
      name: 'Convoy Intelligence',
      role: 'Partnership Load Specialist',
      department: 'loadbooking',
      status: 'active',
      currentTask:
        'Monitoring Convoy partnership loads - focusing on West Coast routes',
      tasksCompleted: 28,
      revenue: 6700,
      efficiency: 87.9,
      lastActivity: '2 min ago',
      avatar: '🤖',
    },
    {
      id: 'loadbook-006',
      name: 'RPM Calculator Pro',
      role: 'Profitability Analysis Expert',
      department: 'loadbooking',
      status: 'busy',
      currentTask:
        'Real-time RPM calculations - identified 15 loads above $3.00/mile threshold',
      tasksCompleted: 156,
      revenue: 12400,
      efficiency: 95.8,
      lastActivity: '15 sec ago',
      avatar: '💰',
    },
    {
      id: 'loadbook-007',
      name: 'Factoring Ratings AI',
      role: 'Credit Risk Assessment Specialist',
      department: 'loadbooking',
      status: 'active',
      currentTask:
        'Analyzing broker credit ratings - 67% A+ rated, 23% B+ rated brokers today',
      tasksCompleted: 78,
      revenue: 9200,
      efficiency: 93.6,
      lastActivity: '1 min ago',
      avatar: '⭐',
    },
    {
      id: 'loadbook-008',
      name: 'Telegram Alert Bot',
      role: 'Notification & Communication Specialist',
      department: 'loadbooking',
      status: 'active',
      currentTask:
        'Sending real-time Telegram alerts - 23 successful bookings notified today',
      tasksCompleted: 234,
      revenue: 5600,
      efficiency: 98.2,
      lastActivity: '10 sec ago',
      avatar: '📢',
    },

    // Marketing & Growth AI Team
    {
      id: 'marketing-001',
      name: 'AI Content Creator Pro',
      role: 'Freight Industry Content Specialist',
      department: 'marketing',
      status: 'busy',
      currentTask:
        'Creating shipper acquisition content - 15 articles on "Why Choose DEPOINTE for Freight" - 847K impressions targeting logistics managers',
      tasksCompleted: 234,
      revenue: 28900,
      efficiency: 97.3,
      lastActivity: '8 sec ago',
      avatar: '🎨',
    },
    {
      id: 'marketing-002',
      name: 'AI Email Marketing Specialist',
      role: 'Automated Campaign Manager',
      department: 'marketing',
      status: 'active',
      currentTask:
        'Managing shipper acquisition campaigns - 5 nurture sequences for 2,847 freight prospects (1,423 shippers, 1,424 carriers) - 23.5% open rate',
      tasksCompleted: 567,
      revenue: 45600,
      efficiency: 96.8,
      lastActivity: '12 sec ago',
      avatar: '📧',
    },
    {
      id: 'marketing-003',
      name: 'AI Social Media Manager',
      role: 'Multi-Platform Engagement Expert',
      department: 'marketing',
      status: 'active',
      currentTask:
        'Freight brokerage social media: 156 carrier recruitment connections, 89 shipper acquisition prospects engaged for load opportunities',
      tasksCompleted: 342,
      revenue: 19800,
      efficiency: 94.7,
      lastActivity: '6 sec ago',
      avatar: '📱',
    },
    {
      id: 'marketing-004',
      name: 'AI Video Marketing Producer',
      role: 'Visual Content Automation',
      department: 'marketing',
      status: 'busy',
      currentTask:
        'Producing freight brokerage video content - "Shipper Success Stories" and "Carrier Opportunity Showcase" - 23 videos, 67K views',
      tasksCompleted: 89,
      revenue: 22300,
      efficiency: 95.2,
      lastActivity: '4 sec ago',
      avatar: '🎥',
    },
    {
      id: 'marketing-005',
      name: 'AI Marketing Analytics',
      role: 'Campaign Performance Analyst',
      department: 'marketing',
      status: 'active',
      currentTask:
        'Analyzing freight brokerage performance - Q1 shipper acquisition up 34.5%, carrier recruitment campaigns optimized for load board fill rates',
      tasksCompleted: 156,
      revenue: 31200,
      efficiency: 98.1,
      lastActivity: '2 sec ago',
      avatar: '📊',
    },
    {
      id: 'marketing-006',
      name: 'AI Brand Manager',
      role: 'Brand Voice & Messaging Specialist',
      department: 'marketing',
      status: 'active',
      currentTask:
        'Optimizing freight brokerage brand messaging - "Go With the Flow" across 47 shipper/carrier touchpoints - 92% consistency achieved',
      tasksCompleted: 78,
      revenue: 18700,
      efficiency: 96.4,
      lastActivity: '10 sec ago',
      avatar: '🎪',
    },
    {
      id: 'marketing-007',
      name: 'AI LinkedIn Lead Specialist',
      role: 'B2B Lead Generation & CRM Integration',
      department: 'marketing',
      status: 'active',
      currentTask:
        'Processing 8 freight industry LinkedIn leads today - 3 high-quality prospects (2 shippers, 1 carrier - Score: 76 avg) synced to CRM',
      tasksCompleted: 47,
      revenue: 45000,
      efficiency: 94.2,
      lastActivity: '3 sec ago',
      avatar: '🔗',
    },
    {
      id: 'marketing-008',
      name: 'AI Freight Market Intelligence',
      role: 'Freight Brokerage Market Analyst & Strategic Intelligence',
      department: 'marketing',
      status: 'busy',
      currentTask:
        'Analyzing freight market trends - identified 247 new shipper prospects and 156 carrier recruitment opportunities',
      tasksCompleted: 174,
      revenue: 67400,
      efficiency: 98.4,
      lastActivity: '5 sec ago',
      avatar: '📈',
    },

    // 🎯 AI CUSTOMER SUPPORT - SUPERIOR TO SALESAI.COM
    {
      id: 'support-001',
      name: 'DEPOINTE Support AI Alpha',
      role: '24/7 Customer Support Specialist',
      department: 'customer_service',
      status: 'busy',
      currentTask:
        'Resolved 23 tickets today (18min avg) - Currently helping ABC Logistics with shipment tracking issue',
      tasksCompleted: 156,
      revenue: 89500,
      efficiency: 89.1,
      lastActivity: '2 sec ago',
      avatar: '🎯',
    },
    {
      id: 'support-002',
      name: 'DEPOINTE Technical AI Beta',
      role: 'Technical Support & Issue Resolution',
      department: 'customer_service',
      status: 'active',
      currentTask:
        'Diagnosing GPS tracking issues for 3 customers - 81.3% technical resolution rate achieved',
      tasksCompleted: 134,
      revenue: 67800,
      efficiency: 81.3,
      lastActivity: '1 sec ago',
      avatar: '🔧',
    },
    {
      id: 'support-003',
      name: 'DEPOINTE Crisis AI Gamma',
      role: 'Emergency Response & Crisis Management',
      department: 'customer_service',
      status: 'active',
      currentTask:
        'Emergency protocols activated for I-95 breakdown - Replacement driver dispatched in 45min',
      tasksCompleted: 89,
      revenue: 45900,
      efficiency: 92.7,
      lastActivity: '1 sec ago',
      avatar: '🚨',
    },
    {
      id: 'support-004',
      name: 'DEPOINTE Chatbot Director',
      role: 'Intelligent Chatbot Operations',
      department: 'customer_service',
      status: 'busy',
      currentTask:
        'Managing 12 active chat sessions - 84.2% first-contact resolution rate, 4.7/5.0 satisfaction',
      tasksCompleted: 267,
      revenue: 34700,
      efficiency: 84.2,
      lastActivity: '3 sec ago',
      avatar: '💬',
    },
    {
      id: 'support-005',
      name: 'AI Billing Support Specialist',
      role: 'Invoice & Payment Issue Resolution',
      department: 'customer_service',
      status: 'active',
      currentTask:
        'Processed 15 billing inquiries today - Resolved $230 invoice discrepancy for Metro Manufacturing',
      tasksCompleted: 78,
      revenue: 23400,
      efficiency: 95.8,
      lastActivity: '4 sec ago',
      avatar: '💳',
    },
    {
      id: 'support-006',
      name: 'AI Knowledge Base Manager',
      role: 'Support Content & Training Optimization',
      department: 'customer_service',
      status: 'idle',
      currentTask:
        'Updated 23 knowledge base articles today - 89% customer self-service success rate',
      tasksCompleted: 45,
      revenue: 12800,
      efficiency: 89.0,
      lastActivity: '8 sec ago',
      avatar: '📚',
    },

    // Additional staff members for all departments...
    // (Keeping this concise for the rewrite, but including key representatives)
  ];

  // Advanced Analytics Data
  const performanceMetrics: PerformanceMetrics = {
    hourlyRevenue: [
      8500, 9200, 12400, 15600, 18900, 22300, 19800, 17200, 14500, 16800, 21200,
      25400,
    ],
    dailyTasks: [245, 289, 312, 298, 356, 387, 421, 398, 445, 467, 489, 512],
    weeklyEfficiency: [94.2, 95.8, 96.7, 97.1, 97.8, 98.2, 98.5],
    monthlyGrowth: [12.5, 18.7, 24.3, 31.2, 38.9, 45.6],
  };

  // ADD REAL DATA - Live FleetFlow Integration Data (keep same interface)
  const [fleetFlowIntegration, setFleetFlowIntegration] =
    useState<FleetFlowIntegration>({
      loadBoardConnections: 47, // Will be updated with real data
      activeDispatches: 23, // Will be updated with real data
      revenueGenerated: 156780, // Will be updated with real data
      customerInteractions: 89,
      apiCalls: 12847,
    });

  // ADD SQUARE & BILL.COM FINANCIAL MANAGEMENT STATE
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    totalReceivables: 0,
    totalPayables: 0,
    pendingInvoices: 0,
    paidInvoices: 0,
    overdueAmount: 0,
    cashFlow: 0,
  });

  const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>([
    {
      name: 'Square',
      capabilities: ['Payables', 'Receivables', 'Invoicing', 'Payments'],
      status: 'active',
      monthlyVolume: 0,
      fees: 0,
    },
    {
      name: 'Bill.com',
      capabilities: ['Receivables Only'],
      status: 'active',
      monthlyVolume: 0,
      fees: 0,
    },
  ]);

  // Active AI Tasks
  const aiTasks: AITask[] = [
    {
      id: 'task-001',
      title: 'Process 15 new freight quotes for Fortune 500 clients',
      priority: 'critical',
      assignedTo: 'sales-001',
      status: 'in_progress',
      estimatedCompletion: '2:30 PM',
      actualRevenue: 12500,
    },
    {
      id: 'task-002',
      title: 'Coordinate multi-state delivery for Walmart contract',
      priority: 'critical',
      assignedTo: 'logistics-001',
      status: 'in_progress',
      estimatedCompletion: '4:15 PM',
      actualRevenue: 8900,
    },
    {
      id: 'task-003',
      title: 'Complete FMCSA compliance audit for 12 carriers',
      priority: 'high',
      assignedTo: 'legal-001',
      status: 'pending',
      estimatedCompletion: '6:00 PM',
    },
  ];

  // System Alerts
  const systemAlerts: SystemAlert[] = [
    {
      id: 'alert-001',
      type: 'success',
      message:
        'DEPOINTE AI Freight Broker secured $45K contract with Amazon Logistics - FREIGHT 1ST DIRECT handling dispatch',
      timestamp: '2 min ago',
      department: 'sales',
    },
    {
      id: 'alert-salesai-001',
      type: 'success',
      message:
        'AI Live Call Assistant achieved 94.2% recommendation acceptance rate during active calls',
      timestamp: '1 min ago',
      department: 'sales',
    },
    {
      id: 'alert-support-001',
      type: 'success',
      message:
        '🎯 AI Customer Support achieved 84.2% resolution rate today - Superior to SalesAI.com! Resolved 23 tickets in 18min average',
      timestamp: '30 sec ago',
      department: 'customer_service',
    },
    {
      id: 'alert-support-002',
      type: 'info',
      message:
        'DEPOINTE Chatbot Director handling 12 active chat sessions - 4.7/5.0 customer satisfaction achieved',
      timestamp: '1 min ago',
      department: 'customer_service',
    },
    {
      id: 'alert-support-003',
      type: 'warning',
      message:
        'DEPOINTE Crisis AI Gamma dispatched emergency response for I-95 breakdown - FREIGHT 1ST DIRECT replacement driver en route (45min)',
      timestamp: '2 min ago',
      department: 'customer_service',
    },
    {
      id: 'alert-salesai-002',
      type: 'info',
      message:
        'AI Follow-Up Coordinator scheduled 23 automated follow-ups with 78% expected response rate',
      timestamp: '3 min ago',
      department: 'sales',
    },
    {
      id: 'alert-salesai-003',
      type: 'success',
      message:
        'AI Call Analytics detected 34.5% conversion rate increase after implementing freight objection handlers',
      timestamp: '4 min ago',
      department: 'sales',
    },
    {
      id: 'alert-marketing-001',
      type: 'success',
      message:
        'AI Content Creator achieved 847K impressions with "DEPOINTE Freight Opportunities" LinkedIn series - 89 shipper prospects engaged',
      timestamp: '2 min ago',
      department: 'marketing',
    },
    {
      id: 'alert-marketing-002',
      type: 'success',
      message:
        'AI Email Marketing improved shipper/carrier acquisition sequences - 23.5% open rate, 156 carriers recruited this week',
      timestamp: '5 min ago',
      department: 'marketing',
    },
    {
      id: 'alert-marketing-003',
      type: 'info',
      message:
        'AI Video Producer completed Shipper Success Stories series - 67K views from logistics managers and carrier recruiters',
      timestamp: '6 min ago',
      department: 'marketing',
    },
    {
      id: 'alert-marketing-004',
      type: 'success',
      message:
        'AI LinkedIn Lead Specialist processed 8 freight prospects today - 3 high-quality leads (2 shippers, 1 carrier - Score: 76+) synced to CRM',
      timestamp: '3 min ago',
      department: 'marketing',
    },
    {
      id: 'alert-marketing-005',
      type: 'success',
      message:
        'AI Freight Market Intelligence identified 247 new shipper prospects and 156 carrier recruitment opportunities',
      timestamp: '1 min ago',
      department: 'marketing',
    },
    {
      id: 'alert-marketing-006',
      type: 'info',
      message:
        'Freight market intelligence: 23% increase in manufacturing shipper demand for transportation services this quarter',
      timestamp: '8 min ago',
      department: 'marketing',
    },
    {
      id: 'alert-marketing-007',
      type: 'warning',
      message:
        'Carrier recruitment: Low carrier capacity detected in Southeast region - need targeted recruitment campaigns',
      timestamp: '15 min ago',
      department: 'marketing',
    },
    {
      id: 'alert-002',
      type: 'warning',
      message:
        'High fuel costs detected - AI Cost Optimizer recommending route changes',
      timestamp: '5 min ago',
      department: 'logistics',
    },
    {
      id: 'alert-003',
      type: 'info',
      message:
        'AI Training Director completed DOT compliance course for 23 drivers',
      timestamp: '8 min ago',
      department: 'training',
    },
  ];

  // SQUARE & BILL.COM FINANCIAL DATA LOADING FUNCTION
  const loadFinancialData = async () => {
    try {
      // Initialize Square service (single-user, not multi-tenant)
      const { squareService } = await import('../services/SquareService');

      // Get Square financial data (Payables, Receivables, Invoicing)
      const squareInvoices = await squareService.listInvoices({
        limit: 100,
      });

      // Get Bill.com receivables data (using mock data for now)
      const billComInvoices = [
        {
          id: 'bc_001',
          amount: '15000',
          status: 'Open',
          dueDate: '2024-01-15',
        },
        { id: 'bc_002', amount: '8500', status: 'Paid', dueDate: '2024-01-10' },
        {
          id: 'bc_003',
          amount: '12000',
          status: 'Sent',
          dueDate: '2024-01-20',
        },
      ];

      // Calculate financial summary
      let totalReceivables = 0;
      let totalPayables = 0;
      let pendingInvoices = 0;
      let paidInvoices = 0;
      let overdueAmount = 0;

      // Process Square data
      if (squareInvoices.success && squareInvoices.invoices) {
        squareInvoices.invoices.forEach((invoice: any) => {
          const amount = invoice.amount || 0;

          if (
            invoice.status === 'UNPAID' ||
            invoice.status === 'PARTIALLY_PAID' ||
            invoice.status === 'SCHEDULED'
          ) {
            totalReceivables += amount;
            pendingInvoices++;

            // Check if overdue
            if (invoice.dueDate) {
              const dueDate = new Date(invoice.dueDate);
              if (dueDate < new Date()) {
                overdueAmount += amount;
              }
            }
          } else if (invoice.status === 'PAID') {
            paidInvoices++;
          }
        });
      }

      // Get comprehensive financial summary from Square service
      const squareFinancialSummary = await squareService.getFinancialSummary();

      // Use Square service summary if available
      if (squareFinancialSummary) {
        totalReceivables = squareFinancialSummary.totalReceivables;
        totalPayables = squareFinancialSummary.totalPayables;
        pendingInvoices = squareFinancialSummary.pendingInvoices;
        paidInvoices = squareFinancialSummary.paidInvoices;
        overdueAmount = squareFinancialSummary.overdueAmount;
      }

      // Process Bill.com receivables data
      billComInvoices.forEach((invoice: any) => {
        const amount = parseFloat(invoice.amount || '0');

        if (invoice.status === 'Open' || invoice.status === 'Sent') {
          totalReceivables += amount;
          pendingInvoices++;

          // Check if overdue
          const dueDate = new Date(invoice.dueDate || Date.now());
          if (dueDate < new Date()) {
            overdueAmount += amount;
          }
        } else if (invoice.status === 'Paid') {
          paidInvoices++;
        }
      });

      // Update financial summary
      setFinancialSummary({
        totalReceivables,
        totalPayables, // Would be calculated from Square payables
        pendingInvoices,
        paidInvoices,
        overdueAmount,
        cashFlow: totalReceivables - totalPayables,
      });

      // Update payment provider volumes
      setPaymentProviders((prev) =>
        prev.map((provider) => ({
          ...provider,
          monthlyVolume:
            provider.name === 'Square'
              ? (squareInvoices.invoices?.length || 0) * 1500 // Estimated volume
              : billComInvoices.length * 800, // Estimated volume
          fees:
            provider.name === 'Square'
              ? (squareInvoices.invoices?.length || 0) * 45 // Estimated fees
              : billComInvoices.length * 25, // Estimated fees
        }))
      );

      console.log('✅ Square & Bill.com financial data loaded successfully');
    } catch (error) {
      console.warn(
        '⚠️ Financial data loading failed, using fallback data:',
        error
      );

      // Fallback financial data
      setFinancialSummary({
        totalReceivables: 125000,
        totalPayables: 85000,
        pendingInvoices: 23,
        paidInvoices: 156,
        overdueAmount: 15000,
        cashFlow: 40000,
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeUpdate((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // REAL DATA INTEGRATION - Load live FleetFlow operational data (same UI)
  useEffect(() => {
    const loadRealData = async () => {
      try {
        console.log('🔄 Loading real AI Company Dashboard data...');

        // Fetch comprehensive real data from the new integration service
        const response = await fetch('/api/ai-dashboard?action=comprehensive', {
          headers: {
            'x-tenant-id': 'depointe-freight1st',
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch dashboard data');
        }

        const { data } = result;

        // Update FleetFlow integration with REAL DATA (same UI structure)
        setFleetFlowIntegration({
          loadBoardConnections: data.operationalData.loadBoardConnections,
          activeDispatches: data.operationalData.activeDispatches,
          revenueGenerated: data.realTimeMetrics.totalRevenue,
          customerInteractions: data.realTimeMetrics.customerInteractions,
          apiCalls: data.realTimeMetrics.apiCalls,
        });

        // Update financial summary with real Bill.com/Square data
        setFinancialSummary({
          totalReceivables: data.financialData.totalReceivables,
          totalPayables: data.financialData.totalPayables,
          pendingInvoices: data.financialData.pendingInvoices,
          paidInvoices: data.financialData.paidInvoices,
          overdueAmount: data.financialData.overdueAmount,
          cashFlow: data.financialData.cashFlow,
        });

        // Update payment providers with real data
        setPaymentProviders((prev) =>
          prev.map((provider) => ({
            ...provider,
            monthlyVolume:
              provider.name === 'Square'
                ? data.financialData.monthlyRevenue * 0.3
                : data.financialData.monthlyRevenue * 0.7,
            fees:
              provider.name === 'Square'
                ? data.financialData.processingFees * 0.3
                : data.financialData.processingFees * 0.7,
          }))
        );

        console.log(`✅ Real data loaded successfully (${data.dataSource})`);
        console.log('📊 Dashboard metrics:', {
          revenue: data.realTimeMetrics.totalRevenue,
          loads: data.realTimeMetrics.activeLoads,
          efficiency: data.realTimeMetrics.systemEfficiency,
          source: data.dataSource,
        });
      } catch (error) {
        console.warn(
          '⚠️ Real data loading error, using fallback values:',
          error
        );

        // Fallback to previous behavior with individual service calls
        try {
          const loads = await getMainDashboardLoads();
          const loadStats = await getLoadStats();
          const financialMetrics = await calculateFinancialMetrics(
            'admin',
            'monthly'
          );

          setFleetFlowIntegration((prev) => ({
            ...prev,
            loadBoardConnections:
              loads.length || prev.loadBoardConnections || 47,
            activeDispatches:
              loadStats.inTransit + loadStats.assigned ||
              prev.activeDispatches ||
              23,
            revenueGenerated:
              financialMetrics?.revenue?.total ||
              prev.revenueGenerated ||
              156780,
            customerInteractions: prev.customerInteractions || 89,
            apiCalls: prev.apiCalls || 12847,
          }));

          await loadFinancialData();
          console.log('✅ Fallback data loaded from individual services');
        } catch (fallbackError) {
          console.warn(
            '⚠️ Fallback data loading also failed, using static values:',
            fallbackError
          );

          // Final fallback to static values
          setFleetFlowIntegration({
            loadBoardConnections: 47,
            activeDispatches: 23,
            revenueGenerated: 156780,
            customerInteractions: 89,
            apiCalls: 12847,
          });
        }
      }
    };

    // Load real data on mount and every 30 seconds
    loadRealData();
    const dataInterval = setInterval(loadRealData, 30000);

    return () => clearInterval(dataInterval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'busy':
        return '#f59e0b';
      case 'idle':
        return '#6b7280';
      case 'offline':
        return '#ef4444';
      default:
        return '#f3f4f6';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#ea580c';
      case 'medium':
        return '#d97706';
      case 'low':
        return '#65a30d';
      default:
        return '#6b7280';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#dc2626';
      case 'info':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const filteredStaffMembers =
    selectedDepartment === 'all'
      ? aiStaff
      : aiStaff.filter((staff) => staff.department === selectedDepartment);

  const filteredAlertsList =
    alertFilter === 'all'
      ? systemAlerts
      : systemAlerts.filter((alert) => alert.department === alertFilter);

  const totalCompanyRevenue = departments.reduce(
    (sum, dept) => sum + dept.dailyRevenue,
    0
  );
  const totalCompanyTasks = departments.reduce(
    (sum, dept) => sum + dept.tasksCompleted,
    0
  );
  const averageEfficiency =
    departments.reduce((sum, dept) => sum + dept.efficiency, 0) /
    departments.length;
  const totalStaff = departments.reduce(
    (sum, dept) => sum + dept.totalStaff,
    0
  );
  const totalActive = departments.reduce(
    (sum, dept) => sum + dept.activeStaff,
    0
  );

  const handleStaffClick = (staffId: string) => {
    setSelectedStaff(staffId);
    setShowStaffDetails(true);
  };

  const selectedStaffMember = aiStaff.find(
    (staff) => staff.id === selectedStaff
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 25%, #4a2c6a 50%, #663d86 75%, #8b5cf6 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
          radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(219, 39, 119, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)
        `,
          animation: 'float 20s ease-in-out infinite',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '32px',
          maxWidth: '1800px',
          margin: '0 auto',
        }}
      >
        {/* PREMIUM GLASSMORPHISM HEADER */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background:
                    'linear-gradient(135deg, #ec4899 0%, #be185d 50%, #a21caf 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 40px -10px rgba(236, 72, 153, 0.5)',
                  animation: 'glow 3s ease-in-out infinite alternate',
                }}
              >
                <span style={{ fontSize: '40px' }}>🤖</span>
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '56px',
                    fontWeight: '900',
                    background:
                      'linear-gradient(135deg, #ffffff 0%, #fce7f3 50%, #f3e8ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: 0,
                    lineHeight: '1.1',
                    textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  DEE DAVIS INC dba DEPOINTE
                </h1>
                <p
                  style={{
                    fontSize: '24px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                    marginTop: '8px',
                    fontWeight: '500',
                  }}
                >
                  🚛 Freight Brokerage & Transportation | FREIGHT 1ST DIRECT
                  Dispatch Division | MC 1647572 | DOT 4250594
                </p>
              </div>
            </div>

            {/* PREMIUM CONTROL PANEL */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button
                onClick={() =>
                  setSelectedView(
                    selectedView === 'overview' ? 'analytics' : 'overview'
                  )
                }
                style={{
                  background:
                    selectedView === 'analytics'
                      ? 'linear-gradient(135deg, #ec4899, #be185d)'
                      : 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border:
                    selectedView === 'analytics'
                      ? 'none'
                      : '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  boxShadow:
                    selectedView === 'analytics'
                      ? '0 10px 25px -5px rgba(236, 72, 153, 0.4)'
                      : '0 4px 15px -3px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  transform:
                    selectedView === 'analytics' ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                📊 Analytics
              </button>
              <button
                onClick={() => setShowTaskManager(!showTaskManager)}
                style={{
                  background: showTaskManager
                    ? 'linear-gradient(135deg, #ec4899, #db2777)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: showTaskManager
                    ? 'none'
                    : '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  boxShadow: showTaskManager
                    ? '0 10px 25px -5px rgba(236, 72, 153, 0.4)'
                    : '0 4px 15px -3px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  transform: showTaskManager ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                🎯 Tasks
              </button>
              <button
                onClick={() => setShowReports(!showReports)}
                style={{
                  background: showReports
                    ? 'linear-gradient(135deg, #ec4899, #be185d)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: showReports
                    ? 'none'
                    : '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  boxShadow: showReports
                    ? '0 10px 25px -5px rgba(236, 72, 153, 0.4)'
                    : '0 4px 15px -3px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  transform: showReports ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                📈 Reports
              </button>
            </div>
          </div>

          {/* ✅ PLATFORM AI MONITORING INTEGRATION */}
          <div style={{ marginBottom: '20px' }}>
            <PlatformAIMonitor />
          </div>

          {/* COMPACT METRICS DASHBOARD */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              maxWidth: '100%',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(236, 72, 153, 0.9) 0%, rgba(219, 39, 119, 0.9) 100%)',
                borderRadius: '12px',
                padding: '16px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 16px -4px rgba(236, 72, 153, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '100px',
                maxHeight: '120px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200px',
                  height: '200px',
                  background:
                    'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '16px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                        fontWeight: '600',
                      }}
                    >
                      Active AI Staff
                    </p>
                    <p
                      style={{
                        fontSize: '24px',
                        fontWeight: '900',
                        margin: 0,
                        color: '#ffffff',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {totalActive}
                    </p>
                  </div>
                  <span style={{ fontSize: '24px', opacity: 0.8 }}>👥</span>
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                  }}
                >
                  🟢 All systems operational
                </div>
              </div>
            </div>

            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(29, 78, 216, 0.9) 100%)',
                borderRadius: '12px',
                padding: '16px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '100px',
                maxHeight: '120px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200px',
                  height: '200px',
                  background:
                    'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '16px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                        fontWeight: '600',
                      }}
                    >
                      Tasks Completed
                    </p>
                    <p
                      style={{
                        fontSize: '24px',
                        fontWeight: '900',
                        margin: 0,
                        color: '#ffffff',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {totalCompanyTasks.toLocaleString()}
                    </p>
                  </div>
                  <span style={{ fontSize: '24px', opacity: 0.8 }}>✅</span>
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                  }}
                >
                  🚀 +12.3% vs yesterday
                </div>
              </div>
            </div>

            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.9) 100%)',
                borderRadius: '12px',
                padding: '16px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px -10px rgba(245, 158, 11, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '100px',
                maxHeight: '120px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200px',
                  height: '200px',
                  background:
                    'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '16px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                        fontWeight: '600',
                      }}
                    >
                      Daily Revenue
                    </p>
                    <p
                      style={{
                        fontSize: '24px',
                        fontWeight: '900',
                        margin: 0,
                        color: '#ffffff',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {formatCurrency(totalCompanyRevenue)}
                    </p>
                  </div>
                  <span style={{ fontSize: '24px', opacity: 0.8 }}>💰</span>
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                  }}
                >
                  📈 +18.5% vs last week
                </div>
              </div>
            </div>

            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%)',
                borderRadius: '12px',
                padding: '16px',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px -10px rgba(139, 92, 246, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '100px',
                maxHeight: '120px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200px',
                  height: '200px',
                  background:
                    'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '16px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                        fontWeight: '600',
                      }}
                    >
                      Efficiency Rate
                    </p>
                    <p
                      style={{
                        fontSize: '24px',
                        fontWeight: '900',
                        margin: 0,
                        color: '#ffffff',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {averageEfficiency.toFixed(1)}%
                    </p>
                  </div>
                  <span style={{ fontSize: '24px', opacity: 0.8 }}>⚡</span>
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                  }}
                >
                  🎯 Peak performance mode
                </div>
              </div>
            </div>
          </div>

          {/* FINANCIAL OPERATIONS SECTION */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '32px',
              marginBottom: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '32px',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background:
                    'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 15px 30px -8px rgba(34, 197, 94, 0.4)',
                }}
              >
                <span style={{ fontSize: '28px' }}>💳</span>
              </div>
              <div>
                <h2
                  style={{
                    fontSize: '36px',
                    fontWeight: '800',
                    background:
                      'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    margin: 0,
                    lineHeight: '1.1',
                  }}
                >
                  Financial Command Center
                </h2>
                <p
                  style={{
                    fontSize: '18px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    margin: 0,
                    marginTop: '4px',
                    fontWeight: '500',
                  }}
                >
                  Square & Bill.com Integration • Real-time Financial
                  Intelligence
                </p>
              </div>
            </div>

            {/* SQUARE & BILL.COM FINANCIAL COMMAND CENTER */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.1))',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 8px 32px rgba(34, 197, 94, 0.2)',
              }}
            >
              {/* Financial Summary KPIs - Horizontal Layout */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  marginBottom: '20px',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Total Receivables */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background:
                      'linear-gradient(90deg, rgba(34, 197, 94, 0.1), transparent)',
                    borderLeft: '3px solid #22c55e',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>💰</span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: '500',
                      }}
                    >
                      Total Receivables
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#22c55e',
                    }}
                  >
                    ${financialSummary.totalReceivables.toLocaleString()}
                  </span>
                </div>

                {/* Total Payables */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background:
                      'linear-gradient(90deg, rgba(239, 68, 68, 0.1), transparent)',
                    borderLeft: '3px solid #ef4444',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>📤</span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: '500',
                      }}
                    >
                      Total Payables
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#ef4444',
                    }}
                  >
                    ${financialSummary.totalPayables.toLocaleString()}
                  </span>
                </div>

                {/* Cash Flow */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background:
                      'linear-gradient(90deg, rgba(59, 130, 246, 0.1), transparent)',
                    borderLeft: '3px solid #3b82f6',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>💧</span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: '500',
                      }}
                    >
                      Net Cash Flow
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color:
                        financialSummary.cashFlow >= 0 ? '#22c55e' : '#ef4444',
                    }}
                  >
                    ${financialSummary.cashFlow.toLocaleString()}
                  </span>
                </div>

                {/* Pending Invoices */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background:
                      'linear-gradient(90deg, rgba(245, 158, 11, 0.1), transparent)',
                    borderLeft: '3px solid #f59e0b',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>⏳</span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: '500',
                      }}
                    >
                      Pending Invoices
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#f59e0b',
                    }}
                  >
                    {financialSummary.pendingInvoices}
                  </span>
                </div>

                {/* Overdue Amount */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background:
                      'linear-gradient(90deg, rgba(168, 85, 247, 0.1), transparent)',
                    borderLeft: '3px solid #a855f7',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>⚠️</span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: '500',
                      }}
                    >
                      Overdue Amount
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#a855f7',
                    }}
                  >
                    ${financialSummary.overdueAmount.toLocaleString()}
                  </span>
                </div>

                {/* Paid Invoices */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background:
                      'linear-gradient(90deg, rgba(16, 185, 129, 0.1), transparent)',
                    borderLeft: '3px solid #10b981',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>✅</span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontWeight: '500',
                      }}
                    >
                      Paid Invoices
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#10b981',
                    }}
                  >
                    {financialSummary.paidInvoices}
                  </span>
                </div>
              </div>

              {/* Payment Providers Status */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px',
                }}
              >
                {paymentProviders.map((provider, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(15px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '16px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <h3
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          margin: 0,
                          fontWeight: 'bold',
                        }}
                      >
                        {provider.name === 'Square' ? '🟦' : '💙'}{' '}
                        {provider.name}
                      </h3>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          background:
                            provider.status === 'active'
                              ? 'rgba(34, 197, 94, 0.2)'
                              : 'rgba(239, 68, 68, 0.2)',
                          color:
                            provider.status === 'active'
                              ? '#22c55e'
                              : '#ef4444',
                          border: `1px solid ${provider.status === 'active' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                        }}
                      >
                        {provider.status.toUpperCase()}
                      </span>
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '12px',
                          margin: '0 0 4px 0',
                        }}
                      >
                        Capabilities: {provider.capabilities.join(', ')}
                      </p>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '12px',
                          margin: '0 0 4px 0',
                        }}
                      >
                        Monthly Volume: $
                        {provider.monthlyVolume.toLocaleString()}
                      </p>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '12px',
                          margin: 0,
                        }}
                      >
                        Monthly Fees: ${provider.fees.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Status Bar */}
              <div
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                💳 Square: Payables + Receivables + Invoicing | 💙 Bill.com:
                Receivables Only - Live Financial Data
              </div>
            </div>
          </div>
        </div>

        {/* DEPARTMENT SELECTION WITH GLASSMORPHISM */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.2)',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '24px',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            🏢 AI Department Command Center
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <button
              onClick={() => setSelectedDepartment('all')}
              style={{
                background:
                  selectedDepartment === 'all'
                    ? 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                color: selectedDepartment === 'all' ? '#1f2937' : '#ffffff',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                boxShadow:
                  selectedDepartment === 'all'
                    ? '0 10px 25px -5px rgba(255, 255, 255, 0.2)'
                    : '0 4px 15px -3px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                transform:
                  selectedDepartment === 'all' ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              🌟 All Departments ({totalStaff})
            </button>
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                style={{
                  background:
                    selectedDepartment === dept.id
                      ? `linear-gradient(135deg, ${dept.color}dd, ${dept.color}bb)`
                      : 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: `2px solid ${selectedDepartment === dept.id ? dept.color : 'rgba(255, 255, 255, 0.3)'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  boxShadow:
                    selectedDepartment === dept.id
                      ? `0 10px 25px -5px ${dept.color}40`
                      : '0 4px 15px -3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  transform:
                    selectedDepartment === dept.id ? 'scale(1.02)' : 'scale(1)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                  {dept.icon}
                </div>
                <div>{dept.name}</div>
                <div
                  style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}
                >
                  {dept.activeStaff}/{dept.totalStaff} Active
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* PREMIUM AI STAFF GRID */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '32px',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            🤖 AI Staff Operations Monitor
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredStaffMembers.map((staff) => (
              <div
                key={staff.id}
                onClick={() => handleStaffClick(staff.id)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '24px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow =
                    '0 20px 40px -10px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 10px 25px -5px rgba(0, 0, 0, 0.2)';
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${getStatusColor(staff.status)}, ${getStatusColor(staff.status)}aa)`,
                    borderRadius: '16px 16px 0 0',
                  }}
                />

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${getStatusColor(staff.status)}, ${getStatusColor(staff.status)}dd)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      boxShadow: `0 8px 20px -5px ${getStatusColor(staff.status)}40`,
                    }}
                  >
                    {staff.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#ffffff',
                        margin: 0,
                        marginBottom: '4px',
                      }}
                    >
                      {staff.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        margin: 0,
                        fontWeight: '500',
                      }}
                    >
                      {staff.role}
                    </p>
                  </div>
                  <div
                    style={{
                      background: `${getStatusColor(staff.status)}20`,
                      color: getStatusColor(staff.status),
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      border: `1px solid ${getStatusColor(staff.status)}40`,
                    }}
                  >
                    {staff.status}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: 0,
                      lineHeight: '1.4',
                      fontWeight: '500',
                    }}
                  >
                    🎯 {staff.currentTask}
                  </p>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '12px',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '800',
                        color: '#ec4899',
                        marginBottom: '4px',
                      }}
                    >
                      {staff.tasksCompleted}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontWeight: '600',
                      }}
                    >
                      Tasks
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '800',
                        color: '#f59e0b',
                        marginBottom: '4px',
                      }}
                    >
                      {formatCurrency(staff.revenue)}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontWeight: '600',
                      }}
                    >
                      Revenue
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '800',
                        color: '#a855f7',
                        marginBottom: '4px',
                      }}
                    >
                      {staff.efficiency}%
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontWeight: '600',
                      }}
                    >
                      Efficiency
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '16px',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    textAlign: 'center',
                    fontWeight: '500',
                  }}
                >
                  Last activity: {staff.lastActivity}
                </div>

                {/* Click Indicator */}
                <div
                  style={{
                    marginTop: '12px',
                    textAlign: 'center',
                    fontSize: '12px',
                    color: 'rgba(236, 72, 153, 0.8)',
                    fontWeight: '600',
                    background: 'rgba(236, 72, 153, 0.1)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: '1px solid rgba(236, 72, 153, 0.3)',
                  }}
                >
                  👆 Click for details
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LIVE ACTIVITY FEED WITH GLASSMORPHISM */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '24px',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            📡 Live AI Operations Feed
          </h2>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {[
              {
                icon: '🧠',
                text: 'AI Chief Executive analyzing Q1 performance metrics - 98.5% efficiency',
                time: '2 min ago',
                color: '#ec4899',
              },
              {
                icon: '📈',
                text: 'DEPOINTE AI Freight Broker: FreightFlow RFx bidding on 8 opportunities + securing $2,850 rate',
                time: '45 sec ago',
                color: '#db2777',
              },
              {
                icon: '📡',
                text: 'FREIGHT 1ST DIRECT AI Dispatcher: Go With Flow coordination + Schedule Management + Live Tracking for 23 loads',
                time: '1 min ago',
                color: '#f59e0b',
              },
              {
                icon: '🚢',
                text: 'AI Ocean Forwarder processing maritime shipment through Port of Long Beach',
                time: '3 min ago',
                color: '#14b8a6',
              },
              {
                icon: '🏛️',
                text: 'AI Government Contractor submitted proposal for $2.3M federal logistics contract',
                time: '4 min ago',
                color: '#dc2626',
              },
              {
                icon: '⚖️',
                text: 'AI Legal Counsel completed compliance review for 12 new carrier partnerships',
                time: '6 min ago',
                color: '#be185d',
              },
            ].map((activity, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px',
                  marginBottom: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: activity.color,
                    animation: 'pulse 2s infinite',
                    boxShadow: `0 0 20px ${activity.color}60`,
                  }}
                />
                <span style={{ fontSize: '24px' }}>{activity.icon}</span>
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      fontSize: '16px',
                      color: '#ffffff',
                      fontWeight: '600',
                      lineHeight: '1.4',
                    }}
                  >
                    {activity.text}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontWeight: '500',
                  }}
                >
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ADVANCED ANALYTICS SECTION */}
        {selectedView === 'analytics' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '32px',
              marginBottom: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#ffffff',
                marginBottom: '32px',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              📊 Advanced Performance Analytics
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '24px',
              }}
            >
              {/* Revenue Trends */}
              <div
                style={{
                  background: 'rgba(236, 72, 153, 0.15)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  boxShadow: '0 15px 35px -5px rgba(236, 72, 153, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '20px',
                    textAlign: 'center',
                  }}
                >
                  💰 Hourly Revenue Trends
                </h3>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '32px',
                      fontWeight: '900',
                      color: '#ec4899',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {formatCurrency(
                      performanceMetrics.hourlyRevenue[
                        performanceMetrics.hourlyRevenue.length - 1
                      ]
                    )}
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#ec4899',
                      background: 'rgba(236, 72, 153, 0.2)',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontWeight: '700',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                    }}
                  >
                    +18.5% ↗️
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '3px',
                    height: '80px',
                    alignItems: 'end',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                >
                  {performanceMetrics.hourlyRevenue.map((revenue, index) => (
                    <div
                      key={index}
                      style={{
                        flex: 1,
                        background: `linear-gradient(180deg, #ec4899, #be185d)`,
                        height: `${(revenue / Math.max(...performanceMetrics.hourlyRevenue)) * 100}%`,
                        borderRadius: '4px',
                        minHeight: '8px',
                        boxShadow: '0 4px 8px rgba(236, 72, 153, 0.3)',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Task Completion */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  boxShadow: '0 15px 35px -5px rgba(59, 130, 246, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '20px',
                    textAlign: 'center',
                  }}
                >
                  ✅ Daily Task Completion
                </h3>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '32px',
                      fontWeight: '900',
                      color: '#3b82f6',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {
                      performanceMetrics.dailyTasks[
                        performanceMetrics.dailyTasks.length - 1
                      ]
                    }
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#3b82f6',
                      background: 'rgba(59, 130, 246, 0.2)',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontWeight: '700',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    +12.3% ↗️
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '3px',
                    height: '80px',
                    alignItems: 'end',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                >
                  {performanceMetrics.dailyTasks.map((tasks, index) => (
                    <div
                      key={index}
                      style={{
                        flex: 1,
                        background: `linear-gradient(180deg, #3b82f6, #1d4ed8)`,
                        height: `${(tasks / Math.max(...performanceMetrics.dailyTasks)) * 100}%`,
                        borderRadius: '4px',
                        minHeight: '8px',
                        boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TASK MANAGER WITH PREMIUM DESIGN */}
        {showTaskManager && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '32px',
              marginBottom: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#ffffff',
                marginBottom: '32px',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              🎯 AI Task Command Center
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '24px',
              }}
            >
              {/* Critical Tasks */}
              <div
                style={{
                  background: 'rgba(236, 72, 153, 0.15)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '2px solid rgba(236, 72, 153, 0.3)',
                  boxShadow: '0 15px 35px -5px rgba(236, 72, 153, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '20px',
                    textAlign: 'center',
                  }}
                >
                  🚨 Critical Priority Tasks
                </h3>
                {aiTasks
                  .filter((task) => task.priority === 'critical')
                  .map((task) => (
                    <div
                      key={task.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#ffffff',
                            lineHeight: '1.3',
                          }}
                        >
                          {task.title}
                        </span>
                        <span
                          style={{
                            background: getPriorityColor(task.priority),
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            boxShadow: `0 4px 8px ${getPriorityColor(task.priority)}40`,
                          }}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          marginBottom: '8px',
                          fontWeight: '500',
                        }}
                      >
                        Assigned to:{' '}
                        {aiStaff.find((s) => s.id === task.assignedTo)?.name ||
                          'Unknown'}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontWeight: '500',
                        }}
                      >
                        ETA: {task.estimatedCompletion} | Revenue:{' '}
                        {task.actualRevenue
                          ? formatCurrency(task.actualRevenue)
                          : 'TBD'}
                      </div>
                    </div>
                  ))}
              </div>

              {/* High Priority Tasks */}
              <div
                style={{
                  background: 'rgba(168, 85, 247, 0.15)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '2px solid rgba(168, 85, 247, 0.3)',
                  boxShadow: '0 15px 35px -5px rgba(168, 85, 247, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '20px',
                    textAlign: 'center',
                  }}
                >
                  ⚡ High Priority Tasks
                </h3>
                {aiTasks
                  .filter((task) => task.priority === 'high')
                  .map((task) => (
                    <div
                      key={task.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#ffffff',
                            lineHeight: '1.3',
                          }}
                        >
                          {task.title}
                        </span>
                        <span
                          style={{
                            background: getPriorityColor(task.priority),
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            boxShadow: `0 4px 8px ${getPriorityColor(task.priority)}40`,
                          }}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          marginBottom: '8px',
                          fontWeight: '500',
                        }}
                      >
                        Assigned to:{' '}
                        {aiStaff.find((s) => s.id === task.assignedTo)?.name ||
                          'Unknown'}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontWeight: '500',
                        }}
                      >
                        ETA: {task.estimatedCompletion} | Revenue:{' '}
                        {task.actualRevenue
                          ? formatCurrency(task.actualRevenue)
                          : 'TBD'}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* REPORTS SECTION */}
        {showReports && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '32px',
              marginBottom: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#ffffff',
                marginBottom: '32px',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              📈 Executive AI Reports
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '24px',
              }}
            >
              {/* Financial Performance */}
              <div
                style={{
                  background: 'rgba(236, 72, 153, 0.15)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ec4899',
                    marginBottom: '20px',
                    textAlign: 'center',
                  }}
                >
                  💰 Financial Performance
                </h3>
                <div style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '16px',
                        color: '#ffffff',
                        fontWeight: '600',
                      }}
                    >
                      Total Daily Revenue:
                    </span>
                    <span
                      style={{
                        fontSize: '16px',
                        fontWeight: '800',
                        color: '#ec4899',
                      }}
                    >
                      {formatCurrency(totalCompanyRevenue)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '16px',
                        color: '#ffffff',
                        fontWeight: '600',
                      }}
                    >
                      Average Efficiency:
                    </span>
                    <span
                      style={{
                        fontSize: '16px',
                        fontWeight: '800',
                        color: '#ec4899',
                      }}
                    >
                      {averageEfficiency.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #ec4899, #be185d)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    width: '100%',
                    boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  📊 Export Financial Report
                </button>
              </div>

              {/* Department Rankings */}
              <div
                style={{
                  background: 'rgba(168, 85, 247, 0.15)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#a855f7',
                    marginBottom: '20px',
                    textAlign: 'center',
                  }}
                >
                  🏆 Top Performing Departments
                </h3>
                {departments
                  .sort((a, b) => b.efficiency - a.efficiency)
                  .slice(0, 5)
                  .map((dept, index) => (
                    <div
                      key={dept.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        marginBottom: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>
                          {index === 0
                            ? '🥇'
                            : index === 1
                              ? '🥈'
                              : index === 2
                                ? '🥉'
                                : '🏅'}
                        </span>
                        <div>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: '700',
                              color: '#ffffff',
                            }}
                          >
                            {dept.name}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontWeight: '500',
                            }}
                          >
                            {dept.activeStaff} AI staff active
                          </div>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '18px',
                          fontWeight: '800',
                          color: dept.color,
                          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        {dept.efficiency.toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* DETAILED STAFF MODAL */}
        {showStaffDetails && selectedStaffMember && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(30px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '40px',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowStaffDetails(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(236, 72, 153, 0.2)',
                  border: '2px solid rgba(236, 72, 153, 0.4)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#ffffff',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(236, 72, 153, 0.4)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(236, 72, 153, 0.2)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                ✕
              </button>

              {/* Staff Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  marginBottom: '32px',
                  padding: '24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${getStatusColor(selectedStaffMember.status)}, ${getStatusColor(selectedStaffMember.status)}dd)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    boxShadow: `0 15px 30px -5px ${getStatusColor(selectedStaffMember.status)}40`,
                  }}
                >
                  {selectedStaffMember.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      fontSize: '32px',
                      fontWeight: '800',
                      color: '#ffffff',
                      margin: 0,
                      marginBottom: '8px',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {selectedStaffMember.name}
                  </h2>
                  <p
                    style={{
                      fontSize: '18px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: 0,
                      marginBottom: '12px',
                      fontWeight: '600',
                    }}
                  >
                    {selectedStaffMember.role}
                  </p>
                  <div
                    style={{
                      background: `${getStatusColor(selectedStaffMember.status)}20`,
                      color: getStatusColor(selectedStaffMember.status),
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      border: `2px solid ${getStatusColor(selectedStaffMember.status)}40`,
                      display: 'inline-block',
                    }}
                  >
                    {selectedStaffMember.status}
                  </div>
                </div>
              </div>

              {/* Performance Metrics Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '32px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(236, 72, 153, 0.15)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    border: '1px solid rgba(236, 72, 153, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: '800',
                      color: '#ec4899',
                      marginBottom: '8px',
                    }}
                  >
                    {selectedStaffMember.tasksCompleted}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: '600',
                    }}
                  >
                    Tasks Completed
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: '800',
                      color: '#f59e0b',
                      marginBottom: '8px',
                    }}
                  >
                    {formatCurrency(selectedStaffMember.revenue)}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: '600',
                    }}
                  >
                    Revenue Generated
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(168, 85, 247, 0.15)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: '800',
                      color: '#a855f7',
                      marginBottom: '8px',
                    }}
                  >
                    {selectedStaffMember.efficiency}%
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: '600',
                    }}
                  >
                    Efficiency Rate
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.15)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: '800',
                      color: '#3b82f6',
                      marginBottom: '8px',
                    }}
                  >
                    24/7
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: '600',
                    }}
                  >
                    Availability
                  </div>
                </div>
              </div>

              {/* Current Task Details */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '16px',
                  }}
                >
                  🎯 Current Task
                </h3>
                <p
                  style={{
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.5',
                    margin: 0,
                    marginBottom: '12px',
                    fontWeight: '500',
                  }}
                >
                  {selectedStaffMember.currentTask}
                </p>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontWeight: '500',
                  }}
                >
                  Last activity: {selectedStaffMember.lastActivity}
                </div>
              </div>

              {/* Recent Task History */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '16px',
                  }}
                >
                  📋 Recent Task History
                </h3>
                {[
                  {
                    task: '🎯 DEPOINTE SECURED: $45K Amazon contract → FREIGHT 1ST DIRECT dispatch ($4,500 fee) → Carrier #MC-789456 → FleetFlow BOL/tracking → $5,500 net profit',
                    time: '15 min ago',
                    status: 'completed',
                    revenue: 45000,
                    workflow:
                      'Contract → Carrier → Documents → Tracking → Notification',
                  },
                  {
                    task: '📋 FLEETFLOW RFx: Walmart $32K RFQ → AI analyzed proposal → FreightFlow RFx submission → Contract won → FREIGHT 1ST DIRECT dispatch coordination',
                    time: '1 hour ago',
                    status: 'completed',
                    revenue: 32000,
                    workflow:
                      'Negotiation → Verification → Planning → Assignment → Communication',
                  },
                  {
                    task: '⚡ FULL AUTOMATION: Tesla $28K shipment → DOT compliance checked → Documents signed → GPS tracking live → Invoice queued',
                    time: '2 hours ago',
                    status: 'completed',
                    revenue: 28000,
                    workflow: 'Compliance → Documentation → Tracking → Billing',
                  },
                  {
                    task: '🔄 END-TO-END: Home Depot $19K delivery → Rate locked → Carrier matched → Load board updated → Customer notified → Revenue booked',
                    time: '3 hours ago',
                    status: 'completed',
                    revenue: 19000,
                    workflow: 'Rate → Match → Update → Notify → Book',
                  },
                ].map((task, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      marginBottom: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#10b981',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '14px',
                          color: '#ffffff',
                          fontWeight: '600',
                          marginBottom: '4px',
                        }}
                      >
                        {task.task}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontWeight: '500',
                          marginBottom: '4px',
                        }}
                      >
                        {task.time}
                      </div>
                      {task.revenue && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#10b981',
                            fontWeight: '700',
                            marginBottom: '4px',
                          }}
                        >
                          💰 Revenue: {formatCurrency(task.revenue)}
                        </div>
                      )}
                      {task.workflow && (
                        <div
                          style={{
                            fontSize: '10px',
                            color: 'rgba(236, 72, 153, 0.8)',
                            fontWeight: '600',
                            background: 'rgba(236, 72, 153, 0.1)',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            border: '1px solid rgba(236, 72, 153, 0.2)',
                          }}
                        >
                          🔄 {task.workflow}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        background: '#10b981',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                      }}
                    >
                      ✓ {task.status}
                    </div>
                  </div>
                ))}
              </div>

              {/* Performance Charts */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px',
                  marginBottom: '24px',
                }}
              >
                {/* Daily Performance */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    📊 Daily Performance
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      gap: '4px',
                      height: '60px',
                      alignItems: 'end',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '8px',
                    }}
                  >
                    {[85, 92, 88, 95, 91, 97, 94].map((performance, index) => (
                      <div
                        key={index}
                        style={{
                          flex: 1,
                          background: `linear-gradient(180deg, #ec4899, #be185d)`,
                          height: `${performance}%`,
                          borderRadius: '2px',
                          minHeight: '4px',
                          boxShadow: '0 2px 4px rgba(236, 72, 153, 0.3)',
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      marginTop: '12px',
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: '600',
                    }}
                  >
                    Last 7 days
                  </div>
                </div>

                {/* Revenue Trends */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    💰 Revenue Trends
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      gap: '4px',
                      height: '60px',
                      alignItems: 'end',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '8px',
                    }}
                  >
                    {[1200, 1450, 1380, 1650, 1520, 1800, 1750].map(
                      (revenue, index) => (
                        <div
                          key={index}
                          style={{
                            flex: 1,
                            background: `linear-gradient(180deg, #f59e0b, #d97706)`,
                            height: `${(revenue / 1800) * 100}%`,
                            borderRadius: '2px',
                            minHeight: '4px',
                            boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)',
                          }}
                        />
                      )
                    )}
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      marginTop: '12px',
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: '600',
                    }}
                  >
                    Daily revenue ($)
                  </div>
                </div>
              </div>

              {/* POST-CONTRACT AUTOMATION WORKFLOW */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '16px',
                  }}
                >
                  🚀 Post-Contract Automation Workflow
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '20px',
                    lineHeight: '1.5',
                  }}
                >
                  When {selectedStaffMember.name} secures a contract, here's the
                  complete automated workflow that happens instantly:
                </p>

                <div
                  style={{
                    display: 'grid',
                    gap: '12px',
                  }}
                >
                  {[
                    {
                      step: '1',
                      title: 'Contract Secured & Validated',
                      description:
                        'AI broker locks in rate, validates customer credit, confirms load details',
                      systems: ['CRM', 'Financial Markets', 'Customer Portal'],
                      time: '< 30 seconds',
                    },
                    {
                      step: '2',
                      title: 'Carrier Auto-Assignment',
                      description:
                        'AI dispatcher finds optimal carrier using FMCSA database, insurance verification, route optimization',
                      systems: [
                        'FMCSA API',
                        'Route Optimization',
                        'Carrier Network',
                      ],
                      time: '1-2 minutes',
                    },
                    {
                      step: '3',
                      title: 'Document Generation',
                      description:
                        'BOL, carrier agreements, insurance certificates auto-generated and sent for e-signature',
                      systems: ['BOL Workflow', 'DocuSign', 'Insurance Portal'],
                      time: '2-3 minutes',
                    },
                    {
                      step: '4',
                      title: 'Live Tracking Activation',
                      description:
                        'GPS tracking enabled, customer notifications set up, ETA calculations begin',
                      systems: [
                        'Live Load Tracking',
                        'SMS Notifications',
                        'Customer Portal',
                      ],
                      time: '< 1 minute',
                    },
                    {
                      step: '5',
                      title: 'Approval Required',
                      description:
                        'Email notification sent to ddavis@freight1stdirect.com & invoice@freight1stdirect.com for completion approval',
                      systems: [
                        'Email Notifications',
                        'Approval Workflow',
                        'Admin Dashboard',
                      ],
                      time: 'Pending approval',
                    },
                    {
                      step: '6',
                      title: 'Financial Processing (After Approval)',
                      description:
                        'Invoice generated, factoring setup, payment terms activated, revenue booked',
                      systems: [
                        'Square Invoicing',
                        'Factoring Partners',
                        'Financial Dashboard',
                      ],
                      time: '1-2 minutes',
                    },
                    {
                      step: '7',
                      title: 'Compliance & Monitoring',
                      description:
                        'DOT compliance verified, safety monitoring active, performance tracking enabled',
                      systems: [
                        'DOT Compliance',
                        'Safety Dashboard',
                        'Analytics',
                      ],
                      time: 'Ongoing',
                    },
                  ].map((workflow, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '16px',
                        }}
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background:
                              'linear-gradient(135deg, #ec4899, #be185d)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: '800',
                            color: 'white',
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4)',
                          }}
                        >
                          {workflow.step}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: '700',
                              color: '#ffffff',
                              marginBottom: '8px',
                            }}
                          >
                            {workflow.title}
                          </div>
                          <div
                            style={{
                              fontSize: '14px',
                              color: 'rgba(255, 255, 255, 0.8)',
                              marginBottom: '12px',
                              lineHeight: '1.4',
                            }}
                          >
                            {workflow.description}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '6px',
                              marginBottom: '8px',
                            }}
                          >
                            {workflow.systems.map((system, sysIndex) => (
                              <span
                                key={sysIndex}
                                style={{
                                  background: 'rgba(59, 130, 246, 0.2)',
                                  color: '#3b82f6',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '10px',
                                  fontWeight: '600',
                                  border: '1px solid rgba(59, 130, 246, 0.3)',
                                }}
                              >
                                {system}
                              </span>
                            ))}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'rgba(245, 158, 11, 0.9)',
                              fontWeight: '600',
                            }}
                          >
                            ⏱️ Completion Time: {workflow.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: '20px',
                    padding: '16px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#10b981',
                      marginBottom: '8px',
                    }}
                  >
                    ✅ Total Automation Time: 5-10 minutes from contract to full
                    operation
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: '1.4',
                    }}
                  >
                    Your AI staff handles everything automatically - from
                    contract validation to live tracking - while you focus on
                    growing your business. No manual intervention required.
                  </div>
                </div>
              </div>

              {/* LIVE OPERATIONS MONITOR */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '16px',
                  }}
                >
                  📡 Live Operations Monitor
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '20px',
                    lineHeight: '1.5',
                  }}
                >
                  Real-time view of what happens when {selectedStaffMember.name}{' '}
                  secures contracts:
                </p>

                {/* Live Activity Feed */}
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#ec4899',
                      marginBottom: '12px',
                      textAlign: 'center',
                    }}
                  >
                    🔴 LIVE ACTIVITY FEED
                  </div>
                  {[
                    {
                      time: '14:23:45',
                      action:
                        '🎯 Contract secured with FedEx - $67K intermodal shipment',
                      status: 'success',
                    },
                    {
                      time: '14:23:47',
                      action:
                        '🔍 FMCSA verification complete - Carrier MC-456789 validated',
                      status: 'success',
                    },
                    {
                      time: '14:23:52',
                      action: '📋 BOL generated - Document ID: BOL-2024-001847',
                      status: 'success',
                    },
                    {
                      time: '14:24:15',
                      action:
                        '🚛 Carrier assigned - Driver John Martinez dispatched',
                      status: 'success',
                    },
                    {
                      time: '14:24:32',
                      action:
                        '📍 GPS tracking activated - Real-time location monitoring live',
                      status: 'success',
                    },
                    {
                      time: '14:24:45',
                      action:
                        '📧 Approval required - Email sent to ddavis@freight1stdirect.com & invoice@freight1stdirect.com',
                      status: 'pending',
                    },
                    {
                      time: '14:24:58',
                      action:
                        '📧 Customer notification sent - ETA: Tomorrow 2:30 PM',
                      status: 'success',
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 12px',
                        marginBottom: '6px',
                        background:
                          activity.status === 'success'
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '8px',
                        border:
                          activity.status === 'success'
                            ? '1px solid rgba(16, 185, 129, 0.2)'
                            : '1px solid rgba(245, 158, 11, 0.2)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontWeight: '600',
                          minWidth: '60px',
                        }}
                      >
                        {activity.time}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#ffffff',
                          fontWeight: '500',
                          flex: 1,
                        }}
                      >
                        {activity.action}
                      </span>
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background:
                            activity.status === 'success'
                              ? '#10b981'
                              : '#f59e0b',
                          animation:
                            activity.status === 'processing'
                              ? 'pulse 2s infinite'
                              : 'none',
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* System Integration Status */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {[
                    {
                      system: 'FMCSA API',
                      status: 'Connected',
                      requests: '1,247/hour',
                      color: '#10b981',
                    },
                    {
                      system: 'Live Tracking',
                      status: 'Active',
                      requests: '847 loads',
                      color: '#3b82f6',
                    },
                    {
                      system: 'Square Invoicing',
                      status: 'Pending Approval',
                      requests: '23 invoices',
                      color: '#f59e0b',
                    },
                    {
                      system: 'Customer Portal',
                      status: 'Updated',
                      requests: '156 notifications',
                      color: '#ec4899',
                    },
                  ].map((integration, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '12px',
                        textAlign: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: '700',
                          color: integration.color,
                          marginBottom: '4px',
                        }}
                      >
                        {integration.system}
                      </div>
                      <div
                        style={{
                          fontSize: '10px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          marginBottom: '4px',
                        }}
                      >
                        {integration.status}
                      </div>
                      <div
                        style={{
                          fontSize: '10px',
                          color: 'rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        {integration.requests}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Capabilities */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '16px',
                  }}
                >
                  🧠 AI Capabilities & Skills
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {[
                    { skill: 'Freight Negotiation', level: 98 },
                    { skill: 'Route Optimization', level: 95 },
                    { skill: 'Customer Relations', level: 92 },
                    { skill: 'Compliance Management', level: 97 },
                    { skill: 'Risk Assessment', level: 94 },
                    { skill: 'Market Analysis', level: 96 },
                  ].map((capability, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '16px',
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
                        <span
                          style={{
                            fontSize: '14px',
                            color: '#ffffff',
                            fontWeight: '600',
                          }}
                        >
                          {capability.skill}
                        </span>
                        <span
                          style={{
                            fontSize: '14px',
                            color: '#ec4899',
                            fontWeight: '700',
                          }}
                        >
                          {capability.level}%
                        </span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '6px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${capability.level}%`,
                            height: '100%',
                            background:
                              'linear-gradient(90deg, #ec4899, #be185d)',
                            borderRadius: '3px',
                            transition: 'width 0.5s ease',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* REVENUE IMPACT TRACKER */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '16px',
                  }}
                >
                  💰 Revenue Impact Tracker
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '20px',
                    lineHeight: '1.5',
                  }}
                >
                  Financial impact when {selectedStaffMember.name} secures
                  contracts:
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                  }}
                >
                  {/* Today's Contract Revenue */}
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#10b981',
                        marginBottom: '12px',
                      }}
                    >
                      📈 Today's Secured Contracts
                    </div>
                    {[
                      {
                        client: 'FedEx',
                        amount: 67000,
                        margin: 18,
                        time: '2:23 PM',
                      },
                      {
                        client: 'UPS',
                        amount: 52000,
                        margin: 22,
                        time: '1:45 PM',
                      },
                      {
                        client: 'DHL',
                        amount: 38000,
                        margin: 15,
                        time: '11:30 AM',
                      },
                      {
                        client: 'Amazon',
                        amount: 45000,
                        margin: 20,
                        time: '9:15 AM',
                      },
                    ].map((contract, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 0',
                          borderBottom:
                            index < 3
                              ? '1px solid rgba(255, 255, 255, 0.1)'
                              : 'none',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: '14px',
                              color: '#ffffff',
                              fontWeight: '600',
                            }}
                          >
                            {contract.client}
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'rgba(255, 255, 255, 0.6)',
                            }}
                          >
                            {contract.time}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div
                            style={{
                              fontSize: '14px',
                              color: '#10b981',
                              fontWeight: '700',
                            }}
                          >
                            {formatCurrency(contract.amount)}
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'rgba(255, 255, 255, 0.6)',
                            }}
                          >
                            {contract.margin}% margin
                          </div>
                        </div>
                      </div>
                    ))}
                    <div
                      style={{
                        marginTop: '16px',
                        padding: '12px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        borderRadius: '8px',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '800',
                          color: '#ffffff',
                        }}
                      >
                        Total: {formatCurrency(202000)}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        4 contracts secured today
                      </div>
                    </div>
                  </div>

                  {/* Automated Workflow Status */}
                  <div
                    style={{
                      background: 'rgba(236, 72, 153, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#ec4899',
                        marginBottom: '12px',
                      }}
                    >
                      ⚡ Automated Workflow Status
                    </div>
                    {[
                      {
                        process: 'Carrier Assignment',
                        completed: 47,
                        pending: 3,
                        success: 94,
                      },
                      {
                        process: 'Document Generation',
                        completed: 45,
                        pending: 5,
                        success: 90,
                      },
                      {
                        process: 'Tracking Activation',
                        completed: 48,
                        pending: 2,
                        success: 96,
                      },
                      {
                        process: 'Customer Notifications',
                        completed: 49,
                        pending: 1,
                        success: 98,
                      },
                      {
                        process: 'Invoice Processing',
                        completed: 42,
                        pending: 8,
                        success: 84,
                      },
                    ].map((workflow, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 0',
                          borderBottom:
                            index < 4
                              ? '1px solid rgba(255, 255, 255, 0.1)'
                              : 'none',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#ffffff',
                            fontWeight: '600',
                          }}
                        >
                          {workflow.process}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '11px',
                              color: '#10b981',
                              fontWeight: '700',
                            }}
                          >
                            ✓{workflow.completed}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              color: '#f59e0b',
                              fontWeight: '700',
                            }}
                          >
                            ⏳{workflow.pending}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              color: '#ec4899',
                              fontWeight: '700',
                            }}
                          >
                            {workflow.success}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '16px',
                }}
              >
                <button
                  onClick={() => setShowTaskAssignment(true)}
                  style={{
                    background: 'linear-gradient(135deg, #ec4899, #be185d)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px -5px rgba(236, 72, 153, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 25px -5px rgba(236, 72, 153, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 20px -5px rgba(236, 72, 153, 0.4)';
                  }}
                >
                  🎯 Assign Task
                </button>
                <button
                  onClick={() => setShowStaffReports(true)}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px -5px rgba(16, 185, 129, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 25px -5px rgba(16, 185, 129, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 20px -5px rgba(16, 185, 129, 0.4)';
                  }}
                >
                  📊 View Reports
                </button>
                <button
                  onClick={() => setShowStaffConfig(true)}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px -5px rgba(245, 158, 11, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 25px -5px rgba(245, 158, 11, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 20px -5px rgba(245, 158, 11, 0.4)';
                  }}
                >
                  ⚙️ Configure
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TASK ASSIGNMENT MODAL */}
        {showTaskAssignment && selectedStaffMember && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 1001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(30px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '40px',
                maxWidth: '600px',
                width: '100%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowTaskAssignment(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(236, 72, 153, 0.2)',
                  border: '2px solid rgba(236, 72, 153, 0.4)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#ffffff',
                  transition: 'all 0.3s ease',
                }}
              >
                ✕
              </button>

              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: '#ffffff',
                  marginBottom: '8px',
                  textAlign: 'center',
                }}
              >
                🎯 Assign New Task
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textAlign: 'center',
                  marginBottom: '32px',
                }}
              >
                Assign a specific task to {selectedStaffMember.name}
              </p>

              {/* Task Form */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}
                >
                  Task Title
                </label>
                <input
                  type='text'
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder='Enter task title...'
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}
                >
                  Task Description
                </label>
                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder='Describe the task in detail...'
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '100px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '8px',
                  }}
                >
                  Priority Level
                </label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '500',
                    outline: 'none',
                  }}
                >
                  <option
                    value='low'
                    style={{ background: '#1f2937', color: '#ffffff' }}
                  >
                    🟢 Low Priority
                  </option>
                  <option
                    value='medium'
                    style={{ background: '#1f2937', color: '#ffffff' }}
                  >
                    🟡 Medium Priority
                  </option>
                  <option
                    value='high'
                    style={{ background: '#1f2937', color: '#ffffff' }}
                  >
                    🟠 High Priority
                  </option>
                  <option
                    value='critical'
                    style={{ background: '#1f2937', color: '#ffffff' }}
                  >
                    🔴 Critical Priority
                  </option>
                </select>
              </div>

              {/* Task Examples */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h4
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '12px',
                  }}
                >
                  💡 Task Examples for {selectedStaffMember.role}:
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gap: '8px',
                  }}
                >
                  {selectedStaffMember.department === 'sales'
                    ? [
                        'FreightFlow RFx: Follow up on Amazon $85K RFP - pending final approval',
                        'FreightFlow RFx: Submit bids for 8 government freight opportunities ($250K total potential)',
                        'FreightFlow RFx: Prepare Walmart distribution RFQ response - multi-state network expansion',
                        'FreightFlow RFx: Analyze pharmaceutical RFP requirements for cold-chain bidding',
                        'Research and contact 15 new shippers identified through RFx market intelligence',
                        'Train AI models on successful RFx bidding strategies and win patterns',
                        'Schedule automated RFx opportunity alerts for 47 qualified prospects',
                        'Review RFx bid analytics for top-performing response strategies',
                      ]
                    : selectedStaffMember.department === 'logistics'
                      ? [
                          'Go With Flow load assignment: Coordinate 23 active loads with optimal carrier matching',
                          'Schedule Management: Monitor driver HOS compliance and availability for all carriers',
                          'Live Tracking: Manage real-time GPS monitoring and customer notifications',
                          'Route optimization: Coordinate fuel-efficient routing for carrier profitability',
                          'System Orchestrator: Automate dispatch workflows and carrier communications',
                          'Invoice Generation: Process weekly 10% dispatch fees for 34 active carriers',
                        ]
                      : selectedStaffMember.department === 'marketing'
                        ? selectedStaffMember.id === 'marketing-008'
                          ? [
                              'Support freight brokerage: Create shipper acquisition marketing campaigns',
                              'Generate carrier recruitment content for social media and email campaigns',
                              'Develop load board optimization strategies and posting best practices',
                              'Analyze freight market trends for shipper/carrier targeting opportunities',
                              'Create freight brokerage success stories and case studies',
                              'Monitor freight industry market intelligence and carrier/shipper activity trends',
                              'Prepare freight transaction ROI models for shipper/carrier presentations',
                              'Research shipper pain points and FleetFlow freight solutions alignment',
                              'Develop freight brokerage marketing campaigns targeting logistics managers',
                              'Create freight industry executive briefing materials for shipper acquisition',
                              'Monitor freight market conditions and load board optimization opportunities',
                              'Strategic awareness: Track transportation industry trends (5% of daily focus)',
                            ]
                          : selectedStaffMember.id === 'marketing-007'
                            ? [
                                'LinkedIn shipper prospecting - target manufacturing, retail, distribution companies',
                                'LinkedIn carrier recruitment - connect with owner-operators and fleet managers',
                                'Optimize LinkedIn targeting (Logistics VPs, Transportation Directors, Fleet Managers)',
                                'Generate qualified shipper leads for freight brokerage sales team',
                                'Follow up with carriers interested in freight opportunities and load matching',
                                'A/B test LinkedIn ads for carrier recruitment and shipper acquisition',
                                'Create LinkedIn lead qualification workflows for freight prospects',
                                'Monitor carrier recruitment metrics and shipper acquisition pipeline',
                                'Track freight industry LinkedIn engagement and load board performance',
                                'Build freight brokerage network for shippers, carriers, and load opportunities',
                              ]
                            : [
                                'Target shippers needing freight services - Fortune 500 logistics managers',
                                'Create carrier success stories and freight opportunity testimonials',
                                'Develop freight brokerage content calendar for shipper/carrier education',
                                'A/B test email campaigns for shipper acquisition and carrier recruitment',
                                'Design freight brokerage ROI infographics for shipper decision makers',
                                'Optimize Google Ads for "freight broker services" and "load matching"',
                                'Schedule social media posts highlighting successful freight transactions',
                                'Analyze freight brokerage competitor strategies and market positioning',
                                'Monitor freight industry trends and load board optimization opportunities',
                                'Track carrier recruitment effectiveness and shipper acquisition pipeline',
                              ]
                        : selectedStaffMember.department === 'legal'
                          ? [
                              'Review carrier agreement templates for compliance updates',
                              'Draft contract amendments for Fortune 500 partnerships',
                              'Analyze new DOT regulations impact on operations',
                            ]
                          : selectedStaffMember.department ===
                              'customer_service'
                            ? [
                                '🎯 Superior to SalesAI.com - Process 15 new support tickets with AI automation',
                                'Resolve billing dispute for Metro Manufacturing ($230 discrepancy)',
                                'Update knowledge base articles - improve self-service success rate to 90%+',
                                'Manage 12 active chatbot interactions with 4.7/5.0 satisfaction target',
                                'Coordinate emergency response for I-95 breakdown incident',
                                'Analyze customer satisfaction patterns to optimize AI responses',
                                'Train new AI support models on successful ticket resolution patterns',
                                'Monitor 24/7 support coverage - ensure sub-2 minute response times',
                                'Generate customer support analytics for management review',
                                'Escalate complex technical issues to appropriate specialists',
                                'Follow up on resolved tickets for satisfaction feedback',
                                'Optimize ticket routing algorithms for faster resolution',
                              ]
                            : [
                                'Complete quarterly performance analysis',
                                'Process pending customer onboarding requests',
                                'Update system configurations for peak season',
                              ].map((example, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setNewTaskTitle(example);
                                    setNewTaskDescription(
                                      `Complete this task: ${example}`
                                    );
                                  }}
                                  style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border:
                                      '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: '14px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background =
                                      'rgba(236, 72, 153, 0.1)';
                                    e.currentTarget.style.borderColor =
                                      'rgba(236, 72, 153, 0.3)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background =
                                      'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.borderColor =
                                      'rgba(255, 255, 255, 0.1)';
                                  }}
                                >
                                  {example}
                                </button>
                              ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                }}
              >
                <button
                  onClick={() => {
                    // Simulate task assignment
                    alert(
                      `Task "${newTaskTitle}" assigned to ${selectedStaffMember.name}!`
                    );
                    setNewTaskTitle('');
                    setNewTaskDescription('');
                    setNewTaskPriority('medium');
                    setShowTaskAssignment(false);
                  }}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #ec4899, #be185d)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px -5px rgba(236, 72, 153, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  ✅ Assign Task
                </button>
                <button
                  onClick={() => setShowTaskAssignment(false)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STAFF CONFIGURATION MODAL */}
        {showStaffConfig && selectedStaffMember && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 1001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(30px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '40px',
                maxWidth: '700px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowStaffConfig(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '2px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#ffffff',
                  transition: 'all 0.3s ease',
                }}
              >
                ✕
              </button>

              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: '#ffffff',
                  marginBottom: '8px',
                  textAlign: 'center',
                }}
              >
                ⚙️ Configure AI Staff
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textAlign: 'center',
                  marginBottom: '32px',
                }}
              >
                Adjust {selectedStaffMember.name}'s AI parameters and
                capabilities
              </p>

              {/* Configuration Sections */}
              <div
                style={{
                  display: 'grid',
                  gap: '24px',
                }}
              >
                {/* Performance Settings */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '16px',
                    }}
                  >
                    🎯 Performance Settings
                  </h3>

                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '8px',
                      }}
                    >
                      Automation Level: 95%
                    </label>
                    <input
                      type='range'
                      min='0'
                      max='100'
                      defaultValue='95'
                      style={{
                        width: '100%',
                        height: '6px',
                        borderRadius: '3px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '8px',
                      }}
                    >
                      Decision Authority: Executive Level
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '14px',
                      }}
                    >
                      <option value='basic' style={{ background: '#1f2937' }}>
                        Basic (Up to $1K decisions)
                      </option>
                      <option
                        value='intermediate'
                        style={{ background: '#1f2937' }}
                      >
                        Intermediate (Up to $10K decisions)
                      </option>
                      <option
                        value='advanced'
                        style={{ background: '#1f2937' }}
                      >
                        Advanced (Up to $50K decisions)
                      </option>
                      <option
                        value='executive'
                        style={{ background: '#1f2937' }}
                        selected
                      >
                        Executive (Unlimited decisions)
                      </option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '8px',
                      }}
                    >
                      Risk Tolerance: Conservative
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '14px',
                      }}
                    >
                      <option
                        value='conservative'
                        style={{ background: '#1f2937' }}
                        selected
                      >
                        Conservative (Low risk, stable returns)
                      </option>
                      <option
                        value='moderate'
                        style={{ background: '#1f2937' }}
                      >
                        Moderate (Balanced risk/reward)
                      </option>
                      <option
                        value='aggressive'
                        style={{ background: '#1f2937' }}
                      >
                        Aggressive (High risk, high reward)
                      </option>
                    </select>
                  </div>
                </div>

                {/* AI Behavior Settings */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '16px',
                    }}
                  >
                    🧠 AI Behavior Settings
                  </h3>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    {[
                      { label: 'Communication Style', value: 'Professional' },
                      { label: 'Response Speed', value: 'Immediate' },
                      { label: 'Learning Mode', value: 'Active' },
                      { label: 'Collaboration Level', value: 'High' },
                    ].map((setting, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          padding: '16px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginBottom: '4px',
                            fontWeight: '600',
                          }}
                        >
                          {setting.label}
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: '#ffffff',
                            fontWeight: '700',
                          }}
                        >
                          {setting.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Integration Settings */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '16px',
                    }}
                  >
                    🔗 FleetFlow Integration Access
                  </h3>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                    }}
                  >
                    {[
                      { system: 'Load Board', enabled: true },
                      { system: 'FMCSA Database', enabled: true },
                      { system: 'Financial Markets', enabled: true },
                      { system: 'Customer Portal', enabled: true },
                      { system: 'Government Contracts', enabled: true },
                      { system: 'Compliance Center', enabled: true },
                    ].map((integration, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '14px',
                            color: '#ffffff',
                            fontWeight: '600',
                          }}
                        >
                          {integration.system}
                        </span>
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: integration.enabled
                              ? '#10b981'
                              : '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            color: 'white',
                            fontWeight: '700',
                          }}
                        >
                          {integration.enabled ? '✓' : '✕'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  marginTop: '24px',
                }}
              >
                <button
                  onClick={() => {
                    alert(
                      `Configuration saved for ${selectedStaffMember.name}!`
                    );
                    setShowStaffConfig(false);
                  }}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px -5px rgba(245, 158, 11, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  💾 Save Configuration
                </button>
                <button
                  onClick={() => setShowStaffConfig(false)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI SUPPORT DASHBOARD - SUPERIOR TO SALESAI.COM */}
        {selectedStaffMember &&
          selectedStaffMember.department === 'customer_service' && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(15px)',
                zIndex: 1002,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(30px)',
                  borderRadius: '24px',
                  border: '2px solid rgba(34, 197, 94, 0.3)',
                  width: '95vw',
                  height: '95vh',
                  overflowY: 'auto',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
                  position: 'relative',
                }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedStaff(null)}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '2px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '20px',
                    color: '#ef4444',
                    zIndex: 10,
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background =
                      'rgba(239, 68, 68, 0.3)')
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background =
                      'rgba(239, 68, 68, 0.2)')
                  }
                >
                  ×
                </button>

                {/* Staff Header Info */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    padding: '30px 40px',
                    borderRadius: '20px 20px 0 0',
                    marginBottom: '0',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '15px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '48px',
                      }}
                    >
                      {selectedStaffMember.avatar}
                    </div>
                    <div>
                      <h2
                        style={{
                          fontSize: '28px',
                          fontWeight: 'bold',
                          margin: '0 0 8px 0',
                        }}
                      >
                        {selectedStaffMember.name}
                      </h2>
                      <p
                        style={{
                          fontSize: '16px',
                          margin: '0 0 5px 0',
                          opacity: 0.9,
                        }}
                      >
                        {selectedStaffMember.role}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '15px',
                          fontSize: '14px',
                          opacity: 0.8,
                        }}
                      >
                        <span>🎯 Superior to SalesAI.com</span>
                        <span>📞 24/7 AI Support</span>
                        <span>⚡ Real-time Resolution</span>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '30px',
                      fontSize: '14px',
                    }}
                  >
                    <div>
                      <span style={{ opacity: 0.8 }}>Tasks Completed:</span>{' '}
                      <strong>{selectedStaffMember.tasksCompleted}</strong>
                    </div>
                    <div>
                      <span style={{ opacity: 0.8 }}>Revenue Generated:</span>{' '}
                      <strong>
                        ${selectedStaffMember.revenue.toLocaleString()}
                      </strong>
                    </div>
                    <div>
                      <span style={{ opacity: 0.8 }}>Efficiency:</span>{' '}
                      <strong>{selectedStaffMember.efficiency}%</strong>
                    </div>
                    <div>
                      <span style={{ opacity: 0.8 }}>Status:</span>{' '}
                      <strong style={{ textTransform: 'capitalize' }}>
                        {selectedStaffMember.status}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* AI Support Dashboard */}
                <div style={{ background: '#f9fafb' }}>
                  {/* <AISupportDashboard /> */}
                  <div
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: '#6b7280',
                    }}
                  >
                    AI Support Dashboard - Coming Soon
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* STAFF REPORTS MODAL */}
        {showStaffReports && selectedStaffMember && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              zIndex: 1001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(30px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '40px',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowStaffReports(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '2px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#ffffff',
                  transition: 'all 0.3s ease',
                }}
              >
                ✕
              </button>

              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: '#ffffff',
                  marginBottom: '8px',
                  textAlign: 'center',
                }}
              >
                📊 Performance Reports
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textAlign: 'center',
                  marginBottom: '32px',
                }}
              >
                Detailed analytics for {selectedStaffMember.name}
              </p>

              {/* Report Metrics Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '32px',
                }}
              >
                {[
                  {
                    label: 'Total Revenue',
                    value: formatCurrency(selectedStaffMember.revenue * 7),
                    color: '#10b981',
                  },
                  {
                    label: 'Tasks This Week',
                    value: `${selectedStaffMember.tasksCompleted * 7}`,
                    color: '#3b82f6',
                  },
                  {
                    label: 'Success Rate',
                    value: `${selectedStaffMember.efficiency}%`,
                    color: '#ec4899',
                  },
                  {
                    label: 'Avg Response Time',
                    value: '1.2 seconds',
                    color: '#f59e0b',
                  },
                ].map((metric, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      textAlign: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        color: metric.color,
                        marginBottom: '8px',
                      }}
                    >
                      {metric.value}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontWeight: '600',
                      }}
                    >
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Detailed Analytics */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px',
                }}
              >
                {/* Weekly Performance Chart */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    📈 Weekly Performance
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      gap: '6px',
                      height: '80px',
                      alignItems: 'end',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                  >
                    {[92, 88, 95, 91, 97, 94, 89].map((performance, index) => (
                      <div
                        key={index}
                        style={{
                          flex: 1,
                          background: `linear-gradient(180deg, #10b981, #059669)`,
                          height: `${performance}%`,
                          borderRadius: '3px',
                          minHeight: '6px',
                          boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)',
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '8px',
                      fontSize: '10px',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>

                {/* Task Categories */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    📋 Task Breakdown
                  </h4>
                  {[
                    {
                      category: 'Customer Relations',
                      count: 45,
                      color: '#ec4899',
                    },
                    {
                      category: 'Contract Negotiations',
                      count: 32,
                      color: '#f59e0b',
                    },
                    { category: 'Route Planning', count: 28, color: '#3b82f6' },
                    {
                      category: 'Compliance Checks',
                      count: 19,
                      color: '#10b981',
                    },
                  ].map((category, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        marginBottom: '8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '14px',
                          color: '#ffffff',
                          fontWeight: '600',
                        }}
                      >
                        {category.category}
                      </span>
                      <div
                        style={{
                          background: category.color,
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '700',
                        }}
                      >
                        {category.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '32px',
                }}
              >
                <button
                  onClick={() => setShowStaffReports(false)}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px -5px rgba(16, 185, 129, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  📊 Export Full Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        @keyframes glow {
          0% {
            box-shadow: 0 20px 40px -10px rgba(236, 72, 153, 0.5);
          }
          100% {
            box-shadow: 0 25px 50px -10px rgba(219, 39, 119, 0.7);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(1deg);
          }
          66% {
            transform: translateY(-10px) rotate(-1deg);
          }
        }
      `}</style>

      {/* FLEETFLOW INTEGRATION COMMAND CENTER - MOVED TO BOTTOM */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        <h2
          style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '24px',
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          🔗 FleetFlow Integration Command Center
        </h2>

        {/* Modern KPI Dashboard - Horizontal Bar Layout */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            marginBottom: '20px',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Load Boards */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background:
                'linear-gradient(90deg, rgba(16, 185, 129, 0.1), transparent)',
              borderLeft: '3px solid #10b981',
              borderRadius: '8px',
              padding: '8px 12px',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '14px' }}>📋</span>
              <span
                style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: '500',
                }}
              >
                Load Boards
              </span>
            </div>
            <span
              style={{ fontSize: '14px', fontWeight: '700', color: '#10b981' }}
            >
              {fleetFlowIntegration.loadBoardConnections.toLocaleString()}
            </span>
          </div>

          {/* Active Dispatches */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background:
                'linear-gradient(90deg, rgba(245, 158, 11, 0.1), transparent)',
              borderLeft: '3px solid #f59e0b',
              borderRadius: '8px',
              padding: '8px 12px',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '14px' }}>🚛</span>
              <span
                style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: '500',
                }}
              >
                Active Dispatches
              </span>
            </div>
            <span
              style={{ fontSize: '14px', fontWeight: '700', color: '#f59e0b' }}
            >
              {fleetFlowIntegration.activeDispatches.toLocaleString()}
            </span>
          </div>

          {/* Revenue Generated */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background:
                'linear-gradient(90deg, rgba(34, 197, 94, 0.1), transparent)',
              borderLeft: '3px solid #22c55e',
              borderRadius: '8px',
              padding: '8px 12px',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '14px' }}>💰</span>
              <span
                style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: '500',
                }}
              >
                Revenue Generated
              </span>
            </div>
            <span
              style={{ fontSize: '14px', fontWeight: '700', color: '#22c55e' }}
            >
              ${(fleetFlowIntegration.revenueGenerated / 1000).toFixed(0)}K
            </span>
          </div>

          {/* Customer Interactions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background:
                'linear-gradient(90deg, rgba(168, 85, 247, 0.1), transparent)',
              borderLeft: '3px solid #a855f7',
              borderRadius: '8px',
              padding: '8px 12px',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '14px' }}>👥</span>
              <span
                style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: '500',
                }}
              >
                Customer Interactions
              </span>
            </div>
            <span
              style={{ fontSize: '14px', fontWeight: '700', color: '#a855f7' }}
            >
              {fleetFlowIntegration.customerInteractions.toLocaleString()}
            </span>
          </div>

          {/* API Calls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background:
                'linear-gradient(90deg, rgba(236, 72, 153, 0.1), transparent)',
              borderLeft: '3px solid #ec4899',
              borderRadius: '8px',
              padding: '8px 12px',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '14px' }}>🔗</span>
              <span
                style={{
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: '500',
                }}
              >
                API Calls
              </span>
            </div>
            <span
              style={{ fontSize: '14px', fontWeight: '700', color: '#ec4899' }}
            >
              {fleetFlowIntegration.apiCalls.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Status Bar */}
        <div
          style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.8)',
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '12px 16px',
            borderRadius: '8px',
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          ⚡ Live FleetFlow Data Integration - Updates Every 30 Seconds
        </div>
      </div>
    </div>
  );
}
