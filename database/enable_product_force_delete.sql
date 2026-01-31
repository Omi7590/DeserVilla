-- Enable Product Force Delete Capability
-- This script adds documentation and helper views for product deletion management

-- Create a view to easily see products with order counts
CREATE OR REPLACE VIEW product_order_counts AS
SELECT 
    m.id,
    m.name,
    m.category,
    m.price,
    m.is_available,
    m.created_at,
    COALESCE(oi.order_count, 0) as order_count,
    CASE 
        WHEN COALESCE(oi.order_count, 0) > 0 THEN 'Used in orders'
        WHEN m.is_available = 0 THEN 'Disabled'
        ELSE 'Available for deletion'
    END as deletion_status
FROM menu_items m
LEFT JOIN (
    SELECT 
        menu_item_id,
        COUNT(*) as order_count
    FROM order_items
    GROUP BY menu_item_id
) oi ON m.id = oi.menu_item_id
ORDER BY m.category, m.name;

-- Add helpful stored procedure for safe product deletion
DELIMITER //

CREATE PROCEDURE SafeDeleteProduct(IN product_id INT)
BEGIN
    DECLARE order_count INT DEFAULT 0;
    DECLARE product_name VARCHAR(255);
    DECLARE is_avail BOOLEAN;
    
    -- Get product info
    SELECT name, is_available INTO product_name, is_avail
    FROM menu_items 
    WHERE id = product_id;
    
    -- Check if product exists
    IF product_name IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product not found';
    END IF;
    
    -- Count orders using this product
    SELECT COUNT(*) INTO order_count
    FROM order_items 
    WHERE menu_item_id = product_id;
    
    -- If product is already disabled and has orders, clean up order items
    IF is_avail = 0 AND order_count > 0 THEN
        DELETE FROM order_items WHERE menu_item_id = product_id;
        DELETE FROM menu_items WHERE id = product_id;
        SELECT CONCAT('Product "', product_name, '" deleted. Removed ', order_count, ' order items.') as message;
    -- If product is available but used in orders, disable it
    ELSEIF order_count > 0 THEN
        UPDATE menu_items SET is_available = 0 WHERE id = product_id;
        SELECT CONCAT('Product "', product_name, '" disabled. It was used in ', order_count, ' order(s).') as message;
    -- If no orders reference it, safe to delete
    ELSE
        DELETE FROM menu_items WHERE id = product_id;
        SELECT CONCAT('Product "', product_name, '" deleted successfully.') as message;
    END IF;
END//

DELIMITER ;

-- Usage examples:
-- CALL SafeDeleteProduct(1);  -- Will either disable or delete based on usage
-- 
-- To see all products with their deletion status:
-- SELECT * FROM product_order_counts;
--
-- To force delete a product (removes from order_items first):
-- DELETE FROM order_items WHERE menu_item_id = [product_id];
-- DELETE FROM menu_items WHERE id = [product_id];
