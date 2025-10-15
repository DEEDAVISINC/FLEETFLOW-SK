/**
 * LRAF Web Scraper Service
 * Automatically scrapes and parses Federal Agency Long Range Acquisition Forecasts
 * Handles HTML, PDF, and Excel formats from various agencies
 */

import * as cheerio from 'cheerio';

interface LRAFSource {
  id: string;
  agency: string;
  agencyCode: string;
  url: string;
  format: 'html' | 'pdf' | 'excel' | 'json';
  priority: 'critical' | 'high' | 'medium';
  active: boolean;
  transportation_relevant: boolean;
}

interface ScrapedOpportunity {
  title: string;
  description?: string;
  naicsCode?: string;
  estimatedValue?: number;
  fiscalYear?: string;
  fiscalQuarter?: string;
  predictedPostDate?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  setAside?: string;
  placeOfPerformance?: string;
}

export class LRAFWebScraper {
  /**
   * Scrape HTML-based LRAF pages
   */
  async scrapeHTML(url: string, agency: string): Promise<ScrapedOpportunity[]> {
    try {
      console.log(`🌐 Fetching HTML from ${agency}: ${url}`);

      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (!response.ok) {
        console.warn(`⚠️ ${agency} returned status ${response.status}`);
        return [];
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      const opportunities: ScrapedOpportunity[] = [];

      // AGGRESSIVE PARSING - Look for ANY content that might be LRAF data
      console.log(`📄 Parsing HTML content (${html.length} chars)...`);

      // First, try to find tables with procurement/acquisition data
      $('table').each((tableIndex, table) => {
        const $table = $(table);
        const tableText = $table.text().toLowerCase();

        // Check if this table contains acquisition/procurement keywords
        if (
          tableText.includes('acquisition') ||
          tableText.includes('procurement') ||
          tableText.includes('forecast') ||
          tableText.includes('opportunity') ||
          tableText.includes('contract') ||
          tableText.includes('rfp') ||
          tableText.includes('solicitation')
        ) {
          console.log(`📋 Found potential LRAF table ${tableIndex + 1}`);

          $table.find('tr').each((rowIndex, row) => {
            if (rowIndex === 0) return; // Skip header row

            const $row = $(row);
            const cells = $row
              .find('td, th')
              .map((i, cell) => $(cell).text().trim())
              .get();

            if (cells.length >= 2) {
              const rowText = cells.join(' ');

              // Look for meaningful content (not just headers)
              if (
                rowText.length > 20 &&
                !rowText.toLowerCase().includes('header') &&
                !rowText.toLowerCase().includes('column')
              ) {
                opportunities.push({
                  title:
                    cells[0]?.substring(0, 200) ||
                    `${agency} Acquisition Opportunity`,
                  description:
                    cells.slice(1).join(' ').substring(0, 500) || undefined,
                  naicsCode: rowText.match(/\b\d{6}\b/)?.[0],
                  estimatedValue: this.parseValue(rowText),
                  fiscalYear:
                    rowText.match(/FY\s*(\d{4})|20\d{2}/i)?.[1] ||
                    new Date().getFullYear().toString(),
                  fiscalQuarter: rowText.match(/Q([1-4])/i)?.[0],
                  contactEmail: rowText.match(/[\w.+-]+@[\w.-]+\.\w+/)?.[0],
                  setAside: rowText.match(
                    /WOSB|8\(a\)|HUBZone|SDVOSB|small\s+business/i
                  )?.[0],
                });
              }
            }
          });
        }
      });

      // NO LOOSE CONTENT MATCHING - Only return data from actual structured tables

      // NO MOCK DATA - Only return real structured data from actual forecast documents

      console.log(
        `✅ ${agency}: Scraped ${opportunities.length} opportunities`
      );
      return opportunities;
    } catch (error) {
      console.error(`❌ Error scraping ${agency}:`, error);
      return [];
    }
  }

  /**
   * Scrape PDF-based LRAF documents
   */
  async scrapePDF(url: string, agency: string): Promise<ScrapedOpportunity[]> {
    try {
      console.log(`📄 Fetching PDF from ${agency}: ${url}`);

      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`⚠️ ${agency} PDF returned status ${response.status}`);
        return [];
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Parse PDF using pdfjs-dist (works in Edge runtime)
      console.log(`📄 Parsing PDF with pdfjs-dist from ${agency}...`);

      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdfDocument = await loadingTask.promise;

      let fullText = '';
      for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      console.log(`📄 Extracted ${fullText.length} characters from PDF...`);

      // Extract opportunities from PDF text
      const opportunities: ScrapedOpportunity[] = [];
      const lines = fullText.split('\n');

      let currentOpp: Partial<ScrapedOpportunity> | null = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Look for opportunity titles (usually capitalized lines with certain keywords)
        if (
          line.match(
            /transport|freight|logistics|delivery|supply|distribution/i
          ) &&
          line.length > 20 &&
          line.length < 200
        ) {
          // Save previous opportunity
          if (currentOpp?.title) {
            opportunities.push(currentOpp as ScrapedOpportunity);
          }

          // Start new opportunity
          currentOpp = {
            title: line,
            ...this.parseOpportunityText(lines.slice(i, i + 10).join(' ')),
          };
        }

        // Extract data for current opportunity
        if (currentOpp) {
          const emailMatch = line.match(/[\w.+-]+@[\w.-]+\.\w+/);
          if (emailMatch) currentOpp.contactEmail = emailMatch[0];

          const naicsMatch = line.match(/\b\d{6}\b/);
          if (naicsMatch) currentOpp.naicsCode = naicsMatch[0];

          const valueMatch = line.match(/\$[\d,]+/);
          if (valueMatch)
            currentOpp.estimatedValue = parseInt(
              valueMatch[0].replace(/[$,]/g, '')
            );
        }
      }

      // Save last opportunity
      if (currentOpp?.title) {
        opportunities.push(currentOpp as ScrapedOpportunity);
      }

      console.log(
        `✅ ${agency} PDF: Extracted ${opportunities.length} opportunities`
      );
      return opportunities;
    } catch (error) {
      console.error(`❌ Error scraping PDF for ${agency}:`, error);
      return [];
    }
  }

  /**
   * Scrape Excel-based LRAF files
   */
  async scrapeExcel(
    url: string,
    agency: string
  ): Promise<ScrapedOpportunity[]> {
    try {
      console.log(`📊 Fetching Excel from ${agency}: ${url}`);

      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`⚠️ ${agency} Excel returned status ${response.status}`);
        return [];
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Parse Excel
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(buffer, { type: 'buffer' });

      const opportunities: ScrapedOpportunity[] = [];

      // Process each sheet
      workbook.SheetNames.forEach((sheetName) => {
        console.log(`📊 Parsing sheet: ${sheetName} from ${agency}...`);
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        }) as any[][];

        if (rows.length === 0) return;

        // Find header row
        const headerRowIndex = rows.findIndex((row) =>
          row.some((cell) =>
            String(cell).match(/title|description|requirement|opportunity/i)
          )
        );

        if (headerRowIndex === -1) return;

        const headers = rows[headerRowIndex].map((h) =>
          String(h || '').toLowerCase()
        );
        const titleIndex = headers.findIndex((h) =>
          h.match(/title|description|requirement/i)
        );
        const naicsIndex = headers.findIndex((h) => h.match(/naics/i));
        const valueIndex = headers.findIndex((h) =>
          h.match(/value|amount|\$/i)
        );
        const fyIndex = headers.findIndex((h) => h.match(/fiscal|fy|year/i));
        const qIndex = headers.findIndex((h) => h.match(/quarter|q[1-4]/i));
        const emailIndex = headers.findIndex((h) => h.match(/email|contact/i));
        const setAsideIndex = headers.findIndex((h) =>
          h.match(/set.?aside|wosb|8\(a\)/i)
        );

        // Process data rows
        for (let i = headerRowIndex + 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          const title =
            titleIndex >= 0 ? String(row[titleIndex] || '').trim() : '';
          if (!title || title.length < 10) continue;

          const rowText = row.join(' ');

          opportunities.push({
            title: title.substring(0, 200),
            naicsCode:
              naicsIndex >= 0
                ? String(row[naicsIndex] || '')
                : this.parseOpportunityText(rowText).naicsCode,
            estimatedValue:
              valueIndex >= 0
                ? this.parseValue(String(row[valueIndex] || ''))
                : undefined,
            fiscalYear: fyIndex >= 0 ? String(row[fyIndex] || '') : undefined,
            fiscalQuarter: qIndex >= 0 ? String(row[qIndex] || '') : undefined,
            contactEmail:
              emailIndex >= 0
                ? String(row[emailIndex] || '')
                : this.parseOpportunityText(rowText).contactEmail,
            setAside:
              setAsideIndex >= 0 ? String(row[setAsideIndex] || '') : undefined,
          });
        }
      });

      console.log(
        `✅ ${agency} Excel: Extracted ${opportunities.length} opportunities`
      );
      return opportunities;
    } catch (error) {
      console.error(`❌ Error scraping Excel for ${agency}:`, error);
      return [];
    }
  }

  /**
   * Auto-detect format and scrape accordingly
   */
  async autoScrape(source: LRAFSource): Promise<ScrapedOpportunity[]> {
    console.log(`🔍 Auto-scraping ${source.agency} at ${source.url}`);
    const url = source.url.toLowerCase();

    try {
      if (url.includes('.pdf')) {
        console.log(`  → Direct PDF link detected for ${source.agency}`);
        return await this.scrapePDF(source.url, source.agency);
      } else if (
        url.includes('.xlsx') ||
        url.includes('.xls') ||
        url.includes('excel')
      ) {
        console.log(`  → Direct Excel link detected for ${source.agency}`);
        return await this.scrapeExcel(source.url, source.agency);
      } else {
        // Landing page - find PDF/Excel links first
        console.log(
          `  → Landing page detected, searching for document links...`
        );
        const documentLinks = await this.findDocumentLinks(
          source.url,
          source.agency
        );

        if (documentLinks.length > 0) {
          console.log(`  → Found ${documentLinks.length} document link(s)`);

          // Try each document link
          for (const docLink of documentLinks) {
            const opportunities = await this.scrapeDocument(
              docLink,
              source.agency
            );
            if (opportunities.length > 0) {
              return opportunities; // Return first successful parse
            }
          }

          console.log(
            `  → No data found in ${documentLinks.length} document(s)`
          );
        }

        // Fallback to HTML scraping if no documents found
        console.log(`  → No documents found, trying HTML table scraping...`);
        return await this.scrapeHTML(source.url, source.agency);
      }
    } catch (error) {
      console.error(`❌ autoScrape failed for ${source.agency}:`, error);
      return [];
    }
  }

  /**
   * Find PDF/Excel document links on a landing page
   */
  private async findDocumentLinks(
    url: string,
    agency: string
  ): Promise<string[]> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (!response.ok) return [];

      const html = await response.text();
      const $ = cheerio.load(html);
      const links: string[] = [];

      // Find all links that point to PDF, Excel, or forecast documents
      $('a[href]').each((index, element) => {
        const href = $(element).attr('href');
        if (!href) return;

        const linkText = $(element).text().toLowerCase();
        const hrefLower = href.toLowerCase();

        // Look for forecast/acquisition documents
        const isForecastLink =
          linkText.includes('forecast') ||
          linkText.includes('acquisition') ||
          linkText.includes('lraf') ||
          linkText.includes('procurement') ||
          hrefLower.includes('forecast') ||
          hrefLower.includes('acquisition') ||
          hrefLower.includes('lraf');

        const isDocument =
          hrefLower.endsWith('.pdf') ||
          hrefLower.endsWith('.xlsx') ||
          hrefLower.endsWith('.xls') ||
          hrefLower.includes('.pdf') ||
          hrefLower.includes('.xlsx') ||
          hrefLower.includes('.xls');

        if (isForecastLink && isDocument) {
          // Convert relative URLs to absolute
          let absoluteUrl = href;
          if (href.startsWith('/')) {
            const baseUrl = new URL(url);
            absoluteUrl = `${baseUrl.protocol}//${baseUrl.host}${href}`;
          } else if (!href.startsWith('http')) {
            absoluteUrl = new URL(href, url).href;
          }

          links.push(absoluteUrl);
          console.log(
            `  → Found document: ${linkText.substring(0, 50)} - ${absoluteUrl}`
          );
        }
      });

      return links;
    } catch (error) {
      console.error(`❌ Error finding document links for ${agency}:`, error);
      return [];
    }
  }

  /**
   * Scrape a document (PDF or Excel) based on URL
   */
  private async scrapeDocument(
    url: string,
    agency: string
  ): Promise<ScrapedOpportunity[]> {
    const urlLower = url.toLowerCase();

    if (urlLower.includes('.pdf')) {
      return await this.scrapePDF(url, agency);
    } else if (urlLower.includes('.xlsx') || urlLower.includes('.xls')) {
      return await this.scrapeExcel(url, agency);
    }

    return [];
  }

  /**
   * Parse common LRAF text patterns
   */
  parseOpportunityText(text: string): Partial<ScrapedOpportunity> {
    return {
      naicsCode: text.match(/\b\d{6}\b/)?.[0],
      estimatedValue: this.parseValue(text),
      fiscalYear: text.match(/FY\s*(\d{4})/i)?.[1],
      fiscalQuarter: text.match(/Q([1-4])/i)?.[0],
      contactEmail: text.match(/[\w.+-]+@[\w.-]+\.\w+/)?.[0],
      setAside: text.match(/WOSB|8\(a\)|HUBZone|SDVOSB/i)?.[0],
    };
  }

  private parseValue(text: string): number | undefined {
    const match = text.match(/\$?([\d,]+(?:\.\d{2})?)\s*(?:million|M)?/i);
    if (!match) return undefined;

    const value = parseFloat(match[1].replace(/,/g, ''));
    const isMillion = /million|M/i.test(match[0]);

    return isMillion ? value * 1000000 : value;
  }
}

export const lrafWebScraper = new LRAFWebScraper();
