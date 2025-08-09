import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Import the service dynamically to avoid build issues
    const { WavePayrollService } = await import(
      '@/app/services/WavePayrollService'
    );
    const wavePayrollService = new WavePayrollService();

    switch (action) {
      case 'employees':
        const employees = await wavePayrollService.getEmployees();
        return NextResponse.json({ success: true, employees });

      case 'history':
        const limit = parseInt(searchParams.get('limit') || '10');
        const history = await wavePayrollService.getPayrollHistory(limit);
        return NextResponse.json({ success: true, history });

      case 'paystubs':
        const payrollRunId = searchParams.get('payrollRunId');
        if (!payrollRunId) {
          return NextResponse.json(
            { success: false, error: 'payrollRunId required' },
            { status: 400 }
          );
        }
        const payStubs =
          await wavePayrollService.generatePayStubs(payrollRunId);
        return NextResponse.json({ success: true, payStubs });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Wave Payroll API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Import the service dynamically to avoid build issues
    const { WavePayrollService } = await import(
      '@/app/services/WavePayrollService'
    );
    const wavePayrollService = new WavePayrollService();

    switch (action) {
      case 'create-employee':
        const { employee } = body;
        if (!employee) {
          return NextResponse.json(
            { success: false, error: 'Employee data required' },
            { status: 400 }
          );
        }
        const newEmployee = await wavePayrollService.createEmployee(employee);
        return NextResponse.json({ success: true, employee: newEmployee });

      case 'process-payroll':
        const { payrollData } = body;
        if (!payrollData) {
          return NextResponse.json(
            { success: false, error: 'Payroll data required' },
            { status: 400 }
          );
        }

        // Validate required fields
        if (
          !payrollData.payPeriodStart ||
          !payrollData.payPeriodEnd ||
          !payrollData.payDate ||
          !payrollData.employees
        ) {
          return NextResponse.json(
            {
              success: false,
              error:
                'Missing required fields: payPeriodStart, payPeriodEnd, payDate, employees',
            },
            { status: 400 }
          );
        }

        const payrollRun = await wavePayrollService.processPayroll(payrollData);
        return NextResponse.json({ success: true, payrollRun });

      case 'calculate-taxes':
        const { grossPay, employeeId } = body;
        if (!grossPay || !employeeId) {
          return NextResponse.json(
            { success: false, error: 'grossPay and employeeId required' },
            { status: 400 }
          );
        }
        const taxes = await wavePayrollService.calculateTaxes(
          grossPay,
          employeeId
        );
        return NextResponse.json({ success: true, taxes });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Wave Payroll API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
