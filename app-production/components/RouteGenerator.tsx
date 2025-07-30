'use client';

import React, { useState, useEffect } from 'react';

// Route Generator Components for FleetFlow
interface RouteData {
  companyName: string;
  mcNumber: string;
  contactPhone: string;
  routeNumber: string;
  routeName: string;
  totalMiles: string;
  totalAmount: string;
  ratePerMile?: string;
  pickupLocationName: string;
  pickupAddress: string;
  pickupTime: string;
  pickupContact: string;
  pickupManager: string;
  pickupPhone: string;
  locationType: string;
  confirmationNumber: string;
  safetyRequirements: string;
  accessRequirements: string;
  timingRestrictions: string;
  documentationRequirements: string;
  loadingArea: string;
  pickupNotes: string;
  driverName: string;
  vehicleNumber: string;
  stops: RouteStop[];
}

interface RouteStop {
  name: string;
  address: string;
  deliveryTime: string;
  items: string;
  contact: string;
  instructions: string;
}

interface RouteBuilderProps {
  onRouteGenerated?: (document: string) => void;
  initialData?: Partial<RouteData>;
  onClose?: () => void;
  selectedLoad?: {
    id: string;
    origin: string;
    destination: string;
    rate: number;
    distance: string;
    weight: string;
    equipment: string;
    pickupDate: string;
    deliveryDate: string;
    pickupTime?: string;
    deliveryTime?: string;
    specialInstructions?: string;
  } | null;
}

// Location Types and Templates
const LOCATION_TYPES = {
  'Distribution Center': {
    defaultSafetyRequirements: 'High-vis vest required, steel-toe boots, hard hat in designated areas',
    defaultAccessRequirements: 'CDL required, appointment scheduling mandatory',
    defaultTimingRestrictions: 'No weekend deliveries, 6:00 AM - 6:00 PM only',
    defaultDocumentationRequirements: 'BOL, delivery receipt, photo confirmation',
    defaultLoadingArea: 'Dock doors 1-20, staging area B'
  },
  'Retail Store': {
    defaultSafetyRequirements: 'High-vis vest required during business hours',
    defaultAccessRequirements: 'Delivery entrance, appointment required',
    defaultTimingRestrictions: 'Before 10:00 AM or after 8:00 PM preferred',
    defaultDocumentationRequirements: 'Delivery receipt, manager signature',
    defaultLoadingArea: 'Rear loading dock, customer service desk'
  },
  'Construction Site': {
    defaultSafetyRequirements: 'Hard hat, safety vest, steel-toe boots mandatory',
    defaultAccessRequirements: 'Site check-in required, safety briefing',
    defaultTimingRestrictions: 'Daylight hours only, no deliveries during concrete pours',
    defaultDocumentationRequirements: 'Delivery ticket, site supervisor signature',
    defaultLoadingArea: 'Designated material staging area'
  },
  'Warehouse': {
    defaultSafetyRequirements: 'High-vis vest, closed-toe shoes',
    defaultAccessRequirements: 'Pre-registration required, gate pass needed',
    defaultTimingRestrictions: 'Business hours only, lunch break 12:00-1:00 PM',
    defaultDocumentationRequirements: 'BOL, warehouse receipt, inventory count',
    defaultLoadingArea: 'Loading bay assignment upon arrival'
  }
};

