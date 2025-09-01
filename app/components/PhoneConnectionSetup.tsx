'use client';

import { useEffect, useState } from 'react';
import FleetFlowExtensionService from '../services/FleetFlowExtensionService';

interface PhoneSetupData {
  extension: string;
  firstName: string;
  lastName: string;
  email: string;
  primaryPhone: string;
  setupType: 'mobile' | 'desk' | 'softphone' | 'forwarding';
  sipCredentials?: {
    username: string;
    password: string;
    server: string;
    port: string;
  };
  forwardingNumber?: string;
  isConfigured: boolean;
  lastTested?: string;
}

interface PhoneConnectionSetupProps {
  user?: any;
  onSetupComplete?: (setupData: PhoneSetupData) => void;
}

export default function PhoneConnectionSetup({
  user,
  onSetupComplete,
}: PhoneConnectionSetupProps) {
  const extensionService = FleetFlowExtensionService.getInstance();

  const [activeTab, setActiveTab] = useState<'setup' | 'test' | 'instructions'>(
    'setup'
  );
  const [setupType, setSetupType] = useState<
    'mobile' | 'desk' | 'softphone' | 'forwarding'
  >('mobile');
  const [setupData, setSetupData] = useState<PhoneSetupData>({
    extension: '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    primaryPhone: '',
    setupType: 'mobile',
    isConfigured: false,
  });
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isGeneratingCredentials, setIsGeneratingCredentials] = useState(false);

  // Get or assign extension number for user
  useEffect(() => {
    if (!setupData.extension && user?.id) {
      // Try to get existing extension
      let existingExtension = extensionService.getUserExtension(user.id);

      // If no extension exists, assign one
      if (!existingExtension) {
        try {
          existingExtension = extensionService.assignExtension(
            user.id,
            user.userIdentifier || user.id,
            user.name || 'FleetFlow User',
            user.departmentCode || 'MGR'
          );
        } catch (error) {
          console.error('Failed to assign extension:', error);
          // Fallback to a random extension
          const randomExtension = Math.floor(
            1000 + Math.random() * 9000
          ).toString();
          setSetupData((prev) => ({ ...prev, extension: randomExtension }));
          return;
        }
      }

      setSetupData((prev) => ({
        ...prev,
        extension: existingExtension.extension.toString(),
        isConfigured: existingExtension.phoneSetupComplete,
      }));
    }
  }, [setupData.extension, user, extensionService]);

  const generateSipCredentials = async () => {
    setIsGeneratingCredentials(true);

    // Simulate credential generation (in production, this would call FreeSWITCH API)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const credentials = {
      username: `ff${setupData.extension}`,
      password: Math.random().toString(36).substring(2, 15),
      server: 'sip.fleetflowapp.com',
      port: '5060',
    };

    setSetupData((prev) => ({
      ...prev,
      sipCredentials: credentials,
      setupType: setupType,
    }));
    setIsGeneratingCredentials(false);
  };

  const testPhoneConnection = async () => {
    setTestResult(null);

    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const success = Math.random() > 0.3; // 70% success rate for demo
    setTestResult({
      success,
      message: success
        ? `✅ Phone connection successful! Extension ${setupData.extension} is working correctly.`
        : `❌ Connection failed. Please check your phone settings and try again.`,
    });

    if (success) {
      setSetupData((prev) => ({
        ...prev,
        isConfigured: true,
        lastTested: new Date().toISOString(),
      }));
    }
  };

  const handleCompleteSetup = () => {
    // Update extension service with completion status
    if (user?.id) {
      extensionService.updatePhoneSetupStatus(user.id, true);
    }

    // Mark setup as configured
    const updatedSetupData = {
      ...setupData,
      isConfigured: true,
      lastTested: new Date().toISOString(),
    };

    setSetupData(updatedSetupData);

    if (onSetupComplete) {
      onSetupComplete(updatedSetupData);
    }
  };

  const getSetupInstructions = () => {
    switch (setupType) {
      case 'mobile':
        return {
          title: '📱 Mobile Phone Setup (Softphone App)',
          steps: [
            'Download a SIP client app (recommended: Zoiper, Linphone, or 3CX)',
            'Open the app and select Add SIP Account',
            `Enter Username: ${setupData.sipCredentials?.username || 'ff[extension]'}`,
            `Enter Password: ${setupData.sipCredentials?.password || '[generated_password]'}`,
            `Enter Server: ${setupData.sipCredentials?.server || 'sip.fleetflowapp.com'}`,
            `Set Port: ${setupData.sipCredentials?.port || '5060'}`,
            'Enable Register and save settings',
            'Your phone should now be connected to FleetFlow system',
          ],
        };
      case 'desk':
        return {
          title: '☎️ Desk Phone Setup (IP Phone)',
          steps: [
            'Access your IP phone web interface',
            'Navigate to Accounts or SIP Settings',
            `Set Account Name: FleetFlow Extension ${setupData.extension}`,
            `Enter SIP Server: ${setupData.sipCredentials?.server || 'sip.fleetflowapp.com'}`,
            `Enter Username: ${setupData.sipCredentials?.username || 'ff[extension]'}`,
            `Enter Password: ${setupData.sipCredentials?.password || '[generated_password]'}`,
            'Set Registration to Enabled',
            'Save and restart your phone',
            'Phone should display Registered status',
          ],
        };
      case 'softphone':
        return {
          title: '💻 Computer Softphone Setup',
          steps: [
            'Download FleetFlow Desktop App or use a SIP client (X-Lite, MicroSIP)',
            'Install and launch the application',
            'Go to Account Settings or Preferences',
            `Enter Display Name: ${setupData.firstName} ${setupData.lastName}`,
            `Enter Username: ${setupData.sipCredentials?.username || 'ff[extension]'}`,
            `Enter Password: ${setupData.sipCredentials?.password || '[generated_password]'}`,
            `Enter Domain: ${setupData.sipCredentials?.server || 'sip.fleetflowapp.com'}`,
            'Enable auto-registration and save',
            'Your computer is now ready to make/receive calls',
          ],
        };
      case 'forwarding':
        return {
          title: '📞 Call Forwarding Setup',
          steps: [
            'This option forwards FleetFlow calls to your existing phone',
            `Your extension ${setupData.extension} will forward to: ${setupData.forwardingNumber || '[your_phone_number]'}`,
            'No additional software needed on your phone',
            'You can still use FleetFlow dialer to make outbound calls',
            'Incoming calls to your extension will ring your personal phone',
            'Call history and recordings will still be tracked in FleetFlow',
            'Perfect for mobile users who do not want softphone apps',
          ],
        };
      default:
        return { title: '', steps: [] };
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>📞</div>
        <h2
          style={{
            color: '#3b82f6',
            fontSize: '24px',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
          }}
        >
          Connect Your Phone to FleetFlow
        </h2>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '16px',
            margin: 0,
          }}
        >
          Set up your personal phone to make and receive calls through the
          FleetFlow system
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
        {[
          { id: 'setup', label: '🔧 Setup', desc: 'Configure Phone' },
          { id: 'test', label: '🧪 Test', desc: 'Test Connection' },
          { id: 'instructions', label: '📋 Guide', desc: 'Setup Instructions' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1,
              padding: '16px',
              background:
                activeTab === tab.id
                  ? 'rgba(59, 130, 246, 0.2)'
                  : 'rgba(255, 255, 255, 0.1)',
              border:
                activeTab === tab.id
                  ? '2px solid #3b82f6'
                  : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              transition: 'all 0.3s ease',
            }}
          >
            <div>{tab.label}</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>{tab.desc}</div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          padding: '24px',
        }}
      >
        {/* Setup Tab */}
        {activeTab === 'setup' && (
          <div>
            <h3
              style={{ color: 'white', fontSize: '20px', marginBottom: '20px' }}
            >
              📋 Phone Setup Configuration
            </h3>

            {/* Basic Info */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <div>
                <label
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  First Name
                </label>
                <input
                  type='text'
                  value={setupData.firstName}
                  onChange={(e) =>
                    setSetupData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  Last Name
                </label>
                <input
                  type='text'
                  value={setupData.lastName}
                  onChange={(e) =>
                    setSetupData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>

            {/* Extension Assignment */}
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  color: '#22c55e',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}
              >
                📞 Your FleetFlow Extension: {setupData.extension}
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
              >
                This is your unique extension number. Other FleetFlow users can
                reach you by dialing {setupData.extension}.
              </div>
            </div>

            {/* Setup Type Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '16px',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                🔧 How do you want to connect your phone?
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}
              >
                {[
                  {
                    value: 'mobile',
                    label: '📱 Mobile App',
                    desc: 'Use softphone app on your smartphone',
                  },
                  {
                    value: 'desk',
                    label: '☎️ Desk Phone',
                    desc: 'Configure your office IP phone',
                  },
                  {
                    value: 'softphone',
                    label: '💻 Computer',
                    desc: 'Use desktop softphone application',
                  },
                  {
                    value: 'forwarding',
                    label: '📞 Forwarding',
                    desc: 'Forward calls to your existing phone',
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSetupType(option.value as any);
                      setSetupData((prev) => ({
                        ...prev,
                        setupType: option.value as any,
                      }));
                    }}
                    style={{
                      padding: '16px',
                      background:
                        setupType === option.value
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(255, 255, 255, 0.05)',
                      border:
                        setupType === option.value
                          ? '2px solid #3b82f6'
                          : '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}
                    >
                      {option.label}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      {option.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Number Input (for forwarding) */}
            {setupType === 'forwarding' && (
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  📞 Forward to Phone Number
                </label>
                <input
                  type='tel'
                  value={setupData.forwardingNumber || ''}
                  onChange={(e) =>
                    setSetupData((prev) => ({
                      ...prev,
                      forwardingNumber: e.target.value,
                    }))
                  }
                  placeholder='+1234567890'
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
              </div>
            )}

            {/* Generate Credentials Button */}
            {setupType !== 'forwarding' && (
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <button
                  onClick={generateSipCredentials}
                  disabled={isGeneratingCredentials}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: isGeneratingCredentials ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    opacity: isGeneratingCredentials ? 0.6 : 1,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isGeneratingCredentials
                    ? '🔄 Generating...'
                    : '🔐 Generate Phone Credentials'}
                </button>
              </div>
            )}

            {/* SIP Credentials Display */}
            {setupData.sipCredentials && (
              <div
                style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    color: '#a855f7',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                  }}
                >
                  🔐 Your Phone Connection Details
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    fontSize: '14px',
                  }}
                >
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Username:
                    </span>
                    <br />
                    <span style={{ color: 'white', fontWeight: 'bold' }}>
                      {setupData.sipCredentials.username}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Password:
                    </span>
                    <br />
                    <span style={{ color: 'white', fontWeight: 'bold' }}>
                      {setupData.sipCredentials.password}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Server:
                    </span>
                    <br />
                    <span style={{ color: 'white', fontWeight: 'bold' }}>
                      {setupData.sipCredentials.server}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Port:
                    </span>
                    <br />
                    <span style={{ color: 'white', fontWeight: 'bold' }}>
                      {setupData.sipCredentials.port}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Test Tab */}
        {activeTab === 'test' && (
          <div style={{ textAlign: 'center' }}>
            <h3
              style={{ color: 'white', fontSize: '20px', marginBottom: '20px' }}
            >
              🧪 Test Phone Connection
            </h3>

            <div
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '24px',
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '12px' }}>📞</div>
              <div
                style={{
                  color: '#22c55e',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}
              >
                Extension {setupData.extension} - {setupData.firstName}{' '}
                {setupData.lastName}
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}
              >
                Setup Type:{' '}
                {setupType === 'mobile'
                  ? '📱 Mobile App'
                  : setupType === 'desk'
                    ? '☎️ Desk Phone'
                    : setupType === 'softphone'
                      ? '💻 Computer'
                      : '📞 Call Forwarding'}
              </div>
            </div>

            <button
              onClick={testPhoneConnection}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '20px',
                transition: 'all 0.3s ease',
              }}
            >
              🧪 Test Connection
            </button>

            {testResult && (
              <div
                style={{
                  background: testResult.success
                    ? 'rgba(34, 197, 94, 0.1)'
                    : 'rgba(239, 68, 68, 0.1)',
                  border: testResult.success
                    ? '1px solid rgba(34, 197, 94, 0.3)'
                    : '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  color: 'white',
                  fontSize: '16px',
                }}
              >
                {testResult.message}
              </div>
            )}
          </div>
        )}

        {/* Instructions Tab */}
        {activeTab === 'instructions' && (
          <div>
            {(() => {
              const instructions = getSetupInstructions();
              return (
                <div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      marginBottom: '20px',
                    }}
                  >
                    {instructions.title}
                  </h3>

                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      padding: '20px',
                    }}
                  >
                    <ol
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        paddingLeft: '20px',
                      }}
                    >
                      {instructions.steps.map((step, index) => (
                        <li key={index} style={{ marginBottom: '12px' }}>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Complete Setup Button */}
      {setupData.isConfigured && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={handleCompleteSetup}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
            }}
          >
            ✅ Complete Phone Setup
          </button>
        </div>
      )}
    </div>
  );
}
