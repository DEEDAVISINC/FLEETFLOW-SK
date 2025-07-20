'use client';

import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { useLoad } from '../contexts/LoadContext';

interface LoadInfo {
  // Basic Load Information
  loadId: string;
  referenceNumber: string;
  brokerOrderNumber: string;
  customerOrderNumber: string;
  
  // Shipper Information
  shipperName: string;
  shipperAddress: string;
  shipperCity: string;
  shipperState: string;
  shipperZip: string;
  shipperContact: string;
  shipperPhone: string;
  shipperEmail: string;
  shipperInstructions: string;
  
  // Consignee Information
  consigneeName: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeState: string;
  consigneeZip: string;
  consigneeContact: string;
  consigneePhone: string;
  consigneeEmail: string;
  consigneeInstructions: string;
  
  // Carrier Information
  carrierName: string;
  carrierAddress: string;
  carrierCity: string;
  carrierState: string;
  carrierZip: string;
  carrierMC: string;
  carrierDOT: string;
  carrierPhone: string;
  carrierEmail: string;
  carrierFAX: string;
  
  // Driver Information
  driverName: string;
  driverPhone: string;
  driverEmail: string;
  driverLicenseNumber: string;
  driverLicenseState: string;
  
  // Equipment Information
  equipmentType: string;
  equipmentLength: string;
  equipmentWeight: string;
  trailerType: string;
  temperatureControl: string;
  specialEquipment: string;
  
  // Commodity Information
  commodityDescription: string;
  commodityClass: string;
  commodityWeight: string;
  commodityPieces: string;
  commodityValue: string;
  commodityHazmat: boolean;
  hazmatClass: string;
  
  // Dates and Times
  pickupDate: string;
  pickupTimeEarliest: string;
  pickupTimeLatest: string;
  deliveryDate: string;
  deliveryTimeEarliest: string;
  deliveryTimeLatest: string;
  
  // Rate Information
  lineHaulRate: number;
  fuelSurcharge: number;
  accessorialCharges: number;
  detentionRate: number;
  layoverRate: number;
  totalRate: number;
  advanceAmount: number;
  
  // Payment Terms
  paymentTerms: string;
  paymentMethod: string;
  factoring: boolean;
  factoringCompany: string;
  quickPayDiscount: number;
  
  // Legal and Compliance
  insuranceRequired: string;
  insuranceAmount: string;
  bonded: boolean;
  teamDriverRequired: boolean;
  
  // Special Instructions
  specialInstructions: string;
  lumperFee: string;
  appointmentRequired: boolean;
  
  // Documents Required
  bolRequired: boolean;
  podRequired: boolean;
  scaleticketsRequired: boolean;
  
  // Tracking and Updates
  trackingUpdates: string;
  emergencyContact: string;
  emergencyPhone: string;
}

