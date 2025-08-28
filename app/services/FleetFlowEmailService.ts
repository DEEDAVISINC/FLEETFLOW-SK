// FleetFlow Email Management Service
// Integrates ImprovMX with FleetFlow departments

import {
  FLEETFLOW_DEPARTMENTS,
  generateDepartmentEmailMapping,
  getDepartmentByAlias,
  validateEmailConfiguration,
} from '../config/departmentEmails';
import { DepartmentEmailMapping, improvmxService } from './improvmx-service';

export interface EmailSetupResult {
  success: boolean;
  aliasesCreated: number;
  aliasesFailed: number;
  errors: string[];
  warnings: string[];
  mapping: DepartmentEmailMapping;
}

export interface DepartmentContact {
  department: string;
  email: string;
  aliases: string[];
  responsibilities: string[];
}

export class FleetFlowEmailService {
  /**
   * Setup all FleetFlow departmental email aliases
   */
  async setupAllDepartmentEmails(
    defaultForwardEmail: string = 'ddavis@fleetflowapp.com'
  ): Promise<EmailSetupResult> {
    console.log('🚀 Setting up FleetFlow departmental email system...');

    // Validate configuration first
    const validation = validateEmailConfiguration();
    if (!validation.isValid) {
      return {
        success: false,
        aliasesCreated: 0,
        aliasesFailed: 0,
        errors: validation.errors,
        warnings: validation.warnings,
        mapping: {},
      };
    }

    // Generate email mapping
    const mapping = generateDepartmentEmailMapping(defaultForwardEmail);

    console.log(`📧 Generated ${Object.keys(mapping).length} email aliases`);
    console.log('📋 Department mapping:', mapping);

    // Setup aliases through ImprovMX
    const result = await improvmxService.setupDepartmentalAliases(mapping);

    const setupResult: EmailSetupResult = {
      success: result.success,
      aliasesCreated: result.data?.length || 0,
      aliasesFailed: result.success
        ? 0
        : Object.keys(mapping).length - (result.data?.length || 0),
      errors: result.error ? [result.error] : validation.errors,
      warnings: validation.warnings,
      mapping,
    };

    if (result.success) {
      console.log(
        `✅ Successfully created ${setupResult.aliasesCreated} departmental email aliases`
      );
    } else {
      console.error(`❌ Failed to setup departmental emails: ${result.error}`);
    }

    return setupResult;
  }

  /**
   * Get department information by email alias
   */
  getDepartmentInfo(alias: string): DepartmentContact | null {
    const department = getDepartmentByAlias(alias);
    if (!department) return null;

    return {
      department: department.name,
      email: department.primaryContact,
      aliases: department.aliases,
      responsibilities: department.responsibilities,
    };
  }

  /**
   * Get all department contacts for directory
   */
  getAllDepartmentContacts(): DepartmentContact[] {
    return Object.values(FLEETFLOW_DEPARTMENTS).map((dept) => ({
      department: dept.name,
      email: dept.primaryContact,
      aliases: dept.aliases,
      responsibilities: dept.responsibilities,
    }));
  }

