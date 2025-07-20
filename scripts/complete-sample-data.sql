-- FleetFlow Complete Sample Data
-- This script adds sample data to all tables in the new schema

-- Insert sample shippers
INSERT INTO shippers (company_name, contact_name, email, phone, address, city, state, zip_code) VALUES
    ('ABC Manufacturing', 'John Smith', 'john@abcmfg.com', '555-0101', '123 Industrial Way', 'Detroit', 'MI', '48201'),
    ('XYZ Logistics', 'Sarah Johnson', 'sarah@xyzlogistics.com', '555-0102', '456 Commerce St', 'Chicago', 'IL', '60601'),
    ('Global Shipping Co', 'Mike Wilson', 'mike@globalship.com', '555-0103', '789 Harbor Blvd', 'Los Angeles', 'CA', '90001'),
    ('Premium Freight Solutions', 'Lisa Davis', 'lisa@premiumfreight.com', '555-0104', '321 Transport Ave', 'Dallas', 'TX', '75201'),
    ('Express Delivery Inc', 'Tom Anderson', 'tom@expressdelivery.com', '555-0105', '654 Speedway Blvd', 'Atlanta', 'GA', '30301')
ON CONFLICT DO NOTHING;

-- Insert sample carriers
INSERT INTO carriers (company_name, contact_name, email, phone, mc_number, dot_number) VALUES
    ('FastTrack Transport', 'David Brown', 'david@fasttrack.com', '555-0201', 'MC-123456', 'DOT-7890123'),
    ('Reliable Freight', 'Lisa Davis', 'lisa@reliable.com', '555-0202', 'MC-234567', 'DOT-8901234'),
    ('Express Delivery', 'Tom Anderson', 'tom@express.com', '555-0203', 'MC-345678', 'DOT-9012345'),
    ('Swift Logistics', 'Jennifer Wilson', 'jennifer@swift.com', '555-0204', 'MC-456789', 'DOT-0123456'),
    ('Prime Carriers', 'Robert Johnson', 'robert@prime.com', '555-0205', 'MC-567890', 'DOT-1234567')
ON CONFLICT DO NOTHING;

-- Insert sample drivers (without user_id for now)
INSERT INTO drivers (first_name, last_name, phone, license_number, status) VALUES
    ('Mike', 'Johnson', '(555) 123-4567', 'DL123456789', 'available'),
    ('Sarah', 'Williams', '(555) 234-5678', 'DL234567890', 'available'),
    ('David', 'Chen', '(555) 345-6789', 'DL345678901', 'busy'),
    ('Lisa', 'Rodriguez', '(555) 456-7890', 'DL456789012', 'available'),
    ('Robert', 'Wilson', '(555) 567-8901', 'DL567890123', 'available'),
    ('Maria', 'Garcia', '(555) 678-9012', 'DL678901234', 'offline'),
    ('James', 'Taylor', '(555) 789-0123', 'DL789012345', 'available'),
    ('Emily', 'Brown', '(555) 890-1234', 'DL890123456', 'busy')
ON CONFLICT (license_number) DO NOTHING;

-- Insert sample vehicles
INSERT INTO vehicles (vehicle_number, make, model, year, vin, license_plate, status) VALUES
    ('TRK001', 'Freightliner', 'Cascadia', 2023, '1FUJA6CV83L123456', 'ABC123', 'available'),
    ('TRK002', 'Peterbilt', '579', 2022, '1XPBD49X7MD123456', 'XYZ789', 'available'),
    ('TRK003', 'Kenworth', 'T680', 2023, '1XKWD49X7JD123456', 'DEF456', 'in_use'),
    ('TRK004', 'Volvo', 'VNL', 2022, '4V4NC9TJ7XN123456', 'GHI789', 'available'),
    ('TRK005', 'International', 'LT', 2023, '1HTMMAAL0XN123456', 'JKL012', 'maintenance'),
    ('TRK006', 'Mack', 'Anthem', 2022, '1M2AA18Y5WM123456', 'MNO345', 'available'),
    ('TRK007', 'Western Star', '5700XE', 2023, '1XKWD49X7KD123456', 'PQR678', 'available'),
    ('TRK008', 'Freightliner', 'Coronado', 2022, '1FUJA6CV83L789012', 'STU901', 'in_use')
ON CONFLICT (vehicle_number) DO NOTHING;

