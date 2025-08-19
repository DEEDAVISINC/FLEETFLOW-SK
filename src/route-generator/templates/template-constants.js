// FleetFlow Order Confirmation Generator - Template Constants
// Professional order confirmation templates for all pickup location types

export const ORDER_CONFIRMATION_TEMPLATES = {
  // Universal pickup location template - works with ANY facility type
  UNIVERSAL_PICKUP: `# Order Confirmation {routeNumber}: {routeName}

## 🏢 **{companyName}**
**MC# {mcNumber}** | 📞 **{contactPhone}**

## 💰 **RATE: {totalAmount}**
**Miles:** {totalMiles} | **Rate/Mile:** {ratePerMile}

---

## 📍 **PICKUP LOCATION**
### 🏭 **{pickupLocationName}** ({locationType})
**Address:** {pickupAddress}  
**Time:** {pickupTime}  
**Contact:** {pickupContact}  
**Manager:** {pickupManager} - {pickupPhone}  
**Confirmation #:** {confirmationNumber}

### ⚠️ **PICKUP REQUIREMENTS**
- **Safety:** {safetyRequirements}
- **Access:** {accessRequirements}
- **Timing:** {timingRestrictions}
- **Documentation:** {documentationRequirements}
- **Loading Area:** {loadingArea}

### 📋 **PICKUP NOTES**
{pickupNotes}

---

## 🚚 **DELIVERY STOPS**

{deliveryStops}

---

## 👤 **DRIVER INFORMATION**
**Driver:** {driverName}  
**Vehicle:** {vehicleNumber}  
**Date:** {routeDate}

---

## 🗺️ **NAVIGATION**
[**📍 Google Maps Route**]({googleMapsLink})

---

## 📞 **EMERGENCY CONTACTS**
- **Dispatch:** {dispatchPhone}
- **Company:** {contactPhone}
- **Pickup Location:** {pickupPhone}

---

*Generated: {generatedDate} | FleetFlow Order Confirmation System*`,

  // Specialized templates for different location types
  SAM_CLUB_TEMPLATE: `# Order Confirmation {routeNumber}: Sam's Club Deliveries

## 🏢 **{companyName}**
**MC# {mcNumber}** | 📞 **{contactPhone}**

## 💰 **RATE: {totalAmount}**
**Miles:** {totalMiles} | **Rate/Mile:** {ratePerMile}

---

## 🏪 **SAM'S CLUB PICKUP**
### 📦 **{pickupLocationName}**
**Address:** {pickupAddress}  
**Time:** {pickupTime}  
**Manager:** {pickupManager} - {pickupPhone}  
**Confirmation #:** {confirmationNumber}

### ⚠️ **SAM'S CLUB REQUIREMENTS**
- **Check-in:** Report to receiving dock manager
- **Documentation:** Sam's Club vendor credentials required
- **Loading:** Use dock {loadingDock} - merchandise pre-staged
- **Timing:** CRITICAL - Store opens at {storeOpenTime}
- **Safety:** No smoking, reflective vest required in dock area

### 📋 **PICKUP NOTES**
{pickupNotes}

---

## 🏪 **DELIVERY LOCATIONS**

{deliveryStops}

---

## 🗺️ **ROUTE MAP**
[**📍 Optimized Route**]({googleMapsLink})

---

*Generated: {generatedDate} | FleetFlow - Sam's Club Order Confirmation System*`,

  MANUFACTURING_TEMPLATE: `# Order Confirmation {routeNumber}: Industrial Manufacturing Order

## 🏢 **{companyName}**
**MC# {mcNumber}** | 📞 **{contactPhone}**

## 💰 **RATE: {totalAmount}**
**Miles:** {totalMiles} | **Rate/Mile:** {ratePerMile}

---

## 🏭 **MANUFACTURING PICKUP**
### ⚙️ **{pickupLocationName}**
**Address:** {pickupAddress}  
**Shift Time:** {pickupTime}  
**Plant Manager:** {pickupManager} - {pickupPhone}  
**Work Order #:** {confirmationNumber}

### ⚠️ **SAFETY PROTOCOL - MANDATORY**
- **PPE Required:** {safetyRequirements}
- **Facility Access:** {accessRequirements}
- **Shift Coordination:** {timingRestrictions}
- **Load Documentation:** {documentationRequirements}
- **Loading Bay:** {loadingArea}

### 🚨 **CRITICAL MANUFACTURING NOTES**
{pickupNotes}

---

## 🚛 **DELIVERY SCHEDULE**

{deliveryStops}

---

## 🗺️ **INDUSTRIAL ROUTE**
[**📍 Manufacturing Route Map**]({googleMapsLink})

---

*Generated: {generatedDate} | FleetFlow - Industrial Order Confirmation System*`,

  AGRICULTURAL_TEMPLATE: `# Order Confirmation {routeNumber}: Agricultural Delivery Order

## 🏢 **{companyName}**
**MC# {mcNumber}** | 📞 **{contactPhone}**

## 💰 **RATE: {totalAmount}**
**Miles:** {totalMiles} | **Rate/Mile:** {ratePerMile}

---

## 🚜 **FARM PICKUP**
### 🌾 **{pickupLocationName}**
**Farm Address:** {pickupAddress}  
**Harvest/Pickup Time:** {pickupTime}  
**Farm Manager:** {pickupManager} - {pickupPhone}  
**Load Ticket #:** {confirmationNumber}

### 🚜 **AGRICULTURAL REQUIREMENTS**
- **Seasonality:** {safetyRequirements}
- **Farm Access:** {accessRequirements}
- **Timing Critical:** {timingRestrictions}
- **Quality Control:** {documentationRequirements}
- **Loading Area:** {loadingArea}

### 🌾 **FARM NOTES**
{pickupNotes}

---

## 🚛 **DELIVERY DESTINATIONS**

{deliveryStops}

---

## 🗺️ **AGRICULTURAL ROUTE**
[**📍 Farm Route Map**]({googleMapsLink})

---

*Generated: {generatedDate} | FleetFlow - Agricultural Order Confirmation System*`
};

