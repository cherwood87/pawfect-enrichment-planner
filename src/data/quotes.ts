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
  { text: "A walk is not just a walk – it's a story told in smells.", category: 'dog' },
  { text: "Play is the language of learning.", category: 'enrichment' },
  { text: "A good day for a dog is balanced: mind, body, and heart.", category: 'wellness' },
  { text: "The best enrichment is the one your dog loves.", category: 'enrichment' },
  { text: "Slow is smooth, and smooth is fast – in training and in life.", category: 'training' },
  { text: "Sniffari time: let your dog choose the route.", category: 'dog' },
  { text: "Mental workouts can be just as tiring as sprints.", category: 'enrichment' },
  { text: "Curiosity today, confidence tomorrow.", category: 'enrichment' },
  { text: "Dogs don't need perfect – they need present.", category: 'dog' },
  { text: "Confidence grows when success is easy and fun.", category: 'training' },
  { text: "A five‑minute puzzle can reset the whole day.", category: 'enrichment' },
  { text: "Every dog is an individual; let their preferences lead.", category: 'dog' },
  { text: "Short, sweet, and successful – the gold standard for sessions.", category: 'training' },
  { text: "Adventure can be a cardboard box and a few treats.", category: 'enrichment' },
  { text: "Calm starts with safety – make life predictable and kind.", category: 'wellness' },
  { text: "Joy is the best metric.", category: 'wellness' },
  
  // General Dog Life & Connection
  { text: "Every day with your dog is a page in a story only the two of you will ever read.", category: 'dog' },
  { text: "Dogs don't live in the past or the future — they invite us into now.", category: 'dog' },
  { text: "When you slow down, you meet your dog where they've been waiting all along.", category: 'dog' },
  { text: "The smallest shared moments often make the biggest difference to your dog.", category: 'dog' },
  { text: "Your dog doesn't measure love in minutes or miles — only in presence.", category: 'dog' },
  { text: "They notice the details you rush past. Maybe you should too.", category: 'dog' },
  { text: "A walk isn't for exercise alone — it's for connection, discovery, and shared rhythm.", category: 'dog' },
  { text: "Every sniff, every pause, every glance back is a conversation in their language.", category: 'dog' },
  
  // Training & Learning
  { text: "Training isn't about control — it's about building trust one choice at a time.", category: 'training' },
  { text: "The best training happens when your dog feels safe to try, fail, and try again.", category: 'training' },
  { text: "Your dog is learning every moment you're together — make it worth learning.", category: 'training' },
  { text: "Consistency builds understanding. Patience builds trust.", category: 'training' },
  { text: "Teach with clarity, reinforce with kindness, and watch confidence grow.", category: 'training' },
  { text: "Every behavior is information — listen before you label.", category: 'training' },
  { text: "A cue is an invitation, not a command.", category: 'training' },
  
  // Enrichment – Physical
  { text: "Movement is more than exercise — it's how dogs process their world.", category: 'wellness' },
  { text: "Different terrains build different bodies — and different minds.", category: 'wellness' },
  { text: "Let them sprint. Let them climb. Let them move like dogs were made to move.", category: 'wellness' },
  { text: "Physical enrichment is freedom in motion.", category: 'wellness' },
  { text: "A tired dog is not always a fulfilled dog. Fulfillment is more than fatigue.", category: 'wellness' },
  
  // Enrichment – Environmental
  { text: "Every new space is a classroom for your dog.", category: 'enrichment' },
  { text: "The environment is the most powerful teacher — let it speak.", category: 'enrichment' },
  { text: "Change the scenery, change the energy.", category: 'enrichment' },
  { text: "A dog who explores is a dog who grows.", category: 'enrichment' },
  { text: "You don't need to travel far to change their world — just change their view.", category: 'enrichment' },
  
  // Enrichment – Mental
  { text: "A working mind is a calm mind.", category: 'enrichment' },
  { text: "Mental enrichment is exercise for the brain's curiosity muscle.", category: 'enrichment' },
  { text: "Problem-solving builds confidence in ways obedience never could.", category: 'enrichment' },
  { text: "A puzzle to solve is just as satisfying as a race to run.", category: 'enrichment' },
  { text: "Challenge the mind, and the body will follow.", category: 'enrichment' },
  
  // Enrichment – Social
  { text: "Social enrichment isn't just about other dogs — it's about shared experience.", category: 'enrichment' },
  { text: "Not every dog wants every dog — honor their preferences.", category: 'enrichment' },
  { text: "Connection is built through quality, not quantity, of interactions.", category: 'enrichment' },
  { text: "Let dogs choose their friends and their distance.", category: 'enrichment' },
  { text: "Social needs are as individual as the dogs who have them.", category: 'enrichment' },
  
  // Life Lessons from Dogs
  { text: "A dog's joy is contagious — catch it often.", category: 'dog' },
  { text: "They don't hold grudges. They hold moments.", category: 'dog' },
  { text: "Your dog won't remember the perfect cue — they'll remember how you made them feel.", category: 'dog' },
  { text: "Dogs forgive quickly. We could learn from that.", category: 'dog' },
  { text: "Life's too short to skip the sniff stops.", category: 'dog' },
];