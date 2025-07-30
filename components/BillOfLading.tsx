// 📄 Bill of Lading (BOL) Component with Signature Display
// Professional BOL template with integrated signature display

'use client';

import React from 'react';

interface LoadDetails {
  id: string;
  brokerName: string;
  origin: string;
  destination: string;
  rate: number;
  distance: string;
  weight: string;
  equipment: string;
  pickupDate: string;
  deliveryDate: string;
}

interface DriverDetails {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  assignedTruck: string;
}

interface SignatureData {
  driverSignature?: string;
  receiverSignature?: string;
  receiverName?: string;
  receiverTitle?: string;
  pickupTimestamp?: string;
  deliveryTimestamp?: string;
  sealNumber?: string;
}

interface BOLProps {
  load: LoadDetails;
  driver: DriverDetails;
  signatures: SignatureData;
  onPrint?: () => void;
}

const BillOfLading: React.FC<BOLProps> = ({
  load,
  driver,
  signatures,
  onPrint,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'N/A';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        padding: '40px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: '3px solid #1e40af',
          paddingBottom: '20px',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1e40af',
              margin: '0 0 8px 0',
            }}
          >
            BILL OF LADING
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0,
            }}
          >
            FleetFlow Transportation Services
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e40af' }}
          >
            BOL #{load.id}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            Issued: {formatDate(new Date().toISOString())}
          </div>
        </div>
      </div>

      {/* Load Information */}
      <div style={{ marginBottom: '30px' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '16px',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '8px',
          }}
        >
          LOAD INFORMATION
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px',
          }}
        >
          <div>
            <strong>Broker:</strong> {load.brokerName}
            <br />
            <strong>Equipment:</strong> {load.equipment}
            <br />
            <strong>Weight:</strong> {load.weight}
            <br />
            <strong>Distance:</strong> {load.distance}
          </div>
          <div>
            <strong>Rate:</strong> ${load.rate.toLocaleString()}
            <br />
            <strong>Pickup Date:</strong> {formatDate(load.pickupDate)}
            <br />
            <strong>Delivery Date:</strong> {formatDate(load.deliveryDate)}
            <br />
            {signatures.sealNumber && (
              <>
                <strong>Seal Number:</strong> {signatures.sealNumber}
              </>
            )}
          </div>
        </div>

        {/* Load Identifier Information */}
        <div
          style={{
            background: '#f8fafc',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #e2e8f0',
          }}
        >
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#374151',
              marginBottom: '12px',
            }}
          >
            🏷️ Load Identifier Information
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              fontSize: '14px',
            }}
          >
            <div>
              <strong>Load ID:</strong> {load.id}
              <br />
              <strong>Load Identifier:</strong>{' '}
              {(() => {
                try {
                  const EDIService =
                    require('../app/services/EDIService').default;
                  const loadData = {
                    id: load.id,
                    shipperInfo: {
                      companyName: load.origin?.split(',')[0] || 'Unknown',
                    },
                    equipment: load.equipment,
                    weight: load.weight,
                  };
                  const loadId = EDIService.generateLoadIdFromData(loadData);
                  return loadId.fullId;
                } catch (error) {
                  return load.id;
                }
              })()}
              <br />
              <strong>Shipper ID:</strong>{' '}
              {(() => {
                try {
                  const EDIService =
                    require('../app/services/EDIService').default;
                  const loadData = {
                    id: load.id,
                    shipperInfo: {
                      companyName: load.origin?.split(',')[0] || 'Unknown',
                    },
                    equipment: load.equipment,
                    weight: load.weight,
                  };
                  const loadId = EDIService.generateLoadIdFromData(loadData);
                  return loadId.shipperId;
                } catch (error) {
                  return 'N/A';
                }
              })()}
            </div>
            <div>
              <strong>Priority Rate Key:</strong>{' '}
              {(() => {
                try {
                  const EDIService =
                    require('../app/services/EDIService').default;
                  const loadData = {
                    id: load.id,
                    shipperInfo: {
                      companyName: load.origin?.split(',')[0] || 'Unknown',
                    },
                    equipment: load.equipment,
                    weight: load.weight,
                  };
                  const loadId = EDIService.generateLoadIdFromData(loadData);
                  return loadId.breakdown.priority;
                } catch (error) {
                  return 'STD';
                }
              })()}
              <br />
              <strong>Load Type:</strong>{' '}
              {(() => {
                try {
                  const EDIService =
                    require('../app/services/EDIService').default;
                  const loadData = {
                    id: load.id,
                    shipperInfo: {
                      companyName: load.origin?.split(',')[0] || 'Unknown',
                    },
                    equipment: load.equipment,
                    weight: load.weight,
                  };
                  const loadId = EDIService.generateLoadIdFromData(loadData);
                  return loadId.breakdown.loadType;
                } catch (error) {
                  return 'FTL';
                }
              })()}
              <br />
              <strong>Equipment Type:</strong>{' '}
              {(() => {
                try {
                  const EDIService =
                    require('../app/services/EDIService').default;
                  const loadData = {
                    id: load.id,
                    shipperInfo: {
                      companyName: load.origin?.split(',')[0] || 'Unknown',
                    },
                    equipment: load.equipment,
                    weight: load.weight,
                  };
                  const loadId = EDIService.generateLoadIdFromData(loadData);
                  return loadId.breakdown.equipment;
                } catch (error) {
                  return 'DRY';
                }
              })()}
            </div>
          </div>
        </div>

        {/* Origin and Destination */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
        >
          <div
            style={{
              background: '#f9fafb',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
            }}
          >
            <h3
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#059669',
                margin: '0 0 8px 0',
              }}
            >
              📍 PICKUP LOCATION
            </h3>
            <div style={{ fontSize: '14px', color: '#374151' }}>
              {load.origin}
            </div>
            {signatures.pickupTimestamp && (
              <div
                style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}
              >
                Completed: {formatTime(signatures.pickupTimestamp)}
              </div>
            )}
          </div>

          <div
            style={{
              background: '#f9fafb',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
            }}
          >
            <h3
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#dc2626',
                margin: '0 0 8px 0',
              }}
            >
              🏢 DELIVERY LOCATION
            </h3>
            <div style={{ fontSize: '14px', color: '#374151' }}>
              {load.destination}
            </div>
            {signatures.deliveryTimestamp && (
              <div
                style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}
              >
                Completed: {formatTime(signatures.deliveryTimestamp)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Driver Information */}
      <div style={{ marginBottom: '30px' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '16px',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '8px',
          }}
        >
          DRIVER INFORMATION
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
        >
          <div>
            <strong>Driver Name:</strong> {driver.name}
            <br />
            <strong>Driver ID:</strong> {driver.id}
            <br />
            <strong>Phone:</strong> {driver.phone}
          </div>
          <div>
            <strong>CDL Number:</strong> {driver.licenseNumber}
            <br />
            <strong>Truck ID:</strong> {driver.assignedTruck}
          </div>
        </div>
      </div>

      {/* Signatures Section */}
      <div style={{ marginBottom: '30px' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '16px',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '8px',
          }}
        >
          SIGNATURES
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
          }}
        >
          {/* Driver Signature */}
          <div
            style={{
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '16px',
              background: '#f9fafb',
            }}
          >
            <h3
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#374151',
                margin: '0 0 12px 0',
              }}
            >
              DRIVER SIGNATURE
            </h3>

            {signatures.driverSignature ? (
              <div
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  padding: '8px',
                  background: 'white',
                  textAlign: 'center',
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={signatures.driverSignature}
                  alt='Driver Signature'
                  style={{
                    maxWidth: '100%',
                    maxHeight: '70px',
                    objectFit: 'contain',
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  border: '1px dashed #d1d5db',
                  borderRadius: '4px',
                  padding: '8px',
                  background: 'white',
                  textAlign: 'center',
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9ca3af',
                  fontSize: '12px',
                }}
              >
                Signature Required
              </div>
            )}

            <div
              style={{
                marginTop: '8px',
                fontSize: '12px',
                color: '#6b7280',
                textAlign: 'center',
              }}
            >
              {driver.name}
            </div>
          </div>

          {/* Receiver Signature */}
          <div
            style={{
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '16px',
              background: '#f9fafb',
            }}
          >
            <h3
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#374151',
                margin: '0 0 12px 0',
              }}
            >
              RECEIVER SIGNATURE
            </h3>

            {signatures.receiverSignature ? (
              <div
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  padding: '8px',
                  background: 'white',
                  textAlign: 'center',
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={signatures.receiverSignature}
                  alt='Receiver Signature'
                  style={{
                    maxWidth: '100%',
                    maxHeight: '70px',
                    objectFit: 'contain',
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  border: '1px dashed #d1d5db',
                  borderRadius: '4px',
                  padding: '8px',
                  background: 'white',
                  textAlign: 'center',
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9ca3af',
                  fontSize: '12px',
                }}
              >
                Signature Required
              </div>
            )}

            <div
              style={{
                marginTop: '8px',
                fontSize: '12px',
                color: '#6b7280',
                textAlign: 'center',
              }}
            >
              {signatures.receiverName || 'Receiver Name'}
              {signatures.receiverTitle && (
                <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                  {signatures.receiverTitle}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div
        style={{
          fontSize: '10px',
          color: '#6b7280',
          borderTop: '1px solid #e5e7eb',
          paddingTop: '16px',
          marginBottom: '20px',
        }}
      >
        <strong>Terms and Conditions:</strong> This Bill of Lading is subject to
        the terms and conditions of FleetFlow Transportation Services. The
        carrier acknowledges receipt of the described goods in apparent good
        order and condition unless otherwise noted. Signatures above confirm
        pickup and delivery of cargo as described.
      </div>

      {/* Print Button */}
      {onPrint && (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onPrint}
            style={{
              background: 'linear-gradient(135deg, #1e40af, #2563eb)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 4px 12px rgba(30, 64, 175, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            🖨️ Print BOL
          </button>
        </div>
      )}
    </div>
  );
};

export default BillOfLading;
