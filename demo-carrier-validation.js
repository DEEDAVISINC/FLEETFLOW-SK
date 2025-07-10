#!/usr/bin/env node

/**
 * FleetFlow Carrier Validation & Monitoring Demo
 * 
 * Demonstrates the complete carrier validation and monitoring workflow:
 * 1. FMCSA validation when carriers are uploaded
 * 2. BrokerSnapshot monitoring for ongoing surveillance
 * 3. Integration with load processing
 */

console.log('🚛 FleetFlow Carrier Validation & Monitoring Demo');
console.log('=' .repeat(60));

// Mock System Orchestrator for demo
class MockFleetFlowOrchestrator {
  constructor() {
    this.validatedCarriers = new Map();
    this.config = {
      enableCarrierValidation: true,
      enableCarrierMonitoring: true
    };
  }

  async validateAndAddCarrier(mcNumber, carrierData = {}) {
    console.log(`\n🛡️ Validating new carrier: ${mcNumber}`);
    console.log('📋 Running FMCSA validation...');

    // Simulate FMCSA validation
    const fmcsaData = await this.simulateFMCSAValidation(mcNumber);
    
    const validationResult = {
      mcNumber,
      isValid: false,
      validationErrors: [],
      validatedAt: new Date(),
      monitoringEnabled: false,
      fmcsaData
    };

    // Validate carrier status
    if (!fmcsaData) {
      validationResult.validationErrors.push('FMCSA validation failed - carrier not found');
      console.log('❌ FMCSA validation failed');
      return validationResult;
    }

    if (fmcsaData.operatingStatus === 'OUT_OF_SERVICE') {
      validationResult.validationErrors.push('Carrier is OUT OF SERVICE');
    }

    if (fmcsaData.safetyRating === 'UNSATISFACTORY') {
      validationResult.validationErrors.push('Carrier has UNSATISFACTORY safety rating');
    }

    if (fmcsaData.insuranceStatus === 'INACTIVE') {
      validationResult.validationErrors.push('Carrier insurance is INACTIVE');
    }

    if (validationResult.validationErrors.length === 0) {
      validationResult.isValid = true;
      console.log('✅ FMCSA validation passed');
      
      // Enable BrokerSnapshot monitoring
      console.log('📊 Enabling BrokerSnapshot monitoring...');
      validationResult.monitoringEnabled = true;
      console.log('✅ BrokerSnapshot monitoring enabled');
    } else {
      console.log('❌ FMCSA validation failed:', validationResult.validationErrors.join(', '));
    }

    // Store validated carrier
    this.validatedCarriers.set(mcNumber, validationResult);
    
    return validationResult;
  }

  async simulateFMCSAValidation(mcNumber) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock different carrier scenarios
    const scenarios = {
      'MC-123456': {
        mcNumber: 'MC-123456',
        companyName: 'Elite Transport LLC',
        operatingStatus: 'ACTIVE',
        safetyRating: 'SATISFACTORY',
        insuranceStatus: 'ACTIVE',
        powerUnits: 25,
        drivers: 30,
        lastUpdate: new Date().toISOString()
      },
      'MC-999999': {
        mcNumber: 'MC-999999',
        companyName: 'Risk Carriers Inc',
        operatingStatus: 'ACTIVE',
        safetyRating: 'UNSATISFACTORY',
        insuranceStatus: 'ACTIVE',
        powerUnits: 5,
        drivers: 8,
        lastUpdate: new Date().toISOString()
      },
      'MC-000000': {
        mcNumber: 'MC-000000',
        companyName: 'Out Of Service Transport',
        operatingStatus: 'OUT_OF_SERVICE',
        safetyRating: 'CONDITIONAL',
        insuranceStatus: 'INACTIVE',
        powerUnits: 0,
        drivers: 0,
        lastUpdate: new Date().toISOString()
      }
    };

