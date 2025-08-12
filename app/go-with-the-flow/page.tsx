'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function GoWithTheFlow() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [shipperRequests, setShipperRequests] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState(null);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [liveLoads, setLiveLoads] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [quoteStatus, setQuoteStatus] = useState<
    'idle' | 'generating' | 'completed' | 'error'
  >('idle');
  const [generatedQuotes, setGeneratedQuotes] = useState<any[]>([]);
  const [quoteProgress, setQuoteProgress] = useState(0);

  // Fetch system data on component mount
  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      // Fetch system metrics
      const metricsResponse = await fetch(
        '/api/go-with-the-flow?action=system-metrics'
      );
      const metricsData = await metricsResponse.json();
      if (metricsData.success) {
        setSystemMetrics(metricsData.metrics);
      }

      // Fetch available drivers
      const driversResponse = await fetch(
        '/api/go-with-the-flow?action=available-drivers'
      );
      const driversData = await driversResponse.json();
      if (driversData.success) {
        setAvailableDrivers(driversData.drivers);
      }

      // Fetch live loads
      const loadsResponse = await fetch(
        '/api/go-with-the-flow?action=live-loads'
      );
      const loadsData = await loadsResponse.json();
      if (loadsData.success) {
        setLiveLoads(loadsData.loads);
      }
    } catch (error) {
      console.error('Error fetching system data:', error);
    }
  };

  // AI Flow Quote Generation System
  const generateAIQuotes = async (loadRequest: any) => {
    try {
      // Simulate AI analysis and quote generation
      const aiAnalysis = await new Promise((resolve) =>
        setTimeout(() => {
          resolve({
            marketConditions: 'Strong demand, limited capacity',
            fuelCosts: '$3.85/gallon average',
            trafficPatterns: 'Moderate congestion expected',
            seasonalFactors: 'Peak season pricing active',
            competitorAnalysis: 'Market rates 15-20% above average',
          });
        }, 2000)
      );

      // Generate intelligent quotes based on AI analysis
      const quotes = [
        {
          id: `quote-${Date.now()}-1`,
          carrier: 'Premium Express Logistics',
          rate: calculateIntelligentRate(loadRequest, 'premium', aiAnalysis),
          eta: calculateETA(loadRequest, 'premium'),
          confidence: 95,
          features: [
            'Real-time tracking',
            'Insurance included',
            '24/7 support',
          ],
          reasoning:
            'Premium carrier with excellent safety record and on-time performance',
        },
        {
          id: `quote-${Date.now()}-2`,
          carrier: 'Reliable Transport Solutions',
          rate: calculateIntelligentRate(loadRequest, 'standard', aiAnalysis),
          eta: calculateETA(loadRequest, 'standard'),
          confidence: 88,
          features: [
            'Standard tracking',
            'Basic insurance',
            'Business hours support',
          ],
          reasoning:
            'Cost-effective option with good reliability and competitive pricing',
        },
        {
          id: `quote-${Date.now()}-3`,
          carrier: 'Economy Freight Services',
          rate: calculateIntelligentRate(loadRequest, 'economy', aiAnalysis),
          eta: calculateETA(loadRequest, 'economy'),
          confidence: 75,
          features: ['Basic tracking', 'Standard insurance', 'Email support'],
          reasoning: 'Budget-friendly option for non-urgent shipments',
        },
      ];

      return quotes;
    } catch (error) {
      console.error('Error generating AI quotes:', error);
      return [];
    }
  };

  // Intelligent rate calculation based on AI analysis
  const calculateIntelligentRate = (
    loadRequest: any,
    serviceLevel: string,
    aiAnalysis: any
  ) => {
    const baseRate = loadRequest.weight * 0.15; // Base rate per pound
    const distance = calculateDistance(
      loadRequest.origin,
      loadRequest.destination
    );
    const distanceMultiplier = distance * 0.85; // Rate per mile

    let serviceMultiplier = 1.0;
    switch (serviceLevel) {
      case 'premium':
        serviceMultiplier = 1.4;
        break;
      case 'standard':
        serviceMultiplier = 1.0;
        break;
      case 'economy':
        serviceMultiplier = 0.8;
        break;
    }

    const urgencyMultiplier =
      loadRequest.urgency === 'high'
        ? 1.3
        : loadRequest.urgency === 'medium'
          ? 1.1
          : 1.0;
    const marketMultiplier = 1.15; // Based on AI analysis of strong demand

    return Math.round(
      (baseRate + distanceMultiplier) *
        serviceMultiplier *
        urgencyMultiplier *
        marketMultiplier
    );
  };

  // Calculate ETA based on service level and route
  const calculateETA = (loadRequest: any, serviceLevel: string) => {
    const baseDays = 3; // Base transit time
    let serviceDays = baseDays;

    switch (serviceLevel) {
      case 'premium':
        serviceDays = baseDays - 1;
        break;
      case 'standard':
        serviceDays = baseDays;
        break;
      case 'economy':
        serviceDays = baseDays + 1;
        break;
    }

    const pickupDate = new Date(loadRequest.pickupDate);
    const deliveryDate = new Date(pickupDate);
    deliveryDate.setDate(deliveryDate.getDate() + serviceDays);

    return deliveryDate.toLocaleDateString();
  };

  // Calculate distance between two locations (simplified)
  const calculateDistance = (origin: string, destination: string) => {
    // Simplified distance calculation - in production, use real geocoding
    const distances: { [key: string]: number } = {
      'New York': 0,
      'Los Angeles': 2800,
      Chicago: 800,
      Houston: 1400,
      Phoenix: 2400,
      Philadelphia: 100,
      'San Antonio': 1800,
      'San Diego': 2800,
      Dallas: 1400,
      'San Jose': 2900,
    };

    const originDistance = distances[origin] || 500;
    const destDistance = distances[destination] || 500;
    return Math.abs(originDistance - destDistance);
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setQuoteStatus('generating');
    setQuoteProgress(0);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const loadRequest = {
        action: 'request-truck',
        loadRequest: {
          origin: formData.get('origin') as string,
          destination: formData.get('destination') as string,
          equipmentType: formData.get('equipmentType') as string,
          weight: parseInt(formData.get('weight') as string),
          urgency: formData.get('urgency') as 'low' | 'medium' | 'high',
          pickupDate: formData.get('pickupDate') as string,
          deliveryDate: formData.get('deliveryDate') as string,
          shipperId: `shipper-${Date.now()}`,
        },
      };

      // Step 1: Submit request to backend
      const response = await fetch('/api/go-with-the-flow/shipper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loadRequest),
      });

      const result = await response.json();

      if (result.success) {
        setQuoteProgress(25);

        // Step 2: AI Flow generates intelligent quotes
        const aiQuotes = await generateAIQuotes(loadRequest.loadRequest);
        setQuoteProgress(75);

        // Step 3: Send notification to notification hub
        await sendNotificationToHub({
          type: 'shipper_request',
          title: 'New Shipper Request',
          message: `New freight request from ${loadRequest.loadRequest.origin} to ${loadRequest.loadRequest.destination}`,
          priority: 'high',
          metadata: {
            loadId: result.load.id,
            origin: loadRequest.loadRequest.origin,
            destination: loadRequest.loadRequest.destination,
            equipmentType: loadRequest.loadRequest.equipmentType,
            weight: loadRequest.loadRequest.weight,
            urgency: loadRequest.loadRequest.urgency,
          },
        });

        setQuoteProgress(100);
        setQuoteStatus('completed');
        setGeneratedQuotes(aiQuotes);
        setNotificationMessage(
          `Request submitted successfully! Load ID: ${result.load.id}. Our team will contact you within 2 hours.`
        );

        // Refresh system data
        fetchSystemData();
      } else {
        setNotificationMessage('Error submitting request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setNotificationMessage('Error submitting request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendNotificationToHub = async (notificationData: any) => {
    try {
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loadData: {
            id: notificationData.metadata?.loadId || 'new-request',
            origin: notificationData.metadata?.origin || 'Unknown',
            destination: notificationData.metadata?.destination || 'Unknown',
            rate: 'TBD',
            pickupDate: new Date().toISOString(),
            equipment: notificationData.metadata?.equipmentType || 'Unknown',
            weight: notificationData.metadata?.weight?.toString() || 'Unknown',
          },
          recipients: [
            {
              id: 'admin-1',
              name: 'Admin Team',
              phone: '+1234567890',
              type: 'admin' as const,
            },
          ],
          notificationType: 'both',
          messageTemplate: 'new-load',
          urgency: notificationData.priority === 'high' ? 'high' : 'normal',
        }),
      });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleTrackingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const trackingNumber = formData.get('trackingNumber') as string;

      const response = await fetch(
        '/api/go-with-the-flow?action=track-load&trackingNumber=' +
          trackingNumber
      );
      const result = await response.json();

      if (result.success) {
        setNotificationMessage(
          `Load found! Status: ${result.load.status}. ETA: ${result.load.eta}`
        );

        // Send tracking notification
        await sendNotificationToHub({
          type: 'tracking_request',
          title: 'Load Tracking Request',
          message: `Tracking request for load: ${trackingNumber}`,
          priority: 'medium',
          metadata: {
            loadId: result.load.id,
            trackingNumber: trackingNumber,
          },
        });
      } else {
        setNotificationMessage(
          'Load not found. Please check your tracking number.'
        );
      }
    } catch (error) {
      console.error('Error tracking load:', error);
      setNotificationMessage('Error tracking load. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const contactData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        company: formData.get('company') as string,
        message: formData.get('message') as string,
        phone: formData.get('phone') as string,
      };

      const response = await fetch('/api/go-with-the-flow/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();

      if (result.success) {
        setNotificationMessage(
          "Message sent successfully! We'll respond within 24 hours."
        );

        // Send contact notification
        await sendNotificationToHub({
          type: 'contact_request',
          title: 'New Contact Request',
          message: `Contact request from ${contactData.name} at ${contactData.company}`,
          priority: 'medium',
          metadata: {
            contactName: contactData.name,
            contactCompany: contactData.company,
            contactEmail: contactData.email,
          },
        });
      } else {
        setNotificationMessage('Error sending message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending contact message:', error);
      setNotificationMessage('Error sending message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      company: 'Global Logistics Corp',
      role: 'Operations Director',
      content:
        'FleetFlow transformed our freight operations. The real-time tracking and AI-powered optimization saved us 30% on costs.',
      rating: 5,
      avatar: '👩‍💼',
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      company: 'Express Shipping Solutions',
      role: 'Fleet Manager',
      content:
        'Outstanding service and technology. Our drivers love the mobile app and our customers appreciate the transparency.',
      rating: 5,
      avatar: '👨‍💼',
    },
    {
      id: 3,
      name: 'Lisa Chen',
      company: 'Premium Cargo Services',
      role: 'CEO',
      content:
        "The best freight platform we've used. Professional, reliable, and the customer support is exceptional.",
      rating: 5,
      avatar: '👩‍💻',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        padding: '60px 16px 16px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
          radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)
        `,
          animation: 'pulse 4s ease-in-out infinite alternate',
        }}
      />

      <div
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Notification Display */}
        {notificationMessage && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              color: '#10b981',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span>✅</span>
            {notificationMessage}
            <button
              onClick={() => setNotificationMessage('')}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: '#10b981',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '0',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Enterprise Command Header */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background:
                'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6, #ef4444, #f59e0b)',
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '32px' }}>🚛</span>
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    color: 'white',
                    margin: '0 0 8px 0',
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  🚛 FLEETFLOW™ FREIGHT SOLUTIONS PORTAL
                </h1>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    marginBottom: '16px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '16px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: '0 0 12px 0',
                      fontWeight: '500',
                    }}
                  >
                    Professional Freight Services & Logistics Intelligence
                    Platform
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '700',
                        border: '1px solid #10b981',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      🟢 SERVICES ACTIVE
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      Platform Status: OPERATIONAL • 24/7 Support Available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { key: 'overview', label: '📊 Overview', icon: '📊' },
              { key: 'request', label: '🚀 Request Service', icon: '🚀' },
              { key: 'tracking', label: '📍 Track Shipment', icon: '📍' },
              { key: 'services', label: '🛠️ Our Services', icon: '🛠️' },
              { key: 'contact', label: '📞 Contact Us', icon: '📞' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background:
                    activeTab === tab.key
                      ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                      : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.key) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.key) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            minHeight: '600px',
          }}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              {/* Hero Section */}
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '48px',
                  padding: '40px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '20px',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                <h2
                  style={{
                    fontSize: '36px',
                    fontWeight: '800',
                    color: 'white',
                    marginBottom: '16px',
                    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  }}
                >
                  🚀 Transform Your Freight Operations
                </h2>
                <p
                  style={{
                    fontSize: '18px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '32px',
                    maxWidth: '800px',
                    margin: '0 auto 32px auto',
                    lineHeight: '1.6',
                  }}
                >
                  Join thousands of companies using FleetFlow's AI-powered
                  logistics platform to streamline operations, reduce costs, and
                  deliver exceptional customer experiences.
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    onClick={() => setActiveTab('request')}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none',
                      color: 'white',
                      padding: '16px 32px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 24px rgba(16, 185, 129, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 16px rgba(16, 185, 129, 0.4)';
                    }}
                  >
                    🚀 Get Started Today
                  </button>
                  <Link href='/go-with-the-flow/how-it-works'>
                    <button
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        padding: '16px 32px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.1)';
                      }}
                    >
                      📚 How It Works
                    </button>
                  </Link>
                </div>
              </div>

              {/* Stats Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '24px',
                  marginBottom: '48px',
                }}
              >
                {[
                  {
                    label: 'Active Users',
                    value: '15,000+',
                    icon: '👥',
                    color: '#3b82f6',
                  },
                  {
                    label: 'States Served',
                    value: '48',
                    icon: '🗺️',
                    color: '#10b981',
                  },
                  {
                    label: 'Success Rate',
                    value: '98.5%',
                    icon: '📈',
                    color: '#f59e0b',
                  },
                  {
                    label: 'Support Response',
                    value: '<2 hours',
                    icon: '⏰',
                    color: '#8b5cf6',
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    style={{
                      background: `rgba(${
                        stat.color === '#3b82f6'
                          ? '59, 130, 246'
                          : stat.color === '#10b981'
                            ? '16, 185, 129'
                            : stat.color === '#f59e0b'
                              ? '245, 158, 11'
                              : '139, 92, 246'
                      }, 0.1)`,
                      border: `1px solid rgba(${
                        stat.color === '#3b82f6'
                          ? '59, 130, 246'
                          : stat.color === '#10b981'
                            ? '16, 185, 129'
                            : stat.color === '#f59e0b'
                              ? '245, 158, 11'
                              : '139, 92, 246'
                      }, 0.3)`,
                      borderRadius: '16px',
                      padding: '24px',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 24px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                      {stat.icon}
                    </div>
                    <div
                      style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        color: stat.color,
                        marginBottom: '8px',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonials */}
              <div>
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: 'white',
                    textAlign: 'center',
                    marginBottom: '32px',
                  }}
                >
                  💬 What Our Customers Say
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                  }}
                >
                  {testimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        padding: '24px',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '16px',
                        }}
                      >
                        <div style={{ fontSize: '32px', marginRight: '16px' }}>
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div
                            style={{
                              color: 'white',
                              fontWeight: '600',
                              marginBottom: '4px',
                            }}
                          >
                            {testimonial.name}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '14px',
                            }}
                          >
                            {testimonial.company}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.5)',
                              fontSize: '12px',
                            }}
                          >
                            {testimonial.role}
                          </div>
                        </div>
                      </div>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '16px',
                          lineHeight: '1.5',
                        }}
                      >
                        {testimonial.content}
                      </p>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span
                            key={i}
                            style={{ color: '#fbbf24', fontSize: '16px' }}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Request Service Tab */}
          {activeTab === 'request' && (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'white',
                  textAlign: 'center',
                  marginBottom: '32px',
                }}
              >
                🚀 Request Freight Service
              </h2>
              <form
                onSubmit={handleRequestSubmit}
                style={{ display: 'grid', gap: '24px' }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '24px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: 'white',
                        marginBottom: '8px',
                        fontWeight: '600',
                      }}
                    >
                      Pickup Location
                    </label>
                    <input
                      type='text'
                      name='origin'
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                      }}
                      placeholder='City, State'
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: 'white',
                        marginBottom: '8px',
                        fontWeight: '600',
                      }}
                    >
                      Delivery Location
                    </label>
                    <input
                      type='text'
                      name='destination'
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                      }}
                      placeholder='City, State'
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '24px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: 'white',
                        marginBottom: '8px',
                        fontWeight: '600',
                      }}
                    >
                      Equipment Type
                    </label>
                    <select
                      name='equipmentType'
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    >
                      <option value='Dry Van'>Dry Van</option>
                      <option value='Reefer'>Reefer</option>
                      <option value='Flatbed'>Flatbed</option>
                      <option value='Power Only'>Power Only</option>
                      <option value='Step Deck'>Step Deck</option>
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: 'white',
                        marginBottom: '8px',
                        fontWeight: '600',
                      }}
                    >
                      Weight (lbs)
                    </label>
                    <input
                      type='number'
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                      }}
                      placeholder='0'
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '24px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: 'white',
                        marginBottom: '8px',
                        fontWeight: '600',
                      }}
                    >
                      Urgency Level
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    >
                      <option value='low'>Low - Flexible timing</option>
                      <option value='medium'>Medium - Standard delivery</option>
                      <option value='high'>High - Urgent delivery</option>
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: 'white',
                        marginBottom: '8px',
                        fontWeight: '600',
                      }}
                    >
                      Pickup Date
                    </label>
                    <input
                      type='date'
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'white',
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}
                  >
                    Special Requirements
                  </label>
                  <textarea
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      resize: 'vertical',
                    }}
                    placeholder='Any special handling, temperature requirements, or additional notes...'
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'white',
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}
                  >
                    Contact Information
                  </label>
                  <input
                    type='email'
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                    placeholder='your.email@company.com'
                  />
                </div>

                <button
                  type='submit'
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '16px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: isLoading ? 0.6 : 1,
                  }}
                >
                  {isLoading
                    ? 'Submitting...'
                    : '🚀 Submit Request & Get Quotes'}
                </button>
              </form>

              {/* AI Flow Quote Generation Progress */}
              {quoteStatus === 'generating' && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginTop: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                      🤖
                    </div>
                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: 'white',
                        marginBottom: '8px',
                      }}
                    >
                      AI Flow Generating Quotes
                    </h3>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                        marginBottom: '20px',
                      }}
                    >
                      Analyzing market conditions, fuel costs, and carrier
                      availability...
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        width: `${quoteProgress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #10b981, #059669)',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>

                  <div
                    style={{
                      textAlign: 'center',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    {quoteProgress}% Complete
                  </div>
                </div>
              )}

              {/* Generated Quotes Display */}
              {quoteStatus === 'completed' && generatedQuotes.length > 0 && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginTop: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                      ✨
                    </div>
                    <h3
                      style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: 'white',
                        marginBottom: '8px',
                      }}
                    >
                      AI-Generated Quotes Ready!
                    </h3>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      Intelligent pricing based on market analysis and carrier
                      optimization
                    </p>
                  </div>

                  <div style={{ display: 'grid', gap: '20px' }}>
                    {generatedQuotes.map((quote, index) => (
                      <div
                        key={quote.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '20px',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Confidence Badge */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            background: `rgba(${
                              quote.confidence >= 90
                                ? '16, 185, 129'
                                : quote.confidence >= 80
                                  ? '245, 158, 11'
                                  : '239, 68, 68'
                            }, 0.2)`,
                            border: `1px solid rgba(${
                              quote.confidence >= 90
                                ? '16, 185, 129'
                                : quote.confidence >= 80
                                  ? '245, 158, 11'
                                  : '239, 68, 68'
                            }, 0.4)`,
                            borderRadius: '20px',
                            padding: '4px 12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: `${
                              quote.confidence >= 90
                                ? '#10b981'
                                : quote.confidence >= 80
                                  ? '#f59e0b'
                                  : '#ef4444'
                            }`,
                          }}
                        >
                          {quote.confidence}% Confidence
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                          <h4
                            style={{
                              fontSize: '18px',
                              fontWeight: '700',
                              color: 'white',
                              marginBottom: '8px',
                            }}
                          >
                            {quote.carrier}
                          </h4>
                          <p
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '14px',
                              lineHeight: '1.5',
                            }}
                          >
                            {quote.reasoning}
                          </p>
                        </div>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fit, minmax(120px, 1fr))',
                            gap: '16px',
                            marginBottom: '16px',
                          }}
                        >
                          <div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '12px',
                                fontWeight: '600',
                                marginBottom: '4px',
                              }}
                            >
                              Rate
                            </div>
                            <div
                              style={{
                                fontSize: '24px',
                                fontWeight: '800',
                                color: '#10b981',
                              }}
                            >
                              ${quote.rate.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '12px',
                                fontWeight: '600',
                                marginBottom: '4px',
                              }}
                            >
                              ETA
                            </div>
                            <div
                              style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                color: 'white',
                              }}
                            >
                              {quote.eta}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '12px',
                              fontWeight: '600',
                              marginBottom: '8px',
                            }}
                          >
                            Features Included
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '8px',
                            }}
                          >
                            {quote.features.map(
                              (feature: string, featureIndex: number) => (
                                <span
                                  key={featureIndex}
                                  style={{
                                    background: 'rgba(59, 130, 246, 0.2)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    borderRadius: '16px',
                                    padding: '4px 12px',
                                    fontSize: '12px',
                                    color: '#3b82f6',
                                    fontWeight: '500',
                                  }}
                                >
                                  {feature}
                                </span>
                              )
                            )}
                          </div>
                        </div>

                        <button
                          style={{
                            width: '100%',
                            background:
                              'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            border: 'none',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            marginTop: '16px',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              'translateY(-2px)';
                            e.currentTarget.style.boxShadow =
                              '0 4px 12px rgba(59, 130, 246, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          🚀 Select This Quote
                        </button>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      textAlign: 'center',
                      marginTop: '24px',
                      padding: '20px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '12px',
                    }}
                  >
                    <p
                      style={{
                        color: '#10b981',
                        fontSize: '14px',
                        fontWeight: '600',
                        margin: 0,
                      }}
                    >
                      💡 AI Flow analyzed market conditions, fuel costs, traffic
                      patterns, and carrier performance to generate these
                      optimized quotes.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tracking Tab */}
          {activeTab === 'tracking' && (
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'white',
                  textAlign: 'center',
                  marginBottom: '32px',
                }}
              >
                📍 Track Your Shipment
              </h2>
              <form
                onSubmit={handleTrackingSubmit}
                style={{ display: 'grid', gap: '24px' }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: 'white',
                      marginBottom: '8px',
                      fontWeight: '600',
                    }}
                  >
                    Tracking Number or Load ID
                  </label>
                  <input
                    type='text'
                    name='trackingNumber'
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                    }}
                    placeholder='Enter your tracking number'
                  />
                </div>
                <button
                  type='submit'
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    border: 'none',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '16px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isLoading ? '🔍 Tracking...' : '📍 Track Shipment'}
                </button>

                <div
                  style={{
                    marginTop: '32px',
                    padding: '24px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      marginBottom: '16px',
                    }}
                  >
                    Sample Tracking Results
                  </h3>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {[
                      {
                        status: 'Load Delivered',
                        location: 'Miami, FL',
                        time: '2 hours ago',
                        color: '#10b981',
                      },
                      {
                        status: 'In Transit',
                        location: 'Jacksonville, FL',
                        time: '4 hours ago',
                        color: '#3b82f6',
                      },
                      {
                        status: 'Picked Up',
                        location: 'Atlanta, GA',
                        time: 'Yesterday',
                        color: '#6b7280',
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <div
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: item.color,
                          }}
                        />
                        <div>
                          <div style={{ color: 'white', fontWeight: '500' }}>
                            {item.status}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '14px',
                            }}
                          >
                            {item.location} - {item.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div>
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'white',
                  textAlign: 'center',
                  marginBottom: '32px',
                }}
              >
                🛠️ Comprehensive Freight Solutions
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textAlign: 'center',
                  marginBottom: '48px',
                  maxWidth: '800px',
                  margin: '0 auto 48px auto',
                  lineHeight: '1.6',
                }}
              >
                From single shipments to complex logistics operations, we
                provide end-to-end solutions that keep your business moving
                forward.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px',
                }}
              >
                {[
                  {
                    icon: '🚛',
                    title: 'Full Truckload (FTL)',
                    description:
                      'Dedicated trucks for your exclusive shipments with real-time tracking and guaranteed delivery times.',
                    features: [
                      'Dry van, reefer, flatbed, and specialized equipment',
                      'Nationwide coverage with local expertise',
                      'Competitive rates and flexible scheduling',
                    ],
                  },
                  {
                    icon: '📦',
                    title: 'Less Than Truckload (LTL)',
                    description:
                      'Cost-effective solutions for smaller shipments with consolidated freight options.',
                    features: [
                      'Multiple pickup and delivery points',
                      'Flexible weight and size requirements',
                      'Expedited and standard service options',
                    ],
                  },
                  {
                    icon: '🌡️',
                    title: 'Temperature Controlled',
                    description:
                      'Specialized reefer services for pharmaceuticals, food, and other temperature-sensitive cargo.',
                    features: [
                      'Real-time temperature monitoring',
                      'FDA and pharmaceutical compliance',
                      'Emergency backup systems',
                    ],
                  },
                  {
                    icon: '⚡',
                    title: 'Expedited & Hot Shot',
                    description:
                      'Urgent delivery services for time-critical shipments with dedicated drivers and equipment.',
                    features: [
                      'Same-day and next-day delivery',
                      'Dedicated drivers and equipment',
                      'Priority handling and routing',
                    ],
                  },
                ].map((service, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '24px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                      {service.icon}
                    </div>
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: '600',
                        marginBottom: '12px',
                      }}
                    >
                      {service.title}
                    </h3>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '16px',
                        lineHeight: '1.5',
                      }}
                    >
                      {service.description}
                    </p>
                    <ul style={{ display: 'grid', gap: '8px' }}>
                      {service.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                          }}
                        >
                          • {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'white',
                  textAlign: 'center',
                  marginBottom: '32px',
                }}
              >
                📞 Get in Touch
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textAlign: 'center',
                  marginBottom: '48px',
                  lineHeight: '1.6',
                }}
              >
                Ready to revolutionize your freight operations? Our team is here
                to help you get started with FleetFlow's powerful logistics
                platform.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                  gap: '48px',
                }}
              >
                <div>
                  <div style={{ display: 'grid', gap: '24px' }}>
                    {[
                      {
                        icon: '📞',
                        title: 'Phone Support',
                        value: '1-800-FLEET-FLOW',
                        subtitle: '24/7 Customer Service',
                      },
                      {
                        icon: '📧',
                        title: 'Email Support',
                        value: 'support@fleetflow.com',
                        subtitle: 'Response within 2 hours',
                      },
                      {
                        icon: '💬',
                        title: 'Live Chat',
                        value: 'Available on our website',
                        subtitle: 'Instant support during business hours',
                      },
                    ].map((contact, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                        }}
                      >
                        <div style={{ fontSize: '24px' }}>{contact.icon}</div>
                        <div>
                          <div
                            style={{
                              color: 'white',
                              fontWeight: '600',
                              marginBottom: '4px',
                            }}
                          >
                            {contact.title}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              marginBottom: '2px',
                            }}
                          >
                            {contact.value}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.5)',
                              fontSize: '14px',
                            }}
                          >
                            {contact.subtitle}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: '600',
                      marginBottom: '24px',
                    }}
                  >
                    Send us a Message
                  </h3>
                  <form
                    onSubmit={handleContactSubmit}
                    style={{ display: 'grid', gap: '16px' }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'white',
                          marginBottom: '8px',
                          fontWeight: '600',
                        }}
                      >
                        Name
                      </label>
                      <input
                        type='text'
                        name='name'
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px',
                        }}
                        placeholder='Your full name'
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'white',
                          marginBottom: '8px',
                          fontWeight: '600',
                        }}
                      >
                        Company
                      </label>
                      <input
                        type='text'
                        name='company'
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px',
                        }}
                        placeholder='Your company name'
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'white',
                          marginBottom: '8px',
                          fontWeight: '600',
                        }}
                      >
                        Email
                      </label>
                      <input
                        type='email'
                        name='email'
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px',
                        }}
                        placeholder='your.email@company.com'
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'white',
                          marginBottom: '8px',
                          fontWeight: '600',
                        }}
                      >
                        Phone
                      </label>
                      <input
                        type='tel'
                        name='phone'
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px',
                        }}
                        placeholder='Your phone number (optional)'
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          color: 'white',
                          marginBottom: '8px',
                          fontWeight: '600',
                        }}
                      >
                        Message
                      </label>
                      <textarea
                        name='message'
                        required
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '14px',
                          resize: 'vertical',
                        }}
                        placeholder='Tell us about your shipping needs...'
                      />
                    </div>
                    <button
                      type='submit'
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        border: 'none',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.7 : 1,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {isLoading ? '📤 Sending...' : '📤 Send Message'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            marginTop: '32px',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: 'white',
              marginBottom: '16px',
            }}
          >
            🚀 Ready to Transform Your Freight Operations?
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '32px',
              maxWidth: '600px',
              margin: '0 auto 32px auto',
              lineHeight: '1.6',
            }}
          >
            Join thousands of companies already using FleetFlow to streamline
            their logistics, reduce costs, and improve customer satisfaction.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => setActiveTab('request')}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              🚀 Start Shipping Today
            </button>
            <Link href='/go-with-the-flow/how-it-works'>
              <button
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                📚 How It Works
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
