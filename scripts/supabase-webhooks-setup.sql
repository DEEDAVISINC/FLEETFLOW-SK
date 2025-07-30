-- ================================================================
-- FleetFlow Database Webhooks Setup
-- ================================================================
-- Real-time webhook functions and triggers for FleetFlow operations

BEGIN;

-- ================================================================
-- ENABLE HTTP EXTENSION (Required for webhooks)
-- ================================================================

CREATE EXTENSION IF NOT EXISTS http;

-- ================================================================
-- LOAD STATUS CHANGE WEBHOOK
-- ================================================================

-- Function to handle load status changes
CREATE OR REPLACE FUNCTION notify_load_status_change()
RETURNS TRIGGER AS $$
DECLARE
    webhook_url TEXT;
    payload JSONB;
BEGIN
    -- Determine webhook URL based on environment
    webhook_url := COALESCE(
        current_setting('app.webhook_base_url', true),
        'https://fleetflow.vercel.app'
    ) || '/api/webhooks/load-status';

    -- Build payload
    payload := json_build_object(
        'event', 'load.status_changed',
        'load_id', NEW.id,
        'load_number', NEW.load_number,
        'company_id', NEW.company_id,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'driver_id', NEW.driver_id,
        'broker_id', NEW.broker_id,
        'timestamp', NOW(),
        'changed_by', NEW.updated_by
    );

    -- Send webhook (async)
    PERFORM net.http_post(
        webhook_url,
        payload::text,
        'application/json',
        '{"Authorization": "Bearer ' || COALESCE(current_setting('app.webhook_secret', true), 'default-secret') || '"}'::JSONB
    );

    -- Create notifications for relevant users
    INSERT INTO notifications (
        user_id,
        title,
        message,
        type,
        related_id,
        metadata,
        created_at
    )
    SELECT
        u.id,
        'Load Status Updated',
        'Load #' || NEW.load_number || ' status changed from ' || COALESCE(OLD.status, 'unknown') || ' to ' || NEW.status,
        'load_update',
        NEW.id,
        json_build_object(
            'old_status', OLD.status,
            'new_status', NEW.status,
            'load_number', NEW.load_number
        ),
        NOW()
    FROM users u
    WHERE u.company_id = NEW.company_id
        AND u.department_code IN ('DC', 'BB', 'MGR')
        AND u.notifications_enabled = true;

    -- Also notify assigned driver if status is relevant
    IF NEW.status IN ('assigned', 'picked_up', 'delivered', 'cancelled') AND NEW.driver_id IS NOT NULL THEN
        INSERT INTO notifications (
            user_id,
            title,
            message,
            type,
            related_id,
            metadata,
            created_at
        )
        SELECT
            d.user_id,
            'Load Assignment Update',
            CASE
                WHEN NEW.status = 'assigned' THEN 'You have been assigned to load #' || NEW.load_number
                WHEN NEW.status = 'picked_up' THEN 'Load #' || NEW.load_number || ' has been marked as picked up'
                WHEN NEW.status = 'delivered' THEN 'Load #' || NEW.load_number || ' has been delivered'
                WHEN NEW.status = 'cancelled' THEN 'Load #' || NEW.load_number || ' has been cancelled'
            END,
            'driver_notification',
            NEW.id,
            json_build_object(
                'load_number', NEW.load_number,
                'status', NEW.status
            ),
            NOW()
        FROM drivers d
        WHERE d.id = NEW.driver_id
            AND d.user_id IS NOT NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for load status changes
DROP TRIGGER IF EXISTS on_load_status_change ON loads;
CREATE TRIGGER on_load_status_change
    AFTER UPDATE OF status ON loads
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION notify_load_status_change();

-- ================================================================
-- DRIVER LOCATION UPDATE WEBHOOK
-- ================================================================

-- Function to handle driver location updates
CREATE OR REPLACE FUNCTION notify_driver_location_update()
RETURNS TRIGGER AS $$
DECLARE
    webhook_url TEXT;
    payload JSONB;
    distance_moved NUMERIC;
