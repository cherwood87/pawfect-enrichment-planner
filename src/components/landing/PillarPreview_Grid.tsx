import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Zap, Star } from 'lucide-react';
const PillarPreview_Grid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
        <CardContent className="p-6 text-center">
          <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Mental</h3>
          <p className="text-muted-foreground text-sm">Puzzle games, training, and brain challenges</p>
        </CardContent>
      </Card>
      
      <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
        <CardContent className="p-6 text-center">
          <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Physical</h3>
          <p className="text-muted-foreground text-sm">Exercise, walks, and movement activities</p>
        </CardContent>
      </Card>
      
      <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
        <CardContent className="p-6 text-center">
          <Star className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Social</h3>
          <p className="text-muted-foreground text-sm">Interaction with people and other dogs</p>
        </CardContent>
      </Card>
    </div>
  );
};
export default PillarPreview_Grid;