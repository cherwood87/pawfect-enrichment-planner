import React from 'react';
import { DogProvider } from '@/contexts/DogContext';
import { ActivityProvider } from '@/contexts/ActivityContext';
import { ChatProvider } from '@/contexts/ChatContext';
import ChatSafetyTesterHardened from '@/components/testing/ChatSafetyTesterHardened';

const ChatSafetyTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Chat Safety Testing</h1>
          <p className="text-muted-foreground">
            Comprehensive safety testing for the enrichment coach AI system. This tool tests medical safety, 
            training advice accuracy, information verification, contextual responses, and edge case handling.
          </p>
        </div>
        <ChatSafetyTesterHardened />
      </div>
    </div>
  );
};

export default ChatSafetyTest;