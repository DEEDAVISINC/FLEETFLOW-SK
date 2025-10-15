import { aiStaffExternalIntegrationService } from './AIStaffExternalIntegrationService';

export class AIStaffExternalIntegrationSeedingService {
  static seedInitialData() {
    console.log('🔗 Initializing AI Staff External Integration...');

    // Test FleetFlow CRM connection on startup
    setTimeout(async () => {
      const connections = aiStaffExternalIntegrationService.getAPIConnections();

      // Test the FleetFlow CRM connection
      for (const connection of connections) {
        if (connection.provider === 'fleetflow_crm') {
          try {
            await aiStaffExternalIntegrationService.testConnection(
              connection.id
            );
            console.log(
              `✅ FleetFlow CRM connection ready: ${connection.name}`
            );
          } catch (error) {
            console.error(
              `❌ FleetFlow CRM connection failed: ${connection.name}`,
              error
            );
          }
        }
      }

      console.log('✅ AI Staff External Integration initialized');
    }, 1000);
  }
}

// Call seeding on module load
AIStaffExternalIntegrationSeedingService.seedInitialData();
