
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MessageCircle, Brain, Target, Lightbulb, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDog } from '@/contexts/DogContext';
import ChatModal from '@/components/chat/ChatModal';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const Coach = () => {
  const navigate = useNavigate();
  const { currentDog } = useDog();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const handleStartChatting = () => {
    setIsChatModalOpen(true);
  };

  const handleChatModalClose = () => {
    setIsChatModalOpen(false);
  };

  const handleBackToDashboard = () => {
    navigate('/app');
  };

  const benefits = [
    {
      icon: Brain,
      title: "Personalized Advice",
      description: "Get tailored enrichment recommendations based on your dog's personality and activity history."
    },
    {
      icon: Target,
      title: "Goal-Oriented Support",
      description: "Receive guidance on achieving daily enrichment goals and balancing the five pillars."
    },
    {
      icon: Lightbulb,
      title: "Expert Insights",
      description: "Access professional enrichment knowledge and troubleshooting for behavioral challenges."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <DashboardHeader 
        onChatOpen={handleStartChatting} 
        onAddDogOpen={() => {}}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto mobile-container py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={handleBackToDashboard}
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Meet Your Enrichment Coach
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your AI-powered companion for creating the perfect enrichment plan. 
            Get personalized advice, activity suggestions, and expert guidance tailored to {currentDog?.name || "your dog"}'s unique needs.
          </p>

          <Button 
            onClick={handleStartChatting}
            size="lg" 
            className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-lg px-8 py-4"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Start Chatting with Your Coach
          </Button>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* What You Can Ask Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              What You Can Ask Your Coach
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Activity Planning</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• "What activities should I focus on today?"</li>
                  <li>• "How can I challenge my dog mentally?"</li>
                  <li>• "My dog seems bored, what can I do?"</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Behavioral Support</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• "How can I help my anxious dog?"</li>
                  <li>• "What social activities are best for my pup?"</li>
                  <li>• "How do I tire out a high-energy dog?"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-orange-50 border-blue-200">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-gray-600 mb-6">
                Your coach is available 24/7 and knows all about {currentDog?.name || "your dog"}'s personality and activity history.
              </p>
              <Button 
                onClick={handleStartChatting}
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Your Conversation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chat Modal */}
      <Dialog open={isChatModalOpen} onOpenChange={setIsChatModalOpen}>
        <DialogContent className="p-0 modal-standard">
          <DialogTitle className="sr-only">Enrichment Coach</DialogTitle>
          <DialogDescription className="sr-only">
            Chat with your AI enrichment coach for personalized advice and recommendations.
          </DialogDescription>
          <ChatModal 
            isOpen={isChatModalOpen}
            onClose={handleChatModalClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Coach;
