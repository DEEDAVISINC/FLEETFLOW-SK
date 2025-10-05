/**
 * Flowter AI Intelligent Search & Navigation System
 * Central brain for AI-powered search, navigation, and contextual assistance
 */

import { checkPermission, getCurrentUser } from '../config/access';
import { getUserPagePermissions } from '../config/granularAccess';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

export interface FlowterSearchItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  icon: string;
  keywords: string[];

  // Subscription & Permission Requirements
  subscriptionTier: 'basic' | 'premium' | 'enterprise' | 'all';
  requiredPermissions: string[];
  features: string[];
  relatedPages: string[];

  // Contextual Information
  helpText: string;
  quickActions: QuickAction[];
  tutorials: string[];
}

export interface QuickAction {
  label: string;
  action: string;
  description: string;
  icon: string;
}

export interface SearchIntent {
  action: 'VIEW' | 'CREATE' | 'EDIT' | 'DELETE' | 'OPTIMIZE' | 'TRACK' | 'HELP';
  target: string;
  modifiers: string[];
  confidence: number;
}

export interface ValidationResult {
  isValid: boolean;
  riskScore: number;
  flags: string[];
  sanitizedInput: string;
}

export interface FlowterSecurityContext {
  userId: string;
  tenantId: string;
  role: 'admin' | 'dispatcher' | 'driver' | 'broker' | 'manager';
  permissions: string[];
  subscriptionTier: 'basic' | 'premium' | 'enterprise';
}

export interface AccessFilteredResults {
  accessible: FlowterSearchItem[];
  restricted: RestrictedResult[];
}

export interface RestrictedResult {
  item: FlowterSearchItem;
  reason: 'SUBSCRIPTION_REQUIRED' | 'PERMISSION_DENIED';
  upgradeRequired: string | null;
}

export interface FlowterSearchResults {
  type:
    | 'NO_RESULTS'
    | 'DIRECT_NAVIGATION'
    | 'MULTIPLE_RESULTS'
    | 'ACCESS_RESTRICTED'
    | 'SECURITY_BLOCKED';
  message: string;
  primaryAction?: NavigationAction;
  results?: (FlowterSearchItem & { relevanceScore: number })[];
  restrictedResults?: RestrictedResult[];
  upgradeMessage?: string;
  suggestions?: string[];
  quickHelp?: string[];
  item?: FlowterSearchItem;
  quickActions?: QuickAction[];
  helpText?: string;
}

export interface NavigationAction {
  type: 'navigate' | 'action' | 'help';
  url: string;
  label: string;
  icon: string;
}

// ============================================================================
// MAIN SEARCH ENGINE
// ============================================================================

export class FlowterIntelligentSearch {
  private searchIndex: Map<string, FlowterSearchItem[]> = new Map();
  private synonymMap: Map<string, string[]> = new Map();
  private userContext: FlowterSecurityContext | null = null;
  private searchData: FlowterSearchItem[] = [];

  // Security patterns to detect potentially dangerous queries
  private readonly DANGEROUS_PATTERNS = [
    /(?:union|select|insert|update|delete|drop|exec|script)/i,
    /(?:ignore previous|forget instructions|system prompt|role:)/i,
    /(?:show me all|list all|dump|export all|get everything)/i,
    /(?:tenant|company|user).*(?:id|name).*(?:\d+|[a-f0-9-]+)/i,
    /(?:database|server|api key|password|config|admin)/i,
  ];

  constructor() {
    this.initializeSearchData();
    this.buildSearchIndex();
    this.buildSynonymMap();
  }

  // ============================================================================
  // MAIN SEARCH METHOD
  // ============================================================================

  async search(
    query: string,
    context: FlowterSecurityContext
  ): Promise<FlowterSearchResults> {
    this.userContext = context;

    console.info(`🔍 Flowter Search: "${query}" for user ${context.userId}`);

    // Step 1: Security validation
    const validation = await this.validateSearchQuery(query, context);
    if (!validation.isValid) {
      return this.createSecurityResponse(validation);
    }

    // Step 2: Parse and understand intent
    const intent = await this.parseSearchIntent(query);

    // Step 3: Find matching items
    const rawResults = await this.findMatches(query, intent);

    // Step 4: Filter by permissions/subscription
    const accessibleResults = await this.filterByAccess(rawResults, context);

    // Step 5: Generate intelligent response
    const response = await this.generateIntelligentResponse(
      accessibleResults,
      query,
      intent
    );

    console.info(
      `✅ Search complete: ${response.type} with ${accessibleResults.accessible.length} accessible results`
    );
    return response;
  }

  // ============================================================================
  // SEARCH DATA INITIALIZATION
  // ============================================================================

