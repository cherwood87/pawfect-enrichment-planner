import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Quote, Shuffle } from 'lucide-react';
import { useDailyQuote } from '@/hooks/useDailyQuote';
import { useNavigate } from 'react-router-dom';

interface DailyQuoteCardProps {
  currentDog?: { name: string } | null;
}

export const DailyQuoteCard: React.FC<DailyQuoteCardProps> = ({ currentDog }) => {
  const { quote, shuffleNow } = useDailyQuote();
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-cyan-50 border-2 border-purple-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-3 rounded-2xl">
              <Quote className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-purple-800">Daily Inspiration</h2>
              <p className="text-sm text-purple-600">Your enrichment motivation for today</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={shuffleNow}
            className="text-purple-600 hover:text-purple-800 hover:bg-purple-100"
            title="Get a new quote"
          >
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-center py-8 bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl border-2 border-purple-200">
          <div className="bg-gradient-to-r from-purple-400 to-cyan-400 p-3 rounded-2xl w-16 h-16 mx-auto mb-6">
            <Quote className="w-10 h-10 text-white mx-auto" />
          </div>
          
          <blockquote className="text-lg font-medium text-purple-800 mb-4 max-w-md mx-auto italic">
            "{quote.text}"
          </blockquote>
          
          {quote.author && (
            <p className="text-sm text-purple-600 mb-6">— {quote.author}</p>
          )}
          
          {currentDog && (
            <p className="text-sm text-purple-600 mb-6">
              Ready to enrich {currentDog.name}'s day?
            </p>
          )}
          
          <Button 
            onClick={() => navigate('/activity-library')} 
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Browse Activity Library
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};