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
  return <div className="modern-card p-4 mb-4 bg-amber-50 border border-amber-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-amber-800">Activity Library</h3>
        <Button onClick={handleReshuffle} variant="outline" size="sm" className="bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200">
          <Shuffle className="w-4 h-4 mr-2" />
          Reshuffle
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-white p-3 rounded-lg border border-amber-200">
          <p className="font-medium text-amber-800">Library Activities</p>
          <p className="text-lg font-bold text-amber-700">{libraryCount}</p>
        </div>
        <div className="bg-white p-3 rounded-lg border border-amber-200">
          <p className="font-medium text-amber-800">Discovered Activities</p>
          <p className="text-lg font-bold text-amber-700">{discoveredCount}</p>
        </div>
      </div>
      
      {lastShuffle && <p className="text-xs text-amber-600 mt-2">
          Last shuffled: {lastShuffle.toLocaleTimeString()}
        </p>}
    </div>;
};
export default ActivityLibraryDebug;