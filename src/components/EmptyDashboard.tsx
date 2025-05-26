
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Heart, Brain, Users, Zap, TreePine } from 'lucide-react';

interface EmptyDashboardProps {
  onAddDogOpen: () => void;
}

const EmptyDashboard: React.FC<EmptyDashboardProps> = ({ onAddDogOpen }) => {
  const pillars = [
    { name: 'Mental', icon: Brain, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Physical', icon: Zap, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Social', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Environmental', icon: TreePine, color: 'text-teal-600', bg: 'bg-teal-100' },
    { name: 'Instinctual', icon: Heart, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="max-w-4xl mx-auto mobile-container mobile-space-y">
      {/* Welcome Header */}
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center">
          <span className="text-4xl">🐕</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Welcome to Your Dog Enrichment Planner!
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Create personalized enrichment activities for your furry friend based on five key pillars: 
          Mental, Physical, Social, Environmental, and Instinctual stimulation.
        </p>
        <Button 
          onClick={onAddDogOpen}
          className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-lg px-8 py-3 h-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Your First Dog
        </Button>
      </div>

      {/* Enrichment Pillars Preview */}
      <Card className="mobile-card">
        <CardContent>
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            The Five Pillars of Dog Enrichment
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {pillars.map((pillar) => (
              <div key={pillar.name} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-3 ${pillar.bg} rounded-full flex items-center justify-center`}>
                  <pillar.icon className={`w-8 h-8 ${pillar.color}`} />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{pillar.name}</h3>
                <p className="text-xs text-gray-600">
                  {pillar.name === 'Mental' && 'Puzzle games, training, and cognitive challenges'}
                  {pillar.name === 'Physical' && 'Exercise, play, and movement activities'}
                  {pillar.name === 'Social' && 'Interaction with people and other dogs'}
                  {pillar.name === 'Environmental' && 'New places, sounds, and experiences'}
                  {pillar.name === 'Instinctual' && 'Natural behaviors like sniffing and foraging'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Steps */}
      <Card className="mobile-card">
        <CardContent>
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Getting Started
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Add Your Dog's Profile</h3>
                <p className="text-gray-600 text-sm">
                  Tell us about your dog's breed, age, and any special needs to get personalized recommendations.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Take the Personality Quiz</h3>
                <p className="text-gray-600 text-sm">
                  Help us understand your dog's preferences to prioritize the most engaging activities.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Start Planning Activities</h3>
                <p className="text-gray-600 text-sm">
                  Browse our activity library and create balanced enrichment plans for your pup.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benefits Preview */}
      <Card className="mobile-card bg-gradient-to-br from-blue-50 to-orange-50 border-blue-200">
        <CardContent>
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Why Enrichment Matters
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Reduces destructive behaviors</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">Improves mental health and happiness</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Strengthens your bond together</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">Provides appropriate outlets for energy</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span className="text-gray-700">Builds confidence and reduces anxiety</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-gray-700">Keeps your dog physically and mentally fit</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center py-8">
        <Button 
          onClick={onAddDogOpen}
          className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-lg px-8 py-3 h-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Get Started - Add Your Dog
        </Button>
      </div>
    </div>
  );
};

export default EmptyDashboard;
