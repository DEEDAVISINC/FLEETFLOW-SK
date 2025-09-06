// Test script for Instagram API integration
// Run with: node test-instagram-api.js

require('dotenv').config();

async function testInstagramAPI() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;

  if (!accessToken || !accountId) {
    console.error('❌ Instagram API not configured');
    console.log('Please add to your .env.local:');
    console.log('INSTAGRAM_ACCESS_TOKEN=your_access_token');
    console.log('INSTAGRAM_ACCOUNT_ID=your_account_id');
    console.log(
      '\nGet these from: https://developers.facebook.com/docs/instagram-api'
    );
    return;
  }

  console.log('🔍 Testing Instagram API connection...');

  try {
    // Test API access
    const response = await fetch(
      `https://graph.instagram.com/${accountId}?fields=id,username&access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log('✅ API connection successful!');
    console.log(`📱 Connected to Instagram account: @${data.username}`);
    console.log(`🆔 Account ID: ${data.id}`);

    console.log('\n🎉 Instagram API setup is ready for FleetFlow marketing!');
    console.log('\n📋 Next steps:');
    console.log(
      '1. Test posting: Update your campaigns to use platform: "instagram"'
    );
    console.log('2. Add media URLs to your posts for best results');
    console.log('3. Monitor posting activity within Instagram limits');
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Verify your Access Token and Account ID are correct');
    console.log('2. Ensure your Instagram account is connected to Facebook');
    console.log(
      '3. Check that you have the right permissions in Meta for Developers'
    );
    console.log(
      '4. Visit: https://developers.facebook.com/docs/instagram-api/getting-started'
    );
  }
}

console.log('🚀 FleetFlow Instagram Marketing API Test\n');
console.log('='.repeat(50));

testInstagramAPI().catch(console.error);

