import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Mic, Languages } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hello! I am your KisanSetu AI farming helper. Ask me about crops, pests, soil, or government schemes!', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en'); // en or hi
  const [isTyping, setIsTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef(null);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!user) return null; // Show chatbot only to logged-in users

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await api.post('/ai/chatbot', { message: text, language });
      setMessages(prev => [...prev, { text: response.data.reply, sender: 'bot' }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting right now. Please try again later.", sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleSuggestedPrompt = (prompt) => {
    handleSend(prompt);
  };

  const toggleVoiceInput = () => {
    setListening(true);
    setTimeout(() => {
      setListening(false);
      setInput(language === 'hi' ? 'पीएम-किसान योजना के बारे में बताएं' : 'Tell me about PM-Kisan scheme');
    }, 2000); // Simulate speech-to-text conversion after 2s
  };

  const suggestions = language === 'hi' 
    ? ["पीएम-किसान योजना", "टमाटर के कीटनाशक", "मिट्टी की जांच"]
    : ["PM-Kisan scheme", "Pest control for tomato", "Fertilizer suggestions"];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="glassmorphism w-80 md:w-96 h-[500px] flex flex-col overflow-hidden shadow-2xl border border-kisan-green/20"
          >
            {/* Header */}
            <div className="bg-kisan-green text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">KisanSetu AI Assistant</h3>
                  <p className="text-xs text-kisan-green-light font-medium">Online & ready to help</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Language switcher */}
                <button 
                  onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
                  className="hover:bg-white/10 p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                  title="Switch Language"
                >
                  <Languages size={16} />
                  <span>{language === 'en' ? 'HI' : 'EN'}</span>
                </button>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Conversation Window */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50/50">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${m.sender === 'user' ? 'bg-kisan-green text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts */}
            <div className="p-3 bg-white border-t border-gray-50 flex gap-2 overflow-x-auto whitespace-nowrap">
              {suggestions.map((s, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleSuggestedPrompt(s)}
                  className="bg-gray-50 border border-gray-100 text-gray-600 hover:bg-kisan-green/5 hover:text-kisan-green hover:border-kisan-green/30 text-xs px-3 py-1.5 rounded-full transition-all font-medium"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
              <input 
                type="text" 
                value={listening ? "Listening..." : input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={listening}
                placeholder={language === 'hi' ? 'सवाल पूछें...' : 'Ask your farming query...'}
                className="flex-grow border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-kisan-green focus:border-kisan-green transition-all bg-gray-50/50"
              />
              <button 
                onClick={toggleVoiceInput}
                className={`p-2.5 rounded-xl border border-gray-100 flex items-center justify-center transition-all ${listening ? 'bg-red-500 border-red-500 text-white animate-pulse' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                title="Voice Input"
              >
                <Mic size={18} />
              </button>
              <button 
                onClick={() => handleSend()}
                className="bg-kisan-green hover:bg-kisan-green-dark text-white p-2.5 rounded-xl transition-all shadow-md"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-kisan-green text-white p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:bg-kisan-green-dark transition-all border border-white/10"
      >
        <MessageSquare size={24} />
      </motion.button>
    </div>
  );
};

export default Chatbot;
