import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, menuAPI, hallBookingAPI } from '../services/api';
import toast from 'react-hot-toast';
import { LogOut, RefreshCw, CheckCircle, Clock, Utensils, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState({});
  const [hallBookings, setHallBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'bookings'
  const [bookingFilter, setBookingFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [navigate, filter, activeTab, bookingFilter]);

  const fetchData = async () => {
    try {
      const promises = [
        adminAPI.getOrders(filter !== 'all' ? filter : undefined),
        menuAPI.getMenu()
      ];
      
      if (activeTab === 'bookings') {
        promises.push(hallBookingAPI.getAllBookings(bookingFilter !== 'all' ? bookingFilter : undefined));
      }
      
      const results = await Promise.all(promises);
      setOrders(results[0].data.orders);
      setMenu(results[1].data.menu);
      
      if (activeTab === 'bookings' && results[2]) {
        setHallBookings(results[2].data.bookings);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        toast.error('Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const toggleMenuAvailability = async (menuItemId, currentStatus) => {
    try {
      await adminAPI.updateMenuAvailability(menuItemId, !currentStatus);
      toast.success('Menu availability updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update menu availability');
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await hallBookingAPI.updateBookingStatus(bookingId, newStatus);
      toast.success('Booking status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const getBookingStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeSlotLabel = (slot) => {
    const labels = {
      morning: 'Morning (9 AM - 2 PM)',
      evening: 'Evening (5 PM - 10 PM)',
      full_day: 'Full Day (9 AM - 10 PM)'
    };
    return labels[slot] || slot;
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

  // Flatten menu items for availability toggle
  const allMenuItems = Object.values(menu).flat();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchData}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Tabs */}
        <div className="mb-6 flex gap-4 border-b">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'orders'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Table Orders
          </button>
          <button
            onClick={() => {
              setActiveTab('bookings');
              fetchData();
            }}
            className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'bookings'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Hall Bookings
          </button>
        </div>

        {/* Filter Tabs */}
        {activeTab === 'orders' && (
          <div className="mb-6 flex gap-2">
            {['all', 'pending', 'preparing', 'served'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="mb-6 flex gap-2">
            {['all', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setBookingFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
                  bookingFilter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status.toLowerCase()}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders/Bookings Section */}
          <div className="lg:col-span-2">
            {activeTab === 'orders' ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Orders</h2>
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-primary-600 mx-auto" />
              </div>
            ) : orders.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          Table {order.tableNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Order #{order.id} • {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4 space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-700">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="text-gray-600">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-lg font-bold text-gray-800">
                        Total: ₹{order.totalAmount.toFixed(2)}
                      </span>
                      <div className="flex gap-2">
                        {order.orderStatus !== 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'pending')}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-semibold"
                          >
                            Pending
                          </button>
                        )}
                        {order.orderStatus !== 'preparing' && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, 'preparing')
                            }
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
                          >
                            Preparing
                          </button>
                        )}
                        {order.orderStatus !== 'served' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'served')}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold"
                          >
                            Served
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Hall Bookings</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-primary-600 mx-auto" />
                  </div>
                ) : hallBookings.length === 0 ? (
                  <div className="card text-center py-12">
                    <p className="text-gray-500">No bookings found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {hallBookings.map((booking) => (
                      <div key={booking.id} className="card">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              {booking.customerName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Booking #{booking.id} • {new Date(booking.createdAt).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Mobile: {booking.mobile}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getBookingStatusColor(
                                booking.bookingStatus
                              )}`}
                            >
                              {booking.bookingStatus}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                booking.paymentStatus === 'PAID'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {booking.paymentStatus}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-semibold">
                              {new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Time Slot:</span>
                            <span className="font-semibold">{getTimeSlotLabel(booking.timeSlot)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">People:</span>
                            <span className="font-semibold">{booking.peopleCount}</span>
                          </div>
                          {booking.occasion && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Occasion:</span>
                              <span className="font-semibold">{booking.occasion}</span>
                            </div>
                          )}
                          {booking.specialRequest && (
                            <div className="mt-2 p-2 bg-gray-50 rounded">
                              <span className="text-gray-600">Special Request:</span>
                              <p className="font-semibold mt-1">{booking.specialRequest}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                          <span className="text-lg font-bold text-gray-800">
                            Advance: ₹{booking.advanceAmount.toFixed(2)}
                          </span>
                          <div className="flex gap-2">
                            {booking.bookingStatus !== 'CONFIRMED' && (
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
                              >
                                Confirm
                              </button>
                            )}
                            {booking.bookingStatus !== 'COMPLETED' && (
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                                className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold"
                              >
                                Complete
                              </button>
                            )}
                            {booking.bookingStatus !== 'CANCELLED' && (
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-semibold"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Menu Management */}
          {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Menu Management
            </h2>
            <div className="card">
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-primary-600 mx-auto" />
                </div>
              ) : (
                <div className="space-y-3">
                  {allMenuItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          ₹{parseFloat(item.price).toFixed(2)}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.is_available}
                          onChange={() =>
                            toggleMenuAvailability(item.id, item.is_available)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

