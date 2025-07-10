// Heavy Haul Permit Demo Script
// Demonstrates the complete heavy haul permit workflow

const { HeavyHaulPermitService } = require('./app/services/heavy-haul-permit-service');

class HeavyHaulDemo {
  constructor() {
    this.permitService = new HeavyHaulPermitService();
  }

  async runCompleteDemo() {
    console.log('🚛 FleetFlow Heavy Haul Permit System Demo');
    console.log('==========================================\n');

    // Demo Load 1: Oversize Construction Equipment
    await this.demoOversizeLoad();
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Demo Load 2: Overweight Steel Shipment
    await this.demoOverweightLoad();
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Demo Load 3: Both Oversize and Overweight
    await this.demoBothOversizeOverweight();
  }

  async demoOversizeLoad() {
    console.log('📋 DEMO 1: Oversize Construction Equipment');
    console.log('------------------------------------------');

    const oversizeLoad: HeavyHaulLoad = {
      id: 'HH001',
      dimensions: {
        length: 85,    // feet (exceeds 75' limit)
        width: 12,     // feet (exceeds 8.5' limit)
        height: 13,    // feet (within limit)
        weight: 75000  // pounds (within 80,000 limit)
      },
      route: {
        origin: {
          city: 'Houston',
          state: 'TX',
          coordinates: [-95.3698, 29.7604]
        },
        destination: {
          city: 'Atlanta',
          state: 'GA',
          coordinates: [-84.3880, 33.7490]
        },
        waypoints: [
          {
            city: 'New Orleans',
            state: 'LA',
            coordinates: [-90.0715, 29.9511]
          },
          {
            city: 'Birmingham',
            state: 'AL',
            coordinates: [-86.8025, 33.5207]
          }
        ]
      },
      equipment: {
        tractor: 'Kenworth T880',
        trailer: 'RGN (Removable Gooseneck)',
        axleConfiguration: '3-axle tractor, 4-axle trailer'
      },
      cargo: {
        description: 'Caterpillar 349 Excavator',
        type: 'construction'
      },
      timeline: {
        pickupDate: new Date('2025-07-15'),
        deliveryDate: new Date('2025-07-18'),
        travelDays: 3
      }
    };

    // Step 1: Analyze load requirements
    console.log('🔍 Step 1: Analyzing Load Requirements...');
    const analysis = this.permitService.analyzeLoad(oversizeLoad);
    
    console.log(`   Load Type: ${analysis.permitType.toUpperCase()}`);
    console.log(`   Permits Required: ${analysis.requiresPermits ? 'YES' : 'NO'}`);
    console.log(`   States Affected: ${analysis.affectedStates.join(', ')}`);
    console.log(`   Estimated Cost: $${analysis.estimatedCost}`);
    console.log(`   Processing Time: ${analysis.timeline}\n`);

    if (!analysis.requiresPermits) {
      console.log('✅ No permits required - load can proceed normally');
      return;
    }

    // Step 2: Get permit requirements
    console.log('📄 Step 2: Getting Permit Requirements...');
    const requirements = this.permitService.getPermitRequirements(
      analysis.affectedStates, 
      analysis.permitType
    );

    requirements.forEach(req => {
      console.log(`   ${req.state}: $${req.cost} - ${req.processingTime}`);
      console.log(`      Contact: ${req.contactInfo.phone}`);
      console.log(`      Portal: ${req.applicationUrl}`);
      if (req.requirements.escort) {
        console.log(`      ⚠️  Escort vehicle required`);
      }
      if (req.requirements.pilotCar) {
        console.log(`      ⚠️  Pilot car required`);
      }
    });

    // Step 3: Create applications
    console.log('\n📝 Step 3: Creating Permit Applications...');
    const applications = await this.permitService.createPermitApplications(
      oversizeLoad, 
      requirements
    );

    applications.forEach(app => {
      console.log(`   ${app.state}: Application ${app.id} created`);
      console.log(`      Status: ${app.status}`);
      console.log(`      Cost: $${app.cost}`);
    });

    // Step 4: Submit applications
    console.log('\n🚀 Step 4: Submitting Applications...');
    for (const app of applications) {
      const result = await this.permitService.submitPermitApplication(app);
      console.log(`   ${app.state}: ${result.success ? 'SUCCESS' : 'FAILED'}`);
      console.log(`      ${result.message}`);
      if (result.confirmationNumber) {
        console.log(`      Confirmation: ${result.confirmationNumber}`);
      }
    }

    // Step 5: Track status
    console.log('\n📊 Step 5: Tracking Permit Status...');
    for (const app of applications) {
      const status = await this.permitService.trackPermitStatus(app);
      console.log(`   ${app.state}: ${status.status.toUpperCase()}`);
      if (status.estimatedApproval) {
        console.log(`      Estimated Approval: ${status.estimatedApproval.toDateString()}`);
      }
    }

    // Step 6: Get summary
    console.log('\n📋 Step 6: Permit Summary...');
    const summary = this.permitService.getPermitSummary(oversizeLoad, applications);
    console.log(`   Total Permit Cost: $${summary.totalCost}`);
    console.log(`   Ready States: ${summary.readyStates.join(', ') || 'None yet'}`);
    console.log(`   Pending States: ${summary.pendingStates.join(', ') || 'None'}`);
    console.log(`   Ready to Travel: ${summary.timeToTravel ? 'YES' : 'Waiting for permits'}`);
  }