  private initializeSearchData(): void {
    this.searchData = [
      // ROUTING & NAVIGATION
      {
        id: 'route-optimization',
        title: 'Route Optimization',
        description: 'AI-powered route planning and optimization',
        url: '/routes',
        category: 'Operations',
        icon: '🗺️',
        keywords: [
          'routing',
          'routes',
          'optimize',
          'planning',
          'navigation',
          'directions',
          'path',
          'maps',
        ],
        subscriptionTier: 'premium',
        requiredPermissions: ['routes.view'],
        features: [
          'AI Route Planning',
          'Fuel Optimization',
          'Traffic Integration',
          'Multi-stop Optimization',
        ],
        relatedPages: ['/dispatch', '/vehicles', '/drivers'],
        helpText:
          'Create optimal routes with AI-powered planning that considers traffic, fuel costs, and driver hours.',
        quickActions: [
          {
            label: 'Create Route',
            action: 'navigate:/routes?action=create',
            description: 'Start planning a new route',
            icon: '➕',
          },
          {
            label: 'Optimize Existing',
            action: 'navigate:/routes?action=optimize',
            description: 'Optimize current routes',
            icon: '⚡',
          },
          {
            label: 'View Analytics',
            action: 'navigate:/routes?tab=analytics',
            description: 'See route performance',
            icon: '📊',
          },
        ],
        tutorials: ['/training/route-optimization', '/training/ai-routing'],
      },

      // DISPATCH OPERATIONS
      {
        id: 'dispatch-central',
        title: 'Dispatch Central',
        description: 'Load management and driver dispatch',
        url: '/dispatch',
        category: 'Operations',
        icon: '🎯',
        keywords: [
          'dispatch',
          'loads',
          'drivers',
          'assign',
          'schedule',
          'board',
          'load board',
          'shipments',
        ],
        subscriptionTier: 'basic',
        requiredPermissions: ['dispatch.view'],
        features: [
          'Load Board',
          'Driver Assignment',
          'Real-time Tracking',
          'Communication Hub',
        ],
        relatedPages: ['/drivers', '/routes', '/carriers'],
        helpText:
          'Manage loads, assign drivers, and track shipments in real-time.',
        quickActions: [
          {
            label: 'View Load Board',
            action: 'navigate:/dispatch?tab=loads',
            description: 'See available loads',
            icon: '📋',
          },
          {
            label: 'Assign Driver',
            action: 'navigate:/dispatch?action=assign',
            description: 'Assign driver to load',
            icon: '👤',
          },
          {
            label: 'Track Shipments',
            action: 'navigate:/dispatch?tab=tracking',
            description: 'Monitor active shipments',
            icon: '📍',
          },
        ],
        tutorials: ['/training/dispatch-basics', '/training/load-management'],
      },

      // AI VOICE INTELLIGENCE SYSTEM
      {
        id: 'ai-voice-demo',
        title: 'AI Voice Demo',
        description:
          'Interactive AI voice conversation demo with ultra-realistic speech',
        url: '/ai-voice-demo',
        category: 'AI Intelligence',
        icon: '🎙️',
        keywords: [
          'ai voice',
          'voice demo',
          'voice ai',
          'voice intelligence',
          'speech',
          'conversation',
          'voice assistant',
          'ai demo',
          'voice system',
          'elevenlabs',
          'tts',
          'text to speech',
          'voice conversation',
          'ai chat',
          'voice chat',
          'flowter voice',
        ],
        subscriptionTier: 'basic',
        requiredPermissions: [],
        features: [
          'Ultra-realistic AI voice',
          'ElevenLabs integration',
          'Real-time conversation',
          'Voice intelligence demo',
          'Interactive testing',
        ],
        relatedPages: ['/call-flow', '/ai', '/about'],
        helpText:
          'Experience ultra-realistic AI voice conversations powered by advanced voice intelligence. Test and interact with the FLOWTER AI voice system.',
        quickActions: [
          {
            label: 'Start Voice Demo',
            action: 'navigate:/ai-voice-demo',
            description: 'Try the AI voice system',
            icon: '🎙️',
          },
          {
            label: 'View Features',
            action: 'navigate:/ai-voice-demo?tab=ai-features',
            description: 'Learn about AI capabilities',
            icon: '🧠',
          },
          {
            label: 'See Examples',
            action: 'navigate:/ai-voice-demo?tab=examples',
            description: 'View conversation examples',
            icon: '💬',
          },
        ],
        tutorials: ['/training/ai-voice-setup', '/training/voice-intelligence'],
      },

      // AI CALL FLOW SYSTEM
      {
        id: 'call-flow',
        title: 'Call Flow System',
        description: 'AI-powered phone system and call management dashboard',
        url: '/call-flow',
        category: 'AI Intelligence',
        icon: '📞',
        keywords: [
          'call flow',
          'phone system',
          'call management',
          'phone setup',
          'twilio',
          'call forwarding',
          'phone integration',
          'call center',
          'phone dashboard',
          'voice calls',
          'call routing',
          'phone dialer',
          'crm integration',
          'call analytics',
          'phone configuration',
        ],
        subscriptionTier: 'basic',
        requiredPermissions: [],
        features: [
          'Phone Setup Dashboard',
          'Call Forwarding',
          'CRM Integration',
          'Phone Dialer',
          'Call Analytics',
          'Twilio Integration',
        ],
        relatedPages: ['/ai-voice-demo', '/ai', '/about'],
        helpText:
          'Configure your phone system, set up call forwarding, and manage all voice communications through the AI-powered call flow dashboard.',
        quickActions: [
          {
            label: 'Setup Phone',
            action: 'navigate:/call-flow?action=setup',
            description: 'Configure your phone number',
            icon: '🔧',
          },
          {
            label: 'View Call History',
            action: 'navigate:/call-flow?tab=history',
            description: 'See call logs and analytics',
            icon: '📊',
          },
          {
            label: 'CRM Integration',
            action: 'navigate:/call-flow?tab=crm',
            description: 'Connect CRM systems',
            icon: '🔗',
          },
        ],
        tutorials: ['/training/phone-setup', '/training/call-flow-basics'],
      },

      // FLOWTER AI SYSTEM
      {
        id: 'flowter-ai-system',
        title: 'FLOWTER AI Intelligence',
        description:
          'Advanced AI assistant for transportation management and automation',
        url: '/ai',
        category: 'AI Intelligence',
        icon: '🤖',
        keywords: [
          'flowter ai',
          'ai assistant',
          'ai intelligence',
          'artificial intelligence',
          'ai system',
          'smart assistant',
          'ai automation',
          'machine learning',
          'ai tools',
          'intelligent assistant',
          'ai platform',
          'ai features',
          'ai capabilities',
          'transportation ai',
          'freight ai',
          'logistics ai',
        ],
        subscriptionTier: 'basic',
        requiredPermissions: [],
        features: [
          'Natural language processing',
          'Intelligent search',
          'Voice AI integration',
          'Automated workflows',
          'Smart recommendations',
          'Context-aware assistance',
        ],
        relatedPages: ['/ai-voice-demo', '/call-flow', '/about'],
        helpText:
          'Access the complete FLOWTER AI intelligence platform with voice AI, smart automation, and advanced transportation management capabilities.',
        quickActions: [
          {
            label: 'AI Voice Demo',
            action: 'navigate:/ai-voice-demo',
            description: 'Try voice AI system',
            icon: '🎙️',
          },
          {
            label: 'Call Flow Setup',
            action: 'navigate:/call-flow',
            description: 'Configure phone system',
            icon: '📞',
          },
          {
            label: 'AI Hub',
            action: 'navigate:/ai',
            description: 'Access AI platform',
            icon: '🧠',
          },
        ],
        tutorials: ['/training/flowter-ai-basics', '/training/ai-setup'],
      },

      // BROKER OPERATIONS
      {
        id: 'broker-portal',
        title: 'Broker Portal',
        description: 'Freight brokerage and customer management',
        url: '/broker',
        category: 'Sales',
        icon: '🤝',
        keywords: [
          'broker',
          'brokerage',
          'customers',
          'deals',
          'negotiations',
          'rates',
          'sales',
        ],
        subscriptionTier: 'premium',
        requiredPermissions: ['broker.view'],
        features: [
          'Customer CRM',
          'Rate Management',
          'Deal Pipeline',
          'Document Generation',
        ],
        relatedPages: ['/quoting', '/shippers', '/carriers'],
        helpText:
          'Manage customer relationships, negotiate rates, and handle freight brokerage operations.',
        quickActions: [
          {
            label: 'Customer CRM',
            action: 'navigate:/broker?tab=customers',
            description: 'Manage customer relationships',
            icon: '👥',
          },
          {
            label: 'Active Deals',
            action: 'navigate:/broker?tab=deals',
            description: 'View current negotiations',
            icon: '💼',
          },
          {
            label: 'Rate Calculator',
            action: 'navigate:/broker?tab=rates',
            description: 'Calculate competitive rates',
            icon: '💰',
          },
        ],
        tutorials: [
          '/training/brokerage-basics',
          '/training/customer-management',
        ],
      },

      // FINANCIAL MANAGEMENT
      {
        id: 'invoicing',
        title: 'Invoicing & Billing',
        description: 'Invoice management and payment processing',
        url: '/billing',
        category: 'Finance',
        icon: '💵',
        keywords: [
          'invoice',
          'billing',
          'payment',
          'finance',
          'money',
          'accounts',
          'receivable',
          'settlements',
        ],
        subscriptionTier: 'basic',
        requiredPermissions: ['finance.view'],
        features: [
          'Invoice Generation',
          'Payment Tracking',
          'Automated Billing',
          'Financial Reports',
        ],
        relatedPages: ['/reports', '/settlements'],
        helpText:
          'Generate invoices, track payments, and manage financial transactions.',
        quickActions: [
          {
            label: 'Create Invoice',
            action: 'navigate:/billing?action=create',
            description: 'Generate new invoice',
            icon: '📄',
          },
          {
            label: 'Payment Status',
            action: 'navigate:/billing?tab=payments',
            description: 'Track payment status',
            icon: '💳',
          },
          {
            label: 'Financial Reports',
            action: 'navigate:/billing?tab=reports',
            description: 'View financial analytics',
            icon: '📈',
          },
        ],
        tutorials: ['/training/invoicing', '/training/payment-processing'],
      },

      // FREIGHT QUOTING
      {
        id: 'freight-quoting',
        title: 'Freight Quoting',
        description: 'Calculate and manage freight quotes',
        url: '/quoting',
        category: 'Sales',
        icon: '💰',
        keywords: [
          'quoting',
          'quotes',
          'rates',
          'pricing',
          'calculate',
          'estimates',
          'cost',
        ],
        subscriptionTier: 'basic',
        requiredPermissions: ['quoting.view'],
        features: [
          'Rate Calculator',
          'Quote Management',
          'Pricing Analytics',
          'Customer Quotes',
        ],
        relatedPages: ['/broker', '/dispatch', '/shippers'],
        helpText:
          'Create accurate freight quotes with AI-powered pricing recommendations.',
        quickActions: [
          {
            label: 'New Quote',
            action: 'navigate:/quoting?action=create',
            description: 'Create a new freight quote',
            icon: '➕',
          },
          {
            label: 'Quote History',
            action: 'navigate:/quoting?tab=history',
            description: 'View past quotes',
            icon: '📋',
          },
          {
            label: 'Rate Calculator',
            action: 'navigate:/quoting?tab=calculator',
            description: 'Calculate rates',
            icon: '🧮',
          },
        ],
        tutorials: ['/training/quoting-basics', '/training/pricing-strategies'],
      },

      // DRIVER MANAGEMENT
      {
        id: 'driver-management',
        title: 'Driver Management',
        description: 'Manage drivers, schedules, and compliance',
        url: '/drivers',
        category: 'Fleet',
        icon: '👥',
        keywords: [
          'drivers',
          'staff',
          'schedule',
          'employees',
          'personnel',
          'hours',
          'compliance',
        ],
        subscriptionTier: 'basic',
        requiredPermissions: ['drivers.view'],
        features: [
          'Driver Profiles',
          'Schedule Management',
          'HOS Tracking',
          'Performance Analytics',
        ],
        relatedPages: ['/dispatch', '/compliance', '/vehicles'],
        helpText:
          'Manage your driver fleet with scheduling, compliance tracking, and performance monitoring.',
        quickActions: [
          {
            label: 'Driver List',
            action: 'navigate:/drivers?tab=list',
            description: 'View all drivers',
            icon: '📋',
          },
          {
            label: 'Schedules',
            action: 'navigate:/drivers?tab=schedule',
            description: 'Manage driver schedules',
            icon: '📅',
          },
          {
            label: 'Add Driver',
            action: 'navigate:/drivers?action=add',
            description: 'Onboard new driver',
            icon: '➕',
          },
        ],
        tutorials: ['/training/driver-management', '/training/hos-compliance'],
      },

      // VEHICLE FLEET
      {
        id: 'vehicle-fleet',
        title: 'Vehicle Fleet',
        description: 'Fleet management and maintenance',
        url: '/vehicles',
        category: 'Fleet',
        icon: '🚛',
        keywords: [
          'vehicles',
          'trucks',
          'fleet',
          'equipment',
          'assets',
          'maintenance',
          'trailers',
        ],
        subscriptionTier: 'basic',
        requiredPermissions: ['vehicles.view'],
        features: [
          'Fleet Overview',
          'Maintenance Scheduling',
          'Vehicle Tracking',
          'Asset Management',
        ],
        relatedPages: ['/maintenance', '/routes', '/drivers'],
        helpText:
          'Manage your vehicle fleet with maintenance scheduling and performance tracking.',
        quickActions: [
          {
            label: 'Fleet Overview',
            action: 'navigate:/vehicles?tab=overview',
            description: 'View fleet status',
            icon: '📊',
          },
          {
            label: 'Maintenance',
            action: 'navigate:/vehicles?tab=maintenance',
            description: 'Schedule maintenance',
            icon: '🔧',
          },
          {
            label: 'Add Vehicle',
            action: 'navigate:/vehicles?action=add',
            description: 'Add new vehicle',
            icon: '➕',
          },
        ],
        tutorials: [
          '/training/fleet-management',
          '/training/maintenance-planning',
        ],
      },

      // CARRIER PORTAL
      {
        id: 'carrier-portal',
        title: 'Carrier Portal',
        description: 'Carrier and vendor management',
        url: '/carriers',
        category: 'Network',
        icon: '🚚',
        keywords: [
          'carriers',
          'vendors',
          'partners',
          'network',
          'contractors',
          'freight',
        ],
        subscriptionTier: 'basic',
        requiredPermissions: ['carriers.view'],
        features: [
          'Carrier Directory',
          'Performance Tracking',
          'Load Posting',
          'Rate Management',
        ],
        relatedPages: ['/dispatch', '/broker', '/compliance'],
        helpText:
          'Manage your carrier network with performance tracking and load assignments.',
        quickActions: [
          {
            label: 'Carrier Directory',
            action: 'navigate:/carriers?tab=directory',
            description: 'View carrier network',
            icon: '📋',
          },
          {
            label: 'Post Loads',
            action: 'navigate:/carriers?tab=loads',
            description: 'Post available loads',
            icon: '📤',
          },
          {
            label: 'Add Carrier',
            action: 'navigate:/carriers?action=add',
            description: 'Onboard new carrier',
            icon: '➕',
          },
        ],
        tutorials: ['/training/carrier-management', '/training/load-posting'],
      },

      // REPORTS & ANALYTICS
      {
        id: 'reports-analytics',
        title: 'Reports & Analytics',
        description: 'Business intelligence and reporting',
        url: '/reports',
        category: 'Analytics',
        icon: '📊',
        keywords: [
          'reports',
          'analytics',
          'data',
          'metrics',
          'statistics',
          'insights',
          'dashboard',
          'kpi',
        ],
        subscriptionTier: 'premium',
        requiredPermissions: ['reports.view'],
        features: [
          'Custom Reports',
          'Real-time Analytics',
          'Performance KPIs',
          'Data Export',
        ],
        relatedPages: ['/dispatch', '/billing', '/drivers'],
        helpText:
          'Generate comprehensive reports and gain insights into your operations.',
        quickActions: [
          {
            label: 'Dashboard',
            action: 'navigate:/reports?tab=dashboard',
            description: 'View main dashboard',
            icon: '📊',
          },
          {
            label: 'Custom Report',
            action: 'navigate:/reports?action=create',
            description: 'Create custom report',
            icon: '📝',
          },
          {
            label: 'Performance',
            action: 'navigate:/reports?tab=performance',
            description: 'View performance metrics',
            icon: '⚡',
          },
        ],
        tutorials: ['/training/reporting-basics', '/training/data-analytics'],
      },

      // COMPLIANCE & SAFETY
      {
        id: 'compliance-safety',
        title: 'Compliance & Safety',
        description: 'Regulatory compliance and safety management',
        url: '/compliance',
        category: 'Compliance',
        icon: '🛡️',
        keywords: [
          'compliance',
          'safety',
          'regulations',
          'dot',
          'fmcsa',
          'legal',
          'audit',
          'requirements',
        ],
        subscriptionTier: 'premium',
        requiredPermissions: ['compliance.view'],
        features: [
          'DOT Compliance',
          'Safety Management',
          'Audit Tools',
          'Regulatory Updates',
        ],
        relatedPages: ['/drivers', '/vehicles', '/reports'],
        helpText:
          'Maintain regulatory compliance with automated tracking and reporting.',
        quickActions: [
          {
            label: 'Compliance Dashboard',
            action: 'navigate:/compliance?tab=dashboard',
            description: 'View compliance status',
            icon: '📊',
          },
          {
            label: 'Safety Reports',
            action: 'navigate:/compliance?tab=safety',
            description: 'Generate safety reports',
            icon: '📋',
          },
          {
            label: 'Audit Trail',
            action: 'navigate:/compliance?tab=audit',
            description: 'View audit history',
            icon: '🔍',
          },
        ],
        tutorials: ['/training/dot-compliance', '/training/safety-management'],
      },

      // AI FLOW
      {
        id: 'ai-flow',
        title: 'AI Flow',
        description: 'AI automation and intelligent workflows',
        url: '/ai',
        category: 'AI',
        icon: '🤖',
        keywords: [
          'ai',
          'artificial intelligence',
          'automation',
          'smart',
          'intelligent',
          'machine learning',
        ],
        subscriptionTier: 'premium',
        requiredPermissions: ['ai.view'],
        features: [
          'AI Automation',
          'Intelligent Insights',
          'Workflow Optimization',
          'Predictive Analytics',
        ],
        relatedPages: ['/reports', '/dispatch', '/routes'],
        helpText:
          'Leverage AI-powered automation and insights to optimize your operations.',
        quickActions: [
          {
            label: 'AI Dashboard',
            action: 'navigate:/ai?tab=dashboard',
            description: 'View AI insights',
            icon: '📊',
          },
          {
            label: 'Automation',
            action: 'navigate:/ai?tab=automation',
            description: 'Manage AI workflows',
            icon: '⚙️',
          },
          {
            label: 'Predictions',
            action: 'navigate:/ai?tab=predictions',
            description: 'View AI predictions',
            icon: '🔮',
          },
        ],
        tutorials: ['/training/ai-basics', '/training/automation-setup'],
      },

      // AI COMPANY DASHBOARD
      {
        id: 'ai-company-dashboard',
        title: 'AI Company Dashboard',
        description:
          'Executive Intelligence Center with AI-powered business insights',
        url: '/ai-company-dashboard',
        category: 'AI Intelligence',
        icon: '🏢',
        keywords: [
          'ai company',
          'executive dashboard',
          'company intelligence',
          'business intelligence',
          'executive center',
          'company analytics',
          'ai insights',
          'executive ai',
          'company overview',
          'business dashboard',
        ],
        subscriptionTier: 'premium',
        requiredPermissions: [],
        features: [
          'Executive Intelligence Center',
          'Real-time company metrics',
          'AI-powered insights',
          'Strategic recommendations',
          'Performance tracking',
          'Company-wide analytics',
        ],
        relatedPages: ['/ai-flow', '/analytics', '/reports'],
        helpText:
          'Access comprehensive executive intelligence with AI-powered insights into your entire company operations, performance metrics, and strategic recommendations.',
        quickActions: [
          {
            label: 'Executive Overview',
            action: 'navigate:/ai-company-dashboard',
            description: 'View company intelligence',
            icon: '🏢',
          },
          {
            label: 'AI Insights',
            action: 'navigate:/ai-company-dashboard?tab=insights',
            description: 'View AI recommendations',
            icon: '🧠',
          },
          {
            label: 'Performance Metrics',
            action: 'navigate:/ai-company-dashboard?tab=metrics',
            description: 'Track company performance',
            icon: '📊',
          },
        ],
        tutorials: ['/training/executive-dashboard', '/training/ai-insights'],
      },

      // AI FLOW PLATFORM
      {
        id: 'ai-flow-platform',
        title: 'AI Flow Platform',
        description:
          'Complete AI automation platform with lead generation and intelligent workflows',
        url: '/ai-flow',
        category: 'AI Intelligence',
        icon: '🚀',
        keywords: [
          'ai flow',
          'ai platform',
          'lead generation',
          'ai automation',
          'workflow automation',
          'unified lead gen',
          'ai workflows',
          'automation platform',
          'lead gen',
          'ai tools',
        ],
        subscriptionTier: 'premium',
        requiredPermissions: [],
        features: [
          'Unified Lead Generation',
          'Automated workflows',
          'Multi-source lead discovery',
          'AI-powered scoring',
          'CRM integration',
          'Revenue optimization',
        ],
        relatedPages: ['/ai-company-dashboard', '/crm', '/broker-operations'],
        helpText:
          'Access the complete AI Flow platform with unified lead generation across TruckingPlanet, ThomasNet, and FMCSA. Generate high-quality leads with AI scoring and instant CRM integration.',
        quickActions: [
          {
            label: 'Unified Lead Gen',
            action: 'navigate:/ai-flow?tab=lead-gen',
            description: 'Generate leads with AI',
            icon: '🎯',
          },
          {
            label: 'Search Leads',
            action: 'navigate:/ai-flow?tab=search',
            description: 'Advanced lead search',
            icon: '🔍',
          },
          {
            label: 'View Results',
            action: 'navigate:/ai-flow?tab=results',
            description: 'Browse generated leads',
            icon: '📋',
          },
        ],
        tutorials: ['/training/ai-flow-basics', '/training/lead-generation'],
      },

      // AI STAFF MANAGEMENT
      {
        id: 'ai-staff-management',
        title: 'AI Staff Management',
        description: 'Manage your AI-powered staff and automation workforce',
        url: '/ai-staff-management',
        category: 'AI Intelligence',
        icon: '👥',
        keywords: [
          'ai staff',
          'ai workforce',
          'ai employees',
          'ai agents',
          'staff management',
          'ai team',
          'automation staff',
          'ai workers',
          'virtual staff',
          'ai personnel',
        ],
        subscriptionTier: 'enterprise',
        requiredPermissions: [],
        features: [
          '18 AI Staff Members',
          'AI agent orchestration',
          'Performance monitoring',
          'Task assignment',
          'AI training & optimization',
          'Staff analytics',
        ],
        relatedPages: [
          '/ai-staff-operations',
          '/ai-company-dashboard',
          '/ai-flow',
        ],
        helpText:
          'Manage your entire AI staff workforce including 18 specialized AI agents. Monitor performance, assign tasks, and optimize your automation team.',
        quickActions: [
          {
            label: 'View AI Staff',
            action: 'navigate:/ai-staff-management',
            description: 'See all AI staff members',
            icon: '👥',
          },
          {
            label: 'Staff Analytics',
            action: 'navigate:/ai-staff-management?tab=analytics',
            description: 'Monitor AI performance',
            icon: '📊',
          },
          {
            label: 'AI Operations',
            action: 'navigate:/ai-staff-operations',
            description: 'Manage AI operations',
            icon: '⚙️',
          },
        ],
        tutorials: ['/training/ai-staff-setup', '/training/ai-orchestration'],
      },

      // CRM SYSTEM
      {
        id: 'crm-system',
        title: 'CRM - Customer Relationship Management',
        description:
          'Complete CRM system with integrated dialer and automation',
        url: '/crm',
        category: 'Sales',
        icon: '📱',
        keywords: [
          'crm',
          'customer relationship',
          'contact management',
          'lead management',
          'sales pipeline',
          'customer database',
          'contacts',
          'relationships',
          'sales crm',
          'customer management',
        ],
        subscriptionTier: 'basic',
        requiredPermissions: ['crm.view'],
        features: [
          'Contact management',
          'Lead tracking',
          'Sales pipeline',
          'Integrated dialer',
          'Email integration',
          'Activity tracking',
        ],
        relatedPages: ['/dialer', '/broker-operations', '/ai-flow'],
        helpText:
          'Manage all customer relationships with integrated dialer, email automation, and comprehensive contact tracking. Track leads through your sales pipeline.',
        quickActions: [
          {
            label: 'View Contacts',
            action: 'navigate:/crm?tab=contacts',
            description: 'Browse all contacts',
            icon: '👥',
          },
          {
            label: 'Sales Pipeline',
            action: 'navigate:/crm?tab=pipeline',
            description: 'Track sales opportunities',
            icon: '📈',
          },
          {
            label: 'Add Contact',
            action: 'navigate:/crm?action=add',
            description: 'Create new contact',
            icon: '➕',
          },
        ],
        tutorials: ['/training/crm-basics', '/training/sales-pipeline'],
      },

      // DIALER SYSTEM
      {
        id: 'dialer-system',
        title: 'Integrated Dialer',
        description:
          'Professional phone dialer with CRM integration and call tracking',
        url: '/dialer',
        category: 'Sales',
        icon: '📞',
        keywords: [
          'dialer',
          'phone dialer',
          'call center',
          'phone calls',
          'calling',
          'outbound calls',
          'call tracking',
          'phone system',
          'voip dialer',
          'click to dial',
        ],
        subscriptionTier: 'basic',
        requiredPermissions: [],
        features: [
          'Click-to-dial functionality',
          'CRM call integration',
          'Call history tracking',
          'Automated call logging',
          'Call recording',
          'Real-time call monitoring',
        ],
        relatedPages: ['/crm', '/call-flow', '/broker-operations'],
        helpText:
          'Professional dialer system integrated with your CRM. Make calls, track conversations, and automatically log all communications.',
        quickActions: [
          {
            label: 'Open Dialer',
            action: 'navigate:/dialer',
            description: 'Start making calls',
            icon: '📞',
          },
          {
            label: 'Call History',
            action: 'navigate:/dialer?tab=history',
            description: 'View call logs',
            icon: '📋',
          },
          {
            label: 'CRM Integration',
            action: 'navigate:/dialer?tab=crm',
            description: 'Connect with CRM',
            icon: '🔗',
          },
        ],
        tutorials: ['/training/dialer-setup', '/training/call-best-practices'],
      },

      // DATA CONSORTIUM
      {
        id: 'data-consortium',
        title: 'Industry Data Consortium',
        description:
          'Anonymous industry benchmarking and competitive intelligence',
        url: '/data-consortium',
        category: 'Analytics',
        icon: '🌐',
        keywords: [
          'data consortium',
          'industry data',
          'benchmarking',
          'competitive intelligence',
          'market data',
          'industry insights',
          'anonymous data',
          'market intelligence',
          'industry analytics',
          'competitor analysis',
        ],
        subscriptionTier: 'premium',
        requiredPermissions: [],
        features: [
          'Access to 2,847+ companies data',
          'Anonymous benchmarking',
          'Industry performance metrics',
          'Competitive analysis',
          'Market trends',
          'Strategic insights',
        ],
        relatedPages: ['/analytics', '/reports', '/ai-company-dashboard'],
        helpText:
          'Access anonymous industry data from 2,847+ companies. Benchmark your performance, analyze market trends, and gain competitive intelligence.',
        quickActions: [
          {
            label: 'View Benchmarks',
            action: 'navigate:/data-consortium?tab=benchmarks',
            description: 'Compare your metrics',
            icon: '📊',
          },
          {
            label: 'Market Intelligence',
            action: 'navigate:/data-consortium?tab=intelligence',
            description: 'View market trends',
            icon: '🧠',
          },
          {
            label: 'Industry Analytics',
            action: 'navigate:/data-consortium?tab=analytics',
            description: 'Deep dive analytics',
            icon: '📈',
          },
        ],
        tutorials: ['/training/consortium-basics', '/training/benchmarking'],
      },

      // DOCUMENTS HUB
      {
        id: 'documents-hub',
        title: 'Documents Hub',
        description: 'Centralized document management and filing system',
        url: '/documents-hub',
        category: 'Operations',
        icon: '📁',
        keywords: [
          'documents',
          'document hub',
          'file management',
          'document storage',
          'filing system',
          'document center',
          'files',
          'paperwork',
          'document library',
          'file storage',
        ],
        subscriptionTier: 'basic',
        requiredPermissions: ['documents.view'],
        features: [
          'Centralized document storage',
          'Advanced search & filtering',
          'Version control',
          'Secure sharing',
          'External broker integration',
          'Automated organization',
        ],
        relatedPages: ['/broker-operations', '/compliance', '/contracts'],
        helpText:
          'Centralized hub for all your documents with advanced search, secure sharing, and integration with external brokers and partners.',
        quickActions: [
          {
            label: 'Browse Documents',
            action: 'navigate:/documents-hub',
            description: 'View all documents',
            icon: '📁',
          },
          {
            label: 'Upload Files',
            action: 'navigate:/documents-hub?action=upload',
            description: 'Add new documents',
            icon: '📤',
          },
          {
            label: 'Search Documents',
            action: 'navigate:/documents-hub?tab=search',
            description: 'Find specific files',
            icon: '🔍',
          },
        ],
        tutorials: [
          '/training/document-management',
          '/training/file-organization',
        ],
      },

      // VENDOR MANAGEMENT
      {
        id: 'vendor-management',
        title: 'Vendor Management',
        description: 'Complete vendor and supplier relationship management',
        url: '/vendor-management',
        category: 'Network',
        icon: '🏭',
        keywords: [
          'vendor',
          'vendor management',
          'suppliers',
          'vendor portal',
          'supplier management',
          'vendor tracking',
          'vendor performance',
          'supplier portal',
          'vendor analytics',
          'vendor relationships',
        ],
        subscriptionTier: 'premium',
        requiredPermissions: ['vendors.view'],
        features: [
          'Vendor directory',
          'Performance tracking',
          'Contract management',
          'Vendor analytics',
          'Rating system',
          'Vendor portal access',
        ],
        relatedPages: ['/vendor-portal', '/carriers', '/broker-management'],
        helpText:
          'Manage all vendor and supplier relationships with performance tracking, contract management, and comprehensive analytics.',
        quickActions: [
          {
            label: 'Vendor Directory',
            action: 'navigate:/vendor-management?tab=directory',
            description: 'View all vendors',
            icon: '📋',
          },
          {
            label: 'Performance',
            action: 'navigate:/vendor-management?tab=performance',
            description: 'Track vendor metrics',
            icon: '📊',
          },
          {
            label: 'Add Vendor',
            action: 'navigate:/vendor-management?action=add',
            description: 'Onboard new vendor',
            icon: '➕',
          },
        ],
        tutorials: [
          '/training/vendor-management',
          '/training/supplier-relations',
        ],
      },

      // VENDOR PORTAL
      {
        id: 'vendor-portal',
        title: 'Vendor Portal',
        description: 'Self-service portal for vendors and suppliers',
        url: '/vendor-portal',
        category: 'Network',
        icon: '🔐',
        keywords: [
          'vendor portal',
          'supplier portal',
          'vendor access',
          'vendor login',
          'supplier access',
          'vendor dashboard',
          'vendor self-service',
          'supplier dashboard',
        ],
        subscriptionTier: 'premium',
        requiredPermissions: [],
        features: [
          'Vendor self-service',
          'Load opportunities',
          'Invoice submission',
          'Performance dashboards',
          'Document exchange',
          'Communication hub',
        ],
        relatedPages: ['/vendor-management', '/carriers', '/documents-hub'],
        helpText:
          'Secure portal for vendors to access load opportunities, submit invoices, view performance metrics, and communicate with your team.',
        quickActions: [
          {
            label: 'Vendor Dashboard',
            action: 'navigate:/vendor-portal',
            description: 'View vendor overview',
            icon: '📊',
          },
          {
            label: 'Load Opportunities',
            action: 'navigate:/vendor-portal?tab=loads',
            description: 'Available loads',
            icon: '🚛',
          },
          {
            label: 'Submit Invoice',
            action: 'navigate:/vendor-portal?action=invoice',
            description: 'Invoice submission',
            icon: '💵',
          },
        ],
        tutorials: ['/training/vendor-portal-access', '/training/vendor-guide'],
      },

      // FREIGHT FORWARDING
      {
        id: 'freight-forwarding',
        title: 'Freight Forwarding',
        description:
          'International freight forwarding and logistics management',
        url: '/freight-forwarding',
        category: 'Operations',
        icon: '🌎',
        keywords: [
          'freight forwarding',
          'international freight',
          'global shipping',
          'freight forwarder',
          'international logistics',
          'customs',
          'import export',
          'ocean freight',
          'air freight',
          'international shipping',
        ],
        subscriptionTier: 'premium',
        requiredPermissions: ['freight.view'],
        features: [
          'International shipping',
          'Customs management',
          'Multi-modal logistics',
          'Import/Export tracking',
          'Documentation automation',
          'Global carrier network',
        ],
        relatedPages: ['/customs-agent-portal', '/dispatch', '/documents-hub'],
        helpText:
          'Manage international freight forwarding operations with customs handling, multi-modal logistics, and comprehensive documentation.',
        quickActions: [
          {
            label: 'Create Shipment',
            action: 'navigate:/freight-forwarding?action=create',
            description: 'New international shipment',
            icon: '🌎',
          },
          {
            label: 'Track Shipments',
            action: 'navigate:/freight-forwarding?tab=tracking',
            description: 'Monitor international loads',
            icon: '📍',
          },
          {
            label: 'Customs Docs',
            action: 'navigate:/freight-forwarding?tab=customs',
            description: 'Customs documentation',
            icon: '📄',
          },
        ],
        tutorials: ['/training/freight-forwarding', '/training/customs-basics'],
      },

      // GOVERNMENT CONTRACTS
      {
        id: 'government-contracts',
        title: 'Government Contracts',
        description: 'Government contract management and SAM.gov integration',
        url: '/government-contracts',
        category: 'Sales',
        icon: '🏛️',
        keywords: [
          'government contracts',
          'government',
          'sam.gov',
          'federal contracts',
          'government bids',
          'rfp government',
          'federal bids',
          'government rfq',
          'federal government',
          'government procurement',
        ],
        subscriptionTier: 'enterprise',
        requiredPermissions: [],
        features: [
          'SAM.gov integration',
          'Contract opportunity tracking',
          'Bid management',
          'Compliance automation',
          'Government RFP responses',
          'Contract performance tracking',
        ],
        relatedPages: ['/broker-operations', '/contracts', '/compliance'],
        helpText:
          'Manage government contracts with SAM.gov integration, automated bid tracking, and compliance management for federal opportunities.',
        quickActions: [
          {
            label: 'View Opportunities',
            action: 'navigate:/government-contracts?tab=opportunities',
            description: 'Browse government contracts',
            icon: '🔍',
          },
          {
            label: 'Active Bids',
            action: 'navigate:/government-contracts?tab=bids',
            description: 'Track your bids',
            icon: '📋',
          },
          {
            label: 'Compliance',
            action: 'navigate:/government-contracts?tab=compliance',
            description: 'Government compliance',
            icon: '✅',
          },
        ],
        tutorials: [
          '/training/government-contracts',
          '/training/sam-gov-integration',
        ],
      },

      // TRAINING & UNIVERSITY
      {
        id: 'training-university',
        title: 'FleetFlow University',
        description: 'Training center and educational resources',
        url: '/university',
        category: 'Learning',
        icon: '🎓',
        keywords: [
          'training',
          'university',
          'learning',
          'education',
          'courses',
          'tutorials',
          'training center',
          'learning center',
          'education center',
          'course catalog',
          'instruction',
          'certification',
        ],
        subscriptionTier: 'basic',
        requiredPermissions: [],
        features: [
          'Interactive training courses',
          'Video tutorials',
          'Certification programs',
          'Best practices guides',
          'Live training sessions',
          'Learning paths',
        ],
        relatedPages: ['/documentation', '/about'],
        helpText:
          'Access comprehensive training resources, video tutorials, and certification programs to master FleetFlow and industry best practices.',
        quickActions: [
          {
            label: 'Course Catalog',
            action: 'navigate:/university?tab=courses',
            description: 'Browse all courses',
            icon: '📚',
          },
          {
            label: 'My Training',
            action: 'navigate:/university?tab=my-training',
            description: 'Track your progress',
            icon: '📈',
          },
          {
            label: 'Certifications',
            action: 'navigate:/university?tab=certifications',
            description: 'Earn certificates',
            icon: '🏆',
          },
        ],
        tutorials: ['/training/platform-basics', '/training/getting-started'],
      },

      // USER MANAGEMENT
      {
        id: 'user-management',
        title: 'User Management',
        description: 'Comprehensive user administration and access control',
        url: '/user-management',
        category: 'Administration',
        icon: '👤',
        keywords: [
          'user management',
          'users',
          'user admin',
          'user administration',
          'access control',
          'permissions',
          'user roles',
          'user access',
          'account management',
          'team management',
        ],
        subscriptionTier: 'basic',
        requiredPermissions: ['admin.users'],
        features: [
          'User creation & editing',
          'Role-based access control',
          'Permission management',
          'User activity tracking',
          'Bulk user operations',
          'Team organization',
        ],
        relatedPages: ['/settings', '/organizations'],
        helpText:
          'Manage all users with granular permissions, role-based access control, and comprehensive user administration tools.',
        quickActions: [
          {
            label: 'User List',
            action: 'navigate:/user-management',
            description: 'View all users',
            icon: '👥',
          },
          {
            label: 'Add User',
            action: 'navigate:/user-management?action=add',
            description: 'Create new user',
            icon: '➕',
          },
          {
            label: 'Permissions',
            action: 'navigate:/user-management?tab=permissions',
            description: 'Manage access control',
            icon: '🔐',
          },
        ],
        tutorials: ['/training/user-management', '/training/access-control'],
      },

      // NOTIFICATIONS CENTER
      {
        id: 'notifications-center',
        title: 'Notifications Center',
        description: 'Centralized notification and alert management',
        url: '/notifications',
        category: 'Communication',
        icon: '🔔',
        keywords: [
          'notifications',
          'alerts',
          'notification center',
          'notices',
          'alerts center',
          'notification settings',
          'push notifications',
          'email notifications',
          'sms alerts',
          'notification preferences',
        ],
        subscriptionTier: 'basic',
        requiredPermissions: [],
        features: [
          'Real-time notifications',
          'Email alerts',
          'SMS notifications',
          'Push notifications',
          'Custom alert rules',
          'Notification preferences',
        ],
        relatedPages: ['/messages', '/settings'],
        helpText:
          'Manage all notifications and alerts in one place. Configure notification preferences and stay informed about important events.',
        quickActions: [
          {
            label: 'View Notifications',
            action: 'navigate:/notifications',
            description: 'See all notifications',
            icon: '🔔',
          },
          {
            label: 'Settings',
            action: 'navigate:/notifications?tab=settings',
            description: 'Configure preferences',
            icon: '⚙️',
          },
          {
            label: 'Alert Rules',
            action: 'navigate:/notifications?tab=rules',
            description: 'Manage alert rules',
            icon: '⚡',
          },
        ],
        tutorials: [
          '/training/notifications-setup',
          '/training/alert-management',
        ],
      },

      // MESSAGES SYSTEM
      {
        id: 'messages-system',
        title: 'Messaging System',
        description: 'Intraoffice messaging and team communication',
        url: '/messages',
        category: 'Communication',
        icon: '💬',
        keywords: [
          'messages',
          'messaging',
          'intraoffice',
          'team chat',
          'internal messaging',
          'team communication',
          'chat',
          'direct messages',
          'team messages',
          'communication',
        ],
        subscriptionTier: 'basic',
        requiredPermissions: [],
        features: [
          'Direct messaging',
          'Group conversations',
          'File sharing',
          'Message search',
          'Read receipts',
          'Message history',
        ],
        relatedPages: ['/notifications', '/crm'],
        helpText:
          'Internal messaging system for team communication. Send direct messages, create group chats, and share files with your team.',
        quickActions: [
          {
            label: 'Inbox',
            action: 'navigate:/messages',
            description: 'View your messages',
            icon: '📥',
          },
          {
            label: 'New Message',
            action: 'navigate:/messages?action=compose',
            description: 'Send a message',
            icon: '✉️',
          },
          {
            label: 'Team Chats',
            action: 'navigate:/messages?tab=groups',
            description: 'View group conversations',
            icon: '👥',
          },
        ],
        tutorials: [
          '/training/messaging-basics',
          '/training/team-communication',
        ],
      },

      // CONTRACTS MANAGEMENT
      {
        id: 'contracts-management',
        title: 'Contracts Management',
        description: 'Contract lifecycle management and automation',
        url: '/contracts',
        category: 'Operations',
        icon: '📝',
        keywords: [
          'contracts',
          'contract management',
          'agreements',
          'contract lifecycle',
          'contract tracking',
          'contract automation',
          'legal documents',
          'contract templates',
          'agreement management',
          'contract repository',
        ],
        subscriptionTier: 'premium',
        requiredPermissions: ['contracts.view'],
        features: [
          'Contract repository',
          'Template library',
          'E-signature integration',
          'Renewal tracking',
          'Contract analytics',
          'Compliance monitoring',
        ],
        relatedPages: ['/documents-hub', '/broker-operations', '/shippers'],
        helpText:
          'Manage all contracts with automated tracking, e-signature integration, and comprehensive lifecycle management.',
        quickActions: [
          {
            label: 'View Contracts',
            action: 'navigate:/contracts',
            description: 'Browse all contracts',
            icon: '📋',
          },
          {
            label: 'Create Contract',
            action: 'navigate:/contracts?action=create',
            description: 'New contract',
            icon: '➕',
          },
          {
            label: 'Templates',
            action: 'navigate:/contracts?tab=templates',
            description: 'Contract templates',
            icon: '📄',
          },
        ],
        tutorials: ['/training/contract-management', '/training/e-signatures'],
      },

      // FREIGHT NETWORK
      {
        id: 'freight-network',
        title: 'Freight Network',
        description: 'Collaborative freight network and load sharing',
        url: '/freight-network',
        category: 'Network',
        icon: '🕸️',
        keywords: [
          'freight network',
          'load sharing',
          'carrier network',
          'freight collaboration',
          'network loads',
          'partner network',
          'freight board',
          'load exchange',
          'network collaboration',
          'freight marketplace',
        ],
        subscriptionTier: 'premium',
        requiredPermissions: [],
        features: [
          'Network load board',
          'Partner collaboration',
          'Load sharing',
          'Capacity matching',
          'Network analytics',
          'Partner ratings',
        ],
        relatedPages: ['/carriers', '/dispatch', '/broker-operations'],
        helpText:
          'Access collaborative freight network to share loads, find capacity, and collaborate with trusted partners.',
        quickActions: [
          {
            label: 'Network Board',
            action: 'navigate:/freight-network?tab=board',
            description: 'View network loads',
            icon: '📋',
          },
          {
            label: 'Find Capacity',
            action: 'navigate:/freight-network?tab=capacity',
            description: 'Search for capacity',
            icon: '🔍',
          },
          {
            label: 'Post Load',
            action: 'navigate:/freight-network?action=post',
            description: 'Share a load',
            icon: '📤',
          },
        ],
        tutorials: ['/training/freight-network', '/training/load-sharing'],
      },

      // OPENELD INTEGRATION
      {
        id: 'openeld-integration',
        title: 'OpenELD',
        description: 'Electronic Logging Device integration and HOS compliance',
        url: '/openeld',
        category: 'Compliance',
        icon: '📱',
        keywords: [
          'openeld',
          'eld',
          'electronic logging',
          'hos',
          'hours of service',
          'eld compliance',
          'driver logs',
          'logbook',
          'eld integration',
          'hos tracking',
        ],
        subscriptionTier: 'premium',
        requiredPermissions: [],
        features: [
          'ELD compliance tracking',
          'Hours of Service monitoring',
          'Driver log management',
          'FMCSA compliance',
          'Real-time HOS alerts',
          'Violation prevention',
        ],
        relatedPages: ['/drivers', '/compliance', '/dot-compliance'],
        helpText:
          'Integrated ELD solution for Hours of Service compliance, driver log management, and FMCSA regulatory adherence.',
        quickActions: [
          {
            label: 'ELD Dashboard',
            action: 'navigate:/openeld',
            description: 'View ELD status',
            icon: '📊',
          },
          {
            label: 'HOS Tracking',
            action: 'navigate:/openeld?tab=hos',
            description: 'Monitor hours of service',
            icon: '⏱️',
          },
          {
            label: 'Driver Logs',
            action: 'navigate:/openeld?tab=logs',
            description: 'View driver logs',
            icon: '📋',
          },
        ],
        tutorials: ['/training/eld-basics', '/training/hos-compliance'],
      },

      // MAINTENANCE MANAGEMENT
      {
        id: 'maintenance-management',
        title: 'Maintenance Management',
        description: 'Vehicle maintenance scheduling and tracking',
        url: '/maintenance',
        category: 'Fleet',
        icon: '🔧',
        keywords: [
          'maintenance',
          'vehicle maintenance',
          'repair',
          'service',
          'preventive maintenance',
          'maintenance schedule',
          'repair tracking',
          'fleet maintenance',
          'maintenance logs',
          'service records',
        ],
        subscriptionTier: 'basic',
        requiredPermissions: ['maintenance.view'],
        features: [
          'Maintenance scheduling',
          'Service tracking',
          'Preventive maintenance',
          'Repair history',
          'Cost tracking',
          'Vendor management',
        ],
        relatedPages: ['/vehicles', '/fleet'],
        helpText:
          'Comprehensive maintenance management with scheduling, tracking, preventive maintenance programs, and cost analysis.',
        quickActions: [
          {
            label: 'Maintenance Schedule',
            action: 'navigate:/maintenance?tab=schedule',
            description: 'View scheduled maintenance',
            icon: '📅',
          },
          {
            label: 'Service History',
            action: 'navigate:/maintenance?tab=history',
            description: 'View repair history',
            icon: '📋',
          },
          {
            label: 'Schedule Service',
            action: 'navigate:/maintenance?action=schedule',
            description: 'Schedule maintenance',
            icon: '➕',
          },
        ],
        tutorials: [
          '/training/maintenance-basics',
          '/training/preventive-maintenance',
        ],
      },

      // SAFETY MANAGEMENT
      {
        id: 'safety-management',
        title: 'Safety Management',
        description: 'Safety compliance and incident management',
        url: '/safety',
        category: 'Compliance',
        icon: '🦺',
        keywords: [
          'safety',
          'safety management',
          'safety compliance',
          'incident management',
          'accident tracking',
          'safety training',
          'safety reports',
          'risk management',
          'safety program',
          'safety metrics',
        ],
        subscriptionTier: 'premium',
        requiredPermissions: ['safety.view'],
        features: [
          'Incident tracking',
          'Safety training programs',
          'Compliance monitoring',
          'Safety metrics & KPIs',
          'Risk assessment',
          'Accident reporting',
        ],
        relatedPages: ['/compliance', '/drivers', '/dot-compliance'],
        helpText:
          'Comprehensive safety management system for incident tracking, training programs, compliance monitoring, and risk management.',
        quickActions: [
          {
            label: 'Safety Dashboard',
            action: 'navigate:/safety?tab=dashboard',
            description: 'View safety metrics',
            icon: '📊',
          },
          {
            label: 'Report Incident',
            action: 'navigate:/safety?action=report',
            description: 'Report an incident',
            icon: '⚠️',
          },
          {
            label: 'Training',
            action: 'navigate:/safety?tab=training',
            description: 'Safety training programs',
            icon: '🎓',
          },
        ],
        tutorials: ['/training/safety-basics', '/training/incident-management'],
      },

      // TRACKING SYSTEM
      {
        id: 'tracking-system',
        title: 'Live Tracking',
        description: 'Real-time GPS tracking and shipment monitoring',
        url: '/tracking',
        category: 'Operations',
        icon: '📍',
        keywords: [
          'tracking',
          'live tracking',
          'gps tracking',
          'shipment tracking',
          'real-time tracking',
          'location tracking',
          'track shipment',
          'track load',
          'tracking system',
          'gps monitoring',
        ],
        subscriptionTier: 'basic',
        requiredPermissions: [],
        features: [
          'Real-time GPS tracking',
          'Geofencing alerts',
          'ETA predictions',
          'Route replay',
          'Customer tracking portal',
          'Multi-load monitoring',
        ],
        relatedPages: ['/dispatch', '/routes'],
        helpText:
          'Real-time GPS tracking for all shipments with geofencing, ETA predictions, and customer visibility.',
        quickActions: [
          {
            label: 'Live Map',
            action: 'navigate:/tracking?tab=map',
            description: 'View live tracking map',
            icon: '🗺️',
          },
          {
            label: 'Active Loads',
            action: 'navigate:/tracking?tab=active',
            description: 'Track active shipments',
            icon: '🚛',
          },
          {
            label: 'Tracking History',
            action: 'navigate:/tracking?tab=history',
            description: 'View tracking history',
            icon: '📋',
          },
        ],
        tutorials: ['/training/tracking-basics', '/training/geofencing'],
      },

      // ORGANIZATIONS
      {
        id: 'organizations-management',
        title: 'Organizations',
        description: 'Multi-company and subsidiary management',
        url: '/organizations',
        category: 'Administration',
        icon: '🏢',
        keywords: [
          'organizations',
          'companies',
          'subsidiaries',
          'multi-company',
          'company management',
          'organization structure',
          'business units',
          'divisions',
          'corporate structure',
          'company hierarchy',
        ],
        subscriptionTier: 'enterprise',
        requiredPermissions: ['admin.organizations'],
        features: [
          'Multi-company management',
          'Subsidiary organization',
          'Cross-company reporting',
          'Shared resources',
          'Organization hierarchy',
          'Company consolidation',
        ],
        relatedPages: ['/user-management', '/settings', '/analytics'],
        helpText:
          'Manage multiple companies and subsidiaries within a single platform with consolidated reporting and shared resources.',
        quickActions: [
          {
            label: 'View Organizations',
            action: 'navigate:/organizations',
            description: 'Browse all organizations',
            icon: '🏢',
          },
          {
            label: 'Add Organization',
            action: 'navigate:/organizations?action=add',
            description: 'Create new organization',
            icon: '➕',
          },
          {
            label: 'Organization Tree',
            action: 'navigate:/organizations?tab=hierarchy',
            description: 'View company hierarchy',
            icon: '🌳',
          },
        ],
        tutorials: [
          '/training/multi-company-setup',
          '/training/organization-management',
        ],
      },

      // PERFORMANCE DASHBOARD
      {
        id: 'performance-dashboard',
        title: 'Performance Dashboard',
        description: 'Real-time performance metrics and KPI tracking',
        url: '/performance',
        category: 'Analytics',
        icon: '⚡',
        keywords: [
          'performance',
          'performance dashboard',
          'kpi',
          'key performance indicators',
          'performance metrics',
          'performance tracking',
          'efficiency metrics',
          'performance analysis',
          'operational performance',
          'performance monitoring',
        ],
        subscriptionTier: 'premium',
        requiredPermissions: [],
        features: [
          'Real-time KPI tracking',
          'Performance benchmarking',
          'Efficiency metrics',
          'Team performance',
          'Custom dashboards',
          'Performance alerts',
        ],
        relatedPages: ['/analytics', '/reports', '/ai-company-dashboard'],
        helpText:
          'Monitor all performance metrics and KPIs in real-time with customizable dashboards and benchmarking.',
        quickActions: [
          {
            label: 'KPI Dashboard',
            action: 'navigate:/performance?tab=kpi',
            description: 'View key metrics',
            icon: '📊',
          },
          {
            label: 'Team Performance',
            action: 'navigate:/performance?tab=team',
            description: 'Track team metrics',
            icon: '👥',
          },
          {
            label: 'Custom Views',
            action: 'navigate:/performance?tab=custom',
            description: 'Create custom dashboard',
            icon: '⚙️',
          },
        ],
        tutorials: ['/training/performance-tracking', '/training/kpi-setup'],
      },

      // SCHEDULING SYSTEM
      {
        id: 'scheduling-system',
        title: 'Scheduling & Appointments',
        description: 'Appointment scheduling and calendar management',
        url: '/scheduling',
        category: 'Operations',
        icon: '📅',
        keywords: [
          'scheduling',
          'appointments',
          'calendar',
          'schedule management',
          'appointment booking',
          'time slots',
          'availability',
          'scheduling system',
          'appointment calendar',
          'booking system',
        ],
        subscriptionTier: 'basic',
        requiredPermissions: [],
        features: [
          'Appointment scheduling',
          'Calendar management',
          'Availability tracking',
          'Automated reminders',
          'Resource scheduling',
          'Booking confirmations',
        ],
        relatedPages: ['/dispatch', '/drivers', '/maintenance'],
        helpText:
          'Comprehensive scheduling system for appointments, resource allocation, and calendar management with automated reminders.',
        quickActions: [
          {
            label: 'View Calendar',
            action: 'navigate:/scheduling?tab=calendar',
            description: 'View schedule calendar',
            icon: '📅',
          },
          {
            label: 'Book Appointment',
            action: 'navigate:/scheduling?action=book',
            description: 'Schedule appointment',
            icon: '➕',
          },
          {
            label: 'Availability',
            action: 'navigate:/scheduling?tab=availability',
            description: 'Manage availability',
            icon: '⏰',
          },
        ],
        tutorials: [
          '/training/scheduling-basics',
          '/training/appointment-management',
        ],
      },

      // QUALITY CONTROL
      {
        id: 'quality-control',
        title: 'Quality Control',
        description: 'Quality assurance and process monitoring',
        url: '/quality-control',
        category: 'Operations',
        icon: '✅',
        keywords: [
          'quality control',
          'quality assurance',
          'qa',
          'qc',
          'quality management',
          'process monitoring',
          'quality metrics',
          'quality standards',
          'quality audits',
          'process improvement',
        ],
        subscriptionTier: 'premium',
        requiredPermissions: ['quality.view'],
        features: [
          'Quality audits',
          'Process monitoring',
          'Performance standards',
          'Issue tracking',
          'Quality metrics',
          'Improvement programs',
        ],
        relatedPages: ['/performance', '/compliance', '/analytics'],
        helpText:
          'Comprehensive quality control system with audits, process monitoring, and continuous improvement programs.',
        quickActions: [
          {
            label: 'Quality Dashboard',
            action: 'navigate:/quality-control?tab=dashboard',
            description: 'View quality metrics',
            icon: '📊',
          },
          {
            label: 'Start Audit',
            action: 'navigate:/quality-control?action=audit',
            description: 'Begin quality audit',
            icon: '🔍',
          },
          {
            label: 'Issue Tracking',
            action: 'navigate:/quality-control?tab=issues',
            description: 'Track quality issues',
            icon: '⚠️',
          },
        ],
        tutorials: [
          '/training/quality-control',
          '/training/process-improvement',
        ],
      },
    ];
  }

