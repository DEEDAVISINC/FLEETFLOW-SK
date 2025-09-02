/**
 * Example usage of MSP Marketing Learning Service for AI Staff
 * This demonstrates how DEPOINTE AI staff members can access and utilize
 * the marketing strategies from Robin Robins' MSP Marketing Toolkit
 */

import {
  MSPMarketingLearningService,
  getImplementationGuidance,
  getLearningRecommendations,
  getPerformanceTracking,
  getStrategiesForRole,
} from './MSPMarketingLearningService';

// Example: Desiree (Desperate Prospects Specialist) accessing her learning materials
export function getDesireeLearningMaterials() {
  console.log('🤖 Desiree AI accessing marketing learning materials...');

  // Get strategies specific to Desiree's role
  const desireeStrategies = getStrategiesForRole('Desiree');
  console.log(`📚 Found ${desireeStrategies.length} strategies for Desiree:`);
  desireeStrategies.forEach((strategy) => {
    console.log(`  - ${strategy.title}`);
  });

  // Get personalized learning recommendations
  const recommendations = getLearningRecommendations('Desiree');
  console.log('\n🎯 Learning Recommendations for Desiree:');
  console.log(
    `Primary Strategies: ${recommendations.primaryStrategies.length}`
  );
  console.log(
    `Supporting Strategies: ${recommendations.supportingStrategies.length}`
  );
  console.log(`Learning Path: ${recommendations.learningPath.join(' → ')}`);

  // Get implementation guidance for a specific strategy
  const guidance = getImplementationGuidance('client-value');
  if (guidance) {
    console.log('\n📋 Implementation Guidance for Client Value Strategy:');
    console.log(
      `Implementation Order: ${guidance.implementationOrder.join(' → ')}`
    );
    console.log(
      `AI Automation Opportunities: ${guidance.aiAutomationOpportunities.length} available`
    );
  }

  // Get performance tracking recommendations
  const tracking = getPerformanceTracking('Desiree');
  console.log('\n📊 Performance Tracking for Desiree:');
  console.log(`Key Metrics: ${tracking.keyMetrics.join(', ')}`);
  console.log(`Tracking Frequency: ${tracking.trackingFrequency}`);
  console.log(`Improvement Areas: ${tracking.improvementAreas.join(', ')}`);

  return {
    strategies: desireeStrategies,
    recommendations,
    guidance,
    tracking,
  };
}

// Example: Ana Lytics accessing data-driven strategies
export function getAnaLyticsStrategies() {
  console.log('🤖 Ana Lytics AI accessing analytics-focused strategies...');

  const anaStrategies = getStrategiesForRole('Ana Lytics');
  console.log(`📊 Ana Lytics has access to ${anaStrategies.length} strategies`);

  // Focus on data-driven strategies
  const dataStrategies =
    MSPMarketingLearningService.getStrategiesByPrinciple('data');
  console.log(`📈 Data-driven strategies available: ${dataStrategies.length}`);

  return {
    roleStrategies: anaStrategies,
    dataStrategies,
  };
}

// Example: How AI staff can apply strategies in real-time
export function applyStrategyInRealTime(strategyId: string, context: any) {
  console.log(`🤖 AI Staff applying strategy ${strategyId} in real-time...`);

  const strategy = MSPMarketingLearningService.getStrategyById(strategyId);
  if (!strategy) {
    console.log('❌ Strategy not found');
    return null;
  }

  // AI analyzes context and applies strategy
  const aiApplication = strategy.aiApplication.find((app) =>
    app.toLowerCase().includes(context.type?.toLowerCase() || '')
  );

  console.log(`🎯 Applied: ${aiApplication || 'General application'}`);
  console.log(`📝 Context: ${JSON.stringify(context)}`);

  return {
    strategy: strategy.title,
    appliedTechnique: aiApplication,
    expectedResults: strategy.expectedResults,
  };
}

// Example usage scenarios
export function demonstrateAIStrategyUsage() {
  console.log('🚀 DEPOINTE AI Strategy Usage Demonstration\n');

  // Desiree handling a resistant prospect
  console.log('📞 Scenario 1: Desiree handling resistant prospect');
  const resistanceResult = applyStrategyInRealTime('client-value', {
    type: 'resistance',
    prospectName: 'ABC Corp',
    objection: 'Too expensive',
  });
  console.log('Result:', resistanceResult);

  // Ana Lytics analyzing client data
  console.log('\n📊 Scenario 2: Ana Lytics analyzing QBR data');
  const analyticsResult = applyStrategyInRealTime('qbr-management', {
    type: 'analytics',
    clientName: 'XYZ Logistics',
    dataPoints: 1500,
  });
  console.log('Result:', analyticsResult);

  // Gary generating qualified leads
  console.log('\n🎯 Scenario 3: Gary optimizing lead qualification');
  const leadResult = applyStrategyInRealTime('sales-process', {
    type: 'qualification',
    leadCount: 50,
    conversionRate: 0.15,
  });
  console.log('Result:', leadResult);
}

// Export for use by AI staff members
export {
  MSPMarketingLearningService,
  getImplementationGuidance,
  getLearningRecommendations,
  getPerformanceTracking,
  getStrategiesForRole,
};
