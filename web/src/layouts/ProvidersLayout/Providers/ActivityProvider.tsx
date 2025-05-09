import { createContext, ReactNode, useContext, useState } from 'react';

const ActivtyProviderContext = createContext({
  isActivityModalOpen: false,
  setActivityModalOpen: (_isOpen: boolean) => {},

  isActivityTimerModalOpen: false,
  setActivityTimerModalOpen: (_isOpen: boolean) => {},

  isActiveTimerModalOpen: false,
  setActiveTimerModalOpen: (_isOpen: boolean) => {},
});

const useActivityModal = () => {
  const context = useContext(ActivtyProviderContext);
  if (!context) {
    throw new Error('useActivityModal must be used within an ActivityProvider');
  }
  return context;
};

const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const [isActivityModalOpen, setActivityModalOpen] = useState(false);
  const [isActivityTimerModalOpen, setActivityTimerModalOpen] = useState(false);
  const [isActiveTimerModalOpen, setActiveTimerModalOpen] = useState(false);

  return (
    <ActivtyProviderContext.Provider
      value={{
        isActivityModalOpen,
        setActivityModalOpen,
        isActivityTimerModalOpen,
        setActivityTimerModalOpen,
        isActiveTimerModalOpen,
        setActiveTimerModalOpen,
      }}
    >
      {children}
    </ActivtyProviderContext.Provider>
  );
};

export { ActivityProvider, useActivityModal };
