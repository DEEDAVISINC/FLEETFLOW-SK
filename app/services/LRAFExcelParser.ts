export async function parseLRAFExcel(
  buffer: Buffer,
  agency: string,
  agencyCode: string
): Promise<any[]> {
  console.log(`📊 Parsing Excel for ${agency}...`);

  try {
    const XLSX = await import('xlsx');
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    const opportunities: any[] = [];

    // Process each sheet
    for (const sheetName of workbook.SheetNames) {
      console.log(`  → Processing sheet: ${sheetName}`);
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (!Array.isArray(data) || data.length === 0) continue;

      // Find header row (usually first few rows)
      let headerRowIndex = -1;
      let headers: string[] = [];

      for (let i = 0; i < Math.min(5, data.length); i++) {
        const row = data[i] as any[];
        if (
          row.some((cell: any) =>
            String(cell)
              .toLowerCase()
              .match(/title|description|naics|value|amount|forecast/i)
          )
        ) {
          headerRowIndex = i;
          headers = row.map((h: any) => String(h || '').toLowerCase());
          break;
        }
      }

      if (headerRowIndex === -1) {
        console.log(`  ⚠️ No header row found in ${sheetName}`);
        continue;
      }

      // Map column indices
      const colMap = {
        title: headers.findIndex((h) =>
          h.match(/title|name|acquisition|project/i)
        ),
        description: headers.findIndex((h) =>
          h.match(/description|detail|scope/i)
        ),
        naics: headers.findIndex((h) => h.match(/naics/i)),
        value: headers.findIndex((h) =>
          h.match(/value|amount|estimate|dollar/i)
        ),
        fy: headers.findIndex((h) => h.match(/fiscal|fy|year/i)),
        quarter: headers.findIndex((h) => h.match(/quarter|q[1-4]/i)),
        setAside: headers.findIndex((h) =>
          h.match(/set.aside|small.business|wosb/i)
        ),
      };

      // Parse data rows
      for (let i = headerRowIndex + 1; i < data.length; i++) {
        const row = data[i] as any[];
        if (!row || row.length === 0) continue;

        const title =
          colMap.title >= 0 ? String(row[colMap.title] || '').trim() : '';
        if (!title || title.length < 10) continue;

        const valueStr =
          colMap.value >= 0 ? String(row[colMap.value] || '') : '';
        const setAsideStr =
          colMap.setAside >= 0 ? String(row[colMap.setAside] || '') : '';

        opportunities.push({
          source: 'lraf_upload',
          agency,
          agency_code: agencyCode,
          title: title.substring(0, 200),
          description:
            colMap.description >= 0
              ? String(row[colMap.description] || '').substring(0, 500)
              : title.substring(0, 500),
          naics_code:
            colMap.naics >= 0
              ? String(row[colMap.naics] || '').match(/\d{6}/)?.[0]
              : null,
          estimated_value: valueStr ? parseValue(valueStr) : null,
          fiscal_year:
            colMap.fy >= 0
              ? String(row[colMap.fy] || '').match(/\d{4}/)?.[0]
              : null,
          fiscal_quarter:
            colMap.quarter >= 0
              ? String(row[colMap.quarter] || '').match(/Q[1-4]/i)?.[0]
              : null,
          small_business_set_aside: setAsideStr || null,
          wosb_eligible: setAsideStr.toLowerCase().includes('wosb'),
          scanned_at: new Date().toISOString(),
          forecast_confidence: 'high', // Excel data is usually more structured
        });
      }
    }

    console.log(
      `✅ Extracted ${opportunities.length} opportunities from Excel`
    );
    return opportunities;
  } catch (error) {
    console.error(`❌ Error parsing Excel:`, error);
    return [];
  }
}

function parseValue(valueStr: string): number | null {
  try {
    const cleanStr = valueStr.replace(/[$,]/g, '');
    let value = parseFloat(cleanStr);

    if (
      cleanStr.toLowerCase().includes('m') ||
      cleanStr.toLowerCase().includes('million')
    ) {
      value *= 1000000;
    } else if (
      cleanStr.toLowerCase().includes('k') ||
      cleanStr.toLowerCase().includes('thousand')
    ) {
      value *= 1000;
    }

    return isNaN(value) ? null : Math.round(value);
  } catch {
    return null;
  }
}
