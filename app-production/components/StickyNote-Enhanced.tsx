'use client'

import { useState, useEffect } from 'react'

interface StickyNote {
  id: string
  content: string
  section: string
  entityId: string // carrier ID, driver ID, etc.
  entityType: 'driver' | 'carrier' | 'shipper' | 'load' | 'vehicle' | 'broker' | 'dispatcher' | 'general'
  createdBy: string
  createdAt: string
  isShared: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  isNotification: boolean
  isRead: boolean
  assignedTo?: string[] // For targeted notifications
  dueDate?: string // For follow-up tasks
  category: 'note' | 'task' | 'notification' | 'communication' | 'alert'
}

interface StickyNoteProps {
  section: string
  entityId: string
  entityName?: string
  entityType?: 'driver' | 'carrier' | 'shipper' | 'load' | 'vehicle' | 'broker' | 'dispatcher' | 'general'
  showUnreadCount?: boolean
  isNotificationHub?: boolean
}

export default function StickyNote({ 
  section, 
  entityId, 
  entityName, 
  entityType = 'general',
  showUnreadCount = true,
  isNotificationHub = false 
}: StickyNoteProps) {
  // Use a default user when auth is not available
  const user = {
    id: 'guest',
    name: 'Guest User',
    email: 'guest@fleetflowapp.com',
    role: 'Viewer' as const
  }
  
  const [notes, setNotes] = useState<StickyNote[]>([])
  const [newNote, setNewNote] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium')
  const [isShared, setIsShared] = useState(true)
  const [category, setCategory] = useState<'note' | 'task' | 'notification' | 'communication' | 'alert'>('note')
  const [assignedTo, setAssignedTo] = useState<string[]>([])
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'tasks' | 'urgent'>('all')
  
  // Available team members for assignment
  const teamMembers = [
    'dispatch@fleetflowapp.com',
    'operations@fleetflowapp.com', 
    'admin@fleetflowapp.com',
    'john.smith@fleetflowapp.com',
    'sarah.wilson@fleetflowapp.com',
    'mike.johnson@fleetflowapp.com'
  ]

  // Load notes from localStorage (in production, this would be from your backend)
  useEffect(() => {
    const savedNotes = localStorage.getItem(`fleetflow-notes-${section}-${entityId}`)
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [section, entityId])

  const saveNotes = (updatedNotes: StickyNote[]) => {
    setNotes(updatedNotes)
    localStorage.setItem(`fleetflow-notes-${section}-${entityId}`, JSON.stringify(updatedNotes))
  }

  const addNote = () => {
    if (!newNote.trim() || !user) return

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
      category
    }

    const updatedNotes = [note, ...notes]
    saveNotes(updatedNotes)
    setNewNote('')
    setDueDate('')
    setAssignedTo([])
    
    // Reset form
    setPriority('medium')
    setCategory('note')
    setIsShared(true)
  }

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId)
    saveNotes(updatedNotes)
  }

  const markAsRead = (noteId: string) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId ? { ...note, isRead: true } : note
    )
    saveNotes(updatedNotes)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 border-red-400 text-red-900'
      case 'high': return 'bg-orange-100 border-orange-400 text-orange-900'
      case 'medium': return 'bg-yellow-100 border-yellow-400 text-yellow-900'
      case 'low': return 'bg-green-100 border-green-400 text-green-900'
      default: return 'bg-gray-100 border-gray-400 text-gray-900'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'task': return '✅'
      case 'notification': return '🔔'
      case 'communication': return '💬'
      case 'alert': return '⚠️'
      default: return '📝'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'task': return 'bg-blue-100 text-blue-800'
      case 'notification': return 'bg-purple-100 text-purple-800'
      case 'communication': return 'bg-green-100 text-green-800'
      case 'alert': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredNotes = notes.filter(note => {
    switch (filter) {
      case 'unread': return !note.isRead
      case 'tasks': return note.category === 'task'
      case 'urgent': return note.priority === 'urgent'
      default: return true
    }
  })

  const unreadCount = notes.filter(note => !note.isRead).length
  const urgentCount = notes.filter(note => note.priority === 'urgent').length

  return (
    <div className="sticky-note-container">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          style={{
            background: 'linear-gradient(135deg, #fef3c7, #fbbf24)',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid #f59e0b',
            color: '#92400e',
            fontWeight: '600'
          }}
        >
          <span>📋</span>
          {isNotificationHub ? 'Notification Hub' : `Notes ${entityName ? `- ${entityName}` : ''}`}
          
          {/* Notification Badges */}
          <div className="flex items-center gap-1">
            {showUnreadCount && unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
            {urgentCount > 0 && (
              <span className="bg-red-600 text-white text-xs px-1 py-0.5 rounded-full">
                ⚠️ {urgentCount}
              </span>
            )}
            {notes.length > 0 && (
              <span className="bg-yellow-200 text-yellow-800 text-xs px-1.5 py-0.5 rounded-full">
                {notes.length}
              </span>
            )}
          </div>
          
          <svg 
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div 
          className="border rounded-lg p-3 space-y-3"
          style={{
            background: 'linear-gradient(135deg, #fef3c7, #fef3c7)',
            borderColor: '#f59e0b',
            borderWidth: '2px'
          }}
        >
          {/* Filter Tabs */}
          {isNotificationHub && (
            <div className="flex gap-2 mb-3">
              {[
                { key: 'all', label: 'All', icon: '📋' },
                { key: 'unread', label: 'Unread', icon: '🔔', count: unreadCount },
                { key: 'tasks', label: 'Tasks', icon: '✅' },
                { key: 'urgent', label: 'Urgent', icon: '⚠️', count: urgentCount }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                    filter === tab.key 
                      ? 'bg-yellow-600 text-white shadow-sm' 
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                  {tab.count && tab.count > 0 && (
                    <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Add New Note/Notification */}
          <div className="space-y-2 p-2 bg-white rounded-lg border border-yellow-300">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-700">
                {isNotificationHub ? '📢 Create Notification/Note' : '📝 Add Note'}
              </span>
            </div>
            
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder={`Add a ${category} about ${entityName || 'this item'}...`}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              rows={2}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Left Column */}
              <div className="space-y-1">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-yellow-500"
                  >
                    <option value="note">📝 Note</option>
                    <option value="task">✅ Task</option>
                    <option value="notification">🔔 Notification</option>
                    <option value="communication">💬 Communication</option>
                    <option value="alert">⚠️ Alert</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-yellow-500"
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🟠 High Priority</option>
                    <option value="urgent">🔴 Urgent</option>
                  </select>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-1">
                {category === 'task' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="datetime-local"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-yellow-500"
                    />
                  </div>
                )}
                
                <div className="flex items-center gap-2 pt-1">
                  <label className="flex items-center gap-1 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={isShared}
                      onChange={(e) => setIsShared(e.target.checked)}
                      className="text-xs"
                    />
                    📢 Notify team
                  </label>
                  
                  <div className="text-xs text-gray-500">
                    Entity: {entityType}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-1">
              <div className="text-xs text-gray-600">
                {isNotificationHub 
                  ? `Creating ${category} for ${entityType}: ${entityName || entityId}`
                  : `Adding ${category} to ${section}`
                }
              </div>
              
              <button
                onClick={addNote}
                disabled={!newNote.trim()}
                className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {category === 'notification' ? '📢 Send' : '➕ Add'} {category}
              </button>
            </div>
          </div>

          {/* Display Notes */}
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <div className="text-2xl mb-1">📝</div>
                <p className="text-sm">
                  {filter === 'all' ? 'No notes yet. Create one above!' : `No ${filter} items found.`}
                </p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-2 rounded-lg border-l-4 transition-all hover:shadow-md ${
                    note.isRead ? 'bg-white' : 'bg-yellow-50'
                  } ${getPriorityColor(note.priority)}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{getCategoryIcon(note.category)}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(note.category)}`}>
                          {note.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(note.priority)}`}>
                          {note.priority}
                        </span>
                        {!note.isRead && (
                          <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                            NEW
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-800 mb-1 leading-relaxed">{note.content}</p>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
                        <span className="font-medium">{note.createdBy}</span>
                        <span>•</span>
                        <span>{formatDate(note.createdAt)}</span>
                        {note.dueDate && (
                          <>
                            <span>•</span>
                            <span className="text-orange-600 font-medium">Due: {formatDate(note.dueDate)}</span>
                          </>
                        )}
                        {note.isShared && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600">👥 Team</span>
                          </>
                        )}
                        <span>•</span>
                        <span className="capitalize text-purple-600">{note.entityType}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-2">
                      {!note.isRead && (
                        <button
                          onClick={() => markAsRead(note.id)}
                          className="text-green-600 hover:text-green-800 p-1 rounded"
                          title="Mark as read"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded"
                        title="Delete note"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {isNotificationHub && filteredNotes.length > 0 && (
            <div className="flex justify-between items-center pt-2 border-t border-yellow-300">
              <div className="text-xs text-gray-600">
                Showing {filteredNotes.length} of {notes.length} items
              </div>
              <button 
                onClick={() => {
                  const allRead = notes.map(note => ({ ...note, isRead: true }))
                  saveNotes(allRead)
                }}
                className="text-xs text-yellow-700 hover:text-yellow-900 font-medium"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
