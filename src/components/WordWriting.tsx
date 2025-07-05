import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';

interface WordData {
  word: string;
  category: string;
  emoji: string;
  image: string;
  letters: string[];
  level: number;
}

const wordData: WordData[] = [
  // Level 1 - Animals
  { word: 'cat', category: 'Animals', emoji: '🐱', image: '🐱', letters: ['c', 'a', 't'], level: 1 },
  { word: 'dog', category: 'Animals', emoji: '🐕', image: '🐕', letters: ['d', 'o', 'g'], level: 1 },
  { word: 'hen', category: 'Animals', emoji: '🐔', image: '🐔', letters: ['h', 'e', 'n'], level: 1 },
  { word: 'pig', category: 'Animals', emoji: '🐷', image: '🐷', letters: ['p', 'i', 'g'], level: 1 },
  { word: 'sun', category: 'Nature', emoji: '☀️', image: '☀️', letters: ['s', 'u', 'n'], level: 1 },
  
  // Level 2 - Food
  { word: 'apple', category: 'Food', emoji: '🍎', image: '🍎', letters: ['a', 'p', 'p', 'l', 'e'], level: 2 },
  { word: 'egg', category: 'Food', emoji: '🥚', image: '🥚', letters: ['e', 'g', 'g'], level: 2 },
  { word: 'milk', category: 'Food', emoji: '🥛', image: '🥛', letters: ['m', 'i', 'l', 'k'], level: 2 },
  { word: 'tree', category: 'Nature', emoji: '🌳', image: '🌳', letters: ['t', 'r', 'e', 'e'], level: 2 },
  { word: 'star', category: 'Nature', emoji: '⭐', image: '⭐', letters: ['s', 't', 'a', 'r'], level: 2 },
  
  // Level 3 - Actions
  { word: 'run', category: 'Actions', emoji: '🏃', image: '🏃', letters: ['r', 'u', 'n'], level: 3 },
  { word: 'hop', category: 'Actions', emoji: '🦘', image: '🦘', letters: ['h', 'o', 'p'], level: 3 },
  { word: 'sit', category: 'Actions', emoji: '🪑', image: '🪑', letters: ['s', 'i', 't'], level: 3 },
  { word: 'jump', category: 'Actions', emoji: '🦘', image: '🦘', letters: ['j', 'u', 'm', 'p'], level: 3 },
  { word: 'play', category: 'Actions', emoji: '🎮', image: '🎮', letters: ['p', 'l', 'a', 'y'], level: 3 },
];

