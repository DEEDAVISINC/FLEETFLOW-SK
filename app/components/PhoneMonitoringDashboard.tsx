/**
 * Phone Monitoring Dashboard for Brokerage Management
 * Real-time call monitoring, CRM integration, and quality management
 */

'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '../config/access';
import {
  CallMetrics,
  CallRecord,
  RealTimeCallEvent,
  phoneMonitoringService,
} from '../services/PhoneMonitoringService';

interface CallNoteModal {
  isOpen: boolean;
  callId: string;
  callRecord: CallRecord | null;
}

interface HandoffModal {
  isOpen: boolean;
  callId: string;
  callRecord: CallRecord | null;
}

export default function PhoneMonitoringDashboard() {
  const [activeCalls, setActiveCalls] = useState<CallRecord[]>([]);
  const [recentCalls, setRecentCalls] = useState<CallRecord[]>([]);
  const [callMetrics, setCallMetrics] = useState<CallMetrics | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    '24h' | '7d' | '30d' | '90d'
  >('24h');
  const [callNoteModal, setCallNoteModal] = useState<CallNoteModal>({
    isOpen: false,
    callId: '',
    callRecord: null,
  });
  const [handoffModal, setHandoffModal] = useState<HandoffModal>({
    isOpen: false,
    callId: '',
    callRecord: null,
  });
  const [newNote, setNewNote] = useState({
    text: '',
    type: 'call_summary' as const,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { user } = getCurrentUser();

  useEffect(() => {
    // Load initial data
    loadDashboardData();

    // Subscribe to real-time call events
    const unsubscribe = phoneMonitoringService.subscribeToCallEvents(
      (event: RealTimeCallEvent) => {
        console.log('📞 Real-time call event:', event);
        handleRealTimeEvent(event);
      }
    );

    // Set up periodic refresh
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [selectedTimeRange]);

  const loadDashboardData = () => {
    try {
      const active = phoneMonitoringService.getActiveCalls();
      const recent = phoneMonitoringService.getCallRecords({ limit: 50 });
      const metrics = phoneMonitoringService.getCallMetrics(selectedTimeRange);

      setActiveCalls(active);
      setRecentCalls(recent);
      setCallMetrics(metrics);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleRealTimeEvent = (event: RealTimeCallEvent) => {
    // Update the dashboard based on real-time events
    switch (event.type) {
      case 'call_started':
      case 'call_answered':
      case 'call_ended':
        loadDashboardData(); // Refresh all data
        break;
      case 'call_note_added':
        // Update specific call record with new note
        setRecentCalls((prev) =>
          prev.map((call) =>
            call.callId === event.callId
              ? { ...call, crmNotes: [...call.crmNotes, event.data] }
              : call
          )
        );
        break;
      case 'call_handoff':
        // Update call with handoff information
        setActiveCalls((prev) =>
          prev.map((call) =>
            call.callId === event.callId
              ? { ...call, handoffs: [...call.handoffs, event.data] }
              : call
          )
        );
        break;
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      const formatted = cleaned.substring(1);
      return `+1 (${formatted.slice(0, 3)}) ${formatted.slice(3, 6)}-${formatted.slice(6)}`;
    }
    return phone;
  };

  const getCallStatusColor = (status: string): string => {
    switch (status) {
      case 'connected':
        return '#22c55e';
      case 'ringing':
        return '#f59e0b';
      case 'completed':
        return '#3b82f6';
      case 'failed':
        return '#ef4444';
      case 'abandoned':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getCallPurposeIcon = (purpose: string): string => {
    switch (purpose) {
      case 'sales':
        return '💰';
      case 'dispatch':
        return '🚛';
      case 'customer_service':
        return '🎧';
      case 'follow_up':
        return '📞';
      case 'emergency':
        return '🚨';
      default:
        return '📞';
    }
  };

  const openCallNoteModal = (call: CallRecord) => {
    setCallNoteModal({ isOpen: true, callId: call.callId, callRecord: call });
    setNewNote({ text: '', type: 'call_summary' });
  };

  const closeCallNoteModal = () => {
    setCallNoteModal({ isOpen: false, callId: '', callRecord: null });
    setNewNote({ text: '', type: 'call_summary' });
  };

  const saveCallNote = () => {
    if (callNoteModal.callId && newNote.text.trim()) {
      phoneMonitoringService.addCallNote(callNoteModal.callId, {
        employeeId: user.id,
        employeeName: user.name,
        noteText: newNote.text.trim(),
        noteType: newNote.type,
      });
      closeCallNoteModal();
    }
  };

  const openHandoffModal = (call: CallRecord) => {
    setHandoffModal({ isOpen: true, callId: call.callId, callRecord: call });
  };

  const closeHandoffModal = () => {
    setHandoffModal({ isOpen: false, callId: '', callRecord: null });
  };

  const filteredCalls = recentCalls.filter((call) => {
    const matchesSearch =
      searchTerm === '' ||
      call.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.customerPhone.includes(searchTerm) ||
      call.employeeName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || call.callStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div
      style={{
        padding: '24px',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        minHeight: '100vh',
        color: 'white',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #60a5fa, #34d399)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          📞 Phone Monitoring Dashboard
        </h1>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '16px',
          }}
        >
          Real-time call monitoring, CRM integration, and quality management
        </p>
      </div>

      {/* Quick Stats */}
      {callMetrics && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div
              style={{ fontSize: '24px', fontWeight: 'bold', color: '#60a5fa' }}
            >
              {callMetrics.totalCalls}
            </div>
            <div
              style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Total Calls ({selectedTimeRange})
            </div>
          </div>

          <div
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div
              style={{ fontSize: '24px', fontWeight: 'bold', color: '#34d399' }}
            >
              {callMetrics.answerRate}%
            </div>
            <div
              style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Answer Rate
            </div>
          </div>

          <div
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div
              style={{ fontSize: '24px', fontWeight: 'bold', color: '#fbbf24' }}
            >
              {formatDuration(callMetrics.averageCallDuration)}
            </div>
            <div
              style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Avg Call Duration
            </div>
          </div>

          <div
            style={{
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div
              style={{ fontSize: '24px', fontWeight: 'bold', color: '#a855f7' }}
            >
              ${callMetrics.totalCost.toFixed(2)}
            </div>
            <div
              style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Total Cost ({selectedTimeRange})
            </div>
          </div>
        </div>
      )}

      {/* Time Range Selector */}
      <div style={{ marginBottom: '24px' }}>
        <label
          style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px',
            display: 'block',
          }}
        >
          📊 Time Range:
        </label>
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value as any)}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '8px 12px',
            color: 'white',
            fontSize: '14px',
          }}
        >
          <option value='24h'>Last 24 Hours</option>
          <option value='7d'>Last 7 Days</option>
          <option value='30d'>Last 30 Days</option>
          <option value='90d'>Last 90 Days</option>
        </select>
      </div>

      {/* Active Calls Section */}
      {activeCalls.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#22c55e',
            }}
          >
            🔴 Active Calls ({activeCalls.length})
          </h2>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {activeCalls.map((call, index) => (
              <div
                key={call.callId}
                style={{
                  padding: '16px',
                  borderBottom:
                    index < activeCalls.length - 1
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: getCallStatusColor(call.callStatus),
                      borderRadius: '50%',
                      animation:
                        call.callStatus === 'ringing'
                          ? 'pulse 2s infinite'
                          : 'none',
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {getCallPurposeIcon(call.callPurpose)}{' '}
                      {call.customerName || call.customerPhone}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      {call.employeeName} •{' '}
                      {formatPhoneNumber(call.customerPhone)}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>
                    {formatDuration(call.duration)}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {call.callStatus.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call History Section */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#60a5fa',
            }}
          >
            📋 Call History
          </h2>

          {/* Search and Filter Controls */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type='text'
              placeholder='Search calls...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'white',
                fontSize: '14px',
                width: '200px',
              }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'white',
                fontSize: '14px',
              }}
            >
              <option value='all'>All Status</option>
              <option value='completed'>Completed</option>
              <option value='failed'>Failed</option>
              <option value='abandoned'>Abandoned</option>
            </select>
          </div>
        </div>

        {/* Call Records Table */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {filteredCalls.length === 0 ? (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              No calls found matching your criteria
            </div>
          ) : (
            filteredCalls.map((call, index) => (
              <div
                key={call.callId}
                style={{
                  padding: '16px',
                  borderBottom:
                    index < filteredCalls.length - 1
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : 'none',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>
                        {getCallPurposeIcon(call.callPurpose)}
                      </span>
                      <span style={{ fontWeight: '600' }}>
                        {call.customerName ||
                          formatPhoneNumber(call.customerPhone)}
                      </span>
                      <span
                        style={{
                          background: getCallStatusColor(call.callStatus),
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: '600',
                        }}
                      >
                        {call.callStatus.toUpperCase()}
                      </span>
                      {call.handoffs.length > 0 && (
                        <span
                          style={{
                            background: 'rgba(245, 158, 11, 0.2)',
                            color: '#fbbf24',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: '600',
                          }}
                        >
                          🔄 {call.handoffs.length} HANDOFF
                          {call.handoffs.length > 1 ? 'S' : ''}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: '8px',
                      }}
                    >
                      {call.employeeName} ({call.employeeDepartment}) •{' '}
                      {call.callDirection} •{' '}
                      {new Date(call.startTime).toLocaleString()}
                    </div>

                    {/* CRM Notes Preview */}
                    {call.crmNotes.length > 0 && (
                      <div
                        style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '8px',
                          padding: '8px',
                          marginTop: '8px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#60a5fa',
                            fontWeight: '600',
                            marginBottom: '4px',
                          }}
                        >
                          📝 Latest Note:
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          {call.crmNotes[call.crmNotes.length - 1].noteText}
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginLeft: '16px',
                    }}
                  >
                    <div style={{ textAlign: 'right', marginRight: '16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>
                        {formatDuration(call.duration)}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        ${call.cost.toFixed(3)}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <button
                      onClick={() => openCallNoteModal(call)}
                      style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        color: '#60a5fa',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      📝 Note
                    </button>

                    {(call.callStatus === 'connected' ||
                      call.callStatus === 'ringing') && (
                      <button
                        onClick={() => openHandoffModal(call)}
                        style={{
                          background: 'rgba(245, 158, 11, 0.2)',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          color: '#fbbf24',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        🔄 Handoff
                      </button>
                    )}

                    {call.recordingUrl && (
                      <button
                        onClick={() => window.open(call.recordingUrl, '_blank')}
                        style={{
                          background: 'rgba(168, 85, 247, 0.2)',
                          border: '1px solid rgba(168, 85, 247, 0.3)',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          color: '#a855f7',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        🎵 Play
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Call Note Modal */}
      {callNoteModal.isOpen && callNoteModal.callRecord && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#1e293b',
              borderRadius: '12px',
              padding: '24px',
              width: '500px',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '16px',
                color: '#60a5fa',
              }}
            >
              📝 Add Call Note
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '8px',
                }}
              >
                <strong>Customer:</strong>{' '}
                {callNoteModal.callRecord.customerName ||
                  formatPhoneNumber(callNoteModal.callRecord.customerPhone)}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '8px',
                }}
              >
                <strong>Duration:</strong>{' '}
                {formatDuration(callNoteModal.callRecord.duration)}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '16px',
                }}
              >
                <strong>Employee:</strong>{' '}
                {callNoteModal.callRecord.employeeName}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Note Type:
              </label>
              <select
                value={newNote.type}
                onChange={(e) =>
                  setNewNote({ ...newNote, type: e.target.value as any })
                }
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                <option value='call_summary'>Call Summary</option>
                <option value='follow_up'>Follow Up</option>
                <option value='issue'>Issue</option>
                <option value='opportunity'>Opportunity</option>
                <option value='complaint'>Complaint</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Note:
              </label>
              <textarea
                value={newNote.text}
                onChange={(e) =>
                  setNewNote({ ...newNote, text: e.target.value })
                }
                placeholder='Enter your call notes here...'
                rows={6}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: 'white',
                  fontSize: '14px',
                  resize: 'vertical',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={closeCallNoteModal}
                style={{
                  background: 'rgba(107, 114, 128, 0.2)',
                  border: '1px solid rgba(107, 114, 128, 0.3)',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  color: '#9ca3af',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveCallNote}
                disabled={!newNote.text.trim()}
                style={{
                  background: newNote.text.trim()
                    ? 'rgba(59, 130, 246, 0.2)'
                    : 'rgba(107, 114, 128, 0.1)',
                  border: `1px solid ${newNote.text.trim() ? 'rgba(59, 130, 246, 0.3)' : 'rgba(107, 114, 128, 0.2)'}`,
                  borderRadius: '8px',
                  padding: '10px 20px',
                  color: newNote.text.trim() ? '#60a5fa' : '#6b7280',
                  fontSize: '14px',
                  cursor: newNote.text.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}














