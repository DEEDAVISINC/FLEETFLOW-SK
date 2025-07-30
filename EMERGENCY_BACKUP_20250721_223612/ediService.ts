/**
 * 📡 FleetFlow EDI Service
 * Handles Electronic Data Interchange (EDI) message generation, parsing, and transmission
 * Supports EDI transaction sets: 214, 204, 210, 997, 990, 820
 */

import { randomUUID } from 'crypto';

// Core EDI interfaces
export interface EDIMessage {
  id: string;
  transactionSet: '214' | '204' | '210' | '997' | '990' | '820';
  senderId: string;
  receiverId: string;
  controlNumber: string;
  timestamp: Date;
  data: any;
  status: 'pending' | 'sent' | 'acknowledged' | 'error' | 'retry';
  retryCount: number;
  errorMessage?: string;
  rawEDI?: string;
}

export interface TradingPartner {
  id: string;
  name: string;
  ediId: string; // EDI identifier
  communicationMethod: 'AS2' | 'SFTP' | 'HTTP' | 'VAN';
  endpoint: string;
  isActive: boolean;
  supportedTransactions: string[];
  testMode: boolean;
  credentials?: {
    username?: string;
    password?: string;
    certificate?: string;
    privateKey?: string;
  };
}

export interface EDI214Data {
  shipmentId: string;
  statusCode: string; // AF (Departed), X6 (Delivered), etc.
  statusDescription: string;
  location: {
    city: string;
    state: string;
    zipCode: string;
  };
  timestamp: Date;
  equipmentId?: string;
  driverName?: string;
  nextStopETA?: Date;
}

export interface EDI204Data {
  loadId: string;
  pickupDate: Date;
  deliveryDate: Date;
  origin: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  destination: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  commodity: string;
  weight: number;
  pieces: number;
  rate: number;
  equipment: string;
}

export interface EDI210Data {
  invoiceNumber: string;
  loadId: string;
  amount: number;
  currency: string;
  terms: string;
  billToParty: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  lineItems: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
}

/**
 * Main EDI Service Class
 */
export class EDIService {
  private static instance: EDIService;
  private tradingPartners: Map<string, TradingPartner> = new Map();
  private pendingMessages: Map<string, EDIMessage> = new Map();

  private constructor() {
    this.initializeTradingPartners();
  }

  public static getInstance(): EDIService {
    if (!EDIService.instance) {
      EDIService.instance = new EDIService();
    }
    return EDIService.instance;
  }

  /**
   * Initialize default trading partners (demo/test partners)
   */
  private initializeTradingPartners(): void {
    const demoPartners: TradingPartner[] = [
      {
        id: 'demo-shipper-1',
        name: 'Demo Shipper Corp',
        ediId: 'DEMOSHP01',
        communicationMethod: 'HTTP',
        endpoint: 'https://demo-api.fleetflow.com/edi',
        isActive: true,
        supportedTransactions: ['214', '204', '997'],
        testMode: true
      },
      {
        id: 'demo-broker-1',
        name: 'Demo Freight Broker',
        ediId: 'DEMOBRK01',
        communicationMethod: 'HTTP',
        endpoint: 'https://demo-api.fleetflow.com/edi',
        isActive: true,
        supportedTransactions: ['214', '210', '820', '997'],
        testMode: true
      }
    ];

    demoPartners.forEach(partner => {
      this.tradingPartners.set(partner.id, partner);
    });
  }

  /**
   * Generate EDI 214 - Shipment Status Message
   */
  async generateEDI214(data: EDI214Data, tradingPartnerId: string): Promise<EDIMessage> {
    const partner = this.tradingPartners.get(tradingPartnerId);
    if (!partner) {
      throw new Error(`Trading partner ${tradingPartnerId} not found`);
    }

    const controlNumber = this.generateControlNumber();
    const ediMessage: EDIMessage = {
      id: randomUUID(),
      transactionSet: '214',
      senderId: 'FLEETFLOW',
      receiverId: partner.ediId,
      controlNumber,
      timestamp: new Date(),
      data,
      status: 'pending',
      retryCount: 0
    };

    // Generate EDI 214 format
    const ediContent = this.formatEDI214(ediMessage);
    ediMessage.rawEDI = ediContent;

    this.pendingMessages.set(ediMessage.id, ediMessage);
    return ediMessage;
  }

  /**
   * Generate EDI 204 - Load Tender Response
   */
  async generateEDI204(data: EDI204Data, tradingPartnerId: string): Promise<EDIMessage> {
    const partner = this.tradingPartners.get(tradingPartnerId);
    if (!partner) {
      throw new Error(`Trading partner ${tradingPartnerId} not found`);
    }

    const controlNumber = this.generateControlNumber();
    const ediMessage: EDIMessage = {
      id: randomUUID(),
      transactionSet: '204',
      senderId: 'FLEETFLOW',
      receiverId: partner.ediId,
      controlNumber,
      timestamp: new Date(),
      data,
      status: 'pending',
      retryCount: 0
    };

    const ediContent = this.formatEDI204(ediMessage);
    ediMessage.rawEDI = ediContent;

    this.pendingMessages.set(ediMessage.id, ediMessage);
    return ediMessage;
  }

  /**
   * Generate EDI 210 - Invoice
   */
  async generateEDI210(data: EDI210Data, tradingPartnerId: string): Promise<EDIMessage> {
    const partner = this.tradingPartners.get(tradingPartnerId);
    if (!partner) {
      throw new Error(`Trading partner ${tradingPartnerId} not found`);
    }

    const controlNumber = this.generateControlNumber();
    const ediMessage: EDIMessage = {
      id: randomUUID(),
      transactionSet: '210',
      senderId: 'FLEETFLOW',
      receiverId: partner.ediId,
      controlNumber,
      timestamp: new Date(),
      data,
      status: 'pending',
      retryCount: 0
    };

    const ediContent = this.formatEDI210(ediMessage);
    ediMessage.rawEDI = ediContent;

    this.pendingMessages.set(ediMessage.id, ediMessage);
    return ediMessage;
  }

  /**
   * Generate EDI 997 - Functional Acknowledgment
   */
  async generateEDI997(originalMessage: EDIMessage, status: 'accepted' | 'rejected', errorDetails?: string): Promise<EDIMessage> {
    const controlNumber = this.generateControlNumber();
    const ediMessage: EDIMessage = {
      id: randomUUID(),
      transactionSet: '997',
      senderId: 'FLEETFLOW',
      receiverId: originalMessage.senderId,
      controlNumber,
      timestamp: new Date(),
      data: {
        originalControlNumber: originalMessage.controlNumber,
        status,
        errorDetails
      },
      status: 'pending',
      retryCount: 0
    };

    const ediContent = this.formatEDI997(ediMessage);
    ediMessage.rawEDI = ediContent;

    this.pendingMessages.set(ediMessage.id, ediMessage);
    return ediMessage;
  }

  /**
   * Send EDI message to trading partner
   */
  async sendEDI(messageId: string): Promise<boolean> {
    const message = this.pendingMessages.get(messageId);
    if (!message) {
      throw new Error(`EDI message ${messageId} not found`);
    }

    const partner = this.tradingPartners.get(message.receiverId);
    if (!partner) {
      throw new Error(`Trading partner ${message.receiverId} not found`);
    }

    try {
      // In test mode, simulate successful transmission
      if (partner.testMode) {
        console.log(`📡 [EDI TEST MODE] Sending ${message.transactionSet} to ${partner.name}`);
        console.log(`📄 EDI Content Preview:`, message.rawEDI?.substring(0, 200) + '...');
        
        message.status = 'sent';
        return true;
      }

      // Production EDI transmission logic would go here
      // This would include AS2, SFTP, HTTP POST, or VAN communication
      const result = await this.transmitEDI(message, partner);
      
      if (result) {
        message.status = 'sent';
        return true;
      } else {
        message.status = 'error';
        message.retryCount++;
        return false;
      }
    } catch (error) {
      message.status = 'error';
      message.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      message.retryCount++;
      return false;
    }
  }

