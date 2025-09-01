'use client';

export interface ShipperAccount {
  id: string;
  goWithFlowId: string; // Unique customer-facing identifier
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  accountType: 'individual' | 'business';
  status: 'active' | 'pending' | 'suspended';
  createdDate: string;
  lastLogin?: string;
  preferences: {
    preferredEquipment: string[];
    defaultPickupRegions: string[];
    notificationSettings: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  billingInfo?: {
    paymentMethod: 'credit_card' | 'ach' | 'net_terms';
    creditLimit?: number;
    terms?: string;
  };
  shipmentHistory: ShipmentRequest[];
  totalShipments: number;
  totalSpent: number;
}

export interface ShipmentRequest {
  id: string;
  origin: string;
  destination: string;
  equipmentType: string;
  weight: number;
  pickupDate: string;
  deliveryDate: string;
  urgency: 'low' | 'medium' | 'high';
  status:
    | 'quote_requested'
    | 'quoted'
    | 'booked'
    | 'in_transit'
    | 'delivered'
    | 'cancelled';
  quotes: Quote[];
  selectedQuote?: string;
  createdDate: string;
}

export interface Quote {
  id: string;
  carrierId: string;
  carrierName: string;
  rate: number;
  eta: string;
  confidence: number;
  features: string[];
  validUntil: string;
}

export interface ShipperAccountCreationResult {
  success: boolean;
  account?: ShipperAccount;
  accessToken?: string;
  portalUrl?: string;
  message: string;
}

class ShipperAccountService {
  private storageKey = 'fleetflow_shipper_accounts';
  private lastGoWithFlowId = 0;

  // Generate unique Go with the Flow identifier
  private generateGoWithFlowId(): string {
    this.lastGoWithFlowId += 1;
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `GWF-${this.lastGoWithFlowId.toString().padStart(4, '0')}-${timestamp}-${random}`;
  }

  // Initialize last ID from existing accounts
  private initializeLastId(): void {
    const accounts = this.getAllAccounts();
    if (accounts.length > 0) {
      const ids = accounts
        .map((acc) => acc.goWithFlowId)
        .filter((id) => id && id.startsWith('GWF-'))
        .map((id) => {
          const match = id.match(/GWF-(\d+)-/);
          return match ? parseInt(match[1]) : 0;
        });
      this.lastGoWithFlowId = Math.max(...ids, 0);
    }
  }

  // Create new shipper account from quote request
  async createAccountFromQuoteRequest(
    loadRequest: any,
    contactInfo: {
      email: string;
      phone?: string;
      companyName?: string;
      contactName?: string;
    }
  ): Promise<ShipperAccountCreationResult> {
    try {
      // Check if account already exists
      const existingAccount = this.findAccountByEmail(contactInfo.email);

      if (existingAccount) {
        // Update existing account with new shipment
        const shipmentId = await this.addShipmentToAccount(
          existingAccount.id,
          loadRequest
        );
        const accessToken = this.generateAccessToken(existingAccount.id);
        const portalUrl = this.createDashboardUrl(existingAccount.id);

        return {
          success: true,
          account: existingAccount,
          accessToken,
          portalUrl,
          message: `Welcome back! Your quote request has been added to your existing account. Check your email for portal access.`,
        };
      }

      // Create new account
      const accountId = `shipper-${Date.now()}`;

      // Initialize last ID if needed
      if (this.lastGoWithFlowId === 0) {
        this.initializeLastId();
      }

      const newAccount: ShipperAccount = {
        id: accountId,
        goWithFlowId: this.generateGoWithFlowId(),
        companyName: contactInfo.companyName || 'Individual Shipper',
        contactName: contactInfo.contactName || 'Contact',
        email: contactInfo.email,
        phone: contactInfo.phone || '',
        address: {
          street: '',
          city: loadRequest.origin?.split(',')[0] || '',
          state: loadRequest.origin?.split(',')[1]?.trim() || '',
          zip: '',
        },
        accountType: contactInfo.companyName ? 'business' : 'individual',
        status: 'active',
        createdDate: new Date().toISOString(),
        preferences: {
          preferredEquipment: [loadRequest.equipmentType],
          defaultPickupRegions: [loadRequest.origin],
          notificationSettings: {
            email: true,
            sms: !!contactInfo.phone,
            push: false,
          },
        },
        shipmentHistory: [
          {
            id: `shipment-${Date.now()}`,
            origin: loadRequest.origin,
            destination: loadRequest.destination,
            equipmentType: loadRequest.equipmentType,
            weight: loadRequest.weight,
            pickupDate: loadRequest.pickupDate,
            deliveryDate: loadRequest.deliveryDate,
            urgency: loadRequest.urgency,
            status: 'quote_requested',
            quotes: [],
            createdDate: new Date().toISOString(),
          },
        ],
        totalShipments: 1,
        totalSpent: 0,
      };

      // Save to localStorage (in production, this would be a database)
      const accounts = this.getAllAccounts();
      accounts.push(newAccount);
      localStorage.setItem(this.storageKey, JSON.stringify(accounts));

      // Generate access credentials
      const accessToken = this.generateAccessToken(accountId);
      const portalUrl = this.createDashboardUrl(accountId);

      // Send welcome email
      await this.sendWelcomeEmail(newAccount, accessToken);

      return {
        success: true,
        account: newAccount,
        accessToken,
        portalUrl,
        message: `Account created successfully! Welcome to FleetFlow, ${contactInfo.contactName}. Check your email for portal access details.`,
      };
    } catch (error) {
      console.error('Error creating shipper account:', error);
      return {
        success: false,
        message:
          'Failed to create account. Please try again or contact support.',
      };
    }
  }

