import FreeSWITCHCallCenter, { LeadGenerationStrategy } from './FreeSWITCHCallCenter';

// Demo configuration
const DEMO_CONFIG = {
  host: 'localhost',
  port: 8021,
  password: 'ClueCon',
  timeout: 5000
};

// Demo function to initialize FreeSWITCH and implement lead generation
export async function demonstrateFreeSWITCHLeadGeneration() {
  console.info('🚀 Starting FreeSWITCH Call Center & Lead Generation Demo');
  console.info('='.repeat(60));
  
  // Initialize FreeSWITCH Call Center
  const callCenter = new FreeSWITCHCallCenter(DEMO_CONFIG);
  
  try {
    // Step 1: Connect to FreeSWITCH
    console.info('📞 Connecting to FreeSWITCH...');
    const connected = await callCenter.connect();
    
    if (!connected) {
      console.info('❌ Failed to connect to FreeSWITCH');
      console.info('💡 Make sure FreeSWITCH is running on localhost:8021');
      return;
    }
    
    console.info('✅ Successfully connected to FreeSWITCH');
    
    // Step 2: Initialize Lead Generation Strategies
    console.info('\n🎯 Initializing Lead Generation Strategies...');
    const leadStrategy = new LeadGenerationStrategy(callCenter);
    
    // Step 3: Demonstrate Government Contract Lead Generation
    console.info('\n🏛️ Implementing Government Contract Strategy...');
    await leadStrategy.implementGovernmentContractStrategy();
    
    // Step 4: Demonstrate Freight Marketplace Lead Generation
    console.info('\n🚛 Implementing Freight Marketplace Strategy...');
    await leadStrategy.implementMarketplaceStrategy();
    
    // Step 5: Demonstrate RFx Intelligence Lead Generation
    console.info('\n📊 Implementing RFx Intelligence Strategy...');
    await leadStrategy.implementRFxIntelligenceStrategy();
    
    // Step 6: Demonstrate Manual Lead Routing
    console.info('\n📞 Demonstrating Manual Lead Routing...');
    await demonstrateManualLeadRouting(callCenter);
    
    // Step 7: Show Call Center Metrics
    console.info('\n📈 Fetching Call Center Metrics...');
    await displayCallCenterMetrics(callCenter);
    
    // Step 8: Demonstrate Lead Sources Analysis
    console.info('\n🔍 Analyzing Lead Sources Performance...');
    await demonstrateLeadSourcesAnalysis();
    
    console.info('\n✨ FreeSWITCH Call Center Demo Complete!');
    console.info('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Demo failed:', error);
  } finally {
    // Cleanup
    await callCenter.disconnect();
    console.info('👋 Disconnected from FreeSWITCH');
  }
}

// Demonstrate manual lead routing
async function demonstrateManualLeadRouting(callCenter: FreeSWITCHCallCenter) {
  const sampleLeads = [
    {
      sourceId: 'gov_contracts',
      companyName: 'Department of Defense',
      contactName: 'John Smith',
      phone: '+1-555-0123',
      email: 'john.smith@defense.gov',
      companySize: 500,
      industry: 'Government',
      location: { state: 'VA', city: 'Arlington' },
      urgency: 'immediate' as const,
      previousInteractions: 0,
      notes: 'Transportation contract opportunity - $2.5M value'
    },
    {
      sourceId: 'freight_marketplace',
      companyName: 'ABC Manufacturing',
      contactName: 'Sarah Johnson',
      phone: '+1-555-0456',
      email: 'sarah@abcmfg.com',
      companySize: 150,
      industry: 'Manufacturing',
      location: { state: 'CA', city: 'Los Angeles' },
      urgency: 'this_week' as const,
      previousInteractions: 2,
      notes: 'Regular freight needs - Electronics to Chicago'
    },
    {
      sourceId: 'inbound_rfx',
      companyName: 'Global Logistics Inc',
      contactName: 'Mike Wilson',
      phone: '+1-555-0789',
      email: 'mike@globallogistics.com',
      companySize: 75,
      industry: 'Logistics',
      location: { state: 'TX', city: 'Houston' },
      urgency: 'this_month' as const,
      previousInteractions: 5,
      notes: 'RFx response follow-up - Annual contract'
    }
  ];
  
  for (const lead of sampleLeads) {
    try {
      const result = await callCenter.routeLeadCall(lead);
      console.info(`  ✅ ${lead.contactName} (${lead.companyName}): ${result.status}`);
      
      if (result.status === 'connected') {
        console.info(`     📞 Connected to agent: ${result.agent}`);
        console.info(`     📋 Scripts: ${result.scripts?.join(', ')}`);
      } else if (result.status === 'queued') {
        console.info(`     ⏳ Queued in: ${result.queue} (position: ${result.position})`);
        console.info(`     ⏱️ Est. wait time: ${result.estimatedWait}s`);
      }
    } catch (error) {
      console.info(`  ❌ Failed to route ${lead.contactName}: ${error}`);
    }
  }
}

