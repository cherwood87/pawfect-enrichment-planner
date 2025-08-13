import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
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
  return (
    <OnboardingFlow
      isOpen={isOpen}
      onClose={onClose}
      onTakeQuiz={onTakeQuiz}
      dog={dog}
    />
  );
};