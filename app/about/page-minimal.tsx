'use client';

import { useState } from 'react';

export default function AboutUsPageMinimal() {
  const [activeSection, setActiveSection] = useState('culture');

  const sections = [
    { id: 'culture', label: 'Our Culture', icon: '🌟' },
    { id: 'analytics', label: 'Business Intelligence', icon: '📊' },
    { id: 'logistics', label: 'Logistics Intelligence', icon: '🚛' },
    { id: 'leadership', label: 'Leadership', icon: '👥' },
  ];

  return (
    <div>
      <h1>About Us</h1>
      <p>Test content</p>
    </div>
  );
}







