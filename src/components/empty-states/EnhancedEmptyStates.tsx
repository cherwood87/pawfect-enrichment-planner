import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Heart,
  Target,
  Sparkles,
  ArrowRight,
  Plus,
  BookOpen,
  Trophy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<any>;
  };
  variant?: 'default' | 'weekly' | 'activities' | 'favorites' | 'quiz';
}

export const EnhancedEmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  variant = 'default'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'weekly':
        return {
          icon: Calendar,
          gradient: 'from-blue-100 to-purple-100',
          iconColor: 'text-blue-500',
          buttonGradient: 'from-blue-500 to-purple-500'
        };
      case 'activities':
        return {
          icon: Target,
          gradient: 'from-green-100 to-emerald-100',
          iconColor: 'text-green-500',
          buttonGradient: 'from-green-500 to-emerald-500'
        };
      case 'favorites':
        return {
          icon: Heart,
          gradient: 'from-red-100 to-pink-100',
          iconColor: 'text-red-500',
          buttonGradient: 'from-red-500 to-pink-500'
        };
      case 'quiz':
        return {
          icon: Sparkles,
          gradient: 'from-yellow-100 to-orange-100',
          iconColor: 'text-yellow-500',
          buttonGradient: 'from-yellow-500 to-orange-500'
        };
      default:
        return {
          icon: Target,
          gradient: 'from-gray-100 to-gray-200',
          iconColor: 'text-gray-500',
          buttonGradient: 'from-gray-500 to-gray-600'
        };
    }
  };

  const styles = getVariantStyles();
  const IconComponent = styles.icon;

  return (
    <div className="text-center py-12 px-6">
      <div className={`w-16 h-16 bg-gradient-to-br ${styles.gradient} rounded-full flex items-center justify-center mb-4 mx-auto`}>
        <IconComponent className={`w-8 h-8 ${styles.iconColor}`} />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 mb-6 text-sm max-w-md mx-auto">
        {description}
      </p>
      
      {action && (
        <Button 
          onClick={action.onClick} 
          size="sm"
          className={`bg-gradient-to-r ${styles.buttonGradient} hover:opacity-90 transition-opacity`}
        >
          {action.icon && <action.icon className="w-4 h-4 mr-2" />}
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Specific empty state components for common use cases
export const WeeklyPlannerEmptyState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <EnhancedEmptyState
      variant="weekly"
      title="No activities scheduled this week"
      description="Add some enrichment activities to create a weekly plan for your dog!"
      action={{
        label: "Browse Activities",
        onClick: () => navigate('/activity-library'),
        icon: Plus
      }}
    />
  );
};

export const ActivityLibraryEmptyState: React.FC = () => (
  <EnhancedEmptyState
    variant="activities"
    title="No activities found"
    description="Try adjusting your filters or create a custom activity to get started."
  />
);

export const FavoritesEmptyState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <EnhancedEmptyState
      variant="favorites"
      title="No favorite activities yet"
      description="Mark activities as favorites to easily find them later!"
      action={{
        label: "Explore Activities",
        onClick: () => navigate('/activity-library'),
        icon: BookOpen
      }}
    />
  );
};

export const QuizIncompleteState: React.FC<{ onTakeQuiz: () => void }> = ({ onTakeQuiz }) => (
  <EnhancedEmptyState
    variant="quiz"
    title="Complete your enrichment quiz"
    description="Take our quick personality quiz to get personalized activity recommendations for your dog."
    action={{
      label: "Take Quiz",
      onClick: onTakeQuiz,
      icon: Sparkles
    }}
  />
);

export const ProgressEmptyState: React.FC = () => (
  <EnhancedEmptyState
    variant="default"
    title="No progress data yet"
    description="Complete some activities to start tracking your dog's enrichment progress!"
    action={{
      label: "Start Enriching",
      onClick: () => window.location.href = '/activity-library',
      icon: Trophy
    }}
  />
);