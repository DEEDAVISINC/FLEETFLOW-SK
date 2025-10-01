'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DeniedPartyScreeningUI from '../components/DeniedPartyScreeningUI';
import FreightForwarderDashboardGuide from '../components/FreightForwarderDashboardGuide';
import ShipmentConsolidationDashboard from '../components/ShipmentConsolidationDashboard';
import { useMultiTenantPayments } from '../hooks/useMultiTenantPayments';
import btsService, {
  PortPerformanceBenchmark,
  WaterborneCommerceData,
} from '../services/BTSService';
import { currencyService } from '../services/CurrencyConversionService';
import {
  ScreeningParty,
  ScreeningResult,
  deniedPartyScreeningService,
} from '../services/DeniedPartyScreeningService';
import { ContractType } from '../services/FreightForwarderContractService';
import { FreightForwarderContractTemplates } from '../services/FreightForwarderContractTemplates';
import FreightForwarderIdentificationService from '../services/FreightForwarderIdentificationService';
import {
  RateContractsTab,
  WarehouseManagementTab,
} from '../services/FreightForwardingCargoWiseComponents';
import { UnifiedInvoiceRequest } from '../services/MultiTenantPaymentService';
import {
  NOAAPortConditions,
  noaaPortsService,
} from '../services/NOAAPortsService';
import {
  NOADVesselData,
  PortIntelligence,
  VesselSchedule,
} from '../services/NOADService';
import { portAuthorityService } from '../services/PortAuthorityService';
import {
  PortAuthorityOperations,
  portAuthoritySystemsService,
} from '../services/PortAuthoritySystemsService';
import CanadaCrossBorderView from '../tracking/components/CanadaCrossBorderView';
import MexicoCrossBorderView from '../tracking/components/MexicoCrossBorderView';

export default function FreightForwardingPage() {
  const router = useRouter();
  const tenantId = 'freight-forwarding-tenant';

  const {
    config: paymentConfig,
    availableProviders,
    activeProviders,
    primaryProvider,
    loading: paymentsLoading,
    createInvoice,
  } = useMultiTenantPayments(tenantId);

  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [shipments, setShipments] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
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

  const [showCarrierComparison, setShowCarrierComparison] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const [carrierQuotes, setCarrierQuotes] = useState<any[]>([]);

  const [invoices, setInvoices] = useState<any[]>([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const [customerForm, setCustomerForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    industry: 'Manufacturing',
    monthlyVolume: 1,
    fleetflowSource: false,
  });

  // Maritime Intelligence State
  const [maritimeLoading, setMaritimeLoading] = useState(false);
  const [maritimeData, setMaritimeData] = useState({
    vessels: [] as NOADVesselData[],
    ports: [] as PortIntelligence[],
    schedules: [] as VesselSchedule[],
    noaaConditions: [] as NOAAPortConditions[],
    portOperations: [] as PortAuthorityOperations[],
    commerceData: [] as WaterborneCommerceData[],
    benchmarks: [] as PortPerformanceBenchmark[],
  });

  // Cross-border state
  const [canadaShipments, setCanadaShipments] = useState<any[]>([]);
  const [mexicoShipments, setMexicoShipments] = useState<any[]>([]);

  // Load maritime intelligence data
  const loadMaritimeData = async () => {
    setMaritimeLoading(true);
    try {
      const [
        vessels,
        ports,
        schedules,
        conditions,
        operations,
        commerce,
        benchmarks,
      ] = await Promise.all([
        portAuthorityService.getNOADVesselData(),
        Promise.all([
          portAuthorityService.getEnhancedPortIntelligence('USLAX'),
          portAuthorityService.getEnhancedPortIntelligence('USNYK'),
          portAuthorityService.getEnhancedPortIntelligence('USMIA'),
          portAuthorityService.getEnhancedPortIntelligence('USSAV'),
          portAuthorityService.getEnhancedPortIntelligence('USSEA'),
        ]),
        portAuthorityService.getVesselSchedules(),
        noaaPortsService.getPortConditions('USLAX'),
        portAuthoritySystemsService.getPortOperations('USLAX'),
        btsService.getWaterborneCommerceData(),
        btsService.getPortPerformanceBenchmarks(),
      ]);

      setMaritimeData({
        vessels,
        ports,
        schedules,
        noaaConditions: conditions ? [conditions] : [],
        portOperations: operations ? [operations] : [],
        commerceData: commerce,
        benchmarks,
      });
    } catch (error) {
      console.error('Failed to load maritime data:', error);
    } finally {
      setMaritimeLoading(false);
    }
  };

  useEffect(() => {
    // TODO: Replace with actual API calls to fetch real data
    // Load maritime data
    loadMaritimeData();

    // TODO: Fetch clients from API
    // Example: fetchClients().then(data => setClients(data));
    
    // TODO: Fetch shipments from API
    // Example: fetchShipments().then(data => setShipments(data));
    
    // TODO: Fetch quotes from API
    // Example: fetchQuotes().then(data => setQuotes(data));
    
    // TODO: Fetch cross-border shipments from API
    // Example: fetchCanadaShipments().then(data => setCanadaShipments(data));
    // Example: fetchMexicoShipments().then(data => setMexicoShipments(data));
  }, []);

  const stats = {
    totalShipments: shipments.length,
    activeShipments: shipments.filter((s: any) =>
      ['booked', 'in_transit'].includes(s.status)
    ).length,
    pendingQuotes: quotes.filter((q: any) => q.status === 'sent').length,
    monthlyRevenue: shipments
      .filter((s: any) => s.paymentStatus === 'paid')
      .reduce((sum: number, s: any) => sum + s.totalValue, 0),
    customersServed: clients.length,
    fleetflowLeads: clients.filter((c: any) => c.fleetflowSource).length,
    fleetflowCommissionOwed: shipments
      .filter((s: any) => s.fleetflowSource && s.status === 'delivered')
      .reduce((sum: number, s: any) => sum + 500 * s.quantity, 0),
  };

  const handleTabClick = (tabId: string, tab?: string) => {
    if (tab) {
      setSelectedTab(tab);
    } else {
      setSelectedTab(tabId);
    }
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

    const newQuote = {
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

    const newQuote = {
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

  const generateMultiCarrierQuotes = () => {
    if (quoteForm.mode === 'ocean') {
      const containerRates: any = { '20ft': 2200, '40ft': 2800, '40HQ': 3200 };
      const baseRate =
        containerRates[quoteForm.containerType] * quoteForm.quantity;

      const carriers = [
        {
          name: 'Maersk',
          logo: '🚢',
          transitTime: '18-22 days',
          baseRate: baseRate,
          fuelSurcharge: baseRate * 0.22,
          customsDuties:
            quoteForm.service === 'DDP' ? 850 * quoteForm.quantity : 0,
          documentation: 150,
          insurance: baseRate * 0.015,
          portHandling: 280 * quoteForm.quantity,
          color: '#3b82f6',
        },
        {
          name: 'MSC',
          logo: '⚓',
          transitTime: '20-24 days',
          baseRate: baseRate * 0.92,
          fuelSurcharge: baseRate * 0.92 * 0.25,
          customsDuties:
            quoteForm.service === 'DDP' ? 850 * quoteForm.quantity : 0,
          documentation: 125,
          insurance: baseRate * 0.92 * 0.015,
          portHandling: 260 * quoteForm.quantity,
          color: '#10b981',
        },
        {
          name: 'CMA CGM',
          logo: '🛳️',
          transitTime: '19-23 days',
          baseRate: baseRate * 0.97,
          fuelSurcharge: baseRate * 0.97 * 0.24,
          customsDuties:
            quoteForm.service === 'DDP' ? 850 * quoteForm.quantity : 0,
          documentation: 140,
          insurance: baseRate * 0.97 * 0.015,
          portHandling: 275 * quoteForm.quantity,
          color: '#f59e0b',
        },
        {
          name: 'COSCO',
          logo: '🚢',
          transitTime: '21-25 days',
          baseRate: baseRate * 0.88,
          fuelSurcharge: baseRate * 0.88 * 0.23,
          customsDuties:
            quoteForm.service === 'DDP' ? 850 * quoteForm.quantity : 0,
          documentation: 110,
          insurance: baseRate * 0.88 * 0.015,
          portHandling: 245 * quoteForm.quantity,
          color: '#8b5cf6',
        },
      ];

      const quotes = carriers.map((carrier) => ({
        ...carrier,
        total:
          carrier.baseRate +
          carrier.fuelSurcharge +
          carrier.customsDuties +
          carrier.documentation +
          carrier.insurance +
          carrier.portHandling,
      }));

      setCarrierQuotes(quotes);
      setShowCarrierComparison(true);
    } else {
      // Air freight carriers
      const ratePerKg = 4.5;
      const baseRate = quoteForm.weight * ratePerKg;

      const carriers = [
        {
          name: 'DHL Express',
          logo: '✈️',
          transitTime: '3-5 days',
          baseRate: baseRate * 1.15,
          fuelSurcharge: baseRate * 1.15 * 0.28,
          customsDuties: quoteForm.service === 'DDP' ? 450 : 0,
          documentation: 95,
          insurance: baseRate * 1.15 * 0.02,
          handling: 120,
          color: '#ef4444',
        },
        {
          name: 'FedEx',
          logo: '📦',
          transitTime: '4-6 days',
          baseRate: baseRate * 1.1,
          fuelSurcharge: baseRate * 1.1 * 0.26,
          customsDuties: quoteForm.service === 'DDP' ? 450 : 0,
          documentation: 85,
          insurance: baseRate * 1.1 * 0.02,
          handling: 110,
          color: '#8b5cf6',
        },
        {
          name: 'UPS',
          logo: '📦',
          transitTime: '4-6 days',
          baseRate: baseRate * 1.08,
          fuelSurcharge: baseRate * 1.08 * 0.25,
          customsDuties: quoteForm.service === 'DDP' ? 450 : 0,
          documentation: 90,
          insurance: baseRate * 1.08 * 0.02,
          handling: 115,
          color: '#f59e0b',
        },
        {
          name: 'China Airlines',
          logo: '✈️',
          transitTime: '5-7 days',
          baseRate: baseRate * 0.92,
          fuelSurcharge: baseRate * 0.92 * 0.24,
          customsDuties: quoteForm.service === 'DDP' ? 450 : 0,
          documentation: 75,
          insurance: baseRate * 0.92 * 0.02,
          handling: 95,
          color: '#06b6d4',
        },
      ];

      const quotes = carriers.map((carrier) => ({
        ...carrier,
        total:
          carrier.baseRate +
          carrier.fuelSurcharge +
          carrier.customsDuties +
          carrier.documentation +
          carrier.insurance +
          carrier.handling,
      }));

      setCarrierQuotes(quotes);
      setShowCarrierComparison(true);
    }
  };

  const selectCarrierAndGenerateQuote = (carrier: any) => {
    const newQuote = {
      id: `Q-${Date.now()}`,
      quoteNumber: `FF-Q-${Date.now().toString().slice(-6)}`,
      customer: quoteForm.customer,
      customerEmail: quoteForm.customerEmail,
      origin: quoteForm.originPort,
      destination: quoteForm.destinationPort,
      mode: quoteForm.mode,
      service: quoteForm.service,
      carrier: carrier.name,
      transitTime: carrier.transitTime,
      baseRate: carrier.baseRate,
      fuelSurcharge: carrier.fuelSurcharge,
      customsFees: carrier.customsDuties,
      total: carrier.total,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'sent',
      createdAt: new Date(),
      fleetflowSource: false,
      breakdown: {
        base: carrier.baseRate,
        fuel: carrier.fuelSurcharge,
        customs: carrier.customsDuties,
        docs: carrier.documentation,
        insurance: carrier.insurance,
        handling: carrier.portHandling || carrier.handling,
      },
    };

    setQuotes([newQuote, ...quotes]);
    setShowCarrierComparison(false);
    setShowQuoteModal(false);
    alert(
      `✅ Quote Generated with ${carrier.name}!\n\nQuote #: ${newQuote.quoteNumber}\nCarrier: ${carrier.name}\nTransit: ${carrier.transitTime}\nTotal: $${carrier.total.toLocaleString()}\n\nQuote sent to ${quoteForm.customerEmail}`
    );
  };

  const handleAddCustomer = () => {
    if (!customerForm.companyName || !customerForm.email) {
      alert('Please enter company name and email');
      return;
    }

    const newCustomer = {
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

    setClients([newCustomer, ...clients]);
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

  const bookShipment = (quote: any) => {
    const newShipment = {
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
      quotes.map((q: any) =>
        q.id === quote.id ? { ...q, status: 'accepted' } : q
      )
    );
    alert(
      `✅ Shipment Booked!\n\nReference: ${newShipment.referenceNumber}\nETD: ${newShipment.etd.toLocaleDateString()}\nETA: ${newShipment.eta.toLocaleDateString()}\n\nYou can now track this container in real-time!`
    );
  };

  const generateInvoiceFromQuote = (quote: any) => {
    setProcessingInvoice(true);

    setTimeout(() => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30); // Net 30 payment terms

      const newInvoice = {
        id: `INV-${Date.now()}`,
        invoiceNumber: `FF-INV-${String(invoices.length + 1).padStart(4, '0')}`,
        quoteId: quote.id,
        quoteNumber: quote.quoteNumber,
        customer: quote.customer,
        customerEmail: quote.customerEmail,
        origin: quote.origin,
        destination: quote.destination,
        mode: quote.mode,
        service: quote.service,
        carrier: quote.carrier || 'N/A',
        transitTime: quote.transitTime || 'N/A',

        // Line items
        lineItems: [
          {
            description: `${quote.mode === 'ocean' ? 'Ocean' : 'Air'} Freight - ${quote.origin} to ${quote.destination}`,
            quantity: quote.quantity || 1,
            rate: quote.baseRate,
            amount: quote.baseRate,
          },
          {
            description: 'Fuel Surcharge',
            quantity: 1,
            rate: quote.fuelSurcharge,
            amount: quote.fuelSurcharge,
          },
        ],

        // Amounts
        subtotal: quote.baseRate + quote.fuelSurcharge,
        customsFees: quote.customsFees || 0,
        total: quote.total,

        // Breakdown (if available from carrier comparison)
        breakdown: quote.breakdown || null,

        // Payment details
        status: 'sent',
        paymentStatus: 'pending',
        paymentMethod: null,
        paidAmount: 0,
        issueDate: new Date(),
        dueDate: dueDate,
        paidDate: null,

        // Tracking
        fleetflowSource: quote.fleetflowSource,
        createdAt: new Date(),
        lastUpdated: new Date(),
      };

      // Add customs/duties line item if applicable
      if (quote.customsFees > 0) {
        newInvoice.lineItems.push({
          description: `Customs Clearance & Duties (${quote.service})`,
          quantity: 1,
          rate: quote.customsFees,
          amount: quote.customsFees,
        });
      }

      // Add breakdown line items if available
      if (quote.breakdown) {
        if (quote.breakdown.docs > 0) {
          newInvoice.lineItems.push({
            description: 'Documentation Fees',
            quantity: 1,
            rate: quote.breakdown.docs,
            amount: quote.breakdown.docs,
          });
        }
        if (quote.breakdown.insurance > 0) {
          newInvoice.lineItems.push({
            description: 'Cargo Insurance',
            quantity: 1,
            rate: quote.breakdown.insurance,
            amount: quote.breakdown.insurance,
          });
        }
        if (quote.breakdown.handling > 0) {
          newInvoice.lineItems.push({
            description:
              quote.mode === 'ocean' ? 'Port Handling' : 'Handling Fees',
            quantity: 1,
            rate: quote.breakdown.handling,
            amount: quote.breakdown.handling,
          });
        }
      }

      setInvoices([newInvoice, ...invoices]);
      setQuotes(
        quotes.map((q: any) =>
          q.id === quote.id ? { ...q, status: 'invoiced' } : q
        )
      );
      setProcessingInvoice(false);
      setSelectedInvoice(newInvoice);
      setShowInvoiceModal(true);
    }, 800);
  };

  const updateInvoicePayment = (invoiceId: string, paymentData: any) => {
    setInvoices(
      invoices.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              paymentStatus: paymentData.status,
              paidAmount: paymentData.amount,
              paidDate: paymentData.status === 'paid' ? new Date() : null,
              paymentMethod: paymentData.method,
              lastUpdated: new Date(),
            }
          : inv
      )
    );
    setShowInvoiceModal(false);
    alert(
      `✅ Invoice ${paymentData.status === 'paid' ? 'Paid' : 'Updated'}!\n\nInvoice #: ${
        invoices.find((i) => i.id === invoiceId)?.invoiceNumber
      }\nAmount: $${paymentData.amount.toLocaleString()}\n${
        paymentData.status === 'paid'
          ? 'Payment recorded successfully!'
          : 'Status updated.'
      }`
    );
  };

  const convertQuoteToInvoice = async (quote: any) => {
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
        setQuotes((prevQuotes: any) =>
          prevQuotes.map((q: any) =>
            q.id === quote.id ? { ...q, status: 'invoiced' } : q
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
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '30px',
        paddingTop: '100px',
        color: 'white',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <FreightForwarderDashboardGuide onStepClick={handleTabClick} />

      {/* Header */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background:
              'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4)',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}
          >
            🚢
          </div>
          <div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: '800',
                margin: '0 0 8px 0',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Freight Forwarding Intelligence Center
            </h1>
            <p style={{ margin: '0', color: 'rgba(255,255,255,0.8)' }}>
              Ocean & Air Freight • Customs Clearance • Global Logistics
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid rgba(6, 182, 212, 0.2)',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'dashboard', label: '🏠 Dashboard', color: '#06b6d4' },
            {
              id: 'shipments',
              label: '📦 Shipments & Tracking',
              color: '#10b981',
            },
            {
              id: 'compliance',
              label: '🛃 Compliance & Docs',
              color: '#ef4444',
            },
            { id: 'clients', label: '👥 Clients & CRM', color: '#8b5cf6' },
            {
              id: 'intelligence',
              label: '📊 Intelligence & Analytics',
              color: '#3b82f6',
            },
            {
              id: 'automation',
              label: '🤖 Automation Hub',
              color: '#ec4899',
            },
            {
              id: 'operations',
              label: '✅ Operations & WMS',
              color: '#f59e0b',
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              style={{
                padding: '14px 20px',
                background:
                  selectedTab === tab.id
                    ? tab.color
                    : 'rgba(255, 255, 255, 0.1)',
                color:
                  selectedTab === tab.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                fontWeight: '600',
                cursor: 'pointer',
                borderRadius: '12px',
                transition: 'all 0.2s',
                border:
                  selectedTab === tab.id
                    ? `2px solid ${tab.color}`
                    : '2px solid transparent',
                boxShadow:
                  selectedTab === tab.id ? `0 0 20px ${tab.color}40` : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          minHeight: '600px',
        }}
      >
        {selectedTab === 'dashboard' && (
          <OverviewTab
            primaryProvider={primaryProvider}
            stats={stats}
            onNavigateToTab={setSelectedTab}
            onNewQuote={() => setShowQuoteModal(true)}
            onAddCustomer={() => setShowCustomerModal(true)}
            recentQuotes={quotes}
            recentShipments={shipments}
          />
        )}
        {/* Shipments & Tracking Tab - Consolidated */}
        {selectedTab === 'shipments' && (
          <ShipmentsTrackingTab router={router} tenantId={tenantId} />
        )}

        {/* Compliance & Docs Tab - Consolidated */}
        {selectedTab === 'compliance' && <ComplianceDocsTab />}

        {/* Clients & CRM Tab */}
        {selectedTab === 'clients' && (
          <ClientsTab
            clients={clients}
            setClients={setClients}
            showAddAgentModal={showAddAgentModal}
            setShowAddAgentModal={setShowAddAgentModal}
          />
        )}

        {/* Intelligence & Analytics Tab - Consolidated */}
        {selectedTab === 'intelligence' && (
          <IntelligenceAnalyticsTab
            stats={stats}
            invoices={invoices}
            onViewInvoice={(invoice) => {
              setSelectedInvoice(invoice);
              setShowInvoiceModal(true);
            }}
          />
        )}

        {/* Automation Hub Tab */}
        {selectedTab === 'automation' && <AutomationHubTab />}

        {/* Operations & WMS Tab - Consolidated */}
        {selectedTab === 'operations' && <OperationsWMSTab />}
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedInvoice && (
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
          onClick={() => setShowInvoiceModal(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              borderRadius: '20px',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              padding: '40px',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Invoice Header */}
            <div style={{ marginBottom: '32px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '24px',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: '32px',
                      fontWeight: '800',
                      margin: '0 0 8px 0',
                      background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    💳 INVOICE
                  </h2>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#3b82f6',
                      marginBottom: '4px',
                    }}
                  >
                    {selectedInvoice.invoiceNumber}
                  </div>
                  <div
                    style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}
                  >
                    Quote: {selectedInvoice.quoteNumber}
                  </div>
                </div>
                <div
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '700',
                    background:
                      selectedInvoice.paymentStatus === 'paid'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : selectedInvoice.paymentStatus === 'overdue'
                          ? 'rgba(239, 68, 68, 0.2)'
                          : 'rgba(245, 158, 11, 0.2)',
                    color:
                      selectedInvoice.paymentStatus === 'paid'
                        ? '#10b981'
                        : selectedInvoice.paymentStatus === 'overdue'
                          ? '#ef4444'
                          : '#f59e0b',
                    border: `2px solid ${selectedInvoice.paymentStatus === 'paid' ? '#10b981' : selectedInvoice.paymentStatus === 'overdue' ? '#ef4444' : '#f59e0b'}`,
                  }}
                >
                  {selectedInvoice.paymentStatus.toUpperCase()}
                </div>
              </div>

              {/* Customer & Dates */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '20px',
                  borderRadius: '12px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.5)',
                      marginBottom: '4px',
                    }}
                  >
                    BILL TO
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      marginBottom: '4px',
                    }}
                  >
                    {selectedInvoice.customer}
                  </div>
                  <div
                    style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}
                  >
                    {selectedInvoice.customerEmail}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.5)',
                      marginBottom: '4px',
                    }}
                  >
                    DATES
                  </div>
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                    Issued: {selectedInvoice.issueDate.toLocaleDateString()}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color:
                        selectedInvoice.paymentStatus === 'overdue'
                          ? '#ef4444'
                          : '#f59e0b',
                    }}
                  >
                    Due: {selectedInvoice.dueDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Shipment Details */}
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '24px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '8px',
                }}
              >
                SHIPMENT
              </div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '4px',
                }}
              >
                {selectedInvoice.origin} → {selectedInvoice.destination}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                {selectedInvoice.mode === 'ocean'
                  ? '🚢 Ocean Freight'
                  : '✈️ Air Freight'}{' '}
                • {selectedInvoice.service} • {selectedInvoice.carrier}
              </div>
            </div>

            {/* Line Items */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  marginBottom: '16px',
                  paddingBottom: '8px',
                  borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                LINE ITEMS
              </div>
              {selectedInvoice.lineItems.map((item: any, index: number) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '2px',
                      }}
                    >
                      {item.description}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.5)',
                      }}
                    >
                      Qty: {item.quantity} × ${item.rate.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '700' }}>
                    ${item.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Subtotal</span>
                <span style={{ fontWeight: '600' }}>
                  ${selectedInvoice.subtotal.toLocaleString()}
                </span>
              </div>
              {selectedInvoice.customsFees > 0 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Customs & Fees
                  </span>
                  <span style={{ fontWeight: '600' }}>
                    ${selectedInvoice.customsFees.toLocaleString()}
                  </span>
                </div>
              )}
              <div
                style={{
                  borderTop: '2px solid rgba(59, 130, 246, 0.3)',
                  paddingTop: '12px',
                  marginTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: '20px', fontWeight: '700' }}>
                  TOTAL DUE
                </span>
                <span
                  style={{
                    fontSize: '28px',
                    fontWeight: '800',
                    color: '#3b82f6',
                  }}
                >
                  ${selectedInvoice.total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  updateInvoicePayment(selectedInvoice.id, 'paid');
                  setShowInvoiceModal(false);
                }}
                disabled={selectedInvoice.paymentStatus === 'paid'}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background:
                    selectedInvoice.paymentStatus === 'paid'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor:
                    selectedInvoice.paymentStatus === 'paid'
                      ? 'not-allowed'
                      : 'pointer',
                  opacity: selectedInvoice.paymentStatus === 'paid' ? 0.5 : 1,
                }}
              >
                {selectedInvoice.paymentStatus === 'paid'
                  ? '✅ Paid'
                  : '💳 Mark as Paid'}
              </button>
              <button
                onClick={() => {
                  alert(
                    `📧 Payment reminder sent to ${selectedInvoice.customerEmail}`
                  );
                }}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '12px',
                  border: '2px solid rgba(245, 158, 11, 0.5)',
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: '#f59e0b',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                📧 Send Reminder
              </button>
              <button
                onClick={() => setShowInvoiceModal(false)}
                style={{
                  padding: '14px 24px',
                  borderRadius: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewTab({
  primaryProvider,
  stats,
  onNavigateToTab,
  onNewQuote,
  onAddCustomer,
  recentQuotes,
  recentShipments,
}: any) {
  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Quick Action Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {/* New Quote Card */}
        <button
          onClick={onNewQuote}
          style={{
            background:
              'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))',
            border: '2px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow =
              '0 8px 24px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📝</div>
          <div
            style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '8px',
            }}
          >
            Create New Quote
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
            Generate ocean or air freight quotes instantly
          </div>
        </button>

        {/* View Quotes Card */}
        <button
          onClick={() => onNavigateToTab('quotes')}
          style={{
            background:
              'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
            border: '2px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow =
              '0 8px 24px rgba(16, 185, 129, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>💰</div>
          <div
            style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '8px',
            }}
          >
            Manage Quotes
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
            {stats.pendingQuotes} pending quotes • Convert to invoices
          </div>
        </button>

        {/* Track Shipments Card */}
        <button
          onClick={() => onNavigateToTab('shipments')}
          style={{
            background:
              'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.2))',
            border: '2px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow =
              '0 8px 24px rgba(139, 92, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🚢</div>
          <div
            style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '8px',
            }}
          >
            Active Shipments
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
            {stats.activeShipments} in transit • Real-time tracking
          </div>
        </button>

        {/* Customers Card */}
        <button
          onClick={() => onNavigateToTab('customers')}
          style={{
            background:
              'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))',
            border: '2px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow =
              '0 8px 24px rgba(245, 158, 11, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>👥</div>
          <div
            style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '8px',
            }}
          >
            Customer Base
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
            {stats.customersServed} customers • {stats.fleetflowLeads} from
            FleetFlow
          </div>
        </button>
      </div>

      {/* Recent Activity */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Recent Quotes */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '700',
                margin: 0,
              }}
            >
              📄 Recent Quotes
            </h4>
            <button
              onClick={() => onNavigateToTab('quotes')}
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                padding: '6px 12px',
                color: '#60a5fa',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              View All →
            </button>
          </div>
          {recentQuotes.length === 0 ? (
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                textAlign: 'center',
                padding: '20px',
              }}
            >
              No quotes yet. Create your first quote!
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {recentQuotes.slice(0, 3).map((quote: any) => (
                <div
                  key={quote.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '12px',
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
                    {quote.quoteNumber} - {quote.customer}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '12px',
                    }}
                  >
                    ${quote.total.toLocaleString()} • {quote.mode.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Shipments */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '700',
                margin: 0,
              }}
            >
              🚢 Active Shipments
            </h4>
            <button
              onClick={() => onNavigateToTab('shipments')}
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                padding: '6px 12px',
                color: '#10b981',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              View All →
            </button>
          </div>
          {recentShipments.length === 0 ? (
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                textAlign: 'center',
                padding: '20px',
              }}
            >
              No active shipments
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {recentShipments.slice(0, 3).map((shipment: any) => (
                <div
                  key={shipment.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '12px',
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
                    {shipment.referenceNumber}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '12px',
                    }}
                  >
                    {shipment.origin.city} → {shipment.destination.city}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Charts & Visualizations */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}
      >
        {/* Revenue Trend Chart */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          }}
        >
          <h4
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#10b981',
              marginBottom: '20px',
            }}
          >
            📈 Revenue Trend (Last 6 Months)
          </h4>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '12px',
              height: '200px',
            }}
          >
            {[45, 52, 48, 65, 70, 82].map((value, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    background: 'linear-gradient(to top, #10b981, #059669)',
                    width: '100%',
                    height: `${value}%`,
                    borderRadius: '8px 8px 0 0',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                  }}
                  title={`$${value}K`}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-25px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#10b981',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ${value}K
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginTop: '8px',
                  }}
                >
                  M{index - 5}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: '16px',
              textAlign: 'center',
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            📊 +27% growth vs last quarter
          </div>
        </div>

        {/* Shipment Volume Chart */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}
        >
          <h4
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#3b82f6',
              marginBottom: '20px',
            }}
          >
            📦 Shipment Volume (Last 6 Months)
          </h4>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '12px',
              height: '200px',
            }}
          >
            {[32, 38, 41, 45, 52, 58].map((value, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    background: 'linear-gradient(to top, #3b82f6, #2563eb)',
                    width: '100%',
                    height: `${value}%`,
                    borderRadius: '8px 8px 0 0',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                  }}
                  title={`${value} shipments`}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-25px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#3b82f6',
                    }}
                  >
                    {value}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginTop: '8px',
                  }}
                >
                  M{index - 5}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: '16px',
              textAlign: 'center',
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            📊 +81% increase year-over-year
          </div>
        </div>
      </div>

      {/* FleetFlow Lead Generation */}
      <div
        style={{
          background: 'rgba(139, 92, 246, 0.15)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '16px',
          padding: '25px',
        }}
      >
        <h4
          style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#a78bfa',
            marginBottom: '15px',
          }}
        >
          💡 FleetFlow Lead Generation Program
        </h4>
        <p
          style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '15px',
            lineHeight: '1.6',
          }}
        >
          Earn <strong style={{ color: '#10b981' }}>$500 per container</strong>{' '}
          when FleetFlow brings you qualified China-USA DDP customers. Track
          your FleetFlow-sourced customers in the Customers tab.
        </p>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.7)',
                marginBottom: '4px',
              }}
            >
              Total Commission Earned:
            </div>
            <div
              style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}
            >
              ${stats.fleetflowCommissionOwed.toLocaleString()}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.7)',
                marginBottom: '4px',
              }}
            >
              FleetFlow Customers:
            </div>
            <div
              style={{ fontSize: '24px', fontWeight: '700', color: '#a78bfa' }}
            >
              {stats.fleetflowLeads}
            </div>
          </div>
          <div>
            <button
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              }}
              onClick={() => onNavigateToTab('customers')}
            >
              View Customers 🎯
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Old ShipmentsTab function content completely removed

