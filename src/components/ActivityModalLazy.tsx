import type React from "react";
import { lazy, Suspense } from "react";
import LazyLoadErrorBoundary from "@/components/error/LazyLoadErrorBoundary";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loading-spinner";

// Lazy load with shorter timeout
const ActivityModal = lazy(() => {
	const importPromise = import("@/components/ActivityModal");
	const timeoutPromise = new Promise((_, reject) =>
		setTimeout(() => reject(new Error("Component load timeout")), 3000),
	);

	return Promise.race([importPromise, timeoutPromise]) as Promise<
		typeof import("@/components/ActivityModal")
	>;
});

interface ActivityModalLazyProps {
	isOpen: boolean;
	onClose: () => void;
	selectedPillar: string | null;
}

const ActivityModalLoader = () => (
	<div className="flex items-center justify-center p-8">
		<div className="text-center space-y-3">
			<LoadingSpinner size="lg" />
			<p className="text-sm text-gray-600">Loading activity options...</p>
		</div>
	</div>
);

const ActivityModalLazy: React.FC<ActivityModalLazyProps> = ({
	isOpen,
	onClose,
	selectedPillar,
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
				<LazyLoadErrorBoundary componentName="Activity Modal">
					<Suspense fallback={<ActivityModalLoader />}>
						<ActivityModal
							isOpen={isOpen}
							onClose={onClose}
							selectedPillar={selectedPillar}
						/>
					</Suspense>
				</LazyLoadErrorBoundary>
			</DialogContent>
		</Dialog>
	);
};

export default ActivityModalLazy;
