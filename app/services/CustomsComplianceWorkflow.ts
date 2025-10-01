/**
 * CUSTOMS COMPLIANCE WORKFLOW SERVICE
 *
 * Integrates denied party screening and HS code classification
 * into the freight forwarding operational workflow
 */

import {
  deniedPartyScreeningService,
  ScreeningParty,
} from './DeniedPartyScreeningService';
import { hsCodeService } from './HSCodeService';

export interface ComplianceCheckResult {
  shipmentId: string;
  screeningPassed: boolean;
  hsCodeAssigned: boolean;
  riskLevel: 'CLEAR' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendations: string[];
  blocked: boolean;
  processedAt: string;
}

export class CustomsComplianceWorkflow {
  /**
   * Process shipment compliance check
   */
  async processShipmentCompliance(params: {
    shipmentId: string;
    shipper: ScreeningParty;
    consignee: ScreeningParty;
    commodity: string;
    destinationCountry: string;
    cifValue: number;
  }): Promise<ComplianceCheckResult> {
    try {
      console.log(`🔍 Processing compliance for shipment ${params.shipmentId}`);

      // Screen parties
      const screening = await deniedPartyScreeningService.screenForShipment({
        shipperName: params.shipper.name,
        consigneeName: params.consignee.name,
        shipperCountry: params.shipper.country,
        consigneeCountry: params.consignee.country,
      });

      // Classify product
      let hsCodeAssigned = false;
      try {
        const classification = await hsCodeService.classifyProduct(
          params.commodity
        );
        hsCodeAssigned = true;
        console.log(`✅ HS code assigned: ${classification.hsCode.hsCode}`);
      } catch (error) {
        console.warn('HS code classification failed:', error);
      }

      // Determine risk and recommendations
      const riskLevel = screening.canProceed ? 'CLEAR' : 'CRITICAL';
      const blocked = !screening.canProceed;
      const recommendations = blocked
        ? [
            'Shipment blocked due to compliance concerns',
            'Contact compliance officer',
          ]
        : ['Proceed with shipment', 'Maintain compliance records'];

      return {
        shipmentId: params.shipmentId,
        screeningPassed: screening.canProceed,
        hsCodeAssigned,
        riskLevel,
        recommendations,
        blocked,
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Compliance workflow failed:', error);
      return {
        shipmentId: params.shipmentId,
        screeningPassed: false,
        hsCodeAssigned: false,
        riskLevel: 'CRITICAL',
        recommendations: ['Manual compliance review required'],
        blocked: true,
        processedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Check customer onboarding
   */
  async checkCustomerOnboarding(params: {
    customerId: string;
    companyName: string;
    country: string;
  }): Promise<{
    approved: boolean;
    riskLevel: string;
    requiresReview: boolean;
  }> {
    try {
      const screening = await deniedPartyScreeningService.screenShipper({
        companyName: params.companyName,
        country: params.country,
      });

      const approved = screening.passed;
      const riskLevel = screening.riskLevel;
      const requiresReview = !approved || screening.matchCount > 0;

      return { approved, riskLevel, requiresReview };
    } catch (error) {
      console.error('Customer onboarding check failed:', error);
      return { approved: false, riskLevel: 'CRITICAL', requiresReview: true };
    }
  }

  /**
   * Process quote compliance
   */
  async processQuoteCompliance(params: {
    quoteId: string;
    commodity: string;
    destinationCountry: string;
    value: number;
  }): Promise<{
    hsCode?: string;
    dutyRate?: string;
    approved: boolean;
  }> {
    try {
      const classification = await hsCodeService.classifyProduct(
        params.commodity
      );
      const duty = await hsCodeService.calculateDuty({
        hsCode: classification.hsCode.hsCode,
        country: params.destinationCountry,
        value: params.value,
      });

      return {
        hsCode: classification.hsCode.hsCode,
        dutyRate: duty.dutyRate,
        approved: true,
      };
    } catch (error) {
      console.error('Quote compliance failed:', error);
      return { approved: false };
    }
  }
}

export const customsComplianceWorkflow = new CustomsComplianceWorkflow();
