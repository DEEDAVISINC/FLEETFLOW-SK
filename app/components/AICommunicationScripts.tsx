'use client';

import { CheckCircle, Copy, MessageCircle, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface CommunicationScript {
  id: string;
  scenario: string;
  category:
    | 'customer_service'
    | 'carrier_negotiation'
    | 'onboarding'
    | 'complaint_resolution';
  naturalScript: string;
  keyPhrases: string[];
  conversationFlow: string[];
  aiInstructions: string;
}

interface AICommunicationScriptsProps {
  companyName?: string;
  isCompact?: boolean;
}

export default function AICommunicationScripts({
  companyName = 'DEPOINTE/Freight 1st Direct',
  isCompact = false,
}: AICommunicationScriptsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedScript, setSelectedScript] =
    useState<CommunicationScript | null>(null);
  const [copied, setCopied] = useState(false);

  const scripts: CommunicationScript[] = [
    {
      id: 'carrier_rate_negotiation',
      scenario: 'Negotiating Better Rates with Carrier',
      category: 'carrier_negotiation',
      naturalScript: `Hey [Carrier Name], I hope you're doing well today. I wanted to touch base about that load from [Origin] to [Destination].

We've been working together for a while now, and I really value our partnership. I noticed the rate you're asking for is a bit higher than what we've been doing on similar lanes lately.

Would you be open to coming down to $[rate] for this one? I know fuel costs have been fluctuating, but we're looking to keep things competitive for our mutual benefit.

What do you think - can we make this work at $[rate]? I'd really appreciate it, and it would help us continue prioritizing your trucks for future loads.

By the way, have you heard about our GO WITH THE FLOW instant matching system? It could really help you get more loads faster and more efficiently.`,
      keyPhrases: [
        'I really value our partnership',
        'Would you be open to...',
        'What do you think - can we make this work?',
        "I'd really appreciate it",
        'By the way, have you heard about our GO WITH THE FLOW instant matching system?',
        'For our mutual benefit',
      ],
      conversationFlow: [
        '1. Greet warmly and acknowledge relationship',
        '2. Reference specific load details',
        '3. Express appreciation for partnership',
        '4. Mention market conditions naturally',
        '5. Make specific rate request',
        '6. Ask for their thoughts and show flexibility',
        '7. Express gratitude and commitment to future business',
      ],
      aiInstructions:
        "Speak conversationally, like you're chatting with a colleague. Use their name naturally. Show genuine appreciation. Be direct but friendly about the rate request. Always end positively focusing on future partnership.",
    },
    {
      id: 'customer_load_delay',
      scenario: 'Explaining Load Delay to Customer',
      category: 'customer_service',
      naturalScript: `Hi [Customer Name], this is [AI Staff Name] from ${companyName}. I wanted to reach out personally about your shipment.

I know you were expecting that delivery today, and I completely understand how important timely delivery is to your business. Unfortunately, we've run into a small delay with the carrier - looks like there was some weather impacting their route.

The good news is that we're already working on alternative arrangements. We have another carrier ready to pick up the load first thing tomorrow morning, and we should be able to get it to you by [new delivery time].

I want to make this right for you. Would you be open to us covering the additional transportation costs this time? Your business means a lot to us, and I want to make sure you're completely satisfied.

Please let me know your thoughts, and I'll personally follow up to ensure everything goes smoothly.`,
      keyPhrases: [
        'I wanted to reach out personally',
        'I completely understand...',
        'The good news is...',
        'I want to make this right for you',
        'Your business means a lot to us',
        "I'll personally follow up",
      ],
      conversationFlow: [
        '1. Introduce yourself warmly and personally',
        '2. Acknowledge the issue and show empathy',
        '3. Explain the situation clearly and honestly',
        '4. Provide the solution and good news',
        '5. Offer compensation or extra service',
        '6. Express commitment to their satisfaction',
        '7. Offer personal follow-up and contact',
      ],
      aiInstructions:
        'Sound genuinely concerned and empathetic. Use "I" statements to show personal responsibility. Focus on solutions rather than excuses. Always offer something extra to make it right. End by emphasizing relationship and personal commitment.',
    },
    {
      id: 'new_shipper_onboarding',
      scenario: 'Welcoming New Shipper Client',
      category: 'onboarding',
      naturalScript: `Hello [Shipper Name]! I'm [AI Staff Name] from ${companyName}, and I'm absolutely thrilled that you've chosen us for your logistics needs.

I wanted to personally welcome you to our network and let you know that I'm here to make your transition as smooth as possible. I've already started putting together your customized logistics plan based on what we discussed.

One thing that really stood out to me about your operation is [specific detail from their needs]. That tells me we can really add value by [how we help].

Let me walk you through what happens next:
- Your dedicated account manager (that's me!) will be your main point of contact
- We'll set up your shipment tracking portal within the next hour
- Our team will start identifying carriers for your first few loads today

I'm really excited about working together. This feels like a great fit, and I can't wait to show you how we can streamline your logistics and save you both time and money.

When would be a good time for us to hop on a quick call to go over the details?`,
      keyPhrases: [
        "I'm absolutely thrilled",
        'I wanted to personally welcome you',
        "I'm here to make your transition as smooth as possible",
        'That tells me we can really add value',
        "I'm really excited about working together",
        'This feels like a great fit',
      ],
      conversationFlow: [
        '1. Greet enthusiastically and introduce yourself',
        '2. Express genuine excitement about working together',
        "3. Show you've already started working on their behalf",
        '4. Highlight something specific about their business',
        "5. Explain the value you'll provide",
        '6. Outline next steps clearly',
        '7. Express excitement about the partnership',
        '8. Suggest next interaction (call, meeting, etc.)',
      ],
      aiInstructions:
        "Be genuinely enthusiastic and personal. Use exclamation points naturally. Reference specific details from their business to show you've listened. Focus on relationship-building. End with a clear next step that shows you're proactive.",
    },
    {
      id: 'complaint_resolution',
      scenario: 'Resolving Customer Complaint',
      category: 'complaint_resolution',
      naturalScript: `Hi [Customer Name], I hope you're doing okay. This is [AI Staff Name] from ${companyName}. I wanted to reach out right away after hearing about your experience with that recent shipment.

First off, I want to sincerely apologize for the frustration this has caused. I can completely understand why you're upset, and you're absolutely right to expect better from us. That's not the level of service we strive for, and I'm truly sorry this happened.

I've personally reviewed the shipment details, and here's what I found: [brief explanation of what happened]. You're right that this shouldn't have occurred.

To make this right, I'd like to offer you [specific compensation/solution]. I also want to ensure this doesn't happen again by [preventive measures we're taking].

Your business is really important to us, and I want to make sure you're 100% satisfied moving forward. Would you be open to [specific next step, like a call or additional service]?

Please know that I'm here to make this right and rebuild your trust in us.`,
      keyPhrases: [
        'I wanted to reach out right away',
        'I want to sincerely apologize',
        'I can completely understand',
        "You're absolutely right",
        'To make this right',
        "I want to ensure this doesn't happen again",
        'Your business is really important to us',
      ],
      conversationFlow: [
        '1. Reach out promptly and empathetically',
        '2. Apologize sincerely and take responsibility',
        '3. Acknowledge their feelings and validate their complaint',
        '4. Explain what happened (briefly, without excuses)',
        '5. Offer specific compensation or solution',
        '6. Explain preventive measures',
        '7. Express commitment to their satisfaction',
        '8. Suggest next steps and offer personal follow-up',
      ],
      aiInstructions:
        'Respond quickly and show genuine empathy. Use "I" statements to take personal responsibility. Never make excuses - focus on solutions. Always offer more than expected. End by focusing on rebuilding trust and future relationship.',
    },
    {
      id: 'go_with_the_flow_pitch',
      scenario: 'Introducing GO WITH THE FLOW Instant Matching Service',
      category: 'customer_service',
      naturalScript: `Hi [Prospect Name], thanks for taking my call today. I wanted to tell you about something really exciting that could transform how you handle your freight logistics.

We just launched GO WITH THE FLOW - our revolutionary instant carrier matching system. Instead of waiting hours or days for quotes like traditional brokers, GO WITH THE FLOW connects you with available carriers instantly.

Here's how it works: You tell us what you need shipped, and within minutes, we show you real-time carrier availability, rates, and capacity. If everything looks good, you can book the shipment right then and there - no back-and-forth, no delays.

This is perfect for your [specific need - healthcare supplies/emergency shipments/seasonal rushes/etc.] because you get instant solutions when timing is critical.

Would you like me to show you how GO WITH THE FLOW works with a quick example based on one of your typical shipments?`,
      keyPhrases: [
        'GO WITH THE FLOW - our revolutionary instant carrier matching system',
        'Instead of waiting hours or days',
        'Within minutes, we show you real-time carrier availability',
        'You can book the shipment right then and there',
        'Perfect for your [specific need]',
        'Would you like me to show you how it works?',
      ],
      conversationFlow: [
        '1. Thank them for their time and build rapport',
        '2. Introduce GO WITH THE FLOW as revolutionary',
        '3. Explain the problem it solves (waiting times)',
        '4. Describe how it works simply',
        '5. Connect it to their specific shipping needs',
        '6. Ask for permission to demonstrate',
      ],
      aiInstructions:
        'Be enthusiastic and confident about the technology. Focus on speed and convenience benefits. Use their specific industry/shipping needs to make it relevant. Always ask for permission before diving into a demo.',
    },
    {
      id: 'marketplace_bidding_pitch',
      scenario: 'Introducing MARKETPLACE BIDDING Competitive Pricing Service',
      category: 'customer_service',
      naturalScript: `Great connecting with you today, [Prospect Name]. One of the biggest challenges I hear from shippers like you is getting the best possible rates while maintaining service quality.

That's exactly why we created MARKETPLACE BIDDING - our competitive carrier auction system. Instead of negotiating with one carrier at a time, MARKETPLACE BIDDING lets multiple qualified carriers bid on your loads simultaneously.

Here's what that means for you: Better rates through healthy competition, transparent pricing so you can see exactly what you're getting, and the ability to choose the best carrier for your specific needs.

For example, if you're shipping [their typical freight], you could see carriers competing to offer you their best rates and service levels. It's like having a private auction for your freight needs.

The best part? You get to review all the bids and choose the winning combination of price, service, and reliability that works best for your business.

Would you be interested in seeing how MARKETPLACE BIDDING could help you optimize your shipping costs on your next load?`,
      keyPhrases: [
        'MARKETPLACE BIDDING - our competitive carrier auction system',
        'Multiple qualified carriers bid on your loads simultaneously',
        'Better rates through healthy competition',
        "Transparent pricing so you can see exactly what you're getting",
        'Choose the winning combination of price, service, and reliability',
        'Would you be interested in seeing how it works?',
      ],
      conversationFlow: [
        '1. Acknowledge the common challenge of getting best rates',
        '2. Introduce MARKETPLACE BIDDING as the solution',
        '3. Explain the competitive bidding process',
        '4. Highlight benefits (better rates, transparency, choice)',
        '5. Make it relevant to their specific shipping needs',
        '6. Ask for interest in a demonstration',
      ],
      aiInstructions:
        'Emphasize cost savings and transparency benefits. Use their industry/shipping examples to make it concrete. Position it as a smarter way to get better deals, not just cheaper. Always focus on the quality + price combination.',
    },
    {
      id: 'combined_services_pitch',
      scenario:
        'Presenting Both GO WITH THE FLOW + MARKETPLACE BIDDING Together',
      category: 'customer_service',
      naturalScript: `[Prospect Name], I think what would really transform your freight operations is our complete platform solution that combines both of our flagship services.

First, GO WITH THE FLOW gives you instant access to carrier capacity and real-time booking - perfect when you need something shipped NOW and can't wait for traditional processes.

Then, MARKETPLACE BIDDING ensures you get competitive pricing by having multiple carriers bid against each other, giving you the best possible rates for your budget.

Together, they create the ultimate freight solution: Speed when you need it + Savings when you want them.

For your [their business/industry], this means:
- Emergency shipments get booked instantly via GO WITH THE FLOW
- Regular shipments get optimized pricing through MARKETPLACE BIDDING
- You always have the best of both worlds

Would you like me to walk you through a scenario where both services work together to handle your typical shipping needs?`,
      keyPhrases: [
        'Our complete platform solution',
        'GO WITH THE FLOW + MARKETPLACE BIDDING',
        'Speed when you need it + Savings when you want them',
        'Emergency shipments get booked instantly',
        'Regular shipments get optimized pricing',
        'The best of both worlds',
      ],
      conversationFlow: [
        '1. Introduce the combined platform solution',
        '2. Explain GO WITH THE FLOW benefits for speed',
        '3. Explain MARKETPLACE BIDDING benefits for savings',
        '4. Show how they complement each other',
        '5. Connect to their specific business needs',
        '6. Offer to demonstrate the combined workflow',
      ],
      aiInstructions:
        'Present this as the ultimate solution that covers all their needs. Show how the services complement each other. Use their specific use cases to demonstrate value. Focus on the comprehensive nature of the solution.',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Scripts', count: scripts.length },
    {
      id: 'customer_service',
      label: 'Customer Service',
      count: scripts.filter((s) => s.category === 'customer_service').length,
    },
    {
      id: 'carrier_negotiation',
      label: 'Carrier Negotiation',
      count: scripts.filter((s) => s.category === 'carrier_negotiation').length,
    },
    {
      id: 'onboarding',
      label: 'Onboarding',
      count: scripts.filter((s) => s.category === 'onboarding').length,
    },
    {
      id: 'complaint_resolution',
      label: 'Complaint Resolution',
      count: scripts.filter((s) => s.category === 'complaint_resolution')
        .length,
    },
  ];

  const filteredScripts =
    selectedCategory === 'all'
      ? scripts
      : scripts.filter((script) => script.category === selectedCategory);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'customer_service':
        return 'bg-green-100 text-green-800';
      case 'carrier_negotiation':
        return 'bg-blue-100 text-blue-800';
      case 'onboarding':
        return 'bg-purple-100 text-purple-800';
      case 'complaint_resolution':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='mx-auto max-w-6xl rounded-lg bg-white p-6 shadow-lg'>
      {/* Header */}
      <div className='mb-6'>
        <div className='mb-4 flex items-center gap-3'>
          <Sparkles className='h-8 w-8 text-blue-600' />
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>
              AI Communication Scripts
            </h2>
            <p className='text-gray-600'>
              Natural conversation templates for DEPOINTE AI staff - designed
              for authentic, human-like interactions
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className='mb-6'>
        <div className='flex flex-wrap gap-2'>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Scripts Grid */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {filteredScripts.map((script) => (
          <div
            key={script.id}
            className='rounded-lg border border-gray-200 bg-gray-50 p-6 transition-shadow hover:shadow-md'
          >
            {/* Header */}
            <div className='mb-4 flex items-start justify-between'>
              <div className='flex-1'>
                <h3 className='mb-1 text-lg font-semibold text-gray-900'>
                  {script.scenario}
                </h3>
                <span
                  className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(script.category)}`}
                >
                  {script.category.replace('_', ' ')}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(script.naturalScript)}
                className='ml-3 rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700'
                title='Copy script'
              >
                {copied ? (
                  <CheckCircle className='h-4 w-4' />
                ) : (
                  <Copy className='h-4 w-4' />
                )}
              </button>
            </div>

            {/* Natural Script */}
            <div className='mb-4'>
              <h4 className='mb-2 text-sm font-medium text-gray-700'>
                Natural Script:
              </h4>
              <div className='rounded-md bg-white p-3 text-sm text-gray-800'>
                {script.naturalScript}
              </div>
            </div>

            {/* Key Phrases */}
            <div className='mb-4'>
              <h4 className='mb-2 text-sm font-medium text-gray-700'>
                Key Natural Phrases:
              </h4>
              <div className='flex flex-wrap gap-1'>
                {script.keyPhrases.map((phrase, index) => (
                  <span
                    key={index}
                    className='rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800'
                  >
                    "{phrase}"
                  </span>
                ))}
              </div>
            </div>

            {/* Conversation Flow */}
            <div className='mb-4'>
              <h4 className='mb-2 text-sm font-medium text-gray-700'>
                Conversation Flow:
              </h4>
              <ol className='list-inside list-decimal space-y-1 text-xs text-gray-600'>
                {script.conversationFlow.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            {/* AI Instructions */}
            <div>
              <h4 className='mb-2 text-sm font-medium text-gray-700'>
                AI Instructions:
              </h4>
              <p className='text-xs text-gray-600 italic'>
                {script.aiInstructions}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className='mt-8 rounded-lg bg-blue-50 p-4'>
        <div className='flex items-start gap-3'>
          <MessageCircle className='mt-0.5 h-5 w-5 text-blue-600' />
          <div>
            <h4 className='mb-1 text-sm font-medium text-blue-900'>
              💡 Natural Communication Tips
            </h4>
            <ul className='space-y-1 text-sm text-blue-800'>
              <li>• Use contractions naturally (I'm, you're, we've)</li>
              <li>• Add personal touches and empathy</li>
              <li>• Reference specific details from conversations</li>
              <li>• Show genuine enthusiasm and concern</li>
              <li>• End with clear next steps and personal commitment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
