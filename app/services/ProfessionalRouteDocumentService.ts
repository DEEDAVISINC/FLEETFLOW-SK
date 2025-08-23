/**
 * Professional Route Document Service
 * Generates visually appealing, professional route documents with modern HTML/CSS styling,
 * company branding, and interactive features for FleetFlow dispatch operations.
 */

export interface RouteDocumentData {
  // Route Information
  routeNumber: string;
  routeName: string;
  routeDate: string;
  totalMiles: number;
  totalAmount: number;
  ratePerMile: number;

  // Company Information
  companyName: string;
  mcNumber: string;
  contactPhone: string;
  dispatchPhone: string;

  // Pickup Information
  pickupLocationName: string;
  pickupAddress: string;
  pickupTime: string;
  pickupContact: string;
  pickupManager: string;
  pickupPhone: string;
  locationType: string;
  confirmationNumber: string;

  // Requirements and Notes
  safetyRequirements: string;
  accessRequirements: string;
  timingRestrictions: string;
  documentationRequirements: string;
  loadingArea: string;
  pickupNotes: string;

  // Delivery Information
  deliveryStops: DeliveryStop[];

  // Driver Information
  driverName: string;
  vehicleNumber: string;

  // Navigation
  googleMapsLink: string;

  // Additional Data
  tenantId?: string;
  priority?: 'normal' | 'urgent' | 'critical';
  specialInstructions?: string;
}

export interface DeliveryStop {
  stopNumber: number;
  stopName: string;
  stopAddress: string;
  deliveryTime: string;
  items: string;
  contact: string;
  instructions: string;
  estimatedDuration?: number;
}

export interface RouteDocumentTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardBackgroundColor: string;
  textColor: string;
  headingColor: string;
  borderColor: string;
  successColor: string;
  warningColor: string;
  urgentColor: string;
  fontFamily: string;
  headerFontFamily: string;
}

export interface CompanyBranding {
  companyName: string;
  logoUrl?: string;
  tagline?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
    address?: string;
  };
}

class ProfessionalRouteDocumentService {
  private themes: Record<string, RouteDocumentTheme> = {
    fleetflow: {
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      accentColor: '#06b6d4',
      backgroundColor: '#f8fafc',
      cardBackgroundColor: '#ffffff',
      textColor: '#374151',
      headingColor: '#1f2937',
      borderColor: '#e5e7eb',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      urgentColor: '#ef4444',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      headerFontFamily: "'Inter', 'Segoe UI', sans-serif",
    },
    logistics: {
      primaryColor: '#0c4a6e',
      secondaryColor: '#0284c7',
      accentColor: '#0891b2',
      backgroundColor: '#f0f9ff',
      cardBackgroundColor: '#ffffff',
      textColor: '#374151',
      headingColor: '#0f172a',
      borderColor: '#cbd5e1',
      successColor: '#059669',
      warningColor: '#d97706',
      urgentColor: '#dc2626',
      fontFamily: "'Roboto', 'Arial', sans-serif",
      headerFontFamily: "'Roboto', 'Arial Black', sans-serif",
    },
    transport: {
      primaryColor: '#7c2d12',
      secondaryColor: '#ea580c',
      accentColor: '#f97316',
      backgroundColor: '#fefdf8',
      cardBackgroundColor: '#ffffff',
      textColor: '#44403c',
      headingColor: '#1c1917',
      borderColor: '#d6d3d1',
      successColor: '#16a34a',
      warningColor: '#ca8a04',
      urgentColor: '#dc2626',
      fontFamily: "'Open Sans', 'Arial', sans-serif",
      headerFontFamily: "'Open Sans', 'Arial Black', sans-serif",
    },
  };

  private defaultBranding: CompanyBranding = {
    companyName: 'FleetFlow Logistics',
    logoUrl: '/assets/fleetflow-logo.png',
    tagline: 'Professional Transportation Management',
    primaryColor: '#1e40af',
    secondaryColor: '#3b82f6',
    fontFamily: "'Inter', sans-serif",
    contactInfo: {
      phone: '(555) 123-4567',
      email: 'dispatch@fleetflow.com',
      website: 'www.fleetflow.com',
      address: 'FleetFlow Operations Center',
    },
  };

