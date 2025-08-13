import { useState, useEffect, useCallback } from 'react';
import { useNavigationState } from './useNavigationState';

interface ActivityModalState {
  selectedPillar?: string | null;
  selectedDay?: number;
  activeTab?: string;
  isOpen?: boolean;
}

/**
 * Hook to manage activity modal state persistence across navigation
 * Ensures modals maintain their state when users navigate between pages
 */
export const useActivityModalPersistence = () => {
  const { navigationState, updateNavigationState } = useNavigationState();
  const [modalState, setModalState] = useState<ActivityModalState>({
    selectedPillar: null,
    selectedDay: undefined,
    activeTab: 'browse',
    isOpen: false
  });

  // Restore modal state from navigation state
  useEffect(() => {
    if (navigationState.preserveModalState && navigationState.activityModalState) {
      setModalState(prev => ({
        ...prev,
        ...navigationState.activityModalState
      }));
    }
  }, [navigationState.preserveModalState, navigationState.activityModalState]);

  const openModal = useCallback((
    pillar?: string | null,
    day?: number,
    tab = 'browse'
  ) => {
    const newState = {
      selectedPillar: pillar,
      selectedDay: day,
      activeTab: tab,
      isOpen: true
    };
    
    setModalState(newState);
    
    // Persist in navigation state for cross-page navigation
    updateNavigationState({
      activityModalState: newState,
      preserveModalState: true
    });
  }, [updateNavigationState]);

  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
    updateNavigationState({
      activityModalState: undefined,
      preserveModalState: false
    });
  }, [updateNavigationState]);

  const updateModalState = useCallback((updates: Partial<ActivityModalState>) => {
    setModalState(prev => {
      const newState = { ...prev, ...updates };
      
      // Persist updates in navigation state
      updateNavigationState({
        activityModalState: newState
      });
      
      return newState;
    });
  }, [updateNavigationState]);

  return {
    modalState,
    openModal,
    closeModal,
    updateModalState
  };
};