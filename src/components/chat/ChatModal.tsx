import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, MessageCircle, Lightbulb, Target, TrendingUp, HelpCircle, Save } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { useDog } from '@/contexts/DogContext';
import { useFavourites } from '@/hooks/useFavourites';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  activities?: any[];
}

interface ActivityHelpContext {
  type: 'activity-help';
  activityName: string;
  activityPillar: string;
  activityDifficulty: string;
  activityDuration: number;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatContext?: ActivityHelpContext;
}

// Utility to strip JSON blocks and markdown from LLM reply
function stripJsonBlocks(text: string): string {
  return text
    .replace(/(\{[\s\S]*?"title":\s*".+?[\s\S]*?"energyLevel":\s*".+?"[\s\S]*?\})/g, '') // remove JSON blocks
    .replace(/\*\*(.*?)\*\*/g, '$1') // bold markdown
    .replace(/\*(.*?)\*/g, '$1') // italic markdown
    .replace(/^#+\s*/gm, '') // markdown headings
    .trim();
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, chatContext }) => {
  // ... rest of your component remains unchanged
  // Only stripJsonBlocks was updated above
};

export default ChatModal;