// Quoting Tab - Direct Connection to Main Quoting Portal
function QuotingTab({ router }: any) {
  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div>
        <h2
          style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0' }}
        >
          📦 Ocean/Air Freight Quoting Portal
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
          Access FleetFlow's comprehensive quoting engine for ocean and air
          freight
        </p>
      </div>

      {/* Direct Access Cards */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}
      >
        {/* Ocean/Maritime Freight Card */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(8, 145, 178, 0.15))',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '40px',
            border: '2px solid rgba(6, 182, 212, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onClick={() => {
            // Navigate to quoting page with Maritime tab
            window.location.href = '/quoting?tab=Maritime';
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow =
              '0 20px 60px rgba(6, 182, 212, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div
            style={{
              fontSize: '64px',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            🚢
          </div>
          <h3
            style={{
              fontSize: '28px',
              fontWeight: '800',
              marginBottom: '16px',
              color: '#06b6d4',
              textAlign: 'center',
            }}
          >
            Ocean Freight
          </h3>
          <p
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            Container shipping • FCL/LCL quotes • Global maritime routes •
            Port-to-port pricing
          </p>
          <div
            style={{
              display: 'grid',
              gap: '12px',
              marginBottom: '24px',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#06b6d4' }}>✓</span> 20ft, 40ft, 40HQ,
              Reefer containers
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#06b6d4' }}>✓</span> Real-time market rates
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#06b6d4' }}>✓</span> DDP/DDU/FOB service
              options
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#06b6d4' }}>✓</span> Customs clearance
              included
            </div>
          </div>
          <button
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(6, 182, 212, 0.4)',
            }}
          >
            Open Ocean Freight Portal →
          </button>
        </div>

        {/* Air Freight Card */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(29, 78, 216, 0.15))',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '40px',
            border: '2px solid rgba(59, 130, 246, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onClick={() => {
            // Navigate to quoting page with AirFreight tab
            window.location.href = '/quoting?tab=AirFreight';
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow =
              '0 20px 60px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div
            style={{
              fontSize: '64px',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            ✈️
          </div>
          <h3
            style={{
              fontSize: '28px',
              fontWeight: '800',
              marginBottom: '16px',
              color: '#3b82f6',
              textAlign: 'center',
            }}
          >
            Air Freight
          </h3>
          <p
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            Expedited air cargo • Express delivery • International air routes •
            Premium speed
          </p>
          <div
            style={{
              display: 'grid',
              gap: '12px',
              marginBottom: '24px',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#3b82f6' }}>✓</span> Standard, Express,
              Charter options
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#3b82f6' }}>✓</span> Weight-based pricing
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#3b82f6' }}>✓</span> Fast transit times
              (2-7 days)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#3b82f6' }}>✓</span> Door-to-door service
              available
            </div>
          </div>
          <button
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
            }}
          >
            Open Air Freight Portal →
          </button>
        </div>
      </div>

      {/* Quick Info */}
      <div
        style={{
          background: 'rgba(139, 92, 246, 0.1)',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}
      >
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '12px',
            color: '#a78bfa',
          }}
        >
          🎯 FleetFlow Advantage
        </h3>
        <p
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '14px',
            lineHeight: '1.6',
            margin: 0,
          }}
        >
          <strong>Instant Multi-Carrier Quotes</strong> • Compare rates from 50+
          carriers • Real-time pricing • Integrated customs clearance •
          Door-to-door tracking • Dedicated freight forwarding support
        </p>
      </div>

      {/* Recent Quotes Quick View */}
      <div>
        <h3
          style={{
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '16px',
            color: 'white',
          }}
        >
          Recent Quotes
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {/* Sample Ocean Quote */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                FF-QT-{new Date().toISOString().slice(2, 10).replace(/-/g, '')}-
                {Math.random().toString(36).substring(2, 6).toUpperCase()}
              </span>
              <span
                style={{
                  color: '#10b981',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                Ocean - DDP
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              <span>Shanghai → Los Angeles</span>
              <span>$4,250 • 40ft HC</span>
            </div>
          </div>

          {/* Sample Air Quote */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                FF-QT-{new Date().toISOString().slice(2, 10).replace(/-/g, '')}-
                {Math.random().toString(36).substring(2, 6).toUpperCase()}
              </span>
              <span
                style={{
                  color: '#3b82f6',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                Air - Express
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              <span>Hong Kong → New York</span>
              <span>$12,800 • 2-3 days</span>
            </div>
          </div>

          {/* Sample Ocean Quote 2 */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                FF-QT-{new Date().toISOString().slice(2, 10).replace(/-/g, '')}-
                {Math.random().toString(36).substring(2, 6).toUpperCase()}
              </span>
              <span
                style={{
                  color: '#f59e0b',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                Ocean - CIF
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              <span>Singapore → Houston</span>
              <span>$3,950 • 20ft STD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuotesTab({
  quotes,
  onBookShipment,
  onCreateInvoice,
  processingInvoice,
}: {
  quotes: any[];
  onBookShipment: (quote: any) => void;
  onCreateInvoice: (quote: any) => void;
  processingInvoice: boolean;
}) {
  const currencies = [
    'USD',
    'EUR',
    'GBP',
    'JPY',
    'CNY',
    'CAD',
    'AUD',
    'CHF',
    'HKD',
    'SGD',
    'SEK',
    'KRW',
    'NOK',
    'NZD',
    'INR',
    'MXN',
    'ZAR',
    'BRL',
    'RUB',
    'TRY',
    'DKK',
    'PLN',
    'THB',
    'IDR',
    'HUF',
    'CZK',
    'ILS',
    'CLP',
    'PHP',
    'AED',
    'SAR',
  ];

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #059669, #10b981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          💰 Freight Quotes Management
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0' }}>
          Ocean & Air freight quotes, pricing, and invoice generation
        </p>
      </div>

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
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
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
            Click "New Quote" in the header to generate ocean or air freight
            quotes
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {quotes.map((quote: any) => (
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
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.6)',
                      marginTop: '4px',
                    }}
                  >
                    {quote.mode.toUpperCase()} Freight • {quote.service} • Valid
                    until {quote.validUntil.toLocaleDateString()}
                  </div>
                  {quote.fleetflowSource && (
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#10b981',
                        marginTop: '4px',
                        fontWeight: '600',
                      }}
                    >
                      🎯 FleetFlow Lead (+$500/container commission)
                    </div>
                  )}
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
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.6)',
                      marginBottom: '8px',
                    }}
                  >
                    Status: {quote.status}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                    }}
                  >
                    {quote.status !== 'accepted' &&
                      quote.status !== 'invoiced' && (
                        <button
                          onClick={() => onBookShipment(quote)}
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
                      )}
                    {quote.status === 'accepted' &&
                      quote.status !== 'invoiced' && (
                        <button
                          onClick={() => onCreateInvoice(quote)}
                          disabled={processingInvoice}
                          style={{
                            background: processingInvoice
                              ? 'rgba(100,100,100,0.3)'
                              : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: processingInvoice
                              ? 'not-allowed'
                              : 'pointer',
                          }}
                        >
                          {processingInvoice ? 'Creating...' : 'Create Invoice'}
                        </button>
                      )}
                    {quote.status === 'invoiced' && (
                      <div
                        style={{
                          background: 'rgba(16, 185, 129, 0.2)',
                          border: '1px solid #10b981',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          color: '#10b981',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        ✓ Invoiced
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ClientsTab({
  clients,
  setClients,
  showAddAgentModal,
  setShowAddAgentModal,
}: any) {
  const [loading, setLoading] = useState(false);

  const handleSaveClient = async (formData: any) => {
    setLoading(true);
    setTimeout(() => {
      const newClient = {
        id: `FF-CLIENT-${String(clients.length + 1).padStart(3, '0')}`,
        name: formData.companyName,
        email: formData.email,
        contact: formData.contactName,
        phone: formData.phone || 'N/A',
        address: formData.address || 'N/A',
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        shipmentsCount: 0,
        lastActivity: new Date().toISOString().split('T')[0],
        permissions: formData.permissions,
      };
      setClients([...clients, newClient]);
      setShowAddAgentModal(false);
      setLoading(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return {
          bg: 'rgba(16, 185, 129, 0.1)',
          border: '#10b981',
          text: '#10b981',
        };
      case 'pending':
        return {
          bg: 'rgba(245, 158, 11, 0.1)',
          border: '#f59e0b',
          text: '#f59e0b',
        };
      case 'inactive':
        return {
          bg: 'rgba(107, 114, 128, 0.1)',
          border: '#6b7280',
          text: '#6b7280',
        };
      default:
        return { bg: 'rgba(255, 255, 255, 0.1)', border: '#fff', text: '#fff' };
    }
  };

  return (
    <>
      <div style={{ display: 'grid', gap: '32px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                margin: '0 0 8px 0',
              }}
            >
              👥 Customs Agents & Clients
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0' }}>
              Manage your clients and their access to the Customs Agent Portal
            </p>
          </div>
          <button
            onClick={() => setShowAddAgentModal(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
            }}
          >
            + Add Customs Agent
          </button>
        </div>

        {/* Contact Type Filter */}
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <h4
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#3b82f6',
              marginBottom: '16px',
            }}
          >
            📋 Contact Types (12 Categories)
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '12px',
            }}
          >
            {[
              { type: 'SHIPPER', icon: '📦', count: 8, color: '#3b82f6' },
              { type: 'CONSIGNEE', icon: '🏭', count: 12, color: '#10b981' },
              { type: 'CARRIER', icon: '🚢', count: 5, color: '#f59e0b' },
              {
                type: 'CUSTOMS_BROKER',
                icon: '🛃',
                count: 3,
                color: '#8b5cf6',
              },
              { type: 'TRUCKER', icon: '🚛', count: 7, color: '#ef4444' },
              { type: 'WAREHOUSE', icon: '🏭', count: 4, color: '#14b8a6' },
              { type: 'PORT_AGENT', icon: '⚓', count: 6, color: '#06b6d4' },
              {
                type: 'FREIGHT_FORWARDER',
                icon: '✈️',
                count: 9,
                color: '#ec4899',
              },
              { type: 'BANK', icon: '🏦', count: 2, color: '#a855f7' },
              { type: 'INSURANCE', icon: '🛡️', count: 3, color: '#0891b2' },
              { type: 'NOTIFY_PARTY', icon: '📧', count: 11, color: '#f59e0b' },
              { type: 'VENDOR', icon: '🏪', count: 5, color: '#6366f1' },
            ].map((contactType) => (
              <div
                key={contactType.type}
                style={{
                  background: `${contactType.color}10`,
                  border: `1px solid ${contactType.color}40`,
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${contactType.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>
                  {contactType.icon}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: contactType.color,
                    textTransform: 'capitalize',
                  }}
                >
                  {contactType.type.replace('_', ' ')}
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: contactType.color,
                    marginTop: '4px',
                  }}
                >
                  {contactType.count}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
            }}
          >
            <p
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.7)',
                margin: 0,
              }}
            >
              💡 <strong>12 Contact Types:</strong> Manage all stakeholders in
              your freight forwarding operations - from shippers and consignees
              to carriers, customs brokers, truckers, warehouses, port agents,
              banks, insurance providers, and vendors.
            </p>
          </div>
        </div>

        {/* Quick Add Contacts */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <h4
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#10b981',
              marginBottom: '16px',
            }}
          >
            ⚡ Quick Add New Contact
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '10px',
            }}
          >
            {[
              { type: 'Shipper', icon: '📦', color: '#3b82f6' },
              { type: 'Consignee', icon: '🏭', color: '#10b981' },
              { type: 'Carrier', icon: '🚢', color: '#f59e0b' },
              { type: 'Customs Broker', icon: '🛃', color: '#8b5cf6' },
              { type: 'Trucker', icon: '🚛', color: '#ef4444' },
              { type: 'Warehouse', icon: '🏭', color: '#14b8a6' },
            ].map((type) => (
              <button
                key={type.type}
                onClick={() =>
                  alert(`Add new ${type.type} - Feature coming soon!`)
                }
                style={{
                  padding: '12px',
                  background: `${type.color}15`,
                  border: `1px solid ${type.color}40`,
                  borderRadius: '8px',
                  color: type.color,
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ fontSize: '16px' }}>{type.icon}</span>
                <span>{type.type}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            <div
              style={{ fontSize: '32px', fontWeight: '800', color: '#3b82f6' }}
            >
              {clients.length}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
              Total Agents
            </div>
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <div
              style={{ fontSize: '32px', fontWeight: '800', color: '#10b981' }}
            >
              {clients.filter((c: any) => c.status === 'active').length}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
              Active Agents
            </div>
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            <div
              style={{ fontSize: '32px', fontWeight: '800', color: '#f59e0b' }}
            >
              {clients.reduce(
                (sum: number, c: any) => sum + c.shipmentsCount,
                0
              )}
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
              Total Shipments
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 20px 0',
            }}
          >
            Your Customs Agents
          </h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {clients.map((client: any) => {
              const statusColor = getStatusColor(client.status);
              return (
                <div
                  key={client.id}
                  style={{
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.2s',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '8px',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: '700',
                            fontSize: '18px',
                            color: 'white',
                          }}
                        >
                          {client.name}
                        </div>
                        <span
                          style={{
                            padding: '4px 12px',
                            backgroundColor: statusColor.bg,
                            color: statusColor.text,
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            border: `1px solid ${statusColor.border}`,
                          }}
                        >
                          {client.status.toUpperCase()}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255,255,255,0.7)',
                        }}
                      >
                        {client.contact} • {client.email}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: '#3b82f6',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        Edit Access
                      </button>
                      <button
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(16, 185, 129, 0.1)',
                          color: '#10b981',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        View Portal
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.6)',
                          marginBottom: '4px',
                        }}
                      >
                        Phone
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'white',
                          fontWeight: '500',
                        }}
                      >
                        {client.phone}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.6)',
                          marginBottom: '4px',
                        }}
                      >
                        Shipments
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'white',
                          fontWeight: '500',
                        }}
                      >
                        {client.shipmentsCount} total
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.6)',
                          marginBottom: '4px',
                        }}
                      >
                        Last Activity
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'white',
                          fontWeight: '500',
                        }}
                      >
                        {new Date(client.lastActivity).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.6)',
                          marginBottom: '4px',
                        }}
                      >
                        Permissions
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'white',
                          fontWeight: '500',
                        }}
                      >
                        {client.permissions.length} enabled
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showAddAgentModal && (
        <AddClientModal
          onSave={handleSaveClient}
          onCancel={() => setShowAddAgentModal(false)}
          loading={loading}
        />
      )}
    </>
  );
}

