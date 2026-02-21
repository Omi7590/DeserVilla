import pool from '../config/database.js';

// Get all hall settings
export const getHallSettings = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT setting_key, setting_value, description 
       FROM hall_settings 
       ORDER BY setting_key`
    );

    const settings = {};
    result.rows.forEach(row => {
      settings[row.setting_key] = {
        value: row.setting_value,
        description: row.description
      };
    });

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error fetching hall settings:', error);
    next(error);
  }
};

// Update hall setting
export const updateHallSetting = async (req, res, next) => {
  try {
    const { settingKey, settingValue } = req.body;

    if (!settingKey || settingValue === undefined) {
      return res.status(400).json({ error: 'Setting key and value are required' });
    }

    // Validate setting key
    const validKeys = ['hourly_rate', 'start_hour', 'end_hour'];
    if (!validKeys.includes(settingKey)) {
      return res.status(400).json({ error: 'Invalid setting key' });
    }

    // Validate values
    const numValue = parseFloat(settingValue);
    if (isNaN(numValue) || numValue < 0) {
      return res.status(400).json({ error: 'Setting value must be a positive number' });
    }

    if (settingKey === 'hourly_rate' && numValue < 100) {
      return res.status(400).json({ error: 'Hourly rate must be at least ₹100' });
    }

    if (settingKey === 'start_hour' && (numValue < 0 || numValue > 23)) {
      return res.status(400).json({ error: 'Start hour must be between 0 and 23' });
    }

    if (settingKey === 'end_hour' && (numValue < 1 || numValue > 24)) {
      return res.status(400).json({ error: 'End hour must be between 1 and 24' });
    }

    // Update setting
    await pool.query(
      `UPDATE hall_settings 
       SET setting_value = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE setting_key = ?`,
      [settingValue.toString(), settingKey]
    );

    res.json({
      success: true,
      message: 'Setting updated successfully',
      setting: {
        key: settingKey,
        value: settingValue
      }
    });
  } catch (error) {
    console.error('Error updating hall setting:', error);
    next(error);
  }
};

// Get specific setting value (helper for internal use)
export const getSettingValue = async (settingKey) => {
  try {
    const result = await pool.query(
      `SELECT setting_value FROM hall_settings WHERE setting_key = ?`,
      [settingKey]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].setting_value;
  } catch (error) {
    console.error(`Error fetching setting ${settingKey}:`, error);
    return null;
  }
};
