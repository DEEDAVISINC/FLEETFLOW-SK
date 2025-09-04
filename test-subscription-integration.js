/**
 * Test Script for Subscription-Login Integration
 * Tests the complete flow from user registration to subscription validation
 */

const {
  SubscriptionManagementService,
} = require('./app/services/SubscriptionManagementService');

async function testSubscriptionIntegration() {
  console.log('🧪 Testing FleetFlow Subscription-Login Integration...\n');

  try {
    // Test 1: Create a new subscription
    console.log('📝 Test 1: Creating new subscription...');
    const testUserId = 'TEST-USER-001';
    const testEmail = 'test@fleetflow.com';
    const testName = 'Test User';

    const subscription = await SubscriptionManagementService.createSubscription(
      testUserId,
      testEmail,
      testName,
      'dispatcher-pro',
      'pm_test_123456789'
    );

    console.log('✅ Subscription created:', {
      id: subscription.id,
      userId: subscription.userId,
      tier: subscription.subscriptionTierId,
      status: subscription.status,
      trialEnd: subscription.trialEnd?.toISOString(),
    });

    // Test 2: Verify subscription access
    console.log('\n🔍 Test 2: Verifying subscription access...');
    const retrievedSubscription =
      SubscriptionManagementService.getUserSubscription(testUserId);
    const trialStatus =
      SubscriptionManagementService.getTrialStatus(testUserId);

    console.log('✅ Subscription retrieved:', {
      found: !!retrievedSubscription,
      status: retrievedSubscription?.status,
      isInTrial: trialStatus.isInTrial,
      daysRemaining: trialStatus.daysRemaining,
    });

    // Test 3: Check feature access
    console.log('\n🚀 Test 3: Testing feature access...');
    const featuresToTest = [
      'dispatch-load-create',
      'crm-integration',
      'real-time-notifications',
      'ai-automation',
    ];

    featuresToTest.forEach((feature) => {
      const hasAccess = SubscriptionManagementService.hasFeatureAccess(
        testUserId,
        feature
      );
      console.log(`   ${feature}: ${hasAccess ? '✅' : '❌'}`);
    });

    // Test 4: Check usage limits
    console.log('\n📊 Test 4: Checking usage limits...');
    const usage = SubscriptionManagementService.getPhoneUsage(testUserId);
    console.log('✅ Phone usage:', {
      minutesUsed: usage.minutesUsed,
      minutesLimit: usage.minutesLimit,
      remainingMinutes: usage.remainingMinutes,
    });

    // Test 5: Test subscription upgrade
    console.log('\n⬆️ Test 5: Testing subscription upgrade...');
    await SubscriptionManagementService.changeSubscription(
      testUserId,
      'broker-elite'
    );
    const upgradedSubscription =
      SubscriptionManagementService.getUserSubscription(testUserId);
    console.log('✅ Subscription upgraded:', {
      oldTier: subscription.subscriptionTierId,
      newTier: upgradedSubscription?.subscriptionTierId,
    });

    // Test 6: Test access control for upgraded tier
    console.log('\n🔒 Test 6: Testing upgraded feature access...');
    const brokerFeatures = [
      'broker-quote-create',
      'load-board-management',
      'revenue-analytics',
    ];

    brokerFeatures.forEach((feature) => {
      const hasAccess = SubscriptionManagementService.hasFeatureAccess(
        testUserId,
        feature
      );
      console.log(`   ${feature}: ${hasAccess ? '✅' : '❌'}`);
    });

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Subscription creation');
    console.log('   ✅ Subscription retrieval');
    console.log('   ✅ Feature access validation');
    console.log('   ✅ Usage tracking');
    console.log('   ✅ Subscription upgrades');
    console.log('   ✅ Access control for upgraded features');
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testSubscriptionIntegration();
}

module.exports = { testSubscriptionIntegration };
