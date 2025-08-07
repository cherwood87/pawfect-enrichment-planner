
import React from 'react';
import FavoritesWeeklyPlanner from './weekly-planner/FavoritesWeeklyPlanner';

interface WeeklyPlannerCardProps {
  onPillarSelect: (pillar: string) => void;
  onChatOpen?: () => void;
}

const WeeklyPlannerCard: React.FC<WeeklyPlannerCardProps> = ({ onPillarSelect }) => {
  return <FavoritesWeeklyPlanner onPillarSelect={onPillarSelect} />;
};

export default WeeklyPlannerCard;
