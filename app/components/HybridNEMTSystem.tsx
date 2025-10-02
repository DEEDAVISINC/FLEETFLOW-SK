'use client';

import { useState } from 'react';

// ============================================================================
// HYBRID NEMT SYSTEM - AI + Human Staff
// AI handles automation, humans can override/assist when needed
// ============================================================================

export interface StaffMember {
  id: string;
  name: string;
  type: 'ai' | 'human';
  role: string;
  status: 'active' | 'idle' | 'offline';
  avatar: string;
}

export interface Task {
  id: string;
  type: 'patient-intake' | 'ride-booking' | 'eligibility-check' | 'claim-generation';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: StaffMember;
  assignmentType: 'auto' | 'manual';
  priority: 'high' | 'medium' | 'low';
  data: any;
  createdAt: string;
}

export default function HybridNEMTSystem() {
  const [activeView, setActiveView] = useState<'dashboard' | 'patients' | 'rides' | 'claims'>('dashboard');
  const [staffMode, setStaffMode] = useState<'ai' | 'hybrid' | 'human'>('hybrid');
  const [showQuickAction, setShowQuickAction] = useState<string | null>(null);

  // Staff roster
  const staff: StaffMember[] = [
    { id: 'brook-009', name: 'Brook AI', type: 'ai', role: 'Operations', status: 'active', avatar: '🤖' },
    { id: 'kameelah-014', name: 'Kameelah AI', type: 'ai', role: 'Compliance', status: 'active', avatar: '🤖' },
    { id: 'regina-015', name: 'Regina AI', type: 'ai', role: 'Coordinator', status: 'active', avatar: '🤖' },
    { id: 'human-001', name: 'You', type: 'human', role: 'Manager', status: 'active', avatar: '👤' },
  ];

  const activeStaff = staffMode === 'ai' 
    ? staff.filter(s => s.type === 'ai')
    : staffMode === 'human'
    ? staff.filter(s => s.type === 'human')
    : staff;

  return (
    <div style={{ padding: '20px' }}>
      {/* Header with Staff Mode Toggle */}
      <div style={{
        marginBottom: '20px',
        padding: '24px',
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        borderRadius: '12px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{
              color: 'white',
              fontSize: '2rem',
              fontWeight: '700',
              margin: '0 0 8px 0',
            }}>
              🏥 NEMT Operations Center
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
              AI-Powered with Human Oversight | DEE DAVIS INC dba DEPOINTE
            </p>
          </div>
          
          {/* Staff Mode Selector */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            padding: '8px',
            display: 'flex',
            gap: '8px',
          }}>
            <button
              onClick={() => setStaffMode('ai')}
              style={{
                background: staffMode === 'ai' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              🤖 AI Mode
            </button>
            <button
              onClick={() => setStaffMode('hybrid')}
              style={{
                background: staffMode === 'hybrid' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              ⚡ Hybrid
            </button>
            <button
              onClick={() => setStaffMode('human')}
              style={{
                background: staffMode === 'human' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              👤 Manual
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        <QuickActionButton
          icon="➕"
          label="Add Patient"
          description={staffMode === 'ai' ? 'AI will process' : 'Manual entry'}
          onClick={() => setShowQuickAction('patient')}
          color="#10b981"
        />
        <QuickActionButton
          icon="🚗"
          label="Book Ride"
          description={staffMode === 'ai' ? 'AI books via Uber' : 'Manual booking'}
          onClick={() => setShowQuickAction('ride')}
          color="#3b82f6"
        />
        <QuickActionButton
          icon="📄"
          label="Generate Claim"
          description={staffMode === 'ai' ? 'AI creates EDI 837P' : 'Manual form'}
          onClick={() => setShowQuickAction('claim')}
          color="#f59e0b"
        />
        <QuickActionButton
          icon="✅"
          label="Check Eligibility"
          description={staffMode === 'ai' ? 'AI queries MMIS' : 'Manual check'}
          onClick={() => setShowQuickAction('eligibility')}
          color="#8b5cf6"
        />
      </div>

      {/* Main Navigation */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        borderBottom: '2px solid rgba(148, 163, 184, 0.2)',
        paddingBottom: '12px',
        flexWrap: 'wrap',
      }}>
        {[
          { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
          { id: 'patients', label: '👥 Patients', icon: '👥' },
          { id: 'rides', label: '�� Rides', icon: '🚗' },
          { id: 'claims', label: '💰 Claims', icon: '💰' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            style={{
              background: activeView === tab.id 
                ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                : 'rgba(255, 255, 255, 0.05)',
              border: activeView === tab.id ? 'none' : '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '8px',
              padding: '12px 24px',
              color: 'white',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
        <div>
          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}>
            <StatCard title="Active Patients" value="12" subtitle="3 pending verification" icon="👥" color="#10b981" />
            <StatCard title="Today's Rides" value="8" subtitle="5 completed, 3 scheduled" icon="🚗" color="#3b82f6" />
            <StatCard title="Pending Claims" value="15" subtitle="$2,340 total" icon="💰" color="#f59e0b" />
            <StatCard title="AI Automation" value="94%" subtitle="Manual: 6%" icon="🤖" color="#8b5cf6" />
          </div>

          {/* Staff Activity - Hybrid View */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: 'white', fontSize: '1.2rem', margin: 0 }}>
                {staffMode === 'hybrid' ? '⚡ Hybrid Team Activity' : staffMode === 'ai' ? '🤖 AI Staff' : '👤 Human Staff'}
              </h3>
              {staffMode === 'hybrid' && (
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>
                  AI handling 94% • Humans handling 6%
                </div>
              )}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {activeStaff.map((member) => (
                <StaffCard key={member.id} member={member} />
              ))}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '1.2rem' }}>
              📋 Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ActivityItem
                icon="🤖"
                title="Brook AI booked ride for John Smith"
                subtitle="Wheelchair-accessible via Uber Health API"
                time="2 min ago"
                type="ai"
              />
              <ActivityItem
                icon="👤"
                title="You manually updated patient Maria Garcia"
                subtitle="Added oxygen requirement notes"
                time="15 min ago"
                type="human"
              />
              <ActivityItem
                icon="🤖"
                title="Kameelah AI verified Medicaid eligibility"
                subtitle="Patient active through 2025-12-31"
                time="22 min ago"
                type="ai"
              />
              <ActivityItem
                icon="🤖"
                title="Regina AI generated claim #CLM-2025-045"
                subtitle="EDI 837P ready for submission"
                time="1 hour ago"
                type="ai"
              />
            </div>
          </div>
        </div>
      )}

      {/* Patients View */}
      {activeView === 'patients' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600' }}>
              👥 Patient Management
            </h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {staffMode === 'ai' ? '🤖 AI Auto-Process' : '➕ Add Patient'}
              </button>
            </div>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
          }}>
            {staffMode !== 'human' && (
              <div style={{
                padding: '12px',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '8px',
                marginBottom: '16px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.9rem',
              }}>
                <strong style={{ color: '#8b5cf6' }}>🤖 AI Mode Active:</strong> Brook AI automatically processes patient intake from phone calls and emails. You can review and override as needed.
              </div>
            )}
            
            <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              <p>Patient list will appear here with options to:</p>
              <ul>
                <li>View AI-processed patient data</li>
                <li>Manually edit any field</li>
                <li>Override AI decisions</li>
                <li>Add notes for AI to learn from</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Rides View */}
      {activeView === 'rides' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600' }}>
              🚗 Ride Management
            </h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              {staffMode !== 'human' && (
                <button
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  🤖 Let AI Book
                </button>
              )}
              <button
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                📝 Manual Booking
              </button>
            </div>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
          }}>
            {staffMode === 'hybrid' && (
              <div style={{
                padding: '12px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                marginBottom: '16px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.9rem',
              }}>
                <strong style={{ color: '#3b82f6' }}>⚡ Hybrid Mode:</strong> AI books most rides automatically via Uber Health API. You can take over manual booking anytime or review AI bookings before confirmation.
              </div>
            )}
            
            <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              <p>Ride scheduling interface with:</p>
              <ul>
                <li><strong>AI Booking:</strong> Automatic via Uber Health API (25s avg)</li>
                <li><strong>Manual Booking:</strong> Copy/paste helpers for Uber Health portal</li>
                <li><strong>Approval Queue:</strong> Review AI bookings before confirmation (optional)</li>
                <li><strong>Override:</strong> Take control of any AI-scheduled ride</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Claims View */}
      {activeView === 'claims' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600' }}>
              💰 Claims Management
            </h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              {staffMode !== 'human' && (
                <button
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  🤖 AI Auto-Generate
                </button>
              )}
              <button
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                📝 Manual Claim
              </button>
            </div>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
          }}>
            {staffMode !== 'human' && (
              <div style={{
                padding: '12px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                marginBottom: '16px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.9rem',
              }}>
                <strong style={{ color: '#f59e0b' }}>🤖 AI Claims Engine:</strong> Will AI automatically generates EDI 837P claims for all completed rides. 99% accuracy, validated before submission. You can review/edit before sending.
              </div>
            )}
            
            <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              <p>Claims processing with:</p>
              <ul>
                <li><strong>AI Generation:</strong> Automatic EDI 837P format (60s avg, 99% accuracy)</li>
                <li><strong>Manual Entry:</strong> Form-based claim creation</li>
                <li><strong>Validation Queue:</strong> Review AI claims before submission</li>
                <li><strong>Bulk Actions:</strong> Approve/submit multiple claims at once</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Modal */}
      {showQuickAction && (
        <QuickActionModal
          action={showQuickAction}
          staffMode={staffMode}
          onClose={() => setShowQuickAction(null)}
        />
      )}
    </div>
  );
}

