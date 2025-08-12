import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { DogImageMigrationService } from '@/services/dogImageMigrationService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ImageMigrationBanner: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [migrationStatus, setMigrationStatus] = useState<{
    needsMigration: boolean;
    totalDogs: number;
    base64Count: number;
  } | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);

  useEffect(() => {
    checkMigrationStatus();
  }, [user?.id]);

  const checkMigrationStatus = async () => {
    if (!user?.id) return;

    try {
      setIsChecking(true);
      const status = await DogImageMigrationService.getMigrationStatus(user.id);
      setMigrationStatus(status);
      
      // Don't show banner if no migration needed
      if (!status.needsMigration) {
        setIsDismissed(true);
      }
    } catch (error) {
      console.error('Error checking migration status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleMigration = async () => {
    if (!user?.id || !migrationStatus) return;

    try {
      setIsMigrating(true);
      setMigrationProgress(0);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setMigrationProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const result = await DogImageMigrationService.migrateAllDogImages(user.id);
      
      clearInterval(progressInterval);
      setMigrationProgress(100);

      if (result.migrated > 0) {
        toast({
          title: "Migration Successful!",
          description: `Successfully migrated ${result.migrated} dog photo${result.migrated !== 1 ? 's' : ''} to cloud storage.`,
        });
        
        // Update status after successful migration
        await checkMigrationStatus();
      }

      if (result.failed > 0) {
        toast({
          title: "Partial Migration",
          description: `${result.migrated} succeeded, ${result.failed} failed. Please try again for the failed ones.`,
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Migration error:', error);
      toast({
        title: "Migration Failed",
        description: "Failed to migrate images. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsMigrating(false);
      setMigrationProgress(0);
    }
  };

  // Don't show if checking, dismissed, or no migration needed
  if (isChecking || isDismissed || !migrationStatus?.needsMigration) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <Upload className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                  Upgrade Your Dog Photos
                </h3>
                <p className="text-sm text-orange-700 dark:text-orange-200 mb-3">
                  We found {migrationStatus.base64Count} dog photo{migrationStatus.base64Count !== 1 ? 's' : ''} that can be optimized for faster loading and better quality. 
                  This upgrade is free and only takes a few seconds!
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDismissed(true)}
                className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {isMigrating && (
              <div className="mb-3">
                <Progress value={migrationProgress} className="h-2 mb-2" />
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  Optimizing images... {migrationProgress}%
                </p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                onClick={handleMigration}
                disabled={isMigrating}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isMigrating ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-pulse" />
                    Upgrading...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Upgrade Now
                  </>
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDismissed(true)}
                className="text-orange-600 hover:text-orange-700 dark:text-orange-400"
              >
                Maybe Later
              </Button>
            </div>

            <div className="mt-2 text-xs text-orange-600 dark:text-orange-400">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              Benefits: Faster loading, better quality, secure cloud storage
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageMigrationBanner;