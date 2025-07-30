// Quiz questions for different training modules

export const dispatchQuizQuestions = [
  {
    id: 'dispatch_1',
    question: 'What is the first step in the dispatch workflow when a new load request comes in?',
    options: [
      'Immediately assign it to the nearest driver',
      'Verify load details and customer requirements',
      'Post it to the load board',
      'Calculate the rate first'
    ],
    correctAnswer: 1,
    explanation: 'Always verify load details and customer requirements first to ensure accuracy and prevent issues later in the process.'
  },
  {
    id: 'dispatch_2',
    question: 'When tracking a driver en route, what should you do if they report a potential delay?',
    options: [
      'Wait to see if they can make up time',
      'Immediately notify the customer and update delivery expectations',
      'Tell the driver to drive faster',
      'Reassign the load to another driver'
    ],
    correctAnswer: 1,
    explanation: 'Proactive customer communication is essential. Always notify customers immediately when delays are possible to maintain trust and manage expectations.'
  },
  {
    id: 'dispatch_3',
    question: 'What information is required before confirming a load assignment to a driver?',
    options: [
      'Only the pickup and delivery addresses',
      'Driver availability, equipment type, and HOS status',
      'Just the rate per mile',
      'Customer contact information only'
    ],
    correctAnswer: 1,
    explanation: 'Driver availability, equipment compatibility, and Hours of Service (HOS) status are all critical factors that must be verified before load assignment.'
  },
  {
    id: 'dispatch_4',
    question: 'How should you handle a situation where a driver cannot complete their delivery due to equipment failure?',
    options: [
      'Tell them to figure it out themselves',
      'Activate emergency protocol: arrange breakdown service, find backup driver, notify customer',
      'Cancel the load',
      'Wait until the next day'
    ],
    correctAnswer: 1,
    explanation: 'Equipment failures require immediate emergency protocol activation including breakdown service, backup arrangements, and customer notification.'
  },
  {
    id: 'dispatch_5',
    question: 'What is the most important factor when prioritizing multiple load assignments?',
    options: [
      'Highest paying loads first',
      'Customer priority level and delivery deadlines',
      'Shortest distance loads',
      'Driver preferences'
    ],
    correctAnswer: 1,
    explanation: 'Customer priority levels and delivery deadlines should drive prioritization decisions to maintain service commitments and customer relationships.'
  },
  {
    id: 'dispatch_6',
    question: 'When should you update load status in the FleetFlow system?',
    options: [
      'Only at pickup and delivery',
      'At every major milestone: assignment, pickup, en route updates, delivery',
      'Once per day',
      'Only when there are problems'
    ],
    correctAnswer: 1,
    explanation: 'Real-time status updates at every milestone ensure accurate tracking, customer visibility, and operational efficiency.'
  },
  {
    id: 'dispatch_7',
    question: 'What is the correct procedure for handling customer complaints about delivery delays?',
    options: [
      'Blame the driver',
      'Listen actively, investigate the issue, provide updates, and implement solutions',
      'Ignore the complaint',
      'Offer a discount immediately'
    ],
    correctAnswer: 1,
    explanation: 'Professional complaint handling involves active listening, thorough investigation, regular updates, and implementing appropriate solutions.'
  },
  {
    id: 'dispatch_8',
    question: 'How often should you check driver HOS (Hours of Service) status?',
    options: [
      'Once per week',
      'Before every load assignment and during long trips',
      'Only when they tell you',
      'Once per month'
    ],
    correctAnswer: 1,
    explanation: 'HOS compliance requires constant monitoring before assignments and during trips to prevent violations and ensure safety.'
  },
  {
    id: 'dispatch_9',
    question: 'What documentation is required to complete a delivery in FleetFlow?',
    options: [
      'Just the driver signature',
      'POD (Proof of Delivery), photos, customer signature, and any incident reports',
      'Only the delivery time',
      'Customer business card'
    ],
    correctAnswer: 1,
    explanation: 'Complete delivery documentation includes POD, photos, signatures, and any incident reports for full audit trail and customer service.'
  },
  {
    id: 'dispatch_10',
    question: 'When communicating with drivers, what is the most effective approach?',
    options: [
      'Only communicate when there are problems',
      'Regular check-ins, clear instructions, and supportive communication',
      'Send long text messages',
      'Call them every hour'
    ],
    correctAnswer: 1,
    explanation: 'Effective driver communication involves regular check-ins, clear instructions, and maintaining supportive professional relationships.'
  }
]

