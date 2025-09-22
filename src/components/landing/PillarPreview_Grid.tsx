import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Zap, Star } from 'lucide-react';
const PillarPreview_Grid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6 text-center">
          <Lightbulb className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Mental Enrichment</h3>
          <p className="text-muted-foreground">Puzzle toys, training, and brain games that challenge your dog's mind</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 text-center">
          <Zap className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Physical Activity</h3>
          <p className="text-muted-foreground">Exercise and movement to keep your dog healthy and happy</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 text-center">
          <Star className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Social Interaction</h3>
          <p className="text-muted-foreground">Bonding activities and socialization for well-rounded development</p>
        </CardContent>
      </Card>
    </div>
  );
};
export default PillarPreview_Grid;