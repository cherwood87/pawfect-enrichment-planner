
import React from 'react';
import BrowseLibraryTabOptimized from './BrowseLibraryTabOptimized';

interface BrowseLibraryTabProps {
  selectedPillar?: string | null;
  filteredLibraryActivities: any[];
  onActivitySelect: (activity: any) => void;
}

// This is now just a wrapper that delegates to the optimized version
const BrowseLibraryTab: React.FC<BrowseLibraryTabProps> = (props) => {
  return <BrowseLibraryTabOptimized {...props} />;
};

export default BrowseLibraryTab;
