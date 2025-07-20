'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Truck, Users, BarChart3, Settings, Bell, Plus, Search, Filter, Download, PhoneCall, MessageSquare, MapPin, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, User, Target, Zap, Bot, Send, UserPlus, Star, Award, Play, Activity, Shield, Cpu, Headphones } from 'lucide-react';
import AIAutomationDashboard from './AIAutomationDashboard';
import { FreeSWITCHCallCenterDashboard } from './FreeSWITCHCallCenterDashboard';
import FreightBrokerDashboard from './FreightBrokerDashboard';
import AIOperationsCenter from './AIOperationsCenter';

export default function AIFlowPlatform() {
  const [activeView, setActiveView] = useState('dashboard');
  const [activeCalls, setActiveCalls] = useState<any[]>([]);
  const [loads, setLoads] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>({});
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [dispatchQueue, setDispatchQueue] = useState<any[]>([]);
  const [activeDispatches, setActiveDispatches] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [recruitingCampaigns, setRecruitingCampaigns] = useState<any[]>([]);
  const [messageTemplates, setMessageTemplates] = useState<any[]>([]);
  const [aiConversations, setAiConversations] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [brokerAppointments, setBrokerAppointments] = useState<any[]>([]);
  const [dispatchAppointments, setDispatchAppointments] = useState<any[]>([]);
  const [schedulingQueue, setSchedulingQueue] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize sample data
  useEffect(() => {
    setActiveCalls([
      {
        id: 1,
        caller: "Mark Thompson",
        phone: "(555) 123-4567",
        type: "Driver Recruitment",
        status: "active",
        duration: "02:34",
        sentiment: "positive",
        leadScore: 82
      },
      {
        id: 2,
        caller: "Sarah Wilson",
        phone: "(555) 987-6543",
        type: "Freight Inquiry",
        status: "hold",
        duration: "01:45",
        sentiment: "neutral",
        leadScore: 67
      }
    ]);

    setLoads([
      {
        id: "FL-001",
        origin: "Chicago, IL",
        destination: "Atlanta, GA",
        weight: "45,000 lbs",
        rate: "$2,850",
        status: "In Transit",
        driver: "Mike Rodriguez",
        revenue: 2850,
        margin: 15
      },
      {
        id: "FL-002",
        origin: "Dallas, TX",
        destination: "Phoenix, AZ",
        weight: "38,500 lbs",
        rate: "$1,950",
        status: "Dispatched",
        driver: "Lisa Chen",
        revenue: 1950,
        margin: 18
      }
    ]);

    setDrivers([
      {
        id: "DR-001",
        name: "Mike Rodriguez",
        phone: "(555) 234-5678",
        location: "Chicago, IL",
        status: "In Transit",
        loadId: "FL-001",
        rating: 4.8,
        availability: "Available 12/28"
      },
      {
        id: "DR-002",
        name: "Lisa Chen",
        phone: "(555) 345-6789",
        location: "Dallas, TX",
        status: "Dispatched",
        loadId: "FL-002",
        rating: 4.9,
        availability: "Available 12/26"
      }
    ]);

    setCustomers([
      {
        id: "CU-001",
        name: "ABC Manufacturing",
        contact: "John Smith",
        phone: "(555) 456-7890",
        loads: 23,
        revenue: 65000,
        status: "Active"
      },
      {
        id: "CU-002",
        name: "XYZ Logistics",
        contact: "Jane Doe",
        phone: "(555) 567-8901",
        loads: 18,
        revenue: 48000,
        status: "Active"
      }
    ]);

    setNotifications([
      {
        id: 1,
        type: "urgent",
        message: "Driver Mike Rodriguez reports traffic delay - ETA updated",
        timestamp: "2 min ago"
      },
      {
        id: 2,
        type: "success",
        message: "Load FL-003 successfully delivered and signed",
        timestamp: "15 min ago"
      }
    ]);

    setMetrics({
      totalCalls: 1247,
      activeLoads: 42,
      availableDrivers: 18,
      dailyRevenue: 23750,
      callsHandled: 1685,
      automationRate: 91,
      leadAccuracy: 96,
      avgResponseTime: 18
    });

    setAiInsights([
      {
        type: "optimization",
        title: "Route Optimization Opportunity",
        description: "Combine FL-004 and FL-005 for 15% cost savings",
        impact: "$450 savings",
        priority: "medium"
      },
      {
        type: "alert",
        title: "Driver Shortage Alert",
        description: "Phoenix region showing 23% driver shortage",
        impact: "Potential delays",
        priority: "high"
      }
    ]);

    setDispatchQueue([
      {
        id: "DQ-001",
        load: "FL-010",
        origin: "Seattle, WA",
        destination: "Portland, OR",
        priority: "high",
        requiredBy: "12/26 8:00 AM",
        matchingDrivers: 3
      },
      {
        id: "DQ-002",
        load: "FL-011",
        origin: "Denver, CO",
        destination: "Salt Lake City, UT",
        priority: "medium",
        requiredBy: "12/26 2:00 PM",
        matchingDrivers: 7
      }
    ]);

    setActiveDispatches([
      {
        id: "AD-001",
        load: "FL-001",
        driver: "Mike Rodriguez",
        status: "En Route",
        eta: "12/25 6:00 PM",
        completion: 65
      },
      {
        id: "AD-002",
        load: "FL-002",
        driver: "Lisa Chen",
        status: "Pickup Complete",
        eta: "12/26 10:00 AM",
        completion: 35
      }
    ]);

    setLeads([
      {
        id: "L-001",
        name: "Robert Johnson",
        phone: "(555) 678-9012",
        experience: "5 years OTR",
        cdlClass: "Class A",
        score: 89,
        status: "Hot Lead",
        source: "Indeed"
      },
      {
        id: "L-002",
        name: "Maria Garcia",
        phone: "(555) 789-0123",
        experience: "3 years Regional",
        cdlClass: "Class A",
        score: 76,
        status: "Qualified",
        source: "Facebook"
      }
    ]);

    setRecruitingCampaigns([
      {
        id: "RC-001",
        name: "OTR Driver Holiday Bonus",
        platform: "Indeed",
        budget: "$2,500",
        leads: 47,
        qualified: 12,
        hired: 3,
        status: "Active"
      },
      {
        id: "RC-002",
        name: "Regional Driver Referral",
        platform: "Facebook",
        budget: "$1,800",
        leads: 23,
        qualified: 8,
        hired: 2,
        status: "Active"
      }
    ]);

    setMessageTemplates([
      {
        id: "MT-001",
        name: "Driver Welcome Call",
        type: "Voice",
        content: "Welcome to FleetFlow! We're excited to have you on our team...",
        usage: 156,
        effectiveness: 94
      },
      {
        id: "MT-002",
        name: "Load Assignment SMS",
        type: "SMS",
        content: "New load assigned: {loadId}. Pickup: {origin} at {time}...",
        usage: 445,
        effectiveness: 87
      }
    ]);

    setAiConversations([
      {
        id: "AC-001",
        contact: "Driver Mike Rodriguez",
        lastMessage: "AI: Your next load is ready for pickup in Chicago...",
        sentiment: "positive",
        resolved: true,
        timestamp: "10 min ago"
      },
      {
        id: "AC-002",
        contact: "Customer ABC Manufacturing",
        lastMessage: "AI: Your shipment is on schedule for delivery...",
        sentiment: "neutral",
        resolved: false,
        timestamp: "25 min ago"
      }
    ]);

    setAppointments([
      {
        id: "AP-001",
        contact: "Robert Johnson",
        type: "Driver Interview",
        date: "12/26/2024",
        time: "10:00 AM",
        status: "Confirmed",
        notes: "OTR position discussion"
      },
      {
        id: "AP-002",
        contact: "ABC Manufacturing",
        type: "Contract Review",
        date: "12/26/2024",
        time: "2:00 PM",
        status: "Pending",
        notes: "Q1 2025 rates"
      }
    ]);

    setBrokerAppointments([
      {
        id: "BA-001",
        customer: "XYZ Logistics",
        contact: "Jane Doe",
        purpose: "Rate Negotiation",
        date: "12/27/2024",
        time: "9:00 AM",
        value: "$25,000"
      },
      {
        id: "BA-002",
        customer: "Global Freight Co",
        contact: "Tom Wilson",
        purpose: "New Contract",
        date: "12/27/2024",
        time: "11:00 AM",
        value: "$45,000"
      }
    ]);

    setDispatchAppointments([
      {
        id: "DA-001",
        driver: "Mike Rodriguez",
        purpose: "Route Planning",
        date: "12/26/2024",
        time: "8:00 AM",
        load: "FL-015"
      },
      {
        id: "DA-002",
        driver: "Lisa Chen",
        purpose: "Equipment Check",
        date: "12/26/2024",
        time: "1:00 PM",
        load: "FL-016"
      }
    ]);

    setSchedulingQueue([
      {
        id: "SQ-001",
        requestType: "Driver Interview",
        contact: "Jennifer Adams",
        priority: "high",
        preferredTime: "Morning",
        autoScheduled: false
      },
      {
        id: "SQ-002",
        requestType: "Customer Meeting",
        contact: "Delta Shipping",
        priority: "medium",
        preferredTime: "Afternoon",
        autoScheduled: true
      }
    ]);
  }, []);

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'active': 'bg-green-100 text-green-800',
      'hold': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-blue-100 text-blue-800',
      'In Transit': 'bg-blue-100 text-blue-800',
      'Dispatched': 'bg-purple-100 text-purple-800',
      'Available': 'bg-green-100 text-green-800',
      'Qualified': 'bg-green-100 text-green-800',
      'Hot Lead': 'bg-red-100 text-red-800',
      'Confirmed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      {/* Enhanced Header with Real-Time Data */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px'
            }}>
              <span style={{ fontSize: '32px' }}>🤖</span>
            </div>
            <div>
              <h1 style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#d946ef',
                margin: '0 0 8px 0',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}>
                AI FLOW PLATFORM
              </h1>
              <p style={{
                fontSize: '18px',
                color: '#ec4899',
                margin: '0 0 8px 0'
              }}>
                Complete Trucking Operations with AI-Powered Automation & Intelligence
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981'
                }}>
                  ✅ OPERATIONAL
                </span>
                <span>•</span>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#3b82f6'
                }}>
                  🤖 AI ACTIVE
                </span>
                <span>•</span>
                <span>System Status: Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Dashboard - Compliance Style */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {[
          { label: 'Active Calls', value: metrics.totalCalls, color: '#10b981', icon: '📞', status: 'OPERATIONAL' },
          { label: 'Active Loads', value: metrics.activeLoads, color: '#3b82f6', icon: '🚛', status: 'TRACKING' },
          { label: 'Available Drivers', value: metrics.availableDrivers, color: '#8b5cf6', icon: '👥', status: 'AVAILABLE' },
          { label: 'Daily Revenue', value: formatCurrency(metrics.dailyRevenue), color: '#f59e0b', icon: '💰', status: 'PROCESSING' },
          { label: 'Automation Rate', value: `${metrics.automationRate}%`, color: '#06b6d4', icon: '🤖', status: 'ACTIVE' },
          { label: 'Lead Accuracy', value: `${metrics.leadAccuracy}%`, color: '#ef4444', icon: '🎯', status: 'OPTIMAL' }
        ].map((stat, index) => (
          <div key={index} style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <div style={{
                fontSize: '24px',
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px'
              }}>
                {stat.icon}
              </div>
              <div style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: '700',
                background: `${stat.color}20`,
                color: stat.color,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {stat.status}
              </div>
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '8px',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              {stat.value}
            </div>
            <div style={{
              color: '#ec4899',
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Search and Navigation - Compliance Style */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search across all AI operations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 40px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.3s ease',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              backdropFilter: 'blur(5px)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#d946ef';
              e.target.style.boxShadow = '0 0 0 3px rgba(217, 70, 239, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.boxShadow = 'none';
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          />
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#d946ef',
            fontSize: '20px'
          }}>
            🔍
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊', color: '#334155', borderColor: 'rgba(51, 65, 85, 0.3)' },
            { id: 'callcenter', label: 'Call Center', icon: '📞', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' },
            { id: 'broker', label: 'Freight Broker', icon: '🚛', color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)' },
            { id: 'operations', label: 'AI Operations', icon: '🤖', color: '#d946ef', borderColor: 'rgba(217, 70, 239, 0.3)' },
            { id: 'dispatch', label: 'Dispatch', icon: '🗂️', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.3)' },
            { id: 'recruiting', label: 'Recruiting', icon: '👥', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' },
            { id: 'scheduler', label: 'Scheduler', icon: '📅', color: '#06b6d4', borderColor: 'rgba(6, 182, 212, 0.3)' },
            { id: 'analytics', label: 'Analytics', icon: '📈', color: '#8b5cf6', borderColor: 'rgba(139, 92, 246, 0.3)' }
          ].map((tab) => {
                          const getGradient = (color: string) => {
                switch (color) {
                  case '#f59e0b': return 'linear-gradient(135deg, #f59e0b, #d97706)'; // Orange
                  case '#3b82f6': return 'linear-gradient(135deg, #3b82f6, #2563eb)'; // Blue
                  case '#8b5cf6': return 'linear-gradient(135deg, #8b5cf6, #7c3aed)'; // Purple
                  case '#10b981': return 'linear-gradient(135deg, #10b981, #059669)'; // Green
                  case '#ef4444': return 'linear-gradient(135deg, #ef4444, #dc2626)'; // Red
                  case '#06b6d4': return 'linear-gradient(135deg, #06b6d4, #0891b2)'; // Cyan
                  case '#d946ef': return 'linear-gradient(135deg, #d946ef, #c026d3)'; // Dark Pink (AI Operations)
                  case '#334155': return 'linear-gradient(135deg, #334155, #475569)'; // Slate (Dashboard)
                  default: return 'linear-gradient(135deg, #334155, #475569)'; // Slate (default)
                }
              };
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                style={{
                  background: activeView === tab.id ? 
                    getGradient(tab.color) : 
                    'rgba(255, 255, 255, 0.1)',
                  color: activeView === tab.id ? 'white' : 'rgba(255, 255, 255, 0.8)',
                  border: activeView === tab.id ? 
                    `1px solid ${tab.borderColor}` : 
                    '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(5px)',
                  boxShadow: activeView === tab.id ? 
                    `0 4px 12px ${tab.color}33` : 
                    '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
                onMouseOver={(e) => {
                  if (activeView !== tab.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeView !== tab.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {tab.icon} {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area - Compliance Style */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '24px',
        marginBottom: '32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        {activeView === 'dashboard' && (
          <div>
            <h2 style={{ 
              color: '#d946ef', 
              marginBottom: '24px', 
              fontSize: '24px', 
              fontWeight: '700',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              📊 Real-Time Operations Dashboard
              <div style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: '700',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                textTransform: 'uppercase'
              }}>
                LIVE
              </div>
            </h2>
            {/* Recent Activity - Compliance Style */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.08)', 
                backdropFilter: 'blur(10px)',
                borderRadius: '16px', 
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ 
                  marginBottom: '20px', 
                  color: '#d946ef', 
                  fontSize: '18px', 
                  fontWeight: '700',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  Recent Calls
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {activeCalls.slice(0, 3).map((call) => (
                    <div key={call.id} style={{
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(5px)',
                      borderLeft: '4px solid #10b981'
                    }}>
                      <div>
                        <div style={{ fontWeight: '700', color: 'white' }}>{call.caller}</div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>{call.type}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '700', color: 'white' }}>{call.duration}</div>
                        <div style={{ 
                          color: '#10b981', 
                          fontSize: '12px',
                          fontWeight: '600',
                          padding: '2px 6px',
                          background: 'rgba(16, 185, 129, 0.2)',
                          borderRadius: '4px'
                        }}>
                          Score: {call.leadScore}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.08)', 
                backdropFilter: 'blur(10px)',
                borderRadius: '16px', 
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ 
                  marginBottom: '20px', 
                  color: '#d946ef', 
                  fontSize: '18px', 
                  fontWeight: '700',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                  Active Loads
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {loads.slice(0, 3).map((load) => (
                    <div key={load.id} style={{
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(5px)',
                      borderLeft: '4px solid #3b82f6'
                    }}>
                      <div>
                        <div style={{ fontWeight: '700', color: 'white' }}>{load.id}</div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}>{load.origin} → {load.destination}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '700', color: 'white' }}>{load.rate}</div>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '10px',
                          fontWeight: '700',
                          background: load.status === 'In Transit' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                          color: load.status === 'In Transit' ? '#3b82f6' : '#8b5cf6',
                          textTransform: 'uppercase'
                        }}>
                          {load.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* AI Insights - Alert Style */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ 
                marginBottom: '20px', 
                color: '#d946ef', 
                fontSize: '18px', 
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                🤖 AI Insights & Recommendations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {aiInsights.map((insight, index) => (
                  <div key={index} style={{
                    display: 'flex', 
                    alignItems: 'start',
                    padding: '16px 20px',
                    background: insight.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 
                               insight.priority === 'medium' ? 'rgba(245, 158, 11, 0.1)' : 
                               'rgba(16, 185, 129, 0.1)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    gap: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(5px)',
                    borderLeft: `4px solid ${insight.priority === 'high' ? '#ef4444' : insight.priority === 'medium' ? '#f59e0b' : '#10b981'}`
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: insight.priority === 'high' ? '#ef4444' : insight.priority === 'medium' ? '#f59e0b' : '#10b981',
                      marginTop: '4px',
                      boxShadow: `0 0 8px ${insight.priority === 'high' ? '#ef4444' : insight.priority === 'medium' ? '#f59e0b' : '#10b981'}40`
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: '700', 
                        color: 'white', 
                        marginBottom: '6px',
                        fontSize: '15px'
                      }}>
                        {insight.title}
                      </div>
                      <div style={{ 
                        color: 'rgba(255, 255, 255, 0.8)', 
                        fontSize: '13px', 
                        marginBottom: '6px',
                        lineHeight: '1.4'
                      }}>
                        {insight.description}
                      </div>
                      <div style={{ 
                        color: insight.priority === 'high' ? '#ef4444' : insight.priority === 'medium' ? '#f59e0b' : '#10b981',
                        fontSize: '12px', 
                        fontWeight: '700',
                        padding: '4px 8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        display: 'inline-block'
                      }}>
                        {insight.impact}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeView === 'callcenter' && (
          <div>
            <h2 style={{ 
              color: '#d946ef', 
              marginBottom: '24px', 
              fontSize: '24px', 
              fontWeight: '700',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              📞 FreeSWITCH Call Center & Lead Generation
              <div style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: '700',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                textTransform: 'uppercase'
              }}>
                LIVE
              </div>
            </h2>
            <FreeSWITCHCallCenterDashboard />
          </div>
        )}
        
        {activeView === 'broker' && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <h2 style={{ color: '#d946ef', margin: 0, fontSize: '20px', fontWeight: '600' }}>
                🚛 AI Freight Broker Operations
              </h2>
              <div style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: '700',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                textTransform: 'uppercase'
              }}>
                AI POWERED
              </div>
            </div>
            <FreightBrokerDashboard />
          </div>
        )}

        {activeView === 'operations' && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <h2 style={{ color: '#d946ef', margin: 0, fontSize: '20px', fontWeight: '600' }}>
                🤖 AI Operations Center
              </h2>
              <div style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: '700',
                background: 'rgba(217, 70, 239, 0.2)',
                color: '#d946ef',
                textTransform: 'uppercase'
              }}>
                UNIFIED OPERATIONS
              </div>
            </div>
            <AIOperationsCenter />
          </div>
        )}
        
        {activeView === 'analytics' && (
          <div>
            <h2 style={{ color: '#d946ef', marginBottom: '20px', fontSize: '20px', fontWeight: '600' }}>
              📈 Analytics & Performance
            </h2>
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>96%</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Platform Efficiency</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>$52k</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Monthly Savings</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>91%</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Automation Rate</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>1,247</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Daily Calls</div>
                </div>
              </div>
              
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                <h4 style={{ marginBottom: '12px', color: '#d946ef', fontSize: '16px', fontWeight: '600' }}>Cost Savings Breakdown</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'API Costs Eliminated', value: '$52,000/month' },
                    { label: 'Staff Automation', value: '$32,000/month' },
                    { label: 'Efficiency Gains', value: '$21,000/month' },
                    { label: 'Technology Licensing', value: '$15,000/month' }
                  ].map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}>
                      <div style={{ color: '#374151' }}>{item.label}</div>
                      <div style={{ fontWeight: '600', color: '#10b981' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 