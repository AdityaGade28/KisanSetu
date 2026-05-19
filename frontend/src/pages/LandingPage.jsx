import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, CloudRain, ShieldCheck, CheckCircle2, TrendingUp, Users, Smartphone, ShoppingBag, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { translations } from '../utils/translations';

const LandingPage = () => {
  const language = useAuthStore(state => state.language);
  const t = translations[language] || translations.en;

  return (
    <div className="overflow-hidden bg-gray-50 min-h-screen">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-kisan-green/5 rounded-full filter blur-[120px] -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full filter blur-[100px] -z-10" />

      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-20 max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7"
        >
          <span className="bg-kisan-green/10 text-kisan-green px-4.5 py-2 rounded-full text-xs font-bold mb-6 inline-flex items-center gap-1.5 shadow-sm border border-kisan-green/10">
            <CheckCircle2 size={14} /> {t.heroBadge}
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-extrabold text-gray-900 mb-6 tracking-tight leading-[1.1] font-sans">
            {t.heroTitle1} <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-kisan-green to-kisan-green-dark">{t.heroTitle2}</span>
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mb-10 leading-relaxed">
            {t.heroSub}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="bg-kisan-green text-white px-8 py-4.5 rounded-full font-bold hover:bg-kisan-green-dark transition-all flex items-center justify-center gap-2 text-base shadow-lg shadow-kisan-green/20 hover:scale-[1.02] transform active:scale-95 duration-200">
              {t.getStarted} <ArrowRight size={18} />
            </Link>
            <Link to="/dashboard" className="bg-white text-gray-900 px-8 py-4.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all border border-gray-100 flex items-center justify-center text-base hover:scale-[1.02] transform active:scale-95 duration-200">
              {t.exploreDemo}
            </Link>
          </div>
        </motion.div>

        {/* Hero Illustrative Mockup Grid */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative bg-white/40 backdrop-blur-md border border-gray-100 rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center gap-4 bg-white p-4.5 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-all">
              <div className="bg-kisan-green/10 w-12 h-12 rounded-xl flex items-center justify-center text-kisan-green flex-shrink-0">
                <Cpu size={22} />
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-sm text-gray-900">{t.aiCropAssistant}</h4>
                <div className="h-2 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full w-[85%] bg-kisan-green rounded-full" />
                </div>
              </div>
              <span className="text-xs font-extrabold text-kisan-green bg-kisan-green/10 px-2 py-1 rounded-lg">85%</span>
            </div>

            <div className="flex items-center gap-4 bg-white p-4.5 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-all">
              <div className="bg-amber-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0">
                <CloudRain size={22} />
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-sm text-gray-900">{t.realTimeWeather}</h4>
                <div className="flex gap-1 mt-1 text-[10px] text-gray-400 font-semibold uppercase">
                  <span>Nashik</span> • <span>Sowing Active</span>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-500/10 px-2 py-1 rounded-lg">31°C</span>
            </div>

            <div className="flex items-center gap-4 bg-white p-4.5 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md transition-all">
              <div className="bg-emerald-500/10 w-12 h-12 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-sm text-gray-900">{t.diseaseDetection}</h4>
                <div className="h-2 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full w-[98%] bg-emerald-500 rounded-full animate-pulse" />
                </div>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-lg">98.4%</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Ticker Section */}
      <section className="bg-white border-y border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          <div className="pt-6 sm:pt-0">
            <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{t.farmersServed}</h3>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{t.farmersServedSub}</p>
          </div>
          <div className="pt-6 sm:pt-0">
            <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{t.tradeVolume}</h3>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{t.tradeVolumeSub}</p>
          </div>
          <div className="pt-6 sm:pt-0">
            <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{t.modelAccuracy}</h3>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{t.modelAccuracySub}</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{t.premiumSaaS}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">{t.platformSub}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Cpu, title: t.aiCropAssistant, desc: t.aiCropDesc, color: 'bg-kisan-green/10 text-kisan-green' },
              { icon: CloudRain, title: t.realTimeWeather, desc: t.realTimeWeatherDesc, color: 'bg-amber-500/10 text-amber-600' },
              { icon: ShieldCheck, title: t.diseaseDetection, desc: t.diseaseDetectionDesc, color: 'bg-emerald-500/10 text-emerald-600' }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -6 }}
                className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200/50 transition-all flex flex-col items-start text-left"
              >
                <div className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon size={26} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">How KisanSetu Works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">A seamless 3-step process to revolutionize your farming operations and connect with verified buyers nationwide.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-gray-100 via-kisan-green/30 to-gray-100 -z-10" />
            
            {[
              { step: 1, icon: Smartphone, title: 'Register Profile', desc: 'Sign up in seconds, verify your mobile number, and enter your farm details securely.' },
              { step: 2, icon: Cpu, title: 'Analyze & Predict', desc: 'Use AI models to analyze soil, detect leaf diseases, and check hyper-local weather.' },
              { step: 3, icon: ShoppingBag, title: 'Sell Directly', desc: 'List your harvest on the marketplace and connect with buyers at the best prices.' }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-24 h-24 bg-white border-4 border-gray-50 rounded-full flex items-center justify-center shadow-lg relative mb-6 text-kisan-green">
                  <item.icon size={36} />
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 text-white font-bold rounded-full flex items-center justify-center text-sm shadow-md">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact / Why Choose Us Section */}
      <section className="py-24 bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-kisan-green rounded-full filter blur-[150px] opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500 rounded-full filter blur-[150px] opacity-10" />
        
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <span className="bg-white/10 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase text-kisan-green-light mb-6 inline-block">Real Impact</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">Empowering farmers with Next-Gen Intelligence</h2>
            <p className="text-gray-400 leading-relaxed mb-8 text-lg">
              KisanSetu bridges the gap between traditional farming and modern technology. We provide end-to-end solutions that protect crops, predict yields, and guarantee fair market prices.
            </p>
            <ul className="space-y-4">
              {[
                'Zero intermediary commission fees on marketplace.',
                'Offline-ready AI disease detection models.',
                'Direct links to Central Government Welfare Schemes.'
              ].map((point, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="bg-kisan-green/20 p-1 rounded-full text-kisan-green-light">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-gray-300">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 p-6 rounded-2xl text-center border border-white/5 hover:bg-white/10 transition-colors">
                <h4 className="text-3xl font-bold text-white mb-2">45%</h4>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Yield Increase</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl text-center border border-white/5 hover:bg-white/10 transition-colors">
                <h4 className="text-3xl font-bold text-white mb-2">20+</h4>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">AI Models</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl text-center border border-white/5 hover:bg-white/10 transition-colors">
                <h4 className="text-3xl font-bold text-white mb-2">0%</h4>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Hidden Fees</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl text-center border border-white/5 hover:bg-white/10 transition-colors">
                <h4 className="text-3xl font-bold text-white mb-2">24/7</h4>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">AI Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Footer */}
      <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-kisan-green text-white p-2 rounded-xl">
                  <Globe size={24} />
                </div>
                <span className="text-2xl font-black tracking-tight text-gray-900">KisanSetu</span>
              </div>
              <p className="text-gray-500 leading-relaxed mb-6 text-sm max-w-sm">
                Revolutionizing Indian agriculture through artificial intelligence, direct market access, and comprehensive government scheme integrations.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-full text-gray-400 hover:text-kisan-green hover:bg-kisan-green/10 transition-all"><Globe size={18} /></a>
                <a href="#" className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-full text-gray-400 hover:text-kisan-green hover:bg-kisan-green/10 transition-all"><Mail size={18} /></a>
                <a href="#" className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-full text-gray-400 hover:text-kisan-green hover:bg-kisan-green/10 transition-all"><Phone size={18} /></a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-wider">Features</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link to="/dashboard" className="hover:text-kisan-green transition-colors">AI Crop Analysis</Link></li>
                <li><Link to="/dashboard/weather" className="hover:text-kisan-green transition-colors">Weather Radar</Link></li>
                <li><Link to="/dashboard/marketplace" className="hover:text-kisan-green transition-colors">Marketplace</Link></li>
                <li><Link to="/dashboard/schemes" className="hover:text-kisan-green transition-colors">Government Schemes</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-wider">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-kisan-green transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-kisan-green transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-kisan-green transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-kisan-green transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase text-sm tracking-wider">Contact</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="flex gap-3"><MapPin size={18} className="text-kisan-green flex-shrink-0" /> Krishi Bhavan, New Delhi, India 110001</li>
                <li className="flex gap-3"><Phone size={18} className="text-kisan-green flex-shrink-0" /> 1800-180-1551</li>
                <li className="flex gap-3"><Mail size={18} className="text-kisan-green flex-shrink-0" /> support@kisansetu.gov.in</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">© 2026 KisanSetu Agritech. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-gray-900">Privacy</a>
              <a href="#" className="hover:text-gray-900">Terms</a>
              <a href="#" className="hover:text-gray-900">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
