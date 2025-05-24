
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

interface ResourceHubEmptyStateProps {
  searchQuery: string;
  onDiscoverContent: () => void;
  isDiscovering: boolean;
}

const ResourceHubEmptyState = ({ searchQuery, onDiscoverContent, isDiscovering }: ResourceHubEmptyStateProps) => {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <BookOpen className="h-12 w-12 text-blue-500" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Resources Found</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {searchQuery ? `No resources match "${searchQuery}". Try different keywords or browse all categories.` : 'Start your enrichment journey by discovering expert-curated content'}
      </p>
      <Button 
        onClick={onDiscoverContent} 
        disabled={isDiscovering} 
        size="lg" 
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        Discover Resources
      </Button>
    </div>
  );
};

export default ResourceHubEmptyState;
