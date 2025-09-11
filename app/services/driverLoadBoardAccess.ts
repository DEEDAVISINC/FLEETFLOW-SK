// 🔐 Driver Load Board Access Management Service
// Handles secure sharing of load board credentials between drivers and dispatchers

// Export the driverLoadBoardAccess service
export const driverLoadBoardAccess = {
  // Add methods as needed
};

export interface LoadBoardCredentials {
  id: string;
  driverId: string;
  dispatcherId: string;
  loadBoard: string; // Now supports any load board from comprehensive catalog
  username: string;
  encryptedPassword: string;
  isActive: boolean;
  permissions: LoadBoardPermission[];
  sharedDate: string;
  lastUsed: string;
  expiresAt?: string;
}

export interface LoadBoardPermission {
  action: 'view' | 'search' | 'contact_brokers' | 'post_loads';
  granted: boolean;
}

export interface LoadBoardStats {
  totalAccounts: number;
  activeAccounts: number;
  uniqueDrivers: number;
  activeLoadBoards: number;
  lastSyncTime: string;
}

export class DriverLoadBoardAccessService {
  private static instance: DriverLoadBoardAccessService;
  private credentials: Map<string, LoadBoardCredentials> = new Map();

  // Singleton pattern
  public static getInstance(): DriverLoadBoardAccessService {
    if (!DriverLoadBoardAccessService.instance) {
      DriverLoadBoardAccessService.instance =
        new DriverLoadBoardAccessService();
    }
    return DriverLoadBoardAccessService.instance;
  }

  // Driver shares load board access with dispatcher
  async shareLoadBoardAccess(data: {
    driverId: string;
    dispatcherId: string;
    loadBoard: LoadBoardCredentials['loadBoard'];
    username: string;
    password: string;
    permissions: LoadBoardPermission[];
    expiresAt?: string;
  }): Promise<string> {
    try {
      // Encrypt password before storage
      const encryptedPassword = await this.encryptPassword(data.password);

      const credentialId = `${data.driverId}_${data.loadBoard}_${Date.now()}`;

      const credentials: LoadBoardCredentials = {
        id: credentialId,
        driverId: data.driverId,
        dispatcherId: data.dispatcherId,
        loadBoard: data.loadBoard,
        username: data.username,
        encryptedPassword,
        isActive: true,
        permissions: data.permissions,
        sharedDate: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
        expiresAt: data.expiresAt,
      };

      // Store in memory for now - replace with database storage in production
      this.credentials.set(credentialId, credentials);

      // Log the sharing event
      console.info(
        `Driver ${data.driverId} shared ${data.loadBoard} access with dispatcher ${data.dispatcherId}`
      );

      return credentialId;
    } catch (error) {
      console.error('Failed to share load board access:', error);
      throw new Error('Failed to share load board access');
    }
  }

  // Get all load board accounts accessible to a dispatcher
  async getDispatcherLoadBoardAccess(
    dispatcherId: string
  ): Promise<LoadBoardCredentials[]> {
    const accessibleCredentials = Array.from(this.credentials.values()).filter(
      (cred) =>
        cred.dispatcherId === dispatcherId &&
        cred.isActive &&
        (!cred.expiresAt || new Date(cred.expiresAt) > new Date())
    );

    return accessibleCredentials;
  }

  // Get load board accounts for a specific load board
  async getLoadBoardAccounts(
    dispatcherId: string,
    loadBoard: string
  ): Promise<LoadBoardCredentials[]> {
    const allAccess = await this.getDispatcherLoadBoardAccess(dispatcherId);
    return allAccess.filter((access) => access.loadBoard === loadBoard);
  }

  // Update last used timestamp
  async markAccountUsed(credentialId: string): Promise<void> {
    const credentials = this.credentials.get(credentialId);
    if (credentials) {
      credentials.lastUsed = new Date().toISOString();
      this.credentials.set(credentialId, credentials);
    }
  }

