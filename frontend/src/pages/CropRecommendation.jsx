import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplets, Thermometer, FlaskConical, Wind, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import { translations } from '../utils/translations';
import { toast } from 'react-hot-toast';

const CropRecommendation = () => {
  const language = useAuthStore(state => state.language);
  const t = translations[language] || translations.en;

  const [formData, setFormData] = useState({
    nitrogen: '', phosphorus: '', potassium: '', temperature: '', humidity: '', ph: '', rainfall: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/ai/recommend-crop', formData);
      setResult(res.data);
      toast.success('Recommendation generated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to get recommendation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Leaf className="text-kisan-green" /> {t.cropAiTitle}
        </h1>
        <p className="text-gray-500 mt-2">{t.cropAiSub}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: t.nitrogen, name: 'nitrogen', icon: FlaskConical, placeholder: 'e.g. 90' },
                { label: t.phosphorus, name: 'phosphorus', icon: FlaskConical, placeholder: 'e.g. 42' },
                { label: t.potassium, name: 'potassium', icon: FlaskConical, placeholder: 'e.g. 43' },
                { label: 'Temperature (°C) / तापमान', name: 'temperature', icon: Thermometer, placeholder: 'e.g. 21' },
                { label: 'Humidity (%) / आर्द्रता', name: 'humidity', icon: Wind, placeholder: 'e.g. 82' },
                { label: t.ph, name: 'ph', icon: FlaskConical, placeholder: 'e.g. 6.5' },
                { label: t.rainfall, name: 'rainfall', icon: Droplets, placeholder: 'e.g. 200' },
              ].map((field, idx) => (
                <div key={idx} className={field.name === 'rainfall' ? 'col-span-2' : 'col-span-1'}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <field.icon size={16} className="text-gray-400" />
                    </div>
                    <input 
                      type="number" step="any" required name={field.name} value={formData[field.name]} onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-kisan-green focus:border-kisan-green sm:text-sm transition-all bg-gray-50/50"
                      placeholder={field.placeholder}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 bg-kisan-green text-white py-4 px-4 rounded-xl hover:bg-kisan-green-dark focus:ring-4 focus:ring-kisan-green/30 font-bold transition-all text-lg shadow-md hover:shadow-lg mt-4">
              {loading ? <span className="animate-pulse">{t.calculating}</span> : <>{t.getRecommendation} <ArrowRight size={20} /></>}
            </button>
          </form>
        </motion.div>

        {/* Result Section */}
        {result && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-kisan-green text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Leaf size={200} /></div>
            <div className="relative z-10">
              <h2 className="text-xl font-medium text-kisan-green-light mb-2">{t.recommendationResult}</h2>
              <h3 className="text-5xl font-bold mb-6">{result.crop}</h3>
              
              <div className="bg-black/10 rounded-xl p-6 mb-6 backdrop-blur-sm border border-white/10">
                <p className="text-lg leading-relaxed">{result.details}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                  <p className="text-sm text-kisan-green-light mb-1">{t.purityScore}</p>
                  <p className="text-2xl font-bold">{result.confidence}%</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                  <p className="text-sm text-kisan-green-light mb-1">{t.expectedYield}</p>
                  <p className="text-xl font-bold">{result.expectedYield}</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-kisan-green-light mb-3">Recommended Fertilizers / अनुशंसित उर्वरक:</h4>
                <div className="flex gap-2">
                  {result.fertilizers.map((f, i) => (
                    <span key={i} className="bg-white text-kisan-green px-4 py-1 rounded-full text-sm font-bold shadow-sm">{f}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendation;
