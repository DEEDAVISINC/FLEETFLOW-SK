/**
 * FLEETFLOW CUSTOMS CLEARANCE SERVICE
 *
 * Manages automated customs clearance workflows for freight forwarders
 * and customs brokers. Provides end-to-end customs processing,
 * document management, and compliance automation.
 */

export interface CustomsEntry {
  id: string;
  shipmentId: string;
  entryNumber: string;
  entryType: 'formal' | 'informal' | 'immediate';
  status: CustomsStatus;
  portOfEntry: string;
  country: string;
  importerOfRecord: {
    name: string;
    ein: string;
    address: string;
  };
  brokerInfo?: {
    name: string;
    license: string;
    scac?: string;
  };
  cargo: {
    description: string;
    htsCode: string;
    countryOfOrigin: string;
    quantity: number;
    unit: string;
    value: number;
    currency: string;
  };
  duties: {
    adValorem: number;
    specific: number;
    total: number;
    currency: string;
  };
  documents: CustomsDocument[];
  milestones: CustomsMilestone[];
  createdAt: Date;
  filedAt?: Date;
  clearedAt?: Date;
}

export interface CustomsDocument {
  id: string;
  type: CustomsDocumentType;
  name: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  url?: string;
  submittedAt?: Date;
  approvedAt?: Date;
  rejectionReason?: string;
}

export interface CustomsMilestone {
  id: string;
  type: 'filed' | 'exam_ordered' | 'exam_completed' | 'released' | 'cleared';
  description: string;
  timestamp: Date;
  notes?: string;
}

export type CustomsStatus =
  | 'draft'
  | 'filed'
  | 'under_review'
  | 'exam_ordered'
  | 'exam_completed'
  | 'additional_docs_required'
  | 'held'
  | 'released'
  | 'cleared'
  | 'cancelled';

export type CustomsDocumentType =
  | 'commercial_invoice'
  | 'packing_list'
  | 'bill_of_lading'
  | 'certificate_of_origin'
  | 'insurance_certificate'
  | 'import_license'
  | 'hts_classification'
  | 'value_declaration'
  | 'entry_summary'
  | 'power_of_attorney'
  | 'bond_document'
  | 'customs_bond'
  | 'duty_payment';

export class CustomsClearanceService {
  private entries: Map<string, CustomsEntry> = new Map();

  /**
   * CREATE CUSTOMS ENTRY
   */
  async createEntry(params: {
    shipmentId: string;
    entryType: 'formal' | 'informal' | 'immediate';
    portOfEntry: string;
    country: string;
    importerOfRecord: {
      name: string;
      ein: string;
      address: string;
    };
    brokerInfo?: {
      name: string;
      license: string;
      scac?: string;
    };
  }): Promise<CustomsEntry> {
    const entry: CustomsEntry = {
      id: `CE-${Date.now()}`,
      shipmentId: params.shipmentId,
      entryNumber: this.generateEntryNumber(),
      entryType: params.entryType,
      status: 'draft',
      portOfEntry: params.portOfEntry,
      country: params.country,
      importerOfRecord: params.importerOfRecord,
      brokerInfo: params.brokerInfo,
      cargo: {
        description: '',
        htsCode: '',
        countryOfOrigin: '',
        quantity: 0,
        unit: '',
        value: 0,
        currency: 'USD',
      },
      duties: {
        adValorem: 0,
        specific: 0,
        total: 0,
        currency: 'USD',
      },
      documents: [],
      milestones: [],
      createdAt: new Date(),
    };

    this.entries.set(entry.id, entry);
    return entry;
  }

  /**
   * UPDATE CARGO INFORMATION
   */
  async updateCargo(
    entryId: string,
    cargo: CustomsEntry['cargo']
  ): Promise<void> {
    const entry = this.entries.get(entryId);
    if (!entry) throw new Error('Customs entry not found');

    entry.cargo = cargo;
    this.addMilestone(entryId, 'draft', 'Cargo information updated');
  }

