
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Shuffle } from 'lucide-react';
import { debugActivityWeights, weightedShuffle } from '@/utils/weightedShuffle';
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';

interface ActivityLibraryDebugProps {
  activities: (ActivityLibraryItem | DiscoveredActivity)[];
  onActivitiesReorder: (activities: (ActivityLibraryItem | DiscoveredActivity)[]) => void;
}

const ActivityLibraryDebug: React.FC<ActivityLibraryDebugProps> = ({
  activities,
  onActivitiesReorder
}) => {
  const [showDebug, setShowDebug] = useState(false);
  const [lastShuffle, setLastShuffle] = useState<Date | null>(null);

  const handleReshuffle = () => {
    const reshuffled = weightedShuffle([...activities]);
    onActivitiesReorder(reshuffled);
    setLastShuffle(new Date());
  };

  const debugData = debugActivityWeights(activities);
  const discoveredCount = debugData.filter(d => d.type === 'discovered').length;
  const libraryCount = debugData.filter(d => d.type === 'library').length;

  if (!showDebug) {
    return (
      <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl p-4 border border-purple-200">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-2 rounded-xl">
            <Shuffle className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-purple-800">Smart Activity Ordering</p>
            <p className="text-sm text-purple-600">
              {discoveredCount} AI-discovered • {libraryCount} curated
              {lastShuffle && (
                <span className="ml-2">• Last shuffled: {lastShuffle.toLocaleTimeString()}</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleReshuffle}>
            <Shuffle className="w-4 h-4 mr-2" />
            Reshuffle
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowDebug(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Debug
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-cyan-50 border-purple-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-purple-800 flex items-center space-x-2">
            <Shuffle className="w-5 h-5" />
            <span>Weighted Shuffling Debug</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowDebug(false)}>
            <EyeOff className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/60 rounded-xl p-3">
            <p className="text-sm font-semibold text-purple-700">AI-Discovered Activities</p>
            <p className="text-lg font-bold text-purple-800">{discoveredCount}</p>
            <p className="text-xs text-purple-600">3x weighted</p>
          </div>
          <div className="bg-white/60 rounded-xl p-3">
            <p className="text-sm font-semibold text-cyan-700">Curated Activities</p>
            <p className="text-lg font-bold text-cyan-800">{libraryCount}</p>
            <p className="text-xs text-cyan-600">1x weighted</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-purple-700">Activity Weights (Top 10):</p>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {debugData.slice(0, 10).map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-white/40 rounded-lg p-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant={item.type === 'discovered' ? 'default' : 'secondary'} className="text-xs">
                      {item.type}
                    </Badge>
                    {item.quality && (
                      <Badge variant="outline" className="text-xs">
                        {Math.round(item.quality * 100)}% quality
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-700 border border-purple-300">
                  {item.weight.toFixed(1)}x
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleReshuffle} className="w-full">
          <Shuffle className="w-4 h-4 mr-2" />
          Reshuffle Activities
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActivityLibraryDebug;
