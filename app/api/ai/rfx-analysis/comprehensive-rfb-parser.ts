// COMPREHENSIVE GOVERNMENT RFB PARSER
// Systematically scans ENTIRE solicitation document and extracts ALL requirements
// Designed for government RFBs, RFPs, RFQs, and IFBs

export interface RFBSection {
  title: string;
  content: string;
  startIndex: number;
  endIndex: number;
}

export interface RFBRequirement {
  id: string;
  section: string;
  category:
    | 'SCOPE'
    | 'SPECIFICATIONS'
    | 'QUALIFICATIONS'
    | 'INSURANCE'
    | 'TIMELINE'
    | 'PRICING'
    | 'SUBMISSION'
    | 'TECHNICAL'
    | 'COMPLIANCE'
    | 'ADMINISTRATIVE'
    | 'OTHER';
  requirementText: string;
  isQuestion: boolean;
  isMandatory: boolean;
  keywords: string[];
  context: string; // Surrounding text for context
}

export interface RFBAnalysis {
  documentType: 'RFB' | 'RFP' | 'RFQ' | 'IFB' | 'RFI';
  solicitationNumber: string | null;
  issuingAgency: string | null;
  projectTitle: string | null;
  dueDate: string | null;
  sections: RFBSection[];
  requirements: RFBRequirement[];
  contacts: {
    name?: string;
    title?: string;
    phone?: string;
    email?: string;
  }[];
  documentMetadata: {
    totalLength: number;
    sectionsFound: number;
    requirementsExtracted: number;
    questionsFound: number;
    mandatoryItems: number;
  };
}

/**
 * MAIN PARSER: Comprehensively scans and extracts ALL requirements from government solicitation
 */
export function parseGovernmentRFB(
  documentContent: string,
  fileName: string
): RFBAnalysis {
  console.log(
    `\n🔍 COMPREHENSIVE RFB PARSER - Scanning ${documentContent.length.toLocaleString()} characters...`
  );

  // Step 1: Detect document type
  const documentType = detectDocumentType(documentContent, fileName);
  console.log(`   Document Type: ${documentType}`);

  // Step 2: Extract header information
  const solicitationNumber = extractSolicitationNumber(documentContent);
  const issuingAgency = extractIssuingAgency(documentContent);
  const projectTitle = extractProjectTitle(documentContent, fileName);
  const dueDate = extractDueDate(documentContent);

  console.log(`   Solicitation: ${solicitationNumber || 'NOT FOUND'}`);
  console.log(`   Agency: ${issuingAgency || 'NOT FOUND'}`);
  console.log(`   Project: ${projectTitle || 'NOT FOUND'}`);
  console.log(`   Due: ${dueDate || 'NOT FOUND'}`);

  // Step 3: Extract contacts
  const contacts = extractContacts(documentContent);
  console.log(`   Contacts Found: ${contacts.length}`);

  // Step 4: Parse document into sections
  const sections = parseDocumentSections(documentContent);
  console.log(`   Sections Identified: ${sections.length}`);

  // Step 5: Extract ALL requirements from each section
  const requirements = extractAllRequirements(sections, documentContent);
  console.log(`   Requirements Extracted: ${requirements.length}`);

  const questionsFound = requirements.filter((r) => r.isQuestion).length;
  const mandatoryItems = requirements.filter((r) => r.isMandatory).length;

  console.log(`   Questions Found: ${questionsFound}`);
  console.log(`   Mandatory Items: ${mandatoryItems}`);

  return {
    documentType,
    solicitationNumber,
    issuingAgency,
    projectTitle,
    dueDate,
    sections,
    requirements,
    contacts,
    documentMetadata: {
      totalLength: documentContent.length,
      sectionsFound: sections.length,
      requirementsExtracted: requirements.length,
      questionsFound,
      mandatoryItems,
    },
  };
}

/**
 * Detect document type (RFB, RFP, RFQ, IFB, RFI)
 */
