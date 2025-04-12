import { createContext, ReactNode, useContext, useState } from 'react';

const useHomeContext = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHomeContext must be used within a HomeProvider');
  }
  return context;
};

const HomeContext = createContext({
  selectedLanguage: null,
  setSelectedLanguage: (_language: number | null) => {},
});

const HomeProvider = ({ children }: { children: ReactNode }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<number | null>(null);

  return (
    <HomeContext.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      {children}
    </HomeContext.Provider>
  );
};

export { HomeProvider, useHomeContext };
