/**
 * Business Event Generator
 * Automatically generates notifications from FleetFlow business events
 * Integrates with existing systems to create contextual notifications
 */

import {
  BusinessEvent,
  NotificationData,
  notificationService,
} from '../services/NotificationService';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

interface LoadData {
  id: string;
  loadNumber: string;
  origin: string;
  destination: string;
  driverId?: string;
  driverName?: string;
  carrierId?: string;
  carrierName?: string;
  customerId: string;
  customerName: string;
  status: string;
  pickupDate: Date;
  deliveryDate?: Date;
  value: number;
}

interface DriverData {
  id: string;
  name: string;
  phone: string;
  currentLocation?: string;
  violationType?: string;
  hosViolations?: number;
}

interface VehicleData {
  id: string;
  vehicleNumber: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  maintenanceType: string;
  lastService?: Date;
}

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  dueDate: Date;
  status: string;
  loadId?: string;
}

// ============================================================================
// BUSINESS EVENT GENERATOR CLASS
// ============================================================================

export class BusinessEventGenerator {
  constructor() {
    console.info('🎯 BusinessEventGenerator initialized');
  }

  // ============================================================================
  // LOAD MANAGEMENT EVENTS
  // ============================================================================

  /**
   * Generate load created notification
   */
  async generateLoadCreatedEvent(
    loadData: LoadData,
    tenantId: string
  ): Promise<void> {
    const event: BusinessEvent = {
      type: 'load_created',
      entityId: loadData.id,
      entityType: 'load',
      data: loadData,
      timestamp: new Date(),
      tenantId,
      userId: loadData.driverId,
    };

    await notificationService.handleBusinessEvent(event);

    // Additional custom notifications
    const notifications: NotificationData[] = [
      // Notify dispatcher
      {
        type: 'dispatch',
        title: 'New Load Created',
        message: `Load ${loadData.loadNumber} created for ${loadData.origin} → ${loadData.destination}`,
        priority: 'medium',
        tenantId,
        category: 'load_management',
        channels: ['in-app', 'push'],
        relatedEntityId: loadData.id,
        relatedEntityType: 'load',
        data: loadData,
        actions: [
          {
            id: 'assign_driver',
            label: 'Assign Driver',
            type: 'navigate',
            payload: { url: `/loads/${loadData.id}?action=assign` },
            style: 'primary',
            icon: '👤',
          },
          {
            id: 'optimize_route',
            label: 'Optimize Route',
            type: 'navigate',
            payload: { url: `/routes/optimize?loadId=${loadData.id}` },
            style: 'secondary',
            icon: '🗺️',
          },
        ],
      },
    ];

    await notificationService.sendBulkNotifications(notifications);
  }

  /**
   * Generate load delivered notification
   */
  async generateLoadDeliveredEvent(
    loadData: LoadData,
    tenantId: string
  ): Promise<void> {
    const event: BusinessEvent = {
      type: 'load_delivered',
      entityId: loadData.id,
      entityType: 'load',
      data: {
        ...loadData,
        deliveredAt: new Date(),
        deliveryConfirmed: true,
      },
      timestamp: new Date(),
      tenantId,
    };

    await notificationService.handleBusinessEvent(event);

    // Custom notifications
    const notifications: NotificationData[] = [
      // Notify customer
      {
        type: 'customer',
        title: 'Delivery Completed',
        message: `Your shipment ${loadData.loadNumber} has been delivered successfully.`,
        priority: 'low',
        tenantId,
        category: 'delivery_confirmation',
        channels: ['email'],
        relatedEntityId: loadData.customerId,
        relatedEntityType: 'customer',
        data: loadData,
      },
      // Notify billing team
      {
        type: 'billing',
        title: 'Load Ready for Invoicing',
        message: `Load ${loadData.loadNumber} delivered - ready for invoice generation.`,
        priority: 'medium',
        tenantId,
        category: 'invoice_ready',
        channels: ['in-app'],
        relatedEntityId: loadData.id,
        relatedEntityType: 'load',
        data: loadData,
        actions: [
          {
            id: 'create_invoice',
            label: 'Create Invoice',
            type: 'navigate',
            payload: { url: `/billing/create?loadId=${loadData.id}` },
            style: 'primary',
            icon: '💰',
          },
        ],
      },
    ];

    await notificationService.sendBulkNotifications(notifications);
  }

