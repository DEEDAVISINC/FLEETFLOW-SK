// ELDIntegrationService for Hours of Service tracking
interface HoursOfServiceData {
  driverId: string;
  currentStatus: 'off_duty' | 'sleeper_berth' | 'driving' | 'on_duty';
  remainingHours: number;
  availableHours: number;
  totalHours: number;
  cycleHours: number;
  violations: Violation[];
  logs: DutyLog[];
  lastUpdate: string;
}

interface Violation {
  id: string;
  type: 'hours_exceeded' | 'missing_log' | 'form_manner' | 'break_required';
  description: string;
  severity: 'warning' | 'violation';
  timestamp: string;
  resolved: boolean;
}

interface DutyLog {
  id: string;
  driverId: string;
  status: 'off_duty' | 'sleeper_berth' | 'driving' | 'on_duty';
  startTime: string;
  endTime?: string;
  duration: number;
  location: string;
  notes?: string;
  automatic: boolean;
}

class ELDIntegrationServiceClass {
  private hoursOfService: { [driverId: string]: HoursOfServiceData } = {
    'DRV-001': {
      driverId: 'DRV-001',
      currentStatus: 'off_duty',
      remainingHours: 11,
      availableHours: 11,
      totalHours: 0,
      cycleHours: 15,
      violations: [],
      logs: [
        {
          id: 'log-001',
          driverId: 'DRV-001',
          status: 'off_duty',
          startTime: '2024-12-23T00:00:00Z',
          endTime: '2024-12-23T07:00:00Z',
          duration: 7,
          location: 'Dallas, TX',
          automatic: true
        }
      ],
      lastUpdate: new Date().toISOString()
    },
    'DRV-002': {
      driverId: 'DRV-002',
      currentStatus: 'driving',
      remainingHours: 8.5,
      availableHours: 8.5,
      totalHours: 2.5,
      cycleHours: 42,
      violations: [
        {
          id: 'viol-001',
          type: 'break_required',
          description: '30-minute break required after 8 hours of driving',
          severity: 'warning',
          timestamp: '2024-12-23T14:30:00Z',
          resolved: false
        }
      ],
      logs: [
        {
          id: 'log-002',
          driverId: 'DRV-002',
          status: 'driving',
          startTime: '2024-12-23T12:00:00Z',
          duration: 2.5,
          location: 'Phoenix, AZ',
          automatic: true
        }
      ],
      lastUpdate: new Date().toISOString()
    }
  };

  async getHoursOfService(driverId: string): Promise<HoursOfServiceData | null> {
    try {
      const data = this.hoursOfService[driverId];
      if (!data) {
        return null;
      }

      // Update data with current time calculations
      const now = new Date();
      const currentLog = data.logs.find(log => !log.endTime);
      
      if (currentLog) {
        const startTime = new Date(currentLog.startTime);
        const elapsedHours = (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        
        data.totalHours = Math.round(elapsedHours * 100) / 100;
        data.remainingHours = Math.max(0, 11 - data.totalHours);
        data.lastUpdate = now.toISOString();
      }

      return data;
    } catch (error) {
      console.error('Error getting hours of service:', error);
      return null;
    }
  }

  async updateDutyStatus(driverId: string, status: HoursOfServiceData['currentStatus'], location: string, notes?: string): Promise<boolean> {
    try {
      const data = this.hoursOfService[driverId];
      if (!data) {
        return false;
      }

      const now = new Date();
      
      // End current log if exists
      const currentLog = data.logs.find(log => !log.endTime);
      if (currentLog) {
        currentLog.endTime = now.toISOString();
        const duration = (now.getTime() - new Date(currentLog.startTime).getTime()) / (1000 * 60 * 60);
        currentLog.duration = Math.round(duration * 100) / 100;
      }

      // Create new log
      const newLog: DutyLog = {
        id: `log-${Date.now()}`,
        driverId,
        status,
        startTime: now.toISOString(),
        duration: 0,
        location,
        notes,
        automatic: false
      };

      data.logs.push(newLog);
      data.currentStatus = status;
      data.lastUpdate = now.toISOString();

      // Check for violations
      await this.checkViolations(driverId);

      return true;
    } catch (error) {
      console.error('Error updating duty status:', error);
      return false;
    }
  }

  async getDutyLogs(driverId: string, days: number = 7): Promise<DutyLog[]> {
    try {
      const data = this.hoursOfService[driverId];
      if (!data) {
        return [];
      }

      const cutoffTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      return data.logs.filter(log => new Date(log.startTime) >= cutoffTime);
    } catch (error) {
      console.error('Error getting duty logs:', error);
      return [];
    }
  }

  async getViolations(driverId: string): Promise<Violation[]> {
    try {
      const data = this.hoursOfService[driverId];
      if (!data) {
        return [];
      }

      return data.violations.filter(v => !v.resolved);
    } catch (error) {
      console.error('Error getting violations:', error);
      return [];
    }
  }

  async resolveViolation(driverId: string, violationId: string): Promise<boolean> {
    try {
      const data = this.hoursOfService[driverId];
      if (!data) {
        return false;
      }

      const violation = data.violations.find(v => v.id === violationId);
      if (!violation) {
        return false;
      }

      violation.resolved = true;
      return true;
    } catch (error) {
      console.error('Error resolving violation:', error);
      return false;
    }
  }

  async generateDVIR(driverId: string, vehicleId: string, inspection: any): Promise<{ success: boolean; dvirId?: string }> {
    try {
      // Driver Vehicle Inspection Report
      const dvirId = `DVIR-${Date.now()}`;
      
      // In a real implementation, this would save to database
      console.log(`Generated DVIR ${dvirId} for driver ${driverId}, vehicle ${vehicleId}`);
      
      return { success: true, dvirId };
    } catch (error) {
      console.error('Error generating DVIR:', error);
      return { success: false };
    }
  }

  async exportLogs(driverId: string, startDate: string, endDate: string): Promise<{ success: boolean; data?: any }> {
    try {
      const logs = await this.getDutyLogs(driverId, 30);
      const filteredLogs = logs.filter(log => {
        const logDate = new Date(log.startTime);
        return logDate >= new Date(startDate) && logDate <= new Date(endDate);
      });

      // Format for export
      const exportData = {
        driverId,
        exportDate: new Date().toISOString(),
        dateRange: { startDate, endDate },
        logs: filteredLogs,
        summary: {
          totalDrivingHours: filteredLogs.filter(l => l.status === 'driving').reduce((sum, l) => sum + l.duration, 0),
          totalOnDutyHours: filteredLogs.filter(l => l.status === 'on_duty').reduce((sum, l) => sum + l.duration, 0),
          totalOffDutyHours: filteredLogs.filter(l => l.status === 'off_duty').reduce((sum, l) => sum + l.duration, 0)
        }
      };

      return { success: true, data: exportData };
    } catch (error) {
      console.error('Error exporting logs:', error);
      return { success: false };
    }
  }

  async checkCompliance(driverId: string): Promise<{ compliant: boolean; issues: string[] }> {
    try {
      const data = this.hoursOfService[driverId];
      if (!data) {
        return { compliant: false, issues: ['No ELD data found'] };
      }

      const issues: string[] = [];
      
      // Check 11-hour driving limit
      if (data.remainingHours <= 0) {
        issues.push('11-hour driving limit reached');
      }

      // Check 14-hour on-duty limit
      if (data.cycleHours >= 70) {
        issues.push('70-hour cycle limit approaching');
      }

      // Check for unresolved violations
      const unresolved = data.violations.filter(v => !v.resolved);
      if (unresolved.length > 0) {
        issues.push(`${unresolved.length} unresolved violation(s)`);
      }

      return {
        compliant: issues.length === 0,
        issues
      };
    } catch (error) {
      console.error('Error checking compliance:', error);
      return { compliant: false, issues: ['Error checking compliance'] };
    }
  }

  private async checkViolations(driverId: string): Promise<void> {
    try {
      const data = this.hoursOfService[driverId];
      if (!data) {
        return;
      }

      // Check for 11-hour driving limit
      if (data.remainingHours <= 0 && data.currentStatus === 'driving') {
        const violation: Violation = {
          id: `viol-${Date.now()}`,
          type: 'hours_exceeded',
          description: '11-hour driving limit exceeded',
          severity: 'violation',
          timestamp: new Date().toISOString(),
          resolved: false
        };
        data.violations.push(violation);
      }

      // Check for 30-minute break requirement
      const drivingLogs = data.logs.filter(log => log.status === 'driving');
      const continuousDriving = drivingLogs.reduce((sum, log) => sum + log.duration, 0);
      
      if (continuousDriving >= 8) {
        const violation: Violation = {
          id: `viol-${Date.now()}`,
          type: 'break_required',
          description: '30-minute break required after 8 hours of driving',
          severity: 'warning',
          timestamp: new Date().toISOString(),
          resolved: false
        };
        data.violations.push(violation);
      }
    } catch (error) {
      console.error('Error checking violations:', error);
    }
  }
}

export const ELDIntegrationService = new ELDIntegrationServiceClass(); 