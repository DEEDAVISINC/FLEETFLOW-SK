'use client';

import { useEffect, useState } from 'react';
import {
  AutoFollowUpRule,
  CommunicationAnalytics,
  CommunicationTemplate,
  CommunicationThread,
  VoiceCallSession,
  brokerCommunicationService,
} from '../services/BrokerCommunicationService';

interface Props {
  brokerId: string;
  onThreadUpdate?: (threadId: string) => void;
}

export default function BrokerCommunicationHub({
  brokerId,
  onThreadUpdate,
}: Props) {
  const [activeTab, setActiveTab] = useState<
    'threads' | 'templates' | 'analytics' | 'settings'
  >('threads');
  const [communicationThreads, setCommunicationThreads] = useState<
    CommunicationThread[]
  >([]);
  const [selectedThread, setSelectedThread] =
    useState<CommunicationThread | null>(null);
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [analytics, setAnalytics] = useState<CommunicationAnalytics | null>(
    null
  );
  const [followUpRules, setFollowUpRules] = useState<AutoFollowUpRule[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: '',
  });

  // Compose message modal state
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeType, setComposeType] = useState<'email' | 'sms' | 'whatsapp'>(
    'email'
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [messageContent, setMessageContent] = useState('');
  const [messageSubject, setMessageSubject] = useState('');

  // Voice call state
  const [showCallModal, setShowCallModal] = useState(false);
  const [activeCall, setActiveCall] = useState<VoiceCallSession | null>(null);
  const [callScript, setCallScript] = useState('');

  useEffect(() => {
    loadCommunicationData();
  }, [brokerId, filters]);

  const loadCommunicationData = () => {
    const threads = brokerCommunicationService.getCommunicationThreads(
      brokerId,
      filters
    );
    setCommunicationThreads(threads);

    const templateList = brokerCommunicationService.getTemplates();
    setTemplates(templateList);

    const analyticsData = brokerCommunicationService.getAnalytics(brokerId);
    setAnalytics(analyticsData);

    const rules = brokerCommunicationService.getAutoFollowUpRules();
    setFollowUpRules(rules);
  };

  const handleSendMessage = async () => {
    if (!selectedThread || !messageContent.trim()) return;

    try {
      await brokerCommunicationService.sendMessage(
        selectedThread.id,
        composeType,
        messageContent,
        selectedTemplate || undefined
      );

      setMessageContent('');
      setMessageSubject('');
      setSelectedTemplate('');
      setShowComposeModal(false);
      loadCommunicationData();

      if (onThreadUpdate) {
        onThreadUpdate(selectedThread.id);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleMakeCall = async (phoneNumber: string) => {
    if (!selectedThread) return;

    try {
      const callSession = await brokerCommunicationService.makeCall(
        selectedThread.id,
        phoneNumber,
        callScript
      );

      setActiveCall(callSession);
      setShowCallModal(false);
      setCallScript('');
      loadCommunicationData();
    } catch (error) {
      console.error('Failed to make call:', error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    if (!templateId || !selectedThread) return;

    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    // Create sample variables for template processing
    const variables = {
      SHIPPER_NAME: selectedThread.shipperName,
      LOAD_ID: selectedThread.loadId || 'TBD',
      ROUTE: `Route TBD`,
      ORIGIN: 'Origin TBD',
      DESTINATION: 'Destination TBD',
      EQUIPMENT_TYPE: 'Dry Van',
      WEIGHT: '45,000',
      PICKUP_DATE: 'TBD',
      DELIVERY_DATE: 'TBD',
      RATE: '1,850',
      BROKER_NAME: 'John Smith',
      BROKER_CONTACT: 'john@fleetflow.com',
      BROKER_PHONE: '+1-555-0123',
      COMPANY_NAME: 'FleetFlow Solutions',
      EXPIRY_TIME: '5:00 PM today',
    };

    const processed = brokerCommunicationService.processTemplate(
      templateId,
      variables
    );
    setMessageContent(processed.content);
    setMessageSubject(processed.subject || '');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#dc2626';
      case 'high':
        return '#ea580c';
      case 'normal':
        return '#0891b2';
      case 'low':
        return '#059669';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'pending_response':
        return '#f59e0b';
      case 'closed':
        return '#6b7280';
      case 'archived':
        return '#9ca3af';
      default:
        return '#6b7280';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  return (
    <div>
      {/* Communication Hub Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          📱 Real-Time Communication Center
          <span
            style={{
              fontSize: '12px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              padding: '4px 8px',
              borderRadius: '6px',
              fontWeight: '500',
            }}
          >
            LIVE
          </span>
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
          Integrated SMS, Email, WhatsApp & Voice communication with
          auto-follow-ups
        </p>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        {[
          {
            id: 'threads',
            label: 'Active Threads',
            icon: '💬',
            count: communicationThreads.filter((t) => t.status === 'active')
              .length,
          },
          {
            id: 'templates',
            label: 'Templates',
            icon: '📝',
            count: templates.length,
          },
          { id: 'analytics', label: 'Performance', icon: '📊' },
          {
            id: 'settings',
            label: 'Auto Follow-up',
            icon: '⚙️',
            count: followUpRules.filter((r) => r.enabled).length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.3s ease',
              background:
                activeTab === tab.id
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {tab.count !== undefined && (
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          minHeight: '600px',
        }}
      >
        {/* Communication Threads Tab */}
        {activeTab === 'threads' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: '20px',
              height: '560px',
            }}
          >
            {/* Thread List */}
            <div>
              {/* Filters */}
              <div
                style={{
                  marginBottom: '16px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                }}
              >
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    padding: '8px',
                    color: 'white',
                    fontSize: '12px',
                  }}
                >
                  <option value='all'>All Status</option>
                  <option value='active'>Active</option>
                  <option value='pending_response'>Pending Response</option>
                  <option value='closed'>Closed</option>
                </select>

                <select
                  value={filters.priority}
                  onChange={(e) =>
                    setFilters({ ...filters, priority: e.target.value })
                  }
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    padding: '8px',
                    color: 'white',
                    fontSize: '12px',
                  }}
                >
                  <option value='all'>All Priority</option>
                  <option value='urgent'>Urgent</option>
                  <option value='high'>High</option>
                  <option value='normal'>Normal</option>
                  <option value='low'>Low</option>
                </select>
              </div>

              {/* Search */}
              <input
                type='text'
                placeholder='Search threads...'
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '8px',
                  color: 'white',
                  fontSize: '12px',
                  marginBottom: '16px',
                }}
              />

              {/* Thread List */}
              <div
                style={{
                  height: '420px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {communicationThreads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => setSelectedThread(thread)}
                    style={{
                      background:
                        selectedThread?.id === thread.id
                          ? 'rgba(16, 185, 129, 0.2)'
                          : 'rgba(255, 255, 255, 0.08)',
                      border:
                        selectedThread?.id === thread.id
                          ? '2px solid #10b981'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
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
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600',
                          margin: 0,
                        }}
                      >
                        {thread.shipperName}
                      </h4>
                      <div
                        style={{
                          display: 'flex',
                          gap: '4px',
                          alignItems: 'center',
                        }}
                      >
                        <div
                          style={{
                            background: getPriorityColor(thread.priority),
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            fontSize: '10px',
                            fontWeight: '600',
                          }}
                        >
                          {thread.priority.toUpperCase()}
                        </div>
                        <div
                          style={{
                            background: getStatusColor(thread.status),
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            fontSize: '10px',
                            fontWeight: '600',
                          }}
                        >
                          {thread.status.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                        margin: '4px 0',
                      }}
                    >
                      {thread.subject}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '11px',
                      }}
                    >
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        {thread.messages.length} messages
                      </span>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        {new Date(thread.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {thread.tags.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '4px',
                          marginTop: '8px',
                        }}
                      >
                        {thread.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            style={{
                              background: 'rgba(59, 130, 246, 0.2)',
                              color: '#60a5fa',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        {thread.tags.length > 2 && (
                          <span
                            style={{
                              color: 'rgba(255, 255, 255, 0.5)',
                              fontSize: '10px',
                              padding: '2px 4px',
                            }}
                          >
                            +{thread.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Thread Detail */}
            <div>
              {selectedThread ? (
                <div>
                  {/* Thread Header */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px',
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: '600',
                            margin: 0,
                          }}
                        >
                          {selectedThread.shipperName}
                        </h3>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                            margin: '4px 0',
                          }}
                        >
                          {selectedThread.subject}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setComposeType('email');
                            setShowComposeModal(true);
                          }}
                          style={{
                            background:
                              'linear-gradient(135deg, #3b82f6, #2563eb)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          ✉️ Email
                        </button>

                        <button
                          onClick={() => {
                            setComposeType('sms');
                            setShowComposeModal(true);
                          }}
                          style={{
                            background:
                              'linear-gradient(135deg, #10b981, #059669)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          📱 SMS
                        </button>

                        <button
                          onClick={() => setShowCallModal(true)}
                          style={{
                            background:
                              'linear-gradient(135deg, #f59e0b, #d97706)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          📞 Call
                        </button>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: '8px',
                        fontSize: '12px',
                      }}
                    >
                      {selectedThread.shipperContact.email && (
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          ✉️ {selectedThread.shipperContact.email}
                        </span>
                      )}
                      {selectedThread.shipperContact.phone && (
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          📞 {selectedThread.shipperContact.phone}
                        </span>
                      )}
                      {selectedThread.loadId && (
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          🚛 {selectedThread.loadId}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  <div
                    style={{
                      height: '400px',
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {selectedThread.messages.map((message) => (
                      <div
                        key={message.id}
                        style={{
                          background:
                            message.direction === 'outbound'
                              ? 'rgba(16, 185, 129, 0.1)'
                              : 'rgba(59, 130, 246, 0.1)',
                          border: `1px solid ${
                            message.direction === 'outbound'
                              ? 'rgba(16, 185, 129, 0.3)'
                              : 'rgba(59, 130, 246, 0.3)'
                          }`,
                          borderRadius: '8px',
                          padding: '12px',
                          marginLeft:
                            message.direction === 'outbound' ? '20px' : '0',
                          marginRight:
                            message.direction === 'inbound' ? '20px' : '0',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <span
                              style={{
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: '600',
                              }}
                            >
                              {message.from.name}
                            </span>
                            <span
                              style={{
                                background:
                                  message.type === 'email'
                                    ? '#3b82f6'
                                    : message.type === 'sms'
                                      ? '#10b981'
                                      : message.type === 'whatsapp'
                                        ? '#22c55e'
                                        : '#f59e0b',
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                fontSize: '10px',
                                fontWeight: '600',
                              }}
                            >
                              {message.type.toUpperCase()}
                            </span>
                            {message.aiSentiment && (
                              <span
                                style={{
                                  color:
                                    message.aiSentiment === 'positive'
                                      ? '#10b981'
                                      : message.aiSentiment === 'negative'
                                        ? '#ef4444'
                                        : '#6b7280',
                                  fontSize: '10px',
                                }}
                              >
                                {message.aiSentiment === 'positive'
                                  ? '😊'
                                  : message.aiSentiment === 'negative'
                                    ? '😞'
                                    : '😐'}
                              </span>
                            )}
                          </div>
                          <span
                            style={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '11px',
                            }}
                          >
                            {formatTime(message.timestamp)}
                          </span>
                        </div>

                        {message.subject && (
                          <p
                            style={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontSize: '13px',
                              fontWeight: '600',
                              margin: '0 0 8px 0',
                            }}
                          >
                            {message.subject}
                          </p>
                        )}

                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '13px',
                            margin: 0,
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {message.content}
                        </p>

                        {message.aiSummary && (
                          <div
                            style={{
                              background: 'rgba(139, 92, 246, 0.1)',
                              border: '1px solid rgba(139, 92, 246, 0.2)',
                              borderRadius: '6px',
                              padding: '6px',
                              marginTop: '8px',
                            }}
                          >
                            <span
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '10px',
                              }}
                            >
                              🤖 AI Summary: {message.aiSummary}
                            </span>
                          </div>
                        )}

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '8px',
                            fontSize: '10px',
                          }}
                        >
                          <span
                            style={{
                              color:
                                message.status === 'read'
                                  ? '#10b981'
                                  : message.status === 'delivered'
                                    ? '#f59e0b'
                                    : message.status === 'failed'
                                      ? '#ef4444'
                                      : '#6b7280',
                            }}
                          >
                            Status:{' '}
                            {message.status.replace('_', ' ').toUpperCase()}
                          </span>

                          {message.metadata?.responseTime && (
                            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              Response time: {message.metadata.responseTime}h
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: 'rgba(255, 255, 255, 0.6)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    💬
                  </div>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
                    Select a Communication Thread
                  </h3>
                  <p style={{ fontSize: '14px' }}>
                    Choose a thread from the list to view the conversation
                    history
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div>
            <h3 style={{ color: 'white', marginBottom: '16px' }}>
              📝 Communication Templates
            </h3>

            <div style={{ display: 'grid', gap: '16px' }}>
              {templates.map((template) => (
                <div
                  key={template.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                          margin: 0,
                        }}
                      >
                        {template.name}
                      </h4>
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                          marginTop: '4px',
                        }}
                      >
                        <span
                          style={{
                            background:
                              template.type === 'email'
                                ? '#3b82f6'
                                : template.type === 'sms'
                                  ? '#10b981'
                                  : template.type === 'whatsapp'
                                    ? '#22c55e'
                                    : '#f59e0b',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          {template.type.toUpperCase()}
                        </span>

                        <span
                          style={{
                            background: 'rgba(139, 92, 246, 0.2)',
                            color: '#a855f7',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          {template.category.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          color: '#10b981',
                          fontSize: '14px',
                          fontWeight: 'bold',
                        }}
                      >
                        {template.effectiveness.toFixed(1)}%
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '11px',
                        }}
                      >
                        {template.usage} uses
                      </div>
                    </div>
                  </div>

                  {template.subject && (
                    <div style={{ marginBottom: '8px' }}>
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '12px',
                        }}
                      >
                        Subject:{' '}
                      </span>
                      <span
                        style={{
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {template.subject}
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '6px',
                      padding: '12px',
                      marginBottom: '8px',
                      maxHeight: '100px',
                      overflowY: 'auto',
                    }}
                  >
                    <pre
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                        margin: 0,
                        fontFamily: 'inherit',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {template.template}
                    </pre>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '11px',
                      }}
                    >
                      Variables:{' '}
                    </span>
                    {template.variables.slice(0, 5).map((variable) => (
                      <span
                        key={variable}
                        style={{
                          background: 'rgba(245, 158, 11, 0.2)',
                          color: '#fbbf24',
                          padding: '2px 4px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontFamily: 'monospace',
                        }}
                      >
                        {'{' + variable + '}'}
                      </span>
                    ))}
                    {template.variables.length > 5 && (
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: '10px',
                        }}
                      >
                        +{template.variables.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <div>
            <h3 style={{ color: 'white', marginBottom: '16px' }}>
              📊 Communication Performance
            </h3>

            {/* Key Metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    color: '#10b981',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  {analytics.responseRate.toFixed(1)}%
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                  }}
                >
                  Response Rate
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    color: '#3b82f6',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  {analytics.averageResponseTime.toFixed(1)}h
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                  }}
                >
                  Avg Response Time
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    color: '#f59e0b',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  {analytics.successfulNegotiations}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                  }}
                >
                  Successful Deals
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    color: '#8b5cf6',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  {analytics.customerSatisfaction.toFixed(1)}/10
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                  }}
                >
                  Customer Satisfaction
                </div>
              </div>
            </div>

            {/* Channel Performance */}
            <div style={{ marginBottom: '24px' }}>
              <h4
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '12px',
                }}
              >
                📱 Channel Performance
              </h4>

              <div style={{ display: 'grid', gap: '8px' }}>
                {Object.entries(analytics.channelPerformance).map(
                  ([channel, stats]) => (
                    <div
                      key={channel}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span
                          style={{
                            background:
                              channel === 'email'
                                ? '#3b82f6'
                                : channel === 'sms'
                                  ? '#10b981'
                                  : channel === 'whatsapp'
                                    ? '#22c55e'
                                    : '#f59e0b',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          {channel.toUpperCase()}
                        </span>
                        <span style={{ color: 'white', fontSize: '14px' }}>
                          {stats.sent} sent, {stats.responses} responses
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <div
                          style={{
                            width: '100px',
                            height: '6px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '3px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.min(100, stats.effectiveness)}%`,
                              height: '100%',
                              background:
                                stats.effectiveness >= 70
                                  ? '#10b981'
                                  : stats.effectiveness >= 50
                                    ? '#f59e0b'
                                    : '#ef4444',
                              borderRadius: '3px',
                            }}
                          />
                        </div>
                        <span
                          style={{
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          {stats.effectiveness.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Top Templates */}
            <div>
              <h4
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '12px',
                }}
              >
                🏆 Top Performing Templates
              </h4>

              <div style={{ display: 'grid', gap: '8px' }}>
                {analytics.topTemplates.map((template, index) => (
                  <div
                    key={template.templateId}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          background:
                            index === 0
                              ? '#ffd700'
                              : index === 1
                                ? '#c0c0c0'
                                : index === 2
                                  ? '#cd7f32'
                                  : '#6b7280',
                          color: 'white',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        {index + 1}
                      </div>
                      <span style={{ color: 'white', fontSize: '14px' }}>
                        {template.name}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '12px',
                      }}
                    >
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {template.usage} uses
                      </span>
                      <span style={{ color: '#10b981', fontWeight: '600' }}>
                        {template.effectiveness.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab - Auto Follow-up Rules */}
        {activeTab === 'settings' && (
          <div>
            <h3 style={{ color: 'white', marginBottom: '16px' }}>
              ⚙️ Auto Follow-up Rules
            </h3>

            <div style={{ display: 'grid', gap: '16px' }}>
              {followUpRules.map((rule) => (
                <div
                  key={rule.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: '600',
                          margin: 0,
                        }}
                      >
                        {rule.name}
                      </h4>
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                          marginTop: '4px',
                        }}
                      >
                        <span
                          style={{
                            background:
                              rule.trigger === 'no_response'
                                ? '#ef4444'
                                : rule.trigger === 'time_based'
                                  ? '#f59e0b'
                                  : '#3b82f6',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          {rule.trigger.replace('_', ' ').toUpperCase()}
                        </span>

                        <span
                          style={{
                            background: rule.enabled ? '#10b981' : '#6b7280',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          {rule.enabled ? 'ENABLED' : 'DISABLED'}
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          color: '#10b981',
                          fontSize: '14px',
                          fontWeight: 'bold',
                        }}
                      >
                        {rule.effectiveness.toFixed(1)}%
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '11px',
                        }}
                      >
                        Effectiveness
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                        marginBottom: '4px',
                      }}
                    >
                      Trigger Conditions:
                    </div>
                    <div style={{ color: 'white', fontSize: '12px' }}>
                      {rule.condition.timeDelay &&
                        `After ${rule.condition.timeDelay} hours`}
                      {rule.condition.priorities &&
                        ` • Priority: ${rule.condition.priorities.join(', ')}`}
                      {rule.condition.statuses &&
                        ` • Status: ${rule.condition.statuses.join(', ')}`}
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '6px',
                      padding: '8px',
                      fontSize: '12px',
                    }}
                  >
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Action:{' '}
                    </span>
                    <span style={{ color: 'white' }}>
                      Send {rule.action.type} - "
                      {rule.action.message || 'Template message'}"
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Compose Message Modal */}
      {showComposeModal && selectedThread && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1f2937, #111827)',
              borderRadius: '16px',
              padding: '24px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflowY: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: 0,
                }}
              >
                Compose {composeType.toUpperCase()} to{' '}
                {selectedThread.shipperName}
              </h3>
              <button
                onClick={() => setShowComposeModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            {/* Template Selection */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Use Template (Optional)
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value);
                  if (e.target.value) {
                    handleTemplateSelect(e.target.value);
                  }
                }}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '8px',
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                <option value=''>Select a template...</option>
                {templates
                  .filter((t) => t.type === composeType)
                  .map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Subject (for email) */}
            {composeType === 'email' && (
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                    marginBottom: '8px',
                    display: 'block',
                  }}
                >
                  Subject
                </label>
                <input
                  type='text'
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  placeholder='Enter subject...'
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    padding: '8px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
              </div>
            )}

            {/* Message Content */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Message
              </label>
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder={`Enter your ${composeType} message...`}
                rows={composeType === 'sms' ? 4 : 8}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '8px',
                  color: 'white',
                  fontSize: '14px',
                  resize: 'vertical',
                }}
              />
              {composeType === 'sms' && (
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '12px',
                    marginTop: '4px',
                  }}
                >
                  Characters: {messageContent.length}/160
                </div>
              )}
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setShowComposeModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!messageContent.trim()}
                style={{
                  background: messageContent.trim()
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  color: 'white',
                  cursor: messageContent.trim() ? 'pointer' : 'not-allowed',
                  fontWeight: '600',
                }}
              >
                Send {composeType.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Call Modal */}
      {showCallModal && selectedThread && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1f2937, #111827)',
              borderRadius: '16px',
              padding: '24px',
              width: '90%',
              maxWidth: '400px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: 0,
                }}
              >
                Call {selectedThread.shipperName}
              </h3>
              <button
                onClick={() => setShowCallModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            {/* Phone Number */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Phone Number
              </label>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '8px',
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                {selectedThread.shipperContact.phone ||
                  'No phone number available'}
              </div>
            </div>

            {/* Call Script */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                Call Notes/Script (Optional)
              </label>
              <textarea
                value={callScript}
                onChange={(e) => setCallScript(e.target.value)}
                placeholder='Enter call notes or talking points...'
                rows={4}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '8px',
                  color: 'white',
                  fontSize: '14px',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setShowCallModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  selectedThread.shipperContact.phone &&
                  handleMakeCall(selectedThread.shipperContact.phone)
                }
                disabled={!selectedThread.shipperContact.phone}
                style={{
                  background: selectedThread.shipperContact.phone
                    ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  color: 'white',
                  cursor: selectedThread.shipperContact.phone
                    ? 'pointer'
                    : 'not-allowed',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                📞 Make Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
