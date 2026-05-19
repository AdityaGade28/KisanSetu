import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Plus, Trash2, Star, ShoppingCart, X, Leaf, Check, Camera, Heart, HeartOff } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  });
  const [sortOption, setSortOption] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const user = useAuthStore(state => state.user);

  // Form State for listing new product
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', quantity: '', unit: 'kg', category: 'grains', image: ''
  });

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      toast.error('Failed to load marketplace products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/products', formData);
      setProducts(prev => [res.data, ...prev]);
      toast.success('Product listed successfully!');
      setShowAddModal(false);
      setFormData({ name: '', description: '', price: '', quantity: '', unit: 'kg', category: 'grains', image: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to list product');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Listing deleted');
    } catch (error) {
      toast.error('Could not delete product');
    }
  };

  const addToCart = (product) => {
    const exists = cart.find(item => item._id === product._id);
    if (exists) {
      setCart(prev => prev.map(item => item._id === product._id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart(prev => [...prev, { ...product, qty: 1 }]);
    }
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const toggleWishlist = (productId) => {
    let updated;
    if (wishlist.includes(productId)) {
      updated = wishlist.filter(id => id !== productId);
    } else {
      updated = [...wishlist, productId];
    }
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const filteredAndSorted = useMemo(() => {
    let list = [...products];

    // Search filter
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      list = list.filter(p => p.category === categoryFilter);
    }

    // Price range filter
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    if (sortOption === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'newest') {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortOption === 'rating') {
      list.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
    }

    return list;
  }, [products, search, categoryFilter, priceRange, sortOption]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage) || 1;

  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredAndSorted.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAndSorted, currentPage]);

  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="text-kisan-green" /> KisanSetu Farmer Marketplace
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 mt-2">Buy fresh organic produce directly from farmers or sell your yield globally without any middleman commissions.</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setShowCart(true)} 
            className="relative bg-white dark:bg-zinc-900 text-gray-800 dark:text-white border border-gray-200 dark:border-zinc-800 p-3.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setShowAddModal(true)} 
            className="bg-kisan-green hover:bg-kisan-green-dark text-white px-5 py-3.5 rounded-xl shadow-md flex items-center gap-2 font-semibold transition-all"
          >
            <Plus size={20} /> Sell Your Crop
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-6 mb-10 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search organic fruits, vegetables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-zinc-800 rounded-xl focus:ring-kisan-green focus:border-kisan-green sm:text-sm bg-white dark:bg-zinc-900 dark:text-white shadow-sm transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-kisan-green"
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="rating">Rating</option>
          </select>

          <div className="hidden lg:flex items-center gap-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5">
            <span className="text-sm text-gray-500 dark:text-zinc-400 font-medium">Price:</span>
            <input
              type="number"
              min="0"
              max="10000"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-16 border-b border-gray-200 dark:border-zinc-800 bg-transparent text-sm dark:text-white focus:outline-none focus:border-kisan-green text-center"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              min="0"
              max="10000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-16 border-b border-gray-200 dark:border-zinc-800 bg-transparent text-sm dark:text-white focus:outline-none focus:border-kisan-green text-center"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['all', 'grains', 'fruits', 'vegetables', 'organic'].map((cat) => (
            <button 
              key={cat} 
              onClick={() => setCategoryFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold capitalize border transition-all whitespace-nowrap ${categoryFilter === cat ? 'bg-kisan-green text-white border-kisan-green shadow-sm' : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 border-gray-100 dark:border-zinc-800 hover:border-gray-200 dark:hover:border-zinc-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-kisan-green" />
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {paginatedProducts.map((product) => {
              const isOwner = user && product.farmer.toString() === user._id?.toString();
              const inWishlist = wishlist.includes(product._id);
              
              return (
                <motion.div 
                  key={product._id} 
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-zinc-900 glassmorphism rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-zinc-800 overflow-hidden flex flex-col justify-between group"
                >
                  <div className="relative h-48 bg-gray-50 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                    <img src={product.image} alt={product.name} loading="lazy" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    
                    <span className="absolute top-3 left-3 bg-kisan-green/10 backdrop-blur-md text-kisan-green text-xs font-bold px-3 py-1 rounded-full capitalize">
                      {product.category}
                    </span>

                    {/* Stock badge */}
                    {product.stock !== undefined && (
                      <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md ${product.stock > 0 ? 'bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-red-500/20 text-red-700 dark:text-red-300'}`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    )}
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product._id)}
                      className="absolute bottom-3 right-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-2 rounded-full hover:bg-white dark:hover:bg-zinc-900 transition-colors shadow-sm"
                    >
                      {inWishlist ? <Heart size={18} className="text-red-500" fill="currentColor" /> : <HeartOff size={18} className="text-gray-400 dark:text-zinc-400" />}
                    </button>

                    {isOwner && (
                      <button 
                        onClick={() => handleDeleteProduct(product._id)}
                        className="absolute top-12 right-3 bg-red-50/90 dark:bg-red-900/50 hover:bg-red-100 text-red-600 dark:text-red-400 p-2 rounded-full transition-all backdrop-blur-md"
                        title="Delete Listing"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1 leading-tight truncate">{product.name}</h3>
                      <p className="text-xs text-gray-400 dark:text-zinc-500 font-semibold mb-2">Sold by: <span className="text-kisan-green font-bold cursor-pointer hover:underline">{product.farmerName}</span></p>
                      <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">{product.description}</p>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-4 text-amber-500">
                        <Star size={16} fill="currentColor" />
                        <span className="text-sm font-bold text-gray-800 dark:text-zinc-200">{product.ratings || 0}</span>
                        <span className="text-xs text-gray-400 dark:text-zinc-500 font-medium">({product.reviewsCount || 0} reviews)</span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-zinc-800">
                        <div>
                          <span className="text-xs text-gray-400 dark:text-zinc-500 uppercase font-bold block">Price</span>
                          <strong className="text-2xl font-extrabold text-gray-900 dark:text-white">₹{product.price} <span className="text-sm text-gray-400 dark:text-zinc-500 font-normal">/ {product.unit}</span></strong>
                        </div>
                        
                        <button 
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          className={`p-3 rounded-xl shadow-md transition-all ${product.stock === 0 ? 'bg-gray-300 dark:bg-zinc-700 cursor-not-allowed' : 'bg-kisan-green hover:bg-kisan-green-dark text-white'}`}
                        >
                          <ShoppingCart size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm font-medium bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors ${currentPage === page ? 'bg-kisan-green text-white' : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 hover:border-kisan-green'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm font-medium bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Sell Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="bg-kisan-green text-white p-6 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2"><Leaf size={20} /> List Crop to Marketplace</h3>
                <button onClick={() => setShowAddModal(false)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Crop/Product Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-xl px-4 py-2.5 text-sm" placeholder="e.g. Organic Basmati Rice" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Description</label>
                  <textarea name="description" required value={formData.description} onChange={handleInputChange} className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-xl px-4 py-2.5 text-sm h-20" placeholder="Describe harvest quality, composting methods, etc." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Crop Image</label>
                  {formData.image ? (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-700 shadow-inner">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-gray-200 dark:border-zinc-700 hover:border-kisan-green rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 bg-gray-50/50 dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700">
                      <Camera size={20} className="text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">Click to upload crop photo</span>
                      <span className="text-[10px] text-gray-400 dark:text-zinc-500">Max size 2MB (JPEG, PNG)</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              toast.error('Image size must be less than 2MB');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({ ...formData, image: reader.result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Price (₹)</label>
                    <input type="number" name="price" required value={formData.price} onChange={handleInputChange} className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-xl px-4 py-2.5 text-sm" placeholder="Price per unit" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Quantity</label>
                    <input type="number" name="quantity" required value={formData.quantity} onChange={handleInputChange} className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-xl px-4 py-2.5 text-sm" placeholder="Available Qty" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Unit</label>
                    <select name="unit" value={formData.unit} onChange={handleInputChange} className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-xl px-4 py-2.5 text-sm">
                      <option value="kg">kg</option>
                      <option value="quintal">quintal</option>
                      <option value="ton">ton</option>
                      <option value="piece">piece</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border border-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white rounded-xl px-4 py-2.5 text-sm">
                      <option value="grains">Grains</option>
                      <option value="fruits">Fruits</option>
                      <option value="vegetables">Vegetables</option>
                      <option value="organic">Organic</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="border border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 text-gray-700 dark:text-zinc-300 font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                    Cancel
                  </button>
                  <button type="submit" className="bg-kisan-green hover:bg-kisan-green-dark text-white font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md text-sm">
                    Submit Listing
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Overlay */}
      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="bg-white dark:bg-zinc-900 w-full max-w-md h-screen flex flex-col justify-between shadow-2xl p-6 relative z-55"
            >
              <div>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50 dark:border-zinc-800">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2"><ShoppingCart size={22} /> Shopping Cart</h3>
                  <button onClick={() => setShowCart(false)} className="hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 p-2 rounded-lg transition-colors">
                    <X size={20} />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh]">
                    <div className="bg-gray-50 dark:bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center text-gray-300 dark:text-zinc-600 mb-4">
                      <ShoppingCart size={28} />
                    </div>
                    <p className="text-gray-700 dark:text-zinc-300 font-medium">Your cart is empty</p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 max-w-xs mt-1">Browse marketplace products and tap checkout to place direct order.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {cart.map((item) => (
                      <div key={item._id} className="flex gap-4 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl items-center justify-between border border-gray-100/50 dark:border-zinc-800">
                        <div className="flex gap-3 items-center">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{item.name}</h4>
                            <span className="text-xs text-gray-400 dark:text-zinc-500">Qty: {item.qty} {item.unit}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <strong className="text-sm font-bold text-gray-900 dark:text-white">₹{item.price * item.qty}</strong>
                          <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-6 border-t border-gray-100 dark:border-zinc-800">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 dark:text-zinc-400 font-medium">Grand Total</span>
                    <strong className="text-3xl font-extrabold text-gray-900 dark:text-white">₹{cartTotal}</strong>
                  </div>
                  
                  <button 
                    onClick={() => {
                      toast.success('Order placed successfully! Farmer has been notified.');
                      setCart([]);
                      setShowCart(false);
                    }}
                    className="w-full bg-kisan-green hover:bg-kisan-green-dark text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={20} /> Place Secure Order
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Marketplace;
