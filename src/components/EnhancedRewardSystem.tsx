import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Confetti from 'react-confetti';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  date?: string;
}

export default function EnhancedRewardSystem() {
  const { t } = useTranslation();
  const [totalPoints, setTotalPoints] = useState(1250);
  const [level, setLevel] = useState(8);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [badges] = useState<Badge[]>([
    {
      id: 'first_lesson',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🌟',
      color: 'from-yellow-400 to-orange-500',
      unlocked: true,
      progress: 1,
      maxProgress: 1
    },
    {
      id: 'animal_expert',
      name: 'Animal Expert',
      description: 'Learn all animal names',
      icon: '🐾',
      color: 'from-green-400 to-teal-500',
      unlocked: true,
      progress: 6,
      maxProgress: 6
    },
    {
      id: 'perfect_score',
      name: 'Perfect Score',
      description: 'Get 100% on a game',
      icon: '🏆',
      color: 'from-purple-400 to-pink-500',
      unlocked: false,
      progress: 85,
      maxProgress: 100
    },
    {
      id: 'listener',
      name: 'Good Listener',
      description: 'Listen to 10 audio clips',
      icon: '🎧',
      color: 'from-blue-400 to-indigo-500',
      unlocked: false,
      progress: 7,
      maxProgress: 10
    },
    {
      id: 'persistent',
      name: 'Persistent Learner',
      description: 'Study for 7 days in a row',
      icon: '📚',
      color: 'from-red-400 to-pink-500',
      unlocked: false,
      progress: 3,
      maxProgress: 7
    }
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: 'welcome',
      name: 'Welcome!',
      description: 'Start your learning journey',
      icon: '🎉',
      points: 50,
      unlocked: true,
      date: '2024-01-15'
    },
    {
      id: 'first_animal',
      name: 'Animal Friend',
      description: 'Learn your first animal name',
      icon: '🐱',
      points: 100,
      unlocked: true,
      date: '2024-01-15'
    },
    {
      id: 'game_master',
      name: 'Game Master',
      description: 'Complete 5 games',
      icon: '🎮',
      points: 200,
      unlocked: true,
      date: '2024-01-16'
    },
    {
      id: 'language_explorer',
      name: 'Language Explorer',
      description: 'Try all available languages',
      icon: '🌍',
      points: 150,
      unlocked: false
    },
    {
      id: 'speed_learner',
      name: 'Speed Learner',
      description: 'Complete 3 lessons in one day',
      icon: '⚡',
      points: 300,
      unlocked: false
    }
  ]);

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

  const unlockBadge = (badgeId: string) => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const calculateLevelProgress = () => {
    const pointsForNextLevel = level * 100;
    const pointsInCurrentLevel = totalPoints % 100;
    return (pointsInCurrentLevel / 100) * 100;
  };

  const getUnlockedBadges = () => badges.filter(badge => badge.unlocked);
  const getLockedBadges = () => badges.filter(badge => !badge.unlocked);
  const getUnlockedAchievements = () => achievements.filter(achievement => achievement.unlocked);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          colors={['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']}
        />
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
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ backgroundSize: '200% 200%' }}
          >
            🏆 {t('rewards')}
          </motion.h2>
        </motion.div>

        {/* Level Progress */}
        <motion.div 
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-4 border-gradient-to-r from-purple-200 to-pink-200 mb-8 max-w-2xl mx-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="text-center mb-4">
            <motion.div 
              className="text-6xl mb-2"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⭐
            </motion.div>
            <motion.h3 
              className="text-2xl font-bold text-purple-700"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Level {level}
            </motion.h3>
            <p className="text-gray-600">{totalPoints} points</p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress to Level {level + 1}</span>
              <span>{Math.round(calculateLevelProgress())}%</span>
            </div>
            <motion.div 
              className="h-4 bg-gray-200 rounded-full overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                style={{ width: `${calculateLevelProgress()}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${calculateLevelProgress()}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Badges Section */}
          <motion.div 
            className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-6 shadow-2xl border-4 border-yellow-200"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.h3 
              className="text-2xl font-bold mb-6 text-center text-yellow-700"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🏅 Badges
            </motion.h3>
            
            <div className="space-y-4">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  className={`p-4 rounded-2xl border-4 transition-all ${
                    badge.unlocked 
                      ? 'bg-white shadow-lg border-yellow-300' 
                      : 'bg-gray-100 shadow-md border-gray-300 opacity-60'
                  }`}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg ${
                        badge.unlocked 
                          ? `bg-gradient-to-r ${badge.color}` 
                          : 'bg-gray-300'
                      }`}
                      animate={badge.unlocked ? { 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {badge.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h4 className={`font-bold text-lg ${badge.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                        {badge.name}
                      </h4>
                      <p className={`text-sm ${badge.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                        {badge.description}
                      </p>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{badge.progress}/{badge.maxProgress}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              badge.unlocked 
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-400' 
                                : 'bg-gray-300'
                            }`}
                            style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    </div>
                    {badge.unlocked && (
                      <motion.div 
                        className="text-green-500 text-2xl"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", bounce: 0.6 }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements Section */}
          <motion.div 
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 shadow-2xl border-4 border-blue-200"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.h3 
              className="text-2xl font-bold mb-6 text-center text-blue-700"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              🎯 Achievements
            </motion.h3>
            
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  className={`p-4 rounded-2xl border-4 transition-all ${
                    achievement.unlocked 
                      ? 'bg-white shadow-lg border-blue-300' 
                      : 'bg-gray-100 shadow-md border-gray-300 opacity-60'
                  }`}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-r from-blue-400 to-purple-400' 
                          : 'bg-gray-300'
                      }`}
                      animate={achievement.unlocked ? { 
                        scale: [1, 1.1, 1],
                        rotate: [0, -5, 5, 0]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {achievement.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h4 className={`font-bold text-lg ${achievement.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                        {achievement.name}
                      </h4>
                      <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-sm font-bold ${achievement.unlocked ? 'text-blue-600' : 'text-gray-400'}`}>
                          +{achievement.points} points
                        </span>
                        {achievement.date && (
                          <span className="text-xs text-gray-500">
                            {new Date(achievement.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {achievement.unlocked && (
                      <motion.div 
                        className="text-green-500 text-2xl"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", bounce: 0.6 }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats Summary */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-4 border-gradient-to-r from-green-200 to-blue-200 max-w-2xl mx-auto">
            <motion.h3 
              className="text-2xl font-bold mb-4 text-green-700"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              📊 Your Progress
            </motion.h3>
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                className="text-center p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-green-700">{getUnlockedBadges().length}</div>
                <div className="text-sm text-green-600">Badges Earned</div>
              </motion.div>
              <motion.div 
                className="text-center p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-blue-700">{getUnlockedAchievements().length}</div>
                <div className="text-sm text-blue-600">Achievements</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 