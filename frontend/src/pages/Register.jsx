import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, Mail, Lock, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [role, setRole] = useState('farmer'); // 'farmer' or 'admin'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', { 
        name: formData.name, 
        email: formData.email, 
        password: formData.password, 
        mobile: formData.phone,
        role: role
      });
      toast.success('Registration successful! Please login to your account.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 pt-10 pb-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glassmorphism w-full max-w-md p-8"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-kisan-green/10 text-kisan-green rounded-xl mb-4">
            <Leaf size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Join KisanSetu</h2>
          <p className="text-gray-500 mt-2">Start your smart farming journey today</p>
        </div>

        {/* Role Tab Selector */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button 
            type="button" 
            onClick={() => setRole('farmer')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'farmer' ? 'bg-kisan-green text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Farmer Registration
          </button>
          <button 
            type="button" 
            onClick={() => setRole('admin')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'admin' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Govt Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" name="name" required value={formData.name} onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-kisan-green focus:border-kisan-green sm:text-sm transition-all"
                placeholder={role === 'admin' ? 'Officer Name' : 'Ramesh Kumar'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input 
                type="email" name="email" required value={formData.email} onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-kisan-green focus:border-kisan-green sm:text-sm transition-all"
                placeholder={role === 'admin' ? 'admin@kisansetu.gov.in' : 'farmer@example.com'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={18} className="text-gray-400" />
              </div>
              <input 
                type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-kisan-green focus:border-kisan-green sm:text-sm transition-all"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input 
                type="password" name="password" required value={formData.password} onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-kisan-green focus:border-kisan-green sm:text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full flex justify-center items-center gap-2 text-white py-3 px-4 rounded-xl focus:ring-4 font-bold transition-all ${role === 'admin' ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500/30' : 'bg-kisan-green hover:bg-kisan-green-dark focus:ring-kisan-green/30'}`}
          >
            {loading ? <span className="animate-pulse">Creating Account...</span> : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-kisan-green hover:text-kisan-green-dark">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