// Helper Components
function StatCard({ title, value, subtitle, icon, color }: any) {
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.6)',
      border: `2px solid ${color}`,
      borderRadius: '12px',
      padding: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600', margin: 0 }}>
          {title}
        </h3>
        <span style={{ fontSize: '2rem' }}>{icon}</span>
      </div>
      <div style={{ color: color, fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>
        {value}
      </div>
      <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>
        {subtitle}
      </div>
    </div>
  );
}

function QuickActionButton({ icon, label, description, onClick, color }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        background: `${color}20`,
        border: `1px solid ${color}`,
        borderRadius: '8px',
        padding: '12px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flex: '1',
        minWidth: '200px',
      }}
    >
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      <div style={{ textAlign: 'left' }}>
        <div style={{ color: color, fontSize: '0.95rem', fontWeight: '600' }}>
          {label}
        </div>
        <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>
          {description}
        </div>
      </div>
    </button>
  );
}

function StaffCard({ member }: any) {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      border: `2px solid ${member.type === 'ai' ? '#8b5cf6' : '#10b981'}`,
      borderRadius: '8px',
      padding: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.5rem' }}>{member.avatar}</span>
          <div>
            <div style={{ color: 'white', fontSize: '1rem', fontWeight: '600' }}>
              {member.name}
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
              {member.role}
            </div>
          </div>
        </div>
        <span style={{
          background: member.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
          color: member.status === 'active' ? '#10b981' : '#6b7280',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: '600',
          height: 'fit-content',
        }}>
          {member.status}
        </span>
      </div>
    </div>
  );
}

