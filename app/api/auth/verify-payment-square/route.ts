import { NextRequest, NextResponse } from 'next/server';
import { SquareService } from '../../../services/SquareService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      cardNumber,
      expiryMonth,
      expiryYear,
      cvc,
      billingName,
      billingAddress,
      billingCity,
      billingState,
      billingZip,
    } = body;

    // Validate required fields
    if (
      !cardNumber ||
      !expiryMonth ||
      !expiryYear ||
      !cvc ||
      !billingName ||
      !billingAddress ||
      !billingZip
    ) {
      return NextResponse.json(
        { success: false, message: 'Missing required payment information' },
        { status: 400 }
      );
    }

    const squareService = new SquareService();

    // Tokenize the card details using Square SDK
    const tokenResult = await squareService.tokenizeCard({
      cardNumber: cardNumber.replace(/\s/g, ''),
      expiryMonth: parseInt(expiryMonth),
      expiryYear: parseInt(expiryYear),
      cvc,
      billingAddress: {
        addressLine1: billingAddress,
        locality: billingCity,
        administrativeDistrictLevel1: billingState,
        postalCode: billingZip,
        country: 'US',
      },
      cardholderName: billingName,
    });

    if (!tokenResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: tokenResult.message || 'Card validation failed',
        },
        { status: 400 }
      );
    }

    // Card tokenization is sufficient for verification
    // The tokenization process validates the card details
    console.info('Card successfully tokenized and verified:', {
      cardLast4: cardNumber.slice(-4),
      cardBrand: tokenResult.cardBrand || 'UNKNOWN',
    });

    return NextResponse.json({
      success: true,
      message: 'Payment method verified successfully',
      paymentMethodId: tokenResult.cardToken,
      cardLast4: cardNumber.slice(-4),
      cardBrand: tokenResult.cardBrand || 'UNKNOWN',
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          'Payment verification failed. Please check your card details and try again.',
      },
      { status: 500 }
    );
  }
}
