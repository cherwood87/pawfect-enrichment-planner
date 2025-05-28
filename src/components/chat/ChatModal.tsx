
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, MessageCircle, Lightbulb, Target, TrendingUp, HelpCircle } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { useDog } from '@/contexts/DogContext';
import { useFavourites } from '@/hooks/useFavourites';

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

// Utility to strip JSON blocks from LLM reply
function stripJsonBlocks(text: string): string {
  return text.replace(/(\{[\s\S]*?"title":\s*".+?[\s\S]*?"energyLevel":\s*".+?"[\s\S]*?\})/g, '').trim();
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, chatContext }) => {
  const [input, setInput] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);
  const { currentConversation, isLoading, sendMessage, loadConversation } = useChat();
  const { currentDog } = useDog();
  const { addToFavourites } = useFavourites(currentDog?.id || null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  console.log('ChatModal rendered - isOpen:', isOpen, 'chatContext:', chatContext, 'hasInitialized:', hasInitialized);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [currentConversation?.messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Initialize conversation when modal opens - FIXED: Remove sendMessage from dependency array
  useEffect(() => {
    console.log('Initialize conversation effect triggered - isOpen:', isOpen, 'currentDog:', currentDog?.id, 'chatContext:', chatContext);
    
    if (isOpen && currentDog && !hasInitialized) {
      console.log('Initializing conversation...');
      setHasInitialized(true);
      
      if (chatContext?.type === 'activity-help') {
        console.log('Loading activity help conversation');
        loadConversation(currentDog.id, 'activity-help');
      } else {
        console.log('Loading general conversation');
        loadConversation(currentDog.id, 'general');
      }
    }
  }, [isOpen, currentDog, chatContext, hasInitialized, loadConversation]);

  // Reset initialization when modal closes
  useEffect(() => {
    if (!isOpen) {
      console.log('Modal closed, resetting initialization');
      setHasInitialized(false);
    }
  }, [isOpen]);

  // Send context message when activity help context is provided - FIXED: Better condition and error handling
  useEffect(() => {
    console.log('Context message effect triggered - conditions:', {
      isOpen,
      isActivityHelp: chatContext?.type === 'activity-help',
      hasConversation: !!currentConversation,
      messageCount: currentConversation?.messages.length,
      isLoading,
      hasInitialized
    });

    if (
      isOpen && 
      chatContext?.type === 'activity-help' && 
      currentConversation && 
      currentConversation.messages.length === 0 && 
      !isLoading &&
      hasInitialized
    ) {
      console.log('Sending activity help context message...');
      
      const contextMessage = `I need help with the "${chatContext.activityName}" activity (${chatContext.activityPillar} pillar, ${chatContext.activityDifficulty} difficulty, ${chatContext.activityDuration} minutes). Can you provide more detailed guidance?`;
      
      const activityContext = {
        activityName: chatContext.activityName,
        activityPillar: chatContext.activityPillar,
        activityDifficulty: chatContext.activityDifficulty,
        activityDuration: chatContext.activityDuration
      };
      
      // Add error handling to prevent infinite loops
      sendMessage(contextMessage, activityContext).catch(error => {
        console.error('Error sending context message:', error);
      });
    }
  }, [isOpen, chatContext, currentConversation, isLoading, hasInitialized]); // FIXED: Removed sendMessage from deps

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    console.log('Sending user message:', input.trim());
    const messageContent = input.trim();
    setInput('');

    // Pass activity context if we're in activity help mode
    const activityContext = chatContext?.type === 'activity-help' ? {
      activityName: chatContext.activityName,
      activityPillar: chatContext.activityPillar,
      activityDifficulty: chatContext.activityDifficulty,
      activityDuration: chatContext.activityDuration
    } : undefined;

    try {
      await sendMessage(messageContent, activityContext);
    } catch (error) {
      console.error('Error in handleSend:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Add to Favourites (localStorage example)
  const handleAddToFavourites = async (activity: any) => {
    if (!currentDog) return;
    
    try {
      // Convert chat activity to the expected format
      const activityForFavourites = {
        id: activity.id || `chat-${Date.now()}`,
        title: activity.title,
        pillar: activity.pillar,
        difficulty: activity.difficulty,
        duration: activity.duration,
        materials: activity.materials || [],
        emotionalGoals: activity.emotionalGoals || [],
        instructions: activity.instructions || [],
        benefits: activity.benefits || '',
        tags: activity.tags || [],
        ageGroup: activity.ageGroup || 'All Ages',
        energyLevel: activity.energyLevel || 'Medium'
      };

      await addToFavourites(activityForFavourites, 'library');
    } catch (error) {
      console.error('Error adding activity to favourites:', error);
    }
  };

  // Quick actions for general chat
  const quickActions = [
    {
      icon: Lightbulb,
      text: "Suggest today's activities",
      message: "What enrichment activities would you recommend for today?"
    },
    {
      icon: Target,
      text: "Check pillar balance",
      message: "How is my dog's enrichment pillar balance looking today?"
    },
    {
      icon: TrendingUp,
      text: "Improve routine",
      message: "How can I improve my dog's enrichment routine?"
    }
  ];

  // Quick actions for activity help
  const activityHelpActions = [
    {
      icon: Target,
      text: "Break down the steps",
      message: `Can you break down the "${chatContext?.activityName}" activity into simple, easy-to-follow steps?`
    },
    {
      icon: Lightbulb,
      text: "Troubleshooting tips",
      message: `What are common issues dogs have with "${chatContext?.activityName}" and how can I solve them?`
    },
    {
      icon: HelpCircle,
      text: "Modifications for my dog",
      message: `How can I modify "${chatContext?.activityName}" to better suit ${currentDog?.name}'s specific needs and personality?`
    }
  ];

  const handleQuickAction = (message: string) => {
    console.log('Quick action selected:', message);
    setInput(message);
    setTimeout(() => handleSend(), 100);
  };

  const isActivityHelp = chatContext?.type === 'activity-help';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <span>{isActivityHelp ? 'Activity Help' : 'Enrichment Coach'}</span>
            {currentDog && (
              <span className="text-sm text-gray-500">• {currentDog.name}</span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            {!currentConversation || currentConversation.messages.length === 0 ? (
              <div className="space-y-4">
                <div className="text-center text-gray-500 mb-6">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-blue-500" />
                  {isActivityHelp ? (
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Get help with: {chatContext?.activityName}
                      </p>
                      <p className="text-sm">
                        I'm here to help you make this activity successful for {currentDog?.name || 'your dog'}!
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm">
                      Hi! I'm your enrichment coach. I know all about {currentDog?.name || 'your dog'} and can help with personalized enrichment activities.
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Quick actions:</p>
                  {(isActivityHelp ? activityHelpActions : quickActions).map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => handleQuickAction(action.message)}
                    >
                      <action.icon className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">{action.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {currentConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.role === 'assistant'
                          ? stripJsonBlocks(message.content)
                          : message.content}
                      </p>
                      {/* Activities block for assistant messages */}
                      {message.role === 'assistant' && message.activities && message.activities.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.activities.map((activity, i) => (
                            <div key={i} className="flex items-center justify-between bg-white border rounded-md p-2 shadow-sm">
                              <div>
                                <div className="font-semibold text-gray-900">{activity.title}</div>
                                <div className="text-xs text-gray-500 capitalize">{activity.pillar} • {activity.difficulty} • {activity.duration} min</div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleAddToFavourites(activity)}
                              >
                                Add to Favourites
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-sm p-3">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isActivityHelp ? "Ask about this activity..." : "Ask about enrichment activities..."}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatModal;
