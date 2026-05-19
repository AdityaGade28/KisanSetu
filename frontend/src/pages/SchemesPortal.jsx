import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Filter, ShieldCheck, ChevronRight, FileCheck, Landmark, X } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const SchemesPortal = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [bookmarks, setBookmarks] = useState(
    JSON.parse(localStorage.getItem('bookmarks')) || []
  );

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await api.get('/schemes');
        setSchemes(res.data);
      } catch (error) {
        toast.error('Failed to load schemes portal');
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  const toggleBookmark = (id) => {
    let updated;
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter(b => b !== id);
      toast.success('Scheme removed from bookmarks');
    } else {
      updated = [...bookmarks, id];
      toast.success('Scheme bookmarked!');
    }
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  const filteredSchemes = schemes.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.ministry.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kisan-green" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="text-kisan-green" /> Government Schemes Portal
        </h1>
        <p className="text-gray-500 mt-2">Explore fully subsidized central and state agricultural welfare plans designed to support and protect farmers.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search schemes by keywords, ministry, or crop..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-kisan-green focus:border-kisan-green sm:text-sm bg-white shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSchemes.map((scheme, idx) => {
          const isBookmarked = bookmarks.includes(scheme.id);
          return (
            <motion.div 
              key={scheme.id}
              whileHover={{ y: -4 }}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <Landmark className="text-kisan-green" size={24} />
                  <button 
                    onClick={() => toggleBookmark(scheme.id)}
                    className={`text-xs px-3 py-1 rounded-full font-bold transition-all border ${isBookmarked ? 'bg-kisan-green text-white border-kisan-green' : 'bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-200 hover:text-gray-600'}`}
                  >
                    {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </button>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">{scheme.title}</h3>
                <span className="text-xs text-gray-400 font-semibold uppercase">{scheme.ministry}</span>
                
                <p className="text-sm text-gray-600 mt-4 leading-relaxed line-clamp-3">{scheme.description}</p>

                <div className="bg-kisan-green/5 border border-kisan-green/10 rounded-xl p-4 mt-6">
                  <span className="text-xs text-kisan-green font-bold uppercase block mb-1">Key Benefit:</span>
                  <span className="text-sm text-kisan-green-dark font-medium">{scheme.benefit}</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedScheme(scheme)}
                className="w-full mt-6 bg-gray-50 hover:bg-kisan-green hover:text-white text-gray-700 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-1"
              >
                View Details & Apply <ChevronRight size={18} />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Scheme Detail Modal */}
      <AnimatePresence>
        {selectedScheme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            >
              <div className="bg-kisan-green text-white p-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Landmark size={24} />
                  <div>
                    <h3 className="font-bold text-lg">{selectedScheme.title}</h3>
                    <p className="text-xs text-kisan-green-light font-semibold uppercase tracking-wider">{selectedScheme.ministry}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedScheme(null)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">Description</h4>
                  <p className="text-gray-700 leading-relaxed text-sm">{selectedScheme.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-kisan-green/5 border border-kisan-green/10 rounded-xl p-5">
                    <h4 className="text-sm font-bold text-kisan-green uppercase mb-2 flex items-center gap-1.5"><ShieldCheck size={16} /> Eligibility Criteria</h4>
                    <p className="text-sm text-kisan-green-dark leading-relaxed font-medium">{selectedScheme.eligibility}</p>
                  </div>
                  <div className="bg-orange-50/50 border border-orange-100/50 rounded-xl p-5">
                    <h4 className="text-sm font-bold text-orange-800 uppercase mb-2 flex items-center gap-1.5"><FileCheck size={16} /> Required Documents</h4>
                    <ul className="space-y-1.5">
                      {selectedScheme.documents.map((doc, i) => (
                        <li key={i} className="text-xs text-orange-950 flex items-center gap-2 font-medium">
                          <span className="w-1.5 h-1.5 bg-orange-600 rounded-full flex-shrink-0" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-700 uppercase mb-3">Application Guidance & Steps</h4>
                  <ol className="space-y-3 text-sm text-gray-600">
                    <li className="flex gap-2">
                      <strong className="text-kisan-green">1.</strong>
                      <span>Prepare active copies of the <strong className="text-gray-800">Required Documents</strong>.</span>
                    </li>
                    <li className="flex gap-2">
                      <strong className="text-kisan-green">2.</strong>
                      <span>Visit the nearest Common Service Centre (CSC) or apply on the official government website.</span>
                    </li>
                    <li className="flex gap-2">
                      <strong className="text-kisan-green">3.</strong>
                      <span>Fill in the land mapping verification form and secure the certificate.</span>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => setSelectedScheme(null)} className="border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    try {
                      await api.post(`/schemes/${selectedScheme._id || selectedScheme.id}/apply`);
                      toast.success('Application registered locally. Redirecting to official portal...');
                    } catch (error) {
                      toast.success('Redirecting to secure external government application portal...');
                    }
                    window.open(selectedScheme.link || `https://www.google.com/search?q=${encodeURIComponent(selectedScheme.title + ' official website')}`, '_blank');
                    setSelectedScheme(null);
                  }}
                  className="bg-kisan-green hover:bg-kisan-green-dark text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-md text-sm"
                >
                  Proceed to Official Website
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchemesPortal;
