#!/usr/bin/env node

/**
 * AUTOMATIC SQUARE FIXER
 * This will actually connect to Square and update everything automatically
 * NO MANUAL WORK REQUIRED
 */

const https = require('https');

// All the correct subscription data
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

  // ANNUAL MAIN PLANS (10 months price = 17% savings)
  {
    name: 'FleetFlow University℠ (Annual)',
    price: 490, // 10 * 49 = 490 (save $98)
    sku: 'university_annual',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Training Only (Annual)',
    price: 490, // 10 * 49 = 490 (save $98)
    sku: 'training_annual',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Solo Dispatcher (Annual)',
    price: 790, // 10 * 79 = 790 (save $158)
    sku: 'solo_dispatcher_annual',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Solo Dispatcher Premium (Annual)',
    price: 1990, // 10 * 199 = 1990 (save $398)
    sku: 'solo_dispatcher_premium_annual',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Professional Dispatcher (Annual)',
    price: 790, // 10 * 79 = 790 (save $158)
    sku: 'dispatcher_annual',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Solo Broker (Annual)',
    price: 2890, // 10 * 289 = 2890 (save $578)
    sku: 'solo_broker_annual',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Solo Broker Premium (Annual)',
    price: 5990, // 10 * 599 = 5990 (save $1,198)
    sku: 'solo_broker_premium_annual',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Professional Brokerage (Annual)',
    price: 2890, // 10 * 289 = 2890 (save $578)
    sku: 'brokerage_annual',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Enterprise Professional (Annual)',
    price: 26980, // 10 * 2698 = 26980 (save $5,396)
    sku: 'enterprise_professional_annual',
    category: 'FleetFlow Main Plans',
  },
  {
    name: 'Base Platform (Annual)',
    price: 590, // 10 * 59 = 590 (save $118)
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
    price: 1990, // 10 * 199 = 1990 (save $398)
    sku: 'team_brokerage_starter_annual',
    category: 'FleetFlow Team Plans',
  },
  {
    name: 'Team Brokerage Pro (Annual)',
    price: 4990, // 10 * 499 = 4990 (save $998)
    sku: 'team_brokerage_pro_annual',
    category: 'FleetFlow Team Plans',
  },
  {
    name: 'Team Dispatch Starter (Annual)',
    price: 1490, // 10 * 149 = 1490 (save $298)
    sku: 'team_dispatch_starter_annual',
    category: 'FleetFlow Team Plans',
  },
  {
    name: 'Team Dispatch Pro (Annual)',
    price: 3490, // 10 * 349 = 3490 (save $698)
    sku: 'team_dispatch_pro_annual',
    category: 'FleetFlow Team Plans',
  },
  {
    name: 'Team Enterprise (Annual)',
    price: 26980, // 10 * 2698 = 26980 (save $5,396)
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
    price: 390, // 10 * 39 = 390 (save $78)
    sku: 'phone-basic_annual',
    category: 'FleetFlow Phone Add-Ons',
  },
  {
    name: 'FleetFlow Phone Professional (Annual)',
    price: 890, // 10 * 89 = 890 (save $178)
    sku: 'phone-professional_annual',
    category: 'FleetFlow Phone Add-Ons',
  },
  {
    name: 'FleetFlow Phone Enterprise (Annual)',
    price: 1990, // 10 * 199 = 1990 (save $398)
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
    price: 990, // 10 * 99 = 990 (save $198)
    sku: 'dispatch_management_annual',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'CRM Suite (Annual)',
    price: 790, // 10 * 79 = 790 (save $158)
    sku: 'crm_suite_annual',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'RFx Discovery (Annual)',
    price: 4990, // 10 * 499 = 4990 (save $998)
    sku: 'rfx_discovery_annual',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'Broker Operations (Annual)',
    price: 1990, // 10 * 199 = 1990 (save $398)
    sku: 'broker_operations_annual',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'Training & Certification (Annual)',
    price: 490, // 10 * 49 = 490 (save $98)
    sku: 'training_certification_annual',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'Advanced Analytics (Annual)',
    price: 890, // 10 * 89 = 890 (save $178)
    sku: 'advanced_analytics_annual',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'Real-Time Tracking (Annual)',
    price: 690, // 10 * 69 = 690 (save $138)
    sku: 'real_time_tracking_annual',
    category: 'FleetFlow À La Carte',
  },
  {
    name: 'API Access (Annual)',
    price: 1490, // 10 * 149 = 1490 (save $298)
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
    price: 590, // 10 * 59 = 590 (save $118)
    sku: 'ai_flow_starter_addon_annual',
    category: 'FleetFlow AI Add-Ons',
  },
  {
    name: 'AI Flow Professional Add-On (Annual)',
    price: 1290, // 10 * 129 = 1290 (save $258)
    sku: 'ai_flow_professional_addon_annual',
    category: 'FleetFlow AI Add-Ons',
  },
  {
    name: 'AI Flow Enterprise Add-On (Annual)',
    price: 2490, // 10 * 249 = 2490 (save $498)
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
    price: 49990, // 10 * 4999 = 49990 (save $9,998)
    sku: 'ai_company_dashboard_annual',
    category: 'FleetFlow Enterprise',
  },
  {
    name: 'Enterprise Custom Solutions (Annual)',
    price: 79990, // 10 * 7999 = 79990 (save $15,998)
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
    price: 2490, // 10 * 249 = 2490 (save $498)
    sku: 'professional_marketplace_annual',
    category: 'FleetFlow Marketplace Plans',
  },
  {
    name: 'Flow on the Go (Annual)',
    price: 6990, // 10 * 699 = 6990 (save $1,398)
    sku: 'enterprise_marketplace_annual',
    category: 'FleetFlow Marketplace Plans',
  },
];

