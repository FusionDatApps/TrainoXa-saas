"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export default function useWorkoutAutosaveStatus() {
  const [autosaveState, setAutosaveState] =
    useState("idle");

  const timeoutRef = useRef(null);

  const clearAutosaveTimeout =
    useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }, []);

  const setTemporaryState =
    useCallback(
      (state, duration = 1200) => {
        clearAutosaveTimeout();

        setAutosaveState(state);

        timeoutRef.current =
          setTimeout(() => {
            setAutosaveState("idle");
          }, duration);
      },
      [clearAutosaveTimeout]
    );

  const markSaving = useCallback(() => {
    clearAutosaveTimeout();

    setAutosaveState("saving");
  }, [clearAutosaveTimeout]);

  const markSaved = useCallback(() => {
    setTemporaryState("saved", 1200);
  }, [setTemporaryState]);

  const markError = useCallback(() => {
    setTemporaryState("error", 2500);
  }, [setTemporaryState]);

  useEffect(() => {
    return () => {
      clearAutosaveTimeout();
    };
  }, [clearAutosaveTimeout]);

  return {
    autosaveState,
    markSaving,
    markSaved,
    markError,
  };
}