import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './App.css';

// Import enhanced components
import AnimatedHome from './components/AnimatedHome';
import EnhancedAnimalGame from './components/EnhancedAnimalGame';
import EnhancedAudioPlayer from './components/EnhancedAudioPlayer';
import EnhancedRewardSystem from './components/EnhancedRewardSystem';
import LanguageSwitcher from './components/LanguageSwitcher';
import AlphabetWriting from './components/AlphabetWriting';
import WordWriting from './components/WordWriting';
import WritingBook from './components/WritingBook';

// Import i18n configuration
import './i18n';

function Navigation() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: t('home'), icon: '🏠' },
    { path: '/animals', label: t('animals'), icon: '🐾' },
    { path: '/alphabet', label: '🅰️ Alphabet', icon: '🅰️' },
    { path: '/words', label: '📝 Words', icon: '📝' },
    { path: '/writing-book', label: '📘 Book', icon: '📘' },
    { path: '/audio', label: t('audio'), icon: '🎵' },
    { path: '/rewards', label: t('rewards'), icon: '🏆' },
  ];

  return (
    <motion.nav 
      className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-2xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div 
              className="text-3xl"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🌟
            </motion.div>
            <motion.h1 
              className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            >
              {t('appTitle')}
            </motion.h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      location.pathname === item.path
                        ? 'bg-white/20 backdrop-blur-sm shadow-lg'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <motion.span
                      className="inline-block mr-2"
                      animate={location.pathname === item.path ? { 
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {item.icon}
                    </motion.span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Language Switcher */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-200 focus:outline-none focus:text-gray-200"
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isMenuOpen ? { rotate: 90 } : { rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                ☰
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white/10 backdrop-blur-sm rounded-2xl mt-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-3 py-2 rounded-xl text-base font-medium transition-all duration-300 ${
                        location.pathname === item.path
                          ? 'bg-white/20 text-white'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="inline-block mr-2">{item.icon}</span>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-2">
                  <LanguageSwitcher />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

function AppContent() {
  const location = useLocation();
  const [writingEntries, setWritingEntries] = useState<Array<{
    id: string;
    type: 'letter' | 'word';
    content: string;
    timestamp: Date;
    drawing?: string;
    score: number;
    category?: string;
  }>>([]);

  const addWritingEntry = (entry: {
    id: string;
    type: 'letter' | 'word';
    content: string;
    timestamp: Date;
    drawing?: string;
    score: number;
    category?: string;
  }) => {
    setWritingEntries(prev => [...prev, entry]);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <Routes>
          <Route path="/" element={<AnimatedHome />} />
          <Route path="/animals" element={<EnhancedAnimalGame />} />
          <Route path="/alphabet" element={<AlphabetWriting />} />
          <Route path="/words" element={<WordWriting />} />
          <Route path="/writing-book" element={
            <WritingBook 
              entries={writingEntries}
              onAddEntry={addWritingEntry}
            />
          } />
          <Route path="/audio" element={
            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
              <div className="max-w-4xl mx-auto">
                <motion.h1 
                  className="text-4xl font-bold text-center mb-8 text-blue-700"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  🎵 Audio Learning
                </motion.h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <EnhancedAudioPlayer 
                    text="Hello! I am a cat. Meow meow!"
                    language="en"
                  />
                  <EnhancedAudioPlayer 
                    text="¡Hola! Soy un perro. ¡Guau guau!"
                    language="es"
                  />
                  <EnhancedAudioPlayer 
                    text="مرحبا! أنا طائر. تغريد تغريد!"
                    language="ar"
                  />
                  <EnhancedAudioPlayer 
                    text="سڵاو! من مەڕم. بە بە!"
                    language="ku"
                  />
                </div>
              </div>
            </div>
          } />
          <Route path="/rewards" element={<EnhancedRewardSystem />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <AppContent />
        
        {/* Floating Action Button */}
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.button
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            onClick={() => {
              // Add fun interaction here
              const utterance = new SpeechSynthesisUtterance("Great job learning!");
              utterance.rate = 0.8;
              utterance.pitch = 1.2;
              speechSynthesis.speak(utterance);
            }}
          >
            🎉
          </motion.button>
        </motion.div>

        {/* Background Animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </Router>
  );
}

export default App;
