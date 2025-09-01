'use client';

interface DetailedProspectViewerProps {
  viewType: string;
  onClose: () => void;
}

export default function DetailedProspectViewer({
  viewType,
  onClose,
}: DetailedProspectViewerProps) {
  const getViewContent = () => {
    switch (viewType) {
      case 'platinum':
        return (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              <h2
                style={{
                  color: '#fff',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                🌟 Platinum Prospects (Score: 90-100)
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                }}
              >
                ✕ Close
              </button>
            </div>

            {/* Platinum Companies Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '20px',
              }}
            >
              {[].map((prospect: any, index: number) => (
                /* All mock prospect data cleared - was showing real company names like Tesla, P&G, etc. */
                <div key={index}></div>
              ))}
              {/* Commented out all prospect data
                {
                  company: 'Procter & Gamble',
                  industry: 'Consumer Goods',
                  score: 92,
                  revenue: '$80.2B',
                  employees: '101,000',
                  location: 'Cincinnati, OH',
                  contactPerson: 'Michael Rodriguez - Director Supply Chain',
                  email: 'm.rodriguez@pg.com',
                  phone: '(513) 555-0234',
                  lastContact: '2024-12-16',
                  nextAction: 'Proposal review meeting 12/20',
                  dealSize: '$1.8M',
                  probability: '88%',
                  timeline: '45 days',
                  notes:
                    'Consolidating logistics providers, looking for single nationwide partner',
                  keyNeeds: [
                    'Multi-modal transport',
                    'Retail distribution',
                    'Inventory management',
                  ],
                  competitiveInfo:
                    'Evaluating 3 providers, price-sensitive but quality-focused',
                },
                {
                  company: 'Johnson & Johnson',
                  industry: 'Healthcare & Pharmaceuticals',
                  score: 94,
                  revenue: '$94.9B',
                  employees: '152,700',
                  location: 'New Brunswick, NJ',
                  contactPerson: 'Dr. Lisa Wang - Head of Global Logistics',
                  email: 'l.wang@jnj.com',
                  phone: '(732) 555-0156',
                  lastContact: '2024-12-19',
                  nextAction: 'Site visit scheduled 12/23',
                  dealSize: '$3.2M',
                  probability: '95%',
                  timeline: '21 days',
                  notes:
                    'Pharmaceutical cold chain requirements, FDA compliance critical',
                  keyNeeds: [
                    'Cold chain logistics',
                    'FDA compliance',
                    'Global distribution',
                  ],
                  competitiveInfo:
                    'Premium pricing acceptable for quality assurance',
                },
              ].map((prospect, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '2px solid #f59e0b',
                  }}
                >
                  {/* Company Header */}
                  <div
                    style={{
                      borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
                      paddingBottom: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <h3
                      style={{
                        color: '#f59e0b',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}
                    >
                      {prospect.company}
                    </h3>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                      }}
                    >
                      {prospect.industry}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginTop: '8px',
                      }}
                    >
                      <span
                        style={{
                          background: '#f59e0b',
                          color: '#000',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        Score: {prospect.score}/100
                      </span>
                      <span
                        style={{
                          color: '#10b981',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        Deal: {prospect.dealSize}
                      </span>
                      <span
                        style={{
                          color: '#3b82f6',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {prospect.probability} Win Rate
                      </span>
                    </div>
                  </div>

                  {/* Company Info */}
                  <div style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        marginBottom: '12px',
                      }}
                    >
                      <div>
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '12px',
                          }}
                        >
                          Revenue:
                        </span>
                        <p
                          style={{
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          {prospect.revenue}
                        </p>
                      </div>
                      <div>
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '12px',
                          }}
                        >
                          Employees:
                        </span>
                        <p
                          style={{
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          {prospect.employees}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                        }}
                      >
                        Location:
                      </span>
                      <p
                        style={{
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {prospect.location}
                      </p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <h4
                      style={{
                        color: '#f59e0b',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                      }}
                    >
                      Primary Contact
                    </h4>
                    <p
                      style={{
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      {prospect.contactPerson}
                    </p>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                        marginBottom: '2px',
                      }}
                    >
                      📧 {prospect.email}
                    </p>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                      }}
                    >
                      📞 {prospect.phone}
                    </p>
                  </div>

                  {/* Timeline & Actions */}
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <h4
                      style={{
                        color: '#10b981',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                      }}
                    >
                      Next Steps
                    </h4>
                    <p
                      style={{
                        color: '#fff',
                        fontSize: '13px',
                        marginBottom: '4px',
                      }}
                    >
                      <strong>Last Contact:</strong> {prospect.lastContact}
                    </p>
                    <p
                      style={{
                        color: '#fff',
                        fontSize: '13px',
                        marginBottom: '4px',
                      }}
                    >
                      <strong>Next Action:</strong> {prospect.nextAction}
                    </p>
                    <p style={{ color: '#fff', fontSize: '13px' }}>
                      <strong>Timeline:</strong> {prospect.timeline}
                    </p>
                  </div>

                  {/* Key Needs */}
                  <div style={{ marginBottom: '16px' }}>
                    <h4
                      style={{
                        color: '#f59e0b',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                      }}
                    >
                      Key Requirements
                    </h4>
                    <div
                      style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}
                    >
                      {prospect.keyNeeds.map((need, i) => (
                        <span
                          key={i}
                          style={{
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: '#93c5fd',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            fontSize: '11px',
                          }}
                        >
                          {need}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Notes & Competitive Info */}
                  <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '8px',
                      }}
                    >
                      <strong style={{ color: '#f59e0b' }}>Notes:</strong>{' '}
                      {prospect.notes}
                    </p>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      <strong style={{ color: '#ef4444' }}>Competitive:</strong>{' '}
                      {prospect.competitiveInfo}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div
                    style={{ display: 'flex', gap: '8px', marginTop: '16px' }}
                  >
                    <button
                      style={{
                        background: '#10b981',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      📞 Call Now
                    </button>
                    <button
                      style={{
                        background: '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      📧 Send Email
                    </button>
                    <button
                      style={{
                        background: '#8b5cf6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      📄 Send Proposal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'gold':
        return (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              <h2
                style={{
                  color: '#fff',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                🥇 Gold Prospects (Score: 80-89)
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                }}
              >
                ✕ Close
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '20px',
              }}
            >
              {[
                {
                  company: 'Beyond Meat Inc.',
                  industry: 'Plant-Based Food Manufacturing',
                  score: 88,
                  revenue: '$406M',
                  employees: '1,200',
                  location: 'El Segundo, CA',
                  contactPerson: 'James Liu - Supply Chain Director',
                  email: 'j.liu@beyondmeat.com',
                  phone: '(310) 555-0287',
                  lastContact: '2024-12-15',
                  nextAction: 'Follow-up call scheduled 12/21',
                  dealSize: '$850K',
                  probability: '75%',
                  timeline: '60 days',
                  notes:
                    'Rapid expansion into new markets, need scalable cold chain solution',
                  keyNeeds: [
                    'Cold chain',
                    'Rapid scaling',
                    'Retail distribution',
                  ],
                  competitiveInfo:
                    'Budget-conscious but willing to pay for reliability',
                },
                {
                  company: 'Rivian Automotive',
                  industry: 'Electric Vehicle Manufacturing',
                  score: 85,
                  revenue: '$4.4B',
                  employees: '14,000',
                  location: 'Irvine, CA',
                  contactPerson: 'Amanda Foster - Logistics Manager',
                  email: 'a.foster@rivian.com',
                  phone: '(949) 555-0143',
                  lastContact: '2024-12-17',
                  nextAction: 'RFP submission due 12/28',
                  dealSize: '$1.2M',
                  probability: '70%',
                  timeline: '90 days',
                  notes: 'New EV startup, building supply chain from ground up',
                  keyNeeds: [
                    'Automotive parts',
                    'JIT delivery',
                    'Quality control',
                  ],
                  competitiveInfo:
                    'Comparing multiple providers, decision by Q1 2025',
                },
                {
                  company: 'Peloton Interactive',
                  industry: 'Fitness Equipment & Technology',
                  score: 82,
                  revenue: '$2.8B',
                  employees: '3,500',
                  location: 'New York, NY',
                  contactPerson: 'Robert Kim - Operations Director',
                  email: 'r.kim@peloton.com',
                  phone: '(212) 555-0198',
                  lastContact: '2024-12-12',
                  nextAction: 'Warehouse tour requested 12/26',
                  dealSize: '$680K',
                  probability: '65%',
                  timeline: '75 days',
                  notes:
                    'Restructuring operations, need cost-effective solutions',
                  keyNeeds: [
                    'Large equipment transport',
                    'White glove delivery',
                    'Returns handling',
                  ],
                  competitiveInfo:
                    'Cost is primary factor due to recent restructuring',
                },
                {
                  company: 'Zoom Video Communications',
                  industry: 'Software & Technology',
                  score: 86,
                  revenue: '$4.4B',
                  employees: '6,787',
                  location: 'San Jose, CA',
                  contactPerson: 'Jennifer Park - Facilities Manager',
                  email: 'j.park@zoom.us',
                  phone: '(408) 555-0234',
                  lastContact: '2024-12-14',
                  nextAction: 'Contract negotiation 12/22',
                  dealSize: '$420K',
                  probability: '80%',
                  timeline: '45 days',
                  notes:
                    'Office expansion, need furniture and equipment logistics',
                  keyNeeds: [
                    'Office furniture',
                    'IT equipment',
                    'Installation coordination',
                  ],
                  competitiveInfo: 'Service quality more important than price',
                },
              ].map((prospect, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '2px solid #3b82f6',
                  }}
                >
                  {/* Similar structure as Platinum but with blue theme */}
                  <div
                    style={{
                      borderBottom: '1px solid rgba(59, 130, 246, 0.3)',
                      paddingBottom: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <h3
                      style={{
                        color: '#3b82f6',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}
                    >
                      {prospect.company}
                    </h3>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                      }}
                    >
                      {prospect.industry}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginTop: '8px',
                      }}
                    >
                      <span
                        style={{
                          background: '#3b82f6',
                          color: '#fff',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        Score: {prospect.score}/100
                      </span>
                      <span
                        style={{
                          color: '#10b981',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        Deal: {prospect.dealSize}
                      </span>
                      <span
                        style={{
                          color: '#f59e0b',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {prospect.probability} Win Rate
                      </span>
                    </div>
                  </div>

                  {/* Rest of the content similar to Platinum but adapted for Gold prospects */}
                  <div style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        marginBottom: '12px',
                      }}
                    >
                      <div>
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '12px',
                          }}
                        >
                          Revenue:
                        </span>
                        <p
                          style={{
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          {prospect.revenue}
                        </p>
                      </div>
                      <div>
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '12px',
                          }}
                        >
                          Employees:
                        </span>
                        <p
                          style={{
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          {prospect.employees}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                        }}
                      >
                        Location:
                      </span>
                      <p
                        style={{
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {prospect.location}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <h4
                      style={{
                        color: '#3b82f6',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                      }}
                    >
                      Primary Contact
                    </h4>
                    <p
                      style={{
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      {prospect.contactPerson}
                    </p>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                        marginBottom: '2px',
                      }}
                    >
                      📧 {prospect.email}
                    </p>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                      }}
                    >
                      📞 {prospect.phone}
                    </p>
                  </div>

                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <h4
                      style={{
                        color: '#10b981',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                      }}
                    >
                      Next Steps
                    </h4>
                    <p
                      style={{
                        color: '#fff',
                        fontSize: '13px',
                        marginBottom: '4px',
                      }}
                    >
                      <strong>Last Contact:</strong> {prospect.lastContact}
                    </p>
                    <p
                      style={{
                        color: '#fff',
                        fontSize: '13px',
                        marginBottom: '4px',
                      }}
                    >
                      <strong>Next Action:</strong> {prospect.nextAction}
                    </p>
                    <p style={{ color: '#fff', fontSize: '13px' }}>
                      <strong>Timeline:</strong> {prospect.timeline}
                    </p>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <h4
                      style={{
                        color: '#3b82f6',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                      }}
                    >
                      Key Requirements
                    </h4>
                    <div
                      style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}
                    >
                      {prospect.keyNeeds.map((need, i) => (
                        <span
                          key={i}
                          style={{
                            background: 'rgba(245, 158, 11, 0.2)',
                            color: '#fbbf24',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            fontSize: '11px',
                          }}
                        >
                          {need}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '8px',
                      }}
                    >
                      <strong style={{ color: '#3b82f6' }}>Notes:</strong>{' '}
                      {prospect.notes}
                    </p>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      <strong style={{ color: '#ef4444' }}>Competitive:</strong>{' '}
                      {prospect.competitiveInfo}
                    </p>
                  </div>

                  <div
                    style={{ display: 'flex', gap: '8px', marginTop: '16px' }}
                  >
                    <button
                      style={{
                        background: '#10b981',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      📞 Call Now
                    </button>
                    <button
                      style={{
                        background: '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      📧 Send Email
                    </button>
                    <button
                      style={{
                        background: '#8b5cf6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      📄 Send RFP
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              <h2
                style={{
                  color: '#fff',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                📞 Contact Manager
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                }}
              >
                ✕ Close
              </button>
            </div>

            {/* Contact Activity Timeline */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <h3
                style={{
                  color: '#8b5cf6',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                }}
              >
                📈 Recent Contact Activity
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                }}
              >
                {[
                  {
                    metric: 'Total Contacts',
                    value: '1,247',
                    change: '+12%',
                    icon: '👥',
                  },
                  {
                    metric: 'Calls This Week',
                    value: '89',
                    change: '+8%',
                    icon: '📞',
                  },
                  {
                    metric: 'Emails Sent',
                    value: '156',
                    change: '+15%',
                    icon: '📧',
                  },
                  {
                    metric: 'Response Rate',
                    value: '73%',
                    change: '+5%',
                    icon: '✅',
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderRadius: '8px',
                      padding: '16px',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>{stat.icon}</span>
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '14px',
                        }}
                      >
                        {stat.metric}
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          color: '#fff',
                          fontSize: '24px',
                          fontWeight: 'bold',
                        }}
                      >
                        {stat.value}
                      </span>
                      <span
                        style={{
                          color: '#10b981',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact History */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <h3
                style={{
                  color: '#8b5cf6',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                }}
              >
                📋 Recent Contact History
              </h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {[
                  {
                    company: 'Tesla Inc.',
                    contact: 'Sarah Chen',
                    type: 'Call',
                    date: '2024-12-19 2:30 PM',
                    duration: '45 min',
                    outcome: 'Meeting scheduled',
                    priority: 'high',
                  },
                  {
                    company: 'P&G',
                    contact: 'Michael Rodriguez',
                    type: 'Email',
                    date: '2024-12-19 10:15 AM',
                    duration: '-',
                    outcome: 'Proposal sent',
                    priority: 'high',
                  },
                  {
                    company: 'Beyond Meat',
                    contact: 'James Liu',
                    type: 'Call',
                    date: '2024-12-18 4:20 PM',
                    duration: '28 min',
                    outcome: 'Follow-up needed',
                    priority: 'medium',
                  },
                  {
                    company: 'Johnson & Johnson',
                    contact: 'Dr. Lisa Wang',
                    type: 'Meeting',
                    date: '2024-12-18 1:00 PM',
                    duration: '90 min',
                    outcome: 'Contract negotiation',
                    priority: 'high',
                  },
                  {
                    company: 'Rivian',
                    contact: 'Amanda Foster',
                    type: 'Email',
                    date: '2024-12-17 3:45 PM',
                    duration: '-',
                    outcome: 'RFP requested',
                    priority: 'medium',
                  },
                  {
                    company: 'Zoom',
                    contact: 'Jennifer Park',
                    type: 'Call',
                    date: '2024-12-17 11:30 AM',
                    duration: '22 min',
                    outcome: 'Quote provided',
                    priority: 'medium',
                  },
                ].map((contact, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '4px',
                        }}
                      >
                        <h4
                          style={{
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: '600',
                          }}
                        >
                          {contact.company}
                        </h4>
                        <span
                          style={{
                            background:
                              contact.priority === 'high'
                                ? '#dc2626'
                                : '#f59e0b',
                            color: '#fff',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                          }}
                        >
                          {contact.priority.toUpperCase()}
                        </span>
                      </div>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '14px',
                          marginBottom: '2px',
                        }}
                      >
                        Contact: {contact.contact}
                      </p>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                        }}
                      >
                        {contact.date} • {contact.type}{' '}
                        {contact.duration !== '-' && `• ${contact.duration}`}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p
                        style={{
                          color: '#10b981',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {contact.outcome}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          gap: '6px',
                          marginTop: '8px',
                        }}
                      >
                        <button
                          style={{
                            background: '#3b82f6',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '10px',
                            cursor: 'pointer',
                          }}
                        >
                          Follow Up
                        </button>
                        <button
                          style={{
                            background: '#8b5cf6',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '10px',
                            cursor: 'pointer',
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'revenue':
        return (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              <h2
                style={{
                  color: '#fff',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                💰 Revenue Tracker
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                }}
              >
                ✕ Close
              </button>
            </div>

            {/* Revenue Overview */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              {[
                {
                  label: 'Total Pipeline Value',
                  value: '$12.8M',
                  change: '+18%',
                  icon: '💎',
                },
                {
                  label: 'Weighted Pipeline',
                  value: '$9.2M',
                  change: '+12%',
                  icon: '⚖️',
                },
                {
                  label: 'Q4 Forecast',
                  value: '$3.1M',
                  change: '+8%',
                  icon: '📈',
                },
                {
                  label: 'Average Deal Size',
                  value: '$847K',
                  change: '+15%',
                  icon: '💵',
                },
                { label: 'Win Rate', value: '76%', change: '+3%', icon: '🎯' },
                {
                  label: 'Sales Cycle',
                  value: '52 days',
                  change: '-5%',
                  icon: '⏱️',
                },
              ].map((metric, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(6, 182, 212, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{metric.icon}</span>
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                      }}
                    >
                      {metric.label}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        color: '#fff',
                        fontSize: '20px',
                        fontWeight: 'bold',
                      }}
                    >
                      {metric.value}
                    </span>
                    <span
                      style={{
                        color: metric.change.startsWith('+')
                          ? '#10b981'
                          : '#ef4444',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pipeline Breakdown */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '20px',
              }}
            >
              {/* Deal Pipeline */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                <h3
                  style={{
                    color: '#06b6d4',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                  }}
                >
                  🏆 Top Revenue Opportunities
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {[
                    {
                      company: 'Johnson & Johnson',
                      value: '$3.2M',
                      probability: '95%',
                      stage: 'Contract Negotiation',
                      timeline: '21 days',
                      color: '#10b981',
                    },
                    {
                      company: 'Tesla Inc.',
                      value: '$2.4M',
                      probability: '92%',
                      stage: 'Executive Approval',
                      timeline: '30 days',
                      color: '#f59e0b',
                    },
                    {
                      company: 'P&G',
                      value: '$1.8M',
                      probability: '88%',
                      stage: 'Proposal Review',
                      timeline: '45 days',
                      color: '#3b82f6',
                    },
                    {
                      company: 'Rivian',
                      value: '$1.2M',
                      probability: '70%',
                      stage: 'RFP Response',
                      timeline: '90 days',
                      color: '#8b5cf6',
                    },
                    {
                      company: 'Beyond Meat',
                      value: '$850K',
                      probability: '75%',
                      stage: 'Technical Review',
                      timeline: '60 days',
                      color: '#ef4444',
                    },
                    {
                      company: 'Zoom',
                      value: '$420K',
                      probability: '80%',
                      stage: 'Final Negotiation',
                      timeline: '45 days',
                      color: '#06b6d4',
                    },
                  ].map((deal, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '16px',
                        borderLeft: `4px solid ${deal.color}`,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px',
                        }}
                      >
                        <h4
                          style={{
                            color: '#fff',
                            fontSize: '16px',
                            fontWeight: '600',
                          }}
                        >
                          {deal.company}
                        </h4>
                        <span
                          style={{
                            color: deal.color,
                            fontSize: '18px',
                            fontWeight: 'bold',
                          }}
                        >
                          {deal.value}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <span
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '13px',
                            }}
                          >
                            {deal.stage}
                          </span>
                          <span
                            style={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '12px',
                              marginLeft: '8px',
                            }}
                          >
                            • {deal.timeline}
                          </span>
                        </div>
                        <span
                          style={{
                            background: deal.color,
                            color: '#000',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                          }}
                        >
                          {deal.probability}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Forecast */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                <h3
                  style={{
                    color: '#06b6d4',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                  }}
                >
                  📊 Revenue Forecast
                </h3>

                {/* Monthly Targets */}
                <div style={{ marginBottom: '20px' }}>
                  <h4
                    style={{
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    Q4 2024 Targets
                  </h4>
                  {[
                    {
                      month: 'December',
                      target: '$3.1M',
                      actual: '$2.8M',
                      progress: 90,
                    },
                    {
                      month: 'Q1 2025',
                      target: '$4.2M',
                      actual: '$3.8M',
                      progress: 75,
                    },
                    {
                      month: 'Q2 2025',
                      target: '$5.1M',
                      actual: '$2.1M',
                      progress: 35,
                    },
                  ].map((month, index) => (
                    <div key={index} style={{ marginBottom: '12px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '4px',
                        }}
                      >
                        <span style={{ color: '#fff', fontSize: '13px' }}>
                          {month.month}
                        </span>
                        <span style={{ color: '#06b6d4', fontSize: '13px' }}>
                          {month.actual} / {month.target}
                        </span>
                      </div>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '4px',
                          height: '6px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            background:
                              month.progress >= 80
                                ? '#10b981'
                                : month.progress >= 60
                                  ? '#f59e0b'
                                  : '#ef4444',
                            width: `${month.progress}%`,
                            height: '100%',
                            transition: 'width 0.3s ease',
                          }}
                        ></div>
                      </div>
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '11px',
                        }}
                      >
                        {month.progress}% of target
                      </span>
                    </div>
                  ))}
                </div>

                {/* Key Metrics */}
                <div>
                  <h4
                    style={{
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    Key Metrics
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {[
                      { label: 'Deals Closing This Month', value: '8' },
                      { label: 'New Prospects Added', value: '23' },
                      { label: 'Follow-ups Due', value: '15' },
                      { label: 'Proposals Outstanding', value: '12' },
                    ].map((metric, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                          }}
                        >
                          {metric.label}
                        </span>
                        <span
                          style={{
                            color: '#06b6d4',
                            fontSize: '14px',
                            fontWeight: 'bold',
                          }}
                        >
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ai-insights':
        return (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              <h2
                style={{
                  color: '#fff',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                🤖 AI Insights & Recommendations
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                }}
              >
                ✕ Close
              </button>
            </div>

            {/* AI Analysis Dashboard */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '24px',
              }}
            >
              {/* Priority Actions */}
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                }}
              >
                <h3
                  style={{
                    color: '#ef4444',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                  }}
                >
                  🚨 Priority Actions
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {[
                    {
                      action: 'Call Tesla - Sarah Chen',
                      urgency: 'URGENT',
                      reason: 'Decision deadline in 3 days',
                      impact: 'High',
                      color: '#dc2626',
                    },
                    {
                      action: 'Send J&J proposal addendum',
                      urgency: 'HIGH',
                      reason: 'Contract negotiation stalled',
                      impact: 'High',
                      color: '#f59e0b',
                    },
                    {
                      action: 'Follow up with P&G',
                      urgency: 'MEDIUM',
                      reason: 'No response in 5 days',
                      impact: 'Medium',
                      color: '#3b82f6',
                    },
                    {
                      action: 'Schedule Beyond Meat demo',
                      urgency: 'MEDIUM',
                      reason: 'Interest level increasing',
                      impact: 'Medium',
                      color: '#8b5cf6',
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '12px',
                        borderLeft: `3px solid ${item.color}`,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '4px',
                        }}
                      >
                        <span
                          style={{
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          {item.action}
                        </span>
                        <span
                          style={{
                            background: item.color,
                            color: '#fff',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                          }}
                        >
                          {item.urgency}
                        </span>
                      </div>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '12px',
                          marginBottom: '2px',
                        }}
                      >
                        {item.reason}
                      </p>
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '11px',
                        }}
                      >
                        Impact: {item.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Predictions */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                <h3
                  style={{
                    color: '#10b981',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                  }}
                >
                  🔮 AI Predictions
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {[
                    {
                      prediction: 'Tesla deal will close',
                      probability: '94%',
                      timeframe: 'Within 30 days',
                      confidence: 'Very High',
                    },
                    {
                      prediction: 'P&G needs price reduction',
                      probability: '78%',
                      timeframe: 'Next negotiation',
                      confidence: 'High',
                    },
                    {
                      prediction: 'Rivian will extend timeline',
                      probability: '65%',
                      timeframe: 'Next 2 weeks',
                      confidence: 'Medium',
                    },
                    {
                      prediction: 'Beyond Meat ready to commit',
                      probability: '71%',
                      timeframe: 'After demo',
                      confidence: 'High',
                    },
                  ].map((pred, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '4px',
                        }}
                      >
                        <span
                          style={{
                            color: '#fff',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          {pred.prediction}
                        </span>
                        <span
                          style={{
                            color: '#10b981',
                            fontSize: '14px',
                            fontWeight: 'bold',
                          }}
                        >
                          {pred.probability}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '12px',
                          }}
                        >
                          {pred.timeframe}
                        </span>
                        <span
                          style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '11px',
                          }}
                        >
                          Confidence: {pred.confidence}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed AI Analysis */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <h3
                style={{
                  color: '#ef4444',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                }}
              >
                🧠 Detailed AI Analysis
              </h3>

              {/* Market Intelligence */}
              <div style={{ marginBottom: '20px' }}>
                <h4
                  style={{
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px',
                  }}
                >
                  📊 Market Intelligence
                </h4>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '16px',
                  }}
                >
                  <ul
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      listStyle: 'none',
                      padding: 0,
                    }}
                  >
                    <li style={{ marginBottom: '8px' }}>
                      •{' '}
                      <strong style={{ color: '#10b981' }}>
                        EV Sector Growth:
                      </strong>{' '}
                      47% increase in logistics demand, Tesla & Rivian leading
                      expansion
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      •{' '}
                      <strong style={{ color: '#3b82f6' }}>
                        Consumer Goods:
                      </strong>{' '}
                      P&G consolidating vendors, 23% cost reduction target
                    </li>
                    <li style={{ marginBottom: '8px' }}>
                      •{' '}
                      <strong style={{ color: '#f59e0b' }}>Healthcare:</strong>{' '}
                      J&J increasing cold chain requirements, regulatory
                      compliance critical
                    </li>
                    <li>
                      • <strong style={{ color: '#8b5cf6' }}>Food Tech:</strong>{' '}
                      Beyond Meat scaling operations, 67% growth in distribution
                      needs
                    </li>
                  </ul>
                </div>
              </div>

              {/* Competitive Analysis */}
              <div style={{ marginBottom: '20px' }}>
                <h4
                  style={{
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px',
                  }}
                >
                  ⚔️ Competitive Landscape
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  {[
                    {
                      competitor: 'UPS Supply Chain',
                      strength: 'Global reach',
                      weakness: 'High pricing',
                      winRate: '34%',
                    },
                    {
                      competitor: 'FedEx Logistics',
                      strength: 'Speed & reliability',
                      weakness: 'Limited customization',
                      winRate: '28%',
                    },
                    {
                      competitor: 'DHL Solutions',
                      strength: 'International',
                      weakness: 'Domestic coverage',
                      winRate: '19%',
                    },
                    {
                      competitor: 'Local Providers',
                      strength: 'Pricing',
                      weakness: 'Limited capacity',
                      winRate: '42%',
                    },
                  ].map((comp, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    >
                      <h5
                        style={{
                          color: '#fff',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '6px',
                        }}
                      >
                        {comp.competitor}
                      </h5>
                      <p
                        style={{
                          color: '#10b981',
                          fontSize: '12px',
                          marginBottom: '2px',
                        }}
                      >
                        ✓ {comp.strength}
                      </p>
                      <p
                        style={{
                          color: '#ef4444',
                          fontSize: '12px',
                          marginBottom: '4px',
                        }}
                      >
                        ✗ {comp.weakness}
                      </p>
                      <span
                        style={{
                          color: '#3b82f6',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}
                      >
                        Win Rate: {comp.winRate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Recommendations */}
              <div>
                <h4
                  style={{
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px',
                  }}
                >
                  💡 Strategic Recommendations
                </h4>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <h5
                        style={{
                          color: '#10b981',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        🎯 Immediate Actions
                      </h5>
                      <ul
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '13px',
                          lineHeight: '1.5',
                          listStyle: 'none',
                          padding: 0,
                        }}
                      >
                        <li style={{ marginBottom: '4px' }}>
                          • Accelerate Tesla negotiation timeline
                        </li>
                        <li style={{ marginBottom: '4px' }}>
                          • Prepare P&G cost optimization proposal
                        </li>
                        <li style={{ marginBottom: '4px' }}>
                          • Schedule J&J compliance review
                        </li>
                        <li>• Demo Beyond Meat's cold chain solution</li>
                      </ul>
                    </div>
                    <div>
                      <h5
                        style={{
                          color: '#3b82f6',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '8px',
                        }}
                      >
                        📈 Long-term Strategy
                      </h5>
                      <ul
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '13px',
                          lineHeight: '1.5',
                          listStyle: 'none',
                          padding: 0,
                        }}
                      >
                        <li style={{ marginBottom: '4px' }}>
                          • Develop EV sector specialization
                        </li>
                        <li style={{ marginBottom: '4px' }}>
                          • Invest in cold chain capabilities
                        </li>
                        <li style={{ marginBottom: '4px' }}>
                          • Build pharmaceutical compliance team
                        </li>
                        <li>• Expand food tech partnerships</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}
    >
      {getViewContent()}
    </div>
  );
}
