
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Eye, Bookmark, ThumbsUp, ExternalLink, Dog, Lightbulb, BookOpen } from 'lucide-react';
import { EducationalArticle, ResourceCategory } from '@/types/resource';

interface ResourceCardProps {
  resource: EducationalArticle;
  isBookmarked: boolean;
  userRating?: number;
  onToggleBookmark: (resourceId: string) => void;
  onRating: (resourceId: string, rating: number) => void;
}

const ResourceCard = ({ 
  resource, 
  isBookmarked, 
  userRating, 
  onToggleBookmark, 
  onRating 
}: ResourceCardProps) => {
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
              className={`h-4 w-4 ${
                star * 2 <= displayRating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="text-sm text-gray-600 ml-1">
          {userRating ? `Your rating: ${userRating}/10` : `${resource.credibilityScore}/10`}
        </span>
      </div>
    );
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-0 shadow-md">
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
          onClick={() => onToggleBookmark(resource.id)}
          className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 hover:bg-white ${
            isBookmarked ? 'text-yellow-500' : 'text-gray-600'
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
          {renderStarRating()}
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
  );
};

export default ResourceCard;
