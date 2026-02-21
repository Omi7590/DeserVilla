import pool from '../config/database.js';

export const runCronJob = async () => {
    console.log('Starting Auto-Cancel Cron Job...');

    // Run every minute (or 10 minutes)
    setInterval(async () => {
        try {
            console.log('Running auto-cancellation check...');

            // 1. Cancel stale Hall Bookings
            // Criteria: Payment PENDING AND Booking PENDING AND Created > 60 mins ago
            // This targets abandoned ONLINE bookings. 
            // CASH bookings are 'CONFIRMED' so they are skipped (as desired).
            const bookingResult = await pool.query(
                `UPDATE hall_bookings 
         SET booking_status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP
         WHERE payment_status = 'PENDING' 
         AND booking_status = 'PENDING' 
         AND created_at < (NOW() - INTERVAL 60 MINUTE)`
            );

            if (bookingResult.affectedRows > 0) {
                console.log(`Cancelled ${bookingResult.affectedRows} stale booking(s).`);
            }

            // 2. Cancel stale Orders
            // Criteria: Payment PENDING AND Order PENDING AND Created > 60 mins ago
            // This might catch ignored Cash orders, but if they haven't been accepted (prepared) in 1 hour, they likely should be cancelled.
            const orderResult = await pool.query(
                `UPDATE orders 
         SET order_status = 'cancelled', updated_at = CURRENT_TIMESTAMP
         WHERE payment_status = 'pending' 
         AND order_status = 'pending' 
         AND created_at < (NOW() - INTERVAL 60 MINUTE)`
            );

            if (orderResult.affectedRows > 0) {
                console.log(`Cancelled ${orderResult.affectedRows} stale order(s).`);
            }

        } catch (error) {
            console.error('Error in auto-cancel cron:', error);
        }
    }, 60 * 1000 * 10); // Run every 10 minutes
};
