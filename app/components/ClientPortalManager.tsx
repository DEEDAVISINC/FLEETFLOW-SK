'use client';

import React, { useEffect, useState } from 'react';
import {
  ClientOrganization,
  ClientUser,
  clientPortalService,
} from '../services/ClientPortalService';

interface ClientPortalManagerProps {
  freightForwarderId: string;
  freightForwarderName: string;
}

export default function ClientPortalManager({
  freightForwarderId,
  freightForwarderName,
}: ClientPortalManagerProps) {
  const [clients, setClients] = useState<ClientOrganization[]>([]);
  const [selectedClient, setSelectedClient] =
    useState<ClientOrganization | null>(null);
  const [clientUsers, setClientUsers] = useState<ClientUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);

  useEffect(() => {
    loadClients();
  }, [freightForwarderId]);

  const loadClients = async () => {
    try {
      setLoading(true);
      // In production: Fetch from API
      // For now, using mock data
      const mockClients: ClientOrganization[] = [
        {
          id: 'client-demo-001',
          freightForwarderId,
          companyName: 'ABC Shipping Corporation',
          legalName: 'ABC Shipping Corp LLC',
          taxId: '12-3456789',
          address: {
            street: '123 Business Ave',
            city: 'Los Angeles',
            state: 'CA',
            zip: '90210',
            country: 'USA',
          },
          branding: {
            primaryColor: '#667eea',
            secondaryColor: '#764ba2',
            portalName: 'ABC Shipping Portal',
          },
          settings: {
            allowedFileTypes: [
              'pdf',
              'jpg',
              'png',
              'doc',
              'docx',
              'xls',
              'xlsx',
            ],
            maxFileSize: 10,
            autoNotifications: true,
            requireApprovalWorkflow: false,
            customFields: {},
          },
          contacts: [],
          subscriptionTier: 'PROFESSIONAL',
          isActive: true,
          createdAt: new Date('2024-01-15'),
        },
      ];
      setClients(mockClients);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClientUsers = async (clientId: string) => {
    try {
      // In production: Fetch from API
      const mockUsers: ClientUser[] = [
        {
          id: 'user-demo-001',
          clientId,
          email: 'john.smith@abcshipping.com',
          firstName: 'John',
          lastName: 'Smith',
          role: 'MANAGER',
          permissions: [
            { resource: 'shipments', action: 'read', scope: 'all' },
            { resource: 'documents', action: 'write', scope: 'assigned' },
            { resource: 'payments', action: 'read', scope: 'assigned' },
          ],
          isActive: true,
          createdAt: new Date('2024-01-15'),
        },
        {
          id: 'user-demo-002',
          clientId,
          email: 'sarah.jones@abcshipping.com',
          firstName: 'Sarah',
          lastName: 'Jones',
          role: 'USER',
          permissions: [
            { resource: 'shipments', action: 'read', scope: 'assigned' },
            { resource: 'documents', action: 'write', scope: 'assigned' },
          ],
          isActive: true,
          createdAt: new Date('2024-01-16'),
        },
      ];
      setClientUsers(mockUsers);
    } catch (error) {
      console.error('Error loading client users:', error);
    }
  };

  const handleCreateClient = async (
    clientData: Partial<ClientOrganization>
  ) => {
    try {
      await clientPortalService.createClientOrganization({
        freightForwarderId,
        companyName: clientData.companyName!,
        legalName: clientData.legalName,
        taxId: clientData.taxId,
        address: clientData.address!,
        branding: clientData.branding,
        settings: clientData.settings,
      });

      await loadClients();
      setShowCreateForm(false);
      alert('Client organization created successfully!');
    } catch (error) {
      console.error('Error creating client:', error);
      alert('Failed to create client organization');
    }
  };

  const handleAddUser = async (userData: Partial<ClientUser>) => {
    if (!selectedClient) return;

    try {
      await clientPortalService.addClientUser({
        clientId: selectedClient.id,
        email: userData.email!,
        firstName: userData.firstName!,
        lastName: userData.lastName!,
        role: userData.role!,
        permissions: userData.permissions,
      });

      await loadClientUsers(selectedClient.id);
      setShowUserForm(false);
      alert('User added successfully!');
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user');
    }
  };

  const handleViewClientPortal = (client: ClientOrganization) => {
    // Open client portal in new tab/window
    const portalUrl = `/customs-agent-portal?client=${client.id}&ff=${freightForwarderId}`;
    window.open(portalUrl, '_blank');
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
        }}
      >
        <div>Loading client portal management...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h2
            style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}
          >
            👥 Client Portal Management
          </h2>
          <p style={{ color: '#6b7280', margin: '0' }}>
            Manage your client organizations and their portal access
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          + Add Client Organization
        </button>
      </div>

      {/* Client Organizations List */}
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3
          style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0' }}
        >
          Client Organizations
        </h3>

        <div style={{ display: 'grid', gap: '12px' }}>
          {clients.map((client) => (
            <div
              key={client.id}
              style={{
                padding: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor:
                  selectedClient?.id === client.id ? '#f3f4f6' : 'white',
              }}
              onClick={() => {
                setSelectedClient(client);
                loadClientUsers(client.id);
              }}
            >
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                  {client.companyName}
                </div>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>
                  {client.address.city}, {client.address.state} •{' '}
                  {client.contacts.length} users
                </div>
                <div style={{ color: '#6b7280', fontSize: '14px' }}>
                  Portal: {client.branding?.portalName || 'Default Portal'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewClientPortal(client);
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  View Portal
                </button>
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: client.isActive ? '#dcfce7' : '#fee2e2',
                    color: client.isActive ? '#166534' : '#991b1b',
                  }}
                >
                  {client.subscriptionTier}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Client Details */}
      {selectedClient && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '24px',
          }}
        >
          {/* Client Info */}
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 16px 0',
              }}
            >
              {selectedClient.companyName}
            </h3>

            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                  }}
                >
                  Legal Name
                </label>
                <div>{selectedClient.legalName || 'Not provided'}</div>
              </div>
              <div>
                <label
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                  }}
                >
                  Tax ID
                </label>
                <div>{selectedClient.taxId || 'Not provided'}</div>
              </div>
              <div>
                <label
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                  }}
                >
                  Address
                </label>
                <div>
                  {selectedClient.address.street}
                  <br />
                  {selectedClient.address.city}, {selectedClient.address.state}{' '}
                  {selectedClient.address.zip}
                </div>
              </div>
              <div>
                <label
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                  }}
                >
                  Portal Branding
                </label>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor:
                        selectedClient.branding?.primaryColor || '#667eea',
                    }}
                  />
                  {selectedClient.branding?.portalName || 'Default Portal'}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowUserForm(true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                + Add User
              </button>
              <button
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Edit Settings
              </button>
            </div>
          </div>

          {/* Client Users */}
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 16px 0',
              }}
            >
              Portal Users ({clientUsers.length})
            </h3>

            <div style={{ display: 'grid', gap: '12px' }}>
              {clientUsers.map((user) => (
                <div
                  key={user.id}
                  style={{
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {user.firstName} {user.lastName}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>
                      {user.email}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>
                      Last login:{' '}
                      {user.lastLogin
                        ? user.lastLogin.toLocaleDateString()
                        : 'Never'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor:
                          user.role === 'ADMIN'
                            ? '#fef3c7'
                            : user.role === 'MANAGER'
                              ? '#dbeafe'
                              : '#f3f4f6',
                        color:
                          user.role === 'ADMIN'
                            ? '#92400e'
                            : user.role === 'MANAGER'
                              ? '#1e40af'
                              : '#374151',
                        marginBottom: '8px',
                      }}
                    >
                      {user.role}
                    </div>
                    <div
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: user.isActive ? '#dcfce7' : '#fee2e2',
                        color: user.isActive ? '#166534' : '#991b1b',
                      }}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Client Modal */}
      {showCreateForm && (
        <CreateClientModal
          freightForwarderName={freightForwarderName}
          onSave={handleCreateClient}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Add User Modal */}
      {showUserForm && selectedClient && (
        <AddUserModal
          clientName={selectedClient.companyName}
          onSave={handleAddUser}
          onCancel={() => setShowUserForm(false)}
        />
      )}
    </div>
  );
}

