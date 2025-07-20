/**
 * FleetFlow User Identification Service
 * User identification registry system with initials, department codes, and hire dates
 */

export interface UserIdentificationData {
  firstName: string;
  lastName: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Dispatcher' | 'Driver' | 'Broker Agent' | 'Carrier' | 'Shipper' | 'Viewer';
  department: string;
  hiredDate: string;
  phoneNumber?: string;
  location?: string;
}

export interface UserIdentifiers {
  userId: string;
  brokerInitials: string;
  departmentCode: string;
  hireDateCode: string;
  departmentColor: string;
  systemId: string;
  employeeCode: string;
  accessCode: string;
  securityLevel: number;
  additionalIdentifiers: {
    badgeNumber: string;
    emailPrefix: string;
    phoneExtension: string;
    parkingSpot: string;
    officeLocation: string;
    reportingCode: string;
  };
}

export interface BrokerInitialsData {
  initials: string;
  firstName: string;
  lastName: string;
  userId: string;
  department: string;
  departmentCode: string;
  departmentColor: string;
  isActive: boolean;
  assignedLoads: number;
  specializations: string[];
  region: string;
  hiredDate: string;
  performanceRating: number;
}

export class UserIdentificationService {
  // Department codes with colors as specified
  private static readonly DEPARTMENT_CODES = {
    'Dispatcher': { code: 'DC', color: 'blue' },
    'Dispatch': { code: 'DC', color: 'blue' },
    'Operations': { code: 'DC', color: 'blue' },
    'Broker': { code: 'BB', color: 'orange' },
    'Broker Agent': { code: 'BB', color: 'orange' },
    'Sales': { code: 'BB', color: 'orange' },
    'Driver': { code: 'DM', color: 'yellow' },
    'Management': { code: 'MGR', color: 'purple' },
    'Manager': { code: 'MGR', color: 'purple' },
    'Admin': { code: 'MGR', color: 'purple' },
    'Safety': { code: 'DC', color: 'blue' },
    'Maintenance': { code: 'DC', color: 'blue' },
    'Finance': { code: 'MGR', color: 'purple' },
    'HR': { code: 'MGR', color: 'purple' },
    'IT': { code: 'MGR', color: 'purple' },
    'Customer Service': { code: 'BB', color: 'orange' },
    'Legal': { code: 'MGR', color: 'purple' },
    'Accounting': { code: 'MGR', color: 'purple' },
    'Quality Control': { code: 'DC', color: 'blue' },
    'Training': { code: 'DC', color: 'blue' }
  };

  private static readonly SECURITY_LEVELS = {
    'Admin': 5,
    'Manager': 4,
    'Dispatcher': 3,
    'Broker Agent': 3,
    'Driver': 2,
    'Carrier': 2,
    'Shipper': 1,
    'Viewer': 1
  };

  /**
   * Generate user identifiers based on specified format:
   * Format: {UserInitials}-{DepartmentCode}-{HireDateCode}
   * Example: FM-DC-2024015
   */
  static generateUserIdentifiers(userData: UserIdentificationData): UserIdentifiers {
    const brokerInitials = this.generateBrokerInitials(userData.firstName, userData.lastName);
    const departmentInfo = this.getDepartmentInfo(userData.department, userData.role);
    const hireDateCode = this.generateHireDateCode(userData.hiredDate);
    const securityLevel = this.SECURITY_LEVELS[userData.role as keyof typeof this.SECURITY_LEVELS] || 1;
    const sequence = this.generateSequence();

    // Main user ID format: {UserInitials}-{DepartmentCode}-{HireDateCode}
    const userId = `${brokerInitials}-${departmentInfo.code}-${hireDateCode}`;

    // System ID for internal systems
    const systemId = `SYS-${brokerInitials}-${departmentInfo.code}-${hireDateCode}`;

    // Employee code for HR systems
    const employeeCode = `EMP-${brokerInitials}-${sequence}`;

    // Access code for security systems
    const accessCode = `ACC-${brokerInitials}-${sequence}`;

    return {
      userId,
      brokerInitials,
      departmentCode: departmentInfo.code,
      hireDateCode,
      departmentColor: departmentInfo.color,
      systemId,
      employeeCode,
      accessCode,
      securityLevel,
      additionalIdentifiers: {
        badgeNumber: `BADGE-${brokerInitials}-${sequence}`,
        emailPrefix: `${userData.firstName.toLowerCase()}.${userData.lastName.toLowerCase()}`,
        phoneExtension: `${1000 + parseInt(sequence)}`,
        parkingSpot: `${departmentInfo.code}-${sequence}`,
        officeLocation: `${departmentInfo.code}-${Math.floor(parseInt(sequence) / 100) + 1}`,
        reportingCode: `RPT-${departmentInfo.code}-${brokerInitials}`
      }
    };
  }

  /**
   * Generate broker initials with conflict resolution
   */
  private static generateBrokerInitials(firstName: string, lastName: string): string {
    // Safety check for undefined values
    const safeFirstName = firstName || 'Unknown';
    const safeLastName = lastName || 'User';
    
    const baseInitials = `${safeFirstName.charAt(0)}${safeLastName.charAt(0)}`.toUpperCase();
    
    // In a real system, check for conflicts and append number if needed
    // For now, return base initials
    return baseInitials;
  }

  /**
   * Generate hire date code (YYYYDDD format - year first, then day of year)
   */
  private static generateHireDateCode(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return `${year}${dayOfYear.toString().padStart(3, '0')}`;
  }

