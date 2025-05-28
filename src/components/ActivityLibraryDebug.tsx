
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shuffle } from 'lucide-react';
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
  const [lastShuffle, setLastShuffle] = useState<Date | null>(null);

  const handleReshuffle = () => {
    const reshuffled = weightedShuffle([...activities]);
    onActivitiesReorder(reshuffled);
    setLastShuffle(new Date());
  };

  const debugData = debugActivityWeights(activities);
  const discoveredCount = debugData.filter(d => d.type === 'discovered').length;
  const libraryCount = debugData.filter(d => d.type === 'library').length;

  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl p-4 border border-purple-200">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-2 rounded-xl">
          <Shuffle className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-semibold text-purple-800">Smart Activity Ordering</p>
          <p className="text-sm text-purple-600">
            {discoveredCount} discovered • {libraryCount} curated
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
      </div>
    </div>
  );
};

export default ActivityLibraryDebug;
