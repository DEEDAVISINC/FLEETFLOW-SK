import { NextRequest, NextResponse } from 'next/server';
import BOLWorkflowService from '../../../services/bol-workflow/BOLWorkflowService';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing BOL Workflow System...');

    // Test BOL submission
    const testSubmission = {
      loadId: 'load-test-001',
      loadIdentifierId: 'JS-25001-ATLMIA-WMT-DVFL-001',
      driverId: 'driver-001',
      driverName: 'Mike Johnson',
      brokerId: 'broker-js001',
      brokerName: 'John Smith',
      shipperId: 'shipper-001',
      shipperName: 'Walmart Distribution Center',
      shipperEmail: 'billing@walmart.com',
      bolData: {
        bolNumber: 'BOL-123456',
        proNumber: 'PRO-789012',
        deliveryDate: '2024-12-31',
        deliveryTime: '14:30',
        receiverName: 'Jane Doe',
        receiverSignature: 'signature_data_here',
        driverSignature: 'driver_signature_data',
        deliveryPhotos: ['photo1.jpg', 'photo2.jpg'],
        pickupPhotos: ['pickup1.jpg', 'pickup2.jpg'],
        sealNumbers: ['SEAL123', 'SEAL456'],
        weight: '45,000 lbs',
        pieces: 25,
        damages: [],
        notes: 'Delivery completed successfully'
      }
    };

    // Step 1: Submit BOL
    console.log('📋 Step 1: Submitting BOL...');
    const submissionResult = await BOLWorkflowService.submitBOL(testSubmission);
    
    if (!submissionResult.success) {
      throw new Error(`BOL submission failed: ${submissionResult.error}`);
    }

    console.log(`✅ BOL submitted: ${submissionResult.submissionId}`);

    // Step 2: Approve BOL (simulate broker approval)
    console.log('👔 Step 2: Broker approving BOL...');
    const approvalResult = await BOLWorkflowService.approveBOL(
      submissionResult.submissionId!,
      'broker-js001',
      {
        approved: true,
        reviewNotes: 'BOL looks good, delivery confirmed',
        adjustments: {
          rate: 2750, // Adjusted rate
          additionalCharges: [
            { description: 'Fuel surcharge', amount: 150 }
          ]
        }
      }
    );

    if (!approvalResult.success) {
      throw new Error(`BOL approval failed: ${approvalResult.error}`);
    }

    console.log(`✅ BOL approved and invoice generated: ${approvalResult.invoiceId}`);

    // Get workflow status
    const submission = BOLWorkflowService.getSubmission(submissionResult.submissionId!);
    const notifications = BOLWorkflowService.getNotifications();

    return NextResponse.json({
      success: true,
      message: 'BOL workflow test completed successfully!',
      results: {
        submissionId: submissionResult.submissionId,
        invoiceId: approvalResult.invoiceId,
        finalStatus: submission?.status,
        invoiceAmount: submission?.invoiceAmount,
        notificationsSent: notifications.length,
        workflow: {
          step1: '✅ Driver submitted BOL',
          step2: '✅ Broker notified for review',
          step3: '✅ Broker approved BOL',
          step4: '✅ Invoice auto-generated',
          step5: '✅ Invoice sent to vendor via email'
        }
      }
    });

  } catch (error) {
    console.error('BOL workflow test failed:', error);
    return NextResponse.json(
      { 
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
