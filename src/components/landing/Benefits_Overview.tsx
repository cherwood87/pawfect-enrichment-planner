
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Users, CheckCircle } from 'lucide-react';

const Benefits_Overview: React.FC = () => {
  const benefits = [
    {
      icon: Brain,
      title: "Science-Based Approach",
      description: "Built on proven canine behavior research and veterinary expertise to ensure your dog's optimal wellbeing.",
      color: "purple",
      bgGradient: "from-purple-100 to-purple-200",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: Users,
      title: "Personalized for Your Dog",
      description: "Take our personality quiz to get customized recommendations that match your dog's unique needs and preferences.",
      color: "cyan",
      bgGradient: "from-cyan-100 to-cyan-200",
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600"
    },
    {
      icon: CheckCircle,
      title: "Track Progress & Build Habits",
      description: "Monitor your dog's activities, build consistent routines, and watch their happiness and health improve over time.",
      color: "amber",
      bgGradient: "from-amber-100 to-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600"
    }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-purple-800 mb-4">
            Why Dogs Need Enrichment
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A fulfilled dog is a happy, healthy dog. Our comprehensive approach ensures your dog 
            gets the mental, physical, and emotional stimulation they need to thrive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card 
                key={index} 
                className={`text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br ${benefit.bgGradient} border-2 border-${benefit.color}-300 rounded-3xl`}
              >
                <CardHeader>
                  <div className={`w-16 h-16 mx-auto rounded-full ${benefit.iconBg} flex items-center justify-center mb-4 shadow-lg`}>
                    <IconComponent className={`w-8 h-8 ${benefit.iconColor}`} />
                  </div>
                  <CardTitle className="text-xl text-purple-800">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-purple-50 via-cyan-50 to-amber-50 rounded-3xl p-8 shadow-lg border-2 border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-purple-800 mb-4">
                The Cost of Boredom
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Destructive behaviors like chewing and digging</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Excessive barking and anxiety</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Weight gain and health issues</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-red-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Shortened lifespan and reduced quality of life</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-purple-800 mb-4">
                The Benefits of Enrichment
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Improved behavior and obedience</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Reduced stress and anxiety</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Better physical health and fitness</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Stronger bond with their human family</span>
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
