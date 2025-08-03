'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface ContractOpportunity {
  id: string;
  agency: string;
  title: string;
  description: string;
  amount: number;
  location: string;
  deadline: string;
  naicsCode: string;
  category: string;
  competitionLevel: 'Low' | 'Medium' | 'High';
  matchScore: number;
  status: 'Open' | 'Closing Soon' | 'Closed';
}

export default function GovernmentContractsPage() {
  const [contracts, setContracts] = useState<ContractOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [competitionFilter, setCompetitionFilter] = useState('');
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<keyof ContractOpportunity | ''>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadGovernmentContracts();
  }, []);

  const loadGovernmentContracts = async () => {
    try {
      setLoading(true);
      // Simulate loading government contract opportunities
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockContracts: ContractOpportunity[] = [
        {
          id: 'GSA-001',
          agency: 'General Services Administration',
          title: 'Transportation Services - Regional Distribution',
          description:
            'Comprehensive transportation and logistics services for federal distribution centers across the Southwest region.',
          amount: 2500000,
          location: 'Los Angeles, CA to Phoenix, AZ',
          deadline: '2025-02-15',
          naicsCode: '484121',
          category: 'Transportation',
          competitionLevel: 'Medium',
          matchScore: 92,
          status: 'Open',
        },
        {
          id: 'DOD-002',
          agency: 'Department of Defense',
          title: 'Military Equipment Transportation',
          description:
            'Specialized heavy-haul transportation for military equipment and vehicles between bases.',
          amount: 4200000,
          location: 'Various Military Bases',
          deadline: '2025-01-28',
          naicsCode: '484220',
          category: 'Specialized Transport',
          competitionLevel: 'High',
          matchScore: 87,
          status: 'Closing Soon',
        },
        {
          id: 'USPS-003',
          agency: 'United States Postal Service',
          title: 'Mail Transportation Services',
          description:
            'Regular mail and package transportation services for postal distribution network.',
          amount: 1800000,
          location: 'Southwest Regional Network',
          deadline: '2025-02-10',
          naicsCode: '484110',
          category: 'Mail Transport',
          competitionLevel: 'Low',
          matchScore: 95,
          status: 'Open',
        },
        {
          id: 'DHS-004',
          agency: 'Department of Homeland Security',
          title: 'Emergency Response Logistics',
          description:
            'Emergency transportation and logistics support for disaster response operations.',
          amount: 3100000,
          location: 'National Coverage Required',
          deadline: '2025-02-20',
          naicsCode: '484122',
          category: 'Emergency Services',
          competitionLevel: 'Medium',
          matchScore: 89,
          status: 'Open',
        },
        {
          id: 'VA-005',
          agency: 'Department of Veterans Affairs',
          title: 'Medical Supply Distribution',
          description:
            'Temperature-controlled transportation of medical supplies and pharmaceuticals.',
          amount: 1950000,
          location: 'Multi-state VA Network',
          deadline: '2025-01-25',
          naicsCode: '484220',
          category: 'Medical Transport',
          competitionLevel: 'High',
          matchScore: 91,
          status: 'Closing Soon',
        },
      ];

      setContracts(mockContracts);
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort contracts
  const filteredAndSortedContracts = React.useMemo(() => {
    let filtered = contracts.filter((contract) => {
      const matchesSearch =
        contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || contract.status === statusFilter;
      const matchesCompetition =
        !competitionFilter || contract.competitionLevel === competitionFilter;

      return matchesSearch && matchesStatus && matchesCompetition;
    });

    if (sortBy) {
      filtered.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (sortDirection === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    return filtered;
  }, [
    contracts,
    searchTerm,
    statusFilter,
    competitionFilter,
    sortBy,
    sortDirection,
  ]);

  const handleSort = (field: keyof ContractOpportunity) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const toggleContractSelection = (contractId: string) => {
    setSelectedContracts((prev) =>
      prev.includes(contractId)
        ? prev.filter((id) => id !== contractId)
        : [...prev, contractId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedContracts.length === filteredAndSortedContracts.length) {
      setSelectedContracts([]);
    } else {
      setSelectedContracts(filteredAndSortedContracts.map((c) => c.id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const SortIcon = ({ field }: { field: keyof ContractOpportunity }) => {
    if (sortBy !== field) return <span style={{ color: '#888' }}>↕️</span>;
    return sortDirection === 'asc' ? (
      <span style={{ color: '#2196F3' }}>↑</span>
    ) : (
      <span style={{ color: '#2196F3' }}>↓</span>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          background: `
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)
      `,
          backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
          backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(226, 232, 240, 0.9)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏛️</div>
          <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
            Loading Government Contracts...
          </div>
          <div style={{ fontSize: '1rem', opacity: 0.8 }}>
            Analyzing opportunities and competitive landscape
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: `
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)
      `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        minHeight: '100vh',
        color: 'rgba(226, 232, 240, 0.9)',
      }}
    >
      {/* Header with back navigation */}
      <div style={{ padding: '20px' }}>
        <Link href='/freightflow-rfx' style={{ textDecoration: 'none' }}>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'rgba(226, 232, 240, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              marginRight: '15px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ← Back to FreightFlow RFx℠
          </button>
        </Link>

        <Link href='/analytics' style={{ textDecoration: 'none' }}>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'rgba(226, 232, 240, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            📊 Full Analytics Dashboard
          </button>
        </Link>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px 40px 20px',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '30px',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '20px',
          }}
        >
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              margin: '0 0 10px 0',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            🏛️ Government Contract Intelligence
          </h1>
          <p
            style={{
              margin: 0,
              opacity: 0.9,
              fontSize: '1.1rem',
            }}
          >
            Strategic government contract opportunities with AI-powered
            competitive analysis and bidding insights
          </p>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '20px',
          }}
        >
          {[
            {
              label: 'Active Opportunities',
              value: contracts
                .filter((c) => c.status === 'Open')
                .length.toString(),
              color: '#10b981',
              icon: '📋',
            },
            {
              label: 'Total Value',
              value: formatCurrency(
                contracts.reduce((sum, c) => sum + c.amount, 0)
              ),
              color: '#3b82f6',
              icon: '💰',
            },
            {
              label: 'High Match Score',
              value: contracts
                .filter((c) => c.matchScore >= 90)
                .length.toString(),
              color: '#22c55e',
              icon: '🎯',
            },
            {
              label: 'Closing Soon',
              value: contracts
                .filter((c) => c.status === 'Closing Soon')
                .length.toString(),
              color: '#f59e0b',
              icon: '⏰',
            },
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '15px',
                padding: '20px',
                textAlign: 'center',
                border: `1px solid ${stat.color}40`,
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>
                {stat.icon}
              </div>
              <div
                style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: stat.color,
                  marginBottom: '5px',
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.8)',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px',
            color: 'rgba(226, 232, 240, 0.9)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <input
              type='text'
              placeholder='🔍 Search contracts, agencies, locations...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 15px',
                background: 'rgba(51, 65, 85, 0.6)',
                color: 'rgba(226, 232, 240, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                fontSize: '14px',
                width: '300px',
                outline: 'none',
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = 'rgba(59, 130, 246, 0.8)')
              }
              onBlur={(e) =>
                (e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)')
              }
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '10px 15px',
                background: 'rgba(51, 65, 85, 0.6)',
                color: 'rgba(226, 232, 240, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
            >
              <option value=''>All Status</option>
              <option value='Open'>Open</option>
              <option value='Closing Soon'>Closing Soon</option>
              <option value='Closed'>Closed</option>
            </select>
            <select
              value={competitionFilter}
              onChange={(e) => setCompetitionFilter(e.target.value)}
              style={{
                padding: '10px 15px',
                background: 'rgba(51, 65, 85, 0.6)',
                color: 'rgba(226, 232, 240, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
            >
              <option value=''>All Competition</option>
              <option value='Low'>Low Competition</option>
              <option value='Medium'>Medium Competition</option>
              <option value='High'>High Competition</option>
            </select>
            <span
              style={{ fontSize: '14px', color: 'rgba(226, 232, 240, 0.6)' }}
            >
              {filteredAndSortedContracts.length} of {contracts.length}{' '}
              contracts
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href='/freightflow-rfx' style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: '#8b5cf6',
                  color: 'rgba(226, 232, 240, 0.9)',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                🤖 AI Bid Assistant
              </button>
            </Link>
            <button
              style={{
                background: '#10b981',
                color: 'rgba(226, 232, 240, 0.9)',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              📊 Export Selected
            </button>
          </div>
        </div>

        {/* Contracts Table */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.9)',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '40px 180px 200px 120px 150px 100px 100px 80px 120px',
              background: 'rgba(51, 65, 85, 0.8)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '12px',
              fontWeight: '600',
              color: 'rgba(226, 232, 240, 0.9)',
            }}
          >
            <div
              style={{
                padding: '15px 10px',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
              }}
            >
              <input
                type='checkbox'
                checked={
                  selectedContracts.length ===
                    filteredAndSortedContracts.length &&
                  filteredAndSortedContracts.length > 0
                }
                onChange={toggleSelectAll}
                style={{ cursor: 'pointer' }}
              />
            </div>
            <div
              style={{
                padding: '15px 10px',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
              }}
              onClick={() => handleSort('agency')}
            >
              AGENCY <SortIcon field='agency' />
            </div>
            <div
              style={{
                padding: '15px 10px',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
              }}
              onClick={() => handleSort('title')}
            >
              CONTRACT TITLE <SortIcon field='title' />
            </div>
            <div
              style={{
                padding: '15px 10px',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
              }}
              onClick={() => handleSort('amount')}
            >
              VALUE <SortIcon field='amount' />
            </div>
            <div
              style={{
                padding: '15px 10px',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              LOCATION
            </div>
            <div
              style={{
                padding: '15px 10px',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
              }}
              onClick={() => handleSort('deadline')}
            >
              DEADLINE <SortIcon field='deadline' />
            </div>
            <div
              style={{
                padding: '15px 10px',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
              }}
              onClick={() => handleSort('competitionLevel')}
            >
              COMPETITION <SortIcon field='competitionLevel' />
            </div>
            <div
              style={{
                padding: '15px 10px',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
              }}
              onClick={() => handleSort('matchScore')}
            >
              MATCH <SortIcon field='matchScore' />
            </div>
            <div style={{ padding: '15px 10px', textAlign: 'center' }}>
              ACTIONS
            </div>
          </div>

          {/* Table Body */}
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {filteredAndSortedContracts.map((contract, index) => (
              <div
                key={contract.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '40px 180px 200px 120px 150px 100px 100px 80px 120px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor:
                    index % 2 === 0
                      ? 'rgba(51, 65, 85, 0.4)'
                      : 'rgba(51, 65, 85, 0.6)',
                  fontSize: '12px',
                  color: 'rgba(226, 232, 240, 0.9)',
                }}
              >
                <div
                  style={{
                    padding: '12px 10px',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center',
                  }}
                >
                  <input
                    type='checkbox'
                    checked={selectedContracts.includes(contract.id)}
                    onChange={() => toggleContractSelection(contract.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <div
                  style={{
                    padding: '12px 10px',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {contract.agency}
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(226, 232, 240, 0.6)',
                    }}
                  >
                    {contract.naicsCode}
                  </div>
                </div>
                <div
                  style={{
                    padding: '12px 10px',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {contract.title}
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(226, 232, 240, 0.6)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {contract.description}
                  </div>
                </div>
                <div
                  style={{
                    padding: '12px 10px',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                    fontWeight: '700',
                    color: '#10b981',
                  }}
                >
                  {formatCurrency(contract.amount)}
                </div>
                <div
                  style={{
                    padding: '12px 10px',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '11px',
                  }}
                >
                  {contract.location}
                </div>
                <div
                  style={{
                    padding: '12px 10px',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '11px',
                  }}
                >
                  <div
                    style={{
                      color:
                        contract.status === 'Closing Soon' ? '#f59e0b' : '#333',
                    }}
                  >
                    {contract.deadline}
                  </div>
                </div>
                <div
                  style={{
                    padding: '12px 10px',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span
                    style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      backgroundColor:
                        contract.competitionLevel === 'Low'
                          ? '#d4edda'
                          : contract.competitionLevel === 'Medium'
                            ? '#fff3cd'
                            : '#f8d7da',
                      color:
                        contract.competitionLevel === 'Low'
                          ? '#155724'
                          : contract.competitionLevel === 'Medium'
                            ? '#856404'
                            : '#721c24',
                    }}
                  >
                    {contract.competitionLevel}
                  </span>
                </div>
                <div
                  style={{
                    padding: '12px 10px',
                    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      backgroundColor:
                        contract.matchScore >= 90
                          ? '#d4edda'
                          : contract.matchScore >= 80
                            ? '#fff3cd'
                            : '#f8d7da',
                      color:
                        contract.matchScore >= 90
                          ? '#155724'
                          : contract.matchScore >= 80
                            ? '#856404'
                            : '#721c24',
                    }}
                  >
                    {contract.matchScore}%
                  </span>
                </div>
                <div style={{ padding: '12px 10px', textAlign: 'center' }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '4px',
                      justifyContent: 'center',
                    }}
                  >
                    <Link
                      href='/freightflow-rfx'
                      style={{ textDecoration: 'none' }}
                    >
                      <button
                        style={{
                          padding: '4px 8px',
                          background: '#8b5cf6',
                          color: 'rgba(226, 232, 240, 0.9)',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '10px',
                          cursor: 'pointer',
                          fontWeight: '600',
                        }}
                      >
                        Bid
                      </button>
                    </Link>
                    <button
                      style={{
                        padding: '4px 8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(226, 232, 240, 0.9)',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAndSortedContracts.length === 0 && (
            <div
              style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: 'rgba(226, 232, 240, 0.6)',
                fontSize: '16px',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏛️</div>
              <h3
                style={{
                  margin: '0 0 10px 0',
                  color: 'rgba(226, 232, 240, 0.9)',
                }}
              >
                No contracts found
              </h3>
              <p style={{ margin: 0 }}>
                {searchTerm
                  ? `No contracts match "${searchTerm}"`
                  : 'No contracts available'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div
          style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '14px',
            opacity: 0.9,
          }}
        >
          <div>
            Displaying {filteredAndSortedContracts.length} of {contracts.length}{' '}
            government contracts
          </div>
          <div>
            {selectedContracts.length > 0 &&
              `${selectedContracts.length} selected`}
          </div>
        </div>
      </div>
    </div>
  );
}
