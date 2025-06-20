import { useState, useEffect } from "react";
import {
  NetworkHealthService,
  NetworkHealthState,
} from "@/services/network/NetworkHealthService";

export const useNetworkHealth = () => {
  const [healthState, setHealthState] = useState<NetworkHealthState>(() =>
    NetworkHealthService.getInstance().getHealthState(),
  );
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    const service = NetworkHealthService.getInstance();

    const unsubscribe = service.subscribe((state) => {
      setHealthState(state);
    });

    return unsubscribe;
  }, []);

  const retryConnection = async () => {
    setIsRecovering(true);
    try {
      const result = await NetworkHealthService.getInstance().retryConnection();
      return result;
    } finally {
      setIsRecovering(false);
    }
  };

  const initiateRecovery = async () => {
    setIsRecovering(true);
    try {
      const result =
        await NetworkHealthService.getInstance().initiateRecovery();
      return result;
    } finally {
      setIsRecovering(false);
    }
  };

  return {
    ...healthState,
    isRecovering,
    retryConnection,
    initiateRecovery,
    canRetry: healthState.connectionStability > 0.3, // Allow retry if stability is reasonable
  };
};
