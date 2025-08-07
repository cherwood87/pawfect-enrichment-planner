
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cloud, Database, Loader2, X } from 'lucide-react';
import { useDog } from '@/contexts/DogContext';

const DataMigrationBanner: React.FC = () => {
  const { state, migrateFromLocalStorage } = useDog();
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('migrationBannerDismissed') === 'true';
  });

  // Check if there's local data that might need migration
  const hasLocalData = () => {
    const localDogs = localStorage.getItem('dogs');
    return localDogs && JSON.parse(localDogs).length > 0;
  };

  // Don't show banner if dismissed, no local data, or already have cloud data
  if (dismissed || !hasLocalData() || state.dogs.length > 0) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('migrationBannerDismissed', 'true');
  };

  const handleMigrate = async () => {
    await migrateFromLocalStorage();
    setDismissed(true);
    localStorage.setItem('migrationBannerDismissed', 'true');
  };

  return (
    <Card className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Cloud className="w-6 h-6 text-blue-500 mt-1" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Sync Your Data to the Cloud
                </h3>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  New Feature
                </Badge>
              </div>
              <p className="text-gray-700 mb-3">
                We've detected that you have dog profiles and activities stored locally. 
                Sync them to the cloud to access your data across all your devices!
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <Database className="w-4 h-4" />
                <span>Your data will be safely stored and synchronized across devices</span>
              </div>
              <div className="flex space-x-3">
                <Button 
                  onClick={handleMigrate}
                  disabled={state.isSyncing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {state.isSyncing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <Cloud className="w-4 h-4 mr-2" />
                      Sync to Cloud
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDismiss}
                  disabled={state.isSyncing}
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            disabled={state.isSyncing}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataMigrationBanner;
