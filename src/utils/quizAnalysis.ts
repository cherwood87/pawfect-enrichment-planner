
import { QuizResults, QuizQuestion } from '@/types/quiz';

export const generateReason = (pillar: string, score: number): string => {
  const reasons = {
    mental: score >= 4 ? 'High problem-solving interest' : score >= 2 ? 'Moderate mental stimulation needs' : 'Prefers simple activities',
    physical: score >= 4 ? 'High energy, needs lots of exercise' : score >= 2 ? 'Moderate activity needs' : 'Low energy, gentle exercise preferred',
    social: score >= 4 ? 'Very social, loves interaction' : score >= 2 ? 'Enjoys social time with guidance' : 'Prefers quiet, familiar company',
    environmental: score >= 4 ? 'Adventurous explorer' : score >= 2 ? 'Cautious but curious' : 'Prefers familiar environments',
    instinctual: score >= 4 ? 'Strong natural instincts' : score >= 2 ? 'Some instinctual interests' : 'Limited instinctual behaviors'
  };
  return reasons[pillar as keyof typeof reasons] || 'Needs assessment';
};

export const determinePersonality = (scores: Record<string, number>): string => {
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

export const generateRecommendations = (topPillars: Array<{pillar: string; rank: number; score: number; reason: string}>): string[] => {
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

export const analyzeQuizResults = (
  questions: QuizQuestion[], 
  answers: Record<string, string>
): QuizResults => {
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

  return {
    ranking,
    personality,
    recommendations
  };
};
