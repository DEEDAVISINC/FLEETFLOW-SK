# FleetFlow R&D Project Log - 2025

## Qualified Research Activities Documentation

**Company**: DEE DAVIS INC DBA DEPOINTE **Platform**: FleetFlow™ **Tax Year**: 2025 **Last
Updated**: October 8, 2025

---

## Project 1: Desiree AI Agent (Lead Generation)

**Project ID**: RD-2025-001 **Start Date**: January 15, 2025 **End Date**: February 28, 2025
**Status**: Complete

### Technical Challenge (Uncertainty)

How do we train an AI agent to automatically identify high-quality freight broker leads from
unstructured data sources (LinkedIn, company websites, industry databases) with >80% accuracy?

### Why This Was Uncertain

- No existing AI model trained on freight broker lead qualification
- Unclear which data points predict lead quality (revenue, fleet size, location, etc.)
- Unknown how to integrate multiple data sources in real-time
- Uncertain how to avoid false positives/negatives in lead scoring
- No established benchmarks for "quality" in freight broker leads

### Alternatives Evaluated

1. **Rule-based system** - Too rigid, couldn't adapt to market changes
2. **Simple keyword matching** - Too many false positives
3. **GPT-4 with custom prompts** - CHOSEN - 87% accuracy achieved
4. **Fine-tuned model** - Too expensive to train, limited data

### Solution Implemented

- GPT-4 with industry-specific prompt engineering
- Multi-source data aggregation (LinkedIn, company websites, FMCSA)
- Weighted scoring algorithm based on 15+ data points
- Real-time validation against historical conversion data

### Business Component

AI-powered lead generation system that replaces manual prospecting

### Qualified Expenses

- Developer wages (Dieasha Davis): 320 hours × $250/hr = $80,000
- OpenAI API costs: $1,850
- LinkedIn API costs: $500
- Cloud hosting (testing environment): $180
- **Total QRE**: $82,530

### Supporting Documentation

- GitHub commits: 147 commits (Jan 15 - Feb 28, 2025)
- Branch: `feature/desiree-ai-agent`
- Files: `app/services/DesireeLead GenerationService.ts`
- Testing results: `tests/lead-generation-accuracy-report.md`

---

## Project 2: Cliff AI Agent (Market Research & Intelligence)

**Project ID**: RD-2025-002 **Start Date**: February 1, 2025 **End Date**: March 15, 2025
**Status**: Complete

### Technical Challenge (Uncertainty)

How do we build an AI agent that can analyze market trends, competitor pricing, and industry news in
real-time to provide actionable intelligence?

### Why This Was Uncertain

- No existing AI model for freight market analysis
- Unclear how to parse unstructured industry news and extract insights
- Unknown how to correlate multiple data sources (DAT rates, news, weather, fuel prices)
- Uncertain how to present complex data in actionable format
- Real-time data processing at scale was unproven

### Alternatives Evaluated

1. **Manual data aggregation** - Not scalable, too slow
2. **Pre-built market intelligence tools** - Too expensive, not customizable
3. **Custom AI with web scraping + NLP** - CHOSEN - Real-time insights achieved
4. **Batch processing overnight** - Too slow for real-time decisions

### Solution Implemented

- Web scraping with Puppeteer for industry news
- Natural language processing for sentiment analysis
- Real-time data correlation across 8+ sources
- Automated report generation every 4 hours

### Business Component

AI-powered market intelligence system for competitive advantage

### Qualified Expenses

- Developer wages (Dieasha Davis): 280 hours × $250/hr = $70,000
- OpenAI API costs: $1,200
- Web scraping infrastructure: $450
- Data storage: $120
- **Total QRE**: $71,770

### Supporting Documentation

- GitHub commits: 132 commits (Feb 1 - Mar 15, 2025)
- Branch: `feature/cliff-market-research`
- Files: `app/services/MarketResearchService.ts`
- Performance benchmarks: `docs/market-intelligence-performance.md`

---

## Project 3: Multi-Tenant SaaS Architecture

**Project ID**: RD-2025-003 **Start Date**: February 1, 2025 **End Date**: April 30, 2025
**Status**: Complete

### Technical Challenge (Uncertainty)

How do we build a secure, scalable multi-tenant architecture that isolates tenant data while
maintaining performance and cost-efficiency?

### Why This Was Uncertain

- Multiple architectural approaches exist (separate DBs, shared DB, hybrid)
- Unknown performance impact of row-level security at scale
- Unclear how to handle tenant-specific customizations
- Uncertain about authentication/authorization across tenants
- No established pattern for tenant provisioning automation