function detectDocumentType(
  documentContent: string,
  fileName: string
): 'RFB' | 'RFP' | 'RFQ' | 'IFB' | 'RFI' {
  const content = documentContent.toLowerCase();
  const name = fileName.toLowerCase();

  // Check document content and filename for indicators
  if (content.match(/\brequest for bid|rfb\b/i) || name.includes('rfb')) {
    return 'RFB';
  }
  if (content.match(/\binvitation for bid|ifb\b/i) || name.includes('ifb')) {
    return 'IFB';
  }
  if (content.match(/\brequest for proposal|rfp\b/i) || name.includes('rfp')) {
    return 'RFP';
  }
  if (content.match(/\brequest for quote|rfq\b/i) || name.includes('rfq')) {
    return 'RFQ';
  }
  if (
    content.match(/\brequest for information|rfi\b/i) ||
    name.includes('rfi')
  ) {
    return 'RFI';
  }

  // Default to RFB for government trucking/transport solicitations
  return 'RFB';
}

/**
 * Extract solicitation number
 */
function extractSolicitationNumber(documentContent: string): string | null {
  // Multiple patterns for solicitation numbers
  const patterns = [
    /(?:solicitation|bid|document|reference|contract|project)\s*(?:number|no|#|id)[:\s]+([A-Z0-9-]+)/i,
    /document\s+number[:\s]+([A-Z]{2,4}-\d{2,4}-\d+(?:-[A-Z])?)/i,
    /\b([A-Z]{2,4}-\d{2,4}-\d+(?:-[A-Z])?)\b/,
    /solicitation[:\s#]+([A-Z0-9-]{5,})/i,
  ];

  for (const pattern of patterns) {
    const match = documentContent.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
}

/**
 * Extract issuing agency
 */
function extractIssuingAgency(documentContent: string): string | null {
  const patterns = [
    /(?:county|city|state|department|agency)\s+of\s+([A-Z][a-zA-Z\s]+?)(?:\n|,|solicitation)/i,
    /issuing\s+(?:agency|office)[:\s]+([A-Z][a-zA-Z\s]+?)(?:\n|,)/i,
    /purchasing\s+department.*?(county|city|state)\s+of\s+([A-Z][a-zA-Z\s]+)/i,
  ];

  for (const pattern of patterns) {
    const match = documentContent.match(pattern);
    if (match) {
      // Take the most specific match group
      const agency = match[2] || match[1];
      if (agency && agency.length > 3 && agency.length < 100) {
        return agency.trim();
      }
    }
  }

  return null;
}

/**
 * Extract project title
 */
function extractProjectTitle(
  documentContent: string,
  fileName: string
): string | null {
  // Try to extract from document first
  const patterns = [
    /title[:\s]+([A-Z][^\n]{10,150}?)(?:\n|document number)/i,
    /(?:project|contract)\s+title[:\s]+([^\n]{10,150})/i,
    /for[:\s]+([A-Z][a-zA-Z\s&,]+?(?:Services?|Trucking|Transportation|Hauling))/i,
  ];

  for (const pattern of patterns) {
    const match = documentContent.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // Fall back to filename (remove extension and common prefixes)
  const cleanName = fileName
    .replace(/\.(pdf|docx?|txt)$/i, '')
    .replace(/^(rfb|rfp|rfq|ifb|rfi)[-_\s]*/i, '')
    .replace(/[-_]/g, ' ')
    .trim();

  return cleanName || null;
}

/**
 * Extract due date
 */
function extractDueDate(documentContent: string): string | null {
  const patterns = [
    /due\s+date[:\s]+([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})/i,
    /bids?\s+due[:\s]+([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})/i,
    /submission\s+deadline[:\s]+([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})/i,
    /on\s+or\s+before[:\s]+([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})/i,
    /(\d{1,2}\/\d{1,2}\/\d{2,4})\s+at\s+(\d{1,2}:\d{2}\s*[AP]M)/i,
  ];

  for (const pattern of patterns) {
    const match = documentContent.match(pattern);
    if (match && match[1]) {
      return match[1].trim() + (match[2] ? ` at ${match[2]}` : '');
    }
  }

  return null;
}

/**
 * Extract contact information
 */
function extractContacts(documentContent: string): Array<{
  name?: string;
  title?: string;
  phone?: string;
  email?: string;
}> {
  const contacts: Array<{
    name?: string;
    title?: string;
    phone?: string;
    email?: string;
  }> = [];

  // Extract contact names with titles
  const namePattern =
    /(?:contact|attn:|attention:|coordinator)[:\s]+([A-Z][a-z]+\s+(?:[A-Z][a-z]+\s+)?[A-Z][a-z]+)(?:[,\s]+([A-Za-z\s]+?))?(?:\n|phone|email)/gi;
  let match;
  while ((match = namePattern.exec(documentContent)) !== null) {
    contacts.push({
      name: match[1]?.trim(),
      title: match[2]?.trim(),
    });
  }

  // Extract phone numbers
  const phonePattern = /phone[:\s]+([\(]?\d{3}[\)]?[-\s]?\d{3}[-\s]?\d{4})/gi;
  const phones: string[] = [];
  while ((match = phonePattern.exec(documentContent)) !== null) {
    if (match[1]) phones.push(match[1].trim());
  }

  // Extract emails
  const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const emails: string[] = [];
  while ((match = emailPattern.exec(documentContent)) !== null) {
    if (match[1]) emails.push(match[1].toLowerCase());
  }

  // Merge contacts with phone/email if we have them
  if (contacts.length === 0 && (phones.length > 0 || emails.length > 0)) {
    contacts.push({
      phone: phones[0],
      email: emails[0],
    });
  } else if (contacts.length > 0) {
    // Add phones/emails to first contact
    if (phones.length > 0) contacts[0].phone = phones[0];
    if (emails.length > 0) contacts[0].email = emails[0];
  }

  return contacts;
}

/**
 * Parse document into logical sections
 */
function parseDocumentSections(documentContent: string): RFBSection[] {
  const sections: RFBSection[] = [];

  // Common government document section headers
  const sectionPatterns = [
    // Numbered sections
    /(?:^|\n)\s*([IVX]+|[\dA-Z]+(?:\.\d+)*)\.\s*([A-Z][A-Z\s,&-]{5,80}?)(?:\n|:)/gm,
    // Named sections
    /(?:^|\n)\s*(SECTION|PART|ARTICLE|SCHEDULE|ATTACHMENT|APPENDIX|EXHIBIT)\s+([IVX\d]+)[:\s]*([A-Z][A-Za-z\s,&-]{5,80}?)(?:\n|:)/gim,
    // All caps headers
    /(?:^|\n)\s*([A-Z][A-Z\s,&-]{10,80}?)(?:\n|:)/gm,
  ];

  const foundHeaders: Array<{
    title: string;
    index: number;
    number?: string;
  }> = [];

  // Find all section headers
  for (const pattern of sectionPatterns) {
    let match;
    while ((match = pattern.exec(documentContent)) !== null) {
      const index = match.index;
      const number = match[1];
      const title = (match[2] || match[1]).trim();

      // Filter out noise (too short, common words only, etc.)
      if (
        title.length >= 5 &&
        !title.match(/^(page|rev|date|time)$/i) &&
        !foundHeaders.some((h) => Math.abs(h.index - index) < 10)
      ) {
        foundHeaders.push({ title, index, number });
      }
    }
  }

  // Sort by position in document
  foundHeaders.sort((a, b) => a.index - b.index);

  // Create sections from headers
  for (let i = 0; i < foundHeaders.length; i++) {
    const header = foundHeaders[i];
    const nextHeader = foundHeaders[i + 1];

    const startIndex = header.index;
    const endIndex = nextHeader ? nextHeader.index : documentContent.length;
    const content = documentContent.substring(startIndex, endIndex).trim();

    sections.push({
      title: header.title,
      content,
      startIndex,
      endIndex,
    });
  }

  // If no sections found, treat entire document as one section
  if (sections.length === 0) {
    sections.push({
      title: 'COMPLETE DOCUMENT',
      content: documentContent,
      startIndex: 0,
      endIndex: documentContent.length,
    });
  }

  return sections;
}

/**
 * Extract ALL requirements from sections
 * This is the core function that finds EVERY requirement/question
 */
function extractAllRequirements(
  sections: RFBSection[],
  fullDocument: string
): RFBRequirement[] {
  const requirements: RFBRequirement[] = [];
  let idCounter = 1;

  for (const section of sections) {
    // Categorize section
    const category = categorizeSection(section.title);

    // Extract different types of requirements:

    // 1. EXPLICIT QUESTIONS (with question marks)
    const questions = extractQuestions(section.content);
    for (const q of questions) {
      requirements.push({
        id: `REQ-${String(idCounter++).padStart(3, '0')}`,
        section: section.title,
        category,
        requirementText: q.text,
        isQuestion: true,
        isMandatory: determineMandatory(q.text),
        keywords: extractKeywords(q.text),
        context: q.context,
      });
    }

    // 2. SHALL/MUST/REQUIRED STATEMENTS
    const mandatoryStatements = extractMandatoryStatements(section.content);
    for (const stmt of mandatoryStatements) {
      requirements.push({
        id: `REQ-${String(idCounter++).padStart(3, '0')}`,
        section: section.title,
        category,
        requirementText: stmt.text,
        isQuestion: false,
        isMandatory: true,
        keywords: extractKeywords(stmt.text),
        context: stmt.context,
      });
    }

    // 3. SUBMISSION REQUIREMENTS (forms, documents, certificates)
    const submissionReqs = extractSubmissionRequirements(section.content);
    for (const sub of submissionReqs) {
      requirements.push({
        id: `REQ-${String(idCounter++).padStart(3, '0')}`,
        section: section.title,
        category: 'SUBMISSION',
        requirementText: sub.text,
        isQuestion: false,
        isMandatory: true,
        keywords: extractKeywords(sub.text),
        context: sub.context,
      });
    }

    // 4. SPECIFICATIONS (equipment, capacity, performance)
    const specifications = extractSpecifications(section.content, category);
    for (const spec of specifications) {
      requirements.push({
        id: `REQ-${String(idCounter++).padStart(3, '0')}`,
        section: section.title,
        category: 'SPECIFICATIONS',
        requirementText: spec.text,
        isQuestion: false,
        isMandatory: determineMandatory(spec.text),
        keywords: extractKeywords(spec.text),
        context: spec.context,
      });
    }

    // 5. QUALIFICATIONS (licenses, certifications, experience)
    const qualifications = extractQualifications(section.content);
    for (const qual of qualifications) {
      requirements.push({
        id: `REQ-${String(idCounter++).padStart(3, '0')}`,
        section: section.title,
        category: 'QUALIFICATIONS',
        requirementText: qual.text,
        isQuestion: false,
        isMandatory: true,
        keywords: extractKeywords(qual.text),
        context: qual.context,
      });
    }

    // 6. INSURANCE REQUIREMENTS
    const insurance = extractInsuranceRequirements(section.content);
    for (const ins of insurance) {
      requirements.push({
        id: `REQ-${String(idCounter++).padStart(3, '0')}`,
        section: section.title,
        category: 'INSURANCE',
        requirementText: ins.text,
        isQuestion: false,
        isMandatory: true,
        keywords: extractKeywords(ins.text),
        context: ins.context,
      });
    }

    // 7. TIMELINE/DEADLINE REQUIREMENTS
    const timelines = extractTimelineRequirements(section.content);
    for (const time of timelines) {
      requirements.push({
        id: `REQ-${String(idCounter++).padStart(3, '0')}`,
        section: section.title,
        category: 'TIMELINE',
        requirementText: time.text,
        isQuestion: false,
        isMandatory: determineMandatory(time.text),
        keywords: extractKeywords(time.text),
        context: time.context,
      });
    }

    // 8. PRICING REQUIREMENTS
    const pricing = extractPricingRequirements(section.content);
    for (const price of pricing) {
      requirements.push({
        id: `REQ-${String(idCounter++).padStart(3, '0')}`,
        section: section.title,
        category: 'PRICING',
        requirementText: price.text,
        isQuestion: false,
        isMandatory: true,
        keywords: extractKeywords(price.text),
        context: price.context,
      });
    }
  }

  // Deduplicate similar requirements
  return deduplicateRequirements(requirements);
}

/**
 * Categorize section based on title
 */
function categorizeSection(title: string): RFBRequirement['category'] {
  const lower = title.toLowerCase();

  if (
    lower.match(
      /scope|description|statement of work|sow|background|project description/i
    )
  )
    return 'SCOPE';
  if (lower.match(/specification|technical|equipment|vehicle|standard/i))
    return 'SPECIFICATIONS';
  if (
    lower.match(/qualification|eligibility|experience|capability|requirement/i)
  )
    return 'QUALIFICATIONS';
  if (lower.match(/insurance|liability|coverage|bond/i)) return 'INSURANCE';
  if (lower.match(/schedule|timeline|deadline|calendar|period|duration/i))
    return 'TIMELINE';
  if (lower.match(/price|pricing|cost|payment|compensation/i)) return 'PRICING';
  if (lower.match(/submission|instruction|proposal|bid submittal|how to bid/i))
    return 'SUBMISSION';
  if (lower.match(/compliance|regulation|legal|term|condition/i))
    return 'COMPLIANCE';
  if (lower.match(/administrative|contact|general information/i))
    return 'ADMINISTRATIVE';
  if (lower.match(/technical approach|methodology|procedure/i))
    return 'TECHNICAL';

  return 'OTHER';
}

/**
 * Extract questions (sentences with question marks)
 */
function extractQuestions(
  content: string
): Array<{ text: string; context: string }> {
  const questions: Array<{ text: string; context: string }> = [];

  // Split by question marks
  const sentences = content.split(/\?+/);

  for (let i = 0; i < sentences.length - 1; i++) {
    // Get the question (look back for sentence start)
    const questionPart = sentences[i];
    const lastSentenceStart = Math.max(
      questionPart.lastIndexOf('.'),
      questionPart.lastIndexOf('\n'),
      questionPart.length - 300
    );

    const questionText = questionPart
      .substring(lastSentenceStart)
      .trim()
      .replace(/^[•\-\*\d]+[\.\)]\s*/, '');

    if (questionText.length > 10) {
      // Get context (surrounding text)
      const contextStart = Math.max(0, questionPart.length - 200);
      const contextEnd = Math.min(
        content.length,
        questionPart.length + sentences[i + 1].length
      );
      const context = content
        .substring(contextStart, contextEnd)
        .trim()
        .substring(0, 300);

      questions.push({
        text: questionText + '?',
        context,
      });
    }
  }

  // Also extract QUESTION-LIKE PHRASES that don't have question marks
  const questionLikePatterns = [
    /(?:what|who|how|when|where|why|describe|provide|explain|state|identify|specify|list|submit|demonstrate)(?:\s+is|\s+are|\s+your|\s+the|\s+an?|\s+you|\s+do|\s+does|\s+can|\s+will|\s+shall|\s+must|\s+may)?\s+[^.!?]+(?:insurance|liability|coverage|certification|experience|qualification|company|business|operation|past performance|references)/gi,
    /(?:insurance|liability|coverage|certification)(?:\s+requirements?|\s+information|\s+details|\s+coverage)/gi,
    /(?:company|business|corporate)(?:\s+information|\s+profile|\s+overview|\s+background)/gi,
    /(?:past performance|references|experience)(?:\s+information|\s+details|\s+requirements?|\s+history)/gi,
    /(?:provide|submit|list)(?:\s+your|\s+the)?\s+(?:past performance|references|experience)/gi,
    /(?:where|who)(?:\s+the)?\s+(?:bidder|proposer|contractor)(?:\s+can)?(?:not\s+)?(?:make|certify)(?:\s+the)?\s+certification/gi,
    /(?:certification)(?:\s+exceptions?|\s+cannot|\s+limitations?)/gi,
  ];

  for (const pattern of questionLikePatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const matchedText = match[0].trim();
      if (
        matchedText.length > 15 &&
        !questions.some((q) => q.text.includes(matchedText))
      ) {
        // Get context around the match
        const startPos = Math.max(0, match.index - 50);
        const endPos = Math.min(
          content.length,
          match.index + matchedText.length + 50
        );

        questions.push({
          text: matchedText,
          context: content.substring(startPos, endPos),
        });
      }
    }
  }

  return questions;
}

/**
 * Extract SHALL/MUST/REQUIRED statements
 */
function extractMandatoryStatements(
  content: string
): Array<{ text: string; context: string }> {
  const statements: Array<{ text: string; context: string }> = [];

  // Patterns for mandatory language
  const mandatoryPatterns = [
    /(?:bidder|contractor|vendor|offeror|company|supplier|carrier|respondent)s?\s+(?:shall|must|is required to|are required to)\s+([^\.]{20,300})/gi,
    /(?:shall|must|is required|are required)\s+(?:provide|submit|include|demonstrate|maintain|possess|have|be|comply)\s+([^\.]{20,300})/gi,
  ];

  for (const pattern of mandatoryPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const fullMatch = match[0];
      const requirement = fullMatch.trim();

      if (requirement.length > 20) {
        // Get context
        const contextStart = Math.max(0, match.index - 100);
        const contextEnd = Math.min(content.length, match.index + 400);
        const context = content.substring(contextStart, contextEnd).trim();

        statements.push({
          text: requirement,
          context,
        });
      }
    }
  }

  return statements;
}

/**
 * Extract submission requirements
 */
function extractSubmissionRequirements(
  content: string
): Array<{ text: string; context: string }> {
  const requirements: Array<{ text: string; context: string }> = [];

  // Look for form/document/certificate requirements
  const patterns = [
    /(?:submit|provide|include|attach|furnish)\s+(?:a|the|all|copy of|copies of)?\s*(form\s+[A-Z0-9-]+|[A-Z][a-z]+\s+Form|certificate|documentation|proof|evidence)(?:\s+of)?\s+([^\.]{10,150})/gi,
    /bid\s+(?:shall|must)\s+(?:be submitted|include)\s+([^\.]{20,200})/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const requirement = match[0].trim();

      if (requirement.length > 15) {
        const contextStart = Math.max(0, match.index - 100);
        const contextEnd = Math.min(content.length, match.index + 300);
        const context = content.substring(contextStart, contextEnd).trim();

        requirements.push({
          text: requirement,
          context,
        });
      }
    }
  }

  return requirements;
}

