import { supabase } from '@/integrations/supabase/client';
import { migrateBase64ToStorage } from '@/utils/imageUtils';
import { DogService } from './dogService';

interface MigrationResult {
  migrated: number;
  failed: number;
  errors: string[];
}

export class DogImageMigrationService {
  private static isMigrating = false;

  /**
   * Migrates all dogs' base64 images to Supabase Storage
   */
  static async migrateAllDogImages(userId: string): Promise<MigrationResult> {
    if (this.isMigrating) {
      console.log('Migration already in progress, skipping...');
      return { migrated: 0, failed: 0, errors: ['Migration already in progress'] };
    }

    this.isMigrating = true;
    const result: MigrationResult = { migrated: 0, failed: 0, errors: [] };

    try {
      console.log('🔄 Starting dog image migration to Supabase Storage...');

      // Get all dogs for the user
      const dogs = await DogService.getAllDogs(userId);
      const dogsWithBase64Images = dogs.filter(dog => 
        dog.image && dog.image.startsWith('data:')
      );

      if (dogsWithBase64Images.length === 0) {
        console.log('✅ No base64 images found to migrate');
        return result;
      }

      console.log(`📸 Found ${dogsWithBase64Images.length} dogs with base64 images to migrate`);

      // Migrate images in parallel (but limit concurrency to avoid overwhelming the system)
      const batchSize = 3;
      for (let i = 0; i < dogsWithBase64Images.length; i += batchSize) {
        const batch = dogsWithBase64Images.slice(i, i + batchSize);
        
        await Promise.allSettled(
          batch.map(async (dog) => {
            try {
              if (!dog.image || !dog.image.startsWith('data:')) {
                return;
              }

              console.log(`🔄 Migrating image for ${dog.name}...`);

              // Migrate the base64 image to storage
              const storageUrl = await migrateBase64ToStorage(dog.image, userId, dog.id);
              
              if (storageUrl) {
                // Update the dog record with the new storage URL
                const updatedDog = { ...dog, image: storageUrl };
                await DogService.updateDog(updatedDog, userId);
                
                console.log(`✅ Successfully migrated image for ${dog.name}`);
                result.migrated++;
              } else {
                throw new Error('Failed to upload image to storage');
              }

            } catch (error) {
              console.error(`❌ Failed to migrate image for ${dog.name}:`, error);
              result.failed++;
              result.errors.push(`${dog.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
          })
        );

        // Small delay between batches to be nice to the API
        if (i + batchSize < dogsWithBase64Images.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      console.log(`🎉 Migration complete: ${result.migrated} migrated, ${result.failed} failed`);
      
    } catch (error) {
      console.error('❌ Migration process failed:', error);
      result.errors.push(`Migration process error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      this.isMigrating = false;
    }

    return result;
  }

  /**
   * Check if any dogs still have base64 images
   */
  static async hasBase64Images(userId: string): Promise<boolean> {
    try {
      const dogs = await DogService.getAllDogs(userId);
      return dogs.some(dog => dog.image && dog.image.startsWith('data:'));
    } catch (error) {
      console.error('Error checking for base64 images:', error);
      return false;
    }
  }

  /**
   * Get migration status for display to user
   */
  static async getMigrationStatus(userId: string): Promise<{
    needsMigration: boolean;
    totalDogs: number;
    base64Count: number;
  }> {
    try {
      const dogs = await DogService.getAllDogs(userId);
      const base64Count = dogs.filter(dog => dog.image && dog.image.startsWith('data:')).length;
      
      return {
        needsMigration: base64Count > 0,
        totalDogs: dogs.length,
        base64Count
      };
    } catch (error) {
      console.error('Error getting migration status:', error);
      return { needsMigration: false, totalDogs: 0, base64Count: 0 };
    }
  }
}