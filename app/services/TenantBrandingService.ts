/**
 * Tenant Branding Service
 * Comprehensive multi-tenant branding system that manages logos, colors, fonts,
 * and styling across all FleetFlow document templates and UI components.
 */

export interface TenantBrandingProfile {
  // Basic Information
  tenantId: string;
  companyName: string;
  companyLegalName: string;
  tagline?: string;

  // Visual Identity
  logoUrl?: string;
  faviconUrl?: string;
  brandMark?: string; // Small logo/icon

  // Color Palette
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    neutral: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    background: {
      primary: string;
      secondary: string;
      card: string;
      modal: string;
    };
    text: {
      primary: string;
      secondary: string;
      muted: string;
      inverse: string;
    };
    border: {
      light: string;
      default: string;
      dark: string;
    };
  };

  // Typography
  typography: {
    fontFamily: {
      primary: string;
      secondary: string;
      monospace: string;
      legal: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
      extrabold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
      loose: number;
    };
  };

  // Layout & Spacing
  layout: {
    borderRadius: {
      sm: string;
      default: string;
      lg: string;
      xl: string;
      full: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    shadows: {
      sm: string;
      default: string;
      lg: string;
      xl: string;
    };
  };

  // Document Specific
  documentStyling: {
    letterhead: {
      headerHeight: string;
      footerHeight: string;
      showLogo: boolean;
      showWatermark: boolean;
      watermarkOpacity: number;
    };
    pageSettings: {
      margin: string;
      pageSize: 'letter' | 'a4' | 'legal';
      orientation: 'portrait' | 'landscape';
    };
  };

  // Contact Information
  contactInfo: {
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    phone: {
      main: string;
      dispatch?: string;
      emergency?: string;
      fax?: string;
    };
    email: {
      main: string;
      dispatch?: string;
      legal?: string;
      support?: string;
    };
    website?: string;
    socialMedia?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
    };
  };

  // Legal Information
  legalInfo: {
    entityType: 'LLC' | 'Corporation' | 'Partnership' | 'Sole Proprietorship';
    stateOfIncorporation?: string;
    registrationNumber?: string;
    taxId?: string;
    dotNumber?: string;
    mcNumber?: string;
    licenses?: Array<{
      type: string;
      number: string;
      authority: string;
      expirationDate?: Date;
    }>;
  };

  // Industry Specific
  industryProfile: {
    primaryServices: string[];
    serviceAreas: string[];
    equipmentTypes?: string[];
    specializations?: string[];
    certifications?: string[];
  };

  // Custom Properties
  customProperties?: { [key: string]: any };

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  version: string;
}

export interface BrandingTheme {
  name: string;
  displayName: string;
  description: string;
  category: 'professional' | 'modern' | 'classic' | 'creative' | 'corporate';
  colorScheme: 'light' | 'dark' | 'auto';
  template: Partial<TenantBrandingProfile>;
}

class TenantBrandingService {
  private brandingProfiles: Map<string, TenantBrandingProfile> = new Map();
  private brandingThemes: Map<string, BrandingTheme> = new Map();

  constructor() {
    this.initializeDefaultProfiles();
    this.initializeBrandingThemes();
  }

