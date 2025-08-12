import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Zap, Star } from 'lucide-react';
const PillarPreview_Grid: React.FC = () => {
  return <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-purple-800 mb-4">
            Simple Process, Amazing Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting started is easy! Take a quick quiz, get activity ideas that work for your dog, and have fun together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-300 rounded-3xl">
            <CardContent className="p-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-4 shadow-lg">
                <Lightbulb className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-purple-800 mb-3">Quick Personality Quiz</h3>
              <p className="text-gray-700">
                Tell us about your dog's breed, energy level, and what they love to do
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-cyan-100 to-cyan-200 border-2 border-cyan-300 rounded-3xl">
            <CardContent className="p-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-cyan-100 flex items-center justify-center mb-4 shadow-lg">
                <Zap className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-purple-800 mb-3">Get Activity Ideas</h3>
              <p className="text-gray-700">
                Instantly see activities perfect for your dog - from quick games to fun projects
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300 rounded-3xl">
            <CardContent className="p-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-4 shadow-lg">
                <Star className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-purple-800 mb-3">Try & Have Fun</h3>
              <p className="text-gray-700">
                Start playing! Track what works and discover even more activities over time
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-purple-100 via-cyan-100 to-amber-100 border-2 border-purple-300 rounded-3xl shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                <span className="text-lg font-bold text-purple-800">Quick quiz → Activity ideas → Have fun together</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-purple-800 mb-4">
              Ready to Try Something New?
            </h3>
            <p className="text-gray-700 text-lg">
              Join dog owners who never run out of fun activities to try with their dogs.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>;
};
export default PillarPreview_Grid;