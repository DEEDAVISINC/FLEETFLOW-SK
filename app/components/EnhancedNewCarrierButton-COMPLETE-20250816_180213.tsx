'use client';

import { useState, useRef, useEffect } from 'react';
import CarrierInvitationService from '../services/CarrierInvitationService';

interface EnhancedNewCarrierButtonProps {
  onDirectOnboarding: () => void;
  onShowInvitations: () => void;
  currentUser: {
    name: string;
    role: string;
    company: string;
  };
}

export default function EnhancedNewCarrierButton({
  onDirectOnboarding,
  onShowInvitations,
  currentUser,
}: EnhancedNewCarrierButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickInvite, setShowQuickInvite] = useState(false);
  const [quickInviteForm, setQuickInviteForm] = useState({
    email: '',
    carrierName: '',
    mcNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const invitationService = CarrierInvitationService.getInstance();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowQuickInvite(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuickInvite = async () => {
    if (!quickInviteForm.email || !quickInviteForm.carrierName) {
      alert('Please enter carrier name and email');
      return;
    }

    setLoading(true);

    try {
      const invitation = invitationService.createInvitation({
        invitedBy: currentUser.name,
        invitedByRole: currentUser.role,
        inviterCompany: currentUser.company,
        targetCarrier: {
          companyName: quickInviteForm.carrierName,
          email: quickInviteForm.email,
          mcNumber: quickInviteForm.mcNumber,
        },
        invitationType: 'email',
        source: 'enhanced_portal',
        metadata: {
          prefilledData: {
            mcNumber: quickInviteForm.mcNumber,
          },
          priority: 'standard',
          referralCode: '',
        },
      });

      const result = await invitationService.sendInvitation(invitation);
      
      if (result.success) {
        alert('Invitation sent successfully!');
        setQuickInviteForm({ email: '', carrierName: '', mcNumber: '' });
        setShowQuickInvite(false);
        setIsOpen(false);
      } else {
        alert(`Failed to send invitation: ${result.message}`);
      }
    } catch (error) {
      alert('Error sending invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateInviteLink = () => {
    // Generate a shareable invitation link
    const baseUrl = window.location.origin;
    const referralCode = `${currentUser.role.substring(0, 3).toUpperCase()}-${currentUser.name.split(' ').map(n => n[0]).join('')}-${Date.now()}`;
    const inviteUrl = `${baseUrl}/carriers/enhanced-portal?ref=${referralCode}&inviter=${encodeURIComponent(currentUser.name)}`;
    
    navigator.clipboard.writeText(inviteUrl).then(() => {
      alert('Invitation link copied to clipboard!');
      setIsOpen(false);
    }).catch(() => {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = inviteUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Invitation link copied to clipboard!');
      setIsOpen(false);
    });
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
          color: 'white',
          border: 'none',
          padding: '12px 20px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(20, 184, 166, 0.3)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(20, 184, 166, 0.4)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(20, 184, 166, 0.3)';
        }}
      >
        <span>🚛 New Carrier</span>
        <span style={{ 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }}>
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '8px',
            background: 'rgba(0,0,0,0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            zIndex: 1000,
            minWidth: '320px',
          }}
        >
          {!showQuickInvite ? (
            // Main Menu
            <div style={{ padding: '16px' }}>
              {/* Direct Onboarding */}
              <button
                onClick={() => {
                  onDirectOnboarding();
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
              >
                <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                  🚀 Start Direct Onboarding
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                  Begin carrier onboarding process immediately
                </div>
              </button>

              {/* Quick Email Invitation */}
              <button
                onClick={() => setShowQuickInvite(true)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
              >
                <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                  📧 Send Email Invitation
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                  Send personalized onboarding invitation via email
                </div>
              </button>

              {/* Generate Invitation Link */}
              <button
                onClick={generateInviteLink}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
              >
                <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                  🔗 Generate Invitation Link
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                  Create shareable link for social media or messaging
                </div>
              </button>

              {/* View Invitation Dashboard */}
              <button
                onClick={() => {
                  onShowInvitations();
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
              >
                <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                  📊 Invitation Dashboard
                </div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                  Track invitations, analytics, and manage templates
                </div>
              </button>

              {/* Bulk Import */}
              <button
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'not-allowed',
                  textAlign: 'left',
                  opacity: 0.6,
                }}
              >
                <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                  📁 Bulk Import & Invite
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                  Coming soon - Upload CSV for batch invitations
                </div>
              </button>
            </div>
          ) : (
            // Quick Invite Form
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <button
                  onClick={() => setShowQuickInvite(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    marginRight: '12px',
                    fontSize: '16px',
                  }}
                >
                  ←
                </button>
                <h4 style={{ color: 'white', fontSize: '16px', margin: 0 }}>
                  📧 Quick Email Invitation
                </h4>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Carrier Company Name *"
                  value={quickInviteForm.carrierName}
                  onChange={(e) => setQuickInviteForm({...quickInviteForm, carrierName: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '14px',
                    marginBottom: '8px',
                  }}
                />
                
                <input
                  type="email""
                  placeholder="Email Address *""
                  value={quickInviteForm.email}
                  onChange={(e) => setQuickInviteForm({...quickInviteForm, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '14px',
                    marginBottom: '8px',
                  }}
                />
                
                <input
                  type="text""
                  placeholder="MC Number (Optional)""
                  value={quickInviteForm.mcNumber}
                  onChange={(e) => setQuickInviteForm({...quickInviteForm, mcNumber: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
              </div>

              <button
                onClick={handleQuickInvite}
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading 
                    ? 'rgba(107,114,128,0.5)' 
                    : 'linear-gradient(135deg, #14b8a6, #0d9488)',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? '📤 Sending...' : '📧 Send Invitation'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