// Simple route generator function
const generateRouteDocument = (data: RouteData): string => {
  const currentDate = new Date().toLocaleDateString();
  
  return `
ROUTE DOCUMENT
${data.companyName}
MC: ${data.mcNumber} | Phone: ${data.contactPhone}
Generated: ${currentDate}

═══════════════════════════════════════════════════════════

ROUTE INFORMATION
Route #: ${data.routeNumber}
Route Name: ${data.routeName}
Total Miles: ${data.totalMiles}
Total Amount: $${data.totalAmount}
${data.ratePerMile ? `Rate per Mile: $${data.ratePerMile}` : ''}

═══════════════════════════════════════════════════════════

PICKUP INFORMATION
Location: ${data.pickupLocationName}
Address: ${data.pickupAddress}
Pickup Time: ${data.pickupTime}
Contact: ${data.pickupContact}
Manager: ${data.pickupManager}
Phone: ${data.pickupPhone}
Location Type: ${data.locationType}
Confirmation #: ${data.confirmationNumber}

REQUIREMENTS & RESTRICTIONS:
Safety: ${data.safetyRequirements}
Access: ${data.accessRequirements}
Timing: ${data.timingRestrictions}
Documentation: ${data.documentationRequirements}
Loading Area: ${data.loadingArea}

Additional Notes: ${data.pickupNotes}

═══════════════════════════════════════════════════════════

DELIVERY STOPS
${data.stops.length > 0 ? data.stops.map((stop, index) => `
Stop ${index + 1}: ${stop.name}
Address: ${stop.address}
Delivery Time: ${stop.deliveryTime}
Items: ${stop.items}
Contact: ${stop.contact}
Instructions: ${stop.instructions}
`).join('\n') : 'No delivery stops added'}

═══════════════════════════════════════════════════════════

DRIVER ASSIGNMENT
Driver: ${data.driverName || 'Not assigned'}
Vehicle: ${data.vehicleNumber || 'Not assigned'}

═══════════════════════════════════════════════════════════

DISPATCH APPROVAL: ________________    DATE: ___________

DRIVER SIGNATURE: _________________    DATE: ___________

Document generated by FleetFlow Route Generator
`.trim();
};