BEGIN
    -- Only proceed if location actually changed and exists
    IF OLD.current_location IS NULL OR NEW.current_location IS NULL THEN
        RETURN NEW;
    END IF;

    -- Calculate distance moved (in meters)
    distance_moved := ST_Distance(OLD.current_location, NEW.current_location);

    -- Only send webhook if moved more than 100 meters (reduces noise)
    IF distance_moved > 100 THEN
        webhook_url := COALESCE(
            current_setting('app.webhook_base_url', true),
            'https://fleetflow.vercel.app'
        ) || '/api/webhooks/driver-location';

        payload := json_build_object(
            'event', 'driver.location_updated',
            'driver_id', NEW.id,
            'driver_name', NEW.name,
            'company_id', NEW.company_id,
            'location', ST_AsGeoJSON(NEW.current_location)::json,
            'previous_location', ST_AsGeoJSON(OLD.current_location)::json,
            'distance_moved', distance_moved,
            'timestamp', NOW(),
            'current_load_id', NEW.current_load_id
        );

        -- Send webhook
        PERFORM net.http_post(
            webhook_url,
            payload::text,
            'application/json',
            '{"Authorization": "Bearer ' || COALESCE(current_setting('app.webhook_secret', true), 'default-secret') || '"}'::JSONB
        );

        -- Update any active loads with driver location
        UPDATE loads
        SET
            current_location = NEW.current_location,
            location_updated_at = NOW()
        WHERE driver_id = NEW.id
            AND status IN ('assigned', 'picked_up', 'in_transit');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for driver location updates
DROP TRIGGER IF EXISTS on_driver_location_update ON drivers;
CREATE TRIGGER on_driver_location_update
    AFTER UPDATE OF current_location ON drivers
    FOR EACH ROW
    EXECUTE FUNCTION notify_driver_location_update();

-- ================================================================
-- DELIVERY CONFIRMATION WEBHOOK
-- ================================================================

-- Function to handle delivery confirmations
CREATE OR REPLACE FUNCTION notify_delivery_confirmation()
RETURNS TRIGGER AS $$
DECLARE
    webhook_url TEXT;
    payload JSONB;
    load_info RECORD;
BEGIN
    -- Get load information
    SELECT l.*, c.name as company_name, d.name as driver_name
    INTO load_info
    FROM loads l
    JOIN companies c ON l.company_id = c.id
    LEFT JOIN drivers d ON l.driver_id = d.id
    WHERE l.id = NEW.load_id;

    webhook_url := COALESCE(
        current_setting('app.webhook_base_url', true),
        'https://fleetflow.vercel.app'
    ) || '/api/webhooks/delivery-confirmation';

    payload := json_build_object(
        'event', 'delivery.confirmed',
        'delivery_id', NEW.id,
        'load_id', NEW.load_id,
        'load_number', load_info.load_number,
        'company_id', load_info.company_id,
        'company_name', load_info.company_name,
        'driver_id', load_info.driver_id,
        'driver_name', load_info.driver_name,
        'delivery_date', NEW.delivery_date,
        'delivery_location', ST_AsGeoJSON(NEW.delivery_location)::json,
        'proof_of_delivery', NEW.proof_of_delivery,
        'notes', NEW.notes,
        'timestamp', NOW()
    );

    -- Send webhook
    PERFORM net.http_post(
        webhook_url,
        payload::text,
        'application/json',
        '{"Authorization": "Bearer ' || COALESCE(current_setting('app.webhook_secret', true), 'default-secret') || '"}'::JSONB
    );

    -- Create notifications for brokers and dispatchers
    INSERT INTO notifications (
        user_id,
        title,
        message,
        type,
        related_id,
        metadata,
        created_at
    )
    SELECT
        u.id,
        'Delivery Confirmed',
        'Load #' || load_info.load_number || ' has been delivered by ' || COALESCE(load_info.driver_name, 'driver'),
        'delivery_confirmation',
        NEW.load_id,
        json_build_object(
            'delivery_id', NEW.id,
            'load_number', load_info.load_number,
            'delivery_date', NEW.delivery_date
        ),
        NOW()
    FROM users u
    WHERE u.company_id = load_info.company_id
        AND u.department_code IN ('DC', 'BB', 'MGR')
        AND u.notifications_enabled = true;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for delivery confirmations