    return scenarios[mcNumber] || scenarios['MC-123456'];
  }

  async monitorCarriers() {
    console.log('\n📊 Running carrier monitoring checks...');

    const validatedCarriers = Array.from(this.validatedCarriers.values())
      .filter(carrier => carrier.isValid && carrier.monitoringEnabled);

    console.log(`📋 Monitoring ${validatedCarriers.length} carriers...`);

    for (const carrier of validatedCarriers) {
      console.log(`📊 Checking carrier ${carrier.mcNumber}...`);
      
      // Simulate BrokerSnapshot data update
      const updatedData = await this.simulateBrokerSnapshotUpdate(carrier.mcNumber);
      
      // Check for changes
      const alerts = this.analyzeCarrierChanges(carrier, updatedData);
      
      if (alerts.length > 0) {
        console.log(`🚨 Alerts for ${carrier.mcNumber}:`);
        alerts.forEach(alert => console.log(`   • ${alert}`));
      } else {
        console.log(`✅ No alerts for ${carrier.mcNumber}`);
      }

      // Get location update
      console.log(`📍 Location update: Carrier ${carrier.mcNumber} - Last seen: Dallas, TX`);
    }

    console.log('✅ Carrier monitoring completed');
  }

  async simulateBrokerSnapshotUpdate(mcNumber) {
    // Simulate different monitoring scenarios
    const scenarios = {
      'MC-123456': {
        creditScore: 85,
        paymentHistory: 'Good',
        safetyRating: 'SATISFACTORY',
        insuranceStatus: 'ACTIVE',
        operatingStatus: 'ACTIVE'
      },
      'MC-999999': {
        creditScore: 45,
        paymentHistory: 'Poor',
        safetyRating: 'UNSATISFACTORY',
        insuranceStatus: 'ACTIVE',
        operatingStatus: 'CONDITIONAL'
      }
    };

    return scenarios[mcNumber] || scenarios['MC-123456'];
  }

  analyzeCarrierChanges(carrier, newData) {
    const alerts = [];

    // Check credit score
    if (newData.creditScore && newData.creditScore < 70) {
      alerts.push(`Credit score alert: ${newData.creditScore} (below threshold)`);
    }

    // Check for status changes (simplified for demo)
    if (newData.safetyRating === 'UNSATISFACTORY') {
      alerts.push(`Safety rating is UNSATISFACTORY`);
    }

    return alerts;
  }

  async processLoadWithCarrierValidation(loadData) {
    console.log(`\n🚀 Processing load ${loadData.id} with carrier validation...`);

    // Check carrier validation
    if (loadData.mcNumber) {
      const carrierValidation = this.validatedCarriers.get(loadData.mcNumber);
      
      if (!carrierValidation) {
        console.log(`⚠️ Carrier ${loadData.mcNumber} not validated - running validation first`);
        const validation = await this.validateAndAddCarrier(loadData.mcNumber);
        
        if (!validation.isValid) {
          throw new Error(`Cannot process load - Carrier validation failed: ${validation.validationErrors.join(', ')}`);
        }
      } else if (!carrierValidation.isValid) {
        throw new Error(`Cannot process load - Carrier ${loadData.mcNumber} validation failed`);
      } else {
        console.log(`✅ Carrier ${loadData.mcNumber} is validated and approved`);
      }
    }

    console.log('📋 Generating route document...');
    console.log('🗺️ Optimizing route...');
    console.log('📅 Creating schedule...');
    console.log('🤖 Executing AI dispatch...');
    console.log('🛰️ Initializing live tracking...');
    console.log('📧 Sending notifications...');
    
    return {
      id: `WF-${Date.now()}`,
      loadId: loadData.id,
      status: 'dispatched',
      carrierValidated: true
    };
  }
}

