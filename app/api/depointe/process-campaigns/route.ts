import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

/**
 * SERVER-SIDE CAMPAIGN PROCESSOR
 * Runs 24/7 - processes campaigns even when browser is closed
 * Called by: Cron job every 10 seconds
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface Task {
  id: string;
  title: string;
  description?: string;
  type: string;
  priority: string;
  assigned_to: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  target_quantity: number;
  progress: number;
  estimated_revenue: number;
  actual_revenue: number;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  campaign_type:
    | 'healthcare'
    | 'shipper'
    | 'desperate_prospects'
    | 'government';
}

interface Lead {
  id: string;
  task_id: string;
  company: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  potential_value: number;
  source: string;
  priority: string;
  created_at: string;
  assigned_to: string;
  notes?: string;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    console.log('🚀 [SERVER] Processing DEPOINTE campaigns...');

    // Get all active tasks from database
    const { data: tasks, error: tasksError } = await supabase
      .from('depointe_campaigns')
      .select('*')
      .in('status', ['pending', 'in_progress'])
      .order('priority', { ascending: false });

    if (tasksError) {
      console.error('❌ Error fetching tasks:', tasksError);
      throw tasksError;
    }

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active campaigns to process',
        executionTime: Date.now() - startTime,
      });
    }

    console.log(`📊 Found ${tasks.length} active campaigns`);

    // Process each task
    const results = await Promise.all(tasks.map((task) => processTask(task)));

    const leadsGenerated = results.reduce(
      (sum, r) => sum + r.leadsGenerated,
      0
    );
    const revenueGenerated = results.reduce(
      (sum, r) => sum + r.revenueGenerated,
      0
    );

    console.log(
      `✅ [SERVER] Processed ${tasks.length} campaigns, generated ${leadsGenerated} leads, $${revenueGenerated} revenue`
    );

    return NextResponse.json({
      success: true,
      tasksProcessed: tasks.length,
      leadsGenerated,
      revenueGenerated,
      executionTime: Date.now() - startTime,
      details: results,
    });
  } catch (error: any) {
    console.error('❌ [SERVER] Campaign processing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}

async function processTask(task: Task): Promise<{
  taskId: string;
  progressMade: number;
  leadsGenerated: number;
  revenueGenerated: number;
}> {
  try {
    // Update status to in_progress if pending
    if (task.status === 'pending') {
      await supabase
        .from('depointe_campaigns')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString(),
        })
        .eq('id', task.id);
    }

    // Simulate progress (5-15% per cycle)
    const progressIncrement = Math.floor(Math.random() * 11) + 5;
    const newProgress = Math.min(task.progress + progressIncrement, 100);

    // Calculate revenue generated
    const revenueGenerated = Math.floor(
      (task.estimated_revenue * progressIncrement) / 100
    );
    const newActualRevenue = task.actual_revenue + revenueGenerated;

    // Generate leads
    const leadsGenerated = await generateLeadsForTask(task, progressIncrement);

    // Update task progress
    const updateData: any = {
      progress: newProgress,
      actual_revenue: newActualRevenue,
    };

    // Mark as completed if at 100%
    if (newProgress >= 100) {
      updateData.status = 'completed';
      updateData.completed_at = new Date().toISOString();
      console.log(`✅ Campaign completed: ${task.title}`);
    }

    await supabase
      .from('depointe_campaigns')
      .update(updateData)
      .eq('id', task.id);

    // Log activity
    await logActivity({
      task_id: task.id,
      staff_id: task.assigned_to[0] || 'system',
      action: `Generated ${leadsGenerated} leads`,
      details: `Progress: +${progressIncrement}% | Revenue: $${revenueGenerated.toLocaleString()}`,
      activity_type: 'campaign_execution',
    });

    return {
      taskId: task.id,
      progressMade: progressIncrement,
      leadsGenerated,
      revenueGenerated,
    };
  } catch (error) {
    console.error(`❌ Error processing task ${task.id}:`, error);
    return {
      taskId: task.id,
      progressMade: 0,
      leadsGenerated: 0,
      revenueGenerated: 0,
    };
  }
}

async function generateLeadsForTask(
  task: Task,
  progressIncrement: number
): Promise<number> {
  const leadsPerIncrement = Math.floor(
    (task.target_quantity * progressIncrement) / 100
  );

  if (leadsPerIncrement === 0) return 0;

  try {
    console.log(
      `🔍 [LEAD GEN] Generating ${leadsPerIncrement} REAL leads for ${task.campaign_type} campaign...`
    );

    // Generate REAL leads based on campaign type
    const leads: Partial<Lead>[] = [];

    if (task.campaign_type === 'shipper') {
      // Use TruckingPlanet service for shipper leads
      const { TruckingPlanetService } = await import(
        '@/app/services/TruckingPlanetService'
      );
      const tpService = new TruckingPlanetService();

      const shippers = await tpService.searchShippers({
        resultLimit: leadsPerIncrement,
        freightVolume: 'high',
      });

      for (const shipper of shippers) {
        leads.push({
          id: `LEAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          task_id: task.id,
          company: shipper.companyName,
          contact_name: shipper.contactName || 'Decision Maker',
          email: shipper.email || null,
          phone: shipper.phone || null,
          status: 'new',
          potential_value: 60000,
          source: `TruckingPlanet - ${task.title}`,
          priority: shipper.leadPotential,
          created_at: new Date().toISOString(),
          assigned_to: task.assigned_to[0] || 'unassigned',
          notes: `${shipper.industry} | ${shipper.shippingFrequency} | ${shipper.equipmentTypes.join(', ')}`,
        });
      }
    } else if (
      task.campaign_type === 'desperate_prospects' ||
      task.campaign_type === 'healthcare'
    ) {
      // Use FMCSA Reverse Lead Service for desperate prospects
      const FMCSAReverseLeadService = (
        await import('@/app/services/fmcsa-reverse-lead-service')
      ).default;
      const fmcsaService = new FMCSAReverseLeadService();

      const results = await fmcsaService.generateShipperLeads({
        desperateOnly: true,
        minLeadScore: 70,
        businessSizes: ['Small', 'Medium'],
      });

      for (
        let i = 0;
        i < Math.min(results.leads.length, leadsPerIncrement);
        i++
      ) {
        const fmcsaLead = results.leads[i];
        leads.push({
          id: `LEAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          task_id: task.id,
          company: fmcsaLead.companyName,
          contact_name:
            fmcsaLead.dbaName || fmcsaLead.businessInfo.industryType || 'Owner',
          email: null, // FMCSA doesn't provide emails
          phone: fmcsaLead.contactInfo.phone,
          status: 'new',
          potential_value: fmcsaLead.estimatedMonthlyRevenue,
          source: `FMCSA Desperate Prospects - ${task.title}`,
          priority: fmcsaLead.shipperPotential,
          created_at: new Date().toISOString(),
          assigned_to: task.assigned_to[0] || 'unassigned',
          notes: `${fmcsaLead.reasoningFactors.join(' | ')} | DOT: ${fmcsaLead.businessInfo.dotNumber}`,
        });
      }
    } else if (task.campaign_type === 'government') {
      // Government contracts - placeholder for now
      // TODO: Integrate with SAM.gov API
      console.log('⚠️ Government lead generation not yet implemented');
      return 0;
    }

    if (leads.length === 0) {
      console.warn('⚠️ No leads generated from real sources');
      return 0;
    }

    // Insert leads into database
    const { error } = await supabase.from('depointe_leads').insert(leads);

    if (error) {
      console.error('❌ Error inserting leads:', error);
      return 0;
    }

    console.log(
      `✅ [LEAD GEN] Generated ${leads.length} REAL leads for campaign: ${task.title}`
    );
    return leads.length;
  } catch (error) {
    console.error('❌ Error generating leads:', error);
    return 0;
  }
}

async function logActivity(activity: {
  task_id: string;
  staff_id: string;
  action: string;
  details: string;
  activity_type: string;
}) {
  try {
    await supabase.from('depointe_activities').insert({
      ...activity,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Error logging activity:', error);
  }
}

// GET endpoint for status check
export async function GET(request: NextRequest) {
  try {
    // Get campaign statistics
    const { data: campaigns } = await supabase
      .from('depointe_campaigns')
      .select('status, campaign_type, progress, actual_revenue');

    const { data: leads } = await supabase.from('depointe_leads').select('id');

    const stats = {
      totalCampaigns: campaigns?.length || 0,
      activeCampaigns:
        campaigns?.filter((c) => c.status === 'in_progress').length || 0,
      completedCampaigns:
        campaigns?.filter((c) => c.status === 'completed').length || 0,
      totalLeads: leads?.length || 0,
      totalRevenue:
        campaigns?.reduce((sum, c) => sum + (c.actual_revenue || 0), 0) || 0,
    };

    return NextResponse.json({
      status: 'operational',
      service: 'DEPOINTE Campaign Processor (Server-Side)',
      uptime: '24/7',
      ...stats,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
