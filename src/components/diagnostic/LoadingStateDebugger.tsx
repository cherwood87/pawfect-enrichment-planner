
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useDog } from '@/contexts/DogContext';

interface LoadingState {
  component: string;
  isLoading: boolean;
  error: string | null;
  timestamp: number;
}

const LoadingStateDebugger: React.FC = () => {
  const [loadingStates, setLoadingStates] = useState<LoadingState[]>([]);
  const { loading: authLoading, error: authError, user } = useAuth();
  const { state: dogState } = useDog();

  useEffect(() => {
    const newStates: LoadingState[] = [
      {
        component: 'AuthContext',
        isLoading: authLoading,
        error: authError,
        timestamp: Date.now()
      },
      {
        component: 'DogContext',
        isLoading: dogState.isLoading,
        error: dogState.error,
        timestamp: Date.now()
      }
    ];

    setLoadingStates(newStates);

    // Log the current state
    console.log('🔍 [LoadingDebugger] Current loading states:', {
      auth: { loading: authLoading, error: authError, hasUser: !!user },
      dogs: { loading: dogState.isLoading, error: dogState.error, dogCount: dogState.dogs.length }
    });
  }, [authLoading, authError, user, dogState]);

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-sm">Loading State Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {loadingStates.map((state, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="font-medium">{state.component}</span>
            <div className="flex items-center space-x-2">
              <Badge variant={state.isLoading ? "default" : state.error ? "destructive" : "secondary"}>
                {state.isLoading ? 'Loading' : state.error ? 'Error' : 'Ready'}
              </Badge>
              {state.error && (
                <span className="text-xs text-red-600 max-w-32 truncate" title={state.error}>
                  {state.error}
                </span>
              )}
            </div>
          </div>
        ))}
        
        <div className="mt-4 p-2 bg-gray-50 rounded text-xs">
          <div>Auth User: {user ? user.email : 'None'}</div>
          <div>Dogs Count: {dogState.dogs.length}</div>
          <div>Current Dog: {dogState.currentDogId || 'None'}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingStateDebugger;
