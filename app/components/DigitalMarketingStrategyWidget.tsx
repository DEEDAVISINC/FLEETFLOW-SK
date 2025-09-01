'use client';

import { useEffect, useState } from 'react';

interface MarketingCampaign {
  id: string;
  name: string;
  type: string;
  status: string;
  budget: string;
  spent: string;
  reach: number;
  engagement: string;
  conversions: number;
  roi: string;
  startDate: string;
  endDate: string;
  platforms: string[];
}

interface SocialMediaMetric {
  platform: string;
  followers: number;
  engagement: string;
  posts: number;
  reach: number;
  impressions: number;
  clicks: number;
  growth: string;
  status: string;
}

interface ContentPiece {
  id: string;
  title: string;
  type: string;
  status: string;
  publishDate: string;
  views: number;
  shares: number;
  engagement: string;
  author: string;
  platforms: string[];
}

interface SEOMetric {
  keyword: string;
  position: number;
  volume: number;
  difficulty: string;
  trend: string;
  traffic: number;
  conversions: number;
}

const DigitalMarketingStrategyWidget = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [socialMetrics, setSocialMetrics] = useState<SocialMediaMetric[]>([]);
  const [content, setContent] = useState<ContentPiece[]>([]);
  const [seoMetrics, setSeoMetrics] = useState<SEOMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketingData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/marketing/digital-strategy');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCampaigns(data.campaigns);
        setSocialMetrics(data.socialMetrics);
        setContent(data.content);
        setSeoMetrics(data.seoMetrics);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketingData();
  }, []);

  const tabs = [
    { id: 'campaigns', label: 'Digital Campaigns', icon: '🚀' },
    { id: 'social', label: 'Social Media', icon: '📱' },
    { id: 'content', label: 'Content Strategy', icon: '📝' },
    { id: 'seo', label: 'SEO & Analytics', icon: '📊' },
  ];

  if (loading) {
    return (
      <div
        style={{
          background: 'rgba(139, 92, 246, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '32px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 8px 32px rgba(76, 29, 149, 0.2)',
          margin: '24px 0',
          textAlign: 'center',
        }}
      >
        <div style={{ color: 'white', fontSize: '18px' }}>
          Loading Digital Marketing Strategy...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '32px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)',
          margin: '24px 0',
          textAlign: 'center',
        }}
      >
        <div style={{ color: '#ef4444', fontSize: '18px' }}>
          Error loading marketing data: {error}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(139, 92, 246, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '32px',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        boxShadow: '0 8px 32px rgba(76, 29, 149, 0.2)',
        margin: '24px 0',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 8px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            📈 Digital Marketing Strategy
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0,
            }}
          >
            Comprehensive online presence and digital marketing management
          </p>
        </div>
        <div
          style={{
            background: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            borderRadius: '12px',
            padding: '8px 16px',
            color: '#22c55e',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          ✅ Active
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '32px',
          background: 'rgba(139, 92, 246, 0.2)',
          borderRadius: '16px',
          padding: '8px',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              borderRadius: '12px',
              background:
                activeTab === tab.id
                  ? 'rgba(139, 92, 246, 0.4)'
                  : 'transparent',
              color:
                activeTab === tab.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ minHeight: '400px' }}>
        {activeTab === 'campaigns' && (
          <div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '24px',
              }}
            >
              🚀 Digital Marketing Campaigns
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '20px',
              }}
            >
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '16px',
                    padding: '24px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: 'white',
                          margin: '0 0 4px 0',
                        }}
                      >
                        {campaign.name}
                      </h4>
                      <p
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          margin: '0 0 8px 0',
                        }}
                      >
                        {campaign.type}
                      </p>
                    </div>
                    <div
                      style={{
                        background:
                          campaign.status === 'active'
                            ? 'rgba(34, 197, 94, 0.2)'
                            : campaign.status === 'paused'
                              ? 'rgba(251, 191, 36, 0.2)'
                              : 'rgba(156, 163, 175, 0.2)',
                        border: `1px solid ${
                          campaign.status === 'active'
                            ? 'rgba(34, 197, 94, 0.4)'
                            : campaign.status === 'paused'
                              ? 'rgba(251, 191, 36, 0.4)'
                              : 'rgba(156, 163, 175, 0.4)'
                        }`,
                        borderRadius: '8px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color:
                          campaign.status === 'active'
                            ? '#22c55e'
                            : campaign.status === 'paused'
                              ? '#fbbf24'
                              : '#9ca3af',
                      }}
                    >
                      {campaign.status.toUpperCase()}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: '0 0 4px 0',
                        }}
                      >
                        Budget / Spent
                      </p>
                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                          margin: 0,
                        }}
                      >
                        {campaign.budget} / {campaign.spent}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: '0 0 4px 0',
                        }}
                      >
                        ROI
                      </p>
                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#4ade80',
                          margin: 0,
                        }}
                      >
                        {campaign.roi}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: '0 0 4px 0',
                        }}
                      >
                        Reach
                      </p>
                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                          margin: 0,
                        }}
                      >
                        {campaign.reach.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: '0 0 4px 0',
                        }}
                      >
                        Conversions
                      </p>
                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#60a5fa',
                          margin: 0,
                        }}
                      >
                        {campaign.conversions}
                      </p>
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        margin: '0 0 8px 0',
                      }}
                    >
                      Platforms
                    </p>
                    <div
                      style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
                    >
                      {campaign.platforms.map((platform, index) => (
                        <span
                          key={index}
                          style={{
                            background: 'rgba(139, 92, 246, 0.3)',
                            border: '1px solid rgba(139, 92, 246, 0.5)',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            color: '#dbeafe',
                          }}
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    {campaign.startDate} - {campaign.endDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '24px',
              }}
            >
              📱 Social Media Performance
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '20px',
              }}
            >
              {socialMetrics.map((metric, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '16px',
                    padding: '24px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      {metric.platform === 'LinkedIn' && '💼'}
                      {metric.platform === 'Facebook' && '📘'}
                      {metric.platform === 'Twitter' && '🐦'}
                      {metric.platform === 'Instagram' && '📸'}
                      {metric.platform === 'YouTube' && '📺'}
                      {metric.platform}
                    </h4>
                    <div
                      style={{
                        background:
                          metric.status === 'growing'
                            ? 'rgba(34, 197, 94, 0.2)'
                            : metric.status === 'stable'
                              ? 'rgba(59, 130, 246, 0.2)'
                              : 'rgba(251, 191, 36, 0.2)',
                        border: `1px solid ${
                          metric.status === 'growing'
                            ? 'rgba(34, 197, 94, 0.4)'
                            : metric.status === 'stable'
                              ? 'rgba(59, 130, 246, 0.4)'
                              : 'rgba(251, 191, 36, 0.4)'
                        }`,
                        borderRadius: '8px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color:
                          metric.status === 'growing'
                            ? '#22c55e'
                            : metric.status === 'stable'
                              ? '#3b82f6'
                              : '#fbbf24',
                      }}
                    >
                      {metric.growth}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: '0 0 4px 0',
                        }}
                      >
                        Followers
                      </p>
                      <p
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: 'white',
                          margin: 0,
                        }}
                      >
                        {metric.followers.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: '0 0 4px 0',
                        }}
                      >
                        Engagement
                      </p>
                      <p
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#60a5fa',
                          margin: 0,
                        }}
                      >
                        {metric.engagement}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: '0 0 4px 0',
                        }}
                      >
                        Posts This Month
                      </p>
                      <p
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: 'white',
                          margin: 0,
                        }}
                      >
                        {metric.posts}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: '0 0 4px 0',
                        }}
                      >
                        Reach
                      </p>
                      <p
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#4ade80',
                          margin: 0,
                        }}
                      >
                        {metric.reach.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '24px',
              }}
            >
              📝 Content Marketing Strategy
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '20px',
              }}
            >
              {content.map((piece) => (
                <div
                  key={piece.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '16px',
                    padding: '24px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                          margin: '0 0 8px 0',
                          lineHeight: '1.4',
                        }}
                      >
                        {piece.title}
                      </h4>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '8px',
                        }}
                      >
                        <span
                          style={{
                            background: 'rgba(139, 92, 246, 0.3)',
                            border: '1px solid rgba(139, 92, 246, 0.5)',
                            borderRadius: '6px',
                            padding: '2px 8px',
                            fontSize: '12px',
                            color: '#dbeafe',
                          }}
                        >
                          {piece.type}
                        </span>
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          by {piece.author}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        background:
                          piece.status === 'published'
                            ? 'rgba(34, 197, 94, 0.2)'
                            : piece.status === 'draft'
                              ? 'rgba(251, 191, 36, 0.2)'
                              : 'rgba(59, 130, 246, 0.2)',
                        border: `1px solid ${
                          piece.status === 'published'
                            ? 'rgba(34, 197, 94, 0.4)'
                            : piece.status === 'draft'
                              ? 'rgba(251, 191, 36, 0.4)'
                              : 'rgba(59, 130, 246, 0.4)'
                        }`,
                        borderRadius: '8px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color:
                          piece.status === 'published'
                            ? '#22c55e'
                            : piece.status === 'draft'
                              ? '#fbbf24'
                              : '#3b82f6',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {piece.status.toUpperCase()}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: '0 0 4px 0',
                        }}
                      >
                        Views
                      </p>
                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                          margin: 0,
                        }}
                      >
                        {piece.views.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: '0 0 4px 0',
                        }}
                      >
                        Shares
                      </p>
                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#4ade80',
                          margin: 0,
                        }}
                      >
                        {piece.shares}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: '0 0 4px 0',
                        }}
                      >
                        Engagement
                      </p>
                      <p
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#60a5fa',
                          margin: 0,
                        }}
                      >
                        {piece.engagement}
                      </p>
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        margin: '0 0 8px 0',
                      }}
                    >
                      Published On
                    </p>
                    <div
                      style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
                    >
                      {piece.platforms.map((platform, index) => (
                        <span
                          key={index}
                          style={{
                            background: 'rgba(34, 197, 94, 0.2)',
                            border: '1px solid rgba(34, 197, 94, 0.4)',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            color: '#dbeafe',
                          }}
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    Published: {piece.publishDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '24px',
              }}
            >
              📊 SEO Performance & Analytics
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {seoMetrics.map((metric, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '16px',
                    padding: '20px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'white',
                        margin: 0,
                        flex: 1,
                      }}
                    >
                      ""{metric.keyword}""
                    </h4>
                    <div
                      style={{
                        background:
                          metric.trend === 'up'
                            ? 'rgba(34, 197, 94, 0.2)'
                            : metric.trend === 'down'
                              ? 'rgba(239, 68, 68, 0.2)'
                              : 'rgba(156, 163, 175, 0.2)',
                        border: `1px solid ${
                          metric.trend === 'up'
                            ? 'rgba(34, 197, 94, 0.4)'
                            : metric.trend === 'down'
                              ? 'rgba(239, 68, 68, 0.4)'
                              : 'rgba(156, 163, 175, 0.4)'
                        }`,
                        borderRadius: '8px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color:
                          metric.trend === 'up'
                            ? '#22c55e'
                            : metric.trend === 'down'
                              ? '#ef4444'
                              : '#9ca3af',
                      }}
                    >
                      {metric.trend === 'up'
                        ? '↗️'
                        : metric.trend === 'down'
                          ? '↘️'
                          : '→'}{' '}
                      {metric.trend.toUpperCase()}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: '0 0 4px 0',
                        }}
                      >
                        Position
                      </p>
                      <p
                        style={{
                          fontSize: '24px',
                          fontWeight: '700',
                          color:
                            metric.position <= 3
                              ? '#22c55e'
                              : metric.position <= 10
                                ? '#fbbf24'
                                : '#ef4444',
                          margin: 0,
                        }}
                      >
                        #{metric.position}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: '0 0 4px 0',
                        }}
                      >
                        Search Volume
                      </p>
                      <p
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: 'white',
                          margin: 0,
                        }}
                      >
                        {metric.volume.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: '0 0 4px 0',
                        }}
                      >
                        Monthly Traffic
                      </p>
                      <p
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#60a5fa',
                          margin: 0,
                        }}
                      >
                        {metric.traffic.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: '0 0 4px 0',
                        }}
                      >
                        Conversions
                      </p>
                      <p
                        style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#4ade80',
                          margin: 0,
                        }}
                      >
                        {metric.conversions}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        margin: '0 0 8px 0',
                      }}
                    >
                      Difficulty Level
                    </p>
                    <div
                      style={{
                        background:
                          metric.difficulty === 'low'
                            ? 'rgba(34, 197, 94, 0.2)'
                            : metric.difficulty === 'medium'
                              ? 'rgba(251, 191, 36, 0.2)'
                              : 'rgba(239, 68, 68, 0.2)',
                        border: `1px solid ${
                          metric.difficulty === 'low'
                            ? 'rgba(34, 197, 94, 0.4)'
                            : metric.difficulty === 'medium'
                              ? 'rgba(251, 191, 36, 0.4)'
                              : 'rgba(239, 68, 68, 0.4)'
                        }`,
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color:
                          metric.difficulty === 'low'
                            ? '#22c55e'
                            : metric.difficulty === 'medium'
                              ? '#fbbf24'
                              : '#ef4444',
                        textAlign: 'center',
                      }}
                    >
                      {metric.difficulty.toUpperCase()} DIFFICULTY
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalMarketingStrategyWidget;
