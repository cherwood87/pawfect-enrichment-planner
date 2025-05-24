
import React from 'react';
import { useResourceHub } from '@/hooks/useResourceHub';
import ResourceHubHeader from '@/components/ResourceHubHeader';
import ResourceHubControls from '@/components/ResourceHubControls';
import ResourceGrid from '@/components/ResourceGrid';
import ResourceHubEmptyState from '@/components/ResourceHubEmptyState';

const ResourceHubPage = () => {
  const {
    resources,
    searchQuery,
    setSearchQuery,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <ResourceHubHeader />

          <ResourceHubControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSearch={searchResources}
            onDiscoverContent={discoverNewContent}
            isDiscovering={isDiscovering}
          />
        </div>

        {/* Content Grid */}
        {resources.length > 0 ? (
          <ResourceGrid
            resources={resources}
            bookmarkedIds={bookmarkedIds}
            userRatings={userRatings}
            onToggleBookmark={toggleBookmark}
            onRating={handleRating}
          />
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
