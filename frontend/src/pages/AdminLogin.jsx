import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Loader2, User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await adminAPI.login({ username, password });
      localStorage.setItem('adminToken', response.data.token);
      toast.success('Welcome back, Mr. Om Sable!', {
        icon: '👋',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center px-4 overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/30 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 relative z-10 transform transition-all hover:scale-[1.01] duration-500 animate-slide-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl shadow-lg mb-6 transform rotate-3 hover:rotate-6 transition-transform duration-300">
             <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Mr. Om Sable
          </h1>
          <p className="text-indigo-200 text-sm font-medium tracking-wide uppercase opacity-80">
            Secure Admin Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2 ml-1">
              Username
            </label>
            <div className="relative transition-all duration-300 group-focus-within:transform group-focus-within:scale-[1.02]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-indigo-300 group-focus-within:text-white transition-colors duration-300" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 border border-white/10 rounded-xl leading-5 bg-white/5 text-white placeholder-indigo-300/50 focus:outline-none focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 sm:text-sm"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2 ml-1">
              Password
            </label>
            <div className="relative transition-all duration-300 group-focus-within:transform group-focus-within:scale-[1.02]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-indigo-300 group-focus-within:text-white transition-colors duration-300" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 border border-white/10 rounded-xl leading-5 bg-white/5 text-white placeholder-indigo-300/50 focus:outline-none focus:bg-white/10 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 sm:text-sm"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full relative group overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl py-4 font-bold tracking-wide shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 mt-2"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12"></div>
            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Accessing System...
                </>
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </span>
          </button>
        </form>
        
        <div className="mt-8 text-center">
           <p className="text-xs text-indigo-300/40">
             Protected by SecureGuard System &copy; {new Date().getFullYear()}
           </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
