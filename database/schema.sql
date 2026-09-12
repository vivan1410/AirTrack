-- schema.sql
-- PostgreSQL Database Schema for AirTrack

-- Drop tables if they exist (clean setup)
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS flights;
DROP TABLE IF EXISTS gates;
DROP TABLE IF EXISTS administrators;
DROP TABLE IF EXISTS profiles;

-- 1. PASSENGER PROFILES TABLE
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ADMINISTRATORS TABLE
CREATE TABLE administrators (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL DEFAULT 'Operations Officer',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_admin_status CHECK (status IN ('active', 'suspended', 'inactive'))
);

-- Enable RLS and define Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE administrators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read their own passenger profile"
ON profiles FOR SELECT TO authenticated
USING (id = auth.uid());

CREATE POLICY "Allow authenticated users to insert their own passenger profile"
ON profiles FOR INSERT TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "Allow authenticated users to update their own passenger profile"
ON profiles FOR UPDATE TO authenticated
USING (id = auth.uid());

CREATE POLICY "Allow authenticated users to read their own administrator record"
ON administrators FOR SELECT TO authenticated
USING (lower(email) = lower(auth.jwt() ->> 'email'));

-- 3. GATES TABLE
CREATE TABLE gates (
    id SERIAL PRIMARY KEY,
    gate_number VARCHAR(10) NOT NULL UNIQUE,
    terminal VARCHAR(10) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Available',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_gate_status CHECK (status IN ('Available', 'Boarding', 'Occupied', 'Maintenance'))
);

-- 4. FLIGHTS TABLE
CREATE TABLE flights (
    id SERIAL PRIMARY KEY,
    flight_number VARCHAR(15) NOT NULL,
    airline VARCHAR(100) NOT NULL,
    airline_code VARCHAR(10) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    origin_code VARCHAR(10) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    destination_code VARCHAR(10) NOT NULL,
    scheduled_departure VARCHAR(10) NOT NULL,
    estimated_departure VARCHAR(10) NOT NULL,
    scheduled_arrival VARCHAR(10) NOT NULL,
    estimated_arrival VARCHAR(10) NOT NULL,
    terminal VARCHAR(10) NOT NULL,
    gate_id INTEGER REFERENCES gates(id) ON DELETE SET NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'On Time',
    delay_minutes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_delay_non_negative CHECK (delay_minutes >= 0)
);

-- 6. USEFUL INDEXES
CREATE INDEX idx_flights_flight_number ON flights(flight_number);
CREATE INDEX idx_flights_status ON flights(status);
CREATE INDEX idx_flights_destination ON flights(destination);
CREATE INDEX idx_flights_gate_id ON flights(gate_id);
CREATE INDEX idx_gates_terminal ON gates(terminal);

-- 7. AUTO-UPDATE UPDATED_AT TRIGGERS (PostgreSQL)
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gates_modtime
    BEFORE UPDATE ON gates
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_flights_modtime
    BEFORE UPDATE ON flights
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_administrators_modtime
    BEFORE UPDATE ON administrators
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

