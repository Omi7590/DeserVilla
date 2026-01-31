import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hallBookingAPI } from '../../services/api';
import { 
  Calendar, 
  Clock, 
  Users, 
  Phone, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader2,
  Filter,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminHallBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [filterStatus, filterDate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await hallBookingAPI.getAllBookings(
        filterStatus !== 'all' ? filterStatus : undefined
      );
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      let bookingsData = response.data.bookings || [];
      
      // Normalize data format (backend returns camelCase, convert to snake_case for consistency)
      bookingsData = bookingsData.map(booking => ({
        id: booking.id,
        customer_name: booking.customerName || booking.customer_name,
        mobile: booking.mobile,
        booking_date: booking.bookingDate || booking.booking_date,
        time_slot: booking.timeSlot || booking.time_slot,
        people_count: booking.peopleCount || booking.people_count,
        occasion: booking.occasion,
        special_request: booking.specialRequest || booking.special_request,
        advance_amount: booking.advanceAmount || booking.advance_amount || 0,
        remaining_amount: booking.remainingAmount || booking.remaining_amount || 0,
        total_hours: booking.totalHours || booking.total_hours || null,
        total_amount: booking.totalAmount || booking.total_amount || (booking.advanceAmount || booking.advance_amount || 0) * 2,
        slots: booking.slots || [],
        payment_status: booking.paymentStatus || booking.payment_status,
        booking_status: booking.bookingStatus || booking.booking_status,
        razorpay_payment_id: booking.razorpayPaymentId || booking.razorpay_payment_id,
        created_at: booking.createdAt || booking.created_at,
        updated_at: booking.updatedAt || booking.updated_at
      }));
      
      // Filter by date if provided
      if (filterDate) {
        bookingsData = bookingsData.filter(
          booking => booking.booking_date === filterDate
        );
      }
      
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      
      // Show more specific error message
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please check backend logs.');
      } else if (error.response?.data?.error) {
        toast.error(`Failed to load bookings: ${error.response.data.error}`);
      } else {
        toast.error(`Failed to load hall bookings: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await hallBookingAPI.updateBookingStatus(bookingId, newStatus);
      toast.success('Booking status updated successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.error || 'Failed to update booking status');
    }
  };

  const handleMarkRemainingPaid = async (bookingId) => {
    if (!window.confirm('Mark remaining payment as paid? This action cannot be undone.')) {
      return;
    }

    try {
      await hallBookingAPI.markRemainingPaymentPaid(bookingId);
      toast.success('Remaining payment marked as paid');
      fetchBookings();
    } catch (error) {
      console.error('Error marking remaining payment:', error);
      toast.error(error.response?.data?.error || 'Failed to mark remaining payment as paid');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      CONFIRMED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const statusConfig = {
      FULL_PAID: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Fully Paid' },
      ADVANCE_PAID: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Advance Paid' },
      PAID: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Paid' },
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Pending' },
      FAILED: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Failed' },
      REFUNDED: { color: 'bg-gray-100 text-gray-800', icon: RefreshCw, label: 'Refunded' }
    };
    
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: status };
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const formatTimeSlot = (slot) => {
    const slotMap = {
      morning: 'Morning (9 AM - 2 PM)',
      evening: 'Evening (6 PM - 11 PM)',
      full_day: 'Full Day (9 AM - 11 PM)'
    };
    return slotMap[slot] || slot;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Hall Bookings</h1>
          <p className="text-gray-600 mt-2">Manage all hall bookings and their status</p>
        </div>
        <button
          onClick={fetchBookings}
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
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Booking Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
            >
              <option value="all">All Bookings</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Booking Date
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
            />
          </div>
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="px-4 py-2.5 text-gray-600 hover:text-gray-800 font-medium hover:bg-gray-100 rounded-xl transition-all"
            >
              Clear Date
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <button
          onClick={() => {
            setFilterStatus('all');
            setFilterDate('');
          }}
          className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-primary-200 hover:-translate-y-1 text-left cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{bookings.length}</p>
            </div>
            <div className="p-3.5 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
              <Calendar className="w-8 h-8" />
            </div>
          </div>
        </button>
        <button
          onClick={() => {
            setFilterStatus('CONFIRMED');
            setFilterDate('');
          }}
          className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 hover:-translate-y-1 text-left cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Confirmed</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {bookings.filter(b => b.booking_status === 'CONFIRMED').length}
              </p>
            </div>
            <div className="p-3.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
        </button>
        <button
          onClick={() => {
            setFilterStatus('COMPLETED');
            setFilterDate('');
          }}
          className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-green-200 hover:-translate-y-1 text-left cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {bookings.filter(b => b.booking_status === 'COMPLETED').length}
              </p>
            </div>
            <div className="p-3.5 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
        </button>
        <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-primary-200 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-primary-600 mt-1">
                ₹{bookings
                  .filter(b => b.payment_status === 'PAID')
                  .reduce((sum, b) => sum + parseFloat(b.advance_amount || 0), 0)
                  .toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-3.5 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
              <DollarSign className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        {bookings.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">
              {filterStatus !== 'all' || filterDate
                ? 'Try adjusting your filters'
                : 'No hall bookings have been made yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Booking Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-bold text-gray-900">
                            {booking.customer_name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" />
                            {booking.mobile}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{formatDate(booking.booking_date)}</span>
                        </div>
                        {booking.slots && booking.slots.length > 0 ? (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">Time Slots:</span>
                            </div>
                            <div className="ml-6 mb-1 text-xs">
                              {booking.slots.map((slot, idx) => (
                                <span key={idx} className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-lg mr-1 mb-1 font-medium">
                                  {slot.display}
                                </span>
                              ))}
                            </div>
                            {booking.total_hours && (
                              <div className="text-xs text-gray-500 mt-1 font-medium">
                                Total: {booking.total_hours} hour{booking.total_hours > 1 ? 's' : ''}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{formatTimeSlot(booking.time_slot)}</span>
                          </div>
                        )}
                        {booking.occasion && (
                          <div className="text-xs text-gray-500 mt-1">
                            Occasion: <span className="font-medium">{booking.occasion}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900 mb-1">
                        Total: ₹{parseFloat(booking.total_amount || booking.advance_amount || 0).toLocaleString('en-IN')}
                      </div>
                      {booking.advance_amount > 0 && (
                        <div className="text-xs text-green-600 mb-1 font-medium">
                          Advance: ₹{parseFloat(booking.advance_amount || 0).toLocaleString('en-IN')}
                        </div>
                      )}
                      {booking.remaining_amount > 0 && (
                        <div className="text-xs text-orange-600 font-medium">
                          Remaining: ₹{parseFloat(booking.remaining_amount || 0).toLocaleString('en-IN')}
                        </div>
                      )}
                      {booking.total_hours && (
                        <div className="text-xs text-gray-500 mt-1">
                          {booking.total_hours} hour{booking.total_hours > 1 ? 's' : ''} × ₹500
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentBadge(booking.payment_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(booking.booking_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="space-y-2">
                        <select
                          value={booking.booking_status}
                          onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                          disabled={booking.booking_status === 'CANCELLED'}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-600 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                        {booking.payment_status === 'ADVANCE_PAID' && booking.remaining_amount > 0 && (
                          <button
                            onClick={() => handleMarkRemainingPaid(booking.id)}
                            className="w-full px-3 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200 hover:scale-105"
                          >
                            Mark Remaining Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHallBookings;

