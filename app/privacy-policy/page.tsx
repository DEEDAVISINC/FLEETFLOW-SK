'use client';

export default function PrivacyPolicyPage() {
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
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔒</div>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '10px',
            }}
          >
            Privacy Policy
          </h1>
          <div
            style={{
              fontSize: '1.1rem',
              color: '#64748b',
              fontWeight: '500',
            }}
          >
            FLEETFLOW TMS LLC
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
              1. Information We Collect
            </h2>
            <p style={{ marginBottom: '15px' }}>
              FleetFlow collects information necessary to provide transportation
              management services, including:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Personal Information:</strong> Contact details, driver
                qualifications, employment information
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Operational Data:</strong> Load information, vehicle
                data, route information, performance metrics
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Financial Information:</strong> Billing information,
                payment data, banking details (where authorized)
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Technical Data:</strong> System usage information, IP
                addresses, device information
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
                borderLeft: '4px solid #10b981',
                paddingLeft: '15px',
              }}
            >
              2. How We Use Your Information
            </h2>
            <p style={{ marginBottom: '15px' }}>
              We use collected information for the following purposes:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
              <li style={{ marginBottom: '8px' }}>
                Providing transportation management services
              </li>
              <li style={{ marginBottom: '8px' }}>
                Processing payments and billing
              </li>
              <li style={{ marginBottom: '8px' }}>
                Ensuring compliance with DOT and other regulations
              </li>
              <li style={{ marginBottom: '8px' }}>
                Improving our services and platform functionality
              </li>
              <li style={{ marginBottom: '8px' }}>
                Customer support and communication
              </li>
              <li style={{ marginBottom: '8px' }}>
                Legal compliance and regulatory reporting
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
              3. Data Sharing and Disclosure
            </h2>
            <p style={{ marginBottom: '15px' }}>
              We share information only as necessary for business operations and
              legal compliance:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Service Providers:</strong> Third-party vendors who
                assist in providing our services
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Regulatory Authorities:</strong> DOT, FMCSA, and other
                regulatory bodies as required
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Business Partners:</strong> Carriers, shippers, and
                other business partners as needed for operations
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Legal Requirements:</strong> When required by law, court
                order, or government request
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
              4. Your Privacy Rights
            </h2>
            <p style={{ marginBottom: '15px' }}>
              You have the following rights regarding your personal information:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Access:</strong> Request access to your personal
                information
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Correction:</strong> Request correction of inaccurate
                information
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Deletion:</strong> Request deletion of your personal
                information (subject to legal requirements)
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Portability:</strong> Request a copy of your data in a
                portable format
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Opt-out:</strong> Opt-out of certain data processing
                activities
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
              5. Data Security
            </h2>
            <p style={{ marginBottom: '15px' }}>
              We implement comprehensive security measures to protect your
              information:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
              <li style={{ marginBottom: '8px' }}>
                End-to-end encryption for data transmission
              </li>
              <li style={{ marginBottom: '8px' }}>
                AES-256 encryption for data storage
              </li>
              <li style={{ marginBottom: '8px' }}>
                Multi-factor authentication for system access
              </li>
              <li style={{ marginBottom: '8px' }}>
                Regular security audits and assessments
              </li>
              <li style={{ marginBottom: '8px' }}>
                24/7 security monitoring and incident response
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
                borderLeft: '4px solid #06b6d4',
                paddingLeft: '15px',
              }}
            >
              6. Contact Information
            </h2>
            <p style={{ marginBottom: '15px' }}>
              For questions about this privacy policy or to exercise your
              privacy rights:
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
                <strong>Privacy Team:</strong> privacy@fleetflowapp.com
              </p>
              <p style={{ marginBottom: '10px' }}>
                <strong>General Contact:</strong> contact@fleetflowapp.com
              </p>
              <p style={{ marginBottom: '10px' }}>
                <strong>Address:</strong> FLEETFLOW TMS LLC
                <br />
                [Address will be provided upon platform launch]
              </p>
            </div>
          </section>

          <section>
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
              7. Updates to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. We will
              notify you of any material changes via email or through our
              platform. Your continued use of FleetFlow after such changes
              indicates your acceptance of the updated privacy policy.
            </p>
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
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>🚛</div>
            <div style={{ fontWeight: '600', marginBottom: '5px' }}>
              FLEETFLOW TMS LLC
            </div>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>
              Advanced Transportation Management Solutions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