  /**
   * Generate load delayed notification
   */
  async generateLoadDelayedEvent(
    loadData: LoadData,
    reason: string,
    newETA: Date,
    tenantId: string
  ): Promise<void> {
    const event: BusinessEvent = {
      type: 'load_delayed',
      entityId: loadData.id,
      entityType: 'load',
      data: {
        ...loadData,
        delayReason: reason,
        newETA: newETA,
        originalDeliveryDate: loadData.deliveryDate,
      },
      timestamp: new Date(),
      tenantId,
    };

    await notificationService.handleBusinessEvent(event);

    // High-priority delay notifications
    const notifications: NotificationData[] = [
      {
        type: 'shipment',
        title: `DELAY: Load ${loadData.loadNumber}`,
        message: `Load delayed due to ${reason}. New ETA: ${newETA.toLocaleString()}`,
        priority: 'high',
        tenantId,
        category: 'load_delay',
        channels: ['in-app', 'email', 'sms'],
        relatedEntityId: loadData.id,
        relatedEntityType: 'load',
        data: { ...loadData, delayReason: reason, newETA },
        actions: [
          {
            id: 'notify_customer',
            label: 'Notify Customer',
            type: 'modal',
            payload: { modal: 'customer_notification', loadId: loadData.id },
            style: 'primary',
            icon: '📞',
          },
          {
            id: 'reschedule',
            label: 'Reschedule',
            type: 'navigate',
            payload: { url: `/loads/${loadData.id}?action=reschedule` },
            style: 'secondary',
            icon: '📅',
          },
        ],
      },
    ];

    await notificationService.sendBulkNotifications(notifications);
  }

  // ============================================================================
  // DRIVER MANAGEMENT EVENTS
  // ============================================================================

  /**
   * Generate driver check-in notification
   */
  async generateDriverCheckInEvent(
    driverData: DriverData,
    location: string,
    tenantId: string
  ): Promise<void> {
    const event: BusinessEvent = {
      type: 'driver_check_in',
      entityId: driverData.id,
      entityType: 'driver',
      data: {
        ...driverData,
        location,
        checkInTime: new Date(),
      },
      timestamp: new Date(),
      tenantId,
    };

    await notificationService.handleBusinessEvent(event);
  }

  /**
   * Generate driver violation notification
   */
  async generateDriverViolationEvent(
    driverData: DriverData,
    tenantId: string
  ): Promise<void> {
    const event: BusinessEvent = {
      type: 'driver_violation',
      entityId: driverData.id,
      entityType: 'driver',
      data: driverData,
      timestamp: new Date(),
      tenantId,
    };

    await notificationService.handleBusinessEvent(event);

    // Critical violation notifications
    const notifications: NotificationData[] = [
      {
        type: 'compliance',
        title: 'CRITICAL: Driver Violation',
        message: `Driver ${driverData.name} has ${driverData.hosViolations} HOS violations. Immediate action required.`,
        priority: 'critical',
        tenantId,
        category: 'driver_violation',
        channels: ['in-app', 'email', 'sms'],
        relatedEntityId: driverData.id,
        relatedEntityType: 'driver',
        data: driverData,
        actions: [
          {
            id: 'review_logs',
            label: 'Review HOS Logs',
            type: 'navigate',
            payload: { url: `/drivers/${driverData.id}/hos` },
            style: 'danger',
            icon: '📊',
          },
          {
            id: 'contact_driver',
            label: 'Contact Driver',
            type: 'api',
            payload: { action: 'call', phone: driverData.phone },
            style: 'primary',
            icon: '📞',
          },
        ],
      },
    ];

    await notificationService.sendBulkNotifications(notifications);
  }

  // ============================================================================
  // VEHICLE MAINTENANCE EVENTS
  // ============================================================================

  /**
   * Generate vehicle maintenance due notification
   */
  async generateMaintenanceDueEvent(
    vehicleData: VehicleData,
    tenantId: string
  ): Promise<void> {
    const event: BusinessEvent = {
      type: 'vehicle_maintenance_due',
      entityId: vehicleData.id,
      entityType: 'vehicle',
      data: vehicleData,
      timestamp: new Date(),
      tenantId,
    };

    await notificationService.handleBusinessEvent(event);

    // Maintenance notifications
    const notifications: NotificationData[] = [
      {
        type: 'maintenance',
        title: 'Scheduled Maintenance Due',
        message: `Vehicle ${vehicleData.vehicleNumber} requires ${vehicleData.maintenanceType} service.`,
        priority: 'medium',
        tenantId,
        category: 'maintenance_due',
        channels: ['in-app', 'email'],
        relatedEntityId: vehicleData.id,
        relatedEntityType: 'vehicle',
        data: vehicleData,
        actions: [
          {
            id: 'schedule_service',
            label: 'Schedule Service',
            type: 'navigate',
            payload: {
              url: `/maintenance/schedule?vehicleId=${vehicleData.id}`,
            },
            style: 'primary',
            icon: '🔧',
          },
          {
            id: 'view_history',
            label: 'Service History',
            type: 'navigate',
            payload: { url: `/vehicles/${vehicleData.id}/maintenance` },
            style: 'secondary',
            icon: '📋',
          },
        ],
      },
    ];

    await notificationService.sendBulkNotifications(notifications);
  }

  // ============================================================================
  // BILLING EVENTS
  // ============================================================================

  /**
   * Generate invoice created notification
   */
  async generateInvoiceCreatedEvent(
    invoiceData: InvoiceData,
    tenantId: string
  ): Promise<void> {
    const event: BusinessEvent = {
      type: 'invoice_created',
      entityId: invoiceData.id,
      entityType: 'invoice',
      data: invoiceData,
      timestamp: new Date(),
      tenantId,
    };

    await notificationService.handleBusinessEvent(event);
  }

