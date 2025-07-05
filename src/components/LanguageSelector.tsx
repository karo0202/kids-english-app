import React, { useState, useEffect } from 'react';
import './LanguageSelector.css';

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English (US)', flag: '🇺🇸', desc: 'Learn English words and songs!' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', desc: 'تعلم كلمات وأغاني عربية!' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', desc: '¡Aprende palabras y canciones en español!' },
  { code: 'ku', name: 'Kurdish', native: 'کوردی', flag: '🇮🇶', desc: 'فێربوونی وشە و گۆرانی بە کوردی!' },
];

function playSelectSound() {
  // Optional: add a sound file to public/sounds/select.mp3
  // new Audio('/sounds/select.mp3').play();
}

type LanguageSelectorProps = {
  view?: 'fullscreen' | 'grid' | 'list';
  onSelect?: (lang: string) => void;
  selectedLanguage?: string;
};

export default function LanguageSelector({ view = 'fullscreen', onSelect, selectedLanguage }: LanguageSelectorProps) {
  const [selected, setSelected] = useState<string>(selectedLanguage || '');

  useEffect(() => {
    // Auto-detect device language on first load
    if (!selected) {
      const detected = navigator.language.slice(0, 2);
      const found = LANGUAGES.find(l => l.code === detected);
      setSelected(found ? found.code : 'en');
    }
  }, [selected]);

  useEffect(() => {
    if (selected) {
      localStorage.setItem('language', selected);
      if (onSelect) onSelect(selected);
      playSelectSound();
    }
  }, [selected, onSelect]);

  const handleSelect = (code: string) => setSelected(code);

  if (view === 'list') {
    return (
      <div className="language-list bg-pastel p-4 rounded-2xl max-w-md mx-auto font-kid">
        {LANGUAGES.map(lang => (
          <div
            key={lang.code}
            className={`language-list-item ${selected === lang.code ? 'selected' : ''}`}
            onClick={() => handleSelect(lang.code)}
            tabIndex={0}
            role="button"
          >
            <span className="flag">{lang.flag}</span>
            <span className="lang-names">
              <span className="lang-en">{lang.name}</span>
              <span className="lang-native">({lang.native})</span>
            </span>
            <span className="desc">{lang.desc}</span>
          </div>
        ))}
      </div>
    );
  }

  // Grid and fullscreen grid
  const gridClass = view === 'fullscreen' ? 'language-grid-fullscreen' : 'language-grid';
  return (
    <div className={`${gridClass} bg-pastel p-6 rounded-3xl grid grid-cols-2 gap-6 max-w-lg mx-auto font-kid`} style={view === 'fullscreen' ? { minHeight: '100vh', alignItems: 'center', justifyItems: 'center' } : {}}>
      {LANGUAGES.map(lang => (
        <button
          key={lang.code}
          className={`language-btn ${selected === lang.code ? 'selected' : ''}`}
          onClick={() => handleSelect(lang.code)}
          style={view === 'fullscreen' ? { fontSize: '2rem', minHeight: '120px' } : {}}
        >
          <span className="flag text-3xl">{lang.flag}</span>
          <span className="lang-en">{lang.name}</span>
          <span className="lang-native text-xs block">{lang.native}</span>
          {view === 'fullscreen' && <span className="desc block mt-2">{lang.desc}</span>}
        </button>
      ))}
    </div>
  );
} 