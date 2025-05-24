
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Users, Check } from 'lucide-react';

const Benefits_Overview: React.FC = () => {
  const benefits = [
    {
      icon: Brain,
      title: "Science-Based Approach",
      description: "Built on proven canine behavior research and veterinary expertise to ensure your dog's optimal wellbeing.",
      color: "purple"
    },
    {
      icon: Users,
      title: "Personalized for Your Dog",
      description: "Take our personality quiz to get customized recommendations that match your dog's unique needs and preferences.",
      color: "blue"
    },
    {
      icon: Check,
      title: "Track Progress & Build Habits",
      description: "Monitor your dog's activities, build consistent routines, and watch their happiness and health improve over time.",
      color: "green"
    }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Why Dogs Need Enrichment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A fulfilled dog is a happy, healthy dog. Our comprehensive approach ensures your dog 
            gets the mental, physical, and emotional stimulation they need to thrive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-16 h-16 mx-auto rounded-full bg-${benefit.color}-100 flex items-center justify-center mb-4`}>
                    <IconComponent className={`w-8 h-8 text-${benefit.color}-600`} />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                The Cost of Boredom
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                  Destructive behaviors like chewing and digging
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                  Excessive barking and anxiety
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                  Weight gain and health issues
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                  Shortened lifespan and reduced quality of life
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                The Benefits of Enrichment
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Improved behavior and obedience
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Reduced stress and anxiety
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Better physical health and fitness
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Stronger bond with their human family
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits_Overview;