export default function RateConfirmation() {
  const { selectedLoad } = useLoad();
  
  const [loadInfo, setLoadInfo] = useState<LoadInfo>({
    // Basic Load Information
    loadId: '',
    referenceNumber: '',
    brokerOrderNumber: '',
    customerOrderNumber: '',
    
    // Shipper Information
    shipperName: '',
    shipperAddress: '',
    shipperCity: '',
    shipperState: '',
    shipperZip: '',
    shipperContact: '',
    shipperPhone: '',
    shipperEmail: '',
    shipperInstructions: '',
    
    // Consignee Information
    consigneeName: '',
    consigneeAddress: '',
    consigneeCity: '',
    consigneeState: '',
    consigneeZip: '',
    consigneeContact: '',
    consigneePhone: '',
    consigneeEmail: '',
    consigneeInstructions: '',
    
    // Carrier Information
    carrierName: '',
    carrierAddress: '',
    carrierCity: '',
    carrierState: '',
    carrierZip: '',
    carrierMC: '',
    carrierDOT: '',
    carrierPhone: '',
    carrierEmail: '',
    carrierFAX: '',
    
    // Driver Information
    driverName: '',
    driverPhone: '',
    driverEmail: '',
    driverLicenseNumber: '',
    driverLicenseState: '',
    
    // Equipment Information
    equipmentType: 'Dry Van',
    equipmentLength: '53',
    equipmentWeight: '80000',
    trailerType: 'Standard',
    temperatureControl: 'N/A',
    specialEquipment: '',
    
    // Commodity Information
    commodityDescription: '',
    commodityClass: '',
    commodityWeight: '',
    commodityPieces: '',
    commodityValue: '',
    commodityHazmat: false,
    hazmatClass: '',
    
    // Dates and Times
    pickupDate: '',
    pickupTimeEarliest: '08:00',
    pickupTimeLatest: '17:00',
    deliveryDate: '',
    deliveryTimeEarliest: '08:00',
    deliveryTimeLatest: '17:00',
    
    // Rate Information
    lineHaulRate: 0,
    fuelSurcharge: 0,
    accessorialCharges: 0,
    detentionRate: 75,
    layoverRate: 200,
    totalRate: 0,
    advanceAmount: 0,
    
    // Payment Terms
    paymentTerms: 'Net 30',
    paymentMethod: 'ACH',
    factoring: false,
    factoringCompany: '',
    quickPayDiscount: 0,
    
    // Legal and Compliance
    insuranceRequired: '$1,000,000 General Liability, $100,000 Cargo',
    insuranceAmount: '$1,000,000',
    bonded: false,
    teamDriverRequired: false,
    
    // Special Instructions
    specialInstructions: '',
    lumperFee: '',
    appointmentRequired: false,
    
    // Documents Required
    bolRequired: true,
    podRequired: true,
    scaleticketsRequired: false,
    
    // Tracking and Updates
    trackingUpdates: 'Every 4 hours',
    emergencyContact: 'FleetFlow Dispatch',
    emergencyPhone: '1-800-FLEET-01'
  });

  useEffect(() => {
    if (selectedLoad) {
      setLoadInfo(prev => ({
        ...prev,
        loadId: selectedLoad.id,
        referenceNumber: `FF-${selectedLoad.id}-${new Date().getFullYear()}`,
        brokerOrderNumber: `BO-${selectedLoad.id}`,
        shipperName: selectedLoad.origin?.split(',')[0] || '',
        shipperCity: selectedLoad.origin?.split(',')[1]?.trim() || '',
        shipperState: selectedLoad.origin?.split(',')[2]?.trim() || '',
        consigneeName: selectedLoad.destination?.split(',')[0] || '',
        consigneeCity: selectedLoad.destination?.split(',')[1]?.trim() || '',
        consigneeState: selectedLoad.destination?.split(',')[2]?.trim() || '',
        carrierName: selectedLoad.carrierName || '',
        driverName: selectedLoad.driverName || '',
        equipmentType: selectedLoad.equipment || 'Dry Van',
        commodityWeight: selectedLoad.weight || '',
        pickupDate: selectedLoad.pickupDate || '',
        deliveryDate: selectedLoad.deliveryDate || '',
        lineHaulRate: typeof selectedLoad.rate === 'string' ? parseFloat(selectedLoad.rate.replace(/[$,]/g, '')) || 0 : selectedLoad.rate,
        totalRate: typeof selectedLoad.rate === 'string' ? parseFloat(selectedLoad.rate.replace(/[$,]/g, '')) || 0 : selectedLoad.rate,
      }));
    }
  }, [selectedLoad]);

  const calculateTotalRate = () => {
    const total = loadInfo.lineHaulRate + loadInfo.fuelSurcharge + loadInfo.accessorialCharges;
    setLoadInfo(prev => ({ ...prev, totalRate: total }));
  };

  const generateRateConfirmation = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    let yPosition = 20;
    
    // Header with Company Logo Area
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RATE CONFIRMATION', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    // Confirmation Details
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Confirmation #: ${loadInfo.referenceNumber}`, 20, yPosition);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 80, yPosition);
    yPosition += 10;
    pdf.text(`Load ID: ${loadInfo.loadId}`, 20, yPosition);
    pdf.text(`Time: ${new Date().toLocaleTimeString()}`, pageWidth - 80, yPosition);
    yPosition += 20;

    // Broker Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('BROKER INFORMATION', 20, yPosition);
    yPosition += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.text('FleetFlow Logistics LLC', 20, yPosition);
    yPosition += 7;
    pdf.text('MC: MC-123456 | DOT: 123456', 20, yPosition);
    yPosition += 7;
    pdf.text('Address: 123 Main Street, Anytown, ST 12345', 20, yPosition);
    yPosition += 7;
    pdf.text('Phone: (555) 123-4567 | Email: dispatch@fleetflow.com', 20, yPosition);
    yPosition += 20;

    // Carrier Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('CARRIER INFORMATION', 20, yPosition);
    yPosition += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Company: ${loadInfo.carrierName}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`MC: ${loadInfo.carrierMC} | DOT: ${loadInfo.carrierDOT}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Address: ${loadInfo.carrierAddress}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`${loadInfo.carrierCity}, ${loadInfo.carrierState} ${loadInfo.carrierZip}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Phone: ${loadInfo.carrierPhone} | Email: ${loadInfo.carrierEmail}`, 20, yPosition);
    yPosition += 20;

    // Driver Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('DRIVER INFORMATION', 20, yPosition);
    yPosition += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Name: ${loadInfo.driverName}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Phone: ${loadInfo.driverPhone}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Email: ${loadInfo.driverEmail}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`License #: ${loadInfo.driverLicenseNumber} (${loadInfo.driverLicenseState})`, 20, yPosition);
    yPosition += 20;

    // Check if we need a new page
    if (yPosition > pageHeight - 100) {
      pdf.addPage();
      yPosition = 20;
    }

    // Shipment Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('SHIPMENT INFORMATION', 20, yPosition);
    yPosition += 10;
    pdf.setFont('helvetica', 'normal');
    
    // Pickup Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('PICKUP:', 20, yPosition);
    yPosition += 7;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${loadInfo.shipperName}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`${loadInfo.shipperAddress}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`${loadInfo.shipperCity}, ${loadInfo.shipperState} ${loadInfo.shipperZip}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Contact: ${loadInfo.shipperContact} | Phone: ${loadInfo.shipperPhone}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Date: ${loadInfo.pickupDate} | Time: ${loadInfo.pickupTimeEarliest} - ${loadInfo.pickupTimeLatest}`, 20, yPosition);
    yPosition += 15;

    // Delivery Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('DELIVERY:', 20, yPosition);
    yPosition += 7;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${loadInfo.consigneeName}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`${loadInfo.consigneeAddress}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`${loadInfo.consigneeCity}, ${loadInfo.consigneeState} ${loadInfo.consigneeZip}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Contact: ${loadInfo.consigneeContact} | Phone: ${loadInfo.consigneePhone}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Date: ${loadInfo.deliveryDate} | Time: ${loadInfo.deliveryTimeEarliest} - ${loadInfo.deliveryTimeLatest}`, 20, yPosition);
    yPosition += 20;

    // Equipment and Commodity Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('EQUIPMENT & COMMODITY', 20, yPosition);
    yPosition += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Equipment: ${loadInfo.equipmentType} | Length: ${loadInfo.equipmentLength}' | Weight: ${loadInfo.equipmentWeight} lbs`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Commodity: ${loadInfo.commodityDescription}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Weight: ${loadInfo.commodityWeight} lbs | Pieces: ${loadInfo.commodityPieces} | Class: ${loadInfo.commodityClass}`, 20, yPosition);
    yPosition += 7;
    if (loadInfo.commodityHazmat) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`⚠️ HAZMAT: Class ${loadInfo.hazmatClass}`, 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      yPosition += 7;
    }
    yPosition += 15;

    // Rate Information
    pdf.setFont('helvetica', 'bold');
    pdf.text('RATE INFORMATION', 20, yPosition);
    yPosition += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Line Haul Rate: $${loadInfo.lineHaulRate.toFixed(2)}`, 20, yPosition);
    yPosition += 7;
    if (loadInfo.fuelSurcharge > 0) {
      pdf.text(`Fuel Surcharge: $${loadInfo.fuelSurcharge.toFixed(2)}`, 20, yPosition);
      yPosition += 7;
    }
    if (loadInfo.accessorialCharges > 0) {
      pdf.text(`Accessorial Charges: $${loadInfo.accessorialCharges.toFixed(2)}`, 20, yPosition);
      yPosition += 7;
    }
    pdf.setFont('helvetica', 'bold');
    pdf.text(`TOTAL RATE: $${loadInfo.totalRate.toFixed(2)}`, 20, yPosition);
    yPosition += 15;

    // Payment Terms
    pdf.setFont('helvetica', 'bold');
    pdf.text('PAYMENT TERMS', 20, yPosition);
    yPosition += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Payment Terms: ${loadInfo.paymentTerms}`, 20, yPosition);
    yPosition += 7;
    pdf.text(`Payment Method: ${loadInfo.paymentMethod}`, 20, yPosition);
    yPosition += 7;
    if (loadInfo.factoring) {
      pdf.text(`Factoring Company: ${loadInfo.factoringCompany}`, 20, yPosition);
      yPosition += 7;
    }
    if (loadInfo.quickPayDiscount > 0) {
      pdf.text(`Quick Pay Discount: ${loadInfo.quickPayDiscount}%`, 20, yPosition);
      yPosition += 7;
    }
    yPosition += 15;

    // Legal Terms and Conditions
    pdf.setFont('helvetica', 'bold');
    pdf.text('TERMS AND CONDITIONS', 20, yPosition);
    yPosition += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    
    const legalTerms = [
      '1. This rate confirmation is subject to the terms and conditions of the Transportation Agreement between Broker and Carrier.',
      '2. Carrier agrees to maintain insurance coverage as specified and provide certificates upon request.',
      '3. Detention will be charged at $75/hour after 2 hours of free time.',
      '4. Layover will be charged at $200/day if delivery is delayed beyond carrier control.',
      '5. All freight charges are subject to verification of weight, count, and condition.',
      '6. Carrier assumes full responsibility for cargo from pickup to delivery.',
      '7. Any modifications to this agreement must be in writing and signed by both parties.',
      '8. This agreement is governed by the laws of the state where the broker is located.'
    ];

    legalTerms.forEach(term => {
      const splitText = pdf.splitTextToSize(term, pageWidth - 40);
      pdf.text(splitText, 20, yPosition);
      yPosition += splitText.length * 5;
    });

    // Signature Section
    yPosition += 20;
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ACCEPTANCE', 20, yPosition);
    yPosition += 15;
    pdf.setFont('helvetica', 'normal');
    pdf.text('Broker: FleetFlow Logistics LLC', 20, yPosition);
    yPosition += 20;
    pdf.text('Signature: _________________________ Date: __________', 20, yPosition);
    yPosition += 25;
    pdf.text('Carrier: ' + loadInfo.carrierName, 20, yPosition);
    yPosition += 20;
    pdf.text('Signature: _________________________ Date: __________', 20, yPosition);

    // Footer
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('This document was generated electronically by FleetFlow Logistics System', pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    // Save the PDF
    pdf.save(`Rate_Confirmation_${loadInfo.loadId || 'Draft'}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    fontFamily: 'inherit'
  };

  const sectionStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '16px'
  };

  return (
    <div style={{ color: 'white' }}>
      {/* Load Information Section */}
      <div style={sectionStyle}>
        <h3 style={{ margin: '0 0 20px 0', color: '#4ade80', fontSize: '18px' }}>Load Information</h3>
        <div style={gridStyle}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Load ID</label>
            <input
              type="text"
              value={loadInfo.loadId}
              onChange={(e) => setLoadInfo({...loadInfo, loadId: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Reference Number</label>
            <input
              type="text"
              value={loadInfo.referenceNumber}
              onChange={(e) => setLoadInfo({...loadInfo, referenceNumber: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Broker Order #</label>
            <input
              type="text"
              value={loadInfo.brokerOrderNumber}
              onChange={(e) => setLoadInfo({...loadInfo, brokerOrderNumber: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Customer Order #</label>
            <input
              type="text"
              value={loadInfo.customerOrderNumber}
              onChange={(e) => setLoadInfo({...loadInfo, customerOrderNumber: e.target.value})}
              style={inputStyle}
            />
          </div>
          </div>
        </div>
        
      {/* Shipper Information Section */}
      <div style={sectionStyle}>
        <h3 style={{ margin: '0 0 20px 0', color: '#4ade80', fontSize: '18px' }}>Shipper Information</h3>
        <div style={gridStyle}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Company Name</label>
            <input
              type="text"
              value={loadInfo.shipperName}
              onChange={(e) => setLoadInfo({...loadInfo, shipperName: e.target.value})}
              style={inputStyle}
            />
              </div>
              <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Contact Person</label>
            <input
              type="text"
              value={loadInfo.shipperContact}
              onChange={(e) => setLoadInfo({...loadInfo, shipperContact: e.target.value})}
              style={inputStyle}
            />
              </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Phone</label>
            <input
              type="text"
              value={loadInfo.shipperPhone}
              onChange={(e) => setLoadInfo({...loadInfo, shipperPhone: e.target.value})}
              style={inputStyle}
            />
            </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Email</label>
            <input
              type="email"
              value={loadInfo.shipperEmail}
              onChange={(e) => setLoadInfo({...loadInfo, shipperEmail: e.target.value})}
              style={inputStyle}
            />
          </div>
        </div>
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Address</label>
              <input
                type="text"
                value={loadInfo.shipperAddress}
                onChange={(e) => setLoadInfo({...loadInfo, shipperAddress: e.target.value})}
                style={inputStyle}
              />
      </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>City</label>
              <input
                type="text"
                value={loadInfo.shipperCity}
                onChange={(e) => setLoadInfo({...loadInfo, shipperCity: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>State</label>
              <input
                type="text"
                value={loadInfo.shipperState}
                onChange={(e) => setLoadInfo({...loadInfo, shipperState: e.target.value})}
                style={inputStyle}
              />
          </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>ZIP</label>
              <input
                type="text"
                value={loadInfo.shipperZip}
                onChange={(e) => setLoadInfo({...loadInfo, shipperZip: e.target.value})}
                style={inputStyle}
              />
            </div>
            </div>
          </div>
        </div>

      {/* Consignee Information Section */}
      <div style={sectionStyle}>
        <h3 style={{ margin: '0 0 20px 0', color: '#4ade80', fontSize: '18px' }}>Consignee Information</h3>
        <div style={gridStyle}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Company Name</label>
            <input
              type="text"
              value={loadInfo.consigneeName}
              onChange={(e) => setLoadInfo({...loadInfo, consigneeName: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Contact Person</label>
            <input
              type="text"
              value={loadInfo.consigneeContact}
              onChange={(e) => setLoadInfo({...loadInfo, consigneeContact: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Phone</label>
            <input
              type="text"
              value={loadInfo.consigneePhone}
              onChange={(e) => setLoadInfo({...loadInfo, consigneePhone: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Email</label>
            <input
              type="email"
              value={loadInfo.consigneeEmail}
              onChange={(e) => setLoadInfo({...loadInfo, consigneeEmail: e.target.value})}
              style={inputStyle}
            />
          </div>
        </div>
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Address</label>
              <input
                type="text"
                value={loadInfo.consigneeAddress}
                onChange={(e) => setLoadInfo({...loadInfo, consigneeAddress: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>City</label>
              <input
                type="text"
                value={loadInfo.consigneeCity}
                onChange={(e) => setLoadInfo({...loadInfo, consigneeCity: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>State</label>
              <input
                type="text"
                value={loadInfo.consigneeState}
                onChange={(e) => setLoadInfo({...loadInfo, consigneeState: e.target.value})}
                style={inputStyle}
              />
          </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>ZIP</label>
              <input
                type="text"
                value={loadInfo.consigneeZip}
                onChange={(e) => setLoadInfo({...loadInfo, consigneeZip: e.target.value})}
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Carrier Information Section */}
      <div style={sectionStyle}>
        <h3 style={{ margin: '0 0 20px 0', color: '#4ade80', fontSize: '18px' }}>Carrier Information</h3>
        <div style={gridStyle}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Carrier Name</label>
            <input
              type="text"
              value={loadInfo.carrierName}
              onChange={(e) => setLoadInfo({...loadInfo, carrierName: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>MC Number</label>
                <input
                  type="text"
                  value={loadInfo.carrierMC}
              onChange={(e) => setLoadInfo({...loadInfo, carrierMC: e.target.value})}
              style={inputStyle}
                />
              </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>DOT Number</label>
                <input
                  type="text"
                  value={loadInfo.carrierDOT}
              onChange={(e) => setLoadInfo({...loadInfo, carrierDOT: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Phone</label>
            <input
              type="text"
              value={loadInfo.carrierPhone}
              onChange={(e) => setLoadInfo({...loadInfo, carrierPhone: e.target.value})}
              style={inputStyle}
            />
          </div>
        </div>
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Address</label>
              <input
                type="text"
                value={loadInfo.carrierAddress}
                onChange={(e) => setLoadInfo({...loadInfo, carrierAddress: e.target.value})}
                style={inputStyle}
                />
              </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>City</label>
              <input
                type="text"
                value={loadInfo.carrierCity}
                onChange={(e) => setLoadInfo({...loadInfo, carrierCity: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>State</label>
              <input
                type="text"
                value={loadInfo.carrierState}
                onChange={(e) => setLoadInfo({...loadInfo, carrierState: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>ZIP</label>
              <input
                type="text"
                value={loadInfo.carrierZip}
                onChange={(e) => setLoadInfo({...loadInfo, carrierZip: e.target.value})}
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Driver Information Section */}
      <div style={sectionStyle}>
        <h3 style={{ margin: '0 0 20px 0', color: '#4ade80', fontSize: '18px' }}>Driver Information</h3>
        <div style={gridStyle}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Driver Name</label>
            <input
              type="text"
              value={loadInfo.driverName}
              onChange={(e) => setLoadInfo({...loadInfo, driverName: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Phone</label>
            <input
              type="text"
              value={loadInfo.driverPhone}
              onChange={(e) => setLoadInfo({...loadInfo, driverPhone: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Email</label>
            <input
              type="email"
              value={loadInfo.driverEmail}
              onChange={(e) => setLoadInfo({...loadInfo, driverEmail: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>License Number</label>
            <input
              type="text"
              value={loadInfo.driverLicenseNumber}
              onChange={(e) => setLoadInfo({...loadInfo, driverLicenseNumber: e.target.value})}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Shipment Details Section */}
      <div style={sectionStyle}>
        <h3 style={{ margin: '0 0 20px 0', color: '#4ade80', fontSize: '18px' }}>Shipment Details</h3>
        <div style={gridStyle}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Pickup Date</label>
            <input
              type="date"
              value={loadInfo.pickupDate}
              onChange={(e) => setLoadInfo({...loadInfo, pickupDate: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Pickup Time (Earliest)</label>
            <input
              type="time"
              value={loadInfo.pickupTimeEarliest}
              onChange={(e) => setLoadInfo({...loadInfo, pickupTimeEarliest: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Pickup Time (Latest)</label>
            <input
              type="time"
              value={loadInfo.pickupTimeLatest}
              onChange={(e) => setLoadInfo({...loadInfo, pickupTimeLatest: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Delivery Date</label>
            <input
              type="date"
              value={loadInfo.deliveryDate}
              onChange={(e) => setLoadInfo({...loadInfo, deliveryDate: e.target.value})}
              style={inputStyle}
            />
          </div>
        </div>
        <div style={{ marginTop: '16px' }}>
          <div style={gridStyle}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Delivery Time (Earliest)</label>
              <input
                type="time"
                value={loadInfo.deliveryTimeEarliest}
                onChange={(e) => setLoadInfo({...loadInfo, deliveryTimeEarliest: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Delivery Time (Latest)</label>
              <input
                type="time"
                value={loadInfo.deliveryTimeLatest}
                onChange={(e) => setLoadInfo({...loadInfo, deliveryTimeLatest: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Equipment Type</label>
              <select
                value={loadInfo.equipmentType}
                onChange={(e) => setLoadInfo({...loadInfo, equipmentType: e.target.value})}
                style={inputStyle}
              >
                <option value="Dry Van">Dry Van</option>
                <option value="Reefer">Reefer</option>
                <option value="Flatbed">Flatbed</option>
                <option value="Step Deck">Step Deck</option>
                <option value="Lowboy">Lowboy</option>
                <option value="Tanker">Tanker</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Equipment Length</label>
              <select
                value={loadInfo.equipmentLength}
                onChange={(e) => setLoadInfo({...loadInfo, equipmentLength: e.target.value})}
                style={inputStyle}
              >
                <option value="48">48'</option>
                <option value="53">53'</option>
                <option value="40">40'</option>
                <option value="20">20'</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Commodity Information Section */}
      <div style={sectionStyle}>
        <h3 style={{ margin: '0 0 20px 0', color: '#4ade80', fontSize: '18px' }}>Commodity Information</h3>
        <div style={gridStyle}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Description</label>
            <input
              type="text"
              value={loadInfo.commodityDescription}
              onChange={(e) => setLoadInfo({...loadInfo, commodityDescription: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Weight (lbs)</label>
            <input
              type="text"
              value={loadInfo.commodityWeight}
              onChange={(e) => setLoadInfo({...loadInfo, commodityWeight: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Pieces</label>
            <input
              type="text"
              value={loadInfo.commodityPieces}
              onChange={(e) => setLoadInfo({...loadInfo, commodityPieces: e.target.value})}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Class</label>
            <input
              type="text"
              value={loadInfo.commodityClass}
              onChange={(e) => setLoadInfo({...loadInfo, commodityClass: e.target.value})}
              style={inputStyle}
            />
          </div>
        </div>
        <div style={{ marginTop: '16px' }}>
          <div style={gridStyle}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Declared Value</label>
              <input
                type="text"
                value={loadInfo.commodityValue}
                onChange={(e) => setLoadInfo({...loadInfo, commodityValue: e.target.value})}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={loadInfo.commodityHazmat}
                  onChange={(e) => setLoadInfo({...loadInfo, commodityHazmat: e.target.checked})}
                  style={{ width: '16px', height: '16px' }}
                />
                Hazardous Materials
              </label>
            </div>
            {loadInfo.commodityHazmat && (
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Hazmat Class</label>
                <input
                  type="text"
                  value={loadInfo.hazmatClass}
                  onChange={(e) => setLoadInfo({...loadInfo, hazmatClass: e.target.value})}
                  style={inputStyle}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rate Information Section */}
      <div style={sectionStyle}>
        <h3 style={{ margin: '0 0 20px 0', color: '#4ade80', fontSize: '18px' }}>Rate Information</h3>
        <div style={gridStyle}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Line Haul Rate</label>
            <input
              type="number"
              value={loadInfo.lineHaulRate}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setLoadInfo({...loadInfo, lineHaulRate: value});
                calculateTotalRate();
              }}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Fuel Surcharge</label>
            <input
              type="number"
              value={loadInfo.fuelSurcharge}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setLoadInfo({...loadInfo, fuelSurcharge: value});
                calculateTotalRate();
              }}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Accessorial Charges</label>
            <input
              type="number"
              value={loadInfo.accessorialCharges}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                setLoadInfo({...loadInfo, accessorialCharges: value});
                calculateTotalRate();
              }}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Total Rate</label>
            <input
              type="number"
              value={loadInfo.totalRate}
              onChange={(e) => setLoadInfo({...loadInfo, totalRate: parseFloat(e.target.value) || 0})}
              style={{...inputStyle, fontWeight: 'bold', color: '#4ade80'}}
            />
          </div>
        </div>
      </div>

      {/* Payment Terms Section */}
      <div style={sectionStyle}>
        <h3 style={{ margin: '0 0 20px 0', color: '#4ade80', fontSize: '18px' }}>Payment Terms</h3>
        <div style={gridStyle}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Payment Terms</label>
            <select
              value={loadInfo.paymentTerms}
              onChange={(e) => setLoadInfo({...loadInfo, paymentTerms: e.target.value})}
              style={inputStyle}
            >
              <option value="Net 30">Net 30</option>
              <option value="Net 15">Net 15</option>
              <option value="Net 7">Net 7</option>
              <option value="Quick Pay">Quick Pay</option>
              <option value="COD">COD</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Payment Method</label>
            <select
              value={loadInfo.paymentMethod}
              onChange={(e) => setLoadInfo({...loadInfo, paymentMethod: e.target.value})}
              style={inputStyle}
            >
              <option value="ACH">ACH</option>
              <option value="Check">Check</option>
              <option value="Wire">Wire</option>
              <option value="Factoring">Factoring</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Quick Pay Discount (%)</label>
            <input
              type="number"
              value={loadInfo.quickPayDiscount}
              onChange={(e) => setLoadInfo({...loadInfo, quickPayDiscount: parseFloat(e.target.value) || 0})}
              style={inputStyle}
            />
            </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={loadInfo.factoring}
                onChange={(e) => setLoadInfo({...loadInfo, factoring: e.target.checked})}
                style={{ width: '16px', height: '16px' }}
              />
              Factoring Company
            </label>
          </div>
        </div>
        {loadInfo.factoring && (
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Factoring Company Name</label>
            <input
              type="text"
              value={loadInfo.factoringCompany}
              onChange={(e) => setLoadInfo({...loadInfo, factoringCompany: e.target.value})}
              style={inputStyle}
            />
          </div>
        )}
        </div>

      {/* Special Instructions Section */}
      <div style={sectionStyle}>
        <h3 style={{ margin: '0 0 20px 0', color: '#4ade80', fontSize: '18px' }}>Special Instructions</h3>
        <div>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Special Instructions</label>
          <textarea
            value={loadInfo.specialInstructions}
            onChange={(e) => setLoadInfo({...loadInfo, specialInstructions: e.target.value})}
            style={{
              ...inputStyle,
              height: '100px',
              resize: 'vertical'
            }}
            placeholder="Enter any special instructions, handling requirements, or additional terms..."
          />
        </div>
      </div>

      {/* Generate Button */}
      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <button
          onClick={generateRateConfirmation}
          style={{
            background: 'linear-gradient(135deg, #4ade80, #22c55e)',
            color: 'white',
            padding: '16px 48px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(74, 222, 128, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          📄 Generate Rate Confirmation
        </button>
      </div>
    </div>
  );
}
