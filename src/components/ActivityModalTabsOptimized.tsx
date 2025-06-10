
import React, { memo, useMemo, Suspense, lazy } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import TabManager from './activity-modal/TabManager';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { DiscoveredActivity } from '@/types/discovery';

// Lazy load tab content components
const BrowseLibraryTab = lazy(() => import('./BrowseLibraryTab'));
const CreateCustomTab = lazy(() => import('./CreateCustomTab'));
const DiscoveryReview = lazy(() => import('./DiscoveryReview'));

interface ActivityModalTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedPillar?: string | null;
  filteredLibraryActivities: any[];
  onActivitySelect: (activity: any) => void;
  pendingActivities: DiscoveredActivity[];
  discoveredActivities: DiscoveredActivity[];
  // Create Custom Tab props
  customTabProps: {
    activityName: string;
    setActivityName: (name: string) => void;
    pillar: string;
    setPillar: (pillar: string) => void;
    duration: string;
    setDuration: (duration: string) => void;
    materials: string;
    setMaterials: (materials: string) => void;
    instructions: string;
    setInstructions: (instructions: string) => void;
    description: string;
    setDescription: (description: string) => void;
    onCreateCustomActivity: () => void;
    onCancelCustomActivity: () => void;
  };
}

const TabLoader = () => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner size="md" />
  </div>
);

const ActivityModalTabsOptimized = memo<ActivityModalTabsProps>(({
  activeTab,
  onTabChange,
  selectedPillar,
  filteredLibraryActivities,
  onActivitySelect,
  pendingActivities,
  discoveredActivities,
  customTabProps
}) => {
  // Memoize tab props to prevent unnecessary re-renders
  const browseTabProps = useMemo(() => ({
    selectedPillar,
    filteredLibraryActivities,
    onActivitySelect
  }), [selectedPillar, filteredLibraryActivities, onActivitySelect]);

  const pendingActivitiesCount = useMemo(() => 
    pendingActivities.length, 
    [pendingActivities.length]
  );

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabManager 
        activeTab={activeTab}
        onTabChange={onTabChange}
        pendingActivitiesCount={pendingActivitiesCount}
      />
      
      <TabsContent value="browse">
        {activeTab === "browse" && (
          <Suspense fallback={<TabLoader />}>
            <BrowseLibraryTab {...browseTabProps} />
          </Suspense>
        )}
      </TabsContent>
      
      <TabsContent value="create">
        {activeTab === "create" && (
          <Suspense fallback={<TabLoader />}>
            <CreateCustomTab {...customTabProps} />
          </Suspense>
        )}
      </TabsContent>
      
      <TabsContent value="review">
        {activeTab === "review" && (
          <Suspense fallback={<TabLoader />}>
            <DiscoveryReview activities={discoveredActivities} />
          </Suspense>
        )}
      </TabsContent>
    </Tabs>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo optimization
  return (
    prevProps.activeTab === nextProps.activeTab &&
    prevProps.selectedPillar === nextProps.selectedPillar &&
    prevProps.filteredLibraryActivities.length === nextProps.filteredLibraryActivities.length &&
    prevProps.pendingActivities.length === nextProps.pendingActivities.length &&
    prevProps.discoveredActivities.length === nextProps.discoveredActivities.length &&
    JSON.stringify(prevProps.customTabProps) === JSON.stringify(nextProps.customTabProps)
  );
});

ActivityModalTabsOptimized.displayName = 'ActivityModalTabsOptimized';

export default ActivityModalTabsOptimized;
