'use client';

import { forwardRef } from 'react';

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
  loadIdentifier?: string;
  shipperId?: string;
  dispatcherName?: string;
  dispatcherUserIdentifier?: string;
  dispatcherCompanyInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
  };
}

interface DispatchInvoiceProps {
  invoice: InvoiceData;
  companyInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    logo?: string;
  };
}

const DispatchInvoice = forwardRef<HTMLDivElement, DispatchInvoiceProps>(
  ({ invoice, companyInfo }, ref) => {
    const defaultCompanyInfo = {
      name: 'FLEETFLOW TMS LLC',
      address: '755 W. Big Beaver Rd STE 2020\nTroy, MI 48084',
      phone: '(833) 386-3509',
      email: 'billing@fleetflowapp.com',
      website: 'fleetflowapp.com',
      logo: '🚛',
    };

    // Use dispatcher company info if available, otherwise use companyInfo prop, then default
    const company = invoice.dispatcherCompanyInfo
      ? { ...invoice.dispatcherCompanyInfo, logo: '🚛' }
      : companyInfo || defaultCompanyInfo;

    return (
      <div>
        <h1>Dispatch Invoice</h1>
      </div>
    );
  }
);

DispatchInvoice.displayName = 'DispatchInvoice';

export default DispatchInvoice;
