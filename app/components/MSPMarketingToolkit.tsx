'use client';

import { useMemo, useState } from 'react';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  author: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  keyTakeaways: string[];
  strategies: Strategy[];
  completed: boolean;
}

interface Strategy {
  id: string;
  title: string;
  description: string;
  implementationSteps: string[];
  expectedResults: string[];
  commonMistakes: string[];
  successStories: string[];
}

const mspMarketingStrategies: Strategy[] = [
  {
    id: 'client-value',
    title: 'Strategy #1: Make Every Client More Valuable',
    description:
      'Transform existing clients into higher-value revenue streams through strategic upselling and cross-selling opportunities.',
    implementationSteps: [
      'Audit current client portfolios to identify upgrade opportunities',
      'Create value-based pricing models for premium services',
      'Develop client segmentation based on revenue potential',
      'Implement automated upgrade suggestions in client portals',
      'Establish value demonstration sessions with existing clients',
    ],
    expectedResults: [
      '20-30% increase in average client revenue',
      'Improved client retention through increased value perception',
      'Reduced dependency on new client acquisition',
      'Higher profit margins from premium services',
    ],
    commonMistakes: [
      'Focusing only on price instead of value',
      'Not having clear upgrade paths defined',
      'Failing to communicate value effectively',
      'Not tracking client usage patterns for opportunities',
    ],
    successStories: [
      'Adam Spencer: Closed $14,722 in new MRR in first 90 days',
      'Tom Andrulis: Grew from $1.7M to $36M in 12 months',
      'Charles Swihart: Transformed break-fix shop into profitable MSP',
    ],
  },
  {
    id: 'qbr-management',
    title: 'Strategy #2: Conduct QBRs And Proper Account Management',
    description:
      'Implement Quarterly Business Reviews and systematic account management to deepen client relationships and identify opportunities.',
    implementationSteps: [
      'Establish quarterly review schedule with all clients',
      'Create standardized QBR templates and agendas',
      'Train staff on effective account management techniques',
      'Implement CRM system for tracking client interactions',
      'Develop proactive communication protocols',
    ],
    expectedResults: [
      'Improved client satisfaction and retention',
      'Increased identification of upsell opportunities',
      'Stronger client relationships and loyalty',
      'Better understanding of client business needs',
    ],
    commonMistakes: [
      'Treating QBRs as sales pitches rather than value discussions',
      'Not preparing adequately for each review',
      'Failing to follow up on commitments made',
      'Not involving the right stakeholders from both sides',
    ],
    successStories: [
      'Rob Faulkner: 93% revenue increase through peer group learning',
      'Ari Ganbold: 233% growth in 2 years through community support',
      'Gene Painter: Successful contract win through Launch Academy training',
    ],
  },
  {
    id: 'referrals',
    title: 'Strategy #3: Fuel Referrals',
    description:
      'Build systematic referral generation programs to leverage satisfied clients for new business growth.',
    implementationSteps: [
      'Create formal referral program with incentives',
      'Develop referral tracking and reward systems',
      'Train staff on asking for referrals effectively',
      'Implement testimonial and case study collection',
      'Create referral marketing materials',
    ],
    expectedResults: [
      'Consistent flow of qualified leads',
      'Higher conversion rates from referred prospects',
      'Reduced cost per acquisition',
      'Stronger client relationships through advocacy',
    ],
    commonMistakes: [
      'Not having a systematic approach to asking for referrals',
      'Failing to follow up on referral leads promptly',
      'Not providing value to clients who refer others',
      'Being too aggressive in asking for referrals',
    ],
    successStories: [
      'Stuart Bryan: 4x business growth through peer accountability',
      'Ed Wenzel: Added $485K to sales pipeline through commitment',
      'Julio Lopez: Moved from $500K to $2.4M through consistent implementation',
    ],
  },
  {
    id: 'pricing-strategy',
    title: 'Strategy #4: Raise Your Prices Without Raising Prices',
    description:
      'Implement value-based pricing strategies that justify premium rates through enhanced service delivery.',
    implementationSteps: [
      'Audit current pricing against value delivered',
      'Develop value-based pricing models',
      'Create premium service tiers with clear differentiation',
      'Implement usage-based or performance-based pricing',
      'Communicate value effectively to justify pricing',
    ],
    expectedResults: [
      'Higher profit margins without losing clients',
      'Improved service quality and client satisfaction',
      'Better resource allocation and business focus',
      'Positioning as premium provider in market',
    ],
    commonMistakes: [
      'Raising prices without improving value delivery',
      'Not having clear justification for premium pricing',
      'Failing to communicate value effectively',
      'Not being prepared to lose price-sensitive clients',
    ],
    successStories: [
      'Multiple TMT clients achieved profitability through price optimization',
      'MSPs moved from struggling to stable businesses',
      'Growth from $500K to $2.4M through proper pricing strategies',
    ],
  },
  {
    id: 'sales-process',
    title: 'Strategy #5: Improve Your Sales Process',
    description:
      'Develop systematic, repeatable sales processes that consistently convert leads into clients.',
    implementationSteps: [
      'Document current sales process and identify gaps',
      'Create standardized sales playbooks and scripts',
      'Implement lead qualification criteria',
      'Establish clear follow-up procedures',
      'Train sales team on new processes',
    ],
    expectedResults: [
      'Higher conversion rates from leads to clients',
      'More consistent sales performance',
      'Reduced sales cycle time',
      'Better lead quality and qualification',
    ],
    commonMistakes: [
      'Not having a defined sales process',
      'Failing to follow the process consistently',
      'Not training sales team adequately',
      'Not tracking and measuring sales metrics',
    ],
    successStories: [
      'TMT clients consistently achieve higher conversion rates',
      'Systematic approach leads to predictable revenue growth',
      'Professional sales processes result in 4x business growth',
    ],
  },
  {
    id: 'follow-up',
    title: 'Strategy #6: Implement A No-Fail Follow-Up System',
    description:
      'Create systematic follow-up processes that ensure no lead falls through the cracks.',
    implementationSteps: [
      'Implement automated lead nurturing sequences',
      'Create standardized follow-up procedures',
      'Establish clear responsibilities for follow-up',
      'Implement CRM tracking for all interactions',
      'Develop escalation procedures for stalled leads',
    ],
    expectedResults: [
      'Higher lead conversion rates',
      'Reduced lead leakage and lost opportunities',
      'More consistent pipeline management',
      'Better relationship building with prospects',
    ],
    commonMistakes: [
      'Not having systematic follow-up procedures',
      'Failing to track all lead interactions',
      'Not having clear ownership of leads',
      'Being too aggressive or not aggressive enough',
    ],
    successStories: [
      '50% response rate on drip campaigns',
      'Successful contract wins through consistent follow-up',
      '$485K added to sales pipeline through proper systems',
    ],
  },
];

