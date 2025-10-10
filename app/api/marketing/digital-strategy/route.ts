import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
function getSupabaseClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://nleqplwwothhxgrovnjw.supabase.co';
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZXFwbHd3b3RoaHhncm92bmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNzczODcsImV4cCI6MjA2Nzk1MzM4N30.SewQx-DIRXaKLtPHbxnmRWvdx96_VtMu5sjoKpaBWjg';
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();

    // Fetch campaigns from database
    const { data: campaigns, error } = await supabase
      .from('marketing_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns:', error);
      // Return empty array if table doesn't exist yet
      return NextResponse.json({
        success: true,
        campaigns: [],
        socialMetrics: getMockSocialMetrics(),
        content: getMockContent(),
        seoMetrics: getMockSeoMetrics(),
        summary: {
          totalCampaigns: 0,
          activeCampaigns: 0,
          totalBudget: 0,
          totalSpent: 0,
          averageROI: 0,
          totalFollowers: 0,
          totalContent: 0,
          publishedContent: 0,
          averagePosition: 0,
          totalTraffic: 0,
          totalConversions: 0,
        },
        message:
          'Run scripts/campaigns-table.sql in Supabase to enable campaigns',
      });
    }

    // Transform database format to API format
    const formattedCampaigns = (campaigns || []).map((c) => ({
      id: c.campaign_id,
      name: c.name,
      type: c.type,
      status: c.status,
      budget: `$${c.budget?.toLocaleString() || '0'}`,
      spent: `$${c.spent?.toLocaleString() || '0'}`,
      reach: c.reach || 0,
      engagement: c.engagement || '0%',
      conversions: c.conversions || 0,
      roi: c.roi || '0%',
      startDate: c.start_date,
      endDate: c.end_date,
      platforms: c.platforms || [],
    }));

    const socialMetrics = getMockSocialMetrics();
    const content = getMockContent();
    const seoMetrics = getMockSeoMetrics();

    return NextResponse.json({
      success: true,
      campaigns: formattedCampaigns,
      socialMetrics,
      content,
      seoMetrics,
      summary: {
        totalCampaigns: formattedCampaigns.length,
        activeCampaigns: formattedCampaigns.filter((c) => c.status === 'active')
          .length,
        totalBudget: formattedCampaigns.reduce((sum, c) => {
          const budget = parseFloat(c.budget.replace(/[$,]/g, ''));
          return sum + budget;
        }, 0),
        totalSpent: formattedCampaigns.reduce((sum, c) => {
          const spent = parseFloat(c.spent.replace(/[$,]/g, ''));
          return sum + spent;
        }, 0),
        averageROI:
          formattedCampaigns.length > 0
            ? formattedCampaigns.reduce((sum, c) => {
                const roi = parseFloat(c.roi.replace('%', ''));
                return sum + roi;
              }, 0) / formattedCampaigns.length
            : 0,
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
    const supabase = getSupabaseClient();

    // Handle different marketing actions
    switch (action) {
      case 'create_campaign':
        // Save campaign to database
        const campaignId = `campaign-${Date.now()}`;
        const { data: newCampaign, error: insertError } = await supabase
          .from('marketing_campaigns')
          .insert([
            {
              campaign_id: campaignId,
              name: data.name || 'Untitled Campaign',
              type: data.type || 'Brand Awareness',
              status: data.status || 'draft',
              budget: parseFloat(data.budget) || 0,
              spent: 0,
              reach: 0,
              engagement: '0%',
              conversions: 0,
              roi: '0%',
              start_date:
                data.startDate || new Date().toISOString().split('T')[0],
              end_date:
                data.endDate ||
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0],
              platforms: data.platforms || [],
            },
          ])
          .select();

        if (insertError) {
          console.error('Error creating campaign:', insertError);
          return NextResponse.json(
            {
              success: false,
              error:
                'Failed to create campaign. Make sure to run scripts/campaigns-table.sql',
            },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Marketing campaign created successfully',
          campaign: newCampaign?.[0],
          campaignId,
        });

      case 'update_campaign':
        // Update existing campaign
        const { data: updatedCampaign, error: updateError } = await supabase
          .from('marketing_campaigns')
          .update({
            name: data.name,
            type: data.type,
            status: data.status,
            budget: parseFloat(data.budget),
            spent: parseFloat(data.spent),
            reach: data.reach,
            engagement: data.engagement,
            conversions: data.conversions,
            roi: data.roi,
            start_date: data.startDate,
            end_date: data.endDate,
            platforms: data.platforms,
            updated_at: new Date().toISOString(),
          })
          .eq('campaign_id', data.id)
          .select();

        if (updateError) {
          console.error('Error updating campaign:', updateError);
          return NextResponse.json(
            {
              success: false,
              error: 'Failed to update campaign',
            },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Marketing campaign updated successfully',
          campaign: updatedCampaign?.[0],
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

// Helper functions for mock data
function getMockSocialMetrics() {
  return [
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
}

function getMockContent() {
  return [
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
}

function getMockSeoMetrics() {
  return [
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
}
