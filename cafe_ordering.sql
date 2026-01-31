-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 31, 2026 at 02:58 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cafe_ordering`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `username`, `password_hash`, `created_at`) VALUES
(1, 'admin', '$2a$10$bJ.vTV9YsSLcEcg2mP.qkuYZRj/pQEi0VqyE9pUaFPHHYjX09pBrW', '2026-01-25 08:07:53');

-- --------------------------------------------------------

--
-- Table structure for table `blocked_slots`
--

CREATE TABLE `blocked_slots` (
  `id` int(11) NOT NULL,
  `booking_date` date NOT NULL,
  `time_slot` varchar(50) NOT NULL CHECK (`time_slot` in ('morning','evening','full_day')),
  `booking_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blocked_slots`
--

INSERT INTO `blocked_slots` (`id`, `booking_date`, `time_slot`, `booking_id`, `created_at`) VALUES
(1, '2026-01-30', 'morning', 1, '2026-01-25 08:27:09'),
(2, '2026-01-29', 'morning', 2, '2026-01-25 08:30:45'),
(3, '2026-01-28', 'morning', 3, '2026-01-25 08:36:50'),
(4, '2026-01-28', 'evening', 4, '2026-01-25 09:32:09'),
(5, '2026-01-28', 'full_day', 5, '2026-01-26 01:43:03');

-- --------------------------------------------------------

--
-- Table structure for table `hall_bookings`
--

CREATE TABLE `hall_bookings` (
  `id` int(11) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `booking_date` date NOT NULL,
  `time_slot` varchar(50) NOT NULL,
  `people_count` int(11) NOT NULL CHECK (`people_count` > 0),
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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hall_bookings`
--

INSERT INTO `hall_bookings` (`id`, `customer_name`, `mobile`, `booking_date`, `time_slot`, `people_count`, `occasion`, `special_request`, `advance_amount`, `remaining_amount`, `total_hours`, `total_amount`, `payment_mode`, `payment_status`, `booking_status`, `razorpay_order_id`, `razorpay_payment_id`, `created_at`, `updated_at`) VALUES
(1, 'Test User', '9876543210', '2026-01-30', 'morning', 10, NULL, NULL, 5000.00, 0.00, 0, 0.00, 'ONLINE_ADVANCE', 'PENDING', 'CANCELLED', NULL, NULL, '2026-01-25 08:27:09', '2026-01-26 23:14:12'),
(2, 'Test User', '9876543210', '2026-01-29', 'morning', 10, NULL, NULL, 5000.00, 0.00, 0, 0.00, 'ONLINE_ADVANCE', 'PENDING', 'CONFIRMED', NULL, NULL, '2026-01-25 08:30:45', '2026-01-25 08:30:45'),
(3, 'Akash Navnath Jarhad', '9011322197', '2026-01-28', 'morning', 7, 'Birthday', 'nooo', 5000.00, 0.00, 0, 0.00, 'ONLINE_ADVANCE', 'PENDING', 'CONFIRMED', NULL, NULL, '2026-01-25 08:36:50', '2026-01-25 08:36:50'),
(4, 'aa', '8000000000', '2026-01-28', 'evening', 6, 'hhg', NULL, 6000.00, 0.00, 0, 0.00, 'ONLINE_ADVANCE', 'PENDING', 'CONFIRMED', NULL, NULL, '2026-01-25 09:32:09', '2026-01-25 09:32:09'),
(5, 'Akash', '9011322197', '2026-01-28', 'full_day', 8, 'Bday', '....', 10000.00, 0.00, 0, 0.00, 'ONLINE_ADVANCE', 'PENDING', 'CONFIRMED', 'order_S8NzjyimtSn414', NULL, '2026-01-26 01:43:03', '2026-01-26 01:56:03'),
(6, 'kk', '9011322197', '2026-01-28', 'hourly', 1, 'Bday', ',', 500.00, 500.00, 2, 1000.00, 'ONLINE_ADVANCE', 'PENDING', 'PENDING', 'order_S8jeFwPmvSmyb5', NULL, '2026-01-26 23:01:57', '2026-01-26 23:07:01'),
(8, 'akash', '9011322197', '2026-01-28', 'hourly', 1, 'Bday', 'l', 250.00, 250.00, 1, 500.00, 'ONLINE_ADVANCE', 'PENDING', 'PENDING', 'order_S8oYl2sdnmPX5j', NULL, '2026-01-27 03:55:14', '2026-01-27 03:55:17'),
(9, 'priya', '8999495002', '2026-01-30', 'hourly', 1, 'bday', NULL, 250.00, 250.00, 1, 500.00, 'ONLINE_ADVANCE', 'PENDING', 'PENDING', NULL, NULL, '2026-01-27 03:57:51', '2026-01-27 03:57:51');

