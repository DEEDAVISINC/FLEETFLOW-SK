/**
 * FleetFlow AI Template Engine
 * Handles template processing, variable substitution, and content generation
 * for multi-tenant AI agent responses
 */

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'select';
  required: boolean;
  defaultValue?: any;
  options?: string[]; // For select type
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    customValidator?: (value: any) => boolean;
  };
  description: string;
}

export interface AITemplate {
  id: string;
  tenantId: string;
  name: string;
  category: 'email' | 'call_script' | 'social_media' | 'text_message';
  content: string;
  variables: TemplateVariable[];
  isActive: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  tags: string[];
  metadata: {
    language: string;
    tone: 'professional' | 'friendly' | 'aggressive' | 'technical';
    industry: string;
    useCase: string;
  };
  performance: {
    timesUsed: number;
    successRate: number;
    avgResponseTime: number;
    lastUsed?: Date;
  };
}

export interface TemplateContext {
  tenantId: string;
  userId: string;
  leadData: any;
  companyData: any;
  customData?: Record<string, any>;
  timestamp: Date;
}

export class AITemplateEngine {
  private static templates: Map<string, AITemplate> = new Map();
  private static readonly VARIABLE_REGEX = /\{\{([^}]+)\}\}/g;

  /**
   * Process template with context data
   */
  static async processTemplate(
    templateId: string,
    context: TemplateContext
  ): Promise<{
    content: string;
    missingVariables: string[];
    warnings: string[];
  }> {
    const template = await this.getTemplate(templateId);

    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    // Validate tenant access
    if (template.tenantId !== context.tenantId) {
      throw new Error('Unauthorized template access');
    }

    let processedContent = template.content;
    const missingVariables: string[] = [];
    const warnings: string[] = [];

    // Extract all variables from template
    const variableMatches = template.content.match(this.VARIABLE_REGEX) || [];
    const usedVariables = variableMatches.map((match) =>
      match.replace(/\{\{|\}\}/g, '').trim()
    );

    // Process each variable
    for (const variable of template.variables) {
      const value = await this.resolveVariable(variable, context);

      if (value === null || value === undefined) {
        if (variable.required) {
          missingVariables.push(variable.name);
          continue;
        } else {
          // Use default value
          const defaultValue = variable.defaultValue || '';
          processedContent = this.replaceVariable(
            processedContent,
            variable.name,
            defaultValue
          );
          warnings.push(`Used default value for ${variable.name}`);
        }
      } else {
        // Validate value
        const validationResult = this.validateVariable(variable, value);
        if (!validationResult.isValid) {
          warnings.push(
            `Validation warning for ${variable.name}: ${validationResult.error}`
          );
        }

        // Format value based on type
        const formattedValue = this.formatValue(variable.type, value);
        processedContent = this.replaceVariable(
          processedContent,
          variable.name,
          formattedValue
        );
      }
    }

    // Check for unused variables in template
    const templateVariableNames = template.variables.map((v) => v.name);
    const unusedInTemplate = usedVariables.filter(
      (v) => !templateVariableNames.includes(v)
    );
    if (unusedInTemplate.length > 0) {
      warnings.push(
        `Undefined variables in template: ${unusedInTemplate.join(', ')}`
      );
    }

    // Update performance metrics
    await this.updateTemplatePerformance(templateId);

    return {
      content: processedContent,
      missingVariables,
      warnings,
    };
  }

  /**
   * Create new template
   */
  static async createTemplate(
    tenantId: string,
    templateData: Partial<AITemplate>
  ): Promise<AITemplate> {
    const template: AITemplate = {
      id: this.generateTemplateId(),
      tenantId,
      name: templateData.name || 'Untitled Template',
      category: templateData.category || 'email',
      content: templateData.content || '',
      variables: templateData.variables || [],
      isActive: templateData.isActive !== false,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: templateData.createdBy || 'system',
      tags: templateData.tags || [],
      metadata: {
        language: 'en',
        tone: 'professional',
        industry: 'transportation',
        useCase: 'general',
        ...templateData.metadata,
      },
      performance: {
        timesUsed: 0,
        successRate: 0,
        avgResponseTime: 0,
      },
    };

    // Validate template
    const validation = await this.validateTemplate(template);
    if (!validation.isValid) {
      throw new Error(
        `Template validation failed: ${validation.errors.join(', ')}`
      );
    }

    // Store template
    this.templates.set(template.id, template);

    // Save to database
    await this.saveTemplateToDatabase(template);

    return template;
  }

  /**
   * Update existing template
   */
  static async updateTemplate(
    templateId: string,
    updates: Partial<AITemplate>
  ): Promise<AITemplate> {
    const existing = await this.getTemplate(templateId);
    if (!existing) {
      throw new Error(`Template ${templateId} not found`);
    }

    const updated: AITemplate = {
      ...existing,
      ...updates,
      version: existing.version + 1,
      updatedAt: new Date(),
    };

    // Validate updated template
    const validation = await this.validateTemplate(updated);
    if (!validation.isValid) {
      throw new Error(
        `Template validation failed: ${validation.errors.join(', ')}`
      );
    }

    // Store updated template
    this.templates.set(templateId, updated);
    await this.saveTemplateToDatabase(updated);

    return updated;
  }

  /**
   * Get template by ID
   */
  static async getTemplate(templateId: string): Promise<AITemplate | null> {
    // Try memory cache first
    const cached = this.templates.get(templateId);
    if (cached) return cached;

    // Load from database
    const template = await this.loadTemplateFromDatabase(templateId);
    if (template) {
      this.templates.set(templateId, template);
    }

    return template;
  }

  /**
   * Get all templates for tenant
   */
  static async getTenantTemplates(
    tenantId: string,
    filters?: {
      category?: AITemplate['category'];
      isActive?: boolean;
      tags?: string[];
    }
  ): Promise<AITemplate[]> {
    const allTemplates = Array.from(this.templates.values()).filter(
      (t) => t.tenantId === tenantId
    );

    if (!filters) return allTemplates;

    return allTemplates.filter((template) => {
      if (filters.category && template.category !== filters.category) {
        return false;
      }
      if (
        filters.isActive !== undefined &&
        template.isActive !== filters.isActive
      ) {
        return false;
      }
      if (
        filters.tags &&
        !filters.tags.some((tag) => template.tags.includes(tag))
      ) {
        return false;
      }
      return true;
    });
  }

  /**
   * Test template with sample data
   */
  static async testTemplate(
    templateId: string,
    testContext: TemplateContext
  ): Promise<{
    result: string;
    variables: Record<string, any>;
    performance: {
      processingTime: number;
      success: boolean;
      errors: string[];
    };
  }> {
    const startTime = Date.now();
    const errors: string[] = [];
    let result = '';
    const variables = {};

    try {
      const processed = await this.processTemplate(templateId, testContext);
      result = processed.content;

      // Collect resolved variables
      const template = await this.getTemplate(templateId);
      if (template) {
        for (const variable of template.variables) {
          variables[variable.name] = await this.resolveVariable(
            variable,
            testContext
          );
        }
      }

      if (processed.missingVariables.length > 0) {
        errors.push(
          `Missing variables: ${processed.missingVariables.join(', ')}`
        );
      }
      errors.push(...processed.warnings);
    } catch (error) {
      errors.push(`Processing error: ${error.message}`);
    }

    return {
      result,
      variables,
      performance: {
        processingTime: Date.now() - startTime,
        success: errors.length === 0,
        errors,
      },
    };
  }

  /**
   * Clone template for different tenant
   */
  static async cloneTemplate(
    sourceTemplateId: string,
    targetTenantId: string,
    customizations?: Partial<AITemplate>
  ): Promise<AITemplate> {
    const source = await this.getTemplate(sourceTemplateId);
    if (!source) {
      throw new Error(`Source template ${sourceTemplateId} not found`);
    }

    const cloned = await this.createTemplate(targetTenantId, {
      ...source,
      ...customizations,
      name: customizations?.name || `Copy of ${source.name}`,
      performance: {
        timesUsed: 0,
        successRate: 0,
        avgResponseTime: 0,
      },
    });

    return cloned;
  }

  /**
   * Resolve variable value from context
   */
  private static async resolveVariable(
    variable: TemplateVariable,
    context: TemplateContext
  ): Promise<any> {
    // Check custom data first
    if (context.customData && context.customData[variable.name] !== undefined) {
      return context.customData[variable.name];
    }

    // Check lead data
    if (context.leadData && context.leadData[variable.name] !== undefined) {
      return context.leadData[variable.name];
    }

    // Check company data
    if (
      context.companyData &&
      context.companyData[variable.name] !== undefined
    ) {
      return context.companyData[variable.name];
    }

    // Special system variables
    switch (variable.name) {
      case 'current_date':
        return new Date().toLocaleDateString();
      case 'current_time':
        return new Date().toLocaleTimeString();
      case 'tenant_id':
        return context.tenantId;
      case 'user_id':
        return context.userId;
      default:
        return variable.defaultValue;
    }
  }

  /**
   * Replace variable in content
   */
  private static replaceVariable(
    content: string,
    variableName: string,
    value: any
  ): string {
    const regex = new RegExp(`\\{\\{\\s*${variableName}\\s*\\}\\}`, 'g');
    return content.replace(regex, String(value || ''));
  }

  /**
   * Validate variable value
   */
  private static validateVariable(
    variable: TemplateVariable,
    value: any
  ): { isValid: boolean; error?: string } {
    if (
      variable.required &&
      (value === null || value === undefined || value === '')
    ) {
      return { isValid: false, error: 'Required variable is missing' };
    }

    if (variable.validation) {
      const { min, max, pattern, customValidator } = variable.validation;

      if (min !== undefined && value < min) {
        return { isValid: false, error: `Value must be at least ${min}` };
      }

      if (max !== undefined && value > max) {
        return { isValid: false, error: `Value must be at most ${max}` };
      }

      if (
        pattern &&
        typeof value === 'string' &&
        !new RegExp(pattern).test(value)
      ) {
        return {
          isValid: false,
          error: 'Value does not match required pattern',
        };
      }

      if (customValidator && !customValidator(value)) {
        return { isValid: false, error: 'Custom validation failed' };
      }
    }

    return { isValid: true };
  }

  /**
   * Format value based on type
   */
  private static formatValue(
    type: TemplateVariable['type'],
    value: any
  ): string {
    switch (type) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'number':
        return Number(value).toLocaleString();
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return String(value);
    }
  }

  /**
   * Validate template structure
   */
  private static async validateTemplate(
    template: AITemplate
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!template.name || template.name.trim().length === 0) {
      errors.push('Template name is required');
    }

    if (!template.content || template.content.trim().length === 0) {
      errors.push('Template content is required');
    }

    // Check for malformed variables
    const variableMatches = template.content.match(this.VARIABLE_REGEX) || [];
    for (const match of variableMatches) {
      const variableName = match.replace(/\{\{|\}\}/g, '').trim();
      if (!variableName) {
        errors.push('Found empty variable placeholder');
      }
    }

    // Check for undefined variables
    const contentVariables = variableMatches.map((match) =>
      match.replace(/\{\{|\}\}/g, '').trim()
    );
    const definedVariables = template.variables.map((v) => v.name);
    const undefinedVariables = contentVariables.filter(
      (v) => !definedVariables.includes(v)
    );

    if (undefinedVariables.length > 0) {
      errors.push(`Undefined variables: ${undefinedVariables.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Update template performance metrics
   */
  private static async updateTemplatePerformance(
    templateId: string
  ): Promise<void> {
    const template = await this.getTemplate(templateId);
    if (!template) return;

    template.performance.timesUsed += 1;
    template.performance.lastUsed = new Date();

    // Update in memory and database
    this.templates.set(templateId, template);
    await this.saveTemplateToDatabase(template);
  }

  /**
   * Generate unique template ID
   */
  private static generateTemplateId(): string {
    return `TPL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  /**
   * Save template to database
   */
  private static async saveTemplateToDatabase(
    template: AITemplate
  ): Promise<void> {
    // This would save to PostgreSQL database
    console.info(`Saving template ${template.id} to database`);
  }

  /**
   * Load template from database
   */
  private static async loadTemplateFromDatabase(
    templateId: string
  ): Promise<AITemplate | null> {
    // This would load from PostgreSQL database
    console.info(`Loading template ${templateId} from database`);
    return null;
  }
}

export default AITemplateEngine;
