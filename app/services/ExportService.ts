/**
 * FLEETFLOW EXPORT SERVICE
 * Export data to Excel and PDF formats
 */

export class ExportService {
  /**
   * Export data to CSV (Excel-compatible)
   */
  public static exportToCSV(data: any[], filename: string): void {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
      headers.join(','), // Header row
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Handle values that contain commas or quotes
            if (
              typeof value === 'string' &&
              (value.includes(',') || value.includes('"'))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(',')
      ),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export shipments to CSV
   */
  public static exportShipmentsToCSV(shipments: any[]): void {
    const exportData = shipments.map((shipment) => ({
      'Shipment Number': shipment.shipmentNumber,
      Status: shipment.status,
      Origin: shipment.origin,
      Destination: shipment.destination,
      Cargo: shipment.cargoDescription,
      ETD: new Date(shipment.etd).toLocaleDateString(),
      ETA: new Date(shipment.eta).toLocaleDateString(),
      Value: `${shipment.currency} ${shipment.value.toLocaleString()}`,
    }));

    this.exportToCSV(exportData, `shipments_export_${Date.now()}`);
  }

  /**
   * Export documents to CSV
   */
  public static exportDocumentsToCSV(documents: any[]): void {
    const exportData = documents.map((doc) => ({
      'Document ID': doc.id,
      'File Name': doc.fileName,
      Category: doc.category,
      Status: doc.status,
      'Uploaded By': doc.uploadedBy.userName,
      'Upload Date': new Date(doc.uploadedAt).toLocaleDateString(),
      'File Size': this.formatFileSize(doc.fileSize),
    }));

    this.exportToCSV(exportData, `documents_export_${Date.now()}`);
  }

  /**
   * Format file size for display
   */
  private static formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  /**
   * Export to PDF (basic HTML to PDF)
   */
  public static exportToPDF(htmlContent: string, filename: string): void {
    // Create a printable window
    const printWindow = window.open('', '', 'height=600,width=800');

    if (!printWindow) {
      alert('Please allow popups to export PDF');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #4a5568;
              color: white;
            }
            h1 {
              color: #2d3748;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Give time for content to render
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }

  /**
   * Export shipments to PDF
   */
  public static exportShipmentsToPDF(shipments: any[]): void {
    const htmlContent = `
      <h1>Shipments Export</h1>
      <p>Generated: ${new Date().toLocaleString()}</p>
      <table>
        <thead>
          <tr>
            <th>Shipment #</th>
            <th>Status</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>ETD</th>
            <th>ETA</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          ${shipments
            .map(
              (shipment) => `
            <tr>
              <td>${shipment.shipmentNumber}</td>
              <td>${shipment.status}</td>
              <td>${shipment.origin}</td>
              <td>${shipment.destination}</td>
              <td>${new Date(shipment.etd).toLocaleDateString()}</td>
              <td>${new Date(shipment.eta).toLocaleDateString()}</td>
              <td>${shipment.currency} ${shipment.value.toLocaleString()}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;

    this.exportToPDF(htmlContent, `shipments_export_${Date.now()}`);
  }

  /**
   * Export documents to PDF
   */
  public static exportDocumentsToPDF(documents: any[]): void {
    const htmlContent = `
      <h1>Documents Export</h1>
      <p>Generated: ${new Date().toLocaleString()}</p>
      <table>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Category</th>
            <th>Status</th>
            <th>Uploaded By</th>
            <th>Upload Date</th>
            <th>Size</th>
          </tr>
        </thead>
        <tbody>
          ${documents
            .map(
              (doc) => `
            <tr>
              <td>${doc.fileName}</td>
              <td>${doc.category}</td>
              <td>${doc.status}</td>
              <td>${doc.uploadedBy.userName}</td>
              <td>${new Date(doc.uploadedAt).toLocaleDateString()}</td>
              <td>${this.formatFileSize(doc.fileSize)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `;

    this.exportToPDF(htmlContent, `documents_export_${Date.now()}`);
  }
}

export default ExportService;
