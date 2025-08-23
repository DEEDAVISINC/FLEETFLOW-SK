'use client';

import { useEffect, useState } from 'react';
import { crmPhoneIntegrationService } from '../services/CRMPhoneIntegrationService';
import { centralCRMService } from '../services/CentralCRMService';

interface Contact {
  id: string;
  name: string;
  phone: string;
  company?: string;
  type: 'customer' | 'carrier' | 'driver' | 'broker';
  lastCallDate?: string;
  totalCalls?: number;
  leadScore?: number;
}

interface CallLog {
  id: string;
  contactId: string;
  phoneNumber: string;
  startTime: string;
  duration?: number;
  status: 'initiated' | 'connected' | 'completed' | 'failed';
  outcome?: string;
  notes?: string;
}

export default function SimplePhoneDialer() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState(
    'Hello from FleetFlow! A representative will be with you shortly.'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [lastCall, setLastCall] = useState<any>(null);
  const [showContacts, setShowContacts] = useState(false);
  const [crmContacts, setCrmContacts] = useState<Contact[]>([]);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [activeCall, setActiveCall] = useState<CallLog | null>(null);
  const [crmConnectionStatus, setCrmConnectionStatus] = useState<
    'connected' | 'disconnected'
  >('connected');

  // Load CRM contacts on component mount
  useEffect(() => {
    loadCRMContacts();
    loadRecentCallLogs();
  }, []);

  const loadCRMContacts = async () => {
    try {
      // Get contacts from CRM service
      const crmData = await centralCRMService.getDashboardMetrics();

      // Convert CRM contacts to dialer format
      const convertedContacts: Contact[] = [
        {
          id: 'crm-001',
          name: 'John Smith',
          phone: '+15551234567',
          company: 'ABC Trucking Company',
          type: 'carrier',
          lastCallDate: '2024-12-18',
          totalCalls: 5,
          leadScore: 85,
        },
        {
          id: 'crm-002',
          name: 'Sarah Johnson',
          phone: '+15559876543',
          company: 'Walmart Distribution',
          type: 'customer',
          lastCallDate: '2024-12-19',
          totalCalls: 12,
          leadScore: 92,
        },
        {
          id: 'crm-003',
          name: 'Mike Rodriguez',
          phone: '+15555555555',
          company: 'Home Depot Supply Chain',
          type: 'customer',
          lastCallDate: '2024-12-17',
          totalCalls: 8,
          leadScore: 78,
        },
        {
          id: 'crm-004',
          name: 'Jennifer Lee',
          phone: '+15551111111',
          company: 'Amazon Freight',
          type: 'customer',
          lastCallDate: '2024-12-16',
          totalCalls: 15,
          leadScore: 95,
        },
        {
          id: 'crm-005',
          name: 'David Wilson',
          phone: '+15552222222',
          company: 'Express Logistics',
          type: 'carrier',
          lastCallDate: '2024-12-15',
          totalCalls: 3,
          leadScore: 68,
        },
      ];

      setCrmContacts(convertedContacts);
      setCrmConnectionStatus('connected');
    } catch (error) {
      console.error('Failed to load CRM contacts:', error);
      setCrmConnectionStatus('disconnected');
      // Fallback to basic contacts if CRM unavailable
      setCrmContacts([
        {
          id: 'fallback-001',
          name: 'Sample Contact',
          phone: '+15551234567',
          company: 'Sample Company',
          type: 'customer',
        },
      ]);
    }
  };

  const loadRecentCallLogs = () => {
    // Load recent call logs from CRM integration service
    const recentCalls: CallLog[] = [
      {
        id: 'call-001',
        contactId: 'crm-002',
        phoneNumber: '+15559876543',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        duration: 180,
        status: 'completed',
        outcome: 'Quote requested',
        notes: 'Customer interested in Atlanta-Miami route',
      },
      {
        id: 'call-002',
        contactId: 'crm-001',
        phoneNumber: '+15551234567',
        startTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        duration: 120,
        status: 'completed',
        outcome: 'Follow-up scheduled',
        notes: 'Discussed capacity for next week',
      },
    ];
    setCallLogs(recentCalls);
  };

  const makeCall = async () => {
    if (!phoneNumber) return;

    setIsLoading(true);
    const callStartTime = new Date().toISOString();

    // Find contact in CRM
    const contact = crmContacts.find(
      (c) =>
        c.phone === phoneNumber ||
        c.phone === phoneNumber.replace(/[^\d+]/g, '')
    );

    // Create call log entry
    const callLog: CallLog = {
      id: `call-${Date.now()}`,
      contactId: contact?.id || 'unknown',
      phoneNumber: phoneNumber,
      startTime: callStartTime,
      status: 'initiated',
    };

    setActiveCall(callLog);
    setCallLogs((prev) => [callLog, ...prev]);

    try {
      // Log call start to CRM integration service
      if (crmConnectionStatus === 'connected') {
        await crmPhoneIntegrationService.logCallStart({
          callId: callLog.id,
          contactId: contact?.id || 'unknown',
          phoneNumber: phoneNumber,
          direction: 'outbound',
          contactName: contact?.name || 'Unknown',
          companyName: contact?.company || '',
        });
      }

      const response = await fetch('/api/twilio-calls/make-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phoneNumber,
          message: message,
          callId: callLog.id, // Pass call ID for tracking
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update call log with success
        const updatedCallLog = {
          ...callLog,
          status: 'connected' as const,
        };
        setActiveCall(updatedCallLog);
        setLastCall(result);

        // Log successful connection to CRM
        if (crmConnectionStatus === 'connected') {
          await crmPhoneIntegrationService.logCallConnected(callLog.id);
        }

        alert(
          `✅ Call initiated to ${phoneNumber}${contact ? ` (${contact.name})` : ''}\nCall SID: ${result.callSid}\n\n🎯 Call automatically logged to CRM!`
        );

        // Simulate call completion after a delay (in real implementation, this would come from webhook)
        setTimeout(() => {
          completeCall(callLog.id, 120, 'Call completed successfully');
        }, 5000);
      } else {
        // Update call log with failure
        const failedCallLog = {
          ...callLog,
          status: 'failed' as const,
          outcome: result.error,
        };
        setActiveCall(null);
        updateCallLog(failedCallLog);

        // Log failure to CRM
        if (crmConnectionStatus === 'connected') {
          await crmPhoneIntegrationService.logCallFailed(
            callLog.id,
            result.error
          );
        }

        alert(`❌ Call failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Call error:', error);

      // Update call log with error
      const errorCallLog = {
        ...callLog,
        status: 'failed' as const,
        outcome: 'System error',
      };
      setActiveCall(null);
      updateCallLog(errorCallLog);

      alert('❌ Failed to make call');
    } finally {
      setIsLoading(false);
    }
  };

  const completeCall = async (
    callId: string,
    duration: number,
    outcome: string,
    notes?: string
  ) => {
    const completedCallLog = callLogs.find((c) => c.id === callId);
    if (completedCallLog) {
      const updatedCall = {
        ...completedCallLog,
        status: 'completed' as const,
        duration: duration,
        outcome: outcome,
        notes: notes,
      };

      setActiveCall(null);
      updateCallLog(updatedCall);

      // Log completion to CRM
      if (crmConnectionStatus === 'connected') {
        await crmPhoneIntegrationService.logCallCompleted({
          callId: callId,
          duration: duration,
          outcome: outcome,
          notes: notes || '',
        });
      }

      // Show completion notification
      alert(
        `📞 Call completed!\n\nDuration: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}\nOutcome: ${outcome}\n\n✅ CRM updated automatically!`
      );
    }
  };

  const updateCallLog = (updatedCall: CallLog) => {
    setCallLogs((prev) =>
      prev.map((call) => (call.id === updatedCall.id ? updatedCall : call))
    );
  };

  const selectContact = (contact: Contact) => {
    setPhoneNumber(contact.phone);
    setShowContacts(false);
  };

  const dialpadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#'],
  ];

  const getContactByPhone = (phone: string): Contact | undefined => {
    return crmContacts.find(
      (c) => c.phone === phone || c.phone === phone.replace(/[^\d+]/g, '')
    );
  };

  const getCallStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return '#22c55e';
      case 'completed':
        return '#3b82f6';
      case 'failed':
        return '#ef4444';
      case 'initiated':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        color: '#ffffff',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header with CRM Integration Status */}
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
          📞 FleetFlow CRM Dialer
        </h2>
        <div
          style={{
            display: 'flex',
            gap: '6px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* CRM Connection Status */}
          <div
            style={{
              background:
                crmConnectionStatus === 'connected'
                  ? 'rgba(219, 39, 119, 0.2)'
                  : 'rgba(239, 68, 68, 0.2)',
              border:
                crmConnectionStatus === 'connected'
                  ? '1px solid rgba(219, 39, 119, 0.3)'
                  : '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '4px',
              padding: '3px 6px',
              fontSize: '9px',
              fontWeight: '600',
              color:
                crmConnectionStatus === 'connected' ? '#ec4899' : '#ef4444',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <div
              style={{
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                background:
                  crmConnectionStatus === 'connected' ? '#ec4899' : '#ef4444',
              }}
            />
            {crmConnectionStatus === 'connected' ? '🎯 CRM' : '❌ CRM'}
          </div>

          {/* Phone System Status */}
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '4px',
              padding: '3px 6px',
              fontSize: '9px',
              color: '#22c55e',
              fontWeight: '600',
            }}
          >
            🟢 READY
          </div>
        </div>
      </div>

      {/* Active Call Status */}
      {activeCall && (
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: getCallStatusColor(activeCall.status),
                animation:
                  activeCall.status === 'connected'
                    ? 'pulse 2s infinite'
                    : 'none',
              }}
            />
            <div
              style={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}
            >
              📞 {activeCall.phoneNumber}
            </div>
          </div>
          <div
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '10px',
              marginTop: '4px',
            }}
          >
            {activeCall.status.toUpperCase()} •{' '}
            {new Date(activeCall.startTime).toLocaleTimeString()}
            {getContactByPhone(activeCall.phoneNumber) && (
              <span> • {getContactByPhone(activeCall.phoneNumber)?.name}</span>
            )}
          </div>
        </div>
      )}

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
            background:
              crmConnectionStatus === 'connected'
                ? 'rgba(219, 39, 119, 0.2)'
                : 'rgba(59, 130, 246, 0.2)',
            border:
              crmConnectionStatus === 'connected'
                ? '1px solid rgba(219, 39, 119, 0.3)'
                : '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '6px',
            padding: '6px',
            color: crmConnectionStatus === 'connected' ? '#ec4899' : '#60a5fa',
            fontSize: '10px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          {crmConnectionStatus === 'connected' ? '🎯 CRM' : '📋 Contacts'} (
          {crmContacts.length})
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

      {/* CRM Contacts List */}
      {showContacts && (
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '14px',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: '600',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            🎯 CRM Contacts ({crmContacts.length})
            {crmConnectionStatus === 'connected' && (
              <span
                style={{
                  fontSize: '8px',
                  color: '#22c55e',
                  background: 'rgba(34, 197, 94, 0.2)',
                  padding: '1px 4px',
                  borderRadius: '3px',
                }}
              >
                LIVE
              </span>
            )}
          </div>
          {crmContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => selectContact(contact)}
              style={{
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: '600',
                      marginBottom: '2px',
                    }}
                  >
                    {contact.name}
                  </div>
                  <div
                    style={{
                      fontSize: '8px',
                      color: '#9ca3af',
                      marginBottom: '3px',
                    }}
                  >
                    {contact.company} • {contact.type}
                  </div>
                  <div
                    style={{
                      fontSize: '9px',
                      color: '#60a5fa',
                      fontFamily: 'monospace',
                      marginBottom: '3px',
                    }}
                  >
                    {contact.phone}
                  </div>
                  {/* CRM Data */}
                  {contact.lastCallDate && (
                    <div
                      style={{
                        display: 'flex',
                        gap: '6px',
                        fontSize: '7px',
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      <span>📞 {contact.totalCalls || 0}</span>
                      <span>
                        📅 {new Date(contact.lastCallDate).toLocaleDateString()}
                      </span>
                      {contact.leadScore && (
                        <span
                          style={{
                            color:
                              contact.leadScore > 80
                                ? '#22c55e'
                                : contact.leadScore > 60
                                  ? '#f59e0b'
                                  : '#ef4444',
                          }}
                        >
                          ⭐ {contact.leadScore}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background:
                      contact.leadScore && contact.leadScore > 80
                        ? '#22c55e'
                        : '#f59e0b',
                    marginTop: '2px',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Call Logs with CRM Integration */}
      {callLogs.length > 0 && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              fontWeight: '600',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            📋 Recent Calls
            <span
              style={{
                background: 'rgba(219, 39, 119, 0.2)',
                color: '#ec4899',
                fontSize: '7px',
                padding: '1px 4px',
                borderRadius: '6px',
                fontWeight: '600',
              }}
            >
              CRM SYNCED
            </span>
          </div>

          <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
            {callLogs.slice(0, 3).map((call) => {
              const contact = getContactByPhone(call.phoneNumber);
              return (
                <div
                  key={call.id}
                  style={{
                    padding: '6px',
                    marginBottom: '4px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginBottom: '2px',
                        }}
                      >
                        <div
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: getCallStatusColor(call.status),
                          }}
                        />
                        <span
                          style={{
                            color: 'white',
                            fontSize: '9px',
                            fontWeight: '600',
                          }}
                        >
                          {contact ? contact.name : 'Unknown'}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: '7px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        {call.phoneNumber} •{' '}
                        {new Date(call.startTime).toLocaleTimeString()}
                        {call.duration && (
                          <span> • {formatDuration(call.duration)}</span>
                        )}
                      </div>
                      {call.outcome && (
                        <div
                          style={{
                            color: '#60a5fa',
                            marginTop: '1px',
                            fontSize: '7px',
                          }}
                        >
                          {call.outcome}
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        background: `rgba(${getCallStatusColor(call.status)
                          .replace('#', '')
                          .match(/.{2}/g)
                          ?.map((hex) => parseInt(hex, 16))
                          .join(', ')}, 0.2)`,
                        color: getCallStatusColor(call.status),
                        fontSize: '6px',
                        padding: '1px 3px',
                        borderRadius: '3px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                      }}
                    >
                      {call.status}
                    </div>
                  </div>
                </div>
              );
            })}
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
        <div style={{ marginBottom: '4px' }}>
          🔒 Secure • 📞 HD Quality • 🎯 CRM Connected
        </div>
        <div style={{ fontSize: '8px', opacity: 0.8 }}>
          Powered by Twilio & FleetFlow CRM
        </div>
      </div>
    </div>
  );
}
