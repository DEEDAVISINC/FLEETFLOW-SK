'use client';

import { useEffect, useState } from 'react';
import {
  EmailSignature,
  SignatureTemplate,
  fleetFlowSignatureManager,
} from '../services/FleetFlowSignatureManager';

interface EmailSignatureBuilderProps {
  userId?: string;
  department?: string;
  aiStaffId?: string;
  onSave?: (signature: EmailSignature) => void;
  initialSignature?: EmailSignature;
}

export default function EmailSignatureBuilder({
  userId,
  department,
  aiStaffId,
  onSave,
  initialSignature,
}: EmailSignatureBuilderProps) {
  const [signature, setSignature] = useState<Partial<EmailSignature>>({
    fullName: '',
    title: '',
    department_name: '',
    email: '',
    phone: '',
    companyName: 'FleetFlow TMS',
    companyLogo: '/assets/fleetflow-logo.png',
    website: 'https://fleetflowapp.com',
    socialLinks: [],
    customLinks: [],
    template: {
      id: 'horizontal-modern',
      name: 'Horizontal Modern',
      layout: 'horizontal',
      photoPosition: 'left',
      socialPosition: 'bottom',
    },
    branding: {
      primaryColor: '#2563eb',
      secondaryColor: '#3b82f6',
      fontFamily: 'Inter, sans-serif',
      fontSize: 14,
      logoSize: 'medium',
      showCompanyLogo: true,
      showPersonalPhoto: false,
    },
    disclaimers: [
      'This communication is confidential and may be legally privileged.',
      'FleetFlow TMS - Professional Transportation Management Solutions',
    ],
    isActive: true,
  });

  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'design' | 'content' | 'preview'>(
    'content'
  );
  const [uploadedLogo, setUploadedLogo] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>('');
  const [availableTemplates] = useState<SignatureTemplate[]>([
    {
      id: 'horizontal-modern',
      name: 'Horizontal Modern',
      layout: 'horizontal',
      photoPosition: 'left',
      socialPosition: 'bottom',
    },
    {
      id: 'vertical-centered',
      name: 'Vertical Centered',
      layout: 'vertical',
      photoPosition: 'top',
      socialPosition: 'inline',
    },
    {
      id: 'card-professional',
      name: 'Card Professional',
      layout: 'card',
      photoPosition: 'left',
      socialPosition: 'right',
    },
    {
      id: 'minimal-clean',
      name: 'Minimal Clean',
      layout: 'minimal',
      photoPosition: 'none',
      socialPosition: 'inline',
    },
  ]);

  useEffect(() => {
    if (initialSignature) {
      setSignature(initialSignature);
    }
  }, [initialSignature]);

  useEffect(() => {
    updatePreview();
  }, [signature]);

  const updatePreview = () => {
    if (signature.id) {
      try {
        const html = fleetFlowSignatureManager.generateSignatureHTML(
          signature.id
        );
        setPreviewHtml(html);
      } catch (error) {
        // Generate preview HTML manually for unsaved signatures
        setPreviewHtml(generatePreviewHTML());
      }
    } else {
      setPreviewHtml(generatePreviewHTML());
    }
  };

  const generatePreviewHTML = (): string => {
    if (!signature.template || !signature.branding) return '';

    const { template, branding } = signature;

    return `
    <div style="
      font-family: ${branding.fontFamily};
      font-size: ${branding.fontSize}px;
      color: #333;
      border-top: 2px solid ${branding.primaryColor};
      padding-top: 15px;
      margin-top: 20px;
      max-width: 600px;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    ">
      <table cellpadding="0" cellspacing="0" style="border: none;">
        <tr>
          ${
            signature.branding?.showCompanyLogo
              ? `
          <td style="padding-right: 20px; vertical-align: top;">
            <img src="${signature.companyLogo}" alt="${signature.companyName}"
                 style="${
                   signature.branding?.logoSize === 'small'
                     ? 'max-height: 60px; max-width: 60px;'
                     : signature.branding?.logoSize === 'large'
                       ? 'max-height: 100px; max-width: 100px;'
                       : 'max-height: 80px; max-width: 80px;'
                 } object-fit: contain;">
          </td>`
              : ''
          }
          <td style="vertical-align: top;">
            <div style="margin-bottom: 5px;">
              <strong style="color: ${branding.primaryColor}; font-size: ${branding.fontSize + 2}px;">
                ${signature.fullName || 'Your Name'}
              </strong>
            </div>
            <div style="color: #666; margin-bottom: 3px;">${signature.title || 'Your Title'}</div>
            <div style="color: #666; margin-bottom: 8px;">${signature.department_name || 'Department'}</div>

            <div style="margin-bottom: 3px;">
              📧 <a href="mailto:${signature.email || 'email@company.com'}" style="color: ${branding.primaryColor}; text-decoration: none;">
                ${signature.email || 'email@company.com'}
              </a>
            </div>
            ${
              signature.phone
                ? `
            <div style="margin-bottom: 3px;">
              📞 <span style="color: #666;">${signature.phone}</span>
            </div>`
                : ''
            }
            ${
              signature.website
                ? `
            <div style="margin-bottom: 8px;">
              🌐 <a href="${signature.website}" style="color: ${branding.primaryColor}; text-decoration: none;">
                ${signature.website}
              </a>
            </div>`
                : ''
            }

            ${
              signature.socialLinks && signature.socialLinks.length > 0
                ? `
            <div style="margin-bottom: 8px;">
              ${signature.socialLinks
                .map(
                  (link) => `
                <a href="${link.url}" style="margin-right: 8px; text-decoration: none;">
                  <img src="/assets/icons/${link.platform}.png" alt="${link.platform}"
                       style="width: 20px; height: 20px; vertical-align: middle;">
                </a>
              `
                )
                .join('')}
            </div>`
                : ''
            }

            ${
              signature.ctaButton
                ? `
            <div style="margin-top: 10px;">
              <a href="${signature.ctaButton.url}" style="
                background-color: ${signature.ctaButton.backgroundColor};
                color: ${signature.ctaButton.textColor};
                padding: 8px 16px;
                border-radius: ${signature.ctaButton.borderRadius}px;
                text-decoration: none;
                font-size: 14px;
                font-weight: 500;
                display: inline-block;
              ">${signature.ctaButton.text}</a>
            </div>`
                : ''
            }
          </td>
        </tr>
      </table>

      ${
        signature.disclaimers && signature.disclaimers.length > 0
          ? `
      <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #f0f0f0;">
        ${signature.disclaimers
          .map(
            (disclaimer) =>
              `<div style="font-size: 11px; color: #999; margin-bottom: 2px;">${disclaimer}</div>`
          )
          .join('')}
      </div>`
          : ''
      }
    </div>`;
  };

  const handleInputChange = (field: string, value: any) => {
    setSignature((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBrandingChange = (field: string, value: any) => {
    setSignature((prev) => ({
      ...prev,
      branding: {
        ...prev.branding!,
        [field]: value,
      },
    }));
  };

  const handleTemplateChange = (templateId: string) => {
    const template = availableTemplates.find((t) => t.id === templateId);
    if (template) {
      setSignature((prev) => ({
        ...prev,
        template,
      }));
    }
  };

  const addSocialLink = () => {
    setSignature((prev) => ({
      ...prev,
      socialLinks: [
        ...(prev.socialLinks || []),
        { platform: 'linkedin', url: '', displayIcon: true },
      ],
    }));
  };

  const updateSocialLink = (index: number, field: string, value: any) => {
    setSignature((prev) => ({
      ...prev,
      socialLinks:
        prev.socialLinks?.map((link, i) =>
          i === index ? { ...link, [field]: value } : link
        ) || [],
    }));
  };

  const removeSocialLink = (index: number) => {
    setSignature((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks?.filter((_, i) => i !== index) || [],
    }));
  };

  const addCustomLink = () => {
    setSignature((prev) => ({
      ...prev,
      customLinks: [
        ...(prev.customLinks || []),
        { label: '', url: '', icon: '' },
      ],
    }));
  };

  const updateCustomLink = (index: number, field: string, value: any) => {
    setSignature((prev) => ({
      ...prev,
      customLinks:
        prev.customLinks?.map((link, i) =>
          i === index ? { ...link, [field]: value } : link
        ) || [],
    }));
  };

  const removeCustomLink = (index: number) => {
    setSignature((prev) => ({
      ...prev,
      customLinks: prev.customLinks?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleCTAChange = (field: string, value: any) => {
    setSignature((prev) => ({
      ...prev,
      ctaButton: {
        ...prev.ctaButton!,
        [field]: value,
      },
    }));
  };

  const addCTAButton = () => {
    setSignature((prev) => ({
      ...prev,
      ctaButton: {
        text: 'Get Quote',
        url: 'https://fleetflowapp.com/quote',
        backgroundColor: '#2563eb',
        textColor: '#ffffff',
        borderRadius: 6,
      },
    }));
  };

  const removeCTAButton = () => {
    setSignature((prev) => ({
      ...prev,
      ctaButton: undefined,
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG, JPG, GIF, etc.)');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }

      setUploadedLogo(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreviewUrl(result);
        // Update signature with the uploaded logo URL
        setSignature((prev) => ({
          ...prev,
          companyLogo: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setUploadedLogo(null);
    setLogoPreviewUrl('');
    setSignature((prev) => ({
      ...prev,
      companyLogo: '/assets/fleetflow-logo.png', // Reset to default
    }));
  };

  const handleSave = async () => {
    try {
      let savedSignature: EmailSignature;

      if (aiStaffId) {
        savedSignature =
          await fleetFlowSignatureManager.generateAIStaffSignature(aiStaffId);
      } else if (department && userId) {
        savedSignature =
          await fleetFlowSignatureManager.generateDepartmentSignature(
            department,
            signature.fullName || 'Staff Member',
            {
              id: userId,
              fullName: signature.fullName,
              title: signature.title,
              email: signature.email,
              phone: signature.phone,
            }
          );
      } else {
        // Create custom signature
        savedSignature = {
          ...signature,
          id: `custom-${Date.now()}`,
          name: `${signature.fullName} Signature`,
          type: 'custom',
          department: department || 'general',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as EmailSignature;
      }

      if (onSave) {
        onSave(savedSignature);
      }

      alert('Signature saved successfully!');
    } catch (error) {
      console.error('Error saving signature:', error);
      alert('Error saving signature. Please try again.');
    }
  };

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h2
            style={{
              color: 'white',
              margin: '0 0 8px 0',
              fontSize: '1.5rem',
              fontWeight: '600',
            }}
          >
            📧 FleetFlow Internal Email Signature Builder
          </h2>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0,
              fontSize: '0.9rem',
            }}
          >
            Create standardized email signatures for internal FleetFlow TMS
            communications
          </p>
        </div>
      </div>

      {/* Tab Navigation - EXACTLY matching billing-invoices page */}
      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '8px',
        }}
      >
        {[
          { id: 'content', label: '📝 Content', icon: '📝' },
          { id: 'design', label: '🎨 Design', icon: '🎨' },
          { id: 'preview', label: '👁️ Preview', icon: '👁️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              border: 'none',
              background:
                activeTab === tab.id
                  ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                  : 'rgba(255, 255, 255, 0.1)',
              color:
                activeTab === tab.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow:
                activeTab === tab.id
                  ? '0 4px 16px rgba(59, 130, 246, 0.3)'
                  : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Grid - EXACTLY matching billing-invoices page */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}
      >
        {/* Left Panel - Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {activeTab === 'content' && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              {/* Personal Information - EXACTLY matching billing-invoices page */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3
                  style={{
                    color: '#3b82f6',
                    margin: '0 0 16px 0',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                  }}
                >
                  👤 Personal Information
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Full Name *
                    </label>
                    <input
                      type='text'
                      value={signature.fullName || ''}
                      onChange={(e) =>
                        handleInputChange('fullName', e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                      placeholder='John Doe'
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Job Title *
                    </label>
                    <input
                      type='text'
                      value={signature.title || ''}
                      onChange={(e) =>
                        handleInputChange('title', e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                      placeholder='Operations Manager'
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Department
                    </label>
                    <input
                      type='text'
                      value={signature.department_name || ''}
                      onChange={(e) =>
                        handleInputChange('department_name', e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                      placeholder='Operations Department'
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information - EXACTLY matching billing-invoices page */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3
                  style={{
                    color: '#10b981',
                    margin: '0 0 16px 0',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                  }}
                >
                  📞 Contact Information
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Email Address *
                    </label>
                    <input
                      type='email'
                      value={signature.email || ''}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                      placeholder='john.doe@fleetflowapp.com'
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Phone Number
                    </label>
                    <input
                      type='tel'
                      value={signature.phone || ''}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                      placeholder='(555) 123-4567'
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Website
                    </label>
                    <input
                      type='url'
                      value={signature.website || ''}
                      onChange={(e) =>
                        handleInputChange('website', e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                      placeholder='https://fleetflowapp.com'
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links - EXACTLY matching billing-invoices page */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  style={{
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <h3
                    style={{
                      color: '#8b5cf6',
                      margin: 0,
                      fontSize: '1.1rem',
                      fontWeight: '600',
                    }}
                  >
                    🔗 Social Media Links
                  </h3>
                  <button
                    onClick={addSocialLink}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    + Add Link
                  </button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {signature.socialLinks?.map((link, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <select
                        value={link.platform}
                        onChange={(e) =>
                          updateSocialLink(index, 'platform', e.target.value)
                        }
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '0.8rem',
                          outline: 'none',
                        }}
                      >
                        <option value='linkedin'>LinkedIn</option>
                        <option value='twitter'>Twitter</option>
                        <option value='facebook'>Facebook</option>
                        <option value='instagram'>Instagram</option>
                        <option value='youtube'>YouTube</option>
                      </select>
                      <input
                        type='url'
                        value={link.url}
                        onChange={(e) =>
                          updateSocialLink(index, 'url', e.target.value)
                        }
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '0.8rem',
                          outline: 'none',
                        }}
                        placeholder='https://linkedin.com/company/fleetflow'
                      />
                      <button
                        onClick={() => removeSocialLink(index)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          background:
                            'linear-gradient(135deg, #ef4444, #dc2626)',
                          color: 'white',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          fontWeight: '500',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call-to-Action Button - EXACTLY matching billing-invoices page */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  style={{
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <h3
                    style={{
                      color: '#f59e0b',
                      margin: 0,
                      fontSize: '1.1rem',
                      fontWeight: '600',
                    }}
                  >
                    🎯 Call-to-Action Button
                  </h3>
                  {!signature.ctaButton ? (
                    <button
                      onClick={addCTAButton}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        fontWeight: '500',
                      }}
                    >
                      + Add CTA
                    </button>
                  ) : (
                    <button
                      onClick={removeCTAButton}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        fontWeight: '500',
                      }}
                    >
                      Remove CTA
                    </button>
                  )}
                </div>

                {signature.ctaButton && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        Button Text
                      </label>
                      <input
                        type='text'
                        value={signature.ctaButton.text}
                        onChange={(e) =>
                          handleCTAChange('text', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '0.8rem',
                          outline: 'none',
                        }}
                        placeholder='Get Quote'
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        Button URL
                      </label>
                      <input
                        type='url'
                        value={signature.ctaButton.url}
                        onChange={(e) => handleCTAChange('url', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '0.8rem',
                          outline: 'none',
                        }}
                        placeholder='https://fleetflowapp.com/quote'
                      />
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          Background Color
                        </label>
                        <input
                          type='color'
                          value={signature.ctaButton.backgroundColor}
                          onChange={(e) =>
                            handleCTAChange('backgroundColor', e.target.value)
                          }
                          style={{
                            height: '32px',
                            width: '100%',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            cursor: 'pointer',
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          Text Color
                        </label>
                        <input
                          type='color'
                          value={signature.ctaButton.textColor}
                          onChange={(e) =>
                            handleCTAChange('textColor', e.target.value)
                          }
                          style={{
                            height: '32px',
                            width: '100%',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            cursor: 'pointer',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              {/* Template Selection - EXACTLY matching billing-invoices page */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3
                  style={{
                    color: '#3b82f6',
                    margin: '0 0 16px 0',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                  }}
                >
                  🎨 Template Selection
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  {availableTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateChange(template.id)}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border:
                          signature.template?.id === template.id
                            ? '2px solid #3b82f6'
                            : '1px solid rgba(255, 255, 255, 0.2)',
                        background:
                          signature.template?.id === template.id
                            ? 'rgba(59, 130, 246, 0.2)'
                            : 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          marginBottom: '4px',
                        }}
                      >
                        {template.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'rgba(255, 255, 255, 0.6)',
                        }}
                      >
                        {template.layout} layout
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Branding - EXACTLY matching billing-invoices page */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3
                  style={{
                    color: '#10b981',
                    margin: '0 0 16px 0',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                  }}
                >
                  🎨 Color Branding
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        Primary Color
                      </label>
                      <input
                        type='color'
                        value={signature.branding?.primaryColor || '#2563eb'}
                        onChange={(e) =>
                          handleBrandingChange('primaryColor', e.target.value)
                        }
                        style={{
                          height: '40px',
                          width: '100%',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          marginBottom: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        Secondary Color
                      </label>
                      <input
                        type='color'
                        value={signature.branding?.secondaryColor || '#3b82f6'}
                        onChange={(e) =>
                          handleBrandingChange('secondaryColor', e.target.value)
                        }
                        style={{
                          height: '40px',
                          width: '100%',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography - EXACTLY matching billing-invoices page */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3
                  style={{
                    color: '#8b5cf6',
                    margin: '0 0 16px 0',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                  }}
                >
                  📝 Typography
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Font Family
                    </label>
                    <select
                      value={
                        signature.branding?.fontFamily || 'Inter, sans-serif'
                      }
                      onChange={(e) =>
                        handleBrandingChange('fontFamily', e.target.value)
                      }
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    >
                      <option value='Inter, sans-serif'>Inter</option>
                      <option value='Arial, sans-serif'>Arial</option>
                      <option value='Helvetica, sans-serif'>Helvetica</option>
                      <option value='Georgia, serif'>Georgia</option>
                      <option value='Times New Roman, serif'>
                        Times New Roman
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Font Size: {signature.branding?.fontSize || 14}px
                    </label>
                    <input
                      type='range'
                      min='12'
                      max='18'
                      value={signature.branding?.fontSize || 14}
                      onChange={(e) =>
                        handleBrandingChange(
                          'fontSize',
                          parseInt(e.target.value)
                        )
                      }
                      style={{
                        width: '100%',
                        height: '6px',
                        borderRadius: '3px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Logo Settings - Enhanced with Upload */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3
                  style={{
                    color: '#f59e0b',
                    margin: '0 0 16px 0',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                  }}
                >
                  🏢 Logo Settings
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type='checkbox'
                      id='showLogo'
                      checked={signature.branding?.showCompanyLogo || false}
                      onChange={(e) =>
                        handleBrandingChange(
                          'showCompanyLogo',
                          e.target.checked
                        )
                      }
                      style={{
                        marginRight: '8px',
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer',
                      }}
                    />
                    <label
                      htmlFor='showLogo'
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        color: 'rgba(255, 255, 255, 0.8)',
                        cursor: 'pointer',
                      }}
                    >
                      Show Company Logo
                    </label>
                  </div>

                  {signature.branding?.showCompanyLogo && (
                    <>
                      {/* Logo Upload Section */}
                      <div>
                        <label
                          style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          Upload Custom Logo
                        </label>

                        {/* Upload Button */}
                        <div style={{ marginBottom: '12px' }}>
                          <label
                            htmlFor='logo-upload'
                            style={{
                              display: 'inline-block',
                              padding: '10px 16px',
                              borderRadius: '8px',
                              border: '2px dashed rgba(245, 158, 11, 0.5)',
                              background: 'rgba(245, 158, 11, 0.1)',
                              color: 'rgba(255, 255, 255, 0.8)',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              fontWeight: '500',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                'rgba(245, 158, 11, 0.2)';
                              e.currentTarget.style.borderColor =
                                'rgba(245, 158, 11, 0.8)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                'rgba(245, 158, 11, 0.1)';
                              e.currentTarget.style.borderColor =
                                'rgba(245, 158, 11, 0.5)';
                            }}
                          >
                            📁 Choose Logo File
                          </label>
                          <input
                            id='logo-upload'
                            type='file'
                            accept='image/*'
                            onChange={handleLogoUpload}
                            style={{ display: 'none' }}
                          />
                        </div>

                        {/* Logo Preview */}
                        {logoPreviewUrl && (
                          <div style={{ marginBottom: '12px' }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '8px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              <img
                                src={logoPreviewUrl}
                                alt='Logo Preview'
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  objectFit: 'contain',
                                  borderRadius: '4px',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                }}
                              />
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    fontSize: '0.8rem',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    marginBottom: '2px',
                                  }}
                                >
                                  {uploadedLogo?.name}
                                </div>
                                <div
                                  style={{
                                    fontSize: '0.7rem',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                  }}
                                >
                                  {(uploadedLogo?.size || 0) < 1024 * 1024
                                    ? `${((uploadedLogo?.size || 0) / 1024).toFixed(1)} KB`
                                    : `${((uploadedLogo?.size || 0) / (1024 * 1024)).toFixed(1)} MB`}
                                </div>
                              </div>
                              <button
                                onClick={removeLogo}
                                style={{
                                  padding: '6px 8px',
                                  borderRadius: '4px',
                                  border: 'none',
                                  background: 'rgba(239, 68, 68, 0.2)',
                                  color: '#ef4444',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  fontWeight: '500',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background =
                                    'rgba(239, 68, 68, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background =
                                    'rgba(239, 68, 68, 0.2)';
                                }}
                              >
                                ✕ Remove
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Upload Instructions */}
                        {!logoPreviewUrl && (
                          <div
                            style={{
                              fontSize: '0.8rem',
                              color: 'rgba(255, 255, 255, 0.6)',
                              marginBottom: '12px',
                            }}
                          >
                            💡 Supported formats: PNG, JPG, GIF, SVG (Max: 2MB)
                          </div>
                        )}

                        {/* Logo Size Setting */}
                        <div>
                          <label
                            style={{
                              display: 'block',
                              marginBottom: '8px',
                              fontSize: '0.9rem',
                              fontWeight: '500',
                              color: 'rgba(255, 255, 255, 0.8)',
                            }}
                          >
                            Logo Size
                          </label>
                          <select
                            value={signature.branding?.logoSize || 'medium'}
                            onChange={(e) =>
                              handleBrandingChange('logoSize', e.target.value)
                            }
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              background: 'rgba(255, 255, 255, 0.1)',
                              color: 'white',
                              fontSize: '0.9rem',
                              outline: 'none',
                            }}
                          >
                            <option value='small'>Small (60x60px)</option>
                            <option value='medium'>Medium (80x80px)</option>
                            <option value='large'>Large (100x100px)</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Preview - EXACTLY matching billing-invoices page */}
        <div style={{ position: 'sticky', top: '24px' }}>
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '20px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3
              style={{
                color: '#3b82f6',
                margin: '0 0 16px 0',
                fontSize: '1.1rem',
                fontWeight: '600',
              }}
            >
              👁️ Live Preview
            </h3>
            <div
              style={{
                minHeight: '300px',
                maxHeight: '400px',
                overflow: 'auto',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'white',
                padding: '16px',
              }}
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button
              onClick={handleSave}
              style={{
                flex: 1,
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
              }}
            >
              💾 Save Signature
            </button>
            <button
              onClick={() => {
                const html = previewHtml;
                navigator.clipboard.writeText(html);
                alert('Signature HTML copied to clipboard!');
              }}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              📋 Copy HTML
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
