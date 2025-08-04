'use client';

import {
  Building2,
  DollarSign,
  Edit,
  Mail,
  Phone,
  Plus,
  Save,
  Search,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

interface ServiceLead {
  id: string;
  leadId: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  serviceCategory: string;
  estimatedValue: number;
  urgency: string;
  painPoints: string[];
  notes: string;
  salesActivity: {
    status: string;
    assignedSalesRep: string;
    winProbability: number;
    nextAction: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function CRMLeadManager() {
  const [leads, setLeads] = useState<ServiceLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLead, setEditingLead] = useState<ServiceLead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    serviceCategory: 'Logistics_Services',
    estimatedValue: 0,
    urgency: 'Medium',
    painPoints: '',
    notes: '',
  });

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const response = await fetch(
        '/api/ai-flow/services-sales?tenantId=tenant-demo-123'
      );
      if (response.ok) {
        const data = await response.json();
        setLeads(data.data?.serviceLeads || []);
      }
    } catch (error) {
      console.error('Failed to load leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async () => {
    try {
      const response = await fetch('/api/ai-flow/services-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadData: {
            ...formData,
            painPoints: formData.painPoints.split(',').map((p) => p.trim()),
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setLeads([...leads, result.data.lead]);
        setShowAddForm(false);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to add lead:', error);
    }
  };

  const handleUpdateLead = async (leadId: string, updates: any) => {
    try {
      const response = await fetch('/api/ai-flow/services-sales', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, updates }),
      });

      if (response.ok) {
        const result = await response.json();
        setLeads(
          leads.map((lead) => (lead.id === leadId ? result.data.lead : lead))
        );
      }
    } catch (error) {
      console.error('Failed to update lead:', error);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const response = await fetch('/api/ai-flow/services-sales', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
      });

      if (response.ok) {
        setLeads(leads.filter((lead) => lead.id !== leadId));
      }
    } catch (error) {
      console.error('Failed to delete lead:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      serviceCategory: 'Logistics_Services',
      estimatedValue: 0,
      urgency: 'Medium',
      painPoints: '',
      notes: '',
    });
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' || lead.salesActivity.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      prospecting: 'bg-gray-100 text-gray-800',
      qualified: 'bg-blue-100 text-blue-800',
      proposal_sent: 'bg-yellow-100 text-yellow-800',
      negotiating: 'bg-purple-100 text-purple-800',
      closed_won: 'bg-green-100 text-green-800',
      closed_lost: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='text-gray-600'>Loading CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold text-gray-900'>
            🏢 CRM Lead Manager
          </h2>
          <p className='text-gray-600'>Manage your services sales pipeline</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
        >
          <Plus className='h-4 w-4' />
          Add New Lead
        </button>
      </div>

      {/* Search and Filters */}
      <div className='flex gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
          <input
            type='text'
            placeholder='Search companies or contacts...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10'
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className='rounded-lg border border-gray-300 px-4 py-2'
        >
          <option value='all'>All Status</option>
          <option value='prospecting'>Prospecting</option>
          <option value='qualified'>Qualified</option>
          <option value='proposal_sent'>Proposal Sent</option>
          <option value='negotiating'>Negotiating</option>
          <option value='closed_won'>Closed Won</option>
          <option value='closed_lost'>Closed Lost</option>
        </select>
      </div>

      {/* Add Lead Form Modal */}
      {showAddForm && (
        <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black'>
          <div className='w-full max-w-2xl rounded-lg bg-white p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-xl font-bold'>Add New Lead</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className='text-gray-400 hover:text-gray-600'
              >
                <X className='h-6 w-6' />
              </button>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Company Name
                </label>
                <input
                  type='text'
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className='mt-1 w-full rounded-lg border border-gray-300 px-3 py-2'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Contact Name
                </label>
                <input
                  type='text'
                  value={formData.contactName}
                  onChange={(e) =>
                    setFormData({ ...formData, contactName: e.target.value })
                  }
                  className='mt-1 w-full rounded-lg border border-gray-300 px-3 py-2'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Email
                </label>
                <input
                  type='email'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className='mt-1 w-full rounded-lg border border-gray-300 px-3 py-2'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Phone
                </label>
                <input
                  type='tel'
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className='mt-1 w-full rounded-lg border border-gray-300 px-3 py-2'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Service Category
                </label>
                <select
                  value={formData.serviceCategory}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      serviceCategory: e.target.value,
                    })
                  }
                  className='mt-1 w-full rounded-lg border border-gray-300 px-3 py-2'
                >
                  <option value='Logistics_Services'>Logistics Services</option>
                  <option value='Warehousing_Services'>
                    Warehousing Services
                  </option>
                  <option value='Dispatching_Services'>
                    Dispatching Services
                  </option>
                  <option value='Freight_Brokerage'>Freight Brokerage</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Estimated Value
                </label>
                <input
                  type='number'
                  value={formData.estimatedValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedValue: Number(e.target.value),
                    })
                  }
                  className='mt-1 w-full rounded-lg border border-gray-300 px-3 py-2'
                />
              </div>
              <div className='col-span-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Pain Points (comma separated)
                </label>
                <input
                  type='text'
                  value={formData.painPoints}
                  onChange={(e) =>
                    setFormData({ ...formData, painPoints: e.target.value })
                  }
                  placeholder='High costs, inefficiency, poor visibility'
                  className='mt-1 w-full rounded-lg border border-gray-300 px-3 py-2'
                />
              </div>
              <div className='col-span-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                  className='mt-1 w-full rounded-lg border border-gray-300 px-3 py-2'
                />
              </div>
            </div>

            <div className='mt-6 flex justify-end gap-3'>
              <button
                onClick={() => setShowAddForm(false)}
                className='px-4 py-2 text-gray-600 hover:text-gray-800'
              >
                Cancel
              </button>
              <button
                onClick={handleAddLead}
                className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
              >
                <Save className='h-4 w-4' />
                Save Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leads List */}
      <div className='grid gap-4'>
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className='transition-shadow hover:shadow-md'>
            <CardContent className='p-6'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='mb-2 flex items-center gap-3'>
                    <Building2 className='h-5 w-5 text-gray-400' />
                    <h3 className='text-lg font-semibold'>
                      {lead.companyName}
                    </h3>
                    <Badge
                      className={getStatusColor(lead.salesActivity.status)}
                    >
                      {lead.salesActivity.status
                        .replace('_', ' ')
                        .toUpperCase()}
                    </Badge>
                  </div>

                  <div className='grid grid-cols-2 gap-4 text-sm text-gray-600'>
                    <div className='flex items-center gap-2'>
                      <User className='h-4 w-4' />
                      {lead.contactName}
                    </div>
                    <div className='flex items-center gap-2'>
                      <Mail className='h-4 w-4' />
                      {lead.email}
                    </div>
                    <div className='flex items-center gap-2'>
                      <Phone className='h-4 w-4' />
                      {lead.phone}
                    </div>
                    <div className='flex items-center gap-2'>
                      <DollarSign className='h-4 w-4' />$
                      {lead.estimatedValue.toLocaleString()}
                    </div>
                  </div>

                  <div className='mt-3'>
                    <p className='text-sm text-gray-700'>{lead.notes}</p>
                  </div>

                  <div className='mt-3 text-xs text-gray-500'>
                    Next Action: {lead.salesActivity.nextAction}
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <div className='text-right'>
                    <div className='text-lg font-bold text-green-600'>
                      {lead.salesActivity.winProbability}%
                    </div>
                    <div className='text-xs text-gray-500'>Win Probability</div>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <button
                      onClick={() => setEditingLead(lead)}
                      className='p-2 text-gray-400 hover:text-blue-600'
                    >
                      <Edit className='h-4 w-4' />
                    </button>
                    <button
                      onClick={() => handleDeleteLead(lead.id)}
                      className='p-2 text-gray-400 hover:text-red-600'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className='py-12 text-center'>
          <Building2 className='mx-auto mb-4 h-16 w-16 text-gray-300' />
          <h3 className='mb-2 text-lg font-medium text-gray-900'>
            No leads found
          </h3>
          <p className='text-gray-500'>
            Add your first lead to get started with the CRM
          </p>
        </div>
      )}
    </div>
  );
}
