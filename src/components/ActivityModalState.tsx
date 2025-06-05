
import { useState } from 'react';

export const useActivityModalState = (selectedPillar?: string | null) => {
  const [activeTab, setActiveTab] = useState('browse');
  
  // State for CreateCustomTab
  const [activityName, setActivityName] = useState('');
  const [pillar, setPillar] = useState(selectedPillar || '');
  const [duration, setDuration] = useState('');
  const [materials, setMaterials] = useState('');
  const [instructions, setInstructions] = useState('');
  const [description, setDescription] = useState('');
  
  // State for weekly scheduling
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<number>(new Date().getDay());

  const resetCustomActivityForm = () => {
    setActivityName('');
    setPillar(selectedPillar || '');
    setDuration('');
    setMaterials('');
    setInstructions('');
    setDescription('');
  };

  return {
    activeTab,
    setActiveTab,
    activityName,
    setActivityName,
    pillar,
    setPillar,
    duration,
    setDuration,
    materials,
    setMaterials,
    instructions,
    setInstructions,
    description,
    setDescription,
    selectedDayOfWeek,
    setSelectedDayOfWeek,
    resetCustomActivityForm
  };
};
