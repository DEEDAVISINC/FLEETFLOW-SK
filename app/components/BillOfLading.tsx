'use client';

import { jsPDF } from 'jspdf';
import { useEffect, useState } from 'react';
import { useLoad } from '../contexts/LoadContext';

interface BOLInfo {
  // Document Information
  bolNumber: string;
  proNumber: string;
  loadNumber: string;
  billDate: string;
  pageNumber: string;

  // Shipper Information
  shipperName: string;
  shipperAddress: string;
  shipperCity: string;
  shipperState: string;
  shipperZip: string;
  shipperPhone: string;
  shipperEmail: string;
  shipperContact: string;
  shipperFax: string;

  // Consignee Information
  consigneeName: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeState: string;
  consigneeZip: string;
  consigneePhone: string;
  consigneeEmail: string;
  consigneeContact: string;
  consigneeFax: string;

  // Third Party/Bill To Information
  billToName: string;
  billToAddress: string;
  billToCity: string;
  billToState: string;
  billToZip: string;
  billToPhone: string;

  // Carrier Information
  carrierName: string;
  carrierAddress: string;
  carrierCity: string;
  carrierState: string;
  carrierZip: string;
  carrierMC: string;
  carrierDOT: string;
  carrierPhone: string;
  carrierSCAC: string;

  // Driver Information
  driverName: string;
  driverLicense: string;
  driverPhone: string;
  driverSignature: string;

  // Equipment Information
  trailerNumber: string;
  truckNumber: string;
  sealNumbers: string;
  equipmentType: string;
  equipmentLength: string;
  equipmentOwner: string;

  // Shipment Information
  shipDate: string;
  deliveryDate: string;
  originTerminal: string;
  destinationTerminal: string;
  routeInstructions: string;

  // Freight Information
  freightChargeTerms: string;
  freightCharges: number;
  advanceCharges: number;
  codAmount: number;
  codCharges: number;

  // Commodity Information
  commodityDescription: string;
  commodityClass: string;
  commodityWeight: string;
  commodityPieces: string;
  commodityRate: number;
  commodityCharges: number;
  commodityValue: string;
  packageType: string;

  // Hazmat Information
  hazmat: boolean;
  hazmatClass: string;
  hazmatID: string;
  hazmatPackingGroup: string;
  hazmatProperName: string;
  hazmatContactName: string;
  hazmatContactPhone: string;

  // Special Services
  appointmentDelivery: boolean;
  insideDelivery: boolean;
  liftgateService: boolean;
  residentialDelivery: boolean;
  sortAndSegregate: boolean;

  // Terms and Conditions
  carrierInstructions: string;
  specialInstructions: string;

  // Signatures
  shipperSignature: string;
  shipperDate: string;
  driverPickupSignature: string;
  driverPickupDate: string;
  consigneeSignature: string;
  consigneeDate: string;
  driverDeliverySignature: string;
  driverDeliveryDate: string;

  // Legal
  prepaid: boolean;
  collect: boolean;
  thirdParty: boolean;
  masterBill: boolean;

  // Insurance
  declaredValue: string;
  cargoInsurance: boolean;
  insuranceAmount: string;
}

