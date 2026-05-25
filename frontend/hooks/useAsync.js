"use client";

import { useCallback, useState } from "react";

import { normalizeApiError } from "../lib/api-errors";
import {
  REQUEST_STATUS,
  createInitialRequestState,
} from "../lib/request-state";

export default function useAsync(asyncFunction) {
  const [state, setState] = useState(
    createInitialRequestState()
  );

  const execute = useCallback(
    async (...args) => {
      setState((prev) => ({
        ...prev,
        status: REQUEST_STATUS.LOADING,
        loading: true,
        error: "",
      }));

      try {
        const data = await asyncFunction(...args);

        setState({
          status: REQUEST_STATUS.SUCCESS,
          loading: false,
          error: "",
          data,
        });

        return data;
      } catch (error) {
        const message = normalizeApiError(error);

        setState({
          status: REQUEST_STATUS.ERROR,
          loading: false,
          error: message,
          data: null,
        });

        throw error;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState(createInitialRequestState());
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
