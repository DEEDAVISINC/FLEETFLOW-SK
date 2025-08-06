'use client'

import React, { useState, useEffect } from 'react';
import { Truck, Users, Calendar, TrendingUp, AlertTriangle, CheckCircle, Clock, Target, Zap, Activity, DollarSign, MapPin, Phone, Mail, Star, Award, ShieldCheck, BarChart3, ArrowRight, Plus, RefreshCw, Search, Filter, Eye, Edit, UserPlus, Settings, FileText, Headphones, Send, Navigation, Loader2 } from 'lucide-react';
import { AIDispatcher } from '../services/ai-dispatcher';
import AIRecruitingService from '../services/AIRecruitingService';
import { SchedulingService } from '../scheduling/service';
import FreightBrokerAgentSystem from '../services/FreightBrokerAgentSystem';

export default function AIOperationsCenter() {
  const [activeTab, setActiveTab] = useState('overview');
  const [aiDispatcher] = useState(() => new AIDispatcher());
  const [aiRecruiting] = useState(() => new AIRecruitingService());
  const [schedulingService] = useState(() => new SchedulingService());
  const [freightBroker] = useState(() => new FreightBrokerAgentSystem());
  
  const [metrics, setMetrics] = useState<any>({});
  const [ownerOperators, setOwnerOperators] = useState<any[]>([]);
  const [carrierMatches, setCarrierMatches] = useState<any[]>([]);
  const [activeLoads, setActiveLoads] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      const [recruitingMetrics, operators, matches, loads, scheduleData] = await Promise.all([
        aiRecruiting.getRecruitingMetrics(),
        aiRecruiting.getAllOwnerOperators(),
        aiRecruiting.getCarrierMatches(),
        getMockLoads(),
        schedulingService.getSchedules()
      ]);

      setMetrics(recruitingMetrics);
      setOwnerOperators(operators);
      setCarrierMatches(matches);
      setActiveLoads(loads);
      setSchedules(scheduleData);
      setLoading(false);
    } catch (error) {
      console.error('Error initializing data:', error);
      setLoading(false);
    }
  };

  const getMockLoads = () => {
    return [
      {
        id: 'LOAD-001',
        origin: 'Dallas, TX',
        destination: 'Atlanta, GA',
        weight: '42,000 lbs',
        equipment: 'Dry Van',
        rate: '$2,850',
        status: 'Available',
        priority: 'High',
        pickupDate: '2024-12-26',
        distance: '925 miles',
        matchScore: 94
      },
      {
        id: 'LOAD-002',
        origin: 'Phoenix, AZ',
        destination: 'Los Angeles, CA',
        weight: '38,500 lbs',
        equipment: 'Refrigerated',
        rate: '$1,875',
        status: 'Dispatched',
        priority: 'Medium',
        pickupDate: '2024-12-27',
        distance: '372 miles',
        matchScore: 89
      },
      {
        id: 'LOAD-003',
        origin: 'Chicago, IL',
        destination: 'Detroit, MI',
        weight: '45,000 lbs',
        equipment: 'Flatbed',
        rate: '$1,425',
        status: 'In Transit',
        priority: 'Low',
        pickupDate: '2024-12-25',
        distance: '283 miles',
        matchScore: 92
      }
    ];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return '#10b981';
      case 'Active': return '#10b981';
      case 'Dispatched': return '#f59e0b';
      case 'In Transit': return '#3b82f6';
      case 'Busy': return '#ef4444';
      case 'Interviewing': return '#f59e0b';
      case 'Hired': return '#10b981';
      case 'Open': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const renderOverview = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
      {/* AI Operations Metrics */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity style={{ width: '20px', height: '20px' }} />
          AI Operations Status
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>97%</div>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>System Efficiency</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>24/7</div>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>Active Monitoring</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>147</div>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>Active Loads</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>23</div>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>Owner Operators</div>
          </div>
        </div>
      </div>

      {/* Revenue & Performance */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DollarSign style={{ width: '20px', height: '20px' }} />
          Revenue Performance
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{formatCurrency(metrics.revenuePerOwnerOperator || 125000)}</div>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>Revenue per Owner Operator</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{metrics.placementRate?.toFixed(1) || 85.2}%</div>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>Placement Success Rate</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{metrics.retentionRate || 87}%</div>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>Retention Rate</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>{metrics.monthlyRecruitment || 12}</div>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>Monthly Recruitment</div>
          </div>
        </div>
      </div>

      {/* AI Agent Status */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap style={{ width: '20px', height: '20px' }} />
          AI Agent Status
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { name: 'AI Dispatcher', status: 'Active', efficiency: 94 },
            { name: 'AI Recruiter', status: 'Active', efficiency: 89 },
            { name: 'AI Scheduler', status: 'Active', efficiency: 92 },
            { name: 'Freight Broker AI', status: 'Active', efficiency: 96 }
          ].map((agent, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: index < 3 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981'
                }} />
                <span style={{ color: 'white', fontSize: '14px' }}>{agent.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#9ca3af', fontSize: '12px' }}>{agent.efficiency}%</span>
                <span style={{ color: '#10b981', fontSize: '12px' }}>{agent.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock style={{ width: '20px', height: '20px' }} />
          Recent Activity
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { action: 'Load LOAD-001 matched to Owner Operator OO-001', time: '2 min ago', type: 'dispatch' },
            { action: 'New owner operator recruited: Maria Rodriguez', time: '5 min ago', type: 'recruiting' },
            { action: 'Schedule optimized for 3 owner operators', time: '8 min ago', type: 'scheduling' },
            { action: 'Carrier match created: Elite Transportation', time: '12 min ago', type: 'recruiting' }
          ].map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: index < 3 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: activity.type === 'dispatch' ? '#3b82f6' : 
                                    activity.type === 'recruiting' ? '#10b981' : '#f59e0b'
                }} />
                <span style={{ color: 'white', fontSize: '13px' }}>{activity.action}</span>
              </div>
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDispatch = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
      {/* Active Loads */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck style={{ width: '20px', height: '20px' }} />
          Active Loads ({activeLoads.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeLoads.map((load, index) => (
            <div key={index} style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: 'white', fontWeight: '600' }}>{load.id}</span>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  backgroundColor: getStatusColor(load.status) + '20',
                  color: getStatusColor(load.status),
                  fontWeight: '600'
                }}>
                  {load.status}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
                <div style={{ color: '#9ca3af' }}>
                  <MapPin style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                  {load.origin} → {load.destination}
                </div>
                <div style={{ color: '#9ca3af' }}>
                  <Target style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                  {load.equipment}
                </div>
                <div style={{ color: '#10b981' }}>
                  <DollarSign style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                  {load.rate}
                </div>
                <div style={{ color: '#f59e0b' }}>
                  <Star style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                  {load.matchScore}% Match
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Dispatch Recommendations */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity style={{ width: '20px', height: '20px' }} />
          AI Dispatch Recommendations
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            {
              load: 'LOAD-001',
              recommendation: 'Match with OO-001 (Robert Thompson)',
              confidence: 94,
              reasoning: 'Optimal location, excellent safety rating, preferred lane match'
            },
            {
              load: 'LOAD-002',
              recommendation: 'Match with OO-002 (Maria Rodriguez)',
              confidence: 89,
              reasoning: 'Refrigerated equipment match, high performance score'
            },
            {
              load: 'LOAD-003',
              recommendation: 'Match with OO-003 (James Wilson)',
              confidence: 92,
              reasoning: 'Flatbed specialization, experienced operator'
            }
          ].map((rec, index) => (
            <div key={index} style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: 'white', fontWeight: '600' }}>{rec.load}</span>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  backgroundColor: '#10b981' + '20',
                  color: '#10b981',
                  fontWeight: '600'
                }}>
                  {rec.confidence}% Confidence
                </span>
              </div>
              <div style={{ color: '#3b82f6', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                {rec.recommendation}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '12px' }}>
                {rec.reasoning}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRecruiting = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
      {/* Owner Operators */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users style={{ width: '20px', height: '20px' }} />
          Owner Operators ({ownerOperators.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {ownerOperators.slice(0, 3).map((operator, index) => (
            <div key={index} style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: 'white', fontWeight: '600' }}>{operator.name}</span>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  backgroundColor: getStatusColor(operator.availability) + '20',
                  color: getStatusColor(operator.availability),
                  fontWeight: '600'
                }}>
                  {operator.availability}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
                <div style={{ color: '#9ca3af' }}>
                  <MapPin style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                  {operator.location}
                </div>
                <div style={{ color: '#9ca3af' }}>
                  <Truck style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                  {operator.equipmentType}
                </div>
                <div style={{ color: '#10b981' }}>
                  <Star style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                  {operator.performanceScore}% Performance
                </div>
                <div style={{ color: '#f59e0b' }}>
                  <ShieldCheck style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                  {operator.safetyRating}% Safety
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carrier-Driver Matches */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus style={{ width: '20px', height: '20px' }} />
          Carrier-Driver Matches ({carrierMatches.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {carrierMatches.map((match, index) => (
            <div key={index} style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: 'white', fontWeight: '600' }}>{match.carrierName}</span>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  backgroundColor: getStatusColor(match.status) + '20',
                  color: getStatusColor(match.status),
                  fontWeight: '600'
                }}>
                  {match.status}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
                <div style={{ color: '#9ca3af' }}>
                  <MapPin style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                  {match.carrierLocation}
                </div>
                <div style={{ color: '#9ca3af' }}>
                  <Users style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                  {match.driverNeed.quantity} Drivers Needed
                </div>
                <div style={{ color: '#10b981' }}>
                  <DollarSign style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                  {formatCurrency(match.driverNeed.salary)}
                </div>
                <div style={{ color: '#f59e0b' }}>
                  <Truck style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                  {match.driverNeed.equipmentType}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderScheduling = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
      {/* Today's Schedule */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar style={{ width: '20px', height: '20px' }} />
          Today's Schedule
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {schedules.slice(0, 4).map((schedule, index) => (
            <div key={index} style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: 'white', fontWeight: '600' }}>{schedule.title}</span>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  backgroundColor: getStatusColor(schedule.status) + '20',
                  color: getStatusColor(schedule.status),
                  fontWeight: '600'
                }}>
                  {schedule.status}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
                <div style={{ color: '#9ca3af' }}>
                  <Clock style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                  {schedule.startTime} - {schedule.endTime}
                </div>
                <div style={{ color: '#9ca3af' }}>
                  <Users style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                  {schedule.driverName || 'Unassigned'}
                </div>
                <div style={{ color: '#10b981' }}>
                  <MapPin style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                  {schedule.origin} → {schedule.destination}
                </div>
                <div style={{ color: '#f59e0b' }}>
                  <Navigation style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />
                  {schedule.estimatedDistance} miles
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Optimization */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp style={{ width: '20px', height: '20px' }} />
          Schedule Optimization
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            {
              operator: 'Robert Thompson',
              optimization: 'Route optimized: 15% efficiency improvement',
              impact: 'Save 2.5 hours, +$180 revenue',
              confidence: 94
            },
            {
              operator: 'Maria Rodriguez',
              optimization: 'Schedule adjusted: Better lane utilization',
              impact: 'Reduce deadhead by 25%, +$320 revenue',
              confidence: 89
            },
            {
              operator: 'James Wilson',
              optimization: 'Load sequence optimized: Fuel efficiency',
              impact: 'Save 15 gallons, +$65 cost reduction',
              confidence: 92
            }
          ].map((opt, index) => (
            <div key={index} style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: 'white', fontWeight: '600' }}>{opt.operator}</span>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  backgroundColor: '#10b981' + '20',
                  color: '#10b981',
                  fontWeight: '600'
                }}>
                  {opt.confidence}% Confidence
                </span>
              </div>
              <div style={{ color: '#3b82f6', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                {opt.optimization}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '12px' }}>
                {opt.impact}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        color: 'white'
      }}>
        <Loader2 style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite' }} />
        <span style={{ marginLeft: '12px', fontSize: '18px' }}>Loading AI Operations Center...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        padding: '24px 0',
        borderBottom: '2px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            color: 'white'
          }}>
            🤖 AI Operations Center
          </h1>
          <p style={{
            fontSize: '1.1rem',
            margin: 0,
            color: '#9ca3af'
          }}>
            Unified AI-powered dispatch, recruiting, and scheduling operations
          </p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          <div>AI System Status</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            ALL SYSTEMS OPERATIONAL
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '16px'
      }}>
        {[
          { id: 'overview', label: '📊 Overview', desc: 'System metrics' },
          { id: 'dispatch', label: '🚛 AI Dispatch', desc: 'Load matching' },
          { id: 'recruiting', label: '👥 AI Recruiting', desc: 'Owner operators' },
          { id: 'scheduling', label: '📅 AI Scheduling', desc: 'Route optimization' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === tab.id ? 'white' : '#9ca3af',
              border: activeTab === tab.id 
                ? '2px solid #10b981' 
                : '1px solid rgba(255, 255, 255, 0.1)',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <div>{tab.label}</div>
            <div style={{ fontSize: '11px', opacity: 0.8 }}>{tab.desc}</div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'dispatch' && renderDispatch()}
        {activeTab === 'recruiting' && renderRecruiting()}
        {activeTab === 'scheduling' && renderScheduling()}
      </div>
    </div>
  );
} 