export const DELIVERY_STOP_TEMPLATE = `### {stopNumber}. 📍 **{stopName}**
**Address:** {stopAddress}  
**Time:** {deliveryTime}  
**Items:** {items}  
**Contact:** {contact}  
**Instructions:** {instructions}  

`;

export const PLACEHOLDERS = {
  // Company Information
  '{companyName}': 'Company name',
  '{mcNumber}': 'MC number',
  '{contactPhone}': 'Main company phone',
  '{dispatchPhone}': 'Dispatch phone number',
  
  // Order Information
  '{routeNumber}': 'Order number/ID',
  '{routeName}': 'Order description',
  '{totalMiles}': 'Total order miles',
  '{totalAmount}': 'Total order amount',
  '{ratePerMile}': 'Rate per mile calculation',
  '{routeDate}': 'Order execution date',
  '{generatedDate}': 'Document generation date',
  
  // Universal Pickup Location (works for ANY facility type)
  '{pickupLocation}': 'Generic pickup location name',
  '{pickupLocationName}': 'Specific facility display name',
  '{pickupAddress}': 'Full pickup address',
  '{pickupTime}': 'Pickup time window',
  '{pickupContact}': 'Primary pickup contact',
  '{pickupManager}': 'Facility manager name',
  '{pickupPhone}': 'Pickup location phone',
  '{locationType}': 'Type of pickup facility',
  '{confirmationNumber}': 'Order confirmation/reference number',
  
  // Flexible Requirements (adapt to any facility type)
  '{pickupRequirements}': 'General pickup requirements',
  '{accessRequirements}': 'Facility access requirements',
  '{safetyRequirements}': 'Safety protocols and PPE requirements',
  '{timingRestrictions}': 'Critical timing considerations',
  '{documentationRequirements}': 'Required documentation',
  '{loadingArea}': 'Specific loading bay/area',
  '{pickupNotes}': 'Additional pickup instructions',
  
  // Delivery Information
  '{deliveryStops}': 'Formatted delivery stops list',
  
  // Driver Information
  '{driverName}': 'Assigned driver name',
  '{vehicleNumber}': 'Vehicle/truck number',
  
  // Navigation
  '{googleMapsLink}': 'Google Maps route URL',
  
  // Stop-specific placeholders
  '{stopNumber}': 'Stop sequence number',
  '{stopName}': 'Delivery location name',
  '{stopAddress}': 'Delivery address',
  '{deliveryTime}': 'Delivery time window',
  '{items}': 'Items to deliver',
  '{contact}': 'Delivery contact person',
  '{instructions}': 'Delivery instructions'
};

