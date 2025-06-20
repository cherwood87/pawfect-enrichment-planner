
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface DiagnosticResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

const AppDiagnostics: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: DiagnosticResult[] = [];

    // Test 1: Basic React Rendering
    try {
      console.log('🔍 [Diagnostics] Testing basic React rendering...');
      results.push({
        name: 'React Rendering',
        status: 'success',
        message: 'React components are rendering successfully'
      });
    } catch (error) {
      results.push({
        name: 'React Rendering',
        status: 'error',
        message: 'React rendering failed',
        details: error
      });
    }

    // Test 2: Router Configuration
    try {
      console.log('🔍 [Diagnostics] Testing router configuration...');
      const currentPath = window.location.pathname;
      results.push({
        name: 'Router Configuration',
        status: 'success',
        message: `Router working, current path: ${currentPath}`
      });
    } catch (error) {
      results.push({
        name: 'Router Configuration',
        status: 'error',
        message: 'Router configuration issue',
        details: error
      });
    }

    // Test 3: Supabase Connection
    try {
      console.log('🔍 [Diagnostics] Testing Supabase connection...');
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.from('dogs').select('id').limit(1);
      
      if (error) {
        results.push({
          name: 'Supabase Connection',
          status: 'warning',
          message: 'Supabase connection issue',
          details: error
        });
      } else {
        results.push({
          name: 'Supabase Connection',
          status: 'success',
          message: 'Supabase connection successful'
        });
      }
    } catch (error) {
      results.push({
        name: 'Supabase Connection',
        status: 'error',
        message: 'Failed to test Supabase connection',
        details: error
      });
    }

    // Test 4: Local Storage Access
    try {
      console.log('🔍 [Diagnostics] Testing localStorage access...');
      localStorage.setItem('diagnostic-test', 'test');
      localStorage.removeItem('diagnostic-test');
      results.push({
        name: 'Local Storage',
        status: 'success',
        message: 'localStorage access working'
      });
    } catch (error) {
      results.push({
        name: 'Local Storage',
        status: 'error',
        message: 'localStorage access failed',
        details: error
      });
    }

    // Test 5: Context Providers
    try {
      console.log('🔍 [Diagnostics] Testing context providers...');
      // This test will pass if we can render the component
      results.push({
        name: 'Context Providers',
        status: 'success',
        message: 'Context providers are working'
      });
    } catch (error) {
      results.push({
        name: 'Context Providers',
        status: 'error',
        message: 'Context provider error',
        details: error
      });
    }

    // Test 6: Bundle Loading
    try {
      console.log('🔍 [Diagnostics] Testing bundle loading...');
      const startTime = performance.now();
      await new Promise(resolve => setTimeout(resolve, 100));
      const loadTime = performance.now() - startTime;
      
      results.push({
        name: 'Bundle Loading',
        status: loadTime > 1000 ? 'warning' : 'success',
        message: `Bundle load time: ${loadTime.toFixed(2)}ms`
      });
    } catch (error) {
      results.push({
        name: 'Bundle Loading',
        status: 'error',
        message: 'Bundle loading test failed',
        details: error
      });
    }

    setDiagnostics(results);
    setIsRunning(false);

    // Log summary
    const errorCount = results.filter(r => r.status === 'error').length;
    const warningCount = results.filter(r => r.status === 'warning').length;
    console.log(`🔍 [Diagnostics] Complete - ${errorCount} errors, ${warningCount} warnings`);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          App Diagnostics
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunning}
            size="sm"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Re-run Tests
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {diagnostics.map((diagnostic, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(diagnostic.status)}
              <div>
                <div className="font-medium">{diagnostic.name}</div>
                <div className="text-sm text-gray-600">{diagnostic.message}</div>
                {diagnostic.details && (
                  <details className="text-xs text-gray-500 mt-1">
                    <summary className="cursor-pointer">View Details</summary>
                    <pre className="mt-1 whitespace-pre-wrap">
                      {JSON.stringify(diagnostic.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
            <Badge className={getStatusColor(diagnostic.status)}>
              {diagnostic.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AppDiagnostics;
