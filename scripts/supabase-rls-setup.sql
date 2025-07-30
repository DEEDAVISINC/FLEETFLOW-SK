-- ================================================================
-- FleetFlow Row Level Security (RLS) Setup Script
-- ================================================================
-- This script sets up comprehensive RLS policies for FleetFlow
-- Run this AFTER creating your database schema

BEGIN;

-- ================================================================
-- ENABLE RLS ON ALL CORE TABLES
-- ================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE load_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_records ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- USERS TABLE POLICIES
-- ================================================================

-- Users can view their own profile
CREATE POLICY "users_own_profile_select" ON users
    FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "users_own_profile_update" ON users
    FOR UPDATE
    USING (auth.uid() = id);

-- Managers can view all users in their company
CREATE POLICY "managers_view_company_users" ON users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users manager
            WHERE manager.id = auth.uid()
            AND manager.department_code = 'MGR'
            AND manager.company_id = users.company_id
        )
    );

-- Managers can manage users in their company
CREATE POLICY "managers_manage_company_users" ON users
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users manager
            WHERE manager.id = auth.uid()
            AND manager.department_code = 'MGR'
            AND manager.company_id = users.company_id
        )
    );

-- Service role bypass for administrative operations
CREATE POLICY "service_role_users_bypass" ON users
    FOR ALL
    USING (current_setting('role') = 'service_role');

-- ================================================================
-- COMPANIES TABLE POLICIES
-- ================================================================

-- Users can view their own company
CREATE POLICY "users_view_own_company" ON companies
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.company_id = companies.id
        )
    );

-- Managers can update their company
CREATE POLICY "managers_update_company" ON companies
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.company_id = companies.id
            AND users.department_code = 'MGR'
        )
    );

-- Service role bypass
CREATE POLICY "service_role_companies_bypass" ON companies
    FOR ALL
    USING (current_setting('role') = 'service_role');

-- ================================================================
-- LOADS TABLE POLICIES
-- ================================================================

-- Users can view loads from their company
CREATE POLICY "users_view_company_loads" ON loads
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.company_id = loads.company_id
        )
    );

-- Dispatchers and Managers can manage all company loads
CREATE POLICY "dispatchers_manage_loads" ON loads
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.company_id = loads.company_id
            AND users.department_code IN ('DC', 'MGR')
        )
    );

-- Brokers can manage their assigned loads
CREATE POLICY "brokers_manage_assigned_loads" ON loads
    FOR ALL
    USING (
        (broker_id = auth.uid()) OR
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.company_id = loads.company_id
            AND users.department_code IN ('BB', 'MGR')
        )
    );

-- Drivers can view their assigned loads
CREATE POLICY "drivers_view_assigned_loads" ON loads
    FOR SELECT
    USING (
        driver_id IN (
            SELECT drivers.id FROM drivers
            WHERE drivers.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.company_id = loads.company_id
            AND users.department_code IN ('DM', 'MGR')
        )
    );

-- Service role bypass
CREATE POLICY "service_role_loads_bypass" ON loads
    FOR ALL
    USING (current_setting('role') = 'service_role');

-- ================================================================
-- DRIVERS TABLE POLICIES
-- ================================================================

-- Drivers can view and update their own profile
CREATE POLICY "drivers_own_profile" ON drivers
    FOR ALL
    USING (user_id = auth.uid());

-- Dispatchers and Managers can view company drivers
CREATE POLICY "dispatchers_view_company_drivers" ON drivers
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.company_id = drivers.company_id
            AND users.department_code IN ('DC', 'MGR')
        )
    );

-- Managers can manage company drivers
CREATE POLICY "managers_manage_company_drivers" ON drivers
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.company_id = drivers.company_id
            AND users.department_code = 'MGR'
        )
    );

-- Service role bypass
CREATE POLICY "service_role_drivers_bypass" ON drivers
    FOR ALL
    USING (current_setting('role') = 'service_role');

-- ================================================================
-- VEHICLES TABLE POLICIES
-- ================================================================

-- Users can view vehicles from their company
CREATE POLICY "users_view_company_vehicles" ON vehicles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.company_id = vehicles.company_id
        )
    );

-- Managers can manage company vehicles
CREATE POLICY "managers_manage_company_vehicles" ON vehicles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.company_id = vehicles.company_id
            AND users.department_code = 'MGR'
        )
    );

-- Drivers can view their assigned vehicle
CREATE POLICY "drivers_view_assigned_vehicle" ON vehicles
    FOR SELECT
    USING (
        assigned_driver_id IN (
            SELECT drivers.id FROM drivers
            WHERE drivers.user_id = auth.uid()
        )
    );

-- Service role bypass
CREATE POLICY "service_role_vehicles_bypass" ON vehicles
    FOR ALL
    USING (current_setting('role') = 'service_role');

-- ================================================================
-- NOTIFICATIONS TABLE POLICIES
-- ================================================================

-- Users can view their own notifications
CREATE POLICY "users_view_own_notifications" ON notifications
    FOR SELECT
    USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "users_update_own_notifications" ON notifications
    FOR UPDATE
    USING (user_id = auth.uid());

-- System can create notifications for any user
CREATE POLICY "system_create_notifications" ON notifications
    FOR INSERT
    WITH CHECK (current_setting('role') = 'service_role');

