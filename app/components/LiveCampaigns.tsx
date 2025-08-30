'use client';

import { useState } from 'react';

export interface HealthcareTask {
  id: string;
  title: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  assignedTo: string[];
  timeline: string;
  revenueTarget?: string;
  createdAt: string;
  dueDate: string;
}

interface StaffMember {
  id: string;
  name: string;
  avatar: string;
  department: string;
}

interface LiveCampaignsProps {
  healthcareTasks: HealthcareTask[];
  staff: StaffMember[];
  onClearTasks: () => void;
}

export default function LiveCampaigns({
  healthcareTasks,
  staff,
  onClearTasks,
}: LiveCampaignsProps) {
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);

  if (healthcareTasks.length === 0) return null;

  return (
    <div
      className='financial-card'
      style={{
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '12px',
        padding: '16px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <h3
          style={{
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: '700',
            margin: '0',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          🚀 Live Campaign Deployments
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              padding: '3px 8px',
              borderRadius: '8px',
              fontSize: '0.65rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span style={{ fontSize: '8px', animation: 'pulse 2s infinite' }}>
              ●
            </span>
            LIVE
          </div>
          {expandedCampaign && (
            <button
              onClick={() => setExpandedCampaign(null)}
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid #3b82f6',
                color: '#3b82f6',
                padding: '3px 6px',
                borderRadius: '4px',
                fontSize: '0.65rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              ← Back
            </button>
          )}
          <button
            onClick={() => {
              setExpandedCampaign(null);
              onClearTasks();
            }}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid #ef4444',
              color: '#ef4444',
              padding: '3px 6px',
              borderRadius: '4px',
              fontSize: '0.65rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
            }}
            title='Clear all completed campaigns'
          >
            ✅ Clear
          </button>
        </div>
      </div>

      {!expandedCampaign ? (
        // Compact Campaign Overview Mode
        <div
          onClick={() => setExpandedCampaign('healthcare')}
          style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: '60px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(34, 197, 94, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.3)';
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#22c55e',
              animation: 'pulse 2s infinite',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                borderRadius: '6px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}
            >
              🏥
            </div>
            <div>
              <h4
                style={{
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  margin: 0,
                  marginBottom: '2px',
                }}
              >
                Healthcare Logistics Campaign
              </h4>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.7rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                }}
              >
                <span>
                  <strong style={{ color: '#22c55e' }}>
                    {healthcareTasks.length}
                  </strong>{' '}
                  tasks
                </span>
                <span>
                  <strong style={{ color: '#22c55e' }}>
                    {
                      new Set(
                        healthcareTasks.flatMap((task) => task.assignedTo)
                      ).size
                    }
                  </strong>{' '}
                  staff
                </span>
                <span>
                  <strong style={{ color: '#22c55e' }}>
                    $
                    {healthcareTasks
                      .reduce((total, task) => {
                        const target =
                          task.revenueTarget?.replace(/[^0-9]/g, '') || '0';
                        return total + parseInt(target);
                      }, 0)
                      .toLocaleString()}
                    +
                  </strong>{' '}
                  target
                </span>
                {healthcareTasks.filter((task) => task.priority === 'CRITICAL')
                  .length > 0 && (
                  <span style={{ color: '#f59e0b' }}>
                    <strong>
                      {
                        healthcareTasks.filter(
                          (task) => task.priority === 'CRITICAL'
                        ).length
                      }
                    </strong>{' '}
                    critical
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {Array.from(
                new Set(healthcareTasks.flatMap((task) => task.assignedTo))
              )
                .slice(0, 3)
                .map((staffId) => {
                  const staffMember = staff.find((s) => s.id === staffId);
                  return staffMember ? (
                    <span
                      key={staffId}
                      style={{
                        fontSize: '14px',
                        opacity: 0.8,
                      }}
                      title={staffMember.name}
                    >
                      {staffMember.avatar}
                    </span>
                  ) : null;
                })}
              {new Set(healthcareTasks.flatMap((task) => task.assignedTo))
                .size > 3 && (
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontSize: '0.6rem',
                  }}
                >
                  +
                  {new Set(healthcareTasks.flatMap((task) => task.assignedTo))
                    .size - 3}
                </span>
              )}
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.7rem',
                fontWeight: '500',
              }}
            >
              Click to expand →
            </div>
          </div>
        </div>
      ) : (
        // Individual Tasks Mode
        <div>
          <div
            style={{
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: '600',
                margin: 0,
              }}
            >
              Healthcare Logistics Campaign - Individual Tasks
            </h3>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px',
            }}
          >
            {healthcareTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '10px',
                  padding: '16px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    animation: 'pulse 2s infinite',
                  }}
                />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '10px',
                  }}
                >
                  <h4
                    style={{
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      margin: 0,
                      paddingRight: '20px',
                    }}
                  >
                    {task.title}
                  </h4>
                  <div
                    style={{
                      background:
                        task.priority === 'CRITICAL'
                          ? 'rgba(239, 68, 68, 0.2)'
                          : 'rgba(245, 158, 11, 0.2)',
                      color:
                        task.priority === 'CRITICAL' ? '#ef4444' : '#f59e0b',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.6rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}
                  >
                    {task.priority}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.8rem',
                    }}
                  >
                    👥 Assigned to:
                  </span>
                  {task.assignedTo.map((staffId) => {
                    const staffMember = staff.find((s) => s.id === staffId);
                    return staffMember ? (
                      <span
                        key={staffId}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: '500',
                        }}
                      >
                        {staffMember.avatar} {staffMember.name}
                      </span>
                    ) : null;
                  })}
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.7rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <span>📅 {task.timeline}</span>
                  {task.revenueTarget && (
                    <span style={{ color: '#22c55e', fontWeight: '600' }}>
                      💰 {task.revenueTarget}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
