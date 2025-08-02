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
    email: 'guest@fleetflow.com',
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
  const [filter, setFilter] = useState<'all' | 'unread' | 'tasks' | 'urgent'>(
    'all'
  );

  // Available team members for assignment
  const teamMembers = [
    'dispatch@fleetflow.com',
    'operations@fleetflow.com',
    'admin@fleetflow.com',
    'john.smith@fleetflow.com',
    'sarah.wilson@fleetflow.com',
    'mike.johnson@fleetflow.com',
  ];

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

  const filteredNotes = notes.filter((note) => {
    switch (filter) {
      case 'unread':
        return !note.isRead;
      case 'tasks':
        return note.category === 'task';
      case 'urgent':
        return note.priority === 'urgent';
      default:
        return true;
    }
  });

  const unreadCount = notes.filter((note) => !note.isRead).length;
  const urgentCount = notes.filter((note) => note.priority === 'urgent').length;

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
          className='space-y-3 rounded-lg border p-3'
          style={{
            background: 'linear-gradient(135deg, #fef3c7, #fef3c7)',
            borderColor: '#f59e0b',
            borderWidth: '2px',
          }}
        >
          {/* Filter Tabs */}
          {isNotificationHub && (
            <div className='mb-3 flex gap-2'>
              {[
                { key: 'all', label: 'All', icon: '📋' },
                {
                  key: 'unread',
                  label: 'Unread',
                  icon: '🔔',
                  count: unreadCount,
                },
                { key: 'tasks', label: 'Tasks', icon: '✅' },
                {
                  key: 'urgent',
                  label: 'Urgent',
                  icon: '⚠️',
                  count: urgentCount,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`flex items-center gap-1 rounded-md px-3 py-1 text-xs font-medium transition-all ${
                    filter === tab.key
                      ? 'bg-yellow-600 text-white shadow-sm'
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                  {tab.count && tab.count > 0 && (
                    <span className='rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white'>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Add New Note/Notification */}
          <div className='space-y-2 rounded-lg border border-yellow-300 bg-white p-2'>
            <div className='mb-1 flex items-center gap-2'>
              <span className='text-sm font-semibold text-gray-700'>
                {isNotificationHub
                  ? '📢 Create Notification/Note'
                  : '📝 Add Note'}
              </span>
            </div>

            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={`Add a ${category} about ${entityName || 'this item'}...`}
              className='w-full resize-none rounded-lg border border-gray-300 p-2 text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500'
              rows={2}
            />

            <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
              {/* Left Column */}
              <div className='space-y-1'>
                <div>
                  <label className='mb-1 block text-xs font-medium text-gray-700'>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className='w-full rounded border border-gray-300 px-2 py-1 text-xs focus:ring-1 focus:ring-yellow-500'
                  >
                    <option value='note'>📝 Note</option>
                    <option value='task'>✅ Task</option>
                    <option value='notification'>🔔 Notification</option>
                    <option value='communication'>💬 Communication</option>
                    <option value='alert'>⚠️ Alert</option>
                  </select>
                </div>

                <div>
                  <label className='mb-1 block text-xs font-medium text-gray-700'>
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className='w-full rounded border border-gray-300 px-2 py-1 text-xs focus:ring-1 focus:ring-yellow-500'
                  >
                    <option value='low'>🟢 Low Priority</option>
                    <option value='medium'>🟡 Medium Priority</option>
                    <option value='high'>🟠 High Priority</option>
                    <option value='urgent'>🔴 Urgent</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className='space-y-1'>
                {category === 'task' && (
                  <div>
                    <label className='mb-1 block text-xs font-medium text-gray-700'>
                      Due Date
                    </label>
                    <input
                      type='datetime-local'
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className='w-full rounded border border-gray-300 px-2 py-1 text-xs focus:ring-1 focus:ring-yellow-500'
                    />
                  </div>
                )}

                <div className='flex items-center gap-2 pt-1'>
                  <label className='flex items-center gap-1 text-xs text-gray-600'>
                    <input
                      type='checkbox'
                      checked={isShared}
                      onChange={(e) => setIsShared(e.target.checked)}
                      className='text-xs'
                    />
                    📢 Notify team
                  </label>

                  <div className='text-xs text-gray-500'>
                    Entity: {entityType}
                  </div>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-between pt-1'>
              <div className='text-xs text-gray-600'>
                {isNotificationHub
                  ? `Creating ${category} for ${entityType}: ${entityName || entityId}`
                  : `Adding ${category} to ${section}`}
              </div>

              <button
                onClick={addNote}
                disabled={!newNote.trim()}
                className='rounded-lg bg-yellow-500 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-yellow-600 disabled:cursor-not-allowed disabled:bg-gray-300'
              >
                {category === 'notification' ? '📢 Send' : '➕ Add'} {category}
              </button>
            </div>
          </div>

          {/* Display Notes */}
          <div className='max-h-48 space-y-3 overflow-y-auto'>
            {filteredNotes.length === 0 ? (
              <div className='py-4 text-center text-gray-500'>
                <div className='mb-1 text-2xl'>📝</div>
                <p className='text-sm'>
                  {filter === 'all'
                    ? 'No notes yet. Create one above!'
                    : `No ${filter} items found.`}
                </p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`rounded-lg border-l-4 p-2 transition-all hover:shadow-md ${
                    note.isRead ? 'bg-white' : 'bg-yellow-50'
                  } ${getPriorityColor(note.priority)}`}
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='mb-1 flex items-center gap-2'>
                        <span className='text-sm'>
                          {getCategoryIcon(note.category)}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${getCategoryColor(note.category)}`}
                        >
                          {note.category}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityColor(note.priority)}`}
                        >
                          {note.priority}
                        </span>
                        {!note.isRead && (
                          <span className='rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white'>
                            NEW
                          </span>
                        )}
                      </div>

                      <p className='mb-1 text-sm leading-relaxed text-gray-800'>
                        {note.content}
                      </p>

                      <div className='flex flex-wrap items-center gap-2 text-xs text-gray-600'>
                        <span className='font-medium'>{note.createdBy}</span>
                        <span>•</span>
                        <span>{formatDate(note.createdAt)}</span>
                        {note.dueDate && (
                          <>
                            <span>•</span>
                            <span className='font-medium text-orange-600'>
                              Due: {formatDate(note.dueDate)}
                            </span>
                          </>
                        )}
                        {note.isShared && (
                          <>
                            <span>•</span>
                            <span className='text-blue-600'>👥 Team</span>
                          </>
                        )}
                        <span>•</span>
                        <span className='text-purple-600 capitalize'>
                          {note.entityType}
                        </span>
                      </div>
                    </div>

                    <div className='ml-2 flex items-center gap-1'>
                      {!note.isRead && (
                        <button
                          onClick={() => markAsRead(note.id)}
                          className='rounded p-1 text-green-600 hover:text-green-800'
                          title='Mark as read'
                        >
                          <svg
                            className='h-3 w-3'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M5 13l4 4L19 7'
                            />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => deleteNote(note.id)}
                        className='rounded p-1 text-red-500 hover:text-red-700'
                        title='Delete note'
                      >
                        <svg
                          className='h-3 w-3'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {isNotificationHub && filteredNotes.length > 0 && (
            <div className='flex items-center justify-between border-t border-yellow-300 pt-2'>
              <div className='text-xs text-gray-600'>
                Showing {filteredNotes.length} of {notes.length} items
              </div>
              <button
                onClick={() => {
                  const allRead = notes.map((note) => ({
                    ...note,
                    isRead: true,
                  }));
                  saveNotes(allRead);
                }}
                className='text-xs font-medium text-yellow-700 hover:text-yellow-900'
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
