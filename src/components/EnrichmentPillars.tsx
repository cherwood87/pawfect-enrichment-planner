
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Users, TreePine, Target } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface EnrichmentPillarsProps {
  onPillarSelect: (pillar: string) => void;
  userPreferences?: Array<{
    pillar: string;
    rank: number;
    reason: string;
    score: number;
  }>;
}

const EnrichmentPillars: React.FC<EnrichmentPillarsProps> = ({ onPillarSelect, userPreferences }) => {
  const isMobile = useIsMobile();

  const allPillars = [
    {
      id: 'mental',
      title: 'Mental',
      icon: Brain,
      description: 'Puzzle toys, training',
      todayCount: 2,
      weeklyGoal: 10,
      color: 'purple',
      bgClass: 'pillar-mental'
    },
    {
      id: 'physical',
      title: 'Physical',
      icon: Zap,
      description: 'Walking, running, play',
      todayCount: 1,
      weeklyGoal: 7,
      color: 'green',
      bgClass: 'pillar-physical'
    },
    {
      id: 'social',
      title: 'Social',
      icon: Users,
      description: 'Dog parks, meetups',
      todayCount: 0,
      weeklyGoal: 3,
      color: 'blue',
      bgClass: 'pillar-social'
    },
    {
      id: 'environmental',
      title: 'Environmental',
      icon: TreePine,
      description: 'New places, smells',
      todayCount: 1,
      weeklyGoal: 5,
      color: 'teal',
      bgClass: 'pillar-environmental'
    },
    {
      id: 'instinctual',
      title: 'Instinctual',
      icon: Target,
      description: 'Digging, sniffing',
      todayCount: 1,
      weeklyGoal: 5,
      color: 'orange',
      bgClass: 'pillar-instinctual'
    }
  ];

  // Sort pillars based on user preferences if available
  const sortedPillars = userPreferences 
    ? allPillars.sort((a, b) => {
        const aPreference = userPreferences.find(p => p.pillar === a.id);
        const bPreference = userPreferences.find(p => p.pillar === b.id);
        const aRank = aPreference?.rank || 999;
        const bRank = bPreference?.rank || 999;
        return aRank - bRank;
      })
    : allPillars;

  return (
    <Card>
      <CardHeader className="mobile-card">
        <div className="flex items-center justify-between">
          <CardTitle className="font-bold text-gray-800 truncate">Enrichment Pillars</CardTitle>
          {userPreferences && (
            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 flex-shrink-0">
              Personalized
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="mobile-space-y mobile-card pt-0">
        {sortedPillars.map((pillar, index) => {
          const IconComponent = pillar.icon;
          const progress = (pillar.todayCount / pillar.weeklyGoal) * 100;
          const userPreference = userPreferences?.find(p => p.pillar === pillar.id);
          const isTopPriority = userPreferences && index < 2;
          
          return (
            <div
              key={pillar.id}
              className={`${pillar.bgClass} border rounded-lg mobile-card cursor-pointer hover:shadow-md transition-all duration-200 touch-target ${
                isTopPriority ? 'ring-2 ring-orange-300 ring-opacity-50' : ''
              }`}
              onClick={() => onPillarSelect(pillar.id)}
            >
              <div className={`flex items-center ${isMobile ? 'flex-col space-y-2' : 'justify-between'}`}>
                <div className={`flex items-center ${isMobile ? 'flex-col text-center space-y-2' : 'space-x-3 flex-1'}`}>
                  <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} bg-white rounded-full flex items-center justify-center shadow-sm relative flex-shrink-0`}>
                    <IconComponent className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-${pillar.color}-600`} />
                    {userPreferences && (
                      <div className={`absolute -top-1 -right-1 ${isMobile ? 'w-4 h-4 text-[10px]' : 'w-5 h-5 text-xs'} bg-gray-700 text-white rounded-full flex items-center justify-center font-bold`}>
                        {userPreference?.rank}
                      </div>
                    )}
                  </div>
                  <div className={`${isMobile ? 'text-center' : 'flex-1 min-w-0'}`}>
                    <div className={`flex items-center ${isMobile ? 'justify-center flex-col space-y-1' : 'space-x-2'}`}>
                      <h3 className="font-medium text-gray-800 truncate">{pillar.title}</h3>
                      {isTopPriority && (
                        <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 flex-shrink-0">
                          Priority
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {userPreference?.reason || pillar.description}
                    </p>
                  </div>
                </div>
                <div className={`${isMobile ? 'text-center w-full' : 'text-right flex-shrink-0'}`}>
                  <Badge variant="secondary" className="bg-white/70 text-gray-700 mb-1">
                    {pillar.todayCount}/{pillar.weeklyGoal}
                  </Badge>
                  <div className={`${isMobile ? 'mx-auto w-20' : 'w-16'} bg-white/50 rounded-full h-1.5`}>
                    <div 
                      className={`bg-${pillar.color}-500 h-1.5 rounded-full transition-all duration-300`}
                      style={{width: `${Math.min(progress, 100)}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default EnrichmentPillars;
