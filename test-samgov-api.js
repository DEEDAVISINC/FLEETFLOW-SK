#!/usr/bin/env node

// FleetFlow SAM.gov API Test Script
require('dotenv').config({ path: '.env.local' });

async function testSamGovAPI() {
  const apiKey = process.env.SAMGOV_API_KEY;
  
  if (!apiKey || apiKey === 'your_sam_gov_api_key_here') {
    console.log('❌ SAM.gov API key not configured');
    console.log('🔧 Get your FREE key at: https://sam.gov/api/registration');
    console.log('📝 Then update .env.local with: SAMGOV_API_KEY=your_actual_key');
    return;
  }

  console.log('🔍 Testing SAM.gov API connection...');
  
  try {
    const queryParams = new URLSearchParams({
      api_key: apiKey,
      limit: '5',
      title: 'transportation freight trucking',
      ptype: 'o',
      active: 'Yes'
    });

    const response = await fetch(`https://api.sam.gov/opportunities/v2/search?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const opportunities = data.opportunitiesData || [];
    
    console.log(`✅ SUCCESS! Found ${opportunities.length} government opportunities`);
    
    if (opportunities.length > 0) {
      console.log('\n📋 Sample Opportunities:');
      opportunities.slice(0, 3).forEach((opp, index) => {
        console.log(`\n${index + 1}. ${opp.title}`);
        console.log(`   Agency: ${opp.organizationName}`);
        console.log(`   ID: ${opp.noticeId}`);
        console.log(`   Posted: ${opp.postedDate}`);
        console.log(`   Deadline: ${opp.responseDeadLine}`);
      });
    }
    
    console.log('\n🎉 Your FleetFlow app now has access to REAL government contracts worth $600B+!');
    console.log('🔔 Enable RFP notifications to get alerts for new opportunities!');
    
  } catch (error) {
    console.error('❌ SAM.gov API test failed:', error.message);
    console.log('📞 Check your API key and network connection');
  }
}

testSamGovAPI();
