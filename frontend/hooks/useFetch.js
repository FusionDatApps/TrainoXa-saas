"use client";

import { useCallback, useEffect, useState } from "react";

import { apiFetch } from "../lib/api";
import { normalizeApiError } from "../lib/api-errors";

export default function useFetch(path, options = {}) {
  const {
    immediate = true,
    initialData = null,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch(path);

      const nextData = response.data ?? response;

      setData(nextData);

      return nextData;
    } catch (err) {
      const message = normalizeApiError(err);

      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    if (immediate && path) {
      refetch();
    }
  }, [immediate, path, refetch]);

  return {
    data,
    setData,
    loading,
    error,
    refetch,
  };
}
