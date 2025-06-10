
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Dog } from '@/types/dog';
import { EnhancedDogService } from '@/services/EnhancedDogService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLightweightMonitor } from '@/hooks/useLightweightMonitor';

interface DogState {
  dogs: Dog[];
  currentDogId: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  lastLoadTime: Date | null;
  cacheHit: boolean;
}

type DogAction =
  | { type: 'SET_DOGS'; payload: Dog[]; cacheHit?: boolean }
  | { type: 'ADD_DOG'; payload: Dog }
  | { type: 'UPDATE_DOG'; payload: Dog }
  | { type: 'DELETE_DOG'; payload: string }
  | { type: 'SET_CURRENT_DOG'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SYNCING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LAST_LOAD_TIME'; payload: Date | null };

interface DogContextType {
  state: DogState;
  currentDog: Dog | null;
  addDog: (dog: Omit<Dog, 'id' | 'dateAdded' | 'lastUpdated'>) => Promise<void>;
  updateDog: (dog: Dog) => Promise<void>;
  deleteDog: (id: string) => Promise<void>;
  setCurrentDog: (id: string) => void;
  refreshDogs: (forceRefresh?: boolean) => Promise<void>;
  getCacheStats: () => any;
}

const DogContext = createContext<DogContextType | undefined>(undefined);

const dogReducer = (state: DogState, action: DogAction): DogState => {
  switch (action.type) {
    case 'SET_DOGS':
      return { 
        ...state, 
        dogs: action.payload, 
        error: null,
        cacheHit: action.cacheHit || false,
        lastLoadTime: new Date()
      };
    case 'ADD_DOG':
      return { ...state, dogs: [action.payload, ...state.dogs], error: null };
    case 'UPDATE_DOG':
      return {
        ...state,
        dogs: state.dogs.map(dog =>
          dog.id === action.payload.id ? action.payload : dog
        ),
        error: null
      };
    case 'DELETE_DOG':
      return {
        ...state,
        dogs: state.dogs.filter(dog => dog.id !== action.payload),
        currentDogId: state.currentDogId === action.payload ? null : state.currentDogId,
        error: null
      };
    case 'SET_CURRENT_DOG':
      return { ...state, currentDogId: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SYNCING':
      return { ...state, isSyncing: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_LAST_LOAD_TIME':
      return { ...state, lastLoadTime: action.payload };
    default:
      return state;
  }
};

export const EnhancedDogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dogReducer, {
    dogs: [],
    currentDogId: null,
    isLoading: true,
    isSyncing: false,
    error: null,
    lastLoadTime: null,
    cacheHit: false
  });

  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { componentName } = useLightweightMonitor('EnhancedDogProvider');

  // Load dogs with enhanced service
  const loadDogs = async (forceRefresh = false) => {
    if (!user) {
      console.log('👤 No authenticated user, clearing dogs state');
      dispatch({ type: 'SET_DOGS', payload: [] });
      dispatch({ type: 'SET_CURRENT_DOG', payload: '' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      console.log('🐕 Loading dogs with enhanced service, forceRefresh:', forceRefresh);
      
      const startTime = performance.now();
      const dogs = await EnhancedDogService.getAllDogs(forceRefresh);
      const loadTime = performance.now() - startTime;
      
      console.log(`✅ Enhanced dogs loaded in ${loadTime.toFixed(2)}ms:`, dogs.length);
      
      dispatch({ 
        type: 'SET_DOGS', 
        payload: dogs,
        cacheHit: loadTime < 50 // Assume cache hit if very fast
      });
      
      // Set current dog from localStorage or first dog
      const savedCurrentDogId = localStorage.getItem('currentDogId');
      if (savedCurrentDogId && dogs.find(dog => dog.id === savedCurrentDogId)) {
        dispatch({ type: 'SET_CURRENT_DOG', payload: savedCurrentDogId });
      } else if (dogs.length > 0) {
        dispatch({ type: 'SET_CURRENT_DOG', payload: dogs[0].id });
      }
      
    } catch (error) {
      console.error('❌ Enhanced dog loading failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load dogs';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      toast({
        title: "Loading Error",
        description: "Failed to load your dogs. Using cached data if available.",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Initial load
  useEffect(() => {
    if (authLoading) {
      console.log('🔐 Auth still loading, waiting...');
      return;
    }
    
    loadDogs();
  }, [user, authLoading]);

  // Save current dog to localStorage whenever it changes
  useEffect(() => {
    if (!state.isLoading && state.currentDogId) {
      localStorage.setItem('currentDogId', state.currentDogId);
    }
  }, [state.currentDogId, state.isLoading]);

  const addDog = async (dogData: Omit<Dog, 'id' | 'dateAdded' | 'lastUpdated'>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add a dog.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('➕ Adding new dog with enhanced service:', dogData.name);
      const newDog = await EnhancedDogService.createDog(dogData);
      dispatch({ type: 'ADD_DOG', payload: newDog });
      dispatch({ type: 'SET_CURRENT_DOG', payload: newDog.id });
      
      toast({
        title: "Dog Added",
        description: `${newDog.name} has been added to your profile.`,
      });
    } catch (error) {
      console.error('❌ Enhanced dog creation failed:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add dog. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateDog = async (dog: Dog) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to update dogs.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('✏️ Updating dog with enhanced service:', dog.name);
      const updatedDog = await EnhancedDogService.updateDog(dog);
      dispatch({ type: 'UPDATE_DOG', payload: updatedDog });
      
      toast({
        title: "Dog Updated",
        description: `${updatedDog.name}'s profile has been updated.`,
      });
    } catch (error) {
      console.error('❌ Enhanced dog update failed:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update dog. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteDog = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to delete dogs.",
        variant: "destructive",
      });
      return;
    }

    try {
      const dogToDelete = state.dogs.find(dog => dog.id === id);
      console.log('🗑️ Deleting dog with enhanced service:', id);
      await EnhancedDogService.deleteDog(id);
      dispatch({ type: 'DELETE_DOG', payload: id });
      
      toast({
        title: "Dog Removed",
        description: `${dogToDelete?.name || 'Dog'} has been removed from your profile.`,
      });
    } catch (error) {
      console.error('❌ Enhanced dog deletion failed:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete dog. Please try again.",
        variant: "destructive",
      });
    }
  };

  const setCurrentDog = (id: string) => {
    console.log('🎯 Setting current dog to:', id);
    dispatch({ type: 'SET_CURRENT_DOG', payload: id });
  };

  const refreshDogs = async (forceRefresh = false) => {
    await loadDogs(forceRefresh);
  };

  const getCacheStats = () => {
    return EnhancedDogService.getCacheStats();
  };

  const currentDog = state.dogs.find(dog => dog.id === state.currentDogId) || null;

  const value: DogContextType = {
    state,
    currentDog,
    addDog,
    updateDog,
    deleteDog,
    setCurrentDog,
    refreshDogs,
    getCacheStats
  };

  return <DogContext.Provider value={value}>{children}</DogContext.Provider>;
};

export const useEnhancedDog = () => {
  const context = useContext(DogContext);
  if (context === undefined) {
    throw new Error('useEnhancedDog must be used within an EnhancedDogProvider');
  }
  return context;
};