  /**
   * Initialize default branding profiles for demo tenants
   */
  private initializeDefaultProfiles(): void {
    // FleetFlow Default Profile
    const fleetflowProfile: TenantBrandingProfile = {
      tenantId: 'fleetflow-demo',
      companyName: 'FleetFlow',
      companyLegalName: 'FleetFlow Logistics LLC',
      tagline: 'Professional Transportation Management',
      logoUrl: '/assets/branding/fleetflow-logo.png',
      faviconUrl: '/assets/branding/fleetflow-favicon.ico',
      brandMark: '/assets/branding/fleetflow-mark.png',
      colors: {
        primary: '#1e40af',
        secondary: '#3b82f6',
        accent: '#06b6d4',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#0ea5e9',
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        background: {
          primary: '#ffffff',
          secondary: '#f8fafc',
          card: '#ffffff',
          modal: '#ffffff',
        },
        text: {
          primary: '#1e293b',
          secondary: '#475569',
          muted: '#64748b',
          inverse: '#ffffff',
        },
        border: {
          light: '#f1f5f9',
          default: '#e2e8f0',
          dark: '#cbd5e1',
        },
      },
      typography: {
        fontFamily: {
          primary: "'Inter', 'Segoe UI', system-ui, sans-serif",
          secondary: "'Inter', 'Segoe UI', system-ui, sans-serif",
          monospace: "'JetBrains Mono', 'Fira Code', monospace",
          legal: "'Times New Roman', 'Georgia', serif",
        },
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
        },
        fontWeight: {
          light: 300,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
          extrabold: 800,
        },
        lineHeight: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.625,
          loose: 2,
        },
      },
      layout: {
        borderRadius: {
          sm: '0.25rem',
          default: '0.5rem',
          lg: '0.75rem',
          xl: '1rem',
          full: '9999px',
        },
        spacing: {
          xs: '0.5rem',
          sm: '1rem',
          md: '1.5rem',
          lg: '2rem',
          xl: '3rem',
          '2xl': '4rem',
          '3xl': '6rem',
        },
        shadows: {
          sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          default:
            '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
      },
      documentStyling: {
        letterhead: {
          headerHeight: '2in',
          footerHeight: '1in',
          showLogo: true,
          showWatermark: false,
          watermarkOpacity: 0.1,
        },
        pageSettings: {
          margin: '1in',
          pageSize: 'letter',
          orientation: 'portrait',
        },
      },
      contactInfo: {
        address: {
          street: '1234 Business Drive',
          city: 'Business City',
          state: 'CA',
          zipCode: '90210',
          country: 'United States',
        },
        phone: {
          main: '(555) 123-4567',
          dispatch: '(555) 123-4568',
          emergency: '(555) 123-4569',
        },
        email: {
          main: 'info@fleetflow.com',
          dispatch: 'dispatch@fleetflow.com',
          legal: 'legal@fleetflow.com',
          support: 'support@fleetflow.com',
        },
        website: 'www.fleetflow.com',
        socialMedia: {
          linkedin: 'linkedin.com/company/fleetflow',
          twitter: 'twitter.com/fleetflow',
        },
      },
      legalInfo: {
        entityType: 'LLC',
        stateOfIncorporation: 'Delaware',
        registrationNumber: 'DE-123456789',
        dotNumber: 'DOT-123456',
        mcNumber: 'MC-123456',
        licenses: [
          {
            type: 'Motor Carrier Authority',
            number: 'MC-123456',
            authority: 'FMCSA',
            expirationDate: new Date('2025-12-31'),
          },
        ],
      },
      industryProfile: {
        primaryServices: [
          'Freight Brokerage',
          'Transportation Management',
          'Logistics Consulting',
        ],
        serviceAreas: ['North America', 'Continental US', 'Cross-Border'],
        equipmentTypes: ['Dry Van', 'Refrigerated', 'Flatbed', 'LTL'],
        specializations: [
          'Just-in-Time Delivery',
          'Hazmat Transportation',
          'Expedited Service',
        ],
        certifications: [
          'SmartWay Partner',
          'C-TPAT Certified',
          'ISO 9001:2015',
        ],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      version: '1.0.0',
    };

    // Global Freight Solutions Profile
    const globalFreightProfile: TenantBrandingProfile = {
      ...fleetflowProfile,
      tenantId: 'global-freight',
      companyName: 'Global Freight Solutions',
      companyLegalName: 'Global Freight Solutions LLC',
      tagline: 'Connecting Supply Chains Worldwide',
      colors: {
        ...fleetflowProfile.colors,
        primary: '#059669',
        secondary: '#10b981',
        accent: '#34d399',
      },
      contactInfo: {
        ...fleetflowProfile.contactInfo,
        address: {
          street: '5678 Transportation Blvd',
          city: 'Logistics City',
          state: 'TX',
          zipCode: '75201',
          country: 'United States',
        },
        phone: {
          main: '(555) 888-1234',
          dispatch: '(555) 888-1235',
          emergency: '(555) 888-1236',
        },
        email: {
          main: 'info@globalfreight.com',
          dispatch: 'dispatch@globalfreight.com',
          legal: 'legal@globalfreight.com',
          support: 'support@globalfreight.com',
        },
        website: 'www.globalfreight.com',
      },
      legalInfo: {
        ...fleetflowProfile.legalInfo,
        stateOfIncorporation: 'Texas',
        registrationNumber: 'TX-987654321',
        dotNumber: 'DOT-987654',
        mcNumber: 'MC-987654',
      },
    };

    // Swift Freight Services Profile
    const swiftFreightProfile: TenantBrandingProfile = {
      ...fleetflowProfile,
      tenantId: 'swift-freight',
      companyName: 'Swift Freight Services',
      companyLegalName: 'Swift Freight Services Inc.',
      tagline: 'Speed. Reliability. Excellence.',
      colors: {
        ...fleetflowProfile.colors,
        primary: '#dc2626',
        secondary: '#ef4444',
        accent: '#f87171',
        success: '#16a34a',
        warning: '#ca8a04',
        error: '#dc2626',
      },
      contactInfo: {
        ...fleetflowProfile.contactInfo,
        address: {
          street: '9876 Express Lane',
          city: 'Swift City',
          state: 'FL',
          zipCode: '33101',
          country: 'United States',
        },
        phone: {
          main: '(555) 777-5678',
          dispatch: '(555) 777-5679',
          emergency: '(555) 777-5680',
        },
        email: {
          main: 'info@swiftfreight.com',
          dispatch: 'dispatch@swiftfreight.com',
          legal: 'legal@swiftfreight.com',
          support: 'support@swiftfreight.com',
        },
        website: 'www.swiftfreight.com',
      },
      legalInfo: {
        ...fleetflowProfile.legalInfo,
        entityType: 'Corporation',
        stateOfIncorporation: 'Florida',
        registrationNumber: 'FL-456789123',
        dotNumber: 'DOT-456789',
        mcNumber: 'MC-456789',
      },
    };

    // Express Cargo Profile
    const expressCargoProfile: TenantBrandingProfile = {
      ...fleetflowProfile,
      tenantId: 'express-cargo',
      companyName: 'Express Cargo',
      companyLegalName: 'Express Cargo Solutions LLC',
      tagline: 'Expedited Transportation Solutions',
      colors: {
        ...fleetflowProfile.colors,
        primary: '#7c3aed',
        secondary: '#8b5cf6',
        accent: '#a78bfa',
      },
      contactInfo: {
        ...fleetflowProfile.contactInfo,
        address: {
          street: '2468 Cargo Way',
          city: 'Express City',
          state: 'IL',
          zipCode: '60601',
          country: 'United States',
        },
        phone: {
          main: '(555) 999-0123',
          dispatch: '(555) 999-0124',
          emergency: '(555) 999-0125',
        },
        email: {
          main: 'info@expresscargo.com',
          dispatch: 'dispatch@expresscargo.com',
          legal: 'legal@expresscargo.com',
          support: 'support@expresscargo.com',
        },
        website: 'www.expresscargo.com',
      },
      legalInfo: {
        ...fleetflowProfile.legalInfo,
        stateOfIncorporation: 'Illinois',
        registrationNumber: 'IL-741852963',
        dotNumber: 'DOT-741852',
        mcNumber: 'MC-741852',
      },
    };

    // Store profiles
    this.brandingProfiles.set(fleetflowProfile.tenantId, fleetflowProfile);
    this.brandingProfiles.set(
      globalFreightProfile.tenantId,
      globalFreightProfile
    );
    this.brandingProfiles.set(
      swiftFreightProfile.tenantId,
      swiftFreightProfile
    );
    this.brandingProfiles.set(
      expressCargoProfile.tenantId,
      expressCargoProfile
    );
  }

