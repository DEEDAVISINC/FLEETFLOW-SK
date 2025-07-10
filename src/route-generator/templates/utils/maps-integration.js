// FleetFlow Route Generator - Google Maps Integration Utilities

/**
 * Generate Google Maps directions URL for multiple stops
 * @param {Array} addresses - Array of addresses
 * @param {Object} options - Configuration options
 * @returns {String} - Google Maps directions URL
 */
export function generateDirectionsLink(addresses, options = {}) {
  if (!addresses || addresses.length === 0) {
    return 'https://maps.google.com';
  }
  
  const validAddresses = addresses.filter(addr => addr && addr.trim() !== '');
  
  if (validAddresses.length === 0) {
    return 'https://maps.google.com';
  }
  
  if (validAddresses.length === 1) {
    // Single address - just show location
    const query = encodeURIComponent(validAddresses[0]);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }
  
  // Multiple addresses - create route
  const origin = encodeURIComponent(validAddresses[0]);
  const destination = encodeURIComponent(validAddresses[validAddresses.length - 1]);
  
  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
  
  // Add waypoints if there are intermediate stops
  if (validAddresses.length > 2) {
    const waypoints = validAddresses.slice(1, -1)
      .map(addr => encodeURIComponent(addr))
      .join('|');
    url += `&waypoints=${waypoints}`;
  }
  
  // Add travel mode
  const travelMode = options.travelMode || 'driving';
  url += `&travelmode=${travelMode}`;
  
  // Add avoid options if specified
  if (options.avoid) {
    const avoidOptions = Array.isArray(options.avoid) ? options.avoid : [options.avoid];
    url += `&avoid=${avoidOptions.join('|')}`;
  }
  
  return url;
}

/**
 * Generate individual location links for each address
 * @param {Array} addresses - Array of addresses
 * @returns {Array} - Array of location link objects
 */
export function generateLocationLinks(addresses) {
  if (!addresses || addresses.length === 0) {
    return [];
  }
  
  return addresses
    .filter(addr => addr && addr.trim() !== '')
    .map((address, index) => ({
      address,
      index: index + 1,
      link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      streetViewLink: `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${encodeURIComponent(address)}`
    }));
}

/**
 * Generate Google Maps embed URL for displaying map in iframe
 * @param {Array} addresses - Array of addresses
 * @param {String} apiKey - Google Maps API key
 * @param {Object} options - Embed options
 * @returns {String} - Google Maps embed URL
 */
export function generateEmbedLink(addresses, apiKey, options = {}) {
  if (!addresses || addresses.length === 0 || !apiKey) {
    return null;
  }
  
  const validAddresses = addresses.filter(addr => addr && addr.trim() !== '');
  
  if (validAddresses.length === 0) {
    return null;
  }
  
  let url = 'https://www.google.com/maps/embed/v1/';
  
  if (validAddresses.length === 1) {
    // Single location
    url += `place?key=${apiKey}&q=${encodeURIComponent(validAddresses[0])}`;
  } else {
    // Multiple locations - directions
    url += `directions?key=${apiKey}`;
    url += `&origin=${encodeURIComponent(validAddresses[0])}`;
    url += `&destination=${encodeURIComponent(validAddresses[validAddresses.length - 1])}`;
    
    if (validAddresses.length > 2) {
      const waypoints = validAddresses.slice(1, -1)
        .map(addr => encodeURIComponent(addr))
        .join('|');
      url += `&waypoints=${waypoints}`;
    }
  }
  
  // Add mode
  const mode = options.mode || 'driving';
  url += `&mode=${mode}`;
  
  // Add avoid options
  if (options.avoid) {
    url += `&avoid=${options.avoid}`;
  }
  
  // Add zoom level
  if (options.zoom) {
    url += `&zoom=${options.zoom}`;
  }
  
  return url;
}

/**
 * Estimate travel time and distance using Google Maps
 * @param {String} origin - Starting address
 * @param {String} destination - Ending address
 * @param {String} apiKey - Google Maps API key
 * @returns {Promise} - Promise resolving to travel information
 */
export async function estimateTravelInfo(origin, destination, apiKey) {
  if (!origin || !destination || !apiKey) {
    throw new Error('Origin, destination, and API key are required');
  }
  
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?` +
    `origins=${encodeURIComponent(origin)}&` +
    `destinations=${encodeURIComponent(destination)}&` +
    `key=${apiKey}&` +
    `units=imperial&` +
    `mode=driving`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
      const element = data.rows[0].elements[0];
      
      return {
        distance: element.distance.text,
        distanceValue: element.distance.value, // in meters
        duration: element.duration.text,
        durationValue: element.duration.value, // in seconds
        distanceMiles: Math.round(element.distance.value * 0.000621371 * 100) / 100,
        durationHours: Math.round(element.duration.value / 3600 * 100) / 100
      };
    } else {
      throw new Error(`Google Maps API error: ${data.status}`);
    }
  } catch (error) {
    console.error('Travel estimation failed:', error);
    throw error;
  }
}

/**
 * Generate route optimization suggestions
 * @param {Array} addresses - Array of addresses to optimize
 * @param {String} apiKey - Google Maps API key
 * @returns {Promise} - Promise resolving to optimized route
 */
export async function optimizeRoute(addresses, apiKey) {
  if (!addresses || addresses.length < 3 || !apiKey) {
    return { optimized: addresses, savings: null };
  }
  
  // For route optimization, we would typically use Google Maps API
  // This is a simplified version - in production, use the actual API
  
  try {
    // Calculate distances between all points
    const distanceMatrix = await calculateDistanceMatrix(addresses, apiKey);
    
    // Simple nearest neighbor optimization
    const optimizedRoute = nearestNeighborOptimization(addresses, distanceMatrix);
    
    return {
      optimized: optimizedRoute,
      originalDistance: calculateTotalDistance(addresses, distanceMatrix),
      optimizedDistance: calculateTotalDistance(optimizedRoute, distanceMatrix),
      savings: null // Calculate savings percentage
    };
    
  } catch (error) {
    console.error('Route optimization failed:', error);
    return { optimized: addresses, savings: null };
  }
}

/**
 * Calculate distance matrix for multiple addresses
 * @param {Array} addresses - Array of addresses
 * @param {String} apiKey - Google Maps API key
 * @returns {Promise} - Promise resolving to distance matrix
 */
async function calculateDistanceMatrix(addresses, apiKey) {
  const origins = addresses.map(addr => encodeURIComponent(addr)).join('|');
  const destinations = origins; // Same for matrix calculation
  
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?` +
    `origins=${origins}&` +
    `destinations=${destinations}&` +
    `key=${apiKey}&` +
    `units=imperial&` +
    `mode=driving`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.status !== 'OK') {
    throw new Error(`Distance matrix API error: ${data.status}`);
  }
  
  return data.rows.map(row => 
    row.elements.map(element => 
      element.status === 'OK' ? element.distance.value : Infinity
    )
  );
}

