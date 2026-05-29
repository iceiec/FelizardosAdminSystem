-- Migration: Add client info fields to pavilion_bookings
-- Run with: psql <connection-string> -f 20260529_add_client_fields_pavilion_bookings.sql

BEGIN;

ALTER TABLE pavilion_bookings
  ADD COLUMN IF NOT EXISTS client_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS client_contact VARCHAR(100),
  ADD COLUMN IF NOT EXISTS client_facebook VARCHAR(255);

-- Optional: add index on contact for faster lookups
CREATE INDEX IF NOT EXISTS idx_pavilion_bookings_client_contact ON pavilion_bookings (client_contact);

COMMIT;
