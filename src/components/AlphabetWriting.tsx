import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';

interface LetterData {
  letter: string;
  lowercase: string;
  sound: string;
  word: string;
  emoji: string;
  examples: string[];
}

const alphabetData: LetterData[] = [
  { letter: 'A', lowercase: 'a', sound: 'ahh', word: 'Apple', emoji: '🍎', examples: ['apple', 'ant', 'astronaut'] },
  { letter: 'B', lowercase: 'b', sound: 'buh', word: 'Ball', emoji: '⚽', examples: ['ball', 'bear', 'book'] },
  { letter: 'C', lowercase: 'c', sound: 'kuh', word: 'Cat', emoji: '🐱', examples: ['cat', 'car', 'cake'] },
  { letter: 'D', lowercase: 'd', sound: 'duh', word: 'Dog', emoji: '🐕', examples: ['dog', 'duck', 'doll'] },
  { letter: 'E', lowercase: 'e', sound: 'eh', word: 'Egg', emoji: '🥚', examples: ['egg', 'elephant', 'eye'] },
  { letter: 'F', lowercase: 'f', sound: 'fuh', word: 'Fish', emoji: '🐟', examples: ['fish', 'flower', 'fox'] },
  { letter: 'G', lowercase: 'g', sound: 'guh', word: 'Girl', emoji: '👧', examples: ['girl', 'goat', 'gift'] },
  { letter: 'H', lowercase: 'h', sound: 'huh', word: 'Hat', emoji: '🎩', examples: ['hat', 'house', 'heart'] },
  { letter: 'I', lowercase: 'i', sound: 'ih', word: 'Ice', emoji: '🧊', examples: ['ice', 'igloo', 'ink'] },
  { letter: 'J', lowercase: 'j', sound: 'juh', word: 'Jump', emoji: '🦘', examples: ['jump', 'jelly', 'jacket'] },
  { letter: 'K', lowercase: 'k', sound: 'kuh', word: 'King', emoji: '👑', examples: ['king', 'kite', 'key'] },
  { letter: 'L', lowercase: 'l', sound: 'luh', word: 'Lion', emoji: '🦁', examples: ['lion', 'leaf', 'lamp'] },
  { letter: 'M', lowercase: 'm', sound: 'muh', word: 'Moon', emoji: '🌙', examples: ['moon', 'milk', 'mouse'] },
  { letter: 'N', lowercase: 'n', sound: 'nuh', word: 'Nest', emoji: '🪺', examples: ['nest', 'nose', 'night'] },
  { letter: 'O', lowercase: 'o', sound: 'oh', word: 'Orange', emoji: '🍊', examples: ['orange', 'owl', 'ocean'] },
  { letter: 'P', lowercase: 'p', sound: 'puh', word: 'Pig', emoji: '🐷', examples: ['pig', 'pen', 'pizza'] },
  { letter: 'Q', lowercase: 'q', sound: 'kwuh', word: 'Queen', emoji: '👸', examples: ['queen', 'quilt', 'quick'] },
  { letter: 'R', lowercase: 'r', sound: 'ruh', word: 'Rain', emoji: '🌧️', examples: ['rain', 'rabbit', 'rose'] },
  { letter: 'S', lowercase: 's', sound: 'sss', word: 'Sun', emoji: '☀️', examples: ['sun', 'star', 'snake'] },
  { letter: 'T', lowercase: 't', sound: 'tuh', word: 'Tree', emoji: '🌳', examples: ['tree', 'tiger', 'train'] },
  { letter: 'U', lowercase: 'u', sound: 'uh', word: 'Umbrella', emoji: '☂️', examples: ['umbrella', 'up', 'unicorn'] },
  { letter: 'V', lowercase: 'v', sound: 'vuh', word: 'Van', emoji: '🚐', examples: ['van', 'violin', 'vase'] },
  { letter: 'W', lowercase: 'w', sound: 'wuh', word: 'Water', emoji: '💧', examples: ['water', 'window', 'wolf'] },
  { letter: 'X', lowercase: 'x', sound: 'ks', word: 'Box', emoji: '📦', examples: ['box', 'fox', 'six'] },
  { letter: 'Y', lowercase: 'y', sound: 'yuh', word: 'Yellow', emoji: '🟡', examples: ['yellow', 'yarn', 'yacht'] },
  { letter: 'Z', lowercase: 'z', sound: 'zuh', word: 'Zebra', emoji: '🦓', examples: ['zebra', 'zoo', 'zebra'] },
];

