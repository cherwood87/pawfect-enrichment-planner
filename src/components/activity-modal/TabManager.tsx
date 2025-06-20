import { memo } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabManagerProps {
	activeTab: string;
	onTabChange: (tab: string) => void;
	pendingActivitiesCount: number;
}

const TabManager = memo<TabManagerProps>(
	({ activeTab, onTabChange, pendingActivitiesCount }) => {
		return (
			<TabsList className="grid w-full grid-cols-3">
				<TabsTrigger value="browse">Browse Library</TabsTrigger>
				<TabsTrigger value="create">Create Custom</TabsTrigger>
				<TabsTrigger value="review" className="relative">
					Discovery Review
					{pendingActivitiesCount > 0 && (
						<span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
							{pendingActivitiesCount}
						</span>
					)}
				</TabsTrigger>
			</TabsList>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps.activeTab === nextProps.activeTab &&
			prevProps.pendingActivitiesCount === nextProps.pendingActivitiesCount
		);
	},
);

TabManager.displayName = "TabManager";

export default TabManager;
