'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '../config/access';
import { professionalAgreementTemplateService } from '../services/ProfessionalAgreementTemplateService';
import {
  RouteDocumentData,
  professionalRouteDocumentService,
} from '../services/ProfessionalRouteDocumentService';
import { subscriptionAgreementService } from '../services/SubscriptionAgreementService';
import {
  BrandingTheme,
  TenantBrandingProfile,
  tenantBrandingService,
} from '../services/TenantBrandingService';

interface ProfessionalTemplateManagerProps {
  tenantId?: string;
  isCompact?: boolean;
}

interface TemplatePreview {
  type: 'route' | 'agreement' | 'email' | 'pdf';
  name: string;
  preview: string;
  downloadUrl?: string;
}

export default function ProfessionalTemplateManager({
  tenantId,
  isCompact = false,
}: ProfessionalTemplateManagerProps) {
  const [activeTab, setActiveTab] = useState<
    'templates' | 'branding' | 'preview' | 'settings'
  >('templates');
  const [loading, setLoading] = useState(true);
  const [brandingProfile, setBrandingProfile] =
    useState<TenantBrandingProfile | null>(null);
  const [availableThemes, setAvailableThemes] = useState<BrandingTheme[]>([]);
  const [templatePreviews, setTemplatePreviews] = useState<TemplatePreview[]>(
    []
  );
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedPreview, setSelectedPreview] =
    useState<TemplatePreview | null>(null);
  const [customSettings, setCustomSettings] = useState({
    includeMaps: true,
    includeQRCode: false,
    includeSignaturePage: true,
    includeTableOfContents: true,
    documentFormat: 'html' as 'html' | 'pdf-ready',
  });

  const effectiveTenantId =
    tenantId || currentUser?.tenantId || 'fleetflow-demo';

  useEffect(() => {
    initializeManager();
  }, [effectiveTenantId]);

  const initializeManager = async () => {
    try {
      setLoading(true);

      // Get current user
      const user = await getCurrentUser();
      setCurrentUser(user);

      // Load branding profile
      const profile =
        tenantBrandingService.getBrandingProfileOrDefault(effectiveTenantId);
      setBrandingProfile(profile);

      // Load available themes
      const themes = tenantBrandingService.getAvailableThemes();
      setAvailableThemes(themes);

      // Generate template previews
      await generateTemplatePreviews();
    } catch (error) {
      console.error('Failed to initialize template manager:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTemplatePreviews = async () => {
    const previews: TemplatePreview[] = [];

    try {
      // Route Document Preview
      const mockRouteData: RouteDocumentData = {
        routeNumber: 'RT-2024-001',
        routeName: 'Sample Route Document',
        routeDate: new Date().toLocaleDateString(),
        totalMiles: 450,
        totalAmount: 2250.0,
        ratePerMile: 5.0,
        companyName: brandingProfile?.companyName || 'Sample Company',
        mcNumber: brandingProfile?.legalInfo.mcNumber || 'MC-123456',
        contactPhone:
          brandingProfile?.contactInfo.phone.main || '(555) 123-4567',
        dispatchPhone:
          brandingProfile?.contactInfo.phone.dispatch || '(555) 123-4568',
        pickupLocationName: 'Distribution Center Alpha',
        pickupAddress: '1234 Industrial Blvd, Business City, CA 90210',
        pickupTime: '8:00 AM - 10:00 AM',
        pickupContact: 'John Manager (555) 111-2222',
        pickupManager: 'John Manager',
        pickupPhone: '(555) 111-2222',
        locationType: 'Distribution Center',
        confirmationNumber: 'CONF-789012',
        safetyRequirements: 'Safety vest required in warehouse areas',
        accessRequirements: 'Valid ID, warehouse safety training preferred',
        timingRestrictions:
          'Coordinate with warehouse manager for dock assignment',
        documentationRequirements: 'BOL, delivery confirmations required',
        loadingArea: 'Dock Bay 12',
        pickupNotes: 'Use north entrance for freight deliveries',
        deliveryStops: [
          {
            stopNumber: 1,
            stopName: 'Retail Location #1',
            stopAddress: '5678 Commerce Dr, Commerce City, CA 90211',
            deliveryTime: '2:00 PM - 4:00 PM',
            items: '15 pallets mixed merchandise',
            contact: 'Sarah Store (555) 333-4444',
            instructions: 'Deliver to rear loading dock',
            estimatedDuration: 45,
          },
          {
            stopNumber: 2,
            stopName: 'Warehouse Beta',
            stopAddress: '9012 Storage Ave, Storage Town, CA 90212',
            deliveryTime: '5:00 PM - 6:00 PM',
            items: '8 pallets electronics',
            contact: 'Mike Warehouse (555) 555-6666',
            instructions: 'Call 30 minutes before arrival',
            estimatedDuration: 30,
          },
        ],
        driverName: 'Robert Driver',
        vehicleNumber: 'TRK-001',
        googleMapsLink: 'https://maps.google.com/route-sample',
        tenantId: effectiveTenantId,
        priority: 'normal',
      };

      const routeDoc =
        await professionalRouteDocumentService.generateProfessionalRouteDocument(
          mockRouteData,
          {
            theme: 'fleetflow',
            format: customSettings.documentFormat,
            includeMaps: customSettings.includeMaps,
            includeQRCode: customSettings.includeQRCode,
            branding: brandingProfile
              ? {
                  companyName: brandingProfile.companyName,
                  logoUrl: brandingProfile.logoUrl,
                  tagline: brandingProfile.tagline,
                  primaryColor: brandingProfile.colors.primary,
                  secondaryColor: brandingProfile.colors.secondary,
                  fontFamily: brandingProfile.typography.fontFamily.primary,
                  contactInfo: {
                    phone: brandingProfile.contactInfo.phone.main,
                    email: brandingProfile.contactInfo.email.main,
                    website: brandingProfile.contactInfo.website,
                    address: `${brandingProfile.contactInfo.address.street}, ${brandingProfile.contactInfo.address.city}`,
                  },
                }
              : undefined,
          }
        );

      previews.push({
        type: 'route',
        name: 'Professional Route Document',
        preview: routeDoc.html.substring(0, 500) + '...',
        downloadUrl: `data:text/html;charset=utf-8,${encodeURIComponent(routeDoc.html)}`,
      });

      // Agreement Document Preview
      const requiredAgreements =
        subscriptionAgreementService.getRequiredAgreements();
      if (requiredAgreements.length > 0) {
        const agreement =
          await professionalAgreementTemplateService.generateProfessionalAgreement(
            requiredAgreements[0].id,
            {
              theme: 'professional',
              format: customSettings.documentFormat,
              includeSignaturePage: customSettings.includeSignaturePage,
              includeTableOfContents: customSettings.includeTableOfContents,
              branding: brandingProfile
                ? {
                    companyName: brandingProfile.companyName,
                    companyLegalName: brandingProfile.companyLegalName,
                    address: brandingProfile.contactInfo.address.street,
                    city: brandingProfile.contactInfo.address.city,
                    state: brandingProfile.contactInfo.address.state,
                    zipCode: brandingProfile.contactInfo.address.zipCode,
                    phone: brandingProfile.contactInfo.phone.main,
                    email:
                      brandingProfile.contactInfo.email.legal ||
                      brandingProfile.contactInfo.email.main,
                    website: brandingProfile.contactInfo.website,
                    legalEntity: brandingProfile.legalInfo.entityType,
                    stateOfIncorporation:
                      brandingProfile.legalInfo.stateOfIncorporation,
                    registrationNumber:
                      brandingProfile.legalInfo.registrationNumber,
                  }
                : undefined,
            }
          );

        previews.push({
          type: 'agreement',
          name: 'Professional Subscription Agreement',
          preview: agreement.html.substring(0, 500) + '...',
          downloadUrl: `data:text/html;charset=utf-8,${encodeURIComponent(agreement.html)}`,
        });
      }

      setTemplatePreviews(previews);
    } catch (error) {
      console.error('Failed to generate template previews:', error);
    }
  };

  const applyTheme = async (themeName: string) => {
    try {
      setLoading(true);
      await tenantBrandingService.applyTheme(effectiveTenantId, themeName);

      // Reload branding profile
      const updatedProfile =
        tenantBrandingService.getBrandingProfileOrDefault(effectiveTenantId);
      setBrandingProfile(updatedProfile);

      // Regenerate previews with new theme
      await generateTemplatePreviews();

      alert('Theme applied successfully!');
    } catch (error) {
      console.error('Failed to apply theme:', error);
      alert('Failed to apply theme. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = (preview: TemplatePreview) => {
    if (preview.downloadUrl) {
      const link = document.createElement('a');
      link.href = preview.downloadUrl;
      link.download = `${preview.name.replace(/\s+/g, '-')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const openPreview = (preview: TemplatePreview) => {
    setSelectedPreview(preview);
    setShowPreviewModal(true);
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          margin: isCompact ? '16px' : '24px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '32px',
              marginBottom: '16px',
              animation: 'spin 1s linear infinite',
            }}
          >
            ⚙️
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Loading Professional Templates...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1e293b, #334155)',
        borderRadius: isCompact ? '8px' : '16px',
        padding: isCompact ? '16px' : '24px',
        margin: isCompact ? '8px' : '16px',
        color: 'white',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: isCompact ? '18px' : '24px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: isCompact ? '20px' : '28px' }}>📄</span>
            Professional Templates & Branding
          </h2>
          <p
            style={{
              margin: 0,
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: isCompact ? '13px' : '14px',
            }}
          >
            Manage professional document templates, legal agreements, and
            company branding
          </p>
        </div>

        {brandingProfile && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '12px 16px',
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                background: brandingProfile.colors.primary,
                borderRadius: '4px',
              }}
            ></div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600' }}>
                {brandingProfile.companyName}
              </div>
              <div style={{ fontSize: '10px', opacity: 0.8 }}>
                {brandingProfile.tagline}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      {!isCompact && (
        <div
          style={{
            display: 'flex',
            marginBottom: '24px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '4px',
          }}
        >
          {[
            { id: 'templates', label: '📄 Templates', icon: '📄' },
            { id: 'branding', label: '🎨 Branding', icon: '🎨' },
            { id: 'preview', label: '👁️ Preview', icon: '👁️' },
            { id: 'settings', label: '⚙️ Settings', icon: '⚙️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background:
                  activeTab === tab.id
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    : 'transparent',
                color:
                  activeTab === tab.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>{tab.icon}</span>
              {tab.label.split(' ')[1]}
            </button>
          ))}
        </div>
      )}

      {/* Tab Content */}
      <div>
        {(activeTab === 'templates' || isCompact) && (
          <div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              📄 Available Templates
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isCompact
                  ? '1fr'
                  : 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
              }}
            >
              {templatePreviews.map((preview, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor =
                      'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor =
                      'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      {preview.type === 'route' && '🗺️'}
                      {preview.type === 'agreement' && '📋'}
                      {preview.type === 'email' && '📧'}
                      {preview.type === 'pdf' && '📄'}
                      {preview.name}
                    </h4>

                    <div
                      style={{
                        background:
                          brandingProfile?.colors.primary || '#3b82f6',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '20px',
                        fontSize: '10px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                      }}
                    >
                      {preview.type}
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: '1.4',
                      marginBottom: '16px',
                    }}
                  >
                    Professional {preview.type} template with modern styling and
                    company branding integration.
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      onClick={() => openPreview(preview)}
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      👁️ Preview
                    </button>

                    <button
                      onClick={() => downloadTemplate(preview)}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      📥 Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {templatePreviews.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '48px',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
                <div style={{ fontSize: '16px', marginBottom: '8px' }}>
                  No templates available
                </div>
                <div style={{ fontSize: '14px' }}>
                  Configure your branding settings to generate templates
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'branding' && !isCompact && (
          <div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              🎨 Brand Themes
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              {availableThemes.map((theme) => (
                <div
                  key={theme.name}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: '600',
                      }}
                    >
                      {theme.displayName}
                    </h4>

                    <div
                      style={{
                        background: theme.template.colors?.primary || '#3b82f6',
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                      }}
                    ></div>
                  </div>

                  <p
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '16px',
                      lineHeight: '1.4',
                    }}
                  >
                    {theme.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                      }}
                    >
                      {theme.category}
                    </span>

                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                      }}
                    >
                      {theme.colorScheme}
                    </span>
                  </div>

                  <button
                    onClick={() => applyTheme(theme.name)}
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      width: '100%',
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    {loading ? 'Applying...' : 'Apply Theme'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'preview' && !isCompact && (
          <div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              👁️ Live Preview
            </h3>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: '500',
                      marginBottom: '6px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Document Format
                  </label>
                  <select
                    value={customSettings.documentFormat}
                    onChange={(e) =>
                      setCustomSettings((prev) => ({
                        ...prev,
                        documentFormat: e.target.value as 'html' | 'pdf-ready',
                      }))
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '13px',
                    }}
                  >
                    <option value='html'>HTML Web</option>
                    <option value='pdf-ready'>PDF Ready</option>
                  </select>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <label
                    style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Options
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={customSettings.includeMaps}
                      onChange={(e) =>
                        setCustomSettings((prev) => ({
                          ...prev,
                          includeMaps: e.target.checked,
                        }))
                      }
                      style={{ accentColor: brandingProfile?.colors.primary }}
                    />
                    Include Maps
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={customSettings.includeQRCode}
                      onChange={(e) =>
                        setCustomSettings((prev) => ({
                          ...prev,
                          includeQRCode: e.target.checked,
                        }))
                      }
                      style={{ accentColor: brandingProfile?.colors.primary }}
                    />
                    Include QR Code
                  </label>
                </div>
              </div>

              <button
                onClick={generateTemplatePreviews}
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? '🔄 Regenerating...' : '🔄 Regenerate Previews'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && !isCompact && (
          <div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              ⚙️ Template Settings
            </h3>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px',
                }}
              >
                <div>
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '12px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    Document Options
                  </h4>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={customSettings.includeSignaturePage}
                        onChange={(e) =>
                          setCustomSettings((prev) => ({
                            ...prev,
                            includeSignaturePage: e.target.checked,
                          }))
                        }
                        style={{ accentColor: brandingProfile?.colors.primary }}
                      />
                      Include Signature Page
                    </label>

                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={customSettings.includeTableOfContents}
                        onChange={(e) =>
                          setCustomSettings((prev) => ({
                            ...prev,
                            includeTableOfContents: e.target.checked,
                          }))
                        }
                        style={{ accentColor: brandingProfile?.colors.primary }}
                      />
                      Include Table of Contents
                    </label>
                  </div>
                </div>

                {brandingProfile && (
                  <div>
                    <h4
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '12px',
                        color: 'rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      Company Information
                    </h4>

                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        lineHeight: '1.5',
                      }}
                    >
                      <div>
                        <strong>Company:</strong> {brandingProfile.companyName}
                      </div>
                      <div>
                        <strong>Legal Name:</strong>{' '}
                        {brandingProfile.companyLegalName}
                      </div>
                      <div>
                        <strong>Phone:</strong>{' '}
                        {brandingProfile.contactInfo.phone.main}
                      </div>
                      <div>
                        <strong>Email:</strong>{' '}
                        {brandingProfile.contactInfo.email.main}
                      </div>
                      {brandingProfile.contactInfo.website && (
                        <div>
                          <strong>Website:</strong>{' '}
                          {brandingProfile.contactInfo.website}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreviewModal && selectedPreview && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                background: '#1e293b',
                color: 'white',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                {selectedPreview.name} Preview
              </h3>

              <button
                onClick={() => setShowPreviewModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                flex: 1,
                overflow: 'auto',
                padding: '20px',
                minHeight: '400px',
                maxHeight: '70vh',
              }}
            >
              <iframe
                srcDoc={
                  selectedPreview.downloadUrl?.split(',')[1]
                    ? decodeURIComponent(
                        selectedPreview.downloadUrl.split(',')[1]
                      )
                    : `<p>Preview not available</p>`
                }
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '500px',
                  border: 'none',
                  borderRadius: '8px',
                }}
                title='Template Preview'
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
