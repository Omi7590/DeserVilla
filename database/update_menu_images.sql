-- Update menu items with beautiful food images from Unsplash
-- High-quality, appetizing images for each menu item

-- Desserts
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80' WHERE name = 'Chocolate Lava Cake';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1571877227209-0a0d98ea607e9?w=800&h=600&fit=crop&q=80' WHERE name = 'Tiramisu';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&h=600&fit=crop&q=80' WHERE name = 'Red Velvet Cake';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&h=600&fit=crop&q=80' WHERE name = 'Cheesecake';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop&q=80' WHERE name = 'Brownie Sundae';

-- Beverages
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&h=600&fit=crop&q=80' WHERE name = 'Cappuccino';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop&q=80' WHERE name = 'Latte';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop&q=80' WHERE name = 'Mocha';

UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop&q=80' WHERE name = 'Iced Coffee';

-- Snacks
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop&q=80' WHERE name = 'Chocolate Chip Cookies';
UPDATE menu_items SET image_url = 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=600&fit=crop&q=80' WHERE name = 'Macarons (6 pcs)';
