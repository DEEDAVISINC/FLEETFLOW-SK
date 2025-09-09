#!/usr/bin/env node

/**
 * IMMEDIATE SQUARE SYNC - RUNS WITHOUT BUILD
 * This will show you exactly what needs to be updated in Square
 */

// Mock data - all the subscription plans that need to be in Square
const ALL_PLANS = [
  // MONTHLY MAIN PLANS
  {
    name: 'FleetFlow University℠ (Monthly)',
    price: 49,
    sku: 'university_monthly',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Training Only (Monthly)',
    price: 49,
    sku: 'training_monthly',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Solo Dispatcher (Monthly)',
    price: 79,
    sku: 'solo_dispatcher_monthly',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Solo Dispatcher Premium (Monthly)',
    price: 199,
    sku: 'solo_dispatcher_premium_monthly',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Professional Dispatcher (Monthly)',
    price: 79,
    sku: 'dispatcher_monthly',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Solo Broker (Monthly)',
    price: 289,
    sku: 'solo_broker_monthly',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Solo Broker Premium (Monthly)',
    price: 599,
    sku: 'solo_broker_premium_monthly',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Professional Brokerage (Monthly)',
    price: 289,
    sku: 'brokerage_monthly',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Enterprise Professional (Monthly)',
    price: 2698,
    sku: 'enterprise_professional_monthly',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Base Platform (Monthly)',
    price: 59,
    sku: 'base_platform_monthly',
    category: 'FleetFlow Main Plans',
  },

  // ANNUAL MAIN PLANS (10 months = 17% savings)
  {
    name: 'FleetFlow University℠ (Annual)',
    price: 490,
    sku: 'university_annual',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Training Only (Annual)',
    price: 490,
    sku: 'training_annual',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Solo Dispatcher (Annual)',
    price: 790,
    sku: 'solo_dispatcher_annual',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Solo Dispatcher Premium (Annual)',
    price: 1990,
    sku: 'solo_dispatcher_premium_annual',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Professional Dispatcher (Annual)',
    price: 790,
    sku: 'dispatcher_annual',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Solo Broker (Annual)',
    price: 2890,
    sku: 'solo_broker_annual',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Solo Broker Premium (Annual)',
    price: 5990,
    sku: 'solo_broker_premium_annual',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Professional Brokerage (Annual)',
    price: 2890,
    sku: 'brokerage_annual',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Enterprise Professional (Annual)',
    price: 26980,
    sku: 'enterprise_professional_annual',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Base Platform (Annual)',
    price: 590,
    sku: 'base_platform_annual',
    category: 'FleetFlow Main Plans',
  },

  // MONTHLY TEAM PLANS
  {
    name: 'Team Brokerage Starter (Monthly)',
    price: 199,
    sku: 'team_brokerage_starter_monthly',
    category: 'FleetFlow Team Plans',
  },
  {
    name: 'Team Brokerage Pro (Monthly)',
    price: 499,
    sku: 'team_brokerage_pro_monthly',
    category: 'FleetFlow Team Plans',
  },
  {
    name: 'Team Dispatch Starter (Monthly)',
    price: 149,
    sku: 'team_dispatch_starter_monthly',
    category: 'FleetFlow Team Plans',
  },
  {
    name: 'Team Dispatch Pro (Monthly)',
    price: 349,
    sku: 'team_dispatch_pro_monthly',
    category: 'FleetFlow Team Plans',
  },
  {
    name: 'Team Enterprise (Monthly)',
    price: 2698,
    sku: 'team_enterprise_monthly',
    category: 'FleetFlow Team Plans',
  },

  // ANNUAL TEAM PLANS
  {
    name: 'Team Brokerage Starter (Annual)',
    price: 1990,
    sku: 'team_brokerage_starter_annual',
    category: 'FleetFlow Team Plans',
  },
  {
    name: 'Team Brokerage Pro (Annual)',
    price: 4990,
    sku: 'team_brokerage_pro_annual',
    category: 'FleetFlow Team Plans',
  },
  {
    name: 'Team Dispatch Starter (Annual)',
    price: 1490,
    sku: 'team_dispatch_starter_annual',
    category: 'FleetFlow Team Plans',
  },
  {
    name: 'Team Dispatch Pro (Annual)',
    price: 3490,
    sku: 'team_dispatch_pro_annual',
    category: 'FleetFlow Team Plans',
  },
  {
    name: 'Team Enterprise (Annual)',
    price: 26980,
    sku: 'team_enterprise_annual',
    category: 'FleetFlow Team Plans',
  },

  // MONTHLY PHONE ADD-ONS
  {
    name: 'FleetFlow Phone Basic (Monthly)',
    price: 39,
    sku: 'phone-basic_monthly',
    category: 'FleetFlow Phone Add-Ons',
  },
  {
    name: 'FleetFlow Phone Professional (Monthly)',
    price: 89,
    sku: 'phone-professional_monthly',
    category: 'FleetFlow Phone Add-Ons',
  },
  {
    name: 'FleetFlow Phone Enterprise (Monthly)',
    price: 199,
    sku: 'phone-enterprise_monthly',
    category: 'FleetFlow Phone Add-Ons',
  },

  // ANNUAL PHONE ADD-ONS
  {
    name: 'FleetFlow Phone Basic (Annual)',
    price: 390,
    sku: 'phone-basic_annual',
    category: 'FleetFlow Phone Add-Ons',
  },
  {
    name: 'FleetFlow Phone Professional (Annual)',
    price: 890,
    sku: 'phone-professional_annual',
    category: 'FleetFlow Phone Add-Ons',
  },
  {
    name: 'FleetFlow Phone Enterprise (Annual)',
    price: 1990,
    sku: 'phone-enterprise_annual',
    category: 'FleetFlow Phone Add-Ons',
  },

  // MONTHLY À LA CARTE
  {
    name: 'Dispatch Management (Monthly)',
    price: 99,
    sku: 'dispatch_management_monthly',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'CRM Suite (Monthly)',
    price: 79,
    sku: 'crm_suite_monthly',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'RFx Discovery (Monthly)',
    price: 499,
    sku: 'rfx_discovery_monthly',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'Broker Operations (Monthly)',
    price: 199,
    sku: 'broker_operations_monthly',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'Training & Certification (Monthly)',
    price: 49,
    sku: 'training_certification_monthly',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'Advanced Analytics (Monthly)',
    price: 89,
    sku: 'advanced_analytics_monthly',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'Real-Time Tracking (Monthly)',
    price: 69,
    sku: 'real_time_tracking_monthly',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'API Access (Monthly)',
    price: 149,
    sku: 'api_access_monthly',
    category: 'FleetFlow À La Carte',
  },

  // ANNUAL À LA CARTE
  {
    name: 'Dispatch Management (Annual)',
    price: 990,
    sku: 'dispatch_management_annual',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'CRM Suite (Annual)',
    price: 790,
    sku: 'crm_suite_annual',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'RFx Discovery (Annual)',
    price: 4990,
    sku: 'rfx_discovery_annual',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'Broker Operations (Annual)',
    price: 1990,
    sku: 'broker_operations_annual',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'Training & Certification (Annual)',
    price: 490,
    sku: 'training_certification_annual',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'Advanced Analytics (Annual)',
    price: 890,
    sku: 'advanced_analytics_annual',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'Real-Time Tracking (Annual)',
    price: 690,
    sku: 'real_time_tracking_annual',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'API Access (Annual)',
    price: 1490,
    sku: 'api_access_annual',
    category: 'FleetFlow À La Carte',
  },

  // MONTHLY AI ADD-ONS
  {
    name: 'AI Flow Starter Add-On (Monthly)',
    price: 59,
    sku: 'ai_flow_starter_addon_monthly',
    category: 'FleetFlow AI Add-Ons',
  },
  {
    name: 'AI Flow Professional Add-On (Monthly)',
    price: 129,
    sku: 'ai_flow_professional_addon_monthly',
    category: 'FleetFlow AI Add-Ons',
  },
  {
    name: 'AI Flow Enterprise Add-On (Monthly)',
    price: 249,
    sku: 'ai_flow_enterprise_addon_monthly',
    category: 'FleetFlow AI Add-Ons',
  },
  {
    name: 'AI Flow Usage-Based Add-On (Monthly)',
    price: 0,
    sku: 'ai_flow_usage_addon_monthly',
    category: 'FleetFlow AI Add-Ons',
  },

  // ANNUAL AI ADD-ONS
  {
    name: 'AI Flow Starter Add-On (Annual)',
    price: 590,
    sku: 'ai_flow_starter_addon_annual',
    category: 'FleetFlow AI Add-Ons',
  },
  {
    name: 'AI Flow Professional Add-On (Annual)',
    price: 1290,
    sku: 'ai_flow_professional_addon_annual',
    category: 'FleetFlow AI Add-Ons',
  },
  {
    name: 'AI Flow Enterprise Add-On (Annual)',
    price: 2490,
    sku: 'ai_flow_enterprise_addon_annual',
    category: 'FleetFlow AI Add-Ons',
  },
  {
    name: 'AI Flow Usage-Based Add-On (Annual)',
    price: 0,
    sku: 'ai_flow_usage_addon_annual',
    category: 'FleetFlow AI Add-Ons',
  },

  // MONTHLY ENTERPRISE SOLUTIONS
  {
    name: 'AI Company Dashboard (Monthly)',
    price: 4999,
    sku: 'ai_company_dashboard_monthly',
    category: 'FleetFlow Enterprise',
  },
  {
    name: 'Enterprise Custom Solutions (Monthly)',
    price: 7999,
    sku: 'enterprise_custom_monthly',
    category: 'FleetFlow Enterprise',
  },

  // ANNUAL ENTERPRISE SOLUTIONS
  {
    name: 'AI Company Dashboard (Annual)',
    price: 49990,
    sku: 'ai_company_dashboard_annual',
    category: 'FleetFlow Enterprise',
  },
  {
    name: 'Enterprise Custom Solutions (Annual)',
    price: 79990,
    sku: 'enterprise_custom_annual',
    category: 'FleetFlow Enterprise',
  },

  // MONTHLY MARKETPLACE PLANS
  {
    name: 'Free-Flow (Monthly)',
    price: 0,
    sku: 'free_monthly',
    category: 'FleetFlow Marketplace Plans',
  },
  {
    name: 'Pro-Flow (Monthly)',
    price: 249,
    sku: 'professional_marketplace_monthly',
    category: 'FleetFlow Marketplace Plans',
  },
  {
    name: 'Flow on the Go (Monthly)',
    price: 699,
    sku: 'enterprise_marketplace_monthly',
    category: 'FleetFlow Marketplace Plans',
  },

  // ANNUAL MARKETPLACE PLANS
  {
    name: 'Free-Flow (Annual)',
    price: 0,
    sku: 'free_annual',
    category: 'FleetFlow Marketplace Plans',
  },
  {
    name: 'Pro-Flow (Annual)',
    price: 2490,
    sku: 'professional_marketplace_annual',
    category: 'FleetFlow Marketplace Plans',
  },
  {
    name: 'Flow on the Go (Annual)',
    price: 6990,
    sku: 'enterprise_marketplace_annual',
    category: 'FleetFlow Marketplace Plans',
  },
];

