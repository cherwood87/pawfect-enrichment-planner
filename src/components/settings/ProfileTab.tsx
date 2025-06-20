import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Activity, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDog } from "@/contexts/DogContext";
import { format } from "date-fns";

const ProfileTab = () => {
  const { user } = useAuth();
  const { state } = useDog();

  const totalDogs = state.dogs.length;
  const joinDate = user?.created_at ? new Date(user.created_at) : null;

  return (
    <div className="space-y-6">
      {/* User Information */}
      <Card className="border border-purple-200 rounded-2xl bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-800">
            <User className="w-5 h-5" />
            <span>Profile Information</span>
          </CardTitle>
          <CardDescription>
            Your account details and usage statistics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-xl border">
                {user?.email || "Not available"}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Member Since
              </label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-xl border flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>
                  {joinDate
                    ? format(joinDate, "MMMM d, yyyy")
                    : "Not available"}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card className="border border-purple-200 rounded-2xl bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-800">
            <TrendingUp className="w-5 h-5" />
            <span>Usage Statistics</span>
          </CardTitle>
          <CardDescription>Your activity on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl">
              <div className="text-2xl font-bold text-purple-800">
                {totalDogs}
              </div>
              <div className="text-sm text-purple-600">
                {totalDogs === 1 ? "Dog Profile" : "Dog Profiles"}
              </div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl">
              <div className="text-2xl font-bold text-cyan-800">0</div>
              <div className="text-sm text-cyan-600">Activities Completed</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl">
              <div className="text-2xl font-bold text-amber-800">0</div>
              <div className="text-sm text-amber-600">Current Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dog Profiles Summary */}
      {totalDogs > 0 && (
        <Card className="border border-purple-200 rounded-2xl bg-white/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-800">
              <Activity className="w-5 h-5" />
              <span>Your Dogs</span>
            </CardTitle>
            <CardDescription>
              Quick overview of your registered dogs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {state.dogs.map((dog) => (
                <div
                  key={dog.id}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl border border-purple-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {dog.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-purple-800">{dog.name}</p>
                      <p className="text-sm text-gray-600">{dog.breed}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-purple-100 text-purple-700 rounded-xl">
                      {dog.age} {dog.age === 1 ? "year" : "years"}
                    </Badge>
                    <Badge className="bg-cyan-100 text-cyan-700 rounded-xl">
                      {dog.activityLevel}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileTab;
