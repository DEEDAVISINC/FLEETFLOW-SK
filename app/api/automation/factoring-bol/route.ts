import { NextRequest, NextResponse } from 'next/server';
import { tenantEmailTemplateService } from '../../../services/TenantEmailTemplateService';
import { sendGridService } from '../../../services/sendgrid-service';

// 💰 FACTORING BOL AUTOMATION API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'send_bol_to_factor':
        const result = await sendBOLToFactoringCompany(data);
        return NextResponse.json({
          success: true,
          result,
          message: 'BOL sent to factoring company successfully',
        });

      case 'get_factoring_status':
        const status = await getFactoringStatus(data.carrierId, data.loadId);
        return NextResponse.json({
          success: true,
          status,
          message: 'Factoring status retrieved',
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Factoring BOL automation error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// 📧 SEND BOL TO FACTORING COMPANY
async function sendBOLToFactoringCompany(data: any) {
  try {
    const { loadId, bolDocument, factoringCompany, carrierInfo } = data;

    // Generate professional BOL email using tenant templates
    const renderedEmail = await tenantEmailTemplateService.renderTenantEmail(
      carrierInfo.tenantId || 'default',
      'factoring_bol_submission' as any,
      {
        load: {
          id: loadId,
          origin: bolDocument.loadDetails.origin,
          destination: bolDocument.loadDetails.destination,
          amount: bolDocument.loadDetails.loadAmount,
          deliveryDate: bolDocument.deliveryCompleted,
          commodity: bolDocument.loadDetails.commodity,
          weight: bolDocument.loadDetails.weight,
          equipment: bolDocument.loadDetails.equipment,
        },
        carrier: {
          name: carrierInfo.name,
          mcNumber: carrierInfo.mcNumber,
          contact: bolDocument.carrierInfo.contact,
          phone: bolDocument.carrierInfo.phone,
        },
        factoring: {
          companyName: factoringCompany.name,
          accountExecutive: {
            name: factoringCompany.contactName || 'Account Executive',
            title: factoringCompany.title || 'Account Executive',
            email: factoringCompany.email,
            phone: factoringCompany.phone || factoringCompany.directPhone,
            directPhone: factoringCompany.directPhone,
          },
          rate: factoringCompany.rate,
          advanceRate: factoringCompany.advanceRate,
        },
        driver: {
          name: bolDocument.driverInfo?.name || bolDocument.driverSignature,
          signature: bolDocument.driverSignature,
        },
        receiver: {
          name: bolDocument.receiverInfo.name,
          signature: bolDocument.receiverInfo.signature,
          timestamp: bolDocument.receiverInfo.timestamp,
        },
      }
    );

    // Generate BOL PDF attachment (mock for now - in production, use PDF generation service)
    const bolPDFContent = generateBOLPDFContent(bolDocument);

    // Send email to factoring company
    const emailResult = await sendGridService.sendEmail({
      recipient: {
        email: factoringCompany.email,
        name: factoringCompany.name,
      },
      subject:
        renderedEmail.subject || `BOL for Load ${loadId} - ${carrierInfo.name}`,
      htmlContent:
        renderedEmail.htmlContent ||
        getDefaultBOLEmail(bolDocument, factoringCompany, carrierInfo),
      textContent:
        renderedEmail.textContent ||
        getDefaultBOLEmailText(bolDocument, factoringCompany, carrierInfo),
      fromEmail: renderedEmail.fromEmail,
      fromName: renderedEmail.fromName,
      attachments: [
        {
          filename: `BOL_${loadId}_${Date.now()}.pdf`,
          content: bolPDFContent,
          // @ts-ignore - Temporary fix for deployment
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
      templateId: 'factoring-bol-submission',
      metadata: {
        tenantId: carrierInfo.tenantId,
        loadId,
        carrierId: carrierInfo.mcNumber,
        factoringCompany: factoringCompany.name,
        automationType: 'factoring_bol_submission',
      },
    });

    // Log the BOL submission for audit trail
    await logBOLSubmission({
      loadId,
      carrierId: carrierInfo.mcNumber,
      factoringCompany: factoringCompany.name,
      emailResult,
      submittedAt: new Date().toISOString(),
      bolDocument,
    });

    return {
      emailSent: emailResult.success,
      factoringCompany: factoringCompany.name,
      loadId,
      submissionTime: new Date().toISOString(),
      emailResult,
    };
  } catch (error) {
    console.error('BOL sending error:', error);
    throw new Error(
      `Failed to send BOL: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// 📄 GENERATE BOL PDF CONTENT (Mock - replace with actual PDF generation)
function generateBOLPDFContent(bolDocument: any): string {
  // In production, use a PDF generation library like jsPDF or Puppeteer
  // For now, return base64 encoded mock PDF content
  const pdfData = {
    title: `Bill of Lading - Load ${bolDocument.loadId}`,
    carrier: bolDocument.carrierInfo,
    load: bolDocument.loadDetails,
    delivery: {
      completedAt: bolDocument.deliveryCompleted,
      driverSignature: bolDocument.driverSignature,
      receiverInfo: bolDocument.receiverInfo,
    },
    factoring: bolDocument.factoringInfo,
  };

  // Mock base64 PDF content - replace with actual PDF generation
  return Buffer.from(JSON.stringify(pdfData, null, 2)).toString('base64');
}

// 📊 GET FACTORING STATUS
async function getFactoringStatus(carrierId: string, loadId?: string) {
  try {
    // Mock implementation - replace with actual database queries
    return {
      carrierId,
      loadId,
      factoringEnabled: true,
      currentFactor: 'TBS Factoring Service',
      recentSubmissions: [
        {
          loadId: loadId || 'L2025-001',
          submittedAt: new Date().toISOString(),
          status: 'submitted',
          amount: 2500,
        },
      ],
      status: 'active',
    };
  } catch (error) {
    throw new Error(
      `Failed to get factoring status: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// 📝 LOG BOL SUBMISSION
async function logBOLSubmission(data: any) {
  try {
    console.log('📝 BOL Submission Log:', {
      loadId: data.loadId,
      carrierId: data.carrierId,
      factoringCompany: data.factoringCompany,
      submittedAt: data.submittedAt,
      success: data.emailResult.success,
    });

    // In production, save to database audit log
  } catch (error) {
    console.error('Failed to log BOL submission:', error);
  }
}

// 📧 DEFAULT BOL EMAIL TEMPLATES
function getDefaultBOLEmail(
  bolDocument: any,
  factoringCompany: any,
  carrierInfo: any
): string {
  const accountExecutiveName =
    factoringCompany.contactName || 'Account Executive';
  const accountExecutiveTitle = factoringCompany.title || '';

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #2563eb; margin: 0;">Bill of Lading Submission</h2>
        <p style="color: #6b7280; margin: 5px 0 0 0;">Load Delivery Completed - Automated BOL Processing</p>
      </div>

      <p>Dear ${accountExecutiveName}${accountExecutiveTitle ? `, ${accountExecutiveTitle}` : ''},</p>

      <p>Please find attached the completed Bill of Lading for the following load:</p>

      <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-weight: bold; padding: 5px 0;">Load ID:</td>
            <td>${bolDocument.loadId}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 5px 0;">Route:</td>
            <td>${bolDocument.loadDetails.origin} → ${bolDocument.loadDetails.destination}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 5px 0;">Amount:</td>
            <td>$${bolDocument.loadDetails.loadAmount?.toLocaleString() || '0'}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 5px 0;">Delivered:</td>
            <td>${new Date(bolDocument.deliveryCompleted).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 5px 0;">Driver:</td>
            <td>${bolDocument.driverSignature}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; padding: 5px 0;">Receiver:</td>
            <td>${bolDocument.receiverInfo.name}</td>
          </tr>
        </table>
      </div>

      <div style="background: #dbeafe; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h3 style="color: #1e40af; margin: 0 0 10px 0;">Carrier Information</h3>
        <p style="margin: 0;"><strong>Company:</strong> ${carrierInfo.name}</p>
        <p style="margin: 0;"><strong>MC Number:</strong> ${carrierInfo.mcNumber}</p>
        <p style="margin: 0;"><strong>Contact:</strong> ${bolDocument.carrierInfo.contact}</p>
        <p style="margin: 0;"><strong>Phone:</strong> ${bolDocument.carrierInfo.phone}</p>
      </div>

      <p>This load has been successfully delivered and all required documentation is attached.</p>

      <p>Please process this invoice according to our factoring agreement:</p>
      <ul>
        <li>Factor Rate: ${factoringCompany.rate}%</li>
        <li>Advance Rate: ${factoringCompany.advanceRate}%</li>
        <li>Expected Advance: $${((bolDocument.loadDetails.loadAmount || 0) * (factoringCompany.advanceRate / 100)).toFixed(2)}</li>
      </ul>

      <p>As always, thank you for your partnership and prompt processing of our invoices. If you need any additional documentation or have questions about this load, please contact our dispatch team at ${bolDocument.carrierInfo.phone} or reach out to me directly.</p>

      <p>Best regards,<br>
      ${bolDocument.carrierInfo.contact}<br>
      ${carrierInfo.name}<br>
      Phone: ${bolDocument.carrierInfo.phone}<br>
      <em>Account Executive: ${accountExecutiveName}</em></p>

      <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 15px; color: #6b7280; font-size: 12px;">
        <p>This is an automated submission from FleetFlow Driver OTR system.</p>
      </div>
    </div>
  `;
}

function getDefaultBOLEmailText(
  bolDocument: any,
  factoringCompany: any,
  carrierInfo: any
): string {
  const accountExecutiveName =
    factoringCompany.contactName || 'Account Executive';
  const accountExecutiveTitle = factoringCompany.title || '';

  return `
Bill of Lading Submission - Load Delivery Completed

Dear ${accountExecutiveName}${accountExecutiveTitle ? `, ${accountExecutiveTitle}` : ''},

Please find attached the completed Bill of Lading for the following load:

Load Details:
- Load ID: ${bolDocument.loadId}
- Route: ${bolDocument.loadDetails.origin} → ${bolDocument.loadDetails.destination}
- Amount: $${bolDocument.loadDetails.loadAmount?.toLocaleString() || '0'}
- Delivered: ${new Date(bolDocument.deliveryCompleted).toLocaleDateString()}
- Driver: ${bolDocument.driverSignature}
- Receiver: ${bolDocument.receiverInfo.name}

Carrier Information:
- Company: ${carrierInfo.name}
- MC Number: ${carrierInfo.mcNumber}
- Contact: ${bolDocument.carrierInfo.contact}
- Phone: ${bolDocument.carrierInfo.phone}

This load has been successfully delivered and all required documentation is attached.

Please process this invoice according to our factoring agreement:
- Factor Rate: ${factoringCompany.rate}%
- Advance Rate: ${factoringCompany.advanceRate}%
- Expected Advance: $${((bolDocument.loadDetails.loadAmount || 0) * (factoringCompany.advanceRate / 100)).toFixed(2)}

As always, thank you for your partnership and prompt processing of our invoices. If you need any additional documentation or have questions about this load, please contact our dispatch team at ${bolDocument.carrierInfo.phone} or reach out to me directly.

Best regards,
${bolDocument.carrierInfo.contact}
${carrierInfo.name}
Phone: ${bolDocument.carrierInfo.phone}
Account Executive: ${accountExecutiveName}

This is an automated submission from FleetFlow Driver OTR system.
  `;
}
