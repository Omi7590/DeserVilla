-- ============================================
-- HALL BOOKING ADVANCE PAYMENT SCHEMA
-- ============================================
-- This schema adds support for 50% advance payment
-- Run this after hall_booking_hourly_schema.sql

-- Add advance payment columns to hall_bookings
ALTER TABLE hall_bookings 
  ADD COLUMN IF NOT EXISTS advance_amount DECIMAL(10, 2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS remaining_amount DECIMAL(10, 2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS payment_mode VARCHAR(50) DEFAULT 'ONLINE_ADVANCE' 
    CHECK (payment_mode IN ('ONLINE_ADVANCE', 'FULL'));

-- Update payment_status to support ADVANCE_PAID
-- Note: MySQL doesn't support modifying CHECK constraints directly
-- We'll need to drop and recreate if needed, but for now we'll use ALTER to add the constraint
-- If payment_status already has a CHECK constraint, we may need to handle it differently

-- For existing records, calculate advance and remaining amounts
UPDATE hall_bookings 
SET 
  advance_amount = CASE 
    WHEN total_amount > 0 THEN total_amount / 2
    WHEN advance_amount > 0 THEN advance_amount
    ELSE 0
  END,
  remaining_amount = CASE 
    WHEN total_amount > 0 THEN total_amount / 2
    ELSE 0
  END,
  payment_mode = 'ONLINE_ADVANCE'
WHERE advance_amount IS NULL OR advance_amount = 0;

-- Update payment_status values for existing records
-- Convert 'PAID' to 'FULL_PAID' for legacy bookings
UPDATE hall_bookings 
SET payment_status = 'FULL_PAID'
WHERE payment_status = 'PAID' AND total_amount > 0 AND advance_amount = total_amount;

-- For bookings with advance only, set to ADVANCE_PAID
UPDATE hall_bookings 
SET payment_status = 'ADVANCE_PAID'
WHERE payment_status = 'PAID' AND total_amount > 0 AND advance_amount < total_amount;

-- Add index for payment status queries
CREATE INDEX IF NOT EXISTS idx_hall_bookings_payment_mode ON hall_bookings(payment_mode);
CREATE INDEX IF NOT EXISTS idx_hall_bookings_advance_status ON hall_bookings(payment_status, payment_mode);

-- Note: The payment_status column should support these values:
-- 'PENDING', 'ADVANCE_PAID', 'FULL_PAID', 'FAILED', 'REFUNDED'
-- If your existing schema has a CHECK constraint, you may need to modify it

