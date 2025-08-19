'use client';

import { FleetFlowSystemOrchestrator, IntegratedWorkflow } from './system-orchestrator';
import fleetFlowNotificationManager, { FleetFlowNotification } from './FleetFlowNotificationManager';
import webSocketNotificationService from './WebSocketNotificationService';

// 🔄 WORKFLOW NOTIFICATION TYPES
export interface WorkflowNotificationConfig {
  workflowId: string;
  stepId: string;
  notificationType: FleetFlowNotification['type'];
  priority: FleetFlowNotification['priority'];
  targetPortals: FleetFlowNotification['targetPortals'];
  targetUsers?: string[];
  channels: FleetFlowNotification['channels'];
  template: {
    title: string;
    message: string;
    actions?: FleetFlowNotification['actions'];
  };
  conditions?: {
    onSuccess?: boolean;
    onError?: boolean;
    onTimeout?: boolean;
    onStart?: boolean;
    onComplete?: boolean;
  };
}

// 📋 PREDEFINED WORKFLOW NOTIFICATION CONFIGURATIONS
const WORKFLOW_NOTIFICATIONS: WorkflowNotificationConfig[] = [
  // Load Assignment Workflow
  {
    workflowId: 'load_assignment',
    stepId: 'ai_dispatch',
    notificationType: 'load_assignment',
    priority: 'high',
    targetPortals: ['driver', 'dispatch'],
    channels: { inApp: true, sms: true, email: false, push: true },
    template: {
      title: '🚛 New Load Assignment',
      message: 'Load {{loadId}} has been assigned to you. Route: {{origin}} → {{destination}}. Rate: {{rate}}',
      actions: [
        { id: 'accept', label: 'Accept Load', action: 'accept_load', style: 'primary' },
        { id: 'decline', label: 'Decline', action: 'decline_load', style: 'secondary' }
      ]
    },
    conditions: { onSuccess: true }
  },
  {
    workflowId: 'load_assignment',
    stepId: 'live_tracking',
    notificationType: 'eta_update',
    priority: 'normal',
    targetPortals: ['vendor', 'dispatch'],
    channels: { inApp: true, sms: false, email: true, push: false },
    template: {
      title: '📍 Tracking Initiated',
      message: 'Live GPS tracking started for Load {{loadId}}. ETA: {{estimatedDelivery}}',
      actions: [
        { id: 'track', label: 'View Live Tracking', action: 'open_tracking', url: '/tracking?load={{loadId}}', style: 'primary' }
      ]
    },
    conditions: { onSuccess: true }
  },
  {
    workflowId: 'load_assignment',
    stepId: 'document_generation',
    notificationType: 'document_required',
    priority: 'urgent',
    targetPortals: ['driver', 'dispatch'],
    channels: { inApp: true, sms: true, email: true, push: true },
    template: {
      title: '📄 Documents Required',
      message: 'Load {{loadId}} requires document signatures: {{documentTypes}}. Please complete within 2 hours.',
      actions: [
        { id: 'sign', label: 'Sign Documents', action: 'open_documents', url: '/documents/{{loadId}}', style: 'primary' }
      ]
    },
    conditions: { onStart: true }
  },

  // Compliance Monitoring
  {
    workflowId: 'compliance_check',
    stepId: 'safety_violation',
    notificationType: 'compliance_alert',
    priority: 'critical',
    targetPortals: ['admin', 'dispatch', 'driver'],
    channels: { inApp: true, sms: true, email: true, push: true },
    template: {
      title: '🚨 Safety Violation Detected',
      message: 'Critical safety violation: {{violationType}}. Driver: {{driverName}}. Immediate action required.',
      actions: [
        { id: 'investigate', label: 'Investigate', action: 'open_compliance', style: 'danger' },
        { id: 'contact', label: 'Contact Driver', action: 'call_driver', style: 'primary' }
      ]
    },
    conditions: { onError: true }
  },

  // Financial Alerts
  {
    workflowId: 'payment_processing',
    stepId: 'payment_failed',
    notificationType: 'payment_alert',
    priority: 'urgent',
    targetPortals: ['admin', 'vendor'],
    channels: { inApp: true, sms: false, email: true, push: false },
    template: {
      title: '💳 Payment Processing Failed',
      message: 'Payment of {{amount}} for Load {{loadId}} failed. Reason: {{errorMessage}}',
      actions: [
        { id: 'retry', label: 'Retry Payment', action: 'retry_payment', style: 'primary' },
        { id: 'review', label: 'Review Details', action: 'open_billing', style: 'secondary' }
      ]
    },
    conditions: { onError: true }
  },

  // Emergency Alerts
  {
    workflowId: 'emergency_response',
    stepId: 'accident_detected',
    notificationType: 'emergency_alert',
    priority: 'critical',
    targetPortals: ['admin', 'dispatch'],
    channels: { inApp: true, sms: true, email: true, push: true },
    template: {
      title: '🚨 EMERGENCY: Accident Detected',
      message: 'Potential accident detected for Driver {{driverName}} on Load {{loadId}}. Location: {{location}}',
      actions: [
        { id: 'emergency', label: 'Call 911', action: 'call_emergency', style: 'danger' },
        { id: 'contact', label: 'Contact Driver', action: 'call_driver', style: 'primary' },
        { id: 'track', label: 'Track Location', action: 'open_tracking', style: 'secondary' }
      ]
    },
    conditions: { onError: true }
  },

  // Load Opportunities
  {
    workflowId: 'load_matching',
    stepId: 'high_value_opportunity',
    notificationType: 'load_opportunity',
    priority: 'high',
    targetPortals: ['driver', 'dispatch'],
    channels: { inApp: true, sms: true, email: false, push: true },
    template: {
      title: '💰 High-Value Load Opportunity',
      message: 'Premium load available: {{rate}} for {{miles}} miles. {{origin}} → {{destination}}. Expires in {{timeRemaining}}',
      actions: [
        { id: 'bid', label: 'Submit Bid', action: 'submit_bid', style: 'success' },
        { id: 'details', label: 'View Details', action: 'open_load', style: 'primary' }
      ]
    },
    conditions: { onSuccess: true }
  },

  // Warehouse Operations
  {
    workflowId: 'warehouse_management',
    stepId: 'capacity_warning',
    notificationType: 'warehouse_alert',
    priority: 'high',
    targetPortals: ['admin', 'dispatch', 'vendor'],
    channels: { inApp: true, sms: false, email: true, push: false },
    template: {
      title: '🏭 Warehouse Capacity Warning',
      message: 'Warehouse {{warehouseName}} at {{capacityPercent}}% capacity. Consider rerouting new shipments.',
      actions: [
        { id: 'reroute', label: 'View Alternatives', action: 'open_routing', style: 'primary' },
        { id: 'schedule', label: 'Schedule Pickup', action: 'schedule_pickup', style: 'secondary' }
      ]
    },
    conditions: { onSuccess: true }
  },

  // System Health
  {
    workflowId: 'system_monitoring',
    stepId: 'performance_degradation',
    notificationType: 'system_alert',
    priority: 'urgent',
    targetPortals: ['admin'],
    channels: { inApp: true, sms: true, email: true, push: false },
    template: {
      title: '⚙️ System Performance Alert',
      message: 'System performance degraded: {{metric}} at {{value}}. Component: {{component}}',
      actions: [
        { id: 'investigate', label: 'Investigate', action: 'open_monitoring', style: 'primary' },
        { id: 'restart', label: 'Restart Service', action: 'restart_service', style: 'danger' }
      ]
    },
    conditions: { onError: true }
  }
];