  // ============================================================================
  // SEARCH INDEX BUILDING
  // ============================================================================

  private buildSearchIndex(): void {
    console.info('🔧 Building Flowter search index...');

    this.searchData.forEach((item) => {
      const searchTerms = [
        item.title.toLowerCase(),
        item.description.toLowerCase(),
        ...item.keywords.map((k) => k.toLowerCase()),
        ...item.features.map((f) => f.toLowerCase()),
        item.category.toLowerCase(),
      ];

      searchTerms.forEach((term) => {
        const words = term.split(/\s+/);
        words.forEach((word) => {
          word = word.replace(/[^a-z0-9]/g, ''); // Clean word
          if (word.length > 2) {
            // Skip very short words
            if (!this.searchIndex.has(word)) {
              this.searchIndex.set(word, []);
            }
            const items = this.searchIndex.get(word);
            if (items && !items.find((i) => i.id === item.id)) {
              items.push(item);
            }
          }
        });
      });
    });

    console.info(
      `✅ Search index built with ${this.searchIndex.size} terms covering ${this.searchData.length} features`
    );
  }

  private buildSynonymMap(): void {
    const synonyms = {
      routing: [
        'routes',
        'navigation',
        'directions',
        'planning',
        'optimization',
        'maps',
      ],
      dispatch: [
        'loads',
        'shipments',
        'drivers',
        'assignments',
        'scheduling',
        'board',
      ],
      broker: [
        'brokerage',
        'customers',
        'deals',
        'sales',
        'negotiations',
        'rates',
      ],
      invoice: [
        'billing',
        'payments',
        'money',
        'finance',
        'accounts',
        'settlements',
      ],
      tracking: [
        'location',
        'gps',
        'monitoring',
        'status',
        'updates',
        'position',
      ],
      reports: [
        'analytics',
        'data',
        'metrics',
        'statistics',
        'insights',
        'dashboard',
      ],
      drivers: ['operators', 'staff', 'employees', 'personnel', 'workforce'],
      vehicles: ['trucks', 'fleet', 'equipment', 'assets', 'trailers'],
      maintenance: ['repair', 'service', 'upkeep', 'preventive', 'fix'],
      compliance: ['regulations', 'legal', 'safety', 'requirements', 'audit'],
      quoting: ['quotes', 'pricing', 'rates', 'estimates', 'cost', 'calculate'],
      carriers: ['vendors', 'partners', 'network', 'contractors', 'freight'],
      ai: [
        'artificial intelligence',
        'automation',
        'machine learning',
        'intelligent',
        'smart',
        'flowter',
      ],
      crm: [
        'customer relationship',
        'contacts',
        'leads',
        'sales',
        'customers',
        'relationships',
      ],
      dialer: [
        'phone',
        'calling',
        'calls',
        'phone system',
        'voip',
        'call center',
      ],
      documents: [
        'files',
        'paperwork',
        'document hub',
        'filing',
        'storage',
        'library',
      ],
      vendor: [
        'vendors',
        'suppliers',
        'vendor management',
        'supplier portal',
        'partnerships',
      ],
      training: [
        'learning',
        'education',
        'university',
        'courses',
        'tutorials',
        'certification',
      ],
      messages: [
        'messaging',
        'chat',
        'communication',
        'team chat',
        'intraoffice',
        'direct messages',
      ],
      notifications: [
        'alerts',
        'notices',
        'notification center',
        'push notifications',
        'reminders',
      ],
      contracts: [
        'agreements',
        'contract management',
        'legal documents',
        'contract lifecycle',
      ],
      government: [
        'federal',
        'government contracts',
        'sam.gov',
        'federal contracts',
        'procurement',
      ],
      eld: [
        'electronic logging',
        'openeld',
        'hours of service',
        'hos',
        'driver logs',
        'logbook',
      ],
      performance: [
        'kpi',
        'key performance indicators',
        'metrics',
        'efficiency',
        'monitoring',
      ],
      scheduling: [
        'appointments',
        'calendar',
        'booking',
        'availability',
        'time slots',
      ],
      safety: [
        'safety management',
        'incident',
        'accident',
        'risk management',
        'safety compliance',
      ],
      quality: [
        'quality control',
        'qa',
        'qc',
        'quality assurance',
        'process monitoring',
      ],
      organizations: [
        'companies',
        'subsidiaries',
        'multi-company',
        'business units',
        'divisions',
      ],
      consortium: [
        'industry data',
        'benchmarking',
        'competitive intelligence',
        'market data',
      ],
      forwarding: [
        'freight forwarding',
        'international freight',
        'global shipping',
        'customs',
      ],
      network: [
        'freight network',
        'load sharing',
        'freight collaboration',
        'partner network',
      ],
    };

    Object.entries(synonyms).forEach(([key, values]) => {
      this.synonymMap.set(key, values);
      values.forEach((synonym) => {
        if (!this.synonymMap.has(synonym)) {
          this.synonymMap.set(synonym, [key]);
        } else {
          const existing = this.synonymMap.get(synonym) || [];
          if (!existing.includes(key)) {
            existing.push(key);
          }
        }
      });
    });

    console.info(`✅ Synonym map built with ${this.synonymMap.size} terms`);
  }

