import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavigationState {
  fromRoute?: string;
  returnTo?: string;
  activityModalState?: {
    selectedPillar?: string | null;
    selectedDay?: number;
    activeTab?: string;
  };
  preserveModalState?: boolean;
}

/**
 * Hook to manage navigation state persistence across routes
 * Fixes modal state persistence and ensures proper navigation flows
 */
export const useNavigationState = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [navigationState, setNavigationState] = useState<NavigationState>({});

  // Preserve navigation state in sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('navigationState');
    if (stored) {
      try {
        setNavigationState(JSON.parse(stored));
      } catch (e) {
        console.warn('Failed to parse navigation state:', e);
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('navigationState', JSON.stringify(navigationState));
  }, [navigationState]);

  const updateNavigationState = useCallback((updates: Partial<NavigationState>) => {
    setNavigationState(prev => ({ ...prev, ...updates }));
  }, []);

  const navigateWithState = useCallback((
    to: string, 
    state?: Record<string, any>,
    preserveModal = false
  ) => {
    updateNavigationState({
      fromRoute: location.pathname,
      preserveModalState: preserveModal,
      ...state
    });
    navigate(to);
  }, [location.pathname, navigate, updateNavigationState]);

  const navigateBack = useCallback(() => {
    const returnTo = navigationState.returnTo || '/';
    updateNavigationState({ returnTo: undefined });
    navigate(returnTo);
  }, [navigationState.returnTo, navigate, updateNavigationState]);

  const clearNavigationState = useCallback(() => {
    setNavigationState({});
    sessionStorage.removeItem('navigationState');
  }, []);

  return {
    navigationState,
    updateNavigationState,
    navigateWithState,
    navigateBack,
    clearNavigationState
  };
};