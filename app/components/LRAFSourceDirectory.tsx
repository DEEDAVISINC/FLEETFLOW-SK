'use client';

import { ExternalLink, Search } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { LRAF_SOURCES, searchLRAFSources } from '../data/lraf-sources';

const LRAFSourceDirectory: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [transportOnly, setTransportOnly] = useState(false);
  const [sortBy, setSortBy] = useState<
    'agency' | 'priority' | 'category' | 'tier'
  >('priority');

  // Filter and sort sources
  const filteredSources = useMemo(() => {
    let results = LRAF_SOURCES;

    // Apply search
    if (searchQuery.trim()) {
      results = searchLRAFSources(searchQuery);
    }

    // Apply tier filter
    if (selectedTier !== 'all') {
      results = results.filter((source) => source.tier === selectedTier);
    }

    // Apply priority filter
    if (selectedPriority !== 'all') {
      results = results.filter(
        (source) => source.priority === selectedPriority
      );
    }

    // Apply transportation filter
    if (transportOnly) {
      results = results.filter((source) => source.transportationRelevant);
    }

    // Sort results
    results = [...results].sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'tier') {
        const tierOrder = { federal: 0, state: 1, local: 2, enterprise: 3 };
        return tierOrder[a.tier] - tierOrder[b.tier];
      } else if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      } else {
        return a.agency.localeCompare(b.agency);
      }
    });

    return results;
  }, [searchQuery, selectedTier, selectedPriority, transportOnly, sortBy]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '#ef4444';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#3b82f6';
      case 'low':
        return '#64748b';
      default:
        return '#64748b';
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'federal':
        return '#3b82f6';
      case 'state':
        return '#10b981';
      case 'local':
        return '#8b5cf6';
      case 'enterprise':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  // Stats
  const stats = useMemo(() => {
    return {
      total: filteredSources.length,
      federal: filteredSources.filter((s) => s.tier === 'federal').length,
      state: filteredSources.filter((s) => s.tier === 'state').length,
      local: filteredSources.filter((s) => s.tier === 'local').length,
      enterprise: filteredSources.filter((s) => s.tier === 'enterprise').length,
      critical: filteredSources.filter((s) => s.priority === 'critical').length,
      transportRelevant: filteredSources.filter((s) => s.transportationRelevant)
        .length,
    };
  }, [filteredSources]);

  return (
    <div>
      {/* Compact Header with Expand/Collapse */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          padding: '20px',
          cursor: 'pointer',
          marginBottom: isExpanded ? '20px' : '0',
          transition: 'all 0.3s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: 'white',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              📚 LRAF Source Directory
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#3b82f6',
                  background: 'rgba(59, 130, 246, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              >
                {stats.total} Sources
              </span>
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
              Browse 100+ Federal, State, Local & Enterprise LRAF pages
            </p>
          </div>

          {/* Stats Preview */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginRight: '16px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: '#3b82f6',
                }}
              >
                {stats.federal}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Federal
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: '#10b981',
                }}
              >
                {stats.state}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>State</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: '#8b5cf6',
                }}
              >
                {stats.local}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Local</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: '#f59e0b',
                }}
              >
                {stats.enterprise}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Enterprise
              </div>
            </div>
          </div>

          {/* Expand/Collapse Icon */}
          <div
            style={{
              fontSize: '1.5rem',
              color: '#3b82f6',
              transition: 'transform 0.3s',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            ▼
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          style={{
            marginBottom: '24px',
            animation: 'slideDown 0.3s ease-out',
          }}
        >
          {/* Compact Search and Filters */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            {/* Search Bar */}
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                }}
              />
              <input
                type='text'
                placeholder='Search agencies...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            {/* Compact Filters */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '0.85rem',
                }}
              >
                <option value='all'>All Tiers</option>
                <option value='federal'>Federal</option>
                <option value='state'>State</option>
                <option value='local'>Local</option>
                <option value='enterprise'>Enterprise</option>
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '0.85rem',
                }}
              >
                <option value='all'>All Priorities</option>
                <option value='critical'>Critical</option>
                <option value='high'>High</option>
                <option value='medium'>Medium</option>
                <option value='low'>Low</option>
              </select>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  background: transportOnly
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(15, 23, 42, 0.8)',
                  border: `1px solid ${transportOnly ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.3)'}`,
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                <input
                  type='checkbox'
                  checked={transportOnly}
                  onChange={(e) => setTransportOnly(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <span>🚛 Transport Only</span>
              </label>

              {(searchQuery ||
                selectedTier !== 'all' ||
                selectedPriority !== 'all' ||
                transportOnly) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTier('all');
                    setSelectedPriority('all');
                    setTransportOnly(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '6px',
                    color: '#ef4444',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Compact Results List */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '16px',
              maxHeight: '500px',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <span
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#94a3b8',
                }}
              >
                {filteredSources.length} Source
                {filteredSources.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Compact Source List */}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {filteredSources.map((source) => (
                <div
                  key={source.id}
                  style={{
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      'rgba(59, 130, 246, 0.5)';
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      'rgba(59, 130, 246, 0.2)';
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
                  }}
                >
                  {/* Left: Agency Info (Compact) */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '4px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {source.agency}
                      </span>
                      <span
                        style={{
                          padding: '2px 6px',
                          background: getTierBadgeColor(source.tier),
                          borderRadius: '3px',
                          fontSize: '0.65rem',
                          fontWeight: '600',
                          color: 'white',
                          textTransform: 'uppercase',
                        }}
                      >
                        {source.tier}
                      </span>
                      <span
                        style={{
                          padding: '2px 6px',
                          background: getPriorityColor(source.priority),
                          borderRadius: '3px',
                          fontSize: '0.65rem',
                          fontWeight: '600',
                          color: 'white',
                          textTransform: 'uppercase',
                        }}
                      >
                        {source.priority}
                      </span>
                      {source.transportationRelevant && (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            color: '#10b981',
                          }}
                        >
                          🚛
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#94a3b8',
                      }}
                    >
                      {source.agencyCode} • {source.category}
                    </div>
                  </div>

                  {/* Right: Visit Button */}
                  <a
                    href={source.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '8px 14px',
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      border: 'none',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Visit
                    <ExternalLink size={14} />
                  </a>
                </div>
              ))}

              {filteredSources.length === 0 && (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#64748b',
                  }}
                >
                  <p style={{ fontSize: '0.95rem', marginBottom: '8px' }}>
                    No sources found
                  </p>
                  <p style={{ fontSize: '0.85rem' }}>
                    Try adjusting your filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LRAFSourceDirectory;
