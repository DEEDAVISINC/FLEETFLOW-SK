'use client';

import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { calculateDispatchFee, getDefaultFeePercentage } from '../config/dispatch';
import DispatchInvoice from './DispatchInvoice';
import { Load } from '../services/loadService';
import { createInvoice, InvoiceData as InvoiceServiceData } from '../services/invoiceService';

interface InvoiceCreationModalProps {
  load: Load;
  onClose: () => void;
  onInvoiceCreated: (invoiceId: string) => void;
}

interface InvoiceData {
  id: string;
  loadId: string;
  carrierName: string;
  carrierAddress?: string;
  carrierEmail?: string;
  carrierPhone?: string;
  loadAmount: number;
  dispatchFee: number;
  feePercentage: number;
  invoiceDate: string;
  dueDate: string;
  status: 'Pending' | 'Sent' | 'Paid' | 'Overdue';
  loadDetails?: {
    origin: string;
    destination: string;
    pickupDate: string;
    deliveryDate: string;
    equipment: string;
    weight?: string;
    miles?: number;
  };
  paymentTerms?: string;
  notes?: string;
}

export default function InvoiceCreationModal({ load, onClose, onInvoiceCreated }: InvoiceCreationModalProps) {
  const [carrierInfo, setCarrierInfo] = useState({
    name: load.dispatcherName || 'Carrier Name',
    address: '',
    email: '',
    phone: ''
  });
  
  const [feePercentage, setFeePercentage] = useState(getDefaultFeePercentage());
  const [customRate, setCustomRate] = useState(load.rate);
  const [loadType, setLoadType] = useState<'standard' | 'expedited' | 'hazmat' | 'oversize' | 'team'>('standard');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [notes, setNotes] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const invoiceRef = useRef<HTMLDivElement>(null);

  const generateInvoiceData = (): InvoiceData => {
    const invoiceId = `INV-${Date.now()}-${load.id}`;
    const invoiceDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 30 days from now
    
    const feeCalculation = calculateDispatchFee(customRate, loadType, feePercentage);
    
    return {
      id: invoiceId,
      loadId: load.id,
      carrierName: carrierInfo.name,
      carrierAddress: carrierInfo.address,
      carrierEmail: carrierInfo.email,
      carrierPhone: carrierInfo.phone,
      loadAmount: customRate,
      dispatchFee: feeCalculation.dispatchFee,
      feePercentage: feeCalculation.feePercentage,
      invoiceDate,
      dueDate,
      status: 'Pending',
      loadDetails: {
        origin: load.origin,
        destination: load.destination,
        pickupDate: load.pickupDate,
        deliveryDate: load.deliveryDate,
        equipment: load.equipment,
        weight: load.weight,
        miles: load.distance ? parseInt(load.distance.replace(/[^\d]/g, '')) : undefined
      },
      paymentTerms,
      notes
    };
  };

  const handleCreateInvoice = async () => {
    setIsCreating(true);
    
    try {
      const invoiceData = generateInvoiceData();
      
      // Create the invoice using the service
      const createdInvoice = createInvoice({
        id: invoiceData.id,
        loadId: invoiceData.loadId,
        carrierName: invoiceData.carrierName,
        carrierAddress: invoiceData.carrierAddress,
        carrierEmail: invoiceData.carrierEmail,
        carrierPhone: invoiceData.carrierPhone,
        loadAmount: invoiceData.loadAmount,
        dispatchFee: invoiceData.dispatchFee,
        feePercentage: invoiceData.feePercentage,
        invoiceDate: invoiceData.invoiceDate,
        dueDate: invoiceData.dueDate,
        status: invoiceData.status,
        loadDetails: invoiceData.loadDetails,
        paymentTerms: invoiceData.paymentTerms,
        notes: invoiceData.notes
      });
      
      onInvoiceCreated(createdInvoice.id);
      onClose();
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDownloadPDF = () => {
    const invoiceData = generateInvoiceData();
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Header
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('🚛 DISPATCH INVOICE', pageWidth / 2, 30, { align: 'center' });
    
    // Invoice details
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Invoice #: ${invoiceData.id}`, 20, 50);
    pdf.text(`Date: ${invoiceData.invoiceDate}`, 20, 60);
    pdf.text(`Due Date: ${invoiceData.dueDate}`, 20, 70);
    
    // Carrier info
    pdf.text('Bill To:', 20, 90);
    pdf.text(invoiceData.carrierName, 20, 100);
    if (invoiceData.carrierAddress) {
      const addressLines = invoiceData.carrierAddress.split('\n');
      addressLines.forEach((line, index) => {
        pdf.text(line, 20, 110 + (index * 10));
      });
    }
    
    // Load details
    pdf.text('Load Details:', 20, 150);
    pdf.text(`Load ID: ${invoiceData.loadId}`, 20, 160);
    pdf.text(`Route: ${invoiceData.loadDetails?.origin} → ${invoiceData.loadDetails?.destination}`, 20, 170);
    pdf.text(`Equipment: ${invoiceData.loadDetails?.equipment}`, 20, 180);
    
    // Financial summary
    pdf.text('Service Summary:', 20, 210);
    pdf.text(`Load Amount: $${invoiceData.loadAmount.toLocaleString()}`, 20, 220);
    pdf.text(`Dispatch Fee (${invoiceData.feePercentage}%): $${invoiceData.dispatchFee.toLocaleString()}`, 20, 230);
    
    pdf.save(`${invoiceData.id}.pdf`);
  };

  const previewInvoiceData = generateInvoiceData();

  if (showPreview) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: 'white',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '90%',
          borderRadius: '12px',
          overflow: 'auto',
          position: 'relative'
        }}>
          <div style={{
            position: 'sticky',
            top: 0,
            background: 'white',
            borderBottom: '1px solid #e5e7eb',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Invoice Preview</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleDownloadPDF}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                📄 Download PDF
              </button>
              <button
                onClick={() => setShowPreview(false)}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Back to Edit
              </button>
            </div>
          </div>
          
          <div style={{ padding: '16px' }}>
            <DispatchInvoice ref={invoiceRef} invoice={previewInvoiceData} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90%',
        borderRadius: '12px',
        overflow: 'auto'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
            🧾 Create Invoice for Load {load.id}
          </h2>
          <p style={{ margin: '8px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            {load.origin} → {load.destination} | Status: {load.status}
          </p>
        </div>

        <div style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Carrier Information */}
            <div>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                Carrier Information
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Carrier Name *
                  </label>
                  <input
                    type="text"
                    value={carrierInfo.name}
                    onChange={(e) => setCarrierInfo(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    placeholder="Enter carrier name"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Address
                  </label>
                  <textarea
                    value={carrierInfo.address}
                    onChange={(e) => setCarrierInfo(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                    placeholder="Enter carrier address"
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={carrierInfo.email}
                      onChange={(e) => setCarrierInfo(prev => ({ ...prev, email: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      placeholder="carrier@example.com"
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={carrierInfo.phone}
                      onChange={(e) => setCarrierInfo(prev => ({ ...prev, phone: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                Financial Details
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Load Type
                  </label>
                  <select
                    value={loadType}
                    onChange={(e) => setLoadType(e.target.value as 'standard' | 'expedited' | 'hazmat' | 'oversize' | 'team')}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="standard">Standard Load</option>
                    <option value="expedited">Expedited/Hot Load</option>
                    <option value="hazmat">Hazmat Load</option>
                    <option value="oversize">Oversize/Overweight</option>
                    <option value="team">Team Driver Load</option>
                  </select>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Load Amount
                    </label>
                    <input
                      type="number"
                      value={customRate}
                      onChange={(e) => setCustomRate(parseFloat(e.target.value) || 0)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Dispatch Fee %
                    </label>
                    <input
                      type="number"
                      value={feePercentage}
                      onChange={(e) => setFeePercentage(parseFloat(e.target.value) || 0)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>
                
                <div style={{
                  background: '#f9fafb',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontSize: '14px', color: '#374151' }}>
                    <strong>Dispatch Fee: ${calculateDispatchFee(customRate, loadType, feePercentage).dispatchFee.toLocaleString()}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    {calculateDispatchFee(customRate, loadType, feePercentage).feePercentage}% of ${customRate.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                Additional Details
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Payment Terms
                  </label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Net 15">Net 15 Days</option>
                    <option value="Net 30">Net 30 Days</option>
                    <option value="Net 45">Net 45 Days</option>
                    <option value="Due on Receipt">Due on Receipt</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                    placeholder="Additional notes or special instructions..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setShowPreview(true)}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            👁️ Preview Invoice
          </button>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            
            <button
              onClick={handleCreateInvoice}
              disabled={isCreating || !carrierInfo.name.trim()}
              style={{
                background: isCreating || !carrierInfo.name.trim() ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: isCreating || !carrierInfo.name.trim() ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {isCreating ? '⏳ Creating...' : '✅ Create Invoice'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
