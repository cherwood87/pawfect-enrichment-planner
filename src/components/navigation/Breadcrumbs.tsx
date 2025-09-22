import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbs, BreadcrumbItem } from '@/utils/routeUtils';

interface BreadcrumbsProps {
  dogName?: string;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  dogName,
  className = "mb-6"
}) => {
  const location = useLocation();
  const breadcrumbs = generateBreadcrumbs(location, dogName);

  // Don't show breadcrumbs for home page or if only one item
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-2 text-sm text-muted-foreground ${className}`} aria-label="Breadcrumb">
      {breadcrumbs.map((item: BreadcrumbItem, index: number) => (
        <React.Fragment key={item.path}>
          {index === 0 ? (
            <Link 
              to={item.path}
              className="flex items-center hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
              {item.isCurrentPage ? (
                <span className="text-foreground font-medium">
                  {item.label}
                </span>
              ) : (
                <Link 
                  to={item.path}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;