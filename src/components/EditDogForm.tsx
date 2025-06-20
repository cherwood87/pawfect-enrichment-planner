import { Trash2, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDog } from "@/contexts/DogContext";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Dog } from "@/types/dog";
import DeleteConfirmation from "./DeleteConfirmation";
import DogFormFields from "./DogFormFields";

interface EditDogFormProps {
	dog: Dog;
	onClose: () => void;
}

const EditDogForm: React.FC<EditDogFormProps> = ({ dog, onClose }) => {
	const { updateDog, deleteDog } = useDog();
	const _isMobile = useIsMobile();
	const [formData, setFormData] = useState({
		name: dog.name,
		age: dog.age.toString(),
		breed: dog.breed,
		gender: (dog.gender || "Unknown") as "Male" | "Female" | "Unknown",
		breedGroup: dog.breedGroup || "Unknown",
		mobilityIssues: dog.mobilityIssues || [],
		image: dog.image,
		notes: dog.notes || "",
	});
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.name.trim() || isSubmitting) return;

		try {
			setIsSubmitting(true);
			console.log("Updating dog with data:", formData);

			updateDog({
				...dog,
				name: formData.name.trim(),
				age: parseInt(formData.age) || 0,
				breed: formData.breed.trim() || "Unknown",
				gender: formData.gender as "Male" | "Female" | "Unknown",
				breedGroup: formData.breedGroup,
				mobilityIssues: formData.mobilityIssues,
				image: formData.image,
				notes: formData.notes.trim(),
			});

			console.log("Dog updated successfully");
			onClose();
		} catch (error) {
			console.error("Error updating dog:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = () => {
		try {
			console.log("Deleting dog:", dog.id);
			deleteDog(dog.id);
			onClose();
		} catch (error) {
			console.error("Error deleting dog:", error);
		}
	};

	const handleDeleteClick = () => {
		setShowDeleteConfirm(true);
	};

	const handleDeleteCancel = () => {
		setShowDeleteConfirm(false);
	};

	return (
		<div className="w-full h-full flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b flex-shrink-0">
				<h2 className="font-bold text-gray-800 truncate">Edit {dog.name}</h2>
				<div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
					<Button
						variant="ghost"
						size="sm"
						onClick={handleDeleteClick}
						className="text-red-500 hover:text-red-700 touch-target"
					>
						<Trash2 className="w-4 h-4" />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={onClose}
						className="touch-target"
					>
						<X className="w-4 h-4" />
					</Button>
				</div>
			</div>

			{/* Scrollable Content */}
			<div className="flex-1 overflow-y-auto p-4 smooth-scroll">
				<form onSubmit={handleSubmit} className="mobile-space-y">
					<DogFormFields formData={formData} onFormDataChange={setFormData} />

					{/* Submit Button */}
					<Button
						type="submit"
						className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 touch-target"
						disabled={!formData.name.trim() || isSubmitting}
					>
						{isSubmitting ? "Saving..." : "Save Changes"}
					</Button>
				</form>
			</div>

			{/* Delete Confirmation */}
			<DeleteConfirmation
				isOpen={showDeleteConfirm}
				onClose={handleDeleteCancel}
				onConfirm={handleDelete}
				title="Delete Dog Profile"
				message={`Are you sure you want to delete ${dog.name}'s profile? This action cannot be undone and will remove all associated data.`}
			/>
		</div>
	);
};

export default EditDogForm;
