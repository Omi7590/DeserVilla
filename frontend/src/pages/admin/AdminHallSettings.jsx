import { useState, useEffect } from 'react';
import { Settings, DollarSign, Clock, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminHallSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    hourly_rate: '',
    start_hour: '',
    end_hour: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/hall-settings');
      
      if (response.data.success) {
        const settingsData = response.data.settings;
        setSettings({
          hourly_rate: settingsData.hourly_rate?.value || '500',
          start_hour: settingsData.start_hour?.value || '10',
          end_hour: settingsData.end_hour?.value || '20'
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load hall settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async (settingKey) => {
    try {
      setSaving(true);
      const response = await api.put('/admin/hall-settings', {
        settingKey,
        settingValue: settings[settingKey]
      });

      if (response.data.success) {
        toast.success('Setting updated successfully');
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error(error.response?.data?.error || 'Failed to update setting');
      // Revert on error
      fetchSettings();
    } finally {
      setSaving(false);
    }
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
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Hall Settings
        </h1>
        <p className="text-gray-600 mt-2">Configure hall booking prices and timings</p>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Hourly Rate */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Hourly Rate</h3>
              <p className="text-sm text-gray-500">Price per hour</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate (₹)
              </label>
              <input
                type="number"
                min="100"
                step="50"
                value={settings.hourly_rate}
                onChange={(e) => handleChange('hourly_rate', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum: ₹100</p>
            </div>
            
            <button
              onClick={() => handleSave('hourly_rate')}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </button>
          </div>
        </div>

        {/* Start Hour */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Start Hour</h3>
              <p className="text-sm text-gray-500">Opening time</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hour (24-hour format)
              </label>
              <input
                type="number"
                min="0"
                max="23"
                value={settings.start_hour}
                onChange={(e) => handleChange('start_hour', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current: {settings.start_hour}:00 ({parseInt(settings.start_hour) > 12 ? parseInt(settings.start_hour) - 12 : settings.start_hour} {parseInt(settings.start_hour) >= 12 ? 'PM' : 'AM'})
              </p>
            </div>
            
            <button
              onClick={() => handleSave('start_hour')}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </button>
          </div>
        </div>

        {/* End Hour */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">End Hour</h3>
              <p className="text-sm text-gray-500">Closing time</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hour (24-hour format)
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={settings.end_hour}
                onChange={(e) => handleChange('end_hour', e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current: {settings.end_hour}:00 ({parseInt(settings.end_hour) > 12 ? parseInt(settings.end_hour) - 12 : settings.end_hour} {parseInt(settings.end_hour) >= 12 ? 'PM' : 'AM'})
              </p>
            </div>
            
            <button
              onClick={() => handleSave('end_hour')}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-900 mb-2">Important Notes</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Changes take effect immediately for new bookings</li>
              <li>• Existing bookings will retain their original pricing</li>
              <li>• Start hour must be less than end hour</li>
              <li>• Use 24-hour format (0-23 for start, 1-24 for end)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHallSettings;
