import { UserOrganizationProfile } from './route';
const pdfParse = require('pdf-parse-fork');

export interface ExtractedCompanyProfile {
  pastPerformance?: string[];
  certifications?: string[];
  companyDescription?: string;
  experience?: string;
  qualifications?: string;
  references?: Array<{
    client: string;
    project: string;
    value?: string;
    date?: string;
  }>;
  rawText: string;
}

/**
 * Extract company profile information from uploaded document
 */
export async function extractCompanyProfileFromDocument(
  documentBuffer: Buffer,
  fileName: string,
  userProfile: UserOrganizationProfile
): Promise<ExtractedCompanyProfile> {
  // Extract text from document
  const extractedText = await extractTextFromDocument(documentBuffer, fileName);

  // Parse the extracted text for company information
  const profile = parseCompanyProfileText(extractedText, userProfile);

  return {
    ...profile,
    rawText: extractedText,
  };
}

/**
 * Extract text from various document formats
 */
async function extractTextFromDocument(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const fileExtension = fileName.toLowerCase().split('.').pop();

  switch (fileExtension) {
    case 'pdf':
      return await extractTextFromPDF(buffer);
    case 'docx':
      return await extractTextFromDOCX(buffer);
    case 'doc':
      return await extractTextFromDOC(buffer);
    case 'txt':
      return buffer.toString('utf-8');
    default:
      // Try PDF extraction as fallback
      try {
        return await extractTextFromPDF(buffer);
      } catch {
        return buffer.toString('utf-8');
      }
  }
}

/**
 * Extract text from PDF documents
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF document');
  }
}

/**
 * Extract text from DOCX documents (simplified - would need mammoth or similar library)
 */
async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  // For now, return a placeholder. In production, you'd use a library like mammoth
  console.warn('DOCX extraction not fully implemented - returning raw text');
  return buffer.toString('utf-8');
}

/**
 * Extract text from DOC documents (simplified)
 */
async function extractTextFromDOC(buffer: Buffer): Promise<string> {
  // For now, return a placeholder. In production, you'd use a library like mammoth
  console.warn('DOC extraction not fully implemented - returning raw text');
  return buffer.toString('utf-8');
}

/**
 * Parse extracted text to find company profile information
 */
function parseCompanyProfileText(
  text: string,
  userProfile: UserOrganizationProfile
): Omit<ExtractedCompanyProfile, 'rawText'> {
  const result: Omit<ExtractedCompanyProfile, 'rawText'> = {};

  // Extract past performance information
  result.pastPerformance = extractPastPerformance(text);

  // Extract certifications
  result.certifications = extractCertifications(text);

  // Extract company description
  result.companyDescription = extractCompanyDescription(text, userProfile);

  // Extract experience information
  result.experience = extractExperience(text);

  // Extract qualifications
  result.qualifications = extractQualifications(text);

  // Extract references
  result.references = extractReferences(text);

  return result;
}

/**
 * Extract past performance information
 */
function extractPastPerformance(text: string): string[] {
  const performance: string[] = [];
  const lines = text.split('\n');

  let inPerformanceSection = false;
  let currentProject = '';

  for (const line of lines) {
    const lowerLine = line.toLowerCase().trim();

    // Look for section headers
    if (
      lowerLine.includes('past performance') ||
      lowerLine.includes('experience') ||
      lowerLine.includes('projects') ||
      lowerLine.includes('references')
    ) {
      inPerformanceSection = true;
      continue;
    }

    // Look for project indicators
    if (inPerformanceSection) {
      if (
        lowerLine.includes('project:') ||
        lowerLine.includes('client:') ||
        lowerLine.includes('contract:') ||
        /^\d+\./.test(line.trim()) || // Numbered lists
        /^[•\-\*]/.test(line.trim())
      ) {
        // Bullet points

        if (currentProject && line.trim().length > 10) {
          performance.push(currentProject.trim());
          currentProject = line.trim();
        } else if (line.trim().length > 10) {
          currentProject = line.trim();
        }
      } else if (currentProject && line.trim().length > 0) {
        currentProject += ' ' + line.trim();
      }
    }

    // End section if we hit another major section
    if (
      inPerformanceSection &&
      (lowerLine.includes('qualifications') ||
        lowerLine.includes('certifications') ||
        lowerLine.includes('education'))
    ) {
      if (currentProject) {
        performance.push(currentProject.trim());
      }
      break;
    }
  }

  // Add final project if exists
  if (currentProject) {
    performance.push(currentProject.trim());
  }

  return performance.filter((p) => p.length > 20); // Filter out very short entries
}

/**
 * Extract certifications from text
 */
