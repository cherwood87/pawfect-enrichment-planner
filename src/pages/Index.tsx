import { useCallback, useState } from "react";
import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardModals from "@/components/dashboard/DashboardModals";
import FloatingChatButton from "@/components/dashboard/FloatingChatButton";
import { useDog } from "@/contexts/DogContext";
import type { Dog } from "@/types/dog";

const Index = () => {
	const { currentDog } = useDog();
	const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
	const [isChatModalOpen, setIsChatModalOpen] = useState(false);
	const [isAddDogModalOpen, setIsAddDogModalOpen] = useState(false);
	const [isEditDogModalOpen, setIsEditDogModalOpen] = useState(false);
	const [selectedPillar, setSelectedPillar] = useState<string | null>(null);
	const [selectedDog, setSelectedDog] = useState<Dog | null>(null);

	const handlePillarSelect = useCallback((pillar: string) => {
		setSelectedPillar(pillar);
		setIsActivityModalOpen(true);
	}, []);

	const handleActivityModalClose = useCallback(() => {
		setIsActivityModalOpen(false);
		setSelectedPillar(null);
	}, []);

	const handleChatModalClose = useCallback(() => {
		setIsChatModalOpen(false);
	}, []);

	const handleChatModalOpen = useCallback(() => {
		setIsChatModalOpen(true);
	}, []);

	const handleAddDogModalOpen = useCallback(() => {
		setIsAddDogModalOpen(true);
	}, []);

	const handleAddDogModalClose = useCallback(() => {
		setIsAddDogModalOpen(false);
	}, []);

	const handleEditDogModalOpen = useCallback((dog: Dog) => {
		setSelectedDog(dog);
		setIsEditDogModalOpen(true);
	}, []);

	const handleEditDogModalClose = useCallback(() => {
		setIsEditDogModalOpen(false);
		setSelectedDog(null);
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 mobile-safe">
			{/* Header */}
			<DashboardHeader
				onChatOpen={handleChatModalOpen}
				onAddDogOpen={handleAddDogModalOpen}
			/>

			{/* Main Content */}
			<DashboardContent
				onAddDogOpen={handleAddDogModalOpen}
				onEditDogOpen={handleEditDogModalOpen}
				onPillarSelect={handlePillarSelect}
				onChatOpen={handleChatModalOpen}
			/>

			{/* Floating Chat Button */}
			{currentDog && <FloatingChatButton onChatOpen={handleChatModalOpen} />}

			{/* Modals */}
			<DashboardModals
				isActivityModalOpen={isActivityModalOpen}
				isChatModalOpen={isChatModalOpen}
				isAddDogModalOpen={isAddDogModalOpen}
				isEditDogModalOpen={isEditDogModalOpen}
				selectedPillar={selectedPillar}
				selectedDog={selectedDog}
				onActivityModalClose={handleActivityModalClose}
				onChatModalClose={handleChatModalClose}
				onAddDogModalClose={handleAddDogModalClose}
				onEditDogModalClose={handleEditDogModalClose}
			/>
		</div>
	);
};

export default Index;
