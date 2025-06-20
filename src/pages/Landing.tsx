
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Shield, Users, Zap, ArrowRight, Bug } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Heart,
      title: "Five Pillars of Enrichment",
      description: "Mental, Physical, Social, Environmental, and Instinctual activities for your dog's wellbeing"
    },
    {
      icon: Shield,
      title: "Personalized Plans",
      description: "Custom enrichment plans based on your dog's personality and preferences"
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "AI-powered coach to help you choose the best activities for your dog"
    },
    {
      icon: Zap,
      title: "Track Progress",
      description: "Monitor your dog's enrichment journey and build healthy habits"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-purple-800 mb-6">
            Beyond Busy Dog
          </h1>
          <h2 className="text-2xl text-gray-700 mb-8">
            Enrichment Planner
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Transform your dog's life with scientifically-backed enrichment activities. 
            Build stronger bonds, reduce behavioral issues, and create a happier, 
            more fulfilled companion through our five-pillar approach.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-lg px-8 py-3"
              onClick={() => navigate('/auth')}
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-3"
              onClick={() => navigate('/diagnostics')}
            >
              <Bug className="mr-2 w-5 h-5" />
              App Diagnostics
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-full flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <CardTitle className="text-purple-800">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-xl">
          <h3 className="text-3xl font-bold text-purple-800 mb-4">
            Ready to Enrich Your Dog's Life?
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            Join thousands of dog owners who have transformed their pets' wellbeing
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-lg px-8 py-3"
            onClick={() => navigate('/auth')}
          >
            Start Your Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
