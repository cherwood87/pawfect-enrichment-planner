
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const WeeklyPlannerSkeleton: React.FC = () => {
  return (
    <Card className="col-span-2 shadow-lg rounded-2xl bg-gradient-to-br from-purple-50 to-cyan-50 border-2 border-purple-200">
      <CardHeader>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Navigation skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
        
        {/* Progress skeleton */}
        <Skeleton className="h-4 w-full rounded-xl" />
        
        {/* Weekly grid skeleton */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyPlannerSkeleton;
