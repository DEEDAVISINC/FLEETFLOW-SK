/**
 * FleetFlow Load Identification Service
 * Generates comprehensive load identification numbers based on broker input
 * Creates meaningful, traceable IDs for interoffice load management
 */

export interface LoadIdentificationData {
  // Basic Load Information
  origin: string;
  destination: string;
  pickupDate: string;
  equipment: string;
  loadType?: 'FTL' | 'LTL' | 'Partial' | 'Expedited' | 'Hazmat';
  
  // Broker Information (Interoffice)
  brokerInitials: string; // e.g., "JD" for John Doe
  brokerCode?: string;
  
  // Shipper/Vendor Information
  shipperName?: string;
  shipperCode?: string;
  vendorCode?: string;
  
  // Weight Class Information
  weight?: string;
  weightClass?: 'Light' | 'Medium' | 'Heavy' | 'Overweight';
  
  // Additional Identifiers
  commodity?: string;
  rate?: number;
  distance?: string;
  
  // Special Requirements
  isHazmat?: boolean;
  isExpedited?: boolean;
  isRefrigerated?: boolean;
  isOversized?: boolean;
}

export interface GeneratedLoadIdentifiers {
  // Primary Load ID
  loadId: string;
  
  // Secondary Identifiers
  shortId: string;
  trackingNumber: string;
  bolNumber: string;
  proNumber: string;
  
  // Reference Numbers
  brokerReference: string;
  shipperReference: string;
  vendorReference: string;
  
  // Regional/Route Identifiers
  routeCode: string;
  laneCode: string;
  
  // Equipment/Service Identifiers
  equipmentCode: string;
  serviceCode: string;
  weightClassCode: string;
  
  // Date-based Identifiers
  dateCode: string;
  
  // Validation Information
  checkDigit: string;
  generatedAt: string;
  identifierVersion: string;
}

export class LoadIdentificationService {
  private static readonly IDENTIFIER_VERSION = 'v2.1';
  private static readonly LOAD_SEQUENCE_KEY = 'fleetflow_load_sequence';
  
  // City/State Code Mapping for Major Markets
  private static readonly CITY_CODES: Record<string, string> = {
    // Major Markets - Northeast
    'new york, ny': 'NYC',
    'boston, ma': 'BOS',
    'philadelphia, pa': 'PHL',
    'baltimore, md': 'BWI',
    'washington, dc': 'DCA',
    'albany, ny': 'ALB',
    'hartford, ct': 'HFD',
    'providence, ri': 'PVD',
    
    // Major Markets - Southeast
    'atlanta, ga': 'ATL',
    'miami, fl': 'MIA',
    'orlando, fl': 'ORL',
    'tampa, fl': 'TPA',
    'jacksonville, fl': 'JAX',
    'charlotte, nc': 'CLT',
    'raleigh, nc': 'RDU',
    'nashville, tn': 'BNA',
    'memphis, tn': 'MEM',
    'new orleans, la': 'MSY',
    'birmingham, al': 'BHM',
    'charleston, sc': 'CHS',
    'savannah, ga': 'SAV',
    
    // Major Markets - Midwest
    'chicago, il': 'CHI',
    'detroit, mi': 'DTW',
    'milwaukee, wi': 'MKE',
    'minneapolis, mn': 'MSP',
    'st. louis, mo': 'STL',
    'kansas city, mo': 'MCI',
    'omaha, ne': 'OMA',
    'des moines, ia': 'DSM',
    'indianapolis, in': 'IND',
    'columbus, oh': 'CMH',
    'cleveland, oh': 'CLE',
    'cincinnati, oh': 'CVG',
    'toledo, oh': 'TOL',
    'grand rapids, mi': 'GRR',
    
    // Major Markets - Southwest
    'dallas, tx': 'DFW',
    'houston, tx': 'HOU',
    'san antonio, tx': 'SAT',
    'austin, tx': 'AUS',
    'el paso, tx': 'ELP',
    'phoenix, az': 'PHX',
    'tucson, az': 'TUS',
    'albuquerque, nm': 'ABQ',
    'oklahoma city, ok': 'OKC',
    'tulsa, ok': 'TUL',
    'little rock, ar': 'LIT',
    
    // Major Markets - West
    'los angeles, ca': 'LAX',
    'san francisco, ca': 'SFO',
    'san diego, ca': 'SAN',
    'sacramento, ca': 'SMF',
    'fresno, ca': 'FAT',
    'bakersfield, ca': 'BFL',
    'las vegas, nv': 'LAS',
    'reno, nv': 'RNO',
    'seattle, wa': 'SEA',
    'portland, or': 'PDX',
    'spokane, wa': 'GEG',
    'boise, id': 'BOI',
    'salt lake city, ut': 'SLC',
    'denver, co': 'DEN',
    'colorado springs, co': 'COS',
    
    // Major Markets - Canada
    'toronto, on': 'YYZ',
    'vancouver, bc': 'YVR',
    'montreal, qc': 'YUL',
    'calgary, ab': 'YYC',
    'winnipeg, mb': 'YWG',
    
    // Major Markets - Mexico
    'mexico city, mx': 'MEX',
    'guadalajara, mx': 'GDL',
    'monterrey, mx': 'MTY',
    'tijuana, mx': 'TIJ',
    'juarez, mx': 'CJS'
  };
  
