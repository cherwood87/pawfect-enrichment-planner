
import React from 'react';
import { EducationalArticle } from '@/types/resource';
import ResourceCard from './ResourceCard';

interface ResourceGridProps {
  resources: EducationalArticle[];
  bookmarkedIds: Set<string>;
  userRatings: Record<string, number>;
  onToggleBookmark: (resourceId: string) => void;
  onRating: (resourceId: string, rating: number) => void;
}

const ResourceGrid = ({
  resources,
  bookmarkedIds,
  userRatings,
  onToggleBookmark,
  onRating
}: ResourceGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          isBookmarked={bookmarkedIds.has(resource.id)}
          userRating={userRatings[resource.id]}
          onToggleBookmark={onToggleBookmark}
          onRating={onRating}
        />
      ))}
    </div>
  );
};

export default ResourceGrid;
