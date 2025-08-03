'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  formatCertificateSerial,
  generateCertificateId,
  getInstructorForModule,
  type InstructorInfo,
} from '../utils/instructorUtils';
import {
  extractModuleIdFromTitle,
  getModuleColorScheme,
} from '../utils/moduleColors';

export interface CertificateData {
  id: string;
  moduleTitle: string;
  recipientName: string;
  recipientEmail?: string;
  recipientRole: string;
  dateEarned: string;
  score: number;
  validUntil: string;
  instructorName?: string;
  companyName?: string;
  certificateId?: string;
  instructor?: InstructorInfo | null;
}

export class CertificateGenerator {
  static async generateCertificatePDF(
    certificateData: CertificateData
  ): Promise<Blob> {
    // Generate unique certificate ID if not provided
    if (!certificateData.certificateId) {
      certificateData.certificateId = generateCertificateId();
    }

    // Get instructor information for the module
    const moduleId = extractModuleIdFromTitle(certificateData.moduleTitle);
    if (!certificateData.instructor) {
      certificateData.instructor = getInstructorForModule(moduleId);
    }

    // Create a temporary div for the certificate design
    const certificateDiv = document.createElement('div');
    certificateDiv.style.position = 'absolute';
    certificateDiv.style.left = '-9999px';
    certificateDiv.style.width = '1200px';
    certificateDiv.style.height = '900px';
    certificateDiv.style.background = 'white';
    certificateDiv.style.fontFamily = 'Arial, sans-serif';

    certificateDiv.innerHTML = this.getCertificateHTML(certificateData);

    document.body.appendChild(certificateDiv);

    try {
      // Convert to canvas
      const canvas = await html2canvas(certificateDiv, {
        width: 1200,
        height: 900,
        scale: 2,
        backgroundColor: '#ffffff',
      });

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1200, 900],
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 1200, 900);

      // Clean up
      document.body.removeChild(certificateDiv);

