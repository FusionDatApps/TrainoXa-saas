"use client";

import { useCallback, useMemo } from "react";

import { debounce } from "../lib/debounce";

export default function useDebouncedWorkoutSave({
  delay = 700,
  onSave,
}) {
  const debouncedSave = useMemo(() => {
    return debounce(async (payload) => {
      try {
        await onSave?.(payload);
      } catch (error) {
        console.error(
          "Autosave workout error:",
          error?.message || error
        );
      }
    }, delay);
  }, [delay, onSave]);

  const triggerSave = useCallback(
    (payload) => {
      debouncedSave(payload);
    },
    [debouncedSave]
  );

  return {
    triggerSave,
  };
}
