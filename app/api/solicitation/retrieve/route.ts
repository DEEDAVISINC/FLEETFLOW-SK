import { UniversalSolicitationRetriever } from '@/app/services/UniversalSolicitationRetriever';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { title, agency, location, url, solicitationNumber } =
      await request.json();

    console.info('📥 Universal solicitation retrieval request:', {
      title,
      agency,
      location,
      url,
      solicitationNumber,
    });

    if (!title && !solicitationNumber && !agency) {
      return NextResponse.json(
        { error: 'Must provide at least title, agency, or solicitationNumber' },
        { status: 400 }
      );
    }

    const retriever = new UniversalSolicitationRetriever();

    const solicitation = await retriever.retrieveSolicitation({
      title: title || 'Unknown',
      agency: agency || 'Unknown',
      location,
      url,
      solicitationNumber,
    });

    if (!solicitation) {
      return NextResponse.json(
        { error: 'Could not retrieve solicitation from any source' },
        { status: 404 }
      );
    }

    return NextResponse.json(solicitation);
  } catch (error) {
    console.error('Universal solicitation retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve solicitation details' },
      { status: 500 }
    );
  }
}
