
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, Lightbulb, Dog, Star, Clock, ExternalLink, Bookmark, ThumbsUp, Eye } from 'lucide-react';
import { EducationalArticle, ResourceCategory } from '@/types/resource';
import { ResourceDiscoveryService } from '@/services/ResourceDiscoveryService';
import { useToast } from '@/hooks/use-toast';

const ResourceHubPage = () => {
  const [resources, setResources] = useState<EducationalArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadSavedResources();
    loadBookmarks();
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
      const updatedResources = [...resources, ...newResources];
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
    if (!searchQuery.trim()) return;
    
    setIsDiscovering(true);
    try {
      const searchResults = await ResourceDiscoveryService.searchResourcesWithFilters(
        searchQuery,
        selectedCategory === 'all' ? undefined : selectedCategory
      );
      
      // Add search results to existing resources
      const updatedResources = [...resources];
      searchResults.forEach(result => {
        if (!updatedResources.some(r => r.id === result.id)) {
          updatedResources.push(result);
        }
      });
      
      setResources(updatedResources);
      saveResources(updatedResources);
      
      toast({
        title: "Search Complete",
        description: `Found ${searchResults.length} resources for "${searchQuery}".`,
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
    setUserRatings(prev => ({
      ...prev,
      [resourceId]: rating
    }));
    localStorage.setItem('resourceHub-ratings', JSON.stringify({
      ...userRatings,
      [resourceId]: rating
    }));
  };

  useEffect(() => {
    loadSavedResources();
    loadBookmarks();
    const savedRatings = localStorage.getItem('resourceHub-ratings');
    if (savedRatings) {
      setUserRatings(JSON.parse(savedRatings));
    }
  }, []);

  const filteredResources = resources.filter(resource => {
    const categoryMatch = selectedCategory === 'all' || resource.category === selectedCategory;
    const searchMatch = !searchQuery || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return categoryMatch && searchMatch;
  });

  const getCategoryIcon = (category: ResourceCategory) => {
    const icons = {
      science: <Star className="h-4 w-4" />,
      'diy-projects': <Lightbulb className="h-4 w-4" />,
      'breed-specific': <Dog className="h-4 w-4" />,
      'product-reviews': <BookOpen className="h-4 w-4" />,
      'training-tips': <BookOpen className="h-4 w-4" />,
      'general-enrichment': <BookOpen className="h-4 w-4" />
    };
    return icons[category];
  };

  const getCategoryColor = (category: ResourceCategory) => {
    const colors = {
      science: 'bg-purple-100 text-purple-800 border-purple-200',
      'diy-projects': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'breed-specific': 'bg-blue-100 text-blue-800 border-blue-200',
      'product-reviews': 'bg-green-100 text-green-800 border-green-200',
      'training-tips': 'bg-orange-100 text-orange-800 border-orange-200',
      'general-enrichment': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category];
  };

  const getPlaceholderImage = (category: ResourceCategory) => {
    const images = {
      science: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop',
      'diy-projects': 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop',
      'breed-specific': 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=300&h=200&fit=crop',
      'product-reviews': 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&h=200&fit=crop',
      'training-tips': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop',
      'general-enrichment': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop'
    };
    return images[category];
  };

  const renderStarRating = (resourceId: string, credibilityScore: number) => {
    const userRating = userRatings[resourceId];
    const displayRating = userRating || credibilityScore;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(resourceId, star * 2)}
            className="hover:scale-110 transition-transform"
          >
            <Star 
              className={`h-4 w-4 ${
                star * 2 <= displayRating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="text-sm text-gray-600 ml-1">
          {userRating ? `Your rating: ${userRating}/10` : `${credibilityScore}/10`}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Resource Hub</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the latest research, expert tips, and evidence-based advice to enhance your dog's enrichment journey
            </p>
          </div>

          {/* Search and Discovery */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchResources()}
                className="h-11"
              />
              <Button onClick={searchResources} disabled={isDiscovering} size="lg">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              onClick={discoverNewContent} 
              disabled={isDiscovering}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isDiscovering ? 'Discovering...' : 'Discover New Content'}
            </Button>
          </div>

          {/* Category Filters */}
          <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ResourceCategory | 'all')}>
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-12">
              <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
              <TabsTrigger value="science" className="text-sm">Science</TabsTrigger>
              <TabsTrigger value="diy-projects" className="text-sm">DIY</TabsTrigger>
              <TabsTrigger value="breed-specific" className="text-sm">Breeds</TabsTrigger>
              <TabsTrigger value="product-reviews" className="text-sm">Reviews</TabsTrigger>
              <TabsTrigger value="training-tips" className="text-sm">Training</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-0 shadow-md">
              {/* Image Header */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={resource.imageUrl || getPlaceholderImage(resource.category)}
                  alt={resource.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge className={`${getCategoryColor(resource.category)} border`}>
                    <span className="flex items-center gap-1">
                      {getCategoryIcon(resource.category)}
                      {resource.category.replace('-', ' ')}
                    </span>
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleBookmark(resource.id)}
                  className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 hover:bg-white ${
                    bookmarkedIds.has(resource.id) ? 'text-yellow-500' : 'text-gray-600'
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                  {resource.title}
                </CardTitle>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {resource.estimatedReadTime} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {Math.floor(Math.random() * 500) + 100} views
                  </span>
                </div>

                {/* Interactive Rating */}
                <div className="mb-3">
                  {renderStarRating(resource.id, resource.credibilityScore)}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {resource.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.topics.slice(0, 3).map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs bg-gray-50 hover:bg-gray-100 transition-colors">
                      {topic}
                    </Badge>
                  ))}
                  {resource.topics.length > 3 && (
                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500">
                      +{resource.topics.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    <p className="font-medium text-gray-700">{resource.source}</p>
                    {resource.author && <p className="text-xs">by {resource.author}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" asChild className="group">
                      <a href={resource.sourceUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1 group-hover:translate-x-0.5 transition-transform" />
                        Read
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && !isDiscovering && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Resources Found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchQuery ? `No resources match "${searchQuery}". Try different keywords or browse all categories.` : 'Start your enrichment journey by discovering expert-curated content'}
            </p>
            <Button onClick={discoverNewContent} disabled={isDiscovering} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Discover Resources
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceHubPage;