DROP TRIGGER IF EXISTS on_delivery_confirmation ON deliveries;
CREATE TRIGGER on_delivery_confirmation
    AFTER INSERT ON deliveries
    FOR EACH ROW
    EXECUTE FUNCTION notify_delivery_confirmation();

-- ================================================================
-- DOCUMENT UPLOAD WEBHOOK
-- ================================================================

-- Function to handle document uploads
CREATE OR REPLACE FUNCTION notify_document_upload()
RETURNS TRIGGER AS $$
DECLARE
    webhook_url TEXT;
    payload JSONB;
    user_info RECORD;
BEGIN
    -- Get user information
    SELECT u.*, c.name as company_name
    INTO user_info
    FROM users u
    JOIN companies c ON u.company_id = c.id
    WHERE u.id = NEW.user_id;

    webhook_url := COALESCE(
        current_setting('app.webhook_base_url', true),
        'https://fleetflow.vercel.app'
    ) || '/api/webhooks/document-upload';

    payload := json_build_object(
        'event', 'document.uploaded',
        'document_id', NEW.id,
        'filename', NEW.filename,
        'file_type', NEW.file_type,
        'file_size', NEW.file_size,
        'category', NEW.category,
        'user_id', NEW.user_id,
        'user_name', user_info.full_name,
        'company_id', NEW.company_id,
        'company_name', user_info.company_name,
        'load_id', NEW.load_id,
        'timestamp', NOW()
    );

    -- Send webhook
    PERFORM net.http_post(
        webhook_url,
        payload::text,
        'application/json',
        '{"Authorization": "Bearer ' || COALESCE(current_setting('app.webhook_secret', true), 'default-secret') || '"}'::JSONB
    );

    -- Notify relevant users if document is for a specific load
    IF NEW.load_id IS NOT NULL THEN
        INSERT INTO notifications (
            user_id,
            title,
            message,
            type,
            related_id,
            metadata,
            created_at
        )
        SELECT DISTINCT
            u.id,
            'Document Uploaded',
            user_info.full_name || ' uploaded ' || NEW.filename || ' for load #' || l.load_number,
            'document_upload',
            NEW.load_id,
            json_build_object(
                'document_id', NEW.id,
                'filename', NEW.filename,
                'category', NEW.category
            ),
            NOW()
        FROM loads l
        JOIN users u ON (
            u.company_id = l.company_id AND u.department_code IN ('DC', 'BB', 'MGR')
        ) OR (
            u.id = l.broker_id
        )
        WHERE l.id = NEW.load_id
            AND u.id != NEW.user_id  -- Don't notify the uploader
            AND u.notifications_enabled = true;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for document uploads
DROP TRIGGER IF EXISTS on_document_upload ON documents;
CREATE TRIGGER on_document_upload
    AFTER INSERT ON documents
    FOR EACH ROW
    EXECUTE FUNCTION notify_document_upload();

-- ================================================================
-- VEHICLE MAINTENANCE REMINDER WEBHOOK
-- ================================================================

-- Function to check for upcoming maintenance
CREATE OR REPLACE FUNCTION check_vehicle_maintenance()
RETURNS void AS $$
DECLARE
    webhook_url TEXT;
    vehicle_record RECORD;
    payload JSONB;
