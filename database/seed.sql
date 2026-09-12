-- seed.sql
-- Seed Data for AirTrack PostgreSQL Database

-- 1. TRUNCATE EXISTING TABLES
TRUNCATE TABLE flights, gates, administrators, profiles RESTART IDENTITY CASCADE;

-- Seed default authorized administrators
INSERT INTO administrators (email, name, role, status) VALUES
('admin@airtrack.demo', 'Operations Officer', 'Super Administrator', 'active');

-- Seed default passenger profile
INSERT INTO profiles (id, name, email) VALUES
('00000000-0000-0000-0000-000000000001', 'John Passenger', 'passenger@airtrack.demo')
ON CONFLICT (email) DO NOTHING;

-- 2. INSERT GATES
-- Insert 9 gates distributed across Terminal 1 and Terminal 2
INSERT INTO gates (gate_number, terminal, status) VALUES
('A01', '1', 'Boarding'),
('A02', '1', 'Available'),
('A03', '1', 'Occupied'),
('A04', '1', 'Available'),
('B01', '2', 'Occupied'),
('B02', '2', 'Available'),
('B03', '2', 'Available'),
('B04', '2', 'Boarding'),
('B05', '2', 'Maintenance');

-- 3. INSERT FLIGHTS
-- Seed 10 realistic Indian & international flights centered around Chennai (MAA).
-- Map gate references correctly to match their designated gate_id from above.
-- (ID mappings match the sequence of insert statements in SQL)
INSERT INTO flights (
    flight_number, airline, airline_code, 
    origin, origin_code, destination, destination_code, 
    scheduled_departure, estimated_departure, 
    scheduled_arrival, estimated_arrival, 
    terminal, gate_id, status, delay_minutes
) VALUES
(
    'AI 539', 'Air India', 'AI', 
    'Indira Gandhi International Airport, Delhi', 'DEL', 
    'Chennai International Airport, Chennai', 'MAA', 
    '14:30', '15:05', '17:15', '17:50', 
    '2', 8, 'Delayed', 35
),
(
    '6E 621', 'IndiGo', '6E', 
    'Kempegowda International Airport, Bengaluru', 'BLR', 
    'Chennai International Airport, Chennai', 'MAA', 
    '08:15', '08:15', '09:20', '09:20', 
    '1', 1, 'Boarding', 0
),
(
    'UK 832', 'Vistara', 'UK', 
    'Chhatrapati Shivaji Maharaj Airport, Mumbai', 'BOM', 
    'Chennai International Airport, Chennai', 'MAA', 
    '11:50', '11:50', '13:45', '13:45', 
    '1', 3, 'On Time', 0
),
(
    'SG 401', 'SpiceJet', 'SG', 
    'Chennai International Airport, Chennai', 'MAA', 
    'Indira Gandhi International Airport, Delhi', 'DEL', 
    '17:10', '17:10', '19:50', '19:50', 
    '2', 5, 'On Time', 0
),
(
    'EK 542', 'Emirates', 'EK', 
    'Chennai International Airport, Chennai', 'MAA', 
    'Dubai International Airport, Dubai', 'DXB', 
    '09:45', '09:45', '12:15', '12:15', 
    '2', 6, 'Departed', 0
),
(
    'QR 528', 'Qatar Airways', 'QR', 
    'Chennai International Airport, Chennai', 'MAA', 
    'Hamad International Airport, Doha', 'DOH', 
    '04:10', '04:10', '06:20', '06:20', 
    '1', 2, 'Departed', 0
),
(
    'AI 440', 'Air India', 'AI', 
    'Chennai International Airport, Chennai', 'MAA', 
    'Chhatrapati Shivaji Maharaj Airport, Mumbai', 'BOM', 
    '19:30', '20:15', '21:20', '22:05', 
    '2', 8, 'Gate Changed', 45
),
(
    'IX 382', 'Air India Express', 'IX', 
    'Netaji Subhash Chandra Bose Airport, Kolkata', 'CCU', 
    'Chennai International Airport, Chennai', 'MAA', 
    '13:00', '--:--', '15:20', '--:--', 
    '--', NULL, 'Cancelled', 0
),
(
    '6E 531', 'IndiGo', '6E', 
    'Chennai International Airport, Chennai', 'MAA', 
    'Kempegowda International Airport, Bengaluru', 'BLR', 
    '21:00', '21:00', '22:05', '22:05', 
    '2', 7, 'Scheduled', 0
),
(
    'UK 845', 'Vistara', 'UK', 
    'Chennai International Airport, Chennai', 'MAA', 
    'Netaji Subhash Chandra Bose Airport, Kolkata', 'CCU', 
    '22:30', '22:30', '00:50', '00:50', 
    '1', 4, 'Scheduled', 0
);

