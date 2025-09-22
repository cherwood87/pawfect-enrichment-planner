import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface RouteAnalyticsEvent {
  type: 'route_change';
  path: string;
  timestamp: number;
  referrer?: string;
  duration?: number;
}

class RouteAnalyticsService {
  private events: RouteAnalyticsEvent[] = [];
  private lastRouteChange: number = Date.now();
  private lastPath: string = '';

  trackRouteChange(path: string, referrer?: string) {
    const now = Date.now();
    const duration = this.lastPath ? now - this.lastRouteChange : undefined;

    const event: RouteAnalyticsEvent = {
      type: 'route_change',
      path,
      timestamp: now,
      referrer,
      duration
    };

    this.events.push(event);
    this.lastRouteChange = now;
    this.lastPath = path;

    // Log to console for development (in production, you'd send to analytics service)
    console.log('📊 Route Analytics:', {
      ...event,
      duration: duration ? `${Math.round(duration / 1000)}s` : 'N/A'
    });

    // Keep only last 100 events to prevent memory issues
    if (this.events.length > 100) {
      this.events = this.events.slice(-100);
    }
  }

  getEvents(): RouteAnalyticsEvent[] {
    return [...this.events];
  }

  getRouteStats() {
    const routes = this.events.reduce((acc, event) => {
      acc[event.path] = (acc[event.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalDuration = this.events
      .filter(e => e.duration)
      .reduce((sum, e) => sum + (e.duration || 0), 0);

    return {
      totalRouteChanges: this.events.length,
      uniqueRoutes: Object.keys(routes).length,
      mostVisitedRoute: Object.entries(routes).sort(([,a], [,b]) => b - a)[0],
      averageSessionDuration: this.events.length > 1 ? totalDuration / (this.events.length - 1) : 0,
      routeFrequency: routes
    };
  }
}

// Singleton instance
const routeAnalytics = new RouteAnalyticsService();

export const useRouteAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track route change with referrer (previous path)
    const referrer = routeAnalytics.getEvents().slice(-1)[0]?.path;
    routeAnalytics.trackRouteChange(location.pathname + location.search, referrer);
  }, [location.pathname, location.search]);

  return {
    getEvents: () => routeAnalytics.getEvents(),
    getStats: () => routeAnalytics.getRouteStats()
  };
};

export default useRouteAnalytics;
