import { createContext, useCallback, useMemo, useState } from 'react';
import logger from '../utils/logger';

const MODULE = 'JournalContext';

export const JournalContext = createContext(null);

export const JournalProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeMood, setActiveMood] = useState('');

  const applyMood = useCallback((mood) => {
    logger.debug(MODULE, `Mood filter: "${mood}"`);
    setActiveMood(mood);
    setCurrentPage(0);
  }, []);

  const value = useMemo(
    () => ({ currentPage, setCurrentPage, activeMood, applyMood }),
    [currentPage, activeMood, applyMood]
  );

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
};
