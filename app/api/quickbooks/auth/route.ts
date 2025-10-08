// File: app/api/quickbooks/auth/route.ts
// QuickBooks OAuth Authentication Route

import { NextRequest, NextResponse } from 'next/server';
import { quickBooksService } from '@/services/quickbooksService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const realmId = searchParams.get('realmId');
  const state = searchParams.get('state'); // Contains tenantId

  if (!code || !realmId || !state) {
    return NextResponse.redirect('/admin/settings/quickbooks?error=missing_parameters');
  }

  try {
    // Extract tenantId from state parameter
    const tenantId = state;

    // Connect tenant to QuickBooks
    const connection = await quickBooksService.connectTenant(tenantId, code, realmId);

    // Redirect back to settings page with success
    return NextResponse.redirect(`/admin/settings/quickbooks?success=true&tenantId=${tenantId}&companyName=${encodeURIComponent(connection.companyName || '')}`);
  } catch (error) {
    console.error('QuickBooks OAuth error:', error);
    return NextResponse.redirect(`/admin/settings/quickbooks?error=oauth_failed&message=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { tenantId, action } = await request.json();

    if (action === 'disconnect') {
      quickBooksService.disconnectTenant(tenantId);
      return NextResponse.json({ success: true, message: 'QuickBooks disconnected successfully' });
    }

    if (action === 'refresh') {
      const success = await quickBooksService.refreshToken(tenantId);
      return NextResponse.json({ 
        success, 
        message: success ? 'Token refreshed successfully' : 'Token refresh failed' 
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('QuickBooks API error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 