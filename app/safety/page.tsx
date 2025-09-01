'use client';

import { useState } from 'react';

export default function SafetyResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    'general' | 'drivers' | 'equipment' | 'compliance'
  >('general');

  // General Safety Resources
  const generalSafety = [
    {
      name: 'OSHA Trucking Safety',
      description:
        'Occupational Safety and Health Administration trucking industry guidelines',
      website: 'https://osha.gov/trucking',
      category: 'Regulations',
    },
    {
      name: 'FMCSA Safety Management',
      description:
        'Federal Motor Carrier Safety Administration safety management systems',
      website: 'https://fmcsa.dot.gov/safety',
      category: 'Federal',
    },
    {
      name: 'American Trucking Safety',
      description:
        'ATA safety programs and best practices for commercial motor vehicles',
      website: 'https://truckingsafety.org',
      category: 'Industry',
    },
    {
      name: 'National Safety Council',
      description: 'Commercial driving safety resources and training materials',
      website: 'https://nsc.org/road/commercial-vehicles',
      category: 'Training',
    },
  ];

  // Driver Safety Resources
  const driverSafety = [
    {
      name: 'Hours of Service Rules',
      description:
        'Complete guide to HOS regulations and electronic logging devices',
      website: 'https://fmcsa.dot.gov/regulations/hours-service',
      category: 'HOS',
    },
    {
      name: 'Smith System Training',
      description:
        'Professional driver safety training and defensive driving techniques',
      website: 'https://smithsystem.com',
      category: 'Training',
    },
    {
      name: 'National Registry Medical',
      description: 'DOT medical examiner certification and health requirements',
      website: 'https://nationalregistry.fmcsa.dot.gov',
      category: 'Medical',
    },
    {
      name: 'Truck Driver Safety',
      description: 'Comprehensive safety tips, checklists, and best practices',
      website: 'https://truckdriversafety.com',
      category: 'Resources',
    },
  ];

  // Equipment Safety Resources
  const equipmentSafety = [
    {
      name: 'DOT Vehicle Inspections',
      description:
        'Commercial vehicle safety inspection requirements and procedures',
      website: 'https://fmcsa.dot.gov/safety/inspections',
      category: 'Inspections',
    },
    {
      name: 'CVSA Safety Alliance',
      description:
        'Commercial Vehicle Safety Alliance inspection and enforcement',
      website: 'https://cvsa.org',
      category: 'Enforcement',
    },
    {
      name: 'Brake Safety Week',
      description:
        'Annual commercial vehicle brake safety campaign and resources',
      website: 'https://brakesafetyweek.org',
      category: 'Maintenance',
    },
    {
      name: 'Tire Safety Group',
      description:
        'Commercial tire safety, maintenance, and inspection guidelines',
      website: 'https://tiresafetygroup.com',
      category: 'Tires',
    },
  ];

  // Compliance Safety Resources
  const complianceSafety = [
    {
      name: 'Safety Management Systems',
      description: 'Implementing comprehensive safety management programs',
      website: 'https://fmcsa.dot.gov/safety/safety-management',
      category: 'Management',
    },
    {
      name: 'CSA Safety Scores',
      description:
        'Compliance, Safety, Accountability program and scoring system',
      website: 'https://ai.fmcsa.dot.gov/sms',
      category: 'Scoring',
    },
    {
      name: 'Safety Audit Prep',
      description: 'Preparing for DOT safety audits and compliance reviews',
      website: 'https://fmcsa.dot.gov/safety/audits',
      category: 'Audits',
    },
    {
      name: 'Drug & Alcohol Testing',
      description: 'DOT drug and alcohol testing requirements and procedures',
      website: 'https://fmcsa.dot.gov/regulations/drug-alcohol-testing',
      category: 'Testing',
    },
  ];

  return (
    <div>
      <h1>Safety Page</h1>
    </div>
  );
}
