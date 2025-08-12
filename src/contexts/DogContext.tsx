import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Dog } from '@/types/dog';
import { DogService } from '@/services/dogService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { time, end } from '@/utils/perf';

interface DogState {
  dogs: Dog[];
  currentDogId: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
}

type DogAction =
  | { type: 'SET_DOGS'; payload: Dog[] }
  | { type: 'ADD_DOG'; payload: Dog }
  | { type: 'UPDATE_DOG'; payload: Dog }
  | { type: 'DELETE_DOG'; payload: string }
  | { type: 'SET_CURRENT_DOG'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SYNCING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

interface DogContextType {
  state: DogState;
  dispatch: React.Dispatch<DogAction>;
  currentDog: Dog | null;
  addDog: (dog: Omit<Dog, 'id' | 'dateAdded' | 'lastUpdated'>) => Promise<void>;
  updateDog: (dog: Dog) => Promise<void>;
  deleteDog: (id: string) => Promise<void>;
  setCurrentDog: (id: string) => void;
  migrateFromLocalStorage: () => Promise<void>;
}

const DogContext = createContext<DogContextType | undefined>(undefined);

const dogReducer = (state: DogState, action: DogAction): DogState => {
  switch (action.type) {
    case 'SET_DOGS':
      return { ...state, dogs: action.payload, error: null };
    case 'ADD_DOG':
      return { ...state, dogs: [...state.dogs, action.payload], error: null };
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
    default:
      return state;
  }
};

export const DogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dogReducer, {
    dogs: [],
    currentDogId: null,
    isLoading: true,
    isSyncing: false,
    error: null
  });

  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  // Optimized data loading with timeout and parallel operations
  useEffect(() => {
    if (authLoading) {
      return;
    }
    
    if (!user) {
      dispatch({ type: 'SET_DOGS', payload: [] });
      dispatch({ type: 'SET_CURRENT_DOG', payload: null });
      dispatch({ type: 'SET_LOADING', payload: false });
      DogService.clearDogCache();
      return;
    }

    loadDogsWithTimeout();
  }, [user, authLoading]);

  const loadDogsWithTimeout = async () => {
    if (!user) {
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      time('Dogs:loadAll');
      
      // Add timeout protection against large requests
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000)
      );
      
      const dogsPromise = DogService.getAllDogs(user.id);
      
      // Race the request against timeout
      const dogs = await Promise.race([dogsPromise, timeoutPromise]);
      
      dispatch({ type: 'SET_DOGS', payload: dogs });
      
      // Set current dog from localStorage or first dog
      const savedCurrentDogId = localStorage.getItem('currentDogId');
      if (savedCurrentDogId && dogs.find(dog => dog.id === savedCurrentDogId)) {
        dispatch({ type: 'SET_CURRENT_DOG', payload: savedCurrentDogId });
      } else if (dogs.length > 0) {
        dispatch({ type: 'SET_CURRENT_DOG', payload: dogs[0].id });
      }
    } catch (error) {
      console.error('❌ Critical error loading dogs:', error);
      
      // Don't block the app for network errors - just show empty state
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('Load failed') || errorMessage.includes('timeout')) {
        dispatch({ type: 'SET_DOGS', payload: [] });
        dispatch({ type: 'SET_ERROR', payload: null }); // Don't show error for network issues
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load your dogs. Please try refreshing the page.' });
      }
    } finally {
      end('Dogs:loadAll');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const checkLocalStorageForDogs = async (): Promise<Dog[]> => {
    try {
      const savedDogs = localStorage.getItem('dogs');
      const savedCurrentDogId = localStorage.getItem('currentDogId');
      
      if (savedDogs) {
        const dogs = JSON.parse(savedDogs);
        if (savedCurrentDogId && dogs.find((dog: Dog) => dog.id === savedCurrentDogId)) {
          dispatch({ type: 'SET_CURRENT_DOG', payload: savedCurrentDogId });
        } else if (dogs.length > 0) {
          dispatch({ type: 'SET_CURRENT_DOG', payload: dogs[0].id });
        }
        return dogs;
      }
      return [];
    } catch (error) {
      console.error('❌ Error loading dogs from localStorage:', error);
      return [];
    }
  };

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
      const newDog = await DogService.createDog(dogData, user.id);
      dispatch({ type: 'ADD_DOG', payload: newDog });
      dispatch({ type: 'SET_CURRENT_DOG', payload: newDog.id });
      
      toast({
        title: "Dog Added",
        description: `${newDog.name} has been added to your profile.`,
      });
    } catch (error) {
      console.error('❌ Error adding dog:', error);
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
      const updatedDog = await DogService.updateDog(dog, user.id);
      dispatch({ type: 'UPDATE_DOG', payload: updatedDog });
      
      toast({
        title: "Dog Updated",
        description: `${updatedDog.name}'s profile has been updated.`,
      });
    } catch (error) {
      console.error('❌ Error updating dog:', error);
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
      await DogService.deleteDog(id, user.id);
      dispatch({ type: 'DELETE_DOG', payload: id });
      
      toast({
        title: "Dog Removed",
        description: `${dogToDelete?.name || 'Dog'} has been removed from your profile.`,
      });
    } catch (error) {
      console.error('❌ Error deleting dog:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete dog. Please try again.",
        variant: "destructive",
      });
    }
  };

  const setCurrentDog = (id: string) => {
    try {
      dispatch({ type: 'SET_CURRENT_DOG', payload: id });
    } catch (error) {
      console.error('❌ Error setting current dog:', error);
    }
  };

  const migrateFromLocalStorage = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to migrate your data.",
        variant: "destructive",
      });
      return;
    }

    try {
      dispatch({ type: 'SET_SYNCING', payload: true });
      
      toast({
        title: "Migration Started",
        description: "Syncing your data to the cloud...",
      });

      await DogService.migrateFromLocalStorage(user.id);
      await loadDogsWithTimeout(); // Reload from Supabase

      toast({
        title: "Migration Complete",
        description: "Your data has been successfully synced to the cloud!",
      });
    } catch (error) {
      console.error('❌ Error during migration:', error);
      toast({
        title: "Migration Failed",
        description: error instanceof Error ? error.message : "Failed to sync data to the cloud. Please try again.",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  };

  const currentDog = state.dogs.find(dog => dog.id === state.currentDogId) || null;

  // Memoize context value to prevent unnecessary re-renders
  const value: DogContextType = React.useMemo(() => ({
    state,
    dispatch,
    currentDog,
    addDog,
    updateDog,
    deleteDog,
    setCurrentDog,
    migrateFromLocalStorage
  }), [state, currentDog, addDog, updateDog, deleteDog, setCurrentDog, migrateFromLocalStorage]);

  return <DogContext.Provider value={value}>{children}</DogContext.Provider>;
};

export const useDog = () => {
  const context = useContext(DogContext);
  if (context === undefined) {
    throw new Error('useDog must be used within a DogProvider');
  }
  return context;
};
