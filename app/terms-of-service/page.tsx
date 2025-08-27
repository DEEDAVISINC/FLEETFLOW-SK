'use client';

export default function TermsOfServicePage() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '100vh',
        padding: '40px 20px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '40px',
            borderBottom: '2px solid #f1f5f9',
            paddingBottom: '30px',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📋</div>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '10px',
            }}
          >
            Terms of Service
          </h1>
          <div
            style={{
              fontSize: '1.1rem',
              color: '#64748b',
              fontWeight: '500',
            }}
          >
            FleetFlow™ Technologies, Inc.
          </div>
          <div
            style={{
              fontSize: '0.9rem',
              color: '#94a3b8',
              marginTop: '5px',
            }}
          >
            Effective Date: December 2024 | Last Updated: December 2024
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            fontSize: '1rem',
            lineHeight: '1.7',
            color: '#374151',
          }}
        >
          <section style={{ marginBottom: '30px' }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '15px',
                borderLeft: '4px solid #3b82f6',
                paddingLeft: '15px',
              }}
            >
              1. Acceptance of Terms
            </h2>
            <p style={{ marginBottom: '15px' }}>
              By accessing or using FleetFlow™ ("Service"), you agree to be
              bound by these Terms of Service ("Terms"). If you disagree with
              any part of these terms, then you may not access the Service.
            </p>
            <p style={{ marginBottom: '15px' }}>
              These Terms apply to all visitors, users, and others who access or
              use the Service.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '15px',
                borderLeft: '4px solid #10b981',
                paddingLeft: '15px',
              }}
            >
              2. Description of Service
            </h2>
            <p style={{ marginBottom: '15px' }}>
              FleetFlow is a comprehensive transportation management system that
              provides:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
              <li style={{ marginBottom: '8px' }}>
                Fleet management and dispatch operations
              </li>
              <li style={{ marginBottom: '8px' }}>
                Route optimization and load planning
              </li>
              <li style={{ marginBottom: '8px' }}>
                Driver management and compliance tracking
              </li>
              <li style={{ marginBottom: '8px' }}>
                Financial management and billing systems
              </li>
              <li style={{ marginBottom: '8px' }}>
                Regulatory compliance and reporting tools
              </li>
              <li style={{ marginBottom: '8px' }}>
                Analytics and performance monitoring
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '15px',
                borderLeft: '4px solid #f59e0b',
                paddingLeft: '15px',
              }}
            >
              3. User Accounts and Responsibilities
            </h2>
            <p style={{ marginBottom: '15px' }}>
              When you create an account with us, you must provide information
              that is accurate, complete, and current at all times. You are
              responsible for:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
              <li style={{ marginBottom: '8px' }}>
                Safeguarding your account password
              </li>
              <li style={{ marginBottom: '8px' }}>
                All activities that occur under your account
              </li>
              <li style={{ marginBottom: '8px' }}>
                Immediately notifying us of any unauthorized use
              </li>
              <li style={{ marginBottom: '8px' }}>
                Ensuring compliance with applicable laws and regulations
              </li>
              <li style={{ marginBottom: '8px' }}>
                Maintaining accurate and up-to-date information
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '15px',
                borderLeft: '4px solid #ef4444',
                paddingLeft: '15px',
              }}
            >
              4. Prohibited Uses
            </h2>
            <p style={{ marginBottom: '15px' }}>You may not use our Service:</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
              <li style={{ marginBottom: '8px' }}>
                For any unlawful purpose or to solicit others to perform
                unlawful acts
              </li>
              <li style={{ marginBottom: '8px' }}>
                To violate any international, federal, provincial, or state
                regulations or laws
              </li>
              <li style={{ marginBottom: '8px' }}>
                To infringe upon or violate our intellectual property rights or
                the intellectual property rights of others
              </li>
              <li style={{ marginBottom: '8px' }}>
                To harass, abuse, insult, harm, defame, slander, disparage,
                intimidate, or discriminate
              </li>
              <li style={{ marginBottom: '8px' }}>
                To submit false or misleading information
              </li>
              <li style={{ marginBottom: '8px' }}>
                To interfere with or circumvent the security features of the
                Service
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '15px',
                borderLeft: '4px solid #8b5cf6',
                paddingLeft: '15px',
              }}
            >
              5. Intellectual Property Rights
            </h2>
            <p style={{ marginBottom: '15px' }}>
              The Service and its original content, features, and functionality
              are and will remain the exclusive property of FleetFlow
              Technologies, Inc. and its licensors. The Service is protected by
              copyright, trademark, and other laws.
            </p>
            <p style={{ marginBottom: '15px' }}>
              Our trademarks and trade dress may not be used in connection with
              any product or service without our prior written consent.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '15px',
                borderLeft: '4px solid #06b6d4',
                paddingLeft: '15px',
              }}
            >
              6. Service Availability and Modifications
            </h2>
            <p style={{ marginBottom: '15px' }}>We reserve the right to:</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
              <li style={{ marginBottom: '8px' }}>
                Modify or discontinue, temporarily or permanently, the Service
                (or any part thereof)
              </li>
              <li style={{ marginBottom: '8px' }}>
                Refuse any user access to the Services without notice
              </li>
              <li style={{ marginBottom: '8px' }}>
                Remove or modify content at our sole discretion
              </li>
              <li style={{ marginBottom: '8px' }}>
                Set usage limits and restrict access to certain features
              </li>
            </ul>
            <p style={{ marginBottom: '15px' }}>
              We shall not be liable to you or to any third-party for any
              modification, price change, suspension, or discontinuance of the
              Service.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '15px',
                borderLeft: '4px solid #84cc16',
                paddingLeft: '15px',
              }}
            >
              7. Privacy and Data Protection
            </h2>
            <p style={{ marginBottom: '15px' }}>
              Your privacy is important to us. Please review our Privacy Policy,
              which also governs your use of the Service, to understand our
              practices.
            </p>
            <div
              style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #e2e8f0',
              }}
            >
              <p style={{ marginBottom: '0' }}>
                <a
                  href='/privacy-policy'
                  style={{
                    color: '#3b82f6',
                    textDecoration: 'none',
                    fontWeight: '600',
                  }}
                >
                  📋 View our Privacy Policy →
                </a>
              </p>
            </div>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '15px',
                borderLeft: '4px solid #f97316',
                paddingLeft: '15px',
              }}
            >
              8. Limitation of Liability
            </h2>
            <p style={{ marginBottom: '15px' }}>
              In no event shall FleetFlow Technologies, Inc., nor its directors,
              employees, partners, agents, suppliers, or affiliates, be liable
              for any indirect, incidental, special, consequential, or punitive
              damages, including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from your use of
              the Service.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '15px',
                borderLeft: '4px solid #dc2626',
                paddingLeft: '15px',
              }}
            >
              9. Termination
            </h2>
            <p style={{ marginBottom: '15px' }}>
              We may terminate or suspend your account and bar access to the
              Service immediately, without prior notice or liability, under our
              sole discretion, for any reason whatsoever and without limitation,
              including but not limited to a breach of the Terms.
            </p>
            <p style={{ marginBottom: '15px' }}>
              If you wish to terminate your account, you may simply discontinue
              using the Service.
            </p>
          </section>

          <section>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '15px',
                borderLeft: '4px solid #0891b2',
                paddingLeft: '15px',
              }}
            >
              10. Contact Information
            </h2>
            <p style={{ marginBottom: '15px' }}>
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <div
              style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #e2e8f0',
              }}
            >
              <p style={{ marginBottom: '10px' }}>
                <strong>Legal Team:</strong> legal@fleetflowapp.com
              </p>
              <p style={{ marginBottom: '10px' }}>
                <strong>General Contact:</strong> contact@fleetflowapp.com
              </p>
              <p style={{ marginBottom: '10px' }}>
                <strong>Address:</strong> FleetFlow Technologies, Inc.
                <br />
                [Address will be provided upon platform launch]
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: '40px',
            paddingTop: '30px',
            borderTop: '2px solid #f1f5f9',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🚛</div>
            <div style={{ fontWeight: '600', marginBottom: '5px' }}>
              FleetFlow™ Technologies, Inc.
            </div>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>
              Advanced Transportation Management Solutions
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <a
              href='/privacy-policy'
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '500',
              }}
            >
              Privacy Policy
            </a>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <a
              href='/terms-of-service'
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '500',
              }}
            >
              Terms of Service
            </a>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <a
              href='mailto:contact@fleetflowapp.com'
              style={{
                color: '#3b82f6',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '500',
              }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
