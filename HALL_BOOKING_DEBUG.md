# Hall Booking Debugging Guide

## Quick Test Steps

1. **Open Browser Console** (F12)
2. **Go to**: `http://localhost:5173/hall-booking`
3. **Select a date** (e.g., 2026-01-29)
4. **Select a time slot** (Morning, Evening, or Full Day)
5. **Click "Check Availability & Continue"**
6. **Check console for errors**

## Expected Console Output

When you click the button, you should see:
```
Button clicked. Form data: {bookingDate: "2026-01-29", timeSlot: "morning", ...}
Date selected: 2026-01-29
```

## Common Issues & Solutions

### Issue 1: "Failed to check availability"
**Check:**
- Is backend running on port 5000?
- Open: `http://localhost:5000/api/health`
- Should return: `{"status":"ok","message":"Server is running"}`

**Solution:**
```powershell
cd backend
npm run dev
```

### Issue 2: CORS Error
**Check:**
- Backend CORS is configured for `http://localhost:5173`
- Check `backend/server.js` line 16-19

**Solution:**
- Verify `FRONTEND_URL=http://localhost:5173` in `backend/.env`

### Issue 3: Network Error
**Check:**
- Frontend can reach backend
- Test: `http://localhost:5000/api/hall/check-availability`

**Solution:**
- Check firewall settings
- Verify both servers are running

### Issue 4: Date Format Error
**Check:**
- Date format should be: `YYYY-MM-DD` (e.g., `2026-01-29`)
- Browser date input should provide this format automatically

### Issue 5: Button Not Working
**Check:**
- Is button disabled? (Check if date and time slot are selected)
- Check browser console for JavaScript errors

## Manual API Test

Test the API directly:

```powershell
# Test Check Availability
$body = @{
    bookingDate = "2026-01-29"
    timeSlot = "morning"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/hall/check-availability" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

Expected response:
```json
{
    "success": true,
    "available": true,
    "bookingDate": "2026-01-29",
    "timeSlot": "morning"
}
```

## Frontend Debugging

1. **Open Browser DevTools** (F12)
2. **Go to Console tab**
3. **Look for errors** when clicking button
4. **Go to Network tab**
5. **Click button again**
6. **Check if request is sent to** `http://localhost:5000/api/hall/check-availability`
7. **Check response status** (should be 200)

## Backend Logs

Check backend terminal for:
- Connection logs
- Error messages
- SQL queries

## Still Not Working?

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Hard refresh** (Ctrl+F5)
3. **Check both servers are running:**
   - Backend: `http://localhost:5000/api/health`
   - Frontend: `http://localhost:5173`
4. **Restart both servers**