-- Insert sample loads
INSERT INTO loads (load_number, origin, destination, pickup_date, delivery_date, weight, rate, status) VALUES
    ('LD001', 'Los Angeles, CA', 'Phoenix, AZ', '2025-01-15', '2025-01-16', 42000, 2850.00, 'in_transit'),
    ('LD002', 'Dallas, TX', 'Atlanta, GA', '2025-01-13', '2025-01-15', 38500, 3200.00, 'picked_up'),
    ('LD003', 'Chicago, IL', 'Denver, CO', '2025-01-10', '2025-01-12', 45000, 2950.00, 'pending'),
    ('LD004', 'Miami, FL', 'New York, NY', '2025-01-08', '2025-01-10', 35000, 4100.00, 'delivered'),
    ('LD005', 'Detroit, MI', 'Jacksonville, FL', '2025-01-12', '2025-01-14', 40000, 3500.00, 'pending'),
    ('LD006', 'Portland, OR', 'Phoenix, AZ', '2025-01-11', '2025-01-13', 36000, 3800.00, 'in_transit'),
    ('LD007', 'Seattle, WA', 'San Francisco, CA', '2025-01-14', '2025-01-15', 32000, 2800.00, 'assigned'),
    ('LD008', 'Houston, TX', 'New Orleans, LA', '2025-01-16', '2025-01-17', 38000, 2200.00, 'pending')
ON CONFLICT (load_number) DO NOTHING;

-- Insert sample notifications (without user_id for now)
INSERT INTO notifications (message, type, link) VALUES
    ('Load LD001 has been assigned to you', 'load_assignment', '/loads/LD001'),
    ('Please confirm pickup for load LD002', 'pickup_reminder', '/loads/LD002'),
    ('Delivery completed for load LD004', 'delivery_complete', '/loads/LD004'),
    ('New route available for load LD006', 'route_update', '/loads/LD006'),
    ('Vehicle TRK005 requires maintenance', 'maintenance_alert', '/vehicles/TRK005'),
    ('Weekly performance report is ready', 'report', '/reports/weekly'),
    ('New driver application received', 'application', '/drivers/applications'),
    ('Insurance renewal reminder', 'reminder', '/settings/insurance')
ON CONFLICT DO NOTHING;

-- Insert sample sticky notes (without user_id for now)
INSERT INTO sticky_notes (title, content, color, position_x, position_y) VALUES
    ('Important Meeting', 'Call with ABC Manufacturing at 2 PM', '#fbbf24', 100, 100),
    ('Load Priority', 'LD003 needs to be assigned ASAP', '#ef4444', 300, 150),
    ('Maintenance', 'Schedule TRK005 for brake inspection', '#10b981', 500, 200),
    ('Driver Notes', 'Mike Johnson prefers West Coast routes', '#3b82f6', 200, 300),
    ('Quick Reminder', 'Submit weekly report by Friday', '#8b5cf6', 400, 250)
ON CONFLICT DO NOTHING;

-- Insert sample load confirmations
INSERT INTO load_confirmations (load_id, driver_id, notes) VALUES
    ((SELECT id FROM loads WHERE load_number = 'LD001' LIMIT 1), 
     (SELECT id FROM drivers WHERE license_number = 'DL123456789' LIMIT 1), 
     'Load confirmed, ready for pickup'),
    ((SELECT id FROM loads WHERE load_number = 'LD002' LIMIT 1), 
     (SELECT id FROM drivers WHERE license_number = 'DL234567890' LIMIT 1), 
     'Confirmed pickup time'),
    ((SELECT id FROM loads WHERE load_number = 'LD004' LIMIT 1), 
     (SELECT id FROM drivers WHERE license_number = 'DL345678901' LIMIT 1), 
     'Delivery completed successfully')
ON CONFLICT DO NOTHING;

-- Insert sample deliveries
INSERT INTO deliveries (load_id, driver_id, receiver_name, status) VALUES
    ((SELECT id FROM loads WHERE load_number = 'LD004' LIMIT 1), 
     (SELECT id FROM drivers WHERE license_number = 'DL345678901' LIMIT 1), 
     'John Smith - CVS Health', 'completed'),
    ((SELECT id FROM loads WHERE load_number = 'LD001' LIMIT 1), 
     (SELECT id FROM drivers WHERE license_number = 'DL123456789' LIMIT 1), 
     'Sarah Johnson - Walmart Distribution', 'in_progress')
ON CONFLICT DO NOTHING;

-- Insert sample file records
INSERT INTO file_records (load_id, file_type, file_url, file_size) VALUES
    ((SELECT id FROM loads WHERE load_number = 'LD001' LIMIT 1), 'bol', 'https://example.com/bol_ld001.pdf', 1024000),
    ((SELECT id FROM loads WHERE load_number = 'LD002' LIMIT 1), 'photo', 'https://example.com/pickup_ld002.jpg', 2048000),
    ((SELECT id FROM loads WHERE load_number = 'LD004' LIMIT 1), 'signature', 'https://example.com/signature_ld004.png', 512000)
ON CONFLICT DO NOTHING; 