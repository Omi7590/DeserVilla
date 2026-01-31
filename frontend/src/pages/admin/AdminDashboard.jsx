import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { RefreshCw, ShoppingBag, DollarSign, Clock, Utensils, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data.stats);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Orders Today',
      value: stats?.totalOrdersToday || 0,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      onClick: () => {
        const today = new Date().toISOString().split('T')[0];
        navigate(`/admin/orders?date=${today}`);
      }
    },
    {
      label: 'Revenue Today',
      value: `₹${(stats?.totalRevenueToday || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
      onClick: () => {
        const today = new Date().toISOString().split('T')[0];
        navigate(`/admin/payments?status=paid&date=${today}`);
      }
    },
    {
      label: 'Pending',
      value: stats?.pendingCount || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      onClick: () => navigate('/admin/orders?status=pending')
    },
    {
      label: 'Preparing',
      value: stats?.preparingCount || 0,
      icon: Utensils,
      color: 'bg-orange-500',
      onClick: () => navigate('/admin/orders?status=preparing')
    },
    {
      label: 'Served',
      value: stats?.servedCount || 0,
      icon: CheckCircle,
      color: 'bg-green-600',
      onClick: () => navigate('/admin/orders?status=served')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200 hover:scale-105"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <button
              key={index}
              onClick={stat.onClick}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-primary-200 hover:-translate-y-1 text-left cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3.5 rounded-xl ${stat.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/admin/orders?status=pending')}
            className="group p-6 border-2 border-gray-200 rounded-2xl hover:border-primary-500 hover:bg-gradient-to-br hover:from-primary-50 hover:to-transparent transition-all duration-300 text-left hover:shadow-lg hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">View Pending Orders</h3>
            <p className="text-sm text-gray-600">Manage orders waiting to be prepared</p>
          </button>
          <button
            onClick={() => navigate('/admin/products')}
            className="group p-6 border-2 border-gray-200 rounded-2xl hover:border-primary-500 hover:bg-gradient-to-br hover:from-primary-50 hover:to-transparent transition-all duration-300 text-left hover:shadow-lg hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Utensils className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">Manage Products</h3>
            <p className="text-sm text-gray-600">Add, edit, or disable menu items</p>
          </button>
          <button
            onClick={() => navigate('/admin/payments')}
            className="group p-6 border-2 border-gray-200 rounded-2xl hover:border-primary-500 hover:bg-gradient-to-br hover:from-primary-50 hover:to-transparent transition-all duration-300 text-left hover:shadow-lg hover:-translate-y-1"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2 text-lg">View Payments</h3>
            <p className="text-sm text-gray-600">Track all payment transactions</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

