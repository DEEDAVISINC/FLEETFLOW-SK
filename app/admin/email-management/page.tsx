'use client';

import { useEffect, useState } from 'react';

interface EmailAlias {
  alias: string;
  forward: string;
  department?: string;
  isActive: boolean;
}

interface DepartmentContact {
  department: string;
  email: string;
  aliases: string[];
  responsibilities: string[];
}

interface SetupResult {
  success: boolean;
  aliasesCreated: number;
  aliasesFailed: number;
  errors: string[];
  warnings: string[];
}

export default function EmailManagementPage() {
  const [aliases, setAliases] = useState<EmailAlias[]>([]);
  const [contacts, setContacts] = useState<DepartmentContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [setupResult, setSetupResult] = useState<SetupResult | null>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [newAlias, setNewAlias] = useState({ alias: '', email: '' });
  const [defaultEmail, setDefaultEmail] = useState('ddavis@fleetflowapp.com');

  useEffect(() => {
    loadEmailStatus();
    loadDepartmentContacts();
  }, []);

  const loadEmailStatus = async () => {
    try {
      const response = await fetch('/api/email/departments?action=status');
      const data = await response.json();
      if (data.success) {
        setAliases(data.aliases);
      }
    } catch (error) {
      console.error('Error loading email status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartmentContacts = async () => {
    try {
      const response = await fetch('/api/email/departments?action=contacts');
      const data = await response.json();
      if (data.success) {
        setContacts(data.contacts);
      }
    } catch (error) {
      console.error('Error loading department contacts:', error);
    }
  };

  const setupAllEmails = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/email/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'setup-all',
          defaultEmail,
        }),
      });
      const data = await response.json();
      setSetupResult(data);
      if (data.success) {
        loadEmailStatus();
      }
    } catch (error) {
      console.error('Error setting up emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const testConfiguration = async () => {
    try {
      const response = await fetch('/api/email/departments?action=test');
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      console.error('Error testing configuration:', error);
    }
  };

  const createAlias = async () => {
    if (!newAlias.alias || !newAlias.email) {
      alert('Please fill in both alias and email');
      return;
    }

    try {
      const response = await fetch('/api/email/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-alias',
          alias: newAlias.alias,
          email: newAlias.email,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setNewAlias({ alias: '', email: '' });
        loadEmailStatus();
        alert('Alias created successfully');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating alias:', error);
      alert('Failed to create alias');
    }
  };

  const deleteAlias = async (alias: string) => {
    if (!confirm(`Are you sure you want to delete the alias "${alias}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/email/departments?alias=${alias}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        loadEmailStatus();
        alert('Alias deleted successfully');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting alias:', error);
      alert('Failed to delete alias');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        padding: '20px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1
            style={{
              color: 'white',
              fontSize: '2rem',
              fontWeight: '800',
              margin: '0 0 10px 0',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            📧 FleetFlow Email Management
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '0' }}>
            Manage department email aliases and ImprovMX forwarding
          </p>
        </div>

        {/* Control Panel */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ color: 'white', marginBottom: '20px' }}>
            Setup & Controls
          </h2>

          <div
            style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '20px',
              alignItems: 'center',
            }}
          >
            <input
              type='email'
              value={defaultEmail}
              onChange={(e) => setDefaultEmail(e.target.value)}
              placeholder='Default forward email'
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                color: 'white',
                minWidth: '250px',
              }}
            />
            <button
              onClick={setupAllEmails}
              disabled={loading}
              style={{
                background: loading
                  ? '#64748b'
                  : 'linear-gradient(135deg, #22c55e, #16a34a)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                color: 'white',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Setting up...' : '🚀 Setup All Departments'}
            </button>
            <button
              onClick={testConfiguration}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              🧪 Test Configuration
            </button>
          </div>

          {/* Setup Results */}
          {setupResult && (
            <div
              style={{
                background: setupResult.success
                  ? 'rgba(34, 197, 94, 0.1)'
                  : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid rgba(${setupResult.success ? '34, 197, 94' : '239, 68, 68'}, 0.2)`,
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '15px',
              }}
            >
              <div
                style={{
                  color: setupResult.success ? '#22c55e' : '#ef4444',
                  fontWeight: '600',
                }}
              >
                {setupResult.success ? '✅ Setup Completed' : '❌ Setup Failed'}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem',
                  marginTop: '5px',
                }}
              >
                Created: {setupResult.aliasesCreated} | Failed:{' '}
                {setupResult.aliasesFailed}
              </div>
              {setupResult.errors.length > 0 && (
                <div
                  style={{
                    color: '#ef4444',
                    fontSize: '0.9rem',
                    marginTop: '5px',
                  }}
                >
                  Errors: {setupResult.errors.join(', ')}
                </div>
              )}
            </div>
          )}

          {/* Test Results */}
          {testResults && (
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '8px',
                padding: '15px',
              }}
            >
              <div
                style={{
                  color: '#3b82f6',
                  fontWeight: '600',
                  marginBottom: '10px',
                }}
              >
                🧪 Configuration Test Results
              </div>
              {testResults.tests?.map((test: any, index: number) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '5px',
                  }}
                >
                  <span style={{ color: test.passed ? '#22c55e' : '#ef4444' }}>
                    {test.passed ? '✅' : '❌'}
                  </span>
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    {test.test}
                  </span>
                  {test.error && (
                    <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>
                      ({test.error})
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create New Alias */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            marginBottom: '20px',
          }}
        >
          <h2 style={{ color: 'white', marginBottom: '20px' }}>
            Create New Alias
          </h2>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <input
              type='text'
              value={newAlias.alias}
              onChange={(e) =>
                setNewAlias({ ...newAlias, alias: e.target.value })
              }
              placeholder='Alias (e.g., support)'
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                color: 'white',
                minWidth: '200px',
              }}
            />
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              @fleetflowapp.com →
            </span>
            <input
              type='email'
              value={newAlias.email}
              onChange={(e) =>
                setNewAlias({ ...newAlias, email: e.target.value })
              }
              placeholder='Forward to email'
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                color: 'white',
                minWidth: '250px',
              }}
            />
            <button
              onClick={createAlias}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              ➕ Create
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
        >
          {/* Current Email Aliases */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            <h2 style={{ color: 'white', marginBottom: '20px' }}>
              📬 Active Email Aliases ({aliases.length})
            </h2>

            {loading ? (
              <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Loading aliases...
              </div>
            ) : aliases.length === 0 ? (
              <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                No aliases configured
              </div>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {aliases.map((alias, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(148, 163, 184, 0.1)',
                      borderRadius: '8px',
                      padding: '15px',
                      marginBottom: '10px',
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
                        <div style={{ color: 'white', fontWeight: '600' }}>
                          {alias.alias}@fleetflowapp.com
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem',
                          }}
                        >
                          → {alias.forward}
                        </div>
                        {alias.department && (
                          <div
                            style={{
                              color: '#22c55e',
                              fontSize: '0.8rem',
                              marginTop: '5px',
                            }}
                          >
                            📂 {alias.department}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => deleteAlias(alias.alias)}
                        style={{
                          background:
                            'linear-gradient(135deg, #ef4444, #dc2626)',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          color: 'white',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Department Directory */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            <h2 style={{ color: 'white', marginBottom: '20px' }}>
              🏢 Department Directory ({contacts.length})
            </h2>

            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {contacts.map((contact, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      marginBottom: '5px',
                    }}
                  >
                    {contact.department}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem',
                      marginBottom: '10px',
                    }}
                  >
                    📧 {contact.email}
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <div
                      style={{
                        color: '#3b82f6',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        marginBottom: '5px',
                      }}
                    >
                      Email Aliases:
                    </div>
                    <div
                      style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}
                    >
                      {contact.aliases.map((alias, aliasIndex) => (
                        <span
                          key={aliasIndex}
                          style={{
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: '#3b82f6',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                          }}
                        >
                          {alias}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
