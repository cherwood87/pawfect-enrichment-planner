
import React from 'react';
import { usePillarOptions } from '@/hooks/usePillarOptions';
import SyncButton from '@/components/SyncButton';

interface PillarSelectionCardsProps {
  selectedPillar: string;
  onPillarSelect: (pillar: string) => void;
  onManualSync: () => Promise<void>;
  isSyncing: boolean;
  lastSyncTime: Date | null;
}

const PillarSelectionCards: React.FC<PillarSelectionCardsProps> = ({
  selectedPillar,
  onPillarSelect,
  onManualSync,
  isSyncing,
  lastSyncTime
}) => {
  const pillarOptions = usePillarOptions();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-800">Choose Your Enrichment Pillar</h2>
        <SyncButton
          onSync={onManualSync}
          isSyncing={isSyncing}
          lastSyncTime={lastSyncTime}
        />
      </div>
      
      <div className="mobile-grid mobile-gap">
        {pillarOptions.map(pillar => (
          <button
            key={pillar.id}
            onClick={() => onPillarSelect(pillar.id)}
            className={`
              border-2 rounded-3xl text-left transition-all duration-300 shadow-lg hover:shadow-xl
              bg-gradient-to-br ${pillar.gradient} ${pillar.borderColor}
              mobile-card cursor-pointer hover:-translate-y-2
              focus:outline-none focus:ring-4 focus:ring-purple-200
              ${selectedPillar === pillar.id ? "ring-4 ring-purple-400 ring-offset-2 scale-105 border-4" : ""}
              group
            `}
            tabIndex={0}
            aria-label={`Show activities for ${pillar.title}`}
          >
            <div className="font-bold text-lg mb-3 text-gray-900 group-hover:text-purple-800 transition-colors">
              {pillar.title}
            </div>
            <div className="text-gray-700 text-sm leading-relaxed">
              {pillar.description}
            </div>
          </button>
        ))}
        
        {/* All Pillars button */}
        <button
          onClick={() => onPillarSelect('all')}
          className={`
            border-2 rounded-3xl text-left transition-all duration-300 shadow-lg hover:shadow-xl
            bg-gradient-to-br from-gray-100 to-gray-50 border-gray-300 focus:ring-gray-400
            mobile-card cursor-pointer hover:-translate-y-2
            focus:outline-none focus:ring-4 focus:ring-gray-200
            ${selectedPillar === 'all' ? "ring-4 ring-gray-400 ring-offset-2 scale-105 border-4" : ""}
            group
          `}
          tabIndex={0}
          aria-label="Show all activities"
        >
          <div className="font-bold text-lg mb-3 text-gray-900 group-hover:text-gray-800 transition-colors">
            All Pillars
          </div>
          <div className="text-gray-700 text-sm leading-relaxed">
            Show every activity, regardless of pillar.
          </div>
        </button>
      </div>
    </div>
  );
};

export default PillarSelectionCards;
