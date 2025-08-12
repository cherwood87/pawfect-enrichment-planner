import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dog } from "@/types/dog";
import { BreedAwareQuizAnalysisService } from "@/services/domain/BreedAwareQuizAnalysisService";

interface BreedSafetyWarningsProps {
  dog: Dog;
}

export const BreedSafetyWarnings = ({ dog }: BreedSafetyWarningsProps) => {
  const warnings = BreedAwareQuizAnalysisService.getBreedSafetyWarnings(dog);

  if (warnings.length === 0) return null;

  return (
    <div className="space-y-2">
      {warnings.map((warning, index) => (
        <Alert key={index} variant="destructive" className="border-warning bg-warning/5">
          <AlertDescription className="text-sm font-medium">
            {warning}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};