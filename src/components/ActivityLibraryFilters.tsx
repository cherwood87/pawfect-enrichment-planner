import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain, Zap, Users, TreePine, Target, Search } from "lucide-react";

interface ActivityLibraryFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPillar: string;
  setSelectedPillar: (pillar: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
}

const ActivityLibraryFilters: React.FC<ActivityLibraryFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedPillar,
  setSelectedPillar,
  selectedDifficulty,
  setSelectedDifficulty,
}) => {
  const pillars = [
    { id: "all", name: "All Pillars", icon: Search, color: "gray" },
    { id: "mental", name: "Mental", icon: Brain, color: "purple" },
    { id: "physical", name: "Physical", icon: Zap, color: "green" },
    { id: "social", name: "Social", icon: Users, color: "blue" },
    {
      id: "environmental",
      name: "Environmental",
      icon: TreePine,
      color: "teal",
    },
    { id: "instinctual", name: "Instinctual", icon: Target, color: "orange" },
  ];

  const difficulties = [
    { value: "all", label: "All Difficulties" },
    { value: "Easy", label: "Easy" },
    { value: "Medium", label: "Medium" },
    { value: "Hard", label: "Hard" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <Select value={selectedPillar} onValueChange={setSelectedPillar}>
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Select pillar" />
        </SelectTrigger>
        <SelectContent>
          {pillars.map((pillar) => (
            <SelectItem key={pillar.id} value={pillar.id}>
              <div className="flex items-center space-x-2">
                <pillar.icon className={`w-4 h-4 text-${pillar.color}-500`} />
                <span>{pillar.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
        <SelectTrigger className="w-full md:w-40">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          {difficulties.map((difficulty) => (
            <SelectItem key={difficulty.value} value={difficulty.value}>
              {difficulty.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ActivityLibraryFilters;
