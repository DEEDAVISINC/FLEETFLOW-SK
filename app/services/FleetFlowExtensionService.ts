'use client';

/**
 * FleetFlow Extension Management Service
 *
 * Handles unique extension assignment for all FleetFlow users
 * Ensures no duplicate extensions and proper integration with user profiles
 */

export interface ExtensionAssignment {
  userId: string;
  userIdentifier: string;
  extension: number;
  assignedDate: string;
  status: 'active' | 'inactive' | 'pending';
  departmentCode: string;
  userName: string;
  phoneSetupComplete: boolean;
}

export interface ExtensionRange {
  department: string;
  departmentCode: string;
  startRange: number;
  endRange: number;
  color: string;
}

class FleetFlowExtensionService {
  private static instance: FleetFlowExtensionService;
  private extensionAssignments: Map<string, ExtensionAssignment> = new Map();
  private assignedExtensions: Set<number> = new Set();

  // Department-based extension ranges
  private extensionRanges: ExtensionRange[] = [
    {
      department: 'Management',
      departmentCode: 'MGR',
      startRange: 2000,
      endRange: 2099,
      color: '#8b5cf6',
    },
    {
      department: 'Dispatcher',
      departmentCode: 'DC',
      startRange: 3000,
      endRange: 3099,
      color: '#3b82f6',
    },
    {
      department: 'Broker Agent',
      departmentCode: 'BB',
      startRange: 4000,
      endRange: 4099,
      color: '#f97316',
    },
    {
      department: 'Sales',
      departmentCode: 'SL',
      startRange: 5000,
      endRange: 5099,
      color: '#ef4444',
    },
    {
      department: 'Driver Management',
      departmentCode: 'DM',
      startRange: 6000,
      endRange: 6099,
      color: '#eab308',
    },
    {
      department: 'Operations',
      departmentCode: 'OPS',
      startRange: 7000,
      endRange: 7099,
      color: '#10b981',
    },
    {
      department: 'Support',
      departmentCode: 'SUP',
      startRange: 8000,
      endRange: 8099,
      color: '#ec4899',
    },
  ];

  private constructor() {
    this.initializeDemoExtensions();
  }

  static getInstance(): FleetFlowExtensionService {
    if (!FleetFlowExtensionService.instance) {
      FleetFlowExtensionService.instance = new FleetFlowExtensionService();
    }
    return FleetFlowExtensionService.instance;
  }

  /**
   * Initialize demo extensions for existing users
   */
  private initializeDemoExtensions() {
    // Demo users with pre-assigned extensions
    const demoUsers = [
      {
        userId: 'DD-MGR-20240101-1',
        userIdentifier: 'DD-MGR-20240101-1',
        userName: 'David Davis',
        departmentCode: 'MGR',
        extension: 2001,
        phoneSetupComplete: true,
      },
      {
        userId: 'FM-MGR-2023005',
        userIdentifier: 'FM-MGR-2023005',
        userName: 'Frank Miller',
        departmentCode: 'MGR',
        extension: 2002,
        phoneSetupComplete: false,
      },
      {
        userId: 'SJ-DC-20240114-1',
        userIdentifier: 'SJ-DC-20240114-1',
        userName: 'Sarah Johnson',
        departmentCode: 'DC',
        extension: 3001,
        phoneSetupComplete: true,
      },
      {
        userId: 'MR-DC-20240115-2',
        userIdentifier: 'MR-DC-20240115-2',
        userName: 'Mike Rodriguez',
        departmentCode: 'DC',
        extension: 3002,
        phoneSetupComplete: false,
      },
      {
        userId: 'ED-BB-20240601-1',
        userIdentifier: 'ED-BB-20240601-1',
        userName: 'Emily Davis',
        departmentCode: 'BB',
        extension: 4001,
        phoneSetupComplete: true,
      },
      {
        userId: 'AL-SL-20240201-1',
        userIdentifier: 'AL-SL-20240201-1',
        userName: 'Amanda Lopez',
        departmentCode: 'SL',
        extension: 5001,
        phoneSetupComplete: true,
      },
      {
        userId: 'RT-SL-20240315-2',
        userIdentifier: 'RT-SL-20240315-2',
        userName: 'Robert Taylor',
        departmentCode: 'SL',
        extension: 5002,
        phoneSetupComplete: false,
      },
      {
        userId: 'JR-DM-20240315-1',
        userIdentifier: 'JR-DM-20240315-1',
        userName: 'John Rodriguez',
        departmentCode: 'DM',
        extension: 6001,
        phoneSetupComplete: false,
      },
    ];

    demoUsers.forEach((user) => {
      const assignment: ExtensionAssignment = {
        userId: user.userId,
        userIdentifier: user.userIdentifier,
        extension: user.extension,
        assignedDate: new Date().toISOString(),
        status: 'active',
        departmentCode: user.departmentCode,
        userName: user.userName,
        phoneSetupComplete: user.phoneSetupComplete,
      };

      this.extensionAssignments.set(user.userId, assignment);
      this.assignedExtensions.add(user.extension);
    });
  }

