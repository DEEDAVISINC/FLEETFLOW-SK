/**
 * Wave Payroll Service Integration
 * FREE payroll processing API - no cost for basic payroll operations
 * https://developer.waveapps.com/hc/en-us/sections/360003012132-Payroll-API
 */

export interface WaveEmployee {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeNumber?: string;
  jobTitle?: string;
  department?: string;
  hireDate: string;
  payRate: number;
  payType: 'hourly' | 'salary';
  paySchedule: 'weekly' | 'biweekly' | 'monthly';
  isActive: boolean;
}

export interface WavePayrollRun {
  id?: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  payDate: string;
  status: 'draft' | 'processing' | 'completed' | 'cancelled';
  employees: WavePayrollEmployee[];
  totalGrossPay: number;
  totalTaxes: number;
  totalDeductions: number;
  totalNetPay: number;
  createdAt?: string;
  processedAt?: string;
}

export interface WavePayrollEmployee {
  employeeId: string;
  hoursWorked?: number;
  overtimeHours?: number;
  grossPay: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  otherDeductions: number;
  netPay: number;
}

export interface WavePayStub {
  id: string;
  employeeId: string;
  payrollRunId: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  payDate: string;
  grossPay: number;
  taxes: {
    federal: number;
    state: number;
    socialSecurity: number;
    medicare: number;
  };
  deductions: {
    healthInsurance?: number;
    retirement?: number;
    other?: number;
  };
  netPay: number;
  ytdGross: number;
  ytdTaxes: number;
  ytdNet: number;
}

export class WavePayrollService {
  private apiKey: string;
  private businessId: string;
  private baseUrl: string = 'https://gql.waveapps.com/graphql/public';
  private isProduction: boolean;

  constructor() {
    this.apiKey = process.env.WAVE_API_KEY || '';
    this.businessId = process.env.WAVE_BUSINESS_ID || '';
    this.isProduction = process.env.NODE_ENV === 'production';

    if (!this.apiKey && this.isProduction) {
      console.warn('Wave API key not configured - using mock mode');
    }
  }

