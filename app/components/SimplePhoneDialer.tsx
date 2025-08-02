'use client';

import { useState } from 'react';

interface Contact {
  id: string;
  name: string;
  phone: string;
  company?: string;
  type: 'customer' | 'carrier' | 'driver' | 'broker';
}

export default function SimplePhoneDialer() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState(
    'Hello from FleetFlow! A representative will be with you shortly.'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [lastCall, setLastCall] = useState<any>(null);
  const [showContacts, setShowContacts] = useState(false);

  // Sample contacts (integrate with your CRM)
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'John Smith',
      phone: '+15551234567',
      company: 'ABC Trucking',
      type: 'carrier',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      phone: '+15559876543',
      company: 'XYZ Logistics',
      type: 'customer',
    },
    {
      id: '3',
      name: 'Mike Davis',
      phone: '+15555555555',
      company: 'Fleet Driver',
      type: 'driver',
    },
    {
      id: '4',
      name: 'Lisa Chen',
      phone: '+15551111111',
      company: 'Broker Pro',
      type: 'broker',
    },
  ];

  const makeCall = async () => {
    if (!phoneNumber) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/twilio-calls/make-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phoneNumber,
          message: message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setLastCall(result);
        alert(
          `✅ Call initiated to ${phoneNumber}\nCall SID: ${result.callSid}`
        );
      } else {
        alert(`❌ Call failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Call error:', error);
      alert('❌ Failed to make call');
    } finally {
      setIsLoading(false);
    }
  };

  const dialpadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#'],
  ];

  return (
    <div
      style={{
        color: '#ffffff',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '600',
            margin: '0 0 8px 0',
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          📞 Professional Dialer
        </h2>
        <div
          style={{
            background: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '11px',
            color: '#22c55e',
            fontWeight: '600',
            display: 'inline-block',
          }}
        >
          🟢 Ready
        </div>
      </div>

      {/* Phone Number Input */}
      <div style={{ marginBottom: '14px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '6px',
          }}
        >
          📞 Phone Number
        </label>
        <input
          type='tel'
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder='Enter phone number'
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            fontSize: '14px',
            textAlign: 'center',
            fontFamily: 'monospace',
            fontWeight: '500',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.5)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        />
      </div>

      {/* Message Input */}
      <div style={{ marginBottom: '14px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '6px',
          }}
        >
          💬 Voice Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Enter message to play...'
          rows={2}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            fontSize: '12px',
            resize: 'none',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = '1px solid rgba(59, 130, 246, 0.5)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
        />
      </div>

      {/* Dialpad */}
      <div style={{ marginBottom: '14px' }}>
        {dialpadNumbers.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}
          >
            {row.map((number) => (
              <button
                key={number}
                onClick={() => setPhoneNumber((prev) => prev + number)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {number}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Call Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '14px',
        }}
      >
        <button
          onClick={makeCall}
          disabled={!phoneNumber || isLoading}
          style={{
            background: isLoading
              ? 'rgba(107, 114, 128, 0.5)'
              : 'linear-gradient(135deg, #22c55e, #16a34a)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            width: '90px',
            height: '40px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: phoneNumber && !isLoading ? 'pointer' : 'not-allowed',
            opacity: phoneNumber && !isLoading ? 1 : 0.5,
            boxShadow:
              phoneNumber && !isLoading
                ? '0 4px 12px rgba(34, 197, 94, 0.3)'
                : 'none',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            if (phoneNumber && !isLoading) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow =
                '0 6px 16px rgba(34, 197, 94, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (phoneNumber && !isLoading) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 4px 12px rgba(34, 197, 94, 0.3)';
            }
          }}
        >
          {isLoading ? (
            <>
              ⏳ <span>Calling...</span>
            </>
          ) : (
            <>
              📞 <span>Call</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        <button
          onClick={() => setShowContacts(!showContacts)}
          style={{
            flex: 1,
            background: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '6px',
            padding: '6px',
            color: '#60a5fa',
            fontSize: '10px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          📋 Contacts
        </button>

        <button
          onClick={() => setPhoneNumber('')}
          style={{
            flex: 1,
            background: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '6px',
            padding: '6px',
            color: '#fbbf24',
            fontSize: '10px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          🗑️ Clear
        </button>
      </div>

      {/* Contacts List */}
      {showContacts && (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '14px',
            maxHeight: '120px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: '600',
              marginBottom: '8px',
            }}
          >
            Quick Contacts
          </div>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => {
                setPhoneNumber(contact.phone);
                setShowContacts(false);
              }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '4px',
                background: 'rgba(255, 255, 255, 0.05)',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              <div>
                <div style={{ fontSize: '10px', fontWeight: '600' }}>
                  {contact.name}
                </div>
                <div style={{ fontSize: '9px', color: '#9ca3af' }}>
                  {contact.company} • {contact.type}
                </div>
              </div>
              <div
                style={{
                  fontSize: '9px',
                  color: '#60a5fa',
                  fontFamily: 'monospace',
                }}
              >
                {contact.phone}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Last Call Info */}
      {lastCall && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '6px',
            padding: '8px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{ fontSize: '10px', fontWeight: '600', color: '#10b981' }}
          >
            Last Call
          </div>
          <div style={{ fontSize: '9px', color: '#9ca3af' }}>
            To: {lastCall.to}
            <br />
            Status: {lastCall.status}
            <br />
            SID: {lastCall.callSid}
          </div>
        </div>
      )}

      {/* Status Footer */}
      <div
        style={{
          textAlign: 'center',
          fontSize: '9px',
          color: 'rgba(255, 255, 255, 0.6)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '10px',
          marginTop: '10px',
        }}
      >
        <div style={{ marginBottom: '4px' }}>🔒 Secure • 📞 HD Quality</div>
        <div style={{ fontSize: '8px', opacity: 0.8 }}>Powered by Twilio</div>
      </div>
    </div>
  );
}
