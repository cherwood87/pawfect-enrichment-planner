
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Dog } from '@/types/dog';
import { DogService } from '@/services/dogService';
import { useToast } from '@/hooks/use-toast';

interface DogState {
  dogs: Dog[];
  currentDogId: string | null;
  isLoading: boolean;
  isSyncing: boolean;
}

type DogAction =
  | { type: 'SET_DOGS'; payload: Dog[] }
  | { type: 'ADD_DOG'; payload: Dog }
  | { type: 'UPDATE_DOG'; payload: Dog }
  | { type: 'DELETE_DOG'; payload: string }
  | { type: 'SET_CURRENT_DOG'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SYNCING'; payload: boolean };

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
      return { ...state, dogs: action.payload };
    case 'ADD_DOG':
      return { ...state, dogs: [...state.dogs, action.payload] };
    case 'UPDATE_DOG':
      return {
        ...state,
        dogs: state.dogs.map(dog =>
          dog.id === action.payload.id ? action.payload : dog
        )
      };
    case 'DELETE_DOG':
      return {
        ...state,
        dogs: state.dogs.filter(dog => dog.id !== action.payload),
        currentDogId: state.currentDogId === action.payload ? null : state.currentDogId
      };
    case 'SET_CURRENT_DOG':
      return { ...state, currentDogId: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SYNCING':
      return { ...state, isSyncing: action.payload };
    default:
      return state;
  }
};

export const DogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dogReducer, {
    dogs: [],
    currentDogId: null,
    isLoading: true,
    isSyncing: false
  });

  const { toast } = useToast();

  // Load dogs from Supabase on mount
  useEffect(() => {
    loadDogs();
  }, []);

  const loadDogs = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const dogs = await DogService.getAllDogs();
      dispatch({ type: 'SET_DOGS', payload: dogs });
      
      // Set current dog from localStorage or first dog
      const savedCurrentDogId = localStorage.getItem('currentDogId');
      if (savedCurrentDogId && dogs.find(dog => dog.id === savedCurrentDogId)) {
        dispatch({ type: 'SET_CURRENT_DOG', payload: savedCurrentDogId });
      } else if (dogs.length > 0) {
        dispatch({ type: 'SET_CURRENT_DOG', payload: dogs[0].id });
      }
    } catch (error) {
      console.error('Error loading dogs from Supabase:', error);
      // Fallback to localStorage if Supabase fails
      try {
        const savedDogs = localStorage.getItem('dogs');
        const savedCurrentDogId = localStorage.getItem('currentDogId');
        
        if (savedDogs) {
          const dogs = JSON.parse(savedDogs);
          dispatch({ type: 'SET_DOGS', payload: dogs });
          
          if (savedCurrentDogId && dogs.find((dog: Dog) => dog.id === savedCurrentDogId)) {
            dispatch({ type: 'SET_CURRENT_DOG', payload: savedCurrentDogId });
          } else if (dogs.length > 0) {
            dispatch({ type: 'SET_CURRENT_DOG', payload: dogs[0].id });
          }
        }
      } catch (localError) {
        console.error('Error loading dogs from localStorage:', localError);
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Save current dog to localStorage whenever it changes
  useEffect(() => {
    if (!state.isLoading && state.currentDogId) {
      localStorage.setItem('currentDogId', state.currentDogId);
    }
  }, [state.currentDogId, state.isLoading]);

  const addDog = async (dogData: Omit<Dog, 'id' | 'dateAdded' | 'lastUpdated'>) => {
    try {
      console.log('Adding new dog:', dogData.name);
      const newDog = await DogService.createDog(dogData);
      dispatch({ type: 'ADD_DOG', payload: newDog });
      dispatch({ type: 'SET_CURRENT_DOG', payload: newDog.id });
      
      toast({
        title: "Dog Added",
        description: `${newDog.name} has been added to your profile.`,
      });
    } catch (error) {
      console.error('Error adding dog:', error);
      toast({
        title: "Error",
        description: "Failed to add dog. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateDog = async (dog: Dog) => {
    try {
      console.log('Updating dog:', dog.name);
      const updatedDog = await DogService.updateDog(dog);
      dispatch({ type: 'UPDATE_DOG', payload: updatedDog });
      
      toast({
        title: "Dog Updated",
        description: `${updatedDog.name}'s profile has been updated.`,
      });
    } catch (error) {
      console.error('Error updating dog:', error);
      toast({
        title: "Error",
        description: "Failed to update dog. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteDog = async (id: string) => {
    try {
      const dogToDelete = state.dogs.find(dog => dog.id === id);
      console.log('Deleting dog with id:', id);
      await DogService.deleteDog(id);
      dispatch({ type: 'DELETE_DOG', payload: id });
      
      toast({
        title: "Dog Removed",
        description: `${dogToDelete?.name || 'Dog'} has been removed from your profile.`,
      });
    } catch (error) {
      console.error('Error deleting dog:', error);
      toast({
        title: "Error",
        description: "Failed to delete dog. Please try again.",
        variant: "destructive",
      });
    }
  };

  const setCurrentDog = (id: string) => {
    try {
      console.log('Setting current dog to:', id);
      dispatch({ type: 'SET_CURRENT_DOG', payload: id });
    } catch (error) {
      console.error('Error setting current dog:', error);
    }
  };

  const migrateFromLocalStorage = async () => {
    try {
      dispatch({ type: 'SET_SYNCING', payload: true });
      
      toast({
        title: "Migration Started",
        description: "Syncing your data to the cloud...",
      });

      await DogService.migrateFromLocalStorage();
      await loadDogs(); // Reload from Supabase

      toast({
        title: "Migration Complete",
        description: "Your data has been successfully synced to the cloud!",
      });
    } catch (error) {
      console.error('Error during migration:', error);
      toast({
        title: "Migration Failed",
        description: "Failed to sync data to the cloud. Please try again.",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  };

  const currentDog = state.dogs.find(dog => dog.id === state.currentDogId) || null;

  const value: DogContextType = {
    state,
    dispatch,
    currentDog,
    addDog,
    updateDog,
    deleteDog,
    setCurrentDog,
    migrateFromLocalStorage
  };

  return <DogContext.Provider value={value}>{children}</DogContext.Provider>;
};

export const useDog = () => {
  const context = useContext(DogContext);
  if (context === undefined) {
    throw new Error('useDog must be used within a DogProvider');
  }
  return context;
};
