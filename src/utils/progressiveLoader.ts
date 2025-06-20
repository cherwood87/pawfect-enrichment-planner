interface LoadingStrategy {
  priority: "critical" | "high" | "medium" | "low";
  timing: "immediate" | "idle" | "interaction" | "viewport";
  component: () => Promise<any>;
}

class ProgressiveLoader {
  private loadQueue: Map<string, LoadingStrategy> = new Map();
  private loadedComponents = new Set<string>();
  private isIdle = false;

  constructor() {
    // Setup idle detection
    if (typeof window !== "undefined") {
      this.setupIdleDetection();
      this.setupIntersectionObserver();
    }
  }

  // Register a component for progressive loading
  register(id: string, strategy: LoadingStrategy) {
    this.loadQueue.set(id, strategy);

    // Load critical components immediately
    if (strategy.priority === "critical" && strategy.timing === "immediate") {
      this.loadComponent(id);
    }
  }

  // Load component based on strategy
  private async loadComponent(id: string) {
    if (this.loadedComponents.has(id)) return;

    const strategy = this.loadQueue.get(id);
    if (!strategy) return;

    try {
      this.loadedComponents.add(id);
      await strategy.component();
      console.log(`✅ Progressively loaded: ${id}`);
    } catch (error) {
      console.error(`❌ Failed to load: ${id}`, error);
      this.loadedComponents.delete(id); // Allow retry
    }
  }

  // Load components when browser is idle
  private setupIdleDetection() {
    const loadOnIdle = () => {
      this.isIdle = true;
      this.loadQueue.forEach((strategy, id) => {
        if (strategy.timing === "idle" && !this.loadedComponents.has(id)) {
          this.loadComponent(id);
        }
      });
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(loadOnIdle, { timeout: 5000 });
    } else {
      setTimeout(loadOnIdle, 1000);
    }
  }

  // Setup intersection observer for viewport-based loading
  private setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const componentId = entry.target.getAttribute(
              "data-progressive-load",
            );
            if (componentId) {
              this.loadComponent(componentId);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    // Expose observer for components to use
    (window as any).__progressiveLoadObserver = observer;
  }

  // Preload based on user interaction
  preloadOnInteraction(id: string, element: HTMLElement) {
    const strategy = this.loadQueue.get(id);
    if (!strategy || strategy.timing !== "interaction") return;

    const events = ["mouseenter", "focus", "touchstart"];
    const preload = () => {
      this.loadComponent(id);
      events.forEach((event) => element.removeEventListener(event, preload));
    };

    events.forEach((event) =>
      element.addEventListener(event, preload, { once: true }),
    );
  }

  // Get loading statistics
  getStats() {
    return {
      total: this.loadQueue.size,
      loaded: this.loadedComponents.size,
      pending: this.loadQueue.size - this.loadedComponents.size,
      loadedComponents: Array.from(this.loadedComponents),
    };
  }
}

export const progressiveLoader = new ProgressiveLoader();

// Register common components for progressive loading
export const registerProgressiveComponents = () => {
  // Critical components - load immediately
  progressiveLoader.register("dashboard-content", {
    priority: "critical",
    timing: "immediate",
    component: () => import("@/components/dashboard/DashboardContent"),
  });

  // High priority - load on idle
  progressiveLoader.register("activity-library", {
    priority: "high",
    timing: "idle",
    component: () => import("@/components/ActivityLibrary"),
  });

  progressiveLoader.register("weekly-planner", {
    priority: "high",
    timing: "idle",
    component: () => import("@/components/weekly-planner/WeeklyPlannerV2"),
  });

  // Medium priority - load on interaction
  progressiveLoader.register("chat-modal", {
    priority: "medium",
    timing: "interaction",
    component: () => import("@/components/chat/ChatModal"),
  });

  // Low priority - load on viewport
  progressiveLoader.register("educational-content", {
    priority: "low",
    timing: "viewport",
    component: () => import("@/components/EducationalContent"),
  });
};
