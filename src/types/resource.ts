
export interface EducationalArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  source: string;
  sourceUrl: string;
  author?: string;
  publishDate?: string;
  category: ResourceCategory;
  topics: string[];
  credibilityScore: number;
  imageUrl?: string;
  estimatedReadTime: number;
  isBookmarked?: boolean;
  scrapedAt: string;
}

export interface ResearchSummary {
  id: string;
  title: string;
  summary: string;
  keyFindings: string[];
  methodology?: string;
  source: string;
  sourceUrl: string;
  authors: string[];
  publishDate: string;
  journalName?: string;
  credibilityScore: number;
  relatedTopics: string[];
  scrapedAt: string;
}

export interface BreedSpecificContent {
  id: string;
  breed: string;
  title: string;
  content: string;
  enrichmentTypes: string[];
  source: string;
  sourceUrl: string;
  credibilityScore: number;
  scrapedAt: string;
}

export interface ProductRecommendation {
  id: string;
  productName: string;
  productType: ProductType;
  description: string;
  pros: string[];
  cons: string[];
  priceRange?: string;
  source: string;
  sourceUrl: string;
  rating?: number;
  reviewDate: string;
  scrapedAt: string;
}

export type ResourceCategory = 
  | 'science' 
  | 'diy-projects' 
  | 'breed-specific' 
  | 'product-reviews' 
  | 'training-tips' 
  | 'general-enrichment';

export type ProductType = 
  | 'puzzle-toy' 
  | 'puzzle-feeder' 
  | 'sensory-toy' 
  | 'interactive-toy' 
  | 'training-tool' 
  | 'enrichment-accessory';

export interface ResourceSearchFilters {
  category?: ResourceCategory;
  breed?: string;
  topic?: string;
  credibilityScore?: number;
  dateRange?: 'week' | 'month' | 'year' | 'all';
}

export interface ResourceDiscoveryConfig {
  dailyLimit: number;
  preferredSources: string[];
  excludedSources: string[];
  minCredibilityScore: number;
  focusTopics: string[];
  lastDiscoveryRun?: string;
}