  /**
   * Initialize pre-built branding themes
   */
  private initializeBrandingThemes(): void {
    const themes: BrandingTheme[] = [
      {
        name: 'professional-blue',
        displayName: 'Professional Blue',
        description: 'Clean, professional design with blue color scheme',
        category: 'professional',
        colorScheme: 'light',
        template: {
          colors: {
            primary: '#1e40af',
            secondary: '#3b82f6',
            accent: '#06b6d4',
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#0ea5e9',
            neutral: {
              50: '#f8fafc',
              100: '#f1f5f9',
              200: '#e2e8f0',
              300: '#cbd5e1',
              400: '#94a3b8',
              500: '#64748b',
              600: '#475569',
              700: '#334155',
              800: '#1e293b',
              900: '#0f172a',
            },
            background: {
              primary: '#ffffff',
              secondary: '#f8fafc',
              card: '#ffffff',
              modal: '#ffffff',
            },
            text: {
              primary: '#1e293b',
              secondary: '#475569',
              muted: '#64748b',
              inverse: '#ffffff',
            },
            border: {
              light: '#f1f5f9',
              default: '#e2e8f0',
              dark: '#cbd5e1',
            },
          },
        },
      },
      {
        name: 'modern-green',
        displayName: 'Modern Green',
        description: 'Fresh, eco-friendly design with green accents',
        category: 'modern',
        colorScheme: 'light',
        template: {
          colors: {
            primary: '#059669',
            secondary: '#10b981',
            accent: '#34d399',
            success: '#16a34a',
            warning: '#ca8a04',
            error: '#dc2626',
            info: '#0ea5e9',
            neutral: {
              50: '#f0fdf4',
              100: '#dcfce7',
              200: '#bbf7d0',
              300: '#86efac',
              400: '#4ade80',
              500: '#22c55e',
              600: '#16a34a',
              700: '#15803d',
              800: '#166534',
              900: '#14532d',
            },
            background: {
              primary: '#ffffff',
              secondary: '#f0fdf4',
              card: '#ffffff',
              modal: '#ffffff',
            },
            text: {
              primary: '#14532d',
              secondary: '#166534',
              muted: '#16a34a',
              inverse: '#ffffff',
            },
            border: {
              light: '#dcfce7',
              default: '#bbf7d0',
              dark: '#86efac',
            },
          },
        },
      },
      {
        name: 'corporate-navy',
        displayName: 'Corporate Navy',
        description: 'Sophisticated navy blue theme for enterprise clients',
        category: 'corporate',
        colorScheme: 'light',
        template: {
          colors: {
            primary: '#1e3a8a',
            secondary: '#3730a3',
            accent: '#6366f1',
            success: '#059669',
            warning: '#d97706',
            error: '#dc2626',
            info: '#0284c7',
            neutral: {
              50: '#f8fafc',
              100: '#f1f5f9',
              200: '#e2e8f0',
              300: '#cbd5e1',
              400: '#94a3b8',
              500: '#64748b',
              600: '#475569',
              700: '#334155',
              800: '#1e293b',
              900: '#0f172a',
            },
            background: {
              primary: '#ffffff',
              secondary: '#f8fafc',
              card: '#ffffff',
              modal: '#ffffff',
            },
            text: {
              primary: '#0f172a',
              secondary: '#334155',
              muted: '#64748b',
              inverse: '#ffffff',
            },
            border: {
              light: '#f1f5f9',
              default: '#e2e8f0',
              dark: '#cbd5e1',
            },
          },
        },
      },
      {
        name: 'vibrant-orange',
        displayName: 'Vibrant Orange',
        description: 'Energetic orange theme for dynamic companies',
        category: 'creative',
        colorScheme: 'light',
        template: {
          colors: {
            primary: '#ea580c',
            secondary: '#f97316',
            accent: '#fb923c',
            success: '#16a34a',
            warning: '#ca8a04',
            error: '#dc2626',
            info: '#0284c7',
            neutral: {
              50: '#fff7ed',
              100: '#ffedd5',
              200: '#fed7aa',
              300: '#fdba74',
              400: '#fb923c',
              500: '#f97316',
              600: '#ea580c',
              700: '#c2410c',
              800: '#9a3412',
              900: '#7c2d12',
            },
            background: {
              primary: '#ffffff',
              secondary: '#fff7ed',
              card: '#ffffff',
              modal: '#ffffff',
            },
            text: {
              primary: '#7c2d12',
              secondary: '#9a3412',
              muted: '#c2410c',
              inverse: '#ffffff',
            },
            border: {
              light: '#ffedd5',
              default: '#fed7aa',
              dark: '#fdba74',
            },
          },
        },
      },
      {
        name: 'classic-burgundy',
        displayName: 'Classic Burgundy',
        description: 'Elegant burgundy theme for traditional businesses',
        category: 'classic',
        colorScheme: 'light',
        template: {
          colors: {
            primary: '#991b1b',
            secondary: '#dc2626',
            accent: '#ef4444',
            success: '#16a34a',
            warning: '#ca8a04',
            error: '#991b1b',
            info: '#0284c7',
            neutral: {
              50: '#fef2f2',
              100: '#fee2e2',
              200: '#fecaca',
              300: '#fca5a5',
              400: '#f87171',
              500: '#ef4444',
              600: '#dc2626',
              700: '#b91c1c',
              800: '#991b1b',
              900: '#7f1d1d',
            },
            background: {
              primary: '#ffffff',
              secondary: '#fef2f2',
              card: '#ffffff',
              modal: '#ffffff',
            },
            text: {
              primary: '#7f1d1d',
              secondary: '#991b1b',
              muted: '#b91c1c',
              inverse: '#ffffff',
            },
            border: {
              light: '#fee2e2',
              default: '#fecaca',
              dark: '#fca5a5',
            },
          },
        },
      },
    ];

    themes.forEach((theme) => {
      this.brandingThemes.set(theme.name, theme);
    });
  }