  // Add shipment to existing account
  async addShipmentToAccount(
    accountId: string,
    loadRequest: any
  ): Promise<string> {
    const accounts = this.getAllAccounts();
    const accountIndex = accounts.findIndex((acc) => acc.id === accountId);

    if (accountIndex !== -1) {
      const shipmentId = `shipment-${Date.now()}`;
      const newShipment: ShipmentRequest = {
        id: shipmentId,
        origin: loadRequest.origin,
        destination: loadRequest.destination,
        equipmentType: loadRequest.equipmentType,
        weight: loadRequest.weight,
        pickupDate: loadRequest.pickupDate,
        deliveryDate: loadRequest.deliveryDate,
        urgency: loadRequest.urgency,
        status: 'quote_requested',
        quotes: [],
        createdDate: new Date().toISOString(),
      };

      accounts[accountIndex].shipmentHistory.push(newShipment);
      accounts[accountIndex].totalShipments += 1;

      // Update preferences based on new request
      if (
        !accounts[accountIndex].preferences.preferredEquipment.includes(
          loadRequest.equipmentType
        )
      ) {
        accounts[accountIndex].preferences.preferredEquipment.push(
          loadRequest.equipmentType
        );
      }
      if (
        !accounts[accountIndex].preferences.defaultPickupRegions.includes(
          loadRequest.origin
        )
      ) {
        accounts[accountIndex].preferences.defaultPickupRegions.push(
          loadRequest.origin
        );
      }

      localStorage.setItem(this.storageKey, JSON.stringify(accounts));
      return shipmentId;
    }

    throw new Error('Account not found');
  }

