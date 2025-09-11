/**
 * Centralized User Identifier Service
 * Ensures consistent user ID generation and mapping across all systems
 */

interface UserIdentifierInfo {
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  departmentCode?: string;
  hiredDate?: string;
}

class UserIdentifierService {
  private static instance: UserIdentifierService;
  private userIdMap: Map<string, string> = new Map();
  private reverseMap: Map<string, string> = new Map();

  private constructor() {
    this.initializeDemoMappings();
  }

  public static getInstance(): UserIdentifierService {
    if (!UserIdentifierService.instance) {
      UserIdentifierService.instance = new UserIdentifierService();
    }
    return UserIdentifierService.instance;
  }

  /**
   * Initialize demo account mappings for consistent user IDs
   */
  private initializeDemoMappings(): void {
    const demoMappings = [
      { email: 'admin@fleetflowapp.com', userId: 'FM-MGR-20230115-1' },
      { email: 'dispatch@fleetflowapp.com', userId: 'SJ-DC-20240114-1' },
      { email: 'driver@fleetflowapp.com', userId: 'JD-DM-20240115-1' },
      { email: 'broker@fleetflowapp.com', userId: 'SW-BB-20240116-1' },
      { email: 'vendor@abcmanufacturing.com', userId: 'JM-VN-20240117-1' },
      { email: 'vendor@retaildist.com', userId: 'RD-VN-20240118-1' },
      { email: 'vendor@techsolutions.com', userId: 'TS-VN-20240119-1' },
    ];

    demoMappings.forEach(({ email, userId }) => {
      this.userIdMap.set(email, userId);
      this.reverseMap.set(userId, email);
    });
  }

  /**
   * Get or generate user ID for an email
   */
  public getUserId(email: string, userInfo?: UserIdentifierInfo): string {
    // First check if it's a demo account
    if (this.userIdMap.has(email)) {
      return this.userIdMap.get(email)!;
    }

    // For new users, generate a consistent ID
    if (userInfo) {
      return this.generateUserId(userInfo);
    }

    // Fallback for unknown emails
    const emailPrefix = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    return `U-${emailPrefix}-${Date.now().toString().slice(-6)}`;
  }

  /**
   * Get email from user ID
   */
  public getEmailFromUserId(userId: string): string | null {
    return this.reverseMap.get(userId) || null;
  }

  /**
   * Generate consistent user ID for new registrations
   */
  public generateUserId(userInfo: UserIdentifierInfo): string {
    const firstInitial = userInfo.firstName.charAt(0).toUpperCase();
    const lastInitial = userInfo.lastName.charAt(0).toUpperCase();

    // Get department code
    const departmentCode = this.getDepartmentCode(
      userInfo.department || 'Other'
    );

    // Use registration date or current date
    const dateStr =
      userInfo.hiredDate || new Date().toISOString().split('T')[0];
    const [year, month, day] = dateStr.split('-');
    const hireDateCode = `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`;

    // Generate sequence number based on email hash for consistency
    const sequenceNumber = this.generateSequenceNumber(userInfo.email);

    const userId = `${firstInitial}${lastInitial}-${departmentCode}-${hireDateCode}-${sequenceNumber}`;

    // Store the mapping for future lookups
    this.userIdMap.set(userInfo.email, userId);
    this.reverseMap.set(userId, userInfo.email);

    return userId;
  }

  /**
   * Generate consistent sequence number from email
   */
  private generateSequenceNumber(email: string): string {
    // Use email hash to generate consistent sequence number
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      const char = email.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Convert to positive number and limit to 3 digits
    const sequence = (Math.abs(hash) % 900) + 100;
    return sequence.toString();
  }

  /**
   * Get department code from department name
   */
  public getDepartmentCode(department: string): string {
    const codeMap: Record<string, string> = {
      Dispatch: 'DC',
      Brokerage: 'BB',
      'Driver Management': 'DM',
      'Executive Management': 'MGR',
      'Safety & Compliance': 'SC',
      Operations: 'OPS',
      'Customer Service': 'CS',
      'Sales & Marketing': 'SM',
      Other: 'OTH',
      Vendor: 'VN',
    };

    // Try exact match first
    if (codeMap[department]) {
      return codeMap[department];
    }

    // Try partial match
    const lowerDept = department.toLowerCase();
    for (const [key, value] of Object.entries(codeMap)) {
      if (lowerDept.includes(key.toLowerCase())) {
        return value;
      }
    }

    return 'USR'; // Default user code
  }

  /**
   * Validate user ID format
   */
  public isValidUserId(userId: string): boolean {
    // Format: XX-XXX-YYYYMMDD-NNN
    const pattern = /^[A-Z]{2}-[A-Z]{2,3}-\d{8}-\d{3}$/;
    return pattern.test(userId);
  }

  /**
   * Get all user ID mappings (for debugging)
   */
  public getAllMappings(): Record<string, string> {
    const mappings: Record<string, string> = {};
    this.userIdMap.forEach((userId, email) => {
      mappings[email] = userId;
    });
    return mappings;
  }

  /**
   * Register a new user ID mapping
   */
  public registerUserMapping(email: string, userId: string): void {
    this.userIdMap.set(email, userId);
    this.reverseMap.set(userId, email);
  }

  /**
   * Check if email is a demo account
   */
  public isDemoAccount(email: string): boolean {
    return this.userIdMap.has(email);
  }
}

export default UserIdentifierService;
export type { UserIdentifierInfo };
