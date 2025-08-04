/**
 * Port Appointment Booking API Route
 *
 * Handles truck appointment booking, cancellation, and management
 * for major US port authorities
 *
 * Endpoints:
 * POST /api/port-appointments - Book new appointment
 * PUT /api/port-appointments - Update existing appointment
 * DELETE /api/port-appointments - Cancel appointment
 * GET /api/port-appointments - Get appointment status
 */

import { NextResponse } from 'next/server';
import { portAuthoritySystemsService } from '../../services/PortAuthoritySystemsService';

export async function POST(request: Request) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case 'book_appointment':
        const { portCode, appointmentData } = data;

        // Validate required fields
        if (!portCode || !appointmentData) {
          return NextResponse.json(
            { success: false, error: 'Missing required fields' },
            { status: 400 }
          );
        }

        // Validate appointment data
        const requiredFields = [
          'terminalId',
          'driverLicense',
          'twicCard',
          'appointmentTime',
          'operationType',
        ];
        for (const field of requiredFields) {
          if (!appointmentData[field]) {
            return NextResponse.json(
              { success: false, error: `Missing required field: ${field}` },
              { status: 400 }
            );
          }
        }

        const bookingResult =
          await portAuthoritySystemsService.bookTruckAppointment(
            portCode,
            appointmentData
          );

        return NextResponse.json({
          success: bookingResult.success,
          data: bookingResult.success
            ? {
                appointmentId: bookingResult.appointmentId,
                confirmationNumber: bookingResult.confirmationNumber,
                gateInfo: bookingResult.gateInfo,
              }
            : null,
          error: bookingResult.error,
          timestamp: new Date().toISOString(),
        });

      case 'get_available_slots':
        const { portCode: slotPortCode, terminalId, date } = data;

        if (!slotPortCode || !terminalId || !date) {
          return NextResponse.json(
            {
              success: false,
              error: 'Missing required fields for slot availability',
            },
            { status: 400 }
          );
        }

        const slotsResult =
          await portAuthoritySystemsService.getAvailableAppointmentSlots(
            slotPortCode,
            terminalId,
            date
          );

        return NextResponse.json({
          success: slotsResult.success,
          data: slotsResult.availableSlots,
          error: slotsResult.error,
          timestamp: new Date().toISOString(),
        });

      case 'track_container':
        const { portCode: trackPortCode, containerNumber } = data;

        if (!trackPortCode || !containerNumber) {
          return NextResponse.json(
            { success: false, error: 'Missing port code or container number' },
            { status: 400 }
          );
        }

        const trackingResult = await portAuthoritySystemsService.trackContainer(
          trackPortCode,
          containerNumber
        );

        return NextResponse.json({
          success: trackingResult.success,
          data: trackingResult.containerInfo,
          error: trackingResult.error,
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Port Appointments API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const portCode = searchParams.get('portCode');
    const appointmentId = searchParams.get('appointmentId');

    if (!portCode || !appointmentId) {
      return NextResponse.json(
        { success: false, error: 'Missing port code or appointment ID' },
        { status: 400 }
      );
    }

    const cancellationResult =
      await portAuthoritySystemsService.cancelTruckAppointment(
        portCode,
        appointmentId
      );

    return NextResponse.json({
      success: cancellationResult.success,
      data: cancellationResult.success
        ? {
            cancellationFee: cancellationResult.cancellationFee,
            refundAmount: cancellationResult.refundAmount,
          }
        : null,
      error: cancellationResult.error,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Port Appointment Cancellation Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to cancel appointment',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'port_operations':
        const portCode = searchParams.get('portCode');

        if (!portCode) {
          return NextResponse.json(
            { success: false, error: 'Missing port code' },
            { status: 400 }
          );
        }

        const operations =
          await portAuthoritySystemsService.getPortOperations(portCode);

        return NextResponse.json({
          success: !!operations,
          data: operations,
          timestamp: new Date().toISOString(),
        });

      case 'truck_appointments':
        const apptPortCode = searchParams.get('portCode');
        const terminalId = searchParams.get('terminalId');

        if (!apptPortCode) {
          return NextResponse.json(
            { success: false, error: 'Missing port code' },
            { status: 400 }
          );
        }

        const appointments =
          await portAuthoritySystemsService.getTruckAppointments(
            apptPortCode,
            terminalId || undefined
          );

        return NextResponse.json({
          success: true,
          data: appointments,
          timestamp: new Date().toISOString(),
        });

      case 'container_tracking':
        const containerPortCode = searchParams.get('portCode');

        if (!containerPortCode) {
          return NextResponse.json(
            { success: false, error: 'Missing port code' },
            { status: 400 }
          );
        }

        const containerData =
          await portAuthoritySystemsService.getContainerTracking(
            containerPortCode
          );

        return NextResponse.json({
          success: !!containerData,
          data: containerData,
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Port Appointments GET API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch port data',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
