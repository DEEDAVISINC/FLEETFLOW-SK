/**
 * DOTComplianceMonitor
 * Monitors DOT compliance status and sends alerts for issues
 * Integrates with the notification system for mobile alerts
 */

import { format } from 'date-fns';
import { AlertPriority, complianceNotifier } from './ComplianceNotifier';

interface Document {
  id: string;
  type: string;
  name: string;
  carrierId: string;
  dotNumber: string;
  status: 'valid' | 'expiring' | 'expired' | 'missing';
  expirationDate?: string;
}

interface ComplianceProfile {
  carrierId: string;
  dotNumber: string;
  companyName: string;
  safetyRating: string;
  riskLevel: 'low' | 'medium' | 'high';
}

class DOTComplianceMonitor {
  /**
   * Check all documents for a carrier and send expiration alerts
   */
  async checkDocumentExpirations(
    carrierId: string,
    dotNumber: string,
    documents: Document[]
  ): Promise<void> {
    console.info(`🔍 Checking document expirations for carrier ${carrierId}`);

    const today = new Date();

    for (const document of documents) {
      if (!document.expirationDate) continue;

      const expirationDate = new Date(document.expirationDate);
      if (isNaN(expirationDate.getTime())) continue;

      // Calculate days remaining
      const daysRemaining = Math.ceil(
        (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Send alerts based on expiration timeline
      if (daysRemaining <= 0) {
        // Document expired
        await complianceNotifier.sendDocumentExpirationAlert(
          carrierId,
          dotNumber,
          document.name || document.type,
          document.expirationDate,
          daysRemaining
        );
      } else if (daysRemaining <= 7) {
        // Critical - expiring within a week
        await complianceNotifier.sendDocumentExpirationAlert(
          carrierId,
          dotNumber,
          document.name || document.type,
          document.expirationDate,
          daysRemaining
        );
      } else if (daysRemaining <= 30) {
        // Warning - expiring within a month
        await complianceNotifier.sendDocumentExpirationAlert(
          carrierId,
          dotNumber,
          document.name || document.type,
          document.expirationDate,
          daysRemaining
        );
      }
      // We don't send alerts for documents expiring beyond 30 days
    }
  }

  /**
   * Report a compliance violation
   */
  async reportViolation(
    carrierId: string,
    dotNumber: string,
    violationType: string,
    details: string,
    severity: 'critical' | 'major' | 'minor' = 'major'
  ): Promise<void> {
    console.info(
      `🚨 Reporting ${severity} violation for carrier ${carrierId}: ${violationType}`
    );

    // Only send mobile alerts for critical and major violations
    if (severity === 'critical' || severity === 'major') {
      await complianceNotifier.sendViolationAlert(
        carrierId,
        dotNumber,
        violationType,
        details
      );
    }

    // Log the violation (in a real system, this would go to a database)
    console.info({
      carrierId,
      dotNumber,
      violationType,
      details,
      severity,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Check safety rating changes
   */
  async checkSafetyRatingChange(
    carrierId: string,
    dotNumber: string,
    oldRating: string,
    newRating: string
  ): Promise<void> {
    if (oldRating === newRating) return;

    console.info(
      `🔄 Safety rating changed for carrier ${carrierId}: ${oldRating} -> ${newRating}`
    );

    // Determine if this is a concerning change
    const isDowngrade = this.isSafetyRatingDowngrade(oldRating, newRating);

    if (isDowngrade) {
      await complianceNotifier.sendComplianceAlert({
        carrierId,
        dotNumber,
        title: 'Safety Rating Changed',
        message: `Your safety rating has changed from ${oldRating} to ${newRating}. This may affect your operations.`,
        priority: AlertPriority.CRITICAL,
        actionRequired: true,
      });
    } else {
      // For upgrades, send as info
      await complianceNotifier.sendComplianceAlert({
        carrierId,
        dotNumber,
        title: 'Safety Rating Updated',
        message: `Your safety rating has been updated from ${oldRating} to ${newRating}.`,
        priority: AlertPriority.INFO,
        actionRequired: false,
      });
    }
  }

  /**
   * Check risk level changes
   */
  async checkRiskLevelChange(
    carrierId: string,
    dotNumber: string,
    oldLevel: 'low' | 'medium' | 'high',
    newLevel: 'low' | 'medium' | 'high'
  ): Promise<void> {
    if (oldLevel === newLevel) return;

    console.info(
      `🔄 Risk level changed for carrier ${carrierId}: ${oldLevel} -> ${newLevel}`
    );

    // Only alert on risk increases
    if (this.isRiskIncrease(oldLevel, newLevel)) {
      const priority =
        newLevel === 'high' ? AlertPriority.CRITICAL : AlertPriority.WARNING;

      await complianceNotifier.sendComplianceAlert({
        carrierId,
        dotNumber,
        title: 'Risk Level Increased',
        message: `Your compliance risk level has increased from ${oldLevel} to ${newLevel}. Review your compliance status.`,
        priority,
        actionRequired: newLevel === 'high', // Only require action for high risk
      });
    }
  }

  /**
   * Schedule audit reminder
   */
  async scheduleAuditReminder(
    carrierId: string,
    dotNumber: string,
    auditDate: Date
  ): Promise<void> {
    const daysUntilAudit = Math.ceil(
      (auditDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    // Alert based on timeline
    let priority: AlertPriority;
    let actionRequired: boolean;

    if (daysUntilAudit <= 7) {
      priority = AlertPriority.CRITICAL;
      actionRequired = true;
    } else if (daysUntilAudit <= 30) {
      priority = AlertPriority.WARNING;
      actionRequired = true;
    } else {
      priority = AlertPriority.INFO;
      actionRequired = false;
    }

    await complianceNotifier.sendComplianceAlert({
      carrierId,
      dotNumber,
      title: 'Upcoming DOT Audit',
      message: `Your DOT audit is scheduled for ${format(auditDate, 'MMM dd, yyyy')} (${daysUntilAudit} days from now).`,
      priority,
      actionRequired,
    });
  }

  /**
   * Check if a safety rating change is a downgrade
   */
  private isSafetyRatingDowngrade(
    oldRating: string,
    newRating: string
  ): boolean {
    const ratingValues: Record<string, number> = {
      SATISFACTORY: 3,
      CONDITIONAL: 2,
      UNSATISFACTORY: 1,
      UNRATED: 0,
    };

    const oldValue = ratingValues[oldRating] || 0;
    const newValue = ratingValues[newRating] || 0;

    return newValue < oldValue;
  }

  /**
   * Check if a risk level change is an increase
   */
  private isRiskIncrease(
    oldLevel: 'low' | 'medium' | 'high',
    newLevel: 'low' | 'medium' | 'high'
  ): boolean {
    const riskValues: Record<string, number> = {
      low: 1,
      medium: 2,
      high: 3,
    };

    return riskValues[newLevel] > riskValues[oldLevel];
  }
}

// Export singleton instance
export const dotComplianceMonitor = new DOTComplianceMonitor();
