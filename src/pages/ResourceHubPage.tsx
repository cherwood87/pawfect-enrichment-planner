
import React, { useState } from 'react';
import { useResourceHub } from '@/hooks/useResourceHub';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import ResourceHubHero from '@/components/ResourceHubHero';
import ResourceCard from '@/components/ResourceCard';
import ResourceHubEmptyState from '@/components/ResourceHubEmptyState';
import ApiKeySetup from '@/components/ApiKeySetup';
import { RealWebScrapingService } from '@/services/RealWebScrapingService';

const ResourceHubPage = () => {
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    resources,
    selectedCategory,
    setSelectedCategory,
    isDiscovering,
    bookmarkedIds,
    userRatings,
    discoverNewContent,
    searchResources,
    toggleBookmark,
    handleRating
  } = useResourceHub();

  // Check if API key is configured
  React.useEffect(() => {
    const hasApiKey = RealWebScrapingService.getApiKey();
    if (!hasApiKey && resources.length === 0) {
      setShowApiSetup(true);
    }
  }, [resources.length]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchResources();
    }
  };

  if (showApiSetup) {
    return <ApiKeySetup onComplete={() => setShowApiSetup(false)} />;
  }

  const featuredResources = resources.slice(0, 2);
  const regularResources = resources.slice(2);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Hero Section */}
        <ResourceHubHero
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onDiscoverContent={discoverNewContent}
          isDiscovering={isDiscovering}
        />

        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto flex gap-3">
            <Input
              placeholder="Search for enrichment tips, research, DIY projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="h-12 text-lg"
            />
            <Button 
              onClick={handleSearch} 
              disabled={isDiscovering}
              size="lg"
              className="px-8"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content Sections */}
        {resources.length > 0 ? (
          <div className="space-y-12">
            {/* Featured Articles */}
            {featuredResources.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Featured Resources</h2>
                  <div className="h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 flex-1 ml-6"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featuredResources.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      isBookmarked={bookmarkedIds.has(resource.id)}
                      userRating={userRatings[resource.id]}
                      onToggleBookmark={toggleBookmark}
                      onRating={handleRating}
                      layout="featured"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Latest Resources */}
            {regularResources.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Latest Resources</h2>
                  <div className="h-0.5 bg-gradient-to-r from-green-500 to-blue-500 flex-1 ml-6"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {regularResources.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      isBookmarked={bookmarkedIds.has(resource.id)}
                      userRating={userRatings[resource.id]}
                      onToggleBookmark={toggleBookmark}
                      onRating={handleRating}
                      layout="grid"
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <ResourceHubEmptyState
            searchQuery={searchQuery}
            onDiscoverContent={discoverNewContent}
            isDiscovering={isDiscovering}
          />
        )}
      </div>
    </div>
  );
};

export default ResourceHubPage;
