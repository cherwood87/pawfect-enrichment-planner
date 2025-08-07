
import React from 'react';
import CoachButton from '@/components/chat/CoachButton';

interface FloatingChatButtonProps {
  onChatOpen: () => void;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onChatOpen }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <CoachButton onClick={onChatOpen} />
    </div>
  );
};

export default FloatingChatButton;
