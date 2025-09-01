'use client';

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';
import { getCurrentUser } from '../../config/access';
import { useShipper } from '../../contexts/ShipperContext';
import { Shipper } from '../../types/shipper';

type SortField =
  | 'companyName'
  | 'totalLoads'
  | 'totalRevenue'
  | 'creditRating'
  | 'status'
  | 'joinDate';
type SortDirection = 'asc' | 'desc';

export default function ShipperDataTablePage() {
  const { shippers } = useShipper();
  const currentUser = getCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('companyName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [creditFilter, setCreditFilter] = useState<string>('');
  const [selectedShippers, setSelectedShippers] = useState<string[]>([]);

  // Filter shippers based on user role
  const filteredShippers = useMemo(() => {
    const filtered = shippers.filter((shipper: Shipper) => {
      // Role-based filtering
      if (currentUser.role === 'broker' && currentUser.brokerId) {
        if (shipper.assignedBrokerId !== currentUser.brokerId) return false;
      }

      // Search filter
      const searchMatch =
        shipper.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipper.contacts.some(
          (contact: any) =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        shipper.locations.some(
          (location: any) =>
            location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            location.state.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Status filter
      const statusMatch = !statusFilter || shipper.status === statusFilter;

      // Credit filter
      const creditMatch =
        !creditFilter || shipper.creditRating === creditFilter;

      return searchMatch && statusMatch && creditMatch;
    });

    // Sort
    filtered.sort((a: Shipper, b: Shipper) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'joinDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    shippers,
    currentUser,
    searchTerm,
    sortField,
    sortDirection,
    statusFilter,
    creditFilter,
  ]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectShipper = (shipperId: string) => {
    setSelectedShippers((prev) =>
      prev.includes(shipperId)
        ? prev.filter((id) => id !== shipperId)
        : [...prev, shipperId]
    );
  };

  const handleSelectAll = () => {
    if (selectedShippers.length === filteredShippers.length) {
      setSelectedShippers([]);
    } else {
      setSelectedShippers(filteredShippers.map((s: Shipper) => s.id));
    }
  };

  const exportToCSV = () => {
    const dataToExport =
      selectedShippers.length > 0
        ? filteredShippers.filter((s: Shipper) =>
            selectedShippers.includes(s.id)
          )
        : filteredShippers;

    const headers = [
      'Company Name',
      'Primary Contact',
      'Contact Email',
      'Contact Phone',
      'Contact Title',
      'Primary Location',
      'City',
      'State',
      'ZIP',
      'Assigned Broker',
      'Status',
      'Credit Rating',
      'Payment Terms',
      'Credit Limit',
      'Total Loads',
      'Total Revenue',
      'Average Rate',
      'Join Date',
      'Last Activity',
      'Tax ID',
      'MC Number',
      'Primary Commodity',
      'Freight Class',
      'Notes',
    ];

    const csvData = dataToExport.map((shipper: Shipper) => {
      const primaryContact =
        shipper.contacts.find((c: any) => c.isPrimary) || shipper.contacts[0];
      const primaryLocation = shipper.locations[0];
      const primaryCommodity = shipper.commodities[0];

      return [
        shipper.companyName,
        primaryContact?.name || '',
        primaryContact?.email || '',
        primaryContact?.phone || '',
        primaryContact?.title || '',
        primaryLocation?.name || '',
        primaryLocation?.city || '',
        primaryLocation?.state || '',
        primaryLocation?.zip || '',
        shipper.assignedBrokerName,
        shipper.status,
        shipper.creditRating,
        shipper.paymentTerms,
        shipper.creditLimit,
        shipper.totalLoads,
        shipper.totalRevenue,
        shipper.averageRate,
        new Date(shipper.joinDate).toLocaleDateString(),
        new Date(shipper.lastActivity).toLocaleDateString(),
        shipper.taxId,
        shipper.mcNumber || '',
        primaryCommodity?.name || '',
        primaryCommodity?.freightClass || '',
        shipper.notes || '',
      ];
    });

    const csvContent = [headers, ...csvData]
      .map((row: any[]) =>
        row
          .map((field: any) => `"${String(field).replace(/"/g, '"')}"`)
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `shippers_export_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    // This would integrate with a library like xlsx for proper Excel export
    // For now, we'll use CSV format but with .xlsx extension
    exportToCSV();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className='h-4 w-4' />
    ) : (
      <ChevronDownIcon className='h-4 w-4' />
    );
  };

  return (
    <div>
      <h1>Shippers Database</h1>
    </div>
  );
}
