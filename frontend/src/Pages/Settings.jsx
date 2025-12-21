import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe, Save } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useApp } from '../Context/AppContext';

export default function Settings() {
  const { user } = useAuth();
  const { addNotification } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    // Profile settings
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    currency: user?.currency || 'ETB',
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    goalReminders: true,
    budgetAlerts: true,
    
    // Security settings
    twoFactorAuth: false,
    sessionTimeout: '30',
    
    // Appearance settings
    theme: 'dark',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'comma'
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  const handleSave = () => {
    // Here you would typically save to backend
    addNotification({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your settings have been updated successfully'
    });
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
            <input
              type="text"
              value={settings.firstName}
              onChange={(e) => setSettings({ ...settings, firstName: e.target.value })}
              className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
            <input
              type="text"
              value={settings.lastName}
              onChange={(e) => setSettings({ ...settings, lastName: e.target.value })}
              className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Default Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
            >
              <option value="ETB">Ethiopian Birr (ETB)</option>
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">British Pound (GBP)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
            { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser push notifications' },
            { key: 'weeklyReports', label: 'Weekly Reports', description: 'Get weekly financial summaries' },
            { key: 'goalReminders', label: 'Goal Reminders', description: 'Reminders about your financial goals' },
            { key: 'budgetAlerts', label: 'Budget Alerts', description: 'Alerts when approaching budget limits' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-dark-primary/30 rounded-lg border border-gray-700/50">
              <div>
                <h4 className="font-medium text-white">{item.label}</h4>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[item.key]}
                  onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-cyan"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="p-4 bg-dark-primary/30 rounded-lg border border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-white">Two-Factor Authentication</h4>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-cyan"></div>
              </label>
            </div>
            <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
          </div>

          <div className="p-4 bg-dark-primary/30 rounded-lg border border-gray-700/50">
            <h4 className="font-medium text-white mb-2">Session Timeout</h4>
            <p className="text-sm text-gray-400 mb-3">Automatically log out after inactivity</p>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
              className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="never">Never</option>
            </select>
          </div>

          <div className="p-4 bg-dark-primary/30 rounded-lg border border-gray-700/50">
            <h4 className="font-medium text-white mb-2">Change Password</h4>
            <p className="text-sm text-gray-400 mb-3">Update your account password</p>
            <button className="px-4 py-2 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg text-neon-cyan hover:bg-neon-cyan/20 transition-colors">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Appearance & Localization</h3>
        <div className="space-y-4">
          <div className="p-4 bg-dark-primary/30 rounded-lg border border-gray-700/50">
            <h4 className="font-medium text-white mb-2">Theme</h4>
            <p className="text-sm text-gray-400 mb-3">Choose your preferred theme</p>
            <div className="grid grid-cols-3 gap-3">
              {['dark', 'light', 'auto'].map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSettings({ ...settings, theme })}
                  className={`p-3 rounded-lg border transition-colors capitalize ${
                    settings.theme === theme
                      ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                      : 'border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-dark-primary/30 rounded-lg border border-gray-700/50">
            <h4 className="font-medium text-white mb-2">Language</h4>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
            >
              <option value="en">English</option>
              <option value="am">አማርኛ (Amharic)</option>
              <option value="or">Oromiffa</option>
            </select>
          </div>

          <div className="p-4 bg-dark-primary/30 rounded-lg border border-gray-700/50">
            <h4 className="font-medium text-white mb-2">Date Format</h4>
            <select
              value={settings.dateFormat}
              onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
              className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div className="p-4 bg-dark-primary/30 rounded-lg border border-gray-700/50">
            <h4 className="font-medium text-white mb-2">Number Format</h4>
            <select
              value={settings.numberFormat}
              onChange={(e) => setSettings({ ...settings, numberFormat: e.target.value })}
              className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
            >
              <option value="comma">1,234.56</option>
              <option value="space">1 234.56</option>
              <option value="period">1.234,56</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account preferences and settings</p>
        </div>
        <motion.button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-neon-green/10 border border-neon-green/30 rounded-lg text-neon-green hover:bg-neon-green/20 transition-all duration-300 font-mono"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Save className="w-5 h-5" />
          Save Changes
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass rounded-xl border border-gray-700/50 overflow-hidden">
            <div className="p-4 border-b border-gray-700/50">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                Settings
              </h2>
            </div>
            <nav className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="glass rounded-xl border border-gray-700/50 p-6">
            {activeTab === 'profile' && renderProfileSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'appearance' && renderAppearanceSettings()}
          </div>
        </div>
      </div>
    </div>
  );
}