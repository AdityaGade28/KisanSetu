import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer'); // 'farmer' or 'admin'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const user = response.data;

      // Verify that logged-in user matches selected role
      if (user.role !== role) {
        const roleLabel = role === 'admin' ? 'Government Admin' : 'Farmer';
        toast.error(`Access denied. This account is not registered as a ${roleLabel}.`);
        setLoading(false);
        return;
      }

      login(user, user.token);
      toast.success(`Welcome back, ${user.name}👋`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 pt-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glassmorphism w-full max-w-md p-8"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-kisan-green/10 text-kisan-green rounded-xl mb-4">
            <Leaf size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Sign in to manage your smart farm</p>
        </div>

        {/* Role Tab Selector */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button 
            type="button" 
            onClick={() => setRole('farmer')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'farmer' ? 'bg-kisan-green text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Farmer Portal
          </button>
          <button 
            type="button" 
            onClick={() => setRole('admin')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'admin' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Govt Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-kisan-green focus:border-kisan-green sm:text-sm transition-all"
                placeholder={role === 'admin' ? 'admin@kisansetu.gov.in' : 'farmer@example.com'}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <a href="#" className="text-sm text-kisan-green hover:text-kisan-green-dark">Forgot password?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {loading ? <span className="animate-pulse">Signing in...</span> : <><LogIn size={20} /> Sign In</>}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          New to KisanSetu?{' '}
          <Link to="/register" className="font-medium text-kisan-green hover:text-kisan-green-dark">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
