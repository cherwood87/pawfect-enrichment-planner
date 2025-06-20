import React from "react";
import { Star, Heart } from "lucide-react";

const EducationalContent: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <Star className="w-6 h-6 text-amber-500" />
        <Heart className="w-6 h-6 text-purple-500" />
        <Star className="w-6 h-6 text-cyan-500" />
      </div>

      <div className="text-gray-700 text-center space-y-3">
        <p className="text-lg font-semibold text-purple-800">
          Not sure where to start? That's okay.
        </p>
        <p className="leading-relaxed">
          Choose the pillar that feels most aligned with your dog's personality
          — or let your dog show you through their behavior.
        </p>
        <p className="text-purple-600 font-medium">
          Every pillar is a path to connection.
        </p>
      </div>
    </div>
  );
};

export default EducationalContent;