  /**
   * Get branding profile for a tenant
   */
  getBrandingProfile(tenantId: string): TenantBrandingProfile | null {
    return this.brandingProfiles.get(tenantId) || null;
  }

  /**
   * Get branding profile or fallback to default
   */
  getBrandingProfileOrDefault(tenantId: string): TenantBrandingProfile {
    return (
      this.getBrandingProfile(tenantId) ||
      this.getBrandingProfile('fleetflow-demo')!
    );
  }

  /**
   * Create or update branding profile
   */
  async setBrandingProfile(
    tenantId: string,
    profile: Partial<TenantBrandingProfile>
  ): Promise<TenantBrandingProfile> {
    const existingProfile = this.getBrandingProfile(tenantId);

    const updatedProfile: TenantBrandingProfile = {
      ...(existingProfile || this.getBrandingProfile('fleetflow-demo')!),
      ...profile,
      tenantId,
      updatedAt: new Date(),
      version: this.incrementVersion(existingProfile?.version || '1.0.0'),
    };

    this.brandingProfiles.set(tenantId, updatedProfile);

    console.log(
      `✅ Branding profile ${existingProfile ? 'updated' : 'created'} for tenant: ${tenantId}`
    );
    return updatedProfile;
  }

  /**
   * Apply theme to branding profile
   */
  async applyTheme(
    tenantId: string,
    themeName: string
  ): Promise<TenantBrandingProfile> {
    const theme = this.brandingThemes.get(themeName);
    if (!theme) {
      throw new Error(`Theme not found: ${themeName}`);
    }

    const currentProfile = this.getBrandingProfileOrDefault(tenantId);

    return await this.setBrandingProfile(tenantId, {
      ...theme.template,
      tenantId,
      companyName: currentProfile.companyName,
      companyLegalName: currentProfile.companyLegalName,
      contactInfo: currentProfile.contactInfo,
      legalInfo: currentProfile.legalInfo,
    });
  }