export const LOCATION_TYPES = {
  'Distribution Center': {
    icon: '📦',
    defaultSafetyRequirements: 'Safety vest required in warehouse areas',
    defaultAccessRequirements: 'Valid ID, warehouse safety training preferred',
    defaultTimingRestrictions: 'Coordinate with warehouse manager for dock assignment',
    defaultDocumentationRequirements: 'BOL, delivery confirmations',
    defaultLoadingArea: 'Assigned dock bay'
  },
  'Manufacturing Plant': {
    icon: '🏭',
    defaultSafetyRequirements: 'Hard hat, safety vest, steel-toe boots mandatory',
    defaultAccessRequirements: 'DOT medical certificate, facility safety training',
    defaultTimingRestrictions: 'Strict adherence to shift schedules',
    defaultDocumentationRequirements: 'Manufacturing work orders, quality certifications',
    defaultLoadingArea: 'Industrial loading bay'
  },
  'Agricultural Facility': {
    icon: '🚜',
    defaultSafetyRequirements: 'Watch for farm equipment, follow posted speed limits',
    defaultAccessRequirements: 'No special requirements',
    defaultTimingRestrictions: 'Early morning pickup preferred for product freshness',
    defaultDocumentationRequirements: 'USDA certificates, load tickets',
    defaultLoadingArea: 'Farm loading area'
  },
  'Port/Terminal': {
    icon: '🚢',
    defaultSafetyRequirements: 'TWIC card visible, follow port safety protocols',
    defaultAccessRequirements: 'Valid TWIC card, DOT medical certificate',
    defaultTimingRestrictions: 'Plan according to port operating hours',
    defaultDocumentationRequirements: 'Port documentation, customs forms',
    defaultLoadingArea: 'Assigned terminal gate'
  },
  'Retail Distribution Center': {
    icon: '🏪',
    defaultSafetyRequirements: 'Reflective vest required in dock areas',
    defaultAccessRequirements: 'Vendor credentials, facility check-in required',
    defaultTimingRestrictions: 'Coordinate with store opening hours',
    defaultDocumentationRequirements: 'Vendor documentation, delivery confirmations',
    defaultLoadingArea: 'Retail loading dock'
  },
  'Industrial/Chemical Facility': {
    icon: '⚗️',
    defaultSafetyRequirements: 'HAZMAT certification, chemical-resistant PPE',
    defaultAccessRequirements: 'HAZMAT endorsement, facility safety clearance',
    defaultTimingRestrictions: 'Safety protocols may require extended timing',
    defaultDocumentationRequirements: 'HAZMAT manifests, safety data sheets',
    defaultLoadingArea: 'Chemical loading facility'
  },
  'Construction Site': {
    icon: '🏗️',
    defaultSafetyRequirements: 'Hard hat, safety vest, steel-toe boots mandatory',
    defaultAccessRequirements: 'Site safety orientation, valid ID',
    defaultTimingRestrictions: 'Coordinate with site supervisor and work hours',
    defaultDocumentationRequirements: 'Delivery tickets, site delivery confirmations',
    defaultLoadingArea: 'Construction delivery area'
  },
  'Air Cargo Facility': {
    icon: '✈️',
    defaultSafetyRequirements: 'Airport security protocols, reflective vest',
    defaultAccessRequirements: 'Airport security clearance, valid ID',
    defaultTimingRestrictions: 'Flight schedules and airport operating hours',
    defaultDocumentationRequirements: 'Air cargo documentation, security forms',
    defaultLoadingArea: 'Air cargo loading zone'
  },
  'Rail/Intermodal Facility': {
    icon: '🚂',
    defaultSafetyRequirements: 'Railway safety training, reflective gear',
    defaultAccessRequirements: 'Railway facility clearance',
    defaultTimingRestrictions: 'Train schedules and yard operations',
    defaultDocumentationRequirements: 'Rail shipping documents, intermodal forms',
    defaultLoadingArea: 'Rail loading platform'
  }
};

export const TEMPLATE_STYLES = {
  CLAUDE_STYLE: 'claude',
  PROFESSIONAL: 'professional',
  MINIMAL: 'minimal',
  DETAILED: 'detailed'
};

export const DEFAULT_ORDER_DATA = {
  companyName: 'FleetFlow Logistics',
  mcNumber: 'MC-000000',
  contactPhone: '(555) 123-4567',
  dispatchPhone: '(555) 123-4567',
  routeNumber: '1',
  routeName: 'Standard Delivery Order',
  totalMiles: 100,
  totalAmount: 500.00,
  ratePerMile: 5.00,
  routeDate: new Date().toLocaleDateString(),
  generatedDate: new Date().toLocaleDateString(),
  pickupLocationName: 'Pickup Location',
  pickupAddress: '123 Pickup Street, City, State 12345',
  pickupTime: '8:00 AM - 9:00 AM',
  pickupContact: 'Contact Person (555) 123-4567',
  pickupManager: 'Manager Name',
  pickupPhone: '(555) 123-4567',
  locationType: 'Distribution Center',
  confirmationNumber: 'CONF-123456',
  driverName: 'Driver Name',
  vehicleNumber: 'T-001',
  stops: []
};