  /**
   * Generate a professional HTML route document
   */
  async generateProfessionalRouteDocument(
    routeData: RouteDocumentData,
    options: {
      theme?: string;
      format?: 'html' | 'pdf-ready' | 'mobile';
      includeMaps?: boolean;
      includeQRCode?: boolean;
      branding?: Partial<CompanyBranding>;
    } = {}
  ): Promise<{ html: string; filename: string }> {
    const theme = this.themes[options.theme || 'fleetflow'];
    const branding = { ...this.defaultBranding, ...options.branding };

    const html = this.generateRouteHTML(routeData, theme, branding, options);
    const filename = `Route-${routeData.routeNumber}-${routeData.routeDate.replace(/\//g, '-')}.html`;

    return { html, filename };
  }

  /**
   * Generate the complete HTML structure for the route document
   */
  private generateRouteHTML(
    routeData: RouteDocumentData,
    theme: RouteDocumentTheme,
    branding: CompanyBranding,
    options: any
  ): string {
    const isMobile = options.format === 'mobile';
    const isPrintReady = options.format === 'pdf-ready';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Route ${routeData.routeNumber} - ${routeData.routeName}</title>
    <style>
        ${this.generateCSS(theme, branding, isMobile, isPrintReady)}
    </style>
    ${options.includeMaps ? '<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>' : ''}
</head>
<body>
    <div class="route-document">
        ${this.generateHeader(routeData, theme, branding)}
        ${this.generateRouteOverview(routeData, theme)}
        ${this.generatePickupSection(routeData, theme)}
        ${this.generateDeliverySection(routeData, theme)}
        ${this.generateDriverSection(routeData, theme)}
        ${this.generateNavigationSection(routeData, theme, options.includeMaps)}
        ${this.generateEmergencySection(routeData, theme)}
        ${this.generateFooter(routeData, theme, branding)}
        ${options.includeQRCode ? this.generateQRCodeSection(routeData, theme) : ''}
    </div>

    ${isMobile ? this.generateMobileScripts() : ''}
    ${options.includeMaps ? this.generateMapScripts(routeData) : ''}
</body>
</html>`;
  }

  /**
   * Generate comprehensive CSS styles for the route document
   */
  private generateCSS(
    theme: RouteDocumentTheme,
    branding: CompanyBranding,
    isMobile: boolean,
    isPrintReady: boolean
  ): string {
    return `
/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: ${theme.fontFamily};
    background-color: ${theme.backgroundColor};
    color: ${theme.textColor};
    line-height: 1.6;
    font-size: ${isMobile ? '16px' : '14px'};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Document Container */
.route-document {
    max-width: ${isMobile ? '100%' : '1200px'};
    margin: 0 auto;
    background: ${theme.cardBackgroundColor};
    box-shadow: ${isPrintReady ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'};
    border-radius: ${isPrintReady ? '0' : '12px'};
    overflow: hidden;
    ${isMobile ? 'margin: 0; border-radius: 0;' : ''}
}

/* Header Styles */
.route-header {
    background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor});
    color: white;
    padding: ${isMobile ? '20px' : '32px'};
    position: relative;
    overflow: hidden;
}

.route-header::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
    animation: ${isPrintReady ? 'none' : 'float 20s infinite linear'};
    z-index: 1;
}

.header-content {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: ${isMobile ? '1fr' : 'auto 1fr auto'};
    gap: 24px;
    align-items: center;
}

.company-logo {
    width: ${isMobile ? '120px' : '80px'};
    height: auto;
    filter: brightness(0) invert(1);
}

.route-title {
    text-align: ${isMobile ? 'center' : 'left'};
}

.route-title h1 {
    font-family: ${theme.headerFontFamily};
    font-size: ${isMobile ? '24px' : '32px'};
    font-weight: 700;
    margin-bottom: 8px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.route-subtitle {
    font-size: ${isMobile ? '16px' : '18px'};
    opacity: 0.9;
    font-weight: 500;
}

.priority-badge {
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
}

.priority-normal { background: rgba(255, 255, 255, 0.2); }
.priority-urgent { background: ${theme.warningColor}; color: white; }
.priority-critical {
    background: ${theme.urgentColor};
    color: white;
    animation: ${isPrintReady ? 'none' : 'pulse 2s infinite'};
}

/* Section Styles */
.route-section {
    padding: ${isMobile ? '20px' : '32px'};
    border-bottom: 1px solid ${theme.borderColor};
}

.section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
}