/**
 * Extract specifications (equipment, capacity, performance standards)
 */
function extractSpecifications(
  content: string,
  category: string
): Array<{ text: string; context: string }> {
  const specifications: Array<{ text: string; context: string }> = [];

  // Equipment specifications
  const equipmentPatterns = [
    /(?:equipment|vehicle|truck|trailer)(?:\s+type)?[:\s]+([^\n]{10,150})/gi,
    /(?:minimum|maximum)\s+(?:capacity|weight|size|age|year)[:\s]+([^\n]{10,100})/gi,
    /(?:must be|shall be|equipped with|featuring)\s+([a-z][^\.\n]{15,150})/gi,
  ];

  // Capacity/volume specifications
  const capacityPatterns = [
    /(?:capacity|volume|quantity|loads?|trips?)\s*(?:of|per)?[:\s]*(\d+[^\.\n]{5,100})/gi,
    /(?:minimum|maximum)\s+of\s+(\d+[^\.\n]{10,100})/gi,
  ];

  // Performance specifications
  const performancePatterns = [
    /(?:response time|delivery time|completion|turnaround)\s*[:\s]*([^\.\n]{10,100})/gi,
    /(?:hours of operation|operating hours|service hours)\s*[:\s]*([^\.\n]{10,100})/gi,
  ];

  const allPatterns = [
    ...equipmentPatterns,
    ...capacityPatterns,
    ...performancePatterns,
  ];

  for (const pattern of allPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const spec = match[0].trim();

      if (spec.length > 15 && !spec.match(/^\d+$/)) {
        const contextStart = Math.max(0, match.index - 100);
        const contextEnd = Math.min(content.length, match.index + 300);
        const context = content.substring(contextStart, contextEnd).trim();

        specifications.push({
          text: spec,
          context,
        });
      }
    }
  }

  return specifications;
}

