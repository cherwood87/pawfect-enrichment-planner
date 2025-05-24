
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronDown, Plus, Users } from 'lucide-react';
import { useDog } from '@/contexts/DogContext';
import AddDogForm from './AddDogForm';

const DogSelector = () => {
  const { state, currentDog, setCurrentDog } = useDog();
  const [showSelector, setShowSelector] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  if (state.dogs.length === 0) {
    return (
      <>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Dog
        </Button>
        
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="p-0 max-w-lg">
            <AddDogForm onClose={() => setShowAddForm(false)} />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          onClick={() => setShowSelector(true)}
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center">
            {currentDog?.image ? (
              <img 
                src={currentDog.image} 
                alt={currentDog.name} 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-lg">🐕</span>
            )}
          </div>
          <span className="font-medium">{currentDog?.name || 'Select Dog'}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
        
        {state.dogs.length > 1 && (
          <Badge variant="secondary" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            {state.dogs.length}
          </Badge>
        )}
      </div>

      {/* Dog Selector Dialog */}
      <Dialog open={showSelector} onOpenChange={setShowSelector}>
        <DialogContent className="p-4 max-w-md">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Select Dog</h3>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {state.dogs.map((dog) => (
                <Button
                  key={dog.id}
                  variant={dog.id === currentDog?.id ? "default" : "ghost"}
                  onClick={() => {
                    setCurrentDog(dog.id);
                    setShowSelector(false);
                  }}
                  className="w-full justify-start p-3 h-auto"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center">
                      {dog.image ? (
                        <img 
                          src={dog.image} 
                          alt={dog.name} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xl">🐕</span>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{dog.name}</div>
                      <div className="text-xs text-gray-600">
                        {dog.breed} • {dog.age} years
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            
            <Button 
              onClick={() => {
                setShowSelector(false);
                setShowAddForm(true);
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Dog
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Dog Form Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="p-0 max-w-lg">
          <AddDogForm onClose={() => setShowAddForm(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DogSelector;
