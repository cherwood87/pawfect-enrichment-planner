import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Quote } from 'lucide-react';
import { useLoginQuote } from '@/hooks/useLoginQuote';
import { useNavigate } from 'react-router-dom';
interface DailyQuoteCardProps {
  currentDog?: {
    name: string;
  } | null;
}
export const DailyQuoteCard: React.FC<DailyQuoteCardProps> = ({
  currentDog
}) => {
  const {
    quote
  } = useLoginQuote();
  const navigate = useNavigate();
  return <Card className="bg-gradient-to-br from-purple-50 to-cyan-50 border-2 border-purple-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3">
          
          <div>
            <h2 className="text-xl font-bold text-purple-800">Daily Inspiration</h2>
            <p className="text-sm text-purple-600">Your enrichment motivation for today</p>
          </div>
        </div>

        <div className="text-center bg-gradient-to-br from-purple-50 to-cyan-50 rounded-2xl border-2 border-purple-200 mb-6 mx-[18px] px-0 py-[7px]">
          
          
          <blockquote className="text-lg font-medium text-purple-800 mb-4 max-w-md mx-auto italic">
            "{quote.text}"
          </blockquote>
          
          {quote.author && <p className="text-sm text-purple-600 mb-6">— {quote.author}</p>}
          
          {currentDog && <p className="text-sm text-purple-600 mb-6">
              Ready to enrich {currentDog.name}'s day?
            </p>}
          
          
        </div>
      </CardContent>
    </Card>;
};