import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageCircle, BookOpen, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickActionGridProps {
  onChatOpen?: () => void;
}

const actionItems = [
  {
    id: 'favorites',
    title: 'Favorites',
    icon: Heart,
    description: 'Your saved activities',
    gradient: 'from-red-400 to-pink-400',
    bgGradient: 'from-red-50 to-pink-50',
    borderColor: 'border-red-200',
    scrollTo: 'favorites'
  },
  {
    id: 'coach',
    title: 'AI Coach',
    icon: MessageCircle,
    description: 'Get personalized tips',
    gradient: 'from-blue-400 to-cyan-400',
    bgGradient: 'from-blue-50 to-cyan-50',
    borderColor: 'border-blue-200',
    action: 'chat'
  },
  {
    id: 'journal',
    title: 'Journal',
    icon: BookOpen,
    description: 'Track progress',
    gradient: 'from-purple-400 to-violet-400',
    bgGradient: 'from-purple-50 to-violet-50',
    borderColor: 'border-purple-200',
    scrollTo: 'journal'
  },
  {
    id: 'profile',
    title: 'Profile',
    icon: User,
    description: 'Manage settings',
    gradient: 'from-orange-400 to-amber-400',
    bgGradient: 'from-orange-50 to-amber-50',
    borderColor: 'border-orange-200',
    route: '/account-settings'
  }
];

export const QuickActionGrid: React.FC<QuickActionGridProps> = ({ onChatOpen }) => {
  const navigate = useNavigate();

  const handleAction = (item: typeof actionItems[0]) => {
    if (item.action === 'chat' && onChatOpen) {
      onChatOpen();
    } else if (item.route) {
      navigate(item.route);
    } else if (item.scrollTo) {
      const element = document.getElementById(item.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {actionItems.map((item) => {
        const IconComponent = item.icon;
        return (
          <Card 
            key={item.id}
            className={`modern-card cursor-pointer touch-target bg-gradient-to-br ${item.bgGradient} ${item.borderColor} hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]`}
            onClick={() => handleAction(item)}
          >
            <CardContent className="p-6 text-center">
              <div className={`bg-gradient-to-r ${item.gradient} p-3 rounded-2xl w-fit mx-auto mb-3 shadow-lg`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-xs text-gray-600">{item.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};