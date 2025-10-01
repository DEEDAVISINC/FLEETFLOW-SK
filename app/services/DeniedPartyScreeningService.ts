/**
 * DENIED PARTY SCREENING SERVICE
 *
 * Comprehensive screening against U.S. Government Consolidated Screening List
 * using FREE Trade.gov API - prevents illegal shipments and protects FleetFlow
 * from legal liability.
 *
 * LEGAL REQUIREMENTS:
 * - OFAC (Office of Foreign Assets Control) - Sanctions List
 * - BIS Entity List (Bureau of Industry and Security) - Export Restrictions
 * - State Department Debarred Parties
 * - Treasury Department Specially Designated Nationals (SDN)
 *
 * PENALTIES FOR VIOLATIONS:
 * - OFAC violations: Up to $20 million or 2x transaction value
 * - Export violations: Up to $1 million per violation + criminal prosecution
 * - Cargo seizure and company blacklisting
 *
 * FREE API: Trade.gov Consolidated Screening List
 * Registration: https://developer.trade.gov/ (2 minutes, instant approval)
 * YOUR API KEY: VTNKCXRYy8X5ozRjxi2xU5cVzanbe5ey4xKGueVA
 */

export interface ScreeningParty {
  name: string;
  address?: string;
  city?: string;
  country?: string;
  type:
    | 'shipper'
    | 'consignee'
    | 'carrier'
    | 'notify_party'
    | 'customs_broker'
    | 'vendor'
    | 'other';
}

export interface ScreeningMatch {
  matchedName: string;
  matchConfidence: number; // 0-100
  listType:
    | 'OFAC_SDN'
    | 'BIS_ENTITY'
    | 'STATE_DEBARRED'
    | 'TREASURY_SDN'
    | 'OTHER';
  listName: string;
  programs: string[]; // e.g., ["OFAC SDN List", "BIS Entity List"]
  addresses: string[];
  countries: string[];
  remarks: string;
  startDate: string;
  source: string;
  actionRequired:
    | 'DO_NOT_SHIP'
    | 'RESTRICTED_ITEMS'
    | 'MANUAL_REVIEW'
    | 'PROCEED_WITH_CAUTION';
  legalBasis: string;
}

export interface ScreeningResult {
  passed: boolean;
  partyName: string;
  partyType: string;
  matchCount: number;
  matches: ScreeningMatch[];
  riskLevel: 'CLEAR' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendation: string;
  legalAction: string;
  checkedAt: string;
  source: string;
  requiresManualReview: boolean;
  estimatedReviewTime?: string;
  error?: string;
}

export interface ShipmentScreening {
  shipmentId: string;
  screenedAt: string;
  overallRisk: 'CLEAR' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  overallPassed: boolean;
  parties: {
    shipper?: ScreeningResult;
    consignee?: ScreeningResult;
    carrier?: ScreeningResult;
    notifyParty?: ScreeningResult;
    customsBroker?: ScreeningResult;
  };
  criticalIssues: string[];
  warnings: string[];
  recommendations: string[];
  complianceOfficerNotified: boolean;
  auditTrail: AuditEntry[];
}

export interface AuditEntry {
  timestamp: string;
  action: string;
  user: string;
  details: string;
  result: string;
}

export class DeniedPartyScreeningService {
  private readonly API_KEY = process.env.TRADE_GOV_API_KEY;
  private readonly CSL_API =
    'https://api.trade.gov/consolidated_screening_list/search';
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  // Cache to reduce API calls and improve performance
  private screeningCache = new Map<
    string,
    { result: ScreeningResult; expiresAt: number }
  >();

  // Audit trail storage
  private auditTrail: AuditEntry[] = [];

