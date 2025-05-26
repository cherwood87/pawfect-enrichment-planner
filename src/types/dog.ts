
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
}

export interface JournalEntry {
  date: string;
  prompt: string;
  response: string;
  mood: string;
  behaviors: string[];
  notes: string;
}
