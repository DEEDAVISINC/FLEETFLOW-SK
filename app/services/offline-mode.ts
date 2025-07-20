// OfflineModeService for offline capability and local storage
interface OfflineData {
  driverId: string;
  workflowSteps: any[];
  messages: any[];
  notifications: any[];
  documents: any[];
  gpsLocation: any;
  eldData: any;
  lastSync: string;
  pendingUploads: any[];
  pendingActions: any[];
}

interface PendingAction {
  id: string;
  type: 'complete_step' | 'send_message' | 'upload_document' | 'update_location';
  data: any;
  timestamp: string;
  retryCount: number;
}

class OfflineModeServiceClass {
  private isOnline: boolean = true;
  private offlineData: { [driverId: string]: OfflineData } = {};
  private storagePrefix = 'fleetflow_offline_';

  constructor() {
    // Check browser environment
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      
      // Listen for online/offline events
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.syncPendingData();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  async isOfflineMode(): Promise<boolean> {
    return !this.isOnline;
  }

  async enableOfflineMode(driverId: string): Promise<boolean> {
    try {
      if (typeof window === 'undefined') {
        return false;
      }

      // Initialize offline data structure
      const offlineData: OfflineData = {
        driverId,
        workflowSteps: [],
        messages: [],
        notifications: [],
        documents: [],
        gpsLocation: null,
        eldData: null,
        lastSync: new Date().toISOString(),
        pendingUploads: [],
        pendingActions: []
      };

      this.offlineData[driverId] = offlineData;
      
      // Store in localStorage
      localStorage.setItem(`${this.storagePrefix}${driverId}`, JSON.stringify(offlineData));
      
      return true;
    } catch (error) {
      console.error('Error enabling offline mode:', error);
      return false;
    }
  }

  async cacheData(driverId: string, dataType: string, data: any): Promise<boolean> {
    try {
      if (typeof window === 'undefined') {
        return false;
      }

      let offlineData = this.offlineData[driverId];
      if (!offlineData) {
        // Load from localStorage if not in memory
        const stored = localStorage.getItem(`${this.storagePrefix}${driverId}`);
        if (stored) {
          offlineData = JSON.parse(stored);
          this.offlineData[driverId] = offlineData;
        } else {
          // Initialize new offline data
          await this.enableOfflineMode(driverId);
          offlineData = this.offlineData[driverId];
        }
      }

      // Cache the data
      switch (dataType) {
        case 'workflowSteps':
          offlineData.workflowSteps = data;
          break;
        case 'messages':
          offlineData.messages = data;
          break;
        case 'notifications':
          offlineData.notifications = data;
          break;
        case 'documents':
          offlineData.documents = data;
          break;
        case 'gpsLocation':
          offlineData.gpsLocation = data;
          break;
        case 'eldData':
          offlineData.eldData = data;
          break;
        default:
          console.warn(`Unknown data type: ${dataType}`);
          return false;
      }

      // Update localStorage
      localStorage.setItem(`${this.storagePrefix}${driverId}`, JSON.stringify(offlineData));
      
      return true;
    } catch (error) {
      console.error('Error caching data:', error);
      return false;
    }
  }

  async getCachedData(driverId: string, dataType: string): Promise<any> {
    try {
      if (typeof window === 'undefined') {
        return null;
      }

      let offlineData = this.offlineData[driverId];
      if (!offlineData) {
        const stored = localStorage.getItem(`${this.storagePrefix}${driverId}`);
        if (!stored) {
          return null;
        }
        offlineData = JSON.parse(stored);
        this.offlineData[driverId] = offlineData;
      }

      switch (dataType) {
        case 'workflowSteps':
          return offlineData.workflowSteps;
        case 'messages':
          return offlineData.messages;
        case 'notifications':
          return offlineData.notifications;
        case 'documents':
          return offlineData.documents;
        case 'gpsLocation':
          return offlineData.gpsLocation;
        case 'eldData':
          return offlineData.eldData;
        default:
          return null;
      }
    } catch (error) {
      console.error('Error getting cached data:', error);
      return null;
    }
  }

  async addPendingAction(driverId: string, action: Omit<PendingAction, 'id' | 'timestamp' | 'retryCount'>): Promise<boolean> {
    try {
      if (typeof window === 'undefined') {
        return false;
      }

      let offlineData = this.offlineData[driverId];
      if (!offlineData) {
        await this.enableOfflineMode(driverId);
        offlineData = this.offlineData[driverId];
      }

      const pendingAction: PendingAction = {
        ...action,
        id: `action-${Date.now()}`,
        timestamp: new Date().toISOString(),
        retryCount: 0
      };

      offlineData.pendingActions.push(pendingAction);
      
      // Update localStorage
      localStorage.setItem(`${this.storagePrefix}${driverId}`, JSON.stringify(offlineData));
      
      return true;
    } catch (error) {
      console.error('Error adding pending action:', error);
      return false;
    }
  }

  async getPendingActions(driverId: string): Promise<PendingAction[]> {
    try {
      if (typeof window === 'undefined') {
        return [];
      }

      let offlineData = this.offlineData[driverId];
      if (!offlineData) {
        const stored = localStorage.getItem(`${this.storagePrefix}${driverId}`);
        if (!stored) {
          return [];
        }
        offlineData = JSON.parse(stored);
        this.offlineData[driverId] = offlineData;
      }

      return offlineData.pendingActions || [];
    } catch (error) {
      console.error('Error getting pending actions:', error);
      return [];
    }
  }

  async removePendingAction(driverId: string, actionId: string): Promise<boolean> {
    try {
      if (typeof window === 'undefined') {
        return false;
      }

      let offlineData = this.offlineData[driverId];
      if (!offlineData) {
        return false;
      }

      const index = offlineData.pendingActions.findIndex(action => action.id === actionId);
      if (index === -1) {
        return false;
      }

      offlineData.pendingActions.splice(index, 1);
      
      // Update localStorage
      localStorage.setItem(`${this.storagePrefix}${driverId}`, JSON.stringify(offlineData));
      
      return true;
    } catch (error) {
      console.error('Error removing pending action:', error);
      return false;
    }
  }

  async syncPendingData(): Promise<boolean> {
    try {
      if (!this.isOnline) {
        return false;
      }

      // Sync all drivers' pending data
      for (const driverId in this.offlineData) {
        const offlineData = this.offlineData[driverId];
        const pendingActions = offlineData.pendingActions || [];

        for (const action of pendingActions) {
          try {
            const success = await this.processPendingAction(driverId, action);
            if (success) {
              await this.removePendingAction(driverId, action.id);
            } else {
              // Increment retry count
              action.retryCount++;
              if (action.retryCount >= 3) {
                // Remove after 3 failed attempts
                await this.removePendingAction(driverId, action.id);
              }
            }
          } catch (error) {
            console.error(`Error processing pending action ${action.id}:`, error);
            action.retryCount++;
          }
        }

        // Update last sync time
        offlineData.lastSync = new Date().toISOString();
        localStorage.setItem(`${this.storagePrefix}${driverId}`, JSON.stringify(offlineData));
      }

      return true;
    } catch (error) {
      console.error('Error syncing pending data:', error);
      return false;
    }
  }

  private async processPendingAction(driverId: string, action: PendingAction): Promise<boolean> {
    try {
      // In a real implementation, this would call the actual service methods
      switch (action.type) {
        case 'complete_step':
          console.log(`Syncing step completion for ${driverId}:`, action.data);
          // Would call DriverWorkflowService.completeStep()
          return true;
        
        case 'send_message':
          console.log(`Syncing message for ${driverId}:`, action.data);
          // Would call CommunicationService.sendMessage()
          return true;
        
        case 'upload_document':
          console.log(`Syncing document upload for ${driverId}:`, action.data);
          // Would call DocumentManagementService.uploadDocument()
          return true;
        
        case 'update_location':
          console.log(`Syncing location update for ${driverId}:`, action.data);
          // Would call GPSTrackingService.updateLocation()
          return true;
        
        default:
          console.warn(`Unknown action type: ${action.type}`);
          return false;
      }
    } catch (error) {
      console.error('Error processing pending action:', error);
      return false;
    }
  }

  async getStorageUsage(driverId: string): Promise<{ size: number; items: number }> {
    try {
      if (typeof window === 'undefined') {
        return { size: 0, items: 0 };
      }

      const stored = localStorage.getItem(`${this.storagePrefix}${driverId}`);
      if (!stored) {
        return { size: 0, items: 0 };
      }

      const offlineData = JSON.parse(stored);
      const totalItems = 
        (offlineData.workflowSteps?.length || 0) +
        (offlineData.messages?.length || 0) +
        (offlineData.notifications?.length || 0) +
        (offlineData.documents?.length || 0) +
        (offlineData.pendingActions?.length || 0);

      return {
        size: stored.length,
        items: totalItems
      };
    } catch (error) {
      console.error('Error getting storage usage:', error);
      return { size: 0, items: 0 };
    }
  }

  async clearOfflineData(driverId: string): Promise<boolean> {
    try {
      if (typeof window === 'undefined') {
        return false;
      }

      // Remove from memory
      delete this.offlineData[driverId];
      
      // Remove from localStorage
      localStorage.removeItem(`${this.storagePrefix}${driverId}`);
      
      return true;
    } catch (error) {
      console.error('Error clearing offline data:', error);
      return false;
    }
  }

  async exportOfflineData(driverId: string): Promise<{ success: boolean; data?: any }> {
    try {
      if (typeof window === 'undefined') {
        return { success: false };
      }

      const stored = localStorage.getItem(`${this.storagePrefix}${driverId}`);
      if (!stored) {
        return { success: false };
      }

      const offlineData = JSON.parse(stored);
      
      return {
        success: true,
        data: {
          exportedAt: new Date().toISOString(),
          driverId,
          offlineData
        }
      };
    } catch (error) {
      console.error('Error exporting offline data:', error);
      return { success: false };
    }
  }

  async importOfflineData(driverId: string, data: any): Promise<boolean> {
    try {
      if (typeof window === 'undefined') {
        return false;
      }

      // Validate data structure
      if (!data.offlineData || data.driverId !== driverId) {
        return false;
      }

      // Store in memory and localStorage
      this.offlineData[driverId] = data.offlineData;
      localStorage.setItem(`${this.storagePrefix}${driverId}`, JSON.stringify(data.offlineData));
      
      return true;
    } catch (error) {
      console.error('Error importing offline data:', error);
      return false;
    }
  }

  async getLastSyncTime(driverId: string): Promise<string | null> {
    try {
      if (typeof window === 'undefined') {
        return null;
      }

      const stored = localStorage.getItem(`${this.storagePrefix}${driverId}`);
      if (!stored) {
        return null;
      }

      const offlineData = JSON.parse(stored);
      return offlineData.lastSync || null;
    } catch (error) {
      console.error('Error getting last sync time:', error);
      return null;
    }
  }
}

export const OfflineModeService = new OfflineModeServiceClass(); 