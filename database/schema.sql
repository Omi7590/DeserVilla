-- QR-Based Café Ordering System Database Schema
-- Supports PostgreSQL and MySQL

-- Tables
CREATE TABLE IF NOT EXISTS tables (
    id SERIAL PRIMARY KEY,
    table_number INTEGER UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
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
    id SERIAL PRIMARY KEY,
    table_id INTEGER NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    order_status VARCHAR(50) DEFAULT 'pending',
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    menu_item_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Admin Users (for admin panel authentication)
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
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
ON CONFLICT (table_number) DO NOTHING;

-- Insert sample menu items
INSERT INTO menu_items (name, price, category, description, is_available) VALUES
    ('Chocolate Lava Cake', 299.00, 'Desserts', 'Warm chocolate cake with molten center', TRUE),
    ('Tiramisu', 349.00, 'Desserts', 'Classic Italian dessert with coffee and mascarpone', TRUE),
    ('Red Velvet Cake', 279.00, 'Desserts', 'Moist red velvet with cream cheese frosting', TRUE),
    ('Cheesecake', 329.00, 'Desserts', 'New York style creamy cheesecake', TRUE),
    ('Brownie Sundae', 249.00, 'Desserts', 'Warm brownie with vanilla ice cream', TRUE),
    ('Cappuccino', 149.00, 'Beverages', 'Espresso with steamed milk foam', TRUE),
    ('Latte', 159.00, 'Beverages', 'Espresso with steamed milk', TRUE),
    ('Mocha', 169.00, 'Beverages', 'Chocolate espresso with steamed milk', TRUE),
    ('Hot Chocolate', 139.00, 'Beverages', 'Rich chocolate drink with whipped cream', TRUE),
    ('Iced Coffee', 149.00, 'Beverages', 'Cold brew coffee over ice', TRUE),
    ('Chocolate Chip Cookies', 89.00, 'Snacks', 'Freshly baked cookies with chocolate chips', TRUE),
    ('Macarons (6 pcs)', 399.00, 'Snacks', 'Assorted French macarons', TRUE)
ON CONFLICT DO NOTHING;

-- Insert default admin user
-- IMPORTANT: After running this schema, set up admin password using:
--   cd backend && node scripts/setupAdmin.js
-- Default credentials: username='admin', password='admin123'
-- This is a placeholder hash - you MUST run setupAdmin.js to set a proper password
INSERT INTO admin_users (username, password_hash) VALUES
    ('admin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- HALL BOOKING MODULE TABLES
-- ============================================

-- Hall Bookings
CREATE TABLE IF NOT EXISTS hall_bookings (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL CHECK (time_slot IN ('morning', 'evening', 'full_day')),
    people_count INTEGER NOT NULL CHECK (people_count > 0),
    occasion VARCHAR(255),
    special_request TEXT,
    advance_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    booking_status VARCHAR(50) DEFAULT 'CONFIRMED' CHECK (booking_status IN ('CONFIRMED', 'COMPLETED', 'CANCELLED')),
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blocked Slots (for preventing double bookings)
CREATE TABLE IF NOT EXISTS blocked_slots (
    id SERIAL PRIMARY KEY,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL CHECK (time_slot IN ('morning', 'evening', 'full_day')),
    booking_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES hall_bookings(id) ON DELETE CASCADE,
    UNIQUE(booking_date, time_slot)
);

-- Indexes for hall bookings
CREATE INDEX IF NOT EXISTS idx_hall_bookings_date ON hall_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_hall_bookings_slot ON hall_bookings(time_slot);
CREATE INDEX IF NOT EXISTS idx_hall_bookings_payment_status ON hall_bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_hall_bookings_booking_status ON hall_bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_blocked_slots_date_slot ON blocked_slots(booking_date, time_slot);

