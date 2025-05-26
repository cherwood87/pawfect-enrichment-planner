
import { supabase } from '@/integrations/supabase/client';
import { Dog } from '@/types/dog';

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
}

export class DogService {
  static async createDog(dogData: Omit<Dog, 'id' | 'dateAdded' | 'lastUpdated'>): Promise<Dog> {
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
        quiz_results: dogData.quizResults ? JSON.parse(JSON.stringify(dogData.quizResults)) : null
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating dog:', error);
      throw new Error('Failed to create dog');
    }

    return this.mapToDog(data);
  }

  static async getAllDogs(): Promise<Dog[]> {
    const { data, error } = await supabase
      .from('dogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching dogs:', error);
      throw new Error('Failed to fetch dogs');
    }

    return data.map(this.mapToDog);
  }

  static async updateDog(dog: Dog): Promise<Dog> {
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
      .select()
      .single();

    if (error) {
      console.error('Error updating dog:', error);
      throw new Error('Failed to update dog');
    }

    return this.mapToDog(data);
  }

  static async deleteDog(id: string): Promise<void> {
    const { error } = await supabase
      .from('dogs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting dog:', error);
      throw new Error('Failed to delete dog');
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
      photo: dbDog.image, // Keep for backward compatibility
      notes: dbDog.notes,
      quizResults: dbDog.quiz_results,
      dateAdded: dbDog.date_added,
      lastUpdated: dbDog.last_updated
    };
  }

  // Migration helper - moves dogs from localStorage to Supabase
  static async migrateFromLocalStorage(): Promise<void> {
    try {
      const localDogs = localStorage.getItem('dogs');
      if (!localDogs) return;

      const dogs: Dog[] = JSON.parse(localDogs);
      console.log(`Migrating ${dogs.length} dogs to Supabase...`);

      for (const dog of dogs) {
        try {
          await this.createDog(dog);
          console.log(`Migrated dog: ${dog.name}`);
        } catch (error) {
          console.error(`Failed to migrate dog ${dog.name}:`, error);
        }
      }

      console.log('Dog migration completed');
    } catch (error) {
      console.error('Error during dog migration:', error);
    }
  }
}