.section-icon {
    font-size: 24px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${theme.primaryColor};
    color: white;
    border-radius: 12px;
    flex-shrink: 0;
}

.section-title {
    font-family: ${theme.headerFontFamily};
    font-size: ${isMobile ? '20px' : '24px'};
    font-weight: 600;
    color: ${theme.headingColor};
}

/* Route Overview Grid */
.route-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(${isMobile ? '150px' : '200px'}, 1fr));
    gap: 20px;
    margin-bottom: 24px;
}

.overview-card {
    background: linear-gradient(135deg, ${theme.cardBackgroundColor}, #f8fafc);
    border: 1px solid ${theme.borderColor};
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    ${isPrintReady ? '' : 'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);'}
}

.overview-card:hover {
    ${isPrintReady ? '' : 'transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);'}
}

.overview-icon {
    font-size: 32px;
    margin-bottom: 12px;
    display: block;
}

.overview-value {
    font-size: ${isMobile ? '24px' : '32px'};
    font-weight: 700;
    color: ${theme.primaryColor};
    margin-bottom: 4px;
    line-height: 1.2;
}

.overview-label {
    font-size: 14px;
    color: ${theme.textColor};
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 500;
}

/* Information Grid */
.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(${isMobile ? '250px' : '300px'}, 1fr));
    gap: 20px;
}

.info-card {
    background: ${theme.cardBackgroundColor};
    border: 1px solid ${theme.borderColor};
    border-radius: 12px;
    padding: 24px;
    ${isPrintReady ? '' : 'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);'}
}

.info-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid ${theme.borderColor};
}

.info-card-icon {
    font-size: 20px;
    color: ${theme.primaryColor};
}

.info-card-title {
    font-weight: 600;
    color: ${theme.headingColor};
    font-size: 16px;
}

.info-item {
    margin-bottom: 12px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
}

.info-label {
    font-weight: 600;
    color: ${theme.headingColor};
    min-width: 80px;
    flex-shrink: 0;
    font-size: 13px;
}

.info-value {
    color: ${theme.textColor};
    flex: 1;
    font-size: 14px;
}

/* Requirements Section */
.requirements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(${isMobile ? '200px' : '250px'}, 1fr));
    gap: 16px;
}

.requirement-item {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border: 1px solid #f59e0b;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.requirement-icon {
    font-size: 20px;
    color: #d97706;
    flex-shrink: 0;
    margin-top: 2px;
}

.requirement-content {
    flex: 1;
}

.requirement-title {
    font-weight: 600;
    color: #92400e;
    font-size: 14px;
    margin-bottom: 4px;
}

.requirement-text {
    color: #78350f;
    font-size: 13px;
    line-height: 1.4;
}

/* Delivery Stops */
.delivery-stops {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.delivery-stop {
    background: ${theme.cardBackgroundColor};
    border: 1px solid ${theme.borderColor};
    border-radius: 12px;
    padding: 24px;
    position: relative;
    ${isPrintReady ? '' : 'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);'}
}

.delivery-stop::before {
    content: attr(data-stop-number);
    position: absolute;
    top: -12px;
    left: 24px;
    background: ${theme.primaryColor};
    color: white;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    ${isPrintReady ? '' : 'box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);'}
}

.stop-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 12px;
}

.stop-name {
    font-size: 18px;
    font-weight: 600;
    color: ${theme.headingColor};
    margin: 0;
}