const AlphabetWriting: React.FC = () => {
  const { t } = useTranslation();
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [currentMode, setCurrentMode] = useState<'uppercase' | 'lowercase'>('uppercase');
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPath, setDrawingPath] = useState<string>('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [gameMode, setGameMode] = useState<'tracing' | 'matching' | 'drawing'>('tracing');
  const [score, setScore] = useState(0);
  const [matchingGame, setMatchingGame] = useState({
    options: [] as string[],
    correctAnswer: '',
    selectedAnswer: '',
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentLetter = alphabetData[currentLetterIndex];

  useEffect(() => {
    if (gameMode === 'matching') {
      generateMatchingGame();
    }
  }, [currentLetterIndex, gameMode]);

  const generateMatchingGame = () => {
    const correctWord = currentLetter.examples[0];
    const otherWords = alphabetData
      .filter((_, index) => index !== currentLetterIndex)
      .map(letter => letter.examples[0])
      .slice(0, 3);
    
    const options = [...otherWords, correctWord].sort(() => Math.random() - 0.5);
    
    setMatchingGame({
      options,
      correctAnswer: correctWord,
      selectedAnswer: '',
    });
  };

  const playLetterSound = () => {
    const utterance = new SpeechSynthesisUtterance(
      `${currentLetter.letter} says ${currentLetter.sound} like in ${currentLetter.word.toLowerCase()}`
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

  const handleLetterComplete = () => {
    setShowCelebration(true);
    setScore(prev => prev + 10);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    setTimeout(() => {
      setShowCelebration(false);
      if (currentLetterIndex < alphabetData.length - 1) {
        setCurrentLetterIndex(prev => prev + 1);
      }
    }, 2000);
  };

  const handleMatchingAnswer = (answer: string) => {
    setMatchingGame(prev => ({ ...prev, selectedAnswer: answer }));
    
    if (answer === matchingGame.correctAnswer) {
      setScore(prev => prev + 20);
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => {
        if (currentLetterIndex < alphabetData.length - 1) {
          setCurrentLetterIndex(prev => prev + 1);
        }
      }, 1500);
    }
  };

  const nextLetter = () => {
    if (currentLetterIndex < alphabetData.length - 1) {
      setCurrentLetterIndex(prev => prev + 1);
      clearCanvas();
    }
  };

  const prevLetter = () => {
    if (currentLetterIndex > 0) {
      setCurrentLetterIndex(prev => prev - 1);
      clearCanvas();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold text-blue-700 mb-4">
            🅰️ Alphabet Adventure
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            Let's go on an adventure with letters! Each letter has its own story.
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentLetterIndex + 1) / alphabetData.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Letter {currentLetterIndex + 1} of {alphabetData.length}</span>
            <span>Score: {score} ⭐</span>
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
            {(['tracing', 'matching', 'drawing'] as const).map((mode) => (
              <motion.button
                key={mode}
                onClick={() => setGameMode(mode)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 mx-1 ${
                  gameMode === mode
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {mode === 'tracing' && '✏️ Tracing'}
                {mode === 'matching' && '🧩 Matching'}
                {mode === 'drawing' && '🎨 Drawing'}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Letter Display */}
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center">
              {/* Current Letter */}
              <motion.div
                className="text-8xl font-bold mb-6"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {currentMode === 'uppercase' ? currentLetter.letter : currentLetter.lowercase}
              </motion.div>

              {/* Letter Info */}
              <div className="space-y-4">
                <motion.div
                  className="text-4xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {currentLetter.emoji}
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-800">
                  {currentLetter.letter} is for {currentLetter.word}
                </h3>
                
                <motion.button
                  onClick={playLetterSound}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-medium shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔊 {currentLetter.letter} says "{currentLetter.sound}"
                </motion.button>
              </div>

              {/* Mode Toggle */}
              <div className="mt-6">
                <motion.button
                  onClick={() => setCurrentMode(currentMode === 'uppercase' ? 'lowercase' : 'uppercase')}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-xl font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Switch to {currentMode === 'uppercase' ? 'Lowercase' : 'Uppercase'}
                </motion.button>
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
              {gameMode === 'tracing' && (
                <motion.div
                  key="tracing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    ✏️ Trace the Letter
                  </h3>
                  
                  <div className="relative mb-6">
                    <div className="text-6xl font-bold text-gray-300 mb-4">
                      {currentMode === 'uppercase' ? currentLetter.letter : currentLetter.lowercase}
                    </div>
                    <div className="text-6xl font-bold text-purple-600 absolute inset-0 opacity-50">
                      {currentMode === 'uppercase' ? currentLetter.letter : currentLetter.lowercase}
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={handleLetterComplete}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ✅ I traced it!
                  </motion.button>
                </motion.div>
              )}

              {gameMode === 'matching' && (
                <motion.div
                  key="matching"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    🧩 Match the Word
                  </h3>
                  
                  <div className="mb-6">
                    <div className="text-4xl mb-4">{currentLetter.emoji}</div>
                    <p className="text-lg text-gray-600 mb-4">
                      Which word starts with the letter <strong>{currentLetter.letter}</strong>?
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {matchingGame.options.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleMatchingAnswer(option)}
                        className={`p-4 rounded-2xl font-medium text-lg transition-all duration-300 ${
                          matchingGame.selectedAnswer === option
                            ? option === matchingGame.correctAnswer
                              ? 'bg-green-500 text-white shadow-lg'
                              : 'bg-red-500 text-white shadow-lg'
                            : 'bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={matchingGame.selectedAnswer !== ''}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {gameMode === 'drawing' && (
                <motion.div
                  key="drawing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    🎨 Draw with the Letter
                  </h3>
                  
                  <div className="relative mb-4">
                    <canvas
                      ref={canvasRef}
                      width={300}
                      height={200}
                      className="border-2 border-purple-300 rounded-2xl bg-white cursor-crosshair"
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
                      onClick={handleLetterComplete}
                      className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-xl font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ✅ Save Drawing
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
            onClick={prevLetter}
            disabled={currentLetterIndex === 0}
            className={`px-6 py-3 rounded-2xl font-medium shadow-lg ${
              currentLetterIndex === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:scale-105'
            }`}
            whileHover={currentLetterIndex > 0 ? { scale: 1.05 } : {}}
            whileTap={currentLetterIndex > 0 ? { scale: 0.95 } : {}}
          >
            ⬅️ Previous
          </motion.button>

          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {currentLetter.letter} - {currentLetter.word}
            </div>
            <div className="text-gray-600">
              {currentLetterIndex + 1} of {alphabetData.length}
            </div>
          </div>

          <motion.button
            onClick={nextLetter}
            disabled={currentLetterIndex === alphabetData.length - 1}
            className={`px-6 py-3 rounded-2xl font-medium shadow-lg ${
              currentLetterIndex === alphabetData.length - 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105'
            }`}
            whileHover={currentLetterIndex < alphabetData.length - 1 ? { scale: 1.05 } : {}}
            whileTap={currentLetterIndex < alphabetData.length - 1 ? { scale: 0.95 } : {}}
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
                🎉
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlphabetWriting; 