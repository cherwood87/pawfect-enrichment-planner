import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface SmartNavigationButtonProps {
  to: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  preserveModalState?: boolean;
  onClick?: () => void;
}

/**
 * Smart navigation button that handles navigation properly
 */
export const SmartNavigationButton: React.FC<SmartNavigationButtonProps> = ({
  to,
  children,
  icon: Icon,
  variant = 'default',
  size = 'default',
  className = '',
  onClick
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (onClick) {
      onClick();
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