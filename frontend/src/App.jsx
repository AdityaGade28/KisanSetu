import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard, { Sidebar } from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CropRecommendation from './pages/CropRecommendation';
import DiseaseDetection from './pages/DiseaseDetection';
import WeatherDashboard from './pages/WeatherDashboard';
import SchemesPortal from './pages/SchemesPortal';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Chatbot from './components/Chatbot';
import useAuthStore from './store/authStore';

const ProtectedRoute = ({ children }) => {
  const user = useAuthStore(state => state.user);
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const user = useAuthStore(state => state.user);
  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

const FarmerRoute = ({ children }) => {
  const user = useAuthStore(state => state.user);
  return user && user.role === 'farmer' ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-kisan-beige dark:bg-zinc-950 text-gray-900 dark:text-zinc-50 flex flex-col transition-colors duration-300">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/crop-ai" element={<ProtectedRoute><FarmerRoute><div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex transition-colors duration-300"><Sidebar /><div className="flex-1 ml-64"><CropRecommendation /></div></div></FarmerRoute></ProtectedRoute>} />
            <Route path="/dashboard/disease-ai" element={<ProtectedRoute><FarmerRoute><div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex transition-colors duration-300"><Sidebar /><div className="flex-1 ml-64"><DiseaseDetection /></div></div></FarmerRoute></ProtectedRoute>} />
            <Route path="/dashboard/weather" element={<ProtectedRoute><FarmerRoute><div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex transition-colors duration-300"><Sidebar /><div className="flex-1 ml-64"><WeatherDashboard /></div></div></FarmerRoute></ProtectedRoute>} />
            <Route path="/dashboard/schemes" element={<ProtectedRoute><FarmerRoute><div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex transition-colors duration-300"><Sidebar /><div className="flex-1 ml-64"><SchemesPortal /></div></div></FarmerRoute></ProtectedRoute>} />
            <Route path="/dashboard/marketplace" element={<ProtectedRoute><FarmerRoute><div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex transition-colors duration-300"><Sidebar /><div className="flex-1 ml-64"><Marketplace /></div></div></FarmerRoute></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedRoute><div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex transition-colors duration-300"><Sidebar /><div className="flex-1 ml-64"><Profile /></div></div></ProtectedRoute>} />
            <Route path="/dashboard/admin" element={<ProtectedRoute><AdminRoute><div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex transition-colors duration-300"><Sidebar /><div className="flex-1 ml-64"><AdminPanel /></div></div></AdminRoute></ProtectedRoute>} />
          </Routes>
        </main>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
