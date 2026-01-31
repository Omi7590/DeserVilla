-- ============================================
-- HALL BOOKING HOURLY SLOTS SCHEMA
-- ============================================
-- This schema modifies the hall booking system to support hourly slot-based booking
-- Run this after the base schema_mysql.sql

-- Modify hall_bookings table to support hourly booking
ALTER TABLE hall_bookings 
  ADD COLUMN IF NOT EXISTS total_hours INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10, 2) DEFAULT 0.00;

-- Update existing records if needed
UPDATE hall_bookings 
SET total_hours = CASE 
  WHEN time_slot = 'morning' THEN 5
  WHEN time_slot = 'evening' THEN 5
  WHEN time_slot = 'full_day' THEN 10
  ELSE 1
END,
total_amount = CASE 
  WHEN time_slot = 'morning' THEN 2500.00
  WHEN time_slot = 'evening' THEN 2500.00
  WHEN time_slot = 'full_day' THEN 5000.00
  ELSE advance_amount
END
WHERE total_hours IS NULL OR total_hours = 0;

-- Create hall_booking_slots table for hourly slots
CREATE TABLE IF NOT EXISTS hall_booking_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES hall_bookings(id) ON DELETE CASCADE,
    UNIQUE KEY unique_date_time (booking_date, start_time),
    INDEX idx_booking_date_time (booking_date, start_time),
    INDEX idx_booking_id (booking_id)
);

-- Add index for fast availability checks
CREATE INDEX IF NOT EXISTS idx_hall_bookings_date_status 
ON hall_bookings(booking_date, booking_status, payment_status);

-- Note: The time_slot column in hall_bookings can remain for backward compatibility
-- but new bookings will use hall_booking_slots table

