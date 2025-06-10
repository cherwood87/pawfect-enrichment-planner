
import React, { Suspense, lazy } from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Lazy load the heavy ActivityModal component
const ActivityModal = lazy(() => import('@/components/ActivityModal'));

interface ActivityModalLazyProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPillar: string | null;
}

const ActivityModalLoader = () => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner size="lg" />
  </div>
);

const ActivityModalLazy: React.FC<ActivityModalLazyProps> = ({
  isOpen,
  onClose,
  selectedPillar
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <Suspense fallback={<ActivityModalLoader />}>
          <ActivityModal
            isOpen={isOpen}
            onClose={onClose}
            selectedPillar={selectedPillar}
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityModalLazy;
