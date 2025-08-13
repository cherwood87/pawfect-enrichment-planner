
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Dog, Star, Brain, Target } from 'lucide-react';
import { useDog } from '@/contexts/DogContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Dog as DogType } from '@/types/dog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AddDogForm from '@/components/AddDogForm';
import EditDogForm from '@/components/EditDogForm';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import DogProfileDialogs from '@/components/profile/DogProfileDialogs';

const DogsTab = () => {
  const { state, currentDog, setCurrentDog, deleteDog } = useDog();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDog, setSelectedDog] = useState<DogType | null>(null);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [showRetakeConfirmation, setShowRetakeConfirmation] = useState(false);

  const handleSetCurrentDog = (dogId: string) => {
    setCurrentDog(dogId);
    toast({
      title: "Primary dog updated",
      description: "This dog is now your primary profile.",
    });
  };

  const handleEditDog = (dog: DogType) => {
    setSelectedDog(dog);
    setIsEditModalOpen(true);
  };

  const handleDeleteDog = (dog: DogType) => {
    setSelectedDog(dog);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDog) return;
    
    try {
      await deleteDog(selectedDog.id);
      setIsDeleteModalOpen(false);
      setSelectedDog(null);
      
      toast({
        title: "Dog profile deleted",
        description: `${selectedDog.name}'s profile has been successfully removed.`,
      });
    } catch (error) {
      console.error('Error deleting dog:', error);
      toast({
        title: "Error",
        description: "Failed to delete dog profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedDog(null);
  };

  const handleTakeQuiz = (dog: DogType) => {
    setCurrentDog(dog.id);
    navigate('/dog-profile-quiz');
  };

  const handleViewResults = (dog: DogType) => {
    setSelectedDog(dog);
    setShowQuizResults(true);
  };

  const handleRetakeQuiz = () => {
    setShowRetakeConfirmation(true);
  };

  const confirmRetakeQuiz = () => {
    if (selectedDog) {
      setCurrentDog(selectedDog.id);
      setShowRetakeConfirmation(false);
      setShowQuizResults(false);
      setSelectedDog(null);
      navigate('/dog-profile-quiz');
    }
  };

  const closeRetakeConfirmation = () => {
    setShowRetakeConfirmation(false);
  };

  const closeQuizResults = () => {
    setShowQuizResults(false);
    setSelectedDog(null);
  };

  const getActivityLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-blue-100 text-blue-700';
      case 'moderate': return 'bg-cyan-100 text-cyan-700';
      case 'high': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPillarName = (pillar: string) => {
    const names = {
      mental: 'Mental',
      physical: 'Physical', 
      social: 'Social',
      environmental: 'Environmental',
      instinctual: 'Instinctual'
    };
    return names[pillar as keyof typeof names] || pillar;
  };

  const renderQuizSummary = (dog: DogType) => {
    if (!dog.quizResults?.ranking) return null;
    
    const topTwoPillars = dog.quizResults.ranking.slice(0, 2);
    return (
      <div className="mt-2 text-xs text-gray-500 italic">
        Top Pillars: {topTwoPillars.map(p => getPillarName(p.pillar)).join(' and ')} Enrichment
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-purple-800">Your Dogs</h3>
          <p className="text-sm text-gray-600">Manage your dog profiles and settings</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          data-testid="add-dog-button"
          className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Dog
        </Button>
      </div>

      {/* Dogs List */}
      {state.dogs.length === 0 ? (
        <Card className="border border-purple-200 rounded-2xl bg-white/60 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Dog className="w-12 h-12 text-purple-300 mb-4" />
            <h3 className="text-lg font-semibold text-purple-800 mb-2">No dogs added yet</h3>
            <p className="text-gray-600 text-center mb-4">
              Add your first dog to start using the enrichment planner
            </p>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Dog
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {state.dogs.map((dog) => (
            <Card 
              key={dog.id} 
              className={`border-2 rounded-2xl bg-white/60 backdrop-blur-sm transition-all ${
                currentDog?.id === dog.id 
                  ? 'border-purple-300 bg-purple-50/80' 
                  : 'border-purple-200 hover:border-purple-300'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="w-16 h-16 border-2 border-white shadow-lg">
                      <AvatarImage 
                        src={dog.photo || dog.image} 
                        alt={`${dog.name}'s photo`}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white font-bold text-lg">
                        {dog.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {currentDog?.id === dog.id && (
                      <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                        <Star className="w-3 h-3 text-yellow-700 fill-current" />
                      </div>
                    )}
                  </div>

                  {/* Dog Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-purple-800 truncate">
                          {dog.name}
                        </h4>
                        <p className="text-sm text-gray-600">{dog.breed}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={`${getActivityLevelColor(dog.activityLevel)} rounded-xl text-xs`}>
                            {dog.activityLevel} activity
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {dog.age} {dog.age === 1 ? 'year' : 'years'} old
                          </span>
                        </div>
                        {renderQuizSummary(dog)}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {currentDog?.id !== dog.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetCurrentDog(dog.id)}
                            className="rounded-xl border-purple-300 text-purple-700 hover:bg-purple-100"
                          >
                            Make Primary
                          </Button>
                        )}
                        
                        {/* Quiz Button */}
                        {dog.quizResults ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewResults(dog)}
                            className="rounded-xl border-orange-300 text-orange-700 hover:bg-orange-100 flex items-center space-x-1"
                          >
                            <Brain className="w-3 h-3" />
                            <span>View Quiz Results</span>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTakeQuiz(dog)}
                            className="rounded-xl border-green-300 text-green-700 hover:bg-green-100 flex items-center space-x-1"
                          >
                            <Target className="w-3 h-3" />
                            <span>Take Personality Quiz</span>
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDog(dog)}
                          className="rounded-xl hover:bg-cyan-100"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {state.dogs.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDog(dog)}
                            className="rounded-xl hover:bg-red-100 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl">
          <div className="overflow-y-auto max-h-[80vh] p-4">
            <AddDogForm onClose={() => setIsAddModalOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <div className="overflow-y-auto max-h-[80vh] p-4">
            {selectedDog && (
              <EditDogForm 
                dog={selectedDog} 
                onClose={() => setIsEditModalOpen(false)} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Quiz Results Modal */}
      {selectedDog && (
        <DogProfileDialogs
          showQuiz={false}
          showResults={showQuizResults}
          currentDog={selectedDog}
          onQuizComplete={() => {}}
          onRetakeQuiz={handleRetakeQuiz}
          onCloseQuiz={() => {}}
          onCloseResults={closeQuizResults}
          setShowQuiz={() => {}}
          setShowResults={setShowQuizResults}
        />
      )}

      {/* Retake Quiz Confirmation */}
      <DeleteConfirmation
        isOpen={showRetakeConfirmation}
        onClose={closeRetakeConfirmation}
        onConfirm={confirmRetakeQuiz}
        title="Retake Personality Quiz"
        message={selectedDog ? `Are you sure you want to retake the personality quiz for ${selectedDog.name}? This will overwrite the existing results.` : ''}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Dog Profile"
        message={selectedDog ? `Are you sure you want to delete ${selectedDog.name}'s profile? This action cannot be undone and will remove all associated data.` : ''}
      />
    </div>
  );
};

export default DogsTab;
