/**
 * DEPOINTE User Service
 * Manages DEPOINTE AI Company user profile and authentication
 * Integrates with FleetFlow User Management system
 */

import { EnhancedUserData } from './EnhancedUserManagementService';

export interface DEPOINTEUserProfile extends EnhancedUserData {
  // Additional DEPOINTE-specific fields
  tenantId: string;
  organizationId: string;
  organizationName: string;
}

export class DEPOINTEUserService {
  private static DEPOINTE_USER_KEY = 'fleetflow-current-user';

  /**
   * Get the DEPOINTE AI Company user profile
   */
  static getDEPOINTEUser(): DEPOINTEUserProfile {
    return {
      // Core user information
      id: 'DEPOINTE-001',
      name: 'Dee Davis',
      email: 'ddavis@fleetflowapp.com',
      phone: '+1 (555) 123-4567',
      department: 'Executive Management',
      departmentCode: 'FBB',
      position: 'CEO & Founder',
      hiredDate: '2024-01-01',
      role: 'admin',
      status: 'active',
      lastActive: new Date().toISOString(),

      // User type
      userType: 'business_entity',

      // Tenant & Organization
      tenantId: 'org-depointe-001',
      organizationId: 'org-depointe-001',
      organizationName: 'DEPOINTE AI Company',

      // Business entity information
      businessInfo: {
        companyName: 'DEE DAVIS INC dba DEPOINTE',
        businessAddress: '123 Logistics Way, Transportation City, TX 75001',
        mcNumber: 'MC 1647572',
        dotNumber: 'DOT 4250594',
        businessPhone: '+1 (555) 123-4567',
        businessEmail: 'ddavis@freight1stdirect.com',
        ownerName: 'Dee Davis',
        businessType: 'freight_brokerage',
        incorporationDate: '2024-01-01',
        taxId: 'XX-XXXXXXX',
        territories: [
          'United States',
          'Canada',
          'Mexico',
          'Cross-Border Operations',
        ],
        specializations: [
          'AI-Powered Freight Brokerage',
          'Business Intelligence Software',
          'Transportation Management',
          'Logistics Optimization',
          'Freight Forwarding',
          'Customs Brokerage',
        ],
      },

      // System access
      systemAccess: {
        level: 'Executive Full Access',
        accessCode: 'DEPOINTE-EXEC-001',
        securityLevel: 'Level 5 - Executive',
        allowedSystems: [
          'All Systems',
          'DEPOINTE AI Dashboard',
          'Strategic Sales Campaigns',
          'User Management',
          'Financial Systems',
          'Compliance Center',
          'AI Staff Management',
          'Business Intelligence',
          'CRM System',
          'Email Warm-up Dashboard',
          'Deliverability Management',
        ],
      },

      // Permissions (full access)
      permissions: {
        canViewAllData: true,
        canEditAllData: true,
        canDeleteData: true,
        canManageUsers: true,
        canManageFinancials: true,
        canManageCompliance: true,
        canManageAIStaff: true,
        canManageCampaigns: true,
        canViewAnalytics: true,
        canExportData: true,
        canManageIntegrations: true,
        canAccessDeveloperTools: true,
        canManageSubscriptions: true,
        canViewAuditLogs: true,
      },

      notes: `DEPOINTE AI Company - CEO & Founder
FleetFlow Tenant: org-depointe-001
MC Number: MC 1647572
DOT Number: DOT 4250594
Full executive access to all systems and features.`,
    };
  }

  /**
   * Login as DEPOINTE user
   */
  static loginAsDEPOINTE(): void {
    const depointeUser = this.getDEPOINTEUser();

    // Store in localStorage for getCurrentUser() to pick up
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        this.DEPOINTE_USER_KEY,
        JSON.stringify(depointeUser)
      );
      console.info('✅ Logged in as DEPOINTE AI Company:', depointeUser);
    }
  }

  /**
   * Logout current user
   */
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.DEPOINTE_USER_KEY);
      console.info('✅ Logged out');
    }
  }

  /**
   * Get current logged-in user
   */
  static getCurrentUser(): DEPOINTEUserProfile | null {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem(this.DEPOINTE_USER_KEY);
        if (storedUser) {
          return JSON.parse(storedUser);
        }
      } catch (error) {
        console.error('Error loading current user:', error);
      }
    }
    return null;
  }

  /**
   * Check if user is logged in
   */
  static isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Get user display information for UI
   */
  static getUserDisplayInfo(): {
    name: string;
    email: string;
    organization: string;
    role: string;
    initials: string;
    accessLevel: string;
  } {
    const user = this.getCurrentUser();

    if (!user) {
      return {
        name: 'FleetFlow User',
        email: 'user@fleetflowapp.com',
        organization: 'FleetFlow Demo',
        role: 'User',
        initials: 'U',
        accessLevel: 'Limited',
      };
    }

    const nameParts = user.name.split(' ');
    const initials = nameParts
      .map((n) => n[0])
      .join('')
      .toUpperCase();

    return {
      name: user.name,
      email: user.email,
      organization:
        user.organizationName || user.businessInfo?.companyName || 'FleetFlow',
      role: user.position || user.role,
      initials,
      accessLevel: user.systemAccess.securityLevel,
    };
  }
}

// Auto-login as DEPOINTE on service initialization (for development)
if (typeof window !== 'undefined' && !DEPOINTEUserService.isLoggedIn()) {
  console.info('🔐 Auto-logging in as DEPOINTE AI Company...');
  DEPOINTEUserService.loginAsDEPOINTE();
}

export const depointeUserService = DEPOINTEUserService;

