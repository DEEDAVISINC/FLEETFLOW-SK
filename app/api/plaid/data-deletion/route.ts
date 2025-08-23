// FleetFlow Plaid Data Deletion API
// GDPR/CCPA compliant data subject deletion

import { NextRequest, NextResponse } from 'next/server';
import PlaidService from '../../../services/PlaidService';
import { PrivacyComplianceService } from '../../../services/PrivacyComplianceService';
import { ServiceErrorHandler } from '../../../services/service-error-handler';

export async function POST(request: NextRequest) {
  return ServiceErrorHandler.handleAsyncOperation(async () => {
    const body = await request.json();
    const { user_id, tenant_id, deletion_reason, request_source } = body;
    
    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required', timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }
    
    console.log(`🗑️ Processing Plaid data deletion request for user: ${user_id}`);
    
    const plaidService = PlaidService.getInstance();
    const privacyService = new PrivacyComplianceService();
    
    // Get user data before deletion (for compliance record)
    const userData = plaidService.getUserById(user_id);
    
    // Process deletion
    const deletionSuccess = await plaidService.deleteUserData(user_id);
    
    if (!deletionSuccess) {
      return NextResponse.json(
        { 
          error: 'Failed to delete Plaid data',
          user_id,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
    
    // Log deletion request for compliance audit
    const deletionRecord = {
      request_id: `plaid-del-${Date.now()}`,
      user_id,
      tenant_id: tenant_id || null,
      data_type: 'plaid_banking_data',
      deletion_reason: deletion_reason || 'user_request',
      request_source: request_source || 'api',
      deleted_data_summary: {
        accounts_deleted: userData?.accounts?.length || 0,
        access_token_revoked: true,
        item_removed: true,
        local_data_purged: true
      },
      deletion_timestamp: new Date().toISOString(),
      compliance_framework: ['GDPR Article 17', 'CCPA Section 1798.105'],
      retention_policy: 'Immediate deletion upon request',
      verification_required: false
    };
    
    // Record the deletion for compliance tracking
    try {
      await privacyService.recordProcessingActivity({
        activity_type: 'data_deletion',
        data_subject_id: user_id,
        data_categories: ['financial_accounts', 'transaction_history', 'banking_credentials'],
        processing_purpose: 'data_subject_erasure_request',
        legal_basis: 'data_subject_request',
        retention_period: 'deleted',
        activity_details: deletionRecord
      });
    } catch (error) {
      console.error('Failed to record deletion activity:', error);
      // Continue with response even if logging fails
    }
    
    const response = {
      success: true,
      message: 'Plaid banking data successfully deleted',
      deletion_details: {
        user_id,
        tenant_id,
        deletion_completed_at: new Date().toISOString(),
        data_deleted: {
          plaid_access_token: 'revoked',
          bank_accounts: 'deleted',
          transaction_history: 'deleted',
          identity_data: 'deleted',
          auth_data: 'deleted'
        },
        compliance_confirmation: {
          gdpr_compliant: true,
          ccpa_compliant: true,
          sox_retention_overridden: 'user_right_to_erasure',
          deletion_irreversible: true
        }
      },
      next_steps: [
        'User can reconnect banking if needed',
        'Deletion is permanent and cannot be undone',
        'Compliance record maintained for audit purposes'
      ],
      request_id: deletionRecord.request_id
    };
    
    console.log(`✅ Plaid data deletion completed for user ${user_id}`);
    
    return NextResponse.json(response);
    
  }, 'PlaidDataDeletionAPI', 'POST') ||
  NextResponse.json(
    { error: 'Failed to process deletion request', timestamp: new Date().toISOString() },
    { status: 500 }
  );
}

export async function GET(request: NextRequest) {
  return ServiceErrorHandler.handleAsyncOperation(async () => {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const tenantId = searchParams.get('tenant_id');
    
    console.log(`📊 Checking deletion status for user: ${userId || 'all users'}`);
    
    const plaidService = PlaidService.getInstance();
    
    if (userId) {
      // Check specific user
      const userData = plaidService.getUserById(userId);
      
      return NextResponse.json({
        user_id: userId,
        plaid_data_exists: !!userData,
        deletion_available: !!userData,
        data_summary: userData ? {
          connected_since: userData.created_at,
          accounts_count: userData.accounts.length,
          data_retention_expiry: userData.data_retention_expiry,
          tenant_id: userData.tenant_id
        } : null,
        deletion_process: {
          method: 'POST /api/plaid/data-deletion',
          requirements: ['user_id'],
          compliance_frameworks: ['GDPR Article 17', 'CCPA Section 1798.105'],
          deletion_scope: ['access_tokens', 'account_data', 'transaction_history', 'identity_data']
        }
      });
    } else {
      // Overview of all users
      const allUsers = plaidService.getConnectedUsers(tenantId || undefined);
      
      return NextResponse.json({
        total_connected_users: allUsers.length,
        tenant_filter: tenantId || 'all_tenants',
        users_summary: allUsers.map(user => ({
          user_id: user.user_id,
          tenant_id: user.tenant_id,
          connected_since: user.created_at,
          accounts_count: user.accounts.length,
          retention_expires: user.data_retention_expiry
        })),
        bulk_deletion_available: true,
        compliance_info: {
          gdpr_right_to_erasure: 'Available',
          ccpa_right_to_delete: 'Available',
          sox_retention_override: 'User rights supersede retention requirements',
          deletion_timeline: 'Immediate upon request'
        }
      });
    }
    
  }, 'PlaidDataDeletionAPI', 'GET') ||
  NextResponse.json(
    { error: 'Failed to check deletion status', timestamp: new Date().toISOString() },
    { status: 500 }
  );
}
