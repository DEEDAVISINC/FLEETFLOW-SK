interface NHTSAVinResponse {
  Results: Array<{
    Variable: string;
    Value: string;
    ValueId: string;
  }>;
  Count: number;
  Message: string;
}

interface VinDecodedData {
  valid: boolean;
  make: string;
  model: string;
  year: number;
  bodyClass: string;
  vehicleType: string;
  gvwr: string;
  fuelType: string;
  plantCountry: string;
  manufacturer: string;
  errorMessages: string[];
}

export class VinVerificationService {
  private static readonly NHTSA_API_BASE =
    'https://vpic.nhtsa.dot.gov/api/vehicles';

  /**
   * FREE NHTSA VIN Decoder - Validates and decodes VIN
   * NO API KEY REQUIRED - Completely free government service
   */
  static async verifyVinWithNHTSA(vin: string): Promise<VinDecodedData> {
    try {
      // Clean and validate VIN format
      const cleanVin = vin.replace(/[^A-HJ-NPR-Z0-9]/gi, '').toUpperCase();

      if (cleanVin.length !== 17) {
        return {
          valid: false,
          make: '',
          model: '',
          year: 0,
          bodyClass: '',
          vehicleType: '',
          gvwr: '',
          fuelType: '',
          plantCountry: '',
          manufacturer: '',
          errorMessages: ['Invalid VIN length. Must be 17 characters.'],
        };
      }

      console.info(`🔍 Verifying VIN with NHTSA: ${cleanVin}`);

      // Call NHTSA free VIN decoder API
      const response = await fetch(
        `${this.NHTSA_API_BASE}/DecodeVin/${cleanVin}?format=json`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'User-Agent': 'FleetFlow-VIN-Verification/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `NHTSA API error: ${response.status} - ${response.statusText}`
        );
      }

      const data: NHTSAVinResponse = await response.json();

      // Parse NHTSA response
      const decodedData = this.parseNHTSAResponse(data);

      // Additional VIN validation using check digit
      const checkDigitValid = this.validateVinCheckDigit(cleanVin);

      if (!checkDigitValid) {
        decodedData.valid = false;
        decodedData.errorMessages.push(
          'Invalid VIN check digit - VIN may be fraudulent'
        );
      }

      console.info(
        `✅ VIN verification complete: ${decodedData.valid ? 'VALID' : 'INVALID'}`
      );
      return decodedData;
    } catch (error) {
      console.error('VIN verification error:', error);
      return {
        valid: false,
        make: '',
        model: '',
        year: 0,
        bodyClass: '',
        vehicleType: '',
        gvwr: '',
        fuelType: '',
        plantCountry: '',
        manufacturer: '',
        errorMessages: [`VIN verification failed: ${error.message}`],
      };
    }
  }

  /**
   * FREE VIN Recall Check using NHTSA API
   * NO API KEY REQUIRED
   */
  static async checkVinRecalls(vin: string): Promise<any[]> {
    try {
      const cleanVin = vin.replace(/[^A-HJ-NPR-Z0-9]/gi, '').toUpperCase();

      console.info(`🚨 Checking VIN for recalls: ${cleanVin}`);

      const response = await fetch(
        `${this.NHTSA_API_BASE}/GetRecallsForVIN/${cleanVin}?format=json`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'User-Agent': 'FleetFlow-Recall-Check/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`NHTSA Recalls API error: ${response.status}`);
      }

      const data = await response.json();
      const recalls = data.Results || [];

      console.info(`📋 Found ${recalls.length} recall(s) for VIN`);
      return recalls;
    } catch (error) {
      console.error('VIN recall check error:', error);
      return [];
    }
  }

  /**
   * Parse NHTSA API response into structured data
   */
  private static parseNHTSAResponse(data: NHTSAVinResponse): VinDecodedData {
    const results = data.Results;
    const errorMessages: string[] = [];

    // Helper function to find value by variable name
    const findValue = (variableName: string): string => {
      const result = results.find((r) => r.Variable === variableName);
      return result?.Value || '';
    };

    // Extract key vehicle information
    const make = findValue('Make');
    const model = findValue('Model');
    const yearStr = findValue('Model Year');
    const year = yearStr ? parseInt(yearStr) : 0;
    const bodyClass = findValue('Body Class');
    const vehicleType = findValue('Vehicle Type');
    const gvwr = findValue('Gross Vehicle Weight Rating From');
    const fuelType = findValue('Fuel Type - Primary');
    const plantCountry = findValue('Plant Country');
    const manufacturer = findValue('Manufacturer Name');

    // Check for error codes in response
    const errorCode = findValue('Error Code');
    const errorText = findValue('Error Text');

    if (errorCode && errorCode !== '0' && errorCode !== '') {
      errorMessages.push(`NHTSA Error: ${errorText || 'Unknown error'}`);
    }

    // Additional validation checks
    if (!make || make.toLowerCase().includes('not found')) {
      errorMessages.push('Vehicle make not found in NHTSA database');
    }

    if (!model || model.toLowerCase().includes('not found')) {
      errorMessages.push('Vehicle model not found in NHTSA database');
    }

    if (!year || year < 1980 || year > new Date().getFullYear() + 1) {
      errorMessages.push('Invalid or missing model year');
    }

    // Determine if VIN is valid based on required fields
    const valid = !!(
      make &&
      model &&
      year > 1980 &&
      errorMessages.length === 0
    );

    return {
      valid,
      make,
      model,
      year,
      bodyClass,
      vehicleType,
      gvwr,
      fuelType,
      plantCountry,
      manufacturer,
      errorMessages,
    };
  }

  /**
   * VIN Check Digit Validation (Free Mathematical Algorithm)
   * Validates the 9th digit of VIN using industry standard algorithm
   */
  private static validateVinCheckDigit(vin: string): boolean {
    const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
    const transliteration: Record<string, number> = {
      A: 1,
      B: 2,
      C: 3,
      D: 4,
      E: 5,
      F: 6,
      G: 7,
      H: 8,
      J: 1,
      K: 2,
      L: 3,
      M: 4,
      N: 5,
      P: 7,
      R: 9,
      S: 2,
      T: 3,
      U: 4,
      V: 5,
      W: 6,
      X: 7,
      Y: 8,
      Z: 9,
    };

    let sum = 0;
    for (let i = 0; i < 17; i++) {
      const char = vin[i];
      const value = /\d/.test(char)
        ? parseInt(char)
        : transliteration[char] || 0;
      sum += value * weights[i];
    }

    const checkDigit = sum % 11;
    const expectedCheckDigit = checkDigit === 10 ? 'X' : checkDigit.toString();

    return vin[8] === expectedCheckDigit;
  }

  /**
   * Cross-reference VIN data with insurance certificate
   * CRITICAL: Vehicle must be on insurance to be approved
   */
  static verifyVehicleOnInsurance(
    vinData: VinDecodedData,
    insuranceCertificate: any
  ): { onInsurance: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!insuranceCertificate || !insuranceCertificate.coveredVehicles) {
      issues.push('Insurance certificate data not available for verification');
      return { onInsurance: false, issues };
    }

    // Look for vehicle in insurance certificate
    const matchingVehicle = insuranceCertificate.coveredVehicles.find(
      (vehicle: any) => {
        // Try to match by multiple criteria
        return (
          vehicle.vin === vinData.make || // Direct VIN match (if available)
          (vehicle.make?.toLowerCase() === vinData.make.toLowerCase() &&
            vehicle.model?.toLowerCase() === vinData.model.toLowerCase() &&
            vehicle.year === vinData.year)
        );
      }
    );

    if (!matchingVehicle) {
      issues.push(
        `🚫 CRITICAL: Vehicle ${vinData.year} ${vinData.make} ${vinData.model} NOT FOUND on insurance certificate`
      );
      issues.push('Vehicle cannot be approved without insurance coverage');
      return { onInsurance: false, issues };
    }

    // 📋 Verify FleetFlow Minimum Insurance Requirements
    if (insuranceCertificate.autoLiabilityCoverage < 1000000) {
      issues.push(
        '⚠️ Auto Liability coverage below $1,000,000 minimum requirement'
      );
    }

    if (insuranceCertificate.cargoCoverage < 100000) {
      issues.push('⚠️ Cargo coverage below $100,000 minimum requirement');
    }

    if (insuranceCertificate.generalLiabilityCoverage < 1000000) {
      issues.push(
        '⚠️ General Liability coverage below $1,000,000 minimum requirement'
      );
    }

    // Workers Compensation - Required by law (varies by state)
    if (
      !insuranceCertificate.workersCompensation ||
      !insuranceCertificate.workersCompensation.hasValidCoverage
    ) {
      issues.push(
        '⚠️ Workers Compensation coverage required by law - not found or invalid'
      );
    }

    // Check policy expiration
    if (insuranceCertificate.expirationDate) {
      const expDate = new Date(insuranceCertificate.expirationDate);
      const today = new Date();
      if (expDate <= today) {
        issues.push('🚫 Insurance policy has expired');
        return { onInsurance: false, issues };
      }
    }

    return {
      onInsurance: issues.length === 0,
      issues,
    };
  }

  /**
   * Comprehensive vehicle verification with all checks
   */
  static async comprehensiveVehicleVerification(
    vin: string,
    licensePlate: string,
    state: string,
    insuranceCertificate: any,
    fmcsaData: any
  ): Promise<{
    approved: boolean;
    vinData: VinDecodedData;
    insuranceVerification: any;
    recalls: any[];
    issues: string[];
    confidence: number;
  }> {
    const issues: string[] = [];
    let confidence = 1.0;

    try {
      console.info('🔍 Starting comprehensive vehicle verification...');

      // 1. FREE NHTSA VIN Verification
      console.info('📋 Step 1: NHTSA VIN Verification');
      const vinData = await this.verifyVinWithNHTSA(vin);

      if (!vinData.valid) {
        issues.push(...vinData.errorMessages);
        confidence -= 0.5;
      }

      // 2. FREE VIN Recall Check
      console.info('🚨 Step 2: Safety Recall Check');
      const recalls = await this.checkVinRecalls(vin);

      if (recalls.length > 0) {
        const openRecalls = recalls.filter((recall) => !recall.RemedyDate);
        if (openRecalls.length > 0) {
          issues.push(
            `⚠️ ${openRecalls.length} open safety recall(s) found - may require attention`
          );
          confidence -= 0.2;
        }
      }

      // 3. CRITICAL: Insurance Certificate Verification
      console.info('📋 Step 3: Insurance Certificate Verification');
      const insuranceVerification = this.verifyVehicleOnInsurance(
        vinData,
        insuranceCertificate
      );

      if (!insuranceVerification.onInsurance) {
        issues.push(...insuranceVerification.issues);
        confidence = 0; // CRITICAL FAILURE - Cannot proceed without insurance
        console.info(
          '🚫 CRITICAL FAILURE: Vehicle not on insurance certificate'
        );
      }

      // 4. FMCSA Cross-Reference (if available)
      if (fmcsaData && fmcsaData.vehicles) {
        console.info('📋 Step 4: FMCSA Cross-Reference');
        const fmcsaMatch = fmcsaData.vehicles.some(
          (vehicle: any) =>
            vehicle.vin === vin ||
            (vehicle.make === vinData.make &&
              vehicle.model === vinData.model &&
              vehicle.year === vinData.year)
        );

        if (!fmcsaMatch) {
          issues.push(
            '⚠️ Vehicle not registered with carrier in FMCSA records'
          );
          confidence -= 0.3;
        }
      }

      // 5. License Plate Validation
      console.info('📋 Step 5: License Plate Validation');
      const plateValid = this.validateLicensePlateFormat(licensePlate, state);
      if (!plateValid) {
        issues.push(`⚠️ Invalid license plate format for ${state}`);
        confidence -= 0.1;
      }

      // FINAL DECISION: Vehicle must be on insurance to be approved
      const approved =
        insuranceVerification.onInsurance && vinData.valid && confidence > 0.5;

      console.info(
        `✅ Verification complete: ${approved ? 'APPROVED' : 'REJECTED'} (Confidence: ${confidence})`
      );

      return {
        approved,
        vinData,
        insuranceVerification,
        recalls,
        issues,
        confidence: Math.max(confidence, 0),
      };
    } catch (error) {
      console.error('Comprehensive vehicle verification failed:', error);
      return {
        approved: false,
        vinData: null,
        insuranceVerification: {
          onInsurance: false,
          issues: ['Verification failed'],
        },
        recalls: [],
        issues: [`🚫 Verification system error: ${error.message}`],
        confidence: 0,
      };
    }
  }

  /**
   * Validate license plate format by state
   */
  private static validateLicensePlateFormat(
    plate: string,
    state: string
  ): boolean {
    if (!plate || !state) return false;

    // Clean the plate
    const cleanPlate = plate.replace(/[-\s]/g, '').toUpperCase();

    // State-specific license plate validation patterns
    const statePatterns: Record<string, RegExp> = {
      AL: /^[0-9]{1,3}[A-Z]{1,3}[0-9]{1,4}$/,
      AK: /^[A-Z]{3}[0-9]{3}$/,
      AZ: /^[A-Z]{3}[0-9]{4}$|^[0-9]{3}[A-Z]{3}$/,
      AR: /^[0-9]{3}[A-Z]{3}$/,
      CA: /^[0-9][A-Z]{3}[0-9]{3}$|^[A-Z]{3}[0-9]{4}$/,
      CO: /^[A-Z]{3}[0-9]{3}$/,
      CT: /^[0-9]{3}[A-Z]{3}$/,
      DE: /^[0-9]{6}$/,
      FL: /^[A-Z]{3}[0-9]{3}$|^[0-9]{3}[A-Z]{3}$/,
      GA: /^[A-Z]{3}[0-9]{4}$/,
      HI: /^[A-Z]{3}[0-9]{3}$/,
      ID: /^[A-Z]{1,2}[0-9]{1,5}$/,
      IL: /^[A-Z]{3}[0-9]{4}$/,
      IN: /^[0-9]{3}[A-Z]{3}$/,
      IA: /^[A-Z]{3}[0-9]{3}$/,
      KS: /^[A-Z]{3}[0-9]{3}$/,
      KY: /^[A-Z]{3}[0-9]{3}$/,
      LA: /^[A-Z]{3}[0-9]{3}$/,
      ME: /^[0-9]{4}[A-Z]{2}$/,
      MD: /^[0-9][A-Z]{2}[0-9]{4}$/,
      MA: /^[0-9]{3}[A-Z]{3}$/,
      MI: /^[A-Z]{3}[0-9]{4}$/,
      MN: /^[0-9]{3}[A-Z]{3}$/,
      MS: /^[A-Z]{3}[0-9]{3}$/,
      MO: /^[A-Z]{2}[0-9][A-Z]{3}$/,
      MT: /^[0-9]{1,2}[A-Z]{1,6}$/,
      NE: /^[A-Z]{3}[0-9]{3}$/,
      NV: /^[0-9]{3}[A-Z]{3}$/,
      NH: /^[0-9]{3}[A-Z]{4}$/,
      NJ: /^[A-Z]{3}[0-9]{2}[A-Z]$/,
      NM: /^[A-Z]{3}[0-9]{3}$/,
      NY: /^[A-Z]{3}[0-9]{4}$/,
      NC: /^[A-Z]{3}[0-9]{4}$/,
      ND: /^[A-Z]{3}[0-9]{3}$/,
      OH: /^[A-Z]{3}[0-9]{4}$/,
      OK: /^[A-Z]{3}[0-9]{3}$/,
      OR: /^[0-9]{3}[A-Z]{3}$/,
      PA: /^[A-Z]{3}[0-9]{4}$/,
      RI: /^[0-9]{3}[A-Z]{3}$/,
      SC: /^[A-Z]{3}[0-9]{3}$/,
      SD: /^[0-9][A-Z]{2}[0-9]{3}$/,
      TN: /^[A-Z]{3}[0-9]{3}$/,
      TX: /^[A-Z]{3}[0-9]{4}$|^[0-9]{3}[A-Z]{3}$/,
      UT: /^[A-Z]{3}[0-9]{3}$/,
      VT: /^[A-Z]{3}[0-9]{3}$/,
      VA: /^[A-Z]{3}[0-9]{4}$/,
      WA: /^[A-Z]{3}[0-9]{4}$/,
      WV: /^[0-9][A-Z]{2}[0-9]{3}$/,
      WI: /^[A-Z]{3}[0-9]{4}$/,
      WY: /^[0-9]{1,2}[A-Z]{1,5}$/,
    };

    const pattern = statePatterns[state.toUpperCase()];
    return pattern ? pattern.test(cleanPlate) : true; // Default to true for states not defined
  }
}
