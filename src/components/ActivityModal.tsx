import { Target } from "lucide-react";
import type React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useActivity } from "@/contexts/ActivityContext";
import { getPillarActivities } from "@/data/activityLibrary";
import { useActivityModalHandlers } from "./ActivityModalHandlers";
import { useActivityModalState } from "./ActivityModalState";
import ActivityModalTabs from "./ActivityModalTabs";
import DaySelector from "./DaySelector";

interface ActivityModalProps {
	isOpen: boolean;
	onClose: () => void;
	selectedPillar?: string | null;
}

const ActivityModal: React.FC<ActivityModalProps> = ({
	isOpen,
	onClose,
	selectedPillar,
}) => {
	const { discoveredActivities } = useActivity();

	const {
		activeTab,
		setActiveTab,
		activityName,
		setActivityName,
		pillar,
		setPillar,
		duration,
		setDuration,
		materials,
		setMaterials,
		instructions,
		setInstructions,
		description,
		setDescription,
		selectedDayOfWeek,
		setSelectedDayOfWeek,
		resetCustomActivityForm,
	} = useActivityModalState(selectedPillar);

	const customActivityState = {
		activityName,
		pillar,
		duration,
		materials,
		instructions,
		description,
	};

	const {
		handleActivitySelect,
		handleCreateCustomActivity,
		handleCancelCustomActivity,
	} = useActivityModalHandlers(
		selectedDayOfWeek,
		onClose,
		resetCustomActivityForm,
		customActivityState,
	);

	const pendingActivities = discoveredActivities.filter(
		(activity) => !activity.approved && !activity.rejected,
	);

	// Get filtered library activities based on selected pillar
	const allLibraryActivities = getPillarActivities(selectedPillar || "");
	const filteredLibraryActivities = selectedPillar
		? allLibraryActivities.filter(
				(activity) => activity.pillar === selectedPillar,
			)
		: allLibraryActivities;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center space-x-2">
						<div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-2 rounded-2xl">
							<Target className="w-5 h-5 text-white" />
						</div>
						<span className="text-purple-800">Add Activity</span>
					</DialogTitle>
				</DialogHeader>

				<DaySelector
					selectedDayOfWeek={selectedDayOfWeek}
					onDaySelect={setSelectedDayOfWeek}
				/>

				<ActivityModalTabs
					activeTab={activeTab}
					onTabChange={setActiveTab}
					selectedPillar={selectedPillar}
					filteredLibraryActivities={filteredLibraryActivities}
					onActivitySelect={handleActivitySelect}
					pendingActivities={pendingActivities}
					discoveredActivities={discoveredActivities}
					activityName={activityName}
					setActivityName={setActivityName}
					pillar={pillar}
					setPillar={setPillar}
					duration={duration}
					setDuration={setDuration}
					materials={materials}
					setMaterials={setMaterials}
					instructions={instructions}
					setInstructions={setInstructions}
					description={description}
					setDescription={setDescription}
					onCreateCustomActivity={handleCreateCustomActivity}
					onCancelCustomActivity={handleCancelCustomActivity}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default ActivityModal;
