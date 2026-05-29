-- Migration: Add booking-related fields to pavilion_bookings
-- Adds event_name, event_date, start_date, end_date, extras, deposit_amount, total_amount

BEGIN;

ALTER TABLE pavilion_bookings
  ADD COLUMN IF NOT EXISTS event_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS event_date DATE,
  ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS extras JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS capacity INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12,2) DEFAULT 0;

ALTER TABLE pavilion_bookings
  ALTER COLUMN start_date DROP NOT NULL,
  ALTER COLUMN end_date DROP NOT NULL,
  ALTER COLUMN event_date DROP NOT NULL;

-- Ensure event_date is stored as a DATE, not a timestamp
ALTER TABLE pavilion_bookings
  ALTER COLUMN event_date TYPE DATE USING event_date::date;

CREATE INDEX IF NOT EXISTS idx_pavilion_bookings_event_date ON pavilion_bookings (event_date);
CREATE INDEX IF NOT EXISTS idx_pavilion_bookings_start_end ON pavilion_bookings (start_date, end_date);

COMMIT;
