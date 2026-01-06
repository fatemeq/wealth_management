import React, { createContext, useContext, useEffect, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  language: 'en' | 'fa';
  setLanguage: (lang: 'en' | 'fa') => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLang] = useState<'en' | 'fa'>(() => {
    return (localStorage.getItem('language') as 'en' | 'fa') || 'en';
  });

  const setLanguage = (lang: 'en' | 'fa') => {
    i18n.changeLanguage(lang);
    setLang(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    setLanguage(language); // initialize i18n and HTML dir
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
