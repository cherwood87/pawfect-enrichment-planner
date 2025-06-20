import type { Dog } from "@/types/dog";

export class DogDataMapper {
	static mapToDog(dbDog: any): Dog {
		return {
			id: dbDog.id,
			name: dbDog.name,
			breed: dbDog.breed,
			age: dbDog.age,
			weight: dbDog.weight,
			activityLevel: dbDog.activity_level,
			specialNeeds: dbDog.special_needs || "",
			notes: dbDog.notes || "",
			image: dbDog.image,
			userId: dbDog.user_id,
			dateAdded: dbDog.date_added || dbDog.created_at,
			lastUpdated: dbDog.last_updated || dbDog.updated_at,
			gender: dbDog.gender,
			breedGroup: dbDog.breed_group,
			mobilityIssues: dbDog.mobility_issues || [],
			quizResults: dbDog.quiz_results,
		};
	}

	static mapToDatabase(
		dogData: Omit<Dog, "id" | "dateAdded" | "lastUpdated">,
	): any {
		return {
			name: dogData.name,
			breed: dogData.breed,
			age: dogData.age,
			weight: dogData.weight,
			activity_level: dogData.activityLevel,
			special_needs: dogData.specialNeeds || "",
			gender: dogData.gender || "Unknown",
			breed_group: dogData.breedGroup || "Unknown",
			mobility_issues: dogData.mobilityIssues || [],
			image: dogData.image || dogData.photo || "",
			notes: dogData.notes || "",
			quiz_results: dogData.quizResults
				? JSON.parse(JSON.stringify(dogData.quizResults))
				: null,
			user_id: dogData.userId,
			date_added: new Date().toISOString(),
			last_updated: new Date().toISOString(),
		};
	}

	static mapToUpdatePayload(dog: Dog): any {
		return {
			name: dog.name,
			breed: dog.breed,
			age: dog.age,
			weight: dog.weight,
			activity_level: dog.activityLevel,
			special_needs: dog.specialNeeds || "",
			gender: dog.gender || "Unknown",
			breed_group: dog.breedGroup || "Unknown",
			mobility_issues: dog.mobilityIssues || [],
			image: dog.image || dog.photo || "",
			notes: dog.notes || "",
			quiz_results: dog.quizResults
				? JSON.parse(JSON.stringify(dog.quizResults))
				: null,
			last_updated: new Date().toISOString(),
		};
	}
}
