/**
 * AI Staff Learning Service
 * Manages learning materials for DEPOINTE AI staff members
 */

import { LearningMaterial } from '../../components/DEPOINTEStaffRoster';
import { mspMarketingStrategies } from './MSPMarketingLearningData';

export class AIStaffLearningService {
  /**
   * Get learning materials for a specific AI staff member
   */
  static getLearningMaterialsForStaff(staffId: string): LearningMaterial[] {
    // Check if we have predefined materials for this staff member
    if (staffId in predefinedLearningMaterials) {
      return predefinedLearningMaterials[staffId];
    }

    // If no predefined materials, generate some based on marketing strategies
    return this.generateLearningMaterialsFromStrategies(staffId);
  }

  /**
   * Generate learning materials from marketing strategies
   */
  private static generateLearningMaterialsFromStrategies(
    staffId: string
  ): LearningMaterial[] {
    const materials: LearningMaterial[] = [];
    const relevantStrategies = mspMarketingStrategies.filter((strategy) =>
      strategy.relevantRoles.some((role) =>
        role.toLowerCase().includes(staffId.toLowerCase())
      )
    );

    relevantStrategies.forEach((strategy) => {
      materials.push({
        id: `${staffId}-${strategy.id}`,
        title: strategy.title,
        description: strategy.description,
        type: 'strategy',
        proficiency: 'intermediate',
        content: `
${strategy.description}

Implementation Steps:
${strategy.implementationSteps.map((step) => `- ${step}`).join('\n')}

Expected Results:
${strategy.expectedResults.map((result) => `- ${result}`).join('\n')}

Common Mistakes to Avoid:
${strategy.commonMistakes.map((mistake) => `- ${mistake}`).join('\n')}

AI Applications:
${strategy.aiApplication.map((app) => `- ${app}`).join('\n')}
        `,
        lastUpdated: new Date().toISOString().split('T')[0],
      });
    });

    return materials;
  }