  /**
   * Screen a party against all U.S. government watch lists
   */
  async screenParty(request: ScreeningRequest): Promise<ScreeningResult> {
    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(request);
      const cached = this.getCachedResult(cacheKey);
      if (cached) {
        return cached;
      }

      if (!this.API_KEY) {
        throw new Error('TRADE_GOV_API_KEY environment variable not set');
      }

      // Build query parameters
      const queryParams = new URLSearchParams({
        api_key: this.API_KEY,
        name: request.name,
      });

      // Add optional parameters
      if (request.country) {
        queryParams.append('countries', request.country);
      }
      if (request.address) {
        queryParams.append('addresses', request.address);
      }

      // Add additional names if provided
      if (request.additionalNames && request.additionalNames.length > 0) {
        request.additionalNames.forEach((name) => {
          queryParams.append('name', name);
        });
      }

      const response = await fetch(`${this.CSL_API}?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(
          `Trade.gov API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      const result: ScreeningResult = {
        passed: data.total === 0,
        matchCount: data.total || 0,
        matches: this.processMatches(data.results || []),
        riskLevel: this.calculateRiskLevel(data.results || []),
        checkedAt: new Date().toISOString(),
        source: 'U.S. Government Consolidated Screening List (Trade.gov)',
      };

      // Cache the result
      this.setCachedResult(cacheKey, result);

      // Log screening for audit trail
      await this.logScreening(request, result);

      return result;
    } catch (error) {
      console.error('Denied party screening failed:', error);

      const errorResult: ScreeningResult = {
        passed: false,
        matchCount: 0,
        matches: [],
        riskLevel: 'UNKNOWN',
        checkedAt: new Date().toISOString(),
        source: 'U.S. Government Consolidated Screening List',
        error: error instanceof Error ? error.message : 'Unknown error',
        requiresManualReview: true,
      };

      // Log the error
      await this.logScreeningError(request, errorResult);

      return errorResult;
    }
  }

  /**
   * Screen a shipper during CRM creation
   */
  async screenShipper(shipperData: {
    companyName: string;
    contactName?: string;
    address?: string;
    country?: string;
    additionalNames?: string[];
  }): Promise<ScreeningResult> {
    const request: ScreeningRequest = {
      name: shipperData.companyName,
      address: shipperData.address,
      country: shipperData.country,
      additionalNames: shipperData.contactName
        ? [shipperData.contactName]
        : undefined,
    };

    return this.screenParty(request);
  }

  /**
   * Screen a consignee during CRM creation
   */
  async screenConsignee(consigneeData: {
    companyName: string;
    contactName?: string;
    address?: string;
    country?: string;
    taxId?: string;
  }): Promise<ScreeningResult> {
    const request: ScreeningRequest = {
      name: consigneeData.companyName,
      address: consigneeData.address,
      country: consigneeData.country,
      additionalNames: consigneeData.contactName
        ? [consigneeData.contactName]
        : undefined,
    };

    return this.screenParty(request);
  }

  /**
   * Screen a carrier before booking
   */
  async screenCarrier(carrierData: {
    companyName: string;
    scacCode?: string;
    address?: string;
    country?: string;
  }): Promise<ScreeningResult> {
    const request: ScreeningRequest = {
      name: carrierData.companyName,
      address: carrierData.address,
      country: carrierData.country,
      additionalNames: carrierData.scacCode
        ? [carrierData.scacCode]
        : undefined,
    };

    return this.screenParty(request);
  }

  /**
   * Screen during shipment creation
   */
  async screenForShipment(shipmentData: {
    shipperName: string;
    consigneeName: string;
    carrierName?: string;
    shipperCountry?: string;
    consigneeCountry?: string;
  }): Promise<{
    shipperScreening: ScreeningResult;
    consigneeScreening: ScreeningResult;
    carrierScreening?: ScreeningResult;
    canProceed: boolean;
    blockingMatches: ScreeningMatch[];
  }> {
    const [shipperScreening, consigneeScreening] = await Promise.all([
      this.screenShipper({
        companyName: shipmentData.shipperName,
        country: shipmentData.shipperCountry,
      }),
      this.screenConsignee({
        companyName: shipmentData.consigneeName,
        country: shipmentData.consigneeCountry,
      }),
    ]);

    let carrierScreening: ScreeningResult | undefined;
    if (shipmentData.carrierName) {
      carrierScreening = await this.screenCarrier({
        companyName: shipmentData.carrierName,
      });
    }

    const allMatches = [
      ...shipperScreening.matches,
      ...consigneeScreening.matches,
      ...(carrierScreening?.matches || []),
    ];

    const blockingMatches = allMatches.filter((match) =>
      this.isBlockingMatch(match)
    );

    const canProceed = blockingMatches.length === 0;

    return {
      shipperScreening,
      consigneeScreening,
      carrierScreening,
      canProceed,
      blockingMatches,
    };
  }

  /**
   * Process raw API results into structured matches
   */
  private processMatches(rawResults: any[]): ScreeningMatch[] {
    return rawResults.map((result) => ({
      name: result.name || '',
      type: result.type || 'Unknown',
      programs: Array.isArray(result.programs) ? result.programs : [],
      addresses: Array.isArray(result.addresses) ? result.addresses : [],
      remarks: result.remarks,
      startDate: result.start_date,
      source: result.source || 'Consolidated Screening List',
      country: result.country,
    }));
  }

