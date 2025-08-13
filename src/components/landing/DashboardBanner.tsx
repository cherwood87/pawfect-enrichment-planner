
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardBanner: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">🐕</span>
          </div>
          <div>
            <p className="font-medium">Welcome back, {user.email}!</p>
            <p className="text-sm text-blue-100">Continue your dog's enrichment journey</p>
          </div>
        </div>
        <Link to="/activity-library">
          <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 flex items-center space-x-2">
            <span>Go to Activity Library</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardBanner;
