import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EducationalContentProps {
  pillar?: string;
  onPillarSelect?: (pillar: string) => void;
  selectedPillar?: string;
}

const pillars = [
  {
    id: 'mental',
    color: 'purple',
    title: 'Mental Enrichment',
    description:
      "For the thinkers and problem-solvers.\nThis pillar includes games and challenges that flex your dog’s brain — building focus, curiosity, and confidence without pressure."
  },
  {
    id: 'physical',
    color: 'green',
    title: 'Physical Enrichment',
    description:
      "For dogs who find peace in movement.\nExplore safe, engaging ways to move together — from soft walks and pattern exploration to strength-building play."
  },
  {
    id: 'social',
    color: 'blue',
    title: 'Social Enrichment',
    description:
      "For dogs who connect through presence.\nWhether it’s calm co-walking, play with trusted friends, or recovery beside their person — this pillar nurtures emotional safety through shared space."
  },
  {
    id: 'environmental',
    color: 'teal',
    title: 'Environmental Enrichment',
    description:
      "For the sensory seekers.\nThis pillar is all about sniffing, grounding, and discovering the world through texture, terrain, and temperature. It turns any space into an adventure."
  },
  {
    id: 'instinctual',
    color: 'orange',
    title: 'Instinctual Enrichment',
    description:
      "For the dogs who need to shred, chew, stalk, or forage.\nThis pillar honors natural behaviors that regulate the nervous system and bring deep satisfaction — because instinct isn’t a problem to fix, it’s a language to understand."
  }
];

// Map pillar id to Tailwind color classes for gradients and borders
const pillarColors: Record<string, string> = {
  mental: "from-purple-100 to-purple-50 border-purple-300 focus:ring-purple-400",
  physical: "from-green-100 to-green-50 border-green-300 focus:ring-green-400",
  social: "from-blue-100 to-blue-50 border-blue-300 focus:ring-blue-400",
  environmental: "from-teal-100 to-teal-50 border-teal-300 focus:ring-teal-400",
  instinctual: "from-orange-100 to-orange-50 border-orange-300 focus:ring-orange-400",
};

const EducationalContent: React.FC<EducationalContentProps> = ({
  onPillarSelect,
  selectedPillar
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Choose Your Enrichment Pillar
          </CardTitle>
          <p className="text-gray-600 mt-2 text-lg">
            Every dog has their own rhythm — and their own way of feeling fulfilled.<br />
            These five enrichment pillars help you uncover what matters most to your dog.
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-base text-gray-700 mb-4">
            Think of them like ingredients in a recipe. Some dogs need more scentwork. Others thrive through movement or quiet companionship. The goal isn’t to do everything — it’s to start where your dog lights up.
            <br /><br />
            <span className="font-semibold text-gray-900 text-lg">Which pillar speaks to your dog today?</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {pillars.map(pillarObj => (
              <button
                key={pillarObj.id}
                type="button"
                onClick={() => onPillarSelect?.(pillarObj.id)}
                className={`
                  border-2 rounded-xl text-left transition
                  shadow-sm
                  bg-gradient-to-br ${pillarColors[pillarObj.id]}
                  p-6 cursor-pointer
                  hover:shadow-lg hover:-translate-y-1
                  focus:outline-none focus:ring-2
                  duration-200 ease-in-out
                  ${selectedPillar === pillarObj.id
                    ? "ring-4 ring-offset-2 scale-105 border-4"
                    : "border-opacity-70"
                  }
                `}
                tabIndex={0}
                aria-label={`View activities for ${pillarObj.title}`}
                style={{
                  minHeight: '170px'
                }}
              >
                <span className="block font-bold text-xl mb-2 text-gray-900">{pillarObj.title}</span>
                <p className="text-gray-800 whitespace-pre-line text-base leading-relaxed">{pillarObj.description}</p>
              </button>
            ))}
          </div>
          <div className="border-t pt-6 mt-6 text-gray-700 text-base">
            <p className="mb-4 text-center">
              <span className="block text-2xl mb-2">★</span>
              <b>Not sure where to start? That’s okay.</b><br />
              Choose the pillar that feels most aligned with your dog’s personality — or let your dog show you through their behavior. Every pillar is a path to connection.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationalContent;