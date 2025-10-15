/**
 * Universal Solicitation Retriever
 * Identifies the source agency/system and retrieves actual solicitation documents
 * Supports: SAM.gov, State procurement portals, Local government sites, Private company RFPs
 */

interface SourceIdentification {
  source:
    | 'SAM.gov'
    | 'State Portal'
    | 'Local Government'
    | 'Private Company'
    | 'InstantMarkets'
    | 'Unknown';
  sourceUrl?: string;
  retrievalMethod:
    | 'API'
    | 'Web Scraping'
    | 'Email Request'
    | 'Portal Login'
    | 'Manual';
  requiresAuth: boolean;
  documentTypes: string[];
}

interface SolicitationPackage {
  source: string;
  sourceUrl: string;
  solicitationNumber: string;
  title: string;
  agency: string;
  contactInfo: {
    name?: string;
    email?: string;
    phone?: string;
    website?: string;
  };
  documents: {
    name: string;
    type:
      | 'Solicitation'
      | 'Amendment'
      | 'Specification'
      | 'Drawing'
      | 'Form'
      | 'Q&A'
      | 'Other';
    url: string;
    retrievalMethod: string;
    requiresAuth: boolean;
  }[];
  deadlines: {
    questions?: string;
    proposals?: string;
    preBid?: string;
  };
  submissionInstructions: {
    method: string; // Email, Portal Upload, Physical Mail, etc.
    address?: string;
    email?: string;
    portalUrl?: string;
    requirements: string[];
  };
  retrievalDate: string;
  fullDescription: string;
}

export class UniversalSolicitationRetriever {
  private readonly samGovApiKey: string;

  constructor() {
    this.samGovApiKey = process.env.SAMGOV_API_KEY || '';
  }

  /**
   * Main method: Identify source and retrieve solicitation documents
   */
  async retrieveSolicitation(params: {
    title: string;
    agency: string;
    location?: string;
    url?: string;
    solicitationNumber?: string;
  }): Promise<SolicitationPackage | null> {
    try {
      console.log(`🔍 Identifying source for: ${params.title}`);

      // Step 1: Identify the source
      const source = await this.identifySource(params);
      console.log(
        `📋 Source identified: ${source.source} (${source.retrievalMethod})`
      );

      // Step 2: Retrieve based on source
      switch (source.source) {
        case 'SAM.gov':
          try {
            return await this.retrieveFromSAMGov(params);
          } catch (error) {
            console.warn(
              '⚠️ SAM.gov retrieval failed, providing manual guide:',
              error
            );
            return await this.createSAMGovManualGuide(params);
          }

        case 'State Portal':
          return await this.retrieveFromStatePortal(params, source);

        case 'Local Government':
          return await this.retrieveFromLocalGovernment(params, source);

        case 'Private Company':
          return await this.retrieveFromPrivateCompany(params, source);

        case 'InstantMarkets':
          return await this.retrieveFromInstantMarkets(params);

        default:
          return await this.createManualRetrievalGuide(params, source);
      }
    } catch (error) {
      console.error('Error retrieving solicitation:', error);
      return null;
    }
  }

