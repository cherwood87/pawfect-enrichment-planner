import { Filter, Search } from "lucide-react";
import type React from "react";
import { memo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface SearchAndFilterSectionProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	selectedPillar: string;
	setSelectedPillar: (pillar: string) => void;
	selectedDifficulty: string;
	setSelectedDifficulty: (difficulty: string) => void;
	filteredActivitiesCount: number;
}

const SearchAndFilterSection: React.FC<SearchAndFilterSectionProps> = ({
	searchQuery,
	setSearchQuery,
	selectedPillar,
	setSelectedPillar,
	selectedDifficulty,
	setSelectedDifficulty,
	filteredActivitiesCount,
}) => {
	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchQuery(e.target.value);
		},
		[setSearchQuery],
	);

	return (
		<div className="modern-card">
			<div className="mobile-card space-y-4">
				<div className="flex items-center space-x-2">
					<Search className="w-5 h-5 text-gray-400" />
					<h3 className="font-semibold text-gray-800">Search & Filter</h3>
					<Badge variant="secondary" className="text-xs">
						{filteredActivitiesCount} activities
					</Badge>
				</div>

				{/* Search Input */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
					<Input
						type="text"
						placeholder="Search activities..."
						value={searchQuery}
						onChange={handleSearchChange}
						className="pl-10 modern-input"
					/>
				</div>

				{/* Filters */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">Pillar</label>
						<Select value={selectedPillar} onValueChange={setSelectedPillar}>
							<SelectTrigger className="modern-select">
								<SelectValue placeholder="All Pillars" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Pillars</SelectItem>
								<SelectItem value="mental">Mental</SelectItem>
								<SelectItem value="physical">Physical</SelectItem>
								<SelectItem value="social">Social</SelectItem>
								<SelectItem value="environmental">Environmental</SelectItem>
								<SelectItem value="instinctual">Instinctual</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">
							Difficulty
						</label>
						<Select
							value={selectedDifficulty}
							onValueChange={setSelectedDifficulty}
						>
							<SelectTrigger className="modern-select">
								<SelectValue placeholder="All Difficulties" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Difficulties</SelectItem>
								<SelectItem value="Easy">Easy</SelectItem>
								<SelectItem value="Medium">Medium</SelectItem>
								<SelectItem value="Hard">Hard</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Active Filters Display */}
				{(selectedPillar !== "all" ||
					selectedDifficulty !== "all" ||
					searchQuery) && (
					<div className="flex flex-wrap gap-2 items-center">
						<Filter className="w-4 h-4 text-gray-500" />
						<span className="text-sm text-gray-600">Active filters:</span>
						{searchQuery && (
							<Badge variant="secondary" className="text-xs">
								Search: "{searchQuery}"
							</Badge>
						)}
						{selectedPillar !== "all" && (
							<Badge variant="secondary" className="text-xs">
								Pillar: {selectedPillar}
							</Badge>
						)}
						{selectedDifficulty !== "all" && (
							<Badge variant="secondary" className="text-xs">
								Difficulty: {selectedDifficulty}
							</Badge>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(SearchAndFilterSection);
