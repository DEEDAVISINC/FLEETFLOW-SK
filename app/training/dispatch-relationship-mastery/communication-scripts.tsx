'use client';

import { useState } from 'react';

export const DispatchCommunicationScripts = () => {
  const [activeScript, setActiveScript] = useState<string>('carrier-cold-call');

  const scripts = {
    'carrier-cold-call': {
      title: 'Carrier Cold Call Script',
      category: 'Carrier Acquisition',
      content: `
        **Opening:**
        "Hi, this is [Your Name] from FleetFlow Dispatch. I'm reaching out because we specialize in connecting quality carriers with consistent, high-paying loads. Do you have a moment to discuss potential opportunities?"

        **Qualifying Questions:**
        - "What type of equipment do you run?"
        - "What are your primary lanes?"
        - "How many trucks are you currently operating?"
        - "What's your typical rate expectations?"

        **Value Proposition:**
        "We work with premium shippers and brokers who value reliability. Our carriers typically see 15-20% higher rates than industry average because we pre-qualify all loads and maintain strong relationships."

        **Next Steps:**
        "I'd like to set up your carrier profile in our system. Can we schedule a brief 10-minute call tomorrow to get your MC authority and insurance details?"

        **Closing:**
        "Thank you for your time. I'll send you our carrier packet via email, and we'll have loads available for you by [specific timeframe]."
      `,
    },
    'broker-load-inquiry': {
      title: 'Broker Load Inquiry Script',
      category: 'Broker Communication',
      content: `
        **Professional Introduction:**
        "Good morning, this is [Your Name] with FleetFlow Dispatch. I'm calling about load [Load ID] posted on [Load Board]. Is this load still available?"

        **Carrier Information Ready:**
        "I have a qualified carrier with [Equipment Type], currently in [Location], available for pickup on [Date]. They have excellent safety ratings and [specific credentials]."

        **Rate Discussion:**
        "What's your best rate for this load? My carrier is professional and reliable - they've completed [X] loads for us with zero claims."

        **Professional Follow-up:**
        "If this load is covered, do you have any similar loads in this lane? I have additional capacity and would love to build a relationship with your team."

        **Closing & Next Steps:**
        "Perfect, I'll send the carrier information and insurance certificate right away. What's the best email for load confirmations?"
      `,
    },
    'carrier-relationship-maintenance': {
      title: 'Carrier Relationship Maintenance',
      category: 'Relationship Building',
      content: `
        **Regular Check-in Call:**
        "Hi [Carrier Name], this is [Your Name] from FleetFlow. Just checking in to see how things are going and if you need any loads for next week."

        **Performance Recognition:**
        "I wanted to personally thank you for the excellent service on that last load to Atlanta. The shipper specifically mentioned your professionalism."

        **Proactive Communication:**
        "I have some great loads coming up in your preferred lanes. Would you like me to hold [specific load] for you?"

        **Problem Resolution:**
        "I understand there was an issue with the last delivery. Let me work directly with the broker to resolve this and ensure it doesn't happen again."

        **Long-term Partnership:**
        "You've been one of our top carriers this quarter. I'd like to discuss some exclusive load opportunities that might interest you."
      `,
    },
    'loadboard-communication': {
      title: 'Load Board Communication Best Practices',
      category: 'Load Board Mastery',
      content: `
        **DAT Load Board Messaging:**
        Subject: "Available [Equipment] - [Origin] to [Destination] - [Date]"
        "Professional carrier available for your [Load ID]. Excellent safety record, on-time delivery guaranteed. Rate: $[Amount]. Contact: [Phone]"

        **Truckstop.com Inquiry:**
        "Regarding Load #[ID]: I have a qualified [Equipment Type] with [Credentials]. Carrier has [Years] experience and [Safety Rating]. Available for immediate dispatch."

        **123LoadBoard Response:**
        "Load inquiry for [Load Details]. Professional driver with [Specific Qualifications]. Can pickup [Date/Time]. Insurance and authority docs ready to send."

        **Professional Email Template:**
        Subject: Load Inquiry - [Load ID] - [Your Company]

        Dear [Broker Name],

        I am inquiring about load [ID] posted on [Platform]. I have a qualified carrier available:

        - Equipment: [Type]
        - Current Location: [City, State]
        - Availability: [Date/Time]
        - Safety Rating: [Rating]
        - Insurance: $[Amount]

        Please let me know if this load is still available and your best rate.

        Best regards,
        [Your Name]
        [Company]
        [Phone]
      `,
    },
    'carrier-onboarding': {
      title: 'Carrier Onboarding Documentation Script',
      category: 'Document Management',
      content: `
          **Initial Document Request:**
          "Welcome to our carrier network! To get you set up in our system, I'll need to collect some standard documentation. This typically takes 10-15 minutes."

          **Required Documents Checklist:**
          "I'll need the following items:
          - Current MC Authority and DOT number
          - Certificate of Insurance (minimum $1M liability)
          - W-9 tax form
          - Signed carrier agreement
          - Safety rating verification"

          **Document Verification Process:**
          "I'll verify your MC authority through FMCSA SAFER and check your insurance directly with your carrier. This ensures we're both protected."

          **Timeline Communication:**
          "Once I have all documents, you'll be approved within 24 hours and ready for loads. I'll send you our carrier packet with payment terms and procedures."

          **Follow-up for Missing Documents:**
          "I'm still missing your [specific document]. Can you email that over today? I'd like to get you approved and earning revenue as quickly as possible."

          **Document Renewal Reminders:**
          "Your insurance expires in 30 days. Please send the renewal certificate as soon as it's available to avoid any service interruption."
        `,
    },
    'go-to-dispatcher': {
      title: 'Becoming the Go-To Dispatcher',
      category: 'Professional Excellence',
      content: `
          **Proactive Communication:**
          "I wanted to update you on the load status before you had to ask. Your driver is 30 minutes ahead of schedule and will arrive early."

          **Problem-Solving Excellence:**
          "There's a minor delay due to weather, but I've already contacted the receiver to adjust the appointment. No detention charges will apply."

          **Value-Added Service:**
          "I noticed you have several loads in this lane next week. I can block out my best carriers for your exclusive use if you're interested."

          **Reliability Demonstration:**
          "This is the 15th consecutive load we've completed for you without incident. I take pride in maintaining this level of service."

          **Relationship Building:**
          "I'd like to schedule a brief call to discuss how we can better support your transportation needs. When would be a good time for you?"

          **Professional Growth:**
          "I'm always looking to improve our service. Is there anything specific you'd like to see us do differently or better?"
        `,
    },
  };

  const categories = [
    'Carrier Acquisition',
    'Broker Communication',
    'Relationship Building',
    'Load Board Mastery',
    'Document Management',
    'Professional Excellence',
  ];

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '24px',
        margin: '24px 0',
      }}
    >
      <h3
        style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#ffffff',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span>📞</span>
        Communication Scripts & Templates
      </h3>

      {/* Category Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '24px',
        }}
      >
        {Object.entries(scripts).map(([key, script]) => (
          <button
            key={key}
            onClick={() => setActiveScript(key)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background:
                activeScript === key
                  ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                  : 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {script.title}
          </button>
        ))}
      </div>

      {/* Active Script Content */}
      <div
        style={{
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(59, 130, 246, 0.2)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h4
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#ffffff',
              margin: 0,
            }}
          >
            {scripts[activeScript as keyof typeof scripts].title}
          </h4>
          <span
            style={{
              padding: '4px 12px',
              background: 'rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              color: '#ffffff',
            }}
          >
            {scripts[activeScript as keyof typeof scripts].category}
          </span>
        </div>

        <div
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '14px',
            lineHeight: '1.6',
            whiteSpace: 'pre-line',
          }}
        >
          {scripts[activeScript as keyof typeof scripts].content}
        </div>
      </div>

      {/* Quick Tips */}
      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          background: 'rgba(16, 185, 129, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        }}
      >
        <h5
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>💡</span>
          Pro Tips
        </h5>
        <ul
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '14px',
            lineHeight: '1.5',
            paddingLeft: '20px',
          }}
        >
          <li>Always have carrier information ready before making calls</li>
          <li>Use professional email signatures with contact information</li>
          <li>Follow up within 2 hours of initial contact</li>
          <li>Keep detailed notes of all communications in CRM</li>
          <li>Build relationships, not just transactions</li>
        </ul>
      </div>
    </div>
  );
};
