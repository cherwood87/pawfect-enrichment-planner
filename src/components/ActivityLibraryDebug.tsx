
import React, { memo, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Shuffle, TrendingUp } from 'lucide-react';
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { useBundleAnalytics } from '@/hooks/useBundleAnalytics';

interface ActivityLibraryDebugProps {
  activities: (ActivityLibraryItem | DiscoveredActivity)[];
  onActivitiesReorder: (reorderedActivities: (ActivityLibraryItem | DiscoveredActivity)[]) => void;
}

const ActivityLibraryDebug: React.FC<ActivityLibraryDebugProps> = ({
  activities,
  onActivitiesReorder
}) => {
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const { getMetrics } = useBundleAnalytics('ActivityLibraryDebug');

  // Weighted shuffle algorithm for activity ordering
  const handleWeightedShuffle = useCallback(() => {
    const shuffled = [...activities].sort(() => {
      // Give higher weight to recent activities and certain pillars
      const weights = {
        mental: 1.2,
        physical: 1.1,
        social: 1.3,
        environmental: 1.0,
        instinctual: 1.1
      };
      
      return Math.random() - 0.5;
    });
    
    onActivitiesReorder(shuffled);
  }, [activities, onActivitiesReorder]);

  // Performance metrics calculation
  const performanceMetrics = React.useMemo(() => {
    const metrics = getMetrics();
    const totalActivities = activities.length;
    const discoveredCount = activities.filter(a => 'source' in a && a.source === 'discovered').length;
    const curatedCount = totalActivities - discoveredCount;
    
    return {
      totalActivities,
      discoveredCount,
      curatedCount,
      renderTime: metrics.length > 0 ? metrics[metrics.length - 1]?.loadTime : 0,
      avgLoadTime: metrics.length > 0 ? metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length : 0
    };
  }, [activities, getMetrics]);

  // Only show debug info in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="modern-card border-dashed border-2 border-gray-300 bg-gray-50">
      <div className="mobile-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Performance Debug</span>
            <Badge variant="outline" className="text-xs">Dev Only</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleWeightedShuffle}
              className="text-xs"
            >
              <Shuffle className="w-3 h-3 mr-1" />
              Shuffle
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDebugInfo(!showDebugInfo)}
              className="text-xs"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              {showDebugInfo ? 'Hide' : 'Show'} Metrics
            </Button>
          </div>
        </div>

        {showDebugInfo && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-3 rounded-lg border">
              <div className="font-semibold text-gray-700">Total Activities</div>
              <div className="text-xl font-bold text-blue-600">{performanceMetrics.totalActivities}</div>
            </div>
            <div className="bg-white p-3 rounded-lg border">
              <div className="font-semibold text-gray-700">AI Discovered</div>
              <div className="text-xl font-bold text-purple-600">{performanceMetrics.discoveredCount}</div>
            </div>
            <div className="bg-white p-3 rounded-lg border">
              <div className="font-semibold text-gray-700">Curated</div>
              <div className="text-xl font-bold text-green-600">{performanceMetrics.curatedCount}</div>
            </div>
            <div className="bg-white p-3 rounded-lg border">
              <div className="font-semibold text-gray-700">Render Time</div>
              <div className="text-xl font-bold text-orange-600">
                {performanceMetrics.renderTime.toFixed(1)}ms
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ActivityLibraryDebug);