-- --------------------------------------------------------

--
-- Table structure for table `hall_booking_slots`
--

CREATE TABLE `hall_booking_slots` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `booking_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hall_booking_slots`
--

INSERT INTO `hall_booking_slots` (`id`, `booking_id`, `booking_date`, `start_time`, `end_time`) VALUES
(1, 6, '2026-01-28', '10:00:00', '11:00:00'),
(2, 6, '2026-01-28', '11:00:00', '12:00:00'),
(4, 8, '2026-01-28', '13:00:00', '14:00:00'),
(5, 9, '2026-01-30', '13:00:00', '14:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_items`
--

INSERT INTO `menu_items` (`id`, `name`, `price`, `category`, `description`, `image_url`, `is_available`, `created_at`) VALUES
(3, 'Red Velvet Cake', 279.00, 'Desserts', 'Moist red velvet with cream cheese frosting', 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&h=600&fit=crop&q=80', 1, '2026-01-25 08:07:53'),
(4, 'Cheesecake', 329.00, 'Desserts', 'New York style creamy cheesecake', 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&h=600&fit=crop&q=80', 1, '2026-01-25 08:07:53'),
(5, 'Brownie Sundae', 249.00, 'Desserts', 'Warm brownie with vanilla ice cream', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80', 1, '2026-01-25 08:07:53'),
(7, 'Latte', 159.00, 'Beverages', 'Espresso with steamed milk', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop&q=80', 1, '2026-01-25 08:07:53'),
(8, 'Mocha', 169.00, 'Beverages', 'Chocolate espresso with steamed milk', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop&q=80', 1, '2026-01-25 08:07:53'),
(13, 'Cappuccino', 1.00, 'Beverages', 'Rich espresso with steamed milk foam', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&h=600&fit=crop&q=80', 1, '2026-01-26 22:50:03'),
(14, 'Hot Chocolate', 139.00, 'Beverages', 'Creamy hot chocolate with marshmallows', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=600&fit=crop&q=80', 1, '2026-01-26 22:50:03'),
(15, 'Chocolate Lava Cake', 299.00, 'Desserts', 'Warm chocolate cake with molten center', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80', 1, '2026-01-26 22:50:03'),
(16, 'Tiramisu', 349.00, 'Desserts', 'Classic Italian dessert with coffee and mascarpone', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop&q=80', 1, '2026-01-26 22:50:03'),
(17, 'Iced Coffee', 149.00, 'Beverages', 'Cold brew coffee over ice', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop&q=80', 1, '2026-01-26 22:50:03'),
(18, 'Chocolate Chip Cookies', 89.00, 'Snacks', 'Freshly baked cookies with chocolate chips', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop&q=80', 1, '2026-01-26 22:50:03'),
(19, 'Macarons (6 pcs)', 399.00, 'Snacks', 'Assorted French macarons', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=600&fit=crop&q=80', 1, '2026-01-26 22:50:03');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `table_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_status` varchar(50) DEFAULT 'pending',
  `order_status` varchar(50) DEFAULT 'pending',
  `razorpay_order_id` varchar(255) DEFAULT NULL,
  `razorpay_payment_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `table_id`, `total_amount`, `payment_status`, `order_status`, `razorpay_order_id`, `razorpay_payment_id`, `created_at`, `updated_at`) VALUES
(1, 3, 556.00, 'pending', 'preparing', NULL, NULL, '2026-01-25 22:37:00', '2026-01-26 00:29:00'),
(2, 1, 278.00, 'pending', 'pending', 'order_S8OXaeAc0zUae2', NULL, '2026-01-26 02:28:04', '2026-01-26 02:28:06'),
(3, 7, 278.00, 'pending', 'pending', 'order_S8OYBje6XoH1xb', NULL, '2026-01-26 02:28:39', '2026-01-26 02:28:39'),
(4, 7, 745.00, 'pending', 'pending', 'order_S8OjC0coX6pN8a', NULL, '2026-01-26 02:39:04', '2026-01-26 02:39:05'),
(5, 7, 745.00, 'pending', 'pending', 'order_S8OjSum5Q3nrOa', NULL, '2026-01-26 02:39:20', '2026-01-26 02:39:20'),
(6, 1, 139.00, 'pending', 'pending', 'order_S8OpRrEf6nvcxc', NULL, '2026-01-26 02:44:51', '2026-01-26 02:45:00'),
(7, 3, 149.00, 'pending', 'pending', 'order_S8jYIst7gmagvK', NULL, '2026-01-26 23:01:21', '2026-01-26 23:01:22'),
(8, 2, 298.00, 'pending', 'pending', 'order_S98EvCBNS0NuRp', NULL, '2026-01-27 23:10:22', '2026-01-27 23:10:23'),
(9, 2, 298.00, 'pending', 'pending', 'order_S98GtDGNVlm3rU', NULL, '2026-01-27 23:12:07', '2026-01-27 23:12:15'),
(10, 2, 745.00, 'pending', 'pending', 'order_S98HB3JdrqPIxD', NULL, '2026-01-27 23:12:28', '2026-01-27 23:12:31'),
(11, 1, 149.00, 'paid', 'served', 'order_S98a8z2CmxZv7f', 'pay_S98exLjSOxFxMs', '2026-01-27 23:30:28', '2026-01-28 09:40:48'),
(12, 7, 149.00, 'paid', 'preparing', 'order_S9JdY8QtAllAEr', 'pay_S9JgJ1sIstfhfZ', '2026-01-28 10:19:18', '2026-01-28 10:22:40'),
(13, 1, 149.00, 'paid', 'pending', 'order_SA9Un1O0zm17Le', 'pay_SA9W9iofDkWQpP', '2026-01-30 13:03:08', '2026-01-30 13:05:25'),
(14, 1, 149.00, 'pending', 'pending', 'order_SATp9h3yQtOiHG', NULL, '2026-01-31 08:56:18', '2026-01-31 08:56:20'),
(15, 1, 149.00, 'pending', 'pending', 'order_SATtq6d9ewuSea', NULL, '2026-01-31 09:00:44', '2026-01-31 09:00:46'),
(16, 1, 149.00, 'pending', 'pending', 'order_SATz1N95z0gAM2', NULL, '2026-01-31 09:05:39', '2026-01-31 09:05:40'),
(17, 1, 149.00, 'pending', 'pending', 'order_SAVg9JpOaATRSe', NULL, '2026-01-31 10:45:11', '2026-01-31 10:45:11'),
(18, 1, 1.00, 'paid', 'pending', 'order_SAVhD53sHAGSKL', 'pay_SAVirtjeQPDrab', '2026-01-31 10:46:11', '2026-01-31 10:48:01'),
(19, 1, 1.00, 'pending', 'pending', 'order_SAVkDNvGbe2NPi', NULL, '2026-01-31 10:49:02', '2026-01-31 10:49:02');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `menu_item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `menu_item_id`, `quantity`, `price`, `created_at`) VALUES
(7, 7, 13, 1, 149.00, '2026-01-26 23:01:21'),
(8, 8, 13, 2, 149.00, '2026-01-27 23:10:22'),
(9, 9, 13, 2, 149.00, '2026-01-27 23:12:07'),
(10, 10, 13, 5, 149.00, '2026-01-27 23:12:28'),
(11, 11, 13, 1, 149.00, '2026-01-27 23:30:28'),
(12, 12, 13, 1, 149.00, '2026-01-28 10:19:18'),
(13, 13, 13, 1, 149.00, '2026-01-30 13:03:08'),
(14, 14, 13, 1, 149.00, '2026-01-31 08:56:18'),
(15, 15, 13, 1, 149.00, '2026-01-31 09:00:44'),
(16, 16, 13, 1, 149.00, '2026-01-31 09:05:39'),
(17, 17, 13, 1, 149.00, '2026-01-31 10:45:11'),
(18, 18, 13, 1, 1.00, '2026-01-31 10:46:11'),
(19, 19, 13, 1, 1.00, '2026-01-31 10:49:02');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `razorpay_payment_id` varchar(255) DEFAULT NULL,
  `razorpay_order_id` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending' CHECK (`status` in ('pending','paid','failed','refunded')),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `razorpay_payment_id`, `razorpay_order_id`, `amount`, `status`, `created_at`, `updated_at`) VALUES
(1, 11, 'pay_S98exLjSOxFxMs', 'order_S98a8z2CmxZv7f', 149.00, 'paid', '2026-01-27 23:36:13', '2026-01-27 23:36:13'),
(2, 12, 'pay_S9JgJ1sIstfhfZ', 'order_S9JdY8QtAllAEr', 149.00, 'paid', '2026-01-28 10:22:15', '2026-01-28 10:22:15'),
(3, 13, 'pay_SA9W9iofDkWQpP', 'order_SA9Un1O0zm17Le', 149.00, 'paid', '2026-01-30 13:05:25', '2026-01-30 13:05:25'),
(4, 18, 'pay_SAVirtjeQPDrab', 'order_SAVhD53sHAGSKL', 1.00, 'paid', '2026-01-31 10:48:01', '2026-01-31 10:48:01');

-- --------------------------------------------------------

--
-- Table structure for table `tables`
--

CREATE TABLE `tables` (
  `id` int(11) NOT NULL,
  `table_number` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `capacity` int(11) DEFAULT 4
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tables`
--

INSERT INTO `tables` (`id`, `table_number`, `created_at`, `capacity`) VALUES
(1, 1, '2026-01-25 08:07:52', 4),
(2, 2, '2026-01-25 08:07:52', 4),
(3, 3, '2026-01-25 08:07:52', 4),
(4, 4, '2026-01-25 08:07:52', 4),
(5, 5, '2026-01-25 08:07:52', 4),
(6, 6, '2026-01-25 08:07:52', 4),
(7, 7, '2026-01-25 08:07:52', 4);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `blocked_slots`
--
ALTER TABLE `blocked_slots`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_date_slot` (`booking_date`,`time_slot`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `idx_blocked_slots_date_slot` (`booking_date`,`time_slot`);

--
-- Indexes for table `hall_bookings`
--
ALTER TABLE `hall_bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_hall_bookings_date` (`booking_date`),
  ADD KEY `idx_hall_bookings_slot` (`time_slot`),
  ADD KEY `idx_hall_bookings_payment_status` (`payment_status`),
  ADD KEY `idx_hall_bookings_booking_status` (`booking_status`);

--
-- Indexes for table `hall_booking_slots`
--
ALTER TABLE `hall_booking_slots`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_date` (`booking_date`,`start_time`),
  ADD KEY `idx_booking_id` (`booking_id`),
  ADD KEY `idx_booking_date_time` (`booking_date`,`start_time`),
  ADD KEY `idx_booking_date` (`booking_date`);

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_menu_items_category` (`category`),
  ADD KEY `idx_menu_items_is_available` (`is_available`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_orders_table_id` (`table_id`),
  ADD KEY `idx_orders_payment_status` (`payment_status`),
  ADD KEY `idx_orders_order_status` (`order_status`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_items_order_id` (`order_id`),
  ADD KEY `idx_order_items_menu_item_id` (`menu_item_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `razorpay_payment_id` (`razorpay_payment_id`),
  ADD KEY `idx_payments_order_id` (`order_id`),
  ADD KEY `idx_payments_status` (`status`),
  ADD KEY `idx_payments_created_at` (`created_at`);

--
-- Indexes for table `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `table_number` (`table_number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `blocked_slots`
--
ALTER TABLE `blocked_slots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `hall_bookings`
--
ALTER TABLE `hall_bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `hall_booking_slots`
--
ALTER TABLE `hall_booking_slots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tables`
--
ALTER TABLE `tables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blocked_slots`
--
ALTER TABLE `blocked_slots`
  ADD CONSTRAINT `blocked_slots_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `hall_bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hall_booking_slots`
--
ALTER TABLE `hall_booking_slots`
  ADD CONSTRAINT `fk_booking` FOREIGN KEY (`booking_id`) REFERENCES `hall_bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
