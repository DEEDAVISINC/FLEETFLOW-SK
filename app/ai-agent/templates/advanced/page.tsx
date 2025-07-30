'use client';

import { useEffect, useState } from 'react';
import AITemplateEngine, {
  AITemplate,
  TemplateContext,
  TemplateVariable,
} from '../../../services/AITemplateEngine';

export default function AdvancedTemplateEditor() {
  const [templates, setTemplates] = useState<AITemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<AITemplate | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Form state
  const [templateForm, setTemplateForm] = useState({
    name: '',
    category: 'email' as AITemplate['category'],
    content: '',
    variables: [] as TemplateVariable[],
    tags: [] as string[],
    metadata: {
      tone: 'professional' as const,
      language: 'en',
      industry: 'transportation',
      useCase: 'general',
    },
  });

  // Variable editor state
  const [variableForm, setVariableForm] = useState<Partial<TemplateVariable>>({
    name: '',
    type: 'string',
    required: false,
    description: '',
  });
  const [editingVariableIndex, setEditingVariableIndex] = useState<
    number | null
  >(null);

  // Test context state
  const [testContext, setTestContext] = useState<Partial<TemplateContext>>({
    leadData: {
      prospect_name: 'John Smith',
      company_name: 'ABC Manufacturing',
      email: 'john@abcmfg.com',
      phone: '(555) 123-4567',
      freight_type: 'Full Truckload',
      origin: 'Chicago, IL',
      destination: 'Atlanta, GA',
      weight: '45,000 lbs',
    },
    companyData: {
      agent_name: 'Sarah Johnson',
      company_name: 'FleetFlow Logistics',
      phone_number: '(555) 987-6543',
      email_signature: 'Best regards,\nSarah Johnson\nFleetFlow Logistics',
    },
  });

  // Load templates on component mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      // This would get current tenant ID from auth context
      const tenantId = 'current-tenant-id';
      const templates = await AITemplateEngine.getTenantTemplates(tenantId);
      setTemplates(templates);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const handleTemplateSelect = (template: AITemplate) => {
    setSelectedTemplate(template);
    setTemplateForm({
      name: template.name,
      category: template.category,
      content: template.content,
      variables: [...template.variables],
      tags: [...template.tags],
      metadata: { ...template.metadata },
    });
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setTemplateForm({
      name: '',
      category: 'email',
      content: '',
      variables: [],
      tags: [],
      metadata: {
        tone: 'professional',
        language: 'en',
        industry: 'transportation',
        useCase: 'general',
      },
    });
    setIsCreating(true);
    setIsEditing(true);
  };

  const handleSaveTemplate = async () => {
    try {
      const tenantId = 'current-tenant-id';

      if (isCreating) {
        const newTemplate = await AITemplateEngine.createTemplate(
          tenantId,
          templateForm
        );
        setTemplates([...templates, newTemplate]);
        setSelectedTemplate(newTemplate);
        setIsCreating(false);
      } else if (selectedTemplate) {
        const updatedTemplate = await AITemplateEngine.updateTemplate(
          selectedTemplate.id,
          templateForm
        );
        setTemplates(
          templates.map((t) =>
            t.id === selectedTemplate.id ? updatedTemplate : t
          )
        );
        setSelectedTemplate(updatedTemplate);
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save template:', error);
      alert(`Error saving template: ${error.message}`);
    }
  };

  const handleTestTemplate = async () => {
    if (!selectedTemplate) return;

    setIsTesting(true);
    try {
      const fullTestContext: TemplateContext = {
        tenantId: 'current-tenant-id',
        userId: 'current-user-id',
        leadData: testContext.leadData || {},
        companyData: testContext.companyData || {},
        timestamp: new Date(),
      };

      const results = await AITemplateEngine.testTemplate(
        selectedTemplate.id,
        fullTestContext
      );

      setTestResults(results);
    } catch (error) {
      console.error('Failed to test template:', error);
      setTestResults({
        result: '',
        variables: {},
        performance: {
          processingTime: 0,
          success: false,
          errors: [error.message],
        },
      });
    }
    setIsTesting(false);
  };

  const handleAddVariable = () => {
    if (!variableForm.name) return;

    const newVariable: TemplateVariable = {
      name: variableForm.name,
      type: variableForm.type || 'string',
      required: variableForm.required || false,
      description: variableForm.description || '',
      defaultValue: variableForm.defaultValue,
      options: variableForm.options,
      validation: variableForm.validation,
    };

    if (editingVariableIndex !== null) {
      const updatedVariables = [...templateForm.variables];
      updatedVariables[editingVariableIndex] = newVariable;
      setTemplateForm({ ...templateForm, variables: updatedVariables });
      setEditingVariableIndex(null);
    } else {
      setTemplateForm({
        ...templateForm,
        variables: [...templateForm.variables, newVariable],
      });
    }

    // Reset form
    setVariableForm({
      name: '',
      type: 'string',
      required: false,
      description: '',
    });
  };

  const handleEditVariable = (index: number) => {
    const variable = templateForm.variables[index];
    setVariableForm({ ...variable });
    setEditingVariableIndex(index);
  };

  const handleRemoveVariable = (index: number) => {
    const updatedVariables = templateForm.variables.filter(
      (_, i) => i !== index
    );
    setTemplateForm({ ...templateForm, variables: updatedVariables });
  };

  const insertVariableIntoContent = (variableName: string) => {
    const placeholder = `{{${variableName}}}`;
    const textarea = document.querySelector(
      'textarea[name="content"]'
    ) as HTMLTextAreaElement;

    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentContent = templateForm.content;
      const newContent =
        currentContent.substring(0, start) +
        placeholder +
        currentContent.substring(end);

      setTemplateForm({ ...templateForm, content: newContent });

      // Reset cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + placeholder.length,
          start + placeholder.length
        );
      }, 0);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
        linear-gradient(135deg, rgba(255, 20, 147, 0.15) 0%, rgba(236, 72, 153, 0.12) 25%, rgba(219, 39, 119, 0.10) 50%, rgba(190, 24, 93, 0.08) 100%),
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)
      `,
        paddingTop: '80px',
      }}
    >
      <div
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '0 24px 32px',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h1
                style={{
                  color: '#d946ef',
                  fontSize: '36px',
                  fontWeight: 'bold',
                  margin: '0 0 16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                ⚡ Advanced Template Editor
                <span
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    background: 'rgba(217, 70, 239, 0.2)',
                    color: '#d946ef',
                    textTransform: 'uppercase',
                  }}
                >
                  PROFESSIONAL
                </span>
              </h1>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '18px',
                  margin: 0,
                }}
              >
                Create, test, and optimize AI agent communication templates
              </p>
            </div>

            <button
              onClick={handleCreateNew}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              ➕ Create New Template
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '300px 1fr 400px',
            gap: '32px',
          }}
        >
          {/* Template List */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              height: 'fit-content',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              📁 My Templates
              <span
                style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#3b82f6',
                }}
              >
                {templates.length}
              </span>
            </h3>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  style={{
                    padding: '16px',
                    background:
                      selectedTemplate?.id === template.id
                        ? 'linear-gradient(135deg, #d946ef, #c026d3)'
                        : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    border:
                      selectedTemplate?.id === template.id
                        ? '1px solid #d946ef'
                        : '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}
                  >
                    {template.name}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        fontSize: '10px',
                      }}
                    >
                      {template.category.toUpperCase()}
                    </span>
                    <span>Used {template.performance.timesUsed}x</span>
                  </div>
                </div>
              ))}

              {templates.length === 0 && (
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '14px',
                  }}
                >
                  No templates yet. Create your first template!
                </div>
              )}
            </div>
          </div>

          {/* Main Editor */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            {selectedTemplate || isCreating ? (
              <div>
                {/* Template Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: '600',
                      margin: 0,
                    }}
                  >
                    {isCreating ? 'New Template' : selectedTemplate?.name}
                  </h3>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    {!isEditing && !isCreating && (
                      <button
                        onClick={() => setIsEditing(true)}
                        style={{
                          padding: '8px 16px',
                          background:
                            'linear-gradient(135deg, #3b82f6, #2563eb)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        ✏️ Edit
                      </button>
                    )}

                    {(isEditing || isCreating) && (
                      <>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setIsCreating(false);
                            if (selectedTemplate) {
                              handleTemplateSelect(selectedTemplate);
                            }
                          }}
                          style={{
                            padding: '8px 16px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveTemplate}
                          style={{
                            padding: '8px 16px',
                            background:
                              'linear-gradient(135deg, #10b981, #059669)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          💾 Save
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Template Form */}
                {isEditing || isCreating ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '24px',
                    }}
                  >
                    {/* Basic Info */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 200px',
                        gap: '16px',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: 'block',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '8px',
                          }}
                        >
                          Template Name
                        </label>
                        <input
                          type='text'
                          value={templateForm.name}
                          onChange={(e) =>
                            setTemplateForm({
                              ...templateForm,
                              name: e.target.value,
                            })
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            display: 'block',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '8px',
                          }}
                        >
                          Category
                        </label>
                        <select
                          value={templateForm.category}
                          onChange={(e) =>
                            setTemplateForm({
                              ...templateForm,
                              category: e.target
                                .value as AITemplate['category'],
                            })
                          }
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '14px',
                          }}
                        >
                          <option value='email'>📧 Email</option>
                          <option value='call_script'>📞 Call Script</option>
                          <option value='social_media'>💬 Social Media</option>
                          <option value='text_message'>📱 Text Message</option>
                        </select>
                      </div>
                    </div>

                    {/* Content Editor */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        Template Content
                      </label>
                      <textarea
                        name='content'
                        value={templateForm.content}
                        onChange={(e) =>
                          setTemplateForm({
                            ...templateForm,
                            content: e.target.value,
                          })
                        }
                        placeholder='Write your template content here. Use {{variable_name}} for dynamic content.'
                        style={{
                          width: '100%',
                          minHeight: '200px',
                          padding: '16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '14px',
                          fontFamily: 'monospace',
                          lineHeight: '1.5',
                          resize: 'vertical',
                        }}
                      />
                    </div>

                    {/* Variables Section */}
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        🔧 Template Variables
                        <span
                          style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            background: 'rgba(217, 70, 239, 0.2)',
                            color: '#d946ef',
                          }}
                        >
                          {templateForm.variables.length}
                        </span>
                      </h4>

                      {/* Variable List */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          marginBottom: '16px',
                        }}
                      >
                        {templateForm.variables.map((variable, index) => (
                          <div
                            key={index}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '12px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '8px',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  color: 'white',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <code
                                  style={{
                                    padding: '2px 6px',
                                    background: 'rgba(217, 70, 239, 0.2)',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                  }}
                                >
                                  {`{{${variable.name}}}`}
                                </code>
                                {variable.required && (
                                  <span
                                    style={{
                                      color: '#ef4444',
                                      fontSize: '12px',
                                      fontWeight: '700',
                                    }}
                                  >
                                    REQUIRED
                                  </span>
                                )}
                              </div>
                              <div
                                style={{
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  fontSize: '12px',
                                  marginTop: '4px',
                                }}
                              >
                                {variable.description} • Type: {variable.type}
                              </div>
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                gap: '8px',
                              }}
                            >
                              <button
                                onClick={() =>
                                  insertVariableIntoContent(variable.name)
                                }
                                style={{
                                  padding: '6px 12px',
                                  background: 'rgba(59, 130, 246, 0.2)',
                                  color: '#3b82f6',
                                  border: '1px solid rgba(59, 130, 246, 0.3)',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                }}
                              >
                                Insert
                              </button>
                              <button
                                onClick={() => handleEditVariable(index)}
                                style={{
                                  padding: '6px 12px',
                                  background: 'rgba(245, 158, 11, 0.2)',
                                  color: '#f59e0b',
                                  border: '1px solid rgba(245, 158, 11, 0.3)',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleRemoveVariable(index)}
                                style={{
                                  padding: '6px 12px',
                                  background: 'rgba(239, 68, 68, 0.2)',
                                  color: '#ef4444',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Variable Form */}
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '12px',
                          padding: '20px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <h5
                          style={{
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '16px',
                          }}
                        >
                          {editingVariableIndex !== null
                            ? 'Edit Variable'
                            : 'Add New Variable'}
                        </h5>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 120px auto',
                            gap: '12px',
                            alignItems: 'end',
                          }}
                        >
                          <div>
                            <label
                              style={{
                                display: 'block',
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '12px',
                                fontWeight: '600',
                                marginBottom: '4px',
                              }}
                            >
                              Variable Name
                            </label>
                            <input
                              type='text'
                              value={variableForm.name}
                              onChange={(e) =>
                                setVariableForm({
                                  ...variableForm,
                                  name: e.target.value,
                                })
                              }
                              placeholder='e.g., prospect_name'
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '12px',
                              }}
                            />
                          </div>

                          <div>
                            <label
                              style={{
                                display: 'block',
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '12px',
                                fontWeight: '600',
                                marginBottom: '4px',
                              }}
                            >
                              Type
                            </label>
                            <select
                              value={variableForm.type}
                              onChange={(e) =>
                                setVariableForm({
                                  ...variableForm,
                                  type: e.target
                                    .value as TemplateVariable['type'],
                                })
                              }
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                fontSize: '12px',
                              }}
                            >
                              <option value='string'>String</option>
                              <option value='number'>Number</option>
                              <option value='date'>Date</option>
                              <option value='boolean'>Boolean</option>
                              <option value='select'>Select</option>
                            </select>
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <label
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '12px',
                                cursor: 'pointer',
                              }}
                            >
                              <input
                                type='checkbox'
                                checked={variableForm.required}
                                onChange={(e) =>
                                  setVariableForm({
                                    ...variableForm,
                                    required: e.target.checked,
                                  })
                                }
                              />
                              Required
                            </label>

                            <button
                              onClick={handleAddVariable}
                              disabled={!variableForm.name}
                              style={{
                                padding: '8px 16px',
                                background: variableForm.name
                                  ? 'linear-gradient(135deg, #10b981, #059669)'
                                  : 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: variableForm.name
                                  ? 'pointer'
                                  : 'not-allowed',
                                fontSize: '12px',
                                fontWeight: '600',
                                opacity: variableForm.name ? 1 : 0.5,
                              }}
                            >
                              {editingVariableIndex !== null ? 'Update' : 'Add'}
                            </button>
                          </div>
                        </div>

                        <div style={{ marginTop: '12px' }}>
                          <label
                            style={{
                              display: 'block',
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontSize: '12px',
                              fontWeight: '600',
                              marginBottom: '4px',
                            }}
                          >
                            Description
                          </label>
                          <input
                            type='text'
                            value={variableForm.description}
                            onChange={(e) =>
                              setVariableForm({
                                ...variableForm,
                                description: e.target.value,
                              })
                            }
                            placeholder='Describe what this variable represents...'
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              background: 'rgba(255, 255, 255, 0.1)',
                              color: 'white',
                              fontSize: '12px',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Template Preview */
                  <div>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '12px',
                        }}
                      >
                        Template Content
                      </h4>
                      <pre
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '14px',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-wrap',
                          margin: 0,
                          fontFamily: 'inherit',
                        }}
                      >
                        {selectedTemplate?.content}
                      </pre>
                    </div>

                    {/* Variables List */}
                    {selectedTemplate &&
                      selectedTemplate.variables.length > 0 && (
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <h4
                            style={{
                              color: 'white',
                              fontSize: '16px',
                              fontWeight: '600',
                              marginBottom: '16px',
                            }}
                          >
                            Variables ({selectedTemplate.variables.length})
                          </h4>

                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '8px',
                            }}
                          >
                            {selectedTemplate.variables.map(
                              (variable, index) => (
                                <span
                                  key={index}
                                  style={{
                                    padding: '6px 12px',
                                    background: variable.required
                                      ? 'rgba(239, 68, 68, 0.2)'
                                      : 'rgba(217, 70, 239, 0.2)',
                                    color: variable.required
                                      ? '#ef4444'
                                      : '#d946ef',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    fontFamily: 'monospace',
                                  }}
                                >
                                  {`{{${variable.name}}}`}
                                  {variable.required && ' *'}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            ) : (
              /* No Template Selected */
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                <h3 style={{ color: 'white', marginBottom: '8px' }}>
                  No Template Selected
                </h3>
                <p>
                  Choose a template from the list or create a new one to get
                  started.
                </p>
              </div>
            )}
          </div>

          {/* Test Panel */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              height: 'fit-content',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              🧪 Template Testing
              {selectedTemplate && (
                <button
                  onClick={handleTestTemplate}
                  disabled={isTesting}
                  style={{
                    padding: '6px 12px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isTesting ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    opacity: isTesting ? 0.5 : 1,
                  }}
                >
                  {isTesting ? '⏳ Testing...' : '🚀 Test Now'}
                </button>
              )}
            </h3>

            {selectedTemplate ? (
              <div>
                {/* Test Context Editor */}
                <div style={{ marginBottom: '20px' }}>
                  <h4
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    Test Data
                  </h4>

                  <textarea
                    value={JSON.stringify(testContext, null, 2)}
                    onChange={(e) => {
                      try {
                        setTestContext(JSON.parse(e.target.value));
                      } catch (error) {
                        // Invalid JSON, ignore
                      }
                    }}
                    style={{
                      width: '100%',
                      minHeight: '200px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      lineHeight: '1.4',
                    }}
                  />
                </div>

                {/* Test Results */}
                {testResults && (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      Test Results
                      <span
                        style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          background: testResults.performance.success
                            ? 'rgba(16, 185, 129, 0.2)'
                            : 'rgba(239, 68, 68, 0.2)',
                          color: testResults.performance.success
                            ? '#10b981'
                            : '#ef4444',
                        }}
                      >
                        {testResults.performance.success ? 'SUCCESS' : 'ERROR'}
                      </span>
                    </h4>

                    {testResults.performance.success ? (
                      <div>
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px',
                            padding: '12px',
                            marginBottom: '12px',
                          }}
                        >
                          <h5
                            style={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontSize: '12px',
                              fontWeight: '600',
                              marginBottom: '8px',
                            }}
                          >
                            Generated Content:
                          </h5>
                          <div
                            style={{
                              color: 'white',
                              fontSize: '12px',
                              lineHeight: '1.4',
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {testResults.result}
                          </div>
                        </div>

                        <div
                          style={{
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          Processing time:{' '}
                          {testResults.performance.processingTime}ms
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '8px',
                            padding: '12px',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                          }}
                        >
                          {testResults.performance.errors.map(
                            (error: string, index: number) => (
                              <div
                                key={index}
                                style={{
                                  color: '#ef4444',
                                  fontSize: '12px',
                                  marginBottom:
                                    index <
                                    testResults.performance.errors.length - 1
                                      ? '4px'
                                      : 0,
                                }}
                              >
                                • {error}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '14px',
                }}
              >
                Select a template to test it with sample data
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