### Alternatives Evaluated

1. **Separate database per tenant** - Too expensive, doesn't scale, complex migrations
2. **Shared database with tenant_id column** - Risk of query bugs exposing data
3. **PostgreSQL Row-Level Security (RLS)** - CHOSEN - 15% overhead, 100% isolation
4. **Schema-based isolation** - Complex migrations, limited scalability

### Solution Implemented

- PostgreSQL with Row-Level Security (RLS)
- Tenant ID embedded in JWT claims
- Middleware validation on every request
- Automated tenant provisioning system
- Supabase for database management

### Business Component

Scalable SaaS platform core that supports unlimited tenants

### Qualified Expenses

- Developer wages (Dieasha Davis): 480 hours × $250/hr = $120,000
- Supabase Pro subscription: $125
- Load testing tools: $200
- Security audit: $2,500
- **Total QRE**: $122,825

### Supporting Documentation

- GitHub commits: 287 commits (Feb 1 - Apr 30, 2025)
- Branch: `feature/multi-tenant-architecture`
- Architecture diagrams: `docs/architecture/multi-tenant-design.png`
- Load testing results: `tests/performance/multi-tenant-load-test.md`
- Security audit report: `docs/security/multi-tenant-audit-2025.pdf`

---

## Project 4: NEMT Healthcare Platform (HIPAA-Compliant)

**Project ID**: RD-2025-004 **Start Date**: March 1, 2025 **End Date**: May 31, 2025 **Status**:
Complete

### Technical Challenge (Uncertainty)

How do we build a HIPAA-compliant healthcare transportation platform with Medicaid integration and
94% AI automation?

### Why This Was Uncertain

- HIPAA compliance requirements for data encryption and access control
- Unknown how to integrate with state Medicaid systems (each state different)
- Unclear how to automate NEMT scheduling with healthcare constraints
- Uncertain about patient privacy vs. route optimization trade-offs
- No established pattern for AI-driven healthcare logistics

### Alternatives Evaluated

1. **Third-party HIPAA platform** - Too expensive, limited customization
2. **Manual compliance implementation** - Too complex, high risk
3. **Custom HIPAA-ready architecture** - CHOSEN - Full control, cost-effective
4. **Hybrid (some third-party, some custom)** - Too fragmented

### Solution Implemented

- End-to-end encryption for patient data (AES-256)
- Role-based access control (RBAC) with audit logging
- HIPAA-compliant database architecture
- Medicaid API integration (Michigan, Maryland)
- AI-powered scheduling with healthcare constraints
- NPI registration (1538939111)

### Business Component

HIPAA-compliant NEMT platform for Medicaid beneficiaries

### Qualified Expenses

- Developer wages (Dieasha Davis): 520 hours × $250/hr = $130,000
- HIPAA compliance consulting: $3,500
- Encryption infrastructure: $450
- Medicaid API integration: $1,200
- NPI registration: $250
- **Total QRE**: $135,400

### Supporting Documentation

- GitHub commits: 312 commits (Mar 1 - May 31, 2025)
- Branch: `feature/nemt-healthcare-platform`
- HIPAA compliance documentation: `docs/compliance/hipaa-implementation.md`
- Medicaid integration specs: `docs/integrations/medicaid-api-specs.md`
- NPI certificate: `docs/credentials/npi-1538939111.pdf`

---

## Project 5: 27 AI Agents Integration & Orchestration

**Project ID**: RD-2025-005 **Start Date**: April 1, 2025 **End Date**: July 31, 2025 **Status**:
Complete

### Technical Challenge (Uncertainty)

How do we make 27 specialized AI agents work together seamlessly without conflicts, redundancy, or
performance degradation?

### Why This Was Uncertain

- No existing framework for multi-agent orchestration at this scale (27 agents)
- Unknown how to prevent agents from conflicting (e.g., two agents contacting same lead)
- Unclear how to manage shared context across 27 agents
- Uncertain about performance impact of 27 concurrent AI operations
- No established pattern for agent-to-agent communication at this scale

### Alternatives Evaluated

1. **Sequential agent execution** - Too slow, poor user experience
2. **Independent agents (no coordination)** - Conflicts and redundancy
3. **Central orchestrator with task queue** - CHOSEN - Efficient coordination
4. **Event-driven architecture** - Too complex for initial implementation

### Solution Implemented

- AIAgentOrchestrator service for central coordination of 27 agents
- Task queue with priority system
- Shared context store (Redis cache)
- Agent capability registry (27 specialized roles)
- Conflict detection and resolution logic
- Performance monitoring and optimization

### Business Component

