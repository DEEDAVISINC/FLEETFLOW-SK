'use client';

interface DashboardViewProps {
  stats: any;
  onNavigate: (tab: string) => void;
}

export default function DashboardView({
  stats,
  onNavigate,
}: DashboardViewProps) {
  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      {/* Welcome Section */}
      <div>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            margin: '0 0 8px 0',
            color: '#06b6d4',
          }}
        >
          Welcome Back! 👋
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0' }}>
          Here's an overview of your shipments and activities
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '600',
            margin: '0 0 16px 0',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          Quick Actions
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          <button
            onClick={() => onNavigate('shipments')}
            style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = 'translateY(-4px)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = 'translateY(0)')
            }
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📦</div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>
              View Shipments
            </div>
            <div style={{ fontSize: '12px', opacity: '0.9', marginTop: '4px' }}>
              {stats.activeShipments} active
            </div>
          </button>

          <button
            onClick={() => onNavigate('documents')}
            style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = 'translateY(-4px)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = 'translateY(0)')
            }
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📄</div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>
              Upload Documents
            </div>
            <div style={{ fontSize: '12px', opacity: '0.9', marginTop: '4px' }}>
              {stats.pendingDocuments} pending
            </div>
          </button>

          <button
            onClick={() => onNavigate('communication')}
            style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = 'translateY(-4px)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = 'translateY(0)')
            }
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔔</div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>
              Notifications
            </div>
            <div style={{ fontSize: '12px', opacity: '0.9', marginTop: '4px' }}>
              Check updates
            </div>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = 'translateY(-4px)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = 'translateY(0)')
            }
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>
              View Reports
            </div>
            <div style={{ fontSize: '12px', opacity: '0.9', marginTop: '4px' }}>
              Analytics
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '600',
            margin: '0 0 16px 0',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          Recent Activity
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {[
            {
              icon: '🚢',
              title: 'Shipment Departed',
              description: 'SHIP-2025-001 departed from Shanghai Port',
              time: '2 hours ago',
              color: '#06b6d4',
            },
            {
              icon: '✅',
              title: 'Document Approved',
              description: 'Commercial Invoice approved by customs',
              time: '5 hours ago',
              color: '#10b981',
            },
            {
              icon: '🛃',
              title: 'Customs Cleared',
              description: 'SHIP-2025-002 cleared customs successfully',
              time: '1 day ago',
              color: '#8b5cf6',
            },
            {
              icon: '📦',
              title: 'Shipment Delivered',
              description: 'SHIP-2024-095 delivered to destination',
              time: '2 days ago',
              color: '#f59e0b',
            },
          ].map((activity, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '16px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: `${activity.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  flexShrink: 0,
                }}
              >
                {activity.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '4px',
                    color: activity.color,
                  }}
                >
                  {activity.title}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  {activity.description}
                </div>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.5)',
                  flexShrink: 0,
                }}
              >
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Milestones */}
      <div>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '600',
            margin: '0 0 16px 0',
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          Upcoming Milestones
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
          }}
        >
          <div
            style={{
              padding: '20px',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '12px',
              }}
            >
              <div style={{ fontSize: '24px' }}>🚢</div>
              <div
                style={{
                  padding: '4px 8px',
                  background: 'rgba(6, 182, 212, 0.2)',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#06b6d4',
                  fontWeight: '600',
                }}
              >
                IN 3 DAYS
              </div>
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '4px',
              }}
            >
              Estimated Arrival
            </div>
            <div
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              SHIP-2025-001 arriving at Long Beach
            </div>
          </div>

          <div
            style={{
              padding: '20px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '12px',
              }}
            >
              <div style={{ fontSize: '24px' }}>📄</div>
              <div
                style={{
                  padding: '4px 8px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#ef4444',
                  fontWeight: '600',
                }}
              >
                URGENT
              </div>
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '4px',
              }}
            >
              Document Due
            </div>
            <div
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              Certificate of Origin needed
            </div>
          </div>

          <div
            style={{
              padding: '20px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '12px',
              }}
            >
              <div style={{ fontSize: '24px' }}>🛃</div>
              <div
                style={{
                  padding: '4px 8px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#10b981',
                  fontWeight: '600',
                }}
              >
                TOMORROW
              </div>
            </div>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '4px',
              }}
            >
              Customs Clearance
            </div>
            <div
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              SHIP-2025-003 scheduled for clearance
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
