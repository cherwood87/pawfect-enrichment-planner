import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Hero_Intro: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/app');
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* New Enhanced Header */}
        <div className="mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-6 p-6 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <span className="text-4xl animate-bounce">🐕</span>
                <span className="text-4xl animate-bounce delay-100">🎯</span>
                <span className="text-4xl animate-bounce delay-200">🏆</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">
                Beyond Busy Dog
              </h1>
              <h2 className="text-xl md:text-3xl font-semibold text-yellow-200 drop-shadow-md">
                Enrichment Planner
              </h2>
              <div className="mt-3 flex justify-center">
                <div className="h-1 w-24 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Hero Content */}
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Give Your Dog the
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-600">
            {" "}Perfect Life{" "}
          </span>
          They Deserve
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Create personalized enrichment plans based on your dog's unique personality and needs. 
          Track activities across five essential pillars of canine wellness.
        </p>

        <div className="flex justify-center mb-12">
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-lg px-8 py-4"
          >
            Start Your Dog's Journey
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-purple-100 to-orange-100 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-600">10K+</div>
                <div className="text-gray-600">Happy Dogs</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">5</div>
                <div className="text-gray-600">Enrichment Pillars</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">100+</div>
                <div className="text-gray-600">Activities</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Hero_Intro;
