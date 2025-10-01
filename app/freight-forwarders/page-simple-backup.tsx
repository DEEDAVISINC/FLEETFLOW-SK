'use client';

import { AlertCircle, FileText, Plus, Ship, Users } from 'lucide-react';
import { useState } from 'react';
import FreightForwarderTracking from '../components/FreightForwarderTracking';
import { useMultiTenantPayments } from '../hooks/useMultiTenantPayments';
import { UnifiedInvoiceRequest } from '../services/MultiTenantPaymentService';

interface Shipment {
  id: string;
  referenceNumber: string;
  customer: string;
  origin: { country: string; city: string; port?: string };
  destination: { country: string; city: string; port?: string };
  mode: 'ocean' | 'air' | 'ground';
  serviceType: 'DDP' | 'DDU' | 'FOB' | 'CIF';
  containerType: '20ft' | '40ft' | '40HQ' | '45ft';
  quantity: number;
  status: 'quote' | 'booked' | 'in_transit' | 'customs' | 'delivered';
  bookingDate: Date;
  etd: Date;
  eta: Date;
  totalValue: number;
  paymentStatus: 'pending' | 'paid' | 'overdue';
  invoiceId?: string;
  fleetflowSource: boolean;
}

interface Quote {
  id: string;
  quoteNumber: string;
  customer: string;
  customerEmail: string;
  origin: string;
  destination: string;
  mode: 'ocean' | 'air' | 'ground';
  service: 'DDP' | 'DDU' | 'FOB';
  containerType?: string;
  quantity?: number;
  weight: number;
  volume: number;
  baseRate: number;
  fuelSurcharge: number;
  customsFees: number;
  total: number;
  validUntil: Date;
  status: 'draft' | 'sent' | 'accepted' | 'expired' | 'invoiced';
  createdAt: Date;
  fleetflowSource: boolean;
}

interface Customer {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  industry: string;
  monthlyVolume: number;
  totalRevenue: number;
  fleetflowSource: boolean;
  createdAt: Date;
}

