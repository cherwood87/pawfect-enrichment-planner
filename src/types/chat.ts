
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  activities?: any[]; // Optional activities array for assistant messages
}

export interface ChatConversation {
  id: string;
  dogId: string;
  messages: ChatMessage[];
  lastUpdated: Date;
}