  // Equipment Type Codes
  private static readonly EQUIPMENT_CODES: Record<string, string> = {
    'dry van': 'DV',
    'refrigerated': 'RF',
    'reefer': 'RF',
    'flatbed': 'FB',
    'step deck': 'SD',
    'lowboy': 'LB',
    'power only': 'PO',
    'container': 'CN',
    'tanker': 'TK',
    'dump': 'DP',
    'auto carrier': 'AC',
    'van': 'VN',
    'box truck': 'BT',
    'straight truck': 'ST',
    'bobtail': 'BT'
  };
  
  // Load Type Codes
  private static readonly LOAD_TYPE_CODES: Record<string, string> = {
    'FTL': 'F',
    'LTL': 'L',
    'Partial': 'P',
    'Expedited': 'E',
    'Hazmat': 'H'
  };
  
  // Weight Class Codes
  private static readonly WEIGHT_CLASS_CODES: Record<string, string> = {
    'Light': 'L',      // Under 20,000 lbs
    'Medium': 'M',     // 20,000 - 40,000 lbs
    'Heavy': 'H',      // 40,000 - 60,000 lbs
    'Overweight': 'O'  // Over 60,000 lbs
  };
  
  // Service Codes for Special Requirements
  private static readonly SERVICE_CODES: Record<string, string> = {
    'hazmat': 'H',
    'expedited': 'E',
    'refrigerated': 'R',
    'oversized': 'O',
    'team_driver': 'T',
    'white_glove': 'W',
    'inside_delivery': 'I',
    'appointment': 'A'
  };

  /**
   * Generate comprehensive load identifiers based on broker input
   */
  static generateLoadIdentifiers(data: LoadIdentificationData): GeneratedLoadIdentifiers {
    const timestamp = new Date();
    const sequence = this.getNextSequence();
    
    // Extract location codes
    const originCode = this.getLocationCode(data.origin);
    const destinationCode = this.getLocationCode(data.destination);
    
    // Extract equipment and service codes
    const equipmentCode = this.getEquipmentCode(data.equipment);
    const serviceCode = this.getServiceCode(data);
    const loadTypeCode = this.getLoadTypeCode(data.loadType);
    const weightClassCode = this.getWeightClassCode(data.weight, data.weightClass);
    
    // Generate date code
    const dateCode = this.generateDateCode(data.pickupDate);
    
    // Get broker initials
    const brokerInitials = this.getBrokerInitials(data.brokerInitials);
    
    // Get shipper/vendor codes
    const shipperCode = this.getShipperCode(data.shipperName, data.shipperCode);
    const vendorCode = this.getVendorCode(data.vendorCode, data.shipperCode);
    
    // Generate route and lane codes
    const routeCode = `${originCode}-${destinationCode}`;
    const laneCode = this.generateLaneCode(originCode, destinationCode);
    
    // Generate primary load ID
    // Format: {BrokerInitials}-{DateCode}-{OriginCode}{DestinationCode}-{ShipperCode}-{EquipmentCode}{LoadTypeCode}{WeightClassCode}-{Sequence}
    // Example: JD-25001-ATLMIA-WMT-DVFL-001
    const loadId = this.generatePrimaryLoadId({
      dateCode,
      originCode,
      destinationCode,
      shipperCode,
      equipmentCode,
      loadTypeCode,
      weightClassCode,
      brokerInitials,
      sequence
    });
    
    // Generate secondary identifiers
    const shortId = this.generateShortId(loadId);
    const trackingNumber = this.generateTrackingNumber(loadId, timestamp);
    const bolNumber = this.generateBOLNumber(loadId, timestamp);
    const proNumber = this.generatePRONumber(loadId, brokerInitials);
    
    // Generate reference numbers
    const brokerReference = this.generateBrokerReference(loadId, brokerInitials);
    const shipperReference = this.generateShipperReference(loadId, shipperCode);
    const vendorReference = this.generateVendorReference(loadId, vendorCode);
    
    // Generate check digit for validation
    const checkDigit = this.generateCheckDigit(loadId);
    
    return {
      loadId,
      shortId,
      trackingNumber,
      bolNumber,
      proNumber,
      brokerReference,
      shipperReference,
      vendorReference,
      routeCode,
      laneCode,
      equipmentCode,
      serviceCode,
      weightClassCode,
      dateCode,
      checkDigit,
      generatedAt: timestamp.toISOString(),
      identifierVersion: this.IDENTIFIER_VERSION
    };
  }
  