  /**
   * Calculate risk level based on matches
   */
  private calculateRiskLevel(matches: any[]): ScreeningResult['riskLevel'] {
    if (!matches || matches.length === 0) {
      return 'CLEAR';
    }

    // Check for critical sanctions (OFAC SDN)
    const hasOFACSDN = matches.some(
      (match) => match.programs && match.programs.includes('OFAC SDN List')
    );

    if (hasOFACSDN) {
      return 'CRITICAL';
    }

    // Check for export restrictions (BIS Entity List)
    const hasEntityList = matches.some(
      (match) => match.programs && match.programs.includes('Entity List')
    );

    if (hasEntityList) {
      return 'HIGH';
    }

    // Multiple matches indicate higher risk
    if (matches.length > 3) {
      return 'HIGH';
    }

    if (matches.length > 1) {
      return 'MEDIUM';
    }

    return 'LOW';
  }

  /**
   * Determine if a match should block the transaction
   */
  private isBlockingMatch(match: ScreeningMatch): boolean {
    // Always block OFAC SDN matches (sanctions)
    if (match.programs.includes('OFAC SDN List')) {
      return true;
    }

    // Always block Unverified List (catch-all)
    if (match.programs.includes('Unverified List')) {
      return true;
    }

    // Block high-risk programs
    const highRiskPrograms = [
      'ITAR Debarred',
      'Denied Persons List',
      'Entity List',
    ];

    return match.programs.some((program) =>
      highRiskPrograms.some((highRisk) => program.includes(highRisk))
    );
  }

  /**
   * Generate cache key for screening request
   */
  private generateCacheKey(request: ScreeningRequest): string {
    const keyParts = [
      request.name.toLowerCase(),
      request.country?.toLowerCase(),
      request.address?.toLowerCase(),
    ].filter(Boolean);

    return keyParts.join('|');
  }