AI workforce automation with 27 specialized agents achieving 94% efficiency

### Qualified Expenses

- Developer wages (Dieasha Davis): 850 hours × $250/hr = $212,500
- OpenAI API costs (all 27 agents): $5,600
- Anthropic Claude API costs: $3,500
- Redis cache hosting: $240
- Performance monitoring tools: $400
- **Total QRE**: $222,240

### Supporting Documentation

- GitHub commits: 456 commits (Apr 1 - Jul 31, 2025)
- Branch: `feature/ai-agent-orchestration`
- Files: `app/services/AIAgentOrchestrator.ts`
- Performance benchmarks: `docs/performance/ai-orchestration-benchmarks.md`
- Agent coordination diagrams: `docs/architecture/agent-orchestration.png`

---

## Project 6: Pallet Scanning AI (Computer Vision)

**Project ID**: RD-2025-006 **Start Date**: May 1, 2025 **End Date**: August 15, 2025 **Status**:
Complete

### Technical Challenge (Uncertainty)

How do we develop computer vision AI to accurately detect freight damage, measure pallet dimensions,
and identify contents from images?

### Why This Was Uncertain

- No existing computer vision model trained on freight/pallet inspection
- Unknown accuracy achievable with image recognition for damage detection
- Unclear how to handle varying lighting conditions, angles, and image quality
- Uncertain about integration with mobile devices (camera hardware)
- No established benchmarks for freight inspection accuracy

### Alternatives Evaluated

1. **Pre-trained object detection models** - Not specific enough for freight
2. **Manual inspection with photos** - Not scalable, human error
3. **Custom-trained computer vision model** - CHOSEN - 92% accuracy achieved
4. **Third-party inspection service** - Too expensive, not integrated

### Solution Implemented

- Custom-trained TensorFlow model on 15,000 freight images
- Damage detection with 92% accuracy
- Dimension measurement using depth estimation
- Mobile app integration for real-time scanning
- Cloud-based image processing pipeline

### Business Component

Premium pallet scanning service for freight inspection

### Qualified Expenses

- Developer wages (Dieasha Davis): 420 hours × $250/hr = $105,000
- Training data acquisition: $2,500
- GPU compute for model training: $1,800
- TensorFlow infrastructure: $450
- Mobile app development: $3,200
- **Total QRE**: $112,950

### Supporting Documentation

- GitHub commits: 198 commits (May 1 - Aug 15, 2025)
- Branch: `feature/pallet-scanning-ai`
- Model training logs: `ml-models/pallet-scanning/training-logs.txt`
- Accuracy testing results: `tests/computer-vision/accuracy-report.md`
- Sample images: `assets/training-data/freight-images/`

---

## Project 7: FreightFlow RFx Government Contracting System

**Project ID**: RD-2025-007 **Start Date**: June 1, 2025 **End Date**: September 30, 2025
**Status**: Complete

### Technical Challenge (Uncertainty)

How do we automate government contract discovery, RFx document parsing, and proposal generation for
SAM.gov opportunities?

### Why This Was Uncertain

- SAM.gov API complexity and rate limiting
- Unknown how to parse complex RFx documents with varying formats
- Unclear how to generate compliant government proposals automatically
- Uncertain about WOSB/MBE certification integration
- No established pattern for AI-driven government contracting

### Alternatives Evaluated

1. **Manual SAM.gov monitoring** - Too slow, miss opportunities
2. **Simple keyword alerts** - Too many false positives
3. **AI-powered contract intelligence** - CHOSEN - Automated opportunity matching
4. **Third-party government contracting platform** - Too expensive, limited customization

### Solution Implemented

- SAM.gov API integration with daily monitoring
- NLP-based RFx document parsing
- AI-generated proposal templates
- WOSB/MBE certification auto-inclusion
- Opportunity scoring based on win probability

### Business Component

Government contracting automation system for $650B federal market

### Qualified Expenses

- Developer wages (Dieasha Davis): 380 hours × $250/hr = $95,000
- SAM.gov API integration: $800
- Document parsing AI: $1,500
- Proposal generation system: $2,200
- **Total QRE**: $99,500

### Supporting Documentation

- GitHub commits: 223 commits (Jun 1 - Sep 30, 2025)
- Branch: `feature/freightflow-rfx-system`
- Files: `app/services/FreightFlowRFxService.ts`
- SAM.gov integration docs: `docs/integrations/sam-gov-api.md`

---

## Project 8: API Integration Framework (15+ APIs)

**Project ID**: RD-2025-008 **Start Date**: January 15, 2025 **End Date**: September 30, 2025
**Status**: Ongoing

