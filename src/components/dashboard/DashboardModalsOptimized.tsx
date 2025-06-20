import React, { Suspense, lazy, memo, useMemo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Dog } from "@/types/dog";
import { ActivityHelpContext } from "@/types/activityContext";

// Lazy load heavy components
const ActivityModalLazy = lazy(() => import("@/components/ActivityModalLazy"));
const ChatModal = lazy(() => import("@/components/chat/ChatModal"));
const AddDogForm = lazy(() => import("@/components/AddDogForm"));
const EditDogForm = lazy(() => import("@/components/EditDogForm"));

interface DashboardModalsProps {
  isActivityModalOpen: boolean;
  isChatModalOpen: boolean;
  isAddDogModalOpen: boolean;
  isEditDogModalOpen: boolean;
  selectedPillar: string | null;
  selectedDog: Dog | null;
  chatContext?: ActivityHelpContext;
  onActivityModalClose: () => void;
  onChatModalClose: () => void;
  onAddDogModalClose: () => void;
  onEditDogModalClose: () => void;
}

const ModalLoader = () => (
  <div className="flex items-center justify-center p-8">
    <LoadingSpinner size="lg" />
  </div>
);

const DashboardModalsOptimized = memo<DashboardModalsProps>(
  ({
    isActivityModalOpen,
    isChatModalOpen,
    isAddDogModalOpen,
    isEditDogModalOpen,
    selectedPillar,
    selectedDog,
    chatContext,
    onActivityModalClose,
    onChatModalClose,
    onAddDogModalClose,
    onEditDogModalClose,
  }) => {
    // Memoize modal props to prevent unnecessary re-renders
    const activityModalProps = useMemo(
      () => ({
        isOpen: isActivityModalOpen,
        onClose: onActivityModalClose,
        selectedPillar,
      }),
      [isActivityModalOpen, onActivityModalClose, selectedPillar],
    );

    const chatModalProps = useMemo(
      () => ({
        isOpen: isChatModalOpen,
        onClose: onChatModalClose,
        chatContext,
      }),
      [isChatModalOpen, onChatModalClose, chatContext],
    );

    return (
      <>
        {/* Activity Modal - Only render when needed */}
        {isActivityModalOpen && (
          <Suspense fallback={<ModalLoader />}>
            <ActivityModalLazy {...activityModalProps} />
          </Suspense>
        )}

        {/* Chat Modal - Only render when needed */}
        {isChatModalOpen && (
          <Suspense fallback={<ModalLoader />}>
            <ChatModal {...chatModalProps} />
          </Suspense>
        )}

        {/* Add Dog Modal */}
        <Dialog open={isAddDogModalOpen} onOpenChange={onAddDogModalClose}>
          <DialogContent className="max-w-2xl">
            <div className="overflow-y-auto max-h-[80vh] p-4">
              {isAddDogModalOpen && (
                <Suspense fallback={<ModalLoader />}>
                  <AddDogForm onClose={onAddDogModalClose} />
                </Suspense>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dog Modal */}
        <Dialog open={isEditDogModalOpen} onOpenChange={onEditDogModalClose}>
          <DialogContent className="max-w-2xl">
            <div className="overflow-y-auto max-h-[80vh] p-4">
              {isEditDogModalOpen && selectedDog && (
                <Suspense fallback={<ModalLoader />}>
                  <EditDogForm
                    dog={selectedDog}
                    onClose={onEditDogModalClose}
                  />
                </Suspense>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for memo optimization
    return (
      prevProps.isActivityModalOpen === nextProps.isActivityModalOpen &&
      prevProps.isChatModalOpen === nextProps.isChatModalOpen &&
      prevProps.isAddDogModalOpen === nextProps.isAddDogModalOpen &&
      prevProps.isEditDogModalOpen === nextProps.isEditDogModalOpen &&
      prevProps.selectedPillar === nextProps.selectedPillar &&
      prevProps.selectedDog?.id === nextProps.selectedDog?.id &&
      JSON.stringify(prevProps.chatContext) ===
        JSON.stringify(nextProps.chatContext)
    );
  },
);

DashboardModalsOptimized.displayName = "DashboardModalsOptimized";

export default DashboardModalsOptimized;
