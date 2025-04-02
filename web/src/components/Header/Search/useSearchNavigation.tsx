import { createContext, useContext, useState } from 'react';

import { navigate, routes } from '@redwoodjs/router';

const useSearchNavigation = () => {
  const context = useContext(SearchNavigationContext);
  if (!context) {
    throw new Error(
      'useSearchNavigation must be used within a SearchNavigationProvider'
    );
  }
  return context;
};

const SearchNavigationContext = createContext({
  selectedIndex: 0,
  setSelectedIndex: (_index: number) => {},
  open: false,
  setOpen: (_open: boolean) => {},
  handleSelect: (_params: { slug: string }) => {},
});

const SearchNavigationProvider = ({ children }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const handleSelect = ({ slug }: { slug: string }) => {
    setOpen(false);
    // Construct media ID by combining type and slug
    navigate(routes.media({ slug }));
  };

  return (
    <SearchNavigationContext.Provider
      value={{
        selectedIndex,
        setSelectedIndex,
        open,
        setOpen,
        handleSelect,
      }}
    >
      {children}
    </SearchNavigationContext.Provider>
  );
};

export { SearchNavigationProvider, useSearchNavigation };