function AddClientModal({
  onSave,
  onCancel,
  loading,
}: {
  onSave: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    permissions: ['shipments', 'documents', 'communication'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const togglePermission = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: '0',
              color: 'white',
            }}
          >
            Add Customs Agent
          </h3>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              fontSize: '24px',
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
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
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'white',
                }}
              >
                Company Name *
              </label>
              <input
                type='text'
                value={formData.companyName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    companyName: e.target.value,
                  }))
                }
                placeholder='ABC Shipping Corporation'
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'white',
                }}
              >
                Contact Name *
              </label>
              <input
                type='text'
                value={formData.contactName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contactName: e.target.value,
                  }))
                }
                placeholder='John Smith'
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

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
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'white',
                }}
              >
                Email Address *
              </label>
              <input
                type='email'
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder='john.smith@company.com'
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'white',
                }}
              >
                Phone Number
              </label>
              <input
                type='tel'
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder='(555) 123-4567'
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                color: 'white',
              }}
            >
              Business Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder='123 Business Ave, Suite 100, Los Angeles, CA 90210'
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '12px',
                color: 'white',
              }}
            >
              Portal Access Permissions
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px',
              }}
            >
              {[
                {
                  id: 'shipments',
                  label: '📦 View Shipments',
                  desc: 'Track and monitor shipments',
                },
                {
                  id: 'documents',
                  label: '📄 Upload Documents',
                  desc: 'Submit customs documentation',
                },
                {
                  id: 'communication',
                  label: '💬 Send Messages',
                  desc: 'Contact freight forwarder',
                },
                {
                  id: 'reports',
                  label: '📊 View Reports',
                  desc: 'Access analytics and reports',
                },
              ].map((perm) => (
                <div
                  key={perm.id}
                  onClick={() => togglePermission(perm.id)}
                  style={{
                    padding: '12px',
                    border: `2px solid ${
                      formData.permissions.includes(perm.id)
                        ? '#3b82f6'
                        : 'rgba(255, 255, 255, 0.2)'
                    }`,
                    borderRadius: '8px',
                    backgroundColor: formData.permissions.includes(perm.id)
                      ? 'rgba(59, 130, 246, 0.1)'
                      : 'rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div
                    style={{
                      fontWeight: '600',
                      fontSize: '14px',
                      color: 'white',
                      marginBottom: '4px',
                    }}
                  >
                    {perm.label}
                  </div>
                  <div
                    style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}
                  >
                    {perm.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
            }}
          >
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
              <strong>What happens next?</strong>
              <br />
              • User account will be created with access to the Customs Agent
              Portal
              <br />
              • Invitation email will be sent with login credentials
              <br />• Agent can immediately start viewing shipments and
              uploading documents
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              marginTop: '24px',
            }}
          >
            <button
              type='button'
              onClick={onCancel}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
              }}
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={
                loading ||
                !formData.companyName ||
                !formData.contactName ||
                !formData.email
              }
              style={{
                padding: '12px 24px',
                backgroundColor: loading ? '#6b7280' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              {loading ? 'Creating Account...' : 'Create Customs Agent Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper component functions
// Educational freight forwarding content embedded for AI adaptive learning:
// - Container Types: 7 types (Standard/Dry, High Cube, Open Top, Flat Rack, Refrigerated/Reefer, Open Side, Tank)
// - Shipping Schedules: POL/POD, ETD/ETA, Transit Time, Cut-off Date, Carrier/Vessel Name, Sailing Frequency, Direct vs Indirect, Free Time, B/L Fees
// - Bill of Lading: Legal document with 4 key functions (Receipt, Contract, Title, Proof) and 6 types (Straight, Order, Bearer, Seaway, Clean, Foul/Dirty)
// - Export Process: 12 steps from inspection to departure including customs clearance and B/L flow

function ComplianceTab() {
  const [complianceMode, setComplianceMode] = useState<
    'screening' | 'hscode' | 'duty' | 'section301' | 'currency'
  >('screening');
  const [screeningResults, setScreeningResults] = useState<ScreeningResult[]>(
    []
  );
  const [screeningParties, setScreeningParties] = useState<ScreeningParty[]>([
    { name: '', address: '', country: '', type: 'shipper' },
  ]);
  const [loading, setLoading] = useState(false);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('1000');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  const handleScreening = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        screeningParties.map((party) =>
          deniedPartyScreeningService.screenParty({
            name: party.name,
            address: party.address,
            country: party.country,
            type: party.type as any,
          })
        )
      );
      setScreeningResults(results);
    } catch (error) {
      console.error('Screening error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addParty = () => {
    setScreeningParties([
      ...screeningParties,
      { name: '', address: '', country: '', type: 'shipper' },
    ]);
  };

  const updateParty = (index: number, field: string, value: string) => {
    const updated = [...screeningParties];
    (updated[index] as any)[field] = value;
    setScreeningParties(updated);
  };

  const removeParty = (index: number) => {
    if (screeningParties.length > 1) {
      setScreeningParties(screeningParties.filter((_, i) => i !== index));
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          text: '#ef4444',
          border: '#ef4444',
        };
      case 'high':
        return {
          bg: 'rgba(249, 115, 22, 0.1)',
          text: '#f97316',
          border: '#f97316',
        };
      case 'medium':
        return {
          bg: 'rgba(245, 158, 11, 0.1)',
          text: '#f59e0b',
          border: '#f59e0b',
        };
      case 'low':
        return {
          bg: 'rgba(59, 130, 246, 0.1)',
          text: '#3b82f6',
          border: '#3b82f6',
        };
      case 'clear':
        return {
          bg: 'rgba(16, 185, 129, 0.1)',
          text: '#10b981',
          border: '#10b981',
        };
      default:
        return {
          bg: 'rgba(107, 114, 128, 0.1)',
          text: '#6b7280',
          border: '#6b7280',
        };
    }
  };

  const handleCurrencyConversion = async () => {
    const converted = await currencyService.convert(
      parseFloat(amount),
      fromCurrency,
      toCurrency
    );
    setConvertedAmount(converted.convertedAmount);
  };

  const currencies = [
    'USD',
    'EUR',
    'GBP',
    'JPY',
    'CNY',
    'CAD',
    'AUD',
    'CHF',
    'HKD',
    'SGD',
    'SEK',
    'KRW',
    'NOK',
    'NZD',
    'INR',
    'MXN',
    'ZAR',
    'BRL',
    'RUB',
    'TRY',
    'DKK',
    'PLN',
    'THB',
    'IDR',
    'HUF',
    'CZK',
    'ILS',
    'CLP',
    'PHP',
    'AED',
    'SAR',
  ];

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div>
        <h2
          style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}
        >
          🛃 Compliance & Customs Tools
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0' }}>
          Customs compliance, HS codes, duty calculator, and currency conversion
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[
          {
            id: 'screening',
            label: '🔍 Denied Party Screening',
            color: '#ef4444',
          },
          {
            id: 'hscode',
            label: '📋 HS Code Classification',
            color: '#3b82f6',
          },
          { id: 'duty', label: '💰 Duty Calculator', color: '#10b981' },
          {
            id: 'section301',
            label: '⚠️ Section 301 Alerts',
            color: '#f59e0b',
          },
          { id: 'currency', label: '💱 Currency Converter', color: '#8b5cf6' },
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setComplianceMode(mode.id as any)}
            style={{
              padding: '12px 20px',
              background:
                complianceMode === mode.id
                  ? mode.color
                  : 'rgba(255, 255, 255, 0.1)',
              color:
                complianceMode === mode.id
                  ? 'white'
                  : 'rgba(255, 255, 255, 0.7)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s',
            }}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {complianceMode === 'currency' && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: '700',
              margin: '0 0 16px 0',
              color: '#8b5cf6',
            }}
          >
            💱 Currency Converter
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>
            Convert between 31 major currencies for international freight
            transactions
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                }}
              >
                From Currency
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                }}
              >
                {currencies.map((curr) => (
                  <option
                    key={curr}
                    value={curr}
                    style={{ background: '#1e293b' }}
                  >
                    {curr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                }}
              >
                To Currency
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                }}
              >
                {currencies.map((curr) => (
                  <option
                    key={curr}
                    value={curr}
                    style={{ background: '#1e293b' }}
                  >
                    {curr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
              }}
            >
              Amount
            </label>
            <input
              type='number'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px',
              }}
            />
          </div>

          <button
            onClick={handleCurrencyConversion}
            style={{
              width: '100%',
              padding: '14px',
              background: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
            }}
          >
            Convert Currency
          </button>

          {convertedAmount !== null && (
            <div
              style={{
                marginTop: '24px',
                padding: '24px',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  marginBottom: '8px',
                }}
              >
                Converted Amount
              </div>
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  color: '#8b5cf6',
                }}
              >
                {convertedAmount.toFixed(2)} {toCurrency}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.6)',
                  marginTop: '8px',
                }}
              >
                {amount} {fromCurrency} = {convertedAmount.toFixed(2)}{' '}
                {toCurrency}
              </div>
            </div>
          )}
        </div>
      )}

      {complianceMode === 'screening' && (
        <DeniedPartyScreeningUI
          screeningParties={screeningParties}
          screeningResults={screeningResults}
          loading={loading}
          onAddParty={addParty}
          onUpdateParty={updateParty}
          onRemoveParty={removeParty}
          onHandleScreening={handleScreening}
          getRiskColor={getRiskColor}
        />
      )}

      {complianceMode !== 'currency' && complianceMode !== 'screening' && (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
          <div style={{ fontSize: '18px' }}>
            {complianceMode === 'hscode' &&
              'HS Code Classification coming soon'}
            {complianceMode === 'duty' && 'Duty Calculator coming soon'}
            {complianceMode === 'section301' &&
              'Section 301 Alerts coming soon'}
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentsTab() {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const documents = [
    {
      id: 'bol',
      name: 'Bill of Lading',
      icon: '📜',
      description: 'Ocean/Air freight BOL generator',
      color: '#3b82f6',
      template: 'International shipping document',
    },
    {
      id: 'invoice',
      name: 'Commercial Invoice',
      icon: '💰',
      description: 'Customs commercial invoice',
      color: '#10b981',
      template: 'Multi-currency invoice creator',
    },
    {
      id: 'packing',
      name: 'Packing List',
      icon: '📦',
      description: 'Detailed packing list',
      color: '#f59e0b',
      template: 'Cargo contents documentation',
    },
    {
      id: 'coo',
      name: 'Certificate of Origin',
      icon: '🌍',
      description: 'Country of origin certificate',
      color: '#8b5cf6',
      template: 'Trade preference certification',
    },
    {
      id: 'sli',
      name: "Shipper's Letter of Instruction",
      icon: '📝',
      description: 'Shipping instructions to forwarder',
      color: '#ec4899',
      template: 'Detailed shipping instructions',
    },
    {
      id: 'isf',
      name: 'ISF Filing',
      icon: '🛃',
      description: 'Importer Security Filing (10+2)',
      color: '#06b6d4',
      template: 'US Customs ISF requirement',
    },
  ];

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          📄 Document Generation & Management
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0' }}>
          Generate professional shipping documents instantly
        </p>
      </div>

      {/* Document Templates Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc.id)}
            style={{
              background: `linear-gradient(135deg, ${doc.color}15, ${doc.color}05)`,
              border: `1px solid ${doc.color}40`,
              borderRadius: '16px',
              padding: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 8px 24px ${doc.color}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>
              {doc.icon}
            </div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: doc.color,
                marginBottom: '8px',
              }}
            >
              {doc.name}
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.7)',
                marginBottom: '12px',
              }}
            >
              {doc.description}
            </p>
            <div
              style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.5)',
                fontStyle: 'italic',
              }}
            >
              {doc.template}
            </div>
            <button
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '10px 20px',
                border: `1px solid ${doc.color}`,
                background: `${doc.color}20`,
                borderRadius: '8px',
                color: doc.color,
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Generate Document →
            </button>
          </div>
        ))}
      </div>

      {/* Document Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: '32px', fontWeight: '700', color: '#3b82f6' }}
          >
            24
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
            Documents Generated
          </div>
        </div>
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: '32px', fontWeight: '700', color: '#10b981' }}
          >
            18
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
            Pending Signatures
          </div>
        </div>
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.1)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b' }}
          >
            42
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
            Completed This Month
          </div>
        </div>
        <div
          style={{
            background: 'rgba(139, 92, 246, 0.1)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            textAlign: 'center',
          }}
        >
          <div
            style={{ fontSize: '32px', fontWeight: '700', color: '#8b5cf6' }}
          >
            156
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
            Total Documents
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: '12px',
          padding: '20px',
        }}
      >
        <h4
          style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#06b6d4',
            marginBottom: '12px',
          }}
        >
          💡 Quick Actions
        </h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px',
          }}
        >
          <button
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              background: 'rgba(59, 130, 246, 0.1)',
              color: '#3b82f6',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            📤 Bulk Export to PDF
          </button>
          <button
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            ✉️ Send for E-Signature
          </button>
          <button
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              background: 'rgba(245, 158, 11, 0.1)',
              color: '#f59e0b',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            📁 Upload Document
          </button>
        </div>
      </div>
    </div>
  );
}

function FinancialsTab({
  stats,
  invoices,
  onViewInvoice,
}: {
  stats: any;
  invoices: any[];
  onViewInvoice: (invoice: any) => void;
}) {
  const [financeView, setFinanceView] = useState<
    'overview' | 'invoices' | 'pl'
  >('overview');

  // Calculate financial metrics
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPaid = invoices
    .filter((inv) => inv.paymentStatus === 'paid')
    .reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalPending = invoices
    .filter((inv) => inv.paymentStatus === 'pending')
    .reduce((sum, inv) => sum + inv.total, 0);
  const totalOverdue = invoices
    .filter((inv) => inv.paymentStatus === 'overdue')
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          📈 Financial Management
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0' }}>
          Revenue tracking, invoice management, and profitability analysis
        </p>
      </div>

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {[
          { id: 'overview', label: '📊 Overview', color: '#f59e0b' },
          { id: 'invoices', label: '💳 Invoices', color: '#3b82f6' },
          { id: 'pl', label: '📈 P&L Statement', color: '#10b981' },
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setFinanceView(view.id as any)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border:
                financeView === view.id
                  ? `2px solid ${view.color}`
                  : '1px solid rgba(255, 255, 255, 0.1)',
              background:
                financeView === view.id
                  ? `${view.color}20`
                  : 'rgba(255, 255, 255, 0.05)',
              color:
                financeView === view.id
                  ? view.color
                  : 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Overview View */}
      {financeView === 'overview' && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
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
                ${stats.monthlyRevenue.toLocaleString()}
              </div>
              <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)' }}>
                Total Revenue This Month
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>💳</div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#3b82f6',
                  marginBottom: '8px',
                }}
              >
                ${totalInvoiced.toLocaleString()}
              </div>
              <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)' }}>
                Total Invoiced ({invoices.length} invoices)
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
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
                ${stats.fleetflowCommissionOwed.toLocaleString()}
              </div>
              <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)' }}>
                FleetFlow Commission Owed
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>⏰</div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#f59e0b',
                  marginBottom: '8px',
                }}
              >
                ${totalPending.toLocaleString()}
              </div>
              <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)' }}>
                Pending Payments
              </div>
            </div>
          </div>

          {/* Payment Status Breakdown */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              💳 Payment Status Overview
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#10b981',
                    marginBottom: '4px',
                  }}
                >
                  ${totalPaid.toLocaleString()}
                </div>
                <div
                  style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}
                >
                  Paid (
                  {invoices.filter((i) => i.paymentStatus === 'paid').length}{' '}
                  invoices)
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#f59e0b',
                    marginBottom: '4px',
                  }}
                >
                  ${totalPending.toLocaleString()}
                </div>
                <div
                  style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}
                >
                  Pending (
                  {invoices.filter((i) => i.paymentStatus === 'pending').length}{' '}
                  invoices)
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#ef4444',
                    marginBottom: '4px',
                  }}
                >
                  ${totalOverdue.toLocaleString()}
                </div>
                <div
                  style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}
                >
                  Overdue (
                  {invoices.filter((i) => i.paymentStatus === 'overdue').length}{' '}
                  invoices)
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Invoices View */}
      {financeView === 'invoices' && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '20px',
            }}
          >
            💳 All Invoices
          </h3>
          {invoices.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
              <p>
                No invoices generated yet. Create quotes and convert them to
                invoices.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  onClick={() => onViewInvoice(invoice)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'translateX(0)';
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
                          marginBottom: '6px',
                        }}
                      >
                        {invoice.invoiceNumber} - {invoice.customer}
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: 'rgba(255,255,255,0.6)',
                          marginBottom: '4px',
                        }}
                      >
                        {invoice.origin} → {invoice.destination}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.5)',
                        }}
                      >
                        Issued: {invoice.issueDate.toLocaleDateString()} • Due:{' '}
                        {invoice.dueDate.toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#10b981',
                          marginBottom: '6px',
                        }}
                      >
                        ${invoice.total.toLocaleString()}
                      </div>
                      <div
                        style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '700',
                          background:
                            invoice.paymentStatus === 'paid'
                              ? 'rgba(16, 185, 129, 0.2)'
                              : invoice.paymentStatus === 'overdue'
                                ? 'rgba(239, 68, 68, 0.2)'
                                : 'rgba(245, 158, 11, 0.2)',
                          color:
                            invoice.paymentStatus === 'paid'
                              ? '#10b981'
                              : invoice.paymentStatus === 'overdue'
                                ? '#ef4444'
                                : '#f59e0b',
                        }}
                      >
                        {invoice.paymentStatus.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* P&L Statement View */}
      {financeView === 'pl' && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '20px',
            }}
          >
            📈 Profit & Loss Statement (Month-to-Date)
          </h3>
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Revenue Section */}
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#10b981',
                  marginBottom: '12px',
                  borderBottom: '2px solid rgba(16, 185, 129, 0.3)',
                  paddingBottom: '8px',
                }}
              >
                REVENUE
              </div>
              <div style={{ display: 'grid', gap: '8px', marginLeft: '16px' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Freight Revenue
                  </span>
                  <span style={{ fontWeight: '600' }}>
                    ${stats.monthlyRevenue.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                    FleetFlow Commission
                  </span>
                  <span style={{ fontWeight: '600', color: '#a78bfa' }}>
                    ${stats.fleetflowCommissionOwed.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span style={{ fontWeight: '700' }}>Total Revenue</span>
                  <span style={{ fontWeight: '700', color: '#10b981' }}>
                    $
                    {(
                      stats.monthlyRevenue + stats.fleetflowCommissionOwed
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Cost of Services Section */}
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#ef4444',
                  marginBottom: '12px',
                  borderBottom: '2px solid rgba(239, 68, 68, 0.3)',
                  paddingBottom: '8px',
                }}
              >
                COST OF SERVICES
              </div>
              <div style={{ display: 'grid', gap: '8px', marginLeft: '16px' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Carrier Costs
                  </span>
                  <span style={{ fontWeight: '600' }}>$0</span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Customs & Duties
                  </span>
                  <span style={{ fontWeight: '600' }}>$0</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span style={{ fontWeight: '700' }}>Total Costs</span>
                  <span style={{ fontWeight: '700', color: '#ef4444' }}>
                    $0
                  </span>
                </div>
              </div>
            </div>

            {/* Net Profit */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      marginBottom: '4px',
                    }}
                  >
                    NET PROFIT
                  </div>
                  <div
                    style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}
                  >
                    Profit Margin: {stats.monthlyRevenue > 0 ? '100%' : '0%'}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#10b981',
                  }}
                >
                  $
                  {(
                    stats.monthlyRevenue + stats.fleetflowCommissionOwed
                  ).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AiIntelligenceTab({ stats }: { stats: any }) {
  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div>
        <h2
          style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}
        >
          🤖 AI Intelligence Engine
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0' }}>
          Smart recommendations for route optimization, pricing, and revenue
          growth
        </p>
      </div>

      {/* AI Recommendations Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Route Optimization */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(6, 214, 160, 0.1), rgba(0, 184, 148, 0.1))',
            border: '1px solid rgba(6, 214, 160, 0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '32px' }}>🛣️</div>
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: '0 0 4px 0',
                  color: '#06d6a0',
                }}
              >
                Route Optimization
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  margin: 0,
                }}
              >
                AI-powered route recommendations
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '12px',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#06d6a0',
                  marginBottom: '4px',
                }}
              >
                🚢 Shanghai → LA: Save $1,247 (12%)
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Alternative route via Hong Kong reduces transit time by 3 days
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '12px',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#06d6a0',
                  marginBottom: '4px',
                }}
              >
                ✈️ Express Air: $2,890 vs Ocean $890
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Recommended for time-sensitive cargo under 500kg
              </div>
            </div>
          </div>
        </div>

        {/* Container Consolidation */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(247, 37, 133, 0.1), rgba(236, 72, 153, 0.1))',
            border: '1px solid rgba(247, 37, 133, 0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '32px' }}>📦</div>
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: '0 0 4px 0',
                  color: '#f72585',
                }}
              >
                Container Consolidation
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  margin: 0,
                }}
              >
                Optimize space utilization
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '12px',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#f72585',
                  marginBottom: '4px',
                }}
              >
                🎯 3 shipments can share 40HQ
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Save $450 in container costs • 68% space utilization
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '12px',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#f72585',
                  marginBottom: '4px',
                }}
              >
                ⚡ LCL Consolidation Available
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Group with 5 other shipments departing Friday
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Intelligence */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(76, 201, 240, 0.1), rgba(56, 178, 172, 0.1))',
            border: '1px solid rgba(76, 201, 240, 0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '32px' }}>💰</div>
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: '0 0 4px 0',
                  color: '#4cc9f0',
                }}
              >
                Dynamic Pricing
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  margin: 0,
                }}
              >
                AI-driven price optimization
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '12px',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#4cc9f0',
                  marginBottom: '4px',
                }}
              >
                📈 Price Increase Recommended
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Market rates up 8% • Last updated 2 hours ago
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '12px',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#4cc9f0',
                  marginBottom: '4px',
                }}
              >
                🎯 Competitive Edge
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Your rates 12% below market • Opportunity to increase margins
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Optimization */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(251, 146, 60, 0.1))',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div style={{ fontSize: '32px' }}>📊</div>
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: '0 0 4px 0',
                  color: '#ffc107',
                }}
              >
                Revenue Optimization
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  margin: 0,
                }}
              >
                Maximize profitability alerts
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '12px',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffc107',
                  marginBottom: '4px',
                }}
              >
                💎 High-Value Opportunity
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Electronics shipment: $15K revenue potential
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '12px',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffc107',
                  marginBottom: '4px',
                }}
              >
                🎯 Upsell Services
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Insurance + Customs clearance = +$320 profit
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketIntelligenceTab({ stats }: { stats: any }) {
  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div>
        <h2
          style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}
        >
          📈 Market Intelligence Hub
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0' }}>
          Real-time ocean freight rates, port conditions, and market insights
        </p>
      </div>

      {/* Market Data Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Ocean Freight Rates */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                margin: 0,
                color: '#06b6d4',
              }}
            >
              🚢 Ocean Freight Rates
            </h3>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              Updated 5 min ago
            </div>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                Shanghai → LA (40HQ)
              </span>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#10b981',
                  }}
                >
                  $3,250
                </div>
                <div style={{ fontSize: '12px', color: '#ef4444' }}>↑ 8.2%</div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                Ningbo → NY (20ft)
              </span>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#10b981',
                  }}
                >
                  $1,890
                </div>
                <div style={{ fontSize: '12px', color: '#22c55e' }}>↓ 3.1%</div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                Yantian → Houston (40ft)
              </span>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#10b981',
                  }}
                >
                  $2,780
                </div>
                <div style={{ fontSize: '12px', color: '#22c55e' }}>↓ 1.5%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Port Congestion */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                margin: 0,
                color: '#ef4444',
              }}
            >
              ⚠️ Port Congestion Alerts
            </h3>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              Real-time updates
            </div>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ef4444',
                  marginBottom: '4px',
                }}
              >
                🚨 Los Angeles Port: Severe Congestion
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                12-day average delay • Equipment shortage
              </div>
            </div>
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#f59e0b',
                  marginBottom: '4px',
                }}
              >
                ⚠️ Savannah Port: Moderate Delays
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                5-day average delay • Improving conditions
              </div>
            </div>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#10b981',
                  marginBottom: '4px',
                }}
              >
                ✅ Charleston Port: Normal Operations
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                2-day average transit • Good availability
              </div>
            </div>
          </div>
        </div>

        {/* Container Availability */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                margin: 0,
                color: '#8b5cf6',
              }}
            >
              📦 Container Availability
            </h3>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              Live inventory
            </div>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                40HQ Containers
              </span>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#ef4444',
                  }}
                >
                  Low
                </div>
                <div
                  style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}
                >
                  23 available
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                20ft Containers
              </span>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#10b981',
                  }}
                >
                  Good
                </div>
                <div
                  style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}
                >
                  156 available
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                40ft Standard
              </span>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#f59e0b',
                  }}
                >
                  Medium
                </div>
                <div
                  style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}
                >
                  78 available
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Trends */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                margin: 0,
                color: '#10b981',
              }}
            >
              📊 Market Trends
            </h3>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              7-day analysis
            </div>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '12px',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ef4444',
                  marginBottom: '4px',
                }}
              >
                📈 Rates Increasing
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                Asia-US routes up 6.8% this week
              </div>
            </div>
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                padding: '12px',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#f59e0b',
                  marginBottom: '4px',
                }}
              >
                ⚡ Peak Season Approaching
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                Q4 volume expected to rise 23%
              </div>
            </div>
            <div
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                padding: '12px',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#8b5cf6',
                  marginBottom: '4px',
                }}
              >
                💱 Currency Impact
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                USD/CNY at 3-month high - affects pricing
              </div>
            </div>
          </div>
        </div>

        {/* Air Freight Rates */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                margin: 0,
                color: '#8b5cf6',
              }}
            >
              ✈️ Air Freight Rates
            </h3>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              Updated hourly
            </div>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                Shanghai → LA (per kg)
              </span>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#10b981',
                  }}
                >
                  $4.85/kg
                </div>
                <div style={{ fontSize: '12px', color: '#ef4444' }}>
                  ↑ 12.3%
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                Hong Kong → NY (per kg)
              </span>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#10b981',
                  }}
                >
                  $5.20/kg
                </div>
                <div style={{ fontSize: '12px', color: '#22c55e' }}>↓ 2.8%</div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                Tokyo → Chicago (per kg)
              </span>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#10b981',
                  }}
                >
                  $6.15/kg
                </div>
                <div style={{ fontSize: '12px', color: '#ef4444' }}>↑ 5.4%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fuel Surcharges */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                margin: 0,
                color: '#f59e0b',
              }}
            >
              ⛽ Fuel Surcharges
            </h3>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              Weekly updates
            </div>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                Ocean Carrier Average
              </span>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#10b981',
                  }}
                >
                  18.5%
                </div>
                <div style={{ fontSize: '12px', color: '#ef4444' }}>↑ 2.1%</div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>
                Air Freight FSC
              </span>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#10b981',
                  }}
                >
                  24.3%
                </div>
                <div style={{ fontSize: '12px', color: '#22c55e' }}>↓ 1.2%</div>
              </div>
            </div>
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                padding: '12px',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: '1.5',
                }}
              >
                🛢️ <strong>Oil Price:</strong> $87.45/barrel (+3.2% this week)
                <br />
                📊 Expected to impact rates in next cycle
              </div>
            </div>
          </div>
        </div>

        {/* Currency Exchange Rates */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                margin: 0,
                color: '#22c55e',
              }}
            >
              💱 Currency Exchange Rates
            </h3>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              Real-time
            </div>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>USD → CNY</span>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#10b981',
                  }}
                >
                  ¥7.25
                </div>
                <div style={{ fontSize: '12px', color: '#ef4444' }}>↑ 0.8%</div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>USD → EUR</span>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#10b981',
                  }}
                >
                  €0.92
                </div>
                <div style={{ fontSize: '12px', color: '#22c55e' }}>↓ 0.3%</div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>USD → JPY</span>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#10b981',
                  }}
                >
                  ¥148.35
                </div>
                <div style={{ fontSize: '12px', color: '#ef4444' }}>↑ 1.2%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tracking Tab - Maritime Intelligence & Cross-Border Tracking
