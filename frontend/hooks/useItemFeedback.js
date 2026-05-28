"use client";

import { useCallback, useMemo, useState } from "react";

const INITIAL_STATE = {
  type: null,
  message: "",
};

export default function useItemFeedback(initialValue = INITIAL_STATE) {
  const [feedback, setFeedback] = useState(initialValue);

  const clearFeedback = useCallback(() => {
    setFeedback(INITIAL_STATE);
  }, []);

  const setSuccess = useCallback((message) => {
    setFeedback({
      type: "success",
      message,
    });
  }, []);

  const setError = useCallback((message) => {
    setFeedback({
      type: "error",
      message,
    });
  }, []);

  const setInfo = useCallback((message) => {
    setFeedback({
      type: "info",
      message,
    });
  }, []);

  const hasFeedback = useMemo(() => {
    return Boolean(feedback?.message);
  }, [feedback]);

  return {
    feedback,
    hasFeedback,
    clearFeedback,
    setSuccess,
    setError,
    setInfo,
  };
}