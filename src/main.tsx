import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { logger } from '@/utils/logger'

// Initialize performance monitoring in development
if (import.meta.env.DEV) {
  logger.info('Development mode: Performance monitoring enabled');
  
  // Monitor navigation timing
  window.addEventListener('load', () => {
    setTimeout(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (nav) {
        logger.info('Navigation timing', {
          domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.fetchStart),
          loadComplete: Math.round(nav.loadEventEnd - nav.fetchStart),
          ttfb: Math.round(nav.responseStart - nav.requestStart)
        });
      }
    }, 1000);
  });
}

createRoot(document.getElementById("root")!).render(<App />);