BEGIN
    webhook_url := COALESCE(
        current_setting('app.webhook_base_url', true),
        'https://fleetflow.vercel.app'
    ) || '/api/webhooks/maintenance-reminder';

    -- Check for vehicles needing maintenance
    FOR vehicle_record IN
        SELECT v.*, c.name as company_name, d.name as driver_name
        FROM vehicles v
        JOIN companies c ON v.company_id = c.id
        LEFT JOIN drivers d ON v.assigned_driver_id = d.id
        WHERE v.next_maintenance_date <= CURRENT_DATE + INTERVAL '7 days'
            AND v.maintenance_status != 'in_maintenance'
    LOOP
        payload := json_build_object(
            'event', 'maintenance.reminder',
            'vehicle_id', vehicle_record.id,
            'vehicle_number', vehicle_record.vehicle_number,
            'make_model', vehicle_record.make || ' ' || vehicle_record.model,
            'company_id', vehicle_record.company_id,
            'company_name', vehicle_record.company_name,
            'assigned_driver_id', vehicle_record.assigned_driver_id,
            'driver_name', vehicle_record.driver_name,
            'next_maintenance_date', vehicle_record.next_maintenance_date,
            'mileage', vehicle_record.current_mileage,
            'days_until_maintenance', (vehicle_record.next_maintenance_date - CURRENT_DATE),
            'timestamp', NOW()
        );

        -- Send webhook
        PERFORM net.http_post(
            webhook_url,
            payload::text,
            'application/json',
            '{"Authorization": "Bearer ' || COALESCE(current_setting('app.webhook_secret', true), 'default-secret') || '"}'::JSONB
        );

        -- Create notifications
        INSERT INTO notifications (
            user_id,
            title,
            message,
            type,
            related_id,
            metadata,
            created_at
        )
        SELECT
            u.id,
            'Maintenance Reminder',
            'Vehicle ' || vehicle_record.vehicle_number || ' needs maintenance by ' || vehicle_record.next_maintenance_date,
            'maintenance_reminder',
            vehicle_record.id,
            json_build_object(
                'vehicle_number', vehicle_record.vehicle_number,
                'maintenance_date', vehicle_record.next_maintenance_date
            ),
            NOW()
        FROM users u
        WHERE u.company_id = vehicle_record.company_id
            AND u.department_code IN ('MGR', 'DC')
            AND u.notifications_enabled = true;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- WEBHOOK CONFIGURATION FUNCTIONS
-- ================================================================

-- Function to set webhook configuration
CREATE OR REPLACE FUNCTION set_webhook_config(base_url TEXT, secret TEXT)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.webhook_base_url', base_url, false);
    PERFORM set_config('app.webhook_secret', secret, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to test webhook endpoints
CREATE OR REPLACE FUNCTION test_webhook_endpoint(endpoint TEXT)
RETURNS JSONB AS $$
DECLARE
    webhook_url TEXT;
    response JSONB;
    test_payload JSONB;
BEGIN
    webhook_url := COALESCE(
        current_setting('app.webhook_base_url', true),
        'https://fleetflow.vercel.app'
    ) || endpoint;

    test_payload := json_build_object(
        'event', 'test.webhook',
        'timestamp', NOW(),
        'message', 'This is a test webhook from FleetFlow'
    );

    -- Send test webhook
    SELECT net.http_post(
        webhook_url,
        test_payload::text,
        'application/json',
        '{"Authorization": "Bearer ' || COALESCE(current_setting('app.webhook_secret', true), 'default-secret') || '"}'::JSONB
    ) INTO response;

    RETURN json_build_object(
        'url', webhook_url,
        'payload', test_payload,
        'response', response
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;

-- ================================================================
-- USAGE INSTRUCTIONS
-- ================================================================

-- To set webhook configuration:
-- SELECT set_webhook_config('https://your-domain.com', 'your-webhook-secret');

-- To test webhook endpoints:
-- SELECT test_webhook_endpoint('/api/webhooks/load-status');

-- To manually trigger maintenance checks (run daily via cron job):
-- SELECT check_vehicle_maintenance();
