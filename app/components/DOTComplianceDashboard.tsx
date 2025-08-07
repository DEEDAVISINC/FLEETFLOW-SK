'use client';

import React, { useState } from 'react';
import FleetFlowFooter from './FleetFlowFooter';

interface DOTComplianceProfile {
  carrierId: string;
  dotNumber: string;
  companyName: string;
  powerUnits: number;
  drivers: number;
  safetyRating: string;
  complianceScore: number;
  riskLevel: string;
  activeViolations: any[];
  nextAuditDue?: Date;
}

export default function DOTComplianceDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [complianceProfile, setComplianceProfile] =
    useState<DOTComplianceProfile | null>(null);
  const [alerts, setAlerts] = useState<{
    critical: string[];
    warnings: string[];
    upcoming: string[];
  }>({
    critical: [],
    warnings: [],
    upcoming: [],
  });
  const [loading, setLoading] = useState(false);
  const [dotNumber, setDotNumber] = useState('');

  // Document generation state
  const [documentType, setDocumentType] = useState('');
  const [documentParameters, setDocumentParameters] = useState('');
  const [generatedDocument, setGeneratedDocument] = useState('');
  const [documentLoading, setDocumentLoading] = useState(false);

  // Load compliance profile
  const loadComplianceProfile = async (dot: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/dot/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getProfile', dotNumber: dot }),
      });

      if (response.ok) {
        const data = await response.json();
        setComplianceProfile(data.profile);
        setAlerts(data.alerts);
      }
    } catch (error) {
      console.error('Error loading compliance profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate compliance document
  const generateDocument = async () => {
    if (!documentType) return;

    setDocumentLoading(true);
    try {
      const response = await fetch('/api/dot/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateDocument',
          documentType,
          parameters: JSON.parse(documentParameters || '{}'),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedDocument(data.document);
      }
    } catch (error) {
      console.error('Error generating document:', error);
    } finally {
      setDocumentLoading(false);
    }
  };

  // Get risk level color classes
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'MEDIUM':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'HIGH':
        return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'CRITICAL':
        return 'text-red-700 bg-red-100 border-red-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  // Get safety rating color classes
  const getSafetyRatingColor = (rating: string) => {
    switch (rating) {
      case 'SATISFACTORY':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'CONDITIONAL':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'UNSATISFACTORY':
        return 'text-red-700 bg-red-100 border-red-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-8'>
          <div className='mb-4 flex items-center gap-4'>
            <img
              src='/images/fleetflow logo tms.jpg'
              alt='FleetFlow Logo'
              className='h-8 w-8 object-contain'
              onError={(e) => {
                e.currentTarget.src = '/images/fleetflow logo tms.jpg';
              }}
            />
            <div>
              <h1 className='mb-2 text-3xl font-bold text-gray-900'>
                DOT Compliance Management
              </h1>
              <p className='text-gray-600'>
                Comprehensive FMCSA/DOT compliance automation and monitoring
              </p>
            </div>
          </div>
        </div>

        {/* DOT Number Input */}
        <div className='mb-6 rounded-lg border bg-white p-6 shadow-sm'>
          <div className='mb-4'>
            <h2 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
              🛡️ Compliance Profile Lookup
            </h2>
          </div>
          <div className='flex items-end gap-4'>
            <div className='flex-1'>
              <label className='mb-2 block text-sm font-medium'>
                DOT Number
              </label>
              <input
                type='text'
                className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                placeholder='Enter DOT number (e.g., 123456)'
                value={dotNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDotNumber(e.target.value)
                }
              />
            </div>
            <button
              onClick={() => loadComplianceProfile(dotNumber)}
              disabled={!dotNumber || loading}
              className='rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {loading ? 'Loading...' : 'Load Profile'}
            </button>
          </div>
        </div>

        {/* Compliance Alerts */}
        {(alerts.critical.length > 0 || alerts.warnings.length > 0) && (
          <div className='mb-6 grid gap-4 md:grid-cols-2'>
            {alerts.critical.length > 0 && (
              <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
                <div className='mb-2 flex items-center gap-2'>
                  <span className='text-red-600'>⚠️</span>
                  <span className='font-medium text-red-800'>
                    Critical Issues
                  </span>
                </div>
                <ul className='space-y-1 text-sm text-red-700'>
                  {alerts.critical.map((alert, idx) => (
                    <li key={idx}>• {alert}</li>
                  ))}
                </ul>
              </div>
            )}

            {alerts.warnings.length > 0 && (
              <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
                <div className='mb-2 flex items-center gap-2'>
                  <span className='text-yellow-600'>🕐</span>
                  <span className='font-medium text-yellow-800'>Warnings</span>
                </div>
                <ul className='space-y-1 text-sm text-yellow-700'>
                  {alerts.warnings.map((alert, idx) => (
                    <li key={idx}>• {alert}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        {complianceProfile && (
          <div>
            {/* Tab Navigation */}
            <div className='mb-6 border-b border-gray-200 bg-white'>
              <nav className='flex space-x-8 px-6'>
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'documents', label: 'Documents' },
                  { id: 'audits', label: 'Audits' },
                  { id: 'training', label: 'Training' },
                  { id: 'costs', label: 'Cost Analysis' },
                  { id: 'pricing', label: 'Service Pricing' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`border-b-2 px-1 py-4 text-sm font-medium ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className='space-y-6'>
                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
                  {/* Compliance Score */}
                  <div className='rounded-lg border bg-white p-6 shadow-sm'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium text-gray-600'>
                          Compliance Score
                        </p>
                        <p className='text-2xl font-bold text-green-600'>
                          {complianceProfile.complianceScore}%
                        </p>
                      </div>
                      <span className='text-2xl'>📈</span>
                    </div>
                    <div className='mt-4 h-2 rounded-full bg-gray-200'>
                      <div
                        className='h-2 rounded-full bg-green-600'
                        style={{
                          width: `${complianceProfile.complianceScore}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Safety Rating */}
                  <div className='rounded-lg border bg-white p-6 shadow-sm'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium text-gray-600'>
                          Safety Rating
                        </p>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getSafetyRatingColor(complianceProfile.safetyRating)}`}
                        >
                          {complianceProfile.safetyRating}
                        </span>
                      </div>
                      <span className='text-2xl'>🛡️</span>
                    </div>
                  </div>

                  {/* Fleet Size */}
                  <div className='rounded-lg border bg-white p-6 shadow-sm'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium text-gray-600'>
                          Fleet Size
                        </p>
                        <p className='text-2xl font-bold'>
                          {complianceProfile.powerUnits}
                        </p>
                        <p className='text-sm text-gray-500'>vehicles</p>
                      </div>
                      <span className='text-2xl'>🚛</span>
                    </div>
                  </div>

                  {/* Drivers */}
                  <div className='rounded-lg border bg-white p-6 shadow-sm'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='text-sm font-medium text-gray-600'>
                          Drivers
                        </p>
                        <p className='text-2xl font-bold'>
                          {complianceProfile.drivers}
                        </p>
                        <p className='text-sm text-gray-500'>active drivers</p>
                      </div>
                      <span className='text-2xl'>👥</span>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className='rounded-lg border bg-white p-6 shadow-sm'>
                  <h3 className='mb-4 text-lg font-semibold'>
                    Risk Assessment
                  </h3>
                  <div className='mb-4 flex items-center justify-between'>
                    <span className='text-sm font-medium'>
                      Current Risk Level:
                    </span>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getRiskColor(complianceProfile.riskLevel)}`}
                    >
                      {complianceProfile.riskLevel} RISK
                    </span>
                  </div>

                  <div className='grid gap-4 md:grid-cols-3'>
                    <div className='rounded-lg border border-green-200 bg-green-50 p-4 text-center'>
                      <span className='mb-2 block text-2xl'>✅</span>
                      <p className='font-medium'>Compliant Areas</p>
                      <p className='text-2xl font-bold text-green-600'>8</p>
                    </div>
                    <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center'>
                      <span className='mb-2 block text-2xl'>🕐</span>
                      <p className='font-medium'>Needs Attention</p>
                      <p className='text-2xl font-bold text-yellow-600'>2</p>
                    </div>
                    <div className='rounded-lg border border-red-200 bg-red-50 p-4 text-center'>
                      <span className='mb-2 block text-2xl'>⚠️</span>
                      <p className='font-medium'>Violations</p>
                      <p className='text-2xl font-bold text-red-600'>
                        {complianceProfile.activeViolations.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className='rounded-lg border bg-white p-6 shadow-sm'>
                <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
                  📄 AI-Powered Document Generation
                </h3>
                <div className='space-y-4'>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                      <label className='mb-2 block text-sm font-medium'>
                        Document Type
                      </label>
                      <select
                        value={documentType}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setDocumentType(e.target.value)
                        }
                        className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                      >
                        <option value=''>Select document type</option>
                        <option value='safety_policy'>Safety Policy</option>
                        <option value='drug_testing_policy'>
                          Drug Testing Policy
                        </option>
                        <option value='driver_qualification_file_checklist'>
                          Driver Qualification Checklist
                        </option>
                        <option value='maintenance_program'>
                          Maintenance Program
                        </option>
                        <option value='hours_of_service_policy'>
                          Hours of Service Policy
                        </option>
                        <option value='accident_procedures'>
                          Accident Procedures
                        </option>
                        <option value='new_driver_orientation'>
                          New Driver Orientation
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className='mb-2 block text-sm font-medium'>
                        Parameters (JSON)
                      </label>
                      <textarea
                        className='w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                        placeholder='{"drivers": 30, "vehicles": 25, "operationType": "interstate"}'
                        value={documentParameters}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setDocumentParameters(e.target.value)
                        }
                        rows={3}
                      />
                    </div>
                  </div>

                  <button
                    onClick={generateDocument}
                    disabled={!documentType || documentLoading}
                    className='w-full rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    {documentLoading ? 'Generating...' : 'Generate Document'}
                  </button>

                  {generatedDocument && (
                    <div className='mt-6'>
                      <div className='mb-4 flex items-center justify-between'>
                        <h3 className='text-lg font-medium'>
                          Generated Document
                        </h3>
                        <div className='flex gap-2'>
                          <button className='rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50'>
                            👁️ Preview
                          </button>
                          <button className='rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50'>
                            📥 Download
                          </button>
                        </div>
                      </div>
                      <div className='max-h-96 overflow-y-auto rounded-lg border bg-gray-50 p-4'>
                        <pre className='text-sm whitespace-pre-wrap'>
                          {generatedDocument}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <div className='space-y-6'>
                <div className='grid gap-6 md:grid-cols-3'>
                  <div className='rounded-lg border bg-white p-6 shadow-sm'>
                    <div className='mb-4 text-center'>
                      <h3 className='text-lg font-semibold'>
                        Compliance Starter
                      </h3>
                      <div className='mt-2'>
                        <span className='text-3xl font-bold'>$199</span>
                        <span className='text-gray-600'>/month</span>
                      </div>
                    </div>
                    <ul className='mb-6 space-y-2 text-sm'>
                      <li>✓ Basic compliance monitoring</li>
                      <li>✓ Document templates</li>
                      <li>✓ Monthly compliance reports</li>
                      <li>✓ Email alerts</li>
                      <li>✓ Up to 10 vehicles</li>
                      <li>✓ Up to 15 drivers</li>
                    </ul>
                    <button className='w-full rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700'>
                      Get Started
                    </button>
                  </div>

                  <div className='rounded-lg border-2 border-blue-500 bg-white p-6 shadow-lg'>
                    <div className='mb-2 text-center'>
                      <span className='rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800'>
                        Most Popular
                      </span>
                    </div>
                    <div className='mb-4 text-center'>
                      <h3 className='text-lg font-semibold'>
                        Compliance Professional
                      </h3>
                      <div className='mt-2'>
                        <span className='text-3xl font-bold'>$499</span>
                        <span className='text-gray-600'>/month</span>
                      </div>
                    </div>
                    <ul className='mb-6 space-y-2 text-sm'>
                      <li>✓ Full compliance automation</li>
                      <li>✓ AI-generated documents</li>
                      <li>✓ Real-time monitoring</li>
                      <li>✓ Audit preparation assistance</li>
                      <li>✓ Training management</li>
                      <li>✓ Violation tracking</li>
                      <li>✓ Up to 50 vehicles</li>
                      <li>✓ Up to 75 drivers</li>
                    </ul>
                    <button className='w-full rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700'>
                      Get Started
                    </button>
                  </div>

                  <div className='rounded-lg border bg-white p-6 shadow-sm'>
                    <div className='mb-4 text-center'>
                      <h3 className='text-lg font-semibold'>
                        Compliance Enterprise
                      </h3>
                      <div className='mt-2'>
                        <span className='text-3xl font-bold'>$999</span>
                        <span className='text-gray-600'>/month</span>
                      </div>
                    </div>
                    <ul className='mb-6 space-y-2 text-sm'>
                      <li>✓ Complete compliance management</li>
                      <li>✓ Custom document generation</li>
                      <li>✓ 24/7 monitoring & alerts</li>
                      <li>✓ Dedicated compliance consultant</li>
                      <li>✓ Audit representation</li>
                      <li>✓ Multi-location support</li>
                      <li>✓ API access</li>
                      <li>✓ Unlimited vehicles & drivers</li>
                    </ul>
                    <button className='w-full rounded-md bg-gray-600 px-6 py-2 text-white hover:bg-gray-700'>
                      Contact Sales
                    </button>
                  </div>
                </div>

                {/* Add-on Services */}
                <div className='rounded-lg border bg-white p-6 shadow-sm'>
                  <h3 className='mb-4 text-lg font-semibold'>
                    Add-on Services
                  </h3>
                  <div className='grid gap-4 md:grid-cols-3'>
                    <div className='rounded-lg border p-4'>
                      <h4 className='mb-2 font-medium'>Audit Representation</h4>
                      <p className='mb-2 text-2xl font-bold'>$2,500</p>
                      <p className='text-sm text-gray-600'>
                        Professional representation during DOT audits
                      </p>
                    </div>
                    <div className='rounded-lg border p-4'>
                      <h4 className='mb-2 font-medium'>
                        Custom Training Development
                      </h4>
                      <p className='mb-2 text-2xl font-bold'>$1,500</p>
                      <p className='text-sm text-gray-600'>
                        Custom compliance training programs for your fleet
                      </p>
                    </div>
                    <div className='rounded-lg border p-4'>
                      <h4 className='mb-2 font-medium'>Violation Defense</h4>
                      <p className='mb-2 text-2xl font-bold'>$500</p>
                      <p className='text-sm text-gray-600'>
                        Per-violation professional defense and mitigation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs content can be added here */}
            {activeTab === 'audits' && (
              <div className='rounded-lg border bg-white p-6 shadow-sm'>
                <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
                  📅 Compliance Audits
                </h3>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between rounded-lg border p-4'>
                    <div>
                      <h4 className='font-medium'>Last Compliance Review</h4>
                      <p className='text-sm text-gray-600'>March 15, 2023</p>
                      <span className='mt-2 inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800'>
                        SATISFACTORY
                      </span>
                    </div>
                    <button className='rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50'>
                      View Report
                    </button>
                  </div>

                  <div className='flex items-center justify-between rounded-lg border p-4'>
                    <div>
                      <h4 className='font-medium'>Next Audit Due</h4>
                      <p className='text-sm text-gray-600'>
                        {complianceProfile.nextAuditDue?.toLocaleDateString() ||
                          'March 15, 2025'}
                      </p>
                      <span className='mt-2 inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800'>
                        SCHEDULED
                      </span>
                    </div>
                    <button className='rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'>
                      Prepare Audit
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'training' && (
              <div className='rounded-lg border bg-white p-6 shadow-sm'>
                <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
                  📚 Compliance Training Programs
                </h3>
                <div className='grid gap-4 md:grid-cols-2'>
                  <div className='rounded-lg border p-4'>
                    <h4 className='mb-2 font-medium'>DOT Safety Regulations</h4>
                    <p className='mb-3 text-sm text-gray-600'>
                      Comprehensive overview of DOT safety regulations for
                      commercial drivers
                    </p>
                    <div className='flex items-center justify-between'>
                      <span className='inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800'>
                        Required: Annually
                      </span>
                      <button className='rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700'>
                        Start Training
                      </button>
                    </div>
                  </div>

                  <div className='rounded-lg border p-4'>
                    <h4 className='mb-2 font-medium'>
                      Driver Qualification Requirements
                    </h4>
                    <p className='mb-3 text-sm text-gray-600'>
                      Current driver qualification and licensing requirements
                    </p>
                    <div className='flex items-center justify-between'>
                      <span className='inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800'>
                        Required: Annually
                      </span>
                      <button className='rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700'>
                        Start Training
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'costs' && (
              <div className='rounded-lg border bg-white p-6 shadow-sm'>
                <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
                  💰 Compliance Cost Analysis
                </h3>
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                  <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 text-center'>
                    <p className='font-medium text-blue-800'>
                      Preventive Costs
                    </p>
                    <p className='text-2xl font-bold text-blue-600'>$15,200</p>
                    <p className='text-sm text-blue-600'>Annual</p>
                  </div>
                  <div className='rounded-lg border border-red-200 bg-red-50 p-4 text-center'>
                    <p className='font-medium text-red-800'>Violation Costs</p>
                    <p className='text-2xl font-bold text-red-600'>$3,500</p>
                    <p className='text-sm text-red-600'>Current Year</p>
                  </div>
                  <div className='rounded-lg border border-green-200 bg-green-50 p-4 text-center'>
                    <p className='font-medium text-green-800'>
                      Potential Savings
                    </p>
                    <p className='text-2xl font-bold text-green-600'>$22,500</p>
                    <p className='text-sm text-green-600'>Projected</p>
                  </div>
                  <div className='rounded-lg border border-purple-200 bg-purple-50 p-4 text-center'>
                    <p className='font-medium text-purple-800'>
                      ROI Projection
                    </p>
                    <p className='text-2xl font-bold text-purple-600'>48%</p>
                    <p className='text-sm text-purple-600'>Annual</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Default state when no profile loaded */}
        {!complianceProfile && !loading && (
          <div className='rounded-lg border bg-white py-12 text-center shadow-sm'>
            <div className='mx-auto max-w-4xl px-6'>
              <span className='mb-4 block text-6xl'>🛡️</span>
              <h3 className='mb-2 text-lg font-medium text-gray-900'>
                DOT Compliance Management
              </h3>
              <p className='mb-8 text-gray-600'>
                Enter a DOT number above to load a compliance profile and access
                our comprehensive compliance management tools.
              </p>
              <div className='grid gap-4 text-left md:grid-cols-2 lg:grid-cols-4'>
                <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
                  <span className='mb-2 block text-2xl'>📄</span>
                  <h4 className='font-medium'>Document Generation</h4>
                  <p className='text-sm text-gray-600'>
                    AI-powered compliance documents
                  </p>
                </div>
                <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
                  <span className='mb-2 block text-2xl'>🔍</span>
                  <h4 className='font-medium'>Real-time Monitoring</h4>
                  <p className='text-sm text-gray-600'>
                    24/7 compliance monitoring
                  </p>
                </div>
                <div className='rounded-lg border border-purple-200 bg-purple-50 p-4'>
                  <span className='mb-2 block text-2xl'>📚</span>
                  <h4 className='font-medium'>Training Programs</h4>
                  <p className='text-sm text-gray-600'>
                    Automated compliance training
                  </p>
                </div>
                <div className='rounded-lg border border-orange-200 bg-orange-50 p-4'>
                  <span className='mb-2 block text-2xl'>💰</span>
                  <h4 className='font-medium'>Cost Optimization</h4>
                  <p className='text-sm text-gray-600'>
                    Reduce compliance costs
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <FleetFlowFooter variant='light' />
      </div>
    </div>
  );
}
