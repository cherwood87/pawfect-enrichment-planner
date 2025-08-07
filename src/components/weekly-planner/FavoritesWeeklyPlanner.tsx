import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Plus, BookOpen } from 'lucide-react';
import { useDog } from '@/contexts/DogContext';
import { favouritesService, FavouriteActivity } from '@/services/favouritesService';
import { getPillarActivities } from '@/data/activityLibrary';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface FavoritesWeeklyPlannerProps {
  onPillarSelect: (pillar: string) => void;
}

const FavoritesWeeklyPlanner: React.FC<FavoritesWeeklyPlannerProps> = ({ onPillarSelect }) => {
  const { currentDog } = useDog();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavouriteActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, [currentDog]);

  const loadFavorites = async () => {
    if (!currentDog) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const favs = await favouritesService.getFavourites(currentDog.id);
      
      // Enrich favorites with activity details
      const enrichedFavs = favs.map(fav => {
        if (fav.activity_type === 'library') {
          const libraryActivity = getPillarActivities().find(a => a.id === fav.activity_id);
          if (libraryActivity) {
            return {
              ...fav,
              title: libraryActivity.title,
              pillar: libraryActivity.pillar,
              difficulty: libraryActivity.difficulty,
              duration: libraryActivity.duration
            };
          }
        }
        return fav;
      }).filter(fav => fav.title); // Only show activities we could enrich

      setFavorites(enrichedFavs);
    } catch (error) {
      console.error('Failed to load favorites:', error);
      toast({
        title: "Failed to load favorites",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActivityClick = (activity: FavouriteActivity) => {
    // Could open activity details modal here in the future
    toast({
      title: activity.title || "Activity",
      description: "Click 'Browse Library' to see full details and add more favorites",
    });
  };

  const handleBrowseLibrary = () => {
    onPillarSelect('all');
    navigate('/activities');
  };

  const getPillarColor = (pillar: string) => {
    const colors: Record<string, string> = {
      'Mental': 'bg-blue-100 text-blue-800',
      'Physical': 'bg-green-100 text-green-800',
      'Social': 'bg-purple-100 text-purple-800',
      'Environmental': 'bg-yellow-100 text-yellow-800',
      'Instinctual': 'bg-red-100 text-red-800'
    };
    return colors[pillar] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Card className="col-span-2 shadow-lg rounded-2xl bg-gradient-to-br from-purple-50 to-cyan-50 border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">Your Favorites</CardTitle>
          <CardDescription className="text-gray-600">
            Loading your saved activities...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 shadow-lg rounded-2xl bg-gradient-to-br from-purple-50 to-cyan-50 border-2 border-purple-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              Your Favorites
            </CardTitle>
            <CardDescription className="text-gray-600">
              Quick access to your saved activities
            </CardDescription>
          </div>
          <Button
            onClick={handleBrowseLibrary}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Browse Library
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {favorites.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-4">
              Browse the activity library and save activities you'd like to try with {currentDog?.name || 'your dog'}
            </p>
            <Button
              onClick={handleBrowseLibrary}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Your First Favorite
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.slice(0, 6).map((activity) => (
              <div
                key={activity.id}
                onClick={() => handleActivityClick(activity)}
                className="p-4 bg-white rounded-lg border hover:border-purple-300 cursor-pointer transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors">
                      {activity.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {activity.pillar && (
                        <Badge variant="secondary" className={getPillarColor(activity.pillar)}>
                          {activity.pillar}
                        </Badge>
                      )}
                      {activity.difficulty && (
                        <span className="text-xs text-gray-500">{activity.difficulty}</span>
                      )}
                      {activity.duration && (
                        <span className="text-xs text-gray-500">{activity.duration} min</span>
                      )}
                    </div>
                  </div>
                  <Heart className="h-5 w-5 text-red-500 fill-current" />
                </div>
              </div>
            ))}
            {favorites.length > 6 && (
              <div className="text-center pt-2">
                <Button
                  onClick={handleBrowseLibrary}
                  variant="ghost"
                  size="sm"
                  className="text-purple-600"
                >
                  View all {favorites.length} favorites
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoritesWeeklyPlanner;