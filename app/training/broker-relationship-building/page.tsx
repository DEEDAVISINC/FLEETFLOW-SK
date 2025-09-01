'use client';

import { useState } from 'react';

export default function BrokerRelationshipBuildingTraining() {
  const [currentModule, setCurrentModule] = useState(1);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [showCertificate, setShowCertificate] = useState(false);

  const modules = [
    {
      id: 1,
      title: 'Relationship Building Fundamentals',
      duration: '40 minutes',
      topics: [
        'Trust Development Strategies',
        'Professional Communication Excellence',
        'Active Listening Techniques',
        'Rapport Building Methods',
        'First Impression Management',
      ],
    },
    {
      id: 2,
      title: 'Shipper Relationship Management',
      duration: '45 minutes',
      topics: [
        'Shipper Needs Analysis',
        'Service Level Optimization',
        'Problem Resolution Strategies',
        'Value-Added Service Identification',
        'Shipper Retention Techniques',
      ],
    },
    {
      id: 3,
      title: 'Manufacturer Partnership Development',
      duration: '50 minutes',
      topics: [
        'Manufacturing Logistics Understanding',
        'Supply Chain Integration',
        'Production Schedule Coordination',
        'Quality Service Delivery',
        'Long-term Partnership Strategies',
      ],
    },
    {
      id: 4,
      title: 'Account Management Excellence',
      duration: '40 minutes',
      topics: [
        'Account Growth Strategies',
        'Performance Metrics Management',
        'Regular Review Processes',
        'Upselling and Cross-selling',
        'Customer Success Planning',
      ],
    },
    {
      id: 5,
      title: 'Revenue Optimization Through Relationships',
      duration: '25 minutes',
      topics: [
        'Relationship ROI Analysis',
        'Premium Service Positioning',
        'Contract Negotiation Excellence',
        'Loyalty Program Development',
        'Referral Network Building',
      ],
    },
  ];

  const completeModule = (moduleId: number) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId]);
    }
    if (moduleId < modules.length) {
      setCurrentModule(moduleId + 1);
    } else {
      setShowCertificate(true);
    }
  };

  const getModuleStatus = (moduleId: number) => {
    if (completedModules.includes(moduleId)) return 'completed';
    if (moduleId === currentModule) return 'current';
    return 'locked';
  };

  return (
    <div>
      <h1>Broker Relationship Building</h1>
    </div>
  );
}