function ActivityItem({ icon, title, subtitle, time, type }: any) {
  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      border: `1px solid ${type === 'ai' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
    }}>
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ color: 'white', fontSize: '0.9rem', fontWeight: '500', marginBottom: '4px' }}>
          {title}
        </div>
        <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
          {subtitle}
        </div>
      </div>
      <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
        {time}
      </div>
    </div>
  );
}

function QuickActionModal({ action, staffMode, onClose }: any) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#1e293b',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '500px',
        width: '90%',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ color: 'white', margin: 0 }}>
            {action === 'patient' && '➕ Add Patient'}
            {action === 'ride' && '🚗 Book Ride'}
            {action === 'claim' && '📄 Generate Claim'}
            {action === 'eligibility' && '✅ Check Eligibility'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>
        
        {staffMode !== 'human' ? (
          <div style={{
            padding: '16px',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '16px',
          }}>
            <strong style={{ color: '#8b5cf6' }}>🤖 AI will handle this automatically</strong>
            <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem' }}>
              You can let AI process this task or switch to manual mode for full control.
            </p>
          </div>
        ) : (
          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '16px' }}>
            Manual {action} form will appear here...
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '10px 20px',
              color: '#ef4444',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            {staffMode !== 'human' ? '🤖 Let AI Handle' : '✓ Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}
