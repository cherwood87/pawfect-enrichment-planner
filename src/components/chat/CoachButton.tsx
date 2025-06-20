import { HelpCircle } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";

interface CoachButtonProps {
	onClick: () => void;
}

const CoachButton: React.FC<CoachButtonProps> = ({ onClick }) => {
	return (
		<Button
			onClick={onClick}
			className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 via-cyan-500 to-amber-500 hover:from-purple-600 hover:via-cyan-600 hover:to-amber-600 shadow-2xl border-4 border-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-3xl"
			size="icon"
		>
			<div className="flex flex-col items-center space-y-1">
				<HelpCircle className="w-5 h-5 text-white" />
				<span className="text-xs text-white font-bold">Help</span>
			</div>
		</Button>
	);
};

export default CoachButton;
