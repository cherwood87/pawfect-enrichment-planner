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
            
            

            

            <Button onClick={() => navigate('/subscribe')} size="lg" className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-xl px-12 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              Get Premium Access - $5.99/mo
            </Button>
            
            <p className="text-sm text-gray-500 mt-4">Set up in under 2 minutes • Works for all dogs</p>

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