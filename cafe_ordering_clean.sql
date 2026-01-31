-- Desert Villa Database Schema

-- Table structure for table `admin_users`
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `admin_users` (`id`, `username`, `password_hash`, `created_at`) VALUES
(1, 'admin', '$2a$10$bJ.vTV9YsSLcEcg2mP.qkuYZRj/pQEi0VqyE9pUaFPHHYjX09pBrW', '2026-01-25 08:07:53');

-- Table structure for table `tables`
CREATE TABLE IF NOT EXISTS `tables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_number` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `capacity` int(11) DEFAULT 4,
  PRIMARY KEY (`id`),
  UNIQUE KEY `table_number` (`table_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `tables` (`id`, `table_number`, `created_at`, `capacity`) VALUES
(1, 1, '2026-01-25 08:07:52', 4),
(2, 2, '2026-01-25 08:07:52', 4),
(3, 3, '2026-01-25 08:07:52', 4),
(4, 4, '2026-01-25 08:07:52', 4),
(5, 5, '2026-01-25 08:07:52', 4),
(6, 6, '2026-01-25 08:07:52', 4),
(7, 7, '2026-01-25 08:07:52', 4);

-- Table structure for table `menu_items`
CREATE TABLE IF NOT EXISTS `menu_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_menu_items_category` (`category`),
  KEY `idx_menu_items_is_available` (`is_available`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `menu_items` (`id`, `name`, `price`, `category`, `description`, `image_url`, `is_available`, `created_at`) VALUES
(3, 'Red Velvet Cake', 279.00, 'Desserts', 'Moist red velvet with cream cheese frosting', 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&h=600&fit=crop&q=80', 1, '2026-01-25 08:07:53'),
(4, 'Cheesecake', 329.00, 'Desserts', 'New York style creamy cheesecake', 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&h=600&fit=crop&q=80', 1, '2026-01-25 08:07:53'),
(5, 'Brownie Sundae', 249.00, 'Desserts', 'Warm brownie with vanilla ice cream', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80', 1, '2026-01-25 08:07:53'),
(7, 'Latte', 159.00, 'Beverages', 'Espresso with steamed milk', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop&q=80', 1, '2026-01-25 08:07:53'),
(8, 'Mocha', 169.00, 'Beverages', 'Chocolate espresso with steamed milk', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop&q=80', 1, '2026-01-25 08:07:53'),
(13, 'Cappuccino', 149.00, 'Beverages', 'Rich espresso with steamed milk foam', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&h=600&fit=crop&q=80', 1, '2026-01-26 22:50:03'),
(14, 'Hot Chocolate', 139.00, 'Beverages', 'Creamy hot chocolate with marshmallows', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=600&fit=crop&q=80', 1, '2026-01-26 22:50:03'),
(15, 'Chocolate Lava Cake', 299.00, 'Desserts', 'Warm chocolate cake with molten center', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80', 1, '2026-01-26 22:50:03'),
(16, 'Tiramisu', 349.00, 'Desserts', 'Classic Italian dessert with coffee and mascarpone', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop&q=80', 1, '2026-01-26 22:50:03'),
(17, 'Iced Coffee', 149.00, 'Beverages', 'Cold brew coffee over ice', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop&q=80', 1, '2026-01-26 22:50:03'),
(18, 'Chocolate Chip Cookies', 89.00, 'Snacks', 'Freshly baked cookies with chocolate chips', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop&q=80', 1, '2026-01-26 22:50:03'),
(19, 'Macarons (6 pcs)', 399.00, 'Snacks', 'Assorted French macarons', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=600&fit=crop&q=80', 1, '2026-01-26 22:50:03');

-- Table structure for table `orders`
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_status` varchar(50) DEFAULT 'pending',
  `order_status` varchar(50) DEFAULT 'pending',
  `razorpay_order_id` varchar(255) DEFAULT NULL,
  `razorpay_payment_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_orders_table_id` (`table_id`),
  KEY `idx_orders_payment_status` (`payment_status`),
  KEY `idx_orders_order_status` (`order_status`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `order_items`
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `menu_item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order_id` (`order_id`),
  KEY `idx_order_items_menu_item_id` (`menu_item_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `payments`
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `razorpay_payment_id` varchar(255) DEFAULT NULL,
  `razorpay_order_id` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `razorpay_payment_id` (`razorpay_payment_id`),
  KEY `idx_payments_order_id` (`order_id`),
  KEY `idx_payments_status` (`status`),
  KEY `idx_payments_created_at` (`created_at`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `hall_bookings`
CREATE TABLE IF NOT EXISTS `hall_bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `booking_date` date NOT NULL,
  `time_slot` varchar(50) NOT NULL,
  `people_count` int(11) NOT NULL,
  `occasion` varchar(255) DEFAULT NULL,
  `special_request` text DEFAULT NULL,
  `advance_amount` decimal(10,2) NOT NULL,
  `remaining_amount` decimal(10,2) DEFAULT 0.00,
  `total_hours` int(11) DEFAULT 0,
  `total_amount` decimal(10,2) DEFAULT 0.00,
  `payment_mode` varchar(50) DEFAULT 'ONLINE_ADVANCE',
  `payment_status` varchar(50) DEFAULT 'PENDING',
  `booking_status` varchar(50) DEFAULT 'PENDING',
  `razorpay_order_id` varchar(255) DEFAULT NULL,
  `razorpay_payment_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_hall_bookings_date` (`booking_date`),
  KEY `idx_hall_bookings_slot` (`time_slot`),
  KEY `idx_hall_bookings_payment_status` (`payment_status`),
  KEY `idx_hall_bookings_booking_status` (`booking_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `hall_booking_slots`
CREATE TABLE IF NOT EXISTS `hall_booking_slots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `booking_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_date` (`booking_date`,`start_time`),
  KEY `idx_booking_id` (`booking_id`),
  KEY `idx_booking_date_time` (`booking_date`,`start_time`),
  KEY `idx_booking_date` (`booking_date`),
  CONSTRAINT `fk_booking` FOREIGN KEY (`booking_id`) REFERENCES `hall_bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Table structure for table `blocked_slots`
CREATE TABLE IF NOT EXISTS `blocked_slots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_date` date NOT NULL,
  `time_slot` varchar(50) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_date_slot` (`booking_date`,`time_slot`),
  KEY `booking_id` (`booking_id`),
  KEY `idx_blocked_slots_date_slot` (`booking_date`,`time_slot`),
  CONSTRAINT `blocked_slots_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `hall_bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
