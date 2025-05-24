
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Hero_Intro: React.FC = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
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

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-lg px-8 py-4"
          >
            Start Your Dog's Journey
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 py-4 border-2"
          >
            Learn More
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
