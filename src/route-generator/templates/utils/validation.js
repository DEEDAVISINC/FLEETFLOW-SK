// FleetFlow Route Generator - Validation and Utility Functions

/**
 * Validate route data for document generation
 * @param {Object} routeData - Route data to validate
 * @returns {Object} - Validation result with isValid boolean and errors array
 */
export function validateRouteData(routeData) {
  const errors = [];
  
  // Required fields
  const requiredFields = [
    'companyName',
    'routeNumber',
    'pickupLocationName',
    'pickupAddress'
  ];
  
  requiredFields.forEach(field => {
    if (!routeData[field] || routeData[field].toString().trim() === '') {
      errors.push(`${field} is required`);
    }
  });
  
  // Validate numeric fields
  if (routeData.totalMiles && (isNaN(routeData.totalMiles) || routeData.totalMiles <= 0)) {
    errors.push('totalMiles must be a positive number');
  }
  
  if (routeData.totalAmount && (isNaN(routeData.totalAmount) || routeData.totalAmount <= 0)) {
    errors.push('totalAmount must be a positive number');
  }
  
  // Validate phone numbers (basic format check)
  if (routeData.contactPhone && !isValidPhoneNumber(routeData.contactPhone)) {
    errors.push('contactPhone must be a valid phone number format');
  }
  
  // Validate stops array
  if (routeData.stops && Array.isArray(routeData.stops)) {
    routeData.stops.forEach((stop, index) => {
      if (!stop.name || stop.name.trim() === '') {
        errors.push(`Stop ${index + 1}: name is required`);
      }
      if (!stop.address || stop.address.trim() === '') {
        errors.push(`Stop ${index + 1}: address is required`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validate phone number format (basic validation)
 * @param {String} phone - Phone number to validate
 * @returns {Boolean} - True if valid format
 */
function isValidPhoneNumber(phone) {
  // Allow formats: (555) 123-4567, 555-123-4567, 555.123.4567, 5551234567
  const phoneRegex = /^[\+]?[(]?[\d\s\-\.\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Calculate rate per mile from total amount and miles
 * @param {Number} totalAmount - Total rate amount
 * @param {Number} totalMiles - Total miles
 * @returns {Number} - Rate per mile (rounded to 2 decimal places)
 */
export function calculateRatePerMile(totalAmount, totalMiles) {
  if (!totalAmount || !totalMiles || totalMiles === 0) {
    return 0;
  }
  return Math.round((totalAmount / totalMiles) * 100) / 100;
}

/**
 * Generate Google Maps route link for multiple addresses
 * @param {Array} addresses - Array of addresses
 * @returns {String} - Google Maps URL
 */
export function generateGoogleMapsLink(addresses) {
  if (!addresses || addresses.length === 0) {
    return 'https://maps.google.com';
  }
  
  // Filter out empty addresses
  const validAddresses = addresses.filter(addr => addr && addr.trim() !== '');
  
  if (validAddresses.length === 0) {
    return 'https://maps.google.com';
  }
  
  if (validAddresses.length === 1) {
    // Single address - just show location
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(validAddresses[0])}`;
  }
  
  // Multiple addresses - create route
  const origin = encodeURIComponent(validAddresses[0]);
  const destination = encodeURIComponent(validAddresses[validAddresses.length - 1]);
  
  let waypoints = '';
  if (validAddresses.length > 2) {
    const middleAddresses = validAddresses.slice(1, -1);
    waypoints = '&waypoints=' + middleAddresses.map(addr => encodeURIComponent(addr)).join('|');
  }
  
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints}&travelmode=driving`;
}

/**
 * Sanitize input data for document generation
 * @param {Object} data - Raw input data
 * @returns {Object} - Sanitized data
 */
export function sanitizeRouteData(data) {
  const sanitized = {};
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    
    if (typeof value === 'string') {
      // Remove potentially dangerous characters, trim whitespace
      sanitized[key] = value.trim().replace(/[<>]/g, '');
    } else if (typeof value === 'number') {
      // Ensure numbers are valid
      sanitized[key] = isNaN(value) ? 0 : value;
    } else if (Array.isArray(value)) {
      // Recursively sanitize array elements
      sanitized[key] = value.map(item => 
        typeof item === 'object' ? sanitizeRouteData(item) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeRouteData(value);
    } else {
      sanitized[key] = value;
    }
  });
  
  return sanitized;
}

/**
 * Format currency values consistently
 * @param {Number} amount - Amount to format
 * @returns {String} - Formatted currency string
 */
export function formatCurrency(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '$0.00';
  }
  return `$${Number(amount).toFixed(2)}`;
}

/**
 * Format phone number consistently
 * @param {String} phone - Phone number to format
 * @returns {String} - Formatted phone number
 */
export function formatPhoneNumber(phone) {
  if (!phone) return '';
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Format as (555) 123-4567
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  // Return original if can't format
  return phone;
}

/**
 * Validate and format time strings
 * @param {String} timeString - Time to validate/format
 * @returns {String} - Formatted time string or original if invalid
 */
export function formatTimeString(timeString) {
  if (!timeString) return '';
  
  // Common time patterns
  const timePatterns = [
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i,
    /^(\d{1,2})\s*(AM|PM)$/i,
    /^(\d{1,2}):(\d{2})$/
  ];
  
  for (const pattern of timePatterns) {
    const match = timeString.trim().match(pattern);
    if (match) {
      return timeString.trim();
    }
  }
  
  return timeString; // Return original if no pattern matches
}

/**
 * Generate route confirmation number
 * @param {Object} routeData - Route data
 * @returns {String} - Generated confirmation number
 */
export function generateConfirmationNumber(routeData) {
  const prefix = routeData.companyName ? routeData.companyName.substring(0, 2).toUpperCase() : 'FL';
  const routeNum = routeData.routeNumber || '1';
  const timestamp = Date.now().toString().slice(-6);
  
  return `${prefix}-${routeNum}-${timestamp}`;
}

/**
 * Estimate travel time between addresses
 * @param {Number} miles - Total miles
 * @param {Number} avgSpeed - Average speed in mph (default 55)
 * @returns {Object} - Travel time estimate
 */
export function estimateTravelTime(miles, avgSpeed = 55) {
  if (!miles || miles <= 0) {
    return { hours: 0, minutes: 0, formatted: '0 hours' };
  }
  
  const totalHours = miles / avgSpeed;
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  
  let formatted = '';
  if (hours > 0) {
    formatted += `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  if (minutes > 0) {
    if (formatted) formatted += ' ';
    formatted += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  return {
    hours,
    minutes,
    totalHours: Math.round(totalHours * 100) / 100,
    formatted: formatted || '0 minutes'
  };
}

/**
 * Check if route data has required fields for specific template type
 * @param {Object} routeData - Route data to check
 * @param {String} templateType - Type of template ('universal', 'sams-club', etc.)
 * @returns {Object} - Validation result
 */
export function validateForTemplateType(routeData, templateType) {
  const baseValidation = validateRouteData(routeData);
  
  if (!baseValidation.isValid) {
    return baseValidation;
  }
  
  const errors = [];
  
  switch (templateType) {
    case 'sams-club':
      if (!routeData.pickupLocationName || !routeData.pickupLocationName.toLowerCase().includes('sam')) {
        errors.push('Sam\'s Club template requires Sam\'s Club location');
      }
      break;
      
    case 'manufacturing':
      if (!routeData.safetyRequirements) {
        errors.push('Manufacturing template requires safety requirements');
      }
      break;
      
    case 'agricultural':
      if (!routeData.pickupTime) {
        errors.push('Agricultural template requires pickup time for freshness tracking');
      }
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors: [...baseValidation.errors, ...errors]
  };
}