/**
 * Extract qualifications (licenses, certifications, experience)
 */
function extractQualifications(
  content: string
): Array<{ text: string; context: string }> {
  const qualifications: Array<{ text: string; context: string }> = [];

  const patterns = [
    /(?:must|shall|required to)\s+(?:possess|have|hold|maintain|be)\s+(?:a\s+)?(?:valid\s+)?(license|certification|DOT\s+number|MC\s+number|insurance|[A-Z]{2,6}\s+certification|CDL|authority)([^\.\n]{0,150})/gi,
    /(?:minimum|required)\s+(?:of\s+)?(\d+\s+years?\s+(?:of\s+)?experience[^\.\n]{0,100})/gi,
    /(?:bidder|contractor|vendor)\s+(?:must|shall)\s+(?:demonstrate|provide evidence of|show proof of)\s+([^\.\n]{20,150})/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const qual = match[0].trim();

      if (qual.length > 15) {
        const contextStart = Math.max(0, match.index - 100);
        const contextEnd = Math.min(content.length, match.index + 300);
        const context = content.substring(contextStart, contextEnd).trim();

        qualifications.push({
          text: qual,
          context,
        });
      }
    }
  }

  return qualifications;
}

/**
 * Extract insurance requirements
 */
function extractInsuranceRequirements(
  content: string
): Array<{ text: string; context: string }> {
  const requirements: Array<{ text: string; context: string }> = [];

  const patterns = [
    /(?:insurance|liability|coverage|bond)\s+(?:of|in the amount of|minimum of|at least)?\s*\$[\d,]+(?:[^\.\n]{0,100})/gi,
    /(?:general|auto|vehicle|cargo|workers['\s]compensation|professional)\s+(?:liability\s+)?insurance[^\.\n]{0,150}/gi,
    /certificate of insurance[^\.\n]{0,150}/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const req = match[0].trim();

      if (req.length > 15) {
        const contextStart = Math.max(0, match.index - 100);
        const contextEnd = Math.min(content.length, match.index + 300);
        const context = content.substring(contextStart, contextEnd).trim();

        requirements.push({
          text: req,
          context,
        });
      }
    }
  }

  return requirements;
}

/**
 * Extract timeline/deadline requirements
 */
function extractTimelineRequirements(
  content: string
): Array<{ text: string; context: string }> {
  const requirements: Array<{ text: string; context: string }> = [];

  const patterns = [
    /(?:contract period|performance period|term)[:\s]+([^\.\n]{10,100})/gi,
    /(?:start date|commencement date|begin)[:\s]+([^\.\n]{10,100})/gi,
    /(?:completion date|end date|expire)[:\s]+([^\.\n]{10,100})/gi,
    /(?:within|no later than|by)\s+(\d+\s+(?:days?|weeks?|months?|hours?)[^\.\n]{0,100})/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const req = match[0].trim();

      if (req.length > 10) {
        const contextStart = Math.max(0, match.index - 100);
        const contextEnd = Math.min(content.length, match.index + 300);
        const context = content.substring(contextStart, contextEnd).trim();

        requirements.push({
          text: req,
          context,
        });
      }
    }
  }

  return requirements;
}