  /**
   * Generate the primary load ID with comprehensive information
   */
  private static generatePrimaryLoadId(params: {
    dateCode: string;
    originCode: string;
    destinationCode: string;
    shipperCode: string;
    equipmentCode: string;
    loadTypeCode: string;
    weightClassCode: string;
    brokerInitials: string;
    sequence: number;
  }): string {
    const { 
      dateCode, 
      originCode, 
      destinationCode, 
      shipperCode, 
      equipmentCode, 
      loadTypeCode, 
      weightClassCode, 
      brokerInitials, 
      sequence 
    } = params;
    
    // Format: {BrokerInitials}-{DateCode}-{OriginCode}{DestinationCode}-{ShipperCode}-{EquipmentCode}{LoadTypeCode}{WeightClassCode}-{Sequence}
    // Example: JD-25001-ATLMIA-WMT-DVFL-001
    return `${brokerInitials}-${dateCode}-${originCode}${destinationCode}-${shipperCode}-${equipmentCode}${loadTypeCode}${weightClassCode}-${sequence.toString().padStart(3, '0')}`;
  }
  
  /**
   * Generate date code from pickup date
   */
  private static generateDateCode(pickupDate: string): string {
    const date = new Date(pickupDate);
    const year = date.getFullYear().toString().slice(-2);
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Format: YYDDD (e.g., 25001 for Jan 1, 2025)
    return `${year}${dayOfYear.toString().padStart(3, '0')}`;
  }
  
  /**
   * Get location code for origin/destination
   */
  private static getLocationCode(location: string): string {
    const normalized = location.toLowerCase().trim();
    
    // Check exact match first
    if (this.CITY_CODES[normalized]) {
      return this.CITY_CODES[normalized];
    }
    
    // Try partial matches
    for (const [key, code] of Object.entries(this.CITY_CODES)) {
      if (normalized.includes(key.split(',')[0])) {
        return code;
      }
    }
    
    // Generate code from city name if no match found
    const cityPart = normalized.split(',')[0];
    const statePart = normalized.split(',')[1]?.trim();
    
    if (cityPart && statePart) {
      // Use first 2 letters of city + first letter of state
      return `${cityPart.substring(0, 2).toUpperCase()}${statePart.substring(0, 1).toUpperCase()}`;
    }
    
    // Fallback to first 3 letters of location
    return normalized.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase() || 'LOC';
  }
  
  /**
   * Get equipment code
   */
  private static getEquipmentCode(equipment: string): string {
    const normalized = equipment.toLowerCase().trim();
    return this.EQUIPMENT_CODES[normalized] || 'GE'; // GE = General Equipment
  }
  
  /**
   * Get load type code
   */
  private static getLoadTypeCode(loadType?: string): string {
    return loadType ? this.LOAD_TYPE_CODES[loadType] || 'F' : 'F';
  }
  
  /**
   * Get weight class code based on weight or explicit weight class
   */
  private static getWeightClassCode(weight?: string, weightClass?: string): string {
    if (weightClass) {
      return this.WEIGHT_CLASS_CODES[weightClass] || 'M';
    }
    
    if (weight) {
      // Extract numeric weight from string like "45,000 lbs"
      const numericWeight = parseInt(weight.replace(/[^0-9]/g, ''));
      
      if (numericWeight < 20000) return 'L';
      if (numericWeight < 40000) return 'M';
      if (numericWeight < 60000) return 'H';
      return 'O';
    }
    
    return 'M'; // Default to Medium
  }
  
