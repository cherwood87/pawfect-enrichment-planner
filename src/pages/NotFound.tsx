
import React from 'react';
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50 flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Decorative elements */}
        <div className="relative mb-8">
          <div className="absolute top-0 left-1/4 w-8 h-8 bg-purple-300 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-4 right-1/4 w-6 h-6 bg-cyan-300 rounded-full opacity-80 animate-pulse delay-300"></div>
          <div className="absolute bottom-0 left-1/3 w-4 h-4 bg-amber-300 rounded-full opacity-70 animate-pulse delay-500"></div>
        </div>

        <Card className="modern-card overflow-hidden">
          <CardContent className="p-12 bg-gradient-to-br from-white/90 to-purple-50/90 backdrop-blur-sm">
            {/* 404 Display */}
            <div className="mb-8">
              <h1 className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-purple-600 via-cyan-600 to-amber-600 bg-clip-text text-transparent mb-4">
                404
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 mx-auto rounded-full mb-6"></div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-purple-800 mb-4">
                Oops! Page Not Found
              </h2>
              <p className="text-xl text-gray-600 mb-6 max-w-md mx-auto">
                It looks like this page went on its own enrichment adventure and got lost!
              </p>
              <p className="text-sm text-purple-600 bg-purple-50 rounded-full px-4 py-2 inline-block">
                Path: <code className="font-mono">{location.pathname}</code>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/">
                <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Home className="w-5 h-5 mr-2" />
                  Return Home
                </Button>
              </Link>
              
              <Link to="/activity-library">
                <Button className="modern-button-outline px-8 py-3">
                  <Search className="w-5 h-5 mr-2" />
                  Go to Activity Library
                </Button>
              </Link>
            </div>

            {/* Helpful Links */}
            <div className="mt-8 pt-6 border-t border-purple-200">
              <p className="text-sm text-purple-600 mb-4 font-medium">
                Looking for something specific?
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link 
                  to="/activity-library" 
                  className="text-purple-600 hover:text-purple-800 underline underline-offset-4 hover:underline-offset-2 transition-all"
                >
                  Activity Library
                </Link>
                <Link 
                  to="/activity-library" 
                  className="text-cyan-600 hover:text-cyan-800 underline underline-offset-4 hover:underline-offset-2 transition-all"
                >
                  Activity Library
                </Link>
                <Link 
                  to="/coach" 
                  className="text-amber-600 hover:text-amber-800 underline underline-offset-4 hover:underline-offset-2 transition-all"
                >
                  AI Coach
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="mt-6">
          <Button 
            onClick={() => window.history.back()}
            variant="ghost"
            className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