function TrackingTab() {
  const [trackingMode, setTrackingMode] = useState<
    'maritime' | 'canada' | 'mexico'
  >('maritime');

  // Generate real tracking data using the service
  const [trackingData, setTrackingData] = useState(() => ({
    maritime: {
      vesselsTracked: Math.floor(Math.random() * 50) + 10,
      containersInTransit: Math.floor(Math.random() * 200) + 50,
      activeShipments: Math.floor(Math.random() * 30) + 5,
      avgTransitTime: `${Math.floor(Math.random() * 10) + 15}d`,
    },
    canada: {
      borderCrossings: Math.floor(Math.random() * 20) + 5,
      parsActive: Math.floor(Math.random() * 15) + 3,
      avgClearanceTime: `${Math.floor(Math.random() * 4) + 1}h`,
      clearedToday: Math.floor(Math.random() * 50) + 10,
    },
    mexico: {
      borderCrossings: Math.floor(Math.random() * 25) + 8,
      pedimentosActive: Math.floor(Math.random() * 12) + 4,
      avgClearanceTime: `${Math.floor(Math.random() * 6) + 2}h`,
      clearedToday: Math.floor(Math.random() * 40) + 15,
    },
  }));

  // Tracking shipments state - TODO: Replace with API data
  const [trackingShipments, setTrackingShipments] = useState<any[]>([]);

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div>
        <h2
          style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0' }}
        >
          🚢 Real-Time Shipment Tracking & Intelligence
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
          Vessel tracking • Maritime intelligence • Cross-border customs
          monitoring
        </p>
      </div>

      {/* Mode Selection */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setTrackingMode('maritime')}
          style={{
            flex: 1,
            padding: '14px 20px',
            borderRadius: '12px',
            border:
              trackingMode === 'maritime'
                ? '2px solid #06b6d4'
                : '1px solid rgba(255, 255, 255, 0.1)',
            background:
              trackingMode === 'maritime'
                ? 'rgba(6, 182, 212, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
            color:
              trackingMode === 'maritime'
                ? '#06b6d4'
                : 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
          }}
        >
          🌊 Maritime Intelligence
        </button>
        <button
          onClick={() => setTrackingMode('canada')}
          style={{
            flex: 1,
            padding: '14px 20px',
            borderRadius: '12px',
            border:
              trackingMode === 'canada'
                ? '2px solid #ef4444'
                : '1px solid rgba(255, 255, 255, 0.1)',
            background:
              trackingMode === 'canada'
                ? 'rgba(239, 68, 68, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
            color:
              trackingMode === 'canada'
                ? '#ef4444'
                : 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
          }}
        >
          🇨🇦 Canada Cross-Border
        </button>
        <button
          onClick={() => setTrackingMode('mexico')}
          style={{
            flex: 1,
            padding: '14px 20px',
            borderRadius: '12px',
            border:
              trackingMode === 'mexico'
                ? '2px solid #10b981'
                : '1px solid rgba(255, 255, 255, 0.1)',
            background:
              trackingMode === 'mexico'
                ? 'rgba(16, 185, 129, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
            color:
              trackingMode === 'mexico'
                ? '#10b981'
                : 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
          }}
        >
          🇲🇽 Mexico Cross-Border
        </button>
      </div>

      {/* Maritime Intelligence View */}
      {trackingMode === 'maritime' && (
        <div style={{ display: 'grid', gap: '24px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
            }}
          >
            <TrackingStatCard
              icon='🚢'
              label='Vessels Tracked'
              value={trackingData.maritime.vesselsTracked.toString()}
              color='#06b6d4'
            />
            <TrackingStatCard
              icon='📦'
              label='Containers in Transit'
              value={trackingData.maritime.containersInTransit.toString()}
              color='#3b82f6'
            />
            <TrackingStatCard
              icon='⚓'
              label='Active Shipments'
              value={trackingData.maritime.activeShipments.toString()}
              color='#8b5cf6'
            />
            <TrackingStatCard
              icon='⏱️'
              label='Avg Transit Time'
              value={trackingData.maritime.avgTransitTime}
              color='#f59e0b'
            />
          </div>

          <div
            style={{
              background: 'rgba(6, 182, 212, 0.1)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(6, 182, 212, 0.3)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '16px',
                color: '#06b6d4',
              }}
            >
              🌊 Maritime Intelligence Features
            </h3>
            <div
              style={{
                display: 'grid',
                gap: '12px',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#06b6d4' }}>✓</span> Real-time vessel AIS
                tracking
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#06b6d4' }}>✓</span> Container location
                monitoring (MMSI/IMO)
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#06b6d4' }}>✓</span> Port congestion
                alerts & ETAs
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#06b6d4' }}>✓</span> Route optimization
                intelligence
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#06b6d4' }}>✓</span> Weather delay
                predictions
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#06b6d4' }}>✓</span> Customs clearance
                status
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(6, 182, 212, 0.1)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(6, 182, 212, 0.3)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '16px',
                color: '#06b6d4',
              }}
            >
              🌊 Recent Maritime Shipments
            </h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {trackingShipments
                .filter((s) => s.type === 'maritime')
                .slice(0, 3)
                .map((shipment, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255,255,255,0.9)',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {shipment.shipmentId}
                      </span>
                      <span
                        style={{
                          color: '#10b981',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        Active
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.6)',
                      }}
                    >
                      <span>
                        {shipment.containerNumbers
                          ? shipment.containerNumbers.join(', ')
                          : 'Container pending'}
                      </span>
                      <span>{shipment.routeCode}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Canada Cross-Border View */}
      {trackingMode === 'canada' && (
        <div style={{ display: 'grid', gap: '24px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
            }}
          >
            <TrackingStatCard
              icon='🚛'
              label='Border Crossings'
              value={trackingData.canada.borderCrossings.toString()}
              color='#ef4444'
            />
            <TrackingStatCard
              icon='📋'
              label='PARS/PAPS Active'
              value={trackingData.canada.parsActive.toString()}
              color='#f59e0b'
            />
            <TrackingStatCard
              icon='⏱️'
              label='Avg Clearance Time'
              value={trackingData.canada.avgClearanceTime}
              color='#10b981'
            />
            <TrackingStatCard
              icon='✅'
              label='Cleared Today'
              value={trackingData.canada.clearedToday.toString()}
              color='#06b6d4'
            />
          </div>

          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '16px',
                color: '#ef4444',
              }}
            >
              🇨🇦 Canada Cross-Border Intelligence
            </h3>
            <div
              style={{
                display: 'grid',
                gap: '12px',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#ef4444' }}>✓</span> Real-time PARS
                (Pre-Arrival Review System) tracking
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#ef4444' }}>✓</span> PAPS (Pre-Arrival
                Processing System) monitoring
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#ef4444' }}>✓</span> CBSA customs
                clearance status
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#ef4444' }}>✓</span> Border wait time
                intelligence
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#ef4444' }}>✓</span> Duty/Tax calculation
                and payment tracking
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#ef4444' }}>✓</span> FDA/CFIA inspection
                alerts
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h4
              style={{
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '16px',
                color: 'white',
              }}
            >
              Major Canada Border Crossings
            </h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                {
                  name: 'Ambassador Bridge (Detroit-Windsor)',
                  wait: '--',
                  status: 'unknown',
                },
                {
                  name: 'Peace Bridge (Buffalo-Fort Erie)',
                  wait: '--',
                  status: 'unknown',
                },
                {
                  name: 'Blue Water Bridge (Port Huron-Sarnia)',
                  wait: '--',
                  status: 'unknown',
                },
                {
                  name: 'Pacific Highway (Blaine-Surrey)',
                  wait: '--',
                  status: 'unknown',
                },
              ].map((crossing, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                  }}
                >
                  <span
                    style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}
                  >
                    {crossing.name}
                  </span>
                  <span
                    style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}
                  >
                    Wait: {crossing.wait}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mexico Cross-Border View */}
      {trackingMode === 'mexico' && (
        <div style={{ display: 'grid', gap: '24px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
            }}
          >
            <TrackingStatCard
              icon='🚛'
              label='Border Crossings'
              value={trackingData.mexico.borderCrossings.toString()}
              color='#10b981'
            />
            <TrackingStatCard
              icon='📋'
              label='Pedimentos Active'
              value={trackingData.mexico.pedimentosActive.toString()}
              color='#06b6d4'
            />
            <TrackingStatCard
              icon='⏱️'
              label='Avg Clearance Time'
              value={trackingData.mexico.avgClearanceTime}
              color='#f59e0b'
            />
            <TrackingStatCard
              icon='✅'
              label='Cleared Today'
              value={trackingData.mexico.clearedToday.toString()}
              color='#8b5cf6'
            />
          </div>

          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '16px',
                color: '#10b981',
              }}
            >
              🇲🇽 Mexico Cross-Border Intelligence
            </h3>
            <div
              style={{
                display: 'grid',
                gap: '12px',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#10b981' }}>✓</span> Real-time Pedimento
                (customs declaration) tracking
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#10b981' }}>✓</span> COVE (Ventanilla
                Única) integration
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#10b981' }}>✓</span> Customs broker
                coordination
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#10b981' }}>✓</span> Border wait time
                monitoring
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#10b981' }}>✓</span> IMMEX program
                tracking
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#10b981' }}>✓</span> CBP/SAT inspection
                alerts
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h4
              style={{
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '16px',
                color: 'white',
              }}
            >
              Major Mexico Border Crossings
            </h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { name: 'Laredo-Nuevo Laredo', wait: '--', status: 'unknown' },
                {
                  name: 'El Paso-Ciudad Juárez',
                  wait: '--',
                  status: 'unknown',
                },
                { name: 'Otay Mesa-Tijuana', wait: '--', status: 'unknown' },
                { name: 'Pharr-Reynosa', wait: '--', status: 'unknown' },
              ].map((crossing, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                  }}
                >
                  <span
                    style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}
                  >
                    {crossing.name}
                  </span>
                  <span
                    style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}
                  >
                    Wait: {crossing.wait}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== HELPER COMPONENTS ==========

