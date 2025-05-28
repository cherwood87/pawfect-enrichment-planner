import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MessageCircle, Brain, Target, Lightbulb, ArrowLeft, Sparkles, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDog } from '@/contexts/DogContext';
import ChatModal from '@/components/chat/ChatModal';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
const Coach = () => {
  const navigate = useNavigate();
  const {
    currentDog
  } = useDog();
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
  const benefits = [{
    icon: Brain,
    title: "Personalized Advice",
    description: "Get tailored enrichment recommendations based on your dog's personality and activity history.",
    gradient: "from-purple-100 to-purple-50",
    iconColor: "text-purple-600"
  }, {
    icon: Target,
    title: "Goal-Oriented Support",
    description: "Receive guidance on achieving daily enrichment goals and balancing the five pillars.",
    gradient: "from-cyan-100 to-cyan-50",
    iconColor: "text-cyan-600"
  }, {
    icon: Lightbulb,
    title: "Expert Insights",
    description: "Access professional enrichment knowledge and troubleshooting for behavioral challenges.",
    gradient: "from-amber-100 to-amber-50",
    iconColor: "text-amber-600"
  }];
  return <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-amber-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b-2 border-purple-200">
        <div className="max-w-4xl mx-auto mobile-container py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleBackToDashboard} className="modern-button-outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-2 rounded-xl">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-purple-800">Enrichment Coach</h1>
              <p className="text-purple-600 text-center">Beyond Busy </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto mobile-container py-8 mobile-space-y">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-cyan-500 to-amber-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
            <MessageCircle className="w-12 h-12 text-white" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-700 via-cyan-600 to-amber-600 bg-clip-text text-transparent">
              Meet Your Enrichment Coach
            </h2>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your AI-powered companion for creating the perfect enrichment plan. 
              Get personalized advice, activity suggestions, and expert guidance tailored to {currentDog?.name || "your dog"}'s unique needs.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border-2 border-purple-200 shadow-lg">
            <Button onClick={handleStartChatting} size="lg" className="modern-button-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <MessageCircle className="w-6 h-6 mr-3" />
              Start Chatting with Your Coach
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mobile-grid mobile-gap">
          {benefits.map((benefit, index) => <Card key={index} className="modern-card hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <CardContent className="mobile-card space-y-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 border-2 border-purple-200`}>
                  <benefit.icon className={`w-8 h-8 ${benefit.iconColor}`} />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold text-purple-800">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </CardContent>
            </Card>)}
        </div>

        {/* What You Can Ask Section */}
        <Card className="modern-card">
          <CardContent className="mobile-card space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-purple-800">
                What You Can Ask Your Coach
              </h2>
              <p className="text-purple-600">Get expert guidance on every aspect of enrichment</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border-2 border-purple-200 space-y-3">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-purple-800">Activity Planning</h3>
                </div>
                <ul className="text-sm text-purple-700 space-y-2">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>"What activities should I focus on today?"</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>"How can I challenge my dog mentally?"</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>"My dog seems bored, what can I do?"</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-6 border-2 border-cyan-200 space-y-3">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-cyan-600" />
                  <h3 className="font-bold text-cyan-800">Behavioral Support</h3>
                </div>
                <ul className="text-sm text-cyan-700 space-y-2">
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>"How can I help my anxious dog?"</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>"What social activities are best for my pup?"</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>"How do I tire out a high-energy dog?"</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="modern-card bg-gradient-to-r from-purple-50 via-cyan-50 to-amber-50 border-2 border-purple-300">
          <CardContent className="mobile-card text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-cyan-600 bg-clip-text text-transparent">
                Ready to Get Started?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Your coach is available 24/7 and knows all about {currentDog?.name || "your dog"}'s personality and activity history.
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-purple-200">
              <Button onClick={handleStartChatting} size="lg" className="modern-button-primary shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Your Conversation
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Modal */}
      <Dialog open={isChatModalOpen} onOpenChange={setIsChatModalOpen}>
        <DialogContent className="p-0 modal-standard">
          <DialogTitle className="sr-only">Enrichment Coach</DialogTitle>
          <DialogDescription className="sr-only">
            Chat with your AI enrichment coach for personalized advice and recommendations.
          </DialogDescription>
          <ChatModal isOpen={isChatModalOpen} onClose={handleChatModalClose} />
        </DialogContent>
      </Dialog>
    </div>;
};
export default Coach;