      return pdf.output('blob');
    } catch (error) {
      document.body.removeChild(certificateDiv);
      throw error;
    }
  }

  private static getCertificateHTML(data: CertificateData): string {
    // Get module-specific color scheme
    const moduleId = extractModuleIdFromTitle(data.moduleTitle);
    const colors = getModuleColorScheme(moduleId);

    return `
      <div style="
        width: 100%;
        height: 100%;
        background: ${colors.gradient};
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      ">
        <!-- Background Pattern -->
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 2px, transparent 2px);
          background-size: 50px 50px;
        "></div>

        <!-- Certificate Content -->
        <div style="
          background: rgba(255, 255, 255, 0.98);
          border: 8px solid rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          padding: 60px;
          max-width: 1000px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 2;
        ">
          <!-- Header -->
          <div style="margin-bottom: 40px;">
            <!-- Logo Placeholder - Replace with actual FleetFlow logo -->
            <div style="
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 20px;
            ">
              <!-- Logo Image Placeholder -->
              <div style="
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                color: white;
                font-weight: bold;
                border: 3px solid ${colors.border};
              ">🚛</div>
              <!-- Company Name -->
              <div>
                <div style="
                  font-size: 48px;
                  font-weight: bold;
                  color: #1f2937;
                  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                ">FleetFlow University℠</div>
                <div style="
                  font-size: 16px;
                  color: #6b7280;
                  font-weight: 500;
                  text-align: center;
                  margin-top: 5px;
                ">Transportation Excellence Institute</div>
              </div>
            </div>
            <div style="
              font-size: 32px;
              color: #6b7280;
              font-weight: 600;
              letter-spacing: 3px;
            ">CERTIFICATE OF COMPLETION</div>
          </div>

          <!-- Decorative Line -->
          <div style="
            height: 4px;
            background: linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.primary});
            margin: 30px auto;
            width: 300px;
            border-radius: 2px;
          "></div>

          <!-- Main Content -->
          <div style="margin: 40px 0;">
            <div style="
              font-size: 24px;
              color: #374151;
              margin-bottom: 20px;
              font-style: italic;
            ">This is to certify that</div>

            <div style="
              font-size: 40px;
              font-weight: bold;
              color: #1f2937;
              margin: 20px 0;
              padding: 15px 30px;
              border-bottom: 3px solid ${colors.primary};
              display: inline-block;
            ">${data.recipientName}</div>

            <div style="
              font-size: 20px;
              color: #374151;
              margin: 20px 0;
            ">has successfully completed the training program</div>

            <div style="
              font-size: 28px;
              font-weight: bold;
              color: ${colors.secondary};
              margin: 25px 0;
              padding: 20px;
              background: ${colors.light};
              border-radius: 10px;
              border: 2px solid ${colors.border};
            ">${data.moduleTitle}</div>

            <div style="
              font-size: 18px;
              color: #374151;
              margin-top: 20px;
            ">with a score of <strong style="color: ${colors.primary}; font-size: 22px;">${data.score}%</strong></div>
          </div>

          <!-- Footer Info -->
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #e5e7eb;
          ">
            <div style="text-align: left;">
              <div style="
                font-size: 16px;
                color: #6b7280;
                margin-bottom: 5px;
              ">Date Issued:</div>
              <div style="
                font-size: 18px;
                font-weight: bold;
                color: #1f2937;
              ">${data.dateEarned}</div>
            </div>

            <div style="text-align: center;">
              <div style="
                font-size: 16px;
                color: #6b7280;
                margin-bottom: 5px;
              ">Certificate ID:</div>
              <div style="
                font-size: 14px;
                font-weight: bold;
                color: #1f2937;
                font-family: monospace;
              ">${data.certificateId ? formatCertificateSerial(data.certificateId) : data.id}</div>
            </div>

            <div style="text-align: center;">
              <div style="
                font-size: 14px;
                color: #6b7280;
                margin-bottom: 5px;
              ">Score Achieved:</div>
              <div style="
                font-size: 16px;
                font-weight: bold;
                color: ${data.score >= 80 ? colors.primary : '#ef4444'};
              ">${data.score}%</div>
            </div>

            <div style="text-align: right;">
              <div style="
                font-size: 16px;
                color: #6b7280;
                margin-bottom: 5px;
              ">Valid Until:</div>
              <div style="
                font-size: 18px;
                font-weight: bold;
                color: #1f2937;
              ">${data.validUntil}</div>
            </div>
          </div>

          <!-- Signature Section -->
          <div style="
            margin-top: 40px;
            display: flex;
            justify-content: ${data.instructor ? 'space-between' : 'center'};
            align-items: center;
            padding: 0 40px;
          ">
            ${
              data.instructor
                ? `
            <!-- Instructor Signature -->
            <div style="text-align: center;">
              <div style="
                height: 2px;
                background: #374151;
                width: 200px;
                margin-bottom: 10px;
              "></div>
              <div style="
                font-size: 16px;
                color: #374151;
                font-weight: 600;
              ">${data.instructor.name}</div>
              <div style="
                font-size: 14px;
                color: #6b7280;
                margin-top: 2px;
              ">${data.instructor.title}</div>
              <div style="
                font-size: 12px;
                color: #6b7280;
                margin-top: 2px;
              ">${data.instructor.credentials}</div>
            </div>
            `
                : ''
            }

            <!-- Director Signature -->
            <div style="text-align: center;">
              <div style="
                height: 2px;
                background: #374151;
                width: 200px;
                margin-bottom: 10px;
              "></div>
              <div style="
                font-size: 16px;
                color: #374151;
                font-weight: 600;
              ">FleetFlow University℠ Director</div>
              <div style="
                font-size: 14px;
                color: #6b7280;
                margin-top: 5px;
              ">Transportation Excellence Institute</div>
            </div>
          </div>

          <!-- Security Features -->
          <div style="
            position: absolute;
            top: 20px;
            right: 20px;
            width: 80px;
            height: 80px;
            border: 3px solid ${colors.primary};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${colors.light};
          ">
            <div style="
              font-size: 24px;
              color: ${colors.secondary};
              font-weight: bold;
            ">✓</div>
          </div>

          <!-- Security Watermark -->
          <div style="
            position: absolute;
            bottom: 20px;
            left: 20px;
            font-size: 12px;
            color: #9ca3af;
            transform: rotate(-45deg);
            opacity: 0.7;
          ">AUTHENTICATED CERTIFICATE</div>
        </div>
      </div>
    `;
  }

  static downloadCertificate(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
