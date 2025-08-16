'use client';

import { useEffect, useState } from 'react';
import CarrierInvitationService from '../services/CarrierInvitationService';

interface InvitationQuickManagerProps {
  style?: React.CSSProperties;
  compact?: boolean;
}

export default function InvitationQuickManager({
  style = {},
  compact = false,
}: InvitationQuickManagerProps) {
  const [inviteForm, setInviteForm] = useState({
    companyName: '',
    email: '',
    mcNumber: '',
  });

  const [inviteStats, setInviteStats] = useState({
    sentToday: 8,
    opened: 5,
    started: 3,
    completed: 2,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Load invitation analytics
  useEffect(() => {
    const loadInvitationAnalytics = async () => {
      try {
        const invitationService = CarrierInvitationService.getInstance();
        const analytics = await invitationService.getInvitationAnalytics();

        setInviteStats({
          sentToday: analytics.totalSent,
          opened: analytics.totalOpened,
          started: analytics.totalStarted,
          completed: analytics.totalCompleted,
        });
      } catch (error) {
        console.error('Error loading invitation analytics:', error);
        // Keep default values if error
      }
    };

    loadInvitationAnalytics();
  }, []);

  const handleSendInvitation = async () => {
    if (!inviteForm.companyName || !inviteForm.email) {
      alert('Please fill in Company Name and Email Address');
      return;
    }

    try {
      const invitationService = CarrierInvitationService.getInstance();
      const invitation = await invitationService.createInvitation({
        targetCarrier: {
          companyName: inviteForm.companyName,
          email: inviteForm.email,
          mcNumber: inviteForm.mcNumber || undefined,
        },
        inviterName: 'FleetFlow Team',
        message: `Join the FleetFlow Driver Network and access premium loads, instant settlements, and professional carrier services.`,
      });

      if (invitation) {
        await invitationService.sendInvitation(invitation.id);
        alert(`Invitation sent successfully to ${inviteForm.email}!`);

        // Update stats
        setInviteStats((prev) => ({
          ...prev,
          sentToday: prev.sentToday + 1,
        }));

        // Clear form
        setInviteForm({
          companyName: '',
          email: '',
          mcNumber: '',
        });
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation. Please try again.');
    }
  };

  const handleGenerateLink = () => {
    if (!inviteForm.companyName) {
      alert('Please fill in Company Name to generate an invitation link');
      return;
    }

    try {
      const baseUrl = window.location.origin;

      // Generate shareable link with pre-filled data
      const params = new URLSearchParams();
      params.set('carrier', encodeURIComponent(inviteForm.companyName));
      if (inviteForm.mcNumber) params.set('mc', inviteForm.mcNumber);
      params.set('inviter', encodeURIComponent('FleetFlow Team'));

      const inviteUrl = `${baseUrl}/carrier-landing?${params.toString()}`;

      navigator.clipboard
        .writeText(inviteUrl)
        .then(() => {
          alert(
            `Invitation link copied to clipboard!\n\nShare this link: ${inviteUrl}`
          );

          // Update stats
          setInviteStats((prev) => ({
            ...prev,
            sentToday: prev.sentToday + 1,
          }));
        })
        .catch(() => {
          // Fallback for browsers that don't support clipboard API
          prompt('Copy this invitation link:', inviteUrl);
        });
    } catch (error) {
      console.error('Error generating link:', error);
      alert('Failed to generate invitation link. Please try again.');
    }
  };

  if (compact) {
    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          ...style,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: isExpanded ? '15px' : '0px',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              margin: 0,
            }}
          >
            📧 Carrier Invitations
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'rgba(20, 184, 166, 0.2)',
              border: '1px solid rgba(20, 184, 166, 0.4)',
              borderRadius: '6px',
              color: '#14b8a6',
              padding: '6px 12px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(20, 184, 166, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(20, 184, 166, 0.2)';
            }}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>

        {/* Quick Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            marginBottom: isExpanded ? '15px' : '0px',
          }}
        >
          {[
            {
              label: 'Sent',
              value: inviteStats.sentToday.toString(),
              color: '#14b8a6',
              icon: '📧',
            },
            {
              label: 'Opened',
              value: inviteStats.opened.toString(),
              color: '#3b82f6',
              icon: '👁️',
            },
            {
              label: 'Started',
              value: inviteStats.started.toString(),
              color: '#f59e0b',
              icon: '🚀',
            },
            {
              label: 'Done',
              value: inviteStats.completed.toString(),
              color: '#10b981',
              icon: '✅',
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                border: `1px solid ${stat.color}30`,
                borderRadius: '8px',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.9rem', marginBottom: '2px' }}>
                {stat.icon}
              </div>
              <div
                style={{
                  color: stat.color,
                  fontSize: '0.9rem',
                  fontWeight: '700',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.6rem' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Expanded Form */}
        {isExpanded && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                marginBottom: '12px',
              }}
            >
              <input
                type='text'
                placeholder='Company Name'
                value={inviteForm.companyName}
                onChange={(e) =>
                  setInviteForm((prev) => ({
                    ...prev,
                    companyName: e.target.value,
                  }))
                }
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '0.8rem',
                }}
              />
              <input
                type='email'
                placeholder='Email'
                value={inviteForm.email}
                onChange={(e) =>
                  setInviteForm((prev) => ({ ...prev, email: e.target.value }))
                }
                style={{
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '0.8rem',
                }}
              />
            </div>
            <input
              type='text'
              placeholder='MC Number (Optional)'
              value={inviteForm.mcNumber}
              onChange={(e) =>
                setInviteForm((prev) => ({ ...prev, mcNumber: e.target.value }))
              }
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '0.8rem',
                marginBottom: '12px',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleSendInvitation}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 15px rgba(20, 184, 166, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                📧 Send Email
              </button>
              <button
                onClick={handleGenerateLink}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                🔗 Copy Link
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Full size version
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        ...style,
      }}
    >
      <h3
        style={{
          color: 'white',
          fontSize: '1.2rem',
          fontWeight: '600',
          marginBottom: '20px',
        }}
      >
        📧 Carrier Invitation Manager
      </h3>

      {/* Analytics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        {[
          {
            label: 'Sent Today',
            value: inviteStats.sentToday.toString(),
            color: '#14b8a6',
            icon: '📧',
          },
          {
            label: 'Opened',
            value: inviteStats.opened.toString(),
            color: '#3b82f6',
            icon: '👁️',
          },
          {
            label: 'Started',
            value: inviteStats.started.toString(),
            color: '#f59e0b',
            icon: '🚀',
          },
          {
            label: 'Completed',
            value: inviteStats.completed.toString(),
            color: '#10b981',
            icon: '✅',
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}05)`,
              border: `1px solid ${stat.color}40`,
              borderRadius: '12px',
              padding: '12px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
              {stat.icon}
            </div>
            <div
              style={{
                color: stat.color,
                fontSize: '1.1rem',
                fontWeight: '800',
              }}
            >
              {stat.value}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Invitation Form */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <input
          type='text'
          placeholder='Company Name'
          value={inviteForm.companyName}
          onChange={(e) =>
            setInviteForm((prev) => ({ ...prev, companyName: e.target.value }))
          }
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            fontSize: '0.9rem',
          }}
        />
        <input
          type='email'
          placeholder='Email Address'
          value={inviteForm.email}
          onChange={(e) =>
            setInviteForm((prev) => ({ ...prev, email: e.target.value }))
          }
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            fontSize: '0.9rem',
          }}
        />
        <input
          type='text'
          placeholder='MC Number (Optional)'
          value={inviteForm.mcNumber}
          onChange={(e) =>
            setInviteForm((prev) => ({ ...prev, mcNumber: e.target.value }))
          }
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            fontSize: '0.9rem',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={handleSendInvitation}
          style={{
            background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow =
              '0 4px 15px rgba(20, 184, 166, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          📧 Send Email Invitation
        </button>
        <button
          onClick={handleGenerateLink}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          🔗 Generate Link
        </button>
      </div>
    </div>
  );
}
