import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dog } from '@/types/dog';
import { cn } from '@/lib/utils';

interface DogProfileHeroProps {
  dog: Dog;
  className?: string;
}

const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const DogProfileHero: React.FC<DogProfileHeroProps> = ({ dog, className }) => {
  const greeting = getTimeBasedGreeting();
  const imageSrc = dog.image || dog.photo || '';

  return (
    <header className={cn('flex items-center gap-4 px-1 py-2', className)}>
      <Avatar className="h-20 w-20 ring-2 ring-purple-200">
        {imageSrc ? (
          <AvatarImage src={imageSrc} alt={`Profile photo of ${dog.name}`} />
        ) : (
          <AvatarFallback className="text-xl font-semibold">
            {dog.name?.charAt(0)?.toUpperCase() || '🐾'}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <h1 className="text-2xl font-bold tracking-tight">
          {greeting}, {dog.name}!
        </h1>
        <p className="text-sm text-muted-foreground">Here’s your enrichment plan for today</p>
      </div>
    </header>
  );
};