  /**
   * Get cached screening result
   */
  private getCachedResult(cacheKey: string): ScreeningResult | null {
    const cached = this.screeningCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.result;
    }
    return null;
  }

  /**
   * Cache screening result
   */
  private setCachedResult(cacheKey: string, result: ScreeningResult): void {
    this.screeningCache.set(cacheKey, {
      result,
      expiresAt: Date.now() + this.CACHE_DURATION,
    });
  }

  /**
   * Log screening for audit trail
   */
  private async logScreening(
    request: ScreeningRequest,
    result: ScreeningResult
  ): Promise<void> {
    try {
      // TODO: Implement audit logging to database
      console.log('Screening completed:', {
        request,
        result: {
          passed: result.passed,
          matchCount: result.matchCount,
          riskLevel: result.riskLevel,
          checkedAt: result.checkedAt,
        },
      });
    } catch (error) {
      console.error('Failed to log screening:', error);
    }
  }

  /**
   * Log screening errors
   */
  private async logScreeningError(
    request: ScreeningRequest,
    result: ScreeningResult
  ): Promise<void> {
    try {
      // TODO: Implement error logging to database
      console.error('Screening error:', {
        request,
        error: result.error,
        checkedAt: result.checkedAt,
      });
    } catch (error) {
      console.error('Failed to log screening error:', error);
    }
  }

  /**
   * Get screening statistics
   */
  async getScreeningStats(
    timeRange: 'day' | 'week' | 'month' = 'month'
  ): Promise<{
    totalScreenings: number;
    passedScreenings: number;
    failedScreenings: number;
    criticalMatches: number;
    averageResponseTime: number;
  }> {
    // TODO: Implement statistics from database
    return {
      totalScreenings: 0,
      passedScreenings: 0,
      failedScreenings: 0,
      criticalMatches: 0,
      averageResponseTime: 0,
    };
  }

  /**
   * Enhanced screening with detailed analysis
   */
  async screenPartyEnhanced(party: ScreeningParty): Promise<ScreeningResult> {
    const request: ScreeningRequest = {
      name: party.name,
      address: party.address,
      country: party.country,
      city: party.city,
    };

    const basicResult = await this.screenParty(request);

    // Enhance with detailed analysis
    const enhancedResult: ScreeningResult = {
      ...basicResult,
      partyName: party.name,
      partyType: party.type,
      recommendation: this.generateRecommendation(basicResult),
      legalAction: this.generateLegalAction(basicResult),
      requiresManualReview: this.requiresManualReview(basicResult),
      estimatedReviewTime: this.calculateReviewTime(basicResult),
    };

    return enhancedResult;
  }

  /**
   * Screen entire shipment with comprehensive analysis
   */
  async screenShipmentComprehensive(shipmentData: {
    shipmentId: string;
    shipper: ScreeningParty;
    consignee: ScreeningParty;
    carrier?: ScreeningParty;
    notifyParty?: ScreeningParty;
    customsBroker?: ScreeningParty;
  }): Promise<ShipmentScreening> {
    const screeningPromises = [
      this.screenPartyEnhanced(shipmentData.shipper),
      this.screenPartyEnhanced(shipmentData.consignee),
    ];

    if (shipmentData.carrier) {
      screeningPromises.push(this.screenPartyEnhanced(shipmentData.carrier));
    }
    if (shipmentData.notifyParty) {
      screeningPromises.push(
        this.screenPartyEnhanced(shipmentData.notifyParty)
      );
    }
    if (shipmentData.customsBroker) {
      screeningPromises.push(
        this.screenPartyEnhanced(shipmentData.customsBroker)
      );
    }

    const results = await Promise.all(screeningPromises);

    const parties: ShipmentScreening['parties'] = {};
    let shipperResult: ScreeningResult | undefined;
    let consigneeResult: ScreeningResult | undefined;
    let carrierResult: ScreeningResult | undefined;
    let notifyResult: ScreeningResult | undefined;
    let brokerResult: ScreeningResult | undefined;

    results.forEach((result, index) => {
      switch (index) {
        case 0:
          shipperResult = result;
          parties.shipper = result;
          break;
        case 1:
          consigneeResult = result;
          parties.consignee = result;
          break;
        case 2:
          if (shipmentData.carrier) {
            carrierResult = result;
            parties.carrier = result;
          }
          break;
        case 3:
          if (shipmentData.notifyParty) {
            notifyResult = result;
            parties.notifyParty = result;
          }
          break;
        case 4:
          if (shipmentData.customsBroker) {
            brokerResult = result;
            parties.customsBroker = result;
          }
          break;
      }
    });

    const allResults = [
      shipperResult,
      consigneeResult,
      carrierResult,
      notifyResult,
      brokerResult,
    ].filter(Boolean) as ScreeningResult[];
    const overallRisk = this.calculateOverallRisk(allResults);
    const overallPassed = overallRisk === 'CLEAR';
    const criticalIssues = this.identifyCriticalIssues(allResults);
    const warnings = this.identifyWarnings(allResults);
    const recommendations = this.generateRecommendations(allResults);

    const shipmentScreening: ShipmentScreening = {
      shipmentId: shipmentData.shipmentId,
      screenedAt: new Date().toISOString(),
      overallRisk,
      overallPassed,
      parties,
      criticalIssues,
      warnings,
      recommendations,
      complianceOfficerNotified:
        this.shouldNotifyComplianceOfficer(overallRisk),
      auditTrail: this.generateAuditTrail(shipmentData.shipmentId, allResults),
    };

    // Auto-notify compliance officer if critical issues
    if (shipmentScreening.complianceOfficerNotified) {
      await this.notifyComplianceOfficer(shipmentScreening);
    }

    return shipmentScreening;
  }

  /**
   * Generate recommendation based on screening result
   */
  private generateRecommendation(result: ScreeningResult): string {
    switch (result.riskLevel) {
      case 'CLEAR':
        return 'Proceed with shipment - no compliance concerns identified.';
      case 'LOW':
        return 'Proceed with shipment but document screening results for audit trail.';
      case 'MEDIUM':
        return 'Review matches manually before proceeding. Consider enhanced documentation.';
      case 'HIGH':
        return 'Do not proceed without senior management approval. Consider alternative routing.';
      case 'CRITICAL':
        return 'DO NOT PROCEED UNDER ANY CIRCUMSTANCES. Immediate legal review required.';
      default:
        return 'Unable to determine recommendation - manual review required.';
    }
  }

  /**
   * Generate legal action guidance
   */
  private generateLegalAction(result: ScreeningResult): string {
    if (result.riskLevel === 'CRITICAL') {
      return 'Cease all activities immediately. Consult legal counsel within 24 hours. Document all findings.';
    }
    if (result.riskLevel === 'HIGH') {
      return 'Obtain written legal approval before proceeding. Prepare compliance documentation.';
    }
    return 'No immediate legal action required. Maintain screening records for audit purposes.';
  }

  /**
   * Determine if manual review is required
   */
  private requiresManualReview(result: ScreeningResult): boolean {
    return (
      ['HIGH', 'CRITICAL', 'UNKNOWN'].includes(result.riskLevel) ||
      result.matchCount > 0
    );
  }

  /**
   * Calculate estimated review time
   */
  private calculateReviewTime(result: ScreeningResult): string | undefined {
    if (!this.requiresManualReview(result)) return undefined;

    switch (result.riskLevel) {
      case 'HIGH':
      case 'CRITICAL':
        return '4-8 hours';
      case 'MEDIUM':
        return '1-2 hours';
      case 'LOW':
        return '30-60 minutes';
      default:
        return '1-4 hours';
    }
  }

  /**
   * Calculate overall shipment risk
   */
  private calculateOverallRisk(
    results: ScreeningResult[]
  ): 'CLEAR' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const riskLevels = results.map((r) => r.riskLevel);

    if (riskLevels.includes('CRITICAL')) return 'CRITICAL';
    if (riskLevels.includes('HIGH')) return 'HIGH';
    if (riskLevels.includes('MEDIUM')) return 'MEDIUM';
    if (riskLevels.includes('LOW')) return 'LOW';
    return 'CLEAR';
  }

  /**
   * Identify critical issues requiring immediate attention
   */
  private identifyCriticalIssues(results: ScreeningResult[]): string[] {
    const issues: string[] = [];

    results.forEach((result) => {
      if (result.riskLevel === 'CRITICAL') {
        result.matches.forEach((match) => {
          if (match.programs.includes('OFAC SDN List')) {
            issues.push(
              `OFAC SDN Match: ${result.partyName} matches ${match.matchedName}`
            );
          }
        });
      }
    });

    return issues;
  }

  /**
   * Identify warnings that need attention
   */
  private identifyWarnings(results: ScreeningResult[]): string[] {
    const warnings: string[] = [];

    results.forEach((result) => {
      if (result.riskLevel === 'HIGH') {
        warnings.push(
          `${result.partyType}: ${result.matchCount} high-risk matches found`
        );
      }
      if (result.matchCount > 2) {
        warnings.push(
          `${result.partyType}: Multiple (${result.matchCount}) matches found`
        );
      }
    });

    return warnings;
  }

  /**
   * Generate recommendations for the shipment
   */
  private generateRecommendations(results: ScreeningResult[]): string[] {
    const recommendations: string[] = [];

    const hasHighRisk = results.some(
      (r) => r.riskLevel === 'HIGH' || r.riskLevel === 'CRITICAL'
    );
    const hasMediumRisk = results.some((r) => r.riskLevel === 'MEDIUM');

    if (hasHighRisk) {
      recommendations.push(
        'Obtain senior management approval before proceeding'
      );
      recommendations.push('Prepare detailed compliance documentation');
      recommendations.push('Consider alternative shipping routes if available');
    }

    if (hasMediumRisk) {
      recommendations.push('Document all screening results for audit trail');
      recommendations.push('Consider enhanced cargo insurance');
    }

    if (results.every((r) => r.riskLevel === 'CLEAR')) {
      recommendations.push('Proceed with standard procedures');
      recommendations.push('Maintain screening records for 7 years');
    }

    return recommendations;
  }

  /**
   * Determine if compliance officer should be notified
   */
  private shouldNotifyComplianceOfficer(risk: string): boolean {
    return ['HIGH', 'CRITICAL'].includes(risk);
  }

  /**
   * Generate audit trail for shipment screening
   */
  private generateAuditTrail(
    shipmentId: string,
    results: ScreeningResult[]
  ): AuditEntry[] {
    const auditTrail: AuditEntry[] = [];

    results.forEach((result) => {
      auditTrail.push({
        timestamp: result.checkedAt,
        action: 'SCREENING_COMPLETED',
        user: 'SYSTEM',
        details: `Screened ${result.partyType}: ${result.partyName} - ${result.riskLevel} risk (${result.matchCount} matches)`,
        result: result.passed ? 'PASSED' : 'REVIEW_REQUIRED',
      });
    });

    return auditTrail;
  }

  /**
   * Notify compliance officer of critical issues
   */
  private async notifyComplianceOfficer(
    shipmentScreening: ShipmentScreening
  ): Promise<void> {
    try {
      // TODO: Implement actual notification (email, SMS, etc.)
      console.log('🚨 COMPLIANCE ALERT:', {
        shipmentId: shipmentScreening.shipmentId,
        overallRisk: shipmentScreening.overallRisk,
        criticalIssues: shipmentScreening.criticalIssues,
        timestamp: shipmentScreening.screenedAt,
      });

      // Add to audit trail
      this.auditTrail.push({
        timestamp: new Date().toISOString(),
        action: 'COMPLIANCE_OFFICER_NOTIFIED',
        user: 'SYSTEM',
        details: `Compliance officer notified of ${shipmentScreening.criticalIssues.length} critical issues for shipment ${shipmentScreening.shipmentId}`,
        result: 'NOTIFIED',
      });
    } catch (error) {
      console.error('Failed to notify compliance officer:', error);
    }
  }

  /**
   * Get compliance statistics
   */
  async getComplianceStats(
    timeRange: 'day' | 'week' | 'month' = 'month'
  ): Promise<{
    totalShipments: number;
    screenedShipments: number;
    complianceRate: number;
    criticalBlocks: number;
    averageScreeningTime: number;
    topRiskCategories: { category: string; count: number }[];
  }> {
    // TODO: Implement actual statistics from database
    return {
      totalShipments: 0,
      screenedShipments: 0,
      complianceRate: 100,
      criticalBlocks: 0,
      averageScreeningTime: 0,
      topRiskCategories: [],
    };
  }

  /**
   * Export screening data for regulatory reporting
   */
  async exportScreeningData(
    startDate: string,
    endDate: string
  ): Promise<{
    screenings: ScreeningResult[];
    auditTrail: AuditEntry[];
    complianceMetrics: any;
  }> {
    // TODO: Implement data export from database
    return {
      screenings: [],
      auditTrail: this.auditTrail,
      complianceMetrics: {},
    };
  }

  /**
   * Process raw Trade.gov API response
   */
  private processScreeningResults(
    party: ScreeningParty,
    apiData: any
  ): ScreeningResult {
    const matchCount = apiData.total || 0;
    const results = apiData.results || [];

    if (matchCount === 0) {
      return {
        passed: true,
        partyName: party.name,
        partyType: party.type,
        matchCount: 0,
        matches: [],
        riskLevel: 'CLEAR',
        recommendation: '✅ No matches found - cleared for shipment',
        legalAction: 'Proceed with shipment',
        checkedAt: new Date().toISOString(),
        source: 'U.S. Government Consolidated Screening List',
        requiresManualReview: false,
      };
    }

    // Process matches
    const matches: ScreeningMatch[] = results.map((result: any) => {
      const listType = this.categorizeList(result.source);
      const actionRequired = this.determineAction(listType, result.programs);

      return {
        matchedName: result.name,
        matchConfidence: this.calculateMatchConfidence(party.name, result.name),
        listType,
        listName: result.source,
        programs: result.programs || [],
        addresses: result.addresses || [],
        countries: result.countries || [],
        remarks: result.remarks || '',
        startDate: result.start_date || 'Unknown',
        source: result.source_list_url || '',
        actionRequired,
        legalBasis: this.getLegalBasis(listType),
      };
    });

    // Calculate risk level
    const riskLevel = this.calculateRiskLevel(matches);
    const passed = riskLevel !== 'CRITICAL';

    return {
      passed,
      partyName: party.name,
      partyType: party.type,
      matchCount,
      matches,
      riskLevel,
      recommendation: this.getRecommendation(riskLevel, matches),
      legalAction: this.getLegalAction(riskLevel, matches),
      checkedAt: new Date().toISOString(),
      source: 'U.S. Government Consolidated Screening List',
      requiresManualReview: riskLevel === 'CRITICAL' || riskLevel === 'HIGH',
      estimatedReviewTime:
        riskLevel === 'CRITICAL' ? '1-2 hours' : '30 minutes',
    };
  }

  /**
   * Categorize screening list type
   */
  private categorizeList(source: string): ScreeningMatch['listType'] {
    const sourceLower = source.toLowerCase();

    if (sourceLower.includes('ofac') || sourceLower.includes('sdn')) {
      return 'OFAC_SDN';
    }
    if (sourceLower.includes('entity list') || sourceLower.includes('bis')) {
      return 'BIS_ENTITY';
    }
    if (sourceLower.includes('state') || sourceLower.includes('debarred')) {
      return 'STATE_DEBARRED';
    }
    if (sourceLower.includes('treasury')) {
      return 'TREASURY_SDN';
    }
    return 'OTHER';
  }

  /**
   * Determine required action based on list type
   */
  private determineAction(
    listType: ScreeningMatch['listType'],
    programs: string[]
  ): ScreeningMatch['actionRequired'] {
    // OFAC SDN = absolute prohibition
    if (listType === 'OFAC_SDN' || listType === 'TREASURY_SDN') {
      return 'DO_NOT_SHIP';
    }

    // BIS Entity List = restricted items only
    if (listType === 'BIS_ENTITY') {
      return 'RESTRICTED_ITEMS';
    }

    // State Debarred = manual review
    if (listType === 'STATE_DEBARRED') {
      return 'MANUAL_REVIEW';
    }

    return 'PROCEED_WITH_CAUTION';
  }

  /**
   * Get legal basis for restriction
   */
  private getLegalBasis(listType: ScreeningMatch['listType']): string {
    const basis: Record<ScreeningMatch['listType'], string> = {
      OFAC_SDN:
        'Trading With the Enemy Act, International Emergency Economic Powers Act (IEEPA)',
      BIS_ENTITY: 'Export Administration Regulations (EAR) Part 744',
      STATE_DEBARRED:
        'International Traffic in Arms Regulations (ITAR) Part 120',
      TREASURY_SDN:
        'Office of Foreign Assets Control (OFAC) Sanctions Programs',
      OTHER: 'Various U.S. Export Control Regulations',
    };

    return basis[listType];
  }

  /**
   * Calculate match confidence (0-100)
   */
  private calculateMatchConfidence(input: string, match: string): number {
    const inputNorm = input.toLowerCase().trim();
    const matchNorm = match.toLowerCase().trim();

    // Exact match
    if (inputNorm === matchNorm) return 100;

    // Contains match
    if (inputNorm.includes(matchNorm) || matchNorm.includes(inputNorm))
      return 85;

    // Fuzzy match (simplified Levenshtein)
    const distance = this.levenshteinDistance(inputNorm, matchNorm);
    const maxLength = Math.max(inputNorm.length, matchNorm.length);
    const similarity = ((maxLength - distance) / maxLength) * 100;

    return Math.round(similarity);
  }

  /**
   * Simple Levenshtein distance
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = Array(m + 1)
      .fill(null)
      .map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
        }
      }
    }

    return dp[m][n];
  }

  /**
   * Calculate overall risk level
   */
  private calculateRiskLevel(
    matches: ScreeningMatch[]
  ): ScreeningResult['riskLevel'] {
    if (matches.length === 0) return 'CLEAR';

    // Check for critical lists
    const hasOFAC = matches.some(
      (m) => m.listType === 'OFAC_SDN' || m.listType === 'TREASURY_SDN'
    );
    const hasBIS = matches.some((m) => m.listType === 'BIS_ENTITY');
    const highConfidence = matches.some((m) => m.matchConfidence >= 85);

    if (hasOFAC && highConfidence) return 'CRITICAL';
    if (hasOFAC) return 'HIGH';
    if (hasBIS && highConfidence) return 'HIGH';
    if (hasBIS) return 'MEDIUM';
    if (matches.length > 3) return 'HIGH';
    if (matches.length > 1) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Calculate overall risk from multiple parties
   */
  private calculateOverallRisk(
    results: ScreeningResult[]
  ): ShipmentScreening['overallRisk'] {
    if (results.some((r) => r.riskLevel === 'CRITICAL')) return 'CRITICAL';
    if (results.some((r) => r.riskLevel === 'HIGH')) return 'HIGH';
    if (results.some((r) => r.riskLevel === 'MEDIUM')) return 'MEDIUM';
    if (results.some((r) => r.riskLevel === 'LOW')) return 'LOW';
    return 'CLEAR';
  }

  /**
   * Get recommendation based on risk level
   */
  private getRecommendation(
    riskLevel: string,
    matches: ScreeningMatch[]
  ): string {
    if (riskLevel === 'CRITICAL') {
      return '🚨 CRITICAL: DO NOT SHIP - Denied party detected on sanctions list';
    }
    if (riskLevel === 'HIGH') {
      return '⚠️ HIGH RISK: Requires immediate compliance officer review before proceeding';
    }
    if (riskLevel === 'MEDIUM') {
      return '⚠️ MEDIUM RISK: Possible match detected - manual verification recommended';
    }
    if (riskLevel === 'LOW') {
      return '⚠️ LOW RISK: Possible false positive - brief review suggested';
    }
    return '✅ CLEAR: No matches found - approved for shipment';
  }

  /**
   * Get legal action required
   */
  private getLegalAction(riskLevel: string, matches: ScreeningMatch[]): string {
    if (riskLevel === 'CRITICAL') {
      const ofacMatch = matches.find((m) => m.listType === 'OFAC_SDN');
      if (ofacMatch) {
        return 'BLOCK SHIPMENT IMMEDIATELY - OFAC violation penalty: up to $20 million. Contact legal counsel.';
      }
      return 'BLOCK SHIPMENT - Compliance review required before any action';
    }
    if (riskLevel === 'HIGH') {
      return 'HOLD SHIPMENT - Obtain compliance officer approval before proceeding';
    }
    if (riskLevel === 'MEDIUM') {
      return 'CAUTION - Verify party details and document review process';
    }
    return 'Proceed with standard compliance procedures';
  }

  /**
   * Send critical alert to compliance team
   */
  private async sendCriticalAlert(
    party: ScreeningParty,
    result: ScreeningResult
  ): Promise<void> {
    // TODO: Integrate with FleetFlow notification system
    console.error('🚨 CRITICAL DENIED PARTY ALERT 🚨');
    console.error(`Party: ${party.name} (${party.type})`);
    console.error(`Risk Level: ${result.riskLevel}`);
    console.error(`Matches: ${result.matchCount}`);
    console.error(`Action: ${result.legalAction}`);

    // In production, send email/SMS/Slack notification
  }

  /**
   * Notify compliance officer
   */
  private async notifyComplianceOfficer(
    shipmentId: string,
    issues: string[]
  ): Promise<boolean> {
    // TODO: Integrate with FleetFlow notification system
    console.error('🚨 COMPLIANCE OFFICER NOTIFICATION 🚨');
    console.error(`Shipment ID: ${shipmentId}`);
    console.error(`Critical Issues:`, issues);
    return true;
  }

  /**
   * Cache management
   */
  private generateCacheKey(party: ScreeningParty): string {
    return `${party.name}|${party.country || ''}|${party.address || ''}`.toLowerCase();
  }

  private getCached(key: string): ScreeningResult | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.result;
    }
    return null;
  }

  private setCached(key: string, result: ScreeningResult): void {
    this.cache.set(key, {
      result,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });
  }

  /**
   * Emergency bypass when API is unavailable
   */
  private getEmergencyBypassResult(party: ScreeningParty): ScreeningResult {
    return {
      passed: false,
      partyName: party.name,
      partyType: party.type,
      matchCount: 0,
      matches: [],
      riskLevel: 'CRITICAL',
      recommendation:
        '⚠️ SYSTEM ERROR: Screening API unavailable - Manual compliance review REQUIRED',
      legalAction: 'DO NOT PROCEED without manual compliance verification',
      checkedAt: new Date().toISOString(),
      source: 'Trade.gov API (Unavailable)',
      requiresManualReview: true,
      estimatedReviewTime: '2-4 hours',
      error: 'Trade.gov API key not configured',
    };
  }

  /**
   * Audit trail management
   */
  private addAuditEntry(
    user: string,
    action: string,
    details: string,
    result: string
  ): void {
    DeniedPartyScreeningService.auditTrail.push({
      timestamp: new Date().toISOString(),
      action,
      user,
      details,
      result,
    });

    // Keep only last 1000 entries
    if (DeniedPartyScreeningService.auditTrail.length > 1000) {
      DeniedPartyScreeningService.auditTrail =
        DeniedPartyScreeningService.auditTrail.slice(-1000);
    }
  }

  private getAuditTrail(shipmentId?: string): AuditEntry[] {
    if (shipmentId) {
      return DeniedPartyScreeningService.auditTrail.filter((entry) =>
        entry.details.includes(shipmentId)
      );
    }
    return DeniedPartyScreeningService.auditTrail.slice(-50); // Last 50 entries
  }

  /**
   * Get audit trail for export
   */
  static getFullAuditTrail(): AuditEntry[] {
    return this.auditTrail;
  }

  /**
   * Clear cache (useful for testing)
   */
  clearCache(): void {
    this.screeningCache.clear();
  }
}

// Export singleton instance
export const deniedPartyScreeningService = new DeniedPartyScreeningService();
