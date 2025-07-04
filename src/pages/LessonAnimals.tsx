import React from 'react';
import { useTranslation } from 'react-i18next';
import AudioPlayer from '../components/AudioPlayer';

const vocabulary = [
  { word: 'Cat', emoji: '🐱', translation: { ar: 'قطة', es: 'Gato', ku: 'پشیلك' } },
  { word: 'Dog', emoji: '🐶', translation: { ar: 'كلب', es: 'Perro', ku: 'سەگە' } },
  { word: 'Bird', emoji: '🐦', translation: { ar: 'طائر', es: 'Pájaro', ku: 'باڵندە' } },
  { word: 'Fish', emoji: '🐟', translation: { ar: 'سمكة', es: 'Pez', ku: 'ماسی' } },
  { word: 'Cow', emoji: '🐮', translation: { ar: 'بقرة', es: 'Vaca', ku: 'مانگا' } },
  { word: 'Sheep', emoji: '🐑', translation: { ar: 'خروف', es: 'Oveja', ku: 'مەڕ' } },
];

export default function LessonAnimals() {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-4 mb-8">
      {/* Cartoon Guide Characters */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center text-3xl">🐻</div>
        <div>
          <div className="font-bold text-lg text-pink-700">Benny Bear</div>
          <div className="text-sm">{t('bennyGreeting')}</div>
        </div>
        <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center text-3xl">🦊</div>
        <div>
          <div className="font-bold text-lg text-green-700">Fiona Fox</div>
          <div className="text-sm">{t('fionaGreeting')}</div>
        </div>
      </div>
      
      {/* Story/Dialogue */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{t('storyTime')}</h2>
        <div className="bg-blue-50 rounded p-3">
          <p className="mb-2">🐻 Benny: "{t('bennyCat')}"</p>
          <p className="mb-2">🦊 Fiona: "{t('fionaDog')}"</p>
          <p className="mb-2">🐻 Benny: "{t('bennyBird')}"</p>
          <p className="mb-2">🦊 Fiona: "{t('fionaFish')}"</p>
        </div>
      </div>
      
      {/* Vocabulary List */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{t('animalWords')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {vocabulary.map((v) => (
            <div key={v.word} className="border rounded-lg p-2 flex flex-col items-center bg-yellow-50">
              <span className="text-3xl mb-1">{v.emoji}</span>
              <span className="font-bold text-lg">{v.word}</span>
              <span className="text-xs text-gray-500">{v.translation.ar} | {v.translation.es} | {v.translation.ku}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Song/Rhyme */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{t('animalSong')}</h2>
        <div className="bg-pink-50 rounded p-3 italic">
          <p>{t('animalSongText')}</p>
        </div>
      </div>
      
      {/* Writing Practice */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{t('writingPractice')}</h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="font-bold">C</span>
            <span className="font-bold">c</span>
            <span className="text-xs text-gray-500">"{t('startTop')}"</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold">D</span>
            <span className="font-bold">d</span>
            <span className="text-xs text-gray-500">"{t('bigLine')}"</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold">B</span>
            <span className="font-bold">b</span>
            <span className="text-xs text-gray-500">"{t('twoBumps')}"</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400">({t('tracingComingSoon')})</div>
      </div>
      
      {/* Mini-Game Placeholder */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{t('miniGame')}</h2>
        <div className="bg-green-50 rounded p-3 text-center">
          <p>🎮 <span className="font-bold">{t('dragGame')}</span></p>
          <p className="text-xs text-gray-400">({t('interactiveComingSoon')})</p>
        </div>
      </div>
      
      {/* Audio Support */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{t('audio')}</h2>
        <div className="space-y-3">
          <AudioPlayer audioType="story" />
          <AudioPlayer audioType="song" />
          <AudioPlayer audioType="words" />
        </div>
      </div>
      
      {/* Reward System */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{t('rewards')}</h2>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-2xl">⭐</span>
          <span className="text-yellow-400 text-2xl">⭐</span>
          <span className="text-yellow-400 text-2xl">⭐</span>
          <span className="ml-2 font-bold">{t('greatJob')}</span>
        </div>
        <div className="mt-2 text-xs text-gray-400">({t('earnMore')})</div>
      </div>
      
      {/* Learning Objective */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{t('learningObjective')}</h2>
        <div className="bg-blue-100 rounded p-3">
          <p>{t('objective')}</p>
        </div>
      </div>
      
      {/* Localization Section */}
      <div className="mb-2">
        <h2 className="text-xl font-bold mb-2">{t('translations')}</h2>
        <div className="bg-gray-50 rounded p-3 text-xs">
          <p><span className="font-bold">Cat</span>: قطة (ar), Gato (es), پشیلك (ku)</p>
          <p><span className="font-bold">Dog</span>: كلب (ar), Perro (es), سەگە (ku)</p>
          <p><span className="font-bold">Bird</span>: طائر (ar), Pájaro (es), باڵندە (ku)</p>
          <p><span className="font-bold">Fish</span>: سمكة (ar), Pez (es), ماسی (ku)</p>
          <p><span className="font-bold">Cow</span>: بقرة (ar), Vaca (es), مانگا (ku)</p>
          <p><span className="font-bold">Sheep</span>: خروف (ar), Oveja (es), مەڕ (ku)</p>
        </div>
      </div>
    </div>
  );
} 