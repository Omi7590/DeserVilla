-- ============================================
-- FIX HALL BOOKINGS COLUMNS
-- ============================================
-- This script safely adds missing columns to hall_bookings table
-- Run this if you're getting "Server error" in admin panel

-- Check and add total_hours column
SET @dbname = DATABASE();
SET @tablename = 'hall_bookings';
SET @columnname = 'total_hours';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT DEFAULT 1')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Check and add total_amount column
SET @columnname = 'total_amount';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(10, 2) DEFAULT 0.00')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Check and add remaining_amount column
SET @columnname = 'remaining_amount';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DECIMAL(10, 2) DEFAULT 0.00')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Check and add payment_mode column
SET @columnname = 'payment_mode';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, " VARCHAR(50) DEFAULT 'ONLINE_ADVANCE'")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Update existing records
UPDATE hall_bookings 
SET 
  remaining_amount = IFNULL(remaining_amount, IFNULL(total_amount, advance_amount) / 2),
  payment_mode = IFNULL(payment_mode, 'ONLINE_ADVANCE')
WHERE remaining_amount IS NULL OR payment_mode IS NULL;

-- Ensure hall_booking_slots table exists
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

SELECT 'All columns added successfully!' as result;

