
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Zap, Trophy } from 'lucide-react';
import { useLearningSystem } from '@/hooks/useLearningSystem';

interface ActivityFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityId: string;
  activityTitle: string;
  activityType: 'library' | 'user' | 'discovered';
}

const ActivityFeedbackModal: React.FC<ActivityFeedbackModalProps> = ({
  isOpen,
  onClose,
  activityId,
  activityTitle,
  activityType
}) => {
  const [rating, setRating] = useState(0);
  const [difficultyRating, setDifficultyRating] = useState(0);
  const [engagementRating, setEngagementRating] = useState(0);
  const [enjoymentRating, setEnjoymentRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { submitFeedback, isLoading } = useLearningSystem();

  const availableTags = [
    'Too Easy', 'Too Hard', 'Perfect Difficulty',
    'Very Engaging', 'Somewhat Boring', 'Dog Loved It',
    'Good for Rainy Days', 'Outdoor Activity', 'Quick Setup',
    'Needs More Materials', 'Great Exercise', 'Mental Challenge'
  ];

  const handleSubmit = async () => {
    await submitFeedback(activityId, activityType, {
      rating: rating || undefined,
      difficultyRating: difficultyRating || undefined,
      engagementRating: engagementRating || undefined,
      enjoymentRating: enjoymentRating || undefined,
      feedbackText: feedbackText || undefined,
      wouldRecommend: wouldRecommend || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined
    });

    // Reset form
    setRating(0);
    setDifficultyRating(0);
    setEngagementRating(0);
    setEnjoymentRating(0);
    setFeedbackText('');
    setWouldRecommend(null);
    setSelectedTags([]);
    
    onClose();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const StarRating = ({ 
    label, 
    icon: Icon, 
    value, 
    onChange, 
    color = "text-yellow-500" 
  }: {
    label: string;
    icon: any;
    value: number;
    onChange: (value: number) => void;
    color?: string;
  }) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${color}`} />
        {label}
      </Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`h-8 w-8 rounded-full border-2 transition-all ${
              star <= value 
                ? 'border-yellow-500 bg-yellow-500 text-white' 
                : 'border-gray-300 hover:border-yellow-400'
            }`}
          >
            <Star className="h-4 w-4 mx-auto" fill={star <= value ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Share Your Experience</DialogTitle>
          <DialogDescription>
            How did "{activityTitle}" go? Your feedback helps us improve recommendations for you and your dog.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Rating */}
          <StarRating
            label="Overall Rating"
            icon={Star}
            value={rating}
            onChange={setRating}
          />

          {/* Detailed Ratings */}
          <div className="grid md:grid-cols-3 gap-4">
            <StarRating
              label="Difficulty"
              icon={Trophy}
              value={difficultyRating}
              onChange={setDifficultyRating}
              color="text-blue-500"
            />
            <StarRating
              label="Engagement"
              icon={Zap}
              value={engagementRating}
              onChange={setEngagementRating}
              color="text-purple-500"
            />
            <StarRating
              label="Enjoyment"
              icon={Heart}
              value={enjoymentRating}
              onChange={setEnjoymentRating}
              color="text-pink-500"
            />
          </div>

          {/* Would Recommend */}
          <div className="space-y-2">
            <Label>Would you recommend this activity to other dog owners?</Label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={wouldRecommend === true ? "default" : "outline"}
                onClick={() => setWouldRecommend(true)}
                className="flex-1"
              >
                Yes, definitely!
              </Button>
              <Button
                type="button"
                variant={wouldRecommend === false ? "default" : "outline"}
                onClick={() => setWouldRecommend(false)}
                className="flex-1"
              >
                Not really
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Quick Tags (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-purple-100"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Written Feedback */}
          <div className="space-y-2">
            <Label htmlFor="feedback">Additional Comments (optional)</Label>
            <Textarea
              id="feedback"
              placeholder="Tell us more about your experience, what worked well, or suggestions for improvement..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Skip
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityFeedbackModal;
