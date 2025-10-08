'use client';

/**
 * FLEETFLOW SMS CONSENT & OPT-IN PAGE
 *
 * This page demonstrates how users consent to receive SMS messages from FleetFlow.
 * It serves as the consent page URL for Twilio toll-free verification.
 *
 * Required for Twilio toll-free verification compliance
 */

export default function SMSConsentPage() {
  return (
    <div
      style={{
        padding: '40px 20px',
        paddingTop: '120px',
        background: `
          linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
          radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%)
        `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px',
        backgroundPosition: '0 0, 0 0, 100% 100%',
        minHeight: '100vh',
        color: '#ffffff',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Professional Header */}
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
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 8px 0',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            📱 FleetFlow SMS Messaging & Consent
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
            }}
          >
            How users consent to receive SMS messages from FleetFlow • Last
            Updated:{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* HOW USERS OPT-IN Section */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#ffffff',
            }}
          >
            How to Opt-In to SMS Messages
          </h2>
          <p
            style={{
              marginBottom: '24px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '16px',
            }}
          >
            Users can consent to receive SMS messages from FleetFlow in the
            following ways:
          </p>

          {/* During Registration Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '20px',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
            }}
          >
            <h3
              style={{
                fontWeight: 'bold',
                marginBottom: '12px',
                color: '#ffffff',
                fontSize: '20px',
              }}
            >
              ✅ During Account Registration
            </h3>
            <p
              style={{
                marginBottom: '16px',
                color: 'rgba(255, 255, 255, 0.95)',
              }}
            >
              When creating a FleetFlow account, users will see the following
              opt-in checkbox:
            </p>
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '20px',
                marginTop: '16px',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                }}
              >
                <input
                  type='checkbox'
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: '12px',
                    marginTop: '2px',
                    cursor: 'pointer',
                    accentColor: '#3b82f6',
                  }}
                  disabled
                  checked
                />
                <span style={{ color: '#1f2937', lineHeight: '1.6' }}>
                  <strong>
                    I agree to receive SMS text messages from FleetFlow
                  </strong>{' '}
                  regarding load alerts, shipment updates, dispatch
                  notifications, payment reminders, and service updates. Message
                  frequency varies based on your activity and preferences.
                  Message and data rates may apply. You can opt-out at any time
                  by replying <strong>STOP</strong> to any message. Reply{' '}
                  <strong>HELP</strong> for assistance.
                </span>
              </label>
            </div>
          </div>

          {/* Through Account Settings Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
            }}
          >
            <h3
              style={{
                fontWeight: 'bold',
                marginBottom: '12px',
                color: '#ffffff',
                fontSize: '20px',
              }}
            >
              ⚙️ Through Account Settings
            </h3>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.95)',
                marginBottom: '12px',
              }}
            >
              Existing users can opt-in to SMS notifications at any time by:
            </p>
            <ol
              style={{
                marginLeft: '20px',
                marginTop: '12px',
                color: 'rgba(255, 255, 255, 0.95)',
                lineHeight: '1.8',
              }}
            >
              <li>Logging into their FleetFlow account</li>
              <li>Navigating to Profile Settings → Notifications</li>
              <li>Enabling "SMS Notifications" toggle</li>
              <li>Reviewing and accepting the SMS consent agreement</li>
            </ol>
          </div>
        </div>

        {/* TYPES OF MESSAGES Section */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#ffffff',
            }}
          >
            Types of SMS Messages You May Receive
          </h2>
          <p
            style={{
              marginBottom: '24px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '16px',
            }}
          >
            By opting in, you agree to receive the following types of messages
            from FleetFlow:
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px',
            }}
          >
            {[
              {
                icon: '🚚',
                title: 'Load Alerts',
                desc: 'Notifications about new load opportunities matching your preferences',
                color: '#3b82f6',
              },
              {
                icon: '📦',
                title: 'Shipment Updates',
                desc: 'Real-time status updates on active shipments and deliveries',
                color: '#8b5cf6',
              },
              {
                icon: '📍',
                title: 'Dispatch Notifications',
                desc: 'Pick-up and delivery instructions, route changes, and scheduling updates',
                color: '#06b6d4',
              },
              {
                icon: '💰',
                title: 'Payment Reminders',
                desc: 'Invoices due, payment confirmations, and billing notifications',
                color: '#10b981',
              },
              {
                icon: '⚠️',
                title: 'Critical Alerts',
                desc: 'Urgent notifications requiring immediate attention (delays, issues, emergencies)',
                color: '#f59e0b',
              },
              {
                icon: '🔔',
                title: 'Service Updates',
                desc: 'Important announcements about FleetFlow features and maintenance',
                color: '#ec4899',
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                  {item.icon}
                </div>
                <strong
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '18px',
                    color: '#ffffff',
                  }}
                >
                  {item.title}
                </strong>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                    lineHeight: '1.6',
                  }}
                >
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: 'rgba(251, 191, 36, 0.2)',
              border: '2px solid rgba(251, 191, 36, 0.4)',
              borderRadius: '12px',
              fontSize: '15px',
              color: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            <strong>📊 Message Frequency:</strong> Message frequency varies
            based on your account activity, preferences, and business needs. On
            average, active users receive 5-20 messages per week.
          </div>
        </div>

        {/* MESSAGE & DATA RATES Section */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#ffffff',
            }}
          >
            Message & Data Rates
          </h2>
          <div
            style={{
              padding: '20px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '2px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '12px',
              marginBottom: '16px',
            }}
          >
            <strong style={{ color: '#fca5a5', fontSize: '16px' }}>
              Important:
            </strong>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                marginTop: '8px',
                marginBottom: 0,
              }}
            >
              Standard message and data rates from your mobile carrier may
              apply. FleetFlow does not charge for SMS messages, but your
              carrier may charge you for texts sent and received. Contact your
              mobile carrier for details about your messaging plan.
            </p>
          </div>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0,
            }}
          >
            FleetFlow is not responsible for any charges you may incur from your
            mobile carrier for receiving SMS messages.
          </p>
        </div>

        {/* OPT-OUT Section */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#ffffff',
            }}
          >
            How to Opt-Out (Unsubscribe)
          </h2>
          <p
            style={{
              marginBottom: '24px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '16px',
            }}
          >
            You can opt-out of receiving SMS messages from FleetFlow at any time
            using any of these methods:
          </p>

          <div
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '16px',
              boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)',
            }}
          >
            <h3
              style={{
                fontWeight: 'bold',
                marginBottom: '12px',
                fontSize: '20px',
                color: '#ffffff',
              }}
            >
              ✉️ Reply "STOP" to Any Message
            </h3>
            <p
              style={{
                marginBottom: '12px',
                color: 'rgba(255, 255, 255, 0.95)',
              }}
            >
              The fastest way to opt-out: Simply reply <strong>STOP</strong> to
              any SMS message from FleetFlow. You will receive a confirmation
              message and will no longer receive SMS messages.
            </p>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontStyle: 'italic',
                margin: 0,
              }}
            >
              Accepted commands: STOP, UNSUBSCRIBE, CANCEL, END, QUIT
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h3
              style={{
                fontWeight: 'bold',
                marginBottom: '12px',
                fontSize: '20px',
                color: '#ffffff',
              }}
            >
              ⚙️ Through Account Settings
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
              Log into your FleetFlow account, go to Profile Settings →
              Notifications, and disable the "SMS Notifications" toggle.
            </p>
          </div>
        </div>

        {/* HELP Section */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#ffffff',
            }}
          >
            Need Help?
          </h2>
          <p
            style={{
              marginBottom: '16px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '16px',
            }}
          >
            For assistance with SMS messages, you can:
          </p>
          <ul
            style={{
              marginLeft: '20px',
              marginBottom: '16px',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.8',
            }}
          >
            <li>
              Reply <strong>HELP</strong> to any SMS message from FleetFlow
            </li>
            <li>
              Email us at{' '}
              <a
                href='mailto:support@fleetflowapp.com'
                style={{ color: '#60a5fa', textDecoration: 'none' }}
              >
                support@fleetflowapp.com
              </a>
            </li>
            <li>
              Call us at <strong>1-800-FLEETFLOW</strong> (1-800-353-3835)
            </li>
            <li>
              Visit our support center at{' '}
              <a
                href='https://fleetflowapp.com/support'
                style={{ color: '#60a5fa', textDecoration: 'none' }}
              >
                fleetflowapp.com/support
              </a>
            </li>
          </ul>
        </div>

        {/* PRIVACY & TERMS Section */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#ffffff',
            }}
          >
            Privacy & Terms
          </h2>
          <p
            style={{
              marginBottom: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '16px',
            }}
          >
            Your phone number and SMS consent preferences are stored securely
            and used only for the purposes described on this page. We do not
            sell or share your phone number with third parties for marketing
            purposes.
          </p>
          <p
            style={{
              marginBottom: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '16px',
            }}
          >
            For more information, please review:
          </p>
          <ul
            style={{
              marginLeft: '20px',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.8',
            }}
          >
            <li>
              <a
                href='/privacy-policy'
                style={{ color: '#60a5fa', textDecoration: 'none' }}
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href='/terms-of-service'
                style={{ color: '#60a5fa', textDecoration: 'none' }}
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href='/sms-terms'
                style={{ color: '#60a5fa', textDecoration: 'none' }}
              >
                SMS Terms and Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* CONTACT INFO Footer */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#ffffff',
            }}
          >
            FleetFlow Contact Information
          </h2>
          <p style={{ marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)' }}>
            Email:{' '}
            <a
              href='mailto:support@fleetflowapp.com'
              style={{ color: '#60a5fa', textDecoration: 'none' }}
            >
              support@fleetflowapp.com
            </a>
          </p>
          <p style={{ marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)' }}>
            Phone: 1-800-FLEETFLOW (1-800-353-3835)
          </p>
          <p style={{ marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)' }}>
            Website:{' '}
            <a
              href='https://fleetflowapp.com'
              style={{ color: '#60a5fa', textDecoration: 'none' }}
            >
              fleetflowapp.com
            </a>
          </p>
          <p
            style={{
              fontSize: '14px',
              marginTop: '16px',
              opacity: 0.7,
              color: '#ffffff',
            }}
          >
            © {new Date().getFullYear()} FleetFlow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
