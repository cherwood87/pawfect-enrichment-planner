import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, ArrowRight, X, CheckCircle } from 'lucide-react';
import { Dog } from '@/types/dog';

interface PostDogCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTakeQuiz: () => void;
  dog: Dog;
}

export const PostDogCreationModal: React.FC<PostDogCreationModalProps> = ({
  isOpen,
  onClose,
  onTakeQuiz,
  dog
}) => {
  const handleTakeQuiz = () => {
    onClose();
    onTakeQuiz();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-primary">
              🎉 Welcome {dog.name}!
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Success message */}
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-muted-foreground">
              {dog.name}'s profile has been created successfully! Now let's unlock their personalized enrichment plan.
            </p>
          </div>

          {/* Quiz prompt card */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Take the Enrichment Quiz</h3>
              </div>
              
              <div className="space-y-3 mb-6">
                <p className="text-sm text-muted-foreground">
                  Our 2-minute personality quiz will help us understand {dog.name}'s unique enrichment preferences:
                </p>
                
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Breed-specific activity recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Safety-first filtering for {dog.breed} dogs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Personalized AI coaching</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={handleTakeQuiz} className="flex-1">
                  Take Quiz Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Skip for now
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-center text-muted-foreground">
            You can always take the quiz later from {dog.name}'s profile or activity library
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};