-- ============================================
-- COMPLETE MYSQL SCHEMA FOR DESERT VILLA CAFE
-- ============================================
-- This is a complete schema file with all required tables
-- Run this in phpMyAdmin or MySQL CLI

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS cafe_ordering;
USE cafe_ordering;

-- ============================================
-- TABLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_number INT NOT NULL UNIQUE,
    capacity INT DEFAULT 4,
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default tables
INSERT INTO tables (table_number, capacity) VALUES
    (1, 4), (2, 4), (3, 4), (4, 4), (5, 4), (6, 4), (7, 4)
ON DUPLICATE KEY UPDATE table_number = table_number;

-- ============================================
-- MENU ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_is_available (is_available)
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    order_status VARCHAR(50) DEFAULT 'pending' CHECK (order_status IN ('pending', 'preparing', 'served')),
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE,
    INDEX idx_table_id (table_id),
    INDEX idx_payment_status (payment_status),
    INDEX idx_order_status (order_status),
    INDEX idx_created_at (created_at)
);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_menu_item_id (menu_item_id)
);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    razorpay_payment_id VARCHAR(255) UNIQUE,
    razorpay_order_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_payments_order_id (order_id),
    INDEX idx_payments_status (status),
    INDEX idx_payments_created_at (created_at)
);

-- ============================================
-- ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- HALL BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS hall_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    booking_date DATE NOT NULL,
    total_hours INT NOT NULL,
    total_amount INT NOT NULL,
    advance_amount INT NOT NULL,
    remaining_amount INT NOT NULL,
    payment_status ENUM('PENDING','ADVANCE_PAID','FULL_PAID') DEFAULT 'PENDING',
    booking_status ENUM('CONFIRMED','CANCELLED') DEFAULT 'CONFIRMED',
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_booking_date (booking_date),
    INDEX idx_payment_status (payment_status),
    INDEX idx_booking_status (booking_status),
    INDEX idx_created_at (created_at)
);

-- ============================================
-- HALL BOOKING SLOTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS hall_booking_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    CONSTRAINT fk_booking
        FOREIGN KEY (booking_id)
        REFERENCES hall_bookings(id)
        ON DELETE CASCADE,
    UNIQUE (booking_date, start_time),
    INDEX idx_booking_id (booking_id),
    INDEX idx_booking_date_time (booking_date, start_time),
    INDEX idx_booking_date (booking_date)
);

-- ============================================
-- BLOCKED SLOTS TABLE (Legacy - for backward compatibility)
-- ============================================
CREATE TABLE IF NOT EXISTS blocked_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL CHECK (time_slot IN ('morning', 'evening', 'full_day')),
    booking_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES hall_bookings(id) ON DELETE CASCADE,
    UNIQUE KEY unique_date_slot (booking_date, time_slot),
    INDEX idx_blocked_slots_date_slot (booking_date, time_slot)
);

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Insert default admin user (password: admin123)
-- IMPORTANT: Change password after first login!
INSERT INTO admin_users (username, password_hash) VALUES
    ('admin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')
ON DUPLICATE KEY UPDATE username = username;

-- Insert sample menu items (if table is empty)
INSERT INTO menu_items (name, price, category, description, image_url, is_available) VALUES
    ('Cappuccino', 149.00, 'Beverages', 'Rich espresso with steamed milk foam', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&h=600&fit=crop&q=80', TRUE),
    ('Hot Chocolate', 139.00, 'Beverages', 'Creamy hot chocolate with marshmallows', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=600&fit=crop&q=80', TRUE),
    ('Chocolate Lava Cake', 299.00, 'Desserts', 'Warm chocolate cake with molten center', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80', TRUE),
    ('Tiramisu', 349.00, 'Desserts', 'Classic Italian dessert with coffee and mascarpone', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop&q=80', TRUE),
    ('Iced Coffee', 149.00, 'Beverages', 'Cold brew coffee over ice', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop&q=80', TRUE),
    ('Chocolate Chip Cookies', 89.00, 'Snacks', 'Freshly baked cookies with chocolate chips', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop&q=80', TRUE),
    ('Macarons (6 pcs)', 399.00, 'Snacks', 'Assorted French macarons', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=600&fit=crop&q=80', TRUE)
ON DUPLICATE KEY UPDATE name = name;

-- ============================================
-- SCHEMA COMPLETE
-- ============================================
SELECT 'Schema imported successfully! All tables created.' as result;