const RouteGenerator: React.FC<RouteBuilderProps> = ({ 
  onRouteGenerated, 
  initialData = {},
  onClose,
  selectedLoad 
}) => {
  // Convert load data to route data if available
  const convertLoadToRouteData = (load: RouteBuilderProps['selectedLoad']): Partial<RouteData> => {
    if (!load) return {};
    
    return {
      routeNumber: load.id,
      routeName: `${load.origin} to ${load.destination}`,
      totalMiles: load.distance?.replace(' mi', '') || '',
      totalAmount: load.rate?.toString() || '',
      pickupLocationName: load.origin,
      pickupAddress: load.origin,
      pickupTime: load.pickupTime || load.pickupDate,
      stops: [{
        name: load.destination,
        address: load.destination,
        deliveryTime: load.deliveryTime || load.deliveryDate,
        items: `${load.weight || 'Weight TBD'} - ${load.equipment || 'Equipment TBD'}`,
        contact: 'TBD',
        instructions: load.specialInstructions || 'Standard delivery'
      }],
      companyName: 'FleetFlow Logistics',
      mcNumber: 'MC-XXXXX',
      contactPhone: '(555) 123-4567'
    };
  };

  const prePopulatedData = selectedLoad ? convertLoadToRouteData(selectedLoad) : {};

  const [routeData, setRouteData] = useState<RouteData>({
    companyName: 'FleetFlow Logistics',
    mcNumber: 'MC-000000',
    contactPhone: '(555) 123-4567',
    routeNumber: '1',
    routeName: 'Standard Delivery Route',
    totalMiles: '',
    totalAmount: '',
    pickupLocationName: '',
    pickupAddress: '',
    pickupTime: '',
    pickupContact: '',
    pickupManager: '',
    pickupPhone: '',
    locationType: 'Distribution Center',
    confirmationNumber: '',
    safetyRequirements: '',
    accessRequirements: '',
    timingRestrictions: '',
    documentationRequirements: '',
    loadingArea: '',
    pickupNotes: '',
    driverName: '',
    vehicleNumber: '',
    stops: [],
    ...prePopulatedData,
    ...initialData
  });

  const [currentStop, setCurrentStop] = useState<RouteStop>({
    name: '',
    address: '',
    deliveryTime: '',
    items: '',
    contact: '',
    instructions: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewDocument, setPreviewDocument] = useState('');

  // Auto-apply location defaults when location type changes
  useEffect(() => {
    const locationDefaults = LOCATION_TYPES[routeData.locationType as keyof typeof LOCATION_TYPES];
    if (locationDefaults) {
      setRouteData(prev => ({
        ...prev,
        safetyRequirements: prev.safetyRequirements || locationDefaults.defaultSafetyRequirements,
        accessRequirements: prev.accessRequirements || locationDefaults.defaultAccessRequirements,
        timingRestrictions: prev.timingRestrictions || locationDefaults.defaultTimingRestrictions,
        documentationRequirements: prev.documentationRequirements || locationDefaults.defaultDocumentationRequirements,
        loadingArea: prev.loadingArea || locationDefaults.defaultLoadingArea
      }));
    }
  }, [routeData.locationType]);

  // Auto-calculate rate per mile
  useEffect(() => {
    if (routeData.totalAmount && routeData.totalMiles) {
      const ratePerMile = (parseFloat(routeData.totalAmount) / parseFloat(routeData.totalMiles)).toFixed(2);
      setRouteData(prev => ({ ...prev, ratePerMile }));
    }
  }, [routeData.totalAmount, routeData.totalMiles]);

  const handleInputChange = (field: keyof RouteData, value: string) => {
    setRouteData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleStopChange = (field: keyof RouteStop, value: string) => {
    setCurrentStop(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addStop = () => {
    if (!currentStop.name || !currentStop.address) {
      setErrors(prev => ({
        ...prev,
        stopError: 'Stop name and address are required'
      }));
      return;
    }

    setRouteData(prev => ({
      ...prev,
      stops: [...prev.stops, { ...currentStop }]
    }));

    setCurrentStop({
      name: '',
      address: '',
      deliveryTime: '',
      items: '',
      contact: '',
      instructions: ''
    });

    setErrors(prev => ({
      ...prev,
      stopError: ''
    }));
  };

  const removeStop = (index: number) => {
    setRouteData(prev => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index)
    }));
  };

  const generatePreview = () => {
    try {
      const document = generateRouteDocument(routeData);
      setPreviewDocument(document);
      setErrors({});
    } catch (error) {
      setErrors({ general: 'Error generating preview. Please check your inputs.' });
      setPreviewDocument('');
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const document = generateRouteDocument(routeData);
      setPreviewDocument(document);
      if (onRouteGenerated) {
        onRouteGenerated(document);
      }
      setErrors({});
    } catch (error) {
      setErrors({ general: 'Error generating route document. Please check your inputs.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToPDF = () => {
    if (!previewDocument) {
      generatePreview();
      return;
    }
    
    // Create a new window with the document content for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Route Document - ${routeData.routeNumber}</title>
            <style>
              body { font-family: 'Courier New', monospace; white-space: pre-wrap; padding: 20px; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>${previewDocument}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // SMS sending functionality
  const sendRouteSMS = async (routeDocument: string, recipients: { name: string; phone: string; type: 'driver' | 'carrier' }[]) => {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loadData: {
            id: routeData.routeNumber,
            origin: routeData.pickupLocationName,
            destination: routeData.stops.length > 0 ? routeData.stops[0].name : 'TBD',
            rate: `$${routeData.totalAmount}`,
            pickupDate: routeData.pickupTime,
            equipment: 'Various'
          },
          recipients: recipients,
          notificationType: 'sms',
          messageTemplate: 'custom',
          customMessage: `🗺️ ROUTE DOCUMENT - ${routeData.routeNumber}\n\n${routeDocument.substring(0, 500)}...\n\nFull document will be sent via email.`,
          urgency: 'normal'
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { success: false, error: 'Failed to send SMS' };
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🗺️ Route Generator</h2>
          {selectedLoad ? (
            <div className="text-gray-600">
              <p>Generating route document for Load: <span className="font-semibold text-blue-600">{selectedLoad.id}</span></p>
              <p className="text-sm">{selectedLoad.origin} → {selectedLoad.destination}</p>
            </div>
          ) : (
            <p className="text-gray-600">Create professional route documents and delivery instructions</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-xl"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          {/* Company Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🏢 Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={routeData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MC Number</label>
                <input
                  type="text"
                  value={routeData.mcNumber}
                  onChange={(e) => handleInputChange('mcNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Route Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🚛 Route Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route Number</label>
                <input
                  type="text"
                  value={routeData.routeNumber}
                  onChange={(e) => handleInputChange('routeNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route Name</label>
                <input
                  type="text"
                  value={routeData.routeName}
                  onChange={(e) => handleInputChange('routeName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Miles</label>
                <input
                  type="number"
                  value={routeData.totalMiles}
                  onChange={(e) => handleInputChange('totalMiles', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount ($)</label>
                <input
                  type="number"
                  value={routeData.totalAmount}
                  onChange={(e) => handleInputChange('totalAmount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {routeData.ratePerMile && (
              <div className="mt-2 text-sm text-gray-600">
                Rate per mile: ${routeData.ratePerMile}
              </div>
            )}
          </div>

          {/* Pickup Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📦 Pickup Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                  <input
                    type="text"
                    value={routeData.pickupLocationName}
                    onChange={(e) => handleInputChange('pickupLocationName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
                  <select
                    value={routeData.locationType}
                    onChange={(e) => handleInputChange('locationType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.keys(LOCATION_TYPES).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={routeData.pickupAddress}
                  onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
                  <input
                    type="text"
                    value={routeData.pickupTime}
                    onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                    placeholder="e.g., 8:00 AM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={routeData.pickupContact}
                    onChange={(e) => handleInputChange('pickupContact', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={routeData.pickupPhone}
                    onChange={(e) => handleInputChange('pickupPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Stops */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🏁 Add Delivery Stop</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  placeholder="Stop name"
                  value={currentStop.name}
                  onChange={(e) => handleStopChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Address"
                  value={currentStop.address}
                  onChange={(e) => handleStopChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Delivery time"
                  value={currentStop.deliveryTime}
                  onChange={(e) => handleStopChange('deliveryTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Items/cargo"
                  value={currentStop.items}
                  onChange={(e) => handleStopChange('items', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <button
              onClick={addStop}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-4"
            >
              ➕ Add Stop
            </button>

            {errors.stopError && (
              <div className="text-red-600 text-sm mb-4">{errors.stopError}</div>
            )}

            {/* Existing Stops */}
            {routeData.stops.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Current Stops:</h4>
                {routeData.stops.map((stop, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                    <div>
                      <div className="font-medium">{stop.name}</div>
                      <div className="text-sm text-gray-600">{stop.address}</div>
                    </div>
                    <button
                      onClick={() => removeStop(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Driver Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Driver Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
                <input
                  type="text"
                  value={routeData.driverName}
                  onChange={(e) => handleInputChange('driverName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                <input
                  type="text"
                  value={routeData.vehicleNumber}
                  onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={generatePreview}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              👁️ Preview
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isGenerating ? '⏳ Generating...' : '🚛 Generate Route'}
            </button>
          </div>

          {/* SMS Sending Section */}
          {previewDocument && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📱 Send Route via SMS</h3>
              
              <div className="space-y-4">
                {/* Quick Send Options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <button
                    onClick={async () => {
                      const driverPhone = routeData.pickupPhone || prompt('Enter driver phone number:');
                      if (driverPhone) {
                        const result = await sendRouteSMS(previewDocument, [
                          { name: routeData.driverName || 'Driver', phone: driverPhone, type: 'driver' }
                        ]);
                        alert(result.success ? '✅ Route sent to driver!' : '❌ Failed to send SMS');
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    📲 Send to Driver
                  </button>
                  
                  <button
                    onClick={async () => {
                      const carrierPhone = prompt('Enter carrier phone number:');
                      if (carrierPhone) {
                        const result = await sendRouteSMS(previewDocument, [
                          { name: routeData.companyName || 'Carrier', phone: carrierPhone, type: 'carrier' }
                        ]);
                        alert(result.success ? '✅ Route sent to carrier!' : '❌ Failed to send SMS');
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    📞 Send to Carrier
                  </button>
                  
                  <button
                    onClick={async () => {
                      const driverPhone = routeData.pickupPhone || prompt('Enter driver phone number:');
                      const carrierPhone = prompt('Enter carrier phone number:');
                      if (driverPhone && carrierPhone) {
                        const result = await sendRouteSMS(previewDocument, [
                          { name: routeData.driverName || 'Driver', phone: driverPhone, type: 'driver' },
                          { name: routeData.companyName || 'Carrier', phone: carrierPhone, type: 'carrier' }
                        ]);
                        alert(result.success ? '✅ Route sent to both parties!' : '❌ Failed to send SMS');
                      }
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                  >
                    📱 Send to Both
                  </button>
                </div>

                {/* Integration Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-sm text-blue-800">
                    💡 <strong>Pro Tip:</strong> Use the Carrier Verification tab to automatically populate verified carrier contact information.
                  </div>
                </div>
              </div>
            </div>
          )}

          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800">{errors.general}</div>
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">📄 Document Preview</h3>
            {previewDocument && (
              <button
                onClick={exportToPDF}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                📄 Print/PDF
              </button>
            )}
          </div>
          {previewDocument ? (
            <div className="bg-white rounded border p-4 h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm font-mono">{previewDocument}</pre>
            </div>
          ) : (
            <div className="bg-white rounded border p-4 h-96 flex items-center justify-center text-gray-500">
              Click "Preview" or "Generate Route" to see the document
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteGenerator;
