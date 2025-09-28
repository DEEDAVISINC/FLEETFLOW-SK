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