// Display call center metrics
async function displayCallCenterMetrics(callCenter: FreeSWITCHCallCenter) {
  try {
    const metrics = await callCenter.getCallCenterMetrics();
    
    console.info('📊 Call Center Performance Metrics:');
    console.info(`  📞 Total Calls: ${metrics.totalCalls}`);
    console.info(`  ✅ Connected Calls: ${metrics.connectedCalls}`);
    console.info(`  ⏱️ Average Call Time: ${metrics.averageCallTime.toFixed(1)} minutes`);
    console.info(`  📈 Conversion Rate: ${(metrics.conversionRate * 100).toFixed(1)}%`);
    console.info(`  ⭐ Lead Quality Score: ${metrics.leadQuality}/100`);
    console.info(`  💰 Monthly Revenue: $${metrics.revenue.toLocaleString()}`);
    console.info(`  📊 Projected Annual: $${(metrics.revenue * 12).toLocaleString()}`);
    
  } catch (error) {
    console.info('❌ Failed to fetch metrics:', error);
  }
}

// Demonstrate lead sources analysis
async function demonstrateLeadSourcesAnalysis() {
  const leadSources = [
    {
      name: 'Government Contracts (SAM.gov)',
      leads: 15,
      conversions: 5,
      avgValue: 250000,
      priority: 'HIGH',
      automation: 'Active'
    },
    {
      name: 'Freight Marketplace',
      leads: 42,
      conversions: 12,
      avgValue: 45000,
      priority: 'HIGH',
      automation: 'Active'
    },
    {
      name: 'RFx Intelligence',
      leads: 23,
      conversions: 5,
      avgValue: 85000,
      priority: 'HIGH',
      automation: 'Active'
    },
    {
      name: 'Web Inquiries',
      leads: 67,
      conversions: 10,
      avgValue: 25000,
      priority: 'MEDIUM',
      automation: 'Learning'
    },
    {
      name: 'Partner Referrals',
      leads: 31,
      conversions: 6,
      avgValue: 35000,
      priority: 'MEDIUM',
      automation: 'Training'
    }
  ];
  
  console.info('🎯 Lead Sources Performance Analysis:');
  leadSources.forEach(source => {
    const conversionRate = (source.conversions / source.leads * 100).toFixed(1);
    const totalValue = source.conversions * source.avgValue;
    
    console.info(`\n  📊 ${source.name}:`);
    console.info(`     📈 Leads: ${source.leads} | Conversions: ${source.conversions} (${conversionRate}%)`);
    console.info(`     💰 Avg Value: $${source.avgValue.toLocaleString()}`);
    console.info(`     🏆 Total Revenue: $${totalValue.toLocaleString()}`);
    console.info(`     ⚡ Priority: ${source.priority} | Automation: ${source.automation}`);
  });
}

// Revenue impact calculator
export function calculateLeadGenerationROI() {
  console.info('\n💰 Lead Generation ROI Calculator:');
  console.info('='.repeat(50));
  
  const scenarios = [
    {
      name: 'Government Contracts',
      leadsPerMonth: 15,
      conversionRate: 0.33,
      avgContractValue: 250000,
      costPerLead: 150
    },
    {
      name: 'Freight Marketplace',
      leadsPerMonth: 42,
      conversionRate: 0.28,
      avgContractValue: 45000,
      costPerLead: 75
    },
    {
      name: 'RFx Intelligence',
      leadsPerMonth: 23,
      conversionRate: 0.22,
      avgContractValue: 85000,
      costPerLead: 100
    }
  ];
  
  let totalMonthlyRevenue = 0;
  let totalMonthlyCost = 0;
  
  scenarios.forEach(scenario => {
    const conversions = scenario.leadsPerMonth * scenario.conversionRate;
    const revenue = conversions * scenario.avgContractValue;
    const cost = scenario.leadsPerMonth * scenario.costPerLead;
    const roi = ((revenue - cost) / cost) * 100;
    
    totalMonthlyRevenue += revenue;
    totalMonthlyCost += cost;
    
    console.info(`\n📊 ${scenario.name}:`);
    console.info(`  📈 Monthly Leads: ${scenario.leadsPerMonth}`);
    console.info(`  ✅ Conversions: ${conversions.toFixed(1)}`);
    console.info(`  💰 Revenue: $${revenue.toLocaleString()}`);
    console.info(`  💸 Cost: $${cost.toLocaleString()}`);
    console.info(`  📊 ROI: ${roi.toFixed(1)}%`);
  });
  
  const totalROI = ((totalMonthlyRevenue - totalMonthlyCost) / totalMonthlyCost) * 100;
  
  console.info(`\n🏆 TOTAL PERFORMANCE:`);
  console.info(`  💰 Monthly Revenue: $${totalMonthlyRevenue.toLocaleString()}`);
  console.info(`  💸 Monthly Cost: $${totalMonthlyCost.toLocaleString()}`);
  console.info(`  📈 Total ROI: ${totalROI.toFixed(1)}%`);
  console.info(`  🎯 Annual Revenue: $${(totalMonthlyRevenue * 12).toLocaleString()}`);
}

// Export demo functions
export {
  demonstrateManualLeadRouting,
  displayCallCenterMetrics,
  demonstrateLeadSourcesAnalysis
};

// Auto-run demo if this file is executed directly
if (require.main === module) {
  demonstrateFreeSWITCHLeadGeneration()
    .then(() => calculateLeadGenerationROI())
    .catch(console.error);
} 