  /**
   * Get extension assignment for a user
   */
  getUserExtension(userId: string): ExtensionAssignment | null {
    return this.extensionAssignments.get(userId) || null;
  }

  /**
   * Assign a unique extension to a user
   */
  assignExtension(
    userId: string,
    userIdentifier: string,
    userName: string,
    departmentCode: string
  ): ExtensionAssignment {
    // Check if user already has an extension
    const existing = this.extensionAssignments.get(userId);
    if (existing) {
      return existing;
    }

    // Find the appropriate range for the department
    const range = this.extensionRanges.find(
      (r) => r.departmentCode === departmentCode
    );
    if (!range) {
      // Default to management range if department not found
      const defaultRange = this.extensionRanges.find(
        (r) => r.departmentCode === 'MGR'
      )!;
      range = defaultRange;
    }

    // Find next available extension in range
    let extension: number | null = null;
    for (let ext = range.startRange; ext <= range.endRange; ext++) {
      if (!this.assignedExtensions.has(ext)) {
        extension = ext;
        break;
      }
    }

    // If no extension available in primary range, find any available extension
    if (extension === null) {
      for (let ext = 2000; ext <= 9999; ext++) {
        if (!this.assignedExtensions.has(ext)) {
          extension = ext;
          break;
        }
      }
    }

    if (extension === null) {
      throw new Error('No available extensions');
    }

    // Create assignment
    const assignment: ExtensionAssignment = {
      userId,
      userIdentifier,
      extension,
      assignedDate: new Date().toISOString(),
      status: 'active',
      departmentCode,
      userName,
      phoneSetupComplete: false,
    };

    // Store assignment
    this.extensionAssignments.set(userId, assignment);
    this.assignedExtensions.add(extension);

    return assignment;
  }

  /**
   * Update phone setup completion status
   */
  updatePhoneSetupStatus(userId: string, completed: boolean): void {
    const assignment = this.extensionAssignments.get(userId);
    if (assignment) {
      assignment.phoneSetupComplete = completed;
      this.extensionAssignments.set(userId, assignment);
    }
  }

  /**
   * Get all extension assignments
   */
  getAllExtensions(): ExtensionAssignment[] {
    return Array.from(this.extensionAssignments.values());
  }

  /**
   * Get extensions by department
   */
  getExtensionsByDepartment(departmentCode: string): ExtensionAssignment[] {
    return Array.from(this.extensionAssignments.values()).filter(
      (assignment) => assignment.departmentCode === departmentCode
    );
  }

  /**
   * Check if extension is available
   */
  isExtensionAvailable(extension: number): boolean {
    return !this.assignedExtensions.has(extension);
  }

  /**
   * Get extension range for department
   */
  getDepartmentRange(departmentCode: string): ExtensionRange | null {
    return (
      this.extensionRanges.find((r) => r.departmentCode === departmentCode) ||
      null
    );
  }

  /**
   * Get extension statistics
   */
  getExtensionStatistics() {
    const stats = {
      totalAssigned: this.extensionAssignments.size,
      totalAvailable: 8000 - this.extensionAssignments.size, // 2000-9999 range
      byDepartment: {} as Record<string, number>,
      setupCompleted: 0,
      setupPending: 0,
    };

    this.extensionAssignments.forEach((assignment) => {
      // Count by department
      stats.byDepartment[assignment.departmentCode] =
        (stats.byDepartment[assignment.departmentCode] || 0) + 1;

      // Count setup status
      if (assignment.phoneSetupComplete) {
        stats.setupCompleted++;
      } else {
        stats.setupPending++;
      }
    });

    return stats;
  }

  /**
   * Release an extension (for user removal)
   */
  releaseExtension(userId: string): boolean {
    const assignment = this.extensionAssignments.get(userId);
    if (assignment) {
      this.extensionAssignments.delete(userId);
      this.assignedExtensions.delete(assignment.extension);
      return true;
    }
    return false;
  }

  /**
   * Format extension for display
   */
  formatExtension(extension: number): string {
    return `Ext. ${extension}`;
  }

  /**
   * Get department color for extension display
   */
  getDepartmentColor(departmentCode: string): string {
    const range = this.extensionRanges.find(
      (r) => r.departmentCode === departmentCode
    );
    return range?.color || '#6b7280';
  }
}

export default FleetFlowExtensionService;
