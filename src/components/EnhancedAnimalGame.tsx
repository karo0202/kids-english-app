import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Confetti from 'react-confetti';

interface Animal {
  id: string;
  emoji: string;
  name: string;
  translation: { ar: string; es: string; ku: string };
  sound: string;
}

const animals: Animal[] = [
  { id: 'cat', emoji: '🐱', name: 'Cat', translation: { ar: 'قطة', es: 'Gato', ku: 'پشیلك' }, sound: 'meow' },
  { id: 'dog', emoji: '🐶', name: 'Dog', translation: { ar: 'كلب', es: 'Perro', ku: 'سەگە' }, sound: 'woof' },
  { id: 'bird', emoji: '🐦', name: 'Bird', translation: { ar: 'طائر', es: 'Pájaro', ku: 'باڵندە' }, sound: 'tweet' },
  { id: 'fish', emoji: '🐟', name: 'Fish', translation: { ar: 'سمكة', es: 'Pez', ku: 'ماسی' }, sound: 'blub' },
  { id: 'cow', emoji: '🐮', name: 'Cow', translation: { ar: 'بقرة', es: 'Vaca', ku: 'مانگا' }, sound: 'moo' },
  { id: 'sheep', emoji: '🐑', name: 'Sheep', translation: { ar: 'خروف', es: 'Oveja', ku: 'مەڕ' }, sound: 'baa' },
];

