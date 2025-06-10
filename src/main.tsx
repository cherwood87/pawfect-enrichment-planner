
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Performance monitoring
if (process.env.NODE_ENV === 'development') {
  // Monitor Core Web Vitals with correct import syntax
  import('web-vitals').then((webVitals) => {
    webVitals.onCLS(console.log);
    webVitals.onFID?.(console.log); // FID is deprecated, so make it optional
    webVitals.onFCP(console.log);
    webVitals.onLCP(console.log);
    webVitals.onTTFB(console.log);
  });
  
  // Log initial bundle information
  console.log('📦 Bundle Analysis:', {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    connection: (navigator as any).connection?.effectiveType || 'unknown'
  });
}

createRoot(document.getElementById("root")!).render(<App />);
