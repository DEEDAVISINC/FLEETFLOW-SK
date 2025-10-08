'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * SMS CONSENT CHECKBOX COMPONENT
 *
 * IMPORTANT: This is the exact opt-in language required for Twilio compliance.
 * DO NOT modify this text without updating the Twilio toll-free verification.
 *
 * Usage:
 * ```tsx
 * <SMSConsentCheckbox
 *   checked={smsConsent}
 *   onChange={(checked) => setSmsConsent(checked)}
 *   required={smsNotificationsEnabled}
 * />
 * ```
 */

interface SMSConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  showLearnMore?: boolean;
}

export default function SMSConsentCheckbox({
  checked,
  onChange,
  required = false,
  disabled = false,
  showLearnMore = true,
}: SMSConsentCheckboxProps) {
  const [showFullText, setShowFullText] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div
      style={{
        backgroundColor: '#f0f9ff',
        border: '2px solid #3b82f6',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
      }}
    >
      <label
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <input
          type='checkbox'
          checked={checked}
          onChange={handleCheckboxChange}
          disabled={disabled}
          required={required}
          style={{
            width: '20px',
            height: '20px',
            marginRight: '12px',
            marginTop: '2px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            accentColor: '#3b82f6',
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '8px' }}>
            <strong style={{ fontSize: '15px', color: '#1e40af' }}>
              SMS Text Message Consent{required && ' *'}
            </strong>
          </div>

          {/* THIS IS THE EXACT OPT-IN TEXT FOR TWILIO COMPLIANCE */}
          <div
            style={{ fontSize: '14px', lineHeight: '1.6', color: '#1f2937' }}
          >
            I agree to receive SMS text messages from <strong>FleetFlow</strong>{' '}
            regarding{' '}
            <strong>
              load alerts, shipment updates, dispatch notifications, payment
              reminders, and service updates
            </strong>
            .
            {!showFullText && (
              <>
                {' '}
                <button
                  type='button'
                  onClick={() => setShowFullText(true)}
                  style={{
                    color: '#3b82f6',
                    textDecoration: 'underline',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: '14px',
                  }}
                >
                  Read more...
                </button>
              </>
            )}
            {showFullText && (
              <>
                {' '}
                Message frequency varies based on your activity and preferences.{' '}
                <strong>Message and data rates may apply.</strong> You can
                opt-out at any time by replying <strong>STOP</strong> to any
                message. Reply <strong>HELP</strong> for assistance. See our{' '}
                <Link
                  href='/privacy-policy'
                  target='_blank'
                  style={{
                    color: '#3b82f6',
                    textDecoration: 'underline',
                  }}
                >
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link
                  href='/terms-of-service'
                  target='_blank'
                  style={{
                    color: '#3b82f6',
                    textDecoration: 'underline',
                  }}
                >
                  Terms of Service
                </Link>
                .
              </>
            )}
          </div>

          {showLearnMore && (
            <div
              style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #bfdbfe',
              }}
            >
              <Link
                href='/sms-consent'
                target='_blank'
                style={{
                  fontSize: '13px',
                  color: '#3b82f6',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>📱</span>
                <span>Learn more about SMS notifications</span>
                <span>→</span>
              </Link>
            </div>
          )}

          {required && !checked && (
            <div
              style={{
                marginTop: '8px',
                fontSize: '13px',
                color: '#dc2626',
                fontStyle: 'italic',
              }}
            >
              ⚠️ SMS consent is required to enable SMS notifications
            </div>
          )}
        </div>
      </label>

      {/* Information Box */}
      <div
        style={{
          marginTop: '12px',
          padding: '10px 12px',
          backgroundColor: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#78350f',
        }}
      >
        <strong>💡 What you'll receive:</strong> Important updates about loads,
        shipments, and payments. You can customize notification preferences in
        your account settings after registration.
      </div>
    </div>
  );
}

/**
 * SIMPLE VERSION (for inline forms)
 *
 * If you need a more compact version without the styling:
 */
export function SMSConsentCheckboxSimple({
  checked,
  onChange,
  required = false,
  disabled = false,
}: SMSConsentCheckboxProps) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        lineHeight: '1.5',
      }}
    >
      <input
        type='checkbox'
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        required={required}
        style={{
          width: '18px',
          height: '18px',
          marginRight: '10px',
          marginTop: '2px',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      />
      <span>
        I agree to receive SMS text messages from FleetFlow regarding load
        alerts, shipment updates, dispatch notifications, payment reminders, and
        service updates. Message frequency varies. Message and data rates may
        apply. Reply STOP to opt-out. Reply HELP for assistance.{' '}
        {required && <span style={{ color: '#dc2626' }}>*</span>}
      </span>
    </label>
  );
}

/**
 * EXAMPLE USAGE IN REGISTRATION FORM
 *
 * ```tsx
 * import SMSConsentCheckbox from './SMSConsentCheckbox';
 *
 * function RegistrationForm() {
 *   const [smsNotifications, setSmsNotifications] = useState(false);
 *   const [smsConsent, setSmsConsent] = useState(false);
 *
 *   const handleSubmit = async (e) => {
 *     e.preventDefault();
 *
 *     // Validate SMS consent if SMS notifications are enabled
 *     if (smsNotifications && !smsConsent) {
 *       alert('Please consent to receive SMS messages');
 *       return;
 *     }
 *
 *     // Submit form with smsConsent field
 *     const formData = {
 *       ...otherFields,
 *       smsNotifications,
 *       smsConsent,
 *     };
 *
 *     await fetch('/api/auth/register-complete', {
 *       method: 'POST',
 *       body: JSON.stringify(formData),
 *     });
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {/* Other form fields... *\/}
 *
 *       {/* SMS Notifications Toggle *\/}
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={smsNotifications}
 *           onChange={(e) => setSmsNotifications(e.target.checked)}
 *         />
 *         Enable SMS Notifications
 *       </label>
 *
 *       {/* SMS Consent Checkbox (shown only if SMS is enabled) *\/}
 *       {smsNotifications && (
 *         <SMSConsentCheckbox
 *           checked={smsConsent}
 *           onChange={setSmsConsent}
 *           required={true}
 *         />
 *       )}
 *
 *       <button type="submit">Register</button>
 *     </form>
 *   );
 * }
 * ```
 */
