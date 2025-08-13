import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, Clock, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ActivityStepTrackerProps {
  instructions: string[];
  currentStep: number;
  completedSteps: boolean[];
  duration: number;
  onStepComplete: (stepIndex: number) => void;
  onPreviousStep: () => void;
  onNextStep: () => void;
  onFinishActivity: () => void;
}

const ActivityStepTracker: React.FC<ActivityStepTrackerProps> = ({
  instructions,
  currentStep,
  completedSteps,
  duration,
  onStepComplete,
  onPreviousStep,
  onNextStep,
  onFinishActivity
}) => {
  const progress = (completedSteps.filter(Boolean).length / instructions.length) * 100;
  const estimatedTimePerStep = Math.round(duration / instructions.length);
  const isLastStep = currentStep === instructions.length - 1;
  const allStepsCompleted = completedSteps.every(Boolean);

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-white/70 rounded-3xl p-6 border border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-primary">Activity Progress</h3>
          </div>
          <Badge variant="secondary" className="rounded-2xl">
            {completedSteps.filter(Boolean).length} / {instructions.length} Steps
          </Badge>
        </div>
        
        <Progress value={progress} className="h-3 rounded-full" />
        
        <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
          <span>{Math.round(progress)}% Complete</span>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>~{estimatedTimePerStep} min per step</span>
          </div>
        </div>
      </div>

      {/* Current Step */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-6 border-2 border-primary/20">
        <div className="flex items-start gap-4">
          <button
            onClick={() => onStepComplete(currentStep)}
            className="mt-1 touch-target"
          >
            {completedSteps[currentStep] ? (
              <CheckCircle2 className="w-6 h-6 text-primary fill-current" />
            ) : (
              <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
            )}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="rounded-full">
                Step {currentStep + 1}
              </Badge>
              {completedSteps[currentStep] && (
                <Badge className="bg-primary/10 text-primary rounded-full">
                  ✓ Complete
                </Badge>
              )}
            </div>
            <p className="text-foreground leading-relaxed">
              {instructions[currentStep]}
            </p>
          </div>
        </div>
      </div>

      {/* All Steps Overview */}
      <div className="bg-white/70 rounded-3xl p-6 border border-muted">
        <h4 className="font-semibold text-foreground mb-4">All Steps</h4>
        <div className="space-y-3 max-h-40 overflow-y-auto">
          {instructions.map((step, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-2xl transition-all cursor-pointer ${
                index === currentStep
                  ? 'bg-primary/10 border border-primary/20'
                  : completedSteps[index]
                  ? 'bg-secondary/10'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => {
                // Allow jumping to any step
                if (index !== currentStep) {
                  // Update current step logic would go here
                }
              }}
            >
              {completedSteps[index] ? (
                <CheckCircle2 className="w-5 h-5 text-primary fill-current mt-0.5" />
              ) : (
                <Circle className={`w-5 h-5 mt-0.5 ${
                  index === currentStep ? 'text-primary' : 'text-muted-foreground'
                }`} />
              )}
              <span className={`text-sm ${
                index === currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}>
                Step {index + 1}: {step.substring(0, 60)}
                {step.length > 60 && '...'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={onPreviousStep}
          disabled={currentStep === 0}
          className="rounded-2xl"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-3">
          {!isLastStep ? (
            <Button
              onClick={onNextStep}
              className="rounded-2xl bg-primary hover:bg-primary/90"
            >
              Next Step
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={onFinishActivity}
              disabled={!allStepsCompleted}
              className="rounded-2xl bg-secondary hover:bg-secondary/90"
            >
              Finish Activity
              <Target className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityStepTracker;