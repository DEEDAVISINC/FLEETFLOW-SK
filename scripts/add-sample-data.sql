-- FleetFlow Sample Data
-- Run this in your Supabase SQL Editor to add sample data to existing tables

-- Insert sample loads
INSERT INTO loads (load_id, origin, destination, weight, rate, status, driver, pickup_date, delivery_date, customer, miles, profit, broker_name, equipment) VALUES
('LD001', 'Los Angeles, CA', 'Phoenix, AZ', '42,000 lbs', '$2,850', 'In Transit', 'Mike Johnson', '2025-01-15', '2025-01-16', 'Walmart Distribution', '372', '$1,420', 'ABC Logistics', 'Dry Van'),
('LD002', 'Dallas, TX', 'Atlanta, GA', '38,500 lbs', '$3,200', 'At Pickup', 'Sarah Williams', '2025-01-13', '2025-01-15', 'Home Depot Supply', '781', '$1,850', 'XYZ Transport', 'Reefer'),
('LD003', 'Chicago, IL', 'Denver, CO', '45,000 lbs', '$2,950', 'Available', 'Unassigned', '2025-01-10', '2025-01-12', 'Amazon Logistics', '920', '$1,680', 'Fast Freight', 'Flatbed'),
('LD004', 'Miami, FL', 'New York, NY', '35,000 lbs', '$4,100', 'At Delivery', 'David Chen', '2025-01-08', '2025-01-10', 'CVS Health', '1,380', '$2,200', 'Premium Carriers', 'Dry Van'),
('LD005', 'Detroit, MI', 'Jacksonville, FL', '40,000 lbs', '$3,500', 'Available', 'Unassigned', '2025-01-12', '2025-01-14', 'Ford Motor Co', '1,100', '$1,900', 'Motor City Logistics', 'Power Only'),
('LD006', 'Portland, OR', 'Phoenix, AZ', '36,000 lbs', '$3,800', 'In Transit', 'Lisa Rodriguez', '2025-01-11', '2025-01-13', 'Nike Distribution', '1,450', '$2,100', 'Pacific Transport', 'Dry Van')
ON CONFLICT (load_id) DO NOTHING;

-- Insert sample drivers
INSERT INTO drivers (name, email, phone, license_number, status, dispatcher_name, dispatcher_phone, current_location) VALUES
('Mike Johnson', 'mike.johnson@fleetflow.com', '(555) 123-4567', 'DL123456789', 'Active', 'John Smith', '(555) 987-6543', 'Phoenix, AZ'),
('Sarah Williams', 'sarah.williams@fleetflow.com', '(555) 234-5678', 'DL234567890', 'Active', 'John Smith', '(555) 987-6543', 'Dallas, TX'),
('David Chen', 'david.chen@fleetflow.com', '(555) 345-6789', 'DL345678901', 'Active', 'Jane Doe', '(555) 876-5432', 'New York, NY'),
('Lisa Rodriguez', 'lisa.rodriguez@fleetflow.com', '(555) 456-7890', 'DL456789012', 'Active', 'Jane Doe', '(555) 876-5432', 'Portland, OR'),
('Robert Wilson', 'robert.wilson@fleetflow.com', '(555) 567-8901', 'DL567890123', 'Active', 'John Smith', '(555) 987-6543', 'Chicago, IL'),
('Maria Garcia', 'maria.garcia@fleetflow.com', '(555) 678-9012', 'DL678901234', 'Active', 'Jane Doe', '(555) 876-5432', 'Miami, FL')
ON CONFLICT (license_number) DO NOTHING;

-- Insert sample vehicles
INSERT INTO vehicles (vehicle_id, make, model, year, vin, license_plate, status) VALUES
('TRK001', 'Freightliner', 'Cascadia', '2023', '1FUJA6CV83L123456', 'ABC123', 'Active'),
('TRK002', 'Peterbilt', '579', '2022', '1XPBD49X7MD123456', 'XYZ789', 'Active'),
('TRK003', 'Kenworth', 'T680', '2023', '1XKWD49X7JD123456', 'DEF456', 'Active'),
('TRK004', 'Volvo', 'VNL', '2022', '4V4NC9TJ7XN123456', 'GHI789', 'Active'),
('TRK005', 'International', 'LT', '2023', '1HTMMAAL0XN123456', 'JKL012', 'Active'),
('TRK006', 'Mack', 'Anthem', '2022', '1M2AA18Y5WM123456', 'MNO345', 'Active')
ON CONFLICT (vehicle_id) DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (driver_id, message, type, metadata) VALUES
((SELECT id FROM drivers WHERE name = 'Mike Johnson' LIMIT 1), 'Load LD001 has been assigned to you', 'load_assignment', '{"load_id": "LD001"}'),
((SELECT id FROM drivers WHERE name = 'Sarah Williams' LIMIT 1), 'Please confirm pickup for load LD002', 'pickup_reminder', '{"load_id": "LD002"}'),
((SELECT id FROM drivers WHERE name = 'David Chen' LIMIT 1), 'Delivery completed for load LD004', 'delivery_complete', '{"load_id": "LD004"}'),
((SELECT id FROM drivers WHERE name = 'Lisa Rodriguez' LIMIT 1), 'New route available for load LD006', 'route_update', '{"load_id": "LD006"}')
ON CONFLICT DO NOTHING; 