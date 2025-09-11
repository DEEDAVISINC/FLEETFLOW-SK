'use client';

import { useEffect, useState } from 'react';

interface StickyNote {
  id: string;
  content: string;
  section: string;
  entityId: string; // carrier ID, driver ID, etc.
  entityType:
    | 'driver'
    | 'carrier'
    | 'shipper'
    | 'load'
    | 'vehicle'
    | 'broker'
    | 'dispatcher'
    | 'general';
  createdBy: string;
  createdAt: string;
  isShared: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isNotification: boolean;
  isRead: boolean;
  assignedTo?: string[]; // For targeted notifications
  dueDate?: string; // For follow-up tasks
  category: 'note' | 'task' | 'notification' | 'communication' | 'alert';
}

interface StickyNoteProps {
  section: string;
  entityId: string;
  entityName?: string;
  entityType?:
    | 'driver'
    | 'carrier'
    | 'shipper'
    | 'load'
    | 'vehicle'
    | 'broker'
    | 'dispatcher'
    | 'general';
  showUnreadCount?: boolean;
  isNotificationHub?: boolean;
}

export default function StickyNote({
  section,
  entityId,
  entityName,
  entityType = 'general',
  showUnreadCount = true,
  isNotificationHub = false,
}: StickyNoteProps) {
  // Use a default user when auth is not available
  const user = {
    id: 'guest',
    name: 'Guest User',
    email: 'guest@fleetflowapp.com',
    role: 'Viewer' as const,
  };

  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [priority, setPriority] = useState<
    'low' | 'medium' | 'high' | 'urgent'
  >('medium');
  const [isShared, setIsShared] = useState(true);
  const [category, setCategory] = useState<
    'note' | 'task' | 'notification' | 'communication' | 'alert'
  >('note');
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState<
    'all' | 'unread' | 'tasks' | 'urgent' | 'today' | 'overdue'
  >('all');
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'category'>(
    'date'
  );
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Available team members and departments for assignment
  const teamMembers = [
    'dispatch@fleetflowapp.com',
    'operations@fleetflowapp.com',
    'admin@fleetflowapp.com',
    'safety@fleetflowapp.com',
    'maintenance@fleetflowapp.com',
    'finance@fleetflowapp.com',
    'john.smith@fleetflowapp.com',
    'sarah.wilson@fleetflowapp.com',
    'mike.johnson@fleetflowapp.com',
    'emily.davis@fleetflowapp.com',
    'alex.rodriguez@fleetflowapp.com',
  ];

  // Department-specific notification templates
  const notificationTemplates = {
    fleet: [
      'Vehicle maintenance required',
      'Fuel level critical',
      'Driver assignment needed',
      'Route optimization alert',
      'Compliance check due',
      'Insurance renewal reminder',
      'DOT inspection scheduled',
      'Performance metrics review',
    ],
    dispatch: [
      'Load assignment pending',
      'Driver availability update',
      'Route delay notification',
      'Customer communication required',
      'Emergency dispatch needed',
      'Load status update',
    ],
    maintenance: [
      'Scheduled maintenance due',
      'Emergency repair needed',
      'Parts order required',
      'Inspection overdue',
      'Service reminder',
    ],
    safety: [
      'Safety violation reported',
      'Training certification due',
      'Accident report filed',
      'Compliance audit scheduled',
    ],
    finance: [
      'Invoice payment due',
      'Expense report submitted',
      'Budget variance alert',
      'Contract renewal notice',
    ],
  };

  // Load notes from localStorage (in production, this would be from your backend)
  useEffect(() => {
    const savedNotes = localStorage.getItem(
      `fleetflow-notes-${section}-${entityId}`
    );
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, [section, entityId]);

  const saveNotes = (updatedNotes: StickyNote[]) => {
    setNotes(updatedNotes);
    localStorage.setItem(
      `fleetflow-notes-${section}-${entityId}`,
      JSON.stringify(updatedNotes)
    );
  };

  const addNote = () => {
    if (!newNote.trim() || !user) return;

    const note: StickyNote = {
      id: Date.now().toString(),
      content: newNote.trim(),
      section,
      entityId,
      entityType,
      createdBy: user.name,
      createdAt: new Date().toISOString(),
      isShared,
      priority,
      isNotification: category === 'notification' || category === 'alert',
      isRead: false,
      assignedTo: isShared ? assignedTo : [],
      dueDate: dueDate || undefined,
      category,
    };

    const updatedNotes = [note, ...notes];
    saveNotes(updatedNotes);
    setNewNote('');
    setDueDate('');
    setAssignedTo([]);

    // Reset form
    setPriority('medium');
    setCategory('note');
    setIsShared(true);
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    saveNotes(updatedNotes);
  };

  const markAsRead = (noteId: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, isRead: true } : note
    );
    saveNotes(updatedNotes);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 border-red-400 text-red-900';
      case 'high':
        return 'bg-orange-100 border-orange-400 text-orange-900';
      case 'medium':
        return 'bg-yellow-100 border-yellow-400 text-yellow-900';
      case 'low':
        return 'bg-green-100 border-green-400 text-green-900';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-900';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'task':
        return '✅';
      case 'notification':
        return '🔔';
      case 'communication':
        return '💬';
      case 'alert':
        return '⚠️';
      default:
        return '📝';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'task':
        return 'bg-blue-100 text-blue-800';
      case 'notification':
        return 'bg-purple-100 text-purple-800';
      case 'communication':
        return 'bg-green-100 text-green-800';
      case 'alert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh || !isNotificationHub) return;

    const interval = setInterval(() => {
      // Simulate receiving new notifications
      // Notification generation will be handled by real notification service
      const shouldAddNotification = false; // Disabled mock notifications
      if (shouldAddNotification && notes.length < 20) {
        const templates =
          notificationTemplates[
            section as keyof typeof notificationTemplates
          ] || notificationTemplates.fleet;
        const randomTemplate = templates[0]; // Use first template instead of random

        const systemNotification: StickyNote = {
          id: Date.now().toString(),
          content: `System Alert: ${randomTemplate}`,
          section,
          entityId,
          entityType,
          createdBy: 'FleetFlow System',
          createdAt: new Date().toISOString(),
          isShared: true,
          priority: 'medium',
          isNotification: true,
          isRead: false,
          category: 'notification',
        };

        const updatedNotes = [systemNotification, ...notes];
        saveNotes(updatedNotes);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [
    autoRefresh,
    isNotificationHub,
    notes.length,
    section,
    entityId,
    entityType,
  ]);

  const filteredNotes = notes
    .filter((note) => {
      // Text search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (
          !note.content.toLowerCase().includes(searchLower) &&
          !note.createdBy.toLowerCase().includes(searchLower) &&
          !note.category.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Category/status filter
      switch (filter) {
        case 'unread':
          return !note.isRead;
        case 'tasks':
          return note.category === 'task';
        case 'urgent':
          return note.priority === 'urgent';
        case 'today':
          const today = new Date().toDateString();
          return new Date(note.createdAt).toDateString() === today;
        case 'overdue':
          if (!note.dueDate) return false;
          return (
            new Date(note.dueDate) < new Date() && note.category === 'task'
          );
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (
            priorityOrder[b.priority as keyof typeof priorityOrder] -
            priorityOrder[a.priority as keyof typeof priorityOrder]
          );
        case 'category':
          return a.category.localeCompare(b.category);
        case 'date':
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  const unreadCount = notes.filter((note) => !note.isRead).length;
  const urgentCount = notes.filter((note) => note.priority === 'urgent').length;
  const todayCount = notes.filter((note) => {
    const today = new Date().toDateString();
    return new Date(note.createdAt).toDateString() === today;
  }).length;
  const overdueCount = notes.filter((note) => {
    if (!note.dueDate) return false;
    return new Date(note.dueDate) < new Date() && note.category === 'task';
  }).length;

  // Generate summary statistics
  const getNotificationSummary = () => {
    const total = notes.length;
    const byCategory = notes.reduce(
      (acc, note) => {
        acc[note.category] = (acc[note.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total,
      unread: unreadCount,
      urgent: urgentCount,
      today: todayCount,
      overdue: overdueCount,
      byCategory,
    };
  };

  return (
    <div className='sticky-note-container'>
      <div className='mb-2 flex items-center justify-between'>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className='flex items-center gap-1 text-xs font-medium text-gray-700 transition-colors hover:text-gray-900'
          style={{
            background: 'linear-gradient(135deg, #fef3c7, #fbbf24)',
            padding: '2px 6px',
            borderRadius: '4px',
            border: '1px solid #f59e0b',
            color: '#92400e',
            fontWeight: '500',
            fontSize: '10px',
          }}
        >
          <span>📋</span>
          {isNotificationHub
            ? 'Notification Hub'
            : `Notes ${entityName ? `- ${entityName}` : ''}`}

          {/* Notification Badges */}
          <div className='flex items-center gap-1'>
            {showUnreadCount && unreadCount > 0 && (
              <span className='rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white'>
                {unreadCount}
              </span>
            )}
            {urgentCount > 0 && (
              <span className='rounded-full bg-red-600 px-1 py-0.5 text-xs text-white'>
                ⚠️ {urgentCount}
              </span>
            )}
            {notes.length > 0 && (
              <span className='rounded-full bg-yellow-200 px-1.5 py-0.5 text-xs text-yellow-800'>
                {notes.length}
              </span>
            )}
          </div>

          <svg
            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 9l-7 7-7-7'
            />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div
          className='space-y-4 rounded-lg border p-4 shadow-lg'
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            minWidth: '400px',
            maxWidth: '500px',
            color: '#ffffff',
          }}
        >
          {/* FleetFlow Header */}
          <div
            className='flex items-center justify-between pb-3'
            style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}
          >
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#ffffff',
                margin: 0,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {isNotificationHub ? '🔔 Notification Hub' : '📝 Notes'}
            </h3>
            {isNotificationHub && (
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  style={{
                    background: autoRefresh
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                  }}
                  title={`Auto-refresh: ${autoRefresh ? 'ON' : 'OFF'}`}
                >
                  {autoRefresh ? '🔄 ON' : '⏸️ OFF'}
                </button>
              </div>
            )}
          </div>

          {/* FleetFlow Stats Cards */}
          {isNotificationHub && notes.length > 0 && (
            <div className='grid grid-cols-4 gap-3'>
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#60a5fa',
                    marginBottom: '4px',
                  }}
                >
                  {notes.length}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Total
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#f87171',
                    marginBottom: '4px',
                  }}
                >
                  {unreadCount}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Unread
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#fbbf24',
                    marginBottom: '4px',
                  }}
                >
                  {urgentCount}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Urgent
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(168, 85, 247, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#c084fc',
                    marginBottom: '4px',
                  }}
                >
                  {todayCount}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Today
                </div>
              </div>
            </div>
          )}

          {/* FleetFlow Filter Tabs */}
          {isNotificationHub && (
            <div className='flex gap-2'>
              {[
                {
                  key: 'all',
                  label: 'All',
                  bg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                },
                {
                  key: 'unread',
                  label: 'Unread',
                  bg: 'linear-gradient(135deg, #ef4444, #dc2626)',
                },
                {
                  key: 'urgent',
                  label: 'Urgent',
                  bg: 'linear-gradient(135deg, #f59e0b, #d97706)',
                },
                {
                  key: 'tasks',
                  label: 'Tasks',
                  bg: 'linear-gradient(135deg, #10b981, #059669)',
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  style={{
                    background:
                      filter === tab.key ? tab.bg : 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* FleetFlow Create Section */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '20px',
            }}
          >
            <div className='mb-3 flex items-center gap-2'>
              <span
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#ffffff',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                {isNotificationHub ? '✏️ Create New' : '📝 Add Note'}
              </span>
            </div>

            <div className='space-y-3'>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={`Write your ${category}...`}
                style={{
                  width: '100%',
                  resize: 'none',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  padding: '12px',
                  fontSize: '14px',
                  color: '#ffffff',
                  outline: 'none',
                }}
                rows={3}
              />

              <div className='flex items-center gap-3'>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  style={{
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    padding: '8px 12px',
                    fontSize: '14px',
                    color: '#ffffff',
                    outline: 'none',
                  }}
                >
                  <option
                    value='note'
                    style={{ background: '#1e293b', color: '#ffffff' }}
                  >
                    📝 Note
                  </option>
                  <option
                    value='task'
                    style={{ background: '#1e293b', color: '#ffffff' }}
                  >
                    ✅ Task
                  </option>
                  <option
                    value='notification'
                    style={{ background: '#1e293b', color: '#ffffff' }}
                  >
                    🔔 Notification
                  </option>
                  <option
                    value='communication'
                    style={{ background: '#1e293b', color: '#ffffff' }}
                  >
                    💬 Communication
                  </option>
                  <option
                    value='alert'
                    style={{ background: '#1e293b', color: '#ffffff' }}
                  >
                    ⚠️ Alert
                  </option>
                </select>

                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  style={{
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    padding: '8px 12px',
                    fontSize: '14px',
                    color: '#ffffff',
                    outline: 'none',
                  }}
                >
                  <option
                    value='low'
                    style={{ background: '#1e293b', color: '#ffffff' }}
                  >
                    🟢 Low
                  </option>
                  <option
                    value='medium'
                    style={{ background: '#1e293b', color: '#ffffff' }}
                  >
                    🟡 Medium
                  </option>
                  <option
                    value='high'
                    style={{ background: '#1e293b', color: '#ffffff' }}
                  >
                    🟠 High
                  </option>
                  <option
                    value='urgent'
                    style={{ background: '#1e293b', color: '#ffffff' }}
                  >
                    🔴 Urgent
                  </option>
                </select>

                {isNotificationHub && (
                  <button
                    type='button'
                    onClick={() => setShowTemplates(!showTemplates)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      padding: '8px 12px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    📝 Templates
                  </button>
                )}

                <button
                  onClick={addNote}
                  disabled={!newNote.trim()}
                  style={{
                    background: !newNote.trim()
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: !newNote.trim() ? 'not-allowed' : 'pointer',
                    opacity: !newNote.trim() ? 0.5 : 1,
                  }}
                >
                  Add {category}
                </button>
              </div>
            </div>

            {/* FleetFlow Templates */}
            {showTemplates && isNotificationHub && (
              <div
                style={{
                  marginTop: '12px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  padding: '16px',
                }}
              >
                <div
                  style={{
                    marginBottom: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#ffffff',
                  }}
                >
                  Quick Templates
                </div>
                <div className='grid grid-cols-1 gap-2'>
                  {(
                    notificationTemplates[
                      section as keyof typeof notificationTemplates
                    ] || notificationTemplates.fleet
                  )
                    .slice(0, 4)
                    .map((template, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setNewNote(template);
                          setShowTemplates(false);
                        }}
                        style={{
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          padding: '8px 12px',
                          textAlign: 'left',
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.9)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            'rgba(59, 130, 246, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background =
                            'rgba(255, 255, 255, 0.1)';
                        }}
                      >
                        {template}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* FleetFlow Notes Display */}
          <div className='max-h-80 space-y-3 overflow-y-auto'>
            {filteredNotes.length === 0 ? (
              <div className='py-8 text-center'>
                <div className='mb-3 text-4xl'>📝</div>
                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '8px',
                  }}
                >
                  {filter === 'all'
                    ? 'No notifications yet'
                    : `No ${filter} items found`}
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  {filter === 'all'
                    ? 'Create your first notification above'
                    : 'Try a different filter or search term'}
                </p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: note.isRead
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(59, 130, 246, 0.15)',
                    backdropFilter: 'blur(10px)',
                    padding: '16px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='mb-2 flex items-center gap-2'>
                        <span className='text-base'>
                          {getCategoryIcon(note.category)}
                        </span>
                        <span
                          style={{
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            padding: '4px 8px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#ffffff',
                          }}
                        >
                          {note.category}
                        </span>
                        {note.priority === 'urgent' && (
                          <span
                            style={{
                              borderRadius: '8px',
                              background: 'rgba(239, 68, 68, 0.3)',
                              padding: '4px 8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#f87171',
                            }}
                          >
                            🔴 Urgent
                          </span>
                        )}
                        {!note.isRead && (
                          <span
                            style={{
                              borderRadius: '8px',
                              background:
                                'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                              padding: '4px 8px',
                              fontSize: '12px',
                              fontWeight: '700',
                              color: '#ffffff',
                            }}
                          >
                            NEW
                          </span>
                        )}
                      </div>

                      <p
                        style={{
                          marginBottom: '8px',
                          fontSize: '14px',
                          lineHeight: '1.5',
                          color: '#ffffff',
                        }}
                      >
                        {note.content}
                      </p>

                      <div
                        className='flex items-center gap-3'
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        <span style={{ fontWeight: '500' }}>
                          {note.createdBy}
                        </span>
                        <span>{formatDate(note.createdAt)}</span>
                        {note.dueDate && (
                          <span
                            style={{
                              fontWeight: '500',
                              color: '#fbbf24',
                            }}
                          >
                            Due: {formatDate(note.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className='ml-3 flex items-center gap-2'>
                      {!note.isRead && (
                        <button
                          onClick={() => markAsRead(note.id)}
                          style={{
                            borderRadius: '8px',
                            background: 'rgba(16, 185, 129, 0.2)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            padding: '6px',
                            color: '#10b981',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                          title='Mark as read'
                        >
                          ✓
                        </button>
                      )}
                      <button
                        onClick={() => deleteNote(note.id)}
                        style={{
                          borderRadius: '8px',
                          background: 'rgba(239, 68, 68, 0.2)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          padding: '6px',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                        title='Delete'
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FleetFlow Bottom Actions */}
          {isNotificationHub && notes.length > 0 && (
            <div
              className='flex items-center justify-between pt-3'
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {filteredNotes.length} of {notes.length} items
              </div>
              <button
                onClick={() => {
                  const allRead = notes.map((note) => ({
                    ...note,
                    isRead: true,
                  }));
                  saveNotes(allRead);
                }}
                style={{
                  background:
                    unreadCount === 0
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(255, 255, 255, 0.1)',
                  color:
                    unreadCount === 0 ? 'rgba(255, 255, 255, 0.4)' : '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: unreadCount === 0 ? 'not-allowed' : 'pointer',
                }}
                disabled={unreadCount === 0}
              >
                Mark all read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