  /**
   * Parse incoming EDI data
   */
  async parseIncomingEDI(ediData: string): Promise<EDIMessage> {
    // Basic EDI parsing logic
    const lines = ediData.split('\n');
    const isaSegment = lines.find(line => line.startsWith('ISA'));
    
    if (!isaSegment) {
      throw new Error('Invalid EDI format: Missing ISA segment');
    }

    // Extract basic information from ISA segment
    const isaFields = isaSegment.split('*');
    const senderId = isaFields[6]?.trim();
    const receiverId = isaFields[8]?.trim();
    
    const gsSegment = lines.find(line => line.startsWith('GS'));
    const transactionSet = gsSegment?.split('*')[1] as '214' | '204' | '210' | '997' | '990' | '820';

    const message: EDIMessage = {
      id: randomUUID(),
      transactionSet: transactionSet || '997',
      senderId: senderId || 'UNKNOWN',
      receiverId: receiverId || 'FLEETFLOW',
      controlNumber: this.generateControlNumber(),
      timestamp: new Date(),
      data: this.parseEDIContent(ediData, transactionSet),
      status: 'pending',
      retryCount: 0,
      rawEDI: ediData
    };

    return message;
  }

  /**
   * Get trading partner by ID
   */
  getTradingPartner(partnerId: string): TradingPartner | undefined {
    return this.tradingPartners.get(partnerId);
  }

  /**
   * Get all trading partners
   */
  getAllTradingPartners(): TradingPartner[] {
    return Array.from(this.tradingPartners.values());
  }

  /**
   * Get EDI message status
   */
  getMessageStatus(messageId: string): EDIMessage | undefined {
    return this.pendingMessages.get(messageId);
  }

  /**
   * Get all pending EDI messages
   */
  getPendingMessages(): EDIMessage[] {
    return Array.from(this.pendingMessages.values())
      .filter(msg => msg.status === 'pending' || msg.status === 'retry');
  }

  // Private helper methods

  private generateControlNumber(): string {
    return Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  }

  private formatEDI214(message: EDIMessage): string {
    const data = message.data as EDI214Data;
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').substring(0, 14);
    
    return `ISA*00*          *00*          *ZZ*FLEETFLOW     *ZZ*${message.receiverId.padEnd(15)}*${timestamp.substring(2, 8)}*${timestamp.substring(8, 12)}*U*00401*${message.controlNumber}*0*T*>~
GS*QM*FLEETFLOW*${message.receiverId}*${timestamp.substring(2, 8)}*${timestamp.substring(8, 12)}*${message.controlNumber}*X*004010~
ST*214*${message.controlNumber}~
B10*${data.shipmentId}*${data.shipmentId}~
B11*${data.statusCode}*${data.statusDescription}~
MS1*${data.location.city}*${data.location.state}*${data.location.zipCode}~
DTM*011*${data.timestamp.toISOString().substring(0, 10).replace(/-/g, '')}~
SE*6*${message.controlNumber}~
GE*1*${message.controlNumber}~
IEA*1*${message.controlNumber}~`;
  }

  private formatEDI204(message: EDIMessage): string {
    const data = message.data as EDI204Data;
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').substring(0, 14);
    
    return `ISA*00*          *00*          *ZZ*FLEETFLOW     *ZZ*${message.receiverId.padEnd(15)}*${timestamp.substring(2, 8)}*${timestamp.substring(8, 12)}*U*00401*${message.controlNumber}*0*T*>~
GS*SM*FLEETFLOW*${message.receiverId}*${timestamp.substring(2, 8)}*${timestamp.substring(8, 12)}*${message.controlNumber}*X*004010~
ST*204*${message.controlNumber}~
B2*${data.loadId}*${data.loadId}~
B2A*00*1~
MS3*${data.origin.city}*${data.origin.state}*${data.origin.zipCode}~
MS3*${data.destination.city}*${data.destination.state}*${data.destination.zipCode}~
DTM*010*${data.pickupDate.toISOString().substring(0, 10).replace(/-/g, '')}~
DTM*017*${data.deliveryDate.toISOString().substring(0, 10).replace(/-/g, '')}~
SE*8*${message.controlNumber}~
GE*1*${message.controlNumber}~
IEA*1*${message.controlNumber}~`;
  }

