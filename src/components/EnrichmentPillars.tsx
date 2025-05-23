
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Users, TreePine, Target } from 'lucide-react';

interface EnrichmentPillarsProps {
  onPillarSelect: (pillar: string) => void;
}

const EnrichmentPillars: React.FC<EnrichmentPillarsProps> = ({ onPillarSelect }) => {
  const pillars = [
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-800">Enrichment Pillars</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pillars.map((pillar) => {
          const IconComponent = pillar.icon;
          const progress = (pillar.todayCount / pillar.weeklyGoal) * 100;
          
          return (
            <div
              key={pillar.id}
              className={`${pillar.bgClass} border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all duration-200`}
              onClick={() => onPillarSelect(pillar.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm`}>
                    <IconComponent className={`w-5 h-5 text-${pillar.color}-600`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{pillar.title}</h3>
                    <p className="text-xs text-gray-600">{pillar.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="bg-white/70 text-gray-700">
                    {pillar.todayCount}/{pillar.weeklyGoal}
                  </Badge>
                  <div className="mt-1 w-16 bg-white/50 rounded-full h-1.5">
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
