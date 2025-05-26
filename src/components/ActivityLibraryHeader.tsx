
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, CheckCircle, Brain } from 'lucide-react';

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
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-500" />
            <span>Activity Library</span>
          </CardTitle>
          <p className="text-gray-600">
            Discover curated enriching activities personalized for your dog across all five pillars of wellness
            {autoApprovedCount > 0 && (
              <span className="ml-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                {autoApprovedCount} curated activities added
              </span>
            )}
          </p>
        </div>
        <Button 
          onClick={onDiscoverMore}
          disabled={isDiscovering}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          {isDiscovering ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Discovering...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Discover Activities
            </>
          )}
        </Button>
      </div>
      {isDiscovering && (
        <div className="mt-2 text-sm text-purple-600">
          <div className="flex items-center space-x-2">
            <div className="animate-pulse">🤖</div>
            <span>Analyzing your dog's profile and discovering personalized activities...</span>
          </div>
        </div>
      )}
    </CardHeader>
  );
};

export default ActivityLibraryHeader;
