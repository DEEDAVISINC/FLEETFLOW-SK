'use client';

import { useState } from 'react';

export default function ManufacturerPartnershipsTraining() {
  const [currentModule, setCurrentModule] = useState(1);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [showCertificate, setShowCertificate] = useState(false);

  const modules = [
    {
      id: 1,
      title: 'Manufacturing Industry Fundamentals',
      duration: '35 minutes',
      topics: [
        'Manufacturing Process Understanding',
        'Supply Chain Dynamics',
        'Production Scheduling Basics',
        'Quality Control Requirements',
        'Industry Terminology Mastery',
      ],
    },
    {
      id: 2,
      title: 'Logistics Integration Strategies',
      duration: '40 minutes',
      topics: [
        'Just-in-Time (JIT) Delivery',
        'Inventory Management Coordination',
        'Transportation Planning',
        'Warehouse Integration',
        'Cross-Docking Operations',
      ],
    },
    {
      id: 3,
      title: 'Partnership Development Framework',
      duration: '45 minutes',
      topics: [
        'Strategic Partnership Planning',
        'Mutual Value Creation',
        'Service Level Agreements',
        'Performance Metrics Alignment',
        'Risk Management Strategies',
      ],
    },
    {
      id: 4,
      title: 'Contract Optimization & Negotiation',
      duration: '35 minutes',
      topics: [
        'Contract Structure Analysis',
        'Pricing Strategy Development',
        'Terms and Conditions Optimization',
        'Performance Incentives',
        'Renewal Strategy Planning',
      ],
    },
    {
      id: 5,
      title: 'Long-term Growth Strategies',
      duration: '25 minutes',
      topics: [
        'Partnership Expansion Planning',
        'Technology Integration Opportunities',
        'Market Growth Identification',
        'Innovation Collaboration',
        'Sustainability Initiatives',
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
      <h1>Manufacturer Partnerships</h1>
    </div>
  );
}