  /**
   * Update department email forwarding
   */
  async updateDepartmentEmail(
    alias: string,
    newForwardEmail: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get existing aliases to find the one to update
      const existingAliases = await improvmxService.getAliases();
      if (!existingAliases.success || !existingAliases.data) {
        return { success: false, error: 'Failed to retrieve existing aliases' };
      }

      const existingAlias = existingAliases.data.find((a) => a.alias === alias);
      if (!existingAlias?.id) {
        return { success: false, error: `Alias '${alias}' not found` };
      }

      const result = await improvmxService.updateAlias(
        existingAlias.id,
        newForwardEmail
      );
      return {
        success: result.success,
        error: result.error,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Create individual department alias
   */
  async createDepartmentAlias(
    alias: string,
    forwardEmail: string
  ): Promise<{ success: boolean; error?: string }> {
    const result = await improvmxService.createAlias(alias, forwardEmail);
    return {
      success: result.success,
      error: result.error,
    };
  }

  /**
   * Remove department alias
   */
  async removeDepartmentAlias(
    alias: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Get existing aliases to find the one to delete
      const existingAliases = await improvmxService.getAliases();
      if (!existingAliases.success || !existingAliases.data) {
        return { success: false, error: 'Failed to retrieve existing aliases' };
      }

      const existingAlias = existingAliases.data.find((a) => a.alias === alias);
      if (!existingAlias?.id) {
        return { success: false, error: `Alias '${alias}' not found` };
      }

      const result = await improvmxService.deleteAlias(existingAlias.id);
      return {
        success: result.success,
        error: result.error,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get current email alias status
   */
  async getAliasStatus(): Promise<{
    success: boolean;
    aliases: Array<{
      alias: string;
      forward: string;
      department?: string;
      isActive: boolean;
    }>;
    error?: string;
  }> {
    const result = await improvmxService.getAliases();
    if (!result.success) {
      return {
        success: false,
        aliases: [],
        error: result.error,
      };
    }

    const aliases = (result.data || []).map((alias) => {
      const department = getDepartmentByAlias(alias.alias);
      return {
        alias: alias.alias,
        forward: alias.forward,
        department: department?.name,
        isActive: true,
      };
    });

    return {
      success: true,
      aliases,
    };
  }

  /**
   * Generate email directory for documentation
   */
  generateEmailDirectory(): {
    departments: Array<{
      name: string;
      primaryEmail: string;
      aliases: string[];
      description: string;
      responsibilities: string[];
    }>;
    commonAliases: Array<{
      alias: string;
      forwards_to: string;
      purpose: string;
    }>;
  } {
    const departments = Object.values(FLEETFLOW_DEPARTMENTS).map((dept) => ({
      name: dept.name,
      primaryEmail: dept.primaryContact,
      aliases: dept.aliases,
      description: dept.description,
      responsibilities: dept.responsibilities,
    }));

    const commonAliases = [
      {
        alias: 'contact',
        forwards_to: 'contact@fleetflowapp.com',
        purpose: 'General inquiries',
      },
      {
        alias: 'info',
        forwards_to: 'info@fleetflowapp.com',
        purpose: 'Information requests',
      },
      {
        alias: 'sales',
        forwards_to: 'sales@fleetflowapp.com',
        purpose: 'Sales inquiries',
      },
      {
        alias: 'marketing',
        forwards_to: 'marketing@fleetflowapp.com',
        purpose: 'Marketing inquiries',
      },
      {
        alias: 'operations',
        forwards_to: 'dispatch@fleetflowapp.com',
        purpose: 'Operational matters',
      },
      {
        alias: 'legal',
        forwards_to: 'privacy@fleetflowapp.com',
        purpose: 'Legal matters',
      },
      {
        alias: 'privacy',
        forwards_to: 'privacy@fleetflowapp.com',
        purpose: 'Privacy concerns',
      },
      {
        alias: 'security',
        forwards_to: 'security@fleetflowapp.com',
        purpose: 'Security issues',
      },
      {
        alias: 'noreply',
        forwards_to: 'noreply@fleetflowapp.com',
        purpose: 'Automated emails',
      },
      {
        alias: 'flowhub',
        forwards_to: 'flowhub@fleetflowapp.com',
        purpose: 'FlowHub platform matters',
      },
    ];

    return {
      departments,
      commonAliases,
    };
  }

  /**
   * Test email configuration
   */
  async testEmailConfiguration(): Promise<{
    success: boolean;
    tests: Array<{
      test: string;
      passed: boolean;
      error?: string;
    }>;
  }> {
    const tests = [
      { test: 'Configuration validation', passed: false },
      { test: 'ImprovMX connection', passed: false },
      { test: 'Domain verification', passed: false },
    ];

    try {
      // Test 1: Configuration validation
      const validation = validateEmailConfiguration();
      tests[0].passed = validation.isValid;
      if (!validation.isValid) {
        tests[0].error = validation.errors.join(', ');
      }

      // Test 2: ImprovMX connection test
      const domainInfo = await improvmxService.getDomainInfo();
      tests[1].passed = domainInfo.success;
      if (!domainInfo.success) {
        tests[1].error = domainInfo.error;
      }

      // Test 3: Domain verification
      if (domainInfo.success && domainInfo.data) {
        tests[2].passed = domainInfo.data.active;
        if (!domainInfo.data.active) {
          tests[2].error = 'Domain not active in ImprovMX';
        }
      }
    } catch (error) {
      tests.forEach((test) => {
        if (!test.passed) {
          test.error = error instanceof Error ? error.message : 'Unknown error';
        }
      });
    }

    return {
      success: tests.every((test) => test.passed),
      tests,
    };
  }
}

// Export singleton instance
export const fleetFlowEmailService = new FleetFlowEmailService();
export default fleetFlowEmailService;
