'use client';

import { useEffect, useRef, useState } from 'react';
import { getCurrentUser } from '../config/access';
import {
  MessageDraft,
  MessagePriority,
  MessageService,
  MessageType,
} from '../services/MessageService';

interface MessageComposerProps {
  isOpen: boolean;
  onClose: () => void;
  replyToMessageId?: string;
  prefilledRecipients?: string[];
  prefilledSubject?: string;
}

interface Recipient {
  id: string;
  name: string;
  role: string;
  type: 'user' | 'department' | 'role';
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  isOpen,
  onClose,
  replyToMessageId,
  prefilledRecipients = [],
  prefilledSubject = '',
}) => {
  const [subject, setSubject] = useState(prefilledSubject);
  const [content, setContent] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [messageType, setMessageType] = useState<MessageType>('direct_message');
  const [priority, setPriority] = useState<MessagePriority>('normal');
  const [requiresAcknowledgment, setRequiresAcknowledgment] = useState(false);
  const [scheduledFor, setScheduledFor] = useState<string>('');
  const [recipientSearch, setRecipientSearch] = useState('');
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  const composerRef = useRef<HTMLDivElement>(null);
  const messageService = new MessageService();
  const { user } = getCurrentUser();

  // Mock recipients data - in production, this would come from user service
  const availableRecipients: Recipient[] = [
    {
      id: 'manager-sarah',
      name: 'Sarah Chen',
      role: 'Operations Manager',
      type: 'user',
    },
    {
      id: 'admin-mike',
      name: 'Mike Johnson',
      role: 'Fleet Administrator',
      type: 'user',
    },
    {
      id: 'dispatcher-tom',
      name: 'Tom Wilson',
      role: 'Lead Dispatcher',
      type: 'user',
    },
    { id: 'hr-jane', name: 'Jane Smith', role: 'HR Manager', type: 'user' },
    {
      id: 'driver-john',
      name: 'John Mitchell',
      role: 'Senior Driver',
      type: 'user',
    },
    {
      id: 'dept-operations',
      name: 'Operations Department',
      role: 'Department',
      type: 'department',
    },
    {
      id: 'dept-dispatch',
      name: 'Dispatch Department',
      role: 'Department',
      type: 'department',
    },
    {
      id: 'dept-maintenance',
      name: 'Maintenance Department',
      role: 'Department',
      type: 'department',
    },
    {
      id: 'role-managers',
      name: 'All Managers',
      role: 'Role Group',
      type: 'role',
    },
    {
      id: 'role-drivers',
      name: 'All Drivers',
      role: 'Role Group',
      type: 'role',
    },
  ];

  // Initialize prefilled recipients
  useEffect(() => {
    if (prefilledRecipients.length > 0) {
      const prefilledRecipientObjects = availableRecipients.filter((r) =>
        prefilledRecipients.includes(r.id)
      );
      setRecipients(prefilledRecipientObjects);
    }
  }, [prefilledRecipients]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        composerRef.current &&
        !composerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Filter recipients based on search
  const filteredRecipients = availableRecipients
    .filter(
      (r) =>
        r.name.toLowerCase().includes(recipientSearch.toLowerCase()) ||
        r.role.toLowerCase().includes(recipientSearch.toLowerCase())
    )
    .filter((r) => !recipients.some((existing) => existing.id === r.id));

  const handleAddRecipient = (recipient: Recipient) => {
    setRecipients((prev) => [...prev, recipient]);
    setRecipientSearch('');
    setShowRecipientDropdown(false);
  };

  const handleRemoveRecipient = (recipientId: string) => {
    setRecipients((prev) => prev.filter((r) => r.id !== recipientId));
  };

  const handleSendMessage = async () => {
    if (
      !user ||
      !subject.trim() ||
      !content.trim() ||
      recipients.length === 0
    ) {
      return;
    }

    setIsSending(true);

    try {
      const toUserIds = recipients
        .filter((r) => r.type === 'user')
        .map((r) => r.id);

      const toDepartments = recipients
        .filter((r) => r.type === 'department')
        .map((r) => r.id);

      const toRoles = recipients
        .filter((r) => r.type === 'role')
        .map((r) => r.id);

      const messageData = {
        subject,
        content,
        fromUserId: user.id || 'current-user',
        fromUserName: user.name || 'Current User',
        fromUserRole: user.role || 'employee',
        toUserIds,
        toDepartments: toDepartments.length > 0 ? toDepartments : undefined,
        toRoles: toRoles.length > 0 ? toRoles : undefined,
        messageType,
        priority,
        hasAttachments: false,
        requiresAcknowledgment,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
        tenantId: 'default',
      };

      const messageId = await messageService.sendMessage(messageData);

      if (messageId) {
        console.info('✅ Message sent successfully:', messageId);
        handleClose();
      } else {
        console.error('❌ Failed to send message');
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!user || !subject.trim()) {
      return;
    }

    setIsDraft(true);

    try {
      const toUserIds = recipients
        .filter((r) => r.type === 'user')
        .map((r) => r.id);

      const toDepartments = recipients
        .filter((r) => r.type === 'department')
        .map((r) => r.id);

      const toRoles = recipients
        .filter((r) => r.type === 'role')
        .map((r) => r.id);

      const draft: MessageDraft = {
        subject,
        content,
        toUserIds,
        toDepartments: toDepartments.length > 0 ? toDepartments : undefined,
        toRoles: toRoles.length > 0 ? toRoles : undefined,
        messageType,
        priority,
        requiresAcknowledgment,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
        userId: user.id || 'current-user',
        updatedAt: new Date(),
      };

      const draftId = await messageService.saveDraft(draft);

      if (draftId) {
        console.info('💾 Draft saved successfully:', draftId);
      }
    } catch (error) {
      console.error('❌ Error saving draft:', error);
    } finally {
      setIsDraft(false);
    }
  };

  const handleClose = () => {
    setSubject('');
    setContent('');
    setRecipients([]);
    setMessageType('direct_message');
    setPriority('normal');
    setRequiresAcknowledgment(false);
    setScheduledFor('');
    setRecipientSearch('');
    setShowRecipientDropdown(false);
    onClose();
  };

  const getMessageTypeIcon = (type: MessageType) => {
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
      default:
        return '💬';
    }
  };

  const getPriorityColor = (priority: MessagePriority) => {
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

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        ref={composerRef}
        style={{
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
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
          <div
            style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            📬 Compose Message
          </div>
          <button
            onClick={handleClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#f3f4f6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              color: '#6b7280',
            }}
          >
            ×
          </button>
        </div>

        {/* Form Content */}
        <div
          style={{
            padding: '24px',
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Message Type & Priority */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px',
                }}
              >
                Message Type
              </label>
              <select
                value={messageType}
                onChange={(e) => setMessageType(e.target.value as MessageType)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                }}
              >
                <option value='direct_message'>💬 Direct Message</option>
                <option value='announcement'>📢 Announcement</option>
                <option value='memo'>📝 Memo</option>
                <option value='department_update'>📊 Department Update</option>
                <option value='urgent_notice'>🚨 Urgent Notice</option>
                <option value='company_wide'>🏢 Company-wide</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px',
                }}
              >
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as MessagePriority)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  color: getPriorityColor(priority),
                }}
              >
                <option value='low'>🔵 Low</option>
                <option value='normal'>⚪ Normal</option>
                <option value='high'>🟠 High</option>
                <option value='urgent'>🔴 Urgent</option>
              </select>
            </div>
          </div>

          {/* Recipients */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px',
              }}
            >
              Recipients
            </label>

            {/* Selected Recipients */}
            {recipients.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '8px',
                }}
              >
                {recipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      backgroundColor: '#eff6ff',
                      borderRadius: '16px',
                      fontSize: '12px',
                      color: '#1e40af',
                    }}
                  >
                    <span>
                      {recipient.type === 'department'
                        ? '🏢'
                        : recipient.type === 'role'
                          ? '👥'
                          : '👤'}
                    </span>
                    <span>{recipient.name}</span>
                    <button
                      onClick={() => handleRemoveRecipient(recipient.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0',
                        marginLeft: '2px',
                        color: '#6b7280',
                        fontSize: '14px',
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Recipient Search */}
            <div style={{ position: 'relative' }}>
              <input
                type='text'
                placeholder='Search users, departments, or roles...'
                value={recipientSearch}
                onChange={(e) => {
                  setRecipientSearch(e.target.value);
                  setShowRecipientDropdown(e.target.value.length > 0);
                }}
                onFocus={() =>
                  setShowRecipientDropdown(recipientSearch.length > 0)
                }
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />

              {/* Recipient Dropdown */}
              {showRecipientDropdown && filteredRecipients.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    marginTop: '4px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {filteredRecipients.map((recipient) => (
                    <div
                      key={recipient.id}
                      onClick={() => handleAddRecipient(recipient)}
                      style={{
                        padding: '12px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>
                        {recipient.type === 'department'
                          ? '🏢'
                          : recipient.type === 'role'
                            ? '👥'
                            : '👤'}
                      </span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '500' }}>
                          {recipient.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {recipient.role}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px',
              }}
            >
              Subject
            </label>
            <input
              type='text'
              placeholder='Enter message subject...'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>

          {/* Message Content */}
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px',
              }}
            >
              Message
            </label>
            <textarea
              placeholder='Type your message here...'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Options */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#374151',
                cursor: 'pointer',
              }}
            >
              <input
                type='checkbox'
                checked={requiresAcknowledgment}
                onChange={(e) => setRequiresAcknowledgment(e.target.checked)}
              />
              Requires acknowledgment
            </label>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px',
                }}
              >
                Schedule for later (optional)
              </label>
              <input
                type='datetime-local'
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '20px 24px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            onClick={handleSaveDraft}
            disabled={isDraft || !subject.trim()}
            style={{
              padding: '8px 16px',
              backgroundColor: isDraft ? '#9ca3af' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: isDraft || !subject.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {isDraft ? '💾 Saving...' : '💾 Save Draft'}
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleClose}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSendMessage}
              disabled={
                isSending ||
                !subject.trim() ||
                !content.trim() ||
                recipients.length === 0
              }
              style={{
                padding: '8px 16px',
                backgroundColor:
                  isSending ||
                  !subject.trim() ||
                  !content.trim() ||
                  recipients.length === 0
                    ? '#9ca3af'
                    : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor:
                  isSending ||
                  !subject.trim() ||
                  !content.trim() ||
                  recipients.length === 0
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              {isSending
                ? '📤 Sending...'
                : `📤 Send ${getMessageTypeIcon(messageType)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;
