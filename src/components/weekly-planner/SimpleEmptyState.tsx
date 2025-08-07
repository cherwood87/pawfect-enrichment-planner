
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SimpleEmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12 px-6">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
        <Calendar className="w-8 h-8 text-blue-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        No activities this week
      </h3>
      <p className="text-gray-500 mb-4 text-sm">
        Add some enrichment activities to get started!
      </p>
      <Button 
        onClick={() => navigate('/activity-library')} 
        size="sm"
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Activities
      </Button>
    </div>
  );
};

export default SimpleEmptyState;
