import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Test script to verify cash payment status updates in database
 */

async function testCashPaymentUpdate() {
  try {
    console.log('🧪 Testing Cash Payment Database Update...\n');

    // Get a cash order with pending payment
    const [pendingOrders] = await pool.execute(
      `SELECT o.id, o.payment_status, o.payment_method, t.table_number, o.total_amount
       FROM orders o
       JOIN tables t ON o.table_id = t.id
       WHERE o.payment_method = 'CASH' AND o.payment_status = 'pending'
       LIMIT 1`
    );

    if (pendingOrders.length === 0) {
      console.log('❌ No pending cash orders found to test');
      console.log('💡 Create a cash order first, then run this test');
      process.exit(0);
    }

    const testOrder = pendingOrders[0];
    console.log('📋 Found test order:');
    console.log(`   Order ID: ${testOrder.id}`);
    console.log(`   Table: ${testOrder.table_number}`);
    console.log(`   Amount: ₹${testOrder.total_amount}`);
    console.log(`   Payment Status: ${testOrder.payment_status}`);
    console.log(`   Payment Method: ${testOrder.payment_method}\n`);

    // Update to paid
    console.log('🔄 Updating payment status to "paid"...');
    await pool.execute(
      `UPDATE orders 
       SET payment_status = 'paid', 
           paid_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [testOrder.id]
    );

    // Verify update
    const [updatedOrders] = await pool.execute(
      `SELECT id, payment_status, paid_at, updated_at
       FROM orders
       WHERE id = ?`,
      [testOrder.id]
    );

    const updated = updatedOrders[0];
    console.log('✅ Update successful!\n');
    console.log('📋 Updated order:');
    console.log(`   Order ID: ${updated.id}`);
    console.log(`   Payment Status: ${updated.payment_status}`);
    console.log(`   Paid At: ${updated.paid_at}`);
    console.log(`   Updated At: ${updated.updated_at}\n`);

    // Verify it persists
    console.log('🔍 Verifying persistence...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    const [verifyOrders] = await pool.execute(
      `SELECT id, payment_status, paid_at
       FROM orders
       WHERE id = ?`,
      [testOrder.id]
    );

    const verified = verifyOrders[0];
    if (verified.payment_status === 'paid') {
      console.log('✅ Payment status persisted in database!');
      console.log(`   Status: ${verified.payment_status}`);
      console.log(`   Paid At: ${verified.paid_at}\n`);
    } else {
      console.log('❌ Payment status did NOT persist!');
      console.log(`   Expected: paid`);
      console.log(`   Got: ${verified.payment_status}\n`);
    }

    // Revert for testing (optional)
    console.log('🔄 Reverting to pending for future tests...');
    await pool.execute(
      `UPDATE orders 
       SET payment_status = 'pending', 
           paid_at = NULL
       WHERE id = ?`,
      [testOrder.id]
    );
    console.log('✅ Reverted to pending\n');

    console.log('🎉 Test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testCashPaymentUpdate();
