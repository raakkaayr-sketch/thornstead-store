'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = 'hainholt:recently-viewed';
const MAX_ITEMS = 6;

interface RecentlyViewedContextValue {
  ids: string[];
  hydrated: boolean;
  add: (id: string) => void;
  clear: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(
  null
);

export function RecentlyViewedProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, [ids, hydrated]);

  const add = useCallback((id: string) => {
    setIds((prev) => {
      if (prev[0] === id) return prev;
      return [id, ...prev.filter((x) => x !== id)].slice(0, MAX_ITEMS);
    });
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const value = useMemo(
    () => ({ ids, hydrated, add, clear }),
    [ids, hydrated, add, clear]
  );

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx)
    throw new Error(
      'useRecentlyViewed must be used within RecentlyViewedProvider'
    );
  return ctx;
}
