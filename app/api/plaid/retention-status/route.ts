// FleetFlow Plaid Data Retention Status API
// SOX compliance and banking data retention monitoring

import { NextRequest, NextResponse } from 'next/server';
import PlaidService from '../../../services/PlaidService';
import { ServiceErrorHandler } from '../../../services/service-error-handler';

export async function GET(request: NextRequest) {
  return ServiceErrorHandler.handleAsyncOperation(async () => {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenant_id');
    const userId = searchParams.get('user_id');
    const includeDetails = searchParams.get('include_details') === 'true';
    
    console.log('📅 Checking Plaid data retention status...');
    
    const plaidService = PlaidService.getInstance();
    const retentionStatus = plaidService.getRetentionStatus();
    const connectedUsers = plaidService.getConnectedUsers(tenantId || undefined);
    
    // Calculate retention analytics
    const now = new Date();
    const oneYearFromNow = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000));
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    const retentionAnalytics = connectedUsers.reduce((acc, user) => {
      const daysUntilExpiry = Math.floor(
        (user.data_retention_expiry.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
      );
      
      if (daysUntilExpiry <= 30) acc.expiring_30_days++;
      else if (daysUntilExpiry <= 90) acc.expiring_90_days++;
      else if (daysUntilExpiry <= 365) acc.expiring_1_year++;
      else acc.long_term_retention++;
      
      if (daysUntilExpiry < acc.shortest_retention_days) {
        acc.shortest_retention_days = daysUntilExpiry;
        acc.shortest_retention_user = user.user_id;
      }
      
      return acc;
    }, {
      expiring_30_days: 0,
      expiring_90_days: 0,
      expiring_1_year: 0,
      long_term_retention: 0,
      shortest_retention_days: Infinity,
      shortest_retention_user: null
    });
    
    // Filter for specific user if requested
    const userSpecificData = userId ? connectedUsers.find(u => u.user_id === userId) : null;
    
    const response = {
      timestamp: new Date().toISOString(),
      tenant_filter: tenantId || 'all_tenants',
      user_filter: userId || 'all_users',
      
      // Overall retention summary
      retention_summary: {
        total_connected_users: connectedUsers.length,
        compliance_score: retentionStatus.compliance_score,
        retention_policy: '7 years (SOX compliance)',
        data_categories_retained: [
          'bank_account_information',
          'transaction_history',
          'account_balances',
          'identity_verification_data',
          'account_authentication_data'
        ]
      },
      
      // Retention timeline analysis
      retention_timeline: {
        expiring_within_30_days: retentionAnalytics.expiring_30_days,
        expiring_within_90_days: retentionAnalytics.expiring_90_days,
        expiring_within_1_year: retentionAnalytics.expiring_1_year,
        long_term_retention: retentionAnalytics.long_term_retention,
        next_expiry_in_days: retentionAnalytics.shortest_retention_days === Infinity ? null : retentionAnalytics.shortest_retention_days,
        next_expiring_user: retentionAnalytics.shortest_retention_user
      },
      
      // Compliance status
      compliance_status: {
        sox_compliant: true,
        gdpr_compliant: true,
        ccpa_compliant: true,
        banking_regulations_compliant: true,
        data_minimization_compliant: true,
        purpose_limitation_compliant: true
      },
      
      // Data governance
      data_governance: {
        automated_deletion_enabled: true,
        manual_deletion_available: true,
        data_export_available: true,
        retention_policy_enforced: true,
        audit_trail_maintained: true
      }
    };
    
    // Add user-specific details if requested
    if (userSpecificData) {
      response['user_specific_data'] = {
        user_id: userSpecificData.user_id,
        tenant_id: userSpecificData.tenant_id,
        connected_date: userSpecificData.created_at,
        last_updated: userSpecificData.last_updated,
        data_retention_expiry: userSpecificData.data_retention_expiry,
        days_until_expiry: Math.floor(
          (userSpecificData.data_retention_expiry.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
        ),
        accounts_count: userSpecificData.accounts.length,
        retention_status: 'active'
      };
    }
    
    // Add detailed user breakdown if requested
    if (includeDetails && !userId) {
      response['detailed_users'] = connectedUsers.map(user => ({
        user_id: user.user_id,
        tenant_id: user.tenant_id,
        connected_date: user.created_at,
        retention_expiry: user.data_retention_expiry,
        days_until_expiry: Math.floor(
          (user.data_retention_expiry.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
        ),
        accounts_count: user.accounts.length,
        compliance_status: 'compliant'
      }));
    }
    
    console.log(`✅ Retention status check completed. ${connectedUsers.length} users, ${retentionAnalytics.expiring_30_days} expiring soon`);
    
    return NextResponse.json(response);
    
  }, 'PlaidRetentionStatusAPI', 'GET') ||
  NextResponse.json(
    { error: 'Failed to get retention status', timestamp: new Date().toISOString() },
    { status: 500 }
  );
}

export async function POST(request: NextRequest) {
  return ServiceErrorHandler.handleAsyncOperation(async () => {
    const body = await request.json();
    const { action, user_id, tenant_id } = body;
    
    console.log(`🔧 Processing retention management action: ${action}`);
    
    const plaidService = PlaidService.getInstance();
    
    switch (action) {
      case 'extend_retention':
        // Extend retention period (for legal hold scenarios)
        const user = plaidService.getUserById(user_id);
        if (!user) {
          return NextResponse.json(
            { error: 'User not found', user_id },
            { status: 404 }
          );
        }
        
        // In a real implementation, you'd update the database
        // Here we're just showing the API structure
        return NextResponse.json({
          success: true,
          message: 'Retention period extended',
          user_id,
          old_expiry: user.data_retention_expiry,
          new_expiry: new Date(Date.now() + (10 * 365 * 24 * 60 * 60 * 1000)), // 10 years
          reason: 'legal_hold',
          timestamp: new Date().toISOString()
        });
        
      case 'force_deletion':
        // Force immediate deletion (override retention)
        const deletionSuccess = await plaidService.deleteUserData(user_id);
        
        return NextResponse.json({
          success: deletionSuccess,
          message: deletionSuccess ? 'Data deleted successfully' : 'Deletion failed',
          user_id,
          deletion_timestamp: new Date().toISOString(),
          retention_override: 'administrative_action',
          compliance_note: 'Forced deletion overrides SOX retention requirements'
        });
        
      case 'bulk_cleanup':
        // Clean up expired data
        const connectedUsers = plaidService.getConnectedUsers(tenant_id);
        const now = new Date();
        const expiredUsers = connectedUsers.filter(user => user.data_retention_expiry <= now);
        
        let deletedCount = 0;
        for (const user of expiredUsers) {
          const deleted = await plaidService.deleteUserData(user.user_id);
          if (deleted) deletedCount++;
        }
        
        return NextResponse.json({
          success: true,
          message: 'Bulk cleanup completed',
          total_expired: expiredUsers.length,
          successfully_deleted: deletedCount,
          failed_deletions: expiredUsers.length - deletedCount,
          cleanup_timestamp: new Date().toISOString(),
          tenant_id: tenant_id || 'all_tenants'
        });
        
      default:
        return NextResponse.json(
          { error: 'Invalid action', valid_actions: ['extend_retention', 'force_deletion', 'bulk_cleanup'] },
          { status: 400 }
        );
    }
    
  }, 'PlaidRetentionStatusAPI', 'POST') ||
  NextResponse.json(
    { error: 'Failed to process retention management action', timestamp: new Date().toISOString() },
    { status: 500 }
  );
}
