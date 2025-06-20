
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { loadingDiagnosticService } from './services/diagnostics/LoadingDiagnosticService'

// Start diagnostic tracking immediately
loadingDiagnosticService.startStage('Application Bootstrap', {
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent,
  viewport: `${window.innerWidth}x${window.innerHeight}`,
  connection: (navigator as any).connection?.effectiveType || 'unknown'
});

// Performance monitoring
if (process.env.NODE_ENV === 'development') {
  // Monitor Core Web Vitals with diagnostic integration
  import('web-vitals').then((webVitals) => {
    webVitals.onCLS((metric) => {
      console.log('CLS:', metric);
      loadingDiagnosticService.recordMetric('CLS', metric.value, 'render');
    });
    
    webVitals.onFCP((metric) => {
      console.log('FCP:', metric);
      loadingDiagnosticService.recordMetric('FCP', metric.value, 'render');
    });
    
    webVitals.onLCP((metric) => {
      console.log('LCP:', metric);
      loadingDiagnosticService.recordMetric('LCP', metric.value, 'render');
    });
    
    webVitals.onTTFB((metric) => {
      console.log('TTFB:', metric);
      loadingDiagnosticService.recordMetric('TTFB', metric.value, 'network');
    });
    
    // Use INP instead of deprecated FID if available
    if (webVitals.onINP) {
      webVitals.onINP((metric) => {
        console.log('INP:', metric);
        loadingDiagnosticService.recordMetric('INP', metric.value, 'render');
      });
    }
  });
  
  // Log initial bundle information with diagnostics
  const bundleInfo = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    connection: (navigator as any).connection?.effectiveType || 'unknown'
  };
  
  console.log('📦 Bundle Analysis:', bundleInfo);
  loadingDiagnosticService.startStage('Bundle Analysis', bundleInfo);
}

// Track root creation and mounting
loadingDiagnosticService.startStage('React Root Creation');

const root = createRoot(document.getElementById("root")!);

loadingDiagnosticService.completeStage('React Root Creation');
loadingDiagnosticService.startStage('React App Mount');

root.render(<App />);

// Mark initial bootstrap as complete
setTimeout(() => {
  loadingDiagnosticService.completeStage('React App Mount');
  loadingDiagnosticService.completeStage('Application Bootstrap');
  
  if (process.env.NODE_ENV === 'development') {
    loadingDiagnosticService.completeStage('Bundle Analysis');
    
    // Generate initial report after a delay
    setTimeout(() => {
      const report = loadingDiagnosticService.generateReport();
      console.log('📋 Initial Performance Report:', report);
    }, 2000);
  }
}, 100);
