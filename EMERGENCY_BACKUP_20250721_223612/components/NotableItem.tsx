'use client'

import { useState, useEffect, useRef } from 'react'
import ContextMenu, { Note } from './ContextMenu'
import NoteHoverDisplay from './NoteHoverDisplay'

interface NotableItemProps {
  children: React.ReactNode
  subjectId: string
  subjectType: 'load' | 'driver' | 'broker' | 'dispatcher' | 'call' | 'carrier' | 'customer' | 'vehicle' | 'route'
  subjectLabel: string
  department: string
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
}

// Mock note storage - in a real app, this would come from a database
class NoteStorage {
  private static notes: Note[] = [
    {
      id: 'note-1',
      subjectId: 'LD-2025-001',
      subjectType: 'load',
      title: 'Customer Delivery Instructions',
      content: 'Customer requires delivery between 9 AM - 11 AM. Use rear dock entrance. Contact Jennifer at ext. 205 upon arrival.',
      createdBy: 'Sarah Johnson',
      createdAt: '2025-01-02T09:30:00Z',
      updatedAt: '2025-01-02T09:30:00Z',
      priority: 'high',
      tags: ['delivery', 'customer-request', 'dock'],
      isPrivate: false,
      department: 'dispatch'
    },
    {
      id: 'note-2',
      subjectId: 'LD-2025-001',
      subjectType: 'load',
      title: 'Route Optimization',
      content: 'Consider I-85 instead of I-95 due to construction delays. Should save 45 minutes.',
      createdBy: 'Alex Rodriguez',
      createdAt: '2025-01-02T08:15:00Z',
      updatedAt: '2025-01-02T08:15:00Z',
      priority: 'normal',
      tags: ['route', 'optimization', 'construction'],
      isPrivate: false,
      department: 'broker'
    },
    {
      id: 'note-3',
      subjectId: 'DRV-001',
      subjectType: 'driver',
      title: 'Performance Review',
      content: 'Driver has excellent safety record. Consider for premium loads. Prefers Northeast routes.',
      createdBy: 'Michael Chen',
      createdAt: '2025-01-01T14:20:00Z',
      updatedAt: '2025-01-01T14:20:00Z',
      priority: 'normal',
      tags: ['performance', 'safety', 'preferences'],
      isPrivate: true,
      department: 'admin'
    },
    {
      id: 'note-4',
      subjectId: 'CALL-2025-001',
      subjectType: 'call',
      title: 'Customer Complaint',
      content: 'Customer complained about late delivery. Promised discount on next shipment. Follow up required.',
      createdBy: 'Jennifer Williams',
      createdAt: '2025-01-01T16:45:00Z',
      updatedAt: '2025-01-01T16:45:00Z',
      priority: 'urgent',
      tags: ['complaint', 'discount', 'follow-up'],
      isPrivate: false,
      department: 'broker'
    }
  ]

  static getNotesForSubject(subjectId: string, subjectType: string): Note[] {
    return this.notes.filter(note => 
      note.subjectId === subjectId && note.subjectType === subjectType
    )
  }

  static addNote(note: Note): void {
    this.notes.push(note)
  }

  static updateNote(noteId: string, updates: Partial<Note>): void {
    const index = this.notes.findIndex(note => note.id === noteId)
    if (index !== -1) {
      this.notes[index] = { ...this.notes[index], ...updates }
    }
  }

  static deleteNote(noteId: string): void {
    this.notes = this.notes.filter(note => note.id !== noteId)
  }

  static getAllNotes(): Note[] {
    return this.notes
  }
}

export default function NotableItem({
  children,
  subjectId,
  subjectType,
  subjectLabel,
  department,
  className = '',
  style = {},
  disabled = false
}: NotableItemProps) {
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    visible: boolean
  }>({ x: 0, y: 0, visible: false })
  
  const [notes, setNotes] = useState<Note[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Load notes for this subject
  useEffect(() => {
    const subjectNotes = NoteStorage.getNotesForSubject(subjectId, subjectType)
    setNotes(subjectNotes)
  }, [subjectId, subjectType])

  // Handle right-click context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    if (disabled) return

    e.preventDefault()
    e.stopPropagation()

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    // Calculate optimal position for context menu
    const x = Math.min(e.clientX, window.innerWidth - 250)
    const y = Math.min(e.clientY, window.innerHeight - 400)

    setContextMenu({
      x,
      y,
      visible: true
    })
  }

  // Handle saving a note
  const handleSaveNote = (noteData: Partial<Note>) => {
    const fullNote: Note = {
      id: noteData.id || `note-${Date.now()}`,
      subjectId,
      subjectType,
      title: noteData.title || '',
      content: noteData.content || '',
      createdBy: noteData.createdBy || 'Current User',
      createdAt: noteData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: noteData.priority || 'normal',
      tags: noteData.tags || [],
      isPrivate: noteData.isPrivate || false,
      department
    }

    if (notes.some(n => n.id === fullNote.id)) {
      // Update existing note
      NoteStorage.updateNote(fullNote.id, fullNote)
    } else {
      // Add new note
      NoteStorage.addNote(fullNote)
    }

    // Refresh notes
    const updatedNotes = NoteStorage.getNotesForSubject(subjectId, subjectType)
    setNotes(updatedNotes)
  }

  // Handle closing context menu
  const handleCloseContextMenu = () => {
    setContextMenu({ x: 0, y: 0, visible: false })
  }

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenu.visible && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleCloseContextMenu()
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && contextMenu.visible) {
        handleCloseContextMenu()
      }
    }

    if (contextMenu.visible) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [contextMenu.visible])

  return (
    <>
      <div
        ref={containerRef}
        className={className}
        style={{
          ...style,
          cursor: disabled ? 'default' : 'context-menu'
        }}
        onContextMenu={handleContextMenu}
      >
        <NoteHoverDisplay
          subjectId={subjectId}
          subjectType={subjectType}
          subjectLabel={subjectLabel}
          notes={notes}
        >
          {children}
        </NoteHoverDisplay>
      </div>

      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleCloseContextMenu}
          subjectId={subjectId}
          subjectType={subjectType}
          subjectLabel={subjectLabel}
          department={department}
          existingNotes={notes}
        />
      )}
    </>
  )
}

// Hook for accessing note storage in other components
export const useNoteStorage = () => {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    setNotes(NoteStorage.getAllNotes())
  }, [])

  const refreshNotes = () => {
    setNotes(NoteStorage.getAllNotes())
  }

  const getNotesForSubject = (subjectId: string, subjectType: string) => {
    return NoteStorage.getNotesForSubject(subjectId, subjectType)
  }

  const addNote = (note: Note) => {
    NoteStorage.addNote(note)
    refreshNotes()
  }

  const updateNote = (noteId: string, updates: Partial<Note>) => {
    NoteStorage.updateNote(noteId, updates)
    refreshNotes()
  }

  const deleteNote = (noteId: string) => {
    NoteStorage.deleteNote(noteId)
    refreshNotes()
  }

  return {
    notes,
    refreshNotes,
    getNotesForSubject,
    addNote,
    updateNote,
    deleteNote
  }
}

// Export types
export type { Note }
export { NoteStorage } 