import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, ShoppingBag, Settings, Trash2, Heart, Award, BookOpen, Plus, FileText } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  // New Scheme Form State
  const [newScheme, setNewScheme] = useState({
    title: '',
    ministry: '',
    benefit: '',
    eligibility: '',
    documents: '',
    description: ''
  });

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, productsRes, schemesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/products'),
        api.get('/schemes')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
      setSchemes(schemesRes.data);
    } catch (error) {
      toast.error('Failed to load administrator records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to suspend this farmer account?')) {
      try {
        await api.delete(`/admin/users/${id}`);
        setUsers(prev => prev.filter(u => u._id !== id));
        toast.success('Farmer profile suspended successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to suspend account');
      }
    }
  };

  const handleDeleteListing = async (id) => {
    if (window.confirm('Are you sure you want to take down this product listing?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(prev => prev.filter(p => p._id !== id));
        toast.success('Listing removed from marketplace');
      } catch (error) {
        toast.error('Failed to remove listing');
      }
    }
  };

  const handleCreateScheme = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/schemes', newScheme);
      setSchemes(prev => [...prev, res.data]);
      toast.success('New welfare scheme launched successfully!');
      setNewScheme({
        title: '',
        ministry: '',
        benefit: '',
        eligibility: '',
        documents: '',
        description: ''
      });
    } catch (error) {
      toast.error('Failed to launch welfare scheme');
    }
  };

  const handleDeleteScheme = async (id) => {
    if (window.confirm('Are you sure you want to retire/delete this welfare scheme?')) {
      try {
        await api.delete(`/schemes/${id}`);
        setSchemes(prev => prev.filter(s => s._id !== id));
        toast.success('Welfare scheme retired successfully');
      } catch (error) {
        toast.error('Failed to delete scheme');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="text-amber-600" /> Platform Administration
        </h1>
        <p className="text-gray-500 mt-2">Oversee farmer accounts, manage national welfare schemes, moderate direct trade listings, and track real-time central states.</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-amber-50 w-12 h-12 rounded-xl flex items-center justify-center text-amber-600">
              <Users size={22} />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-semibold block uppercase">Total Registered Farmers</span>
              <strong className="text-2xl font-extrabold text-gray-900">{stats.totalFarmers}</strong>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-amber-50 w-12 h-12 rounded-xl flex items-center justify-center text-amber-600">
              <ShoppingBag size={22} />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-semibold block uppercase">Marketplace Products</span>
              <strong className="text-2xl font-extrabold text-gray-900">{stats.totalProducts}</strong>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-amber-50 w-12 h-12 rounded-xl flex items-center justify-center text-amber-600">
              <BookOpen size={22} />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-semibold block uppercase">Active Welfare Schemes</span>
              <strong className="text-2xl font-extrabold text-gray-900">{schemes.length}</strong>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-amber-50 w-12 h-12 rounded-xl flex items-center justify-center text-amber-600">
              <Settings className="text-amber-600" size={22} />
            </div>
            <div>
              <span className="text-xs text-gray-400 font-semibold block uppercase">System Performance</span>
              <strong className="text-2xl font-extrabold text-amber-600">{stats.systemUptime}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mb-8 gap-6">
        <button 
          onClick={() => setActiveTab('users')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'users' ? 'border-amber-600 text-amber-600 font-extrabold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Farmer Registry ({users.filter(u => u.role !== 'admin').length})
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'products' ? 'border-amber-600 text-amber-600 font-extrabold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Marketplace Moderation ({products.length})
        </button>
        <button 
          onClick={() => setActiveTab('schemes')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'schemes' ? 'border-amber-600 text-amber-600 font-extrabold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Welfare Schemes Manager ({schemes.length})
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-1">
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="p-5">Farmer ID</th>
                  <th className="p-5">Name</th>
                  <th className="p-5">Email</th>
                  <th className="p-5">Mobile</th>
                  <th className="p-5">Role</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {users.filter(u => u.role !== 'admin').map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5 text-xs text-gray-400 font-mono">{u._id}</td>
                    <td className="p-5 font-semibold text-gray-900">{u.name}</td>
                    <td className="p-5 text-gray-500">{u.email}</td>
                    <td className="p-5 text-gray-500">{u.mobile}</td>
                    <td className="p-5">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide bg-kisan-green/10 text-kisan-green w-fit">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => handleDeleteUser(u._id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-55/40 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="p-5">Crop Name</th>
                  <th className="p-5">Category</th>
                  <th className="p-5">Farmer Owner</th>
                  <th className="p-5">Price</th>
                  <th className="p-5">Avail. Qty</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5 font-semibold text-gray-900 flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span>{p.name}</span>
                    </td>
                    <td className="p-5 capitalize"><span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">{p.category}</span></td>
                    <td className="p-5 text-gray-500">{p.farmerName}</td>
                    <td className="p-5 font-semibold text-gray-900">₹{p.price} / {p.unit}</td>
                    <td className="p-5 text-gray-500">{p.quantity} {p.unit}</td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => handleDeleteListing(p._id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-55/40 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'schemes' && (
          <div className="p-6 grid lg:grid-cols-3 gap-8">
            {/* Create Scheme Form */}
            <div className="lg:col-span-1 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Plus size={20} className="text-amber-600" /> Launch Welfare Scheme
              </h3>
              <form onSubmit={handleCreateScheme} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Scheme Title</label>
                  <input 
                    type="text" required value={newScheme.title} 
                    onChange={(e) => setNewScheme({...newScheme, title: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none" 
                    placeholder="e.g. PM-Kisan Samman Nidhi"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Governing Ministry</label>
                  <input 
                    type="text" required value={newScheme.ministry} 
                    onChange={(e) => setNewScheme({...newScheme, ministry: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none" 
                    placeholder="e.g. Ministry of Agriculture"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Benefits Provided</label>
                  <input 
                    type="text" required value={newScheme.benefit} 
                    onChange={(e) => setNewScheme({...newScheme, benefit: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none" 
                    placeholder="e.g. ₹6,000 per year"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Eligibility Criteria</label>
                  <input 
                    type="text" required value={newScheme.eligibility} 
                    onChange={(e) => setNewScheme({...newScheme, eligibility: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none" 
                    placeholder="e.g. All landholding farmer families"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Required Documents (Comma-separated)</label>
                  <input 
                    type="text" required value={newScheme.documents} 
                    onChange={(e) => setNewScheme({...newScheme, documents: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none" 
                    placeholder="Aadhaar, Land records, Bank details"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Scheme Description</label>
                  <textarea 
                    rows={3} required value={newScheme.description} 
                    onChange={(e) => setNewScheme({...newScheme, description: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 outline-none resize-none" 
                    placeholder="Provide a brief summary of the scheme's main goals."
                  />
                </div>
                <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-1.5">
                  <Plus size={18} /> Launch Scheme
                </button>
              </form>
            </div>

            {/* Schemes Directory Table */}
            <div className="lg:col-span-2 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="p-4">Scheme Details</th>
                    <th className="p-4">Benefits</th>
                    <th className="p-4 text-center">Applications</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {schemes.map((s) => (
                    <tr key={s._id || s.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-gray-900 mb-1 flex items-center gap-1">
                          <FileText size={16} className="text-amber-600" /> {s.title}
                        </div>
                        <div className="text-xs text-gray-400">{s.ministry}</div>
                      </td>
                      <td className="p-4 font-semibold text-gray-800">{s.benefit}</td>
                      <td className="p-4 text-center">
                        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
                          {s.appliedFarmers ? s.appliedFarmers.length : 0}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDeleteScheme(s._id || s.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-55/40 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
