import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const agency = formData.get('agency') as string;
    const agencyCode = formData.get('agencyCode') as string;
    const fiscalYear = formData.get('fiscalYear') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type (PDF or Excel)
    const validTypes = [
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File must be PDF or Excel format (.pdf, .xls, .xlsx)' },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 50MB' },
        { status: 400 }
      );
    }

    console.log(`📄 Processing ${file.name} (${file.type}) for ${agency}...`);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine file type and parse
    let opportunities = [];

    if (file.type === 'application/pdf') {
      // Import the PDF parser
      const { parseLRAFPDF } = await import('@/app/services/LRAFPDFParser');
      opportunities = await parseLRAFPDF(buffer, agency, agencyCode || agency);
    } else {
      // Excel file
      const { parseLRAFExcel } = await import('@/app/services/LRAFExcelParser');
      opportunities = await parseLRAFExcel(
        buffer,
        agency,
        agencyCode || agency
      );
    }

    console.log(
      `✅ Extracted ${opportunities.length} opportunities from ${file.name}`
    );

    // Save to database
    if (opportunities.length > 0) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error } = await supabase
        .from('gov_contract_forecasts')
        .insert(opportunities);

      if (error) {
        console.error('❌ Error saving to database:', error);
        return NextResponse.json(
          {
            error: 'Failed to save opportunities to database',
            details: error.message,
          },
          { status: 500 }
        );
      }

      console.log(`💾 Saved ${opportunities.length} opportunities to database`);
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      agency,
      opportunitiesFound: opportunities.length,
      opportunities: opportunities.slice(0, 5), // Return first 5 as preview
      message: `Successfully extracted ${opportunities.length} opportunities from ${agency} LRAF document`,
    });
  } catch (error: any) {
    console.error('❌ LRAF upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process LRAF document', details: error.message },
      { status: 500 }
    );
  }
}
