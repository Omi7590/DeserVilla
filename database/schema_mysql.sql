-- QR-Based Café Ordering System Database Schema
-- MySQL/MariaDB Version for XAMPP

-- Create database (run this first if database doesn't exist)
-- CREATE DATABASE IF NOT EXISTS cafe_ordering;
-- USE cafe_ordering;

-- Tables
CREATE TABLE IF NOT EXISTS tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_number INT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    order_status VARCHAR(50) DEFAULT 'pending',
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Admin Users (for admin panel authentication)
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_table_id ON orders(table_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item_id ON order_items(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_available ON menu_items(is_available);

-- Insert default tables (7 tables)
INSERT INTO tables (table_number) VALUES
    (1), (2), (3), (4), (5), (6), (7)
ON DUPLICATE KEY UPDATE table_number = table_number;

-- Insert sample menu items with beautiful images
INSERT INTO menu_items (name, price, category, description, image_url, is_available) VALUES
    ('Chocolate Lava Cake', 299.00, 'Desserts', 'Warm chocolate cake with molten center', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80', TRUE),
    ('Tiramisu', 349.00, 'Desserts', 'Classic Italian dessert with coffee and mascarpone', 'https://images.unsplash.com/photo-1571877227209-0a0d98ea607e9?w=800&h=600&fit=crop&q=80', TRUE),
    ('Red Velvet Cake', 279.00, 'Desserts', 'Moist red velvet with cream cheese frosting', 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&h=600&fit=crop&q=80', TRUE),
    ('Cheesecake', 329.00, 'Desserts', 'New York style creamy cheesecake', 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&h=600&fit=crop&q=80', TRUE),
    ('Brownie Sundae', 249.00, 'Desserts', 'Warm brownie with vanilla ice cream', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80', TRUE),
    ('Cappuccino', 149.00, 'Beverages', 'Espresso with steamed milk foam', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&h=600&fit=crop&q=80', TRUE),
    ('Latte', 159.00, 'Beverages', 'Espresso with steamed milk', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop&q=80', TRUE),
    ('Mocha', 169.00, 'Beverages', 'Chocolate espresso with steamed milk', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop&q=80', TRUE),
    ('Hot Chocolate', 139.00, 'Beverages', 'Rich chocolate drink with whipped cream', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop&q=80', TRUE),
    ('Iced Coffee', 149.00, 'Beverages', 'Cold brew coffee over ice', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop&q=80', TRUE),
    ('Chocolate Chip Cookies', 89.00, 'Snacks', 'Freshly baked cookies with chocolate chips', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop&q=80', TRUE),
    ('Macarons (6 pcs)', 399.00, 'Snacks', 'Assorted French macarons', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=600&fit=crop&q=80', TRUE)
ON DUPLICATE KEY UPDATE name = name;

-- Insert default admin user
-- IMPORTANT: After running this schema, set up admin password using:
--   cd backend && node scripts/setupAdmin.js
-- Default credentials: username='admin', password='admin123'
-- This is a placeholder hash - you MUST run setupAdmin.js to set a proper password
INSERT INTO admin_users (username, password_hash) VALUES
    ('admin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')
ON DUPLICATE KEY UPDATE username = username;

-- ============================================
-- HALL BOOKING MODULE TABLES
-- ============================================

-- Hall Bookings
CREATE TABLE IF NOT EXISTS hall_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL CHECK (time_slot IN ('morning', 'evening', 'full_day')),
    people_count INT NOT NULL CHECK (people_count > 0),
    occasion VARCHAR(255),
    special_request TEXT,
    advance_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    booking_status VARCHAR(50) DEFAULT 'CONFIRMED' CHECK (booking_status IN ('CONFIRMED', 'COMPLETED', 'CANCELLED')),
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Blocked Slots (for preventing double bookings)
CREATE TABLE IF NOT EXISTS blocked_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL CHECK (time_slot IN ('morning', 'evening', 'full_day')),
    booking_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES hall_bookings(id) ON DELETE CASCADE,
    UNIQUE KEY unique_date_slot (booking_date, time_slot)
);

-- Indexes for hall bookings
CREATE INDEX IF NOT EXISTS idx_hall_bookings_date ON hall_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_hall_bookings_slot ON hall_bookings(time_slot);
CREATE INDEX IF NOT EXISTS idx_hall_bookings_payment_status ON hall_bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_hall_bookings_booking_status ON hall_bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_blocked_slots_date_slot ON blocked_slots(booking_date, time_slot);