  /**
   * Get available themes
   */
  getAvailableThemes(): BrandingTheme[] {
    return Array.from(this.brandingThemes.values());
  }

  /**
   * Get themes by category
   */
  getThemesByCategory(category: BrandingTheme['category']): BrandingTheme[] {
    return this.getAvailableThemes().filter(
      (theme) => theme.category === category
    );
  }

  /**
   * Generate CSS variables for a tenant
   */
  generateCSSVariables(tenantId: string): string {
    const profile = this.getBrandingProfileOrDefault(tenantId);

    return `
:root {
  /* Colors */
  --color-primary: ${profile.colors.primary};
  --color-secondary: ${profile.colors.secondary};
  --color-accent: ${profile.colors.accent};
  --color-success: ${profile.colors.success};
  --color-warning: ${profile.colors.warning};
  --color-error: ${profile.colors.error};
  --color-info: ${profile.colors.info};

  /* Neutral Colors */
  --color-neutral-50: ${profile.colors.neutral[50]};
  --color-neutral-100: ${profile.colors.neutral[100]};
  --color-neutral-200: ${profile.colors.neutral[200]};
  --color-neutral-300: ${profile.colors.neutral[300]};
  --color-neutral-400: ${profile.colors.neutral[400]};
  --color-neutral-500: ${profile.colors.neutral[500]};
  --color-neutral-600: ${profile.colors.neutral[600]};
  --color-neutral-700: ${profile.colors.neutral[700]};
  --color-neutral-800: ${profile.colors.neutral[800]};
  --color-neutral-900: ${profile.colors.neutral[900]};

  /* Background Colors */
  --bg-primary: ${profile.colors.background.primary};
  --bg-secondary: ${profile.colors.background.secondary};
  --bg-card: ${profile.colors.background.card};
  --bg-modal: ${profile.colors.background.modal};

  /* Text Colors */
  --text-primary: ${profile.colors.text.primary};
  --text-secondary: ${profile.colors.text.secondary};
  --text-muted: ${profile.colors.text.muted};
  --text-inverse: ${profile.colors.text.inverse};

  /* Border Colors */
  --border-light: ${profile.colors.border.light};
  --border-default: ${profile.colors.border.default};
  --border-dark: ${profile.colors.border.dark};

  /* Typography */
  --font-primary: ${profile.typography.fontFamily.primary};
  --font-secondary: ${profile.typography.fontFamily.secondary};
  --font-monospace: ${profile.typography.fontFamily.monospace};
  --font-legal: ${profile.typography.fontFamily.legal};

  /* Font Sizes */
  --text-xs: ${profile.typography.fontSize.xs};
  --text-sm: ${profile.typography.fontSize.sm};
  --text-base: ${profile.typography.fontSize.base};
  --text-lg: ${profile.typography.fontSize.lg};
  --text-xl: ${profile.typography.fontSize.xl};
  --text-2xl: ${profile.typography.fontSize['2xl']};
  --text-3xl: ${profile.typography.fontSize['3xl']};
  --text-4xl: ${profile.typography.fontSize['4xl']};

  /* Font Weights */
  --font-light: ${profile.typography.fontWeight.light};
  --font-normal: ${profile.typography.fontWeight.normal};
  --font-medium: ${profile.typography.fontWeight.medium};
  --font-semibold: ${profile.typography.fontWeight.semibold};
  --font-bold: ${profile.typography.fontWeight.bold};
  --font-extrabold: ${profile.typography.fontWeight.extrabold};

  /* Border Radius */
  --radius-sm: ${profile.layout.borderRadius.sm};
  --radius-default: ${profile.layout.borderRadius.default};
  --radius-lg: ${profile.layout.borderRadius.lg};
  --radius-xl: ${profile.layout.borderRadius.xl};
  --radius-full: ${profile.layout.borderRadius.full};

  /* Spacing */
  --spacing-xs: ${profile.layout.spacing.xs};
  --spacing-sm: ${profile.layout.spacing.sm};
  --spacing-md: ${profile.layout.spacing.md};
  --spacing-lg: ${profile.layout.spacing.lg};
  --spacing-xl: ${profile.layout.spacing.xl};
  --spacing-2xl: ${profile.layout.spacing['2xl']};
  --spacing-3xl: ${profile.layout.spacing['3xl']};

  /* Shadows */
  --shadow-sm: ${profile.layout.shadows.sm};
  --shadow-default: ${profile.layout.shadows.default};
  --shadow-lg: ${profile.layout.shadows.lg};
  --shadow-xl: ${profile.layout.shadows.xl};
}`;
  }

