import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * MIGRATION ENDPOINT
 * Moves campaigns from localStorage to Supabase database
 * Run this ONCE after setting up database tables
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { campaigns, leads, activities } = await request.json();

    console.log('📦 Starting migration to database...');
    console.log(`  - Campaigns: ${campaigns?.length || 0}`);
    console.log(`  - Leads: ${leads?.length || 0}`);
    console.log(`  - Activities: ${activities?.length || 0}`);

    let migratedCampaigns = 0;
    let migratedLeads = 0;
    let migratedActivities = 0;

    // Migrate campaigns
    if (campaigns && campaigns.length > 0) {
      const { data, error } = await supabase
        .from('depointe_campaigns')
        .upsert(campaigns, { onConflict: 'id' });

      if (error) {
        console.error('❌ Error migrating campaigns:', error);
      } else {
        migratedCampaigns = campaigns.length;
        console.log(`✅ Migrated ${migratedCampaigns} campaigns`);
      }
    }

    // Migrate leads
    if (leads && leads.length > 0) {
      const { data, error } = await supabase
        .from('depointe_leads')
        .upsert(leads, { onConflict: 'id' });

      if (error) {
        console.error('❌ Error migrating leads:', error);
      } else {
        migratedLeads = leads.length;
        console.log(`✅ Migrated ${migratedLeads} leads`);
      }
    }

    // Migrate activities
    if (activities && activities.length > 0) {
      // Activities use auto-increment ID, so insert instead of upsert
      const { data, error } = await supabase.from('depointe_activities').insert(
        activities.map((a: any) => ({
          task_id: a.taskId || a.task_id,
          staff_id: a.staffId || a.staff_id || 'unknown',
          action: a.action,
          details: a.details,
          activity_type: a.type || a.activity_type || 'campaign_execution',
          created_at: a.timestamp || a.created_at || new Date().toISOString(),
        }))
      );

      if (error) {
        console.error('❌ Error migrating activities:', error);
      } else {
        migratedActivities = activities.length;
        console.log(`✅ Migrated ${migratedActivities} activities`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Migration completed',
      migrated: {
        campaigns: migratedCampaigns,
        leads: migratedLeads,
        activities: migratedActivities,
      },
    });
  } catch (error: any) {
    console.error('❌ Migration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message:
      'Migration endpoint - Use POST with campaigns/leads/activities data',
    example: {
      campaigns: [],
      leads: [],
      activities: [],
    },
  });
}


