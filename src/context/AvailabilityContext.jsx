import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'hl.availability.v1';

const AvailabilityContext = createContext(null);

function readStored() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function AvailabilityProvider({ children }) {
  const [overrides, setOverrides] = useState(readStored);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  }, [overrides]);

  const isAvailable = useCallback(
    (dish) => overrides[dish.id] ?? dish.available,
    [overrides]
  );
  const getDishState = useCallback(
    (dish) => (dish ? { ...dish, available: isAvailable(dish) } : dish),
    [isAvailable]
  );
  const setAvailability = useCallback(
    (dishId, available) => setOverrides((current) => ({ ...current, [dishId]: available })),
    []
  );

  const value = useMemo(
    () => ({ getDishState, isAvailable, setAvailability }),
    [getDishState, isAvailable, setAvailability]
  );

  return <AvailabilityContext.Provider value={value}>{children}</AvailabilityContext.Provider>;
}

export function useAvailability() {
  const context = useContext(AvailabilityContext);
  if (!context) throw new Error('useAvailability must be used inside <AvailabilityProvider>');
  return context;
}
