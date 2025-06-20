
import React from 'react';
import AppDiagnostics from '@/components/diagnostic/AppDiagnostics';
import LoadingStateDebugger from '@/components/diagnostic/LoadingStateDebugger';
import ComponentTestSuite from '@/components/diagnostic/ComponentTestSuite';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DiagnosticsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">App Diagnostics</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        
        <div className="text-gray-600 mb-6">
          This page helps diagnose and fix loading issues with the application.
          Run the tests below to identify potential problems.
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <AppDiagnostics />
            <LoadingStateDebugger />
          </div>
          
          <div>
            <ComponentTestSuite />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticsPage;
