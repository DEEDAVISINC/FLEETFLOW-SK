'use client';

import { useEffect, useState } from 'react';
import MessageComposer from '../components/MessageComposer';
import { getCurrentUser } from '../config/access';
import {
  IntraofficeMessage,
  MessageFilters,
  MessageService,
} from '../services/MessageService';

interface MessageCenterTab {
  id: 'inbox' | 'sent' | 'drafts' | 'archived';
  label: string;
  icon: string;
}

export default function MessageCenter() {
  const [activeTab, setActiveTab] = useState<
    'inbox' | 'sent' | 'drafts' | 'archived'
  >('inbox');
  const [messages, setMessages] = useState<IntraofficeMessage[]>([]);
  const [selectedMessage, setSelectedMessage] =
    useState<IntraofficeMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const messageService = new MessageService();
  const { user } = getCurrentUser();

  const tabs: MessageCenterTab[] = [
    { id: 'inbox', label: 'Inbox', icon: '📥' },
    { id: 'sent', label: 'Sent', icon: '📤' },
    { id: 'drafts', label: 'Drafts', icon: '📝' },
    { id: 'archived', label: 'Archived', icon: '🗄️' },
  ];

  // Load messages based on active tab
  useEffect(() => {
    const loadMessages = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const filters: MessageFilters = {};

        // Apply filters based on active tab
        switch (activeTab) {
          case 'inbox':
            // Show messages TO this user (excluding sent by this user)
            break;
          case 'sent':
            filters.fromUserId = user.id;
            break;
          case 'drafts':
            // Handle drafts separately
            setMessages([]);
            setLoading(false);
            return;
          case 'archived':
            filters.status = 'archived';
            break;
        }

        // Apply additional filters
        if (filterType !== 'all') {
          filters.messageType = filterType as any;
        }
        if (filterPriority !== 'all') {
          filters.priority = filterPriority as any;
        }
        if (searchQuery.trim()) {
          filters.searchQuery = searchQuery;
        }

        const result = await messageService.getUserMessages(
          user.id,
          filters,
          50
        );

        if (result.messages) {
          // Filter inbox to exclude messages sent by current user
          let filteredMessages = result.messages;
          if (activeTab === 'inbox') {
            filteredMessages = result.messages.filter(
              (msg) => msg.fromUserId !== user.id
            );
          }
          setMessages(filteredMessages);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [activeTab, filterType, filterPriority, searchQuery, user?.id]);

  const handleMessageClick = (message: IntraofficeMessage) => {
    setSelectedMessage(message);

    // Mark as read if it's unread and in inbox
    if (!message.isRead && activeTab === 'inbox') {
      messageService.markMessageAsRead(message.id!, user?.id || '');
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, isRead: true } : m))
      );
    }
  };

  const handleReply = (message: IntraofficeMessage) => {
    // Open composer with reply prefilled
    setComposerOpen(true);
    // TODO: Implement reply prefilling
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'direct_message':
        return '💬';
      case 'announcement':
        return '📢';
      case 'memo':
        return '📝';
      case 'urgent_notice':
        return '🚨';
      case 'department_update':
        return '📊';
      case 'company_wide':
        return '🏢';
      case 'reply':
        return '↩️';
      default:
        return '📧';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#ef4444';
      case 'high':
        return '#f97316';
      case 'normal':
        return '#3b82f6';
      case 'low':
        return '#6b7280';
      default:
        return '#3b82f6';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080)
      return `${Math.floor(diffInMinutes / 1440)}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        padding: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          height: 'calc(100vh - 40px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#111827',
                margin: '0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              📬 Message Center
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '4px 0 0 0',
              }}
            >
              Internal communications and announcements
            </p>
          </div>

          <button
            onClick={() => setComposerOpen(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            ✏️ Compose Message
          </button>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Sidebar */}
          <div
            style={{
              width: '300px',
              borderRight: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Navigation Tabs */}
            <div style={{ padding: '20px' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    marginBottom: '8px',
                    backgroundColor:
                      activeTab === tab.id ? '#eff6ff' : 'transparent',
                    color: activeTab === tab.id ? '#1e40af' : '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: activeTab === tab.id ? '600' : '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{tab.icon}</span>
                  {tab.label}
                  {tab.id === 'inbox' &&
                    messages.filter((m) => !m.isRead).length > 0 && (
                      <span
                        style={{
                          marginLeft: 'auto',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {messages.filter((m) => !m.isRead).length}
                      </span>
                    )}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div
              style={{ padding: '0 20px 20px', borderTop: '1px solid #e5e7eb' }}
            >
              <div
                style={{
                  margin: '16px 0 8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Filters
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  marginBottom: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '13px',
                  backgroundColor: 'white',
                }}
              >
                <option value='all'>All Types</option>
                <option value='direct_message'>Direct Messages</option>
                <option value='announcement'>Announcements</option>
                <option value='memo'>Memos</option>
                <option value='urgent_notice'>Urgent Notices</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '13px',
                  backgroundColor: 'white',
                }}
              >
                <option value='all'>All Priorities</option>
                <option value='urgent'>🔴 Urgent</option>
                <option value='high'>🟠 High</option>
                <option value='normal'>⚪ Normal</option>
                <option value='low'>🔵 Low</option>
              </select>
            </div>
          </div>

          {/* Messages List */}
          <div
            style={{
              width: '400px',
              borderRight: '1px solid #e5e7eb',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Search */}
            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <input
                type='text'
                placeholder='Search messages...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Message List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loading ? (
                <div
                  style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: '#6b7280',
                  }}
                >
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div
                  style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: '#6b7280',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                    📪
                  </div>
                  <div>No messages found</div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => handleMessageClick(message)}
                    style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      backgroundColor:
                        selectedMessage?.id === message.id
                          ? '#eff6ff'
                          : message.isRead
                            ? 'white'
                            : '#fef7e0',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedMessage?.id !== message.id) {
                        e.currentTarget.style.backgroundColor = message.isRead
                          ? '#f9fafb'
                          : '#fde68a';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedMessage?.id !== message.id) {
                        e.currentTarget.style.backgroundColor = message.isRead
                          ? 'white'
                          : '#fef7e0';
                      }
                    }}
                  >
                    {/* Unread indicator */}
                    {!message.isRead && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          backgroundColor: getPriorityColor(message.priority),
                        }}
                      />
                    )}

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ fontSize: '14px' }}>
                        {getMessageTypeIcon(message.messageType)}
                      </span>
                      <span
                        style={{
                          fontSize: '13px',
                          color: '#6b7280',
                          fontWeight: '500',
                        }}
                      >
                        {activeTab === 'sent'
                          ? `To: ${message.toUserIds.length} recipients`
                          : message.fromUserName}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#9ca3af',
                          marginLeft: 'auto',
                        }}
                      >
                        {formatTimestamp(message.createdAt)}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: message.isRead ? 'normal' : '600',
                        color: '#111827',
                        marginBottom: '4px',
                        lineHeight: '1.4',
                      }}
                    >
                      {message.subject}
                    </div>

                    <div
                      style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        lineHeight: '1.4',
                      }}
                    >
                      {message.content.length > 60
                        ? `${message.content.substring(0, 60)}...`
                        : message.content}
                    </div>

                    {message.priority === 'urgent' && (
                      <div
                        style={{
                          marginTop: '6px',
                          fontSize: '11px',
                          color: '#ef4444',
                          fontWeight: '600',
                        }}
                      >
                        🚨 URGENT
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {selectedMessage ? (
              <>
                {/* Message Header */}
                <div
                  style={{
                    padding: '24px',
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>
                      {getMessageTypeIcon(selectedMessage.messageType)}
                    </span>
                    <h2
                      style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#111827',
                        margin: '0',
                        flex: 1,
                      }}
                    >
                      {selectedMessage.subject}
                    </h2>
                    <div
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: 'white',
                        backgroundColor: getPriorityColor(
                          selectedMessage.priority
                        ),
                      }}
                    >
                      {selectedMessage.priority.toUpperCase()}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      fontSize: '14px',
                      color: '#6b7280',
                    }}
                  >
                    <span>
                      <strong>From:</strong> {selectedMessage.fromUserName} (
                      {selectedMessage.fromUserRole})
                    </span>
                    <span>
                      <strong>Date:</strong>{' '}
                      {selectedMessage.createdAt.toLocaleString()}
                    </span>
                  </div>

                  {selectedMessage.requiresAcknowledgment && (
                    <div
                      style={{
                        marginTop: '12px',
                        padding: '8px 12px',
                        backgroundColor: '#fef3c7',
                        borderRadius: '6px',
                        fontSize: '13px',
                        color: '#92400e',
                      }}
                    >
                      ⚠️ This message requires acknowledgment
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div
                  style={{
                    flex: 1,
                    padding: '24px',
                    overflowY: 'auto',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: '#374151',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {selectedMessage.content}
                  </div>
                </div>

                {/* Message Actions */}
                <div
                  style={{
                    padding: '20px 24px',
                    borderTop: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb',
                    display: 'flex',
                    gap: '12px',
                  }}
                >
                  <button
                    onClick={() => handleReply(selectedMessage)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    ↩️ Reply
                  </button>

                  {selectedMessage.requiresAcknowledgment && (
                    <button
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer',
                      }}
                    >
                      ✅ Acknowledge
                    </button>
                  )}

                  <button
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    🗄️ Archive
                  </button>
                </div>
              </>
            ) : (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280',
                  fontSize: '16px',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    📬
                  </div>
                  <div>Select a message to read</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Composer */}
      <MessageComposer
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
      />
    </div>
  );
}
