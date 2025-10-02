'use client';

import { useState } from 'react';

// ============================================================================
// AI-AUTOMATED NEMT SYSTEM
// Built for AI staff automation - Brook, Kameelah, Regina, Will
// ============================================================================

export interface AITask {
  id: string;
  type: 'patient-intake' | 'eligibility-check' | 'ride-booking' | 'claim-generation' | 'coordination';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  assignedAI: string; // brook-009, kameelah-014, etc.
  priority: 'critical' | 'high' | 'medium' | 'low';
  data: any;
  createdAt: string;
  completedAt?: string;
  result?: any;
  error?: string;
}

export interface AutomatedPatient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  medicaidId: string;
  mco: string;
  eligibilityStatus: 'active' | 'pending-verification' | 'expired' | 'denied';
  eligibilityLastChecked?: string;
  medicalNeeds: string[];
  aiIntakeStatus: 'pending' | 'verified' | 'needs-review';
  aiIntakeBy?: string;
  createdAt: string;
  source: 'phone-call' | 'email' | 'provider-referral' | 'manual';
}

export interface AutomatedRide {
  id: string;
  patientId: string;
  patientName: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupTime: string;
  appointmentType: string;
  status: 'ai-scheduling' | 'uber-booking' | 'scheduled' | 'driver-assigned' | 'in-progress' | 'completed' | 'failed';
  uberRideId?: string;
  bookingMethod: 'uber-api' | 'manual-portal';
  aiBookedBy?: string;
  estimatedCost: number;
  actualCost?: number;
  mileage: number;
  aiNotes?: string;
  createdAt: string;
}

export interface AutomatedClaim {
  id: string;
  rideId: string;
  patientName: string;
  serviceDate: string;
  mco: string;
  billedAmount: number;
  status: 'ai-generating' | 'ai-validating' | 'ready-to-submit' | 'submitted' | 'paid' | 'denied';
  edi837Generated: boolean;
  aiGeneratedBy?: string;
  submittedVia?: 'edi-clearinghouse' | 'mco-portal' | 'manual';
  claimNumber?: string;
  paidAmount?: number;
  aiClaimData?: any;
  createdAt: string;
}

export interface AIStaffActivity {
  id: string;
  aiStaffId: string;
  aiStaffName: string;
  action: string;
  taskType: string;
  timestamp: string;
  duration: number; // seconds
  success: boolean;
  details: string;
}

