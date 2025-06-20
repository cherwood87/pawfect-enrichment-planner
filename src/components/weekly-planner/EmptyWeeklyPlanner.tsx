import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmptyWeeklyPlannerProps {
  onPillarSelect?: (pillar: string) => void;
}

const EmptyWeeklyPlanner: React.FC<EmptyWeeklyPlannerProps> = ({
  onPillarSelect,
}) => {
  const navigate = useNavigate();

  const pillarButtons = [
    { name: "mental", color: "from-purple-400 to-purple-500", emoji: "🧠" },
    { name: "physical", color: "from-green-400 to-green-500", emoji: "🏃" },
    { name: "social", color: "from-blue-400 to-blue-500", emoji: "👥" },
    { name: "environmental", color: "from-teal-400 to-teal-500", emoji: "🌿" },
    {
      name: "instinctual",
      color: "from-orange-400 to-orange-500",
      emoji: "🐕",
    },
  ];

  return (
    <Card className="overflow-hidden rounded-2xl shadow-lg border-0">
      <CardHeader className="bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 py-6 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-full shadow-sm">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-800">
              Weekly Enrichment Plan
            </CardTitle>
          </div>

          <button
            onClick={() => navigate("/activity-library")}
            aria-label="Add activity"
            className="
              w-10 h-10 flex items-center justify-center
              rounded-full bg-gradient-to-r from-blue-500 to-purple-500 
              text-white hover:from-blue-600 hover:to-purple-600 
              transition-all shadow-lg hover:shadow-xl hover:scale-105
              border-2 border-white
            "
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col items-center justify-center text-center py-12 px-6">
        {/* Animated Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-12 h-12 text-blue-500" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-pulse" />
        </div>

        {/* Main Message */}
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          Ready to Plan an Amazing Week?
        </h3>
        <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
          Create the perfect enrichment schedule for your dog with activities
          tailored to their personality and needs.
        </p>

        {/* Primary Action */}
        <div className="w-full max-w-md space-y-4">
          <Button
            onClick={() => navigate("/activity-library")}
            className="w-full py-3 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Explore Activity Library
          </Button>

          {/* Quick Pillar Selection */}
          {onPillarSelect && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 font-medium">
                Or start with a specific focus:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {pillarButtons.slice(0, 4).map((pillar) => (
                  <Button
                    key={pillar.name}
                    variant="outline"
                    size="sm"
                    onClick={() => onPillarSelect(pillar.name)}
                    className="text-xs font-medium border-2 hover:shadow-md transition-all"
                  >
                    <span className="mr-1">{pillar.emoji}</span>
                    {pillar.name.charAt(0).toUpperCase() + pillar.name.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl text-sm">
          <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2">
              <span className="text-white text-xs">📅</span>
            </div>
            <span className="font-medium text-blue-800">Smart Scheduling</span>
            <span className="text-blue-600 text-xs text-center">
              Plan activities by day and time
            </span>
          </div>

          <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mb-2">
              <span className="text-white text-xs">🎯</span>
            </div>
            <span className="font-medium text-purple-800">Pillar Balance</span>
            <span className="text-purple-600 text-xs text-center">
              Cover all enrichment areas
            </span>
          </div>

          <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mb-2">
              <span className="text-white text-xs">📈</span>
            </div>
            <span className="font-medium text-green-800">Track Progress</span>
            <span className="text-green-600 text-xs text-center">
              See completion rates
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyWeeklyPlanner;
