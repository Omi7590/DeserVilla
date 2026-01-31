import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { RefreshCw, Clock, Utensils, CheckCircle, Filter, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    paymentStatus: searchParams.get('paymentStatus') || '',
    tableNumber: searchParams.get('tableNumber') || '',
    date: searchParams.get('date') || ''
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
      if (filters.tableNumber) params.tableNumber = filters.tableNumber;
      if (filters.date) params.date = filters.date;

      const response = await adminAPI.getOrders(params);
      setOrders(response.data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [filters]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
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
                <div className="flex gap-2">
                  {order.orderStatus !== 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'pending')}
                      className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 text-sm font-bold transition-all duration-200 hover:scale-105"
                    >
                      Set Pending
                    </button>
                  )}
                  {order.orderStatus !== 'preparing' && (
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