  /**
   * Get service code based on special requirements
   */
  private static getServiceCode(data: LoadIdentificationData): string {
    const codes: string[] = [];
    
    if (data.isHazmat) codes.push(this.SERVICE_CODES.hazmat);
    if (data.isExpedited) codes.push(this.SERVICE_CODES.expedited);
    if (data.isRefrigerated) codes.push(this.SERVICE_CODES.refrigerated);
    if (data.isOversized) codes.push(this.SERVICE_CODES.oversized);
    
    return codes.join('') || 'S'; // S = Standard
  }
  
  /**
   * Get broker initials
   */
  private static getBrokerInitials(brokerInitials: string): string {
    return brokerInitials.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 3) || 'BRK';
  }
  
  /**
   * Get shipper code from shipper name or code
   */
  private static getShipperCode(shipperName?: string, shipperCode?: string): string {
    if (shipperCode) return shipperCode.toUpperCase().substring(0, 3);
    
    if (shipperName) {
      // Common shipper abbreviations
      const commonShippers: Record<string, string> = {
        'walmart': 'WMT',
        'amazon': 'AMZ',
        'target': 'TGT',
        'home depot': 'HD',
        'lowes': 'LOW',
        'costco': 'COST',
        'fedex': 'FDX',
        'ups': 'UPS',
        'dhl': 'DHL',
        'pepsi': 'PEP',
        'coca cola': 'KO',
        'general motors': 'GM',
        'ford': 'F',
        'tesla': 'TSLA',
        'apple': 'AAPL',
        'microsoft': 'MSFT',
        'google': 'GOOGL'
      };
      
      const normalized = shipperName.toLowerCase();
      for (const [name, code] of Object.entries(commonShippers)) {
        if (normalized.includes(name)) {
          return code;
        }
      }
      
      // Generate code from company name
      const words = shipperName.split(' ');
      if (words.length >= 2) {
        return `${words[0].substring(0, 2)}${words[1].substring(0, 1)}`.toUpperCase();
      }
      return shipperName.substring(0, 3).toUpperCase();
    }
    
    return 'SHP'; // Default shipper code
  }
  
  /**
   * Get vendor code
   */
  private static getVendorCode(vendorCode?: string, shipperCode?: string): string {
    if (vendorCode) return vendorCode.toUpperCase().substring(0, 3);
    if (shipperCode) return shipperCode.toUpperCase().substring(0, 3);
    return 'VND';
  }
  
  /**
   * Generate lane code for route
   */
  private static generateLaneCode(originCode: string, destinationCode: string): string {
    return `${originCode}${destinationCode}`;
  }
  
  /**
   * Generate short ID for easy reference
   */
  private static generateShortId(loadId: string): string {
    // Extract key components for short ID
    const parts = loadId.split('-');
    if (parts.length >= 6) {
      return `${parts[0]}-${parts[1]}-${parts[2]}-${parts[5]}`;
    }
    return loadId.substring(0, 20);
  }
  
  /**
   * Generate tracking number
   */
  private static generateTrackingNumber(loadId: string, timestamp: Date): string {
    const hash = this.generateHash(loadId + timestamp.getTime());
    return `TR${hash.substring(0, 8).toUpperCase()}`;
  }
  
  /**
   * Generate BOL number
   */
  private static generateBOLNumber(loadId: string, timestamp: Date): string {
    const dateStr = timestamp.toISOString().slice(0, 10).replace(/-/g, '');
    const hash = this.generateHash(loadId);
    return `BOL${dateStr}${hash.substring(0, 4).toUpperCase()}`;
  }
  
  /**
   * Generate PRO number
   */
  private static generatePRONumber(loadId: string, brokerInitials: string): string {
    const hash = this.generateHash(loadId + brokerInitials);
    return `PRO${hash.substring(0, 8).toUpperCase()}`;
  }
  
  /**
   * Generate broker reference number
   */
  private static generateBrokerReference(loadId: string, brokerInitials: string): string {
    const hash = this.generateHash(loadId + brokerInitials);
    return `${brokerInitials}-${hash.substring(0, 6).toUpperCase()}`;
  }
  
  /**
   * Generate shipper reference number
   */
  private static generateShipperReference(loadId: string, shipperCode: string): string {
    const hash = this.generateHash(loadId + shipperCode);
    return `${shipperCode}-${hash.substring(0, 6).toUpperCase()}`;
  }
  
  /**
   * Generate vendor reference number
   */
  private static generateVendorReference(loadId: string, vendorCode: string): string {
    const hash = this.generateHash(loadId + vendorCode);
    return `${vendorCode}-${hash.substring(0, 6).toUpperCase()}`;
  }
  
  /**
   * Generate check digit for validation
   */
  private static generateCheckDigit(loadId: string): string {
    let sum = 0;
    for (let i = 0; i < loadId.length; i++) {
      const char = loadId.charCodeAt(i);
      sum += char * (i + 1);
    }
    return (sum % 10).toString();
  }
  
  /**
   * Generate hash for unique identifiers
   */
  private static generateHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
  
  /**
   * Get next sequence number
   */
  private static getNextSequence(): number {
    if (typeof window !== 'undefined') {
      const current = parseInt(localStorage.getItem(this.LOAD_SEQUENCE_KEY) || '0');
      const next = current + 1;
      localStorage.setItem(this.LOAD_SEQUENCE_KEY, next.toString());
      return next;
    }
    // Fallback for server-side
    return Math.floor(Math.random() * 999) + 1;
  }
  
  /**
   * Validate load ID format
   */
  static validateLoadId(loadId: string): boolean {
    // Updated format validation: XXX-XXXXX-XXXXXX-XXX-XXXX-XXX
    const pattern = /^[A-Z]{2,3}-\d{5}-[A-Z]{6}-[A-Z]{2,3}-[A-Z]{2,4}-\d{3}$/;
    return pattern.test(loadId);
  }
  
  /**
   * Parse load ID components
   */
  static parseLoadId(loadId: string): {
    isValid: boolean;
    dateCode?: string;
    routeCode?: string;
    shipperCode?: string;
    equipmentCode?: string;
    brokerInitials?: string;
    sequence?: number;
  } {
    if (!this.validateLoadId(loadId)) {
      return { isValid: false };
    }
    
    const parts = loadId.split('-');
    return {
      isValid: true,
      brokerInitials: parts[0],
      dateCode: parts[1],
      routeCode: parts[2],
      shipperCode: parts[3],
      equipmentCode: parts[4],
      sequence: parseInt(parts[5])
    };
  }
  
  /**
   * Generate multiple backup identifiers
   */
  static generateBackupIdentifiers(primaryId: string): {
    alternateId: string;
    legacyId: string;
    simpleId: string;
    numericId: string;
  } {
    const hash = this.generateHash(primaryId);
    const timestamp = Date.now();
    
    return {
      alternateId: `ALT-${hash.substring(0, 8).toUpperCase()}`,
      legacyId: `LGC-${timestamp.toString().slice(-8)}`,
      simpleId: `SMP-${(timestamp % 999999).toString().padStart(6, '0')}`,
      numericId: (timestamp % 999999999).toString()
    };
  }
  
  /**
   * Get identifier analytics
   */
  static getIdentifierAnalytics(identifiers: GeneratedLoadIdentifiers): {
    route: string;
    equipment: string;
    loadType: string;
    weightClass: string;
    brokerInitials: string;
    shipper: string;
    estimatedPickupDate: string;
    identifierComplexity: 'simple' | 'standard' | 'complex';
  } {
    const parsed = this.parseLoadId(identifiers.loadId);
    const complexity = identifiers.serviceCode.length > 1 ? 'complex' : 
                      identifiers.serviceCode === 'S' ? 'simple' : 'standard';
    
    return {
      route: identifiers.routeCode,
      equipment: identifiers.equipmentCode,
      loadType: parsed.equipmentCode?.slice(-2, -1) || 'F',
      weightClass: identifiers.weightClassCode,
      brokerInitials: parsed.brokerInitials || 'Unknown',
      shipper: parsed.shipperCode || 'Unknown',
      estimatedPickupDate: this.decodeDateCode(parsed.dateCode || ''),
      identifierComplexity: complexity
    };
  }
  
  /**
   * Decode date code back to readable date
   */
  private static decodeDateCode(dateCode: string): string {
    if (dateCode.length !== 5) return 'Invalid date code';
    
    const year = 2000 + parseInt(dateCode.substring(0, 2));
    const dayOfYear = parseInt(dateCode.substring(2));
    
    const date = new Date(year, 0, dayOfYear);
    return date.toISOString().split('T')[0];
  }
  
  /**
   * Get weight class description
   */
  static getWeightClassDescription(weightClassCode: string): string {
    const descriptions: Record<string, string> = {
      'L': 'Light (Under 20,000 lbs)',
      'M': 'Medium (20,000 - 40,000 lbs)',
      'H': 'Heavy (40,000 - 60,000 lbs)',
      'O': 'Overweight (Over 60,000 lbs)'
    };
    
    return descriptions[weightClassCode] || 'Unknown weight class';
  }
}

export default LoadIdentificationService; 