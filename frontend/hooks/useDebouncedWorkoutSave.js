"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { debounce } from "../lib/debounce";

export default function useDebouncedWorkoutSave({
  delay = 700,
  onSave,
}) {
  const isMountedRef = useRef(true);
  const previousPayloadRef = useRef("");

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const debouncedSave = useMemo(() => {
    return debounce(
      async (payload) => {
        if (!isMountedRef.current) {
          return;
        }

        try {
          const serializedPayload = JSON.stringify(payload);

          if (previousPayloadRef.current === serializedPayload) {
            return;
          }

          previousPayloadRef.current = serializedPayload;

          if (!isMountedRef.current) {
            return;
          }

          await onSave?.(payload);
        } catch (error) {
          if (!isMountedRef.current) {
            return;
          }

          console.error(
            "Autosave workout error:",
            error?.message || error
          );
        }
      },
      delay
    );
  }, [delay, onSave]);

  const triggerSave = useCallback(
    (payload) => {
      if (!isMountedRef.current) {
        return;
      }

      debouncedSave(payload);
    },
    [debouncedSave]
  );

  const cancelSave = useCallback(() => {
    debouncedSave.cancel?.();
  }, [debouncedSave]);

  useEffect(() => {
    return () => {
      debouncedSave.cancel?.();
    };
  }, [debouncedSave]);

  return {
    triggerSave,
    cancelSave,
  };
}