import React, { createContext, useContext, useState, useCallback } from "react";

const MAX_COMPARE = 3;

interface CompareContextValue {
  compareIds: string[];
  addToCompare: (id: string) => { success: boolean; message: string };
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
  canAdd: boolean;
}

const CompareContext = createContext<CompareContextValue>({
  compareIds: [],
  addToCompare: () => ({ success: false, message: "" }),
  removeFromCompare: () => {},
  clearCompare: () => {},
  isInCompare: () => false,
  canAdd: true,
});

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const addToCompare = useCallback(
    (id: string): { success: boolean; message: string } => {
      if (compareIds.includes(id)) {
        return { success: false, message: "Already added to comparison." };
      }
      if (compareIds.length >= MAX_COMPARE) {
        return {
          success: false,
          message: `You can compare up to ${MAX_COMPARE} suppliers at a time.`,
        };
      }
      setCompareIds((prev) => [...prev, id]);
      return { success: true, message: "Added to comparison!" };
    },
    [compareIds],
  );

  const removeFromCompare = useCallback((id: string) => {
    setCompareIds((prev) => prev.filter((sid) => sid !== id));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
  }, []);

  const isInCompare = useCallback(
    (id: string) => compareIds.includes(id),
    [compareIds],
  );

  const canAdd = compareIds.length < MAX_COMPARE;

  return (
    <CompareContext.Provider
      value={{
        compareIds,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        canAdd,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
