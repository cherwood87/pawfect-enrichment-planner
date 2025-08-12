import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDog } from '@/contexts/DogContext';
import { useActivity } from '@/contexts/ActivityContext';
import { usePersonalizedActivities } from '@/hooks/usePersonalizedActivities';
import { ActivityRecommendationService } from '@/services/domain/ActivityRecommendationService';
import { Brain, Target, Zap, Users, MapPin, Search } from 'lucide-react';

const QuizIntegrationTestPage: React.FC = () => {
  const { currentDog } = useDog();
  const { getCombinedActivityLibrary } = useActivity();
  const [testResults, setTestResults] = useState<any>(null);

  const runIntegrationTest = () => {
    if (!currentDog) {
      setTestResults({ error: 'No dog selected' });
      return;
    }

    const activities = getCombinedActivityLibrary();
    const { personalizedActivities, quizPersonalityContext, hasQuizResults } = usePersonalizedActivities(
      activities, 
      currentDog, 
      10
    );

    const scoredActivities = ActivityRecommendationService.scoreActivitiesForDog(activities, currentDog);
    const topActivities = scoredActivities.slice(0, 5);

    setTestResults({
      dog: currentDog,
      hasQuizResults,
      quizPersonalityContext,
      totalActivities: activities.length,
      personalizedCount: personalizedActivities.length,
      topScoredActivities: topActivities.map(scored => ({
        title: scored.activity.title,
        pillar: scored.activity.pillar,
        score: scored.score.toFixed(3),
        reasons: scored.reasons
      }))
    });
  };

  const pillarIcons = {
    mental: Brain,
    physical: Zap,
    social: Users,
    environmental: MapPin,
    instinctual: Search
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Integration Test Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={runIntegrationTest} size="lg">
              Run Integration Test
            </Button>
            {currentDog && (
              <Badge variant="outline">
                Testing with: {currentDog.name}
              </Badge>
            )}
          </div>

          {testResults && (
            <div className="space-y-6 mt-6">
              {testResults.error ? (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <p className="text-red-700">Error: {testResults.error}</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Quiz Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Quiz Integration Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium">Has Quiz Results:</p>
                          <Badge variant={testResults.hasQuizResults ? "default" : "secondary"}>
                            {testResults.hasQuizResults ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-medium">Personality Type:</p>
                          <Badge variant="outline">
                            {testResults.dog.quizResults?.personality || "Not Available"}
                          </Badge>
                        </div>
                      </div>
                      {testResults.quizPersonalityContext && (
                        <div className="mt-4">
                          <p className="font-medium mb-2">AI Context:</p>
                          <p className="text-sm bg-gray-50 p-3 rounded">
                            {testResults.quizPersonalityContext}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Pillar Rankings */}
                  {testResults.dog.quizResults?.ranking && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Pillar Rankings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {testResults.dog.quizResults.ranking.map((pillar: any, index: number) => {
                            const Icon = pillarIcons[pillar.pillar as keyof typeof pillarIcons];
                            return (
                              <div key={pillar.pillar} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                                <Badge variant={index < 2 ? "default" : "secondary"}>
                                  #{pillar.rank}
                                </Badge>
                                <Icon className="h-5 w-5" />
                                <div className="flex-1">
                                  <p className="font-medium capitalize">{pillar.pillar}</p>
                                  <p className="text-sm text-gray-600">{pillar.reason}</p>
                                </div>
                                <Badge variant="outline">
                                  Score: {pillar.score}
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Activity Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Recommended Activities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {testResults.topScoredActivities.map((activity: any, index: number) => (
                          <div key={index} className="border rounded p-4">
                            <div className="flex items-center gap-4 mb-2">
                              <Badge variant="default">
                                Score: {activity.score}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {activity.pillar}
                              </Badge>
                            </div>
                            <h4 className="font-medium mb-2">{activity.title}</h4>
                            <div className="space-y-1">
                              {activity.reasons.map((reason: string, reasonIndex: number) => (
                                <p key={reasonIndex} className="text-sm text-gray-600">
                                  • {reason}
                                </p>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stats Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Personalization Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">{testResults.totalActivities}</p>
                          <p className="text-sm text-gray-600">Total Activities</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{testResults.personalizedCount}</p>
                          <p className="text-sm text-gray-600">Personalized Results</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {testResults.hasQuizResults ? "✅" : "❌"}
                          </p>
                          <p className="text-sm text-gray-600">Quiz Integration</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizIntegrationTestPage;