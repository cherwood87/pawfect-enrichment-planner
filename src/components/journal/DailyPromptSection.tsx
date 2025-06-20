import type React from "react";
import { Textarea } from "@/components/ui/textarea";
import type { JournalEntry } from "@/types/journal";

interface DailyPromptSectionProps {
	currentEntry: JournalEntry;
	onResponseChange: (response: string) => void;
}

const DailyPromptSection: React.FC<DailyPromptSectionProps> = ({
	currentEntry,
	onResponseChange,
}) => {
	return (
		<div className="space-y-3">
			<h3 className="font-medium text-gray-800">Today's Reflection</h3>
			<div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
				<p className="text-sm font-medium text-blue-800 mb-2">Prompt:</p>
				<p className="text-sm text-blue-700">{currentEntry.prompt}</p>
			</div>
			<Textarea
				placeholder="Share your thoughts about today's experiences with your dog..."
				value={currentEntry.response}
				onChange={(e) => onResponseChange(e.target.value)}
				className="min-h-[100px]"
			/>
		</div>
	);
};

export default DailyPromptSection;
