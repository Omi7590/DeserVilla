# Hall Settings Management Guide

## Overview
Admin can now edit hall booking prices and timings from the admin panel.

## Setup Instructions

### 1. Run Database Migration
```powershell
.\run-hall-settings-migration.ps1
```

This creates the `hall_settings` table with default values:
- Hourly Rate: ₹500
- Start Hour: 10:00 AM
- End Hour: 8:00 PM (20:00)

### 2. Access Hall Settings
1. Login to Admin Panel
2. Navigate to **Hall Settings** from the sidebar
3. Edit any setting and click **Save**

## Features

### Configurable Settings

#### 1. Hourly Rate
- Set the price per hour for hall bookings
- Minimum: ₹100
- Changes apply to new bookings immediately
- Existing bookings retain their original price

#### 2. Start Hour
- Set when hall bookings can start
- Format: 24-hour (0-23)
- Example: 10 = 10:00 AM

#### 3. End Hour
- Set when hall bookings must end
- Format: 24-hour (1-24)
- Example: 20 = 8:00 PM

## How It Works

### Backend Changes
- New `hall_settings` table stores configuration
- `hallSettingsController.js` manages settings CRUD
- `hallBookingController.js` reads settings dynamically
- Settings are cached per request for performance

### Frontend Changes
- New `AdminHallSettings.jsx` page for editing
- Added to admin navigation menu
- Real-time validation and updates
- User-friendly time format display

## API Endpoints

### Get Settings
```
GET /api/admin/hall-settings
Authorization: Bearer <admin_token>
```

Response:
```json
{
  "success": true,
  "settings": {
    "hourly_rate": {
      "value": "500",
      "description": "Price per hour for hall booking in INR"
    },
    "start_hour": {
      "value": "10",
      "description": "Hall booking start hour (24-hour format)"
    },
    "end_hour": {
      "value": "20",
      "description": "Hall booking end hour (24-hour format)"
    }
  }
}
```

### Update Setting
```
PUT /api/admin/hall-settings
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "settingKey": "hourly_rate",
  "settingValue": "600"
}
```

Response:
```json
{
  "success": true,
  "message": "Setting updated successfully",
  "setting": {
    "key": "hourly_rate",
    "value": "600"
  }
}
```

## Validation Rules

### Hourly Rate
- Must be a positive number
- Minimum: ₹100
- Recommended: ₹100 - ₹5000

### Start Hour
- Must be between 0 and 23
- Must be less than end hour
- Recommended: 6 AM (6) to 12 PM (12)

### End Hour
- Must be between 1 and 24
- Must be greater than start hour
- Recommended: 6 PM (18) to 11 PM (23)

## Important Notes

1. **Immediate Effect**: Changes apply to new bookings immediately
2. **Existing Bookings**: Not affected by price changes
3. **Time Format**: Always use 24-hour format
4. **Validation**: Frontend and backend validation ensures data integrity
5. **Permissions**: Only authenticated admins can modify settings

## Testing

### Test the Feature
1. Login as admin
2. Go to Hall Settings
3. Change hourly rate to ₹600
4. Click Save
5. Go to Hall Bookings page (customer view)
6. Verify new price is displayed

### Verify Database
```sql
SELECT * FROM hall_settings;
```

Expected output:
```
+----+--------------+---------------+------------------------------------------+
| id | setting_key  | setting_value | description                              |
+----+--------------+---------------+------------------------------------------+
|  1 | hourly_rate  | 600           | Price per hour for hall booking in INR   |
|  2 | start_hour   | 10            | Hall booking start hour (24-hour format) |
|  3 | end_hour     | 20            | Hall booking end hour (24-hour format)   |
+----+--------------+---------------+------------------------------------------+
```

## Troubleshooting

### Settings Not Updating
- Check admin authentication token
- Verify database connection
- Check browser console for errors

### Wrong Price Displayed
- Clear browser cache
- Refresh the booking page
- Verify settings in database

### Migration Failed
- Ensure MySQL is running
- Check database name is correct
- Verify user has CREATE TABLE permissions

## Future Enhancements

Potential additions:
- Different rates for different time slots
- Weekend/holiday pricing
- Seasonal pricing
- Bulk discount settings
- Minimum booking duration
- Maximum booking duration
- Advance booking days limit

## Files Modified

### Backend
- `database/migrations/002_add_hall_settings.sql` - New migration
- `backend/controllers/hallSettingsController.js` - New controller
- `backend/controllers/hallBookingController.js` - Updated to use dynamic settings
- `backend/routes/adminRoutes.js` - Added settings routes

### Frontend
- `frontend/src/pages/admin/AdminHallSettings.jsx` - New settings page
- `frontend/src/components/AdminLayout.jsx` - Added navigation item
- `frontend/src/App.jsx` - Added route

### Scripts
- `run-hall-settings-migration.ps1` - Migration runner

## Support

For issues or questions:
1. Check this guide first
2. Verify database migration ran successfully
3. Check browser console for errors
4. Review backend logs for API errors
