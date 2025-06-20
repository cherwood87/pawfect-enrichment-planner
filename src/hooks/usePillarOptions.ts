import { useMemo } from "react";

export const usePillarOptions = () => {
	const pillarOptions = useMemo(
		() => [
			{
				id: "mental",
				color: "purple",
				title: "Mental Enrichment",
				description:
					"For the thinkers and problem-solvers. Games and challenges that flex your dog's brain.",
				gradient: "from-purple-100 to-purple-50",
				borderColor: "border-purple-300",
			},
			{
				id: "physical",
				color: "green",
				title: "Physical Enrichment",
				description:
					"For dogs who find peace in movement. Soft walks, play, strength-building.",
				gradient: "from-emerald-100 to-emerald-50",
				borderColor: "border-emerald-300",
			},
			{
				id: "social",
				color: "blue",
				title: "Social Enrichment",
				description:
					"For dogs who connect through presence. Calm co-walking, play with friends.",
				gradient: "from-cyan-100 to-cyan-50",
				borderColor: "border-cyan-300",
			},
			{
				id: "environmental",
				color: "teal",
				title: "Environmental Enrichment",
				description:
					"For the sensory seekers. Sniffing, grounding, discovering the world.",
				gradient: "from-teal-100 to-teal-50",
				borderColor: "border-teal-300",
			},
			{
				id: "instinctual",
				color: "orange",
				title: "Instinctual Enrichment",
				description: "For dogs who need to shred, chew, stalk, or forage.",
				gradient: "from-amber-100 to-amber-50",
				borderColor: "border-amber-300",
			},
		],
		[],
	);

	return pillarOptions;
};
