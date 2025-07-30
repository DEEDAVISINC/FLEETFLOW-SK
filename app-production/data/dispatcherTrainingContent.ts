// Comprehensive Freight 1st Direct Dispatcher Training Content

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  sections: TrainingSection[];
}

export interface TrainingSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'checklist' | 'procedure' | 'policy';
  importance: 'critical' | 'important' | 'helpful';
}

export const dispatcherTrainingModules: TrainingModule[] = [
  {
    id: 'operations_fundamentals',
    title: 'Module 1: Dispatch Operations Fundamentals',
    description: 'Core dispatch operations, workflow management, and best practices',
    duration: '2-3 hours',
    sections: [
      {
        id: 'daily_operations',
        title: 'Daily Operations Checklist',
        type: 'checklist',
        importance: 'critical',
        content: `
**Start of Shift:**
- Review overnight communications and urgent messages
- Check driver availability and hours of service status
- Review scheduled pickups and deliveries for the day
- Verify weather conditions along all active routes
- Check equipment status and maintenance schedules
- Update customer delivery expectations if needed

**Throughout the Day:**
- Monitor real-time GPS tracking for all active loads
- Maintain proactive customer communication
- Handle driver check-ins and route updates
- Process new load requests and quote requirements
- Coordinate with maintenance for any equipment issues
- Document all significant events and decisions

**End of Shift:**
- Complete shift handover documentation
- Update load status and delivery confirmations
- Prepare next-day dispatch assignments
- Review performance metrics and KPIs
- File all required documentation
- Brief incoming dispatcher on critical items
        `
      },
      {
        id: 'load_assignment_process',
        title: 'Load Assignment Best Practices',
        type: 'procedure',
        importance: 'critical',
        content: `
**Pre-Assignment Verification:**
1. Driver availability and current location analysis
2. Hours of Service compliance verification
3. Equipment type compatibility confirmation
4. Driver qualification and certification check
5. Route analysis for efficiency and safety
6. Customer requirements and special handling needs

**Assignment Decision Matrix:**
- Driver proximity to pickup location
- Hours of Service remaining vs. trip duration
- Equipment specifications vs. load requirements
- Driver experience with similar freight types
- Customer preference or restricted driver lists
- Fuel efficiency and route optimization potential

**Post-Assignment Communication:**
- Clear load details and special instructions
- Updated pickup and delivery appointments
- Emergency contact information
- Route optimization recommendations
- Customer communication expectations
- Documentation requirements
        `
      },
      {
        id: 'communication_standards',
        title: 'Communication Standards & Protocols',
        type: 'policy',
        importance: 'critical',
        content: `
**Customer Communication Requirements:**
- Pickup confirmation within 30 minutes of assignment
- En route notification with estimated delivery time
- Two-hour advance delivery notification
- Immediate communication of any delays or issues
- Professional, courteous tone in all interactions
- Accurate, timely information sharing

**Driver Communication Protocols:**
- Clear, concise instructions and expectations
- Regular check-ins based on route length
- Immediate response to driver concerns or issues
- Supportive problem-solving approach
- Recognition of good performance
- Fair and consistent policy enforcement

**Internal Communication Standards:**
- Detailed shift handover documentation
- Immediate escalation of critical issues
- Regular updates on operational status
- Clear documentation of all decisions
- Proactive information sharing with management
- Accurate record keeping for compliance
        `
      }
    ]
  },
  {
    id: 'technology_systems',
    title: 'Module 2: FleetFlow Platform & Technology Mastery',
    description: 'Complete training on technology systems, TMS integration, and digital tools',
    duration: '2-3 hours',
    sections: [
      {
        id: 'fleetflow_platform',
        title: 'FleetFlow Platform Navigation & Features',
        type: 'procedure',
        importance: 'critical',
        content: `
**Dashboard Overview:**
- Real-time load tracking and status updates
- Driver location and hours of service monitoring
- Customer communication portal access
- Performance metrics and KPI displays
- Alert and notification management
- Quick action buttons for common tasks

**Load Management Features:**
- Load creation and modification tools
- Automatic rate calculations and quoting
- Driver assignment and routing optimization
- Document management and filing system
- Customer portal integration
- Real-time tracking and updates

**Reporting and Analytics:**
- Daily, weekly, and monthly performance reports
- Driver productivity and efficiency metrics
- Customer satisfaction tracking
- Financial performance indicators
- Compliance and safety reporting
- Custom report generation tools
        `
      },
      {
        id: 'gps_tracking',
        title: 'GPS Tracking & Route Optimization',
        type: 'procedure',
        importance: 'important',
        content: `
**GPS Monitoring Best Practices:**
- Continuous tracking of all active vehicles
- Exception-based alert management
- Route deviation analysis and response
- Geofence setup for critical locations
- Historical route analysis for optimization
- Integration with customer tracking portals

**Route Optimization Strategies:**
- Fuel efficiency route planning
- Hours of Service compliance routing
- Traffic pattern analysis and avoidance
- Customer delivery window optimization
- Driver preference integration
- Weather and road condition considerations

**Emergency Response Protocols:**
- Immediate location identification
- Emergency services coordination
- Customer notification procedures
- Alternative routing arrangements
- Documentation requirements
- Follow-up and incident reporting
        `
      }
    ]
  },
  {
    id: 'compliance_safety',
    title: 'Module 3: DOT Compliance & Safety Management',
    description: 'Regulatory compliance, safety protocols, and risk management',
    duration: '2-3 hours',
    sections: [
      {
        id: 'hours_of_service',
        title: 'Hours of Service Regulations & Management',
        type: 'policy',
        importance: 'critical',
        content: `
**Key HOS Requirements:**
- 11-hour driving limit within 14-hour on-duty period
- 10-hour consecutive off-duty period required
- 60/70-hour on-duty limits (7/8-day periods)
- 30-minute break required after 8 hours of driving
- Electronic logging device (ELD) compliance
- Accurate record keeping and documentation

**Dispatcher Responsibilities:**
- Verify driver HOS status before assignment
- Monitor real-time hours and remaining capacity
- Plan loads within legal driving time limits
- Ensure adequate rest periods between assignments
- Maintain accurate HOS records and documentation
- Respond immediately to HOS violations or concerns

**Violation Prevention:**
- Pre-trip HOS calculation and verification
- Real-time monitoring during transit
- Proactive rest break scheduling
- Alternative driver arrangements when needed
- Customer communication about HOS constraints
- Documentation of all HOS-related decisions
        `
      },
      {
        id: 'safety_protocols',
        title: 'Safety Protocols & Emergency Procedures',
        type: 'procedure',
        importance: 'critical',
        content: `
**Pre-Trip Safety Verification:**
- Driver qualification and certification status
- Vehicle inspection completion and results
- Equipment functionality and safety features
- Load securement and weight distribution
- Weather and route safety assessment
- Emergency equipment verification

**Emergency Response Procedures:**
- Immediate driver safety assessment
- Emergency services contact if required
- Management notification protocols
- Customer communication requirements
- Documentation and reporting procedures
- Follow-up and investigation processes

**Ongoing Safety Management:**
- Regular safety performance monitoring
- Driver coaching and training needs assessment
- Safety violation response and corrective action
- Incident trend analysis and prevention
- Safety incentive program management
- Compliance audit preparation and support
        `
      }
    ]
  },
  {
    id: 'customer_service',
    title: 'Module 4: Customer Service Excellence',
    description: 'Customer relationship management, communication, and service delivery',
    duration: '2 hours',
    sections: [
      {
        id: 'service_standards',
        title: 'Freight 1st Direct Service Standards',
        type: 'policy',
        importance: 'critical',
        content: `
**Service Commitment Standards:**
- 98% on-time delivery performance target
- Proactive communication at all shipment milestones
- Professional, courteous interaction in all contacts
- Immediate response to customer inquiries
- Accurate, reliable information sharing
- Continuous improvement mindset

**Customer Communication Timeline:**
- Pickup confirmation within 30 minutes
- En route notification with ETA
- 2-hour advance delivery notification
- Immediate exception reporting
- Delivery confirmation within 15 minutes
- Post-delivery follow-up within 24 hours

**Quality Assurance Measures:**
- Customer satisfaction surveys and feedback
- Service performance metric tracking
- Regular account review meetings
- Continuous training and improvement
- Technology enhancement initiatives
- Competitive benchmarking analysis
        `
      },
      {
        id: 'problem_resolution',
        title: 'Problem Resolution & Escalation Procedures',
        type: 'procedure',
        importance: 'important',
        content: `
**Problem Resolution Process:**
1. Listen actively and empathetically
2. Gather complete information and details
3. Acknowledge the customer's concern
4. Propose immediate corrective actions
5. Implement solutions within authority level
6. Escalate to management when needed
7. Follow up to ensure satisfaction

**Escalation Triggers:**
- Service failures requiring management intervention
- Customer requests for rate adjustments
- Safety or compliance issues
- Damage or loss claims
- Contract disputes or modifications
- Requests for service credits or compensation

**Documentation Requirements:**
- Complete incident description and timeline
- Customer contact information and preferences
- Actions taken and results achieved
- Outstanding issues requiring follow-up
- Customer satisfaction verification
- Lessons learned and process improvements
        `
      }
    ]
  },
  {
    id: 'crisis_management',
    title: 'Module 5: Crisis Management & Advanced Operations',
    description: 'Advanced scenarios, crisis response, and leadership skills',
    duration: '2-3 hours',
    sections: [
      {
        id: 'crisis_response',
        title: 'Crisis Management Protocols',
        type: 'procedure',
        importance: 'critical',
        content: `
**Crisis Categories & Response:**
- Weather emergencies (severe storms, ice, flooding)
- Equipment failures and mechanical breakdowns
- Traffic accidents and road closures
- Driver medical emergencies or incidents
- Customer service failures or complaints
- Technology system outages or failures

**Immediate Response Protocol:**
1. Assess scope and severity of crisis
2. Ensure immediate safety of all personnel
3. Activate appropriate emergency contacts
4. Implement contingency plans and procedures
5. Communicate with all affected stakeholders
6. Document all actions and decisions
7. Monitor situation and adjust response

**Stakeholder Communication:**
- Clear, accurate information sharing
- Regular updates on status and progress
- Escalation to management when appropriate
- Customer notification and expectation management
- Driver support and guidance
- Vendor and partner coordination
        `
      },
      {
        id: 'performance_management',
        title: 'Performance Management & KPI Tracking',
        type: 'procedure',
        importance: 'important',
        content: `
**Key Performance Indicators:**
- On-time delivery percentage
- Customer satisfaction scores
- Driver utilization and efficiency
- Fuel consumption and costs
- Safety incident rates
- Revenue per mile and profitability

**Daily Performance Monitoring:**
- Real-time dashboard review
- Exception reporting and analysis
- Trend identification and response
- Corrective action implementation
- Performance improvement initiatives
- Goal tracking and achievement

**Continuous Improvement Process:**
- Regular performance data analysis
- Best practice identification and sharing
- Process optimization opportunities
- Technology enhancement evaluation
- Training and development needs assessment
- Strategic planning and goal setting
        `
      }
    ]
  }
];

export const dispatcherCertificationRequirements = {
  minimumTrainingHours: 8,
  requiredModules: ['operations_fundamentals', 'technology_systems', 'compliance_safety', 'customer_service'],
  practicalAssessment: true,
  quizPassingScore: 85,
  certificationValidPeriod: 12, // months
  continuingEducationHours: 4 // hours per year
};

export const dispatcherTrainingResources = [
  {
    type: 'video',
    title: 'FleetFlow Platform Demo',
    url: '/training/videos/fleetflow-demo',
    duration: '15 minutes'
  },
  {
    type: 'document',
    title: 'DOT Compliance Quick Reference',
    url: '/training/resources/dot-compliance-guide.pdf',
    pages: 12
  },
  {
    type: 'template',
    title: 'Daily Operations Checklist',
    url: '/training/templates/daily-operations-checklist.pdf',
    format: 'PDF Template'
  },
  {
    type: 'simulation',
    title: 'Crisis Management Scenarios',
    url: '/training/simulations/crisis-management',
    scenarios: 8
  }
];
