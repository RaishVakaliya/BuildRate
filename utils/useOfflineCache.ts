import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "convex/react";
import type { FunctionReference, OptionalRestArgs } from "convex/server";

export function useOfflineCache<
  Query extends FunctionReference<"query">,
  Args extends OptionalRestArgs<Query>[0] | "skip" = OptionalRestArgs<Query>[0] | "skip"
>(
  query: Query,
  args: Args,
  cacheKey: string
): {
  data: Exclude<ReturnType<Query["_returnType"]>, undefined> | null;
  isLoading: boolean;
  isFromCache: boolean;
} {
  type T = Exclude<ReturnType<Query["_returnType"]>, undefined>;

  const [cachedData, setCachedData] = useState<T | null>(null);
  const [cacheLoaded, setCacheLoaded] = useState(false);
  const hasSavedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(cacheKey)
      .then((raw) => {
        if (!cancelled && raw) {
          try {
            setCachedData(JSON.parse(raw) as T);
          } catch {
          }
        }
      })
      .catch(() => {
      })
      .finally(() => {
        if (!cancelled) setCacheLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [cacheKey]);

  const liveData = useQuery(query, args as any) as T | undefined;

  useEffect(() => {
    hasSavedRef.current = false;
  }, [cacheKey]);

  useEffect(() => {
    if (liveData !== undefined && !hasSavedRef.current) {
      hasSavedRef.current = true;
      setCachedData(liveData);
      AsyncStorage.setItem(cacheKey, JSON.stringify(liveData)).catch(() => {
      });
    }
  }, [liveData, cacheKey]);

  const data = liveData !== undefined ? liveData : cachedData;
  const isLoading = !cacheLoaded || (data === null && liveData === undefined);
  const isFromCache = liveData === undefined && cachedData !== null;

  return { data, isLoading, isFromCache };
}
