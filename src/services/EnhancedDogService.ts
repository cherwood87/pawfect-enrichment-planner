
import { Dog } from '@/types/dog';
import { EnhancedSupabaseAdapter } from './integration/EnhancedSupabaseAdapter';
import { CacheService } from './network/CacheService';

export class EnhancedDogService {
  private static userCache = new Map<string, Dog[]>();

  // Enhanced dog loading with multi-level caching
  static async getAllDogs(forceRefresh = false): Promise<Dog[]> {
    console.log('🐕 EnhancedDogService: Loading all dogs, forceRefresh:', forceRefresh);

    // Get current user ID from auth context (this would need to be passed in)
    // For now, we'll assume it's available globally or passed as parameter
    const userId = await this.getCurrentUserId();
    if (!userId) {
      console.log('❌ No authenticated user found');
      return [];
    }

    // Check memory cache first (fastest)
    if (!forceRefresh && this.userCache.has(userId)) {
      const cached = this.userCache.get(userId)!;
      console.log('🚀 Returning memory cached dogs:', cached.length);
      return cached;
    }

    try {
      // Use enhanced adapter with built-in caching and retry logic
      const dogs = await EnhancedSupabaseAdapter.getDogs(userId, !forceRefresh);
      
      // Update memory cache
      this.userCache.set(userId, dogs);
      
      return dogs;
    } catch (error) {
      console.error('❌ Enhanced dog loading failed:', error);
      
      // Fallback to localStorage cache if available
      const fallbackDogs = CacheService.getCachedDogs(userId);
      if (fallbackDogs) {
        console.log('🔄 Using fallback cached dogs:', fallbackDogs.length);
        this.userCache.set(userId, fallbackDogs);
        return fallbackDogs;
      }
      
      throw error;
    }
  }

  static async createDog(dogData: Omit<Dog, 'id' | 'dateAdded' | 'lastUpdated'>): Promise<Dog> {
    console.log('➕ EnhancedDogService: Creating dog:', dogData.name);

    try {
      const newDog = await EnhancedSupabaseAdapter.createDog(dogData);
      
      // Update memory cache
      const userId = dogData.userId;
      if (this.userCache.has(userId)) {
        const currentDogs = this.userCache.get(userId)!;
        this.userCache.set(userId, [newDog, ...currentDogs]);
      }
      
      return newDog;
    } catch (error) {
      console.error('❌ Enhanced dog creation failed:', error);
      throw error;
    }
  }

  static async updateDog(dog: Dog): Promise<Dog> {
    console.log('✏️ EnhancedDogService: Updating dog:', dog.name);

    try {
      // This would use the enhanced adapter for updates too
      const updatedDog = await EnhancedSupabaseAdapter.updateDog(dog);
      
      // Update memory cache
      const userId = dog.userId;
      if (this.userCache.has(userId)) {
        const dogs = this.userCache.get(userId)!;
        const updatedDogs = dogs.map(d => d.id === dog.id ? updatedDog : d);
        this.userCache.set(userId, updatedDogs);
      }
      
      // Invalidate persistent cache
      CacheService.delete(`dogs_${userId}`);
      
      return updatedDog;
    } catch (error) {
      console.error('❌ Enhanced dog update failed:', error);
      throw error;
    }
  }

  static async deleteDog(id: string): Promise<void> {
    console.log('🗑️ EnhancedDogService: Deleting dog:', id);

    try {
      await EnhancedSupabaseAdapter.deleteDog(id);
      
      // Update all caches
      const userId = await this.getCurrentUserId();
      if (userId) {
        // Update memory cache
        if (this.userCache.has(userId)) {
          const dogs = this.userCache.get(userId)!;
          const filteredDogs = dogs.filter(d => d.id !== id);
          this.userCache.set(userId, filteredDogs);
        }
        
        // Invalidate persistent cache
        CacheService.delete(`dogs_${userId}`);
      }
    } catch (error) {
      console.error('❌ Enhanced dog deletion failed:', error);
      throw error;
    }
  }

  // Cache management
  static clearUserCache(userId?: string): void {
    if (userId) {
      this.userCache.delete(userId);
      CacheService.delete(`dogs_${userId}`);
    } else {
      this.userCache.clear();
      CacheService.clear();
    }
    console.log('🧹 Enhanced dog service cache cleared');
  }

  static getCacheStats(): {
    memoryEntries: number;
    persistentCacheStats: any;
  } {
    return {
      memoryEntries: this.userCache.size,
      persistentCacheStats: CacheService.getCacheStats()
    };
  }

  // Helper to get current user ID (would be properly implemented with auth context)
  private static async getCurrentUserId(): Promise<string | null> {
    // This would integrate with your auth system
    // For now, returning a placeholder
    try {
      // Get from supabase auth or auth context
      const { data: { user } } = await import('@/integrations/supabase/client').then(m => m.supabase.auth.getUser());
      return user?.id || null;
    } catch {
      return null;
    }
  }
}
