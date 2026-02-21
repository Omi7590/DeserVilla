import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  CreditCard, 
  Calendar,
  LogOut, 
  Menu,
  X,
  Bell,
  User,
  Settings,
  UserCircle,
  Key
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, formatNotificationTime, getNotificationIcon } from '../services/notificationService';
import { playNotificationSound, requestNotificationPermission, showBrowserNotification } from '../utils/notificationSound';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const previousNotificationCount = useRef(0);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 5 seconds for real-time updates
    const interval = setInterval(fetchNotifications, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const data = await getNotifications();
      
      // Check for new notifications
      const currentCount = data.filter(n => !n.isRead).length;
      const hasNewNotifications = currentCount > previousNotificationCount.current;
      
      if (hasNewNotifications && previousNotificationCount.current > 0) {
        // New notification arrived!
        const latestNotification = data.find(n => !n.isRead);
        
        if (latestNotification) {
          // Play sound
          playNotificationSound();
          
          // Show browser notification
          showBrowserNotification(
            latestNotification.title,
            latestNotification.message
          );
          
          // Show toast notification
          toast.success(
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getNotificationIcon(latestNotification.type)}</span>
              <div>
                <div className="font-bold">{latestNotification.title}</div>
                <div className="text-sm">{latestNotification.message}</div>
              </div>
            </div>,
            {
              duration: 5000,
              position: 'top-right',
              style: {
                background: '#10B981',
                color: 'white',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
              }
            }
          );
        }
      }
      
      previousNotificationCount.current = currentCount;
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    const success = await markNotificationAsRead(notificationId);
    if (success) {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    const success = await markAllNotificationsAsRead();
    if (success) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
    { path: '/admin/hall-bookings', icon: Calendar, label: 'Hall Bookings' }
  ];

  const isActive = (path) => location.pathname === path;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl transition-all duration-300 ${
        sidebarOpen ? 'w-72' : 'w-0'
      } overflow-hidden relative`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent"></div>
        <div className="h-full flex flex-col relative z-10">
          {/* Logo/Header */}
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Desert Villa</h1>
                <p className="text-xs text-gray-400">Admin Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                    active
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? '' : 'group-hover:scale-110 transition-transform'}`} />
                  <span className="font-medium">{item.label}</span>
                  {active && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-700/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 font-medium hidden md:block">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            
            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 relative group"
              >
                <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'text-primary-600' : 'text-gray-600'} ${unreadCount > 0 ? 'animate-pulse' : ''}`} />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full animate-ping opacity-75"></span>
                  </>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        Notifications
                        {unreadCount > 0 && (
                          <span className="px-2.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {loadingNotifications ? (
                      <div className="p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-gray-500 text-sm mt-3">Loading...</p>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => {
                            if (!notification.isRead) {
                              handleMarkAsRead(notification.id);
                            }
                            if (notification.link) {
                              navigate(notification.link);
                              setShowNotifications(false);
                            }
                          }}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                            !notification.isRead ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-2xl mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-semibold text-gray-900 text-sm">{notification.title}</h4>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"></div>
                                )}
                              </div>
                              <p className="text-gray-600 text-xs mt-1 line-clamp-2">{notification.message}</p>
                              <p className="text-gray-400 text-xs mt-1.5">
                                {formatNotificationTime(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-100 bg-gray-50">
                      <button 
                        onClick={() => {
                          navigate('/admin/notifications');
                          setShowNotifications(false);
                        }}
                        className="w-full text-center text-sm text-primary-600 font-semibold hover:text-primary-700"
                      >
                        View All Notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Menu Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        A
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Admin User</h3>
                        <p className="text-xs text-gray-600">admin@desertvilla.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/admin/dashboard');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left"
                    >
                      <LayoutDashboard className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/admin/change-password');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left"
                    >
                      <Key className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Change Password</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        toast.info('Profile settings coming soon!');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left"
                    >
                      <UserCircle className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        toast.info('Settings coming soon!');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left"
                    >
                      <Settings className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Settings</span>
                    </button>
                  </div>
                  <div className="p-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-left text-red-600"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main 
          className="flex-1 overflow-y-auto p-6"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