  /**
   * Generate theme-based CSS classes
   */
  generateThemeCSS(tenantId: string): string {
    const profile = this.getBrandingProfileOrDefault(tenantId);
    const cssVars = this.generateCSSVariables(tenantId);

    return `
${cssVars}

/* Tenant-specific utility classes */
.tenant-primary { color: var(--color-primary); }
.tenant-primary-bg { background-color: var(--color-primary); }
.tenant-secondary { color: var(--color-secondary); }
.tenant-secondary-bg { background-color: var(--color-secondary); }
.tenant-accent { color: var(--color-accent); }
.tenant-accent-bg { background-color: var(--color-accent); }

.tenant-font-primary { font-family: var(--font-primary); }
.tenant-font-secondary { font-family: var(--font-secondary); }
.tenant-font-legal { font-family: var(--font-legal); }

.tenant-bg-primary { background-color: var(--bg-primary); }
.tenant-bg-secondary { background-color: var(--bg-secondary); }
.tenant-bg-card { background-color: var(--bg-card); }

.tenant-text-primary { color: var(--text-primary); }
.tenant-text-secondary { color: var(--text-secondary); }
.tenant-text-muted { color: var(--text-muted); }

.tenant-border { border-color: var(--border-default); }
.tenant-border-light { border-color: var(--border-light); }
.tenant-border-dark { border-color: var(--border-dark); }

.tenant-shadow { box-shadow: var(--shadow-default); }
.tenant-shadow-lg { box-shadow: var(--shadow-lg); }

/* Company-specific styles */
.company-header {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: var(--text-inverse);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
}

.company-card {
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-default);
  box-shadow: var(--shadow-default);
  padding: var(--spacing-md);
}

.company-button-primary {
  background: var(--color-primary);
  color: var(--text-inverse);
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-default);
  font-family: var(--font-primary);
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.company-button-primary:hover {
  background: var(--color-secondary);
  box-shadow: var(--shadow-lg);
}`;
  }

