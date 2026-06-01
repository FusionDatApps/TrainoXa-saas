"use client";

import {
  useCallback,
  useMemo,
  useRef,
} from "react";

import { debounce } from "../lib/debounce";

export default function useDebouncedWorkoutSave({
  delay = 700,
  onSave,
}) {
  const previousPayloadRef =
    useRef("");

  const debouncedSave = useMemo(() => {
    return debounce(
      async (payload) => {
        try {
          const serializedPayload =
            JSON.stringify(
              payload
            );

          if (
            previousPayloadRef.current ===
            serializedPayload
          ) {
            return;
          }

          previousPayloadRef.current =
            serializedPayload;

          await onSave?.(payload);
        } catch (error) {
          console.error(
            "Autosave workout error:",
            error?.message ||
              error
          );
        }
      },
      delay
    );
  }, [delay, onSave]);

  const triggerSave =
    useCallback(
      (payload) => {
        debouncedSave(payload);
      },
      [debouncedSave]
    );

  return {
    triggerSave,
  };
}