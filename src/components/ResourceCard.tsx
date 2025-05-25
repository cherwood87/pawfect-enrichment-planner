
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Bookmark, ExternalLink, Calendar } from 'lucide-react';
import { EducationalArticle, ResourceCategory } from '@/types/resource';

interface ResourceCardProps {
  resource: EducationalArticle;
  isBookmarked: boolean;
  userRating?: number;
  onToggleBookmark: (resourceId: string) => void;
  onRating: (resourceId: string, rating: number) => void;
  layout?: 'grid' | 'featured';
}

const ResourceCard = ({ 
  resource, 
  isBookmarked, 
  userRating, 
  onToggleBookmark, 
  onRating,
  layout = 'grid'
}: ResourceCardProps) => {
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
      science: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=250&fit=crop',
      'diy-projects': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop',
      'breed-specific': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=250&fit=crop',
      'product-reviews': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop',
      'training-tips': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop',
      'general-enrichment': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=250&fit=crop'
    };
    return images[category];
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  const renderStarRating = () => {
    const displayRating = userRating || resource.credibilityScore;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRating(resource.id, star * 2)}
            className="hover:scale-110 transition-transform"
          >
            <Star 
              className={`h-3 w-3 ${
                star * 2 <= displayRating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="text-xs text-gray-500 ml-1">
          {Math.round(displayRating / 2 * 10) / 10}
        </span>
      </div>
    );
  };

  if (layout === 'featured') {
    return (
      <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-0 shadow-lg bg-white">
        <div className="relative h-64 overflow-hidden">
          <img 
            src={resource.imageUrl || getPlaceholderImage(resource.category)}
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute top-4 left-4">
            <Badge className={`${getCategoryColor(resource.category)} border font-medium`}>
              {resource.category.replace('-', ' ')}
            </Badge>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleBookmark(resource.id)}
            className={`absolute top-4 right-4 h-9 w-9 rounded-full bg-white/90 hover:bg-white ${
              isBookmarked ? 'text-yellow-500' : 'text-gray-600'
            }`}
          >
            <Bookmark className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-xl font-bold mb-2 leading-tight">
              {resource.title}
            </h3>
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {resource.estimatedReadTime} min
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(resource.publishDate)}
              </span>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
            {resource.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              {renderStarRating()}
              <p className="text-sm text-gray-500 mt-1">{resource.source}</p>
            </div>
            
            <Button variant="outline" size="sm" asChild className="group">
              <a href={resource.sourceUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1 group-hover:translate-x-0.5 transition-transform" />
                Read More
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default grid layout
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-0 shadow-md bg-white">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={resource.imageUrl || getPlaceholderImage(resource.category)}
          alt={resource.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge className={`${getCategoryColor(resource.category)} border text-xs`}>
            {resource.category.replace('-', ' ')}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleBookmark(resource.id)}
          className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 hover:bg-white ${
            isBookmarked ? 'text-yellow-500' : 'text-gray-600'
          }`}
        >
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
          {resource.title}
        </h3>
        
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {resource.estimatedReadTime} min
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(resource.publishDate)}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {resource.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            {renderStarRating()}
            <p className="text-xs text-gray-500">{resource.source}</p>
          </div>
          
          <Button variant="outline" size="sm" asChild className="group text-xs">
            <a href={resource.sourceUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3 mr-1 group-hover:translate-x-0.5 transition-transform" />
              Read
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
