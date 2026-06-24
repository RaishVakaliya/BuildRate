import { useState, useEffect } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let active = true;
    let fallbackInterval: any = null;

    const checkActualConnection = async (): Promise<boolean> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        await fetch("https://clients3.google.com/generate_204", {
          method: "GET",
          signal: controller.signal,
          cache: "no-store",
        });
        clearTimeout(timeoutId);
        return true;
      } catch {
        return false;
      }
    };

    const updateState = async (state: NetInfoState) => {
      const netInfoConnected = state.isConnected !== false;
      
      if (netInfoConnected) {
        if (active) {
          setIsOnline(true);
        }
        if (fallbackInterval) {
          clearInterval(fallbackInterval);
          fallbackInterval = null;
        }
      } else {
        const actualOnline = await checkActualConnection();
        if (active) {
          setIsOnline(actualOnline);
        }
        
        if (!actualOnline) {
          if (!fallbackInterval) {
            fallbackInterval = setInterval(async () => {
              const onlineNow = await checkActualConnection();
              if (active) {
                setIsOnline(onlineNow);
              }
              if (onlineNow && fallbackInterval) {
                clearInterval(fallbackInterval);
                fallbackInterval = null;
              }
            }, 10000);
          }
        } else {
          if (fallbackInterval) {
            clearInterval(fallbackInterval);
            fallbackInterval = null;
          }
        }
      }
    };

    let unsubscribe: (() => void) | null = null;

    try {
      NetInfo.fetch().then((state) => {
        if (active) {
          updateState(state);
        }
      }).catch(() => {
        if (fallbackInterval === null) {
          fallbackInterval = setInterval(async () => {
            const online = await checkActualConnection();
            if (active) setIsOnline(online);
          }, 10000);
        }
      });

      unsubscribe = NetInfo.addEventListener((state) => {
        if (active) {
          updateState(state);
        }
      });
    } catch {
      if (fallbackInterval === null) {
        fallbackInterval = setInterval(async () => {
          const online = await checkActualConnection();
          if (active) setIsOnline(online);
        }, 10000);
      }
    }

    return () => {
      active = false;
      if (unsubscribe) {
        unsubscribe();
      }
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
      }
    };
  }, []);

  return { isOnline };
}