/**
 * Extract pricing requirements
 */
function extractPricingRequirements(
  content: string
): Array<{ text: string; context: string }> {
  const requirements: Array<{ text: string; context: string }> = [];

  const patterns = [
    /(?:price|pricing|cost|rate)\s+(?:shall|must|should)\s+(?:be|include)\s+([^\.\n]{20,150})/gi,
    /(?:unit price|price per|rate per)\s+([^\.\n]{10,100})/gi,
    /bid\s+price\s+(?:form|schedule|sheet)[^\.\n]{0,150}/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const req = match[0].trim();

      if (req.length > 15) {
        const contextStart = Math.max(0, match.index - 100);
        const contextEnd = Math.min(content.length, match.index + 300);
        const context = content.substring(contextStart, contextEnd).trim();

        requirements.push({
          text: req,
          context,
        });
      }
    }
  }

  return requirements;
}

/**
 * Determine if requirement is mandatory
 */
function determineMandatory(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes('shall') ||
    lower.includes('must') ||
    lower.includes('required') ||
    lower.includes('mandatory')
  );
}

/**
 * Extract keywords from requirement text
 */
function extractKeywords(text: string): string[] {
  // Common keywords to look for
  const keywordPatterns = [
    /\b(CDL|DOT|MC|FMCSA|insurance|license|certification|certificate)\b/gi,
    /\b(\d+\s*(?:yard|ton|lb|gallon|mile|hour|day|week|month|year)s?)\b/gi,
    /\b(truck|vehicle|trailer|equipment|driver|dispatcher)\b/gi,
  ];

  const keywords: string[] = [];
  for (const pattern of keywordPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      keywords.push(...matches.map((m) => m.toLowerCase()));
    }
  }

  return Array.from(new Set(keywords)); // Remove duplicates
}

/**
 * Deduplicate similar requirements
 */
function deduplicateRequirements(
  requirements: RFBRequirement[]
): RFBRequirement[] {
  const unique: RFBRequirement[] = [];

  for (const req of requirements) {
    // Check if similar requirement already exists
    const isDuplicate = unique.some((existing) => {
      // Same text = duplicate
      if (existing.requirementText === req.requirementText) return true;

      // Very similar text (>80% match) = duplicate
      const similarity = calculateSimilarity(
        existing.requirementText,
        req.requirementText
      );
      return similarity > 0.8;
    });

    if (!isDuplicate) {
      unique.push(req);
    }
  }

  return unique;
}

/**
 * Calculate text similarity (simple Jaccard similarity)
 */
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(
    text1
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );
  const words2 = new Set(
    text2
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );

  const intersection = new Set(Array.from(words1).filter((w) => words2.has(w)));
  const union = new Set([...Array.from(words1), ...Array.from(words2)]);

  return union.size > 0 ? intersection.size / union.size : 0;
}
