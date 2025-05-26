
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, X } from 'lucide-react';

interface ActivityCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (notes: string) => void;
  activityTitle: string;
}

const ActivityCompletionModal: React.FC<ActivityCompletionModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  activityTitle
}) => {
  const [notes, setNotes] = useState('');

  const handleComplete = () => {
    onComplete(notes);
    setNotes('');
    onClose();
  };

  const handleCancel = () => {
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Complete Activity</span>
          </DialogTitle>
          <DialogDescription>
            Mark "{activityTitle}" as complete and add any notes about the experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="completion-notes" className="text-sm font-medium">
              How did it go? (Optional)
            </Label>
            <Textarea
              id="completion-notes"
              placeholder="Add notes about how your dog enjoyed this activity, any modifications you made, or observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2 min-h-[100px]"
            />
          </div>
          
          <div className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </Button>
            <Button
              onClick={handleComplete}
              className="bg-green-500 hover:bg-green-600 flex items-center space-x-1"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityCompletionModal;
