-- 🔔 FleetFlow Unified Notification System Database Schema
--
-- This schema supports the complete unified notification system
-- across all FleetFlow portals with real-time synchronization
--

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================
-- 🔔 NOTIFICATION TABLES
-- ================================

-- Main notifications table
CREATE TABLE fleetflow_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'load_assignment', 'delivery_update', 'payment_alert',
        'warehouse_alert', 'emergency_alert', 'load_opportunity',
        'system_alert', 'compliance_alert', 'dispatch_update',
        'carrier_update', 'driver_update', 'vendor_update',
        'intraoffice', 'workflow_update', 'eta_update',
        'document_required', 'approval_needed', 'onboarding_update'
    )),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'normal', 'high', 'urgent', 'critical')),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,

    -- Channel configuration
    channels JSONB NOT NULL DEFAULT '{"inApp": true, "sms": false, "email": false, "push": false}',

    -- Target configuration
    target_portals TEXT[] NOT NULL DEFAULT ARRAY['admin'],
    target_users TEXT[] DEFAULT NULL,

    -- Metadata
    metadata JSONB DEFAULT '{}',

    -- Status tracking
    total_recipients INTEGER DEFAULT 0,
    total_read INTEGER DEFAULT 0,
    total_delivered INTEGER DEFAULT 0,

    -- System fields
    created_by VARCHAR(100) DEFAULT 'system',
    source VARCHAR(50) DEFAULT 'manual',
    tenant_id VARCHAR(100) DEFAULT 'default',

    CONSTRAINT valid_channels CHECK (jsonb_typeof(channels) = 'object'),
    CONSTRAINT valid_metadata CHECK (jsonb_typeof(metadata) = 'object'),
    CONSTRAINT valid_recipients CHECK (total_recipients >= 0),
    CONSTRAINT valid_read_count CHECK (total_read >= 0 AND total_read <= total_recipients),
    CONSTRAINT valid_delivered_count CHECK (total_delivered >= 0 AND total_delivered <= total_recipients)
);

-- Notification actions table (for interactive notifications)
CREATE TABLE notification_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_id UUID NOT NULL REFERENCES fleetflow_notifications(id) ON DELETE CASCADE,
    action_id VARCHAR(50) NOT NULL,
    label VARCHAR(100) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    url VARCHAR(500) NULL,
    style VARCHAR(20) DEFAULT 'primary' CHECK (style IN ('primary', 'secondary', 'danger', 'success')),
    sort_order INTEGER DEFAULT 0,

    UNIQUE(notification_id, action_id)
);

-- ================================
-- 📬 NOTIFICATION DELIVERY
-- ================================

-- Notification recipients and delivery status
CREATE TABLE notification_recipients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_id UUID NOT NULL REFERENCES fleetflow_notifications(id) ON DELETE CASCADE,
    user_id VARCHAR(100) NOT NULL,
    portal VARCHAR(20) NOT NULL CHECK (portal IN ('vendor', 'driver', 'dispatch', 'admin', 'carrier')),

    -- Delivery status per channel
    in_app_status VARCHAR(20) DEFAULT 'pending' CHECK (in_app_status IN ('pending', 'delivered', 'read', 'dismissed', 'failed')),
    sms_status VARCHAR(20) DEFAULT 'pending' CHECK (sms_status IN ('pending', 'sent', 'delivered', 'failed', 'skipped')),
    email_status VARCHAR(20) DEFAULT 'pending' CHECK (email_status IN ('pending', 'sent', 'delivered', 'opened', 'failed', 'skipped')),
    push_status VARCHAR(20) DEFAULT 'pending' CHECK (push_status IN ('pending', 'sent', 'delivered', 'opened', 'failed', 'skipped')),

    -- Timestamps
    delivered_at TIMESTAMP NULL,
    read_at TIMESTAMP NULL,
    dismissed_at TIMESTAMP NULL,

    -- Tracking
    read_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(notification_id, user_id, portal)
);

-- Delivery attempt log
CREATE TABLE notification_delivery_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_id UUID NOT NULL REFERENCES fleetflow_notifications(id) ON DELETE CASCADE,
    recipient_id UUID NULL REFERENCES notification_recipients(id) ON DELETE CASCADE,
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('in_app', 'sms', 'email', 'push')),
    status VARCHAR(20) NOT NULL,
    attempt_number INTEGER NOT NULL DEFAULT 1,

    -- Provider details
    provider VARCHAR(50) NULL, -- e.g., 'twilio', 'sendgrid', 'firebase'
    external_id VARCHAR(200) NULL, -- provider's message ID

    -- Error tracking
    error_code VARCHAR(50) NULL,
    error_message TEXT NULL,

    -- Performance tracking
    processing_time_ms INTEGER NULL,

    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_attempt_number CHECK (attempt_number > 0)
);

