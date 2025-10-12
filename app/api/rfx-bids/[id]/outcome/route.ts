import { NextRequest, NextResponse } from 'next/server';

// PATCH /api/rfx-bids/[id]/outcome - Update bid outcome (won/lost/no_response)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate outcome
    const validOutcomes = ['won', 'lost', 'no_response', 'cancelled'];
    if (!body.outcome || !validOutcomes.includes(body.outcome)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid outcome. Must be one of: ${validOutcomes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    console.log('🎯 Updating RFX bid outcome:', {
      bidId: id,
      outcome: body.outcome,
      contractValue: body.contractValue,
      notes: body.notes,
    });

    // TODO: When database is connected, update the bid response
    // const pool = getDbPool();
    // const query = `
    //   UPDATE rfx_bid_responses
    //   SET
    //     outcome = $1,
    //     outcome_notes = $2,
    //     contract_value = $3,
    //     status = CASE
    //       WHEN $1 = 'won' THEN 'won'
    //       WHEN $1 = 'lost' THEN 'lost'
    //       ELSE status
    //     END,
    //     updated_at = NOW()
    //   WHERE id = $4
    //   RETURNING *
    // `;
    //
    // const result = await pool.query(query, [
    //   body.outcome,
    //   body.notes || null,
    //   body.contractValue || null,
    //   id
    // ]);

    return NextResponse.json({
      success: true,
      message: `Bid outcome updated to "${body.outcome}" (mock mode - database connection required)`,
      data: {
        bidId: id,
        outcome: body.outcome,
        outcomeNotes: body.notes,
        contractValue: body.contractValue,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating RFX bid outcome:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update bid outcome',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