  // Get all shipper accounts
  getAllAccounts(): ShipperAccount[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  // Find account by email
  findAccountByEmail(email: string): ShipperAccount | null {
    const accounts = this.getAllAccounts();
    return (
      accounts.find(
        (account) => account.email.toLowerCase() === email.toLowerCase()
      ) || null
    );
  }

  // Find account by ID
  findAccountById(accountId: string): ShipperAccount | null {
    const accounts = this.getAllAccounts();
    return accounts.find((account) => account.id === accountId) || null;
  }

  // Find account by Go with the Flow ID
  findAccountByGoWithFlowId(goWithFlowId: string): ShipperAccount | null {
    const accounts = this.getAllAccounts();
    return (
      accounts.find((account) => account.goWithFlowId === goWithFlowId) || null
    );
  }

  // Update account with quotes
  async updateAccountWithQuotes(
    accountId: string,
    shipmentId: string,
    quotes: Quote[]
  ): Promise<void> {
    const accounts = this.getAllAccounts();
    const accountIndex = accounts.findIndex((acc) => acc.id === accountId);

    if (accountIndex !== -1) {
      const shipmentIndex = accounts[accountIndex].shipmentHistory.findIndex(
        (s) => s.id === shipmentId
      );
      if (shipmentIndex !== -1) {
        accounts[accountIndex].shipmentHistory[shipmentIndex].quotes = quotes;
        accounts[accountIndex].shipmentHistory[shipmentIndex].status = 'quoted';
        localStorage.setItem(this.storageKey, JSON.stringify(accounts));
      }
    }
  }

  // Generate shipper portal access token
  generateAccessToken(accountId: string): string {
    // In production, this would be a secure JWT token
    return btoa(`${accountId}:${Date.now()}`);
  }

  // Send welcome email (mock implementation)
  async sendWelcomeEmail(
    account: ShipperAccount,
    accessToken: string
  ): Promise<void> {
    console.info(`📧 Welcome Email Sent to ${account.email}`);
    console.info(`🔐 Access Token: ${accessToken}`);
    console.info(
      `🌐 Portal URL: ${typeof window !== 'undefined' ? window.location.origin : 'https://fleetflowapp.com'}/shipper-portal?token=${accessToken}`
    );

    // Mock email content
    const emailContent = {
      to: account.email,
      subject: 'Welcome to FleetFlow - Your Shipper Account is Ready!',
      html: `
        <h2>Welcome to FleetFlow, ${account.contactName}!</h2>
        <p>Your shipper account has been created successfully. You now have access to:</p>
        <ul>
          <li>🚚 Request quotes anytime</li>
          <li>📊 Track all your shipments</li>
          <li>💰 View quote history</li>
          <li>⚡ Instant booking capabilities</li>
          <li>📱 Mobile-friendly dashboard</li>
        </ul>
        <p><strong>Account Details:</strong></p>
        <ul>
          <li><strong>Go with the Flow ID:</strong> ${account.goWithFlowId}</li>
          <li>Company: ${account.companyName}</li>
          <li>Email: ${account.email}</li>
        </ul>
        <p><a href="${typeof window !== 'undefined' ? window.location.origin : 'https://fleetflowapp.com'}/shipper-portal?token=${accessToken}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Access Your Portal</a></p>
        <p>Need help? Contact our support team at support@fleetflowapp.com</p>
      `,
    };

    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    console.info('📧 Email Content:', emailContent);
    return Promise.resolve();
  }

  // Create shipper dashboard URL
  createDashboardUrl(accountId: string): string {
    const token = this.generateAccessToken(accountId);
    return `${typeof window !== 'undefined' ? window.location.origin : 'https://fleetflowapp.com'}/shipper-portal?account=${accountId}&token=${token}`;
  }

  // Get account statistics
  getAccountStats(): {
    totalAccounts: number;
    totalShipments: number;
    totalRevenue: number;
    nextGoWithFlowId: string;
  } {
    const accounts = this.getAllAccounts();
    return {
      totalAccounts: accounts.length,
      totalShipments: accounts.reduce(
        (sum, acc) => sum + acc.totalShipments,
        0
      ),
      totalRevenue: accounts.reduce((sum, acc) => sum + acc.totalSpent, 0),
      nextGoWithFlowId: this.generateGoWithFlowId(),
    };
  }

  // Book shipment (when shipper accepts a quote)
  async bookShipment(
    accountId: string,
    shipmentId: string,
    quoteId: string
  ): Promise<boolean> {
    try {
      const accounts = this.getAllAccounts();
      const accountIndex = accounts.findIndex((acc) => acc.id === accountId);

      if (accountIndex !== -1) {
        const shipmentIndex = accounts[accountIndex].shipmentHistory.findIndex(
          (s) => s.id === shipmentId
        );
        if (shipmentIndex !== -1) {
          const selectedQuote = accounts[accountIndex].shipmentHistory[
            shipmentIndex
          ].quotes.find((q) => q.id === quoteId);
          if (selectedQuote) {
            accounts[accountIndex].shipmentHistory[shipmentIndex].status =
              'booked';
            accounts[accountIndex].shipmentHistory[
              shipmentIndex
            ].selectedQuote = quoteId;
            accounts[accountIndex].totalSpent += selectedQuote.rate;

            localStorage.setItem(this.storageKey, JSON.stringify(accounts));
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error('Error booking shipment:', error);
      return false;
    }
  }
}

export const shipperAccountService = new ShipperAccountService();