  /**
   * Export branding profile for external use
   */
  exportBrandingProfile(tenantId: string): string {
    const profile = this.getBrandingProfile(tenantId);
    if (!profile) {
      throw new Error(`Branding profile not found for tenant: ${tenantId}`);
    }

    return JSON.stringify(profile, null, 2);
  }

  /**
   * Import branding profile from JSON
   */
  async importBrandingProfile(
    profileJson: string
  ): Promise<TenantBrandingProfile> {
    const profile = JSON.parse(profileJson) as TenantBrandingProfile;

    // Validate required fields
    if (!profile.tenantId || !profile.companyName) {
      throw new Error('Invalid branding profile: missing required fields');
    }

    return await this.setBrandingProfile(profile.tenantId, profile);
  }

  /**
   * Get all tenant IDs
   */
  getAllTenantIds(): string[] {
    return Array.from(this.brandingProfiles.keys());
  }

  /**
   * Delete branding profile
   */
  deleteBrandingProfile(tenantId: string): boolean {
    return this.brandingProfiles.delete(tenantId);
  }

  /**
   * Check if tenant has custom branding
   */
  hasCustomBranding(tenantId: string): boolean {
    const profile = this.getBrandingProfile(tenantId);
    return profile !== null && profile.tenantId !== 'fleetflow-demo';
  }

  /**
   * Get branding analytics
   */
  getBrandingAnalytics(): {
    totalProfiles: number;
    activeProfiles: number;
    themeUsage: { [theme: string]: number };
    entityTypes: { [type: string]: number };
    states: { [state: string]: number };
  } {
    const profiles = Array.from(this.brandingProfiles.values());

    const themeUsage: { [theme: string]: number } = {};
    const entityTypes: { [type: string]: number } = {};
    const states: { [state: string]: number } = {};

    profiles.forEach((profile) => {
      // Count entity types
      entityTypes[profile.legalInfo.entityType] =
        (entityTypes[profile.legalInfo.entityType] || 0) + 1;

      // Count states
      const state = profile.contactInfo.address.state;
      states[state] = (states[state] || 0) + 1;
    });

    return {
      totalProfiles: profiles.length,
      activeProfiles: profiles.filter((p) => p.isActive).length,
      themeUsage,
      entityTypes,
      states,
    };
  }

  /**
   * Private helper to increment version
   */
  private incrementVersion(version: string): string {
    const parts = version.split('.');
    const patch = parseInt(parts[2] || '0') + 1;
    return `${parts[0]}.${parts[1]}.${patch}`;
  }
}

export const tenantBrandingService = new TenantBrandingService();



