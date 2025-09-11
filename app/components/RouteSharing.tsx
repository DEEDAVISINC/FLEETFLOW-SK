'use client';

import { useState } from 'react';
import { OptimizedRoute } from '../services/route-optimization';

interface ShareOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  recipients: string[];
  includeDetails: boolean;
}

interface Stakeholder {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'driver' | 'dispatcher' | 'carrier' | 'broker';
  company?: string;
}

interface RouteSharingProps {
  route: OptimizedRoute;
  onShare: (shareData: {
    route: OptimizedRoute;
    recipients: Stakeholder[];
    shareOptions: ShareOption[];
    message?: string;
    includeTracking?: boolean;
  }) => void;
  onClose: () => void;
}

export default function RouteSharing({
  route,
  onShare,
  onClose,
}: RouteSharingProps) {
  const [selectedStakeholders, setSelectedStakeholders] = useState<
    Stakeholder[]
  >([]);
  const [selectedShareOptions, setSelectedShareOptions] = useState<
    ShareOption[]
  >([]);
  const [customMessage, setCustomMessage] = useState('');
  const [includeTracking, setIncludeTracking] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'stakeholders' | 'options' | 'preview'
  >('stakeholders');

  // Sample stakeholders - in production, these would come from the database
  const availableStakeholders: Stakeholder[] = [
    {
      id: 'customer_1',
      name: 'John Smith',
      email: 'john@acmecorp.com',
      phone: '(555) 123-4567',
      role: 'customer',
      company: 'ACME Corporation',
    },
    {
      id: 'driver_1',
      name: 'Mike Johnson',
      email: 'mike.johnson@fleetflowapp.com',
      phone: '(555) 987-6543',
      role: 'driver',
      company: 'FleetFlow',
    },
    {
      id: 'dispatcher_1',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@fleetflowapp.com',
      phone: '(555) 456-7890',
      role: 'dispatcher',
      company: 'FleetFlow',
    },
    {
      id: 'carrier_1',
      name: 'Express Logistics',
      email: 'dispatch@expresslogistics.com',
      phone: '(555) 321-0987',
      role: 'carrier',
      company: 'Express Logistics Inc.',
    },
    {
      id: 'broker_1',
      name: 'Global Freight',
      email: 'operations@globalfreight.com',
      phone: '(555) 654-3210',
      role: 'broker',
      company: 'Global Freight Solutions',
    },
  ];

  const shareOptions: ShareOption[] = [
    {
      id: 'route_summary',
      name: 'Route Summary',
      description:
        'Basic route information with pickup/delivery locations and times',
      icon: '📋',
      recipients: ['customer', 'driver', 'dispatcher', 'carrier', 'broker'],
      includeDetails: false,
    },
    {
      id: 'detailed_route',
      name: 'Detailed Route Plan',
      description:
        'Complete route with turn-by-turn directions and optimization details',
      icon: '🗺️',
      recipients: ['driver', 'dispatcher'],
      includeDetails: true,
    },
    {
      id: 'tracking_link',
      name: 'Live Tracking Link',
      description: 'Real-time tracking URL for shipment monitoring',
      icon: '📍',
      recipients: ['customer', 'broker'],
      includeDetails: false,
    },
    {
      id: 'eta_updates',
      name: 'ETA Updates',
      description: 'Automated notifications for delivery time changes',
      icon: '⏰',
      recipients: ['customer', 'dispatcher', 'broker'],
      includeDetails: false,
    },
    {
      id: 'performance_metrics',
      name: 'Performance Metrics',
      description:
        'Efficiency scores, fuel savings, and cost optimization data',
      icon: '📊',
      recipients: ['dispatcher', 'carrier', 'broker'],
      includeDetails: true,
    },
    {
      id: 'document_package',
      name: 'Document Package',
      description: 'BOL, rate confirmation, and other shipping documents',
      icon: '📄',
      recipients: ['customer', 'driver', 'carrier', 'broker'],
      includeDetails: true,
    },
  ];

  const handleStakeholderToggle = (stakeholder: Stakeholder) => {
    setSelectedStakeholders((prev) => {
      const isSelected = prev.some((s) => s.id === stakeholder.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== stakeholder.id);
      } else {
        return [...prev, stakeholder];
      }
    });
  };

  const handleShareOptionToggle = (option: ShareOption) => {
    setSelectedShareOptions((prev) => {
      const isSelected = prev.some((o) => o.id === option.id);
      if (isSelected) {
        return prev.filter((o) => o.id !== option.id);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleShare = () => {
    onShare({
      route,
      recipients: selectedStakeholders,
      shareOptions: selectedShareOptions,
      message: customMessage,
      includeTracking,
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'customer':
        return '#3b82f6';
      case 'driver':
        return '#10b981';
      case 'dispatcher':
        return '#8b5cf6';
      case 'carrier':
        return '#f59e0b';
      case 'broker':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'customer':
        return '🏢';
      case 'driver':
        return '🚛';
      case 'dispatcher':
        return '📡';
      case 'carrier':
        return '🚚';
      case 'broker':
        return '🤝';
      default:
        return '👤';
    }
  };

  return (
    <div>
      <h1>Route Sharing</h1>
    </div>
  );
}
