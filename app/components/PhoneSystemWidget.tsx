/**
 * Phone System Widget
 * Provides phone system access for dispatchers that remains visible while using the app
 */

'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '../config/access';
import { phoneMonitoringService } from '../services/PhoneMonitoringService';

interface PhoneWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  initialExpanded?: boolean;
}

export default function PhoneSystemWidget({
  position = 'bottom-right',
  initialExpanded = false,
}: PhoneWidgetProps) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const [dialNumber, setDialNumber] = useState('');
  const [callStatus, setCallStatus] = useState<
    'idle' | 'dialing' | 'connected' | 'ended'
  >('idle');
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [durationInterval, setDurationInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [muted, setMuted] = useState(false);
  const [onHold, setOnHold] = useState(false);

  // Note-taking state
  const [currentNote, setCurrentNote] = useState('');
  const [noteType, setNoteType] = useState<
    'general' | 'opportunity' | 'complaint' | 'follow_up'
  >('general');
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [contactNotes, setContactNotes] = useState<any[]>([]);

  const { user } = getCurrentUser();

  // Load recent calls on component mount
  useEffect(() => {
    const calls = phoneMonitoringService.getCallRecords({
      limit: 5,
      employeeId: user?.id,
    });
    setRecentCalls(calls);
  }, [user?.id]);

  // Clear intervals on unmount
  useEffect(() => {
    return () => {
      if (durationInterval) {
        clearInterval(durationInterval);
      }
    };
  }, [durationInterval]);

  // Format phone number as input is entered
  const formatPhoneNumber = (input: string) => {
    const cleaned = input.replace(/\D/g, '');
    let formatted = cleaned;

    if (cleaned.length > 3 && cleaned.length <= 6) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else if (cleaned.length > 6) {
      formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }

    return formatted;
  };

  // Handle phone number input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setDialNumber(formattedNumber);
  };

  // Format duration for display (mm:ss)
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Initiate a call
  const handleDial = () => {
    if (!dialNumber || dialNumber.replace(/\D/g, '').length < 10) return;

    const cleanedNumber = `+1${dialNumber.replace(/\D/g, '')}`;

    setCallStatus('dialing');

    // Use phone monitoring service to start call
    const callId = phoneMonitoringService.startCallMonitoring({
      employeeId: user?.id || 'unknown-user',
      employeeName: user?.name || 'Unknown User',
      employeeDepartment: 'Dispatch',
      customerPhone: cleanedNumber,
      callDirection: 'outbound',
      platform: 'twilio',
      callPurpose: 'dispatch',
    });

    setActiveCallId(callId);

    // Simulate connecting after a delay
    setTimeout(() => {
      setCallStatus('connected');

      // Start tracking call duration
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      setDurationInterval(interval);

      // Update call status in the service
      phoneMonitoringService.updateCallStatus(callId, {
        callStatus: 'connected',
        answerTime: new Date().toISOString(),
      });

      // Show notes panel during active call
      setShowNotesPanel(true);
    }, 2000);
  };

  // End current call
  const handleEndCall = () => {
    if (activeCallId) {
      phoneMonitoringService.updateCallStatus(activeCallId, {
        callStatus: 'completed',
        endTime: new Date().toISOString(),
      });

      // Reset state
      setCallStatus('ended');

      // Clear interval
      if (durationInterval) {
        clearInterval(durationInterval);
        setDurationInterval(null);
      }

      // Refresh recent calls after a delay
      setTimeout(() => {
        const calls = phoneMonitoringService.getCallRecords({
          limit: 5,
          employeeId: user?.id,
        });
        setRecentCalls(calls);

        // Reset to idle state
        setCallStatus('idle');
        setActiveCallId(null);
        setCallDuration(0);
        setShowNotesPanel(false);
        setCurrentNote('');
        setContactNotes([]);
      }, 1000);
    }
  };

  // Toggle mute status
  const handleToggleMute = () => {
    setMuted((prev) => !prev);
  };

  // Toggle hold status
  const handleToggleHold = () => {
    setOnHold((prev) => !prev);
  };

  // Initialize call with recent contact
  const handleCallRecent = (phoneNumber: string) => {
    setDialNumber(formatPhoneNumber(phoneNumber.replace(/^\+1/, '')));
    handleDial();
  };

  // Add note to current call
  const handleAddNote = () => {
    if (!currentNote.trim() || !activeCallId) return;

    phoneMonitoringService.addCallNote(activeCallId, {
      noteText: currentNote,
      noteType: noteType,
      employeeName: user?.name || 'Unknown User',
      attachments: [],
    });

    // Add to local contact notes for immediate display
    const newNote = {
      id: Date.now().toString(),
      noteText: currentNote,
      noteType: noteType,
      employeeName: user?.name || 'Unknown User',
      timestamp: new Date().toISOString(),
    };
    setContactNotes((prev) => [...prev, newNote]);

    // Clear current note
    setCurrentNote('');
    console.log(`📝 Note added to call ${activeCallId}: ${currentNote}`);
  };

  // Quick note templates
  const quickNoteTemplates = [
    { text: 'Interested in load opportunities', type: 'opportunity' as const },
    { text: 'Payment discussion - following up', type: 'follow_up' as const },
    { text: 'Equipment availability inquiry', type: 'general' as const },
    { text: 'Rate negotiation needed', type: 'opportunity' as const },
    { text: 'Complaint about delivery time', type: 'complaint' as const },
    { text: 'Request callback tomorrow', type: 'follow_up' as const },
  ];

  // Apply quick template
  const applyQuickTemplate = (template: (typeof quickNoteTemplates)[0]) => {
    setCurrentNote(template.text);
    setNoteType(template.type);
  };

  // Open CRM dashboard
  const openCRM = (contactId?: string) => {
    if (contactId) {
      // Open specific contact in CRM
      window.open(`/crm?contact=${contactId}`, '_blank');
    } else {
      // Open main CRM dashboard
      window.open('/crm', '_blank');
    }
  };

  // Get position styles based on prop
  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-left':
        return { bottom: '20px', left: '20px' };
      case 'top-right':
        return { top: '20px', right: '20px' };
      case 'top-left':
        return { top: '20px', left: '20px' };
      case 'bottom-right':
      default:
        return { bottom: '20px', right: '20px' };
    }
  };

  // Render minimized version
  if (!expanded) {
    return (
      <div
        style={{
          position: 'fixed',
          ...getPositionStyles(),
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setExpanded(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            border: 'none',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.5)',
            color: 'white',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          📞
        </button>
      </div>
    );
  }

  // Render expanded phone widget
  return (
    <div
      style={{
        position: 'fixed',
        ...getPositionStyles(),
        zIndex: 1000,
        width: showNotesPanel ? '450px' : '320px',
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px',
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
          {callStatus === 'connected' || callStatus === 'dialing'
            ? `Call ${callStatus === 'dialing' ? 'Connecting...' : formatDuration(callDuration)}`
            : 'Phone System'}
        </h3>
        <button
          onClick={() => setExpanded(false)}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            fontSize: '16px',
          }}
        >
          −
        </button>
      </div>

      {/* Dialer */}
      <div style={{ padding: '16px' }}>
        {/* Input */}
        <div style={{ marginBottom: '16px' }}>
          <input
            type='text'
            value={dialNumber}
            onChange={handleInputChange}
            placeholder='(555) 123-4567'
            disabled={callStatus === 'dialing' || callStatus === 'connected'}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#1e293b',
              color: 'white',
              fontSize: '16px',
            }}
          />
        </div>

        {/* Call Actions */}
        {callStatus === 'idle' || callStatus === 'ended' ? (
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}
          >
            <button
              onClick={handleDial}
              disabled={
                !dialNumber || dialNumber.replace(/\D/g, '').length < 10
              }
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: '#22c55e',
                color: 'white',
                border: 'none',
                fontWeight: 'bold',
                cursor:
                  dialNumber && dialNumber.replace(/\D/g, '').length >= 10
                    ? 'pointer'
                    : 'not-allowed',
                opacity:
                  dialNumber && dialNumber.replace(/\D/g, '').length >= 10
                    ? 1
                    : 0.5,
              }}
            >
              📞 Dial
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '10px',
            }}
          >
            <button
              onClick={handleToggleMute}
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: muted ? '#f97316' : '#334155',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {muted ? '🔇' : '🔊'}
            </button>
            <button
              onClick={handleToggleHold}
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: onHold ? '#f97316' : '#334155',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {onHold ? '▶️' : '⏸️'}
            </button>
            <button
              onClick={handleEndCall}
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              🔴
            </button>
          </div>
        )}

        {/* Call Notes Panel - Shows during active calls */}
        {showNotesPanel &&
          (callStatus === 'connected' || callStatus === 'dialing') && (
            <div
              style={{
                marginTop: '16px',
                padding: '16px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <h4
                style={{
                  margin: '0 0 12px 0',
                  color: '#60a5fa',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                📝 Call Notes
              </h4>

              {/* CRM Quick Access */}
              <div
                style={{
                  marginBottom: '12px',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                }}
              >
                <button
                  onClick={() => openCRM()}
                  style={{
                    padding: '6px 12px',
                    fontSize: '11px',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  💼 Open CRM
                </button>
                <span style={{ color: '#94a3b8', fontSize: '11px' }}>
                  View full contact details & history
                </span>
              </div>

              {/* Quick Templates */}
              <div style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    color: '#94a3b8',
                    fontSize: '12px',
                    marginBottom: '6px',
                  }}
                >
                  Quick Templates:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {quickNoteTemplates.slice(0, 3).map((template, index) => (
                    <button
                      key={index}
                      onClick={() => applyQuickTemplate(template)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#60a5fa',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      {template.text.substring(0, 20)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Note Type Selector */}
              <div style={{ marginBottom: '8px' }}>
                <select
                  value={noteType}
                  onChange={(e) => setNoteType(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    border: '1px solid #334155',
                    background: '#1e293b',
                    color: 'white',
                    fontSize: '12px',
                  }}
                >
                  <option value='general'>📄 General Note</option>
                  <option value='opportunity'>🎯 Opportunity</option>
                  <option value='complaint'>🚨 Complaint</option>
                  <option value='follow_up'>📞 Follow Up</option>
                </select>
              </div>

              {/* Note Input */}
              <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder='Type your note about this call...'
                style={{
                  width: '100%',
                  height: '60px',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #334155',
                  background: '#1e293b',
                  color: 'white',
                  fontSize: '12px',
                  resize: 'none',
                  marginBottom: '8px',
                }}
              />

              {/* Add Note Button */}
              <button
                onClick={handleAddNote}
                disabled={!currentNote.trim()}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  background: currentNote.trim() ? '#22c55e' : '#374151',
                  color: 'white',
                  border: 'none',
                  fontSize: '12px',
                  cursor: currentNote.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                💾 Add Note to Call
              </button>

              {/* Current Call Notes */}
              {contactNotes.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <div
                    style={{
                      color: '#94a3b8',
                      fontSize: '12px',
                      marginBottom: '6px',
                    }}
                  >
                    This Call:
                  </div>
                  <div style={{ maxHeight: '80px', overflowY: 'auto' }}>
                    {contactNotes.map((note) => (
                      <div
                        key={note.id}
                        style={{
                          padding: '6px',
                          background: 'rgba(34, 197, 94, 0.1)',
                          border: '1px solid rgba(34, 197, 94, 0.2)',
                          borderRadius: '4px',
                          marginBottom: '4px',
                        }}
                      >
                        <div style={{ color: 'white', fontSize: '11px' }}>
                          {note.noteText}
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '10px' }}>
                          {note.noteType} •{' '}
                          {new Date(note.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        {/* CRM Access - Always available */}
        {!showNotesPanel && (
          <div style={{ marginTop: '16px', marginBottom: '16px' }}>
            <button
              onClick={() => openCRM()}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                border: 'none',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              💼 Open CRM Dashboard
            </button>
          </div>
        )}

        {/* Recent Calls */}
        <div style={{ marginTop: '16px' }}>
          <h4
            style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '14px' }}
          >
            Recent Calls
          </h4>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {recentCalls.length === 0 ? (
              <div
                style={{
                  color: '#64748b',
                  textAlign: 'center',
                  padding: '10px',
                }}
              >
                No recent calls
              </div>
            ) : (
              recentCalls.map((call) => (
                <div
                  key={call.callId}
                  style={{
                    padding: '10px',
                    borderBottom: '1px solid #334155',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ color: 'white', fontWeight: '500' }}>
                      {call.customerName || call.customerPhone}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '12px' }}>
                      {new Date(call.startTime).toLocaleTimeString()} •{' '}
                      {formatDuration(call.duration)}
                      {call.crmNotes && call.crmNotes.length > 0 && (
                        <span style={{ color: '#60a5fa', marginLeft: '6px' }}>
                          📝 {call.crmNotes.length} note
                          {call.crmNotes.length !== 1 ? 's' : ''}
                        </span>
                      )}
                      {call.contactId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openCRM(call.contactId);
                          }}
                          style={{
                            marginLeft: '8px',
                            padding: '2px 6px',
                            fontSize: '10px',
                            background: 'rgba(245, 158, 11, 0.2)',
                            color: '#f59e0b',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: '3px',
                            cursor: 'pointer',
                          }}
                        >
                          💼 CRM
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCallRecent(call.customerPhone)}
                    disabled={
                      callStatus === 'dialing' || callStatus === 'connected'
                    }
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: '#3b82f6',
                      border: 'none',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor:
                        callStatus === 'dialing' || callStatus === 'connected'
                          ? 'not-allowed'
                          : 'pointer',
                      opacity:
                        callStatus === 'dialing' || callStatus === 'connected'
                          ? 0.5
                          : 1,
                    }}
                  >
                    📞
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
