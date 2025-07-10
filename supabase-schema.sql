-- 🗄️ FleetFlow Database Schema for Supabase
-- Copy this entire script and run it in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create sequences for auto-incrementing IDs
CREATE SEQUENCE IF NOT EXISTS driver_seq START 1001;
CREATE SEQUENCE IF NOT EXISTS load_seq START 1001;
CREATE SEQUENCE IF NOT EXISTS confirmation_seq START 1;
CREATE SEQUENCE IF NOT EXISTS delivery_seq START 1;
CREATE SEQUENCE IF NOT EXISTS file_seq START 1;
CREATE SEQUENCE IF NOT EXISTS notification_seq START 1;
CREATE SEQUENCE IF NOT EXISTS workflow_seq START 1;
CREATE SEQUENCE IF NOT EXISTS workflow_step_seq START 1;
CREATE SEQUENCE IF NOT EXISTS workflow_action_seq START 1;

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
    id TEXT PRIMARY KEY DEFAULT 'DRV-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('driver_seq')::TEXT, 4, '0'),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT UNIQUE NOT NULL,
    license_number TEXT NOT NULL,
    assigned_truck_id TEXT,
    dispatcher_id TEXT DEFAULT 'DSP-001',
    dispatcher_name TEXT DEFAULT 'Sarah Johnson',
    dispatcher_phone TEXT DEFAULT '+15559876543',
    dispatcher_email TEXT DEFAULT 'sarah.johnson@fleetflow.com',
    current_location TEXT DEFAULT 'Dallas, TX',
    eld_status TEXT DEFAULT 'Connected',
    hours_remaining DECIMAL(4,2) DEFAULT 8.5,
    auth_uid UUID REFERENCES auth.users(id), -- Link to Supabase auth
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loads table
CREATE TABLE IF NOT EXISTS loads (
    id TEXT PRIMARY KEY DEFAULT 'LD-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('load_seq')::TEXT, 4, '0'),
    broker_name TEXT NOT NULL,
    dispatcher_id TEXT DEFAULT 'DSP-001',
    assigned_driver_id TEXT REFERENCES drivers(id),
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    rate DECIMAL(10,2) NOT NULL,
    distance TEXT,
    weight TEXT,
    equipment TEXT NOT NULL,
    status TEXT DEFAULT 'Available',
    pickup_date TIMESTAMP WITH TIME ZONE NOT NULL,
    delivery_date TIMESTAMP WITH TIME ZONE NOT NULL,
    special_instructions TEXT,
    hazmat BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Load confirmations table
CREATE TABLE IF NOT EXISTS load_confirmations (
    id TEXT PRIMARY KEY DEFAULT 'LC-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('confirmation_seq')::TEXT, 4, '0'),
    load_id TEXT NOT NULL REFERENCES loads(id),
    driver_id TEXT NOT NULL REFERENCES drivers(id),
    confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    signature_url TEXT,
    photo_urls TEXT[], -- Array of photo URLs
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
    id TEXT PRIMARY KEY DEFAULT 'DEL-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('delivery_seq')::TEXT, 4, '0'),
    load_id TEXT NOT NULL REFERENCES loads(id),
    driver_id TEXT NOT NULL REFERENCES drivers(id),
    pickup_completed_at TIMESTAMP WITH TIME ZONE,
    pickup_signature_url TEXT,
    pickup_photo_urls TEXT[], -- Array of pickup photo URLs
    delivery_completed_at TIMESTAMP WITH TIME ZONE,
    delivery_signature_url TEXT,
    delivery_photo_urls TEXT[], -- Array of delivery photo URLs
    receiver_name TEXT,
    delivery_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Files table (for tracking all uploads)
CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY DEFAULT 'FILE-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('file_seq')::TEXT, 4, '0'),
    driver_id TEXT REFERENCES drivers(id),
    load_id TEXT REFERENCES loads(id),
    file_type TEXT NOT NULL, -- 'photo', 'signature', 'document'
    file_category TEXT, -- 'pickup', 'delivery', 'confirmation'
    original_name TEXT,
    file_url TEXT NOT NULL,
    cloudinary_public_id TEXT,
    file_size INTEGER,
    mime_type TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY DEFAULT 'NOT-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('notification_seq')::TEXT, 4, '0'),
    driver_id TEXT REFERENCES drivers(id),
    type TEXT NOT NULL, -- 'load_assigned', 'pickup_reminder', 'delivery_reminder', 'system'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    sms_sent BOOLEAN DEFAULT FALSE,
    sms_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow management tables for systematic step-by-step processes
CREATE TABLE IF NOT EXISTS load_workflows (
    id TEXT PRIMARY KEY DEFAULT 'WF-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('workflow_seq')::TEXT, 4, '0'),
    load_id TEXT NOT NULL REFERENCES loads(id),
    driver_id TEXT NOT NULL REFERENCES drivers(id),
    dispatcher_id TEXT NOT NULL,
    current_step INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'override_required'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflow_steps (
    id TEXT PRIMARY KEY DEFAULT 'WS-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('workflow_step_seq')::TEXT, 4, '0'),
    workflow_id TEXT NOT NULL REFERENCES load_workflows(id),
    step_id TEXT NOT NULL, -- 'load_assignment_confirmation', 'rate_confirmation_review', etc.
    step_name TEXT NOT NULL,
    step_description TEXT,
    step_order INTEGER NOT NULL,
    required BOOLEAN DEFAULT TRUE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by TEXT,
    allow_override BOOLEAN DEFAULT FALSE,
    override_reason TEXT,
    override_by TEXT,
    override_at TIMESTAMP WITH TIME ZONE,
    step_data JSONB, -- Store any additional step-specific data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflow_actions (
    id TEXT PRIMARY KEY DEFAULT 'WA-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('workflow_action_seq')::TEXT, 4, '0'),
    workflow_id TEXT NOT NULL REFERENCES load_workflows(id),
    step_id TEXT,
    action_type TEXT NOT NULL, -- 'step_completed', 'override_requested', 'override_approved', 'photo_uploaded', 'signature_captured'
    action_description TEXT,
    performed_by TEXT NOT NULL,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    action_data JSONB, -- Store action-specific data (file URLs, signatures, etc.)
    metadata JSONB -- Additional metadata for audit trail
);

-- Insert sample data
INSERT INTO drivers (name, email, phone, license_number, assigned_truck_id) VALUES
('Mike Johnson', 'mike.johnson@example.com', '+15551234567', 'CDL-123456789', 'TRK-001'),
('Sarah Williams', 'sarah.williams@example.com', '+15551234568', 'CDL-987654321', 'TRK-002'),
('David Chen', 'david.chen@example.com', '+15551234569', 'CDL-456789123', 'TRK-003')
ON CONFLICT (email) DO NOTHING;

INSERT INTO loads (broker_name, origin, destination, rate, distance, weight, equipment, pickup_date, delivery_date, special_instructions) VALUES
('Swift Logistics', 'Dallas, TX', 'Houston, TX', 1250.00, '240 miles', '32,000 lbs', 'Dry Van', NOW() + INTERVAL '1 day', NOW() + INTERVAL '2 days', 'Handle with care - fragile electronics'),
('Prime Transport', 'Austin, TX', 'San Antonio, TX', 850.00, '80 miles', '28,500 lbs', 'Refrigerated', NOW() + INTERVAL '2 days', NOW() + INTERVAL '3 days', 'Temperature controlled - keep at 35°F'),
('Global Freight', 'Fort Worth, TX', 'El Paso, TX', 1800.00, '350 miles', '45,000 lbs', 'Flatbed', NOW() + INTERVAL '3 days', NOW() + INTERVAL '5 days', 'Oversized load - permits required')
ON CONFLICT (id) DO NOTHING;

INSERT INTO workflows (name, description) VALUES
('Standard Operating Procedure', 'This is the standard operating procedure for all drivers.'),
('Emergency Protocol', 'Steps to follow in case of an emergency.'),
('Maintenance Schedule', 'Regular maintenance tasks and checks for the truck.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO workflow_steps (workflow_id, step_order, action_type, status) VALUES
('WF-2023-0001', 1, 'manual', 'pending'),
('WF-2023-0001', 2, 'automatic', 'pending'),
('WF-2023-0002', 1, 'manual', 'pending'),
('WF-2023-0002', 2, 'notification', 'pending'),
('WF-2023-0003', 1, 'task', 'pending'),
('WF-2023-0003', 2, 'task', 'pending')
ON CONFLICT (id) DO NOTHING;

INSERT INTO workflow_actions (workflow_step_id, action_type, action_details) VALUES
('WS-2023-0001', 'email', '{"to": "driver@example.com", "subject": "New Load Assigned", "body": "You have been assigned a new load. Please check the app for details."}'),
('WS-2023-0001', 'sms', '{"to": "+15551234567", "message": "New load assigned. Check your email for details."}'),
('WS-2023-0002', 'notification', '{"title": "Load Reminder", "message": "Reminder: You have a load scheduled for tomorrow."}'),
('WS-2023-0003', 'task', '{"task": "Pre-trip inspection", "due_date": "2023-10-01T08:00:00Z"}'),
('WS-2023-0003', 'task', '{"task": "Submit paperwork", "due_date": "2023-10-02T17:00:00Z"}')
ON CONFLICT (id) DO NOTHING;

-- Create RLS (Row Level Security) policies
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE load_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE load_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_actions ENABLE ROW LEVEL SECURITY;

-- Policies for drivers (drivers can only see their own data)
CREATE POLICY "Drivers can view own data" ON drivers
    FOR SELECT USING (auth.uid() = auth_uid OR auth_uid IS NULL);

CREATE POLICY "Drivers can update own data" ON drivers
    FOR UPDATE USING (auth.uid() = auth_uid);

-- Policies for loads (drivers can see assigned loads + available loads)
CREATE POLICY "Drivers can view loads" ON loads
    FOR SELECT USING (
        assigned_driver_id IS NULL OR 
        assigned_driver_id = (SELECT id FROM drivers WHERE auth_uid = auth.uid())
    );

-- Policies for confirmations (drivers can only see/create their own)
CREATE POLICY "Drivers can manage own confirmations" ON load_confirmations
    FOR ALL USING (
        driver_id = (SELECT id FROM drivers WHERE auth_uid = auth.uid())
    );

-- Policies for deliveries (drivers can only see/create their own)
CREATE POLICY "Drivers can manage own deliveries" ON deliveries
    FOR ALL USING (
        driver_id = (SELECT id FROM drivers WHERE auth_uid = auth.uid())
    );

-- Policies for files (drivers can only see/create their own)
CREATE POLICY "Drivers can manage own files" ON files
    FOR ALL USING (
        driver_id = (SELECT id FROM drivers WHERE auth_uid = auth.uid())
    );

-- Policies for notifications (drivers can only see their own)
CREATE POLICY "Drivers can view own notifications" ON notifications
    FOR SELECT USING (
        driver_id = (SELECT id FROM drivers WHERE auth_uid = auth.uid())
    );

-- Policies for workflow management (drivers can only see/update their assigned workflows)
CREATE POLICY "Drivers can view own workflows" ON load_workflows
    FOR SELECT USING (
        driver_id = (SELECT id FROM drivers WHERE auth_uid = auth.uid())
    );

CREATE POLICY "Drivers can update own workflows" ON load_workflows
    FOR UPDATE USING (
        driver_id = (SELECT id FROM drivers WHERE auth_uid = auth.uid())
    );

CREATE POLICY "Drivers can view own workflow steps" ON workflow_steps
    FOR SELECT USING (
        workflow_id IN (
            SELECT id FROM load_workflows 
            WHERE driver_id = (SELECT id FROM drivers WHERE auth_uid = auth.uid())
        )
    );

CREATE POLICY "Drivers can update own workflow steps" ON workflow_steps
    FOR UPDATE USING (
        workflow_id IN (
            SELECT id FROM load_workflows 
            WHERE driver_id = (SELECT id FROM drivers WHERE auth_uid = auth.uid())
        )
    );

CREATE POLICY "Drivers can view own workflow actions" ON workflow_actions
    FOR SELECT USING (
        workflow_id IN (
            SELECT id FROM load_workflows 
            WHERE driver_id = (SELECT id FROM drivers WHERE auth_uid = auth.uid())
        )
    );

CREATE POLICY "Drivers can create workflow actions" ON workflow_actions
    FOR INSERT WITH CHECK (
        workflow_id IN (
            SELECT id FROM load_workflows 
            WHERE driver_id = (SELECT id FROM drivers WHERE auth_uid = auth.uid())
        )
    );

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loads_updated_at BEFORE UPDATE ON loads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON deliveries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON load_workflows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_steps_updated_at BEFORE UPDATE ON workflow_steps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_actions_updated_at BEFORE UPDATE ON workflow_actions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_load_workflows_updated_at BEFORE UPDATE ON load_workflows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_drivers_auth_uid ON drivers(auth_uid);
CREATE INDEX IF NOT EXISTS idx_loads_assigned_driver ON loads(assigned_driver_id);
CREATE INDEX IF NOT EXISTS idx_loads_status ON loads(status);
CREATE INDEX IF NOT EXISTS idx_confirmations_load_id ON load_confirmations(load_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_driver_id ON load_confirmations(driver_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_load_id ON deliveries(load_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_driver_id ON deliveries(driver_id);
CREATE INDEX IF NOT EXISTS idx_files_driver_id ON files(driver_id);
CREATE INDEX IF NOT EXISTS idx_files_load_id ON files(load_id);
CREATE INDEX IF NOT EXISTS idx_notifications_driver_id ON notifications(driver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_workflows_load_id ON load_workflows(load_id);
CREATE INDEX IF NOT EXISTS idx_workflows_driver_id ON load_workflows(driver_id);
CREATE INDEX IF NOT EXISTS idx_workflows_status ON load_workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_workflow_id ON workflow_steps(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_step_id ON workflow_steps(step_id);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_completed ON workflow_steps(completed);
CREATE INDEX IF NOT EXISTS idx_workflow_actions_workflow_id ON workflow_actions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_actions_action_type ON workflow_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_workflow_actions_performed_at ON workflow_actions(performed_at);

-- Success message
SELECT 'FleetFlow database schema created successfully! 🎉' as message;