  /**
   * ADD CUSTOMS DOCUMENT
   */
  async addDocument(
    entryId: string,
    document: Omit<CustomsDocument, 'id' | 'status'>
  ): Promise<CustomsDocument> {
    const entry = this.entries.get(entryId);
    if (!entry) throw new Error('Customs entry not found');

    const doc: CustomsDocument = {
      id: `DOC-${Date.now()}`,
      ...document,
      status: 'pending',
    };

    entry.documents.push(doc);
    return doc;
  }

  /**
   * FILE CUSTOMS ENTRY
   */
  async fileEntry(entryId: string): Promise<void> {
    const entry = this.entries.get(entryId);
    if (!entry) throw new Error('Customs entry not found');

    if (entry.status !== 'draft') {
      throw new Error('Entry must be in draft status to file');
    }

    entry.status = 'filed';
    entry.filedAt = new Date();
    this.addMilestone(entryId, 'filed', 'Customs entry filed with authorities');
  }

  /**
   * UPDATE ENTRY STATUS
   */
  async updateStatus(
    entryId: string,
    status: CustomsStatus,
    notes?: string
  ): Promise<void> {
    const entry = this.entries.get(entryId);
    if (!entry) throw new Error('Customs entry not found');

    entry.status = status;

    switch (status) {
      case 'cleared':
        entry.clearedAt = new Date();
        this.addMilestone(
          entryId,
          'cleared',
          notes || 'Customs clearance completed'
        );
        break;
      case 'exam_ordered':
        this.addMilestone(
          entryId,
          'exam_ordered',
          notes || 'Customs examination ordered'
        );
        break;
      case 'exam_completed':
        this.addMilestone(
          entryId,
          'exam_completed',
          notes || 'Customs examination completed'
        );
        break;
      case 'released':
        this.addMilestone(
          entryId,
          'released',
          notes || 'Cargo released from customs'
        );
        break;
      default:
        this.addMilestone(entryId, status, notes);
    }
  }

  /**
   * CALCULATE DUTIES
   */
  async calculateDuties(entryId: string): Promise<CustomsEntry['duties']> {
    const entry = this.entries.get(entryId);
    if (!entry) throw new Error('Customs entry not found');

    // Mock duty calculation - in production, integrate with duty calculation service
    const adValorem = entry.cargo.value * 0.05; // 5% ad valorem duty
    const specific = 0; // No specific duty for this example
    const total = adValorem + specific;

    entry.duties = {
      adValorem,
      specific,
      total,
      currency: entry.cargo.currency,
    };

    return entry.duties;
  }

  /**
   * GET ENTRY BY ID
   */
  async getEntry(entryId: string): Promise<CustomsEntry | null> {
    return this.entries.get(entryId) || null;
  }

  /**
   * GET ENTRIES BY SHIPMENT
   */
  async getEntriesByShipment(shipmentId: string): Promise<CustomsEntry[]> {
    return Array.from(this.entries.values()).filter(
      (entry) => entry.shipmentId === shipmentId
    );
  }

  /**
   * GET ENTRIES BY STATUS
   */
  async getEntriesByStatus(status: CustomsStatus): Promise<CustomsEntry[]> {
    return Array.from(this.entries.values()).filter(
      (entry) => entry.status === status
    );
  }

  /**
   * GET ALL ENTRIES
   */
  async getAllEntries(): Promise<CustomsEntry[]> {
    return Array.from(this.entries.values());
  }

  private generateEntryNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `FF${timestamp}${random}`;
  }

  private addMilestone(
    entryId: string,
    type: CustomsMilestone['type'],
    description: string,
    notes?: string
  ): void {
    const entry = this.entries.get(entryId);
    if (!entry) return;

    const milestone: CustomsMilestone = {
      id: `MS-${Date.now()}`,
      type,
      description,
      timestamp: new Date(),
      notes,
    };

    entry.milestones.push(milestone);
  }
}

export const customsClearanceService = new CustomsClearanceService();
