/**
 * Solicitation Document Retriever Service
 * Fetches actual solicitation documents from source systems (SAM.gov, agency websites, etc.)
 */

interface SolicitationDocument {
  noticeId: string;
  solicitationNumber: string;
  title: string;
  agency: string;
  postedDate: string;
  description: string;
  attachments: {
    name: string;
    url: string;
    type: string;
    size?: number;
  }[];
  fullTextDescription: string;
  sourceUrl: string;
  deadlines: {
    response?: string;
    questions?: string;
  };
}

export class SolicitationDocumentRetriever {
  private readonly samGovApiKey: string;
  private readonly samGovBaseUrl = 'https://api.sam.gov';

  constructor() {
    this.samGovApiKey = process.env.SAMGOV_API_KEY || '';
  }

  /**
   * Retrieve full solicitation details including documents from SAM.gov
   */
  async retrieveSAMGovSolicitation(
    noticeId: string
  ): Promise<SolicitationDocument | null> {
    try {
      console.log(
        `📥 Retrieving solicitation documents for notice ID: ${noticeId}`
      );

      // Fetch the opportunity details
      const oppResponse = await fetch(
        `${this.samGovBaseUrl}/opportunities/v2/search?noticeid=${noticeId}&limit=1`,
        {
          headers: {
            'X-Api-Key': this.samGovApiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!oppResponse.ok) {
        throw new Error(
          `SAM.gov API error: ${oppResponse.status} ${oppResponse.statusText}`
        );
      }

      const oppData = await oppResponse.json();
      const opportunity = oppData.opportunitiesData?.[0];

      if (!opportunity) {
        console.error(`❌ Opportunity not found for notice ID: ${noticeId}`);
        return null;
      }

      // Fetch the full description/solicitation text
      let fullDescription = '';
      if (opportunity.description) {
        try {
          const descResponse = await fetch(opportunity.description, {
            headers: {
              'X-Api-Key': this.samGovApiKey,
            },
          });
          if (descResponse.ok) {
            fullDescription = await descResponse.text();
          }
        } catch (error) {
          console.error('Error fetching description:', error);
        }
      }

      // Parse attachments/resource links
      const attachments = (opportunity.resourceLinks || []).map(
        (link: string, index: number) => ({
          name: `Attachment ${index + 1}`,
          url: link,
          type: this.getFileTypeFromUrl(link),
          size: undefined,
        })
      );

      const solicitation: SolicitationDocument = {
        noticeId: opportunity.noticeId,
        solicitationNumber: opportunity.solicitationNumber || 'N/A',
        title: opportunity.title,
        agency: opportunity.fullParentPathName || 'Unknown Agency',
        postedDate: opportunity.postedDate,
        description: opportunity.description || '',
        attachments,
        fullTextDescription: fullDescription,
        sourceUrl: opportunity.uiLink || `https://sam.gov/opp/${noticeId}`,
        deadlines: {
          response: opportunity.responseDeadLine,
          questions: undefined,
        },
      };

      console.log(
        `✅ Retrieved solicitation: ${solicitation.title} with ${attachments.length} attachments`
      );

      return solicitation;
    } catch (error) {
      console.error('Error retrieving SAM.gov solicitation:', error);
      return null;
    }
  }

  /**
   * Search and retrieve multiple solicitations with full details
   */
  async searchAndRetrieveSolicitations(params: {
    keywords: string;
    limit?: number;
    postedFrom?: string;
    postedTo?: string;
  }): Promise<SolicitationDocument[]> {
    try {
      console.log(`🔍 Searching SAM.gov for solicitations: ${params.keywords}`);

      // Build query parameters
      const queryParams = new URLSearchParams({
        api_key: this.samGovApiKey,
        q: params.keywords,
        limit: (params.limit || 10).toString(),
        postedFrom: params.postedFrom || this.getDateString(-30),
        postedTo: params.postedTo || this.getDateString(0),
      });

      const response = await fetch(
        `${this.samGovBaseUrl}/opportunities/v2/search?${queryParams}`,
        {
          headers: {
            'X-Api-Key': this.samGovApiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`SAM.gov API error: ${response.status}`);
      }

      const data = await response.json();
      const opportunities = data.opportunitiesData || [];

      console.log(`📊 Found ${opportunities.length} opportunities`);

      // Retrieve full details for each opportunity
      const solicitations: SolicitationDocument[] = [];
      for (const opp of opportunities) {
        const fullSolicitation = await this.retrieveSAMGovSolicitation(
          opp.noticeId
        );
        if (fullSolicitation) {
          solicitations.push(fullSolicitation);
        }
      }

      return solicitations;
    } catch (error) {
      console.error('Error searching solicitations:', error);
      return [];
    }
  }

  /**
   * Download solicitation attachment
   */
  async downloadAttachment(
    attachmentUrl: string,
    savePath: string
  ): Promise<boolean> {
    try {
      console.log(`📥 Downloading attachment from: ${attachmentUrl}`);

      const response = await fetch(attachmentUrl, {
        headers: {
          'X-Api-Key': this.samGovApiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      const fs = require('fs').promises;
      await fs.writeFile(savePath, Buffer.from(buffer));

      console.log(`✅ Downloaded to: ${savePath}`);
      return true;
    } catch (error) {
      console.error('Error downloading attachment:', error);
      return false;
    }
  }

  /**
   * Search by specific solicitation number
   */
  async findBySolicitationNumber(
    solicitationNumber: string
  ): Promise<SolicitationDocument | null> {
    try {
      const response = await fetch(
        `${this.samGovBaseUrl}/opportunities/v2/search?solicitationNumber=${solicitationNumber}&limit=1`,
        {
          headers: {
            'X-Api-Key': this.samGovApiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`SAM.gov API error: ${response.status}`);
      }

      const data = await response.json();
      const opportunity = data.opportunitiesData?.[0];

      if (!opportunity) {
        return null;
      }

      return await this.retrieveSAMGovSolicitation(opportunity.noticeId);
    } catch (error) {
      console.error('Error finding solicitation by number:', error);
      return null;
    }
  }

  // Helper methods
  private getFileTypeFromUrl(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'PDF Document';
      case 'doc':
      case 'docx':
        return 'Word Document';
      case 'xls':
      case 'xlsx':
        return 'Excel Spreadsheet';
      case 'zip':
        return 'ZIP Archive';
      default:
        return 'Document';
    }
  }

  private getDateString(daysOffset: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
}

export default SolicitationDocumentRetriever;