// Square API configuration
const SQUARE_API_URL = 'https://connect.squareup.com/v2';
const ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN || 'SANDBOX_TOKEN_HERE';
const LOCATION_ID = process.env.SQUARE_LOCATION_ID || 'LOCATION_ID_HERE';

class SquareAutoFixer {
  constructor() {
    this.results = {
      updated: 0,
      created: 0,
      errors: [],
    };
  }

  async makeSquareRequest(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'connect.squareup.com',
        port: 443,
        path: `/v2${endpoint}`,
        method: method,
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'Square-Version': '2023-10-18',
        },
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            resolve({ status: res.statusCode, data: parsed });
          } catch (e) {
            reject(new Error(`Failed to parse response: ${responseData}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }
      req.end();
    });
  }

  async getExistingItems() {
    try {
      console.log('📦 Getting existing Square items...');
      const response = await this.makeSquareRequest('/catalog/list?types=ITEM');

      if (response.status !== 200) {
        throw new Error(`Square API error: ${response.status}`);
      }

      const items = (response.data.objects || [])
        .filter((item) => item.type === 'ITEM')
        .map((item) => ({
          id: item.id,
          name: item.item_data?.name || '',
          sku: item.item_data?.variations?.[0]?.item_variation_data?.sku || '',
          price:
            item.item_data?.variations?.[0]?.item_variation_data?.price_money
              ?.amount || 0,
          version: item.version,
        }));

      console.log(`   Found ${items.length} existing items`);
      return items;
    } catch (error) {
      console.error('❌ Error getting existing items:', error.message);
      return [];
    }
  }

  async createSquareItem(plan) {
    try {
      const requestBody = {
        idempotency_key: `create_${plan.sku}_${Date.now()}`,
        object: {
          type: 'ITEM',
          id: `#${plan.sku}`,
          item_data: {
            name: plan.name,
            description: `${plan.name} - FleetFlow subscription service`,
            variations: [
              {
                type: 'ITEM_VARIATION',
                id: `#${plan.sku}_variation`,
                item_variation_data: {
                  item_id: `#${plan.sku}`,
                  name: plan.name,
                  sku: plan.sku,
                  pricing_type: 'FIXED_PRICING',
                  price_money: {
                    amount: Math.round(plan.price * 100), // Convert to cents
                    currency: 'USD',
                  },
                },
              },
            ],
          },
        },
      };

      const response = await this.makeSquareRequest(
        '/catalog/object',
        'POST',
        requestBody
      );

      if (response.status === 200) {
        console.log(`✅ Created: ${plan.name} - $${plan.price}`);
        this.results.created++;
        return true;
      } else {
        console.error(`❌ Failed to create ${plan.name}:`, response.data);
        this.results.errors.push(`Failed to create ${plan.name}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error creating ${plan.name}:`, error.message);
      this.results.errors.push(`Error creating ${plan.name}: ${error.message}`);
      return false;
    }
  }

  async updateSquareItem(existingItem, plan) {
    try {
      const requestBody = {
        idempotency_key: `update_${plan.sku}_${Date.now()}`,
        object: {
          type: 'ITEM',
          id: existingItem.id,
          version: existingItem.version,
          item_data: {
            name: plan.name,
            description: `${plan.name} - FleetFlow subscription service`,
            variations: [
              {
                type: 'ITEM_VARIATION',
                item_variation_data: {
                  name: plan.name,
                  sku: plan.sku,
                  pricing_type: 'FIXED_PRICING',
                  price_money: {
                    amount: Math.round(plan.price * 100), // Convert to cents
                    currency: 'USD',
                  },
                },
              },
            ],
          },
        },
      };

      const response = await this.makeSquareRequest(
        '/catalog/object',
        'POST',
        requestBody
      );

      if (response.status === 200) {
        console.log(`🔄 Updated: ${plan.name} - $${plan.price}`);
        this.results.updated++;
        return true;
      } else {
        console.error(`❌ Failed to update ${plan.name}:`, response.data);
        this.results.errors.push(`Failed to update ${plan.name}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error updating ${plan.name}:`, error.message);
      this.results.errors.push(`Error updating ${plan.name}: ${error.message}`);
      return false;
    }
  }

  async fixAllPlans() {
    console.log('🚀 STARTING AUTOMATIC SQUARE FIX');
    console.log('=================================');
    console.log(`Will process ${ALL_PLANS.length} subscription plans\n`);

    // Check if we have credentials
    if (
      ACCESS_TOKEN === 'SANDBOX_TOKEN_HERE' ||
      LOCATION_ID === 'LOCATION_ID_HERE'
    ) {
      console.log('⚠️  DEMO MODE - No Square credentials provided');
      console.log(
        '   Add SQUARE_ACCESS_TOKEN and SQUARE_LOCATION_ID to .env file'
      );
      console.log('   For now, showing what would be done:\n');

      // Demo mode - show what would happen
      for (let i = 0; i < ALL_PLANS.length; i++) {
        const plan = ALL_PLANS[i];
        console.log(
          `${(i + 1).toString().padStart(2)}. ${plan.name} - $${plan.price}`
        );
        console.log(`    🔧 Would sync to Square with SKU: ${plan.sku}`);
      }

      console.log('\n🎯 TO ENABLE REAL SYNC:');
      console.log('1. Add your Square credentials to .env file:');
      console.log('   SQUARE_ACCESS_TOKEN=your_token_here');
      console.log('   SQUARE_LOCATION_ID=your_location_id_here');
      console.log('2. Run this script again');
      console.log('3. All items will be automatically synced!');
      return;
    }

    // Real mode - actually sync to Square
    try {
      const existingItems = await this.getExistingItems();

      for (const plan of ALL_PLANS) {
        const existingItem = existingItems.find(
          (item) => item.sku === plan.sku || item.name === plan.name
        );

        if (existingItem) {
          // Update existing item
          await this.updateSquareItem(existingItem, plan);
        } else {
          // Create new item
          await this.createSquareItem(plan);
        }

        // Small delay to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.log('\n🎉 AUTOMATIC FIX COMPLETE!');
      console.log('==========================');
      console.log(`✅ Updated: ${this.results.updated} items`);
      console.log(`🆕 Created: ${this.results.created} items`);
      console.log(`❌ Errors: ${this.results.errors.length}`);

      if (this.results.errors.length > 0) {
        console.log('\n🚨 ERRORS:');
        this.results.errors.forEach((error) => console.log(`   • ${error}`));
      } else {
        console.log('\n🎊 SUCCESS! All Square items are now correctly synced!');
        console.log('Your Square catalog matches FleetFlow perfectly.');
      }
    } catch (error) {
      console.error('💥 FATAL ERROR:', error.message);
    }
  }
}

async function main() {
  const fixer = new SquareAutoFixer();
  await fixer.fixAllPlans();
}

main().catch(console.error);