async function demonstrateCarrierValidationWorkflow() {
  const orchestrator = new MockFleetFlowOrchestrator();

  console.log('\n🏗️ SCENARIO 1: Valid Carrier Upload');
  console.log('-'.repeat(40));
  
  const validCarrier = await orchestrator.validateAndAddCarrier('MC-123456', {
    companyName: 'Elite Transport LLC',
    contactEmail: 'dispatch@elitetransport.com',
    contactPhone: '(555) 123-4567'
  });

  console.log('\n📊 Validation Result:');
  console.log(`   MC Number: ${validCarrier.mcNumber}`);
  console.log(`   Valid: ${validCarrier.isValid ? '✅ YES' : '❌ NO'}`);
  console.log(`   Monitoring: ${validCarrier.monitoringEnabled ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`   Company: ${validCarrier.fmcsaData?.companyName}`);
  console.log(`   Safety Rating: ${validCarrier.fmcsaData?.safetyRating}`);
  console.log(`   Insurance: ${validCarrier.fmcsaData?.insuranceStatus}`);

  console.log('\n🚨 SCENARIO 2: Invalid Carrier Upload');
  console.log('-'.repeat(40));
  
  const invalidCarrier = await orchestrator.validateAndAddCarrier('MC-999999', {
    companyName: 'Risk Carriers Inc'
  });

  console.log('\n📊 Validation Result:');
  console.log(`   MC Number: ${invalidCarrier.mcNumber}`);
  console.log(`   Valid: ${invalidCarrier.isValid ? '✅ YES' : '❌ NO'}`);
  console.log(`   Errors: ${invalidCarrier.validationErrors.join(', ')}`);

  console.log('\n⛔ SCENARIO 3: Out of Service Carrier');
  console.log('-'.repeat(40));
  
  const oosCarrier = await orchestrator.validateAndAddCarrier('MC-000000', {
    companyName: 'Out Of Service Transport'
  });

  console.log('\n📊 Validation Result:');
  console.log(`   MC Number: ${oosCarrier.mcNumber}`);
  console.log(`   Valid: ${oosCarrier.isValid ? '✅ YES' : '❌ NO'}`);
  console.log(`   Errors: ${oosCarrier.validationErrors.join(', ')}`);

  console.log('\n📊 SCENARIO 4: Ongoing Carrier Monitoring');
  console.log('-'.repeat(40));
  
  await orchestrator.monitorCarriers();

  console.log('\n🚛 SCENARIO 5: Load Processing with Carrier Validation');
  console.log('-'.repeat(40));
  
  try {
    const workflow = await orchestrator.processLoadWithCarrierValidation({
      id: 'LD-2025-001',
      mcNumber: 'MC-123456',
      origin: 'Atlanta, GA',
      destination: 'Miami, FL',
      rate: '$2,500'
    });

    console.log('\n✅ Load processed successfully:');
    console.log(`   Workflow ID: ${workflow.id}`);
    console.log(`   Status: ${workflow.status}`);
    console.log(`   Carrier Validated: ${workflow.carrierValidated ? '✅ YES' : '❌ NO'}`);

  } catch (error) {
    console.log(`\n❌ Load processing failed: ${error.message}`);
  }

  console.log('\n❌ SCENARIO 6: Load Processing with Invalid Carrier');
  console.log('-'.repeat(40));
  
  try {
    await orchestrator.processLoadWithCarrierValidation({
      id: 'LD-2025-002',
      mcNumber: 'MC-999999',
      origin: 'Dallas, TX',
      destination: 'Houston, TX',
      rate: '$1,200'
    });
  } catch (error) {
    console.log(`\n❌ Load processing failed: ${error.message}`);
  }

  console.log('\n📋 SYSTEM SUMMARY:');
  console.log('='.repeat(40));
  console.log(`Total Carriers Processed: ${orchestrator.validatedCarriers.size}`);
  console.log(`Valid Carriers: ${Array.from(orchestrator.validatedCarriers.values()).filter(c => c.isValid).length}`);
  console.log(`Monitoring Enabled: ${Array.from(orchestrator.validatedCarriers.values()).filter(c => c.monitoringEnabled).length}`);
  
  console.log('\n🎯 KEY INTEGRATION POINTS:');
  console.log('• FMCSA validation runs when carriers are uploaded to system');
  console.log('• BrokerSnapshot monitoring enables ongoing carrier surveillance');
  console.log('• Load processing is blocked for invalid/unvalidated carriers');
  console.log('• Real-time alerts notify dispatch of carrier status changes');
  console.log('• Complete audit trail maintained for compliance');

  console.log('\n✅ Carrier Validation & Monitoring Demo Complete!');
}

// Run the demonstration
demonstrateCarrierValidationWorkflow().catch(console.error);
