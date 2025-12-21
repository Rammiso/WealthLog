import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, MapPin, Phone, Edit, LogOut, Shield, Award } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useApp } from '../Context/AppContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const { addNotification } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: ''
  });

  const handleSave = () => {
    // Here you would typically save to backend
    addNotification({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile has been updated successfully'
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await logout();
      addNotification({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been successfully logged out'
      });
    }
  };

  const stats = [
    { label: 'Account Age', value: '6 months', icon: Calendar },
    { label: 'Total Transactions', value: '247', icon: Award },
    { label: 'Goals Achieved', value: '3', icon: Award },
    { label: 'Categories Used', value: '12', icon: Award }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Quick Action Buttons */}
      <div className="flex justify-end gap-3">
        <motion.button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg text-neon-cyan hover:bg-neon-cyan/20 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Edit className="w-4 h-4" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </motion.button>
        <motion.button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="glass rounded-xl border border-gray-700/50 p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-neon-gradient rounded-full flex items-center justify-center text-2xl font-bold text-dark-primary mx-auto">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-neon-green rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-dark-primary" />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-white mb-1">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-400 mb-2">{user?.email}</p>
            <div className="inline-block px-3 py-1 bg-neon-green/10 border border-neon-green/30 rounded-full text-neon-green text-sm">
              Premium User
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700/50">
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-2">
                <Calendar className="w-4 h-4" />
                Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                Last login: {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Today'}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass rounded-xl border border-gray-700/50 p-6 mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <stat.icon className="w-5 h-5 text-neon-cyan" />
                    <span className="text-gray-300">{stat.label}</span>
                  </div>
                  <span className="font-semibold text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="glass rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Personal Information</h3>
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-neon-green/10 border border-neon-green/30 rounded-lg text-neon-green hover:bg-neon-green/20 transition-colors"
                >
                  Save Changes
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                  />
                ) : (
                  <div className="px-3 py-2 bg-dark-primary/30 border border-gray-700/50 rounded-lg text-white">
                    {profileData.firstName || 'Not set'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                  />
                ) : (
                  <div className="px-3 py-2 bg-dark-primary/30 border border-gray-700/50 rounded-lg text-white">
                    {profileData.lastName || 'Not set'}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <div className="px-3 py-2 bg-dark-primary/30 border border-gray-700/50 rounded-lg text-white">
                  {profileData.email}
                  <span className="ml-2 text-xs text-neon-green">Verified</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                    placeholder="+251 9XX XXX XXX"
                  />
                ) : (
                  <div className="px-3 py-2 bg-dark-primary/30 border border-gray-700/50 rounded-lg text-white">
                    {profileData.phone || 'Not set'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none"
                    placeholder="City, Country"
                  />
                ) : (
                  <div className="px-3 py-2 bg-dark-primary/30 border border-gray-700/50 rounded-lg text-white">
                    {profileData.location || 'Not set'}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full px-3 py-2 bg-dark-primary border border-gray-700 rounded-lg text-white focus:border-neon-cyan focus:outline-none resize-none"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <div className="px-3 py-2 bg-dark-primary/30 border border-gray-700/50 rounded-lg text-white min-h-[100px]">
                    {profileData.bio || 'No bio added yet'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="glass rounded-xl border border-gray-700/50 p-6 mt-6">
            <h3 className="text-xl font-semibold text-white mb-4">Account Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-primary/30 rounded-lg border border-gray-700/50">
                <div>
                  <h4 className="font-medium text-white">Password</h4>
                  <p className="text-sm text-gray-400">Last changed 2 months ago</p>
                </div>
                <button className="px-4 py-2 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg text-neon-cyan hover:bg-neon-cyan/20 transition-colors">
                  Change Password
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-dark-primary/30 rounded-lg border border-gray-700/50">
                <div>
                  <h4 className="font-medium text-white">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-400">Add an extra layer of security</p>
                </div>
                <button className="px-4 py-2 bg-neon-green/10 border border-neon-green/30 rounded-lg text-neon-green hover:bg-neon-green/20 transition-colors">
                  Enable 2FA
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-dark-primary/30 rounded-lg border border-gray-700/50">
                <div>
                  <h4 className="font-medium text-white">Active Sessions</h4>
                  <p className="text-sm text-gray-400">Manage your active login sessions</p>
                </div>
                <button className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 hover:bg-yellow-500/20 transition-colors">
                  View Sessions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}