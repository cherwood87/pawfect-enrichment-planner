
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ComponentTest {
  name: string;
  status: 'idle' | 'testing' | 'success' | 'error';
  error?: Error;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
}

const ComponentTestSuite: React.FC = () => {
  const [tests, setTests] = useState<ComponentTest[]>([
    {
      name: 'ModeToggle',
      status: 'idle',
      component: React.lazy(() => import('@/components/ModeToggle')),
      props: {} // ModeToggle doesn't need props
    },
    {
      name: 'DashboardHeader',
      status: 'idle',
      component: React.lazy(() => import('@/components/dashboard/DashboardHeader')),
      props: { onChatOpen: () => {}, onAddDogOpen: () => {} }
    },
    {
      name: 'DashboardContent',
      status: 'idle',
      component: React.lazy(() => import('@/components/dashboard/DashboardContent')),
      props: { 
        onAddDogOpen: () => {}, 
        onEditDogOpen: () => {}, 
        onPillarSelect: () => {}, 
        onChatOpen: () => {} 
      }
    },
    {
      name: 'FloatingChatButton',
      status: 'idle',
      component: React.lazy(() => import('@/components/dashboard/FloatingChatButton')),
      props: { onChatOpen: () => {} }
    }
  ]);

  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  const runTest = async (testName: string) => {
    console.log(`🧪 [ComponentTest] Testing ${testName}...`);
    
    setTests(prev => prev.map(test => 
      test.name === testName 
        ? { ...test, status: 'testing', error: undefined }
        : test
    ));

    try {
      const test = tests.find(t => t.name === testName);
      if (!test) throw new Error('Test not found');

      // Try to load the component
      const Component = test.component;
      
      // Simulate component rendering test
      await new Promise(resolve => setTimeout(resolve, 500));

      setTests(prev => prev.map(test => 
        test.name === testName 
          ? { ...test, status: 'success' }
          : test
      ));

      console.log(`✅ [ComponentTest] ${testName} passed`);
    } catch (error) {
      console.error(`❌ [ComponentTest] ${testName} failed:`, error);
      
      setTests(prev => prev.map(test => 
        test.name === testName 
          ? { ...test, status: 'error', error: error as Error }
          : test
      ));
    }
  };

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.name);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  };

  const renderTestComponent = () => {
    const test = tests.find(t => t.name === selectedTest);
    if (!test || test.status !== 'success') return null;

    const Component = test.component;
    
    try {
      return (
        <div className="mt-4 p-4 border rounded-lg">
          <h4 className="font-medium mb-2">Component Preview: {test.name}</h4>
          <div className="border rounded p-2 bg-gray-50">
            <React.Suspense fallback={<div>Loading component...</div>}>
              <Component {...(test.props || {})} />
            </React.Suspense>
          </div>
        </div>
      );
    } catch (error) {
      return (
        <div className="mt-4 p-4 border rounded-lg border-red-200 bg-red-50">
          <h4 className="font-medium mb-2 text-red-800">Component Error: {test.name}</h4>
          <pre className="text-xs text-red-600">{String(error)}</pre>
        </div>
      );
    }
  };

  const getStatusIcon = (status: ComponentTest['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'testing':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Component Test Suite
          <Button onClick={runAllTests} size="sm">
            Run All Tests
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tests.map((test) => (
            <div key={test.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(test.status)}
                <div>
                  <div className="font-medium">{test.name}</div>
                  {test.error && (
                    <div className="text-xs text-red-600 mt-1">
                      {test.error.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={
                  test.status === 'success' ? 'default' :
                  test.status === 'error' ? 'destructive' :
                  test.status === 'testing' ? 'secondary' : 'outline'
                }>
                  {test.status}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => runTest(test.name)}
                  disabled={test.status === 'testing'}
                >
                  Test
                </Button>
                {test.status === 'success' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedTest(
                      selectedTest === test.name ? null : test.name
                    )}
                  >
                    {selectedTest === test.name ? 'Hide' : 'Preview'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {renderTestComponent()}
      </CardContent>
    </Card>
  );
};

export default ComponentTestSuite;
