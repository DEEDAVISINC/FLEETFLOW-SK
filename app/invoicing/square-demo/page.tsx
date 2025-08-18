'use client';

import { useState } from 'react';

interface InvoiceLineItem {
  name: string;
  quantity: number;
  rate: number;
  amount: number;
}

export default function SquareInvoicingDemo() {
  const [customerId, setCustomerId] = useState('');
  const [invoiceTitle, setInvoiceTitle] = useState(
    'FleetFlow Transportation Services'
  );
  const [description, setDescription] = useState(
    'Load delivery and transportation services'
  );
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    {
      name: 'Transportation Services',
      quantity: 1,
      rate: 1250.0,
      amount: 1250.0,
    },
  ]);
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createdInvoice, setCreatedInvoice] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const createCustomerFirst = async () => {
    try {
      const response = await fetch('/api/payments/square', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-customer',
          customer: {
            givenName: 'John',
            familyName: 'Doe',
            companyName: 'ABC Logistics',
            emailAddress: 'john.doe@abclogistics.com',
            phoneNumber: '+15551234567',
            address: {
              addressLine1: '123 Main Street',
              locality: 'Atlanta',
              administrativeDistrictLevel1: 'GA',
              postalCode: '30309',
              country: 'US',
            },
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCustomerId(data.customerId);
        return data.customerId;
      } else {
        setError(data.error || 'Failed to create customer');
        return null;
      }
    } catch (error) {
      setError('Error creating customer');
      console.error(error);
      return null;
    }
  };

  const createInvoice = async () => {
    if (!customerId) {
      const newCustomerId = await createCustomerFirst();
      if (!newCustomerId) return;
      setCustomerId(newCustomerId);
    }

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/square', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-fleetflow-invoice',
          customerId,
          invoiceTitle,
          description,
          lineItems,
          dueDate,
          customFields: [
            { label: 'Load ID', value: 'FL-2025-001' },
            { label: 'Route', value: 'Atlanta, GA → Miami, FL' },
            { label: 'Driver', value: 'John Smith' },
          ],
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCreatedInvoice(data);
        // Now publish the invoice to send it
        await publishInvoice(data.invoiceId, data.invoice?.version || 1);
      } else {
        setError(data.error || 'Failed to create invoice');
      }
    } catch (error) {
      setError('Error creating invoice');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const publishInvoice = async (invoiceId: string, version: number) => {
    try {
      const response = await fetch('/api/payments/square', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish-invoice',
          invoiceId,
          version,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCreatedInvoice((prev) => ({
          ...prev,
          ...data,
          status: data.status,
          publicUrl: data.publicUrl,
        }));
      } else {
        setError(data.error || 'Failed to publish invoice');
      }
    } catch (error) {
      setError('Error publishing invoice');
      console.error(error);
    }
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { name: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const updateLineItem = (
    index: number,
    field: keyof InvoiceLineItem,
    value: string | number
  ) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };

    // Calculate amount if quantity or rate changed
    if (field === 'quantity' || field === 'rate') {
      updated[index].amount = updated[index].quantity * updated[index].rate;
    }

    setLineItems(updated);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            textAlign: 'center',
            color: 'white',
          }}
        >
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              background: 'linear-gradient(45deg, #10b981, #059669)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Square Invoicing Demo
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, margin: 0 }}>
            Create and send professional invoices with Square
          </p>
        </div>

        {/* Invoice Creation Form */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
          }}
        >
          <h2 style={{ marginTop: 0, color: '#1f2937' }}>Create Invoice</h2>

          {error && (
            <div
              style={{
                background: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
                color: '#dc2626',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
              }}
            >
              Customer ID (leave empty to create demo customer)
            </label>
            <input
              type='text'
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder='Will create demo customer if empty'
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
              }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '24px',
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
                Invoice Title
              </label>
              <input
                type='text'
                value={invoiceTitle}
                onChange={(e) => setInvoiceTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                }}
              >
                Due Date
              </label>
              <input
                type='date'
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '600',
              }}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Line Items */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3 style={{ margin: 0, color: '#1f2937' }}>Line Items</h3>
              <button
                onClick={addLineItem}
                style={{
                  padding: '8px 16px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                + Add Item
              </button>
            </div>

            {lineItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                  gap: '12px',
                  alignItems: 'center',
                  marginBottom: '12px',
                  padding: '12px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                }}
              >
                <input
                  type='text'
                  placeholder='Service name'
                  value={item.name}
                  onChange={(e) =>
                    updateLineItem(index, 'name', e.target.value)
                  }
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                  }}
                />
                <input
                  type='number'
                  placeholder='Qty'
                  value={item.quantity}
                  onChange={(e) =>
                    updateLineItem(
                      index,
                      'quantity',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                  }}
                />
                <input
                  type='number'
                  placeholder='Rate'
                  value={item.rate}
                  onChange={(e) =>
                    updateLineItem(
                      index,
                      'rate',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                  }}
                />
                <div
                  style={{
                    padding: '8px',
                    fontWeight: '600',
                    color: '#1f2937',
                  }}
                >
                  ${item.amount.toFixed(2)}
                </div>
                {lineItems.length > 1 && (
                  <button
                    onClick={() => removeLineItem(index)}
                    style={{
                      padding: '8px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            <div
              style={{
                textAlign: 'right',
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
              }}
            >
              Total: ${totalAmount.toFixed(2)}
            </div>
          </div>

          <button
            onClick={createInvoice}
            disabled={isCreating || lineItems.length === 0 || !invoiceTitle}
            style={{
              width: '100%',
              padding: '16px',
              background: isCreating ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isCreating ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            {isCreating
              ? 'Creating & Sending Invoice...'
              : 'Create & Send Invoice'}
          </button>
        </div>

        {/* Created Invoice Display */}
        {createdInvoice && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '32px',
            }}
          >
            <h2
              style={{
                marginTop: 0,
                color: '#1f2937',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ color: '#10b981', fontSize: '24px' }}>✓</span>
              Invoice Created Successfully!
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '24px',
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: '600',
                    color: '#6b7280',
                    marginBottom: '4px',
                  }}
                >
                  Invoice ID
                </div>
                <div style={{ color: '#1f2937', fontFamily: 'monospace' }}>
                  {createdInvoice.invoiceId}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontWeight: '600',
                    color: '#6b7280',
                    marginBottom: '4px',
                  }}
                >
                  Status
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background:
                      createdInvoice.status === 'UNPAID'
                        ? '#fef3c7'
                        : '#dbeafe',
                    color:
                      createdInvoice.status === 'UNPAID'
                        ? '#d97706'
                        : '#2563eb',
                  }}
                >
                  {createdInvoice.status}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontWeight: '600',
                    color: '#6b7280',
                    marginBottom: '4px',
                  }}
                >
                  Amount
                </div>
                <div
                  style={{
                    color: '#1f2937',
                    fontSize: '18px',
                    fontWeight: '600',
                  }}
                >
                  ${totalAmount.toFixed(2)}
                </div>
              </div>
            </div>

            {createdInvoice.publicUrl && (
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    fontWeight: '600',
                    color: '#6b7280',
                    marginBottom: '8px',
                  }}
                >
                  Customer Payment Link
                </div>
                <div
                  style={{
                    padding: '12px',
                    background: '#f3f4f6',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    wordBreak: 'break-all',
                  }}
                >
                  {createdInvoice.publicUrl}
                </div>
                <a
                  href={createdInvoice.publicUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{
                    display: 'inline-block',
                    marginTop: '8px',
                    padding: '8px 16px',
                    background: '#10b981',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                  }}
                >
                  View Invoice →
                </a>
              </div>
            )}

            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              📧 The invoice has been automatically sent to the customer's email
              address.
              <br />
              💳 Customer can pay online using credit card, bank account, or
              Cash App Pay.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}































































