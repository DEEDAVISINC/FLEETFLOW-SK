// Marketing Content Generator for Manual Posting
// Run with: node generate-marketing-content.js

const fs = require('fs');

function generateMarketingContent() {
  const templates = {
    linkedin: [
      {
        topic: 'Market Update',
        content:
          '🚛 Freight volumes are up 15% this quarter! With supply chain disruptions continuing, smart carriers are turning to platforms like FleetFlow to maximize their loads and revenue.\n\nWhat trends are you seeing in your freight operations?\n\n#Freight #Logistics #FleetFlow',
        hashtags: ['Freight', 'Logistics', 'SupplyChain', 'FleetFlow'],
      },
      {
        topic: 'Success Story',
        content:
          "Just helped a carrier move 50 loads across 12 states this week using FleetFlow's intelligent matching system. That's $25K in additional revenue!\n\nReady to optimize your fleet's performance?\n\n#FleetFlow #CarrierSuccess #Logistics",
        hashtags: ['FleetFlow', 'CarrierSuccess', 'Logistics', 'FreightBroker'],
      },
      {
        topic: 'Industry Insight',
        content:
          "💡 Pro Tip: The key to profitable freight brokerage isn't just finding loads - it's matching the right load to the right carrier at the right time.\n\nFleetFlow does this automatically, saving hours of manual coordination.\n\n#FreightBroker #LogisticsTech #FleetFlow",
        hashtags: [
          'FreightBroker',
          'LogisticsTech',
          'FleetFlow',
          'SupplyChain',
        ],
      },
    ],

    facebook: [
      {
        topic: 'Local Business Support',
        content:
          'Supporting local businesses with reliable freight solutions! Whether you need to ship across town or across the country, FleetFlow connects you with verified carriers.\n\nWhat can we help you move today?\n\n#LocalFreight #SmallBusiness #FleetFlow',
        hashtags: ['LocalFreight', 'SmallBusiness', 'FleetFlow'],
      },
      {
        topic: 'Feature Highlight',
        content:
          "🚛 FleetFlow's real-time tracking keeps you updated on every shipment. No more wondering where your freight is!\n\nTry it free today.\n\n#FleetFlow #FreightTracking #Logistics",
        hashtags: ['FleetFlow', 'FreightTracking', 'Logistics'],
      },
    ],

    instagram: [
      {
        topic: 'Visual Content',
        content:
          'Behind the scenes at FleetFlow HQ! 🚛💪 Our team works around the clock to keep your freight moving smoothly across America.\n\n#FleetFlow #Logistics #FreightLife #TruckLife',
        hashtags: ['FleetFlow', 'Logistics', 'FreightLife', 'TruckLife'],
        caption: 'Add a photo of your fleet or operations',
      },
      {
        topic: 'Infographic',
        content:
          '📊 Freight Industry Stats:\n• 15% volume increase Q4\n• 70% of loads are LTL\n• Technology adoption up 40%\n\nStay ahead with FleetFlow!\n\n#Freight #Logistics #FleetFlow',
        hashtags: ['Freight', 'Logistics', 'FleetFlow', 'IndustryStats'],
        caption: 'Create an infographic with these stats',
      },
    ],
  };

  console.log('🚀 FleetFlow Marketing Content Generator\n');
  console.log('='.repeat(60));

  Object.keys(templates).forEach((platform) => {
    console.log(`\n📱 ${platform.toUpperCase()} POSTS:`);
    console.log('-'.repeat(30));

    templates[platform].forEach((post, index) => {
      console.log(`\n${index + 1}. ${post.topic}`);
      console.log('Content:');
      console.log(`"${post.content}"`);

      if (post.caption) {
        console.log(`\nCaption Note: ${post.caption}`);
      }

      console.log(
        `\nSuggested Hashtags: ${post.hashtags.map((tag) => `#${tag}`).join(' ')}`
      );
      console.log('-'.repeat(50));
    });
  });

  console.log('\n📋 POSTING SCHEDULE:');
  console.log('- Monday: Industry insights (LinkedIn)');
  console.log('- Tuesday: Success stories (LinkedIn)');
  console.log('- Wednesday: Feature highlights (Facebook)');
  console.log('- Thursday: Logistics tips (LinkedIn)');
  console.log('- Friday: Weekend prep (Facebook)');
  console.log('- Saturday: Visual content (Instagram)');
  console.log('- Sunday: Content planning');

  console.log('\n💡 PRO TIPS:');
  console.log('• Always include 2-3 relevant hashtags');
  console.log('• Ask questions to boost engagement');
  console.log('• Use emojis strategically (🚛📦📊)');
  console.log('• Post consistently at the same times');
  console.log('• Engage with comments within 24 hours');

  // Save to file
  const content = Object.keys(templates)
    .map(
      (platform) =>
        `\n=== ${platform.toUpperCase()} ===\n` +
        templates[platform]
          .map(
            (post, i) =>
              `\n${i + 1}. ${post.topic}\n${post.content}\n\nHashtags: ${post.hashtags.join(', ')}`
          )
          .join('\n')
    )
    .join('\n');

  fs.writeFileSync('marketing-content-calendar.txt', content);
  console.log('\n✅ Content saved to: marketing-content-calendar.txt');
}

generateMarketingContent();

