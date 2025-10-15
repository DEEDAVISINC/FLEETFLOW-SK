export async function parseLRAFPDF(
  buffer: Buffer,
  agency: string,
  agencyCode: string
): Promise<any[]> {
  console.log(`📄 Parsing PDF for ${agency}...`);

  try {
    // Use pdfjs-dist for parsing
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const loadingTask = pdfjsLib.getDocument({ data: buffer });
    const pdfDocument = await loadingTask.promise;

    let fullText = '';
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    console.log(`✅ Extracted ${fullText.length} characters from PDF`);

    // Parse opportunities from text
    return parseOpportunitiesFromText(fullText, agency, agencyCode);
  } catch (error) {
    console.error(`❌ Error parsing PDF:`, error);
    return [];
  }
}

function parseOpportunitiesFromText(
  text: string,
  agency: string,
  agencyCode: string
): any[] {
  const opportunities: any[] = [];
  const lines = text.split('\n');

  let currentOpportunity: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Look for NAICS codes (6 digits)
    const naicsMatch = line.match(/\b(\d{6})\b/);

    // Look for dollar amounts
    const valueMatch = line.match(
      /\$[\d,]+(?:\.\d{2})?(?:[MK]|Million|Thousand)?/i
    );

    // Look for fiscal years
    const fyMatch = line.match(/FY\s*(\d{4})|Fiscal\s+Year\s+(\d{4})/i);

    // Look for quarters
    const quarterMatch = line.match(/Q([1-4])/i);

    // Look for set-aside types
    const setAsideMatch = line.match(
      /WOSB|8\(a\)|HUBZone|SDVOSB|Small\s+Business|Total\s+Small\s+Business/i
    );

    // If line has meaningful procurement content (length > 30 chars and has keywords)
    if (
      line.length > 30 &&
      (line.toLowerCase().includes('acquisition') ||
        line.toLowerCase().includes('procurement') ||
        line.toLowerCase().includes('contract') ||
        naicsMatch ||
        valueMatch)
    ) {
      // Start new opportunity
      if (currentOpportunity && currentOpportunity.title) {
        opportunities.push(currentOpportunity);
      }

      currentOpportunity = {
        source: 'lraf_upload',
        agency,
        agency_code: agencyCode,
        title: line.substring(0, 200),
        description: line.substring(0, 500),
        naics_code: naicsMatch ? naicsMatch[1] : null,
        estimated_value: valueMatch ? parseValue(valueMatch[0]) : null,
        fiscal_year: fyMatch ? fyMatch[1] || fyMatch[2] : null,
        fiscal_quarter: quarterMatch ? quarterMatch[0] : null,
        small_business_set_aside: setAsideMatch ? setAsideMatch[0] : null,
        wosb_eligible:
          setAsideMatch?.[0]?.toLowerCase().includes('wosb') || false,
        scanned_at: new Date().toISOString(),
        forecast_confidence: 'medium',
      };
    } else if (currentOpportunity) {
      // Append to current opportunity description
      if (!naicsMatch && !valueMatch && line.length > 20) {
        currentOpportunity.description += ' ' + line.substring(0, 300);
      }

      // Update fields if found
      if (naicsMatch && !currentOpportunity.naics_code) {
        currentOpportunity.naics_code = naicsMatch[1];
      }
      if (valueMatch && !currentOpportunity.estimated_value) {
        currentOpportunity.estimated_value = parseValue(valueMatch[0]);
      }
      if (fyMatch && !currentOpportunity.fiscal_year) {
        currentOpportunity.fiscal_year = fyMatch[1] || fyMatch[2];
      }
      if (setAsideMatch && !currentOpportunity.small_business_set_aside) {
        currentOpportunity.small_business_set_aside = setAsideMatch[0];
        currentOpportunity.wosb_eligible = setAsideMatch[0]
          .toLowerCase()
          .includes('wosb');
      }
    }
  }

  // Push last opportunity
  if (currentOpportunity && currentOpportunity.title) {
    opportunities.push(currentOpportunity);
  }

  console.log(`🔍 Found ${opportunities.length} opportunities in text`);
  return opportunities;
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
