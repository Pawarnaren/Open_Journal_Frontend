import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import logger from '../utils/logger';

const MODULE = 'RouteLogger';

/**
 * Logs every navigation path change.
 * Must be rendered inside <BrowserRouter>.
 */
const RouteLogger = () => {
  const location = useLocation();

  useEffect(() => {
    logger.info(MODULE, `Navigation → ${location.pathname}${location.search}`);
  }, [location]);

  return null;
};

export default RouteLogger;
