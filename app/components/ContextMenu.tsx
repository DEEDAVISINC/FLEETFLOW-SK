'use client'

import { useEffect, useRef, useState } from 'react'

// Note interface
interface Note {
  id: string
  subjectId: string
  subjectType: 'load' | 'driver' | 'broker' | 'dispatcher' | 'call' | 'carrier' | 'customer' | 'vehicle' | 'route'
  title: string
  content: string
  createdBy: string
  createdAt: string
  updatedAt: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  tags: string[]
  isPrivate: boolean
  department: string
}

// Context menu props
interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
  subjectId: string
  subjectType: 'load' | 'driver' | 'broker' | 'dispatcher' | 'call' | 'carrier' | 'customer' | 'vehicle' | 'route'
  subjectLabel: string
  department: string
  existingNotes?: Note[]
}

// Note creation modal props
interface NoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (note: Partial<Note>) => void
  subjectId: string
  subjectType: string
  subjectLabel: string
  department: string
  editingNote?: Note
}

// Note creation modal component
function NoteModal({ isOpen, onClose, onSave, subjectId, subjectType, subjectLabel, department, editingNote }: NoteModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [priority, setPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal')
  const [tags, setTags] = useState<string[]>([])
  const [isPrivate, setIsPrivate] = useState(false)
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title)
      setContent(editingNote.content)
      setPriority(editingNote.priority)
      setTags(editingNote.tags)
      setIsPrivate(editingNote.isPrivate)
    } else {
      setTitle('')
      setContent('')
      setPriority('normal')
      setTags([])
      setIsPrivate(false)
    }
  }, [editingNote, isOpen])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSave = () => {
    if (!title.trim()) return

    const noteData: Partial<Note> = {
      id: editingNote?.id || `note-${Date.now()}`,
      subjectId,
      subjectType: subjectType as any,
      title: title.trim(),
      content: content.trim(),
      priority,
      tags,
      isPrivate,
      department,
      createdBy: 'Current User', // This would come from auth context
      createdAt: editingNote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    onSave(noteData)
    onClose()
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: '#6b7280',
      normal: '#3b82f6',
      high: '#f59e0b',
      urgent: '#ef4444'
    }
    return colors[priority as keyof typeof colors] || '#3b82f6'
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1e293b'
          }}>
            {editingNote ? 'Edit Note' : 'Create Note'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#64748b',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        <div style={{
          background: '#f8fafc',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
            <strong>Subject:</strong> {subjectLabel} ({subjectType})
          </div>
          <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
            <strong>Department:</strong> {department}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#374151'
          }}>
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title..."
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#374151'
          }}>
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter note content..."
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '32px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                style={{ transform: 'scale(1.2)' }}
              />
              <span style={{ fontWeight: '600', color: '#374151' }}>
                Private Note
              </span>
            </label>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#374151'
          }}>
            Tags
          </label>
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <input
              type="text""
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tag...""
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.9rem'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
            />
            <button
              onClick={handleAddTag}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Add
            </button>
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px'
          }}>
            {tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  background: '#e5e7eb',
                  color: '#374151',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    padding: '0 2px'
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          paddingTop: '16px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <button
            onClick={onClose}
            style={{
              background: '#f3f4f6',
              color: '#374151',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            style={{
              background: title.trim() ? getPriorityColor(priority) : '#d1d5db',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: title.trim() ? 'pointer' : 'not-allowed',
              fontSize: '0.9rem'
            }}
          >
            {editingNote ? 'Update Note' : 'Create Note'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Main context menu component
export default function ContextMenu({ x, y, onClose, subjectId, subjectType, subjectLabel, department, existingNotes = [] }: ContextMenuProps) {
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | undefined>()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [onClose])

  const handleCreateNote = () => {
    setEditingNote(undefined)
    setShowNoteModal(true)
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setShowNoteModal(true)
  }

  const handleSaveNote = (noteData: Partial<Note>) => {
    // In a real app, this would save to database
    console.info('Saving note:', noteData)
    // Here you would typically call an API to save the note
    // For now, we'll just log it and close the modal
    setShowNoteModal(false)
  }

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      // In a real app, this would delete from database
      console.info('Deleting note:', noteId)
    }
  }

  return (
    <>
      <div
        ref={menuRef}
        style={{
          position: 'fixed',
          top: y,
          left: x,
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          border: '1px solid #e5e7eb',
          zIndex: 10000,
          minWidth: '200px',
          padding: '8px 0'
        }}
      >
        <div style={{
          padding: '8px 16px',
          fontSize: '0.9rem',
          fontWeight: '600',
          color: '#6b7280',
          borderBottom: '1px solid #e5e7eb'
        }}>
          {subjectLabel} ({subjectType})
        </div>

        <button
          onClick={handleCreateNote}
          style={{
            width: '100%',
            padding: '10px 16px',
            border: 'none',
            background: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            fontSize: '0.9rem',
            color: '#374151',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f3f4f6'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none'
          }}
        >
          📝 Create Note
        </button>

        {existingNotes.length > 0 && (
          <>
            <div style={{
              padding: '8px 16px',
              fontSize: '0.8rem',
              fontWeight: '600',
              color: '#6b7280',
              borderTop: '1px solid #e5e7eb',
              marginTop: '4px'
            }}>
              Existing Notes ({existingNotes.length})
            </div>
            {existingNotes.slice(0, 3).map((note) => (
              <div
                key={note.id}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.8rem',
                  color: '#374151',
                  borderBottom: '1px solid #f3f4f6'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: '500', flex: 1 }}>{note.title}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => handleEditNote(note)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#3b82f6',
                        fontSize: '0.8rem'
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#ef4444',
                        fontSize: '0.8rem'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: '#6b7280',
                  marginTop: '2px'
                }}>
                  {note.content.substring(0, 40)}...
                </div>
              </div>
            ))}
            {existingNotes.length > 3 && (
              <div style={{
                padding: '8px 16px',
                fontSize: '0.8rem',
                color: '#6b7280',
                textAlign: 'center'
              }}>
                +{existingNotes.length - 3} more notes
              </div>
            )}
          </>
        )}

        <div style={{
          borderTop: '1px solid #e5e7eb',
          marginTop: '4px'
        }}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '8px 16px',
              border: 'none',
              background: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '0.9rem',
              color: '#6b7280'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f3f4f6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none'
            }}
          >
            Close
          </button>
        </div>
      </div>

      <NoteModal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        onSave={handleSaveNote}
        subjectId={subjectId}
        subjectType={subjectType}
        subjectLabel={subjectLabel}
        department={department}
        editingNote={editingNote}
      />
    </>
  )
}

// Export types for use in other components
export type { ContextMenuProps, Note }
