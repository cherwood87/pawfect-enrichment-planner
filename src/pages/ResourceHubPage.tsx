
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, Lightbulb, Dog, Star, Clock, ExternalLink, Bookmark } from 'lucide-react';
import { EducationalArticle, ResourceCategory } from '@/types/resource';
import { ResourceDiscoveryService } from '@/services/ResourceDiscoveryService';
import { useToast } from '@/hooks/use-toast';

const ResourceHubPage = () => {
  const [resources, setResources] = useState<EducationalArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
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
      science: 'bg-purple-100 text-purple-800',
      'diy-projects': 'bg-yellow-100 text-yellow-800',
      'breed-specific': 'bg-blue-100 text-blue-800',
      'product-reviews': 'bg-green-100 text-green-800',
      'training-tips': 'bg-orange-100 text-orange-800',
      'general-enrichment': 'bg-gray-100 text-gray-800'
    };
    return colors[category];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Resource Hub</h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover the latest research, tips, and expert advice on dog enrichment
          </p>

          {/* Search and Discovery */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchResources()}
              />
              <Button onClick={searchResources} disabled={isDiscovering}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              onClick={discoverNewContent} 
              disabled={isDiscovering}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isDiscovering ? 'Discovering...' : 'Discover New Content'}
            </Button>
          </div>

          {/* Category Filters */}
          <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ResourceCategory | 'all')}>
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="science">Science</TabsTrigger>
              <TabsTrigger value="diy-projects">DIY</TabsTrigger>
              <TabsTrigger value="breed-specific">Breeds</TabsTrigger>
              <TabsTrigger value="product-reviews">Reviews</TabsTrigger>
              <TabsTrigger value="training-tips">Training</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Badge className={`mb-2 ${getCategoryColor(resource.category)}`}>
                      <span className="flex items-center gap-1">
                        {getCategoryIcon(resource.category)}
                        {resource.category.replace('-', ' ')}
                      </span>
                    </Badge>
                    <CardTitle className="text-lg leading-tight mb-2">
                      {resource.title}
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBookmark(resource.id)}
                    className={bookmarkedIds.has(resource.id) ? 'text-yellow-500' : 'text-gray-400'}
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {resource.estimatedReadTime} min read
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {resource.credibilityScore}/10
                  </span>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {resource.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.topics.slice(0, 3).map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <p className="font-medium">{resource.source}</p>
                    {resource.author && <p>by {resource.author}</p>}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={resource.sourceUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Read More
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && !isDiscovering && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Resources Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? `No resources match "${searchQuery}"` : 'Start by discovering new content'}
            </p>
            <Button onClick={discoverNewContent} disabled={isDiscovering}>
              Discover Resources
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceHubPage;
