
import React from 'react';

export interface MoodRating {
  mood: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

export interface JournalEntry {
  date: string;
  prompt: string;
  response: string;
  mood: string;
  behaviors: string[];
  notes: string;
}
