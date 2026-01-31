-- Admin Panel Database Schema Updates
-- MySQL/MariaDB Version
-- Run this to ensure all tables exist for the admin panel

-- Ensure payments table exists (for detailed payment tracking)
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    razorpay_payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_payments_order_id (order_id),
    INDEX idx_payments_status (status),
    INDEX idx_payments_created_at (created_at),
    INDEX idx_payments_razorpay_payment_id (razorpay_payment_id)
);

-- Ensure admin_users table has email field (if needed)
-- Note: Current schema uses username, which is fine
-- If you want to add email support, uncomment below:
-- ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;

-- Add table_number directly to orders for easier querying (if not exists)
-- This is already handled via table_id join, but we can add a view for convenience
CREATE OR REPLACE VIEW order_details AS
SELECT 
    o.id,
    o.table_id,
    t.table_number,
    o.total_amount,
    o.payment_status,
    o.order_status,
    o.razorpay_order_id,
    o.razorpay_payment_id,
    o.created_at,
    o.updated_at
FROM orders o
JOIN tables t ON o.table_id = t.id;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_updated_at ON orders(updated_at);
CREATE INDEX IF NOT EXISTS idx_menu_items_name ON menu_items(name);

