import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EducationalContentProps {
  pillar?: string;
  onPillarSelect?: (pillar: string) => void;
}

const pillars = [
  {
    id: 'mental',
    icon: null,
    title: 'Mental Enrichment',
    description:
      "For the thinkers and problem-solvers.\nThis pillar includes games and challenges that flex your dog’s brain — building focus, curiosity, and confidence without pressure."
  },
  {
    id: 'physical',
    icon: null,
    title: 'Physical Enrichment',
    description:
      "For dogs who find peace in movement.\nExplore safe, engaging ways to move together — from soft walks and pattern exploration to strength-building play."
  },
  {
    id: 'social',
    icon: null,
    title: 'Social Enrichment',
    description:
      "For dogs who connect through presence.\nWhether it’s calm co-walking, play with trusted friends, or recovery beside their person — this pillar nurtures emotional safety through shared space."
  },
  {
    id: 'environmental',
    icon: null,
    title: 'Environmental Enrichment',
    description:
      "For the sensory seekers.\nThis pillar is all about sniffing, grounding, and discovering the world through texture, terrain, and temperature. It turns any space into an adventure."
  },
  {
    id: 'instinctual',
    icon: null,
    title: 'Instinctual Enrichment',
    description:
      "For the dogs who need to shred, chew, stalk, or forage.\nThis pillar honors natural behaviors that regulate the nervous system and bring deep satisfaction — because instinct isn’t a problem to fix, it’s a language to understand."
  }
];

const EducationalContent: React.FC<EducationalContentProps> = ({
  pillar,
  onPillarSelect
}) => {
  // If a pillar is selected, you could render pillar-specific details here.
  // If you want pillar-specific content, you can add it similar to before.

  // Otherwise, show the overview content.
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">
            Choose Your Enrichment Pillar
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Every dog has their own rhythm — and their own way of feeling fulfilled.<br />
            These five enrichment pillars help you uncover what matters most to your dog.
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 mb-4">
            Think of them like ingredients in a recipe. Some dogs need more scentwork. Others thrive through movement or quiet companionship. The goal isn’t to do everything — it’s to start where your dog lights up.
            <br /><br />
            <b>Which pillar speaks to your dog today?</b>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {pillars.map(pillarObj => (
              <button
                key={pillarObj.id}
                type="button"
                onClick={() => onPillarSelect?.(pillarObj.id)}
                className={`
                  border-2 rounded-xl text-left transition
                  hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400
                  bg-white p-4 cursor-pointer
                `}
                tabIndex={0}
                aria-label={`View activities for ${pillarObj.title}`}
              >
                <div className="mb-2">
                  <span className="font-semibold text-lg text-gray-800">{pillarObj.title}</span>
                </div>
                <p className="text-gray-700 whitespace-pre-line">{pillarObj.description}</p>
              </button>
            ))}
          </div>
          <div className="border-t pt-6 mt-6 text-gray-700 text-base">
            <p className="mb-4">
              <span className="block text-center text-2xl mb-2">*</span>
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