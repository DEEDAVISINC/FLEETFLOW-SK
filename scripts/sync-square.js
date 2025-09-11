#!/usr/bin/env node

/**
 * SQUARE SYNC SCRIPT
 * Run this to automatically fix all the Square subscription items
 *
 * Usage:
 *   npm run sync-square
 *   or
 *   node scripts/sync-square.js
 */

const { squareAutoSync } = require('../app/services/SquareAutoSync');

async function main() {
  console.log('🚀 FLEETFLOW SQUARE AUTO-SYNC');
  console.log('===============================');
  console.log(
    'This will automatically update all subscription plans in Square'
  );
  console.log('to match the correct pricing and descriptions.\n');

  try {
    const results = await squareAutoSync.syncAllPlansToSquare();

    console.log('\n📊 FINAL RESULTS:');
    console.log('==================');
    console.log(`✅ Items Updated: ${results.updated}`);
    console.log(`🆕 Items Created: ${results.created}`);
    console.log(`❌ Errors: ${results.errors.length}`);

    if (results.errors.length > 0) {
      console.log('\n🚨 ERRORS ENCOUNTERED:');
      results.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    if (results.success) {
      console.log('\n🎉 SUCCESS! All Square items have been synced correctly.');
      console.log(
        'Your Square catalog now matches the FleetFlow subscription plans.'
      );
    } else {
      console.log(
        '\n⚠️  PARTIAL SUCCESS: Some items were synced but errors occurred.'
      );
      console.log('Check the errors above and run the sync again if needed.');
    }
  } catch (error) {
    console.error('\n💥 FATAL ERROR:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);


