import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dog } from '@/types/dog';

interface DogProfileHeroProps {
  dog: Dog;
}

const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const DogProfileHero: React.FC<DogProfileHeroProps> = ({ dog }) => {
  const greeting = getTimeBasedGreeting();

  return (
    <div className="modern-card p-6 bg-gradient-to-br from-blue-50 to-orange-50 border border-blue-100">
      <div className="flex items-center space-x-4">
        <Avatar className="w-20 h-20 ring-4 ring-white shadow-lg">
          <AvatarImage 
            src={dog.photo || dog.image} 
            alt={`${dog.name}'s profile`}
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-cyan-400 text-white text-2xl font-bold">
            🐕
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            {greeting}, {dog.name}!
          </h1>
          <p className="text-gray-600">
            Ready for today's enrichment adventures?
          </p>
        </div>
      </div>
    </div>
  );
};