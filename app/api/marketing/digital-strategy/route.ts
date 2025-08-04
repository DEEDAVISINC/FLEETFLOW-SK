import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const campaigns = [
      {
        id: 'campaign-001',
        name: 'FleetFlow Brand Awareness Q1 2025',
        type: 'Brand Awareness',
        status: 'active',
        budget: '$15,000',
        spent: '$8,750',
        reach: 125000,
        engagement: '4.2%',
        conversions: 387,
        roi: '285%',
        startDate: '2025-01-01',
        endDate: '2025-03-31',
        platforms: ['Google Ads', 'LinkedIn', 'Facebook'],
      },
      {
        id: 'campaign-002',
        name: 'Lead Generation - Transportation Companies',
        type: 'Lead Generation',
        status: 'active',
        budget: '$25,000',
        spent: '$18,200',
        reach: 89000,
        engagement: '6.8%',
        conversions: 542,
        roi: '420%',
        startDate: '2024-12-15',
        endDate: '2025-02-15',
        platforms: ['Google Ads', 'LinkedIn', 'Industry Publications'],
      },
      {
        id: 'campaign-003',
        name: 'Retargeting - Free Trial Users',
        type: 'Retargeting',
        status: 'active',
        budget: '$8,500',
        spent: '$6,100',
        reach: 45000,
        engagement: '8.1%',
        conversions: 298,
        roi: '340%',
        startDate: '2025-01-08',
        endDate: '2025-02-28',
        platforms: ['Facebook', 'Google Display', 'LinkedIn'],
      },
      {
        id: 'campaign-004',
        name: 'Content Marketing - Fleet Management Tips',
        type: 'Content Marketing',
        status: 'paused',
        budget: '$12,000',
        spent: '$4,800',
        reach: 67000,
        engagement: '5.4%',
        conversions: 156,
        roi: '180%',
        startDate: '2024-11-01',
        endDate: '2025-01-31',
        platforms: ['YouTube', 'LinkedIn', 'Industry Blogs'],
      },
      {
        id: 'campaign-005',
        name: 'Seasonal - Holiday Shipping Solutions',
        type: 'Seasonal',
        status: 'completed',
        budget: '$18,000',
        spent: '$17,850',
        reach: 156000,
        engagement: '7.2%',
        conversions: 724,
        roi: '465%',
        startDate: '2024-11-15',
        endDate: '2024-12-31',
        platforms: ['Google Ads', 'Facebook', 'Instagram', 'LinkedIn'],
      },
      {
        id: 'campaign-006',
        name: 'Webinar Series - AI in Transportation',
        type: 'Educational',
        status: 'active',
        budget: '$10,000',
        spent: '$3,200',
        reach: 34000,
        engagement: '12.5%',
        conversions: 189,
        roi: '220%',
        startDate: '2025-01-15',
        endDate: '2025-04-15',
        platforms: ['LinkedIn', 'Email Marketing', 'YouTube'],
      },
    ];

    const socialMetrics = [
      {
        platform: 'LinkedIn',
        followers: 28500,
        engagement: '6.8%',
        posts: 24,
        reach: 145000,
        impressions: 287000,
        clicks: 8940,
        growth: '+12.3%',
        status: 'growing',
      },
      {
        platform: 'Facebook',
        followers: 15200,
        engagement: '4.2%',
        posts: 18,
        reach: 89000,
        impressions: 156000,
        clicks: 4680,
        growth: '+8.7%',
        status: 'growing',
      },
      {
        platform: 'Twitter',
        followers: 12800,
        engagement: '3.9%',
        posts: 32,
        reach: 67000,
        impressions: 124000,
        clicks: 3850,
        growth: '+5.2%',
        status: 'stable',
      },
      {
        platform: 'Instagram',
        followers: 9600,
        engagement: '5.1%',
        posts: 16,
        reach: 45000,
        impressions: 78000,
        clicks: 2340,
        growth: '+15.8%',
        status: 'growing',
      },
      {
        platform: 'YouTube',
        followers: 6400,
        engagement: '8.3%',
        posts: 8,
        reach: 34000,
        impressions: 89000,
        clicks: 5670,
        growth: '+22.1%',
        status: 'growing',
      },
    ];

    const content = [
      {
        id: 'content-001',
        title: '10 Ways AI is Revolutionizing Fleet Management in 2025',
        type: 'Blog Post',
        status: 'published',
        publishDate: '2025-01-15',
        views: 8945,
        shares: 234,
        engagement: '6.2%',
        author: 'Sarah Chen',
        platforms: ['Website', 'LinkedIn', 'Medium'],
      },
      {
        id: 'content-002',
        title: 'Complete Guide to DOT Compliance for Small Carriers',
        type: 'eBook',
        status: 'published',
        publishDate: '2025-01-08',
        views: 15670,
        shares: 567,
        engagement: '8.9%',
        author: 'Michael Rodriguez',
        platforms: ['Website', 'LinkedIn', 'Email Campaign'],
      },
      {
        id: 'content-003',
        title: 'FleetFlow Demo: Route Optimization in Action',
        type: 'Video',
        status: 'published',
        publishDate: '2025-01-12',
        views: 12340,
        shares: 189,
        engagement: '7.4%',
        author: 'David Thompson',
        platforms: ['YouTube', 'LinkedIn', 'Website'],
      },
      {
        id: 'content-004',
        title: 'Fuel Cost Management Strategies for 2025',
        type: 'Webinar',
        status: 'scheduled',
        publishDate: '2025-01-25',
        views: 0,
        shares: 0,
        engagement: '0%',
        author: 'Lisa Park',
        platforms: ['Zoom', 'LinkedIn', 'Email Marketing'],
      },
      {
        id: 'content-005',
        title: 'Transportation Industry Trends Report Q1 2025',
        type: 'Report',
        status: 'draft',
        publishDate: '2025-02-01',
        views: 0,
        shares: 0,
        engagement: '0%',
        author: 'James Wilson',
        platforms: ['Website', 'LinkedIn', 'Industry Publications'],
      },
      {
        id: 'content-006',
        title: 'Customer Success Story: 40% Cost Reduction with FleetFlow',
        type: 'Case Study',
        status: 'published',
        publishDate: '2025-01-10',
        views: 6780,
        shares: 145,
        engagement: '5.8%',
        author: 'Emma Davis',
        platforms: ['Website', 'LinkedIn', 'Sales Materials'],
      },
    ];

    const seoMetrics = [
      {
        keyword: 'fleet management software',
        position: 3,
        volume: 18500,
        difficulty: 'high',
        trend: 'up',
        traffic: 4250,
        conversions: 127,
      },
      {
        keyword: 'transportation management system',
        position: 7,
        volume: 12800,
        difficulty: 'high',
        trend: 'up',
        traffic: 2890,
        conversions: 89,
      },
      {
        keyword: 'route optimization software',
        position: 2,
        volume: 9600,
        difficulty: 'medium',
        trend: 'stable',
        traffic: 3450,
        conversions: 156,
      },
      {
        keyword: 'DOT compliance software',
        position: 1,
        volume: 6400,
        difficulty: 'medium',
        trend: 'up',
        traffic: 2890,
        conversions: 234,
      },
      {
        keyword: 'freight broker software',
        position: 5,
        volume: 8900,
        difficulty: 'medium',
        trend: 'up',
        traffic: 2340,
        conversions: 78,
      },
      {
        keyword: 'trucking dispatch software',
        position: 4,
        volume: 7200,
        difficulty: 'medium',
        trend: 'stable',
        traffic: 1980,
        conversions: 92,
      },
      {
        keyword: 'fleet tracking system',
        position: 8,
        volume: 15600,
        difficulty: 'high',
        trend: 'down',
        traffic: 1560,
        conversions: 45,
      },
      {
        keyword: 'AI fleet management',
        position: 2,
        volume: 4800,
        difficulty: 'low',
        trend: 'up',
        traffic: 1890,
        conversions: 134,
      },
      {
        keyword: 'load board integration',
        position: 6,
        volume: 3200,
        difficulty: 'low',
        trend: 'stable',
        traffic: 890,
        conversions: 67,
      },
    ];

    return NextResponse.json({
      success: true,
      campaigns,
      socialMetrics,
      content,
      seoMetrics,
      summary: {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter((c) => c.status === 'active').length,
        totalBudget: campaigns.reduce((sum, c) => {
          const budget = parseFloat(c.budget.replace(/[$,]/g, ''));
          return sum + budget;
        }, 0),
        totalSpent: campaigns.reduce((sum, c) => {
          const spent = parseFloat(c.spent.replace(/[$,]/g, ''));
          return sum + spent;
        }, 0),
        averageROI:
          campaigns.reduce((sum, c) => {
            const roi = parseFloat(c.roi.replace('%', ''));
            return sum + roi;
          }, 0) / campaigns.length,
        totalFollowers: socialMetrics.reduce((sum, m) => sum + m.followers, 0),
        totalContent: content.length,
        publishedContent: content.filter((c) => c.status === 'published')
          .length,
        averagePosition:
          seoMetrics.reduce((sum, m) => sum + m.position, 0) /
          seoMetrics.length,
        totalTraffic: seoMetrics.reduce((sum, m) => sum + m.traffic, 0),
        totalConversions: seoMetrics.reduce((sum, m) => sum + m.conversions, 0),
      },
    });
  } catch (error) {
    console.error('Error in digital marketing strategy API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch digital marketing strategy data',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, type, data } = body;

    // Handle different marketing actions
    switch (action) {
      case 'create_campaign':
        // Logic to create new marketing campaign
        return NextResponse.json({
          success: true,
          message: 'Marketing campaign created successfully',
          campaignId: `campaign-${Date.now()}`,
        });

      case 'update_campaign':
        // Logic to update existing campaign
        return NextResponse.json({
          success: true,
          message: 'Marketing campaign updated successfully',
        });

      case 'schedule_content':
        // Logic to schedule content publication
        return NextResponse.json({
          success: true,
          message: 'Content scheduled successfully',
          contentId: `content-${Date.now()}`,
        });

      case 'update_seo_keywords':
        // Logic to update SEO keyword tracking
        return NextResponse.json({
          success: true,
          message: 'SEO keywords updated successfully',
        });

      case 'social_media_post':
        // Logic to schedule social media posts
        return NextResponse.json({
          success: true,
          message: 'Social media post scheduled successfully',
          postId: `post-${Date.now()}`,
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in digital marketing strategy POST:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process marketing action' },
      { status: 500 }
    );
  }
}