function extractCertifications(text: string): string[] {
  const certifications: string[] = [];
  const lines = text.split('\n');

  let inCertSection = false;

  for (const line of lines) {
    const lowerLine = line.toLowerCase().trim();

    // Look for certification section
    if (
      lowerLine.includes('certification') ||
      lowerLine.includes('license') ||
      lowerLine.includes('credential')
    ) {
      inCertSection = true;
      continue;
    }

    if (inCertSection) {
      // Look for certification entries
      if (
        line.trim().length > 3 &&
        (line.includes('Certified') ||
          line.includes('License') ||
          line.includes('Registration') ||
          /^[•\-\*]/.test(line.trim()) ||
          /^\d+\./.test(line.trim()))
      ) {
        const cert = line.trim().replace(/^[•\-\*\d\.\s]+/, '');
        if (cert.length > 3) {
          certifications.push(cert);
        }
      }

      // End section
      if (
        lowerLine.includes('experience') ||
        lowerLine.includes('education') ||
        lowerLine.includes('skill')
      ) {
        break;
      }
    }
  }

  return certifications;
}

/**
 * Extract company description
 */
function extractCompanyDescription(
  text: string,
  userProfile: UserOrganizationProfile
): string {
  const lines = text.split('\n');
  let description = '';

  // Look for company overview or about sections
  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    if (
      lowerLine.includes('company overview') ||
      lowerLine.includes('about') ||
      lowerLine.includes('overview') ||
      lowerLine.includes(userProfile.companyName.toLowerCase())
    ) {
      // Get the next few lines as description
      const startIndex = lines.indexOf(line);
      for (
        let i = startIndex;
        i < Math.min(startIndex + 10, lines.length);
        i++
      ) {
        const descLine = lines[i].trim();
        if (
          descLine.length > 20 &&
          !descLine.toLowerCase().includes('copyright')
        ) {
          description += descLine + ' ';
        }
      }
      break;
    }
  }

  return (
    description.trim() ||
    `Professional ${userProfile.companyType.replace('_', ' ')} specializing in transportation and logistics services.`
  );
}

/**
 * Extract experience information
 */
function extractExperience(text: string): string {
  const lines = text.split('\n');
  let experience = '';
  let inExperienceSection = false;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    if (lowerLine.includes('experience') && lowerLine.includes('year')) {
      inExperienceSection = true;
      experience += line.trim() + ' ';
      continue;
    }

    if (inExperienceSection) {
      if (
        line.trim().length > 10 &&
        !lowerLine.includes('education') &&
        !lowerLine.includes('certification')
      ) {
        experience += line.trim() + ' ';
      } else if (
        lowerLine.includes('education') ||
        lowerLine.includes('certification')
      ) {
        break;
      }
    }
  }

  return (
    experience.trim() ||
    '5+ years of experience in transportation and logistics.'
  );
}

/**
 * Extract qualifications
 */
function extractQualifications(text: string): string {
  const lines = text.split('\n');
  let qualifications = '';
  let inQualSection = false;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    if (
      lowerLine.includes('qualification') ||
      lowerLine.includes('capability')
    ) {
      inQualSection = true;
      continue;
    }

    if (inQualSection) {
      if (line.trim().length > 10) {
        qualifications += line.trim() + ' ';
      }

      if (
        lowerLine.includes('experience') ||
        lowerLine.includes('certification')
      ) {
        break;
      }
    }
  }

  return (
    qualifications.trim() ||
    'Fully qualified transportation service provider meeting all industry standards.'
  );
}

/**
 * Extract references from text
 */
function extractReferences(text: string): Array<{
  client: string;
  project: string;
  value?: string;
  date?: string;
}> {
  const references: Array<{
    client: string;
    project: string;
    value?: string;
    date?: string;
  }> = [];

  const lines = text.split('\n');
  let currentRef: any = null;

  for (const line of lines) {
    const lowerLine = line.toLowerCase().trim();

    // Look for reference entries
    if (
      lowerLine.includes('reference') ||
      lowerLine.includes('client:') ||
      lowerLine.includes('project:')
    ) {
      if (currentRef) {
        references.push(currentRef);
      }

      currentRef = { client: '', project: '' };
    }

    if (currentRef) {
      if (lowerLine.startsWith('client:') || lowerLine.includes('client:')) {
        currentRef.client = line.split(':')[1]?.trim() || line.trim();
      } else if (
        lowerLine.startsWith('project:') ||
        lowerLine.includes('project:')
      ) {
        currentRef.project = line.split(':')[1]?.trim() || line.trim();
      } else if (lowerLine.includes('$') || lowerLine.includes('value:')) {
        currentRef.value = line.replace(/value:/i, '').trim();
      } else if (lowerLine.match(/\d{1,2}\/\d{1,2}\/\d{4}|\d{4}/)) {
        currentRef.date = line.trim();
      } else if (line.trim().length > 10 && !currentRef.client) {
        currentRef.client = line.trim();
      } else if (line.trim().length > 10 && !currentRef.project) {
        currentRef.project = line.trim();
      }
    }
  }

  // Add final reference
  if (currentRef && (currentRef.client || currentRef.project)) {
    references.push(currentRef);
  }

  return references.filter((ref) => ref.client || ref.project);
}
