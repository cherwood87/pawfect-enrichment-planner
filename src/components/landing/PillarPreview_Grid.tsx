
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap, Users, TreePine, Target } from 'lucide-react';

const PillarPreview_Grid: React.FC = () => {
  const pillars = [
    {
      id: 'mental',
      title: 'Mental Stimulation',
      icon: Brain,
      description: 'Puzzle toys, training sessions, and brain games to keep your dog mentally sharp.',
      examples: ['Puzzle feeders', 'Trick training', 'Hide & seek games'],
      color: 'purple',
      bgClass: 'bg-gradient-to-br from-purple-100 to-purple-200'
    },
    {
      id: 'physical',
      title: 'Physical Exercise',
      icon: Zap,
      description: 'Activities that get your dog moving and help maintain optimal fitness levels.',
      examples: ['Daily walks', 'Fetch games', 'Agility training'],
      color: 'green',
      bgClass: 'bg-gradient-to-br from-green-100 to-green-200'
    },
    {
      id: 'social',
      title: 'Social Interaction',
      icon: Users,
      description: 'Opportunities to interact with other dogs, people, and new environments.',
      examples: ['Dog park visits', 'Playdates', 'Group training'],
      color: 'blue',
      bgClass: 'bg-gradient-to-br from-blue-100 to-blue-200'
    },
    {
      id: 'environmental',
      title: 'Environmental Enrichment',
      icon: TreePine,
      description: 'Exposure to new sights, sounds, smells, and textures to satisfy curiosity.',
      examples: ['New walking routes', 'Sensory gardens', 'Nature exploration'],
      color: 'teal',
      bgClass: 'bg-gradient-to-br from-teal-100 to-teal-200'
    },
    {
      id: 'instinctual',
      title: 'Instinctual Behaviors',
      icon: Target,
      description: 'Activities that allow dogs to express their natural behaviors and instincts.',
      examples: ['Digging areas', 'Scent work', 'Foraging games'],
      color: 'orange',
      bgClass: 'bg-gradient-to-br from-orange-100 to-orange-200'
    }
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            The Five Pillars of Dog Enrichment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our scientifically-backed approach covers all aspects of your dog's wellbeing. 
            Each pillar addresses different needs to create a balanced, happy life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => {
            const IconComponent = pillar.icon;
            return (
              <Card key={pillar.id} className={`${pillar.bgClass} border-2 hover:shadow-xl transition-all duration-300 ${index === 2 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm`}>
                      <IconComponent className={`w-6 h-6 text-${pillar.color}-600`} />
                    </div>
                    <CardTitle className="text-lg text-gray-800">{pillar.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{pillar.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800 text-sm">Examples:</h4>
                    <ul className="space-y-1">
                      {pillar.examples.map((example, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center">
                          <div className={`w-1.5 h-1.5 bg-${pillar.color}-500 rounded-full mr-2`}></div>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Personalized Just for Your Dog
            </h3>
            <p className="text-gray-600 mb-6">
              Not every dog needs the same thing. Our personality quiz helps determine which pillars 
              your dog values most, so you can focus your energy where it matters.
            </p>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-orange-100 rounded-full px-6 py-3">
              <span className="text-sm font-medium text-gray-700"> Take the quiz → Get custom plan → Track progress → Happy dog! </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PillarPreview_Grid;
