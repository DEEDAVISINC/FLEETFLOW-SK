'use client';

import {
  Building2,
  Copy,
  Download,
  Edit3,
  Eye,
  FileText,
  Mail,
  Plus,
  Save,
  Trash2,
  Truck,
  Upload,
  User,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import {
  DEPOINTESignatures,
  emailTemplateService,
  freightCategories,
  type EmailTemplate,
} from '../services/DEPOINTEEmailTemplateService';

// Professional freight industry templates

const DEPOINTEEmailTemplateSystem = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load templates on component mount
  useEffect(() => {
    setTemplates(emailTemplateService.getAllTemplates());
  }, []);

  // Get filtered templates based on selected category
  const getFilteredTemplates = (category: string) => {
    return emailTemplateService.getTemplatesByCategory(category);
  };

  // Get appropriate email based on template category
  const getEmailForCategory = (category: string) => {
    switch (category) {
      case 'compliance':
        return previewData.compliance_email;
      case 'capacity':
        return previewData.logistics_email;
      case 'reliability':
        return previewData.operations_email;
      case 'general':
        return previewData.info_email;
      default:
        return previewData.email;
    }
  };

  // Get appropriate DEPOINTE AI staff name based on email type
  const getNameForEmail = (email: string) => {
    if (email === previewData.compliance_email) return 'Kameelah Johnson';
    if (email === previewData.sales_email) return 'Will Thompson';
    if (email === previewData.logistics_email) return 'Miles Rodriguez';
    if (email === previewData.operations_email) return 'Logan Stevens';
    if (email === previewData.info_email) return 'Dee Davis';
    if (email === previewData.support_email) return 'Dell Johnson';
    if (email === previewData.billing_email) return 'Resse Bell';
    return 'DEPOINTE AI Team';
  };

  // Get appropriate DEPOINTE AI staff title based on email type
  const getTitleForEmail = (email: string) => {
    if (email === previewData.compliance_email)
      return 'Compliance & Safety Director';
    if (email === previewData.sales_email) return 'Senior Sales Executive';
    if (email === previewData.logistics_email) return 'Logistics Manager';
    if (email === previewData.operations_email) return 'Operations Director';
    if (email === previewData.info_email) return 'Owner & Founder';
    if (email === previewData.support_email) return 'IT Support Specialist';
    if (email === previewData.billing_email) return 'Accounting Manager';
    return 'DEPOINTE AI Staff';
  };

  const [currentTemplate, setCurrentTemplate] = useState({
    name: '',
    subject: '',
    category: 'general',
    content: '',
    variables: [],
  });

  // Freight industry specific preview data
  const [previewData, setPreviewData] = useState({
    company_name: 'DEPOINTE/Freight 1st Direct',
    company_logo_url:
      'https://via.placeholder.com/200x80/2563eb/white?text=DEPOINTE',
    contact_name: 'John Smith',
    prospect_company: 'Acme Manufacturing',
    prospect_city: 'Chicago, IL',
    industry: 'Manufacturing',
    meeting_booking_link: 'https://calendly.com/ddavis-freight1stdirect/30min',
    capacity_analysis_link: 'https://freight1stdirect.com/capacity-analysis',
    reliability_assessment_link:
      'https://freight1stdirect.com/reliability-assessment',
    your_name: 'Dee Davis',
    direct_phone: '(248) 621-1950',
    email: 'ddavis@fleetflowapp.com',

    // Additional DEPOINTE email addresses
    compliance_email: 'compliance@fleetflowapp.com',
    sales_email: 'sales@fleetflowapp.com',
    logistics_email: 'logistics@fleetflowapp.com',
    operations_email: 'operations@fleetflowapp.com',
    info_email: 'info@fleetflowapp.com',
    support_email: 'support@fleetflowapp.com',
    billing_email: 'billing@fleetflowapp.com',

    // Staff communications go through department emails only
    account_id: 'AC-12345',
    login_url: 'https://app.freight1stdirect.com/login',
    invoice_number: 'INV-001',
    amount: '299.99',
    due_date: 'October 15, 2024',
    invoice_url: 'https://app.freight1stdirect.com/invoice/001',
    support_email: 'billing@freight1stdirect.com',
    newsletter_title: 'Monthly Freight Market Update',
    month: 'September',
    year: '2024',
    feature_title: 'New Capacity Management Tools',
    feature_description:
      "We've added powerful analytics and improved capacity forecasting.",
    read_more_url: 'https://blog.freight1stdirect.com/new-features',
    unsubscribe_url: 'https://app.freight1stdirect.com/unsubscribe',
  });

  // Use imported freight categories

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTemplates = getFilteredTemplates(selectedCategory);

  // Safe variable extraction using square brackets
  const extractVariables = (content = '', subject = '') => {
    const combined = `${content} ${subject}`;
    const matches = combined.match(/\[([^\]]+)\]/g) || [];
    return [...new Set(matches.map((match) => match.replace(/[\[\]]/g, '')))];
  };

  // Use service methods for rendering with appropriate email selection
  const renderPreview = (
    content: string,
    data: Record<string, string>,
    category: string = 'general'
  ) => {
    // Create dynamic data with appropriate email for this category
    const dynamicData = {
      ...data,
      email: getEmailForCategory(category),
      your_name: getNameForEmail(getEmailForCategory(category)),
      sender_title: getTitleForEmail(getEmailForCategory(category)),
    };

    return emailTemplateService.renderTemplate(
      { id: 0, name: '', subject: '', category, content, variables: [] },
      dynamicData
    );
  };

  const renderSubjectPreview = (
    subject: string,
    data: Record<string, string>,
    category: string = 'general'
  ) => {
    // Create dynamic data with appropriate email for this category
    const dynamicData = {
      ...data,
      email: getEmailForCategory(category),
      your_name: getNameForEmail(getEmailForCategory(category)),
    };

    return emailTemplateService.renderSubject(subject, dynamicData);
  };

  const createNewTemplate = () => {
    setCurrentTemplate({
      name: '',
      subject: '',
      category: 'general',
      content: '',
      variables: [],
    });
    setSelectedTemplate(null);
    setIsEditing(true);
    setActiveTab('editor');
  };

  const editTemplate = (template) => {
    setCurrentTemplate({ ...template });
    setSelectedTemplate(template);
    setIsEditing(true);
    setActiveTab('editor');
  };

  const saveTemplate = () => {
    const variables = emailTemplateService.extractVariables(
      currentTemplate.content,
      currentTemplate.subject
    );
    const templateData = {
      name: currentTemplate.name,
      subject: currentTemplate.subject,
      category: currentTemplate.category,
      content: currentTemplate.content,
      variables: variables,
      isActive: true,
    };

    if (selectedTemplate) {
      emailTemplateService.updateTemplate(selectedTemplate.id, templateData);
    } else {
      emailTemplateService.createTemplate(templateData);
    }

    setTemplates(emailTemplateService.getAllTemplates());
    setIsEditing(false);
    setActiveTab('templates');
  };

  const deleteTemplate = (id: number) => {
    emailTemplateService.deleteTemplate(id);
    setTemplates(emailTemplateService.getAllTemplates());
  };

  const duplicateTemplate = (id: number) => {
    emailTemplateService.duplicateTemplate(id);
    setTemplates(emailTemplateService.getAllTemplates());
  };

  const exportTemplate = (id: number) => {
    const exportedData = emailTemplateService.exportTemplate(id);
    if (exportedData) {
      const dataBlob = new Blob([exportedData], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `template_${id}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const importTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          const importedTemplate = emailTemplateService.importTemplate(result);
          if (importedTemplate) {
            setTemplates(emailTemplateService.getAllTemplates());
          } else {
            alert('Invalid template file');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='border-b border-gray-200 bg-white'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between py-6'>
            <div className='flex items-center'>
              <Truck className='mr-3 h-8 w-8 text-blue-600' />
              <h1 className='text-2xl font-bold text-gray-900'>
                DEPOINTE AI Email Template System
              </h1>
            </div>
            <div className='flex items-center space-x-4'>
              <input
                type='file'
                ref={fileInputRef}
                onChange={importTemplate}
                accept='.json'
                className='hidden'
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className='inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'
              >
                <Upload className='mr-2 h-4 w-4' />
                Import
              </button>
              <button
                onClick={createNewTemplate}
                className='inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700'
              >
                <Plus className='mr-2 h-4 w-4' />
                New DEPOINTE Template
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='flex space-x-8'>
          {/* Sidebar */}
          <div className='w-64 flex-shrink-0'>
            <nav className='space-y-1'>
              <button
                onClick={() => setActiveTab('templates')}
                className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium ${
                  activeTab === 'templates'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Mail className='mr-2 inline h-4 w-4' />
                Templates
              </button>
              <button
                onClick={() => setActiveTab('editor')}
                className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium ${
                  activeTab === 'editor'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Edit3 className='mr-2 inline h-4 w-4' />
                Editor
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium ${
                  activeTab === 'preview'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Eye className='mr-2 inline h-4 w-4' />
                Preview
              </button>
              <button
                onClick={() => setActiveTab('signatures')}
                className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium ${
                  activeTab === 'signatures'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <User className='mr-2 inline h-4 w-4' />
                Signatures
              </button>
            </nav>

            {activeTab === 'templates' && (
              <div className='mt-6'>
                <h3 className='mb-3 text-sm font-medium text-gray-900'>
                  DEPOINTE Categories
                </h3>
                <div className='space-y-1'>
                  {freightCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                          selectedCategory === category.id
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className='mr-2 inline h-4 w-4' />
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            {activeTab === 'templates' && (
              <div>
                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md'
                    >
                      <div className='mb-3 flex items-start justify-between'>
                        <h3 className='text-lg font-medium text-gray-900'>
                          {template.name}
                        </h3>
                        <div className='flex space-x-2'>
                          <button
                            onClick={() => editTemplate(template)}
                            className='text-gray-400 hover:text-gray-600'
                          >
                            <Edit3 className='h-4 w-4' />
                          </button>
                          <button
                            onClick={() => duplicateTemplate(template.id)}
                            className='text-gray-400 hover:text-gray-600'
                          >
                            <Copy className='h-4 w-4' />
                          </button>
                          <button
                            onClick={() => exportTemplate(template.id)}
                            className='text-gray-400 hover:text-gray-600'
                          >
                            <Download className='h-4 w-4' />
                          </button>
                          <button
                            onClick={() => deleteTemplate(template.id)}
                            className='text-gray-400 hover:text-red-600'
                          >
                            <Trash2 className='h-4 w-4' />
                          </button>
                        </div>
                      </div>
                      <p className='mb-2 text-sm text-gray-600'>
                        {template.subject}
                      </p>
                      <div className='flex items-center justify-between'>
                        <span className='inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 capitalize'>
                          {template.category}
                        </span>
                        <span className='text-xs text-gray-500'>
                          {template.lastModified}
                        </span>
                      </div>
                      <div className='mt-3'>
                        <span className='text-xs text-gray-500'>
                          {template.variables.length} variable
                          {template.variables.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'editor' && (
              <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                <div className='mb-6'>
                  <h2 className='mb-4 text-xl font-semibold text-gray-900'>
                    {selectedTemplate
                      ? 'Edit DEPOINTE Template'
                      : 'Create New DEPOINTE Template'}
                  </h2>

                  <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div>
                      <label className='mb-2 block text-sm font-medium text-gray-700'>
                        Template Name
                      </label>
                      <input
                        type='text'
                        value={currentTemplate.name}
                        onChange={(e) =>
                          setCurrentTemplate({
                            ...currentTemplate,
                            name: e.target.value,
                          })
                        }
                        className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                        placeholder='Enter template name'
                      />
                    </div>
                    <div>
                      <label className='mb-2 block text-sm font-medium text-gray-700'>
                        DEPOINTE Category
                      </label>
                      <select
                        value={currentTemplate.category}
                        onChange={(e) =>
                          setCurrentTemplate({
                            ...currentTemplate,
                            category: e.target.value,
                          })
                        }
                        className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                      >
                        <option value='general'>General</option>
                        <option value='compliance'>Compliance</option>
                        <option value='capacity'>Capacity</option>
                        <option value='reliability'>Reliability</option>
                      </select>
                    </div>
                  </div>

                  <div className='mb-4'>
                    <label className='mb-2 block text-sm font-medium text-gray-700'>
                      Subject Line (use [variable] for dynamic content)
                    </label>
                    <input
                      type='text'
                      value={currentTemplate.subject}
                      onChange={(e) =>
                        setCurrentTemplate({
                          ...currentTemplate,
                          subject: e.target.value,
                        })
                      }
                      className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                      placeholder='Enter email subject (use [variable] for dynamic content)'
                    />
                  </div>

                  <div className='mb-6'>
                    <label className='mb-2 block text-sm font-medium text-gray-700'>
                      Email Content (HTML - use [variable] for dynamic content)
                    </label>
                    <textarea
                      value={currentTemplate.content}
                      onChange={(e) =>
                        setCurrentTemplate({
                          ...currentTemplate,
                          content: e.target.value,
                        })
                      }
                      rows={25}
                      className='w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
                      placeholder='Enter HTML content (use [variable] for dynamic content)'
                    />
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='text-sm text-gray-600'>
                      Variables found:{' '}
                      {extractVariables(
                        currentTemplate.content,
                        currentTemplate.subject
                      ).join(', ') || 'None'}
                    </div>
                    <div className='space-x-3'>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setActiveTab('templates');
                        }}
                        className='rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveTemplate}
                        className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
                      >
                        <Save className='mr-2 inline h-4 w-4' />
                        Save Template
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className='space-y-6'>
                <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                  <h2 className='mb-4 text-xl font-semibold text-gray-900'>
                    DEPOINTE Email Preview
                  </h2>

                  <div className='mb-4'>
                    <label className='mb-2 block text-sm font-medium text-gray-700'>
                      Select Template to Preview
                    </label>
                    <select
                      value={selectedTemplate?.id || ''}
                      onChange={(e) => {
                        const template = templates.find(
                          (t) => t.id === parseInt(e.target.value)
                        );
                        setSelectedTemplate(template);
                        setCurrentTemplate(
                          template || {
                            name: '',
                            subject: '',
                            category: 'general',
                            content: '',
                            variables: [],
                          }
                        );
                      }}
                      className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                    >
                      <option value=''>
                        Select a DEPOINTE template to preview
                      </option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedTemplate && (
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                      <div>
                        <h3 className='mb-3 text-lg font-medium text-gray-900'>
                          Preview Variables
                        </h3>
                        <div className='mb-4 rounded-lg bg-blue-50 p-3'>
                          <div className='text-sm'>
                            <strong>Sending from:</strong>{' '}
                            {getEmailForCategory(selectedTemplate.category)}
                            <br />
                            <strong>Sender:</strong>{' '}
                            {getNameForEmail(
                              getEmailForCategory(selectedTemplate.category)
                            )}{' '}
                            -{' '}
                            {getTitleForEmail(
                              getEmailForCategory(selectedTemplate.category)
                            )}
                          </div>
                        </div>
                        <div className='max-h-96 space-y-3 overflow-y-auto'>
                          {selectedTemplate.variables.map((variable) => (
                            <div key={variable}>
                              <label className='mb-1 block text-sm font-medium text-gray-700'>
                                {variable.replace(/_/g, ' ')}
                              </label>
                              <input
                                type='text'
                                value={previewData[variable] || ''}
                                onChange={(e) =>
                                  setPreviewData({
                                    ...previewData,
                                    [variable]: e.target.value,
                                  })
                                }
                                className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
                                placeholder={`Enter ${variable}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className='mb-3 text-lg font-medium text-gray-900'>
                          Email Preview
                        </h3>
                        <div className='max-h-96 min-h-96 overflow-y-auto rounded-md border border-gray-300 bg-gray-50 p-4'>
                          <div className='rounded border bg-white p-4 shadow-sm'>
                            <div className='mb-4 border-b pb-2'>
                              <strong>Subject:</strong>{' '}
                              {renderSubjectPreview(
                                selectedTemplate.subject,
                                previewData,
                                selectedTemplate.category
                              )}
                            </div>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: renderPreview(
                                  selectedTemplate.content,
                                  previewData,
                                  selectedTemplate.category
                                ),
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'signatures' && (
              <div className='space-y-6'>
                <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                  <h2 className='mb-4 text-xl font-semibold text-gray-900'>
                    Professional DEPOINTE Signatures
                  </h2>

                  <div className='grid gap-6 md:grid-cols-1'>
                    <div className='rounded-lg border border-gray-200 p-6'>
                      <h3 className='mb-3 flex items-center text-lg font-medium text-gray-900'>
                        <Building2 className='mr-2 h-5 w-5 text-blue-600' />
                        Freight Brokerage Signature
                      </h3>
                      <div className='rounded-md border bg-gray-50 p-4'>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DEPOINTESignatures.freight_broker
                              .replace('[your_name]', previewData.your_name)
                              .replace(
                                '[direct_phone]',
                                previewData.direct_phone
                              )
                              .replace('[email]', previewData.email)
                              .replace(
                                '[company_logo_url]',
                                previewData.company_logo_url
                              ),
                          }}
                        />
                      </div>
                    </div>

                    <div className='rounded-lg border border-gray-200 p-6'>
                      <h3 className='mb-3 flex items-center text-lg font-medium text-gray-900'>
                        <FileText className='mr-2 h-5 w-5 text-red-600' />
                        Compliance Specialist Signature
                      </h3>
                      <div className='rounded-md border bg-gray-50 p-4'>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DEPOINTESignatures.compliance_specialist
                              .replace('[your_name]', previewData.your_name)
                              .replace(
                                '[direct_phone]',
                                previewData.direct_phone
                              )
                              .replace('[email]', previewData.email)
                              .replace(
                                '[company_logo_url]',
                                previewData.company_logo_url
                              ),
                          }}
                        />
                      </div>
                    </div>

                    <div className='rounded-lg border border-gray-200 p-6'>
                      <h3 className='mb-3 flex items-center text-lg font-medium text-gray-900'>
                        <User className='mr-2 h-5 w-5 text-green-600' />
                        Sales Specialist Signature
                      </h3>
                      <div className='rounded-md border bg-gray-50 p-4'>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DEPOINTESignatures.sales_specialist
                              .replace('[your_name]', previewData.your_name)
                              .replace(
                                '[direct_phone]',
                                previewData.direct_phone
                              )
                              .replace('[email]', previewData.email)
                              .replace(
                                '[company_logo_url]',
                                previewData.company_logo_url
                              ),
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className='mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4'>
                    <h4 className='mb-2 text-sm font-medium text-blue-900'>
                      Signature Variables:
                    </h4>
                    <div className='text-sm text-blue-800'>
                      <strong>[your_name]</strong> - Your full name
                      <br />
                      <strong>[direct_phone]</strong> - Your direct phone number
                      <br />
                      <strong>[email]</strong> - Your email address
                      <br />
                      <strong>[company_logo_url]</strong> - DEPOINTE logo URL
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DEPOINTEEmailTemplateSystem;