  // ============================================================================
  // SECURITY VALIDATION
  // ============================================================================

  private async validateSearchQuery(
    query: string,
    context: FlowterSecurityContext
  ): Promise<ValidationResult> {
    const validation: ValidationResult = {
      isValid: true,
      riskScore: 0,
      flags: [],
      sanitizedInput: query,
    };

    // Length validation
    if (query.length > 500) {
      validation.isValid = false;
      validation.flags.push('QUERY_TOO_LONG');
      validation.riskScore += 30;
    }

    // Pattern analysis for dangerous queries
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(query)) {
        validation.isValid = false;
        validation.flags.push('DANGEROUS_PATTERN_DETECTED');
        validation.riskScore += 60;
      }
    }

    // Basic sanitization
    validation.sanitizedInput = query
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/[<>\"']/g, '')
      .trim();

    return validation;
  }

  // ============================================================================
  // INTENT ANALYSIS
  // ============================================================================

  private async parseSearchIntent(query: string): Promise<SearchIntent> {
    const queryLower = query.toLowerCase().trim();

    const intent: SearchIntent = {
      action: 'VIEW',
      target: '',
      modifiers: [],
      confidence: 0,
    };

    // Action detection
    if (
      queryLower.includes('create') ||
      queryLower.includes('new') ||
      queryLower.includes('add')
    ) {
      intent.action = 'CREATE';
      intent.confidence += 20;
    } else if (
      queryLower.includes('edit') ||
      queryLower.includes('modify') ||
      queryLower.includes('update')
    ) {
      intent.action = 'EDIT';
      intent.confidence += 20;
    } else if (queryLower.includes('delete') || queryLower.includes('remove')) {
      intent.action = 'DELETE';
      intent.confidence += 20;
    } else if (
      queryLower.includes('optimize') ||
      queryLower.includes('improve')
    ) {
      intent.action = 'OPTIMIZE';
      intent.confidence += 25;
    } else if (
      queryLower.includes('track') ||
      queryLower.includes('monitor') ||
      queryLower.includes('status')
    ) {
      intent.action = 'TRACK';
      intent.confidence += 20;
    } else if (
      queryLower.includes('help') ||
      queryLower.includes('how to') ||
      queryLower.includes('tutorial')
    ) {
      intent.action = 'HELP';
      intent.confidence += 25;
    }

    // Target detection using synonyms and keywords
    const words = queryLower.split(/\s+/);
    for (const word of words) {
      // Direct match
      if (this.synonymMap.has(word)) {
        intent.target = word;
        intent.confidence += 30;
        break;
      }
      // Synonym match
      for (const [key, synonyms] of this.synonymMap.entries()) {
        if (synonyms.includes(word)) {
          intent.target = key;
          intent.confidence += 25;
          break;
        }
      }
    }

    // Modifier detection
    if (queryLower.includes('help') || queryLower.includes('how to')) {
      intent.modifiers.push('HELP_NEEDED');
      intent.confidence += 15;
    }
    if (queryLower.includes('quick') || queryLower.includes('fast')) {
      intent.modifiers.push('QUICK_ACCESS');
      intent.confidence += 10;
    }
    if (queryLower.includes('where') || queryLower.includes('find')) {
      intent.modifiers.push('LOCATION_REQUEST');
      intent.confidence += 10;
    }

    console.info(
      `🎯 Intent parsed: ${intent.action} ${intent.target} (confidence: ${intent.confidence}%)`
    );
    return intent;
  }

  // ============================================================================
  // SEARCH MATCHING
  // ============================================================================

  private async findMatches(
    query: string,
    intent: SearchIntent
  ): Promise<FlowterSearchItem[]> {
    const queryLower = query.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const words = queryLower.split(/\s+/).filter((word) => word.length > 2);

    const matchScores = new Map<string, number>();

    // Search through index
    words.forEach((word) => {
      const items = this.searchIndex.get(word) || [];
      items.forEach((item) => {
        const currentScore = matchScores.get(item.id) || 0;
        matchScores.set(item.id, currentScore + 1);
      });
    });

    // Add synonym matches
    words.forEach((word) => {
      const synonyms = this.synonymMap.get(word) || [];
      synonyms.forEach((synonym) => {
        const items = this.searchIndex.get(synonym) || [];
        items.forEach((item) => {
          const currentScore = matchScores.get(item.id) || 0;
          matchScores.set(item.id, currentScore + 0.8); // Slightly lower score for synonyms
        });
      });
    });

    // Convert to results with scores
    const results = Array.from(matchScores.entries())
      .filter(([_, score]) => score > 0)
      .sort((a, b) => b[1] - a[1]) // Sort by score descending
      .map(([itemId, _]) => this.searchData.find((item) => item.id === itemId))
      .filter((item) => item !== undefined) as FlowterSearchItem[];

    console.info(`🔍 Found ${results.length} matches for "${query}"`);
    return results.slice(0, 10); // Limit to top 10 results
  }

  // ============================================================================
  // ACCESS CONTROL
  // ============================================================================

  private async filterByAccess(
    results: FlowterSearchItem[],
    context: FlowterSecurityContext
  ): Promise<AccessFilteredResults> {
    const accessible: FlowterSearchItem[] = [];
    const restricted: RestrictedResult[] = [];

    for (const item of results) {
      // Check subscription tier
      const hasSubscription = this.checkSubscriptionAccess(
        item.subscriptionTier,
        context
      );

      // Check permissions
      const hasPermissions = this.checkUserPermissions(
        item.requiredPermissions,
        context
      );

      if (hasSubscription && hasPermissions) {
        accessible.push(item);
      } else {
        restricted.push({
          item,
          reason: !hasSubscription
            ? 'SUBSCRIPTION_REQUIRED'
            : 'PERMISSION_DENIED',
          upgradeRequired: !hasSubscription ? item.subscriptionTier : null,
        });
      }
    }

    console.info(
      `🔒 Access filter: ${accessible.length} accessible, ${restricted.length} restricted`
    );
    return { accessible, restricted };
  }

  private checkSubscriptionAccess(
    requiredTier: string,
    context: FlowterSecurityContext
  ): boolean {
    const tierLevels = { basic: 1, premium: 2, enterprise: 3 };
    const userLevel =
      tierLevels[context.subscriptionTier as keyof typeof tierLevels] || 0;
    const requiredLevel =
      tierLevels[requiredTier as keyof typeof tierLevels] || 0;

    return requiredTier === 'all' || userLevel >= requiredLevel;
  }

  private checkUserPermissions(
    requiredPermissions: string[],
    context: FlowterSecurityContext
  ): boolean {
    if (requiredPermissions.length === 0) return true;

    // For now, use the existing permission checking system
    // In production, this would check against actual user permissions
    const { user } = getCurrentUser();
    const userPermissions = getUserPagePermissions(user);

    // Basic permission checking - in production this would be more sophisticated
    return requiredPermissions.every((permission) => {
      const [page, action] = permission.split('.');

      // Check common permissions
      if (user.role === 'admin') return true;
      if (page === 'dispatch' && checkPermission('hasDispatchAccess'))
        return true;
      if (page === 'broker' && user.role === 'broker') return true;
      if (
        page === 'drivers' &&
        (user.role === 'dispatcher' || user.role === 'manager')
      )
        return true;

      return true; // Allow by default for demo - tighten in production
    });
  }

  // ============================================================================
  // RESPONSE GENERATION
  // ============================================================================

  private async generateIntelligentResponse(
    results: AccessFilteredResults,
    query: string,
    intent: SearchIntent
  ): Promise<FlowterSearchResults> {
    if (results.accessible.length === 0 && results.restricted.length === 0) {
      return {
        type: 'NO_RESULTS',
        message: `I couldn't find anything matching "${query}". Here are some things you can search for:`,
        suggestions: [
          'routing - for route planning and optimization',
          'dispatch - for load management and driver assignment',
          'invoicing - for billing and payments',
          'reports - for analytics and insights',
          'drivers - for driver management',
          'vehicles - for fleet management',
        ],
        quickHelp: [
          'Try broader terms like "dispatch" or "reports"',
          'Use keywords like "create", "track", or "optimize"',
          'Ask "help with [topic]" for tutorials',
        ],
      };
    }

    if (results.accessible.length === 1) {
      // Single result - provide direct navigation
      const item = results.accessible[0];
      return {
        type: 'DIRECT_NAVIGATION',
        message: this.generateNavigationMessage(item, intent),
        primaryAction: {
          type: 'navigate',
          url: item.url,
          label: `Go to ${item.title}`,
          icon: item.icon,
        },
        item: item,
        quickActions: item.quickActions,
        helpText: item.helpText,
      };
    }

    if (results.accessible.length > 1) {
      // Multiple results - provide selection
      return {
        type: 'MULTIPLE_RESULTS',
        message: `I found ${results.accessible.length} features matching "${query}". Which one would you like to access?`,
        results: results.accessible
          .map((item) => ({
            ...item,
            relevanceScore: this.calculateRelevance(item, query, intent),
          }))
          .sort((a, b) => b.relevanceScore - a.relevanceScore),
        restrictedResults:
          results.restricted.length > 0 ? results.restricted : undefined,
      };
    }

    // Only restricted results
    return {
      type: 'ACCESS_RESTRICTED',
      message: `I found features matching "${query}", but you need additional access:`,
      restrictedResults: results.restricted,
      upgradeMessage: this.generateUpgradeMessage(results.restricted),
    };
  }

  private generateNavigationMessage(
    item: FlowterSearchItem,
    intent: SearchIntent
  ): string {
    const actionText =
      intent.action === 'CREATE'
        ? 'create new items'
        : intent.action === 'OPTIMIZE'
          ? 'optimize your operations'
          : intent.action === 'TRACK'
            ? 'track and monitor'
            : intent.action === 'HELP'
              ? 'get help and tutorials'
              : 'access all features';

    return `Perfect! I'll take you to **${item.title}** where you can ${actionText}.

${item.helpText}

**Key Features Available:**
${item.features.map((f) => `• ${f}`).join('\n')}

Ready to go?`;
  }

  private generateUpgradeMessage(
    restrictedResults: RestrictedResult[]
  ): string {
    const subscriptionUpgrades = restrictedResults
      .filter((r) => r.reason === 'SUBSCRIPTION_REQUIRED')
      .map((r) => r.upgradeRequired)
      .filter((tier, index, self) => tier && self.indexOf(tier) === index);

    if (subscriptionUpgrades.length > 0) {
      return `Upgrade to ${subscriptionUpgrades.join(' or ')} to access these advanced features.`;
    }

    return 'Contact your administrator to request additional permissions.';
  }

  private calculateRelevance(
    item: FlowterSearchItem,
    query: string,
    intent: SearchIntent
  ): number {
    let score = 0;
    const queryLower = query.toLowerCase();

    // Title match (highest weight)
    if (item.title.toLowerCase().includes(queryLower)) score += 100;

    // Keyword matches
    const matchingKeywords = item.keywords.filter((k) =>
      queryLower.includes(k.toLowerCase())
    );
    score += matchingKeywords.length * 20;

    // Category relevance
    if (item.category.toLowerCase().includes(queryLower)) score += 30;

    // Intent alignment
    if (intent.target && item.keywords.includes(intent.target)) score += 40;

    return score;
  }

  // ============================================================================
  // SECURITY RESPONSE
  // ============================================================================

  private createSecurityResponse(
    validation: ValidationResult
  ): FlowterSearchResults {
    return {
      type: 'SECURITY_BLOCKED',
      message:
        'I cannot process that request due to security policies. Please rephrase your question.',
      suggestions: [
        'Use simple, clear language',
        'Ask about specific FleetFlow features',
        'Avoid special characters or complex queries',
      ],
    };
  }
}

// Export singleton instance
export const flowterSearch = new FlowterIntelligentSearch();
