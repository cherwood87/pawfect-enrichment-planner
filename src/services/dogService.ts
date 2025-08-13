
import { supabase } from '@/integrations/supabase/client';
import { Dog } from '@/types/dog';
import { time, end } from '@/utils/perf';
import { CacheManager } from '@/services/core/CacheManager';

export interface DatabaseDog {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  activity_level: 'low' | 'moderate' | 'high';
  special_needs: string;
  gender: 'Male' | 'Female' | 'Unknown';
  breed_group: string;
  mobility_issues: string[];
  image: string;
  notes: string;
  quiz_results: any;
  date_added: string;
  last_updated: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export class DogService {
  private static readonly CACHE_NAMESPACE = 'dogs';
  private static readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  // Enhanced cache management with TTL and invalidation
  private static getCachedDogs(userId: string): Dog[] | null {
    return CacheManager.get<Dog[]>(this.CACHE_NAMESPACE, userId);
  }

  private static setCachedDogs(userId: string, dogs: Dog[]): void {
    CacheManager.set(this.CACHE_NAMESPACE, userId, dogs, { ttl: this.CACHE_TTL });
  }

  static clearDogCache(userId?: string): void {
    if (userId) {
      CacheManager.invalidate(this.CACHE_NAMESPACE, userId);
    } else {
      CacheManager.invalidate(this.CACHE_NAMESPACE);
    }
  }

  // Optimistic update wrapper
  private static async optimisticUpdate<T>(
    userId: string,
    updateFn: (dogs: Dog[]) => Dog[],
    persistFn: () => Promise<T>
  ): Promise<T> {
    return CacheManager.optimisticUpdate(
      this.CACHE_NAMESPACE,
      userId,
      updateFn,
      async (updatedDogs) => {
        const result = await persistFn();
        return result;
      },
      { ttl: this.CACHE_TTL }
    );
  }

  static async createDog(dogData: Omit<Dog, 'id' | 'dateAdded' | 'lastUpdated'>, userId: string): Promise<Dog> {
    if (!userId) {
      throw new Error('User ID is required to create a dog');
    }

    const { data, error } = await supabase
      .from('dogs')
      .insert({
        name: dogData.name,
        breed: dogData.breed,
        age: dogData.age,
        weight: dogData.weight,
        activity_level: dogData.activityLevel,
        special_needs: dogData.specialNeeds || '',
        gender: dogData.gender || 'Unknown',
        breed_group: dogData.breedGroup || 'Unknown',
        mobility_issues: dogData.mobilityIssues || [],
        image: dogData.image || dogData.photo || '',
        notes: dogData.notes || '',
        quiz_results: dogData.quizResults ? JSON.parse(JSON.stringify(dogData.quizResults)) : null,
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating dog:', error);
      throw new Error('Failed to create dog: ' + error.message);
    }

    const newDog = this.mapToDog(data);
    
    // Update cache optimistically
    const cachedDogs = this.getCachedDogs(userId);
    if (cachedDogs) {
      this.setCachedDogs(userId, [newDog, ...cachedDogs]);
    }
    
    return newDog;
  }

  static async getAllDogs(userId: string): Promise<Dog[]> {
    if (!userId) {
      console.log('No user ID provided, returning empty array');
      return [];
    }

    // Use stale-while-revalidate for better UX
    return CacheManager.staleWhileRevalidate(
      this.CACHE_NAMESPACE,
      userId,
      async () => {
        time('DB:getAllDogs');
        const { data, error } = await supabase
          .from('dogs')
          .select('id, name, breed, age, weight, activity_level, special_needs, gender, breed_group, mobility_issues, image, notes, quiz_results, date_added, last_updated, created_at, updated_at, user_id')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        end('DB:getAllDogs');

        if (error) {
          console.error('Error fetching dogs:', error);
          throw new Error('Failed to fetch dogs: ' + error.message);
        }

        return (data || []).map(dog => this.mapToDog(dog));
      },
      { ttl: this.CACHE_TTL }
    );
  }

  static async updateDog(dog: Dog, userId: string): Promise<Dog> {
    if (!userId) {
      throw new Error('User ID is required to update a dog');
    }

    const { data, error } = await supabase
      .from('dogs')
      .update({
        name: dog.name,
        breed: dog.breed,
        age: dog.age,
        weight: dog.weight,
        activity_level: dog.activityLevel,
        special_needs: dog.specialNeeds || '',
        gender: dog.gender || 'Unknown',
        breed_group: dog.breedGroup || 'Unknown',
        mobility_issues: dog.mobilityIssues || [],
        image: dog.image || dog.photo || '',
        notes: dog.notes || '',
        quiz_results: dog.quizResults ? JSON.parse(JSON.stringify(dog.quizResults)) : null
      })
      .eq('id', dog.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating dog:', error);
      throw new Error('Failed to update dog: ' + error.message);
    }

    const updatedDog = this.mapToDog(data);
    
    // Update cache optimistically
    const cachedDogs = this.getCachedDogs(userId);
    if (cachedDogs) {
      const updatedDogs = cachedDogs.map(d => d.id === updatedDog.id ? updatedDog : d);
      this.setCachedDogs(userId, updatedDogs);
    }
    
    return updatedDog;
  }

  static async deleteDog(id: string, userId: string): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required to delete a dog');
    }

    const { error } = await supabase
      .from('dogs')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting dog:', error);
      throw new Error('Failed to delete dog: ' + error.message);
    }

    // Update cache optimistically
    const cachedDogs = this.getCachedDogs(userId);
    if (cachedDogs) {
      const updatedDogs = cachedDogs.filter(d => d.id !== id);
      this.setCachedDogs(userId, updatedDogs);
    }
  }

  private static mapToDog(dbDog: DatabaseDog): Dog {
    return {
      id: dbDog.id,
      name: dbDog.name,
      breed: dbDog.breed,
      age: dbDog.age,
      weight: dbDog.weight,
      activityLevel: dbDog.activity_level,
      specialNeeds: dbDog.special_needs,
      gender: dbDog.gender,
      breedGroup: dbDog.breed_group,
      mobilityIssues: dbDog.mobility_issues,
      image: dbDog.image,
      photo: dbDog.image,
      notes: dbDog.notes,
      quizResults: dbDog.quiz_results,
      dateAdded: dbDog.date_added,
      lastUpdated: dbDog.last_updated
    };
  }

  // Optimized migration with parallel processing
  static async migrateFromLocalStorage(userId: string): Promise<void> {
    try {
      if (!userId) {
        console.log('No user ID provided, skipping migration');
        return;
      }

      const localDogs = localStorage.getItem('dogs');
      if (!localDogs) return;

      const dogs: Dog[] = JSON.parse(localDogs);
      console.log(`Migrating ${dogs.length} dogs to Supabase for user ${userId}...`);

      // Process dogs in parallel for better performance
      const migrationPromises = dogs.map(async (dog) => {
        try {
          await this.createDog(dog, userId);
          console.log(`Migrated dog: ${dog.name}`);
          return { success: true, dog: dog.name };
        } catch (error) {
          console.error(`Failed to migrate dog ${dog.name}:`, error);
          return { success: false, dog: dog.name, error };
        }
      });

      const results = await Promise.allSettled(migrationPromises);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      
      console.log(`Migration completed: ${successful}/${dogs.length} dogs migrated successfully`);

      // Only clear localStorage if all migrations were successful
      if (successful === dogs.length) {
        localStorage.removeItem('dogs');
        console.log('Dog migration completed and localStorage cleared');
      }
    } catch (error) {
      console.error('Error during dog migration:', error);
    }
  }
}
