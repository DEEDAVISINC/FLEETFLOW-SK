'use client';

import {
  Award,
  Mail,
  MapPin,
  Pause,
  Phone,
  Play,
  Settings,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface TaskCriteria {
  targetType:
    | 'desperate_shippers'
    | 'manufacturers'
    | 'new_authorities'
    | 'safety_violations'
    | 'high_volume'
    | 'regional_carriers'
    | 'owner_operators'
    | 'private_fleets';
  industry: string[];
  location: {
    states: string[];
    radius: number;
    priority_cities: string[];
  };
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low';
  revenueThreshold: {
    min: number;
    max: number;
  };
  fleetSize: {
    min: number;
    max: number;
  };
  specialRequirements: string[];
  contactMethods: ('phone' | 'email' | 'linkedin' | 'direct_mail')[];
}

interface AIStaffAssignment {
  staffId: string;
  staffName: string;
  role: string;
  avatar: string;
  department: string;
  isActive: boolean;
  currentAssignment: TaskCriteria | null;
  performance: {
    leadsGenerated: number;
    contactsReached: number;
    conversionRate: number;
    revenueGenerated: number;
    specialtyScore: number;
  };
  capabilities: {
    canHandleDesperateLeads: boolean;
    canHandleManufacturing: boolean;
    canHandleCarriers: boolean;
    canHandleColdCalling: boolean;
    canHandleDataMining: boolean;
    canHandleCompliance: boolean;
  };
  workload: {
    currentTasks: number;
    capacity: number;
    utilizationRate: number;
  };
}

interface TargetingPreset {
  id: string;
  name: string;
  description: string;
  criteria: TaskCriteria;
  expectedResults: string;
  difficulty: 'easy' | 'medium' | 'hard';
  revenueExpectation: number;
}

export default function AITaskAssignmentSystem() {
  const [activeTab, setActiveTab] = useState('assignments');
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [isConfiguring, setIsConfiguring] = useState(false);

  // AI Staff Database with Assignment Capabilities
  const [aiStaffAssignments, setAiStaffAssignments] = useState<
    AIStaffAssignment[]
  >([
    {
      staffId: 'broker-001',
      staffName: 'Desiree',
      role: 'Freight Broker Specialist',
      avatar: '🎯',
      department: 'sales',
      isActive: true,
      currentAssignment: {
        targetType: 'desperate_shippers',
        industry: ['Manufacturing', 'Healthcare', 'Automotive'],
        location: {
          states: ['TX', 'CA', 'FL', 'GA'],
          radius: 500,
          priority_cities: ['Houston', 'Los Angeles', 'Atlanta', 'Miami'],
        },
        urgencyLevel: 'critical',
        revenueThreshold: { min: 10000, max: 50000 },
        fleetSize: { min: 1, max: 25 },
        specialRequirements: [
          'Safety Issues',
          'Compliance Problems',
          'Capacity Shortage',
        ],
        contactMethods: ['phone', 'email'],
      },
      performance: {
        leadsGenerated: 89,
        contactsReached: 156,
        conversionRate: 34.2,
        revenueGenerated: 127500,
        specialtyScore: 94.8,
      },
      capabilities: {
        canHandleDesperateLeads: true,
        canHandleManufacturing: true,
        canHandleCarriers: false,
        canHandleColdCalling: true,
        canHandleDataMining: true,
        canHandleCompliance: true,
      },
      workload: {
        currentTasks: 23,
        capacity: 30,
        utilizationRate: 76.7,
      },
    },
    {
      staffId: 'recruiter-001',
      staffName: 'Hunter',
      role: 'Carrier Recruitment Specialist',
      avatar: '🚛',
      department: 'sales',
      isActive: true,
      currentAssignment: {
        targetType: 'owner_operators',
        industry: ['OTR', 'Regional', 'Local Delivery'],
        location: {
          states: ['TX', 'OK', 'AR', 'LA'],
          radius: 300,
          priority_cities: [
            'Dallas',
            'Oklahoma City',
            'Little Rock',
            'New Orleans',
          ],
        },
        urgencyLevel: 'high',
        revenueThreshold: { min: 5000, max: 25000 },
        fleetSize: { min: 1, max: 5 },
        specialRequirements: [
          'Clean CSA Score',
          'Authority Active',
          'Insurance Current',
        ],
        contactMethods: ['phone', 'linkedin'],
      },
      performance: {
        leadsGenerated: 234,
        contactsReached: 189,
        conversionRate: 28.7,
        revenueGenerated: 89300,
        specialtyScore: 91.2,
      },
      capabilities: {
        canHandleDesperateLeads: false,
        canHandleManufacturing: false,
        canHandleCarriers: true,
        canHandleColdCalling: true,
        canHandleDataMining: true,
        canHandleCompliance: true,
      },
      workload: {
        currentTasks: 18,
        capacity: 25,
        utilizationRate: 72.0,
      },
    },
    {
      staffId: 'mfg-specialist-001',
      staffName: 'Will',
      role: 'Manufacturing Logistics Specialist',
      avatar: '🏭',
      department: 'sales',
      isActive: true,
      currentAssignment: {
        targetType: 'manufacturers',
        industry: [
          'Automotive Parts',
          'Medical Devices',
          'Electronics',
          'Machinery',
        ],
        location: {
          states: ['MI', 'OH', 'IN', 'IL'],
          radius: 400,
          priority_cities: ['Detroit', 'Cleveland', 'Indianapolis', 'Chicago'],
        },
        urgencyLevel: 'medium',
        revenueThreshold: { min: 25000, max: 100000 },
        fleetSize: { min: 5, max: 50 },
        specialRequirements: [
          'Just-in-Time Delivery',
          'Temperature Control',
          'Hazmat Certified',
        ],
        contactMethods: ['email', 'linkedin', 'direct_mail'],
      },
      performance: {
        leadsGenerated: 67,
        contactsReached: 98,
        conversionRate: 42.1,
        revenueGenerated: 185600,
        specialtyScore: 96.3,
      },
      capabilities: {
        canHandleDesperateLeads: true,
        canHandleManufacturing: true,
        canHandleCarriers: false,
        canHandleColdCalling: false,
        canHandleDataMining: true,
        canHandleCompliance: true,
      },
      workload: {
        currentTasks: 15,
        capacity: 20,
        utilizationRate: 75.0,
      },
    },
    {
      staffId: 'compliance-hunter-001',
      staffName: 'Regina',
      role: 'Compliance Crisis Specialist',
      avatar: '⚠️',
      department: 'lead_generation',
      isActive: true,
      currentAssignment: {
        targetType: 'safety_violations',
        industry: ['General Freight', 'Hazmat', 'Heavy Haul'],
        location: {
          states: ['All'],
          radius: 0,
          priority_cities: [],
        },
        urgencyLevel: 'critical',
        revenueThreshold: { min: 5000, max: 75000 },
        fleetSize: { min: 2, max: 100 },
        specialRequirements: [
          'Recent Violations',
          'Conditional Rating',
          'Out of Service',
        ],
        contactMethods: ['phone'],
      },
      performance: {
        leadsGenerated: 156,
        contactsReached: 234,
        conversionRate: 38.9,
        revenueGenerated: 156700,
        specialtyScore: 97.8,
      },
      capabilities: {
        canHandleDesperateLeads: true,
        canHandleManufacturing: false,
        canHandleCarriers: true,
        canHandleColdCalling: true,
        canHandleDataMining: true,
        canHandleCompliance: true,
      },
      workload: {
        currentTasks: 28,
        capacity: 35,
        utilizationRate: 80.0,
      },
    },
    {
      staffId: 'new-auth-specialist-001',
      staffName: 'Cliff',
      role: 'Startup Carrier Specialist',
      avatar: '🆕',
      department: 'lead_generation',
      isActive: true,
      currentAssignment: {
        targetType: 'new_authorities',
        industry: ['General Freight', 'Regional', 'Local'],
        location: {
          states: ['TX', 'FL', 'CA', 'NC', 'GA'],
          radius: 250,
          priority_cities: [
            'Houston',
            'Orlando',
            'Los Angeles',
            'Charlotte',
            'Atlanta',
          ],
        },
        urgencyLevel: 'high',
        revenueThreshold: { min: 2000, max: 15000 },
        fleetSize: { min: 1, max: 10 },
        specialRequirements: [
          'Authority < 6 months',
          'No Violations',
          'Seeking Loads',
        ],
        contactMethods: ['phone', 'email'],
      },
      performance: {
        leadsGenerated: 198,
        contactsReached: 167,
        conversionRate: 31.4,
        revenueGenerated: 67800,
        specialtyScore: 89.6,
      },
      capabilities: {
        canHandleDesperateLeads: true,
        canHandleManufacturing: false,
        canHandleCarriers: true,
        canHandleColdCalling: true,
        canHandleDataMining: true,
        canHandleCompliance: false,
      },
      workload: {
        currentTasks: 22,
        capacity: 30,
        utilizationRate: 73.3,
      },
    },
  ]);

  // Targeting Presets
  const targetingPresets: TargetingPreset[] = [
    {
      id: 'desperate_shippers_urgent',
      name: 'Desperate Shippers - Urgent',
      description:
        'Target companies with safety violations, compliance issues, and capacity shortages',
      criteria: {
        targetType: 'desperate_shippers',
        industry: ['Manufacturing', 'Healthcare', 'Food & Beverage'],
        location: {
          states: ['TX', 'CA', 'FL', 'IL'],
          radius: 500,
          priority_cities: ['Houston', 'Los Angeles', 'Miami', 'Chicago'],
        },
        urgencyLevel: 'critical',
        revenueThreshold: { min: 10000, max: 100000 },
        fleetSize: { min: 1, max: 25 },
        specialRequirements: [
          'Safety Issues',
          'Compliance Problems',
          'Recent Violations',
        ],
        contactMethods: ['phone', 'email'],
      },
      expectedResults: '50-80 high-quality leads per week',
      difficulty: 'easy',
      revenueExpectation: 150000,
    },
    {
      id: 'manufacturing_giants',
      name: 'Manufacturing Giants',
      description: 'Target large manufacturers with substantial shipping needs',
      criteria: {
        targetType: 'manufacturers',
        industry: ['Automotive', 'Aerospace', 'Heavy Machinery', 'Electronics'],
        location: {
          states: ['MI', 'OH', 'IN', 'AL', 'SC'],
          radius: 400,
          priority_cities: [
            'Detroit',
            'Cleveland',
            'Indianapolis',
            'Birmingham',
          ],
        },
        urgencyLevel: 'medium',
        revenueThreshold: { min: 50000, max: 500000 },
        fleetSize: { min: 10, max: 200 },
        specialRequirements: [
          'Temperature Control',
          'Just-in-Time',
          'Specialized Equipment',
        ],
        contactMethods: ['linkedin', 'email', 'direct_mail'],
      },
      expectedResults: '20-35 enterprise-level prospects per week',
      difficulty: 'hard',
      revenueExpectation: 300000,
    },
    {
      id: 'owner_operator_goldmine',
      name: 'Owner Operator Goldmine',
      description:
        'Target individual owner-operators seeking consistent freight',
      criteria: {
        targetType: 'owner_operators',
        industry: ['General Freight', 'Reefer', 'Dry Van'],
        location: {
          states: ['TX', 'OK', 'AR', 'LA', 'MS'],
          radius: 300,
          priority_cities: ['Dallas', 'Oklahoma City', 'Little Rock'],
        },
        urgencyLevel: 'high',
        revenueThreshold: { min: 5000, max: 25000 },
        fleetSize: { min: 1, max: 3 },
        specialRequirements: [
          'Clean Record',
          'Own Equipment',
          'Seeking Consistent Work',
        ],
        contactMethods: ['phone', 'linkedin'],
      },
      expectedResults: '100-150 owner-operator contacts per week',
      difficulty: 'medium',
      revenueExpectation: 75000,
    },
    {
      id: 'safety_crisis_opportunities',
      name: 'Safety Crisis Opportunities',
      description: 'Target carriers with safety issues who need immediate help',
      criteria: {
        targetType: 'safety_violations',
        industry: ['General Freight', 'Hazmat', 'Construction'],
        location: { states: ['All'], radius: 0, priority_cities: [] },
        urgencyLevel: 'critical',
        revenueThreshold: { min: 8000, max: 60000 },
        fleetSize: { min: 2, max: 75 },
        specialRequirements: [
          'Recent Violations',
          'Conditional Rating',
          'Need Immediate Help',
        ],
        contactMethods: ['phone'],
      },
      expectedResults: '40-70 desperate carriers per week',
      difficulty: 'easy',
      revenueExpectation: 120000,
    },
    {
      id: 'new_authority_rush',
      name: 'New Authority Rush',
      description: 'Target brand new carriers who need guidance and freight',
      criteria: {
        targetType: 'new_authorities',
        industry: ['General Freight', 'Regional', 'Hotshot'],
        location: {
          states: ['TX', 'FL', 'CA', 'AZ', 'NV'],
          radius: 400,
          priority_cities: ['Houston', 'Phoenix', 'Las Vegas', 'Orlando'],
        },
        urgencyLevel: 'high',
        revenueThreshold: { min: 3000, max: 20000 },
        fleetSize: { min: 1, max: 8 },
        specialRequirements: [
          'Authority < 3 months',
          'Seeking First Loads',
          'Need Setup Help',
        ],
        contactMethods: ['phone', 'email'],
      },
      expectedResults: '80-120 new authority contacts per week',
      difficulty: 'medium',
      revenueExpectation: 90000,
    },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getUtilizationColor = (rate: number) => {
    if (rate >= 90) return 'text-red-600';
    if (rate >= 75) return 'text-yellow-600';
    if (rate >= 60) return 'text-green-600';
    return 'text-blue-600';
  };

  const assignPresetToStaff = (staffId: string, presetId: string) => {
    const preset = targetingPresets.find((p) => p.id === presetId);
    if (!preset) return;

    setAiStaffAssignments((prev) =>
      prev.map((staff) =>
        staff.staffId === staffId
          ? { ...staff, currentAssignment: preset.criteria, isActive: true }
          : staff
      )
    );
  };

  return (
    <div className='mx-auto w-full max-w-7xl space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='flex items-center gap-3 text-3xl font-bold text-gray-900'>
            <Target className='h-8 w-8 text-purple-600' />
            AI Task Assignment System
          </h1>
          <p className='mt-1 text-gray-600'>
            Configure AI staff to target specific prospect types and lead
            categories
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Button
            onClick={() => setIsConfiguring(!isConfiguring)}
            variant={isConfiguring ? 'default' : 'outline'}
          >
            <Settings className='mr-2 h-4 w-4' />
            {isConfiguring ? 'Finish Setup' : 'Configure Tasks'}
          </Button>
          <Button className='bg-purple-600 hover:bg-purple-700'>
            <Play className='mr-2 h-4 w-4' />
            Deploy Tasks
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Active Assignments</p>
                <p className='text-2xl font-bold text-purple-600'>
                  {aiStaffAssignments.filter((s) => s.isActive).length}
                </p>
                <p className='text-xs text-gray-500'>
                  of {aiStaffAssignments.length} staff
                </p>
              </div>
              <Target className='h-8 w-8 text-purple-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Total Leads Generated</p>
                <p className='text-2xl font-bold text-green-600'>
                  {aiStaffAssignments.reduce(
                    (sum, staff) => sum + staff.performance.leadsGenerated,
                    0
                  )}
                </p>
                <p className='text-xs text-green-600'>This week</p>
              </div>
              <TrendingUp className='h-8 w-8 text-green-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Avg Conversion Rate</p>
                <p className='text-2xl font-bold text-blue-600'>
                  {(
                    aiStaffAssignments.reduce(
                      (sum, staff) => sum + staff.performance.conversionRate,
                      0
                    ) / aiStaffAssignments.length
                  ).toFixed(1)}
                  %
                </p>
                <p className='text-xs text-blue-600'>Above industry avg</p>
              </div>
              <Award className='h-8 w-8 text-blue-600' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Total Revenue</p>
                <p className='text-2xl font-bold text-orange-600'>
                  $
                  {aiStaffAssignments
                    .reduce(
                      (sum, staff) => sum + staff.performance.revenueGenerated,
                      0
                    )
                    .toLocaleString()}
                </p>
                <p className='text-xs text-orange-600'>From assignments</p>
              </div>
              <TrendingUp className='h-8 w-8 text-orange-600' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='assignments'>Current Assignments</TabsTrigger>
          <TabsTrigger value='presets'>Quick Presets</TabsTrigger>
          <TabsTrigger value='configure'>Custom Configuration</TabsTrigger>
          <TabsTrigger value='performance'>Performance Analysis</TabsTrigger>
        </TabsList>

        {/* Current Assignments Tab */}
        <TabsContent value='assignments' className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {aiStaffAssignments.map((staff) => (
              <Card
                key={staff.staffId}
                className='transition-shadow hover:shadow-lg'
              >
                <CardContent className='p-6'>
                  <div className='mb-4 flex items-start justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='text-2xl'>{staff.avatar}</div>
                      <div>
                        <h3 className='text-lg font-semibold'>
                          {staff.staffName}
                        </h3>
                        <p className='text-sm text-gray-600'>{staff.role}</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Badge
                        className={
                          staff.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {staff.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>

                  {staff.currentAssignment && (
                    <div className='space-y-4'>
                      <div className='rounded-lg bg-purple-50 p-4'>
                        <div className='mb-2 flex items-center gap-2'>
                          <div
                            className={`h-3 w-3 rounded-full ${getUrgencyColor(staff.currentAssignment.urgencyLevel)}`}
                           />
                          <h4 className='font-medium capitalize'>
                            {staff.currentAssignment.targetType.replace(
                              '_',
                              ' '
                            )}{' '}
                            - {staff.currentAssignment.urgencyLevel}
                          </h4>
                        </div>
                        <div className='grid grid-cols-2 gap-4 text-sm'>
                          <div>
                            <p className='text-gray-600'>Target Industries:</p>
                            <div className='mt-1 flex flex-wrap gap-1'>
                              {staff.currentAssignment.industry
                                .slice(0, 2)
                                .map((ind, index) => (
                                  <Badge
                                    key={index}
                                    variant='outline'
                                    className='text-xs'
                                  >
                                    {ind}
                                  </Badge>
                                ))}
                              {staff.currentAssignment.industry.length > 2 && (
                                <Badge variant='outline' className='text-xs'>
                                  +{staff.currentAssignment.industry.length - 2}{' '}
                                  more
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className='text-gray-600'>Target States:</p>
                            <div className='mt-1 flex flex-wrap gap-1'>
                              {staff.currentAssignment.location.states
                                .slice(0, 3)
                                .map((state, index) => (
                                  <Badge
                                    key={index}
                                    variant='outline'
                                    className='text-xs'
                                  >
                                    {state}
                                  </Badge>
                                ))}
                              {staff.currentAssignment.location.states.length >
                                3 && (
                                <Badge variant='outline' className='text-xs'>
                                  +
                                  {staff.currentAssignment.location.states
                                    .length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className='mt-3'>
                          <p className='text-sm text-gray-600'>
                            Revenue Range:
                          </p>
                          <p className='font-medium'>
                            $
                            {staff.currentAssignment.revenueThreshold.min.toLocaleString()}{' '}
                            - $
                            {staff.currentAssignment.revenueThreshold.max.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <p className='text-sm text-gray-600'>
                            Current Workload
                          </p>
                          <p className='font-bold'>
                            {staff.workload.currentTasks}/
                            {staff.workload.capacity}
                          </p>
                          <p
                            className={`text-sm ${getUtilizationColor(staff.workload.utilizationRate)}`}
                          >
                            {staff.workload.utilizationRate}% utilized
                          </p>
                        </div>
                        <div>
                          <p className='text-sm text-gray-600'>
                            Specialty Score
                          </p>
                          <p className='font-bold text-purple-600'>
                            {staff.performance.specialtyScore}%
                          </p>
                          <p className='text-sm text-gray-500'>Match rating</p>
                        </div>
                      </div>

                      <div className='grid grid-cols-3 gap-4 border-t pt-3'>
                        <div className='text-center'>
                          <p className='text-lg font-bold text-green-600'>
                            {staff.performance.leadsGenerated}
                          </p>
                          <p className='text-xs text-gray-600'>Leads</p>
                        </div>
                        <div className='text-center'>
                          <p className='text-lg font-bold text-blue-600'>
                            {staff.performance.conversionRate}%
                          </p>
                          <p className='text-xs text-gray-600'>Conversion</p>
                        </div>
                        <div className='text-center'>
                          <p className='text-lg font-bold text-orange-600'>
                            $
                            {staff.performance.revenueGenerated.toLocaleString()}
                          </p>
                          <p className='text-xs text-gray-600'>Revenue</p>
                        </div>
                      </div>

                      <div className='flex gap-2'>
                        <Button size='sm' variant='outline' className='flex-1'>
                          <Settings className='mr-1 h-4 w-4' />
                          Modify Assignment
                        </Button>
                        <Button size='sm' variant='outline'>
                          <Pause className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  )}

                  {!staff.currentAssignment && (
                    <div className='py-4 text-center'>
                      <p className='mb-3 text-gray-500'>No active assignment</p>
                      <Button
                        size='sm'
                        onClick={() => setSelectedStaff(staff.staffId)}
                      >
                        <Target className='mr-2 h-4 w-4' />
                        Assign Task
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Quick Presets Tab */}
        <TabsContent value='presets' className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
            {targetingPresets.map((preset) => (
              <Card
                key={preset.id}
                className='transition-shadow hover:shadow-md'
              >
                <CardHeader className='pb-4'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <CardTitle className='text-lg'>{preset.name}</CardTitle>
                      <p className='mt-1 text-sm text-gray-600'>
                        {preset.description}
                      </p>
                    </div>
                    <Badge
                      className={
                        preset.difficulty === 'easy'
                          ? 'bg-green-100 text-green-800'
                          : preset.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }
                    >
                      {preset.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div>
                        <p className='text-gray-600'>Target Type:</p>
                        <p className='font-medium capitalize'>
                          {preset.criteria.targetType.replace('_', ' ')}
                        </p>
                      </div>
                      <div>
                        <p className='text-gray-600'>Urgency:</p>
                        <div className='flex items-center gap-2'>
                          <div
                            className={`h-2 w-2 rounded-full ${getUrgencyColor(preset.criteria.urgencyLevel)}`}
                           />
                          <p className='font-medium capitalize'>
                            {preset.criteria.urgencyLevel}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className='text-sm text-gray-600'>Expected Results:</p>
                      <p className='text-sm font-medium'>
                        {preset.expectedResults}
                      </p>
                    </div>

                    <div>
                      <p className='text-sm text-gray-600'>
                        Revenue Expectation:
                      </p>
                      <p className='font-bold text-green-600'>
                        ${preset.revenueExpectation.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className='mb-2 text-sm text-gray-600'>
                        Assign to Staff:
                      </p>
                      <Select
                        onValueChange={(staffId) =>
                          assignPresetToStaff(staffId, preset.id)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select AI Staff' />
                        </SelectTrigger>
                        <SelectContent>
                          {aiStaffAssignments.map((staff) => (
                            <SelectItem
                              key={staff.staffId}
                              value={staff.staffId}
                            >
                              <div className='flex items-center gap-2'>
                                <span>{staff.avatar}</span>
                                <span>{staff.staffName}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Custom Configuration Tab */}
        <TabsContent value='configure' className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Custom Task Configuration</CardTitle>
              <p className='text-gray-600'>
                Create custom assignments for specific targeting needs
              </p>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                <div className='grid grid-cols-2 gap-6'>
                  <div>
                    <label className='mb-2 block text-sm font-medium'>
                      Select AI Staff Member
                    </label>
                    <Select
                      value={selectedStaff}
                      onValueChange={setSelectedStaff}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Choose AI Staff' />
                      </SelectTrigger>
                      <SelectContent>
                        {aiStaffAssignments.map((staff) => (
                          <SelectItem key={staff.staffId} value={staff.staffId}>
                            <div className='flex items-center gap-2'>
                              <span>{staff.avatar}</span>
                              <span>{staff.staffName}</span>
                              <span className='text-gray-500'>
                                ({staff.role})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className='mb-2 block text-sm font-medium'>
                      Target Type
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder='Select target type' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='desperate_shippers'>
                          🎯 Desperate Shippers
                        </SelectItem>
                        <SelectItem value='manufacturers'>
                          🏭 Manufacturers
                        </SelectItem>
                        <SelectItem value='new_authorities'>
                          🆕 New Authorities
                        </SelectItem>
                        <SelectItem value='safety_violations'>
                          ⚠️ Safety Violations
                        </SelectItem>
                        <SelectItem value='owner_operators'>
                          🚛 Owner Operators
                        </SelectItem>
                        <SelectItem value='private_fleets'>
                          🏢 Private Fleets
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className='mb-2 block text-sm font-medium'>
                    Industries to Target
                  </label>
                  <div className='grid grid-cols-4 gap-2'>
                    {[
                      'Manufacturing',
                      'Healthcare',
                      'Automotive',
                      'Electronics',
                      'Food & Beverage',
                      'Construction',
                      'Retail',
                      'Aerospace',
                    ].map((industry) => (
                      <label
                        key={industry}
                        className='flex items-center gap-2 text-sm'
                      >
                        <input type='checkbox' className='rounded' />
                        <span>{industry}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-6'>
                  <div>
                    <label className='mb-2 block text-sm font-medium'>
                      Revenue Range
                    </label>
                    <div className='space-y-2'>
                      <div className='flex gap-2'>
                        <input
                          type='number'
                          placeholder='Min Revenue'
                          className='flex-1 rounded-md border px-3 py-2'
                        />
                        <input
                          type='number'
                          placeholder='Max Revenue'
                          className='flex-1 rounded-md border px-3 py-2'
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className='mb-2 block text-sm font-medium'>
                      Fleet Size Range
                    </label>
                    <div className='flex gap-2'>
                      <input
                        type='number'
                        placeholder='Min Fleet'
                        className='flex-1 rounded-md border px-3 py-2'
                      />
                      <input
                        type='number'
                        placeholder='Max Fleet'
                        className='flex-1 rounded-md border px-3 py-2'
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className='mb-2 block text-sm font-medium'>
                    Contact Methods
                  </label>
                  <div className='flex gap-4'>
                    {[
                      { value: 'phone', label: 'Phone', icon: Phone },
                      { value: 'email', label: 'Email', icon: Mail },
                      { value: 'linkedin', label: 'LinkedIn', icon: Users },
                      {
                        value: 'direct_mail',
                        label: 'Direct Mail',
                        icon: MapPin,
                      },
                    ].map(({ value, label, icon: Icon }) => (
                      <label key={value} className='flex items-center gap-2'>
                        <input type='checkbox' />
                        <Icon className='h-4 w-4' />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className='flex justify-end gap-3'>
                  <Button variant='outline'>Save as Preset</Button>
                  <Button className='bg-purple-600 hover:bg-purple-700'>
                    Deploy Assignment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Analysis Tab */}
        <TabsContent value='performance' className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Assignment Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {aiStaffAssignments
                    .sort(
                      (a, b) =>
                        b.performance.revenueGenerated -
                        a.performance.revenueGenerated
                    )
                    .map((staff) => (
                      <div
                        key={staff.staffId}
                        className='flex items-center justify-between rounded-lg bg-gray-50 p-3'
                      >
                        <div className='flex items-center gap-3'>
                          <span className='text-lg'>{staff.avatar}</span>
                          <div>
                            <p className='font-medium'>{staff.staffName}</p>
                            <p className='text-sm text-gray-600'>
                              {staff.currentAssignment?.targetType.replace(
                                '_',
                                ' '
                              ) || 'No assignment'}
                            </p>
                          </div>
                        </div>
                        <div className='text-right'>
                          <p className='font-bold text-green-600'>
                            $
                            {staff.performance.revenueGenerated.toLocaleString()}
                          </p>
                          <p className='text-sm text-gray-600'>
                            {staff.performance.conversionRate}% conversion
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Targeting Effectiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[
                    'desperate_shippers',
                    'manufacturers',
                    'new_authorities',
                    'safety_violations',
                    'owner_operators',
                  ].map((targetType) => {
                    const staffWithTarget = aiStaffAssignments.filter(
                      (s) => s.currentAssignment?.targetType === targetType
                    );
                    const totalRevenue = staffWithTarget.reduce(
                      (sum, s) => sum + s.performance.revenueGenerated,
                      0
                    );
                    const avgConversion =
                      staffWithTarget.length > 0
                        ? staffWithTarget.reduce(
                            (sum, s) => sum + s.performance.conversionRate,
                            0
                          ) / staffWithTarget.length
                        : 0;

                    return (
                      <div key={targetType} className='rounded-lg border p-3'>
                        <div className='mb-2 flex items-center justify-between'>
                          <h4 className='font-medium capitalize'>
                            {targetType.replace('_', ' ')}
                          </h4>
                          <Badge>{staffWithTarget.length} staff</Badge>
                        </div>
                        <div className='grid grid-cols-2 gap-4 text-sm'>
                          <div>
                            <p className='text-gray-600'>Total Revenue</p>
                            <p className='font-bold text-green-600'>
                              ${totalRevenue.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className='text-gray-600'>Avg Conversion</p>
                            <p className='font-bold text-blue-600'>
                              {avgConversion.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