// 🔧 SYSTEM ORCHESTRATOR NOTIFICATION INTEGRATION
export class SystemOrchestratorNotificationIntegration {
  private static instance: SystemOrchestratorNotificationIntegration;
  private systemOrchestrator: FleetFlowSystemOrchestrator;
  private isInitialized: boolean = false;
  private workflowSubscriptions: Map<string, Function> = new Map();

  private constructor() {
    this.systemOrchestrator = new FleetFlowSystemOrchestrator();
    this.initializeIntegration();
  }

  public static getInstance(): SystemOrchestratorNotificationIntegration {
    if (!SystemOrchestratorNotificationIntegration.instance) {
      SystemOrchestratorNotificationIntegration.instance = new SystemOrchestratorNotificationIntegration();
    }
    return SystemOrchestratorNotificationIntegration.instance;
  }

  // 🚀 INITIALIZE INTEGRATION
  private async initializeIntegration(): Promise<void> {
    try {
      console.log('🔄 Initializing System Orchestrator Notification Integration...');

      // Subscribe to system orchestrator events
      await this.subscribeToWorkflowEvents();
      
      // Connect to WebSocket for real-time updates
      this.setupWebSocketIntegration();

      // Set up monitoring for system health
      this.setupSystemHealthMonitoring();

      this.isInitialized = true;
      console.log('✅ System Orchestrator Notification Integration initialized');

      // Send initialization notification
      await fleetFlowNotificationManager.createNotification({
        type: 'system_alert',
        priority: 'normal',
        title: '🔗 Notification System Online',
        message: 'FleetFlow unified notification system connected to workflow orchestration',
        channels: { inApp: true, sms: false, email: false, push: false },
        targetPortals: ['admin'],
        metadata: {
          systemComponent: 'NotificationIntegration',
          status: 'initialized',
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('❌ Failed to initialize notification integration:', error);
    }
  }

  // 📡 SUBSCRIBE TO WORKFLOW EVENTS
  private async subscribeToWorkflowEvents(): Promise<void> {
    // Subscribe to workflow step completion events
    // Note: This would integrate with the actual system orchestrator event system
    
    // Simulate workflow event subscriptions
    const workflowEvents = [
      'workflow_started',
      'workflow_completed', 
      'workflow_failed',
      'step_started',
      'step_completed',
      'step_failed',
      'step_timeout',
      'load_assigned',
      'tracking_initiated',
      'document_generated',
      'payment_processed',
      'compliance_checked',
      'emergency_detected'
    ];

    workflowEvents.forEach(eventType => {
      const unsubscribe = this.systemOrchestrator.subscribe?.(eventType, (data: any) => {
        this.handleWorkflowEvent(eventType, data);
      });

      if (unsubscribe) {
        this.workflowSubscriptions.set(eventType, unsubscribe);
      }
    });

    console.log(`📡 Subscribed to ${workflowEvents.length} workflow event types`);
  }

  // 🎯 HANDLE WORKFLOW EVENTS
  private async handleWorkflowEvent(eventType: string, eventData: any): Promise<void> {
    try {
      console.log(`🔔 Workflow event received: ${eventType}`, eventData);

      // Find matching notification configurations
      const matchingConfigs = WORKFLOW_NOTIFICATIONS.filter(config => {
        // Match workflow and step
        if (config.workflowId !== eventData.workflowId) return false;
        if (config.stepId !== eventData.stepId) return false;

        // Check conditions
        if (config.conditions) {
          const conditions = config.conditions;
          
          switch (eventType) {
            case 'step_started':
              return conditions.onStart === true;
            case 'step_completed':
              return conditions.onComplete === true || conditions.onSuccess === true;
            case 'step_failed':
              return conditions.onError === true;
            case 'step_timeout':
              return conditions.onTimeout === true;
            default:
              return false;
          }
        }

        return true; // No conditions specified, always trigger
      });

      // Process each matching configuration
      for (const config of matchingConfigs) {
        await this.createWorkflowNotification(config, eventData);
      }

    } catch (error) {
      console.error('❌ Error handling workflow event:', error);
    }
  }

  // 📝 CREATE WORKFLOW NOTIFICATION
  private async createWorkflowNotification(
    config: WorkflowNotificationConfig,
    eventData: any
  ): Promise<void> {
    try {
      // Template variable replacement
      const title = this.replaceTemplateVariables(config.template.title, eventData);
      const message = this.replaceTemplateVariables(config.template.message, eventData);
      
      // Process actions with template replacement
      const actions = config.template.actions?.map(action => ({
        ...action,
        url: action.url ? this.replaceTemplateVariables(action.url, eventData) : action.url
      }));

      // Determine target users if not specified
      let targetUsers = config.targetUsers;
      if (!targetUsers && eventData.assignedUsers) {
        targetUsers = Array.isArray(eventData.assignedUsers) ? eventData.assignedUsers : [eventData.assignedUsers];
      }

      // Create notification
      const notificationId = await fleetFlowNotificationManager.createNotification({
        type: config.notificationType,
        priority: config.priority,
        title,
        message,
        channels: config.channels,
        targetPortals: config.targetPortals,
        targetUsers,
        metadata: {
          workflowId: eventData.workflowId,
          stepId: eventData.stepId,
          loadId: eventData.loadId,
          orderId: eventData.orderId,
          eventType: config.stepId,
          actionRequired: !!actions?.length,
          source: 'system_orchestrator',
          ...eventData
        },
        actions
      });

      console.log(`✅ Workflow notification created: ${notificationId} for ${config.workflowId}:${config.stepId}`);

    } catch (error) {
      console.error('❌ Error creating workflow notification:', error);
    }
  }

  // 🔧 REPLACE TEMPLATE VARIABLES
  private replaceTemplateVariables(template: string, data: any): string {
    let result = template;
    
    // Replace {{variable}} patterns
    const variablePattern = /\{\{(\w+)\}\}/g;
    result = result.replace(variablePattern, (match, variableName) => {
      const value = data[variableName];
      return value !== undefined ? String(value) : match;
    });

    // Format common data types
    if (data.rate && typeof data.rate === 'number') {
      result = result.replace(/\{\{rate\}\}/g, `$${data.rate.toLocaleString()}`);
    }
    
    if (data.amount && typeof data.amount === 'number') {
      result = result.replace(/\{\{amount\}\}/g, `$${data.amount.toLocaleString()}`);
    }

    if (data.estimatedDelivery) {
      const eta = new Date(data.estimatedDelivery).toLocaleString();
      result = result.replace(/\{\{estimatedDelivery\}\}/g, eta);
    }

    return result;
  }

  // 🔗 SETUP WEBSOCKET INTEGRATION
  private setupWebSocketIntegration(): void {
    // Subscribe to WebSocket events for cross-portal synchronization
    webSocketNotificationService.onMessage('system_status', (data) => {
      console.log('📡 System status update:', data);
    });

    webSocketNotificationService.onMessage('connected', () => {
      console.log('🔗 WebSocket connected - notification sync active');
    });

    webSocketNotificationService.onMessage('disconnected', () => {
      console.log('🔌 WebSocket disconnected - falling back to local notifications');
    });

    console.log('🔗 WebSocket notification integration configured');
  }

  // 🏥 SETUP SYSTEM HEALTH MONITORING
  private setupSystemHealthMonitoring(): void {
    // Monitor system orchestrator health every 5 minutes
    setInterval(async () => {
      try {
        const systemStatus = await this.systemOrchestrator.getSystemStatus?.();
        
        if (systemStatus?.criticalAlerts?.length > 0) {
          // Create critical system alerts
          for (const alert of systemStatus.criticalAlerts) {
            await fleetFlowNotificationManager.createNotification({
              type: 'system_alert',
              priority: 'critical',
              title: `🚨 System Critical Alert: ${alert.component}`,
              message: `${alert.description}\nComponent: ${alert.component}\nSeverity: ${alert.severity}`,
              channels: { inApp: true, sms: true, email: true, push: true },
              targetPortals: ['admin', 'dispatch'],
              metadata: {
                alertId: alert.id,
                component: alert.component,
                severity: alert.severity,
                actionRequired: true,
                source: 'system_health_monitor'
              },
              actions: [
                { id: 'acknowledge', label: 'Acknowledge', action: 'acknowledge_alert', style: 'primary' },
                { id: 'investigate', label: 'Investigate', action: 'open_system_monitor', style: 'secondary' }
              ]
            });
          }
        }

        // Check notification system health
        const notificationHealth = fleetFlowNotificationManager.getHealthStatus();
        const wsHealth = webSocketNotificationService.getHealthStatus();

        if (notificationHealth.status === 'unhealthy' || wsHealth.status === 'unhealthy') {
          await fleetFlowNotificationManager.createNotification({
            type: 'system_alert',
            priority: 'urgent',
            title: '⚠️ Notification System Health Warning',
            message: `Notification system degraded: Manager(${notificationHealth.status}) WebSocket(${wsHealth.status})`,
            channels: { inApp: true, sms: false, email: true, push: false },
            targetPortals: ['admin'],
            metadata: {
              notificationSystemStatus: notificationHealth.status,
              webSocketStatus: wsHealth.status,
              actionRequired: true,
              source: 'notification_health_monitor'
            }
          });
        }

      } catch (error) {
        console.error('❌ System health monitoring error:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    console.log('🏥 System health monitoring active');
  }

  // 📊 TRIGGER MANUAL WORKFLOW NOTIFICATION
  public async triggerWorkflowNotification(
    workflowId: string,
    stepId: string,
    eventType: 'start' | 'success' | 'error' | 'timeout',
    eventData: any
  ): Promise<void> {
    const mappedEventType = {
      start: 'step_started',
      success: 'step_completed', 
      error: 'step_failed',
      timeout: 'step_timeout'
    }[eventType];

    await this.handleWorkflowEvent(mappedEventType, {
      workflowId,
      stepId,
      ...eventData
    });
  }

  // 🧪 SEND TEST WORKFLOW NOTIFICATIONS
  public async sendTestNotifications(): Promise<void> {
    console.log('🧪 Sending test workflow notifications...');

    // Test load assignment
    await this.triggerWorkflowNotification('load_assignment', 'ai_dispatch', 'success', {
      loadId: 'TEST-001',
      origin: 'Atlanta, GA',
      destination: 'Miami, FL',
      rate: 2500,
      miles: 650,
      assignedUsers: ['test-driver-001']
    });

    // Test emergency alert
    await this.triggerWorkflowNotification('emergency_response', 'accident_detected', 'error', {
      driverName: 'John Doe',
      loadId: 'TEST-002',
      location: 'I-75 Mile Marker 125'
    });

    // Test high-value opportunity
    await this.triggerWorkflowNotification('load_matching', 'high_value_opportunity', 'success', {
      rate: 4200,
      miles: 800,
      origin: 'Los Angeles, CA',
      destination: 'Phoenix, AZ',
      timeRemaining: '45 minutes'
    });

    console.log('✅ Test workflow notifications sent');
  }

  // 📋 GET INTEGRATION STATUS
  public getIntegrationStatus(): {
    initialized: boolean;
    subscriptions: number;
    lastHealthCheck: string;
    systemStatus: any;
    notificationHealth: any;
    webSocketHealth: any;
  } {
    return {
      initialized: this.isInitialized,
      subscriptions: this.workflowSubscriptions.size,
      lastHealthCheck: new Date().toISOString(),
      systemStatus: {
        orchestratorConnected: !!this.systemOrchestrator,
        workflowConfigs: WORKFLOW_NOTIFICATIONS.length
      },
      notificationHealth: fleetFlowNotificationManager.getHealthStatus(),
      webSocketHealth: webSocketNotificationService.getHealthStatus()
    };
  }

  // 🗑️ CLEANUP
  public destroy(): void {
    console.log('🗑️ Cleaning up System Orchestrator Notification Integration');
    
    // Unsubscribe from workflow events
    this.workflowSubscriptions.forEach((unsubscribe, eventType) => {
      try {
        unsubscribe();
      } catch (error) {
        console.error(`❌ Error unsubscribing from ${eventType}:`, error);
      }
    });
    this.workflowSubscriptions.clear();

    this.isInitialized = false;
  }
}

// 🌟 EXPORT SINGLETON INSTANCE
export const systemOrchestratorNotificationIntegration = SystemOrchestratorNotificationIntegration.getInstance();
export default systemOrchestratorNotificationIntegration;
