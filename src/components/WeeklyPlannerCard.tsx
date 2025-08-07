
import React from 'react';
import WeeklyPlannerLogic from './weekly-planner/WeeklyPlannerLogic';

interface WeeklyPlannerCardProps {
  onPillarSelect: (pillar: string) => void;
  onChatOpen?: () => void;
}

const WeeklyPlannerCard: React.FC<WeeklyPlannerCardProps> = ({ onPillarSelect, onChatOpen }) => {
  return <WeeklyPlannerLogic onPillarSelect={onPillarSelect} onChatOpen={onChatOpen} />;
};

export default WeeklyPlannerCard;
