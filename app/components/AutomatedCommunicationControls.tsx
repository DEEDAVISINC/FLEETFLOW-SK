'use client';

import { useState } from 'react';
import {
  handleCustomerInquiry,
  handleDriverEvent,
} from '../services/loadService';

interface AutomatedCommunicationControlsProps {
  loadId?: string;
  customerId?: string;
}

export default function AutomatedCommunicationControls({
  loadId = 'FL-2025-001',
  customerId = 'ABC-204-070',
}: AutomatedCommunicationControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  const testDriverEvent = async (eventType: string) => {
    try {
      setTestResult(`Testing ${eventType}...`);

      await handleDriverEvent(loadId, eventType as any, {
        driverName: 'John Rodriguez',
        driverPhone: '+1555987654',
        currentLocation: 'I-75 Mile 234, GA',
        delayMinutes: eventType === 'running_late' ? 120 : undefined,
        breakdownType: eventType === 'breakdown' ? 'engine_failure' : undefined,
        description: `Test ${eventType} event`,
      });

      setTestResult(
        `✅ ${eventType} event processed - check console for communication decision`
      );
    } catch (error) {
      setTestResult(
        `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const testCustomerInquiry = async (inquiryType: string) => {
    try {
      setTestResult(`Testing ${inquiryType}...`);

      await handleCustomerInquiry(customerId, inquiryType as any, {
        customerName: 'ABC Logistics',
        customerCompany: 'ABC Logistics Inc.',
        customerPhone: '+1555123456',
        loadId: loadId,
        hasIssues: inquiryType === 'complaint',
        description: `Test ${inquiryType} inquiry`,
      });

      setTestResult(
        `✅ ${inquiryType} inquiry processed - check console for communication decision`
      );
    } catch (error) {
      setTestResult(
        `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
          zIndex: 999,
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow =
            '0 12px 32px rgba(245, 158, 11, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow =
            '0 8px 24px rgba(245, 158, 11, 0.3)';
        }}
        title='Test Automated Communication System'
      >
        🤖
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '350px',
        background: 'rgba(17, 24, 39, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '15px',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        padding: '20px',
        zIndex: 999,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h3
          style={{
            color: '#f59e0b',
            fontSize: '16px',
            fontWeight: '600',
            margin: 0,
          }}
        >
          🤖 Communication Test Panel
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ color: 'white', fontSize: '14px', marginBottom: '8px' }}>
          🚨 Driver Events
        </h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
          }}
        >
          {['breakdown', 'accident', 'running_late', 'route_deviation'].map(
            (event) => (
              <button
                key={event}
                onClick={() => testDriverEvent(event)}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {event.replace('_', ' ')}
              </button>
            )
          )}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ color: 'white', fontSize: '14px', marginBottom: '8px' }}>
          📞 Customer Inquiries
        </h4>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
          }}
        >
          {[
            'complaint',
            'delivery_status',
            'rate_request',
            'billing_dispute',
          ].map((inquiry) => (
            <button
              key={inquiry}
              onClick={() => testCustomerInquiry(inquiry)}
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#3b82f6',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {inquiry.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {testResult && (
        <div
          style={{
            background: testResult.includes('✅')
              ? 'rgba(34, 197, 94, 0.1)'
              : testResult.includes('❌')
                ? 'rgba(239, 68, 68, 0.1)'
                : 'rgba(245, 158, 11, 0.1)',
            border: testResult.includes('✅')
              ? '1px solid rgba(34, 197, 94, 0.3)'
              : testResult.includes('❌')
                ? '1px solid rgba(239, 68, 68, 0.3)'
                : '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          {testResult}
        </div>
      )}

      <div
        style={{
          marginTop: '12px',
          padding: '8px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.7)',
        }}
      >
        💡 <strong>Tip:</strong> Check browser console to see automated
        communication decisions (SMS vs Human escalation)
      </div>
    </div>
  );
}
