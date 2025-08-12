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
export const DogProfileHero: React.FC<DogProfileHeroProps> = ({
  dog
}) => {
  const greeting = getTimeBasedGreeting();
  return;
};