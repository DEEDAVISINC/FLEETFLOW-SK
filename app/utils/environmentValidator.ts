/**
 * Environment Configuration Validator
 * Validates required environment variables for FleetFlow billing integration
 */

interface EnvironmentConfig {
  // Square Configuration
  square: {
    applicationId?: string;
    accessToken?: string;
    locationId?: string;
  };

  // Bill.com Configuration
  billcom: {
    apiKey?: string;
    username?: string;
    password?: string;
    environment?: 'sandbox' | 'production';
    orgId?: string;
  };

  // Application Configuration
  app: {
    nodeEnv?: string;
    frontendUrl?: string;
    backendUrl?: string;
  };
}

class EnvironmentValidator {
  private config: EnvironmentConfig;
  private errors: string[] = [];
  private warnings: string[] = [];

  constructor() {
    this.config = this.loadConfig();
    this.validate();
  }

  private loadConfig(): EnvironmentConfig {
    return {
      square: {
        applicationId: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
        accessToken: process.env.NEXT_PUBLIC_SQUARE_ACCESS_TOKEN,
        locationId: process.env.SQUARE_LOCATION_ID,
      },
      billcom: {
        apiKey: process.env.BILLCOM_API_KEY,
        username: process.env.BILLCOM_USERNAME,
        password: process.env.BILLCOM_PASSWORD,
        environment:
          (process.env.BILLCOM_ENVIRONMENT as 'sandbox' | 'production') ||
          'sandbox',
        orgId: process.env.BILLCOM_ORG_ID,
      },
      app: {
        nodeEnv: process.env.NODE_ENV,
        frontendUrl:
          process.env.NEXT_PUBLIC_FRONTEND_URL || process.env.FRONTEND_URL,
        backendUrl:
          process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL,
      },
    };
  }

  private validate(): void {
    this.validateSquare();
    this.validateBillcom();
    this.validateApp();
  }

  private validateSquare(): void {
    const { square } = this.config;

    if (!square.applicationId) {
      this.warnings.push(
        'Missing NEXT_PUBLIC_SQUARE_APPLICATION_ID - Square payments will not work'
      );
      return;
    }

    if (!square.accessToken) {
      this.warnings.push(
        'Missing NEXT_PUBLIC_SQUARE_ACCESS_TOKEN - Square payments will not work'
      );
    }

    if (!square.locationId) {
      this.warnings.push(
        'Missing SQUARE_LOCATION_ID - some Square features may not work correctly'
      );
    }

    // Check for sandbox vs production environment
    const isSandbox =
      square.applicationId?.includes('sandbox') ||
      square.accessToken?.includes('sandbox');

    if (this.config.app.nodeEnv === 'production' && isSandbox) {
      this.warnings.push(
        'Using Square sandbox credentials in production environment'
      );
    }
  }

  private validateBillcom(): void {
    const { billcom } = this.config;

    if (!billcom.apiKey) {
      this.warnings.push(
        'Missing BILLCOM_API_KEY - Bill.com features will be disabled'
      );
      return;
    }

    if (!billcom.username) {
      this.errors.push('Missing BILLCOM_USERNAME');
    }

    if (!billcom.password) {
      this.errors.push('Missing BILLCOM_PASSWORD');
    }

    if (!billcom.orgId) {
      this.warnings.push(
        'Missing BILLCOM_ORG_ID - some features may not work correctly'
      );
    }

    if (!['sandbox', 'production'].includes(billcom.environment || '')) {
      this.errors.push(
        'Invalid BILLCOM_ENVIRONMENT - must be "sandbox" or "production"'
      );
    }

    if (
      this.config.app.nodeEnv === 'production' &&
      billcom.environment === 'sandbox'
    ) {
      this.warnings.push('Using Bill.com sandbox environment in production');
    }
  }

  private validateApp(): void {
    const { app } = this.config;

    if (!app.nodeEnv) {
      this.warnings.push('Missing NODE_ENV - defaulting to development');
    }

    if (app.nodeEnv === 'production') {
      if (!app.frontendUrl) {
        this.warnings.push('Missing FRONTEND_URL in production environment');
      }
      if (!app.backendUrl) {
        this.warnings.push('Missing BACKEND_URL in production environment');
      }
    }
  }

  public getValidationResults(): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    config: EnvironmentConfig;
  } {
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      config: this.config,
    };
  }

  public logResults(): void {
    const results = this.getValidationResults();

    console.info('🔧 FleetFlow Environment Validation');
    console.info('=====================================');

    if (results.isValid) {
      console.info('✅ Environment configuration is valid');
    } else {
      console.info('❌ Environment configuration has errors');
    }

    if (results.errors.length > 0) {
      console.info('\n🚨 Errors:');
      results.errors.forEach((error) => console.info(`  • ${error}`));
    }

    if (results.warnings.length > 0) {
      console.info('\n⚠️  Warnings:');
      results.warnings.forEach((warning) => console.info(`  • ${warning}`));
    }

    console.info('\n📊 Configuration Summary:');
    console.info(
      `  • Square: ${results.config.square.accessToken ? '✅ Configured' : '⚠️  Optional'}`
    );
    console.info(
      `  • Bill.com: ${results.config.billcom.apiKey ? '✅ Configured' : '⚠️  Optional'}`
    );
    console.info(
      `  • Environment: ${results.config.app.nodeEnv || 'development'}`
    );

    if (results.config.square.accessToken) {
      const isSandbox = results.config.square.accessToken.includes('sandbox');
      console.info(`  • Square Mode: ${isSandbox ? 'Sandbox' : 'Production'}`);
    }

    if (results.config.billcom.environment) {
      console.info(`  • Bill.com Mode: ${results.config.billcom.environment}`);
    }

    console.info('\n');
  }

  /**
   * Validates environment and throws if critical errors exist
   */
  public validateOrThrow(): void {
    const results = this.getValidationResults();

    if (!results.isValid) {
      const errorMessage = [
        'FleetFlow environment validation failed:',
        ...results.errors.map((e) => `  • ${e}`),
        '',
        'Please check your environment variables and try again.',
        'Please configure Square payment credentials or check your environment variables.',
      ].join('\n');

      throw new Error(errorMessage);
    }
  }

  /**
   * Check if billing features are available
   */
  public isBillingEnabled(): boolean {
    return !!(
      this.config.square.accessToken && this.config.square.applicationId
    );
  }

  /**
   * Check if Bill.com features are available
   */
  public isBillcomEnabled(): boolean {
    return !!(
      this.config.billcom.apiKey &&
      this.config.billcom.username &&
      this.config.billcom.password
    );
  }
}

// Singleton instance
export const environmentValidator = new EnvironmentValidator();

// Convenience exports
export const validateEnvironment = () =>
  environmentValidator.getValidationResults();
export const logEnvironmentStatus = () => environmentValidator.logResults();
export const requireValidEnvironment = () =>
  environmentValidator.validateOrThrow();
export const isBillingEnabled = () => environmentValidator.isBillingEnabled();
export const isBillcomEnabled = () => environmentValidator.isBillcomEnabled();

// Auto-validate on import in development
if (process.env.NODE_ENV !== 'test') {
  environmentValidator.logResults();
}

export default EnvironmentValidator;
