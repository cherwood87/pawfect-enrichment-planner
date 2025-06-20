import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalNotesSectionProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

const AdditionalNotesSection: React.FC<AdditionalNotesSectionProps> = ({
  notes,
  onNotesChange,
}) => {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-800">Additional notes</h3>
      <Textarea
        placeholder="Any other observations, concerns, or memorable moments..."
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        className="min-h-[80px]"
      />
    </div>
  );
};

export default AdditionalNotesSection;
