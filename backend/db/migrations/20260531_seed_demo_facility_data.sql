-- Seed demo facility and booking data so the modules show persisted records immediately

BEGIN;

INSERT INTO pavilions (id, name, capacity, location, status, hourly_rate, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Main Pavilion', 100, 'Building A', 'active', 1500.00, NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Garden Pavilion', 50, 'Garden Area', 'active', 1000.00, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO pools (id, name, size, depth, capacity, status, temperature, last_cleaned, created_at, updated_at)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'Olympic Pool', '50m x 25m', '2m', 200, 'open', 26.00, '2026-05-20', NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Kids Pool', '10m x 10m', '0.5m', 50, 'open', 28.00, '2026-05-20', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO courts (id, name, surface, status, next_booking, created_at, updated_at)
VALUES
  ('55555555-5555-5555-5555-555555555555', 'Juliet Court', 'Wood', 'available', '2026-05-22T10:00:00Z', NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', 'Andoy Court', 'Concrete', 'booked', '2026-05-22T14:00:00Z', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO pavilion_bookings (id, pavilion_id, event_name, client_name, client_contact, client_facebook, event_date, start_date, end_date, capacity, deposit_amount, total_amount, extras, status, created_at, updated_at)
VALUES
  ('77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'Birthday Party', 'John Smith', '09123456789', 'john.smith.fb', '2026-05-25', NULL, NULL, 50, 2000.00, 5000.00, '[]'::jsonb, 'confirmed', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO pool_bookings (id, pool_id, event_name, client_name, client_contact, client_facebook, event_date, capacity, deposit_amount, total_amount, extras, status, created_at, updated_at)
VALUES
  ('88888888-8888-8888-8888-888888888888', '33333333-3333-3333-3333-333333333333', 'Swim Meet', 'Aquatic Club', '09444555666', 'aquaticclub.fb', '2026-05-28', 150, 4000.00, 10000.00, '[]'::jsonb, 'confirmed', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO court_schedules (id, court_id, date, time_slot, client_name, client_contact, deposit_amount, total_amount, status, created_at, updated_at)
VALUES
  ('99999999-9999-9999-9999-999999999999', '55555555-5555-5555-5555-555555555555', '2026-05-25', '4pm-6pm', 'John Doe', '09123456789', 500.00, 1000.00, 'pending', NOW(), NOW()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666', '2026-05-27', '5pm-7pm', 'Mike Johnson', '09111222333', 500.00, 1000.00, 'pending', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;
