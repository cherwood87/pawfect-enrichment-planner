import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
const CTA_AddDog: React.FC = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate('/activity-library');
  };
  return <section className="py-20 px-6 bg-gradient-to-r from-purple-600 via-cyan-600 to-purple-600">
      <div className="max-w-4xl mx-auto text-center">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl border-4 border-white/50">
          <CardContent className="p-12">
            <h2 className="text-4xl font-bold text-purple-800 mb-6">
              Ready to Try Something New?
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join dog owners who never run out of fun activity ideas. Get started in under 2 minutes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg border-2 border-purple-300">
                  <span className="text-2xl font-bold text-purple-600">1</span>
                </div>
                <h3 className="font-semibold text-purple-800 mb-2">Tell Us About Your Dog</h3>
                <p className="text-sm text-gray-600">Name, breed, age, and energy level</p>
              </div>
              <div className="text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg border-2 border-cyan-300">
                  <span className="text-2xl font-bold text-cyan-600">2</span>
                </div>
                <h3 className="font-semibold text-purple-800 mb-2">Quick 2-Minute Quiz</h3>
                <p className="text-sm text-gray-600">What activities does your dog love?</p>
              </div>
              <div className="text-center transform hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg border-2 border-amber-300">
                  <span className="text-2xl font-bold text-amber-600">3</span>
                </div>
                <h3 className="font-semibold text-purple-800 mb-2">Get Ideas & Start Playing</h3>
                <p className="text-sm text-gray-600">Fun activities perfect for your dog</p>
              </div>
            </div>

            <Button onClick={handleGetStarted} size="lg" className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-xl px-12 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              Get Fun Activity Ideas!
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • Set up in under 2 minutes • Works for all dogs
            </p>

            <div className="mt-8 pt-8 border-t border-purple-200">
              <p className="text-lg font-semibold text-purple-800 mb-4">Join the Pack! </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center bg-white/50 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                  280+ activity ideas
                </div>
                <div className="flex items-center bg-white/50 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></div>
                  5-minute setup
                </div>
                <div className="flex items-center bg-white/50 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                  Instant AI help
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>;
};
export default CTA_AddDog;