  /**
   * Get department information (code and color)
   */
  private static getDepartmentInfo(department: string, role: string): { code: string; color: string } {
    // Check department first
    let deptInfo = this.DEPARTMENT_CODES[department as keyof typeof this.DEPARTMENT_CODES];
    
    // If not found, check role
    if (!deptInfo) {
      deptInfo = this.DEPARTMENT_CODES[role as keyof typeof this.DEPARTMENT_CODES];
    }
    
    // Default to DC (blue) if nothing found
    return deptInfo || { code: 'DC', color: 'blue' };
  }

  /**
   * Generate sequence number
   */
  private static generateSequence(): string {
    return Math.floor(Math.random() * 999).toString().padStart(3, '0');
  }

  /**
   * Get color value for department
   */
  static getDepartmentColor(departmentCode: string): string {
    switch (departmentCode) {
      case 'DC': return '#3b82f6'; // blue
      case 'BB': return '#f97316'; // orange
      case 'DM': return '#eab308'; // yellow
      case 'MGR': return '#8b5cf6'; // purple
      default: return '#6b7280'; // gray
    }
  }

  /**
   * Get color name for department
   */
  static getDepartmentColorName(departmentCode: string): string {
    switch (departmentCode) {
      case 'DC': return 'blue';
      case 'BB': return 'orange';
      case 'DM': return 'yellow';
      case 'MGR': return 'purple';
      default: return 'gray';
    }
  }

  /**
   * Get active broker initials data
   */
  static getActiveBrokerInitials(): BrokerInitialsData[] {
    return [
      {
        initials: 'FM',
        firstName: 'Frank',
        lastName: 'Miller',
        userId: 'FM-MGR-2023005',
        department: 'Management',
        departmentCode: 'MGR',
        departmentColor: 'purple',
        isActive: true,
        assignedLoads: 0,
        specializations: ['Administration', 'System Management'],
        region: 'Southeast',
        hiredDate: '2023-01-05',
        performanceRating: 4.9
      },
      {
        initials: 'SJ',
        firstName: 'Sarah',
        lastName: 'Johnson',
        userId: 'SJ-DC-2024014',
        department: 'Dispatcher',
        departmentCode: 'DC',
        departmentColor: 'blue',
        isActive: true,
        assignedLoads: 45,
        specializations: ['Route Planning', 'Driver Coordination'],
        region: 'Southeast',
        hiredDate: '2024-01-14',
        performanceRating: 4.7
      },
      {
        initials: 'JS',
        firstName: 'John',
        lastName: 'Smith',
        userId: 'JS-DM-2024031',
        department: 'Driver',
        departmentCode: 'DM',
        departmentColor: 'yellow',
        isActive: true,
        assignedLoads: 28,
        specializations: ['Long Haul', 'Hazmat'],
        region: 'Southwest',
        hiredDate: '2024-01-31',
        performanceRating: 4.5
      },
      {
        initials: 'ED',
        firstName: 'Emily',
        lastName: 'Davis',
        userId: 'ED-BB-2024061',
        department: 'Broker Agent',
        departmentCode: 'BB',
        departmentColor: 'orange',
        isActive: true,
        assignedLoads: 52,
        specializations: ['Customer Relations', 'Load Matching'],
        region: 'West',
        hiredDate: '2024-03-01',
        performanceRating: 4.8
      },
      {
        initials: 'MW',
        firstName: 'Mike',
        lastName: 'Wilson',
        userId: 'MW-MGR-2024046',
        department: 'Management',
        departmentCode: 'MGR',
        departmentColor: 'purple',
        isActive: true,
        assignedLoads: 0,
        specializations: ['Financial Management', 'Team Leadership'],
        region: 'Midwest',
        hiredDate: '2024-02-15',
        performanceRating: 4.6
      }
    ];
  }

  /**
   * Parse user ID to extract components
   */
  static parseUserId(userId: string): {
    brokerInitials: string;
    departmentCode: string;
    hireDateCode: string;
    year: string;
    dayOfYear: string;
  } | null {
    const parts = userId.split('-');
    if (parts.length !== 3) return null;

    const hireDateCode = parts[2];
    const year = hireDateCode.substring(0, 4);
    const dayOfYear = hireDateCode.substring(4);

    return {
      brokerInitials: parts[0],
      departmentCode: parts[1],
      hireDateCode: parts[2],
      year: year,
      dayOfYear: dayOfYear
    };
  }

  /**
   * Validate broker initials availability
   */
  static validateBrokerInitials(initials: string, excludeUserId?: string): boolean {
    const existingBrokers = this.getActiveBrokerInitials();
    return !existingBrokers.some(broker => 
      broker.initials === initials && broker.userId !== excludeUserId
    );
  }

  /**
   * Get user by broker initials
   */
  static getUserByBrokerInitials(initials: string): BrokerInitialsData | null {
    const brokers = this.getActiveBrokerInitials();
    return brokers.find(broker => broker.initials === initials) || null;
  }

  /**
   * Get department statistics
   */
  static getDepartmentStats(): Record<string, { count: number; color: string; colorName: string }> {
    const brokers = this.getActiveBrokerInitials();
    const stats: Record<string, { count: number; color: string; colorName: string }> = {};

    brokers.forEach(broker => {
      if (!stats[broker.departmentCode]) {
        stats[broker.departmentCode] = {
          count: 0,
          color: this.getDepartmentColor(broker.departmentCode),
          colorName: this.getDepartmentColorName(broker.departmentCode)
        };
      }
      stats[broker.departmentCode].count++;
    });

    return stats;
  }
}

export default UserIdentificationService; 