export default function BillOfLading() {
  const { selectedLoad } = useLoad();

  const [bolInfo, setBolInfo] = useState<BOLInfo>({
    // Document Information
    bolNumber: '',
    proNumber: '',
    loadNumber: '',
    billDate: new Date().toISOString().split('T')[0],
    pageNumber: '1 of 1',

    // Shipper Information
    shipperName: '',
    shipperAddress: '',
    shipperCity: '',
    shipperState: '',
    shipperZip: '',
    shipperPhone: '',
    shipperEmail: '',
    shipperContact: '',
    shipperFax: '',

    // Consignee Information
    consigneeName: '',
    consigneeAddress: '',
    consigneeCity: '',
    consigneeState: '',
    consigneeZip: '',
    consigneePhone: '',
    consigneeEmail: '',
    consigneeContact: '',
    consigneeFax: '',

    // Third Party/Bill To Information
    billToName: '',
    billToAddress: '',
    billToCity: '',
    billToState: '',
    billToZip: '',
    billToPhone: '',

    // Carrier Information
    carrierName: '',
    carrierAddress: '',
    carrierCity: '',
    carrierState: '',
    carrierZip: '',
    carrierMC: '',
    carrierDOT: '',
    carrierPhone: '',
    carrierSCAC: '',

    // Driver Information
    driverName: '',
    driverLicense: '',
    driverPhone: '',
    driverSignature: '',

    // Equipment Information
    trailerNumber: '',
    truckNumber: '',
    sealNumbers: '',
    equipmentType: 'Dry Van',
    equipmentLength: '53',
    equipmentOwner: 'Carrier',

    // Shipment Information
    shipDate: '',
    deliveryDate: '',
    originTerminal: '',
    destinationTerminal: '',
    routeInstructions: '',

    // Freight Information
    freightChargeTerms: 'Prepaid',
    freightCharges: 0,
    advanceCharges: 0,
    codAmount: 0,
    codCharges: 0,

    // Commodity Information
    commodityDescription: '',
    commodityClass: '',
    commodityWeight: '',
    commodityPieces: '',
    commodityRate: 0,
    commodityCharges: 0,
    commodityValue: '',
    packageType: 'Pallets',

    // Hazmat Information
    hazmat: false,
    hazmatClass: '',
    hazmatID: '',
    hazmatPackingGroup: '',
    hazmatProperName: '',
    hazmatContactName: '',
    hazmatContactPhone: '',

    // Special Services
    appointmentDelivery: false,
    insideDelivery: false,
    liftgateService: false,
    residentialDelivery: false,
    sortAndSegregate: false,

    // Terms and Conditions
    carrierInstructions: '',
    specialInstructions: '',

    // Signatures
    shipperSignature: '',
    shipperDate: '',
    driverPickupSignature: '',
    driverPickupDate: '',
    consigneeSignature: '',
    consigneeDate: '',
    driverDeliverySignature: '',
    driverDeliveryDate: '',

    // Legal
    prepaid: true,
    collect: false,
    thirdParty: false,
    masterBill: false,

    // Insurance
    declaredValue: '',
    cargoInsurance: false,
    insuranceAmount: '',
  });

  useEffect(() => {
    if (selectedLoad) {
      setBolInfo((prev) => ({
        ...prev,
        bolNumber: `BOL-${selectedLoad.id}-${new Date().getFullYear()}`,
        proNumber: `PRO-${selectedLoad.id}`,
        loadNumber: selectedLoad.id,
        shipperName: selectedLoad.origin?.split(',')[0] || '',
        shipperCity: selectedLoad.origin?.split(',')[1]?.trim() || '',
        shipperState: selectedLoad.origin?.split(',')[2]?.trim() || '',
        consigneeName: selectedLoad.destination?.split(',')[0] || '',
        consigneeCity: selectedLoad.destination?.split(',')[1]?.trim() || '',
        consigneeState: selectedLoad.destination?.split(',')[2]?.trim() || '',
        carrierName: selectedLoad.carrierName || '',
        driverName: selectedLoad.driverName || '',
        shipDate: selectedLoad.pickupDate || '',
        deliveryDate: selectedLoad.deliveryDate || '',
        commodityWeight: selectedLoad.weight || '',
        commodityDescription: selectedLoad.equipment || 'General Freight',
        equipmentType: selectedLoad.equipment || 'Dry Van',
      }));
    }
  }, [selectedLoad]);

  const generateBillOfLading = () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
    });

    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    let yPosition = 10;

    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('UNIFORM STRAIGHT BILL OF LADING', pageWidth / 2, yPosition, {
      align: 'center',
    });
    yPosition += 8;

    // Document Info Header
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`BOL Number: ${bolInfo.bolNumber}`, 10, yPosition);
    pdf.text(`PRO Number: ${bolInfo.proNumber}`, 70, yPosition);
    pdf.text(`Date: ${bolInfo.billDate}`, 130, yPosition);
    pdf.text(`Page: ${bolInfo.pageNumber}`, 170, yPosition);
    yPosition += 8;

    // Shipper Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SHIPPER (Origin)', 10, yPosition);
    yPosition += 5;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(bolInfo.shipperName, 10, yPosition);
    yPosition += 4;
    pdf.text(bolInfo.shipperAddress, 10, yPosition);
    yPosition += 4;
    pdf.text(
      `${bolInfo.shipperCity}, ${bolInfo.shipperState} ${bolInfo.shipperZip}`,
      10,
      yPosition
    );
    yPosition += 4;
    pdf.text(`Phone: ${bolInfo.shipperPhone}`, 10, yPosition);
    yPosition += 4;
    pdf.text(`Contact: ${bolInfo.shipperContact}`, 10, yPosition);
    yPosition += 8;

    // Consignee Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CONSIGNEE (Destination)', 110, yPosition - 25);
    yPosition -= 20;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(bolInfo.consigneeName, 110, yPosition);
    yPosition += 4;
    pdf.text(bolInfo.consigneeAddress, 110, yPosition);
    yPosition += 4;
    pdf.text(
      `${bolInfo.consigneeCity}, ${bolInfo.consigneeState} ${bolInfo.consigneeZip}`,
      110,
      yPosition
    );
    yPosition += 4;
    pdf.text(`Phone: ${bolInfo.consigneePhone}`, 110, yPosition);
    yPosition += 4;
    pdf.text(`Contact: ${bolInfo.consigneeContact}`, 110, yPosition);
    yPosition += 8;

    // Third Party Bill To (if applicable)
    if (bolInfo.thirdParty) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('BILL TO (Third Party)', 10, yPosition);
      yPosition += 5;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(bolInfo.billToName, 10, yPosition);
      yPosition += 4;
      pdf.text(bolInfo.billToAddress, 10, yPosition);
      yPosition += 4;
      pdf.text(
        `${bolInfo.billToCity}, ${bolInfo.billToState} ${bolInfo.billToZip}`,
        10,
        yPosition
      );
      yPosition += 4;
      pdf.text(`Phone: ${bolInfo.billToPhone}`, 10, yPosition);
      yPosition += 8;
    }

    // Carrier Information
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CARRIER INFORMATION', 10, yPosition);
    yPosition += 5;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Carrier: ${bolInfo.carrierName}`, 10, yPosition);
    yPosition += 4;
    pdf.text(`Address: ${bolInfo.carrierAddress}`, 10, yPosition);
    yPosition += 4;
    pdf.text(
      `${bolInfo.carrierCity}, ${bolInfo.carrierState} ${bolInfo.carrierZip}`,
      10,
      yPosition
    );
    yPosition += 4;
    pdf.text(
      `MC: ${bolInfo.carrierMC} | DOT: ${bolInfo.carrierDOT} | SCAC: ${bolInfo.carrierSCAC}`,
      10,
      yPosition
    );
    yPosition += 8;

    // Equipment Information
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EQUIPMENT INFORMATION', 10, yPosition);
    yPosition += 5;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `Driver: ${bolInfo.driverName} | License: ${bolInfo.driverLicense}`,
      10,
      yPosition
    );
    yPosition += 4;
    pdf.text(
      `Truck: ${bolInfo.truckNumber} | Trailer: ${bolInfo.trailerNumber}`,
      10,
      yPosition
    );
    yPosition += 4;
    pdf.text(
      `Equipment: ${bolInfo.equipmentType} ${bolInfo.equipmentLength}' | Seals: ${bolInfo.sealNumbers}`,
      10,
      yPosition
    );
    yPosition += 8;

    // Commodity Description Table Header
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('COMMODITY DESCRIPTION', 10, yPosition);
    yPosition += 5;

    // Table headers
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Package Type', 10, yPosition);
    pdf.text('Pieces', 35, yPosition);
    pdf.text('Weight', 55, yPosition);
    pdf.text('Class', 75, yPosition);
    pdf.text('Description', 90, yPosition);
    pdf.text('Value', 150, yPosition);
    pdf.text('Rate', 170, yPosition);
    pdf.text('Charges', 185, yPosition);
    yPosition += 5;

    // Commodity data row
    pdf.setFont('helvetica', 'normal');
    pdf.text(bolInfo.packageType, 10, yPosition);
    pdf.text(bolInfo.commodityPieces, 35, yPosition);
    pdf.text(bolInfo.commodityWeight, 55, yPosition);
    pdf.text(bolInfo.commodityClass, 75, yPosition);
    pdf.text(bolInfo.commodityDescription, 90, yPosition);
    pdf.text(bolInfo.commodityValue, 150, yPosition);
    pdf.text(bolInfo.commodityRate.toString(), 170, yPosition);
    pdf.text(bolInfo.commodityCharges.toString(), 185, yPosition);
    yPosition += 8;

    // Hazmat Information (if applicable)
    if (bolInfo.hazmat) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('⚠️ HAZARDOUS MATERIALS', 10, yPosition);
      yPosition += 5;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `Class: ${bolInfo.hazmatClass} | ID: ${bolInfo.hazmatID}`,
        10,
        yPosition
      );
      yPosition += 4;
      pdf.text(`Proper Name: ${bolInfo.hazmatProperName}`, 10, yPosition);
      yPosition += 4;
      pdf.text(`Packing Group: ${bolInfo.hazmatPackingGroup}`, 10, yPosition);
      yPosition += 4;
      pdf.text(
        `Emergency Contact: ${bolInfo.hazmatContactName} - ${bolInfo.hazmatContactPhone}`,
        10,
        yPosition
      );
      yPosition += 8;
    }

    // Special Services
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SPECIAL SERVICES', 10, yPosition);
    yPosition += 5;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    const services = [];
    if (bolInfo.appointmentDelivery) services.push('Appointment Delivery');
    if (bolInfo.insideDelivery) services.push('Inside Delivery');
    if (bolInfo.liftgateService) services.push('Liftgate Service');
    if (bolInfo.residentialDelivery) services.push('Residential Delivery');
    if (bolInfo.sortAndSegregate) services.push('Sort & Segregate');

    if (services.length > 0) {
      pdf.text(services.join(', '), 10, yPosition);
      yPosition += 4;
    } else {
      pdf.text('None', 10, yPosition);
      yPosition += 4;
    }
    yPosition += 4;

    // Freight Charges
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('FREIGHT CHARGES', 10, yPosition);
    yPosition += 5;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Terms: ${bolInfo.freightChargeTerms}`, 10, yPosition);
    yPosition += 4;
    pdf.text(
      `Freight Charges: $${bolInfo.freightCharges.toFixed(2)}`,
      10,
      yPosition
    );
    yPosition += 4;
    if (bolInfo.advanceCharges > 0) {
      pdf.text(
        `Advance Charges: $${bolInfo.advanceCharges.toFixed(2)}`,
        10,
        yPosition
      );
      yPosition += 4;
    }
    if (bolInfo.codAmount > 0) {
      pdf.text(`COD Amount: $${bolInfo.codAmount.toFixed(2)}`, 10, yPosition);
      yPosition += 4;
    }
    yPosition += 4;

    // Special Instructions
    if (bolInfo.specialInstructions) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SPECIAL INSTRUCTIONS', 10, yPosition);
      yPosition += 5;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const instructions = pdf.splitTextToSize(
        bolInfo.specialInstructions,
        180
      );
      pdf.text(instructions, 10, yPosition);
      yPosition += instructions.length * 4 + 4;
    }

    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }

    // Legal Terms
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TERMS AND CONDITIONS', 10, yPosition);
    yPosition += 5;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');

    const legalTerms = [
      'This contract is subject to the terms and conditions of the National Motor Freight Classification and applicable tariffs.',
      'The carrier shall not be liable for any loss or damage exceeding the declared value shown herein.',
      'Claims must be filed within 9 months of delivery date or reasonable delivery date.',
      'The shipper certifies that the above-named materials are properly classified, described, packaged, marked, and labeled.',
      'If this shipment is to be delivered to the consignee without recourse on the consignor, the consignor shall sign the following statement: The carrier shall not make delivery of this shipment without payment of freight and all other lawful charges.',
      'Subject to Section 7 of conditions, if this shipment is to be delivered to the consignee without recourse on the consignor, the consignor shall sign the following statement: The carrier may deliver this shipment without obtaining payment of freight and all other lawful charges from the consignee.',
      'Carrier acknowledges receipt of packages and contents unknown.',
    ];

    legalTerms.forEach((term) => {
      const splitText = pdf.splitTextToSize(term, 190);
      pdf.text(splitText, 10, yPosition);
      yPosition += splitText.length * 3.5;
    });

    yPosition += 8;

    // Signature Section
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SIGNATURES', 10, yPosition);
    yPosition += 8;

    // Shipper Signature
    pdf.setFont('helvetica', 'normal');
    pdf.text('Shipper/Agent Signature:', 10, yPosition);
    pdf.text('Date:', 10, yPosition + 10);
    pdf.text('_________________________', 60, yPosition);
    pdf.text('____________', 60, yPosition + 10);

    // Driver Pickup Signature
    pdf.text('Driver Signature (Pickup):', 120, yPosition);
    pdf.text('Date:', 120, yPosition + 10);
    pdf.text('_________________________', 170, yPosition);
    pdf.text('____________', 170, yPosition + 10);

    yPosition += 25;

    // Consignee Signature
    pdf.text('Consignee Signature:', 10, yPosition);
    pdf.text('Date:', 10, yPosition + 10);
    pdf.text('_________________________', 60, yPosition);
    pdf.text('____________', 60, yPosition + 10);

    // Driver Delivery Signature
    pdf.text('Driver Signature (Delivery):', 120, yPosition);
    pdf.text('Date:', 120, yPosition + 10);
    pdf.text('_________________________', 170, yPosition);
    pdf.text('____________', 170, yPosition + 10);

    // Footer
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      'This document was generated electronically by FleetFlow Logistics System',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );

    // Save the PDF
    pdf.save(
      `Bill_of_Lading_${bolInfo.bolNumber}_${new Date().toISOString().split('T')[0]}.pdf`
    );
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    fontFamily: 'inherit',
  };

  const sectionStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '16px',
  };

  return (
    <div>
      <h1>Bill of Lading</h1>
    </div>
  );
}
