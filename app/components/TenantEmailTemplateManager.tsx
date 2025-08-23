'use client';

import { useEffect, useState } from 'react';
import type {
  EmailTemplateInput,
  EmailTemplateType,
  TenantEmailTemplate,
} from '../services/TenantEmailTemplateService';
import { tenantEmailTemplateService } from '../services/TenantEmailTemplateService';

interface Props {
  tenantId: string;
}

export default function TenantEmailTemplateManager({ tenantId }: Props) {
  const [templates, setTemplates] = useState<TenantEmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateType>(
    'load_information_existing_carrier'
  );
  const [editingTemplate, setEditingTemplate] =
    useState<EmailTemplateInput | null>(null);
  const [previewVariables, setPreviewVariables] = useState<any>({});
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const templateTypes: Array<{
    type: EmailTemplateType;
    label: string;
    description: string;
  }> = [
    {
      type: 'load_information_existing_carrier',
      label: 'Load Information (Existing Carrier)',
      description: 'Email sent to existing carriers with load details',
    },
    {
      type: 'carrier_invitation_new',
      label: 'Carrier Invitation (New)',
      description:
        'Email sent to new carriers inviting them to join your network',
    },
    {
      type: 'load_status_update',
      label: 'Load Status Update',
      description: 'Email sent when load status changes',
    },
    {
      type: 'driver_assignment',
      label: 'Driver Assignment',
      description: 'Email sent when driver is assigned to a load',
    },
    {
      type: 'factoring_bol_submission',
      label: 'Factoring BOL Submission',
      description:
        'Email sent to factoring company when delivery is completed with attached BOL',
    },
  ];

  const availableVariables = {
    load_information_existing_carrier: [
      '{{load.id}}',
      '{{load.origin.city}}',
      '{{load.origin.state}}',
      '{{load.destination.city}}',
      '{{load.destination.state}}',
      '{{load.rate}}',
      '{{load.distance}}',
      '{{load.pickupDate}}',
      '{{load.deliveryDate}}',
      '{{load.equipment}}',
      '{{load.weight}}',
      '{{load.status}}',
      '{{carrier.company}}',
      '{{carrier.contactName}}',
      '{{tenant.companyName}}',
      '{{tenant.phone}}',
      '{{tenant.website}}',
    ],
    carrier_invitation_new: [
      '{{load.id}}',
      '{{load.origin.city}}',
      '{{load.destination.city}}',
      '{{load.rate}}',
      '{{inquiry.contactName}}',
      '{{inquiry.company}}',
      '{{tenant.companyName}}',
      '{{tenant.phone}}',
      '{{tenant.website}}',
    ],
    factoring_bol_submission: [
      '{{load.id}}',
      '{{load.origin}}',
      '{{load.destination}}',
      '{{load.amount}}',
      '{{load.deliveryDate}}',
      '{{load.expectedAdvance}}',
      '{{carrier.name}}',
      '{{carrier.mcNumber}}',
      '{{carrier.contact}}',
      '{{carrier.phone}}',
      '{{factoring.companyName}}',
      '{{factoring.accountExecutive.name}}',
      '{{factoring.accountExecutive.title}}',
      '{{factoring.accountExecutive.email}}',
      '{{factoring.accountExecutive.phone}}',
      '{{factoring.accountExecutive.directPhone}}',
      '{{factoring.rate}}',
      '{{factoring.advanceRate}}',
      '{{driver.name}}',
      '{{driver.signature}}',
      '{{receiver.name}}',
      '{{receiver.signature}}',
      '{{tenant.companyName}}',
      '{{tenant.phone}}',
      '{{tenant.website}}',
    ],
  };

  useEffect(() => {
    loadTemplates();
  }, [tenantId]);

  useEffect(() => {
    loadCurrentTemplate();
  }, [selectedTemplate]);

  const loadTemplates = async () => {
    try {
      const tenantTemplates =
        await tenantEmailTemplateService.getTenantTemplates(tenantId);
      setTemplates(tenantTemplates);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const loadCurrentTemplate = async () => {
    try {
      const template = await tenantEmailTemplateService.getTenantEmailTemplate(
        tenantId,
        selectedTemplate
      );
      setEditingTemplate({
        subject: template.subject,
        htmlContent: template.htmlContent,
        textContent: template.textContent,
      });
    } catch (error) {
      console.error('Failed to load template:', error);
    }
  };

  const saveTemplate = async () => {
    if (!editingTemplate) return;

    setSaving(true);
    try {
      const success = await tenantEmailTemplateService.saveTenantTemplate(
        tenantId,
        selectedTemplate,
        editingTemplate
      );

      if (success) {
        await loadTemplates();
        alert('Template saved successfully!');
      } else {
        alert('Failed to save template');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const insertVariable = (variable: string) => {
    if (!editingTemplate) return;

    // Insert into subject line for now - could be enhanced to track cursor position
    setEditingTemplate({
      ...editingTemplate,
      subject: editingTemplate.subject + variable,
    });
  };

  const getMockPreviewData = () => {
    return {
      load: {
        id: 'FL-001',
        origin: { city: 'Miami', state: 'FL' },
        destination: { city: 'Atlanta', state: 'GA' },
        rate: '2800',
        distance: '662',
        pickupDate: 'Jan 20, 2024',
        deliveryDate: 'Jan 21, 2024',
        equipment: 'Dry Van',
        weight: '45,000 lbs',
        status: 'Available',
      },
      carrier: {
        company: 'ABC Trucking LLC',
        contactName: 'John Smith',
      },
      inquiry: {
        contactName: 'John Smith',
        company: 'ABC Trucking LLC',
      },
      tenant: {
        companyName: 'Your Company',
        phone: '(555) 123-4567',
        website: 'www.yourcompany.com',
      },
    };
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-8'>
          <h1 className='mb-2 text-3xl font-bold text-gray-900'>
            📧 Email Template Manager
          </h1>
          <p className='text-gray-600'>
            Customize email templates for your tenant: {tenantId}
          </p>
        </div>

        <div className='grid gap-8 lg:grid-cols-4'>
          {/* Template Selection */}
          <div className='lg:col-span-1'>
            <div className='rounded-lg border bg-white p-6 shadow-sm'>
              <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                Email Templates
              </h3>

              <div className='space-y-2'>
                {templateTypes.map((template) => (
                  <button
                    key={template.type}
                    onClick={() => setSelectedTemplate(template.type)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors ${
                      selectedTemplate === template.type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className='font-medium'>{template.label}</div>
                    <div className='mt-1 text-sm text-gray-500'>
                      {template.description}
                    </div>
                  </button>
                ))}
              </div>

              <div className='mt-6'>
                <h4 className='mb-2 font-medium text-gray-900'>
                  Available Variables
                </h4>
                <div className='max-h-64 space-y-1 overflow-y-auto'>
                  {(availableVariables[selectedTemplate] || []).map(
                    (variable) => (
                      <button
                        key={variable}
                        onClick={() => insertVariable(variable)}
                        className='block w-full rounded bg-gray-100 px-2 py-1 text-left text-xs transition-colors hover:bg-gray-200'
                      >
                        {variable}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Template Editor */}
          <div className='lg:col-span-3'>
            <div className='rounded-lg border bg-white p-6 shadow-sm'>
              <div className='mb-6 flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  Edit Template:{' '}
                  {
                    templateTypes.find((t) => t.type === selectedTemplate)
                      ?.label
                  }
                </h3>

                <div className='flex gap-2'>
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                      previewMode
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {previewMode ? 'Edit Mode' : 'Preview Mode'}
                  </button>

                  <button
                    onClick={saveTemplate}
                    disabled={saving || !editingTemplate}
                    className={`rounded-lg px-4 py-2 font-medium text-white transition-colors ${
                      saving || !editingTemplate
                        ? 'cursor-not-allowed bg-gray-400'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {saving ? 'Saving...' : 'Save Template'}
                  </button>
                </div>
              </div>

              {!previewMode && editingTemplate && (
                <div className='space-y-4'>
                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Subject Line
                    </label>
                    <input
                      type='text'
                      value={editingTemplate.subject}
                      onChange={(e) =>
                        setEditingTemplate({
                          ...editingTemplate,
                          subject: e.target.value,
                        })
                      }
                      className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                      placeholder='Email subject line...'
                    />
                  </div>

                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      HTML Content
                    </label>
                    <textarea
                      value={editingTemplate.htmlContent}
                      onChange={(e) =>
                        setEditingTemplate({
                          ...editingTemplate,
                          htmlContent: e.target.value,
                        })
                      }
                      rows={12}
                      className='w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                      placeholder='HTML email content...'
                    />
                  </div>

                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                      Plain Text Content
                    </label>
                    <textarea
                      value={editingTemplate.textContent}
                      onChange={(e) =>
                        setEditingTemplate({
                          ...editingTemplate,
                          textContent: e.target.value,
                        })
                      }
                      rows={8}
                      className='w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
                      placeholder='Plain text email content...'
                    />
                  </div>
                </div>
              )}

              {previewMode && editingTemplate && (
                <div className='space-y-4'>
                  <div className='rounded-lg border bg-gray-50 p-4'>
                    <h4 className='mb-2 font-medium text-gray-900'>
                      Preview with Sample Data
                    </h4>
                    <div className='text-sm text-gray-600'>
                      Subject:{' '}
                      {tenantEmailTemplateService['replaceVariables']?.(
                        editingTemplate.subject,
                        getMockPreviewData()
                      ) || editingTemplate.subject}
                    </div>
                  </div>

                  <div className='rounded-lg border p-4'>
                    <h4 className='mb-2 font-medium text-gray-900'>
                      HTML Preview
                    </h4>
                    <div
                      className='rounded border bg-white p-4'
                      dangerouslySetInnerHTML={{
                        __html:
                          tenantEmailTemplateService['replaceVariables']?.(
                            editingTemplate.htmlContent,
                            getMockPreviewData()
                          ) || editingTemplate.htmlContent,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
