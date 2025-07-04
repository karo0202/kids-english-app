import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LessonAnimals from './pages/LessonAnimals';
import LanguageSwitcher from './components/LanguageSwitcher';
import AnimalMatchingGame from './components/AnimalMatchingGame';
import RewardSystem from './components/RewardSystem';

function Home() {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="flex space-x-4 mb-4">
        <div className="w-24 h-24 bg-yellow-300 rounded-full flex items-center justify-center text-4xl shadow-lg">🐻</div>
        <div className="w-24 h-24 bg-green-300 rounded-full flex items-center justify-center text-4xl shadow-lg">🦊</div>
      </div>
      <h1 className="text-3xl font-bold text-pink-700 mb-2">{t('welcome')}</h1>
      <p className="text-lg text-blue-700 font-semibold">{t('learnTogether')}</p>
    </div>
  );
}

function Lessons() {
  const { t } = useTranslation();
  
  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">{t('lessons')}</h2>
      <Link to="/lessons/animals" className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-6 rounded-full shadow transition mb-2 w-full text-center">🐾 {t('animals')}</Link>
      <button className="bg-blue-400 text-white font-bold py-2 px-6 rounded-full shadow mb-2 w-full" disabled>🎨 {t('colors')} ({t('comingSoon')})</button>
      <button className="bg-green-400 text-white font-bold py-2 px-6 rounded-full shadow w-full" disabled>🍎 {t('food')} ({t('comingSoon')})</button>
    </div>
  );
}

function Games() {
  const { t } = useTranslation();
  
  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">{t('games')}</h2>
      <Link to="/games/animal-matching" className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-full shadow transition mb-2 w-full text-center">🐾 Animal Matching Game</Link>
      <button className="bg-blue-400 text-white font-bold py-2 px-6 rounded-full shadow mb-2 w-full" disabled>🎨 Color Game ({t('comingSoon')})</button>
      <button className="bg-pink-400 text-white font-bold py-2 px-6 rounded-full shadow w-full" disabled>🍎 Food Game ({t('comingSoon')})</button>
    </div>
  );
}

function Rewards() {
  return <RewardSystem />;
}

function Settings() {
  const { t } = useTranslation();
  
  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">{t('settings')}</h2>
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">🌍 Language / اللغة / Idioma / زمان</h3>
        <LanguageSwitcher />
      </div>
    </div>
  );
}

function App() {
  const { t } = useTranslation();
  
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-pink-100 flex flex-col">
        <nav className="bg-white shadow flex justify-center space-x-6 py-4 mb-6">
          <Link to="/" className="text-pink-600 font-bold hover:underline">{t('home')}</Link>
          <Link to="/lessons" className="text-blue-600 font-bold hover:underline">{t('lessons')}</Link>
          <Link to="/games" className="text-green-600 font-bold hover:underline">{t('games')}</Link>
          <Link to="/rewards" className="text-yellow-600 font-bold hover:underline">{t('rewards')}</Link>
          <Link to="/settings" className="text-purple-600 font-bold hover:underline">{t('settings')}</Link>
        </nav>
        <div className="flex-1 flex flex-col items-center w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/lessons/animals" element={<LessonAnimals />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/animal-matching" element={<AnimalMatchingGame />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
        <footer className="mt-8 text-xs text-gray-500 text-center">© 2024 Kids' English Learning App</footer>
      </div>
    </Router>
  );
}

export default App;