-- ================================
-- ⚙️ USER PREFERENCES
-- ================================

-- User notification preferences
CREATE TABLE user_notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    portal VARCHAR(20) NOT NULL CHECK (portal IN ('vendor', 'driver', 'dispatch', 'admin', 'carrier')),

    -- Channel preferences
    channels JSONB NOT NULL DEFAULT '{"inApp": true, "sms": false, "email": true, "push": true}',

    -- Priority preferences
    priorities JSONB NOT NULL DEFAULT '{"low": false, "normal": true, "high": true, "urgent": true, "critical": true}',

    -- Type preferences (all notification types)
    types JSONB NOT NULL DEFAULT '{}',

    -- Schedule preferences
    schedule JSONB NOT NULL DEFAULT '{
        "enabled": false,
        "startTime": "08:00",
        "endTime": "18:00",
        "timezone": "America/New_York",
        "daysOfWeek": [1,2,3,4,5],
        "urgentOnly": true
    }',

    -- Threshold preferences
    thresholds JSONB NOT NULL DEFAULT '{
        "loadValueMin": 500,
        "distanceMax": 1000,
        "rateMin": 1.50
    }',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, portal),

    CONSTRAINT valid_channels CHECK (jsonb_typeof(channels) = 'object'),
    CONSTRAINT valid_priorities CHECK (jsonb_typeof(priorities) = 'object'),
    CONSTRAINT valid_types CHECK (jsonb_typeof(types) = 'object'),
    CONSTRAINT valid_schedule CHECK (jsonb_typeof(schedule) = 'object'),
    CONSTRAINT valid_thresholds CHECK (jsonb_typeof(thresholds) = 'object')
);

-- ================================
-- 📊 ANALYTICS & TRACKING
-- ================================

-- Notification analytics aggregations (daily rollups)
CREATE TABLE notification_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    portal VARCHAR(20) NOT NULL,
    tenant_id VARCHAR(100) NOT NULL DEFAULT 'default',

    -- Volume metrics
    total_sent INTEGER NOT NULL DEFAULT 0,
    total_delivered INTEGER NOT NULL DEFAULT 0,
    total_read INTEGER NOT NULL DEFAULT 0,
    total_clicked INTEGER NOT NULL DEFAULT 0,

    -- Performance metrics
    avg_delivery_time_seconds DECIMAL(10,2) NULL,
    avg_read_time_seconds DECIMAL(10,2) NULL,

    -- Channel breakdown
    in_app_sent INTEGER DEFAULT 0,
    sms_sent INTEGER DEFAULT 0,
    email_sent INTEGER DEFAULT 0,
    push_sent INTEGER DEFAULT 0,

    -- Priority breakdown
    critical_sent INTEGER DEFAULT 0,
    urgent_sent INTEGER DEFAULT 0,
    high_sent INTEGER DEFAULT 0,
    normal_sent INTEGER DEFAULT 0,
    low_sent INTEGER DEFAULT 0,

    -- Type breakdown (JSONB for flexibility)
    type_breakdown JSONB DEFAULT '{}',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(date, portal, tenant_id),

    CONSTRAINT valid_type_breakdown CHECK (jsonb_typeof(type_breakdown) = 'object'),
    CONSTRAINT valid_metrics CHECK (
        total_sent >= 0 AND
        total_delivered >= 0 AND
        total_read >= 0 AND
        total_clicked >= 0 AND
        total_delivered <= total_sent AND
        total_read <= total_delivered
    )
);

-- ================================
-- 🔄 REAL-TIME SYNC
-- ================================

-- WebSocket connection tracking
CREATE TABLE websocket_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id VARCHAR(100) NOT NULL UNIQUE,
    user_id VARCHAR(100) NULL,
    portal VARCHAR(20) NULL,
    service VARCHAR(100) NOT NULL,

    -- Connection details
    connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_ping TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET NULL,
    user_agent TEXT NULL,

    -- Message tracking
    messages_sent INTEGER DEFAULT 0,
    messages_received INTEGER DEFAULT 0,

    -- Status
    status VARCHAR(20) DEFAULT 'connected' CHECK (status IN ('connected', 'disconnected', 'timeout')),

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Real-time notification queue (for offline users)
CREATE TABLE notification_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_id UUID NOT NULL REFERENCES fleetflow_notifications(id) ON DELETE CASCADE,
    user_id VARCHAR(100) NOT NULL,
    portal VARCHAR(20) NOT NULL,

    -- Queue management
    priority INTEGER NOT NULL DEFAULT 5, -- 1=highest, 10=lowest
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,

    -- Scheduling
    scheduled_for TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_attempted TIMESTAMP NULL,

    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'delivered', 'failed', 'cancelled')),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_priority CHECK (priority BETWEEN 1 AND 10),
    CONSTRAINT valid_attempts CHECK (attempts >= 0 AND attempts <= max_attempts)
);

