
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, MessageCircle, Lightbulb, Target, TrendingUp } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { useDog } from '@/contexts/DogContext';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const { currentConversation, isLoading, sendMessage } = useChat();
  const { currentDog } = useDog();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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

  const handleQuickAction = (message: string) => {
    setInput(message);
    handleSend();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <span>Enrichment Coach</span>
            {currentDog && (
              <span className="text-sm text-gray-500">• {currentDog.name}</span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            {currentConversation?.messages.length === 0 ? (
              <div className="space-y-4">
                <div className="text-center text-gray-500 mb-6">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm">
                    Hi! I'm your enrichment coach. I know all about {currentDog?.name || 'your dog'} and can help with personalized enrichment activities.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Quick actions:</p>
                  {quickActions.map((action, index) => (
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
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                placeholder="Ask about enrichment activities..."
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
