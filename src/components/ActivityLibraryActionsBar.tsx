import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Rocket, Shuffle } from 'lucide-react';

interface ActivityLibraryActionsBarProps {
  onChooseForMe: () => void;
  onDiscoverNew: () => void;
  onShuffle: () => void;
  canChoose: boolean;
  isDiscovering: boolean;
}

const ActivityLibraryActionsBar: React.FC<ActivityLibraryActionsBarProps> = ({
  onChooseForMe,
  onDiscoverNew,
  onShuffle,
  canChoose,
  isDiscovering
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Button onClick={onChooseForMe} disabled={!canChoose} className="h-12">
        <Sparkles className="mr-2 h-5 w-5" />
        Choose For Me
      </Button>
      <Button onClick={onDiscoverNew} disabled={isDiscovering} variant="secondary" className="h-12">
        <Rocket className="mr-2 h-5 w-5" />
        {isDiscovering ? 'Discovering…' : 'Discover New'}
      </Button>
      <Button onClick={onShuffle} variant="outline" className="h-12">
        <Shuffle className="mr-2 h-5 w-5" />
        Shuffle Library
      </Button>
    </div>
  );
};

export default ActivityLibraryActionsBar;