  private async demoOverweightLoad() {
    console.log('📋 DEMO 2: Overweight Steel Shipment');
    console.log('------------------------------------');

    const overweightLoad: HeavyHaulLoad = {
      id: 'HH002',
      dimensions: {
        length: 70,     // feet (within limit)
        width: 8,       // feet (within limit)
        height: 12,     // feet (within limit)
        weight: 95000   // pounds (exceeds 80,000 limit)
      },
      route: {
        origin: {
          city: 'Pittsburgh',
          state: 'PA',
          coordinates: [-79.9959, 40.4406]
        },
        destination: {
          city: 'Detroit',
          state: 'MI',
          coordinates: [-83.0458, 42.3314]
        }
      },
      equipment: {
        tractor: 'Peterbilt 579',
        trailer: 'Lowboy',
        axleConfiguration: '3-axle tractor, 3-axle trailer'
      },
      cargo: {
        description: 'Steel I-Beams',
        type: 'steel'
      },
      timeline: {
        pickupDate: new Date('2025-07-20'),
        deliveryDate: new Date('2025-07-21'),
        travelDays: 1
      }
    };

    const analysis = this.permitService.analyzeLoad(overweightLoad);
    console.log(`🔍 Analysis: ${analysis.permitType.toUpperCase()} permit required`);
    console.log(`   States: ${analysis.affectedStates.join(', ')}`);
    console.log(`   Cost: $${analysis.estimatedCost}`);
    console.log(`   Time: ${analysis.timeline}`);

    // Quick permit workflow simulation
    if (analysis.requiresPermits) {
      const requirements = this.permitService.getPermitRequirements(
        analysis.affectedStates, 
        analysis.permitType
      );
      
      console.log('\n📄 Permit Requirements:');
      requirements.forEach(req => {
        console.log(`   ${req.state}: $${req.cost} - ${req.processingTime}`);
      });

      console.log('\n✅ Permits can be processed in parallel for faster approval');
    }
  }

