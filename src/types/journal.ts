
import React from 'react';

export interface MoodRating {
  mood: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

export interface JournalEntry {
  id?: string;
  date: string;
  prompt: string;
  response: string;
  mood: string;
  behaviors: string[];
  notes: string;
  entryTimestamp?: string;
  createdAt?: string;
  updatedAt?: string;
}
