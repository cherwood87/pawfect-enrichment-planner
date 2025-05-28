
import React, { createContext, useContext } from 'react';
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity, ContentDiscoveryConfig } from '@/types/discovery';
import { useDog } from '@/contexts/DogContext';
import { useDiscoveryOperations } from '@/hooks/useDiscoveryOperations';
import { useActivityState } from './ActivityStateContext';

interface DiscoveryContextType {
  isDiscovering: boolean;
  getCombinedActivityLibrary: () => (ActivityLibraryItem | DiscoveredActivity)[];
  discoverNewActivities: () => Promise<void>;
  approveDiscoveredActivity: (activityId: string) => void;
  rejectDiscoveredActivity: (activityId: string) => void;
  updateDiscoveryConfig: (config: Partial<ContentDiscoveryConfig>) => void;
  checkAndRunAutoDiscovery?: () => Promise<void>;
}

const DiscoveryContext = createContext<DiscoveryContextType | undefined>(undefined);

export const useDiscovery = () => {
  const context = useContext(DiscoveryContext);
  if (!context) {
    throw new Error('useDiscovery must be used within a DiscoveryProvider');
  }
  return context;
};

export const DiscoveryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentDog } = useDog();
  const {
    discoveredActivities,
    discoveryConfig,
    setDiscoveredActivities,
    setDiscoveryConfig
  } = useActivityState();

  // Discovery operations hook
  const discoveryOps = useDiscoveryOperations(
    discoveredActivities,
    setDiscoveredActivities,
    discoveryConfig,
    setDiscoveryConfig,
    currentDog
  );

  const value: DiscoveryContextType = {
    isDiscovering: discoveryOps.isDiscovering,
    getCombinedActivityLibrary: discoveryOps.getCombinedActivityLibrary,
    discoverNewActivities: discoveryOps.discoverNewActivities,
    approveDiscoveredActivity: discoveryOps.approveDiscoveredActivity,
    rejectDiscoveredActivity: discoveryOps.rejectDiscoveredActivity,
    updateDiscoveryConfig: discoveryOps.updateDiscoveryConfig,
    checkAndRunAutoDiscovery: discoveryOps.checkAndRunAutoDiscovery
  };

  return (
    <DiscoveryContext.Provider value={value}>
      {children}
    </DiscoveryContext.Provider>
  );
};
