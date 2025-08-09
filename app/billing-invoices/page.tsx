'use client';

import { useEffect, useRef, useState } from 'react';

// Mobile optimization styles
const mobileStyles = `
  @media (max-width: 768px) {
    .financial-grid {
      grid-template-columns: 1fr !important;
      gap: 12px !important;
    }
    .financial-card {
      padding: 16px !important;
      margin-bottom: 12px !important;
    }
    .financial-table {
      font-size: 0.8rem !important;
      overflow-x: auto !important;
    }
    .financial-filters {
      flex-direction: column !important;
      gap: 8px !important;
    }
    .financial-tabs {
      flex-wrap: wrap !important;
      gap: 4px !important;
    }
    .financial-tab {
      padding: 8px 12px !important;
      font-size: 0.8rem !important;
    }
    .chart-container {
      width: 100% !important;
      overflow-x: auto !important;
    }
  }
  @media (max-width: 480px) {
    .financial-header {
      font-size: 1.2rem !important;
    }
    .financial-subtitle {
      font-size: 0.9rem !important;
    }
    .performance-metric {
      font-size: 0.8rem !important;
    }
  }
`;

// Inject mobile styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = mobileStyles;
  document.head.appendChild(styleSheet);
}

// Chart component for visualizations
const SimpleChart = ({
  data,
  type = 'bar',
  width = 300,
  height = 200,
  color = '#3b82f6',
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    const { width: canvasWidth, height: canvasHeight } = canvas;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const padding = 40;
    const chartWidth = canvasWidth - padding * 2;
    const chartHeight = canvasHeight - padding * 2;

    const maxValue = Math.max(...data.map((d) => d.value));
    const barWidth = chartWidth / data.length;

    // Set styles
    ctx.fillStyle = color;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    if (type === 'bar') {
      // Draw bars
      data.forEach((item, index) => {
        const barHeight = (item.value / maxValue) * chartHeight;
        const x = padding + index * barWidth + barWidth * 0.1;
        const y = padding + chartHeight - barHeight;
        const width = barWidth * 0.8;

        // Draw bar
        ctx.fillRect(x, y, width, barHeight);

        // Draw label
        ctx.fillStyle = '#ffffff';
        ctx.fillText(item.label, x + width / 2, canvasHeight - 10);

        // Draw value
        ctx.fillText(item.value.toLocaleString(), x + width / 2, y - 5);

        ctx.fillStyle = color;
      });
    } else if (type === 'line') {
      // Draw line chart
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();

      data.forEach((item, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - (item.value / maxValue) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        // Draw point
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();

        // Draw label
        ctx.fillStyle = '#ffffff';
        ctx.fillText(item.label, x, canvasHeight - 10);
        ctx.fillText(item.value.toLocaleString(), x, y - 10);
      });

      ctx.strokeStyle = color;
      ctx.stroke();
    }
  }, [data, type, color]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}
    />
  );
};

