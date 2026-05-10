import { useEffect, useState } from 'react';

/**
 * Debounces a value by `delay` ms.
 * Used to throttle search API calls.
 * @param {any} value
 * @param {number} [delay=350]
 */
const useDebounce = (value, delay = 350) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export default useDebounce;
