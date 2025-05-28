
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
    <section className="py-12 px-6 min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto text-center w-full">
        {/* Enhanced Header */}
        <div className="mb-8 animate-fade-in">
          <div className="w-full mb-6 p-6 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="text-center">
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

        {/* Modern Hero Layout with Circular Image and Geometric Elements */}
        <div className="relative mb-12">
          {/* Playful Geometric Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top left circle */}
            <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full opacity-80 animate-pulse"></div>
            {/* Top right circle */}
            <div className="absolute top-8 right-8 w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-full opacity-70"></div>
            {/* Bottom left circle */}
            <div className="absolute bottom-12 left-12 w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full opacity-60"></div>
            {/* Bottom right circle */}
            <div className="absolute bottom-4 right-4 w-14 h-14 bg-gradient-to-br from-purple-300 to-cyan-300 rounded-full opacity-75 animate-pulse"></div>
            {/* Additional floating elements */}
            <div className="absolute top-1/3 left-8 w-8 h-8 bg-gradient-to-br from-cyan-300 to-cyan-400 rounded-full opacity-60"></div>
            <div className="absolute top-2/3 right-12 w-10 h-10 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full opacity-65"></div>
          </div>

          {/* Main Hero Content */}
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-12">
            {/* Left Content */}
            <div className="flex-1 max-w-lg text-left lg:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                Give Your Dog the
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-600">
                  {" "}Perfect Life{" "}
                </span>
                They Deserve
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Create personalized enrichment plans based on your dog's unique personality and needs. 
                Track activities across different enrichment pillars.
              </p>

              <div className="flex justify-center lg:justify-start">
                <Button 
                  onClick={handleGetStarted}
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Start Your Dog's Journey
                </Button>
              </div>
            </div>

            {/* Right Side - Circular Hero Image */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Main circular image container */}
                <div className="w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden shadow-2xl border-8 border-white bg-gradient-to-br from-purple-100 to-cyan-100 transform hover:scale-105 transition-all duration-500">
                  <img 
                    src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&h=800&q=80"
                    alt="Happy dog enjoying enrichment activities"
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />
                </div>
                
                {/* Floating accent circles around the main image */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-90 shadow-lg animate-bounce"></div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full opacity-85 shadow-lg"></div>
                <div className="absolute top-1/4 -left-8 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-80 shadow-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <Card className="max-w-4xl mx-auto overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-purple-100 to-orange-100 p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-purple-600">10K+</div>
                <div className="text-gray-600 font-medium">Happy Dogs</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-blue-600">5</div>
                <div className="text-gray-600 font-medium">Enrichment Pillars</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-orange-600">100+</div>
                <div className="text-gray-600 font-medium">Activities</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Hero_Intro;
