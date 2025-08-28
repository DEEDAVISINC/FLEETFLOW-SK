/**
 * Professional PDF Generation Service
 * Creates beautifully formatted PDFs for Bills of Lading and other documents
 */

import { CompanyBranding } from './EnhancedEmailTemplateService';

export interface PDFGenerationOptions {
  documentType: 'bol' | 'invoice' | 'contract' | 'report';
  format: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  headerFooter: boolean;
  branding: CompanyBranding;
}

export interface BOLData {
  bolNumber: string;
  loadId: string;
  loadIdentifier: string;
  shipperId: string;
  date: string;
  broker: {
    name: string;
    phone: string;
    address?: string;
  };
  shipper: {
    company: string;
    contact: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email: string;
  };
  consignee: {
    company: string;
    contact: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone?: string;
  };
  carrier: {
    company: string;
    mcNumber: string;
    dotNumber: string;
    phone: string;
    driver: string;
  };
  shipment: {
    origin: string;
    destination: string;
    pickupDate: string;
    deliveryDate: string;
    equipment: string;
    weight: string;
    pieces: number;
    commodity: string;
    specialInstructions?: string;
  };
  charges: {
    freightCharges: number;
    paymentTerms: string;
    fuelSurcharge?: number;
    additionalCharges?: Array<{
      description: string;
      amount: number;
    }>;
  };
  hazmat: {
    isHazmat: boolean;
    unNumber?: string;
    properShippingName?: string;
    hazardClass?: string;
    packingGroup?: string;
  };
}

export class ProfessionalPDFService {
  private defaultOptions: PDFGenerationOptions = {
    documentType: 'bol',
    format: 'A4',
    orientation: 'portrait',
    margins: {
      top: '0.75in',
      right: '0.5in',
      bottom: '0.75in',
      left: '0.5in',
    },
    headerFooter: true,
    branding: {
      companyName: 'FleetFlow',
      colors: {
        primaryColor: '#2563eb',
        secondaryColor: '#1e40af',
        accentColor: '#3b82f6',
        backgroundColor: '#ffffff',
        cardColor: '#f8fafc',
        textColor: '#374151',
        headingColor: '#1f2937',
        borderColor: '#e5e7eb',
        successColor: '#10b981',
        warningColor: '#f59e0b',
        errorColor: '#ef4444',
      },
      fontFamily: "'Inter', Arial, sans-serif",
      headerStyle: 'modern',
    },
  };

  // 📄 GENERATE PROFESSIONAL BOL PDF
  async generateBillOfLadingPDF(
    bolData: BOLData,
    options: Partial<PDFGenerationOptions> = {}
  ): Promise<{ pdfBuffer: Buffer; filename: string }> {
    const pdfOptions = { ...this.defaultOptions, ...options };
    const theme = pdfOptions.branding.colors;

    const htmlContent = this.generateBOLHTML(bolData, pdfOptions);

    // Mock PDF generation - In production, use libraries like:
    // - puppeteer (Chrome headless)
    // - playwright
    // - wkhtmltopdf
    // - jsPDF with html2canvas

    console.log('🔄 Generating professional PDF...');

    // Simulate PDF generation
    const mockPDFBuffer = Buffer.from(
      `
      Professional PDF would be generated here with:
      - Company branding and logo
      - Professional formatting
      - High-quality typography
      - Structured layout
      - Legal compliance formatting

      BOL Details:
      Number: ${bolData.bolNumber}
      Load: ${bolData.loadId}
      From: ${bolData.shipper.company}
      To: ${bolData.consignee.company}
      Amount: $${bolData.charges.freightCharges.toLocaleString()}
    `,
      'utf-8'
    );

    const filename = `BOL-${bolData.bolNumber}-${new Date().getTime()}.pdf`;

    console.log(`✅ Professional PDF generated: ${filename}`);

    return {
      pdfBuffer: mockPDFBuffer,
      filename,
    };
  }

