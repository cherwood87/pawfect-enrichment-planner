import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseActivityStepTrackerProps {
  instructions: string[];
  onFinish?: () => void;
}

export const useActivityStepTracker = ({ instructions, onFinish }: UseActivityStepTrackerProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    new Array(instructions.length).fill(false)
  );

  const onStepComplete = useCallback((stepIndex: number) => {
    setCompletedSteps(prev => {
      const updated = [...prev];
      updated[stepIndex] = !updated[stepIndex];
      
      if (updated[stepIndex]) {
        toast.success(`Step ${stepIndex + 1} completed!`);
      }
      
      return updated;
    });
  }, []);

  const onPreviousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  const onNextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(instructions.length - 1, prev + 1));
  }, [instructions.length]);

  const onFinishActivity = useCallback(() => {
    const allCompleted = completedSteps.every(Boolean);
    
    if (!allCompleted) {
      toast.error('Please complete all steps before finishing the activity.');
      return;
    }

    toast.success('🎉 Activity completed! Great job!');
    onFinish?.();
  }, [completedSteps, onFinish]);

  const resetProgress = useCallback(() => {
    setCurrentStep(0);
    setCompletedSteps(new Array(instructions.length).fill(false));
  }, [instructions.length]);

  return {
    currentStep,
    completedSteps,
    onStepComplete,
    onPreviousStep,
    onNextStep,
    onFinishActivity,
    resetProgress,
    isCompleted: completedSteps.every(Boolean),
    progress: (completedSteps.filter(Boolean).length / instructions.length) * 100
  };
};