  /**
   * Add a new learning material for a staff member
   */
  static addLearningMaterial(
    staffId: string,
    material: Omit<LearningMaterial, 'id' | 'lastUpdated'>
  ): LearningMaterial {
    const newMaterial: LearningMaterial = {
      ...material,
      id: `${staffId}-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    // In a real application, this would persist to a database
    // For now, we'll just return the new material
    return newMaterial;
  }
}

// Predefined learning materials for specific staff members
const predefinedLearningMaterials: Record<string, LearningMaterial[]> = {
  will: [
    {
      id: 'will-freight-discovery',
      title: 'Freight & Logistics Discovery Questions Framework',
      description:
        'Transportation-focused discovery system for uncovering shipping pain points and closing freight deals',
      type: 'process',
      proficiency: 'expert',
      content: `
# Freight & Logistics Discovery Questions Framework

This comprehensive discovery system helps uncover transportation pain points and close freight brokerage deals through strategic questioning tailored to logistics challenges.

## Freight & Transportation Pain Questions
*Uncovering shipping and logistics challenges*

### Core Transportation Pain Discovery
1. "What shipping challenges are you facing that could derail your operations six months from now?"
2. "Why would delayed or failed shipments be catastrophic for your business?"
3. "Help me understand the most frustrating challenges you face with your current freight operations?"
4. "How satisfied are you with your current carrier network and shipping reliability?"
5. "How highly does freight cost control rank on your operational priorities?"
6. "Is freight reliability your biggest concern, or are there other logistics issues more pressing?"

### Shipping Pain Clarification
7. "If you could solve any transportation challenge instantly, what would have the biggest impact?"
8. "I know you probably get calls from brokers daily. What made this conversation worth your time?"
9. "Help me understand exactly what's happening with your freight that's causing problems?"
10. "Can you give me a specific example of a recent shipping issue that cost you?"
11. "How long have you been dealing with unreliable carriers? How often do shipments get delayed?"
12. "What freight solutions have you tried? How did those work out for your operations?"

## Transportation Impact Questions
*Quantifying the cost of freight problems*

### Business Impact Discovery
13. "Walk me through how shipping delays are affecting your customer relationships and bottom line?"
14. "What's the ripple effect when a critical shipment gets delayed or damaged?"
15. "How are freight issues impacting your ability to serve customers and grow the business?"
16. "Who else gets affected when shipments fail - your customers, sales team, operations?"
17. "What's the real cost of freight problems - including lost customers, expedited shipping, overtime?"
18. "How is dealing with unreliable carriers affecting you personally as a decision maker?"
19. "What's pushing you to find better freight solutions now versus continuing with current carriers?"

### Specific Transportation Impact Probing
20. "How are shipping delays affecting your customer satisfaction scores and retention?"
21. "What are the downsides when carriers don't show up or deliveries are late?"
22. "What effect does freight uncertainty have on your production planning?"
23. "How often do shipping problems cause you to lose customers or orders?"
24. "What does poor carrier performance result in for your operations team?"
25. "How often do freight issues lead to emergency expedited shipments?"

## Freight Solution Questions
*Understanding transportation needs and positioning your brokerage*

### Transportation Solution Discovery
26. "How critical is solving your freight challenges compared to other operational priorities?"
27. "What kind of carrier network and freight solutions do you think would solve these shipping issues?"
28. "Have you considered working with a freight broker who has vetted carriers and real-time tracking? How would that help?"
29. "What advantages do you see from having reliable carriers, competitive rates, and full visibility?"
30. "How would consistent on-time deliveries and proactive communication benefit your operations?"

### Transportation Value Quantification
31. "What would reliable freight service with 98% on-time delivery be worth to your business?"
32. "What transportation improvement would have the biggest impact on your bottom line?"
33. "Why is solving your freight challenges personally important to you as a leader?"

## Freight Decision & Closing Questions
*Securing transportation partnerships*

### Transportation Decision Process
34. "What's changed with your shipping needs since we last spoke?"
35. "Walk me through how your company typically evaluates and selects new freight partners?"
36. "Who needs to be involved in approving a new freight broker - operations, procurement, finance? What does each person care about most?"
37. "How do you typically structure freight partnerships - contract rates, spot market, or hybrid?"

### Freight Partnership Closing
38. "What needs to happen for us to start handling your freight by [specific date]?"
39. "What could prevent us from becoming your primary freight partner?"
40. "Is there any reason we shouldn't move forward with a trial shipment this week?"

## Freight Sales Implementation Strategy

### Transportation Question Sequencing
- Start with shipping pain points to establish freight needs
- Progress to cost/impact questions to build urgency around reliable service
- Move to solution fit to position your brokerage capabilities
- End with decision process to secure freight partnership

### Freight Conversation Flow
- Use follow-up questions to understand specific shipping challenges
- Ask for examples of recent freight failures and their costs
- Connect shipping problems to customer satisfaction and revenue impact
- Map decision criteria to your carrier network and service capabilities

### Freight Brokerage Key Principles
- Create urgency through shipping failure consequences
- Quantify freight costs in total business impact terms
- Map transportation decision process early
- Position reliability and service as competitive advantages
- Focus on partnership rather than transactional relationships
      `,
      lastUpdated: '2025-01-15',
    },
    {
      id: 'will-consultative-freight-sales',
      title: 'Consultative Freight Sales Process',
      description:
        'Advanced freight brokerage sales methodology combining transparency with consultative approach',
      type: 'process',
      proficiency: 'expert',
      content: `
# Consultative Freight Sales Process

Advanced sales methodology that combines radical transparency with consultative questioning to build trust-based freight partnerships.

## Sales Process Overview

### Phase 1: Disarmament Through Transparency
- Acknowledge industry realities and common broker failures
- Use honesty to differentiate from competitors who overpromise
- Build immediate credibility through realistic expectations

### Phase 2: Consultative Discovery
- Analyze freight patterns (lane-based vs. project-based)
- Uncover past negative experiences with brokers
- Identify specific pain points and operational challenges

### Phase 3: Value-Based Positioning
- Reframe cost discussions to include total operational impact
- Position service quality as competitive advantage
- Offer low-risk trial to demonstrate capabilities

## Freight Pattern Analysis Framework

### Lane-Based Freight Operations
**Discovery Questions:**
- "How often do you add new lanes or new customers?"
- "What's been the most challenging lanes for you in the last few months?"
- "How do you typically handle capacity issues on your core lanes?"

**Sales Approach:**
- Focus on consistency and reliability for established routes
- Emphasize carrier relationships and lane expertise
- Offer contract rates for predictable volume

### Project-Based Freight Operations
**Discovery Questions:**
- "How far in the future are your typical lead times for these projects?"
- "What are your normal lead times - week, month, or 6 months to plan?"
- "How do project changes affect your transportation requirements?"

**Sales Approach:**
- Emphasize flexibility and rapid response capabilities
- Focus on problem-solving and logistics consultation
- Offer scalable solutions for varying project needs

## Pain Point Discovery Methodology

### Past Experience Analysis
"The last broker agent that you decided to stop working with, could you tell me more about what happened and why?"

**Listen For:**
- Communication failures
- Pricing issues or bait-and-switch tactics
- Service reliability problems
- Lack of proactive problem-solving

### Current Challenge Assessment
"What's the most challenging part about working with broker agents?"

**Common Responses and Positioning:**
- **"They disappear when problems arise"** → Position your direct accessibility
- **"Pricing isn't transparent"** → Emphasize honest, upfront pricing
- **"They don't understand our business"** → Demonstrate industry knowledge
- **"No proactive communication"** → Highlight your communication process

## Value Reframing Techniques

### Total Cost of Poor Service
"Think about the last time you had a shipment go wrong. How much time did you and your team spend chasing down answers, dealing with the fallout, and doing damage control with your customer? That's a real cost, isn't it?"

### Operational Impact Analysis
- Quantify time spent on freight issues
- Calculate cost of expedited shipping
- Assess customer satisfaction impact
- Evaluate team productivity losses

## Implementation Strategy

### Critical Success Factors
1. **Authentic Delivery:** Must genuinely practice radical transparency
2. **Active Listening:** Focus on understanding, not just responding
3. **Empathetic Validation:** Acknowledge and validate their frustrations
4. **Consultative Positioning:** Be advisor, not just service provider

### Conversation Management
- Use transparency script to disarm skepticism
- Transition to discovery questions based on their responses
- Adapt approach based on freight patterns identified
- Close with low-risk trial opportunity

### Follow-Up Strategy
- Document all pain points and requirements discovered
- Prepare customized solution presentation
- Reference specific challenges mentioned in discovery
- Maintain transparency promise throughout relationship

This consultative approach transforms freight sales from transactional pitches to strategic partnerships built on trust and understanding.
      `,
      lastUpdated: '2025-01-15',
    },
  ],
  gary: [
    {
      id: 'gary-freight-qualification',
      title: 'Freight Lead Qualification Framework',
      description:
        'Transportation-focused lead qualification system for freight prospects',
      type: 'process',
      proficiency: 'advanced',
      content: `
# Freight Lead Qualification Framework

Specialized qualification system for freight and logistics prospects, focusing on shipping volumes, pain points, and decision authority.

## Transportation Pain Discovery for Lead Qualification

### Initial Freight Qualification Questions
- "What shipping challenges could seriously impact your business in the next 6 months?"
- "How critical is reliable freight service to your operational success?"
- "What's pushing you to evaluate new transportation options right now?"

### Freight Pain Validation Questions
- "Can you give me an example of a recent shipping failure and how it affected operations?"
- "How often do you deal with carrier no-shows, delays, or damaged freight?"
- "What freight solutions have you tried? How did they perform for your needs?"

## Freight Impact Assessment for Lead Scoring

### Transportation Business Impact Questions
- "How do shipping delays and failures impact your customer relationships?"
- "Who gets affected when freight doesn't move on time - customers, production, sales?"
- "What's the real cost of freight problems including expedited shipping and lost business?"

### Freight Urgency Indicators
- "What would happen to your business if shipping problems got worse over the next 6 months?"
- "What's the ripple effect when critical shipments fail or get delayed?"

## Freight Decision Process Mapping

### Transportation Authority and Process Questions
- "Walk me through how your company typically selects and approves new freight partners?"
- "Who's involved in freight decisions - operations, procurement, finance? What does each care about?"
- "How do you structure freight partnerships - contract rates, spot pricing, or volume commitments?"

### Freight Qualification Scoring Matrix
- Shipping Volume: Monthly freight spend and shipment frequency
- Pain Level: Severity and frequency of current freight issues
- Authority: Decision maker access and influence level
- Timeline: Urgency for new freight solutions
- Fit: Match between needs and our carrier network/capabilities

## Freight Lead Scoring Implementation
Score prospects based on shipping volume, pain severity, decision authority, and solution fit to prioritize sales efforts.
      `,
      lastUpdated: '2025-01-15',
    },
  ],
  cliff: [
    {
      id: 'cliff-freight-cold-outreach',
      title: 'Cold Freight Prospect Discovery',
      description:
        'Transportation-focused cold outreach framework for freight prospects',
      type: 'process',
      proficiency: 'advanced',
      content: `
# Cold Freight Prospect Discovery Framework

Specialized discovery questions for engaging cold transportation prospects and uncovering shipping pain points from initial contact.

## Opening Discovery Questions for Cold Freight Prospects

### Transportation-Focused Attention Grabbers
- "I know you probably get calls from freight brokers daily. What made you take this call about your shipping challenges?"
- "What are the biggest headaches you're dealing with in your current freight operations?"
- "How satisfied are you with your current carriers' reliability and communication?"

### Freight Permission-Based Discovery
- "Mind if I ask what's driving changes in your shipping requirements right now?"
- "Can you help me understand what transportation challenges could impact your business in the coming months?"

## Building Freight Rapport Through Discovery

### Transportation Industry-Specific Questions
- Reference seasonal shipping patterns or industry trends
- Ask about specific freight challenges common to their sector (manufacturing, retail, etc.)
- Mention relevant transportation regulations or market conditions

### Freight Personal Impact Questions
- "How do shipping delays and carrier issues affect your daily operations management?"
- "What's the personal stress level when critical shipments are at risk?"

## Qualifying Cold Freight Prospects

### Quick Freight Qualification Framework
1. Shipping Volume (Do they have enough freight to be profitable?)
2. Pain Level (Are current freight issues significant enough to change?)
3. Authority (Can they influence or make transportation decisions?)
4. Timeline (When do they need better freight solutions?)

### Freight Conversation Progression
- Start with common transportation pain points for their industry
- Use freight discovery to demonstrate transportation expertise
- Transition from shipping problems to solution capabilities
- Secure freight trial or detailed needs assessment

### Cold Freight Prospect Scoring
- High Priority: High volume + high pain + decision authority + urgent timeline
- Medium Priority: Moderate volume + some pain + influence + flexible timeline
- Low Priority: Low volume + minimal pain + no authority + no urgency

This framework helps transform cold freight conversations into qualified shipping opportunities through strategic transportation discovery.
      `,
      lastUpdated: '2025-01-15',
    },
  ],
  desiree: [
    {
      id: 'desiree-resistance-removal',
      title: 'Resistance Removal Sales System',
      description: 'Advanced techniques for overcoming prospect resistance',
      type: 'strategy',
      proficiency: 'expert',
      content: `
# Resistance Removal Sales System

This advanced sales methodology focuses on identifying and addressing resistance patterns in prospects before they become objections. The system uses psychological triggers and value-based communication to create a path of least resistance to closing.

## Key Components

1. **Resistance Pattern Recognition**
   - Identify verbal and non-verbal resistance cues
   - Categorize resistance types (price, trust, timing, need)
   - Map resistance to appropriate response strategies

2. **Pre-emptive Objection Handling**
   - Address common objections before they're raised
   - Frame solutions in context of prospect's specific concerns
   - Use social proof tailored to resistance type

3. **Value-Based Communication Framework**
   - Shift focus from price to value proposition
   - Quantify benefits in prospect's business terms
   - Create compelling ROI narratives

4. **Psychological Triggers**
   - Authority positioning without arrogance
   - Scarcity and urgency creation (ethical approaches)
   - Consistency and commitment techniques

## Implementation Process

1. Begin with thorough prospect research
2. Identify likely resistance patterns based on prospect profile
3. Prepare tailored value propositions addressing specific resistance
4. Practice pre-emptive objection handling
5. Develop rapport-building questions that reveal hidden concerns
6. Create customized social proof examples
7. Prepare follow-up sequences based on resistance level

## Success Metrics

- 75% reduction in standard objections
- 40% shorter sales cycles
- 35% higher average deal size
- 90% increase in prospect engagement
      `,
      lastUpdated: '2025-07-15',
    },
    {
      id: 'desiree-unseen-leadership',
      title: 'Unseen Leadership Implementation',
      description:
        'Applying the 49 factors of Unseen Leadership in sales conversations',
      type: 'skill',
      proficiency: 'advanced',
      content: `
# Unseen Leadership Implementation

The Unseen Leadership framework provides 49 psychological factors that create influence without obvious manipulation. This system allows sales professionals to guide prospects through the decision-making process while maintaining authentic relationships.

## The 49 Factors (Key Selection)

1. **Perceived Authority**
   - Establish expertise through specific knowledge demonstration
   - Use industry-specific terminology appropriately
   - Reference relevant case studies and results

2. **Cognitive Ease**
   - Simplify complex concepts into digestible frameworks
   - Create mental shortcuts for decision-making
   - Reduce friction points in the sales process

3. **Value Perception Shifting**
   - Reframe price discussions into investment discussions
   - Connect features directly to business outcomes
   - Quantify intangible benefits

4. **Decision Ownership**
   - Guide prospects to reach conclusions independently
   - Use Socratic questioning techniques
   - Create "aha moments" through guided discovery

5. **Emotional Intelligence Application**
   - Read and respond to emotional cues
   - Match communication style to prospect's preferences
   - Create emotional connections to solutions

## Implementation Techniques

- Begin each interaction with authority-building statements
- Use strategic pausing to allow for cognitive processing
- Ask questions that lead to self-discovery of needs
- Present information in prospect's preferred learning style
- Create momentum through incremental commitments

## Measuring Effectiveness

- Prospect engagement duration
- Question quality and depth
- Information volunteered without prompting
- Decision speed and confidence
- Referral likelihood
      `,
      lastUpdated: '2025-07-10',
    },
    {
      id: 'desiree-emotional-intelligence',
      title: 'Emotional Intelligence in Sales',
      description:
        'Leveraging emotional intelligence to build stronger client relationships',
      type: 'skill',
      proficiency: 'intermediate',
      content: `
# Emotional Intelligence in Sales

Emotional intelligence (EQ) is the ability to recognize, understand and manage your own emotions while also recognizing, understanding and influencing the emotions of others. In sales, high EQ is directly correlated with performance and relationship building.

## Core EQ Components for Sales

1. **Self-Awareness**
   - Recognize your emotional triggers during negotiations
   - Understand how your communication style affects prospects
   - Identify your strengths and weaknesses in different sales scenarios

2. **Self-Regulation**
   - Manage reactions to rejection or objections
   - Maintain composure during difficult conversations
   - Adapt approach based on self-awareness insights

3. **Motivation**
   - Sustain optimism and persistence through sales cycles
   - Set and pursue meaningful goals beyond quotas
   - Recover quickly from setbacks

4. **Empathy**
   - Recognize prospect emotions even when unstated
   - Understand client needs from their perspective
   - Adapt communication to prospect's emotional state

5. **Social Skills**
   - Build rapport quickly and authentically
   - Navigate complex stakeholder relationships
   - Resolve conflicts constructively

## Practical Applications

- Begin calls with genuine connection before business discussion
- Use reflective listening techniques to demonstrate understanding
- Validate emotions before addressing logical concerns
- Match communication pace and style to the prospect
- Read non-verbal cues in meetings and adjust approach accordingly

## Development Exercises

1. Emotion logging after calls to identify patterns
2. Role-playing difficult scenarios with feedback
3. Active listening practice with team members
4. Video review of sales calls with emotional intelligence focus
5. Stakeholder mapping with emotional considerations
      `,
      lastUpdated: '2025-07-12',
    },
    {
      id: 'desiree-radical-transparency',
      title: 'Radical Transparency Freight Sales Method',
      description:
        'Advanced freight brokerage sales approach using honesty and transparency to build trust',
      type: 'strategy',
      proficiency: 'expert',
      content: `
# Radical Transparency Freight Sales Method

This sophisticated sales technique uses radical honesty about logistics realities to build immediate trust and differentiate from competitors who overpromise.

## Core Philosophy
Instead of guaranteeing perfection, guarantee unwavering effort, honesty, and commitment to client success. Acknowledge industry unpredictability to position yourself as a problem-solver and dedicated partner.

## The Radical Transparency Script Framework

### Opening Disarmament
"Mr. Shipper, I know you get calls from broker agents all day promising you the world—cheaper rates, flawless service, the whole nine yards. I'm going to be a little different."

### Reality Acknowledgment
"I can't sit here and guarantee that there won't be challenges if we get the opportunity to work together. If I did, you'd know I was lying 'cause that's not how logistics works. Right?"

**Key Point:** Pause and wait for agreement. This creates engagement and shared understanding.

### The Guarantee Pivot
"Trucks break down, weather delays shipments, and sometimes, despite everyone's best efforts, things just go sideways. I'm not going to pretend those realities don't exist. But here's what I can guarantee: You will never find another broker agent that will work harder for you or will be more honest and transparent through every step of the process."

### Value Proposition Detail
"When a problem does arise—and let's be honest, at some point, one will—I'm not going to hide from your call. You're not going to get a generic customer service line. You're going to get me, on my cell, and I'm going to tell you exactly what's happening, what I'm doing to fix it, and what our options are."

### Competitive Differentiation
"When I quote you a price, it's a real price, not a bait-and-switch. My goal is to go above and beyond to make you look good to not only your peers but even your boss. I want your transportation to be something you don't have to worry about."

### Cost Reframing
"Think about the last time you had a shipment go wrong. How much time did you and your team spend chasing down answers, dealing with the fallout, and doing damage control with your customer? That's a real cost, isn't it?"

### Assumptive Close
"If that's the type of guy you wanna work with, then I'm your man. The only question left is, if I promise I will not let you down, are you willing to give me one opportunity to show you what I can do? Let's start with one load."

## Advanced Discovery Questions

### Freight Pattern Analysis
- "Is your freight more consistent and lane-based or is it more project-based/driven, where it changes frequently?"

**If Lane-Based:**
- "How often do you add new lanes or new customers?"
- "With all the volatility in the market today, what's been the most challenging lanes for you in the last few months?"

**If Project-Based:**
- "How far in the future are your typical lead times for these types of projects?"
- "What are your normal lead times - do you get a week, a month, or 6 months to plan?"

### Pain Point Discovery
- "The last broker agent that you decided to stop working with, could you tell me more about what happened and why?"
- "What's the most challenging part about working with broker agents?"

## Two-Step Methodology

### Step 1: Disarm Them
- Use radical transparency to lower defenses
- Acknowledge industry realities they've experienced
- Position yourself as different from typical brokers

### Step 2: Take Consultative Approach
- Ask detailed discovery questions about their freight patterns
- Listen to past negative experiences with brokers
- Position your service as the solution to their specific pain points

## Implementation Keys

### Critical Success Factors
1. **Authenticity:** Must genuinely believe in and practice radical transparency
2. **Listening:** After script delivery, stop talking and listen intently
3. **Empathy:** Acknowledge and validate their past frustrations
4. **Low-Risk Ask:** Start with one load to prove value

### Conversation Flow Management
- Deliver core message confidently
- Pause for engagement and agreement
- Listen to their responses and concerns
- Adapt based on their freight patterns (lane vs. project-based)
- Use their past negative experiences to differentiate

This method transforms the typical broker pitch from promises to partnership, creating trust-based relationships that lead to long-term freight partnerships.
      `,
      lastUpdated: '2025-01-15',
    },
  ],
  cliff: [
    {
      id: 'cliff-cold-prospect',
      title: 'Cold Prospect Engagement',
      description: 'Techniques for engaging cold prospects effectively',
      type: 'process',
      proficiency: 'expert',
      content: `
# Cold Prospect Engagement System

This comprehensive approach to cold prospect engagement focuses on creating meaningful connections with prospects who have no prior relationship with your company. The system emphasizes research-based personalization, value-first communication, and systematic follow-up.

## Initial Research Framework

1. **Company Intelligence Gathering**
   - Recent news and press releases
   - Leadership changes and strategic initiatives
   - Financial performance indicators
   - Competitive positioning

2. **Contact Profiling**
   - Professional background and career progression
   - Published content and thought leadership
   - Social media presence and engagement patterns
   - Shared connections and relationship networks

3. **Pain Point Identification**
   - Industry-specific challenges
   - Company-specific obstacles
   - Role-specific frustrations
   - Timing-based opportunities

## Engagement Sequence

1. **Value-First Touch**
   - Share relevant insight or resource
   - Connect to specific company situation
   - No ask or pitch included

2. **Recognition Touch**
   - Acknowledge achievement or milestone
   - Demonstrate genuine interest
   - Light connection request

3. **Problem-Solution Bridge**
   - Reference identified challenge
   - Provide partial solution framework
   - Suggest conversation for complete picture

4. **Direct Value Proposition**
   - Clear articulation of specific value
   - Customized to research findings
   - Low-friction call to action

## Multi-Channel Orchestration

- Alternate between email, phone, social, and video
- Maintain consistent messaging across channels
- Adapt channel selection to prospect preferences
- Increase personalization with each touch

## Success Metrics

- 30% response rate on initial sequence
- 15% meeting conversion rate
- 60% engagement with shared content
- 45% connection acceptance rate
      `,
      lastUpdated: '2025-07-08',
    },
  ],
  gary: [
    {
      id: 'gary-lead-scoring',
      title: 'Lead Scoring Algorithms',
      description: 'Advanced algorithms for qualifying and scoring leads',
      type: 'process',
      proficiency: 'expert',
      content: `
# Advanced Lead Scoring Algorithm System

This comprehensive lead scoring system combines demographic, firmographic, behavioral, and engagement data to accurately predict lead quality and conversion probability. The multi-factor approach ensures balanced evaluation and prioritization of sales efforts.

## Scoring Components

### Firmographic Factors (30%)
- Company size (revenue and employees)
- Industry vertical and sub-segment
- Geographic location
- Growth trajectory
- Technology stack compatibility
- Regulatory environment

### Behavioral Signals (35%)
- Website engagement patterns
- Content consumption depth
- Form submission behavior
- Email interaction history
- Social media engagement
- Webinar/event participation

### Engagement Recency (15%)
- Last website visit
- Last content interaction
- Last communication response
- Engagement trend (increasing/decreasing)
- Engagement consistency

### Buying Intent Signals (20%)
- Solution-specific page visits
- Pricing page engagement
- Competitor comparison research
- Bottom-funnel content consumption
- Direct inquiries or questions
- Budget-related discussions

## Scoring Implementation

1. **Data Collection Framework**
   - CRM integration points
   - Marketing automation tracking
   - Website behavior monitoring
   - Third-party intent data sources
   - Sales interaction logging

2. **Scoring Calculation**
   - Weighted attribute scoring
   - Behavioral pattern recognition
   - Engagement velocity measurement
   - Decay factors for aging signals
   - Threshold establishment for qualification

3. **Segmentation & Routing**
   - Score-based lead categorization
   - Automated routing rules
   - Personalized nurture assignment
   - Sales priority designation
   - Re-engagement triggers

## Performance Optimization

- Monthly scoring model review
- Conversion correlation analysis
- Closed-loop feedback integration
- A/B testing of scoring weights
- Machine learning enhancement
      `,
      lastUpdated: '2025-07-05',
    },
  ],
  dee: [
    {
      id: 'dee-freight-brokerage-mastery',
      title: 'Advanced Freight Brokerage Sales Mastery',
      description:
        'Complete freight brokerage methodology combining transparency, discovery, and relationship building',
      type: 'strategy',
      proficiency: 'expert',
      content: `
# Advanced Freight Brokerage Sales Mastery

Comprehensive freight brokerage sales methodology that combines radical transparency, advanced discovery, and consultative selling to build long-term shipper partnerships.

## Core Freight Brokerage Philosophy

### The Transparency Advantage
- Acknowledge logistics realities upfront to build immediate credibility
- Differentiate from brokers who overpromise and underdeliver
- Position yourself as a trusted advisor, not just a service provider
- Use honesty as your primary competitive advantage

### Partnership Over Transactions
- Focus on building long-term relationships, not one-time deals
- Understand shipper's business beyond just freight needs
- Become an extension of their logistics team
- Provide value beyond just moving freight

## The Complete Freight Sales Process

### Phase 1: Radical Transparency Opening
**Script Framework:**
"Mr. Shipper, I know you get calls from broker agents all day promising you the world—cheaper rates, flawless service, the whole nine yards. I'm going to be a little different. I can't sit here and guarantee that there won't be challenges if we get the opportunity to work together. If I did, you'd know I was lying 'cause that's not how logistics works. Right?"

**Key Elements:**
- Acknowledge industry realities
- Create shared understanding of logistics challenges
- Build immediate trust through honesty
- Differentiate from typical broker pitches

### Phase 2: Advanced Freight Discovery

#### Freight Pattern Analysis
"Is your freight more consistent and lane-based or is it more project-based/driven, where it changes frequently?"

**Lane-Based Operations:**
- "How often do you add new lanes or new customers?"
- "What's been the most challenging lanes for you in the last few months?"
- "How do you handle capacity issues on your established routes?"

**Project-Based Operations:**
- "How far in the future are your typical lead times for these projects?"
- "What are your normal lead times - week, month, or 6 months to plan?"
- "How do project changes affect your transportation requirements?"

#### Pain Point Discovery
"The last broker agent that you decided to stop working with, could you tell me more about what happened and why?"

**Listen For:**
- Communication breakdowns during problems
- Pricing transparency issues
- Service reliability failures
- Lack of proactive problem-solving

#### Current Challenge Assessment
"What's the most challenging part about working with broker agents?"

**Common Responses and Your Positioning:**
- **"They disappear when problems arise"** → "You'll have my direct cell number"
- **"Pricing isn't transparent"** → "Real pricing, no bait-and-switch"
- **"They don't understand our business"** → Demonstrate industry knowledge
- **"No proactive communication"** → Outline your communication process

### Phase 3: Value Positioning and Guarantee

#### The Service Guarantee
"Here's what I can guarantee: You will never find another broker agent that will work harder for you or will be more honest and transparent through every step of the process."

#### Specific Value Propositions
- **Direct Access:** "When a problem arises, you're not getting a generic customer service line. You're getting me, on my cell."
- **Transparent Communication:** "I'm going to tell you exactly what's happening, what I'm doing to fix it, and what our options are."
- **Honest Pricing:** "When I quote you a price, it's a real price, not a bait-and-switch."
- **Partnership Focus:** "My goal is to make you look good to your peers and your boss."

#### Cost Reframing
"Think about the last time you had a shipment go wrong. How much time did you and your team spend chasing down answers, dealing with the fallout, and doing damage control with your customer? That's a real cost, isn't it?"

### Phase 4: Trial Close and Partnership Building

#### The Low-Risk Proposition
"If that's the type of guy you wanna work with, then I'm your man. The only question left is, if I promise I will not let you down, are you willing to give me one opportunity to show you what I can do? Let's start with one load."

#### Follow-Up Strategy
- Document all discovered pain points and requirements
- Prepare customized solution presentation
- Reference specific challenges mentioned in discovery
- Maintain transparency promise throughout relationship

## Advanced Freight Relationship Management

### Proactive Communication Protocol
1. **Pre-Pickup:** Confirm carrier assignment and pickup window
2. **In-Transit:** Regular updates on shipment progress
3. **Delivery:** Confirmation and any delivery issues
4. **Post-Delivery:** Follow-up and feedback collection

### Problem Resolution Framework
1. **Immediate Notification:** Contact shipper as soon as issue is identified
2. **Situation Assessment:** Provide clear explanation of what happened
3. **Solution Options:** Present available alternatives and recommendations
4. **Follow-Up:** Ensure resolution and prevent future occurrences

### Long-Term Partnership Development
- Regular business reviews to identify new opportunities
- Market intelligence sharing relevant to their industry
- Capacity planning assistance for seasonal fluctuations
- Strategic logistics consulting beyond just freight movement

## Freight Brokerage Success Metrics

### Relationship Quality Indicators
- Response time to shipper inquiries
- Proactive communication frequency
- Problem resolution speed
- Shipper satisfaction scores

### Business Performance Metrics
- Load volume growth with existing shippers
- Shipper retention rate
- Average revenue per shipper
- Referral generation from satisfied shippers

This comprehensive approach transforms freight brokerage from transactional load booking to strategic partnership development, creating sustainable competitive advantages and long-term business growth.
      `,
      lastUpdated: '2025-01-15',
    },
    {
      id: 'gary-depointe-lead-intelligence',
      title: 'DEPOINTE Lead Intelligence System',
      description:
        'Internal B2B lead generation system using AI-powered data collection and verification',
      type: 'process',
      proficiency: 'expert',
      content: `
# DEPOINTE Lead Intelligence System

Internal lead generation platform leveraging DEPOINTE's existing data infrastructure and AI capabilities to create triple-verified freight industry contacts.

## System Architecture

### Data Sources Integration
- **TruckingPlanet Database**: 200K+ verified transportation companies
- **Government APIs**: OpenCorporates, SEC EDGAR, Census Bureau, DOL API
- **FMCSA Data**: DOT numbers, safety ratings, compliance records
- **Business Intelligence**: Financial data, market analysis, risk assessment

### Triple Verification Process
1. **Email Verification**: Real-time email validation and deliverability testing
2. **Domain Verification**: Company website validation and business legitimacy
3. **Activity Verification**: Recent business activity, social media presence, industry engagement

## Lead Generation Workflow

### Phase 1: Data Collection
- Query TruckingPlanet database for target industry segments
- Cross-reference with government databases for validation
- Enrich contact data using LinkedIn and business directories
- Verify company financial health through SEC EDGAR

### Phase 2: AI-Powered Qualification
- Apply freight-specific scoring algorithms
- Identify buying intent signals (equipment needs, expansion, violations)
- Categorize by freight volume and shipping patterns
- Prioritize based on revenue potential and decision authority

### Phase 3: Contact Enrichment
- Identify key decision makers (logistics, procurement, operations)
- Gather direct contact information (email, phone, LinkedIn)
- Research recent company news and business developments
- Create personalized outreach profiles

## Freight-Specific Lead Scoring

### High-Value Indicators (Score: 90-100)
- Recent DOT violations requiring compliance assistance
- New FMCSA authority (need guidance and loads)
- Equipment expansion or fleet growth
- Geographic expansion into new markets
- Supply chain disruptions or carrier issues

### Medium-Value Indicators (Score: 70-89)
- Seasonal shipping pattern changes
- Contract renewals or RFP processes
- New facility openings or relocations
- Industry consolidation or acquisitions
- Regulatory compliance deadlines

### Qualification Criteria
- **Shipping Volume**: Monthly freight spend and shipment frequency
- **Decision Authority**: Access to logistics and procurement decision makers
- **Pain Level**: Severity of current transportation challenges
- **Timeline**: Urgency for new freight solutions
- **Fit**: Match with DEPOINTE's service capabilities

## Advanced Search Filters

### Industry Targeting
- Manufacturing (automotive, steel, chemicals, food processing)
- Retail and E-commerce (distribution centers, fulfillment)
- Healthcare (medical equipment, pharmaceuticals)
- Construction (materials, equipment, project-based)
- Agriculture (seasonal shipping, commodity transport)

### Geographic Filters
- Major shipping lanes and freight corridors
- Port proximity and intermodal access
- Seasonal shipping pattern regions
- Economic development zones
- Disaster recovery and emergency freight needs

### Company Size Segmentation
- Enterprise: $100M+ revenue, 500+ employees
- Mid-Market: $10M-$100M revenue, 50-500 employees
- Small Business: $1M-$10M revenue, 10-50 employees
- Startups: <$1M revenue, growth potential

## AI-Enhanced Contact Research

### Decision Maker Identification
- **C-Suite**: CEO, COO, CFO (strategic decisions)
- **Operations**: VP Operations, Logistics Manager, Supply Chain Director
- **Procurement**: Purchasing Manager, Vendor Relations, Cost Control
- **Finance**: Controller, Accounts Payable, Budget Authority

### Contact Verification Process
1. **Email Validation**: Syntax, domain, and deliverability checks
2. **Phone Verification**: Number format, carrier, and reachability
3. **LinkedIn Confirmation**: Profile verification and recent activity
4. **Role Validation**: Job title accuracy and decision authority

## Integration with DEPOINTE Operations

### CRM Integration
- Automatic lead import into DEPOINTE CRM system
- Lead scoring and prioritization for AI staff assignment
- Activity tracking and engagement history
- Conversion analytics and ROI measurement

### AI Staff Assignment
- **Gary**: Lead qualification and initial scoring
- **Desiree**: High-intent prospect engagement
- **Cliff**: Cold outreach to new prospects
- **Will**: Sales process optimization and conversion
- **Dee**: Relationship building and partnership development

### Performance Metrics
- **Data Quality**: Verification accuracy and bounce rates
- **Lead Quality**: Conversion rates and deal values
- **Efficiency**: Time from lead generation to first contact
- **ROI**: Revenue generated per lead and cost per acquisition

## Competitive Advantages

### Freight Industry Specialization
- Deep understanding of transportation pain points
- Industry-specific buying signals and intent data
- Freight-focused messaging and value propositions
- Transportation compliance and regulatory expertise

### Cost Efficiency
- Leverages existing free government APIs
- No per-contact licensing fees like commercial platforms
- Internal AI processing reduces operational costs
- Scalable infrastructure with marginal cost increases

### Data Accuracy
- Multiple verification layers ensure high-quality contacts
- Real-time updates from government and industry sources
- Continuous data cleansing and validation processes
- Industry-specific data points not available elsewhere

This internal system provides DEPOINTE AI staff with superior lead generation capabilities specifically designed for freight brokerage operations.
      `,
      lastUpdated: '2025-01-15',
    },
  ],
  'ana-lyles': [
    {
      id: 'ana-data-driven',
      title: 'Data-Driven Insights',
      description: 'Extracting actionable insights from complex data sets',
      type: 'knowledge',
      proficiency: 'expert',
      content: `
# Data-Driven Insights Framework

This comprehensive framework transforms raw transportation and logistics data into actionable business intelligence. The system focuses on pattern recognition, predictive modeling, and visualization techniques to drive operational efficiency and strategic decision-making.

## Data Collection & Integration

1. **Data Source Mapping**
   - Transportation management systems
   - Fleet telematics and IoT devices
   - Customer relationship management
   - Financial performance metrics
   - Market intelligence feeds
   - Competitor benchmarking

2. **Data Quality Management**
   - Automated validation protocols
   - Missing data imputation techniques
   - Outlier detection and handling
   - Consistency checking algorithms
   - Real-time data cleansing

3. **Integration Architecture**
   - API-based real-time connections
   - Batch processing for historical analysis
   - Data lake organization structure
   - Unified data dictionary
   - Cross-system identifier mapping

## Analysis Methodologies

1. **Descriptive Analytics**
   - Performance trend identification
   - Operational efficiency metrics
   - Cost structure analysis
   - Service level achievement
   - Resource utilization patterns

2. **Diagnostic Analytics**
   - Root cause analysis frameworks
   - Performance variance explanation
   - Correlation discovery techniques
   - Factor influence quantification
   - Anomaly investigation protocols

3. **Predictive Analytics**
   - Demand forecasting models
   - Capacity planning algorithms
   - Maintenance prediction systems
   - Customer behavior modeling
   - Risk assessment frameworks

4. **Prescriptive Analytics**
   - Optimization algorithm selection
   - Scenario modeling techniques
   - Decision support frameworks
   - Automated recommendation systems
   - Continuous improvement loops

## Visualization & Communication

1. **Executive Dashboarding**
   - KPI visualization hierarchy
   - Interactive drill-down capabilities
   - Exception highlighting
   - Trend visualization techniques
   - Context-sensitive annotations

2. **Operational Reporting**
   - Real-time performance monitoring
   - Role-based information filtering
   - Action-oriented metrics
   - Comparative benchmarking
   - Alert threshold management

3. **Strategic Analysis Tools**
   - Market opportunity mapping
   - Competitive positioning visualization
   - Resource allocation optimization
   - Long-term trend projection
   - Strategic initiative tracking

## Implementation Roadmap

1. Define business questions and required insights
2. Map available data sources and identify gaps
3. Establish data governance and quality protocols
4. Develop initial descriptive analytics capabilities
5. Build diagnostic analytics for key performance areas
6. Implement predictive models for critical business processes
7. Develop prescriptive capabilities for high-value decisions
8. Create visualization and communication frameworks
9. Establish feedback loops for continuous improvement
10. Scale capabilities across organization
      `,
      lastUpdated: '2025-07-01',
    },
  ],
};

export default AIStaffLearningService;