const WordWriting: React.FC = () => {
  const { t } = useTranslation();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentMode, setCurrentMode] = useState<'tracing' | 'building' | 'drawing'>('tracing');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPath, setDrawingPath] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userDrawing, setUserDrawing] = useState<string>('');
  const [buildingGame, setBuildingGame] = useState({
    letters: [] as string[],
    userWord: '',
    isComplete: false,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentWord = wordData[currentWordIndex];

  useEffect(() => {
    if (currentMode === 'building') {
      generateBuildingGame();
    }
  }, [currentWordIndex, currentMode]);

  const generateBuildingGame = () => {
    const shuffledLetters = [...currentWord.letters].sort(() => Math.random() - 0.5);
    setBuildingGame({
      letters: shuffledLetters,
      userWord: '',
      isComplete: false,
    });
  };

  const playWordSound = () => {
    const utterance = new SpeechSynthesisUtterance(
      `Let's say ${currentWord.word}. ${currentWord.word}!`
    );
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    speechSynthesis.speak(utterance);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    setDrawingPath(`M ${x} ${y}`);
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDrawingPath(prev => `${prev} L ${x} ${y}`);
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setDrawingPath('');
  };

  const handleWordComplete = () => {
    setShowCelebration(true);
    setScore(prev => prev + 20);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    setTimeout(() => {
      setShowCelebration(false);
      if (currentWordIndex < wordData.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
      }
    }, 2000);
  };

  const handleLetterClick = (letter: string) => {
    if (buildingGame.isComplete) return;
    
    const newUserWord = buildingGame.userWord + letter;
    setBuildingGame(prev => ({
      ...prev,
      userWord: newUserWord,
      isComplete: newUserWord === currentWord.word,
    }));
    
    if (newUserWord === currentWord.word) {
      setTimeout(() => {
        setScore(prev => prev + 30);
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.6 }
        });
        
        setTimeout(() => {
          if (currentWordIndex < wordData.length - 1) {
            setCurrentWordIndex(prev => prev + 1);
          }
        }, 1500);
      }, 500);
    }
  };

  const resetBuildingGame = () => {
    generateBuildingGame();
  };

  const saveDrawing = () => {
    setUserDrawing(drawingPath);
    handleWordComplete();
  };

  const nextWord = () => {
    if (currentWordIndex < wordData.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      clearCanvas();
    }
  };

  const prevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(prev => prev - 1);
      clearCanvas();
    }
  };

  const filteredWords = wordData.filter(word => word.level === currentLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold text-green-700 mb-4">
            📝 My Word Garden
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            Let's grow a word garden! Every time you write a word, a flower grows! 🌸
          </p>
          
          {/* Level Selector */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
              {[1, 2, 3].map((level) => (
                <motion.button
                  key={level}
                  onClick={() => setCurrentLevel(level)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 mx-1 ${
                    currentLevel === level
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Level {level}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentWordIndex + 1) / wordData.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Word {currentWordIndex + 1} of {wordData.length}</span>
            <span>Score: {score} 🌟</span>
          </div>
        </motion.div>

        {/* Game Mode Selector */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
            {(['tracing', 'building', 'drawing'] as const).map((mode) => (
              <motion.button
                key={mode}
                onClick={() => setCurrentMode(mode)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 mx-1 ${
                  currentMode === mode
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {mode === 'tracing' && '✏️ Tracing'}
                {mode === 'building' && '🧩 Building'}
                {mode === 'drawing' && '🎨 Drawing'}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Word Display */}
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center">
              {/* Current Word */}
              <motion.div
                className="text-6xl font-bold mb-6 text-green-600"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {currentWord.word}
              </motion.div>

              {/* Word Info */}
              <div className="space-y-4">
                <motion.div
                  className="text-5xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {currentWord.emoji}
                </motion.div>
                
                <h3 className="text-xl font-bold text-gray-800">
                  Category: {currentWord.category}
                </h3>
                
                <motion.button
                  onClick={playWordSound}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-medium shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔊 Say "{currentWord.word}"
                </motion.button>

                {/* Letter Breakdown */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Letters in this word:</h4>
                  <div className="flex justify-center space-x-2">
                    {currentWord.letters.map((letter, index) => (
                      <motion.div
                        key={index}
                        className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {letter}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interactive Area */}
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {currentMode === 'tracing' && (
                <motion.div
                  key="tracing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    ✏️ Trace the Word
                  </h3>
                  
                  <div className="relative mb-6">
                    <div className="text-4xl font-bold text-gray-300 mb-4">
                      {currentWord.word}
                    </div>
                    <div className="text-4xl font-bold text-green-600 absolute inset-0 opacity-50">
                      {currentWord.word}
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={handleWordComplete}
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ✅ I traced it!
                  </motion.button>
                </motion.div>
              )}

              {currentMode === 'building' && (
                <motion.div
                  key="building"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    🧩 Build the Word
                  </h3>
                  
                  <div className="mb-6">
                    <div className="text-4xl mb-4">{currentWord.emoji}</div>
                    <p className="text-lg text-gray-600 mb-4">
                      Click the letters to build "{currentWord.word}"
                    </p>
                  </div>
                  
                  {/* User's Word */}
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-green-600 min-h-[3rem] flex items-center justify-center">
                      {buildingGame.userWord || '...'}
                    </div>
                  </div>
                  
                  {/* Available Letters */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {buildingGame.letters.map((letter, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleLetterClick(letter)}
                        className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-2xl font-bold text-2xl shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={buildingGame.isComplete}
                      >
                        {letter}
                      </motion.button>
                    ))}
                  </div>
                  
                  <motion.button
                    onClick={resetBuildingGame}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🔄 Reset
                  </motion.button>
                </motion.div>
              )}

              {currentMode === 'drawing' && (
                <motion.div
                  key="drawing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    🎨 Draw {currentWord.word}
                  </h3>
                  
                  <div className="relative mb-4">
                    <canvas
                      ref={canvasRef}
                      width={300}
                      height={200}
                      className="border-2 border-green-300 rounded-2xl bg-white cursor-crosshair"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                    {drawingPath && (
                      <svg
                        className="absolute inset-0 pointer-events-none"
                        width="100%"
                        height="100%"
                      >
                        <path
                          d={drawingPath}
                          stroke="#8B5CF6"
                          strokeWidth="4"
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </div>
                  
                  <div className="space-x-4">
                    <motion.button
                      onClick={clearCanvas}
                      className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-xl font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🗑️ Clear
                    </motion.button>
                    
                    <motion.button
                      onClick={saveDrawing}
                      className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-xl font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      💾 Save Drawing
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Navigation */}
        <motion.div
          className="flex justify-between items-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={prevWord}
            disabled={currentWordIndex === 0}
            className={`px-6 py-3 rounded-2xl font-medium shadow-lg ${
              currentWordIndex === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105'
            }`}
            whileHover={currentWordIndex > 0 ? { scale: 1.05 } : {}}
            whileTap={currentWordIndex > 0 ? { scale: 0.95 } : {}}
          >
            ⬅️ Previous
          </motion.button>

          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {currentWord.word} - {currentWord.category}
            </div>
            <div className="text-gray-600">
              Level {currentWord.level} • {currentWordIndex + 1} of {wordData.length}
            </div>
          </div>

          <motion.button
            onClick={nextWord}
            disabled={currentWordIndex === wordData.length - 1}
            className={`px-6 py-3 rounded-2xl font-medium shadow-lg ${
              currentWordIndex === wordData.length - 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:scale-105'
            }`}
            whileHover={currentWordIndex < wordData.length - 1 ? { scale: 1.05 } : {}}
            whileTap={currentWordIndex < wordData.length - 1 ? { scale: 0.95 } : {}}
          >
            Next ➡️
          </motion.button>
        </motion.div>

        {/* Celebration */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-8xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                🌸
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WordWriting; 