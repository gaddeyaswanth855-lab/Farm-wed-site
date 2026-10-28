import { useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';

export function useSpeechSynthesis() {
  const { language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getLanguageCode = (lang: string) => {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'mr': return 'mr-IN';
      case 'te': return 'te-IN';
      case 'ta': return 'ta-IN';
      case 'kn': return 'kn-IN';
      default: return 'en-IN';
    }
  };

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    // Clean markdown symbols for natural voice readout
    const cleaned = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/\n+/g, ' ');

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = getLanguageCode(language);
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [language]);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    hasSupport: 'speechSynthesis' in window
  };
}
