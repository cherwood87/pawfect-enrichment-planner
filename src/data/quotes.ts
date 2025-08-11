// Simple curated list of uplifting dog and enrichment quotes
// You can expand this list anytime – the hook will rotate them automatically
export type QuoteCategory = 'enrichment' | 'dog' | 'training' | 'wellness';

export interface QuoteItem {
  text: string;
  author?: string;
  category?: QuoteCategory;
}

export const QUOTES: QuoteItem[] = [
  { text: "Enrichment isn't extra – it's essential.", category: 'enrichment' },
  { text: "A tired mind is as happy as a tired body.", category: 'enrichment' },
  { text: "Small moments of curiosity create big moments of calm.", category: 'enrichment' },
  { text: "Training builds skills. Enrichment builds joy.", category: 'enrichment' },
  { text: "Let your dog sniff – their nose is their superpower.", category: 'wellness' },
  { text: "Movement is medicine for dogs and humans alike.", category: 'wellness' },
  { text: "Connection before direction: bond first, teach second.", category: 'training' },
  { text: "The more we understand dogs, the more they understand us.", category: 'training' },
  { text: "A walk is not just a walk – it’s a story told in smells.", category: 'dog' },
  { text: "Play is the language of learning.", category: 'enrichment' },
  { text: "A good day for a dog is balanced: mind, body, and heart.", category: 'wellness' },
  { text: "The best enrichment is the one your dog loves.", category: 'enrichment' },
  { text: "Slow is smooth, and smooth is fast – in training and in life.", category: 'training' },
  { text: "Sniffari time: let your dog choose the route.", category: 'dog' },
  { text: "Mental workouts can be just as tiring as sprints.", category: 'enrichment' },
  { text: "Curiosity today, confidence tomorrow.", category: 'enrichment' },
  { text: "Dogs don’t need perfect – they need present.", category: 'dog' },
  { text: "Confidence grows when success is easy and fun.", category: 'training' },
  { text: "A five‑minute puzzle can reset the whole day.", category: 'enrichment' },
  { text: "Every dog is an individual; let their preferences lead.", category: 'dog' },
  { text: "Short, sweet, and successful – the gold standard for sessions.", category: 'training' },
  { text: "Adventure can be a cardboard box and a few treats.", category: 'enrichment' },
  { text: "Calm starts with safety – make life predictable and kind.", category: 'wellness' },
  { text: "Joy is the best metric.", category: 'wellness' },
];