export default function FreightForwardersPage() {
  const tenantId = 'freight-forwarder-tenant';

  const {
    config: paymentConfig,
    availableProviders,
    activeProviders,
    primaryProvider,
    loading: paymentsLoading,
    createInvoice,
  } = useMultiTenantPayments(tenantId);

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'shipments'
    | 'quotes'
    | 'customers'
    | 'documents'
    | 'financials'
  >('overview');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [processingInvoice, setProcessingInvoice] = useState(false);
  const [showTracking, setShowTracking] = useState<string | null>(null);

  const [quoteForm, setQuoteForm] = useState({
    customer: '',
    customerEmail: '',
    mode: 'ocean' as 'ocean' | 'air' | 'ground',
    service: 'DDP' as 'DDP' | 'DDU' | 'FOB',
    originPort: 'Shanghai, China',
    destinationPort: 'Long Beach, USA',
    containerType: '40HQ' as '20ft' | '40ft' | '40HQ' | '45ft',
    quantity: 1,
    weight: 1000,
  });

  const [customerForm, setCustomerForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    industry: 'Manufacturing',
    monthlyVolume: 1,
    fleetflowSource: false,
  });

  const stats = {
    activeShipments: shipments.filter((s) =>
      ['booked', 'in_transit'].includes(s.status)
    ).length,
    pendingQuotes: quotes.filter((q) => q.status === 'sent').length,
    monthlyRevenue: shipments
      .filter((s) => s.paymentStatus === 'paid')
      .reduce((sum, s) => sum + s.totalValue, 0),
    customersServed: customers.length,
    fleetflowLeads: customers.filter((c) => c.fleetflowSource).length,
    fleetflowCommissionOwed: shipments
      .filter((s) => s.fleetflowSource && s.status === 'delivered')
      .reduce((sum, s) => sum + 500 * s.quantity, 0),
  };

  const generateOceanQuote = () => {
    if (!quoteForm.customer || !quoteForm.customerEmail) {
      alert('Please enter customer name and email');
      return;
    }

    const containerRates = {
      '20ft': 2500,
      '40ft': 4000,
      '40HQ': 4500,
      '45ft': 5000,
    };
    const baseRate =
      containerRates[quoteForm.containerType] * quoteForm.quantity;
    const fuelSurcharge = baseRate * 0.15;
    const customsFees =
      quoteForm.service === 'DDP' ? 850 * quoteForm.quantity : 0;
    const total = baseRate + fuelSurcharge + customsFees;

    const newQuote: Quote = {
      id: `Q-${Date.now()}`,
      quoteNumber: `FF-Q-${Date.now().toString().slice(-6)}`,
      customer: quoteForm.customer,
      customerEmail: quoteForm.customerEmail,
      origin: quoteForm.originPort,
      destination: quoteForm.destinationPort,
      mode: 'ocean',
      service: quoteForm.service,
      containerType: quoteForm.containerType,
      quantity: quoteForm.quantity,
      weight: 0,
      volume: 0,
      baseRate,
      fuelSurcharge,
      customsFees,
      total,
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'sent',
      createdAt: new Date(),
      fleetflowSource: false,
    };

    setQuotes([newQuote, ...quotes]);
    setShowQuoteModal(false);
    alert(
      `✅ Ocean Freight Quote Generated!\n\nQuote #: ${newQuote.quoteNumber}\nTotal: $${total.toLocaleString()}\n\nQuote sent to ${quoteForm.customerEmail}`
    );
  };

  const generateAirQuote = () => {
    if (!quoteForm.customer || !quoteForm.customerEmail) {
      alert('Please enter customer name and email');
      return;
    }

    const ratePerKg = 4.5;
    const baseRate = quoteForm.weight * ratePerKg;
    const fuelSurcharge = baseRate * 0.25;
    const customsFees = quoteForm.service === 'DDP' ? 450 : 0;
    const total = baseRate + fuelSurcharge + customsFees;

    const newQuote: Quote = {
      id: `Q-${Date.now()}`,
      quoteNumber: `FF-Q-${Date.now().toString().slice(-6)}`,
      customer: quoteForm.customer,
      customerEmail: quoteForm.customerEmail,
      origin: quoteForm.originPort,
      destination: quoteForm.destinationPort,
      mode: 'air',
      service: quoteForm.service,
      weight: quoteForm.weight,
      volume: 0,
      baseRate,
      fuelSurcharge,
      customsFees,
      total,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'sent',
      createdAt: new Date(),
      fleetflowSource: false,
    };

    setQuotes([newQuote, ...quotes]);
    setShowQuoteModal(false);
    alert(
      `✅ Air Freight Quote Generated!\n\nQuote #: ${newQuote.quoteNumber}\nTotal: $${total.toLocaleString()}\n\nQuote sent to ${quoteForm.customerEmail}`
    );
  };

  const handleAddCustomer = () => {
    if (!customerForm.companyName || !customerForm.email) {
      alert('Please enter company name and email');
      return;
    }

    const newCustomer: Customer = {
      id: `C-${Date.now()}`,
      companyName: customerForm.companyName,
      contactName: customerForm.contactName,
      email: customerForm.email,
      phone: customerForm.phone,
      industry: customerForm.industry,
      monthlyVolume: customerForm.monthlyVolume,
      totalRevenue: 0,
      fleetflowSource: customerForm.fleetflowSource,
      createdAt: new Date(),
    };

    setCustomers([newCustomer, ...customers]);
    setShowCustomerModal(false);
    alert(
      `✅ Customer Added!\n\n${newCustomer.companyName} has been added to your database.${
        customerForm.fleetflowSource
          ? '\n\n🎯 FleetFlow Lead: $500 commission per container will be tracked.'
          : ''
      }`
    );
    setCustomerForm({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      industry: 'Manufacturing',
      monthlyVolume: 1,
      fleetflowSource: false,
    });
  };

  const bookShipment = (quote: Quote) => {
    const newShipment: Shipment = {
      id: `S-${Date.now()}`,
      referenceNumber: `FF-SH-${Date.now().toString().slice(-6)}`,
      customer: quote.customer,
      origin: { country: 'China', city: 'Shanghai', port: quote.origin },
      destination: {
        country: 'USA',
        city: 'Los Angeles',
        port: quote.destination,
      },
      mode: quote.mode,
      serviceType: quote.service,
      containerType: quote.containerType || '40HQ',
      quantity: quote.quantity || 1,
      status: 'booked',
      bookingDate: new Date(),
      etd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      eta: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      totalValue: quote.total,
      paymentStatus: 'pending',
      fleetflowSource: quote.fleetflowSource,
    };

    setShipments([newShipment, ...shipments]);
    setQuotes(
      quotes.map((q) =>
        q.id === quote.id ? { ...q, status: 'accepted' as any } : q
      )
    );
    alert(
      `✅ Shipment Booked!\n\nReference: ${newShipment.referenceNumber}\nETD: ${newShipment.etd.toLocaleDateString()}\nETA: ${newShipment.eta.toLocaleDateString()}\n\nYou can now track this container in real-time!`
    );
  };

  const convertQuoteToInvoice = async (quote: Quote) => {
    if (!primaryProvider) {
      alert(
        '⚠️ Please configure a primary payment provider (Square/Stripe/PayPal) in your billing settings to create invoices.'
      );
      return;
    }

    setProcessingInvoice(true);

    const invoiceRequest: UnifiedInvoiceRequest = {
      tenantId,
      provider: primaryProvider as any,
      customerName: quote.customer,
      companyName: quote.customer,
      email: quote.customerEmail,
      title: `Freight Quote ${quote.quoteNumber} - ${quote.mode.toUpperCase()} ${quote.service}`,
      description: `International freight services from ${quote.origin} to ${quote.destination}`,
      lineItems: [
        {
          name: `${quote.mode.toUpperCase()} Freight (${quote.service})`,
          description: `Container Type: ${quote.containerType || 'N/A'}, Quantity: ${quote.quantity || 'N/A'}, Weight: ${quote.weight || 'N/A'}kg`,
          quantity: 1,
          rate: quote.total,
          amount: quote.total,
        },
      ],
      dueDate: quote.validUntil.toISOString().split('T')[0],
      customFields: [
        { label: 'Quote Number', value: quote.quoteNumber },
        { label: 'Shipment Mode', value: quote.mode },
        { label: 'Service Type', value: quote.service },
        {
          label: 'FleetFlow Sourced',
          value: quote.fleetflowSource ? 'Yes' : 'No',
        },
      ],
    };

    try {
      const result = await createInvoice(invoiceRequest);
      if (result.success) {
        alert(
          `✅ Invoice ${result.invoiceId} created successfully with ${primaryProvider}!\nInvoice Number: ${result.invoiceNumber}\nAmount: $${result.amount?.toLocaleString()}\nStatus: ${result.status}\nPublic URL: ${result.publicUrl}\n\nThe customer will receive the invoice via email.`
        );
        setQuotes((prevQuotes) =>
          prevQuotes.map((q) =>
            q.id === quote.id ? { ...q, status: 'invoiced' as any } : q
          )
        );
      } else {
        alert(
          `❌ Failed to create invoice with ${primaryProvider}: ${result.error}`
        );
      }
    } catch (error) {
      alert(
        `❌ Error creating invoice: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setProcessingInvoice(false);
    }
  };

  return (
    <div
      style={{
        padding: '40px',
        paddingTop: '100px',
        background: `linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)`,
        minHeight: '100vh',
        color: '#ffffff',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '30px',
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'start', gap: '20px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ship
                style={{ width: '32px', height: '32px', color: '#60a5fa' }}
              />
            </div>
            <div>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  margin: '0 0 8px 0',
                }}
              >
                🚢 FLEETFLOW™ FREIGHT FORWARDING COMMAND
              </h1>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  margin: 0,
                }}
              >
                International Freight Management with Real-Time Tracking
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  margin: '4px 0 0 0',
                }}
              >
                FREE Vessel Tracking | Real-Time GPS | Database Persistence |
                Email/SMS Alerts
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '10px 15px',
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  color: '#10b981',
                  fontWeight: '600',
                }}
              >
                💰 Revenue: ${stats.monthlyRevenue.toLocaleString()}
              </span>
            </div>
            {!primaryProvider && (
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  borderRadius: '12px',
                  padding: '10px 15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertCircle
                  style={{ width: '18px', height: '18px', color: '#f59e0b' }}
                />
                <span style={{ fontSize: '13px', color: '#fbbf24' }}>
                  ⚠️ Configure payment system
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
          <button
            onClick={() => setShowQuoteModal(true)}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Plus style={{ width: '18px', height: '18px' }} />
            New Quote
          </button>
          <button
            onClick={() => setShowCustomerModal(true)}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Users style={{ width: '18px', height: '18px' }} />
            Add Customer
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '20px',
          }}
        >
          {[
            { id: 'overview', label: '📊 Dashboard' },
            {
              id: 'shipments',
              label: `🚢 Shipments (${stats.activeShipments})`,
            },
            { id: 'quotes', label: `💰 Quotes (${stats.pendingQuotes})` },
            {
              id: 'customers',
              label: `👥 Customers (${stats.customersServed})`,
            },
            { id: 'documents', label: '📄 Documents' },
            { id: 'financials', label: '📈 Financials' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background:
                  activeTab === tab.id
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    : 'rgba(255, 255, 255, 0.05)',
                border:
                  activeTab === tab.id
                    ? '1px solid #3b82f6'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '12px 20px',
                color:
                  activeTab === tab.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ minHeight: '500px' }}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              📊 Dashboard Overview
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚢</div>
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#3b82f6',
                    marginBottom: '8px',
                  }}
                >
                  {stats.activeShipments}
                </div>
                <div
                  style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)' }}
                >
                  Active Shipments
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>💰</div>
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#10b981',
                    marginBottom: '8px',
                  }}
                >
                  {stats.pendingQuotes}
                </div>
                <div
                  style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)' }}
                >
                  Pending Quotes
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎯</div>
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#a78bfa',
                    marginBottom: '8px',
                  }}
                >
                  {stats.fleetflowLeads}
                </div>
                <div
                  style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)' }}
                >
                  FleetFlow Leads
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.5)',
                    marginTop: '8px',
                  }}
                >
                  ${stats.fleetflowCommissionOwed.toLocaleString()} commission
                  owed
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shipments Tab */}
        {activeTab === 'shipments' && (
          <div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              🚢 Active Shipments (Real-Time Tracking)
            </h3>
            {shipments.length === 0 ? (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px dashed rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '60px',
                  textAlign: 'center',
                }}
              >
                <Ship
                  style={{
                    width: '64px',
                    height: '64px',
                    color: 'rgba(255,255,255,0.3)',
                    margin: '0 auto 20px',
                  }}
                />
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '10px',
                  }}
                >
                  No active shipments
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Generate quotes and book shipments to see real-time tracking
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {shipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '8px',
                          }}
                        >
                          {shipment.referenceNumber} - {shipment.customer}
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: 'rgba(255,255,255,0.7)',
                          }}
                        >
                          {shipment.origin.city}, {shipment.origin.country} →{' '}
                          {shipment.destination.city},{' '}
                          {shipment.destination.country}
                        </div>
                        <div
                          style={{
                            fontSize: '13px',
                            color: 'rgba(255,255,255,0.6)',
                            marginTop: '8px',
                          }}
                        >
                          ETD: {shipment.etd.toLocaleDateString()} | ETA:{' '}
                          {shipment.eta.toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            color: '#10b981',
                            marginBottom: '4px',
                          }}
                        >
                          ${shipment.totalValue.toLocaleString()}
                        </div>
                        {['booked', 'in_transit', 'customs'].includes(
                          shipment.status
                        ) && (
                          <button
                            onClick={() => setShowTracking(shipment.id)}
                            style={{
                              marginTop: '10px',
                              background:
                                'linear-gradient(135deg, #10b981, #059669)',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              color: 'white',
                              fontSize: '13px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            📍 Track Container
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quotes Tab */}
        {activeTab === 'quotes' && (
          <div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              💰 Quotes
            </h3>
            {quotes.length === 0 ? (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px dashed rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '60px',
                  textAlign: 'center',
                }}
              >
                <FileText
                  style={{
                    width: '64px',
                    height: '64px',
                    color: 'rgba(255,255,255,0.3)',
                    margin: '0 auto 20px',
                  }}
                />
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '10px',
                  }}
                >
                  No quotes yet
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Click "New Quote" to generate ocean or air freight quotes
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {quotes.map((quote) => (
                  <div
                    key={quote.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '8px',
                          }}
                        >
                          {quote.quoteNumber} - {quote.customer}
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: 'rgba(255,255,255,0.7)',
                          }}
                        >
                          {quote.origin} → {quote.destination}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            color: '#10b981',
                            marginBottom: '4px',
                          }}
                        >
                          ${quote.total.toLocaleString()}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            marginTop: '10px',
                          }}
                        >
                          <button
                            onClick={() => convertQuoteToInvoice(quote)}
                            disabled={
                              processingInvoice ||
                              quote.status === ('invoiced' as any)
                            }
                            style={{
                              background:
                                quote.status === 'invoiced'
                                  ? 'rgba(100,100,100,0.3)'
                                  : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px 12px',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor:
                                quote.status === 'invoiced' || processingInvoice
                                  ? 'not-allowed'
                                  : 'pointer',
                            }}
                          >
                            {quote.status === 'invoiced'
                              ? '✓ Invoiced'
                              : 'Create Invoice'}
                          </button>
                          <button
                            onClick={() => bookShipment(quote)}
                            style={{
                              background:
                                'linear-gradient(135deg, #10b981, #059669)',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px 12px',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            Book Shipment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              👥 Customers
            </h3>
            {customers.length === 0 ? (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px dashed rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '60px',
                  textAlign: 'center',
                }}
              >
                <Users
                  style={{
                    width: '64px',
                    height: '64px',
                    color: 'rgba(255,255,255,0.3)',
                    margin: '0 auto 20px',
                  }}
                />
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '10px',
                  }}
                >
                  No customers yet
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Click "Add Customer" to start building your client database
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '15px',
                }}
              >
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '8px',
                      }}
                    >
                      {customer.companyName}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255,255,255,0.7)',
                        marginBottom: '4px',
                      }}
                    >
                      {customer.contactName}
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.6)',
                      }}
                    >
                      {customer.email}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Documents & Financials Tabs */}
        {activeTab === 'documents' && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <FileText
              style={{
                width: '64px',
                height: '64px',
                color: 'rgba(255,255,255,0.3)',
                margin: '0 auto 20px',
              }}
            />
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '10px',
              }}
            >
              Document Management
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>
              BOL, Invoices, Packing Lists, Customs Declarations
            </p>
          </div>
        )}

        {activeTab === 'financials' && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>💰</div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '10px',
              }}
            >
              Financial Reporting
            </h3>
            <div
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#10b981',
                marginBottom: '8px',
              }}
            >
              ${stats.monthlyRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)' }}>
              Total Revenue This Month
            </div>
          </div>
        )}
      </div>

      {/* Quote Modal */}
      {showQuoteModal && (
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
            zIndex: 1000,
          }}
          onClick={() => setShowQuoteModal(false)}
        >
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '30px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              🚢 Generate Freight Quote
            </h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  Customer Name
                </label>
                <input
                  type='text'
                  value={quoteForm.customer}
                  onChange={(e) =>
                    setQuoteForm({ ...quoteForm, customer: e.target.value })
                  }
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '10px 15px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                  placeholder='Enter customer name'
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  Customer Email
                </label>
                <input
                  type='email'
                  value={quoteForm.customerEmail}
                  onChange={(e) =>
                    setQuoteForm({
                      ...quoteForm,
                      customerEmail: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '10px 15px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                  placeholder='customer@example.com'
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  Mode
                </label>
                <select
                  value={quoteForm.mode}
                  onChange={(e) =>
                    setQuoteForm({ ...quoteForm, mode: e.target.value as any })
                  }
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '10px 15px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                >
                  <option value='ocean'>🚢 Ocean Freight</option>
                  <option value='air'>✈️ Air Freight</option>
                </select>
              </div>

              {quoteForm.mode === 'ocean' && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.7)',
                      }}
                    >
                      Container Type
                    </label>
                    <select
                      value={quoteForm.containerType}
                      onChange={(e) =>
                        setQuoteForm({
                          ...quoteForm,
                          containerType: e.target.value as any,
                        })
                      }
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        padding: '10px 15px',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    >
                      <option value='20ft'>20ft Container</option>
                      <option value='40ft'>40ft Container</option>
                      <option value='40HQ'>40ft High Cube</option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.7)',
                      }}
                    >
                      Quantity
                    </label>
                    <input
                      type='number'
                      value={quoteForm.quantity}
                      onChange={(e) =>
                        setQuoteForm({
                          ...quoteForm,
                          quantity: parseInt(e.target.value) || 1,
                        })
                      }
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        padding: '10px 15px',
                        color: 'white',
                        fontSize: '14px',
                      }}
                      min='1'
                    />
                  </div>
                </div>
              )}

              {quoteForm.mode === 'air' && (
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    Weight (kg)
                  </label>
                  <input
                    type='number'
                    value={quoteForm.weight}
                    onChange={(e) =>
                      setQuoteForm({
                        ...quoteForm,
                        weight: parseFloat(e.target.value) || 0,
                      })
                    }
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '10px 15px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                    placeholder='1000'
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={
                  quoteForm.mode === 'ocean'
                    ? generateOceanQuote
                    : generateAirQuote
                }
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Generate Quote
              </button>
              <button
                onClick={() => setShowQuoteModal(false)}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Modal */}
      {showCustomerModal && (
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
            zIndex: 1000,
          }}
          onClick={() => setShowCustomerModal(false)}
        >
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '30px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              👥 Add New Customer
            </h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  Company Name
                </label>
                <input
                  type='text'
                  value={customerForm.companyName}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      companyName: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '10px 15px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                  placeholder='ABC Logistics'
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  Contact Name
                </label>
                <input
                  type='text'
                  value={customerForm.contactName}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      contactName: e.target.value,
                    })
                  }
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '10px 15px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                  placeholder='John Doe'
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  Email
                </label>
                <input
                  type='email'
                  value={customerForm.email}
                  onChange={(e) =>
                    setCustomerForm({ ...customerForm, email: e.target.value })
                  }
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '10px 15px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                  placeholder='john.doe@example.com'
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  Phone
                </label>
                <input
                  type='tel'
                  value={customerForm.phone}
                  onChange={(e) =>
                    setCustomerForm({ ...customerForm, phone: e.target.value })
                  }
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '10px 15px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                  placeholder='+1 (555) 123-4567'
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '10px',
                }}
              >
                <input
                  type='checkbox'
                  id='fleetflowSource'
                  checked={customerForm.fleetflowSource}
                  onChange={(e) =>
                    setCustomerForm({
                      ...customerForm,
                      fleetflowSource: e.target.checked,
                    })
                  }
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#3b82f6',
                  }}
                />
                <label
                  htmlFor='fleetflowSource'
                  style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}
                >
                  Sourced by FleetFlow Lead Gen (+$500/container commission)
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={handleAddCustomer}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Add Customer
              </button>
              <button
                onClick={() => setShowCustomerModal(false)}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {showTracking && (
        <FreightForwarderTracking
          shipmentId={showTracking}
          onClose={() => setShowTracking(null)}
        />
      )}
    </div>
  );
}