export default function MSPMarketingToolkit() {
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<string>>(
    new Set()
  );

  const markCompleted = (strategyId: string) => {
    setCompletedModules((prev) => {
      if (prev.has(strategyId)) {
        return prev; // No change needed
      }
      const newSet = new Set(prev);
      newSet.add(strategyId);
      return newSet;
    });
  };

  const selectedStrategyData = useMemo(() => {
    return mspMarketingStrategies.find((s) => s.id === selectedStrategy);
  }, [selectedStrategy]);

  return (
    <div className='space-y-6'>
      <div className='rounded-lg bg-gradient-to-r from-purple-900 to-blue-900 p-6 text-white'>
        <div className='mb-4 flex items-center space-x-3'>
          <span className='text-3xl'>📈</span>
          <div>
            <h2 className='text-2xl font-bold'>
              MSP Marketing Mastery Toolkit
            </h2>
            <p className='text-purple-200'>
              6 Ways To Double Sales Without Marketing Spend
            </p>
          </div>
        </div>
        <p className='leading-relaxed text-gray-300'>
          Based on Robin Robins' proven strategies for MSPs and IT services
          firms. These techniques have helped thousands of businesses grow from
          struggling to successful through systematic implementation of sales
          and marketing best practices.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Strategy Overview */}
        <div className='space-y-4 lg:col-span-1'>
          <h3 className='text-lg font-semibold text-gray-900'>
            🚀 Core Strategies
          </h3>
          <div className='space-y-3'>
            {mspMarketingStrategies.map((strategy) => (
              <div
                key={strategy.id}
                className={`cursor-pointer rounded-lg border p-4 transition-all ${
                  selectedStrategy === strategy.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                } ${completedModules.has(strategy.id) ? 'border-green-300 bg-green-50' : ''}`}
                onClick={() => setSelectedStrategy(strategy.id)}
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <h4 className='mb-1 font-medium text-gray-900'>
                      {strategy.title}
                    </h4>
                    <p className='line-clamp-2 text-sm text-gray-600'>
                      {strategy.description}
                    </p>
                  </div>
                  {completedModules.has(strategy.id) && (
                    <span className='text-lg text-green-600'>✅</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Details */}
        <div className='lg:col-span-2'>
          {selectedStrategyData ? (
            <div className='space-y-6'>
              <div className='rounded-lg border border-gray-200 bg-white p-6'>
                <div className='mb-4 flex items-center justify-between'>
                  <h3 className='text-xl font-bold text-gray-900'>
                    {selectedStrategyData.title}
                  </h3>
                  {!completedModules.has(selectedStrategyData.id) && (
                    <button
                      onClick={() => markCompleted(selectedStrategyData.id)}
                      className='rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600'
                    >
                      Mark Complete
                    </button>
                  )}
                  {completedModules.has(selectedStrategyData.id) && (
                    <span className='rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-800'>
                      ✅ Completed
                    </span>
                  )}
                </div>

                <p className='mb-6 leading-relaxed text-gray-700'>
                  {selectedStrategyData.description}
                </p>

                {/* Implementation Steps */}
                <div className='mb-6'>
                  <h4 className='mb-3 flex items-center text-lg font-semibold text-gray-900'>
                    <span className='mr-2 text-blue-500'>📋</span>
                    Implementation Steps
                  </h4>
                  <ol className='space-y-2'>
                    {selectedStrategyData.implementationSteps.map(
                      (step, index) => (
                        <li key={index} className='flex items-start space-x-3'>
                          <span className='mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white'>
                            {index + 1}
                          </span>
                          <span className='text-gray-700'>{step}</span>
                        </li>
                      )
                    )}
                  </ol>
                </div>

                {/* Expected Results */}
                <div className='mb-6'>
                  <h4 className='mb-3 flex items-center text-lg font-semibold text-gray-900'>
                    <span className='mr-2 text-green-500'>🎯</span>
                    Expected Results
                  </h4>
                  <ul className='space-y-2'>
                    {selectedStrategyData.expectedResults.map(
                      (result, index) => (
                        <li key={index} className='flex items-center space-x-3'>
                          <span className='text-green-500'>✓</span>
                          <span className='text-gray-700'>{result}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Common Mistakes */}
                <div className='mb-6'>
                  <h4 className='mb-3 flex items-center text-lg font-semibold text-gray-900'>
                    <span className='mr-2 text-red-500'>⚠️</span>
                    Common Mistakes to Avoid
                  </h4>
                  <ul className='space-y-2'>
                    {selectedStrategyData.commonMistakes.map(
                      (mistake, index) => (
                        <li key={index} className='flex items-center space-x-3'>
                          <span className='text-red-500'>✗</span>
                          <span className='text-gray-700'>{mistake}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Success Stories */}
                <div>
                  <h4 className='mb-3 flex items-center text-lg font-semibold text-gray-900'>
                    <span className='mr-2 text-purple-500'>🏆</span>
                    Success Stories
                  </h4>
                  <div className='space-y-3'>
                    {selectedStrategyData.successStories.map((story, index) => (
                      <div
                        key={index}
                        className='rounded-lg border border-purple-200 bg-purple-50 p-4'
                      >
                        <p className='text-sm text-purple-800'>{story}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-8 text-center'>
              <div className='mb-4 text-4xl'>🎯</div>
              <h3 className='mb-2 text-xl font-semibold text-gray-900'>
                Select a Strategy to Learn
              </h3>
              <p className='text-gray-600'>
                Choose from the 6 proven strategies on the left to dive deep
                into implementation details, success stories, and best
                practices.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Summary */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>
          📊 Learning Progress
        </h3>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6'>
          {mspMarketingStrategies.map((strategy) => (
            <div
              key={strategy.id}
              className={`rounded-lg border-2 p-3 text-center ${
                completedModules.has(strategy.id)
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div
                className={`mb-2 text-2xl ${
                  completedModules.has(strategy.id)
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                {completedModules.has(strategy.id) ? '✅' : '📚'}
              </div>
              <div className='text-xs font-medium text-gray-700'>
                {strategy.title.split(':')[0]}
              </div>
            </div>
          ))}
        </div>
        <div className='mt-4 text-center'>
          <p className='text-gray-600'>
            Completed: {completedModules.size} of{' '}
            {mspMarketingStrategies.length} strategies (
            {Math.round(
              (completedModules.size / mspMarketingStrategies.length) * 100
            )}
            %)
          </p>
        </div>
      </div>
    </div>
  );
}
