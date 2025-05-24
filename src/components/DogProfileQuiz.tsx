
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  pillar: string;
  options: Array<{ value: string; label: string; weight: number }>;
}

interface QuizResults {
  ranking: Array<{
    pillar: string;
    rank: number;
    reason: string;
    score: number;
  }>;
  personality: string;
  recommendations: string[];
}

interface DogProfileQuizProps {
  onComplete: (results: QuizResults) => void;
  onClose: () => void;
}

const DogProfileQuiz: React.FC<DogProfileQuizProps> = ({ onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const questions: QuizQuestion[] = [
    {
      id: 'mental_puzzles',
      question: 'Does your dog enjoy puzzle toys or problem-solving games?',
      pillar: 'mental',
      options: [
        { value: 'loves', label: 'Absolutely loves them!', weight: 3 },
        { value: 'likes', label: 'Enjoys them sometimes', weight: 2 },
        { value: 'neutral', label: 'Not particularly interested', weight: 1 },
        { value: 'dislikes', label: 'Gets frustrated or ignores them', weight: 0 }
      ]
    },
    {
      id: 'physical_energy',
      question: 'How energetic is your dog throughout the day?',
      pillar: 'physical',
      options: [
        { value: 'very_high', label: 'Extremely active, needs lots of exercise', weight: 3 },
        { value: 'high', label: 'Pretty active, enjoys daily walks/play', weight: 2 },
        { value: 'moderate', label: 'Moderate energy, content with short walks', weight: 1 },
        { value: 'low', label: 'Low energy, prefers relaxing', weight: 0 }
      ]
    },
    {
      id: 'social_interaction',
      question: 'How does your dog react to meeting new dogs or people?',
      pillar: 'social',
      options: [
        { value: 'excited', label: 'Gets very excited and wants to play', weight: 3 },
        { value: 'friendly', label: 'Friendly and approaches calmly', weight: 2 },
        { value: 'cautious', label: 'Cautious but warms up eventually', weight: 1 },
        { value: 'avoids', label: 'Prefers to avoid or hide', weight: 0 }
      ]
    },
    {
      id: 'environmental_exploration',
      question: 'Does your dog get excited about exploring new places?',
      pillar: 'environmental',
      options: [
        { value: 'loves', label: 'Loves new adventures and exploring', weight: 3 },
        { value: 'enjoys', label: 'Enjoys new places but takes time', weight: 2 },
        { value: 'mixed', label: 'Sometimes interested, sometimes not', weight: 1 },
        { value: 'prefers_familiar', label: 'Prefers familiar environments', weight: 0 }
      ]
    },
    {
      id: 'instinctual_behaviors',
      question: 'Does your dog love digging, sniffing, or hunting-type games?',
      pillar: 'instinctual',
      options: [
        { value: 'constantly', label: 'Always sniffing, digging, or hunting', weight: 3 },
        { value: 'often', label: 'Shows these behaviors regularly', weight: 2 },
        { value: 'sometimes', label: 'Occasional interest in these activities', weight: 1 },
        { value: 'rarely', label: 'Rarely shows these behaviors', weight: 0 }
      ]
    },
    {
      id: 'learning_motivation',
      question: 'How motivated is your dog to learn new tricks or commands?',
      pillar: 'mental',
      options: [
        { value: 'eager', label: 'Eager learner, picks up quickly', weight: 3 },
        { value: 'willing', label: 'Willing to learn with treats/praise', weight: 2 },
        { value: 'stubborn', label: 'Can be stubborn but eventually learns', weight: 1 },
        { value: 'difficult', label: 'Finds learning challenging', weight: 0 }
      ]
    },
    {
      id: 'play_preferences',
      question: 'What type of play does your dog prefer most?',
      pillar: 'physical',
      options: [
        { value: 'fetch', label: 'Running games like fetch or chase', weight: 3 },
        { value: 'tug', label: 'Tug-of-war or wrestling', weight: 2 },
        { value: 'gentle', label: 'Gentle play or short bursts', weight: 1 },
        { value: 'minimal', label: 'Prefers minimal physical play', weight: 0 }
      ]
    },
    {
      id: 'routine_flexibility',
      question: 'How does your dog handle changes to their routine?',
      pillar: 'environmental',
      options: [
        { value: 'adaptable', label: 'Very adaptable, goes with the flow', weight: 3 },
        { value: 'adjusts', label: 'Adjusts well after initial hesitation', weight: 2 },
        { value: 'stressed', label: 'Gets a bit stressed but manages', weight: 1 },
        { value: 'difficult', label: 'Really struggles with changes', weight: 0 }
      ]
    }
  ];

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const generateReason = (pillar: string, score: number): string => {
    const reasons = {
      mental: score >= 4 ? 'High problem-solving interest' : score >= 2 ? 'Moderate mental stimulation needs' : 'Prefers simple activities',
      physical: score >= 4 ? 'High energy, needs lots of exercise' : score >= 2 ? 'Moderate activity needs' : 'Low energy, gentle exercise preferred',
      social: score >= 4 ? 'Very social, loves interaction' : score >= 2 ? 'Enjoys social time with guidance' : 'Prefers quiet, familiar company',
      environmental: score >= 4 ? 'Adventurous explorer' : score >= 2 ? 'Cautious but curious' : 'Prefers familiar environments',
      instinctual: score >= 4 ? 'Strong natural instincts' : score >= 2 ? 'Some instinctual interests' : 'Limited instinctual behaviors'
    };
    return reasons[pillar as keyof typeof reasons] || 'Needs assessment';
  };

  const determinePersonality = (scores: Record<string, number>): string => {
    const maxScore = Math.max(...Object.values(scores));
    const maxPillar = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0];
    
    const personalities = {
      mental: 'Problem Solver',
      physical: 'Active Athlete',
      social: 'Social Butterfly',
      environmental: 'Curious Explorer',
      instinctual: 'Natural Hunter'
    };
    
    return personalities[maxPillar as keyof typeof personalities] || 'Balanced Companion';
  };

  const generateRecommendations = (topPillars: Array<{pillar: string; rank: number; score: number; reason: string}>): string[] => {
    const recommendations: Record<string, string[]> = {
      mental: ['Puzzle feeders', 'Training sessions', 'Hide and seek games'],
      physical: ['Daily walks', 'Fetch games', 'Agility training'],
      social: ['Dog park visits', 'Playdates', 'Group training classes'],
      environmental: ['New walking routes', 'Different surfaces', 'Outdoor adventures'],
      instinctual: ['Sniff walks', 'Digging boxes', 'Scent games']
    };
    
    return topPillars.flatMap(pillar => 
      recommendations[pillar.pillar]?.slice(0, 2) || []
    ).slice(0, 4);
  };

  const analyzeResults = async () => {
    setIsAnalyzing(true);
    
    // Calculate pillar scores
    const pillarScores: Record<string, number> = {
      mental: 0,
      physical: 0,
      social: 0,
      environmental: 0,
      instinctual: 0
    };

    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const option = question.options.find(opt => opt.value === answer);
        if (option) {
          pillarScores[question.pillar] += option.weight;
        }
      }
    });

    // Create ranking
    const ranking = Object.entries(pillarScores)
      .map(([pillar, score]) => ({ pillar, score }))
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        pillar: item.pillar,
        rank: index + 1,
        score: item.score,
        reason: generateReason(item.pillar, item.score)
      }));

    const personality = determinePersonality(pillarScores);
    const recommendations = generateRecommendations(ranking.slice(0, 2));

    const results: QuizResults = {
      ranking,
      personality,
      recommendations
    };

    setTimeout(() => {
      setIsAnalyzing(false);
      onComplete(results);
    }, 2000);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const currentAnswer = answers[currentQ.id];

  if (isAnalyzing) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Analyzing Your Dog's Profile...</h3>
            <p className="text-sm text-gray-600">We're processing the quiz results to create personalized enrichment recommendations.</p>
          </div>
          <Progress value={100} className="mb-4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-800">Dog Personality Quiz</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="text-base font-medium text-gray-800 mb-4">{currentQ.question}</h3>
          
          <RadioGroup value={currentAnswer || ''} onValueChange={handleAnswerChange}>
            {currentQ.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {currentQuestion === questions.length - 1 ? (
            <Button 
              onClick={analyzeResults}
              disabled={!currentAnswer}
              className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
            >
              Analyze Results
            </Button>
          ) : (
            <Button 
              onClick={nextQuestion}
              disabled={!currentAnswer}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DogProfileQuiz;
