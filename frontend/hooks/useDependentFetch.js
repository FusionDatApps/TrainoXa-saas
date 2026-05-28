"use client";

import { useCallback, useEffect, useState } from "react";

export default function useDependentFetch(
  dependency,
  fetcher,
  options = {}
) {
  const {
    initialData = null,
    resetOnEmpty = true,
  } = options;

  const [data, setData] =
    useState(initialData);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const execute = useCallback(async () => {
    if (!dependency) {
      if (resetOnEmpty) {
        setData(initialData);
      }

      setError("");
      setLoading(false);

      return initialData;
    }

    setLoading(true);
    setError("");

    try {
      const result = await fetcher(
        dependency
      );

      setData(result);

      return result;
    } catch (err) {
      const message =
        err?.message ||
        "Ocurrió un error inesperado.";

      setError(message);

      if (resetOnEmpty) {
        setData(initialData);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [
    dependency,
    fetcher,
    initialData,
    resetOnEmpty,
  ]);

  useEffect(() => {
    execute();
  }, [execute]);

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
}