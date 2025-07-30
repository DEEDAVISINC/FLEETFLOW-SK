// Test script for Shipper Identifier functionality
const EDIService = require('./app/services/EDIService.ts');

// Test shipper identifier generation
console.log('🧪 Testing Shipper Identifier System...\n');

// Test 1: Basic generation
const testId1 = EDIService.generateShipperIdentifier(
  'Walmart Distribution',
  '204',
  '070'
);
console.log('Test 1 - Basic Generation:');
console.log('Company: Walmart Distribution');
console.log('Transaction: 204 (Load Tender)');
console.log('Commodity: 070 (General Freight)');
console.log('Generated ID:', testId1.fullId);
console.log('Valid:', testId1.isValid);
console.log('');

// Test 2: Different company
const testId2 = EDIService.generateShipperIdentifier(
  'Amazon Logistics',
  '210',
  '065'
);
console.log('Test 2 - Different Company:');
console.log('Company: Amazon Logistics');
console.log('Transaction: 210 (Freight Invoice)');
console.log('Commodity: 065 (Auto Parts)');
console.log('Generated ID:', testId2.fullId);
console.log('Valid:', testId2.isValid);
console.log('');

// Test 3: Commodity code mapping
const commodityCode = EDIService.getCommodityCode('electronics');
console.log('Test 3 - Commodity Code Mapping:');
console.log('Commodity: electronics');
console.log('Mapped Code:', commodityCode);
console.log('');

// Test 4: Transaction code mapping
const transactionCode = EDIService.getTransactionCode('load tender');
console.log('Test 4 - Transaction Code Mapping:');
console.log('Transaction: load tender');
console.log('Mapped Code:', transactionCode);
console.log('');

// Test 5: Validation
const testId = 'WMT-204-070-001-20250115';
const isValid = EDIService.validateShipperIdentifier(testId);
console.log('Test 5 - Validation:');
console.log('Test ID:', testId);
console.log('Valid:', isValid);
console.log('');

// Test 6: Parsing
const parsed = EDIService.parseShipperIdentifier(testId);
console.log('Test 6 - Parsing:');
console.log('Parsed ID:', parsed);
console.log('');

console.log('✅ Shipper Identifier tests completed!');
