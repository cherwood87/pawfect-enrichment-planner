
import { useEffect, useState } from 'react';

interface BundleStats {
  totalSize: number;
  loadedChunks: string[];
  pendingChunks: string[];
  loadTime: number;
}

export const useBundleSize = () => {
  const [stats, setStats] = useState<BundleStats>({
    totalSize: 0,
    loadedChunks: [],
    pendingChunks: [],
    loadTime: 0
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const startTime = performance.now();

    // Monitor chunk loading
    const observeChunks = () => {
      const scripts = Array.from(document.querySelectorAll('script[src*="chunk"]')) as HTMLScriptElement[];
      const loadedChunks = scripts.map(script => script.src);

      const totalSize = scripts.reduce((total, script) => {
        const src = script.src;
        // Estimate size based on URL or use performance API
        return total + (src.length * 100); // Rough estimation
      }, 0);

      setStats({
        totalSize,
        loadedChunks,
        pendingChunks: [], // Simplified - just track loaded chunks
        loadTime: performance.now() - startTime
      });
    };

    // Initial check
    observeChunks();

    // Monitor for new chunks
    const observer = new MutationObserver(observeChunks);
    observer.observe(document.head, {
      childList: true,
      subtree: true
    });

    // Performance observer for resource timing
    if ('PerformanceObserver' in window) {
      const perfObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name.includes('chunk') && entry.entryType === 'resource') {
            console.log(`📦 Chunk loaded: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
          }
        });
      });

      perfObserver.observe({ entryTypes: ['resource'] });

      return () => {
        observer.disconnect();
        perfObserver.disconnect();
      };
    }

    return () => observer.disconnect();
  }, []);

  return stats;
};