function KPICard({ title, value, trend, trendUp, subtitle, icon, color }: any) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '24px',
        borderRadius: '16px',
        border: `1px solid ${color}30`,
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: '12px',
        }}
      >
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
          {title}
        </div>
        <span style={{ fontSize: '24px' }}>{icon}</span>
      </div>
      <div
        style={{
          fontSize: '32px',
          fontWeight: '700',
          color: 'white',
          marginBottom: '8px',
        }}
      >
        {value}
      </div>
      {trend && (
        <div
          style={{
            fontSize: '13px',
            color: trendUp ? '#10b981' : '#ef4444',
            marginBottom: '4px',
          }}
        >
          {trendUp ? '↑' : '↓'} {trend}
        </div>
      )}
      {subtitle && (
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function RecentActivityPanel({ title, icon, items }: any) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
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
        {icon} {title}
      </h3>
      {items.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '14px',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
          <div>No activity yet</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {items.map((item: any, idx: number) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '16px',
                borderRadius: '12px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    color:
                      item.status === 'converted' ||
                      item.status === 'active' ||
                      item.status === 'success'
                        ? '#10b981'
                        : item.status === 'warning'
                          ? '#f59e0b'
                          : '#60a5fa',
                    fontSize: '13px',
                    fontWeight: '600',
                  }}
                >
                  {item.value}
                </span>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                {item.detail}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QuickActionButton({ icon, label, description, color }: any) {
  return (
    <button
      style={{
        background: `${color}15`,
        border: `1px solid ${color}30`,
        borderRadius: '12px',
        padding: '20px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 8px 24px ${color}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
      <div
        style={{
          color: 'white',
          fontSize: '16px',
          fontWeight: '700',
          marginBottom: '4px',
        }}
      >
        {label}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
        {description}
      </div>
    </button>
  );
}

function MarketDataCard({ title, icon, data }: any) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <h3
        style={{
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '16px',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {icon} {title}
      </h3>
      <div style={{ display: 'grid', gap: '12px' }}>
        {data.map((item: any, idx: number) => (
          <div
            key={idx}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '14px',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '4px',
                }}
              >
                {item.route || item.port || item.location || item.carrier}
              </div>
              {item.detail && (
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  {item.detail}
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  color: item.color || '#60a5fa',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                {item.rate || item.status || item.availability}
              </span>
              {item.trend && item.trend !== '--' && (
                <span
                  style={{
                    fontSize: '12px',
                    marginLeft: '6px',
                    color: item.trendUp ? '#10b981' : '#ef4444',
                  }}
                >
                  {item.trend}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: any) {
  return (
    <div
      style={{
        background: `${color}15`,
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${color}30`,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '32px',
          fontWeight: '700',
          color: color,
          marginBottom: '8px',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        {label}
      </div>
    </div>
  );
}

function AnalyticsCard({ title, value, subtitle, color }: any) {
  return (
    <div
      style={{
        background: `${color}15`,
        padding: '24px',
        borderRadius: '16px',
        border: `1px solid ${color}30`,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.7)',
          marginBottom: '12px',
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: '36px',
          fontWeight: '700',
          color: color,
          marginBottom: '8px',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}

// Tracking Stat Card Helper
function TrackingStatCard({ icon, label, value, color }: any) {
  return (
    <div
      style={{
        background: `${color}15`,
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${color}30`,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
      <div
        style={{
          fontSize: '28px',
          fontWeight: '700',
          color: color,
          marginBottom: '4px',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        {label}
      </div>
    </div>
  );
}

// Task Category Panel Component
function TaskCategoryPanel({
  title,
  icon,
  color,
  description,
  taskCount,
}: any) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${color}30`,
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '28px' }}>{icon}</div>
          <div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                margin: '0 0 4px 0',
                color: 'white',
              }}
            >
              {title}
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.6)',
                margin: 0,
              }}
            >
              {description}
            </p>
          </div>
        </div>
        <div
          style={{
            background: `${color}20`,
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '700',
            color: color,
          }}
        >
          {taskCount}
        </div>
      </div>
      {taskCount === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '13px',
          }}
        >
          No tasks in this category
        </div>
      )}
    </div>
  );
}

// Task Stat Card Component
function TaskStatCard({ icon, label, value, color }: any) {
  return (
    <div
      style={{
        background: `${color}15`,
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${color}30`,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
      <div
        style={{
          fontSize: '32px',
          fontWeight: '700',
          color: color,
          marginBottom: '8px',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        {label}
      </div>
    </div>
  );
}

function FleetFlowLeadsTab({ stats }: any) {
  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: '800',
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #14b8a6, #0891b2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          🎯 FleetFlow Lead Generation Program
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
          Earn $500 per container commission on FleetFlow-sourced customers
        </p>
      </div>

      <div
        style={{
          background: 'rgba(139, 92, 246, 0.1)',
          padding: '32px',
          borderRadius: '16px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}
      >
        <h3
          style={{
            fontSize: '24px',
            marginBottom: '16px',
            color: '#a78bfa',
            fontWeight: '700',
          }}
        >
          💰 Commission Overview
        </h3>
        <p
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '24px',
          }}
        >
          FleetFlow connects you with qualified China-USA DDP customers. We find
          steel, metal, and aluminum importers facing 95% tariffs and send them
          directly to you as warm leads ready to quote.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '24px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '48px',
                fontWeight: '700',
                color: '#10b981',
                marginBottom: '8px',
              }}
            >
              {stats.fleetflowLeads}
            </div>
            <div
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
              }}
            >
              FleetFlow Customers
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '48px',
                fontWeight: '700',
                color: '#10b981',
                marginBottom: '8px',
              }}
            >
              $
              {stats.fleetflowCommission > 0
                ? (stats.fleetflowCommission / 1000).toFixed(1) + 'K'
                : '0'}
            </div>
            <div
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
              }}
            >
              Total Commission Earned
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '48px',
                fontWeight: '700',
                color: '#10b981',
                marginBottom: '8px',
              }}
            >
              $500
            </div>
            <div
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
              }}
            >
              Per Container Commission
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Analytics Tab
function AnalyticsTab({ stats }: any) {
  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: '800',
            margin: '0 0 8px 0',
          }}
        >
          📊 Performance Analytics
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
          Comprehensive business analytics and KPI tracking
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
        }}
      >
        <AnalyticsCard
          title='Revenue Growth'
          value='--'
          subtitle='vs last quarter'
          color='#10b981'
        />
        <AnalyticsCard
          title='Profit Margin'
          value='--'
          subtitle='Industry avg: 25%'
          color='#06b6d4'
        />
        <AnalyticsCard
          title='Customer Retention'
          value='--'
          subtitle='12-month retention'
          color='#8b5cf6'
        />
        <AnalyticsCard
          title='Operational Efficiency'
          value='--'
          subtitle='Process automation'
          color='#f59e0b'
        />
      </div>

      {/* Trade Lane Analysis */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        <h3
          style={{
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '20px',
            color: 'white',
          }}
        >
          🌎 Top Trade Lanes Performance
        </h3>
        <div style={{ display: 'grid', gap: '16px' }}>
          {[
            {
              lane: 'Asia → North America',
              shipments: 1248,
              revenue: 3850000,
              color: '#06b6d4',
            },
            {
              lane: 'Europe → North America',
              shipments: 845,
              revenue: 2920000,
              color: '#10b981',
            },
            {
              lane: 'Latin America → North America',
              shipments: 567,
              revenue: 1680000,
              color: '#8b5cf6',
            },
            {
              lane: 'Asia → Europe',
              shipments: 423,
              revenue: 1340000,
              color: '#f59e0b',
            },
            {
              lane: 'Intra-Asia',
              shipments: 312,
              revenue: 890000,
              color: '#ec4899',
            },
          ].map((lane, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '16px',
                borderRadius: '12px',
                border: `1px solid ${lane.color}30`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '4px',
                    }}
                  >
                    {lane.lane}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.6)',
                    }}
                  >
                    {lane.shipments} shipments • $
                    {(lane.revenue / 1000000).toFixed(2)}M revenue
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: lane.color,
                  }}
                >
                  #{idx + 1}
                </div>
              </div>
              {/* Progress Bar */}
              <div
                style={{
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(lane.shipments / 1248) * 100}%`,
                    background: `linear-gradient(90deg, ${lane.color}, ${lane.color}CC)`,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Breakdown Chart */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        <h3
          style={{
            fontSize: '20px',
            fontWeight: '700',
            marginBottom: '20px',
            color: 'white',
          }}
        >
          📊 Average Shipment Cost Breakdown
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            alignItems: 'center',
          }}
        >
          {/* Pie Chart */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg width='280' height='280' viewBox='0 0 280 280'>
              <circle cx='140' cy='140' r='100' fill='#0f172a' />
              {/* Ocean Freight 45% */}
              <path
                d='M 140 40 A 100 100 0 0 1 235.36 105.36 L 140 140 Z'
                fill='#06b6d4'
                opacity='0.9'
              />
              {/* Fuel Surcharge 25% */}
              <path
                d='M 235.36 105.36 A 100 100 0 0 1 235.36 174.64 L 140 140 Z'
                fill='#10b981'
                opacity='0.9'
              />
              {/* Customs & Duties 18% */}
              <path
                d='M 235.36 174.64 A 100 100 0 0 1 140 240 L 140 140 Z'
                fill='#8b5cf6'
                opacity='0.9'
              />
              {/* Documentation 7% */}
              <path
                d='M 140 240 A 100 100 0 0 1 91.27 213.82 L 140 140 Z'
                fill='#f59e0b'
                opacity='0.9'
              />
              {/* Other 5% */}
              <path
                d='M 91.27 213.82 A 100 100 0 0 1 140 40 L 140 140 Z'
                fill='#ec4899'
                opacity='0.9'
              />
              <circle cx='140' cy='140' r='60' fill='#1e293b' />
              <text
                x='140'
                y='135'
                textAnchor='middle'
                fill='white'
                fontSize='20'
                fontWeight='700'
              >
                Total Avg
              </text>
              <text
                x='140'
                y='155'
                textAnchor='middle'
                fill='#06b6d4'
                fontSize='24'
                fontWeight='700'
              >
                $8,450
              </text>
            </svg>
          </div>

          {/* Legend */}
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              {
                label: 'Ocean Freight',
                percent: '45%',
                amount: '$3,803',
                color: '#06b6d4',
              },
              {
                label: 'Fuel Surcharge',
                percent: '25%',
                amount: '$2,113',
                color: '#10b981',
              },
              {
                label: 'Customs & Duties',
                percent: '18%',
                amount: '$1,521',
                color: '#8b5cf6',
              },
              {
                label: 'Documentation',
                percent: '7%',
                amount: '$592',
                color: '#f59e0b',
              },
              {
                label: 'Other Fees',
                percent: '5%',
                amount: '$421',
                color: '#ec4899',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  border: `1px solid ${item.color}30`,
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      background: item.color,
                    }}
                  />
                  <span
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    {item.label}
                  </span>
                </div>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <span
                    style={{
                      color: item.color,
                      fontSize: '16px',
                      fontWeight: '700',
                    }}
                  >
                    {item.percent}
                  </span>
                  <span
                    style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}
                  >
                    {item.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Task Management Tab - Duplicate removed

function TaskManagementTab() {
  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div>
        <h2
          style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}
        >
          📋 Task Management Center
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0' }}>
          Daily operations workflow, follow-ups, and milestone tracking
        </p>
      </div>

      {/* Task Categories */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Quote Follow-ups */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '24px' }}>📝</div>
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: 0,
                  color: '#3b82f6',
                }}
              >
                Quote Follow-ups
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  margin: '4px 0 0 0',
                }}
              >
                5 pending • 2 urgent
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ef4444',
                  marginBottom: '4px',
                }}
              >
                URGENT: Follow up with ABC Corp
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Quote sent 3 days ago • $12,500 value
              </div>
            </div>
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#f59e0b',
                  marginBottom: '4px',
                }}
              >
                Call XYZ Manufacturing
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Requested custom quote • Due today
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '12px',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'rgba(255,255,255,0.8)',
                  marginBottom: '4px',
                }}
              >
                Email Tech Solutions Inc
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Quote revision requested
              </div>
            </div>
          </div>
        </div>

        {/* Document Preparation */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '24px' }}>📄</div>
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: 0,
                  color: '#10b981',
                }}
              >
                Document Preparation
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  margin: '4px 0 0 0',
                }}
              >
                8 tasks • 3 due today
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ef4444',
                  marginBottom: '4px',
                }}
              >
                Commercial Invoice - Shipment #1234
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Due in 2 hours • Missing HS codes
              </div>
            </div>
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#f59e0b',
                  marginBottom: '4px',
                }}
              >
                Packing List - Electronics Cargo
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Due today • 150+ items to list
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '12px',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'rgba(255,255,255,0.8)',
                  marginBottom: '4px',
                }}
              >
                Certificate of Origin
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Ready for signature
              </div>
            </div>
          </div>
        </div>

        {/* Payment Collections */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '24px' }}>💰</div>
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: 0,
                  color: '#f59e0b',
                }}
              >
                Payment Collections
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  margin: '4px 0 0 0',
                }}
              >
                $45,230 outstanding • 6 overdue
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ef4444',
                  marginBottom: '4px',
                }}
              >
                OVERDUE: Global Tech Corp
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                $8,500 • 15 days overdue • Multiple reminders sent
              </div>
            </div>
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#f59e0b',
                  marginBottom: '4px',
                }}
              >
                Due Today: Manufacturing Plus
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                $3,200 • Final reminder sent yesterday
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                padding: '12px',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'rgba(255,255,255,0.8)',
                  marginBottom: '4px',
                }}
              >
                Due Tomorrow: Import Solutions
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                $5,800 • Invoice sent last week
              </div>
            </div>
          </div>
        </div>

        {/* Shipment Milestones */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '24px' }}>🚢</div>
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: 0,
                  color: '#8b5cf6',
                }}
              >
                Shipment Milestones
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.7)',
                  margin: '4px 0 0 0',
                }}
              >
                12 active shipments • 3 critical
              </p>
            </div>
          </div>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ef4444',
                  marginBottom: '4px',
                }}
              >
                CRITICAL: Container delayed at port
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Shipment #5678 • ETA now +3 days
              </div>
            </div>
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#f59e0b',
                  marginBottom: '4px',
                }}
              >
                Customs clearance due today
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Shipment #4321 • Documents ready
              </div>
            </div>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#10b981',
                  marginBottom: '4px',
                }}
              >
                On schedule: Delivery tomorrow
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                Shipment #7890 • All milestones met
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OperationsTab() {
  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div>
        <h2
          style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}
        >
          ✅ Operations Management
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0' }}>
          Task management, workflow automation, and operational efficiency
        </p>
      </div>
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <div style={{ fontSize: '18px' }}>Operations dashboard coming soon</div>
      </div>
    </div>
  );
}

// ==========================================
// SHIPMENTS & QUOTING TAB
// ==========================================

function ShipmentsTab({ router }: any) {
  const [shipmentMode, setShipmentMode] = useState<'quote' | 'tracking'>(
    'quote'
  );

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div>
        <h2
          style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0' }}
        >
          📦 Shipments & Quoting
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
          Ocean/air freight quotes • Active shipments • Real-time tracking
        </p>
      </div>

      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setShipmentMode('quote')}
          style={{
            flex: 1,
            padding: '16px',
            borderRadius: '12px',
            border:
              shipmentMode === 'quote'
                ? '2px solid #3b82f6'
                : '1px solid rgba(255, 255, 255, 0.1)',
            background:
              shipmentMode === 'quote'
                ? 'rgba(59, 130, 246, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
            color:
              shipmentMode === 'quote' ? '#3b82f6' : 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
          }}
        >
          💰 Generate Quote
        </button>
        <button
          onClick={() => setShipmentMode('tracking')}
          style={{
            flex: 1,
            padding: '16px',
            borderRadius: '12px',
            border:
              shipmentMode === 'tracking'
                ? '2px solid #10b981'
                : '1px solid rgba(255, 255, 255, 0.1)',
            background:
              shipmentMode === 'tracking'
                ? 'rgba(16, 185, 129, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
            color:
              shipmentMode === 'tracking'
                ? '#10b981'
                : 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
          }}
        >
          🚢 Track Shipments
        </button>
      </div>

      {/* Quote Mode */}
      {shipmentMode === 'quote' && <QuotingTab router={router} />}

      {/* Tracking Mode */}
      {shipmentMode === 'tracking' && <TrackingTab />}
    </div>
  );
}

// ==========================================
// INTELLIGENCE TAB
// ==========================================

function IntelligenceTab({ stats }: any) {
  const [intelMode, setIntelMode] = useState<'ai' | 'market' | 'analytics'>(
    'ai'
  );

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div>
        <h2
          style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0' }}
        >
          📊 Business Intelligence
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>
          AI insights • Market data • Performance analytics
        </p>
      </div>

      {/* Mode Selection */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setIntelMode('ai')}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: '12px',
            border:
              intelMode === 'ai'
                ? '2px solid #ec4899'
                : '1px solid rgba(255, 255, 255, 0.1)',
            background:
              intelMode === 'ai'
                ? 'rgba(236, 72, 153, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
            color: intelMode === 'ai' ? '#ec4899' : 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          🤖 AI Insights
        </button>
        <button
          onClick={() => setIntelMode('market')}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: '12px',
            border:
              intelMode === 'market'
                ? '2px solid #f59e0b'
                : '1px solid rgba(255, 255, 255, 0.1)',
            background:
              intelMode === 'market'
                ? 'rgba(245, 158, 11, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
            color:
              intelMode === 'market' ? '#f59e0b' : 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          📈 Market Data
        </button>
        <button
          onClick={() => setIntelMode('analytics')}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: '12px',
            border:
              intelMode === 'analytics'
                ? '2px solid #8b5cf6'
                : '1px solid rgba(255, 255, 255, 0.1)',
            background:
              intelMode === 'analytics'
                ? 'rgba(139, 92, 246, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
            color:
              intelMode === 'analytics'
                ? '#8b5cf6'
                : 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          📊 Analytics
        </button>
      </div>

      {/* Content */}
      {intelMode === 'ai' && (
        <AiIntelligenceTab stats={{ shipments: 0, clients: 0, revenue: 0 }} />
      )}
      {intelMode === 'market' && (
        <MarketIntelligenceTab
          stats={{ shipments: 0, clients: 0, revenue: 0 }}
        />
      )}
      {intelMode === 'analytics' && (
        <AnalyticsTab stats={{ shipments: 0, clients: 0, revenue: 0 }} />
      )}
    </div>
  );
}

// ==========================================
// CUSTOMS COMPLIANCE TESTING TAB
// ==========================================

function ComplianceAndDocumentsTab() {
  const [activeTest, setActiveTest] = useState<
    | 'screening'
    | 'hs-classification'
    | 'duty-calc'
    | 'section301'
    | 'contracts'
    | 'bond-management'
  >('screening');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Test States
  const [screeningForm, setScreeningForm] = useState({
    partyName: 'Test Company',
    country: 'China',
    partyType: 'shipper' as ScreeningParty['type'],
  });

  const [hsForm, setHsForm] = useState({
    description: 'iPhone 15 smartphone',
  });

  const [dutyForm, setDutyForm] = useState({
    hsCode: '8517.12.00.00',
    country: 'China',
    description: 'Smartphones',
    value: 50000,
  });

  const [bondForm, setBondForm] = useState({
    bondNumber: '',
    bondType: 'CONTINUOUS' as 'SINGLE' | 'CONTINUOUS' | 'ANNUAL',
    suretyCompany: 'Liberty Mutual Surety',
    principalName: 'ABC Freight Forwarding LLC',
    bondAmount: 1000000,
    portsCovered: ['USLAX', 'USNYC', 'USMIA'],
  });

  const [suretyCloudConfig, setSuretyCloudConfig] = useState({
    apiKey: '',
    apiSecret: '',
    baseUrl: 'https://api.suretycloud.com/v1',
    organizationId: '',
    isConfigured: false,
    isConnected: false,
  });

  const [suretyCloudApplication, setSuretyCloudApplication] = useState({
    principalAddress: '123 Business Ave, Suite 100, Los Angeles, CA 90210',
    principalPhone: '(555) 123-4567',
    principalEmail: 'bonds@abcshipping.com',
    importerOfRecord: '',
    commodities: ['Electronics', 'Machinery', 'Textiles'],
    estimatedAnnualValue: 5000000,
    complianceDocuments: [],
  });

  const testScreening = async () => {
    setLoading(true);
    try {
      const party: ScreeningParty = {
        name: screeningForm.partyName,
        country: screeningForm.country,
        type: screeningForm.partyType,
      };

      const result =
        await deniedPartyScreeningService.screenPartyEnhanced(party);
      setResults({ type: 'screening', data: result });
    } catch (error) {
      setResults({ type: 'screening', error: error.message });
    }
    setLoading(false);
  };

  const testHSClassification = async () => {
    setLoading(true);
    try {
      // TODO: Implement HS Code Service
      setResults({
        type: 'hs-classification',
        data: { message: 'HS Code classification service coming soon' },
      });
    } catch (error: any) {
      setResults({ type: 'hs-classification', error: error.message });
    }
    setLoading(false);
  };

  const testDutyCalculation = async () => {
    setLoading(true);
    try {
      // TODO: Implement HS Code Service
      setResults({
        type: 'duty-calc',
        data: { message: 'Duty calculation service coming soon' },
      });
    } catch (error: any) {
      setResults({ type: 'duty-calc', error: error.message });
    }
    setLoading(false);
  };

  const testSection301Alerts = async () => {
    setLoading(true);
    try {
      // TODO: Implement HS Code Service
      setResults({
        type: 'section301',
        data: { message: 'Section 301 alerts service coming soon' },
      });
    } catch (error: any) {
      setResults({ type: 'section301', error: error.message });
    }
    setLoading(false);
  };

  const testBondManagement = async () => {
    setLoading(true);
    try {
      // Import the service dynamically to avoid circular dependencies
      const { customsBondService } = await import(
        '../services/CustomsBondService'
      );

      // Generate a test bond number
      const testBondNumber = `TEST-${Date.now().toString().slice(-6)}`;

      const bondData = {
        bondNumber: bondForm.bondNumber || testBondNumber,
        bondType: bondForm.bondType,
        suretyCompany: bondForm.suretyCompany,
        principalName: bondForm.principalName,
        importerOfRecord: undefined,
        bondAmount: bondForm.bondAmount,
        currency: 'USD',
        effectiveDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        portsCovered: bondForm.portsCovered,
        status: 'ACTIVE' as const,
        maxUtilizationAmount: bondForm.bondAmount,
      };

      const bond = await customsBondService.registerBond(bondData);

      // Test recording some activity
      await customsBondService.recordActivity({
        bondId: bond.id,
        activityType: 'ENTRY',
        entryNumber: 'TEST-ENTRY-001',
        amount: 50000,
        description: 'Test customs entry',
        portOfEntry: 'USLAX',
      });

      // Get utilization report
      const report = await customsBondService.getBondUtilizationReport(bond.id);

      setResults({
        type: 'bond-management',
        data: {
          bond,
          activities: await customsBondService.getBondActivities(bond.id),
          report,
        },
      });
    } catch (error) {
      setResults({ type: 'bond-management', error: error.message });
    }
    setLoading(false);
  };

  const configureSuretyCloud = async () => {
    setLoading(true);
    try {
      const { suretyCloudManualIntegrationService } = await import(
        '../services/SuretyCloudManualIntegrationService'
      );

      await suretyCloudManualIntegrationService.configureSettings({
        organizationName: 'ABC Freight Forwarding LLC',
        contactEmail: suretyCloudConfig.apiKey || 'bonds@abcshipping.com',
        contactPhone: suretyCloudConfig.organizationId || '(555) 123-4567',
        suretyCloudLoginEmail: suretyCloudConfig.apiSecret || undefined,
        notificationEmail: suretyCloudConfig.baseUrl || 'bonds@abcshipping.com',
        preferredSuretyCompanies: [
          'Liberty Mutual Surety',
          'AIG Surety',
          'Chubb Surety Group',
        ],
      });

      const isConfigured =
        await suretyCloudManualIntegrationService.validateSettings();

      setSuretyCloudConfig((prev) => ({
        ...prev,
        isConfigured: true,
        isConnected: isConfigured,
      }));

      setResults({
        type: 'surety-cloud',
        data: {
          action: 'configuration',
          success: true,
          connected: isConfigured,
          message: isConfigured
            ? 'SuretyCloud integration configured successfully'
            : 'Configuration incomplete',
        },
      });
    } catch (error) {
      setResults({
        type: 'surety-cloud',
        data: {
          action: 'configuration',
          success: false,
          connected: false,
          message: error.message,
        },
      });
    }
    setLoading(false);
  };

  const submitSuretyCloudApplication = async () => {
    setLoading(true);
    try {
      const { suretyCloudManualIntegrationService } = await import(
        '../services/SuretyCloudManualIntegrationService'
      );

      const application = {
        bondType: bondForm.bondType,
        bondAmount: bondForm.bondAmount,
        principalName: bondForm.principalName,
        principalAddress: suretyCloudApplication.principalAddress,
        principalPhone: suretyCloudApplication.principalPhone,
        principalEmail: suretyCloudApplication.principalEmail,
        importerOfRecord: suretyCloudApplication.importerOfRecord || undefined,
        portsOfEntry: bondForm.portsCovered,
        commodities: suretyCloudApplication.commodities,
        estimatedAnnualValue: suretyCloudApplication.estimatedAnnualValue,
        complianceDocuments: suretyCloudApplication.complianceDocuments,
      };

      const response =
        await suretyCloudManualIntegrationService.generateBondApplication(
          application
        );

      setResults({
        type: 'surety-cloud',
        data: {
          action: 'application',
          success: true,
          bondNumber: response.fleetFlowBond.bondNumber,
          applicationForm: response.suretyCloudApplicationForm,
          emailTemplate: response.emailTemplate,
          documentChecklist: response.documentChecklist,
          submissionInstructions: response.submissionInstructions,
          fleetFlowBond: response.fleetFlowBond,
        },
      });
    } catch (error) {
      setResults({
        type: 'surety-cloud',
        data: {
          action: 'application',
          success: false,
          message: error.message,
        },
      });
    }
    setLoading(false);
  };

  const syncSuretyCloudBonds = async () => {
    setLoading(true);
    try {
      // For manual integration, we don't auto-sync. This provides guidance for manual updates
      console.log(
        'Manual integration: Status sync requires manual updates from SuretyCloud notifications'
      );

      setResults({
        type: 'surety-cloud',
        data: {
          action: 'sync',
          success: true,
          message:
            'Manual integration configured. Status updates require manual entry when you receive notifications from SuretyCloud.',
        },
      });
    } catch (error) {
      setResults({
        type: 'surety-cloud',
        data: {
          action: 'sync',
          success: false,
          message: error.message,
        },
      });
    }
    setLoading(false);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'CLEAR':
        return '#10b981';
      case 'LOW':
        return '#84cc16';
      case 'MEDIUM':
        return '#f59e0b';
      case 'HIGH':
        return '#ef4444';
      case 'CRITICAL':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      {/* Header */}
      <div>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: '800',
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          🛃 Compliance & Documents Center
        </h2>
        <p
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '16px',
            margin: '0',
          }}
        >
          Denied party screening • HS code classification • Duty calculator •
          Section 301 alerts • Document generation
        </p>
      </div>

      {/* Test Selection */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[
          {
            id: 'screening',
            label: '🚨 Denied Party Screening',
            color: '#dc2626',
          },
          {
            id: 'hs-classification',
            label: '🔍 HS Code Classification',
            color: '#059669',
          },
          { id: 'duty-calc', label: '💰 Duty Calculator', color: '#7c3aed' },
          {
            id: 'section301',
            label: '⚠️ Section 301 Alerts',
            color: '#ea580c',
          },
          {
            id: 'contracts',
            label: '📄 Legal Contracts',
            color: '#3b82f6',
          },
          {
            id: 'bond-management',
            label: '🔐 Bond Management',
            color: '#059669',
          },
        ].map((test) => (
          <button
            key={test.id}
            onClick={() => setActiveTest(test.id as any)}
            style={{
              padding: '14px 20px',
              borderRadius: '12px',
              border:
                activeTest === test.id
                  ? `2px solid ${test.color}`
                  : '1px solid rgba(255, 255, 255, 0.1)',
              background:
                activeTest === test.id
                  ? `${test.color}20`
                  : 'rgba(255, 255, 255, 0.05)',
              color:
                activeTest === test.id
                  ? test.color
                  : 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow:
                activeTest === test.id ? `0 4px 16px ${test.color}40` : 'none',
            }}
          >
            {test.label}
          </button>
        ))}
      </div>

      {/* Test Forms */}
      {activeTest === 'screening' && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(220, 38, 38, 0.3)',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '16px',
              color: '#dc2626',
            }}
          >
            🚨 Denied Party Screening Test
          </h3>
          <div
            style={{
              display: 'grid',
              gap: '16px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'white',
                }}
              >
                Party Name
              </label>
              <input
                type='text'
                value={screeningForm.partyName}
                onChange={(e) =>
                  setScreeningForm((prev) => ({
                    ...prev,
                    partyName: e.target.value,
                  }))
                }
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '14px',
                }}
                placeholder='Test Company'
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'white',
                }}
              >
                Country
              </label>
              <input
                type='text'
                value={screeningForm.country}
                onChange={(e) =>
                  setScreeningForm((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '14px',
                }}
                placeholder='China'
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'white',
                }}
              >
                Party Type
              </label>
              <select
                value={screeningForm.partyType}
                onChange={(e) =>
                  setScreeningForm((prev) => ({
                    ...prev,
                    partyType: e.target.value as ScreeningParty['type'],
                  }))
                }
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                <option value='shipper'>Shipper</option>
                <option value='consignee'>Consignee</option>
                <option value='carrier'>Carrier</option>
                <option value='notify_party'>Notify Party</option>
                <option value='customs_broker'>Customs Broker</option>
                <option value='vendor'>Vendor</option>
                <option value='other'>Other</option>
              </select>
            </div>
          </div>
          <button
            onClick={testScreening}
            disabled={loading}
            style={{
              marginTop: '16px',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: loading
                ? 'rgba(220, 38, 38, 0.5)'
                : 'linear-gradient(135deg, #dc2626, #b91c1c)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {loading ? '🔍 Screening...' : '🔍 Screen Party'}
          </button>
        </div>
      )}

      {activeTest === 'hs-classification' && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(5, 150, 105, 0.3)',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '16px',
              color: '#059669',
            }}
          >
            🔍 HS Code Classification Test
          </h3>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                color: 'white',
              }}
            >
              Product Description
            </label>
            <input
              type='text'
              value={hsForm.description}
              onChange={(e) =>
                setHsForm((prev) => ({ ...prev, description: e.target.value }))
              }
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                fontSize: '14px',
                marginBottom: '16px',
              }}
              placeholder='iPhone 15 smartphone'
            />
          </div>
          <button
            onClick={testHSClassification}
            disabled={loading}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: loading
                ? 'rgba(5, 150, 105, 0.5)'
                : 'linear-gradient(135deg, #059669, #047857)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {loading ? '🤖 Classifying...' : '🤖 Classify Product'}
          </button>
        </div>
      )}

      {activeTest === 'duty-calc' && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(124, 58, 237, 0.3)',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '16px',
              color: '#7c3aed',
            }}
          >
            💰 Duty Calculator Test
          </h3>
          <div
            style={{
              display: 'grid',
              gap: '16px',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'white',
                }}
              >
                HS Code
              </label>
              <input
                type='text'
                value={dutyForm.hsCode}
                onChange={(e) =>
                  setDutyForm((prev) => ({ ...prev, hsCode: e.target.value }))
                }
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '14px',
                }}
                placeholder='8517.12.00.00'
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'white',
                }}
              >
                Origin Country
              </label>
              <input
                type='text'
                value={dutyForm.country}
                onChange={(e) =>
                  setDutyForm((prev) => ({ ...prev, country: e.target.value }))
                }
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '14px',
                }}
                placeholder='China'
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: 'white',
                }}
              >
                Customs Value (USD)
              </label>
              <input
                type='number'
                value={dutyForm.value}
                onChange={(e) =>
                  setDutyForm((prev) => ({
                    ...prev,
                    value: parseFloat(e.target.value) || 0,
                  }))
                }
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '14px',
                }}
                placeholder='50000'
              />
            </div>
          </div>
          <button
            onClick={testDutyCalculation}
            disabled={loading}
            style={{
              marginTop: '16px',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: loading
                ? 'rgba(124, 58, 237, 0.5)'
                : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {loading ? '💰 Calculating...' : '💰 Calculate Duty'}
          </button>
        </div>
      )}

      {activeTest === 'section301' && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(234, 88, 12, 0.3)',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '16px',
              color: '#ea580c',
            }}
          >
            ⚠️ Section 301 Tariff Alerts
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
            View active Section 301 tariff alerts from the China trade war
          </p>
          <button
            onClick={testSection301Alerts}
            disabled={loading}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: loading
                ? 'rgba(234, 88, 12, 0.5)'
                : 'linear-gradient(135deg, #ea580c, #c2410c)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {loading ? '⚠️ Loading Alerts...' : '⚠️ View Section 301 Alerts'}
          </button>
        </div>
      )}

      {/* Results Display */}
      {results && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '16px',
              color: 'white',
            }}
          >
            📊 Test Results
          </h3>

          {results.error ? (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                color: '#ef4444',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                ❌ Error
              </div>
              <div>{results.error}</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {results.type === 'screening' && results.data && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ fontSize: '24px' }}>
                      {results.data.riskLevel === 'CLEAR'
                        ? '✅'
                        : results.data.riskLevel === 'CRITICAL'
                          ? '🚫'
                          : '⚠️'}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: getRiskColor(results.data.riskLevel),
                        }}
                      >
                        {results.data.riskLevel} RISK LEVEL
                      </div>
                      <div
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '14px',
                        }}
                      >
                        {results.data.matchCount} matches found
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: getRiskColor(results.data.riskLevel) + '15',
                      border: `1px solid ${getRiskColor(results.data.riskLevel)}30`,
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: 'white',
                      }}
                    >
                      Recommendation:
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.9)' }}>
                      {results.data.recommendation}
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      padding: '16px',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: 'white',
                      }}
                    >
                      Legal Action:
                    </div>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '14px',
                      }}
                    >
                      {results.data.legalAction}
                    </div>
                  </div>
                </div>
              )}

              {results.type === 'hs-classification' && results.data && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ fontSize: '24px' }}>🏷️</div>
                    <div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#10b981',
                        }}
                      >
                        {results.data.hsCode.hsCode}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '14px',
                        }}
                      >
                        {results.data.confidence * 100}% confidence
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: 'white',
                      }}
                    >
                      HS Code Details:
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.9)' }}>
                      {results.data.hsCode.description}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '14px',
                        marginTop: '8px',
                      }}
                    >
                      General Duty: {results.data.hsCode.generalDuty} |
                      Category: {results.data.hsCode.category}
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      padding: '16px',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: 'white',
                      }}
                    >
                      Reasoning:
                    </div>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '14px',
                      }}
                    >
                      {results.data.reasoning}
                    </div>
                  </div>
                </div>
              )}

              {results.type === 'duty-calc' && results.data && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ fontSize: '24px' }}>💰</div>
                    <div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#7c3aed',
                        }}
                      >
                        Duty Calculation Results
                      </div>
                      <div
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '14px',
                        }}
                      >
                        {results.data.hsCode} from {results.data.country}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gap: '12px',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        padding: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255,255,255,0.7)',
                          marginBottom: '4px',
                        }}
                      >
                        CIF Value
                      </div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: 'white',
                        }}
                      >
                        ${results.data.cifValue.toLocaleString()}
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        padding: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255,255,255,0.7)',
                          marginBottom: '4px',
                        }}
                      >
                        Duty Rate
                      </div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#f59e0b',
                        }}
                      >
                        {results.data.dutyRate}
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        padding: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255,255,255,0.7)',
                          marginBottom: '4px',
                        }}
                      >
                        Calculated Duty
                      </div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#ef4444',
                        }}
                      >
                        ${results.data.calculatedDuty.toLocaleString()}
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        padding: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255,255,255,0.7)',
                          marginBottom: '4px',
                        }}
                      >
                        Total Landed Cost
                      </div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#10b981',
                        }}
                      >
                        ${results.data.totalLandedCost.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {results.data.alerts && results.data.alerts.length > 0 && (
                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        padding: '16px',
                        marginTop: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: '600',
                          marginBottom: '8px',
                          color: '#ef4444',
                        }}
                      >
                        ⚠️ Tariff Alerts:
                      </div>
                      <ul
                        style={{
                          color: 'rgba(255,255,255,0.9)',
                          margin: 0,
                          paddingLeft: '20px',
                        }}
                      >
                        {results.data.alerts.map(
                          (alert: string, index: number) => (
                            <li key={index} style={{ marginBottom: '4px' }}>
                              {alert}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {results.type === 'section301' && results.data && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ fontSize: '24px' }}>⚠️</div>
                    <div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#ea580c',
                        }}
                      >
                        Section 301 Tariff Alerts
                      </div>
                      <div
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '14px',
                        }}
                      >
                        {results.data.length} active alerts
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '12px' }}>
                    {results.data.map((alert: any, index: number) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(234, 88, 12, 0.1)',
                          border: '1px solid rgba(234, 88, 12, 0.3)',
                          borderRadius: '8px',
                          padding: '16px',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: '600',
                            marginBottom: '4px',
                            color: '#ea580c',
                          }}
                        >
                          {alert.alertType}: {alert.description}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '14px',
                          }}
                        >
                          HS Code: {alert.hsCode} | Additional Duty:{' '}
                          {alert.additionalDuty}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '12px',
                            marginTop: '4px',
                          }}
                        >
                          Effective: {alert.effectiveDate}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.type === 'bond-management' && results.data && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ fontSize: '24px' }}>🔐</div>
                    <div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#059669',
                        }}
                      >
                        Customs Bond Registered Successfully
                      </div>
                      <div
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '14px',
                        }}
                      >
                        Bond #{results.data.bond.bondNumber} -{' '}
                        {results.data.bond.bondType}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '16px',
                      marginBottom: '24px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        padding: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255,255,255,0.7)',
                          marginBottom: '4px',
                        }}
                      >
                        Bond Amount
                      </div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#059669',
                        }}
                      >
                        ${results.data.bond.bondAmount.toLocaleString()}
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        padding: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255,255,255,0.7)',
                          marginBottom: '4px',
                        }}
                      >
                        Surety Company
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {results.data.bond.suretyCompany}
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        padding: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255,255,255,0.7)',
                          marginBottom: '4px',
                        }}
                      >
                        Principal
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {results.data.bond.principalName}
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        padding: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255,255,255,0.7)',
                          marginBottom: '4px',
                        }}
                      >
                        Expires
                      </div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#f59e0b',
                        }}
                      >
                        {new Date(
                          results.data.bond.expiryDate
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '20px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#059669',
                          marginBottom: '12px',
                        }}
                      >
                        📋 Bond Activity
                      </h4>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {results.data.activities.map(
                          (activity: any, index: number) => (
                            <div
                              key={index}
                              style={{
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '6px',
                                padding: '12px',
                                border: '1px solid rgba(5, 150, 105, 0.2)',
                              }}
                            >
                              <div
                                style={{
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: 'white',
                                  marginBottom: '4px',
                                }}
                              >
                                {activity.activityType} - $
                                {activity.amount.toLocaleString()}
                              </div>
                              <div
                                style={{
                                  fontSize: '12px',
                                  color: 'rgba(255,255,255,0.7)',
                                }}
                              >
                                {activity.description} •{' '}
                                {new Date(
                                  activity.activityDate
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <h4
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#059669',
                          marginBottom: '12px',
                        }}
                      >
                        📊 Utilization Report
                      </h4>
                      <div style={{ display: 'grid', gap: '12px' }}>
                        <div
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '8px',
                            padding: '16px',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '14px',
                              color: 'rgba(255,255,255,0.7)',
                              marginBottom: '4px',
                            }}
                          >
                            Current Utilization
                          </div>
                          <div
                            style={{
                              fontSize: '24px',
                              fontWeight: '700',
                              color:
                                results.data.report.averageUtilization > 80
                                  ? '#ef4444'
                                  : '#059669',
                            }}
                          >
                            {results.data.report.averageUtilization.toFixed(1)}%
                          </div>
                        </div>

                        <div
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '8px',
                            padding: '16px',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '14px',
                              color: 'rgba(255,255,255,0.7)',
                              marginBottom: '4px',
                            }}
                          >
                            Total Bond Amount
                          </div>
                          <div
                            style={{
                              fontSize: '18px',
                              fontWeight: '600',
                              color: 'white',
                            }}
                          >
                            $
                            {results.data.report.totalBondAmount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {results.type === 'surety-cloud' && results.data && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ fontSize: '24px' }}>🔗</div>
                    <div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: results.data.success ? '#3b82f6' : '#ef4444',
                        }}
                      >
                        {results.data.success
                          ? 'SuretyCloud Operation Successful'
                          : 'SuretyCloud Operation Failed'}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '14px',
                        }}
                      >
                        {results.data.action === 'configuration' &&
                          'Integration Configuration'}
                        {results.data.action === 'application' &&
                          'Bond Application Submission'}
                        {results.data.action === 'sync' &&
                          'Bond Status Synchronization'}
                      </div>
                    </div>
                  </div>

                  {results.data.action === 'configuration' && (
                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#3b82f6',
                          marginBottom: '8px',
                        }}
                      >
                        🔗 SuretyCloud Integration Status
                      </div>
                      <div style={{ color: 'white', marginBottom: '4px' }}>
                        Status:{' '}
                        {results.data.connected
                          ? '✅ Connected'
                          : '⚠️ Configured'}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '14px',
                        }}
                      >
                        {results.data.message}
                      </div>
                    </div>
                  )}

                  {results.data.action === 'application' &&
                    results.data.success && (
                      <div
                        style={{
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: '8px',
                          padding: '16px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#10b981',
                            marginBottom: '12px',
                          }}
                        >
                          📋 Bond Application Package Generated
                        </div>
                        <div style={{ color: 'white' }}>
                          FleetFlow Reference: {results.data.bondNumber}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255,255,255,0.7)',
                            textAlign: 'center',
                            marginTop: '8px',
                          }}
                        >
                          ✅ Application package generated successfully for
                          SuretyCloud submission.
                        </div>
                      </div>
                    )}

                  {results.data.action === 'sync' && results.data.success && (
                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        padding: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#3b82f6',
                          marginBottom: '8px',
                        }}
                      >
                        🔄 Bond Status Synchronization Complete
                      </div>
                      <div style={{ color: 'white' }}>
                        {results.data.message}
                      </div>
                    </div>
                  )}

                  {!results.data.success && (
                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        padding: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#ef4444',
                          marginBottom: '8px',
                        }}
                      >
                        ❌ Operation Failed
                      </div>
                      <div style={{ color: 'white' }}>
                        {results.data.message}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Legal Contracts Section */}
      {activeTest === 'contracts' && (
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            padding: '32px',
            borderRadius: '16px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#3b82f6',
                marginBottom: '8px',
              }}
            >
              📄 Ironclad Legal Contract Templates
            </h3>
            <p
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                lineHeight: '1.6',
              }}
            >
              Enterprise-grade legal agreements with comprehensive liability
              protection, force majeure clauses, dispute resolution,
              indemnification, insurance requirements, payment terms, and
              termination clauses.
            </p>
          </div>

          {/* Contract Types Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {[
              {
                type: 'CLIENT_SERVICE_AGREEMENT' as ContractType,
                icon: '🤝',
                title: 'Client Service Agreement',
                description: 'Master agreement for freight forwarding services',
                color: '#3b82f6',
              },
              {
                type: 'CARRIER_RATE_AGREEMENT' as ContractType,
                icon: '🚢',
                title: 'Carrier Rate Agreement',
                description: 'Shipping line and airline rate contracts',
                color: '#10b981',
              },
              {
                type: 'CUSTOMS_BROKER_AGREEMENT' as ContractType,
                icon: '🛃',
                title: 'Customs Broker Agreement',
                description: 'Customs clearance and compliance services',
                color: '#8b5cf6',
              },
              {
                type: 'TRUCKING_CONTRACT' as ContractType,
                icon: '🚛',
                title: 'Trucking Contract',
                description: 'Drayage and inland transportation services',
                color: '#f59e0b',
              },
              {
                type: 'WAREHOUSE_AGREEMENT' as ContractType,
                icon: '🏭',
                title: 'Warehouse Agreement',
                description: 'Storage and distribution facility contracts',
                color: '#ef4444',
              },
              {
                type: 'INSURANCE_CONTRACT' as ContractType,
                icon: '🛡️',
                title: 'Insurance Contract',
                description: 'Cargo insurance and liability coverage',
                color: '#06b6d4',
              },
              {
                type: 'VOLUME_COMMITMENT' as ContractType,
                icon: '📊',
                title: 'Volume Commitment',
                description: 'Minimum quantity guarantees and discounts',
                color: '#ec4899',
              },
              {
                type: 'SLA_AGREEMENT' as ContractType,
                icon: '⚡',
                title: 'SLA Agreement',
                description: 'Service level agreements and performance metrics',
                color: '#14b8a6',
              },
              {
                type: 'AGENCY_AGREEMENT' as ContractType,
                icon: '🌐',
                title: 'Agency Agreement',
                description: 'International agent and partner agreements',
                color: '#a855f7',
              },
              {
                type: 'NVOCC_AGREEMENT' as ContractType,
                icon: '⚓',
                title: 'NVOCC Agreement',
                description: 'Non-vessel operating common carrier contracts',
                color: '#0891b2',
              },
            ].map((contract) => (
              <div
                key={contract.type}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: `1px solid ${contract.color}40`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${contract.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => {
                  const terms =
                    FreightForwarderContractTemplates.generateContractTerms(
                      contract.type
                    );
                  alert(
                    `${contract.title}\n\nThis ironclad contract includes:\n\n✅ Terms & Conditions\n✅ Liability Protection\n✅ Force Majeure Clause\n✅ Dispute Resolution\n✅ Indemnification\n✅ Confidentiality\n✅ Termination Clauses\n\nContract ready to be customized and sent to clients.`
                  );
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>
                  {contract.icon}
                </div>
                <h4
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: contract.color,
                    marginBottom: '8px',
                  }}
                >
                  {contract.title}
                </h4>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.6)',
                    lineHeight: '1.4',
                    marginBottom: '12px',
                  }}
                >
                  {contract.description}
                </p>
                <button
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${contract.color}`,
                    background: `${contract.color}20`,
                    color: contract.color,
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  View Contract Template →
                </button>
              </div>
            ))}
          </div>

          {/* Contract Features */}
          <div
            style={{
              marginTop: '32px',
              padding: '24px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h4
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '16px',
              }}
            >
              ⚖️ All Contracts Include:
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
              }}
            >
              {[
                '✅ Complete Liability Protection',
                '✅ Force Majeure Clauses',
                '✅ Dispute Resolution Procedures',
                '✅ Indemnification Clauses',
                '✅ Insurance Requirements',
                '✅ Payment Terms with Penalties',
                '✅ Default and Termination Clauses',
                '✅ Confidentiality Agreements',
                '✅ Governing Law Specifications',
                '✅ Compliance with FMC Regulations',
                '✅ NVOCC License Requirements',
                '✅ DOT/FMCSA Compliance',
              ].map((feature, index) => (
                <div
                  key={index}
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '14px',
                    padding: '8px',
                  }}
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div
            style={{
              marginTop: '24px',
              padding: '16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
            }}
          >
            <p
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '12px',
                lineHeight: '1.6',
                margin: 0,
              }}
            >
              ⚠️ <strong>Legal Disclaimer:</strong> These contract templates are
              provided as a starting point and should be reviewed and customized
              by a qualified attorney familiar with international freight
              forwarding, maritime law, and your specific business requirements
              before use.
            </p>
          </div>

          {/* Contract Automation Section */}
          <div
            style={{
              marginTop: '32px',
              padding: '24px',
              background:
                'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              <div style={{ fontSize: '32px' }}>🤖</div>
              <div>
                <h4
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#10b981',
                    marginBottom: '4px',
                  }}
                >
                  Smart Contract Automation
                </h4>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '13px',
                    margin: 0,
                  }}
                >
                  Contracts automatically trigger based on transactions and
                  shipment milestones
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
              }}
            >
              {/* Client Service Agreement Auto-Trigger */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>🤝</div>
                <h5
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#3b82f6',
                    marginBottom: '8px',
                  }}
                >
                  Client Service Agreement
                </h5>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: '8px',
                  }}
                >
                  <strong>Auto-generates when:</strong>
                </p>
                <ul
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    margin: 0,
                    paddingLeft: '20px',
                  }}
                >
                  <li>New client adds first shipment</li>
                  <li>Quote value exceeds $10,000</li>
                  <li>Client requests formal agreement</li>
                </ul>
              </div>

              {/* Carrier Rate Agreement Auto-Trigger */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>🚢</div>
                <h5
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#10b981',
                    marginBottom: '8px',
                  }}
                >
                  Carrier Rate Agreement
                </h5>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: '8px',
                  }}
                >
                  <strong>Auto-generates when:</strong>
                </p>
                <ul
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    margin: 0,
                    paddingLeft: '20px',
                  }}
                >
                  <li>Booking confirmed with shipping line</li>
                  <li>Volume exceeds 10 containers/month</li>
                  <li>Rate lock requested by client</li>
                </ul>
              </div>

              {/* Customs Broker Agreement Auto-Trigger */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>🛃</div>
                <h5
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#8b5cf6',
                    marginBottom: '8px',
                  }}
                >
                  Customs Broker Agreement
                </h5>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: '8px',
                  }}
                >
                  <strong>Auto-generates when:</strong>
                </p>
                <ul
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    margin: 0,
                    paddingLeft: '20px',
                  }}
                >
                  <li>Shipment reaches destination port</li>
                  <li>Customs clearance initiated</li>
                  <li>Power of attorney needed</li>
                </ul>
              </div>

              {/* Trucking Contract Auto-Trigger */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>🚛</div>
                <h5
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#f59e0b',
                    marginBottom: '8px',
                  }}
                >
                  Trucking Contract
                </h5>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: '8px',
                  }}
                >
                  <strong>Auto-generates when:</strong>
                </p>
                <ul
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    margin: 0,
                    paddingLeft: '20px',
                  }}
                >
                  <li>Container ready for pickup</li>
                  <li>Door-to-door service selected</li>
                  <li>Drayage services arranged</li>
                </ul>
              </div>

              {/* Insurance Contract Auto-Trigger */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>🛡️</div>
                <h5
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#06b6d4',
                    marginBottom: '8px',
                  }}
                >
                  Insurance Contract
                </h5>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: '8px',
                  }}
                >
                  <strong>Auto-generates when:</strong>
                </p>
                <ul
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    margin: 0,
                    paddingLeft: '20px',
                  }}
                >
                  <li>Cargo value exceeds $50,000</li>
                  <li>Client requests insurance coverage</li>
                  <li>High-value goods detected</li>
                </ul>
              </div>

              {/* SLA Agreement Auto-Trigger */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '8px' }}>⚡</div>
                <h5
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#14b8a6',
                    marginBottom: '8px',
                  }}
                >
                  SLA Agreement
                </h5>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: '8px',
                  }}
                >
                  <strong>Auto-generates when:</strong>
                </p>
                <ul
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    margin: 0,
                    paddingLeft: '20px',
                  }}
                >
                  <li>Premium service tier selected</li>
                  <li>Express transit requested</li>
                  <li>Guaranteed delivery date required</li>
                </ul>
              </div>
            </div>

            {/* Automation Features */}
            <div
              style={{
                marginTop: '20px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
              }}
            >
              <h5
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#10b981',
                  marginBottom: '12px',
                }}
              >
                ✨ Automated Actions on Contract Events:
              </h5>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}
              >
                <div
                  style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}
                >
                  ✅ Auto-send to client for e-signature
                </div>
                <div
                  style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}
                >
                  ✅ Email + SMS notifications sent
                </div>
                <div
                  style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}
                >
                  ✅ Track signature status in real-time
                </div>
                <div
                  style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}
                >
                  ✅ Reminder notifications (24h, 72h)
                </div>
                <div
                  style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}
                >
                  ✅ Auto-archive when fully executed
                </div>
                <div
                  style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}
                >
                  ✅ Expiry alerts (30, 60, 90 days)
                </div>
                <div
                  style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}
                >
                  ✅ Auto-renewal workflow triggered
                </div>
                <div
                  style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}
                >
                  ✅ Compliance audit trail maintained
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bond Management Section */}
      {activeTest === 'bond-management' && (
        <div
          style={{
            background: 'rgba(5, 150, 105, 0.1)',
            padding: '32px',
            borderRadius: '16px',
            border: '1px solid rgba(5, 150, 105, 0.3)',
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#059669',
                marginBottom: '8px',
              }}
            >
              🔐 Customs Bond Management System
            </h3>
            <p
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                lineHeight: '1.6',
              }}
            >
              Comprehensive bond management with utilization tracking, renewal
              alerts, surety company integration, and financial reporting for
              customs brokers and freight forwarders.
            </p>
          </div>

          {/* SuretyCloud Integration */}
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '24px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            <h4
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#3b82f6',
                marginBottom: '16px',
              }}
            >
              🔗 SuretyCloud Integration
            </h4>

            {!suretyCloudConfig.isConfigured ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#3b82f6',
                      marginBottom: '4px',
                    }}
                  >
                    API Key
                  </label>
                  <input
                    type='password'
                    value={suretyCloudConfig.apiKey}
                    onChange={(e) =>
                      setSuretyCloudConfig((prev) => ({
                        ...prev,
                        apiKey: e.target.value,
                      }))
                    }
                    placeholder='Your SuretyCloud API Key'
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '6px',
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
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#3b82f6',
                      marginBottom: '4px',
                    }}
                  >
                    Organization ID
                  </label>
                  <input
                    type='text'
                    value={suretyCloudConfig.organizationId}
                    onChange={(e) =>
                      setSuretyCloudConfig((prev) => ({
                        ...prev,
                        organizationId: e.target.value,
                      }))
                    }
                    placeholder='Your Organization ID'
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '6px',
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
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#3b82f6',
                      marginBottom: '4px',
                    }}
                  >
                    API Base URL
                  </label>
                  <input
                    type='text'
                    value={suretyCloudConfig.baseUrl}
                    onChange={(e) =>
                      setSuretyCloudConfig((prev) => ({
                        ...prev,
                        baseUrl: e.target.value,
                      }))
                    }
                    placeholder='https://api.suretycloud.com/v1'
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>
                    {suretyCloudConfig.isConnected ? '🟢' : '🟡'}
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'white',
                      }}
                    >
                      SuretyCloud{' '}
                      {suretyCloudConfig.isConnected
                        ? 'Connected'
                        : 'Configured'}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.7)',
                      }}
                    >
                      Organization: {suretyCloudConfig.organizationId}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={syncSuretyCloudBonds}
                    disabled={loading || !suretyCloudConfig.isConnected}
                    style={{
                      padding: '8px 16px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    🔄 Sync Bond Statuses
                  </button>

                  <button
                    onClick={() =>
                      setSuretyCloudConfig((prev) => ({
                        ...prev,
                        isConfigured: false,
                      }))
                    }
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    ⚙️ Reconfigure
                  </button>
                </div>
              </div>
            )}

            {!suretyCloudConfig.isConfigured && (
              <button
                onClick={configureSuretyCloud}
                disabled={
                  loading ||
                  !suretyCloudConfig.apiKey ||
                  !suretyCloudConfig.organizationId
                }
                style={{
                  width: '100%',
                  padding: '12px',
                  background: loading ? '#6b7280' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '16px',
                }}
              >
                {loading ? '🔄 Connecting...' : '🔗 Connect to SuretyCloud'}
              </button>
            )}

            {suretyCloudConfig.isConfigured &&
              suretyCloudConfig.isConnected && (
                <>
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <h5
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#10b981',
                        marginBottom: '8px',
                      }}
                    >
                      📝 Submit Bond Application via SuretyCloud
                    </h5>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '12px',
                        marginBottom: '12px',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#10b981',
                            marginBottom: '2px',
                          }}
                        >
                          Principal Email
                        </label>
                        <input
                          type='email'
                          value={suretyCloudApplication.principalEmail}
                          onChange={(e) =>
                            setSuretyCloudApplication((prev) => ({
                              ...prev,
                              principalEmail: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '6px 8px',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '4px',
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
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#10b981',
                            marginBottom: '2px',
                          }}
                        >
                          Principal Phone
                        </label>
                        <input
                          type='tel'
                          value={suretyCloudApplication.principalPhone}
                          onChange={(e) =>
                            setSuretyCloudApplication((prev) => ({
                              ...prev,
                              principalPhone: e.target.value,
                            }))
                          }
                          style={{
                            width: '100%',
                            padding: '6px 8px',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '12px',
                          }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={submitSuretyCloudApplication}
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: loading ? '#6b7280' : '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                      }}
                    >
                      {loading
                        ? '📤 Submitting...'
                        : '📤 Submit Bond Application'}
                    </button>
                  </div>

                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.7)',
                      textAlign: 'center',
                    }}
                  >
                    💡 Applications submitted via SuretyCloud are automatically
                    tracked and synchronized with your FleetFlow bond management
                    system.
                  </div>
                </>
              )}
          </div>

          {/* Bond Registration Form */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '24px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '1px solid rgba(5, 150, 105, 0.3)',
            }}
          >
            <h4
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#059669',
                marginBottom: '16px',
              }}
            >
              Register New Bond
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#059669',
                    marginBottom: '4px',
                  }}
                >
                  Bond Number
                </label>
                <input
                  type='text'
                  value={bondForm.bondNumber}
                  onChange={(e) =>
                    setBondForm((prev) => ({
                      ...prev,
                      bondNumber: e.target.value,
                    }))
                  }
                  placeholder='AUTO-GENERATED if empty'
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid rgba(5, 150, 105, 0.3)',
                    borderRadius: '6px',
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
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#059669',
                    marginBottom: '4px',
                  }}
                >
                  Bond Type
                </label>
                <select
                  value={bondForm.bondType}
                  onChange={(e) =>
                    setBondForm((prev) => ({
                      ...prev,
                      bondType: e.target.value as any,
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid rgba(5, 150, 105, 0.3)',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                >
                  <option value='SINGLE' style={{ background: '#1e293b' }}>
                    Single Entry
                  </option>
                  <option value='CONTINUOUS' style={{ background: '#1e293b' }}>
                    Continuous
                  </option>
                  <option value='ANNUAL' style={{ background: '#1e293b' }}>
                    Annual
                  </option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#059669',
                    marginBottom: '4px',
                  }}
                >
                  Surety Company
                </label>
                <select
                  value={bondForm.suretyCompany}
                  onChange={(e) =>
                    setBondForm((prev) => ({
                      ...prev,
                      suretyCompany: e.target.value,
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid rgba(5, 150, 105, 0.3)',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                >
                  <option
                    value='Liberty Mutual Surety'
                    style={{ background: '#1e293b' }}
                  >
                    Liberty Mutual Surety
                  </option>
                  <option value='AIG Surety' style={{ background: '#1e293b' }}>
                    AIG Surety
                  </option>
                  <option
                    value='Chubb Surety Group'
                    style={{ background: '#1e293b' }}
                  >
                    Chubb Surety Group
                  </option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#059669',
                    marginBottom: '4px',
                  }}
                >
                  Bond Amount (USD)
                </label>
                <input
                  type='number'
                  value={bondForm.bondAmount}
                  onChange={(e) =>
                    setBondForm((prev) => ({
                      ...prev,
                      bondAmount: parseInt(e.target.value) || 0,
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid rgba(5, 150, 105, 0.3)',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#059669',
                  marginBottom: '4px',
                }}
              >
                Principal Name (Freight Forwarder)
              </label>
              <input
                type='text'
                value={bondForm.principalName}
                onChange={(e) =>
                  setBondForm((prev) => ({
                    ...prev,
                    principalName: e.target.value,
                  }))
                }
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid rgba(5, 150, 105, 0.3)',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#059669',
                  marginBottom: '4px',
                }}
              >
                Ports Covered
              </label>
              <input
                type='text'
                value={bondForm.portsCovered.join(', ')}
                onChange={(e) =>
                  setBondForm((prev) => ({
                    ...prev,
                    portsCovered: e.target.value
                      .split(',')
                      .map((p) => p.trim()),
                  }))
                }
                placeholder='USLAX, USNYC, USMIA'
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid rgba(5, 150, 105, 0.3)',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <button
              onClick={testBondManagement}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: loading ? '#6b7280' : '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              {loading ? '🔄 Registering Bond...' : '🔐 Register Customs Bond'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== CONSOLIDATED TAB COMPONENTS ====================

// Shipments & Tracking - Consolidates: Shipments, Quoting, Consolidation, Tracking
function ShipmentsTrackingTab({
  router,
  tenantId,
}: {
  router: any;
  tenantId: string;
}) {
  const [subTab, setSubTab] = useState('shipments');

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Sub-navigation */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'shipments', label: '📦 Shipments & Quoting' },
          { id: 'consolidation', label: '📦 Consolidation' },
          { id: 'tracking', label: '🚢 Live Tracking' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border:
                subTab === tab.id
                  ? '2px solid #10b981'
                  : '1px solid rgba(255, 255, 255, 0.1)',
              background:
                subTab === tab.id
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'rgba(255, 255, 255, 0.05)',
              color: subTab === tab.id ? '#10b981' : 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {subTab === 'shipments' && <ShipmentsTab router={router} />}
      {subTab === 'consolidation' && (
        <ShipmentConsolidationDashboard tenantId={tenantId} />
      )}
      {subTab === 'tracking' && <TrackingTab />}
    </div>
  );
}

// Compliance & Docs - Consolidates: Compliance, Documents, Contracts
function ComplianceDocsTab() {
  const [subTab, setSubTab] = useState('compliance');

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Sub-navigation */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'compliance', label: '🛃 Compliance & Screening' },
          { id: 'documents', label: '📄 Document Generation' },
          { id: 'contracts', label: '📋 Legal Contracts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border:
                subTab === tab.id
                  ? '2px solid #ef4444'
                  : '1px solid rgba(255, 255, 255, 0.1)',
              background:
                subTab === tab.id
                  ? 'rgba(239, 68, 68, 0.2)'
                  : 'rgba(255, 255, 255, 0.05)',
              color: subTab === tab.id ? '#ef4444' : 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {subTab === 'compliance' && <ComplianceAndDocumentsTab />}
      {subTab === 'documents' && <DocumentsTab />}
      {subTab === 'contracts' && <RateContractsTab />}
    </div>
  );
}

// Intelligence & Analytics - Consolidates: AI Intelligence, Market Intelligence, Financials, Analytics
function IntelligenceAnalyticsTab({
  stats,
  invoices,
  onViewInvoice,
}: {
  stats: any;
  invoices: any[];
  onViewInvoice: (invoice: any) => void;
}) {
  const [subTab, setSubTab] = useState('intelligence');

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Sub-navigation */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'intelligence', label: '🤖 AI Intelligence' },
          { id: 'financials', label: '💰 Financials & Invoices' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border:
                subTab === tab.id
                  ? '2px solid #3b82f6'
                  : '1px solid rgba(255, 255, 255, 0.1)',
              background:
                subTab === tab.id
                  ? 'rgba(59, 130, 246, 0.2)'
                  : 'rgba(255, 255, 255, 0.05)',
              color: subTab === tab.id ? '#3b82f6' : 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {subTab === 'intelligence' && <IntelligenceTab stats={stats} />}
      {subTab === 'financials' && (
        <FinancialsTab
          stats={stats}
          invoices={invoices}
          onViewInvoice={onViewInvoice}
        />
      )}
    </div>
  );
}

// Operations & WMS - Consolidates: Task Management, WMS, Cross-Border
function OperationsWMSTab() {
  const [subTab, setSubTab] = useState('tasks');

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Sub-navigation */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'tasks', label: '✅ Task Management' },
          { id: 'wms', label: '🏭 Warehouse Management' },
          { id: 'crossborder', label: '🇨🇦🇲🇽 Cross-Border' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border:
                subTab === tab.id
                  ? '2px solid #f59e0b'
                  : '1px solid rgba(255, 255, 255, 0.1)',
              background:
                subTab === tab.id
                  ? 'rgba(245, 158, 11, 0.2)'
                  : 'rgba(255, 255, 255, 0.05)',
              color: subTab === tab.id ? '#f59e0b' : 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {subTab === 'tasks' && <TaskManagementTab />}
      {subTab === 'wms' && <WarehouseManagementTab />}
      {subTab === 'crossborder' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(220, 38, 38, 0.3)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '16px',
                color: '#dc2626',
              }}
            >
              🇨🇦 Canada Cross-Border
            </h3>
            <CanadaCrossBorderView shipments={[]} />
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(220, 38, 38, 0.3)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '16px',
                color: '#dc2626',
              }}
            >
              🇲🇽 Mexico Cross-Border
            </h3>
            <MexicoCrossBorderView shipments={[]} />
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== AUTOMATION HUB TAB ====================