  /**
   * Identify the source of the solicitation
   */
  private async identifySource(params: {
    title: string;
    agency: string;
    location?: string;
    url?: string;
  }): Promise<SourceIdentification> {
    const agency = params.agency.toUpperCase();
    const location = params.location?.toUpperCase() || '';
    const url = params.url || '';

    // Federal Government (SAM.gov)
    if (
      agency.includes('DEPT OF DEFENSE') ||
      agency.includes('DOD') ||
      agency.includes('DEPARTMENT OF') ||
      agency.includes('FEDERAL') ||
      agency.includes('GSA') ||
      agency.includes('NAVAL') ||
      agency.includes('ARMY') ||
      agency.includes('AIR FORCE') ||
      agency.includes('VA') ||
      agency.includes('VETERANS AFFAIRS') ||
      url.includes('sam.gov')
    ) {
      return {
        source: 'SAM.gov',
        sourceUrl: 'https://sam.gov',
        retrievalMethod: 'API',
        requiresAuth: true,
        documentTypes: ['Solicitation', 'Amendment', 'Specification', 'Form'],
      };
    }

    // State Government
    if (
      agency.includes('STATE OF') ||
      agency.includes('COMPTROLLER') ||
      agency.includes('STATE DEPARTMENT') ||
      location.includes('STATE')
    ) {
      return {
        source: 'State Portal',
        sourceUrl: this.getStatePortalUrl(location),
        retrievalMethod: 'Web Scraping',
        requiresAuth: false,
        documentTypes: ['RFP', 'RFQ', 'IFB', 'Amendment'],
      };
    }

    // Local Government (City, County, Municipality)
    if (
      agency.includes('CITY OF') ||
      agency.includes('COUNTY') ||
      agency.includes('MUNICIPALITY') ||
      agency.includes('TOWN OF') ||
      agency.includes('VILLAGE OF') ||
      agency.includes('SCHOOL DISTRICT') ||
      agency.includes('DEPARTMENT OF EDUCATION')
    ) {
      return {
        source: 'Local Government',
        sourceUrl: url || 'Unknown',
        retrievalMethod: 'Web Scraping',
        requiresAuth: false,
        documentTypes: ['RFP', 'RFQ', 'Bid', 'Specification'],
      };
    }

    // Private Company
    if (
      agency.includes('INC') ||
      agency.includes('LLC') ||
      agency.includes('CORP') ||
      agency.includes('COMPANY') ||
      agency.includes('CORPORATION') ||
      (!agency.includes('DEPARTMENT') && !agency.includes('GOVERNMENT'))
    ) {
      return {
        source: 'Private Company',
        sourceUrl: url || 'Unknown',
        retrievalMethod: 'Email Request',
        requiresAuth: false,
        documentTypes: ['RFP', 'RFQ', 'Proposal Request'],
      };
    }

    // Unknown source
    return {
      source: 'Unknown',
      sourceUrl: url || 'Unknown',
      retrievalMethod: 'Manual',
      requiresAuth: false,
      documentTypes: ['Unknown'],
    };
  }

