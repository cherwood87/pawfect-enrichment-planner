
import React, { Suspense, lazy } from "react";
import { useAuth } from "@/contexts/AuthContext";
import SimpleNavigation from "@/components/SimpleNavigation";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

// Lazy load ActivityLibrary for performance
const ActivityLibrary = lazy(() => import("@/components/ActivityLibrary"));

const ActivityLibraryPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to access the activity library.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <SimpleNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Activity Library
          </h1>
          <p className="text-lg text-gray-600">
            Discover enrichment activities perfect for your dog
          </p>
        </div>

        <Suspense fallback={<LoadingSkeleton type="dashboard" />}>
          <ActivityLibrary />
        </Suspense>
      </main>
    </div>
  );
};

export default ActivityLibraryPage;