.stop-time {
    background: linear-gradient(135deg, ${theme.successColor}, #34d399);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.stop-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-top: 16px;
}

/* Navigation Section */
.navigation-section {
    background: linear-gradient(135deg, #ecfdf5, #d1fae5);
    border: 1px solid ${theme.successColor};
}

.map-container {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-top: 20px;
    text-align: center;
    ${isPrintReady ? '' : 'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);'}
}

.map-link {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: ${theme.primaryColor};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.2s ease;
    ${isPrintReady ? '' : 'box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);'}
}

.map-link:hover {
    background: ${theme.secondaryColor};
    ${isPrintReady ? '' : 'box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);'}
}

/* Emergency Contacts */
.emergency-contacts {
    background: linear-gradient(135deg, #fef2f2, #fecaca);
    border: 1px solid ${theme.urgentColor};
}

.contacts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(${isMobile ? '200px' : '250px'}, 1fr));
    gap: 16px;
    margin-top: 20px;
}

.contact-card {
    background: white;
    border: 1px solid #fca5a5;
    border-radius: 8px;
    padding: 16px;
    text-align: center;
}

.contact-title {
    font-weight: 600;
    color: ${theme.urgentColor};
    margin-bottom: 8px;
    font-size: 14px;
}

.contact-number {
    font-size: 18px;
    font-weight: 700;
    color: #991b1b;
    text-decoration: none;
}

.contact-number:hover {
    color: ${theme.urgentColor};
}

/* Footer */
.route-footer {
    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    padding: ${isMobile ? '20px' : '32px'};
    text-align: center;
    border-top: 2px solid ${theme.primaryColor};
}

.footer-branding {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 16px;
    flex-wrap: wrap;
}

.footer-logo {
    width: 40px;
    height: auto;
    opacity: 0.7;
}

.footer-text {
    color: ${theme.textColor};
    opacity: 0.8;
    font-size: 14px;
    line-height: 1.5;
}

/* QR Code Section */
.qr-section {
    text-align: center;
    padding: 24px;
    background: ${theme.cardBackgroundColor};
    border-top: 1px solid ${theme.borderColor};
}

.qr-code {
    width: 120px;
    height: 120px;
    margin: 16px auto;
    border: 2px solid ${theme.borderColor};
    border-radius: 8px;
}

/* Animations */
@keyframes float {
    0% { transform: translateX(0px) translateY(0px); }
    33% { transform: translateX(30px) translateY(-30px); }
    66% { transform: translateX(-20px) translateY(20px); }
    100% { transform: translateX(0px) translateY(0px); }
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
}

/* Responsive Design */
@media (max-width: 768px) {
    .header-content {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 16px;
    }

    .route-overview {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 12px;
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .stop-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .contacts-grid {
        grid-template-columns: 1fr;
    }
}

/* Print Styles */
@media print {
    * {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    body {
        font-size: 12px;
        background: white !important;
    }

    .route-document {
        box-shadow: none;
        border-radius: 0;
        max-width: none;
    }

    .route-header::before {
        display: none;
    }

    .overview-card:hover,
    .map-link:hover {
        transform: none;
        box-shadow: none;
    }

    .map-link {
        box-shadow: none;
    }

    .priority-critical {
        animation: none;
    }

    @page {
        margin: 0.75in;
    }
}`;
  }

  /**
   * Generate the header section
   */
  private generateHeader(
    routeData: RouteDocumentData,
    theme: RouteDocumentTheme,
    branding: CompanyBranding
  ): string {
    const priorityClass = `priority-${routeData.priority || 'normal'}`;

    return `
<div class="route-header">
    <div class="header-content">
        ${branding.logoUrl ? `<img src="${branding.logoUrl}" alt="${branding.companyName} Logo" class="company-logo">` : ''}

        <div class="route-title">
            <h1>Route ${routeData.routeNumber}</h1>
            <div class="route-subtitle">${routeData.routeName}</div>
        </div>

        <div class="priority-badge ${priorityClass}">
            ${(routeData.priority || 'normal').toUpperCase()}
        </div>
    </div>
</div>`;
  }

  /**
   * Generate the route overview section with key metrics
   */
  private generateRouteOverview(
    routeData: RouteDocumentData,
    theme: RouteDocumentTheme
  ): string {
    return `
<div class="route-section">
    <div class="section-header">
        <div class="section-icon">📊</div>
        <h2 class="section-title">Route Overview</h2>
    </div>

    <div class="route-overview">
        <div class="overview-card">
            <span class="overview-icon">💰</span>
            <div class="overview-value">$${routeData.totalAmount.toLocaleString()}</div>
            <div class="overview-label">Total Rate</div>
        </div>

        <div class="overview-card">
            <span class="overview-icon">🛣️</span>
            <div class="overview-value">${routeData.totalMiles.toLocaleString()}</div>
            <div class="overview-label">Total Miles</div>
        </div>

        <div class="overview-card">
            <span class="overview-icon">📈</span>
            <div class="overview-value">$${routeData.ratePerMile.toFixed(2)}</div>
            <div class="overview-label">Rate/Mile</div>
        </div>

        <div class="overview-card">
            <span class="overview-icon">📅</span>
            <div class="overview-value">${routeData.routeDate}</div>
            <div class="overview-label">Route Date</div>
        </div>

        <div class="overview-card">
            <span class="overview-icon">🏢</span>
            <div class="overview-value">${routeData.mcNumber}</div>
            <div class="overview-label">MC Number</div>
        </div>

        <div class="overview-card">
            <span class="overview-icon">🚛</span>
            <div class="overview-value">${routeData.deliveryStops.length}</div>
            <div class="overview-label">Delivery Stops</div>
        </div>
    </div>
</div>`;
  }

  /**
   * Generate the pickup section
   */
  private generatePickupSection(
    routeData: RouteDocumentData,
    theme: RouteDocumentTheme
  ): string {
    return `
<div class="route-section">
    <div class="section-header">
        <div class="section-icon">📦</div>
        <h2 class="section-title">Pickup Information</h2>
    </div>

    <div class="info-grid">
        <div class="info-card">
            <div class="info-card-header">
                <span class="info-card-icon">🏭</span>
                <h3 class="info-card-title">${routeData.pickupLocationName}</h3>
            </div>

            <div class="info-item">
                <span class="info-label">Type:</span>
                <span class="info-value">${routeData.locationType}</span>
            </div>

            <div class="info-item">
                <span class="info-label">Address:</span>
                <span class="info-value">${routeData.pickupAddress}</span>
            </div>

            <div class="info-item">
                <span class="info-label">Time:</span>
                <span class="info-value">${routeData.pickupTime}</span>
            </div>

            <div class="info-item">
                <span class="info-label">Manager:</span>
                <span class="info-value">${routeData.pickupManager}</span>
            </div>

            <div class="info-item">
                <span class="info-label">Phone:</span>
                <span class="info-value">
                    <a href="tel:${routeData.pickupPhone}" class="contact-number">${routeData.pickupPhone}</a>
                </span>
            </div>

            <div class="info-item">
                <span class="info-label">Confirmation:</span>
                <span class="info-value">${routeData.confirmationNumber}</span>
            </div>
        </div>
    </div>

    <div style="margin-top: 24px;">
        <h3 style="margin-bottom: 16px; color: ${theme.headingColor}; display: flex; align-items: center; gap: 8px;">
            <span>⚠️</span> Pickup Requirements
        </h3>

        <div class="requirements-grid">
            <div class="requirement-item">
                <span class="requirement-icon">🦺</span>
                <div class="requirement-content">
                    <div class="requirement-title">Safety</div>
                    <div class="requirement-text">${routeData.safetyRequirements}</div>
                </div>
            </div>

            <div class="requirement-item">
                <span class="requirement-icon">🔐</span>
                <div class="requirement-content">
                    <div class="requirement-title">Access</div>
                    <div class="requirement-text">${routeData.accessRequirements}</div>
                </div>
            </div>

            <div class="requirement-item">
                <span class="requirement-icon">⏰</span>
                <div class="requirement-content">
                    <div class="requirement-title">Timing</div>
                    <div class="requirement-text">${routeData.timingRestrictions}</div>
                </div>
            </div>

            <div class="requirement-item">
                <span class="requirement-icon">📄</span>
                <div class="requirement-content">
                    <div class="requirement-title">Documentation</div>
                    <div class="requirement-text">${routeData.documentationRequirements}</div>
                </div>
            </div>
        </div>

        ${
          routeData.pickupNotes
            ? `
        <div style="margin-top: 20px; background: #f3f4f6; border-left: 4px solid ${theme.primaryColor}; padding: 16px; border-radius: 0 8px 8px 0;">
            <h4 style="margin-bottom: 8px; color: ${theme.headingColor};">📝 Special Instructions</h4>
            <p style="margin: 0; line-height: 1.5;">${routeData.pickupNotes}</p>
        </div>
        `
            : ''
        }
    </div>
</div>`;
  }

  /**
   * Generate the delivery section
   */
  private generateDeliverySection(
    routeData: RouteDocumentData,
    theme: RouteDocumentTheme
  ): string {
    const deliveryStopsHTML = routeData.deliveryStops
      .map(
        (stop) => `
        <div class="delivery-stop" data-stop-number="${stop.stopNumber}">
            <div class="stop-header">
                <h3 class="stop-name">${stop.stopName}</h3>
                <div class="stop-time">${stop.deliveryTime}</div>
            </div>

            <div class="stop-details">
                <div class="info-item">
                    <span class="info-label">Address:</span>
                    <span class="info-value">${stop.stopAddress}</span>
                </div>

                <div class="info-item">
                    <span class="info-label">Contact:</span>
                    <span class="info-value">${stop.contact}</span>
                </div>

                <div class="info-item">
                    <span class="info-label">Items:</span>
                    <span class="info-value">${stop.items}</span>
                </div>

                ${
                  stop.estimatedDuration
                    ? `
                <div class="info-item">
                    <span class="info-label">Duration:</span>
                    <span class="info-value">${stop.estimatedDuration} min</span>
                </div>
                `
                    : ''
                }
            </div>

            ${
              stop.instructions
                ? `
            <div style="margin-top: 16px; background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 12px;">
                <div style="font-weight: 600; color: #92400e; margin-bottom: 4px;">📋 Instructions</div>
                <div style="color: #78350f; font-size: 13px;">${stop.instructions}</div>
            </div>
            `
                : ''
            }
        </div>
    `
      )
      .join('');

    return `
<div class="route-section">
    <div class="section-header">
        <div class="section-icon">🚚</div>
        <h2 class="section-title">Delivery Stops (${routeData.deliveryStops.length})</h2>
    </div>

    <div class="delivery-stops">
        ${deliveryStopsHTML}
    </div>
</div>`;
  }

  /**
   * Generate the driver section
   */
  private generateDriverSection(
    routeData: RouteDocumentData,
    theme: RouteDocumentTheme
  ): string {
    return `
<div class="route-section">
    <div class="section-header">
        <div class="section-icon">👤</div>
        <h2 class="section-title">Driver Assignment</h2>
    </div>

    <div class="info-grid">
        <div class="info-card">
            <div class="info-card-header">
                <span class="info-card-icon">🧑‍💼</span>
                <h3 class="info-card-title">Driver Information</h3>
            </div>

            <div class="info-item">
                <span class="info-label">Driver:</span>
                <span class="info-value">${routeData.driverName}</span>
            </div>

            <div class="info-item">
                <span class="info-label">Vehicle:</span>
                <span class="info-value">${routeData.vehicleNumber}</span>
            </div>

            <div class="info-item">
                <span class="info-label">Route Date:</span>
                <span class="info-value">${routeData.routeDate}</span>
            </div>
        </div>
    </div>
</div>`;
  }

  /**
   * Generate the navigation section
   */
  private generateNavigationSection(
    routeData: RouteDocumentData,
    theme: RouteDocumentTheme,
    includeMaps: boolean
  ): string {
    return `
<div class="route-section navigation-section">
    <div class="section-header">
        <div class="section-icon">🗺️</div>
        <h2 class="section-title">Navigation & Routing</h2>
    </div>

    <div class="map-container">
        <h3 style="margin-bottom: 16px; color: ${theme.headingColor};">📍 Route Navigation</h3>

        <a href="${routeData.googleMapsLink}" target="_blank" class="map-link">
            <span>🗺️</span>
            Open Route in Google Maps
        </a>

        ${
          includeMaps
            ? `
        <div id="route-map" style="width: 100%; height: 300px; margin-top: 20px; border-radius: 8px; background: #f3f4f6;">
            <!-- Interactive map will be loaded here -->
        </div>
        `
            : ''
        }
    </div>
</div>`;
  }

  /**
   * Generate the emergency contacts section
   */
  private generateEmergencySection(
    routeData: RouteDocumentData,
    theme: RouteDocumentTheme
  ): string {
    return `
<div class="route-section emergency-contacts">
    <div class="section-header">
        <div class="section-icon">🚨</div>
        <h2 class="section-title">Emergency Contacts</h2>
    </div>

    <div class="contacts-grid">
        <div class="contact-card">
            <div class="contact-title">Dispatch</div>
            <a href="tel:${routeData.dispatchPhone}" class="contact-number">${routeData.dispatchPhone}</a>
        </div>

        <div class="contact-card">
            <div class="contact-title">Company Main</div>
            <a href="tel:${routeData.contactPhone}" class="contact-number">${routeData.contactPhone}</a>
        </div>

        <div class="contact-card">
            <div class="contact-title">Pickup Location</div>
            <a href="tel:${routeData.pickupPhone}" class="contact-number">${routeData.pickupPhone}</a>
        </div>
    </div>
</div>`;
  }

  /**
   * Generate the footer section
   */
  private generateFooter(
    routeData: RouteDocumentData,
    theme: RouteDocumentTheme,
    branding: CompanyBranding
  ): string {
    return `
<div class="route-footer">
    <div class="footer-branding">
        ${branding.logoUrl ? `<img src="${branding.logoUrl}" alt="${branding.companyName} Logo" class="footer-logo">` : ''}
        <div>
            <div style="font-weight: 600; color: ${theme.headingColor};">${branding.companyName}</div>
            ${branding.tagline ? `<div style="font-size: 12px; opacity: 0.8;">${branding.tagline}</div>` : ''}
        </div>
    </div>

    <div class="footer-text">
        Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}<br>
        FleetFlow Professional Route Management System<br>
        ${branding.contactInfo.website ? `<a href="https://${branding.contactInfo.website}" style="color: ${theme.primaryColor};">${branding.contactInfo.website}</a>` : ''}
    </div>
</div>`;
  }

  /**
   * Generate QR code section
   */
  private generateQRCodeSection(
    routeData: RouteDocumentData,
    theme: RouteDocumentTheme
  ): string {
    return `
<div class="qr-section">
    <h3 style="margin-bottom: 12px; color: ${theme.headingColor};">📱 Quick Access QR Code</h3>
    <div class="qr-code" style="background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjYwIiB5PSI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zNWVtIiBmb250LXNpemU9IjEycHgiIGZpbGw9IiM2YjdiODAiPk1vY2sgUVI8L3RleHQ+PC9zdmc+') center/cover;"></div>
    <p style="font-size: 12px; color: ${theme.textColor}; opacity: 0.8;">
        Scan to view route on mobile device
    </p>
</div>`;
  }

  /**
   * Generate mobile-specific scripts
   */
  private generateMobileScripts(): string {
    return `
<script>
// Mobile-specific enhancements
if ('serviceWorker' in navigator) {
    // Enable offline access
    navigator.serviceWorker.register('/sw.js');
}

// Add touch gestures for mobile
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers for phone numbers
    const phoneLinks = document.querySelectorAll('.contact-number');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Track phone call analytics
            console.log('Emergency call initiated:', this.href);
        });
    });
});
</script>`;
  }

  /**
   * Generate map integration scripts
   */
  private generateMapScripts(routeData: RouteDocumentData): string {
    return `