  // Revoke access (called by driver or dispatcher)
  async revokeAccess(
    credentialId: string,
    requestedBy: string
  ): Promise<boolean> {
    const credentials = this.credentials.get(credentialId);
    if (!credentials) return false;

    // Verify the requester has permission to revoke
    if (
      credentials.driverId !== requestedBy &&
      credentials.dispatcherId !== requestedBy
    ) {
      throw new Error('Unauthorized to revoke access');
    }

    credentials.isActive = false;
    this.credentials.set(credentialId, credentials);

    console.info(
      `Load board access revoked for credential ${credentialId} by ${requestedBy}`
    );
    return true;
  }

  // Get credentials for authentication (returns decrypted password)
  async getCredentialsForAuth(
    credentialId: string
  ): Promise<{ username: string; password: string } | null> {
    const credentials = this.credentials.get(credentialId);
    if (!credentials || !credentials.isActive) return null;

    try {
      const decryptedPassword = await this.decryptPassword(
        credentials.encryptedPassword
      );
      await this.markAccountUsed(credentialId);

      return {
        username: credentials.username,
        password: decryptedPassword,
      };
    } catch (error) {
      console.error('Failed to decrypt credentials:', error);
      return null;
    }
  }

  // Get load board access statistics for dispatcher dashboard
  async getLoadBoardStats(dispatcherId: string): Promise<LoadBoardStats> {
    const accessibleCredentials =
      await this.getDispatcherLoadBoardAccess(dispatcherId);

    const uniqueDrivers = new Set(
      accessibleCredentials.map((cred) => cred.driverId)
    );
    const uniqueLoadBoards = new Set(
      accessibleCredentials.map((cred) => cred.loadBoard)
    );

    return {
      totalAccounts: accessibleCredentials.length,
      activeAccounts: accessibleCredentials.filter((cred) => cred.isActive)
        .length,
      uniqueDrivers: uniqueDrivers.size,
      activeLoadBoards: uniqueLoadBoards.size,
      lastSyncTime: new Date().toISOString(),
    };
  }

  // Get load board access summary for dispatcher portal
  async getLoadBoardSummary(dispatcherId: string): Promise<
    Array<{
      loadBoard: string;
      count: number;
      drivers: string[];
      lastUsed: string;
    }>
  > {
    const accessibleCredentials =
      await this.getDispatcherLoadBoardAccess(dispatcherId);

    // Group by load board
    const loadBoardGroups = accessibleCredentials.reduce(
      (groups, cred) => {
        if (!groups[cred.loadBoard]) {
          groups[cred.loadBoard] = [];
        }
        groups[cred.loadBoard].push(cred);
        return groups;
      },
      {} as Record<string, LoadBoardCredentials[]>
    );

    // Create summary for each load board
    return Object.entries(loadBoardGroups).map(([loadBoard, credentials]) => {
      const driverNames = credentials.map((cred) =>
        this.getDriverName(cred.driverId)
      );
      const lastUsed = credentials
        .map((cred) => new Date(cred.lastUsed))
        .sort((a, b) => b.getTime() - a.getTime())[0];

      return {
        loadBoard,
        count: credentials.length,
        drivers: [...new Set(driverNames)], // Remove duplicates
        lastUsed: lastUsed.toISOString().split('T')[0], // Format as YYYY-MM-DD
      };
    });
  }

  // Helper: Get driver name (mock implementation)
  private getDriverName(driverId: string): string {
    // Mock driver names - replace with actual driver lookup
    const driverNames: Record<string, string> = {
      'DRV-001': 'John Smith',
      'DRV-002': 'Maria Rodriguez',
      'DRV-003': 'David Wilson',
      'DRV-004': 'Sarah Johnson',
      'DRV-005': 'Mike Chen',
      'DRV-006': 'Lisa Garcia',
      'DRV-007': 'Robert Taylor',
      'DRV-008': 'Amanda White',
    };
    return driverNames[driverId] || `Driver ${driverId}`;
  }

