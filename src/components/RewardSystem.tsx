import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
  unlocked: boolean;
  dateUnlocked?: string;
}

export default function RewardSystem() {
  const { t } = useTranslation();
  const [totalStars, setTotalStars] = useState(0);
  const [level, setLevel] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);

  const [badges] = useState<Badge[]>([
    {
      id: 'first_lesson',
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🌟',
      color: 'bg-yellow-100',
      unlocked: true,
      progress: 1,
      maxProgress: 1
    },
    {
      id: 'animal_expert',
      name: 'Animal Expert',
      description: 'Learn all animal names',
      icon: '🐾',
      color: 'bg-green-100',
      unlocked: true,
      progress: 6,
      maxProgress: 6
    },
    {
      id: 'game_master',
      name: 'Game Master',
      description: 'Complete 3 games',
      icon: '🎮',
      color: 'bg-blue-100',
      unlocked: false,
      progress: 1,
      maxProgress: 3
    },
    {
      id: 'language_learner',
      name: 'Language Learner',
      description: 'Try all 4 languages',
      icon: '🌍',
      color: 'bg-purple-100',
      unlocked: false,
      progress: 2,
      maxProgress: 4
    },
    {
      id: 'perfect_score',
      name: 'Perfect Score',
      description: 'Get 100% on a game',
      icon: '🏆',
      color: 'bg-red-100',
      unlocked: false,
      progress: 0,
      maxProgress: 1
    }
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: 'welcome',
      name: 'Welcome!',
      description: 'Started your learning journey',
      icon: '👋',
      unlocked: true,
      dateUnlocked: '2024-01-01'
    },
    {
      id: 'persistent',
      name: 'Persistent Learner',
      description: 'Completed 5 lessons',
      icon: '📚',
      unlocked: false
    },
    {
      id: 'multilingual',
      name: 'Multilingual',
      description: 'Used 3 different languages',
      icon: '🗣️',
      unlocked: false
    }
  ]);

  useEffect(() => {
    // Calculate total stars from unlocked badges and achievements
    const unlockedBadges = badges.filter(b => b.unlocked).length;
    const unlockedAchievements = achievements.filter(a => a.unlocked).length;
    const newTotalStars = unlockedBadges * 10 + unlockedAchievements * 5;
    setTotalStars(newTotalStars);
    
    // Calculate level (every 50 stars = 1 level)
    setLevel(Math.floor(newTotalStars / 50) + 1);
  }, [badges, achievements]);

  const unlockBadge = (badgeId: string) => {
    // In a real app, this would update the database
    console.log(`Unlocked badge: ${badgeId}`);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      {/* Header with Stats */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-purple-700 mb-2">🏆 {t('rewards')}</h2>
        <div className="flex justify-center items-center space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{totalStars}</div>
            <div className="text-sm text-gray-600">Total Stars</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">Level {level}</div>
            <div className="text-sm text-gray-600">Current Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {badges.filter(b => b.unlocked).length}
            </div>
            <div className="text-sm text-gray-600">Badges Earned</div>
          </div>
        </div>
      </div>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-yellow-200 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center shadow-2xl">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">Congratulations!</h3>
            <p className="text-lg text-gray-700">You earned a new badge!</p>
            <div className="text-4xl mt-4">🏆</div>
          </div>
        </div>
      )}

      {/* Badges Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-center">🌟 Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                badge.unlocked
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-gray-50 opacity-60'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h4 className="font-bold text-lg mb-1">{badge.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">
                  {badge.progress}/{badge.maxProgress}
                </div>
                
                {badge.unlocked && (
                  <div className="text-green-600 font-bold mt-2">✓ Unlocked!</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-center">🏅 Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.unlocked
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-300 bg-gray-50 opacity-60'
              }`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h4 className="font-bold text-lg mb-1">{achievement.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                
                {achievement.unlocked && achievement.dateUnlocked && (
                  <div className="text-xs text-gray-500">
                    Unlocked: {new Date(achievement.dateUnlocked).toLocaleDateString()}
                  </div>
                )}
                
                {achievement.unlocked && (
                  <div className="text-yellow-600 font-bold mt-2">🏆 Earned!</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress to Next Level */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 text-center">
        <h4 className="font-bold text-lg mb-2">Next Level Progress</h4>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
            style={{ width: `${((totalStars % 50) / 50) * 100}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600">
          {totalStars % 50} / 50 stars to Level {level + 1}
        </div>
      </div>
    </div>
  );
} 