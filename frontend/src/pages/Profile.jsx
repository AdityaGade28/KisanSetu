import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Shield, MapPin, Phone, Save, Award, 
  Camera, Lock, CheckCircle, AlertTriangle, Trash2, Key, HelpCircle 
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { toast } from 'react-hot-toast';
import api from '../api/axios';

const Profile = () => {
  const user = useAuthStore(state => state.user);
  const updateUser = useAuthStore(state => state.updateUser);
  const isAdmin = user?.role === 'admin';
  
  const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'farm', 'security'
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  
  const [profileData, setProfileData] = useState({
    name: user?.name || (isAdmin ? 'Aditya' : 'Ramesh Patil'),
    email: user?.email || (isAdmin ? 'aditya@kisansetu.gov.in' : 'ramesh.patil@example.com'),
    phone: user?.mobile || (isAdmin ? '+91 11-23383309' : '+91 98765 43210'),
    aadhar: user?.aadhar || 'XXXX XXXX 4321',
    address: user?.address || 'Village Pimpri, Taluka Daund, Dist. Pune',
    state: user?.state || 'Maharashtra',
    pinCode: user?.pinCode || '413801',
    // Farm fields
    farmId: user?.farmId || 'KS-FARM-98124',
    farmSize: user?.farmSize || '5.5 Hectares',
    currentCrop: user?.currentCrop || 'Onion, Wheat, Grapes',
    farmLocation: user?.farmLocation || 'Village Pimpri, Taluka Daund, Dist. Pune',
    // Admin fields
    department: user?.department || 'Department of Agriculture & Farmers Welfare',
    adminLevel: user?.adminLevel || 'Central Registry Director',
    employeeId: user?.employeeId || 'GST-2026-9812',
    role: user?.role || 'farmer'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const formatAadhar = (value) => {
    // Remove all non-alphanumeric/non-digits, allowing X for mask placeholder
    const cleaned = value.replace(/[^0-9X]/gi, '');
    // Group into 4 digits separated by spaces (max 3 groups for 12 digits total)
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.slice(0, 3).join(' ') : cleaned;
  };

  const handleChange = (e) => {
    if (e.target.name === 'aadhar') {
      const formatted = formatAadhar(e.target.value);
      setProfileData({ ...profileData, aadhar: formatted });
    } else {
      setProfileData({ ...profileData, [e.target.name]: e.target.value });
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        
        try {
          const res = await api.put('/auth/profile', { profileImage: base64String });
          updateUser(res.data);
          toast.success('Profile picture updated successfully!');
        } catch (error) {
          toast.error('Failed to save profile picture');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/profile', {
        name: profileData.name,
        email: profileData.email,
        mobile: profileData.phone,
        profileImage: profileImage,
        aadhar: profileData.aadhar,
        address: profileData.address,
        pinCode: profileData.pinCode,
        farmId: profileData.farmId,
        farmSize: profileData.farmSize,
        currentCrop: profileData.currentCrop,
        farmLocation: profileData.farmLocation,
        department: profileData.department,
        adminLevel: profileData.adminLevel,
        employeeId: profileData.employeeId
      });
      updateUser(res.data);
      toast.success(isAdmin ? 'Government Admin credentials updated successfully!' : 'Profile details updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      await api.put('/auth/profile', { password: passwordData.newPassword });
      toast.success('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    }
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(!twoFactorEnabled ? 'Two-Factor Authentication Enabled!' : 'Two-Factor Authentication Disabled');
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion requested. Please contact Central Administration support.');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          {isAdmin ? (
            <Shield className="text-amber-600" />
          ) : (
            <User className="text-kisan-green" />
          )}
          {isAdmin ? 'Government Admin Profile' : 'Farmer Profile Management'}
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 mt-2">
          {isAdmin 
            ? 'Manage your official credentials, ministry department details, regional jurisdiction levels, and administrative credentials.' 
            : 'Configure your personal information, address telemetry, farm size assets, and security parameters.'}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Profile Card & Sidebar Tabs */}
        <div className="space-y-6">
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col items-center text-center transition-colors duration-300"
          >
            <div className="relative group mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-3xl font-extrabold shadow-sm border-2 border-kisan-green bg-kisan-green/10 text-kisan-green dark:text-kisan-green-light">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profileData.name.charAt(0)
                )}
              </div>
              
              <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-kisan-green hover:bg-kisan-green-dark text-white p-2 rounded-full cursor-pointer shadow-md transition-all border-2 border-white dark:border-zinc-900 flex items-center justify-center">
                <Camera size={14} />
              </label>
              <input type="file" id="profile-upload" className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profileData.name}</h2>
            <span className={`text-xs px-3 py-1 rounded-full font-bold mt-2 uppercase tracking-wide flex items-center gap-1 ${isAdmin ? 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900' : 'bg-kisan-green/10 text-kisan-green dark:bg-kisan-green/20 dark:text-kisan-green-light'}`}>
              <Award size={14} /> Verified {isAdmin ? 'Government Admin' : 'Farmer'}
            </span>
   
            <div className="w-full mt-6 space-y-3 pt-6 border-t border-gray-50 dark:border-zinc-800 text-left">
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-zinc-400">
                <Mail size={16} />
                <span className="truncate">{profileData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-zinc-400">
                <MapPin size={16} />
                <span className="truncate">{profileData.address || profileData.location}</span>
              </div>
            </div>
          </motion.div>

          {/* Navigation Sidebar Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-3 space-y-1.5 shadow-sm transition-colors duration-300"
          >
            <button 
              onClick={() => setActiveTab('personal')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'personal' ? 'bg-kisan-green text-white shadow-md' : 'text-gray-600 dark:text-zinc-450 hover:bg-gray-50 dark:hover:bg-zinc-850'}`}
            >
              <User size={18} /> Personal Info
            </button>
            <button 
              onClick={() => setActiveTab('farm')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'farm' ? 'bg-kisan-green text-white shadow-md' : 'text-gray-600 dark:text-zinc-450 hover:bg-gray-50 dark:hover:bg-zinc-850'}`}
            >
              <Award size={18} /> {isAdmin ? 'Administrative Records' : 'Farm Details'}
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'security' ? 'bg-kisan-green text-white shadow-md' : 'text-gray-600 dark:text-zinc-450 hover:bg-gray-50 dark:hover:bg-zinc-850'}`}
            >
              <Shield size={18} /> Security Settings
            </button>
          </motion.div>
        </div>
 
        {/* Right Column: Dynamic Form Fields Editor */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="md:col-span-2 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col justify-between transition-colors duration-300"
        >
          <AnimatePresence mode="wait">
            {activeTab === 'personal' && (
              <motion.div 
                key="personal"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h3>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">Your basic personal details</p>
                </div>
                
                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wide mb-1.5">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <User size={16} />
                        </div>
                        <input 
                          type="text" 
                          name="name" 
                          value={profileData.name} 
                          onChange={handleChange} 
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-kisan-green focus:border-kisan-green outline-none bg-white dark:bg-zinc-950 dark:text-white transition-colors duration-300" 
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wide mb-1.5">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Phone size={16} />
                        </div>
                        <input 
                          type="text" 
                          name="phone" 
                          value={profileData.phone} 
                          onChange={handleChange} 
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-kisan-green focus:border-kisan-green outline-none bg-white dark:bg-zinc-950 dark:text-white transition-colors duration-300" 
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wide mb-1.5">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Mail size={16} />
                        </div>
                        <input 
                          type="email" 
                          name="email" 
                          value={profileData.email} 
                          onChange={handleChange} 
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-kisan-green focus:border-kisan-green outline-none bg-white dark:bg-zinc-950 dark:text-white transition-colors duration-300" 
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wide mb-1.5">Aadhar Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Shield size={16} />
                        </div>
                        <input 
                          type="text" 
                          name="aadhar" 
                          value={profileData.aadhar} 
                          onChange={handleChange} 
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-kisan-green focus:border-kisan-green outline-none bg-white dark:bg-zinc-950 dark:text-white transition-colors duration-300" 
                          placeholder="XXXX XXXX 4321"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wide mb-1.5">Address</label>
                    <div className="relative">
                      <div className="absolute top-3.5 left-3.5 pointer-events-none text-gray-400">
                        <MapPin size={16} />
                      </div>
                      <textarea 
                        name="address" 
                        value={profileData.address} 
                        onChange={handleChange} 
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm h-20 focus:ring-2 focus:ring-kisan-green focus:border-kisan-green outline-none bg-white dark:bg-zinc-950 dark:text-white transition-colors duration-300"
                        placeholder="Village Pimpri, Taluka Daund, Dist. Pune"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wide mb-1.5">State</label>
                      <input 
                        type="text" 
                        name="state" 
                        value={profileData.state} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-kisan-green focus:border-kisan-green outline-none bg-white dark:bg-zinc-950 dark:text-white transition-colors duration-300" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wide mb-1.5">PIN Code</label>
                      <input 
                        type="text" 
                        name="pinCode" 
                        value={profileData.pinCode} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-kisan-green focus:border-kisan-green outline-none bg-white dark:bg-zinc-950 dark:text-white transition-colors duration-300" 
                        placeholder="413801"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-150 dark:border-zinc-800 flex justify-end">
                    <button 
                      type="submit" 
                      className={`text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-all flex items-center gap-2 ${isAdmin ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/10' : 'bg-kisan-green hover:bg-kisan-green-dark'}`}
                    >
                      <Save size={18} /> Update Details
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'farm' && (
              <motion.div 
                key="farm"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                {isAdmin ? (
                  // Govt Admin View
                  <>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Administrative Official Registry</h3>
                      <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">Manage official central credentials</p>
                    </div>

                    <form onSubmit={handleSave} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wide mb-1.5">Official Office Location</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                              <MapPin size={16} />
                            </div>
                            <input 
                              type="text" 
                              name="location" 
                              value={profileData.location} 
                              onChange={handleChange} 
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white dark:bg-zinc-950 dark:text-white transition-colors duration-300" 
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wide mb-1.5">Employee Identification ID</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                              <Shield size={16} />
                            </div>
                            <input 
                              type="text" 
                              name="employeeId" 
                              value={profileData.employeeId} 
                              readOnly
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm bg-gray-50 dark:bg-zinc-950 dark:text-white outline-none cursor-not-allowed" 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wide mb-1.5">Department / Ministry</label>
                          <input 
                            type="text" 
                            name="department" 
                            value={profileData.department} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white dark:bg-zinc-950 dark:text-white transition-colors duration-300" 
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wide mb-1.5">Administrative Level</label>
                          <input 
                            type="text" 
                            name="adminLevel" 
                            value={profileData.adminLevel} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white dark:bg-zinc-950 dark:text-white transition-colors duration-300" 
                          />
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-150 dark:border-zinc-800 flex justify-end">
                        <button 
                          type="submit" 
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-all flex items-center gap-2"
                        >
                          <Save size={18} /> Update Credentials
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  // Farmer View
                  <>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Farm Records</h3>
                      <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">Manage your farm records</p>
                    </div>

                    <form onSubmit={handleSave} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wide mb-1.5">Farm ID</label>
                          <input 
                            type="text" 
                            name="farmId" 
                            value={profileData.farmId} 
                            readOnly
                            className="w-full px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm bg-gray-50 dark:bg-zinc-950 dark:text-white cursor-not-allowed outline-none" 
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wide mb-1.5">Farm Size</label>
                          <input 
                            type="text" 
                            name="farmSize" 
                            value={profileData.farmSize} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-kisan-green focus:border-kisan-green outline-none bg-white dark:bg-zinc-950 dark:text-white transition-colors duration-300" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wide mb-1.5">Current Crops</label>
                          <input 
                            type="text" 
                            name="currentCrop" 
                            value={profileData.currentCrop} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-kisan-green focus:border-kisan-green outline-none bg-white dark:bg-zinc-950 dark:text-white transition-colors duration-300" 
                            placeholder="Onion, Wheat, Grapes"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wide mb-1.5">Farm Location</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                              <MapPin size={16} />
                            </div>
                            <input 
                              type="text" 
                              name="farmLocation" 
                              value={profileData.farmLocation} 
                              onChange={handleChange} 
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-kisan-green focus:border-kisan-green outline-none bg-white dark:bg-zinc-950 dark:text-white transition-colors duration-300" 
                              placeholder="Village Pimpri, Taluka Daund, Dist. Pune"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-150 dark:border-zinc-800 flex justify-end">
                        <button 
                          type="submit" 
                          className="bg-kisan-green hover:bg-kisan-green-dark text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-all flex items-center gap-2"
                        >
                          <Save size={18} /> Save Farm Details
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div 
                key="security"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Security Settings</h3>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">Manage your security settings</p>
                </div>

                {/* Change Password Panel */}
                <div className="bg-gray-50/50 dark:bg-zinc-950/40 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800/80 space-y-4">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Key size={16} className="text-kisan-green" /> Change Password
                  </h4>
                  
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase mb-1">Current Password</label>
                      <input 
                        type="password" 
                        name="currentPassword" 
                        value={passwordData.currentPassword} 
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-kisan-green focus:border-kisan-green outline-none bg-white dark:bg-zinc-950 dark:text-white" 
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase mb-1">New Password</label>
                        <input 
                          type="password" 
                          name="newPassword" 
                          value={passwordData.newPassword} 
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-kisan-green focus:border-kisan-green outline-none bg-white dark:bg-zinc-950 dark:text-white" 
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase mb-1">Confirm New Password</label>
                        <input 
                          type="password" 
                          name="confirmPassword" 
                          value={passwordData.confirmPassword} 
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-kisan-green focus:border-kisan-green outline-none bg-white dark:bg-zinc-950 dark:text-white" 
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button type="submit" className="bg-kisan-green hover:bg-kisan-green-dark text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-md transition-all">
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>

                {/* Two-Factor Authentication Toggle */}
                <div className="flex justify-between items-center p-6 bg-gray-50/50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800/80 rounded-2xl">
                  <div className="space-y-1 pr-4">
                    <h4 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
                      <CheckCircle size={16} className={twoFactorEnabled ? "text-kisan-green" : "text-amber-500"} />
                      Two-Factor Authentication (2FA)
                    </h4>
                    <p className="text-xs text-gray-400">Add an extra layer of protection to your farmer credentials via mobile OTP validation.</p>
                  </div>
                  
                  <button 
                    onClick={handleToggle2FA}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${twoFactorEnabled ? 'bg-kisan-green' : 'bg-gray-200 dark:bg-zinc-800'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Danger Zone: Delete Account */}
                <div className="p-6 bg-red-50/40 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20 rounded-2xl space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-950/30 text-red-600 rounded-xl">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-red-800 dark:text-red-400">Delete Account</h4>
                      <p className="text-xs text-red-600 dark:text-red-500/80 mt-1">Once you delete your KisanSetu account, all marketplace listings, transaction history, and pathology logs will be permanently erased.</p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Delete Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
