'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ManagementNotification } from '../services/OnboardingUserIntegrationService';

export default function ManagementReview() {
  const [pendingRequests, setPendingRequests] = useState<
    ManagementNotification[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<{ [key: string]: string }>({});

  // Load pending access requests
  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/management/access-requests');

      if (response.ok) {
        const data = await response.json();
        setPendingRequests(data.pendingRequests || []);
      } else {
        console.error('Failed to load pending requests');
      }
    } catch (error) {
      console.error('Error loading pending requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessRequest = async (
    notificationId: string,
    action: 'approve' | 'deny'
  ) => {
    try {
      setProcessingId(notificationId);

      const response = await fetch('/api/management/access-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationId,
          action,
          reviewedBy: 'Current Manager', // In production, this would come from auth
          notes: reviewNotes[notificationId] || '',
        }),
      });

      if (response.ok) {
        // Remove processed request from list
        setPendingRequests((prev) =>
          prev.filter((req) => req.id !== notificationId)
        );

        // Clear notes for this request
        setReviewNotes((prev) => {
          const newNotes = { ...prev };
          delete newNotes[notificationId];
          return newNotes;
        });

        alert(
          `Access request ${action === 'approve' ? 'approved' : 'denied'} successfully!`
        );
      } else {
        const errorData = await response.json();
        alert(`Failed to process request: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error processing access request:', error);
      alert('Failed to process request. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const updateNotes = (notificationId: string, notes: string) => {
    setReviewNotes((prev) => ({
      ...prev,
      [notificationId]: notes,
    }));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner_operator':
        return '👑';
      case 'company_driver':
        return '🚛';
      case 'fleet_manager':
        return '👨‍💼';
      case 'dispatcher':
        return '📞';
      default:
        return '👤';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner_operator':
        return '#14b8a6';
      case 'company_driver':
        return '#f4a832';
      case 'fleet_manager':
        return '#6366f1';
      case 'dispatcher':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ color: 'white', fontSize: '1.2rem' }}>
          Loading pending requests...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 20px 20px 20px',
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
          maxWidth: '1200px',
          margin: '0 auto 32px auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1
              style={{
                color: 'white',
                fontSize: '2.2rem',
                fontWeight: 'bold',
                marginBottom: '12px',
                margin: 0,
              }}
            >
              🔑 Management Review - Access Requests
            </h1>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}
            >
              Review and approve user access requests from carrier onboarding
            </div>
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px 20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}
            >
              {pendingRequests.length}
            </div>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}
            >
              Pending Requests
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 24px auto' }}>
        <Link href='/user-management' style={{ textDecoration: 'none' }}>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '12px 20px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
            }}
          >
            ← Back to User Management
          </button>
        </Link>
      </div>

      {/* Pending Requests */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {pendingRequests.length === 0 ? (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '60px 40px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '24px' }}>✅</div>
            <h2
              style={{
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}
            >
              No Pending Requests
            </h2>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}
            >
              All user access requests have been reviewed and processed.
            </div>
          </div>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '24px',
                  }}
                >
                  {/* User Info */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '16px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '2.5rem',
                          background: `${getRoleColor(request.userRole)}20`,
                          borderRadius: '12px',
                          padding: '8px',
                          border: `2px solid ${getRoleColor(request.userRole)}`,
                        }}
                      >
                        {getRoleIcon(request.userRole)}
                      </div>
                      <div>
                        <h3
                          style={{
                            color: 'white',
                            fontSize: '1.4rem',
                            fontWeight: 'bold',
                            margin: '0 0 4px 0',
                          }}
                        >
                          {request.userName}
                        </h3>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '1rem',
                          }}
                        >
                          {request.userId} •{' '}
                          {request.userRole
                            .replace('_', ' ')
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '12px',
                        marginBottom: '20px',
                      }}
                    >
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '12px',
                        }}
                      >
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem',
                            marginBottom: '4px',
                          }}
                        >
                          Tenant
                        </div>
                        <div style={{ color: 'white', fontWeight: 'bold' }}>
                          {request.tenantName}
                        </div>
                      </div>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '12px',
                        }}
                      >
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem',
                            marginBottom: '4px',
                          }}
                        >
                          Requested
                        </div>
                        <div style={{ color: 'white', fontWeight: 'bold' }}>
                          {new Date(request.requestedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Review Notes */}
                    <div style={{ marginBottom: '20px' }}>
                      <label
                        style={{
                          color: 'white',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          marginBottom: '8px',
                          display: 'block',
                        }}
                      >
                        Review Notes (Optional)
                      </label>
                      <textarea
                        value={reviewNotes[request.id] || ''}
                        onChange={(e) =>
                          updateNotes(request.id, e.target.value)
                        }
                        placeholder='Add notes about this access request...'
                        style={{
                          width: '100%',
                          minHeight: '80px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          padding: '12px',
                          color: 'white',
                          fontSize: '0.9rem',
                          resize: 'vertical',
                        }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      marginLeft: '24px',
                    }}
                  >
                    <button
                      onClick={() => handleAccessRequest(request.id, 'approve')}
                      disabled={processingId === request.id}
                      style={{
                        background:
                          processingId === request.id
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor:
                          processingId === request.id
                            ? 'not-allowed'
                            : 'pointer',
                        fontSize: '0.9rem',
                        minWidth: '120px',
                        opacity: processingId === request.id ? 0.6 : 1,
                      }}
                    >
                      {processingId === request.id
                        ? '⏳ Processing...'
                        : '✅ Approve'}
                    </button>
                    <button
                      onClick={() => handleAccessRequest(request.id, 'deny')}
                      disabled={processingId === request.id}
                      style={{
                        background:
                          processingId === request.id
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor:
                          processingId === request.id
                            ? 'not-allowed'
                            : 'pointer',
                        fontSize: '0.9rem',
                        minWidth: '120px',
                        opacity: processingId === request.id ? 0.6 : 1,
                      }}
                    >
                      {processingId === request.id
                        ? '⏳ Processing...'
                        : '❌ Deny'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
