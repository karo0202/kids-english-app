import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';

interface WritingEntry {
  id: string;
  type: 'letter' | 'word';
  content: string;
  timestamp: Date;
  drawing?: string;
  score: number;
  category?: string;
}

interface WritingBookProps {
  entries: WritingEntry[];
  onAddEntry: (entry: WritingEntry) => void;
}

const WritingBook: React.FC<WritingBookProps> = ({ entries, onAddEntry }) => {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'letter' | 'word'>('all');
  const [selectedEntry, setSelectedEntry] = useState<WritingEntry | null>(null);
  const [showStats, setShowStats] = useState(false);

  const filteredEntries = entries.filter(entry => {
    if (selectedFilter === 'all') return true;
    return entry.type === selectedFilter;
  });

  const totalScore = entries.reduce((sum, entry) => sum + entry.score, 0);
  const letterCount = entries.filter(entry => entry.type === 'letter').length;
  const wordCount = entries.filter(entry => entry.type === 'word').length;
  const totalEntries = entries.length;

  const getAchievementLevel = () => {
    if (totalEntries >= 50) return { level: 'Master Writer', emoji: '👑', color: 'from-yellow-400 to-orange-500' };
    if (totalEntries >= 30) return { level: 'Advanced Writer', emoji: '🏆', color: 'from-purple-400 to-pink-500' };
    if (totalEntries >= 20) return { level: 'Good Writer', emoji: '⭐', color: 'from-blue-400 to-purple-500' };
    if (totalEntries >= 10) return { level: 'Learning Writer', emoji: '🌟', color: 'from-green-400 to-blue-500' };
    return { level: 'Beginner Writer', emoji: '🌱', color: 'from-gray-400 to-green-500' };
  };

  const achievement = getAchievementLevel();

  const handleEntryClick = (entry: WritingEntry) => {
    setSelectedEntry(entry);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold text-orange-700 mb-4">
            📘 My Writing Book
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            A collection of all your amazing writing adventures!
          </p>
        </motion.div>

        {/* Stats and Achievement */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Achievement Card */}
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-center">
              <motion.div
                className="text-6xl mb-4"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {achievement.emoji}
              </motion.div>
              <h3 className={`text-2xl font-bold bg-gradient-to-r ${achievement.color} bg-clip-text text-transparent mb-2`}>
                {achievement.level}
              </h3>
              <p className="text-gray-600">
                {totalEntries} total entries
              </p>
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl"
            whileHover={{ scale: 1.02 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{letterCount}</div>
                <div className="text-sm text-gray-600">Letters</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{wordCount}</div>
                <div className="text-sm text-gray-600">Words</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{totalScore}</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{Math.floor(totalScore / 10)}</div>
                <div className="text-sm text-gray-600">Stars</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
            {(['all', 'letter', 'word'] as const).map((filter) => (
              <motion.button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 mx-1 ${
                  selectedFilter === filter
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter === 'all' && '📚 All'}
                {filter === 'letter' && '🅰️ Letters'}
                {filter === 'word' && '📝 Words'}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Entries Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {filteredEntries.length === 0 ? (
            <motion.div
              className="col-span-full text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                Your writing book is empty
              </h3>
              <p className="text-gray-600">
                Start writing letters and words to fill your book!
              </p>
            </motion.div>
          ) : (
            filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEntryClick(entry)}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">
                    {entry.type === 'letter' ? '🅰️' : '📝'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {entry.content}
                  </h3>
                  <div className="text-sm text-gray-600 mb-3">
                    {entry.category && `${entry.category} • `}
                    {formatDate(entry.timestamp)}
                  </div>
                  <div className="flex justify-center items-center space-x-2">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-bold text-gray-700">{entry.score}</span>
                  </div>
                  {entry.drawing && (
                    <div className="mt-3 text-xs text-purple-600">
                      🎨 Has drawing
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Entry Detail Modal */}
        <AnimatePresence>
          {selectedEntry && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEntry(null)}
            >
              <motion.div
                className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {selectedEntry.type === 'letter' ? '🅰️' : '📝'}
                  </div>
                  <h2 className="text-4xl font-bold text-gray-800 mb-4">
                    {selectedEntry.content}
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedEntry.type === 'letter' ? 'Letter' : 'Word'}
                      </div>
                      <div className="text-sm text-gray-600">Type</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedEntry.score}
                      </div>
                      <div className="text-sm text-gray-600">Score</div>
                    </div>
                  </div>
                  
                  {selectedEntry.category && (
                    <div className="mb-4">
                      <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-full text-sm font-medium">
                        {selectedEntry.category}
                      </span>
                    </div>
                  )}
                  
                  <div className="text-gray-600 mb-6">
                    Written on {formatDate(selectedEntry.timestamp)}
                  </div>
                  
                  {selectedEntry.drawing && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-3">🎨 Your Drawing</h3>
                      <div className="bg-gray-100 rounded-2xl p-4">
                        <svg
                          width="100%"
                          height="200"
                          className="border border-gray-300 rounded-xl bg-white"
                        >
                          <path
                            d={selectedEntry.drawing}
                            stroke="#8B5CF6"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  <motion.button
                    onClick={() => setSelectedEntry(null)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Celebration */}
        {totalEntries > 0 && totalEntries % 10 === 0 && (
          <motion.div
            className="fixed bottom-6 left-6 bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-2xl shadow-2xl"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">🎉</div>
              <div className="font-bold">Milestone Reached!</div>
              <div className="text-sm">You've written {totalEntries} entries!</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WritingBook; 