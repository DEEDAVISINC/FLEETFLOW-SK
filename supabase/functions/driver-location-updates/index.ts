import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface LocationUpdate {
  driver_id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  timestamp?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const {
      driver_id,
      latitude,
      longitude,
      accuracy,
      speed,
      heading,
      timestamp,
    }: LocationUpdate = await req.json();

    // Validate coordinates
    if (!driver_id || !latitude || !longitude) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: driver_id, latitude, longitude',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return new Response(JSON.stringify({ error: 'Invalid coordinates' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get current driver info
    const { data: driver, error: driverError } = await supabaseClient
      .from('drivers')
      .select('id, name, current_load_id, current_location, company_id')
      .eq('id', driver_id)
      .single();

    if (driverError || !driver) {
      return new Response(JSON.stringify({ error: 'Driver not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create PostGIS Point geometry
    const newLocation = `POINT(${longitude} ${latitude})`;

    // Check if location significantly changed (>100 meters)
    let shouldUpdate = true;
    if (driver.current_location) {
      // Calculate distance using PostGIS
      const { data: distanceData } = await supabaseClient.rpc(
        'st_distance_sphere',
        {
          geom1: driver.current_location,
          geom2: newLocation,
        }
      );

      if (distanceData && distanceData[0] < 100) {
        shouldUpdate = false;
      }
    }

    if (shouldUpdate) {
      // Update driver location
      const { error: updateError } = await supabaseClient
        .from('drivers')
        .update({
          current_location: newLocation,
          location_accuracy: accuracy,
          current_speed: speed,
          current_heading: heading,
          location_updated_at: timestamp || new Date().toISOString(),
        })
        .eq('id', driver_id);

      if (updateError) {
        console.error('Failed to update driver location:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update location' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Update associated load location if driver has active load
      if (driver.current_load_id) {
        await supabaseClient
          .from('loads')
          .update({
            current_location: newLocation,
            location_updated_at: new Date().toISOString(),
          })
          .eq('id', driver.current_load_id);
      }

      // Check for geofencing alerts
      await checkGeofences(
        supabaseClient,
        driver_id,
        latitude,
        longitude,
        driver.company_id
      );

      // Broadcast real-time update
      await supabaseClient.channel('driver_locations').send({
        type: 'broadcast',
        event: 'location_update',
        payload: {
          driver_id,
          driver_name: driver.name,
          latitude,
          longitude,
          accuracy,
          speed,
          heading,
          timestamp: timestamp || new Date().toISOString(),
          load_id: driver.current_load_id,
        },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        driver_id,
        location_updated: shouldUpdate,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Location update error:', error);
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

// Geofencing check function
async function checkGeofences(
  supabase: any,
  driverId: string,
  lat: number,
  lng: number,
  companyId: string
) {
  try {
    // Check if driver entered/exited any geofences
    const { data: geofences } = await supabase
      .from('geofences')
      .select('*')
      .eq('company_id', companyId)
      .eq('active', true);

    if (!geofences?.length) return;

    const currentPoint = `POINT(${lng} ${lat})`;

    for (const geofence of geofences) {
      // Check if driver is inside geofence using PostGIS
      const { data: isInside } = await supabase.rpc('st_within', {
        geom1: currentPoint,
        geom2: geofence.geometry,
      });

      // Get previous status
      const { data: lastStatus } = await supabase
        .from('geofence_events')
        .select('event_type')
        .eq('driver_id', driverId)
        .eq('geofence_id', geofence.id)
        .order('created_at', { ascending: false })
        .limit(1);

      const wasInside = lastStatus?.[0]?.event_type === 'enter';
      const isCurrentlyInside = isInside?.[0] === true;

      // Detect enter/exit events
      if (isCurrentlyInside && !wasInside) {
        // Driver entered geofence
        await createGeofenceEvent(
          supabase,
          driverId,
          geofence.id,
          'enter',
          lat,
          lng
        );
      } else if (!isCurrentlyInside && wasInside) {
        // Driver exited geofence
        await createGeofenceEvent(
          supabase,
          driverId,
          geofence.id,
          'exit',
          lat,
          lng
        );
      }
    }
  } catch (error) {
    console.error('Geofencing check failed:', error);
  }
}

async function createGeofenceEvent(
  supabase: any,
  driverId: string,
  geofenceId: string,
  eventType: string,
  lat: number,
  lng: number
) {
  await supabase.from('geofence_events').insert({
    driver_id: driverId,
    geofence_id: geofenceId,
    event_type: eventType,
    location: `POINT(${lng} ${lat})`,
    created_at: new Date().toISOString(),
  });

  console.log(`Driver ${driverId} ${eventType}ed geofence ${geofenceId}`);
}