export default function EnhancedAnimalGame() {
  const { t } = useTranslation();
  const [draggedAnimal, setDraggedAnimal] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, color: string}>>([]);

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

  const createParticles = (x: number, y: number) => {
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: x + Math.random() * 100 - 50,
      y: y + Math.random() * 100 - 50,
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 5)]
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 2000);
  };

  const playAnimalSound = (sound: string) => {
    // Simulate animal sounds with text-to-speech or audio files
    const utterance = new SpeechSynthesisUtterance(sound);
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    speechSynthesis.speak(utterance);
  };

  const handleDragStart = (e: React.DragEvent, animalId: string) => {
    setDraggedAnimal(animalId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add visual feedback
    const animal = animals.find(a => a.id === animalId);
    if (animal) {
      playAnimalSound(animal.sound);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetName: string) => {
    e.preventDefault();
    if (draggedAnimal) {
      const animal = animals.find(a => a.id === draggedAnimal);
      if (animal && animal.name === targetName) {
        // Correct match!
        setMatches(prev => ({ ...prev, [draggedAnimal]: targetName }));
        setScore(prev => prev + 10);
        
        // Create celebration effects
        createParticles(e.clientX, e.clientY);
        playAnimalSound(animal.sound);
        
        // Check if game is completed
        const newMatches = { ...matches, [draggedAnimal]: targetName };
        if (Object.keys(newMatches).length === animals.length) {
          setGameCompleted(true);
          setShowCelebration(true);
          setShowConfetti(true);
          setTimeout(() => {
            setShowCelebration(false);
            setShowConfetti(false);
          }, 5000);
        }
      } else {
        // Wrong match - shake effect
        const targetElement = e.currentTarget as HTMLElement;
        targetElement.style.animation = 'shake 0.5s';
        setTimeout(() => {
          targetElement.style.animation = '';
        }, 500);
      }
      setDraggedAnimal(null);
    }
  };

  const resetGame = () => {
    setMatches({});
    setScore(0);
    setGameCompleted(false);
    setShowCelebration(false);
    setShowConfetti(false);
    setParticles([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
          colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']}
        />
      )}

      {/* Particle Effects */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-3 h-3 rounded-full pointer-events-none"
            style={{
              left: particle.x,
              top: particle.y,
              backgroundColor: particle.color,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
              y: [0, -50],
              x: [0, Math.random() * 100 - 50],
            }}
            transition={{ duration: 2 }}
            onAnimationComplete={() => {
              setParticles(prev => prev.filter(p => p.id !== particle.id));
            }}
          />
        ))}
      </AnimatePresence>

      {/* Celebration Modal */}
      {showCelebration && (
        <motion.div
          className="fixed inset-0 bg-yellow-200 bg-opacity-75 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 text-center shadow-2xl border-4 border-yellow-400"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.6 }}
          >
            <motion.div 
              className="text-8xl mb-4"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🎉
            </motion.div>
            <motion.h3 
              className="text-3xl font-bold text-green-600 mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Excellent!
            </motion.h3>
            <motion.p 
              className="text-xl text-gray-700 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              You matched all the animals!
            </motion.p>
            <motion.div 
              className="text-6xl mb-4"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⭐⭐⭐
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      <div className="relative z-10 p-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-4xl font-bold text-green-700 mb-2"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ 
              backgroundSize: '200% 200%',
              background: 'linear-gradient(90deg, #10B981, #3B82F6, #8B5CF6, #10B981)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            🎮 {t('dragGame')}
          </motion.h2>
          <motion.div 
            className="text-2xl font-semibold text-blue-600"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Score: {score} ⭐
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Animal Emojis (Draggable) */}
          <motion.div 
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 shadow-2xl border-4 border-blue-200"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h3 
              className="text-2xl font-bold mb-6 text-center text-blue-700"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🐾 Animals
            </motion.h3>
            <div className="grid grid-cols-2 gap-4">
              {animals.map((animal, index) => (
                <motion.div
                  key={animal.id}
                  draggable={!matches[animal.id]}
                  onDragStart={(e) => handleDragStart(e, animal.id)}
                  className={`text-center p-4 rounded-2xl cursor-move transition-all ${
                    matches[animal.id] 
                      ? 'bg-green-200 opacity-50 scale-95' 
                      : 'bg-white shadow-lg hover:shadow-xl hover:scale-105'
                  } border-4 ${matches[animal.id] ? 'border-green-400' : 'border-blue-300'}`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6, type: "spring" }}
                  whileHover={!matches[animal.id] ? { scale: 1.1, rotate: 5 } : {}}
                  whileTap={!matches[animal.id] ? { scale: 0.95 } : {}}
                >
                  <motion.div 
                    className="text-5xl mb-2"
                    animate={!matches[animal.id] ? { 
                      y: [0, -5, 0],
                      rotate: [0, 5, -5, 0]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {animal.emoji}
                  </motion.div>
                  {matches[animal.id] && (
                    <motion.div 
                      className="text-green-600 font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.6 }}
                    >
                      ✓ Matched!
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Animal Names (Drop Targets) */}
          <motion.div 
            className="bg-gradient-to-br from-pink-50 to-red-50 rounded-3xl p-6 shadow-2xl border-4 border-pink-200"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.h3 
              className="text-2xl font-bold mb-6 text-center text-pink-700"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              📝 Names
            </motion.h3>
            <div className="grid grid-cols-2 gap-4">
              {animals.map((animal, index) => (
                <motion.div
                  key={animal.name}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, animal.name)}
                  className={`text-center p-4 rounded-2xl border-4 transition-all ${
                    matches[animal.id] === animal.name
                      ? 'border-green-500 bg-green-100 scale-105'
                      : 'border-dashed border-pink-300 bg-white hover:border-pink-400 hover:scale-105'
                  }`}
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.6, type: "spring" }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="font-bold text-xl mb-1"
                    animate={{ 
                      color: matches[animal.id] === animal.name ? '#10B981' : '#374151'
                    }}
                  >
                    {animal.name}
                  </motion.div>
                  <div className="text-xs text-gray-500 mb-2">
                    {animal.translation.ar} | {animal.translation.es} | {animal.translation.ku}
                  </div>
                  {matches[animal.id] === animal.name && (
                    <motion.div 
                      className="text-green-600 font-bold text-2xl"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", bounce: 0.6 }}
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Game Controls */}
        {gameCompleted && (
          <motion.div 
            className="text-center mt-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.button
              onClick={resetGame}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 border-2 border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🎮 Play Again
            </motion.button>
          </motion.div>
        )}

        <motion.div 
          className="mt-8 text-center text-sm text-gray-500"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          💡 Drag the animal emojis to match them with their names!
        </motion.div>
      </div>

      {/* CSS for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
} 