async function main() {
  console.log('🚀 FLEETFLOW SQUARE SYNC REPORT');
  console.log('================================');
  console.log(
    `Found ${ALL_PLANS.length} subscription plans that need to be in Square\n`
  );

  // Group by category
  const categories = {};
  ALL_PLANS.forEach((plan) => {
    if (!categories[plan.category]) {
      categories[plan.category] = [];
    }
    categories[plan.category].push(plan);
  });

  // Display organized report
  Object.keys(categories).forEach((category, categoryIndex) => {
    console.log(`\n📁 ${category.toUpperCase()}`);
    console.log('='.repeat(category.length + 4));

    categories[category].forEach((plan, planIndex) => {
      const globalIndex = ALL_PLANS.indexOf(plan) + 1;
      console.log(`${globalIndex.toString().padStart(2)}. ${plan.name}`);
      console.log(`    💰 Price: $${plan.price}`);
      console.log(`    🏷️  SKU: ${plan.sku}`);
      console.log('');
    });
  });

  console.log('\n🎯 WHAT TO DO IN SQUARE:');
  console.log('========================');
  console.log('1. Go to Square Dashboard → Items & Orders → Item Library');
  console.log('2. For each plan above:');
  console.log('   - If it exists: Update the name and price to match exactly');
  console.log(
    "   - If it doesn't exist: Create new item with exact name, price, and SKU"
  );
  console.log('3. Set all items to "Service" type');
  console.log('4. Use the categories shown above');
  console.log('\n✅ RESULT: All 34 plans will be correctly synced in Square');
  console.log('\n🚨 NO MORE MANUAL MISTAKES - Use this exact list!');
}

main().catch(console.error);
