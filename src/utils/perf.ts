// Lightweight performance helpers for instrumentation
export function time(label: string) {
  try {
    console.time(label);
  } catch {}
}

export function end(label: string) {
  try {
    console.timeEnd(label);
  } catch {}
}

export function observeLongTasks() {
  try {
    // Observe main-thread long tasks (>50ms)
    if (typeof PerformanceObserver !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // @ts-ignore - 'longtask' type
          const name = (entry as any).name || 'longtask';
          console.warn('⏳ Long task detected:', {
            name,
            duration: Math.round(entry.duration),
            startTime: Math.round(entry.startTime),
          });
        }
      });
      // @ts-ignore - 'longtask' entry type may not be in TS lib dom
      observer.observe({ type: 'longtask', buffered: true as any });
    }
  } catch {}
}

export function logNavigationTimings() {
  try {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (!nav) return;
    const timing = {
      dns: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
      tcp: Math.round(nav.connectEnd - nav.connectStart),
      tls: Math.round((nav.secureConnectionStart && nav.connectEnd && nav.connectStart) ? (nav.connectEnd - nav.secureConnectionStart) : 0),
      ttfb: Math.round(nav.responseStart - nav.requestStart),
      response: Math.round(nav.responseEnd - nav.responseStart),
      domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.fetchStart),
      loadEvent: Math.round(nav.loadEventEnd - nav.fetchStart),
    };
    console.info('🚦 Navigation timing (ms):', timing);
  } catch {}
}

export function logResourceSummary(filterSubstring = 'supabase.co') {
  try {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const filtered = entries.filter((e) => e.name.includes(filterSubstring));
    if (!filtered.length) return;
    const total = filtered.reduce((acc, e) => acc + e.duration, 0);
    const max = Math.max(...filtered.map((e) => e.duration));
    const avg = total / filtered.length;
    const top = [...filtered]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5)
      .map((e) => ({ name: e.name, duration: Math.round(e.duration), transferSize: (e as any).transferSize ?? undefined }));
    console.info(`📡 Resource summary for '${filterSubstring}':`, {
      count: filtered.length,
      avg: Math.round(avg),
      max: Math.round(max),
      top,
    });
  } catch {}
}

import { useEffect } from 'react';
export function useRenderTimer(label: string) {
  const start = typeof performance !== 'undefined' ? performance.now() : 0;
  useEffect(() => {
    if (typeof performance !== 'undefined') {
      const ms = performance.now() - start;
      console.info(`🎨 Render commit: ${label} in ${ms.toFixed(1)}ms`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
