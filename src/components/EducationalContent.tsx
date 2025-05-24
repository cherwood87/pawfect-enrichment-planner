
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Users, TreePine, Target, Heart, AlertCircle, TrendingUp } from 'lucide-react';

interface EducationalContentProps {
  pillar?: string;
}

const EducationalContent: React.FC<EducationalContentProps> = ({ pillar }) => {
  const pillarInfo = {
    mental: {
      icon: Brain,
      color: 'purple',
      title: 'Mental Enrichment',
      description: 'Cognitive challenges that exercise your dog\'s brain and problem-solving abilities.',
      importance: 'Mental stimulation prevents boredom, reduces destructive behaviors, and builds confidence. Dogs are intelligent creatures that need cognitive challenges to thrive.',
      signs: [
        'Excessive barking or whining',
        'Destructive chewing or digging',
        'Restlessness or pacing',
        'Attention-seeking behaviors',
        'Loss of interest in activities'
      ],
      benefits: [
        'Improved focus and attention span',
        'Reduced anxiety and stress',
        'Better problem-solving skills',
        'Stronger human-dog bond',
        'Mental fatigue leading to better rest'
      ],
      tips: [
        'Start with easier puzzles and gradually increase difficulty',
        'Rotate toys to maintain novelty',
        'Use meal times as training opportunities',
        'Keep sessions short and positive',
        'Always end on a successful note'
      ]
    },
    physical: {
      icon: Zap,
      color: 'green',
      title: 'Physical Enrichment',
      description: 'Exercise and movement activities that keep your dog physically fit and healthy.',
      importance: 'Physical exercise is essential for maintaining healthy weight, joint function, and cardiovascular health. It also releases endorphins that improve mood.',
      signs: [
        'Weight gain or muscle loss',
        'Decreased stamina',
        'Stiff or painful movement',
        'Excessive energy or hyperactivity',
        'Difficulty sleeping'
      ],
      benefits: [
        'Improved cardiovascular health',
        'Better weight management',
        'Stronger muscles and bones',
        'Enhanced coordination and balance',
        'Better sleep quality'
      ],
      tips: [
        'Adjust exercise based on age and health',
        'Warm up before intense activity',
        'Provide fresh water during exercise',
        'Watch for signs of overexertion',
        'Mix different types of physical activities'
      ]
    },
    social: {
      icon: Users,
      color: 'blue',
      title: 'Social Enrichment',
      description: 'Interactions with other dogs and people that develop social skills and confidence.',
      importance: 'Proper socialization prevents fear and aggression, builds confidence, and helps dogs navigate the world safely and happily.',
      signs: [
        'Fear or aggression toward other dogs',
        'Excessive shyness around people',
        'Difficulty reading social cues',
        'Separation anxiety',
        'Overexcitement in social situations'
      ],
      benefits: [
        'Better communication skills',
        'Reduced fear and anxiety',
        'Improved confidence',
        'Enhanced adaptability',
        'Stronger bonds with family'
      ],
      tips: [
        'Start with calm, well-socialized dogs',
        'Choose neutral locations for meetings',
        'Keep initial interactions short',
        'Watch body language carefully',
        'Always supervise interactions'
      ]
    },
    environmental: {
      icon: TreePine,
      color: 'teal',
      title: 'Environmental Enrichment',
      description: 'Exposure to new places, sights, sounds, and textures that stimulate the senses.',
      importance: 'Environmental variety prevents habituation, maintains curiosity, and helps dogs adapt to new situations with confidence.',
      signs: [
        'Fear of new environments',
        'Excessive reactivity to sounds',
        'Reluctance to explore',
        'Stress in unfamiliar places',
        'Repetitive behaviors'
      ],
      benefits: [
        'Increased adaptability',
        'Enhanced sensory awareness',
        'Reduced fear of new situations',
        'Greater curiosity and confidence',
        'Improved stress resilience'
      ],
      tips: [
        'Introduce new environments gradually',
        'Let your dog set the pace',
        'Bring familiar items to new places',
        'Use positive associations with treats',
        'Respect your dog\'s comfort zone'
      ]
    },
    instinctual: {
      icon: Target,
      color: 'orange',
      title: 'Instinctual Enrichment',
      description: 'Activities that allow dogs to express natural behaviors like hunting, digging, and foraging.',
      importance: 'Suppressed natural instincts can lead to frustration and behavioral problems. Providing appropriate outlets keeps dogs mentally healthy.',
      signs: [
        'Inappropriate digging or chewing',
        'Excessive prey drive',
        'Frustration or restlessness',
        'Repetitive behaviors',
        'Difficulty focusing'
      ],
      benefits: [
        'Reduced behavioral problems',
        'Greater satisfaction and contentment',
        'Natural stress relief',
        'Improved mental health',
        'Better expression of personality'
      ],
      tips: [
        'Provide appropriate outlets for instincts',
        'Use natural behaviors in training',
        'Create designated areas for instinctual activities',
        'Understand your dog\'s breed tendencies',
        'Channel instincts positively'
      ]
    }
  };

  if (pillar && pillarInfo[pillar as keyof typeof pillarInfo]) {
    const info = pillarInfo[pillar as keyof typeof pillarInfo];
    const IconComponent = info.icon;
    
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-${info.color}-100 rounded-full flex items-center justify-center`}>
              <IconComponent className={`w-5 h-5 text-${info.color}-600`} />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-800">{info.title}</CardTitle>
              <p className="text-sm text-gray-600">{info.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="flex items-center space-x-2 font-semibold text-gray-800 mb-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Why It Matters</span>
            </h4>
            <p className="text-sm text-gray-600">{info.importance}</p>
          </div>

          <div>
            <h4 className="flex items-center space-x-2 font-semibold text-gray-800 mb-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span>Signs of Under-Stimulation</span>
            </h4>
            <ul className="space-y-1">
              {info.signs.map((sign, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{sign}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="flex items-center space-x-2 font-semibold text-gray-800 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Benefits</span>
            </h4>
            <ul className="space-y-1">
              {info.benefits.map((benefit, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="flex items-center space-x-2 font-semibold text-gray-800 mb-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span>Best Practices</span>
            </h4>
            <ul className="space-y-1">
              {info.tips.map((tip, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Overview of all pillars
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Understanding Enrichment</CardTitle>
          <p className="text-gray-600">Learn about the five essential pillars of canine wellness and how they work together to keep your dog happy and healthy.</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            A well-rounded enrichment program addresses all aspects of your dog's needs. Each pillar plays a unique role in your dog's overall wellbeing, and the best approach combines activities from all five areas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(pillarInfo).map(([key, info]) => {
              const IconComponent = info.icon;
              return (
                <Card key={key} className={`pillar-${key} border-2`}>
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-8 h-8 bg-white rounded-full flex items-center justify-center`}>
                        <IconComponent className={`w-4 h-4 text-${info.color}-600`} />
                      </div>
                      <h3 className="font-semibold text-gray-800">{info.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{info.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationalContent;
