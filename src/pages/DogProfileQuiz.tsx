
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useDog } from '@/contexts/DogContext';
import DogProfileQuiz from '@/components/DogProfileQuiz';

const DogProfileQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentDog } = useDog();
  const [showQuiz, setShowQuiz] = useState(true);

  if (!currentDog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-6">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">No Dog Profile Found</h2>
            <p className="text-gray-600 mb-6">Please add a dog profile first before taking the quiz.</p>
            <Button 
              onClick={() => navigate('/app')}
              className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
            >
              Add Dog Profile
            </Button>
          </CardContent>
        </Card>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-6">
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
