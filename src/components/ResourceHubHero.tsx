
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, Lightbulb, Dog } from 'lucide-react';
import { ResourceCategory } from '@/types/resource';

interface ResourceHubHeroProps {
  selectedCategory: ResourceCategory | 'all';
  setSelectedCategory: (category: ResourceCategory | 'all') => void;
  onDiscoverContent: () => void;
  isDiscovering: boolean;
}

const ResourceHubHero = ({
  selectedCategory,
  setSelectedCategory,
  onDiscoverContent,
  isDiscovering
}: ResourceHubHeroProps) => {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 text-white py-16 px-4 mb-8 rounded-2xl overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
            <BookOpen className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Resource Hub</h1>
            <p className="text-xl text-white/90">Expert-curated content for your dog's enrichment journey</p>
          </div>
        </div>

        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
          Discover the latest research, expert tips, and evidence-based advice to enhance your dog's mental, physical, and emotional well-being
        </p>

        {/* Category Navigation */}
        <div className="mb-8">
          <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ResourceCategory | 'all')}>
            <TabsList className="bg-white/10 border-white/20 h-12 p-1 backdrop-blur-sm">
              <TabsTrigger value="all" className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-600">
                <Search className="h-4 w-4 mr-2" />
                All Content
              </TabsTrigger>
              <TabsTrigger value="science" className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-600">
                <BookOpen className="h-4 w-4 mr-2" />
                Research
              </TabsTrigger>
              <TabsTrigger value="diy-projects" className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-600">
                <Lightbulb className="h-4 w-4 mr-2" />
                DIY Projects
              </TabsTrigger>
              <TabsTrigger value="breed-specific" className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-600">
                <Dog className="h-4 w-4 mr-2" />
                Breed Guide
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Action Button */}
        <Button 
          onClick={onDiscoverContent}
          disabled={isDiscovering}
          size="lg"
          className="bg-white text-blue-600 hover:bg-white/90 hover:text-blue-700 px-8 py-6 text-lg font-semibold shadow-lg"
        >
          {isDiscovering ? 'Discovering Content...' : 'Discover New Resources'}
        </Button>
      </div>
    </div>
  );
};

export default ResourceHubHero;
