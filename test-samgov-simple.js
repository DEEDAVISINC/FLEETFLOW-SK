#!/usr/bin/env node

// Simple SAM.gov API Test (no dependencies)
const fs = require('fs');

async function testSamGovAPI() {
  // Read .env.local file
  let apiKey = null;
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const match = envContent.match(/SAM_GOV_API_KEY=(.+)/);
    apiKey = match ? match[1].trim() : null;
  } catch (error) {
    console.log('❌ Could not read .env.local file');
    return;
  }

  if (!apiKey || apiKey === 'your_sam_gov_api_key_here') {
    console.log('🔑 SAM.gov API Key Status: NOT CONFIGURED');
    console.log('');
    console.log('📋 TO GET YOUR FREE SAM.gov API KEY:');
    console.log('1. Visit: https://sam.gov/api/registration');
    console.log('2. Fill out the form (2 minutes)');
    console.log('3. Get API key via email');
    console.log('4. Update .env.local: SAM_GOV_API_KEY=your_actual_key');
    console.log('');
    console.log('💰 Once configured, you\'ll have access to $600B+ in government contracts!');
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
    
    console.log(`✅ SUCCESS! Found ${opportunities.length} live government opportunities`);
    
    if (opportunities.length > 0) {
      console.log('\n📋 Sample Live Opportunities:');
      opportunities.slice(0, 3).forEach((opp, index) => {
        console.log(`\n${index + 1}. ${opp.title}`);
        console.log(`   Agency: ${opp.organizationName}`);
        console.log(`   Value: ${opp.awardAmount || 'TBD'}`);
        console.log(`   Deadline: ${opp.responseDeadLine}`);
      });
    }
    
    console.log('\n🎉 LIVE DATA ACTIVE! Your FleetFlow RFP system now shows REAL opportunities!');
    console.log('🔔 Visit http://localhost:3001/freightflow-rfx to see live government contracts!');
    
  } catch (error) {
    console.error('❌ SAM.gov API test failed:', error.message);
    if (error.message.includes('401')) {
      console.log('🔑 Check your API key - it may be invalid or expired');
    }
  }
}

testSamGovAPI();
