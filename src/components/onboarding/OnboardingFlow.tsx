import React, { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Brain, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Trophy,
  Calendar
} from 'lucide-react';
import { Dog } from '@/types/dog';
import { useDog } from '@/contexts/DogContext';
import { useNavigate } from 'react-router-dom';

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  dog: Dog;
  onTakeQuiz: () => void;
}

type OnboardingStep = 'welcome' | 'features' | 'quiz-prompt' | 'next-steps';

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  isOpen,
  onClose,
  dog,
  onTakeQuiz
}) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const navigate = useNavigate();
  const { setCurrentDog } = useDog();

  // Check if user has completed onboarding before
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem(`onboarding_completed_${dog.id}`);
    if (onboardingCompleted) {
      setHasSeenOnboarding(true);
    }
  }, [dog.id]);

  const steps: OnboardingStep[] = ['welcome', 'features', 'quiz-prompt', 'next-steps'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  }, [currentStepIndex, steps]);

  const handlePrevious = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  }, [currentStepIndex, steps]);

  const handleTakeQuiz = useCallback(() => {
    localStorage.setItem(`onboarding_completed_${dog.id}`, 'true');
    onClose();
    onTakeQuiz();
  }, [dog.id, onClose, onTakeQuiz]);

  const handleSkipToLibrary = useCallback(() => {
    localStorage.setItem(`onboarding_completed_${dog.id}`, 'true');
    onClose();
    navigate('/activity-library');
  }, [dog.id, onClose, navigate]);

  const handleCompleteOnboarding = useCallback(() => {
    localStorage.setItem(`onboarding_completed_${dog.id}`, 'true');
    onClose();
  }, [dog.id, onClose]);

  const renderWelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 bg-gradient-to-br from-purple-400 via-cyan-400 to-amber-400 rounded-full flex items-center justify-center mx-auto shadow-2xl">
        <Heart className="w-12 h-12 text-white" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-primary mb-4">
          Welcome, {dog.name}! 🎉
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          You've successfully created {dog.name}'s profile! Let's take a quick tour of what makes our enrichment planner special.
        </p>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleNext} size="lg" className="px-8">
          Let's Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );

  const renderFeaturesStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">
          The 5 Pillars of Enrichment
        </h2>
        <p className="text-muted-foreground">
          Our science-based approach focuses on five key areas for your dog's wellbeing
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { pillar: 'Mental', icon: Brain, color: 'purple', description: 'Puzzle games and problem-solving activities' },
          { pillar: 'Physical', icon: Trophy, color: 'blue', description: 'Exercise and movement challenges' },
          { pillar: 'Social', icon: Heart, color: 'pink', description: 'Interaction with people and other dogs' },
          { pillar: 'Environmental', icon: Sparkles, color: 'green', description: 'Exploring new sights, sounds, and textures' },
          { pillar: 'Instinctual', icon: Target, color: 'orange', description: 'Natural behaviors like sniffing and foraging' }
        ].map((item, idx) => (
          <Card key={idx} className="bg-gradient-to-r from-background to-muted border-2">
            <CardContent className="p-4 flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl bg-${item.color}-100 flex items-center justify-center`}>
                <item.icon className={`w-6 h-6 text-${item.color}-600`} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{item.pillar}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleNext}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderQuizPromptStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
        <Brain className="w-10 h-10 text-white" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-primary mb-4">
          Discover {dog.name}'s Preferences
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Our 2-minute personality quiz will help us recommend activities {dog.name} will love most, 
          tailored specifically for {dog.breed} dogs.
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>Breed-specific safety filtering</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>Personalized activity recommendations</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>AI-powered enrichment coaching</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={handleTakeQuiz} size="lg" className="px-8">
          Take the Quiz
          <Brain className="ml-2 h-5 w-5" />
        </Button>
        <Button variant="outline" onClick={handleNext}>
          Skip for now
        </Button>
      </div>

      <div className="flex justify-start">
        <Button variant="ghost" onClick={handlePrevious} size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    </div>
  );

  const renderNextStepsStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-primary mb-4">
          You're All Set! 🚀
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {dog.name}'s profile is ready. Here's what you can do next:
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 cursor-pointer hover:shadow-md transition-all" onClick={handleSkipToLibrary}>
          <CardContent className="p-6 flex items-center space-x-4">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div className="text-left">
              <h3 className="font-semibold text-blue-800">Browse Activity Library</h3>
              <p className="text-sm text-blue-600">Explore hundreds of enrichment activities</p>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-600 ml-auto" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200 cursor-pointer hover:shadow-md transition-all" onClick={handleTakeQuiz}>
          <CardContent className="p-6 flex items-center space-x-4">
            <Brain className="w-8 h-8 text-purple-600" />
            <div className="text-left">
              <h3 className="font-semibold text-purple-800">Take Personality Quiz</h3>
              <p className="text-sm text-purple-600">Get personalized recommendations</p>
            </div>
            <ArrowRight className="w-5 h-5 text-purple-600 ml-auto" />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={handlePrevious} size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleCompleteOnboarding} variant="outline">
          I'll explore on my own
        </Button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return renderWelcomeStep();
      case 'features':
        return renderFeaturesStep();
      case 'quiz-prompt':
        return renderQuizPromptStep();
      case 'next-steps':
        return renderNextStepsStep();
      default:
        return renderWelcomeStep();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStepIndex + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step content */}
          <div className="min-h-[400px] flex items-center justify-center">
            {renderCurrentStep()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};