
import React, { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Search, Filter, Sync } from 'lucide-react';
import { useBundleAnalytics } from '@/hooks/useBundleAnalytics';

interface ActivityLibraryContentProps {
  autoApprovedCount: number;
  isDiscovering: boolean;
  onDiscoverMore: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPillar: string;
  setSelectedPillar: (pillar: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
  filteredActivitiesCount: number;
  curatedCount: number;
  onManualSync?: () => Promise<void>;
  isSyncing?: boolean;
  lastSyncTime?: Date | null;
}

const ActivityLibraryContent: React.FC<ActivityLibraryContentProps> = ({
  autoApprovedCount,
  isDiscovering,
  onDiscoverMore,
  searchQuery,
  setSearchQuery,
  selectedPillar,
  setSelectedPillar,
  selectedDifficulty,
  setSelectedDifficulty,
  filteredActivitiesCount,
  curatedCount,
  onManualSync,
  isSyncing = false,
  lastSyncTime
}) => {
  const { getMetrics } = useBundleAnalytics('ActivityLibraryContent');

  // Memoized handlers to prevent re-renders
  const handleDiscoverMore = useCallback(async () => {
    if (!isDiscovering) {
      await onDiscoverMore();
    }
  }, [isDiscovering, onDiscoverMore]);

  const handleManualSync = useCallback(async () => {
    if (!isSyncing && onManualSync) {
      await onManualSync();
    }
  }, [isSyncing, onManualSync]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, [setSearchQuery]);

  const formatLastSyncTime = (date: Date | null) => {
    if (!date) return 'Never';
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* AI Discovery Section */}
      <div className="modern-card bg-gradient-to-r from-purple-50 via-cyan-50 to-amber-50 border-2 border-purple-200">
        <div className="mobile-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-800">AI-Discovered Activities</h3>
                <p className="text-sm text-purple-600">
                  {autoApprovedCount} activities auto-approved • {curatedCount} curated activities
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {onManualSync && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="modern-button-outline"
                >
                  <Sync className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync'}
                </Button>
              )}
              <Button 
                onClick={handleDiscoverMore}
                disabled={isDiscovering}
                className="modern-button"
              >
                <Sparkles className={`w-4 h-4 mr-2 ${isDiscovering ? 'animate-spin' : ''}`} />
                {isDiscovering ? 'Discovering...' : 'Discover More'}
              </Button>
            </div>
          </div>
          
          {lastSyncTime && (
            <div className="mt-3 text-xs text-purple-600">
              Last sync: {formatLastSyncTime(lastSyncTime)}
            </div>
          )}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="modern-card">
        <div className="mobile-card space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-gray-800">Search & Filter</h3>
            <Badge variant="secondary" className="text-xs">
              {filteredActivitiesCount} activities
            </Badge>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 modern-input"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Pillar</label>
              <Select value={selectedPillar} onValueChange={setSelectedPillar}>
                <SelectTrigger className="modern-select">
                  <SelectValue placeholder="All Pillars" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pillars</SelectItem>
                  <SelectItem value="mental">Mental</SelectItem>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="environmental">Environmental</SelectItem>
                  <SelectItem value="instinctual">Instinctual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="modern-select">
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedPillar !== 'all' || selectedDifficulty !== 'all' || searchQuery) && (
            <div className="flex flex-wrap gap-2 items-center">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="text-xs">
                  Search: "{searchQuery}"
                </Badge>
              )}
              {selectedPillar !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Pillar: {selectedPillar}
                </Badge>
              )}
              {selectedDifficulty !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Difficulty: {selectedDifficulty}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ActivityLibraryContent);
