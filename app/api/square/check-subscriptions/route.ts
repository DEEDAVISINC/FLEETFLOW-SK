import { NextRequest, NextResponse } from 'next/server';
import { squareService } from '../../../services/SquareService';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking Square API for FleetFlow subscriptions...');

    // Check Square configuration
    const status = squareService.getStatus();
    console.log('📊 Square Configuration:', status);

    if (!status.configured) {
      return NextResponse.json({
        success: false,
        error: 'Square not properly configured. Check environment variables.',
        status,
      });
    }

    // Check for FleetFlow subscription items
    console.log('🔍 Searching for FleetFlow subscription items...');
    const subscriptionCheck = await squareService.checkFleetFlowSubscriptions();

    if (!subscriptionCheck.success) {
      return NextResponse.json({
        success: false,
        error: subscriptionCheck.error,
        status,
      });
    }

    console.log(
      `✅ Found ${subscriptionCheck.foundItems.length} FleetFlow items in Square`
    );

    // Debug: Log first item's variations structure
    if (subscriptionCheck.foundItems.length > 0) {
      const firstItem = subscriptionCheck.foundItems[0];
      console.log('🔍 DEBUG: First item variations structure:');
      console.log('Item name:', firstItem.name);
      console.log('Variations count:', firstItem.variations.length);
      firstItem.variations.forEach((v: any, index: number) => {
        console.log(`Variation ${index + 1}:`, {
          name: v.item_variation_data?.name,
          pricing_type: v.item_variation_data?.pricing_type,
          subscription_plan_data: v.item_variation_data?.subscription_plan_data
            ? 'Present'
            : 'Not present',
        });
      });
    }

    // Check for subscription plans
    console.log('🔍 Checking for Square subscription plans...');
    const plansCheck = await squareService.listSubscriptionPlans();

    // Get all catalog items for additional info
    console.log('🔍 Getting all catalog items...');
    const catalogCheck = await squareService.listCatalogItems({
      types: ['ITEM'],
      limit: 100,
    });

    const result = {
      success: true,
      status,
      subscriptionItems: {
        found: subscriptionCheck.foundItems,
        missing: subscriptionCheck.missingItems,
        total: subscriptionCheck.foundItems.length,
      },
      subscriptionPlans: {
        available: plansCheck.success,
        plans: plansCheck.plans || [],
        error: plansCheck.error,
      },
      catalogItems: {
        success: catalogCheck.success,
        total: catalogCheck.items?.length || 0,
        items: catalogCheck.items || [],
      },
      summary: {
        totalItemsFound: subscriptionCheck.foundItems.length,
        totalItemsMissing: subscriptionCheck.missingItems.length,
        itemsWithMonthly: subscriptionCheck.foundItems.filter(
          (item) => item.hasMonthly
        ).length,
        itemsWithAnnual: subscriptionCheck.foundItems.filter(
          (item) => item.hasAnnual
        ).length,
        subscriptionPlansAvailable: plansCheck.success,
      },
    };

    // Log summary to console
    console.log('\n📊 SQUARE SUBSCRIPTION CHECK SUMMARY:');
    console.log(
      `  • Total FleetFlow items found: ${result.summary.totalItemsFound}`
    );
    console.log(`  • Total items missing: ${result.summary.totalItemsMissing}`);
    console.log(
      `  • Items with monthly billing: ${result.summary.itemsWithMonthly}`
    );
    console.log(
      `  • Items with annual billing: ${result.summary.itemsWithAnnual}`
    );
    console.log(
      `  • Subscription plans available: ${result.summary.subscriptionPlansAvailable}`
    );
    console.log(`  • Total catalog items: ${result.catalogItems.total}`);

    if (subscriptionCheck.missingItems.length > 0) {
      console.log('\n❌ Missing items:');
      subscriptionCheck.missingItems.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item}`);
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Error checking Square API:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
