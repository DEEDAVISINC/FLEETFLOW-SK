import { NextResponse } from 'next/server';

export async function GET() {
  // Demo loads for carrier portal
  const loads = [
    {
      id: 'FL-2025-DEMO-001',
      brokerId: 'broker-001',
      brokerName: 'Global Freight Solutions',
      origin: 'Atlanta, GA',
      destination: 'Miami, FL',
      rate: 2450,
      distance: '647 mi',
      weight: '45,000 lbs',
      equipment: 'Dry Van',
      status: 'Available',
      pickupDate: '2025-01-02',
      deliveryDate: '2025-01-03',
      createdAt: '2024-12-30T10:00:00Z',
      updatedAt: '2024-12-30T10:00:00Z'
    },
    {
      id: 'FL-2025-DEMO-002',
      brokerId: 'broker-002',
      brokerName: 'Swift Freight',
      origin: 'Chicago, IL',
      destination: 'Houston, TX',
      rate: 3200,
      distance: '925 mi',
      weight: '38,500 lbs',
      equipment: 'Reefer',
      status: 'Available',
      pickupDate: '2025-01-03',
      deliveryDate: '2025-01-05',
      createdAt: '2024-12-30T09:15:00Z',
      updatedAt: '2024-12-30T14:30:00Z'
    },
    {
      id: 'FL-2025-DEMO-003',
      brokerId: 'broker-003',
      brokerName: 'Express Cargo',
      origin: 'Los Angeles, CA',
      destination: 'Seattle, WA',
      rate: 2800,
      distance: '1,135 mi',
      weight: '42,000 lbs',
      equipment: 'Dry Van',
      status: 'Available',
      pickupDate: '2025-01-04',
      deliveryDate: '2025-01-06',
      createdAt: '2024-12-31T08:00:00Z',
      updatedAt: '2024-12-31T08:00:00Z'
    }
  ];
  return NextResponse.json(loads);
} 