  private async demoBothOversizeOverweight() {
    console.log('📋 DEMO 3: Oversized AND Overweight Equipment');
    console.log('---------------------------------------------');

    const superLoad: HeavyHaulLoad = {
      id: 'HH003',
      dimensions: {
        length: 95,     // feet (exceeds limit)
        width: 14,      // feet (exceeds limit)
        height: 15,     // feet (exceeds limit)
        weight: 120000  // pounds (exceeds limit)
      },
      route: {
        origin: {
          city: 'Los Angeles',
          state: 'CA',
          coordinates: [-118.2437, 34.0522]
        },
        destination: {
          city: 'Phoenix',
          state: 'AZ',
          coordinates: [-112.0740, 33.4484]
        }
      },
      equipment: {
        tractor: 'Kenworth C500',
        trailer: 'Multi-axle heavy haul trailer',
        axleConfiguration: '4-axle tractor, 8-axle trailer'
      },
      cargo: {
        description: 'Industrial Generator - 500kW',
        type: 'machinery'
      },
      timeline: {
        pickupDate: new Date('2025-08-01'),
        deliveryDate: new Date('2025-08-03'),
        travelDays: 2
      }
    };

    const analysis = this.permitService.analyzeLoad(superLoad);
    console.log(`🔍 Analysis: SUPER LOAD - ${analysis.permitType.toUpperCase()}`);
    console.log(`   This is a complex load requiring special handling`);
    console.log(`   States: ${analysis.affectedStates.join(', ')}`);
    console.log(`   Cost: $${analysis.estimatedCost}`);
    console.log(`   Time: ${analysis.timeline}`);

    const requirements = this.permitService.getPermitRequirements(
      analysis.affectedStates, 
      analysis.permitType
    );

    console.log('\n⚠️  Special Requirements for Super Loads:');
    requirements.forEach(req => {
      console.log(`   ${req.state}:`);
      console.log(`      Cost: $${req.cost}`);
      console.log(`      Escort Required: ${req.requirements.escort ? 'YES' : 'NO'}`);
      console.log(`      Pilot Car Required: ${req.requirements.pilotCar ? 'YES' : 'NO'}`);
      console.log(`      Restrictions: ${req.restrictions.slice(0, 2).join(', ')}`);
    });

    console.log('\n💡 Recommendations for Super Loads:');
    console.log('   • Start permit process 7-10 days in advance');
    console.log('   • Coordinate with state DOT for route survey');
    console.log('   • Arrange escort vehicles and pilot cars');
    console.log('   • Plan for off-peak travel times');
    console.log('   • Consider route alternatives to avoid restrictions');
  }

  // Cost comparison utility
  showCostComparison() {
    console.log('\n💰 HEAVY HAUL PERMIT COST COMPARISON');
    console.log('====================================');
    
    console.log('Traditional Manual Process:');
    console.log('   • Internal staff time: 4-6 hours @ $25/hour = $100-150');
    console.log('   • State permit fees: $25-85 per state');
    console.log('   • Potential delays/errors: $500-2000');
    console.log('   • Total per load: $625-2235\n');
    
    console.log('FleetFlow Automated System:');
    console.log('   • Processing time: 15 minutes');
    console.log('   • State permit fees: $25-85 per state (same)');
    console.log('   • Error prevention: Minimal delays');
    console.log('   • System cost: $0 (built into FleetFlow)');
    console.log('   • Total per load: $25-85 (just permit fees)\n');
    
    console.log('💡 Savings: 70-90% cost reduction + 95% time savings');
  }

  // Integration benefits
  showIntegrationBenefits() {
    console.log('\n🔗 FLEETFLOW INTEGRATION BENEFITS');
    console.log('=================================');
    
    console.log('Automated Workflow:');
    console.log('   ✅ Auto-detect oversize/overweight loads');
    console.log('   ✅ Instant permit requirement analysis');
    console.log('   ✅ Automated state applications where possible');
    console.log('   ✅ Real-time status tracking');
    console.log('   ✅ Cost integration with load pricing');
    console.log('   ✅ Compliance tracking and renewals\n');
    
    console.log('Business Benefits:');
    console.log('   📈 Accept more heavy haul loads confidently');
    console.log('   💰 Accurate permit cost estimates');
    console.log('   ⚡ Faster customer quotes');
    console.log('   🎯 Reduced compliance risk');
    console.log('   📊 Complete permit audit trail');
    console.log('   🚀 Scalable as business grows');
  }
}

// Run the demo
async function runDemo() {
  const demo = new HeavyHaulDemo();
  
  await demo.runCompleteDemo();
  demo.showCostComparison();
  demo.showIntegrationBenefits();
  
  console.log('\n🎉 Heavy Haul Permit System Demo Complete!');
  console.log('Ready to integrate with FleetFlow dispatch system.');
}

// Export for use in FleetFlow
export { HeavyHaulDemo, runDemo };

// Run demo if called directly
if (require.main === module) {
  runDemo().catch(console.error);
}
