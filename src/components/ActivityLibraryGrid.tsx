
import React, { memo, useMemo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import ActivityCard from './ActivityCard';
import { ActivityLibraryItem } from '@/types/activity';
import { DiscoveredActivity } from '@/types/discovery';
import { useBundleAnalytics } from '@/hooks/useBundleAnalytics';

interface ActivityLibraryGridProps {
  activities: (ActivityLibraryItem | DiscoveredActivity)[];
  onActivitySelect: (activity: ActivityLibraryItem | DiscoveredActivity) => void;
}

// Memoized grid cell component
const GridCell = memo<{
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    activities: (ActivityLibraryItem | DiscoveredActivity)[];
    onActivitySelect: (activity: ActivityLibraryItem | DiscoveredActivity) => void;
    columnsPerRow: number;
  };
}>(({ columnIndex, rowIndex, style, data }) => {
  const { activities, onActivitySelect, columnsPerRow } = data;
  const index = rowIndex * columnsPerRow + columnIndex;
  const activity = activities[index];

  if (!activity) {
    return <div style={style} />;
  }

  return (
    <div style={style} className="p-2">
      <ActivityCard
        activity={activity}
        onSelect={() => onActivitySelect(activity)}
      />
    </div>
  );
});

GridCell.displayName = 'GridCell';

const ActivityLibraryGrid: React.FC<ActivityLibraryGridProps> = ({
  activities,
  onActivitySelect
}) => {
  const { getMetrics } = useBundleAnalytics('ActivityLibraryGrid');

  // Memoize grid configuration based on screen size
  const gridConfig = useMemo(() => {
    const containerWidth = Math.min(window.innerWidth - 64, 1200); // Max width with padding
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;
    
    let columnsPerRow: number;
    let columnWidth: number;
    
    if (isMobile) {
      columnsPerRow = 1;
      columnWidth = containerWidth;
    } else if (isTablet) {
      columnsPerRow = 2;
      columnWidth = containerWidth / 2;
    } else {
      columnsPerRow = 3;
      columnWidth = containerWidth / 3;
    }

    const rowHeight = isMobile ? 200 : 220;
    const gridHeight = Math.min(600, Math.ceil(activities.length / columnsPerRow) * rowHeight);
    
    return {
      columnsPerRow,
      columnWidth,
      rowHeight,
      gridHeight,
      gridWidth: containerWidth,
      rowCount: Math.ceil(activities.length / columnsPerRow)
    };
  }, [activities.length]);

  // Memoize item data to prevent unnecessary re-renders
  const itemData = useMemo(() => ({
    activities,
    onActivitySelect,
    columnsPerRow: gridConfig.columnsPerRow
  }), [activities, onActivitySelect, gridConfig.columnsPerRow]);

  // Early return for empty state
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No activities available</p>
      </div>
    );
  }

  // Use virtualization for large grids (>15 items)
  if (activities.length > 15) {
    return (
      <div className="w-full">
        <Grid
          columnCount={gridConfig.columnsPerRow}
          columnWidth={gridConfig.columnWidth}
          height={gridConfig.gridHeight}
          width={gridConfig.gridWidth}
          rowCount={gridConfig.rowCount}
          rowHeight={gridConfig.rowHeight}
          itemData={itemData}
          className="rounded-lg"
        >
          {GridCell}
        </Grid>
      </div>
    );
  }

  // For smaller grids, use regular CSS grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onSelect={() => onActivitySelect(activity)}
        />
      ))}
    </div>
  );
};

export default memo(ActivityLibraryGrid);