// Create Client Modal Component
function CreateClientModal({
  freightForwarderName,
  onSave,
  onCancel,
}: {
  freightForwarderName: string;
  onSave: (data: Partial<ClientOrganization>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    companyName: '',
    legalName: '',
    taxId: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'USA',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
        }}
      >
        <h3
          style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 24px 0' }}
        >
          Add Client Organization
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
              }}
            >
              Company Name *
            </label>
            <input
              type='text'
              value={formData.companyName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  companyName: e.target.value,
                }))
              }
              placeholder='ABC Shipping Corporation'
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
              }}
            >
              Legal Name
            </label>
            <input
              type='text'
              value={formData.legalName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, legalName: e.target.value }))
              }
              placeholder='ABC Shipping Corp LLC'
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
              }}
            >
              Tax ID
            </label>
            <input
              type='text'
              value={formData.taxId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, taxId: e.target.value }))
              }
              placeholder='12-3456789'
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
              }}
            >
              Street Address *
            </label>
            <input
              type='text'
              value={formData.address.street}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  address: { ...prev.address, street: e.target.value },
                }))
              }
              placeholder='123 Business Avenue'
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr',
              gap: '12px',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                City *
              </label>
              <input
                type='text'
                value={formData.address.city}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...prev.address, city: e.target.value },
                  }))
                }
                placeholder='Los Angeles'
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                State *
              </label>
              <input
                type='text'
                value={formData.address.state}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...prev.address, state: e.target.value },
                  }))
                }
                placeholder='CA'
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                ZIP *
              </label>
              <input
                type='text'
                value={formData.address.zip}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...prev.address, zip: e.target.value },
                  }))
                }
                placeholder='90210'
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: '24px',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
            }}
          >
            <button
              type='button'
              onClick={onCancel}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Cancel
            </button>
            <button
              type='submit'
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Create Client Organization
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add User Modal Component
function AddUserModal({
  clientName,
  onSave,
  onCancel,
}: {
  clientName: string;
  onSave: (data: Partial<ClientUser>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'USER' as ClientUser['role'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '500px',
          width: '90%',
        }}
      >
        <h3
          style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0' }}
        >
          Add User to {clientName}
        </h3>
        <p style={{ color: '#6b7280', margin: '0 0 24px 0' }}>
          The user will receive an invitation email to access the client portal.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
              }}
            >
              Email Address *
            </label>
            <input
              type='email'
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder='john.smith@company.com'
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                First Name *
              </label>
              <input
                type='text'
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                placeholder='John'
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                Last Name *
              </label>
              <input
                type='text'
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                placeholder='Smith'
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
              }}
            >
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  role: e.target.value as ClientUser['role'],
                }))
              }
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            >
              <option value='ADMIN'>Admin - Full access to all features</option>
              <option value='MANAGER'>
                Manager - Manage assigned shipments and users
              </option>
              <option value='USER'>
                User - View and manage assigned shipments
              </option>
              <option value='VIEWER'>
                Viewer - Read-only access to assigned shipments
              </option>
            </select>
          </div>

          <div
            style={{
              marginTop: '24px',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
            }}
          >
            <button
              type='button'
              onClick={onCancel}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Cancel
            </button>
            <button
              type='submit'
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Add User & Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
