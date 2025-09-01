// FleetFlow Automated Data Cleanup API Endpoint
// Handles scheduled data deletion jobs and retention policy enforcement

import { NextRequest, NextResponse } from 'next/server';
import DataGovernanceService from '../../../services/DataGovernanceService';
import PrivacyComplianceService from '../../../services/PrivacyComplianceService';

export async function POST(request: NextRequest) {
  try {
    const { job_type, tenant_id, force_run } = await request.json();

    const dataGovernanceService = DataGovernanceService.getInstance();
    const privacyService = PrivacyComplianceService.getInstance();

    let result;

    switch (job_type) {
      case 'daily_cleanup':
        result = await runDailyCleanupJob(dataGovernanceService, tenant_id);
        break;
      case 'weekly_compliance':
        result = await runWeeklyComplianceJob(
          dataGovernanceService,
          privacyService,
          tenant_id
        );
        break;
      case 'monthly_audit':
        result = await runMonthlyAuditJob(
          dataGovernanceService,
          privacyService,
          tenant_id
        );
        break;
      case 'retention_enforcement':
        result = await runRetentionEnforcementJob(
          dataGovernanceService,
          tenant_id
        );
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid job type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      job_type,
      tenant_id,
      execution_time: new Date().toISOString(),
      result,
    });
  } catch (error) {
    console.error('Automated cleanup job failed:', error);
    return NextResponse.json(
      {
        error: 'Cleanup job failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenant_id = searchParams.get('tenant_id');
    const report_type = searchParams.get('report_type') || 'status';

    const dataGovernanceService = DataGovernanceService.getInstance();
    const privacyService = PrivacyComplianceService.getInstance();

    let response;

    switch (report_type) {
      case 'status':
        response = await getCleanupJobStatus(
          dataGovernanceService,
          privacyService,
          tenant_id
        );
        break;
      case 'compliance':
        response = await getComplianceStatus(
          dataGovernanceService,
          privacyService,
          tenant_id
        );
        break;
      case 'metrics':
        response = await getCleanupMetrics(
          dataGovernanceService,
          privacyService,
          tenant_id
        );
        break;
      default:
        response = await getCleanupJobStatus(
          dataGovernanceService,
          privacyService,
          tenant_id
        );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to get cleanup job status:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// ========================================
// JOB EXECUTION FUNCTIONS
// ========================================

async function runDailyCleanupJob(
  dataGovernanceService: DataGovernanceService,
  tenant_id?: string | null
): Promise<any> {
  console.info(
    `🧹 Starting daily cleanup job${tenant_id ? ` for tenant ${tenant_id}` : ''}`
  );

  const startTime = new Date();
  const results = {
    expired_records_found: 0,
    deletion_requests_created: 0,
    immediate_deletions: 0,
    errors: [] as string[],
    execution_duration: 0,
  };

  try {
    // Get retention rules
    const retentionRules = dataGovernanceService.getRetentionRules(
      tenant_id || undefined
    );

    for (const rule of retentionRules) {
      if (rule.autoDelete) {
        const cutoffDate = new Date(
          Date.now() - rule.retentionPeriodDays * 24 * 60 * 60 * 1000
        );

        // Simulate finding expired records
        const expiredRecordCount = Math.floor(Math.random() * 100);
        results.expired_records_found += expiredRecordCount;

        if (expiredRecordCount > 0) {
          const deletionRequest = dataGovernanceService.createDeletionRequest({
            requestType: 'retention_expiry',
            dataTypes: [rule.category],
            tenantId: tenant_id || undefined,
            targetDeletionDate: new Date(),
            verificationRequired: rule.priority === 'critical',
            legalHoldCheck:
              rule.dataType === 'financial' || rule.dataType === 'compliance',
          });

          results.deletion_requests_created++;

          // Process immediately if no verification required
          if (
            !deletionRequest.verificationRequired &&
            !deletionRequest.legalHoldCheck
          ) {
            const processed = dataGovernanceService.processDeletionRequest(
              deletionRequest.id
            );
            if (processed) {
              results.immediate_deletions++;
            }
          }
        }
      }
    }

    // Clean up system logs
    await cleanupSystemLogs();

    // Clean up temporary files
    await cleanupTemporaryFiles();

    results.execution_duration = Date.now() - startTime.getTime();

    console.info(
      `✅ Daily cleanup job completed in ${results.execution_duration}ms`
    );
    return results;
  } catch (error) {
    results.errors.push(`Daily cleanup failed: ${error}`);
    console.error('Daily cleanup job failed:', error);
    return results;
  }
}

async function runWeeklyComplianceJob(
  dataGovernanceService: DataGovernanceService,
  privacyService: PrivacyComplianceService,
  tenant_id?: string | null
): Promise<any> {
  console.info(
    `📋 Starting weekly compliance job${tenant_id ? ` for tenant ${tenant_id}` : ''}`
  );

  const startTime = new Date();
  const results = {
    compliance_report_generated: false,
    pending_requests_processed: 0,
    privacy_requests_completed: 0,
    compliance_score: 0,
    execution_duration: 0,
    errors: [] as string[],
  };

  try {
    // Generate compliance report
    const complianceReport = dataGovernanceService.generateComplianceReport(
      'retention_compliance',
      tenant_id || undefined
    );
    results.compliance_report_generated = true;
    results.compliance_score = complianceReport.metrics.complianceScore;

    // Process pending deletion requests
    const pendingDeletions = dataGovernanceService.getDeletionRequests(
      tenant_id || undefined,
      'pending'
    );
    for (const request of pendingDeletions) {
      if (request.targetDeletionDate <= new Date()) {
        const processed = dataGovernanceService.processDeletionRequest(
          request.id
        );
        if (processed) {
          results.pending_requests_processed++;
        }
      }
    }

    // Process privacy requests
    const pendingPrivacyRequests = privacyService.getDataSubjectRequests(
      tenant_id || undefined,
      'processing'
    );
    for (const request of pendingPrivacyRequests) {
      if (request.verificationStatus === 'verified') {
        const processed = privacyService.processDataRequest(request.id);
        if (processed) {
          results.privacy_requests_completed++;
        }
      }
    }

    // Validate retention compliance
    const compliance = dataGovernanceService.validateRetentionCompliance();
    results.compliance_score = compliance.overallCompliance;

    results.execution_duration = Date.now() - startTime.getTime();

    console.info(
      `✅ Weekly compliance job completed in ${results.execution_duration}ms`
    );
    return results;
  } catch (error) {
    results.errors.push(`Weekly compliance job failed: ${error}`);
    console.error('Weekly compliance job failed:', error);
    return results;
  }
}

async function runMonthlyAuditJob(
  dataGovernanceService: DataGovernanceService,
  privacyService: PrivacyComplianceService,
  tenant_id?: string | null
): Promise<any> {
  console.info(
    `📊 Starting monthly audit job${tenant_id ? ` for tenant ${tenant_id}` : ''}`
  );

  const startTime = new Date();
  const results = {
    audit_reports_generated: 0,
    data_inventory_updated: false,
    retention_rules_reviewed: 0,
    privacy_notices_updated: false,
    compliance_metrics: {},
    execution_duration: 0,
    errors: [] as string[],
  };

  try {
    // Generate comprehensive audit reports
    const reportTypes = [
      'retention_compliance',
      'deletion_summary',
      'subject_rights',
      'audit_trail',
    ] as const;

    for (const reportType of reportTypes) {
      const report = dataGovernanceService.generateComplianceReport(
        reportType,
        tenant_id || undefined
      );
      results.audit_reports_generated++;
    }

    // Review and update data inventory
    const dataInventory = dataGovernanceService.getDataInventory(
      tenant_id || undefined
    );
    results.data_inventory_updated = true;

    // Review retention rules
    const retentionRules = dataGovernanceService.getRetentionRules(
      tenant_id || undefined
    );
    results.retention_rules_reviewed = retentionRules.length;

    // Generate privacy compliance metrics
    const privacyMetrics = privacyService.generatePrivacyComplianceReport();
    results.compliance_metrics = privacyMetrics;

    // Update privacy notices if needed
    results.privacy_notices_updated = true;

    results.execution_duration = Date.now() - startTime.getTime();

    console.info(
      `✅ Monthly audit job completed in ${results.execution_duration}ms`
    );
    return results;
  } catch (error) {
    results.errors.push(`Monthly audit job failed: ${error}`);
    console.error('Monthly audit job failed:', error);
    return results;
  }
}

async function runRetentionEnforcementJob(
  dataGovernanceService: DataGovernanceService,
  tenant_id?: string | null
): Promise<any> {
  console.info(
    `⚖️ Starting retention enforcement job${tenant_id ? ` for tenant ${tenant_id}` : ''}`
  );

  const startTime = new Date();
  const results = {
    rules_enforced: 0,
    violations_found: 0,
    corrections_applied: 0,
    data_archived: 0,
    execution_duration: 0,
    errors: [] as string[],
  };

  try {
    // Get all retention rules
    const retentionRules = dataGovernanceService.getRetentionRules(
      tenant_id || undefined
    );

    for (const rule of retentionRules) {
      results.rules_enforced++;

      // Check for retention violations
      const violations = await checkRetentionViolations(rule, tenant_id);
      results.violations_found += violations.length;

      // Apply corrections for violations
      for (const violation of violations) {
        const corrected = await applyRetentionCorrection(
          violation,
          dataGovernanceService
        );
        if (corrected) {
          results.corrections_applied++;
        }
      }

      // Archive data approaching retention limits
      const archived = await archiveExpiringData(rule, tenant_id);
      results.data_archived += archived;
    }

    results.execution_duration = Date.now() - startTime.getTime();

    console.info(
      `✅ Retention enforcement job completed in ${results.execution_duration}ms`
    );
    return results;
  } catch (error) {
    results.errors.push(`Retention enforcement job failed: ${error}`);
    console.error('Retention enforcement job failed:', error);
    return results;
  }
}

// ========================================
// STATUS AND REPORTING FUNCTIONS
// ========================================

async function getCleanupJobStatus(
  dataGovernanceService: DataGovernanceService,
  privacyService: PrivacyComplianceService,
  tenant_id?: string | null
): Promise<any> {
  const pendingDeletions = dataGovernanceService.getDeletionRequests(
    tenant_id || undefined,
    'pending'
  );
  const processingRequests = privacyService.getDataSubjectRequests(
    tenant_id || undefined,
    'processing'
  );
  const plaidCompliance = dataGovernanceService.getPlaidComplianceStatus();

  return {
    status: 'active',
    last_run: {
      daily_cleanup: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      weekly_compliance: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      monthly_audit: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    },
    next_scheduled: {
      daily_cleanup: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours from now
      weekly_compliance: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      monthly_audit: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    },
    pending_work: {
      deletion_requests: pendingDeletions.length,
      privacy_requests: processingRequests.length,
      expired_data_categories: Math.floor(Math.random() * 5),
    },
    plaid_compliance: plaidCompliance,
  };
}

async function getComplianceStatus(
  dataGovernanceService: DataGovernanceService,
  privacyService: PrivacyComplianceService,
  tenant_id?: string | null
): Promise<any> {
  const retentionCompliance =
    dataGovernanceService.validateRetentionCompliance();
  const privacyCompliance = privacyService.generatePrivacyComplianceReport();
  const plaidCompliance = dataGovernanceService.getPlaidComplianceStatus();

  return {
    overall_compliance_score: Math.round(
      (retentionCompliance.overallCompliance +
        privacyCompliance.complianceRate) /
        2
    ),
    retention_compliance: {
      score: retentionCompliance.overallCompliance,
      compliant_rules: retentionCompliance.ruleCompliance.filter(
        (rc) => rc.compliant
      ).length,
      total_rules: retentionCompliance.ruleCompliance.length,
      issues: retentionCompliance.ruleCompliance.filter((rc) => !rc.compliant),
    },
    privacy_compliance: {
      score: privacyCompliance.complianceRate,
      total_requests: privacyCompliance.totalRequests,
      average_processing_time: privacyCompliance.averageProcessingTime,
      outstanding_requests: privacyCompliance.outstandingRequests,
      consent_withdrawals: privacyCompliance.consentWithdrawals,
    },
    plaid_compliance: plaidCompliance,
    tenant_id,
  };
}

async function getCleanupMetrics(
  dataGovernanceService: DataGovernanceService,
  privacyService: PrivacyComplianceService,
  tenant_id?: string | null
): Promise<any> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  return {
    period: {
      start: thirtyDaysAgo,
      end: new Date(),
    },
    metrics: {
      data_deleted: {
        total_records: 1500 + Math.floor(Math.random() * 5000),
        by_category: {
          personal: 500 + Math.floor(Math.random() * 1000),
          operational: 800 + Math.floor(Math.random() * 2000),
          system: 200 + Math.floor(Math.random() * 500),
        },
      },
      privacy_requests: privacyService.generatePrivacyComplianceReport(),
      retention_enforcement: {
        rules_applied: Math.floor(Math.random() * 20) + 10,
        violations_corrected: Math.floor(Math.random() * 5),
        data_archived: Math.floor(Math.random() * 1000) + 500,
      },
      system_health: {
        storage_freed: `${Math.floor(Math.random() * 100) + 50}GB`,
        performance_improvement: `${Math.floor(Math.random() * 10) + 5}%`,
        compliance_score_change: Math.floor(Math.random() * 6) - 3, // -3 to +3
      },
    },
    tenant_id,
  };
}

// ========================================
// HELPER FUNCTIONS
// ========================================

async function cleanupSystemLogs(): Promise<void> {
  // Clean up application logs older than 90 days
  const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  console.info(
    `🗂️ Cleaning up system logs older than ${cutoffDate.toISOString()}`
  );

  // In real implementation, this would:
  // 1. Query log tables for old entries
  // 2. Archive important logs to long-term storage
  // 3. Delete routine logs older than retention period
  // 4. Compress and optimize log storage
}

async function cleanupTemporaryFiles(): Promise<void> {
  // Clean up temporary files and cache
  console.info('🗑️ Cleaning up temporary files and cache');

  // In real implementation, this would:
  // 1. Clean /tmp directories
  // 2. Clear application cache
  // 3. Remove expired session data
  // 4. Clean up file upload temporary storage
}

async function checkRetentionViolations(
  rule: any,
  tenant_id?: string | null
): Promise<any[]> {
  // Check for data that exceeds retention periods
  const violations = [];

  // Simulate finding violations
  if (Math.random() > 0.8) {
    // 20% chance of violations
    violations.push({
      rule_id: rule.id,
      data_type: rule.dataType,
      violation_type: 'retention_exceeded',
      record_count: Math.floor(Math.random() * 100) + 1,
      days_overdue: Math.floor(Math.random() * 30) + 1,
    });
  }

  return violations;
}

async function applyRetentionCorrection(
  violation: any,
  dataGovernanceService: DataGovernanceService
): Promise<boolean> {
  // Apply corrections for retention violations
  try {
    const deletionRequest = dataGovernanceService.createDeletionRequest({
      requestType: 'retention_expiry',
      dataTypes: [violation.data_type],
      targetDeletionDate: new Date(),
      verificationRequired: false,
      legalHoldCheck: true,
    });

    return dataGovernanceService.processDeletionRequest(deletionRequest.id);
  } catch (error) {
    console.error('Failed to apply retention correction:', error);
    return false;
  }
}

async function archiveExpiringData(
  rule: any,
  tenant_id?: string | null
): Promise<number> {
  // Archive data that's approaching retention limits
  const archiveThreshold = new Date(
    Date.now() - (rule.retentionPeriodDays - 30) * 24 * 60 * 60 * 1000
  );

  // Simulate archiving process
  return Math.floor(Math.random() * 200) + 50;
}
