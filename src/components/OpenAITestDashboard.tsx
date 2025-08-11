import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, Zap, Shield, Activity } from 'lucide-react';
import { OpenAITestSuite, SecurityValidator } from '@/utils/openai-test-utils';
import { defaultRateLimiter } from '@/utils/openai-rate-limiter';
import { useToast } from '@/components/ui/use-toast';

interface TestResults {
  authTests?: any;
  inputValidation?: any;
  concurrency?: any;
  summary?: any;
}

const OpenAITestDashboard: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResults>({});
  const [selectedTest, setSelectedTest] = useState<string>('overview');
  const { toast } = useToast();

  const runFullTestSuite = async () => {
    setIsRunning(true);
    try {
      const results = await OpenAITestSuite.runFullTestSuite();
      setTestResults(results);
      
      toast({
        title: "Test Suite Complete",
        description: `${results.summary.passed}/${results.summary.totalTests} tests passed`,
        variant: results.summary.failed > 0 ? "destructive" : "default"
      });
    } catch (error) {
      toast({
        title: "Test Suite Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runSingleTest = async (testType: string) => {
    setIsRunning(true);
    try {
      let result;
      switch (testType) {
        case 'auth':
          result = await OpenAITestSuite.testAPIKeyAuthentication();
          setTestResults(prev => ({ ...prev, authTests: result }));
          break;
        case 'input':
          result = await OpenAITestSuite.testInputValidation();
          setTestResults(prev => ({ ...prev, inputValidation: result }));
          break;
        case 'concurrency':
          result = await OpenAITestSuite.testConcurrency(5);
          setTestResults(prev => ({ ...prev, concurrency: result }));
          break;
      }
      
      toast({
        title: "Test Complete",
        description: `${testType} test completed successfully`
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const formatResponseTime = (time: number) => {
    if (time < 1000) return `${time}ms`;
    return `${(time / 1000).toFixed(2)}s`;
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    );
  };

  const metrics = defaultRateLimiter.getMetrics();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">OpenAI API Test Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive testing suite for OpenAI integration
          </p>
        </div>
        <Button 
          onClick={runFullTestSuite} 
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          {isRunning ? <Clock className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
          {isRunning ? 'Running Tests...' : 'Run Full Test Suite'}
        </Button>
      </div>

      <Tabs value={selectedTest} onValueChange={setSelectedTest}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="tools">Test Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(metrics.successRate * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics.totalRequests} total requests
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatResponseTime(metrics.averageResponseTime)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last hour average
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.activeRequests}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.queueLength} queued
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Errors</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.recentErrors.length}</div>
                <p className="text-xs text-muted-foreground">
                  Last 10 unique errors
                </p>
              </CardContent>
            </Card>
          </div>

          {testResults.summary && (
            <Card>
              <CardHeader>
                <CardTitle>Latest Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {testResults.summary.passed}
                    </div>
                    <p className="text-sm text-muted-foreground">Passed</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {testResults.summary.failed}
                    </div>
                    <p className="text-sm text-muted-foreground">Failed</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {formatResponseTime(testResults.summary.averageResponseTime)}
                    </div>
                    <p className="text-sm text-muted-foreground">Avg Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="auth" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Authentication Tests</h2>
            <Button onClick={() => runSingleTest('auth')} disabled={isRunning}>
              Run Auth Tests
            </Button>
          </div>

          {testResults.authTests && (
            <div className="grid gap-4">
              {Object.entries(testResults.authTests).map(([testName, result]: [string, any]) => (
                <Card key={testName}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(result.success)}
                      {testName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Badge variant={result.success ? "default" : "destructive"}>
                          {result.success ? 'PASS' : 'FAIL'}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Response Time: {formatResponseTime(result.responseTime)}
                        </span>
                      </div>
                    </div>
                    {result.error && (
                      <p className="text-sm text-red-600 mt-2">{result.error}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Security & Input Validation Tests</h2>
            <Button onClick={() => runSingleTest('input')} disabled={isRunning}>
              Run Security Tests
            </Button>
          </div>

          {testResults.inputValidation && (
            <div className="grid gap-4">
              {Object.entries(testResults.inputValidation).map(([testName, result]: [string, any]) => (
                <Card key={testName}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(result.success)}
                      {testName.charAt(0).toUpperCase() + testName.slice(1)} Input Test
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Badge variant={result.success ? "default" : "destructive"}>
                          {result.success ? 'PASS' : 'FAIL'}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">
                          {formatResponseTime(result.responseTime)}
                        </span>
                      </div>
                      <div>
                        {result.tokenUsage && (
                          <span className="text-sm text-muted-foreground">
                            ~{result.tokenUsage} tokens
                          </span>
                        )}
                      </div>
                    </div>
                    {result.error && (
                      <p className="text-sm text-red-600 mt-2">{result.error}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Performance & Concurrency Tests</h2>
            <Button onClick={() => runSingleTest('concurrency')} disabled={isRunning}>
              Run Performance Tests
            </Button>
          </div>

          {testResults.concurrency && (
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Concurrency Test Results</CardTitle>
                  <CardDescription>
                    {testResults.concurrency.results.length} concurrent requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {(testResults.concurrency.successRate * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {formatResponseTime(testResults.concurrency.averageResponseTime)}
                      </div>
                      <p className="text-sm text-muted-foreground">Avg Time</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {testResults.concurrency.results.filter(r => r.success).length}/
                        {testResults.concurrency.results.length}
                      </div>
                      <p className="text-sm text-muted-foreground">Requests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <h2 className="text-xl font-semibold">Real-time Monitoring</h2>
          
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Requests (last hour):</span>
                    <Badge>{metrics.totalRequests}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <Badge variant={metrics.successRate > 0.9 ? "default" : "destructive"}>
                      {(metrics.successRate * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Response Time:</span>
                    <Badge>{formatResponseTime(metrics.averageResponseTime)}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Requests:</span>
                    <Badge>{metrics.activeRequests}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {metrics.recentErrors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Recent Errors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {metrics.recentErrors.map((error, index) => (
                      <div key={index} className="text-sm text-red-600 p-2 bg-red-50 rounded">
                        {error}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <h2 className="text-xl font-semibold">Testing Tools</h2>
          
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Validator</CardTitle>
                <CardDescription>Test input validation and security measures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <textarea 
                    className="w-full h-32 p-2 border rounded"
                    placeholder="Enter test input to validate..."
                    onBlur={(e) => {
                      const validation = SecurityValidator.validateInput(e.target.value);
                      console.log('Validation result:', validation);
                    }}
                  />
                  <p className="text-sm text-muted-foreground">
                    Check console for validation results
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rate Limiter Controls</CardTitle>
                <CardDescription>Manage and monitor rate limiting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={() => {
                      defaultRateLimiter.resetMetrics();
                      toast({ title: "Metrics Reset", description: "All metrics have been cleared" });
                    }}
                    variant="outline"
                  >
                    Reset Metrics
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Current limits: 20 requests/minute, 5 concurrent requests
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OpenAITestDashboard;