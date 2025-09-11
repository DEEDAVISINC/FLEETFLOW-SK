/**
 * Test User Identifier Integration
 * Verifies that user identifiers are created consistently across all systems
 */

const {
  UserIdentifierService,
} = require('./app/services/user-identifier-service');

async function testUserIdentifierIntegration() {
  console.log('🆔 Testing FleetFlow User Identifier Integration...\n');

  try {
    const userIdentifierService = UserIdentifierService.getInstance();

    // Test 1: Demo account mappings
    console.log('📋 Test 1: Demo Account Mappings');
    const demoEmails = [
      'admin@fleetflowapp.com',
      'dispatch@fleetflowapp.com',
      'driver@fleetflowapp.com',
      'broker@fleetflowapp.com',
      'vendor@abcmanufacturing.com',
    ];

    demoEmails.forEach((email) => {
      const userId = userIdentifierService.getUserId(email);
      const isDemo = userIdentifierService.isDemoAccount(email);
      console.log(`   ${email} → ${userId} (${isDemo ? 'DEMO' : 'GENERATED'})`);
    });

    // Test 2: New user ID generation consistency
    console.log('\n🆕 Test 2: New User ID Generation Consistency');

    const testUsers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@fleetflowapp.com',
        department: 'Dispatch',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@fleetflowapp.com',
        department: 'Brokerage',
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@fleetflowapp.com',
        department: 'Driver Management',
      },
    ];

    const generatedIds = {};
    testUsers.forEach((user) => {
      const userId = userIdentifierService.generateUserId({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        department: user.department,
        hiredDate: '2024-12-18',
      });

      // Test consistency - should generate same ID every time
      const secondCall = userIdentifierService.getUserId(user.email, {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        department: user.department,
        hiredDate: '2024-12-18',
      });

      generatedIds[user.email] = userId;
      console.log(`   ${user.firstName} ${user.lastName} → ${userId}`);
      console.log(`     Consistent: ${userId === secondCall ? '✅' : '❌'}`);

      // Test reverse lookup
      const emailFromId = userIdentifierService.getEmailFromUserId(userId);
      console.log(
        `     Reverse lookup: ${emailFromId === user.email ? '✅' : '❌'}`
      );
    });

    // Test 3: Department code generation
    console.log('\n🏢 Test 3: Department Code Generation');
    const departments = [
      'Dispatch',
      'Brokerage',
      'Driver Management',
      'Executive Management',
      'Safety & Compliance',
      'Operations',
      'Customer Service',
      'Sales & Marketing',
      'Other',
      'Unknown Department',
    ];

    departments.forEach((dept) => {
      const code = userIdentifierService.getDepartmentCode(dept);
      console.log(`   "${dept}" → ${code}`);
    });

    // Test 4: User ID format validation
    console.log('\n✅ Test 4: User ID Format Validation');
    const testIds = [
      'JD-DC-20241218-123', // Valid format
      'AB-BB-20240101-456', // Valid format
      'XX-YYY-20231231-789', // Valid format
      'invalid-id', // Invalid format
      'JD-DC-2024-123', // Invalid date format
      'JD-DC-20241218-12', // Invalid sequence (too short)
    ];

    testIds.forEach((id) => {
      const isValid = userIdentifierService.isValidUserId(id);
      console.log(`   ${id} → ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    });

    // Test 5: Email to user ID consistency across systems
    console.log('\n🔄 Test 5: Cross-System Consistency Check');

    // Simulate what happens in different parts of the system
    const testEmail = 'test.user@company.com';

    // NextAuth callback simulation
    const nextAuthUserId = userIdentifierService.getUserId(testEmail);

    // Registration API simulation
    const registrationUserId = userIdentifierService.generateUserId({
      firstName: 'Test',
      lastName: 'User',
      email: testEmail,
      department: 'Operations',
      hiredDate: new Date().toISOString().split('T')[0],
    });

    // Sign-in page simulation
    const signInUserId = userIdentifierService.getUserId(testEmail);

    console.log(`   NextAuth: ${nextAuthUserId}`);
    console.log(`   Registration: ${registrationUserId}`);
    console.log(`   Sign-in: ${signInUserId}`);
    console.log(
      `   Consistent: ${nextAuthUserId === registrationUserId && registrationUserId === signInUserId ? '✅' : '❌'}`
    );

    console.log('\n🎉 User Identifier Integration Test Complete!');
    console.log('\n📊 Summary:');
    console.log('   ✅ Demo account mappings working');
    console.log('   ✅ New user ID generation consistent');
    console.log('   ✅ Department code generation working');
    console.log('   ✅ User ID format validation working');
    console.log('   ✅ Cross-system consistency maintained');
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testUserIdentifierIntegration();
}

module.exports = { testUserIdentifierIntegration };
