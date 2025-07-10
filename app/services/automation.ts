import * as cron from 'node-cron';
import { fleetAI } from './ai';
import { smsService } from './sms';
import { sendInvoiceEmail } from './email';
// Add route generation template integration
import { 
  generateUniversalPickupDocument, 
  generateClaudeStyleRouteDocument,
  generateSamsClubDeliveryDocument,
  generateManufacturingRouteDocument,
  generateAgriculturalRouteDocument
} from '../../src/route-generator/templates/route-generators.js';

// AI Automation Engine for FleetFlow
export class AIAutomationEngine {
  private tasks: Map<string, cron.ScheduledTask> = new Map();
  private isRunning: boolean = false;

  constructor() {
    console.log('🤖 AI Automation Engine initialized');
  }

  // Start all automation tasks
  start() {
    if (this.isRunning) {
      console.log('⚠️ Automation engine already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting AI Automation Engine...');

    // Schedule predictive maintenance checks (daily at 6 AM)
    this.scheduleTask('predictive-maintenance', '0 6 * * *', () => {
      this.runPredictiveMaintenance();
    });

    // Schedule route optimization (every 4 hours during business hours)
    this.scheduleTask('route-optimization', '0 */4 8-18 * * *', () => {
      this.runRouteOptimization();
    });

    // Schedule driver performance analysis (weekly on Monday at 9 AM)
    this.scheduleTask('driver-analysis', '0 9 * * 1', () => {
      this.runDriverAnalysis();
    });

    // Schedule cost optimization analysis (monthly on 1st at 10 AM)
    this.scheduleTask('cost-optimization', '0 10 1 * *', () => {
      this.runCostOptimization();
    });

    // Schedule smart monitoring (every 30 minutes)
    this.scheduleTask('smart-monitoring', '*/30 * * * *', () => {
      this.runSmartMonitoring();
    });

    // NEW: Schedule automated route document generation (daily at 5 AM)
    this.scheduleTask('route-document-generation', '0 5 * * *', () => {
      this.runAutomatedRouteDocumentGeneration();
    });

    // NEW: Schedule driver brief generation (daily at 7 AM)
    this.scheduleTask('driver-brief-generation', '0 7 * * *', () => {
      this.runDriverBriefGeneration();
    });

    console.log('✅ All AI automation tasks scheduled');
  }

  // Stop all automation tasks
  stop() {
    if (!this.isRunning) {
      console.log('⚠️ Automation engine not running');
      return;
    }

    this.tasks.forEach((task, name) => {
      task.stop();
      console.log(`🛑 Stopped task: ${name}`);
    });

    this.tasks.clear();
    this.isRunning = false;
    console.log('⏹️ AI Automation Engine stopped');
  }

  // Schedule a new automation task
  private scheduleTask(name: string, schedule: string, callback: () => void) {
    try {
      const task = cron.schedule(schedule, callback, {
        timezone: "America/New_York"
      });

      this.tasks.set(name, task);
      console.log(`📅 Scheduled task: ${name} (${schedule})`);
    } catch (error) {
      console.error(`❌ Failed to schedule task ${name}:`, error);
    }
  }

  // Run predictive maintenance analysis
  private async runPredictiveMaintenance() {
    console.log('🔧 Running AI Predictive Maintenance Analysis...');
    
    try {
      // Get vehicle data (in real app, this would come from database)
      const vehicles = await this.getVehicleData();
      
      for (const vehicle of vehicles) {
        const analysis = await fleetAI.predictMaintenance(vehicle);
        
        // Send alerts for high-risk vehicles
        if (analysis.riskLevel === 'high') {
          await this.sendMaintenanceAlert(vehicle, analysis);
        }
      }
      
      console.log('✅ Predictive maintenance analysis completed');
    } catch (error) {
      console.error('❌ Predictive maintenance analysis failed:', error);
    }
  }

  // Run route optimization
  private async runRouteOptimization() {
    console.log('🗺️ Running AI Route Optimization...');
    
    try {
      const vehicles = await this.getActiveVehicles();
      const destinations = await this.getPendingDestinations();
      
      if (vehicles.length > 0 && destinations.length > 0) {
        const optimization = await fleetAI.optimizeRoute(vehicles, destinations);
        
        // Notify dispatch team of optimized routes
        await this.sendRouteOptimizationAlert(optimization);
      }
      
      console.log('✅ Route optimization completed');
    } catch (error) {
      console.error('❌ Route optimization failed:', error);
    }
  }

  // Run driver performance analysis
  private async runDriverAnalysis() {
    console.log('👨‍💼 Running AI Driver Performance Analysis...');
    
    try {
      const drivers = await this.getDriverData();
      
      for (const driver of drivers) {
        const analysis = await fleetAI.analyzeDriverPerformance(driver);
        
        // Send performance reports to management
        if (analysis.performanceScore < 70) {
          await this.sendDriverPerformanceAlert(driver, analysis);
        }
      }
      
      console.log('✅ Driver performance analysis completed');
    } catch (error) {
      console.error('❌ Driver performance analysis failed:', error);
    }
  }

  // Run cost optimization analysis
  private async runCostOptimization() {
    console.log('💰 Running AI Cost Optimization Analysis...');
    
    try {
      const fleetData = await this.getFleetData();
      const optimization = await fleetAI.optimizeCosts(fleetData);
      
      // Send cost optimization recommendations to management
      await this.sendCostOptimizationReport(optimization);
      
      console.log('✅ Cost optimization analysis completed');
    } catch (error) {
      console.error('❌ Cost optimization analysis failed:', error);
    }
  }

  // Run smart monitoring
  private async runSmartMonitoring() {
    console.log('🧠 Running Smart Monitoring...');
    
    try {
      // Monitor various fleet metrics
      const alerts = await this.checkForAnomalies();
      
      for (const alert of alerts) {
        const smartNotification = await fleetAI.generateSmartNotification(alert);
        await this.sendSmartAlert(smartNotification);
      }
      
      console.log('✅ Smart monitoring completed');
    } catch (error) {
      console.error('❌ Smart monitoring failed:', error);
    }
  }

  // NEW: Run automated route document generation
  private async runAutomatedRouteDocumentGeneration() {
    console.log('📋 Running Automated Route Document Generation...');
    
    try {
      const pendingRoutes = await this.getPendingRoutes();
      
      for (const route of pendingRoutes) {
        // Auto-detect pickup location type and generate appropriate document
        const routeDocument = await this.generateRouteDocumentByType(route);
        
        // Save generated document and notify relevant parties
        await this.saveAndDistributeRouteDocument(route, routeDocument);
      }
      
      console.log('✅ Automated route document generation completed');
    } catch (error) {
      console.error('❌ Automated route document generation failed:', error);
    }
  }

  // NEW: Run driver brief generation
  private async runDriverBriefGeneration() {
    console.log('👨‍💼 Running Driver Brief Generation...');
    
    try {
      const drivers = await this.getDriverData();
      const routes = await this.getPendingRoutes();
      
      for (const driver of drivers) {
        const driverRoutes = routes.filter(route => route.driverId === driver.id);
        
        if (driverRoutes.length > 0) {
          const driverBrief = await this.generateDriverBrief(driver, driverRoutes);
          await this.sendDriverBrief(driver, driverBrief);
        }
      }
      
      console.log('✅ Driver brief generation completed');
    } catch (error) {
      console.error('❌ Driver brief generation failed:', error);
    }
  }

  // Helper function to send SMS notifications
  private async sendSMSNotification(to: string, message: string, priority: string = 'normal') {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'sms',
          to,
          message,
          priority
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }
  }

