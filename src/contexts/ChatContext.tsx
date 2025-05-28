import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatMessage, ChatConversation } from '@/types/chat';
import { useDog } from '@/contexts/DogContext';
import { useActivity } from '@/contexts/ActivityContext';

type ConversationType = 'general' | 'activity-help';

interface ChatContextType {
  conversations: ChatConversation[];
  currentConversation: ChatConversation | null;
  isLoading: boolean;
  sendMessage: (content: string, activityContext?: any) => Promise<void>;
  startNewConversation: (type?: ConversationType) => void;
  loadConversation: (dogId: string, type?: ConversationType) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { currentDog } = useDog();
  const { getPillarBalance, getTodaysActivities } = useActivity();

  // Load conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem('enrichmentCoachConversations');
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations).map((conv: any) => ({
        ...conv,
        lastUpdated: new Date(conv.lastUpdated),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      setConversations(parsed);
    }
  }, []);

  // Load conversation for current dog (general conversation only)
  useEffect(() => {
    if (currentDog) {
      loadConversation(currentDog.id, 'general');
    }
  }, [currentDog]);

  // Save conversations to localStorage
  useEffect(() => {
    localStorage.setItem('enrichmentCoachConversations', JSON.stringify(conversations));
  }, [conversations]);

  const getConversationKey = (dogId: string, type: ConversationType = 'general') => {
    return type === 'general' ? dogId : `${dogId}-${type}`;
  };

  const loadConversation = (dogId: string, type: ConversationType = 'general') => {
    // For activity help, always start fresh - don't load existing conversations
    if (type === 'activity-help') {
      startNewConversation(type);
      return;
    }

    // For general conversations, load existing or create new
    const conversationKey = getConversationKey(dogId, type);
    const existing = conversations.find(conv => 
      conv.dogId === conversationKey
    );
    
    if (existing) {
      setCurrentConversation(existing);
    } else {
      startNewConversation(type);
    }
  };

  const startNewConversation = (type: ConversationType = 'general') => {
    if (!currentDog) return;

    const conversationKey = getConversationKey(currentDog.id, type);
    
    const newConversation: ChatConversation = {
      id: generateId(),
      dogId: conversationKey,
      messages: [],
      lastUpdated: new Date()
    };

    setCurrentConversation(newConversation);
    
    // For activity help, don't save to persistent storage - keep it temporary
    if (type === 'general') {
      setConversations(prev => [...prev.filter(conv => conv.dogId !== conversationKey), newConversation]);
    }
  };

  const sendMessage = async (content: string, activityContext?: any) => {
    if (!currentConversation || !currentDog || isLoading) return;

    setIsLoading(true);

    try {
      // Add user message
      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: new Date()
      };

      const updatedMessages = [...currentConversation.messages, userMessage];

      // Update conversation with user message
      const updatedConversation = {
        ...currentConversation,
        messages: updatedMessages,
        lastUpdated: new Date()
      };

      setCurrentConversation(updatedConversation);
      
      // Only update stored conversations for general chat
      const isGeneralChat = !currentConversation.dogId.includes('-activity-help');
      if (isGeneralChat) {
        setConversations(prev => 
          prev.map(conv => conv.id === updatedConversation.id ? updatedConversation : conv)
        );
      }

      // Prepare context for AI
      const pillarBalance = getPillarBalance();
      const todaysActivities = getTodaysActivities();

      // Call enrichment coach function
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('enrichment-coach', {
        body: {
          messages: updatedMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          dogProfile: currentDog,
          activityHistory: {
            todaysActivities,
            totalActivitiesCompleted: todaysActivities.filter(a => a.completed).length
          },
          pillarBalance,
          activityContext // Pass activity context if provided
        }
      });

      if (error) throw error;

      // Add AI response (now supporting activities!)
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
        activities: Array.isArray(data.activities) ? data.activities : undefined
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      const finalConversation = {
        ...updatedConversation,
        messages: finalMessages,
        lastUpdated: new Date()
      };

      setCurrentConversation(finalConversation);
      
      // Only update stored conversations for general chat
      if (isGeneralChat) {
        setConversations(prev => 
          prev.map(conv => conv.id === finalConversation.id ? finalConversation : conv)
        );
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };

      const errorConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, errorMessage],
        lastUpdated: new Date()
      };

      setCurrentConversation(errorConversation);
      
      // Only update stored conversations for general chat
      const isGeneralChat = !currentConversation.dogId.includes('-activity-help');
      if (isGeneralChat) {
        setConversations(prev => 
          prev.map(conv => conv.id === errorConversation.id ? errorConversation : conv)
        );
      }
    }

    setIsLoading(false);
  };

  const value: ChatContextType = {
    conversations,
    currentConversation,
    isLoading,
    sendMessage,
    startNewConversation,
    loadConversation
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
