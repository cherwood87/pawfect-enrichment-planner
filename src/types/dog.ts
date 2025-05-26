
export interface Dog {
  id: string;
  name: string;
  age: number;
  breed: string;
  gender?: 'Male' | 'Female' | 'Unknown';
  breedGroup?: string;
  mobilityIssues: string[];
  image?: string; // base64 encoded image or URL
  dateAdded: string;
  lastUpdated: string;
  quizResults?: QuizResults;
  notes?: string;
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

export const GENDER_OPTIONS = [
  'Male',
  'Female',
  'Unknown'
] as const;

export const BREED_GROUPS = [
  'Sporting',
  'Hound',
  'Working',
  'Terrier',
  'Toy',
  'Non-Sporting',
  'Herding',
  'Miscellaneous',
  'Mixed Breed',
  'Unknown'
] as const;

export const MOBILITY_ISSUES = [
  'Arthritis',
  'Hip Dysplasia',
  'Vision Impairment',
  'Hearing Impairment',
  'Joint Issues',
  'Mobility Aids Needed',
  'Senior Dog Considerations',
  'None'
] as const;

export const POPULAR_BREEDS = [
  'Golden Retriever',
  'Labrador Retriever',
  'German Shepherd',
  'French Bulldog',
  'Bulldog',
  'Poodle',
  'Beagle',
  'Rottweiler',
  'Yorkshire Terrier',
  'Dachshund',
  'Siberian Husky',
  'Border Collie',
  'Mixed Breed',
  'Other'
] as const;
