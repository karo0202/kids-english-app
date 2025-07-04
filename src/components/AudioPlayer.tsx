import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface AudioPlayerProps {
  audioType: 'story' | 'song' | 'words';
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
}

export default function AudioPlayer({ audioType, onPlay, onPause, onEnd }: AudioPlayerProps) {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sample audio data (in a real app, these would be actual audio files)
  const audioData = {
    story: {
      url: '#', // Placeholder for actual audio file
      title: t('playStory'),
      icon: '📖'
    },
    song: {
      url: '#', // Placeholder for actual audio file
      title: t('playSong'),
      icon: '🎵'
    },
    words: {
      url: '#', // Placeholder for actual audio file
      title: t('hearWords'),
      icon: '🔊'
    }
  };

  const currentAudio = audioData[audioType];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        onPause?.();
      } else {
        // Simulate audio playback for demo purposes
        setIsPlaying(true);
        onPlay?.();
        
        // Simulate audio duration and progress
        setDuration(30); // 30 seconds
        const interval = setInterval(() => {
          setCurrentTime(prev => {
            if (prev >= 30) {
              clearInterval(interval);
              setIsPlaying(false);
              setCurrentTime(0);
              onEnd?.();
              return 0;
            }
            return prev + 1;
          });
        }, 1000);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{currentAudio.icon}</span>
          <span className="font-semibold">{currentAudio.title}</span>
        </div>
        <button
          onClick={togglePlay}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-all ${
            isPlaying 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #e5e7eb ${(currentTime / duration) * 100}%, #e5e7eb 100%)`
          }}
        />
      </div>

      {/* Time Display */}
      <div className="flex justify-between text-sm text-gray-500">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Audio Element (hidden) */}
      <audio
        ref={audioRef}
        src={currentAudio.url}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
          onEnd?.();
        }}
        style={{ display: 'none' }}
      />

      {/* Demo Notice */}
      <div className="mt-3 text-xs text-gray-400 text-center">
        🎵 Demo mode - Audio files coming soon!
      </div>
    </div>
  );
} 