  // Helper: Simple encryption (replace with proper encryption in production)
  private async encryptPassword(password: string): Promise<string> {
    // Basic Base64 encoding - replace with proper encryption (AES-256) in production
    return btoa(password);
  }

  // Helper: Simple decryption (replace with proper decryption in production)
  private async decryptPassword(encryptedPassword: string): Promise<string> {
    // Basic Base64 decoding - replace with proper decryption in production
    return atob(encryptedPassword);
  }

  // Initialize with mock data for development - Extended for Comprehensive Catalog
  async initializeMockData(): Promise<void> {
    // Mock sharing scenarios for traditional load boards
    await this.shareLoadBoardAccess({
      driverId: 'DRV-001',
      dispatcherId: 'DSP-001',
      loadBoard: 'dat',
      username: 'johnsmith_driver',
      password: 'demo123',
      permissions: [
        { action: 'view', granted: true },
        { action: 'search', granted: true },
        { action: 'contact_brokers', granted: true },
        { action: 'post_loads', granted: false },
      ],
    });

    await this.shareLoadBoardAccess({
      driverId: 'DRV-002',
      dispatcherId: 'DSP-001',
      loadBoard: 'truckstop',
      username: 'maria_rodriguez_cdl',
      password: 'demo456',
      permissions: [
        { action: 'view', granted: true },
        { action: 'search', granted: true },
        { action: 'contact_brokers', granted: true },
        { action: 'post_loads', granted: false },
      ],
    });

    await this.shareLoadBoardAccess({
      driverId: 'DRV-001',
      dispatcherId: 'DSP-001',
      loadBoard: '123loadboard',
      username: 'johnsmith_driver',
      password: 'demo789',
      permissions: [
        { action: 'view', granted: true },
        { action: 'search', granted: true },
        { action: 'contact_brokers', granted: false },
        { action: 'post_loads', granted: false },
      ],
    });

    // 🚀 NEW: Digital Freight Platforms
    await this.shareLoadBoardAccess({
      driverId: 'DRV-003',
      dispatcherId: 'DSP-001',
      loadBoard: 'spotinc',
      username: 'dwilson_carrier',
      password: 'demo101',
      permissions: [
        { action: 'view', granted: true },
        { action: 'search', granted: true },
        { action: 'contact_brokers', granted: true },
        { action: 'post_loads', granted: false },
      ],
    });

    await this.shareLoadBoardAccess({
      driverId: 'DRV-005',
      dispatcherId: 'DSP-001',
      loadBoard: 'convoy',
      username: 'mike_chen_logistics',
      password: 'demo202',
      permissions: [
        { action: 'view', granted: true },
        { action: 'search', granted: true },
        { action: 'contact_brokers', granted: true },
        { action: 'post_loads', granted: false },
      ],
    });

    // 🏢 NEW: Major Brokers
    await this.shareLoadBoardAccess({
      driverId: 'DRV-004',
      dispatcherId: 'DSP-001',
      loadBoard: 'tql',
      username: 'sarah_j_transport',
      password: 'demo303',
      permissions: [
        { action: 'view', granted: true },
        { action: 'search', granted: true },
        { action: 'contact_brokers', granted: true },
        { action: 'post_loads', granted: false },
      ],
    });

    await this.shareLoadBoardAccess({
      driverId: 'DRV-002',
      dispatcherId: 'DSP-001',
      loadBoard: 'ch_robinson',
      username: 'maria_rodriguez_cdl',
      password: 'demo404',
      permissions: [
        { action: 'view', granted: true },
        { action: 'search', granted: true },
        { action: 'contact_brokers', granted: true },
        { action: 'post_loads', granted: false },
      ],
    });

    console.info(
      'Comprehensive load board access data initialized with 7+ platforms'
    );
  }
}

// Export singleton instance
export const driverLoadBoardAccessService =
  DriverLoadBoardAccessService.getInstance();

// Initialize mock data in development
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    driverLoadBoardAccessService.initializeMockData();
  }, 1000);
}