  // Helper function to send email notifications
  private async sendEmailNotification(to: string, subject: string, htmlMessage: string, type: string = 'notification') {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'email',
          to,
          subject,
          htmlMessage,
          emailType: type
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  // Send maintenance alert
  private async sendMaintenanceAlert(vehicle: any, analysis: any) {
    const message = `🚨 HIGH MAINTENANCE RISK: Vehicle ${vehicle.name} requires immediate attention. Risk: ${analysis.riskLevel}. Next service due: ${analysis.nextServiceDue}`;
    
    // Log alert (SMS/Email functionality temporarily disabled for TS compatibility)
    console.log('MAINTENANCE ALERT:', message);
    console.log('Vehicle:', vehicle);
    console.log('Analysis:', analysis);
  }

  // Send route optimization alert
  private async sendRouteOptimizationAlert(optimization: any) {
    const message = `🗺️ AI Route Optimization Complete! Efficiency Score: ${optimization.efficiencyScore}%. Estimated savings: $${optimization.totalEstimatedCost}`;
    
    // Log alert (SMS functionality temporarily disabled for TS compatibility)
    console.log('ROUTE OPTIMIZATION ALERT:', message);
    console.log('Optimization:', optimization);
  }

  // Send driver performance alert
  private async sendDriverPerformanceAlert(driver: any, analysis: any) {
    const subject = `📊 Driver Performance Review: ${driver.name}`;
    
    // Log alert (Email functionality temporarily disabled for TS compatibility)
    console.log('DRIVER PERFORMANCE ALERT:', subject);
    console.log('Driver:', driver);
    console.log('Analysis:', analysis);
  }

  // Send cost optimization report
  private async sendCostOptimizationReport(optimization: any) {
    const subject = `💰 Monthly Cost Optimization Report - Potential Savings: ${optimization.totalPotentialSavings}`;
    
    // Log report (Email functionality temporarily disabled for TS compatibility)
    console.log('COST OPTIMIZATION REPORT:', subject);
    console.log('Optimization:', optimization);
  }

  // Send smart alert
  private async sendSmartAlert(notification: any) {
    if (notification.priority === 'critical' || notification.priority === 'high') {
      // Log alert (SMS functionality temporarily disabled for TS compatibility)
      console.log('SMART ALERT:', notification.message);
      console.log('Priority:', notification.priority);
    }
  }

  // Mock data functions (replace with real database calls)
  private async getVehicleData() {
    return [
      {
        id: 'V001',
        name: 'Truck-045',
        type: 'Heavy Truck',
        mileage: 125000,
        lastMaintenance: '2024-05-15',
        fuelEfficiency: 8.5,
        status: 'active'
      },
      {
        id: 'V002',
        name: 'Van-023',
        type: 'Light Van',
        mileage: 89000,
        lastMaintenance: '2024-06-20',
        fuelEfficiency: 12.3,
        status: 'maintenance'
      }
    ];
  }

  // NEW: Get pending routes for automation
  private async getPendingRoutes() {
    return [
      {
        id: 'R001',
        routeNumber: '1',
        routeName: 'Manufacturing Plant Delivery',
        companyName: 'FleetFlow Logistics',
        mcNumber: 'MC-123456',
        driverId: 'D001',
        pickupLocationName: 'Detroit Steel Plant #3',
        pickupAddress: '1234 Industrial Blvd, Detroit, MI 48201',
        locationType: 'Manufacturing Plant',
        rate: 450.00,
        totalMiles: 177,
        confirmationNumber: 'DS-789012',
        status: 'pending_documentation',
        stops: [
          {
            name: 'Construction Site Alpha',
            address: '567 Construction Ave, Warren, MI 48089',
            deliveryTime: '9:00 AM - 10:00 AM',
            items: '10 tons structural steel beams'
          }
        ]
      },
      {
        id: 'R002',
        routeNumber: '2',
        routeName: 'Sam\'s Club Express',
        companyName: 'FleetFlow Logistics',
        mcNumber: 'MC-123456',
        driverId: 'D002',
        pickupLocationName: 'Sam\'s Club #4567',
        pickupAddress: '2000 Sam\'s Club Drive, Southfield, MI 48075',
        locationType: 'Retail Warehouse',
        rate: 425.00,
        totalMiles: 203,
        confirmationNumber: 'SC-445566',
        status: 'pending_documentation'
      }
    ];
  }

  // NEW: Generate route document based on pickup location type
  private async generateRouteDocumentByType(route: any): Promise<string> {
    try {
      // Add calculated fields
      route.ratePerMile = route.rate && route.totalMiles ? 
        (route.rate / route.totalMiles).toFixed(2) : 'TBD';
      route.totalAmount = route.rate || 'TBD';
      route.generatedDate = new Date().toLocaleDateString();
      route.driverName = await this.getDriverNameById(route.driverId);
      route.vehicleNumber = `T-${route.driverId.slice(-3)}`;

      // Generate document based on location type
      switch (route.locationType) {
        case 'Manufacturing Plant':
          return generateManufacturingRouteDocument(route);
        
        case 'Agricultural Facility':
          return generateAgriculturalRouteDocument(route);
        
        case 'Retail Warehouse':
          // Check if it's Sam's Club specifically
          if (route.pickupLocationName?.toLowerCase().includes('sam\'s club')) {
            return generateSamsClubDeliveryDocument(route);
          }
          return generateUniversalPickupDocument(route);
        
        default:
          // Use universal template for any other location type
          return generateUniversalPickupDocument(route);
      }
    } catch (error) {
      console.error('Route document generation failed:', error);
      // Fallback to Claude-style template
      return generateClaudeStyleRouteDocument(route);
    }
  }

  // NEW: Save and distribute route document
  private async saveAndDistributeRouteDocument(route: any, document: string) {
    try {
      // Log the generated document (in real app, save to database)
      console.log(`📋 Route document generated for ${route.routeName}`);
      console.log('Document preview (first 200 chars):', document.substring(0, 200) + '...');
      
      // Send to driver via email/SMS
      const driverEmail = await this.getDriverEmailById(route.driverId);
      if (driverEmail) {
        await this.sendEmailNotification(
          driverEmail,
          `Route Document: ${route.routeName}`,
          this.generateRouteDocumentEmailHTML(route, document),
          'route_document'
        );
      }

      // Notify dispatch
      await this.sendEmailNotification(
        'dispatch@fleetflow.com',
        `Route Document Generated: ${route.routeName}`,
        this.generateRouteDocumentEmailHTML(route, document),
        'route_notification'
      );

    } catch (error) {
      console.error('Failed to save/distribute route document:', error);
    }
  }

  // NEW: Generate driver brief
  private async generateDriverBrief(driver: any, routes: any[]): Promise<string> {
    const totalStops = routes.reduce((sum, route) => sum + (route.stops?.length || 1), 0);
    const totalMiles = routes.reduce((sum, route) => sum + (route.totalMiles || 0), 0);
    const estimatedTime = Math.ceil(totalMiles / 45) + ' hours'; // Estimate based on 45 mph average

    const driverBriefData = {
      routeName: routes.length > 1 ? `${routes.length} Routes` : routes[0]?.routeName,
      deliveryDate: new Date().toLocaleDateString(),
      driverName: driver.name,
      vehicleNumber: `T-${driver.id.slice(-3)}`,
      totalStops: totalStops,
      estimatedTime: estimatedTime,
      totalMiles: totalMiles,
      fuelBudget: Math.ceil(totalMiles * 0.35), // Estimate $0.35 per mile
      emergencyTowing: '(555) TOW-HELP',
      dispatchNumber: '(555) 123-4567',
      supervisorNumber: '(555) 987-6543',
      dispatchPhone: '(555) 123-4567',
      supervisorPhone: '(555) 987-6543',
      customerServicePhone: '(555) 111-2222'
    };

    // Generate simple driver brief template
    return this.generateDriverBriefTemplate(driverBriefData);
  }

  // NEW: Send driver brief
  private async sendDriverBrief(driver: any, brief: string) {
    try {
      console.log(`📱 Driver brief generated for ${driver.name}`);
      
      // Send via SMS for quick mobile access
      const driverPhone = await this.getDriverPhoneById(driver.id);
      if (driverPhone) {
        const briefSummary = `📋 Your route brief is ready! Total stops: ${brief.match(/Total Stops:\*\* (\d+)/)?.[1] || 'N/A'}, Est. time: ${brief.match(/Estimated Time:\*\* ([^*]+)/)?.[1] || 'N/A'}. Full details sent via email.`;
        await this.sendSMSNotification(driverPhone, briefSummary, 'high');
      }

      // Send full brief via email
      const driverEmail = await this.getDriverEmailById(driver.id);
      if (driverEmail) {
        await this.sendEmailNotification(
          driverEmail,
          `Driver Brief: ${new Date().toLocaleDateString()}`,
          this.generateDriverBriefEmailHTML(driver, brief),
          'driver_brief'
        );
      }

    } catch (error) {
      console.error('Failed to send driver brief:', error);
    }
  }

  // Helper methods for driver data
  private async getDriverNameById(driverId: string): Promise<string> {
    const drivers = await this.getDriverData();
    const driver = drivers.find(d => d.id === driverId);
    return driver?.name || 'Driver TBD';
  }

  private async getDriverEmailById(driverId: string): Promise<string> {
    // Mock email - in real app, get from database
    return `driver${driverId.slice(-3)}@fleetflow.com`;
  }

  private async getDriverPhoneById(driverId: string): Promise<string> {
    // Mock phone - in real app, get from database
    return `(555) ${driverId.slice(-3)}-${Math.floor(Math.random() * 9000) + 1000}`;
  }

  private async getActiveVehicles() {
    const vehicles = await this.getVehicleData();
    return vehicles.filter(v => v.status === 'active');
  }

  private async getPendingDestinations() {
    return [
      'New York, NY',
      'Philadelphia, PA',
      'Baltimore, MD',
      'Washington, DC'
    ];
  }

  private async getDriverData() {
    return [
      {
        id: 'D001',
        name: 'John Smith',
        experience: 5,
        safetyRecord: 98,
        deliveryRate: 94,
        fuelEfficiency: 87
      },
      {
        id: 'D002',
        name: 'Sarah Wilson',
        experience: 3,
        safetyRecord: 92,
        deliveryRate: 89,
        fuelEfficiency: 91
      }
    ];
  }

  private async getFleetData() {
    return {
      totalVehicles: 25,
      totalDrivers: 30,
      monthlyFuelCost: 45000,
      monthlyMaintenanceCost: 12000,
      averageUtilization: 78
    };
  }

  private async checkForAnomalies() {
    // Check for various anomalies
    const alerts = [];
    
    // Example: Check fuel efficiency drop
    const vehicles = await this.getVehicleData();
    for (const vehicle of vehicles) {
      if (vehicle.fuelEfficiency < 8.0) {
        alerts.push({
          type: 'fuel_efficiency_drop',
          vehicle: vehicle,
          severity: 'medium'
        });
      }
    }
    
    return alerts;
  }

  // Email template generators for route automation
  private generateRouteDocumentEmailHTML(route: any, document: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">📋 Route Document Generated: ${route.routeName}</h2>
        <div style="background: #eff6ff; padding: 20px; border-radius: 8px;">
          <h3>Route Details:</h3>
          <p><strong>Route Number:</strong> ${route.routeNumber}</p>
          <p><strong>Pickup Location:</strong> ${route.pickupLocationName}</p>
          <p><strong>Total Miles:</strong> ${route.totalMiles}</p>
          <p><strong>Rate:</strong> $${route.rate}</p>
          <p><strong>Confirmation #:</strong> ${route.confirmationNumber}</p>
        </div>
        <div style="background: #f9f9f9; padding: 15px; margin-top: 20px; border-radius: 8px;">
          <h4>Generated Document:</h4>
          <pre style="white-space: pre-wrap; font-family: monospace; font-size: 12px;">${document}</pre>
        </div>
        <p style="margin-top: 20px; color: #666;">
          This document was automatically generated by FleetFlow AI Automation.
        </p>
      </div>
    `;
  }

  private generateDriverBriefEmailHTML(driver: any, brief: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">📱 Driver Brief: ${driver.name}</h2>
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px;">
          <p>Your daily driver brief is ready for review.</p>
          <div style="background: white; padding: 15px; margin-top: 15px; border-radius: 8px; border: 1px solid #d1d5db;">
            <pre style="white-space: pre-wrap; font-family: monospace; font-size: 12px;">${brief}</pre>
          </div>
        </div>
        <div style="background: #fef3c7; padding: 15px; margin-top: 20px; border-radius: 8px;">
          <h4 style="color: #92400e;">⚠️ Important Reminders:</h4>
          <ul style="color: #92400e;">
            <li>Complete vehicle inspection before departure</li>
            <li>Have emergency contacts readily available</li>
            <li>Follow all safety protocols at pickup/delivery locations</li>
            <li>Contact dispatch immediately for any issues</li>
          </ul>
        </div>
        <p style="margin-top: 20px; color: #666;">
          Have a safe and productive day! - FleetFlow AI Automation
        </p>
      </div>
    `;
  }

  // Template generators for route automation
  private generateDriverBriefTemplate(data: any): string {
    return `# Driver Brief: ${data.routeName}
**Date:** ${data.deliveryDate}  
**Driver:** ${data.driverName}  
**Vehicle:** ${data.vehicleNumber}

## ⚡ **CRITICAL INFORMATION**
- **Total Stops:** ${data.totalStops}
- **Estimated Time:** ${data.estimatedTime}
- **Total Miles:** ${data.totalMiles}
- **Fuel Budget:** $${data.fuelBudget}

## 📋 **PRE-DEPARTURE CHECKLIST**
- [ ] Vehicle inspection completed
- [ ] Route downloaded to GPS
- [ ] Customer contact numbers saved
- [ ] Delivery documentation printed
- [ ] Emergency contacts verified

## 🚨 **EMERGENCY PROCEDURES**
1. **Vehicle Breakdown:** Call ${data.emergencyTowing}
2. **Delivery Issues:** Contact ${data.dispatchNumber}
3. **Customer Problems:** Escalate to ${data.supervisorNumber}

## 📞 **TODAY'S CONTACTS**
- **Dispatch:** ${data.dispatchPhone}
- **Supervisor:** ${data.supervisorPhone}
- **Customer Service:** ${data.customerServicePhone}

---
*Generated by FleetFlow AI Automation*`;
  }
}

export const aiAutomation = new AIAutomationEngine();
