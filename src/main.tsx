import { createRoot } from 'react-dom/client'
import './index.css'

// Dynamically import App and performance monitoring to reduce initial bundle
const loadApp = async () => {
  const [{ default: App }, { initializePerformanceMonitoring }] = await Promise.all([
    import('./App.tsx'),
    import('@/utils/performanceOptimization')
  ]);
  
  // Initialize performance monitoring after app loads
  initializePerformanceMonitoring();
  
  return App;
};

// Render app with dynamic loading
loadApp().then(App => {
  createRoot(document.getElementById("root")!).render(<App />);
});