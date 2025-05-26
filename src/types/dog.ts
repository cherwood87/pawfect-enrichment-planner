
import { QuizResults } from './quiz';

export interface Dog {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  activityLevel: 'low' | 'moderate' | 'high';
  specialNeeds: string;
  dateAdded: string;
  lastUpdated: string;
  photo?: string;
  quizResults?: QuizResults;
  journalEntries?: JournalEntry[];
  // New properties that were missing
  gender?: 'Male' | 'Female' | 'Unknown';
  image?: string;
  breedGroup?: string;
  mobilityIssues?: string[];
  notes?: string;
}

export interface JournalEntry {
  date: string;
  prompt: string;
  response: string;
  mood: string;
  behaviors: string[];
  notes: string;
}

// Constants for form components
export const GENDER_OPTIONS = ['Male', 'Female', 'Unknown'] as const;

export const BREED_GROUPS = [
  'Unknown',
  'Sporting',
  'Hound',
  'Working',
  'Terrier',
  'Toy',
  'Non-Sporting',
  'Herding',
  'Mixed Breed'
] as const;

export const MOBILITY_ISSUES = [
  'None',
  'Hip dysplasia',
  'Arthritis',
  'Joint issues',
  'Mobility aids needed',
  'Limited exercise tolerance',
  'Senior dog considerations',
  'Recent surgery recovery'
] as const;
