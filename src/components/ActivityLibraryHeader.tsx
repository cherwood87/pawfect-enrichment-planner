
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, CheckCircle } from 'lucide-react';

interface ActivityLibraryHeaderProps {
  autoApprovedCount: number;
  isDiscovering: boolean;
  onDiscoverMore: () => void;
}

const ActivityLibraryHeader: React.FC<ActivityLibraryHeaderProps> = ({
  autoApprovedCount,
  isDiscovering,
  onDiscoverMore
}) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold text-gray-800">Activity Library</CardTitle>
          <p className="text-gray-600">
            Discover enriching activities for your dog across all five pillars of wellness
            {autoApprovedCount > 0 && (
              <span className="ml-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                {autoApprovedCount} activities auto-added from discovery
              </span>
            )}
          </p>
        </div>
        <Button 
          onClick={onDiscoverMore}
          disabled={isDiscovering}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          {isDiscovering ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Discovering...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Discover More
            </>
          )}
        </Button>
      </div>
      {isDiscovering && (
        <div className="mt-2 text-sm text-blue-600">
          <div className="flex items-center space-x-2">
            <div className="animate-pulse">🔍</div>
            <span>Searching for new activities from trusted sources...</span>
          </div>
        </div>
      )}
    </CardHeader>
  );
};

export default ActivityLibraryHeader;
