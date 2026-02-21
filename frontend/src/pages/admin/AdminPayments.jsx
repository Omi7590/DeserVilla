import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { 
  RefreshCw, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  CreditCard,
  Banknote,
  DollarSign,
  TrendingUp,
  Search,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [filters, setFilters] = useState({
    paymentMethod: '',
    paymentStatus: '',
    date: '',
    search: ''
  });

  const fetchSummary = async () => {
    try {
      setSummaryLoading(true);
      const response = await adminAPI.getPaymentsSummary();
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Failed to load payment summary:', error);
      toast.error('Failed to load payment summary');
    } finally {
      setSummaryLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.paymentMethod) params.paymentMethod = filters.paymentMethod;
      if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
      if (filters.date) params.date = filters.date;
      if (filters.search) params.search = filters.search;

      const response = await adminAPI.getPaymentsList(params);
      setPayments(response.data.payments);
    } catch (error) {
      console.error('Failed to load payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchPayments();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchSummary();
      fetchPayments();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [filters]);

  const handleRefresh = () => {
    fetchSummary();
    fetchPayments();
    toast.success('Data refreshed');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getMethodIcon = (method) => {
    return method === 'CASH' ? <Banknote className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />;
  };

  const getMethodColor = (method) => {
    return method === 'CASH' 
      ? 'bg-amber-100 text-amber-800 border-amber-200' 
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Payment Management
          </h1>
          <p className="text-gray-600 mt-2">Complete payment tracking and revenue analytics</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200 hover:scale-105"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      {summaryLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 animate-pulse">
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <div className="group bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-white hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <DollarSign className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 opacity-70" />
            </div>
            <h3 className="text-sm font-semibold opacity-90 mb-1">Total Revenue</h3>
            <p className="text-3xl font-bold">₹{summary.totalRevenue.toFixed(2)}</p>
            <p className="text-xs opacity-75 mt-2">{summary.totalOrders} total orders</p>
          </div>

          {/* Online Revenue */}
          <div className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-white hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <CreditCard className="w-6 h-6" />
              </div>
              <CheckCircle className="w-5 h-5 opacity-70" />
            </div>
            <h3 className="text-sm font-semibold opacity-90 mb-1">Online Revenue</h3>
            <p className="text-3xl font-bold">₹{summary.onlineRevenue.toFixed(2)}</p>
            <p className="text-xs opacity-75 mt-2">{summary.onlineOrders} online orders</p>
          </div>

          {/* Cash Revenue */}
          <div className="group bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-white hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Banknote className="w-6 h-6" />
              </div>
              <CheckCircle className="w-5 h-5 opacity-70" />
            </div>
            <h3 className="text-sm font-semibold opacity-90 mb-1">Cash Revenue</h3>
            <p className="text-3xl font-bold">₹{summary.cashRevenue.toFixed(2)}</p>
            <p className="text-xs opacity-75 mt-2">{summary.cashPaidOrders} paid cash orders</p>
          </div>

          {/* Pending Cash */}
          <div className="group bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-white hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Clock className="w-6 h-6" />
              </div>
              <XCircle className="w-5 h-5 opacity-70" />
            </div>
            <h3 className="text-sm font-semibold opacity-90 mb-1">Pending Cash</h3>
            <p className="text-3xl font-bold">₹{summary.pendingCash.toFixed(2)}</p>
            <p className="text-xs opacity-75 mt-2">{summary.cashPendingOrders} pending cash orders</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Filter className="w-5 h-5 text-primary-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method</label>
            <select
              value={filters.paymentMethod}
              onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="">All Methods</option>
              <option value="ONLINE">Online</option>
              <option value="CASH">Cash</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Status</label>
            <select
              value={filters.paymentStatus}
              onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Order ID or Table #"
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No payments found</p>
          <p className="text-gray-400 text-sm mt-2">Payment transactions will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Table</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Payment Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Paid At</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">#{payment.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700 font-medium">Table {payment.tableNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-lg text-gray-900">₹{payment.totalAmount.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 w-fit border ${getMethodColor(
                          payment.paymentMethod
                        )}`}
                      >
                        {getMethodIcon(payment.paymentMethod)}
                        {payment.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 w-fit border ${getStatusColor(
                          payment.paymentStatus
                        )}`}
                      >
                        {getStatusIcon(payment.paymentStatus)}
                        {payment.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 font-medium capitalize">
                        {payment.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {payment.paidAt ? new Date(payment.paidAt).toLocaleString() : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {new Date(payment.createdAt).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold text-gray-900">{payments.length}</span> payment{payments.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
