
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Dog } from '@/types/dog';

interface DogState {
  dogs: Dog[];
  currentDogId: string | null;
  isLoading: boolean;
}

type DogAction =
  | { type: 'SET_DOGS'; payload: Dog[] }
  | { type: 'ADD_DOG'; payload: Dog }
  | { type: 'UPDATE_DOG'; payload: Dog }
  | { type: 'DELETE_DOG'; payload: string }
  | { type: 'SET_CURRENT_DOG'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

interface DogContextType {
  state: DogState;
  dispatch: React.Dispatch<DogAction>;
  currentDog: Dog | null;
  addDog: (dog: Omit<Dog, 'id' | 'dateAdded' | 'lastUpdated'>) => void;
  updateDog: (dog: Dog) => void;
  deleteDog: (id: string) => void;
  setCurrentDog: (id: string) => void;
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
    default:
      return state;
  }
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const DogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dogReducer, {
    dogs: [],
    currentDogId: null,
    isLoading: true
  });

  // Load dogs from localStorage on mount
  useEffect(() => {
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
    
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  // Save to localStorage whenever dogs change
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('dogs', JSON.stringify(state.dogs));
      if (state.currentDogId) {
        localStorage.setItem('currentDogId', state.currentDogId);
      }
    }
  }, [state.dogs, state.currentDogId, state.isLoading]);

  const addDog = (dogData: Omit<Dog, 'id' | 'dateAdded' | 'lastUpdated'>) => {
    const newDog: Dog = {
      ...dogData,
      id: generateId(),
      dateAdded: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    dispatch({ type: 'ADD_DOG', payload: newDog });
    dispatch({ type: 'SET_CURRENT_DOG', payload: newDog.id });
  };

  const updateDog = (dog: Dog) => {
    const updatedDog = {
      ...dog,
      lastUpdated: new Date().toISOString()
    };
    dispatch({ type: 'UPDATE_DOG', payload: updatedDog });
  };

  const deleteDog = (id: string) => {
    dispatch({ type: 'DELETE_DOG', payload: id });
  };

  const setCurrentDog = (id: string) => {
    dispatch({ type: 'SET_CURRENT_DOG', payload: id });
  };

  const currentDog = state.dogs.find(dog => dog.id === state.currentDogId) || null;

  const value: DogContextType = {
    state,
    dispatch,
    currentDog,
    addDog,
    updateDog,
    deleteDog,
    setCurrentDog
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