-- Managers can view company notifications
CREATE POLICY "managers_view_company_notifications" ON notifications
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users sender, users manager
            WHERE sender.id = notifications.user_id
            AND manager.id = auth.uid()
            AND manager.company_id = sender.company_id
            AND manager.department_code = 'MGR'
        )
    );

-- ================================================================
-- DOCUMENTS TABLE POLICIES
-- ================================================================

-- Users can view documents they have access to
CREATE POLICY "users_view_accessible_documents" ON documents
    FOR SELECT
    USING (
        -- Own documents
        user_id = auth.uid() OR
        -- Company documents if user is from same company
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.company_id = documents.company_id
        )
    );

-- Users can upload their own documents
CREATE POLICY "users_upload_own_documents" ON documents
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Managers can manage company documents
CREATE POLICY "managers_manage_company_documents" ON documents
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.company_id = documents.company_id
            AND users.department_code = 'MGR'
        )
    );

-- Service role bypass
CREATE POLICY "service_role_documents_bypass" ON documents
    FOR ALL
    USING (current_setting('role') = 'service_role');

-- ================================================================
-- AUDIT LOGS TABLE POLICIES
-- ================================================================

-- Only managers can view audit logs for their company
CREATE POLICY "managers_view_company_audit_logs" ON audit_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.department_code = 'MGR'
            -- Additional company check can be added based on audit_logs schema
        )
    );

-- Only service role can insert audit logs
CREATE POLICY "service_role_audit_logs_insert" ON audit_logs
    FOR INSERT
    WITH CHECK (current_setting('role') = 'service_role');

-- ================================================================
-- LOAD CONFIRMATIONS TABLE POLICIES
-- ================================================================

-- Drivers can manage confirmations for their loads
CREATE POLICY "drivers_manage_own_confirmations" ON load_confirmations
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM loads
            JOIN drivers ON loads.driver_id = drivers.id
            WHERE loads.id = load_confirmations.load_id
            AND drivers.user_id = auth.uid()
        )
    );

-- Dispatchers can view all company confirmations
CREATE POLICY "dispatchers_view_company_confirmations" ON load_confirmations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM loads
            JOIN users ON users.company_id = loads.company_id
            WHERE loads.id = load_confirmations.load_id
            AND users.id = auth.uid()
            AND users.department_code IN ('DC', 'MGR')
        )
    );

-- Service role bypass
CREATE POLICY "service_role_confirmations_bypass" ON load_confirmations
    FOR ALL
    USING (current_setting('role') = 'service_role');

-- ================================================================
-- DELIVERIES TABLE POLICIES
-- ================================================================

-- Users can view deliveries for loads they have access to
CREATE POLICY "users_view_accessible_deliveries" ON deliveries
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM loads
            JOIN users ON users.company_id = loads.company_id
            WHERE loads.id = deliveries.load_id
            AND users.id = auth.uid()
        )
    );

-- Drivers can manage deliveries for their loads
CREATE POLICY "drivers_manage_own_deliveries" ON deliveries
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM loads
            JOIN drivers ON loads.driver_id = drivers.id
            WHERE loads.id = deliveries.load_id
            AND drivers.user_id = auth.uid()
        )
    );

-- Service role bypass
CREATE POLICY "service_role_deliveries_bypass" ON deliveries
    FOR ALL
    USING (current_setting('role') = 'service_role');

-- ================================================================
-- FILE RECORDS TABLE POLICIES
-- ================================================================

-- Users can view files they uploaded or have company access to
CREATE POLICY "users_view_accessible_files" ON file_records
    FOR SELECT
    USING (
        uploaded_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.company_id = file_records.company_id
        )
    );

-- Users can upload files
CREATE POLICY "users_upload_files" ON file_records
    FOR INSERT
    WITH CHECK (uploaded_by = auth.uid());

-- Users can delete their own files
CREATE POLICY "users_delete_own_files" ON file_records
    FOR DELETE
    USING (uploaded_by = auth.uid());

-- Managers can manage company files
CREATE POLICY "managers_manage_company_files" ON file_records
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.company_id = file_records.company_id
            AND users.department_code = 'MGR'
        )
    );

-- Service role bypass
CREATE POLICY "service_role_files_bypass" ON file_records
    FOR ALL
    USING (current_setting('role') = 'service_role');

-- ================================================================
-- DEVELOPMENT ENVIRONMENT POLICIES (Optional)
-- ================================================================

-- Uncomment these for development environment only
-- These provide more permissive access for testing

/*
-- Allow all authenticated users to view all data (DEV ONLY)
CREATE POLICY "dev_authenticated_users_select_all" ON users
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "dev_authenticated_users_select_loads" ON loads
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "dev_authenticated_users_select_drivers" ON drivers
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Add similar policies for other tables as needed for development
*/

-- ================================================================
-- COMMIT CHANGES
-- ================================================================

COMMIT;

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Run these to verify RLS is properly enabled:

-- Check which tables have RLS enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true;

-- List all policies
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Test policy functionality (replace with actual user ID)
-- SELECT set_config('request.jwt.claims', '{"sub":"actual-user-id","role":"authenticated"}', true);
-- SELECT * FROM users; -- Should only return authorized records
