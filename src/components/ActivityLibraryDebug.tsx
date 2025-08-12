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
  return;
};
export default ActivityLibraryDebug;