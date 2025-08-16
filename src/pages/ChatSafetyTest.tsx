import React from 'react';
import { DogProvider } from '@/contexts/DogContext';
import { ActivityProvider } from '@/contexts/ActivityContext';
import { ChatProvider } from '@/contexts/ChatContext';
import ChatSafetyTester from '@/components/testing/ChatSafetyTester';

const ChatSafetyTest: React.FC = () => {
  return (
    <DogProvider>
      <ActivityProvider>
        <ChatProvider>
          <div className="min-h-screen bg-background">
            <ChatSafetyTester />
          </div>
        </ChatProvider>
      </ActivityProvider>
    </DogProvider>
  );
};

export default ChatSafetyTest;