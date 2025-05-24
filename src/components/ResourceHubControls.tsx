
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { ResourceCategory } from '@/types/resource';

interface ResourceHubControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: ResourceCategory | 'all';
  setSelectedCategory: (category: ResourceCategory | 'all') => void;
  onSearch: () => void;
  onDiscoverContent: () => void;
  isDiscovering: boolean;
}

const ResourceHubControls = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onSearch,
  onDiscoverContent,
  isDiscovering
}: ResourceHubControlsProps) => {
  return (
    <>
      {/* Search and Discovery */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            className="h-11"
          />
          <Button onClick={onSearch} disabled={isDiscovering} size="lg">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Button 
          onClick={onDiscoverContent} 
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
    </>
  );
};

export default ResourceHubControls;
