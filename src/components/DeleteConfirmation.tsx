import type React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
}) => {
	return (
		<AlertDialog open={isOpen} onOpenChange={onClose}>
			<AlertDialogContent className="rounded-2xl">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-lg font-bold text-gray-800">
						{title}
					</AlertDialogTitle>
					<AlertDialogDescription className="text-gray-600">
						{message}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onClose} className="rounded-xl">
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className="bg-red-600 hover:bg-red-700 rounded-xl"
					>
						Delete Profile
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteConfirmation;