  /**
   * Generate invoice overdue notification
   */
  async generateInvoiceOverdueEvent(
    invoiceData: InvoiceData,
    daysPastDue: number,
    tenantId: string
  ): Promise<void> {
    const event: BusinessEvent = {
      type: 'invoice_overdue',
      entityId: invoiceData.id,
      entityType: 'invoice',
      data: {
        ...invoiceData,
        daysPastDue,
      },
      timestamp: new Date(),
      tenantId,
    };

    await notificationService.handleBusinessEvent(event);

    // Overdue notifications
    const notifications: NotificationData[] = [
      {
        type: 'billing',
        title: 'Invoice Overdue',
        message: `Invoice ${invoiceData.invoiceNumber} is ${daysPastDue} days overdue. Amount: $${invoiceData.amount.toLocaleString()}`,
        priority: daysPastDue > 30 ? 'high' : 'medium',
        tenantId,
        category: 'invoice_overdue',
        channels: ['in-app', 'email'],
        relatedEntityId: invoiceData.id,
        relatedEntityType: 'invoice',
        data: { ...invoiceData, daysPastDue },
        actions: [
          {
            id: 'send_reminder',
            label: 'Send Reminder',
            type: 'api',
            payload: { action: 'send_reminder', invoiceId: invoiceData.id },
            style: 'primary',
            icon: '📧',
          },
          {
            id: 'call_customer',
            label: 'Call Customer',
            type: 'modal',
            payload: {
              modal: 'customer_call',
              customerId: invoiceData.customerId,
            },
            style: 'secondary',
            icon: '📞',
          },
        ],
      },
    ];

    await notificationService.sendBulkNotifications(notifications);
  }

  // ============================================================================
  // SYSTEM EVENTS
  // ============================================================================

  /**
   * Generate system maintenance notification
   */
  async generateSystemMaintenanceEvent(
    maintenanceWindow: { start: Date; end: Date; description: string },
    tenantId: string
  ): Promise<void> {
    const event: BusinessEvent = {
      type: 'system_maintenance',
      entityId: 'system',
      entityType: 'system',
      data: maintenanceWindow,
      timestamp: new Date(),
      tenantId,
    };

    await notificationService.handleBusinessEvent(event);

    // System maintenance notifications
    const notifications: NotificationData[] = [
      {
        type: 'system',
        title: 'Scheduled System Maintenance',
        message: `${maintenanceWindow.description}. Maintenance window: ${maintenanceWindow.start.toLocaleString()} - ${maintenanceWindow.end.toLocaleString()}`,
        priority: 'medium',
        tenantId,
        category: 'system_maintenance',
        channels: ['in-app', 'email'],
        data: maintenanceWindow,
        scheduledFor: new Date(
          maintenanceWindow.start.getTime() - 24 * 60 * 60 * 1000
        ), // 24 hours before
        actions: [
          {
            id: 'acknowledge',
            label: 'Acknowledge',
            type: 'api',
            payload: { action: 'acknowledge_maintenance' },
            style: 'primary',
            icon: '✓',
          },
        ],
      },
    ];

    await notificationService.sendBulkNotifications(notifications);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Bulk generate test notifications for development
   */
  async generateTestNotifications(tenantId: string): Promise<void> {
    console.info('🧪 Generating test notifications...');

    // Test load events
    const testLoad: LoadData = {
      id: 'load_test_001',
      loadNumber: 'FL-TEST-001',
      origin: 'Atlanta, GA',
      destination: 'Miami, FL',
      driverName: 'John Smith',
      driverId: 'driver_001',
      customerName: 'ABC Logistics',
      customerId: 'customer_001',
      status: 'in_transit',
      pickupDate: new Date(),
      value: 2500,
    };

    await this.generateLoadCreatedEvent(testLoad, tenantId);

    setTimeout(async () => {
      await this.generateLoadDelayedEvent(
        testLoad,
        'weather conditions',
        new Date(Date.now() + 4 * 60 * 60 * 1000),
        tenantId
      );
    }, 1000);

    // Test maintenance event
    const testVehicle: VehicleData = {
      id: 'vehicle_001',
      vehicleNumber: 'TRK-789',
      make: 'Freightliner',
      model: 'Cascadia',
      year: 2022,
      mileage: 125000,
      maintenanceType: 'preventive maintenance',
    };

    setTimeout(async () => {
      await this.generateMaintenanceDueEvent(testVehicle, tenantId);
    }, 2000);

    // Test billing event
    const testInvoice: InvoiceData = {
      id: 'invoice_001',
      invoiceNumber: 'INV-45678',
      customerId: 'customer_001',
      customerName: 'XYZ Transport',
      amount: 3200,
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      status: 'overdue',
    };

    setTimeout(async () => {
      await this.generateInvoiceOverdueEvent(testInvoice, 5, tenantId);
    }, 3000);

    console.info('✅ Test notifications generated');
  }
}

// Export singleton instance
export const businessEventGenerator = new BusinessEventGenerator();
