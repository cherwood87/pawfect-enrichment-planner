import React from 'react';
import { createLazyComponent } from './LazyComponents';

// Dashboard components - load when needed
export const LazyDashboardContent = createLazyComponent(
  () => import('@/components/dashboard/DashboardContent'),
  'Loading dashboard...'
);

export const LazyTodaysEnrichmentSummary = createLazyComponent(
  () => import('@/components/dashboard/TodaysEnrichmentSummary'),
  'Loading today\'s activities...'
);

// Heavy modals - only load when opened
export const LazyConsolidatedActivityModal = createLazyComponent(
  () => import('@/components/modals/ConsolidatedActivityModal'),
  'Loading activity details...'
);

export const LazyChatModal = createLazyComponent(
  () => import('@/components/chat/ChatModal'),
  'Loading chat...'
);

// Quiz components - defer until needed
export const LazyDogPersonalityQuiz = createLazyComponent(
  () => import('@/components/DogPersonalityQuiz'),
  'Loading personality quiz...'
);

export const LazyQuizResults = createLazyComponent(
  () => import('@/components/QuizResults'),
  'Loading quiz results...'
);

// Settings components
export const LazyAccountSettings = createLazyComponent(
  () => import('@/pages/AccountSettings'),
  'Loading settings...'
);

// Dog profile components
export const LazyDogProfile = createLazyComponent(
  () => import('@/components/DogProfile'),
  'Loading dog profile...'
);

export const LazyEditDogForm = createLazyComponent(
  () => import('@/components/EditDogForm'),
  'Loading edit form...'
);