-- ================================
-- 📈 INDEXES FOR PERFORMANCE
-- ================================

-- Primary lookup indexes
CREATE INDEX idx_notifications_type_priority ON fleetflow_notifications(type, priority);
CREATE INDEX idx_notifications_created_at ON fleetflow_notifications(created_at DESC);
CREATE INDEX idx_notifications_target_portals ON fleetflow_notifications USING GIN(target_portals);
CREATE INDEX idx_notifications_target_users ON fleetflow_notifications USING GIN(target_users);
CREATE INDEX idx_notifications_expires_at ON fleetflow_notifications(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_notifications_tenant ON fleetflow_notifications(tenant_id);

-- Recipient indexes
CREATE INDEX idx_recipients_user_portal ON notification_recipients(user_id, portal);
CREATE INDEX idx_recipients_notification ON notification_recipients(notification_id);
CREATE INDEX idx_recipients_status ON notification_recipients(in_app_status, read_at);
CREATE INDEX idx_recipients_unread ON notification_recipients(notification_id, user_id) WHERE in_app_status IN ('pending', 'delivered');

-- Performance indexes
CREATE INDEX idx_delivery_log_notification ON notification_delivery_log(notification_id);
CREATE INDEX idx_delivery_log_channel_status ON notification_delivery_log(channel, status);
CREATE INDEX idx_delivery_log_attempted_at ON notification_delivery_log(attempted_at DESC);

-- Preferences indexes
CREATE INDEX idx_preferences_user_portal ON user_notification_preferences(user_id, portal);

-- Analytics indexes
CREATE INDEX idx_analytics_date_portal ON notification_analytics(date DESC, portal);
CREATE INDEX idx_analytics_tenant ON notification_analytics(tenant_id, date DESC);

-- WebSocket indexes
CREATE INDEX idx_websocket_client ON websocket_connections(client_id);
CREATE INDEX idx_websocket_user_portal ON websocket_connections(user_id, portal);
CREATE INDEX idx_websocket_status ON websocket_connections(status, last_ping);

-- Queue indexes
CREATE INDEX idx_queue_user_portal ON notification_queue(user_id, portal);
CREATE INDEX idx_queue_scheduled ON notification_queue(status, scheduled_for) WHERE status = 'pending';
CREATE INDEX idx_queue_priority ON notification_queue(priority, scheduled_for);

-- ================================
-- 🔧 TRIGGERS & FUNCTIONS
-- ================================

-- Update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON fleetflow_notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipients_updated_at BEFORE UPDATE ON notification_recipients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_preferences_updated_at BEFORE UPDATE ON user_notification_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_websocket_updated_at BEFORE UPDATE ON websocket_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_queue_updated_at BEFORE UPDATE ON notification_queue FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update notification read statistics when recipients change
CREATE OR REPLACE FUNCTION update_notification_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update notification statistics
    UPDATE fleetflow_notifications
    SET
        total_read = (
            SELECT COUNT(*)
            FROM notification_recipients
            WHERE notification_id = COALESCE(NEW.notification_id, OLD.notification_id)
            AND in_app_status = 'read'
        ),
        total_delivered = (
            SELECT COUNT(*)
            FROM notification_recipients
            WHERE notification_id = COALESCE(NEW.notification_id, OLD.notification_id)
            AND in_app_status IN ('delivered', 'read', 'dismissed')
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = COALESCE(NEW.notification_id, OLD.notification_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notification_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON notification_recipients
    FOR EACH ROW EXECUTE FUNCTION update_notification_stats();

-- ================================
-- 📋 VIEWS FOR COMMON QUERIES
-- ================================

-- Unread notifications per user
CREATE VIEW user_unread_notifications AS
SELECT
    r.user_id,
    r.portal,
    COUNT(*) as unread_count,
    COUNT(*) FILTER (WHERE n.priority IN ('urgent', 'critical')) as urgent_count,
    MAX(n.created_at) as latest_notification
FROM notification_recipients r
JOIN fleetflow_notifications n ON r.notification_id = n.id
WHERE r.in_app_status IN ('pending', 'delivered')
AND (n.expires_at IS NULL OR n.expires_at > CURRENT_TIMESTAMP)
GROUP BY r.user_id, r.portal;

-- Notification delivery performance
CREATE VIEW notification_performance AS
SELECT
    n.id,
    n.type,
    n.priority,
    n.created_at,
    EXTRACT(EPOCH FROM (MIN(r.delivered_at) - n.created_at)) as time_to_first_delivery_seconds,
    EXTRACT(EPOCH FROM (MIN(r.read_at) - n.created_at)) as time_to_first_read_seconds,
    COUNT(r.id) as total_recipients,
    COUNT(r.id) FILTER (WHERE r.in_app_status IN ('delivered', 'read', 'dismissed')) as delivered_count,
    COUNT(r.id) FILTER (WHERE r.in_app_status = 'read') as read_count,
    ROUND(
        100.0 * COUNT(r.id) FILTER (WHERE r.in_app_status = 'read') /
        NULLIF(COUNT(r.id) FILTER (WHERE r.in_app_status IN ('delivered', 'read', 'dismissed')), 0),
        2
    ) as read_rate_percent
FROM fleetflow_notifications n
LEFT JOIN notification_recipients r ON n.id = r.notification_id
GROUP BY n.id, n.type, n.priority, n.created_at;

-- ================================
-- 🌱 SEED DATA
-- ================================

-- Insert default notification preferences for each portal type
INSERT INTO user_notification_preferences (user_id, portal, types) VALUES
('default', 'admin', '{"load_assignment": true, "delivery_update": true, "payment_alert": true, "warehouse_alert": true, "emergency_alert": true, "load_opportunity": true, "system_alert": true, "compliance_alert": true, "dispatch_update": true, "carrier_update": true, "driver_update": true, "vendor_update": true, "intraoffice": true, "workflow_update": true, "eta_update": true, "document_required": true, "approval_needed": true, "onboarding_update": true}'),
('default', 'dispatch', '{"load_assignment": true, "delivery_update": true, "payment_alert": false, "warehouse_alert": true, "emergency_alert": true, "load_opportunity": true, "system_alert": true, "compliance_alert": true, "dispatch_update": true, "carrier_update": true, "driver_update": true, "vendor_update": false, "intraoffice": true, "workflow_update": true, "eta_update": true, "document_required": true, "approval_needed": true, "onboarding_update": false}'),
('default', 'driver', '{"load_assignment": true, "delivery_update": true, "payment_alert": true, "warehouse_alert": false, "emergency_alert": true, "load_opportunity": true, "system_alert": false, "compliance_alert": true, "dispatch_update": true, "carrier_update": false, "driver_update": true, "vendor_update": false, "intraoffice": false, "workflow_update": true, "eta_update": true, "document_required": true, "approval_needed": false, "onboarding_update": false}'),
('default', 'vendor', '{"load_assignment": false, "delivery_update": true, "payment_alert": true, "warehouse_alert": true, "emergency_alert": true, "load_opportunity": false, "system_alert": false, "compliance_alert": false, "dispatch_update": false, "carrier_update": false, "driver_update": false, "vendor_update": true, "intraoffice": false, "workflow_update": false, "eta_update": true, "document_required": false, "approval_needed": false, "onboarding_update": false}'),
('default', 'carrier', '{"load_assignment": true, "delivery_update": true, "payment_alert": true, "warehouse_alert": false, "emergency_alert": true, "load_opportunity": true, "system_alert": false, "compliance_alert": true, "dispatch_update": false, "carrier_update": true, "driver_update": false, "vendor_update": false, "intraoffice": false, "workflow_update": true, "eta_update": true, "document_required": true, "approval_needed": true, "onboarding_update": true}')
ON CONFLICT (user_id, portal) DO NOTHING;

-- ================================
-- 📚 DOCUMENTATION COMMENTS
-- ================================

COMMENT ON TABLE fleetflow_notifications IS 'Core notification table storing all notifications across FleetFlow portals';
COMMENT ON TABLE notification_actions IS 'Interactive actions available on notifications (buttons, links, etc.)';
COMMENT ON TABLE notification_recipients IS 'Individual recipient records tracking delivery status per user/portal';
COMMENT ON TABLE notification_delivery_log IS 'Detailed delivery attempt log for debugging and analytics';
COMMENT ON TABLE user_notification_preferences IS 'User-specific notification preferences per portal';
COMMENT ON TABLE notification_analytics IS 'Daily aggregated analytics for performance monitoring';
COMMENT ON TABLE websocket_connections IS 'Active WebSocket connections for real-time notifications';
COMMENT ON TABLE notification_queue IS 'Queue for offline notification delivery';

COMMENT ON VIEW user_unread_notifications IS 'Efficient view for fetching unread notification counts per user';
COMMENT ON VIEW notification_performance IS 'Performance metrics for notification delivery and engagement';

-- Success message
SELECT 'FleetFlow Unified Notification System database schema created successfully! 🔔✅' as message;

