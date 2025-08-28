// API endpoint for FleetFlow department email management

import { NextRequest, NextResponse } from 'next/server';
import { fleetFlowEmailService } from '../../../services/FleetFlowEmailService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'status':
        const status = await fleetFlowEmailService.getAliasStatus();
        return NextResponse.json(status);

      case 'directory':
        const directory = fleetFlowEmailService.generateEmailDirectory();
        return NextResponse.json(directory);

      case 'test':
        const testResults =
          await fleetFlowEmailService.testEmailConfiguration();
        return NextResponse.json(testResults);

      case 'contacts':
        const contacts = fleetFlowEmailService.getAllDepartmentContacts();
        return NextResponse.json({ success: true, contacts });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Department email API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, alias, email, defaultEmail } = body;

    switch (action) {
      case 'setup-all':
        const setupResult =
          await fleetFlowEmailService.setupAllDepartmentEmails(
            defaultEmail || 'ddavis@fleetflowapp.com'
          );
        return NextResponse.json(setupResult);

      case 'create-alias':
        if (!alias || !email) {
          return NextResponse.json(
            { success: false, error: 'Alias and email are required' },
            { status: 400 }
          );
        }
        const createResult = await fleetFlowEmailService.createDepartmentAlias(
          alias,
          email
        );
        return NextResponse.json(createResult);

      case 'update-alias':
        if (!alias || !email) {
          return NextResponse.json(
            { success: false, error: 'Alias and email are required' },
            { status: 400 }
          );
        }
        const updateResult = await fleetFlowEmailService.updateDepartmentEmail(
          alias,
          email
        );
        return NextResponse.json(updateResult);

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Department email API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const alias = searchParams.get('alias');

    if (!alias) {
      return NextResponse.json(
        { success: false, error: 'Alias parameter is required' },
        { status: 400 }
      );
    }

    const deleteResult =
      await fleetFlowEmailService.removeDepartmentAlias(alias);
    return NextResponse.json(deleteResult);
  } catch (error) {
    console.error('Department email API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
