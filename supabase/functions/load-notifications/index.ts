import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface LoadNotificationRequest {
  load_id: string;
  event_type: 'status_change' | 'assignment' | 'pickup' | 'delivery';
  message: string;
  recipients: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse request body
    const {
      load_id,
      event_type,
      message,
      recipients,
    }: LoadNotificationRequest = await req.json();

    // Validate required fields
    if (!load_id || !event_type || !message || !recipients?.length) {
      return new Response(
        JSON.stringify({
          error:
            'Missing required fields: load_id, event_type, message, recipients',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get load details for context
    const { data: load, error: loadError } = await supabaseClient
      .from('loads')
      .select(
        `
        *,
        companies(name),
        drivers(name, user_id),
        users:broker_id(full_name, email)
      `
      )
      .eq('id', load_id)
      .single();

    if (loadError) {
      console.error('Failed to fetch load:', loadError);
      return new Response(JSON.stringify({ error: 'Load not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create notifications for each recipient
    const notifications = recipients.map((user_id) => ({
      user_id,
      title: getNotificationTitle(event_type, load),
      message: message || getNotificationMessage(event_type, load),
      type: 'load_notification',
      related_id: load_id,
      metadata: {
        event_type,
        load_number: load.load_number,
        company_name: load.companies?.name,
      },
    }));

    // Insert notifications
    const { error: notificationError } = await supabaseClient
      .from('notifications')
      .insert(notifications);

    if (notificationError) {
      console.error('Failed to create notifications:', notificationError);
      return new Response(
        JSON.stringify({ error: 'Failed to create notifications' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Send push notifications if enabled
    await sendPushNotifications(notifications, load);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        notifications_sent: notifications.length,
        load_number: load.load_number,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Helper functions
function getNotificationTitle(eventType: string, load: any): string {
  const titles: Record<string, string> = {
    status_change: '📦 Load Status Updated',
    assignment: '🚛 Load Assigned',
    pickup: '📋 Load Picked Up',
    delivery: '✅ Load Delivered',
  };
  return titles[eventType] || '📋 Load Update';
}

function getNotificationMessage(eventType: string, load: any): string {
  const companyName = load.companies?.name || 'Unknown Company';
  const driverName = load.drivers?.name || 'Unassigned';

  switch (eventType) {
    case 'assignment':
      return `Load #${load.load_number} has been assigned to ${driverName}`;
    case 'pickup':
      return `Load #${load.load_number} has been picked up by ${driverName}`;
    case 'delivery':
      return `Load #${load.load_number} has been delivered successfully`;
    case 'status_change':
      return `Load #${load.load_number} status changed to ${load.status}`;
    default:
      return `Update for load #${load.load_number}`;
  }
}

async function sendPushNotifications(notifications: any[], load: any) {
  // Integration with push notification service (FCM, APNS, etc.)
  // This would typically call an external service
  console.log(`Sending push notifications for load #${load.load_number}`);

  // Example: Could integrate with Firebase Cloud Messaging
  // or other push notification services here
}
