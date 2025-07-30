'use client'

import { useState, useEffect, useRef } from 'react'
import { Note } from './ContextMenu'

interface NoteHoverDisplayProps {
  children: React.ReactNode
  subjectId: string
  subjectType: 'load' | 'driver' | 'broker' | 'dispatcher' | 'call' | 'carrier' | 'customer' | 'vehicle' | 'route'
  subjectLabel: string
  notes: Note[]
  showDelay?: number
  hideDelay?: number
}

export default function NoteHoverDisplay({
  children,
  subjectId,
  subjectType,
  subjectLabel,
  notes,
  showDelay = 800,
  hideDelay = 200
}: NoteHoverDisplayProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout)
    if (notes.length > 0) {
      const timeout = setTimeout(() => setIsVisible(true), showDelay)
      setHoverTimeout(timeout)
    }
  }

  const handleMouseLeave = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout)
    const timeout = setTimeout(() => setIsVisible(false), hideDelay)
    setHoverTimeout(timeout)
  }

  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout)
    }
  }, [hoverTimeout])

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: '#6b7280',
      normal: '#3b82f6',
      high: '#f59e0b',
      urgent: '#ef4444'
    }
    return colors[priority as keyof typeof colors] || '#3b82f6'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // If no notes, just render children without hover functionality
  if (notes.length === 0) {
    return <>{children}</>
  }

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {/* Note indicator */}
      {notes.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          right: '-2px',
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: notes.some(n => n.priority === 'urgent') ? '#ef4444' : 
                     notes.some(n => n.priority === 'high') ? '#f59e0b' : '#3b82f6',
          border: '2px solid white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.6rem',
          color: 'white',
          fontWeight: 'bold',
          zIndex: 1
        }}>
          {notes.length > 9 ? '9+' : notes.length}
        </div>
      )}

      {/* Hover tooltip */}
      {isVisible && notes.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e5e7eb',
          zIndex: 10000,
          width: '350px',
          maxHeight: '400px',
          overflowY: 'auto',
          marginTop: '8px'
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #e5e7eb',
            background: '#f8fafc',
            borderRadius: '12px 12px 0 0'
          }}>
            <div style={{
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '4px'
            }}>
              📝 Notes for {subjectLabel}
            </div>
            <div style={{
              fontSize: '0.8rem',
              color: '#64748b'
            }}>
              {subjectType} • {notes.length} note{notes.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Notes list */}
          <div style={{ padding: '8px 0' }}>
            {notes.slice(0, 5).map((note, index) => (
              <div key={note.id} style={{
                padding: '12px 16px',
                borderBottom: index < Math.min(notes.length, 5) - 1 ? '1px solid #f1f5f9' : 'none'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '6px'
                }}>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#1e293b',
                    flex: 1,
                    marginRight: '8px'
                  }}>
                    {note.title}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {/* Priority indicator */}
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: getPriorityColor(note.priority)
                    }} />
                    {/* Private indicator */}
                    {note.isPrivate && (
                      <div style={{
                        fontSize: '0.7rem',
                        color: '#6b7280'
                      }}>
                        🔒
                      </div>
                    )}
                  </div>
                </div>

                {/* Note content */}
                {note.content && (
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#64748b',
                    marginBottom: '6px',
                    lineHeight: '1.4'
                  }}>
                    {note.content.length > 100 ? 
                      note.content.substring(0, 100) + '...' : 
                      note.content
                    }
                  </div>
                )}

                {/* Tags */}
                {note.tags.length > 0 && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px',
                    marginBottom: '6px'
                  }}>
                    {note.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span key={tagIndex} style={{
                        background: '#e5e7eb',
                        color: '#374151',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '0.7rem',
                        fontWeight: '500'
                      }}>
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span style={{
                        color: '#6b7280',
                        fontSize: '0.7rem'
                      }}>
                        +{note.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Meta information */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.7rem',
                  color: '#94a3b8'
                }}>
                  <div>
                    By {note.createdBy}
                  </div>
                  <div>
                    {formatDate(note.createdAt)}
                  </div>
                </div>
              </div>
            ))}

            {/* Show more indicator */}
            {notes.length > 5 && (
              <div style={{
                padding: '8px 16px',
                textAlign: 'center',
                fontSize: '0.8rem',
                color: '#6b7280',
                borderTop: '1px solid #f1f5f9'
              }}>
                +{notes.length - 5} more notes • Right-click to view all
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '8px 16px',
            borderTop: '1px solid #e5e7eb',
            background: '#f8fafc',
            borderRadius: '0 0 12px 12px',
            fontSize: '0.8rem',
            color: '#64748b',
            textAlign: 'center'
          }}>
            Right-click to create or manage notes
          </div>
        </div>
      )}
    </div>
  )
} 