export default function AIAutomatedNEMTSystem() {
  const [activeView, setActiveView] = useState<'dashboard' | 'ai-queue' | 'patients' | 'rides' | 'claims' | 'monitoring'>('dashboard');
  
  // AI Task Queue
  const [aiTasks] = useState<AITask[]>([
    {
      id: 'TASK-001',
      type: 'patient-intake',
      status: 'processing',
      assignedAI: 'brook-009',
      priority: 'high',
      data: { source: 'phone-call', callerName: 'John Smith', phone: '(313) 555-0100' },
      createdAt: '2025-10-02T14:30:00',
    },
    {
      id: 'TASK-002',
      type: 'eligibility-check',
      status: 'queued',
      assignedAI: 'kameelah-014',
      priority: 'critical',
      data: { patientId: 'PAT-001', medicaidId: 'MI-12345678', mco: 'Meridian' },
      createdAt: '2025-10-02T14:32:00',
    },
    {
      id: 'TASK-003',
      type: 'ride-booking',
      status: 'queued',
      assignedAI: 'brook-009',
      priority: 'high',
      data: { patientId: 'PAT-001', appointmentTime: '2025-10-03T09:00:00' },
      createdAt: '2025-10-02T14:35:00',
    },
  ]);

  // AI Staff Activity Log
  const [aiActivity] = useState<AIStaffActivity[]>([
    {
      id: 'ACT-001',
      aiStaffId: 'brook-009',
      aiStaffName: 'Brook (AI Developer)',
      action: 'Patient intake initiated',
      taskType: 'patient-intake',
      timestamp: '2025-10-02T14:30:15',
      duration: 45,
      success: true,
      details: 'Extracted patient info from phone call transcript, verified Medicaid ID format',
    },
    {
      id: 'ACT-002',
      aiStaffId: 'kameelah-014',
      aiStaffName: 'Kameelah (Compliance)',
      action: 'Eligibility verification completed',
      taskType: 'eligibility-check',
      timestamp: '2025-10-02T14:28:00',
      duration: 120,
      success: true,
      details: 'Connected to Michigan MMIS, verified active eligibility through 2025-12-31',
    },
    {
      id: 'ACT-003',
      aiStaffId: 'brook-009',
      aiStaffName: 'Brook (AI Developer)',
      action: 'Uber Health ride booked',
      taskType: 'ride-booking',
      timestamp: '2025-10-02T14:25:00',
      duration: 30,
      success: true,
      details: 'Booked wheelchair-accessible ride via Uber Health API, confirmed driver assignment',
    },
  ]);

  const stats = {
    aiTasksQueued: aiTasks.filter(t => t.status === 'queued').length,
    aiTasksProcessing: aiTasks.filter(t => t.status === 'processing').length,
    aiTasksCompleted: aiTasks.filter(t => t.status === 'completed').length,
    automationRate: 95, // % of tasks fully automated
    avgProcessingTime: 45, // seconds
    patientsAutoProcessed: 12,
    ridesAutoBooked: 8,
    claimsAutoGenerated: 5,
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{
        marginBottom: '30px',
        padding: '24px',
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        borderRadius: '12px',
      }}>
        <h1 style={{
          color: 'white',
          fontSize: '2rem',
          fontWeight: '700',
          margin: '0 0 8px 0',
        }}>
          🤖 AI-Automated NEMT Operations System
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: 0, fontSize: '1rem' }}>
          Fully Automated by AI Staff: Brook, Kameelah, Regina, Will | DEE DAVIS INC dba DEPOINTE
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        borderBottom: '2px solid rgba(148, 163, 184, 0.2)',
        paddingBottom: '12px',
        flexWrap: 'wrap',
      }}>
        {[
          { id: 'dashboard', label: '📊 AI Dashboard', icon: '📊' },
          { id: 'ai-queue', label: '🤖 AI Task Queue', icon: '🤖' },
          { id: 'patients', label: '👥 Auto-Patients', icon: '👥' },
          { id: 'rides', label: '🚗 Auto-Rides', icon: '🚗' },
          { id: 'claims', label: '💰 Auto-Claims', icon: '💰' },
          { id: 'monitoring', label: '📡 AI Monitoring', icon: '📡' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            style={{
              background: activeView === tab.id 
                ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                : 'rgba(255, 255, 255, 0.05)',
              border: activeView === tab.id ? 'none' : '1px solid rgba(148, 163, 184, 0.3)',
              borderRadius: '8px',
              padding: '12px 24px',
              color: 'white',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* AI Dashboard View */}
      {activeView === 'dashboard' && (
        <div>
          {/* AI Automation Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}>
            <AIStatCard
              title="AI Automation Rate"
              value={`${stats.automationRate}%`}
              subtitle="Tasks fully automated"
              icon="🤖"
              color="#8b5cf6"
            />
            <AIStatCard
              title="AI Tasks Queued"
              value={stats.aiTasksQueued}
              subtitle={`${stats.aiTasksProcessing} processing now`}
              icon="⏳"
              color="#3b82f6"
            />
            <AIStatCard
              title="Avg AI Processing"
              value={`${stats.avgProcessingTime}s`}
              subtitle={`${stats.aiTasksCompleted} completed today`}
              icon="⚡"
              color="#10b981"
            />
            <AIStatCard
              title="Auto-Generated Claims"
              value={stats.claimsAutoGenerated}
              subtitle="Ready for submission"
              icon="💰"
              color="#f59e0b"
            />
          </div>

          {/* AI Staff Status */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
          }}>
            <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '1.2rem' }}>
              👥 AI Staff Status
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
              <AIStaffCard
                name="Brook"
                role="AI Developer"
                id="brook-009"
                status="active"
                currentTask="Booking ride for PAT-003"
                tasksCompleted={45}
                efficiency={98}
              />
              <AIStaffCard
                name="Kameelah"
                role="Compliance Specialist"
                id="kameelah-014"
                status="active"
                currentTask="Verifying Medicaid eligibility"
                tasksCompleted={32}
                efficiency={96}
              />
              <AIStaffCard
                name="Regina"
                role="Operations Coordinator"
                id="regina-015"
                status="idle"
                currentTask="Ready for assignment"
                tasksCompleted={28}
                efficiency={94}
              />
              <AIStaffCard
                name="Will"
                role="Partnership Manager"
                id="will-004"
                status="active"
                currentTask="Generating EDI 837 claims"
                tasksCompleted={15}
                efficiency={92}
              />
            </div>
          </div>

          {/* Recent AI Activity */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '1.2rem' }}>
              📋 Recent AI Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {aiActivity.map((activity) => (
                <AIActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Task Queue View */}
      {activeView === 'ai-queue' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600' }}>
              🤖 AI Task Queue & Automation
            </h2>
            <button
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              ➕ Queue New AI Task
            </button>
          </div>

          {/* Task Queue */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {aiTasks.map((task) => (
                <AITaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>

          {/* Automation Workflows */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '24px',
          }}>
            <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '1.2rem' }}>
              ⚙️ Automated Workflows
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              <WorkflowCard
                title="📞 Patient Intake Automation"
                description="AI extracts patient data from calls/emails, verifies info, creates patient record"
                aiStaff="Brook"
                avgTime="45s"
                successRate="98%"
              />
              <WorkflowCard
                title="✅ Eligibility Verification"
                description="AI checks Medicaid/MCO eligibility via state MMIS API, updates patient status"
                aiStaff="Kameelah"
                avgTime="30s"
                successRate="96%"
              />
              <WorkflowCard
                title="🚗 Uber Health Booking"
                description="AI books wheelchair-accessible rides via Uber API, monitors driver assignment"
                aiStaff="Brook"
                avgTime="25s"
                successRate="94%"
              />
              <WorkflowCard
                title="💰 Claims Generation (EDI 837P)"
                description="AI generates HIPAA 5010 837P claims, validates data, submits to clearinghouse"
                aiStaff="Will"
                avgTime="60s"
                successRate="99%"
              />
              <WorkflowCard
                title="📅 Appointment Scheduling"
                description="AI schedules recurring appointments (dialysis 3x/week), sends reminders"
                aiStaff="Regina"
                avgTime="20s"
                successRate="97%"
              />
              <WorkflowCard
                title="📊 Real-Time Coordination"
                description="AI monitors all rides, handles issues, coordinates with providers/drivers"
                aiStaff="Regina"
                avgTime="continuous"
                successRate="95%"
              />
            </div>
          </div>
        </div>
      )}

      {/* Auto-Patients View */}
      {activeView === 'patients' && (
        <div>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', marginBottom: '20px' }}>
            👥 AI-Processed Patients
          </h2>
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              All patient intakes are processed automatically by Brook AI. Data extracted from phone calls, emails, and provider referrals.
            </p>
            <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
              <strong style={{ color: '#8b5cf6' }}>AI Automation Status:</strong> {stats.patientsAutoProcessed} patients processed automatically today
            </div>
          </div>
        </div>
      )}

      {/* Auto-Rides View */}
      {activeView === 'rides' && (
        <div>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', marginBottom: '20px' }}>
            🚗 AI-Booked Rides
          </h2>
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              All rides are booked automatically via Uber Health API by Brook AI. System handles driver assignment, tracking, and notifications.
            </p>
            <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
              <strong style={{ color: '#8b5cf6' }}>AI Automation Status:</strong> {stats.ridesAutoBooked} rides booked automatically today
            </div>
          </div>
        </div>
      )}

      {/* Auto-Claims View */}
      {activeView === 'claims' && (
        <div>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', marginBottom: '20px' }}>
            💰 AI-Generated Claims
          </h2>
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              All Medicaid claims are auto-generated in EDI 837P format by Will AI. System validates data and submits to EDI clearinghouse.
            </p>
            <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
              <strong style={{ color: '#8b5cf6' }}>AI Automation Status:</strong> {stats.claimsAutoGenerated} claims generated automatically today
            </div>
          </div>
        </div>
      )}

      {/* AI Monitoring View */}
      {activeView === 'monitoring' && (
        <div>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600', marginBottom: '20px' }}>
            �� AI System Monitoring
          </h2>
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '20px',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              <MonitoringCard
                title="🔌 Uber Health API"
                status="connected"
                lastCheck="2 minutes ago"
                uptime="99.8%"
              />
              <MonitoringCard
                title="🏥 Michigan MMIS"
                status="connected"
                lastCheck="5 minutes ago"
                uptime="98.5%"
              />
              <MonitoringCard
                title="🏥 Maryland MMIS"
                status="connected"
                lastCheck="3 minutes ago"
                uptime="97.2%"
              />
              <MonitoringCard
                title="📄 EDI Clearinghouse"
                status="connected"
                lastCheck="1 minute ago"
                uptime="99.9%"
              />
              <MonitoringCard
                title="🤖 AI Staff Brook"
                status="active"
                lastCheck="processing"
                uptime="100%"
              />
              <MonitoringCard
                title="�� AI Staff Kameelah"
                status="active"
                lastCheck="processing"
                uptime="100%"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function AIStatCard({ title, value, subtitle, icon, color }: any) {
  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.6)',
      border: `2px solid ${color}`,
      borderRadius: '12px',
      padding: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600', margin: 0 }}>
          {title}
        </h3>
        <span style={{ fontSize: '2rem' }}>{icon}</span>
      </div>
      <div style={{ color: color, fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>
        {value}
      </div>
      <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>
        {subtitle}
      </div>
    </div>
  );
}

function AIStaffCard({ name, role, id, status, currentTask, tasksCompleted, efficiency }: any) {
  const statusColor = status === 'active' ? '#10b981' : '#6b7280';
  
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      border: `2px solid ${statusColor}`,
      borderRadius: '8px',
      padding: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <div style={{ color: 'white', fontSize: '1rem', fontWeight: '600' }}>
            🤖 {name}
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
            {role} • {id}
          </div>
        </div>
        <span style={{
          background: `${statusColor}30`,
          color: statusColor,
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: '600',
          height: 'fit-content',
        }}>
          {status}
        </span>
      </div>
      <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem', marginBottom: '12px' }}>
        {currentTask}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
        <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          Tasks: {tasksCompleted}
        </span>
        <span style={{ color: '#10b981', fontWeight: '600' }}>
          {efficiency}% efficient
        </span>
      </div>
    </div>
  );
}

function AIActivityItem({ activity }: any) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      border: activity.success ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
    }}>
      <span style={{ fontSize: '1.5rem' }}>
        {activity.success ? '✅' : '❌'}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
            {activity.action}
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.75rem' }}>
            {activity.duration}s
          </div>
        </div>
        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem', marginBottom: '4px' }}>
          by {activity.aiStaffName}
        </div>
        <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>
          {activity.details}
        </div>
      </div>
    </div>
  );
}

function AITaskCard({ task }: any) {
  const statusColors: any = {
    'queued': '#6b7280',
    'processing': '#3b82f6',
    'completed': '#10b981',
    'failed': '#ef4444',
  };
  
  return (
    <div style={{
      padding: '16px',
      background: 'rgba(255, 255, 255, 0.05)',
      border: `2px solid ${statusColors[task.status]}`,
      borderRadius: '8px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <div style={{ color: 'white', fontSize: '1rem', fontWeight: '600' }}>
            {task.type}
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
            ID: {task.id} • Assigned to: {task.assignedAI}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{
            background: `${statusColors[task.status]}30`,
            color: statusColors[task.status],
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: '600',
          }}>
            {task.status}
          </span>
          <span style={{
            background: task.priority === 'critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            color: task.priority === 'critical' ? '#ef4444' : '#f59e0b',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: '600',
          }}>
            {task.priority}
          </span>
        </div>
      </div>
      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
        {JSON.stringify(task.data)}
      </div>
    </div>
  );
}

function WorkflowCard({ title, description, aiStaff, avgTime, successRate }: any) {
  return (
    <div style={{
      background: 'rgba(139, 92, 246, 0.1)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '8px',
      padding: '16px',
    }}>
      <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>
        {title}
      </h4>
      <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem', marginBottom: '12px' }}>
        {description}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
        <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          AI: {aiStaff}
        </span>
        <span style={{ color: '#8b5cf6', fontWeight: '600' }}>
          {avgTime} • {successRate}
        </span>
      </div>
    </div>
  );
}

function MonitoringCard({ title, status, lastCheck, uptime }: any) {
  const statusColor = status === 'connected' || status === 'active' ? '#10b981' : '#ef4444';
  
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      border: `2px solid ${statusColor}`,
      borderRadius: '8px',
      padding: '16px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: '600', margin: 0 }}>
          {title}
        </h4>
        <span style={{
          background: `${statusColor}30`,
          color: statusColor,
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          fontWeight: '600',
        }}>
          {status}
        </span>
      </div>
      <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem' }}>
        Last check: {lastCheck}
      </div>
      <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: '600', marginTop: '4px' }}>
        Uptime: {uptime}
      </div>
    </div>
  );
}
