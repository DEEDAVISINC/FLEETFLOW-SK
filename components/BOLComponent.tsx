// 📄 Bill of Lading (BOL) Component with Signature Display
// Professional BOL template with integrated workflow signatures

'use client';

import React from 'react';

interface Load {
  id: string;
  brokerName: string;
  origin: string;
  destination: string;
  rate: number;
  distance: string;
  weight: string;
  equipment: string;
  status: string;
  pickupDate: string;
  deliveryDate: string;
}

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
}

interface BOLComponentProps {
  load: Load;
  driver: Driver;
  driverSignature?: string;
  receiverSignature?: string;
  receiverName?: string;
  pickupPhotos?: string[];
  deliveryPhotos?: string[];
  sealNumber?: string;
  pickupTimestamp?: string;
  deliveryTimestamp?: string;
}

const BOLComponent: React.FC<BOLComponentProps> = ({
  load,
  driver,
  driverSignature,
  receiverSignature,
  receiverName,
  pickupPhotos,
  deliveryPhotos,
  sealNumber,
  pickupTimestamp,
  deliveryTimestamp
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'Pending';
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ 
      background: 'white', 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      lineHeight: '1.4',
      color: '#000'
    }}>
      {/* Header */}
      <div style={{ 
        borderBottom: '3px solid #1e40af', 
        paddingBottom: '20px', 
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#1e40af',
          margin: '0 0 10px 0'
        }}>
          BILL OF LADING
        </h1>
        <div style={{ fontSize: '16px', color: '#374151' }}>
          FleetFlow Logistics System
        </div>
        <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '5px' }}>
          Load ID: {load.id} | Generated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Load Information */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#111827',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '8px',
          marginBottom: '16px'
        }}>
          LOAD INFORMATION
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Origin:</strong> {load.origin}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Destination:</strong> {load.destination}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Equipment Type:</strong> {load.equipment}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Weight:</strong> {load.weight}
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Pickup Date:</strong> {formatDate(load.pickupDate)}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Delivery Date:</strong> {formatDate(load.deliveryDate)}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Distance:</strong> {load.distance}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Rate:</strong> ${load.rate.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Driver Information */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#111827',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '8px',
          marginBottom: '16px'
        }}>
          DRIVER INFORMATION
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Driver Name:</strong> {driver.name}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Driver ID:</strong> {driver.id}
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '8px' }}>
              <strong>License Number:</strong> {driver.licenseNumber}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Phone:</strong> {driver.phone}
            </div>
          </div>
        </div>
      </div>

      {/* Pickup Information */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#111827',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '8px',
          marginBottom: '16px'
        }}>
          PICKUP INFORMATION
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Pickup Time:</strong> {formatTime(pickupTimestamp)}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Seal Number:</strong> {sealNumber || 'Pending'}
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Status:</strong> {pickupTimestamp ? '✅ Completed' : '⏳ Pending'}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Photos:</strong> {pickupPhotos ? `${pickupPhotos.length} uploaded` : 'Pending'}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#111827',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '8px',
          marginBottom: '16px'
        }}>
          DELIVERY INFORMATION
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Delivery Time:</strong> {formatTime(deliveryTimestamp)}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Receiver Name:</strong> {receiverName || 'Pending'}
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Status:</strong> {deliveryTimestamp ? '✅ Completed' : '⏳ Pending'}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Photos:</strong> {deliveryPhotos ? `${deliveryPhotos.length} uploaded` : 'Pending'}
            </div>
          </div>
        </div>
      </div>

      {/* Signatures Section */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          color: '#111827',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '8px',
          marginBottom: '16px'
        }}>
          SIGNATURES
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Driver Signature */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
              Driver Signature
            </h3>
            <div style={{
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              padding: '16px',
              minHeight: '120px',
              background: '#f9fafb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {driverSignature ? (
                <img 
                  src={driverSignature} 
                  alt="Driver Signature"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100px',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                  Signature Pending
                </div>
              )}
            </div>
            <div style={{ 
              marginTop: '8px', 
              fontSize: '12px', 
              color: '#6b7280',
              textAlign: 'center'
            }}>
              Driver: {driver.name}
              {driverSignature && (
                <div>Signed: {new Date().toLocaleString()}</div>
              )}
            </div>
          </div>

          {/* Receiver Signature */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
              Receiver Signature
            </h3>
            <div style={{
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              padding: '16px',
              minHeight: '120px',
              background: '#f9fafb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {receiverSignature ? (
                <img 
                  src={receiverSignature} 
                  alt="Receiver Signature"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100px',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                  Signature Pending
                </div>
              )}
            </div>
            <div style={{ 
              marginTop: '8px', 
              fontSize: '12px', 
              color: '#6b7280',
              textAlign: 'center'
            }}>
              Receiver: {receiverName || 'Pending'}
              {receiverSignature && (
                <div>Signed: {new Date().toLocaleString()}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Photo Documentation */}
      {(pickupPhotos?.length || deliveryPhotos?.length) && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            color: '#111827',
            borderBottom: '2px solid #e5e7eb',
            paddingBottom: '8px',
            marginBottom: '16px'
          }}>
            PHOTO DOCUMENTATION
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Pickup Photos */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                Pickup Photos ({pickupPhotos?.length || 0})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {pickupPhotos?.slice(0, 4).map((photo, index) => (
                  <div key={index} style={{
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    aspectRatio: '1',
                    background: '#f9fafb'
                  }}>
                    <img 
                      src={photo} 
                      alt={`Pickup ${index + 1}`}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Photos */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                Delivery Photos ({deliveryPhotos?.length || 0})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {deliveryPhotos?.slice(0, 4).map((photo, index) => (
                  <div key={index} style={{
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    aspectRatio: '1',
                    background: '#f9fafb'
                  }}>
                    <img 
                      src={photo} 
                      alt={`Delivery ${index + 1}`}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ 
        borderTop: '2px solid #e5e7eb',
        paddingTop: '20px',
        marginTop: '40px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#6b7280'
      }}>
        <div style={{ marginBottom: '8px' }}>
          This Bill of Lading is digitally generated and verified through FleetFlow Logistics System
        </div>
        <div>
          Document Generated: {new Date().toLocaleString()} | Load ID: {load.id}
        </div>
        <div style={{ marginTop: '8px', fontWeight: 'bold' }}>
          All signatures are captured digitally and legally binding
        </div>
      </div>
    </div>
  );
};

export default BOLComponent;