export const brokerQuizQuestions = [
  {
    id: 'broker_1',
    question: 'What is the first step when establishing a relationship with a new carrier?',
    options: [
      'Negotiate rates immediately',
      'Verify insurance, authority, and safety records',
      'Give them a load right away',
      'Ask for references only'
    ],
    correctAnswer: 1,
    explanation: 'Carrier verification including insurance, operating authority, and safety records is essential before establishing any business relationship.'
  },
  {
    id: 'broker_2',
    question: 'When posting a load to a load board, what information is most critical to include?',
    options: [
      'Only pickup and delivery cities',
      'Complete details: origin/destination, dates, equipment type, weight, rate, and special requirements',
      'Just the rate',
      'Only the commodity type'
    ],
    correctAnswer: 1,
    explanation: 'Comprehensive load details help carriers make informed decisions and reduce back-and-forth communication, improving efficiency.'
  },
  {
    id: 'broker_3',
    question: 'How should you handle rate negotiations with carriers?',
    options: [
      'Always accept the first offer',
      'Research market rates, understand costs, negotiate fairly based on value',
      'Always offer the lowest rate possible',
      'Let the carrier set the rate'
    ],
    correctAnswer: 1,
    explanation: 'Effective rate negotiation requires market research, cost understanding, and fair value-based negotiations that work for both parties.'
  },
  {
    id: 'broker_4',
    question: 'What should you do if a carrier fails to pick up a load as scheduled?',
    options: [
      'Wait and hope they show up',
      'Immediately find backup coverage and notify the customer',
      'Cancel the shipment',
      'Reduce their rate'
    ],
    correctAnswer: 1,
    explanation: 'Failed pickups require immediate backup coverage arrangements and customer notification to maintain service commitments.'
  },
  {
    id: 'broker_5',
    question: 'When should carrier payments be processed?',
    options: [
      'Whenever convenient',
      'According to agreed payment terms after receiving proper documentation',
      'Immediately upon pickup',
      'Only after customer pays'
    ],
    correctAnswer: 1,
    explanation: 'Carrier payments should follow agreed terms and require proper documentation (POD, invoices) to maintain good relationships and cash flow.'
  },
  {
    id: 'broker_6',
    question: 'What is the most important factor in maintaining long-term carrier relationships?',
    options: [
      'Always offering the highest rates',
      'Consistent communication, fair rates, and reliable payment terms',
      'Only using them for easy loads',
      'Never asking for favors'
    ],
    correctAnswer: 1,
    explanation: 'Long-term carrier relationships are built on consistent communication, fair treatment, competitive rates, and reliable payment practices.'
  },
  {
    id: 'broker_7',
    question: 'How should you handle a situation where a carrier damages freight?',
    options: [
      'Immediately blame the carrier',
      'Document damage, notify insurance, coordinate with all parties for resolution',
      'Pay for damages yourself',
      'Ignore the damage'
    ],
    correctAnswer: 1,
    explanation: 'Freight damage requires proper documentation, insurance notification, and coordinated resolution involving all stakeholders.'
  },
  {
    id: 'broker_8',
    question: 'What factors should influence carrier selection for a specific load?',
    options: [
      'Lowest rate only',
      'Safety record, equipment suitability, reliability, rate, and geographic position',
      'Who calls first',
      'Personal relationships only'
    ],
    correctAnswer: 1,
    explanation: 'Carrier selection should consider multiple factors including safety, equipment, reliability, rate competitiveness, and operational efficiency.'
  },
  {
    id: 'broker_9',
    question: 'When should you use a load board versus your carrier network?',
    options: [
      'Always use load boards first',
      'Use carrier network for preferred relationships, load boards for coverage gaps and market testing',
      'Never use load boards',
      'Only when desperate'
    ],
    correctAnswer: 1,
    explanation: 'Strategic use of both carrier networks (for reliability) and load boards (for coverage and market rates) optimizes operations.'
  },
  {
    id: 'broker_10',
    question: 'What is the key to successful freight matching?',
    options: [
      'Random assignments',
      'Understanding customer requirements, carrier capabilities, and market conditions',
      'Fastest assignment possible',
      'Highest margin only'
    ],
    correctAnswer: 1,
    explanation: 'Successful freight matching requires deep understanding of customer needs, carrier capabilities, and current market dynamics.'
  }
]

