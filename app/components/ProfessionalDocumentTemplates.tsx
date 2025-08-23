'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '../config/access';
import {
  DocumentGenerationRequest,
  DocumentGenerationResult,
  DocumentTemplate,
  documentTemplateEngine,
} from '../services/DocumentTemplateEngine';
import UserDocumentsSection from './UserDocumentsSection';

export default function ProfessionalDocumentTemplates() {
  const [activeTab, setActiveTab] = useState<'templates' | 'documents'>(
    'templates'
  );
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<DocumentTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] =
    useState<DocumentGenerationResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const currentUser = getCurrentUser();

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const availableTemplates = documentTemplateEngine.getAvailableTemplates();
      setTemplates(availableTemplates);
      console.log('📄 Loaded templates:', availableTemplates.length);
      console.log(
        '📄 Template details:',
        availableTemplates.map((t) => ({
          id: t.id,
          name: t.name,
          type: t.type,
          category: t.category,
        }))
      );
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const filteredTemplates =
    selectedCategory === 'all'
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Templates', icon: '📄', color: '#6b7280' },
    { id: 'operations', name: 'Operations', icon: '🚛', color: '#2563eb' },
    { id: 'legal', name: 'Legal', icon: '⚖️', color: '#dc2626' },
    { id: 'financial', name: 'Financial', icon: '💰', color: '#059669' },
    { id: 'compliance', name: 'Compliance', icon: '✅', color: '#d97706' },
    { id: 'marketing', name: 'Marketing', icon: '📢', color: '#7c3aed' },
    { id: 'hr', name: 'HR', icon: '👥', color: '#db2777' },
  ];

  const generateSampleDocument = async (template: DocumentTemplate) => {
    if (!template) return;

    setIsGenerating(true);
    setGenerationResult(null);

    try {
      const sampleData = getSampleDataForTemplate(template);

      const request: DocumentGenerationRequest = {
        templateId: template.id,
        tenantId: 'demo-tenant',
        format: template.supportedFormats[0] as any,
        data: sampleData,
        outputOptions: {
          filename: `Sample-${template.name.replace(/\s+/g, '-')}`,
        },
      };

      const result = await documentTemplateEngine.generateDocument(request);
      setGenerationResult(result);

      if (result.success) {
        console.log('✅ Document generated successfully:', result.filename);
      }
    } catch (error) {
      console.error('Document generation failed:', error);
      setGenerationResult({
        success: false,
        documentId: '',
        filename: '',
        format: 'html',
        metadata: {
          generatedAt: new Date(),
          templateUsed: template.id,
          tenantId: 'demo-tenant',
        },
        error: 'Generation failed',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getSampleDataForTemplate = (template: DocumentTemplate) => {
    switch (template.id) {
      case 'professional-load-info':
        return {
          load: {
            id: 'FL-2024-001',
            origin: { city: 'Dallas', state: 'TX' },
            destination: { city: 'Houston', state: 'TX' },
            rate: 2500,
            distance: 240,
            pickupDate: '2024-01-15',
            deliveryDate: '2024-01-16',
            equipment: 'Dry Van',
            weight: '45,000 lbs',
            status: 'Available',
          },
          carrier: {
            contactName: 'John Driver',
            company: 'ABC Transport LLC',
          },
          tenant: {
            companyName: 'FleetFlow Logistics',
            phone: '(555) 123-4567',
            website: 'www.fleetflow.com',
          },
        };

      case 'professional-bol':
        return {
          bolNumber: 'BOL-FL2024-001',
          loadId: 'FL-2024-001',
          shipper: {
            company: 'Acme Manufacturing Inc',
            contact: 'Sarah Johnson',
            address: '123 Industrial Blvd',
            city: 'Dallas',
            state: 'TX',
            zipCode: '75201',
            phone: '(555) 111-2222',
            email: 'shipping@acme.com',
          },
          consignee: {
            company: 'Metro Distribution Center',
            contact: 'Mike Wilson',
            address: '456 Warehouse Ave',
            city: 'Houston',
            state: 'TX',
            zipCode: '77001',
          },
          charges: {
            freightCharges: 2500,
            paymentTerms: 'Net 30 Days',
          },
        };

      default:
        return {
          companyName: 'Sample Company',
          date: new Date().toISOString().split('T')[0],
          amount: 1500,
          description: 'Professional document generation sample',
        };
    }
  };

  const getTemplateIcon = (template: DocumentTemplate) => {
    switch (template.type) {
      case 'email':
        return '📧';
      case 'bol':
        return '📋';
      case 'invoice':
        return '💰';
      case 'contract':
        return '📄';
      case 'certificate':
        return '🏆';
      default:
        return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      email: '#3b82f6',
      bol: '#059669',
      invoice: '#dc2626',
      contract: '#7c3aed',
      certificate: '#d97706',
    };
    return colors[type] || '#6b7280';
  };

  return (
    <div>
      <div
        style={{
          maxWidth: '100%',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '10px',
              textAlign: 'center',
            }}
          >
            🎨 Professional Document Templates & User Documents
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.8)',
              textAlign: 'center',
              marginBottom: '30px',
            }}
          >
            Create professional templates with styling and branding, plus access
            your signed documents
          </p>

          {/* Tab Navigation */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              marginBottom: '30px',
            }}
          >
            <button
              onClick={() => setActiveTab('templates')}
              style={{
                background:
                  activeTab === 'templates'
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'rgba(255, 255, 255, 0.1)',
                border:
                  activeTab === 'templates'
                    ? '2px solid rgba(255, 255, 255, 0.6)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '30px',
                padding: '12px 24px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                minWidth: '200px',
              }}
            >
              🎨 Document Templates
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              style={{
                background:
                  activeTab === 'documents'
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'rgba(255, 255, 255, 0.1)',
                border:
                  activeTab === 'documents'
                    ? '2px solid rgba(255, 255, 255, 0.6)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '30px',
                padding: '12px 24px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                minWidth: '200px',
              }}
            >
              📋 My Documents
            </button>
          </div>

          {/* Category Filter - Only show for templates tab */}
          {activeTab === 'templates' && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                justifyContent: 'center',
              }}
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    background:
                      selectedCategory === category.id
                        ? 'rgba(255, 255, 255, 0.3)'
                        : 'rgba(255, 255, 255, 0.1)',
                    border:
                      selectedCategory === category.id
                        ? '2px solid rgba(255, 255, 255, 0.5)'
                        : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '25px',
                    padding: '10px 20px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Templates Content - Only show for templates tab */}
        {activeTab === 'templates' && (
          <>
            {/* Templates Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                gap: '25px',
                marginBottom: '30px',
              }}
            >
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    padding: '30px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onClick={() => setSelectedTemplate(template)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow =
                      '0 25px 50px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 15px 35px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  {/* Template Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '32px',
                        background: `linear-gradient(135deg, ${getTypeColor(template.type)}, ${getTypeColor(template.type)}dd)`,
                        borderRadius: '12px',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        minWidth: '56px',
                        height: '56px',
                      }}
                    >
                      {getTemplateIcon(template)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontSize: '20px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '5px',
                        }}
                      >
                        {template.name}
                      </h3>
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            background: `${getTypeColor(template.type)}20`,
                            color: getTypeColor(template.type),
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}
                        >
                          {template.type}
                        </span>
                        <span
                          style={{
                            background: '#f3f4f6',
                            color: '#6b7280',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}
                        >
                          {template.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Template Description */}
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      lineHeight: '1.5',
                      marginBottom: '20px',
                    }}
                  >
                    {template.description}
                  </p>

                  {/* Supported Formats */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      marginBottom: '20px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {template.supportedFormats.map((format) => (
                      <span
                        key={format}
                        style={{
                          background: '#e5e7eb',
                          color: '#4b5563',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '500',
                          textTransform: 'uppercase',
                        }}
                      >
                        {format}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        generateSampleDocument(template);
                      }}
                      disabled={isGenerating}
                      style={{
                        flex: 1,
                        background: `linear-gradient(135deg, ${getTypeColor(template.type)}, ${getTypeColor(template.type)}dd)`,
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: isGenerating ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        opacity: isGenerating ? 0.7 : 1,
                      }}
                    >
                      {isGenerating ? '🔄 Generating...' : '🚀 Generate Sample'}
                    </button>
                  </div>

                  {/* Customizable Badge */}
                  {template.isCustomizable && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        padding: '6px 10px',
                        borderRadius: '15px',
                        fontSize: '10px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                      }}
                    >
                      ✨ Customizable
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Generation Results */}
            {generationResult && (
              <div
                style={{
                  background: generationResult.success
                    ? 'rgba(34, 197, 94, 0.1)'
                    : 'rgba(239, 68, 68, 0.1)',
                  border: `2px solid ${generationResult.success ? '#22c55e' : '#ef4444'}`,
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '15px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>
                    {generationResult.success ? '✅' : '❌'}
                  </span>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: generationResult.success ? '#16a34a' : '#dc2626',
                      margin: 0,
                    }}
                  >
                    {generationResult.success
                      ? 'Document Generated Successfully!'
                      : 'Generation Failed'}
                  </h3>
                </div>

                {generationResult.success ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '15px',
                      color: '#16a34a',
                    }}
                  >
                    <div>
                      <strong>📄 Filename:</strong>
                      <br />
                      {generationResult.filename}
                    </div>
                    <div>
                      <strong>📊 Format:</strong>
                      <br />
                      {generationResult.format.toUpperCase()}
                    </div>
                    <div>
                      <strong>📏 Size:</strong>
                      <br />
                      {generationResult.metadata.fileSize
                        ? `${(generationResult.metadata.fileSize / 1024).toFixed(1)} KB`
                        : 'N/A'}
                    </div>
                    <div>
                      <strong>📑 Pages:</strong>
                      <br />
                      {generationResult.metadata.pageCount || 1}
                    </div>
                  </div>
                ) : (
                  <p
                    style={{
                      color: '#dc2626',
                      fontSize: '14px',
                      margin: 0,
                    }}
                  >
                    <strong>Error:</strong> {generationResult.error}
                  </p>
                )}

                {/* Preview HTML Content */}
                {generationResult.success && generationResult.htmlContent && (
                  <div style={{ marginTop: '20px' }}>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}
                    >
                      {showPreview ? '🙈 Hide Preview' : '👁️ Show Preview'}
                    </button>

                    {showPreview && (
                      <div
                        style={{
                          marginTop: '15px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          maxHeight: '400px',
                          overflow: 'auto',
                        }}
                      >
                        <iframe
                          srcDoc={generationResult.htmlContent}
                          style={{
                            width: '100%',
                            height: '400px',
                            border: 'none',
                            borderRadius: '8px',
                          }}
                          title='Document Preview'
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Template Details Modal */}
            {selectedTemplate && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1000,
                  padding: '20px',
                }}
                onClick={() => setSelectedTemplate(null)}
              >
                <div
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '30px',
                    maxWidth: '600px',
                    width: '100%',
                    maxHeight: '80vh',
                    overflow: 'auto',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '32px',
                        background: `linear-gradient(135deg, ${getTypeColor(selectedTemplate.type)}, ${getTypeColor(selectedTemplate.type)}dd)`,
                        borderRadius: '12px',
                        padding: '12px',
                        color: 'white',
                      }}
                    >
                      {getTemplateIcon(selectedTemplate)}
                    </div>
                    <div>
                      <h2
                        style={{
                          fontSize: '24px',
                          fontWeight: '600',
                          color: '#1f2937',
                          margin: 0,
                        }}
                      >
                        {selectedTemplate.name}
                      </h2>
                      <p
                        style={{
                          fontSize: '16px',
                          color: '#6b7280',
                          margin: '5px 0 0 0',
                        }}
                      >
                        {selectedTemplate.description}
                      </p>
                    </div>
                  </div>

                  {/* Template Properties */}
                  <div
                    style={{
                      background: '#f9fafb',
                      padding: '20px',
                      borderRadius: '12px',
                      marginBottom: '20px',
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '15px',
                      }}
                    >
                      Template Properties
                    </h3>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '15px',
                      }}
                    >
                      <div>
                        <strong style={{ color: '#4b5563' }}>Type:</strong>
                        <br />
                        <span
                          style={{
                            color: getTypeColor(selectedTemplate.type),
                            fontWeight: '500',
                          }}
                        >
                          {selectedTemplate.type}
                        </span>
                      </div>
                      <div>
                        <strong style={{ color: '#4b5563' }}>Category:</strong>
                        <br />
                        <span>{selectedTemplate.category}</span>
                      </div>
                      <div>
                        <strong style={{ color: '#4b5563' }}>
                          Customizable:
                        </strong>
                        <br />
                        <span>
                          {selectedTemplate.isCustomizable ? '✅ Yes' : '❌ No'}
                        </span>
                      </div>
                      <div>
                        <strong style={{ color: '#4b5563' }}>Formats:</strong>
                        <br />
                        <span>
                          {selectedTemplate.supportedFormats
                            .join(', ')
                            .toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      style={{
                        background: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        generateSampleDocument(selectedTemplate);
                        setSelectedTemplate(null);
                      }}
                      style={{
                        background: `linear-gradient(135deg, ${getTypeColor(selectedTemplate.type)}, ${getTypeColor(selectedTemplate.type)}dd)`,
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}
                    >
                      🚀 Generate Sample
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Footer */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '25px',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '20px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      color: 'white',
                      marginBottom: '5px',
                    }}
                  >
                    {templates.length}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Total Templates
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      color: 'white',
                      marginBottom: '5px',
                    }}
                  >
                    {new Set(templates.map((t) => t.category)).size}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Categories
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      color: 'white',
                      marginBottom: '5px',
                    }}
                  >
                    {templates.filter((t) => t.isCustomizable).length}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Customizable
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      color: 'white',
                      marginBottom: '5px',
                    }}
                  >
                    {
                      Array.from(
                        new Set(templates.flatMap((t) => t.supportedFormats))
                      ).length
                    }
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Output Formats
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* User Documents Section - Only show for documents tab */}
        {activeTab === 'documents' && currentUser && (
          <div
            style={{
              marginTop: '32px',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <UserDocumentsSection userId={currentUser.id} isCompact={false} />
          </div>
        )}
      </div>
    </div>
  );
}
