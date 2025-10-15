/**
 * Follow-Up Email Templates for Government Contracts
 * Used by Alexis Best (AI Executive Assistant) for automated follow-up communications
 */

export interface FollowUpTemplate {
  id: string;
  name: string;
  category: 'government_contract' | 'rfp' | 'bpa' | 'general';
  subject: string;
  body: string;
  tokens: string[];
  bccAddresses: string[];
  priority: 'high' | 'medium' | 'low';
}

export const followUpTemplates: FollowUpTemplate[] = [
  {
    id: 'nawcad-bpa-followup',
    name: 'NAWCAD BPA Follow-Up',
    category: 'bpa',
    subject: 'Following Up: BPA Application {{SOLICITATION_NUMBER}}',
    body: `Dear {{CONTACT_NAME}},

I hope this message finds you well. I am writing to follow up on DEPOINTE's Blanket Purchase Agreement (BPA) application submitted on {{SUBMISSION_DATE}} for {{SOLICITATION_NUMBER}} - General Freight and Trucking.

We remain very interested in participating in the NAWCAD Lakehurst BPA Tool program and providing general freight and trucking services to support your operational needs.

Our application included:
✓ CAGE Code: 8UMX3
✓ UEID: HJB4KNYJVGZ1
✓ SAM.gov Registration (Active)
✓ TWIC Certified Leadership Team
✓ Comprehensive Capabilities Statement
✓ 5+ Years Government Contracting Experience

Could you please provide an update on the status of our application? We want to ensure all required documentation has been received and there are no outstanding items needed from our team.

We are eager to begin participating in the Lakehurst BPA Tool solicitations and are fully prepared to respond to requirements promptly.

Thank you for your time and consideration. Please feel free to contact me directly if you need any additional information.

Best regards,

Dieasha "Dee" Davis
President & CEO
DEPOINTE / Freight 1st Direct
MC: 1647572 | DOT: 4250594
CAGE: 8UMX3 | UEID: HJB4KNYJVGZ1
Email: ddavis@freight1stdirect.com
Phone: [Contact Number]`,
    tokens: [
      '{{CONTACT_NAME}}',
      '{{SUBMISSION_DATE}}',
      '{{SOLICITATION_NUMBER}}',
      '{{DAYS_SINCE_SUBMISSION}}',
    ],
    bccAddresses: ['info@deedavis.biz'],
    priority: 'high',
  },
  {
    id: 'general-government-followup',
    name: 'General Government Contract Follow-Up',
    category: 'government_contract',
    subject: 'Follow-Up: {{OPPORTUNITY_TITLE}} - {{SOLICITATION_NUMBER}}',
    body: `Dear {{CONTACT_NAME}},

I am writing to follow up on DEPOINTE's proposal submitted on {{SUBMISSION_DATE}} for {{SOLICITATION_NUMBER}} - {{OPPORTUNITY_TITLE}}.

We remain highly interested in this opportunity and wanted to check on the status of our submission. If any additional information or clarification is needed, please do not hesitate to reach out.

Key highlights of our proposal:
• {{HIGHLIGHT_1}}
• {{HIGHLIGHT_2}}
• {{HIGHLIGHT_3}}

We appreciate your consideration and look forward to the opportunity to serve your transportation needs.

Best regards,

Dieasha "Dee" Davis
President & CEO
DEPOINTE / Freight 1st Direct
MC: 1647572 | DOT: 4250594
CAGE: 8UMX3 | UEID: HJB4KNYJVGZ1
Email: ddavis@freight1stdirect.com`,
    tokens: [
      '{{CONTACT_NAME}}',
      '{{SUBMISSION_DATE}}',
      '{{SOLICITATION_NUMBER}}',
      '{{OPPORTUNITY_TITLE}}',
      '{{HIGHLIGHT_1}}',
      '{{HIGHLIGHT_2}}',
      '{{HIGHLIGHT_3}}',
    ],
    bccAddresses: ['info@deedavis.biz'],
    priority: 'medium',
  },
  {
    id: 'state-procurement-followup',
    name: 'State Procurement Follow-Up',
    category: 'rfp',
    subject: 'Status Inquiry: {{SOLICITATION_NUMBER}} - {{STATE_NAME}}',
    body: `Dear {{CONTACT_NAME}},

I am following up regarding DEPOINTE's bid submission for {{SOLICITATION_NUMBER}} - {{OPPORTUNITY_TITLE}}, submitted on {{SUBMISSION_DATE}}.

As a certified small business with extensive experience in {{SERVICE_TYPE}}, we are enthusiastic about the opportunity to serve {{STATE_NAME}} agencies.

Could you please provide an update on:
1. Current status of the bid evaluation process
2. Expected timeline for award decision
3. Any additional documentation needed from our team

We remain committed to delivering exceptional service and competitive pricing to meet your transportation requirements.

Thank you for your consideration.

Best regards,

Dieasha "Dee" Davis
President & CEO
DEPOINTE / Freight 1st Direct
MC: 1647572 | DOT: 4250594
CAGE: 8UMX3 | UEID: HJB4KNYJVGZ1
Email: ddavis@freight1stdirect.com`,
    tokens: [
      '{{CONTACT_NAME}}',
      '{{SUBMISSION_DATE}}',
      '{{SOLICITATION_NUMBER}}',
      '{{OPPORTUNITY_TITLE}}',
      '{{STATE_NAME}}',
      '{{SERVICE_TYPE}}',
    ],
    bccAddresses: ['info@deedavis.biz'],
    priority: 'medium',
  },
  {
    id: 'urgent-deadline-followup',
    name: 'Urgent Pre-Deadline Follow-Up',
    category: 'general',
    subject: 'URGENT: Clarification Needed - {{SOLICITATION_NUMBER}}',
    body: `Dear {{CONTACT_NAME}},

I am writing urgently regarding {{SOLICITATION_NUMBER}} - {{OPPORTUNITY_TITLE}}, with a submission deadline of {{DEADLINE_DATE}}.

We have a question that requires clarification before we can finalize our proposal:

{{QUESTION_CONTENT}}

Given the approaching deadline, we would greatly appreciate your prompt response to ensure we can submit a complete and accurate bid.

Thank you for your immediate attention to this matter.

Best regards,

Dieasha "Dee" Davis
President & CEO
DEPOINTE / Freight 1st Direct
MC: 1647572 | DOT: 4250594
CAGE: 8UMX3 | UEID: HJB4KNYJVGZ1
Email: ddavis@freight1stdirect.com
Phone: [Contact Number]`,
    tokens: [
      '{{CONTACT_NAME}}',
      '{{SOLICITATION_NUMBER}}',
      '{{OPPORTUNITY_TITLE}}',
      '{{DEADLINE_DATE}}',
      '{{QUESTION_CONTENT}}',
    ],
    bccAddresses: ['info@deedavis.biz'],
    priority: 'high',
  },
];

/**
 * Get follow-up template by ID
 */
export function getFollowUpTemplate(
  templateId: string
): FollowUpTemplate | undefined {
  return followUpTemplates.find((t) => t.id === templateId);
}

/**
 * Generate email from template with token replacement
 */
export function generateFollowUpEmail(
  templateId: string,
  tokenValues: Record<string, string>
): { subject: string; body: string; bccAddresses: string[] } | null {
  const template = getFollowUpTemplate(templateId);
  if (!template) return null;

  let subject = template.subject;
  let body = template.body;

  // Replace all tokens
  Object.entries(tokenValues).forEach(([token, value]) => {
    const tokenPattern = new RegExp(token.replace(/[{}]/g, '\\$&'), 'g');
    subject = subject.replace(tokenPattern, value);
    body = body.replace(tokenPattern, value);
  });

  return {
    subject,
    body,
    bccAddresses: template.bccAddresses,
  };
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(
  category: FollowUpTemplate['category']
): FollowUpTemplate[] {
  return followUpTemplates.filter((t) => t.category === category);
}
