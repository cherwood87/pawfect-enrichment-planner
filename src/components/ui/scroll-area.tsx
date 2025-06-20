import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

/**
 * A fully responsive ScrollArea component using Radix UI.
 * - Scrolls on all devices (mobile, desktop, touch, pointer, etc).
 * - Works for all layouts (pages, modals, popups, forms).
 * - You MUST set a height or max-height to enable scrolling.
 *   (e.g. className="max-h-[80vh]" or className="h-96")
 */

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn(
      // Ensures the area is relatively positioned and hides scrollbars outside viewport
      "relative w-full overflow-hidden",
      // You *must* set a height/max-h to enable scroll!
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport
      className={cn(
        // Always fill parent, enable smooth scrolling, and touch support
        "w-full h-full rounded-[inherit] scroll-smooth",
        // Support for mobile/touch devices
        "touch-pan-y overscroll-contain",
      )}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar orientation="vertical" />
    <ScrollBar orientation="horizontal" />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = "ScrollArea";

/**
 * Custom ScrollBar for both vertical and horizontal directions.
 */
const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical"
        ? "h-full w-2.5 border-l border-l-transparent p-[1px]"
        : "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border dark:bg-neutral-700" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = "ScrollBar";

export { ScrollArea, ScrollBar };
