import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing localStorage with React state synchronization
 * Note: For Claude.ai artifacts, this falls back to in-memory storage
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // In-memory fallback for environments without localStorage
  const [memoryStorage] = useState(() => new Map<string, string>());

  // Function to get stored value
  const getStoredValue = useCallback((): T => {
    try {
      // Check if localStorage is available
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } else {
        // Fallback to memory storage for Claude.ai artifacts
        const item = memoryStorage.get(key);
        return item ? JSON.parse(item) : initialValue;
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue, memoryStorage]);

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // Return a wrapped version of useState's setter function that persists the new value
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to storage
      const serializedValue = JSON.stringify(valueToStore);
      
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, serializedValue);
      } else {
        // Fallback to memory storage
        memoryStorage.set(key, serializedValue);
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, memoryStorage]);

  // Listen for changes in localStorage from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

/**
 * Hook for managing multiple localStorage values as a single object
 */
export function useLocalStorageState<T extends Record<string, any>>(
  key: string,
  initialState: T
): [T, (updates: Partial<T>) => void, () => void] {
  const [state, setState] = useLocalStorage(key, initialState);

  const updateState = useCallback((updates: Partial<T>) => {
    setState(prevState => ({ ...prevState, ...updates }));
  }, [setState]);

  const resetState = useCallback(() => {
    setState(initialState);
  }, [setState, initialState]);

  return [state, updateState, resetState];
}

/**
 * Hook for managing arrays in localStorage
 */
export function useLocalStorageArray<T>(
  key: string,
  initialValue: T[] = []
): [T[], (item: T) => void, (predicate: (item: T) => boolean) => void, () => void] {
  const [array, setArray] = useLocalStorage<T[]>(key, initialValue);

  const addItem = useCallback((item: T) => {
    setArray(prev => [...prev, item]);
  }, [setArray]);

  const removeItem = useCallback((predicate: (item: T) => boolean) => {
    setArray(prev => prev.filter(item => !predicate(item)));
  }, [setArray]);

  const clearArray = useCallback(() => {
    setArray([]);
  }, [setArray]);

  return [array, addItem, removeItem, clearArray];
}