<script>
// Initialize Google Maps
function initMap() {
    const mapContainer = document.getElementById('route-map');
    if (!mapContainer) return;

    // Mock map initialization - replace with actual Google Maps API
    mapContainer.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #e5e7eb; color: #6b7280; font-size: 14px;">Interactive Route Map Loading...</div>';

    // In production, initialize actual Google Maps with route data
    // const map = new google.maps.Map(mapContainer, {
    //     zoom: 10,
    //     center: { lat: latitude, lng: longitude }
    // });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initMap);
</script>`;
  }

  /**
   * Get theme by name or default
   */
  getTheme(themeName: string): RouteDocumentTheme {
    return this.themes[themeName] || this.themes.fleetflow;
  }

  /**
   * Get available themes
   */
  getAvailableThemes(): string[] {
    return Object.keys(this.themes);
  }

  /**
   * Get company branding for tenant
   */
  getCompanyBranding(tenantId: string): CompanyBranding {
    // Mock tenant-specific branding - replace with actual tenant service
    const mockBrandings: Record<string, Partial<CompanyBranding>> = {
      'global-freight': {
        companyName: 'Global Freight Solutions',
        primaryColor: '#1e40af',
        secondaryColor: '#3b82f6',
        tagline: 'Connecting Supply Chains Worldwide',
        contactInfo: {
          phone: '(555) 888-1234',
          email: 'dispatch@globalfreight.com',
          website: 'www.globalfreight.com',
        },
      },
      'swift-freight': {
        companyName: 'Swift Freight Services',
        primaryColor: '#dc2626',
        secondaryColor: '#ef4444',
        tagline: 'Speed. Reliability. Excellence.',
        contactInfo: {
          phone: '(555) 777-5678',
          email: 'operations@swiftfreight.com',
          website: 'www.swiftfreight.com',
        },
      },
    };

    return {
      ...this.defaultBranding,
      ...mockBrandings[tenantId],
    };
  }
}

export const professionalRouteDocumentService =
  new ProfessionalRouteDocumentService();


