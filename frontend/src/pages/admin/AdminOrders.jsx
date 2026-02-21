import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { RefreshCw, Clock, Utensils, CheckCircle, Filter, ShoppingBag, CreditCard, Banknote } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(null); // Track which order is being processed
  const [lastUpdatedOrderId, setLastUpdatedOrderId] = useState(null); // Track manually updated orders
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    paymentStatus: searchParams.get('paymentStatus') || '',
    tableNumber: searchParams.get('tableNumber') || '',
    date: searchParams.get('date') || ''
  });

  const fetchOrders = async (skipLoadingState = false) => {
    try {
      if (!skipLoadingState) {
        setLoading(true);
      }
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
      if (filters.tableNumber) params.tableNumber = filters.tableNumber;
      if (filters.date) params.date = filters.date;

      const response = await adminAPI.getOrders(params);
      console.log('Orders fetched:', response.data.orders); // Debug log
      
      // If we just updated an order, preserve its state for a few seconds
      if (lastUpdatedOrderId) {
        setOrders(prevOrders => {
          const updatedOrder = prevOrders.find(o => o.id === lastUpdatedOrderId);
          if (updatedOrder && updatedOrder.paymentStatus === 'paid') {
            // Keep the manually updated order's payment status
            return response.data.orders.map(order => 
              order.id === lastUpdatedOrderId 
                ? { ...order, paymentStatus: 'paid', paidAt: updatedOrder.paidAt }
                : order
            );
          }
          return response.data.orders;
        });
        
        // Clear the flag after 5 seconds
        setTimeout(() => setLastUpdatedOrderId(null), 5000);
      } else {
        setOrders(response.data.orders);
      }
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Error fetching orders:', error);
    } finally {
      if (!skipLoadingState) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => fetchOrders(true), 10000); // Refresh every 10 seconds (silent)
    return () => clearInterval(interval);
  }, [filters]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Optimistic UI update
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, orderStatus: newStatus }
            : order
        )
      );

      await adminAPI.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
    } catch (error) {
      // Revert on error
      fetchOrders(true);
      toast.error('Failed to update order status');
    }
  };

  const markAsPaid = async (orderId) => {
    // Set loading state
    setProcessingPayment(orderId);

    try {
      const response = await adminAPI.markCashOrderAsPaid(orderId);
      
      if (response.data.success) {
        // Mark this order as manually updated
        setLastUpdatedOrderId(orderId);
        
        // Update the order in state immediately
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId
              ? { ...order, paymentStatus: 'paid', paidAt: new Date().toISOString() }
              : order
          )
        );

        toast.success('💰 Cash payment confirmed!', {
          duration: 2000,
          icon: '✅'
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to mark payment as paid';
      toast.error(errorMessage, {
        duration: 4000
      });
      console.error('Error marking order as paid:', error);
    } finally {
      setProcessingPayment(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'served':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'preparing':
        return <Utensils className="w-4 h-4" />;
      case 'served':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPaymentMethodIcon = (method) => {
    if (method === 'ONLINE') return <CreditCard className="w-4 h-4" />;
    if (method === 'CASH') return <Banknote className="w-4 h-4" />;
    return <CreditCard className="w-4 h-4" />;
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Orders Management</h1>
          <p className="text-gray-600 mt-2">Track and manage all customer orders</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200 hover:scale-105"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Filter className="w-5 h-5 text-primary-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Order Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="served">Served</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Status</label>
            <select
              value={filters.paymentStatus}
              onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Table Number</label>
            <input
              type="number"
              value={filters.tableNumber}
              onChange={(e) => setFilters({ ...filters, tableNumber: e.target.value })}
              placeholder="Table #"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No orders found</p>
          <p className="text-gray-400 text-sm mt-2">Orders will appear here once customers place them</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-primary-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Table {order.tableNumber}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Order #{order.id} • {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus.toUpperCase()}
                  </span>
                  
                  {/* Show CASH badge only for cash payments */}
                  {order.paymentMethod === 'CASH' && (
                    <span className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm border border-gray-200 bg-white text-gray-700">
                      {getPaymentMethodIcon(order.paymentMethod)}
                      CASH
                    </span>
                  )}
                  
                  {/* Show payment status - for online it shows PAID, for cash it shows PENDING until marked */}
                  <span
                    className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="mb-4 space-y-2 bg-gray-50 rounded-xl p-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm py-2.5 border-b border-gray-200 last:border-0"
                  >
                    <span className="text-gray-700 font-medium">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-gray-900 font-bold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t-2 border-gray-100">
                <span className="text-xl font-bold text-gray-900">
                  Total: ₹{order.totalAmount.toFixed(2)}
                </span>
                <div className="flex gap-3 flex-wrap items-center">
                  {/* Payment Status Toggle Switch - Only for CASH orders that are PENDING */}
                  {order.paymentMethod === 'CASH' && order.paymentStatus?.toLowerCase() === 'pending' && (
                    <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <span className="text-sm font-semibold text-gray-700">Payment:</span>
                      <button
                        onClick={() => markAsPaid(order.id)}
                        disabled={processingPayment === order.id}
                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-300 focus:ring-gray-400 ${
                          processingPayment === order.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'
                        }`}
                      >
                        <span className="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 translate-x-1">
                          {processingPayment === order.id && (
                            <RefreshCw className="w-4 h-4 animate-spin text-gray-600 m-1" />
                          )}
                        </span>
                      </button>
                      <span className="text-sm font-bold text-orange-600">
                        ⏳ PENDING
                      </span>
                    </div>
                  )}
                  
                  {/* Show PAID badge for cash orders that are paid */}
                  {order.paymentMethod === 'CASH' && order.paymentStatus?.toLowerCase() === 'paid' && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl border-2 border-green-200">
                      <span className="text-sm font-bold text-green-600">
                        ✅ CASH PAID
                      </span>
                      {order.paidAt && (
                        <span className="text-xs text-green-600">
                          {new Date(order.paidAt).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Order Status Buttons */}
                  {order.orderStatus !== 'pending' && order.orderStatus !== 'served' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'pending')}
                      className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 text-sm font-bold transition-all duration-200 hover:scale-105"
                    >
                      Set Pending
                    </button>
                  )}
                  {order.orderStatus !== 'preparing' && order.orderStatus !== 'served' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 text-sm font-bold transition-all duration-200 hover:scale-105"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.orderStatus !== 'served' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'served')}
                      className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/30 text-sm font-bold transition-all duration-200 hover:scale-105"
                    >
                      Mark Served
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

