// File: app/services/quickbooksService.ts
// Multi-Tenant QuickBooks Integration Service for FleetFlow
// Handles per-tenant QuickBooks connections, payroll, ACH, invoicing, and automatic withdrawals

export interface QuickBooksConnection {
  tenantId: string;
  accessToken: string;
  refreshToken: string;
  companyId: string;
  realmId: string;
  tokenExpiresAt: Date;
  companyName?: string;
  isConnected: boolean;
  features: {
    payroll: boolean;
    ach: boolean;
    invoicing: boolean;
    autoWithdrawal: boolean;
  };
  lastSyncAt?: Date;
  errorMessage?: string;
}

export interface QuickBooksInvoice {
  TxnDate?: string;
  TotalAmt?: number;
  Line: Array<{
    Description?: string;
    DetailType: string;
    SalesItemLineDetail?: {
      TaxCodeRef?: {
        value: string;
      };
      Qty?: number;
      UnitPrice?: number;
      ItemRef: {
        name: string;
        value: string;
      };
    };
    SubTotalLineDetail?: {};
    LineNum?: number;
    Amount?: number;
    Id?: string;
  }>;
  DueDate?: string;
  DocNumber?: string;
  CustomerRef: {
    name: string;
    value: string;
  };
  BillEmail?: {
    Address: string;
  };
  ShipAddr?: {
    City?: string;
    Line1?: string;
    PostalCode?: string;
    CountrySubDivisionCode?: string;
  };
  BillAddr?: {
    Line1?: string;
    City?: string;
    PostalCode?: string;
    CountrySubDivisionCode?: string;
  };
  CustomerMemo?: {
    value: string;
  };
  AllowOnlineACHPayment?: boolean;
  AllowOnlineCreditCardPayment?: boolean;
  AllowOnlinePayment?: boolean;
  AllowOnlineCheckPayment?: boolean;
  EmailStatus?: string;
  Balance?: number;
  Deposit?: number;
  SyncToken?: string;
  Id?: string;
  MetaData?: {
    CreateTime: string;
    LastUpdatedTime: string;
  };
}

export interface QuickBooksDeposit {
  SyncToken?: string;
  domain?: string;
  DepositToAccountRef: {
    name: string;
    value: string;
  };
  TxnDate: string;
  TotalAmt: number;
  Line: Array<{
    Amount: number;
    LinkedTxn?: Array<{
      TxnLineId: string;
      TxnId: string;
      TxnType: string;
    }>;
  }>;
  Id?: string;
  MetaData?: {
    CreateTime: string;
    LastUpdatedTime: string;
  };
}

export interface QuickBooksAccount {
  Name: string;
  AccountType: string;
  AccountSubType?: string;
  Classification?: string;
  Description?: string;
  CurrencyRef?: {
    value: string;
    name: string;
  };
  MetaData?: {
    CreateTime: string;
    LastUpdatedTime: string;
  };
  CurrentBalance?: number;
  CurrentBalanceWithSubAccounts?: number;
  Active?: boolean;
  SyncToken?: string;
  Id?: string;
  SubAccount?: boolean;
  FullyQualifiedName?: string;
  domain?: string;
  sparse?: boolean;
}

export interface QuickBooksPayrollData {
  employeeId: string;
  employeeName: string;
  payPeriod: string;
  hoursWorked: number;
  hourlyRate: number;
  grossPay: number;
  deductions: {
    federalTax: number;
    stateTax: number;
    socialSecurity: number;
    medicare: number;
    otherDeductions: number;
  };
  netPay: number;
  paymentMethod: 'direct_deposit' | 'check' | 'pay_card';
  bankAccount?: {
    accountNumber: string;
    routingNumber: string;
    accountType: 'checking' | 'savings';
  };
}

export interface QuickBooksACHData {
  customerId: string;
  customerName: string;
  bankAccount: {
    accountNumber: string;
    routingNumber: string;
    accountType: 'checking' | 'savings';
  };
  authorizationDate: string;
  amount: number;
  frequency: 'one_time' | 'weekly' | 'biweekly' | 'monthly';
  startDate: string;
  endDate?: string;
  description: string;
}

