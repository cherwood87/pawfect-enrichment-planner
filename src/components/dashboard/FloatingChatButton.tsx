
import React from 'react';
import CoachButton from '@/components/chat/CoachButton';

interface FloatingChatButtonProps {
  onChatOpen: () => void;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onChatOpen }) => {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30">
      <CoachButton onClick={onChatOpen} />
    </div>
  );
};

export default FloatingChatButton;
