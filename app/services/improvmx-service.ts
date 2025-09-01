// ImprovMX Email Forwarding Service for FleetFlow
// Manages email aliases and forwarding for fleetflowapp.com

export interface ImprovMXAlias {
  alias: string;
  forward: string;
  id?: number;
}

export interface ImprovMXDomain {
  domain: string;
  active: boolean;
  webhook?: string;
  whitelabel?: string;
}

export interface ImprovMXResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DepartmentEmailMapping {
  [alias: string]: string;
}

export class ImprovMXService {
  private apiKey: string;
  private baseUrl = 'https://api.improvmx.com/v3';
  private domain = 'fleetflowapp.com';

  constructor() {
    this.apiKey = process.env.IMPROVMX_API_KEY || '';
    if (!this.apiKey) {
      console.warn('⚠️ ImprovMX API key not found in environment variables');
    }
  }

  // Get all aliases for the domain
  async getAliases(): Promise<ImprovMXResponse<ImprovMXAlias[]>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/domains/${this.domain}/aliases`,
        {
          method: 'GET',
          headers: {
            Authorization: `Basic ${Buffer.from(`api:${this.apiKey}`).toString('base64')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data: data.aliases || [],
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: `ImprovMX API error: ${response.status} - ${errorData.error || response.statusText}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Create a new email alias
  async createAlias(
    alias: string,
    forward: string
  ): Promise<ImprovMXResponse<ImprovMXAlias>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/domains/${this.domain}/aliases`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(`api:${this.apiKey}`).toString('base64')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            alias,
            forward,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.info(
          `✅ Created email alias: ${alias}@${this.domain} → ${forward}`
        );
        return {
          success: true,
          data: data.alias,
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: `ImprovMX API error: ${response.status} - ${errorData.error || response.statusText}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Update an existing alias
  async updateAlias(
    aliasId: number,
    forward: string
  ): Promise<ImprovMXResponse<ImprovMXAlias>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/domains/${this.domain}/aliases/${aliasId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Basic ${Buffer.from(`api:${this.apiKey}`).toString('base64')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            forward,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.info(`✅ Updated email alias ID ${aliasId} → ${forward}`);
        return {
          success: true,
          data: data.alias,
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: `ImprovMX API error: ${response.status} - ${errorData.error || response.statusText}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Delete an alias
  async deleteAlias(aliasId: number): Promise<ImprovMXResponse<void>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/domains/${this.domain}/aliases/${aliasId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Basic ${Buffer.from(`api:${this.apiKey}`).toString('base64')}`,
          },
        }
      );

      if (response.ok) {
        console.info(`✅ Deleted email alias ID ${aliasId}`);
        return { success: true };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: `ImprovMX API error: ${response.status} - ${errorData.error || response.statusText}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get domain information
  async getDomainInfo(): Promise<ImprovMXResponse<ImprovMXDomain>> {
    try {
      const response = await fetch(`${this.baseUrl}/domains/${this.domain}`, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${this.apiKey}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data: data.domain,
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: `ImprovMX API error: ${response.status} - ${errorData.error || response.statusText}`,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Setup default FleetFlow email aliases
  async setupDefaultAliases(
    forwardToEmail: string
  ): Promise<ImprovMXResponse<ImprovMXAlias[]>> {
    const defaultAliases = [
      'support',
      'contact',
      'billing',
      'privacy',
      'legal',
      'noreply',
      'university',
      'onboarding',
      'security',
      'compliance',
    ];

    const results: ImprovMXAlias[] = [];
    const errors: string[] = [];

    for (const alias of defaultAliases) {
      const result = await this.createAlias(alias, forwardToEmail);
      if (result.success && result.data) {
        results.push(result.data);
      } else {
        errors.push(`${alias}: ${result.error}`);
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (errors.length > 0) {
      return {
        success: false,
        error: `Some aliases failed to create: ${errors.join(', ')}`,
        data: results,
      };
    }

    return {
      success: true,
      data: results,
    };
  }

  // Setup FleetFlow departmental email aliases
  async setupDepartmentalAliases(
    departmentEmailMapping: DepartmentEmailMapping
  ): Promise<ImprovMXResponse<ImprovMXAlias[]>> {
    const results: ImprovMXAlias[] = [];
    const errors: string[] = [];

    for (const [alias, email] of Object.entries(departmentEmailMapping)) {
      const result = await this.createAlias(alias, email);
      if (result.success && result.data) {
        results.push(result.data);
        console.info(
          `✅ Created departmental alias: ${alias}@fleetflowapp.com → ${email}`
        );
      } else {
        errors.push(`${alias}: ${result.error}`);
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (errors.length > 0) {
      return {
        success: false,
        error: `Some departmental aliases failed to create: ${errors.join(', ')}`,
        data: results,
      };
    }

    return {
      success: true,
      data: results,
    };
  }

  // Development mode fallback
  private logDevMode(action: string, details: any) {
    if (!this.apiKey) {
      console.info(`📧 ImprovMX (Dev Mode) - ${action}:`, details);
    }
  }
}

// Export singleton instance
export const improvmxService = new ImprovMXService();