export class QuickBooksService {
  private static instance: QuickBooksService;
  private connections: Map<string, QuickBooksConnection> = new Map();
  private baseUrl: string;
  private environment: 'sandbox' | 'production';

  constructor() {
    this.environment = (process.env.QUICKBOOKS_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox';
    this.baseUrl = this.environment === 'production' 
      ? 'https://quickbooks.api.intuit.com'
      : 'https://sandbox-quickbooks.api.intuit.com';
  }

  public static getInstance(): QuickBooksService {
    if (!QuickBooksService.instance) {
      QuickBooksService.instance = new QuickBooksService();
    }
    return QuickBooksService.instance;
  }

  // Multi-Tenant Connection Management
  async connectTenant(tenantId: string, authCode: string, realmId: string): Promise<QuickBooksConnection> {
    try {
      // Exchange authorization code for access token
      const tokenResponse = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${process.env.QUICKBOOKS_CLIENT_ID}:${process.env.QUICKBOOKS_CLIENT_SECRET}`).toString('base64')}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: authCode,
          redirect_uri: process.env.QUICKBOOKS_REDIRECT_URI || 'http://localhost:3000/api/quickbooks/callback'
        })
      });

      const tokens = await tokenResponse.json();
      
      if (!tokenResponse.ok) {
        throw new Error(`QuickBooks OAuth error: ${tokens.error_description || tokens.error}`);
      }

      // Get company information
      const companyInfo = await this.getCompanyInfo(tokens.access_token, realmId);

      const connection: QuickBooksConnection = {
        tenantId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        companyId: realmId,
        realmId,
        tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        companyName: companyInfo.CompanyInfo?.CompanyName,
        isConnected: true,
        features: {
          payroll: true,
          ach: true,
          invoicing: true,
          autoWithdrawal: true
        },
        lastSyncAt: new Date()
      };

      this.connections.set(tenantId, connection);
      return connection;
    } catch (error) {
      console.error('QuickBooks connection error:', error);
      throw error;
    }
  }

  // Get company information
  async getCompanyInfo(accessToken: string, realmId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/v3/company/${realmId}/companyinfo/${realmId}?minorversion=75`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get company info: ${response.statusText}`);
    }

    return await response.json();
  }

  // Create invoice with ACH payment options
  async createInvoice(tenantId: string, invoiceData: QuickBooksInvoice): Promise<QuickBooksInvoice> {
    const connection = this.connections.get(tenantId);
    if (!connection || !connection.isConnected) {
      throw new Error('QuickBooks not connected for this tenant');
    }

    try {
      const response = await fetch(`${this.baseUrl}/v3/company/${connection.realmId}/invoice?minorversion=75`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ Invoice: invoiceData })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to create invoice: ${error.Fault?.Error?.[0]?.Message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('QuickBooks invoice creation error:', error);
      throw error;
    }
  }

  // Generate PDF invoice
  async getInvoicePDF(tenantId: string, invoiceId: string): Promise<Blob> {
    const connection = this.connections.get(tenantId);
    if (!connection || !connection.isConnected) {
      throw new Error('QuickBooks not connected for this tenant');
    }

    try {
      const response = await fetch(`${this.baseUrl}/v3/company/${connection.realmId}/invoice/${invoiceId}/pdf?minorversion=75`, {
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`,
          'Accept': 'application/pdf'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get invoice PDF: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('QuickBooks PDF generation error:', error);
      throw error;
    }
  }

  // Create deposit (payment received)
  async createDeposit(tenantId: string, depositData: QuickBooksDeposit): Promise<QuickBooksDeposit> {
    const connection = this.connections.get(tenantId);
    if (!connection || !connection.isConnected) {
      throw new Error('QuickBooks not connected for this tenant');
    }

    try {
      const response = await fetch(`${this.baseUrl}/v3/company/${connection.realmId}/deposit?minorversion=75`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ Deposit: depositData })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to create deposit: ${error.Fault?.Error?.[0]?.Message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('QuickBooks deposit creation error:', error);
      throw error;
    }
  }

  // Create account
  async createAccount(tenantId: string, accountData: QuickBooksAccount): Promise<QuickBooksAccount> {
    const connection = this.connections.get(tenantId);
    if (!connection || !connection.isConnected) {
      throw new Error('QuickBooks not connected for this tenant');
    }

    try {
      const response = await fetch(`${this.baseUrl}/v3/company/${connection.realmId}/account?minorversion=75`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ Account: accountData })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to create account: ${error.Fault?.Error?.[0]?.Message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('QuickBooks account creation error:', error);
      throw error;
    }
  }

  // Payroll Integration
  async syncPayroll(tenantId: string, payrollData: QuickBooksPayrollData): Promise<any> {
    const connection = this.connections.get(tenantId);
    if (!connection || !connection.isConnected) {
      throw new Error('QuickBooks not connected for this tenant');
    }

    try {
      // Create employee if doesn't exist
      const employee = await this.createOrUpdateEmployee(tenantId, {
        Name: payrollData.employeeName,
        PrimaryAddr: {
          Line1: 'Employee Address',
          City: 'City',
          CountrySubDivisionCode: 'State',
          PostalCode: '12345'
        },
        PrimaryEmailAddr: {
          Address: `${payrollData.employeeName.toLowerCase().replace(' ', '.')}@company.com`
        }
      });

      // Create payroll transaction
      const payrollTransaction = {
        TxnDate: new Date().toISOString().split('T')[0],
        Line: [
          {
            Description: `Payroll for ${payrollData.payPeriod}`,
            Amount: payrollData.grossPay,
            DetailType: 'AccountBasedExpenseLineDetail',
            AccountBasedExpenseLineDetail: {
              AccountRef: {
                value: '7', // Default expense account
                name: 'Payroll Expense'
              }
            }
          },
          {
            Description: 'Net Pay',
            Amount: -payrollData.netPay,
            DetailType: 'AccountBasedExpenseLineDetail',
            AccountBasedExpenseLineDetail: {
              AccountRef: {
                value: '35', // Default checking account
                name: 'Checking'
              }
            }
          }
        ]
      };

      const response = await fetch(`${this.baseUrl}/v3/company/${connection.realmId}/journalentry?minorversion=75`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ JournalEntry: payrollTransaction })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to sync payroll: ${error.Fault?.Error?.[0]?.Message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('QuickBooks payroll sync error:', error);
      throw error;
    }
  }

  // ACH Payment Processing
  async processACHPayment(tenantId: string, achData: QuickBooksACHData): Promise<any> {
    const connection = this.connections.get(tenantId);
    if (!connection || !connection.isConnected) {
      throw new Error('QuickBooks not connected for this tenant');
    }

    try {
      // Create customer if doesn't exist
      const customer = await this.createOrUpdateCustomer(tenantId, {
        Name: achData.customerName,
        PrimaryAddr: {
          Line1: 'Customer Address',
          City: 'City',
          CountrySubDivisionCode: 'State',
          PostalCode: '12345'
        }
      });

      // Create ACH payment method
      const paymentMethod = {
        Name: `ACH-${achData.customerName}`,
        Type: 'ACH',
        PaymentMethodType: 'ACH'
      };

      const paymentMethodResponse = await fetch(`${this.baseUrl}/v3/company/${connection.realmId}/paymentmethod?minorversion=75`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ PaymentMethod: paymentMethod })
      });

