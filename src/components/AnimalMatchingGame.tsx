import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Animal {
  id: string;
  emoji: string;
  name: string;
  translation: { ar: string; es: string; ku: string };
}

const animals: Animal[] = [
  { id: 'cat', emoji: '🐱', name: 'Cat', translation: { ar: 'قطة', es: 'Gato', ku: 'پشیلك' } },
  { id: 'dog', emoji: '🐶', name: 'Dog', translation: { ar: 'كلب', es: 'Perro', ku: 'سەگە' } },
  { id: 'bird', emoji: '🐦', name: 'Bird', translation: { ar: 'طائر', es: 'Pájaro', ku: 'باڵندە' } },
  { id: 'fish', emoji: '🐟', name: 'Fish', translation: { ar: 'سمكة', es: 'Pez', ku: 'ماسی' } },
];

export default function AnimalMatchingGame() {
  const { t } = useTranslation();
  const [draggedAnimal, setDraggedAnimal] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const handleDragStart = (e: React.DragEvent, animalId: string) => {
    setDraggedAnimal(animalId);
    e.dataTransfer.effectAllowed = 'move';
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
        
        // Check if game is completed
        const newMatches = { ...matches, [draggedAnimal]: targetName };
        if (Object.keys(newMatches).length === animals.length) {
          setGameCompleted(true);
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
        }
      }
      setDraggedAnimal(null);
    }
  };

  const resetGame = () => {
    setMatches({});
    setScore(0);
    setGameCompleted(false);
    setShowCelebration(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-green-700 mb-2">🎮 {t('dragGame')}</h2>
        <div className="text-lg font-semibold text-blue-600">Score: {score} ⭐</div>
      </div>

      {showCelebration && (
        <div className="fixed inset-0 bg-yellow-200 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center shadow-2xl">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">Excellent!</h3>
            <p className="text-lg text-gray-700">You matched all the animals!</p>
            <div className="text-4xl mt-4">⭐⭐⭐</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Animal Emojis (Draggable) */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-4 text-center">🐾 Animals</h3>
          <div className="grid grid-cols-2 gap-4">
            {animals.map((animal) => (
              <div
                key={animal.id}
                draggable={!matches[animal.id]}
                onDragStart={(e) => handleDragStart(e, animal.id)}
                className={`text-center p-4 rounded-lg cursor-move transition-all ${
                  matches[animal.id] 
                    ? 'bg-green-200 opacity-50' 
                    : 'bg-white shadow-md hover:shadow-lg'
                } ${draggedAnimal === animal.id ? 'scale-110' : ''}`}
              >
                <div className="text-4xl mb-2">{animal.emoji}</div>
                {matches[animal.id] && (
                  <div className="text-green-600 font-bold">✓ Matched!</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Animal Names (Drop Targets) */}
        <div className="bg-pink-50 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-4 text-center">📝 Names</h3>
          <div className="grid grid-cols-2 gap-4">
            {animals.map((animal) => (
              <div
                key={animal.name}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, animal.name)}
                className={`text-center p-4 rounded-lg border-2 border-dashed transition-all ${
                  matches[animal.id] === animal.name
                    ? 'border-green-500 bg-green-100'
                    : 'border-gray-300 bg-white hover:border-blue-400'
                }`}
              >
                <div className="font-bold text-lg mb-1">{animal.name}</div>
                <div className="text-xs text-gray-500">
                  {animal.translation.ar} | {animal.translation.es} | {animal.translation.ku}
                </div>
                {matches[animal.id] === animal.name && (
                  <div className="text-green-600 font-bold mt-2">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {gameCompleted && (
        <div className="text-center mt-6">
          <button
            onClick={resetGame}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow transition"
          >
            🎮 Play Again
          </button>
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-500">
        💡 Drag the animal emojis to match them with their names!
      </div>
    </div>
  );
} 