// FleetFlow Route Generator - Core Generation Functions
import { 
  ROUTE_TEMPLATES, 
  DELIVERY_STOP_TEMPLATE, 
  PLACEHOLDERS, 
  LOCATION_TYPES,
  DEFAULT_ROUTE_DATA 
} from './template-constants.js';
import { validateRouteData, generateGoogleMapsLink, calculateRatePerMile } from './utils/validation.js';

/**
 * Universal route document generator - works with ANY pickup location type
 * @param {Object} routeData - Route information object
 * @returns {String} - Generated markdown document
 */
export function generateUniversalPickupDocument(routeData) {
  try {
    // Validate input data
    const validation = validateRouteData(routeData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Merge with defaults and process data
    const processedData = processRouteData(routeData);
    
    // Auto-detect location type if not provided
    if (!processedData.locationType && processedData.pickupLocationName) {
      processedData.locationType = determineLocationTypeFromName(processedData.pickupLocationName);
    }

    // Apply location-specific defaults
    applyLocationDefaults(processedData);

    // Generate delivery stops
    processedData.deliveryStops = generateDeliveryStopsMarkdown(processedData.stops || []);

    // Replace template placeholders
    const template = ROUTE_TEMPLATES.UNIVERSAL_PICKUP;
    return replaceTemplatePlaceholders(template, processedData);

  } catch (error) {
    console.error('Route generation failed:', error);
    throw new Error(`Failed to generate route document: ${error.message}`);
  }
}

/**
 * Generate Sam's Club specific route document
 * @param {Object} routeData - Route information object
 * @returns {String} - Generated markdown document
 */
export function generateSamsClubDeliveryDocument(routeData) {
  const processedData = {
    ...DEFAULT_ROUTE_DATA,
    ...routeData,
    locationType: 'Retail Distribution Center',
    storeOpenTime: routeData.storeOpenTime || '6:00 AM',
    loadingDock: routeData.loadingDock || 'TBD'
  };

  applyLocationDefaults(processedData);
  processedData.deliveryStops = generateDeliveryStopsMarkdown(processedData.stops || []);

  const template = ROUTE_TEMPLATES.SAM_CLUB_TEMPLATE;
  return replaceTemplatePlaceholders(template, processedData);
}

/**
 * Generate manufacturing plant route document
 * @param {Object} routeData - Route information object
 * @returns {String} - Generated markdown document
 */
export function generateManufacturingRouteDocument(routeData) {
  const processedData = {
    ...DEFAULT_ROUTE_DATA,
    ...routeData,
    locationType: 'Manufacturing Plant'
  };

  applyLocationDefaults(processedData);
  processedData.deliveryStops = generateDeliveryStopsMarkdown(processedData.stops || []);

  const template = ROUTE_TEMPLATES.MANUFACTURING_TEMPLATE;
  return replaceTemplatePlaceholders(template, processedData);
}

/**
 * Generate agricultural facility route document
 * @param {Object} routeData - Route information object
 * @returns {String} - Generated markdown document
 */
export function generateAgriculturalRouteDocument(routeData) {
  const processedData = {
    ...DEFAULT_ROUTE_DATA,
    ...routeData,
    locationType: 'Agricultural Facility'
  };

  applyLocationDefaults(processedData);
  processedData.deliveryStops = generateDeliveryStopsMarkdown(processedData.stops || []);

  const template = ROUTE_TEMPLATES.AGRICULTURAL_TEMPLATE;
  return replaceTemplatePlaceholders(template, processedData);
}

/**
 * Generate route document using Claude AI style formatting
 * @param {Object} routeData - Route information object
 * @returns {String} - Generated markdown document
 */
export function generateClaudeStyleRouteDocument(routeData) {
  return generateUniversalPickupDocument(routeData);
}

/**
 * Process and enhance route data with calculations and links
 * @param {Object} routeData - Raw route data
 * @returns {Object} - Processed route data
 */
function processRouteData(routeData) {
  const processed = {
    ...DEFAULT_ROUTE_DATA,
    ...routeData
  };

  // Calculate rate per mile
  if (processed.totalAmount && processed.totalMiles) {
    processed.ratePerMile = calculateRatePerMile(processed.totalAmount, processed.totalMiles);
  }

  // Generate Google Maps link
  if (processed.pickupAddress && processed.stops && processed.stops.length > 0) {
    const addresses = [
      processed.pickupAddress,
      ...processed.stops.map(stop => stop.address).filter(addr => addr)
    ];
    processed.googleMapsLink = generateGoogleMapsLink(addresses);
  }

  // Set generation date
  processed.generatedDate = new Date().toLocaleDateString();

  return processed;
}

/**
 * Apply location-specific defaults based on facility type
 * @param {Object} routeData - Route data to enhance
 */
function applyLocationDefaults(routeData) {
  const locationDefaults = LOCATION_TYPES[routeData.locationType];
  if (!locationDefaults) return;

  // Apply defaults only if not already specified
  if (!routeData.safetyRequirements) {
    routeData.safetyRequirements = locationDefaults.defaultSafetyRequirements;
  }
  if (!routeData.accessRequirements) {
    routeData.accessRequirements = locationDefaults.defaultAccessRequirements;
  }
  if (!routeData.timingRestrictions) {
    routeData.timingRestrictions = locationDefaults.defaultTimingRestrictions;
  }
  if (!routeData.documentationRequirements) {
    routeData.documentationRequirements = locationDefaults.defaultDocumentationRequirements;
  }
  if (!routeData.loadingArea) {
    routeData.loadingArea = locationDefaults.defaultLoadingArea;
  }
}

/**
 * Generate delivery stops markdown from stops array
 * @param {Array} stops - Array of delivery stop objects
 * @returns {String} - Formatted delivery stops markdown
 */
function generateDeliveryStopsMarkdown(stops) {
  if (!stops || stops.length === 0) {
    return '### 📍 **No delivery stops specified**\n\n';
  }

  return stops.map((stop, index) => {
    const stopData = {
      stopNumber: index + 1,
      stopName: stop.name || `Stop ${index + 1}`,
      stopAddress: stop.address || 'Address TBD',
      deliveryTime: stop.deliveryTime || 'TBD',
      items: stop.items || 'Items TBD',
      contact: stop.contact || 'Contact TBD',
      instructions: stop.instructions || 'Standard delivery'
    };

    return replaceTemplatePlaceholders(DELIVERY_STOP_TEMPLATE, stopData);
  }).join('');
}

/**
 * Replace template placeholders with actual data
 * @param {String} template - Template string with placeholders
 * @param {Object} data - Data object with replacement values
 * @returns {String} - Template with placeholders replaced
 */
function replaceTemplatePlaceholders(template, data) {
  let result = template;

  // Replace all placeholders
  Object.keys(PLACEHOLDERS).forEach(placeholder => {
    const key = placeholder.replace(/[{}]/g, ''); // Remove braces
    const value = data[key] || placeholder; // Keep placeholder if no data
    
    // Handle special formatting for monetary values
    if (key === 'totalAmount' && typeof data[key] === 'number') {
      result = result.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), `$${data[key].toFixed(2)}`);
    } else if (key === 'ratePerMile' && typeof data[key] === 'number') {
      result = result.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), `$${data[key].toFixed(2)}`);
    } else {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
  });

  return result;
}

/**
 * Automatically determine location type from facility name
 * @param {String} locationName - Name of the pickup location
 * @returns {String} - Detected location type
 */
function determineLocationTypeFromName(locationName) {
  const name = locationName.toLowerCase();

  // Sam's Club / Costco
  if (name.includes("sam's club") || name.includes('sams club') || 
      name.includes('costco') || name.includes('walmart')) {
    return 'Retail Distribution Center';
  }

  // Manufacturing indicators
  if (name.includes('manufacturing') || name.includes('plant') || 
      name.includes('factory') || name.includes('mill') || 
      name.includes('steel') || name.includes('auto')) {
    return 'Manufacturing Plant';
  }

  // Agricultural indicators
  if (name.includes('farm') || name.includes('ranch') || 
      name.includes('dairy') || name.includes('grain') || 
      name.includes('agriculture')) {
    return 'Agricultural Facility';
  }

  // Port/Terminal indicators
  if (name.includes('port') || name.includes('terminal') || 
      name.includes('marine') || name.includes('shipping')) {
    return 'Port/Terminal';
  }

  // Chemical/Industrial indicators
  if (name.includes('chemical') || name.includes('refinery') || 
      name.includes('oil') || name.includes('gas')) {
    return 'Industrial/Chemical Facility';
  }

  // Construction indicators
  if (name.includes('construction') || name.includes('building supply') || 
      name.includes('lumber') || name.includes('concrete')) {
    return 'Construction Site';
  }

  // Airport indicators
  if (name.includes('airport') || name.includes('air cargo') || 
      name.includes('cargo') && name.includes('air')) {
    return 'Air Cargo Facility';
  }

  // Rail indicators
  if (name.includes('rail') || name.includes('intermodal') || 
      name.includes('train') || name.includes('railway')) {
    return 'Rail/Intermodal Facility';
  }

  // Default to distribution center
  return 'Distribution Center';
}

/**
 * Add a delivery stop to existing route data
 * @param {Object} routeData - Existing route data
 * @param {Object} newStop - New stop to add
 * @returns {Object} - Updated route data
 */
export function addRouteStop(routeData, newStop) {
  if (!routeData.stops) {
    routeData.stops = [];
  }

  const stop = {
    name: newStop.name || `Stop ${routeData.stops.length + 1}`,
    address: newStop.address,
    deliveryTime: newStop.deliveryTime || 'TBD',
    items: newStop.items || 'TBD',
    contact: newStop.contact || 'TBD',
    instructions: newStop.instructions || 'Standard delivery'
  };

  routeData.stops.push(stop);

  // Regenerate Google Maps link with new stop
  if (routeData.pickupAddress) {
    const addresses = [
      routeData.pickupAddress,
      ...routeData.stops.map(stop => stop.address).filter(addr => addr)
    ];
    routeData.googleMapsLink = generateGoogleMapsLink(addresses);
  }

  return routeData;
}

/**
 * Generate multiple route documents efficiently
 * @param {Array} routeDataArray - Array of route data objects
 * @returns {Array} - Array of generation results
 */
export function generateMultipleRoutes(routeDataArray) {
  return routeDataArray.map(routeData => {
    try {
      return {
        id: routeData.routeNumber || routeData.id,
        document: generateUniversalPickupDocument(routeData),
        success: true,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      return {
        id: routeData.routeNumber || routeData.id,
        error: error.message,
        success: false,
        generatedAt: new Date().toISOString()
      };
    }
  });
}

/**
 * Safe route generation with comprehensive error handling
 * @param {Object} routeData - Route data object
 * @returns {Object} - Generation result with success/error info
 */
export function safeGenerateRoute(routeData) {
  try {
    // Validate required fields
    const validation = validateRouteData(routeData);
    if (!validation.isValid) {
      return {
        success: false,
        error: 'Validation failed',
        details: validation.errors
      };
    }

    // Generate document
    const document = generateUniversalPickupDocument(routeData);

    return {
      success: true,
      document: document,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Route generation failed:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}
