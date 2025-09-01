'use client';

import {
  BuildingOfficeIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { getCurrentUser } from '../config/access';
import { useShipper } from '../contexts/ShipperContext';
import {
  CommodityInfo,
  Shipper,
  ShipperContact,
  ShipperLocation,
} from '../types/shipper';

export default function AddShipperForm({
  onClose,
  onSubmit,
  isWorkflowMode = false,
  workflowData,
}: {
  onClose: () => void;
  onSubmit?: (shipperData: any) => void;
  isWorkflowMode?: boolean;
  workflowData?: any;
}) {
  const { shippers, setShippers, brokerAgents } = useShipper();
  const currentUser = getCurrentUser();

  const [formData, setFormData] = useState({
    companyName: '',
    taxId: '',
    mcNumber: '',
    paymentTerms: 'Net 30',
    creditLimit: '',
    creditRating: 'B' as 'A' | 'B' | 'C' | 'D',
    assignedBrokerId:
      currentUser.user.role === 'broker' ? currentUser.user.brokerId || '' : '',
    notes: '',
  });

  const [contacts, setContacts] = useState<Omit<ShipperContact, 'id'>[]>([
    {
      name: '',
      email: '',
      phone: '',
      title: '',
      isPrimary: true,
    },
  ]);

  const [locations, setLocations] = useState<Omit<ShipperLocation, 'id'>[]>([
    {
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      contactName: '',
      contactPhone: '',
      operatingHours: '',
      specialInstructions: '',
    },
  ]);

  const [commodities, setCommodities] = useState<CommodityInfo[]>([
    {
      name: '',
      freightClass: '',
      description: '',
      hazmat: false,
      temperature: 'ambient',
    },
  ]);

  // Photo Requirements Configuration State
  const [photoRequirements, setPhotoRequirements] = useState({
    pickupPhotosRequired: true,
    deliveryPhotosRequired: true,
    minimumPhotos: 2,
    canSkipPhotos: false,
    photoTypes: [
      'loaded_truck',
      'bill_of_lading',
      'unloaded_truck',
      'delivery_receipt',
    ],
    specialPhotoInstructions: '',
    reason: '',
  });

  const addContact = () => {
    setContacts([
      ...contacts,
      {
        name: '',
        email: '',
        phone: '',
        title: '',
        isPrimary: false,
      },
    ]);
  };

  const removeContact = (index: number) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((_, i) => i !== index));
    }
  };

  const updateContact = (index: number, field: string, value: any) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    setContacts(updated);
  };

  const addLocation = () => {
    setLocations([
      ...locations,
      {
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        contactName: '',
        contactPhone: '',
        operatingHours: '',
        specialInstructions: '',
      },
    ]);
  };

  const removeLocation = (index: number) => {
    if (locations.length > 1) {
      setLocations(locations.filter((_, i) => i !== index));
    }
  };

  const updateLocation = (index: number, field: string, value: any) => {
    const updated = [...locations];
    updated[index] = { ...updated[index], [field]: value };
    setLocations(updated);
  };

  const addCommodity = () => {
    setCommodities([
      ...commodities,
      {
        name: '',
        freightClass: '',
        description: '',
        hazmat: false,
        temperature: 'ambient',
      },
    ]);
  };

  const removeCommodity = (index: number) => {
    if (commodities.length > 1) {
      setCommodities(commodities.filter((_, i) => i !== index));
    }
  };

  const updateCommodity = (index: number, field: string, value: any) => {
    const updated = [...commodities];
    updated[index] = { ...updated[index], [field]: value };
    setCommodities(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const assignedBroker = brokerAgents.find(
      (b) => b.id === formData.assignedBrokerId
    );

    // Create vendor profile data for vendor management portal
    const vendorData = {
      id: `vendor-${Date.now()}`,
      name: formData.companyName,
      category: 'Transportation/Logistics',
      companyName: formData.companyName,
      taxId: formData.taxId,
      mcNumber: formData.mcNumber,
      paymentTerms: formData.paymentTerms,
      creditLimit: parseFloat(formData.creditLimit) || 50000,
      creditRating: formData.creditRating,
      contacts: contacts.map((contact, index) => ({
        ...contact,
        id: `contact-${index}`,
      })),
      locations: locations.map((location, index) => ({
        ...location,
        id: `location-${index}`,
      })),
      commodities: commodities,
      serviceTypes: commodities.map((c) => c.name).filter(Boolean),
      specialRequirements: formData.notes,
      assignedBrokerId: formData.assignedBrokerId,
      assignedBrokerName: assignedBroker?.name || 'Unknown',
      status: 'active',
      joinDate: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      totalLoads: 0,
      totalRevenue: 0,
      averageRate: 0,
      performance: 95.0, // Default performance rating
      spend: 0, // Initial spend amount
      contract_expires: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString(), // 1 year from now
      notes: formData.notes,
      // Photo Requirements Policy (set by broker)
      photoRequirements: {
        pickupPhotosRequired: photoRequirements.pickupPhotosRequired,
        deliveryPhotosRequired: photoRequirements.deliveryPhotosRequired,
        minimumPhotos: photoRequirements.minimumPhotos,
        canSkipPhotos: photoRequirements.canSkipPhotos,
        photoTypes: photoRequirements.photoTypes,
        specialPhotoInstructions:
          photoRequirements.specialPhotoInstructions || undefined,
        setByBrokerId: currentUser.user.id,
        setAt: new Date().toISOString(),
        reason: photoRequirements.reason || undefined,
      },
    };

    if (isWorkflowMode && onSubmit) {
      // Call the workflow submit function
      onSubmit(vendorData);
    } else {
      try {
        // Create vendor profile in vendor management system
        const response = await fetch('/api/vendor-management/vendors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(vendorData),
        });

        if (response.ok) {
          // Also add to local shipper context for backward compatibility
          const newShipper: Shipper = {
            id: `shipper-${Date.now()}`,
            companyName: formData.companyName,
            taxId: formData.taxId,
            mcNumber: formData.mcNumber,
            paymentTerms: formData.paymentTerms,
            creditLimit: parseFloat(formData.creditLimit) || 0,
            creditRating: formData.creditRating,
            contacts: contacts.map((contact, index) => ({
              ...contact,
              id: `contact-${index}`,
            })),
            locations: locations.map((location, index) => ({
              ...location,
              id: `location-${index}`,
            })),
            commodities: commodities,
            preferredLanes: [],
            loadRequests: [],
            assignedBrokerId: formData.assignedBrokerId,
            assignedBrokerName: assignedBroker?.name || 'Unknown',
            status: 'active',
            joinDate: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            totalLoads: 0,
            totalRevenue: 0,
            averageRate: 0,
            notes: formData.notes,
            photoRequirements: vendorData.photoRequirements,
          };

          setShippers([...shippers, newShipper]);

          // Show success message
          alert(
            `✅ Vendor profile created successfully for ${formData.companyName}!\n\nVendor ID: ${vendorData.id}\n\nYou can now manage this vendor in the Vendor Management Portal.`
          );

          onClose();
        } else {
          throw new Error('Failed to create vendor profile');
        }
      } catch (error) {
        console.error('Error creating vendor profile:', error);
        alert(
          `❌ Error creating vendor profile: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease try again or contact support.`
        );
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 25%, rgba(51, 65, 85, 0.98) 50%, rgba(30, 41, 59, 0.98) 75%, rgba(15, 23, 42, 0.98) 100%)',
          borderRadius: '20px',
          padding: '32px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <XMarkIcon style={{ width: '20px', height: '20px' }} />
        </button>

        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <BuildingOfficeIcon
                style={{
                  width: '32px',
                  height: '32px',
                  color: '#60a5fa',
                  marginRight: '12px',
                }}
              />
              <h2
                style={{
                  color: 'white',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  margin: 0,
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                }}
              >
                Create Vendor Profile
              </h2>
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '16px',
                margin: 0,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
              }}
            >
              Create a new vendor profile that will be managed in the Vendor
              Management Portal
            </p>
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Company Information */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '20px',
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                }}
              >
                🏢 Company Information
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '8px',
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                    }}
                  >
                    Company Name *
                  </label>
                  <input
                    type='text'
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '1px solid #60a5fa';
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border =
                        '1px solid rgba(255, 255, 255, 0.2)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    placeholder='Enter company name'
                    required
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '8px',
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                    }}
                  >
                    Tax ID *
                  </label>
                  <input
                    type='text'
                    value={formData.taxId}
                    onChange={(e) =>
                      setFormData({ ...formData, taxId: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '1px solid #60a5fa';
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border =
                        '1px solid rgba(255, 255, 255, 0.2)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    placeholder='Enter tax ID'
                    required
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '8px',
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                    }}
                  >
                    MC Number (Optional)
                  </label>
                  <input
                    type='text'
                    value={formData.mcNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, mcNumber: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '1px solid #60a5fa';
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border =
                        '1px solid rgba(255, 255, 255, 0.2)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    placeholder='Enter MC number'
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '8px',
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                    }}
                  >
                    Assigned Broker *
                  </label>
                  <select
                    value={formData.assignedBrokerId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assignedBrokerId: e.target.value,
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '1px solid #60a5fa';
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border =
                        '1px solid rgba(255, 255, 255, 0.2)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    required
                    disabled={currentUser.user.role === 'broker'}
                  >
                    <option
                      value=''
                      style={{ background: '#1e3a8a', color: 'white' }}
                    >
                      Select a broker
                    </option>
                    {brokerAgents.map((broker) => (
                      <option
                        key={broker.id}
                        value={broker.id}
                        style={{ background: '#1e3a8a', color: 'white' }}
                      >
                        {broker.name} ({broker.email})
                      </option>
                    ))}
                  </select>
                  {currentUser.user.role === 'broker' && (
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                        marginTop: '4px',
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                      }}
                    >
                      You are automatically assigned as the broker for this
                      shipper.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '20px',
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                }}
              >
                💰 Financial Information
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '8px',
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                    }}
                  >
                    Payment Terms
                  </label>
                  <select
                    value={formData.paymentTerms}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentTerms: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '1px solid #60a5fa';
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border =
                        '1px solid rgba(255, 255, 255, 0.2)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <option
                      value='Net 30'
                      style={{ background: '#1e3a8a', color: 'white' }}
                    >
                      Net 30
                    </option>
                    <option
                      value='Net 15'
                      style={{ background: '#1e3a8a', color: 'white' }}
                    >
                      Net 15
                    </option>
                    <option
                      value='Net 60'
                      style={{ background: '#1e3a8a', color: 'white' }}
                    >
                      Net 60
                    </option>
                    <option
                      value='COD'
                      style={{ background: '#1e3a8a', color: 'white' }}
                    >
                      COD
                    </option>
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '8px',
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                    }}
                  >
                    Credit Limit ($)
                  </label>
                  <input
                    type='number'
                    value={formData.creditLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, creditLimit: e.target.value })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '1px solid #60a5fa';
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border =
                        '1px solid rgba(255, 255, 255, 0.2)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    placeholder='Enter credit limit'
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '8px',
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                    }}
                  >
                    Credit Rating
                  </label>
                  <select
                    value={formData.creditRating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        creditRating: e.target.value as 'A' | 'B' | 'C' | 'D',
                      })
                    }
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.border = '1px solid #60a5fa';
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.border =
                        '1px solid rgba(255, 255, 255, 0.2)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <option
                      value='A'
                      style={{ background: '#1e3a8a', color: 'white' }}
                    >
                      A - Excellent
                    </option>
                    <option
                      value='B'
                      style={{ background: '#1e3a8a', color: 'white' }}
                    >
                      B - Good
                    </option>
                    <option
                      value='C'
                      style={{ background: '#1e3a8a', color: 'white' }}
                    >
                      C - Fair
                    </option>
                    <option
                      value='D'
                      style={{ background: '#1e3a8a', color: 'white' }}
                    >
                      D - Poor
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contacts */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '600',
                    margin: 0,
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                  }}
                >
                  📞 Contacts
                </h3>
                <button
                  type='button'
                  onClick={addContact}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <PlusIcon
                    style={{ width: '16px', height: '16px', color: '#60a5fa' }}
                  />
                  Add Contact
                </button>
              </div>
              {contacts.map((contact, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                    }}
                  >
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: '600',
                        margin: 0,
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                      }}
                    >
                      Contact {index + 1}
                    </h4>
                    {contacts.length > 1 && (
                      <button
                        type='button'
                        onClick={() => removeContact(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgba(255, 255, 255, 0.7)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color =
                            'rgba(255, 255, 255, 1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color =
                            'rgba(255, 255, 255, 0.7)';
                        }}
                      >
                        <XMarkIcon style={{ width: '20px', height: '20px' }} />
                      </button>
                    )}
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '13px',
                          fontWeight: '500',
                          marginBottom: '4px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                        }}
                      >
                        Name *
                      </label>
                      <input
                        type='text'
                        value={contact.name}
                        onChange={(e) =>
                          updateContact(index, 'name', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '13px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.border = '1px solid #60a5fa';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border =
                            '1px solid rgba(255, 255, 255, 0.2)';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.1)';
                        }}
                        placeholder='Enter contact name'
                        required
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '13px',
                          fontWeight: '500',
                          marginBottom: '4px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                        }}
                      >
                        Title
                      </label>
                      <input
                        type='text'
                        value={contact.title}
                        onChange={(e) =>
                          updateContact(index, 'title', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '13px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.border = '1px solid #60a5fa';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border =
                            '1px solid rgba(255, 255, 255, 0.2)';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.1)';
                        }}
                        placeholder='Enter contact title'
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '13px',
                          fontWeight: '500',
                          marginBottom: '4px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                        }}
                      >
                        Email *
                      </label>
                      <input
                        type='email'
                        value={contact.email}
                        onChange={(e) =>
                          updateContact(index, 'email', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '13px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.border = '1px solid #60a5fa';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border =
                            '1px solid rgba(255, 255, 255, 0.2)';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.1)';
                        }}
                        placeholder='Enter contact email'
                        required
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '13px',
                          fontWeight: '500',
                          marginBottom: '4px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                        }}
                      >
                        Phone *
                      </label>
                      <input
                        type='tel'
                        value={contact.phone}
                        onChange={(e) =>
                          updateContact(index, 'phone', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '13px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.border = '1px solid #60a5fa';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border =
                            '1px solid rgba(255, 255, 255, 0.2)';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.1)';
                        }}
                        placeholder='Enter contact phone'
                        required
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '13px',
                        fontWeight: '500',
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={contact.isPrimary}
                        onChange={(e) =>
                          updateContact(index, 'isPrimary', e.target.checked)
                        }
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#60a5fa',
                          marginRight: '8px',
                        }}
                      />
                      Primary Contact
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Locations */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '600',
                    margin: 0,
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                  }}
                >
                  📍 Locations
                </h3>
                <button
                  type='button'
                  onClick={addLocation}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <PlusIcon
                    style={{ width: '16px', height: '16px', color: '#60a5fa' }}
                  />
                  Add Location
                </button>
              </div>
              {locations.map((location, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                    }}
                  >
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: '600',
                        margin: 0,
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                      }}
                    >
                      Location {index + 1}
                    </h4>
                    {locations.length > 1 && (
                      <button
                        type='button'
                        onClick={() => removeLocation(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgba(255, 255, 255, 0.7)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color =
                            'rgba(255, 255, 255, 1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color =
                            'rgba(255, 255, 255, 0.7)';
                        }}
                      >
                        <XMarkIcon style={{ width: '20px', height: '20px' }} />
                      </button>
                    )}
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '13px',
                          fontWeight: '500',
                          marginBottom: '4px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                        }}
                      >
                        Location Name *
                      </label>
                      <input
                        type='text'
                        value={location.name}
                        onChange={(e) =>
                          updateLocation(index, 'name', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '13px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.border = '1px solid #60a5fa';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border =
                            '1px solid rgba(255, 255, 255, 0.2)';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.1)';
                        }}
                        placeholder='Enter location name'
                        required
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '13px',
                          fontWeight: '500',
                          marginBottom: '4px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                        }}
                      >
                        Address *
                      </label>
                      <input
                        type='text'
                        value={location.address}
                        onChange={(e) =>
                          updateLocation(index, 'address', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '13px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.border = '1px solid #60a5fa';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border =
                            '1px solid rgba(255, 255, 255, 0.2)';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.1)';
                        }}
                        placeholder='Enter location address'
                        required
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '13px',
                          fontWeight: '500',
                          marginBottom: '4px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                        }}
                      >
                        City *
                      </label>
                      <input
                        type='text'
                        value={location.city}
                        onChange={(e) =>
                          updateLocation(index, 'city', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '13px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.border = '1px solid #60a5fa';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border =
                            '1px solid rgba(255, 255, 255, 0.2)';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.1)';
                        }}
                        placeholder='Enter city'
                        required
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '13px',
                          fontWeight: '500',
                          marginBottom: '4px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                        }}
                      >
                        State *
                      </label>
                      <input
                        type='text'
                        value={location.state}
                        onChange={(e) =>
                          updateLocation(index, 'state', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '13px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.border = '1px solid #60a5fa';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border =
                            '1px solid rgba(255, 255, 255, 0.2)';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.1)';
                        }}
                        placeholder='Enter state (e.g., CA)'
                        maxLength={2}
                        required
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '13px',
                          fontWeight: '500',
                          marginBottom: '4px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                        }}
                      >
                        ZIP Code *
                      </label>
                      <input
                        type='text'
                        value={location.zip}
                        onChange={(e) =>
                          updateLocation(index, 'zip', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '13px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.border = '1px solid #60a5fa';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border =
                            '1px solid rgba(255, 255, 255, 0.2)';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.1)';
                        }}
                        placeholder='Enter ZIP code'
                        required
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '13px',
                          fontWeight: '500',
                          marginBottom: '4px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                        }}
                      >
                        Operating Hours
                      </label>
                      <input
                        type='text'
                        value={location.operatingHours}
                        onChange={(e) =>
                          updateLocation(
                            index,
                            'operatingHours',
                            e.target.value
                          )
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '13px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.border = '1px solid #60a5fa';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border =
                            '1px solid rgba(255, 255, 255, 0.2)';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.1)';
                        }}
                        placeholder='e.g., Mon-Fri 8AM-5PM'
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '13px',
                        fontWeight: '500',
                        marginBottom: '4px',
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                      }}
                    >
                      Special Instructions
                    </label>
                    <textarea
                      value={location.specialInstructions}
                      onChange={(e) =>
                        updateLocation(
                          index,
                          'specialInstructions',
                          e.target.value
                        )
                      }
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '13px',
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        resize: 'vertical',
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '1px solid #60a5fa';
                        e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.border =
                          '1px solid rgba(255, 255, 255, 0.2)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      }}
                      placeholder='Any special instructions for this location...'
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Commodities */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '600',
                    margin: 0,
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                  }}
                >
                  🚚 Commodities
                </h3>
                <button
                  type='button'
                  onClick={addCommodity}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <PlusIcon
                    style={{ width: '16px', height: '16px', color: '#60a5fa' }}
                  />
                  Add Commodity
                </button>
              </div>
              {commodities.map((commodity, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                    }}
                  >
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: '600',
                        margin: 0,
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                      }}
                    >
                      Commodity {index + 1}
                    </h4>
                    {commodities.length > 1 && (
                      <button
                        type='button'
                        onClick={() => removeCommodity(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'rgba(255, 255, 255, 0.7)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color =
                            'rgba(255, 255, 255, 1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color =
                            'rgba(255, 255, 255, 0.7)';
                        }}
                      >
                        <XMarkIcon style={{ width: '20px', height: '20px' }} />
                      </button>
                    )}
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '13px',
                          fontWeight: '500',
                          marginBottom: '4px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                        }}
                      >
                        Commodity Name *
                      </label>
                      <input
                        type='text'
                        value={commodity.name}
                        onChange={(e) =>
                          updateCommodity(index, 'name', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '13px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.border = '1px solid #60a5fa';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border =
                            '1px solid rgba(255, 255, 255, 0.2)';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.1)';
                        }}
                        placeholder='Enter commodity name'
                        required
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '13px',
                          fontWeight: '500',
                          marginBottom: '4px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                        }}
                      >
                        Freight Class *
                      </label>
                      <select
                        value={commodity.freightClass}
                        onChange={(e) =>
                          updateCommodity(index, 'freightClass', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '13px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.border = '1px solid #60a5fa';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border =
                            '1px solid rgba(255, 255, 255, 0.2)';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.1)';
                        }}
                        required
                      >
                        <option
                          value=''
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          Select freight class
                        </option>
                        <option
                          value='50'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          50
                        </option>
                        <option
                          value='55'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          55
                        </option>
                        <option
                          value='60'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          60
                        </option>
                        <option
                          value='65'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          65
                        </option>
                        <option
                          value='70'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          70
                        </option>
                        <option
                          value='77.5'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          77.5
                        </option>
                        <option
                          value='85'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          85
                        </option>
                        <option
                          value='92.5'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          92.5
                        </option>
                        <option
                          value='100'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          100
                        </option>
                        <option
                          value='110'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          110
                        </option>
                        <option
                          value='125'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          125
                        </option>
                        <option
                          value='150'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          150
                        </option>
                        <option
                          value='175'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          175
                        </option>
                        <option
                          value='200'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          200
                        </option>
                        <option
                          value='250'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          250
                        </option>
                        <option
                          value='300'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          300
                        </option>
                        <option
                          value='400'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          400
                        </option>
                        <option
                          value='500'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          500
                        </option>
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '13px',
                          fontWeight: '500',
                          marginBottom: '4px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                        }}
                      >
                        Temperature Requirements
                      </label>
                      <select
                        value={commodity.temperature}
                        onChange={(e) =>
                          updateCommodity(index, 'temperature', e.target.value)
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '13px',
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                        }}
                        onFocus={(e) => {
                          e.target.style.border = '1px solid #60a5fa';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.border =
                            '1px solid rgba(255, 255, 255, 0.2)';
                          e.target.style.background =
                            'rgba(255, 255, 255, 0.1)';
                        }}
                      >
                        <option
                          value='ambient'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          Ambient
                        </option>
                        <option
                          value='refrigerated'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          Refrigerated
                        </option>
                        <option
                          value='frozen'
                          style={{ background: '#1e3a8a', color: 'white' }}
                        >
                          Frozen
                        </option>
                      </select>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '13px',
                        fontWeight: '500',
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={commodity.hazmat}
                        onChange={(e) =>
                          updateCommodity(index, 'hazmat', e.target.checked)
                        }
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#60a5fa',
                          marginRight: '8px',
                        }}
                      />
                      Hazmat
                    </div>
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '13px',
                        fontWeight: '500',
                        marginBottom: '4px',
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                      }}
                    >
                      Description
                    </label>
                    <textarea
                      value={commodity.description}
                      onChange={(e) =>
                        updateCommodity(index, 'description', e.target.value)
                      }
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        color: 'white',
                        fontSize: '13px',
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        resize: 'vertical',
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '1px solid #60a5fa';
                        e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.border =
                          '1px solid rgba(255, 255, 255, 0.2)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      }}
                      placeholder='Describe the commodity...'
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '20px',
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                }}
              >
                📝 Notes
              </h3>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  resize: 'vertical',
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid #60a5fa';
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                placeholder='Any additional notes about this shipper...'
              />
            </div>
          </div>

          {/* Photo Requirements Configuration */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '24px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '20px',
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              📸 Photo Requirements Policy
            </h3>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                marginBottom: '20px',
                lineHeight: '1.5',
              }}
            >
              Configure default photo requirements for all loads from this
              shipper. These settings will flow through to drivers during
              workflow completion.
            </p>

            {/* Photo Requirement Toggles */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '20px',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <input
                  type='checkbox'
                  checked={photoRequirements.pickupPhotosRequired}
                  onChange={(e) =>
                    setPhotoRequirements((prev) => ({
                      ...prev,
                      pickupPhotosRequired: e.target.checked,
                    }))
                  }
                  style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                />
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                  }}
                >
                  📦 Pickup Photos Required
                </span>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <input
                  type='checkbox'
                  checked={photoRequirements.deliveryPhotosRequired}
                  onChange={(e) =>
                    setPhotoRequirements((prev) => ({
                      ...prev,
                      deliveryPhotosRequired: e.target.checked,
                    }))
                  }
                  style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                />
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                  }}
                >
                  📋 Delivery Photos Required
                </span>
              </label>
            </div>

            {/* Minimum Photos */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '4px',
                }}
              >
                Minimum Photos Required
              </label>
              <select
                value={photoRequirements.minimumPhotos}
                onChange={(e) =>
                  setPhotoRequirements((prev) => ({
                    ...prev,
                    minimumPhotos: parseInt(e.target.value),
                  }))
                }
                style={{
                  width: '200px',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '13px',
                  outline: 'none',
                }}
              >
                <option
                  value={1}
                  style={{ background: '#1f2937', color: 'white' }}
                >
                  1 Photo
                </option>
                <option
                  value={2}
                  style={{ background: '#1f2937', color: 'white' }}
                >
                  2 Photos
                </option>
                <option
                  value={3}
                  style={{ background: '#1f2937', color: 'white' }}
                >
                  3 Photos
                </option>
                <option
                  value={4}
                  style={{ background: '#1f2937', color: 'white' }}
                >
                  4 Photos
                </option>
              </select>
            </div>

            {/* Photo Skip Policy */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <input
                  type='checkbox'
                  checked={photoRequirements.canSkipPhotos}
                  onChange={(e) =>
                    setPhotoRequirements((prev) => ({
                      ...prev,
                      canSkipPhotos: e.target.checked,
                    }))
                  }
                  style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                />
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                  }}
                >
                  ⚠️ Allow drivers to skip photos (other validations remain
                  mandatory)
                </span>
              </label>
            </div>

            {/* Photo Types */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '8px',
                }}
              >
                Required Photo Types
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                }}
              >
                {[
                  'loaded_truck',
                  'bill_of_lading',
                  'unloaded_truck',
                  'delivery_receipt',
                ].map((photoType) => (
                  <label
                    key={photoType}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type='checkbox'
                      checked={photoRequirements.photoTypes.includes(photoType)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPhotoRequirements((prev) => ({
                            ...prev,
                            photoTypes: [...prev.photoTypes, photoType],
                          }));
                        } else {
                          setPhotoRequirements((prev) => ({
                            ...prev,
                            photoTypes: prev.photoTypes.filter(
                              (type) => type !== photoType
                            ),
                          }));
                        }
                      }}
                      style={{ marginRight: '8px', transform: 'scale(1.1)' }}
                    />
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '13px',
                        textTransform: 'capitalize',
                      }}
                    >
                      {photoType.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '4px',
                }}
              >
                Special Photo Instructions
              </label>
              <textarea
                value={photoRequirements.specialPhotoInstructions}
                onChange={(e) =>
                  setPhotoRequirements((prev) => ({
                    ...prev,
                    specialPhotoInstructions: e.target.value,
                  }))
                }
                rows={2}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'vertical',
                }}
                placeholder="e.g., 'Photos must show all damage clearly', 'Include timestamp and location GPS coordinates'"
              />
            </div>

            {/* Reason for Requirements */}
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '13px',
                  fontWeight: '500',
                  marginBottom: '4px',
                }}
              >
                Reason for Photo Requirements
              </label>
              <input
                type='text'
                value={photoRequirements.reason}
                onChange={(e) =>
                  setPhotoRequirements((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '13px',
                  outline: 'none',
                }}
                placeholder="e.g., 'High-value cargo documentation', 'Customer requirement', 'Previous damage claims'"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px',
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <button
              type='button'
              onClick={onClose}
              style={{
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              Cancel
            </button>
            <button
              type='submit'
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 6px 16px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(59, 130, 246, 0.3)';
              }}
            >
              Add Shipper
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