  /**
   * Retrieve from SAM.gov
   */
  private async retrieveFromSAMGov(params: any): Promise<SolicitationPackage> {
    // Format dates as mm/dd/yyyy (SAM.gov requirement)
    const formatDate = (date: Date) => {
      const d = new Date(date);
      return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear()}`;
    };

    // Search for opportunities posted in the last 30 days
    const fromDate = formatDate(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    const toDate = formatDate(new Date());

    const queryParams = new URLSearchParams({
      format: 'json',
      limit: '10',
      offset: '0',
      postedFrom: fromDate,
      postedTo: toDate,
      ptype: 'o,r,s,k',
      title: params.title,
    });

    console.log(`🔍 Searching SAM.gov with query: ${queryParams.toString()}`);

    const response = await fetch(
      `https://api.sam.gov/opportunities/v2/search?${queryParams}`,
      {
        headers: {
          'X-Api-Key': this.samGovApiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`📡 SAM.gov response status: ${response.status}`);

    if (!response.ok) {
      console.error(`SAM.gov API error: ${response.status}`);
      throw new Error(`SAM.gov API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(
      `📊 SAM.gov returned ${data.opportunitiesData?.length || 0} opportunities`
    );

    const opp = data.opportunitiesData?.[0];

    if (!opp) {
      console.warn('⚠️ No solicitation found on SAM.gov for this query');
      throw new Error('Solicitation not found on SAM.gov');
    }

    // Get full description
    let fullDescription = '';
    if (opp.description) {
      try {
        const descResponse = await fetch(opp.description, {
          headers: { 'X-Api-Key': this.samGovApiKey },
        });
        if (descResponse.ok) {
          fullDescription = await descResponse.text();
        }
      } catch (error) {
        console.error('Error fetching description:', error);
      }
    }

    // Parse documents
    const documents = (opp.resourceLinks || []).map(
      (link: string, index: number) => ({
        name: `Attachment ${index + 1}`,
        type: 'Specification' as const,
        url: link,
        retrievalMethod: 'Direct Download',
        requiresAuth: true,
      })
    );

    return {
      source: 'SAM.gov',
      sourceUrl: opp.uiLink || `https://sam.gov/opp/${opp.noticeId}`,
      solicitationNumber: opp.solicitationNumber || 'N/A',
      title: opp.title,
      agency: opp.fullParentPathName,
      contactInfo: {
        name: opp.pointOfContact?.[0]?.fullName,
        email: opp.pointOfContact?.[0]?.email,
        phone: opp.pointOfContact?.[0]?.phone,
        website: 'https://sam.gov',
      },
      documents,
      deadlines: {
        proposals: opp.responseDeadLine,
        questions: undefined,
        preBid: undefined,
      },
      submissionInstructions: {
        method: 'SAM.gov Portal Upload',
        portalUrl: opp.uiLink,
        requirements: [
          'Active SAM.gov registration required',
          'Submit through SAM.gov workspace',
          'Include all required certifications',
        ],
      },
      retrievalDate: new Date().toISOString(),
      fullDescription,
    };
  }

  /**
   * Retrieve from State Portal
   */
  private async retrieveFromStatePortal(
    params: any,
    source: SourceIdentification
  ): Promise<SolicitationPackage> {
    // Return manual instructions for state portal
    return {
      source: 'State Portal',
      sourceUrl: source.sourceUrl || 'Unknown',
      solicitationNumber: params.solicitationNumber || 'Unknown',
      title: params.title,
      agency: params.agency,
      contactInfo: {
        website: source.sourceUrl,
      },
      documents: [],
      deadlines: {},
      submissionInstructions: {
        method: 'State Portal - Manual Retrieval Required',
        portalUrl: source.sourceUrl,
        requirements: [
          `Visit ${source.sourceUrl || 'state procurement portal'}`,
          'Search for solicitation by number or title',
          'Download all documents and amendments',
          'Register as vendor if required',
        ],
      },
      retrievalDate: new Date().toISOString(),
      fullDescription: `This solicitation is from a state government agency. Visit the state procurement portal to retrieve documents: ${source.sourceUrl}`,
    };
  }

  /**
   * Retrieve from Local Government
   */
  private async retrieveFromLocalGovernment(
    params: any,
    source: SourceIdentification
  ): Promise<SolicitationPackage> {
    return {
      source: 'Local Government',
      sourceUrl: params.url || 'Contact agency directly',
      solicitationNumber: params.solicitationNumber || 'Unknown',
      title: params.title,
      agency: params.agency,
      contactInfo: {
        website: params.url,
      },
      documents: [],
      deadlines: {},
      submissionInstructions: {
        method: 'Local Government - Contact Directly',
        requirements: [
          'Visit agency website or procurement office',
          'Request solicitation documents via email or phone',
          'Check for pre-bid meeting requirements',
          'Verify submission format (email, mail, or drop-off)',
        ],
      },
      retrievalDate: new Date().toISOString(),
      fullDescription: `This is a local government solicitation. Contact the agency directly to request documents.`,
    };
  }

  /**
   * Retrieve from Private Company
   */
  private async retrieveFromPrivateCompany(
    params: any,
    source: SourceIdentification
  ): Promise<SolicitationPackage> {
    return {
      source: 'Private Company RFP',
      sourceUrl: params.url || 'Contact company directly',
      solicitationNumber: params.solicitationNumber || 'N/A',
      title: params.title,
      agency: params.agency,
      contactInfo: {},
      documents: [],
      deadlines: {},
      submissionInstructions: {
        method: 'Private RFP - Email or Portal',
        requirements: [
          'Contact procurement department directly',
          'Request RFP documents and submission instructions',
          'Sign NDA if required',
          'Submit via specified method (email, portal, etc.)',
        ],
      },
      retrievalDate: new Date().toISOString(),
      fullDescription: `This is a private company RFP. Contact the company directly to request proposal documents.`,
    };
  }

  /**
   * Retrieve from InstantMarkets (get source info)
   */
  private async retrieveFromInstantMarkets(
    params: any
  ): Promise<SolicitationPackage> {
    return {
      source: 'InstantMarkets Aggregator',
      sourceUrl: params.url || 'https://instantmarkets.com',
      solicitationNumber: params.solicitationNumber || 'Unknown',
      title: params.title,
      agency: params.agency,
      contactInfo: {},
      documents: [],
      deadlines: {},
      submissionInstructions: {
        method: 'Via InstantMarkets - Check Original Source',
        requirements: [
          'Click on the opportunity in InstantMarkets',
          'Look for "Original Source" or "Source Link"',
          'Visit the original agency website',
          'Download documents from the source agency',
        ],
      },
      retrievalDate: new Date().toISOString(),
      fullDescription: `This opportunity was found on InstantMarkets. Click through to find the original source and retrieve documents.`,
    };
  }

  /**
   * Create SAM.gov manual retrieval guide
   */
  private async createSAMGovManualGuide(
    params: any
  ): Promise<SolicitationPackage> {
    return {
      source: 'SAM.gov',
      sourceUrl: 'https://sam.gov',
      solicitationNumber: params.solicitationNumber || 'Search Required',
      title: params.title,
      agency: params.agency,
      contactInfo: {
        website: 'https://sam.gov',
        email: 'FSD.Support@gsa.gov',
        phone: '866-606-8220',
      },
      documents: [],
      deadlines: {},
      submissionInstructions: {
        method: 'SAM.gov Portal - Manual Search Required',
        portalUrl: 'https://sam.gov/content/opportunities',
        requirements: [
          '1. Visit https://sam.gov',
          `2. Search for: "${params.title}"`,
          `3. Filter by agency: "${params.agency}"`,
          '4. Review all matching opportunities',
          '5. Download solicitation documents from the opportunity page',
          '6. Check for amendments and Q&A documents',
          '7. Submit proposal through SAM.gov workspace (requires registration)',
        ],
      },
      retrievalDate: new Date().toISOString(),
      fullDescription: `This is a federal government opportunity that should be available on SAM.gov. Search manually using the title and agency information provided. If not found, contact the agency directly or check if the opportunity has closed.`,
    };
  }

  /**
   * Create manual retrieval guide
   */
  private async createManualRetrievalGuide(
    params: any,
    source: SourceIdentification
  ): Promise<SolicitationPackage> {
    return {
      source: 'Unknown Source',
      sourceUrl: params.url || 'Unknown',
      solicitationNumber: params.solicitationNumber || 'Unknown',
      title: params.title,
      agency: params.agency,
      contactInfo: {},
      documents: [],
      deadlines: {},
      submissionInstructions: {
        method: 'Manual Retrieval Required',
        requirements: [
          'Identify the issuing agency',
          'Visit their procurement website',
          'Search for solicitation by number or title',
          'Contact procurement office if documents not online',
        ],
      },
      retrievalDate: new Date().toISOString(),
      fullDescription: `Source could not be automatically identified. Manual retrieval required.`,
    };
  }

  /**
   * Get state portal URL based on location
   */
  private getStatePortalUrl(location: string): string {
    const statePortals: Record<string, string> = {
      TEXAS: 'https://www.txsmartbuy.com/sp',
      CALIFORNIA: 'https://caleprocure.ca.gov',
      'NEW YORK': 'https://online.ogs.ny.gov/purchase/',
      FLORIDA: 'https://www.myflorida.com/apps/vbs/vbs_www.main_menu',
      ILLINOIS: 'https://www.illinois.gov/cms/business/sell/',
      PENNSYLVANIA: 'https://www.dgs.pa.gov/',
      OHIO: 'https://www.ohio.gov/business/procurement',
      GEORGIA: 'https://ssl.doas.state.ga.us/gpr/',
      'NORTH CAROLINA': 'https://www.ips.state.nc.us/',
      MICHIGAN: 'https://www.michigan.gov/sigmavss',
      'NEW JERSEY': 'https://www.njstart.gov/',
      VIRGINIA: 'https://www.eva.virginia.gov/',
      WASHINGTON: 'https://omwbe.wa.gov/',
      ARIZONA: 'https://procure.az.gov/',
      MASSACHUSETTS: 'https://www.commbuys.com/',
      TENNESSEE: 'https://www.tn.gov/generalservices/procurement.html',
      INDIANA: 'https://www.in.gov/idoa/procurement/',
      MISSOURI: 'https://www.mda.mo.gov/about/boards/',
      MARYLAND: 'https://procurement.maryland.gov/',
      WISCONSIN: 'https://vendornet.state.wi.us/',
    };

    for (const [state, url] of Object.entries(statePortals)) {
      if (location.includes(state)) {
        return url;
      }
    }

    return 'https://www.usa.gov/state-government';
  }
}

export default UniversalSolicitationRetriever;