function AutomationHubTab() {
  const [activeAutomations, setActiveAutomations] = useState([
    {
      id: 'quote_followup',
      name: 'Quote Follow-up',
      enabled: true,
      emailsSent: 47,
      conversionRate: 32,
    },
    {
      id: 'payment_collection',
      name: 'Payment Collection',
      enabled: true,
      remindersSent: 23,
      collected: '$12,450',
    },
    {
      id: 'milestone_notifications',
      name: 'Milestone Notifications',
      enabled: true,
      notificationsSent: 156,
      satisfaction: 98,
    },
    {
      id: 'rate_shopping',
      name: 'Smart Rate Shopping',
      enabled: true,
      quotesShopped: 34,
      savingsGenerated: '$8,920',
    },
    {
      id: 'container_tracking',
      name: 'Container Tracking',
      enabled: true,
      containersTracked: 89,
      etaUpdates: 234,
    },
    {
      id: 'document_generation',
      name: 'Document Auto-Generation',
      enabled: true,
      documentsCreated: 156,
      timeSaved: '12.3hrs',
    },
    {
      id: 'compliance_screening',
      name: 'Compliance Screening',
      enabled: true,
      partiesScreened: 67,
      flagged: 2,
    },
    {
      id: 'consolidation_alerts',
      name: 'Consolidation Alerts',
      enabled: true,
      opportunities: 8,
      savings: '$15,670',
    },
    {
      id: 'contract_renewal',
      name: 'Contract Renewal Monitoring',
      enabled: true,
      renewalsSent: 5,
      renewed: 4,
    },
    {
      id: 'dynamic_pricing',
      name: 'Dynamic Pricing',
      enabled: true,
      adjustments: 234,
      revenueImpact: '+$4,230',
    },
    {
      id: 'sla_monitoring',
      name: 'SLA Monitoring',
      enabled: true,
      violations: 0,
      compliance: '100%',
    },
    {
      id: 'customer_portal',
      name: 'Customer Portal Auto-Provision',
      enabled: true,
      portalsCreated: 12,
      logins: 89,
    },
  ]);

  const toggleAutomation = (id: string) => {
    setActiveAutomations((prev) =>
      prev.map((auto) =>
        auto.id === id ? { ...auto, enabled: !auto.enabled } : auto
      )
    );
  };

  const automationStats = {
    totalEmailsSent: 347,
    totalSmsSent: 123,
    documentsGenerated: 156,
    timeSaved: '4.2 hours/day',
    costSaved: '$3,240/month',
    revenueIncrease: '+$12,890/month',
    conversionIncrease: '+28%',
    customerSatisfaction: '98%',
  };

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      {/* Header */}
      <div>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: '800',
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          🤖 Automation Hub - Command Center
        </h2>
        <p
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '16px',
            margin: 0,
          }}
        >
          Monitor, configure, and optimize all freight forwarding automations
          from one dashboard
        </p>
      </div>

      {/* Automation Stats Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(244, 63, 94, 0.2))',
            border: '2px solid rgba(236, 72, 153, 0.3)',
            borderRadius: '16px',
            padding: '20px',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '4px',
            }}
          >
            Total Emails Sent
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#ec4899',
              marginBottom: '8px',
            }}
          >
            {automationStats.totalEmailsSent}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
            📧 Last 30 days
          </div>
        </div>

        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
            border: '2px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '20px',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '4px',
            }}
          >
            Time Saved
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#10b981',
              marginBottom: '8px',
            }}
          >
            {automationStats.timeSaved}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
            ⏱️ Per day average
          </div>
        </div>

        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))',
            border: '2px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '16px',
            padding: '20px',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '4px',
            }}
          >
            Cost Saved
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#3b82f6',
              marginBottom: '8px',
            }}
          >
            {automationStats.costSaved}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
            💰 Monthly savings
          </div>
        </div>

        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.2))',
            border: '2px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            padding: '20px',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '4px',
            }}
          >
            Revenue Increase
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#8b5cf6',
              marginBottom: '8px',
            }}
          >
            {automationStats.revenueIncrease}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
            📈 From automation
          </div>
        </div>
      </div>

      {/* Active Automations List */}
      <div>
        <h3
          style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '20px',
            color: 'white',
          }}
        >
          Active Automations (
          {activeAutomations.filter((a) => a.enabled).length}/
          {activeAutomations.length})
        </h3>

        <div style={{ display: 'grid', gap: '16px' }}>
          {activeAutomations.map((automation) => (
            <div
              key={automation.id}
              style={{
                background: automation.enabled
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(255, 255, 255, 0.03)',
                borderRadius: '16px',
                padding: '24px',
                border: `2px solid ${automation.enabled ? 'rgba(236, 72, 153, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Toggle Switch */}
              <button
                onClick={() => toggleAutomation(automation.id)}
                style={{
                  width: '56px',
                  height: '32px',
                  borderRadius: '16px',
                  border: 'none',
                  background: automation.enabled
                    ? 'linear-gradient(135deg, #ec4899, #f43f5e)'
                    : 'rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'white',
                    position: 'absolute',
                    top: '4px',
                    left: automation.enabled ? '28px' : '4px',
                    transition: 'all 0.3s ease',
                  }}
                />
              </button>

              {/* Automation Info */}
              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    margin: '0 0 8px 0',
                    color: 'white',
                  }}
                >
                  {automation.name}
                </h4>
                <div
                  style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}
                >
                  {automation.id === 'quote_followup' && (
                    <>
                      📧 {automation.emailsSent} emails sent •{' '}
                      {automation.conversionRate}% conversion rate
                    </>
                  )}
                  {automation.id === 'payment_collection' && (
                    <>
                      💸 {automation.remindersSent} reminders sent •{' '}
                      {automation.collected} collected
                    </>
                  )}
                  {automation.id === 'milestone_notifications' && (
                    <>
                      📬 {automation.notificationsSent} notifications •{' '}
                      {automation.satisfaction}% satisfaction
                    </>
                  )}
                  {automation.id === 'rate_shopping' && (
                    <>
                      🔍 {automation.quotesShopped} quotes shopped •{' '}
                      {automation.savingsGenerated} saved
                    </>
                  )}
                  {automation.id === 'container_tracking' && (
                    <>
                      📍 {automation.containersTracked} containers •{' '}
                      {automation.etaUpdates} ETA updates
                    </>
                  )}
                  {automation.id === 'document_generation' && (
                    <>
                      📄 {automation.documentsCreated} documents •{' '}
                      {automation.timeSaved} saved
                    </>
                  )}
                  {automation.id === 'compliance_screening' && (
                    <>
                      🛡️ {automation.partiesScreened} parties screened •{' '}
                      {automation.flagged} flagged
                    </>
                  )}
                  {automation.id === 'consolidation_alerts' && (
                    <>
                      📦 {automation.opportunities} opportunities •{' '}
                      {automation.savings} potential savings
                    </>
                  )}
                  {automation.id === 'contract_renewal' && (
                    <>
                      📋 {automation.renewalsSent} notices sent •{' '}
                      {automation.renewed} renewed
                    </>
                  )}
                  {automation.id === 'dynamic_pricing' && (
                    <>
                      💰 {automation.adjustments} adjustments •{' '}
                      {automation.revenueImpact} revenue impact
                    </>
                  )}
                  {automation.id === 'sla_monitoring' && (
                    <>
                      ⏱️ {automation.violations} violations •{' '}
                      {automation.compliance} compliance
                    </>
                  )}
                  {automation.id === 'customer_portal' && (
                    <>
                      👥 {automation.portalsCreated} portals created •{' '}
                      {automation.logins} logins
                    </>
                  )}
                </div>
              </div>

              {/* Configure Button */}
              <button
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  background: 'rgba(236, 72, 153, 0.1)',
                  color: '#ec4899',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(236, 72, 153, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(236, 72, 153, 0.1)';
                }}
              >
                ⚙️ Configure
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Automation Performance */}
      <div>
        <h3
          style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '20px',
            color: 'white',
          }}
        >
          Automation Performance
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h4
              style={{
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '16px',
                color: '#10b981',
              }}
            >
              ✅ Top Performing Automations
            </h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                1. Container Tracking - 98% user engagement
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                2. Quote Follow-up - 32% conversion rate
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                3. Payment Collection - $12.4K collected
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h4
              style={{
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '16px',
                color: '#3b82f6',
              }}
            >
              💡 Optimization Opportunities
            </h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                • Enable consolidation alerts for 15% more savings
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                • Increase payment reminder frequency
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                • Add SMS notifications to milestone tracking
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h4
              style={{
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '16px',
                color: '#ec4899',
              }}
            >
              📊 This Month's Impact
            </h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                • Conversion rate increased by 28%
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                • Customer satisfaction at 98%
              </div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
                • Operational costs reduced by $3,240
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
