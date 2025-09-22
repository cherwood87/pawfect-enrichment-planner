import { Location } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path: string;
  isCurrentPage?: boolean;
}

export const generateBreadcrumbs = (location: Location, dogName?: string): BreadcrumbItem[] => {
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' }
  ];

  let currentPath = '';
  
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    currentPath += `/${segment}`;
    const isLast = i === pathSegments.length - 1;
    
    let label = '';
    let path = currentPath;
    
    switch (segment) {
      case 'settings':
        label = 'Settings';
        break;
      case 'dogs':
        if (pathSegments[i + 1] && pathSegments[i + 1] !== 'quiz') {
          // Skip the dogs segment, we'll handle it with the ID
          continue;
        }
        label = 'Dogs';
        break;
      case 'quiz':
        label = 'Personality Quiz';
        break;
      case 'activity-library':
        label = 'Activity Library';
        break;
      case 'coach':
        label = 'AI Coach';
        break;
      case 'weekly-planner':
        label = 'Weekly Planner';
        break;
      case 'app':
        label = 'Dashboard';
        break;
      case 'auth':
        label = 'Sign In';
        break;
      case 'subscribe':
        label = 'Subscribe';
        break;
      default:
        // Handle dynamic segments (like dog IDs)
        if (pathSegments[i - 1] === 'dogs') {
          label = dogName || 'Dog Profile';
          path = currentPath.replace('/quiz', ''); // For quiz routes, link to dog profile
        } else {
          label = segment.charAt(0).toUpperCase() + segment.slice(1);
        }
        break;
    }
    
    if (label) {
      breadcrumbs.push({
        label,
        path: isLast ? location.pathname : path,
        isCurrentPage: isLast
      });
    }
  }

  return breadcrumbs;
};

export const getPageTitle = (location: Location, dogName?: string): string => {
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  if (pathSegments.length === 0) return 'Home';
  
  const lastSegment = pathSegments[pathSegments.length - 1];
  
  switch (lastSegment) {
    case 'settings':
      return 'Settings';
    case 'activity-library':
      return 'Activity Library';
    case 'coach':
      return 'AI Coach';
    case 'weekly-planner':
      return 'Weekly Planner';
    case 'app':
      return 'Dashboard';
    case 'quiz':
      return dogName ? `${dogName}'s Personality Quiz` : 'Personality Quiz';
    default:
      if (pathSegments[pathSegments.length - 2] === 'dogs') {
        return dogName ? `${dogName}'s Profile` : 'Dog Profile';
      }
      return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  }
};