### Technical Challenge (Uncertainty)

How do we integrate 15+ third-party APIs (FMCSA, payment processors, communications, data sources)
with unified error handling, rate limiting, and failover?

### Why This Was Uncertain

- Each API has different authentication methods, rate limits, and error responses
- Unknown how to handle API failures gracefully without disrupting user experience
- Unclear how to implement unified retry logic across diverse APIs
- Uncertain about cost optimization for API usage
- No established pattern for multi-API orchestration

### Alternatives Evaluated

1. **Direct API calls in each service** - Too fragmented, hard to maintain
2. **Third-party API management platform** - Too expensive
3. **Custom API integration framework** - CHOSEN - Unified, cost-effective
4. **Microservices per API** - Too complex for current scale

### Solution Implemented

- Unified API client with standardized error handling
- Automatic retry logic with exponential backoff
- Rate limiting and request queuing
- API response caching (Redis)
- Cost monitoring and optimization
- Failover to backup APIs where available

### APIs Integrated

1. FMCSA (carrier safety data)
2. Stripe (payment processing)
3. Twilio (SMS/communications)
4. OpenAI (AI agents)
5. Anthropic Claude (AI agents)
6. LinkedIn (lead data)
7. Google Maps (routing)
8. Weather.gov (weather data)
9. Exchange Rate API (currency)
10. SAM.gov (government contracts)
11. Medicaid APIs (healthcare)
12. Supabase (database)
13. Digital Ocean (hosting)
14. SendGrid (email)
15. Slack (notifications)

### Business Component

Unified API integration framework for platform scalability

### Qualified Expenses

- Developer wages (Dieasha Davis): 520 hours × $250/hr = $130,000
- API subscription costs (testing): $3,200
- Redis caching infrastructure: $240
- API monitoring tools: $450
- **Total QRE**: $133,890

### Supporting Documentation

- GitHub commits: 387 commits (Jan 15 - Sep 30, 2025)
- Files: `app/services/*Service.ts` (15+ service files)
- API integration docs: `docs/integrations/`
- Error handling specs: `docs/architecture/api-error-handling.md`

---

## Summary: 2025 R&D Projects

| Project ID  | Project Name               | Duration         | Total QRE    | Status                    |
| ----------- | -------------------------- | ---------------- | ------------ | ------------------------- |
| RD-2025-001 | Desiree AI Agent           | 1.5 months       | $82,530      | Complete                  |
| RD-2025-002 | Cliff AI Agent             | 1.5 months       | $71,770      | Complete                  |
| RD-2025-003 | Multi-Tenant Architecture  | 3 months         | $122,825     | Complete                  |
| RD-2025-004 | NEMT Healthcare Platform   | 3 months         | $135,400     | Complete                  |
| RD-2025-005 | 27 AI Agents Orchestration | 4 months         | $222,240     | Complete                  |
| RD-2025-006 | Pallet Scanning AI         | 3.5 months       | $112,950     | Complete                  |
| RD-2025-007 | FreightFlow RFx System     | 4 months         | $99,500      | Complete                  |
| RD-2025-008 | API Integration Framework  | 9 months         | $133,890     | Ongoing                   |
| **TOTAL**   | **8 Major Projects**       | **Jan-Sep 2025** | **$981,105** | **7 Complete, 1 Ongoing** |

---

## Additional Projects (Q4 2025 - To Be Documented)

### Project 9: Strategic Sales Campaign System

**Status**: In Progress **Start Date**: September 2025 **Estimated QRE**: $15,000+

### Project 10: Social Media API Integration

**Status**: In Progress **Start Date**: October 2025 **Estimated QRE**: $8,000+

### Project 11: Email Warmup & Deliverability System

**Status**: In Progress **Start Date**: October 2025 **Estimated QRE**: $10,000+

### Project 12: Freight Broker Startup Training Knowledge Base

**Status**: In Progress **Start Date**: October 2025 **Estimated QRE**: $6,000+

---

## Estimated Total 2025 QRE

**Documented (Jan-Sep)**: $981,105 **Estimated Q4 (Oct-Dec)**: $150,000 (495 hours × $250/hr +
$27,000 supplies) **Total 2025 QRE**: **$1,131,105**

**Estimated Federal R&D Credit (14% ASC)**: **$158,355** **Estimated Michigan R&D Credit (3.9%)**:
**$44,113** **Total Estimated Credits**: **$202,468**

---

_Last Updated: October 8, 2025_ _Next Update: November 1, 2025 (Q4 projects)_ _Tax Filing: April 15,
2026_
