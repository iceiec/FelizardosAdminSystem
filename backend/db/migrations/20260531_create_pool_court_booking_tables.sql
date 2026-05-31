-- Add real booking tables for pool and court modules so they can load persisted data

BEGIN;

CREATE TABLE IF NOT EXISTS pool_bookings (
  id UUID PRIMARY KEY,
  pool_id UUID NOT NULL REFERENCES pools(id) ON DELETE CASCADE,
  event_name VARCHAR(255) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_contact VARCHAR(100),
  client_facebook VARCHAR(255),
  event_date DATE NOT NULL,
  capacity INT NOT NULL DEFAULT 0,
  deposit_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  extras JSONB NOT NULL DEFAULT '[]'::jsonb,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS court_schedules (
  id UUID PRIMARY KEY,
  court_id UUID NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_slot VARCHAR(100) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_contact VARCHAR(100) NOT NULL,
  deposit_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pool_bookings_pool_id ON pool_bookings (pool_id);
CREATE INDEX IF NOT EXISTS idx_pool_bookings_event_date ON pool_bookings (event_date);
CREATE INDEX IF NOT EXISTS idx_court_schedules_court_id ON court_schedules (court_id);
CREATE INDEX IF NOT EXISTS idx_court_schedules_date ON court_schedules (date);

COMMIT;
