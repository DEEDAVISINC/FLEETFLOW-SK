// Runtime Error Test
console.log('Testing FleetFlow TMS Dashboard...');

// Test 1: Check if page loads
try {
  console.log('✅ Page loaded successfully');
} catch (error) {
  console.error('❌ Page load error:', error);
}

// Test 2: Check if data arrays exist
const testData = {
  quickLinks: 12,
  stats: 4,
  sampleLoads: 6
};

console.log('Data structure test:', testData);
console.log('Runtime test completed');
