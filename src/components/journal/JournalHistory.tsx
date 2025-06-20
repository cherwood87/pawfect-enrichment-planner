import { format, parseISO } from "date-fns";
import {
	Calendar,
	ChevronDown,
	ChevronUp,
	Clock,
	MessageSquare,
	Trash2,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOOD_RATINGS } from "@/constants/journalConstants";
import { JournalService } from "@/services/journalService";
import type { JournalEntry } from "@/types/journal";

interface JournalHistoryProps {
	dogId: string;
	dogName: string;
}

const JournalHistory: React.FC<JournalHistoryProps> = ({ dogId, dogName }) => {
	const [entries, setEntries] = useState<JournalEntry[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [expandedDate, setExpandedDate] = useState<string | null>(null);

	useEffect(() => {
		loadEntries();
	}, [loadEntries]);

	const loadEntries = async () => {
		try {
			setIsLoading(true);
			const journalEntries = await JournalService.getEntries(dogId);
			setEntries(journalEntries);
		} catch (error) {
			console.error("Error loading journal entries:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteEntry = async (entryId: string) => {
		if (
			!entryId ||
			!window.confirm("Are you sure you want to delete this journal entry?")
		)
			return;

		try {
			await JournalService.deleteEntry(entryId);
			setEntries(entries.filter((entry) => entry.id !== entryId));
		} catch (error) {
			console.error("Error deleting entry:", error);
		}
	};

	const getMoodIcon = (mood: string) => {
		const moodRating = MOOD_RATINGS.find((rating) => rating.mood === mood);
		if (!moodRating) return null;
		const IconComponent = moodRating.icon;
		return <IconComponent className={`w-4 h-4 ${moodRating.color}`} />;
	};

	const formatTime = (timestamp?: string) => {
		if (!timestamp) return "";
		try {
			return format(parseISO(timestamp), "h:mm a");
		} catch (_error) {
			return "";
		}
	};

	// Group entries by date
	const entriesByDate = entries.reduce(
		(acc, entry) => {
			if (!acc[entry.date]) {
				acc[entry.date] = [];
			}
			acc[entry.date].push(entry);
			return acc;
		},
		{} as Record<string, JournalEntry[]>,
	);

	const dates = Object.keys(entriesByDate).sort((a, b) => b.localeCompare(a));

	if (isLoading) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center py-8">
					<div className="text-gray-500">Loading journal entries...</div>
				</CardContent>
			</Card>
		);
	}

	if (entries.length === 0) {
		return (
			<Card>
				<CardContent className="flex flex-col items-center justify-center py-8 text-center">
					<MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
					<h3 className="text-lg font-medium text-gray-700 mb-2">
						No Journal Entries Yet
					</h3>
					<p className="text-gray-500">
						Start writing daily reflections about {dogName} to see them here.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Calendar className="w-5 h-5 text-orange-500" />
					<span>Journal History for {dogName}</span>
					<Badge variant="outline" className="ml-auto">
						{entries.length} total entries
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{dates.map((date) => {
					const dayEntries = entriesByDate[date];
					const isExpanded = expandedDate === date;
					const entryDate = parseISO(date);

					return (
						<div
							key={date}
							className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
						>
							<div
								className="flex items-center justify-between cursor-pointer"
								onClick={() => setExpandedDate(isExpanded ? null : date)}
							>
								<div className="flex items-center space-x-3">
									<div className="text-sm font-medium text-gray-800">
										{format(entryDate, "EEEE, MMMM d, yyyy")}
									</div>
									<Badge variant="secondary" className="text-xs">
										{dayEntries.length}{" "}
										{dayEntries.length === 1 ? "entry" : "entries"}
									</Badge>
								</div>
								{isExpanded ? (
									<ChevronUp className="w-4 h-4 text-gray-500" />
								) : (
									<ChevronDown className="w-4 h-4 text-gray-500" />
								)}
							</div>

							{isExpanded && (
								<div className="mt-4 space-y-4 border-t pt-4">
									{dayEntries.map((entry) => (
										<div
											key={entry.id}
											className="bg-white border rounded-lg p-4"
										>
											<div className="flex items-start justify-between mb-3">
												<div className="flex items-center space-x-2">
													{entry.entryTimestamp && (
														<div className="flex items-center space-x-1 text-gray-500">
															<Clock className="w-3 h-3" />
															<span className="text-xs">
																{formatTime(entry.entryTimestamp)}
															</span>
														</div>
													)}
													{entry.mood && (
														<div className="flex items-center space-x-1">
															{getMoodIcon(entry.mood)}
															<span className="text-xs text-gray-600">
																{entry.mood}
															</span>
														</div>
													)}
													{entry.behaviors.length > 0 && (
														<Badge variant="secondary" className="text-xs">
															{entry.behaviors.length} behaviors
														</Badge>
													)}
												</div>
												<Button
													variant="ghost"
													size="sm"
													onClick={(e) => {
														e.stopPropagation();
														entry.id && handleDeleteEntry(entry.id);
													}}
													className="text-red-500 hover:text-red-700 hover:bg-red-50"
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>

											{/* Prompt and Response */}
											<div className="space-y-2">
												<div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
													<p className="text-sm font-medium text-blue-800 mb-1">
														Prompt:
													</p>
													<p className="text-sm text-blue-700">
														{entry.prompt}
													</p>
												</div>
												{entry.response && (
													<div className="p-3 bg-gray-50 rounded-lg">
														<p className="text-sm font-medium text-gray-800 mb-1">
															Response:
														</p>
														<p className="text-sm text-gray-700 whitespace-pre-wrap">
															{entry.response}
														</p>
													</div>
												)}
											</div>

											{/* Behaviors */}
											{entry.behaviors.length > 0 && (
												<div className="mt-3">
													<p className="text-sm font-medium text-gray-800 mb-2">
														Behaviors observed:
													</p>
													<div className="flex flex-wrap gap-2">
														{entry.behaviors.map((behavior, index) => (
															<Badge
																key={index}
																variant="secondary"
																className="text-xs"
															>
																{behavior}
															</Badge>
														))}
													</div>
												</div>
											)}

											{/* Additional Notes */}
											{entry.notes && (
												<div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
													<p className="text-sm font-medium text-yellow-800 mb-1">
														Additional notes:
													</p>
													<p className="text-sm text-yellow-700 whitespace-pre-wrap">
														{entry.notes}
													</p>
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
};

export default JournalHistory;
