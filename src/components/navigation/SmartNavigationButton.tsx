import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useActivityModalPersistence } from '@/hooks/useActivityModalPersistence';
import { LucideIcon } from 'lucide-react';

interface SmartNavigationButtonProps {
  to: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  preserveModalState?: boolean;
  modalOptions?: {
    selectedPillar?: string | null;
    selectedDay?: number;
    activeTab?: string;
  };
  onClick?: () => void;
}

/**
 * Smart navigation button that preserves modal state and handles navigation properly
 * Ensures users don't lose their progress when navigating between pages
 */
export const SmartNavigationButton: React.FC<SmartNavigationButtonProps> = ({
  to,
  children,
  icon: Icon,
  variant = 'default',
  size = 'default',
  className = '',
  preserveModalState = false,
  modalOptions,
  onClick
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openModal } = useActivityModalPersistence();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    // If we're preserving modal state, set it up
    if (preserveModalState && modalOptions) {
      openModal(
        modalOptions.selectedPillar,
        modalOptions.selectedDay,
        modalOptions.activeTab
      );
    }

    // Navigate to destination
    if (to !== location.pathname) {
      navigate(to);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  );
};