
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useDog } from '@/contexts/DogContext';
import DogProfileQuiz from '@/components/DogProfileQuiz';
import { ArrowLeft, PlusCircle } from 'lucide-react';

const DogProfileQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentDog } = useDog();
  const [showQuiz, setShowQuiz] = useState(true);

  if (!currentDog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50 flex items-center justify-center p-6">
        <div className="max-w-md mx-auto">
          {/* Decorative elements */}
          <div className="relative mb-8">
            <div className="absolute top-0 left-1/4 w-6 h-6 bg-purple-300 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-4 right-1/4 w-4 h-4 bg-cyan-300 rounded-full opacity-80 animate-pulse delay-300"></div>
            <div className="absolute bottom-0 left-1/3 w-3 h-3 bg-amber-300 rounded-full opacity-70 animate-pulse delay-500"></div>
          </div>

          <Card className="modern-card overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-100 via-cyan-100 to-amber-100 border-b-2 border-purple-200">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-cyan-500 rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-white">
                <PlusCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-purple-800 text-center">
                No Dog Profile Found
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center bg-gradient-to-br from-white/90 to-purple-50/90">
              <p className="text-gray-600 mb-6 text-lg">
                Please add a dog profile first before taking the personality quiz.
              </p>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => navigate('/app')}
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Add Dog Profile
                </Button>
                
                <Button 
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full modern-button-outline py-3"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-purple-200">
                <p className="text-sm text-purple-600">
                  💡 The personality quiz helps us understand your dog's preferences for better enrichment recommendations
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleQuizComplete = (results: any) => {
    // Handle quiz completion - could save results and navigate to dashboard
    console.log('Quiz completed:', results);
    navigate('/app');
  };

  const handleQuizClose = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50 flex items-center justify-center p-6">
      {showQuiz && (
        <DogProfileQuiz
          dogName={currentDog.name}
          onComplete={handleQuizComplete}
          onClose={handleQuizClose}
        />
      )}
    </div>
  );
};

export default DogProfileQuizPage;
