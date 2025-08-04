// FreightFlow Quoting Engine Training Content
// FleetFlow University℠ Professional Training Module

export const freightflowQuotingTrainingContent = {
  courseId: 'freightflow-quoting-engine-mastery',
  title: 'FreightFlow Quoting Engine Mastery',
  duration: '90 minutes',
  difficulty: 'Intermediate',
  category: 'Business',
  modules: [
    {
      id: 'introduction',
      title: 'Introduction to FreightFlow Quoting Engine',
      duration: '10 minutes',
      content: {
        overview: `The FreightFlow Quoting Engine is a revolutionary unified pricing system that combines four intelligent pricing engines to generate the most accurate and competitive freight quotes in the industry.`,
        keyFeatures: [
          '🧠 AI-Powered Analysis: Four distinct pricing engines working together',
          '🔄 Unified Workflow: Streamlined quote generation process',
          '📊 Real-Time Intelligence: Market data and competitive positioning',
          '🎯 Customer-Specific Pricing: Tier-based discounts and preferences',
          '🔗 Broker Integration: Seamless sync with broker dashboards'
        ],
        pricingEngines: [
          {
            name: '🚨 Emergency Load Pricing',
            description: 'Premium rates for urgent deliveries'
          },
          {
            name: '📊 Spot Rate Optimization',
            description: 'Market intelligence and competitive positioning'
          },
          {
            name: '💰 Volume Discount Structure',
            description: 'Customer loyalty and tier-based pricing'
          },
          {
            name: '🏢 Warehousing Services',
            description: 'Cross-docking and storage solutions'
          }
        ]
      }
    },
    {
      id: 'system-access',
      title: 'Accessing the Quoting System',
      duration: '8 minutes',
      content: {
        navigationPaths: [
          {
            method: 'Direct Access',
            steps: [
              'Navigate to http://localhost:3000/quoting',
              'Select the "🎯 AI Workflow" tab',
              'Begin the unified quoting process'
            ]
          },
          {
            method: 'From Broker Dashboard',
            steps: [
              'Login to Broker Portal',
              'Go to "Freight Quotes" section',
              'Click "🚀 Open Full Quoting System"',
              'Access complete unified workflow'
            ]
          },
          {
            method: 'Quick Links',
            steps: [
              'Main navigation → "FreightFlow RFx℠" → "Quoting Engine"',
              'Search bar → Type "quoting" → Select "Freight Quoting"'
            ]
          }
        ],
        interfaceFeatures: [
          'Tab Navigation: Traditional quotes, AI Workflow, Emergency Pricing',
          'Progress Indicators: Visual workflow steps',
          'Real-Time Updates: Live pricing and market data',
          'Responsive Design: Works on desktop, tablet, and mobile'
        ]
      }
    },
    {
      id: 'unified-workflow',
      title: 'The Unified AI Workflow',
      duration: '20 minutes',
      content: {
        workflowSteps: [
          {
            step: 'Customer Selection',
            description: 'Choose customer to determine pricing tiers and discounts',
            details: {
              customerTiers: [
                { tier: '🥈 Silver', discount: '4%', description: 'Standard customers' },
                { tier: '🥇 Gold', discount: '6%', description: 'Preferred customers' },
                { tier: '💎 Platinum', discount: '8%', description: 'Premium customers' }
              ],
              demoCustomers: [
                'SHIP-2024-001: Walmart Distribution Center (Gold - 6%)',
                'SHIP-2024-002: Amazon Fulfillment (Platinum - 8%)',
                'SHIP-2024-003: Home Depot Supply Chain (Silver - 4%)',
                'SHIP-2024-004: Target Logistics (Gold - 6%)',
                'SHIP-2024-005: Costco Wholesale (Gold - 6%)'
              ]
            }
          },
          {
            step: 'Load Details Entry',
            description: 'Enter comprehensive load information to trigger appropriate pricing engines',
            details: {
              requiredFields: [
                'Origin City, State: Pickup location',
                'Destination City, State: Delivery location',
                'Weight (lbs): Total shipment weight',
                'Equipment Type: Van, Reefer, Flatbed, Step Deck, Expedited, Warehousing',
                'Urgency Level: Standard, Urgent, Critical, Emergency'
              ],
              engineTriggers: [
                'Emergency Pricing: Triggered by "Critical" or "Emergency" urgency, or "Expedited" equipment',
                'Spot Rate: Always enabled for market intelligence',
                'Volume Discount: Automatically applied based on customer tier',
                'Warehousing: Triggered by "Warehousing" or "Cross-Dock" equipment selection'
              ]
            }
          },
          {
            step: 'AI Analysis',
            description: 'Click "🧠 Analyze with AI" to run the unified calculation',
            details: {
              analysisProcess: [
                'Base Rate Calculation: Starting rate based on weight and distance',
                'Engine Evaluation: Each pricing engine analyzes the load',
                'API Calls: Real-time data from all four pricing engines',
                'Unified Calculation: Combined analysis produces final rates',
                'Alternative Generation: Three quote options (Standard, Express, Economy)'
              ],
              sampleCalculation: {
                baseRate: 2000,
                weightAdjustment: 250,
                emergencyPremium: 562,
                marketAdjustment: 112,
                volumeDiscount: -233,
                finalRate: 2691
              }
            }
          },
          {
            step: 'Quote Generation',
            description: 'System generates three professional quote options',
            details: {
              quoteTypes: [
                {
                  type: 'Standard Quote',
                  rate: 'Base calculation with all applicable engines',
                  timeline: '3-day delivery',
                  engines: 'All applicable pricing engines applied'
                },
                {
                  type: 'Express Quote',
                  rate: '15% premium over standard',
                  timeline: 'Next-day delivery',
                  engines: 'All standard engines plus expedited service'
                },
                {
                  type: 'Economy Quote',
                  rate: '15% discount from standard',
                  timeline: '5-day delivery',
                  engines: 'Excludes emergency pricing (if applicable)'
                }
              ]
            }
          },
          {
            step: 'Quote Selection',
            description: 'Click "🎯 Select Quote" on preferred option to create official quote',
            details: {
              selectionProcess: [
                'Quote Creation: Comprehensive quote object generated',
                'Broker Attribution: Quote linked to current broker session',
                'Dual Storage: Saved to both unified and broker-specific storage',
                'Dashboard Sync: Automatically appears in broker dashboard',
                'Workflow Completion: Moves to quote management step'
              ]
            }
          }
        ]
      }
    },
    {
      id: 'pricing-engines',
      title: 'Understanding the Four Pricing Engines',
      duration: '25 minutes',
      content: {
        engines: [
          {
            id: 'emergency-pricing',
            name: '🚨 Emergency Load Pricing',
            purpose: 'Provides premium pricing for time-sensitive and critical deliveries',
            activationTriggers: [
              'Urgency level set to "Critical" or "Emergency"',
              'Equipment type set to "Expedited"',
              'Special service requirements'
            ],
            pricingLogic: [
              'Base Premium: 25% above standard rate',
              'Market Factors: Supply/demand for emergency services',
              'Equipment Availability: Expedited equipment surcharge',
              'Time Sensitivity: Same-day and next-day premiums'
            ],
            bestPractices: [
              'Use for loads requiring immediate pickup/delivery',
              'Communicate urgency clearly to customers',
              'Verify equipment availability before quoting',
              'Consider driver availability and hours of service'
            ]
          },
          {
            id: 'spot-rate-optimization',
            name: '📊 Spot Rate Optimization',
            purpose: 'Provides market intelligence and competitive positioning for optimal pricing',
            alwaysActive: true,
            dataSources: [
              'Real-time market rates',
              'Competitor pricing intelligence',
              'Lane-specific historical data',
              'Seasonal demand patterns'
            ],
            pricingLogic: [
              'Market Adjustment: 5% adjustment based on current conditions',
              'Competitive Analysis: Positioning relative to market rates',
              'Lane Intelligence: Historical performance on specific routes',
              'Demand Forecasting: Predictive pricing based on trends'
            ],
            benefits: [
              'Ensures competitive pricing',
              'Maximizes profit margins',
              'Provides market insights',
              'Reduces quote rejection rates'
            ]
          },
          {
            id: 'volume-discount',
            name: '💰 Volume Discount Structure',
            purpose: 'Rewards loyal customers with tier-based discounts and volume incentives',
            customerTiers: [
              { tier: 'Silver (4% discount)', description: 'Standard volume customers' },
              { tier: 'Gold (6% discount)', description: 'High-volume preferred customers' },
              { tier: 'Platinum (8% discount)', description: 'Premium enterprise customers' }
            ],
            discountApplication: [
              'Applied to final calculated rate',
              'Compounds with other pricing adjustments',
              'Automatically applied based on customer selection',
              'Can be overridden for special circumstances'
            ],
            volumeConsiderations: [
              'Annual shipment volume',
              'Payment history and terms',
              'Relationship duration',
              'Strategic partnership value'
            ]
          },
          {
            id: 'warehousing-services',
            name: '🏢 Warehousing Services',
            purpose: 'Adds specialized services for cross-docking, storage, and distribution needs',
            serviceTypes: [
              'Cross-Docking: Immediate transfer between trucks',
              'Temporary Storage: Short-term warehousing solutions',
              'Distribution Services: Pick, pack, and ship operations',
              'Specialized Handling: Temperature-controlled, hazmat, etc.'
            ],
            pricingStructure: [
              'Base Service Fee: $500 for standard warehousing',
              'Duration-Based: Additional charges for extended storage',
              'Handling Fees: Based on commodity type and special requirements',
              'Equipment Costs: Specialized equipment surcharges'
            ]
          }
        ]
      }
    },
    {
      id: 'quote-management',
      title: 'Quote Management and Broker Integration',
      duration: '12 minutes',
      content: {
        synchronization: {
          description: 'FreightFlow\'s revolutionary bidirectional sync ensures quotes flow seamlessly between systems',
          syncProcess: [
            'Quote Creation: Quote generated in unified system',
            'Broker Detection: System identifies current broker session',
            'Dual Storage: Quote saved to both systems',
            'Dashboard Update: Quote appears in broker\'s history',
            'Real-Time Sync: Immediate availability across platforms'
          ]
        },
        brokerDashboardIntegration: {
          enhancedDisplay: [
            'Customer Details: Customer name and tier information',
            'AI Engine Breakdown: Which engines were used',
            'Applied Rules: Unified analysis summary',
            'Professional Display: Base rate, fuel surcharge, total'
          ]
        },
        quoteHistoryManagement: {
          unifiedSystem: [
            'Quote Management Tab: Complete quote history',
            'Search and Filter: Find quotes by customer, date, amount',
            'Export Options: PDF, Excel, and print formats',
            'Status Tracking: Pending, accepted, expired quotes'
          ],
          brokerDashboard: [
            'History Tab: All unified quotes with broker attribution',
            'Enhanced Details: Customer info, engines used, applied rules',
            'Integration Context: Clear indication of unified system origin',
            'Action Buttons: Accept, modify, or archive quotes'
          ]
        }
      }
    },
    {
      id: 'advanced-features',
      title: 'Advanced Features and Best Practices',
      duration: '10 minutes',
      content: {
        optimizationStrategies: [
          {
            strategy: 'Customer Tier Management',
            tactics: [
              'Regular Review: Assess customer performance quarterly',
              'Tier Adjustments: Promote high-performing customers',
              'Volume Analysis: Track shipment frequency and value',
              'Relationship Building: Use tier benefits to strengthen partnerships'
            ]
          },
          {
            strategy: 'Emergency Load Optimization',
            tactics: [
              'Capacity Planning: Maintain emergency equipment availability',
              'Premium Justification: Clearly communicate value proposition',
              'Time Management: Accurate delivery time estimates',
              'Resource Allocation: Balance emergency vs. standard loads'
            ]
          },
          {
            strategy: 'Market Intelligence Usage',
            tactics: [
              'Trend Analysis: Monitor spot rate engine recommendations',
              'Competitive Positioning: Adjust strategies based on market data',
              'Seasonal Planning: Prepare for demand fluctuations',
              'Lane Optimization: Focus on profitable routes'
            ]
          }
        ],
        commonScenarios: [
          {
            scenario: 'High-Value Customer Emergency Load',
            customer: 'Amazon Fulfillment (Platinum - 8% discount)',
            load: '25,000 lbs, Critical urgency',
            solution: 'Emergency + Spot Rate + Volume Discount',
            result: 'Premium pricing with loyalty discount'
          },
          {
            scenario: 'Standard Load with Warehousing',
            customer: 'Walmart Distribution (Gold - 6% discount)',
            load: 'Cross-docking required',
            solution: 'Spot Rate + Volume Discount + Warehousing',
            result: 'Competitive rate with service premium'
          },
          {
            scenario: 'Economy Load for Price-Sensitive Customer',
            customer: 'Home Depot (Silver - 4% discount)',
            load: 'Standard timing, flexible delivery',
            solution: 'Spot Rate + Volume Discount only',
            result: 'Competitive economy pricing'
          }
        ]
      }
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting and Performance Metrics',
      duration: '5 minutes',
      content: {
        commonIssues: [
          {
            issue: 'Quote Not Syncing to Broker Dashboard',
            solutions: [
              'Check Browser Session: Ensure broker is logged in',
              'Verify Storage: Check browser localStorage settings',
              'Refresh Dashboard: Navigate away and back to History tab',
              'Clear Cache: Clear browser cache and reload'
            ]
          },
          {
            issue: 'Pricing Engines Not Triggering',
            solutions: [
              'Verify Input Data: Ensure all required fields are complete',
              'Check Triggers: Confirm urgency and equipment selections',
              'Customer Selection: Verify customer is selected for volume discounts',
              'API Status: Check console for any API errors'
            ]
          },
          {
            issue: 'Incorrect Discount Application',
            solutions: [
              'Customer Tier: Verify correct customer selection',
              'Calculation Order: Discounts apply to final calculated rate',
              'Override Options: Check for manual overrides',
              'System Updates: Ensure latest system version'
            ]
          }
        ],
        performanceMetrics: [
          {
            kpi: 'Quote Acceptance Rate',
            target: '85%+',
            measurement: 'Accepted quotes / Total quotes generated',
            optimization: 'Use spot rate intelligence for better positioning'
          },
          {
            kpi: 'Customer Satisfaction',
            target: '4.5/5.0 average rating',
            measurement: 'Customer feedback on pricing accuracy',
            improvement: 'Consistent pricing and clear communication'
          },
          {
            kpi: 'Profit Margin Optimization',
            target: '15%+ average margin improvement',
            measurement: 'Revenue vs. costs on quoted loads',
            strategy: 'Balance competitive pricing with profitability'
          },
          {
            kpi: 'Quote Generation Speed',
            target: '<60 seconds average quote time',
            measurement: 'Time from customer selection to quote generation',
            efficiency: 'Streamlined workflow and data entry'
          }
        ]
      }
    }
  ],
  assessment: {
    passingScore: 80,
    totalQuestions: 25,
    timeLimit: 30, // minutes
    sampleQuestions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'Which combination of settings would trigger all four pricing engines?',
        options: [
          'Standard urgency, Dry Van equipment, Silver customer',
          'Emergency urgency, Warehousing equipment, Platinum customer',
          'Critical urgency, Reefer equipment, Gold customer',
          'Urgent urgency, Flatbed equipment, Silver customer'
        ],
        correctAnswer: 1,
        explanation: 'Emergency urgency triggers emergency pricing, Warehousing equipment triggers warehousing services, Platinum customer gets volume discount, and spot rate is always active.'
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: 'A Platinum customer (8% discount) has a calculated rate of $2,500. What is the final discounted rate?',
        options: ['$2,300', '$2,200', '$2,320', '$2,400'],
        correctAnswer: 0,
        explanation: '$2,500 × 0.08 = $200 discount, $2,500 - $200 = $2,300'
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: 'Where do unified quotes appear after selection?',
        options: [
          'Only in the quoting system',
          'Only in the broker dashboard',
          'Both quoting system and broker dashboard',
          'Email notification only'
        ],
        correctAnswer: 2,
        explanation: 'Unified quotes automatically sync to both the quoting system and broker dashboard.'
      }
    ],
    practicalScenarios: [
      {
        id: 1,
        scenario: 'Target Logistics (Gold - 6% discount), 15,000 lbs, Los Angeles to Phoenix, Standard urgency, Dry Van',
        task: 'Calculate expected rate and identify which engines apply',
        solution: 'Engines: Spot Rate (always) + Volume Discount (6%). Base calculation with market adjustment. 6% Gold tier discount applied. No emergency or warehousing charges.'
      },
      {
        id: 2,
        scenario: 'Amazon Fulfillment (Platinum - 8% discount), 30,000 lbs, Chicago to Miami, Critical urgency, Expedited equipment',
        task: 'Identify all applicable engines and explain pricing strategy',
        solution: 'All four engines apply. Emergency pricing (25% premium), Spot rate optimization (5% adjustment), Volume discount (8% Platinum). Premium justified by critical timing.'
      }
    ]
  },
  certification: {
    name: 'Professional Quoting Specialist',
    validityPeriod: '24 months',
    renewalRequired: 'Annual refresher',
    benefits: [
      'Digital Certificate: Professional Quoting Specialist credential',
      'FleetFlow University Badge: Display on professional profiles',
      'Continuing Education: Access to advanced quoting strategies',
      'Performance Tracking: Ongoing success metrics and improvement recommendations'
    ]
  },
  resources: {
    quickReference: [
      'Cheat Sheet: One-page workflow summary',
      'Engine Reference: Pricing engine triggers and logic',
      'Customer Tier Guide: Discount rates and qualifications',
      'Troubleshooting Guide: Common issues and solutions'
    ],
    additionalMaterials: [
      'Video Tutorials: Step-by-step workflow demonstrations',
      'Best Practices Library: Industry success stories and case studies',
      'API Documentation: Technical integration guides',
      'System Updates: Regular feature announcements and training'
    ],
    support: {
      email: 'university@fleetflow.com',
      liveChat: 'Available during training sessions',
      phone: '1-800-FLEETFLOW (training hours: 8 AM - 6 PM EST)'
    }
  }
};

export default freightflowQuotingTrainingContent;