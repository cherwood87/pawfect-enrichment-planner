export interface QuizQuestion {
	id: string;
	question: string;
	pillar: string;
	options: Array<{ value: string; label: string; weight: number }>;
}

export interface QuizResults {
	ranking: Array<{
		pillar: string;
		rank: number;
		reason: string;
		score: number;
	}>;
	personality: string;
	recommendations: string[];
}