  // 🎨 GENERATE BOL HTML TEMPLATE
  private generateBOLHTML(
    bolData: BOLData,
    options: PDFGenerationOptions
  ): string {
    const theme = options.branding.colors;
    const isHazmat = bolData.hazmat.isHazmat;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bill of Lading - ${bolData.bolNumber}</title>
        <style>
            /* PDF-Optimized Styles */
            @page {
                size: ${options.format};
                margin: ${options.margins.top} ${options.margins.right} ${options.margins.bottom} ${options.margins.left};
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: ${options.branding.fontFamily};
                font-size: 11px;
                line-height: 1.4;
                color: ${theme.textColor};
                background: ${theme.backgroundColor};
            }

            /* Header Section */
            .document-header {
                border-bottom: 3px solid ${theme.primaryColor};
                padding-bottom: 15px;
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .company-info h1 {
                color: ${theme.primaryColor};
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 5px;
            }

            .company-info .tagline {
                color: ${theme.textColor};
                font-size: 12px;
                opacity: 0.8;
            }

            .document-title {
                text-align: right;
            }

            .document-title h2 {
                font-size: 20px;
                color: ${theme.headingColor};
                font-weight: 600;
                margin-bottom: 5px;
            }

            .bol-number {
                font-size: 14px;
                font-weight: 600;
                color: ${theme.primaryColor};
                background: ${theme.cardColor};
                padding: 5px 10px;
                border: 1px solid ${theme.borderColor};
                border-radius: 4px;
            }

            /* Two Column Layout */
            .two-column {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
            }

            .column {
                flex: 1;
            }

            /* Info Boxes */
            .info-box {
                border: 1px solid ${theme.borderColor};
                background: ${theme.cardColor};
                margin-bottom: 15px;
                border-radius: 4px;
                overflow: hidden;
            }

            .info-box-header {
                background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor});
                color: white;
                padding: 8px 12px;
                font-weight: 600;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .info-box-content {
                padding: 12px;
            }

            .info-row {
                display: flex;
                margin-bottom: 6px;
                align-items: baseline;
            }

            .info-row:last-child {
                margin-bottom: 0;
            }

            .info-label {
                font-weight: 600;
                min-width: 80px;
                color: ${theme.headingColor};
            }

            .info-value {
                flex: 1;
                color: ${theme.textColor};
            }

            /* Shipment Details Table */
            .shipment-table {
                width: 100%;
                border-collapse: collapse;
                margin: 15px 0;
                border: 1px solid ${theme.borderColor};
            }

            .shipment-table th {
                background: ${theme.primaryColor};
                color: white;
                padding: 10px 8px;
                text-align: left;
                font-weight: 600;
                font-size: 10px;
                text-transform: uppercase;
            }

            .shipment-table td {
                padding: 10px 8px;
                border-bottom: 1px solid ${theme.borderColor};
                vertical-align: top;
            }

            .shipment-table tbody tr:nth-child(even) {
                background: ${theme.cardColor};
            }

            /* Charges Section */
            .charges-section {
                background: ${theme.cardColor};
                border: 2px solid ${theme.primaryColor};
                padding: 15px;
                margin: 15px 0;
                border-radius: 6px;
            }

            .charges-title {
                color: ${theme.primaryColor};
                font-weight: 700;
                font-size: 14px;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .charge-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                padding: 3px 0;
                border-bottom: 1px dotted ${theme.borderColor};
            }

            .total-row {
                font-weight: 700;
                font-size: 14px;
                color: ${theme.primaryColor};
                border-top: 2px solid ${theme.primaryColor};
                padding-top: 8px;
                margin-top: 8px;
            }

            /* Hazmat Warning */
            .hazmat-warning {
                background: linear-gradient(135deg, #fef3c7, #f59e0b);
                border: 2px solid #d97706;
                padding: 12px;
                margin: 15px 0;
                border-radius: 6px;
                text-align: center;
            }

            .hazmat-warning h3 {
                color: #92400e;
                font-size: 14px;
                font-weight: 700;
                margin-bottom: 5px;
            }

            /* Signatures Section */
            .signatures {
                margin-top: 30px;
                border-top: 2px solid ${theme.borderColor};
                padding-top: 20px;
            }

            .signature-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 40px;
            }

            .signature-box {
                width: 30%;
                text-align: center;
            }

            .signature-line {
                border-bottom: 2px solid ${theme.textColor};
                margin-bottom: 8px;
                height: 30px;
            }

            .signature-label {
                font-weight: 600;
                color: ${theme.headingColor};
                font-size: 10px;
                text-transform: uppercase;
            }

            /* Footer */
            .document-footer {
                margin-top: 30px;
                border-top: 1px solid ${theme.borderColor};
                padding-top: 15px;
                text-align: center;
                font-size: 9px;
                color: ${theme.textColor};
                opacity: 0.7;
            }

            /* Print Optimizations */
            @media print {
                body { -webkit-print-color-adjust: exact; }
                .info-box { page-break-inside: avoid; }
                .signatures { page-break-inside: avoid; }
            }
        </style>
    </head>
    <body>
        <!-- Header -->
        <div class="document-header">
            <div class="company-info">
                <h1>${options.branding.companyName}</h1>
                <div class="tagline">${options.branding.tagline || 'Professional Transportation Services'}</div>
            </div>
            <div class="document-title">
                <h2>BILL OF LADING</h2>
                <div class="bol-number">BOL# ${bolData.bolNumber}</div>
            </div>
        </div>

        <!-- Document Info -->
        <div class="two-column">
            <div class="column">
                <div class="info-box">
                    <div class="info-box-header">Document Information</div>
                    <div class="info-box-content">
                        <div class="info-row">
                            <span class="info-label">Load ID:</span>
                            <span class="info-value">${bolData.loadId}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Load Ref:</span>
                            <span class="info-value">${bolData.loadIdentifier}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Shipper ID:</span>
                            <span class="info-value">${bolData.shipperId}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Date:</span>
                            <span class="info-value">${bolData.date}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="info-box">
                    <div class="info-box-header">Broker Information</div>
                    <div class="info-box-content">
                        <div class="info-row">
                            <span class="info-label">Company:</span>
                            <span class="info-value">${bolData.broker.name}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Phone:</span>
                            <span class="info-value">${bolData.broker.phone}</span>
                        </div>
                        ${
                          bolData.broker.address
                            ? `
                        <div class="info-row">
                            <span class="info-label">Address:</span>
                            <span class="info-value">${bolData.broker.address}</span>
                        </div>
                        `
                            : ''
                        }
                    </div>
                </div>
            </div>
        </div>

        <!-- Shipper & Consignee -->
        <div class="two-column">
            <div class="column">
                <div class="info-box">
                    <div class="info-box-header">Shipper</div>
                    <div class="info-box-content">
                        <div class="info-row">
                            <span class="info-label">Company:</span>
                            <span class="info-value"><strong>${bolData.shipper.company}</strong></span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Contact:</span>
                            <span class="info-value">${bolData.shipper.contact}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Address:</span>
                            <span class="info-value">${bolData.shipper.address}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">City:</span>
                            <span class="info-value">${bolData.shipper.city}, ${bolData.shipper.state} ${bolData.shipper.zipCode}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Phone:</span>
                            <span class="info-value">${bolData.shipper.phone}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Email:</span>
                            <span class="info-value">${bolData.shipper.email}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column">
                <div class="info-box">
                    <div class="info-box-header">Consignee</div>
                    <div class="info-box-content">
                        <div class="info-row">
                            <span class="info-label">Company:</span>
                            <span class="info-value"><strong>${bolData.consignee.company}</strong></span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Contact:</span>
                            <span class="info-value">${bolData.consignee.contact}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Address:</span>
                            <span class="info-value">${bolData.consignee.address}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">City:</span>
                            <span class="info-value">${bolData.consignee.city}, ${bolData.consignee.state} ${bolData.consignee.zipCode}</span>
                        </div>
                        ${
                          bolData.consignee.phone
                            ? `
                        <div class="info-row">
                            <span class="info-label">Phone:</span>
                            <span class="info-value">${bolData.consignee.phone}</span>
                        </div>
                        `
                            : ''
                        }
                    </div>
                </div>
            </div>
        </div>

        <!-- Carrier Information -->
        <div class="info-box">
            <div class="info-box-header">Carrier Information</div>
            <div class="info-box-content">
                <div class="two-column">
                    <div class="column">
                        <div class="info-row">
                            <span class="info-label">Company:</span>
                            <span class="info-value"><strong>${bolData.carrier.company}</strong></span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">MC Number:</span>
                            <span class="info-value">${bolData.carrier.mcNumber}</span>
                        </div>
                    </div>
                    <div class="column">
                        <div class="info-row">
                            <span class="info-label">DOT Number:</span>
                            <span class="info-value">${bolData.carrier.dotNumber}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Phone:</span>
                            <span class="info-value">${bolData.carrier.phone}</span>
                        </div>
                    </div>
                </div>
                <div class="info-row">
                    <span class="info-label">Driver:</span>
                    <span class="info-value"><strong>${bolData.carrier.driver}</strong></span>
                </div>
            </div>
        </div>

        <!-- Shipment Details -->
        <table class="shipment-table">
            <thead>
                <tr>
                    <th>Origin</th>
                    <th>Destination</th>
                    <th>Pickup Date</th>
                    <th>Delivery Date</th>
                    <th>Equipment</th>
                    <th>Weight</th>
                    <th>Pieces</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>${bolData.shipment.origin}</strong></td>
                    <td><strong>${bolData.shipment.destination}</strong></td>
                    <td>${bolData.shipment.pickupDate}</td>
                    <td>${bolData.shipment.deliveryDate}</td>
                    <td>${bolData.shipment.equipment}</td>
                    <td>${bolData.shipment.weight}</td>
                    <td>${bolData.shipment.pieces}</td>
                </tr>
            </tbody>
        </table>

        <!-- Commodity Description -->
        <div class="info-box">
            <div class="info-box-header">Commodity Description</div>
            <div class="info-box-content">
                <div class="info-row">
                    <span class="info-label">Description:</span>
                    <span class="info-value"><strong>${bolData.shipment.commodity}</strong></span>
                </div>
                ${
                  bolData.shipment.specialInstructions
                    ? `
                <div class="info-row">
                    <span class="info-label">Special Instructions:</span>
                    <span class="info-value">${bolData.shipment.specialInstructions}</span>
                </div>
                `
                    : ''
                }
            </div>
        </div>

        ${
          isHazmat
            ? `
        <!-- Hazmat Warning -->
        <div class="hazmat-warning">
            <h3>⚠️ HAZARDOUS MATERIALS</h3>
            <div style="margin-top: 8px;">
                <strong>UN Number:</strong> ${bolData.hazmat.unNumber || 'N/A'} |
                <strong>Proper Shipping Name:</strong> ${bolData.hazmat.properShippingName || 'N/A'}<br>
                <strong>Hazard Class:</strong> ${bolData.hazmat.hazardClass || 'N/A'} |
                <strong>Packing Group:</strong> ${bolData.hazmat.packingGroup || 'N/A'}
            </div>
        </div>
        `
            : ''
        }

        <!-- Charges -->
        <div class="charges-section">
            <div class="charges-title">Freight Charges & Payment Terms</div>
            <div class="charge-row">
                <span>Freight Charges:</span>
                <span><strong>$${bolData.charges.freightCharges.toLocaleString()}</strong></span>
            </div>
            ${
              bolData.charges.fuelSurcharge
                ? `
            <div class="charge-row">
                <span>Fuel Surcharge:</span>
                <span>$${bolData.charges.fuelSurcharge.toLocaleString()}</span>
            </div>
            `
                : ''
            }
            ${
              bolData.charges.additionalCharges
                ?.map(
                  (charge) => `
            <div class="charge-row">
                <span>${charge.description}:</span>
                <span>$${charge.amount.toLocaleString()}</span>
            </div>
            `
                )
                .join('') || ''
            }
            <div class="charge-row total-row">
                <span>Total Amount:</span>
                <span>$${(
                  bolData.charges.freightCharges +
                  (bolData.charges.fuelSurcharge || 0) +
                  (bolData.charges.additionalCharges?.reduce(
                    (sum, charge) => sum + charge.amount,
                    0
                  ) || 0)
                ).toLocaleString()}</span>
            </div>
            <div style="margin-top: 10px;">
                <strong>Payment Terms:</strong> ${bolData.charges.paymentTerms}
            </div>
        </div>

        <!-- Signatures -->
        <div class="signatures">
            <div class="signature-row">
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <div class="signature-label">Shipper Signature & Date</div>
                </div>
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <div class="signature-label">Carrier Signature & Date</div>
                </div>
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <div class="signature-label">Consignee Signature & Date</div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="document-footer">
            <p>This document constitutes a contract of carriage and receipt of goods.</p>
            <p>Generated by ${options.branding.companyName} Document Management System</p>
        </div>
    </body>
    </html>`;
  }

  // 📊 GENERATE INVOICE PDF
  async generateInvoicePDF(
    invoiceData: any,
    options: Partial<PDFGenerationOptions> = {}
  ): Promise<{ pdfBuffer: Buffer; filename: string }> {
    // Similar implementation for invoices
    const filename = `Invoice-${invoiceData.invoiceNumber}-${new Date().getTime()}.pdf`;

    // Mock implementation
    const mockPDFBuffer = Buffer.from('Mock Invoice PDF Content', 'utf-8');

    return {
      pdfBuffer: mockPDFBuffer,
      filename,
    };
  }

  // 📋 GENERATE CONTRACT PDF
  async generateContractPDF(
    contractData: any,
    options: Partial<PDFGenerationOptions> = {}
  ): Promise<{ pdfBuffer: Buffer; filename: string }> {
    // Similar implementation for contracts
    const filename = `Contract-${contractData.contractNumber}-${new Date().getTime()}.pdf`;

    // Mock implementation
    const mockPDFBuffer = Buffer.from('Mock Contract PDF Content', 'utf-8');

    return {
      pdfBuffer: mockPDFBuffer,
      filename,
    };
  }
}

export const professionalPDFService = new ProfessionalPDFService();