// Performance metrics component
const PerformanceMetrics = ({ title, metrics, color }) => (
  <div
    style={{
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '20px',
      border: `1px solid ${color}30`,
      borderLeft: `4px solid ${color}`,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    }}
  >
    <h4
      style={{
        color: color,
        margin: '0 0 16px 0',
        fontSize: '1.1rem',
        fontWeight: '600',
      }}
    >
      {title}
    </h4>
    {metrics.map((metric, index) => (
      <div
        key={index}
        style={{
          marginBottom: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
          {metric.label}
        </span>
        <span style={{ color: 'white', fontWeight: '600', fontSize: '1rem' }}>
          {metric.value}
        </span>
      </div>
    ))}
  </div>
);

// Notification component
const NotificationBell = ({ notifications }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        style={{
          background:
            notifications.length > 0 ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '1.2rem',
          position: 'relative',
        }}
      >
        🔔
        {notifications.length > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {notifications.length}
          </span>
        )}
      </button>

      {showNotifications && (
        <div
          style={{
            position: 'absolute',
            top: '45px',
            right: '0',
            width: '300px',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            zIndex: 1000,
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h4 style={{ color: 'white', margin: '0', fontSize: '1rem' }}>
              Notifications
            </h4>
          </div>
          {notifications.map((notification, index) => (
            <div
              key={index}
              style={{
                padding: '12px 16px',
                borderBottom:
                  index < notifications.length - 1
                    ? '1px solid rgba(255, 255, 255, 0.05)'
                    : 'none',
              }}
            >
              <div
                style={{
                  color: notification.type === 'alert' ? '#ef4444' : '#22c55e',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                {notification.title}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.8rem',
                  marginTop: '4px',
                }}
              >
                {notification.message}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '0.7rem',
                  marginTop: '4px',
                }}
              >
                {notification.time}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Comprehensive billing data structure
// Department-specific receivables data
const mockDepartmentReceivables = [
  {
    id: 'DR-2025-001',
    invoiceId: 'INV-2025-001',
    department: 'Broker Operations',
    departmentCode: 'BB',
    employeeName: 'Mike Wilson',
    employeeId: 'MW-BB-2024061',
    clientName: 'ABC Logistics Corp',
    amount: 15750.0,
    commission: 7875.0, // 50% AI Flow commission
    netRevenue: 7875.0,
    revenueType: 'ai_flow_leads',
    status: 'paid',
    dueDate: '2025-01-15',
    issueDate: '2025-01-01',
    paidDate: '2025-01-14',
    description: 'AI Flow shipper leads - ABC Logistics',
    category: 'ai_flow_revenue',
    costCenter: 'operations',
    glAccount: '4100-001',
    auditTrail: [
      { date: '2025-01-01', action: 'Lead Generated', user: 'AI System' },
      { date: '2025-01-01', action: 'Broker Assigned', user: 'System' },
      { date: '2025-01-02', action: 'Deal Closed', user: 'Mike Wilson' },
      { date: '2025-01-14', action: 'Payment Received', user: 'System' },
    ],
  },
  {
    id: 'DR-2025-002',
    invoiceId: 'INV-2025-002',
    department: 'Dispatch Operations',
    departmentCode: 'DC',
    employeeName: 'Sarah Johnson',
    employeeId: 'SJ-DC-2024014',
    clientName: 'Metro Freight Solutions',
    amount: 8900.0,
    commission: 2225.0, // 25% dispatcher commission
    netRevenue: 6675.0,
    revenueType: 'ai_flow_leads',
    status: 'pending',
    dueDate: '2025-01-25',
    issueDate: '2025-01-10',
    description: 'AI Flow carrier leads - Metro Freight',
    category: 'ai_flow_revenue',
    costCenter: 'operations',
    glAccount: '4100-002',
    auditTrail: [
      { date: '2025-01-10', action: 'Lead Generated', user: 'AI System' },
      { date: '2025-01-10', action: 'Dispatcher Assigned', user: 'System' },
      { date: '2025-01-11', action: 'Deal Closed', user: 'Sarah Johnson' },
    ],
  },
  {
    id: 'DR-2025-003',
    invoiceId: 'INV-2025-003',
    department: 'Sales & Marketing',
    departmentCode: 'SM',
    employeeName: 'David Thompson',
    employeeId: 'DT-SM-2024032',
    clientName: 'Global Supply Chain Inc',
    amount: 22400.0,
    commission: 3360.0, // 15% sales commission
    netRevenue: 19040.0,
    revenueType: 'direct_sales',
    status: 'overdue',
    dueDate: '2025-01-05',
    issueDate: '2024-12-20',
    description: 'Direct sales - Multi-drop services',
    category: 'direct_sales_revenue',
    costCenter: 'sales',
    glAccount: '4200-001',
    auditTrail: [
      {
        date: '2024-12-20',
        action: 'Sales Opportunity Created',
        user: 'David Thompson',
      },
      { date: '2024-12-21', action: 'Proposal Sent', user: 'David Thompson' },
      { date: '2024-12-22', action: 'Contract Signed', user: 'David Thompson' },
    ],
  },
  {
    id: 'DR-2025-004',
    invoiceId: 'INV-2025-004',
    department: 'FreightFlow RFx',
    departmentCode: 'RFX',
    employeeName: 'Lisa Chen',
    employeeId: 'LC-RFX-2024028',
    clientName: 'Regional Transport LLC',
    amount: 12800.0,
    commission: 1920.0, // 15% RFx commission
    netRevenue: 10880.0,
    revenueType: 'rfx_services',
    status: 'paid',
    dueDate: '2025-01-20',
    issueDate: '2025-01-05',
    paidDate: '2025-01-18',
    description: 'RFx platform services - Government contract bid',
    category: 'rfx_revenue',
    costCenter: 'operations',
    glAccount: '4300-001',
    auditTrail: [
      {
        date: '2025-01-05',
        action: 'RFx Opportunity Identified',
        user: 'AI System',
      },
      { date: '2025-01-06', action: 'Bid Prepared', user: 'Lisa Chen' },
      { date: '2025-01-08', action: 'Bid Submitted', user: 'Lisa Chen' },
      { date: '2025-01-15', action: 'Contract Awarded', user: 'System' },
      { date: '2025-01-18', action: 'Payment Received', user: 'System' },
    ],
  },
  // Insurance Partnership Revenue
  {
    id: 'INV-2025-005',
    invoiceId: 'INV-2025-005',
    department: 'Insurance Partnerships',
    departmentCode: 'INS',
    employeeName: 'FleetFlow Platform',
    employeeId: 'FF-INS-SYSTEM',
    clientName: 'Covered Insurance Platform',
    amount: 2850.0,
    commission: 2850.0, // 100% referral commission
    netRevenue: 2850.0,
    revenueType: 'insurance_referral',
    status: 'paid',
    dueDate: '2025-01-25',
    issueDate: '2025-01-10',
    paidDate: '2025-01-23',
    description: 'Commercial auto insurance referral commission - 3 policies',
    category: 'insurance_revenue',
    costCenter: 'partnerships',
    glAccount: '4400-001',
    auditTrail: [
      {
        date: '2025-01-10',
        action: 'Insurance Referrals Generated',
        user: 'FleetFlow System',
      },
      {
        date: '2025-01-12',
        action: 'Customer Applications Submitted',
        user: 'Covered Platform',
      },
      {
        date: '2025-01-15',
        action: 'Policies Approved',
        user: 'Covered Platform',
      },
      {
        date: '2025-01-20',
        action: 'Policies Activated',
        user: 'Covered Platform',
      },
      {
        date: '2025-01-23',
        action: 'Commission Payment Received',
        user: 'System',
      },
    ],
  },
  {
    id: 'INV-2025-006',
    invoiceId: 'INV-2025-006',
    department: 'Insurance Partnerships',
    departmentCode: 'INS',
    employeeName: 'FleetFlow Platform',
    employeeId: 'FF-INS-SYSTEM',
    clientName: 'Tivly Affiliate Program',
    amount: 4200.0,
    commission: 4200.0, // 100% referral commission
    netRevenue: 4200.0,
    revenueType: 'insurance_referral',
    status: 'pending',
    dueDate: '2025-02-05',
    issueDate: '2025-01-15',
    paidDate: null,
    description:
      'General liability & workers comp referral commissions - 5 policies',
    category: 'insurance_revenue',
    costCenter: 'partnerships',
    glAccount: '4400-002',
    auditTrail: [
      {
        date: '2025-01-15',
        action: 'Insurance Referrals Generated',
        user: 'FleetFlow System',
      },
      {
        date: '2025-01-17',
        action: 'Customer Applications Submitted',
        user: 'Tivly Platform',
      },
      {
        date: '2025-01-20',
        action: 'Policies Approved',
        user: 'Tivly Platform',
      },
      {
        date: '2025-01-22',
        action: 'Policies Activated',
        user: 'Tivly Platform',
      },
    ],
  },
  {
    id: 'INV-2025-007',
    invoiceId: 'INV-2025-007',
    department: 'Insurance Partnerships',
    departmentCode: 'INS',
    employeeName: 'FleetFlow Platform',
    employeeId: 'FF-INS-SYSTEM',
    clientName: 'GEICO Commercial Trucking',
    amount: 1850.0,
    commission: 1850.0, // 100% referral commission
    netRevenue: 1850.0,
    revenueType: 'insurance_referral',
    status: 'paid',
    dueDate: '2025-01-30',
    issueDate: '2025-01-12',
    paidDate: '2025-01-28',
    description:
      'Commercial trucking insurance referral - Owner-operator policy',
    category: 'insurance_revenue',
    costCenter: 'partnerships',
    glAccount: '4400-003',
    auditTrail: [
      {
        date: '2025-01-12',
        action: 'Insurance Referral Generated',
        user: 'FleetFlow System',
      },
      {
        date: '2025-01-14',
        action: 'Customer Application Submitted',
        user: 'GEICO Platform',
      },
      { date: '2025-01-18', action: 'Policy Approved', user: 'GEICO Platform' },
      {
        date: '2025-01-20',
        action: 'Policy Activated',
        user: 'GEICO Platform',
      },
      {
        date: '2025-01-28',
        action: 'Commission Payment Received',
        user: 'System',
      },
    ],
  },
];

// Payroll data structure
const mockPayrollData = [
  {
    id: 'PR-2025-001',
    employeeName: 'Mike Wilson',
    employeeId: 'MW-BB-2024061',
    department: 'Broker Operations',
    departmentCode: 'BB',
    position: 'Senior Broker',
    payPeriod: '2025-01-01 to 2025-01-15',
    baseSalary: 0.0, // Commission-only until employment system implemented
    commissionEarned: 14980.0, // Combined: AI Flow $7,875 + Traditional $4,275 + Spot Market $1,830 + Performance $1,000
    bonuses: 0.0, // Commission-only structure
    grossPay: 14980.0, // Commission only
    federalTax: 2247.0, // Adjusted for commission-only income
    stateTax: 749.0, // Adjusted for commission-only income
    socialSecurity: 928.76, // 6.2% of gross
    medicare: 217.21, // 1.45% of gross
    healthInsurance: 250.0, // Self-paid benefits for contractors
    retirement401k: 749.0, // Optional contribution
    totalDeductions: 4940.97, // Updated total
    netPay: 10039.03, // Updated net pay
    status: 'processed',
    payDate: '2025-01-16',
    auditTrail: [
      { date: '2025-01-15', action: 'Payroll Calculated', user: 'System' },
      { date: '2025-01-16', action: 'Payroll Processed', user: 'HR System' },
      {
        date: '2025-01-16',
        action: 'Direct Deposit Initiated',
        user: 'Banking System',
      },
    ],
  },
  {
    id: 'PR-2025-002',
    employeeName: 'Sarah Johnson',
    employeeId: 'SJ-DC-2024014',
    department: 'Dispatch Operations',
    departmentCode: 'DC',
    position: 'Senior Dispatcher',
    payPeriod: '2025-01-01 to 2025-01-15',
    baseSalary: 0.0, // Commission-only until employment system implemented
    commissionEarned: 6465.0, // Combined: AI Flow $2,225 + Fleet Mgmt $1,840 + Owner Operator $980 + Load Coord $1,420
    bonuses: 0.0, // Commission-only structure
    grossPay: 6465.0, // Commission only
    federalTax: 969.75, // Adjusted for commission-only income (15%)
    stateTax: 323.25, // Adjusted for commission-only income (5%)
    socialSecurity: 400.83, // 6.2% of gross
    medicare: 93.74, // 1.45% of gross
    healthInsurance: 200.0, // Self-paid benefits for contractors
    retirement401k: 323.25, // Optional contribution (5%)
    totalDeductions: 2310.82, // Updated total
    netPay: 4154.18, // Updated net pay
    status: 'processed',
    payDate: '2025-01-16',
    auditTrail: [
      { date: '2025-01-15', action: 'Payroll Calculated', user: 'System' },
      { date: '2025-01-16', action: 'Payroll Processed', user: 'HR System' },
      {
        date: '2025-01-16',
        action: 'Direct Deposit Initiated',
        user: 'Banking System',
      },
    ],
  },
  {
    id: 'PR-2025-003',
    employeeName: 'David Thompson',
    employeeId: 'DT-SM-2024032',
    department: 'Sales & Marketing',
    departmentCode: 'SM',
    position: 'Sales Manager',
    payPeriod: '2025-01-01 to 2025-01-15',
    baseSalary: 0.0, // Commission-only until employment system implemented
    commissionEarned: 3360.0,
    bonuses: 0.0, // Commission-only structure
    grossPay: 3360.0, // Commission only
    federalTax: 504.0, // Adjusted for commission-only income (15%)
    stateTax: 168.0, // Adjusted for commission-only income (5%)
    socialSecurity: 208.32, // 6.2% of gross
    medicare: 48.72, // 1.45% of gross
    healthInsurance: 275.0, // Self-paid benefits for contractors
    retirement401k: 168.0, // Optional contribution (5%)
    totalDeductions: 1372.04, // Updated total
    netPay: 1987.96, // Updated net pay
    status: 'processed',
    payDate: '2025-01-16',
    auditTrail: [
      { date: '2025-01-15', action: 'Payroll Calculated', user: 'System' },
      { date: '2025-01-16', action: 'Payroll Processed', user: 'HR System' },
      {
        date: '2025-01-16',
        action: 'Direct Deposit Initiated',
        user: 'Banking System',
      },
    ],
  },
];

const mockAccountsReceivable = [
  {
    id: 'AR-2025-001',
    invoiceId: 'INV-2025-001',
    clientName: 'ABC Logistics Corp',
    clientId: 'CLI-001',
    amount: 15750.0,
    status: 'paid',
    dueDate: '2025-01-15',
    issueDate: '2025-01-01',
    paidDate: '2025-01-14',
    description: 'Transportation services - December 2024',
    paymentMethod: 'ACH Transfer',
    category: 'freight_services',
    costCenter: 'operations',
    glAccount: '4000-001',
    approvedBy: 'John Smith',
    createdBy: 'Sarah Johnson',
    auditTrail: [
      { date: '2025-01-01', action: 'Invoice Created', user: 'Sarah Johnson' },
      { date: '2025-01-02', action: 'Invoice Approved', user: 'John Smith' },
      { date: '2025-01-03', action: 'Invoice Sent', user: 'Sarah Johnson' },
      { date: '2025-01-14', action: 'Payment Received', user: 'System' },
    ],
    aging: 0,
    terms: 'Net 30',
    taxAmount: 1575.0,
    subtotal: 14175.0,
  },
  {
    id: 'AR-2025-002',
    invoiceId: 'INV-2025-002',
    clientName: 'Metro Freight Solutions',
    clientId: 'CLI-002',
    amount: 8900.0,
    status: 'pending',
    dueDate: '2025-01-25',
    issueDate: '2025-01-10',
    paidDate: null,
    description: 'Load delivery services - Week 1 Jan 2025',
    paymentMethod: 'Check',
    category: 'freight_services',
    costCenter: 'operations',
    glAccount: '4000-001',
    approvedBy: 'John Smith',
    createdBy: 'Mike Wilson',
    auditTrail: [
      { date: '2025-01-10', action: 'Invoice Created', user: 'Mike Wilson' },
      { date: '2025-01-11', action: 'Invoice Approved', user: 'John Smith' },
      { date: '2025-01-12', action: 'Invoice Sent', user: 'Mike Wilson' },
    ],
    aging: 5,
    terms: 'Net 15',
    taxAmount: 890.0,
    subtotal: 8010.0,
  },
  {
    id: 'AR-2025-003',
    invoiceId: 'INV-2025-003',
    clientName: 'Global Supply Chain Inc',
    clientId: 'CLI-003',
    amount: 22400.0,
    status: 'overdue',
    dueDate: '2025-01-05',
    issueDate: '2024-12-20',
    paidDate: null,
    description: 'Multi-drop delivery services',
    paymentMethod: 'Wire Transfer',
    category: 'freight_services',
    costCenter: 'operations',
    glAccount: '4000-001',
    approvedBy: 'John Smith',
    createdBy: 'David Thompson',
    auditTrail: [
      { date: '2024-12-20', action: 'Invoice Created', user: 'David Thompson' },
      { date: '2024-12-21', action: 'Invoice Approved', user: 'John Smith' },
      { date: '2024-12-22', action: 'Invoice Sent', user: 'David Thompson' },
      { date: '2025-01-06', action: 'Follow-up Sent', user: 'Sarah Johnson' },
      {
        date: '2025-01-12',
        action: 'Collection Notice Sent',
        user: 'Sarah Johnson',
      },
    ],
    aging: 25,
    terms: 'Net 30',
    taxAmount: 2240.0,
    subtotal: 20160.0,
  },
];

const mockAccountsPayable = [
  {
    id: 'AP-2025-001',
    vendorName: 'Fuel Express LLC',
    vendorId: 'VEN-001',
    amount: 5420.0,
    status: 'pending',
    dueDate: '2025-01-20',
    receiveDate: '2025-01-08',
    invoiceNumber: 'FE-2025-001',
    description: 'Diesel fuel - Fleet vehicles',
    category: 'fuel_costs',
    costCenter: 'fleet',
    glAccount: '6000-001',
    approvedBy: null,
    requestedBy: 'Tom Rodriguez',
    auditTrail: [
      { date: '2025-01-08', action: 'Invoice Received', user: 'System' },
      { date: '2025-01-09', action: 'Under Review', user: 'Tom Rodriguez' },
    ],
    aging: 7,
    terms: 'Net 30',
    poNumber: 'PO-2025-001',
    taxAmount: 542.0,
    subtotal: 4878.0,
  },
  {
    id: 'AP-2025-002',
    vendorName: 'Interstate Insurance Co',
    vendorId: 'VEN-002',
    amount: 12800.0,
    status: 'approved',
    dueDate: '2025-01-18',
    receiveDate: '2025-01-05',
    invoiceNumber: 'IIC-2025-Q1',
    description: 'Commercial vehicle insurance - Q1 2025',
    category: 'insurance',
    costCenter: 'administration',
    glAccount: '6500-001',
    approvedBy: 'John Smith',
    requestedBy: 'Lisa Chen',
    auditTrail: [
      { date: '2025-01-05', action: 'Invoice Received', user: 'System' },
      { date: '2025-01-06', action: 'Under Review', user: 'Lisa Chen' },
      {
        date: '2025-01-07',
        action: 'Approved for Payment',
        user: 'John Smith',
      },
    ],
    aging: 10,
    terms: 'Net 15',
    poNumber: 'PO-2025-002',
    taxAmount: 0,
    subtotal: 12800.0,
  },
  {
    id: 'AP-2025-003',
    vendorName: 'Maintenance Pro Services',
    vendorId: 'VEN-003',
    amount: 3200.0,
    status: 'paid',
    dueDate: '2025-01-10',
    receiveDate: '2024-12-28',
    paidDate: '2025-01-09',
    invoiceNumber: 'MPS-2024-456',
    description: 'Fleet maintenance and repairs',
    category: 'maintenance',
    costCenter: 'fleet',
    glAccount: '6200-001',
    approvedBy: 'John Smith',
    requestedBy: 'Tom Rodriguez',
    auditTrail: [
      { date: '2024-12-28', action: 'Invoice Received', user: 'System' },
      { date: '2024-12-29', action: 'Under Review', user: 'Tom Rodriguez' },
      {
        date: '2025-01-02',
        action: 'Approved for Payment',
        user: 'John Smith',
      },
      { date: '2025-01-09', action: 'Payment Processed', user: 'System' },
    ],
    aging: 0,
    terms: 'Net 15',
    poNumber: 'PO-2024-089',
    taxAmount: 320.0,
    subtotal: 2880.0,
  },
];

const costCenters = [
  { id: 'operations', name: 'Operations', budget: 500000, spent: 235420 },
  { id: 'fleet', name: 'Fleet Management', budget: 300000, spent: 142380 },
  {
    id: 'administration',
    name: 'Administration',
    budget: 150000,
    spent: 67200,
  },
  { id: 'sales', name: 'Sales & Marketing', budget: 100000, spent: 34500 },
];

const categories = [
  { id: 'freight_services', name: 'Freight Services', type: 'revenue' },
  { id: 'ai_flow_revenue', name: 'AI Flow Revenue', type: 'revenue' },
  { id: 'direct_sales_revenue', name: 'Direct Sales Revenue', type: 'revenue' },
  { id: 'rfx_revenue', name: 'RFx Platform Revenue', type: 'revenue' },
  { id: 'fuel_costs', name: 'Fuel Costs', type: 'expense' },
  { id: 'maintenance', name: 'Maintenance & Repairs', type: 'expense' },
  { id: 'insurance', name: 'Insurance', type: 'expense' },
  { id: 'office_supplies', name: 'Office Supplies', type: 'expense' },
  { id: 'payroll_expenses', name: 'Payroll & Benefits', type: 'expense' },
  {
    id: 'professional_services',
    name: 'Professional Services',
    type: 'expense',
  },
];

const departments = [
  { id: 'BB', name: 'Broker Operations', color: '#f97316' },
  { id: 'DC', name: 'Dispatch Operations', color: '#3b82f6' },
  { id: 'SM', name: 'Sales & Marketing', color: '#10b981' },
  { id: 'RFX', name: 'FreightFlow RFx', color: '#8b5cf6' },
  { id: 'INS', name: 'Insurance Partnerships', color: '#14b8a6' },
  { id: 'MGR', name: 'Management', color: '#6b7280' },
  { id: 'DM', name: 'Driver Management', color: '#f4a832' },
];

const BillingInvoicesPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [accountsReceivable, setAccountsReceivable] = useState(
    mockAccountsReceivable
  );
  const [departmentReceivables, setDepartmentReceivables] = useState(
    mockDepartmentReceivables
  );
  const [payrollData, setPayrollData] = useState(mockPayrollData);
  const [accountsPayable, setAccountsPayable] = useState(mockAccountsPayable);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCostCenter, setSelectedCostCenter] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('current_month');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-01-31');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonStartDate, setComparisonStartDate] = useState('2024-12-01');
  const [comparisonEndDate, setComparisonEndDate] = useState('2024-12-31');
  const [showCharts, setShowCharts] = useState(true);
  const [selectedMetrics, setSelectedMetrics] = useState([
    'revenue',
    'expenses',
    'profit',
    'commissions',
  ]);

  // Mock notifications
  const [notifications] = useState([
    {
      type: 'alert',
      title: 'Overdue Payment Alert',
      message: 'Global Supply Chain Inc - $22,400 overdue by 25 days',
      time: '2 hours ago',
    },
    {
      type: 'success',
      title: 'Payment Received',
      message: 'Regional Transport LLC - $12,800 payment processed',
      time: '4 hours ago',
    },
    {
      type: 'info',
      title: 'Commission Milestone',
      message: 'Mike Wilson reached $15K commission target',
      time: '1 day ago',
    },
  ]);

  // Date filtering helper
  const isWithinDateRange = (dateString: string) => {
    const date = new Date(dateString);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return date >= start && date <= end;
  };

  // Apply date filtering based on selected range
  const getDateFilteredData = (data: any[], dateField: string) => {
    return data.filter((item) => {
      const itemDate = item[dateField];
      if (!itemDate) return false;
      return isWithinDateRange(itemDate);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#22c55e';
      case 'pending':
        return '#f59e0b';
      case 'overdue':
        return '#ef4444';
      case 'draft':
        return '#6b7280';
      case 'approved':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'paid':
        return 'rgba(34, 197, 94, 0.1)';
      case 'pending':
        return 'rgba(245, 158, 11, 0.1)';
      case 'overdue':
        return 'rgba(239, 68, 68, 0.1)';
      case 'draft':
        return 'rgba(107, 114, 128, 0.1)';
      case 'approved':
        return 'rgba(59, 130, 246, 0.1)';
      default:
        return 'rgba(107, 114, 128, 0.1)';
    }
  };

  const filteredReceivables = accountsReceivable.filter((item) => {
    const matchesStatus =
      selectedStatus === 'all' || item.status === selectedStatus;
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesCostCenter =
      selectedCostCenter === 'all' || item.costCenter === selectedCostCenter;
    const matchesSearch =
      item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return (
      matchesStatus && matchesCategory && matchesCostCenter && matchesSearch
    );
  });

  const filteredDepartmentReceivables = departmentReceivables.filter((item) => {
    const matchesStatus =
      selectedStatus === 'all' || item.status === selectedStatus;
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesDepartment =
      selectedDepartment === 'all' ||
      item.departmentCode === selectedDepartment;
    const matchesSearch =
      item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return (
      matchesStatus && matchesCategory && matchesDepartment && matchesSearch
    );
  });

  const filteredPayroll = payrollData.filter((item) => {
    const matchesDepartment =
      selectedDepartment === 'all' ||
      item.departmentCode === selectedDepartment;
    const matchesSearch =
      item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.position.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  const filteredPayables = accountsPayable.filter((item) => {
    const matchesStatus =
      selectedStatus === 'all' || item.status === selectedStatus;
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesCostCenter =
      selectedCostCenter === 'all' || item.costCenter === selectedCostCenter;
    const matchesSearch =
      item.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return (
      matchesStatus && matchesCategory && matchesCostCenter && matchesSearch
    );
  });

  // Apply date filtering to all data
  const dateFilteredReceivables = getDateFilteredData(
    filteredReceivables,
    'issueDate'
  );
  const dateFilteredDepartmentReceivables = getDateFilteredData(
    filteredDepartmentReceivables,
    'issueDate'
  );
  const dateFilteredPayables = getDateFilteredData(
    filteredPayables,
    'receiveDate'
  );
  const dateFilteredPayroll = getDateFilteredData(filteredPayroll, 'payDate');

  // Advanced search state
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    minAmount: '',
    maxAmount: '',
    client: '',
    employee: '',
    description: '',
  });

  // Integration settings state
  const [integrations, setIntegrations] = useState({
    quickbooks: {
      enabled: false,
      connected: false,
      syncInvoices: true,
      syncExpenses: true,
      companyId: '',
      lastSync: null,
    },
    square: {
      enabled: false,
      connected: false,
      applicationId: '',
      locationId: '',
      environment: 'sandbox', // 'sandbox' or 'production'
      lastSync: null,
    },
  });

  // Advanced search functionality
  const applyAdvancedSearch = (data) => {
    return data.filter((item) => {
      const matchesMinAmount =
        !searchFilters.minAmount ||
        item.amount >= parseFloat(searchFilters.minAmount);
      const matchesMaxAmount =
        !searchFilters.maxAmount ||
        item.amount <= parseFloat(searchFilters.maxAmount);
      const matchesClient =
        !searchFilters.client ||
        (item.clientName &&
          item.clientName
            .toLowerCase()
            .includes(searchFilters.client.toLowerCase()));
      const matchesEmployee =
        !searchFilters.employee ||
        (item.employeeName &&
          item.employeeName
            .toLowerCase()
            .includes(searchFilters.employee.toLowerCase()));
      const matchesDescription =
        !searchFilters.description ||
        item.description
          .toLowerCase()
          .includes(searchFilters.description.toLowerCase());

      return (
        matchesMinAmount &&
        matchesMaxAmount &&
        matchesClient &&
        matchesEmployee &&
        matchesDescription
      );
    });
  };

  // Apply advanced search filters
  const finalFilteredDepartmentReceivables = applyAdvancedSearch(
    dateFilteredDepartmentReceivables
  );
  const finalFilteredPayroll = applyAdvancedSearch(dateFilteredPayroll);

  // Accounts Receivable Calculations (Date Filtered)
  const totalReceivables = dateFilteredReceivables.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const paidReceivables = dateFilteredReceivables
    .filter((item) => item.status === 'paid')
    .reduce((sum, item) => sum + item.amount, 0);
  const pendingReceivables = dateFilteredReceivables
    .filter((item) => item.status === 'pending')
    .reduce((sum, item) => sum + item.amount, 0);
  const overdueReceivables = dateFilteredReceivables
    .filter((item) => item.status === 'overdue')
    .reduce((sum, item) => sum + item.amount, 0);

  // Department Receivables Calculations (Date Filtered)
  const totalDepartmentRevenue = dateFilteredDepartmentReceivables.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalCommissionsPaid = dateFilteredDepartmentReceivables.reduce(
    (sum, item) => sum + item.commission,
    0
  );
  const totalNetRevenue = dateFilteredDepartmentReceivables.reduce(
    (sum, item) => sum + item.netRevenue,
    0
  );

  // Department Revenue Breakdown (Date Filtered)
  const departmentRevenue = departments
    .map((dept) => {
      const deptItems = dateFilteredDepartmentReceivables.filter(
        (item) => item.departmentCode === dept.id
      );
      return {
        ...dept,
        totalRevenue: deptItems.reduce((sum, item) => sum + item.amount, 0),
        totalCommissions: deptItems.reduce(
          (sum, item) => sum + item.commission,
          0
        ),
        netRevenue: deptItems.reduce((sum, item) => sum + item.netRevenue, 0),
        transactionCount: deptItems.length,
      };
    })
    .filter((dept) => dept.totalRevenue > 0);

  // Payroll Calculations (Date Filtered)
  const totalPayrollCost = dateFilteredPayroll.reduce(
    (sum, item) => sum + item.grossPay,
    0
  );
  const totalNetPay = dateFilteredPayroll.reduce(
    (sum, item) => sum + item.netPay,
    0
  );
  const totalDeductions = dateFilteredPayroll.reduce(
    (sum, item) => sum + item.totalDeductions,
    0
  );
  const totalCommissionsEarned = dateFilteredPayroll.reduce(
    (sum, item) => sum + item.commissionEarned,
    0
  );

  // Accounts Payable Calculations (Date Filtered)
  const totalPayables = dateFilteredPayables.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const paidPayables = dateFilteredPayables
    .filter((item) => item.status === 'paid')
    .reduce((sum, item) => sum + item.amount, 0);
  const pendingPayables = dateFilteredPayables
    .filter((item) => item.status === 'pending')
    .reduce((sum, item) => sum + item.amount, 0);
  const approvedPayables = dateFilteredPayables
    .filter((item) => item.status === 'approved')
    .reduce((sum, item) => sum + item.amount, 0);

  // Cash Flow Calculations (including department revenue and payroll)
  const totalIncome = totalReceivables + totalDepartmentRevenue;
  const totalExpenses = totalPayables + totalPayrollCost;
  const netCashFlow = totalIncome - totalExpenses;
  const projectedCashFlow =
    pendingReceivables - (pendingPayables + approvedPayables);

  // Aging Analysis (Date Filtered)
  const aging30 = [...dateFilteredReceivables, ...dateFilteredPayables]
    .filter((item) => item.aging <= 30 && item.aging > 0)
    .reduce((sum, item) => sum + item.amount, 0);
  const aging60 = [...dateFilteredReceivables, ...dateFilteredPayables]
    .filter((item) => item.aging <= 60 && item.aging > 30)
    .reduce((sum, item) => sum + item.amount, 0);
  const aging90 = [...dateFilteredReceivables, ...dateFilteredPayables]
    .filter((item) => item.aging > 60)
    .reduce((sum, item) => sum + item.amount, 0);

  // Format date range for display
  const formatDateRange = () => {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    return `${start} - ${end}`;
  };

  // Generate chart data
  const getRevenueChartData = () => {
    return departmentRevenue.map((dept) => ({
      label: dept.name.split(' ')[0],
      value: dept.totalRevenue,
    }));
  };

  const getCommissionChartData = () => {
    return departmentRevenue.map((dept) => ({
      label: dept.name.split(' ')[0],
      value: dept.totalCommissions,
    }));
  };

  const getTrendChartData = () => {
    // Mock trend data - in real app this would come from historical data
    return [
      { label: 'Week 1', value: totalIncome * 0.2 },
      { label: 'Week 2', value: totalIncome * 0.3 },
      { label: 'Week 3', value: totalIncome * 0.25 },
      { label: 'Week 4', value: totalIncome * 0.25 },
    ];
  };

  // Calculate performance metrics
  const getPerformanceMetrics = () => {
    const revenuePerEmployee =
      totalDepartmentRevenue / (departmentRevenue.length || 1);
    const avgDealSize =
      totalDepartmentRevenue / (dateFilteredDepartmentReceivables.length || 1);
    const conversionRate =
      (dateFilteredDepartmentReceivables.filter(
        (item) => item.status === 'paid'
      ).length /
        (dateFilteredDepartmentReceivables.length || 1)) *
      100;
    const collectionEfficiency =
      (paidReceivables / (totalReceivables || 1)) * 100;

    return {
      revenue: [
        {
          label: 'Revenue/Employee',
          value: `$${revenuePerEmployee.toLocaleString()}`,
        },
        { label: 'Avg Deal Size', value: `$${avgDealSize.toLocaleString()}` },
        { label: 'Conversion Rate', value: `${conversionRate.toFixed(1)}%` },
        {
          label: 'Collection Rate',
          value: `${collectionEfficiency.toFixed(1)}%`,
        },
      ],
      efficiency: [
        {
          label: 'Profit Margin',
          value: `${totalIncome > 0 ? ((netCashFlow / totalIncome) * 100).toFixed(1) : '0'}%`,
        },
        {
          label: 'Commission Rate',
          value: `${totalDepartmentRevenue > 0 ? ((totalCommissionsPaid / totalDepartmentRevenue) * 100).toFixed(1) : '0'}%`,
        },
        {
          label: 'Payroll Efficiency',
          value: `${totalIncome > 0 ? ((totalPayrollCost / totalIncome) * 100).toFixed(1) : '0'}%`,
        },
        {
          label: 'Operating Ratio',
          value: `${totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : '0'}%`,
        },
      ],
      growth: [
        { label: 'Revenue Growth', value: '+12.5%' }, // Mock data
        { label: 'Client Growth', value: '+8.3%' }, // Mock data
        { label: 'Efficiency Gain', value: '+15.2%' }, // Mock data
        { label: 'Margin Improvement', value: '+3.8%' }, // Mock data
      ],
    };
  };

  const performanceMetrics = getPerformanceMetrics();

  // Integration service functions
  const connectQuickBooks = async () => {
    try {
      // Mock QuickBooks OAuth flow
      setIntegrations((prev) => ({
        ...prev,
        quickbooks: {
          ...prev.quickbooks,
          connected: true,
          enabled: true,
          companyId: 'QB_COMPANY_123456789',
          lastSync: new Date().toISOString(),
        },
      }));
      alert(
        '✅ QuickBooks connected successfully! Invoice and expense sync is now available.'
      );
    } catch (error) {
      alert('❌ QuickBooks connection failed. Please try again.');
    }
  };

  const connectSquare = async () => {
    try {
      // Mock Square OAuth flow
      setIntegrations((prev) => ({
        ...prev,
        square: {
          ...prev.square,
          connected: true,
          enabled: true,
          applicationId: 'SQ_APP_123456789',
          locationId: 'LOC_123456789',
          lastSync: new Date().toISOString(),
        },
      }));
      alert(
        '✅ Square connected successfully! Payment processing is now available.'
      );
    } catch (error) {
      alert('❌ Square connection failed. Please try again.');
    }
  };

  const syncWithQuickBooks = async () => {
    if (!integrations.quickbooks.connected) {
      alert('Please connect QuickBooks first.');
      return;
    }

    try {
      // Mock sync process
      const invoicesCount = dateFilteredReceivables.length;
      const expensesCount = dateFilteredPayables.length;

      setIntegrations((prev) => ({
        ...prev,
        quickbooks: {
          ...prev.quickbooks,
          lastSync: new Date().toISOString(),
        },
      }));

      alert(
        `✅ QuickBooks sync completed!\n📄 ${invoicesCount} invoices synced\n💰 ${expensesCount} expenses synced`
      );
    } catch (error) {
      alert('❌ QuickBooks sync failed. Please try again.');
    }
  };

  const processSquarePayment = async (amount, description) => {
    if (!integrations.square.connected) {
      alert('Please connect Square first.');
      return;
    }

    try {
      // Mock Square payment processing
      const paymentId = `SQ_PAY_${Date.now()}`;
      alert(
        `✅ Square payment processed!\n💳 Amount: $${amount.toLocaleString()}\n🔗 Payment ID: ${paymentId}\n📝 Description: ${description}`
      );
      return { success: true, paymentId, amount };
    } catch (error) {
      alert('❌ Square payment processing failed. Please try again.');
      return { success: false, error };
    }
  };

  // Export functionality
  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',')
              ? `"${value}"`
              : value;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `${filename}_${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportToPDF = (title, data) => {
    // Mock PDF export - in real app would use jsPDF or similar
    const printContent = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p>Period: ${formatDateRange()}</p>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <p>Total Records: ${data.length}</p>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  };

  const renderDashboard = () => (
    <div>
      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
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
              height: '2px',
              background: '#22c55e',
            }}
          />
          <h3
            style={{
              color: '#22c55e',
              margin: '0 0 10px 0',
              fontSize: '1.1rem',
            }}
          >
            💰 Total Revenue (Period)
          </h3>
          <p
            style={{
              color: 'white',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              margin: '0 0 8px 0',
            }}
          >
            ${totalIncome.toLocaleString()}
          </p>
          <div
            style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Receivables: ${totalReceivables.toLocaleString()}
            <br />
            Dept Revenue: ${totalDepartmentRevenue.toLocaleString()}
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
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
              height: '2px',
              background: '#f59e0b',
            }}
          />
          <h3
            style={{
              color: '#f59e0b',
              margin: '0 0 10px 0',
              fontSize: '1.1rem',
            }}
          >
            💳 Total Expenses (Period)
          </h3>
          <p
            style={{
              color: 'white',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              margin: '0 0 8px 0',
            }}
          >
            ${totalExpenses.toLocaleString()}
          </p>
          <div
            style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Payables: ${totalPayables.toLocaleString()}
            <br />
            Payroll: ${totalPayrollCost.toLocaleString()}
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
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
              height: '2px',
              background: '#ef4444',
            }}
          />
          <h3
            style={{
              color: '#3b82f6',
              margin: '0 0 10px 0',
              fontSize: '1.1rem',
            }}
          >
            📊 Net Profit (Period)
          </h3>
          <p
            style={{
              color: netCashFlow >= 0 ? '#22c55e' : '#ef4444',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              margin: '0 0 8px 0',
            }}
          >
            ${netCashFlow.toLocaleString()}
          </p>
          <div
            style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Margin:{' '}
            {totalIncome > 0
              ? ((netCashFlow / totalIncome) * 100).toFixed(1)
              : '0'}
            %<br />
            Commissions: ${totalCommissionsPaid.toLocaleString()}
          </div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
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
              height: '2px',
              background: 'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6)',
            }}
          />
          <h3
            style={{
              color: 'white',
              margin: '0 0 10px 0',
              fontSize: '1.1rem',
            }}
          >
            📈 Cash Flow Analysis
          </h3>
          <div style={{ color: 'white', fontSize: '0.95rem' }}>
            <div style={{ marginBottom: '6px' }}>
              <strong>Paid/Collected:</strong> $
              {(paidReceivables + paidPayables).toLocaleString()}
            </div>
            <div style={{ marginBottom: '6px' }}>
              <strong>Pending:</strong> $
              {(pendingReceivables + pendingPayables).toLocaleString()}
            </div>
            <div
              style={{ color: overdueReceivables > 0 ? '#ef4444' : '#22c55e' }}
            >
              <strong>Overdue:</strong> ${overdueReceivables.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Cost Center Analysis */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h3
          style={{ color: 'white', margin: '0 0 20px 0', fontSize: '1.3rem' }}
        >
          🏢 Cost Center Budget Analysis
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
          }}
        >
          {costCenters.map((center) => {
            const utilization = (center.spent / center.budget) * 100;
            return (
              <div
                key={center.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div
                  style={{
                    color: 'white',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  {center.name}
                </div>
                <div
                  style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '8px',
                  }}
                >
                  Budget: ${center.budget.toLocaleString()} | Spent: $
                  {center.spent.toLocaleString()}
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(utilization, 100)}%`,
                      height: '100%',
                      background:
                        utilization > 90
                          ? '#ef4444'
                          : utilization > 75
                            ? '#f59e0b'
                            : '#22c55e',
                      borderRadius: '4px',
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'white',
                    marginTop: '4px',
                  }}
                >
                  {utilization.toFixed(1)}% utilized
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Charts Section */}
      {showCharts && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <h3
            style={{ color: 'white', margin: '0 0 24px 0', fontSize: '1.3rem' }}
          >
            📈 Financial Analytics Dashboard
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '24px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  margin: '0 0 16px 0',
                  fontSize: '1.1rem',
                }}
              >
                💰 Revenue by Department
              </h4>
              <SimpleChart
                data={getRevenueChartData()}
                type='bar'
                width={300}
                height={200}
                color='#22c55e'
              />
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  margin: '0 0 16px 0',
                  fontSize: '1.1rem',
                }}
              >
                💳 Commission Distribution
              </h4>
              <SimpleChart
                data={getCommissionChartData()}
                type='bar'
                width={300}
                height={200}
                color='#ef4444'
              />
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  margin: '0 0 16px 0',
                  fontSize: '1.1rem',
                }}
              >
                📈 Revenue Trend
              </h4>
              <SimpleChart
                data={getTrendChartData()}
                type='line'
                width={300}
                height={200}
                color='#3b82f6'
              />
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h3
          style={{ color: 'white', margin: '0 0 24px 0', fontSize: '1.3rem' }}
        >
          🎯 Performance Intelligence Dashboard
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          <PerformanceMetrics
            title='💰 Revenue Metrics'
            metrics={performanceMetrics.revenue}
            color='#22c55e'
          />
          <PerformanceMetrics
            title='⚡ Efficiency Metrics'
            metrics={performanceMetrics.efficiency}
            color='#3b82f6'
          />
          <PerformanceMetrics
            title='📈 Growth Metrics'
            metrics={performanceMetrics.growth}
            color='#8b5cf6'
          />
        </div>
      </div>

      {/* Department Revenue Analysis */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h3
          style={{ color: 'white', margin: '0 0 20px 0', fontSize: '1.3rem' }}
        >
          🏢 Department Revenue Performance
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {departmentRevenue.map((dept) => {
            const profitMargin =
              dept.totalRevenue > 0
                ? (dept.netRevenue / dept.totalRevenue) * 100
                : 0;
            return (
              <div
                key={dept.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: `2px solid ${dept.color}30`,
                  borderLeft: `4px solid ${dept.color}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: dept.color,
                      marginRight: '8px',
                    }}
                  />
                  <div
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '1.1rem',
                    }}
                  >
                    {dept.name}
                  </div>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '1.4rem',
                      fontWeight: 'bold',
                    }}
                  >
                    ${dept.totalRevenue.toLocaleString()}
                  </div>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Total Revenue
                  </div>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div>
                    <div style={{ color: '#ef4444', fontWeight: '600' }}>
                      ${dept.totalCommissions.toLocaleString()}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      Commissions
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#22c55e', fontWeight: '600' }}>
                      ${dept.netRevenue.toLocaleString()}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      Net Revenue
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {dept.transactionCount} transactions
                  </div>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color:
                        profitMargin > 70
                          ? '#22c55e'
                          : profitMargin > 50
                            ? '#f59e0b'
                            : '#ef4444',
                    }}
                  >
                    {profitMargin.toFixed(1)}% margin
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderDepartmentRevenue = () => (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '140px 180px 1fr 120px 120px 120px 100px 100px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
          fontWeight: '700',
          color: 'white',
          fontSize: '0.9rem',
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div>Invoice ID</div>
        <div>Department</div>
        <div>Employee / Client</div>
        <div>Total Amount</div>
        <div>Commission</div>
        <div>Net Revenue</div>
        <div>Status</div>
        <div>Actions</div>
      </div>
      {dateFilteredDepartmentReceivables.map((item, index) => {
        const dept = departments.find((d) => d.id === item.departmentCode);
        return (
          <div
            key={item.id}
            style={{
              display: 'grid',
              gridTemplateColumns:
                '140px 180px 1fr 120px 120px 120px 100px 100px',
              padding: '20px',
              borderTop:
                index > 0 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
              color: 'white',
              fontSize: '0.9rem',
              alignItems: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ fontWeight: '500', color: '#60a5fa' }}>
              {item.invoiceId}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: dept?.color || '#6b7280',
                  marginRight: '6px',
                }}
              />
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                  {item.department}
                </div>
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  {item.revenueType.replace('_', ' ')}
                </div>
              </div>
            </div>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                {item.employeeName}
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {item.clientName}
              </div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                {item.description}
              </div>
            </div>
            <div style={{ fontWeight: '600', color: '#22c55e' }}>
              ${item.amount.toLocaleString()}
            </div>
            <div style={{ fontWeight: '600', color: '#ef4444' }}>
              ${item.commission.toLocaleString()}
            </div>
            <div style={{ fontWeight: '600', color: '#10b981' }}>
              ${item.netRevenue.toLocaleString()}
            </div>
            <div>
              <span
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  background: getStatusBg(item.status),
                  color: getStatusColor(item.status),
                  textTransform: 'capitalize',
                }}
              >
                {item.status}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.2s ease',
                }}
                title='View Details'
              >
                👁️
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderPayroll = () => (
    <div>
      {/* Commission-Only Structure Notice */}
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))',
          backdropFilter: 'blur(20px)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          boxShadow: '0 4px 16px rgba(245, 158, 11, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '24px' }}>💼</div>
          <div>
            <div
              style={{
                color: '#f59e0b',
                fontWeight: '600',
                fontSize: '1rem',
                marginBottom: '4px',
              }}
            >
              Commission-Only Structure
            </div>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}
            >
              Sales, Brokers, and Dispatchers are currently commission-only
              until the full employment system is implemented. Base salaries
              shown as $0 reflect this contractor-based compensation model.
            </div>
          </div>
        </div>
      </div>

      {/* Process New Payroll Section */}
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.05))',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        <h3
          style={{
            color: '#22c55e',
            margin: '0 0 16px 0',
            fontSize: '1.1rem',
            fontWeight: '600',
          }}
        >
          🎯 Process New Payroll
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          <div>
            <label
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              Pay Period Start
            </label>
            <input
              type='date'
              id='payPeriodStart'
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '0.9rem',
              }}
              defaultValue={
                new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0]
              }
            />
          </div>
          <div>
            <label
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              Pay Period End
            </label>
            <input
              type='date'
              id='payPeriodEnd'
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '0.9rem',
              }}
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              Pay Date
            </label>
            <input
              type='date'
              id='payDate'
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '0.9rem',
              }}
              defaultValue={
                new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0]
              }
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onClick={async () => {
              try {
                const payPeriodStart = (
                  document.getElementById('payPeriodStart') as HTMLInputElement
                ).value;
                const payPeriodEnd = (
                  document.getElementById('payPeriodEnd') as HTMLInputElement
                ).value;
                const payDate = (
                  document.getElementById('payDate') as HTMLInputElement
                ).value;

                const response = await fetch('/api/payroll/wave', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: 'process-payroll',
                    payrollData: {
                      payPeriodStart,
                      payPeriodEnd,
                      payDate,
                      employees: [
                        { employeeId: 'emp_001', hoursWorked: 80 },
                        { employeeId: 'emp_002', hoursWorked: 80 },
                        { employeeId: 'emp_003', hoursWorked: 80 },
                      ],
                    },
                  }),
                });
                const result = await response.json();
                if (result.success) {
                  alert(
                    `✅ Payroll processed successfully!\\n\\nTotal Gross Pay: $${result.payrollRun.totalGrossPay.toFixed(2)}\\nTotal Taxes: $${result.payrollRun.totalTaxes.toFixed(2)}\\nTotal Net Pay: $${result.payrollRun.totalNetPay.toFixed(2)}\\n\\nEmployees: ${result.payrollRun.employees.length}`
                  );
                } else {
                  alert(`❌ Error: ${result.error}`);
                }
              } catch (error) {
                alert('❌ Failed to process payroll');
                console.error('Payroll processing error:', error);
              }
            }}
          >
            ⚡ Process Payroll
          </button>
          <button
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onClick={async () => {
              try {
                const response = await fetch(
                  '/api/payroll/wave?action=employees'
                );
                const result = await response.json();
                if (result.success) {
                  alert(
                    `👥 Current Employees (${result.employees.length}):\\n\\n${result.employees.map((e) => `• ${e.firstName} ${e.lastName}\\n  Job: ${e.jobTitle}\\n  Pay: $${e.payRate}/${e.payType}\\n  Status: ${e.isActive ? 'Active' : 'Inactive'}`).join('\\n\\n')}`
                  );
                }
              } catch (error) {
                alert('❌ Failed to fetch employees');
              }
            }}
          >
            👥 View Employees
          </button>
          <button
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onClick={async () => {
              try {
                const response = await fetch(
                  '/api/payroll/wave?action=history&limit=5'
                );
                const result = await response.json();
                if (result.success) {
                  alert(
                    `📊 Recent Payroll Runs (${result.history.length}):\\n\\n${result.history.map((h) => `• Period: ${h.payPeriodStart} to ${h.payPeriodEnd}\\n  Pay Date: ${h.payDate}\\n  Total Net: $${h.totalNetPay.toFixed(2)}\\n  Status: ${h.status.toUpperCase()}`).join('\\n\\n')}`
                  );
                }
              } catch (error) {
                alert('❌ Failed to fetch payroll history');
              }
            }}
          >
            📊 Payroll History
          </button>
        </div>
      </div>

      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '140px 180px 120px 120px 120px 120px 120px 100px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            fontWeight: '700',
            color: 'white',
            fontSize: '0.9rem',
            borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div>Employee ID</div>
          <div>Employee / Department</div>
          <div>Base Salary</div>
          <div>Commission</div>
          <div>Gross Pay</div>
          <div>Deductions</div>
          <div>Net Pay</div>
          <div>Status</div>
        </div>
        {dateFilteredPayroll.map((item, index) => {
          const dept = departments.find((d) => d.id === item.departmentCode);
          return (
            <div
              key={item.id}
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '140px 180px 120px 120px 120px 120px 120px 100px',
                padding: '20px',
                borderTop:
                  index > 0 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                color: 'white',
                fontSize: '0.9rem',
                alignItems: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontWeight: '500', color: '#60a5fa' }}>
                {item.employeeId}
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: dept?.color || '#6b7280',
                    marginRight: '6px',
                  }}
                />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                    {item.employeeName}
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    {item.position}
                  </div>
                </div>
              </div>
              <div style={{ fontWeight: '600' }}>
                ${item.baseSalary.toLocaleString()}
              </div>
              <div style={{ fontWeight: '600', color: '#22c55e' }}>
                ${item.commissionEarned.toLocaleString()}
              </div>
              <div style={{ fontWeight: '600', color: '#3b82f6' }}>
                ${item.grossPay.toLocaleString()}
              </div>
              <div style={{ fontWeight: '600', color: '#ef4444' }}>
                ${item.totalDeductions.toLocaleString()}
              </div>
              <div style={{ fontWeight: '600', color: '#10b981' }}>
                ${item.netPay.toLocaleString()}
              </div>
              <div>
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    background:
                      item.status === 'processed'
                        ? 'rgba(34, 197, 94, 0.1)'
                        : 'rgba(245, 158, 11, 0.1)',
                    color: item.status === 'processed' ? '#22c55e' : '#f59e0b',
                    textTransform: 'capitalize',
                  }}
                >
                  {item.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderReceivables = () => (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '140px 1fr 120px 100px 120px 120px 100px 100px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
          fontWeight: '700',
          color: 'white',
          fontSize: '0.9rem',
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div>Invoice ID</div>
        <div>Client / Description</div>
        <div>Amount</div>
        <div>Status</div>
        <div>Issue Date</div>
        <div>Due Date</div>
        <div>Aging</div>
        <div>Actions</div>
      </div>
      {dateFilteredReceivables.map((item, index) => (
        <div
          key={item.id}
          style={{
            display: 'grid',
            gridTemplateColumns:
              '140px 1fr 120px 100px 120px 120px 100px 100px',
            padding: '20px',
            borderTop:
              index > 0 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
            color: 'white',
            fontSize: '0.9rem',
            alignItems: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ fontWeight: '500', color: '#60a5fa' }}>
            {item.invoiceId}
          </div>
          <div>
            <div style={{ fontWeight: '600', marginBottom: '2px' }}>
              {item.clientName}
            </div>
            <div
              style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              {item.description}
            </div>
            <div
              style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}
            >
              GL: {item.glAccount} | {item.costCenter}
            </div>
          </div>
          <div style={{ fontWeight: '600' }}>
            ${item.amount.toLocaleString()}
          </div>
          <div>
            <span
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: '500',
                background: getStatusBg(item.status),
                color: getStatusColor(item.status),
                textTransform: 'capitalize',
              }}
            >
              {item.status}
            </span>
          </div>
          <div>{item.issueDate}</div>
          <div
            style={{ color: item.status === 'overdue' ? '#ef4444' : 'white' }}
          >
            {item.dueDate}
          </div>
          <div style={{ color: item.aging > 30 ? '#ef4444' : 'white' }}>
            {item.aging} days
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.2s ease',
              }}
              title='View Details'
            >
              👁️
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPayables = () => (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '140px 1fr 120px 100px 120px 120px 100px 100px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
          fontWeight: '700',
          color: 'white',
          fontSize: '0.9rem',
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div>Invoice #</div>
        <div>Vendor / Description</div>
        <div>Amount</div>
        <div>Status</div>
        <div>Received</div>
        <div>Due Date</div>
        <div>PO Number</div>
        <div>Actions</div>
      </div>
      {dateFilteredPayables.map((item, index) => (
        <div
          key={item.id}
          style={{
            display: 'grid',
            gridTemplateColumns:
              '140px 1fr 120px 100px 120px 120px 100px 100px',
            padding: '20px',
            borderTop:
              index > 0 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
            color: 'white',
            fontSize: '0.9rem',
            alignItems: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ fontWeight: '500', color: '#60a5fa' }}>
            {item.invoiceNumber}
          </div>
          <div>
            <div style={{ fontWeight: '600', marginBottom: '2px' }}>
              {item.vendorName}
            </div>
            <div
              style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              {item.description}
            </div>
            <div
              style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}
            >
              GL: {item.glAccount} | {item.costCenter}
            </div>
          </div>
          <div style={{ fontWeight: '600' }}>
            ${item.amount.toLocaleString()}
          </div>
          <div>
            <span
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: '500',
                background: getStatusBg(item.status),
                color: getStatusColor(item.status),
                textTransform: 'capitalize',
              }}
            >
              {item.status}
            </span>
          </div>
          <div>{item.receiveDate}</div>
          <div style={{ color: item.aging > 30 ? '#ef4444' : 'white' }}>
            {item.dueDate}
          </div>
          <div style={{ fontSize: '0.8rem' }}>{item.poNumber}</div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                transition: 'all 0.2s ease',
              }}
              title='Approve'
            >
              ✓
            </button>
          </div>
        </div>
      ))}
    </div>
  );

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
        {/* Header */}
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
                <span style={{ fontSize: '32px' }}>🧾</span>
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
                  🧾 FLEETFLOW™ FINANCIAL MANAGEMENT COMMAND
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
                    Comprehensive Accounts Payable & Receivable Intelligence
                    Platform
                    <br />
                    <span
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      Period: {formatDateRange()}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                💰 Net Cash Flow: ${netCashFlow.toLocaleString()} ($
                {formatDateRange()})
              </div>
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#3b82f6',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                }}
              >
                📊 Projected: ${projectedCashFlow.toLocaleString()}
              </div>
              <button
                onClick={() => setShowCharts(!showCharts)}
                style={{
                  background: showCharts
                    ? 'rgba(139, 92, 246, 0.2)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: showCharts ? '#8b5cf6' : 'rgba(255, 255, 255, 0.7)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                📈 {showCharts ? 'Hide' : 'Show'} Charts
              </button>
              <button
                onClick={() => setComparisonMode(!comparisonMode)}
                style={{
                  background: comparisonMode
                    ? 'rgba(245, 158, 11, 0.2)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: comparisonMode
                    ? '#f59e0b'
                    : 'rgba(255, 255, 255, 0.7)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                🔄 Compare Periods
              </button>
              <NotificationBell notifications={notifications} />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '8px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
            { id: 'accounts', label: '💰 Accounts P&L', icon: '💰' },
            {
              id: 'department_revenue',
              label: '🏢 Department Revenue',
              icon: '🏢',
            },
            { id: 'payroll', label: '👥 Payroll Management', icon: '👥' },
            { id: 'aging', label: '⏰ Aging Report', icon: '⏰' },
            { id: 'audit', label: '🔍 Audit Trail', icon: '🔍' },
            { id: 'analytics', label: '📈 Analytics', icon: '📈' },
            { id: 'integrations', label: '🔗 Integrations', icon: '🔗' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                background:
                  activeTab === tab.id
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    : 'transparent',
                color:
                  activeTab === tab.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                fontWeight: activeTab === tab.id ? '600' : '500',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
                boxShadow:
                  activeTab === tab.id
                    ? '0 4px 16px rgba(59, 130, 246, 0.3)'
                    : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters Section */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <label
              style={{ color: 'white', marginRight: '10px', fontWeight: '500' }}
            >
              Date Range:
            </label>
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                const today = new Date();
                const year = today.getFullYear();
                const month = today.getMonth();

                switch (e.target.value) {
                  case 'current_month':
                    setStartDate(
                      `${year}-${String(month + 1).padStart(2, '0')}-01`
                    );
                    setEndDate(
                      `${year}-${String(month + 1).padStart(2, '0')}-31`
                    );
                    break;
                  case 'last_month':
                    const lastMonth = month === 0 ? 11 : month - 1;
                    const lastMonthYear = month === 0 ? year - 1 : year;
                    setStartDate(
                      `${lastMonthYear}-${String(lastMonth + 1).padStart(2, '0')}-01`
                    );
                    setEndDate(
                      `${lastMonthYear}-${String(lastMonth + 1).padStart(2, '0')}-31`
                    );
                    break;
                  case 'current_quarter':
                    const quarterStart = Math.floor(month / 3) * 3;
                    setStartDate(
                      `${year}-${String(quarterStart + 1).padStart(2, '0')}-01`
                    );
                    setEndDate(
                      `${year}-${String(quarterStart + 3).padStart(2, '0')}-31`
                    );
                    break;
                  case 'year_to_date':
                    setStartDate(`${year}-01-01`);
                    setEndDate(`${year}-12-31`);
                    break;
                  case 'custom':
                    // Keep current dates for custom
                    break;
                }
              }}
              style={{
                padding: '10px 15px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                fontSize: '0.9rem',
                backdropFilter: 'blur(10px)',
              }}
            >
              <option value='current_month'>Current Month</option>
              <option value='last_month'>Last Month</option>
              <option value='current_quarter'>Current Quarter</option>
              <option value='year_to_date'>Year to Date</option>
              <option value='custom'>Custom Range</option>
            </select>
          </div>
          {dateRange === 'custom' && (
            <>
              <div>
                <label
                  style={{
                    color: 'white',
                    marginRight: '10px',
                    fontWeight: '500',
                  }}
                >
                  Start Date:
                </label>
                <input
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    padding: '10px 15px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '0.9rem',
                    backdropFilter: 'blur(10px)',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    color: 'white',
                    marginRight: '10px',
                    fontWeight: '500',
                  }}
                >
                  End Date:
                </label>
                <input
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    padding: '10px 15px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '0.9rem',
                    backdropFilter: 'blur(10px)',
                  }}
                />
              </div>
            </>
          )}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => {
                const today = new Date();
                const sevenDaysAgo = new Date(
                  today.getTime() - 7 * 24 * 60 * 60 * 1000
                );
                setStartDate(sevenDaysAgo.toISOString().split('T')[0]);
                setEndDate(today.toISOString().split('T')[0]);
                setDateRange('custom');
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => {
                const today = new Date();
                const thirtyDaysAgo = new Date(
                  today.getTime() - 30 * 24 * 60 * 60 * 1000
                );
                setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
                setEndDate(today.toISOString().split('T')[0]);
                setDateRange('custom');
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => {
                const today = new Date();
                const ninetyDaysAgo = new Date(
                  today.getTime() - 90 * 24 * 60 * 60 * 1000
                );
                setStartDate(ninetyDaysAgo.toISOString().split('T')[0]);
                setEndDate(today.toISOString().split('T')[0]);
                setDateRange('custom');
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Last 90 Days
            </button>
          </div>
          {comparisonMode && (
            <div
              style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                marginTop: '16px',
                padding: '16px',
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.2)',
              }}
            >
              <div>
                <label
                  style={{
                    color: '#f59e0b',
                    marginRight: '10px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                  }}
                >
                  Compare To - Start:
                </label>
                <input
                  type='date'
                  value={comparisonStartDate}
                  onChange={(e) => setComparisonStartDate(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    background: 'rgba(245, 158, 11, 0.1)',
                    color: 'white',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    color: '#f59e0b',
                    marginRight: '10px',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                  }}
                >
                  End:
                </label>
                <input
                  type='date'
                  value={comparisonEndDate}
                  onChange={(e) => setComparisonEndDate(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    background: 'rgba(245, 158, 11, 0.1)',
                    color: 'white',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
            </div>
          )}
          <div>
            <label
              style={{ color: 'white', marginRight: '10px', fontWeight: '500' }}
            >
              Status:
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: '10px 15px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                fontSize: '0.9rem',
                backdropFilter: 'blur(10px)',
              }}
            >
              <option value='all'>All Status</option>
              <option value='paid'>Paid</option>
              <option value='pending'>Pending</option>
              <option value='overdue'>Overdue</option>
              <option value='approved'>Approved</option>
              <option value='draft'>Draft</option>
            </select>
          </div>
          <div>
            <label
              style={{ color: 'white', marginRight: '10px', fontWeight: '500' }}
            >
              Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '10px 15px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                fontSize: '0.9rem',
                backdropFilter: 'blur(10px)',
              }}
            >
              <option value='all'>All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{ color: 'white', marginRight: '10px', fontWeight: '500' }}
            >
              Cost Center:
            </label>
            <select
              value={selectedCostCenter}
              onChange={(e) => setSelectedCostCenter(e.target.value)}
              style={{
                padding: '10px 15px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                fontSize: '0.9rem',
                backdropFilter: 'blur(10px)',
              }}
            >
              <option value='all'>All Cost Centers</option>
              {costCenters.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              style={{ color: 'white', marginRight: '10px', fontWeight: '500' }}
            >
              Department:
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              style={{
                padding: '10px 15px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                fontSize: '0.9rem',
                backdropFilter: 'blur(10px)',
              }}
            >
              <option value='all'>All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ position: 'relative' }}>
              <input
                type='text'
                placeholder='Search by client, vendor, invoice, or description...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  paddingRight: '50px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '0.9rem',
                  backdropFilter: 'blur(10px)',
                }}
              />
              <button
                onClick={() => setAdvancedSearch(!advancedSearch)}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: advancedSearch
                    ? '#3b82f6'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                🔍
              </button>
            </div>
            {advancedSearch && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '16px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '10px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '12px',
                }}
              >
                <input
                  type='number'
                  placeholder='Min Amount'
                  value={searchFilters.minAmount}
                  onChange={(e) =>
                    setSearchFilters({
                      ...searchFilters,
                      minAmount: e.target.value,
                    })
                  }
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: 'white',
                    fontSize: '0.8rem',
                  }}
                />
                <input
                  type='number'
                  placeholder='Max Amount'
                  value={searchFilters.maxAmount}
                  onChange={(e) =>
                    setSearchFilters({
                      ...searchFilters,
                      maxAmount: e.target.value,
                    })
                  }
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: 'white',
                    fontSize: '0.8rem',
                  }}
                />
                <input
                  type='text'
                  placeholder='Client Name'
                  value={searchFilters.client}
                  onChange={(e) =>
                    setSearchFilters({
                      ...searchFilters,
                      client: e.target.value,
                    })
                  }
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: 'white',
                    fontSize: '0.8rem',
                  }}
                />
                <input
                  type='text'
                  placeholder='Employee Name'
                  value={searchFilters.employee}
                  onChange={(e) =>
                    setSearchFilters({
                      ...searchFilters,
                      employee: e.target.value,
                    })
                  }
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: 'white',
                    fontSize: '0.8rem',
                  }}
                />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() =>
                exportToCSV(
                  dateFilteredDepartmentReceivables,
                  'department_revenue'
                )
              }
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.9rem',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
              }}
            >
              📄 Export CSV
            </button>
            <button
              onClick={() =>
                exportToPDF(
                  'Financial Report',
                  dateFilteredDepartmentReceivables
                )
              }
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.9rem',
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)',
              }}
            >
              📝 Export PDF
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'accounts' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2
                style={{
                  color: 'white',
                  margin: '0 0 20px 0',
                  fontSize: '1.5rem',
                }}
              >
                💰 Accounts Receivable & Payable ({formatDateRange()})
              </h2>
            </div>
            <div style={{ marginBottom: '32px' }}>
              <h3
                style={{
                  color: '#22c55e',
                  margin: '0 0 16px 0',
                  fontSize: '1.3rem',
                }}
              >
                📈 Accounts Receivable
              </h3>
              {renderReceivables()}
            </div>
            <div>
              <h3
                style={{
                  color: '#ef4444',
                  margin: '0 0 16px 0',
                  fontSize: '1.3rem',
                }}
              >
                📉 Accounts Payable
              </h3>
              {renderPayables()}
            </div>
          </div>
        )}
        {activeTab === 'department_revenue' && (
          <div>
            <div
              style={{
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h2 style={{ color: 'white', margin: '0', fontSize: '1.5rem' }}>
                🏢 Department Revenue Analysis ({formatDateRange()})
              </h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() =>
                    exportToCSV(
                      applyAdvancedSearch(dateFilteredDepartmentReceivables),
                      'department_revenue_filtered'
                    )
                  }
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#10b981',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  📄 Export Filtered
                </button>
              </div>
            </div>

            {/* Employee Performance Leaderboard */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  margin: '0 0 20px 0',
                  fontSize: '1.3rem',
                }}
              >
                🏆 Employee Performance Leaderboard
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '16px',
                }}
              >
                {[
                  {
                    name: 'Mike Wilson',
                    dept: 'Broker',
                    revenue: 56450,
                    commission: 14980,
                    deals: 3,
                    rank: 1,
                    trend: '+15%',
                  },
                  {
                    name: 'Sarah Johnson',
                    dept: 'Dispatcher',
                    revenue: 37100,
                    commission: 4045,
                    deals: 3,
                    rank: 2,
                    trend: '+8%',
                  },
                  {
                    name: 'John Davis',
                    dept: 'Dispatcher',
                    revenue: 14200,
                    commission: 1420,
                    deals: 1,
                    rank: 3,
                    trend: '+12%',
                  },
                ].map((employee, index) => (
                  <div
                    key={index}
                    style={{
                      background:
                        index === 0
                          ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 193, 7, 0.1))'
                          : 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '20px',
                      border:
                        index === 0
                          ? '2px solid #ffc107'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                      position: 'relative',
                    }}
                  >
                    {index === 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-10px',
                          right: '10px',
                          background: '#ffc107',
                          color: '#000',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                        }}
                      >
                        🏆 TOP PERFORMER
                      </div>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '1.1rem',
                          }}
                        >
                          {employee.name}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.9rem',
                          }}
                        >
                          {employee.dept} Operations
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            color: '#22c55e',
                            fontWeight: '600',
                            fontSize: '1.2rem',
                          }}
                        >
                          #{employee.rank}
                        </div>
                        <div
                          style={{
                            color: employee.trend.startsWith('+')
                              ? '#22c55e'
                              : '#ef4444',
                            fontSize: '0.8rem',
                          }}
                        >
                          {employee.trend}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                        marginBottom: '12px',
                      }}
                    >
                      <div>
                        <div style={{ color: '#3b82f6', fontWeight: '600' }}>
                          ${employee.revenue.toLocaleString()}
                        </div>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          Total Revenue
                        </div>
                      </div>
                      <div>
                        <div style={{ color: '#ef4444', fontWeight: '600' }}>
                          ${employee.commission.toLocaleString()}
                        </div>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          Commission
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.9rem',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        {employee.deals} deals closed
                      </div>
                      <div
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          color: '#8b5cf6',
                        }}
                      >
                        ${(employee.revenue / employee.deals).toLocaleString()}
                        /deal
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1))',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)',
              }}
            >
              <h3
                style={{
                  color: '#8b5cf6',
                  margin: '0 0 20px 0',
                  fontSize: '1.3rem',
                }}
              >
                🤖 AI-Powered Insights & Recommendations
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                  }}
                >
                  <div
                    style={{
                      color: '#22c55e',
                      fontWeight: '600',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    ✅ Opportunity Detected
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '0.9rem',
                      marginBottom: '8px',
                    }}
                  >
                    AI Flow leads showing 23% higher conversion rate than
                    traditional methods
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.8rem',
                    }}
                  >
                    Recommendation: Increase AI Flow lead allocation by 15%
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                  }}
                >
                  <div
                    style={{
                      color: '#f59e0b',
                      fontWeight: '600',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    ⚠️ Performance Alert
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '0.9rem',
                      marginBottom: '8px',
                    }}
                  >
                    Dispatcher commission rates below industry average (12% vs
                    15%)
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.8rem',
                    }}
                  >
                    Recommendation: Consider performance-based tier adjustments
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <div
                    style={{
                      color: '#3b82f6',
                      fontWeight: '600',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    📈 Growth Prediction
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '0.9rem',
                      marginBottom: '8px',
                    }}
                  >
                    Current trajectory suggests 18% revenue growth next quarter
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.8rem',
                    }}
                  >
                    Confidence: 87% based on historical patterns
                  </div>
                </div>
              </div>
            </div>

            {renderDepartmentRevenue()}
          </div>
        )}
        {activeTab === 'payroll' && renderPayroll()}
        {activeTab === 'aging' && (
          <div>
            <h2
              style={{
                color: 'white',
                margin: '0 0 24px 0',
                fontSize: '1.5rem',
              }}
            >
              ⏰ Aging Analysis Report ({formatDateRange()})
            </h2>

            {/* Aging Summary */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderLeft: '4px solid #22c55e',
                }}
              >
                <h4 style={{ color: '#22c55e', margin: '0 0 12px 0' }}>
                  Current (0-30 days)
                </h4>
                <div
                  style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  ${aging30.toLocaleString()}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                  }}
                >
                  {Math.round((aging30 / (aging30 + aging60 + aging90)) * 100)}%
                  of total
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderLeft: '4px solid #f59e0b',
                }}
              >
                <h4 style={{ color: '#f59e0b', margin: '0 0 12px 0' }}>
                  30-60 days
                </h4>
                <div
                  style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  ${aging60.toLocaleString()}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                  }}
                >
                  {Math.round((aging60 / (aging30 + aging60 + aging90)) * 100)}%
                  of total
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderLeft: '4px solid #ef4444',
                }}
              >
                <h4 style={{ color: '#ef4444', margin: '0 0 12px 0' }}>
                  60+ days (Critical)
                </h4>
                <div
                  style={{
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  ${aging90.toLocaleString()}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                  }}
                >
                  {Math.round((aging90 / (aging30 + aging60 + aging90)) * 100)}%
                  of total
                </div>
              </div>
            </div>

            {/* Aging Chart */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  margin: '0 0 20px 0',
                  fontSize: '1.2rem',
                }}
              >
                Aging Distribution
              </h3>
              <SimpleChart
                data={[
                  { label: '0-30', value: aging30 },
                  { label: '31-60', value: aging60 },
                  { label: '60+', value: aging90 },
                ]}
                type='bar'
                width={600}
                height={300}
                color='#ef4444'
              />
            </div>
          </div>
        )}
        {activeTab === 'audit' && (
          <div>
            <h2
              style={{
                color: 'white',
                margin: '0 0 24px 0',
                fontSize: '1.5rem',
              }}
            >
              🔍 Comprehensive Audit Trail ({formatDateRange()})
            </h2>

            {/* Audit Summary */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  margin: '0 0 20px 0',
                  fontSize: '1.2rem',
                }}
              >
                Recent Activity
              </h3>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {[...dateFilteredDepartmentReceivables, ...dateFilteredPayables]
                  .flatMap((item) =>
                    item.auditTrail.map((audit) => ({
                      ...audit,
                      itemId: item.id,
                      itemType: item.clientName || item.vendorName,
                    }))
                  )
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .slice(0, 20)
                  .map((audit, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '12px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                          }}
                        >
                          {audit.action}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.8rem',
                          }}
                        >
                          {audit.itemType} - by {audit.user}
                        </div>
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: '0.8rem',
                        }}
                      >
                        {new Date(audit.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div>
            <h2
              style={{
                color: 'white',
                margin: '0 0 24px 0',
                fontSize: '1.5rem',
              }}
            >
              📈 Advanced Analytics Dashboard ({formatDateRange()})
            </h2>

            {/* Predictive Analytics */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <h3
                style={{
                  color: '#3b82f6',
                  margin: '0 0 20px 0',
                  fontSize: '1.3rem',
                }}
              >
                🔮 Predictive Analytics & Forecasting
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <h4
                    style={{
                      color: 'white',
                      margin: '0 0 12px 0',
                      fontSize: '1.1rem',
                    }}
                  >
                    Revenue Forecast
                  </h4>
                  <div
                    style={{
                      color: '#22c55e',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                    }}
                  >
                    ${(totalIncome * 1.18).toLocaleString()}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Next month (+18% projected)
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <h4
                    style={{
                      color: 'white',
                      margin: '0 0 12px 0',
                      fontSize: '1.1rem',
                    }}
                  >
                    Churn Risk
                  </h4>
                  <div
                    style={{
                      color: '#f59e0b',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                    }}
                  >
                    2.3%
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Client retention risk
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <h4
                    style={{
                      color: 'white',
                      margin: '0 0 12px 0',
                      fontSize: '1.1rem',
                    }}
                  >
                    Efficiency Score
                  </h4>
                  <div
                    style={{
                      color: '#8b5cf6',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                    }}
                  >
                    87.2%
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Operational efficiency
                  </div>
                </div>
              </div>
            </div>

            {/* Trend Analysis */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  margin: '0 0 20px 0',
                  fontSize: '1.2rem',
                }}
              >
                Revenue Trend Analysis
              </h3>
              <SimpleChart
                data={getTrendChartData()}
                type='line'
                width={800}
                height={350}
                color='#22c55e'
              />
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div>
            <h2
              style={{
                color: 'white',
                margin: '0 0 24px 0',
                fontSize: '1.5rem',
              }}
            >
              🔗 Third-Party Integrations ({formatDateRange()})
            </h2>

            {/* Integration Status Overview */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '24px',
                marginBottom: '32px',
              }}
            >
              {/* QuickBooks Integration */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: `2px solid ${integrations.quickbooks.connected ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        background: integrations.quickbooks.connected
                          ? '#22c55e'
                          : 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                      }}
                    >
                      📊
                    </div>
                    <div>
                      <h3
                        style={{
                          color: 'white',
                          margin: '0',
                          fontSize: '1.2rem',
                        }}
                      >
                        QuickBooks Online
                      </h3>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          margin: '4px 0 0 0',
                          fontSize: '0.9rem',
                        }}
                      >
                        Accounting & Financial Management
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      background: integrations.quickbooks.connected
                        ? 'rgba(34, 197, 94, 0.2)'
                        : 'rgba(239, 68, 68, 0.2)',
                      color: integrations.quickbooks.connected
                        ? '#22c55e'
                        : '#ef4444',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                    }}
                  >
                    {integrations.quickbooks.connected
                      ? '✅ Connected'
                      : '❌ Disconnected'}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                          marginBottom: '4px',
                        }}
                      >
                        Invoice Sync
                      </div>
                      <div
                        style={{
                          color: integrations.quickbooks.syncInvoices
                            ? '#22c55e'
                            : '#ef4444',
                          fontWeight: '600',
                        }}
                      >
                        {integrations.quickbooks.syncInvoices
                          ? 'Enabled'
                          : 'Disabled'}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                          marginBottom: '4px',
                        }}
                      >
                        Expense Sync
                      </div>
                      <div
                        style={{
                          color: integrations.quickbooks.syncExpenses
                            ? '#22c55e'
                            : '#ef4444',
                          fontWeight: '600',
                        }}
                      >
                        {integrations.quickbooks.syncExpenses
                          ? 'Enabled'
                          : 'Disabled'}
                      </div>
                    </div>
                  </div>
                  {integrations.quickbooks.connected && (
                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                          marginBottom: '4px',
                        }}
                      >
                        Last Sync
                      </div>
                      <div style={{ color: 'white', fontSize: '0.9rem' }}>
                        {integrations.quickbooks.lastSync
                          ? new Date(
                              integrations.quickbooks.lastSync
                            ).toLocaleString()
                          : 'Never'}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {!integrations.quickbooks.connected ? (
                    <button
                      onClick={connectQuickBooks}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      🔗 Connect QuickBooks
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={syncWithQuickBooks}
                        style={{
                          flex: 1,
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          background:
                            'linear-gradient(135deg, #3b82f6, #2563eb)',
                          color: 'white',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                        }}
                      >
                        🔄 Sync Now
                      </button>
                      <button
                        onClick={() =>
                          setIntegrations((prev) => ({
                            ...prev,
                            quickbooks: {
                              ...prev.quickbooks,
                              connected: false,
                              enabled: false,
                            },
                          }))
                        }
                        style={{
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                        }}
                      >
                        ❌
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Square Integration */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: `2px solid ${integrations.square.connected ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        background: integrations.square.connected
                          ? '#22c55e'
                          : 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                      }}
                    >
                      💳
                    </div>
                    <div>
                      <h3
                        style={{
                          color: 'white',
                          margin: '0',
                          fontSize: '1.2rem',
                        }}
                      >
                        Square Payments
                      </h3>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          margin: '4px 0 0 0',
                          fontSize: '0.9rem',
                        }}
                      >
                        Payment Processing & POS
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      background: integrations.square.connected
                        ? 'rgba(34, 197, 94, 0.2)'
                        : 'rgba(239, 68, 68, 0.2)',
                      color: integrations.square.connected
                        ? '#22c55e'
                        : '#ef4444',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                    }}
                  >
                    {integrations.square.connected
                      ? '✅ Connected'
                      : '❌ Disconnected'}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                          marginBottom: '4px',
                        }}
                      >
                        Environment
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontWeight: '600',
                          textTransform: 'capitalize',
                        }}
                      >
                        {integrations.square.environment}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                          marginBottom: '4px',
                        }}
                      >
                        Status
                      </div>
                      <div
                        style={{
                          color: integrations.square.connected
                            ? '#22c55e'
                            : '#ef4444',
                          fontWeight: '600',
                        }}
                      >
                        {integrations.square.connected ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                  {integrations.square.connected && (
                    <div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '0.8rem',
                          marginBottom: '4px',
                        }}
                      >
                        Location ID
                      </div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '0.9rem',
                          fontFamily: 'monospace',
                        }}
                      >
                        {integrations.square.locationId}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {!integrations.square.connected ? (
                    <button
                      onClick={connectSquare}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      🔗 Connect Square
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          processSquarePayment(1250, 'Test Payment')
                        }
                        style={{
                          flex: 1,
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          background:
                            'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                          color: 'white',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                        }}
                      >
                        💳 Test Payment
                      </button>
                      <button
                        onClick={() =>
                          setIntegrations((prev) => ({
                            ...prev,
                            square: {
                              ...prev.square,
                              connected: false,
                              enabled: false,
                            },
                          }))
                        }
                        style={{
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                        }}
                      >
                        ❌
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Integration Analytics */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  margin: '0 0 20px 0',
                  fontSize: '1.3rem',
                }}
              >
                📊 Integration Performance Metrics
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                  }}
                >
                  <div
                    style={{
                      color: '#22c55e',
                      fontSize: '1.8rem',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                    }}
                  >
                    {integrations.quickbooks.connected
                      ? dateFilteredReceivables.length
                      : 0}
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '0.9rem',
                      marginBottom: '4px',
                    }}
                  >
                    QuickBooks Invoices
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.8rem',
                    }}
                  >
                    Ready for sync
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                  }}
                >
                  <div
                    style={{
                      color: '#8b5cf6',
                      fontSize: '1.8rem',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                    }}
                  >
                    {integrations.square.connected ? '$12,450' : '$0'}
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '0.9rem',
                      marginBottom: '4px',
                    }}
                  >
                    Square Payments
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.8rem',
                    }}
                  >
                    This month
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <div
                    style={{
                      color: '#3b82f6',
                      fontSize: '1.8rem',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                    }}
                  >
                    {integrations.quickbooks.connected &&
                    integrations.square.connected
                      ? '100%'
                      : integrations.quickbooks.connected ||
                          integrations.square.connected
                        ? '50%'
                        : '0%'}
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '0.9rem',
                      marginBottom: '4px',
                    }}
                  >
                    Integration Health
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.8rem',
                    }}
                  >
                    System connectivity
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                  }}
                >
                  <div
                    style={{
                      color: '#f59e0b',
                      fontSize: '1.8rem',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                    }}
                  >
                    2.3s
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '0.9rem',
                      marginBottom: '4px',
                    }}
                  >
                    Avg Response Time
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.8rem',
                    }}
                  >
                    API performance
                  </div>
                </div>
              </div>
            </div>

            {/* Coming Soon Integrations */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.05))',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)',
              }}
            >
              <h3
                style={{
                  color: '#8b5cf6',
                  margin: '0 0 20px 0',
                  fontSize: '1.3rem',
                }}
              >
                🚀 Coming Soon Integrations
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                }}
              >
                {[
                  {
                    name: 'Stripe Payments',
                    icon: '💰',
                    description: 'Advanced payment processing',
                  },
                  {
                    name: 'Xero Accounting',
                    icon: '📊',
                    description: 'Alternative accounting platform',
                  },
                  {
                    name: 'PayPal Business',
                    icon: '🌐',
                    description: 'Global payment solutions',
                  },
                  {
                    name: 'FreshBooks',
                    icon: '📋',
                    description: 'Invoice & expense tracking',
                  },
                  {
                    name: 'Sage Intacct',
                    icon: '🏢',
                    description: 'Enterprise financial management',
                  },
                  {
                    name: 'Wave Accounting',
                    icon: '🌊',
                    description: 'Small business accounting',
                  },
                ].map((integration, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px',
                      }}
                    >
                      <div style={{ fontSize: '24px' }}>{integration.icon}</div>
                      <div>
                        <div
                          style={{
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '1rem',
                          }}
                        >
                          {integration.name}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '0.8rem',
                          }}
                        >
                          {integration.description}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        color: '#8b5cf6',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        padding: '4px 8px',
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '12px',
                        textAlign: 'center',
                      }}
                    >
                      Coming Q2 2025
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI-Powered Quick Actions */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.05))',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={() => {
              // Mock new invoice creation
              alert('Creating new invoice with AI assistance...');
            }}
            style={{
              padding: '14px 28px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            🤖 AI New Invoice
          </button>
          <button
            onClick={() => {
              // Mock smart reporting
              exportToPDF(
                'AI-Generated Financial Report',
                dateFilteredDepartmentReceivables
              );
            }}
            style={{
              padding: '14px 28px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            📊 Smart Report
          </button>
          <button
            onClick={() => {
              // Mock automated reminders
              alert(
                `Sending automated payment reminders to ${overdueReceivables > 0 ? '1 overdue client' : 'all pending clients'}...`
              );
            }}
            style={{
              padding: '14px 28px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: '0 4px 16px rgba(6, 182, 212, 0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            📧 Auto Reminders
          </button>
          <button
            onClick={() => {
              // Mock predictive analysis
              alert('Generating predictive cash flow analysis...');
            }}
            style={{
              padding: '14px 28px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            🔮 Forecast
          </button>
          <button
            onClick={() => {
              // Mock anomaly detection
              alert('Running anomaly detection on financial data...');
            }}
            style={{
              padding: '14px 28px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.95rem',
              boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            🚨 Anomaly Check
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingInvoicesPage;