export const complianceQuizQuestions = [
  {
    id: 'compliance_1',
    question: 'What is the maximum driving time allowed under HOS regulations before a driver must take a break?',
    options: [
      '10 hours',
      '11 hours',
      '8 hours',
      '14 hours'
    ],
    correctAnswer: 1,
    explanation: 'Drivers can drive a maximum of 11 hours after 10 consecutive hours off duty, as per FMCSA HOS regulations.'
  },
  {
    id: 'compliance_2',
    question: 'How long must a driver be off duty before starting a new 14-hour work period?',
    options: [
      '8 hours',
      '10 hours',
      '12 hours',
      '9 hours'
    ],
    correctAnswer: 1,
    explanation: 'Drivers must have at least 10 consecutive hours off duty before beginning a new 14-hour on-duty period.'
  },
  {
    id: 'compliance_3',
    question: 'What is required for a driver to operate a commercial vehicle interstate?',
    options: [
      'Regular driver license only',
      'Valid CDL, current DOT medical certificate, and clean driving record',
      'Just a DOT medical certificate',
      'Only CDL'
    ],
    correctAnswer: 1,
    explanation: 'Interstate commercial driving requires a valid CDL, current DOT medical certificate, and compliance with federal safety standards.'
  },
  {
    id: 'compliance_4',
    question: 'How often must drivers complete a Driver Vehicle Inspection Report (DVIR)?',
    options: [
      'Weekly',
      'Daily, for each vehicle operated',
      'Monthly',
      'Only when problems occur'
    ],
    correctAnswer: 1,
    explanation: 'Drivers must complete a DVIR daily for each commercial vehicle they operate, documenting any defects or deficiencies.'
  },
  {
    id: 'compliance_5',
    question: 'What action should be taken if a vehicle has a safety defect that affects safe operation?',
    options: [
      'Continue driving carefully',
      'Remove vehicle from service until repaired',
      'Drive only short distances',
      'Ignore minor defects'
    ],
    correctAnswer: 1,
    explanation: 'Any safety defect that could affect safe operation requires immediate removal of the vehicle from service until properly repaired.'
  }
]

export const smsWorkflowQuizQuestions = [
  {
    id: 'sms_1',
    question: 'At what point in the workflow are SMS notifications first triggered?',
    options: [
      'Only when loads are delivered',
      'During load creation and assignment',
      'Only for urgent situations',
      'When drivers request updates'
    ],
    correctAnswer: 1,
    explanation: 'SMS notifications begin during load creation and assignment, ensuring all stakeholders are informed from the start of the workflow.'
  },
  {
    id: 'sms_2',
    question: 'Which roles typically receive SMS notifications in the FleetFlow ecosystem?',
    options: [
      'Only drivers',
      'Only dispatchers and managers',
      'Drivers, Carriers, Brokers, and Customers',
      'Only customers'
    ],
    correctAnswer: 2,
    explanation: 'The SMS system sends notifications to all relevant stakeholders: Drivers, Carriers, Brokers, and Customers based on their involvement in specific loads.'
  },
  {
    id: 'sms_3',
    question: 'What information is tracked for each SMS notification in the system?',
    options: [
      'Only the message content',
      'Message ID, timestamp, recipient details, delivery status, and cost',
      'Just the phone number',
      'Only success or failure status'
    ],
    correctAnswer: 1,
    explanation: 'The system tracks comprehensive details including Message ID, timestamp, recipient information, delivery status, cost, and error details for complete audit trails.'
  },
  {
    id: 'sms_4',
    question: 'Which SMS template is used for notifying drivers about pickup timing?',
    options: [
      'new-load template',
      'load-update template', 
      'pickup-reminder template',
      'custom template'
    ],
    correctAnswer: 2,
    explanation: 'The pickup-reminder template is specifically designed for notifying drivers about upcoming pickup requirements and timing.'
  },
  {
    id: 'sms_5',
    question: 'How are SMS notification urgency levels prioritized in the system?',
    options: [
      'All messages have the same priority',
      'Low, Normal, High, Urgent levels with different delivery priorities',
      'Only urgent messages are sent',
      'Random priority assignment'
    ],
    correctAnswer: 1,
    explanation: 'SMS notifications use four urgency levels (Low, Normal, High, Urgent) that affect delivery priority and ensure critical messages reach recipients faster.'
  },
  {
    id: 'sms_6',
    question: 'Where can dispatchers view SMS notification logs and tracking information?',
    options: [
      'Only in email reports',
      'In the Notes Hub under Message Tracking & Communication Logs',
      'SMS logs are not available',
      'Only in external systems'
    ],
    correctAnswer: 1,
    explanation: 'The Notes Hub contains a dedicated "Message Tracking & Communication Logs" section where all SMS notifications, delivery status, and audit trails are viewable.'
  },
  {
    id: 'sms_7',
    question: 'What happens when a SMS notification fails to deliver?',
    options: [
      'The system ignores the failure',
      'It automatically retries indefinitely',
      'The failure is logged with error details and status tracking shows "failed"',
      'A new message is created automatically'
    ],
    correctAnswer: 2,
    explanation: 'Failed SMS notifications are logged with detailed error information, and the status tracking system clearly shows "failed" status for auditing and troubleshooting.'
  },
  {
    id: 'sms_8',
    question: 'How does the SMS system integrate with the overall workflow orchestration?',
    options: [
      'SMS works independently from workflows',
      'Automatic triggers at each workflow stage with role-based recipient selection',
      'Only manual SMS sending is available',
      'SMS only works for completed loads'
    ],
    correctAnswer: 1,
    explanation: 'SMS notifications are automatically triggered at each workflow stage (load creation, route optimization, dispatch, transit, delivery) with intelligent role-based recipient selection.'
  }
]
