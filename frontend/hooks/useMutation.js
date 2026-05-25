"use client";

import { useCallback, useState } from "react";

import { normalizeApiError } from "../lib/api-errors";

export default function useMutation(mutationFunction) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const mutate = useCallback(
    async (...args) => {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const result = await mutationFunction(...args);

        return result;
      } catch (err) {
        const message = normalizeApiError(err);

        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [mutationFunction]
  );

  function setSuccessMessage(message) {
    setSuccess(message);
  }

  function reset() {
    setError("");
    setSuccess("");
    setLoading(false);
  }

  return {
    loading,
    error,
    success,
    mutate,
    setSuccessMessage,
    reset,
  };
}
