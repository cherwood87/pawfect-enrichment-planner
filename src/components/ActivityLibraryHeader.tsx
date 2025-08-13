
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, CheckCircle, Brain } from 'lucide-react';

interface ActivityLibraryHeaderProps {
  autoApprovedCount: number;
  curatedCount: number;
  isDiscovering: boolean;
  onDiscoverMore: () => void;
  onChooseForMe?: () => void;
  canPickSuggested?: boolean;
}

const ActivityLibraryHeader: React.FC<ActivityLibraryHeaderProps> = ({
  autoApprovedCount,
  curatedCount,
  isDiscovering,
  onDiscoverMore,
  onChooseForMe,
  canPickSuggested
}) => {
  return (
    <CardHeader className="bg-gradient-to-r from-purple-50 via-cyan-50 to-amber-50 border-b-2 border-purple-200 rounded-t-3xl">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <CardTitle className="text-xl font-bold text-purple-800 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span>Activity Library</span>
          </CardTitle>
          <div className="space-y-1">
            <p className="text-purple-600 font-medium">
              Discover curated enriching activities across all five pillars — personalized to your dog
            </p>
            <div className="flex items-center flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <div className="bg-emerald-100 rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm text-emerald-700 font-semibold">
                  Community Discovered: {autoApprovedCount}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-purple-100 rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm text-purple-700 font-semibold">
                  Curated: {curatedCount}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-1 border border-purple-200 flex items-center gap-2">
          {onChooseForMe && (
            <Button
              onClick={onChooseForMe}
              disabled={!canPickSuggested}
              className="modern-button-outline shadow"
            >
              <Brain className="w-4 h-4 mr-2" />
              {canPickSuggested ? 'Choose For Me' : 'Choose For Me (needs quiz)'}
            </Button>
          )}
          <Button 
            onClick={onDiscoverMore}
            disabled={isDiscovering}
            className="modern-button-primary shadow-lg hover:shadow-xl"
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
      </div>
      
      {isDiscovering && (
        <div className="mt-4 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
            <span className="text-sm text-purple-700 font-medium">
              Analyzing your dog's profile and discovering personalized activities...
            </span>
          </div>
        </div>
      )}
    </CardHeader>
  );
};

export default ActivityLibraryHeader;