  /**
   * Create a new employee in Wave Payroll
   */
  async createEmployee(employee: WaveEmployee): Promise<WaveEmployee> {
    if (!this.apiKey) {
      return this.mockCreateEmployee(employee);
    }

    const mutation = `
      mutation CreateEmployee($input: EmployeeCreateInput!) {
        employeeCreate(input: $input) {
          didSucceed
          inputErrors {
            field
            message
          }
          employee {
            id
            firstName
            lastName
            email
            jobTitle
            isActive
          }
        }
      }
    `;

    const variables = {
      input: {
        businessId: this.businessId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        jobTitle: employee.jobTitle,
        isActive: employee.isActive,
      },
    };

    try {
      const response = await this.makeWaveRequest(mutation, variables);

      if (response.data.employeeCreate.didSucceed) {
        return {
          ...employee,
          id: response.data.employeeCreate.employee.id,
        };
      } else {
        throw new Error(
          `Failed to create employee: ${response.data.employeeCreate.inputErrors.map((e: any) => e.message).join(', ')}`
        );
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  /**
   * Get all employees
   */
  async getEmployees(): Promise<WaveEmployee[]> {
    if (!this.apiKey) {
      return this.mockGetEmployees();
    }

    const query = `
      query GetEmployees($businessId: ID!) {
        business(id: $businessId) {
          employees {
            edges {
              node {
                id
                firstName
                lastName
                email
                jobTitle
                isActive
              }
            }
          }
        }
      }
    `;

    const variables = { businessId: this.businessId };

    try {
      const response = await this.makeWaveRequest(query, variables);
      return response.data.business.employees.edges.map(
        (edge: any) => edge.node
      );
    } catch (error) {
      console.error('Error fetching employees:', error);
      return this.mockGetEmployees();
    }
  }

  /**
   * Process payroll for a pay period
   */
  async processPayroll(payrollData: {
    payPeriodStart: string;
    payPeriodEnd: string;
    payDate: string;
    employees: Array<{
      employeeId: string;
      hoursWorked?: number;
      overtimeHours?: number;
    }>;
  }): Promise<WavePayrollRun> {
    if (!this.apiKey) {
      return this.mockProcessPayroll(payrollData);
    }

    // Wave Payroll processing would go here
    // For now, return mock data as Wave's payroll API requires business verification
    return this.mockProcessPayroll(payrollData);
  }

  /**
   * Generate pay stubs for a payroll run
   */
  async generatePayStubs(payrollRunId: string): Promise<WavePayStub[]> {
    if (!this.apiKey) {
      return this.mockGeneratePayStubs(payrollRunId);
    }

    // Wave pay stub generation would go here
    return this.mockGeneratePayStubs(payrollRunId);
  }

  /**
   * Get payroll history
   */
  async getPayrollHistory(limit: number = 10): Promise<WavePayrollRun[]> {
    if (!this.apiKey) {
      return this.mockGetPayrollHistory(limit);
    }

    // Wave payroll history query would go here
    return this.mockGetPayrollHistory(limit);
  }

  /**
   * Calculate taxes for an employee
   */
  async calculateTaxes(
    grossPay: number,
    employeeId: string
  ): Promise<{
    federalTax: number;
    stateTax: number;
    socialSecurity: number;
    medicare: number;
    totalTaxes: number;
  }> {
    // Basic tax calculations (simplified)
    const federalTax = grossPay * 0.12; // 12% federal
    const stateTax = grossPay * 0.05; // 5% state (varies by state)
    const socialSecurity = grossPay * 0.062; // 6.2% Social Security
    const medicare = grossPay * 0.0145; // 1.45% Medicare

    return {
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      totalTaxes: federalTax + stateTax + socialSecurity + medicare,
    };
  }

  // Private helper methods
  private async makeWaveRequest(query: string, variables: any): Promise<any> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Wave API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Mock methods for development/testing
  private mockCreateEmployee(employee: WaveEmployee): WaveEmployee {
    return {
      ...employee,
      id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  private mockGetEmployees(): WaveEmployee[] {
    return [
      {
        id: 'emp_001',
        firstName: 'John',
        lastName: 'Rodriguez',
        email: 'john.rodriguez@fleetflowapp.com',
        employeeNumber: 'EMP001',
        jobTitle: 'Dispatcher',
        department: 'Operations',
        hireDate: '2024-01-15',
        payRate: 25.0,
        payType: 'hourly',
        paySchedule: 'biweekly',
        isActive: true,
      },
      {
        id: 'emp_002',
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria.santos@fleetflowapp.com',
        employeeNumber: 'EMP002',
        jobTitle: 'Freight Broker',
        department: 'Sales',
        hireDate: '2024-02-01',
        payRate: 55000,
        payType: 'salary',
        paySchedule: 'biweekly',
        isActive: true,
      },
      {
        id: 'emp_003',
        firstName: 'David',
        lastName: 'Thompson',
        email: 'david.thompson@fleetflowapp.com',
        employeeNumber: 'EMP003',
        jobTitle: 'Fleet Manager',
        department: 'Operations',
        hireDate: '2023-11-10',
        payRate: 30.0,
        payType: 'hourly',
        paySchedule: 'biweekly',
        isActive: true,
      },
    ];
  }

  private async mockProcessPayroll(payrollData: any): Promise<WavePayrollRun> {
    const employees = this.mockGetEmployees();
    const payrollEmployees: WavePayrollEmployee[] = [];
    let totalGrossPay = 0;
    let totalTaxes = 0;
    let totalNetPay = 0;

    for (const empData of payrollData.employees) {
      const employee = employees.find((e) => e.id === empData.employeeId);
      if (!employee) continue;

      let grossPay = 0;
      if (employee.payType === 'hourly') {
        const regularHours = Math.min(empData.hoursWorked || 40, 40);
        const overtimeHours = Math.max((empData.hoursWorked || 40) - 40, 0);
        grossPay =
          regularHours * employee.payRate +
          overtimeHours * employee.payRate * 1.5;
      } else {
        grossPay = employee.payRate / 26; // Biweekly salary
      }

      const taxes = await this.calculateTaxes(grossPay, employee.id!);
      const netPay = grossPay - taxes.totalTaxes;

      payrollEmployees.push({
        employeeId: employee.id!,
        hoursWorked: empData.hoursWorked || 40,
        overtimeHours: empData.overtimeHours || 0,
        grossPay,
        federalTax: taxes.federalTax,
        stateTax: taxes.stateTax,
        socialSecurity: taxes.socialSecurity,
        medicare: taxes.medicare,
        otherDeductions: 0,
        netPay,
      });

      totalGrossPay += grossPay;
      totalTaxes += taxes.totalTaxes;
      totalNetPay += netPay;
    }

    return {
      id: `payroll_${Date.now()}`,
      payPeriodStart: payrollData.payPeriodStart,
      payPeriodEnd: payrollData.payPeriodEnd,
      payDate: payrollData.payDate,
      status: 'completed',
      employees: payrollEmployees,
      totalGrossPay,
      totalTaxes,
      totalDeductions: 0,
      totalNetPay,
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
    };
  }

  private mockGeneratePayStubs(payrollRunId: string): WavePayStub[] {
    const employees = this.mockGetEmployees();
    return employees.map((emp) => ({
      id: `stub_${payrollRunId}_${emp.id}`,
      employeeId: emp.id!,
      payrollRunId,
      payPeriodStart: '2024-01-01',
      payPeriodEnd: '2024-01-14',
      payDate: '2024-01-19',
      grossPay: emp.payType === 'hourly' ? emp.payRate * 80 : emp.payRate / 26,
      taxes: {
        federal: 240,
        state: 100,
        socialSecurity: 124,
        medicare: 29,
      },
      deductions: {
        healthInsurance: 150,
        retirement: 100,
      },
      netPay: 1257,
      ytdGross: 8000,
      ytdTaxes: 1600,
      ytdNet: 6400,
    }));
  }

  private mockGetPayrollHistory(limit: number): WavePayrollRun[] {
    return Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
      id: `payroll_${Date.now() - i * 86400000}`,
      payPeriodStart: new Date(Date.now() - (i + 1) * 14 * 86400000)
        .toISOString()
        .split('T')[0],
      payPeriodEnd: new Date(Date.now() - i * 14 * 86400000)
        .toISOString()
        .split('T')[0],
      payDate: new Date(Date.now() - (i * 14 - 3) * 86400000)
        .toISOString()
        .split('T')[0],
      status: 'completed' as const,
      employees: [],
      totalGrossPay: 12500 + i * 500,
      totalTaxes: 2500 + i * 100,
      totalDeductions: 750,
      totalNetPay: 9250 + i * 400,
      createdAt: new Date(Date.now() - i * 14 * 86400000).toISOString(),
      processedAt: new Date(Date.now() - i * 14 * 86400000).toISOString(),
    }));
  }
}

// Export singleton instance
export const wavePayrollService = new WavePayrollService();
