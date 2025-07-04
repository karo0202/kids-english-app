import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface AudioPlayerProps {
  audioUrl?: string;
  text: string;
  language?: string;
}

export default function EnhancedAudioPlayer({ audioUrl, text, language = 'en' }: AudioPlayerProps) {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  const [audioBars, setAudioBars] = useState<Array<{id: number, height: number, delay: number}>>(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      height: Math.random() * 60 + 20,
      delay: i * 0.1
    }))
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setShowVisualizer(false);
    } else {
      audio.play();
      setIsPlaying(true);
      setShowVisualizer(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const speakText = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 shadow-2xl border-4 border-blue-200 max-w-md mx-auto"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.h3 
        className="text-2xl font-bold mb-4 text-center text-blue-700"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🎵 {t('audioPlayer')}
      </motion.h3>

      {/* Audio Visualizer */}
      <motion.div 
        className="flex justify-center items-end h-20 mb-4 space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: showVisualizer ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {audioBars.map((bar) => (
          <motion.div
            key={bar.id}
            className="w-2 bg-gradient-to-t from-purple-400 to-pink-400 rounded-full"
            style={{ height: `${bar.height}px` }}
            animate={isPlaying ? {
              height: [bar.height, bar.height * 1.5, bar.height],
              opacity: [0.7, 1, 0.7],
            } : {}}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: bar.delay,
            }}
          />
        ))}
      </motion.div>

      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <motion.button
          onClick={togglePlay}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg transform transition-all ${
            isPlaying 
              ? 'bg-gradient-to-r from-red-400 to-red-600 text-white' 
              : 'bg-gradient-to-r from-green-400 to-green-600 text-white'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isPlaying ? { 
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </motion.button>

        <motion.button
          onClick={speakText}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white flex items-center justify-center text-lg shadow-lg"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          🔊
        </motion.button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <motion.div 
          className="relative h-3 bg-gray-200 rounded-full overflow-hidden"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
            animate={{ 
              background: isPlaying 
                ? ['linear-gradient(90deg, #8B5CF6, #EC4899)', 'linear-gradient(90deg, #EC4899, #8B5CF6)']
                : 'linear-gradient(90deg, #8B5CF6, #EC4899)'
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </motion.div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-gray-600">🔊</span>
        <motion.div 
          className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
            style={{ width: `${volume * 100}%` }}
            animate={{ 
              background: isPlaying 
                ? ['linear-gradient(90deg, #10B981, #3B82F6)', 'linear-gradient(90deg, #3B82F6, #10B981)']
                : 'linear-gradient(90deg, #10B981, #3B82F6)'
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </motion.div>
        <span className="text-gray-600 text-sm">{Math.round(volume * 100)}%</span>
      </div>

      {/* Text Display */}
      <motion.div 
        className="bg-white rounded-2xl p-4 shadow-lg border-2 border-blue-200"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.p 
          className="text-center text-gray-700 font-medium"
          animate={isPlaying ? { 
            color: ['#374151', '#8B5CF6', '#374151']
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          "{text}"
        </motion.p>
      </motion.div>

      {/* Fun Status Indicator */}
      <motion.div 
        className="text-center mt-4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-sm text-gray-500">
          {isPlaying ? '🎵 Playing...' : '⏸️ Paused'}
        </span>
      </motion.div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </motion.div>
  );
} 