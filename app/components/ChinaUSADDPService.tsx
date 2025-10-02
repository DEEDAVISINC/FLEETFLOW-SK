'use client';

import React, { useEffect, useState } from 'react';
import { automatedScraperService } from '../services/AutomatedImportYetiScraperService';
import {
  AIStaffAction,
  Big5CollectionStatus,
  DDPInquiry,
  ddpAutomationService,
} from '../services/ChinaUSADDPAutomationService';
import {
  DDPLead,
  LeadGenActivity,
  ddpLeadGenService,
} from '../services/DDPLeadGenerationService';

// Main Component
export default function ChinaUSADDPService() {
  const [activeView, setActiveView] = useState<'leads' | 'inquiries'>('leads');
  const [leads, setLeads] = useState<DDPLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [leadActivities, setLeadActivities] = useState<LeadGenActivity[]>([]);
  const [activeInquiries, setActiveInquiries] = useState<DDPInquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<string | null>(null);
  const [staffActions, setStaffActions] = useState<AIStaffAction[]>([]);
  const [isNewInquiryModalOpen, setIsNewInquiryModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [scraperStatus, setScraperStatus] = useState(
    automatedScraperService.getStatus()
  );
  const [showGuide, setShowGuide] = useState(false);

  // Refresh data every 5 seconds to show automation updates
  useEffect(() => {
    const refreshData = () => {
      // Lead data
      const allLeads = ddpLeadGenService.getAllLeads();
      setLeads(allLeads);

      if (selectedLead) {
        const activities = ddpLeadGenService.getLeadActivities(selectedLead);
        setLeadActivities(activities);
      }

      // Inquiry data
      const inquiries = ddpAutomationService.getActiveInquiries();
      setActiveInquiries(inquiries);

      if (selectedInquiry) {
        const actions = ddpAutomationService.getAIActions(selectedInquiry);
        setStaffActions(actions);
      }

      // Scraper status
      setScraperStatus(automatedScraperService.getStatus());
    };

    refreshData();
    const interval = setInterval(refreshData, 5000);

    // Start automated scraper on mount
    automatedScraperService.startAutomatedScraping();

    return () => clearInterval(interval);
  }, [selectedLead, selectedInquiry]);

  const handleNewInquiry = async (data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    productCategory?: 'steel' | 'metal' | 'aluminum' | 'other';
    estimatedContainers?: number;
  }) => {
    const inquiry: DDPInquiry = {
      id: `INQ-${Date.now()}`,
      ...data,
      source: 'website',
      createdAt: new Date(),
      status: 'new',
    };

    await ddpAutomationService.handleNewInquiry(inquiry);
    setIsNewInquiryModalOpen(false);
  };

  const handleCSVUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const text = await file.text();
      const companies = parseCSV(text);

      console.log(`📤 Uploading ${companies.length} companies from CSV...`);

      // Send to API
      const response = await fetch('/api/import-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: 'csv_upload',
          companies: companies,
        }),
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Process through lead generation service
      for (const company of companies) {
        const lead: DDPLead = {
          id: `LEAD-CSV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          companyName: company.name,
          contactName: company.contactName || 'Contact',
          email:
            company.email ||
            `contact@${company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          phone: company.phone || '',
          industry: determineIndustry(company.productDescription),
          productCategory: determineProductCategory(company.productDescription),
          estimatedMonthlyContainers: company.estimatedMonthlyContainers || 2,
          currentShippingPain: 'High customs costs and coordination complexity',
          leadScore: 75,
          source: 'customs_data',
          status: 'new',
          createdAt: new Date(),
          notes: [
            `Imported from CSV: ${file.name}`,
            company.supplierName ? `Supplier: ${company.supplierName}` : '',
            company.shipmentCount ? `${company.shipmentCount} shipments` : '',
          ].filter(Boolean),
        };

        ddpLeadGenService.addLead(lead);
      }

      alert(`✅ Successfully imported ${companies.length} leads from CSV!`);

      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('CSV upload error:', error);
      alert('❌ Error uploading CSV. Please check the format.');
    } finally {
      setIsUploading(false);
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter((line) => line.trim());
    const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));

    return lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim().replace(/"/g, ''));
      const obj: any = {};

      headers.forEach((header, index) => {
        const key = header.toLowerCase().replace(/\s+/g, '');
        obj[key] = values[index] || '';
      });

      return {
        name: obj.companyname || obj.name || '',
        contactName: obj.contactname || '',
        address: obj.address || '',
        city: obj.city || '',
        state: obj.state || '',
        zipCode: obj.zipcode || obj.zip || '',
        productDescription: obj.productdescription || obj.product || '',
        supplierName: obj.suppliername || obj.supplier || '',
        supplierCountry: obj.suppliercountry || 'China',
        shipmentCount: parseInt(obj.shipmentcount || '0'),
        lastShipmentDate: obj.lastshipmentdate || '',
        phone: obj.phone || '',
        email: obj.email || '',
        website: obj.website || '',
        estimatedMonthlyContainers: parseInt(
          obj.estimatedmonthlycontainers || '2'
        ),
      };
    });
  };

  const determineIndustry = (productDescription: string): string => {
    const desc = productDescription.toLowerCase();
    if (desc.includes('steel') || desc.includes('rebar'))
      return 'Steel Manufacturing';
    if (desc.includes('aluminum') || desc.includes('aluminium'))
      return 'Aluminum Processing';
    if (desc.includes('metal') || desc.includes('iron'))
      return 'Metal Fabrication';
    if (desc.includes('construction') || desc.includes('building'))
      return 'Construction Materials';
    return 'Manufacturing';
  };

  const determineProductCategory = (
    productDescription: string
  ): 'steel' | 'metal' | 'aluminum' | 'other' => {
    const desc = productDescription.toLowerCase();
    if (desc.includes('steel')) return 'steel';
    if (desc.includes('aluminum') || desc.includes('aluminium'))
      return 'aluminum';
    if (desc.includes('metal')) return 'metal';
    return 'other';
  };

  // Stats calculation
  const leadStats = ddpLeadGenService.getLeadStats();
  const inquiryStats = {
    active: activeInquiries.length,
    collectingBig5: activeInquiries.filter(
      (i) => i.status === 'collecting_big5' || i.status === 'assigned'
    ).length,
    quoted: activeInquiries.filter((i) => i.status === 'quoted').length,
    awaitingPayment: activeInquiries.filter(
      (i) => i.status === 'payment_pending'
    ).length,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(to bottom right, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
        padding: '2rem',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#f1f5f9',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <span>🚢</span>
              China → USA DDP - AI Lead Generation
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Marcus Chen automatically finding, qualifying & converting US
              importers
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '0.25rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.85rem',
                  color: '#10b981',
                  fontWeight: '600',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>🤖</span> FULLY AUTOMATED
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  color: scraperStatus.isRunning ? '#10b981' : '#94a3b8',
                }}
              >
                {scraperStatus.isRunning
                  ? '⚡ Scraping now...'
                  : `📅 Scrapes every ${scraperStatus.scheduleIntervalMinutes}min`}
              </div>
            </div>
            <button
              onClick={() => automatedScraperService.runManually()}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(16, 185, 129, 0.5)',
                color: 'white',
                borderRadius: '0.5rem',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              🎯 Scrape Now
            </button>
            <label
              style={{
                padding: '0.75rem 1.5rem',
                background: isUploading
                  ? 'rgba(71, 85, 105, 0.3)'
                  : 'rgba(59, 130, 246, 0.5)',
                color: 'white',
                borderRadius: '0.5rem',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {isUploading ? '⏳' : '📤'}{' '}
              {isUploading ? 'Uploading...' : 'Upload CSV'}
              <input
                type='file'
                accept='.csv'
                onChange={handleCSVUpload}
                disabled={isUploading}
                style={{ display: 'none' }}
              />
            </label>
            <button
              onClick={() => setIsNewInquiryModalOpen(true)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(71, 85, 105, 0.5)',
                color: 'white',
                borderRadius: '0.5rem',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              + Manual Inquiry
            </button>
            <button
              onClick={() => setShowGuide(!showGuide)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(59, 130, 246, 0.5)',
                color: 'white',
                borderRadius: '0.5rem',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              📖 {showGuide ? 'Hide' : 'How It Works'}
            </button>
          </div>
        </div>

        {/* Competitive Advantages Banner */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '0.75rem',
            padding: '1rem 1.5rem',
            display: 'flex',
            gap: '2rem',
          }}
        >
          <div>
            <span
              style={{
                color: '#10b981',
                fontWeight: '600',
                fontSize: '0.9rem',
              }}
            >
              ✅ One Invoice
            </span>
            <p
              style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                marginTop: '0.25rem',
              }}
            >
              All costs included
            </p>
          </div>
          <div>
            <span
              style={{
                color: '#10b981',
                fontWeight: '600',
                fontSize: '0.9rem',
              }}
            >
              ✅ One Touchpoint
            </span>
            <p
              style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                marginTop: '0.25rem',
              }}
            >
              Marcus manages everything
            </p>
          </div>
          <div>
            <span
              style={{
                color: '#10b981',
                fontWeight: '600',
                fontSize: '0.9rem',
              }}
            >
              ✅ Reduced Total Cost
            </span>
            <p
              style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                marginTop: '0.25rem',
              }}
            >
              No surprise fees
            </p>
          </div>
          <div>
            <span
              style={{
                color: '#f59e0b',
                fontWeight: '600',
                fontSize: '0.9rem',
              }}
            >
              ⚡ 40HQ Preferred
            </span>
            <p
              style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                marginTop: '0.25rem',
              }}
            >
              Best for heavy products
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Guide */}
      {showGuide && (
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '2px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '2rem',
          }}
        >
          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#3b82f6',
              marginBottom: '1rem',
            }}
          >
            🚢 How the China-USA DDP System Works
          </h3>
          <p
            style={{ color: '#94a3b8', marginBottom: '2rem', fontSize: '1rem' }}
          >
            This is an <strong>automated sales machine</strong> that finds US
            companies importing from China, contacts them, qualifies their
            interest, and converts them into paying DDP customers -
            <strong> all automatically while you sleep</strong>.
          </p>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Step 1 */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <span
                  style={{
                    fontSize: '2rem',
                    background: 'rgba(59, 130, 246, 0.2)',
                    width: '3rem',
                    height: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                  }}
                >
                  🔍
                </span>
                <div>
                  <h4
                    style={{
                      color: '#3b82f6',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    Step 1: Finding Leads (Automatic)
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    Every 24 hours
                  </p>
                </div>
              </div>
              <ul
                style={{
                  color: '#94a3b8',
                  fontSize: '0.95rem',
                  lineHeight: '1.8',
                  paddingLeft: '1.5rem',
                }}
              >
                <li>
                  Marcus Chen (your AI staff) scrapes ImportYeti.com for US
                  companies importing steel, metal, aluminum from China
                </li>
                <li>
                  Finds their contact info, shipment history, and product
                  details
                </li>
                <li>Adds them to your "Lead Generation Pipeline"</li>
              </ul>
              <p
                style={{
                  color: '#10b981',
                  fontSize: '0.9rem',
                  marginTop: '1rem',
                  fontWeight: '600',
                }}
              >
                ✅ You see: New companies appearing in the "Lead Pipeline" tab
              </p>
            </div>

            {/* Step 2 */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <span
                  style={{
                    fontSize: '2rem',
                    background: 'rgba(16, 185, 129, 0.2)',
                    width: '3rem',
                    height: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                  }}
                >
                  📧
                </span>
                <div>
                  <h4
                    style={{
                      color: '#10b981',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    Step 2: Automated Outreach
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    Marcus handles this
                  </p>
                </div>
              </div>
              <ul
                style={{
                  color: '#94a3b8',
                  fontSize: '0.95rem',
                  lineHeight: '1.8',
                  paddingLeft: '1.5rem',
                }}
              >
                <li>
                  Marcus sends personalized emails highlighting the 95% tariff
                  problem
                </li>
                <li>
                  Emphasizes your competitive advantage: One invoice, one
                  touchpoint, lower costs
                </li>
                <li>Lead status changes from "new" → "contacted"</li>
              </ul>
              <p
                style={{
                  color: '#10b981',
                  fontSize: '0.9rem',
                  marginTop: '1rem',
                  fontWeight: '600',
                }}
              >
                ✅ You see: Lead status updates and Marcus's activity in the
                right panel
              </p>
            </div>

            {/* Step 3 */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <span
                  style={{
                    fontSize: '2rem',
                    background: 'rgba(245, 158, 11, 0.2)',
                    width: '3rem',
                    height: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                  }}
                >
                  🎯
                </span>
                <div>
                  <h4
                    style={{
                      color: '#f59e0b',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    Step 3: Qualification & Conversion
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    Automated follow-up
                  </p>
                </div>
              </div>
              <ul
                style={{
                  color: '#94a3b8',
                  fontSize: '0.95rem',
                  lineHeight: '1.8',
                  paddingLeft: '1.5rem',
                }}
              >
                <li>
                  When leads respond, Marcus qualifies them based on engagement
                </li>
                <li>High-interest leads move to "qualified" → "converted"</li>
                <li>Converted leads create an "Active Shipment" (inquiry)</li>
              </ul>
              <p
                style={{
                  color: '#10b981',
                  fontSize: '0.9rem',
                  marginTop: '1rem',
                  fontWeight: '600',
                }}
              >
                ✅ You see: Leads moving through the pipeline, conversion
                metrics in the stats
              </p>
            </div>

            {/* Step 4 */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <span
                  style={{
                    fontSize: '2rem',
                    background: 'rgba(139, 92, 246, 0.2)',
                    width: '3rem',
                    height: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                  }}
                >
                  📦
                </span>
                <div>
                  <h4
                    style={{
                      color: '#8b5cf6',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    Step 4: "Big 5" Collection
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    Required data for quote
                  </p>
                </div>
              </div>
              <p
                style={{
                  color: '#94a3b8',
                  fontSize: '0.95rem',
                  lineHeight: '1.8',
                  marginBottom: '1rem',
                }}
              >
                Marcus automatically collects these 5 critical data points:
              </p>
              <ol
                style={{
                  color: '#94a3b8',
                  fontSize: '0.95rem',
                  lineHeight: '1.8',
                  paddingLeft: '1.5rem',
                }}
              >
                <li>
                  <strong>Exact China pickup address</strong>
                </li>
                <li>
                  <strong>Exact USA drop-off address</strong>
                </li>
                <li>
                  <strong>Product HTS, description, and picture</strong>
                </li>
                <li>
                  <strong>Shipment timing (when they need to move)</strong>
                </li>
                <li>
                  <strong>Container quantity and type (40HQ preferred)</strong>
                </li>
              </ol>
              <p
                style={{
                  color: '#10b981',
                  fontSize: '0.9rem',
                  marginTop: '1rem',
                  fontWeight: '600',
                }}
              >
                ✅ You see: Progress bars for each data point in "Active
                Shipments"
              </p>
            </div>

            {/* Step 5 */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <span
                  style={{
                    fontSize: '2rem',
                    background: 'rgba(236, 72, 153, 0.2)',
                    width: '3rem',
                    height: '3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                  }}
                >
                  💰
                </span>
                <div>
                  <h4
                    style={{
                      color: '#ec4899',
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    Step 5: Quote & Payment
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    Automated generation
                  </p>
                </div>
              </div>
              <ul
                style={{
                  color: '#94a3b8',
                  fontSize: '0.95rem',
                  lineHeight: '1.8',
                  paddingLeft: '1.5rem',
                }}
              >
                <li>
                  Once "Big 5" is complete, Marcus auto-generates a DDP quote
                </li>
                <li>
                  First 3 months: Prepayment required (you collect upfront)
                </li>
                <li>
                  After 3 months: NET-30/60 payment terms (you get paid on
                  delivery)
                </li>
                <li>Marcus monitors payments and sends reminders</li>
              </ul>
              <p
                style={{
                  color: '#10b981',
                  fontSize: '0.9rem',
                  marginTop: '1rem',
                  fontWeight: '600',
                }}
              >
                ✅ You see: Quote generated, payment status, and automated
                reminders
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '0.75rem',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <h4
              style={{
                color: '#10b981',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              🎉 What You Need To Do
            </h4>
            <ul
              style={{
                color: '#94a3b8',
                fontSize: '1rem',
                lineHeight: '2',
                paddingLeft: '1.5rem',
              }}
            >
              <li>
                <strong>Monitor the dashboard</strong> - Watch Marcus work in
                real-time
              </li>
              <li>
                <strong>Jump in when needed</strong> - Handle complex
                negotiations or special cases
              </li>
              <li>
                <strong>Add leads manually</strong> - Use "Upload CSV" or the
                Chrome extension for ImportYeti scraping
              </li>
              <li>
                <strong>Adjust pricing</strong> - Modify container rates and
                tariff multipliers in the system
              </li>
            </ul>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={() => setShowGuide(false)}
              style={{
                padding: '0.75rem 2rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Got It! Let's Get Started 🚀
            </button>
          </div>
        </div>
      )}

      {/* Pipeline Navigation */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => setActiveView('leads')}
          style={{
            padding: '0.75rem 1.5rem',
            background:
              activeView === 'leads'
                ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                : 'rgba(71, 85, 105, 0.3)',
            color: 'white',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          🎯 Lead Generation Pipeline
        </button>
        <button
          onClick={() => setActiveView('inquiries')}
          style={{
            padding: '0.75rem 1.5rem',
            background:
              activeView === 'inquiries'
                ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                : 'rgba(71, 85, 105, 0.3)',
            color: 'white',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          📦 Active Shipments
        </button>
      </div>

      {/* Stats Grid */}
      {activeView === 'leads' ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <StatCard
            icon='🎯'
            label='Total Leads'
            value={leadStats.total}
            color='#3b82f6'
          />
          <StatCard
            icon='📧'
            label='Contacted'
            value={leadStats.contacted}
            color='#8b5cf6'
          />
          <StatCard
            icon='✅'
            label='Qualified'
            value={leadStats.qualified}
            color='#10b981'
          />
          <StatCard
            icon='🎉'
            label='Converted'
            value={leadStats.converted}
            color='#22c55e'
          />
          <StatCard
            icon='⚡'
            label='High Value (95% Tariff)'
            value={leadStats.highValue}
            color='#ef4444'
          />
          <StatCard
            icon='📊'
            label='Active Quotes'
            value={inquiryStats.quoted}
            color='#f59e0b'
          />
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          <StatCard
            icon='📊'
            label='Active Shipments'
            value={inquiryStats.active}
            color='#3b82f6'
          />
          <StatCard
            icon='📝'
            label='Collecting Big 5'
            value={inquiryStats.collectingBig5}
            color='#f59e0b'
          />
          <StatCard
            icon='💵'
            label='Quotes Generated'
            value={inquiryStats.quoted}
            color='#10b981'
          />
          <StatCard
            icon='⏳'
            label='Awaiting Payment'
            value={inquiryStats.awaitingPayment}
            color='#ef4444'
          />
        </div>
      )}

      {/* Main Content: Split View */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
        }}
      >
        {/* Left: Leads or Inquiry Pipeline */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(71, 85, 105, 0.5)',
            borderRadius: '1rem',
            padding: '1.5rem',
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#f1f5f9',
              marginBottom: '1rem',
            }}
          >
            {activeView === 'leads'
              ? '🎯 Lead Pipeline'
              : '📦 Inquiry Pipeline'}
          </h2>

          {activeView === 'leads' ? (
            leads.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem',
                  color: '#64748b',
                }}
              >
                <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤖</p>
                <p>Marcus is searching for leads...</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  New prospects found every 3 minutes
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {leads.slice(0, 10).map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    isSelected={selectedLead === lead.id}
                    onClick={() => {
                      setSelectedLead(lead.id);
                      setSelectedInquiry(null);
                    }}
                  />
                ))}
              </div>
            )
          ) : activeInquiries.length === 0 ? (
            <div
              style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}
            >
              <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚢</p>
              <p>No active shipments</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Leads will convert to shipments automatically
              </p>
            </div>
          ) : (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {activeInquiries.map((inquiry) => (
                <InquiryCard
                  key={inquiry.id}
                  inquiry={inquiry}
                  isSelected={selectedInquiry === inquiry.id}
                  onClick={() => {
                    setSelectedInquiry(inquiry.id);
                    setSelectedLead(null);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: AI Staff Activity */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(71, 85, 105, 0.5)',
            borderRadius: '1rem',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            <span style={{ fontSize: '2rem' }}>🚢</span>
            <div>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#f1f5f9',
                }}
              >
                Marcus Chen's Activity
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                International Freight & Customs Specialist
              </p>
            </div>
          </div>

          {!selectedLead && !selectedInquiry ? (
            <div
              style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}
            >
              <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👈</p>
              <p>Select a lead or shipment to view AI activity</p>
            </div>
          ) : selectedLead ? (
            <LeadActivity leadId={selectedLead} activities={leadActivities} />
          ) : (
            <div>
              {/* Big 5 Progress */}
              <Big5Progress inquiryId={selectedInquiry!} />

              {/* AI Actions Timeline */}
              <div style={{ marginTop: '1.5rem' }}>
                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#f1f5f9',
                    marginBottom: '1rem',
                  }}
                >
                  Automated Actions
                </h3>
                {staffActions.length === 0 ? (
                  <p
                    style={{
                      color: '#64748b',
                      fontSize: '0.9rem',
                      fontStyle: 'italic',
                    }}
                  >
                    No actions yet...
                  </p>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      maxHeight: '400px',
                      overflowY: 'auto',
                    }}
                  >
                    {staffActions.map((action) => (
                      <AIActionItem key={action.id} action={action} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Inquiry Modal */}
      {isNewInquiryModalOpen && (
        <NewInquiryModal
          onClose={() => setIsNewInquiryModalOpen(false)}
          onSubmit={handleNewInquiry}
        />
      )}
    </div>
  );
}

// Helper Components
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      style={{
        background: 'rgba(30, 41, 59, 0.6)',
        border: '1px solid rgba(71, 85, 105, 0.5)',
        borderRadius: '0.75rem',
        padding: '1.25rem',
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div
        style={{
          fontSize: '0.85rem',
          color: '#94a3b8',
          marginBottom: '0.5rem',
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color }}>{value}</div>
    </div>
  );
}

function InquiryCard({
  inquiry,
  isSelected,
  onClick,
}: {
  inquiry: DDPInquiry;
  isSelected: boolean;
  onClick: () => void;
}) {
  const statusColors = {
    new: '#3b82f6',
    assigned: '#8b5cf6',
    collecting_big5: '#f59e0b',
    ready_for_quote: '#06b6d4',
    quoted: '#10b981',
    payment_pending: '#ef4444',
    confirmed: '#22c55e',
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected
          ? 'rgba(59, 130, 246, 0.1)'
          : 'rgba(15, 23, 42, 0.6)',
        border: `1px solid ${isSelected ? '#3b82f6' : 'rgba(71, 85, 105, 0.5)'}`,
        borderRadius: '0.75rem',
        padding: '1rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: '0.75rem',
        }}
      >
        <div>
          <div
            style={{
              fontWeight: '600',
              color: '#f1f5f9',
              marginBottom: '0.25rem',
            }}
          >
            {inquiry.customerName}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {inquiry.customerEmail}
          </div>
        </div>
        <div
          style={{
            background: statusColors[inquiry.status],
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.75rem',
            fontWeight: '600',
          }}
        >
          {inquiry.status.replace(/_/g, ' ').toUpperCase()}
        </div>
      </div>

      {inquiry.productCategory && (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Product:
          </span>
          <span
            style={{
              fontSize: '0.85rem',
              color:
                inquiry.productCategory === 'steel' ||
                inquiry.productCategory === 'metal' ||
                inquiry.productCategory === 'aluminum'
                  ? '#ef4444'
                  : '#10b981',
              fontWeight: '600',
            }}
          >
            {inquiry.productCategory.toUpperCase()}
            {(inquiry.productCategory === 'steel' ||
              inquiry.productCategory === 'metal' ||
              inquiry.productCategory === 'aluminum') &&
              ' (95% TARIFF)'}
          </span>
        </div>
      )}

      {inquiry.estimatedContainers && (
        <div
          style={{
            fontSize: '0.85rem',
            color: '#94a3b8',
            marginTop: '0.25rem',
          }}
        >
          Containers: {inquiry.estimatedContainers}
        </div>
      )}
    </div>
  );
}

function Big5Progress({ inquiryId }: { inquiryId: string }) {
  const [big5, setBig5] = useState<Big5CollectionStatus | undefined>(undefined);

  useEffect(() => {
    const refresh = () => {
      const status = ddpAutomationService.getBig5Status(inquiryId);
      setBig5(status);
    };

    refresh();
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, [inquiryId]);

  if (!big5) return null;

  const items = [
    { label: 'China Pickup Address', complete: big5.chinaAddress },
    { label: 'USA Delivery Address', complete: big5.usaAddress },
    {
      label: 'Product Details (HTS, Description, Photos)',
      complete: big5.productDetails,
    },
    { label: 'Shipment Timing', complete: big5.timing },
    { label: 'Container Quantity & Type', complete: big5.containerInfo },
  ];

  const completedCount = items.filter((i) => i.complete).length;
  const progress = (completedCount / items.length) * 100;

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
          }}
        >
          <span
            style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f1f5f9' }}
          >
            Big 5 Collection Progress
          </span>
          <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            {completedCount}/5
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '0.5rem',
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '0.25rem',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10b981, #059669)',
              transition: 'width 0.3s',
            }}
          ></div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <div style={{ fontSize: '1.25rem' }}>
              {item.complete ? '✅' : '⏳'}
            </div>
            <span
              style={{
                fontSize: '0.85rem',
                color: item.complete ? '#10b981' : '#94a3b8',
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIActionItem({ action }: { action: AIStaffAction }) {
  const icons = {
    email_sent: '📧',
    follow_up: '🔄',
    quote_generated: '💵',
    payment_reminder: '💰',
    status_update: '📊',
  };

  const timeAgo = getTimeAgo(action.timestamp);

  return (
    <div
      style={{
        background: action.automated
          ? 'rgba(16, 185, 129, 0.1)'
          : 'rgba(59, 130, 246, 0.1)',
        border: `1px solid ${action.automated ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
        borderRadius: '0.5rem',
        padding: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'start' }}>
        <div style={{ fontSize: '1.5rem' }}>{icons[action.actionType]}</div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '0.9rem',
              color: '#f1f5f9',
              marginBottom: '0.25rem',
            }}
          >
            {action.description}
          </div>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              fontSize: '0.75rem',
              color: '#94a3b8',
            }}
          >
            <span>{timeAgo}</span>
            {action.automated && (
              <span style={{ color: '#10b981', fontWeight: '600' }}>
                🤖 AUTOMATED
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewInquiryModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    productCategory: 'other' as 'steel' | 'metal' | 'aluminum' | 'other',
    estimatedContainers: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.95)',
          border: '1px solid rgba(71, 85, 105, 0.5)',
          borderRadius: '1rem',
          padding: '2rem',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#f1f5f9',
            marginBottom: '1.5rem',
          }}
        >
          New DDP Inquiry
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.9rem',
                color: '#94a3b8',
                marginBottom: '0.5rem',
              }}
            >
              Customer Name *
            </label>
            <input
              type='text'
              required
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '0.5rem',
                color: '#f1f5f9',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.9rem',
                color: '#94a3b8',
                marginBottom: '0.5rem',
              }}
            >
              Email *
            </label>
            <input
              type='email'
              required
              value={formData.customerEmail}
              onChange={(e) =>
                setFormData({ ...formData, customerEmail: e.target.value })
              }
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '0.5rem',
                color: '#f1f5f9',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.9rem',
                color: '#94a3b8',
                marginBottom: '0.5rem',
              }}
            >
              Phone *
            </label>
            <input
              type='tel'
              required
              value={formData.customerPhone}
              onChange={(e) =>
                setFormData({ ...formData, customerPhone: e.target.value })
              }
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '0.5rem',
                color: '#f1f5f9',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.9rem',
                color: '#94a3b8',
                marginBottom: '0.5rem',
              }}
            >
              Product Category
            </label>
            <select
              value={formData.productCategory}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  productCategory: e.target.value as any,
                })
              }
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '0.5rem',
                color: '#f1f5f9',
                fontSize: '0.95rem',
              }}
            >
              <option value='steel'>Steel (⚠️ 95% TARIFF)</option>
              <option value='metal'>Metal (⚠️ 95% TARIFF)</option>
              <option value='aluminum'>Aluminum (⚠️ 95% TARIFF)</option>
              <option value='other'>Other Products</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.9rem',
                color: '#94a3b8',
                marginBottom: '0.5rem',
              }}
            >
              Estimated Containers
            </label>
            <input
              type='number'
              min='1'
              value={formData.estimatedContainers}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  estimatedContainers: parseInt(e.target.value),
                })
              }
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(71, 85, 105, 0.5)',
                borderRadius: '0.5rem',
                color: '#f1f5f9',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <div
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <p
              style={{
                fontSize: '0.85rem',
                color: '#94a3b8',
                lineHeight: '1.6',
              }}
            >
              <strong style={{ color: '#f1f5f9' }}>What happens next:</strong>
              <br />
              Marcus Chen will be automatically assigned and will immediately
              send an email to collect the Big 5 information needed for an
              accurate quote.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type='button'
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'rgba(71, 85, 105, 0.5)',
                color: '#f1f5f9',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type='submit'
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Create Inquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LeadCard({
  lead,
  isSelected,
  onClick,
}: {
  lead: DDPLead;
  isSelected: boolean;
  onClick: () => void;
}) {
  const statusColors = {
    new: '#3b82f6',
    contacted: '#8b5cf6',
    qualified: '#10b981',
    meeting_scheduled: '#06b6d4',
    proposal_sent: '#f59e0b',
    converted: '#22c55e',
    lost: '#64748b',
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: isSelected
          ? 'rgba(59, 130, 246, 0.1)'
          : 'rgba(15, 23, 42, 0.6)',
        border: `1px solid ${isSelected ? '#3b82f6' : 'rgba(71, 85, 105, 0.5)'}`,
        borderRadius: '0.75rem',
        padding: '1rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: '0.75rem',
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: '600',
              color: '#f1f5f9',
              marginBottom: '0.25rem',
            }}
          >
            {lead.companyName}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {lead.contactName} • {lead.industry}
          </div>
        </div>
        <div
          style={{
            background: statusColors[lead.status],
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.75rem',
            fontWeight: '600',
          }}
        >
          {lead.status.replace(/_/g, ' ').toUpperCase()}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          marginBottom: '0.5rem',
        }}
      >
        <span
          style={{
            fontSize: '0.85rem',
            color:
              lead.productCategory === 'steel' ||
              lead.productCategory === 'metal' ||
              lead.productCategory === 'aluminum'
                ? '#ef4444'
                : '#10b981',
            fontWeight: '600',
          }}
        >
          {lead.productCategory.toUpperCase()}
          {(lead.productCategory === 'steel' ||
            lead.productCategory === 'metal' ||
            lead.productCategory === 'aluminum') &&
            ' ⚡ 95% TARIFF'}
        </span>
      </div>

      <div
        style={{
          fontSize: '0.85rem',
          color: '#94a3b8',
          marginTop: '0.5rem',
        }}
      >
        Score:{' '}
        <span
          style={{
            color: lead.leadScore >= 85 ? '#10b981' : '#f59e0b',
            fontWeight: '600',
          }}
        >
          {lead.leadScore}/100
        </span>
        {' • '}
        {lead.estimatedMonthlyContainers} containers/month
      </div>
    </div>
  );
}

function LeadActivity({
  leadId,
  activities,
}: {
  leadId: string;
  activities: LeadGenActivity[];
}) {
  const icons = {
    lead_found: '🎯',
    outreach_sent: '📧',
    follow_up_sent: '🔄',
    qualified: '✅',
    meeting_booked: '📅',
    converted: '🎉',
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: '#f1f5f9',
            marginBottom: '1rem',
          }}
        >
          Lead Generation Activity
        </h3>
        {activities.length === 0 ? (
          <p
            style={{
              color: '#64748b',
              fontSize: '0.9rem',
              fontStyle: 'italic',
            }}
          >
            No activity yet...
          </p>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              maxHeight: '500px',
              overflowY: 'auto',
            }}
          >
            {activities.map((activity) => (
              <div
                key={activity.id}
                style={{
                  background: activity.automated
                    ? 'rgba(16, 185, 129, 0.1)'
                    : 'rgba(59, 130, 246, 0.1)',
                  border: `1px solid ${activity.automated ? 'rgba(16, 185, 129, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'start',
                  }}
                >
                  <div style={{ fontSize: '1.5rem' }}>
                    {icons[activity.activityType]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '0.9rem',
                        color: '#f1f5f9',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {activity.description}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.75rem',
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                      }}
                    >
                      <span>{getTimeAgo(activity.timestamp)}</span>
                      {activity.automated && (
                        <span style={{ color: '#10b981', fontWeight: '600' }}>
                          🤖 AUTOMATED
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Utility
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
