
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Check, AlertCircle } from 'lucide-react';
import { RealWebScrapingService } from '@/services/RealWebScrapingService';
import { useToast } from '@/hooks/use-toast';

interface ApiKeySetupProps {
  onComplete: () => void;
}

const ApiKeySetup = ({ onComplete }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const { toast } = useToast();

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) return;

    setIsValidating(true);
    try {
      RealWebScrapingService.saveApiKey(apiKey);
      setIsValid(true);
      
      toast({
        title: "API Key Saved",
        description: "Firecrawl API key configured successfully!",
      });
      
      setTimeout(() => {
        onComplete();
      }, 1000);
    } catch (error) {
      toast({
        title: "Invalid API Key",
        description: "Please check your Firecrawl API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const skipSetup = () => {
    toast({
      title: "Setup Skipped",
      description: "Using demo content. You can configure real scraping later.",
    });
    onComplete();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle>Setup Real Content Scraping</CardTitle>
          <CardDescription>
            Configure Firecrawl API to fetch real articles and resources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Get your free Firecrawl API key at{' '}
              <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                firecrawl.dev
              </a>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter your Firecrawl API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim() || isValidating}
              className="flex-1"
            >
              {isValidating ? (
                "Validating..."
              ) : isValid ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved!
                </>
              ) : (
                "Save & Continue"
              )}
            </Button>
            <Button variant="outline" onClick={skipSetup}>
              Skip for Now
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Without an API key, the Resource Hub will use demo content with placeholder links.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeySetup;
