import pool from '../config/database.js';

export const getMenu = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, price, category, description, image_url, is_available FROM menu_items ORDER BY category, name'
    );
    
    // Group by category
    const menuByCategory = {};
    result.rows.forEach(item => {
      if (!menuByCategory[item.category]) {
        menuByCategory[item.category] = [];
      }
      menuByCategory[item.category].push({
        ...item,
        price: parseFloat(item.price)
      });
    });
    
    res.json({
      success: true,
      menu: menuByCategory
    });
  } catch (error) {
    next(error);
  }
};

