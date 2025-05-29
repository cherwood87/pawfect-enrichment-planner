import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Heart, Sparkles, Target, TrendingUp } from 'lucide-react';
interface EmptyDashboardProps {
  onAddDogOpen?: () => void;
  onPillarSelect?: (pillar: string, mode?: 'daily' | 'weekly') => void;
}
const features = [{
  icon: Target,
  title: "Create personalized weekly enrichment plans",
  color: "purple",
  bgGradient: "from-purple-100 to-purple-200"
}, {
  icon: Sparkles,
  title: "Track enrichment activities across 5 key pillars",
  color: "cyan",
  bgGradient: "from-cyan-100 to-cyan-200"
}, {
  icon: TrendingUp,
  title: "Monitor your dog's progress and streaks",
  color: "amber",
  bgGradient: "from-amber-100 to-amber-200"
}, {
  icon: Heart,
  title: "Access our curated activity library",
  color: "emerald",
  bgGradient: "from-emerald-100 to-emerald-200"
}];
const EmptyDashboard: React.FC<EmptyDashboardProps> = ({
  onAddDogOpen,
  onPillarSelect
}) => {
  return <div className="container mx-auto mobile-container py-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 via-cyan-400 to-amber-400 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
              <Heart className="w-16 h-16 text-white" />
            </div>
            {/* Decorative elements */}
            <div className="absolute top-4 left-1/2 transform -translate-x-12 w-6 h-6 bg-purple-300 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute bottom-4 right-1/2 transform translate-x-16 w-4 h-4 bg-cyan-300 rounded-full opacity-80 animate-pulse delay-300"></div>
            <div className="absolute top-8 right-1/2 transform translate-x-20 w-3 h-3 bg-amber-300 rounded-full opacity-70 animate-pulse delay-500"></div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-purple-800 mb-4">
            Welcome to Your Dog's
            <span className="block bg-gradient-to-r from-purple-600 via-cyan-600 to-amber-600 bg-clip-text text-transparent">
              Enrichment Journey!
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">Transform you dog's life with science-based enrichment activities. Let's start by creating their personalized profile.</p>
        </div>

        {/* Main CTA Card */}
        <Card className="modern-card mb-12 overflow-hidden">
          <CardContent className="p-8 text-center bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50">
            <div className="mb-6">
              <Button onClick={() => onAddDogOpen?.()} size="lg" className="bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-600 hover:from-purple-600 hover:via-cyan-600 hover:to-purple-700 text-white px-12 py-6 text-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-300">
                <PlusCircle className="w-6 h-6 mr-3" />
                Add Your Dog
              </Button>
            </div>
            
            <p className="text-purple-700 font-medium mb-4">
              🐕 Ready to get started? It takes less than 2 minutes!
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                <span className="text-purple-700">Science-backed</span>
              </div>
              <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                <span className="text-purple-700">Personalized plans</span>
              </div>
              <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-md">
                <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                <span className="text-purple-700">Track progress</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-purple-800 text-center mb-8">
            What You'll Be Able to Do
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => {
            const IconComponent = feature.icon;
            return <Card key={idx} className={`hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br ${feature.bgGradient} border-2 border-${feature.color}-300 rounded-3xl`}>
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl bg-${feature.color}-100 flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-${feature.color}-200`}>
                      <IconComponent className={`w-6 h-6 text-${feature.color}-600`} />
                    </div>
                    <p className="text-purple-800 font-medium">{feature.title}</p>
                  </CardContent>
                </Card>;
          })}
          </div>
        </div>

        {/* Journey Steps */}
        <Card className="bg-gradient-to-r from-purple-100 via-cyan-100 to-amber-100 border-2 border-purple-300 rounded-3xl shadow-xl">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-purple-800 text-center mb-8">
              Your Journey in 3 Simple Steps
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white text-2xl font-bold text-white">
                  1
                </div>
                <h4 className="font-semibold text-purple-800 mb-2">Add Your Dog</h4>
                <p className="text-sm text-purple-600">Tell us about your furry friend's personality and needs</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white text-2xl font-bold text-white">
                  2
                </div>
                <h4 className="font-semibold text-purple-800 mb-2">Take the Quiz</h4>
                <p className="text-sm text-purple-600">Discover which enrichment pillars your dog enjoys most</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white text-2xl font-bold text-white">
                  3
                </div>
                <h4 className="font-semibold text-purple-800 mb-2">Start Enriching</h4>
                <p className="text-sm text-purple-600">Get personalized activities and watch your dog thrive</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
EmptyDashboard.defaultProps = {
  onAddDogOpen: () => {},
  onPillarSelect: () => {}
};
export default EmptyDashboard;