/**
 * Simple nearest neighbor route optimization
 * @param {Array} addresses - Original addresses
 * @param {Array} distanceMatrix - Distance matrix
 * @returns {Array} - Optimized address order
 */
function nearestNeighborOptimization(addresses, distanceMatrix) {
  if (addresses.length < 3) return addresses;
  
  const optimized = [addresses[0]]; // Start with first address
  const remaining = addresses.slice(1, -1); // Middle addresses to optimize
  const lastAddress = addresses[addresses.length - 1]; // End address
  
  let currentIndex = 0;
  
  while (remaining.length > 0) {
    let nearestIndex = 0;
    let shortestDistance = Infinity;
    
    remaining.forEach((addr, index) => {
      const originalIndex = addresses.indexOf(addr);
      const distance = distanceMatrix[currentIndex][originalIndex];
      
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestIndex = index;
      }
    });
    
    const nearest = remaining.splice(nearestIndex, 1)[0];
    optimized.push(nearest);
    currentIndex = addresses.indexOf(nearest);
  }
  
  optimized.push(lastAddress); // Add final destination
  return optimized;
}

/**
 * Calculate total distance for a route
 * @param {Array} route - Ordered addresses
 * @param {Array} distanceMatrix - Distance matrix
 * @returns {Number} - Total distance in meters
 */
function calculateTotalDistance(route, distanceMatrix) {
  let totalDistance = 0;
  
  for (let i = 0; i < route.length - 1; i++) {
    const fromIndex = route.indexOf(route[i]);
    const toIndex = route.indexOf(route[i + 1]);
    totalDistance += distanceMatrix[fromIndex][toIndex];
  }
  
  return totalDistance;
}

/**
 * Generate printable driving directions
 * @param {Array} addresses - Array of addresses
 * @returns {String} - Text-based driving directions
 */
export function generatePrintableDirections(addresses) {
  if (!addresses || addresses.length < 2) {
    return 'No route specified';
  }
  
  let directions = 'DRIVING DIRECTIONS:\n\n';
  
  addresses.forEach((address, index) => {
    if (index === 0) {
      directions += `START: ${address}\n\n`;
    } else if (index === addresses.length - 1) {
      directions += `${index}. FINAL DESTINATION: ${address}\n`;
    } else {
      directions += `${index}. STOP: ${address}\n`;
    }
    
    if (index < addresses.length - 1) {
      directions += `   → Proceed to next location\n\n`;
    }
  });
  
  directions += '\nGoogle Maps Link:\n';
  directions += generateDirectionsLink(addresses);
  
  return directions;
}

/**
 * Validate address format and suggest corrections
 * @param {String} address - Address to validate
 * @returns {Object} - Validation result with suggestions
 */
export function validateAddress(address) {
  if (!address || address.trim() === '') {
    return {
      isValid: false,
      suggestions: ['Address cannot be empty'],
      formatted: null
    };
  }
  
  const suggestions = [];
  let formatted = address.trim();
  
  // Check for common format issues
  if (!address.match(/\d/)) {
    suggestions.push('Address should include a street number');
  }
  
  if (!address.match(/[A-Z]{2}\s+\d{5}/)) {
    suggestions.push('Address should include state and ZIP code (e.g., "CA 90210")');
  }
  
  // Basic formatting improvements
  formatted = formatted.replace(/\s+/g, ' '); // Remove extra spaces
  formatted = formatted.replace(/\b\w/g, l => l.toUpperCase()); // Title case
  
  return {
    isValid: suggestions.length === 0,
    suggestions,
    formatted
  };
}

/**
 * Generate mobile-friendly map links
 * @param {Array} addresses - Array of addresses
 * @returns {Object} - Mobile app links
 */
export function generateMobileMapLinks(addresses) {
  if (!addresses || addresses.length === 0) {
    return {};
  }
  
  const directionsLink = generateDirectionsLink(addresses);
  
  return {
    googleMaps: directionsLink,
    appleMaps: directionsLink.replace('google.com/maps', 'maps.apple.com'),
    waze: `https://waze.com/ul?q=${encodeURIComponent(addresses[addresses.length - 1])}`,
    coordinates: addresses.map(addr => ({
      address: addr,
      link: `geo:0,0?q=${encodeURIComponent(addr)}`
    }))
  };
}
