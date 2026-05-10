import { createContext, useCallback, useMemo, useState } from 'react';
import logger from '../utils/logger';

const MODULE = 'BlogContext';

export const BlogContext = createContext(null);

export const BlogProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const resetFilters = useCallback(() => {
    logger.debug(MODULE, 'Resetting blog filters');
    setSearchQuery('');
    setActiveTag('');
    setCurrentPage(0);
  }, []);

  const applySearch = useCallback((q) => {
    logger.debug(MODULE, `Search changed: "${q}"`);
    setSearchQuery(q);
    setCurrentPage(0);
  }, []);

  const applyTag = useCallback((tag) => {
    logger.debug(MODULE, `Tag filter changed: "${tag}"`);
    setActiveTag(tag);
    setCurrentPage(0);
  }, []);

  const value = useMemo(
    () => ({
      searchQuery,
      activeTag,
      currentPage,
      setCurrentPage,
      applySearch,
      applyTag,
      resetFilters,
    }),
    [searchQuery, activeTag, currentPage, applySearch, applyTag, resetFilters]
  );

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};
