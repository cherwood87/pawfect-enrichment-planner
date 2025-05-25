
import { useState, useEffect } from 'react';
import { EducationalArticle, ResourceCategory } from '@/types/resource';
import { ResourceDiscoveryService } from '@/services/ResourceDiscoveryService';
import { useToast } from '@/hooks/use-toast';

export const useResourceHub = () => {
  const [resources, setResources] = useState<EducationalArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadSavedResources();
    loadBookmarks();
    loadUserRatings();
  }, []);

  const loadSavedResources = () => {
    const saved = localStorage.getItem('resourceHub-articles');
    if (saved) {
      setResources(JSON.parse(saved));
    }
  };

  const loadBookmarks = () => {
    const saved = localStorage.getItem('resourceHub-bookmarks');
    if (saved) {
      setBookmarkedIds(new Set(JSON.parse(saved)));
    }
  };

  const loadUserRatings = () => {
    const savedRatings = localStorage.getItem('resourceHub-ratings');
    if (savedRatings) {
      setUserRatings(JSON.parse(savedRatings));
    }
  };

  const saveResources = (newResources: EducationalArticle[]) => {
    localStorage.setItem('resourceHub-articles', JSON.stringify(newResources));
  };

  const saveBookmarks = (bookmarks: Set<string>) => {
    localStorage.setItem('resourceHub-bookmarks', JSON.stringify(Array.from(bookmarks)));
  };

  const discoverNewContent = async () => {
    setIsDiscovering(true);
    try {
      const newResources = await ResourceDiscoveryService.discoverNewResources(resources);
      const updatedResources = [...newResources, ...resources]; // Put new content first
      setResources(updatedResources);
      saveResources(updatedResources);
      
      toast({
        title: "New Content Discovered!",
        description: `Found ${newResources.length} new educational articles and resources.`,
      });
    } catch (error) {
      toast({
        title: "Discovery Failed",
        description: "Unable to discover new content at this time.",
        variant: "destructive",
      });
    } finally {
      setIsDiscovering(false);
    }
  };

  const searchResources = async () => {
    // For now, just trigger discovery for the selected category
    setIsDiscovering(true);
    try {
      const searchResults = await ResourceDiscoveryService.discoverNewResources(
        resources,
        { dailyLimit: 5 } // Smaller limit for search
      );
      
      const updatedResources = [...searchResults, ...resources];
      setResources(updatedResources);
      saveResources(updatedResources);
      
      toast({
        title: "Search Complete",
        description: `Found ${searchResults.length} new resources.`,
      });
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Unable to search for resources at this time.",
        variant: "destructive",
      });
    } finally {
      setIsDiscovering(false);
    }
  };

  const toggleBookmark = (resourceId: string) => {
    const newBookmarks = new Set(bookmarkedIds);
    if (newBookmarks.has(resourceId)) {
      newBookmarks.delete(resourceId);
    } else {
      newBookmarks.add(resourceId);
    }
    setBookmarkedIds(newBookmarks);
    saveBookmarks(newBookmarks);
  };

  const handleRating = (resourceId: string, rating: number) => {
    const newRatings = {
      ...userRatings,
      [resourceId]: rating
    };
    setUserRatings(newRatings);
    localStorage.setItem('resourceHub-ratings', JSON.stringify(newRatings));
  };

  const filteredResources = resources.filter(resource => {
    const categoryMatch = selectedCategory === 'all' || resource.category === selectedCategory;
    return categoryMatch;
  });

  return {
    resources: filteredResources,
    selectedCategory,
    setSelectedCategory,
    isDiscovering,
    bookmarkedIds,
    userRatings,
    discoverNewContent,
    searchResources,
    toggleBookmark,
    handleRating
  };
};
