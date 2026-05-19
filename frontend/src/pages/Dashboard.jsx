import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, CloudRain, Leaf, ShoppingCart, User, Bell, Camera, BookOpen, Shield, Check, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { translations } from '../utils/translations';
import api from '../api/axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';

const data = [
  { name: 'Jan', profit: 4000 },
  { name: 'Feb', profit: 3000 },
  { name: 'Mar', profit: 5000 },
  { name: 'Apr', profit: 4500 },
  { name: 'May', profit: 6000 },
  { name: 'Jun', profit: 5500 },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user, language } = useAuthStore();
  const t = translations[language] || translations.en;

  // Strict RBAC Sidebar Navigation
  const navItems = user?.role === 'admin'
    ? [
        { icon: LayoutDashboard, label: t.overview, path: '/dashboard' },
        { icon: Shield, label: t.adminPanel, path: '/dashboard/admin' },
        { icon: User, label: t.profile, path: '/dashboard/profile' },
      ]
    : [
        { icon: LayoutDashboard, label: t.overview, path: '/dashboard' },
        { icon: Leaf, label: t.cropAi, path: '/dashboard/crop-ai' },
        { icon: Camera, label: t.diseaseAi, path: '/dashboard/disease-ai' },
        { icon: CloudRain, label: t.weather, path: '/dashboard/weather' },
        { icon: BookOpen, label: t.schemes, path: '/dashboard/schemes' },
        { icon: ShoppingCart, label: t.marketplace, path: '/dashboard/marketplace' },
        { icon: User, label: t.profile, path: '/dashboard/profile' },
      ];

  return (
    <div className="w-64 bg-white dark:bg-zinc-900 h-screen fixed left-0 top-0 border-r border-gray-100 dark:border-zinc-800 flex flex-col pt-20 px-4 shadow-sm z-40 transition-colors duration-300">
      <nav className="flex flex-col gap-2">
        {navItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <Link to={item.path} key={idx} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-kisan-green text-white shadow-md' : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}>
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

const Dashboard = () => {
  const { user, language } = useAuthStore();
  const t = translations[language] || translations.en;
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error('Failed to load notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to update alert');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Role-Based Dashboard Configuration
  const isAdmin = user?.role === 'admin';

  const stats = isAdmin
    ? [
        { title: 'Total Registered Farmers', value: '12,500', sub: 'Active across 4 Indian states' },
        { title: 'Active Marketplace Listings', value: '1,420', sub: '₹4.8 Crores in direct agricultural trade' },
        { title: 'Central Infrastructure Status', value: '99.98%', sub: 'All Central agritech server nodes active' },
      ]
    : [
        { title: t.weatherForecast, value: '31°C', sub: t.sunnySowing },
        { title: t.soilMoisture, value: '62%', sub: t.optimalComposition },
        { title: t.activeNotifications, value: unreadCount.toString(), sub: `${unreadCount} ${t.unreadAlerts}` },
      ];

  const chartTitle = isAdmin
    ? 'Welfare Fund Disbursement Tracking (FY 2026)'
    : t.profitChartTitle;

  const adminDisbursementData = [
    { name: 'Jan', profit: 45000 },
    { name: 'Feb', profit: 58000 },
    { name: 'Mar', profit: 72000 },
    { name: 'Apr', profit: 64000 },
    { name: 'May', profit: 89000 },
    { name: 'Jun', profit: 95000 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pt-20 flex transition-colors duration-300">
      <Sidebar />
      <div className="ml-64 flex-1 p-8 relative">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isAdmin ? 'Welcome back, Officer 👋' : `Welcome back, ${user?.name || 'User'} 👋`}
            </h1>
            <p className="text-gray-500 dark:text-zinc-400">
              {isAdmin ? 'Welcome to the Government Administrative Telemetry Portal.' : t.overviewSub}
            </p>
          </div>
          
          <div className="flex gap-4 relative">
            {!isAdmin && (
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 relative hover:shadow-md transition-all text-gray-600 dark:text-zinc-300"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Notifications Dropdown Panel */}
            <AnimatePresence>
              {showNotifications && !isAdmin && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-14 w-80 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex justify-between items-center text-gray-900 dark:text-white">
                    <h3 className="font-bold text-sm">Farm Alerts Telemetry</h3>
                    <button onClick={() => setShowNotifications(false)} className="hover:bg-gray-200 dark:hover:bg-zinc-850 p-1.5 rounded-lg transition-colors">
                      <X size={14} />
                    </button>
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-xs font-semibold">
                        No active farm notifications
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n._id} className={`p-4 transition-colors flex justify-between gap-2 items-start ${n.read ? 'bg-white opacity-60' : 'bg-kisan-green/5'}`}>
                          <div>
                            <h4 className="font-bold text-xs text-gray-800 leading-tight mb-1">{n.title}</h4>
                            <p className="text-[11px] text-gray-500 leading-relaxed">{n.message}</p>
                          </div>
                          {!n.read && (
                            <button 
                              onClick={() => handleMarkRead(n._id)}
                              className="bg-white hover:bg-kisan-green hover:text-white border border-gray-100 p-1 rounded-lg transition-all text-kisan-green mt-0.5 flex-shrink-0"
                              title="Mark as Read"
                            >
                              <Check size={12} />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <motion.div key={idx} whileHover={{ y: -4 }} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 font-sans transition-colors duration-300">
              <h3 className="text-sm font-medium text-gray-500 dark:text-zinc-450 mb-2">{stat.title}</h3>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{stat.value}</p>
              <p className="text-xs text-kisan-green dark:text-kisan-green-light font-semibold">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-colors duration-300">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">{chartTitle}</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={isAdmin ? adminDisbursementData : data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888'}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#18181b', color: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="profit" stroke={isAdmin ? '#d97706' : '#166534'} strokeWidth={3} dot={{r: 4, fill: isAdmin ? '#d97706' : '#166534'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
