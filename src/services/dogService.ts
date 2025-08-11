
import { supabase } from '@/integrations/supabase/client';
import { Dog } from '@/types/dog';
import { time, end } from '@/utils/perf';

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
  // Cache for user authentication to reduce repeated calls
  private static _currentUser: any = null;
  private static _userPromise: Promise<any> | null = null;

  private static async getCurrentUser() {
    // Use cached user if available
    if (this._currentUser) {
      return this._currentUser;
    }

    // Reuse existing promise if one is in flight
    if (this._userPromise) {
      return this._userPromise;
    }

    // Create new promise and cache it
    time('Auth:getUser');
    this._userPromise = supabase.auth.getUser().then(({ data: { user } }) => {
      this._currentUser = user;
      this._userPromise = null; // Clear promise cache
      end('Auth:getUser');
      return user;
    }).catch((e) => {
      end('Auth:getUser');
      throw e;
    });

    return this._userPromise;
  }

  static clearUserCache() {
    this._currentUser = null;
    this._userPromise = null;
  }

  static setCurrentUser(user: any) {
    this._currentUser = user;
    this._userPromise = null;
  }

  static async createDog(dogData: Omit<Dog, 'id' | 'dateAdded' | 'lastUpdated'>): Promise<Dog> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('User must be authenticated to create a dog');
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
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating dog:', error);
      throw new Error('Failed to create dog: ' + error.message);
    }

    return this.mapToDog(data);
  }

  static async getAllDogs(): Promise<Dog[]> {
    const user = await this.getCurrentUser();
    if (!user) {
      console.log('No authenticated user, returning empty array');
      return [];
    }

    const { data, error } = await supabase
      .from('dogs')
      .select('id, name, breed, age, weight, activity_level, special_needs, gender, breed_group, mobility_issues, image, notes, quiz_results, date_added, last_updated, created_at, updated_at, user_id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching dogs:', error);
      throw new Error('Failed to fetch dogs: ' + error.message);
    }

    return (data || []).map(dog => this.mapToDog(dog));
  }

  static async updateDog(dog: Dog): Promise<Dog> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('User must be authenticated to update a dog');
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
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating dog:', error);
      throw new Error('Failed to update dog: ' + error.message);
    }

    return this.mapToDog(data);
  }

  static async deleteDog(id: string): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('User must be authenticated to delete a dog');
    }

    const { error } = await supabase
      .from('dogs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting dog:', error);
      throw new Error('Failed to delete dog: ' + error.message);
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
  static async migrateFromLocalStorage(): Promise<void> {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        console.log('No authenticated user, skipping migration');
        return;
      }

      const localDogs = localStorage.getItem('dogs');
      if (!localDogs) return;

      const dogs: Dog[] = JSON.parse(localDogs);
      console.log(`Migrating ${dogs.length} dogs to Supabase for user ${user.id}...`);

      // Process dogs in parallel for better performance
      const migrationPromises = dogs.map(async (dog) => {
        try {
          await this.createDog(dog);
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