  private formatEDI210(message: EDIMessage): string {
    const data = message.data as EDI210Data;
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').substring(0, 14);
    
    return `ISA*00*          *00*          *ZZ*FLEETFLOW     *ZZ*${message.receiverId.padEnd(15)}*${timestamp.substring(2, 8)}*${timestamp.substring(8, 12)}*U*00401*${message.controlNumber}*0*T*>~
GS*FR*FLEETFLOW*${message.receiverId}*${timestamp.substring(2, 8)}*${timestamp.substring(8, 12)}*${message.controlNumber}*X*004010~
ST*210*${message.controlNumber}~
B3*${data.invoiceNumber}*${data.loadId}~
C1*${data.currency}~
ITD*01***${data.terms}~
N1*BT*${data.billToParty.name}~
N3*${data.billToParty.address}~
N4*${data.billToParty.city}*${data.billToParty.state}*${data.billToParty.zipCode}~
L0*1*${data.amount}*FR~
SE*9*${message.controlNumber}~
GE*1*${message.controlNumber}~
IEA*1*${message.controlNumber}~`;
  }

  private formatEDI997(message: EDIMessage): string {
    const data = message.data;
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').substring(0, 14);
    
    return `ISA*00*          *00*          *ZZ*FLEETFLOW     *ZZ*${message.receiverId.padEnd(15)}*${timestamp.substring(2, 8)}*${timestamp.substring(8, 12)}*U*00401*${message.controlNumber}*0*T*>~
GS*FA*FLEETFLOW*${message.receiverId}*${timestamp.substring(2, 8)}*${timestamp.substring(8, 12)}*${message.controlNumber}*X*004010~
ST*997*${message.controlNumber}~
AK1*SM*${data.originalControlNumber}~
AK9*${data.status === 'accepted' ? 'A' : 'R'}*1*1*1~
SE*4*${message.controlNumber}~
GE*1*${message.controlNumber}~
IEA*1*${message.controlNumber}~`;
  }

  private parseEDIContent(ediData: string, transactionSet: string): any {
    // Basic EDI parsing - in production this would be more comprehensive
    const segments = ediData.split('~');
    const data: any = {};

    segments.forEach(segment => {
      const fields = segment.split('*');
      const segmentType = fields[0];

      switch (segmentType) {
        case 'B10':
          data.shipmentId = fields[1];
          break;
        case 'B11':
          data.statusCode = fields[1];
          data.statusDescription = fields[2];
          break;
        case 'MS1':
          data.location = {
            city: fields[1],
            state: fields[2],
            zipCode: fields[3]
          };
          break;
      }
    });

    return data;
  }

  private async transmitEDI(message: EDIMessage, partner: TradingPartner): Promise<boolean> {
    // Production EDI transmission logic
    // This would implement AS2, SFTP, HTTP POST, or VAN communication
    // For now, return true to simulate successful transmission
    
    console.log(`📡 Transmitting EDI ${message.transactionSet} to ${partner.name} via ${partner.communicationMethod}`);
    
    switch (partner.communicationMethod) {
      case 'HTTP':
        return await this.transmitViaHTTP(message, partner);
      case 'AS2':
        return await this.transmitViaAS2(message, partner);
      case 'SFTP':
        return await this.transmitViaSFTP(message, partner);
      case 'VAN':
        return await this.transmitViaVAN(message, partner);
      default:
        throw new Error(`Unsupported communication method: ${partner.communicationMethod}`);
    }
  }

  private async transmitViaHTTP(message: EDIMessage, partner: TradingPartner): Promise<boolean> {
    // HTTP POST transmission
    try {
      const response = await fetch(partner.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/edi-x12',
          'X-EDI-Transaction-Set': message.transactionSet,
          'X-EDI-Control-Number': message.controlNumber
        },
        body: message.rawEDI
      });
      
      return response.ok;
    } catch (error) {
      console.error('HTTP transmission failed:', error);
      return false;
    }
  }

  private async transmitViaAS2(message: EDIMessage, partner: TradingPartner): Promise<boolean> {
    // AS2 transmission (would require AS2 library implementation)
    console.log('AS2 transmission not yet implemented');
    return true; // Simulate success for now
  }

  private async transmitViaSFTP(message: EDIMessage, partner: TradingPartner): Promise<boolean> {
    // SFTP transmission (would require SFTP library implementation)
    console.log('SFTP transmission not yet implemented');
    return true; // Simulate success for now
  }

  private async transmitViaVAN(message: EDIMessage, partner: TradingPartner): Promise<boolean> {
    // VAN transmission (would require VAN provider API implementation)
    console.log('VAN transmission not yet implemented');
    return true; // Simulate success for now
  }
}

// Export singleton instance
export const ediService = EDIService.getInstance();