      if (!paymentMethodResponse.ok) {
        const error = await paymentMethodResponse.json();
        throw new Error(`Failed to create payment method: ${error.Fault?.Error?.[0]?.Message || paymentMethodResponse.statusText}`);
      }

      const paymentMethodData = await paymentMethodResponse.json();

      // Create recurring ACH transaction
      const recurringTransaction = {
        TxnDate: achData.startDate,
        Line: [
          {
            Description: achData.description,
            Amount: achData.amount,
            DetailType: 'AccountBasedExpenseLineDetail',
            AccountBasedExpenseLineDetail: {
              AccountRef: {
                value: '35', // Default checking account
                name: 'Checking'
              }
            }
          }
        ],
        RecurData: {
          RecurType: achData.frequency === 'one_time' ? 'Manual' : 'Automatic',
          RecurFrequency: achData.frequency === 'one_time' ? undefined : achData.frequency,
          RecurStartDate: achData.startDate,
          RecurEndDate: achData.endDate
        }
      };

      const response = await fetch(`${this.baseUrl}/v3/company/${connection.realmId}/recurringtransaction?minorversion=75`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ RecurringTransaction: recurringTransaction })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to process ACH payment: ${error.Fault?.Error?.[0]?.Message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('QuickBooks ACH payment error:', error);
      throw error;
    }
  }

  // Auto Withdrawal Setup
  async setupAutoWithdrawal(tenantId: string, withdrawalData: {
    customerId: string;
    amount: number;
    frequency: string;
    startDate: string;
    description: string;
  }): Promise<any> {
    const connection = this.connections.get(tenantId);
    if (!connection || !connection.isConnected) {
      throw new Error('QuickBooks not connected for this tenant');
    }

    try {
      // Create automatic withdrawal schedule
      const autoWithdrawal = {
        TxnDate: withdrawalData.startDate,
        Line: [
          {
            Description: withdrawalData.description,
            Amount: withdrawalData.amount,
            DetailType: 'AccountBasedExpenseLineDetail',
            AccountBasedExpenseLineDetail: {
              AccountRef: {
                value: '35', // Default checking account
                name: 'Checking'
              }
            }
          }
        ],
        RecurData: {
          RecurType: 'Automatic',
          RecurFrequency: withdrawalData.frequency,
          RecurStartDate: withdrawalData.startDate
        }
      };

      const response = await fetch(`${this.baseUrl}/v3/company/${connection.realmId}/recurringtransaction?minorversion=75`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ RecurringTransaction: autoWithdrawal })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to setup auto withdrawal: ${error.Fault?.Error?.[0]?.Message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('QuickBooks auto withdrawal error:', error);
      throw error;
    }
  }

  // Helper methods
  private async createOrUpdateEmployee(tenantId: string, employeeData: any): Promise<any> {
    const connection = this.connections.get(tenantId);
    if (!connection) throw new Error('QuickBooks not connected');

    try {
      const response = await fetch(`${this.baseUrl}/v3/company/${connection.realmId}/employee?minorversion=75`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ Employee: employeeData })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to create employee: ${error.Fault?.Error?.[0]?.Message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('QuickBooks employee creation error:', error);
      throw error;
    }
  }

  private async createOrUpdateCustomer(tenantId: string, customerData: any): Promise<any> {
    const connection = this.connections.get(tenantId);
    if (!connection) throw new Error('QuickBooks not connected');

    try {
      const response = await fetch(`${this.baseUrl}/v3/company/${connection.realmId}/customer?minorversion=75`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${connection.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ Customer: customerData })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to create customer: ${error.Fault?.Error?.[0]?.Message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('QuickBooks customer creation error:', error);
      throw error;
    }
  }

  // Get connection status
  getConnectionStatus(tenantId: string): QuickBooksConnection | null {
    return this.connections.get(tenantId) || null;
  }

  // Refresh token if expired
  async refreshToken(tenantId: string): Promise<boolean> {
    const connection = this.connections.get(tenantId);
    if (!connection) return false;

    if (new Date() < connection.tokenExpiresAt) return true;

    try {
      const response = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${process.env.QUICKBOOKS_CLIENT_ID}:${process.env.QUICKBOOKS_CLIENT_SECRET}`).toString('base64')}`
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: connection.refreshToken
        })
      });

      const tokens = await response.json();
      
      if (!response.ok) {
        connection.isConnected = false;
        connection.errorMessage = tokens.error_description || tokens.error;
        return false;
      }

      connection.accessToken = tokens.access_token;
      connection.refreshToken = tokens.refresh_token;
      connection.tokenExpiresAt = new Date(Date.now() + tokens.expires_in * 1000);
      connection.isConnected = true;
      connection.errorMessage = undefined;

      return true;
    } catch (error) {
      console.error('QuickBooks token refresh error:', error);
      connection.isConnected = false;
      connection.errorMessage = 'Token refresh failed';
      return false;
    }
  }

  // Disconnect tenant
  disconnectTenant(tenantId: string): void {
    this.connections.delete(tenantId);
  }
}

// Export singleton instance
export const quickBooksService = QuickBooksService.getInstance(); 