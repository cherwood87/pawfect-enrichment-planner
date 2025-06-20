import { useEffect } from "react";
import { useLightweightMonitor } from "@/hooks/useLightweightMonitor";

export const useAppInitialization = () => {
  useLightweightMonitor("App");

  useEffect(() => {
    // Simple initialization without complex preloading
    if (process.env.NODE_ENV === "development") {
      console.log("🚀 App initialized with optimized performance");
    }
  }, []);

  return {};
};
