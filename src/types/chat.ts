
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatConversation {
  id: string;
  dogId: string;
  messages: ChatMessage[];
  lastUpdated: Date;
}

export interface CoachContext {
  dogProfile: any;
  activityHistory: any;
  pillarBalance: Record<string, number>;
}
