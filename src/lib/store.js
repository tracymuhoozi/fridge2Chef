import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'fridge2chef:saved';
const Ctx = createContext(null);

export function SavedProvider({ children }) {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((v) => v && setSaved(JSON.parse(v)))
      .catch(() => {});
  }, []);

  const persist = (next) => {
    setSaved(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  };

  const isSaved = useCallback((id) => saved.some((r) => r.id === id), [saved]);

  const toggleSave = useCallback(
    (recipe) => {
      persist(
        saved.some((r) => r.id === recipe.id)
          ? saved.filter((r) => r.id !== recipe.id)
          : [recipe, ...saved]
      );
    },
    [saved]
  );

  return <Ctx.Provider value={{ saved, isSaved, toggleSave }}>{children}</Ctx.Provider>;
}

export const useSaved = () => useContext(Ctx);
