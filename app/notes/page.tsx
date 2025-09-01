'use client';

import Link from 'next/link';
import React, { useState } from 'react';

// Sample data for notes and communications
const sampleNotes: any[] = [];

const sampleNotifications: any[] = [];

const sampleCommunications: any[] = [];

const NoteCard: React.FC<{ note: any; onClick: () => void }> = ({
  note,
  onClick,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '#ef4444';
      case 'high':
        return '#f59e0b';
      case 'normal':
        return '#3b82f6';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'dispatch':
        return '#3b82f6';
      case 'safety':
        return '#10b981';
      case 'finance':
        return '#f59e0b';
      case 'compliance':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        height: '100%',
      }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 12px 40px rgba(0, 0, 0, 0.2)';
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow =
          '0 8px 32px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'start',
          marginBottom: '12px',
        }}
      >
        <div>
          <h3
            style={{
              color: '#fbbf24',
              fontSize: '1.2rem',
              fontWeight: '600',
              margin: 0,
              marginBottom: '4px',
            }}
          >
            {note.title}
          </h3>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              fontSize: '0.9rem',
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            <span>By: {note.author}</span>
            <span>Type: {note.type}</span>
          </div>
        </div>
        <span
          style={{
            background: getPriorityColor(note.priority),
            color: 'white',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: '500',
          }}
        >
          {note.priority.toUpperCase()}
        </span>
      </div>

      {/* Content */}
      <div style={{ marginBottom: '12px' }}>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.9rem',
            lineHeight: '1.4',
            margin: 0,
          }}
        >
          {note.content}
        </p>
      </div>

      {/* Tags */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          marginBottom: '12px',
        }}
      >
        {note.tags.map((tag: string, index: number) => (
          <span
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'rgba(255, 255, 255, 0.9)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: '500',
            }}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.7)',
          paddingTop: '8px',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <span
          style={{
            background: getDepartmentColor(note.department),
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: '500',
          }}
        >
          {note.department.toUpperCase()}
        </span>
        <span>{new Date(note.timestamp).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default function NotesAndCommunicationsHub() {
  const [activeView, setActiveView] = useState<
    'notifications' | 'notes' | 'communications'
  >('notifications');
  const [notes, setNotes] = useState<any[]>(sampleNotes);
  const [notifications, setNotifications] =
    useState<any[]>(sampleNotifications);
  const [communications, setCommunications] =
    useState<any[]>(sampleCommunications);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<
    'all' | 'critical' | 'high' | 'normal' | 'low'
  >('all');
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    type: 'general',
    priority: 'normal',
    department: 'dispatch',
    subject: '',
    tags: '',
  });

  // Note creation functions
  const handleCreateNote = () => {
    const noteId = `note-${Date.now()}`;
    const newNoteData = {
      id: noteId,
      title: newNote.title,
      content: newNote.content,
      type: newNote.type,
      priority: newNote.priority as 'critical' | 'high' | 'normal' | 'low',
      department: newNote.department,
      timestamp: new Date().toISOString(),
      author: 'Current User (DC)', // In real app, this would come from auth
      tags: newNote.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ''),
    };

    setNotes((prevNotes) => [newNoteData, ...prevNotes]);
    setShowNoteModal(false);
    setNewNote({
      title: '',
      content: '',
      type: 'general',
      priority: 'normal',
      department: 'dispatch',
      subject: '',
      tags: '',
    });
  };

  const handleNoteInputChange = (field: string, value: string) => {
    setNewNote((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      !searchTerm ||
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority =
      priorityFilter === 'all' || note.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      !searchTerm ||
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority =
      priorityFilter === 'all' || notification.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  const filteredCommunications = communications.filter((communication) => {
    const matchesSearch =
      !searchTerm ||
      communication.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      communication.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      communication.from.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority =
      priorityFilter === 'all' || communication.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  const handleNoteClick = (note: any) => {
    setSelectedNote(note);
    setShowDetailModal(true);
  };

  const handleCloseDetails = () => {
    setSelectedNote(null);
    setShowDetailModal(false);
  };

  const getStatsCounts = () => {
    const totalNotes = notes.length;
    const unreadNotifications = notifications.filter((n) => !n.read).length;
    const criticalAlerts = [...notes, ...notifications].filter(
      (item) => item.priority === 'critical'
    ).length;
    const todaysActivity = [
      ...notes,
      ...notifications,
      ...communications,
    ].filter((item) => {
      const itemDate = new Date(item.timestamp);
      const today = new Date();
      return itemDate.toDateString() === today.toDateString();
    }).length;

    return {
      totalNotes,
      unreadNotifications,
      criticalAlerts,
      todaysActivity,
    };
  };

  const stats = getStatsCounts();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
        linear-gradient(135deg, #022c22 0%, #032e2a 25%, #044e46 50%, #042f2e 75%, #0a1612 100%),
        radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.04) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.03) 0%, transparent 50%)
      `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        backgroundAttachment: 'fixed',
        paddingTop: '80px',
        position: 'relative',
      }}
    >
      {/* Darker Black Casting Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.35)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Back Button */}
      <div style={{ padding: '24px', position: 'relative', zIndex: 10 }}>
        <Link href='/fleetflowdash' style={{ textDecoration: 'none' }}>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '16px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Container */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 32px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '32px' }}>📝</span>
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#fbbf24',
                    margin: '0 0 8px 0',
                    textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  Notes & Communications Hub
                </h1>
                <p
                  style={{
                    fontSize: '18px',
                    color: '#fbbf24',
                    margin: '0 0 8px 0',
                  }}
                >
                  Centralized messaging, notifications, and note management
                  system
                </p>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '24px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        background: '#fbbf24',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite',
                      }}
                    />
                    <span style={{ fontSize: '14px', color: '#fbbf24' }}>
                      Real-time Updates Active
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Last updated: {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 25px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              + Create Note
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'notes', label: '📝 Notes', icon: '📝' },
              { id: 'communications', label: '💬 Communications', icon: '💬' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  background:
                    activeView === tab.id
                      ? '#fbbf24'
                      : 'rgba(255, 255, 255, 0.2)',
                  color: activeView === tab.id ? '#1f2937' : 'white',
                  transform:
                    activeView === tab.id
                      ? 'translateY(-2px)'
                      : 'translateY(0)',
                  boxShadow:
                    activeView === tab.id
                      ? '0 8px 25px rgba(0, 0, 0, 0.15)'
                      : 'none',
                }}
                onMouseOver={(e) => {
                  if (activeView !== tab.id) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.3)';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeView !== tab.id) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.2)';
                  }
                }}
              >
                <span style={{ marginRight: '8px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow =
                '0 12px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#fbbf24',
                    margin: '0 0 8px 0',
                    fontWeight: '500',
                  }}
                >
                  Total Notes
                </p>
                <p
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 4px 0',
                  }}
                >
                  {stats.totalNotes}
                </p>
                <p style={{ fontSize: '12px', color: '#fbbf24', margin: 0 }}>
                  Active records
                </p>
              </div>
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '24px' }}>📝</span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow =
                '0 12px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#fbbf24',
                    margin: '0 0 8px 0',
                    fontWeight: '500',
                  }}
                >
                  Unread Alerts
                </p>
                <p
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 4px 0',
                  }}
                >
                  {stats.unreadNotifications}
                </p>
                <p style={{ fontSize: '12px', color: '#fbbf24', margin: 0 }}>
                  Require attention
                </p>
              </div>
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '24px' }}>🔔</span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow =
                '0 12px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#fbbf24',
                    margin: '0 0 8px 0',
                    fontWeight: '500',
                  }}
                >
                  Critical Alerts
                </p>
                <p
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 4px 0',
                  }}
                >
                  {stats.criticalAlerts}
                </p>
                <p style={{ fontSize: '12px', color: '#fbbf24', margin: 0 }}>
                  Urgent items
                </p>
              </div>
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '24px' }}>⚠️</span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow =
                '0 12px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#fbbf24',
                    margin: '0 0 8px 0',
                    fontWeight: '500',
                  }}
                >
                  Today's Activity
                </p>
                <p
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 4px 0',
                  }}
                >
                  {stats.todaysActivity}
                </p>
                <p style={{ fontSize: '12px', color: '#fbbf24', margin: 0 }}>
                  Recent updates
                </p>
              </div>
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '24px' }}>📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Content Header */}
          <div
            style={{
              padding: '24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <input
                type='text'
                placeholder='Search notes, notifications, or communications...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '300px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                <option value='all'>All Priorities</option>
                <option value='critical'>Critical</option>
                <option value='high'>High</option>
                <option value='normal'>Normal</option>
                <option value='low'>Low</option>
              </select>
            </div>
          </div>

          {/* Content Body */}
          <div style={{ padding: '24px' }}>
            {activeView === 'notes' && (
              <div>
                {filteredNotes.length > 0 ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(350px, 1fr))',
                      gap: '20px',
                    }}
                  >
                    {filteredNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onClick={() => handleNoteClick(note)}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      color: 'rgba(255, 255, 255, 0.8)',
                      padding: '48px',
                    }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                      📝
                    </div>
                    <h3
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#fbbf24',
                        margin: '0 0 12px 0',
                      }}
                    >
                      No Notes Found
                    </h3>
                    <p>
                      No notes match your search criteria. Try adjusting your
                      filters.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeView === 'communications' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {filteredCommunications.length > 0 ? (
                  filteredCommunications.map((communication) => (
                    <div
                      key={communication.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.15)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.1)';
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
                        <h3
                          style={{
                            color: '#fbbf24',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            margin: 0,
                          }}
                        >
                          {communication.subject}
                        </h3>
                        <span
                          style={{
                            background:
                              communication.priority === 'high'
                                ? '#f59e0b'
                                : '#3b82f6',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: '500',
                          }}
                        >
                          {communication.type.toUpperCase()}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '16px',
                          fontSize: '0.9rem',
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '12px',
                        }}
                      >
                        <span>
                          <strong>From:</strong> {communication.from}
                        </span>
                        <span>
                          <strong>To:</strong> {communication.to}
                        </span>
                      </div>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          margin: '0 0 12px 0',
                          lineHeight: '1.5',
                        }}
                      >
                        {communication.message}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.8rem',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        <span
                          style={{
                            background:
                              communication.priority === 'high'
                                ? '#f59e0b'
                                : '#10b981',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: '500',
                          }}
                        >
                          {communication.priority.toUpperCase()}
                        </span>
                        <span>
                          {new Date(communication.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      color: 'rgba(255, 255, 255, 0.8)',
                      padding: '48px',
                    }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                      💬
                    </div>
                    <h3
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#fbbf24',
                        margin: '0 0 12px 0',
                      }}
                    >
                      No Communications Found
                    </h3>
                    <p>No communications match your search criteria.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links Panel */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            marginTop: '32px',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#fbbf24',
              margin: '0 0 24px 0',
            }}
          >
            ⚡ Quick Links
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
            }}
          >
            <button
              onClick={() => setShowNoteModal(true)}
              style={{
                background: 'linear-gradient(135deg, #fef3c7, #fbbf24)',
                color: '#2d3748',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(251, 191, 36, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 2px 8px rgba(251, 191, 36, 0.3)';
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>📝</span>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                  Create New Note
                </div>
                <div style={{ fontSize: '0.7rem', opacity: '0.8' }}>
                  Add to any load or driver
                </div>
              </div>
            </button>

            <button
              style={{
                background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(20, 184, 166, 0.3)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(20, 184, 166, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 2px 8px rgba(20, 184, 166, 0.3)';
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>💬</span>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                  Send Message
                </div>
                <div style={{ fontSize: '0.7rem', opacity: '0.8' }}>
                  Inter-department communication
                </div>
              </div>
            </button>

            <Link href='/notifications' style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #fef3c7, #fbbf24)',
                  color: '#2d3748',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(251, 191, 36, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 2px 8px rgba(251, 191, 36, 0.3)';
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>🔔</span>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                    View All Notifications
                  </div>
                  <div style={{ fontSize: '0.7rem', opacity: '0.8' }}>
                    System & department alerts
                  </div>
                </div>
              </button>
            </Link>

            <button
              style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(99, 102, 241, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 2px 8px rgba(99, 102, 241, 0.3)';
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>📊</span>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                  Generate Report
                </div>
                <div style={{ fontSize: '0.7rem', opacity: '0.8' }}>
                  Notes & communication metrics
                </div>
              </div>
            </button>

            <Link href='/dispatch' style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(59, 130, 246, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 2px 8px rgba(59, 130, 246, 0.3)';
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>🚛</span>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                    Dispatch Central
                  </div>
                  <div style={{ fontSize: '0.7rem', opacity: '0.8' }}>
                    Load assignments & tracking
                  </div>
                </div>
              </button>
            </Link>

            <Link href='/drivers' style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #fde047, #eab308)',
                  color: '#1f2937',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(234, 179, 8, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(234, 179, 8, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 2px 8px rgba(234, 179, 8, 0.3)';
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>👨‍💼</span>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                    Driver Management
                  </div>
                  <div style={{ fontSize: '0.7rem', opacity: '0.8' }}>
                    Driver communications
                  </div>
                </div>
              </button>
            </Link>

            <Link href='/compliance' style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(220, 38, 38, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 2px 8px rgba(220, 38, 38, 0.3)';
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>✅</span>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                    Compliance Dashboard
                  </div>
                  <div style={{ fontSize: '0.7rem', opacity: '0.8' }}>
                    DOT & safety alerts
                  </div>
                </div>
              </button>
            </Link>

            <Link href='/settings' style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(139, 92, 246, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 2px 8px rgba(139, 92, 246, 0.3)';
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>⚙️</span>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                    Notification Settings
                  </div>
                  <div style={{ fontSize: '0.7rem', opacity: '0.8' }}>
                    Configure preferences
                  </div>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Note Creation Modal */}
      {showNoteModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: 0,
                }}
              >
                Create New Note
              </h2>
              <button
                onClick={() => setShowNoteModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                }}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateNote();
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '4px',
                    color: '#374151',
                  }}
                >
                  Title *
                </label>
                <input
                  type='text'
                  value={newNote.title}
                  onChange={(e) =>
                    handleNoteInputChange('title', e.target.value)
                  }
                  placeholder='Enter note title'
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '4px',
                    color: '#374151',
                  }}
                >
                  Content *
                </label>
                <textarea
                  value={newNote.content}
                  onChange={(e) =>
                    handleNoteInputChange('content', e.target.value)
                  }
                  placeholder='Enter note content'
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '4px',
                      color: '#374151',
                    }}
                  >
                    Priority
                  </label>
                  <select
                    value={newNote.priority}
                    onChange={(e) =>
                      handleNoteInputChange('priority', e.target.value)
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value='low'>Low</option>
                    <option value='normal'>Normal</option>
                    <option value='high'>High</option>
                    <option value='critical'>Critical</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '4px',
                      color: '#374151',
                    }}
                  >
                    Department
                  </label>
                  <select
                    value={newNote.department}
                    onChange={(e) =>
                      handleNoteInputChange('department', e.target.value)
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value='dispatch'>Dispatch</option>
                    <option value='safety'>Safety</option>
                    <option value='finance'>Finance</option>
                    <option value='admin'>Admin</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '4px',
                    color: '#374151',
                  }}
                >
                  Subject/Reference
                </label>
                <input
                  type='text'
                  value={newNote.subject}
                  onChange={(e) =>
                    handleNoteInputChange('subject', e.target.value)
                  }
                  placeholder='e.g., Load ID, Driver Name'
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '4px',
                    color: '#374151',
                  }}
                >
                  Tags
                </label>
                <input
                  type='text'
                  value={newNote.tags}
                  onChange={(e) =>
                    handleNoteInputChange('tags', e.target.value)
                  }
                  placeholder='tag1, tag2, tag3 (comma-separated)'
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  type='button'
                  onClick={() => setShowNoteModal(false)}
                  style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={!newNote.title || !newNote.content}
                  style={{
                    background:
                      newNote.title && newNote.content
                        ? 'linear-gradient(135deg, #fef3c7, #fbbf24)'
                        : '#d1d5db',
                    color:
                      newNote.title && newNote.content ? '#2d3748' : '#9ca3af',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor:
                      newNote.title && newNote.content
                        ? 'pointer'
                        : 'not-allowed',
                  }}
                >
                  Create Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
