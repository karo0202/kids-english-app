import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Confetti from 'react-confetti';

export default function AnimatedHome() {
  const { t } = useTranslation();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const floatingEmojis = ['🌟', '🎈', '🎨', '🎵', '🎮', '🏆', '🌈', '⭐'];

  const handleButtonClick = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingEmojis.map((emoji, index) => (
          <motion.div
            key={index}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Animated Title */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.6 }}
          className="text-center mb-8"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ backgroundSize: '200% 200%' }}
          >
            {t('welcome')}
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-blue-700 font-semibold"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {t('learnTogether')}
          </motion.p>
        </motion.div>

        {/* Animated Characters */}
        <motion.div 
          className="flex space-x-8 mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className="w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center text-6xl shadow-2xl border-4 border-white"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              🐻
            </motion.div>
            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <span className="text-sm font-bold text-pink-600">Benny</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className="w-32 h-32 bg-gradient-to-br from-green-300 to-teal-400 rounded-full flex items-center justify-center text-6xl shadow-2xl border-4 border-white"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, -5, 5, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 0.5
              }}
            >
              🦊
            </motion.div>
            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <span className="text-sm font-bold text-green-600">Fiona</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Interactive Adventure Card */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full border-4 border-gradient-to-r from-purple-200 to-pink-200"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.h2 
            className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ backgroundSize: '200% 200%' }}
          >
            🚀 {t('startAdventure')}
          </motion.h2>
          
          <motion.p 
            className="text-lg mb-6 text-center text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {t('chooseLesson')}
          </motion.p>

          {/* Animated Lesson Buttons */}
          <div className="space-y-4">
            {[
              { icon: '🐾', text: t('animals'), color: 'from-pink-400 to-pink-600', delay: 1.2 },
              { icon: '🎨', text: t('colors'), color: 'from-blue-400 to-blue-600', delay: 1.4 },
              { icon: '🍎', text: t('food'), color: 'from-green-400 to-green-600', delay: 1.6 }
            ].map((lesson, index) => (
              <motion.button
                key={index}
                className={`w-full py-4 px-6 rounded-2xl text-white font-bold text-lg shadow-lg transform transition-all duration-200 bg-gradient-to-r ${lesson.color} hover:shadow-xl hover:scale-105 active:scale-95 border-2 border-white/20`}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: lesson.delay, duration: 0.6, type: "spring" }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleButtonClick}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  {lesson.icon}
                </motion.span>
                {' '}{lesson.text}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Fun Footer */}
        <motion.footer 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <motion.div 
            className="text-sm text-gray-500"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            © 2024 Kids' English Learning App 🌟
          </motion.div>
        </motion.footer>
      </div>
    </div>
  );
} 