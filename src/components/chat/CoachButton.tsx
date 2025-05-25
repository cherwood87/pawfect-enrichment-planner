
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface CoachButtonProps {
  onClick: () => void;
}

const CoachButton: React.FC<CoachButtonProps> = ({ onClick }) => {
  return (
    <Button 
      onClick={onClick}
      className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-lg fixed bottom-20 right-6 z-50"
      size="icon"
    >
      <MessageCircle className="w-6 h-6 text-white" />
    </Button>
  );
};

export default CoachButton;
